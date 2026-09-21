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
  Loader2, Factory, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import CapstonePrompt from '@/components/course/CapstonePrompt';
import ScreenExplorer from '@/components/course/panels/refinery/ScreenExplorer';
import PlanExplorer from '@/components/course/panels/refinery/PlanExplorer';
import VarianceExplorer from '@/components/course/panels/refinery/VarianceExplorer';
import {
  PERIOD_START, START_YEAR, screenOf, planOf, scheduleOf, varianceOf, expansionOf, bbl, usd, pbl, pct,
} from '@/components/course/panels/refinery/refineryLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Refinery Feasibility & Planning course page. Every number it prints is a
// return value from the teaching lab (refineryLab), which is a return value of the
// vendored downstream engines and the screening engine on the OKORDIA screen, the
// ABUA plan and schedule and the ODIOMA month and expansion. Every schedule is
// dated from the period start string and every valuation from the course's start
// year. It never reads the capstone: panelCapstoneGuard.test.js sweeps this file
// too, for every graded answer at every precision it could be printed at.

const APP = 'refinery';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { tier: 'Associate', title: 'What a Feasibility Screen Computes', body: 'Two apps and the modules they call, the clock readers and the argument that stops each one, and a blank box refused by name.' },
  { tier: 'Associate', title: 'Capital and the Scaling Law', body: 'One vendor quotation scaled by two laws, the crossover at the reference size, capital per bpd, and exponents a vendor replaces.' },
  { tier: 'Associate', title: 'The Product Slate', body: 'Three configurations, each product valued per barrel of crude, the loss as a yield with no value, an unpriced product named, and yields that do not close.' },
  { tier: 'Associate', title: 'Throughput and the Gross Margin', body: 'Nameplate, on-stream days and utilisation, the gross margin per barrel, the annual streams and capital in the construction years.' },
  { tier: 'Associate', title: 'Crude Supply and Licensing', body: 'Three named supply futures with no probability, the premium on the crude cost, and the licensing sequence in order.' },
  { tier: 'Associate', title: 'The Associate Reading', body: 'The OKORDIA screen in one table, every configuration under every scenario.' },
  { tier: 'Professional', title: 'The Configuration', body: 'Crudes, units and products as data, the refusals, and a blank limit read apart from a typed zero.' },
  { tier: 'Professional', title: 'The Crude Unit Carries Every Barrel', body: 'The feedless unit, the equality row, its utilisation and operating cost, and the plan with no crude unit.' },
  { tier: 'Professional', title: 'Reading the Plan', body: 'Revenue, crude cost and unit cost, the margin and the gross margin per barrel, the stream balance and the limits that bind.' },
  { tier: 'Professional', title: 'What Another Barrel Is Worth', body: 'Stream values at a product price and through a unit, a break-even crude, and pricing a debottleneck.' },
  { tier: 'Professional', title: 'The Schedule', body: 'Whole cargoes spaced across the period, weekly runs and lifts, the cargo size, and dates that are the same day in every zone.' },
  { tier: 'Professional', title: 'The Professional Reading', body: 'The ABUA plan and schedule end to end.' },
  { tier: 'Expert', title: 'One Shape, Three Ledgers', body: 'Plan, schedule and actual as one event shape, direction from the event type, and the ODIOMA plan ledger.' },
  { tier: 'Expert', title: 'Volume and Price Variance', body: 'Lines matched on material and type, the volume and price split, money with no barrels, and the margin effect.' },
  { tier: 'Expert', title: 'Variance on Margin', body: 'The headline total on margin, cost and revenue totals as recorded, the unmatched movements and the units against plan.' },
  { tier: 'Expert', title: 'The Investment Case', body: 'The expansion as streams handed to the screening engine, no royalty on a refinery, and the start year that labels the years.' },
  { tier: 'Expert', title: 'Tax Losses Carried Forward', body: 'Capital expensed before the plant earns, the loss pool year by year, and the first taxable year with the option on and off.' },
  { tier: 'Expert', title: 'The Expert Reading', body: 'What is decided, what is held, and what the oracles check.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Refinery Feasibility & Planning: Learning Mode locked">
      <p>
        Enrol in the Refinery Feasibility &amp; Planning course and activate your account to open this app in Learning
        Mode. It screens a modular refinery before any capital is spent, plans a month with every barrel of crude run
        through the crude unit, dates the plan into a schedule and reads the month&apos;s actuals against it line by line
        on margin. Every figure is a return value of the vendored engines, and every refusal is the engine&apos;s own sentence.
      </p>
    </LearningModeGate>
  );
}

const RefineryLearningPage = () => {
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

  // Engine calls through the teaching lab, every schedule from the period start
  // string and every valuation from the course's start year.
  const lab = useMemo(() => {
    try {
      return {
        screen: screenOf(), plan: planOf(), sch: scheduleOf(), v: varianceOf(), exp: expansionOf(),
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
      <Helmet><title>Refinery Feasibility & Planning (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Factory className="h-7 w-7 text-[#BFFF00]" /> Refinery Feasibility &amp; Planning
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                A refinery is judged on its margin per barrel of crude. The OKORDIA screen, hydroskimming at 5000 bpd under
                firm supply, runs {bbl(lab.screen.annualBbl)} bbl a year at a gross margin of {pbl(lab.screen.grossMarginPerBbl)} a
                barrel. The ABUA plan runs {bbl(lab.plan.totalCrude)} bbl of crude through its crude unit, at
                {' '}{pct(lab.plan.crudeUnit.utilisation)} percent of capacity, for a margin of {usd(lab.plan.margin)}, which is
                {' '}{pbl(lab.plan.grossMarginPerBbl)} a barrel of crude; its schedule, dated from {PERIOD_START}, holds
                {' '}{lab.sch.counts.all} events. The ODIOMA month read against its plan totals {usd(lab.v.total.totalVariance)} on
                margin across the matched lines, and its conversion expansion, valued from {START_YEAR}, first pays tax in year
                {' '}{lab.exp.firstTaxYear} once the construction loss is used up. Move any box inside a panel and every one of
                those answers moves with it.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                Three invented records read by the vendored downstream engines and the screening engine: a modular
                refinery screened for a site in Bayelsa, one month&apos;s plan and schedule at a coastal refinery, and a
                month&apos;s actuals and a conversion expansion at a third. Crude grade names are labels on invented yields
                and prices, and every price and cost is illustrative, in US dollars. Every figure on this page and inside
                every panel is a return value of those engines, pinned by a test file against the figures the lessons quote.
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

          {tier === 'beginner' && <ScreenExplorer />}
          {tier === 'intermediate' && <PlanExplorer />}
          {tier === 'advanced' && <VarianceExplorer />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these apps keep as a limit</CardTitle>
              <CardDescription>
                Some behaviour is an owner decision or a held limit, and this course teaches it as a stated policy and
                grades none of it. The scaling exponents are defaults for a vendor&apos;s own figures to replace. The
                screening engine deducts capital in the year it is spent and offers no capital allowance schedule; a
                fuller allowance model belongs to the Economics module. The stream model&apos;s material balance cannot close
                a refinery tank, so this course prints none. Yields are fixed vectors, quality is not carried through the
                plan, and the schedule models no tank capacity, jetty window or turnaround.
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

export default RefineryLearningPage;
