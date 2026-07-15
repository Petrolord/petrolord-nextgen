import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, FlaskConical, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import {
  defaultParams, computeWorkflow, capstoneAnswers, chartRows, ZONES,
  computeIntermediate, computeAdvanced, ADVANCED_GIVENS,
} from '@/lib/petrophysicsTeaching';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
} from '@/services/academyService';

const APP = 'petrophysics';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { n: 1, title: 'Shale volume from gamma ray',
    body: 'GR reads high in shale, low in clean sand. Normalise it between the clean and clay lines to get IGR, then apply a Vsh transform (Larionov tertiary here).' },
  { n: 2, title: 'Porosity from the density log',
    body: 'Density porosity assumes a matrix and fluid density: φD = (ρma − ρb) / (ρma − ρfl). Clean sand ρma ≈ 2.65, fresh mud filtrate ρfl ≈ 1.0.' },
  { n: 3, title: 'Water saturation (Archie)',
    body: 'Sw = ((a·Rw) / (φ^m · Rt))^(1/n). Rw is the formation-water resistivity; a, m, n are the tortuosity and exponents.' },
  { n: 4, title: 'Cutoffs and net pay',
    body: 'A sample is pay when φ ≥ φcut, Vsh ≤ Vshcut and Sw ≤ Swcut. Sum the pay thickness and volume-weight φ and Sw over the pay to summarise each zone.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Petrophysics — Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Petrophysics course and activate your account to open this app in Learning Mode
        against the bundled teaching dataset.
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/dashboard/enroll">
          <Button className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
            <GraduationCap className="h-4 w-4 mr-1" /> Enrol
          </Button>
        </Link>
        <Link to="/dashboard/get-started">
          <Button variant="outline" className="border-gray-600 text-gray-200">Get started</Button>
        </Link>
      </div>
    </div>
  );
}

