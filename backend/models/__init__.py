# VidyaSetu MP Models Package
from backend.models.user import User
from backend.models.course import University, Course, Lesson
from backend.models.knowledge import CurriculumKnowledgeChunk
from backend.models.doubt import DoubtTicket
from backend.models.scholarship import ScholarshipScheme
from backend.models.sync import SyncJournal

__all__ = [
    "User",
    "University",
    "Course",
    "Lesson",
    "CurriculumKnowledgeChunk",
    "DoubtTicket",
    "ScholarshipScheme",
    "SyncJournal",
]
