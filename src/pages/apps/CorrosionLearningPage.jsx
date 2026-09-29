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
  Loader2, ShieldAlert, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import ChemistryExplorer from '@/components/course/panels/corrosion/ChemistryExplorer';
import RateExplorer from '@/components/course/panels/corrosion/RateExplorer';
import InhibitorIntegrityExplorer from '@/components/course/panels/corrosion/InhibitorIntegrityExplorer';
import {
  studioDefaults, inhibitorArithmetic, heldItems, theWithdrawal,
} from '@/components/course/panels/corrosion/corrosionLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Corrosion & Integrity course page. Every number it prints is a return
// value from the teaching lab (corrosionLab), which is a return value from the
// vendored Corrosion & Integrity engine on the teaching streams and the live
// studio's own shipped defaults. It never reads the capstone:
// panelCapstoneGuard.test.js and corrosionLab.test.js both grep this file.
//
// THIS COURSE GRADES NO CORROSION RATE. Eleven items in this engine have no
// source anywhere in the repository and one sour-service severity region was
// withdrawn rather than retuned, so no rate the correlation produced, no band
// label, no threshold verdict, no regime and no material appears here as a
// graded truth.

const APP = 'corrosion';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');

const LESSONS = [
  {
    tier: 'Associate',
    title: 'What this engine computes, and what it refuses to',
    body: 'A CO2 corrosion rate screen with a remaining-life calculation on the end of it, and a list of what it does not answer that is longer than the list of what it does.',
  },
  {
    tier: 'Associate',
    title: 'Partial pressure and fugacity',
    body: 'Two quantities, one molecule, two different numbers, and only one of them drives the rate. The H2S comparison uses the other one, with no correction applied to it at all.',
  },
  {
    tier: 'Associate',
    title: 'Two resistances in series',
    body: 'The reaction term, the transport term, and a combined answer that is always below both. Which one is holding the rate back, and the reporting margin on that word.',
  },
  {
    tier: 'Associate',
    title: 'The protective film and an onset that moves',
    body: 'A multiplier clamped at one, an onset temperature computed rather than quoted, and a question about where that factor belongs that is still open.',
  },
  {
    tier: 'Associate',
    title: 'pH and the reference it is taken against',
    body: 'One decade per two pH units as a scale-free property, and a refusal below the reference rather than the least limiting answer of one.',
  },
  {
    tier: 'Associate',
    title: 'The studio case, end to end',
    body: 'Every number the shipped screen shows, in the engine\'s units and in field units, and the five changes that each reach a different part of the module.',
  },
  {
    tier: 'Professional',
    title: 'Water wetting, a dropdown that zeroes the rate',
    body: 'A regime rather than a multiplier applied always, a zero rate that is an assumption, and an inhibition figure that is null rather than zero.',
  },
  {
    tier: 'Professional',
    title: 'The corrosion inhibitor arithmetic',
    body: 'Efficiency and availability as separate inputs, the effective protection they give, and the metal-loss ratio that surprises people. The one lesson this module exists to teach.',
  },
  {
    tier: 'Professional',
    title: 'Wall shear and a reported discontinuity',
    body: 'This module\'s friction factor on two branches, a hard switch between them, and a jump the engine reports rather than smooths.',
  },
  {
    tier: 'Professional',
    title: 'The coupling',
    body: 'The shear verdict acting on the rate, the credited rate reported beside it, and a ratio that is pure corrosion inhibitor arithmetic.',
  },
  {
    tier: 'Professional',
    title: 'H2S, a threshold, and nothing more',
    body: 'One comparison in two units, a threshold whose value is held, and a severity region that is gone rather than retuned.',
  },
  {
    tier: 'Professional',
    title: 'Which film governs',
    body: 'A ratio that needs no pressure at all, four answers, and a sulphide regime that withholds the label and the life and keeps the rate as an upper bound.',
  },
  {
    tier: 'Expert',
    title: 'What is held and what is not provided',
    body: 'Eleven unsourced numbers, eight named absences and one withdrawal, read before anything else in this course.',
  },
  {
    tier: 'Expert',
    title: 'The allowance and the remaining life',
    body: 'An allowance divided by a rate, a required allowance that ignores what has gone, and a zero rate that returns no verdict at all.',
  },
  {
    tier: 'Expert',
    title: 'The band label is a label',
    body: 'Four words, four boundaries and no source for any of them, including the one at zero that the golden is where it is pinned.',
  },
  {
    tier: 'Expert',
    title: 'The binding constraint',
    body: 'The summary this module did not have: which of its own limits governs the answer, in descending order of what would change first.',
  },
  {
    tier: 'Expert',
    title: 'What a case can tell apart',
    body: 'Independent routes, constant-free invariants and pins, and the arithmetic of why a constant in two files cannot be checked by comparing them.',
  },
  {
    tier: 'Expert',
    title: 'The withdrawal',
    body: 'A curve carrying a standard\'s name that was invented here, and the only repair available once a number was never the claim.',
  },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Corrosion & Integrity: Learning Mode locked">
      <p>
        Enrol in the Corrosion & Integrity course and activate your account to open this app in Learning Mode.
        A corrosion rate is a claim about a mechanism, and this engine&apos;s claim rests on numbers that are not
        sourced anywhere in the repository. So the course teaches the rate as a screening argument to be read and
        argued with, and it grades only what the engine can stand behind: what is in the stream, how fast it moves,
        what the corrosion inhibitor programme actually delivers, and what the allowance actually buys.
      </p>
    </LearningModeGate>
  );
}

