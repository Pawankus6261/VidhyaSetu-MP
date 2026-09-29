# VidyaSetu MP Schemas Package
from backend.schemas.auth import (
    DeviceRegisterRequest,
    DeviceRegisterResponse,
    SamagraLoginRequest,
    UserProfileUpdate,
    UserProfileResponse,
)
from backend.schemas.sync import (
    MutationItem,
    SyncPushRequest,
    ServerDeltaItem,
    SyncPushResponse,
)
from backend.schemas.content import (
    LessonSummary,
    CourseDetail,
    UniversityDetail,
)
from backend.schemas.doubt import (
    DoubtResolveRequest,
    DoubtResponse,
    MentorResolveRequest,
    GroundedChunkCitation,
)
from backend.schemas.scholarship import (
    StudentProfileAuditRequest,
    SchemeMatchItem,
    DocumentAuditItem,
    ScholarshipAuditResponse,
    DocVerifyRequest,
    DocVerifyResponse,
)
from backend.schemas.career import (
    CareerRecommendRequest,
    CareerPathwayItem,
    CareerRecommendResponse,
)
from backend.schemas.voice import (
    DialectNormalizeRequest,
    DialectNormalizeResponse,
    VoiceTranscribeRequest,
    VoiceTranscribeResponse,
)

__all__ = [
    "DeviceRegisterRequest",
    "DeviceRegisterResponse",
    "SamagraLoginRequest",
    "UserProfileUpdate",
    "UserProfileResponse",
    "MutationItem",
    "SyncPushRequest",
    "ServerDeltaItem",
    "SyncPushResponse",
    "LessonSummary",
    "CourseDetail",
    "UniversityDetail",
    "DoubtResolveRequest",
    "DoubtResponse",
    "MentorResolveRequest",
    "GroundedChunkCitation",
    "StudentProfileAuditRequest",
    "SchemeMatchItem",
    "DocumentAuditItem",
    "ScholarshipAuditResponse",
    "DocVerifyRequest",
    "DocVerifyResponse",
    "CareerRecommendRequest",
    "CareerPathwayItem",
    "CareerRecommendResponse",
    "DialectNormalizeRequest",
    "DialectNormalizeResponse",
    "VoiceTranscribeRequest",
    "VoiceTranscribeResponse",
]
