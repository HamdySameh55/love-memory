import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header     from './components/Header';
import HeartsBg   from './components/HeartsBg';
import LoginPage  from './pages/LoginPage';
import AdminPage  from './pages/AdminPage';
import ViewerPage from './pages/ViewerPage';
import './index.css';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ textAlign:'center', padding:80, color:'var(--text-muted)', fontSize:18 }}>Loading... 💕</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to={user.role === 'admin' ? '/admin' : '/view'} replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <HeartsBg />
      <Header />
      <Routes>
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/view'} replace /> : <LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminPage /></ProtectedRoute>} />
        <Route path="/view"  element={<ProtectedRoute allowedRole="viewer"><ViewerPage /></ProtectedRoute>} />
        <Route path="*"      element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/view') : '/login'} replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
