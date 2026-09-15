import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import { OUTCOME_LABELS } from '@petrolord/engines/lib/conventions/percentile.js';
import {
  PRICE_LADDER,
  reservesPerFluid, conceptsAndCapex, scenarioValues, planEconomics, planAndRefusals,
} from './fdpLab';
import { PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note } from '@/components/course/panels/petrophysics/panelKit';

// Plan explorer, the Associate tier. THE PLAN AND ITS MONEY: EGINA's reserves
// totalled per fluid, the concepts and the three capex fields each one carries,
// what a scenario is worth after royalty and tax, and the plan's own cost items
// against the concept's estimate.
//
// Every figure on this page is a return value from fdpLab, which is a return
// value from the vendored FDP Accelerator engines. Nothing here computes a
// barrel, a capex, an NPV or a rate of return, and nothing reads the clock: the
// concept schedule is dated from the concept's own start date.
//
// P-LABELS. Only a reserves distribution carries one, and only one fluid at a
// time: the low case is the exceedance P90 of that fluid, the high case its
// P10. Those labels come from the conventions module and are marked
// data-plabel="reserves". A capex, a cost, a rate, a duration, an index and a
// ratio each carry their own marker, and a gate reads them back out of the
// rendered markup and finds no P-label in them.

const four = (v) => (Number.isFinite(v) ? Number(v).toFixed(4) : 'none');
const six = (v) => (Number.isFinite(v) ? Number(v).toFixed(6) : 'none');

export const MODES = [
  ['reserves', 'Reserves: one total per fluid, and the rows the engine refuses'],
  ['concepts', 'Concepts: three capex fields, lifecycle cost, the shape, the dates'],
  ['scenarios', 'Scenarios: NPV, rate of return, status and payback at five prices'],
  ['costs', 'Costs: the cost items, the phase roll-up, the sweep, the plan with no case'],
];

const AXIS = { fill: '#94a3b8', fontSize: 11 };
const TOOLTIP = { background: '#0f172a', border: '1px solid #334155', fontSize: 11 };

const ReservesLabel = ({ children }) => <span data-plabel="reserves">{children}</span>;
const CapexLabel = ({ children }) => <span data-plabel="capex">{children}</span>;
const CostLabel = ({ children }) => <span data-plabel="cost">{children}</span>;
const RateLabel = ({ children }) => <span data-plabel="rate">{children}</span>;
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

