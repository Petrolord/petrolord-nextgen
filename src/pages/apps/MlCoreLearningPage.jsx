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
import FitExplorer from '@/components/course/panels/mlcore/FitExplorer';
import ValidateExplorer from '@/components/course/panels/mlcore/ValidateExplorer';
import DiagnoseExplorer from '@/components/course/panels/mlcore/DiagnoseExplorer';
import {
  olsReader, leakageReader, payReader, diagnoseReader,
} from '@/components/course/panels/mlcore/mlcoreLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { MLCORE_CASE_FILES } from '@/content/capstone-cases/mlcore';

// The Machine Learning on Well Data course page, the second course of the
// academy's Data & AI module. Every number it prints is a return value from the
// teaching lab (mlcoreLab), which is a return value from the vendored machine
// learning engine on the Ekene teaching wells. It never reads the capstone:
// panelCapstoneGuard.test.js and mlcoreLab.test.js both grep this file. The
// capstone case files are imported from src/content/capstone-cases/mlcore and
// offered on the capstone card only, as the dataqc course offers its files.

const APP = 'mlcore';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What a model is', body: 'A rule fitted to data; features and a target; the Ekene wells; what a prediction is; the refusals by name.' },
  { tier: 'Associate', title: 'Data the model has not seen', body: 'Why test data must be unseen, a split by rows, a split by whole wells, and the seed and the shuffle.' },
  { tier: 'Associate', title: 'Scaling on the training rows', body: 'Standardising with the population standard deviation, fitted on the training rows only, and min-max without clipping.' },
  { tier: 'Associate', title: 'Ordinary least squares', body: 'Least squares on several features, reading a coefficient and its unit, the intercept and the standard errors.' },
  { tier: 'Associate', title: 'Fit metrics and residuals', body: 'RMSE and MAE, R-squared on a test set and its reference mean, and residuals well by well.' },
  { tier: 'Associate', title: 'One well held out, end to end', body: 'The whole workflow in order on a well the model never saw, and writing up a fit.' },
  { tier: 'Professional', title: 'Ridge and the bias-variance trade', body: 'A penalty on the coefficients, an unpenalised intercept, effective degrees of freedom, and lambda.' },
  { tier: 'Professional', title: 'Cross-validation by wells', body: 'Every well tested once, round robin folds, leave one well out, and choosing lambda by wells.' },
  { tier: 'Professional', title: 'Leakage', body: 'Features that name a well, the optimism of a random split, when it flatters nothing, and scaling that leaks.' },
  { tier: 'Professional', title: 'Logistic regression', body: 'A label from a stated rule, probabilities and log odds, the fitted coefficients and the threshold at one half.' },
  { tier: 'Professional', title: 'The confusion matrix and its ratios', body: 'Rows true and columns predicted, precision, recall and F1, macro and weighted, and a zero denominator.' },
  { tier: 'Professional', title: 'ROC, AUC and log loss', body: 'The ROC curve and tied scores, AUC as a probability, and log loss with its clip.' },
  { tier: 'Expert', title: 'Conditioning and the NIST reference problems', body: 'The condition number raw and scaled, the refusal limit, Longley, Filip refused, and what a digit means.' },
  { tier: 'Expert', title: 'Separation', body: 'Complete and quasi-complete separation, the exact test before any iteration, and a penalty that fits.' },
  { tier: 'Expert', title: 'Convergence and its stated rule', body: 'Newton steps from zero, the stopping rule in coefficient units, step halving, and a fit that stops early.' },
  { tier: 'Expert', title: 'Importance and learning curves', body: 'Permutation importance with its seed and repeats, a feature that carries nothing, and learning curves in wells.' },
  { tier: 'Expert', title: 'Missing-log prediction end to end', body: 'The well with no sonic, choosing features by wells, a well outside the range, and writing it back.' },
  { tier: 'Expert', title: 'Reading the engine honestly', body: 'Conventions that are choices, what is not built, and the model note.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Machine Learning on Well Data: Learning Mode locked">
      <p>
        Enrol in the Machine Learning on Well Data course and activate your account to open this app in Learning Mode.
        A model is a rule fitted to some wells and judged on wells it has never seen, so the course teaches how to split
        by whole wells, fit least squares and read it, penalise, cross-validate, catch leakage and score a classifier,
        and when the engine refuses, stops or extrapolates, and grades each tier with numbers the engine returns.
      </p>
    </LearningModeGate>
  );
}

const MlCoreLearningPage = () => {
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
      const lk = leakageReader().find((r) => r.seed === 5);
      return {
        o: olsReader(), lk, p: payReader(), d: diagnoseReader(),
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
      <Helmet><title>Machine Learning on Well Data (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Database className="h-7 w-7 text-[#BFFF00]" /> Machine Learning on Well Data
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                Least squares fitted on six Ekene wells predicts the sonic of three wells it never saw with an RMSE of{' '}
                {six(lab.o.test.rmse)} us/ft. Add four well-level attributes and a random-row split scores{' '}
                {six(lab.lk.attributes.randomRow)} while the whole-well split scores {six(lab.lk.attributes.group)}: the
                attributes name the well. A logistic model of a stated pay rule ranks the test wells with an AUC of{' '}
                {six(lab.p.auc)}. And a well with no sonic, drilled through a hot shale, is predicted with an RMSE of{' '}
                {six(lab.d.missingLog.rmse)} against the sonic the synthetic field withheld. This course is where each of
                those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                The Ekene teaching wells and the NIST statistical reference datasets, on the vendored machine learning
                engine. Every number on this page and inside every panel is a return value from that engine, pinned by a
                test file against the figures the lessons quote. Every model here is named by its method: least squares,
                ridge or logistic regression.
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

          {tier === 'beginner' && <FitExplorer />}
          {tier === 'beginner' && <FitExplorer initialMode="ols" />}
          {tier === 'intermediate' && <ValidateExplorer />}
          {tier === 'intermediate' && <ValidateExplorer initialMode="leakage" />}
          {tier === 'advanced' && <DiagnoseExplorer />}
          {tier === 'advanced' && <DiagnoseExplorer initialMode="missing" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                Scaling is fitted on the training rows only and uses the population standard deviation. Splits shuffle
                sorted well names with one seeded mulberry32 stream, and a group split holds out whole wells. Least
                squares is refused when the scaled condition number is above 1e8, and when there are no more rows than
                coefficients. Ridge leaves the intercept unpenalised. Logistic regression tests for separation before
                its first Newton step and stops when the largest full step is at most its tolerance, in coefficient
                units. A test R-squared is taken about the mean of the test targets unless you give another reference.
                The engine fills no missing value, fits linear models only, and never chooses lambda or the features:
                the whole-well scores you compare do that.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && MLCORE_CASE_FILES[tier] && (
                <CapstoneCaseFiles files={MLCORE_CASE_FILES[tier]}
                  note="Download the case file the brief names, then paste its rows into the panel view each value belongs to. A missing sonic is written null, and no panel loads a case for you." />
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

export default MlCoreLearningPage;
