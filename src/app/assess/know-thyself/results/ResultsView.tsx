'use client';

import { useState, useEffect } from 'react';
import {
  DIMENSIONS,
  type DiagnosticScores,
  type DimensionKey,
} from '@/lib/diagnostic-data';
import styles from './page.module.css';

interface Props {
  scores: DiagnosticScores | null;
}

export default function ResultsView({ scores: serverScores }: Props) {
  const [scores, setScores] = useState<DiagnosticScores | null>(serverScores);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!scores) {
      try {
        const saved = sessionStorage.getItem('diagnosticResults');
        if (saved) {
          const data = JSON.parse(saved);
          setScores(data.scores);
        }
      } catch {
        // ignore
      }
    }
    setReady(true);
  }, [scores]);

  if (!ready) return null;

  if (!scores) {
    return (
      <div className={styles.page}>
        <div className={styles.noResults}>
          <h1 className={styles.noResultsTitle}>No Diagnostic Data Found</h1>
          <p className={styles.noResultsDesc}>
            Complete the Performance Diagnostic to see your results.
          </p>
          <a href="/assess/know-thyself" className={styles.noResultsCta}>
            Start Diagnostic
          </a>
        </div>
      </div>
    );
  }

  const dimensions: { key: DimensionKey; score: number }[] = [
    { key: 'CL', score: scores.CL },
    { key: 'MI', score: scores.MI },
    { key: 'EN', score: scores.EN },
    { key: 'MO', score: scores.MO },
  ];

  const getScoreLabel = (pct: number) => {
    if (pct >= 80) return 'OPTIMAL';
    if (pct >= 60) return 'FUNCTIONAL';
    if (pct >= 40) return 'COMPROMISED';
    return 'CRITICAL';
  };

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return '#1d1d1f';
    if (pct >= 60) return '#666';
    if (pct >= 40) return '#c0392b';
    return '#e74c3c';
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    // TODO: Wire to Supabase / email service
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.resultsContainer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerBadge}>DIAGNOSTIC COMPLETE</div>
          <h1 className={styles.headerTitle}>Performance Profile</h1>
          <div className={styles.overallScore}>
            <span className={styles.overallNumber}>{scores.overall}</span>
            <span className={styles.overallLabel}>Overall Performance Index</span>
          </div>
        </div>

        {/* Dimension Bars */}
        <div className={styles.dimensionGrid}>
          {dimensions.map(({ key, score }) => {
            const dim = DIMENSIONS[key];
            const label = getScoreLabel(score);
            const isWeakest = key === scores.weakest;

            return (
              <div
                key={key}
                className={styles.dimensionCard}
                data-weakest={isWeakest ? 'true' : undefined}
              >
                <div className={styles.dimHeader}>
                  <span className={styles.dimCode}>{key}</span>
                  <span className={styles.dimName}>{dim.label}</span>
                  <span
                    className={styles.dimStatus}
                    style={{ color: getScoreColor(score) }}
                  >
                    {label}
                  </span>
                </div>
                <div className={styles.dimBarTrack}>
                  <div
                    className={styles.dimBarFill}
                    style={{
                      width: `${score}%`,
                      background: getScoreColor(score),
                    }}
                  />
                </div>
                <div className={styles.dimScore}>{score}%</div>
                {isWeakest && (
                  <div className={styles.dimFlag}>▸ Primary area of concern</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Weakest dimension insight */}
        <div className={styles.insightTeaser}>
          <div className={styles.insightLabel}>PRELIMINARY FINDING</div>
          <p className={styles.insightText}>
            {DIMENSIONS[scores.weakest].lowScoreInsight}
          </p>
        </div>

        {/* Email gate */}
        <div className={styles.emailGate}>
          {!submitted ? (
            <>
              <div className={styles.gateLabel}>FULL REPORT</div>
              <h2 className={styles.gateTitle}>
                Get your detailed diagnostic report
              </h2>
              <p className={styles.gateDesc}>
                Receive a personalised breakdown of all four dimensions with
                specific recommendations for your profile.
              </p>
              <form onSubmit={handleEmailSubmit} className={styles.gateForm}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.gateInput}
                  required
                />
                <button
                  type="submit"
                  className={styles.gateButton}
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send My Report'}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.gateSuccess}>
              <div className={styles.gateSuccessIcon}>✓</div>
              <h3 className={styles.gateSuccessTitle}>Report Sent</h3>
              <p className={styles.gateSuccessDesc}>
                Check your inbox for your full diagnostic report.
              </p>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className={styles.footerCta}>
          <div className={styles.footerLabel}>READY TO CLOSE THE GAPS?</div>
          <p className={styles.footerDesc}>
            The LMNTARY Limitless programme addresses all four performance
            dimensions through a structured system of training and coaching.
          </p>
          <a href="/learn/limitless" className={styles.footerButton}>
            Explore Limitless
          </a>
        </div>
      </div>
    </div>
  );
}
