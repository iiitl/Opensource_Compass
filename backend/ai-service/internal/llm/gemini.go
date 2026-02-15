package llm

import (
	// "fmt"
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"os"
)

type GeminiClient struct {
	apiKey string
	model  string
}

func NewGeminiClient(model string) *GeminiClient {
	return &GeminiClient{
		apiKey: os.Getenv("GEMINI_API_KEY"),
		model:  model,
	}
}

func (c *GeminiClient) Chat(messages []Message) (string, error) {

	prompt := ""
	for _, m := range messages {
		prompt += m.Content + "\n"
	}

	body := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]string{
					{"text": prompt},
				},
			},
		},
	}

	b, _ := json.Marshal(body)

	url := "https://generativelanguage.googleapis.com/v1beta/" +
		c.model + ":generateContent?key=" + c.apiKey

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(b))
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		// Read response body for error details
		var errorBody bytes.Buffer
		errorBody.ReadFrom(resp.Body)
		errorMsg := errorBody.String()

		// Log detailed error
		println("❌ Gemini API Error:")
		println("   Status Code:", resp.StatusCode)
		println("   Response:", errorMsg)

		return "", errors.New("Gemini request failed with status " + string(rune(resp.StatusCode)) + ": " + errorMsg)
	}

	var res struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	json.NewDecoder(resp.Body).Decode(&res)

	// Validate response structure
	if len(res.Candidates) == 0 || len(res.Candidates[0].Content.Parts) == 0 {
		return "", errors.New("Gemini returned empty response")
	}

	return res.Candidates[0].Content.Parts[0].Text, nil
}
