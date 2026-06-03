const srsEngine = require('../services/srsEngine');
const Progress = require('../models/Progress');
const Word = require('../models/Word');
const User = require('../models/User');

jest.mock('../models/Progress');
jest.mock('../models/Word');
jest.mock('../models/User');

describe('Suffix Snapper Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    User.findOne.mockResolvedValue({ lessonHistory: [] });
  });

  test('generateLessonPayload should return suffix fields and showTutorial: true for new items', async () => {
    const userId = 'user123';
    
    const mockData = [
      { 
        wordId: 's001', 
        lessonType: 'suffix', 
        baseWord: 'വീട്', 
        targetSuffix: 'കൾ', 
        distractorSuffixes: ['മാർ'],
        toObject: () => ({ 
          wordId: 's001', 
          lessonType: 'suffix', 
          baseWord: 'വീട്', 
          targetSuffix: 'കൾ', 
          distractorSuffixes: ['മാർ'] 
        }) 
      }
    ];

    Word.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockData)
    });

    // Mock Progress.find to return null (first encounter)
    Progress.find.mockResolvedValue([]);

    const bundle = await srsEngine.generateLessonPayload(userId, 10);
    
    expect(bundle.length).toBe(1);
    expect(bundle[0].lessonType).toBe('suffix');
    expect(bundle[0].baseWord).toBe('വീട്');
    expect(bundle[0].targetSuffix).toBe('കൾ');
    expect(bundle[0].distractorSuffixes).toContain('മാർ');
    expect(bundle[0].showTutorial).toBe(true);
  });

  test('generateLessonPayload should return showTutorial: false for items already encountered', async () => {
    const userId = 'user123';
    
    const mockData = [
      { 
        wordId: 's001', 
        lessonType: 'suffix', 
        toObject: () => ({ wordId: 's001', lessonType: 'suffix' }) 
      }
    ];

    Word.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockData)
    });

    // Mock Progress.find to return existing progress
    Progress.find.mockResolvedValue([{ userId, itemId: 's001', itemType: 'word' }]);

    const bundle = await srsEngine.generateLessonPayload(userId, 10);
    
    expect(bundle[0].showTutorial).toBe(false);
  });
});
