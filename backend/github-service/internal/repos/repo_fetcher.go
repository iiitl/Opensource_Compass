package repos

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
)

type RepoDTO struct {
	FullName     string `json:"full_name"`
	Name         string `json:"name"`
	Description  string `json:"description"`
	Stars        int    `json:"stars"`
	URL          string `json:"url"`
	LastPushedAt string `json:"last_pushed_at"`
	OpenIssues   int    `json:"open_issues"`
}

// Map user-friendly domain names to GitHub topics
// NOTE: Using only PRIMARY topic per domain because GitHub ANDs multiple topics together
func mapDomainToTopics(userDomains []string) []string {
	mapping := map[string]string{
		"Web Development":       "web",
		"Mobile Development":    "mobile",
		"AI & Machine Learning": "machine-learning",
		"DevOps & Cloud":        "devops",
		"Game Development":      "game",
		"Security":              "security",
		"Data Science":          "data-science",
		"Tools & Libraries":     "cli",
		"Backend Development":   "backend",
		"backend":               "backend", // robust fallback
	}

	topics := []string{}
	for _, domain := range userDomains {
		if mapped, ok := mapping[domain]; ok {
			topics = append(topics, mapped)
		}
	}
	return topics
}

func buildQuery(prefix string, values []string) string {
	if len(values) == 0 {
		return ""
	}

	parts := make([]string, 0)
	for _, v := range values {
		parts = append(parts, prefix+":"+v)
	}

	return strings.Join(parts, " ")
}

func FetchRepos(languages []string, frameworks []string, domains []string, token string) ([]RepoDTO, error) {
	queryParts := []string{}

	// Add languages to query (GitHub searches with implicit OR)
	if q := buildQuery("language", languages); q != "" {
		queryParts = append(queryParts, q)
	}

	// Map user-friendly domain names to GitHub topics
	topics := mapDomainToTopics(domains)
	if len(topics) > 0 {
		topicQuery := buildQuery("topic", topics)
		queryParts = append(queryParts, topicQuery)
	}

	query := strings.Join(queryParts, " ")

	// Default query if nothing selected
	if query == "" {
		query = "stars:>1000"
	}

	log.Println("Github search query: ", query)

	// Use page 1 instead of random page to ensure we get results
	page := 1

	url := fmt.Sprintf("https://api.github.com/search/repositories?q=%s&page=%d&per_page=30&sort=stars&order=desc",
		url.QueryEscape(query), page,
	)

	req, err := http.NewRequest("GET", url, nil)

	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "token "+token)
	req.Header.Set("Accept", "application/vnd.github+json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("GitHub API request failed: %v", err)
		return nil, err
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		log.Printf("GitHub API returned status %d", resp.StatusCode)
		return nil, fmt.Errorf("github api returned status: %d", resp.StatusCode)
	}

	var raw struct {
		Items []struct {
			FullName        string `json:"full_name"`
			Name            string `json:"name"`
			Description     string `json:"description"`
			Stars           int    `json:"stargazers_count"`
			HTMLURL         string `json:"html_url"`
			PushedAt        string `json:"pushed_at"`
			OpenIssuesCount int    `json:"open_issues_count"`
			Language        string `json:"language"`
		} `json:"items"`
		TotalCount int `json:"total_count"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
		log.Printf("Failed to decode GitHub API response: %v", err)
		return nil, err
	}

	log.Printf("GitHub API returned %d repositories (total available: %d)", len(raw.Items), raw.TotalCount)

	repos := make([]RepoDTO, 0)
	for _, r := range raw.Items {
		repos = append(repos, RepoDTO{
			FullName:     r.FullName,
			Name:         strings.Split(r.FullName, "/")[1],
			Description:  r.Description,
			Stars:        r.Stars,
			URL:          r.HTMLURL,
			LastPushedAt: r.PushedAt,
			OpenIssues:   r.OpenIssuesCount,
		})
	}

	log.Printf("Returning %d repositories to client", len(repos))
	return repos, nil
}

func FetchRepo(owner string, repo string, token string) (*RepoDTO, error) {
	client := &http.Client{}
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s", owner, repo)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("github api returned status: %d", resp.StatusCode)
	}

	var raw struct {
		FullName        string `json:"full_name"`
		Name            string `json:"name"`
		Description     string `json:"description"`
		Stars           int    `json:"stargazers_count"`
		HTMLURL         string `json:"html_url"`
		PushedAt        string `json:"pushed_at"`
		OpenIssuesCount int    `json:"open_issues_count"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
		return nil, err
	}

	repoDto := &RepoDTO{
		FullName:     raw.FullName,
		Name:         raw.Name, // This might need adjustment if Name is not directly in raw or if we want just the repo name
		Description:  raw.Description,
		Stars:        raw.Stars,
		URL:          raw.HTMLURL,
		LastPushedAt: raw.PushedAt,
		OpenIssues:   raw.OpenIssuesCount,
	}
	// Fixing Name assignment logic to be consistent with FetchRepos if needed, or just use raw.Name if it's the repo name
	// In FetchRepos: Name: strings.Split(r.FullName, "/")[1]
	// GitHub API /repos/:owner/:repo returns "name" as just the repo name, so raw.Name is correct if we want that.

	return repoDto, nil
}
