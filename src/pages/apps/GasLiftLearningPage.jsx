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
  Loader2, Gauge, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import ColumnExplorer from '@/components/course/panels/gaslift/ColumnExplorer';
import ValveExplorer from '@/components/course/panels/gaslift/ValveExplorer';
import UnloadingExplorer from '@/components/course/panels/gaslift/UnloadingExplorer';
import {
  GAS_LIFT_THRESHOLDS, RULE_OF_THUMB_PSI_PER_FT, INJECTION_POINT_GATE_PSI, KNIFE_EDGE_ID,
  ruleOfThumbSummary, refinementTargets, stepRefinementHeadline,
  knifeEdge, knifeEdgeDecrementRows, injectionPointShipped,
  ppoDivergence, validationGap, minSpacingExemption, refusals,
} from '@/components/course/panels/gaslift/gasLiftLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'gaslift';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const tiny = (v) => {
  if (!Number.isFinite(v)) return '-';
  if (v === 0) return '0';
  return Math.abs(v) < 0.005 ? v.toExponential(3) : fmt(v, 6);
};

const LESSONS = [
  { n: 1, title: 'The injection line is a real gas column and its weight is not a constant',
    body: 'The gradient is density over 144, and density goes as pressure over z times temperature. So compression pushes the gradient up as you go down and the geotherm pushes it down, and which one wins is a race rather than a story. The flat rule of thumb has no pressure in it at all, so it errs in BOTH directions.' },
  { n: 2, title: 'The isothermal control is what settles it',
    body: 'Hold the same column at its wellhead temperature and the local gradient rises with depth. Let the temperature run and it falls. Two curves, one input changed, everything else identical. A plausible account that names only one of two competing effects is the commonest way to be confidently wrong.' },
  { n: 3, title: 'The column converges, which is the honest negative result',
    body: 'Not everything numerical is suspect. The march is second order and every doubling of the step count cuts the error by about four, all the way down. A programme that only ever reports defects is not measuring anything, and the skill is telling a truncation apart from a formulation gap by refining and watching.' },
  { n: 4, title: 'Two closed forms, and only one of them the march can reach',
    body: 'The textbook coefficient and the engine own air molar mass over 144 times the gas constant differ in the fourth decimal place. Refined against the first the march PARKS at that gap forever. Refined against the second it converges. A truncation is a thing refinement removes and a formulation difference is not.' },
  { n: 5, title: 'Spacing is a recursion, not a formula',
    body: 'A valve depth has the depth on both sides of it: the injection pressure at a depth decides where the valve goes, and where the valve goes decides the injection pressure. Change the surface decrement and every depth BELOW the change moves while every depth above it stays put.' },
  { n: 6, title: 'A dome charge is a thermometer as much as a spring',
    body: 'The shop charges the dome cold on a test rack and the well reads it hot. Those are two readings of one charge, and the test rack figure divides by one minus the port to bellows ratio on top of that. Report either at the other one temperature and the two swap places.' },
  { n: 7, title: 'A negative spread is a convention error, not a valve property',
    body: 'A spread is a pressure fall across a valve, so it is positive by construction. On a production operated string this package returns a negative one on every valve, because the closing test converts a dome balancing against the TUBING into a CASING pressure. One root cause, two symptoms, and the louder one went unreported.' },
  { n: 8, title: 'The throughput is an orifice equation and it says so',
    body: 'Below the critical pressure ratio nothing downstream matters and every row carries the same rate. Above it the rate falls away. But a real valve throttles on its stem before the port is fully open, so this is an upper bound on what a valve passes and not a prediction of it.' },
  { n: 9, title: 'The most consequential boolean in the output sits on a knife edge',
    body: 'Whether a string MULTIPOINTS, meaning two valves inject at once, is the single most consequential thing the design emits. On the published knife edge case it hangs on a fraction of a psi of closing margin, and it flips on a quarter of a psi of surface decrement.' },
  { n: 10, title: 'And it moves as a step function, not as a slope',
    body: 'The design gas rate reaches the verdict ONLY through the port selection, and the port selection is a lookup in a catalogue. A coarse sweep steps over the flip. A fine one finds nothing between two catalogue sizes and reads that as stability. A sweep resolution has to match the mechanism.' },
  { n: 11, title: 'The deepest injection point is found by chord, and the chord cannot see its own error',
    body: 'The crossing is located on straight lines between whatever rows the caller tabulated, and BOTH sides of the residual come off the same pair of chords. So the residual reported at the answer says the two chords agree with each other and nothing more.' },
  { n: 12, title: 'Which is why the residual is not a tolerance you can tighten',
    body: 'The ratio of the true residual to the reported one is not constant and is not even monotone in the tabulation. Refining the table can make the reported number LESS representative of the real error. An engineer tightening an acceptance tolerance on it is ranking answers on a quantity that cannot rank them.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Gas Lift Design: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Gas Lift Design course and activate your account to open this app in Learning
        Mode. A gas lift design is a race between two pressures down the same hole: the injection
        gas in the annulus getting heavier as it goes down, and the kill fluid it is pushing out
        getting lighter as gas replaces it. Every valve in the string exists to hand the well from
        one depth to a deeper one.
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

const GasLiftLearningPage = () => {
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
  // the set rather than re-running it on each render. Every number is read off a
  // published golden, off the published catalogue, or off one of the two
  // teaching constructs this course built for itself, and never off the graded
  // well.
  const cm = useMemo(() => {
    const summaries = [1, 2, 3].map(ruleOfThumbSummary);
    const targets = refinementTargets();
    const packer = targets.find((t) => t.label.includes('at its packer')) || targets[0];
    const shipped = injectionPointShipped();
    return {
      summaries,
      heaviest: summaries.reduce((a, b) => (b.surfaceGradientPsiPerFt > a.surfaceGradientPsiPerFt ? b : a)),
      lightest: summaries.reduce((a, b) => (b.surfaceGradientPsiPerFt < a.surfaceGradientPsiPerFt ? b : a)),
      packerHeadline: stepRefinementHeadline(packer),
      knife: knifeEdge(),
      knifeSweep: knifeEdgeDecrementRows(),
      shipped,
      ppo: ppoDivergence(),
      validation: validationGap(),
      exemption: minSpacingExemption(),
      refusals: refusals(),
    };
  }, []);

  const watermark = gate.quota?.export_watermark;
  const publishedFlip = cm.knifeSweep.find((r) => r.isPublished) || null;
  const flips = publishedFlip
    ? cm.knifeSweep.filter((r) => r.stage5Multipointing !== publishedFlip.stage5Multipointing)
    : [];

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
      <Helmet><title>Gas Lift Design (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Gauge className="h-7 w-7 text-[#BFFF00]" /> Gas Lift Design
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              This app answers three questions in order and each one is harder than it looks. How
              heavy is the injection gas? Heavy enough that the flat
              {' '}{fmt(RULE_OF_THUMB_PSI_PER_FT, 3)} psi/ft rule of thumb reads
              {' '}{fmt(cm.heaviest.surfaceGradientPsiPerFt, 6)} psi/ft on one published column and
              {' '}{fmt(cm.lightest.surfaceGradientPsiPerFt, 6)} psi/ft on another, wrong in one
              direction on the first and in the other on the second, and heavy enough that the local
              gradient FALLS with depth on all three while the same columns held at their wellhead
              temperature RISE. Where do the mandrels go? Nowhere a formula puts them: a valve depth
              is the fixed point of a recursion the engine stops at
              {' '}{fmt(GAS_LIFT_THRESHOLDS.fixedPointToleranceFt, 3)} ft, and moving the surface
              decrement moves every depth below the change while leaving every depth above it
              exactly where it was. And what does the string actually do when it unloads? On the
              published {cm.knife.id} case whether it injects at two depths at once comes down to
              {' '}{fmt(cm.knife.oracleMarginPsi, 9)} psi of closing margin on a
              {' '}{fmt(cm.knife.pKickoffPsia, 2)} psia system. This course is why each of those
              numbers is what it is, and what each of them refuses to tell you.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From a gas column to an unloading sequence, on the vendored production gas lift
                engine and its own published goldens. Every number on this page and inside every
                panel is a return value from that engine, pinned by a test file that asserts the
                ARGUMENTS as well as the arithmetic, so an engine change cannot quietly invert a
                lesson and still pass. Four findings are worth the price of the course. The gradient
                grows with PRESSURE and whether it grows with DEPTH is a race the geotherm wins:
                held at their wellhead temperature the three published columns rise by
                {' '}{fmt(cm.summaries[0].isothermalGradientChangePct, 4)},
                {' '}{fmt(cm.summaries[1].isothermalGradientChangePct, 4)} and
                {' '}{fmt(cm.summaries[2].isothermalGradientChangePct, 4)} percent, and let run they
                all fall. Spacing is a recursion, so a decrement is the step size of a whole string
                rather than a property of one valve. The multipointing verdict on the
                {' '}{KNIFE_EDGE_ID} case turns on {fmt(cm.knife.oracleMarginPsi, 9)} psi and
                {flips.length
                  ? ` flips at ${fmt(flips.reduce((a, b) => (Math.abs(b.decrementPsi - cm.knife.decrementPsi) < Math.abs(a.decrementPsi - cm.knife.decrementPsi) ? b : a)).decrementPsi, 4)} psi per valve against the published ${fmt(cm.knife.decrementPsi, 4)}`
                  : ' holds across the whole decrement sweep'}, which is a quarter of a psi of a
                quantity no installation on earth controls to. And the deepest injection point
                reports a residual of {tiny(cm.shipped.reportedResidualPsi)} psi at an answer whose
                true residual is {tiny(cm.shipped.trueResidualPsi)} psi,
                {' '}{fmt(cm.shipped.trueOverReported, 4)} times larger, comfortably inside the
                engine own {fmt(INJECTION_POINT_GATE_PSI, 3)} psi gate and
                {' '}{fmt(cm.shipped.depthErrorFt, 6)} ft off the depth.
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
          <ColumnExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <ValveExplorer />}
          {tier === 'advanced' && <UnloadingExplorer />}

          {/* What the engine refuses to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer, and this module is unusually
                blunt about its own. It does not solve the well inflow and it does not solve
                multiphase outflow: the flowing production traverse used to find the injection point
                is PASSED IN as a depth and pressure table, so the caller can build it from a
                validated nodal model rather than this module inventing a gradient. The unloading
                and transfer lines are STRAIGHT lines on constant gradients, which a real unloading
                column is not, and the engine declares them as inputs rather than pretending
                otherwise. The column is STATIC: no friction, no velocity, no injection rate in the
                annulus at all, so the casing pressure it computes is the shut in gas column and not
                a flowing one. Intermittent lift is not modelled anywhere. The dome charge
                compressibility is extrapolated off a natural gas basis onto nitrogen criticals and
                the header pins the window it is defensible in rather than claiming agreement with
                data nobody has checked. And the throughput is an ORIFICE equation, so it is an
                upper bound on what a valve passes and not a prediction of it, because a real valve
                throttles on its stem long before the port is fully open. That is
                {' '}{fmt(cm.refusals.length, 0)} refusals, all of them in the module own headers.
                The divergences are worth as much. On a production operated string the closing test
                is a category error: it converts a dome balancing against the TUBING into a CASING
                surface pressure, so on the casing every valve clears by between
                {' '}{fmt(cm.ppo.casingClearsFromPsi, 4)} and {fmt(cm.ppo.casingClearsToPsi, 4)} psi
                while on the tubing every valve MISSES by between
                {' '}{fmt(cm.ppo.tubingMissesFromPsi, 4)} and {fmt(cm.ppo.tubingMissesToPsi, 4)} psi,
                and the same swapped line returns a negative spread on all
                {' '}{fmt(cm.ppo.spreads.length, 0)} of them. A spread is a pressure fall, so a
                negative one is not a valve property, it is the two sides entered the wrong way
                round. It is pinned rather than fixed, because the engine is consumed by a live
                application. The target depth mandrel is EXEMPT from the minimum spacing rule, which
                on {cm.exemption.exemptId} lets a last increment of
                {' '}{fmt(cm.exemption.exemptLastIncrementFt, 4)} ft through a
                {' '}{fmt(cm.exemption.exemptMinSpacingFt, 0)} ft floor, while
                {' '}{cm.exemption.checkedId} stops on the branch that does check and lands
                {' '}{fmt(cm.exemption.checkedShortOfFloorFt, 4)} ft short of its target. The
                unloading verdict is now checked on two independent roads across
                {' '}{fmt(cm.validation.stageRows, 0)} stage rows and
                {' '}{fmt(cm.validation.marginRows, 0)} margin rows on
                {' '}{fmt(cm.validation.publishedCases, 0)} published cases, and it did not used to
                be: the first oracle appended an empty open valve list at every stage without ever
                evaluating the condition, which is coverage that is not coverage. And the column
                march itself is essentially exact, which is the honest negative result this course
                refuses to leave out: at a packer, {fmt(cm.packerHeadline.at20StepsPsia, 6)} psia at
                20 steps against {fmt(cm.packerHeadline.at2000StepsPsia, 6)} at 2000 is a spread of
                {' '}{tiny(cm.packerHeadline.spreadPsi)} psi on a lift of
                {' '}{fmt(cm.packerHeadline.liftPsi, 4)} psi. None of this is a gas lift design. It
                is the arithmetic under one, and the judgement stays with the engineer who signs it.
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

export default GasLiftLearningPage;
