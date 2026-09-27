import React, { useState } from 'react';
import {
  STARTS, READING_CASES, viewRun, setStated, distributionFor, correlationFor, movementFor,
  classifyOf, economicLimitOf, reconcileOf, aggregateOf,
} from './prmsLab';
import {
  PanelShell, SelectField, Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, Refusal, EngineNote, Reasons, Source, StatedControl, MissingStated, statedIn, WordStated,
  RewriteControl, writeStated, BlockSelector, drawnNote, safe,
} from './panelBits';
import { Box, Starts, useViewBox } from './ClassificationCalculator';
import { EconomicLimitMode } from './ReservesCalculator';

// The aggregation calculator (Expert): the total of several projects of one
// class by arithmetic summation and by the canonical seeded Monte Carlo of
// lib/stats, with a stated correlation, the risked mean of a risked class and
// what may be reported at the stated level; the reconciliation of a category
// set from one date to the next with its closing check; the economic limit
// again, for the two rules; and the readings the engine states, each printed
// from its golden case. Every figure is a return value of the vendored engine
// (engines/economics/prms.js) through prmsLab. The Monte Carlo figures are
// estimates on the stated seed and draws, and none is graded. This is the
// course's own calculator: there is no Suite app for this course.

const CLASSES = [['reserves', 'Reserves'], ['contingent', 'Contingent Resources'], ['prospective', 'Prospective Resources']];
const LEVELS = [['field', 'the field, property or project level (field)'], ['above-field', 'above the field level (above-field)']];
const DIST_TYPES = [['triangular-fit', 'a triangular fitted through stated estimates (triangular-fit)'], ['triangular', 'a triangular: min, mode, max (triangular)'], ['lognormal', 'a lognormal: mean, standard deviation (lognormal)'], ['normal', 'a normal: mean, standard deviation (normal)']];
const CORR_TYPES = [['uniform', 'one correlation for every pair (uniform)'], ['pairs', 'stated pair by pair (pairs, in the box)']];

/** Every input of an aggregation, each a visible control; the projects one by one. */
export const AggregateControls = ({ box, viewKey }) => {
  const projects = statedIn(box, viewKey, 'projects');
  const ps = Array.isArray(projects) ? projects : [];
  const cls = statedIn(box, viewKey, 'resourceClass');
  const corr = statedIn(box, viewKey, 'correlation');
  const write = (path, v) => writeStated(box, viewKey, path, v);
  return (
    <>
      <FieldGrid>
        <StatedControl box={box} viewKey={viewKey} path="resourceClass" label="Class (stated)" options={CLASSES} />
        <StatedControl box={box} viewKey={viewKey} path="level" label="Level (stated)" options={LEVELS} />
        <WordStated box={box} viewKey={viewKey} path="unit" label="Unit (stated)" />
        <RewriteControl box={box} viewKey={viewKey} path="correlation" label="Correlation (stated)" options={CORR_TYPES} rewrite={(v, old) => write('correlation', correlationFor(v, old))} />
        {corr && corr.type === 'uniform' && <StatedControl box={box} viewKey={viewKey} path="correlation.rho" label="Correlation for every pair (stated)" />}
        <StatedControl box={box} viewKey={viewKey} path="seed" label="Seed (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="iterations" label="Draws (stated)" />
      </FieldGrid>
      {ps.map((p, i) => {
        const who = `project ${i + 1}`;
        const d = p && p.distribution && typeof p.distribution === 'object' ? p.distribution : {};
        return (
          <div key={i} className="mt-2">
            <FieldGrid>
              <WordStated box={box} viewKey={viewKey} path={`projects.${i}.id`} label={`${who}: id (stated)`} />
              <RewriteControl box={box} viewKey={viewKey} path={`projects.${i}.distribution`} label={`${who}: distribution (stated)`} options={DIST_TYPES}
                rewrite={(v, old) => {
                  const a = setStated(box.text, viewKey, `projects.${i}.distribution`, distributionFor(v, old));
                  if (a.error) return;
                  const b = v === 'triangular-fit' ? a : setStated(a.text, viewKey, `projects.${i}.estimates`, undefined);
                  if (!b.error) box.setText(b.text);
                }} />
              {d.type === 'triangular' && ['min', 'mode', 'max'].map((k) => <StatedControl key={k} box={box} viewKey={viewKey} path={`projects.${i}.distribution.${k}`} label={`${who}: ${k} (stated)`} />)}
              {(d.type === 'lognormal' || d.type === 'normal') && [['mean', 'mean'], ['stdDev', 'standard deviation']].map(([k, l]) => <StatedControl key={k} box={box} viewKey={viewKey} path={`projects.${i}.distribution.${k}`} label={`${who}: ${l} (stated)`} />)}
              {d.type === 'triangular-fit' && [['low', 'low estimate'], ['best', 'best estimate'], ['high', 'high estimate']].map(([k, l]) => <StatedControl key={k} box={box} viewKey={viewKey} path={`projects.${i}.estimates.${k}`} label={`${who}: ${l} (stated)`} />)}
              {cls && cls !== 'reserves' && <StatedControl box={box} viewKey={viewKey} path={`projects.${i}.chanceOfCommercialityPct`} label={`${who}: chance of commerciality, percent (stated)`} />}
            </FieldGrid>
          </div>
        );
      })}
      <MissingStated box={box} viewKey={viewKey} required={[['resourceClass', 'resourceClass'], ['level', 'level'], ['unit', 'unit'], ['projects', 'the projects'], ['correlation', 'correlation'], ['seed', 'seed'], ['iterations', 'iterations']]} />
    </>
  );
};

