/**
 * Performance Diagnostic — pain-point assessment for lead generation.
 *
 * 20 statements, 5 per dimension. Users rate each 1–5.
 * Dimension score = sum of 5 items / (5 × 5) × 100 → percentage.
 *
 * Dimensions (mapped to Limitless modules):
 *   CL — Clarity   → Learn   (patterns, self-knowledge, understanding what matters)
 *   MI — Mindset    → Manage  (motivation, psych flexibility, the lens you operate through)
 *   EN — Energy     → Nurture (environment, flow, support systems, recovery)
 *   MO — Momentum   → Thrive  (sustaining performance, goals, reflection, boundaries)
 *
 * NOTE: Questions are negatively framed (pain indicators).
 * Higher agreement = higher pain = LOWER performance in that area.
 * Final "performance score" per dimension = 100 - rawPainPct.
 */

export type DimensionKey = 'CL' | 'MI' | 'EN' | 'MO';

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
  CL: {
    key: 'CL',
    label: 'Clarity',
    shortLabel: 'Clarity',
    description:
      'How well you understand your own patterns — what drives you, where you get stuck, and what actually matters.',
    lowScoreInsight:
      'You\'re busy, but you\'re not sure it\'s the right busy. You have goals, but they don\'t feel connected to anything deeper. You keep ending up in the same loops — same frustrations, same results — and you can\'t quite see why. That\'s not a motivation problem. It\'s a clarity problem. Until you can see your own patterns clearly, you\'ll keep repeating them.',
    highScoreInsight:
      'You know what matters to you and you can see your own patterns clearly. That self-knowledge gives you an edge — you make better decisions because you understand what\'s driving them.',
  },
  MI: {
    key: 'MI',
    label: 'Mindset',
    shortLabel: 'Mindset',
    description:
      'The lens you see everything through — how you talk to yourself, how you handle setbacks, and whether your thinking helps or holds you back.',
    lowScoreInsight:
      'You look confident from the outside. But inside, there\'s a running commentary that second-guesses everything. You overthink decisions. You replay conversations. You know you\'re capable, but something keeps pulling you back to doubt. That voice got you here — it pushed you to prove yourself. But it\'s now the thing standing between you and the next level.',
    highScoreInsight:
      'Your internal dialogue works for you, not against you. You bounce back from setbacks without spiralling, and you can catch yourself before overthinking takes over.',
  },
  EN: {
    key: 'EN',
    label: 'Energy',
    shortLabel: 'Energy',
    description:
      'Whether you\'ve built the environment, rhythms, and support around you that actually fuel performance — or drain it.',
    lowScoreInsight:
      'You\'re running on fumes and you\'ve normalised it. Your energy crashes by mid-afternoon, your sleep is disrupted, and you push through instead of recovering. You haven\'t built the environment around you that makes good performance sustainable. You\'re relying on willpower when you should be relying on design.',
    highScoreInsight:
      'You\'ve built rhythms and an environment that sustain you. Your energy holds up through the day and you recover well — that\'s a serious advantage most people don\'t have.',
  },
  MO: {
    key: 'MO',
    label: 'Momentum',
    shortLabel: 'Momentum',
    description:
      'Your ability to sustain performance over time — setting real goals, protecting your priorities, and not burning out in the process.',
    lowScoreInsight:
      'You\'re absorbing everyone else\'s problems and calling it "being helpful." You can\'t say no. You avoid the hard conversations. You sprint, crash, and sprint again instead of building something sustainable. The pattern is clear: you give everything to everyone else and leave nothing for what actually matters to you.',
    highScoreInsight:
      'You protect your priorities and sustain your performance over time. You set boundaries, reflect regularly, and know when to push and when to pull back.',
  },
};

// ─── The 20 diagnostic items ──────────────────────────────────

