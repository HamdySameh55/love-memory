import React, { useState, useEffect, useCallback } from 'react';
import { getMemories, getNotes, sendNote } from '../api';
import MemoryCard  from '../components/MemoryCard';
import MemoryModal from '../components/MemoryModal';
import Toast       from '../components/Toast';
import styles      from './ViewerPage.module.css';

export default function ViewerPage() {
  const [memories, setMemories]   = useState([]);
  const [notes, setNotes]         = useState([]);
  const [activeTab, setActiveTab] = useState('gallery');
  const [selected, setSelected]   = useState(null);
  const [noteText, setNoteText]   = useState('');
  const [sending, setSending]     = useState(false);
  const [toast, setToast]         = useState('');
  const [loading, setLoading]     = useState(true);

  const showToast = msg => setToast(msg);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [mems, nts] = await Promise.all([getMemories(), getNotes()]);
      setMemories(mems);
      setNotes(nts);
    } catch { showToast('Failed to load'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSend = async () => {
    if (!noteText.trim()) { showToast('Write something from your heart!'); return; }
    setSending(true);
    try {
      const note = await sendNote(noteText);
      setNotes(p => [note, ...p]);
      setNoteText('');
      showToast('Your love note was sent! 💌');
    } catch { showToast('Failed to send note'); }
    finally { setSending(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Our Memories ✨</h1>
        <p className={styles.heroSub}>Moments captured with all my heart, just for you</p>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab==='gallery'?styles.active:''}`} onClick={()=>setActiveTab('gallery')}>📸 Gallery</button>
        <button className={`${styles.tab} ${activeTab==='notes'?styles.active:''}`}   onClick={()=>setActiveTab('notes')}>💌 My Notes</button>
      </div>

      {/* ── Gallery ── */}
      {activeTab === 'gallery' && (
        <>
          {loading ? (
            <div className={styles.grid}>
              {[1,2,3,4].map(i=><div key={i} className={`${styles.skeletonCard} skeleton`}/>)}
            </div>
          ) : memories.length === 0 ? (
            <div className={styles.empty}><div className={styles.emptyIcon}>💕</div><p>No memories yet... check back soon!</p></div>
          ) : (
            <div className={styles.grid}>
              {memories.map((m,i)=>(
                <MemoryCard key={m._id} memory={m} index={i} isAdmin={false} onClick={()=>setSelected(m)} />
              ))}
            </div>
          )}

          {/* Love Note Form */}
          <div className={styles.noteForm}>
            <h2 className={styles.noteTitle}>💌 Write a Love Note</h2>
            <p className={styles.noteSub}>Share your feelings with them — they'll see it in their dashboard.</p>
            <textarea
              className={styles.noteTextarea}
              placeholder="My dearest... every memory here makes my heart overflow with gratitude and love."
              value={noteText}
              onChange={e=>setNoteText(e.target.value)}
              rows={4}
            />
            <button className={styles.sendBtn} onClick={handleSend} disabled={sending}>
              {sending ? 'Sending...' : 'Send with Love 💕'}
            </button>
          </div>
        </>
      )}

      {/* ── My Notes ── */}
      {activeTab === 'notes' && (
        <div className={styles.notesBox}>
          <h2 className={styles.sectionTitle}>💌 My Love Notes</h2>
          {notes.length === 0 ? (
            <div className={styles.empty}><div className={styles.emptyIcon}>💌</div><p>You haven't sent any notes yet. Your heart awaits... 💕</p></div>
          ) : notes.map(n => (
            <div key={n._id} className={styles.note}>
              <div className={styles.noteMeta}>Sent on {new Date(n.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div>
              <p className={styles.noteText}>{n.text}</p>
            </div>
          ))}
        </div>
      )}

      {selected && <MemoryModal memory={selected} onClose={()=>setSelected(null)} isAdmin={false} onSave={()=>{}} />}
      <Toast message={toast} onClose={()=>setToast('')} />
    </div>
  );
}
