import React, { useState, useEffect, useCallback } from 'react';
import { getMemories, createMemory, updateMemory, deleteMemory, getNotes, deleteNote, markRead } from '../api';
import MemoryCard  from '../components/MemoryCard';
import MemoryModal from '../components/MemoryModal';
import Toast       from '../components/Toast';
import styles      from './AdminPage.module.css';

const EMOJIS = ['🌹','💕','💖','💗','❤️','🌸','💝','🌷','💓','💞','🎂','☕','🗼','🏖️','🌅'];
const TABS   = ['memories', 'notes', 'timeline'];

const emptyForm = { title:'', description:'', date:'', emoji:'🌹' };

export default function AdminPage() {
  const [memories, setMemories]   = useState([]);
  const [notes, setNotes]         = useState([]);
  const [activeTab, setActiveTab] = useState('memories');
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [selected, setSelected]   = useState(null);
  const [toast, setToast]         = useState('');
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const showToast = msg => setToast(msg);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [mems, nts] = await Promise.all([getMemories(), getNotes()]);
      setMemories(mems);
      setNotes(nts);
    } catch { showToast('Failed to load data'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.title || !form.description || !form.date) { showToast('Please fill all required fields'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      if (mediaFile) fd.append('media', mediaFile);
      const mem = await createMemory(fd);
      setMemories(p => [mem, ...p]);
      setForm(emptyForm); setMediaFile(null); setMediaPreview(null); setShowForm(false);
      showToast('Memory saved with love! 💖');
    } catch (e) { showToast(e.response?.data?.message || 'Failed to save'); }
    finally { setSubmitting(false); }
  };

  const handleSaveEdit = async (id, fd) => {
    try {
      const updated = await updateMemory(id, fd);
      setMemories(p => p.map(m => m._id === id ? updated : m));
      setSelected(null);
      showToast('Memory updated! 💕');
    } catch { showToast('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this memory? 💔')) return;
    try {
      await deleteMemory(id);
      setMemories(p => p.filter(m => m._id !== id));
      showToast('Memory removed');
    } catch { showToast('Delete failed'); }
  };

  const handleDeleteNote = async (id) => {
    try { await deleteNote(id); setNotes(p => p.filter(n => n._id !== id)); }
    catch { showToast('Delete failed'); }
  };

  const handleMarkRead = async (id) => {
    try {
      const updated = await markRead(id);
      setNotes(p => p.map(n => n._id === id ? updated : n));
    } catch {}
  };

  const unread = notes.filter(n => !n.isRead).length;

  return (
    <div className={styles.page}>
      {/* Stats */}
      <div className={styles.statsRow}>
        <h1 className={styles.pageTitle}>My Dashboard</h1>
        <div className={styles.stats}>
          <div className={styles.stat}><span className={styles.statNum}>{memories.length}</span><span className={styles.statLabel}>Memories</span></div>
          <div className={styles.stat}><span className={styles.statNum}>{notes.length}</span><span className={styles.statLabel}>Notes</span></div>
          <div className={styles.stat}><span className={styles.statNum}>∞</span><span className={styles.statLabel}>Love</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button key={t} className={`${styles.tab} ${activeTab===t?styles.active:''}`} onClick={() => setActiveTab(t)}>
            {t==='memories'?'📸 Memories':t==='notes'?`💌 Notes${unread?` (${unread})`:''}`:'📅 Timeline'}
          </button>
        ))}
      </div>

      {/* ── Memories tab ── */}
      {activeTab === 'memories' && (
        <>
          {!showForm ? (
            <button className={styles.addBtn} onClick={() => setShowForm(true)}>+ Add Memory</button>
          ) : (
            <div className={styles.form}>
              <h2 className={styles.formTitle}>📸 New Memory</h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title *</label>
                <input className={styles.input} placeholder="Our first dance..." value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} />
              </div>
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date *</label>
                  <input className={styles.input} type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Emoji</label>
                  <select className={styles.input} value={form.emoji} onChange={e=>setForm(p=>({...p,emoji:e.target.value}))}>
                    {EMOJIS.map(e=><option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description *</label>
                <textarea className={styles.textarea} placeholder="Tell the story..." value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Photo / Video (optional)</label>
                <div className={styles.uploadZone} onClick={()=>document.getElementById('mediaInput').click()}>
                  {mediaPreview ? (
                    <img src={mediaPreview} alt="preview" className={styles.uploadPreview} />
                  ) : mediaFile ? (
                    <span>🎬 {mediaFile.name}</span>
                  ) : (
                    <><div className={styles.uploadIcon}>📸</div><div>Click to upload photo or video</div><div style={{fontSize:12,color:'var(--text-muted)'}}>JPG, PNG, MP4 • max 50 MB</div></>
                  )}
                </div>
                <input id="mediaInput" type="file" accept="image/*,video/*" style={{display:'none'}} onChange={e=>{
                  const f = e.target.files[0];
                  if (!f) return;
                  setMediaFile(f);
                  if (f.type.startsWith('image')) setMediaPreview(URL.createObjectURL(f));
                  else setMediaPreview(null);
                }} />
              </div>
              <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={()=>{setShowForm(false);setForm(emptyForm);setMediaFile(null);setMediaPreview(null);}}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleAdd} disabled={submitting}>{submitting?'Saving...':'💖 Save Memory'}</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className={styles.grid}>
              {[1,2,3].map(i=><div key={i} className={`${styles.skeletonCard} skeleton`}/>)}
            </div>
          ) : memories.length === 0 ? (
            <div className={styles.empty}><div className={styles.emptyIcon}>📸</div><p>No memories yet. Add your first one! 💕</p></div>
          ) : (
            <div className={styles.grid}>
              {memories.map((m,i)=>(
                <MemoryCard key={m._id} memory={m} index={i} isAdmin
                  onClick={()=>setSelected(m)}
                  onEdit={()=>setSelected(m)}
                  onDelete={()=>handleDelete(m._id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Notes tab ── */}
      {activeTab === 'notes' && (
        <div className={styles.notesBox}>
          <h2 className={styles.sectionTitle}>💌 Love Notes from Your Partner</h2>
          {notes.length === 0 ? (
            <div className={styles.empty}><div className={styles.emptyIcon}>💌</div><p>No notes yet... they'll come 💕</p></div>
          ) : notes.map(n => (
            <div key={n._id} className={`${styles.note} ${!n.isRead?styles.unread:''}`}>
              <div className={styles.noteMeta}>
                {new Date(n.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
                {!n.isRead && <span className={styles.newBadge}>NEW</span>}
              </div>
              <p className={styles.noteText}>{n.text}</p>
              <div className={styles.noteActions}>
                {!n.isRead && <button className={styles.readBtn} onClick={()=>handleMarkRead(n._id)}>Mark as Read</button>}
                <button className={styles.delNoteBtn} onClick={()=>handleDeleteNote(n._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Timeline tab ── */}
      {activeTab === 'timeline' && (
        <div className={styles.timeline}>
          {[...memories].sort((a,b)=>new Date(b.date)-new Date(a.date)).map((m,i)=>(
            <div key={m._id} className={styles.timelineItem} style={{animationDelay:`${i*0.08}s`}}>
              <div className={styles.dot}/>
              <div className={styles.timelineCard} onClick={()=>setSelected(m)}>
                <span className={styles.date}>{new Date(m.date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span>
                <h3 className={styles.tlTitle}>{m.emoji} {m.title}</h3>
                <p className={styles.tlDesc}>{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <MemoryModal memory={selected} onClose={()=>setSelected(null)} isAdmin onSave={handleSaveEdit} />}
      <Toast message={toast} onClose={()=>setToast('')} />
    </div>
  );
}
