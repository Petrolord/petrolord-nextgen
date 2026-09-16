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
import WaterExplorer from '@/components/course/panels/gasprocessing/WaterExplorer';
import AbsorberExplorer from '@/components/course/panels/gasprocessing/AbsorberExplorer';
import ColdEndExplorer from '@/components/course/panels/gasprocessing/ColdEndExplorer';
import {
  associateReading, professionalReading, coldEnd, heldItems,
} from '@/components/course/panels/gasprocessing/gasprocessingLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Gas Processing course page. Every number it prints is a return value from
// the teaching lab (gasprocessingLab), which is a return value from the
// vendored Gas Processing engine on the teaching streams OBIAFU, UBIE and
// AGBADA. It never reads the capstone: panelCapstoneGuard.test.js greps this
// file too.

const APP = 'gasprocessing';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const nine = (v) => (Number.isFinite(v) ? Number(v).toFixed(9) : 'none');

const LESSONS = [
  {
    tier: 'Associate',
    title: 'What this engine conditions',
    body: 'Three unit operations over one gas stream, a refusal that is always an object carrying its own message, and the constants the module exports rather than hides.',
  },
  {
    tier: 'Associate',
    title: 'How much water a gas carries',
    body: 'Ideal equilibrium over liquid water, the vapour pressure that carries the whole temperature dependence, and the band the answer is honest in.',
  },
  {
    tier: 'Associate',
    title: 'The water a unit takes out',
    body: 'An intensive answer that knows nothing about the rate, the spec that sets the load, and the circulation ratio the engine refuses to choose for you.',
  },
  {
    tier: 'Associate',
    title: 'What the reboiler pays for',
    body: 'A duty assembled from named parts: the sensible half that heats the glycol and the overhead half that boils its water back out, with the reflux added again.',
  },
  {
    tier: 'Associate',
    title: 'A dehydration answer end to end',
    body: 'The published TEG cases, and the one column of the golden that is a mole balance rather than a mass balance.',
  },
  {
    tier: 'Associate',
    title: 'The Associate reading',
    body: 'One stream from the line to the still, with every step a return value and the two answers that do not know the rate exists kept apart from the three that are nothing but the rate.',
  },
  {
    tier: 'Professional',
    title: 'A contactor is a staged device',
    body: 'The Kremser relation in both branches, the absorption factor this module does not compute, and the surface read down the columns rather than across the rows.',
  },
  {
    tier: 'Professional',
    title: 'What the absorption factor can buy',
    body: 'The ceiling below unity that no number of trays buys past, the stages a spec demands, and the refusal that names more solvent as the remedy.',
  },
  {
    tier: 'Professional',
    title: 'Acid gas is removed by moles',
    body: 'A mole balance end to end, the lean loading, the rich loading and the swing between them, and what the model can honestly say about a leaner lean.',
  },
  {
    tier: 'Professional',
    title: 'Three amines and what separates them',
    body: 'A published property set where every column is a design consequence, and two orderings that agree on the ranking and disagree on the size of the gaps.',
  },
  {
    tier: 'Professional',
    title: 'The vessel the gas goes up',
    body: 'A mass transfer column rather than a knockout drum, a compressibility the engine forms rather than takes, and the liquid a column has to be sized against.',
  },
  {
    tier: 'Professional',
    title: 'The Professional reading',
    body: 'One sour stream through two columns, and three answers about one vessel of which not one can be derived from the other two.',
  },
  {
    tier: 'Expert',
    title: 'Dew point control by expansion',
    body: 'The only module in the package that computes a Joule-Thomson coefficient, the derivative that carries the whole real-gas behaviour, and three senses of dew point told apart.',
  },
  {
    tier: 'Expert',
    title: 'Marching a pressure drop',
    body: 'A slope integrated rather than multiplied, a midpoint step, a default step count measured against a converged answer, and three coefficients that are three different numbers.',
  },
  {
    tier: 'Expert',
    title: 'The cold separator',
    body: 'The water the cooling drops out, and the four states that show a let-down wetting the gas while the cooling it causes dries it.',
  },
  {
    tier: 'Expert',
    title: 'The still overhead nobody sells',
    body: 'The one emissions figure these engines produce, linear in both of its inputs, with both of them operating values the engine takes rather than derives.',
  },
  {
    tier: 'Expert',
    title: 'Computed, chosen and kept',
    body: 'What was repaired and what was not, what a refusal carries besides its message, and what a published case can catch when the two sides share their arithmetic.',
  },
  {
    tier: 'Expert',
    title: 'The Expert reading',
    body: 'Where this engine hands over: to Flow Assurance for a hydrate margin, to Separation for a settling velocity, and to a vendor for anything that becomes steel.',
  },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Gas Processing: Learning Mode locked">
      <p>
        Enrol in the Gas Processing course and activate your account to open this app in Learning Mode.
        It takes one gas stream through three balances and keeps them apart: how much water the gas carries,
        how many moles of acid gas the solution has to pick up, and how far a let-down cools it. The discipline
        is knowing which number on the page the engine computed, which one you chose, and which one it simply kept.
      </p>
    </LearningModeGate>
  );
}

