// VidyaSetu MP — System Diagnostics & Health API
import apiClient from './client.js';

export const systemApi = {
  getHealth: async () => {
    return apiClient.get('/health', { timeout: 3500 });
  },

  getInfo: async () => {
    return apiClient.get('/api/v1/system/info');
  },
};

export default systemApi;
