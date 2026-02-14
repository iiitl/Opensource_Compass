package db

import (
	"context"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

func RunMigrations(ctx context.Context, db *pgxpool.Pool) error {
	migrationDir := "db/migrations"

	files, err := os.ReadDir(migrationDir)
	if err != nil {
		log.Printf("Failed to read migration directory: %v", err)
		return err
	}

	// Sort files to ensure order (000001, 000002...)
	sort.Slice(files, func(i, j int) bool {
		return files[i].Name() < files[j].Name()
	})

	for _, file := range files {
		if !strings.HasSuffix(file.Name(), ".up.sql") {
			continue
		}

		log.Printf("Applying migration: %s", file.Name())
		content, err := os.ReadFile(filepath.Join(migrationDir, file.Name()))
		if err != nil {
			return err
		}

		_, err = db.Exec(ctx, string(content))
		if err != nil {
			log.Printf("Failed to apply migration %s: %v", file.Name(), err)
			return err
		}
	}

	log.Println("Migrations applied successfully")
	return nil
}
