import React from 'react';
import { PRACTICE_BADGE_LABEL } from '@/lib/courseType';
import { useThemeClass } from '@/design/themeClass';

// The visible "Practice course" badge (Catalog Regroup plan section 3). Two
// looks: `home` for the light homepage catalogue card (LandingPage.css
// .pill.practice) and `app` for the dark dashboard and course pages. It
// renders nothing unless `show` is true, so a caller passes the course type
// test and the badge stays inert for app and engine courses. The `app` look
// is scope-aware (batch 1B): the info roles inside a design-system scope,
// the legacy sky classes outside one. The `home` look never changes.
const PracticeCourseBadge = ({ show = true, variant = 'app' }) => {
  const tc = useThemeClass();
  if (!show) return null;
  if (variant === 'home') {
    return <span className="pill practice" data-course-type="practice">{PRACTICE_BADGE_LABEL}</span>;
  }
  return (
    <span
      data-course-type="practice"
      className={tc(
        'text-xs px-2 py-0.5 rounded-full bg-sky-400/15 text-sky-300 border border-sky-400/40 font-medium',
        'text-xs px-2 py-0.5 rounded-full bg-pl-info-bg text-pl-info-text border border-pl-info/40 font-medium',
      )}
    >
      {PRACTICE_BADGE_LABEL}
    </span>
  );
};

export default PracticeCourseBadge;
