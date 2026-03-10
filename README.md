# FocusFlow Productivity & Focus API + Task UI

FocusFlow now includes:
- A FastAPI backend for task and focus-session APIs.
- A browser task management UI using **localStorage**.

## Implemented Task Management Features

The UI provides:
- Add tasks
- Delete tasks
- Mark tasks as completed
- Priority levels: High / Medium / Low
- Link tasks to focus sessions (stores `focusSessionId` on each task)

### Components
- `TaskList` (state owner + rendering + persistence)
- `TaskItem` (single task row + actions)

Both components are implemented in `web/app.js`.

## Backend Features

- Task API with fields:
  - `task_id`
  - `title`
  - `description`
  - `deadline`
  - `status`
- Focus timer session defaults:
  - 25 minutes focus
  - 5 minutes break
- Session controls:
  - Start / Pause / Resume / Stop
- SQLite persistence for backend entities.

## Run locally

```bash
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Open:
- UI: `http://127.0.0.1:8000/`
- API docs: `http://127.0.0.1:8000/docs`

## REST API Endpoints

### Tasks
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/{task_id}`

### Focus Sessions
- `POST /focus-sessions`
- `GET /focus-sessions/{session_id}`
- `POST /focus-sessions/{session_id}/pause`
- `POST /focus-sessions/{session_id}/resume`
- `POST /focus-sessions/{session_id}/stop`

## Example API Requests

### Create task
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

### Start focus session
```bash
curl -X POST http://127.0.0.1:8000/focus-sessions \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": 1,
    "session_length_minutes": 25,
    "break_length_minutes": 5
  }'
```
