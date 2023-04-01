package main

import (
	"os"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	views "github.com/nmcapule/ya4pos/modules"
	"github.com/nmcapule/ya4pos/modules/accounts"
	"github.com/nmcapule/ya4pos/modules/pos"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"

	"github.com/sirupsen/logrus"
)

func hook(g *echo.Group, view views.View) {
	if err := view.Hook(g); err != nil {
		logrus.Fatalln("Failed to initialize hook to group: %+v", g)
	}
}

func main() {
	app := pocketbase.New()

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

		e.Router.Renderer = &views.ViewRenderer{}
		hook(e.Router.Group("/accounts"), &accounts.View{})
		hook(e.Router.Group("/pos"), &pos.View{})

		// serves static files from the provided public dir (if exists)
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))

		return nil
	})

	logrus.Fatal(app.Start())
}