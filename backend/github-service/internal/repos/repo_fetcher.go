package repos

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
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

func buildORQuery(prefix string, values []string) string {
	if len(values) == 0 {
		return ""
	}

	parts := make([]string, 0)
	for _, v := range values {
		if prefix != "" {
			parts = append(parts, prefix+": "+v)
		} else {
			parts = append(parts, v)
		}
	}

	return "(" + strings.Join(parts, " OR ") + ")"
}

func FetchRepos(languages []string, frameworks []string, domains []string, token string) ([]RepoDTO, error) {
	queryParts := []string{}

	if q := buildORQuery("language", languages); q != "" {
		queryParts = append(queryParts, q)
	}

	if q := buildORQuery("topic", domains); q != "" {
		queryParts = append(queryParts, q)
	}
	query := strings.Join(queryParts, " ")

	log.Println("Github search query: ", query)

	page := rand.Intn(10) + 1

	url := fmt.Sprintf("https://api.github.com/search/repositories?q=%s&page=%d",
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
		return nil, err
	}
	defer resp.Body.Close()

	var raw struct {
		Items []struct {
			FullName        string `json:"full_name"`
			Name            string `json:"name"`
			Description     string `json:"description"`
			Stars           int    `json:"stargazers_count"`
			HTMLURL         string `json:"html_url"`
			PushedAt        string `json:"pushed_at"`
			OpenIssuesCount int    `json:"open_issues_count"`
		} `json:"items"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
		return nil, err
	}

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
