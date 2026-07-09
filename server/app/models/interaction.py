"""Interaction model."""

from __future__ import annotations

import enum
import uuid
from datetime import date, time
from typing import Any

from sqlalchemy import Date, Enum, ForeignKey, String, Text, Time
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin, UUIDMixin


class InteractionType(str, enum.Enum):
    MEETING = "meeting"
    CALL = "call"
    EMAIL = "email"
    CONFERENCE = "conference"
    OTHER = "other"


class Sentiment(str, enum.Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"


class Interaction(Base, UUIDMixin, TimestampMixin):
    """A logged interaction between a user and an HCP."""

    __tablename__ = "interaction"

    # Foreign keys
    hcp_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("hcp.id", ondelete="CASCADE"), nullable=False, index=True
    )
    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )

    # Fields
    type: Mapped[InteractionType] = mapped_column(
        Enum(
            InteractionType,
            name="interaction_type",
            create_constraint=True,
            native_enum=False,
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        nullable=False,
        default=InteractionType.MEETING,
    )
    date: Mapped[date] = mapped_column(Date, nullable=False)
    time: Mapped[time | None] = mapped_column(Time, nullable=True)
    attendees: Mapped[str | None] = mapped_column(Text, nullable=True)
    topics: Mapped[str] = mapped_column(Text, nullable=False)
    sentiment: Mapped[Sentiment] = mapped_column(
        Enum(
            Sentiment,
            name="sentiment_type",
            create_constraint=True,
            native_enum=False,
            values_callable=lambda enum_cls: [member.value for member in enum_cls],
        ),
        nullable=False,
        default=Sentiment.NEUTRAL,
    )
    outcomes: Mapped[str | None] = mapped_column(Text, nullable=True)
    follow_up_actions: Mapped[str | None] = mapped_column(Text, nullable=True)
    products_discussed: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)
    objections: Mapped[list[str] | None] = mapped_column(JSONB, nullable=True)
    follow_up_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    next_action: Mapped[str | None] = mapped_column(Text, nullable=True)
    extracted_data: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)

    # Relationships
    hcp: Mapped["HCP"] = relationship("HCP", back_populates="interactions", lazy="selectin")  # noqa: F821
    created_by_user: Mapped["User"] = relationship("User", back_populates="interactions", lazy="selectin")  # noqa: F821
    materials: Mapped[list["MaterialShared"]] = relationship(  # noqa: F821
        "MaterialShared", back_populates="interaction", lazy="selectin", cascade="all, delete-orphan"
    )
    samples: Mapped[list["SampleDistributed"]] = relationship(  # noqa: F821
        "SampleDistributed", back_populates="interaction", lazy="selectin", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Interaction {self.type.value} on {self.date}>"
