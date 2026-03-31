#!/bin/sh
set -e

# Set default PORT if not provided
PORT=${PORT:-10000}

echo "=======  Backend Combined Service Starting ======="
echo "PORT environment variable: $PORT"

# Replace PORT placeholder in nginx config
echo "Configuring nginx to listen on port $PORT..."
sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/nginx.conf

# Validate nginx configuration
echo "Validating nginx configuration..."
/usr/sbin/nginx -t

echo "Starting all services..."
echo "  - Nginx Proxy: http://0.0.0.0:$PORT"
echo "  - Auth Service: http://localhost:8080"
echo "  - Core Service: http://localhost:8083"
echo "  - GitHub Service: http://localhost:8081"
echo "  - AI Service: http://localhost:8082"
echo "  - Notification Service: http://localhost:8084"
echo "=================================================="

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisord.conf
