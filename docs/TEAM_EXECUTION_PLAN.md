# TEAM_EXECUTION_PLAN.md: Four-Member Hackathon Battle Plan & Sprint Protocol
## Hackathon: Idea & Innovation Hackathon 2026 — Innovate for Madhya Pradesh. Build for Viksit Bharat.
**Platform:** VidyaSetu MP (विद्यासेतु)  
**Team Composition:** 4 Engineers / Product Specialists  
**Execution Window:** 36-to-48 Hour Hackathon Sprint

---

## 1. Team Role Allocation & Technical Ownership Matrix

To eliminate friction and merge conflicts during the hackathon, each member has **exclusive architectural ownership** of one core layer:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FOUR-MEMBER SPRINT OWNERSHIP MATRIX                   │
├──────────┬─────────────────────────────┬────────────────────────────────────┤
│ MEMBER   │ PRIMARY ROLE                │ CORE ARCHITECTURAL DELIVERABLES    │
├──────────┼─────────────────────────────┼────────────────────────────────────┤
│ MEMBER 1 │ Systems & Offline Architect │ • .vsmp Audio-Slide Micro-Pack Eng.│
│          │ (Technical Lead)            │ • Client SQLite / WatermelonDB     │
│          │                             │ • Cryptographic Outbox Sync Queue  │
│          │                             │ • 0 kbps Airplane Mode Validation  │
├──────────┼─────────────────────────────┼────────────────────────────────────┤
│ MEMBER 2 │ AI/ML & Speech Engineer     │ • Curriculum-Bounded Hybrid RAG    │
│          │ (Data Science Lead)         │ • BGE-M3 Embeddings + Qdrant       │
│          │                             │ • Confidence Locking (<0.72 Logic) │
│          │                             │ • Bhashini Indic Speech Gateway    │
├──────────┼─────────────────────────────┼────────────────────────────────────┤
│ MEMBER 3 │ Backend & Welfare Systems   │ • FastAPI Async REST API Endpoints │
│          │ Engineer (Data & Cloud)     │ • PostgreSQL 16 (pgvector) Schemas │
│          │                             │ • Deterministic MP Scholarship Eng.│
│          │                             │ • Docker Orchestration & MinIO S3  │
├──────────┼─────────────────────────────┼────────────────────────────────────┤
│ MEMBER 4 │ Product Strategist & Pitch  │ • Master Pitch Narrative (3–5 Min) │
│          │ Lead (Domain & UX Lead)     │ • MP Empirical Evidence Lead (TRAI)│
│          │                             │ • Demo Rehearsal & Timekeeper      │
│          │                             │ • Judge Q&A Cross-Examination Prep │
└──────────┴─────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Granular Responsibilities Per Member

### Member 1: Systems & Offline Architect (Technical Lead)
* **Pre-Hackathon Preparation:**
  * Review [docs/OFFLINE_ARCHITECTURE.md](OFFLINE_ARCHITECTURE.md) and [docs/LOW_BANDWIDTH_ENGINEERING.md](LOW_BANDWIDTH_ENGINEERING.md).
  * Setup local client runtime with SQLite and file system storage abstractions.
* **Sprint Deliverables:**
  1. Author the **`.vsmp` packaging and extraction script** (zipping Opus audio, `slides.json` vector commands, and Brotli text).
  2. Implement the **Local Outbox State Machine** in SQLite: saving un-synced user actions (quizzes, doubts, scholarship drafts) when in offline mode.
  3. Implement the **Network Monitor** listener that detects connectivity changes (0 kbps ↔ 30 kbps ↔ 4G) and triggers background sync.
* **Demo Day Role:** **Device Pilot & Live Operator**. Holds the physical demo phone, visibly toggles Airplane Mode ON/OFF, and executes the zero-network playback.

---

### Member 2: AI/ML & Speech Systems Engineer
* **Pre-Hackathon Preparation:**
  * Review [docs/AI_ARCHITECTURE.md](AI_ARCHITECTURE.md) and [docs/VOICE_ARCHITECTURE.md](VOICE_ARCHITECTURE.md).
  * Test Bhashini ULCA API credentials (`dhruva-api.bhashini.gov.in`) and setup local Qdrant/pgvector container.
* **Sprint Deliverables:**
  1. Build the **Hybrid RAG Retrieval Pipeline**: Ingest sample chapters from the MP Hindi Granth Academy textbook corpus, chunk by section, and generate 1024-dim dense vectors using `BAAI/bge-m3`.
  2. Implement **Mathematical Confidence Locking**: If retrieval cosine similarity score is <0.72, lock generative LLM output and return the exact textbook excerpt with mentor escalation flag.
  3. Implement the **Bhashini Speech-to-Text Gateway**: Convert 16 kHz audio notes into normalized Hindi text with dialect regex rules.
