# PRODUCT_REQUIREMENTS.md: Product Requirements Document (PRD)
## Platform: VidyaSetu MP (विद्यासेतु)
**Target Ecosystem:** Rural & Tribal Higher Education in Madhya Pradesh  
**Document Version:** 2.0.0 (Master R&D Specification)  
**Classification:** Core System Architecture & Functional Requirements

---

## 1. Executive Context & Empirical Baseline

### 1.1 Ground Realities in Madhya Pradesh
1. **Telecom Reality (TRAI QE March 2026):** MP circle rural teledensity stands at **45.97%** (lowest in India). Rural internet subscriptions per 100 population stand at 38.4%. Peak daytime cellular bandwidth in tribal tehsils (Alirajpur, Jhabua, Barwani, Dindori, Mandla) fluctuates between **18 kbps and 45 kbps**, with packet loss exceeding 65%.
2. **Student Population (Dept. of Higher Education, MP):** Total collegiate enrollment in MP reached **12.10 lakh in 2024-25**, with **6,13,469 fresh admissions** processed via the state's centralized **e-Pravesh portal** for the 2026-27 academic session across 571 government colleges and 81 universities.
3. **Welfare Scale (MPTAAS / Tribal Welfare Dept):** Over **₹1,000 Crore** was disbursed in 2024-25 via the MPTAAS portal to ~5 lakh ST and SC students. Despite this, administrative friction causes an estimated 28% to 34% first-year undergraduate dropouts in rural areas due to documentation rejections and missed deadlines.
4. **Hardware Footprint:** Target users possess low-cost entry-level Android devices (Android 8.0 to Android 12 Go Edition), constrained by **2 GB RAM** and **32 GB flash storage** (with <2.5 GB free space available).

---

## 2. Product Objectives & Non-Negotiables

### 2.1 Non-Negotiables (Zero-Tolerance Architectural Constraints)
* **Zero-Byte Runtime Requirement:** The core learning player, local textbook search, and scholarship evaluation must function indefinitely at **0 kbps (Airplane Mode)**.
* **Low-Memory Footprint:** The application heap allocation must never exceed **85 MB RAM** (staying well within the 192 MB Android Go ceiling).
* **Package Size Quota:** A 45-minute higher education lecture package must never exceed **2.0 Megabytes** total file size.
* **Zero Hallucination Tolerance:** The AI tutor must never generate speculative or un-cited answers for academic or scholarship queries. If verified curriculum retrieval score is <0.72, generative output is locked.
* **Absolute Privacy Compliance:** No biometrics, raw Aadhaar numbers, or intrusive user tracking are permitted, adhering to the **Digital Personal Data Protection (DPDP) Act 2023**.

---

## 3. Detailed Functional Requirements (FR)

### FR-01: Offline Audio-Slide Micro-Pack (.vsmp) Player
* **FR-01.1:** The system shall decompress and execute `.vsmp` archives locally from device flash storage without requiring active network connectivity.
* **FR-01.2:** Audio shall be decoded using native Opus hardware decoding at 12–16 kbps mono speech bitrate.
* **FR-01.3:** Visual lecture slides shall be rendered via client-side vector graphics commands (JSON canvas paths) synchronized to millisecond audio timestamps via `sync_map.bin`.
* **FR-01.4:** The player shall provide synchronized Devanagari text transcript auto-scrolling with word-level click-to-seek functionality.
* **FR-01.5:** The player shall embed offline diagnostic concept quizzes with instant grading and localized explanation hints.

### FR-02: Deterministic Offline Scholarship Engine
* **FR-02.1:** The system shall embed a local JSON-LD catalog of 48 active MP State and Central Government scholarship and welfare schemes (<180 KB footprint).
* **FR-02.2:** The engine shall execute deterministic eligibility evaluation against user profile attributes (domicile, district, social category, gender, family annual income, 12th percentage, course enrollment) in under 50 milliseconds at 0 kbps.
* **FR-02.3:** The engine shall generate an automated document audit checklist, validating Samagra ID format (9 digits), Digital Caste Certificate format (16 digits), and income certificate expiry dates.
* **FR-02.4:** The system shall flag name spelling discrepancies between Aadhaar and academic marksheets using Levenshtein string distance algorithm.

### FR-03: Asynchronous Outbox Sync Queue (CRDT-Based)
* **FR-03.1:** Any mutation generated offline (quiz attempts, doubt questions, scholarship drafts) shall be immediately persisted to local encrypted SQLite storage in a `sync_outbox` table.
* **FR-03.2:** The network monitor shall continuously probe connection quality. When a usable connection (>20 kbps) is verified for >3 seconds, the background sync daemon shall activate.
* **FR-03.3:** The sync daemon shall aggregate pending mutations into a single payload, compress it using Brotli compression, and transmit via `POST /api/v1/sync/push` with a unique `X-Idempotency-Key`.
* **FR-03.4:** State reconciliation shall use State-based Conflict-Free Replicated Data Types (CRDTs) with Last-Write-Wins (LWW) vector clocks for academic progress and append-only event logs for doubt tickets.

