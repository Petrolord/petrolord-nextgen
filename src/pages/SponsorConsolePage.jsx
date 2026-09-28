import { useSearchParams } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input, THEMED_INPUT } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Briefcase, UserPlus, XCircle, Download, RefreshCw } from 'lucide-react';
import { listAcademyApps, mySponsorPools, sponsorPoolReport, sponsorAssign, sponsorCancel } from '@/services/academyService';
import {
  TIER_LABELS, TIERS, seatsRemaining, poolState, canAssign, daysLeft, formatPrice, poolCovers, summarizeAssignments, seatScopeLabel,
} from '@/lib/sponsorPools';
import { isBonusTier, assignToast } from '@/lib/prereqWaiver';
import SponsorProgressPanel from '@/components/academy/SponsorProgressPanel';
import { courseName, courseNameFrom } from '@/lib/appNames';

// The sponsor console (Breeze Energy onboarding, 2026-09-07): a training or
// technical lead runs the employer's block of enrolments here. Assign a
// named learner to a course and tier, cancel and reassign when roles change,
// apply seats to new joiners, read the pool report and (2026-09-23) follow
// each sponsored learner's progress and scores. Petrolord admins
// see every sponsor. All mutations are definer functions; this page is a
// shell over them, not the enforcement layer.
//
// Design system (batch 2A): the console renders inside the signed-in scope
// (src/design/rollout/w2a.js) on theme roles. Pool states and seat status
// use the status text roles next to their words.

const STATE_LABEL = { active: 'Active', closed: 'Closed', expired: 'Expired', not_started: 'Not started yet', full: 'All seats used' };
const STATE_CLS = { active: 'text-pl-success-text', closed: 'text-pl-muted', expired: 'text-pl-danger-text', not_started: 'text-pl-warning-text', full: 'text-pl-warning-text' };
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

