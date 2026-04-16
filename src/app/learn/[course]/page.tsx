import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourseBySlug } from '@/lib/courses';
import CourseLessonList from './CourseLessonList';
import CourseSidebar from './CourseSidebar';
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
            <CourseLessonList
              courseSlug={course.slug}
              lessons={course.lessons.map((l) => ({
                slug: l.slug,
                title: l.title,
                summary: l.summary,
                duration: l.duration,
                access: l.access,
              }))}
            />
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <CourseSidebar
              courseSlug={course.slug}
              courseTitle={course.title}
              eyebrow={course.eyebrow}
              isFree={isFree}
              lessons={course.lessons.map((l) => ({
                slug: l.slug,
                title: l.title,
              }))}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
