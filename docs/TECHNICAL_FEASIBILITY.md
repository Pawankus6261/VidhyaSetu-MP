# TECHNICAL_FEASIBILITY.md: Build vs. Buy vs. Partner Engineering Feasibility
## Platform: VidyaSetu MP (विद्यासेतु)

---

## 1. Feasibility Classification Matrix

To ensure realistic delivery and avoid over-promising non-existent APIs, all technical subsystems are classified across five strict engineering categories:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SUBSYSTEM FEASIBILITY MATRIX                          │
├───────────────────────────────┬───────────────────────────┬─────────────────┤
│ SUBSYSTEM COMPONENT           │ CLASSIFICATION            │ DEPENDENCY      │
├───────────────────────────────┼───────────────────────────┼─────────────────┤
│ Audio-Slide .vsmp Packaging   │ ✅ BUILD NOW              │ In-House Code   │
│ Client SQLite & WatermelonDB  │ ✅ BUILD NOW              │ Open Source Lib │
│ Deterministic Scholarship Eng.│ ✅ BUILD NOW              │ MP Gazettes     │
│ CRDT Outbox Sync Engine       │ ✅ BUILD NOW              │ In-House Queue  │
│ Brotli Compression Gateway    │ ✅ BUILD NOW              │ Standard Lib    │
│ FastAPI Cloud Backend         │ ✅ BUILD NOW              │ Python Async    │
├───────────────────────────────┼───────────────────────────┼─────────────────┤
│ Indic ASR Speech-to-Text      │ ⚡ BUILD WITH API         │ Bhashini Gateway│
│ Indic TTS Text-to-Speech      │ ⚡ BUILD WITH API         │ Bhashini Gateway│
│ Dense Vector Embeddings       │ ⚡ BUILD WITH API / MODEL │ BAAI/bge-m3     │
│ SLM Generative RAG Inference  │ ⚡ BUILD WITH API / MODEL │ Llama-3.1-AWQ   │
├───────────────────────────────┼───────────────────────────┼─────────────────┤
│ MPTAAS Auto-Form Submissions  │ 🤝 REQUIRES PARTNERSHIP   │ MP Tribal Dept  │
│ DigiLocker e-KYC Verification │ 🤝 REQUIRES PARTNERSHIP   │ MeitY API Setu  │
│ University Syllabus Textbook  │ 🤝 REQUIRES PARTNERSHIP   │ MP Hindi Granth │
│ Toll-Free GSM 2G Trunk        │ 🤝 REQUIRES PARTNERSHIP   │ BSNL / Bhashini │
├───────────────────────────────┼───────────────────────────┼─────────────────┤
│ On-Device SLM (Edge LLM 1B)   │ 🔬 REQUIRES RESEARCH      │ NPU / RAM Limits│
│ Tribal Dialect Pure Acoustic  │ 🔬 REQUIRES RESEARCH      │ Bhili / Gondi   │
│ P2P Wi-Fi Direct Mesh Sync    │ 🔬 REQUIRES RESEARCH      │ Android OS ROM  │
├───────────────────────────────┼───────────────────────────┼─────────────────┤
│ Automated Degree Verification │ 🚀 FUTURE SCOPE           │ ABC / NAD Portal│
│ Blockchain Credential Minting │ 🚀 FUTURE SCOPE           │ State Policy    │
└───────────────────────────────┴───────────────────────────┴─────────────────┘
```

---

## 2. In-Depth Subsystem Feasibility Analysis

### 2.1 The Core Offline Learning Core (Status: BUILD NOW)
* **Technical Complexity:** Medium.
* **Dependencies:** None. Completely within the development team's control.
* **Mechanism:** Python CLI script compresses mono Opus audio, vector drawing commands (`slides.json`), timestamp mappings, and Brotli text into `.vsmp` archives. The client unzips and renders locally.
* **Feasibility Rating:** **100% Guaranteed Feasible.**

### 2.2 Deterministic Scholarship Rule Engine (Status: BUILD NOW)
* **Technical Complexity:** Low-Medium.
* **Dependencies:** Official Government Gazettes (MPTAAS, MP Scholarship Portal 2.0).
* **Mechanism:** 48 rule objects encoded into structured JSON-LD schemas. Pure client-side Boolean and arithmetic evaluation on device profile attributes.
* **Feasibility Rating:** **100% Guaranteed Feasible.**

### 2.3 Bhashini Indic Speech Services (Status: BUILD WITH API)
* **Technical Complexity:** Medium.
* **Dependencies:** Bhashini ULCA API credentials (`userId` and `inferenceApiKey`).
* **Mechanism:** Sends 16 kHz base64-encoded audio to `dhruva-api.bhashini.gov.in/services/inference/pipeline`.
* **Feasibility Rating:** **90% Feasible.** Open government API is active and functional; requires timeout and retry fallbacks for high-traffic government server periods.

### 2.4 MPTAAS Portal Direct API Integration (Status: REQUIRES PARTNERSHIP)
* **Honest Evaluation:** The Tribal Affairs Department of MP does **not** currently provide public, open REST APIs for external third-party form submissions.
* **Current Feasibility:** We do **not** claim automated submission. We build the **Offline Audit & Document Checklist Engine** that validates all student parameters and guides them through official portal submission without error. Direct API integration is a Phase 3 institutional partnership objective.

### 2.5 Edge LLM on Device (Status: REQUIRES RESEARCH)
* **Honest Evaluation:** Running a 1-Billion or 3-Billion parameter Small Language Model (e.g., Llama-3.2-1B or SmolLM) directly on an entry-level smartphone (Redmi 9A with 2GB RAM) causes immediate OS Out-Of-Memory (OOM) process termination.
* **Current Architectural Decision:** Edge inference on device is restricted to lightweight regex, rule engines, and pre-compiled TFLite acoustic keyword spotters (<4MB). Generative RAG inference is handled asynchronously in the cloud via vLLM upon outbox synchronization.