function toCsv(rows) {
  const head = ['learner', 'email', 'course', 'tier', 'status', 'enrollment', 'certified', 'assigned', 'cancelled', 'reason', 'note'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((r) => [r.display_name, r.email, courseName(r.app_slug, r.course_name), TIER_LABELS[r.course_tier] || r.course_tier, r.status, r.enrollment_status, r.certified ? 'yes' : 'no', fmtDate(r.assigned_at), fmtDate(r.cancelled_at), r.cancel_reason, r.note].map(esc).join(','));
  return [head.join(','), ...lines].join('\n');
}

const SponsorConsolePage = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [poolId, setPoolId] = useState('');
  // /dashboard/sponsor?pool=<id> (the Assign seats link on Academy Doors) preselects that pool.
  const [searchParams] = useSearchParams();
  const wantedPool = searchParams.get('pool');
  const [report, setReport] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [appSlug, setAppSlug] = useState('');
  const [tier, setTier] = useState('beginner');
  const [note, setNote] = useState('');
  const [cancelling, setCancelling] = useState(null); // { id, reason }
  const [progressKey, setProgressKey] = useState(0); // bumps to reload the progress panel

  const pools = useMemo(() => groups.flatMap((g) => (g.pools || []).map((p) => ({ ...p, sponsor_name: g.sponsor?.name }))), [groups]);
  const pool = pools.find((p) => p.id === poolId) || null;
  const availableApps = useMemo(() => apps.filter((a) => a.status === 'available' && (!pool || poolCovers(pool, a.slug, tier))), [apps, pool, tier]);
  const summary = useMemo(() => summarizeAssignments(report), [report]);

  const refresh = async () => {
    try {
      const [g, a] = await Promise.all([mySponsorPools(), listAcademyApps()]);
      setGroups(g);
      setApps(a || []);
      const all = g.flatMap((x) => x.pools || []);
      if (!poolId && all.length) setPoolId(all.find((p) => p.id === wantedPool)?.id || all[0].id);
    } catch (err) {
      toast({ title: 'Failed to load', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };
  const loadReport = async (id) => {
    if (!id) { setReport([]); return; }
    setReportLoading(true);
    try { setReport(await sponsorPoolReport(id)); } catch (err) { toast({ title: 'Report failed', description: err.message, variant: 'destructive' }); } finally { setReportLoading(false); }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  useEffect(() => { loadReport(poolId); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [poolId]);
  useEffect(() => { if (!availableApps.some((a) => a.slug === appSlug)) setAppSlug(availableApps[0]?.slug || ''); }, [availableApps, appSlug]);

  const handleAssign = async () => {
    if (!pool) return;
    setBusy(true);
    try {
      const res = await sponsorAssign({ poolId: pool.id, email: email.trim(), appSlug, tier, note: note || null });
      toast({ title: res.seat_consumed === false ? 'Enrolled, no seat used' : 'Seat assigned', description: assignToast({ ...res, email }, courseNameFrom(apps, appSlug), TIER_LABELS[tier]) });
      setEmail(''); setNote('');
      await refresh(); await loadReport(pool.id); setProgressKey((k) => k + 1);
    } catch (err) {
      toast({ title: 'Could not assign', description: err.message, variant: 'destructive' });
    } finally { setBusy(false); }
  };

  const handleCancel = async () => {
    if (!cancelling) return;
    setBusy(true);
    try {
      const res = await sponsorCancel(cancelling.id, cancelling.reason || null);
      toast({ title: res.seat_returned ? 'Seat returned to the pool' : 'Assignment closed', description: res.seat_returned ? 'The enrollment is cancelled and the seat can be assigned again.' : 'The learner had already earned the certification, so the seat is consumed.' });
      setCancelling(null);
      await refresh(); await loadReport(poolId); setProgressKey((k) => k + 1);
    } catch (err) {
      toast({ title: 'Could not cancel', description: err.message, variant: 'destructive' });
    } finally { setBusy(false); }
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(report)], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(pool?.sponsor_name || 'sponsor').replace(/\W+/g, '-')}-${(pool?.name || 'pool').replace(/\W+/g, '-')}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-pl-primary-text" /></div>;
  }
  if (!pools.length) {
    return (
      <div className="px-4 py-8 sm:p-8 text-pl-muted" data-testid="sponsor-none">
        You are not a training lead for any sponsor. A Petrolord admin adds leads from the Academy Doors console.
      </div>
    );
  }

  const state = poolState(pool);
  const left = pool ? daysLeft(pool) : null;

  return (
    <>
      <Helmet><title>Sponsor console - NextGen Academy</title></Helmet>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-6xl mx-auto px-4 py-6 sm:p-6 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-pl-text">Sponsor console</h1>
            <p className="mt-1 text-pl-muted">Assign your organisation's enrolments, reassign them when roles change, see where every seat went, and follow each learner's progress and scores.</p>
          </div>
          <Button variant="outline" onClick={() => { refresh(); loadReport(poolId); setProgressKey((k) => k + 1); }}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pools.map((p) => {
            const st = poolState(p);
            return (
              <button key={p.id} type="button" onClick={() => setPoolId(p.id)} data-testid={`sponsor-pool-${p.id}`}
                aria-pressed={p.id === poolId}
                className={`text-left rounded-lg border p-4 bg-pl-surface shadow-pl-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus ${p.id === poolId ? 'border-pl-primary ring-1 ring-pl-primary' : 'border-pl-border hover:border-pl-border-strong'}`}>
                <div className="text-xs text-pl-muted">{p.sponsor_name}</div>
                <div className="text-lg font-semibold text-pl-text">{p.name}</div>
                <div className="text-2xl font-bold text-pl-text tabular-nums mt-1">{seatsRemaining(p)} <span className="text-sm font-normal text-pl-muted">of {p.seats} seats left</span></div>
                <div className={`text-xs mt-1 ${STATE_CLS[st]}`}>{STATE_LABEL[st]}{p.valid_until ? `, until ${fmtDate(p.valid_until)}` : ''}</div>
              </button>
            );
          })}
        </div>

        {pool && (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-pl-text flex items-center gap-2"><UserPlus className="h-4 w-4 text-pl-primary-text" aria-hidden="true" />Assign a seat</CardTitle>
                <CardDescription>
                  {formatPrice(pool) ? `${formatPrice(pool)} for ${pool.seats} seats. ` : ''}
                  {left != null ? (left >= 0 ? `${left} days left. ` : 'Expired. ') : ''}
                  {seatScopeLabel(pool)}. The learner needs a NextGen account first; their sponsored enrolment activates at once.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-pl-text mb-1 block">Learner email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" data-testid="sponsor-assign-email" />
                </div>
                <div>
                  <Label className="text-pl-text mb-1 block">Tier</Label>
                  <select value={tier} onChange={(e) => setTier(e.target.value)} className={THEMED_INPUT} data-testid="sponsor-assign-tier">
                    {TIERS.filter((t) => poolCovers(pool, appSlug || '__any__', t) || !(pool.tiers || []).length || (pool.tiers || []).includes(t)).map((t) => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-pl-text mb-1 block">Course</Label>
                  <select value={appSlug} onChange={(e) => setAppSlug(e.target.value)} className={THEMED_INPUT} data-testid="sponsor-assign-course">
                    {availableApps.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
                  </select>
                  {!availableApps.length && <p className="text-xs text-pl-warning-text mt-1">This pool covers no course at this tier.</p>}
                  {isBonusTier(apps.find((a) => a.slug === appSlug), tier) && (
                    <p className="text-xs text-pl-success-text mt-1" data-testid="sponsor-bonus-note">Bonus tier: this enrolment takes no seat from the pool.</p>
                  )}
                  {apps.find((a) => a.slug === appSlug)?.prereq_slug && (
                    <p className="text-xs text-pl-muted mt-1" data-testid="sponsor-prereq-note">
                      Prerequisite: {apps.find((a) => a.slug === apps.find((b) => b.slug === appSlug)?.prereq_slug)?.name || 'the root course'} (Associate certification, or the free waiver exam the learner takes from their Enroll page).
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-pl-text mb-1 block">Note (development plan, role)</Label>
                  <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="optional" data-testid="sponsor-assign-note" />
                </div>
                <Button onClick={handleAssign} disabled={busy || !canAssign(pool) || !email.trim() || !appSlug} className="font-semibold" data-testid="sponsor-assign">
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Briefcase className="mr-2 h-4 w-4" />}
                  Assign seat
                </Button>
                {!canAssign(pool) && <p className="text-xs text-pl-muted">{STATE_LABEL[state]}: no new assignments from this pool.</p>}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 min-w-0">
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-pl-text">Where the seats went</CardTitle>
                  <CardDescription>
                    {summary.total} assignment{summary.total === 1 ? '' : 's'}: {summary.active} active, {summary.cancelled} cancelled ({summary.returned} seat{summary.returned === 1 ? '' : 's'} returned), {summary.certified} certified.
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={exportCsv} disabled={!report.length}><Download className="h-4 w-4 mr-2" />CSV</Button>
              </CardHeader>
              <CardContent>
                {reportLoading ? <Loader2 className="h-5 w-5 animate-spin text-pl-primary-text" /> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="sponsor-report">
                      <thead className="text-xs uppercase text-pl-muted">
                        <tr><th className="text-left py-1 pr-3">Learner</th><th className="text-left py-1 pr-3">Course</th><th className="text-left py-1 pr-3">Tier</th><th className="text-left py-1 pr-3">Status</th><th className="text-left py-1 pr-3">Assigned</th><th className="text-left py-1 pr-3">Note</th><th></th></tr>
                      </thead>
                      <tbody>
                        {report.map((r) => (
                          <tr key={r.assignment_id} className="border-t border-pl-border text-pl-text" data-testid={`sponsor-row-${r.assignment_id}`}>
                            <td className="py-1.5 pr-3"><div>{r.display_name || r.email}</div><div className="text-xs text-pl-muted">{r.email}</div></td>
                            <td className="py-1.5 pr-3">{courseName(r.app_slug, r.course_name)}</td>
                            <td className="py-1.5 pr-3">{TIER_LABELS[r.course_tier] || r.course_tier}</td>
                            <td className="py-1.5 pr-3">
                              {r.status === 'active' ? <span className="text-pl-success-text font-medium">active</span> : <span className="text-pl-muted">cancelled{r.seat_returned ? ', seat returned' : ', seat consumed'}</span>}
                              {r.certified ? <span className="ml-2 text-pl-accent-text font-medium">certified</span> : null}
                              {r.cancel_reason ? <div className="text-xs text-pl-muted">{r.cancel_reason}</div> : null}
                            </td>
                            <td className="py-1.5 pr-3 whitespace-nowrap">{fmtDate(r.assigned_at)}</td>
                            <td className="py-1.5 pr-3 text-pl-muted">{r.note || ''}</td>
                            <td className="py-1.5">
                              {r.status === 'active' && (
                                <button type="button" onClick={() => setCancelling({ id: r.assignment_id, reason: '' })} className="text-pl-danger-text hover:underline text-xs flex items-center gap-1" data-testid={`sponsor-cancel-${r.assignment_id}`}><XCircle className="h-3.5 w-3.5" />Cancel</button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {!report.length && <tr><td colSpan={7} className="py-3 text-pl-muted">No seats assigned from this pool yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}
                {cancelling && (
                  <div className="mt-4 rounded-md border border-pl-danger/40 bg-pl-danger-bg p-3 space-y-2" data-testid="sponsor-cancel-box">
                    <p className="text-sm text-pl-text">Cancel this assignment? The learner's enrolment ends now. The seat returns to the pool unless they have already earned the certification for this tier.</p>
                    <Input value={cancelling.reason} onChange={(e) => setCancelling({ ...cancelling, reason: e.target.value })} placeholder="reason (role change, left the company)" data-testid="sponsor-cancel-reason" />
                    <div className="flex flex-wrap gap-2">
                      <Button variant="destructive" onClick={handleCancel} disabled={busy} data-testid="sponsor-cancel-confirm">Cancel assignment</Button>
                      <Button variant="outline" onClick={() => setCancelling(null)}>Keep it</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {pool && (
          <SponsorProgressPanel
            key={`${pool.id}-${progressKey}`}
            poolId={pool.id}
            fileStem={`${(pool.sponsor_name || 'sponsor').replace(/\W+/g, '-')}-${(pool.name || 'pool').replace(/\W+/g, '-')}`}
          />
        )}
      </motion.div>
    </>
  );
};

export default SponsorConsolePage;
