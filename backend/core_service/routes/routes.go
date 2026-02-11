package routes

import (
	"fmt"
	"net/http"

	"core-service/internal/auth"
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
) {
	handler := NewRecommendationHandler(orchService, jwtSecret, userRepo)
	prefHandler := NewPreferencesHandler(prefRepo, userRepo, jwtSecret)
	userHandler := NewUserHandler(userRepo, jwtSecret)

	mux.Handle("/recommendations", auth.JWTMiddleware(jwtSecret, http.HandlerFunc(handler.GetRecommendations)))
	mux.Handle("/preferences", auth.JWTMiddleware(jwtSecret, http.HandlerFunc(prefHandler.HandlePreferences)))
	mux.Handle("/users/", auth.JWTMiddleware(jwtSecret, userHandler))
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
