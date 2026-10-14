const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const { JWT_SECRET } = require('../config/auth');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    let token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    // Strip any unintentional quotes from the Bearer token (e.g. from JSON.stringify)
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const account = await Account.findById(decoded.accountId);
    if (!account) {
      return res.status(401).json({ error: 'Account not found' });
    }

    req.account = account;
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

authMiddleware.JWT_SECRET = JWT_SECRET;

module.exports = authMiddleware;

