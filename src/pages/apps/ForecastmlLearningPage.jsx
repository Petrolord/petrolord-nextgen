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
  Loader2, Database, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import SmoothingExplorer from '@/components/course/panels/forecastml/SmoothingExplorer';
import BacktestExplorer from '@/components/course/panels/forecastml/BacktestExplorer';
import UncertaintyExplorer from '@/components/course/panels/forecastml/UncertaintyExplorer';
import {
  sesReader, holdOutReader, compareReader, intervalsReader, TEACHING,
} from '@/components/course/panels/forecastml/forecastLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Data-Driven Production Forecasting course page, the fourth course of the
// academy's Data & AI module, after Oilfield Data Quality, Machine Learning on
// Well Data and Electrofacies. Every number it prints is a return value from
// the teaching lab (forecastLab), which is a return value from the vendored
// forecasting engine on the Ekene production wells. It never reads the
// capstone: panelCapstoneGuard.test.js and forecastLab.test.js both grep this
// file. The capstone case files are added at the ship phase, as the sibling
// courses offer theirs.

const APP = 'forecastml';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What a data-driven forecast is', body: 'A rate series month by month, forecasting from the series alone, the Ekene production wells, one-step and h-step forecasts, and the refusals by name.' },
  { tier: 'Associate', title: 'Simple exponential smoothing', body: 'The level and the smoothing weight alpha, starting at the first month, a flat forecast, and alpha at one as the naive forecast.' },
  { tier: 'Associate', title: "Holt's linear trend", body: 'A level and a trend, the second month spent on the start, where scoring starts, and a trend that runs below zero.' },
  { tier: 'Associate', title: 'The damped trend', body: 'Damping the trend with phi, the flattening and its limit, phi fitted and phi given, and damped with phi at one as Holt.' },
  { tier: 'Associate', title: 'Fitting the parameters', body: 'The sum of squared one-step errors, the grid then the compass search, parameters on their bounds, and the stop rule.' },
  { tier: 'Associate', title: 'One well forecast, end to end', body: 'The whole workflow in order, the NIST handbook as a published check, and writing up a forecast.' },
  { tier: 'Professional', title: 'Forecast errors', body: 'Actual minus forecast, bias and the mean error, MAE and RMSE, and in-sample against out-of-sample errors.' },
  { tier: 'Professional', title: 'Percentage errors', body: 'MAPE and a shut-in month in the actuals, the symmetric percentage error, and a low rate tail.' },
  { tier: 'Professional', title: 'The scaled error', body: 'The naive forecast as a yardstick, MASE and its scale, the lag of the naive forecast, and a flat training window.' },
  { tier: 'Professional', title: 'Rolling-origin backtests', body: 'Origins and the expanding window, horizon and step, refitting against held parameters, and leakage from the future.' },
  { tier: 'Professional', title: 'Pooling backtest errors', body: 'Pooled over origins and steps, errors by horizon, each origin its own scale, and one origin that leaves a metric undefined.' },
  { tier: 'Professional', title: 'Methods compared, end to end', body: 'The testing workflow, a workover that changes the winner, and writing up a backtest.' },
  { tier: 'Expert', title: 'The residual bootstrap', body: 'Simulated future paths, drawing residuals with a seed, the state update, the pool, and a median away from the point forecast.' },
  { tier: 'Expert', title: 'Percentiles and their labels', body: 'The quantile rule, the exceedance labels with P90 as the low case, negative rates reported as zero, and intervals that widen.' },
  { tier: 'Expert', title: 'The Arps baseline', body: 'Arps from the decline curve engine, a month passed as a day, shut-in months dropped, and when Arps finds no fit.' },
  { tier: 'Expert', title: 'Ranking methods against Arps', body: 'The same origins for every method, ranking by the chosen metric, ties, unranked methods, and a baseline that wins.' },
  { tier: 'Expert', title: 'Boundaries, bounds and caps', body: 'Every boundary rule by rule, the parameter box and the grid tie, the length rules and the caps.' },
  { tier: 'Expert', title: 'Reading the engine honestly', body: 'Conventions that are choices, what is not built, and the forecast note.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Data-Driven Production Forecasting: Learning Mode locked">
      <p>
        Enrol in the Data-Driven Production Forecasting course, the fourth course of the Data & AI module, and activate
        your account to open this app in Learning Mode. A data-driven forecast extends a rate series from its own
        history, and it is worth something only when it is tested on months it never saw, so the course teaches
        simple, Holt and damped exponential smoothing, then errors, percentage errors, the scaled error and
        rolling-origin backtests, then residual-bootstrap intervals and the Arps baseline, and grades each tier with
        numbers the engine returns.
      </p>
    </LearningModeGate>
  );
}

const ForecastmlLearningPage = () => {
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

  // Engine calls through the teaching lab, on the Ekene production wells only.
  const lab = useMemo(() => {
    try {
      return {
        s: sesReader(), h: holdOutReader(), c: compareReader(), i: intervalsReader(),
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
      <Helmet><title>Data-Driven Production Forecasting (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Database className="h-7 w-7 text-[#BFFF00]" /> Data-Driven Production Forecasting
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Data & AI, course four</p>
            {lab && (
              <p className="mt-1 text-gray-400">
                Simple exponential smoothing fitted on the noisy Ekene well takes alpha {six(lab.s.fitted.find((w) => w.well === 'EKENE-P4').alpha)},
                and on the clean decline it stops at alpha 1, the naive forecast. Fitted on {TEACHING.train} months and scored on the
                next {TEACHING.h}, Holt reaches a MASE of {six(lab.h.find((r) => r.method === 'holt').mase)} and ses{' '}
                {six(lab.h.find((r) => r.method === 'ses').mase)}. Before its shut-in one well ranks the Arps baseline{' '}
                {lab.c.pre.ranking[0] === 'arps' ? 'first' : 'lower'}; after its workover {lab.c.post.ranking[0]} ranks first. The damped
                forecast of the clean well, seed {TEACHING.seed}, carries a P90 (low case) of {six(lab.i.steps[5].P90)} at step 6.
                This course is where each of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                The Ekene production wells and the NIST/SEMATECH handbook examples, on the vendored forecasting engine.
                Every number on this page and inside every panel is a return value from that engine, pinned by a test
                file against the figures the lessons quote. Every method here is named by what it is: simple, Holt and
                damped exponential smoothing, a residual bootstrap and a least-squares Arps baseline.
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

          {tier === 'beginner' && <SmoothingExplorer />}
          {tier === 'beginner' && <SmoothingExplorer initialMode="forecast" />}
          {tier === 'intermediate' && <BacktestExplorer />}
          {tier === 'intermediate' && <BacktestExplorer initialMode="backtest" />}
          {tier === 'advanced' && <UncertaintyExplorer />}
          {tier === 'advanced' && <UncertaintyExplorer initialMode="compare" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                The level starts at the first month and a Holt or damped trend at the second, which is spent on the
                start and never scored. A parameter left out is fitted by the least one-step sum of squared errors, on a
                stated grid and then a compass search in the box alpha and beta from 0 to 1 and phi from 0.8 to 0.98. An
                error is actual minus forecast; MAPE is none when an actual is 0, and MASE divides by the in-sample
                naive error of the training months. Intervals replay the method&apos;s own residuals from one seeded
                stream, and P90 is the low case. The Arps baseline is the decline curve engine&apos;s, with a month
                passed as a day. The engine fills no missing month and chooses no method: a backtest does that.
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

export default ForecastmlLearningPage;
