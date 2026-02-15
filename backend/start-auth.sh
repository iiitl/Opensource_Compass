#!/bin/sh
# Wrapper script to start auth-service with environment variables
export PORT=8080
export GITHUB_CLIENT_ID="${GITHUB_CLIENT_ID}"
export GITHUB_CLIENT_SECRET="${GITHUB_CLIENT_SECRET}"
export JWT_SECRET="${JWT_SECRET}"
export FRONTEND_URL="${FRONTEND_URL}"
export CORE_SERVICE_URL="${CORE_SERVICE_URL}"

exec /usr/local/bin/auth-service
