import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, Map, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import PlanExplorer from '@/components/course/panels/fdp/PlanExplorer';
import ScheduleExplorer from '@/components/course/panels/fdp/ScheduleExplorer';
import ValueExplorer from '@/components/course/panels/fdp/ValueExplorer';
import { endToEnd, reservesPerFluid, riskRegister } from '@/components/course/panels/fdp/fdpLab';
import { OUTCOME_LABELS, EXCEEDANCE_DEFINITION } from '@petrolord/engines/lib/conventions/percentile.js';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Field Development Planning course page. Every number it prints is a
// return value from the teaching lab (fdpLab), which is a return value from the
// vendored FDP Accelerator and Project Management Pro engines on the teaching
// fields EGINA and ODUDU-2, at stated dates. It never reads the capstone:
// panelCapstoneGuard.test.js greps this file too.

const APP = 'fdp';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d })
  : 'none');
const count = (v) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 }) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What a plan holds',
    body: 'Reserves, concepts, wells, facilities, a schedule, costs, risks and the economics those imply, with every missing figure refused by name.' },
  { tier: 'Associate', title: 'One total per fluid',
    body: 'Oil in MMbbl and gas in Bcf are never added, and a sum of low cases is not the low case of the sum.' },
  { tier: 'Associate', title: 'The capex a concept carries',
    body: 'Drilling, facilities and subsea are three fields and the engine reads all three, then dates the concept from its own start.' },
  { tier: 'Associate', title: 'What a scenario is worth',
    body: 'NPV after royalty and tax, a rate of return with a status beside it, and what payback hides.' },
  { tier: 'Associate', title: 'The plan against the concept',
    body: 'Cost items line by line, the phase roll-up, the price deck that must cover the profile, and the sweep.' },
  { tier: 'Associate', title: 'The plan that cannot be costed yet',
    body: 'Completeness over nine sections, what validation says, and the reserves table that cannot be read.' },
  { tier: 'Professional', title: 'The schedule as a network',
    body: 'Forward pass, backward pass, float as late start less early start, and the one path that cannot slip.' },
  { tier: 'Professional', title: 'Dates that do not move',
    body: 'A date is not a timestamp. Whole calendar days, a window against the work, and no clock in the answer.' },
  { tier: 'Professional', title: 'What a rig day costs',
    body: 'Trajectory and depth move the days, the rig rate prices them, and a campaign is as long as its rigs allow.' },
  { tier: 'Professional', title: 'Facilities sized and priced',
    body: 'Nameplate, size to the power of, decommissioning at fifteen percent, utilisation and a flow assurance screen on a blank field.' },
  { tier: 'Professional', title: 'One risk scale',
    body: 'Four bands, an unscored risk that changes nothing, exposure at the probability factors, and a health score.' },
  { tier: 'Professional', title: 'The document and its roll-ups',
    body: 'What the generated plan reports, what it leaves blank, and the headline figures it carries.' },
  { tier: 'Expert', title: 'The rate of return',
    body: 'The discount rate that zeroes the value, read beside the NPV and never on its own.' },
  { tier: 'Expert', title: 'When there is no rate',
    body: 'No change of sign, above the band, more than one root, no root at all, and why a clamp is not an answer.' },
  { tier: 'Expert', title: 'What a sensitivity says',
    body: 'One driver at a time by thirty percent, the swing per driver, and the ranking that is not a probability.' },
  { tier: 'Expert', title: 'Earned value to a date',
    body: 'Planned value time-phased to a stated as-of date, a schedule index that can pass one, and a completion ratio that is not an index.' },
  { tier: 'Expert', title: 'What earned value refuses',
    body: 'An index with no denominator, a costed task nobody has dated, and a project with no costed task at all.' },
  { tier: 'Expert', title: 'Reading a plan against itself',
    body: 'Three estimates of one cost, two measures of one schedule, and two routes to one value.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Field Development Planning: Learning Mode locked">
      <p>
        Enrol in the Field Development Planning course and activate your account to open this app in Learning Mode.
        It takes one development plan and one project schedule and reads them honestly: which number each answer came
        from, what it was measured against, and when the honest answer is that there is none.
      </p>
    </LearningModeGate>
  );
}

