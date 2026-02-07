package repos

import (
	"os"
	"testing"
)

func TestFetchRepo(t *testing.T) {
	token := os.Getenv("GITHUB_TOKEN")
	if token == "" {
		t.Skip("Skipping test because GITHUB_TOKEN is not set")
	}

	repo, err := FetchRepo("google", "go-github", token)
	if err != nil {
		t.Fatalf("FetchRepo failed: %v", err)
	}

	if repo.Name != "go-github" {
		t.Errorf("Expected repo name 'go-github', got '%s'", repo.Name)
	}

	if repo.Stars == 0 {
		t.Logf("Warning: Repo has 0 stars, which is unlikely for google/go-github")
	}
}
