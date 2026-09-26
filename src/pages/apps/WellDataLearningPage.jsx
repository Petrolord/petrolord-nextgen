import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import {
  Loader2, HardDrive, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import LasInspector from '@/components/course/panels/welldata/LasInspector';
import ImportExplorer from '@/components/course/panels/welldata/ImportExplorer';
import CampaignExplorer from '@/components/course/panels/welldata/CampaignExplorer';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { WELLDATA_CASE_FILES } from '@/content/capstone-cases/welldata';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
  getCourseProgress,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

const APP = 'welldata';
const TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'Anatomy of a LAS file',
    body: 'Four header sections (~Version, ~Well, ~Curve, ~Parameter) then the ~ASCII data block. VERS and WRAP in ~V decide how the rest is read.' },
  { n: 2, title: 'The NULL value',
    body: 'Missing samples are flagged with the ~Well NULL value (usually -999.25). The parser turns them into gaps; QC counts them per curve. A curve can be completely dead.' },
  { n: 3, title: 'Wrapped files',
    body: 'LAS 1.2 files with WRAP=YES split each depth step across several data lines. The sample count, not the line count, is what matters.' },
  { n: 4, title: 'Depth units',
    body: 'Depth can arrive in feet or metres. Everything downstream works in metres: a 2 ft step is 0.6096 m exactly (1 ft = 0.3048 m by definition).' },
  { n: 5, title: 'QC before use',
    body: 'Before any log goes to interpretation, confirm the depth range and step, per-curve sample and null counts, and that curve statistics look physical.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Well Data Management: Learning Mode locked">
      <p>
        Enrol in the Well Data Management course and activate your account to open Well Data Manager in
        Learning Mode against the bundled teaching LAS files. This course is the root of the
        geoscience path: certifying here unlocks enrollment in the other geoscience courses.
      </p>
    </LearningModeGate>
  );
}


