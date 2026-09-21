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
  Loader2, Dices, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import ScreeningExplorer from '@/components/course/panels/uncertainty/ScreeningExplorer';
import BreakevenExplorer from '@/components/course/panels/uncertainty/BreakevenExplorer';
import RiskExplorer from '@/components/course/panels/uncertainty/RiskExplorer';
import {
  BELIEF, ledger, scenarios, fits, breakevenCurve, distrust, pLabelWords, scenarioBuilderCases,
} from '@/components/course/panels/uncertainty/uncertaintyLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

const APP = 'uncertainty';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d })
  : '-');

const LESSONS = [
  { n: 1, title: 'A screening model is a fixed recipe, and it says what it refuses',
    body: 'Mid-year discounting, a fixed quick life, no economic limit, royalty and tax only in the quick form, no fiscal terms beyond that. Every late year is produced and charged, the losing ones too.' },
  { n: 2, title: 'Quick inputs become a case before they become a number',
    body: 'A rate declines year on year, capex splits over two years, opex has a fixed and a variable part, and the price never moves. Read the case before reading its value.' },
  { n: 3, title: 'The ledger takes royalty off the top and tax only on a positive base',
    body: 'Royalty comes off gross revenue, capex is expensed in the year it is spent, and a year whose taxable income is not positive pays no tax at all.' },
  { n: 4, title: 'Value is read off the ledger, and payback lands part way through a year',
    body: 'Each year is discounted at its middle. Payback is the first year the cumulative crosses zero plus the shortfall over that year\'s cash, and a status says whether it stayed there. The IRR is Newton inside a band, and where it lands on no root the engine returns nothing and says why.' },
  { n: 5, title: 'One number becomes three, and a scenario is not a probability',
    body: 'A sensitivity bar scales one input at a time, and not always the input its name suggests. Low, Base and High move several inputs together by a fixed step and say nothing about likelihood.' },
  { n: 6, title: 'Three stated percentiles are not a minimum, a mode and a maximum',
    body: 'The Breakeven Analyzer fits a triangle whose CDF passes through all three. Used as endpoints, the same beliefs delete the tails. A median too near one end has no triangle at all, and the engine says so.' },
  { n: 7, title: 'A sample is only as reproducible as its seed',
    body: 'The inverse CDF has two branches, the generator is seeded, and three draws are taken in a fixed order. The same seed gives the same sample to the last digit, and another seed another answer.' },
  { n: 8, title: 'A breakeven price is found by bisection, and it takes no P-label',
    body: 'NPV rises with price, so halving a bracket is safe even across the kinks where each year starts paying tax. A breakeven price is a quantity where more is worse, so it is read as its 10th, 50th and 90th percentile.' },
  { n: 9, title: 'A P-label means one thing or it means nothing',
    body: 'On an outcome where more is better, the low case takes the exceedance label and the engine key that holds it is its 10th percentile. The results cards once printed those the other way round.' },
  { n: 10, title: 'Two percentile rules live in one module, and every percentile wobbles',
    body: 'The screening rule averages two neighbours and the breakeven rule takes one sorted value, so the same sample gives two answers. Across seeds and iteration counts a percentile moves, and more iterations do not say which seed was right.' },
  { n: 11, title: 'Edges that used to break',
    body: 'Every range at zero, a short run and a belief no triangle honours now report what happened. A tornado bar whose high end never breaks even is left open and sorts first, and a fitted tail past a physical limit is held there and counted.' },
  { n: 12, title: 'Some numbers are there to be distrusted',
    body: 'A missing IRR that says which of four things happened, a payback that flags a cumulative going back below zero, a mid-year NPV beside a year-end one, and two breakevens for one field that are two different quantities.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Probabilistic Economics: Learning Mode locked">
      <p>
        Enrol in the Probabilistic Economics course and activate your account to open this app in
        Learning Mode. It takes one screening case and states its range honestly: percentiles that
        are not endpoints, a sample that is only as reproducible as its seed, and a P-label that
        means one thing.
      </p>
    </LearningModeGate>
  );
}

