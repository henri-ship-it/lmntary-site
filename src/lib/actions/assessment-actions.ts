'use server';

import { createServerComponentClient } from '@/lib/supabase-server';
import { calculateScores, getTraitBreakdown } from '@/lib/know-thyself-data';
import type { StyleScores } from '@/lib/know-thyself-data';

export interface AssessmentResult extends StyleScores {
  traitScores: Record<string, number>;
}

/**
 * Save Know Thyself assessment answers, compute scores, store in Supabase,
 * and return the computed results so the client can redirect to the results page.
 */
export async function submitKnowThyself(
  answers: Record<number, number>
): Promise<{ success: boolean; error?: string; scores?: StyleScores }> {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'You must be signed in to take the assessment.' };
  }

  // Calculate scores
  const scores = calculateScores(answers);
  const breakdown = getTraitBreakdown(answers);

  // Build trait scores object (question id → score)
  const traitScores: Record<string, number> = {};
  for (const [, items] of Object.entries(breakdown)) {
    for (const item of items) {
      traitScores[`q${item.id}`] = item.score;
    }
  }

  // Upsert into know_thyself_assessments
  const { error: insertError } = await supabase
    .from('know_thyself_assessments')
    .upsert(
      {
        user_id: user.id,
        email: user.email || '',
        dynamo_pct: scores.dynamo_pct,
        analyst_pct: scores.analyst_pct,
        caretaker_pct: scores.caretaker_pct,
        energiser_pct: scores.energiser_pct,
        dominant_style: scores.dominant_style,
        trait_scores: traitScores,
        raw_payload: { answers, source: 'in_house', version: '1.0' },
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (insertError) {
    console.error('[Know Thyself] Insert error:', insertError);
    // Fallback: try insert without upsert (if no unique constraint on user_id)
    const { error: fallbackError } = await supabase
      .from('know_thyself_assessments')
      .insert({
        user_id: user.id,
        email: user.email || '',
        dynamo_pct: scores.dynamo_pct,
        analyst_pct: scores.analyst_pct,
        caretaker_pct: scores.caretaker_pct,
        energiser_pct: scores.energiser_pct,
        dominant_style: scores.dominant_style,
        trait_scores: traitScores,
        raw_payload: { answers, source: 'in_house', version: '1.0' },
        completed_at: new Date().toISOString(),
      });

    if (fallbackError) {
      console.error('[Know Thyself] Fallback insert error:', fallbackError);
      return { success: false, error: 'Failed to save your assessment. Please try again.' };
    }
  }

  // Update user_profiles with style data
  await supabase
    .from('user_profiles')
    .update({
      dominant_style: scores.dominant_style,
      dynamo_pct: scores.dynamo_pct,
      analyst_pct: scores.analyst_pct,
      caretaker_pct: scores.caretaker_pct,
      energiser_pct: scores.energiser_pct,
      know_thyself_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  return { success: true, scores };
}

/**
 * Fetch the user's Know Thyself results from Supabase.
 */
export async function getKnowThyselfResults(): Promise<{
  scores: StyleScores | null;
  traitScores: Record<string, number> | null;
  completedAt: string | null;
}> {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { scores: null, traitScores: null, completedAt: null };
  }

  const { data } = await supabase
    .from('know_thyself_assessments')
    .select('dynamo_pct, analyst_pct, caretaker_pct, energiser_pct, dominant_style, trait_scores, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single();

  if (!data) {
    return { scores: null, traitScores: null, completedAt: null };
  }

  return {
    scores: {
      dynamo_pct: data.dynamo_pct as number,
      analyst_pct: data.analyst_pct as number,
      caretaker_pct: data.caretaker_pct as number,
      energiser_pct: data.energiser_pct as number,
      dominant_style: data.dominant_style as string,
    },
    traitScores: (data.trait_scores as Record<string, number>) || null,
    completedAt: data.completed_at as string | null,
  };
}
