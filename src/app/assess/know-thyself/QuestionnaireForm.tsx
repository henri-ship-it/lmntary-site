'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TRAIT_QUESTIONS,
  QUESTION_ORDER,
  calculateScores,
  STYLES,
  type StyleKey,
} from '@/lib/know-thyself-data';
import styles from './page.module.css';

/* ─── Wizard step types ─────────────────────────────────── */

interface QuestionStep {
  type: 'question';
  questionId: number;
}

interface InterstitialStep {
  type: 'interstitial';
  emoji: string;
  title: string;
  description: string;
  ctaLabel: string;
}

type WizardStep = QuestionStep | InterstitialStep;

/* ─── Build the step sequence ───────────────────────────── */

const LIKERT_OPTIONS = [
  { value: 1, emoji: '👎', label: 'Strongly Disagree' },
  { value: 2, emoji: '😕', label: 'Disagree' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '😊', label: 'Agree' },
  { value: 5, emoji: '👍', label: 'Strongly Agree' },
];

function buildSteps(): WizardStep[] {
  const steps: WizardStep[] = [];
  const questionsPerSection = 9;

  for (let i = 0; i < QUESTION_ORDER.length; i++) {
    steps.push({ type: 'question', questionId: QUESTION_ORDER[i] });

    // Insert interstitial after every 9 questions (except at the very end)
    if (
      (i + 1) % questionsPerSection === 0 &&
      i + 1 < QUESTION_ORDER.length
    ) {
      const sectionIndex = Math.floor(i / questionsPerSection);
      const interstitials: InterstitialStep[] = [
        {
          type: 'interstitial',
          emoji: '🔥',
          title: 'Great momentum!',
          description:
            "You're a quarter of the way through. Your answers are already painting a picture of your natural style.",
          ctaLabel: 'Keep Going',
        },
        {
          type: 'interstitial',
          emoji: '🧩',
          title: 'Halfway there!',
          description:
            "Your behavioural patterns are taking shape. The next set of questions will sharpen the picture even further.",
          ctaLabel: "Let's Continue",
        },
        {
          type: 'interstitial',
          emoji: '🚀',
          title: 'Almost done!',
          description:
            "Just one more section to go. Your unique profile is nearly complete — finish strong!",
          ctaLabel: 'Final Stretch',
        },
      ];
      if (sectionIndex < interstitials.length) {
        steps.push(interstitials[sectionIndex]);
      }
    }
  }

  return steps;
}

const WIZARD_STEPS = buildSteps();
const TOTAL_QUESTIONS = TRAIT_QUESTIONS.length;

/* ─── Component ─────────────────────────────────────────── */

interface Props {
  hasExistingResults: boolean;
}

