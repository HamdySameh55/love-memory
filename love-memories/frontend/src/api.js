import axios from 'axios';

// ── Base URL (Railway Backend) ─────────────────────────────
const BASE_URL = "https://love-memory-production.up.railway.app";

// ── Memories ────────────────────────────────────────────────
export const getMemories = () =>
  axios.get(`${BASE_URL}/api/memories`).then(r => r.data);

export const getMemory = (id) =>
  axios.get(`${BASE_URL}/api/memories/${id}`).then(r => r.data);

export const createMemory = (formData) =>
  axios.post(`${BASE_URL}/api/memories`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const updateMemory = (id, formData) =>
  axios.put(`${BASE_URL}/api/memories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const deleteMemory = (id) =>
  axios.delete(`${BASE_URL}/api/memories/${id}`).then(r => r.data);

// ── Notes ────────────────────────────────────────────────
export const getNotes = () =>
  axios.get(`${BASE_URL}/api/notes`).then(r => r.data);

export const sendNote = (text) =>
  axios.post(`${BASE_URL}/api/notes`, { text }).then(r => r.data);

export const markRead = (id) =>
  axios.patch(`${BASE_URL}/api/notes/${id}/read`).then(r => r.data);

export const deleteNote = (id) =>
  axios.delete(`${BASE_URL}/api/notes/${id}`).then(r => r.data);