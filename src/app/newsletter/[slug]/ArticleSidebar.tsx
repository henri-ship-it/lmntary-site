'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface RelatedEdition {
  slug: string;
  tag: string;
  title: string;
}

export default function ArticleSidebar({ related }: { related: RelatedEdition[] }) {
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

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarSticky}>
        {/* Subscribe CTA */}
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarCardLabel}>MINDSET MATTERS</div>
          <p className={styles.sidebarCardDesc}>
            Weekly performance insights. Practical applications. No fluff.
          </p>
          {status === 'success' ? (
            <div className={styles.sidebarSuccess}>You're in. Check your inbox.</div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.sidebarForm}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.sidebarInput}
                placeholder="you@example.com"
                required
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                className={`btn btn--primary ${styles.sidebarBtn}`}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
          <p className={styles.sidebarNote}>1,000+ subscribers. Free.</p>
        </div>

        {/* Related Articles */}
        <div className={styles.sidebarRelated}>
          <div className={styles.sidebarRelatedLabel}>More Issues</div>
          {related.map((r) => (
            <Link key={r.slug} href={`/newsletter/${r.slug}`} className={styles.sidebarRelatedItem}>
              <span className={styles.sidebarRelatedTag}>{r.tag}</span>
              <span className={styles.sidebarRelatedTitle}>{r.title}</span>
            </Link>
          ))}
          <Link href="/newsletter" className={styles.sidebarAllLink}>
            All issues &rarr;
          </Link>
        </div>

        {/* Programme CTA */}
        <div className={styles.sidebarProgramme}>
          <div className={styles.sidebarProgrammeLabel}>Go Deeper</div>
          <p className={styles.sidebarProgrammeText}>
            These insights are drawn from the Limitless programme. 16 weeks of structured performance psychology.
          </p>
          <Link href="/programmes" className={styles.sidebarProgrammeLink}>
            Explore Limitless &rarr;
          </Link>
        </div>
      </div>
    </aside>
  );
}
