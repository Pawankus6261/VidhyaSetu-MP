# VidyaSetu MP — Authentication & User Schemas
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class DeviceRegisterRequest(BaseModel):
    device_fingerprint_hash: str = Field(..., description="Unique hardware hash or client UUID")
    preferred_dialect: Optional[str] = "hi"
    district: Optional[str] = "Barwani"
    tehsil: Optional[str] = "Pati"
    course_enrolled: Optional[str] = "BA"
    social_category: Optional[str] = "ST"

class DeviceRegisterResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    is_new_user: bool
    expires_in_days: int = 365

class SamagraLoginRequest(BaseModel):
    samagra_id: str = Field(..., min_length=9, max_length=9, description="9-digit MP Samagra Member ID")
    phone_hash: Optional[str] = None
    device_fingerprint_hash: Optional[str] = None

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    gender: Optional[str] = None
    social_category: Optional[str] = None
    tribal_community: Optional[str] = None
    district: Optional[str] = None
    tehsil: Optional[str] = None
    college_code: Optional[str] = None
    course_enrolled: Optional[str] = None
    year_of_study: Optional[int] = None
    family_annual_income: Optional[float] = None
    twelfth_percentage: Optional[float] = None
    is_rural: Optional[bool] = None
    preferred_dialect: Optional[str] = None

class UserProfileResponse(BaseModel):
    id: str
    phone_hash: str
    samagra_id: Optional[str]
    full_name: str
    gender: str
    social_category: str
    tribal_community: Optional[str]
    district: str
    tehsil: str
    college_code: str
    course_enrolled: str
    year_of_study: int
    family_annual_income: Optional[float]
    twelfth_percentage: Optional[float]
    is_rural: bool
    preferred_dialect: str

    model_config = ConfigDict(from_attributes=True)
