# SYSTEM_ARCHITECTURE.md: End-to-End System Architecture & Data Flows

---

## 1. High-Level C4 System Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          VIDYASETU MP SYSTEM CONTEXT                        │
└─────────────────────────────────────────────────────────────────────────────┘

       Rural Student in MP                 Govt Degree College Faculty
     (2G / 0 kbps Android Phone)              (College Web Portal)
                 │                                      │
                 ▼                                      ▼
       ┌───────────────────┐                  ┌───────────────────┐
       │   VidyaSetu MP    │                  │  VidyaSetu Admin  │
       │ Android Client App│                  │  & Faculty Portal │
       └─────────┬─────────┘                  └─────────┬─────────┘
                 │                                      │
                 │ (Atomic Encrypted Sync               │ (HTTPS/REST)
                 │  over 40 kbps Burst)                 │
                 ▼                                      ▼
       ┌──────────────────────────────────────────────────────────┐
       │               FastAPI Cloud Gateway Tier                 │
       │       - Rate Limiting, Brotli Decompression, Auth        │
       └────────────────────────────┬─────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│  Core Sync &  │           │ Hybrid RAG &  │           │ Content Pack  │
│  State Engine │           │ AI Doubt Svc  │           │ Delivery CDN  │
└───────┬───────┘           └───────┬───────┘           └───────┬───────┘
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│ PostgreSQL 16 │           │ Qdrant Vector │           │ MinIO / S3    │
│  (ACID State) │           │ (BGE-M3 Embed)│           │ (.vsmp Packs) │
└───────────────┘           └───────────────┘           └───────────────┘
```

---

## 2. Component Architecture: Client-Side (Android Go)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATION LAYER (REACT NATIVE)                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                [User UI Views]
   - Home Dashboard    - Audio-Slide Player    - Scholarship Audit   - Doubt Outbox
                                       │
                                       ▼
                     [WatermelonDB Reactive Model Layer]
                                       │
                                       ▼
                     [Local Embedded SQLite Database (Encrypted)]
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
 [Offline Content Engine]      [Sync Outbox Queue]       [Deterministic Rule]
  - .vsmp ZIP extractor         - Mutation journaler      - 48 MP Welfare Schemas
  - Opus Audio stream           - SHA-256 idempotency     - Instant Local Audit
  - Vector SVG path runner      - Backoff scheduler
        │                              │                              │
        └──────────────────────────────┼──────────────────────────────┘
                                       ▼
                           [Network Quality Prober]
                            (0 kbps vs. 30 kbps vs. 4G)
                                       │
                                       ▼
                         [Brotli Payload Transmitter]
```

---

## 3. Detailed Data Flows

### 3.1 Flow A: 0 kbps Airplane Mode Study & Doubt Submission
1. Student selects a downloaded lecture: *"प्राचीन भारत का इतिहास - हड़प्पा सभ्यता"*.
2. The **Offline Content Engine** opens the local `.vsmp` package from device storage (`/data/user/0/org.vidyasetu.app/files/packs/`).
3. Audio stream plays from `audio.opus` via low-overhead native hardware decoder (Opus codec @ 14 kbps).
4. Synchronized vector commands are drawn directly to the Skia Canvas (`slides.json`), illustrating the layout of the Great Bath and street grids.
5. The student taps the microphone icon and asks: *"हड़प्पा में कांस्य की नर्तकी की मूर्ति कहाँ मिली थी?"* (Where was the dancing bronze girl statue found in Harappa?).
6. Network prober detects **0 kbps (Airplane Mode)**.
7. The query is serialized into a JSON mutation record:
   ```json
   {
     "mutation_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
     "entity_type": "doubt_ticket",
     "query": "हड़प्पा में कांस्य की नर्तकी की मूर्ति कहाँ मिली थी?",
     "status": "QUEUED_OFFLINE",
     "created_at": 1790620350
   }
   ```
8. The mutation is saved into the local SQLite `sync_outbox` table.
9. UI displays optimistic confirmation: **"उत्तर आउटबॉक्स में सुरक्षित है। नेटवर्क मिलते ही सत्यापन होगा।"**

### 3.2 Flow B: Reconnection & Asynchronous Cloud RAG Resolution
1. Student moves to a village location with a cell signal; network prober detects **32 kbps cellular connection**.
2. The background `SyncManager` is notified via `WorkManager`.
3. The sync manager aggregates all pending mutations into a single payload, compresses it via Brotli to **1.4 KB**, and issues a POST to `/api/v1/sync/push`.
4. The server gateway decompresses the payload and routes the doubt to the **Hybrid RAG Service**.
5. The RAG service embeds the query via `BAAI/bge-m3` and performs a cosine similarity lookup against approved MP Hindi Granth Academy textbook chunks stored in Qdrant.
6. A match is found with **0.93 similarity**: *"मोहनजोदड़ो से 10.5 सेमी ऊंची कांस्य की नर्तकी की प्रसिद्ध मूर्ति प्राप्त हुई (अध्याय 4, पृष्ठ 52)"*.
7. The server generates a verified answer with an exact citation and stores it in PostgreSQL.
8. The sync response returns the resolved ticket delta to the client.
9. The mobile device receives the delta, writes the answer to local SQLite, and triggers a local push notification: *"आपके सवाल का उत्तर उपलब्ध है!"* (Answer available for your question!).

---

## 4. Hardware Resource Budget (Low-End Android Device)

To ensure smooth execution on an Itel A60s or Redmi 9A (2GB RAM, Android Go):
* **Max APK Installation Size:** 14.5 MB.
* **Max Active RAM Working Set:** 85 MB (Well below the 192 MB Android Go low-memory limit).
* **Storage Quota:** Sandboxed cache strictly capped at 1.5 GB. Uses Least-Recently-Used (LRU) automatic pruning of completed course units.
* **CPU Consumption During Audio-Slide Playback:** Under 8% CPU utilization on an 8-core ARM Cortex-A53 processor.
