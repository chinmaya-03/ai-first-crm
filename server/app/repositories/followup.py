"""FollowUp repository."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.followup import FollowUp, TaskPriority, TaskStatus
from app.repositories.base import BaseRepository


class FollowUpRepository(BaseRepository[FollowUp]):
    """Data-access layer for Follow-up Tasks."""

    def __init__(self, session: AsyncSession):
        super().__init__(FollowUp, session)

    async def list_followups(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        hcp_id: UUID | None = None,
        status: TaskStatus | None = None,
        priority: TaskPriority | None = None,
    ) -> tuple[list[FollowUp], int]:
        """List follow-ups with optional filters."""
        filters: list[Any] = []

        if hcp_id:
            filters.append(FollowUp.hcp_id == hcp_id)
        if status:
            filters.append(FollowUp.status == status)
        if priority:
            filters.append(FollowUp.priority == priority)

        return await self.list(
            skip=skip,
            limit=limit,
            filters=filters,
            order_by=FollowUp.due_date.asc(),
        )
