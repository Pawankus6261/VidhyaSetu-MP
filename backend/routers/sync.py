# VidyaSetu MP — Asynchronous Outbox Drain & Synchronization Router
import json
import gzip
import brotli
import logging
from typing import Optional
from fastapi import APIRouter, Depends, Request, Header, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas.sync import SyncPushRequest, SyncPushResponse
from backend.services.sync_service import SyncService

logger = logging.getLogger("vidyasetu.sync_router")

router = APIRouter(prefix="/api/v1/sync", tags=["Synchronization (Edge-Cloud)"])

@router.post("/push", response_model=SyncPushResponse)
async def sync_push(
    request: Request,
    content_encoding: Optional[str] = Header(None),
    x_idempotency_key: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Atomically drains a batch of queued client mutations (quizzes, doubt tickets, profile edits)
    and returns un-synced server deltas in a single round-trip over 40 kbps bursts.
    Supports Brotli ('br') and Gzip decompression.
    """
    raw_body = await request.body()
    compressed_bytes_count = len(raw_body)

    # 1. Decompress request payload if client sent compressed data over low bandwidth
    decompressed_data = raw_body
    if content_encoding == "br":
        try:
            decompressed_data = brotli.decompress(raw_body)
        except Exception as e:
            logger.warning(f"Brotli decompression error: {e}")
    elif content_encoding == "gzip":
        try:
            decompressed_data = gzip.decompress(raw_body)
        except Exception as e:
            logger.warning(f"Gzip decompression error: {e}")

    try:
        json_payload = json.loads(decompressed_data.decode("utf-8"))
        sync_req = SyncPushRequest(**json_payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid sync payload: {str(e)}")

    # 2. Process batch mutations atomically and return deltas
    response = SyncService.process_sync_batch(
        request=sync_req,
        db=db,
        compressed_bytes=compressed_bytes_count,
        idempotency_key=x_idempotency_key
    )

    return response

@router.get("/pull", response_model=SyncPushResponse)
def sync_pull(
    client_device_id: str,
    since_timestamp: Optional[int] = 0,
    db: Session = Depends(get_db)
):
    """Fetches any pending server deltas since client's last synchronization timestamp."""
    sync_req = SyncPushRequest(
        client_device_id=client_device_id,
        client_last_sync_timestamp=since_timestamp or 0,
        mutations=[]
    )
    return SyncService.process_sync_batch(request=sync_req, db=db)
