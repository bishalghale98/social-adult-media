'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';

export default function RegisterPage() {
    const { register } = useAuth();
    const [form, setForm] = useState({
        email: '', password: '', username: '', gender: 'MALE',
        interestedIn: 'ANY', dob: '', city: '',
    });
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
            await register(form);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.details?.[0]?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass animate-in" style={{ width: '100%', maxWidth: 480, padding: '2.5rem', borderRadius: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                        <span className="gradient-text">Create Account</span>
                    </h1>
                    <p style={{ color: 'var(--color-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        Join PrivateConnect — 18+ only
                    </p>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label className="label">Email</label>
                        <input name="email" type="email" className="input-field" placeholder="your@email.com"
                            value={form.email} onChange={handleChange} required />
                    </div>

                    <div>
                        <label className="label">Password</label>
                        <input name="password" type="password" className="input-field" placeholder="Min 8 characters"
                            value={form.password} onChange={handleChange} required minLength={8} />
                    </div>

                    <div>
                        <label className="label">Username</label>
                        <input name="username" type="text" className="input-field" placeholder="unique_username"
                            value={form.username} onChange={handleChange} required minLength={3} maxLength={30} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="label">Gender</label>
                            <select name="gender" className="input-field" value={form.gender} onChange={handleChange}>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Interested In</label>
                            <select name="interestedIn" className="input-field" value={form.interestedIn} onChange={handleChange}>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="ANY">Any</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="label">Date of Birth</label>
                            <input name="dob" type="date" className="input-field" value={form.dob} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="label">City</label>
                            <input name="city" type="text" className="input-field" placeholder="Your city"
                                value={form.city} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}
                        style={{ width: '100%', marginTop: '0.5rem', padding: '0.9rem' }}>
                        {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span> : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link href="/auth/login" style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontWeight: 600 }}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
