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
  Loader2, Leaf, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import CapstonePrompt from '@/components/course/CapstonePrompt';
import InventoryExplorer from '@/components/course/panels/carbon/InventoryExplorer';
import EfficiencyExplorer from '@/components/course/panels/carbon/EfficiencyExplorer';
import AbatementExplorer from '@/components/course/panels/carbon/AbatementExplorer';
import {
  inventory, stackLoss, curve, HELD, F,
} from '@/components/course/panels/carbon/carbonLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Carbon & Energy Efficiency course page (academy module energy_transition).
// Every number it prints is a return value from the teaching lab (carbonLab),
// which is a return value of the vendored carbonAbatement and energyEfficiency
// engines on the IGBOGENE inventory, the ISIOKPO heater and steam system and the
// AGBOR abatement programme. It never reads the capstone: panelCapstoneGuard.test.js
// sweeps this file too, for every graded answer.

const APP = 'carbon';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { tier: 'Associate', title: 'What an Inventory Counts', body: 'Two apps and one ledger, Scope 1 and Scope 2, missing stays missing, and what the engines will not ship.' },
  { tier: 'Associate', title: 'Carbon In, CO2 Out', body: 'The atom balance, molar masses from atomic weights, carbon per kilomole of fuel and a fired heater\'s CO2.' },
  { tier: 'Associate', title: 'The Flare as an Inventory Line', body: 'The destruction efficiency as a required input, the escaped carbon counted as methane, and one flare at five efficiencies.' },
  { tier: 'Associate', title: 'Global Warming Potentials', body: 'A set carries its report: AR5 and AR6, fossil and non-fossil methane, and one inventory on four sets.' },
  { tier: 'Associate', title: 'Lines, Factors and Provenance', body: 'A factor is a record, blocked and unsourced lines, computed and reportable, and intensity with its boundary.' },
  { tier: 'Associate', title: 'The Associate Reading', body: 'The Igbogene inventory end to end, and what is held.' },
  { tier: 'Professional', title: 'Combustion from the Fuel Analysis', body: 'Oxygen demand by atom counts, air and the flue gas, inerts, and atmospheric nitrogen with its argon.' },
  { tier: 'Professional', title: 'Excess Air and Stack Oxygen', body: 'Excess air read from a dry stack oxygen, the closed form, and what the reading cannot see.' },
  { tier: 'Professional', title: 'Stack Loss Efficiency', body: 'Losses out of the stack on LHV and on HHV, the moisture loss on each basis, and radiation as an input.' },
  { tier: 'Professional', title: 'What Tuning Is Worth', body: 'Fuel is duty over efficiency: the ratio, the percentage-point shortcut as a contrast, and the safe oxygen floor.' },
  { tier: 'Professional', title: 'Steam, Condensate and the Pinch', body: 'A failed trap as choked flow, condensate return and its floor, the problem table and the threshold.' },
  { tier: 'Professional', title: 'The Professional Reading', body: 'The Isiokpo heater, steam and streams end to end.' },
  { tier: 'Expert', title: 'The Cost of a Tonne Abated', body: 'Capital recovery, a negative cost that pays for itself, a blank that is not free and a rate that is a fraction.' },
  { tier: 'Expert', title: 'The Marginal Abatement Cost Curve', body: 'Cheapest first, steps that tile the axis, the weighted average and the measures that pay for themselves.' },
  { tier: 'Expert', title: 'Interactions and Over-claims', body: 'Two measures on one source, claims above what a source emits, and a verdict the curve cannot assess.' },
  { tier: 'Expert', title: 'Targets and the Path', body: 'A straight-line target, the unabated gap named, a partial inventory and a measure with no start year.' },
  { tier: 'Expert', title: 'Savings into the Ledger', body: 'One saving in money and carbon on one basis, its cost per tonne, and energy intensity against a peer.' },
  { tier: 'Expert', title: 'The Expert Reading', body: 'The Agbor programme end to end, what is held, and what the oracles check.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Carbon & Energy Efficiency: Learning Mode locked">
      <p>
        Enrol in the Carbon &amp; Energy Efficiency course and activate your account to open this app in Learning Mode.
        It counts an inventory carbon atom by carbon atom on a declared GWP set, reads a fired heater&apos;s efficiency,
        steam and pinch from first principles, and costs a tonne abated over the life of the measure, with every
        refusal the engine&apos;s own.
      </p>
    </LearningModeGate>
  );
}

const CarbonLearningPage = () => {
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
      return { inv: inventory(), loss: stackLoss(), cv: curve() };
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
      <Helmet><title>Carbon & Energy Efficiency (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Leaf className="h-7 w-7 text-[#BFFF00]" /> Carbon &amp; Energy Efficiency
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                Every figure in this course is the engine&apos;s. The IGBOGENE inventory totals {F.t(lab.inv.inv.totalTonnes)} tCO2e
                on {lab.inv.inv.gwpSetLabel}, reportable {String(lab.inv.inv.reportable)}. The ISIOKPO heater reads
                {' '}{F.pct(lab.loss.lhv.efficiencyPercent)} percent on {lab.loss.lhv.basis} and {F.pct(lab.loss.hhv.efficiencyPercent)} percent
                on {lab.loss.hhv.basis} at the same stack oxygen, two numbers that are never compared. The AGBOR curve abates
                {' '}{F.t(lab.cv.curve.totalAbatementTonnes)} t a year at a weighted average of {F.usdt(lab.cv.curve.weightedAverageCostPerTonne)} USD a
                tonne, and its verdict is labelled {lab.cv.curve.targetBasis ? `"${lab.cv.curve.targetBasis}"` : 'none'}.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                Three invented cases read by the vendored engines: a Bayelsa flow station and gas plant rolled into one
                inventory, a Rivers State gas plant&apos;s heater, steam trap, condensate and process streams, and a Delta State
                complex costing six abatement measures against a target. Every figure on this page and inside every panel is a
                return value from those engines, pinned by a test file against the figures the lessons quote. Every refusal is the
                engine&apos;s own sentence.
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

          {tier === 'beginner' && <InventoryExplorer />}
          {tier === 'intermediate' && <EfficiencyExplorer />}
          {tier === 'advanced' && <AbatementExplorer />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these apps keep as a limit</CardTitle>
              <CardDescription>
                Four items are held, taught as stated limits and graded nowhere. GWP values, emission factors and every price
                are inputs: neither engine ships one.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {HELD.map(([k, text]) => (
                <p key={k} className="text-xs text-gray-400 mb-0"><span className="text-[#BFFF00] font-mono mr-2">{k}</span>{text}</p>
              ))}
            </CardContent>
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

export default CarbonLearningPage;
