"""Interaction repository."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.interaction import Interaction, InteractionType, Sentiment
from app.repositories.base import BaseRepository


class InteractionRepository(BaseRepository[Interaction]):
    """Data-access layer for Interactions."""

    def __init__(self, session: AsyncSession):
        super().__init__(Interaction, session)

    async def list_interactions(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        hcp_id: UUID | None = None,
        interaction_type: InteractionType | None = None,
        sentiment: Sentiment | None = None,
        search: str | None = None,
    ) -> tuple[list[Interaction], int]:
        """List interactions with optional filters."""
        filters: list[Any] = []

        if hcp_id:
            filters.append(Interaction.hcp_id == hcp_id)
        if interaction_type:
            filters.append(Interaction.type == interaction_type)
        if sentiment:
            filters.append(Interaction.sentiment == sentiment)
        if search:
            pattern = f"%{search}%"
            filters.append(Interaction.topics.ilike(pattern))

        return await self.list(
            skip=skip,
            limit=limit,
            filters=filters,
            order_by=Interaction.date.desc(),
        )
