package routes

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"core-service/internal/auth"
	"core-service/internal/orchestration"
	"core-service/internal/scoring"
	"core-service/internal/users"
)

type RecommendationHandler struct {
	service   *orchestration.Service
	jwtSecret string
	userRepo  *users.Repository
}

func NewRecommendationHandler(service *orchestration.Service, jwtSecret string, userRepo *users.Repository) *RecommendationHandler {
	return &RecommendationHandler{
		service:   service,
		jwtSecret: jwtSecret,
		userRepo:  userRepo,
	}
}

func (h *RecommendationHandler) GetRecommendations(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log.Println("GetRecommendations: Starting request")

	authHeader := r.Header.Get("Authorization")
	token := ""
	if authHeader != "" {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	}
	log.Printf("GetRecommendations: Auth header present: %v", authHeader != "")

	userID, err := auth.ExtractUserID(token, h.jwtSecret)
	if err != nil {
		log.Printf("GetRecommendations: Auth failed: %v", err)
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	log.Printf("GetRecommendations: User ID: %s", userID)

	userCtx, err := h.service.BuildUserContext(ctx, userID)
	if err != nil {
		log.Printf("GetRecommendations: BuildUserContext failed: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.Printf("GetRecommendations: User context built with %d preferences", len(userCtx.Preferences))

	// Fetch user's GitHub token from database
	githubToken, err := h.userRepo.GetGitHubToken(ctx, userID)
	if err != nil {
		// Log but don't fail - we can still try with empty token
		// (GitHub Service might have fallback app token)
		log.Printf("GetRecommendations: GetGitHubToken failed (non-fatal): %v", err)
		githubToken = ""
	}

	// repo should be in "owner/repo" format (e.g., nodejs/node)
	log.Println("GetRecommendations: Calling SearchReposForUser")
	repos, err := h.service.SearchReposForUser(ctx, userCtx, githubToken)
	if err != nil {
		log.Printf("GetRecommendations: SearchReposForUser failed: %v", err)
		http.Error(w, "failed to search repos: "+err.Error(), http.StatusInternalServerError)
		return
	}
	log.Printf("GetRecommendations: Found %d repos", len(repos))

	if len(repos) == 0 {
		log.Println("GetRecommendations: No repos found, returning error")
		http.Error(w, "no repositories found", http.StatusInternalServerError)
		return
	}

	// Try to find a repo with good first issues among the top 5
	var topRepo string
	var issues []orchestration.Issue
	var signals scoring.RepoSignals
	var rec *orchestration.RepoRecommendation

	limit := 5
	if len(repos) < limit {
		limit = len(repos)
	}

	found := false
	for i := 0; i < limit; i++ {
		candidateRepo := repos[i]
		log.Printf("GetRecommendations: Checking repo %d/%d: %s", i+1, limit, candidateRepo)

		// FIXED: Use githubToken instead of JWT token
		candidateIssues, err := h.service.FetchAndEnrichIssues(ctx, candidateRepo, 3, githubToken)
		if err != nil {
			log.Printf("GetRecommendations: FetchAndEnrichIssues failed for %s: %v", candidateRepo, err)
			continue
		}

		if len(candidateIssues) > 0 {
			log.Printf("GetRecommendations: Found %d issues for %s", len(candidateIssues), candidateRepo)
			topRepo = candidateRepo
			issues = candidateIssues
			found = true
			break
		}
		log.Printf("GetRecommendations: No issues found for %s", candidateRepo)
	}

	// Fallback to first repo if none with issues found
	if !found {
		topRepo = repos[0]
		// issues remains nil or empty
	}

	signals = h.service.BuildRepoSignals(ctx, topRepo, userCtx)

	rec, err = h.service.ScoreRepositoryForUser(ctx, userCtx, topRepo, signals)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := orchestration.RecommendationResponse{
		RepoID:         rec.RepoID,
		Score:          rec.Score.TotalScore,
		Level:          rec.Score.Level,
		Reasons:        rec.Score.Reasons,
		SuggestedRepos: repos,
		Issues:         issues,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
