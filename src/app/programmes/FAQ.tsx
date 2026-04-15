'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Who is this programme for?',
    answer:
      "We work with a wide range of professionals. Athletes, executives, entrepreneurs, students. The psychological principles apply to anyone pursuing excellence. Whether you're optimising performance in sport, business, or creative work, this system translates.",
  },
  {
    question: 'What\'s the difference between Core, Pro, and Elite?',
    answer:
      'Same programme, same four modules, same transformation. The difference is how you experience it. Core is self-guided learning at your pace. Pro is a live cohort with Chris, weekly workshops, and a private community. Elite is full 1:1 mentorship over 12 months with complete customisation to your situation.',
  },
  {
    question: 'How long does it take?',
    answer:
      '16 weeks for Core and Pro. Elite runs over a full year. A typical week includes a chapter digest (20-30 minutes), daily journal exercises (10 minutes each), and for Pro and Elite, monthly live workshops and Q&As.',
  },
  {
    question: 'What does a typical week look like?',
    answer:
      'Weekly chapter digest with core concepts and applications. Daily journal prompts tailored to the module. Monthly workshops and Q&As for Pro and Elite members. Community chat available 24/7 for support and accountability.',
  },
  {
    question: 'Does this include lifetime access?',
    answer:
      'Yes. You have lifetime access to all the learning resources, materials, and recordings. Return to them anytime, as often as you need.',
  },
  {
    question: 'Why no refunds?',
    answer:
      'This programme is about transformation, not information. If you can\'t commit the time or aren\'t fully decided, please don\'t enrol. We want people who are ready. If you need clarity before deciding, take the free diagnostic or reach out directly.',
  },
  {
    question: 'Can my company pay for this?',
    answer:
      'Yes. Many companies cover the cost as part of wellbeing and professional development budgets. Check with your HR or finance team about approved learning and development providers.',
  },
  {
    question: 'What if I\'m not sure which tier is right for me?',
    answer:
      'Take the free Performance Diagnostic. It\'s free and takes 5 minutes. You\'ll get insight into your dominant performance style, and we can recommend the right path based on your profile and goals.',
  },
  {
    question: 'Who is Chris Bodman?',
    answer:
      'Performance Psychologist with 20+ years of experience working with Olympians, elite athletes, and business leaders. He\'s spent two decades understanding how people perform under pressure and the systems that enable sustained excellence.',
  },
  {
    question: 'How is this different from other coaching programmes?',
    answer:
      'Most programmes are either motivational fluff or dense academic theory. Limitless bridges the gap. Evidence-based psychology made practical. Frameworks you can apply immediately. Built on two decades of working with elite performers.',
  },
  {
    question: 'What does LMNTARY mean?',
    answer:
      'LMNTARY (pronounced: elementary). The philosophy is built on four performance elements: Learn, Manage, Nurture, and Thrive. The fundamentals of sustained excellence. Nothing fancy. Just what works.',
  },
  {
    question: 'Is this only for athletes?',
    answer:
      'No. The psychological principles apply to anyone pursuing excellence. Business leaders, entrepreneurs, creatives, students. Performance is universal. The tools work whether you\'re competing on a pitch, in a boardroom, or on stage.',
  },
];

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.faqSectionHeader}>
        <h2 className={styles.faqSectionHeading}>Questions</h2>
      </div>

      <ul className={styles.faqList}>
        {faqItems.map((item, index) => (
          <li
            key={index}
            className={`${styles.faqItem} ${expandedIndex === index ? styles.active : ''}`}
          >
            <div
              className={styles.faqItemQuestion}
              onClick={() => toggleItem(index)}
            >
              <span>{item.question}</span>
              <span className={styles.faqItemToggle}>+</span>
            </div>
            <div className={styles.faqItemAnswer}>{item.answer}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
