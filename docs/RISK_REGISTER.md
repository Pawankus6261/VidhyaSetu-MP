# RISK_REGISTER.md: Twenty Failure Modes & Engineering Mitigations
## Platform: VidyaSetu MP (विद्यासेतु)

---

## 1. Risk Evaluation & Categorization Matrix

| # | Risk Category | Specific Failure Mode Description | Probability | Severity | Engineering & Operational Mitigation Strategy |
| :-: | :--- | :--- | :---: | :---: | :--- |
| **1** | **Technical** | Storage exhaustion on 32GB budget Android smartphones. | High | High | Implement strict sandboxed cache ceiling (max 1.5 GB); auto-purges completed course units using Least-Recently-Used (LRU) algorithm. |
| **2** | **Technical** | Android Go OS kills background synchronization daemon to save RAM. | High | High | Implements `WorkManager` API with opportunistic wake hooks triggering on device battery charging and unmetered network connection. |
| **3** | **Technical** | SQLite database corruption due to sudden device battery death mid-write. | Medium | High | Enforces Write-Ahead Logging (`PRAGMA journal_mode = WAL;`) and atomic transactional commits (`BEGIN TRANSACTION; ... COMMIT;`). |
| **4** | **Technical** | High latency or packet drop causes sync socket timeouts. | High | Medium | Enforces Brotli compression (<2KB payloads), 15s connection timeouts, and exponential backoff retry schedules with jitter. |
| **5** | **AI / NLP** | RAG generates hallucinated historical or scientific facts. | Medium | Critical | Enforces **Confidence Locking**: If vector similarity score is <0.72, generative LLM is locked, displaying verbatim textbook excerpt and escalating to mentor. |
| **6** | **AI / NLP** | Vernacular dialect phrasings fail embedding vector retrieval. | High | Medium | Pre-processes queries through a rule-based phonological dialect normalization layer converting regional dialect terms to canonical Hindi. |
| **7** | **Infrastructural** | Rural cellular towers lose generator power during grid load shedding. | High | High | Core design principle: 100% of study player, notes, and scholarship logic operates indefinitely at 0 kbps (Airplane Mode). |
| **8** | **Infrastructural** | High solar glare renders mobile screen unreadable in farm fields. | High | Medium | Strictly adheres to WCAG 2.2 AAA outdoor contrast ratios (14.8:1) using anti-glare high-contrast color tokens. |
| **9** | **Behavioral** | First-generation learners intimidated by complex digital UI. | High | High | Enforces the "Rule of 3 Taps", high-contrast tactile iconography, and audio-first prompt readouts (*"सुनिए"* buttons) on every screen. |
| **10** | **Behavioral** | Male family members monopolize the single household smartphone. | High | High | Enables background automated midnight download scheduling; asynchronous audio review allows learning in brief 15-minute bursts. |
| **11** | **Bureaucratic** | State government changes scholarship application deadlines without notice. | High | High | Daily cloud automated scraper monitors official MPTAAS and MP Scholarship 2.0 gazettes, broadcasting silent 4KB delta updates to client SQLite. |
| **12** | **Bureaucratic** | Student submits scholarship form with unseeded bank account. | High | High | App incorporates an interactive USSD diagnostic guide (`*99*99*1#`) to verify Aadhaar-NPCI bank seeding before portal submission. |
| **13** | **Institutional** | College faculty ignore Tier-3 mentor escalation tickets. | High | Medium | Aggregated weekly unresolved ticket reports automatically escalated to Government College Principal and District Higher Ed Officer dashboard. |
| **14** | **Institutional** | Guest faculty (*Atithi Vidwan*) rotation causes curriculum authoring gaps. | Medium | Medium | Direct institutional partnership with the Madhya Pradesh Hindi Granth Academy ensures permanent state-level curriculum grounding. |
| **15** | **Security** | Malicious users inject abusive voice notes into peer mentoring relays. | Medium | High | All asynchronous voice notes transcribed via Bhashini ASR and passed through automated toxicity and PII filters before recipient delivery. |
| **16** | **Security** | Phishing links circulating on social media promising fake scholarships. | High | High | Client runtime enforces strict URL sandboxing, blocking all outbound browser links not ending in verified `.gov.in`, `.nic.in`, or `.ac.in` domains. |
| **17** | **Security** | Reverse-engineering of APK and tampering with local SQLite databases. | Low | Medium | Client SQLite database encrypted using SQLCipher (AES-256); release builds protected via ProGuard / R8 code obfuscation. |
| **18** | **Regulatory** | Breach of Digital Personal Data Protection (DPDP) Act 2023. | Low | Critical | Strict data minimization: Zero biometric or raw Aadhaar storage; SHA-256 hashed phone numbers; granular consent notices in vernacular audio. |
| **19** | **Financial** | Cloud AI GPU inference costs spiral as student base scales. | Medium | High | 95% of compute executed on edge device; cloud inference limited to quantized SLM (4-bit AWQ Llama-3.1), capped at ₹23.40/student/year. |
| **20** | **Adoption** | Students uninstall app to free up flash space for videos or games. | High | Medium | Compact 14.5 MB APK footprint; app communicates clear tangible financial value (tracking ₹25,000+ in pending scholarship disbursements). |
