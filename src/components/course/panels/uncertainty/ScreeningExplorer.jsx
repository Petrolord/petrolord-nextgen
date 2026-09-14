import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, BarChart, Bar, Line, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  FIELD_KEYS, FIELD_LABELS, LEDGER_COLUMNS, SENSITIVITY_FACTORS, SCENARIO_RULE,
  screeningConventions, noEconomicLimit, quickCase, ledger, value, paybackCases, irrCases,
  sensitivity, scenarios,
} from './uncertaintyLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Screening explorer, the Associate tier. ONE SCREENING CASE AND ITS RANGE:
// ISIALA's quick inputs expanded into a twenty year case, the royalty and tax
// ledger row by row, value read off the ledger, and one number becoming three.
//
// Every figure on this page is a return value from uncertaintyLab, which is a
// return value from the vendored screening engine. Nothing here computes a
// dollar or a barrel.
//
// Labels for an input carry data-plabel="input" so the percentile-words gate
// can read every one of them off the rendered markup.

const mm = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  : 'null');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'null');
const ratio = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'null');
const bbl = (v) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 }) : 'null');

export const MODES = [
  ['case', 'Case: quick inputs and the twenty year case they expand into'],
  ['ledger', 'Ledger: royalty and tax, all twenty rows'],
  ['value', 'Value: mid-year factors, NPV, payback, IRR, exposure'],
  ['range', 'Range: the sensitivity bars and Low, Base and High'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;
const compact = (v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : Number(v).toFixed(0));

const FIELD_OPTIONS = FIELD_KEYS.map((k) => [k, FIELD_LABELS[k]]);

const InputLabel = ({ children }) => <span data-plabel="input">{children}</span>;

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

export const CaseMode = ({ qc, conventions, limit }) => {
  if (!qc) return <Note>The engine returned no case. A screening case needs a rate, a decline, a price and costs; without them there is nothing to expand.</Note>;
  const q = qc.quick;
  return (
    <>
      <TileGrid>
        <Tile label={<InputLabel>Initial rate</InputLabel>} value={bbl(q.initialRate)} unit="bopd" />
        <Tile label={<InputLabel>Decline</InputLabel>} value={String(q.declineRate)} unit="percent a year" />
        <Tile label={<InputLabel>Oil price</InputLabel>} value={String(q.oilPrice)} unit="USD/bbl, flat" />
        <Tile label={<InputLabel>Capex</InputLabel>} value={String(q.capex)} unit="million USD, half in each of years 1 and 2" />
        <Tile label={<InputLabel>Fixed opex</InputLabel>} value={String(q.fixedOpex)} unit="million USD a year" />
        <Tile label={<InputLabel>Variable opex</InputLabel>} value={String(q.opexPerBbl)} unit="USD/bbl" />
        <Tile label={<InputLabel>Royalty</InputLabel>} value={String(q.royaltyRate)} unit="percent" />
        <Tile label={<InputLabel>Tax</InputLabel>} value={String(q.taxRate)} unit="percent" />
        <Tile label={<InputLabel>Discount rate</InputLabel>} value={String(q.discountRate)} unit="percent, mid-year" />
        <Tile label="Project life" value={String(qc.projectLife)} unit="years, always" />
        <Tile label="Fiscal type" value={qc.fiscalType} />
        <Tile label="Year 2 over year 1 (derived)" value={ratio(qc.declineYear2OverYear1Derived)} />
      </TileGrid>
      <Tbl
        head={['year', 'oil, bbl', 'oil price, USD/bbl', 'gas price, USD/Mscf', 'capex', 'fixed opex', 'variable opex']}
        rows={qc.rows.map((x) => [x.year, bbl(x.oilBbl), four(x.oilPrice), four(x.gasPrice), mm(x.capex), mm(x.opexFixed), mm(x.opexVariable)])}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">Money columns are million USD. Variable opex is the year&apos;s oil volume times the rate per barrel, divided by one million.</p>
      {conventions && (
        <ul className="mt-3 text-xs text-slate-300 list-none pl-0 space-y-1">
          {conventions.lines.map((l) => <li key={l}>{l.replace(/^- /, '')}</li>)}
        </ul>
      )}
      {limit && (
        <Note>
          No economic limit. On OKPOMA the engine still produces and charges year {limit.lastYear.year}, whose net
          cash flow is {mm(limit.lastYear.ncf)} million USD on gross revenue of {mm(limit.lastYear.grossRevenue)} and
          opex of {mm(limit.lastYear.opex)}. A screening value includes every year of the quick life, the losing
          ones too.
        </Note>
      )}
    </>
  );
};

export const LedgerMode = ({ led, fieldKey, onField }) => {
  if (!led) return <Note>The engine returned no ledger for this field.</Note>;
  const chart = led.rows.map((x) => ({ year: x.year, ncf: x.ncf, cumulative: x.cumulativeNCF, gov: x.govTake }));
  return (
    <>
      {onField && (
        <FieldGrid>
          <SelectField label="Field" value={fieldKey} onChange={onField} options={FIELD_OPTIONS} />
        </FieldGrid>
      )}
      <p className="text-xs text-slate-400 mt-2 mb-0">{led.label}: {led.line}.</p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Total gross revenue" value={mm(led.metrics.totalRevenue)} unit="million USD" />
          <Tile label="Total royalty" value={mm(led.metrics.totalRoyalty)} unit="million USD" />
          <Tile label="Total tax" value={mm(led.metrics.totalTax)} unit="million USD" />
          <Tile label="Total government take" value={mm(led.metrics.totalGovTake)} unit="million USD" />
          <Tile label="Total capex" value={mm(led.metrics.totalCapex)} unit="million USD" />
          <Tile label="Total opex" value={mm(led.metrics.totalOpex)} unit="million USD" />
          <Tile label="Years that pay tax" value={`${led.positiveTaxYearCount} of ${led.rows.length}`} />
          <Tile label="Row the payback reads" value={led.paybackRowYear === null ? 'none' : String(led.paybackRowYear)} />
        </TileGrid>
      </div>
      <Tbl
        highlight={led.paybackIndex}
        head={LEDGER_COLUMNS}
        rows={led.rows.map((x) => LEDGER_COLUMNS.map((k) => (k === 'year' ? x.year : mm(x[k]))))}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">
        Money is million USD. The bold row is the first whose cumulative net cash flow is zero or above, which is the
        row the engine&apos;s payback reads.
        {led.paybackIndex === -1 ? ' On this field there is no such row and nothing is marked.' : ''}
        {led.paybackIndex === 0 ? ' On this field it is the very first row, and the payback is never revisited when the cumulative dips below zero again.' : ''}
      </p>
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'million USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Bar dataKey="ncf" name="net cash flow" isAnimationActive={false}>
              {chart.map((c) => <Cell key={c.year} fill={c.ncf < 0 ? '#f87171' : '#38bdf8'} />)}
            </Bar>
            <Line type="monotone" dataKey="cumulative" name="cumulative net cash flow" stroke="#BFFF00" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="gov" name="government take" stroke="#f472b6" dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Note>
        Left to right is the order the engine works in. Royalty comes off gross revenue. Taxable income is revenue
        after royalty less opex less the capex expensed that year, and tax is charged only when that base is
        positive, which is why the two capex years pay none. Net cash flow is revenue after royalty less capex, opex
        and tax.
      </Note>
    </>
  );
};

export const ValueMode = ({ v, paybacks, irrs }) => {
  if (!v) return <Note>The engine returned no value for this field.</Note>;
  const h = v.paybackByHand;
  return (
    <>
      <TileGrid>
        <Tile label={`NPV at ${v.discountRate} percent, mid-year`} value={mm(v.npv)} unit="million USD" />
        <Tile label="IRR" value={four(v.irr)} unit="percent" />
        <Tile label="Payback" value={four(v.payback)} unit="years" />
        <Tile label="Peak exposure" value={mm(v.maxExposure)} unit="million USD" />
      </TileGrid>
      <Tbl
        head={['year', 'net cash flow', 'mid-year factor (derived)', 'discounted net cash flow (derived)']}
        rows={v.factorRows.map((x) => [x.year, mm(x.ncf), ratio(x.factorDerived), mm(x.discountedNcfDerived)])}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">The first six years. Year index i is divided by one plus the rate raised to i plus one half.</p>
      {h && (
        <div className="mt-3 text-xs text-slate-300">
          Payback read by hand: the cumulative first reaches zero in year index {h.index} ({h.year}). The shortfall
          carried in is {mm(h.shortfallCarriedIn)} and that year&apos;s net cash flow is {mm(h.ncfThatYear)}, so the
          payback is {h.index} plus the shortfall over that year&apos;s cash, {four(h.paybackDerived)} years, which is
          the engine&apos;s own {four(v.payback)}.
        </div>
      )}
      {paybacks && (
        <Tbl
          head={['published payback case', 'engine payback, years', 'peak exposure']}
          rows={paybacks.map((x) => [x.id, four(x.payback), mm(x.maxExposure)])}
        />
      )}
      {irrs && (
        <Tbl
          head={['published IRR case', 'engine IRR, percent', 'every root the oracle found', 'oracle disagreement']}
          rows={irrs.map((x) => [x.id, four(x.engineIrr), x.goldenRoots.length ? x.goldenRoots.map((z) => four(z)).join(', ') : 'none', x.recordedEngine ? x.recordedEngine.disagreement : ''])}
        />
      )}
      <Note>
        IRR is Newton from 10 percent on the same mid-year exponent, clamped at 1000 percent and reported as 0 when
        the cash flow never changes sign. A clamp is reported as if it were a root: read the roots column before
        trusting a round number.
      </Note>
    </>
  );
};

export const RangeMode = ({ sens, scen }) => {
  if (!sens || !scen) return <Note>The engine returned no sensitivity for this field.</Note>;
  const bars = sens.map((x) => ({ name: x.name, low: x.lowParamNPV, high: x.highParamNPV }));
  const base = sens.length ? sens[0].baseNPV : null;
  return (
    <>
      <Tbl
        head={['input', `NPV with the input x${SENSITIVITY_FACTORS.low}`, 'base NPV', `NPV with the input x${SENSITIVITY_FACTORS.high}`, 'high minus low (derived)', 'what the bar scales']}
        rows={sens.map((x) => [<InputLabel key={x.name}>{x.name}</InputLabel>, mm(x.lowParamNPV), mm(x.baseNPV), mm(x.highParamNPV), mm(x.swingDerived), x.scales])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} layout="vertical" margin={{ top: 10, right: 20, bottom: 5, left: 30 }}>
            {GRID}
            <XAxis type="number" tick={AXIS} tickFormatter={compact} label={{ value: 'NPV, million USD', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={AXIS} width={80} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={0} stroke="#64748b" />
            {base !== null && <ReferenceLine x={base} stroke="#BFFF00" strokeDasharray="4 4" label={{ value: 'base NPV', fill: '#BFFF00', fontSize: 10, position: 'top' }} />}
            <Bar dataKey="low" name={`input x${SENSITIVITY_FACTORS.low}`} fill="#f87171" isAnimationActive={false} />
            <Bar dataKey="high" name={`input x${SENSITIVITY_FACTORS.high}`} fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500 mt-1 mb-0">The chart plots the NPV the engine returned at each end, with the base NPV it returned beside them as the dashed line.</p>
      <Tbl
        head={['scenario', 'NPV', 'IRR, percent', 'payback, years', 'peak exposure', 'total revenue', 'total tax']}
        rows={scen.map((x) => [x.name, mm(x.metrics.npv), four(x.metrics.irr), four(x.metrics.payback), mm(x.metrics.maxExposure), mm(x.metrics.totalRevenue), mm(x.metrics.totalTax)])}
      />
      <Note>
        {SCENARIO_RULE}. A scenario moves several inputs together by a fixed step and says nothing about how likely
        it is. Price and production scale revenue identically, so their bars are the same bar; OPEX scales the fixed
        part only. The High case clears its capex in year 1, so its payback and IRR read 0 for a project that never
        goes negative.
      </Note>
    </>
  );
};

const ScreeningExplorer = ({ initialMode = 'case' }) => {
  const [mode, setMode] = useState(initialMode);
  const [fieldKey, setFieldKey] = useState('isiala');
  const conventions = useMemo(() => { try { return screeningConventions(); } catch { return null; } }, []);
  const qc = useMemo(() => (mode === 'case' ? (() => { try { return quickCase('isiala'); } catch { return null; } })() : null), [mode]);
  const limit = useMemo(() => (mode === 'case' ? (() => { try { return noEconomicLimit(); } catch { return null; } })() : null), [mode]);
  const led = useMemo(() => (mode === 'ledger' ? (() => { try { return ledger(fieldKey); } catch { return null; } })() : null), [mode, fieldKey]);
  const valued = useMemo(() => (mode === 'value' ? (() => {
    try { return { v: value('isiala'), paybacks: paybackCases(), irrs: irrCases() }; } catch { return null; }
  })() : null), [mode]);
  const ranged = useMemo(() => (mode === 'range' ? (() => {
    try { return { sens: sensitivity('isiala'), scen: scenarios('isiala') }; } catch { return null; }
  })() : null), [mode]);
  return (
    <PanelShell
      title="Screening explorer"
      subtitle={`ISIALA from quick inputs to a ${conventions ? conventions.projectLife : 20} year screening case, its royalty and tax ledger, the value read off it, and the deterministic range around that one number.`}
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'case' && <CaseMode qc={qc} conventions={conventions} limit={limit} />}
        {mode === 'ledger' && <LedgerMode led={led} fieldKey={fieldKey} onField={setFieldKey} />}
        {mode === 'value' && <ValueMode v={valued?.v} paybacks={valued?.paybacks} irrs={valued?.irrs} />}
        {mode === 'range' && <RangeMode sens={ranged?.sens} scen={ranged?.scen} />}
      </div>
    </PanelShell>
  );
};

export default ScreeningExplorer;
