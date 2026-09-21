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
  Loader2, HardHat, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import ReleaseExplorer from '@/components/course/panels/consequence/ReleaseExplorer';
import FireExplorer from '@/components/course/panels/consequence/FireExplorer';
import HarmExplorer from '@/components/course/panels/consequence/HarmExplorer';
import {
  gasTeaching, plumeTeaching, sepTeaching, yellowBookPoolFire, blastTeaching, STREAMS,
} from '@/components/course/panels/consequence/consequenceLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Consequence Modelling course page, the fourth course of the academy's HSE
// module. Every number it prints is a return value from the teaching lab
// (consequenceLab), which is a return value from the vendored consequence
// engine on the teaching streams or the published worked cases in the vendored
// golden. It never reads the capstone: panelCapstoneGuard.test.js and
// consequenceLab.test.js both grep this file.

const APP = 'consequence';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What a consequence model computes', body: 'Effects before frequencies, units carried in every name, a result or a refusal, and the sources behind each model.' },
  { tier: 'Associate', title: 'Liquid through a hole', body: 'Bernoulli through a hole, the static head and the pressure above the liquid, and when nothing flows out.' },
  { tier: 'Associate', title: 'Gas through a hole', body: 'Choked and subsonic, the critical pressure ratio, and a ratio exactly at the boundary.' },
  { tier: 'Associate', title: 'Pools and evaporation', body: 'A pool on a bund floor, a pool of stated thickness, a bund that overtops, and Mackay and Matsugu.' },
  { tier: 'Associate', title: 'The Gaussian plume', body: 'A continuous release, the Pasquill-Gifford classes and the Briggs sigmas, reflection at the ground, ppm and mg/m3.' },
  { tier: 'Associate', title: 'How far the plume reaches', body: 'Off the centreline and above the ground, the distance to a concentration, and three states.' },
  { tier: 'Professional', title: 'How fast a pool burns', body: 'The solid flame model, the Babrauskas burning flux, when the diameter stops mattering, and Burgess.' },
  { tier: 'Professional', title: 'The flame length', body: 'Thomas in still air and with wind, the characteristic wind speed, and the scaled wind speed held at one.' },
  { tier: 'Professional', title: 'Tilt and surface emissive power', body: 'The flame tilt, the Froude and Reynolds numbers, and three surface emissive powers that disagree.' },
  { tier: 'Professional', title: 'The view factor', body: 'A target and a cylinder, the vertical, horizontal and maximum view factors, and a flame over the target refused.' },
  { tier: 'Professional', title: 'Transmissivity and the heat flux', body: 'The Bagster fit and its range, the heat flux as a product, the distance to a heat flux, and the seam with other courses.' },
  { tier: 'Professional', title: 'A published pool fire, reproduced', body: 'The Yellow Book pool fire step by step, the errata in the worked example, and the refusals of the fire half.' },
  { tier: 'Expert', title: 'TNT and the scaled distance', body: 'The TNT equivalent mass, cube root scaling, the Kinney and Graham overpressure and the range the fit is used over.' },
  { tier: 'Expert', title: 'The blast field', body: 'Overpressure against distance, the distance for an overpressure, and printed constants against a computed column.' },
  { tier: 'Expert', title: 'Probits', body: 'A probit and a probability, the printed table, thermal probits and the four thirds, and the overpressure probit.' },
  { tier: 'Expert', title: 'Toxic probits', body: 'The toxic load, two sources for one substance, a preset in the other unit, and a concentration that changes.' },
  { tier: 'Expert', title: 'What the engine does not do', body: 'Releases, fires, blasts and harm it does not model, the single route quantities, and the approximate inverse probit.' },
  { tier: 'Expert', title: 'Judgement, end to end', body: 'From release to harm, what belongs to other courses, and the consequence note.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Consequence Modelling: Learning Mode locked">
      <p>
        Enrol in the Consequence Modelling course and activate your account to open this app in Learning Mode. A
        consequence model turns a loss of containment into physical effects, so the course teaches how much gets out
        and where it goes, what a fire radiates, and who is hurt by a fire, a blast or a toxic cloud, and grades each
        tier on its own question with numbers the engine returns.
      </p>
    </LearningModeGate>
  );
}

const ConsequenceLearningPage = () => {
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

  // Engine calls through the teaching lab, on the teaching streams only.
  const lab = useMemo(() => {
    try {
      return {
        g: gasTeaching(), p: plumeTeaching(), s: sepTeaching(), y: yellowBookPoolFire(), b: blastTeaching(),
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
      <Helmet><title>Consequence Modelling (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <HardHat className="h-7 w-7 text-[#BFFF00]" /> Consequence Modelling
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                A methane line through a {STREAMS.AMENAM_GAS.holeDiameterM} m hole at {lab.g.rows[4].upstreamPressurePa} Pa
                releases {six(lab.g.rows[4].massRateKgS)} kg/s, {lab.g.rows[4].regime}. A carbon monoxide release of
                {' '}{STREAMS.UBIT.massRateKgS} kg/s in a {STREAMS.UBIT.windSpeedMS} m/s wind reads
                {' '}{six(lab.p.distances[2].concentrationMgM3)} mg/m3 on the centreline {lab.p.distances[2].downwindDistanceM} m
                downwind in neutral weather. A heptane bund fire can be given a surface emissive power of
                {' '}{six(lab.s.mudan)} or {six(lab.s.soot)} W/m2 depending on the method named, and the Yellow Book&apos;s own
                pool fire reproduces to {six(lab.y.heatFluxWM2)} W/m2 at its target. A {STREAMS.BONGA_CHARGE_KG} kg TNT charge
                gives {six(lab.b.forward[2].overpressurePa)} Pa at {lab.b.forward[2].distanceM} m. This course is where each of
                those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                The teaching streams and the published worked cases, on the vendored consequence engine. Every number on
                this page and inside every panel is a return value from that engine, pinned by a test file against the
                figures the lessons quote. Every input carries its unit in its name, and pressures are absolute. Properties are
                illustrative, never data.
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

          {tier === 'beginner' && <ReleaseExplorer />}
          {tier === 'beginner' && <ReleaseExplorer initialMode="plume" />}
          {tier === 'intermediate' && <FireExplorer />}
          {tier === 'intermediate' && <FireExplorer initialMode="heat" />}
          {tier === 'advanced' && <HarmExplorer />}
          {tier === 'advanced' && <HarmExplorer initialMode="toxic" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine declares, and what it does not decide</CardTitle>
              <CardDescription>
                The engine computes effects and no frequency. Every input carries its unit in its name, and every result
                carries its model and source, or a refusal that names the input it could not use. A gas release is
                choked at or below the critical pressure ratio. The Gaussian plume reflects at the ground and has no calm
                air form. The pool fire is a solid flame, a cylinder of radius D/2 with a surface emissive power, a view
                factor and a transmissivity, and a target under a tilted flame is refused. The blast is a free air TNT
                burst by Kinney and Graham over the range the fit is used over. Every probit preset is named by its
                source. The engine does not model two phase flow, a puff, a jet fire or congestion, and a single route
                correlation carries no graded answer.
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
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
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

export default ConsequenceLearningPage;
