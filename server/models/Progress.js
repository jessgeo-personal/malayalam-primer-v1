const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: String, required: true },
  itemType: { type: String, enum: ['letter', 'word', 'sentence'], required: true },
  encounters: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  errorCount: { type: Number, default: 0 },
  averageResponseTimeMs: { type: Number, default: 0 },
  lastReviewed: { type: Date, default: Date.now },
  srsWeight: { type: Number, default: 1 },
  graduated: { type: Boolean, default: false }
});

module.exports = mongoose.model('Progress', progressLogSchema);
