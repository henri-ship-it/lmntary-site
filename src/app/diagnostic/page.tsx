import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Performance Diagnostic | LMNTARY Performance',
  description:
    'Understand your dominant performance style. Get a personalised blueprint for how you operate. Free performance diagnostic.',
};

export default function DiagnosticPage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className="container container--narrow">
          <p className={styles.heroEyebrow}>FREE</p>
          <h1 className={styles.heroHeading}>PERFORMANCE DIAGNOSTIC</h1>
          <p className={styles.heroSub}>
            Understand your dominant performance style. Get a personalised report for how you operate. Takes 5 minutes.
          </p>
          <div className={styles.heroActions}>
            <button className="btn btn--primary">Start the Diagnostic</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.howItWorks}>
        <div className="container">
          <div className={styles.howItWorksGrid}>
            <div className={styles.step}>
              <div className={styles.number}>1</div>
              <h3 className={styles.stepTitle}>Answer 24 Questions</h3>
              <p className={styles.stepDesc}>Quick, honest responses about how you think and behave.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.number}>2</div>
              <h3 className={styles.stepTitle}>Performance Diagnostic</h3>
              <p className={styles.stepDesc}>See your dominant behavioural style and what it means for your performance.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.number}>3</div>
              <h3 className={styles.stepTitle}>Receive Your Blueprint</h3>
              <p className={styles.stepDesc}>A personalised report with practical next steps, sent to your inbox.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE FOUR STYLES */}
      <section className={styles.stylesSection}>
        <div className="container">
          <div className={styles.stylesSectionHeader}>
            <h2 className={styles.stylesSectionHeading}>The Four Styles</h2>
            <p className={styles.stylesSectionSub}>See which behavioural profile matches how you operate.</p>
          </div>
          <div className={styles.stylesSectionGrid}>
            <div className={styles.styleCard}>
              <div className={styles.styleCardName}>Dynamo</div>
              <div className={styles.styleCardTagline}>Action-Oriented</div>
              <p className={styles.styleCardDesc}>Decisive, execution-focused, thrives under pressure. You get things done and lead through momentum.</p>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleCardName}>Analyst</div>
              <div className={styles.styleCardTagline}>Detail-Oriented</div>
              <p className={styles.styleCardDesc}>Methodical, evidence-led, systematic. You excel through preparation and rigorous thinking.</p>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleCardName}>Caretaker</div>
              <div className={styles.styleCardTagline}>Relationship-Focused</div>
              <p className={styles.styleCardDesc}>Supportive, empathetic, team-oriented. You create trust and elevate those around you.</p>
            </div>
            <div className={styles.styleCard}>
              <div className={styles.styleCardName}>Energiser</div>
              <div className={styles.styleCardTagline}>Expressive</div>
              <p className={styles.styleCardDesc}>Visionary, charismatic, energised by people and ideas. You inspire and connect across boundaries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL LEARN */}
      <section className={styles.learnSection}>
        <div className={styles.learnSectionContainer}>
          <h2 className={styles.learnSectionHeading}>What You'll Learn</h2>
          <ul className={styles.learnSectionList}>
            <li className={styles.learnItem}>
              <div className={styles.checkmark}>✓</div>
              <p className={styles.learnText}>Your dominant behavioural style and how it shapes your decisions</p>
            </li>
            <li className={styles.learnItem}>
              <div className={styles.checkmark}>✓</div>
              <p className={styles.learnText}>Your blind spots and where your strengths become limitations</p>
            </li>
            <li className={styles.learnItem}>
              <div className={styles.checkmark}>✓</div>
              <p className={styles.learnText}>How to work with your natural wiring, not against it</p>
            </li>
            <li className={styles.learnItem}>
              <div className={styles.checkmark}>✓</div>
              <p className={styles.learnText}>A recommended path based on where you are right now</p>
            </li>
          </ul>
        </div>
      </section>

      {/* CREDIBILITY */}
      <section className={styles.credibility}>
        <div className={styles.credibilityContainer}>
          <h2 className={styles.credibilityHeading}>BUILT ON REAL SCIENCE</h2>
          <p className={styles.credibilityText}>
            20+ years of applied performance psychology. Used with Olympic athletes, elite sports teams, and business leaders. Grounded in behavioural science.
          </p>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.bottomCta}>
        <div className={styles.bottomCtaContainer}>
          <h2 className={styles.bottomCtaHeading}>Ready to understand how you operate?</h2>
          <button className="btn btn--primary">Start the Diagnostic</button>
        </div>
      </section>
    </>
  );
}
