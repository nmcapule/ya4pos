// Package pos contains views for the pos module.
package pos

import (
	"encoding/json"
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
	g.AddRoute(echo.Route{
		Method: http.MethodPost,
		Path:   "/review",
		Handler: func(c echo.Context) error {
			c.Request().ParseForm()
			var data struct {
				modules.BaseConfig
				WarehouseID string `json:"warehouse"`
				Orders      []struct {
					Stock    string `json:"stock"`
					Quantity int    `json:"quantity"`
				} `json:"orders"`
			}
			if err := json.Unmarshal([]byte(c.FormValue("body")), &data); err != nil {
				c.JSON(http.StatusBadRequest, err)
			}
			return c.Render(http.StatusOK, "pos/review.html", data)

		},
	})
	return nil
}
