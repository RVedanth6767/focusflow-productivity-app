# FocusFlow Productivity App

FocusFlow is a productivity workspace that combines a lightweight frontend (served from repository root) with a TypeScript/Express backend API (`backend/`).

This README reflects the **current implementation in this repository**.

## Repository Layout

```text
.
├── index.html          # Frontend shell
├── styles.css          # Frontend styling
├── script.js           # Frontend behavior (tasks, timer, chat, sync)
└── backend/            # Express + TypeScript + Prisma backend
```

## Implemented Functionality

### Frontend
- Task workspace interactions and local persistence.
- Task state mapping and backend sync controls.
- Focus timer controls (start, pause, reset).
- Authentication form (register/login flow against backend).
- Assistant/chat panel and backend health/status indicators.

### Backend
- Express API under `/v1`.
- Route groups:
  - `/v1/auth`
  - `/v1/tasks`
  - `/v1/chat`
  - `/v1/pomodoro`
  - `/v1/dashboard`
  - `/v1/system`
- JWT-based auth middleware for protected endpoints.
- Zod request validation.
- Prisma/PostgreSQL data layer + Redis integration.

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL instance
- Redis instance

## Backend Configuration

Create `backend/.env`:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/focusflow
JWT_SECRET=your-jwt-secret-min-16-characters
JWT_REFRESH_SECRET=your-refresh-secret-min-16-characters
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=
CORS_ORIGIN=http://localhost:3000
```

## Local Development

### 1) Install backend dependencies

```bash
cd backend
npm install
```

### 2) Prepare database client/schema

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 3) Start backend

```bash
npm run dev
```

Backend default: `http://localhost:4000`.

### 4) Serve frontend (from repo root)

```bash
npx serve .
```

Then open the shown URL in your browser and ensure the frontend backend URL points to `http://localhost:4000` (or your configured backend URL).

## Backend Scripts (`backend/`)

- `npm run dev` — start dev server with file watching.
- `npm run build` — compile TypeScript to `dist/`.
- `npm run start` — run compiled backend.
- `npm run check` — run TypeScript checks (`tsc --noEmit`).
- `npm run prisma:generate` — generate Prisma client.
- `npm run prisma:migrate` — apply development migrations.

## API Endpoints (Current)

### Public
- `GET /health`
- `GET /v1/status`
- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `GET /v1/system/ai-status`

### Protected (Bearer token required)
- `GET /v1/tasks`
- `POST /v1/tasks`
- `PUT /v1/tasks/:id`
- `DELETE /v1/tasks/:id`
- `POST /v1/chat/message`
- `GET /v1/chat/history`
- `GET /v1/pomodoro/status`
- `POST /v1/pomodoro/start`
- `POST /v1/pomodoro/complete`
- `GET /v1/dashboard/summary`

## Notes

- AI behavior depends on `GEMINI_API_KEY` availability.
- Set `CORS_ORIGIN` to match the frontend origin used in development.
