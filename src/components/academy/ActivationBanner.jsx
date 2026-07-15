import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { useActivation } from '@/hooks/useActivation';

// Shown to gated learners who haven't cleared the activation gate.
const ActivationBanner = () => {
  const { needsActivation, status } = useActivation();
  if (!needsActivation) return null;

  const next = !status?.orientation_completed
    ? 'Start with a one-minute orientation'
    : 'Take the short entry assessment';

  return (
    <div className="rounded-lg border border-[#BFFF00]/40 bg-[#BFFF00]/10 p-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-6 w-6 text-[#BFFF00]" />
        <div>
          <p className="text-white font-medium">Activate your account to unlock Learning Mode</p>
          <p className="text-sm text-gray-300">{next}.</p>
        </div>
      </div>
      <Link
        to="/dashboard/get-started"
        className="inline-flex items-center gap-1 rounded-md bg-[#BFFF00] px-4 py-2 text-sm font-semibold text-[#0F172A] hover:bg-[#A8E600]"
      >
        Get started <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default ActivationBanner;
