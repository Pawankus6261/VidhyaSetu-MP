# VidyaSetu MP — Academic Doubt Tickets & Mentoring Escalation
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, DateTime
from backend.database import Base

class DoubtTicket(Base):
    __tablename__ = "doubt_tickets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True, index=True)
    client_mutation_id = Column(String(64), unique=True, nullable=False, index=True) # Idempotency UUID
    lesson_id = Column(String(36), nullable=True, index=True)
    query_text_raw = Column(Text, nullable=False)
    normalized_query = Column(Text, nullable=False)
    detected_dialect = Column(String(32), default="hi")
    audio_s3_uri = Column(String(512), nullable=True)
    retrieval_confidence_score = Column(Float, nullable=True)
    ai_generated_answer = Column(Text, nullable=True)
    citation_source = Column(Text, nullable=True) # e.g. "म.प्र. हिंदी ग्रंथ अकादमी, अध्याय 4, पृष्ठ 52"
    status = Column(
        String(32),
        nullable=False,
        default="RESOLVED_AI", # 'RESOLVED_AI' | 'ESCALATED_PEER' | 'ESCALATED_FACULTY' | 'CLOSED'
        index=True
    )
    assigned_mentor_id = Column(String(64), nullable=True)
    mentor_resolution_text = Column(Text, nullable=True)
    mentor_voice_note_uri = Column(String(512), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)
