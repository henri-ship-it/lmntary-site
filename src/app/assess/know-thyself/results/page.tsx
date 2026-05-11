import type { Metadata } from 'next';
import { createServerComponentClient } from '@/lib/supabase-server';
import { getKnowThyselfResults } from '@/lib/actions/assessment-actions';
import ResultsView from './ResultsView';

export const metadata: Metadata = {
  title: 'Your Behavioural Profile | LMNTARY Performance',
  description: 'Your Know Thyself behavioural style assessment results.',
};

export default async function ResultsPage() {
  let serverScores = null;
  let serverTraitScores = null;
  let serverCompletedAt = null;
  let firstName = 'there';

  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const results = await getKnowThyselfResults();
      serverScores = results.scores;
      serverTraitScores = results.traitScores;
      serverCompletedAt = results.completedAt;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('first_name')
        .eq('id', user.id)
        .single();
      firstName = (profile?.first_name as string) || user.email?.split('@')[0] || 'there';
    }
  } catch {
    // Supabase not configured — results will come from sessionStorage
  }

  return (
    <ResultsView
      scores={serverScores}
      traitScores={serverTraitScores}
      completedAt={serverCompletedAt}
      firstName={firstName}
    />
  );
}
