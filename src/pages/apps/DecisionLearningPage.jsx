import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, GitBranch, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import TreeExplorer from '@/components/course/panels/decision/TreeExplorer';
import InformationExplorer from '@/components/course/panels/decision/InformationExplorer';
import JudgementExplorer from '@/components/course/panels/decision/JudgementExplorer';
import {
  ekpanTree, okrika, perfectInformation, bayes, analyzer, contradictions,
} from '@/components/course/panels/decision/decisionLab';
import { cardText } from '@/components/course/panels/decision/decisionKit';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

const APP = 'decision';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d })
  : '-');

const LESSONS = [
  { n: 1, title: 'A decision tree is a recipe, and it says what it assumes',
    body: 'Decision nodes take the best branch, chance nodes weight their branches, terminals pay. No discounting, no risk attitude, and a list of inputs it refuses.' },
  { n: 2, title: 'A chance node weights branch values',
    body: 'Probabilities must sum to one within a tight tolerance, a cost on a branch is paid only on that branch, and a linked Monte Carlo payoff enters at its mean.' },
  { n: 3, title: 'A decision node takes the best branch, and a tie goes to the first listed',
    body: 'The node EMV is before the cost on the branch leading into it. Walking away is a branch, and a branch below one not taken is never on the optimal path.' },
  { n: 4, title: 'A sequence rolls back from right to left',
    body: 'OKRIKA appraises first because a poor result can still be sold. Take away the later choice and the appraisal stops paying for itself.' },
  { n: 5, title: 'The decision changes where two lines cross',
    body: 'On the EKPAN lottery Drill and Farm out are straight lines in the success probability. Where they cross, the engine picks by rounding residue or by listing order.' },
  { n: 6, title: 'Perfect information sets the ceiling',
    body: 'Know the outcome first and take its best action. EVPI is the difference from the prior EMV, and it peaks where the prior decision is least settled.' },
  { n: 7, title: 'Bayes turns likelihoods into posteriors',
    body: 'Joint, chance of the signal, posterior, best action per reading. EVII never goes below zero or above EVPI, and a likelihood is not a posterior.' },
  { n: 8, title: 'A survey is bought at its net value',
    body: 'The information tree puts acquiring the survey beside deciding now. At a cost equal to the gross EVII the two tie and the acquisition is kept.' },
  { n: 9, title: 'Accuracy is worth nothing until it can change the action',
    body: 'A survey that cannot pull the success probability across the switch leaves both readings at the same action and is worth zero.' },
  { n: 10, title: 'The VOI Analyzer has two actions and four cards',
    body: 'It offers the named decision and Do Not, shows four cards, keeps the gross voi to its guidance sentence, and its EMV with Information card is after the survey cost.' },
  { n: 11, title: 'Typed inputs can contradict each other',
    body: 'Rounded posteriors imply other outcome chances. Past half a percent the repaired Analyzer withholds the value, and inputs that are not chances at all are refused.' },
  { n: 12, title: 'Bigger lotteries, more readings',
    body: 'Three outcomes and four actions, three readings, a reading that never happens, and a half-scale action that can never be best.' },
  { n: 13, title: 'The decision brief re-rolls the tree',
    body: 'Decision Studio reports the optimal EMV, the first move, the next best and the advantage. An exact tie still names a first move.' },
  { n: 14, title: 'Some inputs are refused and some are silently zero',
    body: 'A blank cost or payoff becomes zero without a word, while a payoff that is not a number is refused. Know which is which before trusting a tree.' },
  { n: 15, title: 'Some numbers are there to be distrusted',
    body: 'A risk neutral recommendation with a loss most of the time, a tie reported as a decision, and a card rounded before its verdict is read.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Decision Analysis & Value of Information: Learning Mode locked">
      <p>
        Enrol in the Decision Analysis &amp; Value of Information course and activate your account to open this
        app in Learning Mode. It rolls back one prospect branch by branch, prices a survey by Bayes, and shows
        when the value a tool prints should not be trusted.
      </p>
    </LearningModeGate>
  );
}

const DecisionLearningPage = () => {
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

  // Every one of these is a cheap engine call through the teaching lab, on the
  // teaching fields EKPAN, OKRIKA and IRRI.
  const lab = useMemo(() => {
    try {
      const t = ekpanTree();
      const an = analyzer();
      return {
        t,
        drill: t.chanceNodes.find((c) => c.path === '0'),
        ok: okrika(),
        pi: perfectInformation(),
        by: bayes(),
        typed: an.ekpanTyped,
        irri: contradictions().irri,
      };
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
      <Helmet><title>Decision Analysis &amp; Value of Information (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <GitBranch className="h-7 w-7 text-[#BFFF00]" /> Decision Analysis &amp; Value of Information
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                A tree is only as honest as the numbers typed into it. The teaching prospect EKPAN rolls back
                to {fmt(lab.t.root.emv)} million USD with {lab.t.root.bestLabel} as its first move, while its drill
                node reads {fmt(lab.drill.emv)} before the {fmt(lab.drill.incomingCost)} cost on the branch into it.
                The OKRIKA discovery is worth {fmt(lab.ok.root.emv)} million USD because it appraises first. On the
                two-outcome EKPAN lottery, perfect information is worth {fmt(lab.pi.evpi)} million USD and the survey
                {' '}{fmt(lab.by.evii)} before its cost, yet the VOI Analyzer, which offers only two actions, gives the
                same survey a gross voi of {cardText(lab.typed.kpis.voi)}. Type IRRI&apos;s contradicting posteriors and
                its Net VOI card reads {cardText(lab.irri.kpis.netVoi)}.
                {' '}This course is where each of those numbers comes from, and which of them to distrust.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                One prospect rolled back, one survey priced, and the judgement to know when a printed value is not
                one, on the vendored Decision Tree Builder engine and VOI Analyzer. Every number on this page and
                inside every panel is a return value from those engines, pinned by a test file against the figures the
                lessons quote.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {LESSONS.map((l) => (
                <div key={l.n} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                  <p className="text-white text-sm font-medium">{l.n}. {l.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{l.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* The workhorse panel, all tiers */}
          <TreeExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <InformationExplorer />}
          {tier === 'advanced' && <JudgementExplorer />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these engines do not do</CardTitle>
              <CardDescription>
                The rollback takes payoffs as already discounted and applies no rate. It is risk neutral: it
                maximises the expected money and cannot prefer an action that never loses. It knows no correlation
                between chance nodes beyond what the tree draws. The VOI Analyzer prices one survey for one decision
                with two actions, and its consistency check refuses numbers that are not chances and withholds a value
                built on chances that contradict each other, without repairing either. None of this is an investment
                decision. It is the arithmetic under one, and the judgement stays with the engineer who signs it.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Capstone */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
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
                          <Input type="number" step="any" value={answers[f.key] ?? ''}
                            onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
                            className="bg-gray-700 text-white border-gray-600 h-8 text-sm" />
                        </div>
                      ))}
                    </div>

                    <Button onClick={submit} disabled={submitting || !capstone}
                      className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
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
                          <p className="flex items-center gap-2"><Award className="h-4 w-4 text-[#BFFF00]" />
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

export default DecisionLearningPage;
