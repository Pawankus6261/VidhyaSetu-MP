# VidyaSetu MP — Scholarship Master Schemes Model
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, Boolean, DateTime
from backend.database import Base

class ScholarshipScheme(Base):
    __tablename__ = "scholarship_schemes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scheme_code = Column(String(64), unique=True, nullable=False, index=True) # e.g., 'MP_ST_POST_MATRIC_2026'
    title_hindi = Column(String(256), nullable=False)
    title_english = Column(String(256), nullable=False)
    administering_department = Column(String(256), nullable=False)
    official_portal_url = Column(String(512), nullable=False)
    max_annual_benefit_inr = Column(Float, nullable=False)
    financial_benefit_desc = Column(Text, nullable=False)
    eligibility_criteria_json = Column(Text, nullable=False) # JSON encoded eligibility rules
    required_documents_json = Column(Text, nullable=False)   # JSON encoded required documents list
    application_deadline_date = Column(String(32), nullable=True)
    is_active = Column(Boolean, default=True)
    last_verified_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
