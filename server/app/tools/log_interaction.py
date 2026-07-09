"""Reusable tool for extracting and storing a CRM interaction from free text."""

from __future__ import annotations

from datetime import date,datetime, timezone
import re
from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.graph import crm_graph
from app.core.logging import get_logger
from app.models.hcp import HCP
from app.models.interaction import Interaction, InteractionType, Sentiment
from app.repositories.hcp import HCPRepository
from app.repositories.interaction import InteractionRepository

logger = get_logger(__name__)


async def log_interaction(
    session: AsyncSession,
    *,
    text: str,
    created_by: str | None = None,
) -> dict[str, Any]:
    """Invoke the LangGraph workflow, extract structured CRM data, and persist it."""
    if not text or not text.strip():
        raise ValueError("Interaction text is required")

    graph_result = crm_graph.invoke({"conversation": text})
    print("=" * 60)
    print("GRAPH RESULT")
    print(graph_result)
    print("=" * 60)

    print("EXTRACTED DATA")
    print(graph_result.get("extracted_data"))
    print("=" * 60)
    extracted_data = graph_result.get("extracted_data") or {}
    if not isinstance(extracted_data, dict):
        raise ValueError("LangGraph did not return structured output")

    doctor_name = _normalize_text(extracted_data.get("doctor_name"), default="Unknown")
    hospital = _normalize_text(extracted_data.get("hospital"), default="Unknown")
    specialty = _normalize_text(extracted_data.get("specialty"), default="general")

    hcp_repo = HCPRepository(session)
    interaction_repo = InteractionRepository(session)

    hcp = await hcp_repo.get_by_name_and_hospital(doctor_name, hospital)
    if not hcp:
        hcp = HCP(
            name=doctor_name,
            specialty=specialty,
            hospital=hospital,
            email=_build_email(doctor_name, hospital),
        )
        hcp = await hcp_repo.create(hcp)

    interaction = Interaction(
        hcp_id=hcp.id,
        created_by=UUID(created_by) if created_by else None,
        type=_parse_interaction_type(extracted_data.get("interaction_type")),
        date=datetime.now(timezone.utc).date(),
        topics=_pick_summary(extracted_data),
        sentiment=_parse_sentiment(extracted_data.get("sentiment")),
        outcomes=_build_outcomes(extracted_data.get("objections")),
        follow_up_actions=_normalize_text(extracted_data.get("next_action")),
        products_discussed=_build_products_discussed(extracted_data.get("products_discussed")),
        objections=_build_list(extracted_data.get("objections")),
        follow_up_date=_parse_date(extracted_data.get("follow_up_date")),
        next_action=_normalize_text(extracted_data.get("next_action")),
        extracted_data=extracted_data,
    )
    interaction = await interaction_repo.create(interaction)

    hcp.total_interactions = (hcp.total_interactions or 0) + 1
    hcp.last_interaction = datetime.now(timezone.utc)
    await session.flush()

    logger.info("Logged interaction %s for HCP %s", interaction.id, hcp.id)
    return {
        "hcp_id": str(hcp.id),
        "interaction_id": str(interaction.id),
        "doctor_name": doctor_name,
        "hospital": hospital,
        "specialty": specialty,
        "products_discussed": extracted_data.get("products_discussed") or [],
        "summary": interaction.topics,
        "sentiment": interaction.sentiment.value,
        "objections": extracted_data.get("objections") or [],
        "follow_up_date": _normalize_optional_text(extracted_data.get("follow_up_date")),
        "next_action": _normalize_optional_text(extracted_data.get("next_action")),
    }


def _normalize_text(value: Any, *, default: str | None = None) -> str:
    if value is None:
        return default or ""
    text = str(value).strip()
    return text or (default or "")


def _normalize_optional_text(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _build_list(value: Any) -> list[str] | None:
    if not value:
        return None
    if isinstance(value, list):
        return [str(item) for item in value if item]
    return [str(value)]


def _pick_summary(extracted_data: dict[str, Any]) -> str:
    return _normalize_text(
        extracted_data.get("interaction_summary")
        or extracted_data.get("summary")
        or extracted_data.get("next_action")
        or "Interaction captured",
    )


def _build_outcomes(objections: Any) -> str | None:
    if not objections:
        return None
    if isinstance(objections, list):
        return "; ".join(str(item) for item in objections if item)
    return str(objections)


def _build_products_discussed(value: Any) -> str | None:
    if not value:
        return None
    if isinstance(value, list):
        return "; ".join(str(item) for item in value if item)
    return str(value)


def _parse_date(value: Any) -> date | None:
    if not value:
        return None
    if isinstance(value, date):
        return value
    try:
        return datetime.fromisoformat(str(value)).date()
    except ValueError:
        return None


def _parse_interaction_type(value: Any) -> str:
    normalized = str(value or "meeting").strip().lower()
    try:
        return InteractionType(normalized).value
    except ValueError:
        return InteractionType.MEETING.value


def _parse_sentiment(value: Any) -> str:
    normalized = str(value or "neutral").strip().lower()
    try:
        return Sentiment(normalized).value
    except ValueError:
        return Sentiment.NEUTRAL.value


def _build_email(name: str, hospital: str) -> str:
    base = f"{re.sub(r'[^a-z0-9]+', '', name.lower())}.{re.sub(r'[^a-z0-9]+', '', hospital.lower())}"[:40]
    return f"{base or 'hcp'}@example.com"
