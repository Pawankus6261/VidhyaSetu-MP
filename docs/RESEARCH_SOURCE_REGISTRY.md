# RESEARCH_SOURCE_REGISTRY.md: Primary Government & Academic Evidence Registry
## Platform: VidyaSetu MP (विद्यासेतु)

---

## 1. Master Evidence Registry

Every empirical statistic, demographic figure, infrastructural measurement, and policy claim utilized in the VidyaSetu MP architecture is traceable to authoritative official primary sources:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                 PRIMARY RESEARCH SOURCE REGISTRY                                                │
├────────┬──────────────────────┬───────────────────────────────┬────────────┬──────────────────────────────────────┬─────────────┤
│ SRC_ID │ ORGANIZATION         │ TITLE & PUBLICATION           │ DATE       │ VERIFIED URL                         │ RELIABILITY │
├────────┼──────────────────────┼───────────────────────────────┼────────────┼──────────────────────────────────────┼─────────────┤
│ SRC-01 │ Telecom Regulatory   │ Indian Telecom Services       │ March 2026 │ https://www.trai.gov.in              │ Official    │
│        │ Authority of India   │ Performance Indicators Report │            │                                      │ Statutory   │
│        │ (TRAI)               │ (QE March 2026)               │            │                                      │             │
├────────┼──────────────────────┼───────────────────────────────┼────────────┼──────────────────────────────────────┼─────────────┤
│ SRC-02 │ Ministry of Education│ All India Survey on Higher    │ 2024       │ https://aishe.gov.in                 │ Official    │
│        │ (Govt of India)      │ Education (AISHE Final Report)│            │                                      │ National    │
├────────┼──────────────────────┼───────────────────────────────┼────────────┼──────────────────────────────────────┼─────────────┤
│ SRC-03 │ Ministry of Health & │ National Family Health Survey │ 2021       │ http://rchiips.org/nfhs/factsheet_   │ Official    │
│        │ Family Welfare (MoHFW│ (NFHS-5) State Factsheet: MP  │            │ NFHS-5.shtml                         │ National    │
├────────┼──────────────────────┼───────────────────────────────┼────────────┼──────────────────────────────────────┼─────────────┤
│ SRC-04 │ Dept of Higher Edu.  │ e-Pravesh Admission Statistics│ 2026       │ https://epravesh.highereducation.    │ Official    │
│        │ (Govt of MP)         │ & Institutional Annual Report │            │ mp.gov.in/                           │ State       │
├────────┼──────────────────────┼───────────────────────────────┼────────────┼──────────────────────────────────────┼─────────────┤
│ SRC-05 │ Tribal Affairs Dept. │ MPTAAS Operational Welfare    │ 2026       │ https://www.tribal.mp.gov.in/MPTAAS  │ Official    │
│        │ (Govt of MP)         │ Guidelines & Annual Outlays   │            │                                      │ State       │
├────────┼──────────────────────┼───────────────────────────────┼────────────┼──────────────────────────────────────┼─────────────┤
│ SRC-06 │ Office of Registrar  │ Census of India 2011:         │ 2011       │ https://censusindia.gov.in           │ Official    │
│        │ General & Census     │ Primary Census Abstract (STs) │            │                                      │ Statutory   │
├────────┼──────────────────────┼───────────────────────────────┼────────────┼──────────────────────────────────────┼─────────────┤
│ SRC-07 │ Ministry of Law &    │ Digital Personal Data         │ August 2023│ https://www.meity.gov.in/content/    │ Statutory   │
│        │ Justice (Govt India) │ Protection Act (Act 22 of 2023│            │ digital-personal-data-protection-act │ Legislation │
├────────┼──────────────────────┼───────────────────────────────┼────────────┼──────────────────────────────────────┼─────────────┤
│ SRC-08 │ Bhashini / MeitY     │ Universal Language Contrib.   │ 2026       │ https://dhruva-api.bhashini.gov.in/  │ Official    │
│        │ (Govt of India)      │ APIs (ULCA) Pipeline Specs    │            │ services/inference/pipeline          │ Technical   │
├────────┼──────────────────────┼───────────────────────────────┼────────────┼──────────────────────────────────────┼─────────────┤
│ SRC-09 │ Ministry of Education│ National Education Policy     │ July 2020  │ https://www.education.gov.in/nep     │ Official    │
│        │ (Govt of India)      │ (NEP 2020) Framework          │            │                                      │ Policy      │
├────────┼──────────────────────┼───────────────────────────────┼────────────┼──────────────────────────────────────┼─────────────┤
│ SRC-10 │ Higher Edu Dept (MP) │ Madhya Pradesh Scholarship    │ 2026       │ https://scholarshipportal.mp.nic.in  │ Official    │
│        │ & NIC MP             │ Portal 2.0 Operational Rules  │            │                                      │ State       │
└────────┴──────────────────────┴───────────────────────────────┴────────────┴──────────────────────────────────────┴─────────────┘
```

---

## 2. Granular Findings & Product Architectural Relevance

### Source SRC-01: TRAI Quarterly Report (QE March 2026)
* **Specific Finding:** The Madhya Pradesh telecom circle recorded the **lowest rural teledensity in India at 45.97%**, trailing Bihar (46.16%) and the all-India rural average of ~59.2%. Rural internet subscriptions stand at 38.4 per 100 population.
* **Why it Matters to VidyaSetu:** Proves definitively that streaming video architectures (YouTube, Coursera, Zoom) exclude over half the rural population of Madhya Pradesh. Dictates the mandatory **Zero-Byte / Offline-First .vsmp Architecture**.

### Source SRC-02: AISHE Higher Education Reports (2021-22 & 2023-24)
* **Specific Finding:** While national GER reached 30.0, Scheduled Tribe (ST) GER in Madhya Pradesh lags significantly at **15.2% to 17.8%**. College density in tribal districts (Alirajpur, Dindori, Sheopur) is below 9 per lakh population (vs. national average of 31).
* **Why it Matters to VidyaSetu:** Demonstrates that collegiate dropout is concentrated in tribal belts where long commute distances (25–60 km) prevent daily college attendance, mandating asynchronous study options.

### Source SRC-03: NFHS-5 State Factsheet (Madhya Pradesh)
* **Specific Finding:** Only **22.5% of women in rural MP** have ever used the internet, compared to 47.6% of rural men and 56.8% of urban women.
* **Why it Matters to VidyaSetu:** Proves the gendered nature of device and connectivity access. In rural households, smartphones are controlled by men. Female students need offline, night-scheduled downloads that allow learning in brief 15-minute bursts when the phone is shared.

### Source SRC-04: Department of Higher Education, MP (e-Pravesh Admissions 2026-27)
* **Specific Finding:** Total collegiate enrollment in MP stands at **12.10 lakh**, with **6,13,469 fresh admissions** processed via the e-Pravesh centralized portal across 571 government degree colleges and 81 universities.
* **Why it Matters to VidyaSetu:** Provides the exact TAM (Total Addressable Market) and institutional anchor points. Integration with e-Pravesh course codes ensures 100% syllabus alignment.

### Source SRC-05: Tribal Affairs Department, MP (MPTAAS Reports)
* **Specific Finding:** Over **₹1,000 Crore** was disbursed via MPTAAS in 2024-25 across ~5 lakh ST and SC students, covering tuition and Awas Sahayata housing allowances.
* **Why it Matters to VidyaSetu:** Highlights the massive scale of public financial aid, proving that the barrier is **bureaucratic interface friction and document mismatch**, which VidyaSetu's deterministic rule engine solves.

### Source SRC-06: Census of India 2011 (ST Primary Census Abstract)
* **Specific Finding:** MP has **15.31 million tribal citizens (21.1% of state population)** across 46 recognized tribes. Alirajpur recorded the lowest literacy rate in India at **36.1%**, followed by Jhabua at **43.3%** and Barwani at **49.1%**.
* **Why it Matters to VidyaSetu:** Identifies the highest-need developmental pilot tehsils and justifies the vernacular voice-first interaction model.

### Source SRC-07: Digital Personal Data Protection (DPDP) Act 2023
* **Specific Finding:** Sections 5, 6, 9 (children & minors), and 12 mandate clear multilingual consent, strict data minimization, zero minor profiling, and the right to erasure.
* **Why it Matters to VidyaSetu:** Dictates the security architecture: zero raw Aadhaar or biometric persistence, SHA-256 phone hashing, and client-side SQLCipher encryption.

### Source SRC-08: Bhashini / MeitY ULCA Gateway
* **Specific Finding:** The `dhruva-api.bhashini.gov.in` endpoint provides open, high-accuracy acoustic models for Indic languages (including Hindi and Central Indian accents) via standardized JSON payloads.
* **Why it Matters to VidyaSetu:** Eliminates recurring commercial speech API subscription costs ($0.006/min) while ensuring acoustic models trained specifically on Indian speakers.
