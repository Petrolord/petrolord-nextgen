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
  Loader2, Waves, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import QiFeasibilityExplorer from '@/components/course/panels/qi/QiFeasibilityExplorer';
import QiPrestackExplorer from '@/components/course/panels/qi/QiPrestackExplorer';
import QiInversionExplorer from '@/components/course/panels/qi/QiInversionExplorer';
import QiProspectExplorer from '@/components/course/panels/qi/QiProspectExplorer';
import * as QL from '@/components/course/panels/qi/qiLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { QI_CASE_FILES } from '@/content/capstone-cases/qi';

// The Quantitative Interpretation course page, the last course of the
// academy's Geoscience module. AN APP COURSE: the Suite app is QI Studio,
// which runs the same engines, and this page names it. Every practical also
// runs in the course's own four explorer panels, which this page hosts, so a
// learner without a Suite seat can work every exercise. Every number it prints
// is a return value from the teaching lab (qiLab), which is a return value from
// the vendored engines on the synthetic Ekene teaching pack. It never reads
// the capstone: panelCapstoneGuard.test.js greps this file. The capstone case
// files are imported from src/content/capstone-cases/qi and offered on the
// capstone card only.

const APP = 'qi';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'What a QI study asks', body: 'Why a QI study, the Ekene field and the teaching pack, the two questions, times, polarity and impedance units, and the panels and their refusals.' },
  { tier: 'Associate', title: 'The data inventory', body: 'What a QI study needs from each well, the usability matrix, limited and missing curves, and the issue register.' },
  { tier: 'Associate', title: 'Seismic QC', body: 'The amplitude spectrum, band edges and the centroid, signal to noise from trace coherency, and acquisition footprint.' },
  { tier: 'Associate', title: 'Elastic logs at the wells', body: 'What Rock Physics hands to QI, measured shear against Greenberg-Castagna, the local shear trend and its prediction interval, and the elastic set.' },
  { tier: 'Associate', title: 'Will the fluid show?', body: 'The fluids at Ekene conditions, oil-to-brine substitution on a log, how far impedance and Vp/Vs move, the wet trend and the distance from it.' },
  { tier: 'Associate', title: 'The feasibility verdict', body: 'Modelled AVO at the zone top, in situ against brine, writing the verdict, and the capstone brief.' },
  { tier: 'Professional', title: 'From feasibility to the tie', body: 'What the Professional tier adds, the synthetic in one lesson, statistical and well wavelets, and phase and correlation.' },
  { tier: 'Professional', title: 'The tie and the field wavelet', body: 'Bulk shift and anchors, the time-depth record, comparing wavelets across wells, one field wavelet, and when one well disagrees.' },
  { tier: 'Professional', title: 'Gathers and their QC', body: 'Offset gathers and bin width, NMO stretch and the stretch mute, residual moveout, and fold.' },
  { tier: 'Professional', title: 'Angles from velocity', body: 'RMS to interval velocity, the straight-ray angle of Walden, angle gathers and ranges, and partial stacks and the usable angle.' },
  { tier: 'Professional', title: 'AVO volumes', body: 'The Shuey fit from near, mid and far, intercept and gradient volumes, the background trend, the fluid factor and conditioning.' },
  { tier: 'Professional', title: 'AVO at the wells', body: 'One scale over every well, class agreement and misfit, what a disagreement means, and the capstone brief.' },
  { tier: 'Expert', title: 'The forward model', body: 'What the Expert tier adds, the convolutional model and its adjoint, the low-frequency model, and the wavelet scale.' },
  { tier: 'Expert', title: 'Post-stack inversion', body: 'Model-based least squares, blocky and sparse-spike inversion, coloured inversion, blind wells and sensitivity across realisations.' },
  { tier: 'Expert', title: 'Simultaneous inversion', body: 'The three parameters of Fatti, angle-dependent wavelets, why density needs the far angles, and blind wells per parameter.' },
  { tier: 'Expert', title: 'Properties from impedance', body: 'A linear transform and its interval, left-out wells and the widened band, Bayesian facies, two attributes and the confusion matrix.' },
  { tier: 'Expert', title: 'Prospects', body: 'Crest, spill and closure, anomaly conformance and the implied contact, independent evidence, and the QI assessment.' },
  { tier: 'Expert', title: 'The report and the limits', body: 'The QI report and the handover files, what QI never sets, what the engines do not compute, and the capstone brief.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Quantitative Interpretation: Learning Mode locked">
      <p>
        Enrol in the Quantitative Interpretation course of the Geoscience module, and activate your account to open it in
        Learning Mode. A quantitative interpretation asks two questions, is the data good enough and can the seismic see the
        fluid, and answers them with stated engines on stated data: feasibility, then the tie and AVO on the seismic, then
        inversion, properties and the prospect. The Suite&apos;s QI Studio runs the same engines, and every practical also
        runs in the course&apos;s own explorer panels.
      </p>
    </LearningModeGate>
  );
}

