import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categoryApi } from '../services/api';

export default function Categories() {
    const [cats, setCats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ name: '', color: '#6366f1' });
    const [error, setError] = useState('');

    const load = () => {
        setLoading(true);
        categoryApi.getAll().then(r => setCats(r.data.data)).catch(() => setCats([])).finally(() => setLoading(false));
    };

    useEffect(load, []);

    const submit = async () => {
        setError('');
        try { await categoryApi.create(form); setModal(false); setForm({ name: '', color: '#6366f1' }); load(); }
        catch (e: any) { setError(e.response?.data?.message || 'Failed to create'); }
    };

    const remove = async (id: number) => { await categoryApi.delete(id); load(); };

    return (
        <div>
            <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div><h1 className="page-title">Categories</h1><p className="page-subtitle">Organize tasks into groups</p></div>
                <motion.button className="btn btn-primary" onClick={() => setModal(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>+ New Category</motion.button>
            </motion.div>

            {loading ? <div className="loading"><div className="spinner" /></div> : cats.length === 0 ? (
                <motion.div className="empty-state" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="empty-visual"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg></div>
                    <h3>No categories yet</h3><p>Create categories to keep your tasks organized and easy to find</p>
                    <motion.button className="btn btn-primary" onClick={() => setModal(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>+ Create Category</motion.button>
                </motion.div>
            ) : (
                <div className="cat-grid">
                    <AnimatePresence>
                        {cats.map((c, i) => (
                            <motion.div key={c.id} className="cat-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }} layout>
                                <div className="cat-dot" style={{ background: c.color }}>{c.name.charAt(0).toUpperCase()}</div>
                                <div className="cat-info"><h4>{c.name}</h4><span>Created {new Date(c.createdAt).toLocaleDateString()}</span></div>
                                <motion.button className="btn-danger-subtle btn-sm" onClick={() => remove(c.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Delete</motion.button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <AnimatePresence>
                {modal && (
                    <motion.div className="modal-overlay" onClick={() => setModal(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                            <div className="modal-title">Create Category</div>
                            <div className="modal-desc">Group related tasks together</div>
                            {error && <div className="error-msg">{error}</div>}
                            <div className="form-group"><label className="form-label">Name</label><input className="form-input" placeholder="e.g. Shopping, Fitness, Study" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                            <div className="form-group">
                                <label className="form-label">Color</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                    <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: '44px', height: '44px', cursor: 'pointer', border: 'none', borderRadius: '10px', padding: 0 }} />
                                    <input className="form-input" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ fontFamily: 'monospace' }} />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                                <motion.button className="btn btn-primary" onClick={submit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Create</motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
