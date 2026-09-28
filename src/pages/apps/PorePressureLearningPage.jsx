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
import SvgChartFrame from '@/components/charts/SvgChartFrame';
import { seriesColor, SVG_CHART, AXIS_LINE_PROPS, REFERENCE_LINE_PROPS } from '@/utils/chartSvg';
import {
  Loader2, Gauge, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import {
  WELL, PARAMS, NCT_PICKS, RAMP_TOP_M, TD_M, EATON_N_OPTIONS, TEACHING_EATON_N,
  computeBasics, computePrognosis, computeMudWindow,
} from '@/lib/porepressureTeaching';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
  getCourseProgress,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

const APP = 'porepressure';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'Two pressures bound every well',
    body: 'Pore pressure pushes in, fracture pressure caps what the rock can take. The mud weight must sit between them. Everything in this course exists to place those two curves.' },
  { n: 2, title: 'Hydrostatic is the reference',
    body: 'A column of seawater to the mudline, pore fluid below. Any pore pressure above that column is overpressure, and overpressure is what kicks wells.' },
  { n: 3, title: 'Overburden comes from density, integrated',
    body: 'The total weight of everything above: seawater plus every rock sample, integrated trapezoid by trapezoid. Where the density log is missing, Gardner fills it from velocity.' },
  { n: 4, title: 'The NCT is the yardstick',
    body: 'Normally compacted shale gets faster with depth on a predictable exponential trend. Fit it from clean shale picks with exact least squares. Departures from it are the signal.' },
  { n: 5, title: 'Eaton and Bowers read the departure',
    body: 'Eaton scales the deviation from the trend into pressure. Bowers maps velocity to effective stress directly and can also read unloading, where velocity reverses.' },
  { n: 6, title: 'The answer is a mud window',
    body: 'Convert pore and fracture pressure to equivalent mud weight and the prognosis becomes a drilling decision: the window between kick and losses.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Pore Pressure: Learning Mode locked">
      <p>
        Enrol in the Pore Pressure course and activate your account to open this app in
        Learning Mode. This course requires a Well Data Management certification first (it is the
        root of the geoscience path).
      </p>
    </LearningModeGate>
  );
}

const num = (v, dp = 2) => (v == null || Number.isNaN(v) ? 'n/a' : Number(v).toFixed(dp));

// Pressure-depth plot: hydro / overburden always, PP + FP when given.
function PressurePlot({ prof, showPP }) {
  const W = 640; const H = 420; const PADL = 46; const PADB = 28;
  const zs = WELL.z_bml_m;
  const pMax = Math.max(...prof.overburdenPa) / 1e6 * 1.05;
  const sx = (pMPa) => PADL + (pMPa / pMax) * (W - PADL - 12);
  const sy = (z) => 10 + (z / TD_M) * (H - PADB - 10);
  const path = (arr) => arr.map((p, i) => `${i ? 'L' : 'M'}${sx(p / 1e6).toFixed(1)},${sy(zs[i]).toFixed(1)}`).join(' ');
  const series = [
    ['hydrostatic', prof.hydrostaticPa, seriesColor(0)],
    ['overburden', prof.overburdenPa, SVG_CHART.label],
    ...(showPP ? [
      ['pore pressure', prof.porePressurePa, seriesColor(2)],
      ['fracture', prof.fracPressurePa, seriesColor(1)],
    ] : []),
  ];
  return (
    <SvgChartFrame width={W} height={H} label="Pressure against depth" minWidth={420} maxWidth={720}>
      <line x1={PADL} y1={10} x2={PADL} y2={H - PADB} {...AXIS_LINE_PROPS} />
      <line x1={PADL} y1={H - PADB} x2={W - 12} y2={H - PADB} {...AXIS_LINE_PROPS} />
      {[0, 1000, 2000, 3000, 4000].map((z) => (
        <g key={z}>
          <line x1={PADL - 3} y1={sy(z)} x2={PADL} y2={sy(z)} {...AXIS_LINE_PROPS} />
          <text x={PADL - 6} y={sy(z) + 3} fontSize="9" fill={SVG_CHART.tick} textAnchor="end">{z}</text>
        </g>
      ))}
      {[0, 25, 50, 75].map((p) => (
        <text key={p} x={sx(p)} y={H - PADB + 14} fontSize="9" fill={SVG_CHART.tick} textAnchor="middle">{p} MPa</text>
      ))}
      <line x1={PADL} y1={sy(RAMP_TOP_M)} x2={W - 12} y2={sy(RAMP_TOP_M)} {...REFERENCE_LINE_PROPS} />
      <text x={W - 16} y={sy(RAMP_TOP_M) - 5} fontSize="9" fill={SVG_CHART.note} textAnchor="end">ramp top {RAMP_TOP_M} m</text>
      {series.map(([label, arr, color], i) => (
        <g key={label}>
          <path d={path(arr)} fill="none" stroke={color} strokeWidth="1.8" />
          <text x={PADL + 8} y={24 + i * 13} fontSize="10" fill={color}>{label}</text>
        </g>
      ))}
    </SvgChartFrame>
  );
}

