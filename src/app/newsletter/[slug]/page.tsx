import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ArticleSidebar from './ArticleSidebar';
import styles from './page.module.css';

interface Edition {
  slug: string;
  date: string;
  title: string;
  desc: string;
  tag: string;
  readTime: string;
  content: string[];
}

const editions: Edition[] = [
  {
    slug: 'the-overthinking-trap',
    date: 'March 28, 2026',
    title: 'The Overthinking Trap',
    desc: 'How paralysis by analysis kills momentum and what to do instead.',
    tag: 'Mindset',
    readTime: '4 min read',
    content: [
      'You know the pattern. A decision needs to be made. Not a life-altering one. Maybe it is choosing a direction for a project, having a difficult conversation, or committing to a new approach. You have enough information. You know what you would tell someone else to do. But you don\'t do it.',
      'Instead, you think about it more. You weigh the options again. You look for more data. You sleep on it. You bring it up with a friend. You sleep on it again. And the whole time, the thing that actually needed doing sits there, undone, gathering weight.',
      'This is the overthinking trap. And it is one of the most common patterns I see in high performers.',
      'Here is the uncomfortable truth: overthinking disguises itself as diligence. It feels like you are being thorough. Responsible. Careful. But what you are actually doing is avoiding the discomfort of commitment. Every moment spent deliberating is a moment spent not acting. And action is where learning happens.',
      'In performance psychology, we distinguish between productive analysis and rumination. Productive analysis has a clear purpose, a defined timeframe, and leads to a decision. Rumination is circular. It revisits the same ground without resolution. The difference is not in the content of the thinking. It is in the outcome.',
      'So how do you break the pattern?',
      'First, name it. When you catch yourself going round in circles on a decision, say it out loud: "I am overthinking this." Awareness is the first disruption. Most people never notice the pattern because it feels so natural.',
      'Second, apply the reversibility test. Ask yourself: "If I make this decision and it turns out to be wrong, can I change course?" If the answer is yes, you have permission to move. Most decisions are not permanent. Most consequences are not catastrophic. The cost of delay almost always outweighs the cost of a suboptimal choice.',
      'Third, set a decision deadline. Not a vague one. A specific time. "I will decide by 3pm today." This externalises the commitment and removes the option of indefinite deliberation.',
      'The people I work with who make the biggest shifts are not the ones who start thinking better. They are the ones who start acting sooner. Clarity does not come before action. It comes through it.',
      'Something to sit with this week: where in your life are you mistaking overthinking for preparation?',
    ],
  },
  {
    slug: 'why-most-goals-fail',
    date: 'March 21, 2026',
    title: 'Why Most Goals Fail (And What to Do Instead)',
    desc: 'The missing element in goal-setting that separates achievers from dreamers.',
    tag: 'Framework',
    readTime: '5 min read',
    content: [
      'Every January, millions of people set goals. By February, most have abandoned them. This is not a willpower problem. It is a design problem.',
      'The conventional approach to goals focuses on outcomes: lose 10kg, earn six figures, run a marathon. These are fine as destinations. But a destination without a system is just a wish.',
      'The missing element is identity. Not "what do I want to achieve?" but "who do I need to become?" The person who runs a marathon does not start with a marathon. They start by becoming someone who runs. The shift is subtle but profound.',
      'When your goals are rooted in identity rather than outcomes, every small action reinforces the person you are becoming. A 20-minute run is not a step toward a marathon. It is evidence that you are a runner. The framing changes everything.',
      'This week, take one goal you have been chasing and reframe it as an identity statement. Then ask yourself: what would that person do today?',
    ],
  },
  {
    slug: 'between-stimulus-and-response',
    date: 'March 14, 2026',
    title: 'Between Stimulus and Response',
    desc: 'The space where all your power lives. How to expand it.',
    tag: 'Mindset',
    readTime: '4 min read',
    content: [
      'There is a space between what happens to you and how you respond to it. Most people never learn it exists. They live in reaction. Something happens, and they respond on autopilot. The email lands, the mood shifts. The comment stings, the defense goes up. The pressure builds, the temper flares.',
      'This space is where all your power lives. And like any skill, it can be trained.',
      'Viktor Frankl described this space as the seat of human freedom. Between stimulus and response, there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.',
      'The challenge is that for most of us, this space has been compressed to almost nothing. We have spent years, decades, responding to the same triggers in the same way. The neural pathways are worn deep. The reactions feel automatic, inevitable, part of who we are.',
      'But they are not who you are. They are patterns you have practised. And patterns can be changed.',
      'The first step is simply to notice. This week, pay attention to one recurring trigger. Not to change it. Just to see it. That moment of awareness is the space opening up.',
    ],
  },
];

// Fallback for editions not yet fully written
function getEdition(slug: string): Edition | undefined {
  return editions.find((e) => e.slug === slug);
}

function getRelatedEditions(currentSlug: string): Edition[] {
  return editions.filter((e) => e.slug !== currentSlug).slice(0, 3);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const edition = getEdition(slug);
  if (!edition) return { title: 'Not Found' };
  return {
    title: `${edition.title} | Mindset Matters`,
    description: edition.desc,
  };
}

export default async function NewsletterArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const edition = getEdition(slug);
  if (!edition) notFound();

  const related = getRelatedEditions(slug);

  return (
    <div className={styles.articleLayout}>
      {/* ARTICLE HEADER */}
      <header className={styles.articleHeader}>
        <div className={styles.articleHeaderInner}>
          <Link href="/newsletter" className={styles.backLink}>&larr; Mindset Matters</Link>
          <div className={styles.articleMeta}>
            <span className={styles.articleTag}>{edition.tag}</span>
            <span className={styles.articleDate}>{edition.date}</span>
            <span className={styles.articleReadTime}>{edition.readTime}</span>
          </div>
          <h1 className={styles.articleTitle}>{edition.title}</h1>
          <p className={styles.articleLead}>{edition.desc}</p>
        </div>
      </header>

      {/* MAIN CONTENT + SIDEBAR */}
      <div className={styles.articleBody}>
        <article className={styles.articleContent}>
          {edition.content.map((paragraph, i) => (
            <p key={i} className={styles.articleParagraph}>{paragraph}</p>
          ))}

          {/* Article footer */}
          <div className={styles.articleFooter}>
            <div className={styles.articleAuthor}>
              <div className={styles.articleAuthorAvatar}>CB</div>
              <div>
                <div className={styles.articleAuthorName}>Chris Bodman</div>
                <div className={styles.articleAuthorRole}>Performance Psychologist</div>
              </div>
            </div>
          </div>
        </article>

        {/* STICKY SIDEBAR - Justin Welsh style */}
        <ArticleSidebar related={related} />
      </div>

      {/* RELATED EDITIONS (mobile: below article) */}
      <section className={styles.relatedMobile}>
        <h3 className={styles.relatedHeading}>More from Mindset Matters</h3>
        <div className={styles.relatedGrid}>
          {related.map((r) => (
            <Link key={r.slug} href={`/newsletter/${r.slug}`} className={styles.relatedCard}>
              <span className={styles.relatedCardTag}>{r.tag}</span>
              <span className={styles.relatedCardTitle}>{r.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
