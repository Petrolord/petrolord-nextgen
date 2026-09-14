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
  Loader2, Scale, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import RegimeExplorer from '@/components/course/panels/fiscal/RegimeExplorer';
import InstrumentExplorer from '@/components/course/panels/fiscal/InstrumentExplorer';
import ComparisonExplorer from '@/components/course/panels/fiscal/ComparisonExplorer';
import FiscalDefinitions from '@/components/course/panels/fiscal/FiscalDefinitions';
import {
  ODIDI_LABEL,
  templates, projectLife, templateTotals, ledger, costRecoverySweep, rFactorTable,
  taxDecomposition, upliftSweep, upliftTotalCapex, discountSweep, irrCases, irrBracketEvidence,
  comparison, priceSweep, capexSweep, shareCurveRegimes, tieEvidence, paybackTieEvidence,
  publishedCaseLines,
} from '@/components/course/panels/fiscal/fiscalLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

const APP = 'fiscal';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d })
  : '-');
const pct = (v, d = 4) => (Number.isFinite(v) ? `${Number(v).toFixed(d)} percent` : 'null');

const LESSONS = [
  { n: 1, title: 'A regime is four instruments and nothing else',
    body: 'A royalty, a cost recovery limit, a profit split and a tax stack. Everything a fiscal system does in this sandbox is one of those four moving, and a regime whose real burden lives somewhere else cannot be modelled here at all.' },
  { n: 2, title: 'The sandbox generates its own production and refuses four other jobs',
    body: 'It does not take a forecast, it generates one from a rate and a decline over a horizon fixed at 25 years. It spends every dollar of capex in year 1. It models no abandonment, no depreciation, no loss carryforward, no ring fence and no valuation date.' },
  { n: 3, title: 'The ledger cascades in one order and closes on an identity',
    body: 'Royalty off gross revenue, cost recovery against revenue after royalty, profit oil split, tax on the contractor share. In every year contractor net cash flow plus government cash flow equals gross revenue less opex less capex, and that identity is the first check to run on any ledger this engine produces.' },
  { n: 4, title: 'A sliding scale is a step, and the threshold belongs to the tier above it',
    body: 'The walk keeps the rate of every tier whose threshold the price has reached, so nothing between the tiers is interpolated and a price below every threshold pays the first tier rate rather than zero. A printed price is a rounding; the implied rate is the measurement.' },
  { n: 5, title: 'An unrecovered pool is a claim on future revenue, not a tax loss',
    body: 'The pool is the balance brought forward plus this year cost, the allowance is the limit applied to revenue after royalty, and cost recovered is the smaller of the two. It is not a deduction, not depreciation and not a loss carried forward.' },
  { n: 6, title: 'The R factor is a ratio of cumulatives and it is not monotone',
    body: 'Revenue declines while cost keeps accruing, so the ratio can cross back below a threshold it had passed and the contractor split steps back UP. Real R factor contracts usually ratchet. This one does not, and nothing in the engine says so.' },
  { n: 7, title: 'The tax base is the contractor profit share and the stack decomposes exactly',
    body: 'Because no rate enters the base, running the same regime with two of the three charges zeroed returns the third on its own. The RRT uplift is the parameter to sweep: it reads like a one-off capital uplift and behaves like an annual allowance.' },
  { n: 8, title: 'Discounting here is year end, and the parity with mid year is exact',
    body: 'Each year net cash flow is divided by one plus the rate raised to the year number, and year 1 is already discounted once. On identical flows a mid-year convention is larger by exactly the square root of one plus the rate.' },
  { n: 9, title: 'An internal rate of return can be a bound rather than a root',
    body: 'The solver returns 0 when the flows never change sign and 0 when the value at a rate of zero is not above zero, so a project that loses money at every rate reports 0. Past its search range it reports the bound, and a suspiciously round number where a rate should be is the tell.' },
  { n: 10, title: 'Government take and government share of net revenue are two different ratios',
    body: 'Government take, the headline, divides government cash flow by revenue less opex less capex. Government share of net revenue adds capex back and comes second. Both come from one call, undiscounted unless a label names a rate, and neither is a tax rate.' },
  { n: 11, title: 'Every point on the government take curve carries one of three states',
    body: 'A share; an exceeds point above 100 percent, where the contractor loses money while the government still collects and the true value is kept; and an undefined point, null, where lifetime profit is not positive although the government may have collected a great deal. Before believing a point, read its state and the two totals underneath it.' },
  { n: 12, title: 'A verdict that names a winner is only a verdict when the quantities separate',
    body: 'The capex verdict breaks a tie by list order, the price verdict declines to rank when its lead is under one percentage point, and the payback verdict ranks a whole year, where ties are the normal case. Where the column ties, the sentence names whichever regime has the highest net present value, under a different label.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Fiscal Regime Design: Learning Mode locked">
      <p>
        Enrol in the Fiscal Regime Design course and activate your account to open this app in
        Learning Mode. It sits directly on top of Cash Flow and NPV: the ledger that course builds
        is what a regime rearranges, and the four instruments this one takes apart are the whole of
        what a fiscal system can move once the barrels and the prices are settled.
      </p>
    </LearningModeGate>
  );
}

