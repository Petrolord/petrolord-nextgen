import React, { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { getManifest } from '@/lib/courseContent';
import { getFinalExam, submitFinalExam } from '@/services/academyService';
import { useCourse, TIER_LABELS } from '@/components/course/useCourse';
import QuizRunner from '@/components/course/QuizRunner';
import LockedCard from '@/components/course/LockedCard';

// Tier final exam. The server refuses to serve it until every module is
// complete; passing it unlocks the capstone practical in the app.
const FinalExamPage = () => {
  const { appSlug, tier } = useParams();
  const { progress, refresh } = useCourse(appSlug, tier);

  const manifest = getManifest(appSlug, tier);
  const base = `/dashboard/apps/${appSlug}/course/${tier}`;

  const fetchQuiz = useCallback(() => getFinalExam(appSlug, tier), [appSlug, tier]);
  const submit = useCallback(
    (attemptId, answers) => submitFinalExam(attemptId, answers),
    [],
  );

  if (!manifest) {
    return <LockedCard title="No course content here yet" backTo="/dashboard" backLabel="Back to dashboard" />;
  }
  if (progress && !progress.final_exam?.unlocked && !progress.final_exam?.passed) {
    return (
      <LockedCard
        title="The final exam is locked"
        note="Complete every module (all lessons plus each quiz) to sit the exam."
        backTo={base}
      />
    );
  }

  return (
    <>
      <Helmet><title>Final exam - Petrolord NextGen Academy</title></Helmet>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Link to={base} className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Course home
        </Link>
        <QuizRunner
          title={`Final exam: ${TIER_LABELS[tier] || tier}`}
          description="A randomized exam across the whole course. Passing it unlocks the capstone practical."
          fetchQuiz={fetchQuiz}
          submitQuiz={submit}
          onPassed={refresh}
          continueTo={`/dashboard/apps/${appSlug}`}
          continueLabel="Open the capstone"
        />
      </div>
    </>
  );
};

export default FinalExamPage;
