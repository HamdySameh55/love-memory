const router = require('express').Router();
const Memory = require('../models/Memory');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, deleteMedia }  = require('../middleware/upload');

// ── GET all memories (both roles can read) ────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const memories = await Memory.find().sort({ date: -1 });
    res.json(memories);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── GET single memory ─────────────────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });
    res.json(memory);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── POST create memory (admin only) ──────────────────────────────────────────
router.post('/', protect, adminOnly, upload.single('media'), async (req, res) => {
  try {
    const { title, description, date, emoji } = req.body;
    if (!title || !description || !date)
      return res.status(400).json({ message: 'Title, description and date are required' });

    let mediaUrl  = '';
    let publicId  = '';
    let mediaType = 'none';

    if (req.file) {
      // Cloudinary returns req.file.path as URL; local returns filename
      mediaUrl  = req.file.path || `/uploads/${req.file.filename}`;
      publicId  = req.file.filename || req.file.public_id || '';
      mediaType = req.file.mimetype?.startsWith('video') ? 'video' : 'photo';
    }

    const memory = await Memory.create({
      title, description, date, emoji: emoji || '🌹',
      mediaUrl, publicId, mediaType,
      createdBy: req.user._id,
    });

    res.status(201).json(memory);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PUT update memory (admin only) ────────────────────────────────────────────
router.put('/:id', protect, adminOnly, upload.single('media'), async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    const { title, description, date, emoji } = req.body;
    if (title)       memory.title       = title;
    if (description) memory.description = description;
    if (date)        memory.date        = date;
    if (emoji)       memory.emoji       = emoji;

    if (req.file) {
      // Delete old media
      if (memory.publicId) await deleteMedia(memory.publicId, memory.mediaType === 'video');
      memory.mediaUrl  = req.file.path || `/uploads/${req.file.filename}`;
      memory.publicId  = req.file.filename || req.file.public_id || '';
      memory.mediaType = req.file.mimetype?.startsWith('video') ? 'video' : 'photo';
    }

    await memory.save();
    res.json(memory);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── DELETE memory (admin only) ────────────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: 'Memory not found' });

    if (memory.publicId) await deleteMedia(memory.publicId, memory.mediaType === 'video');
    await memory.deleteOne();
    res.json({ message: 'Memory deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
