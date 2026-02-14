package routes

import (
	"fmt"
	"net/http"

	"core-service/internal/auth"
	"core-service/internal/clients"
	"core-service/internal/handlers"
	"core-service/internal/orchestration"
	"core-service/internal/preferences"
	"core-service/internal/users"
)

func RegisterRoutes(
	mux *http.ServeMux,
	orchService *orchestration.Service,
	jwtSecret string,
	prefRepo *preferences.Repository,
	userRepo *users.Repository,
	githubClient *clients.GitHubClient,
	aiClient *clients.AIClient,
) {
	handler := NewRecommendationHandler(orchService, jwtSecret, userRepo)
	prefHandler := NewPreferencesHandler(prefRepo, userRepo, jwtSecret)
	repoHandler := NewRepoHandler(orchService, jwtSecret, userRepo)
	userHandler := NewUserHandler(userRepo, jwtSecret)
	setupHandler := handlers.NewSetupGuideHandler(githubClient, aiClient, userRepo)

	mux.Handle("/recommendations", auth.JWTMiddleware(jwtSecret, http.HandlerFunc(handler.GetRecommendations)))
	mux.Handle("/repos/search", auth.JWTMiddleware(jwtSecret, http.HandlerFunc(repoHandler.HandleSearch)))
	mux.Handle("/preferences", auth.JWTMiddleware(jwtSecret, http.HandlerFunc(prefHandler.HandlePreferences)))
	mux.Handle("/users/", auth.JWTMiddleware(jwtSecret, userHandler))
	mux.Handle("/repo/setup-guide", auth.JWTMiddleware(jwtSecret, http.HandlerFunc(setupHandler.GetSetupGuide)))
	mux.HandleFunc("/db-check", func(w http.ResponseWriter, r *http.Request) {
		count, err := orchService.DBCheck(r.Context())
		if err != nil {
			http.Error(w, "DB Error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(fmt.Sprintf(`{"status": "connected", "preference_count": %d}`, count)))
	})
}
