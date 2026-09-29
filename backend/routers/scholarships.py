# VidyaSetu MP — Deterministic Scholarship Router
from typing import List
from fastapi import APIRouter, HTTPException
from backend.schemas.scholarship import (
    StudentProfileAuditRequest,
    ScholarshipAuditResponse,
    DocVerifyRequest,
    DocVerifyResponse,
)
from backend.services.scholarship_service import ScholarshipService, MP_SCHOLARSHIP_SCHEMES

router = APIRouter(prefix="/api/v1/scholarships", tags=["Scholarships & Welfare Schemes"])

@router.get("/catalog")
def get_scholarship_catalog():
    """Returns official master catalog of active MP State and Central Government welfare schemes."""
    return MP_SCHOLARSHIP_SCHEMES

@router.post("/audit", response_model=ScholarshipAuditResponse)
def audit_student_eligibility(profile: StudentProfileAuditRequest):
    """
    Executes deterministic mathematical and regulatory rules against student profile attributes.
    Returns:
    - Exactly matched schemes with annual benefit in INR
    - Ineligible schemes with concrete regulatory reasons
    - Pre-submission document audit checklist (Samagra, Digital Caste, Income, NPCI DBT)
    """
    return ScholarshipService.evaluate_student(profile)

@router.post("/verify-doc", response_model=DocVerifyResponse)
def verify_document_format(request: DocVerifyRequest):
    """
    Validates structural integrity of critical civic documents:
    - Samagra Member ID (9 digits)
    - Digital Caste Certificate (16 digits / RS format)
    - Bank Account Number (NPCI seeding validity check)
    """
    return ScholarshipService.verify_document_format(request.doc_type, request.doc_value)
