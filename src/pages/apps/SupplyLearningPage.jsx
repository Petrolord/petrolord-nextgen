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
  Loader2, Fuel, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import CapstonePrompt from '@/components/course/CapstonePrompt';
import TankExplorer from '@/components/course/panels/supply/TankExplorer';
import DepotExplorer from '@/components/course/panels/supply/DepotExplorer';
import PriceExplorer from '@/components/course/panels/supply/PriceExplorer';
import {
  morningAt, dayAt, rackAt, farmAt, pumpAt, fxAt, fmt,
} from '@/components/course/panels/supply/supplyLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Terminals, Depots & Fuel Supply course page. Every number it prints is a
// return value from the teaching lab (supplyLab), which is a return value of the
// vendored downstream terminalDepot and fuelPricing engines on the AKODO
// terminal, the IBAFO depot and the BADAGRY cargo. It never reads the capstone:
// panelCapstoneGuard.test.js sweeps this file too, for every graded answer as a
// whole token.

const APP = 'supply';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { tier: 'Associate', title: 'What a Terminal Measures', body: 'Two apps and one chain, everything starting from a dip, a missing input kept missing, and what the engine will not ship.' },
  { tier: 'Associate', title: 'The Strapping Table', body: 'A table of heights and volumes, the straight line between two entries, where a table stops at either end, and a bullet tank that is a curve.' },
  { tier: 'Associate', title: 'Free Water and the Gross Volume', body: 'Water under the product, the water cut read through the same table, the cuts the engine refuses, and the gross observed volume.' },
  { tier: 'Associate', title: 'The Volume Correction Factor', body: 'A litre that grows when it warms, the form of the correction, coefficients as an input, and a VCF read off your own tables.' },
  { tier: 'Associate', title: 'Closing the Day', body: 'Opening plus receipts less deliveries, no opening stock and so no day, the reconciliation that cannot fail, tolerance on what moved, and a run.' },
  { tier: 'Associate', title: 'The Associate Reading', body: 'The AKODO tanks and the AKODO day end to end, and what the next tier changes.' },
  { tier: 'Professional', title: 'The Loading Rack as a Queue', body: 'Trucks that arrive irregularly, offered load and utilisation, the probability of waiting, and bays that are whole numbers.' },
  { tier: 'Professional', title: 'Waiting Time and a Full Rack', body: "The mean wait in minutes, the queue by Little's law, a rack that cannot keep up, and one more bay." },
  { tier: 'Professional', title: 'The Tank Farm', body: 'Capacity, heel and working capacity, pumpable stock tank by tank, days of cover, ullage and turns.' },
  { tier: 'Professional', title: 'Throughput Economics', body: 'Fee, variable cost and fixed cost, a loss that has a weight, no factor and so no carbon, and two ledgers from one set of volumes.' },
  { tier: 'Professional', title: 'The Lane, the Fleet and the Station', body: 'The cycle that sets the trips, the cost of a litre delivered, a blank cost as a missing cost, a whole fleet, and the forecourt.' },
  { tier: 'Professional', title: 'The Professional Reading', body: 'The IBAFO rack, farm, lane and stations end to end, and what the next tier changes.' },
  { tier: 'Expert', title: 'One Cargo Every Way', body: 'Tonnes, cubic metres, litres and barrels, a density that is required, the barrel by definition, and templates that carry line items.' },
  { tier: 'Expert', title: 'The Landed Cost Walk', body: 'FOB, C&F and CIF, every charge naming its base, insurance quoted on CIF, a base that does not exist yet, and a missing rate that makes a floor.' },
  { tier: 'Expert', title: 'Ocean Loss and the Litre Sold', body: 'Paid on the bill of lading, divided by the outturn, the exchange rate entering once, and the charges levied at discharge.' },
  { tier: 'Expert', title: 'From Depot Gate to Nozzle', body: 'The pump price as a waterfall, a percent of the running total, who gets what, the government share, and the cap with its shortfall.' },
  { tier: 'Expert', title: 'What Breaks the Price', body: 'The price along the exchange rate, bisection inside a bracket, no crossing in the range, and the sensitivity table.' },
  { tier: 'Expert', title: 'The Expert Reading', body: 'The BADAGRY cargo end to end, what is held and what is decided, what the oracles check, and where this course hands over.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Terminals, Depots & Fuel Supply: Learning Mode locked">
      <p>
        Enrol in the Terminals, Depots &amp; Fuel Supply course and activate your account to open this app in Learning
        Mode. It reads a terminal&apos;s tanks from a dip, closes its day, queues trucks at a loading rack, costs a lane,
        lands a cargo and builds a pump price. Every rate in it is invented for the course, the engine ships none, and
        every refusal is the engine&apos;s own sentence.
      </p>
    </LearningModeGate>
  );
}

const txtOf = (v) => (v === null || v === undefined ? 'none' : String(v));

