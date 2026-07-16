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
  Loader2, Flame, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import {
  PROJECT, HEAT_FIXTURE, RAMP_RATES, CAPSTONE_RAMP,
  computeBurialHeat, computeKinetics, computeReferenceBasin,
} from '@/lib/basinTeaching';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
} from '@/services/academyService';

const APP = 'basin';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'A basin is a time machine',
    body: 'Layers stack up, compact, heat, and cook. The forward model replays the whole history one million years at a time, from first deposition to today.' },
  { n: 2, title: 'Compaction is porosity loss',
    body: 'Porosity decays exponentially with depth (Sclater-Christie). The grains are conserved: solid thickness is the invariant that lets one layer be decompacted back to any burial depth.' },
  { n: 3, title: 'Heat flows up through the stack',
    body: 'Basal heat flow conducts through every layer; low conductivity means a steep gradient. The steady profile through a two-layer column is exactly piecewise linear.' },
  { n: 4, title: 'Maturity is chemistry with a clock',
    body: 'Easy%Ro integrates twenty parallel Arrhenius reactions along the temperature history. Time matters as much as temperature: a slower burial matures MORE at the same temperature.' },
  { n: 5, title: 'The kitchen generates and expels',
    body: 'Kerogen potentials transform to a ratio; TOC, HI and grain mass turn that into kilograms per square metre. Expulsion starts once the retention bucket fills.' },
  { n: 6, title: 'Erosion leaves a signature',
    body: 'Eroded section heated the rocks below while it was there. A basin that lost 600 m is MORE mature than its preserved twin, and calibration data can tell them apart.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Basin &amp; Charge — Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Basin &amp; Charge course and activate your account to open this app in
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

// Steady heat column: temperature vs depth, kink at the interface.
function HeatColumnPlot({ nodes, temps }) {
  const W = 640; const H = 320; const PADL = 46; const PADB = 26;
  const zMax = nodes[nodes.length - 1].z;
  const tMax = Math.max(...temps) * 1.05;
  const sx = (t) => PADL + (t / tMax) * (W - PADL - 12);
  const sy = (z) => 10 + (z / zMax) * (H - PADB - 10);
  const path = temps.map((t, i) => `${i ? 'L' : 'M'}${sx(t).toFixed(1)},${sy(nodes[i].z).toFixed(1)}`).join(' ');
  const zIface = HEAT_FIXTURE.layers[0].h_m;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
      <line x1={PADL} y1={10} x2={PADL} y2={H - PADB} stroke="#334155" />
      <line x1={PADL} y1={H - PADB} x2={W - 12} y2={H - PADB} stroke="#334155" />
      {[0, 20, 40, 60].map((t) => (
        <text key={t} x={sx(t)} y={H - PADB + 14} fontSize="9" fill="#64748b" textAnchor="middle">{t} °C</text>
      ))}
      {[0, 500, 1000, 1500, 2000].map((z) => (
        <text key={z} x={PADL - 6} y={sy(z) + 3} fontSize="9" fill="#64748b" textAnchor="end">{z}</text>
      ))}
      <line x1={PADL} y1={sy(zIface)} x2={W - 12} y2={sy(zIface)} stroke="#eab308" strokeDasharray="5 4" opacity="0.6" />
      <text x={W - 16} y={sy(zIface) - 5} fontSize="9" fill="#eab308" textAnchor="end">k {HEAT_FIXTURE.layers[0].k} over k {HEAT_FIXTURE.layers[1].k}</text>
      <path d={path} fill="none" stroke="#f97316" strokeWidth="2" />
    </svg>
  );
}

