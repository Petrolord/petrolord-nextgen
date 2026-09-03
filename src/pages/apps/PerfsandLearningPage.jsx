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
  Loader2, ShieldAlert, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import ShotExplorer from '@/components/course/panels/perfsand/ShotExplorer';
import SkinExplorer from '@/components/course/panels/perfsand/SkinExplorer';
import SandExplorer from '@/components/course/panels/perfsand/SandExplorer';
import {
  UM, publishedSkin, publishedPr, catalogSweep, zeroCrossing, outOfRange,
  phasingSweep, publishedStats, sandControlAdvisor, packFor, cdpFor,
  stepIndependence, oracleCheck,
} from '@/components/course/panels/perfsand/perfsandLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'perfsand';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'A charge is sold on two numbers',
    body: 'How wide a hole it makes in the casing and how far it reaches into the rock. Both are measured in an API concrete target, which is not the formation, and every catalog row here says so.' },
  { n: 2, title: 'A sieve curve is cumulative RETAINED',
    body: 'The sand control convention is the opposite of the soils one, so D10 is the COARSE decile. Every value between two sieves is interpolated on a log scale, because grain sizes are log-normal.' },
  { n: 3, title: 'Perforation skin is four geometric terms',
    body: 'Plane flow, converging flow, wellbore blockage and the crushed zone. Only the first can be negative, and it is the one that decides whether a gun helps the well or hurts it.' },
  { n: 4, title: 'Phasing is the single biggest lever',
    body: 'Zero phasing is not an angle, it is a different formula: the effective wellbore radius becomes a quarter of the tunnel and loses the wellbore entirely. That discontinuity is worth more than any other change.' },
  { n: 5, title: 'Two numbers choose the completion type',
    body: 'Uniformity and fines, on an ordered ladder whose first matching rule is the answer. In the middle of the range the fines decide and the uniformity only takes over at the extremes.' },
  { n: 6, title: 'Sanding onset is a margin, not a sand rate',
    body: 'A Kirsch hoop stress at the cavity wall against the unconfined strength, swept along the interval. It says whether the rock reaches its strength, and nothing about how much sand or for how long.' },
]


function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Perforation and Sand Control: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Perforation and Sand Control course and activate your account to open this app
        in Learning Mode. There is no prerequisite inside the Drilling and Completions module.
        Completion Design is the natural companion: it decides what sits above the packer, and this
        course decides what happens below it. Geomechanics supplies the stress and strength profile
        the sanding screen runs on.
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

const PerfsandLearningPage = () => {
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

  // Each of these walks the whole well, so memoise them rather than re-running
  // on every render.
  const cm = useMemo(() => {
    const rows = catalogSweep();
    const stats = publishedStats();
    const sw = phasingSweep();
    const zeroPhase = sw.find((r) => r.phasingDeg === 0);
    const bestPhase = sw.reduce((a, b) => (b.total < a.total ? b : a));
    return {
      rows,
      cross: zeroCrossing(),
      out: outOfRange(),
      zeroPhase,
      bestPhase,
      tt: { skin: publishedSkin('through-tubing-2-1-8'), pr: publishedPr('through-tubing-2-1-8') },
      hsd: { skin: publishedSkin('hsd-4-5-8'), pr: publishedPr('hsd-4-5-8') },
      stats,
      advisor: sandControlAdvisor(stats),
      pack: packFor(stats.d50M),
      cdp: cdpFor({ geometry: 'perf-tunnel' }),
      steps: stepIndependence(),
      oracle: oracleCheck(),
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
      <Helmet><title>Perforation and Sand Control (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-7 w-7 text-[#BFFF00]" /> Perforation and Sand Control
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              Two questions share one app: what a perforation does to the flow, and what the sand
              does to the completion. Nine catalog guns into the same rock rank from a total skin of
              {' '}{cm.rows[0].total.toFixed(3)} on the smallest through-tubing gun to
              {' '}{cm.rows[8].total.toFixed(3)} on the biggest big-hole one, and the sheet crosses
              from damaging to stimulating between {cm.cross.above.odIn} and {cm.cross.below.odIn}
              {' '}inches. The single biggest lever is not penetration but PHASING: going from
              in-line shots to {cm.bestPhase.phasingDeg} degrees is worth
              {' '}{(cm.zeroPhase.total - cm.bestPhase.total).toFixed(3)} skin units on one gun, of
              which {(100 * (cm.zeroPhase.sH - cm.bestPhase.sH) / (cm.zeroPhase.total - cm.bestPhase.total)).toFixed(0)}
              {' '}percent is the plane-flow term alone. And the most attractive row on the sheet is
              the one row whose dimensionless perforation radius,
              {' '}{cm.out[0].rpD.toFixed(4)}, leaves the range the correlation was fitted over.
              {' '}On the sand side, a uniformity of {cm.stats.uniformity.toFixed(3)} and
              {' '}{cm.stats.finesPct.toFixed(1)} percent fines indicate a {cm.advisor.indication},
              which sizes a {cm.pack.mesh} gravel behind a {cm.pack.gaugeThou.toFixed(0)} thousandth
              screen. This course is why each of those numbers is what it is.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>From a gun catalog to a sanding sweep, on an independent numpy oracle whose skins, productivity ratios, sieve statistics, gravel sizing and critical drawdown the engine reproduces to a relative {cm.oracle.worstRel.toExponential(0)} over {cm.oracle.checked} compared values, which is the golden's own nine decimal rounding. Writing this course found a real defect in that engine: the sanding sweep never screened the interval bottom at a step that did not divide it, and every step size now reaches it, guarded both here and upstream.</CardDescription>
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
          <ShotExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <SkinExplorer />}
          {tier === 'advanced' && <SandExplorer />}

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

export default PerfsandLearningPage;
