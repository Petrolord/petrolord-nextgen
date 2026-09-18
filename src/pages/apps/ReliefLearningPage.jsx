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
  Loader2, Flame, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import SizingExplorer from '@/components/course/panels/relief/SizingExplorer';
import FireDrumExplorer from '@/components/course/panels/relief/FireDrumExplorer';
import BlowdownExplorer from '@/components/course/panels/relief/BlowdownExplorer';
import {
  associateReading, professionalReading, blowdownMarch, pointSource, heldItems,
} from '@/components/course/panels/relief/reliefLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Relief & Flare Systems course page. Every number it prints is a return
// value from the teaching lab (reliefLab), which is a return value from the
// vendored pressure relief engine on the teaching streams ORUBIRI, AKASO,
// TEBIDABA, BENISEDE, ODIDI and AFIESERE. It never reads the capstone, which
// runs different vessels entirely: panelCapstoneGuard.test.js greps this file
// too, for a graded answer in any of four renderings and for a capstone vessel
// by name.
//
// THE READERS RUN IN AN EFFECT, so the first paint carries no engine number and
// the page says so where the numbers will be. A page that computed during render
// would print engine values into server-rendered markup.
//
// NO PERCENTILE. Nothing in this course is a distribution.

const APP = 'relief';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

/** The empty state the page carries until the lab has answered. */
export const PAGE_EMPTY_STATE = 'The teaching figures on this page are read from the vendored pressure relief engine and appear once it answers.';

const LESSONS = [
  {
    tier: 'Associate',
    title: 'What a Relief Valve Is Sized For',
    body: 'Four questions over one facility, what this engine refuses, the three pressures a sizing calculation stands on, and the three different quantities this platform calls back pressure.',
  },
  {
    tier: 'Associate',
    title: 'Gas and Vapour',
    body: 'The coefficient C and the critical pressure ratio, both functions of the isentropic exponent alone, the branch the pressure at the valve outlet decides, and what F2 replaces.',
  },
  {
    tier: 'Associate',
    title: 'Liquid',
    body: 'The certified valve equation, a viscosity correction that needs the area to find the Reynolds number that sets the area, and where the correction stops helping.',
  },
  {
    tier: 'Associate',
    title: 'Steam',
    body: 'The steam equation and its leading constant, the Napier correction and the pressure it starts at, both ends of a published range, and a superheat factor the engine types.',
  },
  {
    tier: 'Associate',
    title: 'From an Area to a Letter',
    body: 'Fourteen standard orifices that are not a geometric ladder, the smallest one that will do, what a margin is worth, and the refusal past the largest.',
  },
  {
    tier: 'Associate',
    title: 'The Associate Reading',
    body: 'One train, three fluids, and the tier question: of every number in front of you, which correction did the engine work out and which one did somebody copy off a chart.',
  },
  {
    tier: 'Professional',
    title: 'Where the Relief Load Comes From',
    body: 'Four scenarios and the one this engine computes for itself, actual cubic feet and the base they came from, and what the engine leaves to the caller.',
  },
  {
    tier: 'Professional',
    title: 'The Wetted Area',
    body: 'An exact circular segment, half full and why that one case is special, the same vessel standing up, and the height the wetted area stops at.',
  },
  {
    tier: 'Professional',
    title: 'The Pool Fire Duty',
    body: 'Two published constants and the one answer that chooses between them, an exponent below one, the environment credit, and a duty turned into pounds an hour.',
  },
  {
    tier: 'Professional',
    title: 'The Fire Case End to End',
    body: 'Geometry to duty to load to letter, the larger allowance a fire case gets, a latent heat that is collapsing, and what moves the letter.',
  },
  {
    tier: 'Professional',
    title: 'The Knockout Drum',
    body: 'Drag against weight iterated, three regimes in one fit, the length a candidate diameter demands, and L over D as a judgment with two measured edges.',
  },
  {
    tier: 'Professional',
    title: 'The Professional Reading',
    body: 'A load, a drum and a letter, and the tier question: what is a stated fraction a fraction OF.',
  },
  {
    tier: 'Expert',
    title: 'A Vessel Emptying Itself',
    body: 'Mass out through a choked orifice and isentropic inside, the discharge coefficient and the one beside it, and a trajectory the answer is read off.',
  },
  {
    tier: 'Expert',
    title: 'The Customary Depressuring Time',
    body: 'Where the customary time comes from, reading a time off a curve, the orifice that buys it, and a cold end the orifice cannot move.',
  },
  {
    tier: 'Expert',
    title: 'A Step Size Is an Answer',
    body: 'Refining the step until the answer stops moving, a time quantised to one step, and what a march owes the reader about its own numerics.',
  },
  {
    tier: 'Expert',
    title: 'The Point Source, Twice',
    body: 'One relation asked in both directions, where the setback is taught instead, and two engines in this package exporting the same four rows.',
  },
  {
    tier: 'Expert',
    title: 'What the Method Does Not Know',
    body: 'Computed, typed and never checked, a published case that cannot discriminate, an input that changes nothing, and an oracle that agreed with itself.',
  },
  {
    tier: 'Expert',
    title: 'What Was Repaired, and What Was Not',
    body: 'The one module whose subject is what this engine used to do, each item a general lesson with the evidence the engine returns today beside it.',
  },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Relief & Flare Systems: Learning Mode locked">
      <p>
        Enrol in the Relief & Flare Systems course and activate your account to open this app in Learning Mode.
        A relief system is sized by choosing the case, because every number this engine returns is the size that one
        chosen case demands, and the engine never chooses the case. The discipline is picking the governing scenario and
        then knowing, of every number the answer rests on, whether the engine worked it out or somebody copied it off a
        chart.
      </p>
    </LearningModeGate>
  );
}

