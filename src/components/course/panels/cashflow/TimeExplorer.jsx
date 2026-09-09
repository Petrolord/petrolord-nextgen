import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ReferenceDot,
} from 'recharts';
import {
  AKATA_YEARS, VALUATION_YEARS,
  akataBasisMatrix, akataDeflationExample, akataInflationSweep,
  publishedDiscountingCases, akataValuationYears,
  profileGapCases,
  irrVectors, akataIrrNeighbours,
  publishedSweeps, akataPriceSweep, akataDiscountSweep, akataCostScaleSweep,
  breakevenCases, akataBreakeven,
} from './cashflowLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Time explorer, the Professional tier. TIME: discounting and its two
// conventions, real against nominal and the Fisher rate, the valuation year
// and sunk years, the NPV profile and the point on it that misses, the
// internal rate of return with its root finder and its failure modes, and
// the sweeps of price, discount rate and decline with the breakeven price.
// This panel ends knowing that IRR is a property of a curve, not of a project.
//
// Every figure on this page is a return value from cashflowLab, which is a
// return value from the vendored cashflow engine. Nothing here discounts a
// flow or finds a root.

const usd = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  : 'null');
const num = (v, d = 2) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : 'null');
const pc = (v, d = 4) => (Number.isFinite(v) ? `${num(v, d)} percent` : 'null');
const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['basis', 'Basis and convention: what moves NPV and what does not'],
  ['valuation', 'The valuation year, and sunk as a decision'],
  ['profile', 'The NPV profile, and the point that misses'],
  ['irr', 'IRR: fifteen vectors, and the ones with two roots'],
  ['sweeps', 'Sweeps and the breakeven price'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;
const compact = (v) => (Math.abs(v) >= 1e6 ? `${num(v / 1e6, 1)}M` : num(v, 0));
const COLORS = ['#BFFF00', '#38bdf8', '#f472b6', '#f97316', '#a78bfa', '#34d399'];

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

const Basis = () => {
  const matrix = useMemo(() => { try { return akataBasisMatrix(); } catch { return null; } }, []);
  const defl = useMemo(() => { try { return akataDeflationExample(); } catch { return null; } }, []);
  const infl = useMemo(() => { try { return akataInflationSweep(); } catch { return null; } }, []);
  if (!matrix || matrix.length !== 4 || !defl || !infl) {
    return <Note>The four basis and convention combinations did not run. Discounting needs a ledger and a rate, and one of them is missing.</Note>;
  }
  const chart = AKATA_YEARS.map((year) => {
    const row = { year };
    matrix.forEach((m) => { row[`${m.basis} ${m.convention}`] = m.byYear.find((q) => q.year === year)?.discountedCashFlow ?? null; });
    return row;
  });
  return (
    <>
      <Tbl
        head={['basis', 'convention', 'applied rate, %', 'NPV, USD', 'total net cash flow on the basis', 'discounted payback, years', 'IRR, %']}
        rows={matrix.map((m) => [m.basis, m.convention, num(m.appliedRatePct, 6), usd(m.npv), usd(m.totalNetCashFlow), num(m.discountedPaybackYears, 6), num(m.irrPct, 4)])}
      />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'discounted cash flow, USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            {matrix.map((m, i) => (
              <Line key={`${m.basis} ${m.convention}`} type="monotone" dataKey={`${m.basis} ${m.convention}`} stroke={COLORS[i]}
                strokeDasharray={m.convention === 'mid_year' ? '5 3' : undefined} dot={false} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-slate-300">
        Two of the four lines sit exactly on top of each other. The nominal end-year and the real end-year
        readings discount to the SAME number in every year, because the real basis deflates each flow by the
        inflation rate and then discounts at the Fisher real rate, and those two operations cancel to the
        nominal discounting they replaced. The convention that does move NPV is mid-year against end-year:
        adding a half to every exponent lifts the early negative less than it lowers the later positives.
      </div>
      <div className="mt-3 rounded-md border border-gray-700 bg-[#0F172A] p-3 text-xs text-slate-300">
        The {defl.year} flow, followed through. Money of the day {usd(defl.nominalFlow)} deflates to {usd(defl.realFlow)} on the
        real basis and discounts at the real rate to {usd(defl.discountedOnRealBasis)}; on the nominal basis the same flow
        discounts at the nominal rate to {usd(defl.discountedOnNominalBasis)}. With inflation and every escalator set to
        zero the real NPV is {usd(defl.zeroInflationRealNpv)} and the nominal NPV is {usd(defl.zeroInflationNominalNpv)}, both
        at an applied rate of {pc(defl.zeroInflationRealRatePct, 6)}.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The inflation sweep on the real basis, escalators as configured: NPV does not move</p>
      <Tbl
        head={['inflation, %', 'applied real rate, %', 'NPV, USD', 'total net cash flow, money of the day', 'total net cash flow, real']}
        rows={infl.map((r) => [r.inflationPct, num(r.appliedRealRatePct, 6), usd(r.npv), usd(r.totalNetCashFlowNominal), usd(r.totalNetCashFlowReal)])}
      />
      <Note>
        Read the NPV column and then the last column. The real total falls by tens of millions across the sweep,
        the applied real rate falls with it, and the NPV does not change to the cent. That is the Fisher relation
        doing what it is for: deflating the flows and deflating the rate cancel. A real NPV that moved with the
        inflation assumption would be a sign the escalators and the deflator had come apart.
      </Note>
    </>
  );
};

const Valuation = () => {
  const vy = useMemo(() => { try { return akataValuationYears(); } catch { return null; } }, []);
  const pub = useMemo(() => { try { return publishedDiscountingCases(); } catch { return null; } }, []);
  const [year, setYear] = useState(String(VALUATION_YEARS[1]));
  if (!vy || !vy.length || !pub || !pub.length) {
    return <Note>The valuation-year cases did not run. A valuation year moves the discounting reference; without a ledger there is nothing to reference.</Note>;
  }
  const kept = vy.find((r) => r.valuationYear === Number(year) && !r.treatPriorAsSunk);
  const sunk = vy.find((r) => r.valuationYear === Number(year) && r.treatPriorAsSunk);
  return (
    <>
      <FieldGrid>
        <SelectField label="Value the teaching field from" value={year} onChange={setYear} options={VALUATION_YEARS.map((y) => [String(y), String(y)])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Prior years KEPT: NPV" value={usd(kept.npv)} unit="USD" />
          <Tile label="Prior years KEPT: IRR" value={pc(kept.irrPct)} />
          <Tile label="Prior years KEPT: rows flagged sunk" value={num(kept.rowsFlaggedSunk, 0)} />
          <Tile label="Prior years KEPT: total capex" value={usd(kept.totalCapex)} unit="USD" />
          <Tile label="Prior years SUNK: NPV" value={usd(sunk.npv)} unit="USD" />
          <Tile label="Prior years SUNK: IRR" value={sunk.irrPct === null ? 'null' : pc(sunk.irrPct)} />
          <Tile label="Prior years SUNK: sunk_net_cash_flow" value={sunk.sunkNetCashFlow === null ? 'not reported' : usd(sunk.sunkNetCashFlow)} unit="USD" />
          <Tile label="Prior years SUNK: total capex" value={usd(sunk.totalCapex)} unit="USD" />
        </TileGrid>
      </div>
      <Tbl
        highlight={vy.findIndex((r) => r.valuationYear === Number(year) && r.treatPriorAsSunk)}
        head={['valuation year', 'prior as sunk', 'NPV, USD', 'IRR, %', 'payback', 'sunk_net_cash_flow', 'total capex', 'total net cash flow', 'rows flagged sunk']}
        rows={vy.map((r) => [r.valuationYear, yn(r.treatPriorAsSunk), usd(r.npv), r.irrPct === null ? 'null' : num(r.irrPct, 4), r.payback, r.sunkNetCashFlow === null ? 'not reported' : usd(r.sunkNetCashFlow), usd(r.totalCapex), usd(r.totalNetCashFlow), r.rowsFlaggedSunk])}
      />
      <div className="mt-3 text-xs text-slate-300">
        Same rows, two answers per valuation year, and both are correct for their question. With prior years KEPT
        the valuation year only moves the discounting reference, so the NPV compounds forward by one year of the
        applied rate per year and the IRR does not move at all, because the IRR is a property of the flows and
        not of where you stand to look at them. With prior years SUNK the earlier flows still accrue their fiscal
        state but leave the value metrics: the capex that was spent is reported as sunk_net_cash_flow, the total
        capex drops to what is still to be spent, and the IRR becomes null because nothing negative is left to
        bracket a root.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The three published discounting cases, the same two rows under three conventions</p>
      <Tbl
        head={['case', 'note', 'year 1 discounted', 'year 2 discounted', 'NPV, USD', 'IRR, %', 'valuation year', 'sunk_net_cash_flow', 'rows flagged sunk']}
        rows={pub.map((p) => [p.name, <span key={p.name} className="whitespace-normal">{p.note}</span>, usd(p.rows[0].discounted_cash_flow), usd(p.rows[1].discounted_cash_flow), usd(p.kpis.npv), p.kpis.irr === null ? 'null' : num(p.kpis.irr, 4), p.valuationYear ?? 'not reported', p.sunkNetCashFlow === null ? 'not reported' : usd(p.sunkNetCashFlow), p.rowsFlaggedSunk])}
      />
      <Note>
        Sunk is a decision, not a date. A field that is half built has one answer for "should we have started"
        and another for "should we finish", and the engine will give either, as long as the question is stated
        through valuation_year and treat_prior_as_sunk rather than left to the reader to guess.
      </Note>
    </>
  );
};

const Profile = () => {
  const cases = useMemo(() => { try { return profileGapCases(); } catch { return null; } }, []);
  const [label, setLabel] = useState('AKATA');
  if (!cases || !cases.length) {
    return <Note>No profile was returned. The engine reports NPV at a standard rate vector plus the applied rate, and there is no run to report on.</Note>;
  }
  const c = cases.find((x) => x.label === label) || cases[0];
  const misses = c.gap !== null && Math.abs(c.gap) > 0.005;
  return (
    <>
      <FieldGrid>
        <SelectField label="Profile of" value={c.label} onChange={setLabel} options={cases.map((x) => [x.label, x.label === 'AKATA' ? 'AKATA, the teaching field' : x.label])} />
      </FieldGrid>
      <div className={`mt-3 rounded-md border p-4 ${misses ? 'border-rose-700 bg-rose-900/20' : 'border-emerald-600 bg-emerald-900/20'}`}>
        <p className="text-xs text-gray-400 mb-1">The headline NPV, and the profile point the engine labels with the applied rate</p>
        <p className="text-2xl font-bold text-white mb-1">
          {usd(c.headlineNpv)} <span className="text-[#BFFF00]">against</span> {usd(c.labelledPointNpv)} <span className="text-gray-400 text-sm">USD</span>
        </p>
        <p className={`text-sm mb-0 ${misses ? 'text-rose-300' : 'text-emerald-300'}`}>
          {misses
            ? `The headline is discounted at the applied rate of ${num(c.appliedRatePct, 6)} percent. The profile point is labelled ${num(c.appliedRateLabelPct, 2)} percent and is EVALUATED at that rate rounded to two decimals, so it misses the headline by ${usd(c.gap)} USD.`
            : `The applied rate of ${num(c.appliedRatePct, 6)} percent is a round number, so the point labelled ${num(c.appliedRateLabelPct, 2)} percent is evaluated at the rate the headline used and the gap is ${usd(c.gap)} USD.`}
        </p>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={c.profile} margin={{ top: 10, right: 20, bottom: 18, left: 10 }}>
            {GRID}
            <XAxis dataKey="ratePct" type="number" domain={[0, 20]} tick={AXIS}
              label={{ value: 'discount rate, percent', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'NPV, USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} labelFormatter={(v) => `${num(v, 2)} percent`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Line type="monotone" dataKey="npv" name="the profile as the engine returns it" stroke="#38bdf8" dot={{ r: 3 }} isAnimationActive={false} />
            {c.appliedRateLabelPct !== null && (
              <ReferenceDot x={c.appliedRateLabelPct} y={c.labelledPointNpv} r={6} fill="#f87171" stroke="none"
                label={{ value: `applied point, labelled ${num(c.appliedRateLabelPct, 2)}`, fill: '#f87171', fontSize: 10, position: 'top' }} />
            )}
            <ReferenceDot x={c.appliedRatePct} y={c.headlineNpv} r={4} fill="#BFFF00" stroke="none"
              label={{ value: 'headline NPV', fill: '#BFFF00', fontSize: 10, position: 'bottom' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-1 mb-0">
        The red point is evaluated at the applied rate ROUNDED TO TWO DECIMALS, {num(c.appliedRateLabelPct, 2)} percent here.
        The headline is evaluated at {num(c.appliedRatePct, 6)} percent. On a real basis whose Fisher rate is not a round
        number the two are different points on the same curve.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Headline NPV" value={usd(c.headlineNpv)} unit="USD" />
          <Tile label="Applied rate, exact" value={pc(c.appliedRatePct, 6)} />
          <Tile label="Profile point labelled" value={c.appliedRateLabelPct === null ? 'none' : pc(c.appliedRateLabelPct, 2)} />
          <Tile label="Profile point reads" value={usd(c.labelledPointNpv)} unit="USD" />
          <Tile label="Gap, profile point less headline" value={usd(c.gap)} unit="USD" />
          <Tile label="Engine npv() at the exact rate" value={c.exactIsComparable ? usd(c.exactAtAppliedRate) : 'not comparable, mid-year exponents'} unit={c.exactIsComparable ? 'USD' : ''} />
          <Tile label="Oracle's NPV" value={c.oracle ? usd(c.oracle.npv) : 'no disagreement recorded'} unit={c.oracle ? 'USD' : ''} />
          <Tile label="Basis, convention" value={`${c.basis}, ${c.convention}`} />
        </TileGrid>
      </div>
      <Tbl head={['rate, %', 'NPV, USD']} rows={c.profile.map((q) => [num(q.ratePct, 2), usd(q.npv)])} highlight={c.profile.findIndex((q) => q.ratePct === c.appliedRateLabelPct)} />
      <p className="text-xs text-slate-500 mt-4 mb-1">Every case, the gap in one column</p>
      <Tbl
        head={['case', 'basis', 'convention', 'applied rate, %', 'labelled', 'headline NPV', 'labelled point', 'gap, USD', 'oracle gap, USD']}
        rows={cases.map((x) => [x.label, x.basis, x.convention, num(x.appliedRatePct, 6), x.appliedRateLabelPct === null ? 'none' : num(x.appliedRateLabelPct, 2), usd(x.headlineNpv), usd(x.labelledPointNpv), usd(x.gap), x.oracle ? usd(x.oracle.gap) : 'not recorded'])}
        highlight={cases.findIndex((x) => x.label === c.label)}
      />
      <Note>
        The engine's own header says the applied rate is included so the curve always passes through the headline
        NPV. On the nominal basis it does. On the real basis with a 10 percent nominal rate and 3 percent inflation
        the applied rate is a repeating decimal, the label rounds it, the evaluation uses the rounded label, and
        the curve passes a few tens of thousands of USD beneath the headline. This is the first of three numbers
        the Expert tier asks you to distrust, and the fix is not to trust a chart point that a table already states
        exactly.
      </Note>
    </>
  );
};

const CURVE_WINDOWS = [
  ['hurdle', 'the hurdle region, -10 to 50 percent'],
  ['full', 'the full sample, -90 to 200 percent'],
];

const Irr = () => {
  const vectors = useMemo(() => { try { return irrVectors(); } catch { return null; } }, []);
  const neighbours = useMemo(() => { try { return akataIrrNeighbours(); } catch { return null; } }, []);
  const [name, setName] = useState('two_roots_2_and_6');
  const [win, setWin] = useState('hurdle');
  if (!vectors || vectors.length !== 15 || !neighbours) {
    return <Note>The fifteen published vectors did not run. irr() needs a vector with at least one negative and one positive flow; without both it returns null, and this page has nothing to draw.</Note>;
  }
  const v = vectors.find((x) => x.name === name) || vectors[0];
  const curve = win === 'full' ? v.curve : v.curve.filter((q) => q.ratePct >= -10 && q.ratePct <= 50);
  const ys = curve.map((q) => q.npv);
  const span = Math.max(Math.abs(Math.min(...ys)), Math.abs(Math.max(...ys)));
  return (
    <>
      <FieldGrid>
        <SelectField label="Published vector" value={v.name} onChange={setName} options={vectors.map((x) => [x.name, `${x.name}${x.multiRoot ? ' (more than one root)' : ''}`])} />
        <SelectField label="Rate window" value={win} onChange={setWin} options={CURVE_WINDOWS} />
      </FieldGrid>
      {v.multiRoot && (
        <div className="mt-3 rounded-md border-2 border-rose-500 bg-rose-900/30 p-3">
          <p className="text-rose-200 font-bold text-sm mb-1">THIS CURVE CROSSES ZERO MORE THAN ONCE.</p>
          <p className="text-xs text-rose-100 mb-0">
            The engine reports {pc(v.engineIrrPct)} and says nothing about the other crossing.
            {v.disagrees ? ` The oracle reports ${pc(v.oracleIrrPct)}, the root nearest zero on the positive side. Both zero the NPV: the engine's NPV at its own root is ${num(v.npvAtEngineIrr, 6)} and at the oracle's root ${num(v.npvAtOracleIrr, 6)}.` : ' The engine and the golden agree on which root is reported here, but the curve still has another.'}
          </p>
        </div>
      )}
      <div className="mt-3">
        <TileGrid>
          <Tile label="Flows" value={`[${v.flows.join(', ')}]`} />
          <Tile label="Engine IRR" value={v.engineIrrPct === null ? 'null' : pc(v.engineIrrPct)} />
          <Tile label="Golden IRR" value={v.goldenIrrPct === null ? 'null' : pc(v.goldenIrrPct)} />
          <Tile label="Oracle IRR, where recorded" value={v.oracleIrrPct === null ? 'no disagreement' : pc(v.oracleIrrPct)} />
          <Tile label="NPV at 0 percent" value={usd(v.npvAt0)} />
          <Tile label="NPV at 10 percent" value={usd(v.npvAt10)} />
          <Tile label="NPV at 20 percent" value={usd(v.npvAt20)} />
          <Tile label="More than one root" value={yn(v.multiRoot)} />
        </TileGrid>
      </div>
      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curve} margin={{ top: 10, right: 20, bottom: 18, left: 10 }}>
            {GRID}
            <XAxis dataKey="ratePct" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
              label={{ value: 'discount rate, percent', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={[-span, span]} tickFormatter={(x) => num(x, 3)} label={{ value: 'NPV', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(x) => num(x, 6)} labelFormatter={(x) => `${num(x, 2)} percent`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#f87171" strokeDasharray="5 3" label={{ value: 'NPV of zero', fill: '#f87171', fontSize: 10, position: 'insideTopRight' }} />
            <Line type="monotone" dataKey="npv" name="NPV of the vector, engine npv()" stroke="#38bdf8" dot={{ r: 2 }} isAnimationActive={false} />
            {v.engineIrrPct !== null && (
              <ReferenceDot x={v.engineIrrPct} y={0} r={7} fill="#BFFF00" stroke="none"
                label={{ value: `engine root ${num(v.engineIrrPct, 4)}`, fill: '#BFFF00', fontSize: 10, position: 'top' }} />
            )}
            {v.oracleIrrPct !== null && (
              <ReferenceDot x={v.oracleIrrPct} y={0} r={7} fill="#f472b6" stroke="none"
                label={{ value: `oracle root ${num(v.oracleIrrPct, 4)}`, fill: '#f472b6', fontSize: 10, position: 'bottom' }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl head={['rate, %', 'NPV']} rows={curve.map((q) => [num(q.ratePct, 0), num(q.npv, 6)])} />
      <p className="text-xs text-slate-500 mt-4 mb-1">All fifteen vectors</p>
      <Tbl
        head={['vector', 'flows', 'engine IRR, %', 'golden IRR, %', 'oracle IRR, %', 'NPV at 0 %', 'NPV at 10 %', 'NPV at 20 %', 'roots']}
        rows={vectors.map((x) => [x.name, `[${x.flows.join(', ')}]`, x.engineIrrPct === null ? 'null' : num(x.engineIrrPct, 4), x.goldenIrrPct === null ? 'null' : num(x.goldenIrrPct, 4), x.oracleIrrPct === null ? '' : num(x.oracleIrrPct, 4), usd(x.npvAt0), usd(x.npvAt10), usd(x.npvAt20), x.multiRoot ? 'MORE THAN ONE' : (x.engineIrrPct === null ? 'none bracketed' : 'one')])}
        highlight={vectors.findIndex((x) => x.name === v.name)}
      />
      <div className="mt-3 text-xs text-slate-300">
        Four of the fifteen return null, and each null has a reason the vector shape carries on its face: no sign
        change at all (all positive, all negative), a curve that never reaches zero (no real root), or a sign change
        that starts positive (a late sign change). The remaining eleven return a number, and for the multi-root
        vectors that number is whichever root Newton reaches from a 10 percent start, unflagged. IRR is a property
        of the curve, and a curve can have several.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The teaching field and its neighbours: where terminal negatives come from</p>
      <Tbl
        head={['case', 'nominal net cash flows, USD', 'terminal negative', 'IRR, %', 'NPV, USD', 'NPV of the flows at 0 %', 'at 100 %', 'at 300 %', 'payback']}
        rows={neighbours.map((n) => [n.label, n.flows.map((f) => usd(f)).join(', '), yn(n.terminalNegative), n.irrPct === null ? 'null' : num(n.irrPct, 4), usd(n.npv), usd(n.npvOfFlowsAt0), usd(n.npvOfFlowsAt100), usd(n.npvOfFlowsAt300), n.payback])}
      />
      <Note>
        The last two rows are the Expert tier's warning in miniature. A 60000000 abandonment in the final year
        makes the last flow negative and the engine still finds a root, one of two. A 200000000 abandonment makes
        the NPV negative at every sampled rate, so no sign change brackets a root and the engine returns null while
        the payback still reads as if the field paid out. Neither number is wrong; both are incomplete without the
        curve.
      </Note>
    </>
  );
};

const Sweeps = () => {
  const price = useMemo(() => { try { return akataPriceSweep(); } catch { return null; } }, []);
  const disc = useMemo(() => { try { return akataDiscountSweep(); } catch { return null; } }, []);
  const scale = useMemo(() => { try { return akataCostScaleSweep(); } catch { return null; } }, []);
  const pub = useMemo(() => { try { return publishedSweeps(); } catch { return null; } }, []);
  const be = useMemo(() => { try { return akataBreakeven(); } catch { return null; } }, []);
  const beCases = useMemo(() => { try { return breakevenCases(); } catch { return null; } }, []);
  const [sweepName, setSweepName] = useState('decline_rate_multiyear_pia');
  if (!price || !disc || !scale || !pub || !pub.length || !be || !beCases) {
    return <Note>The sweeps did not run. A sweep is the same ledger rerun at each value of one input, and there is no ledger to rerun.</Note>;
  }
  const sw = pub.find((s) => s.name === sweepName) || pub[0];
  const isDecline = sw.key === 'decline_pct';
  return (
    <>
      <p className="text-xs text-slate-500 mb-1">The teaching field swept on flat oil price, with the breakeven marked</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={price} margin={{ top: 10, right: 20, bottom: 18, left: 10 }}>
            {GRID}
            <XAxis dataKey="oilPrice" type="number" domain={['dataMin', 'dataMax']} tick={AXIS}
              label={{ value: 'flat oil price, USD per bbl', position: 'insideBottom', offset: -8, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'NPV, USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} labelFormatter={(v) => `${num(v, 0)} USD per bbl`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <ReferenceLine x={be.breakeven} stroke="#f472b6" strokeDasharray="5 3"
              label={{ value: `breakeven ${num(be.breakeven, 6)}`, fill: '#f472b6', fontSize: 10, position: 'top' }} />
            <Line type="monotone" dataKey="npv" name="NPV on the real basis" stroke="#BFFF00" dot={{ r: 3 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['oil price', 'NPV, USD', 'IRR, %', 'payback', 'take, %', 'total revenue', 'total tax', 'real net cash flow', 'tax by year']}
        rows={price.map((r) => [r.oilPrice, usd(r.npv), r.irrPct === null ? 'null' : num(r.irrPct, 4), r.payback, r.takePct === null ? 'null' : num(r.takePct, 4), usd(r.totalRevenue), usd(r.totalTax), usd(r.totalNetCashFlowReal), r.taxByYear.map((t) => num(t, 0)).join(', ')])}
      />
      <div className="mt-3 text-xs text-slate-300">
        Below the breakeven the take column reads null and then reads above 100 percent before it settles. Null is
        the engine refusing to divide by a pre-take value that is not positive; above 100 is the government's
        royalty, which is charged on revenue and not on profit, exceeding what is left. Both are readings of the
        cascade and neither is a rounding artefact.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The breakeven oil price</p>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Teaching field breakeven" value={num(be.breakeven, 6)} unit="USD/bbl" />
          <Tile label="NPV rerun at that price" value={usd(be.npvAtBreakeven)} unit="USD" />
          <Tile label="IRR there" value={pc(be.irrAtBreakevenPct)} />
          <Tile label="Take there" value={pc(be.takeAtBreakevenPct)} />
          {be.variants.map((x) => <Tile key={x.label} label={`Breakeven, ${x.label}`} value={x.breakeven === null ? 'NULL' : num(x.breakeven, 6)} unit={x.breakeven === null ? '' : 'USD/bbl'} />)}
        </TileGrid>
      </div>
      <Tbl
        head={['published case', 'engine breakeven, USD/bbl', 'golden breakeven', 'NPV rerun at the breakeven', 'golden NPV at breakeven', 'config oil price', 'deck']}
        rows={beCases.map((b) => [b.name, b.engineBreakeven === null ? 'null' : num(b.engineBreakeven, 6), b.goldenBreakeven === null ? 'null' : num(b.goldenBreakeven, 6), b.npvAtBreakeven === null ? 'null' : usd(b.npvAtBreakeven), b.goldenNpvAtBreakeven === null ? 'null' : num(b.goldenNpvAtBreakeven, 6), b.configOilPrice, b.deck ? JSON.stringify(b.deck) : 'none'])}
      />
      <div className="mt-3 text-xs text-slate-300">
        The breakeven is a bisection on the flat oil price until NPV crosses zero, stopped at a thousandth of a
        dollar, which is why the NPV rerun at it is hundreds of USD and not zero. It is the same on the nominal
        basis and at 60 percent working interest, because neither moves the price at which NPV crosses. It is
        NULL WITH A DECK: when a per-year deck prices the oil, the flat price is not what prices oil, so bisecting
        it would be meaningless and the engine says so rather than returning a number.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The nominal discount rate swept on the real basis</p>
      <Tbl
        head={['nominal rate, %', 'applied real rate, %', 'NPV, USD', 'discounted payback, years', 'DPI', 'PV of capex', 'discounted take, %']}
        rows={disc.map((r) => [r.nominalRatePct, num(r.appliedRealRatePct, 6), usd(r.npv), num(r.discountedPaybackYears, 6), num(r.dpi, 6), usd(r.pvCapex), num(r.discountedTakePct, 4)])}
      />
      <p className="text-xs text-slate-500 mt-4 mb-1">Capex and opex scaled, one at a time</p>
      <Tbl
        head={['scale', 'capex scaled: NPV', 'IRR, %', 'payback', 'unit technical cost', 'opex scaled: NPV', 'IRR, %', 'payback', 'opex per boe']}
        rows={scale.map((r) => [r.scale, usd(r.capexScaled.npv), num(r.capexScaled.irrPct, 4), r.capexScaled.payback, num(r.capexScaled.unitTechnicalCost, 6), usd(r.opexScaled.npv), num(r.opexScaled.irrPct, 4), r.opexScaled.payback, num(r.opexScaled.opexPerBoe, 6)])}
      />
      <FieldGrid>
        <SelectField label="Published sweep" value={sw.name} onChange={setSweepName} options={pub.map((s) => [s.name, s.name])} />
      </FieldGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">{sw.note}</p>
      <Tbl
        head={isDecline
          ? [sw.key, 'NPV, USD', 'IRR, %', 'payback', 'take, %', 'rows', 'economic limit year', 'years trimmed', 'HCT', 'CIT']
          : [sw.key, 'NPV, USD', 'IRR, %', 'payback', 'take, %', 'total revenue', 'total tax', 'unit technical cost']}
        rows={sw.points.map((p) => (isDecline
          ? [p.value, usd(p.npv), p.irrPct === null ? 'null' : num(p.irrPct, 4), p.payback, p.takePct === null ? 'null' : num(p.takePct, 4), p.rows, p.economicLimitYear ?? '', p.yearsTrimmed ?? '', usd(p.totalHct), usd(p.totalCit)]
          : [p.value, usd(p.npv), p.irrPct === null ? 'null' : num(p.irrPct, 4), p.payback, p.takePct === null ? 'null' : num(p.takePct, 4), usd(p.totalRevenue), usd(p.totalTax), p.unitTechnicalCost === null ? 'null' : num(p.unitTechnicalCost, 6)]))}
      />
      <Note>
        The decline sweep is the one where the rows change length: with the economic limit on, a steeper decline
        trims the tail earlier and the ledger gets shorter, so two points on the same sweep are not the same
        number of years. A sweep is a set of separate ledgers and never a formula.
      </Note>
    </>
  );
};

const TimeExplorer = () => {
  const [mode, setMode] = useState('basis');
  return (
    <PanelShell
      title="Time explorer"
      subtitle="Basis and convention, the valuation year and sunk years, the NPV profile and the point that misses it, the internal rate of return on fifteen vectors, and the sweeps that end at a breakeven price"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'basis' && <Basis />}
        {mode === 'valuation' && <Valuation />}
        {mode === 'profile' && <Profile />}
        {mode === 'irr' && <Irr />}
        {mode === 'sweeps' && <Sweeps />}
      </div>
    </PanelShell>
  );
};

export default TimeExplorer;
