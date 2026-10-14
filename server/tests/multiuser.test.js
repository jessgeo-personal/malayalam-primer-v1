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

    // 0. Create users
    await User.create({ userId: user1 });
    await User.create({ userId: user2 });

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
    // A. Trace a letter
    await request(app)
      .post('/api/progress/update')
      .send({
        userId: user1,
        itemId: 'അ',
        itemType: 'letter',
        isCorrect: true,
        responseTimeMs: 1000
      });

    // B. Complete Lesson 1 with 1 star
    await request(app)
      .post('/api/session/lesson/complete')
      .send({
        userId: user1,
        lessonId: 1,
        stars: 1
      });

    // 3. Verify User 1 has progress (100 points)
    const stats1 = await request(app).get(`/api/progress/stats?userId=${user1}`);
    expect(stats1.body.score).toBe(100);
    expect(stats1.body.masteredCharacters).toContain('അ');

    // 4. Verify User 2 has NO progress
    const stats2 = await request(app).get(`/api/progress/stats?userId=${user2}`);
    expect(stats2.body.score).toBe(0);
    expect(stats2.body.masteredCharacters).not.toContain('അ');
  });

  test('Switching back to User 1 should restore their specific state', async () => {
    const user1 = 'Learner 1';
    const user2 = 'Learner 2';

    // Setup User 1 with high score (1 star = 100 pts)
    await User.create({ 
      userId: user1, 
      currentLevel: 5,
      lessonHistory: [{ lessonId: 1, stars: 1 }]
    });

    // Setup User 2 with different state
    await User.create({ userId: user2, currentLevel: 1 });

    const stats1 = await request(app).get(`/api/progress/stats?userId=${user1}`);
    const stats2 = await request(app).get(`/api/progress/stats?userId=${user2}`);

    expect(stats1.body.score).toBe(100);
    expect(stats2.body.score).toBe(0);
  });

  test('AUTH-06: getOrCreateUserProfile seamlessly migrates legacy default_user progress to primary profile p1', async () => {
    // 1. Seed legacy user and progress under 'default_user'
    await User.create({
      userId: 'default_user',
      currentLesson: 4,
      currentCycle: 2,
      currentLevel: 2,
      lessonHistory: [
        { lessonId: 1, stars: 3 },
        { lessonId: 2, stars: 2 },
        { lessonId: 3, stars: 3 }
      ]
    });

    await Progress.create([
      { userId: 'default_user', itemId: 'w001', itemType: 'word', encounters: 2, correctCount: 2, srsWeight: 2.0 },
      { userId: 'default_user', itemId: 't001', itemType: 'letter', encounters: 1, correctCount: 1, srsWeight: 1.5 }
    ]);

    // 2. Query stats for p1 (primary profile)
    const statsRes = await request(app).get('/api/progress/stats?userId=p1');
    expect(statsRes.status).toBe(200);
    expect(statsRes.body.currentLesson).toBe(4);
    expect(statsRes.body.currentCycle).toBe(2);
    expect(statsRes.body.score).toBe(800); // 3*100 + 2*100 + 3*100 = 800

    // 3. Verify User document exists for p1 with legacy progress cloned
    const p1User = await User.findOne({ userId: 'p1' });
    expect(p1User).not.toBeNull();
    expect(p1User.currentLesson).toBe(4);
    expect(p1User.lessonHistory).toHaveLength(3);

    // 4. Verify Progress items are associated with p1
    const p1Progress = await Progress.find({ userId: 'p1' });
    expect(p1Progress).toHaveLength(2);
  });

  test('AUTH-06: Profile 2 starts fresh at Lesson 1 and does NOT inherit default_user progress', async () => {
    // 1. Ensure default_user has progress
    await User.create({
      userId: 'default_user',
      currentLesson: 5,
      currentCycle: 2,
      lessonHistory: [{ lessonId: 1, stars: 3 }, { lessonId: 2, stars: 3 }]
    });

    // 2. Query stats for a secondary profile 'p_second_learner'
    const statsRes = await request(app).get('/api/progress/stats?userId=p_second_learner');
    expect(statsRes.status).toBe(200);
    expect(statsRes.body.currentLesson).toBe(1);
    expect(statsRes.body.score).toBe(0);
    expect(statsRes.body.lessonHistory).toHaveLength(0);

    const user2 = await User.findOne({ userId: 'p_second_learner' });
    expect(user2).not.toBeNull();
    expect(user2.currentLesson).toBe(1);
  });

  test('AUTH-06: Completing Lesson 1 on newly created Profile 2 persists without throwing 500', async () => {
    const profileId2 = 'p_newly_created_child';

    // Completing lesson 1 on a profile that has not yet been saved to User collection
    const completeRes = await request(app)
      .post('/api/session/lesson/complete')
      .send({
        userId: profileId2,
        lessonId: 1,
        stars: 3
      });

    expect(completeRes.status).toBe(200);
    expect(completeRes.body.success).toBe(true);
    expect(completeRes.body.currentLesson).toBe(2);

    // Verify progress stats persistence
    const statsRes = await request(app).get(`/api/progress/stats?userId=${profileId2}`);
    expect(statsRes.status).toBe(200);
    expect(statsRes.body.currentLesson).toBe(2);
    expect(statsRes.body.score).toBe(300);
    expect(statsRes.body.lessonHistory).toEqual([
      expect.objectContaining({ lessonId: 1, stars: 3 })
    ]);
  });

  test('AUTH-06: POST /api/user/log records user activity and returns user status', async () => {
    const profileId = 'p_activity_test';

    const logRes = await request(app)
      .post('/api/user/log')
      .send({ userId: profileId });

    expect(logRes.status).toBe(200);
    expect(logRes.body.success).toBe(true);
    expect(logRes.body.userId).toBe(profileId);
    expect(logRes.body.currentLesson).toBe(1);
  });
});

