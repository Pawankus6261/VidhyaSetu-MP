# SECURITY_PRIVACY.md: Threat Modeling & DPDP Act 2023 Compliance

---

## 1. Compliance with the Digital Personal Data Protection (DPDP) Act 2023

VidyaSetu MP processes demographic and educational data for vulnerable student populations in Fifth Schedule tribal areas. The platform adheres strictly to the statutory requirements of the **Digital Personal Data Protection Act 2023 (Act No. 22 of 2023)**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DPDP ACT 2023 COMPLIANCE MATRIX                       │
├─────────────────────┬───────────────────────────────────────────────────────┤
│ STATUTORY PROVISION │ VIDYASETU MP ENGINEERING IMPLEMENTATION               │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Section 5 (Notice)  │ Audio-visual consent notices in spoken Hindi, Nimadi, │
│                     │ Gondi, and Bhili explaining exact data usage.         │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Section 6 (Consent) │ Granular, unbundled, freely given opt-in consent for  │
│                     │ scholarship evaluation and peer mentorship.           │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Section 9 (Minors)  │ For students under 18: No behavioral profiling, no   │
│                     │ targeted tracking, no third-party ad pixels.          │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Section 12 (Erasure)│ One-tap "डेटा हटाएं (Erase All My Data)" button that  │
│                     │ purges local SQLite and triggers tombstone deletion.  │
├─────────────────────┼───────────────────────────────────────────────────────┤
│ Data Minimization   │ No raw Aadhaar or biometrics stored. Only Samagra ID  │
│                     │ and hashed phone tokens are stored in the database.   │
└─────────────────────┴───────────────────────────────────────────────────────┘
```

---

## 2. Threat Modeling & Engineering Mitigations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         THREAT MODEL & MITIGATIONS                          │
├───────────────────────┬───────────────────────────┬─────────────────────────┤
│ THREAT                │ ATTACK VECTOR             │ ENGINEERING MITIGATION  │
├───────────────────────┼───────────────────────────┼─────────────────────────┤
│ Fake Scholarships     │ Malicious Link Injection  │ Hardcoded Whitelist;    │
│                       │ in Mentorship/Forums      │ URL Sandboxing          │
├───────────────────────┼───────────────────────────┼─────────────────────────┤
│ Prompt Injection      │ Student inputs adversarial│ NeMo Guardrails; Strict │
│                       │ text to bypass syllabus   │ System Bounding Rules   │
├───────────────────────┼───────────────────────────┼─────────────────────────┤
│ Replay Attacks        │ Sync packet interception  │ SHA-256 HMAC Nonces +   │
│                       │ on public Wi-Fi           │ TLS 1.3 Strict Pinning  │
├───────────────────────┼───────────────────────────┼─────────────────────────┤
│ APK Tampering /       │ Rogue APKs spreading via  │ Google Play App Signing;│
│ Piracy                │ Bluetooth ShareMe         │ Native SHA Checksum Ver.│
└───────────────────────┴───────────────────────────┴─────────────────────────┘
```

### 2.1 Defense Against Malicious Scholarship Links
Phishing scammers frequently circulate fake scholarship links (e.g., promising "₹50,000 Free Laptop Scheme") via WhatsApp in rural colleges to steal bank details.
* **Mitigation:** The application sandboxes all external URLs. Only domains ending in `.gov.in`, `.nic.in`, or verified university domains (`*.ac.in`) are allowed to launch in external web browsers. All non-whitelisted URLs are blocked with an audio warning in Hindi: *"सावधान: यह कोई आधिकारिक सरकारी वेबसाइट नहीं है।"* (Warning: This is not an official government website).

### 2.2 End-to-End Encrypted Mentoring Relays
Peer mentors and professors never see a student's personal phone number or home address. All asynchronous voice note exchanges are routed through the backend relay using randomized virtual aliases (`Student_Sondwa_92` ↔ `Mentor_Barwani_04`), with automated speech-to-text toxicity screening before delivery.