const UncertaintyLearningPage = () => {
  const { toast } = useToast();
  const { actualRole } = useRole();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [courseProgress, setCourseProgress] = useState(null);
  const [capstone, setCapstone] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [cases, setCases] = useState(null);

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

  // runMonteCarlo is declared async by the engine, so the Scenario Builder
  // cases are awaited once and held. They are ISIALA's, the teaching field's.
  useEffect(() => {
    let live = true;
    scenarioBuilderCases().then((c) => { if (live) setCases(c); }).catch(() => { if (live) setCases(null); });
    return () => { live = false; };
  }, []);

  // Every one of these is a cheap engine call through the teaching lab. The
  // 5000 iteration breakeven runs live inside the panels, behind a button.
  const lab = useMemo(() => {
    const led = ledger('isiala');
    const sc = scenarios('isiala');
    const fit = fits();
    return {
      led,
      low: sc.find((x) => x.name === 'Low'),
      high: sc.find((x) => x.name === 'High'),
      capexFit: fit.rows[0],
      oldError: fit.capexCheck.beliefsAsEndpoints,
      narrow: fit.rows[3],
      curve: breakevenCurve(),
      d: distrust(),
      words: pLabelWords(),
    };
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

  const lowCase = lab.words.cases[0];
  const highCase = lab.words.cases[2];
  const lowRow = cases ? cases.rows.find((x) => x.caseKey === lowCase.caseKey) : null;
  const highRow = cases ? cases.rows.find((x) => x.caseKey === highCase.caseKey) : null;

  return (
    <>
      <Helmet><title>Probabilistic Economics (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Dices className="h-7 w-7 text-[#BFFF00]" /> Probabilistic Economics
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              A screening number becomes a decision only when its range is stated honestly. The teaching
              field ISIALA screens at {fmt(lab.led.metrics.npv)} million USD of net present value, and
              the same field reads {fmt(lab.low.metrics.npv)} million USD in its Low scenario and
              {' '}{fmt(lab.high.metrics.npv)} in its High. Its capex belief of {BELIEF.capex.join(', ')} million
              USD, stated as percentiles, fits a triangle running from {fmt(lab.capexFit.min)} to
              {' '}{fmt(lab.capexFit.max)}; read the same three numbers as endpoints and the quantiles come
              back as {lab.oldError.map((v) => fmt(v)).join(', ')}, with the tails gone. At its stated
              medians it breaks even at {fmt(lab.curve.baseBreakeven)} USD/bbl.
              {lowRow && highRow && (
                <>
                  {' '}Through the Scenario Builder&apos;s Monte Carlo at seed {cases.seed}, its {lowCase.caseLabel}
                  {' '}{lowCase.pLabel} is {fmt(lowRow.npv)} million USD and its {highCase.caseLabel}
                  {' '}{highCase.pLabel} is {fmt(highRow.npv)}.
                </>
              )}
              {' '}This course is where each of those numbers comes from, and which of them to distrust.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                One screening case and its range, percentiles done properly, and one convention with the
                numbers to distrust, on the vendored NPV Scenario Builder and Probabilistic Breakeven
                Analyzer engines. Every number on this page and inside every panel is a return value from
                those engines, pinned by a test file against the figures the lessons quote. {lab.words.definition}
                {' '}A breakeven price and every input take {lab.words.breakevenPrice.join(', ')} and never a
                P-label. And a triangle cannot honour every belief: the narrow opex belief of
                {' '}{lab.narrow.stated.join(', ')} has a shape ratio of {fmt(lab.narrow.shapeRatioDerived, 6)}, outside the band
                any triangle reaches, and the engine clamps it and says so.
              </CardDescription>
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

          {/* The workhorse panel, all tiers */}
          <ScreeningExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <BreakevenExplorer />}
          {tier === 'advanced' && <RiskExplorer />}

          {/* What the engines do not do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these engines do not do, and what they report that they do not mean</CardTitle>
              <CardDescription>
                These are SCREENING engines. The quick form builds a fixed life with royalty and tax only,
                no production sharing terms, no working interest and no inflation basis; those live in
                Petroleum Economics Studio. There is no economic limit, so a year that loses money is still
                produced and charged. An IRR is reported only where the search lands on a root: NTEJE
                loses {fmt(lab.d.nteje.npv)} million USD, never pays back, and the engine returns no IRR at all with
                the status {lab.d.nteje.irrStatus} and no payback with the status {lab.d.nteje.paybackStatus}; OKPOMA is worth
                {' '}{fmt(lab.d.okpoma.npv)} million USD and its one real root, {fmt(lab.d.okpoma.irr)} percent, is negative.
                Payback stays the first crossing, so OKPOMA reports {fmt(lab.d.okpoma.payback)} years with the status
                {' '}{lab.d.okpoma.paybackStatus}, because its cumulative falls to {fmt(lab.d.okpoma.maxExposure)} million USD in its
                second year and turns non-negative for good only at {fmt(lab.d.okpoma.paybackLast)} years. Discounting is mid-year: on
                ISIALA&apos;s own cash flows the engine&apos;s {fmt(lab.d.midYear.engineNpv)} million USD is
                {' '}{fmt(lab.d.midYear.ratioDerived, 6)} times the year-end {fmt(lab.d.midYear.yearEndNpvDerived)}.
                The Scenario Builder draws one factor per uncertain variable per iteration and applies it to every
                year, with the variable operating cost following the volume, and it never samples fixed opex, royalty
                or tax. None of this is an investment decision. It is the
                arithmetic under one, and the judgement stays with the engineer who signs it.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Capstone */}
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

export default UncertaintyLearningPage;
