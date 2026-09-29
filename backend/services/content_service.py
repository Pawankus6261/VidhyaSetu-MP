# VidyaSetu MP — Content & Resumable Micro-Pack Delivery Service
import os
import io
import json
import zipfile
import hashlib
from pathlib import Path
from typing import Tuple, Optional, Generator
from backend.config import settings

class ContentService:
    PACKS_DIR = Path(settings.LOCAL_STORAGE_DIR) / "packs"

    @classmethod
    def ensure_sample_pack(cls, pack_id: str = "HIS_BA1_MOD1_INDUS_VALLEY") -> Tuple[Path, str, int]:
        """
        Ensures a valid sample .vsmp archive exists on disk.
        Returns: (file_path, sha256_hash, file_size_bytes)
        """
        cls.PACKS_DIR.mkdir(parents=True, exist_ok=True)
        pack_path = cls.PACKS_DIR / f"{pack_id}.vsmp"

        if not pack_path.exists():
            # Build valid .vsmp ZIP container with decoupled vector commands, quiz, and metadata
            manifest = {
                "format_version": "2.0.0",
                "container": "VSMP_MICRO_PACK",
                "module_id": pack_id,
                "degree": "BA_1ST_YEAR",
                "university": "DAVV_INDORE",
                "title_hindi": "प्राचीन भारत का इतिहास: सिंधु घाटी सभ्यता",
                "title_english": "History of Ancient India: Indus Valley Civilization",
                "audio_codec": "Opus",
                "audio_bitrate_kbps": 14,
                "audio_duration_seconds": 165,
                "total_slides": 3,
                "created_at": "2026-09-29T20:00:00Z"
            }

            slides = {
                "slides": [
                    {
                        "slide_index": 1,
                        "title": "हड़प्पा समकोण ग्रिड विन्यास",
                        "title_en": "Harappan Grid Town Layout",
                        "vector_elements": [
                            {"type": "rect", "x": 40, "y": 50, "w": 280, "h": 70, "fill": "#1E3A8A", "label": "CITADEL"},
                            {"type": "line", "x1": 40, "y1": 135, "x2": 320, "y2": 135, "stroke": "#F59E0B", "strokeWidth": 3},
                            {"type": "rect", "x": 40, "y": 150, "w": 280, "h": 100, "fill": "#064E3B", "label": "LOWER TOWN"}
                        ]
                    },
                    {
                        "slide_index": 2,
                        "title": "मोहनजोदड़ो विशाल स्नानागार",
                        "title_en": "Mohenjo-daro Great Bath",
                        "vector_elements": [
                            {"type": "rect", "x": 60, "y": 60, "w": 240, "h": 140, "fill": "#0E7490", "label": "BATH TANK (11.88m x 7.01m)"}
                        ]
                    },
                    {
                        "slide_index": 3,
                        "title": "लोथल गोदीबाड़ा (डॉकयार्ड)",
                        "title_en": "Lothal Tidal Dockyard",
                        "vector_elements": [
                            {"type": "rect", "x": 50, "y": 70, "w": 260, "h": 120, "fill": "#374151", "label": "SLUICE GATES & BRICK BASIN"}
                        ]
                    }
                ]
            }

            assessment = {
                "quiz": [
                    {
                        "id": "Q1",
                        "question": "हड़प्पा सभ्यता का नगर विन्यास किस सिद्धांत पर आधारित था?",
                        "options": ["समकोण ग्रिड (चेकरबोर्ड)", "वृत्ताकार वलय", "अव्यवस्थित झोपड़ियां", "केवल पहाड़ी किले"],
                        "correct_index": 0
                    },
                    {
                        "id": "Q2",
                        "question": "मोहनजोदड़ो के विशाल स्नानागार में जलरोधी बनाने के लिए किस सामग्री का उपयोग किया गया था?",
                        "options": ["सीमेंट व चूना", "जिप्सम व प्राकृतिक बिटुमेन (डामर)", "कांसा व तांबा", "केवल लाल बलुआ पत्थर"],
                        "correct_index": 1
                    }
                ]
            }

            # Generate dummy lightweight opus audio bytes (or simulated voice stream buffer)
            simulated_audio = b"OPUS_AUDIO_STREAM_VIDYASETU_MP_14KBPS_HEADER" * 12000 # ~500 KB binary payload

            with zipfile.ZipFile(pack_path, "w", zipfile.ZIP_DEFLATED) as zf:
                zf.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2))
                zf.writestr("slides.json", json.dumps(slides, ensure_ascii=False, indent=2))
                zf.writestr("assessment.json", json.dumps(assessment, ensure_ascii=False, indent=2))
                zf.writestr("transcript.txt", "सिंधु घाटी सभ्यता में नगर नियोजन एक अद्वितीय विशेषता थी...")
                zf.writestr("audio.opus", simulated_audio)

        # Compute hash and size
        file_size = pack_path.stat().st_size
        sha256 = hashlib.sha256(pack_path.read_bytes()).hexdigest()
        return pack_path, sha256, file_size

    @classmethod
    def get_range_stream(
        cls,
        file_path: Path,
        start_byte: int,
        end_byte: int,
        chunk_size: int = 65536
    ) -> Generator[bytes, None, None]:
        """Streams byte-range slices from disk for resumable 2G/3G downloads."""
        with open(file_path, "rb") as f:
            f.seek(start_byte)
            remaining = end_byte - start_byte + 1
            while remaining > 0:
                bytes_to_read = min(chunk_size, remaining)
                data = f.read(bytes_to_read)
                if not data:
                    break
                remaining -= len(data)
                yield data
