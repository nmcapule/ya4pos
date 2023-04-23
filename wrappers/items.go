package wrappers

import "github.com/pocketbase/pocketbase/models"

type Item struct {
	models.BaseModel

	Parent       string  `db:"parent" json:"parent"`
	ProfileImage string  `db:"profileImage" json:"profileImage"`
	SKU          string  `db:"sku" json:"sku"`
	Icon         string  `db:"icon" json:"icon"`
	Label        string  `db:"label" json:"label"`
	Unit         string  `db:"unit" json:"unit"`
	UnitPrice    float64 `db:"unitPrice" json:"unitPrice"`
	ExpiryInSecs int     `db:"expiryInSecs" json:"expiryInSecs"`
}

func (i *Item) TableName() string {
	return "items"
}

type Tag struct {
	models.BaseModel

	Label string `db:"label" json:"label"`
}

func (t *Tag) TableName() string {
	return "tags"
}
