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
import StageExplorer from '@/components/course/panels/esp/StageExplorer';
import LiftExplorer from '@/components/course/panels/esp/LiftExplorer';
import PowerExplorer from '@/components/course/panels/esp/PowerExplorer';
import {
  ESP_THRESHOLDS, BEP_SCAN_STEPS, BRASS_LABEL, RECORDED_FINDING_40HZ, SEAM_FINDING,
  DIAGNOSIS_FIX, QUA_IBOE_4,
  vendorCurveFit, vendorBep, brassTranscriptionRows, fitExhaustion,
  allCases, stackSizing, intakeReading, teachingWellCase,
  gradientConversionSummary,
  affinityMaxDeviation, electricalMaxDeviation,
  twoPowerPickStudies, teachingCableFlipStudy, loadFractionSeamRows,
  underCurveBandRows, refusals,
} from '@/components/course/panels/esp/espLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'esp';
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
  { n: 1, title: 'A stage curve is a FIT, and a fit has a residual',
    body: 'Four coefficients pushed through five published points miss every one of them. The quality check that follows is the root mean square of those misses against two percent of the tallest point, and it never looks at a single point, at the shape, or at whether the curve still falls with rate.' },
  { n: 2, title: 'The best efficiency point is scanned, not solved',
    body: 'The engine walks a fixed number of steps across the published range and keeps the best sample it saw. On a reference stage, where the generating rate is known exactly, the rate it reports comes back beside that rate rather than on it, by up to a couple of bbl/d.' },
  { n: 3, title: 'Gravity moves power and moves nothing else',
    body: 'Head and efficiency are read off two fits that know nothing about the fluid. Brake power is the only one of the three readings that carries the specific gravity, which is why the same duty on a lighter fluid asks for less horsepower at exactly the same head.' },
  { n: 4, title: 'Nothing snaps at the end of the data',
    body: 'Read the head column through the boundary and it falls, flattens, crosses nought and keeps going. The only field that changes where the published data stops is a boolean, and it does not change a single number in the row it sits on.' },
  { n: 5, title: 'What the pump swallows is not what the perforations deliver',
    body: 'The separator takes gas up the annulus, so the pump sees less volume and a HEAVIER mixture than the whole stream was. The gradient the head conversion runs on is the gradient of what is left, and the verdict compares only that fraction against the two published limits.' },
  { n: 6, title: 'Total dynamic head is a pressure, converted to feet of what is being pumped',
    body: 'It is not the friction plus the wellhead. The net vertical lift is most of it on a deep well, and a design that leaves it out understates the stage count by roughly an order of magnitude.' },
  { n: 7, title: 'The rounding margin is bounded by ONE STAGE and never by a percentage',
    body: 'The stage count always rounds up, so the head the stack makes exceeds the head the duty needs by between nothing and one whole stage. The same fraction of a stage is worth tenths of a percent on two hundred stages and percent on thirty.' },
  { n: 8, title: 'One conversion, carried twice, in one file',
    body: 'Dividing by 144 is exact and the familiar rounded field constant is not, and the module holds both. The convention that keeps the design chain and the diagnostics chain on one column is to derive the specific gravity FROM the design gradient, never from the density.' },
  { n: 9, title: 'A sizing returns TWO brake powers and they are not the same number',
    body: 'One is at the head the duty requires and one is at the head the integer stack makes. Brake power is linear in head, so the ratio of the two powers is the ratio of the two heads, and the two power gap and the head margin are one fact wearing two names.' },
  { n: 10, title: 'Two fields called loadFraction answer different questions',
    body: 'The selection rule reports utilisation against a derated rating. The electrical model reports shaft power over the plate, because the current a machine draws does not move when somebody cuts its permissible load. Both are right and the shared name is the defect.' },
  { n: 11, title: 'The same cable pick, made twice, can bring out a different conductor',
    body: 'A pick moves only when the winning conductor sits between the limit divided by the power ratio and the limit itself. That window is the rounding margin wide, so on a short stack one defensible reading of the power buys a different cable than the other.' },
  { n: 12, title: 'A message that prints the threshold it just failed reads like a false alarm',
    body: 'Three diagnosis flags fire on a strict inequality and then print the ratio they fired on. Rounded to whole percent, everything in the first tenth past the bound rendered AS the bound. One decimal narrows that collision by a factor of ten and does not remove it.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">ESP Design: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the ESP Design course and activate your account to open this app in Learning Mode.
        Electrical submersible pumps lift more oil than every other form of artificial lift put
        together, and the design chain behind one runs from a vendor curve through a gassy intake to
        a stack of integer stages, a motor and a cable, with a decision hanging off each step.
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

const EspLearningPage = () => {
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
  // a published golden, off the published catalogue, or off one of the two
  // teaching wells, and never off the graded case.
  const cm = useMemo(() => {
    const sized = allCases().map(stackSizing);
    const flips = teachingCableFlipStudy();
    const seam = loadFractionSeamRows();
    const qua = seam.find((r) => r.id === QUA_IBOE_4.id) || seam[0];
    return {
      fit: vendorCurveFit(),
      bep: vendorBep(),
      brassMild: brassTranscriptionRows()[1],
      exhaustion: fitExhaustion(),
      quaIntake: intakeReading(teachingWellCase(QUA_IBOE_4)),
      gradient: gradientConversionSummary(),
      tightest: sized.reduce((a, b) => (b.headMarginPct < a.headMarginPct ? b : a)),
      loosest: sized.reduce((a, b) => (b.headMarginPct > a.headMarginPct ? b : a)),
      affinity: affinityMaxDeviation(),
      electrical: electricalMaxDeviation(),
      studies: twoPowerPickStudies(),
      flip: flips[0] || null,
      qua,
      quaCrossing: (qua.derates || []).find((d) => d.warningCodes.includes('motorOverloaded')) || null,
      underBand: underCurveBandRows(),
      refusals: refusals(),
    };
  }, []);

  const watermark = gate.quota?.export_watermark;
  const noPickStudies = cm.studies.filter((s) => s.chosenOnShaft === null && s.chosenOnStack === null);
  const collidingRows = cm.underBand.filter((r) => r.flagRaised && r.oldPrintEqualledThreshold);

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
      <Helmet><title>ESP Design (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Gauge className="h-7 w-7 text-[#BFFF00]" /> ESP Design
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              This app answers three questions in order and each one is harder than it looks. What
              does one stage do? A cubic through five published points misses every one of them by
              enough to give a root mean square of {tiny(cm.fit.headRmse)} ft against a bar of
              {' '}{fmt(cm.fit.transcriptionThresholdFt, 4)} ft, and the best efficiency point it
              reports, {fmt(cm.bep.qBpd, 0)} bbl/d, is the winner of a
              {' '}{fmt(BEP_SCAN_STEPS, 0)} step scan rather than a solved stationary point. What
              does the whole pump have to lift? On the teaching well QUA-IBOE-4 the perforations
              deliver {fmt(cm.quaIntake.totalResBpd, 4)} bbl/d at a gas volume fraction of
              {' '}{fmt(cm.quaIntake.streamGvf, 6)}, the separator takes some of the gas away, and
              what actually goes through the stages is {fmt(cm.quaIntake.pumpIntakeBpd, 4)} bbl/d at
              {' '}{fmt(cm.quaIntake.gvfThroughPump, 6)} in something HEAVIER than the stream was.
              And what does the electrical system have to carry? Two brake powers, differing by
              {' '}{fmt(cm.tightest.twoPowerGapPct, 6)} percent on {fmt(cm.tightest.stages, 0)}
              {' '}stages and {fmt(cm.loosest.twoPowerGapPct, 6)} percent on
              {' '}{fmt(cm.loosest.stages, 0)}, one of which the package's electrical chain is built
              on and the other of which the published motor sizing method takes. This course is why
              each of those numbers is what it is, and what each of them refuses to tell you.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From a vendor curve to a cable, on the vendored production ESP engine and its own
                published goldens. Every number on this page and inside every panel is a return
                value from that engine, and the whole set is pinned by a test file that asserts the
                ARGUMENTS as well as the arithmetic, so an engine change cannot quietly invert a
                lesson and still pass. The engine reproduces its goldens to
                {' '}{tiny(cm.affinity)} on the twelve affinity rows and {tiny(cm.electrical)} on the
                published electrical cases, so nothing below is a disagreement with the engine.
                Three of the findings are worth the price of the course. A transcription error that
                leaves the curve still looking like a pump curve, {BRASS_LABEL} with one point typed
                {' '}{fmt(cm.brassMild.points.find((p) => p.typedLessPublishedFt !== 0)?.typedLessPublishedFt, 3)}
                {' '}ft low, produces a single miss of {fmt(cm.brassMild.worstResidualFt, 6)} ft that
                the root mean square dilutes to {fmt(cm.brassMild.headRmse, 6)} ft, under the
                {' '}{fmt(cm.brassMild.transcriptionThresholdFt, 4)} ft bar, and the warning does not
                fire. The stage count rounds UP always, so the head the stack makes runs ahead of the
                head the duty needs by {fmt(cm.tightest.headMarginStages, 6)} of a stage on
                {' '}{fmt(cm.tightest.stages, 0)} stages and {fmt(cm.loosest.headMarginStages, 6)} of
                a stage on {fmt(cm.loosest.stages, 0)}, which is the same bound and two very
                different percentages. And the same cable pick, made on the two brake powers a
                single sizing returns, comes out
                {cm.flip
                  ? ` as ${cm.flip.chosenOnShaft} at ${fmt(cm.flip.decidingDropOnShaftPct, 6)} percent one way and ${cm.flip.chosenOnStack} at ${fmt(cm.flip.decidingDropOnStackPct, 6)} percent the other, across one ${fmt(cm.flip.maxDropPct, 1)} percent limit, on ${fmt(cm.studies.length, 0)} studies of which only that one moves.`
                  : ' the same either way on every study this course carries.'}
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
          <StageExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <LiftExplorer />}
          {tier === 'advanced' && <PowerExplorer />}

          {/* What the engine refuses to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer. It will not GUESS at
                viscosity: above {fmt(ESP_THRESHOLDS.viscosityCorrectionCSt, 0)} centistokes it
                reports that a Hydraulic Institute correction is required and applies factors only
                when you hand them over. It models no gas handling performance at all: the verdict
                compares the through-pump gas volume fraction against
                {' '}{fmt(ESP_THRESHOLDS.standardMaxGvf * 100, 0)} and
                {' '}{fmt(ESP_THRESHOLDS.handlerMaxGvf * 100, 0)} percent, names a class of
                equipment and stops. And it answers a very long way outside the data it was given:
                the head fit on the published vendor curve does not reach nought until
                {' '}{fmt(cm.exhaustion.vendorZeroHeadBpd, 4)} bbl/d,
                {' '}{fmt(cm.exhaustion.vendorZeroHeadPastDataBpd, 4)} bbl/d past the last published
                rate, with only a boolean to say so; carried through a stage count the same reading
                cost a design {fmt(RECORDED_FINDING_40HZ.stagesReturned, 0)} stages at
                {' '}{fmt(RECORDED_FINDING_40HZ.headPerStageFt, 4)} ft each,
                {' '}{fmt(RECORDED_FINDING_40HZ.stagesMultipleOfDesign, 2)} times the design stack,
                with {fmt(RECORDED_FINDING_40HZ.warningsRaised, 0)} warnings and
                {' '}{fmt(RECORDED_FINDING_40HZ.refusals, 0)} refusals. The refusals it DOES make are
                few and worth knowing: a two point curve comes back not ok, brake power at nought
                efficiency is {String(cm.refusals.brakeHpAtZeroEfficiency)}, a stage count on a head
                of nought is {String(cm.refusals.stageCountAtZeroHead)}, and a current estimate below
                half load is flagged weak rather than extrapolated. Two conventions sit in the same
                file and disagree by {fmt(cm.gradient.differencePct, 6)} percent, which is worth
                real feet of head on every case in this course. Two fields called loadFraction
                disagree by {fmt(SEAM_FINDING.gapPoints, 6)} points at the finding's own load and
                derate{cm.quaCrossing ? `, and on QUA-IBOE-4 they land on opposite sides of the overload line from ${fmt(cm.quaCrossing.deratePct, 0)} percent derate upward` : ''}.
                {noPickStudies.length > 0 && ` On ${fmt(noPickStudies.length, 0)} of the ${fmt(cm.studies.length, 0)} cable studies NOTHING in the shipped conductor table qualifies on either power, and the engine returns no cable rather than the least bad one.`}
                {' '}And {fmt(collidingRows.length, 0)} of the
                {' '}{fmt(cm.underBand.length, 0)} rows in the under curve boundary band used to
                print the threshold they had just failed;
                {' '}{fmt(DIAGNOSIS_FIX.messageTemplatesChanged, 0)} message templates gained a
                decimal place, {fmt(DIAGNOSIS_FIX.thresholdsChanged, 0)} thresholds moved and
                {' '}{fmt(DIAGNOSIS_FIX.returnedFieldsChanged, 0)} returned fields moved. None of
                this is a pump selection. It is the arithmetic under one, and the judgement stays
                with the engineer who signs it.
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

export default EspLearningPage;
