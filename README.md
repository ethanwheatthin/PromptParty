# 🎭 PromptParty

A realtime party game where one in-room actor performs while remote players submit improv prompts, vote on the best prompt, then rate the actor's performance. Players can "cut off" the performance after a minimum duration by voting.

## 🎮 MVP Gameplay

1. **Host creates a room** - Gets a join URL and join code with QR code for easy access
2. **Players join** - Via URL or join code, supply display name
3. **Round flow:**
   - Server selects a topic and assigns an actor (by rotation)
   - All non-actor players submit text prompts
   - Players vote on submitted prompts
   - **Performance phase** - Actor performs the winning prompt
     - Minimum 30s before cut votes allowed
     - Maximum 90s automatic timeout
     - Players can cast "cut votes" to end early (majority required)
   - Rating phase - Players rate the performance (1-10)
   - Leaderboard updates

## 🏗️ Architecture

### Tech Stack

- **Backend:** Node.js (v18+), TypeScript, Fastify, Socket.IO
- **Database:** PostgreSQL with Prisma ORM
- **Cache & Pub/Sub:** Redis (ioredis)
- **Frontend:** React + TypeScript, Vite
- **Dev Environment:** Docker Compose
- **CI:** GitHub Actions

### Project Structure

```
/backend
  /src
    server.ts           # Fastify + Socket.IO bootstrap
    /sockets            # Socket event handlers
    /services           # Game orchestration, timers, persistence
    /models             # Prisma client usage
    /lib                # Pure game logic functions
    /tests              # Unit & integration tests
  /prisma
    schema.prisma       # Database schema
  Dockerfile
  package.json

/frontend
  /src
    /pages              # Host & Player screens
    /components         # UI components
    /sockets            # Client socket helper
    /hooks              # React hooks
    /styles             # CSS
    /tests              # Frontend tests
  Dockerfile
  package.json

docker-compose.yml      # Postgres + Redis
.github/workflows/ci.yml
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- Docker and Docker Compose
- npm or yarn

### Local Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd PromptParty
```

2. **Start infrastructure (Postgres + Redis)**

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`
- Adminer (DB admin UI) on `http://localhost:8080`

3. **Setup Backend**

```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Start dev server
npm run dev
```

Backend will be running on `http://localhost:3000`

4. **Setup Frontend**

```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env

# Start dev server
npm run dev
```

Frontend will be running on `http://localhost:5173`

### Running Tests

**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

### Linting & Formatting

**Backend:**
```bash
cd backend
npm run lint
npm run format
```

**Frontend:**
```bash
cd frontend
npm run lint
npm run format
```

## 🔧 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://promptparty:promptparty@localhost:5432/promptparty?schema=public"
REDIS_URL="redis://localhost:6379"
PORT=3000
NODE_ENV=development
JWT_SECRET="your-secret-key-change-in-production"
MIN_PERFORMANCE_DURATION_SECONDS=30
MAX_PERFORMANCE_DURATION_SECONDS=90
CUT_VOTE_THRESHOLD_PERCENT=50
```

### Frontend (.env)

```env
VITE_SOCKET_URL=http://localhost:3000
```

## 📡 Socket.IO Event Contract

### Client → Server

- `auth` - Authenticate with token or create new session
- `submit_prompt` - Submit a text prompt during submission phase
- `vote_prompt` - Vote for a prompt during voting phase
- `cast_cut_vote` - Cast a vote to cut the performance early
- `submit_rating` - Rate the actor's performance (1-10)
- `actor_end_performance` - Actor voluntarily ends performance
- `force_end_performance` - Host force-ends performance

### Server → Client

- `auth_ok` - Authentication successful with player & room state
- `room_state` - Current room state update
- `round_started` - Round has started with actor and timestamps
- `prompt_submitted` - A prompt was submitted
- `cut_vote_update` - Cut vote count updated
- `performance_cut` - Performance was cut (by votes, time, actor, or host)
- `rating_phase_start` - Rating phase has begun
- `round_ended` - Round complete with scores and leaderboard

## 🎯 Key Features Implemented

- ✅ Basic project scaffold
- ✅ Docker Compose for local development
- ✅ Prisma schema for all game entities
- ✅ Fastify + Socket.IO server with auth
- ✅ Pure game logic library with unit tests
- ✅ React frontend with routing
- ✅ GitHub Actions CI workflow

## 🚧 Roadmap (TODO)

### Phase 1: Core Game Flow
- [ ] Room creation and join endpoints
- [ ] Player session management and reconnection
- [ ] Round lifecycle state machine
- [ ] Prompt submission and voting
- [ ] Performance timer with cut-vote mechanism
- [ ] Rating and scoring system

### Phase 2: Host & Player UI
- [ ] Host view with QR code generation
- [ ] Player view with prompt submission
- [ ] Voting interface
- [ ] Cut button with real-time tally
- [ ] Rating interface
- [ ] Leaderboard display

### Phase 3: Polish & Production
- [ ] Redis presence tracking
- [ ] Full reconnection logic
- [ ] Input sanitization and XSS protection
- [ ] Content moderation logging
- [ ] Production deployment configuration
- [ ] Performance optimizations

## 🧪 Testing Strategy

- **Unit tests:** Pure game logic functions (threshold calculations, timers, etc.)
- **Integration tests:** Socket.IO event flows with mocked sockets
- **CI:** All tests run on every PR with lint and type checks

## 📝 Development Workflow

1. **Create an issue** for each feature
2. **Create a feature branch** from `main`
3. **Implement with tests** - Keep changes focused and reviewable
4. **Commit with Conventional Commits** format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `chore:` - Maintenance task
   - `docs:` - Documentation
   - `test:` - Test additions/changes
5. **Open PR** with clear description linking to issue
6. **CI must pass** before merge

## 📄 License

MIT

## 🤝 Contributing

This is an MVP for a startup/side-project. Follow the strict requirements in the system prompt. Keep PRs small, well-tested, and clearly documented.
