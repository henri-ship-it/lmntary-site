'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface RelatedEdition {
  slug: string;
  tag: string;
  title: string;
}

interface ArticleSidebarProps {
  related: RelatedEdition[];
  shareUrl?: string;
  shareText?: string;
  variant: 'sidebar' | 'inline-subscribe';
}

function SubscribeForm({ compact = false }: { compact?: boolean }) {
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
    return <div className={styles.sidebarSuccess}>You&apos;re in. Check your inbox.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? styles.inlineForm : styles.sidebarForm}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={compact ? styles.inlineInput : styles.sidebarInput}
        placeholder="Email Address"
        required
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        className={`btn btn--primary ${compact ? styles.inlineBtn : styles.sidebarBtn}`}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
    </form>
  );
}

export default function ArticleSidebar({ related, shareUrl, shareText, variant }: ArticleSidebarProps) {
  // Inline subscribe only (used at bottom of article)
  if (variant === 'inline-subscribe') {
    return (
      <div>
        <SubscribeForm compact />
        <p className={styles.inlineNote}>Free. No spam. Unsubscribe anytime.</p>
      </div>
    );
  }

  // Full sticky sidebar
  const xUrl = shareUrl ? `https://x.com/intent/tweet?text=${encodeURIComponent(shareText || '')}&url=${encodeURIComponent(shareUrl)}` : '';
  const linkedInUrl = shareUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` : '';
  const emailUrl = shareUrl ? `mailto:?subject=${encodeURIComponent(shareText || '')}&body=${encodeURIComponent(`Check this out: ${shareUrl}`)}` : '';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarSticky}>
        {/* Subscribe CTA */}
        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarCardLabel}>Subscribe to the Newsletter</h3>
          <p className={styles.sidebarCardDesc}>
            Join 1,000+ readers who get weekly performance insights. Practical applications. No fluff.
          </p>
          <SubscribeForm />
        </div>

        {/* Share */}
        {shareUrl && (
          <div className={styles.sidebarShare}>
            <h3 className={styles.sidebarShareLabel}>Share this Article on:</h3>
            <div className={styles.sidebarShareLinks}>
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sidebarShareLink}
                aria-label="Share on X"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sidebarShareLink}
                aria-label="Share on LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href={emailUrl}
                className={styles.sidebarShareLink}
                aria-label="Share via Email"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Limitless Programme CTA */}
        <div className={styles.sidebarProgramme}>
          <div className={styles.sidebarProgrammeLabel}>Go Deeper</div>
          <p className={styles.sidebarProgrammeText}>
            These insights are drawn from Limitless, a 16-week performance psychology programme built on 20+ years of applied research. Understand how you operate and build a system that works.
          </p>
          <Link href="/programmes" className={styles.sidebarProgrammeLink}>
            Explore Limitless &rarr;
          </Link>
        </div>
      </div>
    </aside>
  );
}
