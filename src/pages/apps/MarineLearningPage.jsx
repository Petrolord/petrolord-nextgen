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
  Loader2, Ship, GraduationCap, Lock, CheckCircle2, XCircle,
  BookOpen, Award, ArrowRight,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { hasDeepCourse } from '@/lib/courseContent';
import DeepCourseBanner from '@/components/course/DeepCourseBanner';
import VoyageCalculator from '@/components/course/panels/marine/VoyageCalculator';
import DeckCalculator from '@/components/course/panels/marine/DeckCalculator';
import BaseCalculator from '@/components/course/panels/marine/BaseCalculator';
import VariabilityCalculator from '@/components/course/panels/marine/VariabilityCalculator';
import {
  voyageReader, fleetReader, deckReader, variabilityReader,
} from '@/components/course/panels/marine/marineLab';
import {
  hasScope, getQuota, getCapstone, submitCapstone, getCourseProgress, verificationUrl,
} from '@/services/academyService';
import { buildCapstoneAnswers } from '@/lib/capstoneAnswer';
import LearningModeGate from '@/components/academy/LearningModeGate';
import CapstoneCaseFiles from '@/components/course/CapstoneCaseFiles';
import { MARINE_CASE_FILES } from '@/content/capstone-cases/marine';

// The Offshore & Marine Logistics course page, a course of the academy's
// Supply Chain & Logistics module. AN APP COURSE: the Suite app is the Marine
// Logistics Planner, which runs the same engine file, and this page names it.
// Every practical also runs in the course's own four calculator panels, which
// this page hosts, so a learner without a Suite seat can work every exercise.
// Every number it prints is a return value from the teaching lab (marineLab),
// which is a return value from the vendored
// engines/supplychain/marineLogistics.js on the synthetic Ekene cluster. It
// never reads the capstone: panelCapstoneGuard.test.js and marineLab.test.js
// both grep this file. The capstone case files are imported from
// src/content/capstone-cases/marine and offered on the capstone card only.

const APP = 'marine';
const LEARN_TIERS = ['beginner', 'intermediate', 'advanced'];
const CERT_LABELS = { associate: 'Associate', professional: 'Professional', expert: 'Expert' };

const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

const LESSONS = [
  { tier: 'Associate', title: 'Offshore supply as a system', body: 'Why offshore supply is planned, the sources with their editions, licences and read dates, the Ekene cluster and its supply base, the units, and the calculator panels.' },
  { tier: 'Associate', title: 'Routes and voyage time', body: 'Milk runs and dedicated voyages, legs and sailing hours, port and field time, and the voyage in days.' },
  { tier: 'Associate', title: 'Weather and fuel', body: 'A stated weather factor, the activities it slows, fuel burn by activity, and the fuel bill.' },
  { tier: 'Associate', title: 'Deck and bulk capacity', body: 'Deck area in square metres, the usable fraction, deck load and deadweight, and a tank for each product.' },
  { tier: 'Associate', title: 'The binding constraint', body: 'Utilisation per constraint, the binding constraint and its tie rule, an overloaded voyage, a tank the vessel does not have, and reading a voyage plan.' },
  { tier: 'Associate', title: 'Planning a voyage end to end', body: 'A PSV and an AHTS on one route, calm weather and the rainy season, checking a plan before it sails, and the capstone brief.' },
  { tier: 'Professional', title: 'Demand over a period', body: 'Weekly demand per installation, demand over capacity per constraint, minimum visits, and what drives the voyage count.' },
  { tier: 'Professional', title: 'Voyages and vessel-days', body: 'Rounding voyages up or keeping the average, voyage days and vessel-days, dedicated voyages sized one by one, and a voyage longer than the days available.' },
  { tier: 'Professional', title: 'Vessels required', body: 'Available days and the period, the three rounding rules, spare and short vessel-days, fleet utilisation and fuel, and a PSV or an AHTS for the same demand.' },
  { tier: 'Professional', title: 'Deck cargo and footprints', body: 'Items, footprints and units, the area bound with no stacking, the lower bound on voyages, and what the area bound leaves out.' },
  { tier: 'Professional', title: 'First-fit decreasing', body: 'Sorting by area, the first voyage that holds a unit, ties to the heavier unit, first fit in the booked order, and overflow with its reasons.' },
  { tier: 'Professional', title: 'Published packing examples', body: 'Two capacities and one list, a larger deck that needs more voyages, a tight worst case, and the capstone brief.' },
  { tier: 'Expert', title: 'The shore base as a queue', body: 'Berths, arrivals and service, the working-hour clock, fixed hours, lifts and bulk, and the offered load and berth utilisation.' },
  { tier: 'Expert', title: 'Erlang C and M/M/c', body: "The probability of waiting, the mean wait and mean queue, Little's law at the base, the published tables, and a printed figure that misses its rounding." },
  { tier: 'Expert', title: 'Constant service and M/D/c', body: 'A constant service time, an approximation for several berths, one berth and the exact formula, and how many berths meet a target.' },
  { tier: 'Expert', title: 'Weather and demand variability', body: 'The Monte Carlo underneath, two factors drawn in order, vessels required as a distribution, the chance of being short, and the seed and draws.' },
  { tier: 'Expert', title: 'Readings and boundaries', body: 'The twelve-digit tie rule, the boundaries rule by rule, a printed bound on the accepted side, and published figures that do not reproduce.' },
  { tier: 'Expert', title: 'What the engine does not compute', body: 'What the engine leaves out, the size caps, writing the logistics plan, and the capstone brief.' },
];

