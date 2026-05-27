const mongoose = require('mongoose');

const wordItemSchema = new mongoose.Schema({
  wordId: { type: String, required: true, unique: true },
  malayalamText: { type: String, required: true },
  englishTranslation: { type: String, required: true },
  phonetic: { type: String, required: true },
  bucketId: { type: Number, required: true },
  isSuffix: { type: Boolean, default: false },
  requiredCharacters: [{ type: String }], 
  unlockCycle: { type: Number, required: true }
});

module.exports = mongoose.model('Word', wordItemSchema);
