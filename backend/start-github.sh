#!/bin/sh
# Wrapper script to start github-service with environment variables
export PORT=8081
export GITHUB_TOKEN="${GITHUB_TOKEN}"

exec /usr/local/bin/github-service