function ScopeGate() {
  return (
    <LearningModeGate app={APP} title="Offshore & Marine Logistics: Learning Mode locked">
      <p>
        Enrol in the Offshore &amp; Marine Logistics course of the Supply Chain &amp; Logistics module, and activate your
        account to open it in Learning Mode. Offshore supply is a set of stated routes, vessels, cargoes, rates and rules
        that can be written down and computed, so the course teaches voyage time, weather, fuel and the binding capacity
        constraint, then fleet sizing and deck planning, then the shore base queue and the fleet under variability, and
        grades each tier with numbers the engine returns. The Suite&apos;s Marine Logistics Planner runs the same engine,
        and every practical also runs in the course&apos;s own calculator panels.
      </p>
    </LearningModeGate>
  );
}

const MarineLearningPage = () => {
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

  // Engine calls through the teaching lab, on the Ekene teaching cases only.
  const lab = useMemo(() => {
    try {
      return { v: voyageReader(), f: fleetReader(), d: deckReader(), m: variabilityReader() };
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
      <Helmet><title>Offshore &amp; Marine Logistics (Learning Mode) - Petrolord NextGen Academy</title></Helmet>
      <div className="relative max-w-6xl mx-auto p-6 space-y-6">
        {watermark && (
          <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
            <span className="text-pl-text/5 text-[8rem] font-black -rotate-45 select-none">TRAINING</span>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-pl-text flex flex-wrap items-center gap-2">
              <Ship className="h-7 w-7 text-pl-accent-text" /> Offshore &amp; Marine Logistics
              <span className="text-xs px-2 py-0.5 rounded-full bg-pl-accent/15 text-pl-accent-text border border-pl-accent/40">Learning Mode</span>
            </h1>
            <p className="mt-1 text-xs uppercase tracking-wide text-pl-muted">Supply Chain &amp; Logistics, course four</p>
            <p className="mt-2 text-sm text-pl-text">
              The Suite app for this course is the Marine Logistics Planner, in the Suite&apos;s Midstream &amp; Downstream
              module: it plans voyages, sizes the fleet, packs the deck and queues the shore base on the same engine the
              lessons quote. Every practical also runs in the course&apos;s own calculator panels below, which call that same
              vendored engine, so the course is complete without a Suite seat.
            </p>
            {lab && (
              <p className="mt-1 text-pl-muted">
                The synthetic Ekene PSV sails its milk run in {six(lab.v.hours)} hours in the rainy season, burning fuel that
                costs {six(lab.v.fuelCost)}, with deck area binding at a utilisation of {six(lab.v.binding)}. A week of the
                cluster&apos;s demand needs {six(lab.f.vesselDays)} vessel-days, so {lab.f.vessels} vessels when vessels are
                rounded up. First-fit decreasing puts {six(lab.d.ffdArea)} m2 of one voyage&apos;s deck cargo on the deck and
                leaves {lab.d.ffdOverflow} small units behind. Under weather and demand variability the seeded Monte Carlo
                (seed {lab.m.seed}, {lab.m.iterations} draws) puts the P90 of the week&apos;s vessel-days at {six(lab.m.p90)}: a
                figure the course teaches with its seed and does not grade. This course is where each of those numbers comes
                from, and every source behind them is named with its edition, its licence and the date it was read.
                {gate.quota?.own_data_upload === false && ' Your own data upload unlocks at the Associate tier.'}
              </p>
            )}
          </div>

          <DeepCourseBanner app={APP} tier={tier} />

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text flex items-center gap-2"><BookOpen className="h-5 w-5 text-pl-accent-text" /> Lessons</CardTitle>
              <CardDescription>
                The synthetic Ekene cluster, on the vendored marine logistics engine. Every number on this page and inside
                every calculator panel is a return value from that engine, pinned by a test file against the figures the
                lessons quote. Every source is named with its edition, its licence and the date it was read: Adan and
                Resing&apos;s queueing notes and Iversen&apos;s teletraffic handbook, cited for their figures and formulas,
                Skoko et al. on offshore fleet structure, Aas, Halskau and Wallace on supply vessels, taught by concept, and
                the Wikipedia article on first-fit decreasing, cited by example.
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

          {tier === 'beginner' && <VoyageCalculator />}
          {tier === 'intermediate' && <VoyageCalculator initialMode="fleetSize" />}
          {tier === 'intermediate' && <DeckCalculator />}
          {tier === 'advanced' && <BaseCalculator />}
          {tier === 'advanced' && <VariabilityCalculator />}

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">What this engine declares, and what it leaves to you</CardTitle>
              <CardDescription>
                The engine takes every figure as a stated input: the vessel&apos;s speed, deck area and its usable fraction,
                deck load, deadweight, a tank for every product and a fuel burn for each activity; each product&apos;s
                density; the route and its legs or distances; the port and field hours; the weather factor and the
                activities it slows; the fuel price; each installation&apos;s cargo or demand and its minimum visits; the
                period, the days a vessel is available and both rounding rules; the deck, the items and the packing rule;
                the berths, the arrivals, the working day, the service terms and the queue model; the demand factor, the
                planned fleet, the draws and the seed. The calculators show a control for each of those inputs and write
                your choice into the box; an input left out is refused by name. The engine holds no domain figure of its
                own, only its caps and its twelve-digit tie rule. Where no source fixes a convention the engine states
                its reading, and the course shows each reading where it acts and grades none of them.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-pl-text">{capstone?.title || 'Capstone'}</CardTitle>
              <CardDescription>{capstone?.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {capstone && MARINE_CASE_FILES[tier] && (
                <CapstoneCaseFiles files={MARINE_CASE_FILES[tier]}
                  note="Download the case file the brief names. It holds the vessels, installations, routes, cargo, deck items and base terms the six values are computed from; paste the whole case into the view of the tier's calculator and choose the block each value needs. No panel loads a case for you." />
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

export default MarineLearningPage;
