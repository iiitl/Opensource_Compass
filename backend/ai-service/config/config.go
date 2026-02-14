package config

import "os"

type Config struct {
	Port        string
	GeminiKey   string
	GroqKey     string
	Model       string
	LLMProvider string // "groq" or "gemini"
}

func Load() *Config {
	return &Config{
		Port:        getEnv("PORT", getEnv("AI_SERVICE_PORT", "8082")),
		GeminiKey:   os.Getenv("GEMINI_API_KEY"),
		GroqKey:     os.Getenv("GROQ_API_KEY"),
		Model:       getEnv("LLM_MODEL", "llama-3.3-70b-versatile"),
		LLMProvider: getEnv("LLM_PROVIDER", "groq"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
