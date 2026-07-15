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
  Loader2, GitCompareArrows, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import {
  TEACHING_WELLS, ZONE, FLATTEN_DATUM_M, computeSection, structuralRelief, displayGr,
} from '@/lib/correlationTeaching';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
} from '@/services/academyService';

const APP = 'wellcorrelation';
const TIER = 'beginner';

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

const COLORS = { TOP_A: '#38bdf8', TOP_SAND: '#BFFF00', BASE_SAND: '#f59e0b', TOP_B: '#f472b6' };

function ScopeGate() {
  return (
    <div className="max-w-xl mx-auto p-8 text-center space-y-4">
      <Lock className="h-10 w-10 text-[#BFFF00] mx-auto" />
      <h2 className="text-2xl font-bold text-white">Well Correlation — Learning Mode locked</h2>
      <p className="text-gray-400">
        Enrol in the Well Correlation course and activate your account to open this app in
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

const num = (v, dp = 1) => (v == null || Number.isNaN(v) ? '—' : Number(v).toFixed(dp));

// SVG section: equal well columns, GR character strip, top markers,
// correlation polylines, SAND zone fill.
function SectionView({ section, zoneOn }) {
  const W = 760;
  const H = 420;
  const plotLeft = 60;
  const plotTop = 30;
  const plotW = W - plotLeft - 20;
  const plotH = H - plotTop - 30;
  const [vMin, vMax] = section.range || [1400, 1700];
  const pad = 15;
  const top = vMin - pad;
  const base = vMax + pad;
  const y = (d) => plotTop + ((d - top) / (base - top)) * plotH;
  const n = section.rows.length;
  const colW = plotW / n;
  const colX = (i) => plotLeft + i * colW;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto bg-[#0F172A] rounded-md border border-gray-700">
      {/* depth axis */}
      {Array.from({ length: 6 }, (_, k) => {
        const d = top + ((base - top) * k) / 5;
        return (
          <g key={k}>
            <line x1={plotLeft} x2={W - 20} y1={y(d)} y2={y(d)} stroke="#1e293b" />
            <text x={plotLeft - 6} y={y(d) + 3} textAnchor="end" fontSize="9" fill="#64748b">{d.toFixed(0)}</text>
          </g>
        );
      })}

      {/* zone fill between correlated tops */}
      {zoneOn && section.rows.map((r, i) => (r.span ? (
        <rect key={r.id} x={colX(i) + colW * 0.18} width={colW * 0.64}
          y={y(r.span.top)} height={Math.max(1, y(r.span.base) - y(r.span.top))}
          fill="#BFFF00" opacity="0.10" />
      ) : null))}

      {/* correlation polylines */}
      {section.polylines.map((pl) => (
        <polyline key={pl.name}
          points={pl.points.map((p) => `${colX(p.wellIndex) + colW / 2},${y(p.displayed)}`).join(' ')}
          fill="none" stroke={COLORS[pl.name] || '#94a3b8'} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.8" />
      ))}

      {/* wells */}
      {section.rows.map((r, i) => {
        const cx = colX(i) + colW / 2;
        const well = TEACHING_WELLS[i];
        const mdTop = Math.min(...well.tops.map((t) => t.md_m)) - 25;
        const mdBase = Math.max(...well.tops.map((t) => t.md_m)) + 25;
        const grPts = [];
        for (let md = mdTop; md <= mdBase; md += 1) {
          const gr = displayGr(well, md);
          grPts.push(`${cx - colW * 0.28 + (gr / 150) * colW * 0.4},${y(md + (r.shift || 0))}`);
        }
        return (
          <g key={r.id}>
            <line x1={cx} x2={cx} y1={y(mdTop + (r.shift || 0))} y2={y(mdBase + (r.shift || 0))} stroke="#475569" strokeWidth="2" />
            <polyline points={grPts.join(' ')} fill="none" stroke="#34d399" strokeWidth="0.8" opacity="0.7" />
            {r.tops.map((t) => (
              <g key={t.name}>
                <line x1={cx - colW * 0.3} x2={cx + colW * 0.3} y1={y(t.displayed)} y2={y(t.displayed)}
                  stroke={COLORS[t.name] || '#94a3b8'} strokeWidth="2" />
                <text x={cx + colW * 0.32} y={y(t.displayed) + 3} fontSize="8" fill={COLORS[t.name] || '#94a3b8'}>{t.name}</text>
              </g>
            ))}
            <text x={cx} y={plotTop - 12} textAnchor="middle" fontSize="10" fill="#e2e8f0" fontWeight="bold">{r.name}</text>
            <text x={cx} y={plotTop - 2} textAnchor="middle" fontSize="8" fill={r.hasDatumTop ? '#64748b' : '#f87171'}>
              {r.shift === 0 || r.shift == null ? (r.hasDatumTop ? 'shift 0' : 'no datum top') : `shift ${num(r.shift)} m`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const WellCorrelationLearningPage = () => {
  const { toast } = useToast();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [flattened, setFlattened] = useState(false);
  const [zoneOn, setZoneOn] = useState(true);
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

  const section = useMemo(() => computeSection(
    flattened
      ? { mode: 'flatten', topName: ZONE.top, datumM: FLATTEN_DATUM_M }
      : { mode: 'structural' },
  ), [flattened]);

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
          description: `${res.score}/${res.max_score} answers within tolerance. Read the section panel again.`,
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
      <Helmet><title>Well Correlation (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <GitCompareArrows className="h-7 w-7 text-[#BFFF00]" /> Well Correlation
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-gray-400">
              The Ekene four-well teaching section. {gate.quota?.own_data_upload === false && 'Your own data upload unlocks at the Associate tier.'}
            </p>
          </div>

          {/* Lessons */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>Correlation section mechanics, step by step.</CardDescription>
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

          {/* Section */}
          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Section view</CardTitle>
              <CardDescription>
                Toggle the datum and watch the shifts. Flattening hangs every well on {ZONE.top} at {FLATTEN_DATUM_M} m.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setFlattened(false)}
                  className={`px-3 py-1.5 rounded-md border text-sm ${!flattened ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                  Structural
                </button>
                <button type="button" onClick={() => setFlattened(true)}
                  className={`px-3 py-1.5 rounded-md border text-sm ${flattened ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                  Flatten on {ZONE.top} @ {FLATTEN_DATUM_M} m
                </button>
                <button type="button" onClick={() => setZoneOn((z) => !z)}
                  className={`px-3 py-1.5 rounded-md border text-sm ${zoneOn ? 'bg-gray-700 text-white border-gray-500' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                  SAND zone fill {zoneOn ? 'on' : 'off'}
                </button>
              </div>

              <SectionView section={section} zoneOn={zoneOn} />

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="py-2 pr-4">Well</th><th className="py-2 pr-4">Shift</th>
                      <th className="py-2 pr-4">SAND top (displayed)</th><th className="py-2 pr-4">SAND base (displayed)</th>
                      <th className="py-2 pr-4">SAND thickness</th><th className="py-2 pr-4">TOP_B (displayed)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((r) => {
                      const topB = r.tops.find((t) => t.name === 'TOP_B');
                      return (
                        <tr key={r.id} className="border-b border-gray-800 text-gray-300">
                          <td className="py-2 pr-4 text-white">{r.name}</td>
                          <td className="py-2 pr-4">{r.shift === 0 ? '0 m' : `${num(r.shift)} m`}</td>
                          <td className="py-2 pr-4">{num(r.span?.top)} m</td>
                          <td className="py-2 pr-4">{num(r.span?.base)} m</td>
                          <td className="py-2 pr-4">{num(r.thickness)} m</td>
                          <td className="py-2 pr-4">{topB ? `${num(topB.displayed)} m` : <span className="text-red-400">absent</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500">
                Structural relief on {ZONE.top} across the section (read in structural view): {num(structuralRelief(ZONE.top))} m.
              </p>
            </CardContent>
          </Card>

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
                            Associate certificate <span className="font-mono text-[#BFFF00]">{result.certificate_number}</span> issued.</p>
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance — flatten the section and read the panel again.
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
