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
  revokeCertification, certificateStatus, verificationUrl, listAcademyApps,
} from '@/services/academyService';
import {
  APP_NAMES, CERT_TIER_LABELS, courseName, courseNameFrom, formalDate, titleCaseSlug,
} from '@/lib/appNames';

// Every catalog course; replaced by the live academy_apps list (path order)
// once it loads.
const STATIC_APPS = Object.entries(APP_NAMES).map(([slug, name]) => ({ slug, name }));
const TIERS = ['associate', 'professional', 'expert'];
const STATUS_CLS = { valid: 'text-pl-success-text', expired: 'text-pl-warning-text', revoked: 'text-pl-danger-text' };

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
  const [apps, setApps] = useState(STATIC_APPS);

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
    listAcademyApps()
      .then((rows) => { if (rows?.length) setApps(rows.map((a) => ({ slug: a.slug, name: courseName(a.slug, a.name) }))); })
      .catch(() => {});
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
        description: `${courseNameFrom(apps, appSlug)} · ${CERT_TIER_LABELS[tier] || titleCaseSlug(tier)} for ${target.display_name || target.email}`,
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
    return <div className="p-8 text-pl-muted">This page is restricted to instructors and admins.</div>;
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
          <h1 className="text-3xl font-bold text-pl-text flex items-center gap-2">
            <Award className="h-7 w-7 text-pl-accent-text" aria-hidden="true" /> Certifications
          </h1>
          <p className="mt-1 text-pl-muted">
            Issue and revoke certifications. Re-issuing the same course + tier supersedes the prior certificate.
          </p>
        </div>

        <Card className="bg-pl-surface border-pl-border">
          <CardHeader>
            <CardTitle className="text-pl-text">Issue a certification</CardTitle>
            <CardDescription>Find a learner by email, pick the course and tier.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={email} onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && lookup()}
                placeholder="learner@example.com"
              />
              <Button onClick={lookup} disabled={busy || !email.trim()}
                variant="outline" className="shrink-0" aria-label="Find learner">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserSearch className="h-4 w-4" />}
              </Button>
            </div>

            {target && (
              <div className="rounded-md border border-pl-border bg-pl-sunken p-3 text-sm">
                <p className="text-pl-text">{target.display_name || 'n/a'}</p>
                <p className="text-pl-muted">{target.email} · {target.role}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-pl-text mb-1 block">Course</Label>
                <select value={appSlug} onChange={(e) => setAppSlug(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border border-pl-border-strong bg-pl-surface text-pl-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus">
                  {apps.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-pl-text mb-1 block">Tier</Label>
                <select value={tier} onChange={(e) => setTier(e.target.value)}
                  className="w-full h-10 px-3 py-2 rounded-md border border-pl-border-strong bg-pl-surface text-pl-text text-sm capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus">
                  {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <Button onClick={issue} disabled={busy || !target}
              className="font-semibold">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BadgeCheck className="mr-2 h-4 w-4" />}
              Issue certification
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-pl-surface border-pl-border">
          <CardHeader><CardTitle className="text-pl-text">Issued certificates</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-pl-primary" /></div>
            ) : certs.length === 0 ? (
              <p className="text-pl-muted text-sm">None issued yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-pl-muted border-b border-pl-border">
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
                        <tr key={c.id} className="border-b border-pl-border text-pl-text">
                          <td className="py-2 pr-4 font-mono text-xs whitespace-nowrap">
                            <a href={verificationUrl(c.verify_code)} target="_blank" rel="noreferrer"
                              className="text-pl-primary-text hover:text-pl-primary-text-hover hover:underline">{c.certificate_number}</a>
                          </td>
                          <td className="py-2 pr-4">{c.holder?.display_name || c.holder?.email || 'n/a'}</td>
                          <td className="py-2 pr-4">{courseName(c.app_slug, c.course_name)} · {CERT_TIER_LABELS[c.tier] || titleCaseSlug(c.tier)}</td>
                          <td className="py-2 pr-4 whitespace-nowrap">{formalDate(c.valid_until)}</td>
                          <td className={`py-2 pr-4 capitalize ${STATUS_CLS[status]}`}>{status}</td>
                          <td className="py-2 pr-4">
                            {status !== 'revoked' && (
                              <Button size="sm" variant="outline" disabled={busy}
                                className="border-pl-danger/40 text-pl-danger-text hover:bg-pl-danger-bg hover:text-pl-danger-text"
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
