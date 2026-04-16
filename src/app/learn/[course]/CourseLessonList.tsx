'use client';

import Link from 'next/link';
import { useCourseProgress } from '@/lib/useCourseProgress';
import styles from './page.module.css';

interface LessonItem {
  slug: string;
  title: string;
  summary: string;
  duration: string;
  access: 'free' | 'paid';
}

interface Props {
  courseSlug: string;
  lessons: ReadonlyArray<LessonItem>;
}

/**
 * Ordered lesson list on the course detail page. Replaces the index with a
 * checkmark once the lesson has been completed. Non-intrusive — falls back to
 * plain numbering on first render (before localStorage has hydrated).
 */
export default function CourseLessonList({ courseSlug, lessons }: Props) {
  const progress = useCourseProgress(courseSlug);

  return (
    <ol className={styles.lessonsList}>
      {lessons.map((lesson, i) => {
        const locked = lesson.access === 'paid';
        const isDone = progress[lesson.slug]?.completed === true;
        const n = String(i + 1).padStart(2, '0');
        return (
          <li key={lesson.slug} className={styles.lessonItem}>
            <Link
              href={`/learn/${courseSlug}/${lesson.slug}`}
              className={styles.lessonLink}
            >
              <span
                className={`${styles.lessonIndex} ${
                  isDone ? styles.lessonIndexDone : ''
                }`}
                aria-label={isDone ? 'Completed' : undefined}
              >
                {isDone ? '\u2713' : n}
              </span>
              <div className={styles.lessonCopy}>
                <h3 className={styles.lessonTitle}>
                  {lesson.title}
                  {locked && (
                    <span className={styles.lessonLock} aria-label="Members only">
                      &#128274;
                    </span>
                  )}
                </h3>
                <p className={styles.lessonSummary}>{lesson.summary}</p>
              </div>
              <span className={styles.lessonDuration}>{lesson.duration}</span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
