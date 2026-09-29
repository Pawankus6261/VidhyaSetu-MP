# VidyaSetu MP — Hyperlocal Rural Career Decision Engine
from typing import List, Dict, Any
from backend.schemas.career import (
    CareerRecommendRequest,
    CareerPathwayItem,
    CareerRecommendResponse,
)

DISTRICT_SPECIALIZATIONS = {
    "Barwani": "कपास उत्पादन, मिर्च प्रसंस्करण (बेड़िया मंडी), ड्रिप सिंचाई एवं केला टिशू कल्चर",
    "Khargone": "कपास जीनिंग, निमाड़ मिर्च निर्यात मंडी, कृषि लॉजिस्टिक्स एवं सौर ऊर्जा पम्पिंग",
    "Jhabua": "लघु वनोपज (महुआ, चिरौंजी), कड़कनाथ कुक्कुट पालन, जैविक मोटे अनाज (ज्वार, बाजरा)",
    "Alirajpur": "ट्राइफेड वन धन केंद्र, महुआ प्रसंस्करण, आम की नूरजहां किस्म एवं हस्तशिल्प",
    "Dindori": "कोदो-कुटकी मोटा अनाज प्रसंस्करण, औषधीय जड़ी-बूटी संग्रहण, कान्हा इको-टूरिज्म",
    "Mandla": "घने साल वनोपज, मत्स्य पालन, दुग्ध सहकारी समितियां एवं वनरक्षक कार्य",
    "Sagar": "दलहन (चना/मसूर) प्रसंस्करण, कृषि मशीनरी मरम्मत, बैंक ग्राहक सेवा केंद्र (BC/CSP)",
    "Damoh": "कृषि यंत्रीकरण, डेयरी फार्मिंग एवं लघु उद्योग",
    "Dhar": "पीथमपुर औद्योगिक क्षेत्र, ऑटोमोबाइल फैब्रिकेशन, कृषि उपकरण निर्माण",
}

MASTER_PATHWAYS = [
    {
        "horizon_id": 1,
        "horizon_name": "State Public Service & Administrative Exams",
        "title": "MP ESB / Vyapam (वनरक्षक, पटवारी एवं पुलिस आरक्षक भर्ती)",
        "description": "मध्य प्रदेश कर्मचारी चयन मंडल द्वारा आयोजित राज्य स्तरीय सीधी भर्ती परीक्षाएं।",
        "target_role": "वनरक्षक / पटवारी / आरक्षक (Forest Guard / Patwari / Constable)",
        "monthly_earning_estimate": "₹19,500 – ₹28,000 / माह (नियमित शासकीय वेतनमान)",
        "time_horizon": "MEDIUM_TERM",
        "prerequisites": ["12वीं उत्तीर्ण / स्नातक", "शारीरिक दक्षता (दौड़, ऊंचाई)", "आयु 18-33 वर्ष"],
        "offline_modules": [
            "सामान्य हिंदी एवं व्याकरण (40 ऑडियो पाठ)",
            "मध्य प्रदेश सामान्य ज्ञान एवं भूगोल (60 ऑडियो पाठ)",
            "प्राथमिक गणित एवं तार्किक क्षमता (प्रैक्टिस टेस्ट)"
        ]
    },
    {
        "horizon_id": 2,
        "horizon_name": "Rural Agro-Processing & Cooperative Value Chains",
        "title": "ट्राइफेड वन धन केंद्र एवं कृषि-सहकारी मूल्य संवर्धन",
        "description": "स्थानीय कृषि उपज एवं वनोपज (महुआ, चिरौंजी, मिर्च, कोदो-कुटकी) का मूल्य संवर्धन एवं पैकेजिंग।",
        "target_role": "वन धन केंद्र प्रबंधक / कृषि ग्रेडिंग सुपरवाइजर / FPO संचालक",
        "monthly_earning_estimate": "₹12,000 – ₹22,000 / माह (सहकारी लाभांश सहित)",
        "time_horizon": "IMMEDIATE",
        "prerequisites": ["10वीं / 12वीं / B.Sc (Agri/Bio)", "स्थानीय मंडी समझ"],
        "offline_modules": [
            "वनोपज ग्रेडिंग एवं प्राथमिक प्रसंस्करण दिशानिर्देश",
            "FPO एवं सहकारिता पंजीयन प्रक्रिया",
            "डिजिटल ई-नाम (e-NAM) मंडी संचालन"
        ]
    },
    {
        "horizon_id": 3,
        "horizon_name": "Digital Public & Financial Services Infrastructure",
        "title": "बैंक मित्र (Bank Business Correspondent) एवं CSC कॉमन सर्विस सेंटर",
        "description": "ग्राम पंचायत स्तर पर डिजिटल बैंकिंग, आधार निकासी (AePS), एवं सरकारी योजनाओं के आवेदन सेवाएं।",
        "target_role": "बैंक बीसी सखी / सीएससी वीएलई / डाक भुगतान बैंक मित्र",
        "monthly_earning_estimate": "₹10,000 – ₹18,000 / माह (कमीशन आधारित)",
        "time_horizon": "IMMEDIATE",
        "prerequisites": ["12वीं उत्तीर्ण", "IIBF बीसी प्रमाण पत्र", "स्मार्टफोन / बायोमेट्रिक डिवाइस"],
        "offline_modules": [
            "IIBF बैंक मित्र परीक्षा तैयारी गाइड",
            "माइक्रो-एटीएम एवं बायोमेट्रिक सुरक्षा मानक",
            "MPTAAS एवं समग्र नागरिक सेवा फॉर्म प्रशिक्षण"
        ]
    },
    {
        "horizon_id": 4,
        "horizon_name": "Decentralized Green Economy & Technical Trades",
        "title": "पीएम-कुसुम सोलर पंप एवं ग्रामीण इलेक्ट्रिक वाहन (EV) मेंटेनेंस",
        "description": "ग्रामीण क्षेत्रों में स्थापित सोलर सिंचाई पंपों का रखरखाव एवं 2-व्हीलर ई-वाहन सर्विसिंग।",
        "target_role": "सोलर तकनीशियन / ग्रामीण ऊर्जा ऑपरेटर",
        "monthly_earning_estimate": "₹14,000 – ₹24,000 / माह",
        "time_horizon": "MEDIUM_TERM",
        "prerequisites": ["10वीं / ITI / B.Sc Physics", "तकनीकी रुझान"],
        "offline_modules": [
            "सोलर फोटोवोल्टाइक पंप इन्वर्टर फॉल्ट डायग्नोसिस",
            "लिथियम बैटरी एवं बीएमएस मूल सिद्धांत",
            "पीएम-कुसुम कंपोनेंट-बी सब्सिडी गाइड"
        ]
    },
    {
        "horizon_id": 5,
        "horizon_name": "Academic Progression & Higher Research",
        "title": "उच्च शिक्षा एवं शोध फैलोशिप (IGNTU / DAVV / Barkatullah)",
        "description": "विश्वविद्यालय स्नातकोत्तर (M.A., M.Sc.) एवं राष्ट्रीय जनजातीय शोध फैलोशिप (NFST)।",
        "target_role": "असिस्टेंट प्रोफेसर / अनुसंधान अध्येता (UGC Fellow)",
        "monthly_earning_estimate": "₹31,000 – ₹42,000 / माह (JRF / शोध छात्रवृत्ति)",
        "time_horizon": "LONG_TERM",
        "prerequisites": ["स्नातक में न्यूनतम 55% अंक", "CUET-PG / MP SLET पात्रता"],
        "offline_modules": [
            "UGC-NET / SLET प्रथम प्रश्नपत्र तैयारी",
            "शोध प्रविधि एवं ऐतिहासिक स्रोत विश्लेषण",
            "राष्ट्रीय जनजातीय फैलोशिप आवेदन प्रक्रिया"
        ]
    }
]