const FdpLearningPage = () => {
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

  // Engine calls through the teaching lab: a handful of screening cases, one
  // critical path method run, one risk register and one earned value reading at
  // a stated as-of date.
  const lab = useMemo(() => {
    try {
      return { e: endToEnd(), res: reservesPerFluid(), risk: riskRegister() };
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
      <Helmet><title>Field Development Planning (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Map className="h-7 w-7 text-[#BFFF00]" /> Field Development Planning
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                A field development plan is a set of numbers that must agree with each other. The teaching field EGINA holds
                {' '}{fmt(lab.res.oilP50)} MMbbl of oil and {fmt(lab.res.gasP50)} Bcf of gas, which are never added. Its base
                case is worth {fmt(lab.e.base.npv)} million USD at {fmt(lab.e.base.oilPrice)} USD a barrel and, once the
                plan&apos;s end of life cost is charged in its final producing year, has no single rate of return at all: its
                flow changes sign twice, so the engine reports {lab.e.base.irrStatus} and lists every rate that zeros it.
                The same plan stressed to {fmt(lab.e.stress.oilPrice)} USD a barrel is worth
                {' '}{fmt(lab.e.stress.npv)} and has no rate of return at all, which the engine reports as
                {' '}{lab.e.stress.irrStatus} rather than as a number. Its schedule needs {count(lab.e.network.duration)} days of
                work inside a window of {count(lab.e.network.calendarSpan)}, and its register carries {lab.risk.levels.Unscored} risk
                nobody has scored, which changes neither the health score of {count(lab.risk.health)} nor the exposure of
                {' '}{fmt(lab.risk.exposure)} million USD. Read to {lab.e.earned.asOf}, the project schedule ODUDU-2 has earned
                {' '}{count(lab.e.earned.evValue)} USD against a planned {count(lab.e.earned.pv)}, a schedule index of
                {' '}{fmt(lab.e.earned.spi, 6)} beside a completion ratio of {fmt(lab.e.earned.completionRatio, 6)} that is not an
                index at all. This course is where each of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                One development plan, one project schedule and the published golden cases, on the vendored FDP Accelerator
                and Project Management Pro engines. Every number on this page and inside every panel is a return value from
                those engines, pinned by a test file against the teaching digest. {EXCEEDANCE_DEFINITION}
                {' '}Only a reserves distribution carries one, and only one fluid at a time: that fluid&apos;s low case is
                {' '}{OUTCOME_LABELS.p90} and its high case {OUTCOME_LABELS.p10}. A capex, a rate of return, a cost, a duration,
                a schedule index and a ratio never do.
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
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'beginner' && <PlanExplorer />}
          {tier === 'intermediate' && <ScheduleExplorer />}
          {tier === 'advanced' && <ValueExplorer />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these engines do not do, and what they report that they do not mean</CardTitle>
              <CardDescription>
                These are SCREENING engines. The production shape is a plateau and a decline and never a reservoir forecast;
                capex is spent in one year; the fiscal terms are a flat royalty and a flat tax; the facility estimate is a
                class 5 figure from type and nameplate; the risk exposure is five factors on five numbers somebody typed;
                and earned value is only as good as the percent complete entered against each task.
                {lab && (
                  <>
                    {' '}The concept capex of {fmt(lab.e.reconcile.cost.conceptCapex)} million USD, the cost items total of
                    {' '}{fmt(lab.e.reconcile.cost.costItemsCapex)} and the facility screening estimate of
                    {' '}{fmt(lab.e.reconcile.cost.facilityScreeningCapex)} are three different estimates of overlapping things,
                    and only the last of them against the concept&apos;s own facilities field is like for like, a gap of
                    {' '}{fmt(lab.e.reconcile.cost.likeForLikeGapDerived)}. The calendar carries {count(lab.e.reconcile.schedule.spentFloatDerived)} days
                    of float the logic does not.
                  </>
                )}
                {' '}None of this is a sanction case. It is the arithmetic under one, and the judgement stays with the
                engineer who signs it.
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
                          <Input type="number" step="any" value={answers[f.key] ?? ''}
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

export default FdpLearningPage;
