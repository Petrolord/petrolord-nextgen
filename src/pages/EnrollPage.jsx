import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input, THEMED_INPUT } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, CreditCard, GraduationCap, Briefcase, Microscope, BadgeCheck,
  Clock, XCircle, PlayCircle, ArrowRight,
} from 'lucide-react';
import {
  listAcademyApps, listFees, feeFor, formatFee, listMyEnrollments,
  listMyResidencyApplications, startSelfEnrollment, redeemCode,
  applyResidency, startCheckout, verifyPayment, TIERS, getPrereqWaiverStatus, doorsStatus,
} from '@/services/academyService';
import { waiverPresentation, selfEnrolOutcome, isBonusTier } from '@/lib/prereqWaiver';
import { supabase } from '@/lib/customSupabaseClient';
import { useActivation } from '@/hooks/useActivation';
import { useRole } from '@/contexts/RoleContext';
import { enrollmentAction } from '@/lib/learningGate';
import { hasDeepCourse } from '@/lib/courseIndex';
import { courseName } from '@/lib/appNames';

// One identity, four doors (NextGen-Academy-PLAN §1): same account, same
// courses, same certificates — only the payer differs. Learning-Mode
// access is granted server-side (enrollment → entitlement trigger); this
// page only drives the door functions.
//
// Design system (batch 2A): the page renders inside the signed-in scope
// (src/design/rollout/w2a.js), so it uses theme roles directly. Status
// colour comes from the status roles and always sits next to its word.

const TIER_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

const STATUS_PILL = {
  active: 'bg-pl-success-bg text-pl-success-text border-pl-success/30',
  pending: 'bg-pl-warning-bg text-pl-warning-text border-pl-warning/30',
  completed: 'bg-pl-info-bg text-pl-info-text border-pl-info/30',
  cancelled: 'bg-pl-danger-bg text-pl-danger-text border-pl-danger/30',
};

const DOOR_LABELS = {
  self: 'Self-enrolled',
  campus: 'Campus cohort',
  residency: 'Residency',
  sponsored: 'Employer-sponsored',
};

