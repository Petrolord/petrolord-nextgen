import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, BarChart, Bar, Line, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  AKATA_LABEL, AKATA_YEARS, ENGINE_VERSION,
  akataLedger, akataYearCascade, akataWorkingInterestSweep, akataTakeDecomposition,
  ingestionCases, refusals, volumeColumnTable,
  priceCases, deckResolverTable,
  jvAnalyticCase, jvLeverSweep,
  addingUpTable,
} from './cashflowLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Ledger explorer, the Associate tier. THE LEDGER: how rows become years, how
// prices and costs are applied, the joint venture cascade from gross revenue
// to net cash flow, working interest, cumulative cash flow, payback, totals,
// barrels of oil equivalent and take without any time value. This panel ends
// before a discount rate is mentioned.
//
// Every figure on this page is a return value from cashflowLab, which is a
// return value from the vendored cashflow engine. Nothing here computes a
// dollar or a barrel.

const usd = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  : 'null');
const num = (v, d = 2) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : 'null');
const pc = (v, d = 4) => (Number.isFinite(v) ? `${num(v, d)} percent` : 'null');
const yn = (b) => (b ? 'yes' : 'no');
const kv = (row) => Object.entries(row).map(([k, x]) => `${k}=${x}`).join('  ');

const MODES = [
  ['ledger', 'The ledger: one row per year, in cascade order'],
  ['rowsToYears', 'Rows to years, and the eight refusals'],
  ['prices', 'Prices: flat, escalated, decked'],
  ['cascade', 'The cascade: which lever moves which line'],
  ['addingUp', 'Adding up: cumulative, payback, totals, boe, take'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;
const compact = (v) => (Math.abs(v) >= 1e6 ? `${num(v / 1e6, 1)}M` : num(v, 0));

const Tbl = ({ head, rows, highlight = -1 }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={i} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={i === highlight ? 'text-white font-semibold' : ''}>
            {r.map((c, j) => <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Ledger = () => {
  const [year, setYear] = useState(String(AKATA_YEARS[2]));
  const led = useMemo(() => { try { return akataLedger(); } catch { return null; } }, []);
  const cas = useMemo(() => { try { return akataYearCascade(Number(year)); } catch { return null; } }, [year]);
  if (!led || !cas) {
    return <Note>The engine returned no ledger for the teaching field. A ledger needs at least one production row with a volume column and a price for every stream that has volume; without them the engine refuses the run rather than printing a row of zeros.</Note>;
  }
  const idx = led.rows.findIndex((r) => r.year === Number(year));
  const chart = led.rows.map((r) => ({ year: r.year, net: r.net_cash_flow, cumulative: r.cumulative_cash_flow }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Read one year" value={year} onChange={setYear} options={AKATA_YEARS.map((y) => [String(y), String(y)])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Total gross revenue" value={usd(led.kpis.total_revenue)} unit="USD" />
          <Tile label="Total capex" value={usd(led.kpis.total_capex)} unit="USD" />
          <Tile label="Total opex" value={usd(led.kpis.total_opex)} unit="USD" />
          <Tile label="Total tax" value={usd(led.kpis.total_tax)} unit="USD" />
          <Tile label="Total net cash flow, money of the day" value={usd(led.kpis.total_net_cash_flow_nominal)} unit="USD" />
          <Tile label="Total oil" value={num(led.kpis.total_oil_bbl, 0)} unit="bbl" />
          <Tile label="Total gas" value={num(led.kpis.total_gas_mscf, 0)} unit="Mscf" />
          <Tile label="Take, undiscounted" value={pc(led.kpis.government_take_pct)} />
        </TileGrid>
      </div>
      <Tbl
        highlight={idx}
        head={['year', 'oil, bbl', 'gas, Mscf', 'oil price, USD/bbl', 'gross revenue', 'royalty', 'opex', 'capex', 'depreciation', 'taxable income', 'tax', 'net cash flow', 'cumulative']}
        rows={led.rows.map((r) => [r.year, num(r.oil_bbl, 0), num(r.gas_mscf, 0), num(r.applied_oil_price, 6), usd(r.gross_revenue), usd(r.royalty), usd(r.opex), usd(r.capex), usd(r.depreciation), usd(r.taxable_income), usd(r.tax), usd(r.net_cash_flow), usd(r.cumulative_cash_flow)])}
      />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Bar dataKey="net" name="net cash flow, money of the day" isAnimationActive={false}>
              {chart.map((c) => <Cell key={c.year} fill={c.year === Number(year) ? '#BFFF00' : (c.net < 0 ? '#f87171' : '#38bdf8')} />)}
            </Bar>
            <Line type="monotone" dataKey="cumulative" name="cumulative cash flow" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 rounded-md border border-gray-700 bg-[#0F172A] p-3 text-xs text-slate-300">
        <span className="text-white font-semibold">{cas.year}, read as a sentence. </span>
        Oil {num(cas.oilBbl, 0)} bbl at {num(cas.oilPrice, 6)} USD per bbl and gas {num(cas.gasMscf, 0)} Mscf at
        {' '}{num(cas.gasPrice, 6)} USD per Mscf give gross revenue {usd(cas.grossRevenue)}. Royalty at
        {' '}{num(cas.royaltyPct, 2)} percent takes {usd(cas.royalty)}. Opex is {usd(cas.opex)} and depreciation
        {' '}{usd(cas.depreciation)}, so taxable income is {usd(cas.taxableIncome)}. Tax at {num(cas.taxPct, 2)} percent
        is {usd(cas.tax)}. Capex in the year is {usd(cas.capex)}. Net cash flow is {usd(cas.netCashFlow)}, and the
        cumulative cash flow at the end of the year stands at {usd(cas.cumulativeCashFlow)}.
      </div>
      <div className="mt-3 text-xs text-slate-300">
        The ledger is the whole subject. Every column to the right of gross revenue is subtracted from the one
        before it, in this order and no other, and the last column is a running sum of the one before it. Depreciation
        is the one entry that is not cash: it is the capex spread over ten years so that tax is charged on income
        rather than on receipts, which is why the first year shows {usd(led.rows[0].capex)} of capex leaving and only
        {' '}{usd(led.rows[0].depreciation)} of depreciation reducing the tax base.
      </div>
      <Note>
        This is the teaching field the course calls {AKATA_LABEL}: seven years, oil with
        associated gas, capex in the first two years, flat opex in money of the day that the escalator inflates,
        joint venture terms, engine {ENGINE_VERSION}. It is not a published golden and it is not graded anywhere.
      </Note>
    </>
  );
};

const RowsToYears = () => {
  const cases = useMemo(() => { try { return ingestionCases(); } catch { return null; } }, []);
  const refs = useMemo(() => { try { return refusals(); } catch { return null; } }, []);
  const cols = useMemo(() => { try { return volumeColumnTable(); } catch { return null; } }, []);
  const [name, setName] = useState('per_well_beats_total_rollup');
  if (!cases || !cases.length || !refs || !cols) {
    return <Note>The published ingestion cases did not run. The engine refuses an upload it cannot read rather than returning a zero ledger, and there is nothing to show for a refused case except the message, which is listed under the refusals.</Note>;
  }
  const c = cases.find((x) => x.name === name) || cases[0];
  return (
    <>
      <FieldGrid>
        <SelectField label="Published ingestion case" value={c.name} onChange={setName} options={cases.map((x) => [x.name, x.name])} />
      </FieldGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">{c.note}</p>
      <div className="grid gap-3 lg:grid-cols-2 mt-3">
        <div>
          <p className="text-xs text-slate-500 mb-1">Before: the rows as uploaded</p>
          <div className="rounded-md border border-gray-700 bg-[#0F172A] p-2 text-xs text-slate-300 font-mono whitespace-pre-wrap break-words">
            {c.prodRows.map((r, i) => <div key={`p${i}`}>prod: {kv(r)}</div>)}
            {c.capexRows.length ? c.capexRows.map((r, i) => <div key={`c${i}`}>capex: {kv(r)}</div>) : <div>capex: (none)</div>}
            {c.opexRows.length ? c.opexRows.map((r, i) => <div key={`o${i}`}>opex: {kv(r)}</div>) : <div>opex: (none)</div>}
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">After: the years the engine reads</p>
          <Tbl head={['year', 'oil, bbl', 'gas, Mscf', 'condensate, bbl', 'water, bbl']}
            rows={c.volumes.map((v) => [v.year, num(v.oil_bbl, 2), num(v.gas_mscf, 2), num(v.condensate_bbl, 2), num(v.water_bbl, 2)])} />
          <Tbl head={['year', 'capex, USD']} rows={c.capex.length ? c.capex.map((v) => [v.year, usd(v.usd)]) : [['(none)', '']]} />
          <Tbl head={['year', 'opex, USD']} rows={c.opex.length ? c.opex.map((v) => [v.year, usd(v.usd)]) : [['(none)', '']]} />
        </div>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Total revenue" value={usd(c.totalRevenue)} unit="USD" />
          <Tile label="Total capex" value={usd(c.totalCapex)} unit="USD" />
          <Tile label="Total opex" value={usd(c.totalOpex)} unit="USD" />
          <Tile label="Take" value={pc(c.takePct)} />
        </TileGrid>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Read the before and the after side by side. A per-well column beats a rollup column when both are present,
        month indexes 1 to 12 land in the base year and 13 to 24 in the next, a row with no preferred cost alias
        sums its *_usd parts with total_ prefixed columns excluded, and two aliases carrying the same value are
        accepted once. None of that is arithmetic a learner should redo by hand; it is a contract the engine keeps.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">Which column names count as volumes</p>
      <div className="flex flex-wrap gap-2">
        {cols.map((r) => (
          <span key={r.key} className={`text-xs px-2 py-0.5 rounded border ${r.isVolume ? 'border-emerald-700 text-emerald-300' : 'border-rose-800 text-rose-300'}`}>
            {r.key}: {yn(r.isVolume)}
          </span>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The eight uploads the engine REFUSES, with the message each one throws</p>
      <Tbl head={['refusal', 'message']} rows={refs.map((r) => [r.name, <span key={r.name} className="whitespace-normal">{r.message}</span>])} />
      <Note>
        A refusal is the engine's honest answer to an upload it cannot read. The alternative, a ledger full of
        zeros with an NPV attached, would look exactly like a real answer and would be wrong in every cell.
      </Note>
    </>
  );
};

const Prices = () => {
  const pcs = useMemo(() => { try { return priceCases(); } catch { return null; } }, []);
  const deck = useMemo(() => { try { return deckResolverTable(); } catch { return null; } }, []);
  const [name, setName] = useState('deck_step_hold');
  if (!pcs || !pcs.length || !deck) {
    return <Note>The published price cases did not run. A price is resolved per stream and per year, and a stream with volume and no price is one of the engine's refusals.</Note>;
  }
  const c = pcs.find((x) => x.name === name) || pcs[0];
  const showOpex = c.name === 'escalator_defaults_to_inflation';
  return (
    <>
      <FieldGrid>
        <SelectField label="Published price case" value={c.name} onChange={setName} options={pcs.map((x) => [x.name, x.name])} />
      </FieldGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">{c.note}</p>
      <Tbl
        head={showOpex ? ['year', 'applied oil price, USD/bbl', 'gross revenue, USD', 'opex, USD', 'capex, USD'] : ['year', 'applied oil price, USD/bbl', 'gross revenue, USD']}
        rows={c.byYear.map((q) => (showOpex
          ? [q.year, num(q.appliedOilPrice, 6), usd(q.grossRevenue), usd(q.opex), usd(q.capex)]
          : [q.year, num(q.appliedOilPrice, 6), usd(q.grossRevenue)]))}
      />
      <div className="mt-3 text-xs text-slate-300">
        A deck entry overrides the flat price and its escalator for its stream. Between entries the deck holds its
        step, before the first entry it takes the first value, and beyond the last entry the last value is escalated
        by the stream escalator. A differential is added AFTER the deck is resolved and a scale multiplies the
        resolved price. An unset escalator falls back to the inflation rate for prices and opex; the capex escalator
        stays at zero.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">
        The resolver on its own. Parsed oil deck of deck_step_hold: {deck.parsedOilDeck.map((d) => `${d.year} at ${d.value}`).join(', ')}.
        Gas deck entries {deck.gasDeckEntries}, condensate deck entries {deck.condensateDeckEntries}.
      </p>
      <Tbl
        head={['resolveStreamPrice', ...deck.lines[0].byYear.map((q) => String(q.year))]}
        rows={deck.lines.map((l) => [l.label, ...l.byYear.map((q) => num(q.price, 6))])}
      />
      <Note>
        The middle line is the one to stare at: with no deck, a flat 80 escalated at 10 percent from a 2030 base
        is DEFLATED for the years before the base, which is why 2028 and 2029 read below 80. The escalator is a
        rate anchored at the base year, not a markup that starts at the first row.
      </Note>
    </>
  );
};

const LEVER_FAMILIES = [
  ['all', 'all three levers'],
  ['jv_royalty_pct', 'royalty rate'],
  ['jv_tax_rate_pct', 'tax rate'],
  ['jv_working_interest_pct', 'working interest'],
];

const Cascade = () => {
  const base = useMemo(() => { try { return jvAnalyticCase(); } catch { return null; } }, []);
  const sweep = useMemo(() => { try { return jvLeverSweep(); } catch { return null; } }, []);
  const [family, setFamily] = useState('all');
  if (!base || !sweep || !sweep.length) {
    return <Note>The hand-derived JV case did not run, so there is no cascade to move a lever on.</Note>;
  }
  const rows = sweep.filter((r) => family === 'all' || r.key === family || r.key === 'as published');
  const bars = rows.map((r) => ({ name: r.key === 'as published' ? 'published' : `${r.key.replace('jv_', '').replace('_pct', '')} ${r.value}`, npv: r.npv, take: r.takePct }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Lever" value={family} onChange={setFamily} options={LEVER_FAMILIES} />
      </FieldGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The hand-derived two-year case: {num(base.prodRows[0].well1_oil_bbl, 0)} bbl a year at {num(base.cfg.oil_price_usd_bbl, 0)} USD,
        royalty {num(base.cfg.jv_royalty_pct, 0)} percent, tax {num(base.cfg.jv_tax_rate_pct, 0)} percent, working interest
        {' '}{num(base.cfg.jv_working_interest_pct, 0)} percent, capex {usd(base.capexRows[0].amount_usd)} in the first year.
      </p>
      <Tbl
        head={['year', 'gross revenue', 'royalty', 'opex', 'capex', 'depreciation', 'taxable income', 'tax', 'net cash flow', 'cumulative']}
        rows={base.rows.map((r) => [r.year, usd(r.gross_revenue), usd(r.royalty), usd(r.opex), usd(r.capex), usd(r.depreciation), usd(r.taxable_income), usd(r.tax), usd(r.net_cash_flow), usd(r.cumulative_cash_flow)])}
      />
      <p className="text-xs text-slate-500 mt-4 mb-1">The same two years with one lever moved on its own</p>
      <Tbl
        head={['lever', 'value', 'year 1 royalty', 'year 1 tax', 'year 1 net', 'year 2 net', 'NPV at 10 %', 'IRR, %', 'take, %']}
        rows={rows.map((r) => [r.key, r.value === null ? '' : num(r.value, 0), usd(r.year1Royalty), usd(r.year1Tax), usd(r.year1Net), usd(r.year2Net), usd(r.npv), r.irrPct === null ? 'null' : num(r.irrPct, 4), num(r.takePct, 4)])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 5, left: 20 }}>
            {GRID}
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'take, percent of pre-take value', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => num(v, 4)} />
            <ReferenceLine y={100} stroke="#f87171" strokeDasharray="5 3" label={{ value: 'take of 100 percent', fill: '#f87171', fontSize: 10, position: 'insideTopRight' }} />
            <Bar dataKey="take" name="take, percent" isAnimationActive={false}>
              {bars.map((b) => <Cell key={b.name} fill={b.take > 100 ? '#f87171' : '#BFFF00'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Three levers, three different lines. ROYALTY is taken off gross revenue before anything else, so it moves
        the royalty line, the taxable income beneath it and therefore the tax, all in the same direction. The TAX
        RATE moves one line only, tax, and leaves royalty exactly where it was. WORKING INTEREST scales every money
        line by the same factor, so the take does not stay put: it RISES as the interest falls, because the
        royalty is charged on the partner's share of gross revenue while the capex the partner carries is the same
        share of a number that was never reduced by royalty.
      </div>
      <Note>
        Take above 100 percent is not an error in the table. It is what a cascade returns when the government's
        royalty and tax exceed the whole pre-take value, which a high enough tax rate on a thin enough margin will
        do; the number is honest and the field is uneconomic.
      </Note>
    </>
  );
};

const AddingUp = () => {
  const table = useMemo(() => { try { return addingUpTable(); } catch { return null; } }, []);
  const wi = useMemo(() => { try { return akataWorkingInterestSweep(); } catch { return null; } }, []);
  const take = useMemo(() => { try { return akataTakeDecomposition(); } catch { return null; } }, []);
  const [label, setLabel] = useState('AKATA');
  if (!table || !table.length || !wi || !take) {
    return <Note>Nothing added up. Cumulative cash flow, payback and take are read off a ledger, and there is no ledger to read.</Note>;
  }
  const c = table.find((x) => x.label === label) || table[0];
  const chart = c.cumulativeByYear.map((q) => ({ year: q.year, cumulative: q.cumulative, net: q.netCashFlow }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Case" value={c.label} onChange={setLabel} options={table.map((x) => [x.label, x.label === 'AKATA' ? 'AKATA, the teaching field' : x.label])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Payback, as the engine words it" value={c.payback} />
          <Tile label="Payback, years" value={c.paybackYears === null ? 'null' : num(c.paybackYears, 6)} />
          <Tile label="Total revenue" value={usd(c.totalRevenue)} unit="USD" />
          <Tile label="Total net cash flow" value={usd(c.totalNetCashFlow)} unit="USD" />
          <Tile label="Total boe, 6 Mscf per bbl" value={c.totalBoe === null ? 'null' : num(c.totalBoe, 2)} unit="boe" />
          <Tile label="Unit technical cost" value={c.unitTechnicalCost === null ? 'null' : num(c.unitTechnicalCost, 6)} unit="USD/boe" />
          <Tile label="Opex per boe" value={c.opexPerBoe === null ? 'null' : num(c.opexPerBoe, 6)} unit="USD/boe" />
          <Tile label="Take, undiscounted" value={pc(c.takePct)} />
        </TileGrid>
      </div>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#f472b6" strokeDasharray="5 3" label={{ value: 'payback is where this is crossed', fill: '#f472b6', fontSize: 10, position: 'insideTopRight' }} />
            <Bar dataKey="net" name="net cash flow" fill="#38bdf8" isAnimationActive={false} />
            <Line type="monotone" dataKey="cumulative" name="cumulative cash flow" stroke="#BFFF00" dot isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Tbl head={['year', 'net cash flow', 'cumulative']} rows={c.cumulativeByYear.map((q) => [q.year, usd(q.netCashFlow), usd(q.cumulative)])} />
      <div className="mt-3 text-xs text-slate-300">
        Payback is the year the cumulative line crosses zero, with the fraction of that year read by straight
        proportion inside it. When the line never crosses, the engine says "Beyond project life" and reports null
        years rather than a large number; when the first row is already positive it says "Year 0". Take is the
        government's royalty plus tax over the pre-take value, which is revenue less capex less opex, and it is
        null when that pre-take value is not positive, because a share of nothing is not a share.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">Take on the teaching field, decomposed</p>
      <div className="rounded-md border border-gray-700 bg-[#0F172A] p-3 text-xs text-slate-300">
        Pre-take value is revenue {usd(take.totalRevenue)} less capex {usd(take.totalCapex)} less opex {usd(take.totalOpex)}.
        The government keeps royalties plus tax {usd(take.totalTax)}; the contractor keeps the total real net cash flow
        {' '}{usd(take.totalRealNetCashFlow)}. Take {pc(take.takePct)} undiscounted.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">Working interest on the teaching field: every money line scales, no volume does</p>
      <Tbl
        head={['WI, %', 'year 1 gross revenue', 'year 1 royalty', 'year 1 tax', 'year 1 net', 'total oil, bbl', 'IRR, %', 'take, %', 'unit technical cost, USD/boe', 'reported WI']}
        rows={wi.map((r) => [r.wiPct, usd(r.year1GrossRevenue), usd(r.year1Royalty), usd(r.year1Tax), usd(r.year1Net), num(r.totalOilBbl, 0), num(r.irrPct, 4), num(r.takePct, 4), num(r.unitTechnicalCost, 6), r.reportedWiPct])}
      />
      <Note>
        The reported gross revenue and the total oil do not move with working interest, the money lines do, and
        the IRR and the unit technical cost do not move at all, because both are ratios of things that scaled
        together. A learner who reads the field ledger where the share ledger was wanted is wrong on every money
        line by the same factor and right on every ratio, which is the most dangerous kind of wrong.
      </Note>
    </>
  );
};

const LedgerExplorer = () => {
  const [mode, setMode] = useState('ledger');
  return (
    <PanelShell
      title="Ledger explorer"
      subtitle="One row per year in cascade order, how rows become years, how prices are applied, which lever moves which line, and what adds up before any discount rate is mentioned"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'ledger' && <Ledger />}
        {mode === 'rowsToYears' && <RowsToYears />}
        {mode === 'prices' && <Prices />}
        {mode === 'cascade' && <Cascade />}
        {mode === 'addingUp' && <AddingUp />}
      </div>
    </PanelShell>
  );
};

export default LedgerExplorer;
