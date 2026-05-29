const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('../routes/api');
const Word = require('../models/Word');
const Progress = require('../models/Progress');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Multi-User Data Isolation', () => {
  beforeAll(async () => {
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/malayalam_prime_multiuser_test';
    await mongoose.connect(url);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Word.deleteMany({});
    await Progress.deleteMany({});
    await User.deleteMany({});
  });

  test('Learner 1 and Learner 2 should have independent progress', async () => {
    const user1 = 'Learner 1';
    const user2 = 'Learner 2';

    // 1. Setup a word
    await Word.create({
      wordId: 't001',
      malayalamText: 'അ',
      englishTranslation: 'A',
      phonetic: 'A',
      bucketId: 0,
      unlockCycle: 1,
      lessonType: 'trace'
    });

    // 2. Log progress for User 1
    await request(app)
      .post('/api/progress/update')
      .send({
        userId: user1,
        itemId: 'അ',
        itemType: 'letter',
        isCorrect: true,
        responseTimeMs: 1000
      });

    // 3. Verify User 1 has progress
    const stats1 = await request(app).get(`/api/progress/stats?userId=${user1}`);
    expect(stats1.body.score).toBe(10);
    expect(stats1.body.masteredCharacters).toContain('അ');

    // 4. Verify User 2 has NO progress
    const stats2 = await request(app).get(`/api/progress/stats?userId=${user2}`);
    expect(stats2.body.score).toBe(0);
    expect(stats2.body.masteredCharacters).not.toContain('അ');
  });

  test('Switching back to User 1 should restore their specific state', async () => {
    const user1 = 'Learner 1';
    const user2 = 'Learner 2';

    // Setup User 1 with high score
    await User.create({ userId: user1, currentLevel: 5 });
    await Progress.create({ userId: user1, itemId: 'test', itemType: 'word', correctCount: 10 });

    // Setup User 2 with different state
    await User.create({ userId: user2, currentLevel: 1 });

    const stats1 = await request(app).get(`/api/progress/stats?userId=${user1}`);
    const stats2 = await request(app).get(`/api/progress/stats?userId=${user2}`);

    expect(stats1.body.score).toBe(100);
    expect(stats2.body.score).toBe(0);
  });
});
