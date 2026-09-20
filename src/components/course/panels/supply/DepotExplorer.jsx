import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend,
} from 'recharts';
import {
  IBAFO_RACK, IBAFO_TANKS, IBAFO_DAILY_M3, IBAFO_ECONOMICS, SYNTHETIC_LOSS_FACTOR_KG_PER_T, IBAFO_LANE,
  IBAFO_DEMAND_L_PER_DAY, IBAFO_STATION, rackAt, rackCurveAt, baySweepAt, arrivalSweepAt, farmAt, economicsAt,
  laneAt, fleetAt, stationAt, nozzleSweepAt, fmt,
} from './supplyLab';
import {
  AXIS, TOOLTIP, GRID, SERIES, txt, usable, Tbl, Refusal, EngineNote, Note, Lead, Labelled, Empty, safe, NumBox, Stepper,
} from './panelBits';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid,
} from '@/components/course/panels/petrophysics/panelKit';

// Depot explorer, the Professional tier throughout.
//
// ONE DEPOT, SIX QUESTIONS. The IBAFO inland depot's loading rack as a queue,
// its tank farm tank by tank, its throughput economics with the carbon ledger
// beside the money one, a truck lane to a station cluster, the fleet that lane
// needs and one forecourt. Every figure is a return value of the vendored
// terminalDepot and fuelPricing modules through the teaching lab.
//
// A BAY IS A WHOLE NUMBER. The bays and the nozzles are steppers that can still
// be typed into, so a fractional or a zero entry reaches the engine and the
// engine's refusal is what the learner reads.
//
// EVERY COST IS INVENTED, AND THE EMISSION FACTOR IS SYNTHETIC. A blank cost box
// is a missing cost, named by the engine.

export const MODES = [
  ['rack', 'The loading rack as a queue: offered load, waiting and the rack that cannot keep up'],
  ['farm', 'The tank farm tank by tank: heels, pumpable stock, cover and turns'],
  ['economics', 'Throughput economics, with the carbon ledger beside the money one'],
  ['lane', 'The lane, the fleet it needs and the forecourt'],
];

const asText = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v === null || v === undefined ? '' : String(v)]));

// ---------------------------------------------------------------------------

