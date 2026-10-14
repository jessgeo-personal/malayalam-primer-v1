import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getApiUrl, buildApiUrl } from '../utils/api';

describe('API URL Helper (getApiUrl & buildApiUrl)', () => {
  describe('buildApiUrl pure function', () => {
    it('returns clean relative path when base is empty or undefined', () => {
      expect(buildApiUrl('/api/auth/request-otp', '')).toBe('/api/auth/request-otp');
      expect(buildApiUrl('/api/auth/request-otp', undefined)).toBe('/api/auth/request-otp');
      expect(buildApiUrl('api/auth/request-otp', '')).toBe('/api/auth/request-otp');
    });

    it('concatenates base when base has no trailing slash or /api', () => {
      expect(buildApiUrl('/api/auth/request-otp', 'http://localhost:5000'))
        .toBe('http://localhost:5000/api/auth/request-otp');
      expect(buildApiUrl('api/auth/request-otp', 'http://localhost:5000'))
        .toBe('http://localhost:5000/api/auth/request-otp');
    });

    it('strips trailing slashes from base URL', () => {
      expect(buildApiUrl('/api/auth/request-otp', 'http://localhost:5000/'))
        .toBe('http://localhost:5000/api/auth/request-otp');
      expect(buildApiUrl('/api/auth/request-otp', 'http://localhost:5000///'))
        .toBe('http://localhost:5000/api/auth/request-otp');
    });

    it('prevents /api/api duplication when base ends with /api and endpoint starts with /api', () => {
      expect(buildApiUrl('/api/auth/request-otp', 'http://localhost:5000/api'))
        .toBe('http://localhost:5000/api/auth/request-otp');
      expect(buildApiUrl('/api/auth/request-otp', 'http://localhost:5000/api/'))
        .toBe('http://localhost:5000/api/auth/request-otp');
    });

    it('cleans up accidental doubled /api/api in endpoint when base is empty', () => {
      expect(buildApiUrl('/api/api/auth/request-otp', ''))
        .toBe('/api/auth/request-otp');
      expect(buildApiUrl('/api/api/progress/stats', ''))
        .toBe('/api/progress/stats');
    });

    it('handles query parameters and subpaths correctly', () => {
      expect(buildApiUrl('/api/session/lesson?userId=123&lessonId=1', 'http://127.0.0.1:5000'))
        .toBe('http://127.0.0.1:5000/api/session/lesson?userId=123&lessonId=1');
      expect(buildApiUrl('/api/session/lesson?userId=123&lessonId=1', 'http://127.0.0.1:5000/api'))
        .toBe('http://127.0.0.1:5000/api/session/lesson?userId=123&lessonId=1');
      expect(buildApiUrl('/api/session/lesson?userId=123&lessonId=1', ''))
        .toBe('/api/session/lesson?userId=123&lessonId=1');
    });
  });

  describe('getApiUrl integration', () => {
    it('returns a valid API URL resolving to single /api prefix', () => {
      const url = getApiUrl('/api/auth/request-otp');
      expect(url).not.toContain('/api/api');
      expect(url).toMatch(/(\/api\/auth\/request-otp)$/);
    });
  });

  describe('Auth Token and Headers Helper', () => {
    beforeEach(() => {
      localStorage.clear();
      vi.restoreAllMocks();
    });

    it('getAuthToken retrieves token from mp_auth_token or fallback keys and strips quotes', async () => {
      const { getAuthToken } = await import('../utils/api');
      expect(getAuthToken()).toBeNull();

      localStorage.setItem('mp_token', '"jwt_with_quotes"');
      expect(getAuthToken()).toBe('jwt_with_quotes');

      localStorage.clear();
      localStorage.setItem('token', 'jwt_raw');
      expect(getAuthToken()).toBe('jwt_raw');

      localStorage.clear();
      localStorage.setItem('mp_auth_token', 'jwt_mp_token');
      expect(getAuthToken()).toBe('jwt_mp_token');

      localStorage.clear();
      localStorage.setItem('auth_token', 'jwt_fallback');
      expect(getAuthToken()).toBe('jwt_fallback');
    });

    it('getAuthHeaders attaches Bearer Authorization when token is present', async () => {
      const { getAuthHeaders } = await import('../utils/api');
      localStorage.setItem('mp_auth_token', 'sample_token_xyz');

      const headers = getAuthHeaders({ 'Content-Type': 'application/json' });
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Bearer sample_token_xyz'
      });
    });

    it('authFetch invokes global fetch with attached Authorization header', async () => {
      const { authFetch } = await import('../utils/api');
      localStorage.setItem('mp_auth_token', 'test_bearer_abc');

      const mockFetch = vi.fn().mockResolvedValue({ ok: true, status: 200 });
      global.fetch = mockFetch;

      await authFetch('/api/session/lesson/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'p2' })
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/session/lesson/complete',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test_bearer_abc',
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });
});