const SupplyLearningPage = () => {
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

  // Engine calls through the teaching lab, every one on the course's own records.
  const lab = useMemo(() => {
    try {
      return {
        morning: morningAt(), day: dayAt(), rack: rackAt(), farm: farmAt(), pump: pumpAt(), fx: fxAt(),
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
        toast({ title: `Capstone passed. ${CERT_LABELS[res.tier] || 'Associate'} certified!`, description: res.certificate_number, className: 'border-pl-success/40 bg-pl-success-bg text-pl-success-text' });
      } else if (res.passed) {
        toast({ title: 'Passed: you were already certified', className: 'border-pl-success/40 bg-pl-success-bg text-pl-success-text' });
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
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-pl-primary-text" /></div>;
  }
  if (!gate.allowed) return <ScopeGate />;

  return (
    <>
      <Helmet><title>Terminals, Depots & Fuel Supply (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <Fuel className="h-7 w-7 text-pl-accent-text" /> Terminals, Depots &amp; Fuel Supply
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-pl-muted">
                Everything here starts from a dip. The AKODO terminal&apos;s three tanks, dipped and corrected with the VCFs
                typed off its own tables, hold {fmt.m3(lab.morning.closingStandardM3)} m3 at standard, and its day closes
                {' '}{fmt.m3(lab.day.unaccountedM3)} m3 unaccounted, a {txtOf(lab.day.direction)}. The IBAFO rack runs at a
                utilisation of {fmt.util(lab.rack.utilisation)}, where a truck waits {fmt.min(lab.rack.averageWaitMinutes)}
                {' '}minutes on average, and its farm holds {fmt.m3(lab.farm.pumpableStockM3)} m3 it can actually pump.
                The BADAGRY cargo reaches the nozzle at {fmt.localL(lab.pump.pricePerLitre)} naira a litre, and the chain
                stops clearing its cap at {lab.fx.breakeven && lab.fx.breakeven.found ? fmt.fx(lab.fx.breakeven.value) : 'no rate in the range'}
                {' '}naira to the dollar. Every rate behind those figures is invented, and every one is a control.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                Three invented records read by the vendored downstream engines: a coastal import terminal&apos;s tanks and
                its day, an inland depot&apos;s rack, farm, lane, fleet and forecourt, and one petrol cargo landed and priced
                to the nozzle. Every volume, queue figure, cost and price on this page and inside every panel is a return
                value from those engines, pinned by a test file against the figures the lessons quote. Every refusal is the
                engine&apos;s own sentence.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LESSONS.map((l, i) => (
                <div key={l.title} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                  <p className="text-[10px] uppercase tracking-wide text-pl-muted mb-0">{l.tier}, module {(i % 6) + 1}</p>
                  <p className="text-pl-text text-sm font-medium mb-0">{l.title}</p>
                  <p className="text-xs text-pl-muted mt-1 mb-0">{l.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)} aria-pressed={tier === t}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong hover:bg-pl-sunken'}`}
              >
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'beginner' && <TankExplorer />}
          {tier === 'intermediate' && <DepotExplorer />}
          {tier === 'advanced' && <PriceExplorer />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What these apps keep as a limit</CardTitle>
              <CardDescription>
                Some behaviour is held by the engines repository, and this course teaches it as a stated limit and grades
                none of it. The charges levied at discharge are billed on the bill-of-lading quantity; whether a terminal
                bills on the bill of lading or on the outturn is a contract term the engine does not know (H1). The volume
                correction coefficient tables and every published rate stay unshipped (H2): the VCF is typed off your own
                tables or formed from coefficients you supply, and every duty, levy, margin, freight and exchange rate in
                this course is invented.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CapstonePrompt prompt={capstone?.prompt} />
            </CardHeader>
            <CardContent className="space-y-4">
              {!(!hasDeepCourse(APP, tier)
                || courseProgress?.capstone?.unlocked === true
                || courseProgress?.capstone?.passed === true
                || actualRole === 'super_admin') ? (
                  <div className="rounded-md border border-pl-border bg-pl-sunken p-4 text-sm text-pl-text flex items-start gap-2">
                    <Lock className="h-4 w-4 text-pl-accent-text mt-0.5 shrink-0" />
                    <p className="mb-0">
                      The capstone unlocks after the course: finish the lessons, pass each module quiz
                      and the final exam, then submit here.{' '}
                      <Link to={`/dashboard/apps/${APP}/course/${tier}`} className="text-pl-primary-text hover:underline">
                        Open the course
                      </Link>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {(capstone?.fields || []).map((f) => (
                        <div key={f.key}>
                          <Label className="text-pl-muted text-xs mb-1 block">{f.label} ({f.unit})</Label>
                          <Input
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            value={answers[f.key] ?? ''}
                            onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
                            className="h-8 text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={submit}
                      disabled={submitting || !capstone}
                      className="font-semibold"
                    >
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GraduationCap className="mr-2 h-4 w-4" />}
                      Submit for grading
                    </Button>
                  </>
                )}

              {result && (
                <div className={`rounded-md border p-4 ${result.passed ? 'border-pl-success/30 bg-pl-success-bg' : 'border-pl-danger/30 bg-pl-danger-bg'}`}>
                  {result.passed ? (
                    <>
                      <p className="text-pl-success-text font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" /> Passed ({result.score}/{result.max_score})
                      </p>
                      {result.certificate_number ? (
                        <div className="mt-2 text-sm text-pl-text space-y-1">
                          <p className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-pl-accent-text" />
                            {CERT_LABELS[result.tier] || 'Associate'} certificate <span className="font-mono text-pl-accent-text">{result.certificate_number}</span> issued.
                            {result.tier === 'expert' && ' Your 50% Suite discount code is on your certificates page.'}
                          </p>
                          <div className="flex gap-3">
                            <Link to="/dashboard/certificates" className="text-pl-primary-text hover:underline inline-flex items-center gap-1">
                              My certificates <ArrowRight className="h-3 w-3" />
                            </Link>
                            <a href={verificationUrl(result.verify_code)} target="_blank" rel="noreferrer" className="text-pl-muted hover:underline">
                              Public verification
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-pl-muted">You were already certified for this tier.</p>
                      )}
                    </>
                  ) : (
                    <p className="text-pl-danger-text font-medium flex items-center gap-2">
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

export default SupplyLearningPage;
