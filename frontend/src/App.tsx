import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Todos from './pages/Todos';
import Categories from './pages/Categories';
import './index.css';

function NavBar() {
    const location = useLocation();
    const links = [
        { to: '/', label: 'Dashboard' },
        { to: '/todos', label: 'Todos' },
        { to: '/categories', label: 'Categories' },
    ];

    return (
        <nav className="navbar">
            <h1 className="logo">TodoApp</h1>
            <div className="nav-links">
                {links.map(l => (
                    <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>
                        {l.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

function App() {
    return (
        <Router>
            <div className="app">
                <NavBar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/todos" element={<Todos />} />
                        <Route path="/categories" element={<Categories />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
