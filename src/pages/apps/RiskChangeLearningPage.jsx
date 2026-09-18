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
  Loader2, ShieldCheck, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import CapstonePrompt from '@/components/course/CapstonePrompt';
import RiskExplorer from '@/components/course/panels/riskchange/RiskExplorer';
import ChangeExplorer from '@/components/course/panels/riskchange/ChangeExplorer';
import ReviewExplorer from '@/components/course/panels/riskchange/ReviewExplorer';
import {
  associateReading, professionalReading, expertReading, q, lst,
} from '@/components/course/panels/riskchange/riskchangeLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Risk, Change & Learning course page. Every status, count and date it
// prints is a return value from the teaching lab (riskchangeLab), which is a
// return value of the vendored assurance engines on the OBODO, ESANMI, IKANG and
// ONNE teaching registers, every one read on the wave's as-of date. It never
// reads the capstone: panelCapstoneGuard.test.js sweeps this file too, in every
// rendering of every graded answer.

const APP = 'riskchange';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  {
    tier: 'Associate',
    title: 'What these engines decide',
    body: 'Four registers and a rule for each, one as-of date for every status, a verdict that answers in the same shape every time, and what the engines leave to people.',
  },
  {
    tier: 'Associate',
    title: 'The matrix and its bands',
    body: 'Five levels on two axes, twenty five cells and one product, four bands found by their lower edges, the scores no cell can hold, and values off the scale.',
  },
  {
    tier: 'Associate',
    title: 'Residual and appetite',
    body: 'Inherent against residual, the fallback one axis at a time, a blank and an off-scale level doing different things, and a target with three answers.',
  },
  {
    tier: 'Associate',
    title: 'The calendar date',
    body: 'Whole days between two dates, a review due today that is still on time, a date that does not exist, and one as-of date in every time zone.',
  },
  {
    tier: 'Associate',
    title: 'The register as a whole',
    body: 'Live and finished risks, one row derived once, counting by band, and four populations of one register that give different Critical counts.',
  },
  {
    tier: 'Associate',
    title: 'The Associate reading',
    body: 'The OBODO register end to end on the as-of date.',
  },
  {
    tier: 'Professional',
    title: 'A change and its stages',
    body: 'Eight stages in order, the legal moves and the final stages, and a refusal that names the way forward.',
  },
  {
    tier: 'Professional',
    title: 'Approval levels',
    body: 'Levels come from the rows, one signature a level, a rejection that stops the gate, and a change with no rows that has nothing to approve.',
  },
  {
    tier: 'Professional',
    title: 'Segregation of duties',
    body: 'The originator never approves, only the assignee decides, a decision is made once, and an absence is covered by reassigning.',
  },
  {
    tier: 'Professional',
    title: 'Actions and the two gates',
    body: 'Three kinds of action, the gate into Implementation, the gate into Closed, and a date to come back out.',
  },
  {
    tier: 'Professional',
    title: 'Temporary and emergency change',
    body: 'Only a change in effect can expire, six expiry states and the lead before one, an emergency change on one signature, and the ratification window.',
  },
  {
    tier: 'Professional',
    title: 'The Professional reading',
    body: 'The ESANMI register end to end, summarised and sorted by urgency.',
  },
  {
    tier: 'Expert',
    title: 'The comment loop',
    body: 'Six dispositions, who moves each one, nothing to verify without a response, and two final dispositions.',
  },
  {
    tier: 'Expert',
    title: 'Closing a review',
    body: 'Two severities that block, a review that cannot close, overdue reviews and live stages, and the author who never reviews the work.',
  },
  {
    tier: 'Expert',
    title: 'A lesson and its validation',
    body: 'Three parts of a lesson, the author who may not validate it, a typed name and the actor, and validated before published.',
  },
  {
    tier: 'Expert',
    title: 'Proof of use',
    body: 'An application and its outcome, the reuse record as a count, embedded as something earned, and archive and supersede needing reasons.',
  },
  {
    tier: 'Expert',
    title: 'What the engines do not know',
    body: 'Review due soon and overdue, the ONNE register summarised, the held items and owner decisions, and two oracles giving one answer.',
  },
  {
    tier: 'Expert',
    title: 'The Expert reading',
    body: 'One loop across four registers: a lesson into a risk and into a change, and where these engines hand over.',
  },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Risk, Change & Learning: Learning Mode locked">
      <p>
        Enrol in the Risk, Change & Learning course and activate your account to open this app in Learning Mode. It
        takes four registers through the engines that decide what each record means on a stated day: a risk&apos;s band
        and appetite, a change&apos;s stage, expiry and ratification, a review&apos;s closure, and a lesson&apos;s proof
        of use. The discipline is knowing which answer the engine gave, which choice was yours, and which date it was
        read on.
      </p>
    </LearningModeGate>
  );
}

