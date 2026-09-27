import React, { useState } from 'react';
import {
  STARTS, pretty, blockKeysOf, viewRun, setRouteMode,
} from './marineLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, TextField, Refusal, Reasons, Source, EngineNote, useJsonBox, StatedControl, MissingStated,
  statedIn, WordStated, RewriteControl, BlockSelector, ListStated, APPLIES_TO, castList, appliesKey, writeStated,
} from './panelBits';

// The voyage and fleet calculator (Associate and Professional): the voyages of
// one vessel on a stated route with the weather factor on the stated
// activities, the fuel by activity and its cost, the utilisation of every
// capacity constraint and the binding one (voyagePlan); and the fleet a
// period's demand needs, with both rounding rules stated (fleetSize). Every
// figure is a return value of the vendored engine
// (engines/supplychain/marineLogistics.js) through marineLab. The Suite's
// Marine Logistics Planner runs the same engine; this is the course's own
// calculator, so every exercise can be worked here.

export const Box = ({ box, label, rows = 10 }) => (
  <FieldGrid>
    <TextField label={label} value={box.text} onChange={box.setText} rows={rows} />
  </FieldGrid>
);

/**
 * A JSON box for one view, with the block of a pasted case file it reads.
 * Returns the box, the block key the view runs at (the view's own name when the
 * box holds one call's inputs), the blocks a case file offers and a setter.
 */
export const useViewBox = (view, start, { initialCase = null, initialText = null, initialBlock = null } = {}) => {
  const box = useJsonBox(initialCase || start, initialText);
  const blocks = box.parsed.error ? [] : blockKeysOf(box.parsed.value, view);
  const [chosen, setChosen] = useState(initialBlock);
  const blockKey = blocks.length ? (blocks.includes(chosen) ? chosen : blocks[0]) : view;
  return { box, blocks, blockKey, setBlock: setChosen };
};

/** A start selector that loads a teaching case into the box. */
export const Starts = ({ box, starts }) => {
  const [start, setStart] = useState(starts[0][0]);
  const choose = (k) => { setStart(k); box.setText(pretty(STARTS[k])); };
  return (
    <FieldGrid>
      <SelectField label="Start from" value={start} onChange={choose} options={starts} />
    </FieldGrid>
  );
};

const KINDS = [['liquid', 'liquid'], ['dry', 'dry']];
const MODES_ROUTE = [['milk-run', 'a milk run through every stop (milk-run)'], ['dedicated', 'a dedicated voyage to each installation (dedicated)']];

/** The activities the weather slows, as one choice written into the box as a list. */
export const AppliesControl = ({ box, viewKey }) => (
  <RewriteControl box={box} viewKey={viewKey} path="weather.appliesTo" label="Weather applies to (stated)" options={APPLIES_TO}
    current={(b) => appliesKey(b, viewKey)}
    rewrite={(v) => writeStated(box, viewKey, 'weather.appliesTo', v === undefined ? undefined : castList(v))} />
);

/**
 * Every input the vessel, the products, the route and the installations need,
 * each a visible control that writes the stated input into the block. The
 * installations' load is `cargo` (one voyage) for a voyage plan and `demand`
 * (the period) for fleet sizing. `weatherFactor` is false where the view states
 * the factor in its own form (the variability calculator).
 */
