#!/bin/sh
set -e

# Replace PORT placeholder in nginx config with actual PORT env var
PORT=${PORT:-10000}
sed -i "s/\${PORT:-10000}/$PORT/g" /etc/nginx/nginx.conf

echo "Starting backend services on port $PORT..."
echo "Auth Service: http://localhost:8080"
echo "Core Service: http://localhost:8083"
echo "GitHub Service: http://localhost:8081"
echo "AI Service: http://localhost:8082"
echo "Notification Service: http://localhost:8084"
echo "Nginx Proxy: http://0.0.0.0:$PORT"

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisord.conf
