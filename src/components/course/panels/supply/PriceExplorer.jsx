import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell,
} from 'recharts';
import {
  BADAGRY_CARGO, BADAGRY_RATES, BADAGRY_ELEMENTS, BADAGRY_CAP, BADAGRY_FX_VALUES, CARGO_UNITS, cargoAt,
  cargoUnitsAt, cargoDensitiesAt, landedAt, landedRefusalsAt, lossCurveAt, h1At, pumpAt, fxAt, fmt, plain,
  importTemplate, pumpTemplate,
} from './supplyLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, txt, usable, Tbl, Refusal, EngineNote, Note, Lead, Labelled, Empty, safe, NumBox,
  Slider, Button,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Price explorer, the Expert tier throughout.
//
// ONE CARGO, FROM THE SHIP TO THE NOZZLE. The BADAGRY petrol cargo in every unit
// the trade quotes, its landed cost walked stage by stage, the ocean loss that
// divides the cost, the pump price built element by element onto a running
// total, and the exchange rate that breaks a cap. Every figure is a return value
// of the vendored fuelPricing module through the teaching lab.
//
// EVERY RATE IS INVENTED. The engine ships none. Each rate box starts at the
// course's invented figure and says so, and a blank box is a missing rate: the
// engine then labels its total a floor, in its own words.

export const MODES = [
  ['cargo', 'One cargo in every unit, and what a wrong density moves'],
  ['landed', 'The landed cost walk, FOB to landed, as a staircase'],
  ['loss', 'Ocean loss and the cost of a litre sold'],
  ['pump', 'The pump price waterfall, who gets the money, and the cap'],
  ['fx', 'The exchange rate that breaks the cap'],
];

const IMPORT_LINES = () => (safe(importTemplate) || []).map((c) => [c.id, c.label, c.basis]);
const PUMP_LINES = () => (safe(pumpTemplate) || []).map((e) => [e.id, e.label, e.recipient]);
const asText = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v === null || v === undefined ? '' : String(v)]));

// ---------------------------------------------------------------------------

export const CargoMode = ({ cargo, units, densities, inputs, onInput }) => {
  if (!usable(cargo) || !inputs) return <Empty>The cargo reader has returned nothing, so there is no cargo to show.</Empty>;
  return (
    <>
      <FieldGrid>
        <NumBox label="Quantity" value={inputs.quantity} onChange={(v) => onInput('quantity', v)} />
        <SelectField label="Unit" value={inputs.unit} onChange={(v) => onInput('unit', v)} options={CARGO_UNITS.map((u) => [u, u])} />
        <NumBox label="Density at 15 C, kg/m3, off the certificate of quality" value={inputs.densityKgM3} onChange={(v) => onInput('densityKgM3', v)} />
      </FieldGrid>
      {cargo.refusal ? <Refusal message={cargo.refusal} /> : (
        <TileGrid>
          <Tile label="m3" value={fmt.m3(cargo.m3)} />
          <Tile label="Litres" value={fmt.litres(cargo.litres)} />
          <Tile label="Tonnes" value={fmt.tonnes(cargo.tonnes)} />
          <Tile label="Barrels" value={fmt.bbl(cargo.bbl)} />
        </TileGrid>
      )}
      <Lead>The BADAGRY cargo entered in each unit the trade quotes:</Lead>
      <Tbl
        head={['quantity', 'unit', 'm3', 'litres', 'tonnes', 'barrels']}
        rows={(Array.isArray(units) ? units : []).map((x) => (x.refusal
          ? [x.quantity, x.unit, `REFUSED: ${x.refusal}`, '', '', '']
          : [x.quantity, x.unit, fmt.m3(x.m3), fmt.litres(x.litres), fmt.tonnes(x.tonnes), fmt.bbl(x.bbl)]))}
      />
      <Lead>
        The same tonnes at each typical density the engine labels as a starting point. Nothing reads them unless a caller
        passes one in, and the certificate of quality is the authority:
      </Lead>
      <Tbl
        head={['product', 'density kg/m3', 'm3', 'litres']}
        rows={(Array.isArray(densities) ? densities : []).map((x) => [x.code, x.densityKgM3, fmt.m3(x.m3), fmt.litres(x.litres)])}
      />
    </>
  );
};

