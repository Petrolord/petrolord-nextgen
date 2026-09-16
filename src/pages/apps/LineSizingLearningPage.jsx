import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, Gauge, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import LiquidExplorer from '@/components/course/panels/linesizing/LiquidExplorer';
import GasLineExplorer from '@/components/course/panels/linesizing/GasLineExplorer';
import WallPigExplorer from '@/components/course/panels/linesizing/WallPigExplorer';
import { associateReading, professionalReading, expertReading, heldItems } from '@/components/course/panels/linesizing/linesizingLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Line Sizing & Hydraulics course page. Every number it prints is a return
// value from the teaching lab (linesizingLab), which is a return value from the
// vendored line-hydraulics, choke and pipe-schedule engines on the teaching
// lines. It never reads the capstone: panelCapstoneGuard.test.js greps this
// file too.

const APP = 'linesizing';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');

const LESSONS = [
  {
    tier: 'Associate',
    title: 'What a line-sizing engine does, and what it refuses',
    body: 'This engine sizes ONE line. A system of lines that share a header is a network solve, the multiphase half is not here at all, and every state the method has no answer for comes back as an object carrying an error.',
  },
  {
    tier: 'Associate',
    title: 'Velocity, Reynolds and the friction factor',
    body: 'Bore to area to velocity, the Reynolds number in field units, the two branches the engine draws, and the band between them that has no honest correlation.',
  },
  {
    tier: 'Associate',
    title: 'The liquid line, three losses kept apart',
    body: 'Darcy-Weisbach, the velocity head, fittings as a resistance sum, elevation as a static column, and why the three are returned separately.',
  },
  {
    tier: 'Associate',
    title: 'The erosional limit as a sizing criterion',
    body: 'A ceiling on velocity rather than a pressure drop, the c factor as an input, density as the whole of the limit, and the largest rate a bore can carry.',
  },
  {
    tier: 'Associate',
    title: 'Choosing a bore',
    body: 'The same duty across every schedule bore, the pressure drop against the velocity, and two defensible rules that name two different pipes.',
  },
  {
    tier: 'Associate',
    title: 'The Associate reading',
    body: 'One line end to end, all of it closed form, and what the next tier changes.',
  },
  {
    tier: 'Professional',
    title: 'A gas line is not a liquid line',
    body: 'Why the driving group is the difference of the SQUARES, the base conditions the published forms are stated at, and why that base is not atmospheric.',
  },
  {
    tier: 'Professional',
    title: 'The four transmission forms',
    body: 'Weymouth, Panhandle A, Panhandle B and General Flow on one line, their diameter exponents measured out of the engine, and the spread between them.',
  },
  {
    tier: 'Professional',
    title: 'The elevation adjustment',
    body: 'The exponential group every form shares, the equivalent length factor, and the two things a hill does that are not the same thing.',
  },
  {
    tier: 'Professional',
    title: 'The outlet pressure',
    body: 'A bisection with no closed form, and the CEILING its bracket ends at: the inlet over the square root of the elevation factor, which sits above the inlet on a descent and below it on a climb.',
  },
  {
    tier: 'Professional',
    title: 'Marching a profile',
    body: 'Segment by segment, the station list, the march against one shot, the fittings a traverse drops, and the refusal that hands back its own evidence.',
  },
  {
    tier: 'Professional',
    title: 'The Professional reading',
    body: 'A trunk end to end, and a spread wide enough that the form is a bigger decision than the bore.',
  },
  {
    tier: 'Expert',
    title: 'The wall a code demands',
    body: 'Barlow with design factors, four location classes against a flat factor, the joint factor and the temperature derate, the corrosion allowance, and the rating read back.',
  },
  {
    tier: 'Expert',
    title: 'The pig and what it pushes',
    body: 'Line volume, the holdup that is an INPUT and not a result, the swept volume, the run, and the interval that keeps a slug inside its catcher.',
  },
  {
    tier: 'Expert',
    title: 'Where the correlations stop',
    body: 'The transition band, Colebrook past its published roughness, the friction law hidden in a transmission constant, four forms with no regime check, and two iterations that never report convergence.',
  },
  {
    tier: 'Expert',
    title: 'What a refusal is',
    body: 'The contract, an object carrying an error and never a throw or a bare number, the three returns outside that contract on purpose, and the boundary either side of every guard.',
  },
  {
    tier: 'Expert',
    title: 'What the method does not know',
    body: 'The held items, the synthetic goldens, one barrel measured out of two modules, and the two-phase half that is not in this engine at all.',
  },
  {
    tier: 'Expert',
    title: 'The Expert reading',
    body: 'One pipe, three questions, and not one of the answers derivable from the other two.',
  },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Line Sizing & Hydraulics: Learning Mode locked">
      <p>
        Enrol in the Line Sizing & Hydraulics course and activate your account to open this app in Learning Mode.
        It takes one liquid line, one gas trunk and one pipe, and sizes them honestly: which limit binds first, which
        equation is still in its domain where you are standing, and which figure on the page is a calculation rather
        than a table somebody copied.
      </p>
    </LearningModeGate>
  );
}

