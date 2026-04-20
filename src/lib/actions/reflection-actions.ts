'use server';

import { createServerComponentClient } from '@/lib/supabase';

/**
 * Server actions for lesson reflections.
 */

export async function saveReflection(
  courseSlug: string,
  lessonSlug: string,
  content: string,
  prompt?: string
) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { saved: false, reason: 'not_authenticated' };

  const { data, error } = await supabase.from('reflections').insert({
    user_id: user.id,
    course_slug: courseSlug,
    lesson_slug: lessonSlug,
    prompt: prompt || null,
    content,
  }).select('id, created_at').single();

  if (error) {
    console.error('[Reflection] Save error:', error);
    return { saved: false, reason: 'db_error' };
  }

  return { saved: true, id: data.id, createdAt: data.created_at };
}

export async function updateReflection(
  reflectionId: string,
  content: string
) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { updated: false };

  const { error } = await supabase
    .from('reflections')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', reflectionId)
    .eq('user_id', user.id); // RLS double-check

  if (error) {
    console.error('[Reflection] Update error:', error);
    return { updated: false };
  }

  return { updated: true };
}

export async function getReflections(
  courseSlug: string,
  lessonSlug: string
) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('reflections')
    .select('id, prompt, content, created_at, updated_at')
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .eq('lesson_slug', lessonSlug)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Reflection] Fetch error:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch the user's behavioural profile for personalised prompts.
 */
export async function getUserProfile() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('user_profiles')
    .select('dominant_style, dynamo_pct, analyst_pct, caretaker_pct, energiser_pct')
    .eq('id', user.id)
    .single();

  return data;
}
