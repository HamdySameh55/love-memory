import React, { useState, useEffect } from 'react';
import styles from './MemoryModal.module.css';

const EMOJIS = ['🌹','💕','💖','💗','❤️','🌸','💝','🌷','💓','💞','🎂','☕','🗼','🏖️','🌅'];

export default function MemoryModal({ memory, onClose, isAdmin, onSave }) {
  const [editing, setEditing]  = useState(false);
  const [title, setTitle]      = useState(memory.title);
  const [desc, setDesc]        = useState(memory.description);
  const [date, setDate]        = useState(memory.date?.split('T')[0] || '');
  const [emoji, setEmoji]      = useState(memory.emoji || '🌹');
  const [file, setFile]        = useState(null);
  const [preview, setPreview]  = useState(null);
  const [saving, setSaving]    = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Close on ESC
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  // Prevent scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleFileChange = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (f.type.startsWith('image')) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', desc);
    fd.append('date', date);
    fd.append('emoji', emoji);
    if (file) fd.append('media', file);
    await onSave(memory._id, fd);
    setSaving(false);
    setEditing(false);
  };

  const formattedDate = new Date(memory.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const displayUrl = preview || (memory.mediaUrl || '');

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Close">×</button>

        {/* ── Media ── */}
        <div className={styles.mediaWrap}>
          {displayUrl && (memory.mediaType === 'photo' || preview) && (
            <>
              <img
                src={displayUrl}
                alt={memory.title}
                className={`${styles.img} ${imgLoaded ? styles.imgLoaded : ''}`}
                onLoad={() => setImgLoaded(true)}
                onError={e => { e.target.style.display='none'; }}
              />
              {!imgLoaded && <div className={`${styles.imgSkeleton} skeleton`} />}
            </>
          )}
          {displayUrl && memory.mediaType === 'video' && !preview && (
            <video src={displayUrl} controls className={styles.img} />
          )}
          {(!displayUrl || memory.mediaType === 'none') && !preview && (
            <div className={styles.placeholder}>{memory.emoji || '📸'}</div>
          )}
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>
          {editing ? (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title</label>
                <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date</label>
                  <input className={styles.input} type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Emoji</label>
                  <select className={styles.input} value={emoji} onChange={e => setEmoji(e.target.value)}>
                    {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} value={desc} onChange={e => setDesc(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Replace Photo / Video</label>
                <label className={styles.uploadZone}>
                  <input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{display:'none'}} />
                  {file ? <span>📎 {file.name}</span> : <span>📸 Click to choose new file</span>}
                </label>
              </div>
              <div className={styles.actions}>
                <button className={styles.cancelBtn} onClick={() => { setEditing(false); setFile(null); setPreview(null); }}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </>
          ) : (
            <>
              <span className={styles.dateBadge}>{formattedDate}</span>
              <h2 className={styles.title}>{memory.emoji} {memory.title}</h2>
              <p className={styles.desc}>{memory.description}</p>
              {isAdmin && (
                <button className={styles.editBtn} onClick={() => setEditing(true)}>✏️ Edit Memory</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
