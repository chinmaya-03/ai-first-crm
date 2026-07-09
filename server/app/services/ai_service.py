"""Service layer for AI-first CRM workflows."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestError
from app.core.logging import get_logger
from app.models.hcp import HCP
from app.models.interaction import Interaction
from app.tools.edit_interaction import edit_interaction as edit_interaction_tool
from app.tools.interaction_history import get_interaction_history
from app.tools.log_interaction import log_interaction as log_interaction_tool
from app.tools.recommend_next import recommend_next_action as recommend_next_action_tool
from app.tools.search_hcp import search_hcps as search_hcps_tool

logger = get_logger(__name__)


class AIService:
    """Coordinate AI-driven CRM operations using the existing tool layer."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def log_interaction(self, text: str, created_by: str | None = None) -> dict[str, str]:
        """Invoke the existing graph and persist the extracted interaction."""
        if not text or not text.strip():
            raise BadRequestError("Interaction text is required")

        result = await log_interaction_tool(self.session, text=text, created_by=created_by)
        logger.info("AI log interaction completed", extra={"interaction_id": result.get("interaction_id")})
        return result

    async def edit_interaction(
        self,
        interaction_id: str,
        *,
        topics: str | None = None,
        outcomes: str | None = None,
        sentiment: str | None = None,
        follow_up_actions: str | None = None,
        products_discussed: list[str] | None = None,
        follow_up_date: str | None = None,
        next_action: str | None = None,
    ) -> Interaction:
        """Update an existing interaction."""
        return await edit_interaction_tool(
            self.session,
            interaction_id=interaction_id,
            topics=topics,
            outcomes=outcomes,
            sentiment=sentiment,
            follow_up_actions=follow_up_actions,
            products_discussed=products_discussed,
            follow_up_date=follow_up_date,
            next_action=next_action,
        )

    async def search_hcps(
        self,
        *,
        doctor_name: str | None = None,
        hospital: str | None = None,
        specialty: str | None = None,
    ) -> list[HCP]:
        """Search HCP records by name, hospital, or specialty."""
        return await search_hcps_tool(
            self.session,
            doctor_name=doctor_name,
            hospital=hospital,
            specialty=specialty,
        )

    async def get_history(self, hcp_id: str) -> list[Interaction]:
        """Return the latest interactions for an HCP."""
        self._validate_uuid(hcp_id, field_name="hcp_id")
        return await get_interaction_history(self.session, hcp_id)

    async def recommend_next(self, hcp_id: str) -> str:
        """Recommend the next CRM action based on interaction history."""
        self._validate_uuid(hcp_id, field_name="hcp_id")
        return await recommend_next_action_tool(self.session, hcp_id)

    @staticmethod
    def _validate_uuid(value: str, *, field_name: str) -> None:
        try:
            UUID(str(value))
        except ValueError as exc:
            raise BadRequestError(f"Invalid {field_name}") from exc
