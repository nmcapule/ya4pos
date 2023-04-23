package inventory

import (
	"errors"
	"fmt"

	"github.com/nmcapule/ya4pos/utils"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
)

// ErrInsufficientStocks is returned when there are insufficient stocks.
var ErrInsufficientStocks = errors.New("insufficient warehouse item stocks")

// ErrTransferAlreadyCommitted is returned when the transfer is already committed.
var ErrTransferAlreadyCommitted = errors.New("transfer already committed")

// TransferManager is a utility for drafting and committing a transfer.
type TransferManager struct {
	dao       *daos.Dao
	converter *utils.UnitConverter
}

// NewTransferManager creates a new stocks manager.
func NewTransferManager(dao *daos.Dao) (*TransferManager, error) {
	converter, err := utils.NewUnitConverter(dao)
	if err != nil {
		return nil, fmt.Errorf("failed to create unit converter: %w", err)
	}
	return &TransferManager{
		dao:       dao,
		converter: converter,
	}, nil
}

// validate checks if the given item is available in the given quantity in the
// specified warehouse.
func (sm *TransferManager) validate(transfer, transferItem *models.Record) error {
	stocks, err := sm.dao.FindRecordsByExpr("warehouse_stocks", dbx.HashExp{
		"warehouse": transfer.GetString("from"),
		"item":      transferItem.GetString("item"),
	})
	if err != nil {
		return fmt.Errorf("failed to get warehouse stock: %w", err)
	}

	remaining := transferItem.GetFloat("quantity")
	for _, stock := range stocks {
		existing, err := sm.converter.Convert(stock.GetFloat("quantity"), stock.GetString("unit"), transferItem.GetString("unit"))
		if err != nil {
			return fmt.Errorf("failed to convert unit: %w", err)
		}
		remaining -= existing
		if remaining <= 0 {
			return nil
		}
	}
	return ErrInsufficientStocks
}

// Applies the given transfer item to the warehouse stocks.
func (sm *TransferManager) apply(transfer, transferItem *models.Record) error {
	transferUnitID := transferItem.GetString("unit")

	// Get all the stocks of the specified item in the source warehouse.
	stocks, err := sm.dao.FindRecordsByExpr("warehouse_stocks", dbx.HashExp{
		"warehouse": transfer.GetString("from"),
		"item":      transferItem.GetString("item"),
	})
	if err != nil {
		return fmt.Errorf("failed to get warehouse stock: %w", err)
	}

	// Stock that needs to be transferred, in the transfer unit.
	remaining := transferItem.GetFloat("quantity")
	// For each stock, consume the stock until the remaining transfer is zero.
	for _, stock := range stocks {
		stockUnitID := stock.GetString("unit")

		// Compute existing stock into the transfer unit.
		existing, err := sm.converter.Convert(stock.GetFloat("quantity"), stockUnitID, transferUnitID)
		if err != nil {
			return fmt.Errorf("failed to convert unit: %w", err)
		}

		var quantityToTransfer float64
		// If the existing stock is greater than the remaining transfer, then
		// update the existing stock. Otherwise, delete the existing stock.
		if existing > remaining {
			// Convert the needed quantity to stock's unit.
			subtrahend, err := sm.converter.Convert(remaining, transferUnitID, stockUnitID)
			if err != nil {
				return fmt.Errorf("converting to original unit: %w", err)
			}
			// Update the existing stock.
			stock.Set("quantity", existing-subtrahend)
			if err := sm.dao.SaveRecord(stock); err != nil {
				return fmt.Errorf("failed to save record: %w", err)
			}
			// Set quantity to be transferred.
			quantityToTransfer = subtrahend
		} else {
			// Delete the existing stock.
			if err := sm.dao.DeleteRecord(stock); err != nil {
				return fmt.Errorf("failed to delete record: %w", err)
			}
		}

		// Create a new stock in the target warehouse.
		if transfer.GetString("into") != "" {
			// Let's reuse the stock variable for the new stock.
			stock.SetId("")
			stock.MarkAsNew()
			stock.Set("warehouse", transfer.GetString("into"))
			stock.Set("quantity", quantityToTransfer)
			if err := sm.dao.SaveRecord(stock); err != nil {
				return fmt.Errorf("failed to stock in the target warehouse: %w", err)
			}
		}

		// Update the remaining transfer.
		remaining -= existing
		if remaining <= 0 {
			return nil
		}
	}
	return ErrInsufficientStocks
}

// Commit commits the given transfer.
func (sm *TransferManager) Commit(transferID string) error {
	transfer, err := sm.dao.FindRecordById("transfers", transferID)
	if err != nil {
		return fmt.Errorf("failed to find transfer record: %w", err)
	}
	if transfer.GetBool("committed") {
		return ErrTransferAlreadyCommitted
	}

	// Get the transfer items.
	items, err := sm.dao.FindRecordsByExpr("transfer_items", dbx.HashExp{
		"transfer": transferID,
	})
	if err != nil {
		return fmt.Errorf("failed to find transfer items: %w", err)
	}
	for _, item := range items {
		err := sm.validate(transfer, item)
		if err != nil {
			return fmt.Errorf("validating transfer of %q: %w", item.GetString("item"), err)
		}
		if err := sm.apply(transfer, item); err != nil {
			return fmt.Errorf("applying transfer of %q: %w", item.GetString("item"), err)
		}

		// Commit the transfer.
		transfer.Set("committed", true)
		if err := sm.dao.SaveRecord(transfer); err != nil {
			return fmt.Errorf("committing the transfer: %w", err)
		}
	}

	return nil
}
