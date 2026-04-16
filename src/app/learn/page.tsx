import Link from 'next/link';
import type { Metadata } from 'next';
import { getCourses } from '@/lib/courses';
import CourseCards from './CourseCards';
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
          <CourseCards
            courses={courses.map((c) => ({
              slug: c.slug,
              title: c.title,
              tagline: c.tagline,
              eyebrow: c.eyebrow,
              lessonCount: c.lessons.length,
            }))}
          />
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
