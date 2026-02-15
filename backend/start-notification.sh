#!/bin/sh
# Wrapper script to start notification-service with environment variables
export PORT=8084

exec /usr/local/bin/notification-service
