package routes

import (
	"encoding/json"
	"net/http"

	"github.com/your-org/opensource-compass/ai-service/internal/analysis"
)

func AnalyzeIssue(analyzer *analysis.Analyzer) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req analysis.IssueRequest
		json.NewDecoder(r.Body).Decode(&req)

		result, err := analyzer.Analyze(req)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		json.NewEncoder(w).Encode(result)
	}
}

func GenerateSetupGuide(generator *analysis.SetupGenerator) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Readme    string `json:"readme"`
			UserLevel string `json:"user_level"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), 400)
			return
		}

		guide, err := generator.GenerateSetupGuide(req.Readme, req.UserLevel)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		// Clean up markdown code blocks if present
		// This is a simple heuristic, might need robust parsing if we want pure JSON
		// For now, return as string in a JSON wrapper
		response := map[string]string{
			"guide": guide,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
