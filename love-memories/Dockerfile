FROM node:18-alpine
WORKDIR /app

# Backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install --legacy-peer-deps && npm install ajv@^8 --legacy-peer-deps

# Copy source
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Build frontend
RUN cd frontend && npm run build

WORKDIR /app/backend
RUN mkdir -p uploads
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]