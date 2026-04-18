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

    const isOverdue = (dueDate: string) => {
        return dueDate && new Date(dueDate) < new Date() ;
    };

    const completedCount = todos.filter(t => t.completed).length;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Todos</h1>
                    <p className="page-subtitle">
                        {todos.length > 0
                            ? `${completedCount} of ${todos.length} tasks completed`
                            : 'Manage and organize your tasks'}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    + New Task
                </button>
            </div>

            <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
                <select className="filter-select" value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
                    <option value="">All Types</option>
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="urgent">Urgent</option>
                </select>
                <select className="filter-select" value={filter.completed} onChange={e => setFilter(f => ({ ...f, completed: e.target.value }))}>
                    <option value="">All Status</option>
                    <option value="false">Pending</option>
                    <option value="true">Completed</option>
                </select>
                <select className="filter-select" value={filter.sort} onChange={e => setFilter(f => ({ ...f, sort: e.target.value }))}>
                    <option value="">Default Sort</option>
                    <option value="date">By Due Date</option>
                    <option value="priority">By Priority</option>
                    <option value="created">By Created</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Loading tasks...</div>
            ) : todos.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3>No tasks found</h3>
                    <p>Create a new task or adjust your filters</p>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Task</button>
                </div>
            ) : (
                <div className="todo-list">
                    {todos.map(todo => (
                        <div key={todo.id} className={`todo-item priority-${todo.priority} ${todo.completed ? 'todo-done' : ''}`}>
                            <div className="todo-check" onClick={() => handleToggle(todo.id)}>
                                <div className={`checkbox ${todo.completed ? 'checked' : ''}`}>
                                    {todo.completed && '\u2713'}
                                </div>
                            </div>
                            <div className="todo-content">
                                <div className="todo-title">{todo.title}</div>
                                {todo.description && <div className="todo-desc">{todo.description}</div>}
                                <div className="todo-meta">
                                    <span className={`badge badge-${todo.type}`}>{todo.type}</span>
                                    <span className="todo-label">{todo.label}</span>
                                    {todo.dueDate && (
                                        <span className={`todo-due ${isOverdue(todo.dueDate) && !todo.completed ? 'overdue' : ''}`}>
                                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="todo-actions">
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(todo.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Create New Task</h3>
                        <p className="modal-desc">Add a new task to your list</p>
                        {error && <div className="error-msg">{error}</div>}

                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                            Task Type
                        </label>
                        <div className="type-selector">
                            {[
                                { value: 'personal', label: 'Personal' },
                                { value: 'work', label: 'Work' },
                                { value: 'urgent', label: 'Urgent' },
                            ].map(t => (
                                <div key={t.value}
                                    className={`type-option ${form.type === t.value ? 'selected' : ''}`}
                                    onClick={() => setForm(f => ({ ...f, type: t.value }))}>
                                    {t.label}
                                </div>
                            ))}
                        </div>

                        <div className="form-group">
                            <label>Title</label>
                            <input placeholder="What needs to be done?" value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input placeholder="Add details (optional)" value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" value={form.dueDate}
                                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
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
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Project</label>
                                    <input placeholder="Project name" value={form.project}
                                        onChange={e => setForm(f => ({ ...f, project: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>Assignee</label>
                                    <input placeholder="Assigned to" value={form.assignee}
                                        onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))} />
                                </div>
                            </div>
                        )}

                        {form.type === 'urgent' && (
                            <div className="form-group">
                                <label>Escalation Level (1-5)</label>
                                <input type="number" min="1" max="5" value={form.escalationLevel}
                                    onChange={e => setForm(f => ({ ...f, escalationLevel: Number(e.target.value) }))} />
                            </div>
                        )}

                        <div className="form-actions">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>Create Task</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
