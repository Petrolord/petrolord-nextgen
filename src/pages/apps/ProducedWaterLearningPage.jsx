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
  Loader2, Droplets, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import WaterExplorer from '@/components/course/panels/producedwater/WaterExplorer';
import DeviceExplorer from '@/components/course/panels/producedwater/DeviceExplorer';
import TrainExplorer from '@/components/course/panels/producedwater/TrainExplorer';
import {
  associateReading, professionalReading, theTrain, heldItems,
} from '@/components/course/panels/producedwater/producedWaterLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Produced Water Treatment course page. Every number it prints is a return
// value from the teaching lab (producedWaterLab), which is a return value from
// the vendored Produced Water Treatment engine on the teaching streams UZERE,
// KOKORI and OGBOTOBO. It never reads the capstone: producedWaterLab.test.js
// greps this file for every name on the lab's capstone list and for every
// graded answer in five renderings.
//
// COPY RULE: no em dash and no en dash anywhere a learner reads. NO P LABEL:
// nothing in this course is a distribution a percentile would describe.

const APP = 'producedwater';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

const LESSONS = [
  {
    tier: 'Associate',
    title: 'What this engine answers',
    body: 'One question asked several ways, a refusal that is always an object carrying its own message, and the four kinds of number this module stands on.',
  },
  {
    tier: 'Associate',
    title: 'The water and the oil',
    body: 'Viscosity from temperature, a salinity correction stated to a limit, brine density and crude density from API gravity, and the density difference that drives everything.',
  },
  {
    tier: 'Associate',
    title: 'The droplets',
    body: 'Oil in water as a log-normal distribution in droplet volume, the bins, the grid the answer is measured on, and the median a bin set has to reproduce.',
  },
  {
    tier: 'Associate',
    title: 'A droplet rising',
    body: 'Buoyancy against drag, the Reynolds number Stokes is stated to, and what an out of band cut size is worth.',
  },
  {
    tier: 'Associate',
    title: 'The gravity devices',
    body: 'A cut size is one inversion of one balance: the surface loading times an allowance. The depth stays out of it, and the horizontal velocity check is where the depth bites.',
  },
  {
    tier: 'Associate',
    title: 'The Associate reading',
    body: 'One stream from the rate to the cut size, two devices in series, and the verdict the engine would not give.',
  },
  {
    tier: 'Professional',
    title: 'Grade efficiency',
    body: 'What a device does to a distribution, a sharpness derived and a sharpness declared, and removal as an integral rather than a quoted efficiency.',
  },
  {
    tier: 'Professional',
    title: 'The hydrocyclone',
    body: 'A field in place of gravity, the liner geometry, the travel a droplet makes, and the cut size the march gives.',
  },
  {
    tier: 'Professional',
    title: 'The operating envelope',
    body: 'Turndown, the ceiling on the field, a sweep that turns over, and the refusal that names the liner count the flow wants.',
  },
  {
    tier: 'Professional',
    title: 'Flotation',
    body: 'A collision rate against a residence time, a bubble at Reynolds twenty, holdup and when a swarm stops being one, and the cut the kinetics gives.',
  },
  {
    tier: 'Professional',
    title: 'The bed',
    body: 'Depth filtration, a cut size that is an inversion of the same law, a grain size exponent that is held, and the loading floor the module refuses below.',
  },
  {
    tier: 'Professional',
    title: 'The Professional reading',
    body: 'Two kinds of cell on two boxes, an invariance in the cell count, and three unlike devices in one train.',
  },
  {
    tier: 'Expert',
    title: 'The coupling',
    body: 'Why the next device sees finer water, why three good devices are not one great one, and the order identity with what it does not answer.',
  },
  {
    tier: 'Expert',
    title: 'The medians and the grid',
    body: 'Two medians on one basis, a median that tracks the cut, the bin count and the span reported back, and a truncated tail that needs no source.',
  },
  {
    tier: 'Expert',
    title: 'Not answering',
    body: 'A refusal and the input it names, a withheld verdict and its three reasons, a warning that withholds nothing, and three leaves that answer with a bare NaN.',
  },
  {
    tier: 'Expert',
    title: 'What a gate can catch',
    body: 'What an independent oracle is, identities that need no source at all, the difference between a pin and a validation, and what a green suite means.',
  },
  {
    tier: 'Expert',
    title: 'Where the method stops',
    body: 'Six things held for literature, the one calibration in this module, and what this engine does not know about produced water.',
  },
  {
    tier: 'Expert',
    title: 'The band and the balance',
    body: 'Creeping flow and where it ends, the full drag balance as a second method, and a gap between two methods that has to be real.',
  },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Produced Water Treatment: Learning Mode locked">
      <p>
        Enrol in the Produced Water Treatment course and activate your account to open this app in Learning Mode.
        It treats oil in water as a droplet size distribution and every treating device as a cut size computed from
        its own geometry, so what a train removes, what the water looks like afterwards, and what the engine will not
        rule on all follow from stated physics rather than from a quoted efficiency.
      </p>
    </LearningModeGate>
  );
}