export const RackMode = ({ rack, curve, baySweep, arrivalSweep, inputs, onInput }) => {
  if (!usable(rack) || !inputs) return <Empty>The rack reader has returned nothing, so there is no queue to draw.</Empty>;
  const a = Number(inputs.arrivalsPerHour);
  return (
    <>
      <FieldGrid>
        <NumBox label="Trucks arriving an hour" value={inputs.arrivalsPerHour} onChange={(v) => onInput('arrivalsPerHour', v)} />
        <NumBox label="Mean minutes a load" value={inputs.loadMinutes} onChange={(v) => onInput('loadMinutes', v)} />
        <Stepper label="Bays, a whole number" value={inputs.bays} onChange={(v) => onInput('bays', v)} />
      </FieldGrid>
      {rack.utilisation !== null && (
        <TileGrid>
          <Tile label="Offered load, erlangs" value={fmt.erlang(rack.offered)} />
          <Tile label="Utilisation" value={fmt.util(rack.utilisation)} />
          <Tile label="Probability of waiting (Erlang C)" value={fmt.prob(rack.probabilityOfWaiting)} />
          <Tile label="Mean wait, minutes" value={fmt.min(rack.averageWaitMinutes)} />
          <Tile label="Mean time on site, minutes" value={fmt.min(rack.averageTimeOnSiteMinutes)} />
          <Tile label="Mean queue, trucks" value={fmt.queue(rack.queueLength)} />
        </TileGrid>
      )}
      {rack.refusal && <Refusal message={rack.refusal} />}
      {rack.stable && (
        <Labelled tag="the digest's arithmetic on the engine's figures">
          <p className="text-xs text-slate-300 mb-0">
            The wait of a truck that does queue, the mean wait over the probability of waiting:
            {' '}{fmt.min(rack.waitIfQueuedDerivedMinutes)} minutes. Erlang B, every bay busy in a rack with no queue, from
            the engine&apos;s Erlang C by B = C x (1 - utilisation) / (1 - utilisation x C): {fmt.prob(rack.erlangBDerived)}.
            Little&apos;s law, arrivals an hour x the mean wait in hours: {fmt.queue(rack.littleQueueDerived)} trucks, beside
            the engine&apos;s {fmt.queue(rack.queueLength)}.
          </p>
        </Labelled>
      )}
      {Array.isArray(curve) && curve.length > 0 && (
        <div className="mt-3 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curve} margin={{ top: 8, right: 16, bottom: 18, left: 8 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
              <XAxis dataKey="arrivalsPerHour" type="number" tick={AXIS} label={{ value: 'trucks arriving an hour', position: 'insideBottom', offset: -8, fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={AXIS} label={{ value: 'mean wait, min', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP} />
              {Number.isFinite(a) && <ReferenceLine x={a} stroke={SERIES[3]} strokeDasharray="4 4" />}
              <Line type="monotone" dataKey="averageWaitMinutes" name="mean wait, minutes" stroke={SERIES[0]} dot={{ r: 2 }} isAnimationActive={false} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <Note>The curve stops where the engine says the rack cannot keep up: at a utilisation of one there is no mean wait.</Note>
      <Lead>The IBAFO rack, the bays swept:</Lead>
      <Tbl
        head={['bays', 'utilisation', 'stable', 'probability of waiting', 'mean wait minutes', 'mean queue trucks']}
        rows={(Array.isArray(baySweep) ? baySweep : []).map((x) => [x.bays, fmt.util(x.utilisation), txt(x.stable), fmt.prob(x.probabilityOfWaiting), fmt.min(x.averageWaitMinutes), fmt.queue(x.queueLength)])}
      />
      <Lead>The IBAFO rack, the arrivals swept:</Lead>
      <Tbl
        head={['arrivals an hour', 'offered load', 'utilisation', 'the engine answers']}
        rows={(Array.isArray(arrivalSweep) ? arrivalSweep : []).map((x) => [x.inputs.arrivalsPerHour, fmt.erlang(x.offered), fmt.util(x.utilisation), x.stable
          ? `probability of waiting ${fmt.prob(x.probabilityOfWaiting)}, mean wait ${fmt.min(x.averageWaitMinutes)} minutes`
          : `REFUSED: ${txt(x.refusal)}`])}
      />
    </>
  );
};

export const FarmMode = ({ farm, stocks, onStock, daily, onDaily }) => {
  if (!usable(farm) || !Array.isArray(farm.tanks)) return <Empty>The farm reader has returned nothing, so there is no farm to draw.</Empty>;
  return (
    <>
      <FieldGrid>
        {farm.tanks.map((t) => (
          <NumBox key={t.id} label={`${t.id} stock, m3 (heel ${fmt.m3(t.heelM3)})`} value={stocks ? stocks[t.id] : t.stockM3} onChange={(v) => onStock(t.id, v)} />
        ))}
        <NumBox label="Daily throughput (liftings), m3" value={daily} onChange={onDaily} />
      </FieldGrid>
      <div className="mt-3 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={farm.tanks} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="id" tick={AXIS} />
            <YAxis tick={AXIS} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="stockAtOrBelowHeelDrawnM3" name="stock at or below the heel" stackId="t" fill={SERIES[5]} isAnimationActive={false} />
            <Bar dataKey="pumpableM3" name="pumpable, the engine" stackId="t" fill={SERIES[2]} isAnimationActive={false} />
            <Bar dataKey="ullageM3" name="ullage, the engine" stackId="t" fill={GRID} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Tbl
        head={['tank', 'capacity m3', 'heel m3', 'stock m3', 'pumpable m3', 'ullage m3']}
        rows={farm.tanks.map((t) => [t.id, fmt.m3(t.capacityM3), fmt.m3(t.heelM3), fmt.m3(t.stockM3), fmt.m3(t.pumpableM3), fmt.m3(t.ullageM3)])}
      />
      <TileGrid>
        <Tile label="Working capacity, m3" value={fmt.m3(farm.workingCapacityM3)} />
        <Tile label="Pumpable stock, tank by tank, m3" value={fmt.m3(farm.pumpableStockM3)} />
        <Tile label="Days of cover" value={fmt.days(farm.daysOfCover)} />
        <Tile label="Turns a year" value={fmt.turns(farm.turnsPerYear)} />
      </TileGrid>
      <Labelled tag="the figure the engine does not use">
        <p className="text-xs text-slate-300 mb-0">
          The farm&apos;s stock less the farm&apos;s heel: {fmt.m3(farm.stockLessHeelNotUsedM3)} m3, beside the engine&apos;s
          pumpable stock of {fmt.m3(farm.pumpableStockM3)} m3. A tank below its own heel lends nothing to another tank&apos;s
          heel, because no pump can move it there.
        </p>
      </Labelled>
    </>
  );
};

export const EconomicsMode = ({ econ, inputs, onInput }) => {
  if (!usable(econ) || !inputs) return <Empty>The economics reader has returned nothing, so there is no ledger to show.</Empty>;
  return (
    <>
      <FieldGrid>
        <NumBox label="Throughput, m3" value={inputs.throughputM3} onChange={(v) => onInput('throughputM3', v)} />
        <NumBox label="Fee, USD a m3" tag="invented" value={inputs.feePerM3} onChange={(v) => onInput('feePerM3', v)} />
        <NumBox label="Variable cost, USD a m3" tag="invented" value={inputs.variableCostPerM3} onChange={(v) => onInput('variableCostPerM3', v)} />
        <NumBox label="Fixed cost for the period, USD" tag="invented" value={inputs.fixedCostPerPeriod} onChange={(v) => onInput('fixedCostPerPeriod', v)} />
        <NumBox label="Loss, m3" value={inputs.lossM3} onChange={(v) => onInput('lossM3', v)} />
        <NumBox label="Product density, kg/m3" value={inputs.productDensityKgM3} onChange={(v) => onInput('productDensityKgM3', v)} />
        <NumBox label="Emission factor, kg CO2e a tonne" tag="SYNTHETIC" value={inputs.lossEmissionFactorKgCo2ePerTonne} onChange={(v) => onInput('lossEmissionFactorKgCo2ePerTonne', v)} />
      </FieldGrid>
      {econ.refusal ? <Refusal message={econ.refusal} /> : (
        <div className="grid gap-3 sm:grid-cols-2 mt-3">
          <div className="rounded-md border border-slate-700 p-3">
            <p className="text-xs text-slate-400 mb-1">The money ledger, USD</p>
            <Tbl
              head={['item', 'value']}
              rows={[
                ['revenue', fmt.usd(econ.revenue)], ['variable cost', fmt.usd(econ.variableCost)], ['fixed cost', fmt.usd(econ.fixedCost)],
                ['margin', fmt.usd(econ.margin)], ['margin a m3', fmt.usd(econ.marginPerM3)], ['taken as zero and named', txt(econ.assumedZero)],
              ]}
            />
          </div>
          <div className="rounded-md border border-slate-700 p-3">
            <p className="text-xs text-slate-400 mb-1">The carbon ledger, from the same movements</p>
            <Tbl
              head={['item', 'value']}
              rows={[
                ['loss, tonnes', fmt.tonnes(econ.lossTonnes)], ['emissions, kg CO2e', fmt.kg(econ.emissionsKgCo2e)],
                ['kg CO2e a tonne of throughput', fmt.share(econ.kgCo2ePerTonneThroughput)],
              ]}
            />
            {econ.carbonNote && <EngineNote>{econ.carbonNote}</EngineNote>}
          </div>
        </div>
      )}
      <Note>
        The factor starts at {SYNTHETIC_LOSS_FACTOR_KG_PER_T} kg CO2e a tonne, SYNTHETIC and invented for this course. The
        engine ships no emission factor; clear the box and the carbon side is not computed.
      </Note>
    </>
  );
};

const LANE_BOXES = [
  ['distanceKm', 'Distance, km'], ['payloadLitres', 'Payload, litres'], ['averageSpeedKmh', 'Average speed, km/h'],
  ['loadHours', 'Hours to load'], ['dischargeHours', 'Hours to discharge'], ['queueHours', 'Hours queueing'],
  ['fuelConsumptionLPer100Km', 'Diesel, litres a 100 km'], ['dieselPricePerLitre', 'Diesel, naira a litre', 'invented'],
  ['driverCostPerTrip', 'Driver, naira a trip', 'invented'], ['maintenancePerKm', 'Maintenance, naira a km', 'invented'],
  ['tyresPerKm', 'Tyres, naira a km', 'invented'], ['overheadPerTrip', 'Overhead, naira a trip', 'invented'],
  ['tollsAndLeviesPerTrip', 'Tolls and levies, naira a trip', 'invented'], ['truckCapitalCost', 'Truck capital cost, naira', 'invented'],
  ['truckLifeYears', 'Truck life, years'], ['workingHoursPerDay', 'Working hours a day'], ['workingDaysPerYear', 'Working days a year'],
  ['transitLossPercent', 'Transit loss, percent'],
];

export const LaneMode = ({ lane, laneInputs, onLane, fleet, demand, onDemand, station, stationInputs, onStation, nozzles }) => {
  if (!usable(lane) || !laneInputs) return <Empty>The lane reader has returned nothing, so there is no lane to cost.</Empty>;
  const st = usable(station) ? station : null;
  const fl = usable(fleet) ? fleet : null;
  return (
    <>
      <Lead>The lane. Every cost is invented for this course; a blank box is a missing cost, and the engine names it.</Lead>
      <FieldGrid>
        {LANE_BOXES.map(([k, label, tag]) => (
          <NumBox key={k} label={label} tag={tag} value={laneInputs[k]} onChange={(v) => onLane(k, v)} />
        ))}
      </FieldGrid>
      {lane.refusal ? <Refusal message={lane.refusal} /> : (
        <>
          <TileGrid>
            <Tile label="Complete" value={txt(lane.complete)} />
            <Tile label="Missing, named by the engine" value={txt(lane.missingInputs)} />
            <Tile label="Cycle, hours" value={fmt.hours(lane.cycleHours)} />
            <Tile label="Trips a truck a day" value={fmt.trips(lane.tripsPerTruckPerDay)} />
            <Tile label="Cost a trip, naira" value={fmt.usd(lane.costPerTrip)} />
            <Tile label="Litres delivered a trip" value={fmt.litres(lane.deliveredLitresPerTrip)} />
            <Tile label="Cost a litre delivered, naira" value={fmt.localL(lane.costPerLitreDelivered)} />
          </TileGrid>
          <Tbl
            head={['cost line', 'naira a trip', 'missing']}
            rows={lane.components.map((c) => [c.label, c.amount === null ? 'none' : fmt.usd(c.amount), c.required ? 'yes' : ''])}
          />
          {lane.carbonNote && <EngineNote>{lane.carbonNote}</EngineNote>}
          {!lane.complete && <Note>With a cost missing, the cost a litre is a floor.</Note>}
        </>
      )}

      <Lead>The fleet, on the lane&apos;s own trips a truck a day.</Lead>
      <FieldGrid>
        <NumBox label="Demand, litres a day" value={demand} onChange={onDemand} />
      </FieldGrid>
      {fl && (fl.refusal ? <Refusal message={fl.refusal} /> : (
        <TileGrid>
          <Tile label="Trips needed a day" value={fmt.trips(fl.tripsNeededPerDay)} />
          <Tile label="Trucks required" value={txt(fl.trucksRequired)} />
          <Tile label="Fleet utilisation" value={fmt.util(fl.utilisation)} />
          <Tile label="Spare trips a day" value={fmt.trips(fl.spareTripsPerDay)} />
          <Tile label="Spare litres a day" value={fmt.litres(fl.spareLitresPerDay)} />
        </TileGrid>
      ))}

      <Lead>The forecourt: its queue is rackQueue with nozzles for bays.</Lead>
      {stationInputs && (
        <FieldGrid>
          <Stepper label="Nozzles, a whole number" value={stationInputs.nozzles} onChange={(v) => onStation('nozzles', v)} />
          <NumBox label="Litres a day" value={stationInputs.dailyThroughputLitres} onChange={(v) => onStation('dailyThroughputLitres', v)} />
          <NumBox label="Reorder at, a fraction of usable" value={stationInputs.reorderAtFraction} onChange={(v) => onStation('reorderAtFraction', v)} />
          <NumBox label="Delivery payload, litres" value={stationInputs.deliveryPayloadLitres} onChange={(v) => onStation('deliveryPayloadLitres', v)} />
        </FieldGrid>
      )}
      {st && (st.refusal ? <Refusal message={st.refusal} /> : (
        <>
          <TileGrid>
            <Tile label="Peak transactions an hour" value={txt(st.peakTransactionsPerHour)} />
            <Tile label="Service minutes a transaction" value={txt(st.serviceMinutesPerTransaction)} />
            <Tile label="Forecourt utilisation" value={fmt.util(st.queue.utilisation)} />
            <Tile label="Probability of waiting" value={st.queue.stable ? fmt.prob(st.queue.probabilityOfWaiting) : 'none'} />
            <Tile label="Mean wait, minutes" value={st.queue.stable ? fmt.min(st.queue.averageWaitMinutes) : 'none'} />
            <Tile label="Reorder level, litres" value={fmt.litres(st.reorderLevelLitres)} />
            <Tile label="Ullage at reorder, litres" value={fmt.litres(st.ullageAtReorderLitres)} />
            <Tile label="The payload fits the ullage" value={txt(st.payloadFitsUllage)} />
          </TileGrid>
          {st.queue.refusal && <Refusal message={st.queue.refusal} />}
          {st.ullageWarning && <EngineNote>{st.ullageWarning}</EngineNote>}
        </>
      ))}
      <Tbl
        head={['nozzles', 'utilisation', 'stable', 'probability of waiting', 'mean wait minutes']}
        rows={(Array.isArray(nozzles) ? nozzles : []).map((x) => [x.inputs.nozzles, fmt.util(x.queue.utilisation), txt(x.queue.stable), fmt.prob(x.queue.probabilityOfWaiting), x.queue.stable ? fmt.min(x.queue.averageWaitMinutes) : 'none'])}
      />
    </>
  );
};

// ---------------------------------------------------------------------------

const DepotExplorer = ({ initialMode = 'rack' }) => {
  const [mode, setMode] = useState(initialMode);
  const [rackIn, setRackIn] = useState(() => asText(IBAFO_RACK));
  const [stocks, setStocks] = useState(() => Object.fromEntries(IBAFO_TANKS.map((t) => [t.id, String(t.stockM3)])));
  const [daily, setDaily] = useState(String(IBAFO_DAILY_M3));
  const [econIn, setEconIn] = useState(() => asText({ ...IBAFO_ECONOMICS, lossEmissionFactorKgCo2ePerTonne: SYNTHETIC_LOSS_FACTOR_KG_PER_T }));
  const [laneIn, setLaneIn] = useState(() => asText(IBAFO_LANE));
  const [demand, setDemand] = useState(String(IBAFO_DEMAND_L_PER_DAY));
  const [stationIn, setStationIn] = useState(() => asText(IBAFO_STATION));

  const rack = useMemo(() => (mode === 'rack' ? safe(() => rackAt(rackIn)) : null), [mode, rackIn]);
  const curve = useMemo(() => (mode === 'rack' ? safe(() => rackCurveAt({ loadMinutes: rackIn.loadMinutes, bays: rackIn.bays })) : null), [mode, rackIn]);
  const baySweep = useMemo(() => (mode === 'rack' ? safe(baySweepAt) : null), [mode]);
  const arrivalSweep = useMemo(() => (mode === 'rack' ? safe(arrivalSweepAt) : null), [mode]);
  const farm = useMemo(() => (mode === 'farm' ? safe(() => farmAt(IBAFO_TANKS.map((t) => ({ ...t, stockM3: stocks[t.id] })), daily)) : null), [mode, stocks, daily]);
  const econ = useMemo(() => (mode === 'economics' ? safe(() => economicsAt(econIn)) : null), [mode, econIn]);
  const lane = useMemo(() => (mode === 'lane' ? safe(() => laneAt(laneIn)) : null), [mode, laneIn]);
  const fleet = useMemo(() => (mode === 'lane' && lane && !lane.refusal ? safe(() => fleetAt(demand, lane)) : null), [mode, demand, lane]);
  const station = useMemo(() => (mode === 'lane' ? safe(() => stationAt(stationIn)) : null), [mode, stationIn]);
  const nozzles = useMemo(() => (mode === 'lane' ? safe(nozzleSweepAt) : null), [mode]);

  return (
    <PanelShell
      title="Depot explorer"
      subtitle="The IBAFO inland depot: its loading rack as a queue, its tank farm tank by tank, its throughput economics, a truck lane, the fleet it needs and a forecourt. Every figure is the engine's."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'rack' && <RackMode rack={rack} curve={curve} baySweep={baySweep} arrivalSweep={arrivalSweep} inputs={rackIn} onInput={(k, v) => setRackIn((x) => ({ ...x, [k]: v }))} />}
        {mode === 'farm' && <FarmMode farm={farm} stocks={stocks} onStock={(id, v) => setStocks((x) => ({ ...x, [id]: v }))} daily={daily} onDaily={setDaily} />}
        {mode === 'economics' && <EconomicsMode econ={econ} inputs={econIn} onInput={(k, v) => setEconIn((x) => ({ ...x, [k]: v }))} />}
        {mode === 'lane' && (
          <LaneMode
            lane={lane}
            laneInputs={laneIn}
            onLane={(k, v) => setLaneIn((x) => ({ ...x, [k]: v }))}
            fleet={fleet}
            demand={demand}
            onDemand={setDemand}
            station={station}
            stationInputs={stationIn}
            onStation={(k, v) => setStationIn((x) => ({ ...x, [k]: v }))}
            nozzles={nozzles}
          />
        )}
      </div>
      <Note>
        Every figure on this page is a return value of the vendored terminalDepot and fuelPricing modules through the
        teaching lab. Every refusal is the engine&apos;s own sentence. A blank box goes to the engine as missing.
      </Note>
    </PanelShell>
  );
};

export default DepotExplorer;
