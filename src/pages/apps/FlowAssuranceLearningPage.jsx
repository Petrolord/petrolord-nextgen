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
  Loader2, Thermometer, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import ThermalExplorer from '@/components/course/panels/flowassurance/ThermalExplorer';
import LineExplorer from '@/components/course/panels/flowassurance/LineExplorer';
import HydrateExplorer from '@/components/course/panels/flowassurance/HydrateExplorer';
import {
  AKASO, MAX_PRACTICAL_WT_PCT, HAMMERSCHMIDT_RELIABLE_WT_PCT,
  publishedBuildSummary, publishedBuildRatios, publishedUPairRows, foamShareRows,
  publishedMasses, massAgainstHeatCapacity, publishedFoamMass, nanMassDrop,
  droppedTrench, refusalAsymmetry, mixedReferenceHeadline, referenceInvariant,
  goldenProfileRows, publishedCooldown, stagnantBoreCooldown,
  akasoDefinition, akasoHeatLossOnly, akasoCooldownPair, akasoBackwardsCooldown,
  akasoJouleThomson, akasoBelowSeabed, akasoRequirement, akasoNielsenSizedDose,
  akasoMoleFractionSeam, ceilingCoordinates, akasoLeanBlend, missingSubcoolingFallsOpen,
  hammerschmidtConstants, reliableLineReading, refusals,
} from '@/components/course/panels/flowassurance/flowAssuranceLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'flowassurance';
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
  { n: 1, title: 'The hydrate boundary is an INPUT, and both engine headers say so',
    body: 'This course is about arriving at the other end above a line the engine never draws. Hydrate and wax boundaries are fluid properties out of a laboratory or a compositional flash, and both modules say in as many words that the consumer supplies them. Every margin, every subcooling and every verdict in the whole course is conditional on a number somebody else measured, and the Associate tier establishes that before anything is computed.' },
  { n: 2, title: 'Insulation and burial are resistances in series and nothing more complicated',
    body: 'The stack adds, the biggest term dominates and the shares are readable straight off the engine return. That is genuinely the whole Associate tier, and it is worth saying plainly: not every module in this programme hides something. Two inches of foam is worth more than seventy times the bare coefficient on the published pipe, and four feet of wet soil on top of it is worth less than a factor of two, because once one term dominates the next one added has little left to do.' },
  { n: 3, title: 'A share is a property of a BUILD, not a number to memorise',
    body: 'The same two inches of the same foam has one resistance in every build it appears in and four different shares, spread over forty six percentage points, because everything around it moved. A lesson that quotes a share without its build has said nothing, and the same is true of a coefficient quoted without the diameter it is referred to.' },
  { n: 4, title: 'A U is a resistance divided by an AREA, so it means nothing until the area is named',
    body: 'The same physical line, the same layers, the same trench and the same total resistance to the last figure, gives two different coefficients under two different reference diameters. The engine reports which one it used. Then the three functions that consume a coefficient each take a bare diameter and none of them can see it, so keeping the pair together is the caller job and nothing complains when the caller does not.' },
  { n: 5, title: 'The number of transfer units is the whole story of a steady line',
    body: 'The length measured in relaxation lengths is the only thing the arrival depends on once the inlet and the ambient are fixed. A line much shorter than its relaxation length arrives hot whatever the ambient, a line much longer than it arrives at ambient whatever it started at, and past four transfer units there is nothing left to insulate for. Refining the station count buys resolution in the middle of the line and moves the arrival by exactly zero.' },
  { n: 6, title: 'Mass is not heat capacity, and the same pipe answers the two in opposite orders',
    body: 'On the published liquid filled case the steel outweighs the contents and carries far less of the heat, because a heat capacity of 0.11 meets one of 0.50. On a gas line it reverses again. The cooldown header warns about the steel and its own published case shows the ranking the other way round, which is the sort of thing a reader only finds by computing both.' },
  { n: 7, title: 'A cooldown has two mass slots and the coefficient has an unbounded layer list',
    body: 'On the teaching line the insulation and the weight coat carry two thirds of the resistance and, as the signature reads, none of the mass. Fold them into the shell slot by hand and the no touch time more than triples. There is no slot for a coating, no helper to lump one and no warning anywhere when the layers outnumber the slots.' },
  { n: 8, title: 'A ground resistance that cannot be computed is DROPPED, not refused',
    body: 'A trench shallower than half the coated diameter has no real shape factor, and the guard removes the term before the refusal that would have caught it. A buried line comes back as an exposed line with ok true and no note, and the returned coefficient is most of a factor too high. The same file states the opposite discipline on its conductivity helper in as many words.' },
  { n: 9, title: 'The Joule-Thomson term is applied UNDAMPED, and the hydrate verdict turns on it',
    body: 'A linear pressure profile implies a constant cooling sink per foot, and a constant sink inside an exponentially relaxing line integrates to a saturating offset rather than a linear one. The engine lays the whole term down at the outlet, so it over-applies the cooling by a factor near two on a line of ordinary length, and on the teaching line that moves an arrival from comfortably outside the hydrate boundary to comfortably inside it.' },
  { n: 10, title: 'And two functions in one file take opposite positions on one temperature',
    body: 'Push the same line longer and the returned arrival falls below the seabed it is losing heat to. Hand that temperature to the inverse in the same file as a target and it is refused as unreachable. Both functions are self consistent: the inverse carries no Joule-Thomson term at all, so it is answering a different question, and neither of them knows the other was asked.' },
  { n: 11, title: 'A dose sized with one relation and checked with another, and never compared',
    body: 'The concentration comes from inverting Hammerschmidt, the check is then run on that concentration, the check decides it is past the reliability line and reports Nielsen-Bucklin, and nothing reads the check back. The call returns ok true at a dose whose own check, in an adjacent field of the same object, falls short of the subcooling it was handed and short of the bare subcooling before any margin at all.' },
  { n: 12, title: 'For a glycol there is no check at all, and the suppressed number is the one it already had',
    body: 'The Hammerschmidt inverse fixes the inhibitor to water mole ratio and that ratio contains no molecular weight, so all four fluids sized for one depression land on one mole fraction and therefore on one Nielsen-Bucklin answer. The check the module declines to run on a glycol is the check it already ran on methanol, to the last figure. Suppressing it removes a check and changes no answer.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Flow Assurance: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Flow Assurance course and activate your account to open this app in Learning
        Mode. A subsea flowline is a race between the heat the fluid carries and the heat the sea
        takes away, and flow assurance is the business of arriving at the other end still above a
        temperature somebody else measured in a laboratory.
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

const FlowAssuranceLearningPage = () => {
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
  // a published golden or off the one TEACHING LINE this course built for
  // itself, AKASO SPUR, and never off the graded line.
  const cm = useMemo(() => ({
    insulated: publishedBuildSummary('insulated'),
    buried: publishedBuildSummary('buried4ft'),
    ratios: publishedBuildRatios(),
    pairs: publishedUPairRows(),
    foamShares: foamShareRows(),
    masses: publishedMasses(),
    reversal: massAgainstHeatCapacity(),
    foamMass: publishedFoamMass(),
    nanMass: nanMassDrop(),
    trench: droppedTrench(),
    asymmetry: refusalAsymmetry(),
    reference: referenceInvariant(),
    mixed: mixedReferenceHeadline(),
    profiles: goldenProfileRows(),
    cooldown: publishedCooldown(),
    stagnant: stagnantBoreCooldown(),
    akaso: akasoDefinition(),
    heat: akasoHeatLossOnly(),
    akasoCooldown: akasoCooldownPair(),
    backwards: akasoBackwardsCooldown(),
    jt: akasoJouleThomson(),
    below: akasoBelowSeabed(),
    meoh: akasoRequirement('methanol'),
    meg: akasoRequirement('meg'),
    nielsen: akasoNielsenSizedDose('methanol'),
    seam: akasoMoleFractionSeam(),
    ceiling: ceilingCoordinates('methanol'),
    leans: akasoLeanBlend(),
    missing: missingSubcoolingFallsOpen(),
    constants: hammerschmidtConstants(),
    reliable: reliableLineReading('methanol'),
    refusals: refusals(),
  }), []);

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
      <Helmet><title>Flow Assurance (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Thermometer className="h-7 w-7 text-[#BFFF00]" /> Flow Assurance
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              A subsea flowline is a race between the heat the fluid carries and the heat the sea
              takes away, and this course asks three questions in order. How fast does the line
              lose heat? That is a stack of resistances in series, and on the published pipe two
              inches of foam takes the overall coefficient from
              {' '}{fmt(cm.ratios.bareUBtuHrFt2F, 4)} to
              {' '}{fmt(cm.ratios.insulatedUBtuHrFt2F, 6)} Btu/(hr ft2 degF), a factor of
              {' '}{fmt(cm.ratios.bareOverInsulated, 4)}. Where does the fluid end up? That is one
              exponential and one number, the length measured in relaxation lengths, and on the
              teaching line {cm.akaso.name} a relaxation length of
              {' '}{fmt(cm.heat.relaxationLengthFt, 2)} ft over
              {' '}{fmt(cm.akaso.lengthFt, 0)} ft gives
              {' '}{fmt(cm.heat.ntu, 6)} transfer units and an arrival of
              {' '}{fmt(cm.heat.arrivalTempF, 4)} degF. And is that warm enough? Only against a
              hydrate temperature a laboratory measured, which neither engine computes and both
              headers say so. Every number on this page is a return value from the vendored
              production engines.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From one pipe cross section to a line in operation, a shutdown clock and a chemical
                dose, on the vendored flowline thermal and hydrate inhibition engines and their own
                published goldens. Every figure on this page and inside every panel is a return
                value from those engines, pinned by test files that assert the ARGUMENTS as well as
                the arithmetic, so an engine change cannot quietly invert a lesson and still pass.
                Four findings are worth the price of the course. The Joule-Thomson term is applied
                UNDAMPED: on {cm.akaso.name} the correct damping is
                {' '}{fmt(cm.jt.dampingFactor, 6)}, the engine lays down
                {' '}{fmt(cm.jt.engineJtDropF, 4)} degF of cooling where the balance asks for
                {' '}{fmt(cm.jt.dampedJtDropF, 4)}, and the arrival moves from
                {' '}{fmt(cm.jt.dampedJtArrivalTempF, 4)} degF, which is
                {' '}{fmt(cm.jt.dampedJtMarginF, 4)} degF OUTSIDE the laboratory hydrate boundary,
                to {fmt(cm.jt.engineJtArrivalTempF, 4)} degF, which is
                {' '}{fmt(Math.abs(cm.jt.engineJtMarginF), 4)} degF INSIDE it. The verdict flips on
                a factor that is not applied. The inhibitor is sized one way and checked another:
                the same call returns ok {cm.meoh.ok ? 'true' : 'false'} at
                {' '}{fmt(cm.meoh.designWtPct, 4)} weight percent methanol, whose own
                Nielsen-Bucklin check in an adjacent field of the same object delivers
                {' '}{fmt(cm.meoh.deliveredDepressionF, 4)} degF against the
                {' '}{fmt(cm.meoh.neededDepressionF, 1)} degF it was handed, a shortfall of
                {' '}{fmt(cm.meoh.shortfallF, 4)} degF and
                {' '}{fmt(cm.meoh.shortfallAgainstBareSubcoolingF, 4)} degF short of the bare
                subcooling before any margin at all. A trench that cannot be resolved is DROPPED
                rather than refused: entered as {fmt(cm.trench.typoBurialFt, 1)} ft instead of
                {' '}{fmt(cm.trench.intendedBurialFt, 1)} ft the same stack returns
                {' '}{fmt(cm.trench.droppedTermCount, 0)} terms instead of
                {' '}{fmt(cm.trench.withTermCount, 0)} and a coefficient
                {' '}{fmt(cm.trench.uErrorPct, 4)} percent too high, with ok true and no note, and
                the returned answer is bit for bit the answer for a line with no trench at all. And
                the cooldown carries a mass that leaves out most of the line: on {cm.akaso.name}
                {' '}the insulation and the weight coat carry
                {' '}{fmt(cm.akasoCooldown.resistanceShareLeftOutPct, 4)} percent of the resistance
                and, as the signature reads, none of the mass, which is the difference between a no
                touch time of {fmt(cm.akasoCooldown.apiNoTouchHours, 4)} hr and one of
                {' '}{fmt(cm.akasoCooldown.lumpedNoTouchHours, 4)} hr.
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
          <ThermalExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <LineExplorer />}
          {tier === 'advanced' && <HydrateExplorer />}

          {/* What the engines refuse to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these engines do not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer, and these two modules are
                blunt about most of theirs. THE LARGEST LIMIT IS THE ONE THE WHOLE COURSE RESTS ON:
                neither engine computes a hydrate boundary. Both headers say it is a fluid property
                out of a laboratory or a compositional flash and that the consumer supplies it, so
                every subcooling and every margin here is conditional on a measurement nobody in
                these modules has seen. There is no wax boundary and no deposition model either.
                Every conductivity is an INPUT and the catalogue is a set of defaults offered rather
                than product data, which is why an unknown identifier is a not-a-number and never a
                fallback: an earlier version returned carbon steel for an unknown insulation
                identifier and made a line look two thousand times better insulated than it is. The
                burial term is the classical shape factor for an isothermal cylinder in a semi
                infinite medium, so one uniform soil conductivity everywhere, a flat surface at
                ambient, no groundwater movement, no seasonal front, and a burial measured to the
                CENTRELINE. The cooldown is lumped capacitance with one temperature for the whole
                cross section. The steady state profile has no transient, no slugging, no holdup and
                no elevation change. Salt in the produced water inhibits too and is left out and
                said to be left out. The injection rate is a mass balance on the aqueous phase and
                nothing more, with no methanol lost to the gas or the condensate. That is
                {' '}{fmt(cm.refusals.length, 0)} stated limits, most of them in the modules own
                headers. The divergences are worth as much. A coefficient is meaningless without the
                area it is referred to, and the module says so and then hands the field to three
                consumers that cannot read it: the same buried build referred to the bore is
                {' '}{fmt(cm.reference.boreUBtuHrFt2F, 6)} and referred to the coated outside
                diameter is {fmt(cm.reference.coatedUBtuHrFt2F, 6)}, a ratio of exactly the two
                diameters, and passing the second with the first diameter is dimensionally
                consistent, raises no complaint anywhere and is wrong on the relaxation length by
                {' '}{fmt(cm.mixed.relaxationErrorPct, 4)} percent and on the arrival by up to
                {' '}{fmt(cm.mixed.worstArrivalErrorF, 4)} degF. A ground resistance that cannot be
                computed is caught and DROPPED while a layer that cannot be resolved is refused:
                two failures, one input class, opposite treatment, and the swallowed answer is
                identical to the no-trench answer to {tiny(cm.trench.droppedAgainstExposedRelDiff)}
                {' '}relative. A mass that cannot be computed becomes a mass of zero for the same
                reason, and one bad slot returns ok true with
                {' '}{fmt(cm.nanMass.contentsNaNHours, 4)} hr against the correct
                {' '}{fmt(cm.nanMass.bothGoodHours, 4)}, no note and no error, short by exactly the
                dropped slot share of the heat capacity. The cooldown never checks its start against
                its target, so the honest question on a line that packs up warmer than it stopped
                comes back with ok {cm.backwards.ok ? 'true' : 'false'} and
                {' '}{fmt(cm.backwards.hours, 4)} hr, a station table that runs backwards in time
                and warms by {fmt(cm.backwards.temperatureRiseAcrossTheTableF, 4)} degF, while the
                mirror of the same question put to the inverse in the same file is refused with a
                written reason. The practical concentration ceiling of
                {' '}{fmt(MAX_PRACTICAL_WT_PCT, 0)} weight percent is compared against a
                concentration measured in Hammerschmidt coordinates, and at that ceiling the two
                relations differ by {fmt(cm.ceiling.bandF, 4)} degF, so there is a band that wide in
                which the engine designs and the chemistry it checks against does not deliver. The
                reliability line at {fmt(HAMMERSCHMIDT_RELIABLE_WT_PCT, 0)} weight percent is not
                where the two relations begin to disagree: at the line itself they are already
                {' '}{fmt(cm.reliable.spreadF, 4)} degF apart and the return still says reliable
                {' '}{cm.reliable.reliable ? 'true' : 'false'}. A glycol gets no check at all, and
                the number that is suppressed is the one the module already computed for methanol,
                {' '}{fmt(cm.seam.megDeliveredF, 6)} degF, because both doses sit at the same mole
                fraction. The lean strength is a weight percent in the mass gross up and a volume
                percent one line later in the density blend, which is worth
                {' '}{fmt(cm.leans[0].rateLowByPctOfEngineRate, 4)} percent on this dose and more on
                a leaner stream. A subcooling nobody supplied takes the branch written for a fluid
                already outside the hydrate region and returns ok
                {' '}{cm.missing.ok ? 'true' : 'false'} with the words not a number in its note. And
                one constant has three values, {fmt(cm.constants.engineK, 4)} in the module,
                {' '}{fmt(cm.constants.goldenKFromMetric, 4)} through the oracle metric round trip
                and {fmt(cm.constants.diluteMatchK, 4)} where the module own two relations meet as
                the solution goes dilute, and the gate absorbs the gap by comparing one relation
                {' '}{fmt(cm.constants.gateToleranceRatio, 0)} times looser than its neighbour. None
                of this is a flow assurance study. It is the arithmetic under one, and the judgement
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

export default FlowAssuranceLearningPage;
