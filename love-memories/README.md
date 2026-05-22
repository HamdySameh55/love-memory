# 💖 Love Memories — Full-Stack Web Application

A private romantic web application where an Admin uploads memories for their partner, and the Partner can browse them and send love notes.

---

## 🚀 Quick Start (Docker — Recommended)

**Requirements:** Docker + Docker Compose installed.

```bash
# 1. Clone / unzip the project
cd love-memories

# 2. Start everything
docker-compose up -d

# 3. Open in browser
http://localhost:3000
```

That's it! MongoDB, backend, and frontend all start automatically.

---

## 🛠 Manual Setup (Without Docker)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
cp .env.example .env      # Edit with your values
npm install
npm run dev               # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start                 # http://localhost:3000
```

---

## 🔐 Default Credentials

| Role    | Login         | Credential         |
|---------|---------------|--------------------|
| 👑 Admin  | Email + Password | admin@love.com / Love@2024 |
| 💖 Partner | Access Token | 1272004       |

> ⚠️ **Change these before deploying!** Edit `docker-compose.yml` or `.env`

---

## 📁 Project Structure

```
love-memories/
├── backend/
│   ├── models/
│   │   ├── User.js          # Admin + Viewer user schema
│   │   ├── Memory.js        # Memory (title, desc, date, media)
│   │   └── Note.js          # Love notes from partner
│   ├── routes/
│   │   ├── auth.js          # Login, token access, /me
│   │   ├── memories.js      # CRUD for memories
│   │   └── notes.js         # Send/read/delete notes
│   ├── middleware/
│   │   ├── auth.js          # JWT protect + adminOnly
│   │   └── upload.js        # Multer + Cloudinary/local
│   ├── server.js            # Entry point
│   ├── .env.example         # Environment variables template
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # JWT auth state
│   │   ├── components/
│   │   │   ├── Header.jsx        # Sticky header
│   │   │   ├── HeartsBg.jsx      # Animated floating hearts
│   │   │   ├── MemoryCard.jsx    # Gallery card
│   │   │   ├── MemoryModal.jsx   # Popup with edit support
│   │   │   └── Toast.jsx         # Notification
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx     # Admin + Viewer login
│   │   │   ├── AdminPage.jsx     # Dashboard (memories/notes/timeline)
│   │   │   └── ViewerPage.jsx    # Gallery + love note form
│   │   ├── api.js                # Axios API calls
│   │   ├── App.jsx               # Router + protected routes
│   │   └── index.css             # Global styles + animations
│   ├── nginx.conf
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## ☁️ Cloudinary Setup (for photo/video uploads)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Get your **Cloud Name**, **API Key**, and **API Secret**
3. Add them to `backend/.env` or `docker-compose.yml`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

If not configured, uploads are saved locally to `backend/uploads/`.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| POST   | /api/auth/login   | Admin email+password login |
| POST   | /api/auth/token   | Viewer token login       |
| GET    | /api/auth/me      | Get current user         |

### Memories (JWT required)
| Method | Endpoint             | Role   | Description       |
|--------|----------------------|--------|-------------------|
| GET    | /api/memories        | Both   | List all memories |
| GET    | /api/memories/:id    | Both   | Get one memory    |
| POST   | /api/memories        | Admin  | Create memory     |
| PUT    | /api/memories/:id    | Admin  | Update memory     |
| DELETE | /api/memories/:id    | Admin  | Delete memory     |

### Notes (JWT required)
| Method | Endpoint              | Role   | Description          |
|--------|-----------------------|--------|----------------------|
| GET    | /api/notes            | Both   | List notes           |
| POST   | /api/notes            | Viewer | Send love note       |
| PATCH  | /api/notes/:id/read   | Admin  | Mark note as read    |
| DELETE | /api/notes/:id        | Admin  | Delete note          |

---

## 🎨 Features

### Admin Dashboard
- ✅ Secure email + password login (JWT)
- ✅ Upload memories with title, description, date, emoji
- ✅ Photo/video upload (Cloudinary or local)
- ✅ Edit any memory (inline in modal)
- ✅ Delete memory (with media cleanup)
- ✅ View all love notes with read/unread badges
- ✅ Mark notes as read, delete notes
- ✅ Beautiful memory timeline view
- ✅ Stats dashboard (memory count, note count)

### Partner (Viewer)
- ✅ Token-based secure access
- ✅ Gorgeous gallery browsing (read-only)
- ✅ Click any memory to open in popup modal
- ✅ Send love notes to Admin
- ✅ View history of sent notes

### UI/UX
- ✅ Romantic rose/cream/gold color palette
- ✅ Playfair Display serif typography
- ✅ Floating animated hearts background
- ✅ Smooth card hover animations
- ✅ Skeleton loading states
- ✅ Toast notifications
- ✅ Fully responsive (mobile + desktop)

---

## 🔒 Security
- Passwords hashed with **bcrypt** (12 rounds)
- **JWT** tokens with configurable expiry
- Admin-only routes protected on the backend
- Viewer can only read memories and write notes
- File type + size validation on uploads

---

## 📦 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 18, React Router  |
| Styling    | CSS Modules, custom vars |
| HTTP       | Axios                   |
| Backend    | Node.js + Express       |
| Database   | MongoDB + Mongoose      |
| Auth       | JWT + bcrypt            |
| Uploads    | Multer + Cloudinary     |
| Deploy     | Docker + Nginx          |
