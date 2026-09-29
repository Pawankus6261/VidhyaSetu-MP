# VidyaSetu MP — Dialect Normalizer & Intent Router
# Normalizes Nimadi, Malvi, Bundeli, Bagheli, Bhili, and Gondi speech to Canonical Hindi
import re
from typing import Dict, Any, Tuple

def make_devanagari_pattern(phrase: str) -> str:
    """Builds a regex pattern with Unicode / Devanagari friendly boundaries."""
    escaped = re.escape(phrase)
    return rf"(?<![^\s.,!?।\(\)\[\]]){escaped}(?![^\s.,!?।\(\)\[\]])"

DIALECT_RULES = [
    # 1. NIMADI (Nimar plains: Barwani, Khargone, Khandwa)
    {
        "dialect": "nimadi",
        "word_pairs": [
            ("हमारो", "हमारा"),
            ("कद आवगो", "कब आएगा"),
            ("कद", "कब"),
            ("आवगो", "आएगा"),
            ("काज", "कार्य"),
            ("कुण", "कौन"),
            ("कीं", "क्यों"),
            ("छै", "है"),
            ("मनखा", "लोग"),
            ("पोर्या", "लड़का"),
            ("पोरी", "लड़की"),
            ("घरै", "घर में"),
            ("गाम", "गांव"),
            ("किता", "कितने"),
            ("पईसा", "रुपये"),
        ],
        "intent_keywords": {
            "स्कॉलरशिप": "SCHOLARSHIP_INQUIRY",
            "वजीफा": "SCHOLARSHIP_INQUIRY",
            "आवगो": "TIMELINE_QUERY",
            "कालिज": "COLLEGE_INQUIRY",
            "हड़प्पा": "CURRICULUM_HISTORY",
            "सिंधु": "CURRICULUM_HISTORY",
        }
    },
    # 2. MALVI (Malwa plateau: Ujjain, Dhar, Dewas, Shajapur, Mandsaur, Neemuch)
    {
        "dialect": "malvi",
        "word_pairs": [
            ("मनक", "लोग"),
            ("कई", "क्या"),
            ("खाता था", "खाते थे"),
            ("अठे", "यहाँ"),
            ("वठे", "वहाँ"),
            ("कठे", "कहाँ"),
            ("काई", "क्या"),
            ("होवे", "होता है"),
            ("थारो", "तुम्हारा"),
            ("म्हारो", "मेरा"),
            ("छोरो", "लड़का"),
            ("छोरी", "लड़की"),
            ("केवे", "कहते हैं"),
        ],
        "intent_keywords": {
            "खाता था": "CURRICULUM_HISTORY",
            "मनक": "CURRICULUM_HISTORY",
            "माटसाब": "TEACHER_DOUBT",
            "इम्तिहान": "EXAM_INQUIRY",
        }
    },
    # 3. BUNDELKHANDI / BUNDELI (Sagar, Damoh, Chhatarpur, Tikamgarh, Panna)
    {
        "dialect": "bundelkhandi",
        "word_pairs": [
            ("कालिज", "कॉलेज"),
            ("आवस", "आवास"),
            ("कित मिले", "कहाँ मिलते हैं"),
            ("कित", "कहाँ"),
            ("काहे", "क्यों"),
            ("कौने", "किसने"),
            ("हतो", "था"),
            ("हते", "थे"),
            ("हती", "थी"),
            ("भौत", "बहुत"),
            ("मोड़ा", "लड़का"),
            ("मोड़ी", "लड़की"),
            ("कहे से", "किस कारण से"),
            ("पैसा कितनो", "रुपये कितने"),
        ],
        "intent_keywords": {
            "आवस": "SCHOLARSHIP_AWAS_SAHAYATA",
            "कालिज": "COLLEGE_INQUIRY",
            "पैसे कित मिले": "SCHOLARSHIP_INQUIRY",
            "फार्म": "FORM_INQUIRY",
        }
    },
    # 4. BAGHELI (Rewa, Satna, Sidhi, Singrauli)
    {
        "dialect": "bagheli",
        "word_pairs": [
            ("इम्तिहान", "परीक्षा"),
            ("कब होइ", "कब होगी"),
            ("होइ", "होगा"),
            ("का भवा", "क्या हुआ"),
            ("केकरे", "किसके"),
            ("जायब", "जाएंगे"),
            ("आयेन", "आए"),
            ("लइका", "बच्चा"),
            ("कइसे", "कैसे"),
        ],
        "intent_keywords": {
            "इम्तिहान": "EXAM_INQUIRY",
            "होइ": "TIMELINE_QUERY",
            "परिक्षा": "EXAM_INQUIRY",
        }
    },
    # 5. BHILI / BHILALI (Alirajpur, Jhabua, Dhar, Barwani tribal belt)
    {
        "dialect": "bhili",
        "word_pairs": [
            ("कदा आवशे", "कब आएगा"),
            ("कदा", "कब"),
            ("पोरिया", "छात्र / लड़का"),
            ("पोरी", "छात्रा / लड़की"),
            ("वाचवु", "पढ़ना"),
            ("भणवु", "सीखना"),
            ("मारु", "मेरा"),
            ("तारु", "तुम्हारा"),
            ("शु", "क्या"),
            ("क्यारे", "कब"),
        ],
        "intent_keywords": {
            "पोरिया": "STUDENT_INQUIRY",
            "वाचवु": "LEARNING_INQUIRY",
            "भणवु": "LEARNING_INQUIRY",
        }
    },
    # 6. GONDI (Betul, Chhindwara, Mandla, Dindori, Seoni)
    {
        "dialect": "gondi",
        "word_pairs": [
            ("सिकाना", "पढ़ाई करना"),
            ("बटोल", "किताब / पाठ"),
            ("नेण्ड", "आज"),
            ("नावा", "मेरा"),
            ("नीवा", "तुम्हारा"),
        ],
        "intent_keywords": {
            "सिकाना": "LEARNING_INQUIRY",
            "बटोल": "CURRICULUM_DOUBT",
        }
    }
]

