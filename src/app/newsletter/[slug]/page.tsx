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

  return (
    <div className={styles.articleLayout}>
      {/* ARTICLE HEADER */}
      <header className={styles.articleHeader}>
        <div className={styles.articleHeaderInner}>
          <Link href="/newsletter" className={styles.backLink}>&larr; Mindset Matters</Link>
          <div className={styles.articleMeta}>
            <span className={styles.articleTag}>{edition.tag}</span>
            <span className={styles.articleDate}>{edition.date}</span>
            <span className={styles.articleReadTime}>{readTime}</span>
          </div>
          <h1 className={styles.articleTitle}>{edition.title}</h1>
        </div>
      </header>

      {/* MAIN CONTENT + SIDEBAR */}
      <div className={styles.articleBody}>
        <article
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: edition.content }}
        />

        {/* STICKY SIDEBAR */}
        <ArticleSidebar related={related.map(r => ({ slug: r.slug, tag: r.tag, title: r.title }))} />
      </div>

      {/* RELATED EDITIONS (mobile: below article) */}
      {related.length > 0 && (
        <section className={styles.relatedMobile}>
          <h3 className={styles.relatedHeading}>More from Mindset Matters</h3>
          <div className={styles.relatedGrid}>
            {related.map((r) => (
              <Link key={r.id} href={`/newsletter/${r.slug}`} className={styles.relatedCard}>
                <span className={styles.relatedCardTag}>{r.tag}</span>
                <span className={styles.relatedCardTitle}>{r.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