const PorePressureLearningPage = () => {
  const { toast } = useToast();
  const { actualRole } = useRole();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [eatonN, setEatonN] = useState(TEACHING_EATON_N);
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

  const basics = useMemo(() => {
    try { return computeBasics(); } catch (e) { return { error: e.message }; }
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
        toast({ title: 'Passed. You were already certified', className: 'border-pl-success/40 bg-pl-success-bg text-pl-success-text' });
      } else {
        toast({
          title: 'Not passing yet',
          description: `${res.score}/${res.max_score} answers within tolerance. Type the setting the brief states into the course panels and read them again.`,
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
      <Helmet><title>Pore Pressure (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <Gauge className="h-7 w-7 text-pl-primary-text" /> Pore Pressure
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-pl-muted">
              The golden synthetic well: 0 to {TD_M} m below mudline in {PARAMS.waterDepthM} m of water,
              normally compacted to {RAMP_TOP_M} m, then a 4 kPa/m overpressure ramp encoded into the sonic.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          {/* Legacy pocket lessons: superseded by the deep course. They
              only render for tiers whose full content has not shipped. */}
          {!deep && (
          <Card className="bg-pl-surface border-pl-border">
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-primary-text" /> Lessons</CardTitle>
              <CardDescription>From a sonic log to the mud-weight window.</CardDescription>
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

          {/* Beginner panel: the pressure frame */}
          {basics.error ? (
            <p className="text-pl-danger-text text-sm">Engine error: {basics.error}</p>
          ) : (
            <Card className="bg-pl-surface border-pl-border">
              <CardHeader>
                <CardTitle className="text-pl-text">The pressure frame</CardTitle>
                <CardDescription>
                  Hydrostatic and overburden bound the problem; the NCT ({NCT_PICKS.picks_z_m.length} shale
                  picks, exact least squares with matrix dt {NCT_PICKS.dt_ma} µs/m) sets the yardstick.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PressurePlot prof={basics.prof} showPP={tier !== 'beginner'} />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  {[
                    [`Hydrostatic at TD (${TD_M} m)`, `${num(basics.hydroTdPa / 1e6, 3)} MPa`],
                    [`Overburden at TD`, `${num(basics.obTdPa / 1e6, 3)} MPa`],
                    ['Gardner density at 1600 m/s', `${num(basics.gardnerRho1600, 1)} kg/m³`],
                    [`NCT transit time at ${RAMP_TOP_M} m`, `${num(basics.nct2500, 2)} µs/m`],
                    ['Fitted NCT mudline dt', `${num(basics.fit.dtMl, 2)} µs/m`],
                    ['Fitted compaction constant', `${num(basics.fit.c * 1000, 4)} per km`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                      <p className="text-pl-muted text-xs">{k}</p>
                      <p className="text-pl-text">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-pl-muted">
                  The fit comes back with mudline dt {num(basics.fit.dtMl, 1)} and c {num(basics.fit.c * 1000, 2)}/km
                  because the picks were generated on a slightly different trend than the well&apos;s own
                  ({PARAMS.nct.dtMlUsPerM} / {PARAMS.nct.cPerM * 1000}). Fitting recovers what the DATA say.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && (() => {
            const prog = computePrognosis(TEACHING_EATON_N);
            return (
              <Card className="bg-pl-surface border-pl-border">
                <CardHeader>
                  <CardTitle className="text-pl-text">Eaton prognosis (Intermediate), n = {TEACHING_EATON_N}</CardTitle>
                  <CardDescription>
                    The full pipeline over the golden sonic: density → overburden → NCT ratio → Eaton →
                    fracture pressure. Onset = the first sample more than 0.05 MPa above hydrostatic.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    {[
                      ['Overpressure onset', `${prog.onsetM} m`],
                      ['NCT dt at TD', `${num(prog.dtnTd, 2)} µs/m`],
                      ['Pore pressure at 3000 m', `${num(prog.pp3000Pa / 1e6, 3)} MPa`],
                      ['Pore pressure at TD', `${num(prog.ppTdPa / 1e6, 3)} MPa`],
                      ['Overpressure at TD', `${num(prog.overpressureTdPa / 1e6, 3)} MPa`],
                      ['Fracture pressure at TD', `${num(prog.fpTdPa / 1e6, 3)} MPa`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                        <p className="text-pl-muted text-xs">{k}</p>
                        <p className="text-pl-text">{v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-pl-muted">
                    Sanity check the machine: the well imposes 4 kPa/m of overpressure from {RAMP_TOP_M} m,
                    so TD should carry 4 × {(TD_M - RAMP_TOP_M) / 1000} km = 6 MPa above hydrostatic. It does,
                    exactly. That is the forward-inverse consistency the goldens were built for.
                  </p>
                </CardContent>
              </Card>
            );
          })()}

          {tier === 'advanced' && (() => {
            const mw = computeMudWindow();
            const shown = eatonN === TEACHING_EATON_N ? mw.base : mw.alt;
            return (
              <Card className="bg-pl-surface border-pl-border">
                <CardHeader>
                  <CardTitle className="text-pl-text">Mud-weight window and the Bowers cross-check (Advanced)</CardTitle>
                  <CardDescription>
                    Pressures become drilling numbers: equivalent mud weight referenced to sea level
                    (P / g·(z + water depth)). The teaching case reads the n = {TEACHING_EATON_N} window.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    {[
                      ['PP as EMW at TD', `${num(mw.ppEmwTd, 1)} kg/m³`],
                      ['FP as EMW at TD', `${num(mw.fpEmwTd, 1)} kg/m³`],
                      ['Mud-weight window at TD', `${num(mw.windowTd, 1)} kg/m³`],
                      ['Bowers loading v at σ = 5 MPa', `${num(mw.bowersV5MPa, 1)} m/s`],
                      ['Bowers unloading σ from v = 3125.8 m/s', `${num(mw.bowersSigmaUnload / 1e6, 2)} MPa`],
                      ['PP at TD with n = 1.2', `${num(mw.ppTdN12Pa / 1e6, 3)} MPa`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                        <p className="text-pl-muted text-xs">{k}</p>
                        <p className="text-pl-text">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-pl-muted">Eaton exponent:</span>
                    {EATON_N_OPTIONS.map((n) => (
                      <button key={n} type="button" onClick={() => setEatonN(n)}
                        className={`px-3 py-1.5 rounded-md border text-sm ${eatonN === n ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong'}`}>
                        n = {n}
                      </button>
                    ))}
                  </div>
                  <PressurePlot prof={shown.prof} showPP />
                  <p className="text-xs text-pl-muted">
                    Dropping the exponent from 3.0 to 1.2 shaves {num((mw.base.ppTdPa - mw.ppTdN12Pa) / 1e6, 2)} MPa
                    off the TD prognosis: the exponent is a calibration lever, not a constant of nature. Bowers
                    reads the same physics through effective stress, and its unloading form catches velocity
                    reversals Eaton cannot.
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance. Type the setting the brief states into the course panels and read them again.
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

export default PorePressureLearningPage;
