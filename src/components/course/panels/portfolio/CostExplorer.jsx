import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
} from 'recharts';
import {
  OFON_AS_OF, OFON_MID_AS_OF,
  ofonLines, forecastRule, earnedValue, asOfTable, ofonAsOf, sCurve,
} from './portfolioLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Cost explorer, the Professional tier. SPENDING AGAINST AN AFE: OFON-1's lines
// and invoices, the one forecast rule, earned value, the as-of date, and the
// S-curve.
//
// Every figure on this page is a return value from portfolioLab, which is a
// return value from the vendored AFE engine read at a STATED as-of date, or
// arithmetic the digest itself labels derived (a line's spend, its variance,
// its earned value, the plan added per month). Nothing here computes a
// forecast, an earned value or a planned value, and nothing reads the clock.
//
// P-LABELS. None. A forecast is a cost estimate and carries no outcome label; a cost,
// a budget or a forecast never carries a P-label. Budget and cost labels carry
// data-plabel="cost", forecast labels data-plabel="forecast", and a gate reads
// them back out of the rendered markup and finds no P-label in them.
//
// TIME ZONE. The engine reads the window, the as-of date, the monthly step and
// every S-curve label in UTC, so every browser draws the same curve.

const usd = (v) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 }) : 'null');
const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'null');
const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'null');

