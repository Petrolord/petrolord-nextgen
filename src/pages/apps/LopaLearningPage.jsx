import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, HardHat, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import WorksheetExplorer from '@/components/course/panels/lopa/WorksheetExplorer';
import SifExplorer from '@/components/course/panels/lopa/SifExplorer';
import ProofTestExplorer from '@/components/course/panels/lopa/ProofTestExplorer';
import {
  worksheet, loop, iduSif, publishedSif, judgement, STREAMS,
} from '@/components/course/panels/lopa/lopaLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Process Safety: LOPA & SIL Determination course page, the third course of
// the academy's HSE module. Every number it prints is a return value from the
// teaching lab (lopaLab), which is a return value from the vendored LOPA engine
// on the teaching streams or the published worked SIF in the vendored golden.
// It never reads the capstone: panelCapstoneGuard.test.js and lopaLab.test.js
// both grep this file.

const APP = 'lopa';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'A scenario and its frequency', body: 'One cause, one consequence, an initiating event frequency per year and the refusals that name their field.' },
  { tier: 'Associate', title: 'Enabling conditions and conditional modifiers', body: 'The factors that turn an initiating event into a consequence, and what forgetting one costs.' },
  { tier: 'Associate', title: 'Independent protection layers', body: 'Credit only when independent, one credit per IPL, the auditable flag, and the mitigated frequency.' },
  { tier: 'Associate', title: 'The tolerable frequency and the gap', body: 'The TMEL, the required risk reduction factor, the required PFDavg as the binding target, and the loop through a proposed SIF.' },
  { tier: 'Associate', title: 'Outcome states and the exact decade', body: 'Six outcome states, the low demand bands, an exact decade in the lower SIL, and the snap the engine needs to keep it there.' },
  { tier: 'Associate', title: 'One worksheet, end to end', body: 'A worksheet row by row, a requirement beyond SIL three, and what LOPA does not do.' },
  { tier: 'Professional', title: 'PFDavg and the simplified forms', body: 'What PFDavg averages, the half in one out of one, and the simplified redundant forms.' },
  { tier: 'Professional', title: 'The full Annex B form', body: 'Detected failures and the MTTR, the equivalent down times, the MRT after a proof test, and imperfect coverage.' },
  { tier: 'Professional', title: 'Common cause and the beta factor', body: 'One cause across several channels, the beta factor on undetected and detected failures, and no beta factor term in two out of two.' },
  { tier: 'Professional', title: 'The architectures', body: 'One out of two, two out of three and its six, one out of three, and what voting costs.' },
  { tier: 'Professional', title: 'The SIF is a sum', body: 'Sensor, logic solver and final element, the series sum, the achieved RRF, and back to the TMEL.' },
  { tier: 'Professional', title: 'A published SIF, reproduced', body: 'The worked SIF subsystem by subsystem, its total and its RRF, and the warnings and refusals.' },
  { tier: 'Expert', title: 'The proof test interval', body: 'PFDavg against T1, linear and quadratic growth, the longest interval for a target and the states with no finite answer.' },
  { tier: 'Expert', title: 'Imperfect proof testing', body: 'Coverage and the lifetime, the floor no interval reaches, and the lifetime cap.' },
  { tier: 'Expert', title: 'How conservative Annex B is', body: 'The time dependent route, where the forms depart, the rare event warning, and two out of two.' },
  { tier: 'Expert', title: 'The published example and its inferences', body: 'Reproducing a printed table, the MRT and the lifetime it did not print, and a printing slip in the beta factor.' },
  { tier: 'Expert', title: 'What the engine does not do', body: 'No hardware fault tolerance check, no high demand mode, no failure rate data, and what the credit rules rest on.' },
  { tier: 'Expert', title: 'Judgement, end to end', body: 'Allocating a PFDavg budget, stretching an interval, when to redesign, and the verification note.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Process Safety: LOPA & SIL Determination: Learning Mode locked">
      <p>
        Enrol in the Process Safety: LOPA & SIL Determination course and activate your account to open this app in
        Learning Mode. A layer of protection analysis finds the risk reduction a scenario still needs, and a safety
        instrumented function has to supply it, so the course teaches how much is missing, what a SIF achieves and
        how long its proof test may run, and grades each tier on its own question with numbers the engine returns.
      </p>
    </LearningModeGate>
  );
}

