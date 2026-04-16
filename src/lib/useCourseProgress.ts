'use client';

import { useEffect, useState } from 'react';
import {
  CourseProgress,
  PROGRESS_EVENT,
  getCourseProgress,
} from './lesson-progress';

/**
 * Reactively read progress for a course. Updates on same-tab writes (via the
 * custom event our writer dispatches) and cross-tab writes (via the 'storage'
 * event the browser fires automatically).
 */
export function useCourseProgress(courseSlug: string): CourseProgress {
  const [progress, setProgress] = useState<CourseProgress>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(getCourseProgress(courseSlug));
    setHydrated(true);

    function refresh() {
      setProgress(getCourseProgress(courseSlug));
    }

    function onCustom(e: Event) {
      const detail = (e as CustomEvent).detail as
        | { courseSlug?: string }
        | undefined;
      if (!detail || detail.courseSlug === courseSlug) refresh();
    }

    function onStorage(e: StorageEvent) {
      if (!e.key || e.key === `lmntary-progress:${courseSlug}`) refresh();
    }

    window.addEventListener(PROGRESS_EVENT, onCustom);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, onCustom);
      window.removeEventListener('storage', onStorage);
    };
  }, [courseSlug]);

  // Before hydration we return an empty object so server + first client render
  // match. Checkmarks fade in a tick later once localStorage is readable.
  return hydrated ? progress : {};
}
