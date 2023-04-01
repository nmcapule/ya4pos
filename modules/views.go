// Package modules includes all base HTML layouts that will be used for rendering
// all pages in the application.
package modules

import "github.com/labstack/echo/v5"

type View interface {
	Hook(g *echo.Group) error
}
