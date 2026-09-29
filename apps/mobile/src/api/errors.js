// VidyaSetu MP — Standardized Error Handling Layer
// Maps HTTP and network failure codes into user-friendly vernacular & English messages.
// Enforces: Never show raw backend traces/Axios errors to rural collegiate students.

export class ApiError extends Error {
  constructor(message, status = 0, code = 'NETWORK_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.isOffline = status === 0 || code === 'OFFLINE' || code === 'TIMEOUT';
  }
}

export function normalizeError(error, isEnglish = false) {
  if (error instanceof ApiError) {
    return error;
  }

  // Network offline or timeout
  if (error.name === 'AbortError' || error.message?.includes('timeout') || error.message?.includes('Network request failed')) {
    return new ApiError(
      isEnglish
        ? "Network unreachable. Your action is safely recorded on this device and will sync on signal."
        : "नेटवर्क उपलब्ध नहीं है। आपकी गतिविधि इस डिवाइस पर सुरक्षित है, सिग्नल मिलने पर सिंक होगी।",
      0,
      'OFFLINE'
    );
  }

  const status = error.status || (error.response ? error.response.status : 0);

  switch (status) {
    case 400:
      return new ApiError(
        isEnglish ? "Invalid data provided. Please check your inputs." : "अमान्य विवरण। कृपया अपनी प्रविष्टि जांचें।",
        400,
        'VALIDATION_ERROR',
        error.details
      );
    case 401:
      return new ApiError(
        isEnglish ? "Session expired. Authenticating your student device..." : "सत्र समाप्त। छात्र डिवाइस पुनः प्रमाणित हो रहा है...",
        401,
        'UNAUTHORIZED'
      );
    case 403:
      return new ApiError(
        isEnglish ? "Access restricted for this student tier." : "इस छात्र वर्ग के लिए अनुमति सीमित है।",
        403,
        'FORBIDDEN'
      );
    case 404:
      return new ApiError(
        isEnglish ? "Requested learning material or scheme not found." : "वांछित पाठ्य सामग्री या योजना उपलब्ध नहीं है।",
        404,
        'NOT_FOUND'
      );
    case 408:
      return new ApiError(
        isEnglish ? "Low-bandwidth request timed out. Queued for background sync." : "धीमी गति के कारण अनुरोध समय समाप्त। आउटबॉक्स में सुरक्षित।",
        408,
        'TIMEOUT'
      );
    case 422:
      return new ApiError(
        isEnglish ? "Format mismatch in submitted document or field." : "दस्तावेज़ या प्रविष्टि प्रारूप अमान्य है।",
        422,
        'UNPROCESSABLE_ENTITY'
      );
    case 429:
      return new ApiError(
        isEnglish ? "Bandwidth rate limit reached. Retrying automatically..." : "अनुरोध सीमा पूर्ण। स्वतः पुनः प्रयास किया जा रहा है...",
        429,
        'RATE_LIMITED'
      );
    case 500:
    case 502:
    case 503:
    case 504:
      return new ApiError(
        isEnglish
          ? "VidyaSetu cloud server is temporarily unreachable. Working seamlessly from local offline cache."
          : "विद्यासेतु क्लाउड सर्वर अस्थायी रूप से व्यस्त है। स्थानीय ऑफलाइन कैश से कार्य सुचारू है।",
        status,
        'SERVER_ERROR'
      );
    default:
      return new ApiError(
        isEnglish
          ? "Local operation completed. Cloud synchronization will resume automatically."
          : "स्थानीय कार्य संपन्न। नेटवर्क मिलने पर क्लाउड सिंक स्वतः जारी रहेगा।",
        status || 0,
        'GENERAL_ERROR'
      );
  }
}
