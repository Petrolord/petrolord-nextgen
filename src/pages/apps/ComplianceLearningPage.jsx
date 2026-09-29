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
  Loader2, ClipboardCheck, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import CapstonePrompt from '@/components/course/CapstonePrompt';
import RegisterExplorer from '@/components/course/panels/compliance/RegisterExplorer';
import PlanExplorer from '@/components/course/panels/compliance/PlanExplorer';
import ReadinessExplorer from '@/components/course/panels/compliance/ReadinessExplorer';
import {
  AS_OF_YMD, registerAt, libraryAt, planAt, ncrsAt, programmeAt, readinessAt, coverageAt,
} from '@/components/course/panels/compliance/complianceLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Compliance, Audit & Quality course page. Every number and status it prints
// is a return value from the teaching lab (complianceLab), which is a return
// value of the vendored assurance engines on the IKORO register and library, the
// ABAM plan, NCRs and audit, and the ORASHI clause register, all read at the
// wave's own as-of date. It never reads the capstone: panelCapstoneGuard.test.js
// sweeps this file too, for every graded answer as a whole token.

const APP = 'compliance';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { tier: 'Associate', title: 'What the Register Derives', body: 'Five apps and one date, a date that is a day, an unreadable date that is no date, and the as-of date as an input every figure depends on.' },
  { tier: 'Associate', title: "An Obligation's Status", body: 'Nine statuses worst first, the lifecycle that answers for itself, an expired permit that outranks an overdue return, and On track beside Compliant.' },
  { tier: 'Associate', title: 'Lead Time and the Current Period', body: 'The lead time that sets the warning, the default when none is usable, the edge of the window, and the period a filing belongs to.' },
  { tier: 'Associate', title: 'Rolling the Schedule Forward', body: 'The next due date rolled from the date that was due, month ends pulled back, two frequencies with no next date, and a filed One-off.' },
  { tier: 'Associate', title: 'Controlled Documents', body: 'In force and not in force, the review date earned at issue, revision numbers that keep their width, and an author who does not review.' },
  { tier: 'Associate', title: 'The Associate Reading', body: 'The IKORO register and library end to end at one as-of date.' },
  { tier: 'Professional', title: 'The Inspection and Test Plan', body: 'Five point types and the one that stops work, a decision that is a date and a name, a waiver that carries its reason, and progress counted from the points.' },
  { tier: 'Professional', title: 'Closing a Plan', body: 'A failed point that blocks whatever its type, hold points outstanding, an open NCR that blocks the plan, and removing a point.' },
  { tier: 'Professional', title: 'The Nonconformance', body: 'The disposition first, severity setting what closure needs, a completed action beside a working one, and ageing in four bands.' },
  { tier: 'Professional', title: 'The Checklist', body: 'Not applicable with a reason, no checklist as no percentage, a failed critical item that needs a finding, and stop work with its correction.' },
  { tier: 'Professional', title: 'The Audit and the Programme', body: 'Six statuses and the moves between them, what reporting and closing an audit need, the lead auditor and the auditee, and a programme delivered by its reports.' },
  { tier: 'Professional', title: 'The Professional Reading', body: 'The ABAM plan, audit and programme end to end.' },
  { tier: 'Expert', title: 'A Claim Is Evidence', body: 'Applicability and its justification, evidence with a date and a name, and the register reviewed on its own dates.' },
  { tier: 'Expert', title: 'Independence', body: 'The lead auditor against the clauses in scope, every examiner checked, and the same rule in three apps.' },
  { tier: 'Expert', title: 'Coverage Over the Cycle', body: 'Only internal audits count, only reported results count, never examined beside examined too long ago, and each standard on its own cycle.' },
  { tier: 'Expert', title: 'Findings and Root Causes', body: 'The correction and the corrective action, a major nonconformity that needs its root cause, two root cause vocabularies, and an age that stops at closure.' },
  { tier: 'Expert', title: 'Certification Readiness', body: 'A list of blockers, blocking, serious and watch, the certificate and its window, and the counts beside the list.' },
  { tier: 'Expert', title: 'The Expert Reading', body: 'The ORASHI register end to end, what is held and what is decided, what the oracles check, and where this course hands over.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Compliance, Audit & Quality: Learning Mode locked">
      <p>
        Enrol in the Compliance, Audit &amp; Quality course and activate your account to open this app in Learning Mode.
        It reads an obligation register, a document library, an inspection and test plan, an audit and an ISO clause
        register against one stated as-of date. Nothing in them is typed as a status: every status, count, age and
        verdict is derived from a dated record, and every gate refuses until the evidence, the date and the named
        person it asks for are on the record.
      </p>
    </LearningModeGate>
  );
}