export const ReservesMode = ({ res }) => {
  if (!res) return <Note>The subsurface engine did not return the reserves.</Note>;
  const bars = res.byFluid.map((t) => ({ fluid: `${t.fluid}, ${t.units}`, low: t.p90Sum, best: t.p50Sum, high: t.p10Sum }));
  return (
    <>
      <Tbl
        head={['reservoir', 'fluid',
          <ReservesLabel key="a">{`${OUTCOME_LABELS.p90}, the low case`}</ReservesLabel>,
          <ReservesLabel key="b">{OUTCOME_LABELS.p50}</ReservesLabel>,
          <ReservesLabel key="c">{`${OUTCOME_LABELS.p10}, the high case`}</ReservesLabel>,
          <RatioLabel key="d">recovery factor</RatioLabel>]}
        rows={res.reservoirs.map((r) => [r.name, r.fluid, four(r.p90), four(r.p50), four(r.p10), six(r.rf)])}
      />
      <Tbl
        head={['fluid', 'unit', 'rows',
          <ReservesLabel key="a">{`sum of ${OUTCOME_LABELS.p90}`}</ReservesLabel>,
          <ReservesLabel key="b">{`sum of ${OUTCOME_LABELS.p50}`}</ReservesLabel>,
          <ReservesLabel key="c">{`sum of ${OUTCOME_LABELS.p10}`}</ReservesLabel>]}
        rows={res.byFluid.map((t) => [t.fluid, t.units, t.count, four(t.p90Sum), four(t.p50Sum), four(t.p10Sum)])}
      />
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="fluid" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="low" name="low case" fill="#475569" isAnimationActive={false} />
            <Bar dataKey="best" name="best estimate" fill="#38bdf8" isAnimationActive={false} />
            <Bar dataKey="high" name="high case" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400 mt-2 mb-0">
        Oil reads {four(res.oilP50)} MMbbl and gas {four(res.gasP50)} Bcf. Adding them gives {four(res.addedAcrossFluidsDerived)} of
        nothing: the two are different substances in different units, and the studio never totals across a fluid.
      </p>
      {/* The engine's own note names the reserves cases, so it sits inside a
          reserves span like every other label on this distribution. */}
      <p className="text-xs text-slate-500 mt-2 mb-0"><ReservesLabel>{res.percentileNote}</ReservesLabel></p>
      <Tbl
        head={['a row the engine refuses', 'message']}
        rows={[
          ['a row with no fluid type', res.unlabelledRefusal.error],
          ['a row whose fluid is Brine', res.brineRefusal.error],
          ...res.publishedRefusals.map((c) => [c.name, c.error]),
        ]}
      />
      <Tbl
        head={['published case', 'fluids', 'best estimate per fluid']}
        rows={res.published.map((c) => [c.name, JSON.stringify(c.fluids),
          c.perFluid.map((x) => `${x.fluid} ${four(x.p50Sum)} ${x.units}`).join('; ') || 'no rows'])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label="Oil in place on the Egina Main zone" value={four(res.volumetrics.ooip)} unit="STB" />
          <Tile label="The same figure in millions" value={four(res.volumetrics.ooipMMstbDerived)} unit="MMstb (derived)" />
          <Tile label={<RatioLabel>Field oil against that one zone</RatioLabel>} value={six(res.volumetrics.recoveryFactorImplied)} unit="two different footprints" />
          <Tile label={<RatioLabel>{`${res.volumetrics.likeForLike.reservoirName} against the same zone`}</RatioLabel>} value={six(res.volumetrics.likeForLike.recoveryFactor)} unit={`against the ${six(res.volumetrics.likeForLike.statedRf)} the table states`} />
        </TileGrid>
      </div>
      <Note>
        Wells needed for the field at {res.volumetrics.eurPerWell} MMbbl a well: {res.volumetrics.wellsNeeded}. The plan
        carries {res.volumetrics.wellsInPlan}, and nothing in the studio reconciles the two.
      </Note>
    </>
  );
};

export const ConceptsMode = ({ con }) => {
  if (!con) return <Note>The concept engine did not return the concepts.</Note>;
  const shape = con.shape.rates.map((k, i) => ({ year: i + 1, kbpd: k }));
  return (
    <>
      <Tbl
        head={['concept', 'type', <CapexLabel key="d">drilling</CapexLabel>, <CapexLabel key="f">facilities</CapexLabel>,
          <CapexLabel key="s">subsea</CapexLabel>, <CapexLabel key="t">total capex</CapexLabel>,
          <CostLabel key="o">annual operating cost</CostLabel>, <DurationLabel key="l">life of field, years</DurationLabel>, 'peak kbpd']}
        rows={con.rows.map((c) => [c.name, c.facilityType, four(c.drillingCapex), four(c.facilitiesCapex), four(c.subseaCapex),
          four(c.totalCapex), four(c.opex), four(c.lifeOfField), four(c.peakProduction)])}
      />
      <Tbl
        head={['concept', <CapexLabel key="c">capex</CapexLabel>, <CostLabel key="o">operating cost over the life</CostLabel>, <CostLabel key="l">lifecycle cost</CostLabel>]}
        rows={con.costs.map((c) => [c.name, four(c.totalCapex), four(c.totalOpex), four(c.totalLifecycleCost)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A concept carries its capex in three fields and the engine reads all three. One field alone still totals
        ({four(con.oneFieldOnly.totalCapex)} million USD from facilities of {four(con.oneFieldOnly.facilitiesCapex)}), and a
        concept somebody has already totalled is taken as typed ({four(con.preTotalled.totalCapex)} million USD).
      </p>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={shape} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <ReferenceLine x={con.shape.plateauLastYear} stroke="#BFFF00" strokeDasharray="3 3" label={{ value: 'plateau ends', fill: '#BFFF00', fontSize: 10 }} />
            <Line dataKey="kbpd" name="kbpd" stroke="#38bdf8" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Peak rate" value={four(con.shape.peakProduction)} unit="kbpd" />
          <Tile label={<DurationLabel>Producing years</DurationLabel>} value={String(con.shape.years)} />
          <Tile label={<RatioLabel>Year 4 against year 3</RatioLabel>} value={six(con.shape.declineRatioDerived)} unit="derived" />
          <Tile label="Volume under the shape" value={four(con.shape.volumeMMbblDerived)} unit="MMbbl (derived)" />
        </TileGrid>
      </div>
      <p className="text-xs text-slate-500 mt-2 mb-0">
        The shape is a screening shape and not a reservoir forecast. Nothing in the studio compares the volume under it with
        the plan&apos;s own reserves, and a plan whose profile cannot be fed by its own reserves still scores complete.
      </p>
      <Tbl
        head={['concept', 'sanction', 'first production', <DurationLabel key="d">months</DurationLabel>]}
        rows={con.schedules.map((s) => [s.name, s.fidDate, s.firstOilDate, s.durationMonths])}
      />
      <Note>
        A concept schedule is dated from the concept. With no start date the engine refuses by name:
        {' '}{con.noStartDateRefusal.error}. Dated from {con.datedFromToday.today} the same concept reaches first production
        on {con.datedFromToday.firstOilDate}.
      </Note>
    </>
  );
};

export const ScenariosMode = ({ sc, price, onPrice }) => {
  if (!sc) return <Note>The scenario engine did not return the scenarios.</Note>;
  const ladder = sc.priceLadder.map((x) => ({ price: `${four(x.price)} USD`, npv: x.npv }));
  const row = sc.priceLadder.find((x) => x.price === Number(price)) || sc.priceLadder[0];
  return (
    <>
      <Tbl
        head={['scenario', 'concept', <CostLabel key="p">oil price, USD a barrel</CostLabel>, <CapexLabel key="c">capex</CapexLabel>,
          'NPV, million USD', <RateLabel key="i">rate of return, percent</RateLabel>, 'status',
          <DurationLabel key="y">payback, years</DurationLabel>]}
        rows={sc.rows.map((s) => [s.name, s.conceptName, four(s.oilPrice), four(s.capex), four(s.npv),
          <RateLabel key={s.name}>{s.irr === null ? 'none' : four(s.irr)}</RateLabel>, s.irrStatus,
          s.payback === null ? 'never' : four(s.payback)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        A rate of return of none is an answer. The status beside it says which of the five things happened, and the engine
        reports no rate at all rather than the edge of the band it searched.
      </p>
      <div className="mt-3">
        <TileGrid>
          <Tile label="Base case revenue" value={four(sc.base.totalRevenue)} unit="million USD" />
          <Tile label={<CostLabel>Royalty</CostLabel>} value={four(sc.base.totalRoyalty)} unit="million USD" />
          <Tile label={<CostLabel>Tax</CostLabel>} value={four(sc.base.totalTax)} unit="million USD" />
          <Tile label={<CostLabel>Operating cost</CostLabel>} value={four(sc.base.totalOpex)} unit="million USD" />
          <Tile label={<CostLabel>Government take</CostLabel>} value={four(sc.base.totalGovTake)} unit="million USD" />
          <Tile label={<RatioLabel>Government take over gross revenue</RatioLabel>} value={six(sc.base.govTakeShareDerived)} unit="derived" />
          <Tile label="Deepest cash position" value={four(sc.base.maxExposure)} unit="million USD" />
          <Tile label={<DurationLabel>Cash flow rows in all</DurationLabel>} value={String(sc.cashflowRowCount)} />
        </TileGrid>
      </div>
      <Tbl
        head={['year', 'gross revenue', <CostLabel key="r">royalty</CostLabel>, <CapexLabel key="c">capex</CapexLabel>,
          <CostLabel key="o">operating cost</CostLabel>, <CostLabel key="t">tax</CostLabel>, 'net cash flow', 'cumulative']}
        rows={sc.cashflowRows.map((r) => [r.year, four(r.grossRevenue), four(r.royalty), four(r.capex), four(r.opex),
          four(r.tax), four(r.ncf), four(r.cumulativeNCF)])}
      />
      {onPrice && (
        <FieldGrid>
          <SelectField label="Price ladder (the digest's prices only)" value={String(row.price)} onChange={onPrice}
            options={PRICE_LADDER.map((p) => [String(p), `${four(p)} USD a barrel`])} />
        </FieldGrid>
      )}
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ladder} margin={{ top: 10, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis dataKey="price" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <ReferenceLine y={0} stroke="#94a3b8" />
            <Bar dataKey="npv" name="NPV, million USD" fill="#BFFF00" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3">
        <TileGrid>
          <Tile label={<CostLabel>{`At ${four(row.price)} USD a barrel`}</CostLabel>} value={four(row.npv)} unit="million USD" />
          <Tile label={<RateLabel>Rate of return there</RateLabel>} value={row.irr === null ? `none, ${row.irrStatus}` : four(row.irr)} unit="percent" />
          <Tile label={<RatioLabel>Tie-back value per million of capex</RatioLabel>} value={six(sc.comparison.tieBackPerMillionDerived)} unit="derived" />
          <Tile label={<RatioLabel>FPSO value per million of capex</RatioLabel>} value={six(sc.comparison.fpsoPerMillionDerived)} unit="derived" />
        </TileGrid>
      </div>
      <Note>
        The tie-back earns {four(sc.comparison.tieBackNpv)} million USD on {four(sc.comparison.tieBackCapex)} of capex and the
        FPSO earns {four(sc.comparison.fpsoNpv)} on {four(sc.comparison.fpsoCapex)}. The larger NPV and the better return on
        capex are two different questions, and a screening case answers only the first.
      </Note>
    </>
  );
};

export const CostsMode = ({ pe, rules }) => {
  if (!pe) return <Note>The cost engine did not return the plan.</Note>;
  const bars = pe.sweep.map((s) => ({ driver: s.name, low: s.lowParamNPV, high: s.highParamNPV }));
  return (
    <>
      <Tbl
        head={['cost item', 'type', 'phase', <CostLabel key="a">amount, million USD</CostLabel>]}
        rows={pe.items.map((c) => [c.name, c.type, c.phase, four(c.amount)])}
      />
      <div className="mt-3">
        <TileGrid>
          <Tile label={<CapexLabel>CAPEX total</CapexLabel>} value={four(pe.capexTotal)} unit="million USD" />
          <Tile label={<CostLabel>OPEX total</CostLabel>} value={four(pe.opexTotal)} unit="million USD a year" />
          <Tile label={<CostLabel>The ABEX line</CostLabel>} value={four(pe.abexAmount)} unit="million USD, in neither total" />
          <Tile label={<CapexLabel>The concept&apos;s own capex</CapexLabel>} value={four(pe.conceptCapex)} unit="million USD" />
        </TileGrid>
      </div>
      <Tbl
        head={['phase', <CostLabel key="t">total, million USD</CostLabel>]}
        rows={pe.byPhase.map((x) => [x.phase, four(x.total)])}
      />
      <p className="text-xs text-slate-400 mt-2 mb-0">
        The plan&apos;s own case runs the cost items rather than the concept card: capex {four(pe.planRun.capex)} million USD,
        operating cost {four(pe.planRun.annualOpex)} a year, {pe.planRun.years} producing years at {four(pe.planRun.priceUsd)} USD
        a barrel. NPV {four(pe.planRun.npv)} million USD, rate of return {pe.planRun.irr === null ? 'none' : four(pe.planRun.irr)} percent,
        payback {four(pe.planRun.payback)} years.
      </p>
      <div className="h-48 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} layout="vertical" margin={{ top: 10, right: 20, bottom: 5, left: 70 }}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis type="number" tick={AXIS} />
            <YAxis type="category" dataKey="driver" tick={AXIS} width={70} />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => four(v)} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine x={pe.sweep[0].baseNPV} stroke="#BFFF00" strokeDasharray="3 3" />
            <Bar dataKey="low" name="minus 30 percent" fill="#475569" isAnimationActive={false} />
            <Bar dataKey="high" name="plus 30 percent" fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['driver', 'minus 30 percent', 'plus 30 percent', 'base', 'swing (derived)']}
        rows={pe.sweep.map((s) => [s.name, four(s.lowParamNPV), four(s.highParamNPV), four(s.baseNPV), four(s.swingDerived)])}
      />
      <p className="text-xs text-slate-500 mt-2 mb-0">
        A price deck that does not cover the profile is refused: {pe.priceDeck.shortRefusal.error}. The same profile with a
        price for every year is accepted and returns {four(pe.priceDeck.coveredNpv)} million USD.
      </p>
      {rules && (
        <Tbl
          head={['a figure the plan does not carry', 'what the engine says']}
          rows={rules.probes.map((p) => [p.label, p.ok ? 'accepted' : p.error])}
        />
      )}
      <Note>
        A scenario priced at zero is accepted, because zero is a number somebody typed: it returns
        {' '}{rules ? four(rules.zeroPriceNpv) : 'none'} million USD. A price left blank is refused instead.
      </Note>
    </>
  );
};

const PlanExplorer = ({ initialMode = 'reserves' }) => {
  const [mode, setMode] = useState(initialMode);
  const [price, setPrice] = useState(String(PRICE_LADDER[2]));
  const res = useMemo(() => (mode === 'reserves' ? safe(reservesPerFluid) : null), [mode]);
  const con = useMemo(() => (mode === 'concepts' ? safe(conceptsAndCapex) : null), [mode]);
  const sc = useMemo(() => (mode === 'scenarios' ? safe(scenarioValues) : null), [mode]);
  const pe = useMemo(() => (mode === 'costs' ? safe(planEconomics) : null), [mode]);
  const rules = useMemo(() => (mode === 'costs' ? safe(planAndRefusals) : null), [mode]);

  return (
    <PanelShell
      title="Plan explorer"
      subtitle="EGINA, a development plan in million USD: reserves totalled per fluid, the concepts and their capex, what a scenario is worth after royalty and tax, and the plan's own cost items."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'reserves' && <ReservesMode res={res} />}
        {mode === 'concepts' && <ConceptsMode con={con} />}
        {mode === 'scenarios' && <ScenariosMode sc={sc} price={price} onPrice={setPrice} />}
        {mode === 'costs' && <CostsMode pe={pe} rules={rules} />}
      </div>
    </PanelShell>
  );
};

export default PlanExplorer;
