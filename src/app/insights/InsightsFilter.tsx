'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface InsightItem {
  id: number;
  category: string;
  tag: string;
  title: string;
  description: string;
  date: string;
}

const insightItems: InsightItem[] = [
  {
    id: 1,
    category: 'mindset',
    tag: 'Mindset',
    title: "Turbulence Isn't a Problem. It's a Gift.",
    description:
      'The best performers don\'t avoid pressure. They reframe it. A framework for turning discomfort into advantage.',
    date: 'April 12, 2026',
  },
  {
    id: 2,
    category: 'performance',
    tag: 'Performance',
    title: 'The Myth of Motivation. Why Flow States Matter More.',
    description:
      'Motivation gets you started. Flow keeps you going. Here\'s how to engineer the conditions for deep work.',
    date: 'April 9, 2026',
  },
  {
    id: 3,
    category: 'frameworks',
    tag: 'Framework',
    title: 'Know Thyself Before You Build Thyself.',
    description:
      'Self-awareness is the foundation of every performance breakthrough. Here\'s how to map your blind spots.',
    date: 'April 5, 2026',
  },
  {
    id: 4,
    category: 'mindset',
    tag: 'Mindset',
    title: 'Between Stimulus and Response.',
    description:
      'Most people never learn this space exists. It\'s where all real change begins. A step-by-step guide to finding yours.',
    date: 'April 2, 2026',
  },
  {
    id: 5,
    category: 'performance',
    tag: 'Performance',
    title: 'The Overthinking Trap. How to Move from Analysis to Action.',
    description:
      'Clarity doesn\'t require perfect information. It requires a decision. Learn the framework that separates thinkers from doers.',
    date: 'March 29, 2026',
  },
  {
    id: 6,
    category: 'frameworks',
    tag: 'Framework',
    title: 'Deliberate Practice. The Science of Getting Better.',
    description:
      'Not all practice is equal. The gap between showing up and actually improving is bigger than you think. Here\'s how to close it.',
    date: 'March 26, 2026',
  },
  {
    id: 7,
    category: 'mindset',
    tag: 'Mindset',
    title: 'Why Self-Awareness Is the Foundation of Every Breakthrough.',
    description:
      'You can\'t change what you don\'t see. The uncomfortable truth about personal growth and why blind spots are your biggest barrier.',
    date: 'March 23, 2026',
  },
  {
    id: 8,
    category: 'frameworks',
    tag: 'Framework',
    title: 'The Four Elements of Sustained Performance.',
    description:
      'Short-term results come from effort. Long-term excellence comes from systems. Here are the four non-negotiable elements.',
    date: 'March 20, 2026',
  },
  {
    id: 9,
    category: 'performance',
    tag: 'Performance',
    title: 'Reframing Pressure. From Threat to Opportunity.',
    description:
      'Your body\'s response to pressure is the same as joy. The difference is what you tell yourself about it. Here\'s how to reframe.',
    date: 'March 17, 2026',
  },
  {
    id: 10,
    category: 'newsletter',
    tag: 'Newsletter',
    title: 'Weekly Digest. Building Consistency in Chaos.',
    description:
      'When everything feels urgent, nothing feels important. How to protect your attention and build the habits that matter.',
    date: 'March 14, 2026',
  },
  {
    id: 11,
    category: 'case-studies',
    tag: 'Case Study',
    title: "From Paralysis to Clarity. Lewis Hudd's Story.",
    description:
      'A business owner couldn\'t make decisions. Overthinking and self-doubt were costing him millions. Here\'s how he shifted from analysis to action.',
    date: 'March 11, 2026',
  },
  {
    id: 12,
    category: 'case-studies',
    tag: 'Case Study',
    title: "Finding Smarter Solutions. Jenz Robinson's Journey.",
    description:
      'A founder was forcing everything. The breakthrough came when she learned to find smarter solutions instead. What changed and why it matters.',
    date: 'March 8, 2026',
  },
];

const filters = ['all', 'mindset', 'performance', 'frameworks', 'case-studies', 'newsletter'];

export default function InsightsFilter() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCards = insightItems.filter(
    (item) => activeFilter === 'all' || item.category === activeFilter
  );

  return (
    <>
      {/* FILTER TABS */}
      <section className={styles.filters}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterPill} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === 'case-studies' ? 'Case Studies' : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </section>

      {/* CONTENT CARDS */}
      <section className={styles.insightsSection}>
        <div className="container">
          <div className={styles.insightsGrid}>
            {filteredCards.map((item) => (
              <a key={item.id} href="#" className={styles.insightCard}>
                <div className={styles.insightCardTag}>{item.tag}</div>
                <div className={styles.insightCardTitle}>{item.title}</div>
                <p className={styles.insightCardDesc}>{item.description}</p>
                <div className={styles.insightCardDate}>{item.date}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
