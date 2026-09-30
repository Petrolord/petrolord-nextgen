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
import RoyaltyCalculator from '@/components/course/panels/pia/RoyaltyCalculator';
import HctCalculator from '@/components/course/panels/pia/HctCalculator';
import LedgerCalculator from '@/components/course/panels/pia/LedgerCalculator';
import {
  workedExampleReader, alphaReader, acrossReader,
} from '@/components/course/panels/pia/piaLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { PIA_CASE_FILES } from '@/content/capstone-cases/pia';

// The Petroleum Industry Act 2021 & Nigerian Fiscal Terms course page, a course
// of the academy's Economics & Commercial module. AN ENGINE COURSE: there is no
// Suite app, and every practical runs in the course's own three calculator
// panels, which this page hosts. Every number it prints is a return value from
// the teaching lab (piaLab), which is a return value from the vendored
// engines/economics/cashflow.ts on the synthetic Ekene teaching cases. It
// never reads the capstone: panelCapstoneGuard.test.js and piaLab.test.js both
// grep this file. The capstone case files are imported from
// src/content/capstone-cases/pia and offered on the capstone card only.

const APP = 'pia';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'Who decides what', body: 'The Act as a system, the Commission, the Authority and the Service, who assesses and collects what, where the money lands, and the texts with their editions and read dates.' },
  { tier: 'Associate', title: 'Licences, leases and terrains', body: 'Exploration, prospecting and mining licences, the four terrains and the water depth line, converted and new leases, and the Ekene cases.' },
  { tier: 'Associate', title: 'Royalty by terrain', body: 'The terrain rates and the small field tranches, condensate, gas and natural gas liquids, gas used in-country, and the daily rate the tranches read.' },
  { tier: 'Associate', title: 'Royalty by price', body: 'The shape of the royalty by price, benchmarks that escalate every year, the two readings of the base year, and frontier acreage.' },
  { tier: 'Associate', title: 'The instruments stacked', body: 'Royalty, tax, levy and funds in order, the base each reads, host communities and the NDDC levy, income tax and the development levy, and government take.' },
  { tier: 'Associate', title: 'The Associate reading', body: 'The map so far, one ledger read end to end, and the capstone brief.' },
  { tier: 'Professional', title: 'The small field tranches', body: 'Onshore and shallow water tranches, the deep offshore tier, crude plus condensate over calendar days, and the rates at the tranche edges.' },
  { tier: 'Professional', title: 'What the hydrocarbon tax charges', body: 'Crude, condensate and liquid gas in, gas out, deep offshore and frontier under the Act, the two classes of rate, and an open question for new leases.' },
  { tier: 'Professional', title: 'Deductions and the cost price ratio', body: 'Deductible and non-deductible items, royalties and levies in the base, the cost price ratio cap, carrying cost forward and cost lost at cessation.' },
  { tier: 'Professional', title: 'Allowances', body: 'Capital allowances over five years, the production allowance for converted and new leases, the volume cap and the barrels after it.' },
  { tier: 'Professional', title: 'Companies income tax alongside', body: 'Income tax on oil and gas, what its base deducts, the two thirds restriction in years under the Act alone, and losses carried by class.' },
  { tier: 'Professional', title: 'The Professional reading', body: 'The tax so far, one hydrocarbon tax year read end to end, and the capstone brief.' },
  { tier: 'Expert', title: 'Conversion and the legacy terms', body: 'Voluntary conversion and its deadline, relinquishment, marginal fields, leases that do not convert, and production sharing contracts under the Act.' },
  { tier: 'Expert', title: 'What the Nigeria Tax Act moved', body: 'Deleted and re-enacted, the development levy replacing the education tax, the framework read year by year, and the gazette version.' },
  { tier: 'Expert', title: 'What it changed at the edges', body: 'Deep offshore under three readings, the deleted deep offshore allowance, the decommissioning escrow condition, the minimum effective tax rate, and what did not change.' },
  { tier: 'Expert', title: 'Gas and incentives', body: 'Gas royalty at the ledger level, associated and non-associated gas, the greenfield gas credit, and pipeline and utilisation incentives.' },
  { tier: 'Expert', title: 'Reading a fiscal outcome', body: 'Government cash flow by provision, which provision moved, price, year and terrain side by side, and stated readings beside engine approximations.' },
  { tier: 'Expert', title: 'The Expert reading', body: 'The transitions so far, a ledger read across the switch, and the capstone brief.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Petroleum Industry Act 2021 & Nigerian Fiscal Terms: Learning Mode locked">
      <p>
        Enrol in the Petroleum Industry Act 2021 &amp; Nigerian Fiscal Terms course of the Economics &amp; Commercial
        module, and activate your account to open it in Learning Mode. The Act is a system that decides which
        instrument applies, to whom, on what base and since when, so the course teaches the map of the Act, then the
        hydrocarbon tax as a system, then the transitions to the Nigeria Tax Act 2025 and the reading of a fiscal
        outcome by provision, and grades each tier with numbers the engine returns. There is no Suite app for this
        course: every practical runs in the course&apos;s own calculator panels.
      </p>
    </LearningModeGate>
  );
}

