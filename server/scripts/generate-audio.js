const fs = require('fs');
const path = require('path');
const { fetchTTSBuffer, getLetterAudioFilename } = require('../services/audioService');

const WORDS_DIR = path.resolve(__dirname, '../../client/public/audio/words');
const LETTERS_DIR = path.resolve(__dirname, '../../client/public/audio/letters');
const SEED_FILES = ['seed-100.json', 'seed-200.json', 'seed-300.json'];
const DELAY_MS = 150;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasMalayalam(text) {
  return /[\u0D00-\u0D7F]/.test(text);
}

/**
 * Extracts unique words and characters across all seed files.
 */
function extractSeedAudioTargets(seedDir = path.resolve(__dirname, '../data')) {
  const wordsMap = new Map();
  const lettersSet = new Set();

  for (const filename of SEED_FILES) {
    const filePath = path.join(seedDir, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`[AudioGen] Seed file not found: ${filePath}`);
      continue;
    }

    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      for (const item of data) {
        // Collect words (excluding English concept cards)
        if (
          item.wordId &&
          item.malayalamText &&
          !item.isSummary &&
          item.lessonType !== 'concept' &&
          hasMalayalam(item.malayalamText)
        ) {
          if (!wordsMap.has(item.wordId)) {
            wordsMap.set(item.wordId, item.malayalamText);
          }
        }

        // Collect graphemes / characters
        if (Array.isArray(item.requiredCharacters)) {
          for (const ch of item.requiredCharacters) {
            if (ch && ch.trim() && hasMalayalam(ch.trim())) {
              lettersSet.add(ch.trim());
            }
          }
        }

        // Include trace/match individual character cards
        if (
          (item.lessonType === 'trace' || item.lessonType === 'match') &&
          item.malayalamText &&
          hasMalayalam(item.malayalamText)
        ) {
          lettersSet.add(item.malayalamText.trim());
        }
      }
    } catch (err) {
      console.error(`[AudioGen] Error reading ${filename}:`, err.message);
    }
  }

  return { wordsMap, lettersSet };
}

/**
 * Batch generates audio for all seed words and letters.
 */
async function generateAllAudio(options = {}) {
  const force = options.force || process.argv.includes('--force');
  const delay = options.delayMs !== undefined ? options.delayMs : DELAY_MS;
  const seedDir = options.seedDir || path.resolve(__dirname, '../data');

  fs.mkdirSync(WORDS_DIR, { recursive: true });
  fs.mkdirSync(LETTERS_DIR, { recursive: true });

  const { wordsMap, lettersSet } = extractSeedAudioTargets(seedDir);
  const totalWords = wordsMap.size;
  const totalLetters = lettersSet.size;

  console.log(`\n========================================`);
  console.log(`Malayalam Prime Static Audio Generator`);
  console.log(`Unique Words: ${totalWords}`);
  console.log(`Unique Letters: ${totalLetters}`);
  console.log(`Force Overwrite: ${force}`);
  console.log(`Throttling: ${delay}ms`);
  console.log(`========================================\n`);

  const stats = {
    words: { total: totalWords, generated: 0, skipped: 0, errors: 0 },
    letters: { total: totalLetters, generated: 0, skipped: 0, errors: 0 }
  };

  // 1. Process Words
  console.log(`--- Processing Words ---`);
  let wordIdx = 0;
  for (const [wordId, text] of wordsMap.entries()) {
    wordIdx++;
    const filename = `${wordId}.mp3`;
    const destPath = path.join(WORDS_DIR, filename);

    if (!force && fs.existsSync(destPath) && fs.statSync(destPath).size > 100) {
      stats.words.skipped++;
      continue;
    }

    try {
      const buffer = await fetchTTSBuffer(text, 'ml');
      fs.writeFileSync(destPath, buffer);
      stats.words.generated++;
      console.log(`[AudioGen] ${wordIdx}/${totalWords}: ${filename}`);
      await sleep(delay);
    } catch (err) {
      stats.words.errors++;
      console.error(`[AudioGen] ${wordIdx}/${totalWords}: FAILED ${filename} (${text}):`, err.message);
      await sleep(delay);
    }
  }

  // 2. Process Letters
  console.log(`\n--- Processing Letters ---`);
  let letterIdx = 0;
  for (const char of lettersSet) {
    letterIdx++;
    const filename = getLetterAudioFilename(char);
    const destPath = path.join(LETTERS_DIR, filename);

    if (!force && fs.existsSync(destPath) && fs.statSync(destPath).size > 100) {
      stats.letters.skipped++;
      continue;
    }

    try {
      const buffer = await fetchTTSBuffer(char, 'ml');
      fs.writeFileSync(destPath, buffer);
      stats.letters.generated++;
      console.log(`[AudioGen] ${letterIdx}/${totalLetters}: ${filename}`);
      await sleep(delay);
    } catch (err) {
      stats.letters.errors++;
      console.error(`[AudioGen] ${letterIdx}/${totalLetters}: FAILED ${filename} (${char}):`, err.message);
      await sleep(delay);
    }
  }

  console.log(`\n========================================`);
  console.log(`Audio Generation Completed`);
  console.log(`Words:   ${stats.words.generated} generated, ${stats.words.skipped} skipped, ${stats.words.errors} errors`);
  console.log(`Letters: ${stats.letters.generated} generated, ${stats.letters.skipped} skipped, ${stats.letters.errors} errors`);
  console.log(`========================================\n`);

  return stats;
}

if (require.main === module) {
  generateAllAudio().catch((err) => {
    console.error('Fatal Audio Generator Error:', err);
    process.exit(1);
  });
}

module.exports = {
  getLetterAudioFilename,
  extractSeedAudioTargets,
  generateAllAudio
};
