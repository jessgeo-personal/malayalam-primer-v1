const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const Progress = require('../models/Progress');

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

    console.log('\n========================================');
    console.log(`[AUTH DEV] Generated OTP for ${normalizedEmail}: ${otp}`);
    console.log('========================================\n');

    await Account.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: { otp, otpExpiresAt },
        $setOnInsert: {
          profiles: [{ profileId: 'p1', name: 'Learner 1', isDefault: true }]
        }
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    const responsePayload = {
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV !== 'production' && { devOtp: otp, otp })
    };

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

const authMiddleware = require('../middleware/auth');

// GET /profiles
router.get('/profiles', authMiddleware, async (req, res) => {
  try {
    return res.status(200).json({
      profiles: req.account.profiles
    });
  } catch (error) {
    console.error('Error in GET /profiles:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /profiles
router.post('/profiles', authMiddleware, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Profile name is required' });
    }

    if (req.account.profiles && req.account.profiles.length >= 3) {
      return res.status(400).json({ error: 'Maximum of 3 profiles reached' });
    }

    const newProfile = {
      profileId: `p_${Date.now()}`,
      name: name.trim(),
      avatar: avatar || 'star',
      isDefault: false
    };

    req.account.profiles.push(newProfile);
    await req.account.save();

    return res.status(201).json({
      profile: newProfile,
      profiles: req.account.profiles
    });
  } catch (error) {
    console.error('Error in POST /profiles:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /profiles/switch
router.post('/profiles/switch', authMiddleware, async (req, res) => {
  try {
    const { profileId } = req.body;
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }

    const profile = req.account.profiles.find(p => p.profileId === profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json({
      activeProfile: profile
    });
  } catch (error) {
    console.error('Error in POST /profiles/switch:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /profiles/:profileId/reset
router.post('/profiles/:profileId/reset', authMiddleware, async (req, res) => {
  try {
    const { profileId } = req.params;

    if (!req.account || !req.account.profiles) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = req.account.profiles.find(p => p.profileId === profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    await Progress.deleteMany({ userId: profileId });

    return res.status(200).json({
      success: true,
      message: 'Profile progress reset successfully',
      profileId
    });
  } catch (error) {
    console.error('Error in POST /profiles/:profileId/reset:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

