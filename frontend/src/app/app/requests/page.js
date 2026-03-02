'use client';
import { useState, useEffect } from 'react';
import api from '../../../lib/api';

export default function RequestsPage() {
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [tab, setTab] = useState('incoming');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    async function fetchRequests() {
        setLoading(true);
        try {
            const [inc, out] = await Promise.all([
                api.get('/friends/requests/incoming'),
                api.get('/friends/requests/outgoing'),
            ]);
            setIncoming(inc.data);
            setOutgoing(out.data);
        } catch {
            // Ignore
        } finally {
            setLoading(false);
        }
    }

    async function acceptRequest(id) {
        try {
            await api.post(`/friends/requests/${id}/accept`);
            setIncoming((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed');
        }
    }

    async function rejectRequest(id) {
        try {
            await api.post(`/friends/requests/${id}/reject`);
            setIncoming((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed');
        }
    }

    async function cancelRequest(id) {
        try {
            await api.post(`/friends/requests/${id}/cancel`);
            setOutgoing((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed');
        }
    }

    return (
        <div className="animate-in">
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <span className="gradient-text">Friend Requests</span>
            </h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {['incoming', 'outgoing'].map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                        style={{
                            padding: '0.6rem 1.5rem', borderRadius: '0.5rem', border: 'none',
                            background: tab === t ? 'rgba(124,58,237,0.2)' : 'var(--color-surface)',
                            color: tab === t ? 'var(--color-primary-light)' : 'var(--color-muted)',
                            fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                            transition: 'all 0.2s ease',
                        }}>
                        {t === 'incoming' ? `Incoming (${incoming.length})` : `Outgoing (${outgoing.length})`}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <div className="spinner"></div>
                </div>
            ) : tab === 'incoming' ? (
                incoming.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>
                        No incoming requests
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {incoming.map((req) => (
                            <div key={req.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="avatar">{req.sender?.profile?.username?.[0]?.toUpperCase() || '?'}</div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontWeight: 600 }}>{req.sender?.profile?.username || 'Unknown'}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                                        {req.sender?.profile?.gender} · {req.sender?.profile?.city}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-primary" onClick={() => acceptRequest(req.id)}
                                        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Accept</button>
                                    <button className="btn-danger" onClick={() => rejectRequest(req.id)}
                                        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                outgoing.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>
                        No outgoing requests
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {outgoing.map((req) => (
                            <div key={req.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div className="avatar">{req.receiver?.profile?.username?.[0]?.toUpperCase() || '?'}</div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontWeight: 600 }}>{req.receiver?.profile?.username || 'Unknown'}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>Pending</p>
                                </div>
                                <button className="btn-secondary" onClick={() => cancelRequest(req.id)}
                                    style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Cancel</button>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
