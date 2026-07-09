"""HCP service — business logic for Healthcare Professionals."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ConflictError, NotFoundError
from app.core.logging import get_logger
from app.models.hcp import HCP
from app.repositories.hcp import HCPRepository
from app.schemas.hcp import HCPCreate, HCPUpdate

logger = get_logger(__name__)


class HCPService:
    """Orchestrates HCP operations."""

    def __init__(self, session: AsyncSession):
        self.repo = HCPRepository(session)
        self.session = session

    async def list_hcps(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        specialty: str | None = None,
        tier: str | None = None,
        search: str | None = None,
    ) -> tuple[list[HCP], int]:
        """Return a filtered, paginated list of HCPs."""
        items, total = await self.repo.list_hcps(
            skip=skip, limit=limit, specialty=specialty, tier=tier, search=search
        )
        logger.info("Listed %d/%d HCPs (skip=%d, limit=%d)", len(items), total, skip, limit)
        return items, total

    async def get_hcp(self, hcp_id: UUID) -> HCP:
        """Get a single HCP or raise NotFoundError."""
        hcp = await self.repo.get_by_id(hcp_id)
        if not hcp:
            raise NotFoundError("HCP", hcp_id)
        return hcp

    async def create_hcp(self, data: HCPCreate) -> HCP:
        """Create a new HCP. Checks for duplicate email."""
        existing = await self.repo.get_by_email(data.email)
        if existing:
            raise ConflictError(f"HCP with email '{data.email}' already exists")

        hcp = HCP(**data.model_dump())
        hcp = await self.repo.create(hcp)
        logger.info("Created HCP %s (%s)", hcp.id, hcp.name)
        return hcp

    async def update_hcp(self, hcp_id: UUID, data: HCPUpdate) -> HCP:
        """Update an existing HCP."""
        hcp = await self.get_hcp(hcp_id)
        update_data = data.model_dump(exclude_unset=True)

        # Check email uniqueness if email is changing
        if "email" in update_data and update_data["email"] != hcp.email:
            existing = await self.repo.get_by_email(update_data["email"])
            if existing:
                raise ConflictError(f"HCP with email '{update_data['email']}' already exists")

        hcp = await self.repo.update(hcp, update_data)
        logger.info("Updated HCP %s", hcp.id)
        return hcp

    async def delete_hcp(self, hcp_id: UUID) -> None:
        """Delete an HCP."""
        hcp = await self.get_hcp(hcp_id)
        await self.repo.delete(hcp)
        logger.info("Deleted HCP %s", hcp_id)
