# USER_JOURNEY_ANALYSIS.md: Longitudinal Student Lifecycle & Gap Architecture
## Context: Rural & Tribal Undergraduate Students in Madhya Pradesh (B.A., B.Sc., B.Com)

---

## 1. Lifecycle Overview & Chronological Stages

The higher education journey of a rural or tribal student in Madhya Pradesh is characterized by structural friction at every transition. Unlike urban students who benefit from educated family networks, coaching centers, high-speed broadband, and private vehicles, rural students navigate fragile administrative portals and geographical isolation.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STUDENT LIFECYCLE CHRONOLOGICAL PHASES                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: BEFORE COLLEGE (Ages 17–18)                                        │
│ Discovery ──► e-Pravesh Reg. ──► Choice Filling ──► Allotment ──► MPTAAS    │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: DURING COLLEGE (Ages 18–21, Semesters 1 to 6)                      │
│ Commute ──► Lectures ──► Dialect Disconnect ──► Doubts Void ──► Exams       │
├─────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: AFTER COLLEGE (Ages 21–23)                                         │
│ Career Blindspot ──► ESB Recruitment Cycles ──► Agro-Coop / Migration       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Granular Journey Mapping

### Phase 1: Before College (Discovery, Admission & Entitlement Registration)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE                 │ USER ACTIONS                    │ FRICTION POINTS & BREAKDOWN RISKS    │ DIGITAL SOLUTION      │
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 1. Degree & College   │ Clears 12th Board; hears from   │ Limited awareness of degree options; │ Offline Career        │
│    Discovery          │ village peers about Tehsil      │ assumes B.A. is only choice; unaware │ Decision Trees mapping│
│                       │ Government College.             │ of B.Sc. Agri or vocational ITI.     │ 12th streams to goals.│
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 2. e-Pravesh          │ Travels 18 km to Tehsil cyber   │ Cyber cafe operator charges ₹150–₹300;│ Offline Form Data     │
│    Registration       │ cafe to register on MPOnline    │ misspells student's name vs Aadhaar; │ Pre-Fill & Validation │
│                       │ e-Pravesh portal.               │ uploads blurry marksheet scans.      │ Engine.               │
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 3. Document           │ Stands in queue at designated   │ Document verification desk rejects   │ Document Audit        │
│    Verification       │ Help Center (Govt PG College)   │ physical copy due to expired income  │ Checklist with        │
│                       │ for verification.               │ certificate or lack of domicile seal.│ validity alerts.      │
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 4. Seat Allotment     │ Checks allotment list; submits  │ Misses first-round deadline due to   │ SMS / Asynchronous    │
│    & Fee Payment      │ initial token fee (₹1,000–₹2,500│ lack of cell signal at village;      │ Status Alerts on      │
│                       │ or ₹10 for girls/BPL).          │ forced to wait for CLC rounds.       │ allotment rounds.     │
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 5. Welfare & MPTAAS   │ Creates profile on MPTAAS or    │ Aadhaar name mismatch halts DBT;     │ Deterministic Offline │
│    Application        │ Sambal portal for Post-Matric   │ student does not know bank account   │ Rule Matcher + NPCI   │
│                       │ and Awas Sahayata scholarship.  │ is not seeded with NPCI.             │ Seeding Guide.        │
└───────────────────────┴─────────────────────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

### Phase 2: During College (Curricular Learning, Doubts & Retention)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE                 │ USER ACTIONS                    │ FRICTION POINTS & BREAKDOWN RISKS    │ DIGITAL SOLUTION      │
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 6. Daily Commute &    │ Walks 3 km to bus stop; takes   │ In monsoon, unpaved roads wash out;  │ Zero-Byte 1.8MB       │
│    Attendance         │ shared jeep (₹40/day); misses   │ student misses 35% of lectures during│ Audio-Slide Packs     │
│                       │ classes during soy/wheat harvest│ agricultural sowing & harvest season.│ playable at home.     │
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 7. Lecture & Language │ Attends class of 180 students;  │ Textbook is in formal Sanskritized   │ Vernacular Dialect    │
│    Comprehension      │ professor dictates notes rapidly│ Hindi/English; student's cognitive   │ Normalizer & Dual-    │
│                       │ in academic Hindi.              │ language is Nimadi, Bhili, or Gondi. │ Language Glossaries.  │
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 8. Doubt Clearing     │ Does not understand core        │ Intimidated to ask questions in front│ Private Voice/Text    │
│    & Inquiry          │ concepts (e.g. Keynesian Econ,  │ of 180 peers; professor leaves       │ Doubt Outbox with     │
│                       │ Chemical Bonding, Paleolithic). │ immediately for administrative duty. │ Hybrid Curriculum RAG.│
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 9. Study Materials &  │ Visits college library; finds   │ Cannot afford ₹450 textbook; copies  │ Embedded Textbook     │
│    Textbook Access    │ only 3 copies of Hindi Granth   │ notes from senior students containing│ Reference Chunks and  │
│                       │ Academy books (already issued). │ factual errors and outdated syllabi. │ Local Search.         │
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 10. Semester Exam     │ Sits for university exams       │ High failure/backlog rates in 1st    │ Topic-wise Diagnostic │
│     Preparation       │ (Barkatullah/DAVV/RDVV).        │ year; losing year triggers parental  │ Quizzes & Structured  │
│                       │                                 │ pressure to abandon college for labor│ Revision Summaries.   │
└───────────────────────┴─────────────────────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

