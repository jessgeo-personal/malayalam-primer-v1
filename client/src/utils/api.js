/**
 * Resolves an API URL given an endpoint path and a base URL.
 * Normalizes slashes and guarantees prevention of '/api/api' duplication.
 *
 * @param {string} endpoint - The API endpoint (e.g. '/api/auth/request-otp' or 'api/progress/stats')
 * @param {string} [base] - Optional base URL (e.g. 'http://localhost:5000' or '')
 * @returns {string} The normalized API URL
 */
export const buildApiUrl = (endpoint, base = '') => {
  const rawBase = (base || '').replace(/\/+$/, '');
  let cleanEndpoint = endpoint ? (endpoint.startsWith('/') ? endpoint : `/${endpoint}`) : '/';

  // Prevent accidental /api/api in endpoint regardless of base
  if (cleanEndpoint.startsWith('/api/api/')) {
    cleanEndpoint = cleanEndpoint.replace('/api/api/', '/api/');
  }

  // Prevent /api/api duplication if base already ends with /api
  if (rawBase.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    return `${rawBase}${cleanEndpoint.slice(4)}`;
  }

  return `${rawBase}${cleanEndpoint}`;
};

/**
 * Returns normalized API URL using VITE_API_URL if configured, or clean relative path.
 *
 * @param {string} endpoint - The API endpoint
 * @returns {string} Normalized API URL
 */
export const getApiUrl = (endpoint) => {
  return buildApiUrl(endpoint, import.meta.env?.VITE_API_URL);
};
