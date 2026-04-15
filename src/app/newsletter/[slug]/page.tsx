import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getEditionBySlug, getRelatedEditions, getEditions } from '@/lib/kit';
import ArticleSidebar from './ArticleSidebar';
import styles from './page.module.css';

// Revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  if (!edition) return { title: 'Not Found' };
  return {
    title: `${edition.title} | Mindset Matters`,
    description: edition.desc,
  };
}

/**
 * Estimate read time from HTML content
 */
function estimateReadTime(html: string): string {
  const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const words = text.split(' ').length;
  const minutes = Math.max(1, Math.round(words / 230));
  return `${minutes} min read`;
}

export default async function NewsletterArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const edition = await getEditionBySlug(slug);
  if (!edition) notFound();

  const related = await getRelatedEditions(slug, 3);
  const readTime = estimateReadTime(edition.content);

  // Build share URLs
  const articleUrl = `https://lmntary-site.vercel.app/newsletter/${slug}`;
  const shareText = encodeURIComponent(edition.title);

  return (
    <div className={styles.articleLayout}>
      {/* ARTICLE HEADER */}
      <header className={styles.articleHeader}>
        <div className={styles.articleHeaderInner}>
          <Link href="/newsletter" className={styles.backLink}>&larr; Mindset Matters</Link>
          <div className={styles.articleMeta}>
            <span className={styles.articleDate}>{edition.date}</span>
            <span className={styles.articleReadTime}>{readTime}</span>
          </div>
          <h1 className={styles.articleTitle}>{edition.title}</h1>
        </div>
      </header>

      {/* MAIN CONTENT + SIDEBAR */}
      <div className={styles.articleBody}>
        <div className={styles.articleMain}>
          <article
            className={styles.articleContent}
            dangerouslySetInnerHTML={{ __html: edition.content }}
          />

          {/* ARTICLE FOOTER - Author + Divider */}
          <div className={styles.articleFooter}>
            <div className={styles.articleAuthor}>
              <div className={styles.articleAuthorAvatar}>CB</div>
              <div>
                <div className={styles.articleAuthorName}>Chris Bodman</div>
                <div className={styles.articleAuthorRole}>Performance Psychologist</div>
              </div>
            </div>
          </div>

          {/* BOTTOM CTA - "Go deeper" like Justin Welsh */}
          <div className={styles.bottomCta}>
            <div className={styles.bottomCtaLeft}>
              <h2 className={styles.bottomCtaHeading}>Go further with Limitless</h2>
              <p className={styles.bottomCtaDesc}>
                These insights are drawn from Limitless, a 16-week structured performance psychology programme. Three tiers designed to meet you where you are.
              </p>
            </div>
            <div className={styles.bottomCtaRight}>
              <div className={styles.bottomCtaTier}>
                <div className={styles.bottomCtaTierName}>Self-Led</div>
                <div className={styles.bottomCtaTierDesc}>Full programme access. Work at your own pace.</div>
              </div>
              <div className={styles.bottomCtaTier}>
                <div className={styles.bottomCtaTierName}>Guided</div>
                <div className={styles.bottomCtaTierDesc}>Programme + bi-weekly group coaching calls.</div>
              </div>
              <div className={styles.bottomCtaTier}>
                <div className={styles.bottomCtaTierName}>1:1</div>
                <div className={styles.bottomCtaTierDesc}>Private sessions with Chris. Full support.</div>
              </div>
              <Link href="/programmes" className={`btn btn--primary ${styles.bottomCtaBtn}`}>
                Explore Limitless
              </Link>
            </div>
          </div>

          {/* BOTTOM SUBSCRIBE */}
          <div className={styles.bottomSubscribe}>
            <div className={styles.bottomSubscribeLeft}>
              <h2 className={styles.bottomSubscribeHeading}>Start here.</h2>
            </div>
            <div className={styles.bottomSubscribeRight}>
              <ArticleSidebar
                related={related.map(r => ({ slug: r.slug, tag: r.tag, title: r.title }))}
                variant="inline-subscribe"
              />
            </div>
          </div>
        </div>

        {/* STICKY SIDEBAR */}
        <ArticleSidebar
          related={related.map(r => ({ slug: r.slug, tag: r.tag, title: r.title }))}
          shareUrl={articleUrl}
          shareText={edition.title}
          variant="sidebar"
        />
      </div>

      {/* RELATED EDITIONS (mobile: below article) */}
      {related.length > 0 && (
        <section className={styles.relatedMobile}>
          <h3 className={styles.relatedHeading}>More from Mindset Matters</h3>
          <div className={styles.relatedGrid}>
            {related.map((r) => (
              <Link key={r.id} href={`/newsletter/${r.slug}`} className={styles.relatedCard}>
                <span className={styles.relatedCardTitle}>{r.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
