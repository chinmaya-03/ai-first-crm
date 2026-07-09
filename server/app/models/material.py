"""MaterialShared model."""

from __future__ import annotations

import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin, UUIDMixin


class MaterialShared(Base, UUIDMixin, TimestampMixin):
    """A material/document shared during an interaction."""

    __tablename__ = "materials_shared"

    interaction_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("interaction.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=True)

    # Relationships
    interaction: Mapped["Interaction"] = relationship(  # noqa: F821
        "Interaction", back_populates="materials", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<MaterialShared {self.name}>"
