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
  Loader2, FlaskConical, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import CorrelationExplorer from '@/components/course/panels/fluid/CorrelationExplorer';
import StudyExplorer from '@/components/course/panels/fluid/StudyExplorer';
import TuningExplorer from '@/components/course/panels/fluid/TuningExplorer';
import { goodOilMeasured, goodOilUntuned, tuningLedger, correlationSpread, EKENE } from '@/components/course/panels/fluid/fluidLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

const APP = 'fluid';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'Every number came from somewhere, and the somewhere has a tier',
    body: 'Measured, correlated, computed by a tuned equation of state, or a screening estimate nobody checked. This course is about telling them apart, and the engine states its own tier for every quantity it returns.' },
  { n: 2, title: 'A correlation is a fit to somebody else\u2019s oils',
    body: 'Standing, Vasquez-Beggs and Glaso disagree on the same fluid because they were fitted to different samples. Each carries the range it was fitted over, and the engine will tell you when you have left it.' },
  { n: 3, title: 'Viscosity is three correlations in series',
    body: 'A dead oil, then the thinning that dissolved gas does to it, then the thickening that pressure does above the bubble point. Quote a viscosity without saying which chain produced it and you have said very little.' },
  { n: 4, title: 'A laboratory study is data, not truth',
    body: 'Good Oil Well No. 4 is a real published report: a composition, a separator test and four measured numbers. Reading it is a skill, and the stock tank stage it does not list is where reproductions go wrong.' },
  { n: 5, title: 'An untuned equation of state has known biases',
    body: 'On this fluid it saturates six percent high and comes out nine API light, and both are documented rather than surprising. It also refuses to report a formation volume factor, and the refusal is correct.' },
  { n: 6, title: 'Tuning trades targets against each other',
    body: 'Four bounded knobs on one pseudo-component, four laboratory targets, and one of them gets worse. That trade is the honest shape of the fit, and reporting it is the Expert tier.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Fluid Properties and PVT: Learning Mode locked">
      <p>
        Enrol in the Fluid Properties and PVT course and activate your account to open this app in
        Learning Mode. There is no prerequisite inside the Reservoir Engineering module, though
        Waterflood Management is the recommended course before this one, because the ledger,
        the layer column and the rock curves this deck is built from all come from it.
      </p>
    </LearningModeGate>
  );
}

const FluidLearningPage = () => {
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

  // Characterizes the plus fraction and runs the regression, so memoise it
  // rather than re-running on every render (including while the gate loads).
  const fluid = useMemo(() => {
    const ledger = tuningLedger();
    return {
      lab: goodOilMeasured(),
      model: goodOilUntuned(),
      ledger,
      traded: ledger.filter((r) => !r.improved),
      pbSpread: (() => {
        const pbs = correlationSpread({
          api: EKENE.api, gasSg: EKENE.gasSg, tempF: EKENE.tempF,
          pbPsia: EKENE.pbPsia, rsScfStb: EKENE.rsDesignScfStb,
        }).map((c) => c.pbAtRs);
        return Math.max(...pbs) - Math.min(...pbs);
      })(),
    };
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
          description: `${res.score}/${res.max_score} answers within tolerance. Set the case the brief states in the course panels and try again.`,
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
      <Helmet><title>Fluid Properties &amp; PVT (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <FlaskConical className="h-7 w-7 text-pl-primary-text" /> Fluid Properties &amp; PVT
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-pl-muted">
              Two fluids and one question. Ekene's oil was designed rather than measured, and the
              three published correlations disagree about its bubble point by{' '}
              {fluid.pbSpread.toFixed(0)} psia. Good Oil Well No. 4 was measured: a real Core
              Laboratories study reporting {fluid.lab.totalGorScfStb} scf/stb and{' '}
              {fluid.lab.stockTankApi} API. An untuned equation of state gets that study's stock tank
              gravity wrong by {(fluid.model.stockTankApi - fluid.lab.stockTankApi).toFixed(1)} API,
              and tuning four knobs to fix it makes{' '}
              {fluid.traded.map((r) => r.name).join(' and ') || 'nothing'} worse. This course is how
              you say which kind of number you are holding.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Lessons overview */}
          <Card className="bg-pl-surface border-pl-border">
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-primary-text" /> Lessons</CardTitle>
              <CardDescription>From a correlation nobody checked to an equation of state tuned against a real laboratory report.</CardDescription>
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
          <CorrelationExplorer />

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && <StudyExplorer />}
          {tier === 'advanced' && <TuningExplorer />}

          {/* Capstone */}
          <Card className="bg-pl-surface border-pl-border">
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!capstoneOpen ? (
                <div className="rounded-md border border-pl-border bg-pl-sunken p-4 text-sm text-pl-text flex items-start gap-2">
                  <Lock className="h-4 w-4 text-pl-primary-text mt-0.5 shrink-0" />
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
                <div className={`rounded-md border p-4 ${result.passed ? 'border-pl-success/40 bg-pl-success-bg' : 'border-pl-danger/40 bg-pl-danger-bg'}`}>
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance. Set the case the brief states in the course panels and try again.
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

export default FluidLearningPage;
