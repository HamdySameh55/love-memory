const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
console.log("🔥 ENV FILE LOADED");
console.log("VIEWER_TOKEN =", process.env.VIEWER_TOKEN);
console.log("MONGO_URI =", process.env.MONGO_URI?.slice(0,30));

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/memories', require('./routes/memories'));
app.use('/api/notes',    require('./routes/notes'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK 💖', time: new Date() }));

// ── Connect DB & start ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅  MongoDB connected');
    await seedAdmin();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`💖  Server running on port ${PORT}`));
  })
  .catch(err => { console.error('❌  MongoDB error:', err); process.exit(1); });

// ── Seed admin user on first run ──────────────────────────────────────────────
async function seedAdmin() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const existing = await User.findOne({ role: 'admin' });
  if (!existing) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Love@2024', 12);
    await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@love.com',
      password: hash,
      role: 'admin',
      name: 'Admin',
    });
    console.log('✅  Admin user seeded →', process.env.ADMIN_EMAIL);
  }
}
