"""FollowUp service — business logic for follow-up tasks."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.core.logging import get_logger
from app.models.followup import FollowUp
from app.repositories.followup import FollowUpRepository
from app.repositories.hcp import HCPRepository
from app.schemas.followup import FollowUpCreate, FollowUpUpdate

logger = get_logger(__name__)


class FollowUpService:
    """Orchestrates FollowUp operations."""

    def __init__(self, session: AsyncSession):
        self.repo = FollowUpRepository(session)
        self.hcp_repo = HCPRepository(session)
        self.session = session

    async def list_followups(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        hcp_id: UUID | None = None,
        status: str | None = None,
        priority: str | None = None,
    ) -> tuple[list[FollowUp], int]:
        """Return a filtered, paginated list of follow-ups."""
        from app.models.followup import TaskPriority, TaskStatus

        status_enum = TaskStatus(status) if status else None
        priority_enum = TaskPriority(priority) if priority else None

        items, total = await self.repo.list_followups(
            skip=skip,
            limit=limit,
            hcp_id=hcp_id,
            status=status_enum,
            priority=priority_enum,
        )
        logger.info("Listed %d/%d follow-ups", len(items), total)
        return items, total

    async def get_followup(self, followup_id: UUID) -> FollowUp:
        """Get a single follow-up or raise NotFoundError."""
        followup = await self.repo.get_by_id(followup_id)
        if not followup:
            raise NotFoundError("FollowUp", followup_id)
        return followup

    async def create_followup(self, data: FollowUpCreate) -> FollowUp:
        """Create a new follow-up task. Validates that the HCP exists."""
        hcp = await self.hcp_repo.get_by_id(data.hcp_id)
        if not hcp:
            raise NotFoundError("HCP", data.hcp_id)

        followup = FollowUp(**data.model_dump())
        followup = await self.repo.create(followup)
        logger.info("Created follow-up %s for HCP %s", followup.id, data.hcp_id)
        return followup

    async def update_followup(self, followup_id: UUID, data: FollowUpUpdate) -> FollowUp:
        """Update a follow-up task."""
        followup = await self.get_followup(followup_id)
        update_data = data.model_dump(exclude_unset=True)
        followup = await self.repo.update(followup, update_data)
        logger.info("Updated follow-up %s (status=%s)", followup.id, followup.status.value)
        return followup
