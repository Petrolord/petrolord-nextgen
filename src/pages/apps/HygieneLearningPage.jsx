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
  Loader2, Ear, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import NoiseDosimeterExplorer from '@/components/course/panels/hygiene/NoiseDosimeterExplorer';
import ProtectionChemicalsExplorer from '@/components/course/panels/hygiene/ProtectionChemicalsExplorer';
import HeatStressExplorer from '@/components/course/panels/hygiene/HeatStressExplorer';
import {
  threeCriteria, lex, heat, TRANSCRIPTION_ONLY,
} from '@/components/course/panels/hygiene/hygieneLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Occupational Hygiene course page, the second course of the academy's HSE
// module. Every number it prints is a return value from the teaching lab
// (hygieneLab), which is a return value from the vendored exposure engine on
// the teaching records and the published tables. It never reads the capstone:
// panelCapstoneGuard.test.js and hygieneLab.test.js both grep this file.
//
// THIS COURSE GRADES NO HEAT LIMIT. The NIOSH 2016 RAL and REL equations and the
// WBGT weights are checked for transcription only, and NIOSH's own worked
// example disagrees with its own equation, so they are taught with that status
// beside every figure and never graded.

const APP = 'hygiene';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'A noise dose is a fraction of an allowance', body: 'The reference duration, the decibel exchange rate and the threshold decide what a dosimeter adds up, and each criterion sets all three differently.' },
  { tier: 'Associate', title: 'From noise dose to TWA', body: 'The TWA restates a noise dose as a level. Each source prints its own coefficient, and the printed one is what reproduces its own table.' },
  { tier: 'Associate', title: 'Three criteria, one record', body: 'The same day under the OSHA PEL, over the OSHA action level and over the NIOSH noise REL. A noise dose with no criterion named says nothing.' },
  { tier: 'Associate', title: 'Reading a dosimeter record', body: 'Periods and their contributions, the loudest period as one term of a sum, and the time left at a level.' },
  { tier: 'Associate', title: 'Inverse questions', body: 'The level for a reference duration, the noise dose from a TWA, and what one decibel is worth on each scale.' },
  { tier: 'Associate', title: 'The Associate capstone', body: 'One record read end to end under all three criteria.' },
  { tier: 'Professional', title: 'The daily noise exposure level', body: 'LEX,8h is an energy average normalised to eight hours, with no threshold, and exposure points are the same quantity on a linear scale.' },
  { tier: 'Professional', title: 'The week', body: 'The weekly level divides by five whatever the number of days, and one loud day dominates it.' },
  { tier: 'Professional', title: 'Hearing protector estimates', body: 'Appendix B, the field derating for engineering controls, the NIOSH derating by type and dual protection: four methods, four questions.' },
  { tier: 'Professional', title: 'Chemical averages', body: 'The 8-hour TWA divides by eight whatever the record covers, and the STEL is a fifteen-minute window.' },
  { tier: 'Professional', title: 'Mixtures', body: 'The additive index, the published example, unity passing, and when additivity is the wrong model.' },
  { tier: 'Professional', title: 'The Professional capstone', body: 'Noise and chemicals on one maintenance crew.' },
  { tier: 'Expert', title: 'The wet bulb globe temperature', body: 'Three thermometers, two sets of weights, and a one-hour average.' },
  { tier: 'Expert', title: 'Metabolic rate and the NIOSH limits', body: 'The RAL and REL equations as published, acclimatisation as an input, and the sixty-minute rule.' },
  { tier: 'Expert', title: 'How strong is each equation', body: 'Published and reproduced, oracle only, or transcription only, and the worked example that disagrees with its own equation.' },
  { tier: 'Expert', title: 'Errata in the standards', body: 'A digit slip, a row its neighbours contradict, truncation and rounding, and what a pinned erratum does to a gate.' },
  { tier: 'Expert', title: 'The shift that is not eight hours', body: 'The extended-shift action level, the noise dose over a long shift, and Brief and Scala daily and weekly.' },
  { tier: 'Expert', title: 'From exposures to a sampling decision', body: 'Three hazards on one crew, adjusted limits in a mixture, and what to measure next.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Occupational Hygiene: Learning Mode locked">
      <p>
        Enrol in the Occupational Hygiene course and activate your account to open this app in Learning Mode. The
        course reads one dosimeter record under three criteria, builds the daily and weekly noise exposure levels,
        compares four hearing protector methods, averages chemical samples, and assesses heat stress against the
        NIOSH equations with the evidence behind each one printed beside it.
      </p>
    </LearningModeGate>
  );
}

const HygieneLearningPage = () => {
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

  // Engine calls through the teaching lab: the teaching dosimeter record under
  // three criteria, the teaching LEX day, and the teaching heat hour.
  const lab = useMemo(() => {
    try {
      return { c: threeCriteria(), l: lex(), h: heat() };
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
      <Helmet><title>Occupational Hygiene (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <Ear className="h-7 w-7 text-pl-accent-text" /> Occupational Hygiene: Noise, Chemical &amp; Heat Exposure
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-pl-muted">
                One eight-hour dosimeter record reads {six(lab.c.oben[0].dosePct)} percent against the OSHA PEL,
                {' '}{six(lab.c.oben[1].dosePct)} percent against the OSHA action level and {six(lab.c.oben[2].dosePct)} percent
                {' '}against the NIOSH noise REL, from the same periods. A task survey of one day gives a LEX,8h of
                {' '}{six(lab.l.day.lexDbA)} dBA, which is {six(lab.l.day.exposurePoints)} exposure points. A work and rest hour
                {' '}averages to a WBGT of {six(lab.h.hour.wbgtTwaC)} C at {six(lab.h.hour.metabolicTwaW)} W, and the heat limit it
                {' '}is compared with is {TRANSCRIPTION_ONLY}. This course is where each of those numbers comes from, and where
                {' '}each of them stops.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                Teaching dosimeter records, task surveys, air samples and heat readings, plus the published tables the
                engine reproduces, on the vendored exposure engine. Every number on this page and inside every panel is a
                return value from that engine, pinned by a test file against the figures the lessons quote. Every exposure limit is an
                input typed from a public OSHA or NIOSH value, and no licensed limit is quoted.
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
                aria-pressed={tier === t}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong hover:bg-pl-sunken'}`}
              >
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'beginner' && <NoiseDosimeterExplorer />}
          {tier === 'beginner' && <NoiseDosimeterExplorer initialMode="tables" />}
          {tier === 'intermediate' && <NoiseDosimeterExplorer initialMode="lex" />}
          {tier === 'intermediate' && <ProtectionChemicalsExplorer />}
          {tier === 'advanced' && <HeatStressExplorer />}
          {tier === 'advanced' && <ProtectionChemicalsExplorer initialMode="reduction" />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What this course grades, and what it teaches without grading</CardTitle>
              <CardDescription>
                Noise doses and TWAs, LEX values, the OSHA engineering-controls protector estimate, chemical averages and
                indices, and reduction-factor arithmetic are graded: each stands on a formula a source prints and the engine
                reproduces. The NIOSH 2016 RAL and REL equations and the WBGT weights are taught and never graded, because
                they are checked for transcription only and the document&apos;s own worked example disagrees with its own
                equation. The two heat quantities a capstone grades are one-hour time weighted averages of readings the
                capstone states. The NIOSH protector derating by type, dual protection and the Brief and Scala weekly
                factor are oracle only and are not graded either.
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

export default HygieneLearningPage;
