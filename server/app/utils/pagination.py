"""Pagination helpers."""

from __future__ import annotations


def clamp_pagination(skip: int, limit: int, max_limit: int = 100) -> tuple[int, int]:
    """Ensure skip >= 0 and limit is within bounds."""
    return max(0, skip), max(1, min(limit, max_limit))
