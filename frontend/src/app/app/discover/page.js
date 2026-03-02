'use client';
import { useState, useEffect } from 'react';
import api from '../../../lib/api';

export default function DiscoverPage() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({ gender: '', interestedIn: '', city: '', minAge: '', maxAge: '' });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [sendingTo, setSendingTo] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [page]);

    async function fetchUsers() {
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (filters.gender) params.gender = filters.gender;
            if (filters.interestedIn) params.interestedIn = filters.interestedIn;
            if (filters.city) params.city = filters.city;
            if (filters.minAge) params.minAge = filters.minAge;
            if (filters.maxAge) params.maxAge = filters.maxAge;

            const { data } = await api.get('/users', { params });
            setUsers(data.users);
            setPagination(data.pagination);
        } catch {
            // Ignore
        } finally {
            setLoading(false);
        }
    }

    async function sendFriendRequest(userId) {
        setSendingTo(userId);
        try {
            await api.post('/friends/requests', { receiverId: userId });
            setUsers((prev) => prev.filter((u) => u.userId !== userId));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to send request');
        } finally {
            setSendingTo(null);
        }
    }

    function handleFilterChange(e) {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    }

    function applyFilters(e) {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    }

    return (
        <div className="animate-in">
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <span className="gradient-text">Discover People</span>
            </h1>

            {/* Filters */}
            <form onSubmit={applyFilters} className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
                    <div>
                        <label className="label">Gender</label>
                        <select name="gender" className="input-field" value={filters.gender} onChange={handleFilterChange}>
                            <option value="">All</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Interested In</label>
                        <select name="interestedIn" className="input-field" value={filters.interestedIn} onChange={handleFilterChange}>
                            <option value="">All</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="ANY">Any</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">City</label>
                        <input name="city" className="input-field" placeholder="City name" value={filters.city} onChange={handleFilterChange} />
                    </div>
                    <div>
                        <label className="label">Min Age</label>
                        <input name="minAge" type="number" className="input-field" placeholder="18" value={filters.minAge} onChange={handleFilterChange} min={18} />
                    </div>
                    <div>
                        <label className="label">Max Age</label>
                        <input name="maxAge" type="number" className="input-field" placeholder="99" value={filters.maxAge} onChange={handleFilterChange} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ height: 44 }}>Search</button>
                </div>
            </form>

            {/* Results */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <div className="spinner"></div>
                </div>
            ) : users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>
                    <p style={{ fontSize: '1.1rem' }}>No users found. Try adjusting your filters.</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {users.map((user) => (
                            <div key={user.userId} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div className="avatar">{user.username[0].toUpperCase()}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{user.username}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '0.35rem' }}>
                                        {user.gender} · {user.age} yrs · {user.city}
                                    </p>
                                    {user.bio && (
                                        <p style={{
                                            fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '0.75rem',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                        }}>
                                            {user.bio}
                                        </p>
                                    )}
                                    <button className="btn-primary" onClick={() => sendFriendRequest(user.userId)}
                                        disabled={sendingTo === user.userId}
                                        style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                                        {sendingTo === user.userId ? '...' : '➕ Add Friend'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem' }}>
                            <button className="btn-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                style={{ padding: '0.5rem 1.25rem' }}>← Prev</button>
                            <span style={{ padding: '0.5rem 1rem', color: 'var(--color-muted)' }}>
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <button className="btn-secondary" onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.totalPages}
                                style={{ padding: '0.5rem 1.25rem' }}>Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
