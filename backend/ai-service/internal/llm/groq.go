package llm

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
)

type GroqClient struct {
	apiKey string
	model  string
}

func NewGroqClient(model string) *GroqClient {
	if model == "" {
		// Default to fast Mixtral model with large context
		model = "mixtral-8x7b-32768"
	}
	return &GroqClient{
		apiKey: os.Getenv("GROQ_API_KEY"),
		model:  model,
	}
}

// Chat implements the Client interface for Groq API
func (c *GroqClient) Chat(messages []Message) (string, error) {
	// Convert messages to Groq format
	var groqMessages []map[string]string
	for _, m := range messages {
		groqMessages = append(groqMessages, map[string]string{
			"role":    m.Role,
			"content": m.Content,
		})
	}

	// Build request body
	body := map[string]interface{}{
		"model":       c.model,
		"messages":    groqMessages,
		"temperature": 0.7,
		"max_tokens":  1024,
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return "", err
	}

	// Create HTTP request
	url := "https://api.groq.com/openai/v1/chat/completions"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.apiKey)

	// Make request
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Handle non-200 responses
	if resp.StatusCode != 200 {
		var errorBody bytes.Buffer
		errorBody.ReadFrom(resp.Body)
		errorMsg := errorBody.String()

		println("❌ Groq API Error:")
		println("   Status Code:", resp.StatusCode)
		println("   Response:", errorMsg)

		return "", errors.New("Groq request failed with status " + string(rune(resp.StatusCode)) + ": " + errorMsg)
	}

	// Parse response
	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	err = json.Unmarshal(bodyBytes, &result)
	if err != nil {
		return "", errors.New("failed to parse Groq response: " + err.Error())
	}

	// Validate response structure
	if len(result.Choices) == 0 {
		return "", errors.New("Groq returned empty response")
	}

	return result.Choices[0].Message.Content, nil
}