export const VoyageControls = ({ box, viewKey, load = 'cargo', weatherFactor = true }) => {
  const products = statedIn(box, viewKey, 'products');
  const ps = Array.isArray(products) ? products.filter((p) => p && typeof p === 'object') : [];
  const insts = statedIn(box, viewKey, 'installations');
  const is = Array.isArray(insts) ? insts : [];
  const mode = statedIn(box, viewKey, 'route.mode');
  const stops = statedIn(box, viewKey, 'route.stops');
  const nLegs = Array.isArray(stops) ? stops.length + 1 : 0;
  return (
    <>
      <FieldGrid>
        <WordStated box={box} viewKey={viewKey} path="vessel.name" label="Vessel name (optional)" />
        <StatedControl box={box} viewKey={viewKey} path="vessel.speedKnots" label="Speed, knots (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="vessel.deckAreaM2" label="Deck area, m2 (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="vessel.deckUsableFraction" label="Usable deck fraction (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="vessel.deckLoadT" label="Deck load, t (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="vessel.deadweightT" label="Cargo deadweight, t (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="vessel.fuelTPerHour.sailing" label="Fuel sailing, t an hour (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="vessel.fuelTPerHour.port" label="Fuel in port, t an hour (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="vessel.fuelTPerHour.field" label="Fuel at the field, t an hour (stated)" />
        {ps.map((p) => <StatedControl key={`t${p.id}`} box={box} viewKey={viewKey} path={`vessel.tanks.${p.id}`} label={`Tank ${p.id}, m3 (stated, 0 for none)`} />)}
      </FieldGrid>
      <FieldGrid>
        {ps.map((p, i) => (
          <React.Fragment key={`p${i}`}>
            <StatedControl box={box} viewKey={viewKey} path={`products.${i}.kind`} label={`product ${p.id}: kind (stated)`} options={KINDS} />
            <StatedControl box={box} viewKey={viewKey} path={`products.${i}.densityTPerM3`} label={`product ${p.id}: density, t a m3 (stated)`} />
          </React.Fragment>
        ))}
      </FieldGrid>
      <FieldGrid>
        <RewriteControl box={box} viewKey={viewKey} path="route.mode" label="Route (stated)" options={MODES_ROUTE}
          current={(b) => statedIn(b, viewKey, 'route.mode')}
          rewrite={(v) => { const r = setRouteMode(box.text, viewKey, v); if (!r.error) box.setText(r.text); }} />
        {mode === 'milk-run' && <ListStated box={box} viewKey={viewKey} path="route.stops" label="Stops in the order sailed (stated)" />}
        {mode === 'milk-run' && Array.from({ length: nLegs }, (_, k) => (
          <StatedControl key={`l${k}`} box={box} viewKey={viewKey} path={`route.legsNm.${k}`} label={`leg ${k + 1}, NM (stated)`} />
        ))}
        <StatedControl box={box} viewKey={viewKey} path="portHours" label="Port hours a voyage (stated)" />
        {weatherFactor && <StatedControl box={box} viewKey={viewKey} path="weather.factor" label="Weather factor (stated)" />}
        <AppliesControl box={box} viewKey={viewKey} />
        <StatedControl box={box} viewKey={viewKey} path="fuelPricePerT" label="Fuel price a tonne (stated)" />
      </FieldGrid>
      {is.map((x, i) => {
        const who = `installation ${x && x.id !== undefined ? x.id : i + 1}`;
        return (
          <div key={`i${i}`} className="mt-2">
            <FieldGrid>
              {mode === 'dedicated' && <StatedControl box={box} viewKey={viewKey} path={`installations.${i}.distanceFromBaseNm`} label={`${who}: distance from the base, NM (stated)`} />}
              <StatedControl box={box} viewKey={viewKey} path={`installations.${i}.fieldHours`} label={`${who}: field hours (stated)`} />
              {load === 'demand' && <StatedControl box={box} viewKey={viewKey} path={`installations.${i}.minVisits`} label={`${who}: minimum visits (stated)`} />}
              <StatedControl box={box} viewKey={viewKey} path={`installations.${i}.${load}.deckAreaM2`} label={`${who}: ${load === 'cargo' ? 'deck cargo' : 'deck demand'}, m2 (stated)`} />
              <StatedControl box={box} viewKey={viewKey} path={`installations.${i}.${load}.deckWeightT`} label={`${who}: ${load === 'cargo' ? 'deck cargo' : 'deck demand'}, t (stated)`} />
              {ps.map((p) => <StatedControl key={`b${p.id}`} box={box} viewKey={viewKey} path={`installations.${i}.${load}.bulk.${p.id}`} label={`${who}: ${p.id}, m3 (stated; not stated carries none)`} />)}
            </FieldGrid>
          </div>
        );
      })}
      <MissingStated box={box} viewKey={viewKey} required={[['vessel', 'the vessel'], ['products', 'the products'], ['installations', 'the installations'], ['route', 'the route'],
        ['portHours', 'portHours'], ['weather.factor', 'weather.factor'], ['weather.appliesTo', 'weather.appliesTo'], ['fuelPricePerT', 'fuelPricePerT']]} />
      <Note>The installations, the products and the vessel&apos;s tanks are listed in the box below; each input they carry has its control above.</Note>
    </>
  );
};

/** What the engine returns for a voyage plan. */
export const VoyagePlanResult = ({ r }) => (
  <>
    <Tbl head={['voyage', 'stops', 'NM', 'sailing hours', 'port hours', 'field hours', 'total hours', 'days', 'fuel t', 'fuel cost', 'deadweight load, t', 'binding', 'binding utilisation', 'feasible']}
      rows={r.voyages.map((v) => [v.id, v.stops.join(', '), six(v.nm), six(v.hours.sailing), six(v.hours.port), six(v.hours.field), six(v.hours.total), six(v.days), six(v.fuelT.total), six(v.fuelCost), six(v.load.deadweightT), v.binding.constraint, six(v.binding.utilisation), String(v.feasible)])} />
    <Tbl head={['voyage', 'constraint', 'unit', 'load', 'capacity', 'utilisation']}
      rows={r.voyages.flatMap((v) => v.constraints.map((c) => [v.id, c.constraint, c.unit, six(c.load), six(c.capacity), six(c.utilisation)]))} />
    <Tbl head={['voyage', 'leg', 'from', 'to', 'NM', 'calm hours']}
      rows={r.voyages.flatMap((v) => v.legs.map((l, i) => [v.id, String(i + 1), l.from, l.to, six(l.nm), six(l.calmHours)]))} />
    <Tbl head={['voyage', 'fuel sailing, t', 'fuel port, t', 'fuel field, t']} rows={r.voyages.map((v) => [v.id, six(v.fuelT.sailing), six(v.fuelT.port), six(v.fuelT.field)])} />
    <TileGrid>
      <Tile label="Total hours" value={six(r.totals.hours)} />
      <Tile label="Total days" value={six(r.totals.days)} />
      <Tile label="Total fuel, t" value={six(r.totals.fuelT)} />
      <Tile label="Total fuel cost" value={six(r.totals.fuelCost)} />
    </TileGrid>
    <Reasons items={r.voyages.flatMap((v) => v.reasons.map((x) => `${v.id}: ${x}`))} />
    <EngineNote text={r.basis.rule} />
    <Source text={r.basis.source} />
  </>
);

export const VOYAGE_STARTS = [
  ['voyEkenePsv', 'Ekene PSV milk run, rainy season'], ['voyEkeneAhts', 'Ekene AHTS milk run'], ['voyDedicatedPsv', 'Ekene PSV, dedicated voyages'],
  ['voyCalm', 'Ekene PSV milk run, calm'], ['voyWeatherAll', 'Ekene PSV, weather on every activity'], ['voyDeckOverloaded', 'Ekene deck cargo doubled'],
  ['voyAtCapacity', 'A load exactly at capacity'], ['voyOneOver', 'One tonne over the deck load'], ['voyTie', 'A binding tie'], ['voyTank', 'A tank that binds'],
  ['voyDeadweight', 'A heavy liquid and the deadweight'], ['voyDecimalSum', 'A decimal sum at capacity'], ['voyZeroLeg', 'A leg of zero'],
  ['voySkokoDay', 'A day of fuel (Skoko Table 1)'], ['voySkokoAhts', 'The AHTS optimal month (Skoko Table 7)'],
];

export const VoyagePlanMode = ({ initialCase = null, initialText = null, initialBlock = null, starts = VOYAGE_STARTS }) => {
  const { box, blocks, blockKey, setBlock } = useViewBox('voyagePlan', STARTS[starts[0][0]], { initialCase, initialText, initialBlock });
  const r = box.parsed.error ? null : viewRun('voyagePlan', box.parsed.value, blockKey);
  return (
    <>
      <Starts box={box} starts={starts} />
      <FieldGrid><BlockSelector blocks={blocks} value={blockKey} onChange={setBlock} /></FieldGrid>
      <VoyageControls box={box} viewKey={blockKey} load="cargo" />
      <Box box={box} label="voyagePlan inputs (JSON: vessel, products, installations with their cargo, route, portHours, weather, fuelPricePerT), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <VoyagePlanResult r={r} />}
    </>
  );
};

const VOYAGE_ROUNDING = [['up', 'up to whole voyages (up)'], ['none', 'not at all: the fractional average (none)']];
const VESSEL_ROUNDING = [['up', 'up (up)'], ['nearest', 'to the nearest, halves up (nearest)'], ['none', 'not at all (none)']];

/** The period and the two rounding rules, each a visible control. */
export const FleetControls = ({ box, viewKey }) => (
  <>
    <FieldGrid>
      <StatedControl box={box} viewKey={viewKey} path="periodDays" label="Period, days (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="vesselAvailableDays" label="Days a vessel is available (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="voyageRounding" label="Voyage rounding (stated)" options={VOYAGE_ROUNDING} />
      <StatedControl box={box} viewKey={viewKey} path="vesselRounding" label="Vessel rounding (stated)" options={VESSEL_ROUNDING} />
    </FieldGrid>
    <MissingStated box={box} viewKey={viewKey} required={[['periodDays', 'periodDays'], ['vesselAvailableDays', 'vesselAvailableDays'], ['voyageRounding', 'voyageRounding'], ['vesselRounding', 'vesselRounding']]} />
  </>
);

/** What the engine returns for fleet sizing. */
export const FleetSizeResult = ({ r }) => (
  <>
    <Tbl head={['voyage set', 'stops', 'NM', 'voyages before rounding', 'voyages', 'driven by', 'voyage days', 'vessel-days', 'fuel t']}
      rows={r.voyageSets.map((s) => [s.id, s.stops.join(', '), six(s.nm), six(s.voyagesExact), Number.isInteger(s.voyages) ? String(s.voyages) : six(s.voyages), s.drivenBy, six(s.voyageDays), six(s.vesselDays), six(s.fuelT)])} />
    <Tbl head={['voyage set', 'constraint', 'demand in the period', 'capacity a voyage', 'average utilisation']}
      rows={r.voyageSets.flatMap((s) => s.constraints.map((c) => [s.id, c.constraint, six(c.demand), six(c.capacity), six(c.averageUtilisation)]))} />
    <TileGrid>
      <Tile label="Vessel-days" value={six(r.vesselDays)} />
      <Tile label="Vessels before rounding" value={six(r.vesselsExact)} />
      <Tile label="Vessels" value={Number.isInteger(r.vessels) ? String(r.vessels) : six(r.vessels)} />
      <Tile label="Capacity, vessel-days" value={six(r.capacityDays)} />
      <Tile label="Spare vessel-days" value={six(r.spareVesselDays)} />
      <Tile label="Short vessel-days" value={six(r.shortVesselDays)} />
      <Tile label="Fleet utilisation" value={six(r.fleetUtilisation)} />
      <Tile label="Fuel for the period, t" value={six(r.fuelT)} />
      <Tile label="Fuel cost for the period" value={six(r.fuelCost)} />
    </TileGrid>
    <Reasons items={r.reasons} />
    <EngineNote text={r.basis.rule} />
    <Source text={r.basis.source} />
  </>
);

export const FLEET_STARTS = [
  ['fleetEkenePsv', 'Ekene week, PSV milk run'], ['fleetEkeneAhts', 'Ekene week, AHTS milk run'], ['fleetDedicatedPsv', 'Ekene week, PSV dedicated'],
  ['fleetDedicatedAhts', 'Ekene week, AHTS dedicated'], ['fleetFractional', 'Ekene week, voyages not rounded'], ['fleetNearest', 'Ekene week, vessels to the nearest'],
  ['fleetCalm', 'Ekene week, calm'], ['fleetExactlyThree', 'Exactly three voyages of demand'], ['fleetJustOverThree', 'Just over three voyages'],
  ['fleetDecimalThree', 'A decimal ratio of three'], ['fleetMinVisits', 'Minimum visits drive'], ['fleetTieDemand', 'Demand equal to the visits'],
  ['fleetNoDemand', 'No demand and no visits'], ['fleetTank', 'A tank drives'], ['fleetVesselsUp', 'Vessels rounded up'], ['fleetNearestShort', 'Vessels to the nearest, short'],
  ['fleetVesselsNone', 'Vessels not rounded'], ['fleetHalfUp', 'A half rounds up'], ['fleetExactlyTwo', 'Exactly two vessels of vessel-days'],
  ['fleetLonger', 'A voyage longer than the days available'], ['fleetAvailableEqual', 'Available days equal to the period'],
];

export const FleetSizeMode = ({ initialCase = null, initialText = null, initialBlock = null, starts = FLEET_STARTS }) => {
  const { box, blocks, blockKey, setBlock } = useViewBox('fleetSize', STARTS[starts[0][0]], { initialCase, initialText, initialBlock });
  const r = box.parsed.error ? null : viewRun('fleetSize', box.parsed.value, blockKey);
  return (
    <>
      <Starts box={box} starts={starts} />
      <FieldGrid><BlockSelector blocks={blocks} value={blockKey} onChange={setBlock} /></FieldGrid>
      <FleetControls box={box} viewKey={blockKey} />
      <VoyageControls box={box} viewKey={blockKey} load="demand" />
      <Box box={box} label="fleetSize inputs (JSON: vessel, products, installations with their demand and minimum visits, route, portHours, weather, fuelPricePerT, periodDays, vesselAvailableDays, voyageRounding, vesselRounding), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <FleetSizeResult r={r} />}
    </>
  );
};

export const MODES = [
  ['voyagePlan', 'The voyage plan'],
  ['fleetSize', 'Fleet sizing for a period'],
];

const VoyageCalculator = ({ initialMode = 'voyagePlan', initialCase = null, initialText = null, initialBlock = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Voyage and fleet calculator"
      subtitle="The voyages of one vessel on a stated route with the binding capacity constraint named, and the fleet a period's demand needs by the stated rounding rules."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'voyagePlan' && <VoyagePlanMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />}
        {mode === 'fleetSize' && <FleetSizeMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />}
      </div>
      <Note>This is the course&apos;s own calculator, and the Suite&apos;s Marine Logistics Planner runs the same engine: every number here is a return value of the vendored engine. The Ekene cluster is synthetic; paste your own inputs, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default VoyageCalculator;
