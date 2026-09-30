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
import EarningCalculator from '@/components/course/panels/farmout/EarningCalculator';
import DealCalculator from '@/components/course/panels/farmout/DealCalculator';
import ValuationCalculator from '@/components/course/panels/farmout/ValuationCalculator';
import {
  earningReader, dealReader, carryReader,
} from '@/components/course/panels/farmout/farmoutLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { FARMOUT_CASE_FILES } from '@/content/capstone-cases/farmout';

// The Farm-ins, Farm-outs & Asset Valuation course page, a course of the
// academy's Economics & Commercial module. AN ENGINE COURSE: there is no Suite
// app, and every practical runs in the course's own three calculator panels,
// which this page hosts. Every number it prints is a return value from the
// teaching lab (farmoutLab), which is a return value from the vendored
// engines/economics/farmout.js on the synthetic Ekene Deep farm-out. It never
// reads the capstone: panelCapstoneGuard.test.js and farmoutLab.test.js both
// grep this file. The capstone case files are imported from
// src/content/capstone-cases/farmout and offered on the capstone card only.

const APP = 'farmout';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What a farm-out is', body: 'An interest for work, the farmor and the farminee, the Ekene Deep prospect, the texts with their editions and read dates, and the calculator panels.' },
  { tier: 'Associate', title: 'The earning obligation', body: 'A work programme as the price of an interest, the share paid and the participating interest earned, and the other parties paying their own shares.' },
  { tier: 'Associate', title: 'The promote and its ratio', body: 'The promote in points, the promote ratio, the carry inside a promote, and a heads-up deal beside a full carry.' },
  { tier: 'Associate', title: 'Cash bonus and reimbursement', body: 'A cash bonus, past-cost reimbursement, the consideration to the farmor and the equivalent working interest.' },
  { tier: 'Associate', title: 'The consent process in words', body: 'An assignment needs consent, the Minister and the Commission, a change of control, the notification and the application, and fees that are not deductible.' },
  { tier: 'Associate', title: 'Interests after the deal', body: 'The participating interests after the farm-in, an event completed and vested, a checklist for reading a farm-out, and the capstone brief.' },
  { tier: 'Professional', title: 'Caps and overrun rules', body: 'A cap on the gross cost, the excess paid by the post-deal interests or the farmor side, a cap on the carry amount, and a cap reached exactly.' },
  { tier: 'Professional', title: 'Drill-to-earn vesting', body: 'Earning events, vesting event by event, vesting when every event is complete, and the obligation beside the payments made.' },
  { tier: 'Professional', title: 'Deal value to each side', body: 'A risked prospect in stated terms, the three actions of the farmor, the choice of the farminee, value moving between the sides, and the success-case value from cash flows.' },
  { tier: 'Professional', title: 'Break-even promote and chance', body: 'The break-even promote, breakpoints under a carry cap, the break-even chance of success, and when no break-even exists.' },
  { tier: 'Professional', title: 'The consent fee', body: 'Seven per cent of the value of the transaction, that value as the 2024 Regulations define it, an intra group transfer and a PEL, and the fee in the position of the farmor.' },
  { tier: 'Professional', title: 'Paying the fee on time', body: 'Ninety days and thirty more, the surcharge a day, the consent deemed withdrawn, and the capstone brief.' },
  { tier: 'Expert', title: 'Information value to each side', body: 'The value of perfect information, a signal and its likelihoods, the signal that turns the decision, information worth its cost, and the same survey to each side.' },
  { tier: 'Expert', title: 'Risk sharing', body: 'Positions as holdings, spread and the chance of a loss, the low and high cases, and the seed, the draws and the correlation, all stated.' },
  { tier: 'Expert', title: 'Pricing an interest', body: 'Value per percent of working interest, risked and success-case bases, and transaction ratios of stated inputs, reported only.' },
  { tier: 'Expert', title: 'Carries and back-ins after the farm-in', body: 'A development carry with a simple, compound or multiple uplift, recovery from the share of the farmor, a back-in and its refund, on the joint venture engine.' },
  { tier: 'Expert', title: 'Readings and source quirks', body: 'The readings the engine states, a table with two numbers, the regulations as printed, and boundaries rule by rule.' },
  { tier: 'Expert', title: 'What the engine does not compute', body: 'What the engine leaves out, conventions, caps and refusals, writing the farm-out report, and the capstone brief.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Farm-ins, Farm-outs & Asset Valuation: Learning Mode locked">
      <p>
        Enrol in the Farm-ins, Farm-outs &amp; Asset Valuation course of the Economics &amp; Commercial module, and
        activate your account to open it in Learning Mode. A farm-out is a set of stated deal terms that can be written
        down and computed, so the course teaches the earning obligation, the promote, the cash bonus and the consent
        process, then caps, drill-to-earn vesting, the value of the deal to each side, the break-evens and the consent
        fee, then the value of information, risk sharing, the price of an interest and what follows the farm-in, and
        grades each tier with numbers the engine returns. There is no Suite app for this course: every practical runs
        in the course&apos;s own calculator panels.
      </p>
    </LearningModeGate>
  );
}

