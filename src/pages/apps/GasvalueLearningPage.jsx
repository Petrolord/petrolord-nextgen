import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, Flame, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import CapstonePrompt from '@/components/course/CapstonePrompt';
import FlareExplorer from '@/components/course/panels/gasvalue/FlareExplorer';
import RouteExplorer from '@/components/course/panels/gasvalue/RouteExplorer';
import RolloutExplorer from '@/components/course/panels/gasvalue/RolloutExplorer';
import {
  presetGasAt, egbemaFlareAt, routeYearAt, counterfactualAt, egbemaCreditsAt, kanoVesselsAt, kanoVaporizerAt, cascadeAt, fmt,
} from '@/components/course/panels/gasvalue/gasvalueLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Flare Gas to Value & LPG/CNG course page. Every number it prints is a
// return value from the teaching lab (gasvalueLab), which is a return value of
// the vendored downstream flareToValue and lpgCng engines on the EGBEMA flow
// station, the KANO LPG plant and the IBAFO CNG station. It never reads the
// capstone: panelCapstoneGuard.test.js sweeps this file too, for every graded
// answer as a whole token.

const APP = 'gasvalue';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const LESSONS = [
  { tier: 'Associate', title: 'What Is Being Flared', body: 'Two studios and their engines, a standard cubic foot as a count of moles, the component reference table, and an analysis that does not sum to one.' },
  { tier: 'Associate', title: 'The Gas by the Mole', body: 'The heating value blended on moles, the inerts and the CO2, carbon counted atom by atom, the mass in a thousand cubic feet, and a carbon number never assumed.' },
  { tier: 'Associate', title: 'The Liquids in the Gas', body: 'Gallons per thousand cubic feet, ethane plus and propane plus, rich, moderate and lean, a missing density as a missing answer, and the mass ceiling.' },
  { tier: 'Associate', title: 'The Flare by the Rule', body: 'What a flare emits by 40 CFR 98.233(n), the CO2 in the gas passing through, methane from the methane, and the two efficiencies.' },
  { tier: 'Associate', title: 'CO2e and Its Limits', body: 'CO2e with a stated GWP, the methane share, no efficiency and so no flare, and what the flare model leaves out.' },
  { tier: 'Associate', title: 'The Associate Reading', body: 'The EGBEMA flare end to end, and the studio\'s opening gas read the same way.' },
  { tier: 'Professional', title: 'Four Routes and Their Envelopes', body: 'CNG, mini LNG, LPG extraction and gas to power, limits that are yours to set, and pass, fail and not fully screened.' },
  { tier: 'Professional', title: 'What the Gas Can Yield', body: 'A yield with a basis, the ceiling on each route, megawatt hours from the heating value, and a yield above the gas refused.' },
  { tier: 'Professional', title: "A Route's Year", body: 'Thousand cubic feet a year, recovery as a design outcome, revenue, cost and margin, a blank cost named, and capital by the modular power law.' },
  { tier: 'Professional', title: 'The Counterfactual', body: 'The gross flare as the claim the engine will not make, only the recovered share avoided, what burning the product emits and what it displaces.' },
  { tier: 'Professional', title: 'Credits and the Bid', body: 'Whether the project needs credits, the breakeven credit price in closed form, the lowest tested price that clears, and the bid table.' },
  { tier: 'Professional', title: 'The Professional Reading', body: 'The EGBEMA routes end to end, and what the oracle checks on a parcel.' },
  { tier: 'Expert', title: 'The LPG Blend and the Vessel', body: 'Three properties on three bases, the fill limit and its basis, usable stock and the vapour space, cover, reorder and ullage.' },
  { tier: 'Expert', title: 'Vaporizer, Carousel and Float', body: 'Three terms of vaporizer duty, the boiling point at pressure, the carousel as a queue on the positions wholly working, and cylinders in circulation.' },
  { tier: 'Expert', title: 'Gas in a Bank', body: 'Real gas at storage pressure, ideal against real, gauge and absolute, and the correlation\'s range.' },
  { tier: 'Expert', title: 'The Cascade', body: 'Equalising bank by bank, the gas left in the banks, the ledger that closes, the compressor as a unit bridge, and the forecourt queue.' },
  { tier: 'Expert', title: "The Customer's Switch", body: 'Cost per kilometre, the efficiency ratio the engine will not assume, simple payback, and the trailers that feed the daughter stations.' },
  { tier: 'Expert', title: 'The Expert Reading', body: 'The KANO and IBAFO rollout end to end, the held limits, and what the oracles check.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Flare Gas to Value & LPG/CNG: Learning Mode locked">
      <p>
        Enrol in the Flare Gas to Value &amp; LPG/CNG course and activate your account to open this app in Learning
        Mode. It reads a flared gas by the mole, works its flare by the rule, screens and prices four routes to market
        against a declared counterfactual, and sizes an LPG plant and a CNG station on the basis the engine states. Every
        figure in it is invented and illustrative, and every refusal is the engine&apos;s own sentence.
      </p>
    </LearningModeGate>
  );
}

const txtOf = (v) => (v === null || v === undefined ? 'none' : String(v));

