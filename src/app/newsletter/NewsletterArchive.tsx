'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Edition {
  id: string | number;
  slug: string;
  title: string;
  date: string;
}

const INITIAL_COUNT = 10;
const LOAD_MORE_COUNT = 10;

export default function NewsletterArchive({ editions }: { editions: Edition[] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visible = editions.slice(0, visibleCount);
  const hasMore = visibleCount < editions.length;

  return (
    <section className={styles.archive}>
      <div className={styles.archiveInner}>
        <div className={styles.archiveHeader}>
          <h2 className={styles.archiveHeading}>Past Issues</h2>
          <p className={styles.archiveCount}>{editions.length} editions</p>
        </div>
        <div className={styles.archiveList}>
          {visible.map((edition) => (
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

        {hasMore && (
          <div className={styles.loadMoreWrap}>
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
              className={styles.loadMoreBtn}
            >
              Load more
            </button>
            <p className={styles.loadMoreCount}>
              Showing {visible.length} of {editions.length}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