const LineSizingLearningPage = () => {
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

  // Engine calls through the teaching lab: one liquid line, one gas trunk and
  // one pipe read three ways, all on the teaching fields.
  const lab = useMemo(() => {
    try {
      return {
        a: associateReading(), p: professionalReading(), e: expertReading(), held: heldItems(),
      };
    } catch {
      return null;
    }
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
      <Helmet><title>Line Sizing & Hydraulics (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Gauge className="h-7 w-7 text-[#BFFF00]" /> Line Sizing & Hydraulics
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                A line is sized by the limit that binds first, and every one of those limits is a different equation
                with a different domain. The teaching crude line carries {six(lab.a.qBpd)} bpd through
                {' '}{six(lab.a.idIn)} in of bore at {six(lab.a.vFtS)} ft/s, a Reynolds number of {four(lab.a.re)},
                which is {lab.a.regime}; the friction factor is {six(lab.a.f)} and the pipe costs
                {' '}{six(lab.a.dpFrictionPsi)} psi, against an erosional ceiling of {six(lab.a.erosionalFtS)} ft/s that
                it uses {six(lab.a.usedFractionDerived)} of. Compress the fluid and the method changes shape: the
                teaching gas trunk reads {four(lab.p.weymouthScfd)} scfd through one published form and
                {' '}{four(lab.p.panhandleBScfd)} through another on identical inputs, and asked for
                {' '}{four(lab.p.targetScfd)} scfd it delivers at {six(lab.p.targetP2Psia)} psia out of a solver with no
                closed form at all. The same pipe read as a pressure envelope needs {six(lab.e.class3RequiredIn)} in of
                wall at one location class and {six(lab.e.class1RequiredIn)} in at another, and read as a volume it
                holds {four(lab.e.lineVolumeBbl)} bbl and delivers {four(lab.e.nominalSweptBbl)} bbl to whatever is
                waiting at the end every {four(lab.e.nominalIntervalDays)} days. This course is where each of those
                numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                One crude export line, one gas trunk, one pipe read three ways, and the published golden cases, on the
                vendored line-hydraulics, choke and pipe-schedule engines. Every number on this page and inside every
                panel is a return value from those engines, pinned by a test file against the teaching digest. Liquid
                work is in bpd, inches of bore and feet of length; gas work is in scfd and miles, because that is the
                unit the published transmission forms are stated in. Nothing in this course is a distribution, so no
                percentile label belongs anywhere in it.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LESSONS.map((l, i) => (
                <div key={l.title} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-0">{l.tier}, module {(i % 6) + 1}</p>
                  <p className="text-white text-sm font-medium mb-0">{l.title}</p>
                  <p className="text-xs text-gray-400 mt-1 mb-0">{l.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}
              >
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'beginner' && <LiquidExplorer />}
          {tier === 'intermediate' && <GasLineExplorer />}
          {tier === 'advanced' && <WallPigExplorer />}
          {tier === 'advanced' && <GasLineExplorer initialMode="ceiling" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not know, and what it reports that it does not mean</CardTitle>
              <CardDescription>
                This engine sizes ONE line. A system of lines that share a header is a network solve and lives
                elsewhere; the multiphase half is not here at all, so wherever a holdup is needed it is taken as an
                INPUT; the published golden cases are synthetic, written by an independent oracle from the same physics
                rather than measured on a real pipeline. Five quantities are held for literature verification and are
                taught as limits rather than as answers.
                {lab && (
                  <ul className="mt-2 space-y-1">
                    {lab.held.items.map((h) => (
                      <li key={h.id} className="text-xs text-gray-400">{h.title}. {h.note}</li>
                    ))}
                  </ul>
                )}
                None of this is a mechanical design. It is the arithmetic under one, and the judgement stays with the
                engineer who signs it.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!(!hasDeepCourse(APP, tier)
                || courseProgress?.capstone?.unlocked === true
                || courseProgress?.capstone?.passed === true
                || actualRole === 'super_admin') ? (
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
                          <Input
                            type="number"
                            step="any"
                            value={answers[f.key] ?? ''}
                            onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
                            className="bg-gray-700 text-white border-gray-600 h-8 text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={submit}
                      disabled={submitting || !capstone}
                      className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
                    >
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
                          <p className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-[#BFFF00]" />
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

export default LineSizingLearningPage;