export const DIAGNOSTIC_ITEMS: DiagnosticItem[] = [
  // ── Clarity (Learn) ──
  {
    id: 1,
    code: 'DIAG-001',
    statement: 'I\'m not clear on what my core strengths actually are or how to use them consistently.',
    dimension: 'CL',
  },
  {
    id: 2,
    code: 'DIAG-002',
    statement: 'I keep ending up in the same frustrating patterns but can\'t see why.',
    dimension: 'CL',
  },
  {
    id: 3,
    code: 'DIAG-003',
    statement: 'My daily work doesn\'t feel connected to anything I genuinely value.',
    dimension: 'CL',
  },
  {
    id: 4,
    code: 'DIAG-004',
    statement: 'I struggle to explain what I actually want from the next phase of my life or career.',
    dimension: 'CL',
  },
  {
    id: 5,
    code: 'DIAG-005',
    statement: 'I make decisions based on what\'s expected of me rather than what matters to me.',
    dimension: 'CL',
  },

  // ── Mindset (Manage) ──
  {
    id: 6,
    code: 'DIAG-006',
    statement: 'I battle self-doubt even when I know, objectively, that I am capable.',
    dimension: 'MI',
  },
  {
    id: 7,
    code: 'DIAG-007',
    statement: 'I overthink situations to the point where it delays my decisions or actions.',
    dimension: 'MI',
  },
  {
    id: 8,
    code: 'DIAG-008',
    statement: 'When things go wrong, my first instinct is to push harder rather than think differently.',
    dimension: 'MI',
  },
  {
    id: 9,
    code: 'DIAG-009',
    statement: 'I find it hard to stay motivated once the initial excitement of something wears off.',
    dimension: 'MI',
  },
  {
    id: 10,
    code: 'DIAG-010',
    statement: 'I repeat the same unproductive patterns despite knowing they don\'t serve me.',
    dimension: 'MI',
  },

  // ── Energy (Nurture) ──
  {
    id: 11,
    code: 'DIAG-011',
    statement: 'I find it difficult to fully switch off from work, even when I want to.',
    dimension: 'EN',
  },
  {
    id: 12,
    code: 'DIAG-012',
    statement: 'By mid-afternoon, my energy and mental sharpness have noticeably declined.',
    dimension: 'EN',
  },
  {
    id: 13,
    code: 'DIAG-013',
    statement: 'I push through fatigue rather than adjusting my pace or taking recovery time.',
    dimension: 'EN',
  },
  {
    id: 14,
    code: 'DIAG-014',
    statement: 'My sleep quality is frequently disrupted by work-related thoughts or anxiety.',
    dimension: 'EN',
  },
  {
    id: 15,
    code: 'DIAG-015',
    statement: 'I sacrifice my own wellbeing to meet the demands of work or other commitments.',
    dimension: 'EN',
  },

  // ── Momentum (Thrive) ──
  {
    id: 16,
    code: 'DIAG-016',
    statement: 'I end up absorbing other people\'s problems rather than empowering them to solve their own.',
    dimension: 'MO',
  },
  {
    id: 17,
    code: 'DIAG-017',
    statement: 'I avoid or delay difficult conversations that I know need to happen.',
    dimension: 'MO',
  },
  {
    id: 18,
    code: 'DIAG-018',
    statement: 'I struggle to say no to requests, even when they compromise my own priorities.',
    dimension: 'MO',
  },
  {
    id: 19,
    code: 'DIAG-019',
    statement: 'I don\'t have a regular practice for reviewing my goals and adjusting my approach.',
    dimension: 'MO',
  },
  {
    id: 20,
    code: 'DIAG-020',
    statement: 'I sprint hard then crash, rather than pacing myself for sustained performance.',
    dimension: 'MO',
  },
];

// ─── Presentation order ───────────────────────────────────────
// Interleave dimensions so same-dimension items aren't clustered.

export const ITEM_ORDER: number[] = [
  1, 6, 11, 16,   // CL MI EN MO
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
  CL: number; // performance % (100 = no pain)
  MI: number;
  EN: number;
  MO: number;
  overall: number;
  weakest: DimensionKey;
  strongest: DimensionKey;
}

export function calculateDiagnosticScores(
  answers: Record<number, number>
): DiagnosticScores {
  const sums: Record<DimensionKey, number> = { CL: 0, MI: 0, EN: 0, MO: 0 };

  for (const item of DIAGNOSTIC_ITEMS) {
    const val = answers[item.id] || 3; // default neutral
    sums[item.dimension] += val;
  }

  const maxPerDimension = 5 * 5; // 5 questions × max 5

  // Invert: high agreement with pain statements = low performance
  const CL = Math.round(100 - (sums.CL / maxPerDimension) * 100);
  const MI = Math.round(100 - (sums.MI / maxPerDimension) * 100);
  const EN = Math.round(100 - (sums.EN / maxPerDimension) * 100);
  const MO = Math.round(100 - (sums.MO / maxPerDimension) * 100);

  const overall = Math.round((CL + MI + EN + MO) / 4);

  const scores = { CL, MI, EN, MO };
  const entries = Object.entries(scores) as [DimensionKey, number][];
  const weakest = entries.reduce((a, b) => (b[1] < a[1] ? b : a))[0];
  const strongest = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  return { CL, MI, EN, MO, overall, weakest, strongest };
}

// ─── Section breaks ───────────────────────────────────────────
// Insert after every 4 items in the presentation order.

export interface SectionBreak {
  sectionNumber: number;
  dimensionFocus: string;
  label: string;
}

export const SECTION_BREAKS: Record<number, SectionBreak> = {
  4: {
    sectionNumber: 2,
    dimensionFocus: 'MI',
    label: 'SECTION 02 — MINDSET',
  },
  8: {
    sectionNumber: 3,
    dimensionFocus: 'EN',
    label: 'SECTION 03 — ENERGY',
  },
  12: {
    sectionNumber: 4,
    dimensionFocus: 'MO',
    label: 'SECTION 04 — MOMENTUM',
  },
  16: {
    sectionNumber: 5,
    dimensionFocus: 'ALL',
    label: 'FINAL SECTION — CROSS-DOMAIN',
  },
};
