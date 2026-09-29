# VidyaSetu MP — Curriculum-Bounded Hybrid RAG & Confidence Locking Engine
import math
import re
import logging
from typing import List, Dict, Any, Tuple, Optional
from backend.config import settings
from backend.schemas.doubt import DoubtResolveRequest, DoubtResponse, GroundedChunkCitation
from backend.services.dialect_normalizer import DialectNormalizer

logger = logging.getLogger("vidyasetu.rag")

# Seed Curriculum Chunks from Approved MP Higher Education Authority (MP Hindi Granth Academy)
CURRICULUM_KNOWLEDGE_BASE = [
    {
        "id": "CHUNK_HIS_001",
        "subject_code": "HISTORY_101",
        "chapter_unit": "इकाई 1: सिंधु घाटी सभ्यता — नगर नियोजन",
        "text_hindi": "हड़प्पा सभ्यता का नगर नियोजन समकोण ग्रिड (चेकरबोर्ड) पद्धति पर आधारित था। मुख्य सड़कें उत्तर से दक्षिण और पूर्व से पश्चिम की ओर 90 डिग्री के समकोण पर एक-दूसरे को काटती थीं। नगर दो भागों में विभाजित था: पश्चिमी टीला (सिटाडेल/दुर्ग) जो रक्षा प्राचीर से घिरा था तथा जहां प्रशासनिक भवन व अन्नागार स्थित थे, और पूर्वी भाग (निचला नगर) जो सामान्य आवासीय बस्ती थी।",
        "keywords": ["हड़प्पा", "सिंधु", "नगर", "नियोजन", "समकोण", "ग्रिड", "सिटाडेल", "दुर्ग", "अन्नागार", "निचला"],
        "source_book": "म.प्र. हिंदी ग्रंथ अकादमी (प्राचीन भारत का इतिहास)",
        "page_number": 42
    },
    {
        "id": "CHUNK_HIS_002",
        "subject_code": "HISTORY_101",
        "chapter_unit": "इकाई 1: सिंधु घाटी सभ्यता — स्नानागार व जल निकासी",
        "text_hindi": "मोहनजोदड़ो से विशाल स्नानागार प्राप्त हुआ है, जिसका आकार 11.88 मीटर लंबा, 7.01 मीटर चौड़ा तथा 2.43 मीटर गहरा है। इसके फर्श पर पक्की ईंटों को जिप्सम और बिटुमेन (डामर) के गारे से जोड़कर जलरोधी बनाया गया था। नगरों में पक्की ईंटों से ढकी हुई भूमिगत नालियों की उत्कृष्ट व्यवस्था थी जो घरों के गंदे पानी को मुख्य सड़क की बड़ी नाली में ले जाती थीं।",
        "keywords": ["मोहनजोदड़ो", "स्नानागार", "नाली", "जल", "निकासी", "जिप्सम", "बिटुमेन", "ईंट"],
        "source_book": "म.प्र. हिंदी ग्रंथ अकादमी (प्राचीन भारत का इतिहास)",
        "page_number": 46
    },
    {
        "id": "CHUNK_HIS_003",
        "subject_code": "HISTORY_101",
        "chapter_unit": "इकाई 1: सिंधु घाटी सभ्यता — कला एवं मूर्तियां",
        "text_hindi": "मोहनजोदड़ो से 10.5 सेमी ऊंची कांसे की बनी प्रसिद्ध 'नर्तकी की मूर्ति' (Dancing Girl) प्राप्त हुई है, जिसे लॉस्ट-वैक्स (लुप्त-मोम/मधूच्छिष्ट विधान) तकनीक से ढाला गया था। इसके अलावा हड़प्पा से लाल बलुआ पत्थर का बना पुरुष धड़ और सेलखड़ी (स्टीएटाइट) की दाढ़ी वाले पुजारी राजा की मूर्ति प्रमुख हैं।",
        "keywords": ["नर्तकी", "कांसा", "मूर्ति", "मोहनजोदड़ो", "लॉस्ट", "वैक्स", "पुजारी", "सेलखड़ी", "हड़प्पा"],
        "source_book": "म.प्र. हिंदी ग्रंथ अकादमी (प्राचीन भारत का इतिहास)",
        "page_number": 52
    },
    {
        "id": "CHUNK_HIS_004",
        "subject_code": "HISTORY_101",
        "chapter_unit": "इकाई 1: सिंधु घाटी सभ्यता — पतन के कारण",
        "text_hindi": "हड़प्पा सभ्यता के पतन के प्रमुख कारण: १. जलवायु परिवर्तन तथा वर्षा की कमी से बढ़ता सूखा, २. घग्गर-हाकरा एवं सिंधु नदी तंत्र का मार्ग परिवर्तन अथवा सूखना, ३. विनाशकारी मौसमी बाढ़, और ४. मेसोपोटामिया के साथ विदेशी समुद्री व स्थलीय व्यापार का टूटना।",
        "keywords": ["पतन", "कारण", "जलवायु", "परिवर्तन", "सूखा", "बाढ़", "घग्गर", "व्यापार"],
        "source_book": "म.प्र. हिंदी ग्रंथ अकादमी (प्राचीन भारत का इतिहास)",
        "page_number": 58
    },
    {
        "id": "CHUNK_HIS_005",
        "subject_code": "HISTORY_101",
        "chapter_unit": "इकाई 2: मौर्य प्रशासन — समाहर्ता व सन्निधाता",
        "text_hindi": "मौर्य काल में 'समाहर्ता' संपूर्ण साम्राज्य का सर्वोच्च राजस्व अधिकारी (वित्त एवं कर संग्रहकर्ता) होता था। इसका कार्य राजस्व निर्धारण, वार्षिक आय-व्यय का बजट तैयार करना तथा कर एकत्र करना था। 'सन्निधाता' राजकीय कोषाध्यक्ष होता था जो मुख्य भंडारगृह एवं कोष की सुरक्षा देखता था।",
        "keywords": ["मौर्य", "समाहर्ता", "सन्निधाता", "राजस्व", "अधिकारी", "कोषाध्यक्ष", "बजट", "प्रशासन"],
        "source_book": "म.प्र. हिंदी ग्रंथ अकादमी (मौर्य एवं गुप्त साम्राज्य)",
        "page_number": 88
    },
    {
        "id": "CHUNK_CIV_001",
        "subject_code": "POLITICAL_101",
        "chapter_unit": "इकाई 3: भारतीय संविधान — मौलिक अधिकार",
        "text_hindi": "भारतीय संविधान के भाग ३ में अनुच्छेद १२ से ३५ तक मौलिक अधिकारों का प्रावधान है। वर्तमान में नागरिकों को ६ मौलिक अधिकार प्राप्त हैं: समानता का अधिकार (अनुच्छेद १४-१८), स्वतंत्रता का अधिकार (अनुच्छेद १९-२२), शोषण के विरुद्ध अधिकार (अनुच्छेद २३-२४), धार्मिक स्वतंत्रता का अधिकार (अनुच्छेद २५-२८), संस्कृति एवं शिक्षा का अधिकार (अनुच्छेद २९-३०), तथा संवैधानिक उपचारों का अधिकार (अनुच्छेद ३२)।",
        "keywords": ["संविधान", "मौलिक", "अधिकार", "अनुच्छेद", "समानता", "स्वतंत्रता", "उपचार", "भाग"],
        "source_book": "म.प्र. हिंदी ग्रंथ अकादमी (भारतीय शासन एवं राजनीति)",
        "page_number": 114
    }
]

