#!/bin/sh
# Wrapper script to start ai-service with environment variables

echo "🚀 [AI-SERVICE] Starting wrapper script..."

export AI_SERVICE_PORT=8082
export GEMINI_API_KEY="${GEMINI_API_KEY}"
export GROQ_API_KEY="${GROQ_API_KEY}"
export LLM_PROVIDER="${LLM_PROVIDER}"
export LLM_MODEL="${LLM_MODEL}"

echo "📝 [AI-SERVICE] Environment variables:"
echo "  AI_SERVICE_PORT: $AI_SERVICE_PORT"
echo "  GEMINI_API_KEY: ${GEMINI_API_KEY:0:10}*** (length: ${#GEMINI_API_KEY})"
echo "  GROQ_API_KEY: ${GROQ_API_KEY:0:10}*** (length: ${#GROQ_API_KEY})"
echo "  LLM_PROVIDER: $LLM_PROVIDER"
echo "  LLM_MODEL: $LLM_MODEL"

echo "✅ [AI-SERVICE] Executing ai-service binary..."
exec /usr/local/bin/ai-service
