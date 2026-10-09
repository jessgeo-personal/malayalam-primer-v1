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
        if (word.lessonType !== 'concept') {
          expect(word).toHaveProperty('phonetic');
          expect(typeof word.phonetic).toBe('string');
        }
        expect(word).toHaveProperty('bucketId');
        expect(word).toHaveProperty('unlockCycle');
        
        expect(typeof word.wordId).toBe('string');
        expect(typeof word.malayalamText).toBe('string');
        expect(typeof word.englishTranslation).toBe('string');
        expect(typeof word.bucketId).toBe('number');
        expect(typeof word.unlockCycle).toBe('number');
      });
    });
  });
});

describe('seedDatabaseIfNeeded', () => {
  const { seedDatabaseIfNeeded } = require('../seeder');

  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test('should skip seeding if dictionary is already populated', async () => {
    const mockWord = {
      countDocuments: jest.fn().mockResolvedValue(400),
      deleteMany: jest.fn().mockResolvedValue({}),
      insertMany: jest.fn().mockResolvedValue([]),
    };

    const result = await seedDatabaseIfNeeded(mockWord);

    expect(mockWord.countDocuments).toHaveBeenCalled();
    expect(mockWord.deleteMany).not.toHaveBeenCalled();
    expect(mockWord.insertMany).not.toHaveBeenCalled();
    expect(result).toEqual({ seeded: false, count: 400 });
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[AutoSeed] Dictionary up to date, skipping seed'));
  });

  test('should seed dictionary if count is 0', async () => {
    const mockWord = {
      countDocuments: jest.fn().mockResolvedValue(0),
      deleteMany: jest.fn().mockResolvedValue({}),
      insertMany: jest.fn().mockResolvedValue([]),
    };

    const result = await seedDatabaseIfNeeded(mockWord);

    expect(mockWord.countDocuments).toHaveBeenCalled();
    expect(mockWord.deleteMany).toHaveBeenCalledWith({});
    expect(mockWord.insertMany).toHaveBeenCalled();
    expect(result.seeded).toBe(true);
    expect(result.count).toBeGreaterThan(0);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[AutoSeed] Dictionary populated successfully'));
  });

  test('should seed dictionary if count is less than Cycle 1 count in seed-100.json', async () => {
    const mockWord = {
      countDocuments: jest.fn().mockResolvedValue(5),
      deleteMany: jest.fn().mockResolvedValue({}),
      insertMany: jest.fn().mockResolvedValue([]),
    };

    const result = await seedDatabaseIfNeeded(mockWord);

    expect(mockWord.countDocuments).toHaveBeenCalled();
    expect(mockWord.deleteMany).toHaveBeenCalledWith({});
    expect(mockWord.insertMany).toHaveBeenCalled();
    expect(result.seeded).toBe(true);
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('[AutoSeed] Dictionary populated successfully'));
  });
});

