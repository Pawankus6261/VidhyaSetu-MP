# VidyaSetu MP — State-Level Vector Knowledge Corpus (Hybrid RAG)
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime
from backend.database import Base

class CurriculumKnowledgeChunk(Base):
    __tablename__ = "curriculum_knowledge_chunks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    university_code = Column(String(32), nullable=True, index=True)
    course_code = Column(String(64), nullable=False, index=True)
    subject = Column(String(128), nullable=False)
    chapter_unit = Column(String(128), nullable=False)
    text_hindi = Column(Text, nullable=False)
    text_english = Column(Text, nullable=True)
    text_dialect_glossary = Column(Text, nullable=True) # JSON dictionary of dialect equivalents
    embedding_json = Column(Text, nullable=True) # Serialized 1024-dim embedding vector
    source_book_title = Column(String(256), nullable=False) # e.g., 'म.प्र. हिंदी ग्रंथ अकादमी'
    page_number = Column(Integer, nullable=False)
    verified_by_faculty_id = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
