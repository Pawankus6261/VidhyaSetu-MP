# VidyaSetu MP (विद्यासेतु)
### Offline-First, Vernacular Higher Education & Opportunity OS for Rural Madhya Pradesh
**Innovate for Madhya Pradesh | Build for Viksit Bharat 2047**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Target OS](https://img.shields.io/badge/Target_OS-Android_8.0+_Go_Edition-green.svg)]()
[![Bandwidth](https://img.shields.io/badge/Bandwidth-0_kbps_to_40_kbps-orange.svg)]()
[![Focus](https://img.shields.io/badge/Focus-Madhya_Pradesh_Tribal_&_Rural-red.svg)]()

---

## 📌 Executive Summary

Higher education in India has expanded rapidly in institutional count, but participation among rural and tribal youth remains severely constricted by systemic structural friction. In Madhya Pradesh (MP)—a state where 72.37% of the population is rural and 21.1% belongs to Scheduled Tribes (15.31 million citizens, the largest tribal population in India across 46 recognized tribes)—higher education fails not at the level of intellectual ambition, but at the level of **fundamental architectural mismatch**.

Mainstream EdTech platforms (YouTube Learning, Unacademy, Physics Wallah, Coursera) are built on three flawed assumptions:
1. **Continuous high-speed data streaming** (assuming 4G/5G ubiquity),
2. **Standard Hindi or English text fluency** (ignoring tribal mother tongues like Bhili, Gondi, and regional dialects like Nimadi, Malvi, Bundeli, Bagheli), and
3. **Implicit cultural capital** (assuming students possess urban career awareness, know how to navigate complex bureaucratic portals like MPTAAS and NSP, and have educated family mentors).

**VidyaSetu MP** is an **Offline-First, Edge-Intelligent Learning & Opportunity Operating System** architected specifically for low-resource Android devices (Android 8.0+, 2GB–3GB RAM, costing ₹5,000–₹8,000).

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      VIDYASETU MP SYSTEM TOPOLOGY                       │
 └────────────────────────────────────────────────────────────────────────┘
          OFFLINE SPHERE (User Device)          │       CLOUD / SYNC SPHERE
                                                │
   [Local Voice / Text Interface (Bilingual)]   │   [MP Higher Ed / University API]
                      │                         │                 │
   [Tiny Edge Intent Router + Regex Parser]     │   [University Syllabus Ingestion Engine]
                      │                         │                 │
   [Embedded SQLite + FST Pre-compiled Search]  │   [State-Level Vector DB (BGE-M3)]
                      │                         │                 │
   [Deterministic Rule Engine: Scholarships]    │   [MPTAAS / NSP Scraping & Verification]
                      │                         │                 │
   [Local Content Store: Micro-Pack Lessons]    │   [Audio-First Adaptive Transcoder]
                      │                         │                 │
   [Cryptographic Outbox Sync Queue (CRDTs)]    │   [Bhashini Indic Speech Gateway]
                      ▲                         │                 ▲
                      └──────── 40 kbps / SMS / Wi-Fi Mesh ───────┘
```

---

## 🔍 Key Ground Realities & Evidence

* **TRAI Performance Indicator Report (March 2026):** The Madhya Pradesh telecom circle recorded the **lowest rural teledensity in the entire nation at 45.97%** (below Bihar's 46.16% and national rural average of ~59%).
* **Bandwidth Reality:** In rural MP tehsils across Alirajpur, Jhabua, Barwani, Dindori, and Mandla, daytime cellular throughput routinely plummets below **40 kbps**, with intermittent packet loss exceeding 65%. Continuous cloud video streaming is mathematically non-viable.
* **Bureaucratic Dropouts:** Over **₹420+ Crore** in state and national scholarships (Post-Matric ST/SC/OBC, Gaon Ki Beti, Pratibha Kiran, MMVY, Awas Sahayata) remain un-disbursed or delayed annually in MP due to document mismatch, missed portal windows on MPTAAS/e-Pravesh, and lack of grievance tracking.

---

## 🚀 Core Features

### 1. Zero-Byte / Offline-First Learning Core (.vsmp)
* 45-minute college lectures compressed into structured **1.8 MB Audio-Slide Micro-Packs**.
* Opus Voice Codec (12–16 kbps) combined with native vector canvas rendering (JSON/SVG commands) and Devanagari synchronized transcripts.
* **100% playable at 0 kbps.**

### 2. Deterministic Offline Scholarship Engine
* Full client-side evaluation of 48 active MP State and Central Government schemes (MPTAAS Post-Matric, Gaon Ki Beti, Awas Sahayata, Mukhyamantri Medhavi Vidyarthi Yojana).
* Evaluates eligibility and audits required documents offline without requiring internet connectivity.

### 3. Curriculum-Bounded Hybrid RAG (Doubt Resolution)
* Resolves academic doubts grounded strictly in MP Hindi Granth Academy textbooks and approved state university syllabi.
* **Confidence Locking:** If semantic similarity is < 0.72, the AI locks generative answering, displays the verified textbook paragraph, and offers escalation to a college faculty mentor.

### 4. Asynchronous Outbox Sync Queue
* Queues student doubts, quiz attempts, and form drafts locally in SQLite.
* Drains atomically via Brotli-compressed payloads in 2-second bursts when 40 kbps connectivity is detected.

### 5. Vernacular Voice Navigation & Dialect Normalization
* High-contrast, tactile UI paired with voice input supporting Hindi, Nimadi, Malvi, Bundeli, Bagheli, Bhili, and Gondi phrasings via Bhashini Indic Speech models and on-device keyword spotters.

### 6. Hyperlocal Career Pathways
* Context-aware decision trees mapping degrees (B.A., B.Sc., B.Com) to viable local livelihoods: MP ESB/Vyapam exams (Forest Guard, Patwari, Constable), Bank Business Correspondents (BC/CSC Mitra), and agro-cooperative enterprises.

---

## 📊 Quick Tech Stack Summary

| Layer | Primary Technology | Why Selected |
| :--- | :--- | :--- |
| **Mobile Client** | React Native (Bare) + WatermelonDB | Low memory footprint (<192MB RAM) for Android Go |
| **Local Storage** | Embedded SQLite (Encrypted) | Offline persistence as single source of truth |
| **Backend API** | Python 3.11 + FastAPI | Async event loop, native AI/ML pipeline integration |
| **Database** | PostgreSQL 16 + `pgvector` | ACID relational integrity + hybrid dense vector search |
| **Vector DB** | Qdrant / `pgvector` (BGE-M3) | High multilingual Indic retrieval performance |
| **Audio Codec** | Opus (12–16 kbps) | 98% size reduction vs. video lectures |
| **Speech Gateway** | Bhashini Indic Speech API | Open Government of India Indic ASR & TTS |
| **Sync Protocol** | State-based CRDTs + Brotli Batching | High-latency 40 kbps network resilience |

---

## 📂 Repository Directory Layout

```text
mponline/
├── README.md                          # Master Project Overview (This file)
├── LICENSE                            # Apache 2.0 Open Source License
├── .env.example                       # Sample environment configuration
├── docker-compose.yml                 # Multi-container orchestration (Postgres, Redis, Qdrant, MinIO)
├── apps/                              # Production Client Applications
│   ├── mobile/                        # React Native (Expo) Offline-First Student Mobile App
│   │   ├── App.js                     # Full Interactive UI (Audio-Slide Player, Scholarship Matcher, Outbox Doubt Queue, Career Hub)
│   │   ├── package.json               # Expo v51 + React Native 0.74
│   │   └── src/                       # Theming, Local Data & Deterministic Rule Engine
│   └── desktop/                       # Electron Native Windows Desktop Studio
│       ├── main.js                    # Electron Main Process & IPC Handlers (.vsmp compiler, MPTAAS audit)
│       ├── preload.js                 # ContextBridge Security Layer
│       ├── index.html                 # Nodal Officer & Faculty Command Studio UI
│       ├── style.css                  # High-contrast Government Command Theme
│       └── renderer.js                # Interactive Audit, Doubt Escalation & .VSMP Packaging Logic
├── docs/                              # Complete Exhaustive Master R&D Specifications (30 Files)
│   ├── RESEARCH.md                    # Deep demographic & telecom data (AISHE/TRAI)
│   ├── RESEARCH_SOURCE_REGISTRY.md    # Primary government & academic evidence traceability
│   ├── ASSUMPTION_REGISTER.md         # Categorized facts vs insights vs hypotheses vs estimates
│   ├── MP_OPPORTUNITY_MAP.md          # 16-District Higher-Ed Opportunity & Risk Matrix
│   ├── USER_JOURNEY_ANALYSIS.md       # Longitudinal Student Lifecycle & 7-Dimensional Gap Map
│   ├── LOW_BANDWIDTH_ENGINEERING.md   # Mathematical Bandwidth Modeling & Codec Benchmarks
│   ├── PROBLEM_ANALYSIS.md            # Root cause analysis & 5 Whys (10 Dimensions)
│   ├── USER_RESEARCH.md               # 8 Detailed MP Student & Faculty Personas
│   ├── COMPETITOR_ANALYSIS.md         # 15-Platform Matrix & Architectural Gaps
│   ├── PRODUCT_REQUIREMENTS.md        # Comprehensive PRD with functional & non-functional reqs
│   ├── SYSTEM_ARCHITECTURE.md         # C4 Architecture & Sequence Diagrams
│   ├── AI_ARCHITECTURE.md             # Hybrid RAG & Confidence Locking (<0.72)
│   ├── OFFLINE_ARCHITECTURE.md        # CRDTs, SQLite Schema & 1.8MB .vsmp Protocol
│   ├── VOICE_ARCHITECTURE.md          # Bhashini Indic Speech, ULCA & Dialect Normalization
│   ├── DATABASE_SCHEMA.md             # Production PostgreSQL 16 (pgvector) & Edge SQLite DDL
│   ├── SCHOLARSHIP_ENGINE.md          # Deterministic Rule Engine Specification (MPTAAS/NSP)
│   ├── CAREER_ENGINE.md               # MP Local Economic Decision Trees
│   ├── API_DOCUMENTATION.md           # RESTful API Specifications & Brotli Payloads
│   ├── SECURITY_PRIVACY.md            # DPDP Act 2023 Compliance & Threat Model
│   ├── ACCESSIBILITY.md               # WCAG 2.2 Level AA & High-Glare Outdoor Usability
│   ├── TECHNICAL_FEASIBILITY.md       # Build vs. Buy vs. Partner Assessment
│   ├── COST_ANALYSIS.md               # Unit Economics (₹23.40/student/year at 100k scale)
│   ├── IMPACT_MODEL.md                # Theory of Change, Logic Model & UN SDG Alignment
│   ├── PILOT_PLAN.md                  # 6-Phase MP College Deployment Roadmap
│   ├── MVP_SCOPE.md                   # MoSCoW Framework & Demonstration Boundaries
│   ├── DEMO_SCRIPT.md                 # 5-Minute Timed Hackathon Stage Script
│   ├── JUDGE_QA.md                    # Adversarial Defense & FAQ Against Technical Judges
│   ├── RISK_REGISTER.md               # 20 Failure Modes & Engineering Mitigations
│   ├── ROADMAP.md                     # Multi-Year Strategic Rollout Schedule
│   ├── TEAM_IDEA_BRIEF.md             # Team Internal Master Briefing & Concept Guide (Hinglish/Hindi)
│   ├── TEAM_EXECUTION_PLAN.md         # 4-Member Hackathon Sprint & Stage Defense Battle Plan
│   └── DECISION_LOG.md                # Architecture Decision Records (ADRs 001-008)
└── data/                              # Seed Datasets & Offline Models
    ├── scholarships/
    │   └── mp_scholarships.json       # 48 Verified MP State Welfare Schemes (MPTAAS/Sambal/MMVY)
    ├── courses/
    │   └── ba_history_module1.json    # Sample 1.8MB Audio-Slide Micro-Pack Data
    └── career/
        └── mp_career_pathways.json    # Localized Employment Decision Trees
```

---

## 💻 Running the Applications

### 1. React Native Student Mobile App (`apps/mobile`)
Designed for low-end smartphones (Android Go / 2GB RAM) in rural Madhya Pradesh. Runs 100% offline at 0 kbps.

```bash
cd apps/mobile
npm install
npx expo start
```
*Press `w` in terminal to run in Web Browser preview, or scan QR code with Expo Go on Android.*

### 2. Electron Desktop Command Studio (`apps/desktop`)
Designed for rural college principals, MPTAAS nodal officers, and university faculty.

```bash
cd apps/desktop
npm install
npm start
```
*Includes MPTAAS Aadhaar-NPCI Audit Triage Desk, Faculty Doubt Escalation, and `.vsmp` 1.8MB Micro-Pack Compiler Studio.*

---

## 🛠️ Local Infrastructure Setup

To spin up the local development and database services (PostgreSQL with `pgvector`, Qdrant vector database, Redis cache, and MinIO object storage):

```bash
docker-compose up -d
```

Verify service health:
```bash
docker-compose ps
```

---

## 📑 Complete Master R&D Documentation Directory

### 🔬 Empirical Research, Policy & Field Evidence
- [Primary Research Findings & Data](docs/RESEARCH.md)
- [Government Source Traceability Registry](docs/RESEARCH_SOURCE_REGISTRY.md)
- [Assumption, Hypothesis & Fact Register](docs/ASSUMPTION_REGISTER.md)
- [16-District MP Opportunity & Risk Matrix](docs/MP_OPPORTUNITY_MAP.md)
- [Longitudinal Student Journey & 7-Gap Analysis](docs/USER_JOURNEY_ANALYSIS.md)
- [Mathematical Bandwidth Modeling & Codecs](docs/LOW_BANDWIDTH_ENGINEERING.md)
- [Problem Analysis & 5 Whys (10 Dimensions)](docs/PROBLEM_ANALYSIS.md)
- [Field User Personas & Realities](docs/USER_RESEARCH.md)
- [15-Platform Competitor Gap Analysis](docs/COMPETITOR_ANALYSIS.md)

### 📐 Product Requirements & Architecture Specifications
- [Comprehensive Product Requirements Document (PRD)](docs/PRODUCT_REQUIREMENTS.md)
- [End-to-End System Architecture & Data Flows](docs/SYSTEM_ARCHITECTURE.md)
- [AI Hybrid Curriculum RAG & Confidence Locking](docs/AI_ARCHITECTURE.md)
- [Offline-First Engine, CRDTs & .vsmp Protocol](docs/OFFLINE_ARCHITECTURE.md)
- [Voice Architecture, Bhashini ULCA & Dialects](docs/VOICE_ARCHITECTURE.md)
- [Complete Cloud PostgreSQL & Edge SQLite Schemas](docs/DATABASE_SCHEMA.md)
- [Deterministic Scholarship Decision Engine](docs/SCHOLARSHIP_ENGINE.md)
- [Hyperlocal MP Career Decision Trees](docs/CAREER_ENGINE.md)
- [Low-Bandwidth RESTful API Specifications](docs/API_DOCUMENTATION.md)

### 🛡️ Compliance, Security, Accessibility & Viability
- [Security Threat Model & DPDP Act 2023 Compliance](docs/SECURITY_PRIVACY.md)
- [Accessibility & WCAG 2.2 AA Compliance](docs/ACCESSIBILITY.md)
- [Build vs. Buy vs. Partner Feasibility Matrix](docs/TECHNICAL_FEASIBILITY.md)
- [Cost Analysis & Infrastructure Unit Economics](docs/COST_ANALYSIS.md)
- [Theory of Change, Logic Model & SDG Alignment](docs/IMPACT_MODEL.md)
- [Twenty Failure Modes & Risk Register](docs/RISK_REGISTER.md)
- [Architecture Decision Records (ADRs 001-008)](docs/DECISION_LOG.md)

### 🚀 Pilot Execution, Roadmap & Hackathon Strategy
- [Team Internal Master Briefing & Concept Guide (Hinglish)](docs/TEAM_IDEA_BRIEF.md)
- [Four-Member Hackathon Sprint & Stage Defense Battle Plan](docs/TEAM_EXECUTION_PLAN.md)
- [Six-Phase Madhya Pradesh Pilot Deployment Plan](docs/PILOT_PLAN.md)
- [Hackathon MVP Scope (MoSCoW Framework)](docs/MVP_SCOPE.md)
- [5-Minute Timed Demonstration Script](docs/DEMO_SCRIPT.md)
- [Technical Judge Adversarial Q&A Defense](docs/JUDGE_QA.md)
- [Multi-Year Strategic Roadmap](docs/ROADMAP.md)

---

## 🏛️ Alignment with National Missions
* **National Education Policy (NEP 2020):** Multilingual instruction, regional language promotion, credit portability, and equity in higher education.
* **Digital India:** Expanding digital empowerment beyond urban broadband corridors into Fifth Schedule tribal blocks.
* **Viksit Bharat 2047:** Direct economic mobility and education democratization for youth in tier-3, rural, and tribal hinterlands.

---

**Built with pride for Madhya Pradesh. Architected for Viksit Bharat.**
#
