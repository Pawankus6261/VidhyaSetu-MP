# VidyaSetu MP — Academic Doubt Resolution Schemas
from typing import Optional, List
from pydantic import BaseModel, Field

class DoubtResolveRequest(BaseModel):
    query_text: str = Field(..., description="Academic question text or transcribed speech")
    subject_code: Optional[str] = "HISTORY_101"
    university_code: Optional[str] = "DAVV_INDORE"
    language_hint: Optional[str] = "hi"
    client_mutation_id: Optional[str] = None

class GroundedChunkCitation(BaseModel):
    source_book_title: str
    page_number: int
    chapter_unit: str
    similarity_score: float

class DoubtResponse(BaseModel):
    ticket_id: str
    query_raw: str
    query_normalized: str
    detected_dialect: str
    answer_text: str
    confidence_score: float
    status: str # RESOLVED_AI | ESCALATED_FACULTY
    escalated_to_mentor: bool
    citation_source: Optional[str] = None
    grounded_citations: List[GroundedChunkCitation] = []

class MentorResolveRequest(BaseModel):
    mentor_id: str
    resolution_text: str
    voice_note_uri: Optional[str] = None
