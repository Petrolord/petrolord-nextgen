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
  Loader2, HardHat, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import EventTreeExplorer from '@/components/course/panels/qra/EventTreeExplorer';
import SocietalExplorer from '@/components/course/panels/qra/SocietalExplorer';
import AlarpExplorer from '@/components/course/panels/qra/AlarpExplorer';
import {
  places, people, crew, criteria, firewall, STREAMS,
} from '@/components/course/panels/qra/qraLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';

// The Quantitative Risk Assessment course page, the fifth and last course of
// the academy's HSE module. Every number it prints is a return value from the
// teaching lab (qraLab), which is a return value from the vendored QRA engine
// on the teaching streams. It never reads the capstone:
// panelCapstoneGuard.test.js and qraLab.test.js both grep this file.

const APP = 'qra';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const two = (v) => (Number.isFinite(v) ? Number(v).toFixed(2) : 'none');
const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const twelve = (v) => (Number.isFinite(v) ? Number(v).toFixed(12) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What a quantitative risk assessment answers', body: 'Frequencies per year and probabilities, where a probability of death comes from, and the refusals that name their field.' },
  { tier: 'Associate', title: 'Event trees', body: 'Branches, leaves, a branch set that sums to one within a tolerance, and outcomes pooled from several leaves.' },
  { tier: 'Associate', title: 'A flammable release', body: 'Immediate and delayed ignition, the conditional branch, flash fire and explosion, and the direct ignition table.' },
  { tier: 'Associate', title: 'Location-specific individual risk', body: 'The sum of frequency times probability of death at one place, and a published contribution reproduced.' },
  { tier: 'Associate', title: 'Individual risk per annum', body: 'One person over the places they occupy, hours over a year of 8760, one place at a time.' },
  { tier: 'Associate', title: 'One person, end to end', body: 'Individual risk along a transect, contours on a plot plan, and what individual risk does not say.' },
  { tier: 'Professional', title: 'Potential loss of life', body: 'Expected deaths a year from many scenarios, with an expected number of deaths that need not be whole.' },
  { tier: 'Professional', title: 'The fatal accident rate', body: 'FAR from PLL per 100,000,000 exposed hours, and the same number the safety statistics course counts.' },
  { tier: 'Professional', title: 'The F-N curve', body: 'The frequency of N or more deaths, a step function, the area under it, and why it has no published worked example.' },
  { tier: 'Professional', title: 'Criterion lines', body: 'A line through the plane, the Dutch line and its three points, corners that decide everything, and where a curve exceeds.' },
  { tier: 'Professional', title: 'One published point and the boundary', body: 'The single R2P2 point with no slope, a line the analyst supplies, and touching a line.' },
  { tier: 'Professional', title: 'Societal risk, end to end', body: 'Deaths indoors and outdoors, what those fractions rest on, and the societal picture.' },
  { tier: 'Expert', title: 'The ALARP regions', body: 'Three regions, workers and the public, a threshold in the lower band, and the boundary snap.' },
  { tier: 'Expert', title: 'The benefit of a measure', body: 'A fatality prevented and its value, injuries beside it, and the published checklist example with its rounded verdict.' },
  { tier: 'Expert', title: 'Discounting and the ICAF', body: 'Year-end present values, two HSE conventions, and the implied cost of averting a fatality counted undiscounted.' },
  { tier: 'Expert', title: 'Gross disproportion', body: 'The disproportion factor, strictly greater, the largest reasonably practicable cost, and a factor swept.' },
  { tier: 'Expert', title: 'What the engine does not know', body: 'No aversion weighting and no slope, repealed and dated values, factors resting on one reading, and the consequence seam.' },
  { tier: 'Expert', title: 'Judgement, end to end', body: 'Ordering measures, an ALARP case, writing the demonstration, and when the numbers are not enough.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Quantitative Risk Assessment: Learning Mode locked">
      <p>
        Enrol in the Quantitative Risk Assessment course and activate your account to open this app in Learning Mode.
        A quantitative risk assessment turns scenario frequencies and probabilities of death into one person's
        individual risk, a population's societal risk and a test of whether a further measure is reasonably
        practicable, and the course grades each tier on its own question with numbers the engine returns.
      </p>
    </LearningModeGate>
  );
}

const QraLearningPage = () => {
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

  // Engine calls through the teaching lab, on the teaching streams only.
  const lab = useMemo(() => {
    try {
      return {
        p: places(), pp: people(), c: crew(), k: criteria(), f: firewall(),
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
      <Helmet><title>Quantitative Risk Assessment (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
              <HardHat className="h-7 w-7 text-pl-accent-text" /> Quantitative Risk Assessment
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            {lab && (
              <p className="mt-1 text-pl-muted">
                A gas release at {STREAMS.EREMOR_RELEASE.initiatingFrequencyPerYr} per year, through its event tree and
                a stated probability of death at each place, gives the process deck an individual risk of
                {' '}{twelve(lab.p.lsir[0].lsirPerYr)} per year, and the operator who works there part of the year carries
                {' '}{twelve(lab.pp.operator.irpaPerYr)}. A crew of {STREAMS.JISIKE_CREW_PERSONS} expects
                {' '}{twelve(lab.c.pllPerYr)} deaths a year, a fatal accident rate of {six(lab.c.far)}; the town beyond the
                fence sits above the Dutch line by a worst ratio of {six(lab.k.dutch.maxRatio)}. A firewall that would cost
                {' '}{two(lab.f.conventions[0].presentValueCost)} against a benefit of
                {' '}{two(lab.f.conventions[0].presentValueBenefit)} is {lab.f.conventions[0].verdict.toLowerCase().replace(/_/g, ' ')} at its
                disproportion factor. This course is where each of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                The teaching streams and the published cases, on the vendored QRA engine. Every number on this page
                and inside every panel is a return value from that engine, pinned by a test file against the figures the
                lessons quote. Frequencies and individual risks are per year. Every probability of death is a stated input,
                taken from the consequence course.
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

          {tier === 'beginner' && <EventTreeExplorer />}
          {tier === 'beginner' && <EventTreeExplorer initialMode="irpa" />}
          {tier === 'intermediate' && <SocietalExplorer />}
          {tier === 'intermediate' && <SocietalExplorer initialMode="fn" />}
          {tier === 'advanced' && <AlarpExplorer />}
          {tier === 'advanced' && <AlarpExplorer initialMode="cba" />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What this engine declares, and what it does not decide</CardTitle>
              <CardDescription>
                The engine invents no number: every scenario frequency, branch probability, probability of death,
                occupancy, value of preventing a fatality, disproportion factor and rate is an input. Every branch set
                of an event tree sums to one within a tolerance. The F-N curve is the frequency of N or more deaths, and
                no published worked example of one exists, so it is checked by self-consistency. A value exactly at a
                threshold belongs to the lower band: an individual risk at the upper limit is tolerable, a cost exactly
                the disproportion factor times the benefit is reasonably practicable, and a curve on a line touches it.
                Present values are year-end and every rate defaults to zero; the implied cost of averting a fatality
                counts the fatalities prevented undiscounted. The engine has no aversion weighting, gives the single
                R2P2 point no slope, and takes every probability of death from the consequence course.
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

export default QraLearningPage;
