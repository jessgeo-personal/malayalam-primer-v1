const path = require('path');
const fs = require('fs');

const GOOGLE_TTS_BASE_URL = 'https://translate.google.com/translate_tts';

/**
 * Converts a Malayalam character or conjunct to a safe ASCII filename
 * using hexadecimal Unicode code points (e.g. 'ത' -> 'letter_0d24.mp3').
 * @param {string} char - Malayalam character or conjunct
 * @returns {string} Codepoint filename
 */
function getLetterAudioFilename(char) {
  if (!char) return 'unknown.mp3';
  const hex = Array.from(char)
    .map((c) => c.codePointAt(0).toString(16).padStart(4, '0'))
    .join('_');
  return `letter_${hex}.mp3`;
}

/**
 * Fetches an MP3 buffer from Google Translate TTS.
 * @param {string} text - Native Malayalam or target text
 * @param {string} [lang='ml'] - Target language code
 * @returns {Promise<Buffer>}
 */
async function fetchTTSBuffer(text, lang = 'ml') {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Text is required to fetch TTS buffer');
  }

  const url = `${GOOGLE_TTS_BASE_URL}?ie=UTF-8&q=${encodeURIComponent(text.trim())}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`TTS request failed with status ${response.status}: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Writes an audio buffer to client/public/audio/{subfolder}/{cleanFilename}.mp3.
 * @param {string} subfolder - 'words' or 'letters'
 * @param {string} filename - Base filename with or without .mp3 extension
 * @param {Buffer} buffer - Audio MP3 buffer
 * @returns {string} Relative URL to the saved file
 */
function saveAudioFile(subfolder, filename, buffer) {
  if (!subfolder || !filename || !buffer) {
    throw new Error('subfolder, filename, and buffer are required');
  }

  const sanitizedSubfolder = (subfolder === 'words' || subfolder === 'letters') ? subfolder : 'words';
  const cleanFilename = filename.replace(/\.mp3$/, '');
  const audioDir = path.resolve(__dirname, '../../client/public/audio', sanitizedSubfolder);

  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const filePath = path.join(audioDir, `${cleanFilename}.mp3`);
  fs.writeFileSync(filePath, buffer);

  return `/audio/${sanitizedSubfolder}/${cleanFilename}.mp3`;
}

module.exports = {
  getLetterAudioFilename,
  fetchTTSBuffer,
  saveAudioFile
};
