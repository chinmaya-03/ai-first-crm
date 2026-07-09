"""Health check router."""

from fastapi import APIRouter

from app.core.config import settings
from app.schemas.common import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Application health check."""
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        app_name=settings.APP_NAME,
    )
