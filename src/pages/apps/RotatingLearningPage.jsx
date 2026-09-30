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
  Loader2, Cog, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import PumpExplorer from '@/components/course/panels/rotating/PumpExplorer';
import SuctionExplorer from '@/components/course/panels/rotating/SuctionExplorer';
import CompressorExplorer from '@/components/course/panels/rotating/CompressorExplorer';
import {
  dutyPointSolved, powerHeadPressure, trainAndCooling, heldItems,
} from '@/components/course/panels/rotating/rotatingLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Rotating Equipment course page. Every number it prints is a return value
// from the teaching lab (rotatingLab), which is a return value from the
// vendored Pump Station Designer and Compressor Station Designer engines on the
// teaching machines OKONO P-1201 and SOKU K-2101. It never reads the capstone:
// panelCapstoneGuard.test.js greps this file too.

const APP = 'rotating';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const count = (v) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 }) : 'none');

const LESSONS = [
  {
    tier: 'Associate',
    title: 'What these engines size, and what they refuse',
    body: 'Two machines and two modules, the scope seam said out loud, every refusal message verbatim, and the five exports that return a bare number.',
  },
  {
    tier: 'Associate',
    title: 'Two curves, and why neither has an operating point',
    body: 'The least-squares quadratic through catalogue points, what its R squared means and when it is null, the conditioning behind the solve, and the droop flag.',
  },
  {
    tier: 'Associate',
    title: 'The duty point, solved',
    body: 'The intersection, the report the solve leaves behind, the case that makes its convergence flag false, and the three refusals that are real answers.',
  },
  {
    tier: 'Associate',
    title: 'Power, head and pressure',
    body: 'Hydraulic, brake and motor input power, the two field packagings measured out of the engine, and the single water density they both imply.',
  },
  {
    tier: 'Associate',
    title: 'Where the duty landed',
    body: 'The four regions either side of best efficiency flow, what each costs in the engine\'s own words, the boundaries, and the note that names its own limit.',
  },
  {
    tier: 'Associate',
    title: 'The Associate reading',
    body: 'One pump end to end, the capstone worked, and what the suction side changes.',
  },
  {
    tier: 'Professional',
    title: 'NPSH available, from the real suction side',
    body: 'The pressure head over the vapour pressure, the static height and the suction friction, the flashing warning, and why an available figure decides nothing alone.',
  },
  {
    tier: 'Professional',
    title: 'The margin, and what a check does not check',
    body: 'The customary rule measured out of the engine, the three severities, why bare equality is already cavitation, and a verdict with no input to give one on.',
  },
  {
    tier: 'Professional',
    title: 'A speed change and a trim are not the same thing',
    body: 'The exact cube law printed as a subtraction, ideal beside real, the efficiency the trim implies, and the two decimal boundaries with the slack under them.',
  },
  {
    tier: 'Professional',
    title: 'An affinity law applied to a duty point is not a new duty point',
    body: 'The system curve does not move when the machine changes, so the answer is a new intersection. Both are shown, labelled, with the distance between them.',
  },
  {
    tier: 'Professional',
    title: 'Two pumps, and a catalogue curve that is a water curve',
    body: 'Parallel adds flow at equal head and series adds head at equal flow, and the Hydraulic Institute correction with its factors and its two warnings.',
  },
  {
    tier: 'Professional',
    title: 'The Professional reading',
    body: 'One station judged on its suction side, its proposed change, and its second machine.',
  },
  {
    tier: 'Expert',
    title: 'A stage is not a pump',
    body: 'The polytropic exponent against the isentropic one, the discharge temperature that follows, compressibility at both ends, both heads, and an identity that is not a check.',
  },
  {
    tier: 'Expert',
    title: 'The stage count, and the limit that governs',
    body: 'The equal-ratio rule, the discharge-temperature limit, the engine naming which one bound, the twelve-stage cap and the refusal that carries its evidence.',
  },
  {
    tier: 'Expert',
    title: 'The train, its cooling, and the limit that buys the stages',
    body: 'Equal ratios chained, interstage cooling as a real exchanger duty, a hotter approach paid for in machines, and the trade that reverses across a stage count.',
  },
  {
    tier: 'Expert',
    title: 'The machine, the driver and the fuel',
    body: 'Actual inlet volume and why it falls with pressure, the four screening branches, fuel taken out of the stream being compressed, and the heat rate the first law refuses below.',
  },
  {
    tier: 'Expert',
    title: 'What a refusal is, and where each guard turns over',
    body: 'A returned object naming the input that is wrong, the bare-number contract, four faults that used to share one sentence, and the validity window one module declares.',
  },
  {
    tier: 'Expert',
    title: 'The Expert reading',
    body: 'A pump and a compressor together, and everything this package holds for literature rather than answering.',
  },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Rotating Equipment: Learning Mode locked">
      <p>
        Enrol in the Rotating Equipment course and activate your account to open this app in Learning Mode.
        It takes one injection pump and one gas booster train and works them honestly: where the operating point came
        from, which limit set the answer, what the machine costs to drive, and which figure on the page is a
        calculation rather than a custom somebody copied.
      </p>
    </LearningModeGate>
  );
}

