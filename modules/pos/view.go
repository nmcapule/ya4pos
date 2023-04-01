// Package pos contains views for the pos module.
package pos

import (
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/nmcapule/ya4pos/modules"
	"github.com/pocketbase/pocketbase"
)

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
			return c.Render(http.StatusOK, "pos/pos.html", struct {
				modules.BaseConfig
				WarehouseID string
			}{
				WarehouseID: c.PathParam("warehouseId"),
			})
		},
	})
	return nil
}
