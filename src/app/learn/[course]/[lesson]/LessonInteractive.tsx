'use client';

import { useEffect, useState } from 'react';
import ReadingProgress from '@/components/ReadingProgress';
import { useCourseProgress } from '@/lib/useCourseProgress';
import {
  markLessonComplete,
  markLessonIncomplete,
  markLessonViewed,
} from '@/lib/lesson-progress';
import styles from './LessonInteractive.module.css';

interface Props {
  courseSlug: string;
  lessonSlug: string;
  locked: boolean;
}

/**
 * Drops the reading progress bar at the top of the page and handles progress
 * writes for this lesson:
 *   - marks "viewed" on mount (so Resume knows the last visited lesson)
 *   - auto-marks "complete" once the user has scrolled past 90% of the page
 *   - renders a manual Mark Complete / Mark Incomplete button
 *
 * Does nothing for locked (paid, not-yet-auth'd) lessons — we don't want to
 * count a gate screen as progress.
 */
export default function LessonInteractive({
  courseSlug,
  lessonSlug,
  locked,
}: Props) {
  const progress = useCourseProgress(courseSlug);
  const isComplete = progress[lessonSlug]?.completed === true;
  const [justCompleted, setJustCompleted] = useState(false);

  // Mark viewed once on mount (unlocked lessons only).
  useEffect(() => {
    if (locked) return;
    markLessonViewed(courseSlug, lessonSlug);
  }, [courseSlug, lessonSlug, locked]);

  // Auto-complete on deep scroll.
  useEffect(() => {
    if (locked || isComplete) return;

    let done = false;
    let rafId: number | null = null;

    function check() {
      rafId = null;
      if (done) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = window.scrollY / scrollable;
      if (pct >= 0.9) {
        done = true;
        markLessonComplete(courseSlug, lessonSlug);
        setJustCompleted(true);
      }
    }

    function onScroll() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(check);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    check();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [courseSlug, lessonSlug, locked, isComplete]);

  function handleToggle() {
    if (isComplete) {
      markLessonIncomplete(courseSlug, lessonSlug);
      setJustCompleted(false);
    } else {
      markLessonComplete(courseSlug, lessonSlug);
      setJustCompleted(true);
    }
  }

  return (
    <>
      <ReadingProgress />
      {!locked && (
        <div className={styles.controls}>
          <button
            type="button"
            onClick={handleToggle}
            className={`${styles.btn} ${isComplete ? styles.btnDone : ''}`}
          >
            {isComplete ? (
              <>
                <span className={styles.check} aria-hidden="true">
                  &#10003;
                </span>
                <span>Completed</span>
              </>
            ) : (
              <span>Mark as complete</span>
            )}
          </button>
          {justCompleted && (
            <span className={styles.justDone}>Nice. Progress saved.</span>
          )}
        </div>
      )}
    </>
  );
}
