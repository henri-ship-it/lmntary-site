'use client';

import styles from './LogoTicker.module.css';

const logos = [
  { src: '/logos/client-01.svg', alt: 'Client 1' },
  { src: '/logos/client-02.svg', alt: 'Client 2' },
  { src: '/logos/client-03.svg', alt: 'Client 3' },
  { src: '/logos/client-04.svg', alt: 'Client 4' },
  { src: '/logos/client-05.svg', alt: 'Client 5' },
  { src: '/logos/client-06.svg', alt: 'Client 6' },
  { src: '/logos/client-07.svg', alt: 'Client 7' },
  { src: '/logos/client-08.svg', alt: 'Client 8' },
  { src: '/logos/client-09.svg', alt: 'Client 9' },
  { src: '/logos/client-10.svg', alt: 'Client 10' },
  { src: '/logos/client-11.svg', alt: 'Client 11' },
];

export default function LogoTicker() {
  return (
    <div className={styles.ticker}>
      <div className={styles.track}>
        {/* Render logos twice for seamless loop */}
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} className={styles.item}>
            <img src={logo.src} alt={logo.alt} className={styles.img} />
          </div>
        ))}
      </div>
    </div>
  );
}
