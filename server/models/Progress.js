const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  wordId: { type: String, required: true },
  encounters: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  averageResponseTimeMs: { type: Number, default: 0 },
  lastReviewed: { type: Date, default: Date.now },
  srsWeight: { type: Number, default: 1 }
});

module.exports = mongoose.model('Progress', progressLogSchema);
