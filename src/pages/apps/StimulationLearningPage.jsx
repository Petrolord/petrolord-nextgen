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
  Loader2, Flame, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import AcidExplorer from '@/components/course/panels/stimulation/AcidExplorer';
import FracExplorer from '@/components/course/panels/stimulation/FracExplorer';
import PackExplorer from '@/components/course/panels/stimulation/PackExplorer';
import {
  PARAMS, ACID, ACID_MU_PA_S, CFD_OPTIMUM, hawkinsOf, sandstoneOf, carbonateOf,
  matrixCeilingOf, publishedPkn, publishedKgd, modelSweep, ratePower, balanceOf,
  scheduleOf, publishedPack, publishedProductivity, searchOptimum,
} from '@/components/course/panels/stimulation/stimulationLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';

const APP = 'stimulation';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'Matrix or fracture is one comparison',
    body: 'Below the fracturing pressure you are cleaning up a damaged annulus around the wellbore. Above it you are making a new flow path through the rock. The pressure decides which job you are doing, and nothing else does.' },
  { n: 2, title: 'Damage is linear in the contrast and logarithmic in the radius',
    body: 'Hawkins skin is one line of algebra on two numbers. A treatment cannot change the permeability contrast, only the radius the acid reaches, so the shallow damage is worth far more per barrel than the deep damage.' },
  { n: 3, title: 'Acid volume grows with the SQUARE of the radius',
    body: 'The front fills an annulus, so reaching twice as far costs about four times as much acid. And the residual skin does not fall gradually as the front approaches the damage. It falls to zero the moment the front passes it.' },
  { n: 4, title: 'The matrix ceiling runs on the acid viscosity',
    body: 'Not the fracturing fluid. On this case those two differ by a factor of two hundred, and using the wrong one makes a perfectly pumpable job look impossible.' },
  { n: 5, title: 'The two width models disagree about DIRECTION',
    body: 'KGD is about two and a half times wider than PKN at the same conditions, and PKN net pressure rises with half-length while KGD net pressure falls. Which model you picked before the job decides what you conclude during it.' },
  { n: 6, title: 'Width goes as the quarter power of rate',
    body: 'Sixteen times the rate buys twice the width. Rate is the most expensive knob on the location and the weakest one in the width equation. Nobody buys width with horsepower.' },
  { n: 7, title: 'The pad fraction is NOT one minus efficiency',
    body: 'It is one minus efficiency over one plus efficiency, and the naive form always pumps too much pad. Too much pad shortens the fracture, and the error is worst at an intermediate efficiency rather than at the hardest job.' },
  { n: 8, title: 'The 1.6 optimum is a result and not a convention',
    body: 'A golden-section search on the pseudo-skin the engine itself computes, having never been shown the constant, walks the trade between length and width at a fixed proppant volume and lands on it anyway.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Stimulation Design: Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Stimulation Design course and activate your account to open this app in
        Learning Mode. Perforation and Sand Control is the natural companion: it decides how the
        well is connected to the rock, and this course decides what you then do to that rock.
        Geomechanics supplies the closure stress every fracture width and every matrix ceiling on
        this page is measured against.
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

const StimulationLearningPage = () => {
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

  // Every one of these runs the engine, and the search runs it two hundred
  // times, so memoise them rather than re-running on each render.
  const cm = useMemo(() => {
    const sweep = modelSweep();
    const bal = balanceOf();
    const sch = scheduleOf(bal);
    return {
      skin: hawkinsOf(),
      sand: sandstoneOf(),
      carb: carbonateOf(),
      qAcid: matrixCeilingOf().qM3s,
      qFracFluid: matrixCeilingOf({ muPaS: PARAMS.muPaS }).qM3s,
      pkn: publishedPkn(),
      kgd: publishedKgd(),
      first: sweep[0],
      last: sweep[sweep.length - 1],
      rate16: ratePower('pkn').find((r) => r.rateFactor === 16),
      bal,
      sch,
      pack: publishedPack(),
      prod: publishedProductivity(),
      found: searchOptimum(),
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
      <Helmet><title>Stimulation Design (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Flame className="h-7 w-7 text-[#BFFF00]" /> Stimulation Design
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              One pressure divides this app in two. Below the fracturing pressure you are dissolving
              damage: a permeability contrast of {ACID.kOverKs} out to {ACID.rsM} m costs
              {' '}{cm.skin.toFixed(3)} skin units, the published sandstone job pumps
              {' '}{cm.sand.volumeM3.toFixed(1)} cubic metres of acid to
              {' '}{ACID.raM} m and still leaves {cm.sand.sAfter.toFixed(3)} behind because the
              front stops short, and the well will take that acid at
              {' '}{(cm.qAcid * 60).toFixed(4)} cubic metres a minute on the acid's
              {' '}{ACID_MU_PA_S.toExponential(0)} Pa.s. In a carbonate the same
              {' '}{ACID.volumeM3} cubic metres would instead cut wormholes out to
              {' '}{cm.carb.rWhM.toFixed(3)} m for a skin of {cm.carb.skin.toFixed(3)}. Compute
              that matrix ceiling with the fracturing fluid instead of the acid and you get
              {' '}{(cm.qFracFluid * 60).toFixed(6)}, which is
              {' '}{(cm.qAcid / cm.qFracFluid).toFixed(0)} times too low. Above the fracturing
              pressure you are making a new flow path, and the two width models cannot agree about
              it: KGD is {(cm.kgd.wAvgM / cm.pkn.wAvgM).toFixed(2)} times wider than PKN, and over
              {' '}{cm.first.xfM} to {cm.last.xfM} m of half-length PKN net pressure RISES from
              {' '}{(cm.first.pknPNetPa / 1e6).toFixed(3)} to
              {' '}{(cm.last.pknPNetPa / 1e6).toFixed(3)} MPa while KGD net pressure FALLS from
              {' '}{(cm.first.kgdPNetPa / 1e6).toFixed(3)} to
              {' '}{(cm.last.kgdPNetPa / 1e6).toFixed(3)}. Widening the fracture with horsepower
              barely works: sixteen times the rate buys {cm.rate16.widthFactor.toFixed(3)} times
              the width. The job pumps
              {' '}{cm.bal.viM3.toFixed(0)} cubic metres to leave {cm.bal.vfM3.toFixed(0)} in the
              rock, an efficiency of {(100 * cm.bal.etaFrac).toFixed(1)} percent, and its pad is
              {' '}{cm.sch.padFrac.toFixed(4)} of the job and not the
              {' '}{(1 - cm.bal.etaFrac).toFixed(4)} the naive formula asks for. What survives is a
              pack {(1000 * cm.pack.wpM).toFixed(2)} mm across inside a fracture
              {' '}{(1000 * cm.pkn.wAvgM).toFixed(2)} mm wide, worth a dimensionless conductivity of
              {' '}{cm.prod.cfd.toFixed(4)}. And a search that has never been
              shown the number lands on a dimensionless conductivity of
              {' '}{cm.found.cfd.toFixed(4)} against the engine's published {CFD_OPTIMUM}.
              This course is why each of those numbers is what it is.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                From a damaged annulus to a propped fracture, on the vendored stimulation engine and its
                own golden case. Every number on this page and inside every panel is a return value from
                that engine, and the whole set is pinned by a test file that asserts the ARGUMENTS as well
                as the arithmetic, so an engine change cannot quietly invert a lesson and still pass. The
                headline is the last one: the engine carries {CFD_OPTIMUM} as a published constant, and a
                golden-section search that has never been shown it lands on {cm.found.cfd.toFixed(4)},
                which is {(100 * Math.abs(cm.found.ratioToConstant - 1)).toFixed(2)} percent away. A
                constant you can rederive from an independent route is a result. One you can only quote is
                a convention.
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
          <AcidExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <FracExplorer />}
          {tier === 'advanced' && <PackExplorer />}

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

export default StimulationLearningPage;
