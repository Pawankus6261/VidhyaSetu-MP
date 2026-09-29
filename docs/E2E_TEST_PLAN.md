# VidyaSetu MP (विद्यासेतु) — End-to-End Test Plan & Verification Matrix

## 1. Complete Student Journey Test Flow

```text
[1. Install & Launch App]
       ↓
[2. Device Auto-Registration via POST /api/v1/auth/register-device]
       ↓
[3. Open LearnScreen (पाठशाला)]
       ├── View Ancient History Module (Davv Indore)
       └── Tap "Download .VSMP" → Resumable download finishes (17.6 KB cached)
       ↓
[4. Enable Airplane Mode (0 kbps Network Emulation)]
       ├── App does NOT show blank screen or crash
       ├── Open Indus Valley Civilization vector lecture
       ├── Play Audio & scrub through SVG vector slides with bilingual transcript
       ├── Complete 3-Question Quiz & Submit Score
       └── Progress is stored locally; mutation enqueued in outbox
       ↓
[5. Open DoubtScreen in Offline Mode]
       ├── Record a voice question with real hardware microphone (Opus 14kbps)
       ├── Tap "Send Voice Doubt"
       └── Status displays "QUEUED FOR 2G BURST SYNC (0 kbps)"
       ↓
[6. Open ScholarshipScreen in Offline Mode]
       ├── Adjust family income to ₹72,000 and select ST category
       ├── Local deterministic engine instantly matches ₹84,000 in unlocked welfare aid
       └── Enter 9-digit Samagra ID (194829104) and tap "Verify"
       ↓
[7. Open CareerScreen]
       └── Browse 5 Rural Economic Horizons (BC Sakhi, Forest Services, Agri-FPO)
       ↓
[8. Disable Airplane Mode (Restore 2G/WiFi Network)]
       ├── App detects network restoration
       ├── SyncEngine automatically triggers POST /api/v1/sync/push
       ├── Server returns acknowledged mutation IDs
       ├── Outbox status updates to "ALL SYNCHRONIZED"
       └── Doubt card updates with grounded curriculum citation
```

---

## 2. Low-Resource Fault Injection Test Suites

### Suite A: 0 kbps Zero-Internet Validation (Airplane Mode)
* **Pre-condition:** Disable Wi-Fi and Mobile Data.
* **Test:**
  1. Kill app process and relaunch.
  2. Verify splash screen dismisses and loads cached student profile without network timeout.
  3. Verify `.vsmp` player plays audio, renders slides, and submits quiz.
  4. Verify scholarship eligibility calculation is instantaneous.
* **Expected Result:** PASS. No spinners, no blank screen, zero network calls.

### Suite B: Network Recovery & Outbox Drain
* **Pre-condition:** Start in offline mode with 3 pending mutations (quiz score, text doubt, profile edit).
* **Test:** Restore internet connection.
* **Expected Result:**
  1. `AppContext` network state switches to `> 1 Mbps ऑनलाइन`.
  2. `SyncEngine` auto-triggers `POST /api/v1/sync/push`.
  3. Server acknowledges all 3 IDs atomically.
  4. Pending count transitions from `3` -> `0`.
  5. No duplicate records in database (`X-Idempotency-Key` deduplication).

### Suite C: Fleeting 2G Signal Burst (~40 kbps Simulation)
* **Pre-condition:** Chrome DevTools / Network Link Conditioner set to "Slow 2G (40 kbps, 2000ms RTT)".
* **Test:** Submit a text doubt.
* **Expected Result:**
  1. API Client timeout handles 9s latency budget.
  2. GZip/Brotli payload (< 1.5 KB) transmits within the burst.
  3. If connection drops before response arrives, mutation stays `PENDING` in outbox and retries safely on next burst.

### Suite D: Backend Outage Resilience
* **Pre-condition:** Terminate FastAPI server process.
* **Test:** Navigate between all 5 screens and submit learning actions.
* **Expected Result:**
  1. App notifies student: *"VidyaSetu cloud server is temporarily unreachable. Working seamlessly from local offline cache."*
  2. Student can continue reading, listening, and testing without disruption.
