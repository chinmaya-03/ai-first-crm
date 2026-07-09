"""HCP repository."""

from __future__ import annotations

from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.hcp import HCP
from app.repositories.base import BaseRepository


class HCPRepository(BaseRepository[HCP]):
    """Data-access layer for Healthcare Professionals."""

    def __init__(self, session: AsyncSession):
        super().__init__(HCP, session)

    async def list_hcps(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        specialty: str | None = None,
        tier: str | None = None,
        search: str | None = None,
    ) -> tuple[list[HCP], int]:
        """List HCPs with optional filters."""
        filters: list[Any] = []

        if specialty and specialty != "all":
            filters.append(HCP.specialty == specialty)
        if tier:
            filters.append(HCP.tier == tier)
        if search:
            pattern = f"%{search}%"
            filters.append(
                HCP.name.ilike(pattern) | HCP.hospital.ilike(pattern)
            )

        return await self.list(skip=skip, limit=limit, filters=filters)

    async def get_by_email(self, email: str) -> HCP | None:
        """Find an HCP by email address."""
        result = await self.session.execute(
            select(HCP).where(HCP.email == email)
        )
        return result.scalars().first()

    async def get_by_name_and_hospital(self, name: str, hospital: str) -> HCP | None:
        """Find an HCP by name and hospital."""
        result = await self.session.execute(
            select(HCP).where(HCP.name == name).where(HCP.hospital == hospital)
        )
        return result.scalars().first()
