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
  computeIntermediate, INTERMEDIATE_DATUM, computeAdvanced,
} from '@/lib/correlationTeaching';
import SectionExplorer from '@/components/course/panels/wellcorrelation/SectionExplorer';
import {
  hasScope, getQuota, getCapstone, submitCapstone, verificationUrl,
} from '@/services/academyService';

const APP = 'wellcorrelation';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

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
const WellCorrelationLearningPage = () => {
  const { toast } = useToast();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
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

          {/* Section: the shared explorer panel (also embedded in DC6 lessons) */}
          <SectionExplorer />

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
                  <CardTitle className="text-white">Growth analysis (Intermediate)</CardTitle>
                  <CardDescription>
                    Flattened on {INTERMEDIATE_DATUM.topName} at {INTERMEDIATE_DATUM.datumM} m — the A-to-SAND interval thickens where accommodation grew.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="py-2 pr-4">Well</th><th className="py-2 pr-4">Shift</th>
                        <th className="py-2 pr-4">TOP_A→TOP_SAND</th><th className="py-2 pr-4">TOP_SAND (displayed)</th>
                        <th className="py-2 pr-4">All four tops?</th>
                      </tr></thead>
                      <tbody>
                        {inter.rows.map((r) => (
                          <tr key={r.id} className="border-b border-gray-800 text-gray-300">
                            <td className="py-2 pr-4 text-white">{r.name}</td>
                            <td className="py-2 pr-4">{num(r.shift)} m</td>
                            <td className="py-2 pr-4">{num(r.aToSand)} m</td>
                            <td className="py-2 pr-4">{num(r.sandDisplayed)} m</td>
                            <td className="py-2 pr-4">{r.allFourTops ? 'yes' : <span className="text-red-400">no</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 text-sm">
                    {[
                      ['Growth range (max − min)', `${num(inter.growthRange)} m`],
                      ['Wells with all four tops', `${inter.wellsWithAllTops}`],
                      ['Displayed depth span', `${num(inter.displayedSpan)} m`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                        <p className="text-gray-500 text-xs">{k}</p>
                        <p className="text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {tier === 'advanced' && (() => {
            const adv = computeAdvanced();
            return (
              <Card className="bg-[#1E293B] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Missing-pick prediction (Advanced)</CardTitle>
                  <CardDescription>
                    Ekene-4 TDs above TOP_B. Two interval methods project the missing pick from the three wells that carry it; the spread between them is the growth uncertainty.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="py-2 pr-4">Well</th><th className="py-2 pr-4">TOP_B</th>
                        <th className="py-2 pr-4">TOP_A to TOP_B</th><th className="py-2 pr-4">TOP_SAND to TOP_B</th>
                      </tr></thead>
                      <tbody>
                        {adv.rows.map((r) => (
                          <tr key={r.id} className="border-b border-gray-800 text-gray-300">
                            <td className="py-2 pr-4 text-white">{r.name}</td>
                            <td className="py-2 pr-4">{r.topB} m</td>
                            <td className="py-2 pr-4">{r.aToB} m</td>
                            <td className="py-2 pr-4">{r.sandToB} m</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    {[
                      ['Mean TOP_A to TOP_B interval', `${adv.aToBMean.toFixed(2)} m`],
                      ['Mean TOP_SAND to TOP_B interval', `${adv.sandToBMean.toFixed(2)} m`],
                      ['Ekene-4 TOP_B, layer-cake estimate', `${adv.w4TopBLayercake.toFixed(2)} m`],
                      ['Ekene-4 TOP_B, from TOP_SAND', `${adv.w4TopBFromSand.toFixed(2)} m`],
                      ['Spread between the estimates', `${adv.predictionSpread.toFixed(2)} m`],
                      ['TOP_B structural relief (3 wells)', `${adv.topBRelief.toFixed(2)} m`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                        <p className="text-gray-500 text-xs">{k}</p>
                        <p className="text-white">{v}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    The section grows toward Ekene-4, so the layer-cake estimate is a floor and the TOP_SAND projection a better anchor. Report the spread honestly rather than picking a favourite.
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
