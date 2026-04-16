/**
 * Client-side lesson progress tracking.
 *
 * Stored in localStorage per-course. When server-side auth lands, this layer
 * can sync to a Kit custom field or similar without changing call sites.
 *
 * Key shape: `lmntary-progress:<course-slug>` -> CourseProgress JSON
 */

const STORAGE_PREFIX = 'lmntary-progress:';
export const PROGRESS_EVENT = 'lmntary-progress-update';

export interface LessonProgress {
  completed: boolean;
  completedAt?: string; // ISO timestamp
  lastViewedAt: string; // ISO timestamp
}

export type CourseProgress = Record<string, LessonProgress>;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function getCourseProgress(courseSlug: string): CourseProgress {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + courseSlug);
    return raw ? (JSON.parse(raw) as CourseProgress) : {};
  } catch {
    return {};
  }
}

function writeCourseProgress(courseSlug: string, next: CourseProgress): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_PREFIX + courseSlug, JSON.stringify(next));
    // Notify same-tab listeners; the 'storage' event fires cross-tab automatically.
    window.dispatchEvent(
      new CustomEvent(PROGRESS_EVENT, { detail: { courseSlug } })
    );
  } catch {
    // quota / privacy mode — swallow
  }
}

export function setLessonProgress(
  courseSlug: string,
  lessonSlug: string,
  patch: Partial<LessonProgress>
): void {
  const all = getCourseProgress(courseSlug);
  const existing: LessonProgress =
    all[lessonSlug] ?? { completed: false, lastViewedAt: '' };
  all[lessonSlug] = {
    ...existing,
    ...patch,
    lastViewedAt: new Date().toISOString(),
  };
  writeCourseProgress(courseSlug, all);
}

export function markLessonViewed(
  courseSlug: string,
  lessonSlug: string
): void {
  setLessonProgress(courseSlug, lessonSlug, {});
}

export function markLessonComplete(
  courseSlug: string,
  lessonSlug: string
): void {
  setLessonProgress(courseSlug, lessonSlug, {
    completed: true,
    completedAt: new Date().toISOString(),
  });
}

export function markLessonIncomplete(
  courseSlug: string,
  lessonSlug: string
): void {
  setLessonProgress(courseSlug, lessonSlug, {
    completed: false,
    completedAt: undefined,
  });
}

export function isLessonComplete(
  progress: CourseProgress,
  lessonSlug: string
): boolean {
  return progress[lessonSlug]?.completed === true;
}

export function getCompletedCount(progress: CourseProgress): number {
  return Object.values(progress).filter((p) => p.completed).length;
}

export function getNextIncompleteLessonSlug(
  progress: CourseProgress,
  allLessons: ReadonlyArray<{ slug: string }>
): string | null {
  const lesson = allLessons.find((l) => !progress[l.slug]?.completed);
  return lesson?.slug ?? null;
}

/**
 * The lesson the user most recently viewed. Used to pick a "Resume" target
 * when no incomplete-next exists, or to prefer continuing over restarting.
 */
export function getMostRecentLessonSlug(
  progress: CourseProgress
): string | null {
  const entries = Object.entries(progress);
  if (entries.length === 0) return null;
  entries.sort((a, b) =>
    (b[1].lastViewedAt || '').localeCompare(a[1].lastViewedAt || '')
  );
  return entries[0][0];
}
