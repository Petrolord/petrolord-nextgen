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
  Loader2, Briefcase, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import CapitalExplorer from '@/components/course/panels/portfolio/CapitalExplorer';
import CostExplorer from '@/components/course/panels/portfolio/CostExplorer';
import GovernanceExplorer from '@/components/course/panels/portfolio/GovernanceExplorer';
import {
  setLabel, endToEnd, okonoBudgets, okonoInventory, distrust,
} from '@/components/course/panels/portfolio/portfolioLab';
import { OUTCOME_LABELS, EXCEEDANCE_DEFINITION } from '@petrolord/engines/lib/conventions/percentile.js';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Capital Portfolio & Cost Control course page. Every number it prints is a
// return value from the teaching lab (portfolioLab), which is a return value from
// the vendored portfolio and AFE engines on the teaching fields OKONO and OFON-1.
// It never reads the capstone: panelCapstoneGuard.test.js greps this file too.

const APP = 'portfolio';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d })
  : '-');

const LESSONS = [
  { tier: 'Associate', title: 'Capital is a constraint',
    body: 'More projects than money. The optimizer funds each project whole or not at all, in million USD, and refuses a negative capex.' },
  { tier: 'Associate', title: 'Risking a project',
    body: 'A chance of success and a failure cost turn a success-case NPV into a risked EMV, which can be a small fraction of it.' },
  { tier: 'Associate', title: 'Choosing under a budget',
    body: 'The funded set at five limits, money left unspent, and why filling greedily by EMV per million USD can lose to the optimum.' },
  { tier: 'Associate', title: 'The efficient frontier',
    body: 'The best risked EMV at every spend, the value of the next million USD, and funded sets that are not nested.' },
  { tier: 'Associate', title: 'The grid under the answer',
    body: 'The optimizer works on a grid. On a fractional or large limit it can overshoot, now flagged, or undershoot, still unflagged.' },
  { tier: 'Associate', title: 'The Associate reading',
    body: 'OKONO end to end: what is funded at each budget, what it is worth risked, and what the grid did to the answer.' },
  { tier: 'Professional', title: 'An AFE is a promise',
    body: 'Lines, budgets, commitments and actuals in the AFE currency, and invoices that the S-curve reads instead of the lines.' },
  { tier: 'Professional', title: 'One forecast rule',
    body: 'The entered forecast when it is positive, otherwise the larger of the budget and actual plus commitment, on every screen.' },
  { tier: 'Professional', title: 'Earned value',
    body: 'Budget times progress, CPI as earned value over actuals, and percent spent read against percent complete.' },
  { tier: 'Professional', title: 'The as-of date',
    body: 'Planned value, time progress and SPI move with the as-of date and nothing else does. On the start day SPI is null.' },
  { tier: 'Professional', title: 'The S-curve',
    body: 'Monthly plan, actual and forecast over the window, a plan that stops short of the budget, and a forecast that ignores actuals.' },
  { tier: 'Professional', title: 'The Professional reading',
    body: 'OFON-1 end to end at a stated date: EAC, variance at completion, earned value, CPI and SPI.' },
  { tier: 'Expert', title: 'Portfolio risk by simulation',
    body: 'The chance of loss and the low and high cases come from a seeded simulation of success and failure, not a normal curve.' },
  { tier: 'Expert', title: 'Correlation',
    body: 'One rho widens the spread and leaves the mean alone, and the closed-form spread and the simulated one are two models.' },
  { tier: 'Expert', title: 'Joint venture shares',
    body: 'The operator carries what the partners do not. An over-allocated or negative split is shown and flagged, never billed quietly.' },
  { tier: 'Expert', title: 'Refusals and flags',
    body: 'What the engines decline to compute, what they compute and flag, and the findings left unrepaired as properties.' },
  { tier: 'Expert', title: 'Numbers to distrust',
    body: 'CPI of 1 before any spend, an undated invoice counted from 1970, a plan short of its budget, and a seed that buys only repeatability.' },
  { tier: 'Expert', title: 'The Expert reading',
    body: 'Risk, correlation and shares read together, with what a portfolio model cannot tell you.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Capital Portfolio & Cost Control: Learning Mode locked">
      <p>
        Enrol in the Capital Portfolio &amp; Cost Control course and activate your account to open this app in
        Learning Mode. It takes one capital inventory and one well AFE and reads them honestly: what a budget
        funds, what the spend has earned at a stated date, and how much of the risk a simulation can show.
      </p>
    </LearningModeGate>
  );
}

