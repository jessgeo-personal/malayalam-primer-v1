const fs = require('fs');
const path = require('path');

describe('Seed Data Integrity', () => {
  const seedFiles = ['seed-100.json', 'seed-200.json'];
  const dataDir = path.join(__dirname, '../data');

  seedFiles.forEach(fileName => {
    test(`${fileName} should adhere to the Word schema`, () => {
      const filePath = path.join(dataDir, fileName);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      expect(Array.isArray(data)).toBe(true);
      data.forEach(word => {
        expect(word).toHaveProperty('wordId');
        expect(word).toHaveProperty('malayalamText');
        expect(word).toHaveProperty('englishTranslation');
        expect(word).toHaveProperty('phonetic');
        expect(word).toHaveProperty('bucketId');
        expect(word).toHaveProperty('unlockCycle');
        
        expect(typeof word.wordId).toBe('string');
        expect(typeof word.malayalamText).toBe('string');
        expect(typeof word.englishTranslation).toBe('string');
        expect(typeof word.phonetic).toBe('string');
        expect(typeof word.bucketId).toBe('number');
        expect(typeof word.unlockCycle).toBe('number');
      });
    });
  });
});
