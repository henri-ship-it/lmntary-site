import Link from 'next/link';
import styles from './page.module.css';

export default function NewsletterPage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className="container container--narrow">
          <h1 className={styles.heroHeading}>Mindset Matters</h1>
          <p className={styles.heroSub}>Weekly performance insights. Practical applications. No fluff.</p>
          <p className={styles.heroStats}>
            <strong>67% open rate.</strong> <strong>1,000+ subscribers.</strong>
          </p>

          <form className={styles.newsletterForm} action="#" method="POST">
            <div className={styles.newsletterFormWrapper}>
              <input
                type="email"
                className={styles.newsletterFormInput}
                placeholder="you@example.com"
                required
              />
              <button type="submit" className="btn btn--primary">Subscribe</button>
            </div>
          </form>
          <p className={styles.newsletterFormNote}>Join free. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className={styles.expectations}>
        <div className="container">
          <div className={styles.expectationsGrid}>
            <div className={styles.expectationCard}>
              <h2 className={styles.expectationCardTitle}>Frameworks</h2>
              <p className={styles.expectationCardDesc}>Psychological models and mental tools you can apply the same week.</p>
            </div>
            <div className={styles.expectationCard}>
              <h2 className={styles.expectationCardTitle}>Case Studies</h2>
              <p className={styles.expectationCardDesc}>Real stories from real people going through real shifts.</p>
            </div>
            <div className={styles.expectationCard}>
              <h2 className={styles.expectationCardTitle}>Practical Application</h2>
              <p className={styles.expectationCardDesc}>Not theory for theory's sake. Every insight comes with a next step.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ARCHIVE PREVIEW */}
      <section className={styles.archive}>
        <div className={styles.archiveHeader}>
          <h2 className={styles.archiveHeading}>Recent Editions</h2>
        </div>

        <div className={styles.archiveGrid}>
          <Link href="/newsletter/the-overthinking-trap" className={styles.archiveCard}>
            <div className={styles.archiveCardDate}>March 2026</div>
            <div className={styles.archiveCardTitle}>The Overthinking Trap</div>
            <p className={styles.archiveCardDesc}>How paralysis by analysis kills momentum and what to do instead.</p>
          </Link>

          <Link href="/newsletter/why-most-goals-fail" className={styles.archiveCard}>
            <div className={styles.archiveCardDate}>March 2026</div>
            <div className={styles.archiveCardTitle}>Why Most Goals Fail (And What to Do Instead)</div>
            <p className={styles.archiveCardDesc}>The missing element in goal-setting that separates achievers from dreamers.</p>
          </Link>

          <Link href="/newsletter/between-stimulus-and-response" className={styles.archiveCard}>
            <div className={styles.archiveCardDate}>February 2026</div>
            <div className={styles.archiveCardTitle}>Between Stimulus and Response</div>
            <p className={styles.archiveCardDesc}>The space where all your power lives. How to expand it.</p>
          </Link>

          <Link href="/newsletter/the-power-of-reframing" className={styles.archiveCard}>
            <div className={styles.archiveCardDate}>February 2026</div>
            <div className={styles.archiveCardTitle}>The Power of Reframing</div>
            <p className={styles.archiveCardDesc}>Your circumstances don't change. Your relationship to them does.</p>
          </Link>

          <Link href="/newsletter/self-awareness-is-not-improvement" className={styles.archiveCard}>
            <div className={styles.archiveCardDate}>January 2026</div>
            <div className={styles.archiveCardTitle}>Self-Awareness Is Not Self-Improvement</div>
            <p className={styles.archiveCardDesc}>Know thyself. But knowing and doing are two very different things.</p>
          </Link>
        </div>

        <div className={styles.archiveCta}>
          <Link href="/insights" className="btn btn--ghost">Browse all editions →</Link>
        </div>
      </section>

      {/* MINDSET MATTERS LIVE */}
      <section className={styles.liveCommunity}>
        <div className={styles.liveCommunityInner}>
          <h2 className={styles.liveCommunityHeading}>Mindset Matters Live</h2>
          <p className={styles.liveCommunityDesc}>Go deeper. A closed community for those who want more.</p>

          <div className={styles.liveCommunityDetails}>
            <div className={styles.liveCommunityDetailItem}>
              <strong>Bi-weekly live calls.</strong> Direct access. No broadcasting.
            </div>
            <div className={styles.liveCommunityDetailItem}>
              <strong>Q&A at the end of each session.</strong> Your questions, your answers.
            </div>
            <div className={styles.liveCommunityDetailItem}>
              <strong>Run on WhatsApp.</strong> Private, intimate, and always accessible.
            </div>
            <div className={styles.liveCommunityDetailItem}>
              <strong>Exclusive resources.</strong> Case studies, frameworks, and tools members only.
            </div>
            <div className={styles.liveCommunityDetailItem}>
              <strong>Like-minded peers.</strong> A community of people who take their growth seriously.
            </div>
          </div>

          <a href="#live-join" className="btn btn--primary">Join Mindset Matters Live</a>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.bottomCta}>
        <div className="container container--narrow">
          <h2 className={styles.bottomCtaHeading}>Ready to Start?</h2>
          <p className={styles.bottomCtaDesc}>
            Join 1,000+ subscribers receiving weekly frameworks, case studies, and practical applications delivered straight to your inbox.
          </p>

          <form className={styles.newsletterForm} action="#" method="POST">
            <div className={styles.newsletterFormWrapper}>
              <input
                type="email"
                className={styles.newsletterFormInput}
                placeholder="you@example.com"
                required
              />
              <button type="submit" className="btn btn--primary">Subscribe</button>
            </div>
          </form>
          <p className={styles.newsletterFormNote}>No spam. Unsubscribe in one click.</p>
        </div>
      </section>
    </>
  );
}
