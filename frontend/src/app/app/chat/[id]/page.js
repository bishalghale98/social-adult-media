'use client';
import { useState, useEffect, useRef, use } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { getSocket, disconnectSocket } from '../../../../lib/socket';
import api from '../../../../lib/api';

export default function ChatPage({ params }) {
    const resolvedParams = use(params);
    const conversationId = resolvedParams.id;
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        fetchMessages();
        setupSocket();
        return () => {
            disconnectSocket();
        };
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    async function fetchMessages() {
        try {
            const [msgRes, convRes] = await Promise.all([
                api.get(`/conversations/${conversationId}/messages`),
                api.get('/conversations'),
            ]);
            setMessages(msgRes.data.messages);
            const conv = convRes.data.find((c) => c.id === conversationId);
            if (conv) setOtherUser(conv.otherUser);
        } catch {
            // Ignore
        } finally {
            setLoading(false);
        }
    }

    function setupSocket() {
        const socket = getSocket();
        socketRef.current = socket;

        socket.on('message:new', (message) => {
            if (message.conversationId === conversationId) {
                setMessages((prev) => [...prev, message]);
            }
        });

        socket.on('typing', (data) => {
            if (data.conversationId === conversationId && data.userId !== user?.id) {
                setIsTyping(data.isTyping);
            }
        });
    }

    function handleTyping() {
        const socket = socketRef.current;
        if (!socket) return;

        socket.emit('typing:start', { conversationId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing:stop', { conversationId });
        }, 2000);
    }

    async function sendMessage(e) {
        e.preventDefault();
        if (!input.trim()) return;

        const socket = socketRef.current;
        if (socket) {
            socket.emit('message:send', {
                conversationId,
                bodyText: input.trim(),
            });
            socket.emit('typing:stop', { conversationId });
        }
        setInput('');
    }

    function formatTime(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
            {/* Chat header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem', background: 'var(--color-surface)',
                borderRadius: '1rem', marginBottom: '1rem',
            }}>
                <div className="avatar">{otherUser?.username?.[0]?.toUpperCase() || '?'}</div>
                <div>
                    <h2 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{otherUser?.username || 'Chat'}</h2>
                    {isTyping && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', fontStyle: 'italic' }}>
                            typing...
                        </p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '1rem',
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
            }}>
                {messages.map((msg) => {
                    const isMine = msg.senderId === user?.id;
                    return (
                        <div key={msg.id} style={{
                            alignSelf: isMine ? 'flex-end' : 'flex-start',
                            maxWidth: '75%',
                        }}>
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderRadius: isMine ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                                background: isMine
                                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))'
                                    : 'var(--color-surface-light)',
                                color: isMine ? 'white' : 'var(--color-foreground)',
                                fontSize: '0.9rem',
                                lineHeight: 1.5,
                            }}>
                                {msg.bodyText}
                            </div>
                            <p style={{
                                fontSize: '0.7rem', color: 'var(--color-muted)',
                                marginTop: '0.2rem',
                                textAlign: isMine ? 'right' : 'left',
                            }}>
                                {formatTime(msg.createdAt)}
                            </p>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={{
                display: 'flex', gap: '0.75rem', padding: '1rem',
                background: 'var(--color-surface)', borderRadius: '1rem',
            }}>
                <input
                    className="input-field"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => { setInput(e.target.value); handleTyping(); }}
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                    Send
                </button>
            </form>
        </div>
    );
}
