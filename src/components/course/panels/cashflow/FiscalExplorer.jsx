import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine,
} from 'recharts';
import {
  AKATA_YEARS, PSC_CAP_SWEEP_PCT,
  akataUnderPsc, akataPscCapSweep, applyPscTable, pscCases,
  royaltyTables, terrainCases,
  akataUnderPia, akataPiaYearWaterfall, akataPiaVariants,
  lossReliefCases, applyJvPoolTable,
  akataTail, economicLimitCases, abandonmentCases, akataAbandoned, akataDelaySweep, distrustTable,
} from './cashflowLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Fiscal explorer, the Expert tier. THE FISCAL EDGES: production sharing cost
// recovery, the PIA royalty and tax cascade under the 2021 Act and the 2025
// framework switch, loss relief, the economic limit, abandonment as a lump sum
// and as a sinking fund, first-oil delay, and three numbers the engine reports
// that a careful reader must distrust.
//
// Every figure on this page is a return value from cashflowLab, which is a
// return value from the vendored cashflow engine. The one march on this page,
// the cost recovery pool, is the engine's own applyPSC walked over the
// engine's own rows, because the rows never carry the pool.

const usd = (v) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  : 'null');
const num = (v, d = 2) => (Number.isFinite(v)
  ? Number(v).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 })
  : 'null');
const pc = (v, d = 4) => (Number.isFinite(v) ? `${num(v, d)} percent` : 'null');
const frac = (v) => (Number.isFinite(v) ? num(v, 6) : 'null');
const yn = (b) => (b ? 'yes' : 'no');

