#!/bin/bash

# Load environment variables from the root .env
if [ -f .env ]; then
    set -a
    source .env
    set +a
else
    echo "Root .env file not found."
    exit 1
fi

echo "Starting Services..."

# Start Github Service (Port 8081)
echo "[Github Service] Starting on :8081..."
(cd backend/github-service && go run cmd/server/main.go) &
PID_GITHUB=$!

# Start AI Service (Port 8082)
echo "[AI Service] Starting on :8082..."
(cd backend/ai-service && go run cmd/server/main.go) &
PID_AI=$!

# Start Auth Service (Port 8080)
echo "[Auth Service] Starting on :8080..."
# Auth service expects FRONTEND_URL, GITHUB_CLIENT_ID, etc. which are in root .env
(cd backend/auth-service && go run cmd/server/main.go) &
PID_AUTH=$!

# Start Core Service (Port 8083)
echo "[Core Service] Starting on :8083..."
(cd backend/core_service && go run cmd/server/main.go) &
PID_CORE=$!

# Wait for services to initialize
sleep 5

echo "All services are running."
echo "Core Service: http://localhost:8083"
echo "pkill -P $$" to stop all services if script is killed abruptly.

# Handle shutdown
trap "echo 'Stopping all services...'; kill $PID_GITHUB $PID_AI $PID_AUTH $PID_CORE; exit" SIGINT SIGTERM

wait
