package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/your-org/opensource-compass/ai-service/config"
	"github.com/your-org/opensource-compass/ai-service/internal/analysis"
	"github.com/your-org/opensource-compass/ai-service/internal/llm"
	"github.com/your-org/opensource-compass/ai-service/routes"
)

func main() {
	// Load the root .env file from the project root
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("No .env file found at ../../.env, checking current directory")
		_ = godotenv.Load() // Fallback to local .env
	}

	cfg := config.Load()

	// Initialize LLM client based on provider
	var llmClient llm.Client
	if cfg.LLMProvider == "groq" {
		log.Println("Using Groq LLM provider")
		llmClient = llm.NewGroqClient(cfg.Model)
	} else {
		log.Println("Using Gemini LLM provider")
		llmClient = llm.NewGeminiClient(cfg.Model)
	}

	analyzer := analysis.NewAnalyzer(llmClient)
	setupGenerator := analysis.NewSetupGenerator(llmClient)

	http.HandleFunc("/analyze-issue", routes.AnalyzeIssue(analyzer))
	http.HandleFunc("/generate-setup-guide", routes.GenerateSetupGuide(setupGenerator))

	log.Println("AI Service running on port", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, nil))
}
