/**
 * Performance Diagnostic — pain-point assessment for lead generation.
 *
 * 20 statements, 5 per dimension. Users rate each 1–5.
 * Dimension score = sum of 5 items / (5 × 5) × 100 → percentage.
 *
 * Dimensions:
 *   SR — Stress & Recovery
 *   FE — Focus & Execution
 *   LI — Leadership & Influence
 *   SA — Self-Awareness & Regulation
 *
 * NOTE: Questions are negatively framed (pain indicators).
 * Higher agreement = higher pain = LOWER performance in that area.
 * Final "performance score" per dimension = 100 - rawPainPct.
 */

export type DimensionKey = 'SR' | 'FE' | 'LI' | 'SA';

export interface DiagnosticItem {
  id: number;
  code: string;          // e.g. "DIAG-001"
  statement: string;
  dimension: DimensionKey;
}

export interface DimensionMeta {
  key: DimensionKey;
  label: string;
  shortLabel: string;
  description: string;
  lowScoreInsight: string;   // shown when performance is low (pain is high)
  highScoreInsight: string;  // shown when performance is high (pain is low)
}

// ─── Dimension metadata ───────────────────────────────────────

export const DIMENSIONS: Record<DimensionKey, DimensionMeta> = {
  SR: {
    key: 'SR',
    label: 'Stress & Recovery',
    shortLabel: 'Stress',
    description:
      'Your capacity to manage pressure, switch off, and maintain sustainable energy levels.',
    lowScoreInsight:
      'You are showing signs of chronic stress accumulation. Your recovery patterns are insufficient for the demands you face. Without intervention, this trajectory leads to diminished output and burnout.',
    highScoreInsight:
      'Your stress management and recovery protocols are effective. You maintain energy reserves and can absorb pressure without significant performance degradation.',
  },
  FE: {
    key: 'FE',
    label: 'Focus & Execution',
    shortLabel: 'Focus',
    description:
      'Your ability to sustain attention, prioritise effectively, and deliver consistent output.',
    lowScoreInsight:
      'Your attention architecture is fragmented. You are losing significant productive capacity to context-switching, unclear priorities, and inconsistent execution rhythms.',
    highScoreInsight:
      'Your focus and execution systems are strong. You maintain clarity on priorities and deliver with consistency.',
  },
  LI: {
    key: 'LI',
    label: 'Leadership & Influence',
    shortLabel: 'Leadership',
    description:
      'Your effectiveness in communicating, influencing outcomes, and navigating interpersonal dynamics.',
    lowScoreInsight:
      'You are experiencing friction in how you communicate and lead. Unresolved interpersonal dynamics are draining cognitive resources that should be directed toward performance.',
    highScoreInsight:
      'Your communication and influence patterns are effective. You navigate interpersonal dynamics with minimal friction and energy loss.',
  },
  SA: {
    key: 'SA',
    label: 'Self-Awareness & Regulation',
    shortLabel: 'Awareness',
    description:
      'Your capacity to recognise your own patterns, manage emotional responses, and adapt behaviour deliberately.',
    lowScoreInsight:
      'You are operating with significant blind spots. Reactive patterns are overriding deliberate behaviour, limiting your ability to adapt and grow under pressure.',
    highScoreInsight:
      'Your self-awareness is well-developed. You recognise your patterns and regulate your responses effectively, even under pressure.',
  },
};

// ─── The 20 diagnostic items ──────────────────────────────────

