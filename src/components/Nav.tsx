'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Nav.module.css';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`${styles.nav} backdrop-blur-xl`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <img src="/logos/logo-dark.svg" alt="LMNTARY Performance" className={styles.logoImg} />
        </Link>

        <ul className={`${styles.links} ${isOpen ? styles.linksActive : ''}`}>
          <li><a href="/programmes" onClick={handleLinkClick}>Programme</a></li>
          <li><a href="/learn" onClick={handleLinkClick}>Learn</a></li>
          <li><a href="/newsletter" onClick={handleLinkClick}>Newsletter</a></li>
          <li><a href="/shop" onClick={handleLinkClick}>Shop</a></li>
          <li><a href="/about" onClick={handleLinkClick}>About</a></li>
          <li>
            <a href="/diagnostic" className={styles.cta} onClick={handleLinkClick}>
              Join Today
            </a>
          </li>
        </ul>

        <button
          className={styles.toggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.toggleSpan}></span>
          <span className={styles.toggleSpan}></span>
        </button>
      </div>
    </nav>
  );
}
