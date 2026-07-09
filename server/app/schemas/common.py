"""Common schemas used across the application."""

from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class PaginationParams(BaseModel):
    """Query parameters for paginated endpoints."""

    skip: int = 0
    limit: int = 50


class PaginatedResponse(BaseModel):
    """Wrapper for paginated list responses."""

    total: int
    skip: int
    limit: int
    items: list  # overridden in concrete responses


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = "healthy"
    version: str
    app_name: str


class ErrorResponse(BaseModel):
    """Standard error response body."""

    error: bool = True
    detail: str


class MessageResponse(BaseModel):
    """Simple message response."""

    message: str
    id: Optional[UUID] = None
