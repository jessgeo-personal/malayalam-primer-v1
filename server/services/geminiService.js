const { GoogleGenAI } = require('@google/genai');
const Word = require('../models/Word');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateDynamicSentence(userId, targetCycle) {
  try {
    const words = await Word.find({ unlockCycle: { $lte: targetCycle } });
    const vocabList = words.map(w => `${w.malayalamText} (${w.englishTranslation})`).join(', ');

    const prompt = `You are an educational engine. Generate a SINGLE, grammatically correct Malayalam sentence.
STRICT RULES:
1. You may ONLY use words from this exact list: [${vocabList}]. Do not invent words.
2. If using a suffix (like -ൽ or -ലേക്ക്), attach it correctly.
3. Keep the sentence short (2 to 5 words).
OUTPUT FORMAT: JSON object containing 'malayalam', 'english', 'sentenceType', and 'wordsUsed' (array).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

module.exports = { generateDynamicSentence };
