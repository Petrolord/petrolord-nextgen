import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell,
} from 'recharts';
import {
  GAS_PRESETS, presetRows, routeTemplatesAt, screensAt, egbemaLimits, blankLimits, yieldChecksAt, yieldRefusalsAt,
  studioLpgAt, egbemaRouteInputs, egbemaParcel, routeYearAt, routeYearsAt, scalingExponentsAt, COUNTERFACTUAL_PRESETS,
  egbemaCounterfactualInputs, counterfactualAt, counterfactualsAt, egbemaCreditInputs, creditsAt, bidAt, ROUTE_IDS,
  fmt, plain,
} from './gasvalueLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, txt, usable, Tbl, Refusal, EngineNote, Note, Lead, Labelled, Empty, safe, NumBox,
  Button, Missing, Basis,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Route explorer, the Professional tier throughout.
//
// FOUR WAYS TO SELL A FLARE. The route templates carry requirement envelopes
// with every limit unset; the learner sets the limits, and each check reads
// pass, fail or unchecked. A route yields no more than the gas holds, a year is
// assembled and handed on undiscounted, only the recovered share of the flare
// is avoided against a declared counterfactual, and the credit test and the bid
// table follow. Every figure is a return value of the vendored flareToValue
// module (and modularRefinery's power law) through the teaching lab.
//
// A BLANK COST IS NAMED; A BLANK RECOVERY OR DAYS IS REFUSED. Both are the
// engine's behaviour, shown as the engine returns it.

export const MODES = [
  ['screen', 'Screening: the four envelopes and the limits you set'],
  ['yield', 'What the gas can yield: each route against its ceiling'],
  ['year', "A route's year: product, revenue, cost, margin and capital"],
  ['counterfactual', 'The counterfactual: only the recovered share is avoided'],
  ['credits', 'Credits: the breakeven credit price'],
  ['bid', 'The bid table'],
];

const ROUTE_OPTIONS = ROUTE_IDS.map((id) => [id, id]);
const GAS_OPTIONS = GAS_PRESETS.map(([id, label]) => [id, label]);

