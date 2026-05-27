const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('../routes/api');
const Word = require('../models/Word');
const Progress = require('../models/Progress');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('API Routes Integration', () => {
  beforeAll(async () => {
    // Connect to a test database
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/malayalam_prime_test';
    await mongoose.connect(url);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Word.deleteMany({});
    await Progress.deleteMany({});
  });

  test('GET /api/words/next should return a word', async () => {
    // Seed a word
    await Word.create({
      wordId: 'w001',
      malayalamText: 'അമ്മ',
      englishTranslation: 'Mother',
      phonetic: 'Amma',
      bucketId: 10,
      unlockCycle: 1
    });

    const response = await request(app).get('/api/words/next?userId=test_user&cycle=1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('wordId', 'w001');
  });

  test('POST /api/progress/update should update progress', async () => {
    const response = await request(app)
      .post('/api/progress/update')
      .send({
        userId: 'test_user',
        wordId: 'w001',
        isCorrect: true,
        responseTimeMs: 2000
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('newWeight');
  });
});
