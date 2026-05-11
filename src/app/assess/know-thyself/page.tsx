import type { Metadata } from 'next';
import QuestionnaireForm from './QuestionnaireForm';

export const metadata: Metadata = {
  title: 'Know Thyself Assessment | LMNTARY Performance',
  description:
    'Discover your behavioural style profile. 36 questions, 5 minutes. Understand how you operate.',
};

export default function KnowThyselfPage() {
  return <QuestionnaireForm hasExistingResults={false} />;
}
