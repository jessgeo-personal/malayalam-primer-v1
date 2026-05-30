require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import the Mongoose model
const WordItem = require('./models/Word');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
});

// Read JSON files
const seed100Path = path.join(__dirname, 'data', 'seed-100.json');
const seed200Path = path.join(__dirname, 'data', 'seed-200.json');
const seed300Path = path.join(__dirname, 'data', 'seed-300.json');

const words100 = JSON.parse(fs.readFileSync(seed100Path, 'utf-8'));
const words200 = JSON.parse(fs.readFileSync(seed200Path, 'utf-8'));
const words300 = JSON.parse(fs.readFileSync(seed300Path, 'utf-8'));

// Combine arrays
const allWords = [...words100, ...words200, ...words300];

// Seeder Function
const importData = async () => {
  try {
    // Optional: Clear existing dictionary to prevent duplicate key errors on rerun
    console.log('Clearing existing WordItem collection...');
    await WordItem.deleteMany({});
    
    // Bulk insert the combined array
    console.log(`Importing ${allWords.length} words into the database...`);
    await WordItem.insertMany(allWords);
    
    console.log('✅ Data import completely successful!');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Execute the function
importData();