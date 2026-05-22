import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('lm_token') || '');
  const [loading, setLoading] = useState(true);

  // Attach token to every axios request
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('lm_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('lm_token');
    }
  }, [token]);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await axios.get('/api/auth/me');
        setUser(data);
      } catch {
        setToken('');
        setUser(null);
      } finally { setLoading(false); }
    };
    restore();
  }, []); // eslint-disable-line

  const loginAdmin = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setToken(data.token);
    setUser({ role: data.role, name: data.name });
    return data;
  };

  const loginViewer = async (accessToken) => {
    const { data } = await axios.post('/api/auth/token', { token: accessToken });
    setToken(data.token);
    setUser({ role: data.role, name: data.name });
    return data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginAdmin, loginViewer, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
