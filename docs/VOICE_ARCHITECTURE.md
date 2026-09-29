# VOICE_ARCHITECTURE.md: Indic Speech Engineering & Dialect Normalization
## Platform: VidyaSetu MP (विद्यासेतु)

---

## 1. The Linguistic Challenge in Rural Madhya Pradesh

While standard Hindi (*khadi boli*) is the statutory medium of higher education instruction in Madhya Pradesh, it is not the cognitive mother tongue for over 60% of rural and tribal collegiate students. First-generation learners communicate in a spectrum of regional dialects and tribal languages:
* **Nimadi & Malvi:** Indo-Aryan vernaculars across the Nimar and Malwa plains (Khargone, Khandwa, Barwani, Dhar, Ujjain).
* **Bundelkhandi (Bundeli):** Central MP (Sagar, Damoh, Chhatarpur, Tikamgarh, Panna).
* **Bagheli (Baghelkhand):** Eastern MP (Rewa, Satna, Sidhi, Singrauli).
* **Bhili & Bhilali:** Western tribal belt (Alirajpur, Jhabua, Dhar, Barwani) spoken by ~5 million citizens.
* **Gondi:** Central & Eastern tribal belt (Betul, Chhindwara, Mandla, Dindori, Seoni).

Commercial speech engines (Google Speech, AWS Transcribe) fail because they are acoustically trained on standard Devanagari Hindi spoken with urban accents. When a student in Jhabua or Barwani speaks with regional intonations, phonetic elisions, and localized loan words, commercial ASR word error rates (WER) exceed **58%**.

---

## 2. Multi-Tiered Voice Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          VOICE SUBSYSTEM TOPOLOGY                           │
└─────────────────────────────────────────────────────────────────────────────┘
          Student Spoken Query (Voice Note from Device Microphone)
                                     │
                                     ▼
                  [On-Device Pre-Processing & VAD]
                  - WebRTC Voice Activity Detection (VAD)
                  - Noise gate filter (removes rural wind/traffic)
                  - 16 kHz Mono PCM audio buffer
                                     │
                                     ▼
                       [Network Connectivity Prober]
                      ┌──────────────┴──────────────┐
                      ▼                             ▼
           [State: 0 kbps / Offline]       [State: Connected >20 kbps]
                      │                             │
                      ▼                             ▼
           [Edge Acoustic Keyword Spotter] [Bhashini Indic Speech Gateway]
           - TFLite Model (<4.0 MB)        - ULCA Pipeline (Dhruva API)
           - Matches top 120 commands:     - Fine-tuned Indic ASR
             "स्कॉलरशिप" (Scholarship)     - Raw Phonetic Transcription
             "इतिहास पाठ" (History Lesson)          │
             "मेंटर कॉल" (Mentor Call)              ▼
                      │               [Dialect Normalization Gateway]
                      │               - Phonological regex rules
                      │               - Canonical Hindi translation
                      │                             │
                      └──────────────┬──────────────┘
                                     ▼
                     [Intent & Entity Extraction Engine]
                                     │
                                     ▼
                     [Curriculum RAG / Scholarship Match]
                                     │
                                     ▼
                     [Voice Audio Response Generation]
                      ├── If Online: Bhashini IndicTTS (Natural Hindi Audio)
                      └── If Offline: Local Android TTS Engine (hi-IN)
```

---

## 3. Bhashini Indic Speech Integration (Govt of India ULCA Pipeline)

VidyaSetu MP interfaces directly with **Bhashini (National Language Translation Mission, Ministry of Electronics and Information Technology - MeitY)** via the Universal Language Contribution APIs (ULCA).

### 3.1 Python Production Gateway Implementation (`backend/services/bhashini_service.py`)

```python
import base64
import requests
import json
from typing import Optional, Dict, Any

