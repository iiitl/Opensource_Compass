<div align="center">

# 🧭 Opensource Compass

**Your AI-powered guide to finding the perfect open-source project to contribute to.**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_16-black?logo=next.js)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Backend-Go_1.22-00ADD8?logo=go)](https://go.dev/)
[![Docker](https://img.shields.io/badge/Infra-Docker_Compose-2496ED?logo=docker)](https://docs.docker.com/compose/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Local Dev (No Docker)](#️-local-development-without-docker) • [API Reference](#-api-reference) • [Contributing](#-contributing) • [Troubleshooting](#-troubleshooting)

</div>

---

## 🌟 What is Opensource Compass?

Opensource Compass helps developers — especially beginners — **discover open-source repositories that are the perfect fit for them**. Instead of drowning in thousands of GitHub repos, you tell the platform your programming languages, domains of interest, and experience level. The AI-powered engine then finds, ranks, and explains *why* a particular project is a great match for you.

**Key capabilities:**
- 🤖 AI-scored repository recommendations tailored to your skills
- 🔍 Real-time GitHub repository search and discovery
- 🔖 Watchlist with live WebSocket notifications for new issues
- 🛠️ AI-generated setup guides to make your first contribution easier
- 🔐 Secure GitHub OAuth login (no password needed)

---

## ✨ Features

### 🤖 AI-Powered Recommendations
The scoring engine fetches GitHub repositories matching your preferences and scores them:

| Signal | Points | Description |
|---|---|---|
| Good First Issues | +25 | Repository has beginner-friendly issues |
| Recent Activity | +20 | Repository is actively maintained |
| Maintainer Responsiveness | +20 | Maintainer actively responds to issues/PRs |
| Clear Documentation | +15 | Repository has a well-written README |
| Tech Stack Match | up to +20 | Your languages match the repo's stack |

### Other Features
- **Discover Page** — Browse and search all of GitHub in real-time with your filters active
- **Recommendations Page** — Get one highly-curated pick with a full scoring breakdown
- **Watchlist** — Save repos and get notified when new issues are opened (via WebSocket)
- **AI Setup Guide** — Per-repo AI-generated contribution guide tailored to your experience level
- **Settings & Onboarding** — Configure languages, domain interests, and experience level

---

## 🏗️ Architecture

Opensource Compass uses a **microservices architecture** orchestrated with Docker Compose.

```
Browser (localhost:3000)
       │
       ├── REST ──► Auth Service    (:8080) — GitHub OAuth, JWT issuance
       ├── REST ──► Core Service    (:8083) — Orchestration, scoring, prefs, watchlist
       ├── REST ──► GitHub Service  (:8081) — GitHub API proxy (search, issues)
       └── WS  ──► Notification Svc (:8084) — Real-time issue alerts
                         │
              Core Service calls:
              ├── GitHub Service  (:8081)
              └── AI Service      (:8082) — LLM (Groq / Gemini)
                         │
              Core Service reads/writes:
              └── Supabase PostgreSQL (cloud database)
```

### Services at a Glance

| Service | Port | Language | Responsibility |
|---|---|---|---|
| **Frontend** | 3000 | Next.js / TypeScript | UI, auth state, real-time notifications |
| **Auth Service** | 8080 | Go (Gin) | GitHub OAuth callback, JWT minting |
| **Core Service** | 8083 | Go (net/http) | Orchestration, scoring, preferences, watchlist |
| **GitHub Service** | 8081 | Go (Gin) | GitHub REST API proxy (repo search, issues) |
| **AI Service** | 8082 | Go (Gin) | LLM calls for issue analysis & setup guides |
| **Notification Service** | 8084 | Go (net/http) | WebSocket hub for real-time issue alerts |

---

## 🚀 Getting Started

> **Estimated time:** ~15–20 minutes on your first setup.

### Prerequisites

Before you start, make sure you have these installed:

| Tool | Version | Where to get it |
|---|---|---|
| **Docker Desktop** | Latest | https://www.docker.com/products/docker-desktop/ |
| **Node.js** | 18 or higher | https://nodejs.org/ |
| **Git** | Any | https://git-scm.com/ |

> Go is **not required** unless you want to run services outside Docker.

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Vedant1703/Opensource_Compass.git
cd Opensource_Compass
```

---

### Step 2 — Gather Your Credentials

You need **4 things** before you can run the project. Here's exactly where to get each one:

#### 2a. Supabase Database URL

1. Go to [https://supabase.com](https://supabase.com) and sign up (free).
2. Click **"New project"** → give it a name → set a database password → **save the password somewhere safe**.
3. Wait ~1 minute for the project to be provisioned.
4. In your project dashboard go to: **Settings → Database → Connection String → URI**.
5. Copy the URI. It will look like:
   ```
   postgresql://postgres.<project-ref>:<your-password>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
   ```
6. Replace `<your-password>` in the URI with the password you set in step 2.

#### 2b. GitHub OAuth App (Client ID & Secret)

1. Go to [https://github.com/settings/developers](https://github.com/settings/developers).
2. Click **"New OAuth App"**.
3. Fill in the form:
   - **Application name**: `Opensource Compass` (or anything you like)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:8080/auth/github/callback`  ← **This must be exact**
4. Click **"Register application"**.
5. Copy the **Client ID** shown on the page.
6. Click **"Generate a new client secret"** → copy the secret (it only shows once!).

#### 2c. GitHub Personal Access Token

This is separate from the OAuth app — it gives the app higher API rate limits (5,000 req/hr instead of 60).

1. Go to [https://github.com/settings/tokens](https://github.com/settings/tokens).
2. Click **"Generate new token (classic)"**.
3. Give it a name like `Opensource Compass`.
4. Select the **`public_repo`** scope (that's all that's needed).
5. Click **"Generate token"** → copy it (only shown once!).

#### 2d. Groq API Key (for AI features)

Groq is free and gives you fast LLM inference.

1. Go to [https://console.groq.com](https://console.groq.com) and sign up (free, no credit card needed).
2. Go to **API Keys** in the sidebar.
3. Click **"Create API Key"** → give it a name → copy the key.

---

### Step 3 — Configure Environment Variables

#### 3a. Root `.env` (used by Docker Compose)

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
DATABASE_URL=postgresql://postgres.<ref>:<password>@...
GITHUB_CLIENT_ID=<from step 2b>
GITHUB_CLIENT_SECRET=<from step 2b>
GITHUB_TOKEN=<from step 2c>
JWT_SECRET=<run: openssl rand -hex 32>
LLM_PROVIDER=groq
LLM_MODEL=llama-3.3-70b-versatile
GROQ_API_KEY=<from step 2d>
GEMINI_API_KEY=your_gemini_api_key   # leave as-is if using Groq
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8080
NEXT_PUBLIC_CORE_SERVICE_URL=http://localhost:8083
NEXT_PUBLIC_GITHUB_SERVICE_URL=http://localhost:8081
AUTH_REDIRECT_URL=http://localhost:3000/auth/success
```

> **Generate JWT_SECRET** (one-time): run `openssl rand -hex 32` in your terminal and paste the output.

#### 3b. Frontend `.env.local`

```bash
cp frontend/.env.local.example frontend/.env.local
```

This file already has the correct defaults — you don't need to change anything unless you're using non-default ports.

---

### Step 4 — Start the Backend (Docker Compose)

```bash
docker-compose up --build
```

> The first build takes **3–5 minutes** while Docker downloads Go images and compiles each service. Subsequent starts are much faster.

You should see logs like:
```
compass_core    | Migrations applied successfully
compass_core    | Core service running on :8083
compass_auth    | Auth service running on :8080
compass_github  | Github service running on :8081
compass_ai      | AI Service running on port 8082
compass_notification | Notification Service running on :8084
```

If you see all 5 services running, the backend is ready. ✅

---

### Step 5 — Start the Frontend

Open a **new terminal** (keep Docker Compose running in the first one):

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
▲ Next.js 16
- Local: http://localhost:3000
✓ Ready in 500ms
```

---

### Step 6 — Open the App

Visit [http://localhost:3000](http://localhost:3000) in your browser.

Click **"Sign in with GitHub"** and you'll be redirected through GitHub OAuth and then to the onboarding page where you set your preferences.

---

## 🛠️ Local Development (Without Docker)

You can run each service independently for faster iteration. Each service loads environment variables from its own `.env.example` file.

First, copy the example files for the services you want to run:

```bash
cp backend/auth-service/.env.example      backend/auth-service/.env
cp backend/core_service/.env.example      backend/core_service/.env
cp backend/github-service/.env.example    backend/github-service/.env
cp backend/ai-service/.env.example        backend/ai-service/.env
cp backend/notification-service/.env.example backend/notification-service/.env
```

Fill in the values in each file (they only contain the variables relevant to that service).

Then run each service:

```bash
# Terminal 1 — Auth Service
cd backend/auth-service && go run ./cmd/server/...

# Terminal 2 — Core Service
cd backend/core_service && go run ./cmd/server/...

# Terminal 3 — GitHub Service
cd backend/github-service && go run ./cmd/server/...

# Terminal 4 — AI Service
cd backend/ai-service && go run ./cmd/server/...

# Terminal 5 — Notification Service
cd backend/notification-service && go run ./cmd/server/...

# Terminal 6 — Frontend
cd frontend && npm run dev
```

> **Note:** When running services locally (not in Docker), service URLs in each `.env` should point to `localhost` instead of Docker container names. For example, `GITHUB_SERVICE_URL=http://localhost:8081` instead of `http://github-service:8081`.

---

## 📡 API Reference

All authenticated endpoints require an `Authorization: Bearer <JWT>` header. The JWT is obtained after GitHub OAuth login.

### Core Service (`:8083`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/recommendations` | ✅ | Get AI-scored repository recommendation |
| `GET` | `/repos/search` | ✅ | Search/discover repositories |
| `GET` | `/preferences` | ✅ | Get user preferences |
| `POST` | `/preferences` | ✅ | Save user preferences |
| `GET` | `/watchlist` | ✅ | List watched repositories |
| `POST` | `/watchlist` | ✅ | Add a repo to watchlist |
| `DELETE` | `/watchlist` | ✅ | Remove a repo from watchlist |
| `GET` | `/watchlist/check` | ✅ | Check if a repo is in watchlist |
| `GET` | `/repo/setup-guide` | ✅ | Get AI-generated contribution setup guide |
| `GET/PATCH` | `/users/` | ✅ | Get or update user profile |
| `GET` | `/db-check` | ❌ | Health check with DB connectivity |

### Auth Service (`:8080`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/auth/github` | ❌ | Initiate GitHub OAuth flow |
| `GET` | `/auth/github/callback` | ❌ | GitHub OAuth callback, returns JWT |
| `GET` | `/auth/me` | ✅ | Get current authenticated user |

### GitHub Service (`:8081`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/repos/search` | ❌ | Search repos by language/domain |
| `GET` | `/repos/:owner/:repo` | ❌ | Get single repo info |
| `GET` | `/issues/good-first` | ❌ | Get good-first-issue count for a repo |
| `GET` | `/repos/:owner/:repo/readme` | ❌ | Get repo README content |

### Notification Service (`:8084`)

| Protocol | Endpoint | Description |
|---|---|---|
| `WebSocket` | `/ws?user_id=<id>` | Real-time issue notifications for watched repos |

---

## 🧠 Scoring Algorithm

```
Score = good_first_issues(25) + recent_activity(20) + maintainer_active(20)
      + clear_readme(15) + tech_stack_match(0–20)
```

**Difficulty Classification:**
- 🟢 **Beginner** — Score ≥ 75
- 🟡 **Intermediate** — Score ≥ 50
- 🔴 **Advanced** — Score < 50

---

## 🤖 AI Provider Configuration

Opensource Compass supports two LLM providers, switchable via environment variable:

| Provider | `LLM_PROVIDER` | `LLM_MODEL` | Free tier |
|---|---|---|---|
| **Groq** (recommended) | `groq` | `llama-3.3-70b-versatile` | ✅ Yes |
| **Google Gemini** | `gemini` | `gemini-1.5-flash` | ✅ Yes |

Groq is recommended for its **high rate limits and very fast inference**.

> ⚠️ The `mixtral-8x7b-32768` model was decommissioned by Groq in March 2025. Use `llama-3.3-70b-versatile` instead.

---

## 📁 Project Structure

```
Opensource_Compass/
├── .env.example                # Root env template (start here)
├── docker-compose.yml          # Full-stack orchestration
│
├── frontend/                   # Next.js 16 App Router frontend
│   ├── .env.local.example      # Frontend env template
│   ├── app/
│   │   ├── (auth)/             # Protected pages (require login)
│   │   │   ├── discover/       # Repository discovery + search
│   │   │   ├── recommendations/# AI-curated recommendation
│   │   │   ├── repo/           # Repository detail + setup guide
│   │   │   ├── notifications/  # Real-time notification feed
│   │   │   ├── profile/        # User profile
│   │   │   └── settings/       # Preferences management
│   │   ├── auth/               # GitHub OAuth landing page
│   │   └── onboarding/         # First-time user setup
│   ├── components/             # Reusable UI components
│   ├── contexts/               # React contexts (auth, notifications)
│   └── lib/api/                # Typed API client functions
│
└── backend/
    ├── auth-service/           # GitHub OAuth + JWT (Go/Gin)
    │   └── .env.example        # ← Auth service env template
    ├── core_service/           # Orchestration, scoring (Go/net/http)
    │   ├── .env.example        # ← Core service env template
    │   └── db/migrations/      # PostgreSQL migration SQL files
    ├── github-service/         # GitHub API proxy (Go/Gin)
    │   └── .env.example        # ← GitHub service env template
    ├── ai-service/             # LLM analysis service (Go/Gin)
    │   ├── .env.example        # ← AI service env template
    │   └── internal/
    │       ├── llm/            # Groq & Gemini API clients
    │       ├── analysis/       # Issue analysis logic
    │       └── prompts/        # LLM prompt templates
    └── notification-service/   # WebSocket notification hub (Go)
        └── .env.example        # ← Notification service env template
```

---

## 🔧 Troubleshooting

### ❌ "Failed to fetch" or CORS errors in the browser console

The frontend makes direct browser-to-backend requests. If you see CORS errors:
- Make sure all backend services are running (`docker-compose up --build`)
- Make sure you restarted `npm run dev` after editing `frontend/.env.local`
- All `NEXT_PUBLIC_*` URLs must use `localhost` not Docker container names

### ❌ "POST /undefined/preferences 404"

This means `NEXT_PUBLIC_CORE_SERVICE_URL` is `undefined`. Fix:
1. Check that `frontend/.env.local` exists and contains `NEXT_PUBLIC_CORE_SERVICE_URL=http://localhost:8083`
2. Restart `npm run dev` (env changes require a restart)

### ❌ AI service error: "model decommissioned"

The `mixtral-8x7b-32768` model was removed by Groq. Fix:
- In your root `.env`, set: `LLM_MODEL=llama-3.3-70b-versatile`
- Rebuild: `docker-compose up -d --build ai-service`

### ❌ Database migration errors on startup

Check that your `DATABASE_URL` in `.env` is correct. Common mistakes:
- Forgot to replace `<your-password>` in the URL
- Using the "Session mode" URL instead of "Transaction mode" (Supabase offers both)
- The Supabase project is paused (free projects pause after 1 week of inactivity — resume it at supabase.com)

### ❌ GitHub OAuth callback gives "Invalid client_id"

- Double-check `GITHUB_CLIENT_ID` in `.env` matches exactly the Client ID shown in your GitHub OAuth App settings
- Make sure the callback URL in your GitHub OAuth App is exactly: `http://localhost:8080/auth/github/callback`

### ❌ Docker build is very slow / fails

- Make sure Docker Desktop is running and has at least 4 GB of RAM allocated
- Try `docker-compose down` and `docker-compose up --build` again
- On Mac: Docker Desktop → Settings → Resources → increase Memory to 4 GB+

---

## 🤝 Contributing

Contributions are very welcome! Here's how to get started:

1. **Fork** the repository on GitHub
2. **Clone** your fork: `git clone https://github.com/<your-username>/Opensource_Compass.git`
3. **Create** a feature branch: `git checkout -b feature/my-awesome-feature`
4. **Set up** your local environment following the [Getting Started](#-getting-started) guide above
5. **Write** your changes and test them with `docker-compose up --build`
6. **Commit** with a descriptive message: `git commit -m 'feat: add awesome feature'`
7. **Push** your branch: `git push origin feature/my-awesome-feature`
8. **Open** a Pull Request on GitHub

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `refactor:` | Code cleanup (no behavior change) |
| `chore:` | Dependency updates, config changes |

### Code Guidelines

- All backend services are in Go — follow standard Go formatting (`gofmt`)
- Frontend is TypeScript/React — follow existing component patterns
- Make sure all services still build: `docker-compose up --build`
- Keep each service's `.env.example` up to date if you add new env vars

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [Vedant Kulkarni](https://github.com/Vedant1703) and contributors

*Finding your first open-source contribution shouldn't be hard. That's why we built this.*

</div>
