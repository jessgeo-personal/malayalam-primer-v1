require('dotenv').config();
const Word = require('../models/Word');
const mongoose = require('mongoose');

describe('Database Curriculum Integrity', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/malayalam_decode');
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Cycles should have strictly non-overlapping lessonId ranges', async () => {
    const cycles = [1, 2, 3, 4];
    const ranges = [];

    for (const cid of cycles) {
      const minWord = await Word.findOne({ unlockCycle: cid }).sort({ lessonId: 1 });
      const maxWord = await Word.findOne({ unlockCycle: cid }).sort({ lessonId: -1 });

      if (minWord && maxWord) {
        ranges.push({ cycle: cid, start: minWord.lessonId, end: maxWord.lessonId });
      }
    }

    // Sort ranges by cycle
    ranges.sort((a, b) => a.cycle - b.cycle);

    // Assert no overlaps
    for (let i = 0; i < ranges.length - 1; i++) {
      const current = ranges[i];
      const next = ranges[i + 1];
      
      expect(current.end).toBeLessThan(next.start);
      console.log(`Cycle ${current.cycle} (L${current.start}-${current.end}) - OK`);
    }
  });

  test('Every word with a lessonType build/suffix must have a lessonId > 0', async () => {
    const invalidWords = await Word.find({ 
      lessonType: { $in: ['build', 'suffix'] },
      lessonId: { $lte: 0 }
    });
    
    expect(invalidWords.length).toBe(0);
  });

  test('Database Capacity Integrity: Cycle 2 Grammar Lessons must have >= 10 items', () => {
    const fs = require('fs');
    const path = require('path');
    
    const seed200Path = path.join(__dirname, '../data/seed-200.json');
    const data = JSON.parse(fs.readFileSync(seed200Path, 'utf8'));
    
    // Group items by lessonId
    const lessonCounts = {};
    data.forEach(item => {
      if (item.lessonId) {
        lessonCounts[item.lessonId] = (lessonCounts[item.lessonId] || 0) + 1;
      }
    });

    // We expect lessons 11, 12, 13, 14, 15, 16 to exist (Shifted from 10-15)
    const requiredLessons = [11, 12, 13, 14, 15, 16];
    
    requiredLessons.forEach(lessonId => {
      const count = lessonCounts[lessonId] || 0;
      const minCount = lessonId === 16 ? 6 : 10; // Lesson 16 has 6 items (1 concept + 5 tense)
      expect(count).toBeGreaterThanOrEqual(minCount);
    });
  });

  test('The Great Split Integrity: Every buildable word in seed files must have requiredCharacters', () => {
    const fs = require('fs');
    const path = require('path');
    const seedDir = path.join(__dirname, '../data');
    const seedFiles = ['seed-100.json', 'seed-200.json', 'seed-300.json'];

    seedFiles.forEach(file => {
      const filePath = path.join(seedDir, file);
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const buildableWords = data.filter(item => 
          (item.lessonType === 'build' || !item.lessonType) && 
          item.isSuffix !== true &&
          item.lessonType !== 'concept' &&
          item.lessonType !== 'trace' &&
          item.lessonType !== 'match' &&
          item.lessonType !== 'scramble'
        );

        const missingSplits = buildableWords.filter(w => !w.requiredCharacters || w.requiredCharacters.length === 0);
        
        if (missingSplits.length > 0) {
          console.warn(`File ${file}: Missing requiredCharacters for ${missingSplits.length} words (e.g., ${missingSplits[0].wordId})`);
        }

        expect(missingSplits.length).toBe(0);

        // Check Tense Lesson Integrity
        const tenseWords = data.filter(item => item.lessonType === 'tense');
        tenseWords.forEach(w => {
          expect(w.pastForm).toBeDefined();
          expect(w.presentForm).toBeDefined();
          expect(w.futureForm).toBeDefined();
          expect(w.pastEnglish).toBeDefined();
          expect(w.presentEnglish).toBeDefined();
          expect(w.futureEnglish).toBeDefined();
          expect(w.baseWord).toBeDefined();
        });

        // Check Scramble Lesson Integrity (Added 2026-06-02)
        const scrambleWords = data.filter(item => item.lessonType === 'scramble');
        scrambleWords.forEach(w => {
          expect(w.sentenceParts).toBeDefined();
          expect(w.sentenceParts.length).toBeGreaterThan(1);
        });
      }
    });
  });
});
