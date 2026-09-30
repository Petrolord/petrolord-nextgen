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
import AccountCalculator from '@/components/course/panels/joa/AccountCalculator';
import RecoveryCalculator from '@/components/course/panels/joa/RecoveryCalculator';
import AgreementCalculator from '@/components/course/panels/joa/AgreementCalculator';
import {
  interestsReader, carryReader, defaultReader,
} from '@/components/course/panels/joa/joaLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { JOA_CASE_FILES } from '@/content/capstone-cases/joa';

// The Joint Ventures, Operating Agreements & Cost Recovery course page, a
// course of the academy's Economics & Commercial module. AN ENGINE COURSE:
// there is no Suite app, and every practical runs in the course's own three
// calculator panels, which this page hosts. Every number it prints is a return
// value from the teaching lab (joaLab), which is a return value from the
// vendored engines/economics/jointVenture.js on the synthetic Ekene joint
// venture. It never reads the capstone: panelCapstoneGuard.test.js and
// joaLab.test.js both grep this file. The capstone case files are imported
// from src/content/capstone-cases/joa and offered on the capstone card only.

const APP = 'joa';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What a joint operating agreement fixes', body: 'A licence shared by agreement, the operator, the non-operators and the committee, the Ekene joint venture, and the texts with their editions and read dates.' },
  { tier: 'Associate', title: 'Participating interests', body: 'The participating interest, interests that sum to the whole, cost shares and production shares, and the partner split of a joint account amount.' },
  { tier: 'Associate', title: 'Paying and beneficial interests', body: 'Beneficial interest as the production share, paying interest under a carry, carriers pro rata and in stated shares, and reading the interests table.' },
  { tier: 'Associate', title: 'Cash calls', body: 'The joint account and monthly advances, the forecast share, actuals and the difference, the no-call threshold and billing in arrears, and a month with a zero forecast.' },
  { tier: 'Associate', title: 'Budget control', body: 'The approved budget by line, the item tolerance, the budget tolerance as the lower of two, and unbudgeted items against their allowance.' },
  { tier: 'Associate', title: 'Overhead basics', body: 'Operator overhead and its base, a marginal sliding scale, exclusions and the band edge, and the capstone brief.' },
  { tier: 'Professional', title: 'The cash call ledger', body: 'Reconciliation carried to a later call, the reconciliation lag, a negative call refunded or carried, and the balance with the operator.' },
  { tier: 'Professional', title: 'Carries with uplift and caps', body: 'A carry and its recovery from the share of the carried party, compound uplift on the opening balance, a multiple uplift, and a cap with its write-off.' },
  { tier: 'Professional', title: 'Back-in under the Act', body: 'The carried interest provision of PIA 2021 s.85(4), the interests after a back-in, refundable costs and the exclusions, and the refund from future entitlement.' },
  { tier: 'Professional', title: 'Default cover and interest', body: 'A default on a cash call, pro rata cover, simple default interest on a day basis, monthly compounding and the grace, and suspension and forfeiture triggers.' },
  { tier: 'Professional', title: 'PSC cost recovery', body: 'Cost oil, profit oil and the order, the cost oil limit and its base, the cost pool carried forward, and the contractor entitlement split between partners.' },
  { tier: 'Professional', title: 'The published PSC checks', body: 'The World Bank two-barrel example, the IMF one-barrel figure, the IMF schedule year by year, and the capstone brief.' },
  { tier: 'Expert', title: 'Sole risk and non-consent', body: 'Sole risk operations, the premium on the proportionate share, premium recovery from production, reversion inside the period, and net value.' },
  { tier: 'Expert', title: 'Buy-in and entry', body: 'Buy-in at a stated multiple, the Norwegian entry payment, the payment apportioned to the consenting parties, and buy-in beside premium recovery.' },
  { tier: 'Expert', title: 'The stated readings', body: 'The PSC tax reading, the grace reading and the cover reading in the words of the engine, the limit base as a stated input, and no hidden defaults.' },
  { tier: 'Expert', title: 'Reference texts and their quirks', body: 'Model agreements and licensed forms, printed figures and exact figures, a worked example that does not add up, and boundaries rule by rule.' },
  { tier: 'Expert', title: 'What the engine does not compute', body: 'Compensation, cover in kind and cash balances, expert determination and the haircut, sliding scales computed outside, and sole risk development.' },
  { tier: 'Expert', title: 'Conventions and the partner report', body: 'Conventions that are choices, caps and refusals, writing the partner report, and the capstone brief.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Joint Ventures, Operating Agreements & Cost Recovery: Learning Mode locked">
      <p>
        Enrol in the Joint Ventures, Operating Agreements &amp; Cost Recovery course of the Economics &amp; Commercial
        module, and activate your account to open it in Learning Mode. A joint operating agreement is a set of
        interest, payment and remedy rules that can be written down and computed, so the course teaches interests, cash
        calls, budget control and overhead, then the cash call ledger, carries, the back-in of the Petroleum Industry Act
        2021, default and PSC cost recovery, then sole risk, buy-in and the readings behind the engine, and grades each
        tier with numbers the engine returns. There is no Suite app for this course: every practical runs in the
        course&apos;s own calculator panels.
      </p>
    </LearningModeGate>
  );
}

