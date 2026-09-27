import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2, BookOpen, PenLine, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { hasScope, getCourseProgress, listAcademyApps } from '@/services/academyService';
import { getManifest, hasDeepCourse, flatLessons } from '@/lib/courseContent';
import { courseNameFrom } from '@/lib/appNames';
import LearningModeGate from '@/components/academy/LearningModeGate';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import PracticeCourseNotice from '@/components/course/PracticeCourseNotice';
import PracticeCertificateCard from '@/components/course/PracticeCertificateCard';

const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const TIER_NAMES = { beginner: 'Associate', intermediate: 'Professional', advanced: 'Expert' };

// The Learning Mode page of a PRACTICE course (Catalog Regroup plan section
// 3): no engine, no calculator panel and no numeric capstone. It shows the
// practice course notice (the badge, the date the sources were checked and
// the review date), the syllabus read from the course manifests, what the
// written scenario work is, and in the place of a capstone the tier's
// certificate, issued from its final exam. Every course-specific word comes
// from the props and the manifests, so a later practice course reuses it.
export function PracticeCourseBody({ app, subtitle, intro, apps, tier, setTier, progress }) {
  const name = courseNameFrom(apps, app);
  const manifest = getManifest(app, tier);
  const lessons = manifest ? flatLessons(manifest) : [];
  return (
    <div className="relative max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex flex-wrap items-center gap-2">
          <BookOpen className="h-7 w-7 text-[#BFFF00]" /> {name}
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
        </h1>
        {subtitle && <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{subtitle}</p>}
        {intro && <p className="mt-2 text-sm text-gray-300">{intro}</p>}
      </div>

      <PracticeCourseNotice app={app} apps={apps} />

      <DeepCourseBanner app={app} tier={tier} />

      <div className="flex gap-2">
        {LEARN_TIERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTier(t)}
            className={`px-3 py-1.5 rounded-md border text-sm ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}
          >
            {TIER_NAMES[t]}
          </button>
        ))}
      </div>

      {manifest && (
        <Card className="bg-[#1E293B] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> {TIER_NAMES[tier]} syllabus</CardTitle>
            <CardDescription>{manifest.modules.length} modules and {lessons.length} lessons.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {manifest.modules.map((m) => (
              <div key={m.key} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-0">{TIER_NAMES[tier]}, module {m.order}</p>
                <p className="text-white text-sm font-medium mb-1">{m.title}</p>
                <ul className="text-xs text-gray-400 space-y-0.5 mb-0 list-none pl-0">
                  {m.lessons.map((l) => <li key={l.key}>{l.title}</li>)}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-[#1E293B] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><PenLine className="h-5 w-5 text-[#BFFF00]" /> Written scenario work</CardTitle>
          <CardDescription>
            A practice course has no calculator. Each lesson closes with a short written exercise on one of the course&apos;s
            synthetic Ekene contracts: you write the note, the checklist or the decision, and the lesson then sets out the
            reading its cited sources support. The module quizzes and the final exam are scenario questions, and every keyed
            answer traces to a cited passage of an Act, a regulation or published guidance.
          </CardDescription>
        </CardHeader>
      </Card>

      <PracticeCertificateCard app={app} tier={tier} progress={progress} />

      {hasDeepCourse(app, tier) && (
        <Link to={`/dashboard/apps/${app}/course/${tier}`}>
          <Button className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
            Open the {TIER_NAMES[tier]} course <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      )}
    </div>
  );
}

const PracticeCourseLearningPage = ({ app, subtitle, intro, gateText }) => {
  const { toast } = useToast();
  const [gate, setGate] = useState({ loading: true, allowed: false });
  const [apps, setApps] = useState([]);
  const [tier, setTier] = useState('beginner');
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    listAcademyApps().then(setApps).catch(() => {});
    hasScope(app, 'learning')
      .then((allowed) => setGate({ loading: false, allowed }))
      .catch((e) => {
        setGate({ loading: false, allowed: false });
        toast({ title: 'Could not open the course', description: e.message, variant: 'destructive' });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app]);

  useEffect(() => {
    if (!gate.allowed) return;
    setProgress(null);
    if (hasDeepCourse(app, tier)) {
      getCourseProgress(app, tier).then(setProgress).catch(() => setProgress(null));
    }
  }, [app, tier, gate.allowed]);

  const name = courseNameFrom(apps, app);
  if (gate.loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" /></div>;
  }
  if (!gate.allowed) {
    return (
      <LearningModeGate app={app} title={`${name}: Learning Mode locked`}>
        <p>{gateText}</p>
      </LearningModeGate>
    );
  }
  return (
    <>
      <Helmet><title>{`${name} (Learning Mode) - Petrolord NextGen Academy`}</title></Helmet>
      <PracticeCourseBody app={app} subtitle={subtitle} intro={intro} apps={apps} tier={tier} setTier={setTier} progress={progress} />
    </>
  );
};

export default PracticeCourseLearningPage;
