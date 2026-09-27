import React from 'react';
import { ShieldCheck } from 'lucide-react';
import PracticeCourseBadge from '@/components/course/PracticeCourseBadge';
import { practiceDates, reviewLine } from '@/lib/courseType';

// The practice course notice for a course page: the badge, what a practice
// course is, and the two dates (when the sources were checked, and when the
// course is next re-read against them). Renders nothing for an app or engine
// course, so a page can include it unconditionally.
const PracticeCourseNotice = ({ app, apps, now }) => {
  const dates = practiceDates(app, apps);
  if (!dates) return null;
  const line = reviewLine(dates, now);
  return (
    <div className="rounded-md border border-sky-400/30 bg-sky-400/5 p-4 text-sm text-gray-300 flex items-start gap-3" data-practice-notice={app}>
      <ShieldCheck className="h-5 w-5 text-sky-300 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <PracticeCourseBadge />
          {line && <span className="text-xs text-gray-400" data-review-line>{line}</span>}
        </div>
        <p className="mb-0">
          This is a practice course. It teaches from a dated, cited set of Acts, regulations and published guidance,
          with no engine and no calculator: each lesson closes with written scenario work, and each tier&apos;s
          certificate is issued when you pass that tier&apos;s final exam.
        </p>
      </div>
    </div>
  );
};

export default PracticeCourseNotice;
