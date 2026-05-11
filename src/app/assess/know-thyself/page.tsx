import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@/lib/supabase-server';
import QuestionnaireForm from './QuestionnaireForm';

export const metadata: Metadata = {
  title: 'Know Thyself Assessment | LMNTARY Performance',
  description:
    'Discover your behavioural style profile. 36 questions, 5 minutes. Understand how you operate.',
};

export default async function KnowThyselfPage() {
  const supabase = await createServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/learn/sign-in?redirect=/assess/know-thyself');
  }

  // Check if they already have results
  const { data: existing } = await supabase
    .from('know_thyself_assessments')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  return <QuestionnaireForm hasExistingResults={!!existing} />;
}
