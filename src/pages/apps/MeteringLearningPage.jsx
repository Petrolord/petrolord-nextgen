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
import MeterRunExplorer from '@/components/course/panels/metering/MeterRunExplorer';
import ChokingExplorer from '@/components/course/panels/metering/ChokingExplorer';
import VentingExplorer from '@/components/course/panels/metering/VentingExplorer';
import WithheldExplorer from '@/components/course/panels/metering/WithheldExplorer';
import {
  meterRun, chokingMarch, venting, fireCase, heldRegister, tank,
} from '@/components/course/panels/metering/meteringLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Metering, Control Valves & Storage course page. Every number it prints is
// a return value from the teaching lab (meteringLab), which is a return value
// from the vendored metering, control valve and storage tank engines on the
// teaching facilities ABOH, BELEMA and OGBOGENE. It never reads the capstone:
// panelCapstoneGuard.test.js greps this file too.
//
// THREE ENGINES, ONE ARGUMENT. A meter run, a control valve and a tank are the
// three places on a facility where a number that looks like a measurement is
// really a design judgement with a standard behind it, and where the behaviour
// that matters lives at a boundary the ordinary equation walks straight past.
//
// WHAT IS REFUSED IS CURRICULUM. Two answers in these engines are withheld by
// name. Both are taught as limits here and NEITHER IS GRADED ANYWHERE.

const APP = 'metering';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');

const LESSONS = [
  {
    tier: 'Associate',
    title: 'One orifice run, end to end',
    body: 'What a meter run is being asked to do, every line of one result, the inch of water measured rather than typed, and a volume at the flowing density that is not a standard volume.',
  },
  {
    tier: 'Associate',
    title: 'The discharge coefficient is computed',
    body: 'Why the coefficient is never assumed, how far it moves across beta and across four decades of Reynolds number, the small bore correction, and the published range the engine warns outside of.',
  },
  {
    tier: 'Associate',
    title: 'Compressibility, and the differentials that are not flows',
    body: 'The expansibility factor and what it is worth, the specific heat ratio swept, a differential at or above the static pressure, and both ends of the sizing bracket.',
  },
  {
    tier: 'Associate',
    title: 'Permanent loss, turbine meters and straight run',
    body: 'What a differential costs that is never given back, what assuming a coefficient would cost, a gross turbine volume that says so, and a straight-run table with a refusal in it.',
  },
  {
    tier: 'Associate',
    title: 'The transmitter, and what turndown means',
    body: 'Accuracy on span against accuracy on reading, the climb down the span reading by reading, why nine to one is three to one, and where the warning fires.',
  },
  {
    tier: 'Associate',
    title: 'The uncertainty budget',
    body: 'Six terms, six sensitivities, one root sum of squares, where the differential term comes from, and why which term dominates is a result rather than a slogan.',
  },
  {
    tier: 'Professional',
    title: 'The choking boundary',
    body: 'Why a valve equation stops working when the service gets hard, where the allowable drop comes from, the march down the outlet pressure, and what sizing on the stated drop would cost.',
  },
  {
    tier: 'Professional',
    title: 'Cavitation, and the screen an empty box switched off',
    body: 'Damage begins long before the flow chokes, the index is computed on the drop the valve uses, the regime ladder rung by rung, and flashing as a different problem with a different fix.',
  },
  {
    tier: 'Professional',
    title: 'Gas sizing, and whose table the factors are',
    body: 'The pressure drop ratio and its terminal value, the expansion factor and its floor, the specific heat ratio factor, and a style table the engine says is its own.',
  },
  {
    tier: 'Professional',
    title: 'Authority, and the characteristic it chooses',
    body: 'What authority decides, the ladder and the screen it is read against, what equal percentage trim exists to cancel, and one vocabulary shared by two functions.',
  },
  {
    tier: 'Professional',
    title: 'Noise, as an indication rather than a prediction',
    body: 'What a screening band can and cannot tell you, the pressure ratio that sets the band, the stream power that caps and floors it, and what a real prediction would need.',
  },
  {
    tier: 'Professional',
    title: 'Travel, rangeability and a verdict over checks that ran',
    body: 'A valve near its seat does not control, two characteristics compared on travel, why beyond the valve is a different answer from not given, and a verdict withheld over checks that did not run.',
  },
  {
    tier: 'Expert',
    title: 'The tank, and the geometry three questions share',
    body: 'Why the shell, the venting and the losses are one module, capacity and working capacity and the exact barrel, and a fill height that cannot be negative.',
  },
  {
    tier: 'Expert',
    title: 'The shell, and which of three things governs',
    body: 'The one-foot method at two conditions, a light product that makes the water test govern, a minimum plate that is a stated input, and the crossovers found by bisecting a word.',
  },
  {
    tier: 'Expert',
    title: 'Normal venting, and which direction governs',
    body: 'Thermal and movement in each direction, one predicate computed once, why vacuum is the case that destroys tanks, and the factors the engine states and does not cite.',
  },
  {
    tier: 'Expert',
    title: 'The fire case, and the vent that is withheld',
    body: 'The wetted area and the height that counts, the heat input bands edge by edge, why the vent capacity is refused by name, and a factor of about 24 and what it would mean.',
  },
  {
    tier: 'Expert',
    title: 'Losses, and what control saves',
    body: 'The same arithmetic answering money and emissions, standing loss against working loss, a product that boils at ambient and is refused, and an input that never fed anything.',
  },
  {
    tier: 'Expert',
    title: 'The register, the refusals and the counts',
    body: 'Fifteen things these engines do not carry, every refusal and why a refusal is the useful answer, why a count with no tree and no rule is not checkable, and what you may never quote.',
  },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Metering, Control Valves & Storage: Learning Mode locked">
      <p>
        Enrol in the Metering, Control Valves & Storage course and activate your account to open this app in
        Learning Mode. It takes three engines and one argument: a meter run, a control valve and a tank are the
        three places on a facility where a number that looks like a measurement is really a design judgement with
        a standard behind it. The orifice equation is simple and its uncertainty is the subject. The valve equation
        is simple and its choking boundary is the subject. The tank shell equation is simple and venting is what
        actually destroys tanks.
      </p>
    </LearningModeGate>
  );
}

