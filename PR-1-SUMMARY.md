# PR #1: Initial Scaffold (backend+frontend+docker+ci)

## Summary

This PR establishes the complete initial scaffold for the PromptParty MVP - a realtime party game where players submit improv prompts and vote to "cut off" performances.

## What Changed

### Backend (`/backend`)
- **Server Setup:**
  - Fastify + Socket.IO for real-time communication
  - TypeScript with strict mode enabled
  - Basic auth handler with JWT tokens
  - Socket event handlers with typed events
  - Health check endpoint

- **Database:**
  - Prisma ORM with PostgreSQL
  - Complete schema for: rooms, players, rounds, prompts, votes, cut_votes, ratings
  - Initial migration created and applied

- **Game Logic:**
  - Pure, testable game logic library (`lib/gameLogic.ts`)
  - Functions for:
    - Cut vote threshold calculation
    - Performance timestamps (min cutoff, max duration)
    - Vote eligibility checks
    - Rating calculations
    - Actor rotation
  - **17 passing unit tests** covering all game logic

- **Configuration:**
  - ESLint + Prettier with TypeScript rules
  - Jest for testing
  - Dockerfile for production deployment
  - Environment variables documented in `.env.example`

### Frontend (`/frontend`)
- **Framework:**
  - React 18 with TypeScript
  - Vite for fast development
  - React Router for navigation

- **Pages:**
  - Home: Room creation and join
  - Host: Large-screen view with QR code placeholder
  - Player: Mobile view for player interactions

- **Infrastructure:**
  - Socket.IO client with typed events
  - Basic CSS styling with dark theme
  - Vitest for testing
  - ESLint + Prettier configuration
  - Dockerfile + nginx config for production

### Infrastructure
- **Docker Compose:**
  - PostgreSQL 16 (port 5432)
  - Redis 7 (port 6379)
  - Adminer for database management (port 8080)
  - Health checks for all services

- **CI/CD:**
  - GitHub Actions workflow
  - Runs on every PR and push
  - Backend: lint, typecheck, tests, migrations
  - Frontend: lint, typecheck, tests, build
  - Uses PostgreSQL and Redis services

### Documentation
- **README.md:**
  - Complete setup instructions
  - Architecture overview
  - Environment variables
  - MVP gameplay description
  - Development workflow guidelines
  - Socket event contract specification

- **LICENSE:** MIT license

## Testing

### Backend Tests
```bash
cd backend
npm test
```
**Result:** ✅ 17 tests passing (100% coverage of game logic)

### Verification Steps Completed
1. ✅ Docker Compose starts Postgres and Redis successfully
2. ✅ Backend dependencies install without errors
3. ✅ Frontend dependencies install successfully
4. ✅ Prisma migrations run successfully
5. ✅ Backend server starts and connects to DB and Redis
6. ✅ All unit tests pass

## How to Test Locally

1. **Start infrastructure:**
   ```bash
   docker-compose up -d
   ```

2. **Setup backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run db:generate
   npm run db:migrate
   npm run dev
   ```
   Backend runs on http://localhost:3000

3. **Setup frontend:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```
   Frontend runs on http://localhost:5173

4. **Run tests:**
   ```bash
   cd backend && npm test
   cd frontend && npm test
   ```

## Socket Event Contract

Basic auth flow implemented:
- **Client → Server:** `auth` with optional token
- **Server → Client:** `auth_ok` with player ID and room state

See README.md for complete event contract specification.

## Technical Decisions

1. **Fastify over Express:** Better TypeScript support, faster performance
2. **Vite over Next.js:** Simpler for SPA use case, faster dev experience
3. **Prisma:** Type-safe ORM with excellent migration tooling
4. **Redis:** For ephemeral room state and presence tracking (future PRs)
5. **Strict TypeScript:** No implicit `any`, enforced via ESLint

## Acceptance Criteria

All acceptance criteria for initial scaffold PR met:
- ✅ Backend & frontend folders with package.json, TypeScript, lint configs
- ✅ Docker Compose brings up Postgres and Redis
- ✅ Basic README with local dev instructions
- ✅ Socket.IO auth and room join implemented
- ✅ Pure game logic module with unit tests
- ✅ CI runs lint, typecheck, and tests

## Next Steps

Subsequent PRs will implement (in order):
1. Room creation and join endpoints
2. Player session management and reconnection  
3. Round lifecycle state machine
4. Prompt submission and voting
5. Performance phase with cut-vote mechanism
6. Rating and scoring system
7. Host UI with QR code generation
8. Player UI with full game flow

## Files Changed

- 35 files created
- 1,646 lines added
- 0 lines deleted

## Commit

```
chore: initial scaffold (backend+frontend+docker+ci)

- Add backend with Fastify + Socket.IO + Prisma
- Add Prisma schema for rooms, players, rounds, prompts, votes
- Implement basic auth and socket handlers
- Add pure game logic library with unit tests
- Add frontend with Vite + React + TypeScript
- Create basic UI pages (Home, Host, Player)
- Add Docker Compose for Postgres and Redis
- Setup GitHub Actions CI workflow
- Add comprehensive README with setup instructions
```

Commit hash: `60660a5`
