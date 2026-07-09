"""FollowUp API router."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.api.dependencies import get_followup_service
from app.schemas.followup import (
    FollowUpCreate,
    FollowUpListResponse,
    FollowUpResponse,
    FollowUpUpdate,
)
from app.services.followup import FollowUpService
from app.utils.pagination import clamp_pagination

router = APIRouter(prefix="/followups", tags=["Follow-ups"])


@router.get("", response_model=FollowUpListResponse)
async def list_followups(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    hcp_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    service: FollowUpService = Depends(get_followup_service),
) -> FollowUpListResponse:
    """List all follow-up tasks with optional filtering and pagination."""
    skip, limit = clamp_pagination(skip, limit)
    items, total = await service.list_followups(
        skip=skip, limit=limit, hcp_id=hcp_id, status=status, priority=priority
    )
    return FollowUpListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=[FollowUpResponse.model_validate(f) for f in items],
    )


@router.post("", response_model=FollowUpResponse, status_code=201)
async def create_followup(
    data: FollowUpCreate,
    service: FollowUpService = Depends(get_followup_service),
) -> FollowUpResponse:
    """Create a new follow-up task."""
    followup = await service.create_followup(data)
    return FollowUpResponse.model_validate(followup)


@router.put("/{followup_id}", response_model=FollowUpResponse)
async def update_followup(
    followup_id: UUID,
    data: FollowUpUpdate,
    service: FollowUpService = Depends(get_followup_service),
) -> FollowUpResponse:
    """Update a follow-up task (e.g. change status, priority)."""
    followup = await service.update_followup(followup_id, data)
    return FollowUpResponse.model_validate(followup)
