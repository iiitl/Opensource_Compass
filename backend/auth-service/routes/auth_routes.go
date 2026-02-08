package routes

import (
	"auth-service/internal/github"
	jwtutil "auth-service/internal/jwt"
	"fmt"
	"net/http"
	"os"

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

		userID := fmt.Sprintf("%v", user["id"])
		userLogin := fmt.Sprintf("%v", user["login"])
		userAvatar := fmt.Sprintf("%v", user["avatar_url"])

		jwtToken, err := jwtutil.GenerateJWT(userID, userLogin, userAvatar)
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
		})
	})

	r.POST("/auth/logout", func(c *gin.Context) {
		// Clear cookie
		c.SetCookie("auth_token", "", -1, "/", "", false, true)
		c.JSON(http.StatusOK, gin.H{"message": "Logged out"})
	})
}
