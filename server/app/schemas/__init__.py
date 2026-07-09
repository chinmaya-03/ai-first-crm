"""Schemas package."""

from app.schemas.common import (
    ErrorResponse,
    HealthResponse,
    MessageResponse,
    PaginatedResponse,
    PaginationParams,
)
from app.schemas.followup import (
    FollowUpCreate,
    FollowUpListResponse,
    FollowUpResponse,
    FollowUpUpdate,
)
from app.schemas.hcp import HCPCreate, HCPListResponse, HCPResponse, HCPUpdate
from app.schemas.interaction import (
    InteractionCreate,
    InteractionListResponse,
    InteractionResponse,
    InteractionUpdate,
    MaterialCreate,
    MaterialResponse,
    SampleCreate,
    SampleResponse,
)

__all__ = [
    "ErrorResponse",
    "FollowUpCreate",
    "FollowUpListResponse",
    "FollowUpResponse",
    "FollowUpUpdate",
    "HCPCreate",
    "HCPListResponse",
    "HCPResponse",
    "HCPUpdate",
    "HealthResponse",
    "InteractionCreate",
    "InteractionListResponse",
    "InteractionResponse",
    "InteractionUpdate",
    "MaterialCreate",
    "MaterialResponse",
    "MessageResponse",
    "PaginatedResponse",
    "PaginationParams",
    "SampleCreate",
    "SampleResponse",
]
