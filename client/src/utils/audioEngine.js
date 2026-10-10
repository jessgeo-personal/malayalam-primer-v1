/**
 * Audio Engine for Malayalam Prime
 * Manages static audio assets (/audio/words/${wordId}.mp3)
 * with robust, non-crashing fallback to browser SpeechSynthesis.
 */

/**
 * Configuration flag for pre-recorded static audio assets (/audio/words/*.mp3).
 * Set to false while in development or until Track C audio assets are placed in public/audio/words/.
 * Setting to false eliminates 1-2s network latency from 404 lookups and speaks instantly via TTS.
 */
export const HAS_STATIC_AUDIO_ASSETS = false;

export class AudioEngine {
  constructor() {
    this.voices = [];
    this.activeUtterance = null;
    this.speechTimeout = null;
    this.isMuted = false;
    this.hasStaticAudioAssets = HAS_STATIC_AUDIO_ASSETS;
    this.initVoices();
  }

  initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      try {
        if (typeof window.speechSynthesis.getVoices === 'function') {
          this.voices = window.speechSynthesis.getVoices() || [];
        }
      } catch (e) {
        this.voices = [];
      }
    };

    loadVoices();
    if (typeof window.speechSynthesis.addEventListener === 'function') {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  getMalayalamVoice() {
    if (!this.voices || this.voices.length === 0) {
      this.voices = typeof window !== 'undefined' && window.speechSynthesis && typeof window.speechSynthesis.getVoices === 'function'
        ? window.speechSynthesis.getVoices() || []
        : [];
    }
    return this.voices.find(v => v.lang === 'ml-IN' || (v.lang && v.lang.startsWith('ml'))) || null;
  }

  speakText(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
    if (this.isMuted) return;

    // Clear any pending dispatch timeout
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }

    const dispatchSpeech = () => {
      if (window.speechSynthesis.paused && typeof window.speechSynthesis.resume === 'function') {
        window.speechSynthesis.resume();
      }

      const UtteranceClass = (typeof window !== 'undefined' && window.SpeechSynthesisUtterance)
        || (typeof SpeechSynthesisUtterance !== 'undefined' ? SpeechSynthesisUtterance : null);

      const utterance = UtteranceClass
        ? new UtteranceClass(text)
        : { text, lang: 'ml-IN', rate: 0.85 };

      utterance.lang = 'ml-IN';
      utterance.rate = 0.85;

      const mlVoice = this.getMalayalamVoice();
      if (mlVoice) {
        utterance.voice = mlVoice;
      }

      // V8 GC Shield
      this.activeUtterance = utterance;
      if (typeof window !== 'undefined') {
        window.__currentSpeechUtterance = utterance;
      }

      utterance.onend = () => {
        this.activeUtterance = null;
        if (typeof window !== 'undefined') {
          window.__currentSpeechUtterance = null;
        }
      };

      utterance.onerror = (e) => {
        // 'interrupted' or 'canceled' are standard when switching sounds rapidly
        if (e && e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('[AudioEngine TTS Error]', e.error || e);
        }
        this.activeUtterance = null;
        if (typeof window !== 'undefined') {
          window.__currentSpeechUtterance = null;
        }
      };

      if (typeof window.speechSynthesis.speak === 'function') {
        window.speechSynthesis.speak(utterance);
      }
    };

    // If browser is actively speaking, cancel and wait 50ms for Chromium IPC to clear
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      if (typeof window.speechSynthesis.cancel === 'function') {
        window.speechSynthesis.cancel();
      }
      this.speechTimeout = setTimeout(dispatchSpeech, 50);
    } else {
      // Nothing is speaking: dispatch immediately without cancel penalty
      dispatchSpeech();
    }
  }

  async playWord(wordObjOrText, fallbackText = '') {
    if (this.isMuted) return;

    // Robust extraction covering all component data shapes:
    let textToSpeak = '';

    if (typeof wordObjOrText === 'string') {
      textToSpeak = wordObjOrText;
    } else if (wordObjOrText && typeof wordObjOrText === 'object') {
      textToSpeak =
        wordObjOrText.malayalamText ||
        wordObjOrText.character ||
        wordObjOrText.letter ||
        wordObjOrText.char ||
        wordObjOrText.word ||
        wordObjOrText.text ||
        fallbackText;
    } else {
      textToSpeak = fallbackText;
    }

    const wordId = typeof wordObjOrText === 'object' ? wordObjOrText?.wordId : null;

    if (!textToSpeak) return;

    // 1. Try static audio if enabled and wordId exists
    const hasStatic = this.hasStaticAudioAssets ?? HAS_STATIC_AUDIO_ASSETS;
    if (hasStatic && wordId) {
      try {
        const audioPath = `/audio/words/${wordId}.mp3`;
        const AudioClass = typeof window !== 'undefined' && window.Audio
          ? window.Audio
          : (typeof Audio !== 'undefined' ? Audio : null);

        if (!AudioClass) throw new Error('Audio constructor unavailable');

        const audio = new AudioClass(audioPath);

        await new Promise((resolve, reject) => {
          let finished = false;
          const onResolve = () => {
            if (!finished) {
              finished = true;
              resolve();
            }
          };
          const onReject = (err) => {
            if (!finished) {
              finished = true;
              reject(err);
            }
          };

          audio.onended = onResolve;
          audio.onerror = onReject;

          if (typeof audio.addEventListener === 'function') {
            audio.addEventListener('ended', onResolve, { once: true });
            audio.addEventListener('error', onReject, { once: true });
          }

          const playPromise = audio.play();
          if (playPromise && typeof playPromise.then === 'function') {
            playPromise.then(() => {
              setTimeout(onResolve, 2000);
            }).catch(onReject);
          }
        });
        return; // Successfully played static audio
      } catch {
        // Static file missing/404 — silently proceed to SpeechSynthesis
      }
    }

    // 2. Direct SpeechSynthesis fallback
    this.speakText(textToSpeak);
  }

  speak(wordObjOrText, fallbackText = '') {
    return this.playWord(wordObjOrText, fallbackText);
  }

  playSound(filename) {
    if (this.isMuted || typeof window === 'undefined' || typeof window.Audio === 'undefined') return;
    try {
      const audio = new window.Audio(`/audio/${filename}`);
      audio.play().catch(err => console.warn('Audio playback prevented:', err));
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;

/**
 * Returns the expected static audio asset URL for a word item.
 * @param {Object} wordItem - Object containing wordId (e.g. { wordId: 'w001' })
 * @returns {string} URL path to static mp3 asset
 */
export function getAudioUrlForWord(wordItem) {
  if (!wordItem || !wordItem.wordId) {
    return '';
  }
  return `/audio/words/${wordItem.wordId}.mp3`;
}

/**
 * Legacy standalone function for playing word audio
 * @param {Object} wordItem - Object with wordId and malayalamText
 * @returns {Promise<void>}
 */
export function playWordSound(wordItem) {
  return audioEngine.playWord(wordItem);
}

/**
 * Helper to play phonetic sound or raw Malayalam string
 * @param {string} text - Native Malayalam character or text
 * @returns {Promise<void>}
 */
export function playPhoneticSound(text) {
  return audioEngine.playWord(text);
}
