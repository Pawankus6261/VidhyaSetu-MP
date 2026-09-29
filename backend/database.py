# VidyaSetu MP (विद्यासेतु) — Database Engine & Session Management
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.config import settings

logger = logging.getLogger("vidyasetu.db")

Base = declarative_base()

def get_engine():
    """
    Attempts to connect to PostgreSQL (pgvector).
    If unreachable, falls back gracefully to SQLite for standalone zero-dependency execution.
    """
    pg_url = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}"
    
    try:
        # Test postgres with quick timeout
        test_engine = create_engine(pg_url, connect_args={"connect_timeout": 2}, pool_pre_ping=True)
        with test_engine.connect() as conn:
            logger.info("Connected to PostgreSQL 16 (Cloud Central Database) successfully.")
        return test_engine, "postgresql"
    except Exception as e:
        logger.warning(
            f"PostgreSQL unreachable at {settings.POSTGRES_HOST}:{settings.POSTGRES_PORT} ({e}). "
            f"Falling back to local SQLite engine ({settings.SQLITE_DB_PATH}) for standalone operation."
        )
        sqlite_url = f"sqlite:///{settings.SQLITE_DB_PATH}"
        sqlite_engine = create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False},
            pool_pre_ping=True
        )
        return sqlite_engine, "sqlite"

engine, DB_ENGINE_TYPE = get_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI Dependency for database session injection with auto-cleanup."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Creates all defined models in the target database."""
    from backend import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    logger.info(f"Database schema initialized successfully using [{DB_ENGINE_TYPE}].")

# Auto-initialize tables
try:
    init_db()
except Exception as _e:
    logger.warning(f"Initial schema creation deferred: {_e}")

