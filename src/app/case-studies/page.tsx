import Link from 'next/link';
import styles from './page.module.css';

export default function CaseStudiesPage() {
  return (
    <>
      {/* PAGE HERO */}
      <section className={styles.pageHero}>
        <div className="container container--narrow">
          <h1 className={styles.pageHeroHeading}>CASE STUDIES</h1>
          <p className={styles.pageHeroSub}>Real people. Real shifts. In their own words.</p>
        </div>
      </section>

      {/* FEATURED VIDEO */}
      <section className={styles.featuredVideo}>
        <div className={styles.featuredVideoContainer}>
          <div className={styles.featuredVideoCard}>
            <div className={styles.featuredVideoPlayer}>
              <div className={styles.featuredVideoPlaceholder}>
                <div className={styles.featuredVideoPlayBtn}>▶</div>
                <span>Play Video</span>
              </div>
            </div>
            <div className={styles.featuredVideoContent}>
              <div className={styles.featuredVideoMetric}>
                Mental clarity: 4 → 9. Life fulfilment: 7 → 10.
              </div>
              <div className={styles.featuredVideoName}>Jack Barber</div>
              <div className={styles.featuredVideoContext}>
                Came in stuck, self-sabotaging, disconnected. Found his way back through 16 weeks of systematic work. This is his story.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDIES GRID */}
      <section className={styles.caseStudies}>
        <div className="container">
          <div className={styles.caseStudiesGrid}>
            {/* Lewis Hudd */}
            <div className={styles.caseStudyCard}>
              <div className={styles.caseStudyCardQuote}>
                I've learned to be more of a doer rather than overthinking. I'm now stressed about things I need to stress about rather than sweating the small stuff. It's helped me personally, physically, mentally, and massively within the business.
              </div>
              <div className={styles.caseStudyCardAuthor}>Lewis Hudd</div>
              <div className={styles.caseStudyCardTitle}>Business Owner</div>
              <div className={styles.caseStudyCardDivider}></div>
              <div className={styles.caseStudyCardImpact}>Went from paralysis by analysis to clarity and action.</div>
            </div>

            {/* Jenz Robinson */}
            <div className={styles.caseStudyCard}>
              <div className={styles.caseStudyCardQuote}>
                I approached Chris wanting to equip myself better. A hell of a lot has changed since then. I've shifted from forcing things to finding smarter solutions. It remains top of mind daily and the impact has been profound.
              </div>
              <div className={styles.caseStudyCardAuthor}>Jenz Robinson</div>
              <div className={styles.caseStudyCardTitle}>Founder, PFCA & Gym Owners Network</div>
              <div className={styles.caseStudyCardDivider}></div>
              <div className={styles.caseStudyCardImpact}>Replaced exhausting force with natural momentum.</div>
            </div>

            {/* Tim Reid */}
            <div className={styles.caseStudyCard}>
              <div className={styles.caseStudyCardQuote}>
                One of the biggest things for me was self-acceptance. I felt like I understood myself more than ever. The programme gives you permission to stop fighting who you are and start leveraging it.
              </div>
              <div className={styles.caseStudyCardAuthor}>Tim Reid</div>
              <div className={styles.caseStudyCardTitle}>Entrepreneur</div>
              <div className={styles.caseStudyCardDivider}></div>
              <div className={styles.caseStudyCardImpact}>Discovered blind spots he didn't know he had.</div>
            </div>

            {/* Charlotte Purdue */}
            <div className={styles.caseStudyCard}>
              <div className={styles.caseStudyCardQuote}>
                The biggest shift was learning to reframe change. Rather than viewing different training approaches as a step back, I now see them as stepping stones to better performance.
              </div>
              <div className={styles.caseStudyCardAuthor}>Charlotte Purdue</div>
              <div className={styles.caseStudyCardTitle}>British Marathon Champion</div>
              <div className={styles.caseStudyCardDivider}></div>
              <div className={styles.caseStudyCardImpact}>Turned setbacks into catalysts for growth.</div>
            </div>

            {/* Luke Pearce */}
            <div className={styles.caseStudyCard}>
              <div className={styles.caseStudyCardQuote}>
                I've worked with Chris for over 6 years. His calmness and demeanour aids my performance and helps in applying perspective to a highly pressured job.
              </div>
              <div className={styles.caseStudyCardAuthor}>Luke Pearce</div>
              <div className={styles.caseStudyCardTitle}>Rugby Union Referee, RFU</div>
              <div className={styles.caseStudyCardDivider}></div>
              <div className={styles.caseStudyCardImpact}>Clarity in high-pressure split-second decisions.</div>
            </div>

            {/* Rob Cooper */}
            <div className={styles.caseStudyCard}>
              <div className={styles.caseStudyCardQuote}>
                I'm so much more aware of how to play to my strengths and more aware of my triggers that cause inaction. Understanding my values has been huge for me.
              </div>
              <div className={styles.caseStudyCardAuthor}>Rob Cooper</div>
              <div className={styles.caseStudyCardTitle}>Performance Coach</div>
              <div className={styles.caseStudyCardDivider}></div>
              <div className={styles.caseStudyCardImpact}>Changed how he approaches every decision.</div>
            </div>

            {/* Tom Norcross */}
            <div className={styles.caseStudyCard}>
              <div className={styles.caseStudyCardQuote}>
                I feel like I understand myself a lot better now. That shift has been huge. I've gained tools I can use in my own life, with friends and family, and in my coaching business.
              </div>
              <div className={styles.caseStudyCardAuthor}>Tom Norcross</div>
              <div className={styles.caseStudyCardTitle}>Coach and Consultant</div>
              <div className={styles.caseStudyCardDivider}></div>
              <div className={styles.caseStudyCardImpact}>Self-understanding that extends beyond work.</div>
            </div>

            {/* Tracy Wright */}
            <div className={styles.caseStudyCard}>
              <div className={styles.caseStudyCardQuote}>
                He can see through the noise and pinpoint exactly the challenge, even if you don't know what it is.
              </div>
              <div className={styles.caseStudyCardAuthor}>Tracy Wright</div>
              <div className={styles.caseStudyCardTitle}>Director</div>
              <div className={styles.caseStudyCardDivider}></div>
              <div className={styles.caseStudyCardImpact}>Clarity from complexity.</div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaSectionInner}>
          <h2 className={styles.ctaSectionHeading}>Ready to understand how you operate?</h2>
          <div className={styles.ctaSectionActions}>
            <Link href="/diagnostic" className="btn btn--primary">
              Take the Diagnostic
            </Link>
            <Link href="/programmes" className="btn btn--secondary">
              Explore Programmes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
