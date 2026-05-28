const express = require('express');
const router = express.Router();
const Word = require('../models/Word');
const Progress = require('../models/Progress');
const User = require('../models/User');
const srsEngine = require('../services/srsEngine');

/**
 * GET /api/session/revision
 * Fetches the daily revision payload.
 */
router.get('/session/revision', async (req, res) => {
  try {
    const { userId } = req.query;
    const revisionItems = await srsEngine.generateRevisionPayload(userId);
    res.json(revisionItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/session/lesson
 * Fetches the next 5-game lesson.
 */
router.get('/session/lesson', async (req, res) => {
  try {
    const { userId, lessonId } = req.query;
    const bundle = await srsEngine.generateLessonPayload(userId, parseInt(lessonId) || 1);
    res.json(bundle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/session/lesson/complete
 * Records lesson completion and stars.
 */
router.post('/session/lesson/complete', async (req, res) => {
  try {
    const { userId, lessonId, stars } = req.body;
    const user = await User.findOne({ userId });
    
    // Add to history if not already there, or update stars if higher
    const lid = parseInt(lessonId);
    const existing = user.lessonHistory.find(h => h.lessonId === lid);
    if (existing) {
      existing.stars = Math.max(existing.stars, stars);
    } else {
      user.lessonHistory.push({ lessonId: lid, stars });
    }

    // Increment currentLesson if this was the latest one
    if (lid === user.currentLesson) {
      user.currentLesson += 1;
    }

    await user.save();
    res.json({ success: true, currentLesson: user.currentLesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/session/revision/complete
 * Records revision completion for today.
 */
router.post('/session/revision/complete', async (req, res) => {
  try {
    const { userId } = req.body;
    await User.updateOne({ userId }, { $set: { lastRevisionDate: new Date() } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/words/next
 * Fetches the next word for the user based on SRS weight.
 */
router.get('/words/next', async (req, res) => {
  try {
    const { userId, cycle } = req.query;
    const targetCycle = parseInt(cycle) || 1;

    // 1. Get all words available in this cycle and below
    const availableWords = await Word.find({ unlockCycle: { $lte: targetCycle } });
    
    // 2. Get user progress for these words
    const wordIds = availableWords.map(w => w.wordId);
    const progressList = await Progress.find({ userId, itemId: { $in: wordIds }, itemType: 'word' });

    // 3. Find words with no progress (brand new words)
    const wordsWithProgressIds = progressList.map(p => p.itemId);
    const newWords = availableWords.filter(w => !wordsWithProgressIds.includes(w.wordId));

    // Helper: Check if prerequisites are met
    const arePrerequisitesMet = (word) => {
      if (!word.prerequisites || word.prerequisites.length === 0) return true;
      return word.prerequisites.every(preId => wordsWithProgressIds.includes(preId));
    };

    if (newWords.length > 0) {
      // Find the first new word whose prerequisites are met
      const nextNewWord = newWords.find(arePrerequisitesMet);
      if (nextNewWord) return res.json(nextNewWord);
    }

    // 4. If all accessible words have been encountered, pick the one with the lowest SRS weight
    // Only sort and pick from words whose prerequisites are met
    const accessibleProgress = progressList.filter(p => {
      const word = availableWords.find(w => w.wordId === p.itemId);
      return word && arePrerequisitesMet(word);
    });

    if (accessibleProgress.length > 0) {
      accessibleProgress.sort((a, b) => a.srsWeight - b.srsWeight);
      const nextWordId = accessibleProgress[0].itemId;
      const nextWord = availableWords.find(w => w.wordId === nextWordId);
      return res.json(nextWord);
    }

    // If absolutely nothing is accessible (edge case), return null or first word
    res.json(newWords[0] || availableWords[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/progress/update
 * Updates the SRS weight and progress for a specific item (letter, word, or sentence).
 */
router.post('/progress/update', async (req, res) => {
  try {
    const { userId, itemId, itemType, isCorrect, responseTimeMs } = req.body;

    let progress = await Progress.findOne({ userId, itemId, itemType });

    if (!progress) {
      progress = new Progress({ 
        userId, 
        itemId, 
        itemType,
        encounters: 0, 
        correctCount: 0, 
        errorCount: 0,
        srsWeight: 1.0 
      });
    }

    const newWeight = srsEngine.calculateNewWeight(progress.srsWeight, isCorrect, responseTimeMs);

    progress.encounters += 1;
    if (isCorrect) {
      progress.correctCount += 1;
      // Evaluate graduation if a word was correct
      await srsEngine.evaluateGraduation(userId, itemId, itemType);
    } else {
      progress.errorCount += 1;
    }
    
    progress.srsWeight = newWeight;
    progress.lastReviewed = new Date();
    
    // Average response time update
    progress.averageResponseTimeMs = progress.averageResponseTimeMs === 0 
      ? responseTimeMs 
      : (progress.averageResponseTimeMs + responseTimeMs) / 2;

    await progress.save();

    // Calculate total score for immediate UI update
    const allProgress = await Progress.find({ userId });
    const score = allProgress.reduce((sum, p) => sum + (p.correctCount * 10), 0);
    
    // For backwards compatibility/MasteryStrip: get letters (traces)
    const masteredTraces = await Progress.find({ userId, itemType: 'letter', correctCount: { $gt: 0 } });
    const masteredCharacters = masteredTraces.map(p => p.itemId);

    res.json({ 
      success: true, 
      newWeight, 
      score, 
      masteredCharacters 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/progress/stats
 * Returns the user's mastered characters, total score, and session status.
 */
router.get('/progress/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Ensure user exists
    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ userId, currentLevel: 1 });
    }

    const allProgress = await Progress.find({ userId });
    const score = allProgress.reduce((sum, p) => sum + (p.correctCount * 10), 0);

    const masteredTraces = await Progress.find({ userId, itemType: 'letter', correctCount: { $gt: 0 } });
    const masteredCharacters = masteredTraces.map(p => p.itemId);

    // Check if revision is needed
    const revisionItems = await srsEngine.generateRevisionPayload(userId);
    const hasItemsToRevise = revisionItems.length > 0;
    
    const today = new Date().toDateString();
    const lastRevDate = user.lastRevisionDate ? user.lastRevisionDate.toDateString() : null;
    const needsRevision = hasItemsToRevise && lastRevDate !== today;

    res.json({ 
      score, 
      masteredCharacters,
      currentLesson: user.currentLesson,
      lessonHistory: user.lessonHistory,
      needsRevision 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/progress/reset
 * Wipes all progress for the user to restart testing.
 */
router.post('/progress/reset', async (req, res) => {
  try {
    const { userId } = req.body;
    await Progress.deleteMany({ userId });
    res.json({ success: true, message: "Progress reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Keep existing routes if they are needed, but we focus on these for Phase 1.
router.get('/user/progress', async (req, res) => {
  // Existing placeholder
  res.json({ message: "Use /api/words/next and /api/progress/update for Phase 1" });
});

module.exports = router;
