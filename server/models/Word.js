const mongoose = require('mongoose');

const wordItemSchema = new mongoose.Schema({
  wordId: { type: String, required: true, unique: true },
  malayalamText: { type: String, required: true },
  englishTranslation: { type: String, required: true },
  phonetic: { type: String, required: true },
  bucketId: { type: Number, required: true },
  isSuffix: { type: Boolean, default: false },
  requiredCharacters: [{ type: String }], 
  unlockCycle: { type: Number, required: true },
  lessonId: { type: Number, default: 0 },
  sequence: { type: Number, default: 0 },
  lessonType: { type: String, enum: ['trace', 'match', 'build', 'suffix'], default: 'build' },
  baseWord: { type: String },
  morphedBase: { type: String },
  targetSuffix: { type: String },
  distractorSuffixes: [{ type: String }],
  prerequisites: [{ type: String }]
});

module.exports = mongoose.model('Word', wordItemSchema);
