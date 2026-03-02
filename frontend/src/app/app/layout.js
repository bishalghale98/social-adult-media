'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { href: '/app/discover', label: 'Discover', icon: '🔍' },
    { href: '/app/requests', label: 'Requests', icon: '👋' },
    { href: '/app/chats', label: 'Chats', icon: '💬' },
    { href: '/app/profile', label: 'Profile', icon: '👤' },
];

export default function AppLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login');
        } else if (!loading && user && !user.consentAcceptedAt) {
            router.push('/consent');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top nav */}
            <header style={{
                background: 'var(--color-surface)',
                borderBottom: '1px solid rgba(124,58,237,0.15)',
                padding: '0.75rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backdropFilter: 'blur(12px)',
            }}>
                <Link href="/app/discover" style={{ textDecoration: 'none' }}>
                    <span className="gradient-text" style={{ fontSize: '1.3rem', fontWeight: 800 }}>PrivateConnect</span>
                </Link>

                <nav style={{ display: 'flex', gap: '0.25rem' }}>
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: pathname.startsWith(item.href) ? 'var(--color-primary-light)' : 'var(--color-muted)',
                            background: pathname.startsWith(item.href) ? 'rgba(124,58,237,0.1)' : 'transparent',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                        }}>
                            <span>{item.icon}</span>
                            <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>{item.label}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button onClick={logout} className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                    Logout
                </button>
            </header>

            {/* Main content */}
            <main style={{ flex: 1, padding: '1.5rem' }}>
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
}
