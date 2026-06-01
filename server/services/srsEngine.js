const Progress = require('../models/Progress');
const Word = require('../models/Word');

/**
 * SRS Engine for Malayalam Prime
 */

const MIN_WEIGHT = 1.0;
const MAX_WEIGHT = 50.0;
const FAST_THRESHOLD = 3000;
const SLOW_THRESHOLD = 10000;

function calculateNewWeight(currentWeight, isCorrect, responseTimeMs) {
  let newWeight = currentWeight;

  if (isCorrect) {
    newWeight *= 1.5;
    if (responseTimeMs < FAST_THRESHOLD) {
      newWeight += 0.2;
    }
  } else {
    newWeight *= 0.5;
    if (responseTimeMs > SLOW_THRESHOLD) {
      newWeight -= 0.1;
    }
  }

  // Apply bounds
  newWeight = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, newWeight));
  
  // Round to 2 decimal places
  return Math.round(newWeight * 100) / 100;
}

/**
 * Graduation Logic:
 * If a letter is successfully used in a word context, it graduates from isolated review.
 */
async function evaluateGraduation(userId, itemId, itemType) {
  if (itemType === 'word') {
    const word = await Word.findOne({ wordId: itemId });
    if (word && word.requiredCharacters) {
      for (const letter of word.requiredCharacters) {
        await Progress.updateOne(
          { userId, itemId: letter, itemType: 'letter' },
          { $set: { graduated: true } }
        );
      }
    }
  }
}

/**
 * Generate Revision Payload:
 * Pulls non-graduated items needing review and attaches word/letter data.
 */
async function generateRevisionPayload(userId) {
  const progressItems = await Progress.find({ userId, graduated: false })
    .sort({ srsWeight: 1, lastReviewed: 1 });

  const payload = [];
  for (const item of progressItems) {
    if (item.itemType === 'word') {
      const wordData = await Word.findOne({ wordId: item.itemId });
      if (wordData && wordData.lessonType !== 'concept') {
        payload.push({
          ...item.toObject(),
          ...wordData.toObject(),
          lessonType: wordData.lessonType || 'build'
        });
      }
    } else if (item.itemType === 'letter') {
      const letterData = await Word.findOne({ malayalamText: item.itemId, lessonType: 'trace' });
      if (letterData) {
        payload.push({
          ...item.toObject(),
          ...letterData.toObject()
        });
      }
    }
  }
  return payload;
}

/**
 * Generate Lesson Payload:
 * Refactored Pedagogical Logic: 
 * 1. Fetches items strictly by lessonId to ensure curated content.
 * 2. Groups all 'trace' tasks first to introduce characters.
 * 3. Randomizes 'match' and 'build' tasks to test recall.
 */
async function generateLessonPayload(userId, lessonId) {
  const words = await Word.find({ lessonId: parseInt(lessonId) }).sort({ sequence: 1 });
  
  if (!words || words.length === 0) return [];

  const payload = [];
  for (const w of words) {
    const progress = await Progress.findOne({ userId, itemId: w.wordId, itemType: 'word' });
    const item = {
      ...w.toObject(),
      itemId: w.wordId,
      itemType: 'word',
      showTutorial: !progress
    };

    // If it's a tracing task, find up to 3 example words using this letter
    if (w.lessonType === 'trace') {
      const examples = await Word.find({ 
        lessonType: 'build', 
        requiredCharacters: w.malayalamText 
      }).limit(3);
      
      item.exampleWords = examples.map(ex => ({
        malayalamText: ex.malayalamText,
        englishTranslation: ex.englishTranslation,
        phonetic: ex.phonetic
      }));
    }

    payload.push(item);
  }

  // Group by type: Concept first, then Tracing, then randomized everything else
  const concepts = payload.filter(p => p.lessonType === 'concept');
  const tracing = payload.filter(p => p.lessonType === 'trace');
  const others = payload.filter(p => p.lessonType !== 'concept' && p.lessonType !== 'trace').sort(() => Math.random() - 0.5);

  return [...concepts, ...tracing, ...others];
}

module.exports = {
  calculateNewWeight,
  evaluateGraduation,
  generateRevisionPayload,
  generateLessonPayload
};
