// VidyaSetu MP — Academic Doubt Resolution API (Hybrid RAG)
// Enforces: Mathematical Confidence Locking (< 0.72) and Faculty Mentor Escalation
import apiClient from './client.js';

export const doubtsApi = {
  /**
   * Resolves an academic question synchronously/online via Hybrid RAG
   * Returns grounded answer if confidence >= 0.72, or escalated mentor state if < 0.72
   */
  resolveDoubt: async ({ queryText, courseId = 'COURSE_HIS_BA1', dialectHint = 'hi', clientMutationId = null }) => {
    const payload = {
      query_text: queryText,
      student_id: apiClient.getDeviceId(),
      course_id: courseId,
      dialect_hint: dialectHint,
      client_mutation_id: clientMutationId || `mut_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    return apiClient.post('/api/v1/doubts/resolve', payload);
  },

  /**
   * Lists submitted doubt tickets and their resolution/escalation status
   */
  listTickets: async (statusFilter = null) => {
    const endpoint = statusFilter ? `/api/v1/doubts/tickets?status=${encodeURIComponent(statusFilter)}` : '/api/v1/doubts/tickets';
    return apiClient.get(endpoint);
  },

  /**
   * Resolves a ticket by faculty mentor (used in faculty mode / triage review)
   */
  resolveByMentor: async (ticketId, { mentorId, resolutionText, voiceNoteUri = null }) => {
    const payload = {
      mentor_id: mentorId,
      resolution_text: resolutionText,
      voice_note_uri: voiceNoteUri,
    };
    return apiClient.post(`/api/v1/doubts/tickets/${ticketId}/resolve-mentor`, payload);
  },
};

export default doubtsApi;
