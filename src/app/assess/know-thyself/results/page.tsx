import type { Metadata } from 'next';
import ResultsView from './ResultsView';

export const metadata: Metadata = {
  title: 'Performance Diagnostic Results | LMNTARY',
  description: 'Your performance diagnostic results across four dimensions.',
};

export default function ResultsPage() {
  return <ResultsView scores={null} />;
}
