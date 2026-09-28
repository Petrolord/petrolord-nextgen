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
  Loader2, Atom, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import {
  CONDITIONS, OIL_RHO0, SAND_IN_SITU, SHALE, PHI, KMIN, WEDGE,
  FREQ_OPTIONS, TEACHING_FREQ_HZ, TEACHING_SW, ROMAN_CLASS,
  computeFluids, computeSubstitution, computeAvoScreen,
} from '@/lib/rockphysicsTeaching';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
  getCourseProgress,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

const APP = 'rockphysics';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'Rocks are frames full of fluid',
    body: 'A reservoir rock is a mineral frame with pore fluid inside. Velocities come from moduli and density, so everything starts with K, mu and rho for the frame and for each fluid.' },
  { n: 2, title: 'Fluids from pressure and temperature',
    body: 'Brine, oil and gas properties are not looked up, they are computed. Batzle and Wang turn temperature, pressure, salinity, API and GOR into density and modulus for each phase.' },
  { n: 3, title: 'Mix minerals with bounds, fluids with Wood',
    body: 'The frame modulus sits between the Voigt and Reuss bounds; the Hill average is the working answer. Pore fluids mix the Reuss way (Wood), so a little gas collapses the mixed modulus.' },
  { n: 4, title: 'Gassmann swaps the fluid',
    body: 'Shear ignores the fluid; bulk modulus does not. Gassmann takes the rock from one fluid to another through the dry frame, so you can predict the gas response of a brine sand you logged.' },
  { n: 5, title: 'AVO reads the fluid from offset',
    body: 'The interface reflectivity changes with angle. Shuey intercept and gradient place the sand in a Rutherford-Williams class, and fluid substitution moves that point.' },
  { n: 6, title: 'Thin beds tune',
    body: 'Below the tuning thickness the top and base reflections merge and amplitude peaks. The wedge model tells you the thickness where amplitude stops being a fluid story.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Rock Physics: Learning Mode locked">
      <p>
        Enrol in the Rock Physics course and activate your account to open this app in
        Learning Mode. This course requires a Well Data Management certification first (it is the
        root of the geoscience path).
      </p>
    </LearningModeGate>
  );
}

const num = (v, dp = 2) => (v == null || Number.isNaN(v) ? 'n/a' : Number(v).toFixed(dp));

