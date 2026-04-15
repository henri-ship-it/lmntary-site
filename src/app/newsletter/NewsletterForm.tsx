'use client';

import { useState, FormEvent } from 'react';
import styles from './page.module.css';

interface NewsletterFormProps {
  location: 'hero' | 'bottom' | 'inline' | 'sidebar';
}

export default function NewsletterForm({ location }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');

    try {
      const formData = new FormData();
      formData.append('email_address', email);

      const res = await fetch('https://app.kit.com/forms/7199002/subscriptions', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });

      // mode: no-cors means we can't read the response,
      // but if it doesn't throw, the request was sent
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.formSuccess}>
        <div className={styles.formSuccessIcon}>&#10003;</div>
        <p className={styles.formSuccessText}>You're in. Check your inbox to confirm.</p>
      </div>
    );
  }

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit}>
      <div className={styles.signupFormRow}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.signupInput}
          placeholder="you@example.com"
          required
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className={`btn btn--primary ${styles.signupBtn}`}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && (
        <p className={styles.formError}>Something went wrong. Please try again.</p>
      )}
      <p className={styles.signupNote}>Free. No spam. Unsubscribe anytime.</p>
    </form>
  );
}
