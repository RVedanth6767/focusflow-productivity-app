# FocusFlow Productivity & Focus API

This repository now contains a FastAPI module for managing tasks and Pomodoro-style focus sessions.

## Features implemented

- Task management with required fields:
  - `task_id`
  - `title`
  - `description`
  - `deadline`
  - `status`
- Focus timer sessions with defaults:
  - Focus length: **25 minutes**
  - Break length: **5 minutes**
- Timer controls:
  - Start
  - Pause
  - Resume
  - Stop
- SQLite persistence for tasks and focus sessions.

## Tech stack

- FastAPI
- SQLAlchemy
- SQLite

## Run locally

```bash
pip install fastapi sqlalchemy uvicorn pydantic httpx
uvicorn app.main:app --reload
```

## REST API Endpoints

### Tasks

- `POST /tasks` → create task
- `GET /tasks` → list tasks
- `GET /tasks/{task_id}` → get one task

### Focus Sessions

- `POST /focus-sessions` → start a session
- `GET /focus-sessions/{session_id}` → get session state
- `POST /focus-sessions/{session_id}/pause` → pause timer
- `POST /focus-sessions/{session_id}/resume` → resume timer
- `POST /focus-sessions/{session_id}/stop` → stop timer

## Example API requests

### 1) Create a task

```bash
curl -X POST http://127.0.0.1:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write architecture notes",
    "description": "Summarize FocusFlow module decisions",
    "deadline": "2026-12-31T17:00:00",
    "status": "pending"
  }'
```

### 2) Start a focus session

```bash
curl -X POST http://127.0.0.1:8000/focus-sessions \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": 1,
    "session_length_minutes": 25,
    "break_length_minutes": 5
  }'
```

### 3) Pause / Resume / Stop

```bash
curl -X POST http://127.0.0.1:8000/focus-sessions/1/pause
curl -X POST http://127.0.0.1:8000/focus-sessions/1/resume
curl -X POST http://127.0.0.1:8000/focus-sessions/1/stop
```
