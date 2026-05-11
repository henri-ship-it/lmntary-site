import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@/lib/supabase-server';
import { getKnowThyselfResults } from '@/lib/actions/assessment-actions';
import ResultsView from './ResultsView';

export const metadata: Metadata = {
  title: 'Your Behavioural Profile | LMNTARY Performance',
  description: 'Your Know Thyself behavioural style assessment results.',
};

export default async function ResultsPage() {
  const supabase = await createServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/learn/sign-in?redirect=/assess/know-thyself/results');
  }

  const { scores, traitScores, completedAt } = await getKnowThyselfResults();

  if (!scores) {
    redirect('/assess/know-thyself');
  }

  // Get user name
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  const firstName = (profile?.first_name as string) || user.email?.split('@')[0] || 'there';

  return (
    <ResultsView
      scores={scores}
      traitScores={traitScores}
      completedAt={completedAt}
      firstName={firstName}
    />
  );
}
