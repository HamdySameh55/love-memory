import axios from 'axios';

// ── Base URL (Railway Backend) ─────────────────────────────
const BASE_URL = "https://love-memory-production.up.railway.app";

// ── Axios Instance ─────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
});

// ── Token Interceptor ──────────────────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('lm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Memories ───────────────────────────────────────────────
export const getMemories = () =>
  api.get('/api/memories').then(r => r.data);

export const getMemory = (id) =>
  api.get(`/api/memories/${id}`).then(r => r.data);

export const createMemory = (formData) =>
  api.post('/api/memories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const updateMemory = (id, formData) =>
  api.put(`/api/memories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const deleteMemory = (id) =>
  api.delete(`/api/memories/${id}`).then(r => r.data);

// ── Notes ──────────────────────────────────────────────────
export const getNotes = () =>
  api.get('/api/notes').then(r => r.data);

export const sendNote = (text) =>
  api.post('/api/notes', { text }).then(r => r.data);

export const markRead = (id) =>
  api.patch(`/api/notes/${id}/read`).then(r => r.data);

export const deleteNote = (id) =>
  api.delete(`/api/notes/${id}`).then(r => r.data);