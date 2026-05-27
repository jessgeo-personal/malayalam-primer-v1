require('dotenv').config();
const mongoose = require('mongoose');
const Progress = require('./models/Progress');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🗑️  Clearing all user progress for testing...');
    await Progress.deleteMany({});
    console.log('✅ Progress successfully reset!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });
