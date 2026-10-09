const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const Progress = require('../models/Progress');
const authRoutes = require('../routes/auth');

// Express application instance mounted with auth routes
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Profile Independent Reset Endpoint & Handlers (AUTH-03)', () => {
  let accountA;
  let accountB;
  let tokenA;
  let tokenB;

  beforeAll(async () => {
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/malayalam_prime_reset_test';
    await mongoose.connect(url);
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      try {
        await Account.deleteMany({ email: { $in: ['account_a@example.com', 'account_b@example.com'] } });
        await Progress.deleteMany({ userId: { $in: ['p1', 'p2', 'p_other', 'p_invalid'] } });
      } catch (err) {
        // Ignore cleanup errors
      }
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    await Account.deleteMany({ email: { $in: ['account_a@example.com', 'account_b@example.com'] } });
    await Progress.deleteMany({ userId: { $in: ['p1', 'p2', 'p_other', 'p_invalid'] } });

    // Setup Account A with profiles 'p1' and 'p2'
    accountA = await Account.create({
      email: 'account_a@example.com',
      profiles: [
        { profileId: 'p1', name: 'Learner 1', isDefault: true },
        { profileId: 'p2', name: 'Learner 2', isDefault: false }
      ]
    });

    // Setup Account B with profile 'p_other'
    accountB = await Account.create({
      email: 'account_b@example.com',
      profiles: [
        { profileId: 'p_other', name: 'Learner Other', isDefault: true }
      ]
    });

    tokenA = jwt.sign(
      { accountId: accountA._id, email: accountA.email },
      process.env.JWT_SECRET || 'dev_secret_jwt_key',
      { expiresIn: '30d' }
    );

    tokenB = jwt.sign(
      { accountId: accountB._id, email: accountB.email },
      process.env.JWT_SECRET || 'dev_secret_jwt_key',
      { expiresIn: '30d' }
    );

    // Seed dummy progress documents in Progress collection for p1, p2, and p_other
    await Progress.create([
      { userId: 'p1', itemId: 'w001', itemType: 'word', encounters: 3, correctCount: 3, srsWeight: 2.5 },
      { userId: 'p1', itemId: 't001', itemType: 'letter', encounters: 2, correctCount: 2, srsWeight: 1.5 },
      { userId: 'p2', itemId: 'w001', itemType: 'word', encounters: 4, correctCount: 4, srsWeight: 3.0 },
      { userId: 'p2', itemId: 'w002', itemType: 'word', encounters: 1, correctCount: 1, srsWeight: 1.0 },
      { userId: 'p_other', itemId: 'w001', itemType: 'word', encounters: 5, correctCount: 5, srsWeight: 3.5 },
      { userId: 'p_other', itemId: 's001', itemType: 'sentence', encounters: 2, correctCount: 2, srsWeight: 2.0 }
    ]);
  });

  test('a) POST /api/auth/profiles/p1/reset without Authorization header returns 401', async () => {
    const res = await request(app).post('/api/auth/profiles/p1/reset');
    expect(res.status).toBe(401);
  });

  test("b) POST /api/auth/profiles/p_invalid/reset with Account A's JWT token returns 404 with error 'Profile not found'", async () => {
    const res = await request(app)
      .post('/api/auth/profiles/p_invalid/reset')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Profile not found');
  });

  test("c) POST /api/auth/profiles/p_other/reset with Account A's JWT token returns 404 (cannot reset alien account's profile)", async () => {
    const res = await request(app)
      .post('/api/auth/profiles/p_other/reset')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Profile not found');
  });

  test("d) POST /api/auth/profiles/p1/reset with Account A's JWT token returns 200 with success status and confirmation", async () => {
    const res = await request(app)
      .post('/api/auth/profiles/p1/reset')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message');
  });

  test("e) Verify that Progress documents for 'p1' are completely deleted (count is 0), while Progress documents for 'p2' and 'p_other' remain intact", async () => {
    // Initial verification
    const beforeP1 = await Progress.countDocuments({ userId: 'p1' });
    const beforeP2 = await Progress.countDocuments({ userId: 'p2' });
    const beforePOther = await Progress.countDocuments({ userId: 'p_other' });
    expect(beforeP1).toBe(2);
    expect(beforeP2).toBe(2);
    expect(beforePOther).toBe(2);

    // Execute reset on p1
    const res = await request(app)
      .post('/api/auth/profiles/p1/reset')
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.status).toBe(200);

    // Verify p1 progress is completely wiped, while p2 and p_other are untouched
    const afterP1 = await Progress.countDocuments({ userId: 'p1' });
    const afterP2 = await Progress.countDocuments({ userId: 'p2' });
    const afterPOther = await Progress.countDocuments({ userId: 'p_other' });

    expect(afterP1).toBe(0);
    expect(afterP2).toBe(2);
    expect(afterPOther).toBe(2);
  });
});
