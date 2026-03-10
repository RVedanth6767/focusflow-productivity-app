"""SQLAlchemy models for tasks and focus sessions."""

from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class Task(Base):
    """Represents a task the user wants to complete."""

    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    deadline = Column(DateTime, nullable=True)
    status = Column(String(50), nullable=False, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    sessions = relationship("FocusSession", back_populates="task", cascade="all, delete-orphan")


class FocusSession(Base):
    """Represents a Pomodoro-style focus session for a task."""

    __tablename__ = "focus_sessions"

    session_id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.task_id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), nullable=False, default="running")
    session_length_minutes = Column(Integer, nullable=False, default=25)
    break_length_minutes = Column(Integer, nullable=False, default=5)

    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_resumed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    paused_at = Column(DateTime, nullable=True)
    stopped_at = Column(DateTime, nullable=True)
    elapsed_seconds = Column(Integer, nullable=False, default=0)

    task = relationship("Task", back_populates="sessions")
