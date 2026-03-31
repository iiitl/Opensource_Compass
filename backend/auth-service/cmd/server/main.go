package main

import (
	"auth-service/routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load the root .env file from the project root
	// Load the root .env file from the project root (optional, for local dev)
	_ = godotenv.Load("../../.env")
	_ = godotenv.Load() // Fallback to local .env

	required := []string{
		"GITHUB_CLIENT_ID",
		"GITHUB_CLIENT_SECRET",
		"JWT_SECRET",
		"FRONTEND_URL",
	}

	for _, key := range required {
		if os.Getenv(key) == "" {
			log.Fatalf("Missing required env variable: %s", key)
		}
	}

	// Debug: Print JWT secret (first 8 chars only)
	jwtSecret := os.Getenv("JWT_SECRET")
	log.Printf("🔑 Auth Service JWT_SECRET: %s... (len: %d)", jwtSecret[:8], len(jwtSecret))

	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "auth-service alive",
		})
	})

	routes.RegisterAuthRoutes(router)

	log.Println("Auth service running on :8080")
	router.Run(":8080")
}
