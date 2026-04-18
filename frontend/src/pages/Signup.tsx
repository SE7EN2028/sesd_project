import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const { register } = useAuth();
    const nav = useNavigate();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); setError('');
        if (password !== confirm) { setError('Passwords do not match'); return; }
        setBusy(true);
        try { await register(name, email, password); nav('/'); }
        catch (err: any) { setError(err.response?.data?.message || 'Registration failed'); }
        finally { setBusy(false); }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h1>Create account</h1>
                    <p>Get started with Taskflow</p>
                </div>
                {error && <div className="error-msg">{error}</div>}
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input className="form-input" type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input className="form-input" type="password" placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary auth-submit" disabled={busy}>{busy ? 'Creating account...' : 'Create Account'}</button>
                </form>
                <div className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></div>
            </div>
        </div>
    );
}
