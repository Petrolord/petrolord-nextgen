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
  Loader2, Landmark, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import LedgerExplorer from '@/components/course/panels/cashflow/LedgerExplorer';
import TimeExplorer from '@/components/course/panels/cashflow/TimeExplorer';
import FiscalExplorer from '@/components/course/panels/cashflow/FiscalExplorer';
import {
  AKATA_LABEL, GOLDEN_ENGINE_VERSION, MULTI_ROOT_VECTORS,
  akataKpis, akataBasisMatrix, akataInflationSweep, akataValuationYears,
  akataWorkingInterestSweep, akataDepreciationCases, akataUnderPia, akataPiaVariants,
  akataPscCapSweep, akataAbandoned, akataTail, akataBreakeven,
  irrVectors, distrustTable, refusals,
} from '@/components/course/panels/cashflow/cashflowLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

const APP = 'cashflow';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const fmt = (v, d = 2) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d })
  : '-');
const pct = (v, d = 6) => (Number.isFinite(v) ? `${Number(v).toFixed(d)} percent` : 'null');

const LESSONS = [
  { n: 1, title: 'A field is a ledger with one row per year',
    body: 'Volumes, an applied price, gross revenue, royalty, opex, capex, depreciation, taxable income, tax and net cash flow, in that order, and every headline number is a reading of those rows under a stated convention. A number without its convention is not a number.' },
  { n: 2, title: 'Rows become years before anything is priced',
    body: 'Per-well columns beat the rollup, a month index is folded to a calendar year, and a file that names no volume column, no usable date or no cost column is refused with the message that says so. The engine will not guess a column.' },
  { n: 3, title: 'The joint venture ledger mixes two bases',
    body: 'Gross revenue, volumes, opex, capex and depreciation stay at field level while royalty, taxable income, tax and net cash flow are the working-interest share. A reader who scales the wrong lines is wrong by the working interest, in one direction or the other.' },
  { n: 4, title: 'Depreciation is a deduction, never a cash flow',
    body: 'It reduces taxable income and therefore tax, and it never appears in net cash flow, which carries the capex it was built from instead. A shorter depreciation life moves NPV without moving a single cash flow.' },
  { n: 5, title: 'Government take counts partners as government',
    body: 'Take under joint venture terms is the field pre-take value minus the contractor SHARE of net cash flow, over the pre-take value, so below a full working interest the other partners share is counted as take. The course grades the number as the engine defines it.' },
  { n: 6, title: 'On the real basis NPV does not move with inflation',
    body: 'With the escalators set, deflating the flows and deflating the rate through the Fisher relation cancel, so the same NPV is reported at every inflation rate while the real total cash flow falls by a third. The convention that DOES move NPV is mid-year against end-year.' },
  { n: 7, title: 'Sunk is a decision, not a date',
    body: 'Valuing from a later year with prior rows kept adds a year of compounding. Valuing from the same year with prior rows SUNK nearly triples the NPV, reports the sunk flow separately, and returns a null IRR because nothing negative is left to bracket a root.' },
  { n: 8, title: 'The profile point at the applied rate is not the headline',
    body: 'The NPV profile evaluates its applied-rate point at the rate rounded to two decimals, so the labelled point sits a few tens of thousands of USD off the headline NPV that the same run reports. The profile does not pass through the number it claims to.' },
  { n: 9, title: 'IRR is a property of a curve, not of a project',
    body: 'A cash flow with a terminal negative can have two rates that zero its NPV. The engine reports the root Newton reaches from 10 percent and does not say there is another; the oracle reports the root nearest zero. Both zero the NPV and neither is the project.' },
  { n: 10, title: 'A production sharing pool is never on the rows',
    body: 'Cost recovery under a cap defers cost into a pool the returned rows do not carry, so the pool at cessation has to be marched from the rows by hand. Below the cap that clears the pool, the field is uneconomic before a single fiscal rate changes.' },
  { n: 11, title: 'The PIA cascade is five taxes on three bases',
    body: 'Royalties on gross revenue, hydrocarbon tax and company income tax on their own taxable incomes, a development levy or an education tax depending on the framework the base year selects. The terrain string moves NPV by more than an oil price sweep does.' },
  { n: 12, title: 'Three numbers the engine reports that a careful reader distrusts',
    body: 'The profile point at the rounded rate, the single IRR on a multi-root profile, and a sinking fund that is working-interest scaled while the lump sum abandonment it replaces is not. Each one is a return value, and each one needs a sentence beside it.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Cash Flow and NPV: Learning Mode locked">
      <p>
        Enrol in the Cash Flow and NPV course and activate your account to open this app in
        Learning Mode. This is the root of the Economics path: the ledger it builds is what every
        fiscal comparison, every probabilistic run and every portfolio ranking downstream of it
        reads, and the conventions it names are the ones a sanction number is silent about.
      </p>
    </LearningModeGate>
  );
}

