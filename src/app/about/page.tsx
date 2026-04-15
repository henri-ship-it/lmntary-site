import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About LMNTARY Performance | Performance Psychology',
  description:
    'Meet the team behind LMNTARY Performance. Led by Chris Bodman, a performance psychologist with 20+ years of elite coaching experience.',
};

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className="container container--narrow">
          <h1 className={styles.heroHeading}>About</h1>
          <p className={styles.heroSub}>Most of us live our lives by accident. Fulfilment comes when we live our lives on purpose.</p>
        </div>
      </section>

      {/* COMPANY SECTION */}
      <section className={`${styles.section} ${styles.sectionBordered}`}>
        <div className="container">
          <div className={styles.companyIntro}>
            <h2 className={styles.companyIntroName}>LMNTARY Performance</h2>
            <p className={styles.companyIntroSubtitle}>(Pronounced: elementary)</p>
            <p className={styles.companyIntroDescription}>
              Founded to develop individuals' skills and behaviours through mindset training. We believe that the four performance elements (Learn, Manage, Nurture,
              and Thrive) are fundamental to how humans operate. When these elements are harmonised, they produce extraordinary results.
            </p>
            <div className={styles.companyIntroPhilosophy}>
              <div className={styles.philosophyItem}>
                <div className={styles.philosophyItemLabel}>Our philosophy</div>
                <div className={styles.philosophyItemText}>Learn how you work. Manage your energy. Nurture your resilience. Thrive consistently.</div>
              </div>
              <div className={styles.philosophyItem}>
                <div className={styles.philosophyItemLabel}>The foundation</div>
                <div className={styles.philosophyItemText}>Performance is a skill. Like any skill, it can be learned, refined, and mastered with intention and practice.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHRIS BODMAN SECTION */}
      <section className={`${styles.section} ${styles.sectionBordered}`}>
        <div className="container">
          <div className={styles.teamMember}>
            <div className={styles.teamMemberContent}>
              <div className={styles.teamMemberPhoto}>CB</div>
              <div className={styles.teamMemberBio}>
                <h2 className={styles.teamMemberName}>Chris Bodman</h2>
                <div className={styles.teamMemberTitle}>Performance Psychologist</div>
                <p className={styles.teamMemberDescription}>
                  For over 20 years, Chris has worked with Olympians, elite athletes, and business leaders to unlock their potential. He has partnered with the ECB,
                  RFU, BOA, and UKSI, helping some of the world's highest performers develop the mental skills that drive consistent excellence.
                </p>
                <p className={styles.teamMemberDescription}>
                  With a Master's degree in Psychology, Chris started his career in elite sport, witnessing the transformative power of mental training. He saw that
                  the principles enabling top performers to deliver under pressure were universally applicable, but rarely accessible beyond the elite level. So he
                  decided to change that.
                </p>
                <div className={styles.teamMemberQuote}>
                  For two decades, I've explored what enables high performers to deliver consistent results. The principles are universal. The application is personal.
                </div>
                <div className={styles.teamMemberCredentials}>
                  <strong>Partnerships and credentials:</strong> ECB. RFU. BOA. UKSI. Good Energy. Sport and Recreation Alliance. Supporting athletes and organisations
                  across cricket, rugby, winter sports, business, and nonprofits.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HENRI BALLS SECTION */}
      <section className={`${styles.section} ${styles.sectionBordered}`}>
        <div className="container">
          <div className={`${styles.teamMember} ${styles.teamMemberSecondary}`}>
            <div className={styles.teamMemberContent}>
              <div className={styles.teamMemberPhoto}>HB</div>
              <div className={styles.teamMemberBio}>
                <h2 className={styles.teamMemberName}>Henri Balls</h2>
                <div className={styles.teamMemberTitle}>Design and Marketing Lead</div>
                <p className={styles.teamMemberDescription}>
                  Henri brings creative direction and strategic marketing expertise to LMNTARY. With a background in digital design and brand communication, Henri
                  ensures that our core message—that performance is learnable—is presented clearly and compellingly across every touchpoint.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className={`${styles.section} ${styles.sectionBordered}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How we think</h2>
          </div>
          <div className={styles.philosophy}>
            <div className={styles.philosophyItem}>
              <p className={styles.philosophyText}>Train your mind like you would train your body. With skill and information instead of weights and food.</p>
            </div>
            <div className={styles.philosophyItem}>
              <p className={styles.philosophyText}>There are two types of people: those that live by design, and those that live by default.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECT SECTION */}
      <section className={`${styles.section} ${styles.sectionBordered}`} id="contact">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Connect</h2>
            <p className={styles.sectionSubtitle}>Get in touch with LMNTARY Performance</p>
          </div>
          <div className={styles.connect}>
            <p className={styles.connectDescription}>Reach out to discuss how we can support your performance journey. We work with athletes, teams, and business leaders.</p>
            <div className={styles.connectChannels}>
              <div className={styles.connectChannel}>
                <div className={styles.connectChannelTitle}>Email</div>
                <a href="mailto:hello@lmntary.com" className={styles.connectChannelLink}>
                  hello@lmntary.com
                </a>
              </div>
              <div className={styles.connectChannel}>
                <div className={styles.connectChannelTitle}>LinkedIn</div>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.connectChannelLink}>
                  LinkedIn
                </a>
              </div>
              <div className={styles.connectChannel}>
                <div className={styles.connectChannelTitle}>Instagram</div>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.connectChannelLink}>
                  Instagram
                </a>
              </div>
              <div className={styles.connectChannel}>
                <div className={styles.connectChannelTitle}>YouTube</div>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.connectChannelLink}>
                  YouTube
                </a>
              </div>
            </div>
            <div>
              <p className={styles.newsletterIntro}>Join our newsletter for insights on performance psychology and high performance.</p>
              <form className={styles.newsletterForm} action="#" method="POST">
                <input type="email" className={styles.newsletterInput} placeholder="Enter your email" required />
                <button type="submit" className="btn btn--primary">
                  Subscribe
                </button>
              </form>
              <p className={styles.newsletterNote}>We respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
