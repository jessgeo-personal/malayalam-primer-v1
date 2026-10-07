const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_jwt_key');
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

module.exports = authMiddleware;
