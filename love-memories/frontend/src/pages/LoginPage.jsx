import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HeartsBg from '../components/HeartsBg';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { loginAdmin, loginViewer } = useAuth();
  const [tab, setTab]       = useState('admin');
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');
  const [token, setToken]   = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(''); setLoading(true);
    try {
      if (tab === 'admin') {
        await loginAdmin(email, pass);
      } else {
        await loginViewer(token);
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <div className={styles.wrap}>
      <HeartsBg />
      <div className={styles.card}>
        <div className={styles.iconRow}>💝</div>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.sub}>Where every moment lives forever</p>

        {/* Role tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'admin'  ? styles.active : ''}`} onClick={() => { setTab('admin'); setError(''); }}>
            👑 Admin
          </button>
          <button className={`${styles.tab} ${tab === 'viewer' ? styles.active : ''}`} onClick={() => { setTab('viewer'); setError(''); }}>
            💖 Partner
          </button>
        </div>

        {tab === 'admin' ? (
          <>
            <div className={styles.group}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" placeholder="admin@love.com"
                value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Password</label>
              <input className={styles.input} type="password" placeholder="••••••••"
                value={pass} onChange={e => setPass(e.target.value)} onKeyDown={handleKey} />
            </div>
          </>
        ) : (
          <div className={styles.group}>
            <label className={styles.label}>Access Token</label>
            <input className={styles.input} placeholder="Enter your secret token..."
              value={token} onChange={e => setToken(e.target.value)} onKeyDown={handleKey} />
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <button className={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Entering...' : 'Enter with Love 💕'}
        </button>

        <div className={styles.hint}>
          <strong>Demo — </strong>
          {tab === 'admin'
            ? 'ملكش دعوه يا عسل بالادمن '
            : 'اكتبي باسورد ي بطبوطه'}
        </div>
      </div>
    </div>
  );
}
