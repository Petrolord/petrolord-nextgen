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
  Loader2, Container, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import SeparatorExplorer from '@/components/course/panels/separation/SeparatorExplorer';
import SlugExplorer from '@/components/course/panels/separation/SlugExplorer';
import LayoutExplorer from '@/components/course/panels/separation/LayoutExplorer';
import { associateChain, expertChain, heldItems } from '@/components/course/panels/separation/separationLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Separation & Slug Catching course page. Every number it prints is a
// return value from the teaching lab (separationLab), which is a return value
// from the vendored Separator & Slug Catcher Designer and Facility Layout
// Mapper engines on the teaching fields ABANA, AGBAMI and the ERHA flow
// station. It never reads the capstone: panelCapstoneGuard.test.js greps this
// file too.

const APP = 'separation';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const count = (v) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 }) : 'none');

const LESSONS = [
  {
    tier: 'Associate',
    title: 'What a separator is for',
    body: 'Sizing a vessel is a different question from flashing a stream, and every input the sizing engine cannot read is refused by name.',
  },
  {
    tier: 'Associate',
    title: 'The gas at separator conditions',
    body: 'Gauge to absolute, the Sutton pseudo-criticals, the z factor and the range it is honest in, the density, and the rate the vessel actually sees.',
  },
  {
    tier: 'Associate',
    title: 'The K value',
    body: 'Six published rows, what a mist extractor changes, a rule of thumb with a floor under it, and a vendor number that beats the table.',
  },
  {
    tier: 'Associate',
    title: 'Settling',
    body: 'Two liquid densities, the mixture the gas load sees weighted by rate, Souders-Brown, and the cases where settling has no answer.',
  },
  {
    tier: 'Associate',
    title: 'The vertical vessel',
    body: 'The diameter the gas demands, the height the retention volume implies, the allowance above the liquid, and the margin at a diameter somebody chose.',
  },
  {
    tier: 'Associate',
    title: 'The Associate reading',
    body: 'One stream carried end to end, from a gauge pressure to a vessel height, with every step a return value.',
  },
  {
    tier: 'Professional',
    title: 'The horizontal vessel',
    body: 'A circle cut by a level: the two areas, the gas height, the chord that is a width rather than a length, and the level the engine refuses.',
  },
  {
    tier: 'Professional',
    title: 'Two lengths, one vessel',
    body: 'The length the liquid needs, the length the gas needs, which one controls, and the slenderness that follows.',
  },
  {
    tier: 'Professional',
    title: 'Gas capacity',
    body: 'Velocity in the gas space, the margin, the verdict, and the reason a gas length can never exceed a gas height.',
  },
  {
    tier: 'Professional',
    title: 'Slug catchers',
    body: 'Where the slug volume comes from, the working volume that holds more than the slug, a vessel from a volume, and fingers instead of a vessel.',
  },
  {
    tier: 'Professional',
    title: 'Distances on a site',
    body: 'A table figure is a table figure, a distance is measured on a sphere, and a flare or pool fire setback is computed from its own duty.',
  },
  {
    tier: 'Professional',
    title: 'The Professional reading',
    body: 'One station judged against the table and against its own two computed setbacks.',
  },
  {
    tier: 'Expert',
    title: 'Three phases in one vessel',
    body: 'The oil and water split the retentions imply, the interface at its exact segment height, a level somebody pins, and two retention lengths.',
  },
  {
    tier: 'Expert',
    title: 'Droplets and verdicts',
    body: 'Stokes between two liquids, water out of the oil, oil out of the water, residence in the sized vessel, and a verdict that used to fail open.',
  },
  {
    tier: 'Expert',
    title: 'The family of vessels',
    body: 'Every row with its reasons, the smallest feasible vessel in band, three statuses that mean different things, and a band that is an input.',
  },
  {
    tier: 'Expert',
    title: 'Judging a layout',
    body: 'What counts as a check, the items nobody placed, why complete and pass answer different questions, and two rankings that disagree.',
  },
  {
    tier: 'Expert',
    title: 'What the method does not know',
    body: 'A derating held for the literature, a settling velocity borrowed, tables and labels with no source checked, and goldens that are not measurements.',
  },
  {
    tier: 'Expert',
    title: 'The Expert reading',
    body: 'A stream and a site together: a drum that separates the stream and a plot that can hold the drum.',
  },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Separation & Slug Catching: Learning Mode locked">
      <p>
        Enrol in the Separation & Slug Catching course and activate your account to open this app in Learning Mode.
        It takes one stream and one flow station and sizes them honestly: which requirement each dimension came from,
        which verdict the vessel has to survive, and which figure on the page is a calculation rather than a table
        somebody copied.
      </p>
    </LearningModeGate>
  );
}

