# VidyaSetu MP — Hyperlocal Career Schemas
from typing import List, Optional
from pydantic import BaseModel, Field

class CareerRecommendRequest(BaseModel):
    district: str = Field(..., description="Student home district (e.g. Barwani, Jhabua, Dindori, Sagar, Alirajpur)")
    degree_stream: str = Field("BA", description="BA, BSC, BCOM")
    can_migrate_urban: bool = Field(False, description="Can student afford migration to Indore/Bhopal")
    earning_time_horizon: str = Field("IMMEDIATE", description="IMMEDIATE (<6m) | MEDIUM_TERM (6-18m) | LONG_TERM (18-36m)")

class CareerPathwayItem(BaseModel):
    horizon_id: int
    horizon_name: str
    title: str
    description: str
    target_role: str
    monthly_earning_estimate: str
    prerequisites: List[str]
    offline_modules: List[str]
    district_specialization: Optional[str] = None

class CareerRecommendResponse(BaseModel):
    student_district: str
    degree_stream: str
    can_migrate: bool
    recommended_pathways: List[CareerPathwayItem]
    district_economic_context: str
    immediate_action_step: str