const CorrosionLearningPage = () => {
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

  // Engine calls through the teaching lab: the live studio's shipped case, the
  // corrosion inhibitor arithmetic, and everything the engine declares it cannot
  // stand behind.
  const lab = useMemo(() => {
    try {
      return {
        d: studioDefaults(), i: inhibitorArithmetic(), held: heldItems(), w: theWithdrawal(),
      };
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
        toast({ title: `Capstone passed. ${CERT_LABELS[res.tier] || 'Associate'} certified!`, description: res.certificate_number, className: 'border-pl-success/40 bg-pl-success-bg text-pl-success-text' });
      } else if (res.passed) {
        toast({ title: 'Passed: you were already certified', className: 'border-pl-success/40 bg-pl-success-bg text-pl-success-text' });
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
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-pl-primary-text" /></div>;
  }
  if (!gate.allowed) return <ScopeGate />;

  return (
    <>
      <Helmet><title>Corrosion & Integrity (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <ShieldAlert className="h-7 w-7 text-pl-accent-text" /> Corrosion & Integrity
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-pl-muted">
                The shipped studio case arrives carrying {six(lab.d.pco2Bar)} bar of CO2 partial pressure, which the
                engine turns into a fugacity of {six(lab.d.fco2Bar)} bar, and it is the fugacity that drives the rate.
                Two resistances in series give {six(lab.d.reactionMmYr)} mm/yr of reaction against
                {' '}{six(lab.d.massTransferMmYr)} mm/yr of transport and a combined {six(lab.d.combinedMmYr)} mm/yr,
                below both of them. The corrosion inhibitor programme on that line is 90 percent efficient at 95 percent
                availability, which delivers {six(lab.d.effectiveInhibitionPct)} percent effective protection and leaves
                a shortfall of {six(lab.d.inhibitorShortfallPp)} percentage points. This module&apos;s Reynolds number
                there is {four(lab.d.reynolds)} on the {lab.d.branch} branch, the wall shear is {six(lab.d.tauPa)} Pa,
                and the allowance divided by the rate gives {six(lab.d.remainingYears)} years. The H2S partial pressure
                is {six(lab.d.ph2sBar)} bar, which is {six(lab.d.ph2sPsia)} psia, and the engine returns
                {' '}<span className="font-mono">regionProvided</span> {String(lab.w.regionProvided)} and
                {' '}<span className="font-mono">materialGuidanceProvided</span> {String(lab.w.materialGuidanceProvided)}
                {' '}beside it, because a curve that told engineers what steel to buy was withdrawn rather than retuned.
                This course is where each of those numbers comes from, and where each of them stops.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                Six teaching streams, the published golden and the live studio&apos;s own shipped defaults, on the
                vendored Corrosion & Integrity engine. Every number on this page and inside every panel is a return
                value from that engine, pinned by a test file against the figures the lessons quote. The engine works in the units
                its correlations are published in: degrees Celsius, bar, millimetres a year, metres a second, metres,
                kilograms a cubic metre and pascal seconds. Nothing in this course is a distribution, so no percentile
                label belongs anywhere in it.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LESSONS.map((l, i) => (
                <div key={l.title} className="rounded-md border border-pl-border bg-pl-sunken p-3">
                  <p className="text-[10px] uppercase tracking-wide text-pl-muted mb-0">{l.tier}, module {(i % 6) + 1}</p>
                  <p className="text-pl-text text-sm font-medium mb-0">{l.title}</p>
                  <p className="text-xs text-pl-muted mt-1 mb-0">{l.body}</p>
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
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong hover:bg-pl-sunken'}`}
              >
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'beginner' && <ChemistryExplorer />}
          {tier === 'beginner' && <RateExplorer />}
          {tier === 'intermediate' && <RateExplorer initialMode="wetting" />}
          {tier === 'intermediate' && <InhibitorIntegrityExplorer />}
          {tier === 'advanced' && <InhibitorIntegrityExplorer initialMode="allowance" />}
          {tier === 'advanced' && <ChemistryExplorer initialMode="absent" />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What this engine cannot stand behind, and what it will not pretend to answer</CardTitle>
              <CardDescription>
                A corrosion rate is a claim about a mechanism. This engine declares in its own exported lists that
                eleven of the numbers its claim rests on have no source anywhere in the repository, and that eight
                further things are simply absent. One more was neither held nor absent: a sour-service severity region
                and the named material guidance served off it were WITHDRAWN, because a curve carrying a standard&apos;s
                name and telling an engineer what steel to buy is not a tolerance question. That is why this course
                grades no rate the correlation produced, no band label, no threshold verdict, no regime and no material.
                {lab && (
                  <>
                    <ul className="mt-2 space-y-1">
                      {lab.held.held.map((h) => (
                        <li key={h} className="text-xs text-pl-muted">HELD. {h}</li>
                      ))}
                    </ul>
                    <ul className="mt-2 space-y-1">
                      {lab.held.notProvided.map((h) => (
                        <li key={h} className="text-xs text-pl-muted">NOT PROVIDED. {h}</li>
                      ))}
                    </ul>
                  </>
                )}
                The word integrity is used narrowly here: it means one arithmetic, an allowance divided by a rate, and
                that is all it is. There is no inspection interval in this module, no minimum thickness, no retirement
                thickness and no fitness-for-service method. There is no erosional-velocity criterion either, so
                mechanical erosion from entrained solids or from liquid impingement is outside this engine entirely and
                the Casing &amp; Tubing Design course is where that criterion lives. This module&apos;s friction factor
                and this module&apos;s Reynolds number are its own: the Pipeline &amp; Line Sizing course computes both
                with a different correlation and a different transition, and the two will not agree on the same pipe.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!(!hasDeepCourse(APP, tier)
                || courseProgress?.capstone?.unlocked === true
                || courseProgress?.capstone?.passed === true
                || actualRole === 'super_admin') ? (
                  <div className="rounded-md border border-pl-border bg-pl-sunken p-4 text-sm text-pl-text flex items-start gap-2">
                    <Lock className="h-4 w-4 text-pl-accent-text mt-0.5 shrink-0" />
                    <p className="mb-0">
                      The capstone unlocks after the course: finish the lessons, pass each module quiz
                      and the final exam, then submit here.{' '}
                      <Link to={`/dashboard/apps/${APP}/course/${tier}`} className="text-pl-primary-text hover:underline">
                        Open the course
                      </Link>
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {(capstone?.fields || []).map((f) => (
                        <div key={f.key}>
                          <Label className="text-pl-muted text-xs mb-1 block">{f.label} ({f.unit})</Label>
                          <Input
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            value={answers[f.key] ?? ''}
                            onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
                            className="h-8 text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={submit}
                      disabled={submitting || !capstone}
                      className="font-semibold"
                    >
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GraduationCap className="mr-2 h-4 w-4" />}
                      Submit for grading
                    </Button>
                  </>
                )}

              {result && (
                <div className={`rounded-md border p-4 ${result.passed ? 'border-pl-success/30 bg-pl-success-bg' : 'border-pl-danger/30 bg-pl-danger-bg'}`}>
                  {result.passed ? (
                    <>
                      <p className="text-pl-success-text font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" /> Passed ({result.score}/{result.max_score})
                      </p>
                      {result.certificate_number ? (
                        <div className="mt-2 text-sm text-pl-text space-y-1">
                          <p className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-pl-accent-text" />
                            {CERT_LABELS[result.tier] || 'Associate'} certificate <span className="font-mono text-pl-accent-text">{result.certificate_number}</span> issued.
                            {result.tier === 'expert' && ' Your 50% Suite discount code is on your certificates page.'}
                          </p>
                          <div className="flex gap-3">
                            <Link to="/dashboard/certificates" className="text-pl-primary-text hover:underline inline-flex items-center gap-1">
                              My certificates <ArrowRight className="h-3 w-3" />
                            </Link>
                            <a href={verificationUrl(result.verify_code)} target="_blank" rel="noreferrer" className="text-pl-muted hover:underline">
                              Public verification
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-pl-muted">You were already certified for this tier.</p>
                      )}
                    </>
                  ) : (
                    <p className="text-pl-danger-text font-medium flex items-center gap-2">
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

export default CorrosionLearningPage;