class CareerService:
    @classmethod
    def recommend(cls, request: CareerRecommendRequest) -> CareerRecommendResponse:
        dist = request.district.strip().title()
        specialization = DISTRICT_SPECIALIZATIONS.get(dist, "कृषि प्रसंस्करण, लघु उद्यम एवं सामान्य प्रतियोगी परीक्षाएं")
        
        # Filter and rank pathways according to student constraints
        ranked_pathways = []
        for p in MASTER_PATHWAYS:
            # Check horizon match
            score = 100
            if p["time_horizon"] == request.earning_time_horizon:
                score += 30
            if not request.can_migrate_urban and p["horizon_id"] in [2, 3, 4]:
                score += 20 # strong preference for local home district livelihoods
            elif request.can_migrate_urban and p["horizon_id"] in [1, 5]:
                score += 15

            ranked_pathways.append((score, p))

        ranked_pathways.sort(key=lambda x: x[0], reverse=True)
        top_pathways = [
            CareerPathwayItem(
                horizon_id=p["horizon_id"],
                horizon_name=p["horizon_name"],
                title=p["title"],
                description=p["description"],
                target_role=p["target_role"],
                monthly_earning_estimate=p["monthly_earning_estimate"],
                prerequisites=p["prerequisites"],
                offline_modules=p["offline_modules"],
                district_specialization=specialization if p["horizon_id"] in [2, 4] else None
            )
            for _, p in ranked_pathways[:3]
        ]

        action_step = (
            f"आपके गृह जिले {dist} में '{top_pathways[0].target_role}' के लिए ऑफलाइन स्टडी पैक डाउनलोड करें।"
            if not request.can_migrate_urban
            else f"MP ESB परीक्षा या विश्वविद्यालय उच्च शिक्षा के लिए आगामी कैलेंडर की जांच करें।"
        )

        return CareerRecommendResponse(
            student_district=dist,
            degree_stream=request.degree_stream,
            can_migrate=request.can_migrate_urban,
            recommended_pathways=top_pathways,
            district_economic_context=specialization,
            immediate_action_step=action_step
        )
