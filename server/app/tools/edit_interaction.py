"""Reusable tool for editing existing CRM interactions."""

from __future__ import annotations

from datetime import date
from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequestError, NotFoundError
from app.core.logging import get_logger
from app.models.interaction import Interaction, Sentiment
from app.repositories.interaction import InteractionRepository

logger = get_logger(__name__)


async def edit_interaction(
    session: AsyncSession,
    *,
    interaction_id: str | UUID,
    topics: str | None = None,
    outcomes: str | None = None,
    sentiment: str | None = None,
    follow_up_actions: str | None = None,
    products_discussed: list[str] | None = None,
    follow_up_date: str | None = None,
    next_action: str | None = None,
) -> Interaction:
    """Update fields on an existing interaction."""
    try:
        interaction_uuid = interaction_id if isinstance(interaction_id, UUID) else UUID(str(interaction_id))
    except ValueError as exc:
        raise BadRequestError("Invalid interaction id") from exc

    repo = InteractionRepository(session)
    interaction = await repo.get_by_id(interaction_uuid)
    if not interaction:
        raise NotFoundError("Interaction", interaction_uuid)

    update_data: dict[str, Any] = {}
    if topics is not None:
        update_data["topics"] = topics
    if outcomes is not None:
        update_data["outcomes"] = outcomes
    if sentiment is not None:
        normalized = str(sentiment).strip().lower()
        try:
            update_data["sentiment"] = Sentiment(normalized).value
        except ValueError:
            update_data["sentiment"] = Sentiment.NEUTRAL.value
    if follow_up_actions is not None:
        update_data["follow_up_actions"] = follow_up_actions
    if products_discussed is not None:
        update_data["products_discussed"] = products_discussed
    if follow_up_date is not None:
        update_data["follow_up_date"] = _parse_date(follow_up_date)
    if next_action is not None:
        update_data["next_action"] = next_action

    updated = await repo.update(interaction, update_data)
    logger.info("Edited interaction %s", updated.id)
    return updated


def _parse_date(value: str) -> date | None:
    try:
        return date.fromisoformat(value)
    except ValueError:
        return None
