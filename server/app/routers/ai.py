from __future__ import annotations

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_ai_service
from app.schemas.ai import (
    EditInteractionRequest,
    EditInteractionResponse,
    LogInteractionRequest,
    LogInteractionResponse,
    RecommendRequest,
    RecommendResponse,
    SearchHCPResponseItem,
    ViewInteractionItem,
)
from app.services.ai_service import AIService

logger = logging.getLogger("app.routers.ai")

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/log-interaction", response_model=LogInteractionResponse)
async def log_interaction(
    req: LogInteractionRequest,
    service: AIService = Depends(get_ai_service),
) -> LogInteractionResponse:
    result = await service.log_interaction(req.text, created_by=req.created_by)
    return LogInteractionResponse(**result)


@router.put("/edit-interaction/{interaction_id}", response_model=EditInteractionResponse)
async def edit_interaction(
    interaction_id: str,
    req: EditInteractionRequest,
    service: AIService = Depends(get_ai_service),
) -> EditInteractionResponse:
    interaction = await service.edit_interaction(
        interaction_id,
        topics=req.topics,
        outcomes=req.outcomes,
        sentiment=req.sentiment,
        follow_up_actions=req.follow_up_actions,
        products_discussed=req.products_discussed,
        follow_up_date=req.follow_up_date,
        next_action=req.next_action,
    )
    return EditInteractionResponse(
        id=str(interaction.id),
        topics=interaction.topics,
        outcomes=interaction.outcomes,
        sentiment=interaction.sentiment.value,
        follow_up_actions=interaction.follow_up_actions,
        products_discussed=interaction.products_discussed or [],
        follow_up_date=interaction.follow_up_date.isoformat() if interaction.follow_up_date else None,
        next_action=interaction.next_action,
    )


@router.get("/search-hcp", response_model=list[SearchHCPResponseItem])
async def search_hcp(
    doctor_name: str | None = None,
    hospital: str | None = None,
    specialty: str | None = None,
    service: AIService = Depends(get_ai_service),
) -> list[SearchHCPResponseItem]:
    hcps = await service.search_hcps(
        doctor_name=doctor_name,
        hospital=hospital,
        specialty=specialty,
    )
    return [
        SearchHCPResponseItem(
            id=str(hcp.id),
            name=hcp.name,
            specialty=hcp.specialty,
            hospital=hcp.hospital,
        )
        for hcp in hcps
    ]


@router.get("/history/{hcp_id}", response_model=list[ViewInteractionItem])
async def history(
    hcp_id: str,
    service: AIService = Depends(get_ai_service),
) -> list[ViewInteractionItem]:
    interactions = await service.get_history(hcp_id)
    return [
        ViewInteractionItem(
            id=str(interaction.id),
            date=interaction.date,
            topics=interaction.topics,
            sentiment=interaction.sentiment.value,
            outcomes=interaction.outcomes,
        )
        for interaction in interactions
    ]


@router.post("/recommend-next", response_model=RecommendResponse)
async def recommend_next(
    req: RecommendRequest,
    service: AIService = Depends(get_ai_service),
) -> RecommendResponse:
    recommendation = await service.recommend_next(req.hcp_id)
    return RecommendResponse(recommendation=recommendation)