const JoaLearningPage = () => {
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
      const noc = interestsReader().find((p) => p.id === 'NOC');
      const eko = interestsReader().find((p) => p.id === 'EKO');
      const paidOff = carryReader().find((l) => l.closing === 0 && l.recovered > 0);
      return { noc, eko, paidOff, d: defaultReader() };
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
      <Helmet><title>Joint Ventures, Operating Agreements &amp; Cost Recovery (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <Database className="h-7 w-7 text-pl-accent-text" /> Joint Ventures, Operating Agreements &amp; Cost Recovery
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-pl-muted">Economics &amp; Commercial</p>
            <p className="mt-2 text-sm text-pl-text">
              This is an engine course. There is no Suite app for it: every practical runs in the course&apos;s own
              calculator panels below, which call the same vendored joint venture engine the lessons quote.
            </p>
            {lab && (
              <p className="mt-1 text-pl-muted">
                In the synthetic Ekene joint venture the state participant keeps a beneficial interest of {six(lab.noc.beneficialPct)} percent
                and pays {six(lab.noc.payingPct)} percent of cost while it is carried, so the operator pays {six(lab.eko.payingPct)} percent
                on a beneficial {six(lab.eko.beneficialPct)}. The carry, with its compound uplift, is recovered in {lab.paidOff ? lab.paidOff.year : 'no stated year'}.
                A partner that pays late on the March 2027 cash call leaves {six(lab.d.unpaidTotal)} US$ for the others to advance
                and owes {six(lab.d.interestTotal)} US$ of default interest. This course is where each of those numbers comes from,
                and every text behind them is named with its edition and the date it was read.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                The synthetic Ekene joint venture, on the vendored joint venture engine. Every number on this page and
                inside every calculator panel is a return value from that engine, pinned by a test file against the figures
                the lessons quote. Every text is named with its edition and the date it was read: the Petroleum Industry Act
                2021, the Norwegian joint operating and accounting agreements, the Kenya model production sharing contract
                and the World Bank and IMF worked examples among them.
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

          {tier === 'beginner' && <AccountCalculator />}
          {tier === 'beginner' && <AccountCalculator initialMode="cashCalls" />}
          {tier === 'intermediate' && <RecoveryCalculator />}
          {tier === 'intermediate' && <RecoveryCalculator initialMode="carry" />}
          {tier === 'advanced' && <AgreementCalculator />}
          {tier === 'advanced' && <AgreementCalculator initialMode="readings" />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                The engine takes every contract term as a stated input: every carry and its carriers, the reconciliation
                lag and the negative call rule, every tolerance and overhead band, the default interest rate, method, day
                basis and grace, the uplift and the recovery share, the premium multiple, and the cost oil limit with its
                base. The calculators show a control for each of those terms and write your choice into the box; a term
                left out is refused by name. The only legal figures the engine holds are those of PIA 2021 s.85(4), each
                cited to its paragraph. Where a text leaves a rule open the engine states its reading in its own words, and
                the course shows each reading where it acts and grades none of them.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && JOA_CASE_FILES[tier] && (
                <CapstoneCaseFiles files={JOA_CASE_FILES[tier]}
                  note="Download the case file the brief names. It holds the parties, the agreement terms, the months and the years the six values are computed from; paste the whole case into each view of the tier's calculator, which reads the part it needs. No panel loads a case for you." />
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

export default JoaLearningPage;
