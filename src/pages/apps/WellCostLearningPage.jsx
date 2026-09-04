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
  Loader2, Calculator, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import TimeExplorer from '@/components/course/panels/wellcost/TimeExplorer';
import AfeExplorer from '@/components/course/panels/wellcost/AfeExplorer';
import RiskExplorer from '@/components/course/panels/wellcost/RiskExplorer';
import {
  HOURS_PER_DAY, NPT_FRAC, CONTINGENCY_FRAC, RISK_DOC, MC_ANALYTIC, BENCHMARK_INPUTS,
  publishedTotals, publishedRows, nptSweep, publishedAfe, publishedAfeSplit,
  contingencySweep, searchContingencyCrossing, largestItem, basisSlipSweep, deepeningSweep,
  curveEndpointCheck, publishedCostCurveCheckpoint, publishedCostPerMeter, sectionRankings,
  LONG_INTERMEDIATE_SECTIONS, publishedBenchmark, riskedRun, costPercentile, mcBaseAtModes,
} from '@/components/course/panels/wellcost/wellCostLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'wellcost';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const usd = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })
  : '-');

const pct = (v, d = 2) => (Number.isFinite(v) ? `${fmt(v * 100, d)} %` : '-');

const LESSONS = [
  { n: 1, title: 'Time is the thing being estimated',
    body: 'A well cost is a schedule with prices attached to it. Every activity carries hours, the hours become days, and the days multiply the largest lines on the estimate, so an argument about cost that never mentions the schedule is an argument about the wrong quantity.' },
  { n: 2, title: 'Four closed forms and nothing else',
    body: 'Drilling is interval over rate, a trip is twice the depth over the speed, casing is a run plus a flat term, and flat time is its own duration. Anything the four forms cannot say is not in this model, and the engine refuses rather than guessing.' },
  { n: 3, title: 'Drilling is a hyperbola, so rate times hours is invariant',
    body: 'The metres are what you asked for and the hours are what they cost. Halving the rate doubles the section exactly, which is why the same improvement in rate is worth far more on a slow section than on a fast one.' },
  { n: 4, title: 'A round trip is exactly twice the one way',
    body: 'The pipe comes out and goes back in. Reading a trip as a single run halves the tripping time in the estimate, and on a deep well that is days of rig time paid for at the day rate.' },
  { n: 5, title: 'Casing is affine, so no running speed beats the flat floor',
    body: 'Rigging up, circulating, cementing and waiting on cement do not care how fast the pipe went down. The curve flattens onto the flat time and never onto zero.' },
  { n: 6, title: 'The allowance is a fraction of PRODUCTIVE time',
    body: 'The engine multiplies every activity by one plus the allowance, so the non-productive hours are that fraction of the work and a smaller fraction of the elapsed well. Quoting one convention while computing the other loses days.' },
  { n: 7, title: 'A basis says what a line is exposed to',
    body: 'Per-day money buys time, per-metre money buys metres, and a lump is a price agreed once. A schedule slip moves the first and leaves the other two exactly where they were.' },
  { n: 8, title: 'Contingency is a provision that competes with contracts',
    body: 'It is a fraction of the base subtotal carried as its own line, so the base never moves. Raise the fraction far enough and the provision outranks the largest contracted line on the estimate.' },
  { n: 9, title: 'The cost curve ends on the BASE, never on the total',
    body: 'Provisions do not accrue. A curve drawn to the total would be showing money nobody has spent, and every progress comparison made against it would flatter the well.' },
  { n: 10, title: 'A percentile without its convention is not a number',
    body: 'The petroleum and cost conventions label the same tail with opposite names, and the suite sampler returns the petroleum one. Print its p90 beside the words conservative cost case and you have published the cheapest tenth of the run as your worst case.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Well Cost and Time: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Well Cost and Time course and activate your account to open this app in
        Learning Mode. Well Design and Surveys supplies the depths every activity here is measured
        against, Casing and Tubing Design and Cementing supply the strings and the jobs the casing
        activities stand for, and the schedule this app builds is what every day rate on the
        estimate is multiplied by.
      </p>
      <div className="flex justify-center">
        <Link to="/dashboard/enroll">
          <Button className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
            <GraduationCap className="h-4 w-4 mr-1" /> Enrol
          </Button>
        </Link>
      </div>
    </div>
  );
}

