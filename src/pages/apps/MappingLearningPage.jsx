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
  Loader2, Map, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import {
  TEACHING_WELLS, TOP_NAME, CAPSTONE_CELL_M, MAX_EXTRAP_M, TARGET, computeMap,
  computeIntermediate,
} from '@/lib/mappingTeaching';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
} from '@/services/academyService';

const APP = 'mapping';
const LEARN_TIERS = ['beginner', 'intermediate'];
const CELLS = [50, 100, 200];

const LESSONS = [
  { n: 1, title: 'From picks to points',
    body: 'A structure map starts as control points: each well contributes (x, y, depth) for the mapped top. Wells lacking the pick are simply skipped.' },
  { n: 2, title: 'The grid',
    body: 'A surface is a regular grid of nodes covering the points plus a padding margin. Cell size sets resolution: halve the cell and the node count quadruples.' },
  { n: 3, title: 'Interpolation (thin-plate spline)',
    body: 'The gridder fits the smoothest surface honoring every control point exactly, then evaluates it at each node. Between wells it interpolates; it can place a crest the wells only bracket.' },
  { n: 4, title: 'Where a map is honest',
    body: 'Nodes outside the well hull, or farther than the extrapolation limit from any well, stay unmapped. A map that fills the whole rectangle is claiming knowledge it does not have.' },
  { n: 5, title: 'Contours',
    body: 'Contour lines join equal depths at a regular interval chosen from the surface range. Closed contours around a shallow area outline the crest of the structure.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Mapping — Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Mapping course and activate your account to open this app in Learning
        Mode. This course requires a Well Data Manager certification first (it is the root of
        the geoscience path).
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

// SVG map: contour polylines in world coordinates, well posts, P-1.
function MapView({ map }) {
  const { spec, contours, points } = map;
  const x1 = spec.x0 + (spec.nx - 1) * spec.dx;
  const y1 = spec.y0 + (spec.ny - 1) * spec.dy;
  const W = 640;
  const H = Math.round(W * ((y1 - spec.y0) / (x1 - spec.x0)));
  const sx = (x) => ((x - spec.x0) / (x1 - spec.x0)) * W;
  // world y grows north; screen y grows down
  const sy = (y) => H - ((y - spec.y0) / (y1 - spec.y0)) * H;
  const zMin = map.summary.zMin;
  const zMax = map.summary.zMax;
  const hue = (level) => 200 - 160 * ((level - zMin) / (zMax - zMin || 1));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
      {contours.map((c) => c.lines.map((line, li) => (
        <g key={`${c.level}-${li}`}>
          <polyline
            points={line.map(([x, y]) => `${sx(x)},${sy(y)}`).join(' ')}
            fill="none" stroke={`hsl(${hue(c.level)}, 80%, 60%)`} strokeWidth="1.2" />
          {line.length > 4 && (
            <text x={sx(line[Math.floor(line.length / 2)][0])} y={sy(line[Math.floor(line.length / 2)][1]) - 2}
              fontSize="8" fill={`hsl(${hue(c.level)}, 80%, 70%)`}>{c.level}</text>
          )}
        </g>
      )))}
      {points.map((p) => (
        <g key={p.well}>
          <circle cx={sx(p.x)} cy={sy(p.y)} r="4" fill="#0F172A" stroke="#BFFF00" strokeWidth="1.5" />
          <text x={sx(p.x) + 7} y={sy(p.y) - 5} fontSize="9" fill="#e2e8f0">{p.well}</text>
          <text x={sx(p.x) + 7} y={sy(p.y) + 7} fontSize="8" fill="#94a3b8">{p.z} m</text>
        </g>
      ))}
      <g>
        <line x1={sx(TARGET.x) - 6} x2={sx(TARGET.x) + 6} y1={sy(TARGET.y)} y2={sy(TARGET.y)} stroke="#f472b6" strokeWidth="1.5" />
        <line x1={sx(TARGET.x)} x2={sx(TARGET.x)} y1={sy(TARGET.y) - 6} y2={sy(TARGET.y) + 6} stroke="#f472b6" strokeWidth="1.5" />
        <text x={sx(TARGET.x) + 8} y={sy(TARGET.y) + 3} fontSize="9" fill="#f472b6">{TARGET.label}</text>
      </g>
    </svg>
  );
}

const MappingLearningPage = () => {
  const { toast } = useToast();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [cell, setCell] = useState(CAPSTONE_CELL_M);
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

  const map = useMemo(() => {
    try {
      return computeMap(cell);
    } catch (e) {
      return { error: e.message };
    }
  }, [cell]);

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
        toast({ title: 'Capstone passed — Associate certified!', description: res.certificate_number, className: 'bg-[#BFFF00] text-slate-900' });
      } else if (res.passed) {
        toast({ title: 'Passed — you were already certified', className: 'bg-[#BFFF00] text-slate-900' });
      } else {
        toast({
          title: 'Not passing yet',
          description: `${res.score}/${res.max_score} answers within tolerance. Set the cell to ${CAPSTONE_CELL_M} m and re-read the map panel.`,
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

  const s = map.summary;

  return (
    <>
      <Helmet><title>Mapping (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Map className="h-7 w-7 text-[#BFFF00]" /> Mapping
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              {TOP_NAME} structure map over the Ekene teaching wells ({MAX_EXTRAP_M} m extrapolation limit).
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          {/* Lessons */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>From well picks to a contoured structure map.</CardDescription>
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

          {map.error ? (
            <p className="text-red-400 text-sm">Engine error: {map.error}</p>
          ) : (
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Structure map — {cell} m cell</CardTitle>
                <CardDescription>The capstone grades the {CAPSTONE_CELL_M} m grid. Toggle the cell size and watch resolution and node counts change.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {CELLS.map((c) => (
                    <button key={c} type="button" onClick={() => setCell(c)}
                      className={`px-3 py-1.5 rounded-md border text-sm ${cell === c ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                      {c} m
                    </button>
                  ))}
                </div>

                <MapView map={map} />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  {[
                    ['Control points', `${s.nPoints}`],
                    ['Grid (nx × ny)', `${s.nx} × ${s.ny} nodes`],
                    ['Mapped (live) nodes', `${s.liveNodes}`],
                    ['Crest / deepest', `${num(s.zMin)} / ${num(s.zMax)} m`],
                    ['Mean depth', `${num(s.zMean)} m`],
                    [`Depth at ${TARGET.label} (${TARGET.x}, ${TARGET.y})`, s.depthAtTarget == null ? 'unmapped' : `${num(s.depthAtTarget)} m`],
                    ['Contour interval', `${s.contourStep} m`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                      <p className="text-gray-500 text-xs">{k}</p>
                      <p className="text-white">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Note where the crest sits: between the wells, near {TEACHING_WELLS[5].name} — the spline interpolates a culmination the wells only bracket (lesson 3).
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tier toggle + intermediate panel */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'intermediate' && (() => {
            const inter = computeIntermediate();
            return (
              <Card className="bg-[#1E293B] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Isochore panel (Intermediate)</CardTitle>
                  <CardDescription>
                    Two-surface math: BASE_SAND minus TOP_SAND on the shared {CAPSTONE_CELL_M} m frame. Compare the gridded mean against the plain well average.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    {[
                      ['Isochore min / max', `${num(inter.isoMin)} / ${num(inter.isoMax)} m`],
                      ['Isochore mean', `${num(inter.isoMean)} m`],
                      ['Live isochore nodes', `${inter.isoLive}`],
                      [`Thickness at ${TARGET.label}`, inter.isoAtP1 == null ? 'unmapped' : `${num(inter.isoAtP1)} m`],
                      ['Mean of the six well thicknesses', `${num(inter.meanWellThickness, 3)} m`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                        <p className="text-gray-500 text-xs">{k}</p>
                        <p className="text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-gray-400">
                      <thead><tr className="text-left text-gray-500 border-b border-gray-700">
                        <th className="py-1 pr-3">Well</th><th className="py-1 pr-3">SAND thickness</th>
                      </tr></thead>
                      <tbody>
                        {inter.wellThk.map((w) => (
                          <tr key={w.name} className="border-b border-gray-800/60">
                            <td className="py-1 pr-3 text-white">{w.name}</td>
                            <td className="py-1 pr-3">{w.thickness} m</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                            {result.tier === 'professional' ? 'Professional' : 'Associate'} certificate <span className="font-mono text-[#BFFF00]">{result.certificate_number}</span> issued.</p>
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance — set the cell to {CAPSTONE_CELL_M} m and read the map panel again.
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

export default MappingLearningPage;