const FarmoutLearningPage = () => {
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
      const paidOff = carryReader().find((l) => l.closing === 0 && l.recovered > 0);
      return { e: earningReader(), d: dealReader(), paidOff };
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
      <Helmet><title>Farm-ins, Farm-outs &amp; Asset Valuation (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex flex-wrap items-center gap-2">
              <Database className="h-7 w-7 text-pl-accent-text" /> Farm-ins, Farm-outs &amp; Asset Valuation
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-pl-muted">Economics &amp; Commercial</p>
            <p className="mt-2 text-sm text-pl-text">
              This is an engine course. There is no Suite app for it: every practical runs in the course&apos;s own
              calculator panels below, which call the same vendored farm-out engine the lessons quote.
            </p>
            {lab && (
              <p className="mt-1 text-pl-muted">
                In the synthetic Ekene Deep farm-out the incoming party pays {six(lab.e.farmineePays)} US$ of the exploration well
                for its participating interest, a promote of {six(lab.e.promotePoints)} points, and the farmor receives a
                consideration of {six(lab.e.consideration)} US$. On the stated prospect the farmor&apos;s EMV is {six(lab.d.farmOutEmv)} US$
                after the farm-out against {six(lab.d.aloneEmv)} US$ drilling alone, and the incoming party breaks even paying
                {' '}{six(lab.d.breakEvenSharePct)} percent of the well. A development carry after the farm-in, with a compound uplift,
                is recovered in {lab.paidOff ? lab.paidOff.year : 'no stated year'}. This course is where each of those numbers comes
                from, and every text behind them is named with its edition and the date it was read.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                The synthetic Ekene Deep farm-out, on the vendored farm-out engine. Every number on this page and inside
                every calculator panel is a return value from that engine, pinned by a test file against the figures the
                lessons quote. Every text is named with its edition and the date it was read: the Petroleum Industry Act
                2021, the Nigerian Upstream Petroleum (Assignment of Interests) Regulations 2024 and the HMRC Oil Taxation
                Manual among them.
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

          {tier === 'beginner' && <EarningCalculator />}
          {tier === 'intermediate' && <DealCalculator />}
          {tier === 'intermediate' && <DealCalculator initialMode="deal" />}
          {tier === 'advanced' && <ValuationCalculator />}
          {tier === 'advanced' && <ValuationCalculator initialMode="readings" />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                The engine takes every deal term as a stated input: each event&apos;s gross cost, share paid, interest
                earned and cap with its overrun rule, the vesting rule, the cash bonus and the past costs, the chance of
                success, the well costs and the success-case value, the signal likelihoods, the value basis of a price, the
                uplift and recovery share of a carry, and the value of the transaction with its source. The calculators
                show a control for each of those terms and write your choice into the box; a term left out is refused by
                name. The only legal figures the engine holds are the fee rates and days of reg. 19 of the 2024 Regulations
                and the change of control line of PIA 2021 s.95(14), each cited. Where a text leaves a rule open the engine
                states its reading in its own words, and the course shows each reading where it acts and grades none of them.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && FARMOUT_CASE_FILES[tier] && (
                <CapstoneCaseFiles files={FARMOUT_CASE_FILES[tier]}
                  note="Download the case file the brief names. It holds the parties, the deal terms, the prospect and the years the six values are computed from; paste the whole case into each view of the tier's calculator, which reads the part it needs. No panel loads a case for you." />
              )}
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

export default FarmoutLearningPage;
