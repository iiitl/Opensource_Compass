package routes

import (
	"fmt"
	"net/http"

	"core-service/internal/auth"
	"core-service/internal/orchestration"
)

func RegisterRoutes(
	mux *http.ServeMux,
	orchService *orchestration.Service,
	jwtSecret string,
) {
	handler := NewRecommendationHandler(orchService, jwtSecret)

	mux.Handle("/recommendations", auth.JWTMiddleware(jwtSecret, http.HandlerFunc(handler.GetRecommendations)))
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
