package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/user"
	"path/filepath"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

type FileEntry struct {
	Name        string    `json:"name"`
	IsDirectory bool      `json:"isDirectory"`
	Size        int64     `json:"size"`
	ModTime     time.Time `json:"modTime"`
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

func (a *App) ListDirectory(path string, showHidden bool) ([]FileEntry, error) {
	entries, err := os.ReadDir(path)
	if err != nil {
		log.Printf("Error reading the directory: %v", err)
		return nil, err
	}
	var files []FileEntry
	for _, entry := range entries {
		if !showHidden && entry.Name()[0] == '.' {
			continue
		}
		info, err := entry.Info()
		if err != nil {
			log.Printf("Error getting file info: %v", err)
			return nil, err
		}
		files = append(files, FileEntry{
			Name:        entry.Name(),
			IsDirectory: entry.IsDir(),
			Size:        info.Size(),
			ModTime:     info.ModTime(),
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

func (a *App) CreateFolder(currentPath string, folderName string) error {
	fullPath := filepath.Join(currentPath, folderName)
	err := os.Mkdir(fullPath, 0755)
	if err != nil {
		log.Printf("Error creating directory: %v", err)
		return err
	}
	return nil
}
func (a *App) CreateFile(currentPath string, fileName string) error {
	fullPath := filepath.Join(currentPath, fileName)
	_, err := os.Create(fullPath)
	if err != nil {
		log.Printf("Error creating file: %v", err)
		return err
	}
	return nil
}
func (a *App) RenameEntry(currentPath string, oldName string, newName string) error {
	oldPath := filepath.Join(currentPath, oldName)
	newPath := filepath.Join(currentPath, newName)
	err := os.Rename(oldPath, newPath)
	if err != nil {
		log.Printf("Error renaming file: %v", err)
		return err
	}
	return nil
}

func (a *App) MoveEntry(sourcePath string, destinationDir string, entryName string) error {
	destinationPath := filepath.Join(destinationDir, entryName)
	err := os.Rename(sourcePath, destinationPath)
	if err != nil {
		log.Printf("Error moving file: %v", err)
		return err
	}
	return nil
}
