'use client';

import { useEffect, useState } from 'react';
import styles from './ReadingProgress.module.css';

/**
 * Fixed thin bar at the top of the viewport that fills as the user scrolls
 * through the page. Sits above the nav. Uses rAF-throttled scroll + resize
 * listeners. No portals — just a fixed-position div.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    function compute() {
      rafId = null;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const pct = (window.scrollY / scrollable) * 100;
      setProgress(Math.min(100, Math.max(0, pct)));
    }

    function onScrollOrResize() {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(compute);
    }

    compute();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={styles.track} aria-hidden="true">
      <div
        className={styles.bar}
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