export default function QuestionnaireForm({ hasExistingResults }: Props) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const questionsById = Object.fromEntries(
    TRAIT_QUESTIONS.map((q) => [q.id, q])
  );

  const answeredCount = Object.keys(answers).length;
  const currentStep = WIZARD_STEPS[currentStepIdx];

  // Count only question steps for the progress display
  const questionStepIndices = WIZARD_STEPS.map((s, i) =>
    s.type === 'question' ? i : -1
  ).filter((i) => i >= 0);
  const currentQuestionNumber =
    currentStep?.type === 'question'
      ? questionStepIndices.indexOf(currentStepIdx) + 1
      : null;
  const progressPct = (answeredCount / TOTAL_QUESTIONS) * 100;

  /* ─── Navigation ──────────────────────────────────────── */

  const goForward = useCallback(() => {
    setCurrentStepIdx((prev) => {
      const next = Math.min(prev + 1, WIZARD_STEPS.length - 1);
      return next;
    });
    setAnimKey((k) => k + 1);
  }, []);

  const goBack = useCallback(() => {
    setCurrentStepIdx((prev) => Math.max(prev - 1, 0));
    setAnimKey((k) => k + 1);
  }, []);

  /* ─── Answer selection (auto-advance) ─────────────────── */

  const handleSelect = useCallback(
    (questionId: number, value: number) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));

      // Auto-advance after a short delay for visual feedback
      setTimeout(() => {
        // If this was the last question, don't auto-advance past the end
        if (currentStepIdx < WIZARD_STEPS.length - 1) {
          goForward();
        }
      }, 350);
    },
    [currentStepIdx, goForward]
  );

  /* ─── Submit ──────────────────────────────────────────── */

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setLoadingStep(0);

    // Animated loading steps
    const timers = [
      setTimeout(() => setLoadingStep(1), 800),
      setTimeout(() => setLoadingStep(2), 2000),
      setTimeout(() => setLoadingStep(3), 3200),
    ];

    // Calculate scores
    const scores = calculateScores(answers);
    const traitScores: Record<string, number> = {};
    for (const q of TRAIT_QUESTIONS) {
      traitScores[`q${q.id}`] = answers[q.id] || 3;
    }

    // Store in sessionStorage
    try {
      sessionStorage.setItem(
        'knowThyselfResults',
        JSON.stringify({
          scores,
          traitScores,
          completedAt: new Date().toISOString(),
        })
      );
    } catch {
      // sessionStorage not available
    }

    timers.forEach(clearTimeout);
    setLoadingStep(4);
    await new Promise((r) => setTimeout(r, 600));
    router.push('/assess/know-thyself/results');
  }, [answers, router, submitting]);

  // Auto-submit when all questions answered on the last step
  useEffect(() => {
    if (
      answeredCount === TOTAL_QUESTIONS &&
      currentStepIdx === WIZARD_STEPS.length - 1 &&
      currentStep?.type === 'question' &&
      answers[currentStep.questionId] !== undefined &&
      !submitting
    ) {
      // Small delay so user sees their last selection
      const t = setTimeout(() => handleSubmit(), 500);
      return () => clearTimeout(t);
    }
  }, [answeredCount, currentStepIdx, currentStep, answers, submitting, handleSubmit]);

  /* ─── Keyboard navigation ─────────────────────────────── */

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!started || submitting) return;

      if (currentStep?.type === 'question') {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 5) {
          handleSelect(currentStep.questionId, num);
          return;
        }
      }

      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        goBack();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [started, submitting, currentStep, handleSelect, goBack]);

  /* ─── Render: Loading overlay ─────────────────────────── */

  if (submitting) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingEmoji}>🧬</div>
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
      </div>
    );
  }

  /* ─── Render: Intro screen ────────────────────────────── */

  if (!started) {
    return (
      <div className={styles.page}>
        <div className={styles.introScreen}>
          <div className={styles.introBadge}>
            <span>⏱</span> 5-minute assessment
          </div>
          <h1 className={styles.introTitle}>Know Thyself</h1>
          <p className={styles.introSub}>
            Discover your behavioural style profile. 36 quick questions — answer
            instinctively, there are no wrong answers.
          </p>
          <button
            className={styles.introStart}
            onClick={() => setStarted(true)}
          >
            Start Assessment
          </button>
          <p className={styles.introNote}>
            Your answers help us personalise your coaching experience. Results
            are private to you.
          </p>
          {hasExistingResults && (
            <div className={styles.existingBanner}>
              You&apos;ve already taken this assessment.{' '}
              <Link href="/assess/know-thyself/results">
                View your results
              </Link>{' '}
              or retake it below.
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─── Render: Interstitial screen ─────────────────────── */

  if (currentStep?.type === 'interstitial') {
    return (
      <div className={styles.page}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <button
            className={styles.backButton}
            onClick={goBack}
          >
            ←
          </button>
          <div className={styles.progressBarOuter}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className={styles.stepCounter}>
            {answeredCount} / {TOTAL_QUESTIONS}
          </span>
        </div>

        <div className={styles.interstitialScreen} key={animKey}>
          <div className={styles.interstitialEmoji}>{currentStep.emoji}</div>
          <h2 className={styles.interstitialTitle}>{currentStep.title}</h2>
          <p className={styles.interstitialDesc}>{currentStep.description}</p>
          <button className={styles.interstitialCta} onClick={goForward}>
            {currentStep.ctaLabel}
          </button>
        </div>
      </div>
    );
  }

  /* ─── Render: Question screen ─────────────────────────── */

  if (currentStep?.type === 'question') {
    const question = questionsById[currentStep.questionId];
    const selectedValue = answers[currentStep.questionId];
    const isLastQuestion =
      currentStepIdx === WIZARD_STEPS.length - 1 &&
      answeredCount === TOTAL_QUESTIONS - 1 &&
      selectedValue === undefined;

    return (
      <div className={styles.page}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <button
            className={styles.backButton}
            onClick={goBack}
            disabled={currentStepIdx === 0}
          >
            ←
          </button>
          <div className={styles.progressBarOuter}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className={styles.stepCounter}>
            {currentQuestionNumber} / {TOTAL_QUESTIONS}
          </span>
        </div>

        <div className={styles.questionScreen} key={animKey}>
          <h2 className={styles.questionStatement}>{question.statement}</h2>
          <p className={styles.questionHint}>How strongly does this describe you?</p>

          <div className={styles.likertRow}>
            {LIKERT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={styles.likertButton}
                data-selected={selectedValue === opt.value ? 'true' : undefined}
                onClick={() => handleSelect(question.id, opt.value)}
              >
                <span className={styles.likertEmoji}>{opt.emoji}</span>
                <span className={styles.likertLabel}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback (shouldn't reach here)
  return null;
}
