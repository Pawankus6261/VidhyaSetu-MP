# VidyaSetu MP — Deterministic Scholarship Evaluation Engine
import json
from typing import List, Dict, Any, Tuple
from backend.schemas.scholarship import (
    StudentProfileAuditRequest,
    SchemeMatchItem,
    DocumentAuditItem,
    ScholarshipAuditResponse,
    DocVerifyResponse,
)

# Core Master Catalog of MP Welfare Schemes
MP_SCHOLARSHIP_SCHEMES = [
    {
        "scheme_id": "MP_ST_POST_MATRIC_2026",
        "scheme_name": "Post-Matric Scholarship for ST Students (पोस्ट मैट्रिक छात्रवृत्ति - अजजा)",
        "administering_department": "Tribal Affairs Department, Government of Madhya Pradesh",
        "official_portal": "https://www.tribal.mp.gov.in/MPTAAS",
        "financial_benefit": "100% Tuition Fee Reimbursement + ₹550/month maintenance allowance",
        "annual_estimated_inr": 18000,
        "eligibility_rules": {
            "domicile": ["MP"],
            "categories": ["ST"],
            "max_family_income_inr": 250000,
            "minimum_academic_percentage": 33.0,
            "eligible_courses": ["BA", "BSC", "BCOM", "MA", "MSC", "MCOM", "DIPLOMA", "ITI", "PHD"]
        },
        "required_documents": [
            "Samagra Member ID (9 digits)",
            "Digital ST Caste Certificate (16 digits)",
            "Income Certificate (< ₹2.5 Lakh/yr)",
            "College Admission Allotment Letter",
            "Aadhaar-Linked Bank Account (NPCI DBT Seeded)"
        ]
    },
    {
        "scheme_id": "MP_SC_POST_MATRIC_2026",
        "scheme_name": "Post-Matric Scholarship for SC Students (पोस्ट मैट्रिक छात्रवृत्ति - अजा)",
        "administering_department": "Scheduled Caste Welfare Department, Government of Madhya Pradesh",
        "official_portal": "https://www.tribal.mp.gov.in/MPTAAS",
        "financial_benefit": "100% Tuition Fee Reimbursement + Maintenance Allowance",
        "annual_estimated_inr": 18000,
        "eligibility_rules": {
            "domicile": ["MP"],
            "categories": ["SC"],
            "max_family_income_inr": 250000,
            "minimum_academic_percentage": 33.0,
            "eligible_courses": ["BA", "BSC", "BCOM", "MA", "MSC", "MCOM", "DIPLOMA", "ITI", "PHD"]
        },
        "required_documents": [
            "Samagra Member ID (9 digits)",
            "Digital SC Caste Certificate (16 digits)",
            "Income Certificate (< ₹2.5 Lakh/yr)",
            "College Admission Slip",
            "NPCI Seeded Bank Account"
        ]
    },
    {
        "scheme_id": "MP_OBC_POST_MATRIC_2026",
        "scheme_name": "Post-Matric Scholarship for OBC Students (अन्य पिछड़ा वर्ग छात्रवृत्ति)",
        "administering_department": "Backward Classes & Minorities Welfare Department, MP",
        "official_portal": "https://scholarshipportal.mp.nic.in",
        "financial_benefit": "100% Govt Tuition Fee + Maintenance Allowance",
        "annual_estimated_inr": 14000,
        "eligibility_rules": {
            "domicile": ["MP"],
            "categories": ["OBC"],
            "max_family_income_inr": 300000,
            "minimum_academic_percentage": 33.0,
            "eligible_courses": ["BA", "BSC", "BCOM", "MA", "MSC", "MCOM", "DIPLOMA", "ITI"]
        },
        "required_documents": [
            "Samagra Member ID",
            "Non-Creamy Layer OBC Certificate",
            "Valid Income Certificate (< ₹3 Lakh)",
            "College Admission Fee Receipt"
        ]
    },
    {
        "scheme_id": "MP_AWAS_SAHAYATA_TRIBAL_2026",
        "scheme_name": "Awas Sahayata Yojana (आवास सहायता योजना — ग्रामीण एवं दूरस्थ छात्र)",
        "administering_department": "Tribal Affairs Department, Government of Madhya Pradesh",
        "official_portal": "https://www.tribal.mp.gov.in/MPTAAS",
        "financial_benefit": "Monthly room rental support (₹1,000–₹2,000/month depending on city tier)",
        "annual_estimated_inr": 15000,
        "eligibility_rules": {
            "domicile": ["MP"],
            "categories": ["ST", "SC"],
            "min_distance_km": 10.0,
            "is_rented_room": True,
            "eligible_courses": ["BA", "BSC", "BCOM", "MA", "MSC", "MCOM", "DIPLOMA", "ITI"]
        },
        "required_documents": [
            "Rent Agreement / House Owner Receipt",
            "College Verification of Hostel Non-Availability",
            "Domicile Certificate proving distance > 10 km",
            "Samagra ID and Caste Certificate"
        ]
    },
    {
        "scheme_id": "MP_GAON_KI_BETI_2026",
        "scheme_name": "Gaon Ki Beti Yojana (गांव की बेटी योजना — ग्रामीण मेधावी छात्रा प्रोत्साहन)",
        "administering_department": "Department of Higher Education, Govt of Madhya Pradesh",
        "official_portal": "https://scholarshipportal.mp.nic.in",
        "financial_benefit": "₹500/month for 10 academic months (Total ₹5,000/year)",
        "annual_estimated_inr": 5000,
        "eligibility_rules": {
            "domicile": ["MP"],
            "categories": ["ST", "SC", "OBC", "GEN"],
            "gender": ["FEMALE"],
            "is_rural": True,
            "minimum_academic_percentage": 60.0,
            "eligible_courses": ["BA", "BSC", "BCOM", "MA", "MSC", "MCOM"]
        },
        "required_documents": [
            "Village Daughter (गांव की बेटी) Certificate from Gram Panchayat / Janpad",
            "12th Marksheet with First Division (>=60%)",
            "College Enrollment Receipt",
            "Samagra ID"
        ]
    },
    {
        "scheme_id": "MP_SAMBAL_SHIKSHA_PROTSAHAN_2026",
        "scheme_name": "Mukhyamantri Jan Kalyan Shiksha Protsahan Yojana (संबल 2.0 शिक्षा प्रोत्साहन)",
        "administering_department": "Labour Department & Higher Education Department, Govt of MP",
        "official_portal": "https://medhavikalyan.mp.gov.in",
        "financial_benefit": "100% Full Admission & Tuition Fee Waiver in Govt & Aided Colleges",
        "annual_estimated_inr": 25000,
        "eligibility_rules": {
            "domicile": ["MP"],
            "categories": ["ST", "SC", "OBC", "GEN"],
            "parent_sambal_card_required": True,
            "minimum_academic_percentage": 33.0,
            "eligible_courses": ["BA", "BSC", "BCOM", "MA", "MSC", "MCOM", "BE", "MBBS", "POLYTECHNIC", "ITI"]
        },
        "required_documents": [
            "Parent's Valid Sambal 2.0 Registration Number",
            "Samagra Family & Member ID",
            "10th & 12th Marksheets",
            "College Admission Allotment Letter",
            "Bank Account Details"
        ]
    },
    {
        "scheme_id": "MP_MMVY_MEDHAVI_2026",
        "scheme_name": "Mukhyamantri Medhavi Vidyarthi Yojana (MMVY मेधावी विद्यार्थी योजना)",
        "administering_department": "Technical & Higher Education Department, Govt of MP",
        "official_portal": "https://medhavikalyan.mp.gov.in",
        "financial_benefit": "Full Tuition Fees Coverage in Degree / Engineering / Medical Institutions",
        "annual_estimated_inr": 35000,
        "eligibility_rules": {
            "domicile": ["MP"],
            "categories": ["ST", "SC", "OBC", "GEN"],
            "max_family_income_inr": 600000,
            "mp_board_min_percent": 70.0,
            "cbse_board_min_percent": 85.0,
            "eligible_courses": ["BA", "BSC", "BCOM", "BE", "BTECH", "MBBS", "LLB"]
        },
        "required_documents": [
            "Class 12th Marksheet (>=70% MP Board or >=85% CBSE)",
            "Income Certificate below ₹6 Lakh",
            "MP Domicile Certificate",
            "Samagra ID and Aadhaar"
        ]
    }
]

