package main

import (
	"embed"
	"html/template"
	"io"
	"net/http"
	"os"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"

	log "github.com/sirupsen/logrus"
)

//go:embed views/*
var f embed.FS

type Template struct {
	templates *template.Template
}

func (t *Template) Render(w io.Writer, name string, data any, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

func main() {
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.Renderer = &Template{
			templates: template.Must(template.ParseFS(f, "views/base_layout.html", "views/sample_content.html")),
		}
		e.Router.Group("/test").GET("/a", func(c echo.Context) error {
			return c.Render(http.StatusOK, "base_layout.html", map[string]any{
				"PageTitle": "OHSHIT",
			})
		})

		// serves static files from the provided public dir (if exists)
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))

		return nil
	})

	log.Fatal(app.Start())
}