const LopaLearningPage = () => {
  const { toast } = useToast();
  const { actualRole } = useRole();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [courseProgress, setCourseProgress] = useState(null);
  const [capstone, setCapstone] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

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
    setCourseProgress(null);
    if (hasDeepCourse(APP, tier)) {
      getCourseProgress(APP, tier).then(setCourseProgress).catch(() => setCourseProgress(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier, gate.allowed]);

  // Engine calls through the teaching lab, on the teaching streams only.
  const lab = useMemo(() => {
    try {
      return {
        w: worksheet(), l: loop(), s: iduSif(), p: publishedSif(), j: judgement(),
      };
    } catch {
      return null;
    }
  }, []);

  const watermark = gate.quota?.export_watermark;

  const submit = async () => {
    setSubmitting(true);
    try {
      const numeric = Object.fromEntries(
        (capstone?.fields || []).map((f) => [f.key, answers[f.key] === '' || answers[f.key] === undefined ? null : Number(answers[f.key])]),
      );
      const res = await submitCapstone(APP, tier, numeric);
      setResult(res);
      if (res.passed && res.certificate_number) {
        toast({ title: `Capstone passed. ${CERT_LABELS[res.tier] || 'Associate'} certified!`, description: res.certificate_number, className: 'bg-[#BFFF00] text-slate-900' });
      } else if (res.passed) {
        toast({ title: 'Passed: you were already certified', className: 'bg-[#BFFF00] text-slate-900' });
      } else {
        toast({
          title: 'Not passing yet',
          description: `${res.score}/${res.max_score} answers within tolerance. Work the panels at the capstone settings and try again.`,
          variant: 'destructive',
        });
      }
    } catch (e) {
      toast({ title: 'Submission failed', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (gate.loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" /></div>;
  }
  if (!gate.allowed) return <ScopeGate />;

  return (
    <>
      <Helmet><title>Process Safety: LOPA & SIL Determination (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <HardHat className="h-7 w-7 text-[#BFFF00]" /> Process Safety: LOPA & SIL Determination
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                A separator overfill at {STREAMS.ORONI.initiatingEventFrequencyPerYr} per year, after its enabling
                condition, its modifiers and the two IPLs that earn credit, happens {twelve(lab.w.mitigatedFrequencyWithoutSifPerYr)} times
                a year. Against a tolerable {twelve(lab.w.tmelPerYr)} per year that needs a risk reduction factor of
                {' '}{six(lab.w.requiredRrf)}, which is {lab.w.outcome}. At a tighter TMEL the same row needs a SIF with a
                PFDavg of {twelve(lab.l.requiredSifPfdAvg)}, and a SIF inside the right band can still miss it. The teaching
                SIF sums to {twelve(lab.s.pfdAvg)}; the published worked SIF reproduces to {twelve(lab.p.pfdAvg)}, an RRF of
                {' '}{six(lab.p.rrf)}; and stretching every proof test from one year to {lab.j.stretched[3].years} years takes
                the teaching SIF past its requirement while it is still SIL {lab.j.stretched[3].sil}. This course is where
                each of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                The teaching streams and the published worked SIF, on the vendored LOPA engine. Every number on this
                page and inside every panel is a return value from that engine, pinned by a test file against the
                teaching digest. Frequencies are per year, failure rates per hour and times in hours. Failure rates are
                illustrative, never data, and no licensed IEC or ISA table is reproduced.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LESSONS.map((l, i) => (
                <div key={l.title} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-0">{l.tier}, module {(i % 6) + 1}</p>
                  <p className="text-white text-sm font-medium mb-0">{l.title}</p>
                  <p className="text-xs text-gray-400 mt-1 mb-0">{l.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}
              >
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'beginner' && <WorksheetExplorer />}
          {tier === 'beginner' && <WorksheetExplorer initialMode="bands" />}
          {tier === 'intermediate' && <SifExplorer />}
          {tier === 'intermediate' && <SifExplorer initialMode="sif" />}
          {tier === 'advanced' && <ProofTestExplorer initialMode="longest" />}
          {tier === 'advanced' && <ProofTestExplorer initialMode="coverage" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine declares, and what it does not decide</CardTitle>
              <CardDescription>
                The engine invents no number: the initiating event frequency, every probability, every IPL PFD, every
                failure rate and the TMEL are inputs. An IPL earns credit only when it is flagged independent, exactly
                true, and not flagged unauditable, and one IPL is credited once. An exact decade belongs to the lower
                SIL, and a value within one part in a billion of a decade is treated as the decade. A requirement beyond
                SIL three is reported as a redesign with its number intact. PFDavg follows the IEC 61508-6 Annex B low
                demand equations, the simplified forms are their special case, and two out of two carries no beta factor
                term. A SIF is the sum of its subsystems. The engine has no hardware fault tolerance check and no high
                demand mode, and it cannot judge whether a layer is really independent: that judgement stays with the
                analyst.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!(!hasDeepCourse(APP, tier)
                || courseProgress?.capstone?.unlocked === true
                || courseProgress?.capstone?.passed === true
                || actualRole === 'super_admin') ? (
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
                          <Input
                            type="number"
                            step="any"
                            value={answers[f.key] ?? ''}
                            onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
                            className="bg-gray-700 text-white border-gray-600 h-8 text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={submit}
                      disabled={submitting || !capstone}
                      className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
                    >
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
                          <p className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-[#BFFF00]" />
                            {CERT_LABELS[result.tier] || 'Associate'} certificate <span className="font-mono text-[#BFFF00]">{result.certificate_number}</span> issued.
                            {result.tier === 'expert' && ' Your 50% Suite discount code is on your certificates page.'}
                          </p>
                          <div className="flex gap-3">
                            <Link to="/dashboard/certificates" className="text-[#BFFF00] hover:underline inline-flex items-center gap-1">
                              My certificates <ArrowRight className="h-3 w-3" />
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance. Work the panels at the capstone settings and try again.
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

export default LopaLearningPage;
