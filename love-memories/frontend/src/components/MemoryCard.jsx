import React, { useState } from 'react';
import styles from './MemoryCard.module.css';

export default function MemoryCard({ memory, onClick, onEdit, onDelete, isAdmin, index = 0 }) {
  const { title, description, date, mediaUrl, mediaType, emoji } = memory;
  const [imgError, setImgError] = useState(false);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  // Fix URL: if it's a relative /uploads/... path, prepend backend origin in dev
  const resolvedUrl = mediaUrl
    ? (mediaUrl.startsWith('http') ? mediaUrl : mediaUrl)
    : '';

  const hasMedia = resolvedUrl && mediaType !== 'none' && !imgError;

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={onClick}
    >
      {/* Media */}
      <div className={styles.media}>
        {hasMedia && mediaType === 'photo' && (
          <img
            src={resolvedUrl}
            alt={title}
            className={styles.img}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
        {hasMedia && mediaType === 'video' && (
          <video src={resolvedUrl} className={styles.img} muted playsInline />
        )}
        {(!hasMedia) && (
          <div className={styles.placeholder}>{emoji || '📸'}</div>
        )}
        {/* Overlay gradient for text readability */}
        {hasMedia && <div className={styles.mediaOverlay} />}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <span className={styles.date}>{formattedDate}</span>
        <h3 className={styles.title}>{emoji} {title}</h3>
        <p className={styles.desc}>{description}</p>
      </div>

      {/* Admin controls */}
      {isAdmin && (
        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={e => { e.stopPropagation(); onEdit(); }}>
            ✏️ Edit
          </button>
          <button className={styles.deleteBtn} onClick={e => { e.stopPropagation(); onDelete(); }}>
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
}
