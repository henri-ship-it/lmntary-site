import type { Metadata } from 'next';
import { createServerComponentClient } from '@/lib/supabase-server';
import QuestionnaireForm from './QuestionnaireForm';

export const metadata: Metadata = {
  title: 'Know Thyself Assessment | LMNTARY Performance',
  description:
    'Discover your behavioural style profile. 36 questions, 5 minutes. Understand how you operate.',
};

export default async function KnowThyselfPage() {
  let hasExisting = false;

  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: existing } = await supabase
        .from('know_thyself_assessments')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      hasExisting = !!existing;
    }
  } catch {
    // Supabase not configured yet — continue without auth
  }

  return <QuestionnaireForm hasExistingResults={hasExisting} />;
}
