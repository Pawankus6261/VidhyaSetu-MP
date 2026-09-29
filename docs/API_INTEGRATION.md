# VidyaSetu MP (विद्यासेतु) — API Integration Specification

This document details the exact, layer-by-layer architectural data flows between the React Native mobile client (`apps/mobile`) and the FastAPI Cloud Gateway Tier (`backend/`).

---

## 1. Authentication & Anonymous Device Registration

```text
SplashScreen / App Startup (AppContext)
       ↓
studentProfile (Local State in AppContext.jsx)
       ↓
authApi.registerDevice({ social_category, district, course_enrolled })
       ↓
POST /api/v1/auth/register-device
       ↓
Request:  { device_fingerprint_hash, social_category, district, tehsil, course_enrolled }
Response: { access_token, user_id, is_new_user }
       ↓
Local Mutation: apiClient.setAuthToken(access_token) & setDeviceId(user_id)
       ↓
UI Update: AppShell renders with authenticated stateless session (retained offline)
```

---

## 2. Course Catalog & Resumable .VSMP Micro-Pack Download

```text
LearnScreen (पाठशाला)
       ↓
downloadManager (src/services/DownloadManager.js)
       ↓
contentApi.listPacks() & contentApi.downloadPackRange(packId, startByte)
       ↓
GET /api/v1/content/pack/{pack_id} (Header: Range: bytes=0-)
       ↓
Request:  HTTP Range Header for 1.8 MB archive
Response: HTTP 206 Partial Content (application/vnd.vidyasetu.pack+zip)
       ↓
Local Mutation: downloadManager.registerLocalPack(packRecord)
       ↓
UI Update: Module badge updates to "100% Offline (.VSMP)", enables 0 kbps playback
```

---

## 3. Learning Progress & Quiz Score Outbox Persistence

```text
LearnScreen Quiz Submission
       ↓
Local Validation (All questions answered, score computed)
       ↓
syncEngine.enqueueMutation('learning_progress', 'HIS_BA1_MOD1_INDUS_VALLEY', 'UPSERT', payload)
       ↓
Local State: Outbox holds mutation with status 'PENDING'
       ↓
UI Update: Immediate success toast ("Quiz submitted! Progress saved locally & queued for sync")
       ↓
Network Online Event / Sync Trigger
       ↓
POST /api/v1/sync/push (Header: X-Idempotency-Key)
       ↓
Response: { status: "SUCCESS", acknowledged_mutation_ids: ["MUT_..."], server_deltas: [] }
       ↓
Local Mutation: syncEngine marks mutation as 'SYNCED'
```

---

## 4. Academic Doubt Resolution (Hybrid RAG & Confidence Locking)

### Path A: Online Low-Latency Resolution (>= 0.72 Confidence)
```text
DoubtScreen (Text input or Hardware Mic audio via expo-audio)
       ↓
voiceApi.normalizeText(rawText, dialect) [if vernacular dialect selected]
       ↓
POST /api/v1/voice/normalize -> Canonical Devanagari Hindi
       ↓
doubtsApi.resolveDoubt({ queryText, dialectHint, clientMutationId })
       ↓
POST /api/v1/doubts/resolve
       ↓
Response: {
  status: "RESOLVED_AI",
  confidence_score: 0.94,
  answer_text: "नालियां पक्की ईंटों से ढकी थीं। ईंटों का अनुपात 4:2:1 था।",
  citation_source: "बी.ए. इतिहास पुस्तक, अध्याय 1, पृष्ठ 24",
  escalated_to_mentor: false
}
       ↓
UI Update: Renders green GROUNDED AI SOLUTION card with exact textbook & page citation
```

### Path B: Online Low-Confidence Resolution (< 0.72 Confidence)
```text
DoubtScreen -> doubtsApi.resolveDoubt()
       ↓
Backend Hybrid RAG Confidence Lock triggers (Score < 0.72)
       ↓
Response: {
  status: "ESCALATED_FACULTY",
  confidence_score: 0.52,
  answer_text: null,
  citation_source: "संदर्भ: हड़प्पा नगर विन्यास",
  escalated_to_mentor: true,
  ticket_id: "TICKET_RAG_179069"
}
       ↓
UI Update: Renders CONFIDENCE LOCK (< 0.72) card with Faculty Mentor triage notice
```

### Path C: 0 kbps Offline Operation
```text
DoubtScreen (No network connectivity)
       ↓
syncEngine.enqueueMutation('doubt_ticket', doubtId, 'INSERT', { query_text, dialect_hint })
       ↓
Local State: Placed in outbox with status 'QUEUED_OUTBOX'
       ↓
UI Update: Immediate card rendered with "QUEUED FOR 2G BURST SYNC (0 kbps)"
       ↓
Network Restoration: Automatically pushed to POST /api/v1/sync/push on reconnect
```

---

## 5. Deterministic Scholarship Engine & Civic Document Verification

```text
ScholarshipScreen (छात्रवृत्ति)
       ↓
Local Rule Engine: evaluateScholarships(profile) [Instantaneous 0 kbps evaluation]
       ↓
UI Update: Renders eligible schemes & unlocked aid in INR (e.g. ₹84,000/year)
       ↓
Asynchronous Sync: syncEngine.enqueueMutation('scholarship_audit', 'STUDENT_AUDIT', 'UPSERT', profile)
       ↓
Civic Doc Verifier: scholarshipsApi.verifyDocument('SAMAGRA_ID', samagraInput)
       ↓
POST /api/v1/scholarships/verify-doc
       ↓
Request:  { doc_type: "SAMAGRA_ID", doc_value: "194829104" }
Response: { is_valid: true, formatted_value: "194829104", doc_type: "SAMAGRA_ID" }
       ↓
UI Update: Green badge confirming verified official MP Samagra document format
```

---

## 6. Hyperlocal Rural Career Engine

```text
CareerScreen (करियर)
       ↓
Local Fallback: CAREER_PATHWAYS (src/data/careers.js) for 0 kbps viewing
       ↓
Network Online: careerApi.getRecommendation({ enrolledDegree, district, familyLandHoldingAcres })
       ↓
POST /api/v1/career/recommend
       ↓
Request:  { enrolled_degree: "BA", district: "Barwani", family_land_holding_acres: 2.0 }
Response: {
  district: "Barwani",
  primary_recommendation: {
    title: "बैंकिंग कॉरेस्पोंडेंट (BC सखी / कियोस्क ऑपरेटर)",
    target_role: "ग्रामीण बैंक शाखा / CSC केंद्र संचालक",
    monthly_earning_estimate: "₹18,000 - ₹28,000/माह"
  }
}
       ↓
UI Update: Prominent recommendation hero banner tailored to student's exact district
```
