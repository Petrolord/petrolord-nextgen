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
import IprExplorer from '@/components/course/panels/nodal/IprExplorer';
import VlpExplorer from '@/components/course/panels/nodal/VlpExplorer';
import NodeExplorer from '@/components/course/panels/nodal/NodeExplorer';
import {
  BONNY_7, FORCADOS_3, ESCRAVOS_9, DEFAULT_NGRID, PUBLISHED_CS_STEPS, SCAN_REVERSAL_PWH_PSIA,
  wellModelAofs, wellOutflowReadings, wellWindow,
  wellColumnVsAverageTz, wellFrictionGroup,
  teachingColumnTruncationTable, scanReversalStudy, scanReversalTruth, goldenGasIprCases,
} from '@/components/course/panels/nodal/nodalLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'nodal';
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
  { n: 1, title: 'A well is two curves and one meeting point',
    body: 'The reservoir can deliver a rate at a flowing pressure and the tubing will accept a rate at a flowing pressure. The well produces where those two statements agree, and everything else in this course is a consequence of that sentence.' },
  { n: 2, title: 'The straight line is honest above the bubble point and nowhere else',
    body: 'Below it, gas coming out of solution takes the relative permeability to oil down with it, and a constant productivity index has no way to say that. The composite relation is straight above the bubble point and Vogel below it for exactly that reason.' },
  { n: 3, title: 'A test taken below the bubble point corrupts the index itself',
    body: 'Part of the drawdown was spent pushing two phases, so the rate over the drawdown is smaller than the index the well actually has. The curve is then wrong in its shape and wrong in its slope at the top, and those two mistakes do not cancel.' },
  { n: 4, title: 'The inverse reading is a different operation from the forward one',
    body: 'A forward reading evaluates the relation. An inverse reading solves it, by a root find on the forward relation, because reading a chord off a sampled copy of the curve lands low wherever the curve is steep.' },
  { n: 5, title: 'The absolute open flow is a denominator, not a target',
    body: 'It is the rate the calibrated curve returns at a flowing bottomhole pressure of nought, which needs the full drawdown, no column in the tubing and nothing to deliver into. Quote it as a capacity and it will be read as a plan.' },
  { n: 6, title: 'The outflow curve is J shaped because two terms pull opposite ways',
    body: 'A column lightens as rate rises and friction grows as the square of rate, so the required bottomhole pressure falls, reaches a minimum and rises again. Which side of that minimum a well sits on is what the Expert tier turns on.' },
  { n: 7, title: 'Wellhead pressure moves the bottom of the J in pressure and not in rate',
    body: 'It shifts the whole curve vertically and drops out of the derivative. Choking a well back does not change the rate at which it loads up, it changes how much pressure the reservoir has to find to hold it there.' },
  { n: 8, title: 'The published two station column is right until friction arrives',
    body: 'Cullender and Smith defaults to two sub-intervals, which is the published method, and it costs a fraction of a psi on a static gradient. Put gas at rate up the same string and the same truncation costs whole psi.' },
  { n: 9, title: 'A node can have two solutions and only one of them holds',
    body: 'When the column outweighs the reservoir at low rate the residual starts positive, dips through zero and comes back. The lower crossing is the heading branch, and reporting the first intersection a solver returns gets the one that does not exist in practice.' },
  { n: 10, title: 'Stability is a statement about two slopes, never about one',
    body: 'The residual has to be rising through the crossing, and since the inflow always falls, a crossing can hold on the falling limb of the outflow. A stable operating point does not have to sit on the rising friction limb.' },
  { n: 11, title: 'A solver that scans a grid has a resolution',
    body: 'A forty point scan can miss two crossings that sit inside one interval and report a live well dead, with no warning attached. The scan fails long before the stability slope test does, and a finer scan is not always a better scan.' },
  { n: 12, title: 'Near tangency a sweep is a stronger answer than a point',
    body: 'A small reduction in wellhead pressure buys a large gain in rate and in room, and a small increase kills the well outright. That asymmetry is what you always get when two curves are nearly tangent.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Nodal Analysis and Well Performance: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Nodal Analysis and Well Performance course and activate your account to open
        this app in Learning Mode. This is the root of the Production and Artificial Lift path: the
        inflow it calibrates is what every artificial lift decision is measured against, the outflow
        it builds is what a tubing size argument is really about, and the operating point it solves
        for is the rate every production forecast downstream of it starts from.
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

const NodalLearningPage = () => {
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
  // a published golden or off one of the three teaching wells, never off the
  // graded case.
  const cm = useMemo(() => {
    const truncation = teachingColumnTruncationTable()[0];
    const reversal = scanReversalStudy();
    return {
      bonnyAofs: wellModelAofs(BONNY_7),
      forcadosAofs: wellModelAofs(FORCADOS_3),
      forcadosOutflow: wellOutflowReadings(FORCADOS_3),
      forcadosWindow: wellWindow(FORCADOS_3),
      escravosWindow: wellWindow(ESCRAVOS_9),
      truncation,
      frictionGroup: wellFrictionGroup(FORCADOS_3),
      forcadosColumn: wellColumnVsAverageTz(FORCADOS_3),
      reversalDead: reversal.filter((r) => r.status === 'dead'),
      reversalLive: reversal.filter((r) => r.status === 'flowing'),
      reversalAtDefault: reversal.find((r) => r.nGrid === DEFAULT_NGRID),
      truth: scanReversalTruth(),
      worstChord: goldenGasIprCases()
        .flatMap((c) => c.chord40.map((r) => ({ id: c.id, ...r })))
        .reduce((a, b) => (Math.abs(b.biasPsi) > Math.abs(a.biasPsi) ? b : a)),
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
      <Helmet><title>Nodal Analysis and Well Performance (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Activity className="h-7 w-7 text-[#BFFF00]" /> Nodal Analysis and Well Performance
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              This app answers three questions in order, and each one is harder than it looks. What
              will the reservoir give? Calibrate one production test three ways and the same well
              comes back with an absolute open flow of {fmt(cm.bonnyAofs.straightLineStbd, 3)},
              {' '}{fmt(cm.bonnyAofs.vogelStbd, 3)} and {fmt(cm.bonnyAofs.compositeStbd, 3)} stb/d,
              and on a well whose test sits below its bubble point the straight line does not even
              carry the right productivity index: it backs out
              {' '}{fmt(cm.forcadosAofs.straightLinePiStbdPerPsi, 6)} stb/d/psi against the well's own
              {' '}{fmt(cm.forcadosAofs.compositePiStbdPerPsi, 6)}. What will the tubing take? A
              column lightens with rate and friction grows as its square, so the outflow is a J with
              its bottom at {fmt(cm.forcadosOutflow.trueMinimumQStbd, 4)} stb/d asking for
              {' '}{fmt(cm.forcadosOutflow.trueMinimumBhpPsia, 4)} psia, standing on a dead column of
              {' '}{fmt(cm.forcadosOutflow.deadColumnPsia, 0)} psia. And where do the two agree? On a
              well where the column outweighs the reservoir at low rate they agree TWICE, at
              {' '}{fmt(cm.forcadosWindow.unstableQStbd, 4)} and
              {' '}{fmt(cm.forcadosWindow.opQStbd, 4)} stb/d, and only the second one holds. This
              course is why each of those numbers is what it is, and what each of them refuses to
              tell you.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From one production test to a swept decision, on the vendored production nodal
                engine and its own published goldens. Every number on this page and inside every
                panel is a return value from that engine, and the whole set is pinned by a test file
                that asserts the ARGUMENTS as well as the arithmetic, so an engine change cannot
                quietly invert a lesson and still pass. Three of those arguments are worth the price
                of the course. The published two station gas column costs
                {' '}{tiny(cm.truncation.gravityOnlyErrorPsi)} psi on a static gradient and
                {' '}{tiny(cm.truncation.frictionLoadedErrorPsi)} psi on the same kind of string
                carrying {fmt(cm.frictionGroup.qMmscfd, 3)} MMscf/d, which is
                {' '}{fmt(cm.truncation.errorRatio, 2)} times as much and a different kind of error
                rather than a bigger one. A stable operating point does not have to sit on the rising
                limb: one of the three teaching wells holds a stable crossing at
                {' '}{fmt(cm.escravosWindow.opQStbd, 4)} stb/d while the bottom of its own tubing
                curve sits away to the right at {fmt(cm.escravosWindow.tubingMinimumQStbd, 4)}
                {' '}stb/d, because stability is a statement about the difference of two slopes and
                never about the sign of one of them. And a solver
                that scans a grid has a resolution: at a wellhead pressure of
                {' '}{fmt(SCAN_REVERSAL_PWH_PSIA, 2)} psia a well with a
                {' '}{fmt(cm.truth.windowStbd, 4)} stb/d stable window is reported DEAD at
                {' '}{cm.reversalDead.map((r) => `nGrid ${fmt(r.nGrid, 0)}`).join(' and at ')}, while
                {' '}{fmt(cm.reversalLive.length, 0)} other resolutions find it and agree on an
                operating rate of {fmt(cm.truth.opQStbd, 4)} stb/d.
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
          <IprExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <VlpExplorer />}
          {tier === 'advanced' && <NodeExplorer />}

          {/* What the engine refuses to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer. The engine REFUSES to build a
                black oil traverse, and it says so in its own header: a multiphase column belongs to
                whoever owns the PVT stack, so the oil outflow is INJECTED as a function and the two
                shapes used here are the goldens' own instruments rather than correlations. What it
                does build for itself is a DRY GAS column by Cullender and Smith, whose default of
                {' '}{fmt(PUBLISHED_CS_STEPS, 0)} sub-intervals IS the published two station method,
                accurate to {tiny(cm.truncation.gravityOnlyErrorPsi)} psi on a static gradient and
                {' '}{tiny(cm.truncation.frictionLoadedErrorPsi)} psi once friction arrives, with no
                warning either way. Its closed form cousin, average temperature and z, reaches the
                same flowing column by a different road and lands
                {' '}{fmt(cm.forcadosColumn.convergedMinusAverageTzPsi, 4)} psi away using one average
                compressibility of {fmt(cm.forcadosColumn.averageTzZbar, 6)} over the whole hole,
                and that gap is a METHOD gap that no step count will close. The inverse of a sampled
                gas deliverability curve is biased LOW wherever the curve is steep, up to
                {' '}{fmt(cm.worstChord.biasPsi, 4)} psi on {cm.worstChord.id}, which is why the oil
                inverse here is a root find and never a chord off a table. And the node solve SCANS:
                the documented default of {fmt(DEFAULT_NGRID, 0)} points spreads its samples
                {' '}{fmt(cm.reversalAtDefault.spacingStbd, 4)} stb/d apart on the choked teaching
                case, and a well whose whole stable window is narrower than one interval comes back
                dead with nothing attached to say so. None of this is a production forecast. It is
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

export default NodalLearningPage;