const RiskChangeLearningPage = () => {
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

  // Engine calls through the teaching lab: the four teaching registers, each
  // read on the wave's as-of date.
  const lab = useMemo(() => {
    try {
      return { a: associateReading(), p: professionalReading(), x: expertReading() };
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
      <Helmet><title>Risk, Change &amp; Learning (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-[#BFFF00]" /> Risk, Change &amp; Learning
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                Every status in this course is read on one day, {lab.a.asOfIso}, and every engine that decides a status
                is handed that day rather than the clock. The OBODO risk register holds {lab.a.risks} risks, {lab.a.live}
                {' '}of them live: {lst(lab.a.above)} sit above appetite, {lst(lab.a.notSet)} have no appetite answer at
                all, and {lst(lab.a.reviewOverdue)} are past their review date. The same register gives Critical counts
                of {lst(lab.a.criticalCounts)} depending on which risks are handed over and which score is counted. The
                ESANMI change register holds {lab.p.changes} changes: {lst(lab.p.expired)} has expired,
                {' '}{lst(lab.p.expiringSoon)} are inside the {lab.p.leadDays} day lead, {lst(lab.p.ratificationOverdue)}
                {' '}are past the {lab.p.ratifyDays} day ratification window, and {lab.p.urgencyFirst} is the most urgent.
                The IKANG review {lab.x.review} cannot close while {lst(lab.x.blocking)} block it, and of the
                {' '}{lab.x.pairs} ordered moves between comment statuses only {lab.x.legalPairs} are legal. Of the
                {' '}{lab.x.visible} visible ONNE lessons, {lab.x.lessonsApplied} have changed something and
                {' '}{lab.x.lessonsUnapplied} have been applied nowhere, and {lab.x.attentionFirst} needs attention first.
                This course is where each of those answers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                Four invented registers on the vendored assurance engines: a crude export terminal&apos;s risks, a gas
                plant&apos;s changes, a water injection project&apos;s peer reviews and a supply base&apos;s lessons.
                Every status on this page and inside every panel is a return value from those engines, pinned by a test
                file against the teaching digest. Statuses, bands and verdicts print in double quotes exactly as the
                engine spells them, and dates print as YYYY-MM-DD. {lab ? `Every one is read on ${lab.a.asOfIso}.` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LESSONS.map((l) => (
                <div key={l.title} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-0">{l.tier}</p>
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

          {tier === 'beginner' && <RiskExplorer />}
          {tier === 'beginner' && <RiskExplorer initialMode="register" />}
          {tier === 'intermediate' && <ChangeExplorer />}
          {tier === 'intermediate' && <ChangeExplorer initialMode="timeline" />}
          {tier === 'advanced' && <ReviewExplorer />}
          {tier === 'advanced' && <ReviewExplorer initialMode="lessons" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these engines do not decide</CardTitle>
              <CardDescription>
                These engines decide what a record means on a stated day. They store nothing, they do not choose a
                likelihood, an approver, a severity or a lesson&apos;s recommendation, and they do not judge whether a
                control works. A band is found by its lower edge alone, a count by band counts whatever list it is
                handed, and an action or a comment whose parent is not supplied still counts as open work: each is a
                stated limit, taught as one and graded nowhere. Audits and their findings belong to Compliance, Audit
                &amp; Quality, and this course reads a finding only as the source of a lesson. The verdicts
                {lab ? ` ${q('Not set')} and the refusals` : ' and the refusals'} on these pages are the engines
                declining to invent an answer, and the judgement stays with the people who sign the register.
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

export default RiskChangeLearningPage;
