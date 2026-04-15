import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brand}>
            <div className={styles.logo}>LMNTARY Performance</div>
            <p className={styles.tagline}>
              Performance psychology for those who refuse to settle. Founded by Chris Bodman.
            </p>
          </div>

          {/* Programmes Column */}
          <div>
            <div className={styles.colTitle}>Programmes</div>
            <ul className={styles.colLinks}>
              <li>
                <a href="/programmes">Limitless Core</a>
              </li>
              <li>
                <a href="/programmes">Limitless Pro</a>
              </li>
              <li>
                <a href="/programmes">Limitless Elite</a>
              </li>
              <li>
                <a href="/programmes">Elevate</a>
              </li>
            </ul>
          </div>

          {/* Insights Column */}
          <div>
            <div className={styles.colTitle}>Insights</div>
            <ul className={styles.colLinks}>
              <li>
                <a href="/insights">Newsletter</a>
              </li>
              <li>
                <a href="/insights">Case Studies</a>
              </li>
              <li>
                <a href="/newsletter">Mindset Matters Live</a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <div className={styles.colTitle}>Company</div>
            <ul className={styles.colLinks}>
              <li>
                <a href="/about">About Chris</a>
              </li>
              <li>
                <a href="/about">About LMNTARY</a>
              </li>
              <li>
                <a href="/case-studies">Case Studies</a>
              </li>
              <li>
                <a href="/about#contact">Contact</a>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <div className={styles.colTitle}>Connect</div>
            <ul className={styles.colLinks}>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </li>
              <li>
                <a href="/newsletter">Newsletter</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <div className={styles.copy}>© 2026 LMNTARY Performance</div>
          <div className={styles.social}>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
