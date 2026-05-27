const express = require('express');
const router = express.Router();
const { generateDynamicSentence } = require('../services/geminiService');
const User = require('../models/User');

router.post('/generate-sentence', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ userId: userId || "default_user" });
    const targetCycle = user ? Math.ceil(user.currentLevel / 10) : 1; // Basic logic to map level to cycle
    
    const sentenceData = await generateDynamicSentence(userId, targetCycle);
    res.json(sentenceData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
