"""HCP Pydantic schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# ── Request Schemas ──────────────────────────────────


class HCPCreate(BaseModel):
    """Schema for creating a new HCP."""

    name: str = Field(..., min_length=1, max_length=255, examples=["Dr. Sarah Chen"])
    specialty: str = Field(..., min_length=1, max_length=150, examples=["Oncology"])
    hospital: str = Field(..., min_length=1, max_length=255, examples=["Memorial Cancer Center"])
    email: EmailStr = Field(..., examples=["s.chen@memorial.org"])
    phone: Optional[str] = Field(None, max_length=50, examples=["+1 (555) 234-5678"])
    tier: str = Field("C", pattern=r"^[ABC]$", examples=["A"])
    location: Optional[str] = Field(None, max_length=255, examples=["Boston, MA"])


class HCPUpdate(BaseModel):
    """Schema for updating an HCP. All fields optional."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    specialty: Optional[str] = Field(None, min_length=1, max_length=150)
    hospital: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    tier: Optional[str] = Field(None, pattern=r"^[ABC]$")
    location: Optional[str] = Field(None, max_length=255)


# ── Response Schemas ─────────────────────────────────


class HCPResponse(BaseModel):
    """Full HCP response with all fields."""

    model_config = {"from_attributes": True}

    id: UUID
    name: str
    specialty: str
    hospital: str
    email: str
    phone: Optional[str]
    tier: str
    location: Optional[str]
    total_interactions: int
    last_interaction: Optional[datetime]
    created_by: Optional[UUID]
    created_at: datetime
    updated_at: datetime


class HCPListResponse(BaseModel):
    """Paginated list of HCPs."""

    total: int
    skip: int
    limit: int
    items: list[HCPResponse]
