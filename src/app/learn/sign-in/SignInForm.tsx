'use client';

import { useState, FormEvent } from 'react';
import styles from './page.module.css';

/**
 * Placeholder magic-link form.
 *
 * Final behaviour (see AUTH_ARCHITECTURE.md):
 *   POST /api/auth/magic-link { email }
 *     → server checks Stripe / Kit for paid-customer tag
 *     → if yes: signs a short-lived JWT, emails link that sets a cookie
 *     → if no: still returns success (don't leak customer status)
 *
 * For now we just show the "check your inbox" state.
 */
export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    // TODO: wire to /api/auth/magic-link once built
    await new Promise((r) => setTimeout(r, 600));
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <div className={styles.sent}>
        <div className={styles.sentIcon}>&#10003;</div>
        <p className={styles.sentText}>
          Check your inbox. If we have a record of your account, you&apos;ll get a sign-in link in the next minute or two.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        disabled={status === 'loading'}
        className={styles.input}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`btn btn--primary ${styles.btn}`}
      >
        {status === 'loading' ? 'Sending link...' : 'Send me a sign-in link'}
      </button>
    </form>
  );
}
