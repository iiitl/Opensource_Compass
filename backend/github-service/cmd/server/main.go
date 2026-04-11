package main

import (
	"github-service/routes"
	"log"
	"net/http"
	"os"
	"github-service/internal/repos"
	"time"


	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// corsMiddleware adds CORS headers and handles preflight OPTIONS requests.
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		frontendURL := os.Getenv("FRONTEND_URL")
		if frontendURL == "" {
			frontendURL = "http://localhost:3000"
		}

		c.Header("Access-Control-Allow-Origin", frontendURL)
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

var cache *repos.RepoCache

func init() {
	// Initialize cache with 5-minute TTL
	cache = repos.NewRepoCache(5 * time.Minute)

	// Start background cleanup goroutine
	go func() {
		ticker := time.NewTicker(10 * time.Minute)
		defer ticker.Stop()
		for range ticker.C {
			cache.Clean()
		}
	}()
}

func main() {
	// Load the root .env file from the project root (optional, for local dev)
	_ = godotenv.Load("../../.env")
	_ = godotenv.Load() // Fallback to local .env
	token := os.Getenv("GITHUB_TOKEN")

	log.Println("HELLO")

	if token == "" {
		log.Fatal("GITHUB_TOKEN not set in environment")
	}

	log.Println("Github Token Loaded")

	r := gin.Default()

	// Apply CORS middleware so browser preflight OPTIONS requests are handled
	r.Use(corsMiddleware())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "github-service alive",
		})
	})

	routes.RegisterGithubRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Println("Github service running on :" + port)
	r.Run(":" + port)
}
