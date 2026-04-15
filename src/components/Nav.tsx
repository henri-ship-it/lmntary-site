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
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          LMNTARY Performance
        </Link>

        <ul className={`${styles.links} ${isOpen ? styles.linksActive : ''}`}>
          <li>
            <a href="/programmes" onClick={handleLinkClick}>
              Programmes
            </a>
          </li>
          <li>
            <a href="/insights" onClick={handleLinkClick}>
              Insights
            </a>
          </li>
          <li>
            <a href="/shop" onClick={handleLinkClick}>
              Shop
            </a>
          </li>
          <li>
            <a href="/about" onClick={handleLinkClick}>
              About
            </a>
          </li>
          <li>
            <a
              href="/diagnostic"
              className="btn btn--primary"
              style={{ padding: '10px 20px', fontSize: '13px' }}
              onClick={handleLinkClick}
            >
              Take the Diagnostic
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
          <span className={styles.toggleSpan}></span>
        </button>
      </div>
    </nav>
  );
}
