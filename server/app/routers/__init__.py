"""Router registration — aggregates all API routers."""

from fastapi import APIRouter

from app.routers.followup import router as followup_router
from app.routers.hcp import router as hcp_router
from app.routers.health import router as health_router
from app.routers.interaction import router as interaction_router
from app.routers.ai import router as ai_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health_router)
api_router.include_router(hcp_router)
api_router.include_router(interaction_router)
api_router.include_router(followup_router)
api_router.include_router(ai_router)
