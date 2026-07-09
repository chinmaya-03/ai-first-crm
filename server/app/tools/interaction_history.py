"""Reusable tool for reading interaction history for an HCP."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.interaction import Interaction
from app.repositories.interaction import InteractionRepository


async def get_interaction_history(session: AsyncSession, hcp_id: str | UUID) -> list[Interaction]:
    """Return an HCP's past interactions sorted by recency."""
    interaction_id = hcp_id if isinstance(hcp_id, UUID) else UUID(str(hcp_id))
    repo = InteractionRepository(session)
    items, _ = await repo.list_interactions(hcp_id=interaction_id, limit=20)
    return items
