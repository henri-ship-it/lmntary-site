'use client';

import Link from 'next/link';
import { useCourseProgress } from '@/lib/useCourseProgress';
import styles from './page.module.css';

interface LessonItem {
  slug: string;
  title: string;
}

interface Props {
  courseSlug: string;
  currentLessonSlug: string;
  lessons: ReadonlyArray<LessonItem>;
}

/**
 * The sticky lesson-list sidebar on a lesson page. Renders a checkmark in place
 * of the lesson number once the user has completed that lesson. Reactive —
 * updates immediately when another tab or the active lesson marks progress.
 */
export default function LessonSidebarList({
  courseSlug,
  currentLessonSlug,
  lessons,
}: Props) {
  const progress = useCourseProgress(courseSlug);

  return (
    <ol className={styles.sidebarList}>
      {lessons.map((l, i) => {
        const isCurrent = l.slug === currentLessonSlug;
        const isDone = progress[l.slug]?.completed === true;
        return (
          <li key={l.slug}>
            <Link
              href={`/learn/${courseSlug}/${l.slug}`}
              className={`${styles.sidebarItem} ${
                isCurrent ? styles.sidebarItemActive : ''
              } ${isDone ? styles.sidebarItemDone : ''}`}
            >
              <span className={styles.sidebarItemIndex} aria-hidden="true">
                {isDone ? '\u2713' : String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.sidebarItemTitle}>{l.title}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
