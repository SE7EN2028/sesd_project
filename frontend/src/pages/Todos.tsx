import { useState, useEffect } from 'react';
import { todoApi } from '../services/api';

interface TodoForm {
    title: string;
    description: string;
    type: string;
    dueDate: string;
    tag: string;
    project: string;
    assignee: string;
    escalationLevel: number;
}

const blank: TodoForm = {
    title: '', description: '', type: 'personal', dueDate: '',
    tag: 'general', project: '', assignee: '', escalationLevel: 1,
};

export default function Todos() {
    const [todos, setTodos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState<TodoForm>(blank);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({ type: '', completed: '', sort: '' });

    const load = () => {
        setLoading(true);
        const p: Record<string, string> = {};
        if (filter.type) p.type = filter.type;
        if (filter.completed) p.completed = filter.completed;
        if (filter.sort) p.sort = filter.sort;
        todoApi.getAll(p).then(r => setTodos(r.data.data)).catch(() => setTodos([])).finally(() => setLoading(false));
    };

    useEffect(load, [filter]);

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

    const toggle = async (id: number) => { await todoApi.toggle(id); load(); };
    const remove = async (id: number) => { await todoApi.delete(id); load(); };
    const overdue = (d: string) => d && new Date(d) < new Date();
    const done = todos.filter(t => t.completed).length;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Todos</h1>
                    <p className="page-subtitle">{todos.length > 0 ? `${done} of ${todos.length} completed` : 'Manage your tasks'}</p>
                </div>
                <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Task</button>
            </div>

            <div className="filter-bar" style={{ marginBottom: '1.25rem' }}>
                <select className="filter-pill" value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
                    <option value="">All Types</option>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="urgent">Urgent</option>
                </select>
                <select className="filter-pill" value={filter.completed} onChange={e => setFilter(f => ({ ...f, completed: e.target.value }))}>
                    <option value="">All Status</option>
                    <option value="false">Pending</option>
                    <option value="true">Done</option>
                </select>
                <select className="filter-pill" value={filter.sort} onChange={e => setFilter(f => ({ ...f, sort: e.target.value }))}>
                    <option value="">Sort</option>
                    <option value="date">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="created">Newest</option>
                </select>
            </div>

            {loading ? <div className="loading">Loading...</div> : todos.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-visual">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </div>
                    <h3>No tasks found</h3>
                    <p>Create a task or change your filters to see results</p>
                    <button className="btn btn-primary" onClick={() => setModal(true)}>+ Create Task</button>
                </div>
            ) : (
                <div className="todo-list">
                    {todos.map(t => (
                        <div key={t.id} className={`todo-item ${t.completed ? 'todo-done' : ''}`}>
                            <div className={`prio-stripe ${t.priority}`} />
                            <div className="todo-check" onClick={() => toggle(t.id)}>
                                <div className={`checkbox ${t.completed ? 'checked' : ''}`}>{t.completed && '\u2713'}</div>
                            </div>
                            <div className="todo-body">
                                <div className="todo-title">{t.title}</div>
                                {t.description && <div className="todo-desc">{t.description}</div>}
                                <div className="todo-tags">
                                    <span className={`badge badge-${t.type}`}>{t.type}</span>
                                    <span className="todo-label">{t.label}</span>
                                    {t.dueDate && <span className={`todo-due ${overdue(t.dueDate) && !t.completed ? 'overdue' : ''}`}>Due {new Date(t.dueDate).toLocaleDateString()}</span>}
                                </div>
                            </div>
                            <div className="todo-end">
                                <button className="btn-danger-subtle btn-sm" onClick={() => remove(t.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">Create New Task</div>
                        <div className="modal-desc">Add a task to your list</div>
                        {error && <div className="error-msg">{error}</div>}

                        <div className="form-label">Type</div>
                        <div className="type-cards">
                            {['personal', 'work', 'urgent'].map(v => (
                                <div key={v} className={`type-card ${form.type === v ? 'picked' : ''}`} onClick={() => setForm(f => ({ ...f, type: v }))}>{v.charAt(0).toUpperCase() + v.slice(1)}</div>
                            ))}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input className="form-input" placeholder="What needs to be done?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input className="form-input" placeholder="Add details (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Due Date</label>
                            <input className="form-input" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                        </div>

                        {form.type === 'personal' && (
                            <div className="form-group">
                                <label className="form-label">Tag</label>
                                <select className="form-input" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
                                    <option value="general">General</option><option value="health">Health</option>
                                    <option value="finance">Finance</option><option value="hobby">Hobby</option>
                                </select>
                            </div>
                        )}

                        {form.type === 'work' && (
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Project</label>
                                    <input className="form-input" placeholder="Project name" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Assignee</label>
                                    <input className="form-input" placeholder="Assigned to" value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))} />
                                </div>
                            </div>
                        )}

                        {form.type === 'urgent' && (
                            <div className="form-group">
                                <label className="form-label">Escalation Level (1-5)</label>
                                <input className="form-input" type="number" min="1" max="5" value={form.escalationLevel} onChange={e => setForm(f => ({ ...f, escalationLevel: Number(e.target.value) }))} />
                            </div>
                        )}

                        <div className="form-actions">
                            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={submit}>Create Task</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
