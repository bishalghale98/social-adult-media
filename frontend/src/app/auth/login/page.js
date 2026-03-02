'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass animate-in" style={{ width: '100%', maxWidth: 440, padding: '2.5rem', borderRadius: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '1rem',
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.25rem', fontSize: '1.5rem',
                    }}>🔒</div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                        <span className="gradient-text">Welcome Back</span>
                    </h1>
                    <p style={{ color: 'var(--color-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        Sign in to your account
                    </p>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label className="label">Email</label>
                        <input name="email" type="email" className="input-field" placeholder="your@email.com"
                            value={form.email} onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="label">Password</label>
                        <input name="password" type="password" className="input-field" placeholder="Enter your password"
                            value={form.password} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}
                        style={{ width: '100%', marginTop: '0.25rem', padding: '0.9rem' }}>
                        {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span> : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: 600 }}>
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}
