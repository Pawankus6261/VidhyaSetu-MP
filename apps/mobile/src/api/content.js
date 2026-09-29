// VidyaSetu MP — Content Delivery & .VSMP Micro-Packs API
// Supports: Resumable HTTP Range-Header streaming for 1.8 MB .vsmp archives over unstable 2G/3G connections
import apiClient from './client.js';

export const contentApi = {
  /**
   * Fetches approved State Universities in Madhya Pradesh
   */
  getUniversities: async () => {
    return apiClient.get('/api/v1/content/universities');
  },

  /**
   * Fetches official courses and lesson structures
   */
  getCourses: async () => {
    return apiClient.get('/api/v1/content/courses');
  },

  /**
   * Lists all available .vsmp packages ready for zero-byte offline download
   */
  listPacks: async () => {
    return apiClient.get('/api/v1/content/packs');
  },

  /**
   * Gets binary download URL for .vsmp package
   */
  getPackDownloadUrl: (packId) => {
    return `${apiClient.getBaseUrl()}/api/v1/content/pack/${packId}`;
  },

  /**
   * Checks or fetches partial chunk of .vsmp package with HTTP Range header
   */
  downloadPackRange: async (packId, startByte = 0, endByte = null) => {
    const rangeHeader = endByte !== null ? `bytes=${startByte}-${endByte}` : `bytes=${startByte}-`;
    return apiClient.get(`/api/v1/content/pack/${packId}`, {
      headers: {
        Range: rangeHeader,
      },
    });
  },
};

export default contentApi;
