export const SCHOLARSHIPS_DATA = [
  {
    id: "MP_ST_POST_MATRIC",
    title: "MPTAAS पोस्ट-मैट्रिक छात्रवृत्ति (ST/SC)",
    titleEn: "MPTAAS Post-Matric Scholarship (ST/SC)",
    department: "जनजातीय कार्य विभाग, मध्य प्रदेश शासन",
    departmentEn: "Tribal Affairs Department, Government of MP",
    benefit: "100% कॉलेज शिक्षण शुल्क प्रतिपूर्ति + ₹550/माह निर्वाह भत्ता",
    benefitEn: "100% College Tuition Fee Reimbursement + ₹550/mo Maintenance Allowance",
    annualEstimatedInr: 18000,
    categories: ["ST", "SC"],
    genders: ["ALL", "MALE", "FEMALE"],
    maxIncome: 250000,
    minPercentage: 33,
    portal: "MPTAAS (tribal.mp.gov.in)",
    requiredDocs: [
      "समग्र सदस्य आईडी (9 अंक)",
      "डिजिटल जाति प्रमाण-पत्र (16 अंक)",
      "नवीन आय प्रमाण-पत्र (सत्र 2026-27)",
      "10वीं एवं 12वीं की अंकसूची",
      "e-Pravesh आवंटन पत्र",
      "आधार-NPCI लिंक्ड बैंक खाता"
    ]
  },
  {
    id: "MP_SAMBAL_SHIKSHA",
    title: "संबल 2.0 जन कल्याण शिक्षा प्रोत्साहन योजना",
    titleEn: "Sambal 2.0 Jan Kalyan Education Promotion Scheme",
    department: "श्रम विभाग एवं उच्च शिक्षा विभाग, म.प्र.",
    departmentEn: "Labour & Higher Education Department, MP",
    benefit: "100% समस्त प्रवेश एवं शिक्षण शुल्क शासन द्वारा वहन",
    benefitEn: "100% Complete Admission & Tuition Fee Funded by MP Government",
    annualEstimatedInr: 25000,
    categories: ["ST", "SC", "OBC", "GEN"],
    genders: ["ALL", "MALE", "FEMALE"],
    maxIncome: 9999999,
    minPercentage: 33,
    requiresSambal: true,
    portal: "संबल 2.0 पोर्टल (medhavikalyan.mp.gov.in)",
    requiredDocs: [
      "माता या पिता का वैध संबल 2.0 पंजीयन कार्ड",
      "समग्र परिवार एवं सदस्य आईडी",
      "कॉलेज शुल्क रसीद / आवंटन पत्र",
      "बैंक खाता विवरण"
    ]
  },
  {
    id: "MP_AWAS_SAHAYATA",
    title: "आवास सहायता योजना (कमरा किराया भत्ता)",
    titleEn: "Awas Sahayata Yojana (Room Rent Allowance)",
    department: "जनजातीय एवं अनुसूचित जाति कल्याण विभाग",
    departmentEn: "Tribal & Scheduled Caste Welfare Department, MP",
    benefit: "₹1,000/माह (तहसील स्तर) से ₹1,500/माह (जिला मुख्यालय)",
    benefitEn: "₹1,000/mo (Tehsil) to ₹1,500/mo (District Headquarters) Rental Aid",
    annualEstimatedInr: 15000,
    categories: ["ST", "SC"],
    genders: ["ALL", "MALE", "FEMALE"],
    maxIncome: 250000,
    minPercentage: 33,
    requiresRentedRoom: true,
    portal: "MPTAAS पोर्टल (tribal.mp.gov.in)",
    requiredDocs: [
      "मकान मालिक के साथ किरायानामा",
      "मकान मालिक का बिजली बिल / समग्र आईडी",
      "कॉलेज प्राचार्य द्वारा हॉस्टल अन-उपलब्धता प्रमाण-पत्र"
    ]
  },
  {
    id: "MP_GAON_KI_BETI",
    title: "गाँव की बेटी योजना (ग्रामीण मेधावी छात्राएं)",
    titleEn: "Gaon Ki Beti Scheme (Rural Meritorious Girls)",
    department: "उच्च शिक्षा विभाग, मध्य प्रदेश शासन",
    departmentEn: "Higher Education Department, Government of MP",
    benefit: "₹500 प्रति माह (10 माह हेतु = ₹5,000 प्रति वर्ष)",
    benefitEn: "₹500 per month for 10 months (₹5,000/year scholarship)",
    annualEstimatedInr: 5000,
    categories: ["ST", "SC", "OBC", "GEN"],
    genders: ["FEMALE"],
    maxIncome: 9999999,
    minPercentage: 60,
    portal: "म.प्र. स्कॉलरशिप पोर्टल 2.0 (scholarshipportal.mp.nic.in)",
    requiredDocs: [
      "ग्राम पंचायत प्रमाण-पत्र (ग्रामीण निवासी सत्यापन)",
      "12वीं बोर्ड में 60%+ अंकसूची",
      "समग्र सदस्य आईडी",
      "बैंक पासबुक"
    ]
  },
  {
    id: "MP_MMVY",
    title: "मुख्यमंत्री मेधावी विद्यार्थी योजना (MMVY)",
    titleEn: "Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)",
    department: "तकनीकी शिक्षा एवं उच्च शिक्षा विभाग, म.प्र.",
    departmentEn: "Technical & Higher Education Department, MP",
    benefit: "100% सम्पूर्ण स्नातक पाठ्यक्रम शुल्क शासन द्वारा प्रतिपूर्ति",
    benefitEn: "100% Full Undergraduate Tuition Fee Reimbursement by State",
    annualEstimatedInr: 35000,
    categories: ["ST", "SC", "OBC", "GEN"],
    genders: ["ALL", "MALE", "FEMALE"],
    maxIncome: 600000,
    minPercentage: 70,
    portal: "मेधावी छात्र पोर्टल (medhavikalyan.mp.gov.in)",
    requiredDocs: [
      "12वीं में 70%+ (एमपी बोर्ड) या 85%+ (CBSE)",
      "तहसीलदार द्वारा जारी आय प्रमाण-पत्र (< ₹6 लाख)",
      "मध्य प्रदेश मूल निवासी प्रमाण-पत्र"
    ]
  }
];