const FiscalLearningPage = () => {
  const { toast } = useToast();
  const { actualRole } = useRole();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [courseProgress, setCourseProgress] = useState(null);
  const [capstone, setCapstone] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [cmp, setCmp] = useState(null);

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

  // runFiscalComparison is declared async by the engine, so the headline
  // comparison numbers are awaited once and held. Every one of them is a
  // return value of that call, read off a PUBLISHED case or off the teaching
  // field, never off the graded case.
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const all = 'cmp_all_templates_default_project';
        const [summary, price, capex, share, tie, payback, odidi] = await Promise.all([
          comparison(all), priceSweep(all), capexSweep(all), shareCurveRegimes(), tieEvidence(),
          paybackTieEvidence(), comparison('odidi'),
        ]);
        if (live) setCmp({ summary, price, capex, share, tie, payback, odidi });
      } catch {
        if (live) setCmp(null);
      }
    })();
    return () => { live = false; };
  }, []);

  // Every one of these is an engine call through the teaching lab, so memoise
  // the set rather than re-running it on each render.
  const lab = useMemo(() => {
    const gomOnOdidi = ledger('usa___gulf_of_mexico', 'odidi');
    const piaOnOdidi = ledger('nigeria___pia__2021', 'odidi');
    const recovery = costRecoverySweep();
    const falls = rFactorTable('rfactor_falls_back');
    const tax = taxDecomposition('default');
    const uplift = upliftSweep();
    const rates = discountSweep();
    const irrs = irrCases();
    return {
      templateCount: templates().length,
      life: projectLife(),
      publishedCases: publishedCaseLines().length,
      odidiTotals: templateTotals('odidi'),
      gomOnOdidi,
      piaOnOdidi,
      recoveryTightest: recovery[0],
      recoveryLoosest: recovery[recovery.length - 1],
      falls,
      tax,
      upliftZero: uplift[0],
      upliftDefault: uplift.find((x) => x.rrtUpliftPct === 20),
      totalCapex: upliftTotalCapex(),
      rateZero: rates[0],
      rateTwelve: rates.find((x) => x.ratePct === 12),
      bracket: irrBracketEvidence(),
      irrs,
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

  const topOdidi = lab.odidiTotals.reduce((a, b) => (b.npv > a.npv ? b : a));
  const worstOdidi = lab.odidiTotals.reduce((a, b) => (b.npv < a.npv ? b : a));

  return (
    <>
      <Helmet><title>Fiscal Regime Design (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Scale className="h-7 w-7 text-[#BFFF00]" /> Fiscal Regime Design
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              A fiscal regime is four instruments: a royalty, a cost recovery limit, a profit split
              and a tax stack. Change nothing about a field except which of the
              {' '}{lab.templateCount} published templates it sits under and the numbers move a long
              way. The teaching field {ODIDI_LABEL} produces the same
              {' '}{fmt(lab.odidiTotals[0].totalRevenue)} million USD of revenue under every one of
              them, and returns {fmt(topOdidi.npv)} million USD of contractor net present value under
              {' '}{topOdidi.name} against {fmt(worstOdidi.npv)} million USD under {worstOdidi.name}.
              Government cash flow over the life runs from {fmt(worstOdidi.totalGovernmentTake)} down to
              {' '}{fmt(topOdidi.totalGovernmentTake)} million USD across the same six. Payback moves
              between year {lab.gomOnOdidi.paybackYear} and year {lab.piaOnOdidi.paybackYear}, and the
              closing unrecovered cost pool between {fmt(lab.gomOnOdidi.closingUnrecoveredPool)} and
              {' '}{fmt(lab.piaOnOdidi.closingUnrecoveredPool)} million USD. This course is where each
              of those numbers comes from, which instrument moved it, and which of the numbers the
              engine reports beside them are not what their labels say.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From four instruments to a ranked comparison, on the vendored fiscal regime sandbox
                and its {lab.publishedCases} published cash flow cases. Every number on this page and
                inside every panel is a return value from that engine, and the whole set is pinned by
                a test file that asserts the arguments as well as the arithmetic. Four results are
                worth the price of the course. THE LEDGER CLOSES ON AN IDENTITY: in every year of
                every regime, contractor net cash flow plus government cash flow equals gross revenue less
                opex less capex, which is why a cost recovery limit of
                {' '}{lab.recoveryTightest.limit} percent and one of {lab.recoveryLoosest.limit} percent
                leave closing pools of {fmt(lab.recoveryTightest.closingUnrecoveredPool)} and
                {' '}{fmt(lab.recoveryLoosest.closingUnrecoveredPool)} million USD and yet move the
                contractor total by only {fmt(lab.recoveryLoosest.totalContractorNCF - lab.recoveryTightest.totalContractorNCF)} million USD.
                THE R FACTOR IS NOT MONOTONE: on the published falling-back case it peaks at
                {' '}{fmt(lab.falls.peakRFactor, 6)}, crosses back down, and in year
                {' '}{lab.falls.splitReturnedYear} the contractor split steps back UP, which a
                ratcheted contract would never do and nothing in the engine says. THE UPLIFT IS
                CHARGED EVERY YEAR: the same regime pays {fmt(lab.upliftZero.totalTax)} million USD of
                tax at an uplift of {lab.upliftZero.rrtUpliftPct} percent and
                {' '}{fmt(lab.upliftDefault.totalTax)} million USD at the default
                {' '}{lab.upliftDefault.rrtUpliftPct} percent, because a fifth of the whole
                {' '}{fmt(lab.totalCapex)} million USD of capex is removed from the base in each of the
                {' '}{lab.life} years. And AN INTERNAL RATE OF RETURN CAN BE A BOUND: on the published
                runaway vector the engine reports {pct(lab.bracket.engineIrrPct)} against an oracle
                root of {lab.bracket.trueIrrPct === null ? 'none recorded' : pct(lab.bracket.trueIrrPct)},
                and {pct(lab.bracket.engineIrrPct)} is 100 doubled ten times rather than a root at all.
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
          <RegimeExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <InstrumentExplorer />}
          {tier === 'advanced' && <ComparisonExplorer />}

          {/* The course definitions, from the shared conventions module */}
          <FiscalDefinitions />

          {/* What the engine refuses to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not do, and what it says that it does not mean</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer. This is a regime SANDBOX and
                not a second fiscal truth: the single source of truth for Nigerian fiscal math is the
                Petroleum Economics Studio engine, and this model exists to compare the SHAPE of
                regimes against each other. It does not take a production forecast, it generates one
                over a horizon fixed at {lab.life} years with no input that changes it. It spends
                every dollar of capex in year 1. It models no abandonment, no depreciation, no loss
                carryforward against tax, no ring fencing and no valuation date, so a year whose tax
                base is negative pays nothing and passes nothing to the next year. Its tax stack
                decomposes exactly, which is a feature: the same regime returns
                {' '}{fmt(lab.tax.totalCitAlone)} million USD with company income tax alone,
                {' '}{fmt(lab.tax.totalRrtAlone)} million USD with the resource rent tax alone and
                {' '}{fmt(lab.tax.totalTaxAsPublished)} million USD with both, and the resource rent
                charge is zero until year {lab.tax.firstYearWithRrt} because of the annual uplift.
                Its discounting is YEAR END, so a mid-year convention on identical flows would report
                {' '}{fmt(lab.rateTwelve.npvMidYearDerived)} million USD where this one reports
                {' '}{fmt(lab.rateTwelve.npvYearEnd)}, a ratio of exactly
                {' '}{fmt(lab.rateTwelve.parityRatioDerived, 6)}. Its internal rate of return reports
                0 both when no root exists and when the only root is negative, which are opposite
                situations wearing one number.
                {cmp && (
                  <>
                    {' '}Its capex sweep has {cmp.capex.labelCount} points and an axis labelled to
                    1.5, because adding a tenth to a binary floating point number reaches
                    1.5000000000000004 and fails the test, so the loss it reports for
                    {' '}{cmp.capex.series[0].name} is {fmt(cmp.capex.series[0].lossOverSevenSweptPointsDerived)} million
                    USD where the eighth point called directly gives
                    {' '}{fmt(cmp.capex.series[0].lossOverEightPointsDerived)}. Its summary shows government share of
                    net revenue and its price chart government take, and the two differ by
                    {' '}{pct(cmp.summary.summary[0].effectiveTaxRateDifferenceDerived)} on the very
                    first row. Its government take curve has no value at any swept price for every
                    regime on the published never-recovers comparison, because lifetime profit is
                    not positive there, and each of those regimes collected between
                    {' '}{fmt(Math.min(...cmp.share.rows.map((x) => x.totalGovernmentTake)))} and
                    {' '}{fmt(Math.max(...cmp.share.rows.map((x) => x.totalGovernmentTake)))} million
                    USD for the government. And its payback verdict ranks a whole year: on
                    {' '}{cmp.payback[0].caseId} four of six regimes pay back in year
                    {' '}{cmp.payback[0].fastestPaybackYear}, and the sentence names
                    {' '}{cmp.payback[0].namedRegime}, which is also the highest net present value.
                  </>
                )}
                {!cmp && ' The comparison figures load once the engine has run the sweeps.'}
                {' '}None of this is a fiscal design decision. It is the arithmetic under one, and the
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

export default FiscalLearningPage;
