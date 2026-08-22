import { useCallback, useEffect, useState } from 'react';
import { getManifest } from '@/lib/courseContent';
import { getCourseProgress } from '@/services/academyService';

// Shared data hook for the deep-course pages: the (static) manifest plus
// the learner's server-side progress. Progress is the authority on locks;
// the UI states are cosmetic mirrors of what the RPCs enforce.
export function useCourse(appSlug, tier) {
  const manifest = getManifest(appSlug, tier);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setProgress(await getCourseProgress(appSlug, tier));
    } catch {
      setProgress(null);
    }
  }, [appSlug, tier]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const p = await getCourseProgress(appSlug, tier);
        if (!cancelled) setProgress(p);
      } catch {
        if (!cancelled) setProgress(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [appSlug, tier]);

  return { manifest, progress, loading, refresh };
}

// The progress fragment for one module key (or a zeroed default).
export function moduleState(progress, moduleKey) {
  const m = (progress?.modules || []).find((x) => x.key === moduleKey);
  return m || {
    key: moduleKey, lessons_total: 0, lessons_read: 0, lesson_keys_read: [],
    quiz_passed: false, quiz_attempts: 0, quiz_locked_until: null,
    unlocked: false, complete: false,
  };
}

export const TIER_LABELS = {
  beginner: 'Beginner (Associate)',
  intermediate: 'Intermediate (Professional)',
  advanced: 'Advanced (Expert)',
};
