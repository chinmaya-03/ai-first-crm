"""Reusable tool for searching healthcare professionals."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.hcp import HCP


async def search_hcps(
    session: AsyncSession,
    *,
    doctor_name: str | None = None,
    hospital: str | None = None,
    specialty: str | None = None,
) -> list[HCP]:
    """Search HCP records by name, hospital, or specialty."""
    query = select(HCP)
    if doctor_name:
        query = query.where(HCP.name.ilike(f"%{doctor_name}%"))
    if hospital:
        query = query.where(HCP.hospital.ilike(f"%{hospital}%"))
    if specialty:
        query = query.where(HCP.specialty.ilike(f"%{specialty}%"))

    result = await session.execute(query.order_by(HCP.name.asc()))
    return list(result.scalars().all())
