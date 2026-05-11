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
      'Your capacity to manage pressure, switch off, and sustain energy across the demands you face.',
    lowScoreInsight:
      'You are running on depleted reserves. The data suggests you have normalised chronic stress — rating it as low-priority even as your energy collapses by mid-afternoon. You push through rather than recover. Without intervention, this trajectory ends in burnout, not performance.',
    highScoreInsight:
      'Your stress management and recovery rhythms are effective. You maintain energy reserves and absorb pressure without significant performance degradation.',
  },
  FE: {
    key: 'FE',
    label: 'Focus & Execution',
    shortLabel: 'Focus',
    description:
      'Your ability to maintain mental clarity, protect your attention, and deliver consistent output on what matters most.',
    lowScoreInsight:
      'You have systems, but they are not consistent. Your mental clarity is significantly lower than where you need it to be, and the gap between your ambition and your daily output is widening. You are losing productive capacity to context-switching, unclear priorities, and reactive work.',
    highScoreInsight:
      'Your focus and execution systems are strong. You maintain clarity on priorities and deliver with consistency, even when demands increase.',
  },
  LI: {
    key: 'LI',
    label: 'Leadership & Influence',
    shortLabel: 'Leadership',
    description:
      'Your effectiveness in holding others accountable, navigating difficult conversations, and influencing outcomes without friction.',
    lowScoreInsight:
      'You are absorbing other people\'s problems. Difficult conversations are either escalating or being avoided, and you are taking on too much rather than delegating effectively. The energy you spend managing interpersonal dynamics is energy not directed at your own performance.',
    highScoreInsight:
      'Your communication and influence patterns are effective. You delegate with confidence and navigate interpersonal dynamics without significant energy loss.',
  },
  SA: {
    key: 'SA',
    label: 'Self-Awareness & Regulation',
    shortLabel: 'Awareness',
    description:
      'Your capacity to recognise your own patterns, regulate your internal dialogue, and respond deliberately rather than reactively.',
    lowScoreInsight:
      'You appear confident on the outside, but internally you are battling self-doubt, overthinking, and reactive patterns that override your best intentions. The voice that drove you to achieve is now the same voice holding you back. Until you can see these patterns clearly, they will continue to run the show.',
    highScoreInsight:
      'Your self-awareness is well-developed. You recognise your patterns under pressure and regulate your responses deliberately rather than reactively.',
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
    statement: 'By mid-afternoon, my energy and mental sharpness have noticeably declined.',
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
    statement: 'I sacrifice my own wellbeing to meet the demands of work or other commitments.',
    dimension: 'SR',
  },

  // ── Focus & Execution ──
  {
    id: 6,
    code: 'DIAG-006',
    statement: 'I have systems for organising my work, but I cannot sustain them consistently.',
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
    statement: 'I struggle to maintain deep focus for extended periods without distraction.',
    dimension: 'FE',
  },
  {
    id: 9,
    code: 'DIAG-009',
    statement: 'My mental clarity is significantly lower than I need it to be.',
    dimension: 'FE',
  },
  {
    id: 10,
    code: 'DIAG-010',
    statement: 'I try to do too many things at once instead of completing one thing well.',
    dimension: 'FE',
  },

  // ── Leadership & Influence ──
  {
    id: 11,
    code: 'DIAG-011',
    statement: 'I end up absorbing other people\'s problems rather than empowering them to solve their own.',
    dimension: 'LI',
  },
  {
    id: 12,
    code: 'DIAG-012',
    statement: 'I avoid or delay difficult conversations that I know need to happen.',
    dimension: 'LI',
  },
  {
    id: 13,
    code: 'DIAG-013',
    statement: 'I find it hard to hold others accountable without feeling uncomfortable.',
    dimension: 'LI',
  },
  {
    id: 14,
    code: 'DIAG-014',
    statement: 'I struggle to say no to requests, even when they compromise my own priorities.',
    dimension: 'LI',
  },
  {
    id: 15,
    code: 'DIAG-015',
    statement: 'I take on too much myself rather than delegating effectively to others.',
    dimension: 'LI',
  },

  // ── Self-Awareness & Regulation ──
  {
    id: 16,
    code: 'DIAG-016',
    statement: 'I battle self-doubt even when I know, objectively, that I am capable.',
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
    statement: 'I overthink situations to the point where it delays my decisions or actions.',
    dimension: 'SA',
  },
  {
    id: 19,
    code: 'DIAG-019',
    statement: 'When things go wrong, I default to pushing harder rather than stepping back to reflect.',
    dimension: 'SA',
  },
  {
    id: 20,
    code: 'DIAG-020',
    statement: 'I lack a regular practice for understanding my own behaviour and its impact.',
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
