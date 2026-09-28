import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { useActivation } from '@/hooks/useActivation';

// Shown to gated learners who haven't cleared the activation gate. Rendered
// only on the dashboard home, inside the design-system scope (theme roles).
const ActivationBanner = () => {
  const { needsActivation, status } = useActivation();
  if (!needsActivation) return null;

  const next = !status?.orientation_completed
    ? 'Start with a one-minute orientation'
    : 'Take the short entry assessment';

  return (
    <div className="rounded-lg border border-pl-accent/60 bg-pl-accent/10 p-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-6 w-6 text-pl-accent-text" aria-hidden="true" />
        <div>
          <p className="text-pl-text font-medium">Activate your account to unlock Learning Mode</p>
          <p className="text-sm text-pl-muted">{next}.</p>
        </div>
      </div>
      <Link
        to="/dashboard/get-started"
        className="inline-flex items-center gap-1 rounded-md bg-pl-primary px-4 py-2 text-sm font-semibold text-pl-primary-fg hover:bg-pl-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus focus-visible:ring-offset-2 ring-offset-pl-bg"
      >
        Get started <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default ActivationBanner;
