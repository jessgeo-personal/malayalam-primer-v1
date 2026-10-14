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

/**
 * Retrieves the stored auth token from localStorage.
 * Checks mp_auth_token, auth_token, mp_token, and token keys.
 *
 * @returns {string|null} The auth token if found, or null
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  let token =
    localStorage.getItem('mp_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('mp_auth_token') ||
    localStorage.getItem('auth_token');
  if (!token) return null;
  // Clean any double-quotes from JSON.stringify
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }
  return token;
};

/**
 * Returns request headers including Authorization: Bearer ${token} if an auth token exists.
 *
 * @param {Record<string, string>} [headers] - Existing headers object
 * @returns {Record<string, string>} Headers with Authorization attached if present
 */
export const getAuthHeaders = (headers = {}) => {
  const token = getAuthToken();
  const authHeaders = { ...headers };
  if (token && !authHeaders['Authorization'] && !authHeaders['authorization']) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }
  return authHeaders;
};

/**
 * Fetch wrapper that automatically attaches the Bearer token to request headers.
 *
 * @param {string|URL} url - The URL to fetch
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<Response>} The fetch response promise
 */
export const authFetch = (url, options = {}) => {
  const headers = getAuthHeaders(options.headers || {});
  return fetch(url, { ...options, headers });
};

