import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import {
  Loader2, GitCompareArrows, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import {
  computeIntermediate, INTERMEDIATE_DATUM, computeAdvanced,
} from '@/lib/correlationTeaching';
import SectionExplorer from '@/components/course/panels/wellcorrelation/SectionExplorer';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
  getCourseProgress,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

const APP = 'wellcorrelation';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'Tops are the correlation currency',
    body: 'A formation top is a named depth pick in one well. Correlation asserts the SAME surface across wells: the polyline joining a top from well to well.' },
  { n: 2, title: 'Structural view vs flattened view',
    body: 'In structural view each well hangs at true MD. Flattening on a top applies a per-well shift so that top lands on one datum line — stratigraphic thickness differences become visible.' },
  { n: 3, title: 'The flattening shift',
    body: 'shift = datum − MD(top in that well). A well 48 m deep to the datum gets shift −48 m; every other depth in that well displays at MD + shift.' },
  { n: 4, title: 'Zone spans and thickness',
    body: 'A zone is the interval between two correlated tops. Its thickness (base − top) is datum-independent: flattening moves the zone but never stretches it.' },
  { n: 5, title: 'Missing tops',
    body: 'A well can lack a top (TD too shallow, faulted out, not deposited). The correlation line simply does not reach that well — never force a pick.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Well Correlation: Learning Mode locked">
      <p>
        Enrol in the Well Correlation course and activate your account to open this app in
        Learning Mode. This course requires a Well Data Management certification first (it is the
        root of the geoscience path).
      </p>
    </LearningModeGate>
  );
}

const num = (v, dp = 1) => (v == null || Number.isNaN(v) ? '—' : Number(v).toFixed(dp));

