// VidyaSetu MP — Asynchronous Outbox Synchronization Engine
// Preserves: 0 kbps local mutation safety, CRDT delta reconciliation, and X-Idempotency-Key retry protection.
import { syncApi } from '../api/sync.js';

class SyncEngine {
  constructor() {
    this.outbox = [];
    this.lastSyncTimestamp = 0;
    this.isSyncing = false;
    this.listeners = new Set();

    // Pre-populate with sample queued items if appropriate, or empty
    this.outbox = [
      {
        mutation_id: 'MUT_SEED_01',
        entity_type: 'doubt_ticket',
        entity_id: 'DOUBT_02',
        operation: 'INSERT',
        payload: {
          query_text: 'लोथल बंदरगाह पर गोदी किस नदी के तट पर स्थित था?',
          course_id: 'COURSE_HIS_BA1',
          dialect_hint: 'hi',
        },
        timestamp: Date.now() - 1500000,
        status: 'PENDING',
        retryCount: 0,
      },
    ];
  }

  getPendingCount() {
    return this.outbox.filter((m) => m.status === 'PENDING').length;
  }

  getOutbox() {
    return [...this.outbox];
  }

  /**
   * Enqueues a local mutation into the offline outbox
   * @param {'learning_progress' | 'doubt_ticket' | 'user_profile' | 'scholarship_audit'} entityType
   * @param {string} entityId
   * @param {'INSERT' | 'UPSERT' | 'DELETE'} operation
   * @param {Object} payload
   */
  enqueueMutation(entityType, entityId, operation, payload) {
    const mutation = {
      mutation_id: `MUT_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entity_type: entityType,
      entity_id: entityId,
      operation,
      payload,
      timestamp: Date.now(),
      status: 'PENDING',
      retryCount: 0,
    };

    this.outbox.unshift(mutation);
    this.notifyListeners();
    return mutation;
  }

  /**
   * Drains the pending mutations to backend via POST /api/v1/sync/push
   */
  async drainOutbox(isOnline = true) {
    if (!isOnline || this.isSyncing) return { status: 'SKIPPED' };

    const pending = this.outbox.filter((m) => m.status === 'PENDING');
    if (pending.length === 0) return { status: 'CLEAN', count: 0 };

    this.isSyncing = true;
    this.notifyListeners();

    try {
      const payloadMutations = pending.map((m) => ({
        mutation_id: m.mutation_id,
        entity_type: m.entity_type,
        entity_id: m.entity_id,
        operation: m.operation,
        payload: m.payload,
        timestamp: Math.floor(m.timestamp / 1000),
      }));

      const idempotencyKey = `SYNC_BATCH_${Date.now()}_${pending.length}`;
      const res = await syncApi.pushMutations(payloadMutations, this.lastSyncTimestamp, idempotencyKey);

      if (res.isSuccess && res.data) {
        const ackSet = new Set(res.data.acknowledged_mutation_ids || []);

        // Mark only server-acknowledged mutations as synced
        this.outbox = this.outbox.map((m) => {
          if (ackSet.has(m.mutation_id)) {
            return { ...m, status: 'SYNCED' };
          }
          return m;
        });

        if (res.data.server_sync_timestamp) {
          this.lastSyncTimestamp = res.data.server_sync_timestamp;
        }

        this.isSyncing = false;
        this.notifyListeners();

        return {
          status: 'SUCCESS',
          acknowledgedCount: ackSet.size,
          deltas: res.data.server_deltas || [],
        };
      } else {
        // Increment retry count on failure, keep in outbox
        this.outbox = this.outbox.map((m) => (m.status === 'PENDING' ? { ...m, retryCount: m.retryCount + 1 } : m));
        this.isSyncing = false;
        this.notifyListeners();
        return { status: 'ERROR', error: res.error };
      }
    } catch (err) {
      this.isSyncing = false;
      this.notifyListeners();
      return { status: 'ERROR', error: err.message };
    }
  }

  addListener(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener({
          pendingCount: this.getPendingCount(),
          isSyncing: this.isSyncing,
          outbox: this.getOutbox(),
          lastSyncTimestamp: this.lastSyncTimestamp,
        });
      } catch (e) {
        console.error('SyncEngine listener error:', e);
      }
    }
  }
}

export const syncEngine = new SyncEngine();
export default syncEngine;
