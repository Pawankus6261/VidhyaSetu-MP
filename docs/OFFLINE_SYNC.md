# VidyaSetu MP (विद्यासेतु) — Offline-First Synchronization Protocol

## 1. Core Synchronization Architecture

VidyaSetu MP operates on the principle that **the network is an intermittent synchronization bus, not a runtime dependency**. Core educational, scholarship, and search capabilities function at **0 kbps** (Airplane Mode).

```text
[Student Action: e.g. Record Doubt / Complete Quiz]
               ↓
    [Local Validation & Storage]
               ↓
[Enqueue in Outbox: status = PENDING]
               ↓
     [Network Monitor Check]
    ├── 0 kbps (Airplane / No 2G) ──→ Hold safely in outbox journal
    └── Online / 2G Signal Burst
               ↓
[Build Batch Payload with Client UUIDs]
               ↓
[Attach X-Idempotency-Key Header]
               ↓
[POST /api/v1/sync/push]
               ↓
   Server Response:
   ├── acknowledged_mutation_ids: [...] ──→ Mark local records SYNCED
   └── server_deltas: [...] ──────────────→ Apply updates to local DB
```

---

## 2. API Contract Specification

### Endpoint: `POST /api/v1/sync/push`

**Headers:**
* `Authorization: Bearer <JWT>`
* `Content-Type: application/json`
* `Content-Encoding: br | gzip` (Optional for ultra-compressed payloads)
* `X-Idempotency-Key: SYNC_BATCH_<timestamp>_<count>`

**Request Body Schema:**
```json
{
  "client_device_id": "rural_student_device_mp",
  "client_last_sync_timestamp": 1790698112,
  "mutations": [
    {
      "mutation_id": "MUT_1790698973355_yfxu9",
      "entity_type": "learning_progress",
      "entity_id": "HIS_BA1_MOD1_INDUS_VALLEY",
      "operation": "UPSERT",
      "payload": {
        "lesson_id": "HIS_BA1_MOD1_INDUS_VALLEY",
        "course_id": "COURSE_HIS_BA1",
        "quiz_score": 100,
        "completed_seconds": 165,
        "is_completed": true
      },
      "timestamp": 1790698973
    }
  ]
}
```

**Response Body Schema:**
```json
{
  "status": "SUCCESS",
  "server_sync_timestamp": 1790698974,
  "acknowledged_mutation_ids": [
    "MUT_1790698973355_yfxu9"
  ],
  "server_deltas": []
}
```

---

## 3. Resilience & Failure Recovery

1. **Partial Network Drop:** If a request aborts midway, the mutations remain `PENDING`. Upon next signal detection, the same `mutation_id` is re-sent.
2. **Idempotency Deduplication:** The backend tracks acknowledged mutation IDs in the `sync_journal` table. Duplicate mutation IDs are acknowledged immediately without duplicate writes.
3. **Low-Bandwidth Compression:** The backend supports Brotli (`br`) and Gzip payloads, compressing batch payloads under 1.5 KB to succeed during fleeting 2G signal bursts in rural valleys.
