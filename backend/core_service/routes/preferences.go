package routes

import (
	"encoding/json"
	"net/http"
	"strings"

	"core-service/internal/auth"
	"core-service/internal/preferences"
	"core-service/internal/users"

	"github.com/google/uuid"
)

type PreferencesHandler struct {
	prefRepo  *preferences.Repository
	userRepo  *users.Repository
	jwtSecret string
}

func NewPreferencesHandler(prefRepo *preferences.Repository, userRepo *users.Repository, jwtSecret string) *PreferencesHandler {
	return &PreferencesHandler{
		prefRepo:  prefRepo,
		userRepo:  userRepo,
		jwtSecret: jwtSecret,
	}
}

type SavePreferencesRequest struct {
	Languages       []string `json:"languages"`
	Topics          []string `json:"topics"`
	ExperienceLevel string   `json:"experienceLevel"`
	GitHubUsername  string   `json:"githubUsername"`
}

func (h *PreferencesHandler) SavePreferences(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx := r.Context()

	// Extract user ID from JWT
	authHeader := r.Header.Get("Authorization")
	token := strings.TrimPrefix(authHeader, "Bearer ")

	userID, err := auth.ExtractUserID(token, h.jwtSecret)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse request body
	var req SavePreferencesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// Create or get user
	_, err = h.userRepo.CreateOrGet(ctx, userID, req.GitHubUsername)
	if err != nil {
		http.Error(w, "failed to create user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Save language preferences
	for _, lang := range req.Languages {
		pref := &preferences.Preference{
			ID:             uuid.New().String(),
			UserID:         userID,
			PreferenceType: "language",
			Value:          lang,
		}
		if err := h.prefRepo.Add(ctx, pref); err != nil {
			http.Error(w, "failed to save language preference: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Save topic preferences
	for _, topic := range req.Topics {
		pref := &preferences.Preference{
			ID:             uuid.New().String(),
			UserID:         userID,
			PreferenceType: "domain",
			Value:          topic,
		}
		if err := h.prefRepo.Add(ctx, pref); err != nil {
			http.Error(w, "failed to save topic preference: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Save experience level preference
	if req.ExperienceLevel != "" {
		pref := &preferences.Preference{
			ID:             uuid.New().String(),
			UserID:         userID,
			PreferenceType: "experience_level",
			Value:          req.ExperienceLevel,
		}
		if err := h.prefRepo.Add(ctx, pref); err != nil {
			http.Error(w, "failed to save experience preference: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Preferences saved successfully",
	})
}
