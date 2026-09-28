import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  BookOpen, Lock, CheckCircle2, GraduationCap, Award, ArrowRight, Clock, FileQuestion,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getManifest, hasDeepCourse, flatLessons, estMinutes } from '@/lib/courseContent';
import { listAcademyApps, listMyEnrollments, TIERS } from '@/services/academyService';
import { useCourse, moduleState, TIER_LABELS } from '@/components/course/useCourse';
import LockedCard from '@/components/course/LockedCard';
import { activeTiers, pickCourseTier, courseTierPath } from '@/lib/learningGate';
import { courseNameFrom } from '@/lib/appNames';
import { courseTypeOf } from '@/lib/courseType';
import PracticeCourseNotice from '@/components/course/PracticeCourseNotice';
import PracticeCertificateCard from '@/components/course/PracticeCertificateCard';

// Course home: syllabus + per-module progress for one (app, tier). The
// tier tabs only list tiers that have authored content; enrollment (and
// every unlock) is enforced server-side.
const CourseHomePage = () => {
  const { appSlug, tier: pathTier } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const tiers = TIERS.filter((t) => getManifest(appSlug, t));
  // A learner can hold several active tiers of one course (the lower
  // tier's row stays active after certifying), so enrolment is per tier.
  const enrolledTiers = useMemo(() => activeTiers(enrollments, appSlug), [enrollments, appSlug]);
  const tier = pickCourseTier({
    tiers, queryTier: searchParams.get('tier'), pathTier, enrollments, app: appSlug,
  });

  const { manifest, progress, loading } = useCourse(appSlug, tier);

  useEffect(() => {
    listAcademyApps().then(setApps).catch(() => {});
    listMyEnrollments().then(setEnrollments).catch(() => {});
  }, []);

  if (!hasDeepCourse(appSlug)) {
    return <LockedCard title="No course content here yet" backTo="/dashboard" backLabel="Back to dashboard" />;
  }

  const appName = courseNameFrom(apps, appSlug);
  const practice = courseTypeOf(appSlug, apps) === 'practice';
  const isEnrolled = enrolledTiers.has(tier);
  const base = `/dashboard/apps/${appSlug}/course/${tier}`;
  const allLessons = manifest ? flatLessons(manifest) : [];
  const totalMinutes = estMinutes(allLessons);
  const readSet = new Set();
  (progress?.modules || []).forEach((m) => (m.lesson_keys_read || []).forEach((k) => readSet.add(`${m.key}/${k}`)));
  const firstUnread = allLessons.find((l) => !readSet.has(`${l.moduleKey}/${l.key}`));
  const pct = allLessons.length ? Math.round((100 * readSet.size) / allLessons.length) : 0;

  return (
    <>
      <Helmet><title>{appName} Course - Petrolord NextGen Academy</title></Helmet>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-pl-accent-text" /> {appName}
            </h1>
            <p className="mt-1 text-pl-muted">
              {manifest?.modules?.length} modules, {allLessons.length} lessons, about {Math.round(totalMinutes / 60)} hours of study. Modules unlock in order; each closes with a quiz, {practice
                ? 'and the course closes with a final exam that issues the certificate.'
                : 'the course closes with a final exam and a graded practical.'}
            </p>
          </div>
          {isEnrolled && firstUnread && (
            <Link to={`${base}/${firstUnread.moduleKey}/${firstUnread.key}`}>
              <Button className="font-semibold">
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>

        <PracticeCourseNotice app={appSlug} apps={apps} />

        {tiers.length > 1 && (
          <Tabs value={tier} onValueChange={(t) => navigate(courseTierPath(appSlug, t))}>
            <TabsList className="flex-wrap h-auto justify-start">
              {tiers.map((t) => (
                <TabsTrigger key={t} value={t}>
                  {TIER_LABELS[t] || t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {!isEnrolled && (
          <Card className="border-pl-accent/60">
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-pl-text text-sm mb-0">
                You are not enrolled in the {TIER_LABELS[tier] || tier} course. You can browse the syllabus; enrolling opens the lessons, quizzes and certification.
              </p>
              <Link to="/dashboard/enroll">
                <Button size="sm" className="font-semibold">Enrol</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {isEnrolled && (
          <div>
            <Progress value={pct} className="h-2" />
            <p className="text-xs text-pl-muted mt-1">{readSet.size}/{allLessons.length} lessons read ({pct}%)</p>
          </div>
        )}

        <div className="space-y-4">
          {(manifest?.modules || []).map((mod, mi) => {
            const st = moduleState(progress, mod.key);
            const unlocked = isEnrolled && st.unlocked;
            const mins = estMinutes(mod.lessons);
            return (
              <Card key={mod.key} className={`${!unlocked ? 'opacity-70' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-pl-text text-lg flex items-center gap-2">
                      {st.complete
                        ? <CheckCircle2 className="h-5 w-5 text-pl-success-text" />
                        : unlocked
                          ? <BookOpen className="h-5 w-5 text-pl-accent-text" />
                          : <Lock className="h-5 w-5 text-pl-muted" />}
                      Module {mi + 1}: {mod.title}
                    </CardTitle>
                    <span className="text-xs text-pl-muted flex items-center gap-1 shrink-0">
                      <Clock className="h-3.5 w-3.5" /> ~{mins} min
                    </span>
                  </div>
                  <CardDescription>
                    {mod.lessons.length} lessons
                    {isEnrolled && `, ${st.lessons_read} read`}
                    {st.quiz_passed ? ', quiz passed' : (isEnrolled && st.lessons_read === mod.lessons.length ? ', quiz open' : '')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-2">
                  {unlocked ? (
                    <>
                      <Link to={`${base}/${mod.key}`}>
                        <Button size="sm" variant="outline">Open module</Button>
                      </Link>
                      {st.lessons_read === mod.lessons.length && !st.quiz_passed && (
                        <Link to={`${base}/quiz/${mod.key}`}>
                          <Button size="sm" className="font-semibold">
                            <FileQuestion className="h-4 w-4 mr-1" /> Take the module quiz
                          </Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-pl-muted mb-0">
                      {isEnrolled ? 'Locked. Finish the previous module (all lessons plus its quiz) to open this one.' : 'Enrol to open this module.'}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className={`${!progress?.final_exam?.unlocked ? 'opacity-70' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-pl-text text-lg flex items-center gap-2">
                {progress?.final_exam?.passed
                  ? <CheckCircle2 className="h-5 w-5 text-pl-success-text" />
                  : progress?.final_exam?.unlocked
                    ? <FileQuestion className="h-5 w-5 text-pl-accent-text" />
                    : <Lock className="h-5 w-5 text-pl-muted" />}
                Final exam
              </CardTitle>
              <CardDescription>Randomized exam across the whole course. Opens when every module is complete.</CardDescription>
            </CardHeader>
            <CardContent>
              {progress?.final_exam?.passed ? (
                <p className="text-pl-success-text text-sm mb-0">Passed.</p>
              ) : progress?.final_exam?.unlocked ? (
                <Link to={`${base}/exam`}>
                  <Button size="sm" className="font-semibold">Sit the exam</Button>
                </Link>
              ) : (
                <p className="text-xs text-pl-muted mb-0">Locked.</p>
              )}
            </CardContent>
          </Card>

          {practice ? (
            <PracticeCertificateCard app={appSlug} tier={tier} progress={progress} />
          ) : (
            <Card className={`${!progress?.capstone?.unlocked ? 'opacity-70' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-pl-text text-lg flex items-center gap-2">
                  {progress?.capstone?.passed
                    ? <CheckCircle2 className="h-5 w-5 text-pl-success-text" />
                    : progress?.capstone?.unlocked
                      ? <Award className="h-5 w-5 text-pl-accent-text" />
                      : <Lock className="h-5 w-5 text-pl-muted" />}
                  Capstone practical
                </CardTitle>
                <CardDescription>The graded interpretation exercise. Passing it issues your certificate.</CardDescription>
              </CardHeader>
              <CardContent>
                {progress?.capstone?.passed ? (
                  <p className="text-pl-success-text text-sm mb-0">Passed. See <Link to="/dashboard/certificates" className="text-pl-primary-text hover:text-pl-primary-text-hover hover:underline">your certificates</Link>.</p>
                ) : progress?.capstone?.unlocked ? (
                  <Link to={`${base}/capstone`}>
                    <Button size="sm" className="font-semibold">Open the capstone</Button>
                  </Link>
                ) : (
                  <p className="text-xs text-pl-muted mb-0">Locked until the final exam is passed.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {loading && <p className="text-xs text-pl-muted">Refreshing progress...</p>}
      </div>
    </>
  );
};

export default CourseHomePage;
