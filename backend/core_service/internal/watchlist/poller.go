package watchlist

import (
	"context"
	"time"
)

type Poller struct {
	repo         *Repository
	githubClient GitHubClient
	notifier     Notifier
	interval     time.Duration
}

type GitHubClient interface {
	GetLatestIssueNumber(owner, name string) (int, error)
}

type Notifier interface {
	NotifyUser(userID string, payload interface{}) error
}

func NewPoller(repo *Repository, gh GitHubClient, notifier Notifier, interval time.Duration) *Poller {
	return &Poller{
		repo:         repo,
		githubClient: gh,
		notifier:     notifier,
		interval:     interval,
	}
}

func (p *Poller) Start(ctx context.Context) {
	ticker := time.NewTicker(p.interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			p.poll(ctx)
		}
	}
}

func (p *Poller) poll(ctx context.Context) {
	// TODO: Fetch distinct repos to avoid duplicate checks if multiple users watch the same repo
	// For MVP, we iterate all entries. Optimization: implement "ListAllUniqueRepos" in repository.

	// Assuming ListAll returns all watched entries
	entries, err := p.repo.ListAll(ctx)
	if err != nil {
		// log error
		return
	}

	for _, entry := range entries {
		latestNum, err := p.githubClient.GetLatestIssueNumber(entry.RepoOwner, entry.RepoName)
		if err != nil {
			// log error
			continue
		}

		if latestNum > entry.LatestIssueNumber {
			// New issue found!

			// Updates DB
			if err := p.repo.UpdateLastChecked(ctx, entry.ID, latestNum); err != nil {
				// log error
			}

			// Send notification
			payload := map[string]interface{}{
				"type":         "new_issue",
				"repo":         entry.RepoOwner + "/" + entry.RepoName,
				"issue_number": latestNum,
				"message":      "New issue detected!",
			}
			p.notifier.NotifyUser(entry.UserID, payload)
		}
	}
}
