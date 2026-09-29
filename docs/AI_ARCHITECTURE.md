# AI_ARCHITECTURE.md: Curriculum-Bounded Hybrid RAG & Confidence Locking

---

## 1. Principles of Educational AI in Rural Higher Education

Generative AI in rural education fails when it acts as an unconstrained open-ended chatbot. Unbounded LLMs present three critical risks:
1. **Academic Hallucination:** Generating plausible but factually incorrect explanations of historical dates, scientific formulas, or university examination guidelines.
2. **Linguistic Elitism:** Defaulting to generic urban Hindi or robotic machine translations that confuse rural collegiate students.
3. **Infrastructural Collapse:** Requiring continuous low-latency network connections and expensive external API calls ($0.02–$0.05 per conversation), which is economically impossible for subsidized education.

VidyaSetu MP implements **Curriculum-Bounded Hybrid RAG (Retrieval-Augmented Generation)**:
* The AI is strictly restricted to approved, authoritative knowledge sources.
* The system enforces **Mathematical Confidence Locking**.
* The AI explicitly admits ignorance when verified curriculum chunks are not found, escalating unresolved queries to human faculty.

---

## 2. The AI Pipeline Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 CURRICULUM-BOUNDED HYBRID RAG TOPOLOGY                      │
└─────────────────────────────────────────────────────────────────────────────┘
  Student Question (Text or Audio from Device Outbox Sync)
                     │
                     ▼
  [Step 1: Normalization & Dialect Mapping Layer]
  - Map regional vernacular terms (Nimadi/Malvi/Bundeli) to canonical academic Hindi
                     │
                     ▼
  [Step 2: Hybrid Retrieval Engine]
  ├── Dense Semantic Vector Search: Qdrant (BGE-M3 Multilingual 1024-dim Embeddings)
  └── Sparse Lexical Keyword Match: BM25 Inverted Index on Textbook Corpus
                     │
                     ▼
  [Step 3: Reciprocal Rank Fusion (RRF) & Re-ranking]
  - Merge top-10 dense and sparse candidate chunks
  - Cross-Encoder Re-ranker (BAAI/bge-reranker-large)
                     │
                     ▼
  [Step 4: Deterministic Confidence Threshold Evaluation]
       Is Top Similarity Score >= 0.72?
       ├── NO (Score < 0.72):
       │   ├── Lock Generative LLM
       │   ├── Display Closest Reference Textbook Section Verbatim
       │   └── Trigger Tier-2/Tier-3 Human Mentor Escalation Ticket
       │
       └── YES (Score >= 0.72):
           │
           ▼
  [Step 5: Grounded Answer Synthesis]
  - Model: Quantized Llama-3.1-8B-Instruct (4-bit AWQ via vLLM)
  - Strict System Prompt: "Answer ONLY using the provided verified context.
    Cite the exact Textbook Name and Page Number. Never invent facts."
           │
           ▼
  [Step 6: Guardrail & Citation Verifier (NeMo Guardrails)]
  - Verify that every factual claim is grounded in the retrieved chunk
  - Redact any accidental personal data (PII)
           │
           ▼
  [Step 7: Structured JSON Output Delivery]
  - Output compressed into <1.2 KB JSON payload
  - Cached in SQLite on student device for permanent offline access
```

---

## 3. The Grounded Knowledge Corpus

The RAG index is not built from random internet scrapes. It consists exclusively of verified, authoritative state curriculum sources:
1. **Madhya Pradesh Hindi Granth Academy Textbooks:** 142 approved titles covering Undergraduate B.A. (History, Political Science, Sociology, Economics), B.Com (Accountancy, Business Law), and B.Sc. (Botany, Zoology, Chemistry).
2. **Approved State University Syllabi:** Detailed course outlines and learning outcomes from:
   * Barkatullah University (Bhopal)
   * Devi Ahilya Vishwavidyalaya - DAVV (Indore)
   * Rani Durgavati Vishwavidyalaya - RDVV (Jabalpur)
   * Jiwaji University (Gwalior)
   * Indira Gandhi National Tribal University - IGNTU (Amarkantak)
3. **Official State Welfare Gazettes:** Government orders for MPTAAS, Gaon Ki Beti, Pratibha Kiran, and MMVY schemes.

---

## 4. Confidence Locking & Escalation Mechanics

```python
# Confidence Evaluation Logic (ai/rag/confidence_evaluator.py)

class RetrievalEvaluator:
    CONFIDENCE_THRESHOLD = 0.72

    @classmethod
    def evaluate_and_route(cls, query: str, retrieved_chunks: list[Chunk]) -> RoutingDecision:
        if not retrieved_chunks:
            return RoutingDecision(
                action="ESCALATE_TO_MENTOR",
                reason="ZERO_CHUNKS_RETRIEVED",
                message_hindi="यह प्रश्न आपके विश्वविद्यालय पाठ्यक्रम में नहीं मिला। क्या आप इसे शिक्षक मेंटर को भेजना चाहते हैं?"
            )
        
        top_score = retrieved_chunks[0].similarity_score

        if top_score < cls.CONFIDENCE_THRESHOLD:
            return RoutingDecision(
                action="FALLBACK_AND_ESCALATE",
                confidence=top_score,
                fallback_chunk=retrieved_chunks[0],
                message_hindi="मुझे इस प्रश्न का निश्चित उत्तर आधिकारिक पुस्तक में नहीं मिला। निकटतम संदर्भ नीचे दिया गया है। क्या आप इसे मेंटर को भेजना चाहते हैं?"
            )
        
        return RoutingDecision(
            action="GENERATE_GROUNDED_ANSWER",
            confidence=top_score,
            context_chunks=retrieved_chunks[:3]
        )
```

---

## 5. Dialect Normalization Map Sample

```json
{
  "dialect_mappings": [
    {
      "dialect": "nimadi",
      "spoken_phrasing": "हमारो स्कॉलरशिप फॉर्म कद आवगो?",
      "canonical_hindi": "हमारा छात्रवृत्ति फॉर्म कब आएगा?",
      "detected_intent": "SCHOLARSHIP_TIMELINE"
    },
    {
      "dialect": "malvi",
      "spoken_phrasing": "सिंधु घाटी का मनक कई खाता था?",
      "canonical_hindi": "सिंधु घाटी सभ्यता के लोग क्या खाते थे?",
      "detected_intent": "CURRICULUM_DOUBT_HISTORY"
    },
    {
      "dialect": "bundelkhandi",
      "spoken_phrasing": "कालिज में आवस के पैसे कित मिले?",
      "canonical_hindi": "कॉलेज में आवास सहायता योजना का लाभ कैसे मिलता है?",
      "detected_intent": "SCHOLARSHIP_AWAS_SAHAYATA"
    }
  ]
}
```
