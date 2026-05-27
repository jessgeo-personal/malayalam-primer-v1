const { GoogleGenAI } = require('@google/genai');
const WordItem = require('../models/Word');
const ProgressLog = require('../models/Progress'); // Assuming you have a progress schema

// Initialize the Gemini Client using your existing API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateDynamicSentence = async (userId, targetCycle) => {
  try {
    // 1. Fetch the words the user has currently unlocked/mastered from MongoDB
    // (In a real scenario, you'd filter by user progress. Here we simulate pulling the allowed cycle)
    const availableWords = await WordItem.find({ unlockCycle: { $lte: targetCycle } });
    
    // Extract just the Malayalam text and the English meaning to feed to the AI
    const vocabList = availableWords.map(w => `${w.malayalamText} (${w.englishTranslation})`).join(', ');

    // 2. Construct the strict System Prompt
    const systemInstruction = `
      You are an educational engine for an 8-year-old learning Malayalam.
      Your task is to generate a SINGLE, grammatically correct Malayalam sentence.
      
      STRICT RULES:
      1. You may ONLY use words from this exact list: [${vocabList}]. Do not invent or add any other words.
      2. If you need to use a suffix (like -ൽ or -ലേക്ക്), attach it correctly to the noun.
      3. Keep the sentence short (2 to 5 words maximum).
      
      OUTPUT FORMAT:
      You must respond with ONLY a valid JSON object. No markdown formatting, no conversational text.
      {
        "malayalam": "The generated sentence",
        "english": "The English translation",
        "sentenceType": "statement | question | command",
        "wordsUsed": ["list", "of", "malayalam", "words", "used"]
      }
    `;

    // 3. Call the Gemini API (using gemini-2.5-flash for maximum speed on the tablet)
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate the next sentence puzzle.',
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.2, // Low temperature keeps the AI highly deterministic and strict
            responseMimeType: "application/json", // Forces pure JSON output
        }
    });

    // 4. Parse and return the JSON payload to send to the React frontend
    const generatedPuzzle = JSON.parse(response.text);
    return generatedPuzzle;

  } catch (error) {
    console.error('Error generating AI sentence:', error);
    throw new Error('Failed to generate sentence puzzle');
  }
};

module.exports = { generateDynamicSentence };