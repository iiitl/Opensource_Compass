# Combined Backend Deployment

This file contains instructions for deploying all backend services as a single web service on Render.

## Architecture

All 5 backend services run in a single container:
- **Nginx** (Port ${PORT}) - Reverse proxy routing external traffic
- **Auth Service** (Port 8080) - GitHub OAuth & JWT
- **Core Service** (Port 8083) - API Gateway & Preferences
- **GitHub Service** (Port 8081) - Repository data
- **AI Service** (Port 8082) - AI recommendations
- **Notification Service** (Port 8084) - WebSocket notifications

Services communicate via `localhost` (no inter-service networking issues).

## Files

- `backend/Dockerfile.combined` - Multi-stage build for all services
- `backend/nginx.conf` - Reverse proxy configuration
- `backend/supervisord.conf` - Process manager
- `backend/start.sh` - Startup script

## Deployment Steps

### 1. Set Environment Variables in Render Dashboard

After creating the service, set these secrets:

```bash
DATABASE_URL=<your-supabase-connection-string>
JWT_SECRET=<your-secret-key>
GITHUB_CLIENT_ID=<your-github-oauth-id>
GITHUB_CLIENT_SECRET=<your-github-oauth-secret>
GITHUB_TOKEN=<your-github-pat>
GEMINI_API_KEY=<your-gemini-key>
GROQ_API_KEY=<your-groq-key>
FRONTEND_URL=https://your-frontend.vercel.app
```

### 2. Deploy

Push to GitHub - Render auto-deploys from `render.yaml`.

### 3. Update Frontend

After deployment, update `frontend/.env.production`:

```bash
NEXT_PUBLIC_AUTH_SERVICE_URL=https://backend-xyz.onrender.com
NEXT_PUBLIC_CORE_SERVICE_URL=https://backend-xyz.onrender.com
NEXT_PUBLIC_GITHUB_SERVICE_URL=https://backend-xyz.onrender.com
NEXT_PUBLIC_AI_SERVICE_URL=https://backend-xyz.onrender.com
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=https://backend-xyz.onrender.com
NEXT_PUBLIC_WS_URL=wss://backend-xyz.onrender.com
```

Then deploy frontend to Vercel.

### 4. Update GitHub OAuth App

Set callback URL to:
```
https://backend-xyz.onrender.com/auth/callback
```

## API Routes

All requests go through nginx reverse proxy:

- `https://backend-xyz.onrender.com/auth/*` → auth-service
- `https://backend-xyz.onrender.com/api/core/*` → core-service
- `https://backend-xyz.onrender.com/api/github/*` → github-service
- `https://backend-xyz.onrender.com/api/ai/*` → ai-service
- `https://backend-xyz.onrender.com/api/notifications/*` → notification-service
- `https://backend-xyz.onrender.com/ws` → notification-service (WebSocket)

## Benefits

✅ No inter-service networking issues  
✅ Single deployment  
✅ Shared resources  
✅ Works on Render Free tier  
✅ Simplified monitoring

## Local Testing

```bash
cd backend
docker build -f Dockerfile.combined -t backend-combined .
docker run -p 10000:10000 --env-file ../.env backend-combined
```

Test endpoints:
```bash
curl http://localhost:10000/health
curl http://localhost:10000/auth/health
curl http://localhost:10000/api/core/health
```

## Troubleshooting

Check logs in Render Dashboard to see all services:
- Look for "Starting backend services" message
- Each service logs to `/var/log/supervisor/SERVICE-NAME.out.log`
- Nginx logs to `/var/log/nginx/access.log`