export const MODES = [
  ['lines', 'Lines: OFON-1, its cost lines and invoices'],
  ['forecast', 'Forecast: one rule for every line'],
  ['earned', 'Earned: earned value, CPI, spent against complete'],
  ['asof', 'As of: six dates, and what moves with them'],
  ['scurve', 'S-curve: plan, actual and forecast by month, closing on the end date'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const CostLabel = ({ children }) => <span data-plabel="cost">{children}</span>;
const ForecastLabel = ({ children }) => <span data-plabel="forecast">{children}</span>;

const Tbl = ({ head, rows }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={i} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const safe = (fn) => { try { return fn(); } catch { return null; } };

// ---------------------------------------------------------------------------

export const LinesMode = ({ lines }) => {
  if (!lines) return <Note>The AFE engine did not return OFON-1.</Note>;
  return (
    <>
      <p className="text-sm text-slate-200 mb-0">
        {lines.afe.afe_number}: currency {lines.afe.currency}, window {lines.afe.start_date} to {lines.afe.end_date}, read as of {lines.asOf}.
      </p>
      <Tbl
        head={['code', 'description', <CostLabel key="b">budget</CostLabel>, <CostLabel key="c">commitment</CostLabel>, <CostLabel key="a">actual</CostLabel>, <ForecastLabel key="f">entered forecast</ForecastLabel>, 'progress percent']}
        rows={lines.items.map((i) => [i.code, i.description, usd(i.budget), usd(i.commitment), usd(i.actual), i.enteredForecast ? usd(i.enteredForecast) : 'none', four(i.progress)])}
      />
      <Tbl
        head={['invoice date', <CostLabel key="a">amount</CostLabel>]}
        rows={[...lines.invoices.map((v) => [v.invoice_date, usd(v.amount)]), ['invoice total (derived)', usd(lines.invoiceTotalDerived)]]}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label={<CostLabel>Total budget</CostLabel>} value={usd(lines.totalBudget)} unit={lines.afe.currency} />
          <Tile label={<CostLabel>Total commitments</CostLabel>} value={usd(lines.totalCommitments)} unit={lines.afe.currency} />
          <Tile label={<CostLabel>Total actuals, from the lines</CostLabel>} value={usd(lines.totalActuals)} unit={lines.afe.currency} />
          <Tile label={<CostLabel>Invoices, summed (derived)</CostLabel>} value={usd(lines.invoiceTotalDerived)} unit={lines.afe.currency} />
        </TileGrid>
      </div>
      <Note>
        The metrics read actuals from the cost lines; the S-curve reads actuals from invoices. On OFON-1 the two agree by
        construction. On a real AFE they need not, and nothing reconciles them.
      </Note>
    </>
  );
};

export const ForecastMode = ({ fr }) => {
  if (!fr) return <Note>The AFE engine did not return the forecast.</Note>;
  return (
    <>
      <p className="text-sm text-slate-200 mb-0">{fr.rule}</p>
      <Tbl
        head={['code', <CostLabel key="b">budget</CostLabel>, <CostLabel key="s">committed, actual + commitment</CostLabel>, <ForecastLabel key="e">entered forecast</ForecastLabel>, <ForecastLabel key="i">itemForecast</ForecastLabel>, 'rule used', <ForecastLabel key="f">below spent and committed</ForecastLabel>, <ForecastLabel key="v">line variance, budget less itemForecast (derived)</ForecastLabel>]}
        rows={fr.rows.map((i) => [i.code, usd(i.budget), usd(i.committed), i.enteredForecast ? usd(i.enteredForecast) : 'none', usd(i.itemForecast), <ForecastLabel key={i.code}>{i.rule}</ForecastLabel>, i.forecastBelowCommitted ? 'yes' : 'no', usd(i.lineVarianceDerived)])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label={<ForecastLabel>Estimate at completion (EAC)</ForecastLabel>} value={usd(fr.eac)} unit="USD" />
          <Tile label={<ForecastLabel>Variance at completion</ForecastLabel>} value={usd(fr.variance)} unit="USD, negative is an overrun" />
          <Tile label={<ForecastLabel>Lines forecast below committed</ForecastLabel>} value={String(fr.linesForecastBelowCommitted)} />
          <Tile label={<ForecastLabel>Lines with a negative forecast ignored</ForecastLabel>} value={String(fr.linesForecastIgnored)} />
        </TileGrid>
      </div>
      <Tbl
        head={['CMT-03 with', <ForecastLabel key="f">itemForecast, USD</ForecastLabel>, <ForecastLabel key="b">below committed by, USD</ForecastLabel>, 'forecastIgnored']}
        rows={[
          ...fr.probes.map((p) => [p.label, usd(p.itemForecast), p.forecastBelowCommitted ? usd(p.forecastBelowCommittedBy) : 'not below', p.forecastIgnored ?? 'null']),
          [`entered forecast ${fr.negativeProbe.enteredForecast}`, usd(fr.negativeProbe.itemForecast), 'not below', fr.negativeProbe.forecastIgnored ?? 'null'],
        ]}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">
        A forecast of 0 is not positive and falls back to the formula. Any positive entered forecast is taken as typed, and one below the money already spent and
        committed is flagged with the amount it falls short. A negative entered forecast is replaced by the standard rule and flagged &quot;negative&quot;.
      </p>
      <Tbl
        head={['published case', 'items', <ForecastLabel key="e">engine EAC</ForecastLabel>, <ForecastLabel key="v">variance</ForecastLabel>, 'lines below committed', 'lines with an ignored forecast']}
        rows={fr.published.map((c) => [c.label, JSON.stringify(c.items), four(c.eac), four(c.variance), c.linesForecastBelowCommitted, c.linesForecastIgnored])}
      />
      <Note>
        A line with no entered forecast can never show a saving: its forecast is at least its budget, so its variance is 0
        or negative. OFON-1&apos;s three variances of 0 are that floor, and say nothing about being on budget.
      </Note>
    </>
  );
};

export const EarnedMode = ({ ev }) => {
  if (!ev) return <Note>The AFE engine did not return earned value.</Note>;
  const bars = ev.rows.map((i) => ({ code: i.code, earned: i.earnedDerived, actual: i.actual }));
  const pace = [
    { name: 'percent spent', value: ev.percentSpent },
    { name: 'percent complete', value: ev.percentComplete },
  ];
  return (
    <>
      <Tbl
        head={['code', <CostLabel key="b">budget</CostLabel>, 'progress percent', 'earned value, budget x progress (derived)', <CostLabel key="a">actual</CostLabel>]}
        rows={ev.rows.map((i) => [i.code, usd(i.budget), four(i.progress), usd(i.earnedDerived), usd(i.actual)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="code" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={(v) => `${Number(v / 1e6).toFixed(1)}M`} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="earned" name="earned value (derived)" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="actual" name="actual" fill="#f472b6" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Earned value" value={usd(ev.earnedValue)} unit="USD" />
          <Tile label={<CostLabel>Actuals</CostLabel>} value={usd(ev.totalActuals)} unit="USD" />
          <Tile label="CPI, earned value over actuals" value={ev.cpi === null ? 'null' : six(ev.cpi)} unit={`cpiStatus ${ev.cpiStatus}`} />
          <Tile label={`As of ${ev.asOf}`} value="read from the lines" />
        </TileGrid>
      </div>
      <div className="h-24 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pace} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 40 }}>
            <XAxis type="number" domain={[0, 100]} tick={AXIS} />
            <YAxis type="category" dataKey="name" tick={AXIS} width={110} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Bar dataKey="value" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-1 mb-0">
        Percent spent {four(ev.percentSpent)} against percent complete {four(ev.percentComplete)}.
      </p>
      <p className="text-xs text-slate-500 mt-2 mb-0">
        {ev.rule}
      </p>
      <Tbl
        head={['published case', 'engine EV', <CostLabel key="a">AC</CostLabel>, 'CPI', 'cpiStatus', 'SPI', 'spiStatus']}
        rows={ev.published.map((x) => [x.name, four(x.earnedValue), four(x.totalActuals), x.cpi === null ? 'null' : six(x.cpi), x.cpiStatus, x.spi === null ? 'null' : six(x.spi), x.spiStatus])}
      />
      <Tbl
        head={['published case', 'engine message, verbatim']}
        rows={ev.progressRefusals.map((a) => [a.name, a.ok ? 'accepted' : a.error])}
      />
      <Note>Earned value is only as good as the progress typed in. Progress runs from 0 to 100 percent, and CPI is null with nothing spent.</Note>
    </>
  );
};

export const AsOfMode = ({ table, asOf, onAsOf }) => {
  if (!table) return <Note>The AFE engine did not return the as-of table.</Note>;
  const row = safe(() => ofonAsOf(asOf)) ?? table.rows[0];
  const dc = table.dayCounts;
  return (
    <>
      {onAsOf && (
        <FieldGrid>
          <SelectField label="As of (the lessons' dates only)" value={row.asOf} onChange={onAsOf} options={OFON_AS_OF.map((d) => [d, d])} />
        </FieldGrid>
      )}
      <div className="mt-3">
        <TileGrid>
          <Tile label="Time progress" value={six(row.timeProgress)} />
          <Tile label="Planned value" value={usd(row.plannedValue)} unit="USD" />
          <Tile label="Earned value" value={usd(row.earnedValue)} unit="USD" />
          <Tile label="SPI" value={row.spi === null ? 'null' : six(row.spi)} unit={`spiStatus ${row.spiStatus}`} />
          <Tile label="CPI" value={row.cpi === null ? 'null' : six(row.cpi)} />
          <Tile label={<ForecastLabel>EAC</ForecastLabel>} value={usd(row.totalForecast)} unit="USD" />
        </TileGrid>
      </div>
      <Tbl
        head={['as of', 'time progress', 'planned value', 'earned value', 'SPI', 'spiStatus', 'CPI']}
        rows={table.rows.map((x) => [x.asOf === row.asOf ? <span key="s" className="text-[#BFFF00]">{x.asOf}</span> : x.asOf, six(x.timeProgress), usd(x.plannedValue), usd(x.earnedValue), x.spi === null ? 'null' : six(x.spi), x.spiStatus, six(x.cpi)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Whole days in the window: {dc.windowDaysDerived} (derived). {dc.elapsed.map((e) => `At ${e.asOf}, ${e.elapsedDaysDerived} elapsed, time progress ${six(e.timeProgressDerived)}`).join('; ')} (derived), matching the engine column.
      </p>
      <Tbl
        head={['published case', 'window', 'as of', 'time progress', 'SPI', 'spiStatus']}
        rows={table.published.map((x) => [x.name, `${x.startDate ?? 'none'} to ${x.endDate ?? 'none'}`, x.caseAsOf ?? 'none given', six(x.timeProgress), x.spi === null ? 'null' : six(x.spi), x.spiStatus])}
      />
      <Note>
        Only planned value, time progress and SPI move with the as-of date; earned value, actuals, CPI and EAC are read from
        the lines as entered. On the start day no whole day has elapsed, so SPI is null exactly as before the start.
      </Note>
    </>
  );
};

export const SCurveMode = ({ sc }) => {
  if (!sc) return <Note>The AFE engine did not return the S-curve.</Note>;
  return (
    <>
      <div className="h-56 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sc.points} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={(v) => `${Number(v / 1e6).toFixed(0)}M`} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {sc.cutLabel && <ReferenceLine x={sc.cutLabel} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: `as of ${sc.asOf}`, fill: '#BFFF00', fontSize: 10 }} />}
            <Line dataKey="Planned" stroke="#94a3b8" dot isAnimationActive={false} />
            <Line dataKey="Actual" stroke="#f472b6" dot isAnimationActive={false} connectNulls={false} />
            <Line dataKey="Forecast" stroke="#38bdf8" strokeDasharray="4 2" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['point', 'label', 'window end', <CostLabel key="p">Planned</CostLabel>, <CostLabel key="a">Planned added (derived)</CostLabel>, <CostLabel key="c">Actual</CostLabel>, <ForecastLabel key="f">Forecast</ForecastLabel>]}
        rows={sc.points.map((p, i) => [
          i === sc.cutIndex ? <span key="c" className="text-[#BFFF00]">{i}, the as-of cut</span> : i,
          p.date, p.windowEnd ? 'yes' : 'no', usd(p.Planned), sc.plannedAddedDerived[i] === null ? 'none' : usd(sc.plannedAddedDerived[i]),
          p.Actual === null ? 'null' : usd(p.Actual), usd(p.Forecast),
        ])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Points" value={String(sc.pointCount)} unit={`${sc.monthlyCount} monthly, then the closing point "${sc.closing.date}"`} />
          <Tile label={<CostLabel>Closing Planned</CostLabel>} value={usd(sc.closing.Planned)} unit={`USD, the budget ${usd(sc.totalBudget)}`} />
          <Tile label={<ForecastLabel>Closing Forecast</ForecastLabel>} value={usd(sc.closing.Forecast)} unit={`USD, the EAC ${usd(sc.eac)}`} />
          <Tile label={<CostLabel>Added by the closing point (derived)</CostLabel>} value={usd(sc.closingAddedDerived)} unit={`USD after "${sc.lastMonthly.date}"`} />
          <Tile label={<CostLabel>Last actual</CostLabel>} value={usd(sc.lastActual)} unit="USD" />
          <Tile label={<ForecastLabel>First projected Forecast</ForecastLabel>} value={usd(sc.firstProjectedForecast)} unit="USD" />
          <Tile label="Undated invoices" value={String(sc.undatedInvoices)} />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-500 mt-2 mb-0">
        A monthly label is a month and a two-digit year; the closing point carries its day. Actual at a point counts invoices dated on
        or before that day. After the as-of date Forecast ignores the actuals and is the EAC spread from the start, so its jump at the
        first projected point comes from switching formulas: no money is spent at that point. Every date and label is read in UTC, so
        every time zone draws the same curve. Read after the end, as of {sc.afterEnd.asOf}, the closing point carries Actual {usd(sc.afterEnd.closing.Actual)}.
      </p>
      <Tbl
        head={['published case', 'points', 'first', 'last']}
        rows={sc.published.map((c) => [c.label, c.pointCount, JSON.stringify(c.first), JSON.stringify(c.last)])}
      />
      <Note>
        Read an overrun off the closing point, where Planned is the budget and Forecast is the EAC. The last monthly point
        shows neither.
      </Note>
    </>
  );
};

const CostExplorer = ({ initialMode = 'lines' }) => {
  const [mode, setMode] = useState(initialMode);
  const [asOf, setAsOf] = useState(OFON_MID_AS_OF);
  const lines = useMemo(() => (mode === 'lines' ? safe(ofonLines) : null), [mode]);
  const fr = useMemo(() => (mode === 'forecast' ? safe(forecastRule) : null), [mode]);
  const ev = useMemo(() => (mode === 'earned' ? safe(earnedValue) : null), [mode]);
  const table = useMemo(() => (mode === 'asof' ? safe(asOfTable) : null), [mode]);
  const sc = useMemo(() => (mode === 'scurve' ? safe(sCurve) : null), [mode]);

  return (
    <PanelShell
      title="Cost explorer"
      subtitle="OFON-1, a well AFE in USD: its lines and invoices, one forecast rule, earned value, the as-of date, and the S-curve. Every reading is at a stated date."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'lines' && <LinesMode lines={lines} />}
        {mode === 'forecast' && <ForecastMode fr={fr} />}
        {mode === 'earned' && <EarnedMode ev={ev} />}
        {mode === 'asof' && <AsOfMode table={table} asOf={asOf} onAsOf={setAsOf} />}
        {mode === 'scurve' && <SCurveMode sc={sc} />}
      </div>
    </PanelShell>
  );
};

export default CostExplorer;