const MODES = [
  ['costRecovery', 'Cost recovery: the pool the rows never carry'],
  ['royalties', 'Royalties: terrain, the marginal blend, the price anchors'],
  ['cascade', 'The PIA cascade: five taxes on three bases'],
  ['losses', 'Loss relief and the pool'],
  ['endOfLife', 'End of life: the limit, abandonment, delay, and three numbers to distrust'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };
const GRID = <CartesianGrid stroke="#334155" strokeDasharray="3 3" />;
const compact = (v) => (Math.abs(v) >= 1e6 ? `${num(v / 1e6, 1)}M` : num(v, 0));
const COLORS = ['#f87171', '#f97316', '#BFFF00', '#38bdf8', '#a78bfa'];

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

const CostRecovery = () => {
  const [cap, setCap] = useState('60');
  const one = useMemo(() => { try { return akataUnderPsc(Number(cap)); } catch { return null; } }, [cap]);
  const sweep = useMemo(() => { try { return akataPscCapSweep(); } catch { return null; } }, []);
  const table = useMemo(() => { try { return applyPscTable(); } catch { return null; } }, []);
  const pub = useMemo(() => { try { return pscCases(); } catch { return null; } }, []);
  if (!one || !sweep || !table || !pub) {
    return <Note>The production sharing run did not return. A PSC ledger needs a royalty, a cost oil cap, a contractor profit share and a tax rate, and one of them is missing.</Note>;
  }
  const chart = AKATA_YEARS.map((year) => {
    const row = { year };
    sweep.forEach((s) => { row[`cap ${s.capPct}`] = s.march.find((m) => m.year === year)?.poolAfter ?? null; });
    return row;
  });
  return (
    <>
      <FieldGrid>
        <SelectField label="Cost oil cap, percent of revenue after royalty" value={cap} onChange={setCap} options={PSC_CAP_SWEEP_PCT.map((c) => [String(c), `${c} percent`])} />
      </FieldGrid>
      <div className="mt-3 rounded-md border border-amber-700 bg-amber-900/20 p-3 text-xs text-amber-100">
        THE ROWS NEVER CARRY THE POOL. A PSC row reports royalty, taxable income (the contractor profit oil), tax and
        net cash flow, and nothing about how much cost was recovered or how much is still carried; no KPI reports the
        pool left at cessation either (the engine reports {one.unrecoveredAtCessationReported === null ? 'nothing' : usd(one.unrecoveredAtCessationReported)} for it here).
        The pool below is read by marching the engine's own applyPSC over the rows the engine produced, year by
        year, with the carried amount handed forward exactly as computeCashFlow does internally.
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="NPV" value={usd(one.kpis.npv)} unit="USD" />
          <Tile label="IRR" value={one.kpis.irr === null ? 'null' : pc(one.kpis.irr)} />
          <Tile label="Payback" value={one.kpis.payback} />
          <Tile label="Take" value={pc(one.kpis.government_take_pct)} />
          <Tile label="Pool at cessation, by the march" value={usd(one.poolAtCessation)} unit="USD" />
          <Tile label="Contractor profit share" value={pc(one.cfg.psc_contractor_profit_share_pct, 2)} />
          <Tile label="Royalty" value={pc(one.cfg.psc_royalty_pct, 2)} />
          <Tile label="PSC tax rate" value={pc(one.cfg.psc_tax_rate_pct, 2)} />
        </TileGrid>
      </div>
      <Tbl
        head={['year', 'gross revenue', 'royalty (row)', 'cost in, capex plus opex', 'pool before (march)', 'recovered (march)', 'pool after (march)', 'contractor profit oil (row)', 'tax (row)', 'net cash flow (row)']}
        rows={one.rows.map((r, i) => [r.year, usd(r.gross_revenue), usd(r.royalty), usd(one.march[i].costIn), usd(one.march[i].poolBefore), usd(one.march[i].recovered), usd(one.march[i].poolAfter), usd(r.taxable_income), usd(r.tax), usd(r.net_cash_flow)])}
      />
      <div className="h-64 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chart} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            {GRID}
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'pool carried at year end, USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {sweep.map((s, i) => (
              <Line key={s.capPct} type="monotone" dataKey={`cap ${s.capPct}`} stroke={COLORS[i]} strokeWidth={String(s.capPct) === cap ? 3 : 1} dot={false} isAnimationActive={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['cap, %', 'NPV, USD', 'IRR, %', 'payback', 'take, %', 'pool at cessation', 'recovered by year']}
        rows={sweep.map((s) => [s.capPct, usd(s.kpis.npv), s.kpis.irr === null ? 'null' : num(s.kpis.irr, 4), s.kpis.payback, num(s.kpis.government_take_pct, 4), usd(s.poolAtCessation), s.march.map((m) => num(m.recovered, 0)).join(', ')])}
        highlight={sweep.findIndex((s) => String(s.capPct) === cap)}
      />
      <div className="mt-3 text-xs text-slate-300">
        At a 30 percent cap the pool GROWS through the life of the field, because the cap recovers less cost each
        year than the opex adds to it, and the contractor is paid profit oil on a field that never repaid its
        capital. At 60 percent the pool empties in the sixth year. At 80 and 100 percent it empties in the third
        and second, after which the take stops moving with the cap, because once the pool is empty the cap binds
        on nothing. That last column is what a cost recovery negotiation is actually about, and no row carries it.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">applyPSC on one year, the cap moving: gross revenue {usd(table.base.gross_revenue)}, capex {usd(table.base.capex)}, opex {usd(table.base.opex)}, nothing carried in</p>
      <Tbl
        head={['cap', 'royalty', 'cost recovered', 'contractor profit oil', 'tax', 'net', 'carried forward']}
        rows={[
          ...table.caps.map((c) => [frac(c.cap), usd(c.royalty), usd(c.costRecovered), usd(c.contractorProfitOil), usd(c.tax), usd(c.net), usd(c.carriedForward)]),
          [`${frac(table.carryIn.cap)} with ${usd(table.carryIn.broughtForward)} brought forward`, usd(table.carryIn.royalty), usd(table.carryIn.costRecovered), usd(table.carryIn.contractorProfitOil), usd(table.carryIn.tax), usd(table.carryIn.net), usd(table.carryIn.carriedForward)],
        ]}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Tranche table" value={JSON.stringify(table.tranches)} />
          <Tile label="Contractor share by cumulative liquids" value={table.trancheTable.map((t) => `${num(t.cumulativeBbl, 0)} bbl: ${frac(t.contractorShare)}`).join('; ')} />
          <Tile label="Investment tax credit available" value={usd(table.itc.available)} unit="USD" />
          <Tile label="Credit used, carried, tax before credit" value={`${usd(table.itc.used)}, ${usd(table.itc.carried)}, ${usd(table.itc.taxBeforeCredit)}`} unit="USD" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The published production sharing cases</p>
      <Tbl
        head={['case', 'note', 'NPV, USD', 'IRR, %', 'take, %', 'reported WI', 'unrecovered at cessation']}
        rows={pub.map((p) => [p.name, <span key={p.name} className="whitespace-normal">{p.note}</span>, usd(p.kpis.npv), p.kpis.irr === null ? 'null' : num(p.kpis.irr, 4), p.kpis.government_take_pct === null || p.kpis.government_take_pct === undefined ? 'null' : num(p.kpis.government_take_pct, 4), p.reportedWiPct ?? 'not reported', p.unrecoveredAtCessation === null ? 'not reported' : usd(p.unrecoveredAtCessation)])}
      />
      <Note>
        A tranche table moves the contractor share on cumulative liquids, and the credit is taken against PSC tax
        with the unused part carried. Both are read off the same rows as the pool is, and like the pool, neither
        tells you from a single row what was carried in to make it.
      </Note>
    </>
  );
};

const Royalties = () => {
  const t = useMemo(() => { try { return royaltyTables(); } catch { return null; } }, []);
  const cases = useMemo(() => { try { return terrainCases(); } catch { return null; } }, []);
  if (!t || !cases) {
    return <Note>The royalty derivations did not return. Each rate is a pure function of terrain, rate and year, so there is nothing else to be missing.</Note>;
  }
  const bopd = t.oilByTerrain[0].byRate.map((q) => q.bopd);
  const prices = t.priceAnchors[0].byPrice.map((q) => q.price);
  return (
    <>
      <p className="text-xs text-slate-500 mb-1">The production royalty rate by terrain and daily rate (deriveOilRoyaltyRate), as a fraction of gross revenue</p>
      <Tbl
        head={['terrain', ...bopd.map((b) => `${num(b, 0)} bopd`)]}
        rows={t.oilByTerrain.map((r) => [r.terrain, ...r.byRate.map((q) => frac(q.rate))])}
        highlight={t.oilByTerrain.findIndex((r) => r.terrain === 'marginal_field')}
      />
      <div className="mt-3 text-xs text-slate-300">
        Four of the five terrains are flat across the rate probes, and deep offshore steps once at 50000 bopd. The
        MARGINAL FIELD is the blend: its rate rises with daily production because the low tier applies to the first
        barrels and the higher tier to the rest, so the rate the field pays is a weighted average that climbs from
        the deep-offshore floor toward the onshore ceiling and never reaches it.
      </div>
      <div className="mt-3">
        <TileGrid>
          {t.gasByTerrain.map((g) => <Tile key={g.terrain} label={`Gas royalty, ${g.terrain}`} value={frac(g.rate)} />)}
        </TileGrid>
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The price royalty (derivePriceRoyaltyRate), shallow water: the anchors escalate at 2 percent a year from 2021</p>
      <Tbl
        head={['year', ...prices.map((p) => `${num(p, 0)} USD/bbl`)]}
        rows={t.priceAnchors.map((r) => [r.year, ...r.byPrice.map((q) => frac(q.rate))])}
      />
      <div className="mt-3 text-xs text-slate-300">
        Read a column downward. The price at which the royalty starts, and the price at which it reaches its
        10 percent ceiling, both move up by 2 percent a year from 2021, so the same 100 USD barrel pays less
        price royalty every year the anchors escalate, and by 2035 a price that paid 5 percent in 2021 pays
        about half that. The frontier terrain is exempt: 200 USD in 2025 gives {frac(t.frontierAt200In2025)}.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The hydrocarbon tax rate (deriveHctRate) by terrain, licence, framework and interpretation</p>
      <Tbl head={['case', 'HCT rate']} rows={t.hctRates.map((r) => [r.label, frac(r.rate)])} />
      <p className="text-xs text-slate-500 mt-4 mb-1">The published terrain cases</p>
      <Tbl
        head={['case', 'note', 'framework', 'NPV, USD', 'royalties', 'HCT', 'CIT', 'take, %', 'reported WI']}
        rows={cases.map((c) => [c.name, <span key={c.name} className="whitespace-normal">{c.note}</span>, c.framework, usd(c.kpis.npv), usd(c.totalRoyalties), usd(c.totalHct), usd(c.totalCit), c.kpis.government_take_pct === null || c.kpis.government_take_pct === undefined ? 'null' : num(c.kpis.government_take_pct, 4), c.reportedWiPct ?? 'not reported'])}
      />
      <Note>
        The deep offshore HCT rows are the ones that carry a decision rather than a fact. Under the 2021 Act a deep
        offshore PML pays no hydrocarbon tax; under the 2025 framework the conservative reading keeps it at zero and
        the aggressive reading charges 30 percent, and the engine will run either. The terrain string and the
        interpretation string move more value than most of the numeric inputs on this page.
      </Note>
    </>
  );
};

const Cascade = () => {
  const [year, setYear] = useState(String(AKATA_YEARS[0]));
  const w = useMemo(() => { try { return akataPiaYearWaterfall(Number(year)); } catch { return null; } }, [year]);
  const pia = useMemo(() => { try { return akataUnderPia(); } catch { return null; } }, []);
  const variants = useMemo(() => { try { return akataPiaVariants(); } catch { return null; } }, []);
  if (!w || !pia || !variants) {
    return <Note>The PIA run did not return. A PIA ledger needs a terrain, a licence type, a lease status and a base year before any rate can be derived.</Note>;
  }
  const bars = w.taxes.map((t) => ({ name: t.name, amount: t.amount }));
  return (
    <>
      <FieldGrid>
        <SelectField label="One year of the teaching field under the PIA" value={year} onChange={setYear} options={AKATA_YEARS.map((y) => [String(y), String(y)])} />
      </FieldGrid>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Framework the base year selects" value={w.framework} />
          <Tile label="Gross revenue" value={usd(w.grossRevenue)} unit="USD" />
          <Tile label="Cost recovery: cap, claimed, deferred" value={`${usd(w.costRecovery.cap)}, ${usd(w.costRecovery.claimed)}, ${usd(w.costRecovery.deferred)}`} unit="USD" />
          <Tile label="Production allowance" value={`${usd(w.allowance.amount)} on ${num(w.allowance.eligibleBbl, 0)} bbl, cap applied ${yn(w.allowance.capApplied)}`} />
          <Tile label="Total tax in the year" value={usd(w.totalTax)} unit="USD" />
          <Tile label="Net cash flow" value={usd(w.netCashFlow)} unit="USD" />
          <Tile label="HCDT and NDDC levies" value={`${usd(w.levies.hcdt)}, ${usd(w.levies.nddc)}`} unit="USD" />
          <Tile label="Discounted cash flow" value={usd(w.discountedCashFlow)} unit="USD" />
        </TileGrid>
      </div>
      <div className="h-56 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 16, bottom: 5, left: 20 }}>
            {GRID}
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={AXIS} tickFormatter={compact} label={{ value: 'USD', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => usd(v)} />
            <Bar dataKey="amount" name="tax in the year" isAnimationActive={false}>
              {bars.map((b, i) => <Cell key={b.name} fill={COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['tax', 'charged on', 'base, USD', 'amount, USD', 'inside the base']}
        rows={w.taxes.map((t) => [t.name, t.base, usd(t.baseValue), usd(t.amount), Object.entries(t.parts).map(([k, v]) => `${k} ${usd(v)}`).join('; ')])}
      />
      <div className="mt-3 text-xs text-slate-300">
        Five taxes, three bases. Royalty is charged on GROSS REVENUE, in two parts: a production royalty by terrain
        and a price royalty by year. The hydrocarbon tax is charged on the HCT CHARGEABLE PROFIT, which is revenue
        less royalty less the costs the cost recovery cap lets through less the production allowance. The companies
        income tax is charged on the CIT CHARGEABLE PROFIT, a different base that does not get the allowance. The
        tertiary education tax and the development levy share the CIT assessable profit, and only one of them is
        ever charged: the base year decides which. The base decides more than the rate does.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The whole cascade, one row per year</p>
      <Tbl
        head={['year', 'gross revenue', 'production royalty', 'price royalty', 'CPR claimed', 'CPR deferred', 'allowance', 'HCT chargeable', 'HCT', 'CIT chargeable', 'CIT', 'TET', 'dev levy', 'tax', 'net cash flow']}
        rows={pia.rows.map((r) => [r.year, usd(r.gross_revenue), usd(r.production_royalty), usd(r.price_royalty), usd(r.cpr_costs_claimed), usd(r.cpr_deferred_to_next), usd(r.production_allowance), usd(r.hct_chargeable_profit), usd(r.hct_tax), usd(r.cit_chargeable_profit), usd(r.cit_tax), usd(r.tet_tax), usd(r.dev_levy_tax), usd(r.tax), usd(r.net_cash_flow)])}
        highlight={pia.rows.findIndex((r) => r.year === Number(year))}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Royalties, life of field" value={usd(pia.totalRoyalties)} unit="USD" />
          <Tile label="HCT" value={usd(pia.totalHct)} unit="USD" />
          <Tile label="CIT" value={usd(pia.totalCit)} unit="USD" />
          <Tile label="Development levy, and TET" value={`${usd(pia.totalDevLevy)}, ${usd(pia.totalTet)}`} unit="USD" />
          <Tile label="Total tax under the PIA" value={usd(pia.totalTax)} unit="USD" />
          <Tile label="Total tax under joint venture terms" value={usd(pia.jv.totalTax)} unit="USD" />
          <Tile label="NPV under the PIA" value={usd(pia.kpis.npv)} unit="USD" />
          <Tile label="NPV under joint venture terms" value={usd(pia.jv.npv)} unit="USD" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The terrain, lease and framework variants, side by side</p>
      <Tbl
        head={['variant', 'framework', 'year 1 production royalty', 'year 1 price royalty', 'year 1 allowance', 'year 1 HCT', 'year 1 CIT', 'year 1 TET', 'year 1 dev levy', 'HCT, life', 'CIT, life', 'total tax', 'NPV, USD', 'IRR, %', 'take, %']}
        rows={variants.map((v) => [v.label, v.framework, usd(v.year1.productionRoyalty), usd(v.year1.priceRoyalty), usd(v.year1.allowance), usd(v.year1.hct), usd(v.year1.cit), usd(v.year1.tet), usd(v.year1.devLevy), usd(v.totalHct), usd(v.totalCit), usd(v.totalTax), usd(v.npv), v.irrPct === null ? 'null' : num(v.irrPct, 4), num(v.takePct, 4)])}
      />
      <Note>
        Read the NPV column against the oil price rows and the terrain rows. Moving the same field to deep
        offshore under the conservative reading zeroes the hydrocarbon tax and roughly triples the NPV; the
        aggressive reading gives back most of that. The terrain string moves NPV by more than the oil price
        sweep from 82 to 120 does, and a new lease with prior production near the allowance cap moves it again.
      </Note>
    </>
  );
};

const Losses = () => {
  const cases = useMemo(() => { try { return lossReliefCases(); } catch { return null; } }, []);
  const pool = useMemo(() => { try { return applyJvPoolTable(); } catch { return null; } }, []);
  if (!cases || !pool) {
    return <Note>The loss relief cases did not run. Loss relief is a pool carried between years, and there are no years.</Note>;
  }
  return (
    <>
      <p className="text-xs text-slate-500 mb-1">The published loss relief cases</p>
      <Tbl
        head={['case', 'note', 'regime', 'NPV, USD', 'IRR, %', 'take, %', 'losses unused at cessation', 'schedule shift']}
        rows={cases.map((c) => [c.name, <span key={c.name} className="whitespace-normal">{c.note}</span>, c.regime, usd(c.kpis.npv), c.kpis.irr === null ? 'null' : num(c.kpis.irr, 4), c.kpis.government_take_pct === null || c.kpis.government_take_pct === undefined ? 'null' : num(c.kpis.government_take_pct, 4), c.taxLossesUnusedAtCessation === null ? 'not reported' : usd(c.taxLossesUnusedAtCessation), c.scheduleShiftYears ?? 'not reported'])}
      />
      <div className="mt-3 text-xs text-slate-300">
        A loss year banks its negative taxable income in a pool and the next profitable year draws it down before
        tax is charged. The kill switch clamps taxable income at zero instead and the pool never forms, so the
        second year pays tax on its whole profit. A pool left over at cessation is reported and not refunded.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">
        applyJV on one year with a loss pool brought forward: gross revenue {usd(pool.inputs.gross_revenue)}, opex {usd(pool.inputs.opex)},
        depreciation {usd(pool.inputs.depreciation)}, royalty 20 percent, tax 50 percent
      </p>
      <Tbl
        head={['pool brought forward', 'taxable', 'offset used', 'tax', 'net', 'pool after', 'tax with relief off', 'pool after with relief off']}
        rows={pool.rows.map((r) => [usd(r.poolBroughtForward), usd(r.taxable), usd(r.offsetUsed), usd(r.tax), usd(r.net), usd(r.poolAfter), usd(r.taxWithReliefOff), usd(r.poolAfterWithReliefOff)])}
      />
      <div className="mt-3 rounded-md border border-gray-700 bg-[#0F172A] p-3 text-xs text-slate-300">
        A year with no revenue, opex {usd(5000000)} and depreciation {usd(10000000)}: taxable {usd(pool.lossYear.taxable)}, tax
        {' '}{usd(pool.lossYear.tax)}, pool after {usd(pool.lossYear.poolAfter)}, net {usd(pool.lossYear.net)}.
      </div>
      <Note>
        The offset can never exceed the year's taxable income, which is why a pool of 15000000 against a taxable
        10000000 uses 10000000 and carries 5000000, and a pool of 40000000 uses the same 10000000 and carries
        30000000. Relief is a timing benefit and not a refund: the tax saved in the good year is exactly the tax
        rate times the loss, never more.
      </Note>
    </>
  );
};

const EndOfLife = () => {
  const tail = useMemo(() => { try { return akataTail(); } catch { return null; } }, []);
  const elt = useMemo(() => { try { return economicLimitCases(); } catch { return null; } }, []);
  const ab = useMemo(() => { try { return abandonmentCases(); } catch { return null; } }, []);
  const abA = useMemo(() => { try { return akataAbandoned(); } catch { return null; } }, []);
  const delay = useMemo(() => { try { return akataDelaySweep(); } catch { return null; } }, []);
  const dist = useMemo(() => { try { return distrustTable(); } catch { return null; } }, []);
  if (!tail || !elt || !ab || !abA || !delay || !dist) {
    return <Note>The end-of-life cases did not run. The limit, the abandonment and the delay all rerun the ledger, and there is no ledger.</Note>;
  }
  const firstUneconomic = tail.limitOff.byYear.find((q) => q.opex > q.revenueLessRoyalty);
  return (
    <>
      <p className="text-xs text-slate-500 mb-1">The teaching field with a six-year tail, the economic limit off and on</p>
      <div className="mt-1">
        <TileGrid>
          <Tile label="Limit OFF: rows, last year" value={`${tail.limitOff.rows}, ${tail.limitOff.lastYear}`} />
          <Tile label="Limit OFF: NPV" value={usd(tail.limitOff.npv)} unit="USD" />
          <Tile label="Limit OFF: IRR" value={pc(tail.limitOff.irrPct)} />
          <Tile label="Limit OFF: total net cash flow" value={usd(tail.limitOff.totalNetCashFlow)} unit="USD" />
          <Tile label="Limit ON: rows, last year" value={`${tail.limitOn.rows}, ${tail.limitOn.lastYear}`} />
          <Tile label="Limit ON: NPV" value={usd(tail.limitOn.npv)} unit="USD" />
          <Tile label="Limit ON: economic limit year, years trimmed" value={`${tail.limitOn.economicLimitYear}, ${tail.limitOn.yearsTrimmed}`} />
          <Tile label="Limit ON: total net cash flow" value={usd(tail.limitOn.totalNetCashFlow)} unit="USD" />
        </TileGrid>
      </div>
      <Tbl
        head={['year', 'revenue less royalty', 'opex', 'uneconomic', 'net cash flow, limit off', 'kept with the limit on']}
        rows={tail.limitOff.byYear.map((q) => [q.year, usd(q.revenueLessRoyalty), usd(q.opex), yn(q.opex > q.revenueLessRoyalty), usd(q.net), yn(tail.limitOn.byYear.some((k) => k.year === q.year))])}
        highlight={firstUneconomic ? tail.limitOff.byYear.findIndex((q) => q.year === firstUneconomic.year) : -1}
      />
      <Tbl
        head={['limit on at oil price', 'economic limit year', 'years trimmed', 'rows', 'NPV, USD']}
        rows={tail.atPrice.map((r) => [r.oilPrice, r.economicLimitYear, r.yearsTrimmed, r.rows, usd(r.npv)])}
      />
      <div className="mt-3 text-xs text-slate-300">
        The limit test compares revenue less royalty against opex, year by year from the end, and trims the trailing
        years where opex wins. With the test off the field is carried through {tail.limitOff.lastYear} and the tail
        years subtract value; with it on the ledger stops at {tail.limitOn.lastYear} and both the NPV and the total
        rise. A tail kept because the limit test is off is one of the two places a terminal negative comes from.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The published economic limit cases</p>
      <Tbl
        head={['case', 'note', 'regime', 'limit on', 'NPV, USD', 'economic limit year', 'years trimmed', 'rows']}
        rows={elt.map((c) => [c.name, <span key={c.name} className="whitespace-normal">{c.note}</span>, c.regime, yn(c.limitOn), usd(c.kpis.npv), c.economicLimitYear ?? 'not reported', c.yearsTrimmed ?? 'not reported', c.rows.length])}
      />
      <p className="text-xs text-slate-500 mt-4 mb-1">Abandonment on the teaching field, six ways</p>
      <Tbl
        head={['variant', 'rows', 'contributions by year', 'abandonment cost by year', 'total tax', 'total contributions', 'total_abandonment_cost', 'NPV, USD', 'IRR, %', 'unit technical cost']}
        rows={abA.map((a) => [a.label, a.rows, a.byYear.map((q) => num(q.contribution, 0)).join(', '), a.byYear.map((q) => num(q.abandonmentCost, 0)).join(', '), usd(a.totalTax), a.totalFundContributions === null ? 'not reported' : usd(a.totalFundContributions), usd(a.totalAbandonmentCost), usd(a.npv), a.irrPct === null ? 'null' : num(a.irrPct, 4), num(a.unitTechnicalCost, 6)])}
      />
      <div className="mt-3 text-xs text-slate-300">
        A lump sum lands post-tax in the final year and makes the last flow negative. A sinking fund spreads the
        same amount as equal annual contributions from its start year, each one deductible in the regime base, so
        the tax falls year by year and the end-of-life spend is paid from the fund with no second cash hit. The
        two funding modes give different NPVs and different IRRs for the same abandonment because they put the
        same money in different years.
      </div>
      <p className="text-xs text-slate-500 mt-4 mb-1">The published abandonment cases</p>
      <Tbl
        head={['case', 'regime', 'funding mode', 'abandonment year', 'total_abandonment_cost', 'total contributions', 'final row abandonment cost', 'reported WI', 'unit technical cost', 'NPV, USD']}
        rows={ab.map((c) => [c.name, c.regime, c.fundingMode, c.abandonmentYear ?? 'not reported', usd(c.totalAbandonmentCost), c.totalFundContributions === null ? 'not reported' : usd(c.totalFundContributions), usd(c.finalRowAbandonmentCost), c.reportedWiPct ?? 'not reported', num(c.unitTechnicalCost, 6), usd(c.kpis.npv)])}
      />
      <p className="text-xs text-slate-500 mt-4 mb-1">First oil delayed: production and opex shift, the committed capex does not</p>
      <Tbl
        head={['shift, years', 'rows', 'years', 'first-year net', 'NPV, USD', 'IRR, %', 'payback', 'loss pool after year one']}
        rows={delay.map((d) => [d.shiftYears, d.rows, d.byYear.map((q) => q.year).join(', '), usd(d.byYear[0].net), usd(d.npv), num(d.irrPct, 4), d.payback, usd(d.lossPoolAfterYearOne)])}
      />
      <div className="mt-3 rounded-md border-2 border-rose-500 bg-rose-900/30 p-3">
        <p className="text-rose-200 font-bold text-sm mb-2">THREE NUMBERS TO DISTRUST</p>
        <p className="text-xs text-rose-100 mb-1">1. The profile point at the applied rate is evaluated at the rate rounded to two decimals.</p>
        <Tbl
          head={['case', 'engine profile point', 'at, %', 'headline or oracle', 'at, %', 'gap, USD']}
          rows={dist.profileGap.map((g) => [g.case, usd(g.engineNpv), num(g.engineRatePct, 6), usd(g.oracleNpv), num(g.oracleRatePct, 6), usd(g.gap)])}
        />
        <p className="text-xs text-rose-100 mt-3 mb-1">2. IRR on a multi-root profile is whichever root Newton reaches from 10 percent, unflagged.</p>
        <Tbl
          head={['vector', 'flows', 'engine IRR, %', 'oracle IRR, %', 'gap, percentage points']}
          rows={dist.twoRoots.map((r) => [r.name, `[${r.flows.join(', ')}]`, num(r.engineIrrPct, 4), num(r.oracleIrrPct, 4), num(r.gap, 4)])}
        />
        <p className="text-xs text-rose-100 mt-3 mb-1">3. The sinking fund is working-interest scaled and the lump sum is not.</p>
        <Tbl
          head={['case', 'WI, %', 'mode', 'total contributions', 'total_abandonment_cost', 'final row abandonment cost', 'unit technical cost', 'total boe']}
          rows={dist.sinkingFund.map((s) => [s.case, s.wiPct, s.mode, s.totalContributions === null ? 'not reported' : usd(s.totalContributions), usd(s.totalAbandonmentCost), s.finalRowAbandonmentCost === undefined ? '' : usd(s.finalRowAbandonmentCost), num(s.unitTechnicalCost, 6), num(s.totalBoe, 2)])}
        />
      </div>
      <Note>
        The third row of the last table is the one to carry away. At 50 percent working interest the sinking fund
        collects half the abandonment cost in contributions while total_abandonment_cost still reports the whole of
        it; at 60 percent the lump sum charges the whole cost against the partner's share of the flows. One of those
        is scaled and the other is not, and the KPI does not say which.
      </Note>
    </>
  );
};

const FiscalExplorer = () => {
  const [mode, setMode] = useState('costRecovery');
  return (
    <PanelShell
      title="Fiscal explorer"
      subtitle="Cost recovery and the pool the rows never carry, the PIA royalties by terrain and price, five taxes on three bases, loss relief, the economic limit, abandonment two ways, first-oil delay, and three numbers to distrust"
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'costRecovery' && <CostRecovery />}
        {mode === 'royalties' && <Royalties />}
        {mode === 'cascade' && <Cascade />}
        {mode === 'losses' && <Losses />}
        {mode === 'endOfLife' && <EndOfLife />}
      </div>
    </PanelShell>
  );
};

export default FiscalExplorer;