class BhashiniVoiceGateway:
    DHRUVA_INFERENCE_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"
    
    def __init__(self, user_id: str, api_key: str):
        self.user_id = user_id
        self.api_key = api_key
        self.headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json"
        }

    def transcribe_audio_payload(self, audio_bytes: bytes, source_lang: str = "hi") -> Optional[str]:
        """
        Transcribes compressed speech bytes using Bhashini IndicASR pipeline.
        Audio must be 16kHz mono WAV or FLAC.
        """
        base64_audio = base64.b64encode(audio_bytes).decode('utf-8')
        
        payload = {
            "pipelineTasks": [
                {
                    "taskType": "asr",
                    "config": {
                        "language": {
                            "sourceLanguage": source_lang
                        },
                        "serviceId": "ai4bharat/conformer-hi-gpu",
                        "audioFormat": "wav",
                        "samplingRate": 16000
                    }
                }
            ],
            "inputData": {
                "audio": [
                    {
                        "audioContent": base64_audio
                    }
                ]
            }
        }

        try:
            response = requests.post(
                self.DHRUVA_INFERENCE_URL,
                headers=self.headers,
                json=payload,
                timeout=12.0 # High-latency tolerant timeout
            )
            response.raise_for_status()
            data = response.json()
            
            # Extract transcript from pipeline task response
            output_tasks = data.get("pipelineResponse", [])
            if output_tasks and "output" in output_tasks[0]:
                raw_text = output_tasks[0]["output"][0]["source"]
                return self.normalize_dialect(raw_text)
            return None
        except Exception as e:
            print(f"[Bhashini Error] ASR pipeline execution failed: {str(e)}")
            return None

    @staticmethod
    def normalize_dialect(raw_text: str) -> str:
        """
        Maps vernacular dialect phonetic variants to canonical Hindi terms.
        """
        normalized = raw_text
        phonological_rules = [
            (r"\bहमारो\b", "हमारा"),
            (r"\bकद\b", "कब"),
            (r"\bआवेगो\b", "आएगा"),
            (r"\bकाए\b", "क्या"),
            (r"\bकित\b", "कहाँ"),
            (r"\bमनक\b", "लोग"),
            (r"\bकालिज\b", "कॉलेज"),
            (r"\bछोरा\b", "छात्र"),
            (r"\bछोरी\b", "छात्रा"),
            (r"\bसिकलरशिप\b", "छात्रवृत्ति")
        ]
        for pattern, replacement in phonological_rules:
            normalized = normalized.replace(pattern, replacement)
        return normalized
```

---

## 4. Dialect Phonological Normalization Rules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DIALECT PHONETIC NORMALIZATION MATRIX                   │
├──────────────┬─────────────────────────────┬────────────────────────────────┤
│ DIALECT      │ SPOKEN PHONETIC INPUT       │ CANONICAL HINDI TARGET         │
├──────────────┼─────────────────────────────┼────────────────────────────────┤
│ Nimadi       │ "हमारो छात्रवृत्ति कद आवगो?" │ "हमारी छात्रवृत्ति कब आएगी?"   │
├──────────────┼─────────────────────────────┼────────────────────────────────┤
│ Malvi        │ "सिंधु घाटी का मनक कई खाता?"│ "सिंधु सभ्यता के लोग क्या खाते?"│
├──────────────┼─────────────────────────────┼────────────────────────────────┤
│ Bundeli      │ "कालिज में कमरा को पइसा कित?"│ "कॉलेज में आवास सहायता कैसे?"  │
├──────────────┼─────────────────────────────┼────────────────────────────────┤
│ Bagheli      │ "फार्म म का कागद लागी?"     │ "फॉर्म में क्या दस्तावेज़ लगेंगे?"│
├──────────────┼─────────────────────────────┼────────────────────────────────┤
│ Bhili/Bhilali│ "मास्टर जी को फोन कसं लगाव?" │ "शिक्षक मेंटर को कैसे संपर्क करें?"│
└──────────────┴─────────────────────────────┴────────────────────────────────┘
```

---

## 5. Offline Acoustic Keyword Spotter (TFLite Edge Model)

When the student's phone has **0 kbps connectivity**, speech cannot be transmitted to Bhashini servers. VidyaSetu embeds a lightweight **TensorFlow Lite Acoustic Keyword Spotting Model** (<4.0 MB):
* **Model Architecture:** Depthwise-separable convolutional neural network (DS-CNN).
* **Quantization:** 8-bit integer quantization (INT8).
* **Inference Latency:** < 45 milliseconds on MediaTek Helio A22 quad-core processor.
* **Trained Vocabulary (120 Keywords):** Core educational and operational navigation terms:
  * Navigation: *"होम"* (Home), *"किताब"* (Books), *"पाठ"* (Lesson), *"बैक"* (Back), *"आगे"* (Next).
  * Welfare: *"छात्रवृत्ति"* (Scholarship), *"आवास"* (Housing), *"फॉर्म"* (Form), *"अंतिम तिथि"* (Deadline).
  * Doubts: *"सवाल"* (Doubt), *"उत्तर"* (Answer), *"शिक्षक"* (Teacher), *"दोबारा बोलें"* (Repeat).

---

## 6. Telephony IVR Fallback (For 2G Feature Phone Users)

For students in extreme forest belts (Pati in Barwani, Patalkot in Chhindwara) who do not own smartphones or whose device batteries are drained:
* **Toll-Free Number:** Dial `1800-XXX-VIDYA`.
* **Standard GSM Voice Trunk:** Utilizes ordinary circuit-switched 2G voice channels (requiring zero packet data).
* **Interactive Voice Menu:** Powered by Asterisk/FreeSWITCH integrated with the Bhashini Speech Pipeline:
  1. *"प्रेस 1: छात्रवृत्ति की जानकारी के लिए"* (Press 1 for Scholarship Info).
  2. *"प्रेस 2: आज के 3 मिनट के सामान्य ज्ञान ऑडियो पाठ के लिए"* (Press 2 for 3-minute GK lesson).
  3. *"प्रेस 3: कॉलेज मेंटर से बात करने के लिए"* (Press 3 to queue callback with college mentor).
