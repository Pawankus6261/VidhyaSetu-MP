# SCHOLARSHIP_ENGINE.md: Deterministic Edge Welfare & Entitlement Engine

---

## 1. Why Deterministic Logic Over Generative AI?

Applying generative AI to government scholarship matching is an anti-pattern. If an LLM misquotes an income ceiling by ₹10,000, suggests an incorrect caste code, or quotes an outdated application deadline, a rural student can permanently lose ₹25,000 in tuition aid and drop out of college.

VidyaSetu MP implements a **Deterministic Client-Side Rule Engine** executing against a cryptographically signed, versioned catalog of 48 MP State and Central Government welfare schemes.

---

## 2. Rule Evaluation Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 OFFLINE SCHOLARSHIP ELIGIBILITY MATCHING                    │
└─────────────────────────────────────────────────────────────────────────────┘
  Cached Local Student Attributes (SQLite):
  - State Domicile: Madhya Pradesh
  - Domicile District: Barwani (Rural Area: True)
  - Social Category: ST (Scheduled Tribe)
  - Gender: Female
  - Current Enrolment: B.Sc. 1st Year (Biology)
  - Class 12 Score: 68.4% (MP Board)
  - Family Annual Income: ₹72,000 (BPL Card: True)
  - Living Arrangement: Rented Room in Tehsil Town (Distance from home: 24 km)
                               │
                               ▼
        [Deterministic Rule Engine (Local JSON-LD Parser)]
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
  [SCHEME MATCH #1]      [SCHEME MATCH #2]      [SCHEME MATCH #3]
  MP Post-Matric (ST)    Awas Sahayata Yojana   Gaon Ki Beti Yojana
  • Tuition: 100% Fees   • Room Rent: ₹1,500/mo • Incentive: ₹5,000/yr
  • Maintenance: ₹550/mo • Portal: MPTAAS       • Portal: MP Schol 2.0
  • Portal: MPTAAS       • Status: 100% Match   • Status: 100% Match
  • Status: 100% Match
                               │
                               ▼
  [Synthesized Action Plan Generated Offline]
  "सुनीता, आप प्रति वर्ष कुल ₹28,000 की 3 योजनाओं के लिए पात्र हैं!"
                               │
                               ▼
  [Automated Pre-Submission Document Audit]
  [OK] Samagra Member ID (Validated format: 9 digits)
  [OK] Digital Caste Certificate (Validated format: 16 digits)
  [WARN] Income Certificate (Expired on 31-March-2026 - Needs Tehsil Renewal!)
  [ACTION] Visit Post Office / Bank to verify NPCI Direct Benefit Transfer (DBT) linking!
```

---

## 3. Core MP Welfare Schemes Specifications

### 3.1 MPTAAS Post-Matric Scholarship for ST Students
* **Administering Body:** Tribal Affairs Department, Govt. of MP.
* **Official URL:** `https://www.tribal.mp.gov.in/MPTAAS`
* **Eligibility Rule:**
  * `domicile == "MP"`
  * `category == "ST"`
  * `family_income <= 250000` (₹2.5 Lakh/year)
  * `course_level in ["UG", "PG", "DIPLOMA", "ITI", "PHD"]`
* **Entitlement:** 100% tuition and institutional fees reimbursed directly to college; monthly maintenance allowance credited via DBT to student.

### 3.2 Awas Sahayata Yojana (Tribal Housing Assistance)
* **Administering Body:** Tribal Affairs Department, Govt. of MP.
* **Official URL:** `https://www.tribal.mp.gov.in/MPTAAS`
* **Eligibility Rule:**
  * `category in ["ST", "SC"]`
  * `distance_from_village >= 10.0` km
  * `college_hostel_allotted == False`
  * `is_rented_room == True`
* **Entitlement:**
  * Tehsil towns: ₹1,000 / month
  * District headquarters: ₹1,500 / month
  * Tier-1 cities (Bhopal, Indore, Jabalpur, Gwalior): ₹2,000 / month

### 3.3 Gaon Ki Beti Yojana
* **Administering Body:** Higher Education Department, Govt. of MP.
* **Official URL:** `https://scholarshipportal.mp.nic.in`
* **Eligibility Rule:**
  * `gender == "FEMALE"`
  * `residence == "RURAL"`
  * `twelfth_percentage >= 60.0`
  * `course_level == "UG"`
* **Entitlement:** ₹500/month for 10 months (₹5,000/year).

### 3.4 Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)
* **Administering Body:** Technical & Higher Education Dept, Govt. of MP.
* **Eligibility Rule:**
  * `domicile == "MP"`
  * `family_income <= 600000` (₹6.0 Lakh/year)
  * `(board == "MP_BOARD" and twelfth_percentage >= 70.0) or (board == "CBSE" and twelfth_percentage >= 85.0)`
* **Entitlement:** 100% tuition coverage across Government, Aided, and recognized Private Professional colleges (Engineering, Medical, Law, Degree).

---

## 4. Document Audit & Discrepancy Prevention Checklist
Before a student submits on official government portals, VidyaSetu audits:
1. **Name Matching:** Compares character-by-character string similarity between Aadhaar and High School Marksheet using Levenshtein distance. Flags any prefix discrepancies (e.g., "Km.", "Kumari", middle name omissions).
2. **NPCI Bank Seeding Verification:** Provides an interactive guide on how to send an SMS or dial `*99*99*1#` to confirm Aadhaar-bank account mapping.
3. **Certificate Expiry Warnings:** Tracks validity periods of digital income certificates (valid for 3 years in MP unless family landholding changes).
