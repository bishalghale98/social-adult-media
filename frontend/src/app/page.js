'use client';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px' }} className="animate-in">
          {/* Logo / Icon */}
          <div style={{
            width: 80, height: 80, borderRadius: '1.25rem',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem', fontSize: '2rem',
            boxShadow: '0 0 40px rgba(124,58,237,0.3)',
          }}>
            🔒
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}>
            <span className="gradient-text">PrivateConnect</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: 560, margin: '0 auto 2.5rem' }}>
            A secure, adult-only messaging platform built on consent.
            Connect privately with verified users in a safe environment.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register">
              <button className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                Get Started
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
                Sign In
              </button>
            </Link>
          </div>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginTop: '4rem' }}>
            {[
              { icon: '🛡️', title: '18+ Verified', desc: 'Age-gated with consent' },
              { icon: '💬', title: 'Private Chat', desc: 'Friends-only messaging' },
              { icon: '🔐', title: 'Encrypted', desc: 'Secure communications' },
              { icon: '🚫', title: 'Block & Report', desc: 'Safety-first moderation' },
            ].map((f, i) => (
              <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.35rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Disclaimer footer */}
      <footer style={{
        padding: '1.5rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(124,58,237,0.1)',
        fontSize: '0.8rem',
        color: 'var(--color-muted)',
      }}>
        This platform only provides communication tools. Users are solely responsible for their interactions, decisions, and offline activities.
      </footer>
    </div>
  );
}
