# VidyaSetu MP — Asynchronous CRDT Sync Audit Journal
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, BigInteger, DateTime
from backend.database import Base

class SyncJournal(Base):
    __tablename__ = "sync_journal"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True, index=True)
    device_id = Column(String(64), nullable=False, index=True)
    idempotency_hash = Column(String(64), unique=True, nullable=False, index=True)
    mutations_count = Column(Integer, nullable=False)
    compressed_bytes_received = Column(Integer, nullable=False)
    processing_time_ms = Column(Integer, nullable=False)
    client_timestamp = Column(BigInteger, nullable=False)
    server_sync_timestamp = Column(BigInteger, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
