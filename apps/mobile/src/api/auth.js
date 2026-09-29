// VidyaSetu MP — Authentication & Identity API
// Enforces: DPDP Act 2023 compliant privacy-preserving registration and Samagra ID authentication
import apiClient from './client.js';

export const authApi = {
  /**
   * Registers anonymous rural student device without upfront PII
   */
  registerDevice: async (params = {}) => {
    const fingerprint = params.device_fingerprint_hash || `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const payload = {
      device_fingerprint_hash: fingerprint,
      social_category: params.social_category || 'ST',
      district: params.district || 'Barwani',
      tehsil: params.tehsil || 'Pati',
      course_enrolled: params.course_enrolled || 'BA',
      preferred_dialect: params.preferred_dialect || 'hi',
    };
    const res = await apiClient.post('/api/v1/auth/register-device', payload);
    if (res.isSuccess && res.data?.access_token) {
      apiClient.setAuthToken(res.data.access_token);
      if (res.data.user_id) apiClient.setDeviceId(res.data.user_id);
    }
    return res;
  },

  /**
   * Authenticates via official 9-digit MP Samagra Member ID
   */
  loginSamagra: async (samagraId) => {
    const cleanId = String(samagraId).trim();
    const res = await apiClient.post('/api/v1/auth/login-samagra', { samagra_id: cleanId });
    if (res.isSuccess && res.data?.access_token) {
      apiClient.setAuthToken(res.data.access_token);
      if (res.data.user_id) apiClient.setDeviceId(res.data.user_id);
    }
    return res;
  },

  /**
   * Retrieves currently authenticated student profile
   */
  getProfile: async () => {
    return apiClient.get('/api/v1/auth/me');
  },

  /**
   * Updates student demographic attributes and preferences
   */
  updateProfile: async (profileUpdates) => {
    return apiClient.put('/api/v1/auth/profile', profileUpdates);
  },
};

export default authApi;
