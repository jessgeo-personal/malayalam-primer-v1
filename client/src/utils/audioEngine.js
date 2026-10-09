/**
 * Audio Engine Bridge for Malayalam Prime
 * Re-exports the consolidated service from client/src/services/audioEngine.js
 */

export {
  AudioEngine,
  audioEngine,
  HAS_STATIC_AUDIO_ASSETS,
  getAudioUrlForWord,
  playWordSound,
  playPhoneticSound,
  default
} from '../services/audioEngine.js';
