/**
 * Audio Engine for Malayalam Prime
 * Strictly relies on HTML5 Audio() playback of pre-generated static audio files
 * (/audio/words/{id}.mp3 and /audio/letters/{codepoint}.mp3)
 * with transparent, resilient dynamic fallback to backend TTS (/api/audio/preview).
 */

import { getApiUrl } from '../utils/api';

/**
 * Converts a Malayalam character or conjunct to a safe, deterministic ASCII filename
 * using hexadecimal Unicode code points (e.g. 'ത' -> 'letter_0d24.mp3').
 * @param {string} char - Malayalam character or conjunct
 * @returns {string} Codepoint filename
 */
export function getLetterAudioFilename(char) {
  if (!char) return 'unknown.mp3';
  const hex = Array.from(char)
    .map((c) => c.codePointAt(0).toString(16).padStart(4, '0'))
    .join('_');
  return `letter_${hex}.mp3`;
}

export class AudioEngine {
  constructor() {
    this.currentAudio = null;
    this.isMuted = false;
  }

  async playWord(wordOrId, fallbackText = '') {
    if (this.isMuted) return false;

    let wordId = '';
    let fallback = fallbackText;

    if (wordOrId && typeof wordOrId === 'object') {
      wordId = wordOrId.wordId || wordOrId.id || '';
      fallback = wordOrId.malayalamText || wordOrId.text || wordOrId.word || fallbackText;
    } else if (typeof wordOrId === 'string') {
      wordId = wordOrId;
    }

    if (!wordId && !fallback) return false;

    // 1. Attempt static audio asset
    if (wordId) {
      const staticUrl = `/audio/words/${wordId}.mp3`;
      const played = await this.playUrl(staticUrl);
      if (played) return true;
    }

    // 2. Resilient dynamic fallback to backend TTS
    if (fallback) {
      const saveAsParam = wordId ? `&saveAs=${encodeURIComponent(`words/${wordId}.mp3`)}` : '';
      const fallbackUrl = getApiUrl(`/api/audio/preview?text=${encodeURIComponent(fallback)}&tl=ml${saveAsParam}`);
      return this.playUrl(fallbackUrl);
    }

    return false;
  }

  async playLetter(letterOrChar) {
    if (this.isMuted) return false;

    const rawChar = (letterOrChar && typeof letterOrChar === 'object')
      ? (letterOrChar.character || letterOrChar.letter || letterOrChar.char || letterOrChar.malayalamText || letterOrChar.wordId || letterOrChar.id)
      : letterOrChar;

    if (!rawChar) return false;

    const filename = getLetterAudioFilename(rawChar);
    const staticUrl = `/audio/letters/${filename}`;

    // 1. Attempt static codepoint audio asset
    const played = await this.playUrl(staticUrl);
    if (played) return true;

    // 2. Resilient dynamic fallback to backend TTS preview
    const fallbackUrl = getApiUrl(`/api/audio/preview?text=${encodeURIComponent(rawChar)}&tl=ml&saveAs=${encodeURIComponent(`letters/${filename}`)}`);
    return this.playUrl(fallbackUrl);
  }

  playUrl(url) {
    if (this.isMuted || !url) return Promise.resolve(false);

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
      } catch (e) {
        // Ignore abort pause error
      }
      this.currentAudio = null;
    }

    return new Promise((resolve) => {
      const AudioConstructor = (typeof window !== 'undefined' && window.Audio) || (typeof Audio !== 'undefined' ? Audio : null);
      if (!AudioConstructor) {
        console.warn('[AudioEngine] HTML5 Audio constructor not available in environment.');
        return resolve(false);
      }

      let audio;
      try {
        audio = new AudioConstructor(url);
        this.currentAudio = audio;

        const cleanup = () => {
          if (this.currentAudio === audio) {
            this.currentAudio = null;
          }
          if (audio) {
            audio.onended = null;
            audio.onerror = null;
          }
        };

        audio.onended = () => {
          cleanup();
          resolve(true);
        };

        audio.onerror = () => {
          cleanup();
          // Silently resolve false on 404 / unsupported source so dynamic fallback can engage
          resolve(false);
        };

        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch((err) => {
            cleanup();
            // Silence NotSupportedError and AbortError from noisy console logging
            if (err && err.name !== 'NotSupportedError' && err.name !== 'AbortError') {
              console.warn(`[AudioEngine] Playback prevented for ${url}:`, err.message || err);
            }
            resolve(false);
          });
        }
      } catch (err) {
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
        resolve(false);
      }
    });
  }

  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
      } catch (e) {
        // Ignore
      }
      this.currentAudio = null;
    }
  }

  speak(target, fallbackText = '') {
    if (!target) return Promise.resolve(false);
    if (typeof target === 'object') {
      if (target.wordId) {
        return this.playWord(target.wordId, target.malayalamText || fallbackText);
      }
      if (target.character || target.letter || target.char) {
        return this.playLetter(target.character || target.letter || target.char);
      }
      if (target.malayalamText) {
        return this.playLetter(target.malayalamText);
      }
    }
    return this.playLetter(target);
  }

  playSound(filename) {
    return this.playUrl(`/audio/${filename}`);
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    if (this.isMuted) {
      this.stop();
    }
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
 * Standalone function for playing word audio
 * @param {Object|string} wordItem - Object with wordId or string ID
 * @param {string} [fallbackText=''] - Native Malayalam text fallback
 * @returns {Promise<boolean>}
 */
export function playWordSound(wordItem, fallbackText = '') {
  return audioEngine.playWord(wordItem, fallbackText);
}

/**
 * Standalone helper to play letter sound or raw Malayalam string
 * @param {string|Object} text - Native Malayalam character or object
 * @returns {Promise<boolean>}
 */
export function playPhoneticSound(text) {
  return audioEngine.playLetter(text);
}