// SVG section: equal well columns, GR character strip, top markers,
// correlation polylines, SAND zone fill.
const WellCorrelationLearningPage = () => {
  const { toast } = useToast();
  const { actualRole } = useRole();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [capstone, setCapstone] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);

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
    // Deep-path state: which finishing steps the course has unlocked.
    setCourseProgress(null);
    if (hasDeepCourse(APP, tier)) {
      getCourseProgress(APP, tier).then(setCourseProgress).catch(() => setCourseProgress(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier, gate.allowed]);


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
        toast({ title: 'Passed. You were already certified', className: 'border-pl-success/40 bg-pl-success-bg text-pl-success-text' });
      } else {
        toast({
          title: 'Not passing yet',
          description: `${res.score}/${res.max_score} answers within tolerance. Type the section the brief states into the course panels (Type a section) and read them again.`,
          variant: 'destructive',
        });
      }
    } catch (e) {
      toast({ title: 'Submission failed', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // On the deep path the capstone is the LAST step: lessons, module
  // quizzes and the final exam come first (all enforced server-side).
  // Hide the submit UI until the course reports it unlocked, so the old
  // pass-in-minutes surface is gone. Super admins keep the submit UI for
  // the reviewer door (the server's bypass contract).
  const deep = hasDeepCourse(APP, tier);
  const capstoneOpen = !deep
    || courseProgress?.capstone?.unlocked === true
    || courseProgress?.capstone?.passed === true
    || actualRole === 'super_admin';

  if (gate.loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-pl-primary-text" /></div>;
  }
  if (!gate.allowed) return <ScopeGate />;

  return (
    <>
      <Helmet><title>Well Correlation (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <GitCompareArrows className="h-7 w-7 text-pl-primary-text" /> Well Correlation
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-pl-muted">
              The Ekene four-well teaching section. {gate.quota?.own_data_upload === false && 'Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Legacy pocket lessons: superseded by the deep course. They
              only render for tiers whose full content has not shipped. */}
          {!deep && (
          <Card className="bg-pl-surface border-pl-border">
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-primary-text" /> Lessons</CardTitle>
              <CardDescription>Correlation section mechanics, step by step.</CardDescription>
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
          )}

          {/* Section: the shared explorer panel (also embedded in DC6 lessons) */}
          <SectionExplorer />

          {/* Tier toggle + intermediate panel */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && (() => {
            const inter = computeIntermediate();
            return (
              <Card className="bg-pl-surface border-pl-border">
                <CardHeader>
                  <CardTitle className="text-pl-text">Growth analysis (Intermediate)</CardTitle>
                  <CardDescription>
                    Flattened on {INTERMEDIATE_DATUM.topName} at {INTERMEDIATE_DATUM.datumM} m — the A-to-SAND interval thickens where accommodation grew.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-pl-muted border-b border-pl-border">
                        <th className="py-2 pr-4">Well</th><th className="py-2 pr-4">Shift</th>
                        <th className="py-2 pr-4">TOP_A→TOP_SAND</th><th className="py-2 pr-4">TOP_SAND (displayed)</th>
                        <th className="py-2 pr-4">All four tops?</th>
                      </tr></thead>
                      <tbody>
                        {inter.rows.map((r) => (
                          <tr key={r.id} className="border-b border-pl-border text-pl-text">
                            <td className="py-2 pr-4 text-pl-text">{r.name}</td>
                            <td className="py-2 pr-4">{num(r.shift)} m</td>
                            <td className="py-2 pr-4">{num(r.aToSand)} m</td>
                            <td className="py-2 pr-4">{num(r.sandDisplayed)} m</td>
                            <td className="py-2 pr-4">{r.allFourTops ? 'yes' : <span className="text-pl-danger-text">no</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 text-sm">
                    {[
                      ['Growth range (max − min)', `${num(inter.growthRange)} m`],
                      ['Wells with all four tops', `${inter.wellsWithAllTops}`],
                      ['Displayed depth span', `${num(inter.displayedSpan)} m`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                        <p className="text-pl-muted text-xs">{k}</p>
                        <p className="text-pl-text">{v}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {tier === 'advanced' && (() => {
            const adv = computeAdvanced();
            return (
              <Card className="bg-pl-surface border-pl-border">
                <CardHeader>
                  <CardTitle className="text-pl-text">Missing-pick prediction (Advanced)</CardTitle>
                  <CardDescription>
                    Ekene-4 TDs above TOP_B. Two interval methods project the missing pick from the three wells that carry it; the spread between them is the growth uncertainty.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-pl-muted border-b border-pl-border">
                        <th className="py-2 pr-4">Well</th><th className="py-2 pr-4">TOP_B</th>
                        <th className="py-2 pr-4">TOP_A to TOP_B</th><th className="py-2 pr-4">TOP_SAND to TOP_B</th>
                      </tr></thead>
                      <tbody>
                        {adv.rows.map((r) => (
                          <tr key={r.id} className="border-b border-pl-border text-pl-text">
                            <td className="py-2 pr-4 text-pl-text">{r.name}</td>
                            <td className="py-2 pr-4">{r.topB} m</td>
                            <td className="py-2 pr-4">{r.aToB} m</td>
                            <td className="py-2 pr-4">{r.sandToB} m</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    {[
                      ['Mean TOP_A to TOP_B interval', `${adv.aToBMean.toFixed(2)} m`],
                      ['Mean TOP_SAND to TOP_B interval', `${adv.sandToBMean.toFixed(2)} m`],
                      ['Ekene-4 TOP_B, layer-cake estimate', `${adv.w4TopBLayercake.toFixed(2)} m`],
                      ['Ekene-4 TOP_B, from TOP_SAND', `${adv.w4TopBFromSand.toFixed(2)} m`],
                      ['Spread between the estimates', `${adv.predictionSpread.toFixed(2)} m`],
                      ['TOP_B structural relief (3 wells)', `${adv.topBRelief.toFixed(2)} m`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                        <p className="text-pl-muted text-xs">{k}</p>
                        <p className="text-pl-text">{v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-pl-muted">
                    The section grows toward Ekene-4, so the layer-cake estimate is a floor and the TOP_SAND projection a better anchor. Report the spread honestly rather than picking a favourite.
                  </p>
                </CardContent>
              </Card>
            );
          })()}

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
                            {result.tier === 'expert' && ' Your 50% Suite discount code is on your certificates page.'}</p>
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance. Type the section the brief states into the course panels and read them again.
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

export default WellCorrelationLearningPage;
