package main

import (
	"github-service/routes"
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
	token := os.Getenv("GITHUB_TOKEN")

	if token == "" {
		log.Fatal("GITHUB_TOKEN not set in environment")
	}

	log.Println("Github Token Loaded")

	r := gin.Default()

	// nginx handles CORS, so no middleware needed here

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
