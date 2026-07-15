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
  Loader2, Calculator, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import {
  TEACHING_WELLS, CELL_M, CAPSTONE_OWC_M, OWC_OPTIONS, PROPS, computeVolumes,
} from '@/lib/reservoircalcTeaching';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
} from '@/services/academyService';

const APP = 'reservoircalc';
const TIER = 'beginner';

const LESSONS = [
  { n: 1, title: 'The volumetrics chain',
    body: 'STOIIP = GRV × NTG × φ × (1 − Sw) / Bo. Each factor strips the volume down: rock that is reservoir, space that is pore, pore that holds oil, oil shrunk to stock-tank conditions.' },
  { n: 2, title: 'Gross rock volume from surfaces',
    body: 'GRV is the rock between the top surface and the deeper of nothing: the base surface or the fluid contact. Only the part of the trap above the OWC holds oil.' },
  { n: 3, title: 'The contact is the biggest lever',
    body: 'Move the OWC a few metres and watch the volumes swing. Contact uncertainty usually dominates volumetric uncertainty — that is why it gets tested first.' },
  { n: 4, title: 'The grid is the integration mesh',
    body: 'Volumes are summed cell by cell: thickness × cell area, then × NTG × φ × (1 − Sw). No analytic shortcut — the same mesh that drew your map computes your volumes.' },
  { n: 5, title: 'Units discipline',
    body: 'Everything sums in cubic metres. Stock-tank barrels arrive only at the end: 1 m³ = 6.2898 stb, divided by Bo because reservoir oil shrinks as gas comes out of solution.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">ReservoirCalc — Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the ReservoirCalc course and activate your account to open this app in
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

// SVG oil-extent map: cells shaded by oil-column thickness, well posts.
function OilMap({ vols }) {
  const { spec, topPts, oilNodes, maxCol } = vols;
  const x1 = spec.x0 + (spec.nx - 1) * spec.dx;
  const y1 = spec.y0 + (spec.ny - 1) * spec.dy;
  const W = 640;
  const H = Math.round(W * ((y1 - spec.y0) / (x1 - spec.x0)));
  const sx = (x) => ((x - spec.x0) / (x1 - spec.x0)) * W;
  const sy = (y) => H - ((y - spec.y0) / (y1 - spec.y0)) * H;
  const cw = (spec.dx / (x1 - spec.x0)) * W;
  const ch = (spec.dy / (y1 - spec.y0)) * H;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
      {oilNodes.map(({ j, t }) => {
        const r = Math.floor(j / spec.nx);
        const c = j % spec.nx;
        const x = spec.x0 + c * spec.dx;
        const y = spec.y0 + r * spec.dy;
        return (
          <rect key={j} x={sx(x) - cw / 2} y={sy(y) - ch / 2} width={cw} height={ch}
            fill="#22c55e" opacity={0.15 + 0.75 * (t / (maxCol || 1))} />
        );
      })}
      {topPts.map((p) => (
        <g key={p.well}>
          <circle cx={sx(p.x)} cy={sy(p.y)} r="4" fill="#0F172A" stroke="#BFFF00" strokeWidth="1.5" />
          <text x={sx(p.x) + 7} y={sy(p.y) - 5} fontSize="9" fill="#e2e8f0">{p.well}</text>
          <text x={sx(p.x) + 7} y={sy(p.y) + 7} fontSize="8" fill="#94a3b8">{p.z} m</text>
        </g>
      ))}
    </svg>
  );
}

const ReservoirCalcLearningPage = () => {
  const { toast } = useToast();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [owc, setOwc] = useState(CAPSTONE_OWC_M);
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
        if (allowed) setCapstone(await getCapstone(APP, TIER));
      } catch (e) {
        setGate({ loading: false, allowed: false, quota: null });
        toast({ title: 'Could not open the app', description: e.message, variant: 'destructive' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vols = useMemo(() => {
    try {
      return computeVolumes(owc);
    } catch (e) {
      return { error: e.message };
    }
  }, [owc]);

  const watermark = gate.quota?.export_watermark;

  const submit = async () => {
    setSubmitting(true);
    try {
      const numeric = Object.fromEntries(
        (capstone?.fields || []).map((f) => [f.key, answers[f.key] === '' || answers[f.key] === undefined ? null : Number(answers[f.key])]),
      );
      const res = await submitCapstone(APP, TIER, numeric);
      setResult(res);
      if (res.passed && res.certificate_number) {
        toast({ title: 'Capstone passed — Associate certified!', description: res.certificate_number, className: 'bg-[#BFFF00] text-slate-900' });
      } else if (res.passed) {
        toast({ title: 'Passed — you were already certified', className: 'bg-[#BFFF00] text-slate-900' });
      } else {
        toast({
          title: 'Not passing yet',
          description: `${res.score}/${res.max_score} answers within tolerance. Set the OWC to ${CAPSTONE_OWC_M} m and re-read the panel.`,
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

  const s = vols.summary;

  return (
    <>
      <Helmet><title>ReservoirCalc (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Calculator className="h-7 w-7 text-[#BFFF00]" /> ReservoirCalc
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              Ekene SAND volumetrics ({CELL_M} m grid; NTG {PROPS.ntg}, φ {PROPS.phi}, Sw {PROPS.sw}, Bo {PROPS.bo}).
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          {/* Lessons */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>From two surfaces and a contact to STOIIP.</CardDescription>
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

          {vols.error ? (
            <p className="text-red-400 text-sm">Engine error: {vols.error}</p>
          ) : (
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Oil extent and volumes — OWC {owc} m</CardTitle>
                <CardDescription>The capstone grades the {CAPSTONE_OWC_M} m contact. Move the OWC and watch lesson 3 happen.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {OWC_OPTIONS.map((c) => (
                    <button key={c} type="button" onClick={() => setOwc(c)}
                      className={`px-3 py-1.5 rounded-md border text-sm ${owc === c ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                      OWC {c} m
                    </button>
                  ))}
                </div>

                <OilMap vols={vols} />
                <p className="text-xs text-gray-500">Green cells hold oil; darker means a thicker column. Well posts show the TOP_SAND pick.</p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  {[
                    ['Oil-bearing cells', `${s.oilCells}`],
                    ['Maximum oil column', `${num(s.maxOilColumn)} m`],
                    ['Gross rock volume', `${num(s.grvMm3, 3)} ×10⁶ m³`],
                    ['Net rock volume', `${num(s.netMm3, 3)} ×10⁶ m³`],
                    ['Pore volume', `${num(s.poreMm3, 4)} ×10⁶ m³`],
                    ['Hydrocarbon pore volume', `${num(s.hcpvMm3, 4)} ×10⁶ m³`],
                    ['STOIIP', `${num(s.stoiipMmstb, 3)} MMstb`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                      <p className="text-gray-500 text-xs">{k}</p>
                      <p className="text-white">{v}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
                            Associate certificate <span className="font-mono text-[#BFFF00]">{result.certificate_number}</span> issued.
                            That completes the geoscience Beginner path — every course in the daily loop.</p>
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance — set the OWC to {CAPSTONE_OWC_M} m and read the panel again.
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

export default ReservoirCalcLearningPage;