class ScholarshipService:
    @classmethod
    def evaluate_student(cls, profile: StudentProfileAuditRequest) -> ScholarshipAuditResponse:
        eligible_schemes = []
        ineligible_schemes = []
        total_benefit = 0.0

        for scheme in MP_SCHOLARSHIP_SCHEMES:
            rules = scheme["eligibility_rules"]
            reasons = []
            is_eligible = True

            # Domicile Check
            if profile.domicile.upper() not in [d.upper() for d in rules.get("domicile", ["MP"])]:
                is_eligible = False
                reasons.append("केवल मध्य प्रदेश के मूल निवासियों के लिए (MP Domicile required)")

            # Social Category Check
            if rules.get("categories") and profile.social_category.upper() not in [c.upper() for c in rules["categories"]]:
                is_eligible = False
                reasons.append(f"यह योजना {', '.join(rules['categories'])} वर्ग के लिए है")

            # Gender Check
            if rules.get("gender") and profile.gender.upper() not in [g.upper() for g in rules["gender"]]:
                is_eligible = False
                reasons.append("यह योजना केवल महिला छात्राओं के लिए है (Female students only)")

            # Income Check
            if "max_family_income_inr" in rules:
                if profile.annual_family_income > rules["max_family_income_inr"]:
                    is_eligible = False
                    reasons.append(f"पारिवारिक आय ₹{rules['max_family_income_inr']:,} से अधिक है")

            # Academic Percentage Check
            if "minimum_academic_percentage" in rules:
                if profile.twelfth_percentage < rules["minimum_academic_percentage"]:
                    is_eligible = False
                    reasons.append(f"कक्षा 12वीं में न्यूनतम {rules['minimum_academic_percentage']}% अंक आवश्यक हैं")

            # MMVY Board Split Percentage Check
            if "mp_board_min_percent" in rules and "cbse_board_min_percent" in rules:
                is_mp = profile.board == "MP_BOARD"
                cutoff = rules["mp_board_min_percent"] if is_mp else rules["cbse_board_min_percent"]
                if profile.twelfth_percentage < cutoff:
                    is_eligible = False
                    reasons.append(f"कक्षा 12वीं में {cutoff}% अंक आवश्यक हैं ({profile.board})")

            # Rural Check
            if rules.get("is_rural") and not profile.is_rural:
                is_eligible = False
                reasons.append("यह योजना केवल ग्रामीण क्षेत्र की बालिकाओं के लिए है")

            # Distance Check (Awas Sahayata)
            if rules.get("min_distance_km") and profile.distance_from_college_km < rules["min_distance_km"]:
                is_eligible = False
                reasons.append(f"कॉलेज से गृहग्राम की दूरी {rules['min_distance_km']} किमी से अधिक होनी चाहिए")

            # Sambal Card Check
            if rules.get("parent_sambal_card_required") and not profile.has_sambal_card:
                is_eligible = False
                reasons.append("अभिभावक का वैध संबल 2.0 पंजीयन आवश्यक है")

            match_pct = 100 if is_eligible else max(20, 100 - (len(reasons) * 25))

            item = SchemeMatchItem(
                scheme_id=scheme["scheme_id"],
                scheme_name=scheme["scheme_name"],
                administering_department=scheme["administering_department"],
                official_portal=scheme["official_portal"],
                financial_benefit=scheme["financial_benefit"],
                annual_estimated_inr=scheme["annual_estimated_inr"],
                is_eligible=is_eligible,
                match_percentage=match_pct,
                ineligibility_reasons=reasons,
                required_documents=scheme["required_documents"]
            )

            if is_eligible:
                eligible_schemes.append(item)
                total_benefit += scheme["annual_estimated_inr"]
            else:
                ineligible_schemes.append(item)

        # Document Audit Checklist
        checklist = [
            DocumentAuditItem(
                document_name="Samagra Member ID (समग्र सदस्य आईडी)",
                status="OK",
                guidance_hindi="9 अंकों की सदस्य समग्र आईडी आवश्यक है।",
                guidance_english="9-digit individual Samagra ID required."
            ),
            DocumentAuditItem(
                document_name="Digital Caste Certificate (डिजिटल जाति प्रमाण पत्र)",
                status="OK" if profile.social_category != "GEN" else "WARNING",
                guidance_hindi="लोक सेवा केंद्र द्वारा जारी 16 अंकों का RS/ क्रमांक वाला प्रमाण पत्र।",
                guidance_english="16-digit RS/ barcoded certificate from Lok Seva Kendra."
            ),
            DocumentAuditItem(
                document_name="Income Certificate (आय प्रमाण पत्र)",
                status="WARNING" if profile.annual_family_income > 200000 else "OK",
                guidance_hindi="वित्तीय वर्ष 2025-26 के लिए सक्षम अधिकारी द्वारा जारी आय प्रमाण पत्र।",
                guidance_english="Valid annual income certificate issued for current financial year."
            ),
            DocumentAuditItem(
                document_name="NPCI Direct Benefit Transfer (DBT) Linking",
                status="ACTION_REQUIRED",
                guidance_hindi="बैंक खाते में आधार NPCI मैपिंग आवश्यक है अन्यथा छात्रवृत्ति रुक जाएगी।",
                guidance_english="Verify Aadhaar-NPCI active mandate at bank branch or post office."
            )
        ]

        return ScholarshipAuditResponse(
            total_matching_schemes=len(eligible_schemes),
            total_potential_benefit_inr=total_benefit,
            eligible_schemes=eligible_schemes,
            ineligible_schemes=ineligible_schemes,
            document_audit_checklist=checklist
        )

    @classmethod
    def verify_document_format(cls, doc_type: str, doc_value: str) -> DocVerifyResponse:
        val = doc_value.strip().replace(" ", "").replace("-", "")
        doc_upper = doc_type.upper()

        if doc_upper == "SAMAGRA":
            is_valid = bool(val.isdigit() and len(val) == 9)
            return DocVerifyResponse(
                is_valid=is_valid,
                doc_type="SAMAGRA",
                formatted_value=val,
                feedback_hindi="वैध 9-अंकीय समग्र आईडी" if is_valid else "समग्र आईडी ठीक 9 अंकों की होनी चाहिए",
                feedback_english="Valid 9-digit Samagra ID" if is_valid else "Samagra ID must be exactly 9 digits"
            )

        elif doc_upper == "CASTE_DIGITAL":
            # MP Digital Caste Certificates typically: RS/412/0101/... or 16 digits
            is_valid = bool(len(val) >= 12 and (val.isdigit() or val.startswith("RS")))
            return DocVerifyResponse(
                is_valid=is_valid,
                doc_type="CASTE_DIGITAL",
                formatted_value=val,
                feedback_hindi="वैध डिजिटल जाति प्रमाण पत्र प्रारूप" if is_valid else "डिजिटल जाति प्रमाण पत्र 16 अंकों का या RS/ से शुरू होना चाहिए",
                feedback_english="Valid digital caste format" if is_valid else "Digital caste certificate must be 16 digits or start with RS/"
            )

        elif doc_upper == "BANK_NPCI":
            # Account number 9-18 digits
            is_valid = bool(val.isdigit() and 9 <= len(val) <= 18)
            return DocVerifyResponse(
                is_valid=is_valid,
                doc_type="BANK_NPCI",
                formatted_value=val,
                feedback_hindi="वैध बैंक खाता प्रारूप (NPCI सक्रियता आवश्यक)" if is_valid else "अमान्य बैंक खाता संख्या",
                feedback_english="Valid account format (Ensure NPCI active)" if is_valid else "Invalid bank account number"
            )

        return DocVerifyResponse(
            is_valid=True,
            doc_type=doc_type,
            formatted_value=doc_value,
            feedback_hindi="प्रारूप स्वीकार्य है",
            feedback_english="Format accepted"
        )
