import { useState, useEffect } from 'react';
import { todoApi } from '../services/api';

interface Stats {
    total: number;
    completed: number;
    pending: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
}

function Ring({ value, max }: { value: number; max: number }) {
    const pct = max === 0 ? 0 : Math.round((value / max) * 100);
    const r = 38;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <div className="ring-wrap">
            <svg width="90" height="90">
                <circle cx="45" cy="45" r={r} fill="none" stroke="var(--ring-track)" strokeWidth="8" />
                <circle cx="45" cy="45" r={r} fill="none" stroke="var(--primary)" strokeWidth="8"
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset .8s ease' }} />
            </svg>
            <span className="ring-pct">{pct}%</span>
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

    if (loading) return <div className="loading">Loading...</div>;

    if (!stats || stats.total === 0) {
        return (
            <div>
                <div className="page-header">
                    <div><h1 className="page-title">Dashboard</h1><p className="page-subtitle">Your task overview at a glance</p></div>
                </div>
                <div className="empty-state">
                    <div className="empty-visual">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                    </div>
                    <h3>Nothing here yet</h3>
                    <p>Start by creating your first task to see analytics and progress tracking</p>
                </div>
            </div>
        );
    }

    const types = [
        { key: 'personal', color: '#7c3aed' },
        { key: 'work', color: '#2563eb' },
        { key: 'urgent', color: '#dc2626' },
    ];

    return (
        <div>
            <div className="page-header">
                <div><h1 className="page-title">Dashboard</h1><p className="page-subtitle">Your task overview at a glance</p></div>
            </div>

            <div className="stats-row">
                <div className="glow-card g1">
                    <div className="gc-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg></div>
                    <span className="gc-label">Total Tasks</span>
                    <span className="gc-value">{stats.total}</span>
                </div>
                <div className="glow-card g3">
                    <div className="gc-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12" /></svg></div>
                    <span className="gc-label">Completed</span>
                    <span className="gc-value">{stats.completed}</span>
                </div>
                <div className="glow-card g2">
                    <div className="gc-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                    <span className="gc-label">In Progress</span>
                    <span className="gc-value">{stats.pending}</span>
                </div>
                <div className="glow-card g4">
                    <div className="gc-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg></div>
                    <span className="gc-label">Urgent</span>
                    <span className="gc-value">{stats.byType['urgent'] || 0}</span>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <div className="card-header"><h3 className="card-title">Distribution by Type</h3></div>
                    <div className="bd-list">
                        {types.map(t => (
                            <div key={t.key} className="bd-row">
                                <div className="bd-dot" style={{ background: t.color }} />
                                <span className="bd-label">{t.key}</span>
                                <div className="bd-bar-wrap">
                                    <div className="bd-bar" style={{ width: `${stats.total ? ((stats.byType[t.key] || 0) / stats.total) * 100 : 0}%`, background: t.color }} />
                                </div>
                                <span className="bd-val">{stats.byType[t.key] || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><h3 className="card-title">Completion Rate</h3></div>
                    <div className="progress-section">
                        <Ring value={stats.completed} max={stats.total} />
                        <div className="ring-info">
                            <div className="ri-big">{stats.completed} of {stats.total}</div>
                            <div className="ri-small">tasks completed</div>
                        </div>
                    </div>
                    <div className="prio-list">
                        {[
                            { key: 'high', color: 'var(--danger)' },
                            { key: 'medium', color: 'var(--warning)' },
                            { key: 'low', color: 'var(--success)' },
                        ].map(p => (
                            <div key={p.key} className="prio-row">
                                <span className="prio-label"><span className="prio-dot" style={{ background: p.color }} />{p.key}</span>
                                <span className="prio-val" style={{ color: p.color }}>{stats.byPriority[p.key] || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
