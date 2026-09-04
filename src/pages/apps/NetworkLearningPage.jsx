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
  Loader2, Network, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import TrunkExplorer from '@/components/course/panels/network/TrunkExplorer';
import NetworkExplorer from '@/components/course/panels/network/NetworkExplorer';
import FightExplorer from '@/components/course/panels/network/FightExplorer';
import {
  TEACHING_NETWORK_NAME, DEFAULT_TOLERANCE_LB_D,
  teachingConditions, teachingTopology, teachingSolve, teachingSoloRows,
  teachingFightHeadline, teachingShutInRows, teachingDirection,
  linearStarSummary, goldenCaseSummary, loopedSplit, fightLadderHeadline,
  diagnoseHeadline, populationFixture, teachingStreamHeadline,
  teachingStreamMassRows, signConventionRows, streamLieRows,
  publishedPinning, teachingPinning, residualAgainstConservation,
  teachingWellCurve, initialGuessHeadline, nodeOrderHeadline,
  toleranceScale, toleranceScaleLadderRows, toFixedRows, cuspWalkHeadline,
  publishedEquivalentLength, thirtyDiametersRule, pipeTableSelfCheck,
  oracleCoverage, refusals,
} from '@/components/course/panels/network/networkLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'network';
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
  { n: 1, title: 'A gathering system has ONE answer and every well is in it',
    body: 'Every single-well studio in this platform solves one well against a wellhead pressure it was told. In a real gathering system nobody tells it: the header pressure is whatever the trunk needs to carry the total, and the total is the sum of what the wells make at that header pressure. The wells set the pressure that holds the wells back, and no amount of single-well analysis will show it. The rate a well makes is not a property of the well.' },
  { n: 2, title: 'The line and the topology come before anything is solved',
    body: 'A pipe schedule is a published table whose only self check is that the outside diameter less two walls equals the published bore. Barlow rates a wall and never defaults the design factor, because that factor is the whole regulatory content of the number. A fitting count is a length of pipe with a friction factor inside it. And a drawing is a network only if every node can reach a delivery point, which the topology builder refuses eleven distinct ways rather than repairing.' },
  { n: 3, title: 'The LINEAR case has a closed form, and it is the only check with no tolerance in it',
    body: 'Give the solver linear branch resistances and the whole network collapses to a weighted graph Laplacian, whose solution is a matrix inverse. Newton iteration and Gaussian elimination share no code and no reasoning, so their agreeing to machine precision is evidence about the assembly, the signs and the boundary handling rather than about either method. Newton is exact on a linear system, so it takes two steps. Every result after that one is an iterate.' },
  { n: 4, title: 'A loop is what makes a network a network, and a drawn arrow is not a direction',
    body: 'In a tree every branch flow is fixed by the flows downstream of it. In a loop it is not: the split between the two paths is decided by the pressures and the pressures are decided by the split, so the two legs are one decision rather than two pipes. And the sign of a branch flow is a property of the SOLUTION. A crosslink drawn one way comes back negative, and a learner who takes the arrow at face value gets the sign, the stream split and the whole downstream reading wrong.' },
  { n: 5, title: 'Wells fight, and the weak well loses most',
    body: 'Solve one header with one well, then two, then three, and every well already on it makes strictly less. Rank the wells by what they lose and you do not get the ranking by what they make, because a well with little margin over the header has the least to give when the header rises, and the second ranking is the one every allocation meeting uses. Neither column can be got at from the other by any single-well method.' },
  { n: 6, title: 'A converged flag is not a result',
    body: 'The norm the solve converges on is the maximum over the unknown nodes FILTERED to exclude the pinned ones, so a pinned node is removed from the measurement by construction. The conservation check that would catch it sits in the same file, its own header calls it the only check that catches a sign error in the assembly, and the solve never calls it. Nothing in the return of a solve is a check on the answer that was not computed by the same iteration that produced it.' },
  { n: 7, title: 'A pinned pressure and a solved pressure wear the same label in the same object',
    body: 'A node whose Jacobian row and column are both dead is pinned at wherever the last accepted step left it, and it is returned in the pressures object alongside every node that was actually solved, with nothing to tell them apart. Change nothing but the starting guess and that entry moves by hundreds of psi while every other number in the object stays put to the last bit. Reordering the nodes array, which changes no physics at all, moves the solved nodes by nothing and the pinned one by more.' },
  { n: 8, title: 'And exactly one starting guess actually solves the network',
    body: 'A well held to an allocation on a line that cannot pass it has a flat top on its inflow curve, and the flat top is a trap the engine default guess starts inside. There is a pressure at which that well delivers exactly what its line can carry, and at that pressure the allocation no longer binds, the node keeps its Jacobian row, nothing is pinned and the mass balance closes. Every other start pins the node, loses the difference and reports converged.' },
  { n: 9, title: 'The stream module carries a SECOND mass and nothing compares the two',
    body: 'The well stream mass is supplied by the caller and is never compared with the rate the solve produced, so whatever hole the solve left propagates straight into the surface split and the separator is told it receives the whole of a well test on a line the solve says only passes part of it. Hand it masses that are simply wrong by any factor and it propagates them with ok true and no warning. One comparison at the top of the function would catch both.' },
  { n: 10, title: 'Two sign conventions under one word, and two diseases in one column',
    body: 'The signed branch flow runs from the drawn start to the drawn end and can be negative. The branch stream mass is the stream along the SOLVED direction and is always positive. On a branch that runs backwards, differencing them gives exactly twice the flow. On the branches carrying a pinned well reported mass it gives the conservation gap. Both conventions are defensible; carrying both under the same word in the same result is not.' },
  { n: 11, title: 'The tolerance is not in the units its own name gives',
    body: 'The constant is named for a mass rate and its comment says the solve stops when the worst nodal imbalance is below it. What the solve stops at is that tolerance times a SCALE, and the scale is the largest SINGLE well inflow evaluated at the sink pressure. Nothing in the return carries it. And because the scale is the largest single well rather than the total, the effective criterion tightens as wells are added, which is the opposite of what a relative scale is for.' },
  { n: 12, title: 'Every failure comes back ok, and the message prints the number it failed on as zero',
    body: 'The topology builder trains the caller to key on ok by refusing eleven malformed networks with a reason. The solver returns ok true when the iteration cap is hit, when the line search stalls and when it sits on a cusp it cannot resolve, with a full set of pressures and flows that look exactly like an answer. And the failure sentence formats the residual to three fixed decimals, so on the one line whose whole job is to say how far off the answer is, a small residual reads as zero.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Production Networks: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Production Networks course and activate your account to open this app in
        Learning Mode. A gathering system has one answer and every well is in it, so the rate a
        well makes is a property of the whole network solved at once and never of the well.
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

const NetworkLearningPage = () => {
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
  // a published golden, off a fixture the shipped gate asserts on, or off the
  // one TEACHING NETWORK this course built for itself, and never off the
  // graded system.
  const cm = useMemo(() => ({
    conditions: teachingConditions(),
    topology: teachingTopology(),
    solve: teachingSolve(),
    solo: teachingSoloRows(),
    fight: teachingFightHeadline(),
    shutIn: teachingShutInRows(),
    direction: teachingDirection(),
    linear: linearStarSummary(),
    tree: goldenCaseSummary('turbulent_tree'),
    loop: loopedSplit(),
    ladder: fightLadderHeadline(),
    diagnosis: diagnoseHeadline(),
    population: populationFixture(),
    streams: teachingStreamHeadline(),
    streamMass: teachingStreamMassRows(),
    signs: signConventionRows(),
    lies: streamLieRows(),
    publishedPinning: publishedPinning(),
    pinning: teachingPinning(),
    residual: residualAgainstConservation(),
    curve: teachingWellCurve(),
    guess: initialGuessHeadline(),
    order: nodeOrderHeadline(),
    scale: toleranceScale(),
    scaleLadder: toleranceScaleLadderRows(),
    toFixed: toFixedRows(),
    cusp: cuspWalkHeadline(),
    fittings: publishedEquivalentLength(),
    rule: thirtyDiametersRule(),
    table: pipeTableSelfCheck(),
    oracle: oracleCoverage(),
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
      <Helmet><title>Production Networks (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Network className="h-7 w-7 text-[#BFFF00]" /> Production Networks
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              A gathering system has one answer and every well is in it. This course asks three
              questions in order. What does a line do on its own? That is a published table, a hoop
              stress and a fitting count, and one well against a boundary: on the teaching system
              {' '}{cm.solo[0].label} alone on its own flowline lands at
              {' '}{fmt(cm.solo[0].wellheadPsia, 4)} psia and makes
              {' '}{fmt(cm.solo[0].rateLbD, 4)} lb/d. What happens when the second well arrives?
              The four wells solo rates add to {fmt(cm.fight.soloRatesAddToLbD, 4)} lb/d and the
              system produces {fmt(cm.fight.theSystemProducesLbD, 4)} lb/d, so the network costs
              {' '}{fmt(cm.fight.theNetworkCostsPct, 4)} percent, and the weak well loses
              {' '}{fmt(cm.fight.rankedByPercentageLost[0].lostPct, 4)} percent while the strongest
              loses {fmt(cm.fight.rankedByPercentageLost[2].lostPct, 4)}. And can you believe the
              answer? The solve reports converged with a residual of
              {' '}{tiny(cm.residual.reportedResidualLbD)} lb/d while a conservation check on the
              same answer reports a gap of {fmt(cm.residual.conservationGapLbD, 4)} lb/d, which is
              {' '}{fmt(cm.residual.conservationGapPct, 4)} percent of what the engine says was
              produced. Every number on this page is a return value from the vendored production
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
                From one line and one well to a whole system solved at once, on the vendored network
                solver and pipe schedule engines and their own published goldens. Every figure on
                this page and inside every panel is a return value from those engines, pinned by
                test files that assert the ARGUMENTS as well as the arithmetic, so an engine change
                cannot quietly invert a lesson and still pass. THE HEADLINE IS WORTH THE PRICE OF
                THE COURSE ON ITS OWN. The reported residual cannot see its own error: the norm the
                solve converges on excludes the pinned nodes by construction, so the engine returns
                converged at {tiny(cm.residual.reportedResidualLbD)} lb/d while the conservation
                check in the same file, on the same answer, reports
                {' '}{fmt(cm.residual.conservationGapLbD, 4)} lb/d, a factor of
                {' '}{tiny(cm.residual.theAuditIsHowManyTimesTheIteration)}. The solve never calls
                that check. A pinned pressure is undetermined and propagates: change nothing but the
                starting guess and the gap comes back as
                {' '}{fmt(cm.guess.defaultConservationGapLbD, 4)} lb/d, as
                {' '}{fmt(cm.guess.worstGapLbD, 4)} lb/d with the capacity limited flowline running
                backwards at its limit, and as zero, and every one of those runs says converged.
                THE ROW THAT REPORTS ZERO IS THE ONLY SOLUTION, it is the run that leaves the node
                at {fmt(cm.guess.solutionPinnedPressurePsia, 4)} psia where the well inflow equals
                its line capacity, and it is also the only run on the table where NOTHING is pinned,
                because the allocation no longer binds up there. The engine default does not find
                it: {cm.guess.defaultFindsTheSolution ? 'yes' : 'no'}. The tolerance is not in the
                units its own name gives, because the solve stops at that tolerance times a scale of
                {' '}{fmt(cm.scale.scaleLbD, 4)} lb/d that nothing in the return carries. And the
                stream module propagates a second mass nobody compares, which is why the separator
                is told it receives {fmt(cm.streams.arrivingMassLbD, 4)} lb/d on a trunk the solve
                says passes {fmt(cm.solve.trunkLbD, 4)} lb/d.
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
          <TrunkExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <NetworkExplorer />}
          {tier === 'advanced' && <FightExplorer />}

          {/* What the engines refuse to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these engines do not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer, and this module is blunt
                about most of its own. THE LARGEST LIMIT IS THE ONE THE WHOLE COURSE RESTS ON: the
                pipe hydraulics and the well inflows are CALLBACKS the consumer supplies, and the
                module header says so as the whole reason it is in the engine package, because the
                topology, the Newton solve and the conservation laws have nothing to do with
                petroleum and can therefore be checked exactly. Everything else follows from that.
                There is no temperature anywhere, so no thermal coupling and no cooldown. There is
                no slugging, no holdup and no transient of any kind, because every equation here is
                steady state. There is no compressibility along a branch, since mass in equals mass
                out on every branch by construction. There is no equipment between nodes: no pump,
                no compressor and no choke as a node kind, so anything a real gathering system has
                that is not a well, a junction or a sink has to be written as a branch relation or
                left out. A separator does nothing but accept whatever arrives at a fixed pressure.
                That is {fmt(cm.refusals.length, 0)} stated limits, most of them in the module own
                header. The divergences are worth as much. THE REPORTED RESIDUAL IS BLIND TO A
                PINNED NODE BY CONSTRUCTION, and the worst imbalance over ALL the unknown nodes on
                the teaching system is {fmt(cm.residual.worstImbalanceAllUnknownsLbD, 4)} lb/d
                against the {tiny(cm.residual.worstImbalanceUnpinnedLbD)} lb/d the engine reports.
                The warning it prints asserts a diagnosis it has not checked: it says the node
                carried nothing on a dead line, on a case where that well is producing
                {' '}{fmt(cm.pinning.itsReportedRateLbD, 4)} lb/d and its flowline is passing
                {' '}{fmt(cm.pinning.itsFlowlineCarriesLbD, 4)} lb/d. The published gate fixture for
                pinning is a network where {fmt(cm.publishedPinning.conservationGapLbD, 0)} lb/d
                goes in and never comes out, and the gate asserts the flag and the warning text and
                never looks at the hole. The stream propagation carries a second mass for every
                branch and never compares it with the solve: multiply every well stream mass by two
                and it propagates them with ok
                {' '}{cm.lies[cm.lies.length - 1].ok ? 'true' : 'false'} at a trunk stream of
                {' '}{fmt(cm.lies[cm.lies.length - 1].trunkStreamMassLbD, 4)} lb/d against a solved
                trunk of {fmt(cm.lies[cm.lies.length - 1].solvedTrunkLbD, 4)} lb/d, and the
                separator oil does not move by a single barrel, because the split is by mass share.
                The signed flow and the branch stream mass use opposite conventions under one word,
                so differencing them on the branch that runs backwards gives exactly twice what it
                carries. A branch relation only has to be continuous and monotone by the contract,
                and a differenced Jacobian needs more: walk one leg of the loop and the solve stops
                converging over a band of conductances from
                {' '}{fmt(cm.cusp.lowestFailingConductance, 0)} to
                {' '}{fmt(cm.cusp.highestFailingConductance, 0)} while every row of it still returns
                ok. And the pipe table gate is the loosest assertion in the package: it admits
                anything within {fmt(cm.table.gateBandIn, 6)} in of the published bore, which is
                {' '}{fmt(cm.table.bandOverLargestResidual, 0)} times wider than the largest
                residual the table actually carries, and there is no Python referee for that module
                anywhere. The independent oracle publishes
                {' '}{fmt(cm.oracle.publishedCaseCount, 0)} clean cases and records no defects at
                all, because none of them can reach any of this. None of this is a network study. It
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

export default NetworkLearningPage;
