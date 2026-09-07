import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Briefcase, UserPlus, XCircle, Download, RefreshCw } from 'lucide-react';
import { listAcademyApps, mySponsorPools, sponsorPoolReport, sponsorAssign, sponsorCancel } from '@/services/academyService';
import {
  TIER_LABELS, TIERS, seatsRemaining, poolState, canAssign, daysLeft, formatPrice, poolCovers, summarizeAssignments,
} from '@/lib/sponsorPools';

// The sponsor console (Breeze Energy onboarding, 2026-09-07): a training or
// technical lead runs the employer's block of enrolments here. Assign a
// named learner to a course and tier, cancel and reassign when roles change,
// apply seats to new joiners, and read the pool report. Petrolord admins
// see every sponsor. All mutations are definer functions; this page is a
// shell over them, not the enforcement layer.

const STATE_LABEL = { active: 'Active', closed: 'Closed', expired: 'Expired', not_started: 'Not started yet', full: 'All seats used' };
const STATE_CLS = { active: 'text-emerald-400', closed: 'text-gray-400', expired: 'text-red-400', not_started: 'text-yellow-400', full: 'text-yellow-400' };
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

function toCsv(rows) {
  const head = ['learner', 'email', 'course', 'tier', 'status', 'enrollment', 'certified', 'assigned', 'cancelled', 'reason', 'note'];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map((r) => [r.display_name, r.email, r.course_name || r.app_slug, TIER_LABELS[r.course_tier] || r.course_tier, r.status, r.enrollment_status, r.certified ? 'yes' : 'no', fmtDate(r.assigned_at), fmtDate(r.cancelled_at), r.cancel_reason, r.note].map(esc).join(','));
  return [head.join(','), ...lines].join('\n');
}

