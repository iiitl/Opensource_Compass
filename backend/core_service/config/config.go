package config

import (
	"log"
	"os"
)

type Config struct {
	ServerPort         string
	DatabaseURL        string
	GitHubSvcURL       string
	AISvcURL           string
	JWTSecret          string
	NotificationSvcURL string // NEW
}

func Load() *Config {
	cfg := &Config{
		ServerPort:         getEnv("PORT", getEnv("SERVER_PORT", "8083")),
		DatabaseURL:        getEnv("DATABASE_URL", ""),
		GitHubSvcURL:       ensureScheme(getEnv("GITHUB_SERVICE_URL", "http://localhost:8081")),
		AISvcURL:           ensureScheme(getEnv("AI_SERVICE_URL", "http://localhost:8082")),
		JWTSecret:          getEnv("JWT_SECRET", "YOE9SFJ5fwVglRkLLpOaLBeX+rT2MlD3INR2LZ+ewrc="),
		NotificationSvcURL: ensureScheme(getEnv("NOTIFICATION_SERVICE_URL", "http://notification-service:8084")),
	}

	return cfg
}

func getEnv(key, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	if defaultVal == "" {
		log.Printf("WARNING: %s not set\n", key)
	}

	return defaultVal
}

func ensureScheme(url string) string {
	if len(url) > 4 && url[:4] != "http" {
		return "http://" + url
	}
	return url
}
