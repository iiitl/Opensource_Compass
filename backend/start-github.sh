#!/bin/sh
# Wrapper script to start github-service with environment variables

echo "🚀 [GITHUB-SERVICE] Starting wrapper script..."

export PORT=8081
export GITHUB_TOKEN="${GITHUB_TOKEN}"

echo "📝 [GITHUB-SERVICE] Environment variables:"
echo "  PORT: $PORT"
echo "  GITHUB_TOKEN: ${GITHUB_TOKEN:0:10}*** (length: ${#GITHUB_TOKEN})"

echo "✅ [GITHUB-SERVICE] Executing github-service binary..."
exec /usr/local/bin/github-service
