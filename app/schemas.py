"""Pydantic schemas for API input/output validation."""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class TaskStatus(str, Enum):
    """Allowed task lifecycle states."""

    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class SessionStatus(str, Enum):
    """Allowed focus session runtime states."""

    running = "running"
    paused = "paused"
    stopped = "stopped"


class TaskCreate(BaseModel):
    """Payload for creating a new task."""

    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    status: TaskStatus = TaskStatus.pending


class TaskResponse(BaseModel):
    """Task payload returned by API."""

    model_config = ConfigDict(from_attributes=True)

    task_id: int
    title: str
    description: Optional[str]
    deadline: Optional[datetime]
    status: TaskStatus
    created_at: datetime


class FocusSessionCreate(BaseModel):
    """Payload for creating/starting a focus session."""

    task_id: int
    session_length_minutes: int = Field(default=25, ge=1)
    break_length_minutes: int = Field(default=5, ge=1)


class FocusSessionResponse(BaseModel):
    """Session payload returned by API."""

    model_config = ConfigDict(from_attributes=True)

    session_id: int
    task_id: int
    status: SessionStatus
    session_length_minutes: int
    break_length_minutes: int
    started_at: datetime
    last_resumed_at: datetime
    paused_at: Optional[datetime]
    stopped_at: Optional[datetime]
    elapsed_seconds: int
