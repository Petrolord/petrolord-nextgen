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
import { Loader2, KeyRound, Microscope, Plus, Check, X, Shield } from 'lucide-react';
import {
  adminListCodes, adminIssueCode, adminListResidencyApplications,
  adminDecideResidency, adminListSessions,
} from '@/services/academyService';

const SESSION_EVENT = {
  register: { label: 'Device registered', cls: 'text-emerald-400' },
  resume: { label: 'Signed in', cls: 'text-gray-300' },
  revoke: { label: 'Device signed out', cls: 'text-yellow-400' },
  denied: { label: 'Blocked (limit)', cls: 'text-red-400' },
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

  const isAdminView = isViewAsSuperAdmin || isViewAsAdmin;

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
        className: 'bg-[#BFFF00] text-slate-900',
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
        className: decision === 'accepted' ? 'bg-[#BFFF00] text-slate-900' : undefined,
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
      <div className="p-8 text-gray-400">
        This page is restricted to Petrolord admins.
      </div>
    );
  }

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
        <title>Academy Doors - Admin</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto p-6 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Academy doors</h1>
          <p className="mt-1 text-gray-400">
            Issue cohort and sponsorship codes; review residency applications.
          </p>
        </div>

        <Tabs defaultValue="codes" className="w-full">
          <TabsList className="bg-[#1E293B]">
            <TabsTrigger value="codes"><KeyRound className="h-4 w-4 mr-2" />Entry codes</TabsTrigger>
            <TabsTrigger value="residency"><Microscope className="h-4 w-4 mr-2" />Residency queue</TabsTrigger>
            <TabsTrigger value="sessions"><Shield className="h-4 w-4 mr-2" />Session monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="codes" className="space-y-6">
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Issue a code</CardTitle>
                <CardDescription>
                  Cohort codes admit Campus scholars (scholarship at published fee + personal
                  registration fee); sponsorship codes activate immediately and bill the sponsor.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <Label className="text-gray-300 mb-1 block">Kind</Label>
                  <select
                    value={kind} onChange={(e) => setKind(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 text-sm"
                  >
                    <option value="cohort">Cohort (Campus)</option>
                    <option value="sponsorship">Sponsorship (Employer)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300 mb-1 block">Organization</Label>
                  <Input value={organization} onChange={(e) => setOrganization(e.target.value)}
                    placeholder="University / Company" className="bg-gray-700 text-white border-gray-600" />
                </div>
                <div>
                  <Label className="text-gray-300 mb-1 block">Issuer (liaison)</Label>
                  <Input value={issuer} onChange={(e) => setIssuer(e.target.value)}
                    placeholder="Contact name" className="bg-gray-700 text-white border-gray-600" />
                </div>
                <div>
                  <Label className="text-gray-300 mb-1 block">Max redemptions</Label>
                  <Input type="number" min="1" value={maxRedemptions}
                    onChange={(e) => setMaxRedemptions(e.target.value)}
                    placeholder="∞" className="bg-gray-700 text-white border-gray-600" />
                </div>
                <div>
                  <Label className="text-gray-300 mb-1 block">Valid until</Label>
                  <Input type="date" value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600" />
                </div>
                <div className="sm:col-span-2 lg:col-span-5">
                  <Button
                    onClick={handleIssue} disabled={busy || !organization}
                    className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold"
                  >
                    {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Issue code
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Issued codes</CardTitle>
              </CardHeader>
              <CardContent>
                {codes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No codes issued yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                          <th className="py-2 pr-4">Code</th>
                          <th className="py-2 pr-4">Kind</th>
                          <th className="py-2 pr-4">Organization</th>
                          <th className="py-2 pr-4">Redeemed</th>
                          <th className="py-2 pr-4">Valid until</th>
                        </tr>
                      </thead>
                      <tbody>
                        {codes.map((c) => (
                          <tr key={c.id} className="border-b border-gray-800 text-gray-300">
                            <td className="py-2 pr-4 font-mono text-[#BFFF00]">{c.code}</td>
                            <td className="py-2 pr-4">{c.kind}</td>
                            <td className="py-2 pr-4">{c.organization || '—'}</td>
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
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Residency applications</CardTitle>
                <CardDescription>Selection creates the enrollment (Beginner tier, residency door).</CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No applications yet.</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((a) => (
                      <div key={a.id} className="rounded-md border border-gray-700 bg-[#0F172A] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-white font-medium">
                              {a.applicant?.display_name || 'Learner'}
                              <span className="text-gray-500 font-normal"> · {a.applicant?.email}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {a.app_slug} · {new Date(a.created_at).toLocaleString()} ·{' '}
                              <span className={
                                a.status === 'accepted' ? 'text-emerald-400'
                                : a.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                              }>{a.status}</span>
                            </p>
                          </div>
                          {a.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" disabled={busy}
                                onClick={() => handleDecide(a.id, 'accepted')}
                                className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600]">
                                <Check className="h-4 w-4 mr-1" />Accept
                              </Button>
                              <Button size="sm" variant="outline" disabled={busy}
                                onClick={() => handleDecide(a.id, 'rejected')}
                                className="border-red-700 text-red-400 hover:bg-red-900/30">
                                <X className="h-4 w-4 mr-1" />Reject
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-gray-400 whitespace-pre-wrap">{a.motivation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions">
            <Card className="bg-[#1E293B] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Session monitoring</CardTitle>
                <CardDescription>Recent device/login events across all learners (two-device limit + integrity feed).</CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <p className="text-gray-500 text-sm">No session activity yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                          <th className="py-2 pr-4">When</th>
                          <th className="py-2 pr-4">Learner</th>
                          <th className="py-2 pr-4">Event</th>
                          <th className="py-2 pr-4">Device</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((s) => (
                          <tr key={s.id} className="border-b border-gray-800 text-gray-300">
                            <td className="py-2 pr-4 whitespace-nowrap">{new Date(s.created_at).toLocaleString()}</td>
                            <td className="py-2 pr-4">{s.actor?.display_name || s.actor?.email || '—'}</td>
                            <td className={`py-2 pr-4 ${SESSION_EVENT[s.event]?.cls || 'text-gray-300'}`}>
                              {SESSION_EVENT[s.event]?.label || s.event}
                            </td>
                            <td className="py-2 pr-4 font-mono text-xs text-gray-500">{(s.device_id || '').slice(0, 8) || '—'}</td>
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
