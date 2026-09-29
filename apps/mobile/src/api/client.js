// VidyaSetu MP — Centralized Resilient API Client
// Purpose-built for 0 kbps to 40 kbps intermittent bandwidth in rural Madhya Pradesh.
// Features: Dynamic Host Resolution, Automatic Bearer JWT Injection, Idempotency Support, Timeout Protection.
let Platform = { OS: 'web' };
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RN = require('react-native');
  if (RN && RN.Platform) Platform = RN.Platform;
} catch (e) {
  // Running in Node or non-RN environment
}
import { ApiError, normalizeError } from './errors.js';

// 1. Determine default base URL based on device platform
const getPlatformDefaultBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Android emulator maps 10.0.2.2 to host machine's localhost
  if (Platform && Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }
  // Web / iOS simulator / Desktop localhost
  return 'http://127.0.0.1:8000';
};

class ApiClient {
  constructor() {
    this.baseUrl = getPlatformDefaultBaseUrl();
    this.authToken = null;
    this.deviceId = 'rural_student_device_mp';
    this.timeoutMs = 9000; // 9s timeout for 2G/3G bursts
  }

  setBaseUrl(url) {
    if (url && typeof url === 'string') {
      this.baseUrl = url.trim().replace(/\/+$/, '');
    }
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  getAuthToken() {
    return this.authToken;
  }

  setDeviceId(id) {
    if (id) this.deviceId = id;
  }

  getDeviceId() {
    return this.deviceId;
  }

  /**
   * Core request dispatcher with offline safety, timeout, and header enrichment
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      headers = {},
      body = null,
      idempotencyKey = null,
      timeout = this.timeoutMs,
      isEnglish = false,
    } = options;

    const fullUrl = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const reqHeaders = {
      Accept: 'application/json',
      ...headers,
    };

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    if (body && !isFormData && typeof body === 'object') {
      reqHeaders['Content-Type'] = 'application/json';
    }

    if (this.authToken) {
      reqHeaders['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (idempotencyKey) {
      reqHeaders['X-Idempotency-Key'] = idempotencyKey;
    }

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: reqHeaders,
        body: body && typeof body === 'object' && !isFormData
          ? JSON.stringify(body)
          : body,
        signal: controller.signal,
      });

      clearTimeout(timeoutTimer);

      // Handle HTTP Range 206 Partial Content or 200 binary response
      if (response.status === 206 || response.headers.get('content-type')?.includes('application/vnd.vidyasetu')) {
        return {
          status: response.status,
          isSuccess: true,
          response,
          data: null,
          error: null,
        };
      }

      let data = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new ApiError(
          data?.detail || `HTTP ${response.status}`,
          response.status,
          'API_ERROR',
          data
        );
        return {
          status: response.status,
          isSuccess: false,
          data: null,
          error: normalizeError(error, isEnglish),
        };
      }

      return {
        status: response.status,
        isSuccess: true,
        data,
        error: null,
      };
    } catch (err) {
      clearTimeout(timeoutTimer);
      return {
        status: 0,
        isSuccess: false,
        data: null,
        error: normalizeError(err, isEnglish),
      };
    }
  }

  // Convenience methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
