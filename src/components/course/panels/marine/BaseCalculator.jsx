import React, { useState } from 'react';
import { STARTS, viewRun, berthSweep, pick } from './marineLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, Refusal, EngineNote, Source, StatedControl, MissingStated, BlockSelector, BOOL, castBool,
} from './panelBits';
import { Box, Starts, useViewBox } from './VoyageCalculator';

// The shore base calculator (Expert): the berth queue at the supply base on
// the working-hour clock, as M/M/c by Erlang C (the delay probability by the
// stable Erlang B recursion, the mean queue and the mean wait) or as M/D/c by
// the Cosmetatos approximation (no delay probability), with the fewest berths
// that meet a stated target mean wait, and the same call at more berths.
// Every figure is a return value of the vendored engine
// (engines/supplychain/marineLogistics.js) through marineLab.

const MODELS = [['M/M/c', 'M/M/c: Poisson arrivals, exponential service (Erlang C)'], ['M/D/c', 'M/D/c: Poisson arrivals, constant service (an approximation)']];

/** Every input of a shore base, each a visible control. */
export const BaseControls = ({ box, viewKey }) => (
  <>
    <FieldGrid>
      <StatedControl box={box} viewKey={viewKey} path="berths" label="Berths (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="arrivalsPerDay" label="Arrivals a day (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="workingHoursPerDay" label="Working hours a day (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="service.fixedHours" label="Fixed hours a call (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="service.lifts" label="Crane lifts a call (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="service.liftsPerHour" label="Lifts an hour (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="service.bulkM3" label="Bulk a call, m3 (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="service.bulkM3PerHour" label="Bulk pumped an hour, m3 (stated)" />
      <StatedControl box={box} viewKey={viewKey} path="service.concurrent" label="Lifts and bulk at the same time (stated)" options={BOOL} cast={castBool} />
      <StatedControl box={box} viewKey={viewKey} path="model" label="Queue model (stated)" options={MODELS} />
      <StatedControl box={box} viewKey={viewKey} path="targetMeanWaitHours" label="Target mean wait, hours (optional)" />
    </FieldGrid>
    <MissingStated box={box} viewKey={viewKey} required={[['berths', 'berths'], ['arrivalsPerDay', 'arrivalsPerDay'], ['workingHoursPerDay', 'workingHoursPerDay'], ['service', 'the service'], ['service.concurrent', 'service.concurrent'], ['model', 'model']]} />
  </>
);

/** What the engine returns for a shore base, and the same call at more berths (stated probes). */
export const ShoreBaseResult = ({ r, sweep }) => (
  <>
    <TileGrid>
      <Tile label="Model" value={r.model} />
      <Tile label="Service hours" value={six(r.serviceHours)} />
      <Tile label="Lift hours" value={six(r.liftHours)} />
      <Tile label="Bulk hours" value={six(r.bulkHours)} />
      <Tile label="Arrivals an hour" value={six(r.arrivalsPerHour)} />
      <Tile label="Offered load" value={six(r.offeredLoad)} />
      <Tile label="Berth utilisation" value={six(r.berthUtilisation)} />
      <Tile label="Probability of waiting" value={r.probabilityWait === null ? 'not given for M/D/c' : six(r.probabilityWait)} />
      <Tile label="Mean queue" value={six(r.meanQueue)} />
      <Tile label="Mean wait, hours" value={six(r.meanWaitHours)} />
      <Tile label="Mean wait, working days" value={six(r.meanWaitWorkingDays)} />
      <Tile label="Mean time at the base, hours" value={six(r.meanTimeAtBaseHours)} />
      <Tile label="Mean in the system" value={six(r.meanInSystem)} />
    </TileGrid>
    {r.target && (
      <>
        <TileGrid>
          <Tile label="Target mean wait, hours" value={six(r.target.targetMeanWaitHours)} />
          <Tile label="Fewest berths that meet it" value={r.target.berths === null ? 'none up to the cap' : String(r.target.berths)} />
          <Tile label="Mean wait at those berths, hours" value={r.target.meanWaitHours === null ? 'none' : six(r.target.meanWaitHours)} />
        </TileGrid>
        <EngineNote text={r.target.reason} />
      </>
    )}
    {sweep.length > 0 && (
      <Tbl head={['berths (stated probe: the same call at more berths)', 'berth utilisation', 'probability of waiting', 'mean queue', 'mean wait, hours']}
        rows={sweep.map(([c, s]) => (s.error ? [String(c), 'refused', '', '', ''] : [String(c), six(s.berthUtilisation), s.probabilityWait === null ? 'not given' : six(s.probabilityWait), six(s.meanQueue), six(s.meanWaitHours)]))} />
    )}
    <EngineNote text={r.basis.rule} />
    <Source text={r.basis.source} />
  </>
);

export const BASE_STARTS = [
  ['baseEkeneMmc', 'Ekene supply base, M/M/c'], ['baseEkeneMdc', 'Ekene supply base, M/D/c'], ['baseTargetMmc', 'Ekene base, a one-hour target, M/M/c'],
  ['baseTargetMdc', 'Ekene base, a one-hour target, M/D/c'], ['baseSequential', 'Ekene base, lifts then bulk'], ['baseTwelveHour', 'Ekene base, a twelve-hour day'],
  ['baseOneBerth', 'Ekene base with one berth (refused)'], ['baseMd1', 'One berth, constant service'], ['baseMdc3', 'Three berths, constant service'],
  ['baseAr51c5', 'Adan and Resing Table 5.1, five servers'], ['baseAr52c20', 'Adan and Resing Table 5.2, twenty servers'], ['baseIversen1', 'Iversen Example 12.3.1, system one'],
  ['baseIversen2', 'Iversen Example 12.3.1, system two'], ['baseJustBelow', 'Just below saturation'], ['baseTargetExact', 'A target met exactly'], ['baseTargetZero', 'A target of zero'],
];

export const ShoreBaseMode = ({ initialCase = null, initialText = null, initialBlock = null, starts = BASE_STARTS }) => {
  const { box, blocks, blockKey, setBlock } = useViewBox('shoreBase', STARTS[starts[0][0]], { initialCase, initialText, initialBlock });
  const r = box.parsed.error ? null : viewRun('shoreBase', box.parsed.value, blockKey);
  const sweep = r && !r.error ? berthSweep(pick(box.parsed.value, blockKey)) : [];
  return (
    <>
      <Starts box={box} starts={starts} />
      <FieldGrid><BlockSelector blocks={blocks} value={blockKey} onChange={setBlock} /></FieldGrid>
      <BaseControls box={box} viewKey={blockKey} />
      <Box box={box} label="shoreBase inputs (JSON: berths, arrivalsPerDay, workingHoursPerDay, service, model, targetMeanWaitHours), or a whole case file" rows={12} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <ShoreBaseResult r={r} sweep={sweep} />}
    </>
  );
};

export const MODES = [['shoreBase', 'The berth queue']];

const BaseCalculator = ({ initialMode = 'shoreBase', initialCase = null, initialText = null, initialBlock = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Shore base calculator"
      subtitle="The berth queue at the supply base on the working-hour clock, as M/M/c or M/D/c, with the fewest berths that meet a stated target mean wait."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'shoreBase' && <ShoreBaseMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />}
      </div>
      <Note>This is the course&apos;s own calculator, and the Suite&apos;s Marine Logistics Planner runs the same engine: every number here is a return value of the vendored engine. A queue figure is a steady-state average of the stated model on the stated inputs.</Note>
    </PanelShell>
  );
};

export default BaseCalculator;
