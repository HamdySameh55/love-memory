import React, { useEffect } from 'react';

const styles = {
  toast: {
    position: 'fixed', bottom: 28, right: 28,
    background: '#2d1a1d', color: '#fff',
    padding: '13px 20px', borderRadius: 14,
    fontSize: 14, zIndex: 999,
    display: 'flex', alignItems: 'center', gap: 10,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    animation: 'fadeIn 0.3s ease',
  },
};

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!message) return null;
  return <div style={styles.toast}>💖 {message}</div>;
}