/** What the engine returns for an aggregation; the Monte Carlo figures carry their seed and draws. */
export const AggregateResult = ({ r }) => (
  <>
    <Tbl head={['project', 'distribution', 'low', 'best', 'high', 'mean', 'chance of commerciality, percent']}
      rows={r.projects.map((p) => [p.id, p.distribution.type, six(p.low), six(p.best), six(p.high), six(p.mean), p.chanceOfCommercialityPct === null ? 'none' : six(p.chanceOfCommercialityPct)])} />
    <Tbl head={['category', 'arithmetic sum']} rows={[[r.labels.low, six(r.arithmetic.low)], [r.labels.best, six(r.arithmetic.best)], [r.labels.high, six(r.arithmetic.high)]]} />
    <Tbl head={['outcome', drawnNote(r.seed, r.iterations)]} rows={[['P90', six(r.statistical.low)], ['P50', six(r.statistical.best)], ['P10', six(r.statistical.high)], ['sampled mean', six(r.statistical.mean)]]} />
    <TileGrid>
      <Tile label="Sum of the means" value={six(r.sumOfMeans)} />
      <Tile label="Risked mean" value={r.riskedMean === null ? 'none (Reserves)' : six(r.riskedMean)} />
      <Tile label="What may be reported" value={r.reportable} />
      <Tile label="Level" value={r.level} />
    </TileGrid>
    <Reasons items={r.reasons} />
    <EngineNote text={r.basis.monteCarlo} />
    <EngineNote text={r.basis.labels} />
    <Source text={r.basis.aggregation} />
  </>
);

export const AGGREGATE_STARTS = [
  ['aggReserves', 'Ekene Reserves at the field level'], ['aggReservesAboveField', 'Ekene Reserves above the field level'],
  ['aggReservesIndependent', 'Ekene Reserves, independent'], ['aggReservesStrong', 'Ekene Reserves, strongly correlated'],
  ['aggNegativeCorrelation', 'Ekene Reserves, a negative correlation'], ['aggContingent', 'Ekene Contingent Resources, risked'],
  ['aggProspective', 'Ekene Prospective Resources, risked'], ['aggConstant', 'A constant project added'],
  ['aggAgIndependent', 'The 2011 Guidelines blocks, independent'], ['aggAgDependent', 'The 2011 Guidelines blocks, near total dependence'],
  ['aggNuprc', 'The national 2P gas figure'],
];

export const AggregateMode = ({ initialCase = null, initialText = null, initialBlock = null, starts = AGGREGATE_STARTS }) => {
  const { box, blocks, blockKey, setBlock } = useViewBox('aggregate', STARTS[starts[0][0]], { initialCase, initialText, initialBlock });
  const r = box.parsed.error ? null : viewRun('aggregate', box.parsed.value, blockKey);
  return (
    <>
      <Starts box={box} starts={starts} />
      <FieldGrid><BlockSelector blocks={blocks} value={blockKey} onChange={setBlock} /></FieldGrid>
      <AggregateControls box={box} viewKey={blockKey} />
      <Box box={box} label="aggregate inputs (JSON: resourceClass, level, unit, projects, correlation, seed, iterations), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <AggregateResult r={r} />}
    </>
  );
};

