"""User model."""

from __future__ import annotations

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin, UUIDMixin


class User(Base, UUIDMixin, TimestampMixin):
    """Application user (MSL / medical rep)."""

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False, default="msl")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    hcps: Mapped[list["HCP"]] = relationship("HCP", back_populates="created_by_user", lazy="selectin")  # noqa: F821
    interactions: Mapped[list["Interaction"]] = relationship("Interaction", back_populates="created_by_user", lazy="selectin")  # noqa: F821
    followups: Mapped[list["FollowUp"]] = relationship("FollowUp", back_populates="assigned_to_user", lazy="selectin")  # noqa: F821

    def __repr__(self) -> str:
        return f"<User {self.email}>"
