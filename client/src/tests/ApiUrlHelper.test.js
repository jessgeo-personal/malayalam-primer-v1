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
});
