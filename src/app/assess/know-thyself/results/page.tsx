import type { Metadata } from 'next';
import ResultsView from './ResultsView';

export const metadata: Metadata = {
  title: 'Your Behavioural Profile | LMNTARY Performance',
  description: 'Your Know Thyself behavioural style assessment results.',
};

export default function ResultsPage() {
  return (
    <ResultsView
      scores={null}
      traitScores={null}
      completedAt={null}
      firstName="there"
    />
  );
}
