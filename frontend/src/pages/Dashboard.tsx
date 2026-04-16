import { useState, useEffect } from 'react';
import { todoApi } from '../services/api';

interface Stats {
    total: number;
    completed: number;
    pending: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
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
    if (!stats) return <div className="empty">No data yet. Add some todos!</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Dashboard</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total</h3>
                    <div className="value">{stats.total}</div>
                </div>
                <div className="stat-card">
                    <h3>Completed</h3>
                    <div className="value" style={{ color: '#10b981' }}>{stats.completed}</div>
                </div>
                <div className="stat-card">
                    <h3>Pending</h3>
                    <div className="value" style={{ color: '#f59e0b' }}>{stats.pending}</div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Personal</h3>
                    <div className="value">{stats.byType['personal'] || 0}</div>
                </div>
                <div className="stat-card">
                    <h3>Work</h3>
                    <div className="value">{stats.byType['work'] || 0}</div>
                </div>
                <div className="stat-card">
                    <h3>Urgent</h3>
                    <div className="value" style={{ color: '#ef4444' }}>{stats.byType['urgent'] || 0}</div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>High Priority</h3>
                    <div className="value" style={{ color: '#ef4444' }}>{stats.byPriority['high'] || 0}</div>
                </div>
                <div className="stat-card">
                    <h3>Medium Priority</h3>
                    <div className="value" style={{ color: '#f59e0b' }}>{stats.byPriority['medium'] || 0}</div>
                </div>
                <div className="stat-card">
                    <h3>Low Priority</h3>
                    <div className="value" style={{ color: '#10b981' }}>{stats.byPriority['low'] || 0}</div>
                </div>
            </div>
        </div>
    );
}
