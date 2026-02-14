package routes

import (
	"auth-service/internal/github"
	jwtutil "auth-service/internal/jwt"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(r *gin.Engine) {
	r.GET("/auth/github", func(c *gin.Context) {
		url := "https://github.com/login/oauth/authorize" +
			"?client_id=" + os.Getenv("GITHUB_CLIENT_ID") +
			"&scope=read:user user:email"

		c.Redirect(http.StatusTemporaryRedirect, url)
	})

	r.GET("/auth/github/callback", func(c *gin.Context) {
		code := c.Query("code")

		accessToken, err := github.ExchangeCode(code)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange code"})
			return
		}

		user, err := github.FetchUser(accessToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
			return
		}

		// Handle ID which might be float64 from JSON
		var userID string
		if idFloat, ok := user["id"].(float64); ok {
			userID = fmt.Sprintf("%.0f", idFloat)
		} else {
			userID = fmt.Sprintf("%v", user["id"])
		}

		userLogin := fmt.Sprintf("%v", user["login"])
		userAvatar := fmt.Sprintf("%v", user["avatar_url"])
		userEmail := ""
		if email, ok := user["email"].(string); ok {
			userEmail = email
		}

		jwtToken, err := jwtutil.GenerateJWT(userID, userLogin, userAvatar, userEmail)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
			return
		}

		// Set HttpOnly cookie
		// MaxAge: 24 hours (86400 seconds)
		// Path: /
		// Domain: localhost (for dev, might need adjustment for prod)
		// Secure: false (for dev http, true for prod https)
		// HttpOnly: true
		c.SetCookie("auth_token", jwtToken, 86400, "/", "", false, true)

		// Save GitHub token and email to core_service in background
		go saveUserDataToCore(userID, accessToken, userEmail, jwtToken)

		// Redirect to frontend success page without sensitive data
		redirect := os.Getenv("FRONTEND_URL") + "/auth/success"
		c.Redirect(http.StatusTemporaryRedirect, redirect)
	})

	r.GET("/auth/me", func(c *gin.Context) {
		tokenString, err := c.Cookie("auth_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No auth token"})
			return
		}

		claims, err := jwtutil.ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"id":       claims["user_id"],
			"username": claims["username"],
			"avatar":   claims["avatar"],
			"email":    claims["email"],
			"token":    tokenString,
		})
	})

	r.POST("/auth/logout", func(c *gin.Context) {
		// Clear cookie
		c.SetCookie("auth_token", "", -1, "/", "", false, true)
		c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
	})

	// Debug endpoint to check email fetching
	r.GET("/auth/debug/email", func(c *gin.Context) {
		token := c.Query("token")
		if token == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Token required"})
			return
		}

		email, err := github.FetchUserEmail(token)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"email": email})
	})
}

func saveUserDataToCore(userID string, githubToken string, email string, jwtToken string) {
	coreServiceURL := os.Getenv("CORE_SERVICE_URL")
	if coreServiceURL == "" {
		coreServiceURL = "http://localhost:8083"
	}

	url := fmt.Sprintf("%s/users/%s/github-token", coreServiceURL, userID)
	payload := map[string]string{
		"token": githubToken,
		"email": email,
	}
	jsonData, _ := json.Marshal(payload)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("❌ Failed to create request to save user data: %v\n", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+jwtToken)

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("❌ Failed to save user data: %v\n", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		fmt.Printf("✅ User data saved for user %s\n", userID)
	} else {
		body, _ := io.ReadAll(resp.Body)
		fmt.Printf("⚠️  Failed to save user data (status %d): %s\n", resp.StatusCode, string(body))
	}
}
