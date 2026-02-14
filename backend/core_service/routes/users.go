package routes

import (
	"encoding/json"
	"net/http"
	"strings"

	"core-service/internal/auth"
	"core-service/internal/users"
)

type UserHandler struct {
	userRepo  *users.Repository
	jwtSecret string
}

func NewUserHandler(userRepo *users.Repository, jwtSecret string) *UserHandler {
	return &UserHandler{
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

type SaveGitHubTokenRequest struct {
	Token string `json:"token"`
	Email string `json:"email"`
}

func (h *UserHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from JWT for validation
	authHeader := r.Header.Get("Authorization")
	token := strings.TrimPrefix(authHeader, "Bearer ")

	requestingUserID, err := auth.ExtractUserID(token, h.jwtSecret)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse URL path to get user ID and action
	// Expected: /users/{user_id}/github-token
	path := strings.TrimPrefix(r.URL.Path, "/users/")
	parts := strings.Split(path, "/")

	if len(parts) < 2 || parts[1] != "github-token" {
		http.Error(w, "invalid path", http.StatusNotFound)
		return
	}

	targetUserID := parts[0]

	// Only allow users to update their own token
	if targetUserID != requestingUserID {
		http.Error(w, "forbidden: can only update your own token", http.StatusForbidden)
		return
	}

	if r.Method == http.MethodPost {
		h.SaveGitHubToken(w, r, targetUserID)
	} else if r.Method == http.MethodGet {
		h.GetGitHubToken(w, r, targetUserID)
	} else {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *UserHandler) SaveGitHubToken(w http.ResponseWriter, r *http.Request, userID string) {
	ctx := r.Context()

	var req SaveGitHubTokenRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if req.Token == "" {
		http.Error(w, "token is required", http.StatusBadRequest)
		return
	}

	err := h.userRepo.UpdateGitHubToken(ctx, userID, req.Token)
	if err != nil {
		http.Error(w, "failed to save token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Update email if provided
	if req.Email != "" {
		if err := h.userRepo.UpdateEmail(ctx, userID, req.Email); err != nil {
			// Log error but don't fail the request
			http.Error(w, "failed to save email: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "User data saved successfully",
	})
}

func (h *UserHandler) GetGitHubToken(w http.ResponseWriter, r *http.Request, userID string) {
	ctx := r.Context()

	token, err := h.userRepo.GetGitHubToken(ctx, userID)
	if err != nil {
		http.Error(w, "failed to get token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}
