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
import LedgerExplorer from '@/components/course/panels/surveillance/LedgerExplorer';
import ExceptionExplorer from '@/components/course/panels/surveillance/ExceptionExplorer';
import ReadingExplorer from '@/components/course/panels/surveillance/ReadingExplorer';
import {
  TEACHING_FIELD_NAME,
  teachingFieldHeadline, uptimeWellHeadline, teachingExceptionHeadline,
  monthlyPeriodHeadline, publishedSeamHeadline, teachingSeamHeadline,
  seamSweepHeadline, bGuardHeadline, decimateHeadline, minOilRateHeadline,
  ageGuardHeadline, maxTestAgeHeadline, teachingAllocationHeadline,
  quietWellHeadline, wallClockHeadline, stringRowHeadline, stringAccumulatorRows,
  kpiMembershipHeadline, uptimeMembershipRows, teachingLiftHandoff,
  ratePhaseHeadline, teachingDesignPass, severityLadderHeadline,
  publishedFieldSeriesHeadline, oracleCoverage, limits,
} from '@/components/course/panels/surveillance/surveillanceLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'surveillance';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const yn = (b) => (b ? 'yes' : 'no');

const LESSONS = [
  { n: 1, title: 'Surveillance never measures a well, it compares a well against a reading of ITSELF',
    body: 'Every output of this domain is the sentence "this well changed" and never "this well is bad". Two windows are taken on the same well, a recent one and a baseline one, both anchored on the field own latest ledger date rather than on the wall clock, and the difference between them is reported. So three questions a returned number cannot answer for you decide everything: which of the well several columns was read, over which window, and by which of the several functions that form the same quantity differently.' },
  { n: 2, title: 'A ledger row is a VOLUME and a producing-day rate is a RATE, and they are the same number only at a full day',
    body: 'One function turns a row into fourteen keys, of which seven are copied through and seven are computed. The producing-day rate is the volume scaled to twenty-four hours, and it refuses with a null when the hours are zero. That refusal is the single most important one in the module: an infinity there would propagate into every mean downstream and turn a shut-in day into a fabricated record rate. Anything that is not a finite number of hours is read as uptime unknown, and nothing clamps the column, so an hours figure above twenty-four scales the rate below the calendar volume.' },
  { n: 3, title: 'A watercut refuses on a different condition from a gas-oil ratio, and a correction row refuses on neither',
    body: 'A watercut is a fraction of LIQUID and a gas-oil ratio is per barrel of OIL, so a row with no liquid has no watercut and a row with no oil has no ratio however much gas it made. A negative volume, which is how a ledger books a back-out, is not refused at all: it is arithmetic, and it gives a negative liquid, a null watercut and a perfectly ordinary gas-oil ratio, because the ratio never looks at the water.' },
  { n: 4, title: 'A missing volume is a zero and a numeric string is neither a number nor a zero',
    body: 'The volume coercion returns the STRING when the column arrived as text. Every derived quantity formed by multiplication or division is then exactly right, and the one formed by ADDITION is not, so a row gas-oil ratio and producing-day rate are correct while its liquid and its watercut are wrong by the same factor either way. The field roll-up accumulates onto that string and concatenates, so four identical rows of eight hundred barrels come back as a twelve-digit total, and nothing anywhere reports that a column arrived as text.' },
  { n: 5, title: 'The field roll-up is the only surveillance return with no comparison in it at all',
    body: 'It forms mean daily rates over a trailing DATE window and then takes the watercut and the gas-oil ratio of those means, which is volume weighted by construction. Four things it does not say: how many days it actually averaged, which wells the uptime came from, what the well count counts, and whether any of its numbers is null. The liquid is guarded against a null mean and the watercut on the very next line is not.' },
  { n: 6, title: 'The severity ladder is not what it looks like',
    body: 'Every severity is a threshold crossed twice, high when the trigger is exceeded by a factor of two and medium otherwise. Three of the seven types do not work that way at all: the shut-in type is always high, the downtime type is always medium whatever the hours, and the stale-data type doubles only from info to medium, so a well silent for four hundred days cannot outrank a forty per cent rate drop. The sort is severity then well name and nothing else.' },
  { n: 7, title: 'The windows widen for a coarse ledger and the volumes do not',
    body: 'A monthly ledger compared over a seven-day window is one point against nothing, so the cadence is measured and the windows are stretched. Nothing in a ledger row says how long the row covers, so the widening rescales the WINDOW and never the VOLUME. A period volume that halves because the period was short reads as a rate that halved, and the message hard-codes a daily unit on a number that is a month of production.' },
  { n: 8, title: 'A well test decides which wells are in the split at all, and its age limit is guarded',
    body: 'A well is carried on an allocated day by the most recent test on or before that day, within an age limit, and a well with no test in force takes NO share rather than a guessed rate. The guard on that limit is a finite check and a greater-than-zero check together, so setting the limit to zero turns the age check OFF entirely and the oldest test on file carries the well for ever. The strictest-looking setting on the dial is the loosest behaviour in the module.' },
  { n: 9, title: 'Closure holds exactly per day and fails silently at the grand total',
    body: 'Every share is the same factor times a theoretical, so an allocated day closes to the last bit, and that identity is what makes an allocation defensible. A date whose theoretical is zero has no factor, is not allocated at all, and its metered volume is simply not in the grand allocated. There is no closure figure anywhere in the return, so a consumer that wants to know whether the field closed has to subtract the two totals itself and nothing prompts it to.' },
  { n: 10, title: 'Two functions in one file form the same two ratios two different ways',
    body: 'The field roll-up forms a period watercut and gas-oil ratio VOLUMETRICALLY, sum over sum, which is what a period ratio means. The exception engine forms the same two as the MEAN OF THE DAILY RATIOS, which is a different quantity and is biased by low-rate days. Neither reading is wrong: one answers what a typical day looked like and the other answers what the period produced. They agree exactly over a window of uniform days and diverge most where the window mixes rates.' },
  { n: 11, title: 'Three guards decide more than the limits they name',
    body: 'The minimum rate gate covers the rate check and the ratio check and not the watercut check, so a well too small to have its collapse reported still raises the loudest severity in the module on a different column. The downtime test requires the mean hours to be above zero, so a well shut for the whole window is the one case it refuses to report. And the decimator strides by a ceiling, so the count it returns can be more than the maximum its own argument names.' },
  { n: 12, title: 'The lift half of this domain begins at a rate, and two modules disagree about which phase it is',
    body: 'The screening matrix documents its target rate as barrels of LIQUID; the design advisor compares the identical input against the inflow OIL open flow and hands it to each chain as the oil design rate. The shipped studio passes one number to both. Swept across the bands the rules use, four of the six methods move somewhere, and the largest single move removes a method from consideration entirely, with not one datum about the well changing.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Production Surveillance: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Production Surveillance course and activate your account to open this app in
        Learning Mode. Surveillance never measures a well, it compares a well against a reading of
        itself over a window, so a number with no window and no column named beside it is a number
        nobody can act on.
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

const SurveillanceLearningPage = () => {
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
  // a published golden, off a shipped engine re-run on published inputs, or off
  // the one TEACHING FIELD this course built for itself, and never off the
  // graded field.
  const cm = useMemo(() => ({
    field: teachingFieldHeadline(),
    uptime: uptimeWellHeadline(),
    exceptions: teachingExceptionHeadline(),
    monthly: monthlyPeriodHeadline(),
    publishedSeam: publishedSeamHeadline(),
    seam: teachingSeamHeadline(),
    seamSweep: seamSweepHeadline(),
    bGuard: bGuardHeadline(),
    decimate: decimateHeadline(),
    minOil: minOilRateHeadline(),
    ageGuard: ageGuardHeadline(),
    maxAge: maxTestAgeHeadline(),
    allocation: teachingAllocationHeadline(),
    quiet: quietWellHeadline(),
    wallClock: wallClockHeadline(),
    stringRow: stringRowHeadline(),
    strings: stringAccumulatorRows(),
    membership: kpiMembershipHeadline(),
    uptimeMembership: uptimeMembershipRows(),
    handoff: teachingLiftHandoff(),
    ratePhase: ratePhaseHeadline(),
    pass: teachingDesignPass(),
    ladder: severityLadderHeadline(),
    fieldSeries: publishedFieldSeriesHeadline(),
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
      <Helmet><title>Production Surveillance (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Gauge className="h-7 w-7 text-[#BFFF00]" /> Production Surveillance
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              Surveillance never measures a well. It compares a well against a reading of ITSELF
              over a window, so everything here follows from three questions a returned number
              cannot answer for you. Which column was read? On the teaching field
              {' '}{TEACHING_FIELD_NAME}, which this course invented and which is not a real field,
              one well holds its producing-day oil rate at
              {' '}{fmt(cm.uptime.recentProducingDayMean, 6)} stb/d on every recent day while its
              calendar volume falls from {fmt(cm.uptime.baselineCalendarMean, 9)} to
              {' '}{fmt(cm.uptime.recentCalendarMean, 9)} stb, and the engine reports a drop of
              {' '}{fmt(cm.uptime.dropPctOnCalendar, 9)} per cent because the calendar column is the
              one it reads, while the other column moved by
              {' '}{fmt(cm.uptime.dropPctOnProducingDay, 9)} per cent, which is a rise. Over which
              window? Both windows are half-open and anchored on the field own latest ledger date,
              and they widen on each well own cadence. And formed by which function? The field
              roll-up forms a period ratio volumetrically and the exception engine forms the same
              ratio as a mean of daily ratios, and on the published well the two disagree by
              {' '}{fmt(cm.publishedSeam.gorOverstatementPct, 9)} per cent, which is the difference
              between a printed {cm.publishedSeam.gorSeverityByMeanOfRatios} and a printed
              {' '}{cm.publishedSeam.gorSeverityByVolumetric}. Every number on this page is a return
              value from the vendored surveillance, allocation, lift screening and lift advisor
              engines.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From one ledger row to a lift recommendation, on four vendored engines and their own
                published goldens. Every figure on this page and inside every panel is a return
                value from those engines, pinned by test files that assert the ARGUMENTS as well as
                the arithmetic, so an engine change cannot quietly invert a lesson and still pass.
                THE HEADLINE IS WORTH THE PRICE OF THE COURSE ON ITS OWN. The function whose whole
                job is to say which wells have CHANGED reads the one of the two columns that says
                how much they MADE: it sets its rate key to the calendar volume, and the
                producing-day rate is computed on every point and read by exactly one function in
                the file, {cm.exceptions.theProducingDayRateIsReadByExactlyOneFunctionInTheFile}.
                On the teaching field that raises {fmt(cm.exceptions.raised, 0)} exceptions over
                {' '}{fmt(cm.exceptions.wellsSurveilled, 0)} of {fmt(cm.exceptions.wellsHandedIn, 0)}
                {' '}wells, of which {fmt(cm.exceptions.highCount, 0)} are high, and one of them is a
                well whose performance never moved: mean recent hours of
                {' '}{fmt(cm.uptime.recentHoursMean, 9)} h against a downtime threshold of
                {' '}{fmt(cm.uptime.downtimeThresholdHours, 0)} h, so the one exception that would
                have named the real cause fires: {yn(cm.uptime.theDowntimeExceptionFires)}. THE
                SEAM IS THE OTHER HALF. On the teaching seam well the gas-oil ratio rise is
                {' '}{fmt(cm.seam.gorRiseByMeanOfRatiosPct, 9)} per cent read as a mean of daily
                ratios and {fmt(cm.seam.gorRiseByVolumetricPct, 9)} per cent read volumetrically,
                which is a {cm.seam.gorSeverityByMeanOfRatios} exception against no exception at
                all, and the watercut rise is {fmt(cm.seam.watercutRiseByMeanOfRatiosPts, 9)} points
                against {fmt(cm.seam.watercutRiseByVolumetricPts, 9)}. Neither reading is wrong.
                Over a window of uniform days the two are IDENTICAL, on
                {' '}{fmt(cm.seamSweep.pointsWhereTheTwoReadingsAgree, 0)} of
                {' '}{fmt(cm.seamSweep.pointsSwept, 0)} points swept, and they diverge most in the
                middle, which is why nobody caught it.
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

          {tier === 'intermediate' && <ExceptionExplorer />}
          {tier === 'advanced' && <ReadingExplorer />}

          {/* What the engines refuse to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these engines do not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer, and these four modules are
                blunt about some of their own and silent about the rest. {cm.limits.join(' ')} That
                is {fmt(cm.limits.length, 0)} stated limits. The divergences are worth as much.
                WHAT THE ORACLES GATE AND WHERE THEY STOP: four genuinely independent routes,
                {' '}{cm.oracle.theFourIndependentRoutes.length} of them, checking
                {' '}{fmt(cm.oracle.publishedFieldDays, 0)} field days,
                {' '}{fmt(cm.oracle.publishedExceptions, 0)} exceptions,
                {' '}{fmt(cm.oracle.publishedAllocatedDays, 0)} allocated days,
                {' '}{fmt(cm.oracle.publishedTestInForceProbes, 0)} test probes,
                {' '}{fmt(cm.oracle.publishedArchetypes, 0)} archetype wells and
                {' '}{fmt(cm.oracle.publishedTruthTableRows, 0)} truth-table rows. What they do NOT
                gate is {cm.oracle.whatTheyDoNotGate.join(', ')}, and that is where most of this
                course lives. Two of the seams they DO publish, as measured disagreements rather
                than as expected values, are {cm.oracle.theTwoSeamsTheGoldensPublishAsDisagreements.join(' and ')},
                and publishing a disagreement rather than resolving it is the right thing to have
                done. A MISSING VALUE HAS FOUR SPELLINGS AND FOUR MEANINGS. A text column in a
                volume leaves the gas-oil ratio and the producing-day rate exactly right
                ({yn(cm.stringRow.theGorIsExactlyRight)} and
                {' '}{yn(cm.stringRow.theOilProducingDayRateIsExactlyRight)}) and moves the liquid
                and the watercut by a factor of
                {' '}{fmt(cm.stringRow.theLiquidRateIsOverstatedByAFactorOf, 9)} either way, and the
                field roll-up concatenates rather than adding, so
                {' '}{fmt(cm.strings[3].rows, 0)} identical rows come back as
                {' '}{fmt(cm.strings[3].fieldOilAsStrings, 0)} stb against
                {' '}{fmt(cm.strings[3].fieldOilAsNumbers, 0)}. THE GUARDS DECIDE MORE THAN THE
                LIMITS THEY NAME. Setting the test age limit to zero turns the age check OFF, so
                the teaching allocation carries {fmt(cm.maxAge.wellsAt0Days, 0)} wells and
                {' '}{fmt(cm.maxAge.theoreticalOilAt0Days, 6)} stb of theoretical oil against
                {' '}{fmt(cm.maxAge.wellsAt1Day, 0)} well and
                {' '}{fmt(cm.maxAge.theoreticalOilAt1Day, 6)} stb one day higher, and
                {' '}{fmt(cm.ageGuard.settingsThatTurnTheCheckOff, 0)} of the
                {' '}{fmt(cm.ageGuard.settingsSwept, 0)} settings swept turn it off entirely. The
                minimum rate gate covers the rate check and not the watercut check, so a well whose
                oil fell {fmt(cm.minOil.theOilActuallyFellByPct, 6)} per cent raises no rate drop
                and a high watercut on the same rows:
                {' '}{yn(cm.minOil.theWellIsTooSmallToHaveItsRateCollapseReportedAndStillRaisesAHighWatercut)}.
                And the decimator returns {fmt(cm.decimate.worstUnderrunOutLength, 0)} points off a
                {' '}{fmt(cm.decimate.worstUnderrunAt, 0)} point series and comes back OVER its own
                stated maximum on {fmt(cm.decimate.pointsOverTheCap, 0)} of the sweep points. THE
                LADDER IS NOT WHAT IT LOOKS LIKE: {fmt(cm.ladder.typesThatCanReachHigh, 0)} of
                {' '}{fmt(cm.ladder.types, 0)} types can reach the top rung,
                {' '}{cm.ladder.theOneThatIsAlwaysMediumUnconditionally} is always medium
                unconditionally and {cm.ladder.theOneThatIsAlwaysHigh} is always high. ONE WELL,
                TWO MODULES, TWO OPPOSITE READINGS OF THE SAME SILENCE: the well that stops filing
                rows is credited with a full day on stream on
                {' '}{fmt(cm.quiet.daysCreditedWithAFullDayOnStream, 0)} allocated days and is
                simultaneously reported by the surveillance half as
                {' '}{cm.quiet.surveillanceExceptionType} at
                {' '}{cm.quiet.surveillanceExceptionSeverity} severity. ONE FUNCTION READS THE WALL
                CLOCK, and this page will not print its unanchored number:
                {' '}{cm.wallClock.whyItIsNotReturned} AND THE LIFT HANDOFF IS ONE RATE READ AS TWO
                PHASES. The rate handed over is {fmt(cm.handoff.targetRateBpd, 9)} bbl/d, the liquid
                the method must actually move is {fmt(cm.handoff.liquidRateBpd, 9)} bbl/d, and
                across {fmt(cm.ratePhase.ratesSwept, 0)} rates
                {' '}{fmt(cm.ratePhase.methodsThatMoveSomewhere, 0)} of the
                {' '}{fmt(cm.ratePhase.methodsInTheMatrix, 0)} methods move, the largest single move
                being {cm.ratePhase.largestSingleMoveMethod} losing
                {' '}{fmt(Math.abs(cm.ratePhase.largestSingleMovePoints), 0)} points at
                {' '}{fmt(cm.ratePhase.largestSingleMoveAtOilRateBpd, 0)} bbl/d. The design pass on
                the same well then reports
                {' '}{fmt(cm.pass.threeRefusalsAreTheSameSentenceAndMeanOnlyThatNoChainWasInjected, 0)}
                {' '}refusals in the SAME sentence, which say nothing about the well and mean only
                that no chain was supplied. None of this is a surveillance study. It is the
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

export default SurveillanceLearningPage;
