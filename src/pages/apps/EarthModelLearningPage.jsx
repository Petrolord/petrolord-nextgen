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
  Loader2, Layers, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import {
  MODEL_SPEC, FAULT_POLYGON, WELLS,
  computeFramework, computeTies, computeBlocksAndProperties,
} from '@/lib/earthmodelTeaching';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
} from '@/services/academyService';

const APP = 'earthmodel';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'A model is a container',
    body: 'An earth model is the geometry everything else lives in: surfaces stacked in depth, zones between them, blocks between faults. Fluids and barrels come later, in ReservoirCalc.' },
  { n: 2, title: 'One frame, many sources',
    body: 'Surfaces arrive on whatever grid mapped them. The model resamples every one onto a single frame, bilinear and honest about nulls, so the stack can be compared node by node.' },
  { n: 3, title: 'Depth must not cross',
    body: 'A base surface above its top is geologically impossible. The monotonic clamp enforces order node by node and REPORTS every node it touched: a pinch-out shows up as a clamp count, not a negative thickness.' },
  { n: 4, title: 'Wells are the ground truth',
    body: 'Minimum curvature turns survey stations into a trajectory; each formation top lands at a 3D point. The residual against the surface there is the tie: small means the framework honors the well.' },
  { n: 5, title: 'Faults make blocks',
    body: 'A fault polygon splits the grid into labeled blocks. Every census, property and volume is per block from then on, because a sealing fault means the numbers must not mix.' },
  { n: 6, title: 'Properties spread from wells',
    body: 'Control points at zone midpoints carry the well values out into the grid: a plane trend when the data are a trend, kriging when you want the wells honored exactly, per block always.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Earth Modeling — Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Earth Modeling course and activate your account to open this app in
        Learning Mode. This course requires a Well Data Manager certification first (it is the
        root of the geoscience path).
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/dashboard/enroll">
          <Button className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
            <GraduationCap className="h-4 w-4 mr-1" /> Enrol
          </Button>
        </Link>
        <Link to="/dashboard/apps/welldata">
          <Button variant="outline" className="border-gray-600 text-gray-200">Well Data Manager course</Button>
        </Link>
      </div>
    </div>
  );
}

const num = (v, dp = 2) => (v == null || Number.isNaN(v) ? '—' : Number(v).toFixed(dp));

const NULLISH = (v) => v > 1e29;

// Shared map scaffolding for the model frame.
function useFrame() {
  const { x0, y0, dx, dy, nx, ny } = MODEL_SPEC;
  const x1 = x0 + (nx - 1) * dx;
  const y1 = y0 + (ny - 1) * dy;
  const W = 640;
  const H = Math.round(W * ((y1 - y0) / (x1 - x0)));
  const sx = (x) => ((x - x0) / (x1 - x0)) * W;
  const sy = (y) => H - ((y - y0) / (y1 - y0)) * H;
  return { W, H, sx, sy, cw: (dx / (x1 - x0)) * W, ch: (dy / (y1 - y0)) * H };
}

// Zone-thickness map: cells shaded by thickness, zero/pinch-out dark.
function ThicknessMap({ grid, label }) {
  const { W, H, sx, sy, cw, ch } = useFrame();
  const { x0, y0, dx, dy, nx } = MODEL_SPEC;
  let max = 0;
  for (const v of grid) if (!NULLISH(v) && v > max) max = v;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
      {Array.from(grid).map((v, j) => {
        if (NULLISH(v)) return null;
        const r = Math.floor(j / nx);
        const c = j % nx;
        return (
          <rect key={j} x={sx(x0 + c * dx) - cw / 2} y={sy(y0 + r * dy) - ch / 2} width={cw} height={ch}
            fill="#22c55e" opacity={v <= 0 ? 0.04 : 0.12 + 0.8 * (v / (max || 1))} />
        );
      })}
      {WELLS.map((w) => (
        <g key={w.name}>
          <circle cx={sx(w.x)} cy={sy(w.y)} r="4" fill="#0F172A" stroke="#BFFF00" strokeWidth="1.5" />
          <text x={sx(w.x) + 7} y={sy(w.y) - 5} fontSize="9" fill="#e2e8f0">{w.name}</text>
        </g>
      ))}
      <text x={8} y={14} fontSize="10" fill="#94a3b8">{label}</text>
    </svg>
  );
}

