'use client';

import Link from 'next/link';
import { useCourseProgress } from '@/lib/useCourseProgress';
import {
  getCompletedCount,
  getNextIncompleteLessonSlug,
  getMostRecentLessonSlug,
} from '@/lib/lesson-progress';
import styles from './page.module.css';

interface LessonItem {
  slug: string;
  title: string;
}

interface Props {
  courseSlug: string;
  courseTitle: string;
  eyebrow: string;
  isFree: boolean;
  lessons: ReadonlyArray<LessonItem>;
}

/**
 * Sidebar card on the course detail page.
 *
 * - Free courses: shows Start or Resume CTA and a "X of Y complete" counter.
 * - Paid courses: shows Enrol / Sign-in as before, with progress only revealed
 *   to users who already have local progress (enrolled + previously opened).
 *
 * The component is a client component so it can react to localStorage. To keep
 * SSR + hydration clean, it renders a neutral "Start lesson 1" state until the
 * hook reports hydrated progress.
 */
export default function CourseSidebar({
  courseSlug,
  courseTitle,
  eyebrow,
  isFree,
  lessons,
}: Props) {
  const progress = useCourseProgress(courseSlug);
  const total = lessons.length;
  const completed = getCompletedCount(progress);
  const nextIncomplete = getNextIncompleteLessonSlug(progress, lessons);
  const mostRecent = getMostRecentLessonSlug(progress);

  // Prefer the next unfinished lesson; if everything is complete, fall back to
  // the most recently viewed. If nothing's been touched, default to lesson 1.
  const resumeSlug =
    nextIncomplete ?? mostRecent ?? lessons[0]?.slug ?? null;
  const hasProgress = Object.keys(progress).length > 0;
  const allDone = total > 0 && completed === total;

  return (
    <div className={styles.sidebarCard}>
      {isFree ? (
        <>
          <div className={styles.sidebarEyebrow}>Free course</div>
          <h3 className={styles.sidebarTitle}>
            {hasProgress ? 'Continue where you left off' : 'Start for free'}
          </h3>
          <p className={styles.sidebarDesc}>
            {hasProgress
              ? allDone
                ? `All ${total} lessons complete. Revisit any time.`
                : `You've completed ${completed} of ${total} lessons. Pick up where you left off.`
              : `All ${total} lessons, fully unlocked. No account required. Read straight through or pick what you need.`}
          </p>

          {hasProgress && (
            <div className={styles.progressBlock}>
              <div
                className={styles.progressBar}
                role="progressbar"
                aria-valuenow={completed}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-label={`${completed} of ${total} lessons complete`}
              >
                <div
                  className={styles.progressFill}
                  style={{ width: `${(completed / total) * 100}%` }}
                />
              </div>
              <div className={styles.progressMeta}>
                {completed} of {total} complete
              </div>
            </div>
          )}

          {resumeSlug && (
            <Link
              href={`/learn/${courseSlug}/${resumeSlug}`}
              className={`btn btn--primary ${styles.sidebarBtn}`}
            >
              {hasProgress
                ? allDone
                  ? 'Revisit lesson 1'
                  : 'Resume course'
                : 'Start lesson 1'}
            </Link>
          )}
        </>
      ) : (
        <>
          <div className={styles.sidebarEyebrow}>{eyebrow}</div>
          <h3 className={styles.sidebarTitle}>
            {hasProgress
              ? allDone
                ? `All ${total} lessons complete`
                : 'Continue where you left off'
              : `Enrol in ${courseTitle}`}
          </h3>
          <p className={styles.sidebarDesc}>
            {hasProgress
              ? allDone
                ? 'Revisit any lesson. Your progress stays saved on this device.'
                : `You've completed ${completed} of ${total} lessons so far.`
              : 'One-time payment. Lifetime access to all lessons. Work through at your own pace.'}
          </p>

          {hasProgress && (
            <>
              <div className={styles.progressBlock}>
                <div
                  className={styles.progressBar}
                  role="progressbar"
                  aria-valuenow={completed}
                  aria-valuemin={0}
                  aria-valuemax={total}
                  aria-label={`${completed} of ${total} lessons complete`}
                >
                  <div
                    className={styles.progressFill}
                    style={{ width: `${(completed / total) * 100}%` }}
                  />
                </div>
                <div className={styles.progressMeta}>
                  {completed} of {total} complete
                </div>
              </div>
              {resumeSlug && (
                <Link
                  href={`/learn/${courseSlug}/${resumeSlug}`}
                  className={`btn btn--primary ${styles.sidebarBtn}`}
                >
                  {allDone ? 'Revisit lessons' : 'Resume course'}
                </Link>
              )}
            </>
          )}

          {!hasProgress && (
            <Link
              href="/programmes"
              className={`btn btn--primary ${styles.sidebarBtn}`}
            >
              Enrol now
            </Link>
          )}

          <div className={styles.sidebarDivider}></div>
          <p className={styles.sidebarMember}>
            {hasProgress ? (
              <>
                Using a different device?{' '}
                <Link href="/learn/sign-in" className={styles.sidebarMemberLink}>
                  Sign in &rarr;
                </Link>
              </>
            ) : (
              <>
                Already enrolled?{' '}
                <Link href="/learn/sign-in" className={styles.sidebarMemberLink}>
                  Sign in &rarr;
                </Link>
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}
