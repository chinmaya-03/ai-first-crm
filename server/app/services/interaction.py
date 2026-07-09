"""Interaction service — business logic for Interactions."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.core.logging import get_logger
from app.models.interaction import Interaction
from app.models.material import MaterialShared
from app.models.sample import SampleDistributed
from app.repositories.hcp import HCPRepository
from app.repositories.interaction import InteractionRepository
from app.schemas.interaction import InteractionCreate, InteractionUpdate

logger = get_logger(__name__)


class InteractionService:
    """Orchestrates Interaction operations."""

    def __init__(self, session: AsyncSession):
        self.repo = InteractionRepository(session)
        self.hcp_repo = HCPRepository(session)
        self.session = session

    async def list_interactions(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        hcp_id: UUID | None = None,
        interaction_type: str | None = None,
        sentiment: str | None = None,
        search: str | None = None,
    ) -> tuple[list[Interaction], int]:
        """Return a filtered, paginated list of interactions."""
        from app.models.interaction import InteractionType, Sentiment

        type_enum = InteractionType(interaction_type) if interaction_type else None
        sentiment_enum = Sentiment(sentiment) if sentiment else None

        items, total = await self.repo.list_interactions(
            skip=skip,
            limit=limit,
            hcp_id=hcp_id,
            interaction_type=type_enum,
            sentiment=sentiment_enum,
            search=search,
        )
        logger.info("Listed %d/%d interactions", len(items), total)
        return items, total

    async def get_interaction(self, interaction_id: UUID) -> Interaction:
        """Get a single interaction or raise NotFoundError."""
        interaction = await self.repo.get_by_id(interaction_id)
        if not interaction:
            raise NotFoundError("Interaction", interaction_id)
        return interaction

    async def create_interaction(self, data: InteractionCreate) -> Interaction:
        """Create a new interaction with materials and samples, update HCP stats."""
        # Verify HCP exists
        hcp = await self.hcp_repo.get_by_id(data.hcp_id)
        if not hcp:
            raise NotFoundError("HCP", data.hcp_id)

        # Build interaction
        interaction_data = data.model_dump(exclude={"materials", "samples"})
        interaction = Interaction(**interaction_data)

        # Attach materials
        for mat in data.materials:
            interaction.materials.append(MaterialShared(**mat.model_dump()))

        # Attach samples
        for sample in data.samples:
            interaction.samples.append(SampleDistributed(**sample.model_dump()))

        interaction = await self.repo.create(interaction)

        # Update HCP stats
        hcp.total_interactions = (hcp.total_interactions or 0) + 1
        hcp.last_interaction = datetime.now(timezone.utc)
        await self.session.flush()

        logger.info("Created interaction %s for HCP %s", interaction.id, data.hcp_id)
        return interaction

    async def update_interaction(self, interaction_id: UUID, data: InteractionUpdate) -> Interaction:
        """Update an existing interaction."""
        interaction = await self.get_interaction(interaction_id)
        update_data = data.model_dump(exclude_unset=True)
        interaction = await self.repo.update(interaction, update_data)
        logger.info("Updated interaction %s", interaction.id)
        return interaction

    async def delete_interaction(self, interaction_id: UUID) -> None:
        """Delete an interaction and decrement HCP stats."""
        interaction = await self.get_interaction(interaction_id)

        # Decrement HCP interaction count
        hcp = await self.hcp_repo.get_by_id(interaction.hcp_id)
        if hcp and hcp.total_interactions > 0:
            hcp.total_interactions -= 1
            await self.session.flush()

        await self.repo.delete(interaction)
        logger.info("Deleted interaction %s", interaction_id)
