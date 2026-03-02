'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';

export default function ChatsPage() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchConversations();
    }, []);

    async function fetchConversations() {
        try {
            const { data } = await api.get('/conversations');
            setConversations(data);
        } catch {
            // Ignore
        } finally {
            setLoading(false);
        }
    }

    function formatTime(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return d.toLocaleDateString();
    }

    return (
        <div className="animate-in">
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <span className="gradient-text">Messages</span>
            </h1>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <div className="spinner"></div>
                </div>
            ) : conversations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</p>
                    <p>No conversations yet. Add friends to start chatting!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {conversations.map((conv) => (
                        <div key={conv.id} className="card"
                            onClick={() => router.push(`/app/chat/${conv.id}`)}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
                            <div className="avatar">
                                {conv.otherUser?.username?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                    <h3 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{conv.otherUser?.username || 'Unknown'}</h3>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                                        {formatTime(conv.lastMessageAt)}
                                    </span>
                                </div>
                                <p style={{
                                    fontSize: '0.85rem', color: 'var(--color-muted)',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>
                                    {conv.lastMessage?.bodyText || 'Start a conversation...'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
