package main

import (
	"os"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"github.com/nmcapule/ya4pos/modules"
	"github.com/nmcapule/ya4pos/modules/accounts"
	"github.com/nmcapule/ya4pos/modules/home"
	"github.com/nmcapule/ya4pos/modules/pos"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/sirupsen/logrus"
)

func hook(g *echo.Group, view modules.View) {
	if err := view.Hook(g); err != nil {
		logrus.Fatalln("Failed to initialize hook to group: %+v", g)
	}
}

func main() {
	app := pocketbase.New()
	flags := app.RootCmd.PersistentFlags()

	// TODO(nmcapule): True livereload automatically reloads the page when
	// detecting a change in the filesystem. This is not yet implemented.
	var enableLiveReload bool
	flags.BoolVarP(&enableLiveReload, "livereload", "l", false, "automatically update served templates on FS change")

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		log := logrus.New()
		e.Router.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
			LogError:  true,
			LogURI:    true,
			LogStatus: true,
			LogValuesFunc: func(c echo.Context, values middleware.RequestLoggerValues) error {
				if values.Status >= 400 {
					log.WithFields(logrus.Fields{
						"URI":    values.URI,
						"status": values.Status,
						"error":  values.Error,
					}).Error("request")
				}

				return nil
			},
		}))

		e.Router.Renderer = modules.NewViewRenderer(enableLiveReload)
		hook(e.Router.Group(""), &home.View{})
		hook(e.Router.Group("/accounts"), &accounts.View{})
		hook(e.Router.Group("/pos"), &pos.View{
			App: app,
		})

		// serves static files from the provided public dir (if exists)
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))

		return nil
	})

	logrus.Fatal(app.Start())
}
