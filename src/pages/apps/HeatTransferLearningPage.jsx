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
  Loader2, Thermometer, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import ExchangerExplorer from '@/components/course/panels/heattransfer/ExchangerExplorer';
import CoefficientExplorer from '@/components/course/panels/heattransfer/CoefficientExplorer';
import RatingExplorer from '@/components/course/panels/heattransfer/RatingExplorer';
import {
  associateReading, professionalReading, expertReading, heldItems, e6, r4, n0,
} from '@/components/course/panels/heattransfer/heattransferLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Heat Exchange & Cooling course page. Every number it prints is a return
// value from the teaching lab (heattransferLab), which is a return value of the
// vendored heat transfer engine on the studio case, on ORON and on the teaching
// air cooler bay. It never reads the capstone: panelCapstoneGuard.test.js sweeps
// this file too, numerically, in every rendering.

const APP = 'heattransfer';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  {
    tier: 'Associate',
    title: 'What this engine rates and sizes',
    body: 'Four questions about one exchanger, a refusal that is always an object carrying its own message, and the reference area a coefficient is meaningless without.',
  },
  {
    tier: 'Associate',
    title: 'The stream and its capacity rate',
    body: 'A mass flow times a heat capacity as the whole of what a balance knows about a stream, the duty a stated outlet sets, and the basis the engine reports for it.',
  },
  {
    tier: 'Associate',
    title: 'The refusals that protect a balance',
    body: 'An outlet that moves the wrong way, a duty that crosses the streams with both temperatures handed back, and the arrangement that decides which cross test runs.',
  },
  {
    tier: 'Associate',
    title: 'The log mean driving force',
    body: 'Two ends and which two they are, the arithmetic mean the log mean sits strictly below, equal ends, and the shell reading that comes with a note attached.',
  },
  {
    tier: 'Associate',
    title: 'The surface and the tubes',
    body: 'A surface out of three numbers, the clean coefficient against the dirty one, the surface of one tube, two roundings up, and an overshoot that is always positive.',
  },
  {
    tier: 'Associate',
    title: 'The Associate reading',
    body: 'The studio case end to end on the app\'s own shipped defaults, with the tube count closing as a loop and its trail drawn settling.',
  },
  {
    tier: 'Professional',
    title: 'P, R and the correction factor',
    body: 'Two dimensionless groups off four temperatures, a factor computed from a closed form rather than read off a chart, the warning on a steep curve, and the limit as P tends to zero.',
  },
  {
    tier: 'Professional',
    title: 'Shells in series',
    body: 'The equivalent single-shell P, what a second shell buys, a bound this module declares rather than cites, and why infeasible and inefficient are different answers.',
  },
  {
    tier: 'Professional',
    title: 'The coefficient from its parts',
    body: 'Five resistances in series, the area they are referred to, the diameter ratio on the inside terms, the fouling penalty that turns out to be an identity, and the controlling term.',
  },
  {
    tier: 'Professional',
    title: 'The wall, and a limit that fixes a factor',
    body: 'The smallest of the five terms, the thin wall that has to become a flat plate, what a transcription check cannot catch, and the margin that decided a one-word verdict.',
  },
  {
    tier: 'Professional',
    title: 'The tube side film',
    body: 'Reynolds and Prandtl off a tube count, three regimes with a transition band that is refused, a laminar film that does not move with the flow, and the exponent this module declines.',
  },
  {
    tier: 'Professional',
    title: 'The Professional reading',
    body: 'The studio case again with the coefficient first, and the whole chain read from the resistance stack outward.',
  },
  {
    tier: 'Expert',
    title: 'Rating, and the other question',
    body: 'Effectiveness as a fraction of a maximum, NTU as a surface written dimensionlessly, an identity that proves nothing, two ceilings, and the arrangement that has none.',
  },
  {
    tier: 'Expert',
    title: 'Limits that discriminate',
    body: 'A capacity ratio of zero where three closed forms give one answer, what a single published case cannot find, and a golden file declared synthetic with its reason stated.',
  },
  {
    tier: 'Expert',
    title: 'The air cooler',
    body: 'A bay and the air it is given, a draft type that moves the fan by five percent, a barometer that is an input, and the cross-flow correction this bay declines to apply.',
  },
  {
    tier: 'Expert',
    title: 'The hot day',
    body: 'What a machine actually holds on a hot afternoon, four columns that do not move beside two that do, a cold day that is a capability, and the second method that agrees.',
  },
  {
    tier: 'Expert',
    title: 'What the method does not know',
    body: 'What this engine was repaired for, why a pin is not a validation, two roundings measured out of the engine itself, and two bundle rows that are identical.',
  },
  {
    tier: 'Expert',
    title: 'The Expert reading',
    body: 'The whole chain on one machine, and where this engine hands over: to a rating package for stream analysis and to a vendor for anything that becomes steel.',
  },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Heat Exchange & Cooling: Learning Mode locked">
      <p>
        Enrol in the Heat Exchange & Cooling course and activate your account to open this app in Learning Mode.
        It takes one exchanger through four questions that form a loop: what duty two streams exchange, across what
        driving force, through what coefficient, and over how much surface and how many tubes. The discipline is
        knowing which number in front of you the engine computed, which one you chose, and which one it declined to
        invent.
      </p>
    </LearningModeGate>
  );
}

