const router   = require('express').Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const { protect } = require('../middleware/auth');

const sign = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ── POST /api/auth/login  (Admin email+password) ──────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ token: sign(user._id), role: user.role, name: user.name });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// ── POST /api/auth/token  (Viewer token access) ───────────────────────────────
router.post('/token', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token required' });
    if (token !== process.env.VIEWER_TOKEN)
      return res.status(401).json({ message: 'Invalid access token' });

    // Auto-create viewer user if not exists
    let viewer = await User.findOne({ role: 'viewer' });
    if (!viewer) {
      const hash = await bcrypt.hash('viewer-' + Date.now(), 10);
      viewer = await User.create({ name: 'Partner', email: 'viewer@love.com', password: hash, role: 'viewer' });
    }

    res.json({ token: sign(viewer._id), role: 'viewer', name: viewer.name });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', protect, (req, res) => {
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role });
});

module.exports = router;
