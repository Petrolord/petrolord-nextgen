import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  ODUDU_AS_OF, ODUDU_MID_AS_OF,
  rateOfReturn, sensitivitySweep, earnedValue, oduduAsOf, reconciliations, planAndRefusals,
} from './fdpLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Value explorer, the Expert tier. THE VALUE UNDER SCRUTINY: the rate of return
// read beside the NPV and the cases where there is none, what a sensitivity
// says and does not, earned value measured to a stated date, what earned value
// refuses, and a plan read against itself.
//
// Every figure on this page is a return value from fdpLab, which is a return
// value from the vendored FDP Accelerator and Project Management Pro engines at
// a STATED as-of date, or arithmetic the digest itself labels derived (a swing,
// a share of base, a difference of two engine values). Nothing here solves for
// a rate, time-phases a planned value or reads the clock.
//
// P-LABELS. None. A rate of return, a swing, a schedule index, a cost index and
// a completion ratio are not reserves distributions and never carry one.

const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');
const whole = (v) => (Number.isFinite(v) ? Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 }) : 'none');

export const MODES = [
  ['rate', 'Rate: the status beside every NPV, and the cases with no rate at all'],
  ['sweep', 'Sweep: the swing per driver and what the ranking does not say'],
  ['earned', 'Earned: ODUDU-2 task by task, and five as-of dates'],
  ['refusals', 'Refusals: what earned value declines to compute, and the three with no answer'],
  ['reconcile', 'Reconcile: three estimates of one cost, two measures of one schedule'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const RateLabel = ({ children }) => <span data-plabel="rate">{children}</span>;
const CostLabel = ({ children }) => <span data-plabel="cost">{children}</span>;
const CapexLabel = ({ children }) => <span data-plabel="capex">{children}</span>;
const IndexLabel = ({ children }) => <span data-plabel="index">{children}</span>;
const DurationLabel = ({ children }) => <span data-plabel="duration">{children}</span>;
const RatioLabel = ({ children }) => <span data-plabel="ratio">{children}</span>;

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

export const RateMode = ({ ror }) => {
  if (!ror) return <Note>The screening engine did not return the rates.</Note>;
  return (
    <>
      <p className="text-sm text-slate-200 mb-0">
        The engine searches between {ror.band.low} and {ror.band.high} percent and reports a rate only when it is a root
        inside that band. Otherwise the rate is null and the status says which of these happened:
        {' '}{ror.statuses.join(', ')}.
      </p>
      <Tbl
        head={['case', 'NPV, million USD', <RateLabel key="i">rate of return, percent</RateLabel>, 'status']}
        rows={ror.rows.map((x) => [x.label, four(x.npv), <RateLabel key={x.label}>{x.irr === null ? 'none' : four(x.irr)}</RateLabel>, x.irrStatus])}
      />
      <Tbl
        head={['published case with no reportable rate', 'NPV, million USD', 'status', <RateLabel key="h">the true root the band hides</RateLabel>]}
        rows={ror.published.map((c) => [c.name, four(c.npv), c.irrStatus,
          c.hiddenRootPercent === null ? 'not published' : `${four(c.hiddenRootPercent)} percent`])}
      />
      {ror.recovered && (
        <div className="mt-3">
          <TileGrid>
            <Tile label="A case that never pays back" value={four(ror.recovered.npv)} unit="million USD" />
            <Tile label={<RateLabel>Its rate of return</RateLabel>} value={four(ror.recovered.irr)} unit={`percent, status ${ror.recovered.irrStatus}`} />
          </TileGrid>
        </div>
      )}
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A negative rate is a real answer: it says what the money earned, which is less than none. A clamped search that
        stops at its own boundary has found nothing, and reporting the boundary put a rate of exactly {ror.band.high} percent
        in green on cards for projects that never return their money.
      </p>
      <p className="text-sm text-slate-200 mt-3 mb-0">
        More than one root, which is what an end of life cost does to a rate of return. The plan spends
        {' '}{four(ror.multipleRoots.capexMM)} million USD in year 0, earns for {ror.multipleRoots.years} years and pays
        {' '}{four(ror.multipleRoots.abandonmentMM)} to abandon in the last of them, so its flow changes sign twice and can be
        zeroed at more than one rate. The engine finds every root and reports none of them as the rate.
      </p>
      <Tbl
        head={['case', 'NPV, million USD', 'status', <RateLabel key="r">the rates that zero this flow, percent</RateLabel>]}
        rows={ror.multipleRoots.rows.map((x) => [x.label, four(x.npv), x.irrStatus,
          <RateLabel key={x.label}>{x.roots === null ? 'none: the flow is negative at every rate the engine searches' : x.roots.map((y) => four(y)).join(' and ')}</RateLabel>])}
      />
      <Note>
        The same base case with no end of life cost reports a single rate of {four(ror.multipleRoots.withoutEnd.irr)} percent at
        status {ror.multipleRoots.withoutEnd.irrStatus}. Neither root is the rate of return: they are the two discount rates at
        which this flow is worth nothing, and between them the plan is worth more than nothing. Quoting the higher one alone is
        the mistake the multiple-roots status exists to stop, and quoting the lower one as a loss is the same mistake upside down.
      </Note>
      <Tbl
        head={['payback', <DurationLabel key="y">years</DurationLabel>]}
        rows={ror.paybacks.map((x) => [x.label, x.payback === null ? 'never pays back, which is null and not the project life' : four(x.payback)])}
      />
      <Note>
        Payback and the rate of return answer different questions, and a case with no rate can still have a payback. Neither
        of them says how much money the project makes.
      </Note>
    </>
  );
};

export const SweepMode = ({ sw }) => {
  if (!sw) return <Note>The screening engine did not return the sweep.</Note>;
  const bars = sw.rows.map((s) => ({ driver: s.name, low: s.lowParamNPV, high: s.highParamNPV }));
  return (
    <>
      <p className="text-sm text-slate-200 mb-0">
        The sweep moves one driver at a time by 30 percent either way and re-runs the whole case. It is not a probability:
        nothing here says how likely a 30 percent move is.
      </p>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} layout="vertical" margin={{ top: 10, right: 20, bottom: 5, left: 70 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis type="number" tick={AXIS} />
            <YAxis type="category" dataKey="driver" tick={AXIS} width={70} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={sw.rows[0].baseNPV} stroke="#BFFF00" strokeDasharray="3 3" />
            <Bar dataKey="low" name="minus 30 percent" fill="#475569" isAnimationActive={false} />
            <Bar dataKey="high" name="plus 30 percent" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['driver', 'minus 30 percent', 'plus 30 percent', 'base', 'swing (derived)', <RatioLabel key="s">swing over base (derived)</RatioLabel>]}
        rows={sw.rows.map((s) => [s.name, four(s.lowParamNPV), four(s.highParamNPV), four(s.baseNPV), four(s.swingDerived), six(s.swingShareDerived)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Ranked by swing: {sw.rankedBySwingDerived.join(', ')}. Oil price and production both scale revenue, but production
        also scales the variable operating cost the barrels carry, so production swings the value less than price does. The
        capex bar runs the other way: at minus 30 percent capex the value is {four(sw.capexRow.lowParamNPV)} million USD and
        at plus 30 percent it is {four(sw.capexRow.highParamNPV)}.
      </p>
      <Tbl
        head={['published case', <CapexLabel key="c">capex</CapexLabel>, <CostLabel key="o">operating cost a year</CostLabel>,
          <DurationLabel key="y">producing years</DurationLabel>, 'base', 'per driver, low to high']}
        rows={sw.published.map((c) => [c.name, four(c.capexMM), four(c.annualOpexMM), c.years, four(c.baseNPV),
          c.drivers.map((x) => `${x.name} ${four(x.lowParamNPV)} to ${four(x.highParamNPV)}`).join('; ')])}
      />
      <Note>
        A sensitivity says what the value does if one driver moves and everything else stays where it is. Real drivers move
        together, and the sweep says nothing about that.
      </Note>
    </>
  );
};

export const EarnedMode = ({ ev, asOf, onAsOf }) => {
  if (!ev) return <Note>The project controls engine did not return the earned value.</Note>;
  const row = safe(() => oduduAsOf(asOf)) ?? ev.asOfRows[0];
  const line = ev.asOfRows.map((x) => ({ asOf: x.asOf, planned: x.pv, earned: x.ev, actual: x.ac }));
  return (
    <>
      <Tbl
        head={['task', <CostLabel key="p">planned cost, USD</CostLabel>, <CostLabel key="a">actual cost, USD</CostLabel>,
          'percent complete', 'window']}
        rows={ev.tasks.map((t) => [t.name, whole(t.plannedCost), whole(t.actualCost), four(t.percentComplete),
          `${t.plannedStart} to ${t.plannedEnd}`])}
      />
      {onAsOf && (
        <FieldGrid>
          <SelectField label="As of (the digest's dates only)" value={row.asOf} onChange={onAsOf} options={ODUDU_AS_OF.map((d) => [d, d])} />
        </FieldGrid>
      )}
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={line} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="asOf" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={(v) => `${Number(v / 1e6).toFixed(0)}M`} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => whole(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={row.asOf} stroke="#BFFF00" strokeDasharray="3 3" />
            <Line dataKey="planned" name="planned value" stroke="#94a3b8" dot isAnimationActive={false} />
            <Line dataKey="earned" name="earned value" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line dataKey="actual" name="actual cost" stroke="#f472b6" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['as of', <CostLabel key="p">planned value</CostLabel>, <CostLabel key="e">earned value</CostLabel>,
          <CostLabel key="a">actual cost</CostLabel>, <IndexLabel key="s">schedule index</IndexLabel>,
          <IndexLabel key="c">cost index</IndexLabel>, <RatioLabel key="r">completion ratio</RatioLabel>]}
        rows={ev.asOfRows.map((x) => [
          x.asOf === row.asOf ? <span key="s" className="text-[#BFFF00]">{x.asOf}</span> : x.asOf,
          x.pv === null ? 'none' : whole(x.pv), whole(x.ev), whole(x.ac),
          x.spi === null ? 'none' : six(x.spi), x.cpi === null ? 'none' : six(x.cpi),
          x.completionRatio === null ? 'none' : six(x.completionRatio)])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label={<CostLabel>Budget at completion</CostLabel>} value={whole(ev.mid.bac)} unit="USD" />
          <Tile label={<CostLabel>{`Planned value at ${ev.mid.asOf}`}</CostLabel>} value={whole(ev.mid.pv)} unit="USD" />
          <Tile label={<IndexLabel>Schedule index there</IndexLabel>} value={six(ev.mid.spi)} />
          <Tile label={<RatioLabel>Completion ratio</RatioLabel>} value={six(ev.mid.completionRatio)} unit="progress against the whole budget" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The basis the engine states: {ev.mid.spiBasis}. The completion ratio is not a schedule index. Before the repair the
        app called that ratio the schedule index, so a project half finished on time and one half finished a year late both
        read {six(ev.mid.oldRatioExample)}.
      </p>
      <p className="text-xs text-slate-500 mt-2 mb-0">
        A schedule index can read above one, which the old ratio never could: one task {four(ev.ahead.percentComplete)} percent
        done half way through its window reads {six(ev.ahead.spi)} against a completion ratio of {six(ev.ahead.completionRatio)}.
        Earned value itself is not time-phased. It is each task&apos;s budget times the percent somebody typed, with no history
        of when that percent was measured, so it reads the same at every as-of date.
      </p>
      <Note>
        Only the planned value and the schedule index move with the as-of date. Earned value, actual cost, the cost index and
        the completion ratio are read from the tasks as entered.
      </Note>
    </>
  );
};

export const RefusalsMode = ({ ev, rules }) => {
  if (!ev) return <Note>The project controls engine did not return the refusals.</Note>;
  return (
    <>
      <Tbl
        head={['what earned value refuses', 'message']}
        rows={[...ev.refusals.map((c) => [c.name, c.error]),
          ['an as-of date that is not a date', ev.badAsOfRefusal.error]]}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label={<IndexLabel>A costed task nobody has dated</IndexLabel>} value={ev.undated.spi === null ? 'no schedule index' : six(ev.undated.spi)} unit={ev.undated.spiBasis} />
          <Tile label={<CostLabel>Budget at completion then</CostLabel>} value={whole(ev.undated.bac)} unit={`USD, earned value ${whole(ev.undated.ev)}`} />
          <Tile label={<RatioLabel>Its completion ratio</RatioLabel>} value={six(ev.undated.completionRatio)} />
          <Tile label={<IndexLabel>A project with no costed task</IndexLabel>} value={ev.uncosted.spi === null ? 'no index of either kind' : six(ev.uncosted.spi)} unit={ev.uncosted.spiBasis} />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The three with no answer: no schedule index when a costed task carries no dates, no cost index when nothing has been
        spent, and no percent complete when nothing is costed. An index is a ratio, and with no denominator there is no
        ratio. Before the repair each of those read a clean 1.00 and one card printed the string NaN as a zero.
      </p>
      <Tbl
        head={['published earned value case', <CostLabel key="p">PV</CostLabel>, <CostLabel key="e">EV</CostLabel>,
          <CostLabel key="a">AC</CostLabel>, <IndexLabel key="s">schedule index</IndexLabel>, <IndexLabel key="c">cost index</IndexLabel>]}
        rows={ev.published.map((c) => [`${c.name} (as of ${c.asOf})`, c.pv === null ? 'none' : four(c.pv), four(c.ev), four(c.ac),
          c.spi === null ? 'none' : six(c.spi), c.cpi === null ? 'none' : six(c.cpi)])}
      />
      {rules && (
        <Tbl
          head={['what the plan engine refuses', 'message']}
          rows={rules.published.map((c) => [c.name, c.ok ? 'accepted' : c.error])}
        />
      )}
      <Note>
        These published cases are rounding and edge fixtures, so their money is shown to four decimals. Rounded to whole
        units the indexes beside them would not reconcile with the money.
      </Note>
    </>
  );
};

export const ReconcileMode = ({ rec }) => {
  if (!rec) return <Note>The engines did not return the reconciliation.</Note>;
  const bars = [
    { estimate: 'concept capex', value: rec.cost.conceptCapex },
    { estimate: 'cost items', value: rec.cost.costItemsCapex },
    { estimate: 'facility screening', value: rec.cost.facilityScreeningCapex },
    { estimate: 'concept facilities field', value: rec.cost.conceptFacilitiesCapex },
  ];
  return (
    <>
      <div className="h-48 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="estimate" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Bar dataKey="value" name="million USD" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['estimate of the cost', <CapexLabel key="v">million USD</CapexLabel>, 'what it is']}
        rows={[
          ['the concept capex', four(rec.cost.conceptCapex), `drilling ${four(rec.cost.conceptDrillingCapex)}, facilities ${four(rec.cost.conceptFacilitiesCapex)}, subsea ${four(rec.cost.conceptSubseaCapex)}`],
          ['the cost items CAPEX total', four(rec.cost.costItemsCapex), 'what the plan has budgeted line by line'],
          ['the facility screening estimate', four(rec.cost.facilityScreeningCapex), 'a class 5 figure from type and nameplate'],
        ]}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The comparison that is like for like is the facility screening estimate of {four(rec.cost.facilityScreeningCapex)} against
        the concept&apos;s facilities field of {four(rec.cost.conceptFacilitiesCapex)}, a gap of {four(rec.cost.likeForLikeGapDerived)}.
        Setting it against the {four(rec.cost.conceptCapex)} total instead compares one facility with a development that also
        drills {four(rec.cost.conceptDrillingCapex)} of wells and lays {four(rec.cost.conceptSubseaCapex)} of subsea.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label={<DurationLabel>The network says the work must take</DurationLabel>} value={whole(rec.schedule.networkDays)} unit="days" />
          <Tile label={<DurationLabel>The dates typed on the activities span</DurationLabel>} value={whole(rec.schedule.calendarDays)} unit="days" />
          <Tile label={<DurationLabel>Float already spent in the calendar</DurationLabel>} value={whole(rec.schedule.spentFloatDerived)} unit="days (derived)" />
          <Tile label="The two economics routes differ by" value={four(rec.economics.differenceDerived)} unit="million USD (derived)" />
        </TileGrid>
      </div>
      <Tbl
        head={['route to the value', 'NPV, million USD']}
        rows={[
          ['the Base scenario on the concept capex', four(rec.economics.conceptCaseNpv)],
          ['the plan cost items at the same price', four(rec.economics.planCaseNpv)],
        ]}
      />
      <Note>
        The two routes agree only because this plan was costed against the concept it is running. A screening NPV is not a
        sanction case: full fiscal detail belongs in Petroleum Economics Studio, and the tier here is screening, mid-year
        discounted, on the stated default terms.
      </Note>
    </>
  );
};

const ValueExplorer = ({ initialMode = 'rate' }) => {
  const [mode, setMode] = useState(initialMode);
  const [asOf, setAsOf] = useState(ODUDU_MID_AS_OF);
  const ror = useMemo(() => (mode === 'rate' ? safe(rateOfReturn) : null), [mode]);
  const sw = useMemo(() => (mode === 'sweep' ? safe(sensitivitySweep) : null), [mode]);
  const ev = useMemo(() => (mode === 'earned' || mode === 'refusals' ? safe(earnedValue) : null), [mode]);
  const rules = useMemo(() => (mode === 'refusals' ? safe(planAndRefusals) : null), [mode]);
  const rec = useMemo(() => (mode === 'reconcile' ? safe(reconciliations) : null), [mode]);

  return (
    <PanelShell
      title="Value explorer"
      subtitle="The value under scrutiny: a rate of return read beside its status, a sensitivity read for what it does not say, earned value measured to a stated date, and a plan read against itself."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'rate' && <RateMode ror={ror} />}
        {mode === 'sweep' && <SweepMode sw={sw} />}
        {mode === 'earned' && <EarnedMode ev={ev} asOf={asOf} onAsOf={setAsOf} />}
        {mode === 'refusals' && <RefusalsMode ev={ev} rules={rules} />}
        {mode === 'reconcile' && <ReconcileMode rec={rec} />}
      </div>
    </PanelShell>
  );
};

export default ValueExplorer;
