import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { Award, Loader2, Search as UserSearch, BadgeCheck, Ban } from 'lucide-react';
import {
  findProfileByEmail, issueCertification, adminListCertifications,
  revokeCertification, certificateStatus, verificationUrl,
} from '@/services/academyService';

const APPS = [
  { slug: 'welldata', name: 'Well Data Manager' },
  { slug: 'petrophysics', name: 'Petrophysics' },
  { slug: 'wellcorrelation', name: 'Well Correlation' },
  { slug: 'seismolord', name: 'Seismolord' },
  { slug: 'mapping', name: 'Mapping' },
  { slug: 'reservoircalc', name: 'ReservoirCalc Pro' },
];
const TIERS = ['associate', 'professional', 'expert'];
const STATUS_CLS = { valid: 'text-emerald-400', expired: 'text-yellow-400', revoked: 'text-red-400' };

// Instructor/admin certificate issuance console. Actual issuance is
// gated server-side by academy_issue_certification (lecturer/admin/
// super_admin or the trusted server); this page is a convenience shell.
// N4 will auto-issue on capstone pass — this is the manual/override path.
const AdminCertificationsPage = () => {
  const { toast } = useToast();
  const { isViewAsSuperAdmin, isViewAsAdmin, isViewAsLecturer } = useRole();
  const allowed = isViewAsSuperAdmin || isViewAsAdmin || isViewAsLecturer;

  const [email, setEmail] = useState('');
  const [target, setTarget] = useState(null);
  const [appSlug, setAppSlug] = useState('petrophysics');
  const [tier, setTier] = useState('associate');
  const [busy, setBusy] = useState(false);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setCerts(await adminListCertifications());
    } catch (e) {
      toast({ title: 'Failed to load certificates', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lookup = async () => {
    setBusy(true);
    setTarget(null);
    try {
      const p = await findProfileByEmail(email);
      if (!p) toast({ title: 'No learner with that email', variant: 'destructive' });
      else setTarget(p);
    } catch (e) {
      toast({ title: 'Lookup failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const issue = async () => {
    if (!target) return;
    setBusy(true);
    try {
      const res = await issueCertification({ userId: target.id, appSlug, tier });
      toast({
        title: `Issued ${res.certificate_number}`,
        description: `${tier} · ${appSlug} for ${target.display_name || target.email}`,
        className: 'bg-[#BFFF00] text-slate-900',
      });
      await refresh();
    } catch (e) {
      toast({ title: 'Issuance failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (id) => {
    setBusy(true);
    try {
      await revokeCertification(id);
      toast({ title: 'Certificate revoked' });
      await refresh();
    } catch (e) {
      toast({ title: 'Revoke failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  if (!allowed) {
    return <div className="p-8 text-gray-400">This page is restricted to instructors and admins.</div>;
  }

  return (
    <>
      <Helmet><title>Certifications - Admin</title></Helmet>
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto p-6 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Award className="h-7 w-7 text-[#BFFF00]" /> Certifications
          </h1>
          <p className="mt-1 text-gray-400">
            Issue and revoke certifications. Re-issuing the same course + tier supersedes the prior certificate.
          </p>
        </div>

        <Card className="bg-[#1E293B] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Issue a certification</CardTitle>
            <CardDescription>Find a learner by email, pick the course and tier.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && lookup()}
                placeholder="learner@example.com"
                className="bg-gray-700 text-white border-gray-600"
              />
              <Button onClick={lookup} disabled={busy || !email.trim()}
                variant="outline" className="border-gray-600 text-gray-200 shrink-0">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserSearch className="h-4 w-4" />}
              </Button>
            </div>

            {target && (
              <div className="rounded-md border border-gray-700 bg-[#0F172A] p-3 text-sm">
                <p className="text-white">{target.display_name || '—'}</p>
                <p className="text-gray-500">{target.email} · {target.role}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-gray-300 mb-1 block">Course</Label>
                <select value={appSlug} onChange={(e) => setAppSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 text-sm">
                  {APPS.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-gray-300 mb-1 block">Tier</Label>
                <select value={tier} onChange={(e) => setTier(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 text-sm capitalize">
                  {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <Button onClick={issue} disabled={busy || !target}
              className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BadgeCheck className="mr-2 h-4 w-4" />}
              Issue certification
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-gray-700">
          <CardHeader><CardTitle className="text-white">Issued certificates</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-[#BFFF00]" /></div>
            ) : certs.length === 0 ? (
              <p className="text-gray-500 text-sm">None issued yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="py-2 pr-4">Number</th>
                      <th className="py-2 pr-4">Holder</th>
                      <th className="py-2 pr-4">Course / tier</th>
                      <th className="py-2 pr-4">Valid until</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {certs.map((c) => {
                      const status = certificateStatus(c);
                      return (
                        <tr key={c.id} className="border-b border-gray-800 text-gray-300">
                          <td className="py-2 pr-4 font-mono text-xs">
                            <a href={verificationUrl(c.verify_code)} target="_blank" rel="noreferrer"
                              className="text-[#BFFF00] hover:underline">{c.certificate_number}</a>
                          </td>
                          <td className="py-2 pr-4">{c.holder?.display_name || c.holder?.email || '—'}</td>
                          <td className="py-2 pr-4">{c.app_slug} · <span className="capitalize">{c.tier}</span></td>
                          <td className="py-2 pr-4 whitespace-nowrap">{new Date(c.valid_until).toLocaleDateString()}</td>
                          <td className={`py-2 pr-4 capitalize ${STATUS_CLS[status]}`}>{status}</td>
                          <td className="py-2 pr-4">
                            {status !== 'revoked' && (
                              <Button size="sm" variant="outline" disabled={busy}
                                className="border-red-700 text-red-400 hover:bg-red-900/30"
                                onClick={() => revoke(c.id)}>
                                <Ban className="h-3.5 w-3.5 mr-1" /> Revoke
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default AdminCertificationsPage;