const PortfolioLearningPage = () => {
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

  // Engine calls through the teaching lab: a few knapsacks, a handful of seeded
  // 10000 iteration risk summaries and the AFE metrics at stated dates.
  const lab = useMemo(() => {
    try {
      const e = endToEnd();
      const b = okonoBudgets();
      const inv = okonoInventory();
      return { e, b, hand: inv.hand, d: distrust() };
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

  const [at450, at600] = lab ? lab.e.okono : [null, null];

  return (
    <>
      <Helmet><title>Capital Portfolio &amp; Cost Control (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-[#BFFF00]" /> Capital Portfolio &amp; Cost Control
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                Capital is a constraint before it is a number. The teaching inventory OKONO funds {setLabel(at450.ids)} at a
                limit of {fmt(at450.limit, 0)} million USD for a risked EMV of {fmt(at450.totalEmv)} million USD, and at
                {' '}{fmt(at600.limit, 0)} it funds {setLabel(at600.ids)} instead: a bigger budget dropped a project. Its
                exploration well {lab.hand.id} would be worth {fmt(lab.hand.npvP50)} million USD if it worked and carries
                {' '}{fmt(lab.hand.emv)} risked. The teaching AFE OFON-1, read as of {lab.e.ofon.asOf}, forecasts
                {' '}{fmt(lab.e.ofon.eac, 0)} USD at completion against its budget, a variance of {fmt(lab.e.ofon.variance, 0)} USD,
                with a CPI of {fmt(lab.e.ofon.cpi, 6)} and an SPI of {fmt(lab.e.ofon.spi, 6)}. The same curve&apos;s last forecast point
                shows {fmt(lab.d.underrunPicture.lastForecast, 0)} USD, below the budget: an overrun drawn as an underrun.
                {' '}This course is where each of those numbers comes from, and which of them to distrust.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                One capital inventory, one well AFE and one portfolio risk summary, on the vendored Capital Portfolio
                Studio and AFE Cost Control Manager engines. Every number on this page and inside every panel is a return
                value from those engines, pinned by a test file against the figures the lessons quote. {EXCEEDANCE_DEFINITION}
                {' '}Only a portfolio NPV outcome carries one: its low case is {OUTCOME_LABELS.p90} and its high case {OUTCOME_LABELS.p10}.
                A capex, a budget, a forecast, a cost or a probability never does.
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

          {tier === 'beginner' && <CapitalExplorer />}
          {tier === 'intermediate' && <CostExplorer />}
          {tier === 'advanced' && <GovernanceExplorer />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these engines do not do, and what they report that they do not mean</CardTitle>
              <CardDescription>
                These are SCREENING engines. Projects are funded whole; capex is spent in one period and never phased; there is
                no time value beyond the NPVs entered; correlation is one average number; the success spread is normal; the AFE
                plan is a straight line; and earned value is only as good as the progress typed in.
                {lab && (
                  <>
                    {' '}On a limit of {fmt(lab.b.greedy.limit, 0)} million USD a greedy fill by EMV per million USD funds
                    {' '}{setLabel(lab.b.greedy.ids)} for {fmt(lab.b.greedy.emvDerived)}, while the optimizer finds {fmt(lab.b.greedy.optimalEmv)}.
                    {' '}With every actual set to 0 the AFE engine still reports a CPI of {fmt(lab.d.cpiBeforeSpend.cpi, 6)}, and
                    OFON-1&apos;s monthly plan stops {fmt(lab.d.shortPlan.shortDerived, 0)} USD short of its own budget.
                  </>
                )}
                {' '}None of this is an investment decision. It is the arithmetic under one, and the judgement stays with the
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

export default PortfolioLearningPage;
