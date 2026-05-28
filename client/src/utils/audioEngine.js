/**
 * Audio Engine for Malayalam Prime
 * Handles playback of phonetic sounds and feedback effects.
 */

class AudioEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.isMuted = false;

    // Try to find a Malayalam-compatible voice if available
    this.loadVoice();
  }

  loadVoice() {
    if (!this.synth || typeof this.synth.getVoices !== 'function') {
      return;
    }
    const voices = this.synth.getVoices();
    // Try to find a voice that supports Malayalam or a generic Indian English one as fallback
    this.voice = voices.find(v => v.lang.includes('ml')) || voices.find(v => v.lang.includes('hi')) || voices[0];
  }

  /**
   * Speak a Malayalam grapheme/word using browser TTS (Placeholder)
   */
  speak(text) {
    if (this.isMuted || !this.synth) return;

    // Cancel any current speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) utterance.voice = this.voice;
    utterance.lang = 'ml-IN';
    utterance.rate = 0.8; // Speak slightly slower for child-friendly pace
    
    this.synth.speak(utterance);
  }

  /**
   * Play a specific sound file (For future use with high-quality .mp3s)
   */
  playSound(filename) {
    if (this.isMuted) return;
    const audio = new Audio(`/audio/${filename}`);
    audio.play().catch(err => console.log('Audio playback prevented:', err));
  }

  setMuted(muted) {
    this.isMuted = muted;
  }
}

export const audioEngine = new AudioEngine();
