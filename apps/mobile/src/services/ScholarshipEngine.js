import { SCHOLARSHIPS_DATA } from '../data/scholarships';

/**
 * Deterministic Offline Scholarship Evaluation Engine
 * Runs 100% on-device in under 5ms without requiring any network call.
 */
export function evaluateScholarships(profile) {
  const {
    category = 'ST',
    gender = 'FEMALE',
    annualIncome = 120000,
    twelfthPercentage = 72,
    hasSambalCard = true,
    isRentingRoom = false,
  } = profile;

  return SCHOLARSHIPS_DATA.map((scholarship) => {
    const reasons = [];
    let eligible = true;

    // 1. Social Category Check
    if (!scholarship.categories.includes(category)) {
      eligible = false;
      reasons.push(`वर्ग असंगत: यह योजना केवल ${scholarship.categories.join(', ')} हेतु मान्य है`);
    }

    // 2. Gender Check
    if (scholarship.genders && !scholarship.genders.includes('ALL') && !scholarship.genders.includes(gender)) {
      eligible = false;
      reasons.push(`लिंग असंगत: यह योजना केवल ${scholarship.genders.includes('FEMALE') ? 'छात्राओं' : 'छात्रों'} हेतु है`);
    }

    // 3. Income Ceiling Check
    if (annualIncome > scholarship.maxIncome) {
      eligible = false;
      reasons.push(`वार्षिक आय सीमा अधिक: अधिकतम आय ₹${scholarship.maxIncome.toLocaleString('en-IN')} होनी चाहिए`);
    }

    // 4. Academic Percentage Cutoff Check
    if (twelfthPercentage < scholarship.minPercentage) {
      eligible = false;
      reasons.push(`12वीं प्रतिशत कम: न्यूनतम ${scholarship.minPercentage}% अनिवार्य है`);
    }

    // 5. Sambal Card Requirement Check
    if (scholarship.requiresSambal && !hasSambalCard) {
      eligible = false;
      reasons.push(`संबल 2.0 पंजीयन कार्ड अनिवार्य है`);
    }

    // 6. Rented Accommodation Requirement Check
    if (scholarship.requiresRentedRoom && !isRentingRoom) {
      eligible = false;
      reasons.push(`किराए के मकान का अनुबंध एवं प्रमाण-पत्र आवश्यक`);
    }

    const catPassed = scholarship.categories.includes(category);
    const genderPassed = !scholarship.genders || scholarship.genders.includes('ALL') || scholarship.genders.includes(gender);
    const incomePassed = annualIncome <= scholarship.maxIncome;
    const marksPassed = twelfthPercentage >= scholarship.minPercentage;
    const sambalPassed = !scholarship.requiresSambal || !!hasSambalCard;
    const rentPassed = !scholarship.requiresRentedRoom || !!isRentingRoom;

    const rulesEvaluated = [
      {
        rule: 'सामाजिक वर्ग (Category)',
        passed: catPassed,
        reason: catPassed ? `पात्र (${category})` : `केवल ${scholarship.categories.join(', ')} हेतु मान्य`,
      },
      {
        rule: 'लिंग पात्रता (Gender)',
        passed: genderPassed,
        reason: genderPassed ? 'पात्र' : `केवल ${scholarship.genders && scholarship.genders.includes('FEMALE') ? 'छात्राओं' : 'छात्रों'} हेतु`,
      },
      {
        rule: 'वार्षिक आय सीमा (Income Ceiling)',
        passed: incomePassed,
        reason: incomePassed
          ? `स्वीकृत (₹${annualIncome.toLocaleString('en-IN')} ≤ ₹${scholarship.maxIncome.toLocaleString('en-IN')})`
          : `अधिक (अधिकतम ₹${scholarship.maxIncome.toLocaleString('en-IN')})`,
      },
      {
        rule: '12वीं कटऑफ प्रतिशत (12th Marks)',
        passed: marksPassed,
        reason: marksPassed
          ? `अर्ह (${twelfthPercentage}% ≥ ${scholarship.minPercentage}%)`
          : `न्यूनतम ${scholarship.minPercentage}% अनिवार्य`,
      },
    ];

    if (scholarship.requiresSambal) {
      rulesEvaluated.push({
        rule: 'संबल 2.0 पंजीयन (Sambal 2.0)',
        passed: sambalPassed,
        reason: sambalPassed ? 'संबल 2.0 कार्ड सत्यापित' : 'संबल 2.0 कार्ड आवश्यक',
      });
    }

    if (scholarship.requiresRentedRoom) {
      rulesEvaluated.push({
        rule: 'किराया आवास पात्रता (Rented Room)',
        passed: rentPassed,
        reason: rentPassed ? 'किराया अनुबंध सत्यापित' : 'किराए का कमरा आवश्यक',
      });
    }

    return {
      ...scholarship,
      isEligible: eligible,
      rejectionReasons: reasons,
      rulesEvaluated,
      documentsRequired: scholarship.requiredDocs || [],
    };
  });
}
