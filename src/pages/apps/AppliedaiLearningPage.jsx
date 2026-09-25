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
import RetrievalExplorer from '@/components/course/panels/appliedai/RetrievalExplorer';
import ScoringExplorer from '@/components/course/panels/appliedai/ScoringExplorer';
import TrustExplorer from '@/components/course/panels/appliedai/TrustExplorer';
import {
  bm25Reader, rankingScoreReader, claimsReader, kappaReader, calibrationReader, TEACHING,
} from '@/components/course/panels/appliedai/evaluateLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Applied AI and Language Models course page, the fifth course of the
// academy's Data & AI module, after Oilfield Data Quality, Machine Learning on
// Well Data, Electrofacies and Data-Driven Production Forecasting. Every number
// it prints is a return value from the teaching lab (evaluateLab), which is a
// return value from the vendored evaluation engine on the Ekene document
// fixtures. No language model runs on this page or behind it. It never reads
// the capstone: panelCapstoneGuard.test.js and evaluateLab.test.js both grep
// this file.

const APP = 'appliedai';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What copilots and retrieval do', body: 'A question, a search and an answer, retrieval before the answer is written, the Ekene document set, what is graded and what never is, and the refusals by name.' },
  { tier: 'Associate', title: 'Tokens', body: 'Lowercasing and splitting text, numbers and well names split apart, the stop list and why it is left off, and counting terms in a passage.' },
  { tier: 'Associate', title: 'TF-IDF', body: 'Term and document frequency, the smoothed inverse document frequency, vectors scaled to unit length, and ranking by cosine.' },
  { tier: 'Associate', title: 'BM25', body: 'The BM25 inverse document frequency, term saturation and k1, length normalisation and b, a repeated query word, and a score read term by term.' },
  { tier: 'Associate', title: 'Ranking and metrics at a cutoff', body: 'Score order and the tie rule, precision and recall at a cutoff, hit and reciprocal rank, and means over queries.' },
  { tier: 'Associate', title: 'Answers that cite their sources', body: 'Prompts that ask for citations, numbers, dates and quotes as claims, and unsupported claims.' },
  { tier: 'Professional', title: 'Average precision and MAP', body: 'Precision at every relevant rank, dividing by every relevant passage, a query with no relevant passage, and the relevance threshold.' },
  { tier: 'Professional', title: 'Graded relevance and nDCG', body: 'Discounted cumulative gain, the ideal ranking, linear and exponential gain, and unjudged passages.' },
  { tier: 'Professional', title: 'Short answers', body: 'Normalising an answer, exact match, token F1, and an empty answer as an abstention.' },
  { tier: 'Professional', title: 'Field extraction', body: 'Fields, records and cells, the four outcomes, numbers within a tolerance, accuracy, precision and recall, micro and macro.' },
  { tier: 'Professional', title: 'Groundedness and its limits', body: 'Cited and retrieved, the reasons a claim fails, grounded and correct as different questions, and how the check reads text.' },
  { tier: 'Professional', title: 'Comparing two systems', body: 'Two systems on the same queries, the paired bootstrap, and writing up a comparison.' },
  { tier: 'Expert', title: 'Annotator agreement', body: "Two annotators on one judged set, observed and expected agreement, Cohen's kappa, linear and quadratic weights, and when kappa has no value." },
  { tier: 'Expert', title: 'Calibration', body: 'A probability and an outcome, the Brier score, the reliability table, and expected and maximum calibration error.' },
  { tier: 'Expert', title: 'Decomposing the Brier score', body: 'Reliability, resolution and uncertainty, the within-bin terms, the bin-edge rule, and log loss from the machine learning engine.' },
  { tier: 'Expert', title: 'Judged sets, pooling and leakage', body: 'How the judged set was pooled, unjudged passages, pooling bias, test questions in a prompt, and a second annotator as a check.' },
  { tier: 'Expert', title: 'Boundaries, ties and caps', body: 'Every boundary rule by rule, the twelve-digit tie key, bootstrap levels and their labels, and the size caps.' },
  { tier: 'Expert', title: 'Reading the engine honestly', body: 'Conventions that are choices, when a model helper is never graded, and the evaluation report.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Applied AI and Language Models: Learning Mode locked">
      <p>
        Enrol in the Applied AI and Language Models course, the fifth course of the Data & AI module, and activate
        your account to open this app in Learning Mode. A copilot is only as good as the passages it retrieves and
        the claims it can support from them, and every part of that can be measured without running a model, so the
        course teaches TF-IDF and BM25 retrieval and metrics at a cutoff, then MAP, nDCG, short-answer and extraction
        scoring, groundedness and a paired comparison, then annotator agreement, calibration and the governance of a
        judged set, and grades each tier with numbers the evaluation engine returns.
      </p>
    </LearningModeGate>
  );
}

