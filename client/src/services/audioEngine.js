/**
 * Audio Engine for Malayalam Prime
 * Manages static audio assets (/audio/words/${wordId}.mp3)
 * with robust, non-crashing fallback to browser SpeechSynthesis.
 */

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
 * Fallback to browser SpeechSynthesis
 * @param {string} text - Native Malayalam text
 * @returns {Promise<void>}
 */
function fallbackSpeechSynthesis(text) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const UtteranceClass = typeof window.SpeechSynthesisUtterance !== 'undefined'
        ? window.SpeechSynthesisUtterance
        : (typeof SpeechSynthesisUtterance !== 'undefined' ? SpeechSynthesisUtterance : null);

      if (!UtteranceClass) {
        resolve();
        return;
      }

      const utterance = new UtteranceClass(text);
      utterance.lang = 'ml-IN';
      utterance.rate = 0.8;

      if (typeof window.speechSynthesis.getVoices === 'function') {
        const voices = window.speechSynthesis.getVoices() || [];
        const mlVoice = voices.find(v => v.lang && v.lang.includes('ml')) ||
                        voices.find(v => v.lang && v.lang.includes('hi')) ||
                        voices[0];
        if (mlVoice) utterance.voice = mlVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);

      // Failsafe timeout in case onend never triggers in headless/mocked environments
      setTimeout(() => resolve(), 1000);
    } catch (err) {
      console.warn('Speech synthesis playback fallback failed:', err);
      resolve();
    }
  });
}

/**
 * Plays the audio for a word, prioritizing the static pre-generated audio asset
 * and falling back gracefully to speech synthesis if missing or playback fails.
 * @param {Object} wordItem - Object with wordId and malayalamText
 * @returns {Promise<void>}
 */
export async function playWordSound(wordItem) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!wordItem) {
    return;
  }

  const audioUrl = getAudioUrlForWord(wordItem);
  const malayalamText = wordItem.malayalamText || '';

  if (!audioUrl || typeof window.Audio === 'undefined') {
    await fallbackSpeechSynthesis(malayalamText);
    return;
  }

  try {
    await new Promise((resolve, reject) => {
      let resolved = false;
      const audio = new window.Audio(audioUrl);

      const cleanup = () => {
        resolved = true;
      };

      if (typeof audio.addEventListener === 'function') {
        audio.addEventListener('ended', () => {
          if (!resolved) {
            cleanup();
            resolve();
          }
        }, { once: true });

        audio.addEventListener('error', (err) => {
          if (!resolved) {
            cleanup();
            reject(err);
          }
        }, { once: true });
      }

      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            // Some browsers resolve immediately on playback start; wait for ended listener
            // or timeout safely
            setTimeout(() => {
              if (!resolved) {
                cleanup();
                resolve();
              }
            }, 1500);
          })
          .catch((err) => {
            if (!resolved) {
              cleanup();
              reject(err);
            }
          });
      }
    });
  } catch (err) {
    // Static asset failed or not found - seamless fallback
    await fallbackSpeechSynthesis(malayalamText);
  }
}

/**
 * Helper to play phonetic sound or raw Malayalam string
 * @param {string} text - Native Malayalam character or text
 * @returns {Promise<void>}
 */
export async function playPhoneticSound(text) {
  if (!text) return;
  await fallbackSpeechSynthesis(text);
}

/**
 * AudioEngine class for backwards compatibility with existing UI components
 */
export class AudioEngine {
  constructor() {
    this.isMuted = false;
  }

  loadVoice() {
    // Handled dynamically in fallbackSpeechSynthesis
  }

  speak(text) {
    if (this.isMuted) return;
    fallbackSpeechSynthesis(text);
  }

  playSound(filename) {
    if (this.isMuted || typeof window === 'undefined' || typeof window.Audio === 'undefined') return;
    try {
      const audio = new window.Audio(`/audio/${filename}`);
      audio.play().catch(err => console.log('Audio playback prevented:', err));
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  playWord(wordItem) {
    if (this.isMuted) return Promise.resolve();
    return playWordSound(wordItem);
  }

  setMuted(muted) {
    this.isMuted = muted;
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;
