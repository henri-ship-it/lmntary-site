import Link from 'next/link';
import NewsletterSignup from '@/components/NewsletterSignup';
import styles from './page.module.css';

export default function ShopPage() {
  return (
    <>
      {/* HERO HEADER */}
      <section className={styles.hero}>
        <div className="container container--narrow">
          <h1 className={styles.heroHeading}>SHOP</h1>
          <p className={styles.heroSub}>
            Tools and objects for the pursuit of excellence.
          </p>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section className={styles.products}>
        <div className="container">
          <div className={styles.productsGrid}>
            {/* Stitchbound Journal Set */}
            <div className={styles.productCard}>
              <div className={styles.productCardImage}>📓</div>
              <h2 className={styles.productCardTitle}>Stitchbound Journal Set</h2>
              <p className={styles.productCardDesc}>
                The physical companion to the Limitless programme. Designed for daily reflection, weekly digests, and the 16-week journey. The same journal included in Pro and Elite, available standalone.
              </p>
              <div className={styles.productCardFooter}>
                <span className={styles.productCardPrice}>£50</span>
                <button className="btn btn--secondary">Add to cart</button>
              </div>
            </div>

            {/* Performance Posters */}
            <div className={styles.productCard}>
              <div className={styles.productCardImage}>◻</div>
              <h2 className={styles.productCardTitle}>Performance Posters</h2>
              <p className={styles.productCardDesc}>
                Performance principles as wall art. Clean, minimal designs built around key frameworks and ideas from the LMNTARY Performance system.
              </p>
              <div className={styles.productCardFooter}>
                <span className={styles.productCardPrice}>From £30</span>
                <button className="btn btn--secondary">View collection</button>
              </div>
            </div>

            {/* Wall Calendar 2027 */}
            <div className={styles.productCard}>
              <div className={styles.productCardImage}>📅</div>
              <h2 className={styles.productCardTitle}>Wall Calendar 2027</h2>
              <p className={styles.productCardDesc}>
                Monthly themes aligned to the four performance elements. Each month includes a principle, a reflection prompt, and a framework visual.
              </p>
              <div className={styles.productCardFooter}>
                <span className={styles.productCardPrice}>£25</span>
                <button className="btn btn--secondary">Add to cart</button>
              </div>
            </div>

            {/* The Coffee Table Book */}
            <div className={styles.productCard}>
              <div className={styles.productCardImage}>📕</div>
              <h2 className={styles.productCardTitle}>The Coffee Table Book</h2>
              <p className={styles.productCardDesc}>
                The LMNTARY Performance philosophy in a premium physical format. Performance psychology principles, visual frameworks, stories, and insights.
              </p>
              <div className={styles.productCardFooter}>
                <span className={styles.productCardPrice}>Coming soon</span>
                <button className="btn btn--disabled">Pre-order</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING STATEMENT */}
      <section className={styles.shopClosing}>
        <div className="container container--narrow">
          <p className={styles.shopClosingText}>
            Everything in the shop is designed to reinforce what you learn in Limitless. These aren't merchandise. They're tools.
          </p>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className={styles.newsletter}>
        <div className="container container--narrow">
          <h2 className={styles.newsletterHeading}>Mindset Matters</h2>
          <p className={styles.newsletterDesc}>Weekly performance insights. Practical applications. No fluff.</p>
          <NewsletterSignup
            wrapperClass={styles.newsletterForm}
            inputClass={styles.newsletterInput}
            noteClass={styles.newsletterNote}
          />
        </div>
      </section>
    </>
  );
}
