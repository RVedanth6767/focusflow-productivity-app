"""Pydantic schemas for API input/output validation."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TaskCreate(BaseModel):
    """Payload for creating a new task."""

    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    status: str = Field(default="pending", max_length=50)


class TaskResponse(BaseModel):
    """Task payload returned by API."""

    task_id: int
    title: str
    description: Optional[str]
    deadline: Optional[datetime]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class FocusSessionCreate(BaseModel):
    """Payload for creating/starting a focus session."""

    task_id: int
    session_length_minutes: int = Field(default=25, ge=1)
    break_length_minutes: int = Field(default=5, ge=1)


class FocusSessionResponse(BaseModel):
    """Session payload returned by API."""

    session_id: int
    task_id: int
    status: str
    session_length_minutes: int
    break_length_minutes: int
    started_at: datetime
    last_resumed_at: datetime
    paused_at: Optional[datetime]
    stopped_at: Optional[datetime]
    elapsed_seconds: int

    class Config:
        from_attributes = True
