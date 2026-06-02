const mongoose = require('mongoose');

const wordItemSchema = new mongoose.Schema({
  wordId: { type: String, required: true, unique: true },
  malayalamText: { type: String, required: true },
  englishTranslation: { type: String, required: true },
  phonetic: { type: String },
  bucketId: { type: Number, required: true },
  isSuffix: { type: Boolean, default: false },
  requiredCharacters: [{ type: String }], 
  unlockCycle: { type: Number, required: true },
  lessonId: { type: Number, default: 0 },
  sequence: { type: Number, default: 0 },
  lessonType: { type: String, enum: ['trace', 'match', 'build', 'suffix', 'concept', 'tense'], default: 'build' },
  isSummary: { type: Boolean, default: false },
  
  // Tense Transformations (Bucket 3 / Milestone 2.3)
  pastForm: { type: String },
  presentForm: { type: String },
  futureForm: { type: String },
  pastEnglish: { type: String },
  presentEnglish: { type: String },
  futureEnglish: { type: String },

  baseWord: { type: String },
  morphedBase: { type: String },
  targetSuffix: { type: String },
  distractorSuffixes: [{ type: String }],
  prerequisites: [{ type: String }]
});

module.exports = mongoose.model('Word', wordItemSchema);