const MeteringLearningPage = () => {
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

  // Engine calls through the teaching lab: one meter run, one valve marched
  // across its choking boundary, and one tank breathing in both directions.
  const lab = useMemo(() => {
    try {
      return {
        run: meterRun(),
        valve: chokingMarch(),
        tankFigures: tank(),
        vent: venting(),
        fire: fireCase(),
        register: heldRegister(),
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
      <Helmet><title>Metering, Control Valves & Storage (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Gauge className="h-7 w-7 text-[#BFFF00]" /> Metering, Control Valves & Storage
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && !lab.run.refused && (
              <p className="mt-1 text-gray-400">
                Three engines and one argument. The teaching meter run ABOH sits at a beta of {six(lab.run.beta)},
                inside the range the flange-tap correlation is published for, and the engine computes its discharge
                coefficient as {six(lab.run.cd)} rather than assuming one. It passes {four(lab.run.massLbHr)} lb an
                hour, and the budget underneath that number puts the total uncertainty at
                {' '}{six(lab.run.budget.totalUncertaintyPct)} percent of flow with {lab.run.budget.dominant} ahead of
                {' '}{lab.run.budget.runnerUp}. The teaching valve BELEMA begins to choke at an outlet pressure of
                {' '}{six(lab.valve.chokeEdge.at)} psia, found by bisecting the engine&apos;s own flag, and past that
                point the allowable drop of {six(lab.valve.atChoke.dpAllowablePsi)} psi is all the valve can use
                however far the outlet falls. The teaching tank OGBOGENE holds {four(lab.tankFigures.nominalBbl)} bbl,
                breathes {four(lab.vent.outbreathingScfh)} scfh out against {four(lab.vent.inbreathingScfh)} scfh in,
                and the engine returns {lab.vent.governing} as the governing case. In a fire it takes
                {' '}{four(lab.fire.qBtuHr)} Btu an hour over {four(lab.fire.areaFt2)} ft2 of wetted shell, and the vent
                capacity that duty is for is WITHHELD. This course is where each of those numbers comes from, and why
                the last one is missing on purpose.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                One orifice meter run, one control valve marched across its choking boundary and one fixed-roof tank
                breathing in both directions, on the vendored metering, control valve and storage tank engines. Every
                number on this page and inside every panel is a return value from those engines, pinned by a test file
                against the figures the lessons quote. Bores and plate are in inches, differentials in inches of water and psi,
                pressures in psia, rates in gpm and scfh, tank volumes in barrels, venting in scfh of air and fire
                duties in Btu an hour. Every comparison between two figures is printed as both values, their difference
                and their ratio, because a comparison that is not computed is not asserted. Nothing in this course is a
                distribution, so no percentile label belongs anywhere in it.
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

          {tier === 'beginner' && <MeterRunExplorer />}
          {tier === 'beginner' && <WithheldExplorer initialMode="straight" />}
          {tier === 'intermediate' && <ChokingExplorer />}
          {tier === 'intermediate' && <ChokingExplorer initialMode="march" />}
          {tier === 'advanced' && <VentingExplorer />}
          {tier === 'advanced' && <WithheldExplorer />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these engines do not carry, and the two they refuse outright</CardTitle>
              <CardDescription>
                These three engines size a meter run, a control valve and a tank. Every row below is the engine&apos;s
                own sentence about something it does not carry or does not cite, fetched by calling the engine rather
                than typed onto this page. Two of them are outright refusals: the straight-run requirement for two
                elbows in different planes, and the relation that would turn a fire duty into a required vent capacity.
                The second is the one that matters most, because the two plausible forms of it differ by a factor of
                about 24 and an emergency vent sized 24 times too small is how a tank is destroyed. Both are taught as
                limits and NEITHER IS GRADED ANYWHERE IN THIS COURSE.
                {lab && (
                  <ul className="mt-2 space-y-1">
                    {lab.register.rows.map((h) => (
                      <li key={h.id} className="text-xs text-gray-400">
                        <span className={h.refusal ? 'text-red-300' : 'text-amber-300'}>{h.id}</span>
                        {' '}{h.item}. {h.words}
                      </li>
                    ))}
                  </ul>
                )}
                None of this is a metering, valve or tank design. It is the arithmetic under one, and the judgement
                stays with the engineer who signs it.
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

export default MeteringLearningPage;
