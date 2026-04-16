import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLessonBySlug } from '@/lib/courses';
import LessonInteractive from './LessonInteractive';
import LessonSidebarList from './LessonSidebarList';
import styles from './page.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = getLessonBySlug(courseSlug, lessonSlug);
  if (!found) return { title: 'Not Found' };
  return {
    title: `${found.lesson.title} | ${found.course.title}`,
    description: found.lesson.summary,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const found = getLessonBySlug(courseSlug, lessonSlug);
  if (!found) notFound();

  const { course, lesson, index } = found;
  const prevLesson = index > 0 ? course.lessons[index - 1] : null;
  const nextLesson =
    index < course.lessons.length - 1 ? course.lessons[index + 1] : null;

  // Access check — for now, paid lessons show a soft gate.
  // Real auth will swap this for a JWT-cookie check.
  const locked = lesson.access === 'paid';

  return (
    <div className={styles.page}>
      {/* LESSON HEADER */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href={`/learn/${course.slug}`} className={styles.backLink}>
            &larr; {course.title}
          </Link>
          <div className={styles.headerMeta}>
            <span className={styles.headerIndex}>
              Lesson {String(index + 1).padStart(2, '0')} of{' '}
              {String(course.lessons.length).padStart(2, '0')}
            </span>
            <span className={styles.headerDuration}>{lesson.duration}</span>
          </div>
          <h1 className={styles.headerTitle}>{lesson.title}</h1>
          <p className={styles.headerSummary}>{lesson.summary}</p>
        </div>
      </header>

      {/* BODY + SIDEBAR */}
      <div className={styles.body}>
        <article className={styles.article}>
          {locked ? (
            <div className={styles.gate}>
              <div className={styles.gateLock}>&#128274;</div>
              <h2 className={styles.gateHeading}>Members only</h2>
              <p className={styles.gateDesc}>
                This lesson is part of the {course.title} programme. Enrol once for lifetime access to all {course.lessons.length} lessons, or sign in with the email address you used at checkout.
              </p>
              <div className={styles.gateActions}>
                <Link href="/programmes" className="btn btn--primary">
                  Enrol in {course.title}
                </Link>
                <Link href="/learn/sign-in" className="btn btn--secondary">
                  I&apos;m already enrolled
                </Link>
              </div>
            </div>
          ) : (
            <div className={styles.content}>
              <p>{lesson.body}</p>
            </div>
          )}

          {/* Reading-progress bar + mark-complete control */}
          <LessonInteractive
            courseSlug={course.slug}
            lessonSlug={lesson.slug}
            locked={locked}
          />

          {/* PREV / NEXT NAV */}
          {(prevLesson || nextLesson) && (
            <nav className={styles.nav}>
              {prevLesson ? (
                <Link
                  href={`/learn/${course.slug}/${prevLesson.slug}`}
                  className={styles.navPrev}
                >
                  <span className={styles.navLabel}>&larr; Previous</span>
                  <span className={styles.navTitle}>{prevLesson.title}</span>
                </Link>
              ) : (
                <span></span>
              )}
              {nextLesson ? (
                <Link
                  href={`/learn/${course.slug}/${nextLesson.slug}`}
                  className={styles.navNext}
                >
                  <span className={styles.navLabel}>Next &rarr;</span>
                  <span className={styles.navTitle}>{nextLesson.title}</span>
                </Link>
              ) : (
                <span></span>
              )}
            </nav>
          )}
        </article>

        {/* STICKY LESSON LIST */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarLabel}>{course.title}</div>
              <LessonSidebarList
                courseSlug={course.slug}
                currentLessonSlug={lesson.slug}
                lessons={course.lessons.map((l) => ({
                  slug: l.slug,
                  title: l.title,
                }))}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