### FR-04: Curriculum-Bounded Hybrid RAG Doubt Resolver
* **FR-04.1:** The backend RAG engine shall index only verified state curriculum textbooks (MP Hindi Granth Academy) and state university syllabi (Barkatullah, DAVV, RDVV, IGNTU).
* **FR-04.2:** Retrieval shall combine dense semantic vector search (BGE-M3 1024-dimensional embeddings) and sparse lexical search (BM25) fused via Reciprocal Rank Fusion (RRF).
* **FR-04.3:** If top-1 retrieved similarity score is <0.72, the system shall lock the generative LLM, display the closest textbook excerpt verbatim, and trigger an escalation ticket to a human mentor.
* **FR-04.4:** Generated answers shall display exact source citations (Textbook title, chapter number, page number).

### FR-05: Vernacular Voice & Dialect Normalization
* **FR-05.1:** Spoken queries shall be transcribed via the Bhashini Indic Speech ULCA pipeline (`dhruva-api.bhashini.gov.in`).
* **FR-05.2:** The system shall normalize dialect phonological variations (Nimadi, Malvi, Bundeli, Bagheli, Bhili, Gondi) to canonical academic Hindi before vector indexing.
* **FR-05.3:** For 0 kbps offline operation, the client shall embed a pre-compiled TFLite acoustic model (<4 MB) recognizing the top 120 educational navigational commands.

### FR-06: Hyperlocal Career Decision Pathways
* **FR-06.1:** The system shall provide structured offline decision trees mapping B.A., B.Sc., and B.Com degrees to regional employment opportunities (MP ESB Vyapam exams, Bank Business Correspondents, TRIFED Van Dhan processing).
* **FR-06.2:** Each pathway shall provide timeline-to-earning estimates, required certifications (e.g., IIBF BC), and daily 15-minute bite-sized audio preparation schedules.

### FR-07: Tiered Human Mentorship Escalation
* **FR-07.1:** Unresolved academic or administrative queries shall escalate through a 4-tier hierarchy: Tier 0 (Offline Cached Index) -> Tier 1 (Cloud RAG) -> Tier 2 (Peer Senior Student) -> Tier 3 (Govt Degree College Faculty).
* **FR-07.2:** Peer and faculty communications shall occur via asynchronous encrypted audio-note relays with virtualized alias identifiers.
* **FR-07.3:** All audio notes shall be screened asynchronously for toxicity and policy violations via Bhashini ASR and regex filtering prior to recipient delivery.

---

## 4. Non-Functional Requirements (NFR)

| Metric | Target Specification | Measurement Method |
| :--- | :--- | :--- |
| **Max Initial APK Download** | ≤ 14.5 MB | Release APK build artifact analysis |
| **Max Working RAM Allocation** | ≤ 85 MB | Android Profiler on Android 10 Go device |
| **Lecture Package (.vsmp) Size** | ≤ 2.0 MB per 45-minute lecture | Binary archive file size on disk |
| **Offline App Launch Time** | ≤ 400 milliseconds | Cold start bench on MediaTek Helio A22 |
| **Sync Burst Payload Size** | ≤ 2.5 KB (Compressed Brotli) | Wireshark network packet inspection |
| **Network Resilience Threshold** | Functional at 20 kbps with 50% packet drop | Linux `tc netem` simulated channel testing |
| **Storage Sandbox Quota** | Strictly capped at 1.5 GB | Android storage isolation manager |
| **Accessibility Compliance** | WCAG 2.2 Level AA compliant | Google TalkBack & axe-core automated audit |

---

## 5. Security, Privacy & Compliance Requirements

* **Statutory Compliance:** Full adherence to the **Digital Personal Data Protection (DPDP) Act 2023**.
* **Minor Protection (Section 9 DPDP):** Zero tracking, behavioral profiling, or advertising telemetry for users under 18 years of age.
* **Data Sanitization:** Strict prohibition of raw Aadhaar numbers or biometric storage. Only hashed phone numbers (`SHA-256`) and Samagra Member IDs are persisted.
* **Cryptographic Standards:** All SQLite databases on edge devices encrypted via SQLCipher (AES-256). All network transit enforced via TLS 1.3 with certificate pinning.
* **External URL Sandboxing:** The client strictly whitelist-restricts outbound browser launches to official domains (`*.gov.in`, `*.nic.in`, `*.ac.in`). All other links are blocked.
