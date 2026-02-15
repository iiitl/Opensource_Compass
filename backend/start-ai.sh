#!/bin/sh
# Wrapper script to start ai-service with environment variables
export AI_SERVICE_PORT=8082
export GEMINI_API_KEY="${GEMINI_API_KEY}"
export GROQ_API_KEY="${GROQ_API_KEY}"
export LLM_PROVIDER="${LLM_PROVIDER}"
export LLM_MODEL="${LLM_MODEL}"

exec /usr/local/bin/ai-service
