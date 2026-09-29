# VidyaSetu MP (विद्यासेतु) — Application Configuration
import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "info"
    SECRET_KEY: str = "vidyasetu_mp_super_secure_jwt_secret_key_2026_dev"
    API_PORT: int = 8000
    API_HOST: str = "0.0.0.0"

    # Database Configuration (PostgreSQL 16 with pgvector)
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "vidyasetu_mp"
    POSTGRES_USER: str = "vidyasetu"
    POSTGRES_PASSWORD: str = "vidyasetu_secure_password_2026"
    
    # SQLite local fallback database path
    SQLITE_DB_PATH: str = str(BASE_DIR / "vidyasetu_mp.db")

    # Vector Database (Qdrant)
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_COLLECTION: str = "mp_curriculum_knowledge"

    # Redis Caching & Queue
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # Object Storage (MinIO / S3)
    STORAGE_ENDPOINT: str = "http://localhost:9000"
    STORAGE_ACCESS_KEY: str = "vidyasetu_admin"
    STORAGE_SECRET_KEY: str = "vidyasetu_storage_password_2026"
    STORAGE_BUCKET_NAME: str = "vidyasetu-packs"
    
    # Local Storage Directory for .vsmp packs & voice doubts
    LOCAL_STORAGE_DIR: str = str(BASE_DIR / "storage")

    # Indic AI Speech Services (Bhashini ULCA)
    BHASHINI_USER_ID: str = "sample_bhashini_user_id"
    BHASHINI_API_KEY: str = "sample_bhashini_api_key"
    BHASHINI_PIPELINE_ENDPOINT: str = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"

    # Curriculum RAG Confidence Threshold (Mathematical Confidence Lock)
    CONFIDENCE_LOCK_THRESHOLD: float = 0.72

    model_config = SettingsConfigDict(
        env_file=str(PROJECT_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# Ensure local storage directory exists
os.makedirs(settings.LOCAL_STORAGE_DIR, exist_ok=True)
os.makedirs(os.path.join(settings.LOCAL_STORAGE_DIR, "packs"), exist_ok=True)
os.makedirs(os.path.join(settings.LOCAL_STORAGE_DIR, "voice_notes"), exist_ok=True)