const PiaLearningPage = () => {
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
      return { w: workedExampleReader(), a: alphaReader(), x: acrossReader() };
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
      <Helmet><title>Petroleum Industry Act 2021 &amp; Nigerian Fiscal Terms (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <Database className="h-7 w-7 text-pl-accent-text" /> Petroleum Industry Act 2021 &amp; Nigerian Fiscal Terms
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-pl-muted">Economics &amp; Commercial</p>
            <p className="mt-2 text-sm text-pl-text">
              This is an engine course. There is no Suite app for it: every practical runs in the course&apos;s own
              calculator panels below, which call the same vendored fiscal engine the lessons quote.
            </p>
            {lab && (
              <p className="mt-1 text-pl-muted">
                On the synthetic worked example, a shallow water lease at 50,000 barrels a day pays a weighted royalty
                rate of {six(lab.w.liquidsRate)} and {six(lab.w.totalTax)} of tax in its year. Ekene Alpha&apos;s government
                take is {six(lab.a.take)}, and it does not move when the working interest halves. An onshore ledger that
                crosses 1 January 2026 reads its framework year by year and first meets the Nigeria Tax Act 2025 in{' '}
                {lab.x.ntaFirstYear}. This course is where each of those numbers comes from, and every text behind them is
                named with its gazette date.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                The synthetic Ekene teaching cases, on the vendored fiscal engine. Every number on this page and inside
                every calculator panel is a return value from that engine, pinned by a test file against the figures the
                lessons quote. Every provision is named with its text: the Petroleum Industry Act 2021, the Petroleum
                Royalty Regulations 2022 and the Nigeria Tax Act 2025, each with its gazette date and the date it was read.
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

          {tier === 'beginner' && <RoyaltyCalculator />}
          {tier === 'beginner' && <RoyaltyCalculator initialMode="stack" />}
          {tier === 'intermediate' && <HctCalculator />}
          {tier === 'intermediate' && <HctCalculator initialMode="base" />}
          {tier === 'advanced' && <LedgerCalculator />}
          {tier === 'advanced' && <LedgerCalculator initialMode="readings" />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                The engine follows the gazetted texts and says where it approximates them: the royalty daily rate is read
                over the year, shared costs enter the hydrocarbon tax at the crude and condensate share of revenue, and the
                realised price stands in for the fiscal price. Where the texts leave a value open, you state it: the
                hydrocarbon tax rate of a new lease onshore or in shallow water, the deep offshore reading under the Nigeria
                Tax Act 2025, and the escrow condition of a decommissioning fund. The royalty by price base year defaults to
                the Regulations, and the Act&apos;s reading is one setting away. The framework is read year by year. Every
                money figure is at your working interest share.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && PIA_CASE_FILES[tier] && (
                <CapstoneCaseFiles files={PIA_CASE_FILES[tier]}
                  note="Download the case file the brief names. It holds the terms and the production, capex and opex rows the six values are computed from; paste the case into the ledger view of the calculator. No panel loads a case for you." />
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

export default PiaLearningPage;
