FROM node:18-alpine
WORKDIR /app

COPY love-memories/backend/package*.json ./backend/
RUN cd backend && npm install --production

COPY love-memories/frontend/package*.json ./frontend/
RUN cd frontend && npm install --legacy-peer-deps && npm install ajv@^8 --legacy-peer-deps

COPY love-memories/backend/ ./backend/
COPY love-memories/frontend/ ./frontend/

RUN cd frontend && npm run build

WORKDIR /app/backend
RUN mkdir -p uploads
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]