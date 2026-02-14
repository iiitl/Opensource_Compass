package watchlist

import (
	"context"
	"log"
	"time"
)

type Poller struct {
	repo         *Repository
	githubClient GitHubClient
	notifiers    []Notifier // Support multiple notifiers
	interval     time.Duration
}

type GitHubClient interface {
	GetLatestIssueNumber(owner, name string) (int, error)
	GetLatestIssue(owner, name string) (number int, title string, url string, err error)
}

type Notifier interface {
	NotifyUser(userID string, payload interface{}) error
}

func NewPoller(repo *Repository, gh GitHubClient, notifiers []Notifier, interval time.Duration) *Poller {
	return &Poller{
		repo:         repo,
		githubClient: gh,
		notifiers:    notifiers,
		interval:     interval,
	}
}

func (p *Poller) Start(ctx context.Context) {
	log.Printf("Starting Poller with interval: %v", p.interval)
	ticker := time.NewTicker(p.interval)
	defer ticker.Stop()

	// Run immediately on start
	p.poll(ctx)

	for {
		select {
		case <-ctx.Done():
			log.Println("Poller stopping...")
			return
		case <-ticker.C:
			p.poll(ctx)
		}
	}
}

func (p *Poller) poll(ctx context.Context) {
	log.Println("Poller: Starting poll cycle")
	// TODO: Fetch distinct repos to avoid duplicate checks if multiple users watch the same repo
	// For MVP, we iterate all entries. Optimization: implement "ListAllUniqueRepos" in repository.

	// Assuming ListAll returns all watched entries
	entries, err := p.repo.ListAll(ctx)
	if err != nil {
		log.Printf("Poller: Error listing watched repos: %v", err)
		return
	}
	log.Printf("Poller: Found %d entries to check", len(entries))

	for _, entry := range entries {
		log.Printf("Poller: Checking repo %s/%s (Last issue: %d)", entry.RepoOwner, entry.RepoName, entry.LatestIssueNumber)
		latestNum, title, issueURL, err := p.githubClient.GetLatestIssue(entry.RepoOwner, entry.RepoName)
		if err != nil {
			log.Printf("Poller: Error fetching latest issue for %s/%s: %v", entry.RepoOwner, entry.RepoName, err)
			continue
		}
		log.Printf("Poller: Latest issue for %s/%s is #%d: %s", entry.RepoOwner, entry.RepoName, latestNum, title)

		if latestNum > entry.LatestIssueNumber {
			log.Printf("Poller: New issue detected for %s/%s! Updating DB and notifying user %s", entry.RepoOwner, entry.RepoName, entry.UserID)

			// Updates DB
			if err := p.repo.UpdateLastChecked(ctx, entry.ID, latestNum); err != nil {
				log.Printf("Poller: Error updating last checked for %s/%s: %v", entry.RepoOwner, entry.RepoName, err)
			}

			// Send notification with issue details via all notifiers
			payload := map[string]interface{}{
				"type":         "new_issue",
				"repo":         entry.RepoOwner + "/" + entry.RepoName,
				"issue_number": latestNum,
				"issue_title":  title,
				"issue_url":    issueURL,
				"message":      "New issue detected!",
			}

			for _, notifier := range p.notifiers {
				if err := notifier.NotifyUser(entry.UserID, payload); err != nil {
					log.Printf("Poller: Error notifying user %s via notifier: %v", entry.UserID, err)
				} else {
					log.Printf("Poller: Successfully notified user %s", entry.UserID)
				}
			}
		} else {
			log.Printf("Poller: No new issues for %s/%s", entry.RepoOwner, entry.RepoName)
		}
	}
	log.Println("Poller: cycle finished")
}
