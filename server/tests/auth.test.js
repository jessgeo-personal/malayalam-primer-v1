const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Route import with fallback for RED phase
let authRoutes;
try {
  authRoutes = require('../routes/auth');
} catch (err) {
  // Routes not implemented yet in Red phase
}

const app = express();
app.use(express.json());
if (authRoutes) {
  app.use('/api/auth', authRoutes);
}

describe('Auth Endpoints Integration (Email + OTP)', () => {
  beforeAll(async () => {
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/malayalam_prime_test';
    await mongoose.connect(url);
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      try {
        const Account = mongoose.models.Account;
        if (Account) {
          await Account.deleteMany({ email: { $in: ['parent@example.com', 'replay@example.com'] } });
        }
      } catch (err) {
        // Ignore cleanup errors
      }
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    try {
      const Account = mongoose.models.Account;
      if (Account) {
        await Account.deleteMany({ email: { $in: ['parent@example.com', 'replay@example.com'] } });
      }
    } catch (err) {
      // Model not registered yet
    }
  });

  test('1. POST /api/auth/request-otp returns 400 for invalid email', async () => {
    // Missing email
    const resMissing = await request(app)
      .post('/api/auth/request-otp')
      .send({});
    expect(resMissing.status).toBe(400);

    // Malformed email
    const resInvalid = await request(app)
      .post('/api/auth/request-otp')
      .send({ email: 'not-an-email' });
    expect(resInvalid.status).toBe(400);
  });

  test('2. POST /api/auth/request-otp returns 200 and generates OTP for valid email', async () => {
    const response = await request(app)
      .post('/api/auth/request-otp')
      .send({ email: 'parent@example.com' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'OTP sent successfully');
    expect(response.body).toHaveProperty('otp');
    expect(typeof response.body.otp).toBe('string');
    expect(response.body.otp).toMatch(/^\d{6}$/);
  });

  test('3. POST /api/auth/verify-otp returns 401 for wrong OTP', async () => {
    // Request valid OTP first
    const reqRes = await request(app)
      .post('/api/auth/request-otp')
      .send({ email: 'parent@example.com' });
    const correctOtp = reqRes.body.otp;
    const wrongOtp = correctOtp === '999999' ? '888888' : '999999';

    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({ email: 'parent@example.com', otp: wrongOtp });

    expect(verifyRes.status).toBe(401);
  });

  test('4. POST /api/auth/verify-otp returns 401 for expired OTP', async () => {
    // Request OTP
    const reqRes = await request(app)
      .post('/api/auth/request-otp')
      .send({ email: 'parent@example.com' });
    const otp = reqRes.body.otp;

    // Simulate OTP expiration by backdating otpExpiresAt
    try {
      const Account = mongoose.models.Account || require('../models/Account');
      await Account.updateOne(
        { email: 'parent@example.com' },
        { otpExpiresAt: new Date(Date.now() - 1000) }
      );
    } catch (e) {
      // Model might not exist yet
    }

    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({ email: 'parent@example.com', otp: otp || '123456' });

    expect(verifyRes.status).toBe(401);
  });

  test('5. POST /api/auth/verify-otp returns 200 with JWT token and profile list on valid OTP', async () => {
    // Request OTP
    const reqRes = await request(app)
      .post('/api/auth/request-otp')
      .send({ email: 'parent@example.com' });
    const otp = reqRes.body.otp;

    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({ email: 'parent@example.com', otp });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body).toHaveProperty('token');
    expect(typeof verifyRes.body.token).toBe('string');
    expect(verifyRes.body).toHaveProperty('account');
    expect(verifyRes.body.account).toHaveProperty('email', 'parent@example.com');
    expect(verifyRes.body.account).toHaveProperty('profiles');
    expect(Array.isArray(verifyRes.body.account.profiles)).toBe(true);
  });

  test('6. Re-using the same OTP returns 401 (replay protection)', async () => {
    const email = 'replay@example.com';
    const reqRes = await request(app)
      .post('/api/auth/request-otp')
      .send({ email });
    const otp = reqRes.body.otp;

    // First verification succeeds
    const firstVerify = await request(app)
      .post('/api/auth/verify-otp')
      .send({ email, otp });
    expect(firstVerify.status).toBe(200);

    // Second verification must fail with 401
    const secondVerify = await request(app)
      .post('/api/auth/verify-otp')
      .send({ email, otp });
    expect(secondVerify.status).toBe(401);
  });
});
