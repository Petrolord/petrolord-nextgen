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
  Loader2, Database, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import EnvelopeCalculator from '@/components/course/panels/procurement/EnvelopeCalculator';
import AwardCalculator from '@/components/course/panels/procurement/AwardCalculator';
import ContractCalculator from '@/components/course/panels/procurement/ContractCalculator';
import {
  wellServicesReader, materialsReader, shouldCostReader,
} from '@/components/course/panels/procurement/tenderLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { PROCUREMENT_CASE_FILES } from '@/content/capstone-cases/procurement';

// The Procurement, Tendering & Contracting course page, the second course of
// the academy's Supply Chain module. AN ENGINE COURSE: there is no Suite app,
// and every practical runs in the course's own three calculator panels, which
// this page hosts. Every number it prints is a return value from the teaching
// lab (tenderLab), which is a return value from the vendored tender engine on
// the synthetic Ekene tender fixtures. It never reads the capstone:
// panelCapstoneGuard.test.js and tenderLab.test.js both grep this file. The
// capstone case files are imported from src/content/capstone-cases/procurement
// and offered on the capstone card only.

const APP = 'procurement';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What a tender evaluation decides', body: 'A scope, a tender and a contract, one envelope then the other, the Ekene tenders, the sources and the dates they were read, and the calculator panels with the refusals they show.' },
  { tier: 'Associate', title: 'The technical envelope', body: 'Mandatory requirements first, weights and maximum scores, the technical percentage and weighted points, the pass mark, and a price envelope that is never opened.' },
  { tier: 'Associate', title: 'Arithmetic correction', body: 'Quantity times unit rate, the unit rate prevailing, a misplaced decimal point, and the tolerance and the quoted total.' },
  { tier: 'Associate', title: 'Evaluated cost', body: 'The corrected price less the discount, priced deviations, an omitted item priced at the average, and completion time with its adjustment.' },
  { tier: 'Associate', title: 'The combined score', body: 'The commercial score of the lowest ratio, the relative technical score, weighting the two, and the Guidance worked example figure by figure.' },
  { tier: 'Associate', title: 'Reading an award', body: 'The ranking and its tie-break, the most advantageous bid, and every exclusion with its reason.' },
  { tier: 'Professional', title: 'Lowest evaluated cost over the life of the asset', body: 'An award without rated criteria, the life-cycle cost as a net present cost through the canonical NPV, and residual value.' },
  { tier: 'Professional', title: 'Rated criteria and price scoring', body: 'Risk, value and the weighting matrix, the high-value line, linear price scoring, and the ranking paradox of relative price scores.' },
  { tier: 'Professional', title: 'Abnormally low bids', body: 'The absolute test below five bids, the relative test from five, the population standard deviation, and clarification before any decision.' },
  { tier: 'Professional', title: 'Measuring Nigerian content', body: 'The 2010 Act and its Schedule, man-hours, tonnage, number and spend, an item against its minimum, overall content across mixed units, and a target the Schedule does not list.' },
  { tier: 'Professional', title: 'Section 14 of the Act', body: 'Bids within one percent, the closest competitor, two readings of at least five percent higher, and a shared highest content.' },
  { tier: 'Professional', title: 'Section 16 and the award', body: 'Protection within ten percent, content in a combined award, and the materials award end to end.' },
  { tier: 'Expert', title: 'Contract types on one job', body: 'A lump sum, a day rate and a reimbursable contract under a seeded duration and daily cost, and who carries the overrun.' },
  { tier: 'Expert', title: 'Cost percentiles and their labels', body: 'The exceedance definition, why the high-probability label is the low cost, reading a cost range, and the plan against the mean.' },
  { tier: 'Expert', title: 'Should-cost', body: 'An independent estimate from the activity programme, contingency and the partner split, the screening band, and the abnormally low test beside it.' },
  { tier: 'Expert', title: 'Whole-tender evaluation', body: 'Stages chained in one call, the well services tender end to end, when nobody passes, and the award basis deciding.' },
  { tier: 'Expert', title: 'Reading the engine honestly', body: 'Cited readings and their dates, the uncited omission option, an erratum in the Guidance, printed and exact figures, and every boundary rule.' },
  { tier: 'Expert', title: 'Conventions and the evaluation report', body: 'Conventions that are choices, what the engine does not build, and writing the evaluation report.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Procurement, Tendering & Contracting: Learning Mode locked">
      <p>
        Enrol in the Procurement, Tendering &amp; Contracting course, the second course of the Supply Chain module, and
        activate your account to open it in Learning Mode. A tender is decided by rules that can be written down and
        computed, so the course teaches the two-envelope evaluation by hand, then the lowest evaluated cost with a
        life-cycle cost, abnormally low bids and the Nigerian content Act, then contract types under uncertainty,
        should-cost and a reading of the engine&apos;s own sources, and grades each tier with numbers the tender engine
        returns. There is no Suite app for this course: every practical runs in the course&apos;s own calculator panels.
      </p>
    </LearningModeGate>
  );
}

