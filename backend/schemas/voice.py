# VidyaSetu MP — Vernacular Voice & Dialect Schemas
from typing import Optional, List, Dict
from pydantic import BaseModel, Field

class DialectNormalizeRequest(BaseModel):
    spoken_text: str = Field(..., description="Vernacular spoken or typed text")
    dialect_hint: Optional[str] = None # nimadi, malvi, bundeli, bagheli, bhili, gondi

class DialectNormalizeResponse(BaseModel):
    original_text: str
    detected_dialect: str
    canonical_hindi: str
    detected_intent: str
    suggested_action: str
    dialect_confidence: float

class VoiceTranscribeRequest(BaseModel):
    audio_base64: str = Field(..., description="Base64 encoded audio bytes (WAV/FLAC/Opus/MP3)")
    source_language: Optional[str] = "hi"
    dialect_hint: Optional[str] = None

class VoiceTranscribeResponse(BaseModel):
    transcribed_raw: str
    canonical_hindi: str
    detected_dialect: str
    detected_intent: str
    confidence: float
