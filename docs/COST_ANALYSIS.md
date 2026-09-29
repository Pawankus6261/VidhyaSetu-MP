# COST_ANALYSIS.md: Unit Economics & Financial Sustainability

---

## 1. Cloud Infrastructure Cost Projections

Because VidyaSetu MP delegates 95% of execution (audio playback, vector drawing, deterministic scholarship evaluation, and document auditing) to the student's edge smartphone, server-side compute and bandwidth requirements remain exceptionally low.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE OPERATING COST PROJECTIONS                   │
├──────────────────────────┬──────────────┬──────────────┬────────────────────┤
│ INFRASTRUCTURE ELEMENT   │ 1,000 USERS  │ 10,000 USERS │ 100,000 USERS      │
├──────────────────────────┼──────────────┼──────────────┼────────────────────┤
│ Cloud Compute (FastAPI)  │ ₹2,500/mo    │ ₹8,500/mo    │ ₹38,000/mo         │
│ Database (Postgres+Pgvec)│ ₹1,800/mo    │ ₹6,000/mo    │ ₹24,000/mo         │
│ Object Storage (MinIO/S3)│ ₹800/mo      │ ₹4,500/mo    │ ₹28,000/mo         │
│ AI Inference (Self-host) │ ₹4,500/mo    │ ₹18,000/mo   │ ₹65,000/mo         │
│ Bhashini Gateway (Govt)  │ ₹0 (Free Open│ ₹0 (Open API)│ ₹0 (Govt Partner)  │
│ CDN / Network Bandwidth  │ ₹1,200/mo    │ ₹6,500/mo    │ ₹32,000/mo         │
│ Monitoring & Sentry      │ ₹0 (Free tier│ ₹2,500/mo    │ ₹8,000/mo          │
├──────────────────────────┼──────────────┼──────────────┼────────────────────┤
│ TOTAL MONTHLY COST       │ ₹10,800/mo   │ ₹46,000/mo   │ ₹1,95,000/mo       │
│ ANNUAL COST PER STUDENT  │ ₹129.60/year │ ₹55.20/year  │ ₹23.40/year        │
└──────────────────────────┴──────────────┴──────────────┴────────────────────┘
```

---

## 2. Unit Economics Breakdown at 100,000 Students

* **Annual Operating Budget:** ₹23,40,000 (~$28,000 USD).
* **Cost Per Student Per Year:** **₹23.40** (approx. 28 US cents).
* **Cost Per Student Per Month:** **₹1.95**.

---

## 3. Financial Sustainability Sources in Madhya Pradesh

1. **District Mineral Foundation (DMF) Trust Funds:**  
   Under the Mines and Minerals (Development and Regulation) Amendment Act, mining districts in MP (Singrauli, Betul, Balaghat, Chhindwara, Dhar) hold statutory corporate mineral royalties earmarked specifically for tribal educational welfare and digital infrastructure.
2. **MP State Higher Education Council (RUSA Allocation):**  
   Components allocated under RUSA for equity initiatives and digital learning platforms.
3. **Ministry of Tribal Affairs Grants (Article 275(1)):**  
   Constitutional grants for tribal development and educational infrastructure.
