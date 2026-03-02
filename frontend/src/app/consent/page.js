'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ConsentPage() {
    const { acceptConsent, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    async function handleAccept() {
        if (!checked) return;
        setLoading(true);
        try {
            await acceptConsent();
        } catch {
            setLoading(false);
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass animate-in" style={{ width: '100%', maxWidth: 560, padding: '2.5rem', borderRadius: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-warning), var(--color-accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.25rem', fontSize: '1.8rem',
                    }}>⚠️</div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                        <span className="gradient-text">Terms & Consent</span>
                    </h1>
                </div>

                <div style={{
                    background: 'var(--color-surface)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    color: 'var(--color-muted)',
                }}>
                    <h3 style={{ color: 'var(--color-foreground)', marginBottom: '1rem', fontWeight: 600 }}>
                        Platform Rules & Age Verification
                    </h3>
                    <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li><strong style={{ color: 'var(--color-foreground)' }}>Age Requirement:</strong> You confirm that you are at least 18 years old.</li>
                        <li><strong style={{ color: 'var(--color-foreground)' }}>Communication Only:</strong> This platform only provides communication tools. Users are solely responsible for their interactions, decisions, and offline activities.</li>
                        <li><strong style={{ color: 'var(--color-foreground)' }}>Respect Others:</strong> Harassment, spam, or abusive behavior will result in suspension or ban.</li>
                        <li><strong style={{ color: 'var(--color-foreground)' }}>Privacy:</strong> Do not share others&apos; personal information without consent.</li>
                        <li><strong style={{ color: 'var(--color-foreground)' }}>Content Policy:</strong> No illegal content. Messages are text-only in this version.</li>
                        <li><strong style={{ color: 'var(--color-foreground)' }}>Reporting:</strong> Report any suspicious or abusive behavior using the built-in tools.</li>
                    </ul>
                </div>

                <label style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    marginBottom: '1.5rem', cursor: 'pointer',
                    padding: '1rem', borderRadius: '0.75rem',
                    background: checked ? 'rgba(124,58,237,0.08)' : 'transparent',
                    border: `1px solid ${checked ? 'var(--color-primary)' : 'rgba(124,58,237,0.15)'}`,
                    transition: 'all 0.3s ease',
                }}>
                    <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)}
                        style={{ width: 20, height: 20, marginTop: 2, accentColor: 'var(--color-primary)' }} />
                    <span style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                        I confirm that I am <strong>18 years or older</strong> and I agree to the platform rules and terms of use.
                    </span>
                </label>

                <button className="btn-primary" onClick={handleAccept} disabled={!checked || loading}
                    style={{ width: '100%', padding: '0.9rem' }}>
                    {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span> : 'Accept & Continue'}
                </button>
            </div>
        </div>
    );
}