const GasProcessingLearningPage = () => {
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

  // Engine calls through the teaching lab: one dehydration chain, one sour
  // stream and one dew point skid, all on the teaching fields.
  const lab = useMemo(() => {
    try {
      return {
        a: associateReading(), p: professionalReading(), c: coldEnd(), held: heldItems(),
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
      <Helmet><title>Gas Processing (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Droplets className="h-7 w-7 text-[#BFFF00]" /> Gas Processing
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                Gas conditioning is three separate balances over one stream. The teaching stream OBIAFU arrives carrying
                {' '}{six(lab.a.inletLbMMscf)} lb of water per MMscf, which is a mole fraction of {nine(lab.a.yWater)} and
                nothing to do with the rate; the spec takes {six(lab.a.removedLbMMscfDerived)} of that out, and only then
                does the rate matter, at {four(lab.a.waterLbDay)} lb a day and {six(lab.a.circGpm)} gpm of glycol. Each of
                those gallons needs {four(lab.a.sensiblePerGal)} Btu to reach the still and {four(lab.a.vaporPerGal)} Btu
                to give its water up, and the loop carries {six(lab.a.btexTonsYear)} short tons of aromatics a year out of
                the overhead on the way. The sour stream UBIE is a mole balance instead: {four(lab.p.acidMolesDay)} lbmol a
                day into the solution at a loading swing of {nine(lab.p.swingDerived)} mol per mol, which is
                {' '}{six(lab.p.circGpm)} gpm, while the same column read as a staged device removes
                {' '}{nine(lab.p.removalAtStages)} of what is there. And the dew point skid AGBADA cools
                {' '}{nine(lab.c.dropF)} degF across its choke, arriving at {nine(lab.c.t2F)} degF, where the gas can hold
                {' '}{nine(lab.c.waterOutLbMMscf)} lb per MMscf of the {nine(lab.c.waterInLbMMscf)} it came in with. This
                course is where each of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                One dehydration train, one sour gas train, one dew point skid and the published golden cases, on the
                vendored Gas Processing engine. Every number on this page and inside every panel is a return value from
                that engine, pinned by a test file against the teaching digest. Gas is in MMscfd, pressures in psia,
                temperatures in degF, water in lb per MMscf, solvent in gal per lb and gpm, and heat in Btu a gallon and
                MMBtu an hour. Nothing in this course is a distribution, so no percentile label belongs anywhere in it.
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
          {tier === 'intermediate' && <AbsorberExplorer />}
          {tier === 'intermediate' && <ColdEndExplorer initialMode="contactor" />}
          {tier === 'advanced' && <ColdEndExplorer />}
          {tier === 'advanced' && <WaterExplorer initialMode="btex" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine does not know, and what it keeps to itself</CardTitle>
              <CardDescription>
                This engine conditions a gas stream. There is no hydrate boundary in it, no compositional flash, no
                rate-based absorber, no stage efficiency, no molecular sieve, no refrigeration and no NGL recovery. A
                hydrate margin is the Flow Assurance engine, the phase envelope of a reservoir fluid is the Fluid engine,
                and turning a stage count or a circulation into steel needs a vendor. Six quantities are held for
                literature verification and are taught as limits rather than as answers, and two more are simply absent.
                {lab && (
                  <ul className="mt-2 space-y-1">
                    {lab.held.items.map((h) => (
                      <li key={h.id} className="text-xs text-gray-400">{h.title}. {h.note}</li>
                    ))}
                    {lab.held.absences.map((h) => (
                      <li key={h.id} className="text-xs text-gray-400">{h.title}. {h.note}</li>
                    ))}
                  </ul>
                )}
                None of this is a process design. It is the arithmetic under one, and the judgement stays with the
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

export default GasProcessingLearningPage;
