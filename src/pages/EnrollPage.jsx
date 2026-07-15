import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  Loader2, CreditCard, GraduationCap, Briefcase, Microscope, BadgeCheck,
  Clock, XCircle,
} from 'lucide-react';
import {
  listAcademyApps, listFees, feeFor, formatFee, listMyEnrollments,
  listMyResidencyApplications, startSelfEnrollment, redeemCode,
  applyResidency, startCheckout, verifyPayment, TIERS,
} from '@/services/academyService';
import { supabase } from '@/lib/customSupabaseClient';

// One identity, four doors (NextGen-Academy-PLAN §1): same account, same
// courses, same certificates — only the payer differs. Learning-Mode
// access is granted server-side (enrollment → entitlement trigger); this
// page only drives the door functions.

const TIER_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

const STATUS_PILL = {
  active: 'bg-emerald-900/40 text-emerald-300 border-emerald-700',
  pending: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  completed: 'bg-sky-900/40 text-sky-300 border-sky-700',
  cancelled: 'bg-red-900/40 text-red-300 border-red-700',
};

const DOOR_LABELS = {
  self: 'Self-enrolled',
  campus: 'Campus cohort',
  residency: 'Residency',
  sponsored: 'Employer-sponsored',
};

function CourseTierPicker({ apps, tier, setTier, appSlug, setAppSlug, fees, feeKind }) {
  const available = apps.filter((a) => a.status === 'available');
  const comingSoon = apps.filter((a) => a.status !== 'available');
  const fee = feeKind === 'course' ? feeFor(fees, appSlug, tier, 'course') : feeFor(fees, appSlug, tier, 'registration');
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-300 mb-1 block">Course</Label>
        <select
          value={appSlug}
          onChange={(e) => setAppSlug(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-[#BFFF00] focus:border-[#BFFF00] text-sm"
        >
          {available.map((a) => (
            <option key={a.slug} value={a.slug}>{a.name}</option>
          ))}
          {comingSoon.map((a) => (
            <option key={a.slug} value={a.slug} disabled>{a.name} (coming soon)</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          One app = one course. The geoscience learning path follows the daily loop:
          Well Data Manager → Petrophysics → Correlation → Seismolord → Mapping → ReservoirCalc.
        </p>
      </div>
      <div>
        <Label className="text-gray-300 mb-1 block">Tier</Label>
        <div className="grid grid-cols-3 gap-2">
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                tier === t
                  ? 'bg-[#BFFF00] text-[#0F172A] border-[#BFFF00] font-semibold'
                  : 'bg-gray-700 text-gray-300 border-gray-600 hover:border-gray-500'
              }`}
            >
              {TIER_LABELS[t]}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Beginner → Associate, Intermediate → Professional, Advanced → Expert certification.
        </p>
      </div>
      {feeKind && (
        <p className="text-sm text-gray-300">
          {feeKind === 'course' ? 'Published fee: ' : 'Personal registration fee: '}
          <span className="text-[#BFFF00] font-semibold">{formatFee(fee)}</span>
        </p>
      )}
    </div>
  );
}

const EnrollPage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
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
  const verifiedRef = useRef(false);

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
            description: 'Your enrollment is active — Learning Mode is unlocked.',
            className: 'bg-[#BFFF00] text-slate-900',
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
      await goToCheckout(res.reference);
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
          className: 'bg-[#BFFF00] text-slate-900',
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
        className: 'bg-[#BFFF00] text-slate-900',
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
        className: 'bg-[#BFFF00] text-slate-900',
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
        <Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" />
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
        className="max-w-5xl mx-auto p-6 space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Enroll in a course</h1>
          <p className="mt-1 text-gray-400">
            One account, four ways in — the account, courses and certificates are the same
            whichever door you use; only the payer differs.
          </p>
        </div>

        {verifying && (
          <Card className="bg-[#1E293B] border-yellow-700">
            <CardContent className="flex items-center gap-3 py-4 text-yellow-300">
              <Loader2 className="h-5 w-5 animate-spin" />
              Confirming your payment with Paystack…
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="self" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#1E293B]">
            <TabsTrigger value="self"><CreditCard className="h-4 w-4 mr-2" />Self-enroll</TabsTrigger>
            <TabsTrigger value="campus"><GraduationCap className="h-4 w-4 mr-2" />Campus</TabsTrigger>
            <TabsTrigger value="sponsored"><Briefcase className="h-4 w-4 mr-2" />Sponsored</TabsTrigger>
            <TabsTrigger value="residency"><Microscope className="h-4 w-4 mr-2" />Residency</TabsTrigger>
          </TabsList>

          <TabsContent value="self">
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Self-enrollment</CardTitle>
                <CardDescription>
                  Pay the published fee at registration and start immediately in Learning Mode.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CourseTierPicker
                  apps={apps} fees={fees} feeKind="course"
                  appSlug={selfApp} setAppSlug={setSelfApp}
                  tier={selfTier} setTier={setSelfTier}
                />
                <Button
                  onClick={handleSelfEnroll} disabled={busy}
                  className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
                >
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                  Enroll & pay with Paystack
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campus">
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Campus cohort</CardTitle>
                <CardDescription>
                  Enter the cohort code from your university liaison. Your scholarship applies at
                  the published fee; you pay only the modest personal registration fee (once per
                  account). Your university email is recorded as a verification attribute — your
                  personal email remains your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CourseTierPicker
                  apps={apps} fees={fees} feeKind="registration"
                  appSlug={campusApp} setAppSlug={setCampusApp}
                  tier={campusTier} setTier={setCampusTier}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300 mb-1 block">Cohort code</Label>
                    <Input
                      value={campusCode} onChange={(e) => setCampusCode(e.target.value)}
                      placeholder="CMP-XXXXXXXX"
                      className="bg-gray-700 text-white border-gray-600 uppercase"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-1 block">University email</Label>
                    <Input
                      type="email" value={campusEmail} onChange={(e) => setCampusEmail(e.target.value)}
                      placeholder="you@university.edu.ng"
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCampusRedeem} disabled={busy || !campusCode || !campusEmail}
                  className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
                >
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GraduationCap className="mr-2 h-4 w-4" />}
                  Redeem cohort code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsored">
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Employer-sponsored</CardTitle>
                <CardDescription>
                  Redeem the sponsorship code from your employer — the sponsor is billed, and your
                  enrollment activates immediately.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CourseTierPicker
                  apps={apps} fees={fees} feeKind={null}
                  appSlug={sponsorApp} setAppSlug={setSponsorApp}
                  tier={sponsorTier} setTier={setSponsorTier}
                />
                <div>
                  <Label className="text-gray-300 mb-1 block">Sponsorship code</Label>
                  <Input
                    value={sponsorCode} onChange={(e) => setSponsorCode(e.target.value)}
                    placeholder="SPN-XXXXXXXX"
                    className="bg-gray-700 text-white border-gray-600 uppercase sm:max-w-xs"
                  />
                </div>
                <Button
                  onClick={handleSponsorRedeem} disabled={busy || !sponsorCode}
                  className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
                >
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Briefcase className="mr-2 h-4 w-4" />}
                  Redeem sponsorship code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="residency">
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Residency</CardTitle>
                <CardDescription>
                  Apply for a residency intake. Selection creates your enrollment — you'll see the
                  decision here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CourseTierPicker
                  apps={apps} fees={fees} feeKind={null}
                  appSlug={resApp} setAppSlug={setResApp}
                  tier="beginner" setTier={() => {}}
                />
                <div>
                  <Label className="text-gray-300 mb-1 block">Motivation</Label>
                  <Textarea
                    value={resMotivation} onChange={(e) => setResMotivation(e.target.value)}
                    rows={4} placeholder="Tell us why you're applying (at least 30 characters)…"
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
                <Button
                  onClick={handleResidencyApply} disabled={busy || resMotivation.trim().length < 30}
                  className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
                >
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Microscope className="mr-2 h-4 w-4" />}
                  Submit application
                </Button>
                {residencyApps.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-700">
                    <p className="text-sm font-medium text-gray-300">Your applications</p>
                    {residencyApps.map((a) => (
                      <div key={a.id} className="flex items-center justify-between text-sm text-gray-400">
                        <span>{appName[a.app_slug] || a.app_slug}</span>
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
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-[#1E293B] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-[#BFFF00]" />
              My enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <p className="text-gray-500 text-sm">No enrollments yet — pick a door above.</p>
            ) : (
              <div className="space-y-2">
                {enrollments.map((e) => (
                  <div
                    key={e.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-gray-700 bg-[#0F172A] px-4 py-3"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {appName[e.app_slug] || e.app_slug}
                        <span className="text-gray-400 font-normal"> · {TIER_LABELS[e.course_tier]}</span>
                      </p>
                      <p className="text-xs text-gray-500">{DOOR_LABELS[e.door]} · {new Date(e.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full border text-xs ${STATUS_PILL[e.status] || STATUS_PILL.pending}`}>
                        {e.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />pending payment</span>
                        ) : e.status === 'cancelled' ? (
                          <span className="inline-flex items-center gap-1"><XCircle className="h-3 w-3" />cancelled</span>
                        ) : e.status}
                      </span>
                      {e.status === 'pending' && (
                        <Button
                          size="sm" variant="outline"
                          className="border-[#BFFF00] text-[#BFFF00] hover:bg-[#BFFF00] hover:text-[#0F172A]"
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
