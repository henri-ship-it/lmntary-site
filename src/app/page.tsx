import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";
import LogoTicker from "@/components/LogoTicker";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={`container container--narrow`}>
          <p className={styles.heroEyebrow}>Performance Psychology</p>
          <h1 className={styles.heroHeading}>
            TRAIN YOUR MIND LIKE YOU TRAIN YOUR BODY.
          </h1>
          <p className={styles.heroSub}>
            Understand how you operate. See what&apos;s holding you back. Applied performance psychology, distilled into a system that works.
          </p>
          <div className={styles.heroActions}>
            <Link href="/diagnostic" className="btn btn--primary">
              Performance Diagnostic
            </Link>
            <Link href="/programmes" className="btn btn--secondary">
              Explore Programme
            </Link>
          </div>
          {/* MINDSET MATTERS in Hero */}
          <div className={styles.heroNewsletter}>
            <p className={styles.heroNewsletterLabel}>Join Mindset Matters</p>
            <p className={styles.heroNewsletterDesc}>Weekly performance insights. 1,000+ subscribers.</p>
            <NewsletterSignup
              wrapperClass={styles.heroNewsletterForm}
              inputClass={styles.heroNewsletterInput}
            />
          </div>
        </div>
      </section>

      {/* LOGO STRIP */}
      <section className={styles.logos}>
        <p className={styles.logosLabel}>Trusted by athletes and organisations at</p>
        <LogoTicker />
      </section>

      {/* MANIFESTO */}
      <section className={styles.manifesto}>
        <div className={styles.manifestoInner}>
          <div className={styles.manifestoBody}>
            <p>
              Performance psychology often gets lost in theory and jargon. The most common question we get? <strong>"What does a performance psychologist actually do?"</strong>
            </p>
            <p>
              We help you understand your operating system. Your strengths, your blind spots, your triggers. Then we give you practical frameworks to work with them, not against them.
            </p>
          </div>

          <div className={styles.manifestoDivider}></div>

          <p className={styles.manifestoClosing}>
            Behaviour change starts with a mindset change.<br />
            <span className="serif-italic">Transformation comes through application.</span>
          </p>
        </div>
      </section>

      {/* DIAGNOSTIC (Central CTA) */}
      <section className={styles.diagnostic}>
        <div className={styles.diagnosticInner}>
          <p className={styles.diagnosticEyebrow}>Free Performance Diagnostic</p>
          <h2 className={styles.diagnosticHeading}>
            What's your performance profile?
          </h2>
          <p className={styles.diagnosticDesc}>
            Understand your dominant behavioural style, see your blind spots, and get a personalised blueprint for how you actually operate. Free. Takes 5 minutes.
          </p>
          <div className={styles.diagnosticDetails}>
            <span className={styles.diagnosticDetail}><span>●</span> Takes 5 minutes</span>
            <span className={styles.diagnosticDetail}><span>●</span> Personalised results</span>
            <span className={styles.diagnosticDetail}><span>●</span> Completely free</span>
          </div>
          <Link href="/diagnostic" className="btn btn--primary">
            Take the Diagnostic
          </Link>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className={styles.programmes}>
        <div className={styles.limitlessIntro}>
          <p className={styles.limitlessIntroEyebrow}>The Limitless Programme</p>
          <h2 className={styles.limitlessIntroHeading}>
            A 16-week system to get out of your own way and <span className="serif-italic">perform without limits.</span>
          </h2>
          <p className={styles.limitlessIntroDesc}>
            Four modules. Self-awareness, mindset, habits, and performance under pressure. Built on 20+ years of elite performance psychology. Same programme, three levels of support.
          </p>
        </div>

        <div className={`${styles.programmesModel} container`}>
          <div className={styles.programmesModelItem}>
            <div className={styles.programmesModelLabel}>You do it</div>
            <div className={styles.programmesModelName}>Core</div>
          </div>
          <div className={styles.programmesModelDivider}></div>
          <div className={styles.programmesModelItem}>
            <div className={styles.programmesModelLabel}>We do it</div>
            <div className={styles.programmesModelName}>Pro</div>
          </div>
          <div className={styles.programmesModelDivider}></div>
          <div className={styles.programmesModelItem}>
            <div className={styles.programmesModelLabel}>I do it</div>
            <div className={styles.programmesModelName}>Elite</div>
          </div>
        </div>

        <div className={`${styles.programmesGrid} container`}>
          {/* CORE */}
          <div className={styles.programmeCard}>
            <div className={styles.programmeCardBadge}>Self-Paced</div>
            <div className={styles.programmeCardTitle}>Limitless Core</div>
            <div className={styles.programmeCardPrice}>£447</div>
            <div className={styles.programmeCardPayment}>One-time payment</div>
            <p className={styles.programmeCardDesc}>
              Perfect for self-starters who thrive on independent learning.
            </p>
            <ul className={styles.programmeCardFeatures}>
              <li>16-Week Programme</li>
              <li>Weekly Digests</li>
              <li>Digital PDF Journal</li>
              <li>Masterclass Videos</li>
            </ul>
            <Link href="/programmes" className="btn btn--secondary">
              Enrol now
            </Link>
          </div>

          {/* PRO */}
          <div className={`${styles.programmeCard} ${styles.programmeCardFeatured}`}>
            <div className={styles.programmeCardBadge}>Live Cohort</div>
            <div className={styles.programmeCardTitle}>Limitless Pro</div>
            <div className={styles.programmeCardPrice}>£1,497</div>
            <div className={styles.programmeCardPayment}>One-time payment</div>
            <p className={styles.programmeCardDesc}>
              Ideal for those who want a more immersive, guided experience.
            </p>
            <ul className={styles.programmeCardFeatures}>
              <li>All Core Features (16-Week Programme)</li>
              <li>Physical Journal</li>
              <li>Live Workshops</li>
              <li>Weekly Q&As</li>
              <li>Private Community</li>
              <li>Direct Support with Chris</li>
              <li className={styles.limited}>Limited spaces</li>
            </ul>
            <Link href="/programmes" className="btn btn--dark">
              Enrol now
            </Link>
          </div>

          {/* ELITE */}
          <div className={styles.programmeCard}>
            <div className={styles.programmeCardBadge}>Customised</div>
            <div className={styles.programmeCardTitle}>Limitless Elite</div>
            <div className={styles.programmeCardPrice}>£9,497</div>
            <div className={styles.programmeCardPayment}>One-time payment</div>
            <p className={styles.programmeCardDesc}>
              For those ready to invest in intensive, personalised growth.
            </p>
            <ul className={styles.programmeCardFeatures}>
              <li>Full Year 1:1 Mentorship</li>
              <li>Guided Digests with Chris</li>
              <li>Custom Programme</li>
              <li>Community Access</li>
            </ul>
            <Link href="/programmes" className="btn btn--secondary">
              Apply now
            </Link>
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsHeader}>
          <h2 className={styles.testimonialsHeading}>Case Studies</h2>
          <p className={styles.testimonialsSub}>Real people. Real shifts. In their own words.</p>
        </div>

        <div className={`${styles.testimonialsFeatured} container`}>
          <div className={styles.testimonialsVideo}>
            <div className={styles.testimonialsVideoPlaceholder}>
              <div className={styles.testimonialsVideoPlay}>&#9654;</div>
              <div className={styles.testimonialsVideoName}>Jack Barber</div>
              <div className={styles.testimonialsVideoProgramme}>Mental clarity: 4 &#8594; 9. Life fulfilment: 7 &#8594; 10.</div>
            </div>
          </div>
        </div>

        <div className={`${styles.testimonialsGrid} container`}>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialCardQuote}>
              I've learned to be more of a doer rather than overthinking. I'm now stressed about things I need to stress about rather than sweating the small stuff. It's helped me personally, physically, mentally, and massively within the business.
            </p>
            <div className={styles.testimonialCardAuthor}>Lewis Hudd</div>
            <div className={styles.testimonialCardProgramme}>Business owner. Went from paralysis by analysis to clarity.</div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialCardQuote}>
              I approached Chris wanting to equip myself better. A hell of a lot has changed since then. I've shifted from forcing things to finding smarter solutions. It remains top of mind daily and the impact has been profound.
            </p>
            <div className={styles.testimonialCardAuthor}>Jenz Robinson</div>
            <div className={styles.testimonialCardProgramme}>Founder, PFCA & Gym Owners Network</div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialCardQuote}>
              One of the biggest things for me was self-acceptance. I felt like I understood myself more than ever. The programme gives you permission to stop fighting who you are and start leveraging it.
            </p>
            <div className={styles.testimonialCardAuthor}>Tim Reid</div>
            <div className={styles.testimonialCardProgramme}>Discovered blind spots he didn't know he had.</div>
          </div>
        </div>

        <div className={styles.testimonialsCta}>
          <Link href="/case-studies" className="btn btn--ghost">
            Read all case studies
          </Link>
        </div>
      </section>

      {/* MINDSET MATTERS NEWSLETTER (replaces Insights) */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterSectionInner}>
          <div className={styles.newsletterSectionContent}>
            <p className={styles.newsletterSectionEyebrow}>Weekly Newsletter</p>
            <h2 className={styles.newsletterSectionHeading}>Mindset Matters</h2>
            <p className={styles.newsletterSectionDesc}>
              Performance psychology you actually read. The one newsletter people say they look forward to opening. Join 1,000+ subscribers.
            </p>
            <NewsletterSignup
              wrapperClass={styles.newsletterSectionForm}
              inputClass={styles.newsletterSectionInput}
            />
          </div>
          <div className={styles.newsletterSectionPreview}>
            <div className={styles.newsletterSectionStat}>
              <div className={styles.newsletterSectionStatNumber}>1,000+</div>
              <div className={styles.newsletterSectionStatLabel}>Subscribers</div>
            </div>
            <div className={styles.newsletterSectionStat}>
              <div className={styles.newsletterSectionStatNumber}>67%</div>
              <div className={styles.newsletterSectionStatLabel}>Open rate</div>
            </div>
            <div className={styles.newsletterSectionStat}>
              <div className={styles.newsletterSectionStatNumber}>Weekly</div>
              <div className={styles.newsletterSectionStatLabel}>Every Sunday</div>
            </div>
            <Link href="/newsletter" className={styles.newsletterSectionLink}>
              Read past issues
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP PREVIEW */}
      <section className={styles.shop}>
        <div className={styles.shopHeader}>
          <h2 className={styles.shopHeading}>Shop</h2>
          <Link href="/shop" className={styles.shopLink}>
            View all
          </Link>
        </div>
        <div className={styles.shopGrid}>
          <Link href="/shop#journal" className={styles.shopCard}>
            <div className={styles.shopCardImage}>&#128211;</div>
            <div className={styles.shopCardTitle}>Stitchbound Journal Set</div>
            <div className={styles.shopCardPrice}>£50</div>
          </Link>
          <Link href="/shop#posters" className={styles.shopCard}>
            <div className={styles.shopCardImage}>&#9723;</div>
            <div className={styles.shopCardTitle}>Performance Posters</div>
            <div className={styles.shopCardPrice}>From £30</div>
          </Link>
          <Link href="/shop#calendar" className={styles.shopCard}>
            <div className={styles.shopCardImage}>&#128197;</div>
            <div className={styles.shopCardTitle}>Wall Calendar 2027</div>
            <div className={styles.shopCardPrice}>£25</div>
          </Link>
          <Link href="/shop#book" className={styles.shopCard}>
            <div className={styles.shopCardImage}>&#128213;</div>
            <div className={styles.shopCardTitle}>The Coffee Table Book</div>
            <div className={styles.shopCardPrice}>Coming soon</div>
          </Link>
        </div>
      </section>
    </>
  );
}
