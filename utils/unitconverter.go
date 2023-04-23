package utils

import (
	"fmt"

	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
)

// UnitConverter is a utility for converting between units.
type UnitConverter struct {
	table map[string]map[string]float64
}

// NewUnitConverter creates a new unit converter.
func NewUnitConverter(dao *daos.Dao) (*UnitConverter, error) {
	uc := &UnitConverter{}
	return uc, uc.Refresh(dao)
}

// Convert converts a value from one unit to another.
// TODO(nmcapule): Do a BFS unit conversion implementation.
func (uc *UnitConverter) Convert(value float64, from, into string) (float64, error) {
	if from == into {
		return value, nil
	}

	if multiplier, ok := uc.table[from][into]; ok {
		return value * multiplier, nil
	}
	if multiplier, ok := uc.table[into][from]; ok {
		return value / multiplier, nil
	}

	return 0, fmt.Errorf("no conversion found from %s to %s", from, into)
}

// Refresh refreshes the unit conversion table.
func (uc *UnitConverter) Refresh(dao *daos.Dao) error {
	conversions, err := dao.FindRecordsByExpr("unit_conversions")
	if err != nil {
		return fmt.Errorf("failed to get unit conversions: %w", err)
	}
	uc.table = buildUnitConversionTable(conversions)
	return nil
}

// Builds a simple, two-way conversion table straight from a list of conversions.
func buildUnitConversionTable(conversions []*models.Record) map[string]map[string]float64 {
	table := make(map[string]map[string]float64)
	for _, conversion := range conversions {
		from := conversion.GetString("from")
		into := conversion.GetString("into")
		multiplier := conversion.GetFloat("multiplier")

		if _, ok := table[from]; !ok {
			table[from] = make(map[string]float64)
		}
		table[from][into] = multiplier
		if _, ok := table[into]; !ok {
			table[into] = make(map[string]float64)
		}
		table[into][from] = 1 / multiplier
	}
	return table
}
