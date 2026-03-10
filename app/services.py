"""Business logic for FocusFlow task and timer operations."""

from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from . import models, schemas


def create_task(db: Session, payload: schemas.TaskCreate) -> models.Task:
    """Create and persist a task."""
    task = models.Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_task_or_404(db: Session, task_id: int) -> models.Task:
    """Fetch a task or raise a 404 error."""
    task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} was not found.",
        )
    return task


def start_focus_session(db: Session, payload: schemas.FocusSessionCreate) -> models.FocusSession:
    """Start a new focus session for the provided task."""
    get_task_or_404(db, payload.task_id)

    now = datetime.utcnow()
    session = models.FocusSession(
        task_id=payload.task_id,
        status="running",
        session_length_minutes=payload.session_length_minutes,
        break_length_minutes=payload.break_length_minutes,
        started_at=now,
        last_resumed_at=now,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_session_or_404(db: Session, session_id: int) -> models.FocusSession:
    """Fetch a focus session or raise a 404 error."""
    session = db.query(models.FocusSession).filter(models.FocusSession.session_id == session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session with id {session_id} was not found.",
        )
    return session


def pause_focus_session(db: Session, session_id: int) -> models.FocusSession:
    """Pause a running focus session and capture elapsed time."""
    session = get_session_or_404(db, session_id)
    if session.status == "stopped":
        raise HTTPException(status_code=400, detail="Stopped sessions cannot be paused.")
    if session.status == "paused":
        return session

    now = datetime.utcnow()
    session.elapsed_seconds += int((now - session.last_resumed_at).total_seconds())
    session.paused_at = now
    session.status = "paused"
    db.commit()
    db.refresh(session)
    return session


def resume_focus_session(db: Session, session_id: int) -> models.FocusSession:
    """Resume a paused focus session."""
    session = get_session_or_404(db, session_id)
    if session.status == "stopped":
        raise HTTPException(status_code=400, detail="Stopped sessions cannot be resumed.")
    if session.status == "running":
        return session

    now = datetime.utcnow()
    session.status = "running"
    session.last_resumed_at = now
    session.paused_at = None
    db.commit()
    db.refresh(session)
    return session


def stop_focus_session(db: Session, session_id: int) -> models.FocusSession:
    """Stop a focus session permanently."""
    session = get_session_or_404(db, session_id)
    if session.status == "stopped":
        return session

    now = datetime.utcnow()
    if session.status == "running":
        session.elapsed_seconds += int((now - session.last_resumed_at).total_seconds())

    was_paused = session.status == "paused"
    session.status = "stopped"
    session.stopped_at = now
    if was_paused:
        session.paused_at = now
    db.commit()
    db.refresh(session)
    return session
