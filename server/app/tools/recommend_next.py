"""Reusable tool for recommending the next CRM action from interaction history."""

from __future__ import annotations

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.tools.groq_client import analyze_text_with_groq
from app.tools.interaction_history import get_interaction_history


async def recommend_next_action(session: AsyncSession, hcp_id: str | UUID) -> str:
    """Use Groq and the existing interaction history to recommend a next action."""
    history = await get_interaction_history(session, hcp_id)
    history_text = "\n".join(
        f"{interaction.date}: {interaction.topics or 'No summary'}" for interaction in history
    )
    prompt = (
        "Based on the following CRM interaction history, recommend the best next sales action "
        "for this HCP in one concise sentence.\n"
        f"{history_text or 'No prior interactions found.'}"
    )
    payload = analyze_text_with_groq(prompt)
    recommendation = payload.get("next_action") or payload.get("recommendation") or payload.get("summary")
    return str(recommendation or "schedule_follow_up")