// Fault-block map: block labels colored, fault polygon outlined.
function BlockMap({ labels }) {
  const { W, H, sx, sy, cw, ch } = useFrame();
  const { x0, y0, dx, dy, nx } = MODEL_SPEC;
  const poly = FAULT_POLYGON.map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(' ') + ' Z';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
      {Array.from(labels).map((lab, j) => {
        const r = Math.floor(j / nx);
        const c = j % nx;
        return (
          <rect key={j} x={sx(x0 + c * dx) - cw / 2} y={sy(y0 + r * dy) - ch / 2} width={cw} height={ch}
            fill={lab === 1 ? '#f97316' : '#38bdf8'} opacity="0.25" />
        );
      })}
      <path d={poly} fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="6 4" />
      {WELLS.map((w) => (
        <g key={w.name}>
          <circle cx={sx(w.x)} cy={sy(w.y)} r="4" fill="#0F172A" stroke="#BFFF00" strokeWidth="1.5" />
          <text x={sx(w.x) + 7} y={sy(w.y) - 5} fontSize="9" fill="#e2e8f0">{w.name}</text>
        </g>
      ))}
      <text x={8} y={14} fontSize="10" fill="#38bdf8">block 0</text>
      <text x={8} y={28} fontSize="10" fill="#f97316">block 1 (inside the fault polygon)</text>
    </svg>
  );
}