const WellCostLearningPage = () => {
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

  // Every one of these is an engine call through the lab, so memoise the set
  // rather than re-running it on each render. The risked run is the expensive
  // one and it is seeded, so the page quotes the same percentiles every time.
  const cm = useMemo(() => {
    const totals = publishedTotals();
    const rows = publishedRows();
    const npt = nptSweep([NPT_FRAC])[0];
    const afe = publishedAfe();
    const split = publishedAfeSplit();
    const at10 = contingencySweep([CONTINGENCY_FRAC])[0];
    const crossing = searchContingencyCrossing();
    const slips = basisSlipSweep([1, 1.5]);
    const deepen = deepeningSweep([0, 500]);
    const endpoint = curveEndpointCheck();
    const run = riskedRun();
    const ranks = sectionRankings(LONG_INTERMEDIATE_SECTIONS);
    return {
      totals,
      flatHr: rows.filter((r) => r.kind === 'flat').reduce((s, r) => s + r.productiveHr, 0),
      drills: rows.filter((r) => r.kind === 'drill').length,
      npt,
      afe,
      split,
      at10,
      crossing,
      biggest: largestItem(),
      slipBase: slips[0],
      slipped: slips[1],
      deepBase: deepen[0],
      deepened: deepen[1],
      endpoint,
      checkpoint: publishedCostCurveCheckpoint(),
      usdPerM: publishedCostPerMeter(),
      ranks,
      benchmark: publishedBenchmark(),
      run,
      basePctile: costPercentile(run, run.base.totalUsd),
      fixture: mcBaseAtModes(),
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
      <Helmet><title>Well Cost and Time (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Calculator className="h-7 w-7 text-[#BFFF00]" /> Well Cost and Time
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              This app answers three questions in order, and each one is harder than it looks. How
              long does the well take? The published programme is {fmt(cm.totals.productiveHr, 0)}
              {' '}productive hours over {fmt(cm.drills, 0)} drilling activities and
              {' '}{fmt(cm.flatHr, 0)} hours of flat time that no drilling rate can touch, stretched
              by an allowance of {fmt(NPT_FRAC, 5)} into {fmt(cm.totals.totalHr, 0)} elapsed hours,
              which is {fmt(cm.totals.totalDays, 4)} days at {fmt(HOURS_PER_DAY, 0)} hours to the
              day. Read that allowance as a share of the WORK and it is
              {' '}{pct(cm.npt.shareOfProductive, 2)}; read it as a share of the WELL and it is
              {' '}{pct(cm.npt.shareOfTotal, 2)}, and the difference between those two readings is
              the most expensive misunderstanding in the Associate tier. What does it cost? The AFE
              rolls {fmt(cm.afe.byItem.length, 0)} lines into a base of {usd(cm.afe.baseUsd)} USD,
              {' '}{pct(cm.split.tangibleFrac, 2)} of it tangible, plus a provision of
              {' '}{usd(cm.afe.contingencyUsd)} at {fmt(CONTINGENCY_FRAC, 5)} of the base, which is
              a total of {usd(cm.afe.totalUsd)} for approval. Put three equal lines of
              {' '}{usd(cm.slipBase.perDayUsd)} USD through a slip to
              {' '}{fmt(cm.slipped.totalDays, 4)} days and the per-day line becomes
              {' '}{usd(cm.slipped.perDayUsd)} while the per-metre line and the lump do not move at
              all; deepen the well by {fmt(cm.deepened.extraM, 0)} m at a fixed schedule and the
              mirror happens, the per-metre line moves to {usd(cm.deepened.perMeterUsd)} and the
              per-day line stays at {usd(cm.deepened.perDayUsd)}. And how confident is any of it?
              The cost-time curve ends at {usd(cm.endpoint.endUsd)} USD, which is the base subtotal
              to the last digit, with the {usd(cm.endpoint.contingencyUsd)} gap to the total being
              exactly the provision. A seeded run of {fmt(cm.run.iterations, 0)} realizations puts
              the mean at {usd(cm.run.meanUsd)} and the median at {usd(cm.run.medianUsd)}, and the
              deterministic total sits at the {pct(cm.basePctile, 1)} point of that distribution in
              the cost convention. This course is why each of those numbers is what it is.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From four closed forms to a risked estimate, on the vendored well cost and time
                engine and its own golden case. Every number on this page and inside every panel is
                a return value from that engine, and the whole set is pinned by a test file that
                asserts the ARGUMENTS as well as the arithmetic, so an engine change cannot quietly
                invert a lesson and still pass. Three of those arguments are worth the price of the
                course. The allowance is a fraction of productive time, so the published
                {' '}{fmt(NPT_FRAC, 5)} is {fmt(cm.npt.nptHr, 0)} hours on
                {' '}{fmt(cm.npt.productiveHr, 0)} rather than on {fmt(cm.npt.totalHr, 0)}. The
                provision at {fmt(CONTINGENCY_FRAC, 5)} is already the number {fmt(cm.at10.rank, 0)}
                {' '}line on the estimate and it overtakes {cm.biggest.label} at
                {' '}{fmt(cm.crossing.frac, 6)}, a fraction a frontier well can reach. And the cost
                curve ends on the base subtotal and not on the total, which is the difference
                between drawing money that has been spent and money that has only been set aside.
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
          <TimeExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <AfeExplorer />}
          {tier === 'advanced' && <RiskExplorer />}

          {/* What the engine refuses to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer. The engine is DETERMINISTIC
                by design: it models non-productive time as one smooth allowance on every activity
                and it cannot invent a stuck pipe, a well control event or a rig going off contract,
                so the risked run on this page samples the ranges the case declares,
                {' '}{fmt(RISK_DOC.uncertainties.length, 0)} of them at seed
                {' '}{fmt(RISK_DOC.seed, 0)}, and nothing else. A sampled result is confident by
                construction and says nothing about whether those ranges were right: the linear
                fixture reports a standard deviation of {fmt(MC_ANALYTIC.sdUsd, 6)} USD on a mean of
                {' '}{usd(MC_ANALYTIC.meanUsd)} against a modal base of {usd(cm.fixture.totalUsd)},
                and every one of those figures is a property of four triangular distributions
                somebody chose. The cost per metre form is the classic drilling one and it prices
                rig hours and a bit, which on the published inputs is {fmt(cm.usdPerM, 4)} USD per
                metre; it ranks sections by unit cost, and on a long-intermediate well that ranking
                comes apart from the ranking by total spend, {cm.ranks.bySpend.join(' then ')} by
                cheque against {cm.ranks.byUnitCost.join(' then ')} by metre. The regional
                benchmarks are INDICATIVE and the engine says so on every suggestion it returns:
                {' '}{BENCHMARK_INPUTS.region} at {fmt(BENCHMARK_INPUTS.mdM, 0)} m comes back with
                {' '}{fmt(cm.benchmark.dryHoleDays, 3)} dry hole days against a best in class of
                {' '}{fmt(cm.benchmark.bestInClassDays, 3)}, and it returns nothing at all for a
                region it does not know rather than interpolating one. None of this is an
                authorisation for expenditure. It is the arithmetic under one, and the judgement
                stays with the engineer who signs it.
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

export default WellCostLearningPage;
