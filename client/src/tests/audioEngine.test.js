import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioEngine, audioEngine, playWordSound, getAudioUrlForWord } from '../services/audioEngine.js';

describe('AUDIO-01: Bounded Audio Pipeline & Fallback Engine', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete window.__currentSpeechUtterance;
  });

  it('should resolve correct static asset path for a word item', () => {
    const word = { wordId: 'w001', malayalamText: 'ഞാൻ' };
    const url = getAudioUrlForWord(word);
    expect(url).toBe('/audio/words/w001.mp3');
  });

  it('should immediately speak via SpeechSynthesis without instantiating Audio when HAS_STATIC_AUDIO_ASSETS is false', async () => {
    const speakMock = vi.fn();
    window.speechSynthesis = {
      speak: speakMock,
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([])
    };

    const audioConstructorMock = vi.fn();
    window.Audio = audioConstructorMock;

    const word = { wordId: 'w999', malayalamText: 'അമ്മ' };
    await expect(playWordSound(word)).resolves.not.toThrow();

    // Verify window.Audio was never called (0 network latency)
    expect(audioConstructorMock).not.toHaveBeenCalled();
    expect(speakMock).toHaveBeenCalled();
  });

  it('should attempt static audio and fall back cleanly to speech synthesis if static audio is enabled but unavailable', async () => {
    const speakMock = vi.fn();
    window.speechSynthesis = {
      speak: speakMock,
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([])
    };

    // Mock Audio failure
    const audioInstanceMock = {
      play: vi.fn().mockRejectedValue(new Error('Asset not found')),
      addEventListener: vi.fn((event, cb) => {
        if (event === 'error') cb(new Error('Asset not found'));
      })
    };
    window.Audio = vi.fn().mockImplementation(() => audioInstanceMock);

    const testEngine = new AudioEngine();
    testEngine.hasStaticAudioAssets = true;

    const word = { wordId: 'w999', malayalamText: 'അമ്മ' };
    await expect(testEngine.playWord(word)).resolves.not.toThrow();
    expect(window.Audio).toHaveBeenCalledWith('/audio/words/w999.mp3');
    expect(speakMock).toHaveBeenCalled();
  });

  describe('AudioEngine Class Features', () => {
    it('initializes voices and updates them when voiceschanged fires', () => {
      const mockVoices1 = [{ name: 'English Voice', lang: 'en-US' }];
      const mockVoices2 = [
        { name: 'English Voice', lang: 'en-US' },
        { name: 'Malayalam Voice', lang: 'ml-IN' }
      ];

      let voicesChangedCb = null;
      window.speechSynthesis = {
        getVoices: vi.fn().mockReturnValue(mockVoices1),
        onvoiceschanged: null,
        addEventListener: vi.fn((event, cb) => {
          if (event === 'voiceschanged') voicesChangedCb = cb;
        }),
        speak: vi.fn(),
        cancel: vi.fn()
      };

      const engine = new AudioEngine();
      expect(engine.voices).toEqual(mockVoices1);
      expect(engine.getMalayalamVoice()).toBeNull();

      // Trigger voiceschanged event
      window.speechSynthesis.getVoices = vi.fn().mockReturnValue(mockVoices2);
      if (voicesChangedCb) {
        voicesChangedCb();
      } else if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged();
      }

      expect(engine.voices).toEqual(mockVoices2);
      const mlVoice = engine.getMalayalamVoice();
      expect(mlVoice).not.toBeNull();
      expect(mlVoice.lang).toBe('ml-IN');
    });

    it('speakText dispatches immediately with ml-IN rate 0.85 when idle without cancel penalty', () => {
      const speakMock = vi.fn();
      const cancelMock = vi.fn();
      const mockMlVoice = { name: 'Malayalam Female', lang: 'ml-IN' };

      window.speechSynthesis = {
        getVoices: vi.fn().mockReturnValue([mockMlVoice]),
        speak: speakMock,
        cancel: cancelMock,
        speaking: false,
        pending: false
      };

      const engine = new AudioEngine();
      engine.speakText('മലയാളം');

      expect(cancelMock).not.toHaveBeenCalled();
      expect(speakMock).toHaveBeenCalled();
      const calledUtterance = speakMock.mock.calls[0][0];
      expect(calledUtterance.text).toBe('മലയാളം');
      expect(calledUtterance.lang).toBe('ml-IN');
      expect(calledUtterance.rate).toBe(0.85);
      expect(calledUtterance.voice).toEqual(mockMlVoice);
    });

    it('speakText cancels and waits 50ms before dispatching when browser is actively speaking', () => {
      vi.useFakeTimers();
      try {
        const speakMock = vi.fn();
        const cancelMock = vi.fn();
        const mockMlVoice = { name: 'Malayalam Female', lang: 'ml-IN' };

        window.speechSynthesis = {
          getVoices: vi.fn().mockReturnValue([mockMlVoice]),
          speak: speakMock,
          cancel: cancelMock,
          speaking: true,
          pending: false
        };

        const engine = new AudioEngine();
        engine.speakText('മലയാളം');

        expect(cancelMock).toHaveBeenCalled();
        expect(speakMock).not.toHaveBeenCalled();

        vi.advanceTimersByTime(50);
        expect(speakMock).toHaveBeenCalled();
        const calledUtterance = speakMock.mock.calls[0][0];
        expect(calledUtterance.text).toBe('മലയാളം');
      } finally {
        vi.useRealTimers();
      }
    });

    it('speakText cancels pending dispatch timeout on rapid successive calls', () => {
      vi.useFakeTimers();
      try {
        const speakMock = vi.fn();
        const cancelMock = vi.fn();

        window.speechSynthesis = {
          getVoices: vi.fn().mockReturnValue([]),
          speak: speakMock,
          cancel: cancelMock,
          speaking: true,
          pending: false
        };

        const engine = new AudioEngine();
        engine.speakText('ആദ്യ');
        expect(cancelMock).toHaveBeenCalledTimes(1);

        // Advance 20ms (before 50ms timeout) and call again
        vi.advanceTimersByTime(20);
        expect(speakMock).not.toHaveBeenCalled();

        engine.speakText('രണ്ടാമത്തെ');
        expect(cancelMock).toHaveBeenCalledTimes(2);

        // Advance 50ms: only the second word should have been dispatched
        vi.advanceTimersByTime(50);
        expect(speakMock).toHaveBeenCalledTimes(1);
        expect(speakMock.mock.calls[0][0].text).toBe('രണ്ടാമത്തെ');
      } finally {
        vi.useRealTimers();
      }
    });

    it('suppresses console warning on standard interrupted and canceled errors but logs other errors', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      let capturedUtterance = null;
      window.speechSynthesis = {
        getVoices: vi.fn().mockReturnValue([]),
        speak: vi.fn((u) => { capturedUtterance = u; }),
        cancel: vi.fn(),
        speaking: false,
        paused: false
      };

      const engine = new AudioEngine();
      engine.speakText('മല');
      expect(capturedUtterance).not.toBeNull();

      // Trigger 'interrupted' - should not warn
      capturedUtterance.onerror({ error: 'interrupted' });
      expect(warnSpy).not.toHaveBeenCalled();

      // Trigger 'canceled' - should not warn
      engine.speakText('നഗരം');
      capturedUtterance.onerror({ error: 'canceled' });
      expect(warnSpy).not.toHaveBeenCalled();

      // Trigger genuine error - should warn
      engine.speakText('ഗ്രാമം');
      capturedUtterance.onerror({ error: 'audio-busy' });
      expect(warnSpy).toHaveBeenCalledWith('[AudioEngine TTS Error]', 'audio-busy');

      warnSpy.mockRestore();
    });

    it('playWord handles raw string input directly via speakText', async () => {
      const speakMock = vi.fn();
      window.speechSynthesis = {
        getVoices: vi.fn().mockReturnValue([]),
        speak: speakMock,
        cancel: vi.fn()
      };

      const engine = new AudioEngine();
      await engine.playWord('അമ്മ');

      expect(speakMock).toHaveBeenCalled();
      expect(speakMock.mock.calls[0][0].text).toBe('അമ്മ');
    });

    it('speak alias delegates to playWord handling both strings and objects', async () => {
      const speakMock = vi.fn();
      window.speechSynthesis = {
        getVoices: vi.fn().mockReturnValue([]),
        speak: speakMock,
        cancel: vi.fn()
      };

      const engine = new AudioEngine();
      const playWordSpy = vi.spyOn(engine, 'playWord');

      await engine.speak('ആന');
      expect(playWordSpy).toHaveBeenCalledWith('ആന', '');

      const wordObj = { wordId: 'w10', malayalamText: 'പൂച്ച' };
      await engine.speak(wordObj);
      expect(playWordSpy).toHaveBeenCalledWith(wordObj, '');
    });

    it('unsticks paused queue via window.speechSynthesis.resume()', () => {
      const resumeMock = vi.fn();
      const speakMock = vi.fn();

      window.speechSynthesis = {
        getVoices: vi.fn().mockReturnValue([]),
        speak: speakMock,
        cancel: vi.fn(),
        resume: resumeMock,
        paused: true,
        speaking: false
      };

      const engine = new AudioEngine();
      engine.speakText('വാഴ');

      expect(resumeMock).toHaveBeenCalled();
      expect(speakMock).toHaveBeenCalled();
    });

    it('retains strong reference on activeUtterance and window.__currentSpeechUtterance to prevent GC, then clears on onend/onerror', () => {
      let capturedUtterance = null;
      window.speechSynthesis = {
        getVoices: vi.fn().mockReturnValue([]),
        speak: vi.fn((u) => { capturedUtterance = u; }),
        cancel: vi.fn(),
        paused: false,
        speaking: false
      };

      const engine = new AudioEngine();
      expect(engine.activeUtterance).toBeNull();
      expect(window.__currentSpeechUtterance).toBeUndefined();

      engine.speakText('പൂന്തോട്ടം');
      expect(engine.activeUtterance).not.toBeNull();
      expect(window.__currentSpeechUtterance).toBe(engine.activeUtterance);
      expect(engine.activeUtterance.text).toBe('പൂന്തോട്ടം');

      // Trigger onend -> references should clear
      capturedUtterance.onend();
      expect(engine.activeUtterance).toBeNull();
      expect(window.__currentSpeechUtterance).toBeNull();

      // Trigger speak again and test onerror -> references should clear
      engine.speakText('കാട്');
      expect(engine.activeUtterance).not.toBeNull();
      expect(window.__currentSpeechUtterance).toBe(engine.activeUtterance);

      capturedUtterance.onerror({ error: 'canceled' });
      expect(engine.activeUtterance).toBeNull();
      expect(window.__currentSpeechUtterance).toBeNull();
    });

    it('extracts text from diverse component data shapes (character, letter, char, text, word, malayalamText)', async () => {
      const speakMock = vi.fn();
      window.speechSynthesis = {
        getVoices: vi.fn().mockReturnValue([]),
        speak: speakMock,
        cancel: vi.fn(),
        paused: false,
        speaking: false
      };

      const engine = new AudioEngine();

      await engine.playWord({ character: 'അ' });
      expect(speakMock.mock.calls.at(-1)[0].text).toBe('അ');

      await engine.playWord({ letter: 'ന' });
      expect(speakMock.mock.calls.at(-1)[0].text).toBe('ന');

      await engine.playWord({ char: 'ക' });
      expect(speakMock.mock.calls.at(-1)[0].text).toBe('ക');

      await engine.playWord({ text: 'മാൻ' });
      expect(speakMock.mock.calls.at(-1)[0].text).toBe('മാൻ');

      await engine.playWord({ word: 'ആന' });
      expect(speakMock.mock.calls.at(-1)[0].text).toBe('ആന');

      await engine.playWord({ malayalamText: 'ഞാൻ' });
      expect(speakMock.mock.calls.at(-1)[0].text).toBe('ഞാൻ');
    });
  });
});
