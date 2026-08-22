import React, { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { getManifest } from '@/lib/courseContent';
import { getModuleQuiz, submitModuleQuiz } from '@/services/academyService';
import { useCourse } from '@/components/course/useCourse';
import QuizRunner from '@/components/course/QuizRunner';
import LockedCard from '@/components/course/LockedCard';

// Module quiz. Serving, grading, pass marks and cooldowns are all
// server-side; this page only names the module and routes onward.
const ModuleQuizPage = () => {
  const { appSlug, tier, moduleKey } = useParams();
  const { refresh } = useCourse(appSlug, tier);

  const manifest = getManifest(appSlug, tier);
  const base = `/dashboard/apps/${appSlug}/course/${tier}`;
  const modIndex = (manifest?.modules || []).findIndex((m) => m.key === moduleKey);
  const mod = modIndex >= 0 ? manifest.modules[modIndex] : null;
  const nextMod = modIndex >= 0 ? manifest.modules[modIndex + 1] : null;

  const fetchQuiz = useCallback(
    () => getModuleQuiz(appSlug, tier, moduleKey),
    [appSlug, tier, moduleKey],
  );
  const submit = useCallback(
    (attemptId, answers) => submitModuleQuiz(attemptId, answers),
    [],
  );

  if (!manifest || !mod) {
    return <LockedCard title="Module not found" backTo={base} />;
  }

  return (
    <>
      <Helmet><title>{mod.title} quiz - Petrolord NextGen Academy</title></Helmet>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Link to={`${base}/${mod.key}`} className="text-sm text-gray-400 hover:text-gray-200 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to the module
        </Link>
        <QuizRunner
          title={`Module ${modIndex + 1} quiz: ${mod.title}`}
          description="Answer every question. Passing this quiz opens the next module."
          fetchQuiz={fetchQuiz}
          submitQuiz={submit}
          onPassed={refresh}
          continueTo={nextMod ? `${base}/${nextMod.key}` : base}
          continueLabel={nextMod ? `Open module ${modIndex + 2}` : 'Back to the course'}
        />
      </div>
    </>
  );
};

export default ModuleQuizPage;
