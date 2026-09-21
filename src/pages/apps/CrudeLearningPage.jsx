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
import CapstonePrompt from '@/components/course/CapstonePrompt';
import AssayExplorer from '@/components/course/panels/crude/AssayExplorer';
import ValuationExplorer from '@/components/course/panels/crude/ValuationExplorer';
import RecipeExplorer from '@/components/course/panels/crude/RecipeExplorer';
import {
  exportBlend, netback, pmsRecipe, relief, fx,
} from '@/components/course/panels/crude/crudeLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Crude Assay & Blending course page (academy module commercial_trading).
// Every number it prints is a return value from the teaching lab (crudeLab),
// which is a return value of the vendored crudeAssay, productBlending and LP
// kernel engines on the OBIGBO library, the KWALE refinery valuation and the
// APAPA blending terminal. It never reads the capstone: panelCapstoneGuard.test.js
// sweeps this file too, for every graded answer.

const APP = 'crude';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { tier: 'Associate', title: 'What an Assay Carries', body: 'API and specific gravity, the hyperbola between them, the per-mass properties, SARA and the TBP curve.' },
  { tier: 'Associate', title: 'Blending on the Right Basis', body: 'Density on volume and API through specific gravity, volume shares into mass shares, sulfur and metals on mass, and a blank that is no zero.' },
  { tier: 'Associate', title: 'Viscosity Through an Index', body: 'The Refutas index, blended on mass and inverted, its domain, and the basis the engine names.' },
  { tier: 'Associate', title: 'The Curve and Its Cuts', body: 'Reading a TBP curve between and outside its points, the unknown beyond a partial curve, and a cut set that closes.' },
  { tier: 'Associate', title: 'Will the Blend Stay Stable', body: 'The colloidal instability index and its three bands, and the gravity screen that can raise a flag and never clear one.' },
  { tier: 'Associate', title: 'The Associate Reading', body: 'The OBIGBO export blend end to end.' },
  { tier: 'Professional', title: "The Blend's Own Curve", body: 'Yields add on volume, so the blend has its own curve at every temperature a crude measured.' },
  { tier: 'Professional', title: 'The Fifty Percent Point', body: 'T50 interpolated on the blend, the readings the engine does not use, and Watson K as a screening figure.' },
  { tier: 'Professional', title: 'Cut Yields of the Blend', body: "The refinery's own cut points, and a moved point that moves barrels between two cuts only." },
  { tier: 'Professional', title: 'Netback', body: 'Product value per barrel of crude, losses on the product side, processing and freight, blank costs named.' },
  { tier: 'Professional', title: 'Against the Marker', body: 'The differential, each crude alone beside the blend, and D86 refused without its table.' },
  { tier: 'Professional', title: 'The Professional Reading', body: 'The KWALE valuation end to end, and what the live studio opens on.' },
  { tier: 'Expert', title: 'What a Linear Programme Is', body: 'Rows and bounds, the vertex, the two phases, and optimal, infeasible and unbounded as answers.' },
  { tier: 'Expert', title: 'Blending Rules as Rows', body: 'A ratio limit as a linear row, volume, mass and index bases, and viscosity on mass in the diesel pool.' },
  { tier: 'Expert', title: 'Binding and Giveaway', body: 'The specifications the optimum presses against, and quality handed over for nothing.' },
  { tier: 'Expert', title: 'Shadow Prices', body: 'The value of one unit of relief per unit of the property, rowPrice beside it, and the marginal barrel.' },
  { tier: 'Expert', title: 'Infeasible, Refused and Skipped', body: 'Infeasible as an answer, a blank cost refused, a typed 0 as none, and a specification skipped with its reason.' },
  { tier: 'Expert', title: 'The Expert Reading', body: 'The APAPA recipes end to end, the held limits, and what the oracles check.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Crude Assay & Blending: Learning Mode locked">
      <p>
        Enrol in the Crude Assay &amp; Blending course and activate your account to open this app in Learning Mode.
        It blends a crude library property by property on each property&apos;s own basis, values a blend at a
        refinery on its own cut set, and solves a least-cost product recipe as a linear programme, with every basis,
        binding specification and refusal the engine&apos;s own.
      </p>
    </LearningModeGate>
  );
}

const CrudeLearningPage = () => {
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

  // Engine calls through the teaching lab.
  const lab = useMemo(() => {
    try {
      return {
        blend: exportBlend(), nb: netback(), pms: pmsRecipe(), rel: relief(),
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
      <Helmet><title>Crude Assay & Blending (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Droplets className="h-7 w-7 text-[#BFFF00]" /> Crude Assay &amp; Blending
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                Every figure in this course is the engine&apos;s, on the engine&apos;s basis. The OBIGBO export blend reads
                {' '}{fx(lab.blend.api.value)} API, formed from the volume-blended specific gravity, beside {fx(lab.blend.api.onVolume)} for
                the API numbers averaged on volume, a reading the engine does not use. The KWALE refinery nets back
                {' '}{fx(lab.nb.netback)} $/bbl on the blend, {fx(lab.nb.marker.differential)} against its marker. The APAPA PMS
                cargo costs {fx(lab.pms.unitCost)} $/bbl, binding on {lab.pms.bindingSpecs.join(' and ')}, and one ppm of
                sulfur relief is worth {fx(lab.rel.sulfurPrice)} $ against a rowPrice of {fx(lab.rel.rows.find((r) => r.name === 'Sulfur maximum').rowPrice)}.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                Three invented cases read by the vendored downstream engines: a Rivers State crude library and its export
                blend, a Delta State modular refinery valuing a blend on its own cut set, and a Lagos terminal blending PMS
                and AGO at least cost. Every figure on this page and inside every panel is a return value from those
                engines, pinned by a test file against the figures the lessons quote. Every refusal is the engine&apos;s own sentence.
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

          {tier === 'beginner' && <AssayExplorer />}
          {tier === 'intermediate' && <ValuationExplorer />}
          {tier === 'advanced' && <RecipeExplorer />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these apps keep as a limit</CardTitle>
              <CardDescription>
                Three behaviours are held decisions, taught as stated limits and graded nowhere. The Refutas index blends on
                mass fraction, where ASTM D7152 blends the same family on volume, and the basis is an owner decision.
                Watson K is taken at the blend&apos;s T50, a screening basis where the strict one is the mean average boiling
                point. The LP kernel uses absolute tolerances, right for barrel-scale problems. Specification templates are
                starting shapes: the regulation in force governs every limit.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CapstonePrompt prompt={capstone?.prompt} />
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

export default CrudeLearningPage;
