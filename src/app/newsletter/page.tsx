import Link from 'next/link';
import { Metadata } from 'next';
import { getEditions } from '@/lib/kit';
import NewsletterForm from './NewsletterForm';
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

const ISSUES_PER_PAGE = 10;

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10));

  const editions = await getEditions();
  const latest = editions[0];
  const past = editions.slice(1);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(past.length / ISSUES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ISSUES_PER_PAGE;
  const pageEditions = past.slice(startIdx, startIdx + ISSUES_PER_PAGE);

  return (
    <>
      {/* HERO - Full width, above sidebar grid */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Weekly Newsletter</p>
          <h1 className={styles.heroHeading}>Mindset Matters</h1>
          <p className={styles.heroSub}>
            Performance psychology in practice. One insight, one framework, one action step. Every week.
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

          {/* ARCHIVE - Paginated list */}
          {pageEditions.length > 0 && (
            <section className={styles.archive}>
              <div className={styles.archiveInner}>
                <div className={styles.archiveHeader}>
                  <h2 className={styles.archiveHeading}>Past Issues</h2>
                  <p className={styles.archiveCount}>{editions.length} editions</p>
                </div>
                <div className={styles.archiveList}>
                  {pageEditions.map((edition) => (
                    <Link
                      key={edition.id}
                      href={`/newsletter/${edition.slug}`}
                      className={styles.archiveItem}
                    >
                      <h3 className={styles.archiveItemTitle}>{edition.title}</h3>
                      <div className={styles.archiveItemRight}>
                        <span className={styles.archiveItemDate}>{edition.date}</span>
                        <span className={styles.archiveItemArrow}>&rarr;</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <nav className={styles.pagination}>
                    {safePage > 1 && (
                      <Link
                        href={`/newsletter?page=${safePage - 1}`}
                        className={styles.paginationLink}
                      >
                        &larr; Prev
                      </Link>
                    )}
                    <div className={styles.paginationPages}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Link
                          key={p}
                          href={`/newsletter?page=${p}`}
                          className={`${styles.paginationPage} ${p === safePage ? styles.paginationPageActive : ''}`}
                        >
                          {p}
                        </Link>
                      ))}
                    </div>
                    {safePage < totalPages && (
                      <Link
                        href={`/newsletter?page=${safePage + 1}`}
                        className={styles.paginationLink}
                      >
                        Next &rarr;
                      </Link>
                    )}
                  </nav>
                )}
              </div>
            </section>
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
            One insight, one framework, one action step. Every Sunday. Performance psychology you can actually use, delivered straight to your inbox. No spam. Unsubscribe in one click.
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