const REC_CLASSES = [['reserves', 'Reserves'], ['contingent', 'Contingent Resources']];
const MOVE_TYPES = [['production', 'production (one quantity)'], ['revisions', 'revisions (signed)'], ['improved-recovery', 'improved recovery'], ['extensions-and-discoveries', 'extensions and discoveries'], ['acquisitions', 'acquisitions'], ['divestments', 'divestments (entered positive)'], ['transfers', 'transfers (signed)']];

/** Every input of a reconciliation, each a visible control; the movements one by one. */
export const ReconcileControls = ({ box, viewKey }) => {
  const moves = statedIn(box, viewKey, 'movements');
  const ms = Array.isArray(moves) ? moves : [];
  return (
    <>
      <FieldGrid>
        <StatedControl box={box} viewKey={viewKey} path="resourceClass" label="Class (stated)" options={REC_CLASSES} />
        <WordStated box={box} viewKey={viewKey} path="unit" label="Unit (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="periodYears" label="Period, years (stated)" />
        <StatedControl box={box} viewKey={viewKey} path="tolerance" label="Tolerance (stated)" />
        {['low', 'best', 'high'].map((k) => <StatedControl key={`o${k}`} box={box} viewKey={viewKey} path={`opening.${k}`} label={`Opening ${k} (stated)`} />)}
        {['low', 'best', 'high'].map((k) => <StatedControl key={`c${k}`} box={box} viewKey={viewKey} path={`closing.${k}`} label={`Stated closing ${k} (stated)`} />)}
      </FieldGrid>
      {ms.map((m, i) => {
        const who = `movement ${i + 1}`;
        const type = m && typeof m === 'object' ? m.type : undefined;
        return (
          <div key={i} className="mt-2">
            <FieldGrid>
              <RewriteControl box={box} viewKey={viewKey} path={`movements.${i}`} label={`${who}: type (stated)`} options={MOVE_TYPES}
                rewrite={(v, old) => writeStated(box, viewKey, `movements.${i}`, v === undefined ? undefined : movementFor(v, old))} />
              {type === 'production' && <StatedControl box={box} viewKey={viewKey} path={`movements.${i}.quantity`} label={`${who}: quantity (stated)`} />}
              {type && type !== 'production' && ['low', 'best', 'high'].map((k) => <StatedControl key={k} box={box} viewKey={viewKey} path={`movements.${i}.${k}`} label={`${who}: ${k} (stated)`} />)}
            </FieldGrid>
          </div>
        );
      })}
      <MissingStated box={box} viewKey={viewKey} required={[['resourceClass', 'resourceClass'], ['unit', 'unit'], ['periodYears', 'periodYears'], ['opening', 'opening'], ['closing', 'closing'], ['tolerance', 'tolerance'], ['movements', 'the movements (an empty list for none)']]} />
    </>
  );
};

/** What the engine returns for a reconciliation. */
export const ReconcileResult = ({ r }) => (
  <>
    <Tbl head={['movement', r.labels.low, r.labels.best, r.labels.high]}
      rows={r.movements.map((m, i) => [`${i + 1} ${m.type}`, six(m.low), six(m.best), six(m.high)])} />
    <Tbl head={['category', 'opening', 'computed closing', 'stated closing', 'difference']}
      rows={['low', 'best', 'high'].map((k) => [r.labels[k], six(r.opening[k]), six(r.computedClosing[k]), six(r.statedClosing[k]), six(r.difference[k])])} />
    <TileGrid>
      <Tile label="Closes" value={String(r.closes)} />
      <Tile label="Order breaks" value={String(r.orderViolation)} />
      <Tile label="Production" value={six(r.production)} />
      <Tile label="Replacement ratio" value={r.replacementRatio === null ? 'none (no production)' : six(r.replacementRatio)} />
      <Tile label="Life index, years" value={r.lifeIndexYears === null ? 'none (no production)' : six(r.lifeIndexYears)} />
    </TileGrid>
    <Reasons items={r.reasons} />
    <EngineNote text={r.basis.reconciliation} />
    <Source text={r.basis.sections} />
  </>
);

export const RECONCILE_STARTS = [
  ['recEkene', 'The Ekene field Reserves, one year'], ['recNotClosing', 'A reconciliation that does not close'], ['recExactlyTolerance', 'A difference equal to the tolerance'],
  ['recAboveTolerance', 'A difference above the tolerance'], ['recContingent', 'Contingent Resources'], ['recDivestAcquire', 'Divestments and acquisitions'],
  ['recOrderBreaks', 'A computed closing out of order'], ['recNoProduction', 'No movement at all'],
];