// AVO crossplot of the two Shuey curves: brine sand vs gas-substituted sand.
function AvoCurves({ curves }) {
  const W = 640; const H = 300; const PAD = 36;
  const all = [...curves.brine, ...curves.gas].map((p) => p.r);
  const rMin = Math.min(...all, 0) - 0.02;
  const rMax = Math.max(...all, 0) + 0.02;
  const sx = (th) => PAD + (th / 40) * (W - PAD - 10);
  const sy = (r) => H - PAD - ((r - rMin) / (rMax - rMin)) * (H - PAD - 10);
  const path = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.theta).toFixed(1)},${sy(p.r).toFixed(1)}`).join(' ');
  return (
    <SvgChartFrame width={W} height={H} label="AVO curves of the brine sand and the gas sand" minWidth={420} maxWidth={720}>
      <line x1={PAD} y1={sy(0)} x2={W - 10} y2={sy(0)} {...REFERENCE_LINE_PROPS} />
      <line x1={PAD} y1={10} x2={PAD} y2={H - PAD} {...AXIS_LINE_PROPS} />
      <line x1={PAD} y1={H - PAD} x2={W - 10} y2={H - PAD} {...AXIS_LINE_PROPS} />
      {[0, 10, 20, 30, 40].map((th) => (
        <text key={th} x={sx(th)} y={H - PAD + 14} fontSize="9" fill={SVG_CHART.tick} textAnchor="middle">{th}°</text>
      ))}
      <text x={PAD - 6} y={sy(0) + 3} fontSize="9" fill={SVG_CHART.tick} textAnchor="end">0</text>
      <path d={path(curves.brine)} fill="none" stroke={seriesColor(0)} strokeWidth="2" />
      <path d={path(curves.gas)} fill="none" stroke={seriesColor(2)} strokeWidth="2" />
      <text x={W - 14} y={sy(curves.brine[curves.brine.length - 1].r) - 6} fontSize="10" fill={seriesColor(0)} textAnchor="end">brine</text>
      <text x={W - 14} y={sy(curves.gas[curves.gas.length - 1].r) + 12} fontSize="10" fill={seriesColor(2)} textAnchor="end">gas</text>
    </SvgChartFrame>
  );
}

// Tuning curve: peak amplitude vs wedge thickness with the pick marked.
function TuningPlot({ tuning }) {
  const W = 640; const H = 240; const PAD = 36;
  const amps = tuning.amplitudes;
  const aMax = Math.max(...amps);
  const sx = (ms) => PAD + (ms / WEDGE.maxThicknessMs) * (W - PAD - 10);
  const sy = (a) => H - PAD - (a / aMax) * (H - PAD - 12);
  const path = amps.map((a, i) => `${i ? 'L' : 'M'}${sx(tuning.thicknessesMs[i]).toFixed(1)},${sy(a).toFixed(1)}`).join(' ');
  return (
    <SvgChartFrame width={W} height={H} label="Tuning curve: peak amplitude against wedge thickness" minWidth={420} maxWidth={720}>
      <line x1={PAD} y1={10} x2={PAD} y2={H - PAD} {...AXIS_LINE_PROPS} />
      <line x1={PAD} y1={H - PAD} x2={W - 10} y2={H - PAD} {...AXIS_LINE_PROPS} />
      {[0, 10, 20, 30, 40, 50, 60].map((ms) => (
        <text key={ms} x={sx(ms)} y={H - PAD + 14} fontSize="9" fill={SVG_CHART.tick} textAnchor="middle">{ms} ms</text>
      ))}
      <path d={path} fill="none" stroke={seriesColor(0)} strokeWidth="2" />
      <line x1={sx(tuning.tuningMs)} y1={12} x2={sx(tuning.tuningMs)} y2={H - PAD} stroke={seriesColor(2)} strokeDasharray="4 3" />
      <text x={sx(tuning.tuningMs) + 5} y={22} fontSize="10" fill={seriesColor(2)}>tuning {tuning.tuningMs} ms</text>
    </SvgChartFrame>
  );
}

const RockPhysicsLearningPage = () => {
  const { toast } = useToast();
  const { actualRole } = useRole();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [sw, setSw] = useState(TEACHING_SW);
  const [freqHz, setFreqHz] = useState(TEACHING_FREQ_HZ);
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

  const fluids = useMemo(() => {
    try { return computeFluids(sw); } catch (e) { return { error: e.message }; }
  }, [sw]);

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
          description: `${res.score}/${res.max_score} answers within tolerance. Type the case the brief states into the course panels, read each figure at full precision and try again.`,
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
      <Helmet><title>Rock Physics (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <Atom className="h-7 w-7 text-pl-primary-text" /> Rock Physics
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-pl-muted">
              The Ekene SAND at {CONDITIONS.tC} °C and {CONDITIONS.pMPa} MPa: {CONDITIONS.salinity * 1e6 / 1e3}k ppm brine,
              {' '}{CONDITIONS.gasGravity}-gravity gas, {Math.round(141.5 / OIL_RHO0 - 131.5)} API oil with GOR {CONDITIONS.gorLL} L/L.
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
              <CardDescription>From fluid properties to the AVO class of a gas sand.</CardDescription>
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

          {/* Beginner panel: fluids + frame */}
          {fluids.error ? (
            <p className="text-pl-danger-text text-sm">Engine error: {fluids.error}</p>
          ) : (
            <Card className="bg-pl-surface border-pl-border">
              <CardHeader>
                <CardTitle className="text-pl-text">Reservoir fluids and the mineral frame at Sw {sw}</CardTitle>
                <CardDescription>
                  The Ekene teaching case at Sw {TEACHING_SW}; the capstone states a case of its own. Drop Sw and watch Wood&apos;s equation collapse the mixed-fluid modulus (lesson 3).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {[1.0, TEACHING_SW, 0.5, 0.2].map((s) => (
                    <button key={s} type="button" onClick={() => setSw(s)}
                      className={`px-3 py-1.5 rounded-md border text-sm ${sw === s ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong'}`}>
                      Sw {s}
                    </button>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  {[
                    ['Brine density', `${num(fluids.brine.rho)} kg/m³`],
                    ['Brine modulus', `${num(fluids.brine.k / 1e9, 4)} GPa`],
                    ['Gas modulus', `${num(fluids.gas.k / 1e6, 2)} MPa`],
                    ['Live-oil density', `${num(fluids.oil.rho)} kg/m³`],
                    ['Frame K (VRH, 70/30 quartz/clay)', `${num(fluids.frame.k / 1e9, 3)} GPa`],
                    ['Frame density', `${num(fluids.frame.rho)} kg/m³`],
                    [`Wood mixed-fluid K at Sw ${sw}`, `${num(fluids.mixed.k / 1e6, 2)} MPa`],
                    ['Mixed-fluid density', `${num(fluids.mixed.rho)} kg/m³`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                      <p className="text-pl-muted text-xs">{k}</p>
                      <p className="text-pl-text">{v}</p>
                    </div>
                  ))}
                </div>
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
            const sub = computeSubstitution();
            return (
              <Card className="bg-pl-surface border-pl-border">
                <CardHeader>
                  <CardTitle className="text-pl-text">Gassmann panel (Intermediate)</CardTitle>
                  <CardDescription>
                    The logged sand (vp {SAND_IN_SITU.vp}, vs {SAND_IN_SITU.vs}, ρ {SAND_IN_SITU.rho}; φ {PHI},
                    K_min {KMIN / 1e9} GPa) is brine-saturated. Substitute to gas through the dry frame.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    {[
                      ['Shear modulus μ (fluid-blind)', `${num(sub.mu / 1e9, 3)} GPa`],
                      ['In-situ K_sat', `${num(sub.ksatInSitu / 1e9, 3)} GPa`],
                      ['Dry-frame K_dry (inverse Gassmann)', `${num(sub.kDry / 1e9, 4)} GPa`],
                      ['Gas-case vp', `${num(sub.gasCase.vp)} m/s`],
                      ['Gas-case vs', `${num(sub.gasCase.vs)} m/s`],
                      ['Gas-case density', `${num(sub.gasCase.rho)} kg/m³`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                        <p className="text-pl-muted text-xs">{k}</p>
                        <p className="text-pl-text">{v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-pl-muted">
                    Where the sonic has no shear: Greenberg-Castagna for the 70/30 sand/shale mix predicts
                    vs {num(sub.gcVs)} m/s at vp 3000 (the mudrock line alone would say {num(sub.mudVs)} m/s).
                    Note vp drops but vs RISES on gas substitution; the fluid lightens the rock and μ does not care.
                  </p>
                </CardContent>
              </Card>
            );
          })()}

          {tier === 'advanced' && (() => {
            const avo = computeAvoScreen(freqHz);
            return (
              <Card className="bg-pl-surface border-pl-border">
                <CardHeader>
                  <CardTitle className="text-pl-text">AVO screening panel (Advanced)</CardTitle>
                  <CardDescription>
                    Ekene shale (vp {SHALE.vp}, vs {SHALE.vs}, ρ {SHALE.rho}) over the SAND, brine case against
                    the gas-substituted case, the teaching case. The capstone brief states an interface and a frequency of its own.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AvoCurves curves={avo.curves} />
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                    {[
                      ['Brine intercept A', num(avo.brineShuey.a, 4)],
                      ['Brine gradient B', num(avo.brineShuey.b, 4)],
                      ['Gas intercept A', num(avo.gasShuey.a, 4)],
                      ['Gas gradient B', num(avo.gasShuey.b, 4)],
                      ['Brine AVO class', `${avo.brineClass} (${ROMAN_CLASS[avo.brineClass]})`],
                      ['Gas AVO class', `${avo.gasClass} (${ROMAN_CLASS[avo.gasClass]})`],
                      ['Exact Zoeppritz Rpp at 30°, gas', num(avo.zoep30.re, 4)],
                      [`Tuning thickness at ${freqHz} Hz`, `${avo.tuning.tuningMs} ms`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                        <p className="text-pl-muted text-xs">{k}</p>
                        <p className="text-pl-text">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-pl-muted">Wedge frequency:</span>
                    {FREQ_OPTIONS.map((f) => (
                      <button key={f} type="button" onClick={() => setFreqHz(f)}
                        className={`px-3 py-1.5 rounded-md border text-sm ${freqHz === f ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong'}`}>
                        {f} Hz
                      </button>
                    ))}
                  </div>
                  <TuningPlot tuning={avo.tuning} />
                  <p className="text-xs text-pl-muted">
                    Substitution flips the sand from class {avo.brineClass} to class {avo.gasClass}: the same
                    frame, a different fluid, an opposite seismic signature. The exact Zoeppritz value at 30°
                    checks the Shuey approximation you screened with.
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance. Type the case the brief states into the course panels and try again.
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

export default RockPhysicsLearningPage;
