'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  DIAGNOSTIC_ITEMS,
  ITEM_ORDER,
  SCALE_LABELS,
  DIMENSIONS,
  SECTION_BREAKS,
  calculateDiagnosticScores,
  type DimensionKey,
} from '@/lib/diagnostic-data';
import styles from './page.module.css';

/* ─── Wizard step types ─────────────────────────────────── */

interface QuestionStep {
  type: 'question';
  itemId: number;
}

interface SectionStep {
  type: 'section';
  sectionNumber: number;
  label: string;
  dimensionKey: DimensionKey | 'ALL';
}

type WizardStep = QuestionStep | SectionStep;

/* ─── Build the step sequence ───────────────────────────── */

function buildSteps(): WizardStep[] {
  const steps: WizardStep[] = [];

  for (let i = 0; i < ITEM_ORDER.length; i++) {
    steps.push({ type: 'question', itemId: ITEM_ORDER[i] });

    // Insert section break after certain positions
    const breakDef = SECTION_BREAKS[i + 1]; // 1-indexed position
    if (breakDef && i + 1 < ITEM_ORDER.length) {
      steps.push({
        type: 'section',
        sectionNumber: breakDef.sectionNumber,
        label: breakDef.label,
        dimensionKey: breakDef.dimensionFocus as DimensionKey | 'ALL',
      });
    }
  }

  return steps;
}

const WIZARD_STEPS = buildSteps();
const TOTAL_ITEMS = DIAGNOSTIC_ITEMS.length;

/* ─── Scale options (no emoji — just numbers) ───────────── */

