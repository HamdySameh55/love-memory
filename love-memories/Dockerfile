FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production
COPY backend/ ./backend/
COPY frontend/build/ ./frontend/build/
WORKDIR /app/backend
RUN mkdir -p uploads
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]