export const LandedMode = ({ landed, rates, onRate, basis, onBasis, refusals }) => {
  if (!usable(landed) || !rates) return <Empty>The landed cost reader has returned nothing, so there is no walk to draw.</Empty>;
  const bars = Array.isArray(landed.lines) ? landed.lines.filter((l) => Number.isFinite(l.amount)) : [];
  return (
    <>
      <p className="text-xs text-slate-400 mb-0">
        The BADAGRY cargo: {BADAGRY_CARGO.quantity} tonnes of PMS at {BADAGRY_CARGO.densityKgM3} kg/m3, FOB
        {' '}{fmt.usd(BADAGRY_CARGO.fobPrice)} USD a tonne. Every rate below is invented for this course.
      </p>
      <div className="mt-2 flex gap-2 items-center">
        <span className="text-xs text-slate-400">Marine insurance quoted on</span>
        <Button active={basis === 'cif'} onClick={() => onBasis('cif')}>CIF, the usual marine quote</Button>
        <Button active={basis === 'cf'} onClick={() => onBasis('cf')}>C&amp;F, as the template ships its basis</Button>
      </div>
      <FieldGrid>
        {IMPORT_LINES().map(([id, label, b]) => (
          <NumBox key={id} label={`${label}, ${id === 'insurance' ? (basis === 'cif' ? 'percent_of_cif' : b) : b}`} tag="invented" value={rates[id]} onChange={(v) => onRate(id, v)} />
        ))}
      </FieldGrid>
      {landed.refusal ? <Refusal message={landed.refusal} /> : (
        <>
          <TileGrid>
            <Tile label="FOB, USD" value={fmt.usd(landed.fob)} />
            <Tile label="C&F, USD" value={fmt.usd(landed.cf)} />
            <Tile label="CIF, USD" value={fmt.usd(landed.cif)} />
            <Tile label="Landed total, USD" value={fmt.usd(landed.totalUsd)} />
            <Tile label="Complete" value={txt(landed.complete)} />
          </TileGrid>
          <EngineNote>{landed.basisOfTotal}</EngineNote>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars} margin={{ top: 8, right: 16, bottom: 40, left: 16 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="key" tick={AXIS} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={AXIS} domain={['auto', 'auto']} />
                <Tooltip contentStyle={TOOLTIP} />
                <Bar dataKey="baseDrawnUsd" stackId="s" fill="transparent" isAnimationActive={false} />
                <Bar dataKey="amount" name="USD" stackId="s" isAnimationActive={false}>
                  {bars.map((l) => <Cell key={l.key} fill={l.stage === 'fob' ? SERIES[0] : l.stage === 'landed' ? SERIES[3] : SERIES[1]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Tbl
            head={['stage', 'line', 'bites on', 'rate', 'amount USD', 'USD an outturn litre']}
            rows={landed.lines.map((l) => [l.stage, l.label, l.basis, txt(l.rate), fmt.usd(l.amount), fmt.usdL(l.perLitre)])}
          />
          {landed.missingRates.length > 0 && <Note>Missing, named by the engine: {txt(landed.missingRates)}.</Note>}
        </>
      )}
      <Lead>What the walk refuses, each in the engine&apos;s words:</Lead>
      <Tbl
        head={['the charge', 'the engine answers']}
        rows={(Array.isArray(refusals) ? refusals : []).map((x) => [x.label, `REFUSED: ${txt(x.message)}`])}
      />
    </>
  );
};

export const LossMode = ({ landed, curve, h1, loss, onLoss }) => {
  if (!usable(landed)) return <Empty>The landed cost reader has returned nothing, so there is no litre to price.</Empty>;
  const h = usable(h1) && !h1.refusal ? h1 : null;
  return (
    <>
      <Slider label="Ocean loss, percent" value={loss} min={0} max={2} step={0.05} onChange={onLoss} />
      <NumBox label="Ocean loss, percent (typed)" value={loss} onChange={onLoss} />
      {landed.refusal ? <Refusal message={landed.refusal} /> : (
        <TileGrid>
          <Tile label="Bill of lading, litres" value={fmt.litres(landed.quantities.litres)} />
          <Tile label="Outturn, litres" value={fmt.litres(landed.outturn.litres)} />
          <Tile label="Landed total, USD (it does not move)" value={fmt.usd(landed.totalUsd)} />
          <Tile label="USD a litre sold" value={fmt.usdL(landed.perLitreUsd)} />
          <Tile label="Naira a litre sold" value={fmt.localL(landed.perLitreLocal)} />
        </TileGrid>
      )}
      {Array.isArray(curve) && curve.length > 0 && (
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curve} margin={{ top: 8, right: 16, bottom: 18, left: 16 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="lossPercent" type="number" tick={AXIS} label={{ value: 'ocean loss, percent', position: 'insideBottom', offset: -8, fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={AXIS} domain={['auto', 'auto']} />
              <Tooltip contentStyle={TOOLTIP} />
              {Number.isFinite(Number(loss)) && loss !== '' && <ReferenceLine x={Number(loss)} stroke={SERIES[3]} strokeDasharray="4 4" />}
              <Line type="monotone" dataKey="perLitreUsd" name="USD a litre sold" stroke={SERIES[0]} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <Note>The loss divides the cost: the landed total stays where it is and the litres it is spread over fall.</Note>
      {h && (
        <Labelled tag="held, FINDINGS-supply H1">
          <p className="text-xs text-slate-300 mb-0">
            The jetty line ({fmt.usd(h.jetty && h.jetty.amount)} USD) and the storage line ({fmt.usd(h.storage && h.storage.amount)} USD)
            are charged on the {fmt.m3(h.billOfLadingM3)} m3 on the bill of lading, while the outturn is
            {' '}{fmt.m3(h.outturnM3)} m3. So are the regulatory line ({fmt.usd(h.regulator && h.regulator.amount)} USD on
            {' '}{fmt.litres(h.billOfLadingLitres)} bill-of-lading litres) and the port line ({fmt.usd(h.port && h.port.amount)} USD on
            {' '}{fmt.tonnes(h.billOfLadingTonnes)} tonnes). Whether a terminal bills on the bill of lading or on the
            outturn is a contract term the engine does not know.
          </p>
        </Labelled>
      )}
    </>
  );
};

export const PumpMode = ({ pump, elements, onElement, cap, onCap, vatBasis, onVatBasis }) => {
  if (!usable(pump) || !elements) return <Empty>The pump price reader has returned nothing, so there is no build-up to draw.</Empty>;
  return (
    <>
      <FieldGrid>
        {PUMP_LINES().map(([id, label, recipient]) => (
          <NumBox key={id} label={`${label} (${recipient}), ${id === 'vat' ? 'percent' : 'naira a litre'}`} tag="invented" value={elements[id]} onChange={(v) => onElement(id, v)} />
        ))}
        <NumBox label="Cap, naira a litre" tag="invented" value={cap} onChange={onCap} />
      </FieldGrid>
      <div className="mt-2 flex gap-2 items-center">
        <span className="text-xs text-slate-400">VAT charged on</span>
        <Button active={vatBasis === 'running'} onClick={() => onVatBasis('running')}>the running total</Button>
        <Button active={vatBasis === 'landed'} onClick={() => onVatBasis('landed')}>the landed cost</Button>
      </div>
      {pump.refusal ? <Refusal message={pump.refusal} /> : (
        <>
          <TileGrid>
            <Tile label="Landed cost at the depot gate, naira a litre" value={fmt.localL(pump.landedPerLitre)} />
            <Tile label="Pump price, naira a litre" value={fmt.localL(pump.pricePerLitre)} />
            <Tile label="Shortfall against the cap" value={fmt.localL(pump.shortfallPerLitre)} />
            <Tile label="The cap covers the chain" value={txt(pump.capCoversChain)} />
          </TileGrid>
          <EngineNote>{pump.basisOfPrice}</EngineNote>
          <Note>A positive shortfall means the cap is below what the chain costs, and somebody in the chain absorbs it.</Note>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pump.lines.filter((l) => Number.isFinite(l.amount))} margin={{ top: 8, right: 16, bottom: 40, left: 16 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
                <XAxis dataKey="key" tick={AXIS} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={AXIS} domain={['auto', 'auto']} />
                <Tooltip contentStyle={TOOLTIP} />
                {Number.isFinite(pump.capPerLitre) && <ReferenceLine y={pump.capPerLitre} stroke={SERIES[5]} strokeDasharray="4 4" />}
                <Bar dataKey="baseDrawn" stackId="p" fill="transparent" isAnimationActive={false} />
                <Bar dataKey="amount" name="naira a litre" stackId="p" fill={SERIES[2]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Tbl
            head={['element', 'recipient', 'basis', 'amount naira/L', 'running naira/L', 'share of price']}
            rows={pump.lines.map((l) => [l.label, txt(l.recipient), l.basis, fmt.localL(l.amount), fmt.localL(l.running), fmt.share(l.share)])}
          />
          <Lead>Where the money in a litre goes, grouped by recipient, largest first:</Lead>
          <Tbl
            head={['recipient', 'naira a litre', 'share of price', 'elements']}
            rows={pump.groups.map((g) => [g.recipient, fmt.localL(g.amountPerLitre), fmt.share(g.share), g.lines.join('; ')])}
          />
        </>
      )}
    </>
  );
};

export const FxMode = ({ fx, inputs, onInput }) => {
  if (!usable(fx) || !inputs) return <Empty>The sensitivity reader has returned nothing, so there is no chain to re-price.</Empty>;
  const b = fx.breakeven;
  const capN = Number(inputs.capPerLitre);
  return (
    <>
      <FieldGrid>
        <NumBox label="Bracket, low end, naira to the dollar" tag="invented" value={inputs.lo} onChange={(v) => onInput('lo', v)} />
        <NumBox label="Bracket, high end, naira to the dollar" tag="invented" value={inputs.hi} onChange={(v) => onInput('hi', v)} />
        <NumBox label="Cap, naira a litre" tag="invented" value={inputs.capPerLitre} onChange={(v) => onInput('capPerLitre', v)} />
      </FieldGrid>
      {Array.isArray(fx.points) && fx.points.length > 0 && (
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fx.points} margin={{ top: 8, right: 16, bottom: 18, left: 16 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="value" type="number" domain={['dataMin', 'dataMax']} tick={AXIS} label={{ value: 'naira to the dollar', position: 'insideBottom', offset: -8, fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={AXIS} domain={['auto', 'auto']} />
              <Tooltip contentStyle={TOOLTIP} />
              {Number.isFinite(capN) && inputs.capPerLitre !== '' && <ReferenceLine y={capN} stroke={SERIES[5]} strokeDasharray="4 4" />}
              {b && b.found && <ReferenceLine x={b.value} stroke={SERIES[2]} />}
              <Line type="monotone" dataKey="pricePerLitre" name="pump price, naira a litre" stroke={SERIES[0]} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {!b && <Note>With no cap there is nothing to cross, so there is no breakeven.</Note>}
      {b && b.found && (
        <TileGrid>
          <Tile label="Breakeven, naira to the dollar" value={fmt.fx(b.value)} />
          <Tile label="Bisection steps" value={txt(b.iterations)} />
        </TileGrid>
      )}
      {b && !b.found && <Refusal message={b.refusal} />}
      {b && !b.found && b.atLo !== null && (
        <Note>The shortfall at the two ends: {fmt.localL(b.atLo)} and {fmt.localL(b.atHi)} naira a litre, the same sign at both.</Note>
      )}
      <Tbl
        head={['naira to the dollar', 'pump price naira/L', 'shortfall naira/L', 'cap covers']}
        rows={(Array.isArray(fx.points) ? fx.points : []).map((p) => [fmt.fx(p.value), fmt.localL(p.pricePerLitre), fmt.localL(p.shortfallPerLitre), plain(p.covered)])}
      />
      <Note>The chain is re-priced at seven rates spread evenly across the bracket, and the search runs over the bracket as typed.</Note>
    </>
  );
};

// ---------------------------------------------------------------------------

const PriceExplorer = ({ initialMode = 'cargo' }) => {
  const [mode, setMode] = useState(initialMode);
  const [cargoIn, setCargoIn] = useState(() => asText({ quantity: BADAGRY_CARGO.quantity, unit: BADAGRY_CARGO.quantityUnit, densityKgM3: BADAGRY_CARGO.densityKgM3 }));
  const [rates, setRates] = useState(() => asText(BADAGRY_RATES));
  const [basis, setBasis] = useState('cif');
  const [loss, setLoss] = useState(String(BADAGRY_CARGO.oceanLossPercent));
  const [elements, setElements] = useState(() => asText(BADAGRY_ELEMENTS));
  const [cap, setCap] = useState(String(BADAGRY_CAP));
  const [vatBasis, setVatBasis] = useState('running');
  const [fxIn, setFxIn] = useState(() => asText({ lo: Math.min(...BADAGRY_FX_VALUES), hi: Math.max(...BADAGRY_FX_VALUES), capPerLitre: BADAGRY_CAP }));

  const cargo = useMemo(() => (mode === 'cargo' ? safe(() => cargoAt(cargoIn.quantity, cargoIn.unit, cargoIn.densityKgM3)) : null), [mode, cargoIn]);
  const units = useMemo(() => (mode === 'cargo' ? safe(cargoUnitsAt) : null), [mode]);
  const densities = useMemo(() => (mode === 'cargo' ? safe(cargoDensitiesAt) : null), [mode]);
  const landed = useMemo(() => (mode === 'landed' ? safe(() => landedAt({ rates, insuranceBasis: basis })) : null), [mode, rates, basis]);
  const refusals = useMemo(() => (mode === 'landed' ? safe(landedRefusalsAt) : null), [mode]);
  const lossLanded = useMemo(() => (mode === 'loss' ? safe(() => landedAt({ oceanLossPercent: loss })) : null), [mode, loss]);
  const lossCurve = useMemo(() => (mode === 'loss' ? safe(lossCurveAt) : null), [mode]);
  const h1 = useMemo(() => (mode === 'loss' ? safe(() => h1At(loss)) : null), [mode, loss]);
  const pump = useMemo(() => (mode === 'pump' ? safe(() => pumpAt({ elements, capPerLitre: cap, vatBasis })) : null), [mode, elements, cap, vatBasis]);
  const fx = useMemo(() => (mode === 'fx' ? safe(() => fxAt(fxIn)) : null), [mode, fxIn]);

  return (
    <PanelShell
      title="Price explorer"
      subtitle="The BADAGRY petrol cargo: every unit it is quoted in, its landed cost walked from FOB, the ocean loss, the pump price built to the nozzle, and the exchange rate that breaks the cap. Every figure is the engine's; every rate is invented."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'cargo' && <CargoMode cargo={cargo} units={units} densities={densities} inputs={cargoIn} onInput={(k, v) => setCargoIn((x) => ({ ...x, [k]: v }))} />}
        {mode === 'landed' && <LandedMode landed={landed} rates={rates} onRate={(k, v) => setRates((x) => ({ ...x, [k]: v }))} basis={basis} onBasis={setBasis} refusals={refusals} />}
        {mode === 'loss' && <LossMode landed={lossLanded} curve={lossCurve} h1={h1} loss={loss} onLoss={setLoss} />}
        {mode === 'pump' && (
          <PumpMode
            pump={pump}
            elements={elements}
            onElement={(k, v) => setElements((x) => ({ ...x, [k]: v }))}
            cap={cap}
            onCap={setCap}
            vatBasis={vatBasis}
            onVatBasis={setVatBasis}
          />
        )}
        {mode === 'fx' && <FxMode fx={fx} inputs={fxIn} onInput={(k, v) => setFxIn((x) => ({ ...x, [k]: v }))} />}
      </div>
      <Note>
        Every figure on this page is a return value of the vendored fuelPricing module through the teaching lab. Every
        refusal is the engine&apos;s own sentence. A blank rate box goes to the engine as a missing rate.
      </Note>
    </PanelShell>
  );
};

export default PriceExplorer;
