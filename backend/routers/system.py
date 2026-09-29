# VidyaSetu MP — System Health, Telemetry & Maintenance Router
import time
import os
import psutil
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.database import get_db, DB_ENGINE_TYPE
from backend.config import settings
from backend.seed import seed_all_data

router = APIRouter(tags=["System Health & Maintenance"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    Comprehensive liveness and readiness probe checking:
    - Primary database connection (PostgreSQL / SQLite fallback)
    - Local storage directory writable status
    - System memory and process status
    """
    db_status = "HEALTHY"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"UNHEALTHY ({e})"

    storage_writable = os.access(settings.LOCAL_STORAGE_DIR, os.W_OK)

    return {
        "status": "ONLINE",
        "service": "VidyaSetu MP Cloud Gateway",
        "timestamp": int(time.time()),
        "environment": settings.ENVIRONMENT,
        "database": {
            "type": DB_ENGINE_TYPE,
            "status": db_status
        },
        "storage": {
            "path": settings.LOCAL_STORAGE_DIR,
            "writable": storage_writable
        },
        "system_resources": {
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent
        }
    }

@router.get("/api/v1/system/info")
def system_info():
    """Returns platform metadata, versioning, and compliance status."""
    return {
        "platform_name": "VidyaSetu MP (विद्यासेतु)",
        "version": "2.0.0-PROD",
        "target_region": "Madhya Pradesh (Tribal & Rural Focus)",
        "supported_bandwidth": "0 kbps (Airplane Mode) to 40 kbps",
        "supported_codecs": ["Opus Mono 14kbps", "Vector SVG", "Brotli Quality 9"],
        "compliance": [
            "Digital Personal Data Protection (DPDP) Act 2023",
            "Right to Education (RTE) / National Education Policy (NEP 2020)",
            "WCAG 2.2 Level AA Accessibility"
        ],
        "active_horizons": 5,
        "active_schemes_catalog": 48
    }

@router.post("/api/v1/system/seed")
def trigger_seed(db: Session = Depends(get_db)):
    """Seeds master universities, courses, scholarship schemes, and knowledge chunks into database."""
    result = seed_all_data(db)
    return {
        "status": "SUCCESS",
        "message": "Database successfully seeded with official MP higher education data.",
        "details": result
    }