const ComplianceLearningPage = () => {
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

  // Engine calls through the teaching lab, every one at the wave's own as-of date.
  const lab = useMemo(() => {
    try {
      return {
        reg: registerAt(), lib: libraryAt(), plan: planAt(), ncr: ncrsAt(), prog: programmeAt(),
        rd: readinessAt(), cov: coverageAt(),
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
      <Helmet><title>Compliance, Audit & Quality (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <ClipboardCheck className="h-7 w-7 text-pl-accent-text" /> Compliance, Audit &amp; Quality
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-pl-muted">
                Every figure in this course is read against one as-of date, {AS_OF_YMD}, and none of it is typed. At that
                date the IKORO register of {lab.reg.total} obligations has {lab.reg.attention} needing attention, worst
                first {lab.reg.byUrgency[0].code}, which reads {lab.reg.byUrgency[0].status}. Its document library holds
                {' '}{lab.lib.total} documents, {lab.lib.overdue} of them with a review overdue. The ABAM inspection and test
                plan has {lab.plan.progress.resolved} of {lab.plan.progress.total} points resolved, which the engine counts
                as {lab.plan.progress.percent} percent, with {lab.plan.progress.holdPointsOutstanding} hold points still
                stopping work. Its oldest open non-conformance is {lab.ncr.summary.oldestOpen} days old, and its audit
                programme has {lab.prog.progress.reported} of {lab.prog.progress.total} audits reported. The ORASHI
                {' '}{lab.rd.standard} register has {lab.cov.rows.filter((r) => r.covered).length} of
                {' '}{lab.cov.applicable} applicable clauses covered by a counting internal audit, and its readiness is a
                list of {lab.rd.blockers.length} items, {lab.rd.blockers.filter((b) => b.severity === 'blocking').length} of
                them blocking. Move the as-of date inside any panel and every one of those answers moves with it.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                Three invented records read by the vendored assurance engines: a coastal terminal&apos;s obligation register
                and document library, a flowline tie-in&apos;s quality plan, NCRs, contractor audit and audit programme, and a
                gas plant&apos;s ISO 14001:2015 clause register. Every status, count, age and verdict on this page and inside
                every panel is a return value from those engines at a stated as-of date, pinned by a test file against the
                figures the lessons quote. Every refusal is the engine&apos;s own sentence.
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
                onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong hover:bg-pl-sunken'}`}
              >
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'beginner' && <RegisterExplorer />}
          {tier === 'intermediate' && <PlanExplorer />}
          {tier === 'advanced' && <ReadinessExplorer />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What these apps keep as a limit</CardTitle>
              <CardDescription>
                Some behaviour is an owner decision or a held limit, and this course teaches it as a stated policy and
                grades none of it. An unreadable today is refused by the obligation register alone; the document library
                and the quality module answer as though nothing were due. A review period missing from a call returns no
                review date, and applying the default is the caller&apos;s job. A complete audit programme that contains a
                cancelled audit reads below one hundred percent by design. Risk scores, bands, appetite and the change
                approval rules belong to the sibling course, Risk, Change &amp; Learning.
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

export default ComplianceLearningPage;
