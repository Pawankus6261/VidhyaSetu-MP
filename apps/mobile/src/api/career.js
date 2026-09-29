// VidyaSetu MP — Hyperlocal Rural Career API
// Enforces: 5 Realistic Rural Economic Horizons, zero distress migration indicators
import apiClient from './client.js';

export const careerApi = {
  /**
   * Retrieves master list of rural economic career horizons
   */
  getPathways: async () => {
    return apiClient.get('/api/v1/career/pathways');
  },

  /**
   * Recommends contextual career pathways mapped to student degree & district economic cluster
   */
  getRecommendation: async ({ enrolledDegree = 'BA', district = 'Barwani', familyLandHoldingAcres = 2.0 }) => {
    const payload = {
      enrolled_degree: enrolledDegree,
      district,
      family_land_holding_acres: Number(familyLandHoldingAcres),
    };
    return apiClient.post('/api/v1/career/recommend', payload);
  },
};

export default careerApi;
