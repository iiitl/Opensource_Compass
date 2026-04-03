<div align="center">

# 🤝 Contributing to Opensource Compass

**Welcome! We're so glad you're here.**

Opensource Compass is a community-driven project and we actively welcome contributions from developers of all experience levels — whether this is your first open-source PR or your hundredth.

This guide will walk you through **everything** you need to know to make a successful contribution.

</div>

---

## 📖 Table of Contents

1. [Before You Start](#-before-you-start)
2. [Understanding the Project](#-understanding-the-project)
3. [Setting Up Your Local Environment](#-setting-up-your-local-environment)
4. [Finding an Issue to Work On](#-finding-an-issue-to-work-on)
5. [The Git Workflow](#-the-git-workflow)
6. [Making Your Changes](#-making-your-changes)
7. [Code Style & Conventions](#-code-style--conventions)
8. [Submitting a Pull Request](#-submitting-a-pull-request)
9. [What Happens After You Submit](#-what-happens-after-you-submit)
10. [Reporting Bugs](#-reporting-bugs)
11. [Suggesting Features](#-suggesting-features)
12. [Need Help?](#-need-help)

---

## 🧠 Before You Start

### What skills do I need?

You don't need to be an expert! Here's a rough skill map:

| Area | Skill Level Needed | Technologies |
|------|-------------------|--------------|
| Frontend issues | Beginner | HTML, CSS, TypeScript, React basics |
| UI/UX issues | Beginner | Tailwind CSS, React components |
| Documentation | Beginner | Markdown |
| Backend issues | Beginner–Intermediate | Go (Golang) basics |
| Testing | Beginner–Intermediate | Go testing package |
| Performance/Refactoring | Intermediate | Go, React |

> **Tip for beginners:** Look for issues tagged `good first issue` — these are specifically curated to be approachable without deep knowledge of the whole codebase.

### What should I know about Git?

You need to know the basics:
- What a **fork** and a **clone** are
- How to create a **branch**
- How to **commit** and **push** changes
- How to open a **Pull Request**

If any of these sound unfamiliar, check out [GitHub's beginner guides](https://docs.github.com/en/get-started) before continuing.

---

## 🏗️ Understanding the Project

Opensource Compass is a **microservices application**. This means it's made up of several small, independent services that each handle a specific responsibility.

```
Opensource_Compass/
│
├── frontend/               ← Next.js 16 web app (TypeScript + React)
│   ├── app/                ← Pages using Next.js App Router
│   │   ├── (auth)/         ← Protected pages (user must be logged in)
│   │   │   ├── discover/   ← Repository discovery + search
│   │   │   ├── recommendations/ ← AI-curated single recommendation
│   │   │   ├── notifications/   ← Real-time WebSocket notifications
│   │   │   ├── profile/    ← User profile + watchlist
│   │   │   ├── settings/   ← Preferences management
│   │   │   └── repo/       ← AI setup guide for a specific repo
│   │   ├── auth/           ← GitHub OAuth landing page
│   │   └── onboarding/     ← First-time user setup flow
│   ├── components/         ← Reusable UI components (Sidebar, Navbar, etc.)
│   ├── contexts/           ← React Contexts (auth state, notifications)
│   └── lib/api/            ← Typed API client functions for each backend
│
├── backend/
│   ├── core_service/       ← Main orchestration service (Go, port 8083)
│   │   ├── internal/
│   │   │   ├── orchestration/  ← Business logic, repo search, scoring
│   │   │   ├── scoring/        ← Multi-signal scoring engine (0–100)
│   │   │   ├── preferences/    ← User preference CRUD
│   │   │   ├── watchlist/      ← Watchlist + notification poller
│   │   │   ├── users/          ← User repository (DB queries)
│   │   │   └── clients/        ← HTTP clients for GitHub/AI services
│   │   ├── routes/             ← HTTP handlers
│   │   └── db/migrations/      ← PostgreSQL migration SQL files
│   │
│   ├── auth-service/       ← GitHub OAuth + JWT minting (Go, port 8080)
│   ├── github-service/     ← GitHub API proxy — repo search, issues (Go, port 8081)
│   ├── ai-service/         ← LLM calls — Groq/Gemini analysis (Go, port 8082)
│   └── notification-service/ ← WebSocket hub for real-time alerts (Go, port 8084)
│
├── docker-compose.yml      ← Starts all 5 backend services together
├── Makefile                ← Shortcut commands
└── .env                    ← Your local environment variables (never commit this!)
```

### How the services talk to each other

```
Browser → Frontend (port 3000)
              ↓ REST API calls
         Core Service (8083)
         ├── → GitHub Service (8081) → GitHub REST API
         ├── → AI Service (8082) → Groq / Gemini LLM
         └── → Supabase (PostgreSQL) DB

Browser → Notification Service (8084) [WebSocket]

Browser → Auth Service (8080) → GitHub OAuth
```

> **Don't be intimidated!** Most beginner issues only touch **one service** or even just **one file**. You don't need to understand the whole system to make a contribution.

---

## 💻 Setting Up Your Local Environment

### Prerequisites

Install these before you start:

| Tool | Version | Install Link |
|------|---------|--------------|
| **Node.js** | 18 or newer | [nodejs.org](https://nodejs.org/) |
| **Go** | 1.22 or newer | [go.dev/dl](https://go.dev/dl/) |
| **Docker Desktop** | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **Git** | Any recent | [git-scm.com](https://git-scm.com/) |

Verify your installations:
```bash
node --version    # Should print v18.x.x or higher
go version        # Should print go1.22.x or higher
docker --version  # Should print Docker version ...
git --version     # Should print git version ...
```

---

### Step 1: Fork the Repository

On GitHub, click the **Fork** button at the top-right of the repository page. This creates your own copy of the project under your GitHub account.

---

### Step 2: Clone Your Fork

```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/Opensource_Compass.git
cd Opensource_Compass
```

Replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username.

---

### Step 3: Set Up the Upstream Remote

This lets you pull in future changes from the original repo:

```bash
git remote add upstream https://github.com/Vedant1703/Opensource_Compass.git

# Verify you see both remotes:
git remote -v
```

You should see:
```
origin    https://github.com/YOUR_USERNAME/Opensource_Compass.git (fetch/push)
upstream  https://github.com/Vedant1703/Opensource_Compass.git (fetch/push)
```

---

### Step 4: Configure Environment Variables

```bash
cp .env.example .env
```

> ⚠️ If `.env.example` doesn't exist yet, create a `.env` file manually.

Open `.env` and fill in your values. Here's what each one means:

```env
# --- Database ---
# Get this from your Supabase project dashboard → Settings → Database → Connection string
DATABASE_URL=postgresql://postgres:<password>@<host>:<port>/<db>

# --- GitHub OAuth ---
# Create a GitHub OAuth App at: https://github.com/settings/developers
# Set the callback URL to: http://localhost:8080/auth/github/callback
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# A GitHub Personal Access Token for higher API rate limits
# Create one at: https://github.com/settings/tokens (no special scopes needed)
GITHUB_TOKEN=your_personal_access_token

# --- JWT ---
# Any long random string (at least 32 characters). Used to sign login tokens.
# Generate one with: openssl rand -hex 32
JWT_SECRET=some_very_long_random_secret_key

# --- AI Provider ---
# "groq" is recommended — it's free and very fast
# Get a Groq API key at: https://console.groq.com/
LLM_PROVIDER=groq
LLM_MODEL=mixtral-8x7b-32768
GROQ_API_KEY=your_groq_api_key

# Gemini is the fallback (optional if using Groq)
GEMINI_API_KEY=your_gemini_api_key

# --- Frontend URLs ---
NEXT_PUBLIC_CORE_SERVICE_URL=http://localhost:8083
NEXT_PUBLIC_GITHUB_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8080
```

> **Note:** The `.env` file contains real secrets. It is listed in `.gitignore` and will never be committed to Git. Never share it publicly.

---

### Step 5: Start the Backend Services

```bash
docker-compose up --build
```

This starts all 5 backend services simultaneously. The first run will take a few minutes to download base images and build containers.

Wait until you see output lines like:
```
compass_core        | Server running on :8083
compass_auth        | Auth service running on :8080
compass_github      | GitHub service running on :8081
compass_ai          | AI service running on :8082
compass_notification| Notification service running on :8084
```

> **Tip:** If a service keeps restarting, it's likely a missing or wrong environment variable. Check the logs for that service carefully.

---

### Step 6: Start the Frontend

Open a **new terminal window** (keep Docker running in the other one):

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser. You should see the Opensource Compass landing page.

---

### Useful Commands

| Command | What it does |
|---------|-------------|
| `docker-compose up` | Start all backend services |
| `docker-compose down` | Stop all backend services |
| `docker-compose up --build` | Rebuild and start (use after changing Go code) |
| `docker-compose logs -f core_service` | Watch logs for a specific service |
| `cd frontend && npm run dev` | Start the frontend dev server |
| `cd frontend && npm run lint` | Check for linting errors |
| `cd backend/core_service && go build ./...` | Verify Go code compiles |
| `cd backend/core_service && go test ./...` | Run all Go tests |
| `make docker-up` | Same as `docker-compose up` (shortcut) |

---

## 🔍 Finding an Issue to Work On

1. Go to the [Issues tab](https://github.com/Vedant1703/Opensource_Compass/issues) on GitHub
2. Filter by the `good first issue` label for beginner-friendly tasks
3. Read the issue description **fully** before starting — each issue has:
   - A clear description of the problem
   - The exact file(s) to change
   - Acceptance criteria (what "done" looks like)
   - Technical hints to help you get started
4. **Comment on the issue** saying you'd like to work on it. Wait for a maintainer to respond before starting. This avoids two people doing the same work.

### Issue Labels Guide

| Label | Meaning |
|-------|---------|
| `good first issue` | Welcoming to beginners, well-scoped |
| `frontend` | Changes in the `frontend/` directory |
| `backend` | Changes in one of the Go services |
| `bug` | Something is broken and needs fixing |
| `enhancement` | New feature or improvement to existing feature |
| `ux` | User experience improvement |
| `ui` | Visual / styling change |
| `documentation` | README, guides, comments |
| `testing` | Adding or improving tests |
| `dx` | Developer experience (setup, tooling) |
| `performance` | Making things faster |
| `accessibility` | Making the app more accessible |

---

## 🌿 The Git Workflow

### Step 1: Always start from an up-to-date `main`

Before creating a branch, sync your fork with the latest changes from the original repo:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### Step 2: Create a branch for your work

**Never work directly on `main`.** Create a new branch with a descriptive name:

```bash
# Branch naming format:
# fix/issue-<number>-short-description     ← for bug fixes
# feat/issue-<number>-short-description    ← for new features
# docs/issue-<number>-short-description    ← for documentation

# Examples:
git checkout -b fix/issue-14-edit-button-link
git checkout -b feat/issue-8-star-count-cards
git checkout -b docs/issue-18-contributing-guide
```

### Step 3: Make your changes

Edit the files, test your changes locally, and make sure everything works.

### Step 4: Commit your changes

Write a clear commit message that explains **what** you changed and **why**:

```bash
git add .
git commit -m "fix: active filters edit button now links to /settings instead of /onboarding"
```

**Commit message format** (Conventional Commits):

```
<type>: <short description>

[optional: longer explanation if needed]
```

| Type | When to use |
|------|------------|
| `feat` | New feature (e.g. `feat: add star count to repo cards`) |
| `fix` | Bug fix (e.g. `fix: clear auth token on logout`) |
| `docs` | Documentation (e.g. `docs: add CONTRIBUTING.md`) |
| `style` | Visual/CSS changes only (e.g. `style: restyle search input to dark theme`) |
| `refactor` | Code restructuring without behavior change |
| `test` | Adding or fixing tests |
| `chore` | Build, tooling, config changes |

### Step 5: Push your branch

```bash
git push origin fix/issue-14-edit-button-link
```

---

## 🛠️ Making Your Changes

### For Frontend Issues (TypeScript / React)

The frontend lives in `frontend/`. It uses:
- **Next.js 16** with the App Router (`app/` directory)
- **TypeScript** — all component files end in `.tsx` or `.ts`
- **Tailwind CSS** for styling (see the color palette below)
- **lucide-react** and **@tabler/icons-react** for icons

**Color palette used throughout the app** — please use these instead of inventing new colors:

| Purpose | Color Code |
|---------|-----------|
| Background (deepest) | `#0d1117` |
| Background (card/surface) | `#161b22` |
| Background (hover/active) | `#21262d` |
| Border (default) | `#30363d` |
| Text (primary) | `#c9d1d9` |
| Text (muted) | `#8b949e` |
| Text (very muted) | `#6e7681` |
| Accent blue | `#2f81f7` / `#58a6ff` |
| Accent green | `#238636` / `#3fb950` |
| Accent red | `#da3633` / `#f85149` |
| Accent purple | `#a371f7` |

**API calls** are made through typed functions in `frontend/lib/api/`. Each file corresponds to a backend service:
- `auth-service.ts` → Auth Service (`:8080`)
- `core-service.ts` → Core Service (`:8083`)
- `github-service.ts` → GitHub Service (`:8081`)
- `preferences.ts` → user preferences via Core Service
- `watchlist.ts` → watchlist via Core Service

When you make changes, test them by running:
```bash
cd frontend
npm run dev    # Start dev server
npm run lint   # Check for errors
```

### For Backend Issues (Go)

Each Go service has the same structure:
```
service-name/
├── cmd/server/main.go    ← entry point
├── config/               ← reads environment variables
├── internal/             ← all business logic (private to this service)
│   ├── handlers/         ← HTTP request handlers
│   └── ...               ← domain-specific packages
└── routes/               ← registers HTTP routes
```

After making changes to Go code, verify it compiles:
```bash
cd backend/core_service   # or whichever service you edited
go build ./...
```

Run tests (if the service has them):
```bash
go test ./...
```

Format your Go code before committing:
```bash
gofmt -w .
```

To see your Go changes live, rebuild the Docker container for that service:
```bash
docker-compose up --build core_service
```

---

## 🎨 Code Style & Conventions

### TypeScript / React

- **One component per file** — don't define multiple exported components in the same file
- **Props interfaces** should be defined at the top of the file, above the component
- Use **`const` arrow functions** for components:
  ```tsx
  // ✅ Good
  export default function MyComponent({ title }: { title: string }) { ... }

  // ✅ Also fine
  const MyComponent = ({ title }: { title: string }) => { ... }
  ```
- **No hardcoded colors** — use the color palette from the table above
- **`lucide-react`** is preferred for icons (it's lighter); `@tabler/icons-react` is also available
- Use `Link` from `next/link` for internal navigation, not `<a href>` or `router.push`
- Client components that use hooks (like `useState`, `useEffect`, `usePathname`) must start with:
  ```tsx
  "use client";
  ```

### Go

- Follow standard Go idioms — when in doubt, look at how surrounding code is written
- Error messages should be wrapped with context:
  ```go
  // ✅ Good
  return fmt.Errorf("failed to fetch repo %s: %w", repoID, err)

  // ❌ Bad
  return err
  ```
- Use `log.Printf` for debug/info logging (existing pattern in the codebase)
- Exported functions/types must have a doc comment:
  ```go
  // ComputeScore calculates a repository's match score from 0-100 based on
  // multiple signals like recent activity, good first issues, and tech stack match.
  func ComputeScore(signals RepoSignals) ScoreResult { ... }
  ```
- Run `gofmt -w .` before committing — Go code formatting is non-negotiable

---

## 📬 Submitting a Pull Request

Once your branch is pushed, go to your fork on GitHub. You'll see a banner offering to **"Compare & pull request"** — click it.

### PR Title

Follow the same Conventional Commits format:

```
fix: active filters edit button now links to /settings
feat: add star count badge to discover repo cards
docs: add CONTRIBUTING.md
```

### PR Description

Fill in the following:

```markdown
## What does this PR do?
<!-- Describe the change in 1-2 sentences -->

## Related Issue
Closes #<issue-number>

## Type of change
- [ ] Bug fix
- [ ] New feature / enhancement
- [ ] Documentation
- [ ] Refactor

## How did you test this?
<!-- Describe how you verified the change works -->

## Screenshots (if UI change)
<!-- Before and After screenshots if you changed something visual -->
```

### Before Submitting — Checklist

- [ ] My branch is up to date with `main` (run `git fetch upstream && git merge upstream/main`)
- [ ] My changes work locally (I tested them in the browser / with `go build`)
- [ ] I haven't introduced any lint errors (`npm run lint` passes)
- [ ] My commit message follows the Conventional Commits format
- [ ] I've linked the issue in the PR description (`Closes #<number>`)
- [ ] If I changed UI, I included screenshots in the PR description

---

## 🔄 What Happens After You Submit

1. A maintainer will review your PR — this may take a few days depending on availability
2. They may leave comments requesting changes — **this is completely normal and expected**. It doesn't mean your work was bad!
3. Make the requested changes on the same branch and push — the PR will update automatically
4. Once approved, your PR will be **merged into `main`** 🎉

### Responding to Review Comments

- Be responsive — try to address feedback within a few days
- If you disagree with a suggestion, explain your reasoning politely — discussions are welcome!
- Mark conversations as **resolved** only after you've made the change
- Don't force-push after a review has started — it makes it hard for reviewers to see what changed

---

## 🐛 Reporting Bugs

Found something broken? Open a [GitHub Issue](https://github.com/Vedant1703/Opensource_Compass/issues/new) with:

1. **Title**: A short, clear summary (e.g. `"Logout doesn't clear auth token — page re-authenticates on refresh"`)
2. **Steps to reproduce**: What did you do that caused the bug?
3. **Expected behavior**: What did you expect to happen?
4. **Actual behavior**: What actually happened?
5. **Screenshots**: If it's a visual bug, a screenshot is very helpful
6. **Environment**: Browser name + version, OS (e.g. Chrome 123 on macOS)

---

## 💡 Suggesting Features

Have an idea? We'd love to hear it! Open a [GitHub Issue](https://github.com/Vedant1703/Opensource_Compass/issues/new) with the `enhancement` label and describe:

- **What problem does this solve?** — Who benefits and how?
- **What would it look like?** — Sketch a rough idea of the UI or API change
- **Alternatives considered** — Any other approaches you thought about?

---

## ❓ Need Help?

Stuck? Don't hesitate to ask! Here are your options:

1. **Comment on the issue** you're working on — describe where you're stuck
2. **Open a GitHub Discussion** — great for open-ended questions about the codebase
3. **Read the README** — it covers the full architecture and API reference

> **Remember:** There are no stupid questions. Everyone starts as a beginner. The maintainers are here to help you succeed. 😊

---

<div align="center">

**Thank you for contributing to Opensource Compass!**

*Every PR, no matter how small, makes this project better.* ❤️

Built with ❤️ by [Vedant Kulkarni](https://github.com/Vedant1703) and contributors

</div>