// Easy%Ro maturation curves for the three ramp rates.
function RampPlot({ ramps }) {
  const W = 640; const H = 300; const PADL = 46; const PADB = 26;
  const roMax = 2.1;
  const sx = (t) => PADL + ((t - 20) / 180) * (W - PADL - 12);
  const sy = (ro) => H - PADB - (ro / roMax) * (H - PADB - 12);
  const colors = { 1: '#38bdf8', 3: '#BFFF00', 10: '#f97316' };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
      <line x1={PADL} y1={10} x2={PADL} y2={H - PADB} stroke="#334155" />
      <line x1={PADL} y1={H - PADB} x2={W - 12} y2={H - PADB} stroke="#334155" />
      {[50, 100, 150, 200].map((t) => (
        <text key={t} x={sx(t)} y={H - PADB + 14} fontSize="9" fill="#64748b" textAnchor="middle">{t} °C</text>
      ))}
      {[0.5, 1.0, 1.5, 2.0].map((ro) => (
        <text key={ro} x={PADL - 6} y={sy(ro) + 3} fontSize="9" fill="#64748b" textAnchor="end">{ro}</text>
      ))}
      <line x1={PADL} y1={sy(0.6)} x2={W - 12} y2={sy(0.6)} stroke="#22c55e" strokeDasharray="4 4" opacity="0.5" />
      <text x={W - 16} y={sy(0.6) - 4} fontSize="9" fill="#22c55e" textAnchor="end">oil window 0.6</text>
      {RAMP_RATES.map((r) => (
        <g key={r}>
          <path d={ramps[r].map((e, i) => `${i ? 'L' : 'M'}${sx(e.t_c).toFixed(1)},${sy(Math.min(e.ro, roMax)).toFixed(1)}`).join(' ')}
            fill="none" stroke={colors[r]} strokeWidth="1.8" />
          <text x={sx(196)} y={sy(Math.min(ramps[r][ramps[r].length - 1].ro, roMax)) - 4} fontSize="9" fill={colors[r]} textAnchor="end">{r} °C/Ma</text>
        </g>
      ))}
    </svg>
  );
}

// Burial + maturity history of the reference basin's source rock.
function BurialPlot({ results, srcIdx }) {
  const W = 640; const H = 320; const PADL = 46; const PADB = 26;
  const { meta, data } = results;
  const maxAge = Math.max(...data.timeSteps);
  const maxZ = meta.maxDepth * 1.05;
  const sx = (age) => PADL + ((maxAge - age) / maxAge) * (W - PADL - 12);
  const sy = (z) => 10 + (z / maxZ) * (H - PADB - 10);
  const colors = ['#38bdf8', '#f97316', '#22c55e', '#a78bfa'];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
      <line x1={PADL} y1={10} x2={PADL} y2={H - PADB} stroke="#334155" />
      <line x1={PADL} y1={H - PADB} x2={W - 12} y2={H - PADB} stroke="#334155" />
      {[150, 100, 50, 0].map((a) => (
        <text key={a} x={sx(a)} y={H - PADB + 14} fontSize="9" fill="#64748b" textAnchor="middle">{a} Ma</text>
      ))}
      {[0, 1000, 2000, 3000].map((z) => (
        <text key={z} x={PADL - 6} y={sy(z) + 3} fontSize="9" fill="#64748b" textAnchor="end">{z}</text>
      ))}
      {meta.layers.map((layer, li) => (
        <g key={layer.id}>
          <path d={data.burial[li].map((e, i) => `${i ? 'L' : 'M'}${sx(e.age).toFixed(1)},${sy(e.top).toFixed(1)}`).join(' ')}
            fill="none" stroke={colors[li % colors.length]} strokeWidth={li === srcIdx ? 2.4 : 1.4}
            opacity={li === srcIdx ? 1 : 0.6} />
          <text x={W - 16} y={sy(data.burial[li][data.burial[li].length - 1].top) + 4} fontSize="9"
            fill={colors[li % colors.length]} textAnchor="end">{layer.name}</text>
        </g>
      ))}
    </svg>
  );
}

