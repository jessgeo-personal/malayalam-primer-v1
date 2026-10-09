const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  profileId: {
    type: String,
    required: true,
    default: () => 'p1'
  },
  name: {
    type: String,
    required: true,
    default: 'Learner 1'
  },
  avatar: {
    type: String,
    default: ''
  },
  isDefault: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const AccountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    default: null
  },
  otpExpiresAt: {
    type: Date,
    default: null
  },
  profiles: {
    type: [ProfileSchema],
    default: () => [{ profileId: 'p1', name: 'Learner 1', isDefault: true }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Account', AccountSchema);
