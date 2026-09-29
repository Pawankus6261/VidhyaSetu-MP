# VidyaSetu MP — Hyperlocal Rural Career Router
from typing import List
from fastapi import APIRouter
from backend.schemas.career import (
    CareerRecommendRequest,
    CareerRecommendResponse,
    CareerPathwayItem,
)
from backend.services.career_service import CareerService, MASTER_PATHWAYS

router = APIRouter(prefix="/api/v1/career", tags=["Hyperlocal Rural Careers"])

@router.get("/pathways", response_model=List[CareerPathwayItem])
def list_master_pathways():
    """Lists the 5 Realistic Rural Economic Horizons for collegiate youth in Madhya Pradesh."""
    return [
        CareerPathwayItem(
            horizon_id=p["horizon_id"],
            horizon_name=p["horizon_name"],
            title=p["title"],
            description=p["description"],
            target_role=p["target_role"],
            monthly_earning_estimate=p["monthly_earning_estimate"],
            prerequisites=p["prerequisites"],
            offline_modules=p["offline_modules"],
            district_specialization=None
        )
        for p in MASTER_PATHWAYS
    ]

@router.post("/recommend", response_model=CareerRecommendResponse)
def get_career_recommendation(request: CareerRecommendRequest):
    """
    Executes context-aware decision tree mapping student degree (B.A., B.Sc., B.Com)
    and district economic clusters (Barwani, Jhabua, Dindori, Sagar, etc.) to viable livelihoods.
    """
    return CareerService.recommend(request)
