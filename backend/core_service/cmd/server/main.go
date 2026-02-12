package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"core-service/config"
	"core-service/internal/clients"
	"core-service/internal/db"
	"core-service/internal/orchestration"
	"core-service/internal/preferences"
	"core-service/internal/users"
	"core-service/internal/watchlist"
	"core-service/routes"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	_ = godotenv.Load()
	cfg := config.Load()
	aiClient := clients.NewAIClient(cfg.AISvcURL)
	githubClient := clients.NewGitHubClient(cfg.GitHubSvcURL)

	var dbPool *pgxpool.Pool
	var err error

	if cfg.DatabaseURL != "" {
		dbPool, err = db.Connect(cfg.DatabaseURL)
		if err != nil {
			log.Fatal("Failed to connect to database:", err)
		}
	}

	mux := http.NewServeMux()
	routes.RegisterHealthRoutes(mux)

	prefRepo := preferences.NewRepository(dbPool)
	userRepo := users.NewRepository(dbPool)
	watchlistRepo := watchlist.NewRepository(dbPool)

	// Initialize Notification Service Notifier
	notifier := watchlist.NewNotifier(cfg.NotificationSvcURL)

	// Initialize Poller (runs every 2 minutes)
	poller := watchlist.NewPoller(watchlistRepo, githubClient, notifier, 2*time.Minute)

	// Start Poller in background
	ctx := context.Background() // TODO: Use proper context with cancellation on shutdown
	go poller.Start(ctx)

	orchService := orchestration.NewService(prefRepo, aiClient, githubClient)

	routes.RegisterRoutes(mux, orchService, cfg.JWTSecret, prefRepo, userRepo)
	routes.RegisterWatchlistRoutes(mux, watchlistRepo)

	// Wrap with CORS middleware
	handler := corsMiddleware(mux)

	log.Printf("Core service running on :%s\n", cfg.ServerPort)
	log.Fatal(http.ListenAndServe(":"+cfg.ServerPort, handler))
}
