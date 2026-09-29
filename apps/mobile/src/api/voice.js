// VidyaSetu MP — Vernacular Voice & Dialect API
// Normalizes spoken dialects (Nimadi, Malvi, Bundeli, Bhili) into Canonical Academic Hindi
import apiClient from './client.js';

export const voiceApi = {
  /**
   * Normalizes vernacular dialect text into canonical academic Hindi and extracts academic intent
   */
  normalizeText: async (spokenText, dialectHint = 'hi') => {
    return apiClient.post('/api/v1/voice/normalize', {
      spoken_text: spokenText,
      dialect_hint: dialectHint,
    });
  },

  /**
   * Transcribes base64 audio payload via Bhashini ULCA IndicASR
   */
  transcribeAudioBase64: async (audioBase64, sourceLanguage = 'hi', dialectHint = 'hi') => {
    return apiClient.post('/api/v1/voice/transcribe', {
      audio_base64: audioBase64,
      source_language: sourceLanguage,
      dialect_hint: dialectHint,
    });
  },
};

export default voiceApi;