const AppliedaiLearningPage = () => {
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

  // Engine calls through the teaching lab, on the Ekene document fixtures only.
  const lab = useMemo(() => {
    try {
      return {
        b: bm25Reader(), r: rankingScoreReader(), c: claimsReader(), k: kappaReader(), cal: calibrationReader(),
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
      <Helmet><title>Applied AI and Language Models (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Database className="h-7 w-7 text-[#BFFF00]" /> Applied AI and Language Models
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Data & AI, course five</p>
            {lab && (
              <p className="mt-1 text-gray-400">
                For the query about Ekene-3&apos;s first oil rate, BM25 ranks a drilling report first on the words rate and of, with a
                score of {six(lab.b.q02[0].score)}, and the passage that answers the query fourth. At a cutoff of {TEACHING.k}, the two fixed
                systems score a MAP of {six(lab.r[0].map1)} and {six(lab.r[1].map1)} when a related passage counts as relevant, and{' '}
                {six(lab.r[0].map2)} and {six(lab.r[1].map2)} when it does not. The first system supports {lab.c[0].supported} of its{' '}
                {lab.c[0].claims} claims in the passages it cites and retrieved, the second {lab.c[1].supported} of {lab.c[1].claims}. Two
                annotators agree with a kappa of {six(lab.k.rows[0].kappa)}, and a relevance probability scores a Brier of{' '}
                {six(lab.cal.brier)}.
                This course is where each of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                The synthetic Ekene document set, on the vendored evaluation engine. Every number on this page and inside
                every panel is a return value from that engine, pinned by a test file against the figures the lessons
                quote. No language model runs here. Every method is named by what it is: TF-IDF and BM25 retrieval,
                metrics at a cutoff, SQuAD answer matching, a claim check, Cohen&apos;s kappa, a Brier decomposition and a
                seeded bootstrap.
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

          {tier === 'beginner' && <RetrievalExplorer />}
          {tier === 'beginner' && <RetrievalExplorer initialMode="bm25" />}
          {tier === 'intermediate' && <ScoringExplorer />}
          {tier === 'intermediate' && <ScoringExplorer initialMode="grounded" />}
          {tier === 'advanced' && <TrustExplorer />}
          {tier === 'advanced' && <TrustExplorer initialMode="calibration" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                Text is lowercased and split outside letters and digits, with no stemming and the stop list off. Only a
                passage with a score above 0 is ranked, scores that agree to twelve significant digits tie and the id
                decides. A passage counts as relevant at grade 1 or more unless you say otherwise, precision divides by
                the cutoff, average precision by every relevant judged passage, and a query with no relevant passage is
                excluded from the means and listed. A claim is supported only by a passage the answer cites and
                retrieved. A calibration bin opens at its lower edge. A bootstrap interval is a percentile of a statistic,
                named with its seed and replicate count. The engine judges nothing a model says: it scores text against
                stated rules.
              </CardDescription>
            </CardHeader>
          </Card>

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

export default AppliedaiLearningPage;
