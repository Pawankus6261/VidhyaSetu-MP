# VidyaSetu MP — Content & Micro-Pack Delivery Schemas
from typing import List, Optional
from pydantic import BaseModel

class LessonSummary(BaseModel):
    id: str
    course_id: str
    unit_number: int
    lesson_order: int
    title_hindi: str
    title_english: str
    summary_devanagari: str
    pack_sha256_hash: str
    pack_size_bytes: int
    audio_duration_seconds: int
    download_url: str

class CourseDetail(BaseModel):
    id: str
    university_code: str
    degree_type: str
    subject_code: str
    title_hindi: str
    title_english: str
    total_credits: int
    lessons: List[LessonSummary] = []

class UniversityDetail(BaseModel):
    code: str
    name_hindi: str
    name_english: str
    headquarters_district: str
    is_tribal_focus: bool
    courses: List[CourseDetail] = []
