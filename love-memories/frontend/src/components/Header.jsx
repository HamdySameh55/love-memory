import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.heart}>❤</span>
        Love Memories
      </div>
      {user && (
        <div className={styles.nav}>
          <span className={`${styles.badge} ${user.role === 'viewer' ? styles.viewer : ''}`}>
            {user.role === 'admin' ? '👑 Admin' : '💖 Partner'}
          </span>
          <button className={styles.logoutBtn} onClick={logout}>Sign Out</button>
        </div>
      )}
    </header>
  );
}
