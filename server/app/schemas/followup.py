"""FollowUp Pydantic schemas."""

from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.followup import TaskPriority, TaskStatus


# ── Request Schemas ──────────────────────────────────


class FollowUpCreate(BaseModel):
    """Schema for creating a follow-up task."""

    hcp_id: UUID
    interaction_id: Optional[UUID] = None
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    due_date: date
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.PENDING
    assigned_to: Optional[UUID] = None


class FollowUpUpdate(BaseModel):
    """Schema for updating a follow-up task. All fields optional."""

    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    assigned_to: Optional[UUID] = None


# ── Response Schemas ─────────────────────────────────


class FollowUpResponse(BaseModel):
    """Full follow-up response."""

    model_config = {"from_attributes": True}

    id: UUID
    hcp_id: UUID
    interaction_id: Optional[UUID]
    title: str
    description: Optional[str]
    due_date: date
    priority: TaskPriority
    status: TaskStatus
    assigned_to: Optional[UUID]
    created_at: datetime
    updated_at: datetime


class FollowUpListResponse(BaseModel):
    """Paginated list of follow-ups."""

    total: int
    skip: int
    limit: int
    items: list[FollowUpResponse]
