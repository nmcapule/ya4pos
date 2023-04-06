// Package accounts contains views for the accounts module.
package accounts

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
			return c.Render(http.StatusOK, "accounts/index.html", modules.BaseConfig{})
		},
	})
	g.AddRoute(echo.Route{
		Method: http.MethodGet,
		Path:   "/login",
		Handler: func(c echo.Context) error {
			return c.Render(http.StatusOK, "accounts/login.html", modules.BaseConfig{})
		},
	})
	return nil
}
