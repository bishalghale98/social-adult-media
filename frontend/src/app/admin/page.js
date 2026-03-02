'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('OPEN');

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/app/discover');
            return;
        }
        if (user?.role === 'ADMIN') {
            fetchReports();
        }
    }, [user, authLoading, filter]);

    async function fetchReports() {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/reports', { params: { status: filter } });
            setReports(data.reports);
        } catch {
            // Ignore
        } finally {
            setLoading(false);
        }
    }

    async function reviewReport(id) {
        try {
            await api.post(`/admin/reports/${id}/review`);
            fetchReports();
        } catch {
            alert('Failed to review report');
        }
    }

    async function suspendUser(userId) {
        if (!confirm('Suspend this user?')) return;
        try {
            await api.post(`/admin/users/${userId}/suspend`);
            alert('User suspended');
        } catch {
            alert('Failed');
        }
    }

    async function banUser(userId) {
        if (!confirm('Ban this user? This is permanent.')) return;
        try {
            await api.post(`/admin/users/${userId}/ban`);
            alert('User banned');
        } catch {
            alert('Failed');
        }
    }

    if (authLoading || !user) return null;

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <div className="container animate-in">
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    <span className="gradient-text">Admin Dashboard</span>
                </h1>
                <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>Moderation & Report Management</p>

                {/* Report filters */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {['OPEN', 'REVIEWED', 'CLOSED'].map((s) => (
                        <button key={s} onClick={() => setFilter(s)}
                            style={{
                                padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none',
                                background: filter === s ? 'rgba(124,58,237,0.2)' : 'var(--color-surface)',
                                color: filter === s ? 'var(--color-primary-light)' : 'var(--color-muted)',
                                fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
                            }}>
                            {s}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <div className="spinner"></div>
                    </div>
                ) : reports.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>
                        No {filter.toLowerCase()} reports
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {reports.map((report) => (
                            <div key={report.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <div>
                                        <span className="badge" style={{
                                            background: report.targetType === 'USER' ? 'rgba(124,58,237,0.15)' : 'rgba(236,72,153,0.15)',
                                            color: report.targetType === 'USER' ? 'var(--color-primary-light)' : 'var(--color-accent-light)',
                                            marginRight: '0.5rem',
                                        }}>
                                            {report.targetType}
                                        </span>
                                        <span className="badge" style={{
                                            background: report.status === 'OPEN' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                                            color: report.status === 'OPEN' ? 'var(--color-warning)' : 'var(--color-success)',
                                        }}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <p style={{ marginBottom: '0.5rem' }}>
                                    <strong>Reporter:</strong> {report.reporter?.profile?.username || 'Unknown'}
                                </p>
                                <p style={{ marginBottom: '0.5rem' }}>
                                    <strong>Target ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{report.targetId}</span>
                                </p>
                                <p style={{ marginBottom: '1rem', color: 'var(--color-muted)' }}>
                                    <strong style={{ color: 'var(--color-foreground)' }}>Reason:</strong> {report.reason}
                                </p>

                                {report.status === 'OPEN' && (
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <button className="btn-primary" onClick={() => reviewReport(report.id)}
                                            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                            ✓ Mark Reviewed
                                        </button>
                                        {report.targetType === 'USER' && (
                                            <>
                                                <button className="btn-secondary" onClick={() => suspendUser(report.targetId)}
                                                    style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                                    Suspend User
                                                </button>
                                                <button className="btn-danger" onClick={() => banUser(report.targetId)}
                                                    style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                                                    Ban User
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
