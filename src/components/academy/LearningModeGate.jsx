import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Lock, GraduationCap, ArrowRight, RefreshCw, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActivation } from '@/hooks/useActivation';
import { useRole } from '@/contexts/RoleContext';
import { listMyEnrollments } from '@/services/academyService';
import { gateState, getStartedPath, coursePath, doorLabel } from '@/lib/learningGate';

// The Learning Mode gate every course page shows when academy_has_scope()
// says no. Before 2026-09-09 it offered one Enrol button whatever the
// reason, so a learner whose employer had already assigned a seat was
// sent to the Enroll page, found the row marked active, and had nowhere
// to go. It now reads the viewer's own enrolments and activation state
// and shows the single step that opens the course. Access itself is
// still decided server-side; this only chooses the wording and the link.

const primary = 'bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold';
const outline = 'border-gray-600 text-gray-200';

export default function LearningModeGate({ app, title, onRetry, children }) {
  const { isViewAsStudent } = useRole();
  const { status: activation, loading: activationLoading } = useActivation();
  const [enrollments, setEnrollments] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listMyEnrollments()
      .then((rows) => { if (!cancelled) setEnrollments(rows || []); })
      .catch(() => { if (!cancelled) setEnrollments([]); });
    return () => { cancelled = true; };
  }, [app]);

  const loading = activationLoading || enrollments === null;
  const state = loading ? null : gateState({ isLearner: !!isViewAsStudent, activation, enrollments, app });
  const here = coursePath(app);
  const retry = onRetry || (() => window.location.reload());

  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="text-gray-400">{children}</div>

      {loading && (
        <div className="flex justify-center text-gray-500"><Loader2 className="h-5 w-5 animate-spin" /></div>
      )}

      {state?.kind === 'activate' && (
        <div className="space-y-3">
          <p className="text-gray-200">
            Your {doorLabel(state.door)} is active. One step remains: activate your account with a
            one-minute orientation and a short placement assessment, and this course opens.
          </p>
          <div className="flex justify-center">
            <Link to={getStartedPath(here)}>
              <Button className={primary}><GraduationCap className="h-4 w-4 mr-1" /> Activate account</Button>
            </Link>
          </div>
        </div>
      )}

      {state?.kind === 'stalled' && (
        <div className="space-y-3">
          <p className="text-gray-200">
            Your {doorLabel(state.door)} is active and your account is activated, but access did not
            resolve on this load. Try again; if it stays locked, contact support with the course name.
          </p>
          <div className="flex justify-center gap-3">
            <Button className={primary} onClick={retry}><RefreshCw className="h-4 w-4 mr-1" /> Try again</Button>
            <Link to="/dashboard/enroll"><Button variant="outline" className={outline}>My enrollments</Button></Link>
          </div>
        </div>
      )}

      {state?.kind === 'pending' && (
        <div className="space-y-3">
          <p className="text-gray-200">
            Your {doorLabel(state.door)} is waiting for payment. Complete it from your enrollments and the
            course opens as soon as the payment is confirmed.
          </p>
          <div className="flex justify-center">
            <Link to="/dashboard/enroll">
              <Button className={primary}><CreditCard className="h-4 w-4 mr-1" /> Complete payment</Button>
            </Link>
          </div>
        </div>
      )}

      {(state?.kind === 'enrol' || state?.kind === 'enrol_and_activate') && (
        <div className="space-y-3">
          <div className="flex justify-center gap-3">
            <Link to="/dashboard/enroll">
              <Button className={primary}><GraduationCap className="h-4 w-4 mr-1" /> Enrol</Button>
            </Link>
            {state.kind === 'enrol_and_activate' && (
              <Link to={getStartedPath(here)}>
                <Button variant="outline" className={outline}>Activate account <ArrowRight className="h-4 w-4 ml-1" /></Button>
              </Link>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Sponsored by your employer? Your training lead assigns the seat; the course opens here as soon
            as it is assigned, with no enrolment step on your side.
          </p>
        </div>
      )}
    </div>
  );
}
