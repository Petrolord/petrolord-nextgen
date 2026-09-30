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
import ClassificationCalculator from '@/components/course/panels/prms/ClassificationCalculator';
import ReservesCalculator from '@/components/course/panels/prms/ReservesCalculator';
import AggregationCalculator from '@/components/course/panels/prms/AggregationCalculator';
import {
  classReader, economicReader, aggregationReader,
} from '@/components/course/panels/prms/prmsLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { PRMS_CASE_FILES } from '@/content/capstone-cases/prms';

// The Reserves & Resources under SPE-PRMS 2018 course page, a course of the
// academy's Economics & Commercial module. AN ENGINE COURSE: there is no Suite
// app, and every practical runs in the course's own three calculator panels,
// which this page hosts. Every number it prints is a return value from the
// teaching lab (prmsLab), which is a return value from the vendored
// engines/economics/prms.js on the synthetic Ekene field. It never reads the
// capstone: panelCapstoneGuard.test.js and prmsLab.test.js both grep this
// file. The capstone case files are imported from
// src/content/capstone-cases/prms and offered on the capstone card only.

const APP = 'prms';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'The resources framework', body: 'Why a common classification, the texts with their editions, licences and read dates, the Ekene field and its projects, the project as the unit, and the calculator panels.' },
  { tier: 'Associate', title: 'Discovered and undiscovered', body: 'A known accumulation, Prospective Resources and their sub-classes, quantities no project can recover, and the chance of commerciality.' },
  { tier: 'Associate', title: 'Reserves and Contingent Resources', body: 'What makes a project commercial, what holds Contingent Resources back, developed and undeveloped reserves, and the Ekene projects classified.' },
  { tier: 'Associate', title: 'Categories and the range of uncertainty', body: 'Low, best and high estimates, proved, probable and possible, the categories of the other classes, and one value for the range.' },
  { tier: 'Associate', title: 'The low estimate and probability', body: 'Exceedance probability, the P90 as the low estimate, deterministic and probabilistic methods, and incremental and cumulative categories in words.' },
  { tier: 'Associate', title: 'Nigerian terms in words', body: 'The declarations after an appraisal, a significant discovery and its retention, national reserves and the Commission, and the capstone brief.' },
  { tier: 'Professional', title: 'Project maturity sub-classes', body: 'On production, approved and justified, the investment decision, the Contingent sub-classes, prospect, lead and play, and a sub-class the facts contradict.' },
  { tier: 'Professional', title: 'The seven commerciality criteria', body: 'A plan, money and a time-frame, economics, a market, facilities and approvals, the five-year benchmark, and the firm intention to proceed.' },
  { tier: 'Professional', title: 'Incremental and cumulative categories', body: 'Increments of reserves, the cumulative built from increments, increments from three forecasts, and a zero increment.' },
  { tier: 'Professional', title: 'The economic limit', body: 'Three technical forecasts, the canonical cash flow underneath, trailing years cut at the limit, the economic test, and the low case that fails.' },
  { tier: 'Professional', title: 'Entitlement and the reporting basis', body: 'Gross, working interest and net entitlement, a royalty interest and a production tax, barrels of oil equivalent, and cash at the working interest.' },
  { tier: 'Professional', title: 'Licence expiry and time', body: 'Production beyond the licence, a renewal expected, capital after the expiry, and the capstone brief.' },
  { tier: 'Expert', title: 'Arithmetic aggregation', body: 'Summing by category, above the field level, the SEC summation rule, and a sum of low estimates.' },
  { tier: 'Expert', title: 'Probabilistic aggregation', body: 'The seeded Monte Carlo underneath, two blocks from the 2011 Application Guidelines, correlation between projects, the seed and the draws, and the mean of a total.' },
  { tier: 'Expert', title: 'Risked quantities and classes', body: 'Classes kept apart, the risked mean, distributions stated or fitted, and a national total.' },
  { tier: 'Expert', title: 'Reconciliation', body: 'Opening, movements and closing, production out of every category, revisions, transfers and divestments, a reconciliation that does not close, and the replacement ratio and the life index.' },
  { tier: 'Expert', title: 'Two economic-limit rules', body: 'The trailing trim, the cumulative peak, why the engine refuses where they disagree, and the boundaries rule by rule.' },
  { tier: 'Expert', title: 'What the engine does not compute', body: 'What the engine leaves out, the readings and the texts\' quirks, writing the reserves report, and the capstone brief.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Reserves & Resources under SPE-PRMS 2018: Learning Mode locked">
      <p>
        Enrol in the Reserves &amp; Resources under SPE-PRMS 2018 course of the Economics &amp; Commercial module, and
        activate your account to open it in Learning Mode. A resources estimate is a stated set of facts, forecasts and
        distributions that can be written down and computed, so the course teaches the classes, the categories and the
        low estimate as the P90, then the project maturity sub-classes, the commerciality criteria, the economic limit
        and the entitlement, then aggregation, reconciliation and the two economic-limit rules, and grades each tier
        with numbers the engine returns. There is no Suite app for this course: every practical runs in the
        course&apos;s own calculator panels.
      </p>
    </LearningModeGate>
  );
}

