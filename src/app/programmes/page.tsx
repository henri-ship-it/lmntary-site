import Link from 'next/link';
import FAQ from './FAQ';
import styles from './page.module.css';

export const metadata = {
  title: 'Programmes | LMNTARY Performance',
  description:
    'Evidence-based performance psychology programmes. Three ways to experience it: Core, Pro, or Elite.',
};

export default function ProgrammesPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className={styles.pageHero}>
        <div className="container container--narrow">
          <h1 className={styles.pageHeroTitle}>Programmes</h1>
          <p className={styles.pageHeroSubtitle}>
            Evidence-based performance psychology. Same programme, three ways to experience it.
          </p>
        </div>
      </section>

      {/* THE MODEL */}
      <section className={styles.modelSection}>
        <div className={styles.modelSectionInner}>
          <h2 className={styles.modelSectionHeading}>How it works</h2>
          <p className={styles.modelSectionSubheading}>Choose the level of support that fits your needs.</p>
          <div className={styles.modelSectionDisplay}>
            <div className={styles.modelItem}>
              <div className={styles.modelItemLabel}>You do it</div>
              <div className={styles.modelItemName}>Core</div>
            </div>
            <div className={styles.modelDivider}></div>
            <div className={styles.modelItem}>
              <div className={styles.modelItemLabel}>We do it</div>
              <div className={styles.modelItemName}>Pro</div>
            </div>
            <div className={styles.modelDivider}></div>
            <div className={styles.modelItem}>
              <div className={styles.modelItemLabel}>I do it</div>
              <div className={styles.modelItemName}>Elite</div>
            </div>
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC CARD */}
      <section className={styles.diagnosticBlock}>
        <div className={styles.diagnosticCard}>
          <p className={styles.diagnosticCardEyebrow}>Free Entry Point</p>
          <h2 className={styles.diagnosticCardTitle}>Understand Your Performance Style</h2>
          <p className={styles.diagnosticCardDesc}>
            Understand your dominant performance style. Free. Takes 5 minutes.
          </p>
          <Link href="/diagnostic" className="btn btn--primary">
            Take the Diagnostic
          </Link>
        </div>
      </section>

      {/* PRODUCT LADDER */}
      <section className={styles.programmesSection}>
        <div className={styles.programmesSectionIntro}>
          <h2 className={styles.programmesSectionHeading}>The Limitless Programme</h2>
          <p className={styles.programmesSectionDesc}>
            16-week transformation across four modules. Same psychological framework, three levels of support.
          </p>
        </div>

        <div className={`${styles.programmesGrid} container`}>
          {/* CORE */}
          <div className={styles.programmeCard}>
            <div className={styles.programmeCardBadge}>Self-Paced</div>
            <div className={styles.programmeCardTitle}>Limitless Core</div>
            <div className={styles.programmeCardPrice}>£447</div>
            <div className={styles.programmeCardPayment}>One-time payment</div>
            <p className={styles.programmeCardDesc}>
              Self-guided learning at your own pace.
            </p>
            <ul className={styles.programmeCardFeatures}>
              <li>16-Week Programme</li>
              <li>Weekly Digests</li>
              <li>Digital PDF Journal</li>
              <li>Masterclass Videos</li>
            </ul>
            <a href="#" className="btn btn--secondary">
              Enrol now
            </a>
          </div>

          {/* PRO */}
          <div className={`${styles.programmeCard} ${styles.programmeCardFeatured}`}>
            <div className={styles.programmeCardBadge}>Live Cohort</div>
            <div className={styles.programmeCardTitle}>Limitless Pro</div>
            <div className={styles.programmeCardPrice}>£1,497</div>
            <div className={styles.programmeCardPayment}>One-time payment</div>
            <p className={styles.programmeCardDesc}>
              Cohort-based learning with Chris and your peers.
            </p>
            <ul className={styles.programmeCardFeatures}>
              <li>All Core Features</li>
              <li>Physical Journal</li>
              <li>Live Workshops</li>
              <li>Weekly Q&As</li>
              <li>Private Community</li>
              <li>Direct Support with Chris</li>
              <li className={styles.limited}>Limited spaces</li>
            </ul>
            <a href="#" className="btn btn--dark">
              Enrol now
            </a>
          </div>

          {/* ELITE */}
          <div className={styles.programmeCard}>
            <div className={styles.programmeCardBadge}>Customised</div>
            <div className={styles.programmeCardTitle}>Limitless Elite</div>
            <div className={styles.programmeCardPrice}>£9,497</div>
            <div className={styles.programmeCardPayment}>One-time payment</div>
            <p className={styles.programmeCardDesc}>
              Fully customised 1:1 mentorship.
            </p>
            <ul className={styles.programmeCardFeatures}>
              <li>Full Year 1:1 Mentorship</li>
              <li>Guided Digests with Chris</li>
              <li>Custom Programme</li>
              <li>Community Access</li>
            </ul>
            <a href="#" className="btn btn--secondary">
              Apply now
            </a>
          </div>
        </div>
      </section>

      {/* CORPORATE SECTION */}
      <section className={styles.corporateSection}>
        <div className={styles.corporateSectionInner}>
          <div className={styles.corporateSectionLabel}>For Teams & Organisations</div>
          <h2 className={styles.corporateSectionTitle}>Limitless Elevate</h2>
          <p className={styles.corporateSectionDesc}>
            Customised programmes for teams. Delivered digitally, hybrid, or in-person. No fixed pricing. We work with you.
          </p>
          <div className={styles.corporateSectionModels}>
            <span>5-15 people: Digital</span>
            <span>16-30 people: Hybrid</span>
            <span>30+ people: In-person</span>
          </div>
          <a href="#" className="btn btn--secondary">
            Get in touch
          </a>
        </div>
      </section>

      {/* WHAT YOU'LL MASTER */}
      <section className={styles.modulesSection}>
        <div className={styles.modulesSectionHeader}>
          <h2 className={styles.modulesSectionHeading}>What You'll Master</h2>
          <p className={styles.modulesSectionDesc}>Four modules designed to build a complete performance system.</p>
        </div>

        <div className={`${styles.modulesGrid} container`}>
          <div className={styles.moduleCard}>
            <div className={styles.moduleCardLabel}>Module 1</div>
            <div className={styles.moduleCardTitle}>LEARN</div>
            <p className={styles.moduleCardDesc}>
              Self-awareness, values, strengths. Deepen your awareness and understand what makes you tick.
            </p>
          </div>

          <div className={styles.moduleCard}>
            <div className={styles.moduleCardLabel}>Module 2</div>
            <div className={styles.moduleCardTitle}>MANAGE</div>
            <p className={styles.moduleCardDesc}>
              Inner voice, motivation, optimism. Win the battle in the mind and regulate your inner voice.
            </p>
          </div>

          <div className={styles.moduleCard}>
            <div className={styles.moduleCardLabel}>Module 3</div>
            <div className={styles.moduleCardTitle}>NURTURE</div>
            <p className={styles.moduleCardDesc}>
              Environment, focus, flow, pressure. Master the art of deep focus and performing under pressure.
            </p>
          </div>

          <div className={styles.moduleCard}>
            <div className={styles.moduleCardLabel}>Module 4</div>
            <div className={styles.moduleCardTitle}>THRIVE</div>
            <p className={styles.moduleCardDesc}>
              Reflection, goals, wellbeing. Turn your vision into reality with bulletproof systems.
            </p>
          </div>
        </div>
      </section>

      {/* DELIVERY */}
      <section className={styles.deliverySection}>
        <div className={styles.deliverySectionHeader}>
          <h2 className={styles.deliverySectionHeading}>Delivered Through</h2>
          <p className={styles.deliverySectionIntro}>Each tier includes the essentials. Pro and Elite add community and direct access.</p>
        </div>

        <div className={styles.deliveryGrid}>
          <div className={styles.deliveryItem}>
            <h3 className={styles.deliveryItemTitle}>Daily Exercises</h3>
            <p className={styles.deliveryItemDesc}>
              Applied journal prompts and micro-learning throughout your week. Build the habit, not just the knowledge.
            </p>
          </div>

          <div className={styles.deliveryItem}>
            <h3 className={styles.deliveryItemTitle}>Weekly Digests</h3>
            <p className={styles.deliveryItemDesc}>
              Chapter releases with practical frameworks. Connect theory to your life. Read at your own pace.
            </p>
          </div>

          <div className={styles.deliveryItem}>
            <h3 className={styles.deliveryItemTitle}>Check-ins & Workshops</h3>
            <p className={styles.deliveryItemDesc}>
              Monthly sessions for Pro and Elite members. Live Q&As, group workshops, and direct access to Chris.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className={styles.valuesSection}>
        <h2 className={styles.valuesSectionHeading}>This Isn't for Everyone</h2>

        <div className={styles.valuesGrid}>
          <div className={styles.valueItem}>
            <h3 className={styles.valueItemTitle}>Small, Curated</h3>
            <p className={styles.valueItemDesc}>
              Limited cohort sizes. We don't scale on numbers. We scale on impact.
            </p>
          </div>

          <div className={styles.valueItem}>
            <h3 className={styles.valueItemTitle}>Science-Based</h3>
            <p className={styles.valueItemDesc}>
              Applied psychology, not motivational theory. Grounded in 20+ years of elite performance research.
            </p>
          </div>

          <div className={styles.valueItem}>
            <h3 className={styles.valueItemTitle}>For High Achievers</h3>
            <p className={styles.valueItemDesc}>
              Built for people pursuing excellence. Athletes, executives, entrepreneurs, creatives, students.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />
    </>
  );
}
