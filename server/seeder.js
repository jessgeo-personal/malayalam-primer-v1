require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import the Mongoose model
const WordItem = require('./models/Word');

// Read JSON files helper
const seed100Path = path.join(__dirname, 'data', 'seed-100.json');
const seed200Path = path.join(__dirname, 'data', 'seed-200.json');
const seed300Path = path.join(__dirname, 'data', 'seed-300.json');

const loadSeedWords = () => {
  const words100 = fs.existsSync(seed100Path) ? JSON.parse(fs.readFileSync(seed100Path, 'utf-8')) : [];
  const words200 = fs.existsSync(seed200Path) ? JSON.parse(fs.readFileSync(seed200Path, 'utf-8')) : [];
  const words300 = fs.existsSync(seed300Path) ? JSON.parse(fs.readFileSync(seed300Path, 'utf-8')) : [];
  return {
    words100,
    words200,
    words300,
    allWords: [...words100, ...words200, ...words300]
  };
};

// Seeder Function
const importData = async (WordModel = WordItem) => {
  const { allWords } = loadSeedWords();
  await WordModel.deleteMany({});
  if (allWords.length > 0) {
    await WordModel.insertMany(allWords);
  }
  return allWords.length;
};

// Idempotent auto-seed check function
const seedDatabaseIfNeeded = async (WordModel = WordItem) => {
  const { words100, allWords } = loadSeedWords();
  const cycle1Count = words100.length;
  const currentCount = await WordModel.countDocuments();

  if (currentCount === 0 || currentCount < cycle1Count) {
    await importData(WordModel);
    console.log('[AutoSeed] Dictionary populated successfully');
    return { seeded: true, count: allWords.length };
  } else {
    console.log('[AutoSeed] Dictionary up to date, skipping seed');
    return { seeded: false, count: currentCount };
  }
};

// CLI Standalone execution
if (require.main === module) {
  console.log('Connecting to:', process.env.MONGO_URI);
  mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
      console.log('✅ Connected to MongoDB');
      console.log('Clearing existing WordItem collection...');
      const { allWords } = loadSeedWords();
      console.log(`Importing ${allWords.length} words into the database...`);
      await importData();
      console.log('✅ Data import completely successful!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Database connection error:', err);
      process.exit(1);
    });
}

module.exports = {
  seedDatabaseIfNeeded,
  importData,
  loadSeedWords
};