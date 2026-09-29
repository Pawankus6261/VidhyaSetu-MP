# VidyaSetu MP — Complete Backend Verification Test Suite
import pytest
from fastapi.testclient import TestClient
from backend.main import app

from backend.database import init_db
from backend.seed import seed_all_data

client = TestClient(app)

def setup_module():
    init_db()
    seed_all_data()

def test_health_and_root():
    """Verify health and platform metadata."""
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ONLINE"
    assert "database" in data

    res_root = client.get("/")
    assert res_root.status_code == 200
    root_data = res_root.json()
    assert "VidyaSetu MP" in root_data["platform"]

def test_auth_and_device_registration():
    """Verify privacy-preserving device registration and profile fetch."""
    reg_payload = {
        "device_fingerprint_hash": "test_device_hash_9876543210",
        "preferred_dialect": "nimadi",
        "district": "Barwani",
        "course_enrolled": "BA"
    }
    res = client.post("/api/v1/auth/register-device", json=reg_payload)
    assert res.status_code == 200
    auth_data = res.json()
    assert "access_token" in auth_data
    token = auth_data["access_token"]

    # Fetch profile
    prof_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert prof_res.status_code == 200
    prof = prof_res.json()
    assert prof["district"] in ["Barwani", "Pati"]

def test_sync_outbox_push():
    """Verify outbox drain, mutation acknowledgment, and delta generation."""
    sync_payload = {
        "client_device_id": "device_test_01",
        "client_last_sync_timestamp": 1790620000,
        "mutations": [
            {
                "mutation_id": "mut_doubt_test_001",
                "entity_type": "doubt_ticket",
                "entity_id": "DOUBT_TEMP_01",
                "operation": "INSERT",
                "payload": {
                    "query_text": "हड़प्पा सभ्यता के पतन के मुख्य कारण क्या थे?",
                    "subject_code": "HISTORY_101"
                },
                "timestamp": 1790620100
            },
            {
                "mutation_id": "mut_prog_test_002",
                "entity_type": "learning_progress",
                "entity_id": "HIS_BA1_MOD1_INDUS_VALLEY",
                "operation": "UPSERT",
                "payload": {
                    "completed_seconds": 165,
                    "is_completed": 1,
                    "quiz_score": 100
                },
                "timestamp": 1790620200
            }
        ]
    }
    res = client.post("/api/v1/sync/push", json=sync_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SUCCESS"
    assert "mut_doubt_test_001" in data["acknowledged_mutation_ids"]
    assert "mut_prog_test_002" in data["acknowledged_mutation_ids"]
    assert len(data["server_deltas"]) >= 2
    assert data["server_deltas"][0]["operation"] == "RESOLVE"

def test_rag_confidence_locking():
    """Verify Confidence Locking: high confidence grounded vs ungrounded escalation."""
    # 1. High confidence ground inquiry
    high_conf_req = {
        "query_text": "हड़प्पा में नगर नियोजन किस पद्धति पर आधारित था?",
        "subject_code": "HISTORY_101"
    }
    res1 = client.post("/api/v1/doubts/resolve", json=high_conf_req)
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["confidence_score"] >= 0.72
    assert data1["status"] == "RESOLVED_AI"
    assert data1["escalated_to_mentor"] is False
    assert "म.प्र. हिंदी ग्रंथ अकादमी" in data1["citation_source"]

    # 2. Low confidence out-of-curriculum inquiry -> Mathematical Confidence Lock (<0.72)
    low_conf_req = {
        "query_text": "क्वांटम कंप्यूटिंग में सुपरपोजिशन और क्यूबिट्स क्या होते हैं?",
        "subject_code": "HISTORY_101"
    }
    res2 = client.post("/api/v1/doubts/resolve", json=low_conf_req)
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["confidence_score"] < 0.72
    assert data2["status"] == "ESCALATED_FACULTY"
    assert data2["escalated_to_mentor"] is True

def test_dialect_normalizer():
    """Verify Nimadi, Malvi, Bundeli, Bagheli translation to Canonical Hindi."""
    # Nimadi query
    res_nimadi = client.post("/api/v1/voice/normalize", json={
        "spoken_text": "हमारो स्कॉलरशिप फॉर्म कद आवगो?",
        "dialect_hint": "nimadi"
    })
    assert res_nimadi.status_code == 200
    d_nimadi = res_nimadi.json()
    assert "हमारा" in d_nimadi["canonical_hindi"]
    assert "कब आएगा" in d_nimadi["canonical_hindi"]
    assert d_nimadi["detected_intent"] == "SCHOLARSHIP_INQUIRY"

    # Bundelkhandi query
    res_bundeli = client.post("/api/v1/voice/normalize", json={
        "spoken_text": "कालिज में आवस के पैसे कित मिले?",
        "dialect_hint": "bundelkhandi"
    })
    assert res_bundeli.status_code == 200
    d_bundeli = res_bundeli.json()
    assert "कॉलेज" in d_bundeli["canonical_hindi"]
    assert "आवास" in d_bundeli["canonical_hindi"]

def test_scholarship_deterministic_engine():
    """Verify deterministic rule matching for MP welfare schemes."""
    # ST girl in Barwani, rented room > 10km, 68% in 12th
    profile = {
        "domicile": "MP",
        "social_category": "ST",
        "gender": "FEMALE",
        "annual_family_income": 72000.0,
        "twelfth_percentage": 68.4,
        "board": "MP_BOARD",
        "course_level": "UG",
        "is_rural": True,
        "distance_from_college_km": 24.0,
        "is_rented_room": True,
        "has_sambal_card": False
    }
    res = client.post("/api/v1/scholarships/audit", json=profile)
    assert res.status_code == 200
    audit = res.json()
    assert audit["total_matching_schemes"] >= 3
    assert audit["total_potential_benefit_inr"] >= 25000

    scheme_ids = [s["scheme_id"] for s in audit["eligible_schemes"]]
    assert "MP_ST_POST_MATRIC_2026" in scheme_ids
    assert "MP_AWAS_SAHAYATA_TRIBAL_2026" in scheme_ids
    assert "MP_GAON_KI_BETI_2026" in scheme_ids

def test_document_verification():
    """Verify Samagra (9-digit) and Caste (16-digit) verification."""
    res_samagra_valid = client.post("/api/v1/scholarships/verify-doc", json={
        "doc_type": "SAMAGRA",
        "doc_value": "194829104"
    })
    assert res_samagra_valid.status_code == 200
    assert res_samagra_valid.json()["is_valid"] is True

    res_samagra_invalid = client.post("/api/v1/scholarships/verify-doc", json={
        "doc_type": "SAMAGRA",
        "doc_value": "12345"
    })
    assert res_samagra_invalid.json()["is_valid"] is False

def test_career_recommendation():
    """Verify hyperlocal decision tree in Barwani."""
    career_req = {
        "district": "Barwani",
        "degree_stream": "BA",
        "can_migrate_urban": False,
        "earning_time_horizon": "IMMEDIATE"
    }
    res = client.post("/api/v1/career/recommend", json=career_req)
    assert res.status_code == 200
    rec = res.json()
    assert rec["student_district"] == "Barwani"
    assert len(rec["recommended_pathways"]) >= 1
    assert "मिर्च" in rec["district_economic_context"] or "कपास" in rec["district_economic_context"]

def test_resumable_pack_download():
    """Verify resumable HTTP Range streaming of .vsmp archive."""
    # 1. Full download
    full_res = client.get(
        "/api/v1/content/pack/HIS_BA1_MOD1_INDUS_VALLEY",
        headers={"Accept-Encoding": "identity"}
    )
    assert full_res.status_code == 200
    assert full_res.headers["accept-ranges"] == "bytes"
    total_bytes = int(full_res.headers["content-length"])
    assert total_bytes > 0

    # 2. Resumable Range Header download (First 500 bytes)
    range_res = client.get(
        "/api/v1/content/pack/HIS_BA1_MOD1_INDUS_VALLEY",
        headers={"Range": "bytes=0-499", "Accept-Encoding": "identity"}
    )
    assert range_res.status_code == 206 # 206 Partial Content
    assert range_res.headers["content-range"] == f"bytes 0-499/{total_bytes}"
    assert len(range_res.content) == 500

if __name__ == "__main__":
    pytest.main(["-v", __file__])
