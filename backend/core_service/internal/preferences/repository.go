package preferences

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Add(ctx context.Context, pref *Preference) error {
	query := `
		INSERT INTO user_preferences (id, user_id, preference_type, value)
		VALUES ($1, $2, $3, $4)
	`
	_, err := r.db.Exec(
		ctx,
		query,
		pref.ID,
		pref.UserID,
		pref.PreferenceType,
		pref.Value,
	)
	return err
}

func (r *Repository) GetByUser(ctx context.Context, userID string) ([]Preference, error) {
	query := `
		SELECT id, user_id, preference_type, value, created_at
		FROM user_preferences
		WHERE user_id = $1
	`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var prefs []Preference
	for rows.Next() {
		var p Preference
		if err := rows.Scan(
			&p.ID,
			&p.UserID,
			&p.PreferenceType,
			&p.Value,
			&p.CreatedAt,
		); err != nil {
			return nil, err
		}
		prefs = append(prefs, p)
	}

	return prefs, nil
}

func (r *Repository) DeleteByUser(ctx context.Context, userID string) error {
	query := `
		DELETE FROM user_preferences
		WHERE user_id = $1
	`
	_, err := r.db.Exec(ctx, query, userID)
	return err
}

func (r *Repository) Count(ctx context.Context) (int, error) {
	var count int
	err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM user_preferences").Scan(&count)
	return count, err
}