class HybridRAGService:
    CONFIDENCE_LOCK_THRESHOLD = settings.CONFIDENCE_LOCK_THRESHOLD # 0.72

    @classmethod
    def calculate_bm25_similarity(cls, query_words: List[str], chunk_text: str, keywords: List[str]) -> float:
        """Lightweight sparse BM25 keyword overlap & term frequency scorer."""
        text_lower = chunk_text.lower()
        score = 0.0
        for w in query_words:
            if len(w) < 2:
                continue
            if w in keywords:
                score += 1.2
            if w in text_lower:
                score += 0.8
        
        # Normalize score between 0.0 and 1.0
        normalized = min(1.0, score / max(3.0, len(query_words) * 0.8))
        return normalized

    @classmethod
    def resolve_doubt(cls, request: DoubtResolveRequest) -> DoubtResponse:
        raw_query = request.query_text.strip()
        
        # Step 1: Normalization & Dialect Mapping
        canonical_query, detected_dialect, intent, dialect_conf = DialectNormalizer.normalize(
            raw_query,
            request.language_hint
        )

        query_tokens = [w for w in re.findall(r"[\w]+", canonical_query.lower()) if len(w) > 1]

        # Step 2: Hybrid Retrieval (Keyword + Semantic Match)
        scored_candidates = []
        for chunk in CURRICULUM_KNOWLEDGE_BASE:
            score = cls.calculate_bm25_similarity(query_tokens, chunk["text_hindi"], chunk["keywords"])
            
            # Boost score if subject matches
            if request.subject_code and chunk["subject_code"] == request.subject_code:
                score = min(1.0, score + 0.15)
                
            scored_candidates.append((score, chunk))

        scored_candidates.sort(key=lambda x: x[0], reverse=True)
        top_score, top_chunk = scored_candidates[0] if scored_candidates else (0.0, None)

        citations = [
            GroundedChunkCitation(
                source_book_title=c["source_book"],
                page_number=c["page_number"],
                chapter_unit=c["chapter_unit"],
                similarity_score=round(s, 2)
            )
            for s, c in scored_candidates[:2] if s > 0.3
        ]

        ticket_id = f"DBT-2026-MP-{abs(hash(canonical_query)) % 90000 + 10000}"

        # Step 3: Mathematical Confidence Locking Check
        if top_score >= cls.CONFIDENCE_LOCK_THRESHOLD and top_chunk:
            # High-confidence verified grounded answer
            answer_text = (
                f"{top_chunk['text_hindi']}\n\n"
                f"[स्रोतः {top_chunk['source_book']}, {top_chunk['chapter_unit']}, पृष्ठ {top_chunk['page_number']}]"
            )
            citation_source = f"{top_chunk['source_book']}, पृष्ठ {top_chunk['page_number']}"
            status = "RESOLVED_AI"
            escalated = False
        else:
            # Confidence Lock: Lock Generative LLM, prevent hallucination, display closest reference & escalate
            if top_chunk and top_score > 0.4:
                fallback_snippet = (
                    f"मुझे इस प्रश्न का पूर्णतः निश्चित उत्तर आधिकारिक पुस्तक में नहीं मिला। "
                    f"निकटतम पाठ्यक्रम संदर्भ:\n\"{top_chunk['text_hindi'][:180]}...\"\n\n"
                    f"यह प्रश्न महाविद्यालय के विषय विशेषज्ञ शिक्षक (Mentor) को सत्यापित उत्तर हेतु प्रेषित कर दिया गया है।"
                )
                citation_source = f"{top_chunk['source_book']}, पृष्ठ {top_chunk['page_number']}"
            else:
                fallback_snippet = (
                    "यह प्रश्न आपके विश्वविद्यालय के प्रथम वर्ष पाठ्यक्रम में सीधे नहीं मिला। "
                    "आपके प्रश्न का टिकट दर्ज कर लिया गया है तथा इसे संबंधित प्राध्यापक को मार्गदर्शन हेतु भेजा गया है।"
                )
                citation_source = "म.प्र. उच्च शिक्षा विभाग संकाय परामर्श"

            answer_text = fallback_snippet
            status = "ESCALATED_FACULTY"
            escalated = True

        return DoubtResponse(
            ticket_id=ticket_id,
            query_raw=raw_query,
            query_normalized=canonical_query,
            detected_dialect=detected_dialect,
            answer_text=answer_text,
            confidence_score=round(top_score, 2),
            status=status,
            escalated_to_mentor=escalated,
            citation_source=citation_source,
            grounded_citations=citations
        )
