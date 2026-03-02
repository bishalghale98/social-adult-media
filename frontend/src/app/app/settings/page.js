'use client';
import { useState, useEffect } from 'react';
import api from '../../../lib/api';

export default function SettingsPage() {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlocks();
    }, []);

    async function fetchBlocks() {
        try {
            const { data } = await api.get('/blocks');
            setBlocks(data);
        } catch {
            // Ignore
        } finally {
            setLoading(false);
        }
    }

    async function unblock(blockedId) {
        try {
            await api.delete(`/blocks/${blockedId}`);
            setBlocks((prev) => prev.filter((b) => b.blockedId !== blockedId));
        } catch {
            alert('Failed to unblock');
        }
    }

    return (
        <div className="animate-in" style={{ maxWidth: 600 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <span className="gradient-text">Settings</span>
            </h1>

            {/* Legal disclaimer */}
            <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'rgba(245,158,11,0.3)' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-warning)' }}>⚠️ Platform Disclaimer</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                    This platform only provides communication tools. Users are solely responsible for their interactions, decisions, and offline activities.
                </p>
            </div>

            {/* Blocked users */}
            <div className="card">
                <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Blocked Users</h3>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem' }}>
                        <div className="spinner"></div>
                    </div>
                ) : blocks.length === 0 ? (
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>You haven&apos;t blocked anyone.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {blocks.map((block) => (
                            <div key={block.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '0.75rem 1rem', background: 'var(--color-surface-light)', borderRadius: '0.5rem',
                            }}>
                                <span style={{ fontWeight: 500 }}>{block.blockedUser?.username || 'Unknown'}</span>
                                <button className="btn-secondary" onClick={() => unblock(block.blockedId)}
                                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>
                                    Unblock
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
