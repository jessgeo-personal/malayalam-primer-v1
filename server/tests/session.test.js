const srsEngine = require('../services/srsEngine');
const Progress = require('../models/Progress');
const Word = require('../models/Word');

jest.mock('../models/Progress');
jest.mock('../models/Word');

describe('Session & Graduation Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('evaluateGraduation should mark constituent letters as graduated when a word is correct', async () => {
    const userId = 'user123';
    const wordId = 'mathu'; // 'Mother' in Malayalam (example)
    const letters = ['മ', 'ാ', 'ത', '്'];

    Word.findOne.mockResolvedValue({
      wordId: wordId,
      requiredCharacters: letters
    });

    // Mock Progress.updateOne to succeed
    Progress.updateOne.mockResolvedValue({ nModified: 1 });

    await srsEngine.evaluateGraduation(userId, wordId, 'word');

    // Should call updateOne for each letter
    expect(Progress.updateOne).toHaveBeenCalledTimes(letters.length);
    letters.forEach(letter => {
      expect(Progress.updateOne).toHaveBeenCalledWith(
        { userId, itemId: letter, itemType: 'letter' },
        { $set: { graduated: true } }
      );
    });
  });

  test('generateRevisionPayload should not include graduated items', async () => {
    const userId = 'user123';
    
    Progress.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        { itemId: 'word1', itemType: 'word', graduated: false, toObject: () => ({ itemId: 'word1', itemType: 'word' }) },
        { itemId: 'letter1', itemType: 'letter', graduated: false, toObject: () => ({ itemId: 'letter1', itemType: 'letter' }) }
      ])
    });

    Word.findOne.mockImplementation(({ wordId, malayalamText }) => {
      if (wordId === 'word1' || (malayalamText === 'letter1')) {
        return Promise.resolve({ toObject: () => ({ wordId: 'word1', lessonType: 'build' }) });
      }
      return Promise.resolve(null);
    });

    const payload = await srsEngine.generateRevisionPayload(userId);
    
    expect(Progress.find).toHaveBeenCalledWith(expect.objectContaining({
      userId,
      graduated: false
    }));
    expect(payload.length).toBe(2);
  });

  test('generateLessonPayload should return up to 8 items and group tracing first', async () => {
    const userId = 'user123';
    
    const mockData = [
      { wordId: 'w1', lessonType: 'build', toObject: () => ({ wordId: 'w1', lessonType: 'build' }) },
      { wordId: 'w2', lessonType: 'trace', toObject: () => ({ wordId: 'w2', lessonType: 'trace' }) },
      { wordId: 'w3', lessonType: 'build', toObject: () => ({ wordId: 'w3', lessonType: 'build' }) },
      { wordId: 'w4', lessonType: 'trace', toObject: () => ({ wordId: 'w4', lessonType: 'trace' }) },
      { wordId: 'w5', lessonType: 'build', toObject: () => ({ wordId: 'w5', lessonType: 'build' }) },
      { wordId: 'w6', lessonType: 'build', toObject: () => ({ wordId: 'w6', lessonType: 'build' }) },
      { wordId: 'w7', lessonType: 'build', toObject: () => ({ wordId: 'w7', lessonType: 'build' }) },
      { wordId: 'w8', lessonType: 'build', toObject: () => ({ wordId: 'w8', lessonType: 'build' }) }
    ];

    Word.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockData)
    });

    const bundle = await srsEngine.generateLessonPayload(userId, 1);
    
    expect(bundle.length).toBe(8);
    expect(Word.find).toHaveBeenCalledWith({ lessonId: 1 });

    // Verify ordering: Trace items MUST come first
    expect(bundle[0].lessonType).toBe('trace');
    expect(bundle[1].lessonType).toBe('trace');
    expect(bundle[2].lessonType).not.toBe('trace');
  });
});
