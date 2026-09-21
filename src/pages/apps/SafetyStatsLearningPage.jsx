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
import RatesExplorer from '@/components/course/panels/safetystats/RatesExplorer';
import IntervalsExplorer from '@/components/course/panels/safetystats/IntervalsExplorer';
import UChartExplorer from '@/components/course/panels/safetystats/UChartExplorer';
import {
  ratesAndBases, pooling, zeroEvents, egbemaChart, STREAMS,
} from '@/components/course/panels/safetystats/safetystatsLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Safety Performance Statistics & KPIs course page, the first course of the
// academy's HSE module. Every number it prints is a return value from the
// teaching lab (safetystatsLab), which is a return value from the vendored
// safety statistics engine on the teaching streams. It never reads the
// capstone: panelCapstoneGuard.test.js and safetystatsLab.test.js both grep
// this file.

const APP = 'safetystats';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'A rate is a count over exposure', body: 'Counts over exposure hours on a base the caller names, why hours and never headcount, and the refusals that name their field.' },
  { tier: 'Associate', title: 'One name, several numbers', body: 'TRIR, DART and lost time on the OSHA base and the IOGP base: the same letters and a factor of five between them.' },
  { tier: 'Associate', title: 'FAR, the severity rate and the PSE rate', body: 'The one rate with a fixed base, a rate with no single standard, and a process safety rate whose tier is an input.' },
  { tier: 'Associate', title: 'Sum, then divide', body: 'Pooling sites and workforces, the mean of rates beside it, and a period with no hours.' },
  { tier: 'Associate', title: 'The rolling rate', body: 'One sum-then-divide rate per complete window, and a short month that swells the mean of the monthly rates.' },
  { tier: 'Associate', title: 'One report, end to end', body: 'The BLS worked example, the IOGP published figures, and what the basis block says about every number.' },
  { tier: 'Professional', title: 'A count is a draw', body: 'The Poisson count model, and the same observed rate at growing exposure.' },
  { tier: 'Professional', title: 'The Garwood exact interval', body: 'Limits from the chi-square distribution, half the miss in each tail, and coverage that never falls short.' },
  { tier: 'Professional', title: 'Zero events', body: 'Zero is a measurement that bounds the rate from above, and where the rule of three differs from the central interval.' },
  { tier: 'Professional', title: 'Comparing two rates', body: 'Conditioning on the total count, the rate ratio and its interval, and a group with no events.' },
  { tier: 'Professional', title: 'The p-value and its convention', body: 'The central p-value the engine uses, the minlike one it declines, and why the interval decides between them.' },
  { tier: 'Professional', title: 'Intervals in a report', body: 'Writing a rate with its count, its hours, its base and its interval.' },
  { tier: 'Expert', title: 'The u-chart', body: 'Exposure units, a pooled centre line and limits that move with each month\'s hours.' },
  { tier: 'Expert', title: 'Signals', body: 'Strictly outside, three sigma, a low point that signals and a short month that cannot.' },
  { tier: 'Expert', title: 'What a signal means', body: 'A signal asks a question, limits are revised only for a found cause, and a quiet chart can be a thin one.' },
  { tier: 'Expert', title: 'Benchmarking', body: 'Same base and same definition first, and a benchmark that is a population figure.' },
  { tier: 'Expert', title: 'The traps', body: 'Denominators that move, contractor events without contractor hours, reclassification and rate chasing.' },
  { tier: 'Expert', title: 'Judgement, end to end', body: 'What the engine does not classify, and a monitoring note that says which months it used.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Safety Performance Statistics & KPIs: Learning Mode locked">
      <p>
        Enrol in the Safety Performance Statistics & KPIs course and activate your account to open this app in
        Learning Mode. A safety rate is a count divided by exposure hours on a base somebody chose, so the course
        teaches what the rate is, how sure it is and whether anything is changing, and grades each tier on its own
        question with numbers the engine returns.
      </p>
    </LearningModeGate>
  );
}

const SafetyStatsLearningPage = () => {
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
        r: ratesAndBases(), p: pooling(), z: zeroEvents(), g: egbemaChart(),
      };
    } catch {
      return null;
    }
  }, []);

  const watermark = gate.quota?.export_watermark;

  const submit = async () => {
    setSubmitting(true);
    try {
      const numeric = buildCapstoneAnswers(capstone?.fields, answers);
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
      <Helmet><title>Safety Performance Statistics & KPIs (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <HardHat className="h-7 w-7 text-[#BFFF00]" /> Safety Performance Statistics & KPIs
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                {STREAMS.UGHELLI.recordables} recordables in {STREAMS.UGHELLI.hours} hours read {six(lab.r.onBases[0].rate)} per
                200,000 hours and {six(lab.r.onBases[1].rate)} per 1,000,000: the count and the hours are the same, and
                only the base moved, which is why the engine refuses a rate with no base named. Three sites pool to
                {' '}{six(lab.p.rate)} by sum then divide, against a mean of their rates of {six(lab.p.meanOfPeriodRates)}.
                A crew with no recordables in {lab.z.hours} hours cannot, at 95 percent, rule out a true rate as high as
                {' '}{six(lab.z.limits[2].upper)} per 200,000 hours. And a year of monthly rates on a u-chart centres at
                {' '}{six(lab.g.centre)}, flags month {lab.g.flagged.join(', ')}, and redraws at {six(lab.g.revisedCentre)} once
                that month is set aside for a found cause. This course is where each of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                The teaching streams, the BLS worked example and the IOGP published figures, on the vendored safety
                statistics engine. Every number on this page and inside every panel is a return value from that
                engine, pinned by a test file against the figures the lessons quote. Rates are per 200,000, 1,000,000 or
                100,000,000 exposure hours, always named. A confidence interval here is an interval on an estimated
                rate, and no percentile label is used anywhere in this course.
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

          {tier === 'beginner' && <RatesExplorer />}
          {tier === 'beginner' && <RatesExplorer initialMode="pool" />}
          {tier === 'intermediate' && <IntervalsExplorer />}
          {tier === 'intermediate' && <IntervalsExplorer initialMode="compare" />}
          {tier === 'advanced' && <UChartExplorer />}
          {tier === 'advanced' && <UChartExplorer initialMode="beforeafter" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine declares, and what it does not decide</CardTitle>
              <CardDescription>
                The base is required on every rate except the fatal accident rate, and a missing base is refused by
                name. The severity rate has no single standard, so the base is required there too and no time charges
                are added. The API RP 754 tier is an input: the engine rates process safety events and does not
                classify them, because the threshold tables are licensed. Pooled and rolling rates sum the counts and
                the hours and then divide, with the mean of the period rates shown beside them. The p-value is the
                central one, which agrees with the engine&apos;s own rate-ratio interval. A u-chart point signals only
                strictly outside its limits. And the engine never decides whether an injury was recordable: every
                figure in this course starts from a count someone classified.
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
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
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

export default SafetyStatsLearningPage;
