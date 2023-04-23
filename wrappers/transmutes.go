package wrappers

import "github.com/pocketbase/pocketbase/models"

type Transmute struct {
	models.BaseModel

	Transaction string `db:"transaction" json:"transaction"`
	Recipe      string `db:"recipe" json:"recipe"`
	Warehouse   string `db:"warehouse" json:"warehouse"`
	Input       string `db:"input" json:"input"`
	Output      string `db:"output" json:"output"`
}

func (t *Transmute) TableName() string {
	return "transmutes"
}

type Recipe struct {
	models.BaseModel

	Item  string `db:"item" json:"item"`
	Label string `db:"label" json:"label"`
}

func (r *Recipe) TableName() string {
	return "recipes"
}

type RecipeIngredient struct {
	models.BaseModel

	Recipe   string  `db:"recipe" json:"recipe"`
	Item     string  `db:"item" json:"item"`
	Quantity float64 `db:"quantity" json:"quantity"`
	Unit     string  `db:"unit" json:"unit"`
}

func (r *RecipeIngredient) TableName() string {
	return "recipe_ingredients"
}