export const ReconcileMode = ({ initialCase = null, initialText = null, initialBlock = null, starts = RECONCILE_STARTS }) => {
  const { box, blocks, blockKey, setBlock } = useViewBox('reconcile', STARTS[starts[0][0]], { initialCase, initialText, initialBlock });
  const r = box.parsed.error ? null : viewRun('reconcile', box.parsed.value, blockKey);
  return (
    <>
      <Starts box={box} starts={starts} />
      <FieldGrid><BlockSelector blocks={blocks} value={blockKey} onChange={setBlock} /></FieldGrid>
      <ReconcileControls box={box} viewKey={blockKey} />
      <Box box={box} label="reconcile inputs (JSON: resourceClass, unit, periodYears, opening, movements, closing, tolerance), or a whole case file" rows={14} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <ReconcileResult r={r} />}
    </>
  );
};

/**
 * THE READINGS THE ENGINE STATES, read only: each reading printed in the
 * engine's own words from the golden or fixture case it acts on.
 */
export const ReadingsMode = () => {
  const tf = safe(() => classifyOf(READING_CASES.timeFrame));
  const et = safe(() => economicLimitOf(READING_CASES.economicTest));
  const el = safe(() => economicLimitOf(READING_CASES.economicLimit));
  const rc = safe(() => reconcileOf(READING_CASES.reconciliation));
  const tl = safe(() => reconcileOf(READING_CASES.tolerance));
  const mc = safe(() => aggregateOf(READING_CASES.monteCarlo));
  if (![tf, et, el, rc, tl, mc].every((r) => r && !r.error)) return <Note>A reading case was refused by the engine.</Note>;
  const rows = [
    ['the five-year benchmark (class-time-frame-5-met)', tf.reasons.find((x) => x.startsWith('time-frame'))],
    ['the economic test (econ-exactly-zero-not-economic)', `${et.basis.economicTest}; best case economic ${et.cases.best.economic}`],
    ['the economic limit (the fixture EKN-1)', el.basis.economicLimit],
    ['production and the replacement ratio (the fixture reconciliation)', rc.basis.reconciliation],
    ['the replacement ratio and the life index (the fixture reconciliation)', rc.reasons.find((x) => /replacement ratio/.test(x))],
    ['the tolerance (rec-difference-exactly-tolerance)', tl.reasons.find((x) => x.startsWith('the reconciliation closes'))],
    ['the Monte Carlo low (the fixture Reserves aggregation)', mc.basis.labels],
  ];
  return (
    <>
      <Tbl head={['reading, and the case it is read on', 'the engine\'s words, verbatim']} rows={rows} />
      <Source text={el.basis.economicTest} />
    </>
  );
};

export const MODES = [
  ['aggregate', 'Aggregation: arithmetic and probabilistic'],
  ['reconcile', 'Reconciliation'],
  ['economicLimit', 'The economic limit: the two rules'],
  ['readings', 'The readings the engine states'],
];

const LIMIT_STARTS = [
  ['econLimitsDisagree', 'The two economic-limit rules disagree'], ['econEkene', 'EKN-1: the two rules agree'],
  ['econTailZeroKept', 'A last year at exactly 0'], ['econTailOneBelow', 'A last year one barrel short'],
];

const AggregationCalculator = ({ initialMode = 'aggregate', initialCase = null, initialText = null, initialBlock = null }) => {
  const [mode, setMode] = useState(initialMode);
  return (
    <PanelShell
      title="Aggregation calculator"
      subtitle="The total of several projects by arithmetic summation and by the seeded Monte Carlo with a stated correlation, the risked mean, the reconciliation of a category set, and the two economic-limit rules."
    >
      <FieldGrid>
        <SelectField label="View" value={mode} onChange={setMode} options={MODES} />
      </FieldGrid>
      <div className="mt-3">
        {mode === 'aggregate' && <AggregateMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />}
        {mode === 'reconcile' && <ReconcileMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} />}
        {mode === 'economicLimit' && <EconomicLimitMode initialCase={initialCase} initialText={initialText} initialBlock={initialBlock} starts={LIMIT_STARTS} />}
        {mode === 'readings' && <ReadingsMode />}
      </div>
      <Note>This is the course&apos;s own calculator: every number on it is a return value of the vendored engine. The Monte Carlo figures are estimates on the stated seed and draws and are never graded. The Ekene field is synthetic; paste your own inputs, or a whole case file, to replace it.</Note>
    </PanelShell>
  );
};

export default AggregationCalculator;
