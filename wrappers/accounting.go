package wrappers

import "github.com/pocketbase/pocketbase/models"

// Transaction is a wrapper for an accounting transaction.
type Transaction struct {
	models.BaseModel

	Description string  `db:"description" json:"description"`
	Amount      float64 `db:"amount" json:"amount"`
	From        string  `db:"from" json:"from"`
	Into        string  `db:"into" json:"into"`
}

func (t *Transaction) TableName() string {
	return "accounting_transactions"
}

type AccountingEntity struct {
	models.BaseModel

	Label       string `db:"label" json:"label"`
	Description string `db:"description" json:"description"`
}

func (a *AccountingEntity) TableName() string {
	return "accounting_entities"
}
