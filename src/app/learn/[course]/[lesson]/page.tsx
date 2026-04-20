import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLessonBySlug } from '@/lib/courses';
import { createServerComponentClient } from '@/lib/supabase';
import LessonInteractive from './LessonInteractive';
import LessonSidebarList from './LessonSidebarList';
import ReflectionInput from '@/components/ReflectionInput';
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

  // Access check — paid lessons require Supabase auth.
  // Free lessons are always accessible.
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  const locked = lesson.access === 'paid' && !user;

  // Fetch user profile for personalised reflection prompts
  let dominantStyle: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('dominant_style')
      .eq('id', user.id)
      .single();
    dominantStyle = profile?.dominant_style || null;
  }

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

          {/* Reflection input (authenticated users only, unlocked lessons) */}
          {user && !locked && (
            <ReflectionInput
              courseSlug={course.slug}
              lessonSlug={lesson.slug}
              dominantStyle={dominantStyle}
            />
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