const HeatTransferLearningPage = () => {
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

  // Engine calls through the teaching lab: one shell-and-tube chain read three
  // ways, and one air cooler bay rated on its worst afternoon.
  const lab = useMemo(() => {
    try {
      return {
        a: associateReading(), p: professionalReading(), x: expertReading(), held: heldItems(),
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
      <Helmet><title>Heat Exchange & Cooling (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Thermometer className="h-7 w-7 text-[#BFFF00]" /> Heat Exchange &amp; Cooling
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                An exchanger is four questions in a chain, and the chain is a LOOP. The studio case arrives with a hot
                capacity rate of {r4(lab.a.cHot)} and a cold one of {r4(lab.a.cCold)} Btu an hour per degF, which is the
                whole of what the balance knows about either stream. A stated hot outlet sets the duty at
                {' '}{r4(lab.a.qBtuHr)} Btu an hour with the cold leaving at {e6(lab.a.tcOut)} degF, and the engine names
                which stating it worked from on its own basis key, here {lab.a.basis}. That duty crosses a driving force
                of {e6(lab.a.lmtdF)} degF, which sits strictly below the arithmetic mean of the same two ends at
                {' '}{e6(lab.a.arithmeticMeanDerived)}. Through a coefficient assembled from five named resistances, U
                clean {e6(lab.p.uClean)} and U dirty {e6(lab.p.uDirty)}, the surface comes out at {e6(lab.a.areaFt2)}
                {' '}ft2, which is {n0(lab.a.nTubes)} tubes and {e6(lab.a.actualAreaFt2)} ft2 of real steel, an overshoot
                of {e6(lab.a.areaMarginPct)} percent. And the count is a loop: it settles along a trail of
                {' '}{lab.a.trail.map((n) => n0(n)).join(', ')} tubes in {n0(lab.a.iterations)} passes, because the film
                needs the count and the count needs the film. The tube-side film that sets it runs at a Reynolds number
                of {e6(lab.p.re)} and a Prandtl number of {e6(lab.p.pr)}, giving {e6(lab.p.hiBtuHrFt2F)}, while fouling
                costs {e6(lab.p.foulingPenaltyPct)} percent and the controlling term is the
                {' '}{lab.p.controlling} by a margin of {e6(lab.p.controllingMarginPct)} percent over the
                {' '}{lab.p.runnerUp}. Rated instead of sized, the teaching bay holds an effectiveness of
                {' '}{e6(lab.x.effectiveness)}, an NTU of {e6(lab.x.ntu)}, a capacity ratio of {e6(lab.x.cr)} and a UA of
                {' '}{r4(lab.x.uaBtuHrF)} at every ambient, and still delivers
                {' '}{e6(lab.x.dutyFractionAtTheDefaultCheck)} of its design duty on its check afternoon with the process
                leaving at {e6(lab.x.processOutAtTheDefaultCheck)} degF. A second and independent method puts that same
                answer at a ratio of {e6(lab.x.secondMethodRatio)}. This course is where each of those numbers comes
                from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                One shell-and-tube exchanger at the live app&apos;s own shipped defaults, one four-pass exchanger with its
                own loop, one air cooler bay with a hot afternoon to hold, and the published golden cases, on the vendored
                heat transfer engine. Every number on this page and inside every panel is a return value from that
                engine, pinned by a test file against the teaching digest. Duties, capacity rates and UA are in Btu an
                hour, temperatures and log means in degF, areas in ft2, coefficients in Btu an hour per ft2 per degF,
                resistances in hr.ft2.F per Btu, and diameters in inches. Nothing in this course is a distribution, so no
                percentile label belongs anywhere in it: the letter P here is the dimensionless temperature group and
                nothing else.
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

          {tier === 'beginner' && <ExchangerExplorer />}
          {tier === 'intermediate' && <CoefficientExplorer />}
          {tier === 'intermediate' && <ExchangerExplorer initialMode="loop" />}
          {tier === 'advanced' && <RatingExplorer />}
          {tier === 'advanced' && <CoefficientExplorer initialMode="bundle" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not know, and what it keeps to itself</CardTitle>
              <CardDescription>
                This engine rates and sizes one exchanger. There is no shell-side film coefficient from stream analysis,
                no pressure drop, no vibration check, no condensation or boiling, no fin geometry and no rigorous
                cross-flow rating. Pressure drop in a line belongs to the Pipeline and Line Sizing engine, machine work
                belongs to Rotating Equipment, and anything beyond a screening estimate on the shell side belongs to a
                dedicated rating package. The register below is the engine&apos;s own, counted by reading it rather than by
                quoting a header, and it carries {lab ? n0(lab.held.heldCount) : 'several'} entries. Every one is taught
                as a stated limit rather than as an answer, and nothing in this course grades one.
                {lab && (
                  <ul className="mt-2 space-y-1">
                    {lab.held.items.map((h) => (
                      <li key={h.id} className="text-xs text-gray-400">{h.id}. {h.note}</li>
                    ))}
                  </ul>
                )}
                {lab && (
                  <p className="mt-2 text-xs text-gray-400 mb-0">
                    Beside them sit {n0(lab.held.fittedCount)} FITTED constants, pinned by literal in the engine gate:
                    {' '}{lab.held.fitted.map((f) => `${f.key} at ${e6(f.value)}`).join(', ')}. A pin makes changing a
                    number a reviewed act instead of a silent one, which is worth having and is not evidence. NO ORACLE
                    CAN VALIDATE A FIT, so none of those five is presented as validated anywhere in this course and none
                    of them is graded. What stands in for published data here is route independence, those pins, and
                    {' '}{n0(lab.held.analyticLimits.length)} analytic limits that need no citation and that
                    discriminate. The golden file itself is declared synthetic and says why.
                  </p>
                )}
                None of this is a thermal design. It is the arithmetic under one, and the judgement stays with the
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

export default HeatTransferLearningPage;
