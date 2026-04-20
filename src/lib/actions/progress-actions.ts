'use server';

import { createServerComponentClient } from '@/lib/supabase';

/**
 * Server actions for lesson progress.
 * Called from client components to sync progress to Supabase.
 * localStorage remains the primary cache for instant UI updates;
 * these actions persist to the database in the background.
 */

export async function syncLessonProgress(
  courseSlug: string,
  lessonSlug: string,
  completed: boolean
) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { synced: false, reason: 'not_authenticated' };

  const now = new Date().toISOString();

  const { error } = await supabase.from('lesson_progress').upsert(
    {
      user_id: user.id,
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      completed,
      completed_at: completed ? now : null,
      last_viewed_at: now,
      updated_at: now,
    },
    { onConflict: 'user_id,course_slug,lesson_slug' }
  );

  if (error) {
    console.error('[Progress] Sync error:', error);
    return { synced: false, reason: 'db_error' };
  }

  return { synced: true };
}

export async function syncLessonViewed(
  courseSlug: string,
  lessonSlug: string
) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { synced: false };

  const now = new Date().toISOString();

  await supabase.from('lesson_progress').upsert(
    {
      user_id: user.id,
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      last_viewed_at: now,
      updated_at: now,
    },
    { onConflict: 'user_id,course_slug,lesson_slug' }
  );

  return { synced: true };
}

/**
 * Fetch all progress for a course from Supabase.
 * Used to hydrate client-side state on page load.
 */
export async function fetchCourseProgress(courseSlug: string) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('lesson_slug, completed, completed_at, last_viewed_at')
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug);

  if (error) {
    console.error('[Progress] Fetch error:', error);
    return null;
  }

  // Convert to the same shape as localStorage CourseProgress
  const progress: Record<string, { completed: boolean; completedAt?: string; lastViewedAt: string }> = {};
  for (const row of data || []) {
    progress[row.lesson_slug] = {
      completed: row.completed,
      completedAt: row.completed_at || undefined,
      lastViewedAt: row.last_viewed_at,
    };
  }

  return progress;
}
