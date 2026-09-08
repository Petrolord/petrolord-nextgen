import { Link } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Building2, UserPlus, Layers, XCircle } from 'lucide-react';
import { listAcademyApps, mySponsorPools, adminUpsertSponsor, adminAddSponsorLead, adminRemoveSponsorLead, adminCreatePool, adminClosePool } from '@/services/academyService';
import { BLOCK_OFFERS, TIER_LABELS, TIERS, SEAT_SCOPES, seatsRemaining, poolState, formatPrice, seatScopeLabel } from '@/lib/sponsorPools';

// Admin half of sponsor pools (2026-09-07): create the sponsor, name its
// training leads, and record the block it bought (seats, price, validity,
// allow-lists). The leads then run the pool from the Sponsor console.

const inputCls = 'bg-gray-700 text-white border-gray-600';
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '');
const inOneYear = () => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d.toISOString().slice(0, 10); };

export default function AdminSponsorPools() {
  const { toast } = useToast();
  const [groups, setGroups] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [sponsorName, setSponsorName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [sponsorId, setSponsorId] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [poolName, setPoolName] = useState('');
  const [offer, setOffer] = useState('starter');
  const [seats, setSeats] = useState('20');
  const [price, setPrice] = useState('2400000');
  const [validUntil, setValidUntil] = useState(inOneYear);
  const [paymentRef, setPaymentRef] = useState('');
  const [appSlugs, setAppSlugs] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [seatScope, setSeatScope] = useState('tier');

  const sponsor = groups.find((g) => g.sponsor?.id === sponsorId) || null;
  const availableApps = useMemo(() => apps.filter((a) => a.status === 'available'), [apps]);

  const refresh = async () => {
    try {
      const [g, a] = await Promise.all([mySponsorPools(), listAcademyApps()]);
      setGroups(g); setApps(a || []);
      if (!sponsorId && g.length) setSponsorId(g[0].sponsor.id);
    } catch (err) { toast({ title: 'Failed to load', description: err.message, variant: 'destructive' }); } finally { setLoading(false); }
  };
  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const pickOffer = (key) => {
    setOffer(key);
    const o = BLOCK_OFFERS.find((x) => x.key === key);
    if (o) { setSeats(String(o.seats)); setPrice(String(o.price_minor / 100)); if (!poolName) setPoolName(`${o.name} block`); }
  };

  const run = async (label, fn, after) => {
    setBusy(true);
    try { const res = await fn(); toast({ title: label, description: after ? after(res) : undefined, className: 'bg-[#BFFF00] text-slate-900' }); await refresh(); return res; } catch (err) { toast({ title: `${label} failed`, description: err.message, variant: 'destructive' }); return null; } finally { setBusy(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-6 w-6 animate-spin text-[#BFFF00]" /></div>;

  return (
    <div className="grid gap-6 lg:grid-cols-2" data-testid="admin-sponsor-pools">
      <Card className="bg-[#1E293B] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><Building2 className="h-4 w-4" />Sponsor</CardTitle>
          <CardDescription>The employer. Its training leads are named below and run the pools from their own Sponsor console.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2"><Label className="text-gray-300 mb-1 block">Organisation</Label><Input value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} placeholder="Breeze Energy" className={inputCls} data-testid="admin-sponsor-name" /></div>
            <div><Label className="text-gray-300 mb-1 block">Contact name</Label><Input value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputCls} /></div>
            <div><Label className="text-gray-300 mb-1 block">Contact email</Label><Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputCls} /></div>
          </div>
          <Button disabled={busy || !sponsorName.trim()} onClick={async () => { const r = await run('Sponsor saved', () => adminUpsertSponsor({ name: sponsorName, contactName: contactName || null, contactEmail: contactEmail || null }), (x) => x.name); if (r) { setSponsorId(r.id); setSponsorName(''); setContactName(''); setContactEmail(''); } }} className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold" data-testid="admin-sponsor-save">Save sponsor</Button>

          <div className="pt-3 border-t border-gray-700">
            <Label className="text-gray-300 mb-1 block">Working with</Label>
            <select value={sponsorId} onChange={(e) => setSponsorId(e.target.value)} className={`${inputCls} w-full rounded-md h-10 px-3`} data-testid="admin-sponsor-pick">
              <option value="">choose a sponsor</option>
              {groups.map((g) => <option key={g.sponsor.id} value={g.sponsor.id}>{g.sponsor.name}</option>)}
            </select>
          </div>

          {sponsor && (
            <div className="space-y-2">
              <Label className="text-gray-300 block">Training leads</Label>
              <ul className="text-sm text-gray-200 space-y-1">
                {(sponsor.leads || []).map((l) => (
                  <li key={l.user_id} className="flex items-center justify-between gap-2">
                    <span>{l.display_name || l.email} <span className="text-gray-500 text-xs">{l.email}</span></span>
                    <button type="button" disabled={busy} onClick={() => run('Lead removed', () => adminRemoveSponsorLead(sponsor.sponsor.id, l.user_id))} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"><XCircle className="h-3.5 w-3.5" />Remove</button>
                  </li>
                ))}
                {!(sponsor.leads || []).length && <li className="text-gray-500">No leads yet.</li>}
              </ul>
              <div className="flex gap-2">
                <Input value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} placeholder="lead's NextGen account email" className={inputCls} data-testid="admin-lead-email" />
                <Button disabled={busy || !leadEmail.trim()} onClick={async () => { const r = await run('Lead added', () => adminAddSponsorLead(sponsor.sponsor.id, leadEmail.trim()), (x) => `${x.display_name || x.email} can now run ${sponsor.sponsor.name}'s pools.`); if (r) setLeadEmail(''); }} variant="outline" className="border-gray-600 text-gray-200" data-testid="admin-lead-add"><UserPlus className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#1E293B] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><Layers className="h-4 w-4" />Enrolment block</CardTitle>
          <CardDescription>Record the block the sponsor bought. Seats, the price paid, a validity window (a year by default) and, if wanted, which courses and tiers the seats may be spent on. Seats are handed to named learners in the <Link to="/dashboard/sponsor" className="text-[#BFFF00] hover:underline">Sponsor console</Link> (also in the sidebar), by you or by the sponsor's training leads.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {BLOCK_OFFERS.map((o) => (
              <button key={o.key} type="button" onClick={() => pickOffer(o.key)} className={`rounded border px-3 py-1.5 text-sm ${offer === o.key ? 'border-[#BFFF00] text-[#BFFF00]' : 'border-gray-600 text-gray-300'}`} data-testid={`admin-offer-${o.key}`}>
                {o.name}: {o.seats} for {formatPrice({ price_minor: o.price_minor, currency: 'NGN' })}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2"><Label className="text-gray-300 mb-1 block">Pool name</Label><Input value={poolName} onChange={(e) => setPoolName(e.target.value)} placeholder="2026 development plan" className={inputCls} data-testid="admin-pool-name" /></div>
            <div><Label className="text-gray-300 mb-1 block">Seats</Label><Input type="number" min="1" value={seats} onChange={(e) => setSeats(e.target.value)} className={inputCls} data-testid="admin-pool-seats" /></div>
            <div><Label className="text-gray-300 mb-1 block">Price paid (NGN)</Label><Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} data-testid="admin-pool-price" /></div>
            <div><Label className="text-gray-300 mb-1 block">Valid until</Label><Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className={inputCls} data-testid="admin-pool-until" /></div>
            <div><Label className="text-gray-300 mb-1 block">Payment reference</Label><Input value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="invoice or Paystack ref" className={inputCls} /></div>
          </div>
          <div>
            <Label className="text-gray-300 mb-1 block">What one seat buys</Label>
            <div className="flex flex-col gap-1 text-sm text-gray-200">
              {Object.entries(SEAT_SCOPES).map(([k, label]) => (
                <label key={k} className="flex items-center gap-2"><input type="radio" name="seat-scope" checked={seatScope === k} onChange={() => setSeatScope(k)} data-testid={`admin-seat-scope-${k}`} />{label}</label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Course scope: the learner's later tiers of a course they already hold a seat for take no further seat (pioneer cohorts: seats = learners x courses each).</p>
          </div>
          <div>
            <Label className="text-gray-300 mb-1 block">Tiers allowed (none ticked = any)</Label>
            <div className="flex gap-3 flex-wrap text-sm text-gray-200">
              {TIERS.map((t) => (
                <label key={t} className="flex items-center gap-1"><input type="checkbox" checked={tiers.includes(t)} onChange={() => setTiers((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))} />{TIER_LABELS[t]}</label>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-gray-300 mb-1 block">Courses allowed (none ticked = any available course)</Label>
            <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-1 text-sm text-gray-200 rounded border border-gray-700 p-2">
              {availableApps.map((a) => (
                <label key={a.slug} className="flex items-center gap-1"><input type="checkbox" checked={appSlugs.includes(a.slug)} onChange={() => setAppSlugs((s) => (s.includes(a.slug) ? s.filter((x) => x !== a.slug) : [...s, a.slug]))} />{a.name}</label>
              ))}
            </div>
          </div>
          <Button disabled={busy || !sponsor || !poolName.trim() || !(Number(seats) > 0) || !validUntil} onClick={async () => {
            const r = await run('Pool created', () => adminCreatePool({
              sponsorId: sponsor.sponsor.id, name: poolName, seats: Number(seats), validUntil: new Date(`${validUntil}T23:59:59Z`).toISOString(),
              priceMinor: price === '' ? null : Math.round(Number(price) * 100), currency: 'NGN', appSlugs, tiers, paymentRef: paymentRef || null, seatScope,
            }), (x) => `${x.name}: ${x.seats} seats (${seatScopeLabel(x).toLowerCase()}) until ${fmtDate(x.valid_until)}.`);
            if (r) { setPoolName(''); setPaymentRef(''); setAppSlugs([]); setTiers([]); }
          }} className="bg-[#BFFF00] text-[#0F172A] hover:bg-[#A8E600] font-semibold" data-testid="admin-pool-create">Create pool</Button>

          {sponsor && (
            <div className="pt-3 border-t border-gray-700 space-y-1">
              <Label className="text-gray-300 block">{sponsor.sponsor.name}'s pools</Label>
              {(sponsor.pools || []).map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 text-sm text-gray-200" data-testid={`admin-pool-${p.id}`}>
                  <span>{p.name}: {seatsRemaining(p)} of {p.seats} left, {poolState(p)}{p.seat_scope === 'course' ? ', course seats' : ''}{p.valid_until ? `, until ${fmtDate(p.valid_until)}` : ''}{formatPrice(p) ? `, ${formatPrice(p)}` : ''}</span>
                  <span className="flex items-center gap-3">
                    {p.status === 'active' && <Link to={`/dashboard/sponsor?pool=${p.id}`} className="text-[#BFFF00] hover:underline text-xs" data-testid={`admin-pool-assign-${p.id}`}>Assign seats</Link>}
                    {p.status === 'active' && <button type="button" disabled={busy} onClick={() => run('Pool closed', () => adminClosePool(p.id))} className="text-red-400 hover:text-red-300 text-xs">Close</button>}
                  </span>
                </div>
              ))}
              {!(sponsor.pools || []).length && <p className="text-gray-500 text-sm">No pools yet.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
