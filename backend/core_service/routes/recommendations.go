package routes

import (
	"encoding/json"
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

	authHeader := r.Header.Get("Authorization")
	token := ""
	if authHeader != "" {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	}

	userID, err := auth.ExtractUserID(token, h.jwtSecret)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	userCtx, err := h.service.BuildUserContext(ctx, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Fetch user's GitHub token from database
	githubToken, err := h.userRepo.GetGitHubToken(ctx, userID)
	if err != nil {
		// Log but don't fail - we can still try with empty token
		// (GitHub Service might have fallback app token)
		githubToken = ""
	}

	// repo should be in "owner/repo" format (e.g., nodejs/node)
	repos, err := h.service.SearchReposForUser(ctx, userCtx, githubToken)
	if err != nil || len(repos) == 0 {
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

		// We need to fetch issues to check if there are any
		candidateIssues, err := h.service.FetchAndEnrichIssues(ctx, candidateRepo, 3, token)
		if err == nil && len(candidateIssues) > 0 {
			topRepo = candidateRepo
			issues = candidateIssues
			found = true
			break
		}
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
