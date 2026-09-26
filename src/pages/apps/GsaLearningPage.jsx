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
import QuantityCalculator from '@/components/course/panels/gsa/QuantityCalculator';
import LedgerCalculator from '@/components/course/panels/gsa/LedgerCalculator';
import ContractCalculator from '@/components/course/panels/gsa/ContractCalculator';
import {
  januaryReader, powerLedgerReader, exportCashReader,
} from '@/components/course/panels/gsa/gsaLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { GSA_CASE_FILES } from '@/content/capstone-cases/gsa';

// The Gas Commercialisation & Gas Sales Agreements course page, a course of
// the academy's Economics & Commercial module. AN ENGINE COURSE: there is no
// Suite app, and every practical runs in the course's own three calculator
// panels, which this page hosts. Every number it prints is a return value from
// the teaching lab (gsaLab), which is a return value from the vendored
// engines/economics/gasContract.js on the synthetic Ekene agreements. It never
// reads the capstone: panelCapstoneGuard.test.js and gsaLab.test.js both grep
// this file. The capstone case files are imported from
// src/content/capstone-cases/gsa and offered on the capstone card only.

const APP = 'gsa';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What a gas sales agreement fixes', body: 'Gas sold by contract, the seller, the buyer and the delivery point, the Ekene agreements, and the texts with their editions and read dates.' },
  { tier: 'Associate', title: 'Volume to energy', body: 'Why gas is sold by its energy, gross and net heating value, the imperial and metric routes to MMBtu, and reference conditions.' },
  { tier: 'Associate', title: 'Contract quantities', body: 'The daily contract quantity and the contract year, day counts and leap years, the maximum daily quantity, swing and effective swing, and nominations.' },
  { tier: 'Associate', title: 'The daily balance', body: 'The properly nominated quantity, seller shortfall day by day, force majeure, maintenance and a buyer-caused day, and buyer shortfall.' },
  { tier: 'Associate', title: 'Take-or-pay basics', body: 'The Adjusted ACQ, the take-or-pay quantity, the deficiency and its payment, and the year the quantity is exactly met.' },
  { tier: 'Associate', title: 'Reading one contract year', body: 'The contract year in money, seller shortfall damages, the reasons the engine prints, and the capstone brief.' },
  { tier: 'Professional', title: 'The take-or-pay ledger', body: 'Contract years in sequence, make-up as prepaid gas, the recovery order as a stated term, and make-up drawn first in first out.' },
  { tier: 'Professional', title: 'Make-up expiry and the end of the term', body: 'The make-up period and its last year, make-up expiring, forfeit or refund, and the power plant ledger end to end.' },
  { tier: 'Professional', title: 'Carry-forward and seller shortfall', body: 'Carry-forward of excess takes, its cap, base and expiry, seller shortfall damages, and the export feed ledger.' },
  { tier: 'Professional', title: 'Price formulas', body: 'Fixed and escalated prices, oil-indexed slope and constant, averaging windows and lags, resets, floors, ceilings and rounding, hub and basket formulas.' },
  { tier: 'Professional', title: 'Domestic gas prices', body: 'The domestic base price as a stated input, power, commercial and gas distributors, gas based industries and the Fourth Schedule, and transport.' },
  { tier: 'Professional', title: 'The Domestic Gas Delivery Obligation', body: 'The obligation and deemed fulfilment, the excuses in their order, the penalty and a signed agreement, and the capstone brief.' },
  { tier: 'Expert', title: 'Energy parity and the S-curve', body: 'Heat equivalence between oil and gas, slopes below parity, the S-curve, its kinks and continuity, and the published curve.' },
  { tier: 'Expert', title: 'Whole-contract cash flows', body: 'The revenue lines of a contract year, royalty on the value of gas delivered, present value through the canonical NPV, and the export contract in money.' },
  { tier: 'Expert', title: 'The stated readings', body: 'The four readings the engine states in its own words, each shown where it acts, and none of them graded.' },
  { tier: 'Expert', title: 'Reference texts and their quirks', body: 'The model agreement and its alternatives, recovery orders in the texts, printed figures and exact figures, the Btu and the cubic foot, and boundaries.' },
  { tier: 'Expert', title: 'What the engine does not compute', body: 'Excess and off-specification gas, reopeners reported by month, flaring, compensation and the supply tiers, and figures quoted only as reported.' },
  { tier: 'Expert', title: 'Conventions and the contract report', body: 'Conventions that are choices, caps and refusals, writing the contract report, and the capstone brief.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Gas Commercialisation & Gas Sales Agreements: Learning Mode locked">
      <p>
        Enrol in the Gas Commercialisation &amp; Gas Sales Agreements course of the Economics &amp; Commercial module,
        and activate your account to open it in Learning Mode. A gas sales agreement is a set of quantity, price and
        remedy rules that can be written down and computed, so the course teaches the contract quantities and one
        take-or-pay year, then the ledger with make-up, carry-forward and price formulas beside the Nigerian domestic
        gas rules, then the whole contract in money and the readings behind it, and grades each tier with numbers the
        engine returns. There is no Suite app for this course: every practical runs in the course&apos;s own
        calculator panels.
      </p>
    </LearningModeGate>
  );
}

