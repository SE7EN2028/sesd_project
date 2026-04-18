import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const { login } = useAuth();
    const nav = useNavigate();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setBusy(true);
        try { await login(email, password); nav('/'); }
        catch (err: any) { setError(err.response?.data?.message || 'Login failed'); }
        finally { setBusy(false); }
    };

    return (
        <div className="auth-page">
            <motion.div className="auth-card" initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                <div className="auth-header">
                    <motion.div className="auth-logo" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </motion.div>
                    <h1>Welcome back</h1><p>Sign in to your Taskflow account</p>
                </div>
                {error && <motion.div className="error-msg" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>}
                <form onSubmit={submit}>
                    <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                    <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                    <motion.button type="submit" className="btn btn-primary auth-submit" disabled={busy} whileHover={busy ? {} : { scale: 1.01 }} whileTap={busy ? {} : { scale: 0.98 }}>{busy ? 'Signing in...' : 'Sign In'}</motion.button>
                </form>
                <div className="auth-footer">Don't have an account? <Link to="/signup">Create one</Link></div>
            </motion.div>
        </div>
    );
}
