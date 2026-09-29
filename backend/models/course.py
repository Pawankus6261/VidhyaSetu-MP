# VidyaSetu MP — Curriculum & Course Models
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class University(Base):
    __tablename__ = "universities"

    code = Column(String(32), primary_key=True) # e.g., DAVV, BARKATULLAH, RDVV, JIWAJI, IGNTU
    name_hindi = Column(String(256), nullable=False)
    name_english = Column(String(256), nullable=False)
    headquarters_district = Column(String(64), nullable=False)
    is_tribal_focus = Column(Boolean, default=False)

    courses = relationship("Course", back_populates="university", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    university_code = Column(String(32), ForeignKey("universities.code"), nullable=False)
    degree_type = Column(String(16), nullable=False) # UG, PG, DIPLOMA
    subject_code = Column(String(64), nullable=False)
    title_hindi = Column(String(256), nullable=False)
    title_english = Column(String(256), nullable=False)
    syllabus_academic_year = Column(Integer, nullable=False, default=2026)
    total_credits = Column(Integer, default=4)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    university = relationship("University", back_populates="courses")
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    unit_number = Column(Integer, nullable=False)
    lesson_order = Column(Integer, nullable=False)
    title_hindi = Column(String(256), nullable=False)
    title_english = Column(String(256), nullable=False)
    summary_devanagari = Column(Text, nullable=False)
    pack_s3_uri = Column(String(512), nullable=False) # MinIO / S3 or local URI to .vsmp
    pack_sha256_hash = Column(String(64), nullable=False)
    pack_size_bytes = Column(Integer, nullable=False) # <2,000,000 bytes
    audio_duration_seconds = Column(Integer, nullable=False)
    version_number = Column(Integer, default=1)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    course = relationship("Course", back_populates="lessons")
