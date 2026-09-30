import React from 'react';
import { PRACTICE_BADGE_LABEL } from '@/lib/courseType';

// The visible "Practice course" badge (Catalog Regroup plan section 3). Two
// looks: `home` for the homepage catalogue card (LandingPage.css
// .pill.practice) and `app` for the dashboard and course pages, on the info
// roles. It renders nothing unless `show` is true, so a caller passes the
// course type test and the badge stays inert for app and engine courses.
const PracticeCourseBadge = ({ show = true, variant = 'app' }) => {
  if (!show) return null;
  if (variant === 'home') {
    return <span className="pill practice" data-course-type="practice">{PRACTICE_BADGE_LABEL}</span>;
  }
  return (
    <span
      data-course-type="practice"
      className="text-xs px-2 py-0.5 rounded-full bg-pl-info-bg text-pl-info-text border border-pl-info/40 font-medium"
    >
      {PRACTICE_BADGE_LABEL}
    </span>
  );
};

export default PracticeCourseBadge;