const TextBox = ({ label, value, onChange }) => (
  <div>
    <Label className="text-gray-400 text-xs mb-1 block">{label}</Label>
    <Input
      type="text"
      value={value === null || value === undefined ? '' : value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-700 text-white border-gray-600 h-8 text-sm"
    />
  </div>
);

// ---------------------------------------------------------------------------

export const ScreenMode = ({ templates, screens, limits, onLimit, onStudy, onUnset }) => {
  if (!usable(templates) || !Array.isArray(templates.templates)) return <Empty>The route templates reader has returned nothing.</Empty>;
  const S = Array.isArray(screens) ? screens : [];
  const L = usable(limits) ? limits : {};
  return (
    <>
      <EngineNote>{templates.note}</EngineNote>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button onClick={onStudy}>The EGBEMA study&apos;s limits</Button>
        <Button onClick={onUnset}>Every limit unset, as the studio opens</Button>
      </div>
      {templates.templates.map((t) => {
        const s = S.find((x) => x.routeId === t.id) || null;
        return (
          <div key={t.id} className="mt-3 rounded-md border border-gray-700 p-3">
            <p className="text-white text-sm font-medium mb-1">
              {t.label}
              <span className="ml-2 text-xs text-slate-400">yield in {t.yieldBasis.unit}, ceiling on the {t.yieldBasis.ceiling}</span>
            </p>
            <FieldGrid>
              {t.requirements.map((q) => (
                <NumBox
                  key={q.key}
                  label={`${q.label} (${q.direction}), ${q.unit}`}
                  value={(L[t.id] || {})[q.key]}
                  onChange={(v) => onLimit(t.id, q.key, v)}
                />
              ))}
            </FieldGrid>
            {t.requirements.filter((q) => q.note).map((q) => <Note key={q.key}>{q.label}: {q.note}</Note>)}
            {s && s.refusal && <Refusal message={s.refusal} />}
            {s && !s.refusal && (
              <>
                <Tbl
                  head={['requirement', 'actual', 'limit', 'status', 'margin']}
                  rows={s.checks.map((c) => [c.label, fmt.f4(c.actual), c.limit === null || c.limit === '' ? 'unset' : plain(c.limit), c.status, fmt.f4(c.margin)])}
                />
                <p className="text-xs mt-2 mb-0">
                  <span className="text-slate-400">verdict: </span>
                  <span className={s.verdict === 'passes' ? 'text-emerald-300' : s.verdict === 'fails' ? 'text-red-300' : 'text-amber-300'}>{s.verdict}</span>
                </p>
                {s.failures.length > 0 && (
                  <Tbl
                    head={['failure', 'actual', 'limit', 'short by']}
                    rows={s.failures.map((x) => [x.requirement, fmt.f4(x.actual), plain(x.limit), `${fmt.f4(x.shortfall)} ${x.unit}`])}
                  />
                )}
                {s.uncheckedRequirements.length > 0 && <Note>uncheckedRequirements: {s.uncheckedRequirements.join(', ')}</Note>}
              </>
            )}
          </div>
        );
      })}
      <Note>A requirement with no limit is reported unchecked. An unset limit is not a satisfied one.</Note>
    </>
  );
};

export const YieldMode = ({ ceilings, years, inputs, onInput, refusals, studio }) => {
  if (!Array.isArray(ceilings)) return <Empty>The ceiling reader has returned nothing.</Empty>;
  const Y = Array.isArray(years) ? years : [];
  const I = usable(inputs) ? inputs : {};
  const chart = ceilings.filter((c) => c.yieldOverCeilingDerived !== null).map((c) => ({ name: c.routeId, share: c.yieldOverCeilingDerived }));
  return (
    <>
      <Lead>Each yield is typed per Mscf in the route&apos;s own unit. The engine refuses a yield above the ceiling on this gas.</Lead>
      {ceilings.map((c) => {
        const y = Y.find((x) => x.routeId === c.routeId) || null;
        return (
          <div key={c.routeId} className="mt-3 rounded-md border border-gray-700 p-3">
            <p className="text-white text-sm font-medium mb-1">{c.label}</p>
            <FieldGrid>
              <NumBox label={`Yield per Mscf, ${c.unit}`} value={(I[c.routeId] || {}).productUnitPerMscf} onChange={(v) => onInput(c.routeId, 'productUnitPerMscf', v)} />
              {c.ceiling === null
                ? <Missing label={`yieldCeiling, ${c.unit} per Mscf`} why="the gas does not give it" />
                : <Tile label={<>yieldCeiling, {c.unit} per Mscf<Basis>{c.basis}</Basis></>} value={fmt.f4(c.ceiling)} />}
              <Tile label="the typed yield over the ceiling" value={fmt.f4(c.yieldOverCeilingDerived)} />
            </FieldGrid>
            {y && y.refusal && <Refusal message={y.refusal} />}
          </div>
        );
      })}
      {chart.length > 0 && (
        <div className="mt-3 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={AXIS} />
              <YAxis tick={AXIS} label={{ value: 'typed yield over ceiling', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt.f4(v)} />
              <ReferenceLine y={1} stroke={SERIES[5]} strokeDasharray="4 4" />
              <Bar dataKey="share" isAnimationActive={false}>
                {chart.map((x) => <Cell key={x.name} fill={x.share > 1 ? SERIES[5] : SERIES[0]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <Lead>Yields the engine refuses:</Lead>
      <Tbl head={['probe', 'engine']} rows={(Array.isArray(refusals) ? refusals : []).map((x) => [x.probe, `REFUSED: ${txt(x.refusal)}`])} />
      {usable(studio) && (
        <Note>
          The studio&apos;s LPG route on its opening gas at {plain(studio.yieldPerMscf)} t/Mscf, against its ceiling of
          {' '}{fmt.f4(studio.ceiling)} t/Mscf: typed yield over ceiling {fmt.f4(studio.yieldOverCeilingDerived)}.
        </Note>
      )}
    </>
  );
};

const YEAR_BOXES = [
  ['productUnitPerMscf', 'Yield per Mscf'],
  ['recoveryFraction', 'Recovery, (0, 1]'],
  ['pricePerProductUnit', 'Price per unit, dollars'],
  ['referenceCapitalCost', 'Reference capital, dollars'],
  ['referenceCapacityMMscfd', 'Reference capacity, MMscfd'],
  ['fixedOpexPerYear', 'Fixed opex, dollars a year'],
  ['variableOpexPerMscf', 'Variable opex, dollars per Mscf'],
];

export const YearMode = ({ route, onRoute, year, inputs, onInput, parcel, onParcel, years, exponents }) => {
  const y = usable(year) ? year : null;
  const I = usable(inputs) ? inputs : {};
  const P = usable(parcel) ? parcel : {};
  return (
    <>
      <FieldGrid>
        <SelectField label="Route" value={route} onChange={onRoute} options={ROUTE_OPTIONS} />
        <NumBox label="Parcel, MMscfd" value={P.volumeMMscfd} onChange={(v) => onParcel('volumeMMscfd', v)} />
        <NumBox label="On-stream days" value={P.onstreamDays} onChange={(v) => onParcel('onstreamDays', v)} />
        {YEAR_BOXES.map(([k, label]) => <NumBox key={k} label={label} value={(I[route] || {})[k]} onChange={(v) => onInput(route, k, v)} />)}
      </FieldGrid>
      {!y && <Empty>The route year reader has returned nothing.</Empty>}
      {y && y.refusal && <Refusal message={y.refusal} />}
      {y && !y.refusal && (
        <>
          <TileGrid>
            <Tile label="mscfPerYear" value={fmt.f4(y.mscfPerYear)} />
            <Tile label="productPerYear" value={`${fmt.f4(y.productPerYear)} ${txt(y.productUnitLabel)}`} />
            {y.revenuePerYear === null ? <Missing label="revenuePerYear, dollars" why="no price" /> : <Tile label="revenuePerYear, dollars" value={fmt.d2(y.revenuePerYear)} />}
            <Tile label="operatingCostPerYear, dollars" value={fmt.d2(y.operatingCostPerYear)} />
            {y.grossMarginPerYear === null ? <Missing label="grossMarginPerYear, dollars" /> : <Tile label="grossMarginPerYear, dollars" value={fmt.d2(y.grossMarginPerYear)} />}
            {y.valuePerMscf === null ? <Missing label="valuePerMscf, dollars" /> : <Tile label={<>valuePerMscf, dollars<Basis>margin over the whole parcel</Basis></>} value={fmt.f4(y.valuePerMscf)} />}
            {y.capitalCost === null ? <Missing label="capitalCost, dollars" /> : <Tile label={<>capitalCost, dollars<Basis>exponent {plain(y.scalingExponent)}</Basis></>} value={fmt.d2(y.capitalCost)} />}
            <Tile label="cashFlow.year0, dollars" value={fmt.d2(y.cashFlow.year0)} />
            <Tile label="cashFlow.recurring, dollars" value={fmt.d2(y.cashFlow.recurring)} />
          </TileGrid>
          {y.assumedZero.length > 0 && <EngineNote>assumedZero: {y.assumedZero.join(', ')}</EngineNote>}
          {y.capexNote && <EngineNote>{y.capexNote}</EngineNote>}
          <EngineNote>{y.valuationNote}</EngineNote>
          <Labelled tag="the reading this route does not use">
            <p className="text-xs text-slate-300 mb-0">
              The six-tenths rule on the same plant (modularRefinery&apos;s STICK_BUILT exponent): {fmt.d2(y.sixTenthsNotUsed)} dollars.
              {' '}Modular minus six-tenths: {fmt.d2(y.modularLessSixTenthsDerived)} dollars.
            </p>
          </Labelled>
        </>
      )}
      <Lead>modularRefinery&apos;s exponents:</Lead>
      <Tbl head={['SCALING_EXPONENT', 'value']} rows={(Array.isArray(exponents) ? exponents : []).map((e) => [e.name, plain(e.value)])} />
      <Lead>The four routes on the same parcel, as typed:</Lead>
      <Tbl
        head={['route', 'productPerYear', 'revenuePerYear', 'operatingCostPerYear', 'grossMarginPerYear', 'valuePerMscf', 'capitalCost']}
        rows={(Array.isArray(years) ? years : []).map((x) => (x.refusal
          ? [x.routeId, `REFUSED: ${x.refusal}`, '', '', '', '', '']
          : [x.label, `${fmt.f4(x.productPerYear)} ${txt(x.productUnitLabel)}`, fmt.d2(x.revenuePerYear), fmt.d2(x.operatingCostPerYear), fmt.d2(x.grossMarginPerYear), fmt.f4(x.valuePerMscf), fmt.d2(x.capitalCost)]))}
      />
      <Note>The engine assembles the cash flow and hands it on undiscounted.</Note>
    </>
  );
};

const CF_BOXES = [
  ['volumeMMscfd', 'Flared, MMscfd'],
  ['onstreamDays', 'On-stream days'],
  ['flareDestructionEfficiency', 'Destruction efficiency'],
  ['flareCombustionEfficiency', 'Combustion efficiency'],
  ['gwpMethane', 'Methane GWP'],
  ['recoveryFraction', 'Recovery of the credited route'],
  ['productCombustionTonnesCo2ePerYear', 'Burning the product, tCO2e a year'],
  ['displacedFuelTonnesCo2ePerYear', 'The fuel it displaces, tCO2e a year'],
];

export const CounterfactualMode = ({ cf, inputs, onInput, preset, onPreset, table }) => {
  const c = usable(cf) ? cf : null;
  const I = usable(inputs) ? inputs : {};
  return (
    <>
      <FieldGrid>
        <SelectField label="Counterfactual" value={preset} onChange={onPreset} options={COUNTERFACTUAL_PRESETS.map(([k, label]) => [k, label])} />
        {CF_BOXES.map(([k, label]) => <NumBox key={k} label={label} value={I[k]} onChange={(v) => onInput(k, v)} />)}
        <TextBox label="Counterfactual label" value={I.counterfactualLabel} onChange={(v) => onInput('counterfactualLabel', v)} />
      </FieldGrid>
      {!c && <Empty>The counterfactual reader has returned nothing.</Empty>}
      {c && c.refusal && <Refusal message={c.refusal} />}
      {c && !c.refusal && (
        <>
          <TileGrid>
            <Tile label="flareCo2eTonnes, t/yr" value={fmt.t3(c.flareCo2eTonnes)} />
            <Tile label="recoveryFraction" value={plain(c.recoveryFraction)} />
            {c.avoidedFlareCo2eTonnes === null
              ? <Missing label="avoidedFlareCo2eTonnes, t/yr" />
              : <Tile label={<>avoidedFlareCo2eTonnes, t/yr<Basis>the recovered share</Basis></>} value={fmt.t3(c.avoidedFlareCo2eTonnes)} />}
            {c.netAbatementTonnesCo2ePerYear === null
              ? <Missing label="netAbatementTonnesCo2ePerYear" why={txt(c.blockedBy)} />
              : <Tile label="netAbatementTonnesCo2ePerYear" value={fmt.t3(c.netAbatementTonnesCo2ePerYear)} />}
            {c.netLessGrossDerived !== null && <Tile label="net minus the gross flare, t/yr" value={fmt.t3(c.netLessGrossDerived)} />}
            <Tile label="grossClaimIfNoCounterfactual, t/yr" value={fmt.t3(c.grossClaimIfNoCounterfactual)} />
          </TileGrid>
          {c.blockedBy && <EngineNote>blockedBy: {c.blockedBy}</EngineNote>}
          {c.warning && <EngineNote>{c.warning}</EngineNote>}
          {c.netAbatementTonnesCo2ePerYear !== null && (
            <div className="mt-3 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'gross flare', t: c.grossClaimIfNoCounterfactual },
                    { name: 'avoided (recovered share)', t: c.avoidedFlareCo2eTonnes },
                    { name: 'net abatement', t: c.netAbatementTonnesCo2ePerYear },
                  ]}
                  margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
                >
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={AXIS} />
                  <YAxis tick={AXIS} label={{ value: 'tCO2e a year', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt.t3(v)} />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Bar dataKey="t" fill={SERIES[4]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
      <Lead>One flare, the course&apos;s counterfactuals on it:</Lead>
      <Tbl
        head={['counterfactual', 'recoveryFraction', 'avoidedFlareCo2eTonnes', 'product combustion (input)', 'displaced fuel (input)', 'netAbatementTonnesCo2ePerYear', 'net minus the gross flare']}
        rows={(Array.isArray(table) ? table : []).map((x) => [txt(x.counterfactualLabel), plain(x.recoveryFraction), fmt.t3(x.avoidedFlareCo2eTonnes), plain(x.productCombustionTonnesCo2ePerYear), plain(x.displacedFuelTonnesCo2ePerYear), fmt.t3(x.netAbatementTonnesCo2ePerYear), fmt.t3(x.netLessGrossDerived)])}
      />
    </>
  );
};

export const CreditsMode = ({ credits, cf, year, prices, onPrices, hurdle, onHurdle }) => {
  const r = usable(credits) ? credits : null;
  const c = usable(cf) ? cf : null;
  const y = usable(year) ? year : null;
  const chart = r && !r.refusal ? r.points.filter((p) => p.totalMarginPerYear !== null).map((p) => ({ name: String(p.creditPrice), total: p.totalMarginPerYear, clears: p.clearsHurdle })) : [];
  return (
    <>
      <Lead>
        The credited route&apos;s net abatement ({c ? fmt.t3(c.netAbatementTonnesCo2ePerYear) : 'none'} t/yr) and gross margin
        {' '}({y ? fmt.d2(y.grossMarginPerYear) : 'none'} dollars a year) come from the counterfactual and year views.
        Credit prices are case inputs; the engine ships none.
      </Lead>
      <FieldGrid>
        <TextBox label="Credit prices, dollars per tonne, in the order typed" value={prices} onChange={onPrices} />
        <NumBox label="Hurdle margin, dollars a year" value={hurdle} onChange={onHurdle} />
      </FieldGrid>
      {!r && <Empty>The credit reader has returned nothing.</Empty>}
      {r && r.refusal && <Refusal message={r.refusal} />}
      {r && !r.refusal && (
        <>
          <Tbl
            head={['credit price (in the order typed)', 'creditRevenuePerYear', 'totalMarginPerYear', 'clearsHurdle']}
            rows={r.points.map((p) => [plain(p.creditPrice), fmt.d2(p.creditRevenuePerYear), fmt.d2(p.totalMarginPerYear), plain(p.clearsHurdle)])}
          />
          <TileGrid>
            <Tile label="standsAloneWithoutCredits" value={plain(r.standsAloneWithoutCredits)} />
            {r.breakevenCreditPrice === null
              ? <Missing label="breakevenCreditPrice, dollars per tonne" />
              : <Tile label={<>breakevenCreditPrice<Basis>closed form</Basis></>} value={fmt.f4(r.breakevenCreditPrice)} />}
            <Tile label="lowestTestedClearingPrice" value={plain(r.lowestTestedClearingPrice)} />
            <Tile label="the first price in the order typed that clears" value={plain(r.firstTypedClearingPrice)} />
          </TileGrid>
          {r.verdict && <EngineNote>{r.verdict}</EngineNote>}
          {chart.length > 0 && (
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                  <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={AXIS} label={{ value: 'credit price, in the order typed', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={AXIS} />
                  <Tooltip contentStyle={TOOLTIP} formatter={(v) => fmt.d2(v)} />
                  {r.hurdleMarginPerYear !== null && <ReferenceLine y={r.hurdleMarginPerYear} stroke={SERIES[3]} strokeDasharray="4 4" />}
                  <Bar dataKey="total" isAnimationActive={false}>
                    {chart.map((x) => <Cell key={x.name} fill={x.clears ? SERIES[2] : SERIES[5]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </>
  );
};

export const BidMode = ({ bid }) => {
  const b = usable(bid) ? bid : null;
  if (!b) return <Empty>The bid reader has returned nothing.</Empty>;
  if (b.refusal) return <Refusal message={b.refusal} />;
  return (
    <>
      <Lead>The limits, route inputs and counterfactual are the ones set in the other views.</Lead>
      <Tbl
        head={['route', 'verdict', 'capitalCost', 'revenuePerYear', 'grossMarginPerYear', 'valuePerMscf', 'netAbatementTonnesCo2ePerYear']}
        rows={b.rows.map((r) => [r.label, r.verdict, fmt.d2(r.capitalCost), fmt.d2(r.revenuePerYear), fmt.d2(r.grossMarginPerYear), fmt.f4(r.valuePerMscf), r.netAbatementTonnesCo2ePerYear === null ? 'none declared' : fmt.t3(r.netAbatementTonnesCo2ePerYear)])}
      />
      <TileGrid>
        <Tile label="bestByValuePerMscf" value={plain(b.bestByValuePerMscf)} />
        <Tile label="leaderNotFullyScreened" value={plain(b.leaderNotFullyScreened)} />
        <Tile label="screenedOut" value={txt(b.screenedOut)} />
        <Tile label="notFullyScreened" value={txt(b.notFullyScreened)} />
      </TileGrid>
      {b.rankingNote && <EngineNote>{b.rankingNote}</EngineNote>}
    </>
  );
};

// ---------------------------------------------------------------------------

const RouteExplorer = ({ initialMode = 'screen' }) => {
  const [mode, setMode] = useState(MODES.some(([m]) => m === initialMode) ? initialMode : 'screen');
  const [gasId, setGasId] = useState('egbema');
  const [limits, setLimits] = useState(() => egbemaLimits());
  const [inputs, setInputs] = useState(() => egbemaRouteInputs());
  const [parcel, setParcel] = useState(() => egbemaParcel());
  const [route, setRoute] = useState('cng');
  const [cfPreset, setCfPreset] = useState('cng0');
  const [cfInputs, setCfInputs] = useState(() => egbemaCounterfactualInputs());
  const [creditIn, setCreditIn] = useState(() => egbemaCreditInputs());

  const rows = useMemo(() => presetRows(gasId), [gasId]);
  const credited = (COUNTERFACTUAL_PRESETS.find(([k]) => k === cfPreset) || [])[2] || 'cng';

  const templates = useMemo(() => safe(routeTemplatesAt), []);
  const screens = useMemo(() => safe(() => screensAt(limits, rows, parcel.volumeMMscfd)), [limits, rows, parcel]);
  const ceilings = useMemo(() => (mode === 'yield' ? safe(() => yieldChecksAt(inputs, rows)) : null), [mode, inputs, rows]);
  const years = useMemo(() => safe(() => routeYearsAt(inputs, rows, parcel)), [inputs, rows, parcel]);
  const yieldRefusals = useMemo(() => (mode === 'yield' ? safe(yieldRefusalsAt) : null), [mode]);
  const studio = useMemo(() => (mode === 'yield' ? safe(studioLpgAt) : null), [mode]);
  const year = useMemo(() => safe(() => routeYearAt(route, inputs[route] || {}, rows, parcel)), [route, inputs, rows, parcel]);
  const exponents = useMemo(() => (mode === 'year' ? safe(scalingExponentsAt) : null), [mode]);
  const cf = useMemo(() => safe(() => counterfactualAt(cfInputs, rows)), [cfInputs, rows]);
  const cfTable = useMemo(() => (mode === 'counterfactual' ? safe(counterfactualsAt) : null), [mode]);
  const creditedYear = useMemo(() => safe(() => routeYearAt(credited, inputs[credited] || {}, rows, parcel)), [credited, inputs, rows, parcel]);
  const credits = useMemo(() => (mode === 'credits' ? safe(() => creditsAt({
    net: cf && !cf.refusal ? cf.netAbatementTonnesCo2ePerYear : null,
    margin: creditedYear && !creditedYear.refusal ? creditedYear.grossMarginPerYear : null,
    prices: creditIn.prices,
    hurdleMarginPerYear: creditIn.hurdleMarginPerYear,
  })) : null), [mode, cf, creditedYear, creditIn]);
  const bid = useMemo(() => (mode === 'bid' ? safe(() => bidAt({
    limits, inputs, rows, parcel, credited: { [credited]: cf },
  })) : null), [mode, limits, inputs, rows, parcel, credited, cf]);

  const onPreset = (k) => {
    const p = COUNTERFACTUAL_PRESETS.find(([x]) => x === k);
    if (!p) return;
    setCfPreset(k);
    const base = egbemaCounterfactualInputs();
    setCfInputs({ ...base, recoveryFraction: (inputs[p[2]] || {}).recoveryFraction, ...p[3] });
  };

  return (
    <PanelShell
      title="Route explorer"
      subtitle="The EGBEMA flare's four routes to market: their envelopes, what the gas can yield, a route's year and capital, the counterfactual, the credit test and the bid. Every figure is the engine's."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
        <SelectField label="Gas" value={gasId} onChange={setGasId} options={GAS_OPTIONS} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'screen' && (
          <ScreenMode
            templates={templates}
            screens={screens}
            limits={limits}
            onLimit={(id, k, v) => setLimits((x) => ({ ...x, [id]: { ...(x[id] || {}), [k]: v } }))}
            onStudy={() => setLimits(egbemaLimits())}
            onUnset={() => setLimits(blankLimits())}
          />
        )}
        {mode === 'yield' && (
          <YieldMode
            ceilings={ceilings}
            years={years}
            inputs={inputs}
            onInput={(id, k, v) => setInputs((x) => ({ ...x, [id]: { ...(x[id] || {}), [k]: v } }))}
            refusals={yieldRefusals}
            studio={studio}
          />
        )}
        {mode === 'year' && (
          <YearMode
            route={route}
            onRoute={setRoute}
            year={year}
            inputs={inputs}
            onInput={(id, k, v) => setInputs((x) => ({ ...x, [id]: { ...(x[id] || {}), [k]: v } }))}
            parcel={parcel}
            onParcel={(k, v) => setParcel((x) => ({ ...x, [k]: v }))}
            years={years}
            exponents={exponents}
          />
        )}
        {mode === 'counterfactual' && (
          <CounterfactualMode
            cf={cf}
            inputs={cfInputs}
            onInput={(k, v) => setCfInputs((x) => ({ ...x, [k]: v }))}
            preset={cfPreset}
            onPreset={onPreset}
            table={cfTable}
          />
        )}
        {mode === 'credits' && (
          <CreditsMode
            credits={credits}
            cf={cf}
            year={creditedYear}
            prices={creditIn.prices}
            onPrices={(v) => setCreditIn((x) => ({ ...x, prices: v }))}
            hurdle={creditIn.hurdleMarginPerYear}
            onHurdle={(v) => setCreditIn((x) => ({ ...x, hurdleMarginPerYear: v }))}
          />
        )}
        {mode === 'bid' && <BidMode bid={bid} />}
      </div>
      <Note>
        Every figure on this page is a return value of the vendored flareToValue module (and modularRefinery&apos;s power law)
        through the teaching lab. Every refusal, verdict and note is the engine&apos;s own sentence. Every limit, price,
        cost and counterfactual here is invented and illustrative.
      </Note>
    </PanelShell>
  );
};

export default RouteExplorer;
