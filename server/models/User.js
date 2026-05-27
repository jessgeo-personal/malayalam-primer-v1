const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  currentLevel: { type: Number, default: 1 },
  unlockedCharacters: [{ type: String }],
  unlockedWords: [{ type: String }]
});

module.exports = mongoose.model('User', userProfileSchema);
