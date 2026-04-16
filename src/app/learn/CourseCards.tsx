'use client';

import Link from 'next/link';
import { useCourseProgress } from '@/lib/useCourseProgress';
import { getCompletedCount } from '@/lib/lesson-progress';
import styles from './page.module.css';

interface CourseCardData {
  slug: string;
  title: string;
  tagline: string;
  eyebrow: string;
  lessonCount: number;
}

interface Props {
  courses: ReadonlyArray<CourseCardData>;
}

/**
 * Course cards on the /learn index. Reads per-course progress from
 * localStorage and renders a "X of Y complete" meter on any card where the
 * user has made any progress.
 */
export default function CourseCards({ courses }: Props) {
  return (
    <div className={styles.coursesGrid}>
      {courses.map((course) => (
        <CourseCard key={course.slug} course={course} />
      ))}
    </div>
  );
}

function CourseCard({ course }: { course: CourseCardData }) {
  const progress = useCourseProgress(course.slug);
  const completed = getCompletedCount(progress);
  const total = course.lessonCount;
  const hasProgress = completed > 0;
  const allDone = hasProgress && completed === total;

  return (
    <Link href={`/learn/${course.slug}`} className={styles.courseCard}>
      <div className={styles.courseCardBadge}>{course.eyebrow}</div>
      <h2 className={styles.courseCardTitle}>{course.title}</h2>
      <p className={styles.courseCardTagline}>{course.tagline}</p>
      <div className={styles.courseCardMeta}>
        <span>{total} lessons</span>
        <span className={styles.courseCardDot}></span>
        <span>Self-paced</span>
      </div>
      {hasProgress && (
        <div className={styles.courseCardProgress}>
          <div
            className={styles.courseCardProgressBar}
            role="progressbar"
            aria-valuenow={completed}
            aria-valuemin={0}
            aria-valuemax={total}
          >
            <div
              className={styles.courseCardProgressFill}
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
          <div className={styles.courseCardProgressMeta}>
            {allDone ? 'Complete' : `${completed} of ${total} complete`}
          </div>
        </div>
      )}
      <span className={styles.courseCardLink}>
        {allDone ? 'Revisit course' : hasProgress ? 'Continue' : 'View course'} &rarr;
      </span>
    </Link>
  );
}