const GasvalueLearningPage = () => {
  const { toast } = useToast();
  const { actualRole } = useRole();
  const [gate, setGate] = useState({ loading: true, allowed: false, quota: null });
  const [tier, setTier] = useState('beginner');
  const [courseProgress, setCourseProgress] = useState(null);
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
    setCourseProgress(null);
    if (hasDeepCourse(APP, tier)) {
      getCourseProgress(APP, tier).then(setCourseProgress).catch(() => setCourseProgress(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier, gate.allowed]);

  // Engine calls through the teaching lab, every one on the course's own records.
  const lab = useMemo(() => {
    try {
      return {
        gas: presetGasAt('egbema'),
        flare: egbemaFlareAt(),
        cng: routeYearAt('cng'),
        cf: counterfactualAt(),
        credits: egbemaCreditsAt(),
        vessel: kanoVesselsAt()[0],
        vaporizer: kanoVaporizerAt(),
        cascade: cascadeAt(),
      };
    } catch {
      return null;
    }
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
        toast({ title: 'Passed: you were already certified', className: 'bg-[#BFFF00] text-slate-900' });
      } else {
        toast({
          title: 'Not passing yet',
          description: `${res.score}/${res.max_score} answers within tolerance. Work the panels at the capstone settings and try again.`,
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
      <Helmet><title>Flare Gas to Value & LPG/CNG (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Flame className="h-7 w-7 text-[#BFFF00]" /> Flare Gas to Value &amp; LPG/CNG
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-gray-400">
                A flare is a measured gas first. EGBEMA&apos;s associated gas carries {fmt.f4(lab.gas.ghvBtuScf)} Btu/scf on
                {' '}moles and {fmt.f4(lab.gas.gpmC3Plus)} gallons of propane and heavier in every Mscf, and its flare by the rule
                {' '}emits {fmt.t3(lab.flare.flareCo2eTonnes)} tCO2e a year at the study&apos;s efficiencies and GWP. Sold as CNG,
                {' '}it earns {fmt.f4(lab.cng.valuePerMscf)} dollars per Mscf and abates {fmt.t3(lab.cf.netAbatementTonnesCo2ePerYear)}
                {' '}tCO2e a year against diesel, and needs a credit price of {fmt.f4(lab.credits.breakevenCreditPrice)} dollars a
                {' '}tonne to clear its hurdle. KANO&apos;s vessel holds {fmt.f4(lab.vessel.usableTonnes)} t at a liquid-volume fill,
                {' '}its vaporizer needs {fmt.f4(lab.vaporizer.designDutyKW)} kW, and IBAFO&apos;s cascade fills
                {' '}{lab.cascade.fillsBeforeRecharge} buses before it recharges. Every figure behind those is invented, and
                {' '}every one is a control.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                Three invented records read by the vendored downstream engines: a flow station flaring its associated gas
                and the four ways to sell it, an LPG storage and bottling plant, and a CNG mother station with a bus
                operator switching to CNG. Every heating value, tonnage, margin, duty, queue and bank figure on this page
                and inside every panel is a return value from those engines, pinned by a test file against the teaching
                digest. Every refusal is the engine&apos;s own sentence.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LESSONS.map((l, i) => (
                <div key={l.title} className="rounded-md border border-gray-700 bg-[#0F172A] p-3">
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-0">{l.tier}, module {(i % 6) + 1}</p>
                  <p className="text-white text-sm font-medium mb-0">{l.title}</p>
                  <p className="text-xs text-gray-400 mt-1 mb-0">{l.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            {LEARN_TIERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold' : 'bg-gray-800 text-gray-300 border-gray-600'}`}
              >
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'beginner' && <FlareExplorer />}
          {tier === 'intermediate' && <RouteExplorer />}
          {tier === 'advanced' && <RolloutExplorer />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What these apps keep as a limit</CardTitle>
              <CardDescription>
                Four things are held by the engines repository, and this course teaches them as stated limits and grades
                none of them. The flare efficiencies have no default: the rule&apos;s tiered defaults are a United States
                rule, and the basis for a Nigerian study is a regulation reading (H1). An unlit flare is not modelled (H2).
                Fill limits by code are not shipped: the site types its limit with its basis (H3). GWP values and credit
                prices are case inputs (H4).
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CapstonePrompt prompt={capstone?.prompt} />
            </CardHeader>
            <CardContent className="space-y-4">
              {!(!hasDeepCourse(APP, tier)
                || courseProgress?.capstone?.unlocked === true
                || courseProgress?.capstone?.passed === true
                || actualRole === 'super_admin') ? (
                  <div className="rounded-md border border-gray-700 bg-[#0F172A] p-4 text-sm text-gray-300 flex items-start gap-2">
                    <Lock className="h-4 w-4 text-[#BFFF00] mt-0.5 shrink-0" />
                    <p className="mb-0">
                      The capstone unlocks after the course: finish the lessons, pass each module quiz
                      and the final exam, then submit here.{' '}
                      <Link to={`/dashboard/apps/${APP}/course/${tier}`} className="text-[#BFFF00] hover:underline">
                        Open the course
                      </Link>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {(capstone?.fields || []).map((f) => (
                        <div key={f.key}>
                          <Label className="text-gray-400 text-xs mb-1 block">{f.label} ({f.unit})</Label>
                          <Input
                            type="number"
                            step="any"
                            value={answers[f.key] ?? ''}
                            onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
                            className="bg-gray-700 text-white border-gray-600 h-8 text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={submit}
                      disabled={submitting || !capstone}
                      className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
                    >
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GraduationCap className="mr-2 h-4 w-4" />}
                      Submit for grading
                    </Button>
                  </>
                )}

              {result && (
                <div className={`rounded-md border p-4 ${result.passed ? 'border-emerald-700 bg-emerald-900/20' : 'border-red-800 bg-red-900/20'}`}>
                  {result.passed ? (
                    <>
                      <p className="text-emerald-300 font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" /> Passed ({result.score}/{result.max_score})
                      </p>
                      {result.certificate_number ? (
                        <div className="mt-2 text-sm text-gray-300 space-y-1">
                          <p className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-[#BFFF00]" />
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance. Work the panels at the capstone settings and try again.
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

export default GasvalueLearningPage;
