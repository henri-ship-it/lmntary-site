/**
 * Know Thyself Behavioural Assessment — questions, scoring, and style data.
 *
 * 36 statements, 9 per style. Users rate each on a 1–5 Likert scale.
 * Style percentage = sum of 9 items / (9 × 5) × 100.
 */

export type StyleKey = 'dynamo' | 'analyst' | 'caretaker' | 'energiser';

export interface TraitQuestion {
  id: number;
  statement: string;
  style: StyleKey;
}

export interface StyleMeta {
  key: StyleKey;
  label: string;
  tagline: string;
  color: string;
  colorLight: string;
  icon: string;
  description: string;
  strengths: string[];
  watchFor: string[];
}

// ─── Style metadata ────────────────────────────────────────────

export const STYLES: Record<StyleKey, StyleMeta> = {
  dynamo: {
    key: 'dynamo',
    label: 'Dynamo',
    tagline: 'The Driver',
    color: '#E74C3C',
    colorLight: 'rgba(231, 76, 60, 0.12)',
    icon: '⚡',
    description:
      'Dynamos are action-oriented leaders who thrive on challenge and results. They push boundaries, take decisive action, and are energised by competition and fast-paced environments.',
    strengths: [
      'Decisive under pressure',
      'Natural leadership presence',
      'Results-driven and competitive',
      'Direct and assertive communicator',
    ],
    watchFor: [
      'May steamroll others in pursuit of goals',
      'Can appear impatient or dismissive',
      'Risk of burnout from relentless pace',
    ],
  },
  analyst: {
    key: 'analyst',
    label: 'Analyst',
    tagline: 'The Thinker',
    color: '#3498DB',
    colorLight: 'rgba(52, 152, 219, 0.12)',
    icon: '🔍',
    description:
      'Analysts are methodical, detail-oriented thinkers who value logic and precision. They anticipate problems, plan meticulously, and bring structure to complex situations.',
    strengths: [
      'Thorough and detail-oriented',
      'Strong logical reasoning',
      'Excellent at planning and risk assessment',
      'Calm and thoughtful under pressure',
    ],
    watchFor: [
      'Analysis paralysis can slow decision-making',
      'May come across as overly serious or rigid',
      'Can struggle with ambiguity and improvisation',
    ],
  },
  caretaker: {
    key: 'caretaker',
    label: 'Caretaker',
    tagline: 'The Supporter',
    color: '#2ECC71',
    colorLight: 'rgba(46, 204, 113, 0.12)',
    icon: '🤝',
    description:
      'Caretakers are empathetic, people-centred individuals who build strong relationships and nurture others. They put the team first and create environments where people feel valued.',
    strengths: [
      'Deep empathy and emotional intelligence',
      'Builds trust and strong team bonds',
      'Reliable and selfless collaborator',
      'Creates psychological safety for others',
    ],
    watchFor: [
      'May neglect own needs for others',
      'Can struggle with assertiveness',
      'Risk of being taken advantage of',
    ],
  },
  energiser: {
    key: 'energiser',
    label: 'Energiser',
    tagline: 'The Inspirer',
    color: '#F39C12',
    colorLight: 'rgba(243, 156, 18, 0.12)',
    icon: '✨',
    description:
      'Energisers are enthusiastic, creative communicators who light up any room. They motivate others, build rapport easily, and bring optimism and imagination to everything they do.',
    strengths: [
      'Infectious enthusiasm and optimism',
      'Natural at building rapport quickly',
      'Creative and open to new ideas',
      'Charismatic and persuasive',
    ],
    watchFor: [
      'May struggle with follow-through on details',
      'Can prioritise being liked over being effective',
      'Risk of overcommitting and spreading thin',
    ],
  },
};

// ─── The 36 trait questions ────────────────────────────────────
// Ordered as they appear in the ScoreApp CSV (4 blocks of interleaved styles).
// We shuffle them for the questionnaire presentation.

