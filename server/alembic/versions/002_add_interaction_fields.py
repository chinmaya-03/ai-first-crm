"""Add AI extraction fields to interactions

Revision ID: 002_add_interaction_fields
Revises: 001_initial
Create Date: 2026-07-09
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "002_add_interaction_fields"
down_revision = "001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "interaction",
        sa.Column("products_discussed", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )
    op.add_column(
        "interaction",
        sa.Column("objections", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )
    op.add_column(
        "interaction",
        sa.Column("follow_up_date", sa.Date(), nullable=True),
    )
    op.add_column(
        "interaction",
        sa.Column("next_action", sa.Text(), nullable=True),
    )
    op.add_column(
        "interaction",
        sa.Column("extracted_data", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("interaction", "extracted_data")
    op.drop_column("interaction", "next_action")
    op.drop_column("interaction", "follow_up_date")
    op.drop_column("interaction", "objections")
    op.drop_column("interaction", "products_discussed")
