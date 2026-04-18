import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Todos from './pages/Todos';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading"><div className="spinner" /></div>;
    if (!user) return <Navigate to="/login" />;
    return <>{children}</>;
}

function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const links = [
        { to: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { to: '/todos', label: 'My Todos', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
        { to: '/categories', label: 'Categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    ];

    return (
        <aside className="sidebar">
            <motion.div className="sidebar-brand" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                <div className="brand-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <span className="brand-text">Taskflow</span>
            </motion.div>

            <div className="sidebar-section-label">Menu</div>

            <nav className="sidebar-nav">
                {links.map((l, i) => (
                    <motion.div key={l.to} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                        <Link to={l.to} className={`nav-item ${location.pathname === l.to ? 'active' : ''}`}>
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d={l.icon} />
                            </svg>
                            <span>{l.label}</span>
                            {location.pathname === l.to && (
                                <motion.div className="nav-indicator" layoutId="nav-indicator" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
                            )}
                        </Link>
                    </motion.div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-badge">
                    <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                    <div className="user-info">
                        <span className="user-name">{user?.name || 'User'}</span>
                        <span className="user-role">{user?.email || ''}</span>
                    </div>
                </div>
                <div className="sidebar-actions">
                    <motion.button className="btn-icon" onClick={toggleTheme} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
                        <AnimatePresence mode="wait">
                            {theme === 'light' ? (
                                <motion.svg key="moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                </motion.svg>
                            ) : (
                                <motion.svg key="sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </motion.button>
                    <motion.button className="btn-icon danger" onClick={logout} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Sign out">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </aside>
    );
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
            {children}
        </motion.div>
    );
}

function AppLayout() {
    const location = useLocation();
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
                        <Route path="/todos" element={<AnimatedPage><Todos /></AnimatedPage>} />
                        <Route path="/categories" element={<AnimatedPage><Categories /></AnimatedPage>} />
                    </Routes>
                </AnimatePresence>
            </main>
        </div>
    );
}

function AppRoutes() {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading"><div className="spinner" /></div>;

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
            <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
