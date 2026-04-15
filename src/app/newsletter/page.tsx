import Link from 'next/link';
import { Metadata } from 'next';
import NewsletterForm from './NewsletterForm';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Mindset Matters | LMNTARY Performance',
  description:
    'Weekly performance insights. Practical applications. No fluff. Join 1,000+ subscribers.',
};

const editions = [
  {
    slug: 'the-overthinking-trap',
    date: 'March 28, 2026',
    title: 'The Overthinking Trap',
    desc: 'How paralysis by analysis kills momentum and what to do instead.',
    tag: 'Mindset',
  },
  {
    slug: 'why-most-goals-fail',
    date: 'March 21, 2026',
    title: 'Why Most Goals Fail (And What to Do Instead)',
    desc: 'The missing element in goal-setting that separates achievers from dreamers.',
    tag: 'Framework',
  },
  {
    slug: 'between-stimulus-and-response',
    date: 'March 14, 2026',
    title: 'Between Stimulus and Response',
    desc: 'The space where all your power lives. How to expand it.',
    tag: 'Mindset',
  },
  {
    slug: 'the-power-of-reframing',
    date: 'March 7, 2026',
    title: 'The Power of Reframing',
    desc: 'Your circumstances don\'t change. Your relationship to them does.',
    tag: 'Performance',
  },
  {
    slug: 'self-awareness-is-not-improvement',
    date: 'February 28, 2026',
    title: 'Self-Awareness Is Not Self-Improvement',
    desc: 'Know thyself. But knowing and doing are two very different things.',
    tag: 'Framework',
  },
  {
    slug: 'the-competence-confidence-gap',
    date: 'February 21, 2026',
    title: 'The Competence-Confidence Gap',
    desc: 'Why the most capable people often feel the least confident. And what to do about it.',
    tag: 'Mindset',
  },
  {
    slug: 'deliberate-practice',
    date: 'February 14, 2026',
    title: 'Deliberate Practice vs Just Showing Up',
    desc: 'Not all practice is equal. The gap between repetition and improvement.',
    tag: 'Performance',
  },
  {
    slug: 'your-operating-system',
    date: 'February 7, 2026',
    title: 'Your Operating System',
    desc: 'You run on patterns you didn\'t choose. Here\'s how to see them.',
    tag: 'Framework',
  },
];

export default function NewsletterPage() {
  return (
    <>
      {/* HERO - Compact, punchy */}
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

      {/* LATEST ISSUE - Featured */}
      <section className={styles.latest}>
        <div className={styles.latestInner}>
          <p className={styles.latestLabel}>Latest Issue</p>
          <Link href={`/newsletter/${editions[0].slug}`} className={styles.latestCard}>
            <div className={styles.latestMeta}>
              <span className={styles.latestTag}>{editions[0].tag}</span>
              <span className={styles.latestDate}>{editions[0].date}</span>
            </div>
            <h2 className={styles.latestTitle}>{editions[0].title}</h2>
            <p className={styles.latestDesc}>{editions[0].desc}</p>
            <span className={styles.latestRead}>Read this issue &rarr;</span>
          </Link>
        </div>
      </section>

      {/* ARCHIVE - Clean list */}
      <section className={styles.archive}>
        <div className={styles.archiveInner}>
          <div className={styles.archiveHeader}>
            <h2 className={styles.archiveHeading}>Past Issues</h2>
            <p className={styles.archiveCount}>{editions.length} editions</p>
          </div>
          <div className={styles.archiveList}>
            {editions.slice(1).map((edition) => (
              <Link
                key={edition.slug}
                href={`/newsletter/${edition.slug}`}
                className={styles.archiveItem}
              >
                <div className={styles.archiveItemLeft}>
                  <span className={styles.archiveItemTag}>{edition.tag}</span>
                  <h3 className={styles.archiveItemTitle}>{edition.title}</h3>
                  <p className={styles.archiveItemDesc}>{edition.desc}</p>
                </div>
                <div className={styles.archiveItemRight}>
                  <span className={styles.archiveItemDate}>{edition.date}</span>
                  <span className={styles.archiveItemArrow}>&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.bottomCta}>
        <div className={styles.bottomCtaInner}>
          <h2 className={styles.bottomCtaHeading}>Join 1,000+ subscribers</h2>
          <p className={styles.bottomCtaDesc}>
            Weekly frameworks, case studies, and practical applications. No spam. Unsubscribe in one click.
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
