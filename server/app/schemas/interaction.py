"""Interaction Pydantic schemas."""

from datetime import date, datetime, time
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.interaction import InteractionType, Sentiment


# ── Nested Schemas ───────────────────────────────────


class MaterialCreate(BaseModel):
    """Material to attach to an interaction on creation."""

    name: str = Field(..., min_length=1, max_length=255)
    category: Optional[str] = Field(None, max_length=100)


class MaterialResponse(BaseModel):
    """Material in an interaction response."""

    model_config = {"from_attributes": True}

    id: UUID
    name: str
    category: Optional[str]


class SampleCreate(BaseModel):
    """Sample to attach to an interaction on creation."""

    name: str = Field(..., min_length=1, max_length=255)
    quantity: int = Field(1, ge=1)


class SampleResponse(BaseModel):
    """Sample in an interaction response."""

    model_config = {"from_attributes": True}

    id: UUID
    name: str
    quantity: int


# ── Request Schemas ──────────────────────────────────


class InteractionCreate(BaseModel):
    """Schema for creating a new interaction."""

    hcp_id: UUID
    type: InteractionType = InteractionType.MEETING
    date: date
    time: Optional[time] = None
    attendees: Optional[str] = None
    topics: str = Field(..., min_length=1)
    sentiment: Sentiment = Sentiment.NEUTRAL
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None
    materials: list[MaterialCreate] = Field(default_factory=list)
    samples: list[SampleCreate] = Field(default_factory=list)


class InteractionUpdate(BaseModel):
    """Schema for updating an interaction. All fields optional."""

    type: Optional[InteractionType] = None
    date: Optional[date] = None
    time: Optional[time] = None
    attendees: Optional[str] = None
    topics: Optional[str] = None
    sentiment: Optional[Sentiment] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None


# ── Response Schemas ─────────────────────────────────


class InteractionResponse(BaseModel):
    """Full interaction response."""

    model_config = {"from_attributes": True}

    id: UUID
    hcp_id: UUID
    type: InteractionType
    date: date
    time: Optional[time]
    attendees: Optional[str]
    topics: str
    sentiment: Sentiment
    outcomes: Optional[str]
    follow_up_actions: Optional[str]
    materials: list[MaterialResponse]
    samples: list[SampleResponse]
    created_by: Optional[UUID]
    created_at: datetime
    updated_at: datetime


class InteractionListResponse(BaseModel):
    """Paginated list of interactions."""

    total: int
    skip: int
    limit: int
    items: list[InteractionResponse]
