package watchlist

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Add(ctx context.Context, userID, owner, name string) error {
	query := `
		INSERT INTO watched_repos (user_id, repo_owner, repo_name)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id, repo_owner, repo_name) DO NOTHING
	`
	_, err := r.db.Exec(ctx, query, userID, owner, name)
	if err != nil {
		return fmt.Errorf("failed to add to watchlist: %w", err)
	}
	return nil
}

func (r *Repository) Remove(ctx context.Context, userID, owner, name string) error {
	query := `
		DELETE FROM watched_repos
		WHERE user_id = $1 AND repo_owner = $2 AND repo_name = $3
	`
	_, err := r.db.Exec(ctx, query, userID, owner, name)
	if err != nil {
		return fmt.Errorf("failed to remove from watchlist: %w", err)
	}
	return nil
}

func (r *Repository) List(ctx context.Context, userID string) ([]WatchedRepo, error) {
	query := `
		SELECT id, user_id, repo_owner, repo_name, created_at
		FROM watched_repos
		WHERE user_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query watchlist: %w", err)
	}
	defer rows.Close()

	var repos []WatchedRepo
	for rows.Next() {
		var repo WatchedRepo
		if err := rows.Scan(&repo.ID, &repo.UserID, &repo.RepoOwner, &repo.RepoName, &repo.CreatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		repos = append(repos, repo)
	}
	return repos, nil
}

func (r *Repository) IsWatched(ctx context.Context, userID, owner, name string) (bool, error) {
	query := `
		SELECT EXISTS(
			SELECT 1 FROM watched_repos 
			WHERE user_id = $1 AND repo_owner = $2 AND repo_name = $3
		)
	`
	var exists bool
	err := r.db.QueryRow(ctx, query, userID, owner, name).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("failed to check watchlist status: %w", err)
	}
	return exists, nil
}
