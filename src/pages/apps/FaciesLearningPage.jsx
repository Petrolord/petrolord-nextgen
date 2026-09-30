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
import ClusterExplorer from '@/components/course/panels/facies/ClusterExplorer';
import JudgeExplorer from '@/components/course/panels/facies/JudgeExplorer';
import ClassifyExplorer from '@/components/course/panels/facies/ClassifyExplorer';
import {
  kmeansReader, ariReader, knnReader, uncoredReader, TEACHING,
} from '@/components/course/panels/facies/faciesLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { FACIES_CASE_FILES } from '@/content/capstone-cases/facies';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Electrofacies course page, the third course of the academy's Data & AI
// module, after Oilfield Data Quality and Machine Learning on Well Data. Every
// number it prints is a return value from the teaching lab (faciesLab), which
// is a return value from the vendored clustering engine on the Ekene facies
// wells. It never reads the capstone: panelCapstoneGuard.test.js and
// faciesLab.test.js both grep this file. The capstone case files are imported
// from src/content/capstone-cases/facies and offered on the capstone card only,
// as the dataqc and mlcore courses offer theirs.

const APP = 'facies';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What electrofacies are', body: 'Logs as a signature of rock, core facies and electrofacies, the Ekene facies wells, rows and distance, and the refusals by name.' },
  { tier: 'Associate', title: 'Scaling before distance', body: 'Why gamma ray rules a raw distance, standardising with the population standard deviation, min-max scaling and a constant log.' },
  { tier: 'Associate', title: 'Principal components', body: 'The correlation matrix of the logs, eigenvalues and explained variance, loadings, scores and a new well projected.' },
  { tier: 'Associate', title: 'k-means clustering', body: 'Centres and the nearest centre, seeding with k-means++, Lloyd passes, inertia, and several starts.' },
  { tier: 'Associate', title: 'Reading clusters', body: 'Centres back in log units, cluster numbers as names, new rows at the nearest centre, and covariance against correlation.' },
  { tier: 'Associate', title: 'One field clustered, end to end', body: 'The whole workflow in order, Fisher\'s iris as a published check, and writing up a clustering.' },
  { tier: 'Professional', title: 'Choosing k with the elbow', body: 'Inertia against k, drops and drop fractions, no elbow picked for you, and an inertia that rises.' },
  { tier: 'Professional', title: 'The silhouette', body: 'The two distances behind one row, the mean and each cluster, a row alone, and when the silhouette and the elbow disagree.' },
  { tier: 'Professional', title: 'Agglomerative clustering', body: 'Merging from single rows, Ward, complete and average linkage, the linkage matrix, the cut and a re-cut.' },
  { tier: 'Professional', title: 'Matching clusters to core facies', body: 'The contingency table, one-to-one matching, majority matching and split facies, and scoring a mapped facies.' },
  { tier: 'Professional', title: 'The adjusted Rand index', body: 'Agreement counted in pairs of rows, chance agreement, renamed clusters, and two methods on the same rows.' },
  { tier: 'Professional', title: 'Electrofacies against core, end to end', body: 'The judging workflow, a facies the logs barely separate, and writing up a comparison with core.' },
  { tier: 'Expert', title: 'k nearest neighbours', body: 'The nearest training rows, a scaler fitted on the training rows, a tied vote, equidistant neighbours and choosing k.' },
  { tier: 'Expert', title: 'Classification trees', body: 'Gini impurity, midpoint thresholds, depth, leaves and minimum rows, and reading a printed tree.' },
  { tier: 'Expert', title: 'Ties and exact comparisons', body: 'The root tie between two logs, a split that needs a decrease, a tied leaf, and feature importances.' },
  { tier: 'Expert', title: 'Predicting uncored wells', body: 'Training on the cored wells, an uncalibrated gamma ray tool, the withheld core, and writing a facies back.' },
  { tier: 'Expert', title: 'Boundaries, bands and caps', body: 'Each boundary rule by rule, the tie band, the sign rule of a component, and the row caps.' },
  { tier: 'Expert', title: 'Reading the engine honestly', body: 'Conventions that are choices, what is not built, and the facies note.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Electrofacies Classification: Learning Mode locked">
      <p>
        Enrol in the Electrofacies Classification course, the third course of the Data & AI module, and activate your account to
        open this app in Learning Mode. An electrofacies is a group of depth samples whose logs look alike, and it is
        worth something only when it is checked against the rock, so the course teaches k-means and principal
        components, then the elbow, the silhouette, agglomerative clustering and matching against core, then k nearest
        neighbours and classification trees, and grades each tier with numbers the engine returns.
      </p>
    </LearningModeGate>
  );
}

const FaciesLearningPage = () => {
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

  // Engine calls through the teaching lab, on the Ekene teaching wells only.
  const lab = useMemo(() => {
    try {
      return {
        k: kmeansReader(), a: ariReader(), n: knnReader(), u: uncoredReader(),
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
      <Helmet><title>Electrofacies Classification (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <Database className="h-7 w-7 text-pl-accent-text" /> Electrofacies Classification
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-pl-muted">Data & AI, course three</p>
            {lab && (
              <p className="mt-1 text-pl-muted">
                k-means on four logs of six cored Ekene wells, seed {TEACHING.seed}, reaches an inertia
                of {six(lab.k.teaching.inertia)} and agrees with the core facies at an adjusted Rand index of{' '}
                {six(lab.a.kmeans)}; complete linkage agrees at {six(lab.a.complete)}, and the well names alone at{' '}
                {six(lab.a.wells)}. k nearest neighbours trained on five cored wells predicts the sixth with an accuracy
                of {six(lab.n.accuracy)} on its rows, and an uncored well logged with a hot gamma ray tool puts{' '}
                {lab.u.secondAbove} of its rows above the cored range. This course is where each of those numbers comes
                from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                The Ekene facies wells and Fisher&apos;s iris, on the vendored clustering engine. Every number on this
                page and inside every panel is a return value from that engine, pinned by a test file against the
                figures the lessons quote. Every method here is named by what it is: principal components, k-means,
                agglomerative clustering, k nearest neighbours and a CART classification tree.
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

          {tier === 'beginner' && <ClusterExplorer />}
          {tier === 'beginner' && <ClusterExplorer initialMode="kmeans" />}
          {tier === 'intermediate' && <JudgeExplorer />}
          {tier === 'intermediate' && <JudgeExplorer initialMode="match" />}
          {tier === 'advanced' && <ClassifyExplorer />}
          {tier === 'advanced' && <ClassifyExplorer initialMode="uncored" />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                Clustering scales each log with the population standard deviation fitted on the rows clustered; kNN
                fits it on the training rows only. Principal components come from the correlation matrix by default,
                with the largest weight of each component made positive. k-means seeds with k-means++ from one seeded
                mulberry32 stream, runs ten starts and keeps the lowest inertia. Distances and merge heights within
                1e-12 of each other, relative, are ties, broken toward the lower number. A tree compares splits exactly
                on the facies counts and gives a tie to the log that comes first. The engine fills no missing value,
                chooses no k and names no facies: matching against core does that.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && FACIES_CASE_FILES[tier] && (
                <CapstoneCaseFiles files={FACIES_CASE_FILES[tier]}
                  note="Download the case file the brief names, then paste its rows into the panel view each value belongs to. An uncored well's facies is written null, and no panel loads a case for you." />
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

export default FaciesLearningPage;
