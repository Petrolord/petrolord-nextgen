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
  Loader2, Droplets, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import DropletExplorer from '@/components/course/panels/gaswell/DropletExplorer';
import ProfileExplorer from '@/components/course/panels/gaswell/ProfileExplorer';
import RemedyExplorer from '@/components/course/panels/gaswell/RemedyExplorer';
import {
  EBOCHA, OGUTA, COLEMAN_PRESSURE_LIMIT_PSIA, TURNER_OVER_COLEMAN,
  PSI_PER_FT_SG, EXACT_PSI_PER_FT_SG, RULE_OF_THUMB_SCF_PER_BBL_PER_1000FT,
  ebochaDefinition, ebochaWellheadRecommendation, ebochaProfileRows, ebochaProfileSummary,
  ebochaWellheadOnlyProfile, ebochaSeamVerdicts, ebochaStationRecommendationRows,
  ebochaSizingComparison, ebochaStationCost, ebochaHopelessSizing, publishedSeam,
  gradientConstant, ogutaDefinition, ogutaScreenReading, ogutaCasingSweepHeadline,
  ogutaCapacity, ogutaZeroClampReading, ogutaUpperClamp, airSeam, refusals,
} from '@/components/course/panels/gaswell/gasWellLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'gaswell';
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
  { n: 1, title: 'A gas well carries its liquid on velocity, and velocity is not rate',
    body: 'The droplet balance sets a terminal velocity from the interfacial tension and the density difference, and nothing in it knows about a tubing size or a standard cubic foot. The rate that follows carries the flow area and the standard conditions on top. Two wells at the same critical VELOCITY have completely different critical RATES, and a report that quotes one as though it were the other has said nothing.' },
  { n: 2, title: 'The heavier liquid makes the FASTER droplet',
    body: 'Intuition says the heavy drop is the hard one to lift, and the balance says the opposite: the terminal velocity rises with the density DIFFERENCE, and brine beats condensate on that difference by more than its higher surface tension gives back. Everything else in the balance cancels between two liquids at one station, so the ratio of the two velocities is a fourth root and nothing else.' },
  { n: 3, title: 'The compressibility factor is not a constant and is in the denominator twice',
    body: 'The published fixture hands the droplet algebra a flat 0.9 at every pressure, which is fine for an oracle checking one equation and wrong for a well whose pressure doubles down the string. Take z from the package own natural gas correlation and it moves the gas density and the actual velocity together, because both divide by it.' },
  { n: 4, title: 'Two molecular weights of air, in one domain, against one gas constant',
    body: 'The loading module carries 28.9647 and the gas properties module carries 28.9625, so one gas density computed two ways differs by about seventy six parts per million. The two also speak different temperatures, one degrees Rankine and one degrees Fahrenheit, which is why the convention is to convert at the DOOR with the module own converter and never with a hand typed 459.67 somewhere in the middle.' },
  { n: 5, title: 'A well can pass at the gauge and load at the shoe',
    body: 'One station is a reading and a string is a design. The teaching well clears at the wellhead and fails at the bottom, and the crossing sits somewhere over the deepest third of the hole, which is exactly the part of it an operator cannot see. That is why a profile exists rather than a second point check.' },
  { n: 6, title: 'The controlling station is the worst MARGIN, not the worst pressure',
    body: 'The critical rate RISES with depth because the gas is denser down there, and the actual velocity FALLS with depth because the same standard rate occupies less volume at higher pressure. Those two run in opposite directions, which is what closes the margin downward and puts the controlling station at the shoe.' },
  { n: 7, title: 'A correlation is chosen ONCE, at the wellhead, and then used everywhere',
    body: 'The recommendation function takes one pressure and switches on it, and it cannot see which station that pressure came from. Ask the same function at every station of the teaching traverse and it does not give the same answer, and the whole difference between the two correlations is one factor of 1.2 applied to every critical rate the study goes on to compute.' },
  { n: 8, title: 'A sizing returns one answer and silently discards the rest',
    body: 'The pick is the largest bore whose ratio clears one, so it is a function of a correlation choice made somewhere else and of a station the returned object never records. A candidate that clears in its second decimal and one that clears twice over are the same field, and only the rejected rows say which one you have.' },
  { n: 9, title: 'A plunger screen can be blessed by the rule of thumb and refused by the physics',
    body: 'The 400 scf per barrel per thousand feet heuristic and the force balance are two different questions, and on a real well they disagree. The engine surfaces the disagreement through a flag rather than resolving it, and a report that quotes only the half that passes has hidden the answer.' },
  { n: 10, title: 'A rounded constant survives whole into a verdict when nothing cancels',
    body: 'The slug hydrostatic carries the platform rounded 0.433 psi per foot per unit specific gravity where the exact rho g is 0.4335275. It is one of five lift terms, and it is compared against a casing pressure built from nothing at all, so the rounding does not cancel anywhere. It is a fixed PERCENTAGE of whatever slug it sits on.' },
  { n: 11, title: 'A screen that gets easier to pass as the well dies is a fails-open',
    body: 'The gas a cycle needs is an expansion from the casing pressure down to the pressure still wanted at the top of the rise, averaged over the two ends with no check that the expansion runs the right way. Take the casing down through the requirement and the number keeps falling, and the gas flag flips to TRUE on a well whose casing cannot move the plunger at all.' },
  { n: 12, title: 'And nothing in the screen ever asks whether the cycle can carry the well',
    body: 'The barrels a day a cycle delivers is computed, returned, and never compared to anything. The composite verdict is the pressure test and the gas test, and the third comparison is arithmetic the screen already holds every ingredient for. A clamp has the same shape: the longest liftable slug comes back as zero on a well that cannot lift a bare plunger, which is a refusal wearing a number.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Gas Well Performance: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Gas Well Performance course and activate your account to open this app in
        Learning Mode. Every gas well makes some liquid, and every gas well eventually stops
        carrying it. This course is about the moment that starts: the droplet the gas can no longer
        lift, where down the string it happens first, and what a smaller tubing string or a plunger
        does about it.
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

const GasWellLearningPage = () => {
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
  // a published golden or off one of the two TEACHING WELLS this course built
  // for itself, EBOCHA-5 and OGUTA-2, and never off the graded well.
  const cm = useMemo(() => {
    const rows = ebochaProfileRows();
    const summary = ebochaProfileSummary();
    const perStation = ebochaStationRecommendationRows();
    return {
      definition: ebochaDefinition(),
      rows,
      summary,
      wellhead: rows[0],
      shoe: rows[rows.length - 1],
      recommendation: ebochaWellheadRecommendation(),
      wellheadOnly: ebochaWellheadOnlyProfile(),
      perStation,
      disagreeing: perStation.filter((r) => !r.matchesWellheadChoice),
      seam: ebochaSeamVerdicts(),
      sizing: ebochaSizingComparison(),
      stationCost: ebochaStationCost(),
      hopeless: ebochaHopelessSizing(),
      publishedSeam: publishedSeam(),
      gradient: gradientConstant(),
      plungerWell: ogutaDefinition(),
      screen: ogutaScreenReading(),
      casing: ogutaCasingSweepHeadline(),
      capacity: ogutaCapacity(),
      clampZero: ogutaZeroClampReading()[0],
      clampTop: ogutaUpperClamp(),
      air: airSeam(),
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
      <Helmet><title>Gas Well Performance (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Droplets className="h-7 w-7 text-[#BFFF00]" /> Gas Well Performance
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              This is the deliquification course, and it asks three questions in order. Can the gas
              carry the drop? At one station that is a terminal velocity, a critical rate and a
              ratio, and on {EBOCHA.name} at the wellhead the ratio is
              {' '}{fmt(cm.summary.wellheadRatio, 4)}, which reads as a healthy well. WHERE does it
              stop carrying it? Not where the gauge is: the same well at the shoe runs
              {' '}{fmt(cm.summary.shoeRatio, 4)}, a margin of
              {' '}{fmt(cm.summary.marginPct, 4)} percent, and the crossing sits between
              {' '}{fmt(cm.summary.deepestHealthyDepthFt, 0)} ft and
              {' '}{fmt(cm.summary.shallowestLoadingDepthFt, 0)} ft, over the deepest
              {' '}{fmt(cm.summary.insideDeepestPct, 0)} percent of the string. And what do you do
              about it? Size a velocity string at the station that CONTROLS, which on this well
              buys a {fmt(cm.sizing.turnerPickIdIn, 3)} in bore, or screen a plunger, which on the
              second teaching well passes its pressure test by
              {' '}{fmt(cm.screen.casingExceedsByPsi, 2)} psi and fails its gas test by
              {' '}{fmt(cm.screen.requiredGlrScfBbl - cm.screen.wellGlrScfBbl, 1)} scf/bbl. Every
              number here is a return value from the vendored production engines.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From one droplet at one station to a traverse, a workover string and a plunger
                cycle, on the vendored gas well loading and plunger lift engines and their own
                published goldens. Every figure on this page and inside every panel is a return
                value from those engines, pinned by test files that assert the ARGUMENTS as well as
                the arithmetic, so an engine change cannot quietly invert a lesson and still pass.
                Four findings are worth the price of the course. A well passes at the gauge and
                loads at the shoe, because the critical rate rises down the hole from
                {' '}{fmt(cm.wellhead.criticalRateMscfd, 1)} to
                {' '}{fmt(cm.shoe.criticalRateMscfd, 1)} Mscf/d while the actual velocity falls from
                {' '}{fmt(cm.wellhead.actualVelocityFtS, 4)} to
                {' '}{fmt(cm.shoe.actualVelocityFtS, 4)} ft/s, and run on the WELLHEAD ALONE the
                same profile call names {fmt(cm.wellheadOnly.controllingDepthFt, 0)} ft the
                controlling station and returns a margin of
                {' '}{fmt(cm.wellheadOnly.marginPct, 4)} percent against the full traverse
                {' '}{fmt(cm.wellheadOnly.fullTraverseMarginPct, 4)} percent, with no field anywhere
                in the return saying the traverse was one station long. A
                correlation is chosen once, at
                {' '}{fmt(cm.definition.wellheadPsia, 0)} psia, against a threshold of
                {' '}{fmt(COLEMAN_PRESSURE_LIMIT_PSIA, 0)} psia, and then used at a controlling
                station of {fmt(cm.definition.shoePsia, 0)} psia: asked at each station in turn the
                same function answers differently at {fmt(cm.disagreeing.length, 0)} of the
                {' '}{fmt(cm.perStation.length, 0)}, and the two correlations reach opposite loading
                verdicts at {fmt(cm.seam.disagreeAtDepthsFt.length, 0)} of the
                {' '}{fmt(cm.perStation.length, 0)} depths. The sizing throws away the rows: the
                {' '}{fmt(cm.sizing.discardedIdIn, 3)} in candidate clears at
                {' '}{fmt(cm.sizing.discardedRatioUnderColeman, 4)} under one correlation and misses
                at {fmt(cm.sizing.discardedRatioUnderTurner, 4)} under the other, a loss of exactly
                {' '}{fmt(cm.sizing.discardedRatioLossPct, 4)} percent because the whole seam is one
                factor of {fmt(TURNER_OVER_COLEMAN, 2)}, and the same seam on published row
                {' '}{fmt(cm.publishedSeam.row, 0)} at {fmt(cm.publishedSeam.pPsia, 0)} psia is
                {' '}{fmt(cm.publishedSeam.colemanRateMscfd, 1)} Mscf/d against
                {' '}{fmt(cm.publishedSeam.turnerRateMscfd, 1)}, so a well making exactly the first
                is at {fmt(cm.publishedSeam.ratioUnderTurner, 4)} of the second. And the plunger
                screen is blessed by the
                heuristic and refused by the physics: the force balance asks
                {' '}{fmt(cm.screen.requiredGlrScfBbl, 1)} scf/bbl where the
                {' '}{fmt(RULE_OF_THUMB_SCF_PER_BBL_PER_1000FT, 0)} scf per barrel per thousand feet
                rule asks {fmt(cm.screen.ruleOfThumbGlrScfBbl, 0)}, a factor of
                {' '}{fmt(cm.screen.requirementOverRuleOfThumb, 4)}, and the engine reports that the
                two do not agree rather than picking one.
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
          <DropletExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <ProfileExplorer />}
          {tier === 'advanced' && <RemedyExplorer />}

          {/* What the engine refuses to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer, and these two modules are
                blunt about theirs. The droplet balance models ONE droplet at its terminal velocity,
                so there is no droplet population, no coalescence, no break-up in transit and no
                film flowing on the tubing wall, which is the other way a gas well carries liquid.
                Interfacial tension and liquid density are INPUTS, not functions of anything the
                modules know. The drag coefficient is a rigid sphere in the Newton regime and a real
                droplet deforms. There is no inflow performance anywhere: the gas rate is handed in,
                so a loading verdict is a verdict at a rate somebody supplied and not a prediction
                of what the well will do next. The flowing traverse is PASSED IN as stations with
                their own pressure, temperature, compressibility and diameter, because the profile
                does not solve multiphase flow and will not invent a gradient. The plunger force
                balance is STATIC: no friction unless it is handed in, no velocity, no gas slippage
                past the plunger and no fallback of the slug during the rise. That is
                {' '}{fmt(cm.refusals.length, 0)} refusals, all of them in the modules own headers.
                The divergences are worth as much. The recommendation function takes ONE pressure
                and returns guidance rather than a decision, and it cannot see which station the
                pressure came from: on {EBOCHA.name} it answers
                {' '}{cm.recommendation.correlation} at the gauge and something else at
                {' '}{fmt(cm.disagreeing.length, 0)} of the {fmt(cm.perStation.length, 0)} stations,
                while the shipped reading uses the gauge answer everywhere. The sizing has no
                opinion about which station its pressure came from either: run at the wellhead it
                picks {fmt(cm.stationCost.wellheadSizingPickIdIn, 3)} in against the
                {' '}{fmt(EBOCHA.idIn, 3)} in already in the hole, so it reports that no workover is
                needed on a well that is loading over its bottom
                {' '}{fmt(cm.stationCost.loadingOverBottomPct, 0)} percent. Its ok key says whether
                the question was ANSWERABLE and not whether the station was the right one, which is
                why a rate nothing on the list can carry comes back with a null pick under
                {' '}{cm.hopeless.ok ? 'ok true' : 'ok false'} and a best ratio on the whole list of
                {' '}{fmt(cm.hopeless.bestRatioOnTheList, 4)}. The slug hydrostatic carries the
                platform ROUNDED {fmt(PSI_PER_FT_SG, 3)} psi/ft per unit specific gravity where the
                exact rho g is {fmt(EXACT_PSI_PER_FT_SG, 7)}, which is
                {' '}{fmt(cm.gradient.roundingPctOfShipped, 4)} percent and worth
                {' '}{fmt(cm.gradient.costOnPublishedSlugPsi, 6)} psi on the published slug, and it
                is one of five lift terms compared against a casing pressure built from nothing at
                all, so nothing cancels. The gas a cycle needs does NOT check that the expansion
                runs the right way: on {OGUTA.name} it falls from
                {' '}{fmt(cm.casing.highRequiredGlrScfBbl, 1)} scf/bbl at
                {' '}{fmt(cm.casing.highCasingPsia, 0)} psia of casing to
                {' '}{fmt(cm.casing.lowRequiredGlrScfBbl, 1)} at
                {' '}{fmt(cm.casing.lowCasingPsia, 0)} psia, a drop of
                {' '}{fmt(cm.casing.dropPct, 2)} percent as the well gets WEAKER, and the gas flag
                flips to true at {fmt(cm.casing.firstFlippedRow?.casingPressurePsia, 0)} psia where
                the casing is already {tiny(Math.abs(cm.casing.firstFlippedRow?.casingMinusRequirementPsi))} psi
                short of the requirement. That is a recorded owner decision rather than a defect
                fixed here, because the composite verdict is still the pressure test AND the gas
                test and it catches both ends. The longest liftable slug CLAMPS rather than refuses
                at both ends: at {fmt(cm.clampTop.casingPressurePsia, 0)} psia it returns
                {' '}{fmt(cm.clampTop.returnedFt, 0)} ft, which is the depth exactly, and at
                {' '}{fmt(cm.clampZero.casingPressurePsia, 0)} psia it returns
                {' '}{fmt(cm.clampZero.returnedFt, 0)} ft on a well that is
                {' '}{fmt(cm.clampZero.shortByPsi, 2)} psi short of lifting a BARE plunger with no
                slug at all. And the screen never compares the barrels a day it computes to
                anything: on {OGUTA.name} a day of cycling delivers
                {' '}{fmt(cm.capacity.liquidPerDayBbl, 4)} bbl against the
                {' '}{fmt(cm.capacity.wellLiquidBpd, 4)} bbl the well makes, a factor of
                {' '}{fmt(cm.capacity.wellOverCycle, 4)}, and that comparison appears in the verdict
                exactly {cm.capacity.liquidComparisonAppearsInVerdict ? 'once' : 'never'}. The two
                modules also carry two molecular weights of air against one gas constant, which is
                {' '}{fmt(cm.air.mwGapPpm, 2)} parts per million on a density and
                {' '}{tiny(cm.air.velocityFraction * 100)} percent on a velocity, and two temperature
                conventions at the door. None of this is a deliquification study. It is the
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

export default GasWellLearningPage;
