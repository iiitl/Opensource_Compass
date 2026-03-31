<div align="center">

# 🧭 Opensource Compass

**Your AI-powered guide to finding the perfect open-source project to contribute to.**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_15-black?logo=next.js)](https://nextjs.org/)
[![Go](https://img.shields.io/badge/Backend-Go-00ADD8?logo=go)](https://go.dev/)
[![Docker](https://img.shields.io/badge/Infra-Docker_Compose-2496ED?logo=docker)](https://docs.docker.com/compose/)
[![Supabase](https://img.shields.io/badge/Database-Supabase_(PostgreSQL)-3ECF8E?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Contributing](#-contributing)

</div>

---

## 🌟 What is Opensource Compass?

Opensource Compass is a full-stack web application that helps developers — especially beginners — **discover open-source repositories that are the perfect fit for them**. Instead of drowning in thousands of GitHub repos, you tell the platform your programming languages, domains of interest, and experience level. The AI-powered scoring engine then finds, ranks, and explains why a particular project is a great match for *you*.

Beyond discovery, Opensource Compass acts as your personal contribution hub:
- **Watch repositories** and get **real-time notifications** when new issues are opened.
- **Deep-dive into repositories** and get an AI-generated setup guide to help you make your first contribution faster.
- **Search repositories** by name or topic at any time.

---

## ✨ Features

### 🤖 AI-Powered Recommendations
The core engine fetches GitHub repositories matching your preferences and scores them using a multi-signal algorithm:

| Signal | Points | Description |
|---|---|---|
| Good First Issues | +25 | Repository has beginner-friendly issues |
| Recent Activity | +20 | Repository is actively maintained |
| Maintainer Responsiveness | +20 | Maintainer actively responds to issues/PRs |
| Clear Documentation | +15 | Repository has a well-written README |
| Tech Stack Match | up to +20 | Your languages match the repo's stack |

The result is a **score from 0-100** with a difficulty level classification (Beginner / Intermediate / Advanced) and human-readable reasons explaining the match.

### 🔍 Discover Page
Browse repositories tailored to your preferences. Search by name/topic to find any repo on GitHub in real-time. Active filters display your active language and topic preferences.

### 📋 Recommendations Page
Get a **single, highly-curated repository recommendation** with detailed scoring breakdown, AI-analyzed issues, and reasons why this repo is the best match for you right now.

### 🔖 Watchlist
Save repositories you're interested in. Watch for new issues on your favourite projects.

### 🔔 Real-Time Notifications
Get **live WebSocket notifications** for new issues opened in your watched repositories. The notification indicator shows connection status (connected/disconnected) in real-time.

### 🛠️ AI Setup Guide
Visit any repository's page and request an **AI-generated setup guide** — step-by-step instructions, tailored to the repo, to help you get your local environment running and make your first contribution.

### 🔐 Authentication
Seamless **GitHub OAuth** login flow. Your GitHub token is stored securely and used to make authenticated API requests to GitHub, giving you higher rate limits.

### ⚙️ Onboarding & Settings
A guided onboarding flow collects your **programming languages**, **domain interests** (backend, ML, DevOps, etc.), and **experience level**. Update your preferences anytime from the Settings page.

---

## 🏗️ Architecture

Opensource Compass is built as a **microservices system** orchestrated with Docker Compose.

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 15)                  │
│   Discover · Recommendations · Issues · Profile          │
│   Watchlist · Notifications · Settings · Onboarding     │
└───────────────────────┬────────────────────┬────────────┘
                        │ REST               │ WebSocket
          ┌─────────────┼────────────────────┼────────────┐
          │             │                    │            │
          ▼             ▼                    ▼            │
  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
  │ Auth Service │ │ Core Service │ │Notification Svc  │ │
  │   :8080      │ │   :8083      │ │     :8084        │ │
  │              │ │              │ └──────────────────┘ │
  │ GitHub OAuth │ │Orchestration │                      │
  │ JWT issuance │ │ Scoring      │                      │
  └──────────────┘ │ Preferences  │                      │
                   │ Watchlist    │                      │
                   └──────┬───┬──┘                      │
                          │   │                         │
             ┌────────────┘   └──────────────┐          │
             ▼                               ▼          │
  ┌──────────────────┐             ┌──────────────────┐ │
  │  GitHub Service  │             │    AI Service    │ │
  │      :8081       │             │      :8082       │ │
  │                  │             │                  │ │
  │ GitHub REST API  │             │ Groq (Mixtral)   │ │
  │ Repo Search      │             │ Gemini (fallback)│ │
  │ Issue Fetching   │             │ Issue Analysis   │ │
  └──────────────────┘             │ Setup Guides     │ │
                                   └──────────────────┘ │
                                                         │
  ┌──────────────────────────────────────────────────────┘
  │
  ▼
  ┌──────────────────┐
  │ Supabase (PgSQL) │
  │                  │
  │  users           │
  │  user_preferences│
  │  watched_repos   │
  └──────────────────┘
```

### Services at a Glance

| Service | Port | Language | Responsibility |
|---|---|---|---|
| **Frontend** | 3000 | Next.js / TypeScript | UI, auth state, real-time notifications |
| **Auth Service** | 8080 | Go | GitHub OAuth callback, JWT minting |
| **Core Service** | 8083 | Go | Orchestration, scoring, preferences, watchlist |
| **GitHub Service** | 8081 | Go | GitHub REST API proxy (repo search, issues) |
| **AI Service** | 8082 | Go | LLM calls for issue analysis & setup guides |
| **Notification Service** | 8084 | Go | WebSocket hub for real-time issue alerts |

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose
- [Node.js 18+](https://nodejs.org/) (for local frontend development)
- [Go 1.22+](https://go.dev/dl/) (for local backend development)
- A [GitHub OAuth App](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- A [Supabase](https://supabase.com) project (PostgreSQL database)
- A [Groq API key](https://console.groq.com/) (or Gemini API key)

### 1. Clone the Repository

```bash
git clone https://github.com/Vedant1703/Opensource_Compass.git
cd Opensource_Compass
```

### 2. Configure Environment Variables

Copy the example and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:<password>@<host>:<port>/<db>

# GitHub OAuth (from your GitHub OAuth App)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_TOKEN=your_personal_github_token

# JWT
JWT_SECRET=your_super_secret_jwt_key

# AI Provider (groq | gemini)
LLM_PROVIDER=groq
LLM_MODEL=mixtral-8x7b-32768
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key    # optional if using Groq
```

### 3. Start with Docker Compose

```bash
docker-compose up --build
```

All 5 backend services will be available at their respective ports. The frontend must be started separately (see step 4).

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Database Migrations

Database migrations are managed with [golang-migrate](https://github.com/golang-migrate/migrate). Migrations live in `backend/core_service/db/migrations/` and run automatically on service startup.

The schema includes:
- `users` — GitHub user profiles and tokens
- `user_preferences` — languages, domains, experience level
- `watched_repos` — user watchlist with `last_checked_at` for notification polling

---

## 🛠️ Local Development (Without Docker)

You can run each service independently for faster development iteration.

**Core Service:**
```bash
cd backend/core_service
go run ./cmd/...
```

**Auth Service:**
```bash
cd backend/auth-service
go run ./cmd/...
```

**GitHub Service:**
```bash
cd backend/github-service
go run ./cmd/...
```

**AI Service:**
```bash
cd backend/ai-service
go run ./cmd/...
```

**Notification Service:**
```bash
cd backend/notification-service
go run ./cmd/...
```

Each service reads its configuration from its own `.env` file in its directory.

---

## 📡 API Reference

All authenticated endpoints require a `Bearer <JWT>` token in the `Authorization` header.

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

### Notification Service (`:8084`)

| Protocol | Endpoint | Description |
|---|---|---|
| `WebSocket` | `/ws` | Real-time issue notifications for watched repos |

---

## 🧠 Scoring Algorithm

The recommendation engine scores each repository from **0 to 100** based on the following weighted signals:

```
Score = good_first_issues(25) + recent_activity(20) + maintainer_active(20)
      + clear_readme(15) + tech_stack_match(0-20)
```

**Difficulty Classification:**
- 🟢 **Beginner** — Score ≥ 75
- 🟡 **Intermediate** — Score ≥ 50
- 🔴 **Advanced** — Score < 50

The engine searches GitHub for repositories matching your preferred languages and domain topics, checks the top 5 results for "good first issues", enriches them with AI analysis, and returns the best match with reasons.

---

## 🤖 AI Provider Configuration

Opensource Compass supports two LLM providers, switchable via environment variable:

| Provider | Variable | Default Model |
|---|---|---|
| **Groq** (recommended) | `LLM_PROVIDER=groq` | `mixtral-8x7b-32768` |
| **Google Gemini** | `LLM_PROVIDER=gemini` | `gemini-1.5-flash` |

Groq is recommended for its **high rate limits and fast inference** speeds.

---

## 📁 Project Structure

```
Opensource_Compass/
├── frontend/               # Next.js 15 App Router frontend
│   ├── app/
│   │   ├── (auth)/         # Protected pages (require login)
│   │   │   ├── discover/   # Repository discovery + search
│   │   │   ├── recommendations/  # AI-curated recommendation
│   │   │   ├── issues/     # Issue explorer
│   │   │   ├── repo/       # Repository detail + setup guide
│   │   │   ├── watchlist/  # (implied via core service)
│   │   │   ├── notifications/  # Real-time notification feed
│   │   │   ├── profile/    # User profile
│   │   │   └── settings/   # Preferences management
│   │   ├── auth/           # GitHub OAuth landing
│   │   └── onboarding/     # First-time user setup
│   ├── components/         # Reusable UI components (Sidebar, etc.)
│   ├── contexts/           # React contexts (auth, notifications)
│   └── lib/api/            # Typed API client functions
│
├── backend/
│   ├── core_service/       # Main orchestration service (Go)
│   │   ├── internal/
│   │   │   ├── orchestration/  # Business logic & repo search
│   │   │   ├── scoring/        # Multi-signal scoring engine
│   │   │   ├── preferences/    # User preference repository
│   │   │   ├── watchlist/      # Watchlist repository
│   │   │   ├── users/          # User repository
│   │   │   ├── clients/        # GitHub & AI service clients
│   │   │   └── auth/           # JWT middleware
│   │   ├── routes/             # HTTP handlers
│   │   └── db/migrations/      # PostgreSQL migration files
│   ├── auth-service/       # GitHub OAuth + JWT service (Go)
│   ├── github-service/     # GitHub API proxy (Go)
│   ├── ai-service/         # LLM analysis service (Go)
│   │   └── internal/
│   │       ├── llm/        # Groq & Gemini clients
│   │       ├── analysis/   # Issue analysis logic
│   │       └── prompts/    # LLM prompt templates
│   └── notification-service/  # WebSocket notification hub (Go)
│
├── docker-compose.yml      # Full-stack orchestration
├── Makefile                # Development shortcuts
└── init.sql                # Initial DB schema (legacy/reference)
```

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please make sure your code follows the existing patterns and that all services still build successfully with `docker-compose up --build`.

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [Vedant Kulkarni](https://github.com/Vedant1703)

*Finding your first open-source contribution shouldn't be hard. That's why we built this.*

</div>
