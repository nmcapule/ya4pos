package wrappers

import "github.com/pocketbase/pocketbase/models"

type Unit struct {
	models.BaseModel

	Label      string `db:"label" json:"label"`
	ShortLabel string `db:"shortlabel" json:"shortlabel"`
	Standard   bool   `db:"standard" json:"standard"`
}

func (u *Unit) TableName() string {
	return "units"
}

type UnitConversion struct {
	models.BaseModel

	From       string  `db:"from" json:"from"`
	Multiplier float64 `db:"multiplier" json:"multiplier"`
	Into       string  `db:"into" json:"into"`
}

func (u *UnitConversion) TableName() string {
	return "unit_conversions"
}
