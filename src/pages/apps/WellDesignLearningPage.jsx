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
  Loader2, Compass, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import SurveyExplorer from '@/components/course/panels/welldesign/SurveyExplorer';
import UncertaintyExplorer from '@/components/course/panels/welldesign/UncertaintyExplorer';
import ClearanceExplorer from '@/components/course/panels/welldesign/ClearanceExplorer';
import { pageIntroFigures } from '@/components/course/panels/welldesign/welldesignLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

const APP = 'welldesign';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'A survey is three numbers at a depth, and everything else is inferred',
    body: 'Measured depth, inclination and azimuth. True vertical depth, north, east, dogleg and vertical section are all computed from them by a method somebody chose, and the choice has been wrong before.' },
  { n: 2, title: 'Minimum curvature replaced methods that were 25 ft out',
    body: 'On the published Applied Drilling Engineering example, the tangential method lands 25 ft shallow and 43 ft too far north at 2000 ft of hole. It was the field standard into the 1970s.' },
  { n: 3, title: 'A design is not a well path until it is compiled',
    body: 'Build and hold, S profile, horizontal landing. The compiler turns each into a station list, runs the same survey mathematics over it, and reports the dogleg the design actually implies.' },
  { n: 4, title: 'The position is uncertain, and the model for it is published',
    body: 'The ISCWSA MWD Rev4 error model, reproduced here to machine precision against its own validation workbook. Twenty-seven sources, three propagation modes, one covariance per station.' },
  { n: 5, title: 'The uncertainty budget is not a fixed ranking',
    body: 'At total depth on the validation well one source pays for well over half the variance. At 1200 m, still vertical, the ranking is completely different and the numbers are a hundred times smaller.' },
  { n: 6, title: 'A negative separation factor is not on the same scale as a positive one',
    body: 'On the ISCWSA clearance wells, widening the confidence factor or admitting a larger surface position error makes an overlapping pair look better without moving either well.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Well Design and Surveys: Learning Mode locked">
      <p>
        Enrol in the Well Design and Surveys course and activate your account to open this app in
        Learning Mode. There is no prerequisite inside the Drilling and Completions module, and
        this is the course the rest of the module is built on: every later course puts its own
        engine over a wellbore this one defines.
      </p>
    </LearningModeGate>
  );
}

const WellDesignLearningPage = () => {
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

  const deep = hasDeepCourse(APP, tier);
  const capstoneOpen = !deep
    || courseProgress?.capstone?.unlocked === true
    || courseProgress?.capstone?.passed === true
    || actualRole === 'super_admin';

  // The survey methods, the uncertainty at total depth and the kicked-off
  // clearance case each run the engine, so memoise them rather than re-running
  // on every render. The lab formats them, so the course's leakage gate checks
  // exactly what this intro prints.
  const intro = useMemo(() => pageIntroFigures(), []);

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
      <Helmet><title>Well Design &amp; Surveys (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <Compass className="h-7 w-7 text-pl-accent-text" /> Well Design &amp; Surveys
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-pl-muted">
              A survey is three numbers at a depth. On the published Applied Drilling Engineering
              example the tangential method puts the shoe{' '}
              {intro.tangentialTvdShallowFt} ft shallow and{' '}
              {intro.tangentialNorthFt} ft too far north; minimum curvature lands
              within {intro.minimumCurvatureWithinFt} ft of the published
              answer. At total depth on the ISCWSA validation well the lateral uncertainty is{' '}
              {intro.lateralOverHighside} times the highside one and{' '}
              {intro.dominantCode} pays for{' '}
              {intro.dominantSharePct} percent of the variance.
              And on the standard clearance case with a kickoff, the separation factor is about{' '}
              {intro.kickoffMinSf}, which is negative, and widening the confidence
              factor improves it. This course is how you tell a computed number from a measured one.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>From three numbers at a depth to two wells that must not meet, on four published references.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {LESSONS.map((l) => (
                <div key={l.n} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                  <p className="text-pl-text text-sm font-medium">{l.n}. {l.title}</p>
                  <p className="text-xs text-pl-muted mt-1">{l.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* The workhorse panel, all tiers */}
          <SurveyExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)} aria-pressed={tier === t}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong hover:bg-pl-sunken'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <UncertaintyExplorer />}
          {tier === 'advanced' && <ClearanceExplorer />}

          {/* Capstone */}
          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!capstoneOpen ? (
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
                        <Input type="text" inputMode="decimal" autoComplete="off" value={answers[f.key] ?? ''}
                          onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
                          className="h-8 text-sm" />
                      </div>
                    ))}
                  </div>

                  <Button onClick={submit} disabled={submitting || !capstone}
                    className="font-semibold">
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
                          <p className="flex items-center gap-2"><Award className="h-4 w-4 text-pl-accent-text" />
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

export default WellDesignLearningPage;
