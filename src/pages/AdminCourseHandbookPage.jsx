import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Loader2, BookOpen, Printer, Lock, FileQuestion, GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/contexts/RoleContext';
import {
  listDeepCourses, loadLesson, flatLessons, estMinutes,
} from '@/lib/courseContent';
import { adminQuizSyllabus } from '@/services/academyService';
import { appName } from '@/lib/appNames';
import { TIER_LABELS } from '@/components/course/useCourse';
import MarkdownLesson from '@/components/course/MarkdownLesson';

// Staff-facing course handbook: the complete deep course as one
// reviewable, printable document. Lessons render from the same repo
// markdown learners read (print mode, so interactive panels degrade to
// callouts); the quiz and final exam banks come from the role-gated
// academy_admin_quiz_syllabus RPC, which serves prompts and options
// only. Answer keys never reach any client, this page included.
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const QuestionList = ({ questions }) => (
  <ol className="space-y-4">
    {(questions || []).map((qq, i) => (
      <li key={i} className="rounded-md border border-gray-700 bg-[#0F172A] p-4 break-inside-avoid">
        <p className="text-white text-sm font-medium mb-2">{i + 1}. {qq.prompt}</p>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {(qq.options || []).map((opt, oi) => (
            <p key={oi} className="text-gray-300 text-sm mb-0">
              <span className="text-gray-500 font-mono mr-1.5">{OPTION_LETTERS[oi] || oi + 1}.</span>
              {opt}
            </p>
          ))}
        </div>
      </li>
    ))}
  </ol>
);

const AdminCourseHandbookPage = () => {
  const { isViewAsSuperAdmin, isViewAsAdmin, isViewAsLecturer } = useRole();
  const isStaff = isViewAsSuperAdmin || isViewAsAdmin || isViewAsLecturer;

  const courses = useMemo(() => listDeepCourses(), []);
  const [selected, setSelected] = useState(0);
  const manifest = courses[selected] || null;

  const [bodies, setBodies] = useState(null);
  const [banks, setBanks] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!manifest || !isStaff) return undefined;
    let cancelled = false;
    setBodies(null);
    setBanks(null);
    setError(null);
    (async () => {
      try {
        const lessons = flatLessons(manifest);
        const loaded = await Promise.all(lessons.map((l) =>
          loadLesson(manifest.app_slug, manifest.tier, l.moduleKey, l.key)
            .then((raw) => [`${l.moduleKey}/${l.key}`, raw])));
        const syllabus = await adminQuizSyllabus(manifest.app_slug, manifest.tier);
        if (cancelled) return;
        setBodies(Object.fromEntries(loaded));
        setBanks(syllabus);
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => { cancelled = true; };
  }, [manifest, isStaff]);

  if (!isStaff) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center space-y-4">
        <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
        <h2 className="text-2xl font-bold text-white">Course handbook</h2>
        <p className="text-gray-400">
          The handbook is available to lecturers and administrators.
        </p>
        <Link to="/dashboard">
          <Button variant="outline" className="border-gray-600 text-gray-200">Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center space-y-4">
        <BookOpen className="h-10 w-10 text-[#BFFF00] mx-auto" />
        <h2 className="text-2xl font-bold text-white">No deep courses yet</h2>
        <p className="text-gray-400">
          The handbook fills in as course content ships.
        </p>
      </div>
    );
  }

  const moduleBankByKey = Object.fromEntries(
    (banks?.module_banks || []).map((b) => [b.module_key, b.questions]));
  const allLessons = manifest ? flatLessons(manifest) : [];
  const totalMinutes = estMinutes(allLessons);
  const moduleQuestionTotal = (banks?.module_banks || [])
    .reduce((s, b) => s + (b.questions?.length || 0), 0);

  return (
    <>
      <Helmet><title>Course handbook - Petrolord NextGen Academy</title></Helmet>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #handbook-doc, #handbook-doc * { visibility: visible !important; }
          #handbook-doc {
            position: absolute !important; left: 0 !important; top: 0 !important;
            width: 100% !important;
          }
          #handbook-doc, #handbook-doc * {
            color: #0F172A !important;
            background: #ffffff !important;
            border-color: #cbd5e1 !important;
          }
          @page { size: A4 portrait; margin: 14mm; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3 print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-[#BFFF00]" /> Course handbook
            </h1>
            <p className="mt-1 text-gray-400">
              The full course as learners see it, plus the question banks. Answer keys stay on the server and are never shown here.
            </p>
          </div>
          <Button onClick={() => window.print()}
            className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
            <Printer className="h-4 w-4 mr-1" /> Print handbook
          </Button>
        </div>

        {courses.length > 1 && (
          <Tabs value={String(selected)} onValueChange={(v) => setSelected(Number(v))} className="print:hidden">
            <TabsList className="bg-[#1E293B] border border-gray-700 flex-wrap h-auto">
              {courses.map((c, i) => (
                <TabsTrigger key={`${c.app_slug}/${c.tier}`} value={String(i)}
                  className="data-[state=active]:bg-[#BFFF00] data-[state=active]:text-[#0F172A]">
                  {appName(c.app_slug)} ({TIER_LABELS[c.tier] || c.tier})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {error && (
          <Card className="bg-[#1E293B] border-red-800">
            <CardContent className="p-4 text-red-300 text-sm">{error}</CardContent>
          </Card>
        )}

        {manifest && (bodies === null || banks === null) && !error && (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" />
          </div>
        )}

        {manifest && bodies && banks && (
          <div id="handbook-doc" className="space-y-8">
            <div className="border-b border-gray-700 pb-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-1">
                Petrolord NextGen Academy staff handbook
              </p>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-[#BFFF00]" />
                {appName(manifest.app_slug)}: {TIER_LABELS[manifest.tier] || manifest.tier}
              </h2>
              <p className="text-sm text-gray-400 mt-1 mb-0">
                Content version {manifest.content_version}. {manifest.modules.length} modules,{' '}
                {allLessons.length} lessons, about {Math.round(totalMinutes / 60)} hours of study.{' '}
                {moduleQuestionTotal} module quiz questions and {(banks.final_bank || []).length} final
                exam questions on file (prompts only; grading is server-side).
              </p>
            </div>

            {manifest.modules.map((mod, mi) => (
              <section key={mod.key}>
                <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">
                  Module {mi + 1}: {mod.title}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    {mod.lessons.length} lessons, ~{estMinutes(mod.lessons)} min
                  </span>
                </h3>

                {mod.lessons.map((les, li) => (
                  <div key={les.key} className="mt-6 break-inside-avoid-page">
                    <h4 className="text-lg font-semibold text-[#BFFF00]">
                      {mi + 1}.{li + 1} {les.title}
                      <span className="ml-2 text-xs font-normal text-gray-500">~{les.est_minutes} min</span>
                    </h4>
                    <div className="mt-2">
                      <MarkdownLesson
                        raw={bodies[`${mod.key}/${les.key}`] || ''}
                        app={manifest.app_slug}
                        tier={manifest.tier}
                        moduleKey={mod.key}
                        printMode
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileQuestion className="h-5 w-5 text-[#BFFF00]" />
                    Module quiz bank ({(moduleBankByKey[mod.key] || []).length} questions)
                  </h4>
                  <div className="mt-3">
                    <QuestionList questions={moduleBankByKey[mod.key]} />
                  </div>
                </div>
              </section>
            ))}

            <section>
              <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-2">
                Final exam bank ({(banks.final_bank || []).length} questions)
              </h3>
              <div className="mt-3">
                <QuestionList questions={banks.final_bank} />
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminCourseHandbookPage;
