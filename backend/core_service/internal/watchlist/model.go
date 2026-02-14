package watchlist

import "time"

type WatchedRepo struct {
	ID                int       `json:"id"`
	UserID            string    `json:"user_id"`
	RepoOwner         string    `json:"repo_owner"`
	RepoName          string    `json:"repo_name"`
	LastCheckedAt     time.Time `json:"last_checked_at"`
	LatestIssueNumber int       `json:"latest_issue_number"`
	CreatedAt         time.Time `json:"created_at"`
}

type CreateWatchlistRequest struct {
	RepoOwner string `json:"repo_owner"`
	RepoName  string `json:"repo_name"`
}
