// VidyaSetu MP — Asynchronous Outbox Drain & Synchronization API
// Purpose: Atomically drains pending client mutations over low-bandwidth bursts (40 kbps)
import apiClient from './client.js';

export const syncApi = {
  /**
   * Pushes a batch of queued client mutations (quiz scores, doubt tickets, profile edits)
   * @param {Array} mutations List of MutationItem objects
   * @param {number} lastSyncTimestamp Client's last known server timestamp
   * @param {string} idempotencyKey Unique key to guarantee idempotency across retries
   */
  pushMutations: async (mutations = [], lastSyncTimestamp = 0, idempotencyKey = null) => {
    const key = idempotencyKey || `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const payload = {
      client_device_id: apiClient.getDeviceId(),
      client_last_sync_timestamp: lastSyncTimestamp || 0,
      mutations,
    };

    return apiClient.post('/api/v1/sync/push', payload, {
      idempotencyKey: key,
      timeout: 12000, // Slightly longer timeout for batch sync
    });
  },

  /**
   * Pulls server-side deltas since client's last sync timestamp
   */
  pullDeltas: async (sinceTimestamp = 0) => {
    const deviceId = apiClient.getDeviceId();
    return apiClient.get(`/api/v1/sync/pull?client_device_id=${encodeURIComponent(deviceId)}&since_timestamp=${sinceTimestamp}`);
  },
};

export default syncApi;