### Phase 3: After College (Career Pathways, Competitive Exams & Livelihoods)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE                 │ USER ACTIONS                    │ FRICTION POINTS & BREAKDOWN RISKS    │ DIGITAL SOLUTION      │
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 11. Career Horizon    │ Completes B.A. or B.Com; lacks  │ Believes only 2 jobs exist: MP Police│ Local District        │
│     Discovery         │ clear employment direction.     │ Constable or Patwari; unaware of     │ Economic Matrix       │
│                       │                                 │ private or banking alternatives.     │ (BC, Agro, Solar).    │
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 12. Exam Preparation  │ Purchases chaotic 500-page      │ Cannot afford Gwalior/Indore coaching│ Bite-Sized Daily 15-  │
│     (MP ESB / Vyapam) │ pirated PDFs from Telegram;     │ (₹25,000/yr); spends 3-4 years in    │ minute Audio Modules  │
│                       │ attempts Forest Guard/Constable.│ unproductive exam preparation limbo. │ for MP GK & Math.     │
├───────────────────────┼─────────────────────────────────┼──────────────────────────────────────┼───────────────────────┤
│ 13. Economic          │ Either migrates to Gujarat/     │ Underemployed in low-wage precarious │ Certified Local       │
│     Integration       │ Maharashtra as seasonal labor or│ physical labor despite holding a     │ Vocational Roadmaps   │
│                       │ starts farming family plot.     │ university degree.                   │ (IIBF BC, PMFME Agro).│
└───────────────────────┴─────────────────────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## 3. Seven-Dimensional Gap Analysis & Digital Solvability

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SYSTEMIC GAP ANALYSIS & SOLVABILITY                   │
├───────────────────┬───────────────────────────────────┬─────────────────────┤
│ GAP DIMENSION     │ SPECIFIC GROUND MANIFESTATION     │ CAN DIGITAL SOLVE?  │
├───────────────────┼───────────────────────────────────┼─────────────────────┤
│ 1. Information    │ Unaware of MPTAAS/Sambal schemes, │ ✅ 100% SOLVABLE:   │
│    Gaps           │ eligibility rules, and deadlines. │ Offline Rule Engine │
├───────────────────┼───────────────────────────────────┼─────────────────────┤
│ 2. Technology     │ 40 kbps daytime speeds, 0 kbps at │ ✅ 100% SOLVABLE:   │
│    Gaps           │ home; video streaming fails.      │ 1.8MB .vsmp format  │
├───────────────────┼───────────────────────────────────┼─────────────────────┤
│ 3. Language       │ Formal Sanskritized Hindi/English │ ✅ 100% SOLVABLE:   │
│    Gaps           │ textbooks vs. spoken dialect.     │ Dialect Normalizer  │
├───────────────────┼───────────────────────────────────┼─────────────────────┤
│ 4. Guidance /     │ 1:180 faculty ratios; absence of  │ 🔶 PARTIAL / HYBRID:│
│    Mentorship     │ educated elders in home village.  │ AI Triage + Peers   │
├───────────────────┼───────────────────────────────────┼─────────────────────┤
│ 5. Access Gaps    │ 30-50 km travel distance to       │ 🔶 PARTIAL: Digital │
│    (Physical)     │ college; lack of public buses.    │ enables remote study│
├───────────────────┼───────────────────────────────────┼─────────────────────┤
│ 6. Trust Gaps     │ Fear of digital fraud, corrupt    │ ✅ 100% SOLVABLE:   │
│    (Behavioral)   │ forms, or leaking family data.    │ Privacy / Sandboxing│
├───────────────────┼───────────────────────────────────┼─────────────────────┤
│ 7. Economic Gaps  │ Daily family poverty competing    │ ❌ CANNOT SOLVE:    │
│    (Systemic)     │ with study time; farm labor need. │ Mitigate via aid    │
└───────────────────┴───────────────────────────────────┴─────────────────────┘
```
