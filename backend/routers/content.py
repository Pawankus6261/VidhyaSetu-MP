# VidyaSetu MP — Content & Resumable Micro-Pack Delivery Router
import os
import re
from pathlib import Path
from typing import Optional, List
from fastapi import APIRouter, Header, HTTPException, status, Response
from fastapi.responses import StreamingResponse, FileResponse
from backend.services.content_service import ContentService
from backend.schemas.content import CourseDetail, LessonSummary, UniversityDetail

router = APIRouter(prefix="/api/v1/content", tags=["Content Delivery & .VSMP Packs"])

@router.get("/universities", response_model=List[UniversityDetail])
def get_universities():
    """Returns approved State Universities in Madhya Pradesh."""
    return [
        UniversityDetail(
            code="DAVV_INDORE",
            name_hindi="देवी अहिल्या विश्वविद्यालय",
            name_english="Devi Ahilya Vishwavidyalaya, Indore",
            headquarters_district="Indore",
            is_tribal_focus=False,
            courses=[]
        ),
        UniversityDetail(
            code="BARKATULLAH_BHOPAL",
            name_hindi="बरकतउल्ला विश्वविद्यालय",
            name_english="Barkatullah University, Bhopal",
            headquarters_district="Bhopal",
            is_tribal_focus=False,
            courses=[]
        ),
        UniversityDetail(
            code="IGNTU_AMARKANTAK",
            name_hindi="इंदिरा गांधी राष्ट्रीय जनजातीय विश्वविद्यालय",
            name_english="Indira Gandhi National Tribal University, Amarkantak",
            headquarters_district="Anuppur",
            is_tribal_focus=True,
            courses=[]
        ),
        UniversityDetail(
            code="RDVV_JABALPUR",
            name_hindi="रानी दुर्गावती विश्वविद्यालय",
            name_english="Rani Durgavati Vishwavidyalaya, Jabalpur",
            headquarters_district="Jabalpur",
            is_tribal_focus=False,
            courses=[]
        ),
        UniversityDetail(
            code="JIWAJI_GWALIOR",
            name_hindi="जीवाजी विश्वविद्यालय",
            name_english="Jiwaji University, Gwalior",
            headquarters_district="Gwalior",
            is_tribal_focus=False,
            courses=[]
        )
    ]

@router.get("/courses", response_model=List[CourseDetail])
def get_courses():
    """Returns official course modules and lesson units."""
    pack_path, sha256, file_size = ContentService.ensure_sample_pack("HIS_BA1_MOD1_INDUS_VALLEY")

    return [
        CourseDetail(
            id="COURSE_HIS_BA1",
            university_code="DAVV_INDORE",
            degree_type="UG",
            subject_code="HISTORY_101",
            title_hindi="प्राचीन भारत का इतिहास (प्रारंभ से 1200 ई. तक)",
            title_english="History of Ancient India (Earliest to 1200 CE)",
            total_credits=4,
            lessons=[
                LessonSummary(
                    id="HIS_BA1_MOD1_INDUS_VALLEY",
                    course_id="COURSE_HIS_BA1",
                    unit_number=1,
                    lesson_order=1,
                    title_hindi="सिंधु घाटी सभ्यता: नगर नियोजन एवं स्नानागार",
                    title_english="Indus Valley Civilization: Town Planning & Architecture",
                    summary_devanagari="हड़प्पा सभ्यता का समकोण ग्रिड विन्यास, मोहनजोदड़ो का विशाल स्नानागार एवं जल निकासी तंत्र।",
                    pack_sha256_hash=sha256,
                    pack_size_bytes=file_size,
                    audio_duration_seconds=165,
                    download_url="/api/v1/content/pack/HIS_BA1_MOD1_INDUS_VALLEY"
                )
            ]
        )
    ]

@router.get("/packs", response_model=List[LessonSummary])
def list_packs():
    """Lists all available .vsmp packages ready for zero-byte offline download."""
    pack_path, sha256, file_size = ContentService.ensure_sample_pack("HIS_BA1_MOD1_INDUS_VALLEY")
    return [
        LessonSummary(
            id="HIS_BA1_MOD1_INDUS_VALLEY",
            course_id="COURSE_HIS_BA1",
            unit_number=1,
            lesson_order=1,
            title_hindi="सिंधु घाटी सभ्यता: नगर नियोजन एवं स्नानागार",
            title_english="Indus Valley Civilization: Town Planning & Architecture",
            summary_devanagari="हड़प्पा सभ्यता का समकोण ग्रिड विन्यास, मोहनजोदड़ो का विशाल स्नानागार एवं जल निकासी तंत्र।",
            pack_sha256_hash=sha256,
            pack_size_bytes=file_size,
            audio_duration_seconds=165,
            download_url="/api/v1/content/pack/HIS_BA1_MOD1_INDUS_VALLEY"
        )
    ]

@router.get("/pack/{pack_id}")
def download_pack(pack_id: str, range: Optional[str] = Header(None)):
    """
    Streams binary .vsmp package archive with full HTTP Range-Header resumable download support.
    Enables low-bandwidth Android Go devices to resume interrupted downloads over unstable 2G/3G connections.
    """
    pack_path, sha256, file_size = ContentService.ensure_sample_pack(pack_id)

    if not pack_path.exists():
        raise HTTPException(status_code=404, detail="Micro-pack not found")

    content_type = "application/vnd.vidyasetu.pack+zip"

    # Full download (No Range header)
    if not range:
        return FileResponse(
            path=str(pack_path),
            media_type=content_type,
            headers={
                "Accept-Ranges": "bytes",
                "Content-Length": str(file_size),
                "Content-Encoding": "identity",
                "ETag": f'"{sha256}"',
                "Content-Disposition": f'attachment; filename="{pack_id}.vsmp"'
            }
        )

    # Resumable Range Download (e.g. Range: bytes=655360-)
    range_match = re.match(r"^bytes=(\d+)-(\d*)$", range)
    if not range_match:
        raise HTTPException(status_code=416, detail="Requested Range Not Satisfiable")

    start_byte = int(range_match.group(1))
    end_byte = int(range_match.group(2)) if range_match.group(2) else file_size - 1

    if start_byte >= file_size or end_byte >= file_size or start_byte > end_byte:
        raise HTTPException(
            status_code=416,
            detail="Requested Range Not Satisfiable",
            headers={"Content-Range": f"bytes */{file_size}"}
        )

    chunk_length = end_byte - start_byte + 1
    stream_generator = ContentService.get_range_stream(pack_path, start_byte, end_byte)

    return StreamingResponse(
        stream_generator,
        status_code=status.HTTP_206_PARTIAL_CONTENT,
        media_type=content_type,
        headers={
            "Content-Range": f"bytes {start_byte}-{end_byte}/{file_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(chunk_length),
            "ETag": f'"{sha256}"',
            "Content-Disposition": f'attachment; filename="{pack_id}.vsmp"'
        }
    )
