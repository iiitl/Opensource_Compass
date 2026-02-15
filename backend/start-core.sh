#!/bin/sh
# Wrapper script to start core-service with environment variables
export SERVER_PORT=8083
export DATABASE_URL="${DATABASE_URL}"
export JWT_SECRET="${JWT_SECRET}"
export GITHUB_SERVICE_URL="${GITHUB_SERVICE_URL}"
export AI_SERVICE_URL="${AI_SERVICE_URL}"
export NOTIFICATION_SERVICE_URL="${NOTIFICATION_SERVICE_URL}"

exec /usr/local/bin/core-service