* **Demo Day Role:** **AI Defense & Hallucination Specialist**. Answers judges on accuracy, refusal criteria, vector embeddings, and Indic speech models.

---

### Member 3: Backend & Welfare Systems Engineer
* **Pre-Hackathon Preparation:**
  * Review [docs/DATABASE_SCHEMA.md](DATABASE_SCHEMA.md), [docs/API_DOCUMENTATION.md](API_DOCUMENTATION.md), and [docs/SCHOLARSHIP_ENGINE.md](SCHOLARSHIP_ENGINE.md).
  * Run `docker-compose up -d` to verify Postgres, Redis, and MinIO services.
* **Sprint Deliverables:**
  1. Implement **FastAPI Endpoints**:
     * `POST /api/v1/sync/push` (Atomic Brotli-decompressed outbox drain).
     * `GET /api/v1/content/pack/{id}` (Byte-range resumable streaming).
     * `POST /api/v1/doubts/resolve` (RAG query dispatch).
  2. Finalize the **Deterministic Offline Scholarship Rule Engine**: Ensure [data/scholarships/mp_scholarships.json](../data/scholarships/mp_scholarships.json) evaluates MPTAAS, Sambal 2.0, Gaon Ki Beti, and MMVY instantly without network.
  3. Setup **Unit Economics Telemetry**: Benchmark memory and query latency to prove the ₹23.40/student/year cost model.
* **Demo Day Role:** **Backend, Security & Infrastructure Specialist**. Defends DPDP compliance, PostgreSQL schemas, and scalability during judge cross-examination.

---

### Member 4: Product Strategist & Pitch Lead (Domain & UX Lead)
* **Pre-Hackathon Preparation:**
  * Review [docs/DEMO_SCRIPT.md](DEMO_SCRIPT.md), [docs/JUDGE_QA.md](JUDGE_QA.md), [docs/RESEARCH.md](RESEARCH.md), and [docs/MP_OPPORTUNITY_MAP.md](MP_OPPORTUNITY_MAP.md).
  * Master the ground statistics: 45.97% TRAI teledensity, 15.31M tribal population, 6.13 lakh e-Pravesh admissions, ₹1,000+ Crore MPTAAS disbursement.
* **Sprint Deliverables:**
  1. Own the **Master Pitch Presentation Deck** (maximum 8–10 high-impact visual slides; zero text walls).
  2. Direct the **Demo Script & Stage Choreography**: Ensure Member 1's device screen mirroring aligns millisecond-perfect with the verbal script.
  3. Rehearse the **Strict 3–5 Minute Timer**: Run at least 6 dry runs to ensure the pitch finishes cleanly under the hard hackathon time limit.
  4. Curate the **Evidence Dossier**: Keep printouts/tabs of TRAI reports and MPTAAS circulars ready to counter skeptical judges.
* **Demo Day Role:** **Lead Pitcher & Storyteller**. Delivers the opening hook, explains user pain points, articulates the Viksit Bharat vision, and manages judge Q&A triage.

---

