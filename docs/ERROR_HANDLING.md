# VidyaSetu MP (विद्यासेतु) — Standardized Error Handling Protocol

## 1. Principles of Dignified Rural Error Messaging

Collegiate students using VidyaSetu MP in rural and tribal districts (Barwani, Jhabua, Mandla, Dindori) must **never encounter technical stack traces, cryptic HTTP status codes, or blank screens**.

Every network or validation failure is mapped into actionable, encouraging vernacular (Devanagari Hindi) and plain English messages that reassure students that **their local work is safe on their device**.

---

## 2. HTTP Status Code Mapping Matrix

| Status Code | Technical Category | Vernacular User Message (हिंदी) | Plain English Message | Offline Behavior |
|---|---|---|---|---|
| **0 / Network Failure** | Connection Lost / 0 kbps | नेटवर्क उपलब्ध नहीं है। आपकी गतिविधि इस डिवाइस पर सुरक्षित है, सिग्नल मिलने पर सिंक होगी। | Network unreachable. Your work is safely saved on this device and will sync on signal. | Automatically holds action in local outbox journal |
| **400** | Validation Error | अमान्य विवरण। कृपया अपनी प्रविष्टि पुनः जांचें। | Invalid data provided. Please check your inputs. | Keeps form populated for inline correction |
| **401** | Unauthorized / Session | सत्र समाप्त। छात्र डिवाइस स्वतः पुनः प्रमाणित हो रहा है... | Session expired. Authenticating your student device... | Re-triggers silent device registration |
| **403** | Permission Restricted | इस छात्र वर्ग हेतु अनुमति सीमित है। | Access restricted for this student tier. | Explains academic criteria |
| **404** | Resource Missing | वांछित पाठ्य सामग्री या योजना उपलब्ध नहीं है। | Requested learning material or scheme not found. | Falls back to local bundled courseware |
| **408** | Timeout | धीमी गति के कारण अनुरोध समय समाप्त। आउटबॉक्स में सुरक्षित। | Low-bandwidth request timed out. Queued for background sync. | Queues in outbox, avoids duplicate submit |
| **422** | Unprocessable Entity | दस्तावेज़ या प्रविष्टि प्रारूप अमान्य है। | Format mismatch in submitted document or field. | Highlights exact invalid field (e.g. Samagra 9 digits) |
| **429** | Rate Limited | अनुरोध सीमा पूर्ण। स्वतः पुनः प्रयास किया जा रहा है... | Bandwidth rate limit reached. Retrying automatically... | Exponential backoff delay |
| **500 / 502 / 503** | Server Outage | विद्यासेतु क्लाउड सर्वर अस्थायी रूप से व्यस्त है। स्थानीय ऑफलाइन कैश से कार्य सुचारू है। | VidyaSetu cloud is temporarily unreachable. Working seamlessly from local offline cache. | Preserves all core learning and player functions |

---

## 3. Five-State Synchronization Indicator

In rural areas, UI messaging clearly distinguishes the 5 phases of data lifecycle:

```text
[1. SAVED LOCALLY]   ──→ Mutation stored in device database with client timestamp
[2. WAITING FOR 2G]  ──→ Displayed in outbox banner: "QUEUED OFFLINE"
[3. SYNCING...]      ──→ Active network burst transmitting batch to cloud
[4. SYNCHRONIZED]    ──→ Server acknowledgement confirmed (marked with checkmark)
[5. RETRY QUEUED]    ──→ Network interrupted during sync; held for next signal burst
```
