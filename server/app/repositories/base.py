"""Generic async CRUD repository base class."""

from __future__ import annotations

from typing import Any, Generic, TypeVar
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Provides reusable CRUD operations for any SQLAlchemy model."""

    def __init__(self, model: type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def get_by_id(self, entity_id: UUID) -> ModelType | None:
        """Fetch a single record by primary key."""
        result = await self.session.execute(
            select(self.model).where(self.model.id == entity_id)
        )
        return result.scalars().first()

    async def list(
        self,
        *,
        skip: int = 0,
        limit: int = 50,
        filters: list[Any] | None = None,
        order_by: Any = None,
    ) -> tuple[list[ModelType], int]:
        """Return a paginated list and total count."""
        query = select(self.model)
        count_query = select(func.count()).select_from(self.model)

        if filters:
            for f in filters:
                query = query.where(f)
                count_query = count_query.where(f)

        if order_by is not None:
            query = query.order_by(order_by)
        else:
            query = query.order_by(self.model.created_at.desc())

        # Total count
        total_result = await self.session.execute(count_query)
        total = total_result.scalar() or 0

        # Paginated items
        query = query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        items = list(result.scalars().all())

        return items, total

    async def create(self, entity: ModelType) -> ModelType:
        """Insert a new record."""
        self.session.add(entity)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def update(self, entity: ModelType, data: dict[str, Any]) -> ModelType:
        """Update fields on an existing record."""
        for key, value in data.items():
            if value is not None:
                setattr(entity, key, value)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def delete(self, entity: ModelType) -> None:
        """Delete a record."""
        await self.session.delete(entity)
        await self.session.flush()
