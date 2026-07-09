"""FastAPI application entrypoint."""

from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import setup_logging, get_logger
from app.routers import api_router


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    """Startup / shutdown lifecycle events."""
    logger = get_logger("app.lifespan")
    logger.info("[START] %s v%s starting up", settings.APP_NAME, settings.APP_VERSION)
    yield
    logger.info("[STOP] %s shutting down", settings.APP_NAME)


def create_app() -> FastAPI:
    """Application factory."""
    setup_logging()

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="AI-First CRM — Healthcare Professional Module Backend",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── CORS ─────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Exception handlers ───────────────────────────
    register_exception_handlers(app)

    # ── Routers ──────────────────────────────────────
    app.include_router(api_router)

    return app


app = create_app()
