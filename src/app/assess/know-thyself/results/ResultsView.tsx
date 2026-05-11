'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  STYLES,
  TRAIT_QUESTIONS,
  type StyleKey,
  type StyleScores,
} from '@/lib/know-thyself-data';
import styles from './page.module.css';

interface Props {
  scores: StyleScores;
  traitScores: Record<string, number> | null;
  completedAt: string | null;
  firstName: string;
}

const STYLE_ORDER: StyleKey[] = ['dynamo', 'analyst', 'caretaker', 'energiser'];

function getScorePct(scores: StyleScores, key: StyleKey): number {
  return scores[`${key}_pct` as keyof StyleScores] as number;
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function generateHighlights(scores: StyleScores): { text: string; style: StyleKey }[] {
  const dominant = scores.dominant_style.toLowerCase() as StyleKey;
  const meta = STYLES[dominant];
  const highlights: { text: string; style: StyleKey }[] = [];

  highlights.push({
    text: `Your dominant style is ${meta.label} (${meta.tagline}) at ${getScorePct(scores, dominant)}%`,
    style: dominant,
  });

  // Find secondary (second highest)
  const sorted = STYLE_ORDER
    .map((k) => ({ key: k, pct: getScorePct(scores, k) }))
    .sort((a, b) => b.pct - a.pct);

  if (sorted.length > 1) {
    const second = sorted[1];
    highlights.push({
      text: `Strong secondary ${STYLES[second.key].label} tendencies at ${second.pct}%`,
      style: second.key,
    });
  }

  // Find lowest
  const lowest = sorted[sorted.length - 1];
  highlights.push({
    text: `${STYLES[lowest.key].label} is your least expressed style at ${lowest.pct}% — a growth opportunity`,
    style: lowest.key,
  });

  // Balance check
  const range = sorted[0].pct - sorted[sorted.length - 1].pct;
  if (range < 15) {
    highlights.push({
      text: 'Highly balanced profile — you adapt your style fluidly across situations',
      style: dominant,
    });
  } else if (range > 35) {
    highlights.push({
      text: `Strong style polarity — ${sorted[0].pct - sorted[sorted.length - 1].pct} point range between your highest and lowest`,
      style: dominant,
    });
  }

  return highlights;
}

function generateInsight(scores: StyleScores): string {
  const dominant = scores.dominant_style.toLowerCase() as StyleKey;
  const sorted = STYLE_ORDER
    .map((k) => ({ key: k, pct: getScorePct(scores, k) }))
    .sort((a, b) => b.pct - a.pct);

  const d = STYLES[dominant];
  const second = sorted.length > 1 ? STYLES[sorted[1].key] : null;

  let insight = d.description;

  if (second) {
    const combos: Record<string, string> = {
      'dynamo-analyst': 'Combined with your Analyst secondary, you bring both decisiveness and rigour — a potent combination for strategic leadership.',
      'dynamo-caretaker': 'Your Caretaker secondary balances your drive with genuine care for people — you push hard but keep the team with you.',
      'dynamo-energiser': 'Paired with Energiser tendencies, your leadership is both commanding and charismatic — you inspire action.',
      'analyst-dynamo': 'Your Dynamo secondary means you don\'t just plan — you execute. You combine thoroughness with decisiveness.',
      'analyst-caretaker': 'With Caretaker as your secondary, your analytical nature is warmed by empathy — you make decisions that account for people.',
      'analyst-energiser': 'Your Energiser secondary brings creativity to your structured thinking — you find innovative solutions through careful analysis.',
      'caretaker-dynamo': 'Your Dynamo secondary adds backbone to your empathy — you care deeply but aren\'t afraid to drive outcomes.',
      'caretaker-analyst': 'Combined with Analyst tendencies, your support of others is thoughtful and strategic, not just instinctive.',
      'caretaker-energiser': 'Your Energiser secondary makes your nurturing style vibrant and engaging — people are drawn to your warmth.',
      'energiser-dynamo': 'With Dynamo as your secondary, your enthusiasm has real drive behind it — you don\'t just inspire, you deliver.',
      'energiser-analyst': 'Your Analyst secondary grounds your creativity with structure — you bring ideas that are both exciting and well-thought-through.',
      'energiser-caretaker': 'Paired with Caretaker tendencies, your enthusiasm is directed toward lifting others — a natural team motivator.',
    };

    const comboKey = `${dominant}-${sorted[1].key}`;
    if (combos[comboKey]) {
      insight += ' ' + combos[comboKey];
    }
  }

  return insight;
}

export default function ResultsView({ scores, traitScores, completedAt, firstName }: Props) {
  const [activeTab, setActiveTab] = useState<StyleKey>(
    scores.dominant_style.toLowerCase() as StyleKey
  );

  const dominant = scores.dominant_style.toLowerCase() as StyleKey;
  const dominantMeta = STYLES[dominant];
  const dominantPct = getScorePct(scores, dominant);
  const highlights = generateHighlights(scores);
  const insight = generateInsight(scores);

  // Trait breakdown for current tab
  const tabQuestions = TRAIT_QUESTIONS.filter((q) => q.style === activeTab);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <p className={styles.headerEyebrow}>Know Thyself Results</p>
        <h1 className={styles.headerTitle}>{firstName}&apos;s Profile</h1>
        <p className={styles.headerSub}>
          Your behavioural style assessment — the patterns driving how you
          operate, lead, and connect.
        </p>
        {completedAt && (
          <div className={styles.headerDate}>
            Completed {formatDate(completedAt)}
          </div>
        )}
        <div className={styles.headerActions}>
          <Link href="/assess/know-thyself" className="btn btn--secondary" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
            Retake Assessment
          </Link>
          <Link href="/learn" className="btn btn--primary">
            Continue Learning
          </Link>
        </div>
      </header>

      {/* Highlights strip */}
      <div className={styles.highlights}>
        <div className={styles.highlightsCard}>
          <div className={styles.highlightsTitle}>Your Profile Highlights</div>
          <ul className={styles.highlightsList}>
            {highlights.map((h, i) => (
              <li key={i} className={styles.highlightItem} data-style={h.style}>
                {h.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.content}>
        {/* ─── Style Bars ──────────────────── */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Behavioural Profile</div>
          <div className={styles.cardTitle}>Your Four Styles</div>
          <div className={styles.cardDesc}>
            The four dimensions of your behavioural style. Higher scores
            indicate a stronger natural tendency.
          </div>
          <div className={styles.styleBars}>
            {STYLE_ORDER.map((key) => {
              const meta = STYLES[key];
              const pct = getScorePct(scores, key);
              return (
                <div key={key} className={styles.styleBarRow}>
                  <div
                    className={styles.styleBarIcon}
                    style={{ background: meta.colorLight }}
                  >
                    {meta.icon}
                  </div>
                  <div className={styles.styleBarInfo}>
                    <div className={styles.styleBarHeader}>
                      <span className={styles.styleBarName}>{meta.label}</span>
                      <span className={styles.styleBarTagline}>
                        {meta.tagline}
                      </span>
                    </div>
                    <div className={styles.styleBarTrack}>
                      <div
                        className={styles.styleBarFill}
                        style={{
                          width: `${pct}%`,
                          background: meta.color,
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.styleBarPct}>{pct}%</div>
                </div>
              );
            })}
          </div>

          {/* Insight box */}
          <div className={styles.insightBox}>
            <div className={styles.insightTitle}>What This Means</div>
            <div className={styles.insightText}>{insight}</div>
          </div>
        </div>

        {/* ─── Quadrant Visual ─────────────── */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Style Map</div>
          <div className={styles.cardTitle}>At a Glance</div>
          <div className={styles.cardDesc}>
            Your style balance across the four dimensions. Your dominant style
            is highlighted.
          </div>
          <div className={styles.quadrant}>
            <div className={styles.quadrantGrid}>
              {STYLE_ORDER.map((key) => {
                const meta = STYLES[key];
                const pct = getScorePct(scores, key);
                const isDominant = key === dominant;
                return (
                  <div
                    key={key}
                    className={styles.quadrantCell}
                    data-dominant={isDominant ? 'true' : undefined}
                    style={{ background: meta.colorLight }}
                  >
                    <div className={styles.quadrantCellIcon}>{meta.icon}</div>
                    <div className={styles.quadrantCellLabel}>{meta.label}</div>
                    <div className={styles.quadrantCellPct}>{pct}%</div>
                  </div>
                );
              })}
            </div>
            <div className={styles.quadrantNote}>
              Scores represent your natural tendency toward each style. Everyone
              is a blend — your unique combination is what makes you, you.
            </div>
          </div>
        </div>

        {/* ─── Dominant Style Deep Dive ────── */}
        <div className={`${styles.card} ${styles.dominantCard}`}>
          <div className={styles.cardLabel}>Your Dominant Style</div>
          <div className={styles.dominantIcon}>{dominantMeta.icon}</div>
          <div className={styles.cardTitle}>
            {dominantMeta.label}: {dominantMeta.tagline}
          </div>
          <div className={styles.dominantPct}>{dominantPct}%</div>
          <div className={styles.dominantDesc}>{dominantMeta.description}</div>

          <div className={styles.dominantTraits}>
            <div className={styles.traitSection}>
              <div className={styles.traitSectionLabel}>Strengths</div>
              {dominantMeta.strengths.map((s, i) => (
                <div key={i} className={styles.traitItem}>
                  {s}
                </div>
              ))}
            </div>
            <div className={styles.traitSection}>
              <div className={styles.traitSectionLabel}>Watch For</div>
              {dominantMeta.watchFor.map((w, i) => (
                <div key={i} className={styles.traitItemWarn}>
                  {w}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Trait Breakdown by Style ────── */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Trait Breakdown</div>
          <div className={styles.cardTitle}>Individual Responses</div>
          <div className={styles.cardDesc}>
            How you scored on each of the 9 traits within each style.
          </div>

          <div className={styles.tabRow}>
            {STYLE_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                className={styles.tab}
                data-active={activeTab === key ? 'true' : undefined}
                onClick={() => setActiveTab(key)}
              >
                {STYLES[key].icon} {STYLES[key].label}
              </button>
            ))}
          </div>

          <div className={styles.traitBreakdown}>
            {tabQuestions.map((q) => {
              const score = traitScores ? (traitScores[`q${q.id}`] || 3) : 3;
              const pct = (score / 5) * 100;
              const meta = STYLES[activeTab];
              return (
                <div key={q.id} className={styles.traitRow}>
                  <div className={styles.traitStatement}>{q.statement}</div>
                  <div className={styles.traitScore}>{score}/5</div>
                  <div className={styles.traitMiniBar}>
                    <div
                      className={styles.traitMiniBarFill}
                      style={{
                        width: `${pct}%`,
                        background: meta.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.insightBox} style={{ marginTop: 24 }}>
            <div className={styles.insightTitle}>
              {STYLES[activeTab].label} Summary
            </div>
            <div className={styles.insightText}>
              Your {STYLES[activeTab].label} score of{' '}
              {getScorePct(scores, activeTab)}% places you{' '}
              {getScorePct(scores, activeTab) >= 70
                ? 'in the high range — this is a core part of how you show up'
                : getScorePct(scores, activeTab) >= 40
                  ? 'in the moderate range — you draw on this style when the situation calls for it'
                  : 'in the lower range — this style doesn\'t come naturally but can be developed'}
              . {STYLES[activeTab].description.split('.')[0]}.
            </div>
          </div>
        </div>

        {/* ─── Bottom CTA ─────────────────── */}
        <div className={styles.bottomCta}>
          <Link href="/assess/know-thyself" className={styles.retakeLink}>
            Retake Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
