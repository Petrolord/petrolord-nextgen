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
  Loader2, Database, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import RegisterCalculator from '@/components/course/panels/materials/RegisterCalculator';
import StockCalculator from '@/components/course/panels/materials/StockCalculator';
import SparesCalculator from '@/components/course/panels/materials/SparesCalculator';
import {
  criticalityReader, eoqReader, sparesReader, leadTimeReader,
} from '@/components/course/panels/materials/materialsLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { MATERIALS_CASE_FILES } from '@/content/capstone-cases/materials';

// The Materials, Spares & Inventory Management course page, a course of the
// academy's Supply Chain module. AN APP COURSE: the Suite app is the Materials &
// Spares Planner, in the Suite's Midstream & Downstream module, which vendors
// the same engine; every practical also runs in the course's own three
// calculator panels, which this page hosts, so a learner without a Suite seat
// does every exercise. Every number it prints is a return value from the
// teaching lab (materialsLab), which is a return value from the vendored
// engines/supplychain/inventory.js on the synthetic Ekene materials register.
// It never reads the capstone: panelCapstoneGuard.test.js greps this file. The
// capstone case files are imported from src/content/capstone-cases/materials
// and offered on the capstone card only.

const APP = 'materials';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'Materials and the register', body: 'Why a materials register, the texts with their editions, licences and read dates, the Ekene register and its items, a stated policy for every figure, and the calculator panels and the Planner.' },
  { tier: 'Associate', title: 'Criticality', body: 'Criteria and weights, the weighted score, classes and their minimums, and the safety override.' },
  { tier: 'Associate', title: 'ABC by annual usage value', body: 'Annual usage value, ranking and the cumulative share, the item that crosses a cut-off, and criticality and ABC side by side.' },
  { tier: 'Associate', title: 'The economic order quantity', body: 'Ordering cost and holding cost, Harris and the lot size, the square root formula, the relevant cost at the optimum, and three lots from a trade magazine.' },
  { tier: 'Associate', title: 'Rounding and the flat bottom', body: 'A stated rounding rule, the cost of rounding, halves upward, and a holding cost stated as a rate or a figure.' },
  { tier: 'Associate', title: 'Slow-moving and obsolete stock', body: 'Months since the last issue, bands and write-downs, cover and excess, and the capstone brief.' },
  { tier: 'Professional', title: 'Quantity discounts', body: 'A price schedule, all-units and incremental discounts, candidates and the lowest total cost, and rounding against the breaks.' },
  { tier: 'Professional', title: 'Demand over the lead time', body: 'Continuous review and the reorder point, demand and lead-time variation, sigma over the protection period, and the choke bean set.' },
  { tier: 'Professional', title: 'The cycle service level', body: 'The probability of no stockout, the safety factor from the inverse normal, a safety factor read from a table, and the published safety stocks.' },
  { tier: 'Professional', title: 'The fill rate', body: 'Units short per cycle, the unit normal loss, solving for the safety factor, and a printed figure that is a slip.' },
  { tier: 'Professional', title: 'Periodic review', body: 'The review period, the order-up-to level, a floor on the safety factor, and certain demand.' },
  { tier: 'Professional', title: 'Poisson demand for slow movers', body: 'When the normal does not fit, the Poisson table, cycle service and the fill rate, the loss recursion, and the capstone brief.' },
  { tier: 'Expert', title: 'Insurance spares', body: 'A spare held against failure, orders outstanding one for one, holding against downtime, the marginal spare, and the ESP motor.' },
  { tier: 'Expert', title: 'The Poisson anchor', body: 'The handbook lamps, no shortage and the fill rate, expected units down, and the search limit.' },
  { tier: 'Expert', title: 'Lead-time risk by Monte Carlo', body: 'The canonical sampler, the lead time drawn first, the low figure and the high figure, and the seed and draws of a sampled figure no grade reads.' },
  { tier: 'Expert', title: 'Stockouts and the reorder point', body: 'Demand equal to the stock, a reorder point for a service level, the mechanical seal, and constant inputs.' },
  { tier: 'Expert', title: 'Readings, ties and boundaries', body: 'Twelve significant digits, ties and the smaller choice, boundaries rule by rule, and the readings and the texts\' quirks.' },
  { tier: 'Expert', title: 'What the engine does not compute', body: 'What the engine leaves out, size caps and refusals, conventions that are choices, writing the stock policy, and the capstone brief.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Materials, Spares & Inventory Management: Learning Mode locked">
      <p>
        Enrol in the Materials, Spares &amp; Inventory Management course of the Supply Chain module, and activate your
        account to open it in Learning Mode. A stock policy is a stated set of criteria, costs, demands, lead times,
        service targets and bands that can be written down and computed, so the course teaches criticality, ABC classes,
        the economic order quantity and slow-moving stock, then quantity discounts, safety stock at a cycle service level
        or a fill rate and Poisson demand for slow movers, then insurance spares and lead-time risk, and grades each tier
        with numbers the engine returns. The Suite app for this course is the Materials &amp; Spares Planner; the
        course&apos;s own calculator panels carry every practical for a learner without a Suite seat.
      </p>
    </LearningModeGate>
  );
}

