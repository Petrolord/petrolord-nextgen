import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  COST_RECOVERY_LIMITS, R_FACTOR_CASE_IDS, R_FACTOR_CASE_LABELS,
  royaltyMultiplierSweep, royaltyThresholdProbe, royaltyThresholdRounding, odidiRoyaltyByYear, royaltyCases,
  costRecoverySweep, costRecoveryCases,
  rFactorTable,
  taxDecomposition, taxCases, upliftSweep, upliftTotalCapex,
  discountSweep, irrCases, irrBracketEvidence,
} from './fiscalLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Instrument explorer, the Professional tier. ONE INSTRUMENT AT A TIME: the
// sliding-scale royalty and which side of a threshold belongs to which tier,
// cost recovery with its pool and its carryforward, the R factor and the split
// it selects, the tax stack decomposed into its three charges, and the rate at
// which all of it is discounted.
//
// Every figure on this page is a return value from fiscalLab, which is a return
// value from the vendored fiscal regime engine. Nothing here computes anything.

const mm = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  : 'null');
const ratio = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'null');
const pc = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'null');
const yr = (v) => (v === null || v === undefined ? 'never' : String(v));

const MODES = [
  ['royalty', 'Royalty: the sliding scale, the crossing and the threshold itself'],
  ['recovery', 'Recovery: four limits, the pool and the carryforward'],
  ['rfactor', 'R factor: the ratio of cumulatives and the split it selects'],
  ['tax', 'Tax: three charges decomposed, and the uplift charged every year'],
  ['rate', 'Rate: the discount sweep, the mid-year parity and five IRR vectors'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;
const compact = (v) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : Number(v).toFixed(0));

const Tbl = ({ head, rows, mark = () => false }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="text-xs text-slate-300 w-full">
      <thead className="text-slate-500">
        <tr>{head.map((h, i) => <th key={i} className={`text-left ${i < head.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={mark(i) ? 'text-[#BFFF00] font-semibold' : ''}>
            {r.map((c, j) => <td key={j} className={`${j < r.length - 1 ? 'pr-3' : ''} whitespace-nowrap`}>{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Royalty = () => {
  const sweep = useMemo(() => { try { return royaltyMultiplierSweep(); } catch { return null; } }, []);
  const probe = useMemo(() => { try { return royaltyThresholdProbe(); } catch { return null; } }, []);
  const rounding = useMemo(() => { try { return royaltyThresholdRounding(); } catch { return null; } }, []);
  const deck = useMemo(() => { try { return odidiRoyaltyByYear(); } catch { return null; } }, []);
  const cases = useMemo(() => { try { return royaltyCases(); } catch { return null; } }, []);
  const [caseId, setCaseId] = useState('sliding_royalty_price_deck_crossing');
  if (!sweep || !probe || !rounding || !deck || !cases) {
    return <Note>The royalty sweep did not run. A sliding scale needs a tier list keyed on the oil price, and the price it reads is the applied price for the year after the multiplier, so with no run there is no rate to read.</Note>;
  }
  const c = cases.find((x) => x.id === caseId) || cases[0];
  const chart = sweep.map((x) => ({ price: x.appliedYear1PriceDerived, rate: x.impliedRateDerived * 100 }));
  const crossing = sweep.findIndex((x) => x.impliedRateDerived > 0.09);
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        The PIA royalty has two tiers, 0 USD per bbl at 7.5 percent and 50 USD per bbl at 10 percent. Swept across
        the price multiplier on the DEFAULT PROJECT, whose year 1 deck price is 70 USD per bbl. The implied rate is
        the royalty the engine returned over the gross revenue it returned, on the same row.
      </p>
      <Tbl
        mark={(i) => i === crossing || i === crossing - 1}
        head={['price multiplier', 'applied year 1 oil price', 'year 1 grossRevenue', 'year 1 royalty', 'implied rate']}
        rows={sweep.map((x) => [ratio(x.multiplier), ratio(x.appliedYear1PriceDerived), mm(x.grossRevenue), mm(x.royalty), ratio(x.impliedRateDerived)])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="price" tick={AXIS} label={{ value: 'applied year 1 oil price, USD per bbl', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} domain={[7, 10.5]} label={{ value: 'implied royalty rate, percent', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => pc(v)} />
            <ReferenceLine x={50} stroke="#f87171" strokeDasharray="5 3" label={{ value: 'the 50 USD per bbl threshold', fill: '#f87171', fontSize: 10, position: 'insideTopLeft' }} />
            <Line type="stepAfter" dataKey="rate" name="implied rate" stroke="#BFFF00" dot isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">
        Which side does the threshold itself belong to. The engine compares with a greater-than-or-equal, so a price
        sitting EXACTLY on a threshold takes the UPPER tier. No multiplier on this deck lands exactly on 50: the one
        that looks as though it does, {ratio(rounding.multiplier)}, gives an applied price of {rounding.appliedYear1PriceDerived},
        which prints as {ratio(rounding.appliedYear1PriceDerived)} at six decimals and takes the LOWER tier at
        {' '}{ratio(rounding.impliedRateDerived)}. So the point is made with a deck priced at the threshold instead.
      </p>
      <Tbl
        head={['deck oil price, USD/bbl', 'year 1 grossRevenue', 'year 1 royalty', 'implied rate']}
        rows={probe.map((x) => [ratio(x.deckOilPrice), mm(x.grossRevenue), mm(x.royalty), ratio(x.impliedRateDerived)])}
      />
      <p className="text-xs text-slate-500 mt-4 mb-1">
        The same instrument along a deck rather than along a multiplier. ODIDI holds 45 USD per bbl through year 5
        and steps to 65 at year 6, so the rate changes inside the life of the field.
      </p>
      <Tbl
        head={['year', 'grossRevenue', 'royalty', 'implied rate']}
        rows={deck.map((x) => [x.year, mm(x.grossRevenue), mm(x.royalty), ratio(x.impliedRateDerived)])}
      />
      <FieldGrid>
        <SelectField label="Published case" value={c.id} onChange={setCaseId} options={cases.map((x) => [x.id, x.id])} />
      </FieldGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">{c.note}</p>
      <p className="text-xs text-slate-500 mt-1 mb-0">{c.regimeLine}.</p>
      <Tbl
        head={['year', 'grossRevenue', 'royalty', 'implied rate']}
        rows={c.head.map((x) => [x.year, mm(x.grossRevenue), mm(x.royalty), ratio(x.impliedRateDerived)])}
      />
      <Note>
        It is a STEP, not a ramp: nothing between the tiers is interpolated. The walk starts at the FIRST tier rate
        and keeps the rate of every tier whose threshold the price has reached, so a price below every threshold pays
        the first tier rate and not zero, which is what price_below_every_threshold is published to show. Read a
        sweep printed price column as a ROUNDING of the price the engine used, never as the price itself, and read
        the implied rate as the measurement: the rate says which side of the threshold the engine was actually on.
      </Note>
    </>
  );
};

const Recovery = () => {
  const sweep = useMemo(() => { try { return costRecoverySweep(COST_RECOVERY_LIMITS); } catch { return null; } }, []);
  const cases = useMemo(() => { try { return costRecoveryCases(); } catch { return null; } }, []);
  if (!sweep || !cases) {
    return <Note>The cost recovery sweep did not run. Three lines of the engine do the whole of it, and all three need a ledger: the pool brought forward plus this year cost, the limit applied to revenue after royalty, and the smaller of the two.</Note>;
  }
  const chart = sweep[0].rows.map((_, i) => {
    const row = { year: i + 1 };
    sweep.forEach((s) => { row[`limit${s.limit}`] = s.rows[i].unrecoveredCostPool; });
    return row;
  });
  const colours = ['#f87171', '#fbbf24', '#38bdf8', '#BFFF00'];
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        The same project under four limits, so the limit is the only thing that moves. Everything else is held at the
        Generic Royalty/Tax settings on the DEFAULT PROJECT.
      </p>
      <div className="mt-3">
        <TileGrid>
          {sweep.map((s) => (
            <Tile key={s.limit} label={`Limit ${s.limit} percent, closing pool`} value={mm(s.closingUnrecoveredPool)} unit="million USD" />
          ))}
        </TileGrid>
      </div>
      <Tbl
        head={['limit, percent', 'total cost recovered', 'total profit oil', 'total contractor NCF', 'closing unrecovered pool']}
        rows={sweep.map((s) => [s.limit, mm(s.totalCostRecovered), mm(s.totalProfitOil), mm(s.totalContractorNCF), mm(s.closingUnrecoveredPool)])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'unrecovered cost pool, million USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {sweep.map((s, i) => (
              <Line key={s.limit} type="monotone" dataKey={`limit${s.limit}`} name={`limit ${s.limit} percent`} stroke={colours[i % colours.length]} dot={false} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {sweep.map((s) => (
        <div key={s.limit}>
          <p className="text-xs text-slate-500 mt-4 mb-1">Cost recovery limit {s.limit} percent, the first seven years</p>
          <Tbl
            head={['year', 'grossRevenue', 'royalty', 'costRecovered', 'unrecoveredCostPool', 'profitOil']}
            rows={s.head.map((x) => [x.year, mm(x.grossRevenue), mm(x.royalty), mm(x.costRecovered), mm(x.unrecoveredCostPool), mm(x.profitOil)])}
          />
        </div>
      ))}
      <p className="text-xs text-slate-500 mt-4 mb-1">The published extremes</p>
      <Tbl
        head={['case', 'limit', 'total cost recovered', 'total profit oil', 'total contractor NCF', 'closing pool', 'payback']}
        rows={cases.map((c) => [c.id, c.costRecoveryLimit, mm(c.totalCostRecovered), mm(c.totalProfitOil), mm(c.totalContractorNCF), mm(c.closingUnrecoveredPool), yr(c.paybackYear)])}
      />
      <Note>
        Every dollar sitting in the pool is a dollar the contractor has spent and not yet been paid back. What cost
        recovery is NOT: it is not a deduction against tax, because the tax base here is the contractor profit share
        and cost oil is credited to the contractor separately; it is not depreciation and there is no schedule; and
        an unrecovered balance is not a loss carried forward, it is only a claim on future revenue after royalty.
        Note also that capped_5pct_never_recovers pays back in year 3 despite its own note, because the revenue that
        cannot be recovered becomes profit oil and that regime splits profit oil wholly to the contractor. Cost
        recovery is not the only way capital comes home.
      </Note>
    </>
  );
};

const RFactor = () => {
  const [caseId, setCaseId] = useState('rfactor_tranche_crossing');
  const t = useMemo(() => { try { return rFactorTable(caseId); } catch { return null; } }, [caseId]);
  if (!t) {
    return <Note>The R factor table did not run. The ratio is cumulative gross revenue over cumulative cost, both running sums off the ledger, so with no ledger there is no ratio and no tier to select.</Note>;
  }
  const chart = t.table.map((x) => ({ year: x.year, rFactor: x.rFactor, split: x.impliedSplitDerived === null ? null : x.impliedSplitDerived * 100 }));
  return (
    <>
      <FieldGrid>
        <SelectField label="Case" value={caseId} onChange={setCaseId} options={R_FACTOR_CASE_IDS.map((id) => [id, R_FACTOR_CASE_LABELS[id] || id])} />
      </FieldGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">{t.note}</p>
      <p className="text-xs text-slate-500 mt-1 mb-0">{t.regimeLine}.</p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Payout year, R factor above 1.0" value={yr(t.payoutYear)} />
          <Tile label="Peak R factor" value={ratio(t.peakRFactor)} />
          <Tile label="R factor falls back" value={t.fallsBackAnywhere ? `yes, first in year ${t.firstFallBackYear}` : 'no'} />
          <Tile label="A split once given up is returned" value={t.splitReturned ? `yes, in year ${t.splitReturnedYear}` : 'no'} />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis yAxisId="r" tick={AXIS} label={{ value: 'R factor', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <YAxis yAxisId="s" orientation="right" tick={AXIS} domain={[0, 100]} label={{ value: 'implied contractor split, percent', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => ratio(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine yAxisId="r" y={1} stroke="#f472b6" strokeDasharray="5 3" label={{ value: 'R equals 1.0', fill: '#f472b6', fontSize: 10, position: 'insideTopRight' }} />
            <Line yAxisId="r" type="monotone" dataKey="rFactor" name="R factor" stroke="#38bdf8" dot={false} isAnimationActive={false} />
            <Line yAxisId="s" type="stepAfter" dataKey="split" name="implied contractor split" stroke="#BFFF00" dot={false} isAnimationActive={false} connectNulls={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        mark={(i) => t.table[i].fallsBack}
        head={['year', 'grossRevenue', 'opex', 'capex', 'rFactor', 'profitOil', 'contractor profit share', 'implied split']}
        rows={t.table.map((x) => [
          x.year, mm(x.grossRevenue), mm(x.opex), mm(x.capex), ratio(x.rFactor), mm(x.profitOil),
          mm(x.contractorProfitShareDerived), x.impliedSplitDerived === null ? 'null' : ratio(x.impliedSplitDerived),
        ])}
      />
      <p className="text-xs text-slate-500 mt-1 mb-0">
        A highlighted row is a year the R factor fell BELOW the year before it.
        {t.fallsBackAnywhere ? '' : ' There are none in this case.'}
      </p>
      <Note>
        The R factor is a ratio of CUMULATIVES, not of the year, and it is computed BEFORE the split is chosen, from
        the totals including the current year. It is therefore NOT monotone: revenue declines while opex keeps
        accruing, and the ratio can cross back below a threshold it had passed. Where it does, the contractor split
        steps back UP. Real R factor contracts usually ratchet, so that a split once given up is never returned; this
        one does not, and nothing in the engine says so. Note that a fall-back is not by itself the defect. Both
        published cases fall back; only the one whose fall-back crosses a tier boundary returns the split. The order
        of the tiers also decides the answer, because the walk keeps the LAST tier in list order whose threshold is
        reached, which is the highest threshold reached only while the list is sorted, and no gate checks the order.
      </Note>
    </>
  );
};

const Tax = () => {
  const td = useMemo(() => { try { return taxDecomposition('default'); } catch { return null; } }, []);
  const cases = useMemo(() => { try { return taxCases(); } catch { return null; } }, []);
  const uplift = useMemo(() => { try { return upliftSweep(); } catch { return null; } }, []);
  const capex = useMemo(() => { try { return upliftTotalCapex(); } catch { return null; } }, []);
  const [caseId, setCaseId] = useState('minimum_tax_binds');
  if (!td || !cases || !uplift || capex === null) {
    return <Note>The tax decomposition did not run. It is four engine runs of one regime with two of the three charges zeroed in turn, so it needs four ledgers and there are none.</Note>;
  }
  const c = cases.find((x) => x.id === caseId) || cases[0];
  const chart = td.byYear.map((x) => ({ year: x.year, cit: x.citAlone, rrt: x.rrtAlone, min: x.minTaxAlone, published: x.taxAsPublished }));
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        Four engine runs of the Brazil - Concession instruments on the DEFAULT PROJECT, whose CIT is {td.citPct} percent
        and whose RRT stands in for Special Participation at {td.rrtPct} percent. Because the tax rates do not enter the
        base, the stack decomposes exactly: running the same regime with two of the three at zero returns the third on
        its own.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="CIT alone, total" value={mm(td.totalCitAlone)} unit="million USD" />
          <Tile label="RRT alone, total" value={mm(td.totalRrtAlone)} unit="million USD" />
          <Tile label={`Minimum tax alone at ${td.minTaxPct} percent, total`} value={mm(td.totalMinTaxAlone)} unit="million USD" />
          <Tile label="Tax as published, total" value={mm(td.totalTaxAsPublished)} unit="million USD" />
          <Tile label="First year with a positive RRT charge" value={yr(td.firstYearWithRrt)} />
          <Tile label="RRT uplift, percent of the WHOLE capex, every year" value={String(td.rrtUpliftPct)} />
          <Tile label="Total capex on this project" value={mm(capex)} unit="million USD" />
          <Tile label="Uplift relief over the life at 20 percent" value={`${(td.rrtUpliftPct / 100) * 25} times the whole capex`} />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'million USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="cit" name="CIT alone" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="rrt" name="RRT alone" fill="#f472b6" isAnimationActive={false} />
            <Line type="monotone" dataKey="min" name="minimum tax alone" stroke="#fbbf24" dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="published" name="tax as published" stroke="#BFFF00" dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['year', 'grossRevenue', 'profitOil', 'CIT alone', 'RRT alone', 'minimum tax alone', 'tax as published']}
        rows={td.byYear.map((x) => [x.year, mm(x.grossRevenue), mm(x.profitOil), mm(x.citAlone), mm(x.rrtAlone), mm(x.minTaxAlone), mm(x.taxAsPublished)])}
      />
      <p className="text-xs text-slate-500 mt-4 mb-1">The uplift swept, with CIT set to zero so the RRT is the whole of the tax</p>
      <Tbl
        head={['rrtUpliftPct', 'total tax', 'total contractor NCF', 'total government cash flow', 'NPV at 10 percent', 'first year with a positive RRT charge']}
        rows={uplift.map((x) => [x.rrtUpliftPct, mm(x.totalTax), mm(x.totalContractorNCF), mm(x.totalGovernmentTake), mm(x.npvAt10), yr(x.firstYearWithPositiveRrt)])}
      />
      <FieldGrid>
        <SelectField label="Published case" value={c.id} onChange={setCaseId} options={cases.map((x) => [x.id, x.id])} />
      </FieldGrid>
      <p className="text-xs text-slate-400 mt-2 mb-0">{c.note}</p>
      <Tbl
        head={['year', 'grossRevenue', 'profitOil', 'tax']}
        rows={c.head.map((x) => [x.year, mm(x.grossRevenue), mm(x.profitOil), mm(x.tax)])}
      />
      <Note>
        The tax base is the contractor profit share and nothing else. CIT is the rate on that base when it is
        positive. RRT is charged on the base MINUS an annual capital uplift, and only when that is positive. The
        minimum tax is a percent of GROSS revenue, and the tax charged is the larger of the two sums. The uplift is
        the thing to sweep: a parameter named "uplift percent" reads like a one-off capital uplift and behaves like an
        annual allowance, and the only way to know which it is is to move it and watch the tax move. What the stack
        leaves out: no loss carryforward, so a year whose base is negative pays nothing and passes nothing forward;
        no ring fence, no consolidation, no depreciation, no capital allowance, no education tax, no levy on gross
        production. A regime whose real burden lives in an instrument these four fields cannot express cannot be
        modelled here, and the answer is not to bend a rate until the total looks right.
      </Note>
    </>
  );
};

const Rate = () => {
  const sweep = useMemo(() => { try { return discountSweep(); } catch { return null; } }, []);
  const irrs = useMemo(() => { try { return irrCases(); } catch { return null; } }, []);
  const bracket = useMemo(() => { try { return irrBracketEvidence(); } catch { return null; } }, []);
  if (!sweep || !irrs || !bracket) {
    return <Note>The discount sweep did not run. NPV here is year-end discounting over the contractor net cash flow column, so it needs a ledger, and the IRR is a bisection on the same column.</Note>;
  }
  const chart = sweep.map((x) => ({ rate: x.ratePct, yearEnd: x.npvYearEnd, midYear: x.npvMidYearDerived }));
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        NPV here discounts YEAR END: each year contractor net cash flow is divided by one plus the rate raised to the
        year number, and year 1 is already discounted once. The screening engine in the same package discounts MID
        YEAR, and on identical cash flows the mid-year value is larger by exactly the square root of one plus the
        rate. The parity column below is that relation applied to the engine own year-end number.
      </p>
      <Tbl
        head={['rate, percent', 'NPV year end', 'NPV mid year', 'parity ratio']}
        rows={sweep.map((x) => [x.ratePct, mm(x.npvYearEnd), mm(x.npvMidYearDerived), ratio(x.parityRatioDerived)])}
      />
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="rate" tick={AXIS} label={{ value: 'discount rate, percent', position: 'insideBottom', offset: -3, fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'million USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => mm(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="#64748b" />
            <Line type="monotone" dataKey="yearEnd" name="NPV, year end" stroke="#BFFF00" dot isAnimationActive={false} />
            <Line type="monotone" dataKey="midYear" name="NPV, mid year" stroke="#38bdf8" strokeDasharray="4 3" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The five published IRR vectors</p>
      <Tbl
        head={['case', 'cash flows', 'engine, percent', 'golden expects, percent', 'true root, percent', 'NPV at 10 percent', 'agrees']}
        rows={irrs.map((c) => [
          c.id,
          c.cashFlows.map((q) => q.contractorNCF).join(', '),
          pc(c.engineIrrPct), pc(c.goldenExpectedPct),
          c.trueIrrPct === null ? 'not recorded' : pc(c.trueIrrPct),
          mm(c.npvAt10), c.agrees ? 'yes' : 'no',
        ])}
      />
      <p className="text-xs text-slate-500 mt-4 mb-1">
        The bracket made visible. The solver starts at 100 percent and doubles ten times, reaching
        {' '}{pc(bracket.engineIrrPct)} percent; if the NPV is STILL positive there it returns that bound rather than a
        root. The oracle root on this vector is {bracket.trueIrrPct === null ? 'not recorded' : pc(bracket.trueIrrPct)} percent.
      </p>
      <Tbl head={['rate, percent', 'NPV']} rows={bracket.npvByRate.map((x) => [x.ratePct, mm(x.npv)])} />
      <Note>
        The IRR is a bisection with no artificial cap, and it has two failure modes worth naming. It returns 0 when
        the flows never change sign, and 0 when the NPV at a rate of zero is not above zero, so a project that loses
        money at every rate reports 0 percent and a reader who takes that for "breaks even exactly" has it backwards.
        And where the root is past the search range it REPORTS THE BOUND. A suspiciously round number where a rate
        should be is the tell: {pc(bracket.engineIrrPct)} is 100 doubled ten times, and it is not a root.
      </Note>
    </>
  );
};

const InstrumentExplorer = () => {
  const [mode, setMode] = useState('royalty');
  return (
    <PanelShell
      title="Instrument explorer"
      subtitle="One instrument at a time: the sliding scale and which side of a threshold belongs to which tier, cost recovery with its pool and its carryforward, the R factor and the split it selects, the tax stack decomposed, and the rate all of it is discounted at"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'royalty' && <Royalty />}
        {mode === 'recovery' && <Recovery />}
        {mode === 'rfactor' && <RFactor />}
        {mode === 'tax' && <Tax />}
        {mode === 'rate' && <Rate />}
      </div>
    </PanelShell>
  );
};

export default InstrumentExplorer;
