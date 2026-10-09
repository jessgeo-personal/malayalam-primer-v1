import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioEngine, audioEngine, playWordSound, getAudioUrlForWord } from '../services/audioEngine.js';

describe('AUDIO-01: Bounded Audio Pipeline & Fallback Engine', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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

    it('speakText cancels pending utterances and invokes speak with ml-IN rate 0.85', () => {
      const speakMock = vi.fn();
      const cancelMock = vi.fn();
      const mockMlVoice = { name: 'Malayalam Female', lang: 'ml-IN' };

      window.speechSynthesis = {
        getVoices: vi.fn().mockReturnValue([mockMlVoice]),
        speak: speakMock,
        cancel: cancelMock
      };

      const engine = new AudioEngine();
      engine.speakText('മലയാളം');

      expect(cancelMock).toHaveBeenCalled();
      expect(speakMock).toHaveBeenCalled();
      const calledUtterance = speakMock.mock.calls[0][0];
      expect(calledUtterance.text).toBe('മലയാളം');
      expect(calledUtterance.lang).toBe('ml-IN');
      expect(calledUtterance.rate).toBe(0.85);
      expect(calledUtterance.voice).toEqual(mockMlVoice);
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
  });
});