function CourseTierPicker({ apps, tier, setTier, appSlug, setAppSlug, fees, feeKind, prereq }) {
  const available = apps.filter((a) => a.status === 'available');
  const comingSoon = apps.filter((a) => a.status !== 'available');
  const fee = feeKind === 'course'
    ? feeFor(fees, apps, appSlug, tier, 'course')
    : feeFor(fees, apps, appSlug, tier, 'registration');
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-pl-text mb-1 block">Course</Label>
        <select
          value={appSlug}
          onChange={(e) => setAppSlug(e.target.value)}
          className={THEMED_INPUT}
        >
          {available.map((a) => (
            <option key={a.slug} value={a.slug}>{a.name}</option>
          ))}
          {comingSoon.map((a) => (
            <option key={a.slug} value={a.slug} disabled>{a.name} (coming soon)</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-pl-muted">
          One app is one course. The geoscience learning path follows the daily loop, in this order:
          Well Data Management, Petrophysics, Well Correlation, Seismic Interpretation, Subsurface Mapping and Reservoir Volumetrics.
        </p>
        <PrereqNote apps={apps} appSlug={appSlug} status={prereq} />
      </div>
      <div>
        <Label className="text-pl-text mb-1 block">Tier</Label>
        <div className="grid grid-cols-3 gap-2">
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              aria-pressed={tier === t}
              className={`px-3 py-2 rounded-md border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus ${
                tier === t
                  ? 'bg-pl-primary text-pl-primary-fg border-pl-primary font-semibold'
                  : 'bg-pl-surface text-pl-text border-pl-border-strong hover:border-pl-primary'
              }`}
            >
              {TIER_LABELS[t]}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-pl-muted">
          Beginner leads to Associate, Intermediate to Professional and Advanced to Expert certification.
        </p>
      </div>
      {feeKind && (
        <p className="text-sm text-pl-text">
          {feeKind === 'course' ? 'Published fee: ' : 'Personal registration fee, in addition to your university scholarship: '}
          <span className="text-pl-accent-text font-semibold">{formatFee(fee)}</span>
          {feeKind === 'course' && isBonusTier(apps.find((a) => a.slug === appSlug), tier) && (
            <span className="ml-2 text-xs text-pl-muted" data-testid="enroll-bonus-note">Bonus tier: free, and it takes no sponsor seat.</span>
          )}
        </p>
      )}
    </div>
  );
}

// Prerequisite line under the course picker (owner decision 2026-09-08):
// the server says whether it is met and how; when it is not, the free
// waiver exam is one click away instead of a trigger error at enrolment.
function PrereqNote({ apps, appSlug, status }) {
  const sel = apps.find((a) => a.slug === appSlug);
  if (!sel?.prereq_slug) return null;
  const root = apps.find((a) => a.slug === sel.prereq_slug);
  const view = waiverPresentation(status || {
    required: true, prereq_slug: sel.prereq_slug, prereq_name: courseName(sel.prereq_slug, root?.name), satisfied: false, exam_available: true,
  });
  if (view.kind === 'none') return null;
  const cls = view.kind === 'satisfied' ? 'text-pl-success-text' : 'text-pl-warning-text';
  return (
    <p className={`mt-1 text-xs ${cls}`} data-testid="enroll-prereq-note" data-kind={view.kind}>
      {view.text}{' '}
      {view.kind === 'open' && (
        <Link to={`/dashboard/waiver/${sel.prereq_slug}`} className="text-pl-primary-text hover:text-pl-primary-text-hover hover:underline font-semibold" data-testid="enroll-waiver-link">
          Take the free waiver exam
        </Link>
      )}
    </p>
  );
}

const EnrollPage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  // Sponsored learners (2026-09-09): an active row must lead somewhere.
  const { isViewAsStudent } = useRole();
  const { status: activation } = useActivation();
  const [apps, setApps] = useState([]);
  const [fees, setFees] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [residencyApps, setResidencyApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // per-door form state
  const [selfApp, setSelfApp] = useState('petrophysics');
  const [selfTier, setSelfTier] = useState('beginner');
  const [campusApp, setCampusApp] = useState('petrophysics');
  const [campusTier, setCampusTier] = useState('beginner');
  const [campusCode, setCampusCode] = useState('');
  const [campusEmail, setCampusEmail] = useState('');
  const [sponsorApp, setSponsorApp] = useState('petrophysics');
  const [sponsorTier, setSponsorTier] = useState('beginner');
  const [sponsorCode, setSponsorCode] = useState('');
  const [resApp, setResApp] = useState('petrophysics');
  const [resMotivation, setResMotivation] = useState('');
  const [prereqStatus, setPrereqStatus] = useState({});
  const [doors, setDoors] = useState({ residency_open: false, residency_notice: '' });
  const verifiedRef = useRef(false);

  useEffect(() => { doorsStatus().then(setDoors).catch(() => {}); }, []);

  // One status per distinct course the four doors currently point at.
  useEffect(() => {
    if (loading) return;
    const slugs = [...new Set([selfApp, campusApp, sponsorApp, resApp].filter(Boolean))]
      .filter((s) => apps.find((a) => a.slug === s)?.prereq_slug);
    slugs.forEach((slug) => {
      getPrereqWaiverStatus(slug)
        .then((st) => setPrereqStatus((m) => ({ ...m, [slug]: st })))
        .catch(() => {});
    });
  }, [loading, apps, selfApp, campusApp, sponsorApp, resApp, enrollments]);

  const refresh = async () => {
    const [e, r] = await Promise.all([listMyEnrollments(), listMyResidencyApplications()]);
    setEnrollments(e);
    setResidencyApps(r);
  };

  useEffect(() => {
    (async () => {
      try {
        const [a, f] = await Promise.all([listAcademyApps(), listFees()]);
        setApps(a);
        setFees(f);
        await refresh();
      } catch (err) {
        toast({ title: 'Failed to load enrollment data', description: err.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Returning from Paystack hosted checkout: ?reference=ACAD-…
  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (!reference || verifiedRef.current) return;
    verifiedRef.current = true;
    (async () => {
      setVerifying(true);
      try {
        // verification is idempotent server-side; poll briefly while the
        // charge settles
        let result = null;
        for (let i = 0; i < 6; i++) {
          result = await verifyPayment(reference);
          if (result?.status && result.status !== 'pending' && result.status !== 'not_verifiable') break;
          await new Promise((r) => setTimeout(r, 5000));
        }
        if (result?.status === 'success' || result?.status === 'already_processed') {
          toast({
            title: 'Payment confirmed',
            description: 'Your enrollment is active and Learning Mode is unlocked.',
          });
        } else {
          toast({
            title: 'Payment not confirmed',
            description: `Verification returned: ${result?.status || 'unknown'}. If you were charged, retry verification from this page or contact support.`,
            variant: 'destructive',
          });
        }
        await refresh();
      } catch (err) {
        toast({ title: 'Verification error', description: err.message, variant: 'destructive' });
      } finally {
        setVerifying(false);
        setSearchParams({}, { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const goToCheckout = async (reference) => {
    const { authorization_url } = await startCheckout(reference);
    if (!authorization_url) throw new Error('No checkout link returned');
    window.location.assign(authorization_url);
  };

  const handleSelfEnroll = async () => {
    setBusy(true);
    try {
      const res = await startSelfEnrollment(selfApp, selfTier);
      const outcome = selfEnrolOutcome(res);
      if (outcome.next === 'enrolled') {
        toast({ title: 'Enrolled', description: outcome.message });
        await refresh();
        setBusy(false);
        return;
      }
      if (outcome.next !== 'checkout') throw new Error(outcome.message);
      await goToCheckout(outcome.reference);
    } catch (err) {
      toast({ title: 'Enrollment failed', description: err.message, variant: 'destructive' });
      setBusy(false);
    }
  };

  const handleCampusRedeem = async () => {
    setBusy(true);
    try {
      const res = await redeemCode(campusCode, campusApp, campusTier, campusEmail);
      if (res.status === 'active') {
        toast({
          title: 'Cohort code accepted',
          description: 'Your campus enrollment is active.',
        });
        await refresh();
        setBusy(false);
      } else {
        toast({ title: 'Code accepted', description: 'Complete the personal registration fee to activate.' });
        await goToCheckout(res.reference);
      }
    } catch (err) {
      toast({ title: 'Redemption failed', description: err.message, variant: 'destructive' });
      setBusy(false);
    }
  };

  const handleSponsorRedeem = async () => {
    setBusy(true);
    try {
      await redeemCode(sponsorCode, sponsorApp, sponsorTier);
      toast({
        title: 'Sponsorship code accepted',
        description: 'Your sponsored enrollment is active.',
      });
      await refresh();
    } catch (err) {
      toast({ title: 'Redemption failed', description: err.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const handleResidencyApply = async () => {
    setBusy(true);
    try {
      await applyResidency(resApp, resMotivation);
      toast({
        title: 'Application submitted',
        description: 'Your residency application is under review. Selection creates your enrollment.',
      });
      setResMotivation('');
      await refresh();
    } catch (err) {
      toast({ title: 'Application failed', description: err.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const appName = useMemo(
    () => Object.fromEntries(apps.map((a) => [a.slug, a.name])),
    [apps],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-pl-primary-text" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Enroll - Petrolord NextGen Academy</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto px-4 py-6 sm:p-6 space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-pl-text">Enroll in a course</h1>
          <p className="mt-1 text-pl-muted">
            One account, four ways in. The account, courses and certificates are the same
            whichever door you use, and only the payer differs.
          </p>
        </div>

        {verifying && (
          <Card className="border-pl-warning/40 bg-pl-warning-bg" role="status">
            <CardContent className="flex items-center gap-3 py-4 text-pl-warning-text">
              <Loader2 className="h-5 w-5 animate-spin" />
              Confirming your payment with Paystack…
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="self" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="self"><CreditCard className="h-4 w-4 mr-2" />Self-enroll</TabsTrigger>
            <TabsTrigger value="campus"><GraduationCap className="h-4 w-4 mr-2" />Campus</TabsTrigger>
            <TabsTrigger value="sponsored"><Briefcase className="h-4 w-4 mr-2" />Sponsored</TabsTrigger>
            <TabsTrigger value="residency"><Microscope className="h-4 w-4 mr-2" />Residency</TabsTrigger>
          </TabsList>

          <TabsContent value="self">
            <Card>
              <CardHeader>
                <CardTitle className="text-pl-text">Self-enrollment</CardTitle>
                <CardDescription>
                  Pay the published fee at registration and start immediately in Learning Mode. Free tiers activate at once.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CourseTierPicker
                  apps={apps} fees={fees} feeKind="course"
                  appSlug={selfApp} setAppSlug={setSelfApp} prereq={prereqStatus[selfApp]}
                  tier={selfTier} setTier={setSelfTier}
                />
                <Button
                  onClick={handleSelfEnroll} disabled={busy}
                  className="font-semibold"
                >
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                  Enroll & pay with Paystack
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campus">
            <Card>
              <CardHeader>
                <CardTitle className="text-pl-text">Campus cohort</CardTitle>
                <CardDescription>
                  For university cohorts only. Enter the cohort code from your university liaison:
                  your scholarship covers the course fee, and a small personal registration fee
                  (once per account, shown once you enter the code) is all you pay. Your university
                  email is recorded as a verification attribute; your personal email remains your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CourseTierPicker
                  apps={apps} fees={fees} feeKind={campusCode.trim() ? 'registration' : null}
                  appSlug={campusApp} setAppSlug={setCampusApp} prereq={prereqStatus[campusApp]}
                  tier={campusTier} setTier={setCampusTier}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-pl-text mb-1 block">Cohort code</Label>
                    <Input
                      value={campusCode} onChange={(e) => setCampusCode(e.target.value)}
                      placeholder="CMP-XXXXXXXX"
                      className="uppercase"
                    />
                  </div>
                  <div>
                    <Label className="text-pl-text mb-1 block">University email</Label>
                    <Input
                      type="email" value={campusEmail} onChange={(e) => setCampusEmail(e.target.value)}
                      placeholder="you@university.edu.ng"
                                          />
                  </div>
                </div>
                <Button
                  onClick={handleCampusRedeem} disabled={busy || !campusCode || !campusEmail}
                  className="font-semibold"
                >
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GraduationCap className="mr-2 h-4 w-4" />}
                  Redeem cohort code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsored">
            <Card>
              <CardHeader>
                <CardTitle className="text-pl-text">Employer-sponsored</CardTitle>
                <CardDescription>
                  Redeem the sponsorship code from your employer: the sponsor is billed, and your
                  enrollment activates immediately. If your employer runs an enrolment pool, your
                  training lead assigns you directly and the course appears on your dashboard with
                  no code to enter.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CourseTierPicker
                  apps={apps} fees={fees} feeKind={null}
                  appSlug={sponsorApp} setAppSlug={setSponsorApp} prereq={prereqStatus[sponsorApp]}
                  tier={sponsorTier} setTier={setSponsorTier}
                />
                <div>
                  <Label className="text-pl-text mb-1 block">Sponsorship code</Label>
                  <Input
                    value={sponsorCode} onChange={(e) => setSponsorCode(e.target.value)}
                    placeholder="SPN-XXXXXXXX"
                    className="uppercase sm:max-w-xs"
                  />
                </div>
                <Button
                  onClick={handleSponsorRedeem} disabled={busy || !sponsorCode}
                  className="font-semibold"
                >
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Briefcase className="mr-2 h-4 w-4" />}
                  Redeem sponsorship code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="residency">
            <Card>
              <CardHeader>
                <CardTitle className="text-pl-text">Residency</CardTitle>
                <CardDescription>
                  A selective, in-person, time-boxed intake at the Lordsway facility with instructor
                  supervision and a small number of places. It is a separate programme from the
                  online courses and is no cheaper way into them.
                </CardDescription>
              </CardHeader>
              {!doors.residency_open ? (
                <CardContent>
                  <div className="rounded-md border border-pl-border bg-pl-sunken p-4 text-sm text-pl-text flex items-start gap-2" data-testid="residency-closed">
                    <Clock className="h-4 w-4 text-pl-accent-text mt-0.5 shrink-0" />
                    <p className="mb-0">{doors.residency_notice || 'Residency intakes are not open yet. Applications are not being accepted.'}</p>
                  </div>
                </CardContent>
              ) : (
              <CardContent className="space-y-6">
                <CourseTierPicker
                  apps={apps} fees={fees} feeKind={null}
                  appSlug={resApp} setAppSlug={setResApp} prereq={prereqStatus[resApp]}
                  tier="beginner" setTier={() => {}}
                />
                <div>
                  <Label className="text-pl-text mb-1 block">Motivation</Label>
                  <Textarea
                    value={resMotivation} onChange={(e) => setResMotivation(e.target.value)}
                    rows={4} placeholder="Tell us why you're applying (at least 30 characters)…"
                                      />
                </div>
                <Button
                  onClick={handleResidencyApply} disabled={busy || resMotivation.trim().length < 30}
                  className="font-semibold"
                >
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Microscope className="mr-2 h-4 w-4" />}
                  Submit application
                </Button>
                {residencyApps.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-pl-border">
                    <p className="text-sm font-medium text-pl-text">Your applications</p>
                    {residencyApps.map((a) => (
                      <div key={a.id} className="flex items-center justify-between text-sm text-pl-muted">
                        <span>{courseName(a.app_slug, appName[a.app_slug])}</span>
                        <span className={`px-2 py-0.5 rounded-full border text-xs ${
                          a.status === 'accepted' ? STATUS_PILL.active
                          : a.status === 'rejected' ? STATUS_PILL.cancelled
                          : STATUS_PILL.pending}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-pl-text flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-pl-primary-text" />
              My enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <p className="text-pl-muted text-sm">No enrollments yet. Pick a door above.</p>
            ) : (
              <div className="space-y-2">
                {enrollments.map((e) => (
                  <div
                    key={e.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-pl-border bg-pl-raised px-4 py-3"
                  >
                    <div>
                      <p className="text-pl-text font-medium">
                        {courseName(e.app_slug, appName[e.app_slug])}
                        <span className="text-pl-muted font-normal"> · {TIER_LABELS[e.course_tier]}</span>
                      </p>
                      <p className="text-xs text-pl-muted">{DOOR_LABELS[e.door]} · {new Date(e.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full border text-xs ${STATUS_PILL[e.status] || STATUS_PILL.pending}`}>
                        {e.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />pending payment</span>
                        ) : e.status === 'cancelled' ? (
                          <span className="inline-flex items-center gap-1"><XCircle className="h-3 w-3" />cancelled</span>
                        ) : e.status}
                      </span>
                      {(() => {
                        const act = enrollmentAction(e, { isLearner: !!isViewAsStudent, activation, hasCourse: hasDeepCourse });
                        if (!act || act.kind === 'pay') return null;
                        return (
                          <Link to={act.to}>
                            <Button size="sm" className="font-semibold">
                              {act.kind === 'start' ? <PlayCircle className="h-4 w-4 mr-1" /> : <ArrowRight className="h-4 w-4 mr-1" />}
                              {act.label}
                            </Button>
                          </Link>
                        );
                      })()}
                      {e.status === 'pending' && (
                        <Button
                          size="sm" variant="outline"
                          disabled={busy}
                          onClick={async () => {
                            setBusy(true);
                            try {
                              // resume checkout on the pending payment
                              const { data: pays } = await supabase
                                .from('academy_payments')
                                .select('reference,status')
                                .eq('enrollment_id', e.id)
                                .eq('status', 'pending')
                                .order('created_at', { ascending: false })
                                .limit(1);
                              if (pays && pays[0]) await goToCheckout(pays[0].reference);
                              else toast({ title: 'No pending payment found for this enrollment', variant: 'destructive' });
                            } catch (err) {
                              toast({ title: 'Could not resume checkout', description: err.message, variant: 'destructive' });
                            } finally {
                              setBusy(false);
                            }
                          }}
                        >
                          Complete payment
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default EnrollPage;
