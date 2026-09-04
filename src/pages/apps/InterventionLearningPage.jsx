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
  Loader2, Wrench, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import DiagnosticExplorer from '@/components/course/panels/intervention/DiagnosticExplorer';
import ChannelExplorer from '@/components/course/panels/intervention/ChannelExplorer';
import CandidateExplorer from '@/components/course/panels/intervention/CandidateExplorer';
import {
  TEACHING_WELL_NAME,
  teachingHeadline, teachingFullFit, teachingDiagnosis, teachingTwoWindows,
  windowSweepRows, windowFlipHeadline, discardedFit, fallingOnlyDemo,
  waterSpellingRows, gasSpellingRows, gasHeadline, flatBranchRows,
  fluidBlindnessRows, zeroVarianceHeadline, constantDerivativeDemo,
  teachingGeometry, teachingAcidJob, skinGuardHeadline,
  fractureTernaryHeadline, lowLastSampleDemo, shortHistoryDemo,
  screeningHeadline, publishedVerdictRows, publishedFloor, powerLawFit,
  oracleCoverage, limits,
} from '@/components/course/panels/intervention/interventionLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'intervention';
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

const yn = (b) => (b ? 'yes' : 'no');

const LESSONS = [
  { n: 1, title: 'The diagnosis decides the treatment, and the two commonest water problems need OPPOSITE ones',
    body: 'Water channelling is a plumbing problem: it arrives behind pipe, through a thief zone, along a fracture, and a squeeze or a gel has somewhere to go and something to seal. Coning is not a plumbing problem. The water is coming through the same rock as the oil, pulled up by the drawdown, and there is nothing to squeeze: shut off the bottom perforations and the cone re-forms above them. A planner who recommends a shutoff without looking at the diagnostic is recommending money down a hole roughly half the time.' },
  { n: 2, title: 'The measurement underneath all of it is a least squares line in log space',
    body: 'Every statement this module makes about a mechanism is a statement about a slope on a log-log plot. The measurement returns a slope, an intercept, a fit quality, a point count and a span, and it is exact on a power law, which is the one thing the independent oracle checks. A log-log slope carries no unit at all. Fit quality is a fraction in the return and a percentage in the error strings, so say which you mean every time.' },
  { n: 3, title: 'A clean fit proves the arithmetic and says nothing about the well',
    body: 'The published power law returns a fit quality of exactly one and agrees with a Theil-Sen median of every pairwise slope to the last bit. That is evidence about the regression. It is not evidence that the samples that survived the filter are the ones that matter, that the shape is a power law at all, or that the picture the slope suggests is the picture the reservoir is in.' },
  { n: 4, title: 'Everything a stimulation is worth comes out of one group, and the drainage radius is a guess',
    body: 'The productivity index is inversely proportional to ln(re/rw) less three quarters plus the skin. The two inputs are not the same kind of thing: the radius ratio goes in under a logarithm, so a twentyfold error in the drainage radius moves the group by three, which three units of skin more than cover. The skin goes in undivided. That is also why removing a unit of skin from a heavily damaged well is worth several times what removing one from a clean well is worth.' },
  { n: 5, title: 'There is a floor, and it is where the arithmetic runs out rather than where the well stops improving',
    body: 'At a skin equal to minus the zero-skin group the denominator is zero and the productivity index is infinite. That is a broken equation, not an aggressive design. The engine refuses there, and its refusal message then advertises a completely different limit: real treatments reach about -3 to -5 on acid and -5 to -6 on a fracture. Everything between those and the pole is accepted in silence.' },
  { n: 6, title: 'The reading is made on a late window, and how much of the history counts as late is a free choice',
    body: 'Early data is dominated by cleanup and by whatever the well was doing before it settled, so the mechanisms only separate late. The dial that decides how much is late has a default, no guidance anywhere in the module, no sweep helper, and nothing in the return object naming its effect. It is also clamped rather than validated, so a value outside its range is silently replaced instead of refused.' },
  { n: 7, title: 'One classifier call returns TWO fits, measured on two different windows',
    body: 'The ratio slope is fitted over every late sample. The derivative slope is fitted over only the late samples whose derivative is positive. They come back side by side with nothing in the object saying they were measured on different data, and the field named for the span describes the second window while reading as though it described the whole reading. Only the second of the two decides anything.' },
  { n: 8, title: 'The samples the fit discards are the ones that argue the other way',
    body: 'The derivative fit keeps only the positive derivatives and the measurement then filters again on the same test, so a history whose ratio has turned back down is read entirely on the samples from before the turn. A rate cut followed by a falling water-oil ratio is the coning field test and the coning answer. The engine counts those samples two lines later and then discards the count, and the note it carries is unreachable on any history where three positive samples survive.' },
  { n: 9, title: 'A missing derivative column is read as a derivative of zero, and returns a reassuring verdict',
    body: 'The classifier requires the time and the ratio to be finite and never the derivative. A column exported as a null coerces to zero, passes the test for a flat derivative at every late sample, takes the flat branch and comes back saying nothing is changing and there is nothing here for an intervention to fix. Spell the same missing value the other way and the answer is the opposite. The reassuring spelling is the one every JSON export and every SQL null produces.' },
  { n: 10, title: 'The flat branch asserts something it never checked',
    body: 'That branch opens by saying the ratio is sitting flat. Nothing in the branch looks at the ratio: the condition is entirely about the derivative, and the same return object carries a ratio slope and a ratio fit quality that say the opposite. The one series anybody ever tested it against really was flat, which is exactly why nobody noticed.' },
  { n: 11, title: 'Every guard in the module sits where the arithmetic breaks, not where the answer stops being believable',
    body: 'The skin guard refuses at the pole and advertises a limit several units above it. The ratio gate is compared against the last sample alone, so one post shut-in test short-circuits the whole diagnosis. The zero-variance guard fires or does not depending on the sample count and the value together, so it fires on the tidy cases a test suite holds and stops firing on the real ones. And the fracture verdict tests the skin and then returns the same answer on both arms of the test.' },
  { n: 12, title: 'The only part of this module that returns a VERDICT is the part with no golden',
    body: 'The independent oracle checks the log-log slope by Theil-Sen and the skin uplift by a full radial Darcy rate in SI. It publishes four labelled histories and a late derivative slope for each, and it publishes no expected mechanism, no expected confidence, no expected verdict and no expected block reason. The classifier, the screening, the ranking and the inverse are asserted against nothing at all.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Well Intervention: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Well Intervention course and activate your account to open this app in
        Learning Mode. The diagnosis decides the treatment, and the two commonest water problems
        need opposite ones, so a screening that is not gated by the diagnosis is a screening that
        is wrong about half the time.
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

const InterventionLearningPage = () => {
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
  // a published golden, off the shipped engine re-run on published inputs, or
  // off the one TEACHING WELL this course built for itself, and never off the
  // graded well.
  const cm = useMemo(() => ({
    head: teachingHeadline(),
    fit: teachingFullFit(),
    d05: teachingDiagnosis(0.5),
    two: teachingTwoWindows(0.5),
    sweep: windowSweepRows(),
    flip: windowFlipHeadline(),
    discarded: discardedFit(0.5),
    falling: fallingOnlyDemo(),
    water: waterSpellingRows(),
    gas: gasSpellingRows(),
    gasHead: gasHeadline(),
    flat: flatBranchRows(),
    fluid: fluidBlindnessRows(),
    zero: zeroVarianceHeadline(),
    constant: constantDerivativeDemo(),
    geometry: teachingGeometry(),
    acid: teachingAcidJob(),
    skin: skinGuardHeadline(),
    ternary: fractureTernaryHeadline(),
    low: lowLastSampleDemo(),
    short: shortHistoryDemo(),
    screen05: screeningHeadline('water050'),
    screen09: screeningHeadline('water090'),
    published: publishedVerdictRows(),
    floor: publishedFloor(),
    power: powerLawFit(),
    oracle: oracleCoverage(),
    limits: limits(),
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
      <Helmet><title>Well Intervention (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Wrench className="h-7 w-7 text-[#BFFF00]" /> Well Intervention
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              The diagnosis decides the treatment, and the two commonest water problems need
              opposite treatments. This course asks three questions in order. What is actually
              measured? A least squares line in log space and one geometry group: on the published
              power law the engine reproduces an independent Theil-Sen slope to a difference of
              {' '}{tiny(cm.power.slopeDifference)} at a fit quality of
              {' '}{fmt(cm.power.engineR2Fraction, 6)}, and on the published geometry it reproduces
              the floor to {tiny(cm.floor.difference)}. What does the classifier do with it? On the
              teaching well {TEACHING_WELL_NAME} at the engine default it returns
              {' '}{cm.d05.mechanismLabel} at {cm.d05.confidence} confidence, on a derivative slope
              of {fmt(cm.d05.derivativeSlope, 6)} against a threshold of
              {' '}{fmt(cm.d05.channellingThreshold, 2)}, a margin of
              {' '}{fmt(cm.d05.marginToThreshold, 6)}. And can you believe it? Move the window dial,
              which changes not one datum, and the slope moves by {fmt(cm.flip.slopeRange, 6)},
              which is more than that margin, and the shutoff squeeze stops being a candidate
              somewhere between {fmt(cm.flip.flipFromFraction, 2)} and
              {' '}{fmt(cm.flip.flipToFraction, 2)}. Every number on this page is a return value
              from the vendored intervention diagnostics engine.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From one fitted line to a screening that spends money, on the vendored intervention
                diagnostics engine and its own published goldens. Every figure on this page and
                inside every panel is a return value from that engine, pinned by test files that
                assert the ARGUMENTS as well as the arithmetic, so an engine change cannot quietly
                invert a lesson and still pass. THE HEADLINE IS WORTH THE PRICE OF THE COURSE ON
                ITS OWN. One classifier call returns two fits measured on two different windows and
                says so nowhere: on the teaching well the ratio fit used
                {' '}{fmt(cm.two.ratioFitSamples, 0)} samples over
                {' '}{fmt(cm.two.ratioFitSpanDecades, 6)} log cycles and the derivative fit used
                {' '}{fmt(cm.two.derivativeFitSamples, 0)} over
                {' '}{fmt(cm.two.derivativeFitSpanDecades, 6)}, and the two slopes differ by
                {' '}{fmt(cm.two.slopeGap, 6)}. The
                {' '}{fmt(cm.discarded.samplesDroppedInsideTheWindow, 0)} samples that went missing
                between them are the ones whose ratio had turned back down, and fitted on their own
                they carry a slope of {fmt(cm.discarded.droppedRatioSlope, 6)} at a fit quality of
                {' '}{fmt(cm.discarded.droppedRatioR2Fraction, 6)}, which is CLEANER than the
                {' '}{fmt(cm.discarded.reportedDerivativeR2Fraction, 6)} behind the verdict the
                engine actually gave. A rate cut followed by a falling water-oil ratio is the
                coning field test. The engine reports {cm.discarded.reportedMechanismLabel}, which
                is the treatable one, and the screening returns a shutoff squeeze as a
                {' '}{cm.screen05.waterShutoffVerdict}. Blank the same history derivative column
                and the answer becomes {cm.water[0].mechanismLabel} at {cm.water[0].confidence}
                {' '}confidence with the note saying there is nothing here for an intervention to
                fix, beside a ratio slope of {fmt(cm.water[0].worSlope, 6)} in the same object.
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
          <DiagnosticExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <ChannelExplorer />}
          {tier === 'advanced' && <CandidateExplorer />}

          {/* What the engines refuse to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer, and this module is blunt
                about some of its own and silent about the rest. {cm.limits.join(' ')} That is
                {' '}{fmt(cm.limits.length, 0)} stated limits. The divergences are worth as much.
                THE ONLY PART OF THIS MODULE THAT RETURNS A VERDICT IS THE PART WITH NO GOLDEN: the
                oracle checks {cm.oracle.functionsWithAGolden.join(', ')} by two genuinely
                independent routes and asserts nothing whatever about
                {' '}{cm.oracle.functionsWithNoGoldenAtAll.join(', ')}. On the four published
                histories the classifier returns
                {' '}{cm.published.map((r) => `${r.name} as ${r.mechanismId} (${r.waterShutoffVerdict})`).join(', ')},
                and not one of those verdicts is asserted anywhere. THE WINDOW MOVES THE MONEY. Of
                the {fmt(cm.flip.settingsSwept, 0)} dial settings swept on the teaching well,
                {' '}{fmt(cm.flip.treatableSettings, 0)} recommend a squeeze and
                {' '}{fmt(cm.flip.blockedSettings, 0)} refuse one, on the same
                {' '}{fmt(cm.head.sampleCount, 0)} samples, and the module ships no sweep helper:
                {' '}{yn(cm.flip.theModuleShipsNoSweepHelper)}. THE MISSING COLUMN FAILS OPEN. The
                teaching gas history climbs by a factor of
                {' '}{fmt(cm.gasHead.foldChangeAcrossTheWindow, 6)} across
                {' '}{fmt(cm.gasHead.sampleCount, 0)} clean samples and the flat branch calls it
                flat, beside a ratio slope of {fmt(cm.gas[0].worSlope, 6)} in the same object, and
                the ratio gate that might have caught it is named for a water-oil ratio and cleared
                on a gas history by a factor of {tiny(cm.gasHead.theGateIsClearedByAFactorOf)}.
                Hand that gas verdict to the screening and the WATER shutoff comes back
                {' '}{cm.fluid.find((r) => r.source === 'gasNull').waterShutoffVerdict} with its
                reasons quoting the water cut, because nothing in a diagnosis says which fluid it
                read. THE GUARDS SIT AT THE SINGULARITY. The productivity multiplier refuses only
                at a skin of {fmt(cm.skin.minimumSkin, 6)} while its message advertises
                {' '}{fmt(cm.skin.fractureLimitTheTextAdvertises, 0)}, so
                {' '}{fmt(cm.skin.acceptedPastTheAdvertisedFractureLimit, 0)} of the settings tried
                are accepted in silence past everything that text calls real, the deepest of them
                returning {fmt(cm.skin.overreachMultiplier, 6)} times against
                {' '}{fmt(cm.skin.honestMultiplier, 6)} at a defensible design. The zero-variance
                guard fired on {fmt(cm.zero.guardFired, 0)} of {fmt(cm.zero.cellsSwept, 0)} cells
                and not on the rest, and on a history whose derivative is exactly constant it does
                not fire and clean data is refused as noise:
                {' '}{yn(cm.constant.cleanDataRefusedAsNoise)}. The fracture verdict takes
                {' '}{fmt(cm.ternary.distinctFractureVerdicts, 0)} distinct value across every skin
                tried. And one low final sample takes the whole reading from
                {' '}{cm.low.restored.mechanismLabel} at a derivative slope of
                {' '}{fmt(cm.low.restored.derivativeSlope, 6)} to {cm.low.spoiled.mechanismLabel}
                {' '}with no slope computed at all. None of this is an intervention study. It is
                the arithmetic under one, and the judgement stays with the engineer who signs it.
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

export default InterventionLearningPage;
