import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { todoApi, subtaskApi } from '../services/api';

interface TodoForm {
    title: string; description: string; type: string; dueDate: string;
    tag: string; project: string; assignee: string; escalationLevel: number;
}

const blank: TodoForm = {
    title: '', description: '', type: 'personal', dueDate: '',
    tag: 'general', project: '', assignee: '', escalationLevel: 1,
};

export default function Todos() {
    const [todos, setTodos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState<any>(null);
    const [detailModal, setDetailModal] = useState<any>(null);
    const [subtasks, setSubtasks] = useState<any[]>([]);
    const [newSubtask, setNewSubtask] = useState('');
    const [form, setForm] = useState<TodoForm>(blank);
    const [editForm, setEditForm] = useState({ title: '', description: '', dueDate: '' });
    const [error, setError] = useState('');
    const [editError, setEditError] = useState('');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({ type: '', completed: '', sort: '' });

    const load = () => {
        setLoading(true);
        const p: Record<string, string> = {};
        if (search.trim()) p.search = search.trim();
        if (filter.type) p.type = filter.type;
        if (filter.completed) p.completed = filter.completed;
        if (filter.sort) p.sort = filter.sort;
        todoApi.getAll(p).then(r => setTodos(r.data.data)).catch(() => setTodos([])).finally(() => setLoading(false));
    };

    useEffect(load, [filter]);
    useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [search]);

    const submit = async () => {
        setError('');
        try {
            const d: any = { title: form.title, description: form.description, type: form.type, dueDate: form.dueDate || undefined };
            if (form.type === 'personal') d.tag = form.tag;
            if (form.type === 'work') { d.project = form.project; d.assignee = form.assignee; }
            if (form.type === 'urgent') d.escalationLevel = form.escalationLevel;
            await todoApi.create(d);
            setModal(false); setForm(blank); load();
        } catch (e: any) { setError(e.response?.data?.message || 'Failed to create'); }
    };

    const openEdit = (todo: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditForm({ title: todo.title, description: todo.description || '', dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '' });
        setEditModal(todo); setEditError('');
    };

    const submitEdit = async () => {
        setEditError('');
        try {
            await todoApi.update(editModal.id, { title: editForm.title, description: editForm.description, dueDate: editForm.dueDate || undefined });
            setEditModal(null); load();
        } catch (e: any) { setEditError(e.response?.data?.message || 'Failed to update'); }
    };

    const openDetail = async (todo: any) => {
        setDetailModal(todo);
        setNewSubtask('');
        const res = await subtaskApi.getByTodo(todo.id);
        setSubtasks(res.data.data);
    };

    const addSubtask = async () => {
        if (!newSubtask.trim() || !detailModal) return;
        await subtaskApi.create(detailModal.id, newSubtask.trim());
        setNewSubtask('');
        const res = await subtaskApi.getByTodo(detailModal.id);
        setSubtasks(res.data.data);
    };

    const toggleSubtask = async (id: number) => {
        await subtaskApi.toggle(id);
        const res = await subtaskApi.getByTodo(detailModal.id);
        setSubtasks(res.data.data);
    };

    const deleteSubtask = async (id: number) => {
        await subtaskApi.delete(id);
        const res = await subtaskApi.getByTodo(detailModal.id);
        setSubtasks(res.data.data);
    };

    const handleExport = async (format: string) => {
        const res = await todoApi.exportTodos(format);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `todos.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const toggle = async (id: number) => { await todoApi.toggle(id); load(); };
    const remove = async (id: number) => { await todoApi.delete(id); load(); };
    const overdue = (d: string) => d && new Date(d) < new Date();
    const done = todos.filter(t => t.completed).length;
    const subDone = subtasks.filter(s => s.completed).length;

    return (
        <div>
            <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1 className="page-title">My Todos</h1>
                    <p className="page-subtitle">{todos.length > 0 ? `${done} of ${todos.length} completed` : 'Manage your tasks'}</p>
                </div>
                <div style={{ display: 'flex', gap: '.4rem' }}>
                    <div className="export-dropdown">
                        <motion.button className="btn btn-ghost" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleExport('json')}>Export JSON</motion.button>
                    </div>
                    <motion.button className="btn btn-ghost" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleExport('csv')}>Export CSV</motion.button>
                    <motion.button className="btn btn-primary" onClick={() => setModal(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>+ New Task</motion.button>
                </div>
            </motion.div>

            <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <input className="form-input" style={{ maxWidth: '260px', borderRadius: '20px', padding: '.42rem .9rem', fontSize: '.82rem' }}
                    placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
                <div className="filter-bar">
                    <select className="filter-pill" value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}><option value="">All Types</option><option value="personal">Personal</option><option value="work">Work</option><option value="urgent">Urgent</option></select>
                    <select className="filter-pill" value={filter.completed} onChange={e => setFilter(f => ({ ...f, completed: e.target.value }))}><option value="">All Status</option><option value="false">Pending</option><option value="true">Done</option></select>
                    <select className="filter-pill" value={filter.sort} onChange={e => setFilter(f => ({ ...f, sort: e.target.value }))}><option value="">Sort</option><option value="date">Due Date</option><option value="priority">Priority</option><option value="created">Newest</option></select>
                </div>
            </div>

            {loading ? <div className="loading"><div className="spinner" /></div> : todos.length === 0 ? (
                <motion.div className="empty-state" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="empty-visual"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
                    <h3>{search ? 'No matching tasks' : 'No tasks found'}</h3>
                    <p>{search ? 'Try a different search term' : 'Create a task or change your filters'}</p>
                    {!search && <motion.button className="btn btn-primary" onClick={() => setModal(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>+ Create Task</motion.button>}
                </motion.div>
            ) : (
                <div className="todo-list">
                    <AnimatePresence>
                        {todos.map((t, i) => (
                            <motion.div key={t.id} className={`todo-item ${t.completed ? 'todo-done' : ''}`}
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
                                transition={{ duration: 0.25, delay: i * 0.03 }} layout>
                                <div className={`prio-stripe ${t.priority}`} />
                                <div className="todo-check" onClick={() => toggle(t.id)}>
                                    <motion.div className={`checkbox ${t.completed ? 'checked' : ''}`} whileTap={{ scale: 0.8 }}>
                                        <AnimatePresence>
                                            {t.completed && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>{'\u2713'}</motion.span>}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>
                                <div className="todo-body" onClick={() => openDetail(t)} style={{ cursor: 'pointer' }}>
                                    <div className="todo-title">{t.title}</div>
                                    {t.description && <div className="todo-desc">{t.description}</div>}
                                    <div className="todo-tags">
                                        <span className={`badge badge-${t.type}`}>{t.type}</span>
                                        <span className="todo-label">{t.label}</span>
                                        {t.dueDate && <span className={`todo-due ${overdue(t.dueDate) && !t.completed ? 'overdue' : ''}`}>Due {new Date(t.dueDate).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                                <div className="todo-end" style={{ display: 'flex', gap: '.25rem' }}>
                                    <motion.button className="btn-danger-subtle btn-sm" style={{ color: 'var(--primary)' }} onClick={(e) => openEdit(t, e)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Edit</motion.button>
                                    <motion.button className="btn-danger-subtle btn-sm" onClick={() => remove(t.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Delete</motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <AnimatePresence>
                {modal && (
                    <motion.div className="modal-overlay" onClick={() => setModal(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                            <div className="modal-title">Create New Task</div>
                            <div className="modal-desc">Add a task to your list</div>
                            {error && <div className="error-msg">{error}</div>}
                            <div className="form-label">Type</div>
                            <div className="type-cards">
                                {['personal', 'work', 'urgent'].map(v => (
                                    <motion.div key={v} className={`type-card ${form.type === v ? 'picked' : ''}`} onClick={() => setForm(f => ({ ...f, type: v }))} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{v.charAt(0).toUpperCase() + v.slice(1)}</motion.div>
                                ))}
                            </div>
                            <div className="form-group"><label className="form-label">Title</label><input className="form-input" placeholder="What needs to be done?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
                            <div className="form-group"><label className="form-label">Description</label><input className="form-input" placeholder="Add details (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                            <div className="form-group"><label className="form-label">Due Date</label><input className="form-input" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
                            {form.type === 'personal' && <motion.div className="form-group" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}><label className="form-label">Tag</label><select className="form-input" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}><option value="general">General</option><option value="health">Health</option><option value="finance">Finance</option><option value="hobby">Hobby</option></select></motion.div>}
                            {form.type === 'work' && <motion.div className="form-row" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}><div className="form-group"><label className="form-label">Project</label><input className="form-input" placeholder="Project name" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} /></div><div className="form-group"><label className="form-label">Assignee</label><input className="form-input" placeholder="Assigned to" value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))} /></div></motion.div>}
                            {form.type === 'urgent' && <motion.div className="form-group" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}><label className="form-label">Escalation Level (1-5)</label><input className="form-input" type="number" min="1" max="5" value={form.escalationLevel} onChange={e => setForm(f => ({ ...f, escalationLevel: Number(e.target.value) }))} /></motion.div>}
                            <div className="form-actions"><button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button><motion.button className="btn btn-primary" onClick={submit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Create Task</motion.button></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editModal && (
                    <motion.div className="modal-overlay" onClick={() => setEditModal(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                            <div className="modal-title">Edit Task</div>
                            <div className="modal-desc">Update task details</div>
                            {editError && <div className="error-msg">{editError}</div>}
                            <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} /></div>
                            <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} /></div>
                            <div className="form-group"><label className="form-label">Due Date</label><input className="form-input" type="date" value={editForm.dueDate} onChange={e => setEditForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
                            <div className="form-actions"><button className="btn btn-ghost" onClick={() => setEditModal(null)}>Cancel</button><motion.button className="btn btn-primary" onClick={submitEdit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>Save Changes</motion.button></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {detailModal && (
                    <motion.div className="modal-overlay" onClick={() => setDetailModal(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div className="modal-title">{detailModal.title}</div>
                                    <div className="modal-desc" style={{ marginBottom: '.5rem' }}>{detailModal.description || 'No description'}</div>
                                    <div style={{ display: 'flex', gap: '.35rem', marginBottom: '1.25rem' }}>
                                        <span className={`badge badge-${detailModal.type}`}>{detailModal.type}</span>
                                        <span className="badge" style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}>{detailModal.priority} priority</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
                                <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text)' }}>Subtasks</span>
                                {subtasks.length > 0 && <span style={{ fontSize: '.72rem', color: 'var(--text-3)' }}>{subDone}/{subtasks.length} done</span>}
                            </div>

                            {subtasks.length > 0 && (
                                <div style={{ height: '4px', background: 'var(--border-light)', borderRadius: '2px', marginBottom: '.75rem', overflow: 'hidden' }}>
                                    <motion.div style={{ height: '100%', background: 'var(--accent)', borderRadius: '2px' }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${subtasks.length ? (subDone / subtasks.length) * 100 : 0}%` }}
                                        transition={{ duration: 0.4 }} />
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '.75rem' }}>
                                <AnimatePresence>
                                    {subtasks.map(s => (
                                        <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.35rem .25rem', borderRadius: '6px' }}>
                                            <div onClick={() => toggleSubtask(s.id)} style={{ cursor: 'pointer' }}>
                                                <div className={`checkbox ${s.completed ? 'checked' : ''}`} style={{ width: '16px', height: '16px', fontSize: '10px' }}>
                                                    {s.completed && '\u2713'}
                                                </div>
                                            </div>
                                            <span style={{ flex: 1, fontSize: '.82rem', color: s.completed ? 'var(--text-3)' : 'var(--text)', textDecoration: s.completed ? 'line-through' : 'none' }}>{s.title}</span>
                                            <button className="btn-danger-subtle" style={{ fontSize: '.68rem', padding: '.2rem .4rem' }} onClick={() => deleteSubtask(s.id)}>x</button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div style={{ display: 'flex', gap: '.35rem' }}>
                                <input className="form-input" style={{ fontSize: '.82rem' }} placeholder="Add a subtask..." value={newSubtask}
                                    onChange={e => setNewSubtask(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addSubtask()} />
                                <motion.button className="btn btn-primary btn-sm" onClick={addSubtask} whileTap={{ scale: 0.95 }}>Add</motion.button>
                            </div>

                            <div className="form-actions">
                                <button className="btn btn-ghost" onClick={() => setDetailModal(null)}>Close</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
