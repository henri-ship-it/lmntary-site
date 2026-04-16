/**
 * Central course & lesson data for /learn.
 *
 * Eventually this will be:
 * - Courses: sourced from a CMS or MDX folders
 * - Access: gated by JWT cookie set via magic-link email (see AUTH_ARCHITECTURE.md)
 *
 * For now, this is the authoritative list. Lessons with access: 'free' are
 * always readable. Lessons with access: 'paid' require an unlocked session.
 */

export type LessonAccess = 'free' | 'paid';

export interface Lesson {
  slug: string;
  title: string;
  summary: string;
  duration: string; // e.g. "8 min read"
  access: LessonAccess;
  // Body is plain markdown / MDX-ready HTML-safe text. Replace with real content.
  body: string;
}

export interface Course {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  eyebrow: string; // e.g. "Free" or "£447"
  price: string | null; // null => free
  stripePriceId?: string; // used later for paid access flow
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  {
    slug: 'principles-of-performance',
    title: 'Principles of Performance',
    tagline: 'The free primer. Twelve lessons on how high performers actually operate.',
    description:
      'A short, free course that distils twenty years of applied performance psychology into twelve principles. Each lesson includes the idea, why it matters, and a practical exercise. Pairs with the Deliberate Practice Guide.',
    eyebrow: 'Free Course',
    price: null,
    lessons: [
      {
        slug: 'you-are-not-your-thoughts',
        title: 'You are not your thoughts',
        summary: 'Separating yourself from the running commentary in your head.',
        duration: '6 min read',
        access: 'free',
        body: 'Your mind generates thoughts the way your heart pumps blood — constantly, without permission. The mistake most people make is believing those thoughts are instructions. They are not. They are weather. The first principle of performance is learning to notice the weather without getting soaked.',
      },
      {
        slug: 'attention-is-the-commodity',
        title: 'Attention is the commodity',
        summary: 'Why where you point your mind determines almost everything else.',
        duration: '7 min read',
        access: 'free',
        body: 'Every high performer you admire has, at some point, become ferociously protective of their attention. Not their time — their attention. They are two different things. You can have all the time in the world and accomplish nothing if your attention is leaking.',
      },
      {
        slug: 'the-two-arrows',
        title: 'The two arrows',
        summary: 'The Buddhist framework for separating pain from suffering.',
        duration: '5 min read',
        access: 'free',
        body: 'There is a parable in Buddhism about two arrows. The first is the unavoidable pain of being alive. The second is the pain we add through our reaction to the first. Most of what we call suffering is the second arrow. Performance starts with refusing to fire it.',
      },
      {
        slug: 'values-before-goals',
        title: 'Values before goals',
        summary: 'Why outcome-only thinking leads to burnout and drift.',
        duration: '8 min read',
        access: 'free',
        body: 'Goals are a terrible compass. They tell you where you want to arrive, not how you want to travel. Values solve this. A goal says "win the championship". A value says "compete like it matters even in training". Only one of those survives a bad week.',
      },
      {
        slug: 'deliberate-practice',
        title: 'Deliberate practice, explained properly',
        summary: 'What Anders Ericsson actually meant — and what most people get wrong.',
        duration: '9 min read',
        access: 'free',
        body: 'Deliberate practice is not just "practising a lot". It has three specific ingredients: you are working at the edge of your current ability, you are getting immediate feedback, and you are deliberately repeating what you cannot yet do. Miss any of the three and you are just rehearsing.',
      },
    ],
  },
  {
    slug: 'limitless',
    title: 'Limitless',
    tagline: 'A 16-week system to get out of your own way and perform without limits.',
    description:
      'The full Limitless programme. Four modules — Learn, Manage, Nurture, Thrive — built on twenty years of elite performance psychology. Self-paced video lessons, digital journal, and weekly frameworks you can apply immediately.',
    eyebrow: '£447',
    price: '£447',
    stripePriceId: 'price_limitless_core', // placeholder
    lessons: [
      {
        slug: 'module-1-learn-intro',
        title: 'Module 1: Learn — Introduction',
        summary: 'Deepen your self-awareness. Understand what makes you tick.',
        duration: '12 min read',
        access: 'paid',
        body: 'Welcome to Module 1. Over the next four weeks you will build a comprehensive map of how you operate — your values, your strengths, your blind spots, and the triggers that pull you off centre. Everything else in Limitless is built on this foundation.',
      },
      {
        slug: 'module-1-values-audit',
        title: 'The values audit',
        summary: 'A structured exercise to surface what you actually care about — not what you think you should.',
        duration: '15 min read',
        access: 'paid',
        body: 'Most people have never done a values audit. They inherit values from family, culture, their industry, and never pressure-test them. This exercise changes that. You will work through a sequence of twenty-four prompts, narrow them to six, then to three. Those three are your operating system.',
      },
      {
        slug: 'module-2-inner-voice',
        title: 'Module 2: Manage — Your inner voice',
        summary: 'The practical mechanics of regulating self-talk under pressure.',
        duration: '10 min read',
        access: 'paid',
        body: 'Your inner voice is the most important voice you will ever hear. It is also usually the least regulated. In this lesson we break down the four forms of unhelpful self-talk and the specific reframes that dissolve each one.',
      },
      {
        slug: 'module-3-flow-conditions',
        title: 'Module 3: Nurture — Flow conditions',
        summary: 'Engineering the environment that lets deep work actually happen.',
        duration: '11 min read',
        access: 'paid',
        body: 'Flow is not magic. It is the predictable output of specific input conditions — clear goal, immediate feedback, a just-hard-enough challenge, and zero interruption. Most people rely on luck for all four. In this lesson you design your own flow stack.',
      },
      {
        slug: 'module-4-review-system',
        title: 'Module 4: Thrive — The weekly review',
        summary: 'The one hour a week that compounds everything else.',
        duration: '9 min read',
        access: 'paid',
        body: 'The weekly review is the single highest-leverage practice in the Limitless system. Sixty minutes. Five questions. Done properly, it makes the rest of your week non-negotiable. Done badly, it becomes a journal entry nobody reads.',
      },
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getLessonBySlug(
  courseSlug: string,
  lessonSlug: string
): { course: Course; lesson: Lesson; index: number } | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;
  const index = course.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return undefined;
  return { course, lesson: course.lessons[index], index };
}

export function getCourses(): Course[] {
  return COURSES;
}
