import { useState, useEffect } from 'react';
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
        try {
            await categoryApi.create(form);
            setModal(false); setForm({ name: '', color: '#6366f1' }); load();
        } catch (e: any) { setError(e.response?.data?.message || 'Failed to create'); }
    };

    const remove = async (id: number) => { await categoryApi.delete(id); load(); };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Categories</h1>
                    <p className="page-subtitle">Organize tasks into groups</p>
                </div>
                <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Category</button>
            </div>

            {loading ? <div className="loading">Loading...</div> : cats.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-visual">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    </div>
                    <h3>No categories yet</h3>
                    <p>Create categories to keep your tasks organized and easy to find</p>
                    <button className="btn btn-primary" onClick={() => setModal(true)}>+ Create Category</button>
                </div>
            ) : (
                <div className="cat-grid">
                    {cats.map(c => (
                        <div key={c.id} className="cat-card">
                            <div className="cat-dot" style={{ background: c.color }}>{c.name.charAt(0).toUpperCase()}</div>
                            <div className="cat-info">
                                <h4>{c.name}</h4>
                                <span>Created {new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <button className="btn-danger-subtle btn-sm" onClick={() => remove(c.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">Create Category</div>
                        <div className="modal-desc">Group related tasks together</div>
                        {error && <div className="error-msg">{error}</div>}
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input className="form-input" placeholder="e.g. Shopping, Fitness, Study" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Color</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: '44px', height: '44px', cursor: 'pointer', border: 'none', borderRadius: '10px', padding: 0 }} />
                                <input className="form-input" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ fontFamily: 'monospace' }} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={submit}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
