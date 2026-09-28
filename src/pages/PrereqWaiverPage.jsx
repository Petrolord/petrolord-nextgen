import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, BadgeCheck, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  listAcademyApps, getPrereqWaiverExam, submitPrereqWaiverExam,
} from '@/services/academyService';
import QuizRunner from '@/components/course/QuizRunner';
import LockedCard from '@/components/course/LockedCard';

// The free prerequisite waiver exam (owner decision 2026-09-08). Well Data
// Manager stays the root of the geoscience path; a learner who already
// knows it passes this randomized exam (the root's Beginner final-exam
// bank, 70%, no enrolment, no sponsor seat) and the prerequisite is met
// for 12 months. Everything that matters is server-side
// (academy_get_prereq_waiver_exam / academy_submit_prereq_waiver_exam).
// Design system (batch 2A): inside the signed-in scope, on theme roles;
// QuizRunner and LockedCard are the 1B course kit and theme themselves.
const PrereqWaiverPage = () => {
  const { appSlug } = useParams();
  const [root, setRoot] = useState(undefined);

  useEffect(() => {
    listAcademyApps()
      .then((apps) => setRoot(apps.find((a) => a.slug === appSlug && apps.some((b) => b.prereq_slug === a.slug)) || null))
      .catch(() => setRoot(null));
  }, [appSlug]);

  const fetchQuiz = useCallback(() => getPrereqWaiverExam(appSlug), [appSlug]);
  const submit = useCallback((attemptId, answers) => submitPrereqWaiverExam(attemptId, answers), []);

  if (root === undefined) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-pl-primary-text" /></div>;
  }
  if (!root) {
    return <LockedCard title="No waiver exam for this course" note="Waiver exams exist only for courses that are a prerequisite of others." backTo="/dashboard/enroll" backLabel="Back to Enroll" />;
  }

  return (
    <>
      <Helmet><title>{root.name} waiver exam - Petrolord NextGen Academy</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 space-y-6">
        <Link to="/dashboard/enroll" className="text-sm text-pl-muted hover:text-pl-text flex items-center gap-1 w-fit">
          <ArrowLeft className="h-4 w-4" /> Back to Enroll
        </Link>
        <Card className="border-pl-accent/60">
          <CardContent className="p-4 flex items-start gap-3 text-sm text-pl-text">
            <BadgeCheck className="h-5 w-5 text-pl-accent-text shrink-0 mt-0.5" aria-hidden="true" />
            <p className="mb-0">
              {root.name} is the prerequisite root of the geoscience path. This exam is free, needs no
              enrollment and takes no sponsor seat. Pass it and every course that lists {root.name} as a
              prerequisite opens to you for 12 months. It earns no certificate: the {root.name} Beginner
              course, which is also free, does that.
            </p>
          </CardContent>
        </Card>
        <QuizRunner
          title={`${root.name} waiver exam`}
          description="A randomized exam across the whole Beginner course. Passing it satisfies the prerequisite; a failed attempt can be retaken, with a cooldown after repeated failures."
          fetchQuiz={fetchQuiz}
          submitQuiz={submit}
          continueTo="/dashboard/enroll"
          continueLabel="Enroll in the next course"
        />
      </div>
    </>
  );
};

export default PrereqWaiverPage;
