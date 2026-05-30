require('dotenv').config();
const Word = require('../models/Word');
const mongoose = require('mongoose');

describe('Database Curriculum Integrity', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
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
});
