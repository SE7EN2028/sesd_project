import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { todoApi } from '../services/api';

interface Stats {
    total: number; completed: number; pending: number;
    byType: Record<string, number>; byPriority: Record<string, number>;
}

function AnimatedNumber({ value }: { value: number }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<number>();
    useEffect(() => {
        const start = display;
        const diff = value - start;
        if (diff === 0) return;
        const duration = 600;
        const startTime = performance.now();
        const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(start + diff * eased));
            if (progress < 1) ref.current = requestAnimationFrame(tick);
        };
        ref.current = requestAnimationFrame(tick);
        return () => { if (ref.current) cancelAnimationFrame(ref.current); };
    }, [value]);
    return <>{display}</>;
}

function Ring({ value, max }: { value: number; max: number }) {
    const pct = max === 0 ? 0 : Math.round((value / max) * 100);
    const r = 38; const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <div className="ring-wrap">
            <svg width="90" height="90">
                <circle cx="45" cy="45" r={r} fill="none" stroke="var(--ring-track)" strokeWidth="8" />
                <motion.circle cx="45" cy="45" r={r} fill="none" stroke="var(--primary)" strokeWidth="8"
                    strokeLinecap="round" initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    style={{ strokeDasharray: circ }} />
            </svg>
            <span className="ring-pct"><AnimatedNumber value={pct} />%</span>
        </div>
    );
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } };

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        todoApi.getStats().then(r => setStats(r.data.data)).catch(() => setStats(null)).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading"><div className="spinner" /></div>;

    if (!stats || stats.total === 0) {
        return (
            <div>
                <div className="page-header"><div><h1 className="page-title">Dashboard</h1><p className="page-subtitle">Your task overview at a glance</p></div></div>
                <motion.div className="empty-state" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                    <div className="empty-visual"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg></div>
                    <h3>Nothing here yet</h3><p>Start by creating your first task to see analytics and progress tracking</p>
                </motion.div>
            </div>
        );
    }

    const cards = [
        { label: 'Total Tasks', value: stats.total, cls: 'g1', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' },
        { label: 'Completed', value: stats.completed, cls: 'g3', icon: 'M20 6L9 17l-5-5' },
        { label: 'In Progress', value: stats.pending, cls: 'g2', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2' },
        { label: 'Urgent', value: stats.byType['urgent'] || 0, cls: 'g4', icon: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' },
    ];

    const types = [{ key: 'personal', color: '#7c3aed' }, { key: 'work', color: '#2563eb' }, { key: 'urgent', color: '#dc2626' }];

    return (
        <div>
            <motion.div className="page-header" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div><h1 className="page-title">Dashboard</h1><p className="page-subtitle">Your task overview at a glance</p></div>
            </motion.div>

            <motion.div className="stats-row" variants={stagger} initial="hidden" animate="show">
                {cards.map(c => (
                    <motion.div key={c.label} className={`glow-card ${c.cls}`} variants={fadeUp} whileHover={{ y: -5, transition: { duration: 0.15 } }}>
                        <div className="gc-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={c.icon} /></svg></div>
                        <span className="gc-label">{c.label}</span>
                        <span className="gc-value"><AnimatedNumber value={c.value} /></span>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div className="dashboard-grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="card">
                    <div className="card-header"><h3 className="card-title">Distribution by Type</h3></div>
                    <div className="bd-list">
                        {types.map((t, i) => (
                            <div key={t.key} className="bd-row">
                                <div className="bd-dot" style={{ background: t.color }} />
                                <span className="bd-label">{t.key}</span>
                                <div className="bd-bar-wrap">
                                    <motion.div className="bd-bar" style={{ background: t.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stats.total ? ((stats.byType[t.key] || 0) / stats.total) * 100 : 0}%` }}
                                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: 'easeOut' }} />
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
                            <div className="ri-big"><AnimatedNumber value={stats.completed} /> of {stats.total}</div>
                            <div className="ri-small">tasks completed</div>
                        </div>
                    </div>
                    <div className="prio-list">
                        {[{ key: 'high', color: 'var(--danger)' }, { key: 'medium', color: 'var(--warning)' }, { key: 'low', color: 'var(--success)' }].map(p => (
                            <div key={p.key} className="prio-row">
                                <span className="prio-label"><span className="prio-dot" style={{ background: p.color }} />{p.key}</span>
                                <span className="prio-val" style={{ color: p.color }}>{stats.byPriority[p.key] || 0}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
