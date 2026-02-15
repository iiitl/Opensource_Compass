#!/bin/sh
# Wrapper script to start core-service with environment variables

echo "🚀 [CORE-SERVICE] Starting wrapper script..."

export SERVER_PORT=8083
export DATABASE_URL="${DATABASE_URL}"
export JWT_SECRET="${JWT_SECRET}"
export GITHUB_SERVICE_URL="${GITHUB_SERVICE_URL}"
export AI_SERVICE_URL="${AI_SERVICE_URL}"
export NOTIFICATION_SERVICE_URL="${NOTIFICATION_SERVICE_URL}"

echo "📝 [CORE-SERVICE] Environment variables:"
echo "  SERVER_PORT: $SERVER_PORT"
echo "  DATABASE_URL: ${DATABASE_URL:0:20}... (length: ${#DATABASE_URL})"
echo "  JWT_SECRET: ${JWT_SECRET:0:5}*** (length: ${#JWT_SECRET})"
echo "  GITHUB_SERVICE_URL: $GITHUB_SERVICE_URL"
echo "  AI_SERVICE_URL: $AI_SERVICE_URL"
echo "  NOTIFICATION_SERVICE_URL: $NOTIFICATION_SERVICE_URL"

echo "✅ [CORE-SERVICE] Executing core-service binary..."
exec /usr/local/bin/core-service
