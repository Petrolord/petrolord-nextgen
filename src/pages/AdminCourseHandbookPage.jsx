import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Loader2, BookOpen, Printer, Download, Lock, FileQuestion, GraduationCap,
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

// Same brand asset the landing page and footer use. An absolute URL so
// the standalone HTML download keeps its cover logo too.
const PETROLORD_LOGO = 'https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-4kVUt.png';

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

  const ready = Boolean(manifest && bodies && banks);

  // Standalone HTML export of the rendered handbook (element-level
  // styles embedded, KaTeX styling from its CDN copy of the same
  // version the app bundles). Print to PDF remains the polished path;
  // this gives staff a file they can archive or share.
  const downloadHandbook = () => {
    const el = document.getElementById('handbook-doc');
    if (!el || !ready) return;
    const title = `${appName(manifest.app_slug)} ${TIER_LABELS[manifest.tier] || manifest.tier} handbook`;
    const html = [
      '<!doctype html><html lang="en"><head><meta charset="utf-8">',
      `<title>${title}</title>`,
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.47/dist/katex.min.css">',
      '<style>',
      'body{font-family:Georgia,\'Times New Roman\',serif;color:#0f172a;background:#fff;',
      'max-width:820px;margin:0 auto;padding:32px 24px;line-height:1.65;}',
      'h1,h2,h3,h4{font-family:Helvetica,Arial,sans-serif;line-height:1.25;margin:1.6em 0 .5em;}',
      'h2{border-bottom:2px solid #0f172a;padding-bottom:.3em;}',
      'h3{border-bottom:1px solid #cbd5e1;padding-bottom:.25em;}',
      'p{margin:.6em 0;} ul,ol{padding-left:1.5em;} li{margin:.3em 0;}',
      'table{border-collapse:collapse;width:100%;margin:1em 0;font-size:.95em;}',
      'th,td{border:1px solid #cbd5e1;padding:6px 10px;text-align:left;}',
      'thead{background:#f1f5f9;}',
      'code{font-family:Menlo,Consolas,monospace;font-size:.9em;background:#f1f5f9;',
      'border:1px solid #e2e8f0;border-radius:3px;padding:1px 4px;}',
      'pre{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px;overflow-x:auto;}',
      'pre code{border:none;background:none;padding:0;}',
      'blockquote{border-left:3px solid #94a3b8;margin:1em 0;padding:.2em 1em;background:#f8fafc;}',
      'img{max-width:100%;} section{margin-top:2.5em;}',
      'ol.space-y-4>li,div.break-inside-avoid{border:1px solid #cbd5e1;border-radius:6px;',
      'padding:12px 14px;margin:.8em 0;}',
      '@media print{body{padding:0;} @page{size:A4 portrait;margin:14mm;}}',
      '</style></head><body>',
      el.innerHTML,
      '</body></html>',
    ].join('\n');
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${manifest.app_slug}-${manifest.tier}-handbook.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

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
          /* The app shell is a fixed-height scroll pane (h-screen +
             overflow), which clips print output to a single page.
             Flatten it so the handbook flows and paginates. */
          html, body { height: auto !important; overflow: visible !important; background: #ffffff !important; }
          .h-screen { height: auto !important; }
          .overflow-hidden, .overflow-y-auto, .overflow-x-hidden { overflow: visible !important; }
          aside, body > div header { display: none !important; }
          body * { visibility: hidden; }
          #handbook-doc, #handbook-doc * { visibility: visible; }
          /* Keep the handbook in normal flow: in-flow content paginates
             reliably where absolutely positioned content can truncate. */
          #handbook-doc { width: 100% !important; }
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
          <div className="flex gap-2">
            <Button onClick={downloadHandbook} disabled={!ready}
              className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
            <Button onClick={() => window.print()} disabled={!ready} variant="outline"
              className="border-[#BFFF00] text-[#BFFF00] hover:bg-[#BFFF00] hover:text-[#0F172A]">
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
          </div>
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
              {/* Width/height attributes, not Tailwind, so the standalone
                  HTML download sizes the logo correctly too. */}
              <img
                src={PETROLORD_LOGO}
                alt="Petrolord"
                width="56"
                height="56"
                className="mb-4 rounded-lg"
              />
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
