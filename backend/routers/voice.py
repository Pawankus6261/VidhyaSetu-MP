# VidyaSetu MP — Vernacular Voice & Dialect Router
import base64
from typing import Optional
from fastapi import APIRouter, HTTPException, Response
from backend.schemas.voice import (
    DialectNormalizeRequest,
    DialectNormalizeResponse,
    VoiceTranscribeRequest,
    VoiceTranscribeResponse,
)
from backend.services.dialect_normalizer import DialectNormalizer
from backend.services.bhashini_service import bhashini_service

router = APIRouter(prefix="/api/v1/voice", tags=["Voice & Indic Dialects"])

@router.post("/normalize", response_model=DialectNormalizeResponse)
def normalize_vernacular_speech(request: DialectNormalizeRequest):
    """
    Normalizes spoken/written vernacular dialect (Nimadi, Malvi, Bundelkhandi, Bagheli, Bhili, Gondi)
    into Canonical Academic Devanagari Hindi, and extracts academic intent.
    """
    canonical, detected_dialect, intent, conf = DialectNormalizer.normalize(
        request.spoken_text,
        request.dialect_hint
    )

    action_map = {
        "SCHOLARSHIP_INQUIRY": "REDIRECT_SCHOLARSHIP_AUDIT",
        "CURRICULUM_DOUBT_HISTORY": "QUERY_CURRICULUM_RAG",
        "SCHOLARSHIP_AWAS_SAHAYATA": "CHECK_AWAS_SAHAYATA_ELIGIBILITY",
        "CAREER_RECRUITMENT": "QUERY_CAREER_PATHWAYS",
        "COLLEGE_INQUIRY": "QUERY_UNIVERSITY_CATALOG",
        "GENERAL_ACADEMIC": "QUERY_CURRICULUM_RAG"
    }

    return DialectNormalizeResponse(
        original_text=request.spoken_text,
        detected_dialect=detected_dialect,
        canonical_hindi=canonical,
        detected_intent=intent,
        suggested_action=action_map.get(intent, "QUERY_CURRICULUM_RAG"),
        dialect_confidence=conf
    )

@router.post("/transcribe", response_model=VoiceTranscribeResponse)
def transcribe_voice_payload(request: VoiceTranscribeRequest):
    """
    Transcribes audio bytes via Bhashini ULCA IndicASR pipeline.
    Applies real-time phonological regex normalization into canonical Hindi.
    """
    try:
        audio_bytes = base64.b64decode(request.audio_base64)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 audio payload: {e}")

    raw_transcription, canonical, dialect, conf = bhashini_service.transcribe_audio_payload(
        audio_bytes=audio_bytes,
        source_lang=request.source_language or "hi",
        dialect_hint=request.dialect_hint
    )

    _, _, intent, _ = DialectNormalizer.normalize(raw_transcription, dialect)

    return VoiceTranscribeResponse(
        transcribed_raw=raw_transcription,
        canonical_hindi=canonical,
        detected_dialect=dialect,
        detected_intent=intent,
        confidence=conf
    )

@router.post("/synthesize")
def synthesize_speech(text: str, language: str = "hi"):
    """Synthesizes text into high-quality Indic speech audio bytes."""
    audio_bytes = bhashini_service.synthesize_speech(text, language)
    if not audio_bytes:
        raise HTTPException(status_code=503, detail="TTS service offline or key unconfigured")

    return Response(content=audio_bytes, media_type="audio/wav")
