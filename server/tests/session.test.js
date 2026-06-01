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

  test('generateLessonPayload should group concept first, then tracing, then others', async () => {
    const userId = 'user123';
    
    const mockData = [
      { wordId: 'w1', lessonType: 'build', toObject: () => ({ wordId: 'w1', lessonType: 'build' }) },
      { wordId: 'w2', lessonType: 'trace', malayalamText: 'ഞ', toObject: () => ({ wordId: 'w2', lessonType: 'trace', malayalamText: 'ഞ' }) },
      { wordId: 'c1', lessonType: 'concept', toObject: () => ({ wordId: 'c1', lessonType: 'concept' }) },
      { wordId: 'w3', lessonType: 'build', toObject: () => ({ wordId: 'w3', lessonType: 'build' }) },
      { wordId: 'w4', lessonType: 'trace', malayalamText: 'മ', toObject: () => ({ wordId: 'w4', lessonType: 'trace', malayalamText: 'മ' }) }
    ];

    Word.find.mockImplementation((query) => {
      if (query.lessonId) {
        return { sort: jest.fn().mockResolvedValue(mockData) };
      }
      return { limit: jest.fn().mockResolvedValue([]) };
    });

    const bundle = await srsEngine.generateLessonPayload(userId, 1);
    
    expect(bundle.length).toBe(5);
    expect(Word.find).toHaveBeenCalledWith({ lessonId: 1 });

    // Verify ordering: Concept MUST come first, then trace
    expect(bundle[0].lessonType).toBe('concept');
    expect(bundle[1].lessonType).toBe('trace');
    expect(bundle[2].lessonType).toBe('trace');
    expect(bundle[3].lessonType).toBe('build');
  });

  test('generateLessonPayload should attach up to 3 exampleWords to trace items', async () => {
    const userId = 'user123';
    
    const mockWords = [
      { wordId: 't1', malayalamText: 'അ', lessonType: 'trace', toObject: () => ({ wordId: 't1', malayalamText: 'അ', lessonType: 'trace' }) }
    ];

    const mockExamples = [
      { wordId: 'w1', malayalamText: 'അവൻ', englishTranslation: 'He', requiredCharacters: ['അ', 'വ', 'ൻ'], toObject: () => ({ wordId: 'w1', malayalamText: 'അവൻ', englishTranslation: 'He' }) },
      { wordId: 'w2', malayalamText: 'അമ്മ', englishTranslation: 'Mother', requiredCharacters: ['അ', 'മ്മ'], toObject: () => ({ wordId: 'w2', malayalamText: 'അമ്മ', englishTranslation: 'Mother' }) }
    ];

    Word.find.mockImplementation((query) => {
      if (query.lessonId === 1) {
        return { sort: jest.fn().mockResolvedValue(mockWords) };
      }
      if (query.lessonType === 'build' && query.requiredCharacters === 'അ') {
        return { limit: jest.fn().mockResolvedValue(mockExamples) };
      }
      return { sort: jest.fn().mockResolvedValue([]), limit: jest.fn().mockResolvedValue([]) };
    });

    Progress.findOne.mockResolvedValue(null);

    const bundle = await srsEngine.generateLessonPayload(userId, 1);
    
    expect(bundle[0].lessonType).toBe('trace');
    expect(bundle[0].exampleWords).toBeDefined();
    expect(bundle[0].exampleWords.length).toBe(2);
    expect(bundle[0].exampleWords[0].malayalamText).toBe('അവൻ');
  });
});