const ReliefLearningPage = () => {
  const { toast } = useToast();
  const { actualRole } = useRole();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [courseProgress, setCourseProgress] = useState(null);
  const [capstone, setCapstone] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [labReady, setLabReady] = useState(false);

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

  // THE ENGINE CALLS RUN IN AN EFFECT rather than during render, so the first paint of
  // this page carries no engine value at all.
  useEffect(() => { setLabReady(true); }, []);
  const lab = useMemo(() => {
    if (!labReady) return null;
    try {
      return {
        a: associateReading(),
        p: professionalReading(),
        b: blowdownMarch(),
        r: pointSource(),
        held: heldItems(),
      };
    } catch {
      return null;
    }
  }, [labReady]);

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

  const gas = lab ? lab.a.routes[0] : null;
  const liquid = lab ? lab.a.routes[1] : null;
  const steam = lab ? lab.a.routes[2] : null;

  return (
    <>
      <Helmet><title>Relief & Flare Systems (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Flame className="h-7 w-7 text-[#BFFF00]" /> Relief & Flare Systems
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab ? (
              <p className="mt-1 text-gray-400">
                A relief system is sized by choosing the case, and the engine never chooses the case. Every sizing route
                here takes a relief load as an input. The gas stream ORUBIRI is choked at a critical pressure ratio of
                {' '}{six(gas.computedFactor)} and needs {six(gas.areaIn2)} in2, which is an orifice {gas.orifice} at a
                margin of {six(gas.margin)}; the viscous liquid AKASO converges on a correction of
                {' '}{six(liquid.computedFactor)} and needs {six(liquid.areaIn2)} in2; and the steam case TEBIDABA carries
                a Napier correction of {six(steam.computedFactor)} for {six(steam.areaIn2)} in2. Each of those three has
                exactly one correction the engine computed and exactly one it took off a published chart. The one route
                that computes its own load is the fire case, which takes the vessel BENISEDE from
                {' '}{four(lab.p.fire.wettedFt2)} ft2 of wetted area through {four(lab.p.fire.dutyBtuHr)} Btu/hr of pool
                fire duty to {four(lab.p.fire.loadLbHr)} lb/hr and an orifice {lab.p.fire.orifice}, while the drum ODIDI
                behind it needs {six(lab.p.drum.requiredLengthFt)} ft of length at an L over D of
                {' '}{six(lab.p.drum.ld)} to keep liquid out of the header. And the vessel AFIESERE depressures in
                {' '}{six(lab.b.timeS)} s to a final temperature of {six(lab.b.finalTR)} degR, against a closed-form
                integral of the same balance at {six(lab.b.closedFormS)} s, a ratio of
                {' '}{twelve(lab.b.closedFormRatioDerived)}. The flare it discharges to puts
                {' '}{six(lab.r.flare.intensityAtStatedKWm2)} kW/m2 on the fence at the stated distance. This course is
                where each of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            ) : (
              <p className="mt-1 text-gray-400">{PAGE_EMPTY_STATE}</p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                One gas case, one liquid case, one steam case, one vessel in a pool fire, one flare knockout drum, one
                vessel depressuring into a flare, and the published golden cases, on the vendored pressure relief engine.
                Every number on this page and inside every panel is a return value from that engine, pinned by a test
                file against the teaching digest. Flows are in lb/hr for gas and steam and gpm for liquid, pressures in
                psia except where a row says psig, temperatures in degR, areas in in2, wetted areas in ft2, duties in
                Btu/hr, lengths in ft, times in s, distances in m and radiant flux in kW/m2. Back pressure here always
                means the pressure at the relief valve OUTLET. Nothing in this course is a distribution, so no percentile
                label belongs anywhere in it.
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

          {tier === 'beginner' && <SizingExplorer />}
          {tier === 'intermediate' && <FireDrumExplorer />}
          {tier === 'intermediate' && <SizingExplorer initialMode="ladder" />}
          {tier === 'advanced' && <BlowdownExplorer />}
          {tier === 'advanced' && <FireDrumExplorer initialMode="drum" />}
          {tier === 'advanced' && <SizingExplorer initialMode="kv" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not know, and what it keeps to itself</CardTitle>
              <CardDescription>
                This engine sizes a pressure relief device and the flare system behind it. There is no scenario selection
                in it, no dynamic header network, no two-phase relief, no cooldown or no-touch time and no metallurgy. A
                relief WELL is a drilling subject and belongs to another course; critical flow through a gas lift port
                belongs to Gas Lift; a droplet terminal velocity belongs twice over, to Gas Well Deliquification and to
                Separation; cooldown and no-touch time belong to Flow Assurance; and the flare setback and the four
                customary allowable intensities belong to Separation and Slug Catching, which grades a setback of its own.
                {lab && (
                  <>
                    {' '}
                    {lab.held.notDerivedHereCount} quantities in this module are not derived here.{' '}
                    {lab.held.heldCount} are held for literature verification, {lab.held.typedCount} are published
                    charts and tables typed in as inputs, and {lab.held.statedLimitCount} is a limit the caller applies.
                    Every one of them is taught as a limit and never as an answer. {lab.held.sharedWithTheOracleCount} of
                    the held ones are shared between the engine and its validation oracle ON PURPOSE, so a green
                    published run is evidence about the sharing rather than about the number.{' '}
                    {lab.held.decisionCount} further items are stated model decisions rather than held
                    quantities.
                    <ul className="mt-2 space-y-1">
                      {lab.held.items.map((h) => (
                        <li key={h.id} className="text-xs text-gray-400">
                          {h.title}. {h.note}
                        </li>
                      ))}
                      {lab.held.decisions.map((d) => (
                        <li key={d.id} className="text-xs text-gray-400">{d.title}. {d.note}</li>
                      ))}
                    </ul>
                  </>
                )}
                None of this is a relief system design. It is the arithmetic under one, and the judgement stays with the
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

export default ReliefLearningPage;
