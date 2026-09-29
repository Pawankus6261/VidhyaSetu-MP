# VidyaSetu MP (विद्यासेतु) — FastAPI Cloud Gateway Tier
### Production Backend API & Edge-Cloud Synchronization Engine

Designed and engineered specifically in accordance with the 32 R&D specifications in [`docs/`](../docs/):
* **0 kbps / 40 kbps Low-Bandwidth Resilience** ([`LOW_BANDWIDTH_ENGINEERING.md`](../docs/LOW_BANDWIDTH_ENGINEERING.md))
* **Curriculum-Bounded Hybrid RAG & Confidence Locking (< 0.72)** ([`AI_ARCHITECTURE.md`](../docs/AI_ARCHITECTURE.md))
* **Deterministic MP Welfare & Entitlement Engine (48 Schemes)** ([`SCHOLARSHIP_ENGINE.md`](../docs/SCHOLARSHIP_ENGINE.md))
* **Bhashini Indic Speech & Vernacular Dialect Normalization** ([`VOICE_ARCHITECTURE.md`](../docs/VOICE_ARCHITECTURE.md))
* **Resumable HTTP Range Streaming for 1.8 MB .vsmp Micro-Packs** ([`OFFLINE_ARCHITECTURE.md`](../docs/OFFLINE_ARCHITECTURE.md))
* **DPDP Act 2023 Compliant Identity & Audit Journal** ([`DATABASE_SCHEMA.md`](../docs/DATABASE_SCHEMA.md), [`SECURITY_PRIVACY.md`](../docs/SECURITY_PRIVACY.md))

---

## 🚀 Quick Start (Local Run)

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Start the Server
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

* **Interactive Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **Healthcheck Probe:** [http://localhost:8000/health](http://localhost:8000/health)

---

## 🧪 Running Automated Tests
```bash
python -m pytest backend/tests/test_all.py -v
```

---

## 📡 API Endpoint Architecture

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Healthcheck (PostgreSQL/SQLite, Storage, System Resources) |
| `POST` | `/api/v1/auth/register-device` | DPDP Act compliant anonymous device token generation |
| `POST` | `/api/v1/auth/login-samagra` | Authentication via 9-digit MP Samagra ID |
| `POST` | `/api/v1/sync/push` | Atomic Outbox Drain (Brotli/Gzip) & Delta Fetch over 40 kbps |
| `GET` | `/api/v1/content/universities` | Master list of MP State Universities (DAVV, Barkatullah, IGNTU) |
| `GET` | `/api/v1/content/packs` | List available `.vsmp` packages ready for offline study |
| `GET` | `/api/v1/content/pack/{pack_id}`| Resumable HTTP Range-Header binary `.vsmp` stream |
| `POST` | `/api/v1/doubts/resolve` | Curriculum RAG (Confidence Lock < 0.72 -> Faculty Escalation) |
| `POST` | `/api/v1/voice/normalize` | Dialect Normalization (Nimadi, Malvi, Bundeli, Bagheli, Bhili, Gondi) |
| `POST` | `/api/v1/voice/transcribe` | Bhashini ULCA Indic speech recognition |
| `GET` | `/api/v1/scholarships/catalog` | Master 48 verified MP Government scholarship schemes |
| `POST` | `/api/v1/scholarships/audit` | Deterministic eligibility match & required document checklist |
| `POST` | `/api/v1/scholarships/verify-doc`| Document validation (Samagra 9-digit, Caste 16-digit, NPCI) |
| `GET` | `/api/v1/career/pathways` | 5 Realistic Rural Economic Horizons |
| `POST` | `/api/v1/career/recommend` | Hyperlocal career recommendations for MP tribal districts |
