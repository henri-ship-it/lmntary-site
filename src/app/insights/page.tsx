import InsightsFilter from './InsightsFilter';
import styles from './page.module.css';

export const metadata = {
  title: 'Insights | LMNTARY Performance',
  description:
    'Weekly insights, frameworks, and the science behind sustained excellence. Performance psychology in practice.',
};

export default function InsightsPage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className="container container--narrow">
          <p className={styles.heroEyebrow}>Performance Psychology</p>
          <h1 className={styles.heroHeading}>INSIGHTS</h1>
          <p className={styles.heroSub}>
            Performance psychology in practice. Weekly insights, frameworks, and the science behind sustained excellence.
          </p>
        </div>
      </section>

      {/* INSIGHTS FILTER AND CARDS */}
      <InsightsFilter />

      {/* NEWSLETTER CTA */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <h2 className={styles.newsletterHeading}>Mindset Matters</h2>
          <p className={styles.newsletterDesc}>Weekly performance insights delivered to your inbox.</p>
          <form className={styles.newsletterForm} action="#" method="POST">
            <input
              type="email"
              className={styles.newsletterInput}
              placeholder="you@example.com"
              required
            />
            <button type="submit" className="btn btn--primary">
              Subscribe
            </button>
          </form>
          <p className={styles.newsletterNote}>Join 1,000+ subscribers. No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
