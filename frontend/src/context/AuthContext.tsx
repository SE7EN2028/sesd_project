import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.get('/auth/me')
                .then(res => setUser(res.data.data))
                .catch(() => {
                    localStorage.removeItem('token');
                    setToken(null);
                    delete api.defaults.headers.common['Authorization'];
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        const { user: u, token: t } = res.data.data;
        localStorage.setItem('token', t);
        api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
        setToken(t);
        setUser(u);
    };

    const register = async (name: string, email: string, password: string) => {
        const res = await api.post('/auth/register', { name, email, password });
        const { user: u, token: t } = res.data.data;
        localStorage.setItem('token', t);
        api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
        setToken(t);
        setUser(u);
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