const QiLearningPage = () => {
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

  // Engine calls through the teaching lab, on the Ekene teaching pack only.
  const lab = useMemo(() => {
    try {
      const w = QL.timeWindow(QL.qcTraces('spread'), { t0Ms: QL.EKENE.qcWindowsMs[0][0], t1Ms: QL.EKENE.qcWindowsMs[0][1] });
      const spec = QL.spectrum(w, QL.QC_CLOCK.dtMs, { taper: QL.EKENE.qcTaper });
      const fluids = QL.fluidsAt(QL.PACK.conditions.ekene);
      const sub = QL.substituteZone(QL.zoneSamples(QL.packWell('Ekene-1'), 'oil'), fluids);
      if (spec.error || fluids.error || sub.error) return null;
      return { spec, sub };
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
          description: `${res.score}/${res.max_score} answers within tolerance. Work the explorers at the case's stated settings and try again.`,
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
      <Helmet><title>Quantitative Interpretation (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex flex-wrap items-center gap-2">
              <Waves className="h-7 w-7 text-pl-accent-text" /> Quantitative Interpretation
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-pl-muted">Geoscience</p>
            <p className="mt-2 text-sm text-pl-text">
              The Suite app for this course is QI Studio, in the Suite&apos;s Geoscience module, with Rock Physics Studio beside
              it: they run the same engines the lessons quote. Every practical also runs in the course&apos;s own explorer
              panels below, which call those same vendored engines, so the course is complete without a Suite seat.
            </p>
            <p className="mt-1 text-sm text-pl-muted">
              Prerequisite: Well Data Management. Recommended before you start: Rock Physics and Seismic Interpretation.
            </p>
            {lab && (
              <p className="mt-1 text-pl-muted">
                On the synthetic Ekene field the full stack peaks at {six(lab.spec.peakHz)} Hz over the window that holds the
                reservoir, with a -6 dB band from {six(lab.spec.low6Hz)} to {six(lab.spec.high6Hz)} Hz. Taken from oil to brine
                by Gassmann, the Ekene-1 oil leg&apos;s mean acoustic impedance moves from {six(lab.sub.aiBefore)} to{' '}
                {six(lab.sub.aiAfter)} kg/(m2 s). This course is where each of those numbers comes from.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                The synthetic Ekene field, on the vendored QI and rock physics engines. Every number on this page and inside
                every explorer panel is a return value from those engines, pinned by a test file against the figures the
                lessons quote. Every method is named with its authors and year and taught by concept and equation.
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
                onClick={() => setTier(t)} aria-pressed={tier === t}
                className={`px-3 py-1.5 rounded-md border text-sm capitalize ${tier === t ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold' : 'bg-pl-surface text-pl-text border-pl-border-strong hover:bg-pl-sunken'}`}
              >
                {t} tier
              </button>
            ))}
          </div>

          {tier === 'beginner' && <QiFeasibilityExplorer />}
          {tier === 'intermediate' && <QiPrestackExplorer />}
          {tier === 'advanced' && <QiInversionExplorer />}
          {tier === 'advanced' && <QiProspectExplorer />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What the engines declare, and what they leave to you</CardTitle>
              <CardDescription>
                The engines take every figure as a stated input: the window and taper of a spectrum, the lag of a coherency
                search, the periods of a footprint search, the net sand cut-off, the form and level of a shear trend, the
                temperature, pressure, salinity, oil gravity, gas-oil ratio and gas gravity of the fluids, the porosity, shale
                volume and saturation of each sample, the block length of the wet trend and the angles of a model. The explorers
                show a control for each and print the engine&apos;s own words when it refuses. The engines hold no Ekene
                figure of their own, and they do not write the verdict: you do, from the numbers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && QI_CASE_FILES[tier] && QI_CASE_FILES[tier].length > 0 && (
                <CapstoneCaseFiles files={QI_CASE_FILES[tier]}
                  note="Download the case file the brief names. It holds the traces, the well, the conditions and the stated choices the six values are computed from; paste the whole case into the tier's explorer and read each value in the view that computes it. No panel loads a case for you." />
              )}
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
                      <XCircle className="h-5 w-5" /> {result.score}/{result.max_score} within tolerance. Work the explorers at the case's stated settings and try again.
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

export default QiLearningPage;
