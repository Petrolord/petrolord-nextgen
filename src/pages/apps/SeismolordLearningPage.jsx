import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, Waves, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import {
  computeSynthetic, waveletRows, traceRows, CAPSTONE_FREQ_HZ, V_OVERBURDEN_MS, DT_MS,
  computeIntermediate, PLANTED_LAG_MS, computeAdvanced, tuningRows, WEDGE,
} from '@/lib/seismolordTeaching';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
} from '@/services/academyService';

const APP = 'seismolord';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };
const FREQS = [15, 25, 40];

const LESSONS = [
  { n: 1, title: 'The convolutional model',
    body: 'A seismic trace is (to first order) the earth\'s reflectivity convolved with a wavelet. Synthetics rebuild that trace from well logs so seismic events can be tied to geology.' },
  { n: 2, title: 'Sonic to velocity',
    body: 'The DT log is slowness in µs/m. Velocity = 1e6 / DT. A 318 µs/m sand reads about 3145 m/s.' },
  { n: 3, title: 'Impedance and reflectivity',
    body: 'Acoustic impedance = velocity × density. A reflection happens where impedance changes: RC = (Z2 − Z1) / (Z2 + Z1). Strong contrasts make strong events.' },
  { n: 4, title: 'Time-depth',
    body: 'Logs live in depth, seismic lives in two-way time. Here the teaching T-D is a single 2000 m/s overburden, so TWT(z) = 2z/2000 s — the 1500 m log top arrives at exactly 1500 ms.' },
  { n: 5, title: 'The wavelet and tuning',
    body: 'A Ricker wavelet is set by its peak frequency. Lower frequency = longer wavelet = neighbouring reflections merge (tuning). Flip between 15, 25 and 40 Hz and watch the synthetic change while the reflectivity stays put.' },
  { n: 6, title: 'Edge validity',
    body: 'Convolution needs the full wavelet inside the data window. Samples too close to the ends are marked invalid and excluded from the summary panel — never trust an edge amplitude.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Seismolord — Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Seismolord course and activate your account to open this app in Learning
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

const SeismolordLearningPage = () => {
  const { toast } = useToast();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [freq, setFreq] = useState(CAPSTONE_FREQ_HZ);
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
    try {
      return computeSynthetic(freq);
    } catch (e) {
      return { error: e.message };
    }
  }, [freq]);

  const wRows = useMemo(() => (model.wavelet ? waveletRows(model.wavelet) : []), [model]);
  const tRows = useMemo(() => (model.syn ? traceRows(model.syn) : []), [model]);
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
          description: `${res.score}/${res.max_score} answers within tolerance. Check the wavelet frequency and re-read the summary panel.`,
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

  const s = model.summary;

  return (
    <>
      <Helmet><title>Seismolord (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Waves className="h-7 w-7 text-[#BFFF00]" /> Seismolord
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              Synthetic seismogram on the basic_20 teaching well ({V_OVERBURDEN_MS} m/s teaching time-depth, {DT_MS} ms grid).
              {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          {/* Lessons */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>From sonic log to seismic tie, step by step.</CardDescription>
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

          {model.error ? (
            <p className="text-red-400 text-sm">Engine error: {model.error}</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Wavelet */}
              <Card className="bg-[#1E293B] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Ricker wavelet</CardTitle>
                  <CardDescription>Pick the peak frequency.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    {FREQS.map((f) => (
                      <button key={f} type="button" onClick={() => setFreq(f)}
                        className={`px-3 py-1.5 rounded-md border text-sm ${freq === f ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                        {f} Hz
                      </button>
                    ))}
                  </div>
                  <div style={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={wRows} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                        <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 10 }} unit=" ms" />
                        <YAxis domain={[-0.6, 1.05]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', color: '#fff' }} />
                        <ReferenceLine y={0} stroke="#475569" />
                        <Line type="monotone" dataKey="a" name="amplitude" stroke="#BFFF00" dot={false} strokeWidth={1.5} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-gray-500">The capstone grades the {CAPSTONE_FREQ_HZ} Hz synthetic.</p>
                </CardContent>
              </Card>

              {/* Traces */}
              <Card className="bg-[#1E293B] border-gray-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Reflectivity and synthetic</CardTitle>
                  <CardDescription>The RC series is frequency-independent; the synthetic is not.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tRows} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                        <XAxis dataKey="twt" tick={{ fill: '#94a3b8', fontSize: 10 }} unit=" ms" domain={['dataMin', 'dataMax']} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', color: '#fff' }} />
                        <ReferenceLine y={0} stroke="#475569" />
                        <Line type="monotone" dataKey="rc" name="RC" stroke="#38bdf8" dot={false} strokeWidth={1} />
                        <Line type="monotone" dataKey="syn" name={`synthetic ${freq} Hz`} stroke="#BFFF00" dot={false} strokeWidth={1.5} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Only validity-masked synthetic samples are drawn (lesson 6).</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Summary panel */}
          {s && (
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Synthetic summary — {freq} Hz</CardTitle>
                <CardDescription>This is the panel the capstone asks you to read (at {CAPSTONE_FREQ_HZ} Hz).</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                  {[
                    ['Mean sonic velocity', `${num(s.meanVelocity)} m/s`],
                    ['TWT at log top / base', `${num(s.twtLogTop, 1)} / ${num(s.twtLogBase, 1)} ms`],
                    ['Max impedance', `${num(s.impMax)} (m/s)·(g/cc)`],
                    ['Strongest RC (abs)', num(s.rcPeakAbs, 6)],
                    ['TWT of strongest RC', `${num(s.rcPeakTwt, 0)} ms`],
                    ['Strongest synthetic amplitude', num(s.synPeakAbs, 6)],
                    ['TWT of strongest synthetic', `${num(s.synPeakTwt, 0)} ms`],
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
                  <CardTitle className="text-white">Bulk shift and tuning (Intermediate)</CardTitle>
                  <CardDescription>
                    The observed seismic is the 25 Hz synthetic arriving {PLANTED_LAG_MS} ms late; the scan should find exactly that. Tuning: compare the 15 Hz and 40 Hz peaks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    {[
                      ['Suggested bulk shift', `${num(inter.bulkShiftMs, 1)} ms`],
                      ['Correlation at that shift', num(inter.corr, 4)],
                      ['15 Hz peak (abs / TWT)', `${num(inter.peak15.abs, 6)} / ${num(inter.peak15.twt, 0)} ms`],
                      ['40 Hz peak (abs / TWT)', `${num(inter.peak40.abs, 6)} / ${num(inter.peak40.twt, 0)} ms`],
                      ['Peak ratio 15/40 Hz', num(inter.peak15.abs / inter.peak40.abs, 2)],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                        <p className="text-gray-500 text-xs">{k}</p>
                        <p className="text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    The lower frequency merges neighbouring reflections into one strong event (tuning) — a different amplitude AND a different apparent time.
                  </p>
                </CardContent>
              </Card>
            );
          })()}

          {tier === 'advanced' && (() => {
            const adv = computeAdvanced();
            const rows = tuningRows(adv);
            return (
              <Card className="bg-[#1E293B] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Wedge tuning panel (Advanced)</CardTitle>
                  <CardDescription>
                    The SAND top and base as an equal and opposite pair (RC {WEDGE.rcTop} / {WEDGE.rcBase}), wedged 0 to {WEDGE.maxThicknessMs} ms at {WEDGE.dtMs} ms. Peak amplitude near the top interface per thickness.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div style={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={rows} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                        <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                        <XAxis dataKey="thickness" tick={{ fill: '#94a3b8', fontSize: 11 }}
                          label={{ value: 'thickness (ms)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid #334155', color: '#fff' }} />
                        <ReferenceLine x={adv.f25.tuneMs} stroke="#BFFF00" strokeDasharray="4 3" />
                        <ReferenceLine x={adv.f40.tuneMs} stroke="#38bdf8" strokeDasharray="4 3" />
                        <Line type="monotone" dataKey="a25" name="25 Hz" stroke="#BFFF00" dot={false} strokeWidth={1.5} />
                        <Line type="monotone" dataKey="a40" name="40 Hz" stroke="#38bdf8" dot={false} strokeWidth={1.5} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    {[
                      ['Tuning thickness at 25 Hz', `${adv.f25.tuneMs} ms`],
                      ['Peak amplitude at 25 Hz tuning', num(adv.f25.tuneAmp, 6)],
                      ['Tuning thickness at 40 Hz', `${adv.f40.tuneMs} ms`],
                      ['Peak amplitude at 40 Hz tuning', num(adv.f40.tuneAmp, 6)],
                      ['Isolated-reflector amplitude (25 Hz)', num(adv.f25.isoAmp, 6)],
                      ['Theoretical tuning at 25 Hz', `${num(adv.f25.theoryMs, 4)} ms`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                        <p className="text-gray-500 text-xs">{k}</p>
                        <p className="text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Below tuning the pair brightens as the side lobes stack; the panel picks the tuning maximum one sample grid step above the Kallweit-Wood value sqrt(6)/(2*pi*f). Note the tuning amplitude itself does not depend on frequency.
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
                            {result.tier === 'expert' && ' Your 50% Suite discount code is on your certificates page.'}</p>
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance — set the wavelet to {CAPSTONE_FREQ_HZ} Hz and read the summary panel again.
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

export default SeismolordLearningPage;
