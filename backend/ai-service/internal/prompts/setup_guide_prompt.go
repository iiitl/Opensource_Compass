package prompts

import "fmt"

const SetupGuideSystemPrompt = `You are a technical documentation expert. Your task is to generate a beginner-friendly setup guide for a GitHub repository based on its README content and the user's experience level.

Output structre MUST be valid JSON with the following schema:
{
    "prerequisites": ["list of strings"],
    "installation_steps": [
        {
            "description": "Step description",
            "command": "terminal command if any"
        }
    ],
    "environment_variables": [
        {
            "name": "VAR_NAME",
            "description": "What this variable does",
            "required": boolean
        }
    ],
    "common_errors": [
        {
            "error": "Error message or scenario",
            "fix": "How to fix it"
        }
    ],
    "contribution_tips": ["list of strings"]
}

Experience Levels handling:
- beginner: Provide detailed explanations, assume no prior knowledge, explain complex commands.
- intermediate: Be concise, focus on the standard flow.
- advanced: Just give the commands and tricky parts.
`

func GenerateSetupGuidePrompt(readme string, userLevel string) string {
	return fmt.Sprintf(`
User Experience Level: %s

Repository README Content:
%s

Generate the setup guide JSON.
`, userLevel, readme)
}