const BasinLearningPage = () => {
  const { toast } = useToast();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [basinRun, setBasinRun] = useState(null); // { value } | { error } — async forward model
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

  // The advanced panel needs the 150 Ma forward model: run it once,
  // lazily, when the advanced tier is first opened.
  useEffect(() => {
    if (tier !== 'advanced' || basinRun) return;
    computeReferenceBasin()
      .then((value) => setBasinRun({ value }))
      .catch((e) => setBasinRun({ error: e.message }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  const burialHeat = useMemo(() => {
    try { return computeBurialHeat(); } catch (e) { return { error: e.message }; }
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
      <Helmet><title>Basin &amp; Charge (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Flame className="h-7 w-7 text-[#BFFF00]" /> Basin &amp; Charge
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              The golden reference basin: {PROJECT.stratigraphy.length} layers over 150 Ma, a Type II source
              shale (TOC {PROJECT.stratigraphy[1].sourceRock.toc}%, HI {PROJECT.stratigraphy[1].sourceRock.hi}),
              cooling heat flow 80 to 60 mW/m², and a 600 m erosion event at 10 Ma.
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          {/* Lessons */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>From burial to the kitchen: the petroleum system as a forward model.</CardDescription>
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

          {/* Beginner panel: burial + heat */}
          {burialHeat.error ? (
            <p className="text-red-400 text-sm">Engine error: {burialHeat.error}</p>
          ) : (
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Burial and heat</CardTitle>
                <CardDescription>
                  Sclater-Christie shale (φ₀ {burialHeat.shale.phi0}, c {burialHeat.shale.c}/m) and the
                  golden two-layer steady heat column ({HEAT_FIXTURE.surface_t_c} °C surface,
                  {' '}{HEAT_FIXTURE.basal_q_w_m2 * 1000} mW/m² basal).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <HeatColumnPlot nodes={burialHeat.heatNodes} temps={burialHeat.heatTemps} />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  {[
                    ['Solid thickness of 100 m surface shale', `${num(burialHeat.solid100, 3)} m`],
                    ['100 m shale from 1000 m, restored to surface', `${num(burialHeat.restoredThickness, 3)} m`],
                    ['Shale porosity at 2000 m', num(burialHeat.phi2000, 4)],
                    ['T at the first cell (50 m)', `${num(burialHeat.tFirstNode, 3)} °C`],
                    ['T at the base of the low-k layer (950 m)', `${num(burialHeat.tLayer1Bottom, 3)} °C`],
                    ['T at the deepest cell (1950 m)', `${num(burialHeat.tDeepest, 3)} °C`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                      <p className="text-gray-500 text-xs">{k}</p>
                      <p className="text-white">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Every number is hand-checkable: the steady profile is T = Ts + Qz/k per layer, and the
                  restored shale is thicker than its buried 100 m because the lost porosity comes back.
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

          {tier === 'intermediate' && (() => {
            const kin = computeKinetics();
            return (
              <Card className="bg-[#1E293B] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Maturity kinetics (Intermediate)</CardTitle>
                  <CardDescription>
                    Easy%Ro along three heating ramps, and the Type II kerogen clock at constant temperature.
                    The capstone grades the {CAPSTONE_RAMP} °C/Ma ramp.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RampPlot ramps={kin.ramps} />
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    {[
                      ['Ro at zero reaction', num(kin.roF0, 4)],
                      ['Ro at full reaction', num(kin.roFull, 4)],
                      [`Ro at 150 °C, ${CAPSTONE_RAMP} °C/Ma ramp`, num(kin.roAt(CAPSTONE_RAMP, 150), 4)],
                      ['Ro at 150 °C, 1 °C/Ma ramp', num(kin.roAt(1.0, 150), 4)],
                      ['Type II TR after 10 Ma at 100 °C', num(kin.tr10, 5)],
                      ['Type II TR after 50 Ma at 100 °C', num(kin.tr50, 5)],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                        <p className="text-gray-500 text-xs">{k}</p>
                        <p className="text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Lesson 4 in numbers: at the same 150 °C the slow 1 °C/Ma ramp is more mature than the
                    {' '}{CAPSTONE_RAMP} °C/Ma one, because the rocks spent longer hot. Time is a reagent.
                  </p>
                </CardContent>
              </Card>
            );
          })()}

          {tier === 'advanced' && (() => {
            if (!basinRun) {
              return <div className="flex items-center gap-3 text-gray-400 text-sm"><Loader2 className="h-4 w-4 animate-spin text-[#BFFF00]" /> Running 150 Ma of basin history (with and without the erosion event)...</div>;
            }
            if (basinRun.error) return <p className="text-red-400 text-sm">Engine error: {basinRun.error}</p>;
            const rb = basinRun.value;
            return (
              <Card className="bg-[#1E293B] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">The kitchen and the erosion signature (Advanced)</CardTitle>
                  <CardDescription>
                    The full forward model, twice: as-is, and with the 10 Ma / 600 m erosion event removed.
                    The difference in final source-rock maturity IS the erosion signature.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BurialPlot results={rb.withErosion} srcIdx={rb.srcIdx} />
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    {[
                      ['Source rock final Ro', num(rb.finalRo, 4)],
                      ['Source rock final temperature', `${num(rb.finalTempC, 2)} °C`],
                      ['Final transformation ratio', num(rb.finalTr, 4)],
                      ['Generated at present day', `${num(rb.generated, 1)} kg/m²`],
                      ['Expelled at present day', `${num(rb.expelled, 1)} kg/m²`],
                      ['Final Ro without the erosion event', num(rb.finalRoNoErosion, 4)],
                      ['Erosion signature (ΔRo)', num(rb.finalRo - rb.finalRoNoErosion, 4)],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                        <p className="text-gray-500 text-xs">{k}</p>
                        <p className="text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    The eroded 600 m never shows in today&apos;s stack, but its heat does: the basin that lost it
                    is measurably more mature than its preserved twin. Expelled stays below generated because the
                    source retains its saturation bucket.
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
                            That completes course coverage of the whole Geoscience module.</p>
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

export default BasinLearningPage;
