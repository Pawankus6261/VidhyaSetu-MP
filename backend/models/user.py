# VidyaSetu MP — User & Identity Model (DPDP Act 2023 Compliant)
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone_hash = Column(String(64), unique=True, nullable=False, index=True) # SHA-256 hash of mobile
    samagra_id = Column(String(16), unique=True, nullable=True, index=True)  # 9-digit MP Samagra Member ID
    full_name = Column(String(128), nullable=False)
    gender = Column(String(16), nullable=False) # MALE, FEMALE, OTHER
    social_category = Column(String(8), nullable=False, index=True) # ST, SC, OBC, GEN
    tribal_community = Column(String(64), nullable=True) # Bhil, Gond, Baiga, Sahariya, Bharia, etc.
    district = Column(String(64), nullable=False, index=True)
    tehsil = Column(String(64), nullable=False)
    college_code = Column(String(32), nullable=False, index=True) # e-Pravesh assigned college code
    course_enrolled = Column(String(32), nullable=False) # BA, BSC, BCOM, MA, MSC, MCOM
    year_of_study = Column(Integer, nullable=False, default=1)
    family_annual_income = Column(Float, nullable=True)
    twelfth_percentage = Column(Float, nullable=True)
    is_rural = Column(Boolean, default=True)
    preferred_dialect = Column(String(32), default="hi") # hi, nimadi, malvi, bundeli, bagheli, bhili, gondi
    device_fingerprint_hash = Column(String(64), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
