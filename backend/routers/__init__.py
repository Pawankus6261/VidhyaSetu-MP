# VidyaSetu MP Routers Package
from backend.routers.auth import router as auth_router
from backend.routers.sync import router as sync_router
from backend.routers.content import router as content_router
from backend.routers.doubts import router as doubts_router
from backend.routers.voice import router as voice_router
from backend.routers.scholarships import router as scholarships_router
from backend.routers.career import router as career_router
from backend.routers.system import router as system_router

__all__ = [
    "auth_router",
    "sync_router",
    "content_router",
    "doubts_router",
    "voice_router",
    "scholarships_router",
    "career_router",
    "system_router",
]
