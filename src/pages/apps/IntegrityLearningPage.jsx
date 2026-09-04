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
  Loader2, ShieldCheck, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import EnvelopeExplorer from '@/components/course/panels/integrity/EnvelopeExplorer';
import AnnulusExplorer from '@/components/course/panels/integrity/AnnulusExplorer';
import PaExplorer from '@/components/course/panels/integrity/PaExplorer';
import {
  PARAMS, D010_DEFAULT_RULES, RP90_MAWOP_FACTORS,
  verifyPublished, seatCount, categorySweep, statusSweep, wellCategory,
  publishedMaasp, publishedMawop, factorSweep,
  excessSweep, publishedPlug, publishedProgram,
} from '@/components/course/panels/integrity/integrityLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'integrity';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'A barrier is an ENVELOPE and not a component',
    body: 'Nothing in this engine is a barrier on its own. Elements are gathered into a primary and a secondary envelope, and the well is described by what those two envelopes are doing rather than by any one piece of steel.' },
  { n: 2, title: 'The WORST element sets the whole envelope',
    body: 'There is no averaging and no majority vote. Three sound seals and one that leaks is a leak, so the envelope reads back as its worst member every time.' },
  { n: 3, title: 'not-verified degrades, it is not ignored',
    body: 'An element nobody has checked is not a working barrier, it is an unknown, and the standard treats an unknown exactly as it treats a degradation. The alternative would let an untested well read as sound.' },
  { n: 4, title: 'The two vocabularies are different on purpose',
    body: 'An element is verified, degraded, failed or not-verified. An envelope is intact, degraded, failed or empty. The engine refuses the wrong list rather than falling through to a reassuring answer.' },
  { n: 5, title: 'An EMPTY envelope is never green',
    body: 'Nothing recorded is not a clean bill of health, in either branch of the flow-potential test. The no-flow branch used to fall through to green there, which is the one direction an integrity function must never fail in.' },
  { n: 6, title: 'A rating is a DIFFERENTIAL across a wall',
    body: 'What stands on the far side is part of the answer. A heavier backup column pushes back and buys margin here, and taking it away spends the margin, one for one with head.' },
  { n: 7, title: 'The governing candidate is a MINIMUM and not the first row',
    body: 'Verifying the rows says nothing about the reduction over them. The annulus can only be worked to the weakest thing on it, and on this well the weakest thing is the last row offered.' },
  { n: 8, title: 'A negative allowable is a finding rather than a pressure',
    body: 'Hydrostatic alone can bust a rating. The engine clamps the reported MAASP to zero and raises a flag, because a negative allowable is not a pressure you can apply in the other direction.' },
  { n: 9, title: 'The plug settles even with no excess at all',
    body: 'The as-pumped column stands in the annulus plus the stinger bore. Pull the stinger and the same slurry redistributes across the full hole, which is wider, so the top drops before any excess is added.' },
  { n: 10, title: 'One zone short is the whole programme short',
    body: 'Two independent permanent barriers per flowing zone, and a compliant surface phase does not rescue a zone that has only one. The published programme fails on exactly that.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Well Integrity and P&A: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Well Integrity and P&A course and activate your account to open this app in
        Learning Mode. Casing and Tubing Design supplies the ratings every annulus limit on this
        page is taken from, Cementing supplies the sheath the plugs and the annular barriers are
        made of, and Well Design and Surveys supplies the true vertical depth without which no
        hydrostatic term here means anything.
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

const IntegrityLearningPage = () => {
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

  // Every one of these runs the engine, so memoise them rather than
  // re-running the whole set on each render.
  const cm = useMemo(() => {
    const v = verifyPublished();
    const grid = categorySweep(true);
    const mawopOut = publishedMawop();
    const rows = mawopOut.rows;
    const minRow = rows.reduce((a, b) => (b.allowSurfacePa < a.allowSurfacePa ? b : a));
    const excess = excessSweep([0])[0];
    const prog = publishedProgram();
    const factors = factorSweep();
    const outer = factors.find((r) => r.role === 'outer-casing-burst');
    const inner = factors.find((r) => r.role === 'inner-casing-burst');
    return {
      v,
      seats: seatCount(),
      nv: statusSweep('verified').find((r) => r.status === 'not-verified'),
      greens: grid.filter((r) => r.category.category === 'green').length,
      emptyGreens: grid.filter((r) => r.primary === 'empty' && r.category.category === 'green').length,
      noFlowEmpty: wellCategory({ primary: 'empty', secondary: 'empty', flowPotential: false }),
      maasp: publishedMaasp(),
      mawop: mawopOut,
      firstRow: rows[0],
      minRow,
      outer,
      inner,
      plug: publishedPlug(),
      excess,
      prog,
      failingZones: prog.zoneCompliance.filter((z) => !z.pass),
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
      <Helmet><title>Well Integrity and P&A (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-[#BFFF00]" /> Well Integrity and P&A
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              This app answers three questions, and each one is harder than it looks. Is the well
              contained? The published roster has {cm.seats.physical} elements filling
              {' '}{cm.seats.seats} envelope seats, its primary reads {cm.v.primary.status} because
              a single element inside it is degraded, its secondary reads
              {' '}{cm.v.secondary.status}, and the well is therefore {cm.v.category}: every one of
              the {cm.v.checks.length} checks passes and the well is still not green. Across the
              whole sixteen-state table exactly {cm.greens} state is green, an unverified element
              degrades the envelope just as a degraded one does, and
              {' '}{cm.emptyGreens} of the states with an empty primary is green, even where
              nothing can flow to surface, where the engine answers
              {' '}{cm.noFlowEmpty.category}. How hard can the annulus be worked? The limiting
              element allows {(cm.maasp.maaspPa / 1e6).toFixed(3)} MPa at surface once the
              {' '}{(cm.maasp.rows[0].tvdM).toFixed(1)} m of annulus fluid above it has been paid
              for, and across three MAWOP candidates the answer is
              {' '}{(cm.mawop.mawopPa / 1e6).toFixed(3)} MPa on
              {' '}{cm.mawop.governing}, which is the MINIMUM row and not the first: take the first
              instead and you would report
              {' '}{((cm.firstRow.allowSurfacePa - cm.minRow.allowSurfacePa) / 1e6).toFixed(3)} MPa
              more pressure than the annulus can take. The RP 90 roles are worth
              {' '}{((cm.inner.result.mawopPa - cm.outer.result.mawopPa) / 1e6).toFixed(3)} MPa on
              one piece of steel that never changed. And how is the well left for good? The
              published plug pumps {cm.plug.slurryM3.toFixed(3)} cubic metres to stand
              {' '}{cm.plug.balancedHeightM.toFixed(1)} m in the annulus plus the stinger bore, and
              at ZERO excess its settled top is {cm.excess.pluggedTopMdM.toFixed(1)} m, exactly the
              design top, while the plug has still dropped
              {' '}{cm.excess.settleM.toFixed(3)} m below where the pump chart left it. The
              abandonment programme {cm.prog.pass ? 'passes' : 'FAILS'} on
              {' '}{cm.failingZones.length} of its {cm.prog.zoneCompliance.length} zones while its
              surface plug {cm.prog.surfacePlug.pass ? 'passes' : 'fails'}. This course is why each
              of those numbers is what it is.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From a roster of elements to a well left for good, on the vendored well integrity
                and P&A engines and their own golden case. Every number on this page and inside
                every panel is a return value from those engines, and the whole set is pinned by a
                test file that asserts the ARGUMENTS as well as the arithmetic, so an engine change
                cannot quietly invert a lesson and still pass. Two of those arguments are worth the
                price of the course on their own. An unverified element degrades the envelope
                rather than being ignored, so this well's primary reads {cm.nv ? cm.nv.primary : '-'}
                {' '}on an untested element just as it would on a damaged one. And at zero excess
                the settled plug top is exactly the design top, {cm.excess.pluggedTopMdM.toFixed(1)}
                {' '}m, while the plug has still settled {cm.excess.settleM.toFixed(3)} m below the
                as-pumped top, because the slurry redistributes from annulus plus stinger bore to
                the full hole when the stinger comes out. Settling is not an excess effect. Excess
                only adds to it.
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
          <EnvelopeExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <AnnulusExplorer />}
          {tier === 'advanced' && <PaExplorer />}

          {/* What the engines refuse to do */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these engines do not do</CardTitle>
              <CardDescription>
                The scope is worth knowing before you trust an answer. The barrier engine verifies
                the status roll-up and the envelope rules; whether the elements form a sealed
                surface around the source is the engineer's drawing and no code here has seen it.
                The annulus engine takes TRUE VERTICAL depth, because a head is a vertical quantity
                and converting along-hole depth is the survey engine's job. The RP 90 role factors,
                {' '}{RP90_MAWOP_FACTORS['outer-casing-burst']} on an outer casing burst and
                {' '}{RP90_MAWOP_FACTORS['inner-casing-burst']} on an inner one, are a convention
                from a standard document rather than a property of the pipe, and the standard
                governs. The D-010 rule defaults, {D010_DEFAULT_RULES.plugMinLengthM} m of plug or
                {' '}{D010_DEFAULT_RULES.plugMinLengthOnFoundationM} m on a verified foundation and
                {' '}{D010_DEFAULT_RULES.annularCementUnverifiedMinM} m of annular cement or
                {' '}{D010_DEFAULT_RULES.annularCementVerifiedMinM} m with a log, are overridable
                for the same reason. And the abandonment programme is a planning checklist in the
                well programme tradition: it tells you the job is not finished, and it does not tell
                you how to finish it. The published case is a slant well whose limiting element sits
                at {PARAMS.maaspFixture.mdM} m along hole and
                {' '}{PARAMS.maaspFixture.tvdM.toFixed(1)} m true vertical.
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

export default IntegrityLearningPage;
