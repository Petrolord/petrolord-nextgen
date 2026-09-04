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
  Loader2, Activity, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import StringExplorer from '@/components/course/panels/rodpump/StringExplorer';
import CardExplorer from '@/components/course/panels/rodpump/CardExplorer';
import BalanceExplorer from '@/components/course/panels/rodpump/BalanceExplorer';
import {
  ODUMA, DEFAULT_CARD_SAMPLES, DEFAULT_NODES, DEFAULT_MAX_CYCLES,
  NODE_LADDER_QUICK, CONVERGENCE_CASE_IDS, ROUND_TRIP_HARMONICS, NOT_MODELLED,
  teachingStringRow, teachingFrequency, unitSummary, teachingPump,
  teachingSpringRule, teachingStaticStretch, teachingDesignSummary,
  teachingStressRows, samplingSummary, cardSamplesCost, envelopeSplit, ratingSplit,
  convergenceSpread, balanceSummary, balanceSensitivitySummary,
  ignoredInputRows, ignoredInputDifferences, mismatchedKin,
  roundTrip, fillageCliffPair, refusals,
} from '@/components/course/panels/rodpump/rodPumpLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'rodpump';
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
  { n: 1, title: 'A beam pump is a wave machine, and the seam runs through the middle of it',
    body: 'The string, the linkage and the pump are closed form and timeless: a compliance sum, Archimedes, a stepped bar eigenvalue, a four bar closure, a differential times an area, a volume per stroke. Nothing in that layer knows what time it is. Everything the card owns needs a march. That is not a curriculum convenience, it is where the domain actually divides, and the three tiers are cut along it.' },
  { n: 2, title: 'Compliances add and spring rates do not',
    body: 'A taper is sections in series, so the stretch per pound sums and the spring rate is the reciprocal of the sum. Adding the section spring rates instead is the error the arithmetic invites, and it does not merely differ in the last figure: it returns a stiffer string than the stiffest section, which is impossible.' },
  { n: 3, title: 'Buoyancy is a property of the fluid, not of the taper',
    body: 'The buoyed weight is the dry weight times one less the fluid density over steel, so every string hung in one fluid shares the same factor whatever its sections are. A design worked in water rather than in the produced fluid is wrong in the third figure on the weight and wrong in the same direction on every load that follows it.' },
  { n: 4, title: 'A stepped bar has a note, and stiffening its top can only raise it',
    body: 'The uniform fundamental comes from the acoustic velocity and the length. A taper multiplies it by a taper factor above one, always, because putting the heavy rod at the top raises the pitch. Two answers exist and only one belongs in a design, and reporting the uniform note on a tapered string understates the margin the pumping speed has.' },
  { n: 5, title: 'Twice the crank radius is the wrong stroke rule and it is not even a constant',
    body: 'The shorthand of twice the crank radius times the arm ratio is a small angle approximation nobody states. Close the four bar properly and the stroke is longer, because a pitman of finite length is not a rigid link of zero mass. The stroke is the beam sweep times the FRONT ARM, which scales it exactly, and the crank radius does not.' },
  { n: 6, title: 'The pump constant already contains pi over four',
    body: 'Displacement is the constant times the plunger diameter SQUARED, not times the area. Feeding it the area applies pi over four twice and understates every plunger by the same percentage, which is exactly why the mistake survives: a uniform error looks like a design basis rather than a bug.' },
  { n: 7, title: 'The static rule loses a tenth of the stroke, and the whole of the gap is overtravel',
    body: 'Every text opens with the plunger losing exactly the rod stretch. That rule is STATIC: it knows nothing about a string still moving when the polished rod turns round. The wave equation gives the plunger MORE stroke than the spring rule allows, and the difference is inertial overtravel. Both answers are graded in this course, in the same tier, deliberately.' },
  { n: 8, title: 'The loads reported are not the loads computed',
    body: 'The march accumulates a tension envelope over every step at every node, then DECIMATES the surface card and reads the peak and the minimum off that subsample. The peak comes back low and the minimum comes back high, and the minimum moves much further, because a minimum is where a coarse sample is least likely to land on the extreme.' },
  { n: 9, title: 'And the studio user cannot ask for the other pair',
    body: 'Raising the sample count alone recovers both loads: the march is bit for bit identical, only the stride changes. But the design routine exposes neither the sample count nor the node count, so what a studio user receives is the subsampled pair and no lever. That is why this tier is graded at the shipped defaults rather than at the best answer the engine can give.' },
  { n: 10, title: 'The loads are not converged either, and the plunger stroke is',
    body: 'Re-solve the same well on a finer grid and the plunger stroke settles to a small fraction of one percent while the loads move by hundreds of pounds. Any loading dip smaller than that grid spread is not a result. A speed sweep that appears to unload the rods at one speed is the engine failing to resolve a two point difference, and teaching the dip as physics would be teaching numerical noise.' },
  { n: 11, title: 'An input being accepted is not an input being used',
    body: 'The design routine destructures the kinematics, the structural unbalance and the crank offset, lists all three in its own documented inputs, and reads none of them. Proved by STRICT equality rather than by a tolerance, because the claim is that the value was never touched. Hand the same two numbers to the BALANCING routine and the peak torque moves by several percent. The test is which function you asked.' },
  { n: 12, title: 'A diagnostic re-reading its own card does not get the same answer back',
    body: 'Hand the surface half of a predicted card to the Gibbs harmonic solver and ask what the pump was doing. It shares no code path with the march that made the card, so the gap between what it returns and what the prediction assumed is the engine measured against itself rather than against a well. More harmonics is not the repair: past sixteen the difference settles into a band instead of shrinking.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Rod Pump Design: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Rod Pump Design course and activate your account to open this app in Learning
        Mode. A beam pump is a wave machine. The polished rod moves one stroke at the surface, the
        rod string carries it down as a travelling wave, and the plunger moves a different one, so
        almost every number a designer wants is a property of the card the wave makes rather than
        of the geometry that started it.
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

const RodPumpLearningPage = () => {
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

  // Every one of these is an engine call through the teaching lab, and several
  // of them are marches, so memoise the set rather than re-running it on each
  // render. Every number is a return value read off a published golden or off
  // the TEACHING WELL this course built for itself, ODUMA-4, and NEVER off the
  // graded well. The convergence ladder is deliberately the QUICK one: the full
  // ladder marches to 1920 nodes and belongs inside a panel a learner opened on
  // purpose, not in a page header.
  const rp = useMemo(() => {
    const stress = teachingStressRows();
    const design = teachingDesignSummary();
    const spring = teachingSpringRule();
    return {
      string: teachingStringRow(),
      freq: teachingFrequency(),
      unit: unitSummary(),
      pump: teachingPump(),
      spring,
      stretch: teachingStaticStretch(),
      design,
      stress,
      compression: stress.filter((s) => s.minLoadLb < 0),
      overtravelIn: design.plungerStrokeIn - spring.springRuleIn,
      overtravelPctOfSpringRule:
        ((design.plungerStrokeIn - spring.springRuleIn) / spring.springRuleIn) * 100,
      sampling: samplingSummary(),
      subsample: cardSamplesCost(ODUMA.label),
      envelope: envelopeSplit(),
      rating: ratingSplit(),
      convergence: convergenceSpread(CONVERGENCE_CASE_IDS[1], NODE_LADDER_QUICK),
      balance: balanceSummary(),
      sensitivity: balanceSensitivitySummary(),
      ignoredRows: ignoredInputRows(),
      ignoredDifferences: ignoredInputDifferences(),
      mismatched: mismatchedKin(),
      trip: roundTrip(),
      fillage: fillageCliffPair(),
      refusals: refusals(),
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
      <Helmet><title>Rod Pump Design (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Activity className="h-7 w-7 text-[#BFFF00]" /> Rod Pump Design
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              A beam pump is a WAVE MACHINE, and this course is cut along that one idea. The
              polished rod moves a stroke at the surface, the rod string carries it down as a
              travelling wave, and the plunger moves a DIFFERENT stroke. On the teaching well
              {' '}{ODUMA.label}, a {fmt(rp.string.lengthFt, 0)} ft three way taper in a
              {' '}{fmt(ODUMA.fluidSg, 2)} fluid, the linkage gives
              {' '}{fmt(rp.unit.strokeIn, 4)} in at the surface and the march gives
              {' '}{fmt(rp.design.plungerStrokeIn, 4)} in at the plunger. The Associate tier owns
              THE STRING AND THE GEOMETRY, the six things settled before anything moves: a spring
              rate of {fmt(rp.string.krLbPerIn, 4)} lb/in, a buoyed weight of
              {' '}{fmt(rp.string.weightFluidLb, 2)} lbf against {fmt(rp.string.weightAirLb, 2)} dry,
              a note of {fmt(rp.freq.nPrimeSpm, 4)} spm, that surface stroke, a fluid load of
              {' '}{fmt(rp.pump.fluidLoadLb, 2)} lbf and a rating of {fmt(rp.pump.ratedBpd, 2)} bbl/d.
              The Professional tier owns THE CARD, because the design IS the card. The Expert tier
              owns WHAT THE CARD HIDES. Every number on this page is a return value from the
              vendored rod pump engines, run on {ODUMA.label} or on the package own published
              goldens.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From four closed form objects to a card, a gearbox and a diagnostic, on the vendored
                rod string, pumping unit, rod dynamics and rod pump design modules and their own
                published goldens. Every figure here and inside every panel is a return value,
                pinned by test files that assert the ARGUMENTS as well as the arithmetic, so an
                engine change cannot quietly invert a lesson and still pass. Four findings are worth
                the price of the course. THE STATIC RULE AND THE WAVE EQUATION DISAGREE BY ABOUT A
                TENTH OF THE STROKE. On {ODUMA.label} the fluid load stretches the string
                {' '}{fmt(rp.spring.staticStretchIn, 4)} in, which is
                {' '}{fmt(rp.stretch.pctOfSurfaceStroke, 4)} percent of the surface stroke, so the
                spring rule predicts a plunger stroke of {fmt(rp.spring.springRuleIn, 4)} in. The
                march returns {fmt(rp.design.plungerStrokeIn, 4)} in, which is
                {' '}{fmt(rp.overtravelIn, 4)} in MORE, {fmt(rp.overtravelPctOfSpringRule, 4)} percent
                of the spring rule own answer, and every inch of that gap is inertial OVERTRAVEL.
                THE REPORTED LOADS ARE NOT THE LOADS COMPUTED. The march takes
                {' '}{fmt(rp.design.samples, 0)} steps in a cycle and then decimates the surface card
                to {fmt(rp.design.cardPoints, 0)} points, a stride of {fmt(rp.sampling.stride, 0)}
                {' '}that keeps {fmt(rp.sampling.keptPct, 3)} percent of them, and reads the peak and
                the minimum off THAT subsample: the peak comes back
                {' '}{fmt(rp.subsample.peakLowByLb, 2)} lb low and the minimum
                {' '}{fmt(rp.subsample.minHighByLb, 2)} lb HIGH, which is
                {' '}{fmt(rp.subsample.reportedOverMarchedMin, 4)} times the load the march actually
                computed, while the plunger stroke moves by
                {' '}{tiny(rp.subsample.plungerStrokeDiffIn)} in because the march itself is bit for
                bit identical. THE LOADS ARE NOT CONVERGED EITHER, AND THE PLUNGER STROKE IS. Across
                the {fmt(NODE_LADDER_QUICK.length, 0)} node counts from
                {' '}{fmt(NODE_LADDER_QUICK[0], 0)} to
                {' '}{fmt(NODE_LADDER_QUICK[NODE_LADDER_QUICK.length - 1], 0)} the plunger stroke
                moves {fmt(rp.convergence.plungerStrokeSpreadIn, 6)} in,
                {' '}{fmt(rp.convergence.plungerStrokeSpreadPct, 4)} percent, while the peak load
                moves {fmt(rp.convergence.pprlSpreadLb, 2)} lb and the minimum
                {' '}{fmt(rp.convergence.mprlSpreadPct, 3)} percent, and the worst rod loading swings
                {' '}{fmt(rp.convergence.loadingSpreadPoints, 4)} percentage points. Any dip in a
                speed sweep smaller than that is not a result. AND A DIAGNOSTIC RE READING THE CARD
                ITS OWN MARCH PRODUCED DOES NOT GET THE SAME ANSWER BACK: at
                {' '}{fmt(rp.trip.harmonicsUsed, 0)} harmonics the Gibbs solver returns a plunger
                stroke {fmt(rp.trip.differenceIn, 4)} in from the march that made the card, and a
                peak pump load {fmt(rp.trip.pumpLoadMaxOvershootLb, 2)} lb above the fluid load the
                prediction was told to assume.
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
          <StringExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <CardExplorer />}
          {tier === 'advanced' && <BalanceExplorer />}

          {/* What the engine refuses to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer, and these four modules are
                blunt about theirs. There is no rod buckling and no sinker bar sizing, no tubing
                movement and no unanchored string, no fluid friction on the plunger and no valve
                slippage beyond the pump efficiency the caller types, no gas interference, no
                deviated hole side loading or rod on tubing wear, no gearbox, belt or motor losses,
                and no fatigue history to turn a Goodman percentage into a service life. That is
                {' '}{fmt(NOT_MODELLED.length, 0)} things the domain does not model at all, and
                {' '}{fmt(rp.refusals.length, 0)} more it refuses outright rather than guessing at,
                including a rod size it cannot read as a diameter, a linkage that does not close at
                every crank angle, a plunger with no differential to lift against, a march with no
                damping and a speed at or above the string own fundamental. The divergences inside
                the scope are worth as much. THE ENVELOPE AND THE CARD DISAGREE ABOUT THE SAME LOAD.
                The march accumulates a tension envelope at every one of the
                {' '}{fmt(rp.design.envelopeNodes, 0)} nodes over every step, and its shallowest node
                sits {fmt(rp.envelope.shallowestNodeFt, 0)} ft down carrying
                {' '}{fmt(rp.envelope.envelopeMaxLb, 2)} lb; add the
                {' '}{fmt(rp.envelope.buoyedRodAboveLb, 2)} lb of buoyed rod above it and you get
                {' '}{fmt(rp.envelope.impliedPeakLb, 2)} lb against a REPORTED peak of
                {' '}{fmt(rp.envelope.reportedPeakLb, 2)} lb, a gap of
                {' '}{fmt(rp.envelope.disagreementLb, 2)} lb, or
                {' '}{fmt(rp.envelope.disagreementPct, 4)} percent, between two numbers the same
                march produced. WHICH ROUTE YOU READ CAN CHANGE THE VERDICT. Rated against
                {' '}{rp.rating.designation}, the same design is at
                {' '}{fmt(rp.rating.structuralPctFromReported, 4)} percent of structural capacity on
                the reported peak and {fmt(rp.rating.structuralPctFromMarched, 4)} percent on the
                marched one, and the structural overload warning is raised
                {' '}{rp.rating.structuralOverloadRaised ? 'yes' : 'NOT AT ALL'}. THREE INPUTS ARE
                ACCEPTED AND NEVER READ. The design routine destructures the kinematics, the
                structural unbalance and the crank offset, lists all three in its own documented
                inputs, and references none of them: run it with them at zero and again with them
                set, and {fmt(rp.ignoredRows.length, 0)} reported quantities come back with
                {' '}{fmt(rp.ignoredDifferences, 0)} differences, by STRICT equality rather than by a
                tolerance. Hand it a completely different unit kinematics, a
                {' '}{fmt(rp.mismatched.otherStrokeIn, 0)} in stroke against the
                {' '}{fmt(rp.mismatched.surfaceStrokeIn, 4)} in this design runs, and the plunger
                stroke is {rp.mismatched.identicalToRunA ? 'IDENTICAL' : 'different'} with warnings
                of {rp.mismatched.warnings}. Give the SAME two numbers to the balancing routine and
                the peak torque moves {fmt(rp.sensitivity.peakTorqueDiffInLb, 2)} in-lb,
                {' '}{fmt(rp.sensitivity.peakTorqueDiffPct, 4)} percent, on a counterbalance moment of
                {' '}{fmt(rp.balance.momentInLb, 2)} in-lb and a peak of
                {' '}{fmt(rp.balance.peakTorqueInLb, 2)}. An input being accepted is not an input
                being used, and the test is which function you asked. THE COUNTERBALANCE EFFECT IS
                NOT THE MOMENT OVER AN ARM: dividing by the {fmt(rp.unit.geometry.aIn, 4)} in front
                arm gives {fmt(rp.balance.momentOverFrontArmLb, 2)} lb where the torque factor a
                quarter turn past the bottom, {fmt(rp.balance.quarterTurnTorqueFactorIn, 4)} in,
                gives {fmt(rp.balance.counterbalanceEffectLb, 2)} lb, so the arm understates it by a
                factor of {fmt(rp.balance.frontArmUnderstatesBy, 4)}. THE FILLAGE WARNING IS A
                CLIFF, not a gradient: at a fillage of {fmt(rp.fillage.silentFillage, 4)} the design
                warns {rp.fillage.silentWarns ? 'yes' : 'NOT AT ALL'} and at
                {' '}{fmt(rp.fillage.warnedFillage, 4)} it {rp.fillage.warnedWarns ? 'does' : 'does not'},
                and the two are {fmt(rp.fillage.apartBpd, 6)} bbl/d apart. A learner who reads the
                warning list rather than the number concludes the pump is full. AND A SECTION CAN GO
                INTO COMPRESSION WITHOUT BEING THE ONE THE DESIGN NAMES: the worst loading here is
                the {rp.string.sections[0].label} section at
                {' '}{fmt(rp.design.worstSectionLoadingPct, 4)} percent of its modified Goodman
                allowable, while {fmt(rp.compression.length, 0)} of the
                {' '}{fmt(rp.stress.length, 0)} sections carries a NEGATIVE minimum load, down to
                {' '}{fmt(rp.compression.length ? rp.compression[0].minStressPsi : 0, 2)} psi. None of
                this is a rod pump design. It is the arithmetic under one, at the shipped defaults
                of {fmt(DEFAULT_NODES, 0)} nodes, {fmt(DEFAULT_CARD_SAMPLES, 0)} card samples and
                {' '}{fmt(DEFAULT_MAX_CYCLES, 0)} cycles, with the round trip run at
                {' '}{fmt(ROUND_TRIP_HARMONICS, 0)} of a possible
                {' '}{fmt(rp.trip.harmonicsCap, 0)} harmonics, and the judgement stays with the
                engineer who signs it. Even the service factor that decides whether a string is
                legal is not a rod property: it is the operator own judgement about the fluid,
                wearing a decimal point.
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

export default RodPumpLearningPage;
