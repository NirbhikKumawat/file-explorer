package main

import (
	"context"
	"fmt"
	"log"
	"os/user"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetHomeDir() string {
	usr, err := user.Current()
	if err != nil {
		log.Printf("Can't get user's home directory")
		return ""
	}
	return usr.HomeDir

}
