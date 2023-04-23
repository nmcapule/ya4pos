package wrappers

import (
	"time"

	"github.com/pocketbase/pocketbase/models"
)

type Warehouse struct {
	models.BaseModel

	AccountingEntity string `db:"accounting_entity" json:"accounting_entity"`
	Label            string `db:"label" json:"label"`
	Deleted          bool   `db:"deleted" json:"deleted"`
}

func (w *Warehouse) TableName() string {
	return "warehouses"
}

type WarehouseStock struct {
	models.BaseModel

	Warehouse string    `db:"warehouse" json:"warehouse"`
	Item      string    `db:"item" json:"item"`
	Quantity  int       `db:"quantity" json:"quantity"`
	Unit      string    `db:"unit" json:"unit"`
	UnitPrice float64   `db:"unit_price" json:"unit_price"`
	Virtual   bool      `db:"virtual" json:"virtual"`
	Sellable  bool      `db:"sellable" json:"sellable"`
	Expires   time.Time `db:"expires" json:"expires"`
}

func (w *WarehouseStock) TableName() string {
	return "warehouse_stock"
}
