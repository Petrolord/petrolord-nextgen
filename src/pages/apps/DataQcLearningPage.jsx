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
import ChecksExplorer from '@/components/course/panels/dataqc/ChecksExplorer';
import OutliersExplorer from '@/components/course/panels/dataqc/OutliersExplorer';
import MonitorExplorer from '@/components/course/panels/dataqc/MonitorExplorer';
import {
  logChecks, outliersOnSmallSets, pressureCharts, ekeneScorecard,
} from '@/components/course/panels/dataqc/dataqcLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { DATAQC_CASE_FILES } from '@/content/capstone-cases/dataqc';

// The Oilfield Data Quality course page, the first course of the academy's
// Data & AI module. Every number it prints is a return value from the teaching
// lab (dataqcLab), which is a return value from the vendored data quality
// engine on the Ekene teaching dataset. It never reads the capstone:
// panelCapstoneGuard.test.js and dataqcLab.test.js both grep this file. The
// capstone case files are imported from src/content/capstone-cases/dataqc and
// offered on the capstone card only, as the welltest course offers its buildup.

const APP = 'dataqc';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What data quality means', body: 'A rule, a flag and its reason; the five dimensions; what missing means and the sentinel that counts as present.' },
  { tier: 'Associate', title: 'Is it there', body: 'Completeness, gap runs and the coverage of an interval, where a step too long is a hole.' },
  { tier: 'Associate', title: 'Is it valid', body: 'Definitional limits, plausibility ranges you supply, units that are never converted, and rate rules.' },
  { tier: 'Associate', title: 'The depth and time index', body: 'Duplicates, reversals and irregular steps, and an expected step inferred or stated.' },
  { tier: 'Associate', title: 'Does it agree with itself', body: 'A cumulative that falls, water cut on a liquid basis, parts that add to a total, frozen values.' },
  { tier: 'Associate', title: 'Names, and one dataset end to end', body: 'Normalised well names, near duplicates and the digit rule, and every check on one dataset.' },
  { tier: 'Professional', title: 'The z-score and its ceiling', body: 'Sample or population spread, the largest z a sample allows, and one outlier inflating the spread.' },
  { tier: 'Professional', title: 'The median and the MAD', body: 'A centre outliers barely move, the modified z-score and its printed constant.' },
  { tier: 'Professional', title: 'Quartiles and Tukey fences', body: 'Three quantile rules, inner and outer fences, and why a value on the fence is inside.' },
  { tier: 'Professional', title: 'A moving window', body: 'The Hampel window: local against global, edges, gaps and windows too thin to judge.' },
  { tier: 'Professional', title: 'Formal tests and many variables', body: 'Grubbs for one outlier and its masking, and the Mahalanobis distance with its chi-square cutoff.' },
  { tier: 'Professional', title: 'Outliers in a report', body: 'The NIST worked examples, which method answers which question, and a flag as a question.' },
  { tier: 'Expert', title: 'The individuals chart', body: 'Moving ranges, limits from MRbar, the moving range chart, and a standard or the data.' },
  { tier: 'Expert', title: 'The EWMA chart', body: 'A weighted memory with target and sigma from history, asymptotic and exact limits.' },
  { tier: 'Expert', title: 'The tabular CUSUM', body: 'Small shifts accumulated, k and h in stated units, no reset, and which chart sees what.' },
  { tier: 'Expert', title: 'The scorecard', body: 'A score per dimension, weights normalised by their sum, the weakest dimension, no grade bands.' },
  { tier: 'Expert', title: 'Designing a QC policy', body: 'The order of checks, defaults presented as choices, and when to flag, fix or refuse.' },
  { tier: 'Expert', title: 'Reading the engine honestly', body: 'Printed figures and their errata, what is not built, and the quality note.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Oilfield Data Quality: Learning Mode locked">
      <p>
        Enrol in the Oilfield Data Quality course and activate your account to open this app in Learning Mode. Data
        quality is a set of stated rules applied to a well log or a production series, every flag carrying its reason,
        so the course teaches whether the data are fit to use, which values stand apart, and whether the process that
        makes them has changed, and grades each tier on its own question with numbers the engine returns.
      </p>
    </LearningModeGate>
  );
}

const DataQcLearningPage = () => {
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
        l: logChecks(), o: outliersOnSmallSets(), c: pressureCharts(), s: ekeneScorecard(),
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
      <Helmet><title>Oilfield Data Quality (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Database className="h-7 w-7 text-[#BFFF00]" /> Oilfield Data Quality
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                A density log with a twelve-sample gap reads a completeness of {six(lab.l.channels[1].completeness)}, and a
                gamma ray carrying the LAS null sentinel reads {six(lab.l.channels[0].completeness)}: the sentinel is a
                present number until someone converts it. Ten gauge readings cannot show a z-score above{' '}
                {six(lab.o.gauge.maxPossibleAbsZ)}, so a glitch goes unflagged by z while its modified z-score reads{' '}
                {six(lab.o.gauge.modifiedZ)}. A wellhead pressure that drifts down a little is seen on day{' '}
                {lab.c.cusum.firstLowDay} by the CUSUM and day {lab.c.ewma.firstLowDay} by the EWMA. And one well&apos;s
                data sheet scores {six(lab.s.weightedTotal)}, weakest in {lab.s.weakest}. This course is where each of
                those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                The Ekene teaching dataset and the NIST/SEMATECH worked examples, on the vendored data quality
                engine. Every number on this page and inside every panel is a return value from that engine, pinned
                by a test file against the figures the lessons quote. Every method here is a stated statistical rule,
                and every flag names the rule that fired.
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

          {tier === 'beginner' && <ChecksExplorer />}
          {tier === 'beginner' && <ChecksExplorer initialMode="agree" />}
          {tier === 'intermediate' && <OutliersExplorer />}
          {tier === 'intermediate' && <OutliersExplorer initialMode="hampel" />}
          {tier === 'advanced' && <MonitorExplorer />}
          {tier === 'advanced' && <MonitorExplorer initialMode="scorecard" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine declares, and what it does not decide</CardTitle>
              <CardDescription>
                Missing means null, undefined or NaN, and a sentinel is a present value. Range limits are definitional
                only; a plausibility range is the caller&apos;s, and units are never converted. The phase-sum tolerance
                is taken on the total, a frozen run is measured against its first value, and near-duplicate names must
                carry the same digits. The z-score uses the sample standard deviation and reports its own ceiling; the
                modified z-score uses 0.6745 as printed; Tukey fences default to R7 quartiles. Every flag fires strictly
                beyond its limit. Control charts refuse a series with a gap, EWMA takes its target and sigma from
                history, and CUSUM needs k and h in stated units. The scorecard has no grade bands. And the engine never
                decides whether a flagged value is wrong: a flag is a rule that fired, with its reason.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && DATAQC_CASE_FILES[tier] && (
                <CapstoneCaseFiles files={DATAQC_CASE_FILES[tier]}
                  note="Download the case files the brief names, then paste each column into the panel it belongs to. A missing value is written null, and no panel loads a case for you." />
              )}
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

export default DataQcLearningPage;
