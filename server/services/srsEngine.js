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
 * Refactored Pedagogical Logic (3-Act Structure):
 * 1. Fetches ALL items for the lessonId.
 * 2. Filters items based on prerequisites (Prereqs must have correctCount > 0).
 * 3. Returns a slice of unlocked items to maintain "Bundle" cognitive load.
 */
async function generateLessonPayload(userId, lessonId) {
  const words = await Word.find({ lessonId: parseInt(lessonId) }).sort({ sequence: 1 });
  
  if (!words || words.length === 0) return [];

  // Get all user progress for this lesson's potential dependencies
  const userProgress = await Progress.find({ userId });
  const masteredIds = new Set(
    userProgress.filter(p => p.correctCount > 0).map(p => p.itemId)
  );

  const payload = [];
  for (const w of words) {
    // PREREQUISITE CHECK: 
    // An item is "Available" if all its prerequisites are in masteredIds.
    const arePrereqsMet = !w.prerequisites || w.prerequisites.length === 0 || 
                         w.prerequisites.every(preId => masteredIds.has(preId));

    if (!arePrereqsMet) continue; // Skip gated items

    const itype = w.lessonType === 'trace' ? 'letter' : 'word';
    const progress = userProgress.find(p => p.itemId === w.wordId && p.itemType === itype);
    
    if (progress && progress.correctCount > 0 && w.lessonType !== 'concept') continue;

    const item = {
      ...w.toObject(),
      itemId: w.wordId,
      itemType: itype,
      showTutorial: !progress
    };

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

  // --- STRICT CONCEPT GATING (Fix for Stacking) ---
  const concepts = payload.filter(p => p.lessonType === 'concept');
  const firstConcept = concepts.length > 0 ? [concepts[0]] : [];
  
  const nonConcepts = payload.filter(p => p.lessonType !== 'concept');

  // Return the first concept (if any) and the next gameplay items
  return [...firstConcept, ...nonConcepts.slice(0, 8)];
}

/**
 * Generate Act Preview:
 * Returns only the items that directly list the conceptId as a prerequisite.
 */
async function generateActPreview(userId, lessonId, conceptId) {
  const words = await Word.find({ lessonId: parseInt(lessonId) });
  
  // Return items where conceptId is in the prerequisites array
  const actItems = words.filter(w => 
    w.lessonType !== 'concept' && 
    w.prerequisites && 
    w.prerequisites.includes(conceptId)
  );

  return actItems.map(w => ({
    ...w.toObject(),
    itemId: w.wordId
  }));
}

module.exports = {
  calculateNewWeight,
  evaluateGraduation,
  generateRevisionPayload,
  generateLessonPayload,
  generateActPreview
};
