'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TRAIT_QUESTIONS,
  QUESTION_ORDER,
  RATING_LABELS,
} from '@/lib/know-thyself-data';
import { submitKnowThyself } from '@/lib/actions/assessment-actions';
import styles from './page.module.css';

interface Props {
  hasExistingResults: boolean;
}

export default function QuestionnaireForm({ hasExistingResults }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  const questionsById = Object.fromEntries(
    TRAIT_QUESTIONS.map((q) => [q.id, q])
  );
  const orderedQuestions = QUESTION_ORDER.map((id) => questionsById[id]);

  const answeredCount = Object.keys(answers).length;
  const total = TRAIT_QUESTIONS.length;
  const allAnswered = answeredCount === total;
  const progressPct = Math.round((answeredCount / total) * 100);

  const handleSelect = useCallback((questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;

    setSubmitting(true);
    setLoadingStep(0);

    // Animated loading steps
    const stepTimers = [
      setTimeout(() => setLoadingStep(1), 800),
      setTimeout(() => setLoadingStep(2), 2000),
      setTimeout(() => setLoadingStep(3), 3200),
    ];

    const result = await submitKnowThyself(answers);

    stepTimers.forEach(clearTimeout);

    if (result.success) {
      setLoadingStep(4);
      await new Promise((r) => setTimeout(r, 600));
      router.push('/assess/know-thyself/results');
    } else {
      setSubmitting(false);
      alert(result.error || 'Something went wrong. Please try again.');
    }
  };

  // Auto-scroll to next unanswered question after selecting
  useEffect(() => {
    if (answeredCount === 0 || answeredCount >= total) return;

    const nextUnanswered = orderedQuestions.find((q) => !(q.id in answers));
    if (nextUnanswered) {
      const el = document.getElementById(`q-${nextUnanswered.id}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answeredCount]);

  return (
    <div className={styles.page}>
      {/* Loading overlay */}
      {submitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingTitle}>Analysing Your Profile</div>
          <div className={styles.loadingSub}>
            Building your personalised behavioural report
          </div>
          <div className={styles.loadingBar}>
            <div className={styles.loadingBarFill} />
          </div>
          <ul className={styles.loadingSteps}>
            {[
              'Scoring 36 behavioural traits',
              'Mapping your style profile',
              'Identifying your dominant pattern',
              'Generating insights',
            ].map((step, i) => (
              <li
                key={i}
                className={styles.loadingStep}
                data-active={loadingStep === i ? 'true' : undefined}
                data-done={loadingStep > i ? 'true' : undefined}
              >
                <span className={styles.loadingCheck}>
                  {loadingStep > i ? '✓' : loadingStep === i ? '○' : '·'}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <p className={styles.headerEyebrow}>Behavioural Assessment</p>
        <h1 className={styles.headerTitle}>Know Thyself</h1>
        <p className={styles.headerSub}>
          36 statements. Rate how strongly each describes you. Takes about 5
          minutes. Answer instinctively.
        </p>
        {hasExistingResults && (
          <div className={styles.existingBanner}>
            You&apos;ve already taken this assessment.{' '}
            <Link href="/assess/know-thyself/results">View your results</Link>{' '}
            or retake it below to update your profile.
          </div>
        )}
      </header>

      {/* Sticky progress */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressInner}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className={styles.progressLabel}>
            {answeredCount} / {total}
          </span>
        </div>
      </div>

      {/* Questions */}
      <div className={styles.questionSection} ref={formRef}>
        {orderedQuestions.map((q, idx) => (
          <div
            key={q.id}
            id={`q-${q.id}`}
            className={styles.questionCard}
          >
            <div className={styles.questionNumber}>
              Question {String(idx + 1).padStart(2, '0')}
            </div>
            <div className={styles.questionStatement}>{q.statement}</div>
            <div className={styles.ratingGroup}>
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={styles.ratingButton}
                  data-selected={answers[q.id] === val ? 'true' : undefined}
                  onClick={() => handleSelect(q.id, val)}
                >
                  <span className={styles.ratingValue}>{val}</span>
                  <span className={styles.ratingLabel}>
                    {RATING_LABELS[val]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Submit */}
        <div className={styles.submitWrapper}>
          <button
            type="button"
            className={styles.submitButton}
            disabled={!allAnswered || submitting}
            onClick={handleSubmit}
          >
            {submitting ? 'Analysing...' : 'See My Results'}
          </button>
          {!allAnswered && (
            <p className={styles.submitNote}>
              Answer all {total} questions to continue ({total - answeredCount}{' '}
              remaining)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
