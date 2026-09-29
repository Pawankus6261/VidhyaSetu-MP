# VidyaSetu MP (विद्यासेतु) — FastAPI Cloud Gateway Tier
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from backend.config import settings
from backend.database import init_db
from backend.seed import seed_all_data
from backend.routers import (
    auth_router,
    sync_router,
    content_router,
    doubts_router,
    voice_router,
    scholarships_router,
    career_router,
    system_router,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("vidyasetu.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes database schema, seed datasets, and storage paths on server startup."""
    logger.info("Initializing VidyaSetu MP Cloud Gateway Tier...")
    try:
        init_db()
        seed_all_data()
        logger.info("VidyaSetu MP backend initialized successfully.")
    except Exception as e:
        logger.error(f"Error during backend startup initialization: {e}")
    yield
    logger.info("Shutting down VidyaSetu MP Cloud Gateway.")

app = FastAPI(
    title="VidyaSetu MP (विद्यासेतु) Cloud Gateway Tier",
    description=(
        "Production-grade, offline-first RESTful API gateway engineered specifically "
        "for low-resource Android devices over 0 kbps to 40 kbps bandwidth in rural Madhya Pradesh. "
        "Compliant with DPDP Act 2023, RTE/NEP 2020, and WCAG 2.2 Level AA."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# 1. CORS Middleware for Mobile (React Native / Expo), Desktop (Electron), and Web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "Accept-Ranges", "ETag", "X-Idempotency-Key"]
)

# 2. GZip Middleware for low-bandwidth JSON compression (>1KB payloads)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 3. Mount Modular Routers
app.include_router(system_router)
app.include_router(auth_router)
app.include_router(sync_router)
app.include_router(content_router)
app.include_router(doubts_router)
app.include_router(voice_router)
app.include_router(scholarships_router)
app.include_router(career_router)

@app.get("/")
def root():
    """Root platform index & live status."""
    return {
        "platform": "VidyaSetu MP (विद्यासेतु)",
        "tagline": "Offline-First Vernacular Higher Education & Opportunity OS for Rural Madhya Pradesh",
        "status": "OPERATIONAL",
        "version": "2.0.0",
        "documentation": "/docs",
        "health_check": "/health",
        "core_endpoints": {
            "sync": "/api/v1/sync/push",
            "content_packs": "/api/v1/content/packs",
            "doubt_resolution": "/api/v1/doubts/resolve",
            "vernacular_voice": "/api/v1/voice/normalize",
            "scholarships_audit": "/api/v1/scholarships/audit",
            "career_recommendations": "/api/v1/career/recommend"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.API_HOST, port=settings.API_PORT, reload=True)
