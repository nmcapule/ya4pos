package wrappers

import (
	"time"

	"github.com/pocketbase/pocketbase/models"
)

// Transfer is a wrapper for a transfer record.
type Transfer struct {
	models.BaseModel

	Transaction string    `db:"transaction" json:"transaction"`
	From        string    `db:"from" json:"from"`
	Into        string    `db:"into" json:"into"`
	Overhead    float64   `db:"overhead" json:"overhead"`
	Description string    `db:"description" json:"description"`
	Committed   bool      `db:"committed" json:"committed"`
	Scheduled   time.Time `db:"scheduled" json:"scheduled"`
}

func (t *Transfer) TableName() string {
	return "transfers"
}

// TransferItem is a wrapper for a transfer item record.
type TransferItem struct {
	models.BaseModel

	Transfer   string  `db:"transfer" json:"transfer"`
	Item       string  `db:"item" json:"item"`
	Quantity   int     `db:"quantity" json:"quantity"`
	Unit       string  `db:"unit" json:"unit"`
	UnitPrice  float64 `db:"unitPrice" json:"unitPrice"`
	TotalPrice float64 `db:"totalPrice" json:"totalPrice"`
}

func (t *TransferItem) TableName() string {
	return "transfer_items"
}
