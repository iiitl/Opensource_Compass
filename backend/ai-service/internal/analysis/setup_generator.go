package analysis

import (
	"fmt"

	"github.com/your-org/opensource-compass/ai-service/internal/llm"
	"github.com/your-org/opensource-compass/ai-service/internal/prompts"
)

type SetupGenerator struct {
	client llm.Client
}

func NewSetupGenerator(client llm.Client) *SetupGenerator {
	return &SetupGenerator{
		client: client,
	}
}

func (g *SetupGenerator) GenerateSetupGuide(readme string, userLevel string) (string, error) {
	prompt := prompts.GenerateSetupGuidePrompt(readme, userLevel)

	// Create messages for the LLM
	messages := []llm.Message{
		{
			Role:    "system",
			Content: prompts.SetupGuideSystemPrompt,
		},
		{
			Role:    "user",
			Content: prompt,
		},
	}

	response, err := g.client.Chat(messages)
	if err != nil {
		return "", fmt.Errorf("failed to generate setup guide: %v", err)
	}

	return response, nil
}