const GsaLearningPage = () => {
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
      return { j: januaryReader(), p: powerLedgerReader(), x: exportCashReader() };
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
      <Helmet><title>Gas Commercialisation &amp; Gas Sales Agreements (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Database className="h-7 w-7 text-[#BFFF00]" /> Gas Commercialisation &amp; Gas Sales Agreements
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Economics &amp; Commercial</p>
            <p className="mt-2 text-sm text-gray-300">
              This is an engine course. There is no Suite app for it: every practical runs in the course&apos;s own
              calculator panels below, which call the same vendored gas contract engine the lessons quote.
            </p>
            {lab && (
              <p className="mt-1 text-gray-400">
                In the synthetic Ekene power plant&apos;s January 2027, the buyer left {six(lab.j.annual.buyerShortfall)} MMBtu of
                the adjusted daily quantities untaken and the seller fell short by {six(lab.j.annual.sellerShortfall)}. Over its
                eight contract years the plant pays {six(lab.p.totals.deficiencyPayment)} US$ in deficiency payments and takes
                {' '}{six(lab.p.totals.makeUpTaken)} MMBtu of make-up gas. The export feed agreement is worth
                {' '}{six(lab.x.npvSellerRevenue)} US$ to the seller in present value. This course is where each of those numbers
                comes from, and every text behind them is named with its edition and the date it was read.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                The synthetic Ekene agreements, on the vendored gas contract engine. Every number on this page and inside
                every calculator panel is a return value from that engine, pinned by a test file against the figures the
                lessons quote. Every text is named with its edition and the date it was read: the Petroleum Industry Act
                2021, the Domestic Gas Delivery Obligation Regulations 2022 and the Commonwealth model gas sales agreement
                among them.
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

          {tier === 'beginner' && <QuantityCalculator />}
          {tier === 'beginner' && <QuantityCalculator initialMode="daily" />}
          {tier === 'intermediate' && <LedgerCalculator />}
          {tier === 'intermediate' && <LedgerCalculator initialMode="price" />}
          {tier === 'advanced' && <ContractCalculator />}
          {tier === 'advanced' && <ContractCalculator initialMode="cash" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                The engine takes every contract term as a stated input: the take-or-pay percentage, the make-up period, the
                recovery order, the end-of-term rule, the carry-forward terms, every price and the seller shortfall rate.
                The domestic base price is a stated input too, and the figures the course names are reported figures,
                quoted with their reports. Where a text leaves a rule open the engine states its reading in its own words,
                and the course shows each reading where it acts and grades none of them. Reopeners are reported by month;
                the engine does not model the outcome of a price review.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && GSA_CASE_FILES[tier] && (
                <CapstoneCaseFiles files={GSA_CASE_FILES[tier]}
                  note="Download the case file the brief names. It holds the contract terms, the days and the index series the six values are computed from; paste the whole case into each view of the tier's calculator, which reads the part it needs. No panel loads a case for you." />
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

export default GsaLearningPage;