export const DIAGNOSTIC_ITEMS: DiagnosticItem[] = [
  // ── Stress & Recovery ──
  {
    id: 1,
    code: 'DIAG-001',
    statement: 'I find it difficult to fully switch off from work, even when I want to.',
    dimension: 'SR',
  },
  {
    id: 2,
    code: 'DIAG-002',
    statement: 'I regularly feel physically or mentally drained by the end of the working day.',
    dimension: 'SR',
  },
  {
    id: 3,
    code: 'DIAG-003',
    statement: 'I push through fatigue rather than adjusting my pace or taking recovery time.',
    dimension: 'SR',
  },
  {
    id: 4,
    code: 'DIAG-004',
    statement: 'My sleep quality is frequently disrupted by work-related thoughts or anxiety.',
    dimension: 'SR',
  },
  {
    id: 5,
    code: 'DIAG-005',
    statement: 'I have no structured strategy for managing my energy or recovery.',
    dimension: 'SR',
  },

  // ── Focus & Execution ──
  {
    id: 6,
    code: 'DIAG-006',
    statement: 'I often start the day without a clear sense of my top priorities.',
    dimension: 'FE',
  },
  {
    id: 7,
    code: 'DIAG-007',
    statement: 'I frequently get pulled into reactive work instead of planned, high-value tasks.',
    dimension: 'FE',
  },
  {
    id: 8,
    code: 'DIAG-008',
    statement: 'I struggle to sustain deep focus for more than 30 minutes at a time.',
    dimension: 'FE',
  },
  {
    id: 9,
    code: 'DIAG-009',
    statement: 'My output quality varies significantly depending on my mood or environment.',
    dimension: 'FE',
  },
  {
    id: 10,
    code: 'DIAG-010',
    statement: 'I regularly overcommit and then underdeliver on what matters most.',
    dimension: 'FE',
  },

  // ── Leadership & Influence ──
  {
    id: 11,
    code: 'DIAG-011',
    statement: 'I find it hard to get buy-in from others for my ideas or decisions.',
    dimension: 'LI',
  },
  {
    id: 12,
    code: 'DIAG-012',
    statement: 'Difficult conversations tend to escalate or get avoided entirely.',
    dimension: 'LI',
  },
  {
    id: 13,
    code: 'DIAG-013',
    statement: 'I spend significant mental energy navigating workplace politics or conflict.',
    dimension: 'LI',
  },
  {
    id: 14,
    code: 'DIAG-014',
    statement: 'I feel uncertain about how I am perceived by colleagues or my team.',
    dimension: 'LI',
  },
  {
    id: 15,
    code: 'DIAG-015',
    statement: 'I struggle to delegate effectively and end up taking on too much myself.',
    dimension: 'LI',
  },

  // ── Self-Awareness & Regulation ──
  {
    id: 16,
    code: 'DIAG-016',
    statement: 'I often react emotionally in high-pressure situations before thinking clearly.',
    dimension: 'SA',
  },
  {
    id: 17,
    code: 'DIAG-017',
    statement: 'I repeat the same unproductive patterns despite knowing they do not serve me.',
    dimension: 'SA',
  },
  {
    id: 18,
    code: 'DIAG-018',
    statement: 'I find it difficult to accurately assess my own strengths and limitations.',
    dimension: 'SA',
  },
  {
    id: 19,
    code: 'DIAG-019',
    statement: 'I tend to avoid feedback or become defensive when receiving it.',
    dimension: 'SA',
  },
  {
    id: 20,
    code: 'DIAG-020',
    statement: 'I lack a regular practice for reflecting on my behaviour and its impact.',
    dimension: 'SA',
  },
];

// ─── Presentation order ───────────────────────────────────────
// Interleave dimensions so same-dimension items aren't clustered.

export const ITEM_ORDER: number[] = [
  1, 6, 11, 16,   // SR FE LI SA
  2, 7, 12, 17,
  3, 8, 13, 18,
  4, 9, 14, 19,
  5, 10, 15, 20,
];

// ─── Scale labels ─────────────────────────────────────────────

export const SCALE_LABELS: Record<number, string> = {
  1: 'Strongly Disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly Agree',
};

// ─── Scoring ──────────────────────────────────────────────────

export interface DiagnosticScores {
  SR: number; // performance % (100 = no pain)
  FE: number;
  LI: number;
  SA: number;
  overall: number;
  weakest: DimensionKey;
  strongest: DimensionKey;
}

export function calculateDiagnosticScores(
  answers: Record<number, number>
): DiagnosticScores {
  const sums: Record<DimensionKey, number> = { SR: 0, FE: 0, LI: 0, SA: 0 };

  for (const item of DIAGNOSTIC_ITEMS) {
    const val = answers[item.id] || 3; // default neutral
    sums[item.dimension] += val;
  }

  const maxPerDimension = 5 * 5; // 5 questions × max 5

  // Invert: high agreement with pain statements = low performance
  const SR = Math.round(100 - (sums.SR / maxPerDimension) * 100);
  const FE = Math.round(100 - (sums.FE / maxPerDimension) * 100);
  const LI = Math.round(100 - (sums.LI / maxPerDimension) * 100);
  const SA = Math.round(100 - (sums.SA / maxPerDimension) * 100);

  const overall = Math.round((SR + FE + LI + SA) / 4);

  const scores = { SR, FE, LI, SA };
  const entries = Object.entries(scores) as [DimensionKey, number][];
  const weakest = entries.reduce((a, b) => (b[1] < a[1] ? b : a))[0];
  const strongest = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  return { SR, FE, LI, SA, overall, weakest, strongest };
}

// ─── Section breaks ───────────────────────────────────────────
// Insert after every 5 questions (4 items per interleaved group × ~1.25)
// Actually: after items 4, 8, 12, 16 in the presentation order.

export interface SectionBreak {
  sectionNumber: number;
  dimensionFocus: string;
  label: string;
}

export const SECTION_BREAKS: Record<number, SectionBreak> = {
  4: {
    sectionNumber: 2,
    dimensionFocus: 'FE',
    label: 'SECTION 02 — FOCUS & EXECUTION',
  },
  8: {
    sectionNumber: 3,
    dimensionFocus: 'LI',
    label: 'SECTION 03 — LEADERSHIP & INFLUENCE',
  },
  12: {
    sectionNumber: 4,
    dimensionFocus: 'SA',
    label: 'SECTION 04 — SELF-AWARENESS & REGULATION',
  },
  16: {
    sectionNumber: 5,
    dimensionFocus: 'ALL',
    label: 'FINAL SECTION — CROSS-DOMAIN',
  },
};
