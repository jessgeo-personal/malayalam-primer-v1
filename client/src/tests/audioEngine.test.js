import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AudioEngine,
  audioEngine,
  playWordSound,
  playPhoneticSound,
  getAudioUrlForWord,
  getLetterAudioFilename
} from '../services/audioEngine.js';

describe('AUDIO-03: Codepoint Normalization, Dynamic Fallback & Audio Engine', () => {
  let mockAudioInstances = [];

  class MockAudio {
    constructor(url) {
      this.url = url;
      this.play = vi.fn().mockReturnValue(Promise.resolve());
      this.pause = vi.fn();
      this.onended = null;
      this.onerror = null;
      mockAudioInstances.push(this);
    }
  }

  beforeEach(() => {
    vi.restoreAllMocks();
    mockAudioInstances = [];
    window.Audio = MockAudio;
  });

  describe('getLetterAudioFilename Utility', () => {
    it('generates valid ASCII hex codepoint filenames for single characters', () => {
      expect(getLetterAudioFilename('ത')).toBe('letter_0d24.mp3');
      expect(getLetterAudioFilename('അ')).toBe('letter_0d05.mp3');
      expect(getLetterAudioFilename('ാ')).toBe('letter_0d3e.mp3');
    });

    it('generates valid ASCII hex codepoint filenames for conjuncts', () => {
      // 'മ്മ' consists of 'മ' (0d2e), '്' (0d4d), 'മ' (0d2e)
      expect(getLetterAudioFilename('മ്മ')).toBe('letter_0d2e_0d4d_0d2e.mp3');
    });

    it('returns unknown.mp3 for empty or null input', () => {
      expect(getLetterAudioFilename('')).toBe('unknown.mp3');
      expect(getLetterAudioFilename(null)).toBe('unknown.mp3');
      expect(getLetterAudioFilename(undefined)).toBe('unknown.mp3');
    });
  });

  it('should resolve correct static asset path for a word item', () => {
    const word = { wordId: 'w001', malayalamText: 'ഞാൻ' };
    const url = getAudioUrlForWord(word);
    expect(url).toBe('/audio/words/w001.mp3');
  });

  it('playWord creates an HTML5 Audio instance pointing to /audio/words/{id}.mp3 and resolves true onended', async () => {
    const engine = new AudioEngine();
    const playPromise = engine.playWord('w001');

    expect(mockAudioInstances.length).toBe(1);
    const audio = mockAudioInstances[0];
    expect(audio.url).toBe('/audio/words/w001.mp3');
    expect(audio.play).toHaveBeenCalled();

    // Trigger onended
    audio.onended();

    const result = await playPromise;
    expect(result).toBe(true);
    expect(engine.currentAudio).toBeNull();
  });

  it('playWord handles word object with wordId and fallbackText', async () => {
    const engine = new AudioEngine();
    const playPromise = engine.playWord({ wordId: 'w042', malayalamText: 'അമ്മ' });

    expect(mockAudioInstances.length).toBe(1);
    const audio = mockAudioInstances[0];
    expect(audio.url).toBe('/audio/words/w042.mp3');
    
    audio.onended();

    const result = await playPromise;
    expect(result).toBe(true);
  });

  it('playLetter creates an HTML5 Audio instance with codepoint normalized path and resolves true onended', async () => {
    const engine = new AudioEngine();
    const playPromise = engine.playLetter('അ');

    const expectedUrl = `/audio/letters/letter_0d05.mp3`;
    expect(mockAudioInstances.length).toBe(1);
    const audio = mockAudioInstances[0];
    expect(audio.url).toBe(expectedUrl);
    expect(audio.play).toHaveBeenCalled();

    audio.onended();

    const result = await playPromise;
    expect(result).toBe(true);
  });

  it('playLetter automatically falls back to /api/audio/preview when static asset fails', async () => {
    const engine = new AudioEngine();
    const playPromise = engine.playLetter('ത');

    // 1st attempt: static asset
    expect(mockAudioInstances.length).toBe(1);
    expect(mockAudioInstances[0].url).toBe('/audio/letters/letter_0d24.mp3');

    // Simulate 404 or unsupported format on static asset
    mockAudioInstances[0].onerror();

    // Give microtask tick to trigger fallback
    await Promise.resolve();

    // 2nd attempt: dynamic fallback
    expect(mockAudioInstances.length).toBe(2);
    expect(mockAudioInstances[1].url).toContain('/api/audio/preview?text=%E0%B4%A4&tl=ml');
    expect(mockAudioInstances[1].url).toContain('saveAs=letters%2Fletter_0d24.mp3');

    // Simulate successful playback on fallback
    mockAudioInstances[1].onended();

    const result = await playPromise;
    expect(result).toBe(true);
  });

  it('playWord automatically falls back to /api/audio/preview when static asset fails and fallbackText is provided', async () => {
    const engine = new AudioEngine();
    const playPromise = engine.playWord('w001', 'അമ്മ');

    // 1st attempt: static asset
    expect(mockAudioInstances.length).toBe(1);
    expect(mockAudioInstances[0].url).toBe('/audio/words/w001.mp3');

    // Simulate static asset failure
    mockAudioInstances[0].onerror();
    await Promise.resolve();

    // 2nd attempt: dynamic fallback
    expect(mockAudioInstances.length).toBe(2);
    expect(mockAudioInstances[1].url).toContain('/api/audio/preview?text=%E0%B4%85%E0%B4%AE%E0%B5%8D%E0%B4%AE&tl=ml');
    expect(mockAudioInstances[1].url).toContain('saveAs=words%2Fw001.mp3');

    mockAudioInstances[1].onended();

    const result = await playPromise;
    expect(result).toBe(true);
  });

  it('playWord resolves false cleanly when onerror fires and no fallback is available', async () => {
    const engine = new AudioEngine();
    const playPromise = engine.playWord('missing_id');

    expect(mockAudioInstances.length).toBe(1);
    const audio = mockAudioInstances[0];
    expect(audio.url).toBe('/audio/words/missing_id.mp3');

    audio.onerror();

    const result = await playPromise;
    expect(result).toBe(false);
    expect(engine.currentAudio).toBeNull();
  });

  it('playWord silences NotSupportedError on playback catch without throwing', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const engine = new AudioEngine();

    // Override play to reject with NotSupportedError
    const originalMock = MockAudio;
    window.Audio = class NotSupportedAudio extends originalMock {
      constructor(url) {
        super(url);
        const err = new Error('Failed to load because no supported source was found');
        err.name = 'NotSupportedError';
        this.play = vi.fn().mockRejectedValue(err);
      }
    };

    const result = await engine.playWord('w001');

    expect(result).toBe(false);
    expect(engine.currentAudio).toBeNull();
    // NotSupportedError is silenced
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('interrupts previously playing audio when a new sound is played', async () => {
    const engine = new AudioEngine();
    
    // Start first audio
    const firstPromise = engine.playWord('w001');
    expect(mockAudioInstances.length).toBe(1);
    const firstAudio = mockAudioInstances[0];

    // Start second audio before first finishes
    const secondPromise = engine.playWord('w002');
    expect(mockAudioInstances.length).toBe(2);
    const secondAudio = mockAudioInstances[1];

    // First audio should have been paused
    expect(firstAudio.pause).toHaveBeenCalled();
    expect(secondAudio.play).toHaveBeenCalled();

    secondAudio.onended();
    const result2 = await secondPromise;
    expect(result2).toBe(true);
  });

  it('stop() pauses current audio and clears reference', () => {
    const engine = new AudioEngine();
    engine.playWord('w001');

    expect(mockAudioInstances.length).toBe(1);
    const audio = mockAudioInstances[0];
    expect(engine.currentAudio).toBe(audio);

    engine.stop();

    expect(audio.pause).toHaveBeenCalled();
    expect(engine.currentAudio).toBeNull();
  });

  it('setMuted(true) prevents playback and immediately resolves false', async () => {
    const engine = new AudioEngine();
    engine.setMuted(true);

    const result = await engine.playWord('w001');
    expect(result).toBe(false);
    expect(mockAudioInstances.length).toBe(0);
  });

  it('speak alias delegates to playWord for wordId or playLetter for characters', async () => {
    const engine = new AudioEngine();
    const playWordSpy = vi.spyOn(engine, 'playWord').mockResolvedValue(true);
    const playLetterSpy = vi.spyOn(engine, 'playLetter').mockResolvedValue(true);

    await engine.speak({ wordId: 'w005', malayalamText: 'അവൻ' });
    expect(playWordSpy).toHaveBeenCalledWith('w005', 'അവൻ');

    await engine.speak('ക');
    expect(playLetterSpy).toHaveBeenCalledWith('ക');

    await engine.speak({ malayalamText: 'ന' });
    expect(playLetterSpy).toHaveBeenCalledWith('ന');
  });

  it('helper functions playWordSound and playPhoneticSound work with default instance', async () => {
    const wordSpy = vi.spyOn(audioEngine, 'playWord').mockResolvedValue(true);
    const letterSpy = vi.spyOn(audioEngine, 'playLetter').mockResolvedValue(true);

    await playWordSound({ wordId: 'w100', malayalamText: 'പൂച്ച' });
    expect(wordSpy).toHaveBeenCalledWith({ wordId: 'w100', malayalamText: 'പൂച്ച' }, '');

    await playPhoneticSound('ത');
    expect(letterSpy).toHaveBeenCalledWith('ത');
  });
});
