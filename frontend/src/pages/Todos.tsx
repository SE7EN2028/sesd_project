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

const emptyForm: TodoForm = {
    title: '', description: '', type: 'personal', dueDate: '',
    tag: 'general', project: '', assignee: '', escalationLevel: 1,
};

export default function Todos() {
    const [todos, setTodos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<TodoForm>(emptyForm);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({ type: '', completed: '', sort: '' });

    const load = () => {
        setLoading(true);
        const params: Record<string, string> = {};
        if (filter.type) params.type = filter.type;
        if (filter.completed) params.completed = filter.completed;
        if (filter.sort) params.sort = filter.sort;
        todoApi.getAll(params)
            .then(res => setTodos(res.data.data))
            .catch(() => setTodos([]))
            .finally(() => setLoading(false));
    };

    useEffect(load, [filter]);

    const handleSubmit = async () => {
        setError('');
        try {
            const payload: any = {
                title: form.title,
                description: form.description,
                type: form.type,
                dueDate: form.dueDate || undefined,
            };
            if (form.type === 'personal') payload.tag = form.tag;
            if (form.type === 'work') {
                payload.project = form.project;
                payload.assignee = form.assignee;
            }
            if (form.type === 'urgent') payload.escalationLevel = form.escalationLevel;

            await todoApi.create(payload);
            setShowModal(false);
            setForm(emptyForm);
            load();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create');
        }
    };

    const handleToggle = async (id: number) => {
        await todoApi.toggle(id);
        load();
    };

    const handleDelete = async (id: number) => {
        await todoApi.delete(id);
        load();
    };

    const priorityColor = (p: string) => {
        if (p === 'high') return '#ef4444';
        if (p === 'medium') return '#f59e0b';
        return '#10b981';
    };

    return (
        <div>
            <div className="page-header">
                <h2>Todos</h2>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
                        style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <option value="">All Types</option>
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <select value={filter.completed} onChange={e => setFilter(f => ({ ...f, completed: e.target.value }))}
                        style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <option value="">All Status</option>
                        <option value="false">Pending</option>
                        <option value="true">Completed</option>
                    </select>
                    <select value={filter.sort} onChange={e => setFilter(f => ({ ...f, sort: e.target.value }))}
                        style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <option value="">Default Sort</option>
                        <option value="date">By Due Date</option>
                        <option value="priority">By Priority</option>
                        <option value="created">By Created</option>
                    </select>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Todo</button>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : todos.length === 0 ? (
                <div className="empty">No todos found.</div>
            ) : (
                <div className="todo-list">
                    {todos.map(todo => (
                        <div key={todo.id} className={`todo-item ${todo.completed ? 'todo-done' : ''}`}>
                            <div className="todo-check" onClick={() => handleToggle(todo.id)}>
                                <div className={`checkbox ${todo.completed ? 'checked' : ''}`}>
                                    {todo.completed && '✓'}
                                </div>
                            </div>
                            <div className="todo-content">
                                <div className="todo-title">{todo.title}</div>
                                {todo.description && <div className="todo-desc">{todo.description}</div>}
                                <div className="todo-meta">
                                    <span className={`badge badge-${todo.type}`}>{todo.type}</span>
                                    <span className="badge" style={{ background: priorityColor(todo.priority) + '20', color: priorityColor(todo.priority) }}>
                                        {todo.priority}
                                    </span>
                                    <span className="todo-label">{todo.label}</span>
                                    {todo.dueDate && (
                                        <span className="todo-due">Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(todo.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Add New Todo</h3>
                        {error && <div className="error-msg">{error}</div>}
                        <div className="form-group">
                            <label>Type</label>
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                <option value="personal">Personal</option>
                                <option value="work">Work</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Title</label>
                            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                        </div>

                        {form.type === 'personal' && (
                            <div className="form-group">
                                <label>Tag</label>
                                <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
                                    <option value="general">General</option>
                                    <option value="health">Health</option>
                                    <option value="finance">Finance</option>
                                    <option value="hobby">Hobby</option>
                                </select>
                            </div>
                        )}

                        {form.type === 'work' && (
                            <>
                                <div className="form-group">
                                    <label>Project</label>
                                    <input value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Assignee</label>
                                    <input value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))} />
                                </div>
                            </>
                        )}

                        {form.type === 'urgent' && (
                            <div className="form-group">
                                <label>Escalation Level (1-5)</label>
                                <input type="number" min="1" max="5" value={form.escalationLevel}
                                    onChange={e => setForm(f => ({ ...f, escalationLevel: Number(e.target.value) }))} />
                            </div>
                        )}

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
