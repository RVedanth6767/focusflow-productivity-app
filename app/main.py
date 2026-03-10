"""FastAPI application entrypoint for FocusFlow."""

from typing import List

from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from . import models, schemas, services
from .database import Base, engine, get_db

app = FastAPI(title="FocusFlow API", version="1.1.0")


@app.on_event("startup")
def on_startup() -> None:
    """Create database tables when the API starts."""
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health_check() -> dict[str, str]:
    """Simple endpoint to verify the service is running."""
    return {"status": "ok"}


@app.post("/tasks", response_model=schemas.TaskResponse, status_code=201)
def create_task(payload: schemas.TaskCreate, db: Session = Depends(get_db)):
    """Create a task with title, description, deadline, and status."""
    return services.create_task(db, payload)


@app.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Fetch a single task by ID."""
    return services.get_task_or_404(db, task_id)


@app.get("/tasks", response_model=List[schemas.TaskResponse])
def list_tasks(db: Session = Depends(get_db)):
    """List all tasks."""
    return db.query(models.Task).order_by(models.Task.created_at.desc()).all()


@app.post("/focus-sessions", response_model=schemas.FocusSessionResponse, status_code=201)
def start_focus_session(payload: schemas.FocusSessionCreate, db: Session = Depends(get_db)):
    """Start a new focus session. Defaults are 25 minutes focus / 5 minutes break."""
    return services.start_focus_session(db, payload)


@app.get("/focus-sessions/{session_id}", response_model=schemas.FocusSessionResponse)
def get_focus_session(session_id: int, db: Session = Depends(get_db)):
    """Fetch an existing focus session by ID."""
    return services.get_session_or_404(db, session_id)


@app.post("/focus-sessions/{session_id}/pause", response_model=schemas.FocusSessionResponse)
def pause_focus_session(session_id: int, db: Session = Depends(get_db)):
    """Pause a running focus timer."""
    return services.pause_focus_session(db, session_id)


@app.post("/focus-sessions/{session_id}/resume", response_model=schemas.FocusSessionResponse)
def resume_focus_session(session_id: int, db: Session = Depends(get_db)):
    """Resume a paused focus timer."""
    return services.resume_focus_session(db, session_id)


@app.post("/focus-sessions/{session_id}/stop", response_model=schemas.FocusSessionResponse)
def stop_focus_session(session_id: int, db: Session = Depends(get_db)):
    """Stop a focus timer permanently."""
    return services.stop_focus_session(db, session_id)
