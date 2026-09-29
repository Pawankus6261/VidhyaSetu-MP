# VidyaSetu MP — Asynchronous Outbox Sync Schemas
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class MutationItem(BaseModel):
    mutation_id: str = Field(..., description="Client-generated UUIDv4 for idempotency")
    entity_type: str = Field(..., description="learning_progress | doubt_ticket | user_profile | scholarship_audit")
    entity_id: str
    operation: str = Field(..., description="UPSERT | INSERT | DELETE")
    payload: Dict[str, Any]
    timestamp: int

class SyncPushRequest(BaseModel):
    client_device_id: str
    client_last_sync_timestamp: int
    mutations: List[MutationItem] = []

class ServerDeltaItem(BaseModel):
    entity_type: str
    entity_id: str
    operation: str
    payload: Dict[str, Any]

class SyncPushResponse(BaseModel):
    status: str = "SUCCESS"
    server_sync_timestamp: int
    acknowledged_mutation_ids: List[str]
    server_deltas: List[ServerDeltaItem] = []
