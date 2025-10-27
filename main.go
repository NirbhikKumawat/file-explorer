package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

// below is a special Go directive,not a comment,tells the Go compiler to find frontend/dist directory relative to this file,grab all files inside it and embed them into the program
//
//go:embed all:frontend/dist
var assets embed.FS //memory representation of my entire frontend/dist folder

func main() {
	// Create an instance of the app structure
	app := NewApp() // creates a new *App struct

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "file-explorer", // title appearing in the title bar
		Width:  1024,            //width of window
		Height: 768,             //height of window
		AssetServer: &assetserver.Options{ // tells to use embedded assets from frontend/dist
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1}, // windows default background colour
		OnStartup:        app.startup,                              // startup method,called during initialization
		Bind: []interface{}{ // binds,makes the go methods available to the Javascript frontend
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error()) // handles errors
	}
}
