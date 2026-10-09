import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transliterateMalayalam } from '../utils/transliterate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.resolve(__dirname, '../data/seed-100.json');

function verifyTransliteration() {
  console.log('==================================================');
  console.log('   DATA-01: Automated Transliteration Verification');
  console.log('==================================================');

  if (!fs.existsSync(seedPath)) {
    console.error(`Error: Seed file not found at ${seedPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(seedPath, 'utf8');
  const seedItems = JSON.parse(raw);

  let checkedCount = 0;
  let matchCount = 0;
  const discrepancies = [];

  for (const item of seedItems) {
    if (!item.malayalamText || !item.phonetic) {
      continue;
    }

    checkedCount++;
    const actual = transliterateMalayalam(item.malayalamText);
    const expected = item.phonetic.trim().toLowerCase();
    const actualLower = actual.trim().toLowerCase();

    if (actualLower === expected) {
      matchCount++;
    } else {
      discrepancies.push({
        wordId: item.wordId,
        lessonId: item.lessonId,
        lessonType: item.lessonType,
        malayalamText: item.malayalamText,
        expected,
        actual: actualLower
      });
    }
  }

  const compatibility = ((matchCount / checkedCount) * 100).toFixed(2);

  console.log(`Total Entries Evaluated : ${checkedCount}`);
  console.log(`Matching Phonetics      : ${matchCount}`);
  console.log(`Discrepancies Flagged   : ${discrepancies.length}`);
  console.log(`Compatibility Rate      : ${compatibility}%`);
  console.log('--------------------------------------------------');

  if (discrepancies.length > 0) {
    console.log('\n⚠️ Flagged Discrepancies:');
    discrepancies.forEach((d, idx) => {
      console.log(
        `  ${idx + 1}. [${d.wordId}] "${d.malayalamText}" (L${d.lessonId} ${d.lessonType})`
      );
      console.log(`     - Expected : "${d.expected}"`);
      console.log(`     - Actual   : "${d.actual}"`);
    });
    console.log('\nNote: "അമ്മ ഇന്നലെ വന്നു" discrepancy is due to seed internal variance');
    console.log('      between standalone "ഇന്നലെ" (innalle) vs sentence token (innale).');
  } else {
    console.log('\n✅ 100% Exact Compatibility with seed data!');
  }

  console.log('==================================================');
}

verifyTransliteration();
