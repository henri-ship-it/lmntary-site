import Link from 'next/link';
import { Metadata } from 'next';
import { getEditions } from '@/lib/kit';
import NewsletterForm from './NewsletterForm';
import NewsletterArchive from './NewsletterArchive';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Mindset Matters | LMNTARY Performance',
  description:
    'Weekly performance insights. Practical applications. No fluff. Join 1,000+ subscribers.',
};

// Dynamic page - fetches from Kit.com API at request time
// Cached via ISR: revalidates every hour so new newsletters show up automatically
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function NewsletterPage() {
  const editions = await getEditions();
  const latest = editions[0];
  const past = editions.slice(1);

  return (
    <>
      {/* HERO - Full width, above sidebar grid */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Weekly Newsletter</p>
          <h1 className={styles.heroHeading}>Mindset Matters</h1>
          <p className={styles.heroSub}>
            Performance psychology you actually read. The one newsletter people say they look forward to opening.
          </p>
          <div className={styles.heroProof}>
            <span className={styles.heroStat}>1,000+ subscribers</span>
            <span className={styles.heroDot}></span>
            <span className={styles.heroStat}>67% open rate</span>
          </div>
          <NewsletterForm location="hero" />
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className={styles.value}>
        <div className={styles.valueGrid}>
          <div className={styles.valueItem}>
            <div className={styles.valueLabel}>Frameworks</div>
            <p className={styles.valueDesc}>Psychological models you can apply the same week.</p>
          </div>
          <div className={styles.valueItem}>
            <div className={styles.valueLabel}>Case Studies</div>
            <p className={styles.valueDesc}>Real stories from real people going through real shifts.</p>
          </div>
          <div className={styles.valueItem}>
            <div className={styles.valueLabel}>Action Steps</div>
            <p className={styles.valueDesc}>Every insight comes with a practical next step.</p>
          </div>
        </div>
      </section>

      {/* CONTENT + STICKY SIDEBAR GRID */}
      <div className={styles.pageLayout}>
        <div className={styles.mainContent}>
          {/* LATEST ISSUE - Featured */}
          {latest && (
            <section className={styles.latest}>
              <div className={styles.latestInner}>
                <p className={styles.latestLabel}>Latest Issue</p>
                <Link href={`/newsletter/${latest.slug}`} className={styles.latestCard}>
                  <span className={styles.latestDate}>{latest.date}</span>
                  <h2 className={styles.latestTitle}>{latest.title}</h2>
                  <span className={styles.latestRead}>Read this issue &rarr;</span>
                </Link>
              </div>
            </section>
          )}

          {/* ARCHIVE with Load More */}
          {past.length > 0 && (
            <NewsletterArchive
              editions={past.map((e) => ({
                id: e.id,
                slug: e.slug,
                title: e.title,
                date: e.date,
              }))}
            />
          )}

          {/* EMPTY STATE - No newsletters yet */}
          {editions.length === 0 && (
            <section className={styles.archive}>
              <div className={styles.archiveInner}>
                <p className={styles.emptyState}>
                  First issue coming soon. Subscribe above to be the first to receive it.
                </p>
              </div>
            </section>
          )}
        </div>

        {/* STICKY SIDEBAR - Subscribe */}
        <aside className={styles.stickySidebar}>
          <div className={styles.stickySidebarInner}>
            <div className={styles.stickySidebarCard}>
              <div className={styles.stickySidebarLabel}>MINDSET MATTERS</div>
              <p className={styles.stickySidebarDesc}>
                Weekly performance insights. Practical applications. No fluff.
              </p>
              <NewsletterForm location="sidebar" />
              <p className={styles.stickySidebarNote}>1,000+ subscribers. Free.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* BOTTOM CTA - Full width subscribe section */}
      <section className={styles.bottomCta}>
        <div className={styles.bottomCtaInner}>
          <p className={styles.bottomCtaEyebrow}>Never miss an issue</p>
          <h2 className={styles.bottomCtaHeading}>Join 1,000+ subscribers who read Mindset Matters every week.</h2>
          <p className={styles.bottomCtaDesc}>
            The newsletter subscribers actually look forward to. Performance psychology that lands, every Sunday. No fluff. Unsubscribe in one click.
          </p>
          <NewsletterForm location="bottom" />
        </div>
      </section>

      {/* MINDSET MATTERS LIVE */}
      <section className={styles.live}>
        <div className={styles.liveInner}>
          <p className={styles.liveEyebrow}>Go Deeper</p>
          <h2 className={styles.liveHeading}>MINDSET MATTERS LIVE</h2>
          <p className={styles.liveDesc}>A closed community for those who want more than a weekly email.</p>
          <div className={styles.liveDetails}>
            <div className={styles.liveDetail}>Bi-weekly live calls with Chris. Direct access.</div>
            <div className={styles.liveDetail}>Q&A every session. Your questions, answered.</div>
            <div className={styles.liveDetail}>Private WhatsApp group. Intimate, always accessible.</div>
            <div className={styles.liveDetail}>Exclusive frameworks, case studies, and resources.</div>
          </div>
          <a href="#live-join" className="btn btn--primary">Join Mindset Matters Live</a>
        </div>
      </section>
    </>
  );
}
