const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /request-otp
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    let account = await Account.findOne({ email: normalizedEmail });
    if (!account) {
      account = new Account({
        email: normalizedEmail,
        otp,
        otpExpiresAt,
        profiles: [{ profileId: 'p1', name: 'Learner 1', isDefault: true }]
      });
    } else {
      account.otp = otp;
      account.otpExpiresAt = otpExpiresAt;
      if (!account.profiles || account.profiles.length === 0) {
        account.profiles = [{ profileId: 'p1', name: 'Learner 1', isDefault: true }];
      }
    }
    await account.save();

    const responsePayload = { message: 'OTP sent successfully' };
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      responsePayload.otp = otp;
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Error in /request-otp:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const account = await Account.findOne({ email: normalizedEmail });
    if (
      !account ||
      !account.otp ||
      account.otp !== cleanOtp ||
      !account.otpExpiresAt ||
      new Date() >= account.otpExpiresAt
    ) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Replay protection: clear OTP upon verification
    account.otp = null;
    account.otpExpiresAt = null;
    await account.save();

    const token = jwt.sign(
      { accountId: account._id, email: account.email },
      process.env.JWT_SECRET || 'dev_secret_jwt_key',
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      token,
      account: {
        email: account.email,
        profiles: account.profiles
      }
    });
  } catch (error) {
    console.error('Error in /verify-otp:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
