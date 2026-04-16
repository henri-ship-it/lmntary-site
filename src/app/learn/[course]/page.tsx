import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourseBySlug } from '@/lib/courses';
import styles from './page.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course: courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  if (!course) return { title: 'Not Found' };
  return {
    title: `${course.title} | LMNTARY Performance`,
    description: course.tagline,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  if (!course) notFound();

  const isFree = course.price === null;

  return (
    <>
      {/* COURSE HEADER */}
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/learn" className={styles.backLink}>
            &larr; All courses
          </Link>
          <div className={styles.headerMeta}>
            <span className={styles.headerBadge}>{course.eyebrow}</span>
            <span className={styles.headerLessons}>
              {course.lessons.length} lessons
            </span>
          </div>
          <h1 className={styles.headerTitle}>{course.title}</h1>
          <p className={styles.headerTagline}>{course.tagline}</p>
        </div>
      </section>

      {/* BODY + SIDEBAR */}
      <div className={styles.body}>
        <div className={styles.main}>
          <div className={styles.aboutBlock}>
            <h2 className={styles.aboutHeading}>About this course</h2>
            <p className={styles.aboutText}>{course.description}</p>
          </div>

          <div className={styles.lessonsBlock}>
            <h2 className={styles.lessonsHeading}>Lessons</h2>
            <ol className={styles.lessonsList}>
              {course.lessons.map((lesson, i) => {
                const locked = lesson.access === 'paid';
                const n = String(i + 1).padStart(2, '0');
                return (
                  <li key={lesson.slug} className={styles.lessonItem}>
                    <Link
                      href={`/learn/${course.slug}/${lesson.slug}`}
                      className={styles.lessonLink}
                    >
                      <span className={styles.lessonIndex}>{n}</span>
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
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <div className={styles.sidebarCard}>
              {isFree ? (
                <>
                  <div className={styles.sidebarEyebrow}>Free course</div>
                  <h3 className={styles.sidebarTitle}>Start for free</h3>
                  <p className={styles.sidebarDesc}>
                    All {course.lessons.length} lessons, fully unlocked. No account required. Read straight through or pick what you need.
                  </p>
                  <Link
                    href={`/learn/${course.slug}/${course.lessons[0].slug}`}
                    className="btn btn--primary"
                  >
                    Start lesson 1
                  </Link>
                </>
              ) : (
                <>
                  <div className={styles.sidebarEyebrow}>{course.eyebrow}</div>
                  <h3 className={styles.sidebarTitle}>Enrol in {course.title}</h3>
                  <p className={styles.sidebarDesc}>
                    One-time payment. Lifetime access to all lessons. Work through at your own pace.
                  </p>
                  <Link
                    href="/programmes"
                    className={`btn btn--primary ${styles.sidebarBtn}`}
                  >
                    Enrol now
                  </Link>
                  <div className={styles.sidebarDivider}></div>
                  <p className={styles.sidebarMember}>
                    Already enrolled?{' '}
                    <Link href="/learn/sign-in" className={styles.sidebarMemberLink}>
                      Sign in &rarr;
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
