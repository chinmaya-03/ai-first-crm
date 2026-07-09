"""FastAPI dependency injection factories."""

from __future__ import annotations

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.services.ai_service import AIService
from app.services.followup import FollowUpService
from app.services.hcp import HCPService
from app.services.interaction import InteractionService


async def get_hcp_service(
    session: AsyncSession = Depends(get_db),
) -> HCPService:
    """Return an HCPService bound to the current session."""
    return HCPService(session)


async def get_interaction_service(
    session: AsyncSession = Depends(get_db),
) -> InteractionService:
    """Return an InteractionService bound to the current session."""
    return InteractionService(session)


async def get_followup_service(
    session: AsyncSession = Depends(get_db),
) -> FollowUpService:
    """Return a FollowUpService bound to the current session."""
    return FollowUpService(session)


async def get_ai_service(
    session: AsyncSession = Depends(get_db),
) -> AIService:
    """Return an AIService bound to the current session."""
    return AIService(session)
