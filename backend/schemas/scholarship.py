# VidyaSetu MP — Deterministic Scholarship Schemas
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class StudentProfileAuditRequest(BaseModel):
    domicile: str = Field("MP", description="State domicile (MP, OTHER)")
    social_category: str = Field(..., description="ST, SC, OBC, GEN")
    gender: str = Field(..., description="MALE, FEMALE, OTHER")
    annual_family_income: float = Field(..., description="Family annual income in INR")
    twelfth_percentage: float = Field(..., description="Class 12 percentage")
    board: Optional[str] = "MP_BOARD" # MP_BOARD | CBSE
    course_level: Optional[str] = "UG" # UG | PG | DIPLOMA
    is_rural: Optional[bool] = True
    distance_from_college_km: Optional[float] = 0.0
    is_rented_room: Optional[bool] = False
    has_sambal_card: Optional[bool] = False

class SchemeMatchItem(BaseModel):
    scheme_id: str
    scheme_name: str
    administering_department: str
    official_portal: str
    financial_benefit: str
    annual_estimated_inr: float
    is_eligible: bool
    match_percentage: int
    ineligibility_reasons: List[str] = []
    required_documents: List[str] = []

class DocumentAuditItem(BaseModel):
    document_name: str
    status: str # OK | WARNING | ACTION_REQUIRED
    guidance_hindi: str
    guidance_english: str

class ScholarshipAuditResponse(BaseModel):
    total_matching_schemes: int
    total_potential_benefit_inr: float
    eligible_schemes: List[SchemeMatchItem]
    ineligible_schemes: List[SchemeMatchItem]
    document_audit_checklist: List[DocumentAuditItem]

class DocVerifyRequest(BaseModel):
    doc_type: str = Field(..., description="SAMAGRA | CASTE_DIGITAL | INCOME | BANK_NPCI")
    doc_value: str

class DocVerifyResponse(BaseModel):
    is_valid: bool
    doc_type: str
    formatted_value: str
    feedback_hindi: str
    feedback_english: str
