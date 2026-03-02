'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }
            const { data } = await api.get('/me');
            setUser(data);
        } catch {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } finally {
            setLoading(false);
        }
    }

    async function login(email, password) {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
        // Check consent
        if (!data.user.consentAcceptedAt) {
            router.push('/consent');
        } else {
            router.push('/app/discover');
        }
        return data;
    }

    async function register(formData) {
        const { data } = await api.post('/auth/register', formData);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
        router.push('/consent');
        return data;
    }

    async function logout() {
        try {
            await api.post('/auth/logout');
        } catch {
            // Ignore
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        router.push('/auth/login');
    }

    async function acceptConsent() {
        await api.post('/auth/consent/accept');
        setUser((prev) => ({ ...prev, consentAcceptedAt: new Date().toISOString() }));
        router.push('/app/discover');
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, acceptConsent, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
