# DECISION_LOG.md: Architecture Decision Records (ADRs)

---

## ADR-001: Offline-First SQLite Local Store vs. Online-First REST Caching
* **Status:** Accepted.
* **Context:** Rural MP experiences prolonged network outages (0 kbps for hours or days).
* **Decision:** Implement **WatermelonDB + SQLite** as the primary single source of truth on the client. The mobile app interacts exclusively with local tables. An asynchronous background sync engine coordinates with the cloud backend using CRDTs.
* **Consequences:** Significantly higher initial frontend engineering complexity, but provides 100% immune resilience to cellular connectivity loss.

---

## ADR-002: Audio-Slide Micro-Packs (.vsmp) vs. Video Compression (AV1/H.265)
* **Status:** Accepted.
* **Context:** Even cutting-edge AV1 240p video requires 40MB–50MB per lecture, which chokes 40 kbps pipes and exhausts daily mobile data limits.
* **Decision:** Decouple audio and visual streams completely. Encode high-fidelity speech in Opus (12–16 kbps) and render lecture visuals as vector canvas drawing commands (JSON/SVG) on the client.
* **Consequences:** Limits dynamic camera movement (professors' facial gestures), but reduces file size to **1.8 MB** (a 98% reduction), enabling full-length higher education learning on 2G connections.

---

## ADR-003: Deterministic Rule Engine vs. LLM for Scholarship Discovery
* **Status:** Accepted.
* **Context:** Generating scholarship eligibility via LLMs causes hallucinations, inventing nonexistent application dates, dead URLs, and inaccurate income ceilings.
* **Decision:** Build a deterministic, rule-based decision tree engine executing locally on the device using structured JSON-LD schemas.
* **Consequences:** Requires manual curation and verification of government scholarship gazettes, but guarantees 100% factual accuracy and zero hallucinations for life-changing financial aid.

---

## ADR-004: Hybrid Edge-Cloud Curriculum RAG vs. Direct Commercial LLM APIs
* **Status:** Accepted.
* **Context:** Commercial LLMs (OpenAI, Anthropic) are cloud-dependent, cost-prohibitive at scale, and hallucinate details about specific state university syllabi.
* **Decision:** Host open-weights quantized models (Llama-3.1-8B-Instruct) augmented with BGE-M3 vector retrieval over verified MP Hindi Granth Academy textbooks, with a strict confidence cutoff (<0.72) triggering fallback to human mentors.
* **Consequences:** Requires GPU server hosting management, but provides verifiable academic citations, zero external API billing, and complete student privacy.

---

## ADR-005: Bhashini Indic Speech API vs. Commercial Speech-to-Text Engines
* **Status:** Accepted.
* **Context:** Google Cloud Speech and AWS Transcribe have poor accuracy on rural Hindi, Bundeli, and Central Indic dialects, and impose prohibitive per-minute commercial billing.
* **Decision:** Integrate **Bhashini (National Language Translation Mission, MeitY)** Indic ASR and Indic TTS APIs.
* **Consequences:** Requires government developer onboarding credentials and fallback handling for server latency, but offers unmatched acoustic training on Indian vernacular accents at zero API subscription fee.

---

## ADR-006: React Native Bare Workflow + WatermelonDB vs. Flutter
* **Status:** Accepted.
* **Context:** Budget smartphones running Android Go have strict 192 MB application heap limits and limited 32GB flash storage.
* **Decision:** Utilize React Native Bare Workflow with TurboModules paired with WatermelonDB (lazy-loaded SQLite).
* **Consequences:** Flutter's compiled binary adds ~22MB baseline APK size; React Native bare compiles down to **12.4 MB APK**, conserving device flash memory.

---

## ADR-007: Tiered Human Escalation Mesh vs. Fully Automated AI Tutoring
* **Status:** Accepted.
* **Context:** Rural students distrust impersonal bots for critical decisions (college transfers, career pathways, scholarship rejections).
* **Decision:** Implement a 3-tier escalation ladder: Tier 0 (Offline Cached Index) -> Tier 1 (Cloud RAG) -> Tier 2 (Peer Senior Student Bhaiya/Didi) -> Tier 3 (College Faculty Nodal Officer).
* **Consequences:** Involves operational coordination with college principals, but fosters community trust and high retention.

---

## ADR-008: Brotli Chunked Mutation Batching vs. WebSockets
* **Status:** Accepted.
* **Context:** WebSockets maintain long-lived TCP connections that fail continuously in moving buses and rural fringe zones.
* **Decision:** Use short-lived, idempotent, Brotli-compressed HTTP POST bursts over standard TLS 1.3.
* **Consequences:** No real-time typing indicators, but ensures 100% transaction delivery without persistent socket reconnection loops.
