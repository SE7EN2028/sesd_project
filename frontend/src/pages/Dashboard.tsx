import { useState, useEffect } from 'react';
import { todoApi } from '../services/api';

interface Stats {
    total: number;
    completed: number;
    pending: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
}

function ProgressRing({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = max === 0 ? 0 : Math.round((value / max) * 100);
    const r = 34;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;

    return (
        <div className="ring-container">
            <svg width="80" height="80">
                <circle cx="40" cy="40" r={r} fill="none" stroke="var(--ring-track)" strokeWidth="7" />
                <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7"
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
            </svg>
            <span className="ring-label">{pct}%</span>
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        todoApi.getStats()
            .then(res => setStats(res.data.data))
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading">Loading dashboard...</div>;

    if (!stats || stats.total === 0) {
        return (
            <div>
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-subtitle">Overview of your tasks and productivity</p>
                    </div>
                </div>
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="12" y1="18" x2="12" y2="12" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                    </div>
                    <h3>No tasks yet</h3>
                    <p>Create your first todo to see your stats here</p>
                </div>
            </div>
        );
    }

    const typeColors: Record<string, string> = { personal: '#7c3aed', work: '#2563eb', urgent: '#dc2626' };
    const priorityColors: Record<string, string> = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--success)' };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Overview of your tasks and productivity</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card accent-primary">
                    <div className="stat-icon" style={{ background: 'var(--primary-bg)', color: 'var(--primary)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>
                    </div>
                    <h3>Total Tasks</h3>
                    <div className="value">{stats.total}</div>
                </div>
                <div className="stat-card accent-success">
                    <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <h3>Completed</h3>
                    <div className="value" style={{ color: 'var(--success)' }}>{stats.completed}</div>
                </div>
                <div className="stat-card accent-warning">
                    <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <h3>Pending</h3>
                    <div className="value" style={{ color: 'var(--warning)' }}>{stats.pending}</div>
                </div>
                <div className="stat-card accent-danger">
                    <div className="stat-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    </div>
                    <h3>Urgent</h3>
                    <div className="value" style={{ color: 'var(--danger)' }}>{stats.byType['urgent'] || 0}</div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <div className="card-header">
                        <h3>Tasks by Type</h3>
                    </div>
                    <div className="breakdown-list">
                        {Object.entries(typeColors).map(([type, color]) => (
                            <div key={type} className="breakdown-item">
                                <span className="breakdown-label" style={{ textTransform: 'capitalize' }}>{type}</span>
                                <div className="breakdown-bar-container">
                                    <div className="breakdown-bar" style={{
                                        width: `${stats.total ? ((stats.byType[type] || 0) / stats.total) * 100 : 0}%`,
                                        background: color,
                                    }} />
                                </div>
                                <span className="breakdown-value">{stats.byType[type] || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3>Completion</h3>
                    </div>
                    <div className="progress-ring">
                        <ProgressRing value={stats.completed} max={stats.total} color="var(--primary)" />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{stats.completed} / {stats.total}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>tasks done</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <div className="card-header" style={{ marginBottom: '0.5rem' }}>
                            <h3>Priority</h3>
                        </div>
                        {Object.entries(priorityColors).map(([p, color]) => (
                            <div key={p} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{p}</span>
                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color }}>{stats.byPriority[p] || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
