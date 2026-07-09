"""HCP API router."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query

from app.api.dependencies import get_hcp_service
from app.schemas.common import MessageResponse
from app.schemas.hcp import HCPCreate, HCPListResponse, HCPResponse, HCPUpdate
from app.services.hcp import HCPService
from app.utils.pagination import clamp_pagination

router = APIRouter(prefix="/hcps", tags=["HCPs"])


@router.get("", response_model=HCPListResponse)
async def list_hcps(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    specialty: Optional[str] = Query(None),
    tier: Optional[str] = Query(None, pattern=r"^[ABC]$"),
    search: Optional[str] = Query(None),
    service: HCPService = Depends(get_hcp_service),
) -> HCPListResponse:
    """List all HCPs with optional filtering and pagination."""
    skip, limit = clamp_pagination(skip, limit)
    items, total = await service.list_hcps(
        skip=skip, limit=limit, specialty=specialty, tier=tier, search=search
    )
    return HCPListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=[HCPResponse.model_validate(h) for h in items],
    )


@router.post("", response_model=HCPResponse, status_code=201)
async def create_hcp(
    data: HCPCreate,
    service: HCPService = Depends(get_hcp_service),
) -> HCPResponse:
    """Create a new Healthcare Professional."""
    hcp = await service.create_hcp(data)
    return HCPResponse.model_validate(hcp)


@router.get("/{hcp_id}", response_model=HCPResponse)
async def get_hcp(
    hcp_id: UUID,
    service: HCPService = Depends(get_hcp_service),
) -> HCPResponse:
    """Get a single HCP by ID."""
    hcp = await service.get_hcp(hcp_id)
    return HCPResponse.model_validate(hcp)


@router.put("/{hcp_id}", response_model=HCPResponse)
async def update_hcp(
    hcp_id: UUID,
    data: HCPUpdate,
    service: HCPService = Depends(get_hcp_service),
) -> HCPResponse:
    """Update an existing HCP."""
    hcp = await service.update_hcp(hcp_id, data)
    return HCPResponse.model_validate(hcp)


@router.delete("/{hcp_id}", response_model=MessageResponse)
async def delete_hcp(
    hcp_id: UUID,
    service: HCPService = Depends(get_hcp_service),
) -> MessageResponse:
    """Delete an HCP and all associated data."""
    await service.delete_hcp(hcp_id)
    return MessageResponse(message="HCP deleted successfully", id=hcp_id)
