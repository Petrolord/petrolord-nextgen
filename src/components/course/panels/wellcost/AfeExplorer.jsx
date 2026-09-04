import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ReferenceLine, Cell,
} from 'recharts';
import {
  COST_BASES, COST_CATEGORIES, CONTINGENCY_FRAC, NOMINAL_USD,
  publishedAfe, publishedAfeItems, publishedAfeSplit, publishedTotals,
  basisSlipSweep, deepeningSweep, contingencySweep, searchContingencyCrossing, largestItem,
} from './wellCostLab';
import { PanelShell, NumField, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// AFE explorer, the Professional tier. The published estimate line by line, the
// three bases put through a schedule slip and its mirror, the two
// classifications every line carries at once, and the provision that competes
// with the contracted lines it is meant to cover.
//
// Every amount below is the engine's own roll-up, read through the lab.

const fmt = (v, d = 4) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : '-');

const usd = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })
  : '-');

const pct = (v, d = 3) => (Number.isFinite(v) ? `${fmt(v * 100, d)} %` : '-');

const MODES = [
  ['lines', 'The published AFE, line by line'],
  ['bases', 'The three bases against a slip'],
  ['split', 'Tangible against intangible'],
  ['contingency', 'The provision and where it ranks'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;

const BASIS_TEXT = {
  'per-day': 'text-[#BFFF00]',
  'per-meter': 'text-[#38bdf8]',
  lump: 'text-[#f472b6]',
};

const BASIS_MEANING = {
  'per-day': 'rate times elapsed days',
  'per-meter': 'rate times drilled metres',
  lump: 'a price, agreed once',
};

const Lines = () => {
  const afe = useMemo(() => {
    try { return publishedAfe(); } catch { return null; }
  }, []);
  const totals = useMemo(() => {
    try { return publishedTotals(); } catch { return null; }
  }, []);
  if (!afe || !afe.byItem.length || !totals) {
    return <Note>There is no AFE to read. Every line needs a basis the engine knows and a category from the two it accepts, and a line missing either one is refused rather than quietly counted as nothing.</Note>;
  }
  const byBasis = COST_BASES.map((basis) => ({
    basis,
    count: afe.byItem.filter((r) => r.basis === basis).length,
    amountUsd: afe.byItem.filter((r) => r.basis === basis).reduce((s, r) => s + r.amountUsd, 0),
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Lines on the estimate" value={fmt(afe.byItem.length, 0)} />
        <Tile label="Base subtotal" value={usd(afe.baseUsd)} unit="USD" />
        <Tile label="Contingency at the published fraction" value={usd(afe.contingencyUsd)} unit="USD" />
        <Tile label="Total for approval" value={usd(afe.totalUsd)} unit="USD" />
        <Tile label="Elapsed days the per-day lines multiply" value={fmt(totals.totalDays, 4)} unit="days" />
        <Tile label="Drilled metres the per-meter lines multiply" value={fmt(totals.drilledM, 3)} unit="m" />
        <Tile label="Bases the engine accepts" value={COST_BASES.join(', ')} />
        <Tile label="Categories the engine accepts" value={COST_CATEGORIES.join(', ')} />
      </TileGrid>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={afe.byItem} margin={{ top: 10, right: 16, bottom: 40, left: 10 }}>
            {GRID}
            <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 9 }} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={AXIS}
              label={{ value: 'USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Bar dataKey="amountUsd" name="amount" isAnimationActive={false}>
              {afe.byItem.map((r) => (
                <Cell key={r.id} fill={r.basis === 'per-day' ? '#BFFF00' : r.basis === 'per-meter' ? '#38bdf8' : '#f472b6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">line</th>
              <th className="text-left pr-3">basis</th>
              <th className="text-left pr-3">what it multiplies</th>
              <th className="text-left pr-3">category</th>
              <th className="text-left">amount, USD</th>
            </tr>
          </thead>
          <tbody>
            {afe.byItem.map((r) => (
              <tr key={r.id}>
                <td className="pr-3">{r.label}</td>
                <td className={`pr-3 ${BASIS_TEXT[r.basis] || ''}`}>{r.basis}</td>
                <td className="pr-3 text-slate-400">{BASIS_MEANING[r.basis] || '-'}</td>
                <td className="pr-3">{r.category}</td>
                <td>{usd(r.amountUsd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">basis</th>
              <th className="text-left pr-3">lines</th>
              <th className="text-left pr-3">money on that basis, USD</th>
              <th className="text-left">share of the base</th>
            </tr>
          </thead>
          <tbody>
            {byBasis.map((r) => (
              <tr key={r.basis}>
                <td className={`pr-3 ${BASIS_TEXT[r.basis] || ''}`}>{r.basis}</td>
                <td className="pr-3">{fmt(r.count, 0)}</td>
                <td className="pr-3">{usd(r.amountUsd)}</td>
                <td>{pct(r.amountUsd / afe.baseUsd, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Every line carries two labels at once and they answer different questions. The BASIS says
        what the money is multiplied by, which is where the risk lives:
        {' '}{pct(byBasis[0].amountUsd / afe.baseUsd, 2)} of this base is on day rates and moves
        with the schedule. The CATEGORY says what happens to the money afterwards, which is where
        the accounting lives. Nothing on this estimate is priced by both a day and a metre, and
        nothing is categorised by its basis.
      </div>
      <Note>
        An AFE is a structure and not a number. Two estimates with the same total can be completely
        different bets: one held mostly on lump sums that were negotiated before spud, another held
        mostly on day rates that keep running while the well takes longer than planned. The total
        is the last thing to look at.
      </Note>
    </>
  );
};

const Bases = () => {
  const [slip, setSlip] = useState('');
  const slips = useMemo(() => {
    const v = Number(slip);
    const base = [0.9, 1, 1.25, 1.5, 2];
    const set = Number.isFinite(v) && v > 0 ? base.concat(v) : base;
    return [...new Set(set)].sort((a, b) => a - b);
  }, [slip]);
  const rows = useMemo(() => {
    try { return basisSlipSweep(slips); } catch { return null; }
  }, [slips]);
  const deeper = useMemo(() => {
    try { return deepeningSweep(); } catch { return null; }
  }, []);
  if (!rows || !rows.length || !deeper || !deeper.length) {
    return <Note>A slip has to be a positive multiplier on the elapsed schedule, and a slip below the no-allowance floor is refused because it would ask for negative non-productive time. Try a figure above the floor.</Note>;
  }
  const base = rows.find((r) => r.slipFactor === 1) || rows[0];
  const worst = rows[rows.length - 1];
  const lumps = new Set(rows.map((r) => r.lumpUsd));
  const meters = new Set(rows.map((r) => r.perMeterUsd));
  const deepDays = new Set(deeper.map((r) => r.totalDays));
  const deepPerDay = new Set(deeper.map((r) => r.perDayUsd));
  return (
    <>
      <FieldGrid>
        <NumField label="Add a slip factor of your own" value={slip} onChange={setSlip} placeholder="1.75" />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Nominal spend on each line" value={usd(NOMINAL_USD)} unit="USD" />
          <Tile label="Per-day line at the worst slip" value={usd(worst.perDayUsd)} unit="USD" />
          <Tile label="Per-meter line there" value={usd(worst.perMeterUsd)} unit="USD" />
          <Tile label="Lump there" value={usd(worst.lumpUsd)} unit="USD" />
          <Tile label="Distinct per-meter values across the sweep" value={fmt(meters.size, 0)} />
          <Tile label="Distinct lump values across the sweep" value={fmt(lumps.size, 0)} />
          <Tile label="Days at the base schedule" value={fmt(base.totalDays, 4)} unit="days" />
          <Tile label="Metres, every slip" value={fmt(base.drilledM, 3)} unit="m" />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 20 }}>
            {GRID}
            <XAxis dataKey="slipFactor" type="number" tick={AXIS}
              label={{ value: 'schedule slip, multiplier on elapsed time', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} tickFormatter={(v) => usd(v)}
              label={{ value: 'USD on the line', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={1} stroke="#94a3b8" strokeDasharray="4 3"
              label={{ value: 'the plan', fill: '#94a3b8', fontSize: 10, position: 'top' }} />
            <Line type="linear" dataKey="perDayUsd" name="per-day line" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="linear" dataKey="perMeterUsd" name="per-meter line" stroke="#38bdf8" dot isAnimationActive={false} />
            <Line type="linear" dataKey="lumpUsd" name="lump" stroke="#f472b6" strokeDasharray="5 3" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">slip</th>
              <th className="text-left pr-3">days</th>
              <th className="text-left pr-3">metres</th>
              <th className="text-left pr-3">per-day, USD</th>
              <th className="text-left pr-3">per-meter, USD</th>
              <th className="text-left pr-3">lump, USD</th>
              <th className="text-left">the three together, USD</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slipFactor} className={r.slipFactor === 1 ? 'text-white' : ''}>
                <td className="pr-3">{fmt(r.slipFactor, 4)}</td>
                <td className="pr-3">{fmt(r.totalDays, 4)}</td>
                <td className="pr-3">{fmt(r.drilledM, 3)}</td>
                <td className="pr-3 text-[#BFFF00]">{usd(r.perDayUsd)}</td>
                <td className="pr-3 text-[#38bdf8]">{usd(r.perMeterUsd)}</td>
                <td className="pr-3 text-[#f472b6]">{usd(r.lumpUsd)}</td>
                <td>{usd(r.baseUsd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Three lines that cost exactly the same {usd(NOMINAL_USD)} USD on the plan, and only one of
        them moves. The per-day line tracks the slip one for one because it buys TIME. The
        per-meter line has {fmt(meters.size, 0)} distinct value across the whole sweep and the lump
        has {fmt(lumps.size, 0)}, because a slip adds days and no metres, and a price agreed once
        is a price. So the exposure of an estimate to schedule risk is not its size, it is the
        share of it sitting on day rates.
      </div>
      <div className="mt-4 text-xs text-slate-400 font-medium">The mirror: metres at a fixed schedule</div>
      <div className="mt-2 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">extra hole, m</th>
              <th className="text-left pr-3">rate that keeps the clock still, m/hr</th>
              <th className="text-left pr-3">days</th>
              <th className="text-left pr-3">metres</th>
              <th className="text-left pr-3">per-day, USD</th>
              <th className="text-left pr-3">per-meter, USD</th>
              <th className="text-left">lump, USD</th>
            </tr>
          </thead>
          <tbody>
            {deeper.map((r) => (
              <tr key={r.extraM}>
                <td className="pr-3">{fmt(r.extraM, 3)}</td>
                <td className="pr-3">{fmt(r.ropMPerHr, 4)}</td>
                <td className="pr-3">{fmt(r.totalDays, 4)}</td>
                <td className="pr-3">{fmt(r.drilledM, 3)}</td>
                <td className="pr-3 text-[#BFFF00]">{usd(r.perDayUsd)}</td>
                <td className="pr-3 text-[#38bdf8]">{usd(r.perMeterUsd)}</td>
                <td className="text-[#f472b6]">{usd(r.lumpUsd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The same three lines, deepened instead of delayed. The last drill activity is extended and
        its rate raised by exactly enough to keep its hours where they were, so the clock stands
        still at {fmt(deeper[0].totalDays, 4)} days across every row, with
        {' '}{fmt(deepDays.size, 0)} distinct day count and {fmt(deepPerDay.size, 0)} distinct
        per-day amount. Now the BLUE line is the one that moves, and the green one does not. Each
        basis is exposed to its own quantity and is deaf to the other.
      </div>
      <Note>
        This is a controlled experiment rather than a redesign: the trip and the casing run below
        the deepened section keep the depths the published programme gave them, so the sweep
        isolates footage and changes nothing else. A real deepening buys metres AND hours, and then
        both lines move together, which is why the two sweeps belong side by side.
      </Note>
    </>
  );
};

const Split = () => {
  const split = useMemo(() => {
    try { return publishedAfeSplit(); } catch { return null; }
  }, []);
  const items = useMemo(() => {
    try { return publishedAfeItems(); } catch { return null; }
  }, []);
  if (!split || !items || !items.length) {
    return <Note>The split needs every line to carry one of the two categories. A line the engine cannot categorise is refused outright, because a subtotal that silently dropped a line would still add up.</Note>;
  }
  const sorted = [...items].sort((a, b) => b.amountUsd - a.amountUsd);
  let cum = 0;
  const ranked = sorted.map((r, i) => {
    cum += r.amountUsd;
    return { ...r, rank: i + 1, cumUsd: cum, cumFrac: cum / split.baseUsd };
  });
  const twoThirds = ranked.find((r) => r.cumFrac >= 2 / 3);
  const bars = COST_CATEGORIES.map((category) => ({
    category,
    amountUsd: items.filter((r) => r.category === category).reduce((s, r) => s + r.amountUsd, 0),
  }));
  return (
    <>
      <TileGrid>
        <Tile label="Tangible" value={usd(split.tangibleUsd)} unit="USD" />
        <Tile label="Intangible" value={usd(split.intangibleUsd)} unit="USD" />
        <Tile label="The two together" value={usd(split.tangibleUsd + split.intangibleUsd)} unit="USD" />
        <Tile label="Base subtotal" value={usd(split.baseUsd)} unit="USD" />
        <Tile label="Tangible share" value={pct(split.tangibleFrac, 2)} />
        <Tile label="Intangible share" value={pct(1 - split.tangibleFrac, 2)} />
        <Tile label="Lines above two thirds of the base"
          value={twoThirds ? fmt(twoThirds.rank, 0) : '-'} />
        <Tile label="Largest single line" value={usd(ranked[0].amountUsd)} unit="USD" />
      </TileGrid>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="category" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={(v) => usd(v)} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <ReferenceLine y={split.baseUsd} stroke="#f472b6"
              label={{ value: 'the base subtotal', fill: '#f472b6', fontSize: 10, position: 'top' }} />
            <Bar dataKey="amountUsd" name="USD" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">rank</th>
              <th className="text-left pr-3">line</th>
              <th className="text-left pr-3">basis</th>
              <th className="text-left pr-3">category</th>
              <th className="text-left pr-3">amount, USD</th>
              <th className="text-left pr-3">running total, USD</th>
              <th className="text-left">share of the base so far</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r) => (
              <tr key={r.id} className={twoThirds && r.rank === twoThirds.rank ? 'text-white' : ''}>
                <td className="pr-3">{fmt(r.rank, 0)}</td>
                <td className="pr-3">{r.label}</td>
                <td className={`pr-3 ${BASIS_TEXT[r.basis] || ''}`}>{r.basis}</td>
                <td className="pr-3">{r.category}</td>
                <td className="pr-3">{usd(r.amountUsd)}</td>
                <td className="pr-3">{usd(r.cumUsd)}</td>
                <td>{pct(r.cumFrac, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Sorted, the estimate says something the alphabetical list cannot. The top
        {' '}{twoThirds ? fmt(twoThirds.rank, 0) : '-'} lines carry more than two thirds of the
        base, and their bases are the thing to read next: this well is held up by day rates, so its
        exposure is to time. The tangible column is {pct(split.tangibleFrac, 2)} of the base, which
        is the ordinary shape of an offshore estimate, because the steel that stays in the ground is
        a small part of what it costs to put it there.
      </div>
      <Note>
        The split is an accounting classification and not a quality judgement. Intangible money is
        not wasted money: it is the rig, the crews and the services that make the hole, and a well
        with a higher tangible fraction is not a better well. Moving one line from one category to
        the other shifts both subtotals and leaves the approval figure untouched, which is the
        clearest proof that the split answers a different question from the total.
      </Note>
    </>
  );
};

const Contingency = () => {
  const [frac, setFrac] = useState(String(CONTINGENCY_FRAC));
  const chosen = Number(frac);
  const rows = useMemo(() => {
    try {
      const base = [0, 0.05, 0.1, 0.2, 0.3, 0.35, 0.5];
      const set = Number.isFinite(chosen) && chosen >= 0 ? base.concat(chosen) : base;
      return contingencySweep([...new Set(set)].sort((a, b) => a - b));
    } catch { return null; }
  }, [chosen]);
  const at = useMemo(() => {
    try {
      if (!Number.isFinite(chosen) || chosen < 0) return null;
      return contingencySweep([chosen])[0];
    } catch { return null; }
  }, [chosen]);
  const crossing = useMemo(() => {
    try { return searchContingencyCrossing(); } catch { return null; }
  }, []);
  const items = useMemo(() => {
    try { return publishedAfeItems(); } catch { return null; }
  }, []);
  const biggest = useMemo(() => {
    try { return largestItem(); } catch { return null; }
  }, []);
  if (!rows || !rows.length || !at || !crossing || !items || !biggest) {
    return <Note>A contingency fraction is nought or more, on a base the engine has already rolled up. Type a fraction rather than a percentage: 0.1 is ten per cent, and 10 is a thousand.</Note>;
  }
  const merged = [...items.map((r) => ({ key: r.id, label: r.label, amountUsd: r.amountUsd, provision: false })),
    { key: 'contingency', label: `Contingency at ${fmt(chosen, 5)}`, amountUsd: at.contingencyUsd, provision: true }]
    .sort((a, b) => b.amountUsd - a.amountUsd);
  return (
    <>
      <FieldGrid>
        <NumField label="Contingency fraction of the base" value={frac} onChange={setFrac} placeholder="0.1" />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Base subtotal, every fraction" value={usd(at.baseUsd)} unit="USD" />
          <Tile label="Provision at this fraction" value={usd(at.contingencyUsd)} unit="USD" />
          <Tile label="Total for approval" value={usd(at.totalUsd)} unit="USD" />
          <Tile label="Share of the TOTAL, not the base" value={pct(at.contingencyUsd / at.totalUsd, 3)} />
          <Tile label="Rank among the line items" value={fmt(at.rank, 0)} />
          <Tile label="Largest contracted line" value={usd(at.largestItemUsd)} unit="USD" />
          <Tile label="Does the provision outrank it" value={at.outranksLargestItem ? 'yes' : 'no'} />
          <Tile label="Fraction where it does" value={fmt(crossing.frac, 6)} />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 18, left: 20 }}>
            {GRID}
            <XAxis dataKey="contingencyFrac" type="number" tick={AXIS}
              label={{ value: 'contingency fraction of the base', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} tickFormatter={(v) => usd(v)}
              label={{ value: 'USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={biggest.amountUsd} stroke="#f472b6" strokeDasharray="5 3"
              label={{ value: 'the largest contracted line', fill: '#f472b6', fontSize: 10, position: 'insideTopLeft' }} />
            <ReferenceLine x={crossing.frac} stroke="#f472b6"
              label={{ value: 'the crossing', fill: '#f472b6', fontSize: 10, position: 'top' }} />
            <Line type="linear" dataKey="contingencyUsd" name="the provision" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="linear" dataKey="baseUsd" name="base subtotal" stroke="#38bdf8" strokeDasharray="4 3" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">fraction</th>
              <th className="text-left pr-3">base, USD</th>
              <th className="text-left pr-3">provision, USD</th>
              <th className="text-left pr-3">total, USD</th>
              <th className="text-left pr-3">share of total</th>
              <th className="text-left pr-3">rank</th>
              <th className="text-left">bigger than the largest line</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.contingencyFrac} className={r.contingencyFrac === chosen ? 'text-white' : ''}>
                <td className="pr-3">{fmt(r.contingencyFrac, 6)}</td>
                <td className="pr-3">{usd(r.baseUsd)}</td>
                <td className="pr-3 text-[#BFFF00]">{usd(r.contingencyUsd)}</td>
                <td className="pr-3">{usd(r.totalUsd)}</td>
                <td className="pr-3">{pct(r.contingencyUsd / r.totalUsd, 3)}</td>
                <td className="pr-3">{fmt(r.rank, 0)}</td>
                <td className={r.outranksLargestItem ? 'text-[#f472b6]' : 'text-slate-400'}>
                  {r.outranksLargestItem ? 'yes' : 'no'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-xs text-slate-400 font-medium">
        The sorted estimate with the provision in its place, at {fmt(chosen, 5)}
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="text-xs text-slate-300 w-full">
          <thead className="text-slate-500">
            <tr>
              <th className="text-left pr-3">place</th>
              <th className="text-left pr-3">line</th>
              <th className="text-left">amount, USD</th>
            </tr>
          </thead>
          <tbody>
            {merged.map((r, i) => (
              <tr key={r.key} className={r.provision ? 'text-[#BFFF00]' : ''}>
                <td className="pr-3">{fmt(i + 1, 0)}</td>
                <td className="pr-3">{r.provision ? `${r.label}, a provision` : r.label}</td>
                <td>{usd(r.amountUsd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Raise the fraction and watch the green row climb the table. At the published
        {' '}{fmt(CONTINGENCY_FRAC, 5)} the provision is already the number
        {' '}{fmt(contingencySweep([CONTINGENCY_FRAC])[0].rank, 0)} line on this estimate, ahead of
        the casing, the completion services and the mud. At {fmt(crossing.frac, 6)} it passes
        {' '}{biggest.label} at {usd(crossing.largestItemUsd)} USD and becomes the single biggest
        number in the whole estimate. That fraction was found by bisection on the engine's own
        roll-up, and it agrees with the closed form, the largest line over the base, to
        {' '}{fmt(Math.abs(crossing.frac - crossing.closedForm), 12)}.
      </div>
      <Note>
        Two things to carry away. The base subtotal never moves, because contingency is a fraction
        OF it and is kept as its own line. And a fraction of the base is not a share of the total:
        at {fmt(CONTINGENCY_FRAC, 5)} the provision is {pct(at.contingencyUsd / at.totalUsd, 3)} of
        the money being approved rather than a tenth of it. A provision large enough to outrank the
        rig is not a rounding allowance. It is the biggest line on the page, and it belongs in the
        conversation instead of in a footnote.
      </Note>
    </>
  );
};

const AfeExplorer = () => {
  const [mode, setMode] = useState('lines');
  return (
    <PanelShell
      title="AFE explorer"
      subtitle="The published estimate line by line, the three bases against a slip and its mirror, the two classifications, and where the provision ranks"
    >
      <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      <div className="mt-3">
        {mode === 'lines' && <Lines />}
        {mode === 'bases' && <Bases />}
        {mode === 'split' && <Split />}
        {mode === 'contingency' && <Contingency />}
      </div>
    </PanelShell>
  );
};

export default AfeExplorer;
