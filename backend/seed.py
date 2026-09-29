# VidyaSetu MP — Seed Data Ingestion Script
import json
import logging
from pathlib import Path
from sqlalchemy.orm import Session
from backend.database import SessionLocal, init_db
from backend.models.user import User
from backend.models.course import University, Course, Lesson
from backend.models.scholarship import ScholarshipScheme
from backend.models.knowledge import CurriculumKnowledgeChunk
from backend.services.rag_service import CURRICULUM_KNOWLEDGE_BASE
from backend.services.content_service import ContentService
from backend.config import PROJECT_ROOT

logger = logging.getLogger("vidyasetu.seed")

def seed_all_data(db: Session = None) -> dict:
    """Seeds master reference data into the database."""
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    results = {}

    try:
        # 1. SEED UNIVERSITIES
        universities_data = [
            ("DAVV_INDORE", "देवी अहिल्या विश्वविद्यालय", "Devi Ahilya Vishwavidyalaya, Indore", "Indore", False),
            ("BARKATULLAH_BHOPAL", "बरकतउल्ला विश्वविद्यालय", "Barkatullah University, Bhopal", "Bhopal", False),
            ("IGNTU_AMARKANTAK", "इंदिरा गांधी राष्ट्रीय जनजातीय विश्वविद्यालय", "Indira Gandhi National Tribal University", "Anuppur", True),
            ("RDVV_JABALPUR", "रानी दुर्गावती विश्वविद्यालय", "Rani Durgavati Vishwavidyalaya", "Jabalpur", False),
            ("JIWAJI_GWALIOR", "जीवाजी विश्वविद्यालय", "Jiwaji University", "Gwalior", False),
        ]

        uni_count = 0
        for code, hi, en, dist, tribal in universities_data:
            existing = db.query(University).filter(University.code == code).first()
            if not existing:
                u = University(
                    code=code,
                    name_hindi=hi,
                    name_english=en,
                    headquarters_district=dist,
                    is_tribal_focus=tribal
                )
                db.add(u)
                uni_count += 1
        db.commit()
        results["universities_seeded"] = uni_count

        # 2. SEED COURSES & LESSONS
        course_id = "COURSE_HIS_BA1"
        existing_course = db.query(Course).filter(Course.id == course_id).first()
        if not existing_course:
            c = Course(
                id=course_id,
                university_code="DAVV_INDORE",
                degree_type="UG",
                subject_code="HISTORY_101",
                title_hindi="प्राचीन भारत का इतिहास (प्रारंभ से 1200 ई. तक)",
                title_english="History of Ancient India (Earliest to 1200 CE)",
                syllabus_academic_year=2026,
                total_credits=4
            )
            db.add(c)
            db.commit()

        # Ensure sample .vsmp file exists
        pack_path, sha256, file_size = ContentService.ensure_sample_pack("HIS_BA1_MOD1_INDUS_VALLEY")

        lesson_id = "HIS_BA1_MOD1_INDUS_VALLEY"
        existing_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not existing_lesson:
            les = Lesson(
                id=lesson_id,
                course_id=course_id,
                unit_number=1,
                lesson_order=1,
                title_hindi="सिंधु घाटी सभ्यता: नगर नियोजन एवं स्नानागार",
                title_english="Indus Valley Civilization: Town Planning & Architecture",
                summary_devanagari="हड़प्पा सभ्यता का समकोण ग्रिड विन्यास, मोहनजोदड़ो का विशाल स्नानागार एवं जल निकासी तंत्र।",
                pack_s3_uri=str(pack_path),
                pack_sha256_hash=sha256,
                pack_size_bytes=file_size,
                audio_duration_seconds=165,
                version_number=1
            )
            db.add(les)
            db.commit()
        results["courses_seeded"] = 1

        # 3. SEED SCHOLARSHIPS FROM data/scholarships/mp_scholarships.json
        scholarship_file = PROJECT_ROOT / "data" / "scholarships" / "mp_scholarships.json"
        sch_count = 0
        if scholarship_file.exists():
            with open(scholarship_file, "r", encoding="utf-8") as f:
                sch_list = json.load(f)
                for item in sch_list:
                    code = item["scheme_id"]
                    existing = db.query(ScholarshipScheme).filter(ScholarshipScheme.scheme_code == code).first()
                    if not existing:
                        sch = ScholarshipScheme(
                            scheme_code=code,
                            title_hindi=item["scheme_name"],
                            title_english=item["scheme_name"],
                            administering_department=item["administering_department"],
                            official_portal_url=item["official_portal"],
                            max_annual_benefit_inr=float(item.get("annual_estimated_inr", 15000)),
                            financial_benefit_desc=item["financial_benefit"],
                            eligibility_criteria_json=json.dumps(item["eligibility_rules"], ensure_ascii=False),
                            required_documents_json=json.dumps(item["required_documents"], ensure_ascii=False)
                        )
                        db.add(sch)
                        sch_count += 1
            db.commit()
        results["scholarships_seeded"] = sch_count

        # 4. SEED CURRICULUM KNOWLEDGE CHUNKS FOR HYBRID RAG
        chunk_count = 0
        for chunk in CURRICULUM_KNOWLEDGE_BASE:
            cid = chunk["id"]
            existing = db.query(CurriculumKnowledgeChunk).filter(CurriculumKnowledgeChunk.id == cid).first()
            if not existing:
                kc = CurriculumKnowledgeChunk(
                    id=cid,
                    university_code="DAVV_INDORE",
                    course_code=chunk["subject_code"],
                    subject="प्राचीन भारत का इतिहास",
                    chapter_unit=chunk["chapter_unit"],
                    text_hindi=chunk["text_hindi"],
                    source_book_title=chunk["source_book"],
                    page_number=chunk["page_number"]
                )
                db.add(kc)
                chunk_count += 1
        db.commit()
        results["knowledge_chunks_seeded"] = chunk_count

        # 5. SEED DEFAULT DEMO STUDENT PROFILE (Barwani / Bhil tribal student)
        demo_user_id = "demo_student_barwani_01"
        existing_user = db.query(User).filter(User.id == demo_user_id).first()
        if not existing_user:
            demo_user = User(
                id=demo_user_id,
                phone_hash="a98f12c34d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
                samagra_id="194829104",
                full_name="सुनीता सोलंकी (Sunita Solanki)",
                gender="FEMALE",
                social_category="ST",
                tribal_community="Bhil",
                district="Barwani",
                tehsil="Pati",
                college_code="eP_GOVT_COLLEGE_BARWANI",
                course_enrolled="BA",
                year_of_study=1,
                family_annual_income=72000.0,
                twelfth_percentage=68.4,
                is_rural=True,
                preferred_dialect="nimadi"
            )
            db.add(demo_user)
            db.commit()
        results["demo_user_seeded"] = True

        logger.info(f"Database seed completed successfully: {results}")
        return results

    except Exception as e:
        logger.error(f"Error during database seed: {e}")
        db.rollback()
        raise e
    finally:
        if should_close:
            db.close()

if __name__ == "__main__":
    init_db()
    seed_all_data()
    print("Seed script completed successfully!")
