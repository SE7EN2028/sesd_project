import { useState, useEffect } from 'react';
import { categoryApi } from '../services/api';

export default function Categories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', color: '#6366f1' });
    const [error, setError] = useState('');

    const load = () => {
        setLoading(true);
        categoryApi.getAll()
            .then(res => setCategories(res.data.data))
            .catch(() => setCategories([]))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleSubmit = async () => {
        setError('');
        try {
            await categoryApi.create(form);
            setShowModal(false);
            setForm({ name: '', color: '#6366f1' });
            load();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create');
        }
    };

    const handleDelete = async (id: number) => {
        await categoryApi.delete(id);
        load();
    };

    const getInitial = (name: string) => name.charAt(0).toUpperCase();

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Categories</h1>
                    <p className="page-subtitle">Organize your tasks into groups</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    + New Category
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading categories...</div>
            ) : categories.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <h3>No categories yet</h3>
                    <p>Create categories to organize your tasks</p>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Category</button>
                </div>
            ) : (
                <div className="category-grid">
                    {categories.map(cat => (
                        <div key={cat.id} className="category-card">
                            <div className="category-color-dot" style={{ background: cat.color }}>
                                {getInitial(cat.name)}
                            </div>
                            <div className="category-info">
                                <h4>{cat.name}</h4>
                                <span>Created {new Date(cat.createdAt).toLocaleDateString()}</span>
                            </div>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat.id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Create Category</h3>
                        <p className="modal-desc">Group related tasks together</p>
                        {error && <div className="error-msg">{error}</div>}
                        <div className="form-group">
                            <label>Name</label>
                            <input placeholder="e.g. Shopping, Fitness, Study"
                                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Color</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <input type="color" value={form.color}
                                    onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                                    style={{ width: '48px', height: '48px', cursor: 'pointer', border: 'none', borderRadius: '10px', padding: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <input value={form.color}
                                        onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                                        style={{ fontFamily: 'monospace' }} />
                                </div>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
