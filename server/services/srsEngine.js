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
      if (wordData) {
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
 * Returns exactly 5 game payloads based on lessonId.
 */
async function generateLessonPayload(userId, lessonId) {
  const skip = (lessonId - 1) * 5;
  const words = await Word.find().skip(skip).limit(5);
  return words.map(w => ({
    ...w.toObject(),
    itemId: w.wordId,
    itemType: 'word'
  }));
}

module.exports = {
  calculateNewWeight,
  evaluateGraduation,
  generateRevisionPayload,
  generateLessonPayload
};
