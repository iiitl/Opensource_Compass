#!/bin/sh
# Wrapper script to start auth-service with environment variables

echo "🚀 [AUTH-SERVICE] Starting wrapper script..."

# Export and log environment variables
export PORT=8080
export GITHUB_CLIENT_ID="${GITHUB_CLIENT_ID}"
export GITHUB_CLIENT_SECRET="${GITHUB_CLIENT_SECRET}"
export JWT_SECRET="${JWT_SECRET}"
export FRONTEND_URL="${FRONTEND_URL}"
export CORE_SERVICE_URL="${CORE_SERVICE_URL}"

echo "📝 [AUTH-SERVICE] Environment variables:"
echo "  PORT: $PORT"
echo "  GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID:0:10}... (length: ${#GITHUB_CLIENT_ID})"
echo "  GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET:0:5}*** (length: ${#GITHUB_CLIENT_SECRET})"
echo "  JWT_SECRET: ${JWT_SECRET:0:5}*** (length: ${#JWT_SECRET})"
echo "  FRONTEND_URL: $FRONTEND_URL"
echo "  CORE_SERVICE_URL: $CORE_SERVICE_URL"

echo "✅ [AUTH-SERVICE] Executing auth-service binary..."
exec /usr/local/bin/auth-service
