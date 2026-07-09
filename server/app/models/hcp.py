"""HCP (Healthcare Professional) model."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin, UUIDMixin


class HCP(Base, UUIDMixin, TimestampMixin):
    """Healthcare Professional."""

    __tablename__ = "hcp"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    specialty: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    hospital: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=True)
    tier: Mapped[str] = mapped_column(String(1), nullable=False, default="C")  # A, B, C
    location: Mapped[str] = mapped_column(String(255), nullable=True)
    total_interactions: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_interaction: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Foreign keys
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )

    # Relationships
    created_by_user: Mapped["User"] = relationship("User", back_populates="hcps", lazy="selectin")  # noqa: F821
    interactions: Mapped[list["Interaction"]] = relationship(  # noqa: F821
        "Interaction", back_populates="hcp", lazy="selectin", cascade="all, delete-orphan"
    )
    followups: Mapped[list["FollowUp"]] = relationship(  # noqa: F821
        "FollowUp", back_populates="hcp", lazy="selectin", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<HCP {self.name} ({self.specialty})>"
