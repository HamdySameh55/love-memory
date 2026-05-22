const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

// ── Middleware ─────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/memories', require('./routes/memories'));
app.use('/api/notes', require('./routes/notes'));

// ── Health check ───────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK 💖', time: new Date() });
});

// ── Serve React (IMPORTANT) ───────────────
const frontendPath = path.join(__dirname, '../frontend/build');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ── MongoDB ───────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    await seedAdmin();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`💖 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  });

// ── Seed Admin ────────────────────────────
async function seedAdmin() {
  const User = require('./models/User');

  const existing = await User.findOne({ role: 'admin' });

  if (!existing) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Love@2024', 12);

    await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@love.com',
      password: hash,
      role: 'admin',
      name: 'Admin',
    });

    console.log('✅ Admin created');
  }
}