const SponsorConsolePage = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [poolId, setPoolId] = useState('');
  const [report, setReport] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [appSlug, setAppSlug] = useState('');
  const [tier, setTier] = useState('beginner');
  const [note, setNote] = useState('');
  const [cancelling, setCancelling] = useState(null); // { id, reason }

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
      if (!poolId && all.length) setPoolId(all[0].id);
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
      toast({ title: 'Seat assigned', description: `${res.display_name || email} is enrolled in ${apps.find((a) => a.slug === appSlug)?.name || appSlug} (${TIER_LABELS[tier]}). ${res.seats_used} of ${res.seats} seats used.`, className: 'bg-[#BFFF00] text-slate-900' });
      setEmail(''); setNote('');
      await refresh(); await loadReport(pool.id);
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
      await refresh(); await loadReport(poolId);
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
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" /></div>;
  }
  if (!pools.length) {
    return (
      <div className="p-8 text-gray-400" data-testid="sponsor-none">
        You are not a training lead for any sponsor. A Petrolord admin adds leads from the Academy Doors console.
      </div>
    );
  }

  const state = poolState(pool);
  const left = pool ? daysLeft(pool) : null;
  const inputCls = 'bg-gray-700 text-white border-gray-600';

  return (
    <>
      <Helmet><title>Sponsor console - NextGen Academy</title></Helmet>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-white">Sponsor console</h1>
            <p className="mt-1 text-gray-400">Assign your organisation's enrolments, reassign them when roles change, and see where every seat went.</p>
          </div>
          <Button variant="outline" onClick={() => { refresh(); loadReport(poolId); }} className="border-gray-600 text-gray-200"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {pools.map((p) => {
            const st = poolState(p);
            return (
              <button key={p.id} type="button" onClick={() => setPoolId(p.id)} data-testid={`sponsor-pool-${p.id}`}
                className={`text-left rounded-lg border p-4 bg-[#1E293B] ${p.id === poolId ? 'border-[#BFFF00]' : 'border-gray-700 hover:border-gray-500'}`}>
                <div className="text-xs text-gray-400">{p.sponsor_name}</div>
                <div className="text-lg font-semibold text-white">{p.name}</div>
                <div className="text-2xl font-bold text-white mt-1">{seatsRemaining(p)} <span className="text-sm font-normal text-gray-400">of {p.seats} seats left</span></div>
                <div className={`text-xs mt-1 ${STATE_CLS[st]}`}>{STATE_LABEL[st]}{p.valid_until ? `, until ${fmtDate(p.valid_until)}` : ''}</div>
              </button>
            );
          })}
        </div>

        {pool && (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="bg-[#1E293B] border-gray-700 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2"><UserPlus className="h-4 w-4" />Assign a seat</CardTitle>
                <CardDescription>
                  {formatPrice(pool) ? `${formatPrice(pool)} for ${pool.seats} seats. ` : ''}
                  {left != null ? (left >= 0 ? `${left} days left. ` : 'Expired. ') : ''}
                  The learner needs a NextGen account first; their sponsored enrolment activates at once.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300 mb-1 block">Learner email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={inputCls} data-testid="sponsor-assign-email" />
                </div>
                <div>
                  <Label className="text-gray-300 mb-1 block">Tier</Label>
                  <select value={tier} onChange={(e) => setTier(e.target.value)} className={`${inputCls} w-full rounded-md h-10 px-3`} data-testid="sponsor-assign-tier">
                    {TIERS.filter((t) => poolCovers(pool, appSlug || '__any__', t) || !(pool.tiers || []).length || (pool.tiers || []).includes(t)).map((t) => <option key={t} value={t}>{TIER_LABELS[t]}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300 mb-1 block">Course</Label>
                  <select value={appSlug} onChange={(e) => setAppSlug(e.target.value)} className={`${inputCls} w-full rounded-md h-10 px-3`} data-testid="sponsor-assign-course">
                    {availableApps.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
                  </select>
                  {!availableApps.length && <p className="text-xs text-yellow-400 mt-1">This pool covers no course at this tier.</p>}
                </div>
                <div>
                  <Label className="text-gray-300 mb-1 block">Note (development plan, role)</Label>
                  <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="optional" className={inputCls} data-testid="sponsor-assign-note" />
                </div>
                <Button onClick={handleAssign} disabled={busy || !canAssign(pool) || !email.trim() || !appSlug} className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold" data-testid="sponsor-assign">
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Briefcase className="mr-2 h-4 w-4" />}
                  Assign seat
                </Button>
                {!canAssign(pool) && <p className="text-xs text-gray-400">{STATE_LABEL[state]}: no new assignments from this pool.</p>}
              </CardContent>
            </Card>

            <Card className="bg-[#1E293B] border-gray-700 lg:col-span-2">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-white">Where the seats went</CardTitle>
                  <CardDescription>
                    {summary.total} assignment{summary.total === 1 ? '' : 's'}: {summary.active} active, {summary.cancelled} cancelled ({summary.returned} seat{summary.returned === 1 ? '' : 's'} returned), {summary.certified} certified.
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={exportCsv} disabled={!report.length} className="border-gray-600 text-gray-200"><Download className="h-4 w-4 mr-2" />CSV</Button>
              </CardHeader>
              <CardContent>
                {reportLoading ? <Loader2 className="h-5 w-5 animate-spin text-[#BFFF00]" /> : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm" data-testid="sponsor-report">
                      <thead className="text-xs uppercase text-gray-500">
                        <tr><th className="text-left py-1 pr-3">Learner</th><th className="text-left py-1 pr-3">Course</th><th className="text-left py-1 pr-3">Tier</th><th className="text-left py-1 pr-3">Status</th><th className="text-left py-1 pr-3">Assigned</th><th className="text-left py-1 pr-3">Note</th><th></th></tr>
                      </thead>
                      <tbody>
                        {report.map((r) => (
                          <tr key={r.assignment_id} className="border-t border-gray-700 text-gray-200" data-testid={`sponsor-row-${r.assignment_id}`}>
                            <td className="py-1.5 pr-3"><div>{r.display_name || r.email}</div><div className="text-xs text-gray-500">{r.email}</div></td>
                            <td className="py-1.5 pr-3">{r.course_name || r.app_slug}</td>
                            <td className="py-1.5 pr-3">{TIER_LABELS[r.course_tier] || r.course_tier}</td>
                            <td className="py-1.5 pr-3">
                              {r.status === 'active' ? <span className="text-emerald-400">active</span> : <span className="text-gray-400">cancelled{r.seat_returned ? ', seat returned' : ', seat consumed'}</span>}
                              {r.certified ? <span className="ml-2 text-[#BFFF00]">certified</span> : null}
                              {r.cancel_reason ? <div className="text-xs text-gray-500">{r.cancel_reason}</div> : null}
                            </td>
                            <td className="py-1.5 pr-3 whitespace-nowrap">{fmtDate(r.assigned_at)}</td>
                            <td className="py-1.5 pr-3 text-gray-400">{r.note || ''}</td>
                            <td className="py-1.5">
                              {r.status === 'active' && (
                                <button type="button" onClick={() => setCancelling({ id: r.assignment_id, reason: '' })} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1" data-testid={`sponsor-cancel-${r.assignment_id}`}><XCircle className="h-3.5 w-3.5" />Cancel</button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {!report.length && <tr><td colSpan={7} className="py-3 text-gray-500">No seats assigned from this pool yet.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}
                {cancelling && (
                  <div className="mt-4 rounded border border-red-500/40 bg-red-500/5 p-3 space-y-2" data-testid="sponsor-cancel-box">
                    <p className="text-sm text-gray-200">Cancel this assignment? The learner's enrolment ends now. The seat returns to the pool unless they have already earned the certification for this tier.</p>
                    <Input value={cancelling.reason} onChange={(e) => setCancelling({ ...cancelling, reason: e.target.value })} placeholder="reason (role change, left the company)" className={inputCls} data-testid="sponsor-cancel-reason" />
                    <div className="flex gap-2">
                      <Button onClick={handleCancel} disabled={busy} className="bg-red-500 hover:bg-red-400 text-white" data-testid="sponsor-cancel-confirm">Cancel assignment</Button>
                      <Button variant="ghost" onClick={() => setCancelling(null)} className="text-gray-300">Keep it</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default SponsorConsolePage;
