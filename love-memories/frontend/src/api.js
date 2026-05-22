import axios from 'axios';

// ── Memories ──────────────────────────────────────────────────────────────────
export const getMemories = () => axios.get('/api/memories').then(r => r.data);

export const getMemory = (id) => axios.get(`/api/memories/${id}`).then(r => r.data);

export const createMemory = (formData) =>
  axios.post('/api/memories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const updateMemory = (id, formData) =>
  axios.put(`/api/memories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const deleteMemory = (id) =>
  axios.delete(`/api/memories/${id}`).then(r => r.data);

// ── Notes ─────────────────────────────────────────────────────────────────────
export const getNotes   = ()     => axios.get('/api/notes').then(r => r.data);
export const sendNote   = (text) => axios.post('/api/notes', { text }).then(r => r.data);
export const markRead   = (id)   => axios.patch(`/api/notes/${id}/read`).then(r => r.data);
export const deleteNote = (id)   => axios.delete(`/api/notes/${id}`).then(r => r.data);
