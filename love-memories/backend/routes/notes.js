const router = require('express').Router();
const Note   = require('../models/Note');
const { protect, adminOnly } = require('../middleware/auth');

// ── GET all notes (admin sees all; viewer sees own) ───────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { sentBy: req.user._id };
    const notes  = await Note.find(filter).sort({ createdAt: -1 }).populate('sentBy', 'name');
    res.json(notes);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── POST send a note (viewer only) ────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim())
      return res.status(400).json({ message: 'Note text is required' });

    const note = await Note.create({ text: text.trim(), sentBy: req.user._id });
    await note.populate('sentBy', 'name');
    res.status(201).json(note);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── PATCH mark note as read (admin only) ─────────────────────────────────────
router.patch('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ── DELETE note (admin only) ──────────────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
