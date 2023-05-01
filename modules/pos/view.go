// Package pos contains views for the pos module.
package pos

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/nmcapule/ya4pos/modules"
	"github.com/nmcapule/ya4pos/modules/inventory"
	"github.com/nmcapule/ya4pos/wrappers"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/daos"
)

// WarehouseOrders is the data structure for the warehouse orders.
type WarehouseOrders struct {
	WarehouseID        string `json:"warehouse"`
	AccountingEntityID string `json:"accounting_entity"`
	Orders             []struct {
		Stock    string `json:"stock"`
		Quantity int    `json:"quantity"`
	} `json:"orders"`
}

// View is the view for the pos module.
type View struct {
	App *pocketbase.PocketBase
}

// Hook registers the view's routes to the provided group.
func (v *View) Hook(g *echo.Group) error {
	g.AddRoute(echo.Route{
		Method: http.MethodGet,
		Path:   "",
		Handler: func(c echo.Context) error {
			return c.Render(http.StatusOK, "pos/index.html", modules.BaseConfig{})
		},
	})
	g.AddRoute(echo.Route{
		Method: http.MethodGet,
		Path:   "/:warehouseId",
		Handler: func(c echo.Context) error {
			return c.Render(http.StatusOK, "pos/pos2.html", struct {
				modules.BaseConfig
				WarehouseID string
			}{
				WarehouseID: c.PathParam("warehouseId"),
			})
		},
	})
	g.AddRoute(echo.Route{
		Method:  http.MethodPost,
		Path:    "/review",
		Handler: v.HandleReview,
	})
	g.AddRoute(echo.Route{
		Method:  http.MethodPost,
		Path:    "/checkout",
		Handler: v.HandleCheckout,
	})
	return nil
}

// Checks if the warehouse orders is valid and feasible.
func (v *View) validateOrders() error {
	return nil
}

func (v *View) HandleReview(c echo.Context) error {
	c.Request().ParseForm()
	var data struct {
		modules.BaseConfig
		WarehouseOrders
	}
	if err := json.Unmarshal([]byte(c.FormValue("body")), &data); err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	return c.Render(http.StatusOK, "pos/review.html", data)
}

func (v *View) HandleCheckout(c echo.Context) error {
	c.Request().ParseForm()
	var data struct {
		modules.BaseConfig
		WarehouseOrders
	}
	if err := json.Unmarshal([]byte(c.FormValue("body")), &data); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	if err := v.App.Dao().RunInTransaction(func(tx *daos.Dao) error {
		// Create accounting transaction.
		transaction := &wrappers.Transaction{
			Into:        data.AccountingEntityID,
			Description: "POS Transaction",
		}
		if err := tx.Save(transaction); err != nil {
			return fmt.Errorf("failed to create accounting transaction: %w", err)
		}

		// Create transfer record.
		transfer := &wrappers.Transfer{
			Transaction: transaction.GetId(),
			From:        data.WarehouseID,
			Description: "Customer Purchase",
			Committed:   false,
			Scheduled:   time.Now(),
		}
		if err := tx.Save(transfer); err != nil {
			return fmt.Errorf("failed to create transfer record: %w", err)
		}

		// Create transfer item records.
		for _, order := range data.Orders {
			stock, err := tx.FindRecordById("warehouse_stocks", order.Stock)
			if err != nil {
				return fmt.Errorf("failed to find record: %w", err)
			}
			item := &wrappers.TransferItem{
				Transfer:   transfer.GetId(),
				Item:       order.Stock,
				Quantity:   order.Quantity,
				Unit:       stock.GetString("unit"),
				UnitPrice:  stock.GetFloat("unitPrice"),
				TotalPrice: stock.GetFloat("unitPrice") * float64(order.Quantity),
			}
			if err := tx.Save(item); err != nil {
				return fmt.Errorf("failed to create transfer item record: %w", err)
			}
			// Add amount to accounting transaction.
			transaction.Amount += item.TotalPrice
		}

		// Save the accounting transaction again, now with the total amount.
		if err := tx.Save(transaction); err != nil {
			return fmt.Errorf("failed to update accounting transaction amount: %w", err)
		}

		// Apply transfers.
		tm, err := inventory.NewTransferManager(tx)
		if err != nil {
			return fmt.Errorf("failed to create transfer manager: %w", err)
		}
		return tm.Commit(transfer.GetId())
	}); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}

	return c.Render(http.StatusOK, "pos/checkout.html", data)
}
