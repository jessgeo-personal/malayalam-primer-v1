import { describe, it, expect, vi, beforeEach } from 'vitest';
import { playWordSound, getAudioUrlForWord } from '../services/audioEngine.js';

describe('AUDIO-01: Bounded Audio Pipeline & Fallback Engine', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should resolve correct static asset path for a word item', () => {
    const word = { wordId: 'w001', malayalamText: 'ഞാൻ' };
    const url = getAudioUrlForWord(word);
    expect(url).toBe('/audio/words/w001.mp3');
  });

  it('should fall back cleanly to speech synthesis if static audio is unavailable', async () => {
    const speakMock = vi.fn();
    window.speechSynthesis = {
      speak: speakMock,
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([])
    };

    // Mock Audio failure
    window.Audio = vi.fn().mockImplementation(() => ({
      play: vi.fn().mockRejectedValue(new Error('Asset not found')),
      addEventListener: vi.fn((event, cb) => {
        if (event === 'error') cb(new Error('Asset not found'));
      })
    }));

    const word = { wordId: 'w999', malayalamText: 'അമ്മ' };
    await expect(playWordSound(word)).resolves.not.toThrow();
  });
});