const EarthModelLearningPage = () => {
  const { toast } = useToast();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [zone, setZone] = useState('A');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier, gate.allowed]);

  const model = useMemo(() => {
    try { return computeFramework(); } catch (e) { return { error: e.message }; }
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
        toast({ title: 'Passed — you were already certified', className: 'bg-[#BFFF00] text-slate-900' });
      } else {
        toast({
          title: 'Not passing yet',
          description: `${res.score}/${res.max_score} answers within tolerance. Read the panels again.`,
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
      <Helmet><title>Earth Modeling (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Layers className="h-7 w-7 text-[#BFFF00]" /> Earth Modeling
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              The golden three-surface model: TopA / TopB / BaseB from three different source grids onto a
              {' '}{MODEL_SPEC.nx}×{MODEL_SPEC.ny} frame at {MODEL_SPEC.dx} m cells, four tied wells, one sealing fault.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          {/* Lessons */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>From loose surfaces to a blocked, propertied container.</CardDescription>
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

          {/* Beginner panel: the framework */}
          {model.error ? (
            <p className="text-red-400 text-sm">Engine error: {model.error}</p>
          ) : (
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">The structural framework</CardTitle>
                <CardDescription>
                  Resample, clamp, thickness. Zone B pinches out where BaseB was clamped up to TopB;
                  the clamp reports every node it fixed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {['A', 'B'].map((z) => (
                    <button key={z} type="button" onClick={() => setZone(z)}
                      className={`px-3 py-1.5 rounded-md border text-sm ${zone === z ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                      Zone {z}
                    </button>
                  ))}
                </div>
                <ThicknessMap grid={zone === 'A' ? model.fw.thickness[0] : model.fw.thickness[1]} label={`Zone ${zone} thickness`} />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  {[
                    ['Mean TopB depth', `${num(model.s2Stats.mean, 2)} m`],
                    ['Nodes clamped on BaseB', `${model.clampCounts[2]}`],
                    ['Zone A mean thickness', `${num(model.tkA.mean, 2)} m`],
                    ['Zone A max thickness', `${num(model.tkA.max, 2)} m`],
                    ['Zone B mean thickness', `${num(model.tkB.mean, 2)} m`],
                    ['Zone B min thickness', `${num(model.tkB.min, 2)} m (pinch-out)`],
                    ['Zone A bulk volume', `${num(model.bulkA / 1e6, 4)} ×10⁶ m³`],
                    ['Zone B bulk volume', `${num(model.bulkB / 1e6, 4)} ×10⁶ m³`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                      <p className="text-gray-500 text-xs">{k}</p>
                      <p className="text-white">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Bulk volume is the container: thickness × cell area, cell-centred. Barrels need fluids and
                  contacts, and those live in the ReservoirCalc course.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tier toggle */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && !model.error && (() => {
            const ties = computeTies(model.fw);
            return (
              <Card className="bg-[#1E293B] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Well ties (Intermediate)</CardTitle>
                  <CardDescription>
                    Minimum-curvature trajectories, tops landed in 3D, residual = pick TVDSS minus the surface
                    there. W2 is the deviated well: watch what a 45° build does to its ties.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="py-2 pr-4">Well</th><th className="py-2 pr-4">Top</th>
                        <th className="py-2 pr-4">MD</th><th className="py-2 pr-4">TVDSS</th>
                        <th className="py-2 pr-4">Surface z</th><th className="py-2 pr-4">Residual</th>
                      </tr></thead>
                      <tbody>
                        {ties.rows.map((r) => (
                          <tr key={`${r.well}-${r.top}`} className={`border-b border-gray-800 ${r === ties.worst ? 'text-amber-300' : 'text-gray-300'}`}>
                            <td className="py-1.5 pr-4 text-white">{r.well}</td>
                            <td className="py-1.5 pr-4">{r.top}</td>
                            <td className="py-1.5 pr-4">{num(r.md, 0)}</td>
                            <td className="py-1.5 pr-4">{num(r.tvdss, 2)}</td>
                            <td className="py-1.5 pr-4">{num(r.surfaceZ, 2)}</td>
                            <td className="py-1.5 pr-4">{num(r.residualM, 2)} m</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500">
                    Zone A control points for population sit at each zone&apos;s MD midpoint along the path;
                    W2&apos;s lands at x = {num(ties.cpA.find((p) => p.well === 'W2')?.x, 2)} m, well away from its
                    surface location, because deviation moves the bottom of the hole.
                  </p>
                </CardContent>
              </Card>
            );
          })()}

          {tier === 'advanced' && !model.error && (() => {
            const adv = computeBlocksAndProperties(model.fw);
            return (
              <Card className="bg-[#1E293B] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Fault blocks and properties (Advanced)</CardTitle>
                  <CardDescription>
                    The fault polygon labels every node; population and volumes then run per block. Kriging
                    honors the wells exactly and relaxes to the mean far away.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BlockMap labels={adv.labels} />
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                    {[
                      ['Block 0 nodes', `${adv.census['0'] ?? adv.census[0]}`],
                      ['Block 1 nodes', `${adv.census['1'] ?? adv.census[1]}`],
                      ['Trend φ at (1250, 2250)', num(adv.trendAt(1250, 2250), 4)],
                      ['Kriged φ at (1500, 2500)', num(adv.krigeAt(1500, 2500), 4)],
                      ['Kriged φ at W1 (data point)', num(adv.krigeAt(1100, 2100), 4)],
                      ['Zone A φ, block 0 (weighted)', num(adv.phiBlock0, 4)],
                      ['Zone A φ, block 1 (weighted)', num(adv.phiBlock1, 4)],
                      ['Zone A bulk, block 1', `${num(adv.volsA['1'].bulk_m3 / 1e6, 5)} ×10⁶ m³`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                        <p className="text-gray-500 text-xs">{k}</p>
                        <p className="text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Only W1 sits inside the fault polygon, so block 1&apos;s weighted φ IS W1&apos;s value, while
                    block 0 blends W2/W3/W4 by interval length. Kriged φ at W1 equals W1&apos;s 0.315 exactly:
                    simple kriging with a nugget below the sill is an exact interpolator at the data.
                  </p>
                </CardContent>
              </Card>
            );
          })()}

          {/* Capstone */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance — read the panels again and resubmit.
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

export default EarthModelLearningPage;