class DialectNormalizer:
    @classmethod
    def normalize(cls, raw_text: str, dialect_hint: str = None) -> Tuple[str, str, str, float]:
        """
        Normalizes spoken/written vernacular dialect to Canonical Academic Hindi.
        Returns: (canonical_hindi, detected_dialect, detected_intent, confidence)
        """
        text = raw_text.strip()
        detected_dialect = dialect_hint if dialect_hint else "hi"
        highest_score = 0
        detected_intent = "GENERAL_ACADEMIC"

        normalized = text

        for dialect_entry in DIALECT_RULES:
            name = dialect_entry["dialect"]
            match_count = 0
            temp_text = normalized
            
            for orig, target in dialect_entry["word_pairs"]:
                pat = make_devanagari_pattern(orig)
                if re.search(pat, temp_text, re.IGNORECASE):
                    match_count += 1
                    temp_text = re.sub(pat, target, temp_text, flags=re.IGNORECASE)

            if match_count > highest_score or (dialect_hint and dialect_hint.lower() == name):
                highest_score = match_count
                detected_dialect = name
                normalized = temp_text

                for kw, intent in dialect_entry["intent_keywords"].items():
                    if kw in text or kw in normalized:
                        detected_intent = intent
                        break

        # Global Intent Detection
        lower_norm = normalized.lower()
        if any(w in lower_norm for w in ["स्कॉलरशिप", "छात्रवृत्ति", "संबल", "मप टास", "mptaas", "फीस"]):
            detected_intent = "SCHOLARSHIP_INQUIRY"
        elif any(w in lower_norm for w in ["हड़प्पा", "सिंधु", "इतिहास", "मौर्य", "बाबर", "अकबर", "गांधी"]):
            detected_intent = "CURRICULUM_DOUBT_HISTORY"
        elif any(w in lower_norm for w in ["नौकरी", "भर्ती", "पटवारी", "वनरक्षक", "कांस्टेबल", "रोजगार"]):
            detected_intent = "CAREER_RECRUITMENT"
        elif any(w in lower_norm for w in ["आवास", "कमरा", "हॉस्टल", "किराया"]):
            detected_intent = "SCHOLARSHIP_AWAS_SAHAYATA"

        confidence = 0.95 if highest_score > 0 else (0.85 if detected_dialect != "hi" else 0.75)
        return normalized, detected_dialect, detected_intent, confidence