const MaterialsLearningPage = () => {
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

  // Engine calls through the teaching lab, on the Ekene teaching cases only.
  const lab = useMemo(() => {
    try {
      const crit = criticalityReader();
      return { items: crit.length, vital: crit.filter((c) => c.class === 'V').length, e: eoqReader(), s: sparesReader(), l: leadTimeReader() };
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
      <Helmet><title>Materials, Spares &amp; Inventory Management (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Database className="h-7 w-7 text-[#BFFF00]" /> Materials, Spares &amp; Inventory Management
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Supply Chain</p>
            <p className="mt-2 text-sm text-gray-300">
              The Suite app for this course is the Materials &amp; Spares Planner, in the Suite&apos;s Midstream &amp; Downstream
              module (/dashboard/apps/midstream-downstream/materials-spares-planner), which runs the same vendored inventory
              engine the lessons quote. Every practical also runs in the course&apos;s own calculator panels below, so a learner
              without a Suite seat does every exercise here.
            </p>
            {lab && (
              <p className="mt-1 text-gray-400">
                The synthetic Ekene register carries {lab.items} stock items, and its stated criticality policy places {lab.vital} of
                them in class V. Baryte&apos;s EOQ is {six(lab.e.eoq)} tonnes, ordered as {six(lab.e.quantity)} under its stated rounding
                rule. The ESP motor costs least with {lab.s.spares} insurance spares, at {six(lab.s.totalCost)} a year. The mechanical
                seal&apos;s sampled stockout probability is {six(lab.l.probabilityOfStockout)} a cycle (seed {lab.l.seed},
                {' '}{lab.l.iterations} draws): a figure the course teaches without grading it. Every text behind these numbers is named
                with its edition, its licence and the date it was read.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                The synthetic Ekene materials register, on the vendored inventory engine. Every number on this page and inside
                every calculator panel is a return value from that engine, pinned by a test file against the figures the
                lessons quote. Every text is named with its edition, its licence and the date it was read: Harris 1913 and
                MIL-HDBK-338B quoted as public texts, and the MIT OpenCourseWare logistics lectures cited by lecture and slide
                for their figures, with no slide reproduced under their licence.
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

          {tier === 'beginner' && <RegisterCalculator />}
          {tier === 'beginner' && <RegisterCalculator initialMode="eoq" />}
          {tier === 'intermediate' && <StockCalculator />}
          {tier === 'intermediate' && <StockCalculator initialMode="quantityDiscount" />}
          {tier === 'advanced' && <SparesCalculator />}
          {tier === 'advanced' && <SparesCalculator initialMode="leadTimeRisk" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                The engine takes every policy figure as a stated input: the criticality criteria, weights, score scale, class
                minimums and override, the ABC cut-offs and boundary rule, every demand, cost, holding rate and rounding rule,
                the price schedule and discount type, the service measure and level, the order quantity, the safety-factor
                reading and floor, the lead time, its spread and the review period, the failure rate, days a year, downtime cost
                and search limit, the slow-moving bands and cover limit, and the seed and draws of a Monte Carlo. The calculators
                show a control for each of those inputs and write your choice into the box; an input left out is refused by
                name in the engine&apos;s own words. Where a rule leaves a choice open the engine states its reading, and the
                course shows each reading where it acts and grades none of them.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && MATERIALS_CASE_FILES[tier] && (
                <CapstoneCaseFiles files={MATERIALS_CASE_FILES[tier]}
                  note="Download the case file the brief names. It holds the items, policies, demands, lead times, costs and service targets the six values are computed from; paste the whole case into the view of the tier's calculator and choose the block each value needs. No panel loads a case for you." />
              )}
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
                            {result.tier === 'expert' && ' Your Expert certificate and any code it carries are on your certificates page.'}
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

export default MaterialsLearningPage;