## 3. Hour-by-Hour 36-Hour Hackathon Execution Sprint

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    36-HOUR HACKATHON TIMELINE & MILESTONES                  │
├─────────┬───────────────────────────────┬───────────────────────────────────┤
│ HOURS   │ PRIMARY FOCUS                 │ TEAM COORDINATION CHECKPOINT      │
├─────────┼───────────────────────────────┼───────────────────────────────────┤
│ 00 – 04 │ Architecture Alignment &      │ All: Finalize API contracts & data│
│         │ Environment Spin-up           │ schemas. Docker containers running│
├─────────┼───────────────────────────────┼───────────────────────────────────┤
│ 04 – 12 │ Core Subsystem Build          │ M1: SQLite outbox engine.         │
│         │ (Parallel Isolation)          │ M2: Qdrant ingest & Bhashini hook.│
│         │                               │ M3: FastAPI sync & scholarship eng│
│         │                               │ M4: Pitch narrative & slide wirefr│
├─────────┼───────────────────────────────┼───────────────────────────────────┤
│ 12 – 16 │ FIRST INTEGRATION CHECKPOINT  │ MILESTONE 1: Outbox drains into   │
│         │ (The Core Loop)               │ FastAPI and receives RAG response.│
├─────────┼───────────────────────────────┼───────────────────────────────────┤
│ 16 – 24 │ Feature Polish & Edge Cases   │ M1: Offline 0 kbps player test.   │
│         │                               │ M2: Confidence locking tuning.    │
│         │                               │ M3: Resumable chunking & Brotli.  │
│         │                               │ M4: Slide deck draft complete.    │
├─────────┼───────────────────────────────┼───────────────────────────────────┤
│ 24 – 28 │ SECOND INTEGRATION CHECKPOINT │ MILESTONE 2: Full Airplane Mode   │
│         │ (End-to-End User Arc)         │ study -> doubt -> reconnect test. │
├─────────┼───────────────────────────────┼───────────────────────────────────┤
│ 28 – 32 │ Dry Runs & Rehearsals         │ Minimum 4 timed dry runs (M4 lead,│
│         │                               │ M1 pilot, M2 & M3 critique).      │
├─────────┼───────────────────────────────┼───────────────────────────────────┤
│ 32 – 36 │ Final Polish & Submission     │ Freeze code, verify backups, print│
│         │                               │ judge evidence sheets.            │
└─────────┴───────────────────────────────┴───────────────────────────────────┘
```

---

## 4. Stage Choreography & Presentation Protocol (3–5 Minutes)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STAGE POSITIONING & SCRIPT FLOW                     │
└─────────────────────────────────────────────────────────────────────────────┘

    [Projector Screen: Mirrored Physical Phone / Architecture Slide]
                               ▲
                               │
       ┌───────────────┬───────┴───────┬───────────────┐
       ▼               ▼               ▼               ▼
   MEMBER 4        MEMBER 1        MEMBER 2        MEMBER 3
  (Pitch Lead)    (Device Pilot)   (AI/Speech)    (Backend/Data)
  Center Stage    Holding Phone   Stage Right     Stage Left
  Speaks: Min 0-1 Operates Demo   Speaks: Q&A     Speaks: Q&A
  Speaks: Min 4-5 Live On-Screen
```

### Minute-by-Minute Stage Coordination:
1. **Minute 0:00 – 0:45 (The Hook):** Member 4 commands the stage, holding up a budget smartphone. Quotes TRAI's 45.97% MP rural teledensity and the 12.10 lakh enrollment reality.
2. **Minute 0:45 – 2:00 (The Airplane Mode Proof):** Member 4 introduces Member 1. Member 1 visibly swipes down notifications on the physical device: **AIRPLANE MODE ON**. Member 1 launches the app, plays the 1.8MB Indus Valley lecture at 0 kbps with synchronized vector drawings.
3. **Minute 2:00 – 3:15 (Scholarship & Offline Doubt):** Member 1 executes the offline scholarship audit (matching MPTAAS + Gaon Ki Beti instantly) and asks a voice doubt in Hindi. App queues it in the outbox.
4. **Minute 3:15 – 4:00 (The Reconnect & RAG Sync):** Member 1 turns **Airplane Mode OFF**. Status pill turns green. In 1.2 seconds, the sync engine drains the outbox and renders the verified textbook citation from the MP Hindi Granth Academy.
5. **Minute 4:00 – 4:45 (Unit Economics & Vision):** Member 4 closes with the financial model (₹23.40/student/year) and alignment with NEP 2020 and Viksit Bharat 2047.

---

## 5. Judge Q&A Triage Rules

Never speak over each other during Judge Q&A. Use this strict triage assignment:

* **If Judge asks about Network / Offline / Video vs Audio:**  
  👉 **Member 1 answers** (Cites Mathis formula, Opus 14 kbps, 1.8MB .vsmp format, and CRDT outbox).
* **If Judge asks about AI Hallucination / RAG / Bhashini / Dialects:**  
  👉 **Member 2 answers** (Cites BGE-M3 embeddings, 0.72 confidence locking threshold, and dialect phonological regex).
* **If Judge asks about Scholarships / Backend / Security / DPDP Act:**  
  👉 **Member 3 answers** (Cites MPTAAS gazettes, Sambal 2.0 fee rules, SHA-256 phone hashing, and PostgreSQL schemas).
* **If Judge asks about Adoption / Why not YouTube / Business Model / Scale:**  
  👉 **Member 4 answers** (Cites TRAI teledensity, e-Pravesh enrollment, DMF trust funds, and college pilot partnerships).

---

## 6. Pre-Submission Emergency Checklist

- [ ] Physical demo device is fully charged (100% battery) and screen timeout set to **Never / 10 Minutes**.
- [ ] Pre-recorded offline video backup of the exact demo flow saved locally on device in case projector Wi-Fi interferes.
- [ ] Local backend server running and verified via `docker-compose ps`.
- [ ] Sample `.vsmp` course packages verified on device disk.
- [ ] Printed one-page summary sheet ready for the judges.
