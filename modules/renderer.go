package modules

import (
	"bytes"
	"embed"
	"errors"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"path/filepath"
	"strings"
	"sync"

	"github.com/fsnotify/fsnotify"
	"github.com/labstack/echo/v5"

	log "github.com/sirupsen/logrus"
)

// ErrMustImplementPageConfig is returned when the passed data does not
// implement the PageConfig interface.
var ErrMustImplementPageConfig = errors.New("the passed data is required to implement PageConfig")

//go:embed */*.html
var efs embed.FS
var templates = template.Must(template.ParseFS(efs, "*/*.html"))

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
	watcher     *fsnotify.Watcher
	templatesMu sync.Mutex
	templates   *template.Template
}

func NewViewRenderer() *ViewRenderer {
	vr := &ViewRenderer{
		templates: template.Must(template.ParseGlob("modules/**/*.html")),
	}
	watcher := setupWatcher("modules", func(event fsnotify.Event) error {
		if !event.Has(fsnotify.Write) {
			return nil
		}
		if strings.Contains(event.Name, ".html") {
			log.Println("Modified HTML file:", event.Name)
			vr.templatesMu.Lock()
			vr.templates = template.Must(template.ParseGlob("modules/**/*.html"))
			vr.templatesMu.Unlock()
		}
		return nil
	})
	vr.watcher = watcher

	return vr
}

func (vr *ViewRenderer) watchTemplates() {
	vr.templatesMu.Lock()
	vr.templatesMu.Unlock()
}

// Render renders a template document.
func (vr *ViewRenderer) Render(w io.Writer, name string, data any, c echo.Context) error {
	config, ok := data.(PageConfig)
	if !ok {
		return ErrMustImplementPageConfig
	}

	vr.templatesMu.Lock()
	defer vr.templatesMu.Unlock()

	var content bytes.Buffer
	if err := vr.templates.ExecuteTemplate(&content, name, data); err != nil {
		return fmt.Errorf("executing content template %q: %w", name, err)
	}
	if err := vr.templates.ExecuteTemplate(w, config.PageLayout(), struct {
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

func setupWatcher(root string, callback func(event fsnotify.Event) error) *fsnotify.Watcher {
	// Create new watcher.
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatalf("Can't spawn watcher: %v", err)
	}
	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					log.Println("Closing watcher.")
					return
				}
				if err := callback(event); err != nil {
					log.Errorf("Error while handling event: %v", err)
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("Error:", err)
			}
		}
	}()
	filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if !d.IsDir() {
			return nil
		}
		if err := watcher.Add(path); err != nil {
			log.Fatal(err)
		}
		log.Infof("Watching for changes in %s", path)
		return nil
	})

	return watcher
}
