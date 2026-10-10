const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const audioRoutes = require('../routes/audio');
const audioService = require('../services/audioService');
const Word = require('../models/Word');

const app = express();
app.use(express.json());
app.use('/api/audio', audioRoutes);

describe('AUDIO-03: Backend Audio Curation Routes & Service', () => {
  beforeAll(async () => {
    const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/malayalam_prime_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url);
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await Word.deleteMany({ wordId: { $in: ['test_audio_w001', 'test_audio_w002'] } });
      await mongoose.connection.close();
    }
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/audio/preview', () => {
    it('returns 400 when text query parameter is missing', async () => {
      const res = await request(app).get('/api/audio/preview');
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Text query parameter is required/);
    });

    it('streams mp3 buffer with audio/mpeg content type on success', async () => {
      const mockBuffer = Buffer.from('fake-mp3-audio-bytes');
      jest.spyOn(audioService, 'fetchTTSBuffer').mockResolvedValue(mockBuffer);

      const res = await request(app).get('/api/audio/preview?text=അമ്മ&tl=ml');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('audio/mpeg');
      expect(res.body).toEqual(mockBuffer);
      expect(audioService.fetchTTSBuffer).toHaveBeenCalledWith('അമ്മ', 'ml');
    });

    it('lazy-caches audio to disk when saveAs query param is passed', async () => {
      const mockBuffer = Buffer.from('fake-mp3-audio-bytes');
      jest.spyOn(audioService, 'fetchTTSBuffer').mockResolvedValue(mockBuffer);
      const saveSpy = jest.spyOn(audioService, 'saveAudioFile').mockReturnValue('/audio/words/w001.mp3');

      const res = await request(app).get('/api/audio/preview?text=അമ്മ&tl=ml&saveAs=words/w001.mp3');

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith('words', 'w001.mp3', mockBuffer);
    });

    it('auto-caches letter audio when single Malayalam grapheme is requested without saveAs', async () => {
      const mockBuffer = Buffer.from('letter-audio-bytes');
      jest.spyOn(audioService, 'fetchTTSBuffer').mockResolvedValue(mockBuffer);
      const saveSpy = jest.spyOn(audioService, 'saveAudioFile').mockReturnValue('/audio/letters/letter_0d24.mp3');

      const res = await request(app).get('/api/audio/preview?text=ത&tl=ml');

      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith('letters', 'letter_0d24.mp3', mockBuffer);
    });

    it('returns 500 when audioService throws an error', async () => {
      jest.spyOn(audioService, 'fetchTTSBuffer').mockRejectedValue(new Error('TTS upstream rate limit'));

      const res = await request(app).get('/api/audio/preview?text=അമ്മ');

      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Failed to generate audio preview/);
    });
  });

  describe('POST /api/audio/commit', () => {
    it('returns 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/audio/commit')
        .send({ id: 'w001' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/id, type, and text are required/);
    });

    it('returns 400 when type is neither word nor letter', async () => {
      const res = await request(app)
        .post('/api/audio/commit')
        .send({ id: 'w001', type: 'sentence', text: 'ഞാൻ' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/type must be either "word" or "letter"/);
    });

    it('commits word audio, saves file, and updates Word document in MongoDB', async () => {
      const mockBuffer = Buffer.from('test-audio-word');
      jest.spyOn(audioService, 'fetchTTSBuffer').mockResolvedValue(mockBuffer);
      jest.spyOn(audioService, 'saveAudioFile').mockReturnValue('/audio/words/test_audio_w001.mp3');

      // Create test word in database
      await Word.deleteMany({ wordId: 'test_audio_w001' });
      await Word.create({
        wordId: 'test_audio_w001',
        malayalamText: 'അമ്മ',
        englishTranslation: 'Mother',
        phonetic: 'amma',
        bucketId: 1,
        unlockCycle: 1,
        lessonId: 1,
        lessonType: 'build'
      });

      const res = await request(app)
        .post('/api/audio/commit')
        .send({
          id: 'test_audio_w001',
          type: 'word',
          text: 'അമ്മേ',
          phonetic: 'ammay'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.url).toBe('/audio/words/test_audio_w001.mp3');

      expect(audioService.fetchTTSBuffer).toHaveBeenCalledWith('അമ്മേ', 'ml');
      expect(audioService.saveAudioFile).toHaveBeenCalledWith('words', 'test_audio_w001', mockBuffer);

      // Verify MongoDB update
      const updatedWord = await Word.findOne({ wordId: 'test_audio_w001' });
      expect(updatedWord.phonetic).toBe('ammay');
      expect(updatedWord.malayalamText).toBe('അമ്മേ');
    });

    it('commits letter audio to letters folder with codepoint normalized filename', async () => {
      const mockBuffer = Buffer.from('test-letter-audio');
      jest.spyOn(audioService, 'fetchTTSBuffer').mockResolvedValue(mockBuffer);
      jest.spyOn(audioService, 'saveAudioFile').mockReturnValue('/audio/letters/letter_0d05.mp3');

      const res = await request(app)
        .post('/api/audio/commit')
        .send({
          id: 'അ',
          type: 'letter',
          text: 'അ'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(audioService.saveAudioFile).toHaveBeenCalledWith('letters', 'letter_0d05.mp3', mockBuffer);
    });
  });

  describe('audioService Unit Functions', () => {
    it('getLetterAudioFilename creates valid ASCII hex codepoint filename', () => {
      expect(audioService.getLetterAudioFilename('ത')).toBe('letter_0d24.mp3');
      expect(audioService.getLetterAudioFilename('മ്മ')).toBe('letter_0d2e_0d4d_0d2e.mp3');
      expect(audioService.getLetterAudioFilename('')).toBe('unknown.mp3');
    });

    it('fetchTTSBuffer throws if text is empty', async () => {
      await expect(audioService.fetchTTSBuffer('')).rejects.toThrow('Text is required');
    });

    it('saveAudioFile creates directory and writes file, safely handling extension', () => {
      const fs = require('fs');
      const mkdirSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
      const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

      const result = audioService.saveAudioFile('words', 'w_test.mp3', Buffer.from('test'));
      expect(result).toBe('/audio/words/w_test.mp3');
      expect(writeSpy).toHaveBeenCalled();

      mkdirSpy.mockRestore();
      writeSpy.mockRestore();
    });
  });
});
