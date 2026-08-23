import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
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

// Course home: syllabus + per-module progress for one (app, tier). The
// tier tabs only list tiers that have authored content; enrollment (and
// every unlock) is enforced server-side.
const CourseHomePage = () => {
  const { appSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [apps, setApps] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const tiers = TIERS.filter((t) => getManifest(appSlug, t));
  const requestedTier = searchParams.get('tier');
  const enrolledTier = useMemo(() => {
    const active = enrollments.filter((e) => e.app_slug === appSlug && e.status === 'active');
    return active.length ? active[active.length - 1].course_tier : null;
  }, [enrollments, appSlug]);
  const tier = tiers.includes(requestedTier) ? requestedTier
    : (tiers.includes(enrolledTier) ? enrolledTier : tiers[0]);

  const { manifest, progress, loading } = useCourse(appSlug, tier);

  useEffect(() => {
    listAcademyApps().then(setApps).catch(() => {});
    listMyEnrollments().then(setEnrollments).catch(() => {});
  }, []);

  if (!hasDeepCourse(appSlug)) {
    return <LockedCard title="No course content here yet" backTo="/dashboard" backLabel="Back to dashboard" />;
  }

  const appName = apps.find((a) => a.slug === appSlug)?.name || appSlug;
  const isEnrolled = enrolledTier === tier;
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
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-[#BFFF00]" /> {appName}
            </h1>
            <p className="mt-1 text-gray-400">
              {manifest?.modules?.length} modules, {allLessons.length} lessons, about {Math.round(totalMinutes / 60)} hours of study. Modules unlock in order; each closes with a quiz, the course closes with a final exam and a graded practical.
            </p>
          </div>
          {isEnrolled && firstUnread && (
            <Link to={`${base}/${firstUnread.moduleKey}/${firstUnread.key}`}>
              <Button className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>

        {tiers.length > 1 && (
          <Tabs value={tier} onValueChange={(t) => setSearchParams({ tier: t })}>
            <TabsList className="bg-[#1E293B] border border-gray-700">
              {tiers.map((t) => (
                <TabsTrigger key={t} value={t} className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-[#0F172A]">
                  {TIER_LABELS[t] || t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {!isEnrolled && (
          <Card className="bg-[#1E293B] border-[#BFFF00]/40">
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-gray-300 text-sm mb-0">
                You are not enrolled in the {TIER_LABELS[tier] || tier} course. You can browse the syllabus; enrolling opens the lessons, quizzes and certification.
              </p>
              <Link to="/dashboard/enroll">
                <Button size="sm" className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">Enrol</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {isEnrolled && (
          <div>
            <Progress value={pct} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">{readSet.size}/{allLessons.length} lessons read ({pct}%)</p>
          </div>
        )}

        <div className="space-y-4">
          {(manifest?.modules || []).map((mod, mi) => {
            const st = moduleState(progress, mod.key);
            const unlocked = isEnrolled && st.unlocked;
            const mins = estMinutes(mod.lessons);
            return (
              <Card key={mod.key} className={`bg-[#1E293B] border-gray-700 ${!unlocked ? 'opacity-70' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      {st.complete
                        ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        : unlocked
                          ? <BookOpen className="h-5 w-5 text-[#BFFF00]" />
                          : <Lock className="h-5 w-5 text-gray-500" />}
                      Module {mi + 1}: {mod.title}
                    </CardTitle>
                    <span className="text-xs text-gray-500 flex items-center gap-1 shrink-0">
                      <Clock className="h-3.5 w-3.5" /> ~{mins} min
                    </span>
                  </div>
                  <CardDescription>
                    {mod.lessons.length} lessons
                    {isEnrolled && ` , ${st.lessons_read} read`}
                    {st.quiz_passed ? ' , quiz passed' : (isEnrolled && st.lessons_read === mod.lessons.length ? ' , quiz open' : '')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-2">
                  {unlocked ? (
                    <>
                      <Link to={`${base}/${mod.key}`}>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-200">Open module</Button>
                      </Link>
                      {st.lessons_read === mod.lessons.length && !st.quiz_passed && (
                        <Link to={`${base}/quiz/${mod.key}`}>
                          <Button size="sm" className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
                            <FileQuestion className="h-4 w-4 mr-1" /> Take the module quiz
                          </Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-500 mb-0">
                      {isEnrolled ? 'Locked. Finish the previous module (all lessons plus its quiz) to open this one.' : 'Enrol to open this module.'}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className={`bg-[#1E293B] border-gray-700 ${!progress?.final_exam?.unlocked ? 'opacity-70' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                {progress?.final_exam?.passed
                  ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  : progress?.final_exam?.unlocked
                    ? <FileQuestion className="h-5 w-5 text-[#BFFF00]" />
                    : <Lock className="h-5 w-5 text-gray-500" />}
                Final exam
              </CardTitle>
              <CardDescription>Randomized exam across the whole course. Opens when every module is complete.</CardDescription>
            </CardHeader>
            <CardContent>
              {progress?.final_exam?.passed ? (
                <p className="text-emerald-300 text-sm mb-0">Passed.</p>
              ) : progress?.final_exam?.unlocked ? (
                <Link to={`${base}/exam`}>
                  <Button size="sm" className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">Sit the exam</Button>
                </Link>
              ) : (
                <p className="text-xs text-gray-500 mb-0">Locked.</p>
              )}
            </CardContent>
          </Card>

          <Card className={`bg-[#1E293B] border-gray-700 ${!progress?.capstone?.unlocked ? 'opacity-70' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                {progress?.capstone?.passed
                  ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  : progress?.capstone?.unlocked
                    ? <Award className="h-5 w-5 text-[#BFFF00]" />
                    : <Lock className="h-5 w-5 text-gray-500" />}
                Capstone practical
              </CardTitle>
              <CardDescription>The graded interpretation exercise. Passing it issues your certificate.</CardDescription>
            </CardHeader>
            <CardContent>
              {progress?.capstone?.passed ? (
                <p className="text-emerald-300 text-sm mb-0">Passed. See <Link to="/dashboard/certificates" className="text-[#BFFF00] hover:underline">your certificates</Link>.</p>
              ) : progress?.capstone?.unlocked ? (
                <Link to={`${base}/capstone`}>
                  <Button size="sm" className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">Open the capstone</Button>
                </Link>
              ) : (
                <p className="text-xs text-gray-500 mb-0">Locked until the final exam is passed.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {loading && <p className="text-xs text-gray-600">Refreshing progress...</p>}
      </div>
    </>
  );
};

export default CourseHomePage;
