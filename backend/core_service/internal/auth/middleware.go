package auth

import (
	"context"
	"log"
	"net/http"
	"strings"
)

type contextKey string

const UserIDKey contextKey = "user_id"

func JWTMiddleware(secret string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "missing authorization header", http.StatusUnauthorized)
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		
		// Debug logging
		// log.Printf("DebugAuth: validating token: %s...", token[:10])

		userID, err := ExtractUserID(token, secret)
		if err != nil {
			log.Printf("❌ Auth Failed: %v. Secret len: %d", err, len(secret))
			http.Error(w, "invalid token: "+err.Error(), http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
