FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install --legacy-peer-deps && npm install ajv@^8 --legacy-peer-deps && npm run build
COPY backend/ ./backend/
COPY frontend/build/ ./frontend/build/
WORKDIR /app/backend
RUN mkdir -p uploads
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]