'use client';

import { useState, FormEvent } from 'react';

interface NewsletterSignupProps {
  inputClass?: string;
  buttonClass?: string;
  noteClass?: string;
  wrapperClass?: string;
  successClass?: string;
  buttonText?: string;
  placeholder?: string;
  noteText?: string;
}

export default function NewsletterSignup({
  inputClass = '',
  buttonClass = 'btn btn--primary',
  noteClass = '',
  wrapperClass = '',
  successClass = '',
  buttonText = 'Subscribe',
  placeholder = 'you@example.com',
  noteText = 'Join 1,000+ subscribers. No spam. Unsubscribe anytime.',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const formData = new FormData();
      formData.append('email_address', email);
      await fetch('https://app.kit.com/forms/7199002/subscriptions', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={successClass} style={!successClass ? {
        padding: '16px 20px',
        background: 'rgba(4, 223, 191, 0.08)',
        border: '1px solid rgba(4, 223, 191, 0.25)',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: 500,
        textAlign: 'center' as const,
      } : undefined}>
        You're in. Check your inbox to confirm.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={wrapperClass} style={!wrapperClass ? {
        display: 'flex',
        gap: '10px',
        marginBottom: '12px',
        flexWrap: 'wrap' as const,
        justifyContent: 'center',
      } : undefined}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder={placeholder}
          required
          disabled={status === 'loading'}
          style={!inputClass ? {
            flex: 1,
            minWidth: '200px',
            maxWidth: '320px',
            padding: '14px 20px',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            outline: 'none',
          } : undefined}
        />
        <button
          type="submit"
          className={buttonClass}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Subscribing...' : buttonText}
        </button>
      </div>
      {status === 'error' && (
        <p style={{ fontSize: '13px', color: '#e53e3e', textAlign: 'center', marginBottom: '8px' }}>
          Something went wrong. Please try again.
        </p>
      )}
      {noteText && <p className={noteClass} style={!noteClass ? { fontSize: '13px', color: 'var(--color-text-secondary)', textAlign: 'center' as const } : undefined}>{noteText}</p>}
    </form>
  );
}