const RotatingLearningPage = () => {
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

  // Engine calls through the teaching lab: one solved duty, its power chain and
  // one gas booster train, all on the teaching machines.
  const lab = useMemo(() => {
    try {
      return {
        d: dutyPointSolved(), p: powerHeadPressure(), t: trainAndCooling(), held: heldItems(),
      };
    } catch {
      return null;
    }
  }, []);

  const watermark = gate.quota?.export_watermark;

  const submit = async () => {
    setSubmitting(true);
    try {
      const numeric = buildCapstoneAnswers(capstone?.fields, answers);
      const res = await submitCapstone(APP, tier, numeric);
      setResult(res);
      if (res.passed && res.certificate_number) {
        toast({ title: `Capstone passed. ${CERT_LABELS[res.tier] || 'Associate'} certified!`, description: res.certificate_number, className: 'border-pl-success/40 bg-pl-success-bg text-pl-success-text' });
      } else if (res.passed) {
        toast({ title: 'Passed: you were already certified', className: 'border-pl-success/40 bg-pl-success-bg text-pl-success-text' });
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
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-pl-primary-text" /></div>;
  }
  if (!gate.allowed) return <ScopeGate />;

  return (
    <>
      <Helmet><title>Rotating Equipment (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <Cog className="h-7 w-7 text-pl-accent-text" /> Rotating Equipment
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-pl-muted">
                A rotating machine has no operating point until it is connected to something. The teaching pump OKONO
                P-1201 meets its stated station at {six(lab.d.qGpm)} gpm and {six(lab.d.headFt)} ft, which the engine
                SOLVES rather than takes: it reports the bracket it finished on, the residual there, {count(lab.d.iterations)} halvings,
                and a convergence flag that comes back {String(lab.d.converged)}. Every figure that follows hangs off
                that one number. At the duty the pump takes {six(lab.p.brakeHp)} brake hp and draws
                {' '}{six(lab.p.motorInputKw)} kW at the motor, and the head makes {six(lab.p.dischargePsi)} psi on this
                brine. The gas booster train SOKU K-2101 needs {count(lab.t.stages.length)} stages, takes
                {' '}{four(lab.t.totalBrakeHp)} brake hp and rejects {four(lab.t.totalCoolingMMBtuHr)} MMBtu per hr
                between them, and its hottest stage leaves {four(lab.t.roomDerivedF)} degF of room under the limit it
                was staged against. This course is where each of those numbers comes from, and which limit set it.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                One injection pump, one gas booster train and the published golden cases, on the vendored Pump Station
                Designer and Compressor Station Designer engines. Every number on this page and inside every panel is a
                return value from those engines, pinned by a test file against the figures the lessons quote. Pump work is in gpm
                and feet of head, gas work in MMscfd and psia and degF, and power in horsepower and kilowatts. Nothing
                in this course is a distribution, so no percentile label belongs anywhere in it.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LESSONS.map((l, i) => (
                <div key={l.title} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                  <p className="text-[10px] uppercase tracking-wide text-pl-muted mb-0">{l.tier}, module {(i % 6) + 1}</p>
                  <p className="text-pl-text text-sm font-medium mb-0">{l.title}</p>
                  <p className="text-xs text-pl-muted mt-1 mb-0">{l.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)} aria-pressed={tier === t}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong hover:bg-pl-sunken'}`}
              >
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'beginner' && <PumpExplorer />}
          {tier === 'intermediate' && <SuctionExplorer />}
          {tier === 'intermediate' && <CompressorExplorer initialMode="volume" />}
          {tier === 'advanced' && <CompressorExplorer />}
          {tier === 'advanced' && <SuctionExplorer initialMode="viscosity" />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What these engines do not know, and what they report that they do not mean</CardTitle>
              <CardDescription>
                These engines size MACHINES. What the piping costs in pressure is a line-sizing question and lives
                elsewhere. There is no surge line, no surge control, no recycle valve and no anti-surge calculation
                anywhere in the package; there is no seal and no bearing calculation; there is no machine curve, no
                wheel selection, no valve dynamics and no rod loading; and there is no required-NPSH-against-flow curve,
                which is why the engine tells you to read the vendor curve at the duty flow before the suction margin
                means anything. The published golden cases are synthetic, written by an independent oracle from the same
                physics rather than measured on a real machine. Eight quantities are held for literature verification
                and are taught as limits rather than as answers.
                {lab && (
                  <ul className="mt-2 space-y-1">
                    {lab.held.items.map((h) => (
                      <li key={h.id} className="text-xs text-pl-muted">{h.title}, Section {h.section}. {h.note}</li>
                    ))}
                  </ul>
                )}
                None of this is a mechanical design. It is the arithmetic under one, and the judgement stays with the
                engineer who signs it.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!(!hasDeepCourse(APP, tier)
                || courseProgress?.capstone?.unlocked === true
                || courseProgress?.capstone?.passed === true
                || actualRole === 'super_admin') ? (
                  <div className="rounded-md border border-pl-border bg-pl-sunken p-4 text-sm text-pl-text flex items-start gap-2">
                    <Lock className="h-4 w-4 text-pl-accent-text mt-0.5 shrink-0" />
                    <p className="mb-0">
                      The capstone unlocks after the course: finish the lessons, pass each module quiz
                      and the final exam, then submit here.{' '}
                      <Link to={`/dashboard/apps/${APP}/course/${tier}`} className="text-pl-primary-text hover:underline">
                        Open the course
                      </Link>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {(capstone?.fields || []).map((f) => (
                        <div key={f.key}>
                          <Label className="text-pl-muted text-xs mb-1 block">{f.label} ({f.unit})</Label>
                          <Input
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            value={answers[f.key] ?? ''}
                            onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
                            className="h-8 text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={submit}
                      disabled={submitting || !capstone}
                      className="font-semibold"
                    >
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GraduationCap className="mr-2 h-4 w-4" />}
                      Submit for grading
                    </Button>
                  </>
                )}

              {result && (
                <div className={`rounded-md border p-4 ${result.passed ? 'border-pl-success/30 bg-pl-success-bg' : 'border-pl-danger/30 bg-pl-danger-bg'}`}>
                  {result.passed ? (
                    <>
                      <p className="text-pl-success-text font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" /> Passed ({result.score}/{result.max_score})
                      </p>
                      {result.certificate_number ? (
                        <div className="mt-2 text-sm text-pl-text space-y-1">
                          <p className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-pl-accent-text" />
                            {CERT_LABELS[result.tier] || 'Associate'} certificate <span className="font-mono text-pl-accent-text">{result.certificate_number}</span> issued.
                            {result.tier === 'expert' && ' Your 50% Suite discount code is on your certificates page.'}
                          </p>
                          <div className="flex gap-3">
                            <Link to="/dashboard/certificates" className="text-pl-primary-text hover:underline inline-flex items-center gap-1">
                              My certificates <ArrowRight className="h-3 w-3" />
                            </Link>
                            <a href={verificationUrl(result.verify_code)} target="_blank" rel="noreferrer" className="text-pl-muted hover:underline">
                              Public verification
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-pl-muted">You were already certified for this tier.</p>
                      )}
                    </>
                  ) : (
                    <p className="text-pl-danger-text font-medium flex items-center gap-2">
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

export default RotatingLearningPage;