const ProducedWaterLearningPage = () => {
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

  // Engine calls through the teaching lab: one gravity front end, one de-oiling
  // train and one four stage train, all on the teaching streams.
  const lab = useMemo(() => {
    try {
      return {
        a: associateReading(), p: professionalReading(), t: theTrain(), held: heldItems(),
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
      <Helmet><title>Produced Water Treatment (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Droplets className="h-7 w-7 text-[#BFFF00]" /> Produced Water Treatment
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                A concentration says how much oil there is. The droplet size distribution says how hard it is to
                remove, and every device here is characterised by the size it removes half of. The teaching stream
                UZERE arrives at {twelve(lab.a.muPaS)} Pa.s and {six(lab.a.rhoWaterKgM3)} kg/m3 against
                {' '}{six(lab.a.rhoOilKgM3)} kg/m3 of oil, a difference of {six(lab.a.densityDifference)} kg/m3 that
                drives everything after it; its median droplet rises at {twelve(lab.a.riseMS)} m/s, its basin cuts at
                {' '}{six(lab.a.basinCutMicron)} micron and its plate pack at {six(lab.a.plateCutMicron)}, and the two
                in series leave {six(lab.a.outletOiwPpm)} ppm. The de-oiling stream KOKORI is three unlike arguments
                for three numbers: a centrifugal field of {six(lab.p.cyclone.gField)} g over
                {' '}{six(lab.p.cyclone.residenceS)} s cutting at {six(lab.p.cyclone.d50cMicron)} micron, attachment
                kinetics on a {lab.p.flotation.bubbleMicron} micron bubble swarm cutting at
                {' '}{six(lab.p.flotation.d50cMicron)}, and depth filtration at
                {' '}{twelve(lab.p.filter.filterCoefficientPerM)} per m cutting at {six(lab.p.filter.d50cMicron)}. And
                the four stage train OGBOTOBO leaves {six(lab.t.train.outletOiwPpm)} ppm at
                {' '}{six(lab.t.train.overallRemovalPct)} percent removed, with the droplet median down from
                {' '}{six(lab.t.train.inletMedianMicron)} to {six(lab.t.train.outletMedianMicron)} micron. This course
                is where each of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                One gravity front end, one de-oiling train, one four stage train and the published golden cases, on the
                vendored Produced Water Treatment engine. Every number on this page and inside every panel is a return
                value from that engine, pinned by a test file against the figures the lessons quote. Water is in bwpd and m3/s,
                temperatures in degrees C, salinity in ppm of total dissolved solids, oil gravity in degrees API,
                droplets and bubbles in micron, oil in water in ppm, and removals in percent. Nothing in this course is
                a distribution a percentile would describe, so no percentile label belongs anywhere in it.
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

          {tier === 'beginner' && <WaterExplorer />}
          {tier === 'intermediate' && <DeviceExplorer />}
          {tier === 'intermediate' && <WaterExplorer initialMode="rise" />}
          {tier === 'advanced' && <TrainExplorer />}
          {tier === 'advanced' && <DeviceExplorer initialMode="bed" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not know, and what it keeps to itself</CardTitle>
              <CardDescription>
                This engine removes dispersed oil from water. There is no dissolved or soluble oil removal in it, no
                chemical demulsifier, no coalescer media, no re-entrainment, no reject stream or oil recovery balance,
                no fouling over time and no backwash cycle. It states no discharge limit of its own, and a test asserts
                that it states none: a specification is the caller&apos;s own, out of the caller&apos;s own permit. Six
                quantities are held for literature verification and are taught as absences rather than as answers.
                {lab && (
                  <ul className="mt-2 space-y-1">
                    {lab.held.map((h) => (
                      <li key={h.id} className="text-xs text-gray-400">{h.title}. {h.note}</li>
                    ))}
                  </ul>
                )}
                None of this is a water treatment design. It is the arithmetic under one, and the judgement stays with
                the engineer who signs it.
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

export default ProducedWaterLearningPage;