const WellDataLearningPage = () => {
  const { toast } = useToast();
  const { actualRole } = useRole();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [capstone, setCapstone] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const allowed = await hasScope(APP, 'learning');
        const quota = allowed ? await getQuota(APP) : null;
        setGate({ loading: false, allowed, quota });
      } catch (e) {
        setGate({ loading: false, allowed: false, quota: null });
        toast({ title: 'Could not open the app', description: e.message, variant: 'destructive' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!gate.allowed) return;
    setCapstone(null);
    setAnswers({});
    setResult(null);
    getCapstone(APP, tier).then(setCapstone).catch(() => setCapstone(null));
    // Deep-path state: which finishing steps the course has unlocked.
    setCourseProgress(null);
    if (hasDeepCourse(APP, tier)) {
      getCourseProgress(APP, tier).then(setCourseProgress).catch(() => setCourseProgress(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier, gate.allowed]);

  // The capstone case files are offered only on a tier whose brief is set on
  // them (the ODUMA campaign), so a tier still on its earlier brief is never
  // shown files it does not ask about.
  const caseFiles = /oduma/i.test(capstone?.prompt || '') ? WELLDATA_CASE_FILES : null;

  const watermark = gate.quota?.export_watermark;

  const submit = async () => {
    setSubmitting(true);
    try {
      const numeric = buildCapstoneAnswers(capstone?.fields, answers);
      const res = await submitCapstone(APP, tier, numeric);
      setResult(res);
      if (res.passed && res.certificate_number) {
        toast({
          title: `Capstone passed. ${CERT_LABELS[res.tier] || 'Associate'} certified!`,
          description: res.certificate_number,
          className: 'bg-[#BFFF00] text-slate-900',
        });
      } else if (res.passed) {
        toast({ title: 'Passed. You were already certified', className: 'bg-[#BFFF00] text-slate-900' });
      } else {
        toast({
          title: 'Not passing yet',
          description: `${res.score}/${res.max_score} answers within tolerance. Check the panels again.`,
          variant: 'destructive',
        });
      }
    } catch (e) {
      toast({ title: 'Submission failed', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // On the deep path the capstone is the LAST step: lessons, module
  // quizzes and the final exam come first (all enforced server-side).
  // Hide the submit UI until the course reports it unlocked, so the old
  // pass-in-minutes surface is gone. Super admins keep the submit UI for
  // the reviewer door (the server's bypass contract).
  const deep = hasDeepCourse(APP, tier);
  const capstoneOpen = !deep
    || courseProgress?.capstone?.unlocked === true
    || courseProgress?.capstone?.passed === true
    || actualRole === 'super_admin';

  if (gate.loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" /></div>;
  }
  if (!gate.allowed) return <ScopeGate />;

  return (
    <>
      <Helmet><title>Well Data Management (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <HardDrive className="h-7 w-7 text-[#BFFF00]" /> Well Data Management
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
              </h1>
              <p className="mt-1 text-gray-400">
                Six bundled teaching LAS files. {gate.quota?.own_data_upload === false && 'Your own data upload unlocks at the Associate tier.'}
              </p>
            </div>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Legacy pocket lessons: superseded by the deep course. They
              only render for tiers whose full content has not shipped. */}
          {!deep && (
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>What well data QC actually checks, step by step.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {LESSONS.map((l) => (
                <div key={l.n} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                  <p className="text-white text-sm font-medium">{l.n}. {l.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{l.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          )}

          {/* File explorer + QC: the shared LAS inspector panel (also embedded in DC5 lessons) */}
          <LasInspector />

          {/* Tier toggle + intermediate panel */}
          <div className="flex gap-2">
            {TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <ImportExplorer />}
          {tier === 'advanced' && <CampaignExplorer />}

          {/* Capstone */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {caseFiles && (
                <CapstoneCaseFiles files={caseFiles}
                  note="Download the case files, then open them in the panels above with Open your own LAS files. No panel loads them for you." />
              )}
              {!capstoneOpen ? (
                <div className="rounded-md border border-gray-700 bg-[#0F172A] p-4 text-sm text-gray-300 flex items-start gap-2">
                  <Lock className="h-4 w-4 text-[#BFFF00] mt-0.5 shrink-0" />
                  <p className="mb-0">
                    The capstone unlocks after the course: finish the lessons, pass each module quiz
                    and the final exam, then submit here.{' '}
                    <Link to={`/dashboard/apps/${APP}/course/${tier}`} className="text-[#BFFF00] hover:underline">
                      Open the course
                    </Link>
                  </p>
                </div>
              ) : (
                <>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(capstone?.fields || []).map((f) => (
                    <div key={f.key}>
                      <Label className="text-gray-400 text-xs mb-1 block">{f.label} ({f.unit})</Label>
                      <Input type="text" inputMode="decimal" autoComplete="off" value={answers[f.key] ?? ''}
                        onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
                        className="bg-gray-700 text-white border-gray-600 h-8 text-sm" />
                    </div>
                  ))}
                </div>

                <Button onClick={submit} disabled={submitting || !capstone}
                  className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GraduationCap className="mr-2 h-4 w-4" />}
                  Submit for grading
                </Button>
                </>
              )}

              {result && (
                <div className={`rounded-md border p-4 ${result.passed ? 'border-emerald-700 bg-emerald-900/20' : 'border-red-800 bg-red-900/20'}`}>
                  {result.passed ? (
                    <>
                      <p className="text-emerald-300 font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" /> Passed ({result.score}/{result.max_score})
                      </p>
                      {result.certificate_number ? (
                        <div className="mt-2 text-sm text-gray-300 space-y-1">
                          <p className="flex items-center gap-2"><Award className="h-4 w-4 text-[#BFFF00]" />
                            {CERT_LABELS[result.tier] || 'Associate'} certificate <span className="font-mono text-[#BFFF00]">{result.certificate_number}</span> issued.
                            {result.tier === 'associate' && ' The rest of the geoscience path is now open to you.'}
                            {result.tier === 'expert' && ' Your 50% Suite discount code is on your certificates page.'}</p>
                          <div className="flex gap-3">
                            <Link to="/dashboard/certificates" className="text-[#BFFF00] hover:underline inline-flex items-center gap-1">
                              My certificates <ArrowRight className="h-3 w-3" />
                            </Link>
                            <Link to="/dashboard/enroll" className="text-[#BFFF00] hover:underline inline-flex items-center gap-1">
                              Enrol in the next course <ArrowRight className="h-3 w-3" />
                            </Link>
                            <a href={verificationUrl(result.verify_code)} target="_blank" rel="noreferrer" className="text-gray-400 hover:underline">
                              Public verification
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-gray-400">You were already certified for this tier.</p>
                      )}
                    </>
                  ) : (
                    <p className="text-red-300 font-medium flex items-center gap-2">
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance. Open each case file in the panels again and re-read them.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default WellDataLearningPage;
