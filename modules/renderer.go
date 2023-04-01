package modules

import (
	"bytes"
	"embed"
	"errors"
	"fmt"
	"html/template"
	"io"

	"github.com/labstack/echo/v5"
)

// ErrMustImplementPageConfig is returned when the passed data does not
// implement the PageConfig interface.
var ErrMustImplementPageConfig = errors.New("the passed data is required to implement PageConfig")

//go:embed */*.html
var fs embed.FS
var templates = template.Must(template.ParseFS(fs, "*/*.html"))

const defaultLayout = "layouts/base.html"

// PageConfig is the data that will be passed to the template.
type PageConfig interface {
	PageLayout() string
	PageTitle() string
}

// BaseConfig is a utility struct that can be embedded in other structs to
// implement the PageData interface.
type BaseConfig struct {
	Layout string // template name of the base layout
	Title  string // title for the page
}

func (b BaseConfig) PageLayout() string {
	if b.Layout == "" {
		return defaultLayout
	}
	return b.Layout
}

func (b BaseConfig) PageTitle() string {
	return b.Title
}

// ViewRenderer is the renderer for the main view.
type ViewRenderer struct {
}

// Render renders a template document.
func (vr *ViewRenderer) Render(w io.Writer, name string, data any, c echo.Context) error {
	config, ok := data.(PageConfig)
	if !ok {
		return ErrMustImplementPageConfig
	}

	var content bytes.Buffer
	if err := templates.ExecuteTemplate(&content, name, data); err != nil {
		return fmt.Errorf("executing content template %q: %w", name, err)
	}
	if err := templates.ExecuteTemplate(w, config.PageLayout(), struct {
		Title string
		Body  template.HTML
	}{
		Title: config.PageTitle(),
		Body:  template.HTML(content.String()),
	}); err != nil {
		return fmt.Errorf("executing layout template %q: %w", defaultLayout, err)
	}
	return nil
}
