#!/bin/sh
# Wrapper script to start notification-service with environment variables

echo "🚀 [NOTIFICATION-SERVICE] Starting wrapper script..."

export PORT=8084

echo "📝 [NOTIFICATION-SERVICE] Environment variables:"
echo "  PORT: $PORT"

echo "✅ [NOTIFICATION-SERVICE] Executing notification-service binary..."
exec /usr/local/bin/notification-service
