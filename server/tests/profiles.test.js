const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const authRoutes = require('../routes/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Profile Management & Switching Integration', () => {
  let token;
  let account;

  const createTestAccountAndToken = async (email = 'profiles_tester@example.com') => {
    const acc = await Account.create({
      email,
      profiles: [{ profileId: 'p1', name: 'Learner 1', isDefault: true }]
    });
    const tok = jwt.sign(
      { accountId: acc._id, email: acc.email },
      process.env.JWT_SECRET || 'dev_secret_jwt_key',
      { expiresIn: '30d' }
    );
    return { account: acc, token: tok };
  };

  beforeAll(async () => {
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/malayalam_prime_test';
    await mongoose.connect(url);
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      try {
        await Account.deleteMany({ email: 'profiles_tester@example.com' });
      } catch (err) {
        // Ignore cleanup errors
      }
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    await Account.deleteMany({ email: 'profiles_tester@example.com' });
    const setup = await createTestAccountAndToken();
    account = setup.account;
    token = setup.token;
  });

  test('1. GET /api/auth/profiles returns 401 Unauthorized without a valid Bearer token', async () => {
    // Missing Authorization header
    const resNoToken = await request(app).get('/api/auth/profiles');
    expect(resNoToken.status).toBe(401);

    // Invalid Bearer token
    const resInvalidToken = await request(app)
      .get('/api/auth/profiles')
      .set('Authorization', 'Bearer invalid_or_expired_token');
    expect(resInvalidToken.status).toBe(401);
  });

  test('2. GET /api/auth/profiles returns 200 OK with initial default profile when authenticated', async () => {
    const res = await request(app)
      .get('/api/auth/profiles')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('profiles');
    expect(Array.isArray(res.body.profiles)).toBe(true);
    expect(res.body.profiles).toHaveLength(1);
    expect(res.body.profiles[0]).toMatchObject({
      profileId: 'p1',
      name: 'Learner 1',
      isDefault: true
    });
  });

  test('3. POST /api/auth/profiles returns 400 Bad Request if name is missing', async () => {
    // Missing name field
    const resMissing = await request(app)
      .post('/api/auth/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ avatar: 'star' });
    expect(resMissing.status).toBe(400);

    // Empty trimmed name string
    const resEmpty = await request(app)
      .post('/api/auth/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '   ', avatar: 'star' });
    expect(resEmpty.status).toBe(400);
  });

  test('4. POST /api/auth/profiles returns 201 Created and adds a second profile', async () => {
    const res = await request(app)
      .post('/api/auth/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Learner 2', avatar: 'star' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('profile');
    expect(res.body.profile).toHaveProperty('name', 'Learner 2');
    expect(res.body.profile).toHaveProperty('profileId');
    expect(res.body).toHaveProperty('profiles');
    expect(res.body.profiles).toHaveLength(2);
  });

  test('5. POST /api/auth/profiles adds a third profile successfully', async () => {
    // Add second profile
    await request(app)
      .post('/api/auth/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Learner 2', avatar: 'star' });

    // Add third profile
    const res = await request(app)
      .post('/api/auth/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Learner 3', avatar: 'rocket' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('profile');
    expect(res.body.profile).toHaveProperty('name', 'Learner 3');
    expect(res.body.profiles).toHaveLength(3);
  });

  test('6. POST /api/auth/profiles returns 400 Bad Request when attempting to add a 4th profile (enforcing the 3-profile ceiling)', async () => {
    // Add second profile
    await request(app)
      .post('/api/auth/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Learner 2', avatar: 'star' });

    // Add third profile
    await request(app)
      .post('/api/auth/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Learner 3', avatar: 'rocket' });

    // Attempt to add fourth profile
    const res = await request(app)
      .post('/api/auth/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Learner 4', avatar: 'sun' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/maximum of 3 profiles/i);
  });

  test('7. POST /api/auth/profiles/switch returns 404 Not Found for a non-existent profileId', async () => {
    const res = await request(app)
      .post('/api/auth/profiles/switch')
      .set('Authorization', `Bearer ${token}`)
      .send({ profileId: 'non_existent_profile_id' });

    expect([400, 404]).toContain(res.status);
    expect(res.body).toHaveProperty('error');
  });

  test('8. POST /api/auth/profiles/switch returns 200 OK when switching to an existing profileId', async () => {
    // Switch to existing p1 profile
    const res = await request(app)
      .post('/api/auth/profiles/switch')
      .set('Authorization', `Bearer ${token}`)
      .send({ profileId: 'p1' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('activeProfile');
    expect(res.body.activeProfile).toHaveProperty('profileId', 'p1');
    expect(res.body.activeProfile).toHaveProperty('name', 'Learner 1');
  });
});
