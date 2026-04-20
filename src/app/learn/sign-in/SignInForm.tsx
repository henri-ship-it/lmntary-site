'use client';

import { useState, FormEvent } from 'react';
import { createClient } from '@/lib/supabase-browser';
import styles from './page.module.css';

/**
 * Magic-link sign-in form.
 *
 * Sends a Supabase OTP (magic link) to the user's email.
 * On click, Supabase redirects to /auth/callback which exchanges
 * the code for a session and sends them to /learn.
 */
export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/learn`,
        },
      });

      if (error) {
        console.error('Magic link error:', error);
        setErrorMsg(error.message);
        setStatus('error');
        return;
      }

      setStatus('sent');
    } catch (err) {
      console.error('Sign-in failed:', err);
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className={styles.sent}>
        <div className={styles.sentIcon}>&#10003;</div>
        <p className={styles.sentText}>
          Check your inbox. We&apos;ve sent a sign-in link to <strong>{email}</strong>. It expires in 24 hours.
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
      {status === 'error' && (
        <p className={styles.error}>{errorMsg}</p>
      )}
    </form>
  );
}
