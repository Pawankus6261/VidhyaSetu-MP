# API_DOCUMENTATION.md: RESTful Edge-Cloud API Specification

---

## 1. Design Philosophy for Low-Bandwidth Networks

All API endpoints are engineered specifically to operate reliably over **unstable 2G/3G connections (<40 kbps)**:
1. **Brotli & Gzip Compression:** Compresses all payloads; JSON payloads average <1.5 KB.
2. **Idempotency Keys (`X-Idempotency-Key`):** Prevents duplicate mutations when connections drop before receiving ACKs.
3. **HTTP Range-Header Support:** Enables byte-level resumable downloads of `.vsmp` course packages.
4. **JWT Session Tokens:** Lightweight stateless authentication headers.

---

## 2. Core Endpoints

### 2.1 Synchronization Endpoint: Outbox Drain & Delta Fetch
* **Route:** `POST /api/v1/sync/push`
* **Description:** Atomically uploads a batch of queued client mutations (quizzes, doubt tickets, profile edits) and returns un-synced server deltas in a single round-trip.
* **Headers:**
  * `Authorization: Bearer <JWT>`
  * `Content-Encoding: br` (Client compresses request with Brotli)
  * `X-Idempotency-Key: <SHA256_HASH_OF_PAYLOAD>`
* **Sample Request (Decompressed JSON):**
```json
{
  "client_device_id": "a98f12c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
  "client_last_sync_timestamp": 1790620200,
  "mutations": [
    {
      "mutation_id": "550e8400-e29b-41d4-a716-446655440000",
      "entity_type": "learning_progress",
      "entity_id": "LESSON_HIS_BA1_MOD2",
      "operation": "UPSERT",
      "payload": {
        "completed_seconds": 1840,
        "is_completed": 1,
        "quiz_score": 90
      },
      "timestamp": 1790620350
    },
    {
      "mutation_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "entity_type": "doubt_ticket",
      "entity_id": "DOUBT_TEMP_0091",
      "operation": "INSERT",
      "payload": {
        "query_text": "हड़प्पा सभ्यता के पतन के मुख्य कारण क्या थे?",
        "subject_code": "HISTORY_101",
        "audio_base64_opus": null
      },
      "timestamp": 1790620400
    }
  ]
}
```

* **Sample Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "server_sync_timestamp": 1790620850,
  "acknowledged_mutation_ids": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
  ],
  "server_deltas": [
    {
      "entity_type": "doubt_ticket",
      "entity_id": "DOUBT_TEMP_0091",
      "operation": "RESOLVE",
      "payload": {
        "server_ticket_id": "DBT-2026-MP-98214",
        "answer_text": "हड़प्पा सभ्यता के पतन के प्रमुख कारण: १. जलवायु परिवर्तन एवं सूखा, २. घग्गर-हाकरा नदी मार्ग परिवर्तन, ३. प्राकृतिक बाढ़, और ४. व्यापार तंत्र का पतन (स्रोतः म.प्र. हिंदी ग्रंथ अकादमी, पृष्ठ ४२)।",
        "confidence": 0.94,
        "sources": ["MP_HINDI_GRANTH_ACADEMY_VOL1"]
      }
    }
  ]
}
```

---

### 2.2 Content Download Endpoint: Resumable Micro-Pack
* **Route:** `GET /api/v1/content/pack/{pack_id}`
* **Description:** Streams binary `.vsmp` package archive supporting HTTP range headers.
* **Headers:**
  * `Range: bytes=655360-` (Optional: For resume)
* **Response:**
  * `Status 200 OK` (Full download) or `206 Partial Content` (Resumed download)
  * `Content-Type: application/vnd.vidyasetu.pack+zip`
  * `Content-Length: 1189840`
  * `Content-Range: bytes 655360-1845199/1845200`
  * `ETag: "sha256-4b92c4..."`

---

### 2.3 Cloud RAG Doubt Resolution (Standalone)
* **Route:** `POST /api/v1/doubts/resolve`
* **Description:** Asynchronously processes an academic query via BGE-M3 vector retrieval and quantized Llama-3.1 inference.
* **Request:**
```json
{
  "query_text": "मौर्य साम्राज्य के प्रशासन में समाहर्ता की क्या भूमिका थी?",
  "subject_code": "HISTORY_101",
  "university_code": "DAVV_INDORE",
  "language_hint": "hi"
}
```
* **Response (200 OK):**
```json
{
  "ticket_id": "TKT-8921-2026",
  "query_normalized": "मौर्य प्रशासन में समाहर्ता का क्या कार्य था?",
  "answer_text": "मौर्य काल में 'समाहर्ता' सर्वोच्च राजस्व अधिकारी होता था। इसका मुख्य कार्य संपूर्ण साम्राज्य से राजस्व और कर एकत्र करना तथा आय-व्यय का वार्षिक बजट तैयार करना था। (स्रोतः मध्य प्रदेश हिंदी ग्रंथ अकादमी, मौर्य एवं गुप्त काल, पृष्ठ 88)।",
  "confidence_score": 0.96,
  "status": "RESOLVED_GROUNDED",
  "escalated_to_mentor": false
}
```