const SeparationLearningPage = () => {
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

  // Engine calls through the teaching lab: one vertical chain, one three-phase
  // vessel and one judged site, all on the teaching fields.
  const lab = useMemo(() => {
    try {
      return { a: associateChain(), e: expertChain(), held: heldItems() };
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
      <Helmet><title>Separation & Slug Catching (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Container className="h-7 w-7 text-[#BFFF00]" /> Separation & Slug Catching
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                A separator is sized by asking which of several competing requirements binds first. The teaching stream
                ABANA-1 arrives at {six(lab.a.pPsig)} psig, which is {six(lab.a.pPsiaDerived)} psia, where a gravity of
                {' '}{six(lab.a.gasSg)} gives a z factor of {six(lab.a.z)} and a gas density of {six(lab.a.rhoGas)} lb/ft3.
                The wire mesh pad gives a K of {six(lab.a.k)} after derating from {six(lab.a.kBase)}, settling follows at
                {' '}{six(lab.a.vT)} ft/s, and the gas alone demands {six(lab.a.diameterGasFt)} ft of diameter. At the
                {' '}{lab.a.preferredDiameterFt} ft vessel the studio prefers, the height is {six(lab.a.heightAtPreferredFt)} ft.
                The three-phase vessel AGBAMI puts its oil and water interface at {six(lab.e.interfaceHeightFt)} ft, needs
                {' '}{six(lab.e.lengthFt)} ft of length with the controlling requirement {lab.e.controlling}, and passes both
                droplet verdicts at the {six(lab.e.waterDropletMicron)} micron specification while the water one fails at
                {' '}{six(lab.e.tightMicron)} micron. The ERHA flow station needs {four(lab.e.flareSetbackM)} m of flare setback
                from {four(lab.e.flareQKw)} kW of heat release, and checking the plot leaves {count(lab.e.violationCount)} breaches
                on a plan that is not complete because {count(lab.e.skippedCount)} things were skipped. This course is where each
                of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                Two vessels on one stream, a three-phase separator, one flow station and the published golden cases, on
                the vendored Separator & Slug Catcher Designer and Facility Layout Mapper engines. Every number on this
                page and inside every panel is a return value from those engines, pinned by a test file against the
                figures the lessons quote. Vessel work is in field units, and site work is in metres. Nothing in this course is a
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

          {tier === 'beginner' && <SeparatorExplorer />}
          {tier === 'intermediate' && <SlugExplorer />}
          {tier === 'intermediate' && <LayoutExplorer />}
          {tier === 'advanced' && <SlugExplorer initialMode="threephase" />}
          {tier === 'advanced' && <LayoutExplorer initialMode="check" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these engines do not know, and what they report that they do not mean</CardTitle>
              <CardDescription>
                These engines size a VESSEL and judge a PLOT. What leaves each stage of a separation train at a given
                pressure and temperature is a flash calculation and lives elsewhere; the slug volume comes from the line
                and is typed in; the pool fire is a point source with no view factor; and the published golden cases are
                synthetic, written by an independent oracle from the same physics rather than measured on a real vessel.
                Four quantities are held for literature verification and are taught as limits rather than as answers.
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

export default SeparationLearningPage;
