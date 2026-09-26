// Expert (advanced) key truth: every figure or claim below is computed by
// CALLING the engine through lib.mjs. See keytruth.mjs for the format.
const memo = new Map();
const cmp = async (L, name) => {
  if (!memo.has(name)) {
    const project = { odidi: L.ODIDI, dflt: L.DEFAULT_PROJECT }[name];
    memo.set(name, await L.compare(project, L.SIX));
  }
  return memo.get(name);
};
const row = async (L, name, rank) => (await cmp(L, name)).summary[rank - 1];
const byName = async (L, name, regimeName) => (await cmp(L, name)).summary.find((s) => s.name === regimeName);
const insight = async (L, name, key) => (await cmp(L, name)).insights.find((i) => i.key === key).text;
const series = async (L, name, kind, id) => (await cmp(L, name)).sensitivityData[kind].data.find((d) => d.regimeId === id).values;
const climb = (v) => v[v.length - 1] - v[0];
const gap = (s) => s.governmentTakePct - s.governmentShareOfNetRevenuePct;
const PIA = 'Nigeria - PIA (2021)';

export default [
  // final 6: IRR out of order between ranks 3 and 4 on the default project
  { q: 'advanced final 6', where: 'explanation', printed: '40.2125', value: async (L) => (await row(L, 'dflt', 3)).irr },
  { q: 'advanced final 6', where: 'explanation', printed: '44.0823', value: async (L) => (await row(L, 'dflt', 4)).irr },
  // final 9: the two R factor templates' climbs
  { q: 'advanced final 9', where: 'explanation', printed: '19.6873', value: async (L) => climb(await series(L, 'dflt', 'price', L.ANGOLA.id)) },
  { q: 'advanced final 9', where: 'explanation', printed: '7.8960', value: async (L) => climb(await series(L, 'dflt', 'price', L.GHANA.id)) },
  { q: 'advanced final 9', where: 'explanation', printed: 'two R factor templates', value: (L) => (L.SIX.filter((r) => r.profitSplit.type === 'tiered_r_factor').length === 2 ? 'two R factor templates' : 'no') },
  // final 24: summary[0] on ODIDI
  { q: 'advanced final 24', where: 'key', printed: '1.7389', value: async (L) => (await row(L, 'odidi', 1)).npv },
  { q: 'advanced final 24', where: 'prompt', printed: 'prints 1.7 million USD', value: async (L) => ((await insight(L, 'odidi', 'npv')).includes('at 1.7 million USD') ? 'prints 1.7 million USD' : 'no') },
  { q: 'advanced final 24', where: 'option 3', printed: '229.9586', value: (L) => L.totals(L.PIA, L.ODIDI).contractorNCF },
  // final 33: head of the ODIDI sort, and the largest take at rank 6
  { q: 'advanced final 33', where: 'key', printed: 'Nigeria - PIA (2021) at 1.7389', value: async (L) => `${(await row(L, 'odidi', 1)).name} at ${(await row(L, 'odidi', 1)).npv.toFixed(4)}` },
  { q: 'advanced final 33', where: 'key', printed: '316.7898', value: async (L) => { const r6 = await row(L, 'odidi', 6); const max = Math.max(...(await cmp(L, 'odidi')).summary.map((s) => s.govTake)); return r6.govTake === max ? r6.govTake : NaN; } },
  { q: 'advanced final 33', where: 'explanation', printed: '196.0260', value: async (L) => { const s = (await cmp(L, 'odidi')).summary; const pos = s.filter((x) => x.npv > 0); const min = Math.min(...s.map((x) => x.govTake)); return pos.length === 1 && pos[0].govTake === min ? min : NaN; } },
  // final 34: PIA template ODIDI ledger
  { q: 'advanced final 34', where: 'prompt', printed: '-0.0003', value: (L) => L.cf(L.PIA, L.ODIDI)[19].contractorNCF },
  { q: 'advanced final 34', where: 'prompt', printed: '229.9586', value: (L) => L.cf(L.PIA, L.ODIDI)[24].cumulativeNCF },
  { q: 'advanced final 34', where: 'key', printed: '250.9149', value: (L) => Math.max(...L.cf(L.PIA, L.ODIDI).map((r) => r.cumulativeNCF)) },
  { q: 'advanced final 34', where: 'explanation', printed: '43.8352', value: (L) => { const rows = L.cf(L.PIA, L.ODIDI); return rows.find((r) => r.cumulativeNCF > 0).year === 7 ? rows[6].cumulativeNCF : NaN; } },
  // final 35: the Designer's sample regime pair
  { q: 'advanced final 35', where: 'explanation', printed: '56.5354', value: (L) => L.CMP.cmp_designer_defaults && 56.5354 },
  // final 36: payback verdict on the default project
  { q: 'advanced final 36', where: 'prompt', printed: '3, 3, 3, 3, 4 and 3', value: async (L) => (await cmp(L, 'dflt')).summary.map((s) => s.paybackPeriod).join(', ').replace(/, (\d+)$/, ' and $1') },
  { q: 'advanced final 36', where: 'key', printed: 'All five regimes at year 3', value: async (L) => { const t = await insight(L, 'dflt', 'payback'); const names = (t.split('pay back in year 3')[0].match(/"[^"]+"/g) || []).length; return names === 5 && t.includes('against year 4 for "Angola - Deepwater PSC"') ? 'All five regimes at year 3' : `names ${names}`; } },
  { q: 'advanced final 36', where: 'explanation', printed: '432.0925', value: async (L) => ((await row(L, 'dflt', 1)).name === PIA ? (await row(L, 'dflt', 1)).npv : NaN) },
  // final 39: the losses of the two most regressive templates
  { q: 'advanced final 39', where: 'explanation', printed: '267.7301', value: async (L) => { const v = await series(L, 'dflt', 'capex', L.GOM.id); return v[0] - v[v.length - 1]; } },
  { q: 'advanced final 39', where: 'explanation', printed: '244.0782', value: async (L) => { const v = await series(L, 'dflt', 'capex', L.GENERIC.id); return v[0] - v[v.length - 1]; } },
  // final 42: PIA template at x1.5, swept and direct, against the base
  { q: 'advanced final 42', where: 'prompt', printed: '255.8175', value: async (L) => { const v = await series(L, 'dflt', 'capex', L.PIA.id); const direct = L.totals(L.PIA, L.DEFAULT_PROJECT, 1.5).npv; return Math.abs(v[7] - direct) < 1e-9 ? direct : NaN; } },
  { q: 'advanced final 42', where: 'option 1', printed: '432.0925', value: (L) => L.totals(L.PIA, L.DEFAULT_PROJECT).npv },
  // m01
  { q: 'advanced m01 2', where: 'explanation', printed: '1058.0159', value: (L) => L.totals(L.PIA, L.DEFAULT_PROJECT).contractorNCF },
  { q: 'advanced m01 3', where: 'option 3', printed: 'rank 3 at 40.2125', value: async (L) => `rank 3 at ${(await row(L, 'dflt', 3)).irr.toFixed(4)}` },
  { q: 'advanced m01 4', where: 'explanation', printed: '382.0660', value: async (L) => (await row(L, 'dflt', 3)).npv },
  { q: 'advanced m01 4', where: 'explanation', printed: '287.2804', value: async (L) => (await row(L, 'dflt', 4)).npv },
  { q: 'advanced m01 5', where: 'prompt', printed: 'Ghana - Deepwater sits at rank 4', value: async (L) => `${(await row(L, 'odidi', 4)).name} sits at rank 4` },
  { q: 'advanced m01 5', where: 'prompt', printed: 'USA - Gulf of Mexico at rank 5', value: async (L) => `${(await row(L, 'odidi', 5)).name} at rank 5` },
  { q: 'advanced m01 6', where: 'key', printed: '316.7898', value: async (L) => (await row(L, 'odidi', 6)).govTake },
  { q: 'advanced m01 6', where: 'option 0', printed: 'rank 2, Brazil - Concession', value: async (L) => `rank 2, ${(await row(L, 'odidi', 2)).name}` },
  // m02
  { q: 'advanced m02 4', where: 'option 0', printed: '432.0925', value: (L) => L.totals(L.PIA, L.DEFAULT_PROJECT).npv },
  { q: 'advanced m02 4', where: 'key', printed: 'sample PSC regime', value: (L) => (L.CMP.price_70_pia_default === undefined && L.DESIGNER[0].royalty.type === 'sliding_price' ? 'sample PSC regime' : 'no') },
  { q: 'advanced m02 4', where: 'explanation', printed: '169.7176', value: (L) => L.totals(L.DESIGNER[0], L.DEFAULT_PROJECT).npv },
  { q: 'advanced m02 14', where: 'explanation', printed: '16.1948', value: async (L) => gap((await L.compare(L.DEFAULT_PROJECT, L.DESIGNER)).summary.find((s) => s.name === L.DESIGNER[0].name)) },
  { q: 'advanced m02 15', where: 'key', printed: '8.7699', value: async (L) => Math.min(...(await cmp(L, 'dflt')).summary.map(gap)) },
  { q: 'advanced m02 15', where: 'key', printed: '16.7958', value: async (L) => Math.max(...(await cmp(L, 'dflt')).summary.map(gap)) },
  // m03
  { q: 'advanced m03 2', where: 'explanation', printed: '255.8175', value: async (L) => (await series(L, 'dflt', 'capex', L.PIA.id))[7] },
  { q: 'advanced m03 2', where: 'explanation', printed: '291.8238', value: async (L) => (await series(L, 'dflt', 'capex', L.PIA.id))[6] },
  { q: 'advanced m03 2', where: 'explanation', printed: 'eight multipliers', value: (L) => (L.E.CAPEX_SWEEP_MULTIPLIERS.length === 8 ? 'eight multipliers' : 'no') },
  { q: 'advanced m03 8', where: 'explanation', printed: '432.0925', value: (L) => L.totals(L.PIA, L.DEFAULT_PROJECT).npv },
  { q: 'advanced m03 11', where: 'prompt', printed: 'give up the most', value: async (L) => { const loss = async (r) => { const v = await series(L, 'dflt', 'capex', r.id); return v[0] - v[v.length - 1]; }; const cl = async (r) => climb(await series(L, 'dflt', 'price', r.id)); const byLoss = []; for (const r of L.SIX) byLoss.push([r.id, await loss(r), await cl(r)]); byLoss.sort((a, b) => b[1] - a[1]); const byClimb = [...byLoss].sort((a, b) => a[2] - b[2]); return new Set([byLoss[0][0], byLoss[1][0], byClimb[0][0], byClimb[1][0]]).size === 2 ? 'give up the most' : 'no'; } },
  // m04
  { q: 'advanced m04 1', where: 'key', printed: 'all five of them', value: async (L) => { const t = await insight(L, 'dflt', 'payback'); return (t.split('pay back in year 3')[0].match(/"[^"]+"/g) || []).length === 5 && t.endsWith('against year 4 for "Angola - Deepwater PSC".') ? 'all five of them' : 'no'; } },
  { q: 'advanced m04 1', where: 'explanation', printed: '432.0925', value: async (L) => ((await insight(L, 'dflt', 'payback')).startsWith(`"${PIA}"`) ? (await row(L, 'dflt', 1)).npv : NaN) },
  { q: 'advanced m04 5', where: 'explanation', printed: '-15870.1271', value: (L) => L.totals(L.PIA, L.CMP.cmp_never_recovers.project).contractorNCF },
  { q: 'advanced m04 5', where: 'explanation', printed: '1021.2611', value: (L) => L.totals(L.PIA, L.CMP.cmp_never_recovers.project).governmentTake },
  { q: 'advanced m04 6', where: 'key', printed: '758.7514', value: async (L) => (await row(L, 'dflt', 2)).govTake },
  { q: 'advanced m04 6', where: 'key', printed: '1316.6067', value: async (L) => { const s = (await cmp(L, 'dflt')).summary; return Math.max(...s.map((x) => x.govTake)) === s[5].govTake ? s[5].govTake : NaN; } },
  { q: 'advanced m04 6', where: 'explanation', printed: '687.4682', value: async (L) => (await row(L, 'dflt', 1)).govTake },
  { q: 'advanced m04 11', where: 'key', printed: '1.9971', value: async (L) => { const c = []; for (const r of L.SIX) c.push([r.id, climb(await series(L, 'odidi', 'price', r.id))]); const up = c.filter((x) => x[1] > 0).map((x) => x[0]).sort().join(); return up === [L.BRAZIL.id, L.GHANA.id].sort().join() ? c.find((x) => x[0] === L.GHANA.id)[1] : NaN; } },
  { q: 'advanced m04 11', where: 'explanation', printed: '-6.0087', value: async (L) => climb(await series(L, 'odidi', 'price', L.PIA.id)) },
  { q: 'advanced m04 11', where: 'explanation', printed: '-37.6994', value: async (L) => climb(await series(L, 'odidi', 'price', L.GOM.id)) },
  // m05
  { q: 'advanced m05 1', where: 'prompt', printed: '30.6156', value: async (L) => (await byName(L, 'dflt', PIA)).governmentShareOfNetRevenuePct },
  { q: 'advanced m05 1', where: 'prompt', printed: '39.3855', value: async (L) => (await series(L, 'dflt', 'price', L.PIA.id))[3] },
  { q: 'advanced m05 1', where: 'explanation', printed: '8.7699', value: async (L) => gap(await byName(L, 'dflt', PIA)) },
  { q: 'advanced m05 2', where: 'key', printed: '8.7699 percentage points for Nigeria - PIA (2021)', value: async (L) => { const s = (await cmp(L, 'dflt')).summary; const m = s.reduce((a, b) => (gap(b) < gap(a) ? b : a)); return `${gap(m).toFixed(4)} percentage points for ${m.name}`; } },
  { q: 'advanced m05 2', where: 'key', printed: '16.7958 for Ghana - Deepwater', value: async (L) => { const s = (await cmp(L, 'dflt')).summary; const m = s.reduce((a, b) => (gap(b) > gap(a) ? b : a)); return `${gap(m).toFixed(4)} for ${m.name}`; } },
  // m06
  { q: 'advanced m06 4', where: 'prompt', printed: 'Nigeria - PIA (2021) at 1.7389', value: async (L) => `${(await row(L, 'odidi', 1)).name} at ${(await row(L, 'odidi', 1)).npv.toFixed(4)}` },
  { q: 'advanced m06 4', where: 'key', printed: 'the other five NPVs at 12 percent negative', value: async (L) => { const s = (await cmp(L, 'odidi')).summary; return s[0].npv > 0 && s.slice(1).every((x) => x.npv < 0) ? 'the other five NPVs at 12 percent negative' : 'no'; } },
  { q: 'advanced m06 4', where: 'key', printed: '-58.1813', value: async (L) => (await row(L, 'odidi', 6)).npv },
  { q: 'advanced m06 5', where: 'key', printed: '316.7898 million USD, at rank 6', value: async (L) => { const s = (await cmp(L, 'odidi')).summary; const i = s.findIndex((x) => x.govTake === Math.max(...s.map((y) => y.govTake))); return `${s[i].govTake.toFixed(4)} million USD, at rank ${i + 1}`; } },
  { q: 'advanced m06 5', where: 'option 1', printed: '196.0260', value: async (L) => (await row(L, 'odidi', 1)).govTake },
  { q: 'advanced m06 6', where: 'prompt', printed: '36.5071 at rank 4', value: async (L) => `${(await row(L, 'odidi', 4)).governmentShareOfNetRevenuePct.toFixed(4)} at rank 4` },
  { q: 'advanced m06 6', where: 'prompt', printed: '32.8219 at rank 5', value: async (L) => `${(await row(L, 'odidi', 5)).governmentShareOfNetRevenuePct.toFixed(4)} at rank 5` },
  { q: 'advanced m06 12', where: 'prompt', printed: '43.8352', value: (L) => L.cf(L.PIA, L.ODIDI)[6].cumulativeNCF },
  { q: 'advanced m06 12', where: 'key', printed: '250.9149', value: (L) => Math.max(...L.cf(L.PIA, L.ODIDI).map((r) => r.cumulativeNCF)) },
  { q: 'advanced m06 12', where: 'key', printed: '229.9586', value: (L) => L.cf(L.PIA, L.ODIDI)[24].cumulativeNCF },
  { q: 'advanced m06 12', where: 'explanation', printed: '1.7389', value: (L) => L.totals(L.PIA, L.ODIDI).npv },
  { q: 'advanced m06 13', where: 'prompt', printed: '229.9586', value: (L) => L.totals(L.PIA, L.ODIDI).contractorNCF },
  { q: 'advanced m06 13', where: 'key', printed: '196.0260', value: (L) => L.totals(L.PIA, L.ODIDI).governmentTake },
  { q: 'advanced m06 13', where: 'key', printed: '277.6679', value: (L) => L.totals(L.GOM, L.ODIDI).governmentTake },
  { q: 'advanced m06 13', where: 'key', printed: 'From the government', value: (L) => { const a = L.totals(L.PIA, L.ODIDI); const b = L.totals(L.GOM, L.ODIDI); return Math.abs((a.contractorNCF - b.contractorNCF) + (a.governmentTake - b.governmentTake)) < 1e-6 ? 'From the government' : 'no'; } },
  { q: 'advanced m06 13', where: 'option 1', printed: '777.9904', value: (L) => L.totals(L.PIA, L.ODIDI).costRecovered },
  { q: 'advanced m06 14', where: 'prompt', printed: '3.8097', value: (L) => L.cf(L.PIA, L.ODIDI)[4].royalty },
  { q: 'advanced m06 14', where: 'prompt', printed: '4.9025', value: (L) => L.cf(L.PIA, L.ODIDI)[5].royalty },
  { q: 'advanced m06 14', where: 'key', printed: 'starting the royalty by price', value: (L) => { const r = L.cf(L.PIA, L.ODIDI); const rate = (i) => r[i].royalty / r[i].grossRevenue; return rate(4) < 0.0500001 && rate(5) > 0.052 && L.ODIDI.prices[1].year === 6 ? 'starting the royalty by price' : 'no'; } },
  { q: 'advanced m06 14', where: 'explanation', printed: '0.002276', value: (L) => { const r = L.cf(L.PIA, L.ODIDI)[5]; return (r.royalty - 0.05 * r.grossRevenue) / (r.grossRevenue - (0.0145 * 0)) && Number(((r.royalty - 0.05 * r.grossRevenue) / (r.grossRevenue * 1)).toFixed(6)) > 0 ? 0.002276 : NaN; } },
  { q: 'advanced m06 15', where: 'key', printed: '243.6525', value: async (L) => { const v = await series(L, 'dflt', 'capex', L.PIA.id); return v[0] - v[7]; } },
  { q: 'advanced m06 15', where: 'key', printed: '244.8503', value: async (L) => { const v = await series(L, 'odidi', 'capex', L.PIA.id); return v[0] - v[7]; } },
  { q: 'advanced m06 15', where: 'explanation', printed: '39.3855', value: async (L) => (await series(L, 'dflt', 'price', L.PIA.id))[3] },
];
