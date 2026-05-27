const express = require('express');
const router = express.Router();
const Word = require('../models/Word');
const Progress = require('../models/Progress');
const srsEngine = require('../services/srsEngine');

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
    const progressList = await Progress.find({ userId, wordId: { $in: wordIds } });

    // 3. Find words with no progress (brand new words)
    const wordsWithProgressIds = progressList.map(p => p.wordId);
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
      const word = availableWords.find(w => w.wordId === p.wordId);
      return word && arePrerequisitesMet(word);
    });

    if (accessibleProgress.length > 0) {
      accessibleProgress.sort((a, b) => a.srsWeight - b.srsWeight);
      const nextWordId = accessibleProgress[0].wordId;
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
 * Updates the SRS weight and progress for a specific word.
 */
router.post('/progress/update', async (req, res) => {
  try {
    const { userId, wordId, isCorrect, responseTimeMs } = req.body;

    let progress = await Progress.findOne({ userId, wordId });

    if (!progress) {
      progress = new Progress({ 
        userId, 
        wordId, 
        encounters: 0, 
        correctCount: 0, 
        srsWeight: 1.0 
      });
    }

    const newWeight = srsEngine.calculateNewWeight(progress.srsWeight, isCorrect, responseTimeMs);

    progress.encounters += 1;
    if (isCorrect) progress.correctCount += 1;
    progress.srsWeight = newWeight;
    progress.lastReviewed = new Date();
    
    // Average response time update
    progress.averageResponseTimeMs = progress.averageResponseTimeMs === 0 
      ? responseTimeMs 
      : (progress.averageResponseTimeMs + responseTimeMs) / 2;

    await progress.save();

    res.json({ success: true, newWeight });
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