const SCALE_OPTIONS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const itemsById = Object.fromEntries(
    DIAGNOSTIC_ITEMS.map((q) => [q.id, q])
  );

  const answeredCount = Object.keys(answers).length;
  const currentStep = WIZARD_STEPS[currentStepIdx];

  // Count only question steps for progress
  const questionStepIndices = WIZARD_STEPS.map((s, i) =>
    s.type === 'question' ? i : -1
  ).filter((i) => i >= 0);
  const currentQuestionNumber =
    currentStep?.type === 'question'
      ? questionStepIndices.indexOf(currentStepIdx) + 1
      : null;
  const progressPct = (answeredCount / TOTAL_ITEMS) * 100;

  /* ─── Portal wrapper ──────────────────────────────────── */

  const portal = (content: React.ReactNode) => {
    if (!mounted) return null;
    return createPortal(content, document.body);
  };

  /* ─── Navigation ──────────────────────────────────────── */

  const goForward = useCallback(() => {
    setCurrentStepIdx((prev) => Math.min(prev + 1, WIZARD_STEPS.length - 1));
    setAnimKey((k) => k + 1);
  }, []);

  const goBack = useCallback(() => {
    setCurrentStepIdx((prev) => Math.max(prev - 1, 0));
    setAnimKey((k) => k + 1);
  }, []);

  /* ─── Answer selection (auto-advance) ─────────────────── */

  const handleSelect = useCallback(
    (itemId: number, value: number) => {
      setAnswers((prev) => ({ ...prev, [itemId]: value }));
      setTimeout(() => {
        if (currentStepIdx < WIZARD_STEPS.length - 1) {
          goForward();
        }
      }, 300);
    },
    [currentStepIdx, goForward]
  );

  /* ─── Submit ──────────────────────────────────────────── */

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setLoadingStep(0);

    const timers = [
      setTimeout(() => setLoadingStep(1), 600),
      setTimeout(() => setLoadingStep(2), 1400),
      setTimeout(() => setLoadingStep(3), 2200),
    ];

    const scores = calculateDiagnosticScores(answers);

    try {
      sessionStorage.setItem(
        'diagnosticResults',
        JSON.stringify({
          scores,
          answers,
          completedAt: new Date().toISOString(),
        })
      );
    } catch {
      // sessionStorage not available
    }

    timers.forEach(clearTimeout);
    setLoadingStep(4);
    await new Promise((r) => setTimeout(r, 500));
    router.push('/assess/know-thyself/results');
  }, [answers, router, submitting]);

  // Auto-submit when all answered on last step
  useEffect(() => {
    if (
      answeredCount === TOTAL_ITEMS &&
      currentStepIdx === WIZARD_STEPS.length - 1 &&
      currentStep?.type === 'question' &&
      answers[(currentStep as QuestionStep).itemId] !== undefined &&
      !submitting
    ) {
      const t = setTimeout(() => handleSubmit(), 400);
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
          handleSelect((currentStep as QuestionStep).itemId, num);
          return;
        }
      }

      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        goBack();
      }
      if (e.key === 'Enter' && currentStep?.type === 'section') {
        goForward();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [started, submitting, currentStep, handleSelect, goBack, goForward]);

  /* ─── Render: Loading overlay ─────────────────────────── */

  if (submitting) {
    return portal(
      <div className={styles.page}>
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingTitle}>Processing</div>
          <div className={styles.loadingSub}>Compiling diagnostic report</div>
          <div className={styles.loadingBar}>
            <div className={styles.loadingBarFill} />
          </div>
          <ul className={styles.loadingSteps}>
            {[
              'Scoring 20 performance indicators',
              'Mapping dimension profiles',
              'Identifying critical areas',
              'Generating report',
            ].map((step, i) => (
              <li
                key={i}
                className={styles.loadingStep}
                data-active={loadingStep === i ? 'true' : undefined}
                data-done={loadingStep > i ? 'true' : undefined}
              >
                <span className={styles.loadingCheck}>
                  {loadingStep > i ? '✓' : loadingStep === i ? '›' : '·'}
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
    return portal(
      <div className={styles.page}>
        <div className={styles.introScreen}>
          <div className={styles.introBadge}>LMNTARY Performance Lab</div>
          <h1 className={styles.introTitle}>Performance Diagnostic</h1>
          <p className={styles.introSub}>
            Identify where you're leaking performance. 20 clinical statements
            across four dimensions — answer honestly for an accurate reading.
          </p>
          <button
            className={styles.introStart}
            onClick={() => setStarted(true)}
          >
            Begin Diagnostic
          </button>
          <div className={styles.introMeta}>
            <span className={styles.introMetaItem}>20 items</span>
            <span className={styles.introMetaDot} />
            <span className={styles.introMetaItem}>~3 min</span>
            <span className={styles.introMetaDot} />
            <span className={styles.introMetaItem}>4 dimensions</span>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Render: Section break screen ────────────────────── */

  if (currentStep?.type === 'section') {
    const sectionStep = currentStep as SectionStep;
    const dim = sectionStep.dimensionKey !== 'ALL'
      ? DIMENSIONS[sectionStep.dimensionKey]
      : null;

    return portal(
      <div className={styles.page}>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={goBack}>
            ←
          </button>
          <div className={styles.progressBarOuter}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className={styles.stepCounter}>
            {answeredCount} / {TOTAL_ITEMS}
          </span>
        </div>

        <div className={styles.sectionScreen} key={animKey}>
          <div className={styles.sectionLabel}>{sectionStep.label}</div>
          {dim && (
            <>
              <h2 className={styles.sectionTitle}>{dim.label}</h2>
              <p className={styles.sectionDesc}>{dim.description}</p>
            </>
          )}
          {!dim && (
            <>
              <h2 className={styles.sectionTitle}>Final Assessment</h2>
              <p className={styles.sectionDesc}>
                The remaining items cross multiple dimensions. Answer based on
                your overall experience.
              </p>
            </>
          )}
          <button className={styles.sectionCta} onClick={goForward}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  /* ─── Render: Question screen ─────────────────────────── */

  if (currentStep?.type === 'question') {
    const item = itemsById[(currentStep as QuestionStep).itemId];
    const selectedValue = answers[item.id];

    return portal(
      <div className={styles.page}>
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
            {String(currentQuestionNumber).padStart(2, '0')} / {TOTAL_ITEMS}
          </span>
        </div>

        <div className={styles.questionScreen} key={animKey}>
          <div className={styles.questionCode}>{item.code}</div>
          <h2 className={styles.questionStatement}>{item.statement}</h2>

          <div className={styles.scaleRow}>
            {SCALE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={styles.scaleButton}
                data-selected={selectedValue === opt.value ? 'true' : undefined}
                onClick={() => handleSelect(item.id, opt.value)}
              >
                <span className={styles.scaleValue}>{opt.value}</span>
                <span className={styles.scaleLabel}>{opt.label}</span>
              </button>
            ))}
          </div>
          <div className={styles.scaleAnchors}>
            <span className={styles.scaleAnchor}>Disagree</span>
            <span className={styles.scaleAnchor}>Agree</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
