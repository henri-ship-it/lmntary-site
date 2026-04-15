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

          {/* BOTTOM CTA - Go Deeper with Limitless */}
          <div className={styles.bottomCta}>
            <div className={styles.bottomCtaContent}>
              <p className={styles.bottomCtaEyebrow}>Go Deeper</p>
              <h2 className={styles.bottomCtaHeading}>Go further with Limitless</h2>
              <p className={styles.bottomCtaDesc}>
                The frameworks in this newsletter are drawn from Limitless, a 16-week performance psychology programme built on 20+ years of applied research. Four modules covering self-awareness, mindset, habits, and performance under pressure. Understand how you operate, see what&apos;s holding you back, and build a system that works.
              </p>
              <Link href="/programmes" className={`btn btn--primary ${styles.bottomCtaBtn}`}>
                Explore Limitless
              </Link>
            </div>
          </div>

          {/* BOTTOM SUBSCRIBE */}
          <section className={styles.bottomSubscribe}>
            <div className={styles.bottomSubscribeContent}>
              <p className={styles.bottomSubscribeEyebrow}>Never miss an issue</p>
              <h2 className={styles.bottomSubscribeHeading}>Get Mindset Matters delivered every Sunday.</h2>
              <p className={styles.bottomSubscribeDesc}>
                One insight, one framework, one action step. Performance psychology you can actually use, straight to your inbox. Join 1,000+ subscribers.
              </p>
              <ArticleSidebar
                related={related.map(r => ({ slug: r.slug, tag: r.tag, title: r.title }))}
                variant="inline-subscribe"
              />
            </div>
          </section>
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
