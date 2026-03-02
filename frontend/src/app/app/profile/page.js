'use client';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';

export default function ProfilePage() {
    const { user, checkAuth } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        bio: user?.profile?.bio || '',
        city: user?.profile?.city || '',
        visibility: user?.profile?.visibility || 'PUBLIC',
        interestedIn: user?.profile?.interestedIn || 'ANY',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSave(e) {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        try {
            await api.patch('/me/profile', form);
            await checkAuth();
            setSuccess('Profile updated successfully');
            setEditing(false);
        } catch {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    }

    if (!user) return null;

    return (
        <div className="animate-in" style={{ maxWidth: 600 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <span className="gradient-text">My Profile</span>
            </h1>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div className="avatar" style={{ width: 72, height: 72, fontSize: '1.5rem' }}>
                        {user.profile?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                        <h2 style={{ fontWeight: 700, fontSize: '1.3rem' }}>{user.profile?.username}</h2>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>{user.email}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <span className="badge" style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--color-primary-light)' }}>
                                {user.profile?.gender}
                            </span>
                            <span className="badge" style={{ background: 'rgba(236,72,153,0.15)', color: 'var(--color-accent-light)' }}>
                                Interested in: {user.profile?.interestedIn}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <span className="label">City</span>
                        <p>{user.profile?.city}</p>
                    </div>
                    <div>
                        <span className="label">Visibility</span>
                        <p>{user.profile?.visibility}</p>
                    </div>
                </div>

                {user.profile?.bio && (
                    <div style={{ marginBottom: '1rem' }}>
                        <span className="label">Bio</span>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>{user.profile.bio}</p>
                    </div>
                )}

                <button className="btn-secondary" onClick={() => setEditing(!editing)}>
                    {editing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            {editing && (
                <form onSubmit={handleSave} className="card">
                    {success && (
                        <div style={{
                            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                            color: 'var(--color-success)', padding: '0.75rem', borderRadius: '0.75rem',
                            marginBottom: '1rem', fontSize: '0.9rem',
                        }}>{success}</div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label className="label">Bio</label>
                            <textarea name="bio" className="input-field" rows={3} maxLength={300}
                                placeholder="Tell people about yourself..."
                                value={form.bio} onChange={handleChange}
                                style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{form.bio.length}/300</span>
                        </div>

                        <div>
                            <label className="label">City</label>
                            <input name="city" className="input-field" value={form.city} onChange={handleChange} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="label">Visibility</label>
                                <select name="visibility" className="input-field" value={form.visibility} onChange={handleChange}>
                                    <option value="PUBLIC">Public</option>
                                    <option value="HIDDEN">Hidden</option>
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

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
