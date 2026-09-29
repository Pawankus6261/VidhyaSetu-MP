# VidyaSetu MP (विद्यासेतु) — Data Ownership & Authority Model

This document establishes the authoritative data classification and ownership boundaries between the client device (`apps/mobile`) and the cloud gateway (`backend/`).

---

## 1. Classification Matrix

| Data Classification | Typical Entities | Primary Authority | Synchronization Strategy | Network Dependency |
|---|---|---|---|---|
| **Immutable / Static Content** | Course curricula, syllabi, `.vsmp` vector lectures, audio files, slide transcripts | **Cloud Authority** (Pre-packaged at release) | Cached locally on device storage via `DownloadManager`; verified by SHA-256 checksums | **0 kbps** (Zero runtime network requirement once cached) |
| **Frequently Changing Academic State** | Lesson completion timestamps, quiz scores, audio playback progress | **Local Authority until Synced** | Stored immediately in local state; pushed atomically via `SyncEngine` outbox | **0 kbps** (Instantaneous UI update, deferred background push) |
| **Server-Authoritative Regulatory Data** | 48 State/Central scholarship schemes, income caps, reservation criteria, caste certificate schemas | **Cloud Gateway** | Seeded in local bundle for offline estimation; reconciled against authoritative rules when online | **0 kbps for estimation**; online for final portal submission |
| **Student Outbox Queue (Store & Forward)** | Student doubt tickets, recorded microphone voice notes, mentor escalation requests | **Local Outbox until Acknowledged** | CRDT outbox journal; immutable local mutations with client-generated UUIDs | **0 kbps** (Never blocks student learning or question recording) |
| **Mentor & Faculty Resolutions** | Faculty text corrections, mentor audio notes, doubt status closures | **Cloud / Faculty Portal** | Pulled down via `GET /api/v1/sync/pull` or delivered via push delta | Online when available; retained locally once received |

---

## 2. Write-Path Safety Rules

1. **Local-First Precedence:** A user action (e.g. answering a quiz or asking a question) must **never** await an HTTP response to render on screen.
2. **Outbox Immutability:** An outbox mutation record (`MutationItem`) is **never deleted** on network error or timeout. It remains marked as `PENDING` until the server returns its `mutation_id` inside `acknowledged_mutation_ids`.
3. **Idempotency Guarantee:** Every mutation batch pushed to `POST /api/v1/sync/push` carries an `X-Idempotency-Key` header. If a 2G network drops midway, a subsequent retry will not create duplicate quiz submissions or doubt tickets.
4. **Privacy-Preserving User Identity:** Student demographic data adheres to DPDP Act 2023. No raw Aadhaar or unhashed identifiers are stored on the client or logged in gateway telemetry.
