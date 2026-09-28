import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { Loader2, KeyRound, Microscope, Plus, Check, X, Shield, Eye, Building2 } from 'lucide-react';
import AdminSponsorPools from '@/components/academy/AdminSponsorPools';
import {
  adminListCodes, adminIssueCode, adminListResidencyApplications,
  adminDecideResidency, adminListSessions, grantReviewAccess, revokeReviewAccess,
} from '@/services/academyService';
import { courseName } from '@/lib/appNames';

const SESSION_EVENT = {
  register: { label: 'Device registered', cls: 'text-pl-success-text' },
  resume: { label: 'Signed in', cls: 'text-pl-text' },
  revoke: { label: 'Device signed out', cls: 'text-pl-warning-text' },
  denied: { label: 'Blocked (limit)', cls: 'text-pl-danger-text' },
};

// Admin surface for N3.2's doors: issue Campus cohort / employer
// sponsorship codes, and decide residency applications. All mutations
// go through admin-gated SECURITY DEFINER functions; this page is a
// convenience shell, not the enforcement layer.
const AdminAcademyDoorsPage = () => {
  const { toast } = useToast();
  const { isViewAsSuperAdmin, isViewAsAdmin } = useRole();
  const [codes, setCodes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [kind, setKind] = useState('cohort');
  const [organization, setOrganization] = useState('');
  const [issuer, setIssuer] = useState('');
  const [maxRedemptions, setMaxRedemptions] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [reviewResult, setReviewResult] = useState(null);
  const [reviewBusy, setReviewBusy] = useState(false);

  const isAdminView = isViewAsSuperAdmin || isViewAsAdmin;

  const onGrantReview = async () => {
    setReviewBusy(true);
    try {
      const res = await grantReviewAccess(90);
      setReviewResult(res);
      toast({
        title: 'Review access refreshed',
        description: `${res.apps_covered} courses covered, ${res.enrollments_created} new reviewer enrollments.`,
      });
    } catch (err) {
      toast({ title: 'Grant failed', description: err.message, variant: 'destructive' });
    } finally {
      setReviewBusy(false);
    }
  };

  const onRevokeReview = async () => {
    setReviewBusy(true);
    try {
      const res = await revokeReviewAccess();
      setReviewResult(null);
      toast({
        title: 'Review access revoked',
        description: `${res.entitlements_expired} entitlements expired, ${res.enrollments_cancelled} reviewer enrollments cancelled.`,
      });
    } catch (err) {
      toast({ title: 'Revoke failed', description: err.message, variant: 'destructive' });
    } finally {
      setReviewBusy(false);
    }
  };

  const refresh = async () => {
    try {
      const [c, a, s] = await Promise.all([
        adminListCodes(), adminListResidencyApplications(), adminListSessions(),
      ]);
      setCodes(c);
      setApplications(a);
      setSessions(s);
    } catch (err) {
      toast({ title: 'Failed to load', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIssue = async () => {
    setBusy(true);
    try {
      const res = await adminIssueCode({
        kind,
        organization,
        issuer: issuer || null,
        maxRedemptions: maxRedemptions ? parseInt(maxRedemptions, 10) : null,
        validUntil: validUntil ? new Date(validUntil).toISOString() : null,
      });
      toast({
        title: `Code issued: ${res.code}`,
        description: `${kind === 'cohort' ? 'Cohort' : 'Sponsorship'} code for ${organization}.`,
      });
      setOrganization('');
      setIssuer('');
      setMaxRedemptions('');
      setValidUntil('');
      await refresh();
    } catch (err) {
      toast({ title: 'Issue failed', description: err.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const handleDecide = async (id, decision) => {
    setBusy(true);
    try {
      await adminDecideResidency(id, decision);
      toast({
        title: `Application ${decision}`,
      });
      await refresh();
    } catch (err) {
      toast({ title: 'Decision failed', description: err.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  if (!isAdminView) {
    return (
      <div className="p-8 text-pl-muted">
        This page is restricted to Petrolord admins.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-pl-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Academy Doors - Admin</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto p-6 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-pl-text">Academy doors</h1>
          <p className="mt-1 text-pl-muted">
            Issue cohort and sponsorship codes, set up employer enrolment pools, review residency applications.
          </p>
        </div>

        <Tabs defaultValue="codes" className="w-full">
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger value="codes"><KeyRound className="h-4 w-4 mr-2" />Entry codes</TabsTrigger>
            <TabsTrigger value="sponsors"><Building2 className="h-4 w-4 mr-2" />Sponsor pools</TabsTrigger>
            <TabsTrigger value="residency"><Microscope className="h-4 w-4 mr-2" />Residency queue</TabsTrigger>
            <TabsTrigger value="sessions"><Shield className="h-4 w-4 mr-2" />Session monitoring</TabsTrigger>
            {isViewAsSuperAdmin && (
              <TabsTrigger value="review"><Eye className="h-4 w-4 mr-2" />Review access</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="sponsors">
            <AdminSponsorPools />
          </TabsContent>

          {isViewAsSuperAdmin && (
            <TabsContent value="review">
              <Card className="bg-pl-surface border-pl-border">
                <CardHeader>
                  <CardTitle className="text-pl-text">Reviewer door</CardTitle>
                  <CardDescription>
                    Grant yourself time-boxed (90 day) full-scope review access to every
                    available course, plus reviewer enrollments so capstone grading can be
                    exercised. The prerequisite and tier-progression rules stay in force:
                    tiers you have not earned are skipped and listed below. Re-run after
                    new courses ship, or after passing a capstone unlocks the next tier.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={onGrantReview} disabled={reviewBusy}
                      className="font-semibold">
                      {reviewBusy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
                      Grant / refresh my review access
                    </Button>
                    <Button variant="outline" onClick={onRevokeReview} disabled={reviewBusy}>
                      Revoke my review access
                    </Button>
                  </div>
                  {reviewResult && (
                    <div className="text-sm text-pl-text space-y-2">
                      <p>
                        {reviewResult.apps_covered} courses covered at full scope for {reviewResult.valid_days} days;{' '}
                        {reviewResult.enrollments_created} new reviewer enrollment{reviewResult.enrollments_created === 1 ? '' : 's'}.
                      </p>
                      {(reviewResult.skipped || []).length > 0 && (
                        <div>
                          <p className="text-pl-muted">Tiers awaiting ladder progression:</p>
                          <ul className="mt-1 space-y-0.5 text-xs text-pl-muted font-mono">
                            {reviewResult.skipped.map((s, i) => (
                              <li key={i}>{s.app} / {s.tier}: {s.reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="codes" className="space-y-6">
            <Card className="bg-pl-surface border-pl-border">
              <CardHeader>
                <CardTitle className="text-pl-text">Issue a code</CardTitle>
                <CardDescription>
                  Cohort codes admit Campus scholars (scholarship at published fee + personal
                  registration fee); sponsorship codes activate immediately and bill the sponsor.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <Label className="text-pl-text mb-1 block">Kind</Label>
                  <select
                    value={kind} onChange={(e) => setKind(e.target.value)}
                    className="w-full h-10 px-3 py-2 rounded-md border border-pl-border-strong bg-pl-surface text-pl-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus"
                  >
                    <option value="cohort">Cohort (Campus)</option>
                    <option value="sponsorship">Sponsorship (Employer)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-pl-text mb-1 block">Organization</Label>
                  <Input value={organization} onChange={(e) => setOrganization(e.target.value)}
                    placeholder="University / Company" />
                </div>
                <div>
                  <Label className="text-pl-text mb-1 block">Issuer (liaison)</Label>
                  <Input value={issuer} onChange={(e) => setIssuer(e.target.value)}
                    placeholder="Contact name" />
                </div>
                <div>
                  <Label className="text-pl-text mb-1 block">Max redemptions</Label>
                  <Input type="number" min="1" value={maxRedemptions}
                    onChange={(e) => setMaxRedemptions(e.target.value)}
                    placeholder="∞" />
                </div>
                <div>
                  <Label className="text-pl-text mb-1 block">Valid until</Label>
                  <Input type="date" value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    />
                </div>
                <div className="sm:col-span-2 lg:col-span-5">
                  <Button
                    onClick={handleIssue} disabled={busy || !organization}
                    className="font-semibold"
                  >
                    {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Issue code
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-pl-surface border-pl-border">
              <CardHeader>
                <CardTitle className="text-pl-text">Issued codes</CardTitle>
              </CardHeader>
              <CardContent>
                {codes.length === 0 ? (
                  <p className="text-pl-muted text-sm">No codes issued yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-pl-muted border-b border-pl-border">
                          <th className="py-2 pr-4">Code</th>
                          <th className="py-2 pr-4">Kind</th>
                          <th className="py-2 pr-4">Organization</th>
                          <th className="py-2 pr-4">Redeemed</th>
                          <th className="py-2 pr-4">Valid until</th>
                        </tr>
                      </thead>
                      <tbody>
                        {codes.map((c) => (
                          <tr key={c.id} className="border-b border-pl-border text-pl-text">
                            <td className="py-2 pr-4 font-mono text-pl-primary-text">{c.code}</td>
                            <td className="py-2 pr-4">{c.kind}</td>
                            <td className="py-2 pr-4">{c.organization || 'n/a'}</td>
                            <td className="py-2 pr-4">
                              {c.redeemed_count}{c.max_redemptions ? ` / ${c.max_redemptions}` : ''}
                            </td>
                            <td className="py-2 pr-4">
                              {c.valid_until ? new Date(c.valid_until).toLocaleDateString() : 'open'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="residency">
            <Card className="bg-pl-surface border-pl-border">
              <CardHeader>
                <CardTitle className="text-pl-text">Residency applications</CardTitle>
                <CardDescription>Selection creates the enrollment (Beginner tier, residency door).</CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-pl-muted text-sm">No applications yet.</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((a) => (
                      <div key={a.id} className="rounded-md border border-pl-border bg-pl-sunken p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-pl-text font-medium">
                              {a.applicant?.display_name || 'Learner'}
                              <span className="text-pl-muted font-normal"> · {a.applicant?.email}</span>
                            </p>
                            <p className="text-xs text-pl-muted">
                              {courseName(a.app_slug, a.course_name)} · {new Date(a.created_at).toLocaleString()} ·{' '}
                              <span className={
                                a.status === 'accepted' ? 'text-pl-success-text'
                                : a.status === 'rejected' ? 'text-pl-danger-text' : 'text-pl-warning-text'
                              }>{a.status}</span>
                            </p>
                          </div>
                          {a.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" disabled={busy}
                                onClick={() => handleDecide(a.id, 'accepted')}>
                                <Check className="h-4 w-4 mr-1" />Accept
                              </Button>
                              <Button size="sm" variant="outline" disabled={busy}
                                onClick={() => handleDecide(a.id, 'rejected')}
                                className="border-pl-danger/40 text-pl-danger-text hover:bg-pl-danger-bg hover:text-pl-danger-text">
                                <X className="h-4 w-4 mr-1" />Reject
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-pl-muted whitespace-pre-wrap">{a.motivation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card className="bg-pl-surface border-pl-border">
              <CardHeader>
                <CardTitle className="text-pl-text">Session monitoring</CardTitle>
                <CardDescription>Recent device/login events across all learners (two-device limit + integrity feed).</CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <p className="text-pl-muted text-sm">No session activity yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-pl-muted border-b border-pl-border">
                          <th className="py-2 pr-4">When</th>
                          <th className="py-2 pr-4">Learner</th>
                          <th className="py-2 pr-4">Event</th>
                          <th className="py-2 pr-4">Device</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((s) => (
                          <tr key={s.id} className="border-b border-pl-border text-pl-text">
                            <td className="py-2 pr-4 whitespace-nowrap">{new Date(s.created_at).toLocaleString()}</td>
                            <td className="py-2 pr-4">{s.actor?.display_name || s.actor?.email || 'n/a'}</td>
                            <td className={`py-2 pr-4 ${SESSION_EVENT[s.event]?.cls || 'text-pl-text'}`}>
                              {SESSION_EVENT[s.event]?.label || s.event}
                            </td>
                            <td className="py-2 pr-4 font-mono text-xs text-pl-muted">{(s.device_id || '').slice(0, 8) || 'n/a'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
};

export default AdminAcademyDoorsPage;
