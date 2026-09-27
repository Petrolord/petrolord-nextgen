import React, { useState } from 'react';
import { STARTS, viewRun, factorFor } from './marineLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, Refusal, EngineNote, Source, StatedControl, MissingStated, statedIn, RewriteControl, writeStated, BlockSelector, drawnNote,
} from './panelBits';
import {
  Box, Starts, useViewBox, VoyageControls, FleetControls,
} from './VoyageCalculator';

// The variability calculator (Expert): the fleet under weather and demand
// variability through the canonical seeded Monte Carlo of lib/stats
// (mulberry32 and the triangular inverse CDF), the weather factor drawn first
// and then the demand factor, each only when it varies; each draw sized as
// fleetSize does. Every Monte Carlo figure is printed with its seed and its
// draws and is labelled as not graded. Every figure is a return value of the
// vendored engine (engines/supplychain/marineLogistics.js) through marineLab.

const FORMS = [['fixed', 'a fixed number (fixed)'], ['triangular', 'a triangular: min, mode, max (triangular)']];

/**
 * A factor that is a number or a triangular, each a visible control. The form
 * chosen is kept on the panel, so choosing "fixed" asks for the number with
 * nothing written until the learner states it.
 */
const FactorControl = ({ box, viewKey, path, name }) => {
  const f = statedIn(box, viewKey, path);
  const stated = typeof f === 'number' ? 'fixed' : (f && typeof f === 'object' ? 'triangular' : undefined);
  const [chosen, setChosen] = useState(stated);
  const form = stated || chosen;
  return (
    <>
      <RewriteControl box={box} viewKey={viewKey} path={path} label={`${name}: form (stated)`} options={FORMS}
        current={() => form}
        rewrite={(v, old) => { setChosen(v); writeStated(box, viewKey, path, factorFor(v, old)); }} />
      {form === 'fixed' && <StatedControl box={box} viewKey={viewKey} path={path} label={`${name} (stated)`} />}
      {form === 'triangular' && ['min', 'mode', 'max'].map((k) => <StatedControl key={k} box={box} viewKey={viewKey} path={`${path}.${k}`} label={`${name}: ${k} (stated)`} />)}
    </>
  );
};

/** The two factors, the planned fleet, the draws and the seed, each a visible control. */
export const VariabilityControls = ({ box, viewKey }) => (
  <>
    <FieldGrid>
      <FactorControl box={box} viewKey={viewKey} path="weather.factor" name="Weather factor" />
      <FactorControl box={box} viewKey={viewKey} path="demandFactor" name="Demand factor" />
      <StatedControl box={box} viewKey={viewKey} path="plannedVessels" label="Planned vessels (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="iterations" label="Draws (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="seed" label="Seed (stated)" />
    </FieldGrid>
    <MissingStated box={box} viewKey={viewKey} required={[['weather.factor', 'weather.factor'], ['demandFactor', 'demandFactor'], ['plannedVessels', 'plannedVessels'], ['iterations', 'iterations'], ['seed', 'seed']]} />
  </>
);

const STATS = [['mean', 'mean'], ['p90', 'P90 (low)'], ['p50', 'P50'], ['p10', 'P10 (high)'], ['min', 'min'], ['max', 'max']];

/** What the engine returns for the fleet under variability; every Monte Carlo figure carries its seed and draws. */
export const VariabilityResult = ({ r, seed, iterations }) => (
  <>
    <TileGrid>
      <Tile label="Plan at the modes: weather factor" value={six(r.plan.weatherFactor)} />
      <Tile label="Plan at the modes: demand factor" value={six(r.plan.demandFactor)} />
      <Tile label="Plan at the modes: vessel-days" value={six(r.plan.vesselDays)} />
      <Tile label="Plan at the modes: vessels" value={Number.isInteger(r.plan.vessels) ? String(r.plan.vessels) : six(r.plan.vessels)} />
    </TileGrid>
    <Tbl head={['statistic', `vessel-days: ${drawnNote(seed, iterations)}`, `vessels required: ${drawnNote(seed, iterations)}`]}
      rows={STATS.map(([k, l]) => [l, six(r.vesselDays[k]), six(r.vesselsRequired[k])])} />
    {r.vesselsDistribution && (
      <Tbl head={['whole vessels', `share of the draws: ${drawnNote(seed, iterations)}`]} rows={r.vesselsDistribution.map((d) => [String(d.vessels), six(d.probability)])} />
    )}
    <TileGrid>
      <Tile label="Planned vessels" value={String(r.plannedVessels)} />
      <Tile label="Planned capacity, vessel-days" value={six(r.capacityDays)} />
      <Tile label={`Probability short (${drawnNote(seed, iterations)})`} value={six(r.probabilityShort)} />
      <Tile label={`Expected short vessel-days (${drawnNote(seed, iterations)})`} value={six(r.expectedShortVesselDays)} />
    </TileGrid>
    <EngineNote text={r.percentileDefinition} />
    <EngineNote text={r.basis.rule} />
    <Source text={r.basis.source} />
  </>
);

export const VARIABILITY_STARTS = [
  ['varEkenePsv', 'Ekene week, PSV milk run, weather and demand'], ['varEkeneAhts', 'Ekene week, AHTS dedicated'], ['varFixed', 'Both factors fixed'],
  ['varWeatherOnly', 'Weather alone'], ['varDemandOnly', 'Demand alone, voyages not rounded'], ['varPlannedZero', 'No vessels planned'],
  ['varAtCapacity', 'A need exactly at the planned capacity'], ['varShortAlways', 'One vessel fewer'],
];

export const VariabilityMode = ({ initialCase = null, initialText = null, initialBlock = null, starts = VARIABILITY_STARTS }) => {
  const { box, blocks, blockKey, setBlock } = useViewBox('fleetVariability', STARTS[starts[0][0]], { initialCase, initialText, initialBlock });
  const r = box.parsed.error ? null : viewRun('fleetVariability', box.parsed.value, blockKey);
  const seed = statedIn(box, blockKey, 'seed');
  const iterations = statedIn(box, blockKey, 'iterations');
  return (
    <>
      <Starts box={box} starts={starts} />
      <FieldGrid><BlockSelector blocks={blocks} value={blockKey} onChange={setBlock} /></FieldGrid>
      <VariabilityControls box={box} viewKey={blockKey} />
      <FleetControls box={box} viewKey={blockKey} />
      <VoyageControls box={box} viewKey={blockKey} load="demand" weatherFactor={false} />
      <Box box={box} label="fleetVariability inputs (JSON: every fleetSize input, the weather factor a number or a triangular, demandFactor, plannedVessels, iterations, seed), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <VariabilityResult r={r} seed={seed} iterations={iterations} />}
    </>
  );
};

export const MODES = [['fleetVariability', 'The fleet under weather and demand variability']];

const VariabilityCalculator = ({ initialMode = 'fleetVariability', initialCase = null, initialText = null, initialBlock = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Variability calculator"
      subtitle="The fleet under weather and demand variability through the canonical seeded Monte Carlo. Every figure is an estimate on the stated seed and draws, and none is graded."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'fleetVariability' && <VariabilityMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />}
      </div>
      <Note>This is the course&apos;s own calculator, and the Suite&apos;s Marine Logistics Planner runs the same engine: every number here is a return value of the vendored engine. A Monte Carlo figure changes with the seed and the draws, so it is always quoted with both, and no graded answer in this course is a Monte Carlo figure.</Note>
    </PanelShell>
  );
};

export default VariabilityCalculator;