const PrmsLearningPage = () => {
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
      const classes = classReader();
      return { classes, reserves: classes.filter((c) => c.class === 'Reserves').length, e: economicReader(), a: aggregationReader() };
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
      <Helmet><title>Reserves &amp; Resources under SPE-PRMS 2018 (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <Database className="h-7 w-7 text-pl-accent-text" /> Reserves &amp; Resources under SPE-PRMS 2018
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-pl-muted">Economics &amp; Commercial</p>
            <p className="mt-2 text-sm text-pl-text">
              This is an engine course. There is no Suite app for it: every practical runs in the course&apos;s own
              calculator panels below, which call the same vendored reserves and resources engine the lessons quote.
            </p>
            {lab && (
              <p className="mt-1 text-pl-muted">
                The synthetic Ekene field carries {lab.classes.length} projects, and the engine classifies {lab.reserves} of them as
                Reserves on their stated facts. On the main waterflood the best case reaches its economic limit in {lab.e.limitYears[1]},
                and the 2P on the net-entitlement basis is {six(lab.e.reservesBoe[1])} BOE. Three Reserves projects add up
                arithmetically to a 1P of {six(lab.a.arithmetic[0])} MMbbl, and the seeded Monte Carlo (seed {lab.a.seed},
                {' '}{lab.a.iterations} draws) puts the P90 of the total at {six(lab.a.statistical[0])}: a figure the course teaches and
                never grades. This course is where each of those numbers comes from, and every text behind them is named with its
                edition, its licence and the date it was read.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                The synthetic Ekene field, on the vendored reserves and resources engine. Every number on this page and inside
                every calculator panel is a return value from that engine, pinned by a test file against the figures the
                lessons quote. Every text is named with its edition, its licence and the date it was read: SPE-PRMS 2018,
                cited by section and never quoted under its licence, the Petroleum Industry Act 2021, the Significant Crude
                Oil and Gas Discovery Regulations 2023 and the SEC reserves rules among them.
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

          {tier === 'beginner' && <ClassificationCalculator />}
          {tier === 'beginner' && <ClassificationCalculator initialMode="categorize" />}
          {tier === 'intermediate' && <ReservesCalculator />}
          {tier === 'intermediate' && <ReservesCalculator initialMode="classify" />}
          {tier === 'advanced' && <AggregationCalculator />}
          {tier === 'advanced' && <AggregationCalculator initialMode="reconcile" />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                The engine takes every fact and figure as a stated input: the discovery status, the recovery project, each
                commerciality criterion, the economic and project status, the chances, the estimates and their method, the
                three technical forecasts, the prices and costs, the royalty and its form, the tax, the working interest,
                the licence expiry and whether a renewal is expected, the reporting basis, each distribution, the
                correlation, the seed and the draws, and each movement of a reconciliation. The calculators show a control
                for each of those inputs and write your choice into the box; an input left out is refused by name. The only
                figures the engine holds are the five-year benchmark of PRMS 2.1.2.3, the retention years of PIA 2021
                s.78(9) and S.I. No. 37 of 2023 reg. 6(3) and the two years of s.79(1), each cited. Where a text leaves a
                rule open the engine states its reading in its own words, and the course shows each reading where it acts
                and grades none of them.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && PRMS_CASE_FILES[tier] && (
                <CapstoneCaseFiles files={PRMS_CASE_FILES[tier]}
                  note="Download the case file the brief names. It holds the projects, estimates, forecasts, distributions and movements the six values are computed from; paste the whole case into the view of the tier's calculator and choose the block each value needs. No panel loads a case for you." />
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

export default PrmsLearningPage;
