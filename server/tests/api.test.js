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

  test('GET /api/words/next should return a word if no prerequisites', async () => {
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

  test('GET /api/words/next should NOT return a word if prerequisites unmet', async () => {
    await Word.create({
      wordId: 't001',
      malayalamText: 'അ',
      englishTranslation: 'A',
      phonetic: 'A',
      bucketId: 0,
      unlockCycle: 1,
      lessonType: 'trace'
    });

    await Word.create({
      wordId: 'w001',
      malayalamText: 'അമ്മ',
      englishTranslation: 'Mother',
      phonetic: 'Amma',
      bucketId: 10,
      unlockCycle: 1,
      prerequisites: ['t001']
    });

    // Requesting next word, should return t001, not w001
    const response = await request(app).get('/api/words/next?userId=test_user&cycle=1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('wordId', 't001');
  });

  test('GET /api/words/next should return word if prerequisites ARE met', async () => {
    await Word.create({
      wordId: 't001',
      malayalamText: 'അ',
      englishTranslation: 'A',
      phonetic: 'A',
      bucketId: 0,
      unlockCycle: 1,
      lessonType: 'trace'
    });

    await Word.create({
      wordId: 'w001',
      malayalamText: 'അമ്മ',
      englishTranslation: 'Mother',
      phonetic: 'Amma',
      bucketId: 10,
      unlockCycle: 1,
      prerequisites: ['t001']
    });

    // Add progress for t001
    await Progress.create({
      userId: 'test_user',
      itemId: 't001',
      itemType: 'word',
      encounters: 1,
      correctCount: 1,
      srsWeight: 1.5
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
        itemId: 'w001',
        itemType: 'word',
        isCorrect: true,
        responseTimeMs: 2000
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('newWeight');
    expect(response.body).toHaveProperty('score');
  });

  test('GET /api/progress/stats should return user score and mastered characters', async () => {
    // 0. Ensure user exists
    await User.create({ userId: 'test_user', currentLevel: 1 });

    // 1. Trace a character
    await Word.create({
      wordId: 't001',
      malayalamText: 'അ',
      englishTranslation: 'A',
      phonetic: 'A',
      bucketId: 0,
      unlockCycle: 1,
      lessonType: 'trace'
    });

    await request(app)
      .post('/api/progress/update')
      .send({
        userId: 'test_user',
        itemId: 'അ',
        itemType: 'letter',
        isCorrect: true,
        responseTimeMs: 2000
      });

    const response = await request(app).get('/api/progress/stats?userId=test_user');
    expect(response.status).toBe(200);
    // Score is 0 because no lessons were completed with stars yet
    expect(response.body.score).toBe(0); 
    expect(response.body.masteredCharacters).toContain('അ');
  });

  test('POST /api/session/lesson/complete should be idempotent for currentLesson increment', async () => {
    await User.create({ userId: 'test_idempotent', currentLesson: 1 });

    // Complete lesson 1
    await request(app)
      .post('/api/session/lesson/complete')
      .send({ userId: 'test_idempotent', lessonId: 1, stars: 3 });

    let stats = await User.findOne({ userId: 'test_idempotent' });
    expect(stats.currentLesson).toBe(2);

    // Replay lesson 1
    await request(app)
      .post('/api/session/lesson/complete')
      .send({ userId: 'test_idempotent', lessonId: 1, stars: 2 });

    stats = await User.findOne({ userId: 'test_idempotent' });
    expect(stats.currentLesson).toBe(2); // Should NOT have incremented to 3
  });

  test('POST /api/session/lesson/complete should enforce stricter thresholds (0 stars for 3+ errors)', async () => {
    await User.create({ userId: 'test_threshold', currentLesson: 1 });

    // 1 mistake = 2 stars (Pass)
    await request(app)
      .post('/api/session/lesson/complete')
      .send({ userId: 'test_threshold', lessonId: 1, stars: 2 });

    let stats = await User.findOne({ userId: 'test_threshold' });
    expect(stats.currentLesson).toBe(2);

    // 3 mistakes = 0 stars (Fail) - next lesson should NOT unlock
    await request(app)
      .post('/api/session/lesson/complete')
      .send({ userId: 'test_threshold', lessonId: 2, stars: 0 });

    stats = await User.findOne({ userId: 'test_threshold' });
    expect(stats.currentLesson).toBe(2); // Remains at 2
  });

  test('GET /api/progress/stats should calculate score based on stars (300 per lesson max)', async () => {
    await User.create({ 
      userId: 'test_score', 
      lessonHistory: [
        { lessonId: 1, stars: 3 }, // 300 pts
        { lessonId: 2, stars: 1 }  // 100 pts
      ] 
    });

    const response = await request(app).get('/api/progress/stats?userId=test_score');
    expect(response.body.score).toBe(400);
  });
});
