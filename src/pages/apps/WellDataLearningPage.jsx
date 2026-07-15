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
  Loader2, HardDrive, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { TEACHING_FILES, qcFile, headerRows, computeIntermediate } from '@/lib/welldataTeaching';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
} from '@/services/academyService';

const APP = 'welldata';
const TIERS = ['beginner', 'intermediate'];

const LESSONS = [
  { n: 1, title: 'Anatomy of a LAS file',
    body: 'Four header sections (~Version, ~Well, ~Curve, ~Parameter) then the ~ASCII data block. VERS and WRAP in ~V decide how the rest is read.' },
  { n: 2, title: 'The NULL value',
    body: 'Missing samples are flagged with the ~Well NULL value (usually -999.25). The parser turns them into gaps; QC counts them per curve. A curve can be completely dead.' },
  { n: 3, title: 'Wrapped files',
    body: 'LAS 1.2 files with WRAP=YES split each depth step across several data lines. The sample count, not the line count, is what matters.' },
  { n: 4, title: 'Depth units',
    body: 'Depth can arrive in feet or metres. Everything downstream works in metres: a 2 ft step is 0.6096 m exactly (1 ft = 0.3048 m by definition).' },
  { n: 5, title: 'QC before use',
    body: 'Before any log goes to interpretation, confirm the depth range and step, per-curve sample and null counts, and that curve statistics look physical.' },
];

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Well Data Manager — Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Well Data Manager course and activate your account to open this app in
        Learning Mode against the bundled teaching LAS files. This course is the root of the
        geoscience path: certifying here unlocks enrollment in the other geoscience courses.
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

const num = (v, dp = 4) => (v == null || Number.isNaN(v) ? '—' : Number(v).toFixed(dp));

