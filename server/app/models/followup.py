"""FollowUp model."""

from __future__ import annotations

import enum
import uuid
from datetime import date

from sqlalchemy import Date, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin, UUIDMixin


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class FollowUp(Base, UUIDMixin, TimestampMixin):
    """A follow-up task linked to an HCP (and optionally an interaction)."""

    __tablename__ = "followups"

    # Foreign keys
    hcp_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("hcp.id", ondelete="CASCADE"), nullable=False, index=True
    )
    interaction_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("interaction.id", ondelete="SET NULL"), nullable=True
    )
    assigned_to: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )

    # Fields
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    priority: Mapped[TaskPriority] = mapped_column(
        Enum(TaskPriority, name="task_priority", create_constraint=True),
        nullable=False,
        default=TaskPriority.MEDIUM,
    )
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, name="task_status", create_constraint=True),
        nullable=False,
        default=TaskStatus.PENDING,
    )

    # Relationships
    hcp: Mapped["HCP"] = relationship("HCP", back_populates="followups", lazy="selectin")  # noqa: F821
    interaction: Mapped["Interaction | None"] = relationship("Interaction", lazy="selectin")  # noqa: F821
    assigned_to_user: Mapped["User | None"] = relationship("User", back_populates="followups", lazy="selectin")  # noqa: F821

    def __repr__(self) -> str:
        return f"<FollowUp {self.title[:40]}>"