export const TRAIT_QUESTIONS: TraitQuestion[] = [
  // Block 1: Energiser
  { id: 1, statement: 'I often encourage others to see the bright side of challenges.', style: 'energiser' },
  { id: 2, statement: 'I enjoy motivating others to join in activities or causes.', style: 'energiser' },
  { id: 3, statement: 'I bring enthusiasm to teams and social gatherings.', style: 'energiser' },
  { id: 4, statement: 'I am quick to build rapport with new acquaintances.', style: 'energiser' },
  // Block 2: Caretaker
  { id: 5, statement: 'I find fulfilment in nurturing others’ growth or wellbeing.', style: 'caretaker' },
  { id: 6, statement: 'I willingly adapt to accommodate others’ needs.', style: 'caretaker' },
  { id: 7, statement: 'I often put the needs of the team before my own.', style: 'caretaker' },
  { id: 8, statement: 'I am the first to offer support when someone needs help.', style: 'caretaker' },
  // Block 3: Analyst
  { id: 9, statement: 'I often anticipate potential obstacles and plan ahead.', style: 'analyst' },
  { id: 10, statement: 'I value logic and reasoning over intuition when making choices.', style: 'analyst' },
  { id: 11, statement: 'I approach problems by gathering and analysing relevant information.', style: 'analyst' },
  { id: 12, statement: 'I enjoy breaking down complex issues into manageable parts.', style: 'analyst' },
  // Block 4: Dynamo
  { id: 13, statement: 'I actively seek out opportunities to lead projects or teams.', style: 'dynamo' },
  { id: 14, statement: 'I am comfortable confronting problems directly.', style: 'dynamo' },
  { id: 15, statement: 'I enjoy competing and measuring my success against others.', style: 'dynamo' },
  { id: 16, statement: 'I thrive when working under pressure and tight deadlines.', style: 'dynamo' },
  // Block 5: Energiser
  { id: 17, statement: 'I enjoy being popular and entertaining in social settings.', style: 'energiser' },
  { id: 18, statement: 'I am naturally energised and drawn to collaborative efforts.', style: 'energiser' },
  { id: 19, statement: 'I am expressive and talkative when engaging with others.', style: 'energiser' },
  { id: 20, statement: 'I am charismatic and persuasive in social situations.', style: 'energiser' },
  { id: 21, statement: 'I am open and imaginative.', style: 'energiser' },
  // Block 6: Caretaker
  { id: 22, statement: 'I am sincere and modest in my interactions with others.', style: 'caretaker' },
  { id: 23, statement: 'I am reflective and soft-spoken in my interactions.', style: 'caretaker' },
  { id: 24, statement: 'I naturally offer compassion and encouragement to those around me.', style: 'caretaker' },
  { id: 25, statement: 'I place importance on caring for and empathising with others’ feelings.', style: 'caretaker' },
  { id: 26, statement: 'I am faithful and trusting in my relationships with others.', style: 'caretaker' },
  // Block 7: Analyst
  { id: 27, statement: 'I value adhering to structure and detail in my work.', style: 'analyst' },
  { id: 28, statement: 'I approach situations with a serious and thoughtful demeanour.', style: 'analyst' },
  { id: 29, statement: 'I am organised and thorough in planning and executing tasks.', style: 'analyst' },
  { id: 30, statement: 'I delve into specifics and ensure accuracy in my work.', style: 'analyst' },
  { id: 31, statement: 'I prioritise logic and facts in decision-making processes.', style: 'analyst' },
  // Block 8: Dynamo
  { id: 32, statement: 'I am determined and strong-willed in my pursuits.', style: 'dynamo' },
  { id: 33, statement: 'I prefer working independently and relying on my practical skills.', style: 'dynamo' },
  { id: 34, statement: 'I take charge and demand results in a situation.', style: 'dynamo' },
  { id: 35, statement: 'I enjoy activities that are fast-paced and straightforward.', style: 'dynamo' },
  { id: 36, statement: 'I express my opinions openly and assertively.', style: 'dynamo' },
];

// ─── Shuffled order for questionnaire ──────────────────────────
// Deterministic shuffle so items from the same style aren't clustered.

export const QUESTION_ORDER: number[] = [
  1, 9, 13, 5,     // E A D C
  17, 27, 32, 22,   // E A D C
  2, 10, 14, 6,
  18, 28, 33, 23,
  3, 11, 15, 7,
  19, 29, 34, 24,
  4, 12, 16, 8,
  20, 30, 35, 25,
  21, 31, 36, 26,
];

// ─── Rating scale ──────────────────────────────────────────────

export const RATING_LABELS: Record<number, string> = {
  1: 'Strongly Disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly Agree',
};

// ─── Scoring helpers ───────────────────────────────────────────

export interface StyleScores {
  dynamo_pct: number;
  analyst_pct: number;
  caretaker_pct: number;
  energiser_pct: number;
  dominant_style: string;
}

export function calculateScores(answers: Record<number, number>): StyleScores {
  const sums: Record<StyleKey, number> = { dynamo: 0, analyst: 0, caretaker: 0, energiser: 0 };

  for (const q of TRAIT_QUESTIONS) {
    const val = answers[q.id] || 3; // default to neutral if somehow missing
    sums[q.style] += val;
  }

  const maxPerStyle = 9 * 5; // 9 questions × max score 5

  const dynamo_pct = Math.round((sums.dynamo / maxPerStyle) * 100);
  const analyst_pct = Math.round((sums.analyst / maxPerStyle) * 100);
  const caretaker_pct = Math.round((sums.caretaker / maxPerStyle) * 100);
  const energiser_pct = Math.round((sums.energiser / maxPerStyle) * 100);

  const scores = [
    { name: 'Dynamo', pct: dynamo_pct },
    { name: 'Analyst', pct: analyst_pct },
    { name: 'Caretaker', pct: caretaker_pct },
    { name: 'Energiser', pct: energiser_pct },
  ];
  const dominant_style = scores.reduce((a, b) => (b.pct > a.pct ? b : a)).name;

  return { dynamo_pct, analyst_pct, caretaker_pct, energiser_pct, dominant_style };
}

/** Group individual answers by style for trait-level breakdowns */
export function getTraitBreakdown(answers: Record<number, number>) {
  const breakdown: Record<StyleKey, { id: number; statement: string; score: number }[]> = {
    dynamo: [],
    analyst: [],
    caretaker: [],
    energiser: [],
  };

  for (const q of TRAIT_QUESTIONS) {
    breakdown[q.style].push({
      id: q.id,
      statement: q.statement,
      score: answers[q.id] || 3,
    });
  }

  return breakdown;
}
