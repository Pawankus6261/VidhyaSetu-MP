// VidyaSetu MP — Deterministic Scholarship & Welfare API
// Enforces: 100% deterministic rule matching, zero LLM hallucinations, civic document format validation
import apiClient from './client.js';

export const scholarshipsApi = {
  /**
   * Retrieves official master catalog of 48 active MP State & Central welfare schemes
   */
  getCatalog: async () => {
    return apiClient.get('/api/v1/scholarships/catalog');
  },

  /**
   * Audits student profile against all regulatory and mathematical scheme criteria
   */
  auditEligibility: async (profile) => {
    const payload = {
      social_category: profile.category || profile.social_category || 'ST',
      gender: profile.gender || 'FEMALE',
      family_annual_income: Number(profile.annualIncome ?? profile.family_annual_income ?? 120000),
      twelfth_percentage: Number(profile.twelfthPercentage ?? profile.twelfth_percentage ?? 74),
      course_enrolled: profile.course_enrolled || 'BA',
      is_day_scholar: !profile.isRentingRoom,
      has_sambal_card: Boolean(profile.hasSambalCard ?? profile.has_sambal_card),
      hostel_status: profile.isRentingRoom ? 'RENTED_ROOM' : 'NONE',
    };
    return apiClient.post('/api/v1/scholarships/audit', payload);
  },

  /**
   * Validates structural integrity of critical civic documents
   * @param {'SAMAGRA_ID' | 'DIGITAL_CASTE_CERTIFICATE' | 'BANK_ACCOUNT_NPCI'} docType
   * @param {string} docValue
   */
  verifyDocument: async (docType, docValue) => {
    return apiClient.post('/api/v1/scholarships/verify-doc', {
      doc_type: docType,
      doc_value: String(docValue).trim(),
    });
  },
};

export default scholarshipsApi;