const CashflowLearningPage = () => {
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

  const deep = hasDeepCourse(APP, tier);
  const capstoneOpen = !deep
    || courseProgress?.capstone?.unlocked === true
    || courseProgress?.capstone?.passed === true
    || actualRole === 'super_admin';

  // Every one of these is an engine call through the teaching lab, so memoise
  // the set rather than re-running it on each render. Every number is read off
  // a published golden or off the teaching field, never off the graded case.
  const cm = useMemo(() => {
    const kpis = akataKpis();
    const basis = akataBasisMatrix();
    const inflation = akataInflationSweep();
    const valuation = akataValuationYears();
    const wi = akataWorkingInterestSweep();
    const depr = akataDepreciationCases();
    const pia = akataUnderPia();
    const piaVariants = akataPiaVariants();
    const psc = akataPscCapSweep();
    const abandoned = akataAbandoned();
    const tail = akataTail();
    const distrust = distrustTable();
    const vectors = irrVectors();
    const find = (list, label) => list.find((r) => r.label === label);
    return {
      kpis,
      endYear: basis.find((b) => b.basis === 'real' && b.convention === 'end_year'),
      midYear: basis.find((b) => b.basis === 'real' && b.convention === 'mid_year'),
      nominalEndYear: basis.find((b) => b.basis === 'nominal' && b.convention === 'end_year'),
      inflationFirst: inflation[0],
      inflationLast: inflation[inflation.length - 1],
      inflationCount: inflation.length,
      npvUnchanged: inflation.every((r) => r.npv === inflation[0].npv),
      forward2030: valuation.find((r) => r.valuationYear === 2030 && !r.treatPriorAsSunk),
      sunk2030: valuation.find((r) => r.valuationYear === 2030 && r.treatPriorAsSunk),
      wi100: wi.find((r) => r.wiPct === 100),
      wi60: wi.find((r) => r.wiPct === 60),
      deprDefault: depr[0],
      depr5: find(depr, 'jv_psc_depr_years 5'),
      pia,
      deepConservative: find(piaVariants, 'deep_offshore conservative'),
      deepAggressive: find(piaVariants, 'deep_offshore aggressive'),
      price120: find(piaVariants, 'oil price 120'),
      pscBelow: psc.find((r) => r.poolAtCessation > 0),
      pscClears: psc.find((r) => r.poolAtCessation === 0),
      lump: find(abandoned, 'lump sum 60000000 in the final year'),
      lumpWi50: find(abandoned, 'lump sum 60000000 at WI 50'),
      fundWi50: find(abandoned, 'sinking fund 60000000 at WI 50'),
      tail,
      gapAkata: distrust.profileGap.find((r) => r.case === AKATA_LABEL),
      twoRoot: distrust.twoRoots[0],
      sinkingFund: distrust.sinkingFund,
      multiRootCount: vectors.filter((v) => MULTI_ROOT_VECTORS.includes(v.name)).length,
      disagreeCount: vectors.filter((v) => v.disagrees).length,
      breakeven: akataBreakeven(),
      refusalCount: refusals().length,
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

  return (
    <>
      <Helmet><title>Cash Flow and NPV (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Landmark className="h-7 w-7 text-[#BFFF00]" /> Cash Flow and NPV
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              A field's economics is a ledger with one row per year, and every number a decision
              is made on is a reading of that ledger under a stated convention. The teaching field
              {' '}{AKATA_LABEL}, seven years of oil and gas under joint venture terms, reports an NPV of
              {' '}{fmt(cm.kpis.npv)} USD, an IRR of {pct(cm.kpis.irr)}, a payback of
              {' '}{cm.kpis.payback} and a government take of {pct(cm.kpis.government_take_pct)}.
              Change nothing but the discounting convention from end-year to mid-year and the same
              rows report {fmt(cm.midYear.npv)} USD. Value the same rows from 2030 with the first
              year kept and they report {fmt(cm.forward2030.npv)} USD; value them from 2030 with the
              first year SUNK and they report {fmt(cm.sunk2030.npv)} USD with a null IRR. Run the
              same rows under the Petroleum Industry Act and the NPV is {fmt(cm.pia.kpis.npv)} USD
              as a shallow-water converted lease and {fmt(cm.deepConservative.npv)} USD as a deep
              offshore one. This course is why each of those numbers is what it is, which convention
              it silently carries, and what the engine that produced it refuses to tell you.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From uploaded rows to a swept sanction number, on the vendored Petroleum Economics
                Studio engine (version {GOLDEN_ENGINE_VERSION}) and its own published goldens. Every
                number on this page and inside every panel is a return value from that engine, and
                the whole set is pinned by a test file that asserts the arguments as well as the
                arithmetic. Four results are worth the price of the course. On the real basis with
                the escalators set, NPV does not move with inflation: {AKATA_LABEL} reports
                {' '}{fmt(cm.inflationFirst.npv)} USD at every one of {cm.inflationCount} inflation
                rates from {fmt(cm.inflationFirst.inflationPct, 0)} to
                {' '}{fmt(cm.inflationLast.inflationPct, 0)} percent, while the real total net cash
                flow falls from {fmt(cm.inflationFirst.totalNetCashFlowReal)} to
                {' '}{fmt(cm.inflationLast.totalNetCashFlowReal)} USD and the applied real rate falls
                from {pct(cm.inflationFirst.appliedRealRatePct)} to
                {' '}{pct(cm.inflationLast.appliedRealRatePct)}. Sunk is a decision, not a date:
                valuing from 2030 with prior years sunk reports {fmt(cm.sunk2030.sunkNetCashFlow)} USD
                as the sunk flow and an IRR of {cm.sunk2030.irrPct === null ? 'null' : pct(cm.sunk2030.irrPct)},
                because nothing negative is left to bracket a root. A cash flow with a terminal
                negative has two rates that zero its NPV: the published vector
                {' '}[{cm.twoRoot.flows.join(', ')}] is zero at {pct(cm.twoRoot.oracleIrrPct, 4)} and
                at {pct(cm.twoRoot.engineIrrPct, 4)}, the engine reports the second and the oracle
                the first, and {cm.disagreeCount} of the {cm.multiRootCount} published multi-root
                vectors disagree the same way. And the PIA cascade is five taxes on three bases:
                {' '}{AKATA_LABEL} pays {fmt(cm.pia.totalRoyalties)} USD of royalties,
                {' '}{fmt(cm.pia.totalHct)} USD of hydrocarbon tax, {fmt(cm.pia.totalCit)} USD of
                company income tax and {fmt(cm.pia.totalDevLevy)} USD of development levy under the
                {' '}{cm.pia.framework} framework, and moving the same field to deep offshore under
                the conservative reading zeroes the hydrocarbon tax and takes NPV from
                {' '}{fmt(cm.pia.kpis.npv)} to {fmt(cm.deepConservative.npv)} USD, further than an
                oil price of 120 does at {fmt(cm.price120.npv)} USD.
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
          <LedgerExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <TimeExplorer />}
          {tier === 'advanced' && <FiscalExplorer />}

          {/* What the engine refuses to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer. The engine REFUSES
                {' '}{cm.refusalCount} kinds of upload outright, each with a message that names the
                missing column or price, and it will not guess a volume column, a date or a cost
                column it does not recognise. It keeps the joint venture ledger on two bases at once:
                gross revenue is {fmt(cm.wi100.year1GrossRevenue)} USD in the first year at every
                working interest, while the royalty on the same row is {fmt(cm.wi100.year1Royalty)} USD
                at a full interest and {fmt(cm.wi60.year1Royalty)} USD at 60 percent, and the take it
                reports rises from {pct(cm.wi100.takePct)} to {pct(cm.wi60.takePct)} because the
                partners' share is counted as government. Its default ten-year straight line claims
                {' '}{fmt(cm.deprDefault.depreciationSum)} USD of {fmt(cm.deprDefault.totalCapex)} USD of
                capex before the field ends, and a five-year life claims {fmt(cm.depr5.depreciationSum)} USD
                and moves NPV to {fmt(cm.depr5.npv)} USD without moving a single cash flow. Its NPV
                profile evaluates the applied-rate point at the rate rounded to two decimals, so the
                point labelled {fmt(cm.gapAkata.engineRatePct, 1)} reads {fmt(cm.gapAkata.engineNpv)} USD
                against a headline of {fmt(cm.gapAkata.oracleNpv)} USD at
                {' '}{pct(cm.gapAkata.oracleRatePct)}, a gap of {fmt(cm.gapAkata.gap)} USD that the
                header says cannot exist. Its IRR on a multi-root profile is whichever root Newton
                reaches from 10 percent, unflagged. Its production sharing rows never carry the cost
                pool: at a {fmt(cm.pscBelow.capPct, 0)} percent cap {AKATA_LABEL} ends with
                {' '}{fmt(cm.pscBelow.poolAtCessation)} USD unrecovered and an NPV of
                {' '}{fmt(cm.pscBelow.npv)} USD, and the pool has to be marched from the rows by hand.
                Its economic limit is off by default, so a long tail is kept until it is switched on,
                when the same field is cut at {cm.tail.limitOn.economicLimitYear} with
                {' '}{cm.tail.limitOn.yearsTrimmed} years trimmed. And its sinking fund is
                working-interest scaled while its lump sum is not: a {fmt(cm.lump.totalAbandonmentCost, 0)} USD
                abandonment at a 50 percent interest leaves an NPV of {fmt(cm.lumpWi50.npv)} USD as a
                lump sum and {fmt(cm.fundWi50.npv)} USD as a fund. The breakeven oil price of
                {' '}{fmt(cm.breakeven.breakeven, 6)} USD per bbl is null the moment a price deck is
                set. None of this is a sanction decision. It is the arithmetic under one, and the
                judgement stays with the engineer who signs it.
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

export default CashflowLearningPage;