const ProcurementLearningPage = () => {
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

  // Engine calls through the teaching lab, on the Ekene tender fixtures only.
  const lab = useMemo(() => {
    try {
      return { w: wellServicesReader(), m: materialsReader(), s: shouldCostReader() };
    } catch {
      return null;
    }
  }, []);

  const watermark = gate.quota?.export_watermark;

  const submit = async () => {
    setSubmitting(true);
    try {
      const numeric = buildCapstoneAnswers(capstone?.fields, answers);
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
      <Helmet><title>Procurement, Tendering &amp; Contracting (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-white/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Database className="h-7 w-7 text-[#BFFF00]" /> Procurement, Tendering &amp; Contracting
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">Supply Chain, course two</p>
            <p className="mt-2 text-sm text-gray-300">
              This is an engine course. There is no Suite app for it: every practical runs in the course&apos;s own
              calculator panels below, which call the same vendored tender engine the lessons quote.
            </p>
            {lab && (
              <p className="mt-1 text-gray-400">
                On the synthetic Ekene well services tender, {lab.w.excluded.length} of the six bids never reach the
                commercial envelope. The lowest evaluated cost is {lab.w.lowestEvaluatedCost}, at{' '}
                {six(lab.w.commercial.find((b) => b.id === lab.w.lowestEvaluatedCost).evaluatedCost)}, and the combined score awards the
                job to {lab.w.award}. On the materials tender, section 14 of the content Act selects {lab.m.relative.award} when its
                five percent is read as a share of the runner-up&apos;s content and leaves {lab.m.points.award} standing when it is read
                as percentage points. The company&apos;s own should-cost for the well services job is {six(lab.s.estimate)}.
                This course is where each of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><BookOpen className="h-5 w-5 text-[#BFFF00]" /> Lessons</CardTitle>
              <CardDescription>
                The synthetic Ekene tenders, on the vendored tender engine. Every number on this page and inside every
                calculator panel is a return value from that engine, pinned by a test file against the figures the
                lessons quote. Every method is named by what it is: a weighted technical score against a pass mark,
                arithmetic correction, an evaluated cost, a combined score, a net present cost, a mean less a standard
                deviation, a content percentage in the Schedule&apos;s unit, and a seeded Monte Carlo run.
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

          {tier === 'beginner' && <EnvelopeCalculator />}
          {tier === 'beginner' && <EnvelopeCalculator initialMode="evaluated" />}
          {tier === 'intermediate' && <AwardCalculator />}
          {tier === 'intermediate' && <AwardCalculator initialMode="preference" />}
          {tier === 'advanced' && <ContractCalculator />}
          {tier === 'advanced' && <ContractCalculator initialMode="shouldcost" />}

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                A bid that fails a mandatory requirement is not scored, and a bid below the pass mark never has its price
                opened. A bill line whose quantity times unit rate differs from its amount is corrected with the unit rate
                prevailing, unless the bidder declares the decimal point misplaced. An omitted item is priced at the average
                the other responsive bids quote. The pass mark, the weights, the technical weight, the scoring methods, the
                s.14 reading, the should-cost band and the Monte Carlo seed have no default: you state each one. Scores
                that agree to twelve significant digits tie, and the lower evaluated cost, then the earlier receipt, then
                the bidder id decide. For a cost, P90 is the low figure. Every law and guidance the engine applies is cited
                with its edition and the date it was read.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-[#1E293B] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && PROCUREMENT_CASE_FILES[tier] && (
                <CapstoneCaseFiles files={PROCUREMENT_CASE_FILES[tier]}
                  note="Download the case file the brief names. It holds the criteria, bids, bills, programme, cost items or partners the six values are computed from; paste the parts each value needs into the calculator view it belongs to. No panel loads a case for you." />
              )}
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
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
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

export default ProcurementLearningPage;
