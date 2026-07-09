"""Interaction API router."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.api.dependencies import get_interaction_service
from app.schemas.common import MessageResponse
from app.schemas.interaction import (
    InteractionCreate,
    InteractionListResponse,
    InteractionResponse,
    InteractionUpdate,
)
from app.services.interaction import InteractionService
from app.utils.pagination import clamp_pagination

router = APIRouter(prefix="/interactions", tags=["Interactions"])


@router.get("", response_model=InteractionListResponse)
async def list_interactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    hcp_id: Optional[UUID] = Query(None),
    type: Optional[str] = Query(None, alias="type"),
    sentiment: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    service: InteractionService = Depends(get_interaction_service),
) -> InteractionListResponse:
    """List all interactions with optional filtering and pagination."""
    skip, limit = clamp_pagination(skip, limit)
    items, total = await service.list_interactions(
        skip=skip,
        limit=limit,
        hcp_id=hcp_id,
        interaction_type=type,
        sentiment=sentiment,
        search=search,
    )
    return InteractionListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=[InteractionResponse.model_validate(i) for i in items],
    )


@router.post("", response_model=InteractionResponse, status_code=201)
async def create_interaction(
    data: InteractionCreate,
    service: InteractionService = Depends(get_interaction_service),
) -> InteractionResponse:
    """Create a new interaction with materials and samples."""
    interaction = await service.create_interaction(data)
    return InteractionResponse.model_validate(interaction)


@router.get("/{interaction_id}", response_model=InteractionResponse)
async def get_interaction(
    interaction_id: UUID,
    service: InteractionService = Depends(get_interaction_service),
) -> InteractionResponse:
    """Get a single interaction by ID."""
    interaction = await service.get_interaction(interaction_id)
    return InteractionResponse.model_validate(interaction)


@router.put("/{interaction_id}", response_model=InteractionResponse)
async def update_interaction(
    interaction_id: UUID,
    data: InteractionUpdate,
    service: InteractionService = Depends(get_interaction_service),
) -> InteractionResponse:
    """Update an existing interaction."""
    interaction = await service.update_interaction(interaction_id, data)
    return InteractionResponse.model_validate(interaction)


@router.delete("/{interaction_id}", response_model=MessageResponse)
async def delete_interaction(
    interaction_id: UUID,
    service: InteractionService = Depends(get_interaction_service),
) -> MessageResponse:
    """Delete an interaction."""
    await service.delete_interaction(interaction_id)
    return MessageResponse(message="Interaction deleted successfully", id=interaction_id)
