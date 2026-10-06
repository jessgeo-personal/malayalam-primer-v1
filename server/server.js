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

const apiRoutes = require('./routes/api');
const aiRoutes = require('./routes/ai');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/malayalam_decode';

const Word = require('./models/Word');
const fs = require('fs');
const path = require('path');

const autoSeedIfEmpty = async () => {
  try {
    const count = await Word.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty. Running auto-seeder for Synology deployment...');
      const seed100Path = path.join(__dirname, 'data', 'seed-100.json');
      const seed200Path = path.join(__dirname, 'data', 'seed-200.json');
      const seed300Path = path.join(__dirname, 'data', 'seed-300.json');
      
      const words100 = fs.existsSync(seed100Path) ? JSON.parse(fs.readFileSync(seed100Path, 'utf-8')) : [];
      const words200 = fs.existsSync(seed200Path) ? JSON.parse(fs.readFileSync(seed200Path, 'utf-8')) : [];
      const words300 = fs.existsSync(seed300Path) ? JSON.parse(fs.readFileSync(seed300Path, 'utf-8')) : [];
      
      const allWords = [...words100, ...words200, ...words300];
      if (allWords.length > 0) {
        await Word.insertMany(allWords);
        console.log(`✅ Auto-seeding complete! Imported ${allWords.length} words into MongoDB.`);
      }
    } else {
      console.log(`ℹ️ MongoDB already populated with ${count} words.`);
    }
  } catch (err) {
    console.error('❌ Auto-seeding error:', err);
  }
};

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await autoSeedIfEmpty();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

