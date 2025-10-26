package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/user"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

type FileEntry struct {
	Name        string `json:"name"`
	IsDirectory bool   `json:"isDirectory"`
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

func (a *App) ListDirectory(path string) ([]FileEntry, error) {
	entries, err := os.ReadDir(path)
	if err != nil {
		log.Printf("Error reading the directory: %v", err)
		return nil, err
	}
	var files []FileEntry
	for _, entry := range entries {
		files = append(files, FileEntry{
			Name:        entry.Name(),
			IsDirectory: entry.IsDir(),
		})
	}
	return files, nil
}

func (a *App) JoinPath(path string, name string) string {
	return filepath.Join(path, name)
}

func (a *App) GetParentDirectory(path string) string {
	return filepath.Dir(path)
}

func (a *App) OpenFile(path string) {
	runtime.BrowserOpenURL(a.ctx, path)
}
