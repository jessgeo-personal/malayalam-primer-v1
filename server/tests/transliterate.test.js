import { describe, it, expect } from 'vitest';
import { transliterateMalayalam } from '../utils/transliterate.js';

describe('DATA-01: Phonetic Transliteration Utility', () => {
  it('should accurately transliterate basic pronouns', () => {
    expect(transliterateMalayalam('ഞാൻ')).toBe('njan');
    expect(transliterateMalayalam('അവൻ')).toBe('avan');
  });

  it('should accurately transliterate complex conjuncts and chillu letters', () => {
    expect(transliterateMalayalam('ഉണ്ട്')).toBe('undu');
    expect(transliterateMalayalam('അമ്മ')).toBe('amma');
    expect(transliterateMalayalam('എന്തുകൊണ്ട്')).toBe('enthukond');
  });

  it('should handle suffixes cleanly', () => {
    expect(transliterateMalayalam('-ൽ')).toBe('-il');
    expect(transliterateMalayalam('-ഓ')).toBe('-o');
  });
});
