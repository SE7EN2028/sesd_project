import { useState, useEffect } from 'react';
import { categoryApi } from '../services/api';

export default function Categories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', color: '#7c3aed' });
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
            setForm({ name: '', color: '#7c3aed' });
            load();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create');
        }
    };

    const handleDelete = async (id: number) => {
        await categoryApi.delete(id);
        load();
    };

    return (
        <div>
            <div className="page-header">
                <h2>Categories</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Category</button>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : categories.length === 0 ? (
                <div className="empty">No categories yet.</div>
            ) : (
                <div className="stats-grid">
                    {categories.map(cat => (
                        <div key={cat.id} className="stat-card" style={{ borderLeft: `4px solid ${cat.color}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ color: cat.color, textTransform: 'none', letterSpacing: 'normal', fontSize: '1rem' }}>
                                        {cat.name}
                                    </h3>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                                        ID: {cat.id}
                                    </div>
                                </div>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Add Category</h3>
                        {error && <div className="error-msg">{error}</div>}
                        <div className="form-group">
                            <label>Name</label>
                            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Color</label>
                            <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                                style={{ height: '40px', cursor: 'pointer' }} />
                        </div>
                        <div className="form-actions">
                            <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
