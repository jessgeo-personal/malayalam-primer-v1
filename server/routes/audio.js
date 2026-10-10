const express = require('express');
const router = express.Router();
const audioService = require('../services/audioService');
const Word = require('../models/Word');

/**
 * GET /api/audio/preview
 * Streams an on-the-fly MP3 buffer for previewing pronunciation,
 * with optional lazy-caching to client/public/audio/ to populate missing static assets.
 */
router.get('/preview', async (req, res) => {
  try {
    const { text, tl = 'ml', saveAs } = req.query;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text query parameter is required' });
    }

    const trimmedText = text.trim();
    const buffer = await audioService.fetchTTSBuffer(trimmedText, tl);

    // Lazy caching on disk:
    if (saveAs && typeof saveAs === 'string') {
      try {
        const cleanPath = saveAs.replace(/^\/+/, '');
        const parts = cleanPath.split('/');
        if (parts.length === 2 && (parts[0] === 'words' || parts[0] === 'letters')) {
          audioService.saveAudioFile(parts[0], parts[1], buffer);
        }
      } catch (cacheErr) {
        console.warn('[Audio Route] Lazy caching failed for saveAs:', cacheErr.message);
      }
    } else if (trimmedText.length <= 4 && /[\u0D00-\u0D7F]/.test(trimmedText)) {
      // Auto-cache single grapheme / letter requests
      try {
        const letterFilename = audioService.getLetterAudioFilename(trimmedText);
        audioService.saveAudioFile('letters', letterFilename, buffer);
      } catch (cacheErr) {
        // Silently continue if auto-cache cannot write
      }
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache'
    });

    return res.send(buffer);
  } catch (err) {
    console.error('[Audio Route] Preview error:', err);
    return res.status(500).json({ error: 'Failed to generate audio preview', details: err.message });
  }
});

/**
 * POST /api/audio/commit
 * Generates an MP3 file, saves it to static public directory using codepoint normalization,
 * and optionally updates MongoDB.
 */
router.post('/commit', async (req, res) => {
  try {
    const { id, type, text, phonetic } = req.body;

    if (!id || !type || !text) {
      return res.status(400).json({ error: 'id, type, and text are required fields' });
    }

    if (type !== 'word' && type !== 'letter') {
      return res.status(400).json({ error: 'type must be either "word" or "letter"' });
    }

    const subfolder = type === 'word' ? 'words' : 'letters';
    const filename = type === 'word' ? id : audioService.getLetterAudioFilename(id);

    const buffer = await audioService.fetchTTSBuffer(text.trim(), 'ml');
    const url = audioService.saveAudioFile(subfolder, filename, buffer);

    if (type === 'word') {
      try {
        const wordDoc = await Word.findOne({ wordId: id });
        if (wordDoc) {
          if (phonetic !== undefined) {
            wordDoc.phonetic = phonetic;
          }
          if (text.trim() && text.trim() !== wordDoc.malayalamText) {
            wordDoc.malayalamText = text.trim();
          }
          await wordDoc.save();
        }
      } catch (dbErr) {
        console.warn('[Audio Route] Failed to update MongoDB word doc:', dbErr.message);
      }
    }

    return res.json({ success: true, url });
  } catch (err) {
    console.error('[Audio Route] Commit error:', err);
    return res.status(500).json({ error: 'Failed to commit audio asset', details: err.message });
  }
});

module.exports = router;