const WellDataLearningPage = () => {
  const { toast } = useToast();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [fileId, setFileId] = useState(TEACHING_FILES[0].id);
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

  const intermediate = useMemo(
    () => (tier === 'intermediate' ? computeIntermediate() : null),
    [tier],
  );

  const file = TEACHING_FILES.find((f) => f.id === fileId);
  const qc = useMemo(() => {
    try {
      return qcFile(file);
    } catch (e) {
      return { error: e.message };
    }
  }, [file]);

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
        toast({
          title: 'Capstone passed — Associate certified!',
          description: res.certificate_number,
          className: 'bg-[#BFFF00] text-slate-900',
        });
      } else if (res.passed) {
        toast({ title: 'Passed — you were already certified', className: 'bg-[#BFFF00] text-slate-900' });
      } else {
        toast({
          title: 'Not passing yet',
          description: `${res.score}/${res.max_score} answers within tolerance. Check the QC panel again.`,
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
      <Helmet><title>Well Data Manager (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
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
                <HardDrive className="h-7 w-7 text-[#BFFF00]" /> Well Data Manager
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
              </h1>
              <p className="mt-1 text-gray-400">
                Six bundled teaching LAS files. {gate.quota?.own_data_upload === false && 'Your own data upload unlocks at the Associate tier.'}
              </p>
            </div>
          </div>

          {/* Lessons */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>What well data QC actually checks, step by step.</CardDescription>
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

          {/* File explorer + QC */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Teaching files</CardTitle>
              <CardDescription>Load each file with the real parser and read its QC panel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {TEACHING_FILES.map((f) => (
                  <button key={f.id} type="button" onClick={() => setFileId(f.id)}
                    className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                      f.id === fileId
                        ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
                        : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-400'
                    }`}>
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">{file.hint}</p>

              {qc.error ? (
                <p className="text-red-400 text-sm">Parse failed: {qc.error}</p>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                    <div className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                      <p className="text-gray-500 text-xs">LAS version / wrap</p>
                      <p className="text-white">{qc.version} / {qc.wrap}</p>
                    </div>
                    <div className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                      <p className="text-gray-500 text-xs">Depth range ({qc.depth.unit})</p>
                      <p className="text-white">{num(qc.depth.first, 1)} – {num(qc.depth.last, 1)}</p>
                    </div>
                    <div className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                      <p className="text-gray-500 text-xs">Step (native / metres)</p>
                      <p className="text-white">{num(qc.depth.stepNative, 4)} {qc.depth.unit} / {num(qc.depth.stepM, 4)} m</p>
                    </div>
                    <div className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                      <p className="text-gray-500 text-xs">Samples / NULL flag</p>
                      <p className="text-white">{qc.depth.nSamples} / {qc.nullValue ?? '—'}</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                          <th className="py-2 pr-4">Curve</th><th className="py-2 pr-4">Unit</th>
                          <th className="py-2 pr-4">Samples</th><th className="py-2 pr-4">Nulls</th>
                          <th className="py-2 pr-4">First</th><th className="py-2 pr-4">Last</th>
                          <th className="py-2 pr-4">Mean (finite)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {qc.curves.map((c) => (
                          <tr key={c.mnemonic} className={`border-b border-gray-800 ${c.nullCount === c.nSamples ? 'text-red-400' : 'text-gray-300'}`}>
                            <td className="py-2 pr-4 text-white">{c.mnemonic}</td>
                            <td className="py-2 pr-4">{c.unit}</td>
                            <td className="py-2 pr-4">{c.nSamples}</td>
                            <td className="py-2 pr-4">{c.nullCount}</td>
                            <td className="py-2 pr-4">{num(c.firstFinite)}</td>
                            <td className="py-2 pr-4">{num(c.lastFinite)}</td>
                            <td className="py-2 pr-4">{num(c.mean)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-gray-400">
                      <tbody>
                        {headerRows(qc.well).map((r) => (
                          <tr key={r.key} className="border-b border-gray-800/60">
                            <td className="py-1 pr-3 text-gray-500 font-mono">{r.key}</td>
                            <td className="py-1 pr-3">{String(r.value ?? '')} {r.unit}</td>
                            <td className="py-1">{r.descr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tier toggle + intermediate panel */}
          <div className="flex gap-2">
            {TIERS.map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                {t} tier
              </button>
            ))}
          </div>

          {intermediate && (
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">SI import panel (Intermediate)</CardTitle>
                <CardDescription>The full import pipeline on feet_20: unit conversion to metres, step detection, curve-kind recognition.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  {[
                    ['Converted depth range', `${num(intermediate.startMdM, 2)} – ${num(intermediate.stopMdM, 2)} m`],
                    ['Converted step', `${num(intermediate.stepM, 4)} m`],
                    ['Curves unit-converted', `${intermediate.convertedCurves}`],
                    ['Curve kinds recognised', `${intermediate.recognizedKinds}`],
                    ['irregular_20 uniform step?', intermediate.irregularUniform ? 'yes (1)' : 'no (0)'],
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
                      <th className="py-1 pr-3">Curve</th><th className="py-1 pr-3">Kind</th><th className="py-1 pr-3">Unit (source → SI)</th>
                    </tr></thead>
                    <tbody>
                      {intermediate.logs.map((l) => (
                        <tr key={l.mnemonic} className="border-b border-gray-800/60">
                          <td className="py-1 pr-3 text-white font-mono">{l.mnemonic}</td>
                          <td className="py-1 pr-3">{l.kind || '—'}</td>
                          <td className="py-1 pr-3">{l.converted ? `${l.sourceUnit} → ${l.unit}` : l.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                            The rest of the geoscience path is now open to you.</p>
                          <div className="flex gap-3">
                            <Link to="/dashboard/certificates" className="text-[#BFFF00] hover:underline inline-flex items-center gap-1">
                              My certificates <ArrowRight className="h-3 w-3" />
                            </Link>
                            <Link to="/dashboard/enroll" className="text-[#BFFF00] hover:underline inline-flex items-center gap-1">
                              Enrol in the next course <ArrowRight className="h-3 w-3" />
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance — re-read the QC panel for each file and try again.
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

export default WellDataLearningPage;
