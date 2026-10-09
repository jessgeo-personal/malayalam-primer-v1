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

    // We expect lessons 15, 16, 17, 18, 19, 20 to exist (Shifted from 11-16)
    const requiredLessons = [15, 16, 17, 18, 19, 20];
    
    requiredLessons.forEach(lessonId => {
      const count = lessonCounts[lessonId] || 0;
      const minCount = lessonId === 20 ? 6 : 10; // Lesson 20 has 6 items (1 concept + 5 tense)
      expect(count).toBeGreaterThanOrEqual(minCount);
    });
  });

  test('Cycle 1 Expansion Integrity (Lessons 1-14)', () => {
    const fs = require('fs');
    const path = require('path');
    const seed100Path = path.join(__dirname, '../data/seed-100.json');
    const data = JSON.parse(fs.readFileSync(seed100Path, 'utf8'));

    // 1. Unique ID Guard
    const ids = data.map(item => item.wordId);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);

    // 2. Orphan Check: Every character in 'requiredCharacters' must be traced in same or earlier lesson
    const buildWords = data.filter(item => item.lessonType === 'build');
    const traces = data.filter(item => item.lessonType === 'trace');
    
    buildWords.forEach(word => {
      word.requiredCharacters.forEach(char => {
        const trace = traces.find(t => t.malayalamText === char);
        if (!trace) {
          throw new Error(`Orphan character found: '${char}' in word ${word.wordId} (${word.malayalamText}). No trace found in seed-100.json.`);
        }
        if (trace.lessonId > word.lessonId) {
            throw new Error(`Pedagogical violation: Character '${char}' for word ${word.wordId} is traced in Lesson ${trace.lessonId}, but word is built in Lesson ${word.lessonId}.`);
        }
      });
    });

    // 3. 3-Act Structure Audit for Expansion Lessons (4-14)
    const expansionLessons = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    expansionLessons.forEach(lid => {
        const lessonItems = data.filter(i => i.lessonId === lid);
        if (lessonItems.length > 0) {
            const act1 = lessonItems.find(i => i.lessonType === 'concept' && i.wordId.includes('a1'));
            const act2 = lessonItems.find(i => i.lessonType === 'concept' && i.wordId.includes('a2'));
            const act3 = lessonItems.find(i => i.lessonType === 'concept' && i.wordId.includes('a3'));
            
            expect(act1).toBeDefined();
            expect(act2).toBeDefined();
            expect(act3).toBeDefined();

            // Act 2 Intro must require ALL Match items from Act 1 (if any)
            const matchIds = lessonItems.filter(i => i.lessonType === 'match').map(i => i.wordId);
            matchIds.forEach(mid => {
                expect(act2.prerequisites).toContain(mid);
            });
        }
    });

    console.log("Cycle 1 Integrity Scan: OK");
  });
});

const seed200 = require('../data/seed-200.json');

describe('DATA-02: Cycle 2 (Lessons 15-20) Data Integrity & Zero-Empty-Boxes', () => {
  it('should ensure all Cycle 2 words have valid lessonId between 15 and 20', () => {
    expect(seed200.length).toBeGreaterThan(0);
    seed200.forEach((word) => {
      expect(word.lessonId).toBeDefined();
      expect(word.lessonId).toBeGreaterThanOrEqual(15);
      expect(word.lessonId).toBeLessThanOrEqual(20);
    });
  });

  it('should enforce the Zero-Empty-Boxes rule on requiredCharacters', () => {
    seed200.forEach((word) => {
      // Suffix items or non-assembly items may be handled per schema,
      // but all vocabulary words for assembly must have valid splits
      if (!word.isSuffix) {
        expect(Array.isArray(word.requiredCharacters)).toBe(true);
        expect(word.requiredCharacters.length).toBeGreaterThan(0);
        word.requiredCharacters.forEach((char) => {
          expect(typeof char).toBe('string');
          expect(char.trim().length).toBeGreaterThan(0);
        });
      }
    });
  });
});

const seed300 = require('../data/seed-300.json');

describe('DATA-03: Cycle 3 (Lessons 21-25) Data Integrity & Zero-Empty-Boxes', () => {
  it('should ensure all Cycle 3 words have valid lessonId between 21 and 25', () => {
    expect(seed300.length).toBeGreaterThan(0);
    seed300.forEach((word) => {
      expect(word.lessonId).toBeDefined();
      expect(word.lessonId).toBeGreaterThanOrEqual(21);
      expect(word.lessonId).toBeLessThanOrEqual(25);
    });
  });

  it('should ensure each Cycle 3 lesson (21-25) has at least 8 items', () => {
    const cycle3Lessons = [21, 22, 23, 24, 25];
    cycle3Lessons.forEach((lessonId) => {
      const itemsInLesson = seed300.filter((word) => word.lessonId === lessonId);
      expect(itemsInLesson.length).toBeGreaterThanOrEqual(8);
    });
  });

  it('should enforce the Zero-Empty-Boxes rule on requiredCharacters', () => {
    seed300.forEach((word) => {
      if (!word.isSuffix) {
        expect(Array.isArray(word.requiredCharacters)).toBe(true);
        expect(word.requiredCharacters.length).toBeGreaterThan(0);
        word.requiredCharacters.forEach((char) => {
          expect(typeof char).toBe('string');
          expect(char.trim().length).toBeGreaterThan(0);
        });
      }
    });
  });
});


