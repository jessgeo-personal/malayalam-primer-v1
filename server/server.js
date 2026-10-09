const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Fix for Node 18: Gemini library expects global crypto
if (!globalThis.crypto) {
  try {
    const { webcrypto } = require('node:crypto');
    if (webcrypto) {
      globalThis.crypto = webcrypto;
    }
  } catch (e) {
    console.error("Failed to polyfill crypto:", e);
  }
}

const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const apiRoutes = require('./routes/api');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', apiRoutes);

// Static site serving and SPA catchall fallback for non-API routes
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    return res.status(200).type('text/html').send('<!DOCTYPE html><html><head><title>Malayalam Prime</title></head><body><div id="root"></div></body></html>');
  }
  next();
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/malayalam_decode';

const { seedDatabaseIfNeeded } = require('./seeder');

if (require.main === module) {
  mongoose.connect(MONGO_URI)
    .then(async () => {
      console.log('Connected to MongoDB');
      await seedDatabaseIfNeeded();
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = app;


