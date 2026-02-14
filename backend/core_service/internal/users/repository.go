package users

import (
	"context"
	"database/sql"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(ctx context.Context, user *User) error {
	query := `
		INSERT INTO users (id, github_username, email, experience_level)
		VALUES ($1, $2, $3, $4)
	`
	_, err := r.db.Exec(ctx, query, user.ID, user.GitHubUsername, user.Email, user.ExperienceLevel)
	return err
}

func (r *Repository) GetByID(ctx context.Context, id string) (*User, error) {
	query := `
		SELECT id, github_username, email, experience_level, created_at
		FROM users
		WHERE id = $1
	`

	var user User
	var email sql.NullString
	err := r.db.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.GitHubUsername,
		&email,
		&user.ExperienceLevel,
		&user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	if email.Valid {
		user.Email = email.String
	}

	return &user, nil
}

func (r *Repository) CreateOrGet(ctx context.Context, id string, githubUsername string) (*User, error) {
	// Try to get existing user
	user, err := r.GetByID(ctx, id)
	if err == nil {
		return user, nil
	}

	// User doesn't exist, create new one
	newUser := &User{
		ID:             id,
		GitHubUsername: githubUsername,
	}

	err = r.Create(ctx, newUser)
	if err != nil {
		return nil, err
	}

	return r.GetByID(ctx, id)
}

func (r *Repository) UpdateGitHubToken(ctx context.Context, userID string, token string) error {
	query := `
		UPDATE users
		SET github_token = $1
		WHERE id = $2
	`
	_, err := r.db.Exec(ctx, query, token, userID)
	return err
}

func (r *Repository) GetGitHubToken(ctx context.Context, userID string) (string, error) {
	query := `
		SELECT github_token
		FROM users
		WHERE id = $1
	`

	var token sql.NullString
	err := r.db.QueryRow(ctx, query, userID).Scan(&token)
	if err != nil {
		return "", err
	}

	// Return empty string if token is NULL
	if !token.Valid {
		return "", nil
	}

	return token.String, nil
}

// UpdateEmail updates the email for a user
func (r *Repository) UpdateEmail(ctx context.Context, userID string, email string) error {
	query := `
		UPDATE users
		SET email = $1
		WHERE id = $2
	`
	_, err := r.db.Exec(ctx, query, email, userID)
	return err
}
