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

    return {
      ...scholarship,
      isEligible: eligible,
      rejectionReasons: reasons,
    };
  });
}
