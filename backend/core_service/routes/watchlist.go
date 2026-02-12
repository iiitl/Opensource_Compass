package routes

import (
	"encoding/json"
	"net/http"

	"core-service/internal/watchlist"
)

type WatchlistRoutes struct {
	repo *watchlist.Repository
}

func RegisterWatchlistRoutes(mux *http.ServeMux, repo *watchlist.Repository) {
	routes := &WatchlistRoutes{repo: repo}

	mux.HandleFunc("/watchlist", routes.handleWatchlist)
	mux.HandleFunc("/watchlist/check", routes.handleCheckStatus)
}

func (h *WatchlistRoutes) handleWatchlist(w http.ResponseWriter, r *http.Request) {
	// Extract user ID from context (set by auth middleware)
	// For now, assuming middleware sets "user_id" in header or context.
	// Since we don't have the context middleware code handy here,
	// we will assume X-User-ID header is propagated by auth-service or gateway.
	// NOTE: In production, use properly authenticated context.
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case http.MethodGet:
		h.list(w, r, userID)
	case http.MethodPost:
		h.add(w, r, userID)
	case http.MethodDelete:
		h.remove(w, r, userID)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *WatchlistRoutes) list(w http.ResponseWriter, r *http.Request, userID string) {
	repos, err := h.repo.List(r.Context(), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(repos)
}

func (h *WatchlistRoutes) add(w http.ResponseWriter, r *http.Request, userID string) {
	var req watchlist.CreateWatchlistRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.RepoOwner == "" || req.RepoName == "" {
		http.Error(w, "repo_owner and repo_name are required", http.StatusBadRequest)
		return
	}

	if err := h.repo.Add(r.Context(), userID, req.RepoOwner, req.RepoName); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *WatchlistRoutes) remove(w http.ResponseWriter, r *http.Request, userID string) {
	owner := r.URL.Query().Get("owner")
	name := r.URL.Query().Get("name")

	if owner == "" || name == "" {
		http.Error(w, "owner and name query params are required", http.StatusBadRequest)
		return
	}

	if err := h.repo.Remove(r.Context(), userID, owner, name); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *WatchlistRoutes) handleCheckStatus(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	owner := r.URL.Query().Get("owner")
	name := r.URL.Query().Get("name")

	if owner == "" || name == "" {
		http.Error(w, "owner and name query params are required", http.StatusBadRequest)
		return
	}

	exists, err := h.repo.IsWatched(r.Context(), userID, owner, name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"watched": exists})
}
