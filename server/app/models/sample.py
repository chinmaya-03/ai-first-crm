"""SampleDistributed model."""

from __future__ import annotations

import uuid

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin, UUIDMixin


class SampleDistributed(Base, UUIDMixin, TimestampMixin):
    """A drug sample distributed during an interaction."""

    __tablename__ = "samples_distributed"

    interaction_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("interaction.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    # Relationships
    interaction: Mapped["Interaction"] = relationship(  # noqa: F821
        "Interaction", back_populates="samples", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<SampleDistributed {self.name} x{self.quantity}>"
