"""Custom exception classes and FastAPI exception handlers."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


# ── Custom Exceptions ────────────────────────────────


class AppException(Exception):
    """Base application exception."""

    def __init__(self, detail: str, status_code: int = 500, extra: dict[str, Any] | None = None):
        self.detail = detail
        self.status_code = status_code
        self.extra = extra or {}
        super().__init__(detail)


class NotFoundError(AppException):
    """Resource not found."""

    def __init__(self, resource: str, resource_id: UUID | str):
        super().__init__(
            detail=f"{resource} with id '{resource_id}' not found",
            status_code=404,
        )


class ConflictError(AppException):
    """Duplicate / conflict."""

    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(detail=detail, status_code=409)


class BadRequestError(AppException):
    """Bad request."""

    def __init__(self, detail: str = "Bad request"):
        super().__init__(detail=detail, status_code=400)


# ── Exception Handlers ──────────────────────────────


def register_exception_handlers(app: FastAPI) -> None:
    """Attach global exception handlers to the FastAPI app."""

    @app.exception_handler(AppException)
    async def app_exception_handler(_request: Request, exc: AppException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": True,
                "detail": exc.detail,
                **exc.extra,
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(_request: Request, exc: Exception) -> JSONResponse:
        import logging

        logging.getLogger("app").exception("Unhandled exception: %s", exc)
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "detail": "Internal server error",
            },
        )
