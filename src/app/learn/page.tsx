import Link from 'next/link';
import type { Metadata } from 'next';
import { getCourses } from '@/lib/courses';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Learn | LMNTARY Performance',
  description:
    'Self-paced performance psychology courses. Free lessons on the principles, plus the full Limitless programme for members.',
};

export default function LearnIndexPage() {
  const courses = getCourses();

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Courses</p>
          <h1 className={styles.heroHeading}>Learn</h1>
          <p className={styles.heroSub}>
            Self-paced performance psychology. Built on twenty years of applied research, distilled into lessons you can work through at your own pace.
          </p>
        </div>
      </section>

      {/* COURSES GRID */}
      <section className={styles.courses}>
        <div className={styles.coursesInner}>
          <div className={styles.coursesGrid}>
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/learn/${course.slug}`}
                className={styles.courseCard}
              >
                <div className={styles.courseCardBadge}>{course.eyebrow}</div>
                <h2 className={styles.courseCardTitle}>{course.title}</h2>
                <p className={styles.courseCardTagline}>{course.tagline}</p>
                <div className={styles.courseCardMeta}>
                  <span>{course.lessons.length} lessons</span>
                  <span className={styles.courseCardDot}></span>
                  <span>Self-paced</span>
                </div>
                <span className={styles.courseCardLink}>View course &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBER AREA NOTE */}
      <section className={styles.memberNote}>
        <div className={styles.memberNoteInner}>
          <p className={styles.memberNoteEyebrow}>Members</p>
          <h2 className={styles.memberNoteHeading}>Already enrolled in Limitless?</h2>
          <p className={styles.memberNoteDesc}>
            Access your lessons by signing in with the email address you used at checkout. We&apos;ll send you a one-time link — no passwords to remember.
          </p>
          <Link href="/learn/sign-in" className="btn btn--secondary">
            Sign in with email
          </Link>
        </div>
      </section>
    </>
  );
}