const PetrophysicsLearningPage = () => {
  const { toast } = useToast();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [answers, setAnswers] = useState({});
  const [params, setParams] = useState(defaultParams());
  const [capstone, setCapstone] = useState(null);
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

  const intermediate = useMemo(
    () => (tier === 'intermediate' ? computeIntermediate() : null),
    [tier],
  );

  const advanced = useMemo(
    () => (tier === 'advanced' ? computeAdvanced() : null),
    [tier],
  );

  const workflow = useMemo(() => {
    try {
      return computeWorkflow(params);
    } catch {
      return null;
    }
  }, [params]);

  const rows = useMemo(
    () => (workflow ? chartRows(workflow.depth, workflow.curves, 2) : []),
    [workflow],
  );

  const setP = (k) => (e) => setParams((p) => ({ ...p, [k]: e.target.value }));
  const watermark = gate.quota?.export_watermark;

  const submit = async () => {
    if (!workflow) return;
    setSubmitting(true);
    try {
      const payload = tier === 'beginner'
        ? capstoneAnswers(workflow)
        : Object.fromEntries((capstone?.fields || []).map((f) => [
            f.key, answers[f.key] === '' || answers[f.key] === undefined ? null : Number(answers[f.key]),
          ]));
      const res = await submitCapstone(APP, tier, payload);
      setResult(res);
      if (res.passed && res.certificate_number) {
        toast({
          title: `Capstone passed. ${CERT_LABELS[res.tier] || 'Associate'} certified!`,
          description: res.certificate_number,
          className: 'bg-[#BFFF00] text-slate-900',
        });
      } else if (res.passed) {
        toast({ title: 'Passed — you were already certified', className: 'bg-[#BFFF00] text-slate-900' });
      } else {
        toast({
          title: 'Not passing yet',
          description: `${res.score}/${res.max_score} answers within tolerance. Review your parameters.`,
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

  const zoneRow = (name, s) => (
    <tr className="border-b border-gray-800 text-gray-300">
      <td className="py-2 pr-4 text-white">{name}</td>
      <td className="py-2 pr-4">{s.net_m?.toFixed(1)} m</td>
      <td className="py-2 pr-4">{s.gross_m?.toFixed(1)} m</td>
      <td className="py-2 pr-4">{s.phi_avg != null ? (s.phi_avg * 100).toFixed(1) + '%' : '—'}</td>
      <td className="py-2 pr-4">{s.sw_avg != null ? (s.sw_avg * 100).toFixed(1) + '%' : '—'}</td>
    </tr>
  );

  const Param = ({ k, label, step = 'any' }) => (
    <div>
      <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
      <Input type="number" step={step} value={params[k]} onChange={setP(k)}
        className="bg-gray-700 text-white border-gray-600 h-8 text-sm" />
    </div>
  );

  return (
    <>
      <Helmet><title>Petrophysics (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <FlaskConical className="h-7 w-7 text-[#BFFF00]" /> Petrophysics
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
              </h1>
              <p className="mt-1 text-gray-400">
                Bundled teaching dataset (typewell). {gate.quota?.own_data_upload === false && 'Your own data upload unlocks at the Associate tier.'}
              </p>
            </div>
          </div>

          {/* Lessons */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>The interpretation loop, step by step.</CardDescription>
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

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Parameters */}
            <Card className="bg-[#1E293B] border-gray-700 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white">Interpretation parameters</CardTitle>
                <CardDescription>Given constants are pre-filled — set the cutoffs and Archie Rw.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Param k="rhoMa" label="ρ matrix" />
                <Param k="rhoFl" label="ρ fluid" />
                <Param k="grClean" label="GR clean" />
                <Param k="grClay" label="GR clay" />
                <Param k="rw" label="Rw (Ω·m)" />
                <Param k="a" label="a" />
                <Param k="m" label="m" />
                <Param k="n" label="n" />
                <Param k="cutPhi" label="φ cutoff" />
                <Param k="cutVsh" label="Vsh cutoff" />
                <Param k="cutSw" label="Sw cutoff" />
                <div>
                  <Label className="text-gray-400 text-xs mb-1 block">Vsh method</Label>
                  <select value={params.vshMethod} onChange={setP('vshMethod')}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-md h-8 text-sm px-2">
                    <option value="larionov-tertiary">Larionov (tertiary)</option>
                    <option value="larionov-older">Larionov (older)</option>
                    <option value="linear">Linear (IGR)</option>
                    <option value="clavier">Clavier</option>
                    <option value="steiber">Steiber</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Log + computed curves */}
            <Card className="bg-[#1E293B] border-gray-700 lg:col-span-2">
              <CardHeader><CardTitle className="text-white">Computed curves</CardTitle></CardHeader>
              <CardContent>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rows} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                      <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                      <XAxis dataKey="depth" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis domain={[0, 1]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', color: '#fff' }} />
                      <ReferenceArea x1={ZONES.SAND_A[0]} x2={ZONES.SAND_A[1]} fill="#BFFF00" fillOpacity={0.06} />
                      <ReferenceArea x1={ZONES.SAND_B[0]} x2={ZONES.SAND_B[1]} fill="#38bdf8" fillOpacity={0.06} />
                      <Line type="monotone" dataKey="phi" name="φ" stroke="#BFFF00" dot={false} strokeWidth={1.5} />
                      <Line type="monotone" dataKey="vsh" name="Vsh" stroke="#f59e0b" dot={false} strokeWidth={1.5} />
                      <Line type="monotone" dataKey="sw" name="Sw" stroke="#38bdf8" dot={false} strokeWidth={1.5} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2">Shaded: SAND_A (lime) and SAND_B (blue). φ, Vsh, Sw are volume fractions.</p>
              </CardContent>
            </Card>
          </div>

          {/* Tier toggle + intermediate panel */}
          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {intermediate && (
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Advanced interpretation panel (Intermediate)</CardTitle>
                <CardDescription>
                  Multi-method porosity, a Pickett fit in the water leg ({intermediate.waterLeg[0]}–{intermediate.waterLeg[1]} m, {intermediate.pickett.nPoints} points), and shaly-sand saturation with linear Vsh. SAND_A zone means.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  {[
                    ['SAND_A mean φ (neutron-density)', intermediate.phindAvgSandA.toFixed(4)],
                    ['SAND_A mean φ (Wyllie sonic)', intermediate.phiwAvgSandA.toFixed(4)],
                    ['Pickett fit: a·Rw', intermediate.pickett.aRw.toFixed(4) + ' Ω·m'],
                    ['Pickett fit: m', intermediate.pickett.m.toFixed(3)],
                    ['SAND_A mean Sw (Archie, φND)', intermediate.swArchieSandA.toFixed(4)],
                    ['SAND_A mean Sw (Simandoux)', intermediate.swSimSandA.toFixed(4)],
                    ['SAND_A mean Sw (Indonesia)', intermediate.swIndSandA.toFixed(4)],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                      <p className="text-gray-500 text-xs">{k}</p>
                      <p className="text-white">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  The Pickett fit should recover the given water properties — a water-leg crossplot is how Rw and m are QC'd. The shaly-sand methods read lower Sw than Archie in shale-affected intervals.
                </p>
              </CardContent>
            </Card>
          )}

          {advanced && (
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Rw triangulation panel (Advanced)</CardTitle>
                <CardDescription>
                  Lab sample {ADVANCED_GIVENS.rwSample} ohm.m at {ADVANCED_GIVENS.tSampleF} degF, formation {ADVANCED_GIVENS.tFmF} degF; SP quicklook SSP {ADVANCED_GIVENS.sspMv} mV with Rmfe {ADVANCED_GIVENS.rmfe} ohm.m. Three independent Rw estimates should converge; then SAND_A is booked with the corrected and the raw Rw.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  {[
                    ['Sample Rw at formation T (Arps)', advanced.rwArps.toFixed(4) + ' ohm.m'],
                    ['SP coefficient K', advanced.spK.toFixed(2)],
                    ['Rwe from the SP quicklook', advanced.rweSsp.toFixed(4) + ' ohm.m'],
                    ['Water-leg mean Sw (Arps Rw)', advanced.swWaterlegMean.toFixed(4)],
                    ['SAND_A net pay (Arps Rw)', advanced.corrected.net_m.toFixed(2) + ' m'],
                    ['SAND_A pay-avg Sw (Arps Rw)', advanced.corrected.sw_avg.toFixed(4)],
                    ['SAND_A net pay (raw sample Rw)', advanced.uncorrected.net_m.toFixed(2) + ' m'],
                    ['SAND_A pay-avg Sw (raw sample Rw)', advanced.uncorrected.sw_avg.toFixed(4)],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                      <p className="text-gray-500 text-xs">{k}</p>
                      <p className="text-white">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  The Arps correction and the SP quicklook both land on the Pickett fit's a.Rw of 0.05. Booking with the raw surface sample instead overstates Sw and quietly erases pay.
                </p>
              </CardContent>
            </Card>
          )}

          {(intermediate || advanced) && (
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
                {result && !result.passed && (
                  <p className="text-red-300 text-sm flex items-center gap-2">
                    <XCircle className="h-4 w-4" /> {result.score}/{result.max_score} within tolerance — re-read the panel.
                  </p>
                )}
                {result && result.passed && (
                  <p className="text-emerald-300 text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Passed ({result.score}/{result.max_score}).
                    {result.certificate_number && <>{CERT_LABELS[result.tier] || 'Associate'} certificate <span className="font-mono text-[#BFFF00]">{result.certificate_number}</span> issued.</>}
                    {result.certificate_number && result.tier === 'expert' && <> Your 50% Suite discount code is on <Link to="/dashboard/certificates" className="text-[#BFFF00] hover:underline">your certificates page</Link>.</>}
                    {result.already_certified && 'You were already certified for this tier.'}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Net-pay summary + capstone */}
          {tier === 'beginner' && (
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Net-pay summary</CardTitle>
              <CardDescription>Computed live from your parameters — this is what the capstone grades.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="py-2 pr-4">Zone</th><th className="py-2 pr-4">Net pay</th>
                      <th className="py-2 pr-4">Gross</th><th className="py-2 pr-4">Avg φ</th><th className="py-2 pr-4">Avg Sw</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflow && zoneRow('SAND_A', workflow.zones.SAND_A)}
                    {workflow && zoneRow('SAND_B', workflow.zones.SAND_B)}
                  </tbody>
                </table>
              </div>

              <div className="rounded-md border border-gray-700 bg-[#0F172A] p-4">
                <p className="text-white font-medium">{capstone?.title || 'Capstone'}</p>
                <p className="text-sm text-gray-400 mt-1">{capstone?.prompt}</p>
                <Button onClick={submit} disabled={submitting || !workflow}
                  className="mt-3 bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GraduationCap className="mr-2 h-4 w-4" />}
                  Submit for grading
                </Button>

                {result && (
                  <div className={`mt-4 rounded-md border p-4 ${result.passed ? 'border-emerald-700 bg-emerald-900/20' : 'border-red-800 bg-red-900/20'}`}>
                    {result.passed ? (
                      <>
                        <p className="text-emerald-300 font-medium flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" /> Passed ({result.score}/{result.max_score})
                        </p>
                        {result.certificate_number ? (
                          <div className="mt-2 text-sm text-gray-300 space-y-1">
                            <p className="flex items-center gap-2"><Award className="h-4 w-4 text-[#BFFF00]" />
                              {CERT_LABELS[result.tier] || 'Associate'} certificate <span className="font-mono text-[#BFFF00]">{result.certificate_number}</span> issued.</p>
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
                        <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance — review your parameters and try again.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default PetrophysicsLearningPage;
