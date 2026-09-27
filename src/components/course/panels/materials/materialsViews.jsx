import React from 'react';
import {
  STARTS, viewRun, roundingFor, factorRoundingFor, shapeFor, getAt, pick,
} from './materialsLab';
import {
  Tile, TileGrid, FieldGrid, Note,
} from '@/components/course/panels/petrophysics/panelKit';
import {
  six, Tbl, Refusal, EngineNote, Source, StatedControl, WordStated, WordListStated, RewriteControl, BlockSelector,
  Box, useViewBox, Starts, BLANK_START, writeStated, drawnNote,
} from './panelBits';

// The nine views of the SC3 calculator panels, one for each function of the
// vendored engine (engines/supplychain/inventory.js) through materialsLab.
// Every figure is a return value of the engine; every refusal is the engine's
// own message. Each view shows a visible control for every input its call
// reads (CONTROLS below), started from a stated case or from the blank case,
// and reads a whole pasted capstone case file at the block its selector chose.
// The same engine runs in the Suite's Materials & Spares Planner.

const ROUNDING_RULES = [['none', 'none: order the EOQ as it is'], ['up', 'up to a multiple'], ['down', 'down to a multiple'], ['nearest', 'to the nearest multiple (halves upward)']];
const BOUNDARY = [['at-or-below', 'at-or-below: the share including the item decides'], ['include-crossing', 'include-crossing: the share before the item decides']];
const DISCOUNT = [['all-units', 'all-units: the band price for the whole lot'], ['incremental', 'incremental: each unit priced by its own band']];
const MEASURES = [['cycle-service', 'cycle service level (no stockout in a cycle)'], ['fill-rate', 'fill rate (share of demand met from stock)']];
const FACTOR_RULES = [['none', 'none: the exact safety factor'], ['nearest', 'read from a table to a stated number of decimals']];
const SHAPES = [['constant', 'a constant number'], ['triangular', 'a triangle (min, mode, max)']];

const n = (path, label, extra = {}) => ({ kind: 'number', path, label, ...extra });
const choice = (path, label, options, extra = {}) => ({ kind: 'choice', path, label, options, ...extra });
const listOf = (block, key) => (Array.isArray(block && block[key]) ? block[key] : []);
const isObj = (o) => o !== null && typeof o === 'object' && !Array.isArray(o);

const roundingControls = (block, path = 'rounding') => {
  const r = block && block[path];
  const out = [{ kind: 'rewrite', path: `${path}.rule`, writes: path, label: 'Rounding rule (stated)', options: ROUNDING_RULES, rewrite: roundingFor, current: (b) => (isObj(b[path]) ? b[path].rule : undefined), refusedAs: path }];
  if (!isObj(r) || r.rule !== 'none') out.push(n(`${path}.multiple`, 'Rounding multiple (stated)'));
  return out;
};

const shapeControls = (block, key, label) => {
  const v = block && block[key];
  const out = [{ kind: 'rewrite', path: key, label: `${label}: shape (stated)`, options: SHAPES, rewrite: shapeFor, current: (b) => (b[key] === undefined ? undefined : (typeof b[key] === 'number' ? 'constant' : 'triangular')) }];
  if (typeof v === 'number') out.push(n(key, `${label} (stated)`));
  else if (isObj(v)) ['min', 'mode', 'max'].forEach((k) => out.push(n(`${key}.${k}`, `${label}: ${k} (stated)`, { refusedAs: key })));
  return out;
};

/**
 * THE CONTROLS OF EVERY VIEW, declared once: a visible control for every input
 * the call reads, list entries included. A control's path is a dotted path in
 * the block; refusedAs names the field the engine refuses when the control is
 * set to not stated, where that is not the path itself.
 */
export const CONTROLS = {
  criticality: (b) => [
    n('scoreMax', 'Score scale, the maximum score (stated)'),
    { kind: 'words', path: 'topClassOnMaxScore', label: 'Override criteria: ids, comma separated, or none (stated)' },
    ...listOf(b, 'criteria').flatMap((_, i) => [
      { kind: 'word', path: `criteria.${i}.id`, label: `criterion ${i + 1}: id (stated)` },
      n(`criteria.${i}.weight`, `criterion ${i + 1}: weight, percent (stated)`),
    ]),
    ...listOf(b, 'classes').flatMap((_, i) => [
      { kind: 'word', path: `classes.${i}.label`, label: `class ${i + 1}: label (stated)` },
      n(`classes.${i}.minScore`, `class ${i + 1}: minimum score (stated)`),
    ]),
  ],
  abcClassification: () => [
    n('cutoffs.aPct', 'A cut-off, cumulative percent (stated)'),
    n('cutoffs.bPct', 'B cut-off, cumulative percent (stated)'),
    choice('boundaryRule', 'Boundary rule (stated)', BOUNDARY),
  ],
  eoq: (b) => [
    n('annualDemand', 'Annual demand (stated)'),
    n('orderCost', 'Cost of an order (stated)'),
    n('unitCost', 'Unit cost (stated)'),
    n('holdingRate', 'Holding rate a year, on the unit cost (stated)', { refusedAs: 'holdingCostPerUnitYear' }),
    n('holdingCostPerUnitYear', 'Or: holding cost of a unit for a year (stated)'),
    ...roundingControls(b),
  ],
  slowMoving: (b) => [
    n('excessCoverMonths', 'Cover limit, months (stated)'),
    ...listOf(b, 'bands').flatMap((_, i) => [
      { kind: 'word', path: `bands.${i}.label`, label: `band ${i + 1}: label (stated)` },
      n(`bands.${i}.minMonths`, `band ${i + 1}: from months since the last issue (stated)`),
      n(`bands.${i}.writeDownPct`, `band ${i + 1}: write-down, percent (stated)`),
    ]),
  ],
  quantityDiscount: (b) => [
    n('annualDemand', 'Annual demand (stated)'),
    n('orderCost', 'Cost of an order (stated)'),
    n('holdingRate', 'Holding rate a year, on the price (stated)'),
    choice('discountType', 'Discount type (stated)', DISCOUNT),
    ...roundingControls(b),
    ...listOf(b, 'breaks').flatMap((_, i) => [
      n(`breaks.${i}.minQuantity`, `price band ${i + 1}: from quantity (stated)`),
      n(`breaks.${i}.unitPrice`, `price band ${i + 1}: unit price (stated)`),
    ]),
  ],
  safetyStock: (b) => [
    n('demandMean', 'Demand a period, mean (stated)'),
    n('demandSd', 'Demand a period, standard deviation (stated)'),
    n('leadTime', 'Lead time, periods (stated)'),
    n('leadTimeSd', 'Lead time, standard deviation (stated)'),
    n('reviewPeriod', 'Review period, periods (stated, 0 for continuous review)'),
    choice('serviceMeasure', 'Service measure (stated)', MEASURES),
    n('serviceLevel', 'Service level (stated)'),
    n('orderQuantity', 'Order quantity (stated; needed for a fill rate)'),
    { kind: 'rewrite', path: 'safetyFactorRounding.rule', writes: 'safetyFactorRounding', label: 'Safety factor reading (stated)', options: FACTOR_RULES, rewrite: factorRoundingFor, current: (x) => (isObj(x.safetyFactorRounding) ? x.safetyFactorRounding.rule : undefined), refusedAs: 'safetyFactorRounding' },
    ...(b && isObj(b.safetyFactorRounding) && b.safetyFactorRounding.rule === 'nearest' ? [n('safetyFactorRounding.decimals', 'Safety factor decimals (stated)')] : []),
    n('minimumSafetyFactor', 'Safety factor floor (stated; type null for no floor)'),
    ...roundingControls(b),
  ],
  poissonStock: () => [
    n('demandRate', 'Demand rate a period (stated)'),
    n('leadTime', 'Lead time, periods (stated)'),
    n('reviewPeriod', 'Review period, periods (stated, 0 for continuous review)'),
    choice('serviceMeasure', 'Service measure (stated)', MEASURES),
    n('serviceLevel', 'Service level (stated)'),
    n('orderQuantity', 'Order quantity (stated; needed for a fill rate)'),
  ],
  insuranceSpares: () => [
    n('failuresPerYear', 'Failures a year (stated)'),
    n('leadTimeDays', 'Lead time to replace a failed unit, days (stated)'),
    n('daysPerYear', 'Days a year (stated)'),
    n('unitCost', 'Unit cost of a spare (stated)'),
    n('holdingRate', 'Holding rate a year (stated)'),
    n('downtimeCostPerDay', 'Downtime cost a day (stated)'),
    n('maxSpares', 'Search limit, the most spares (stated)'),
  ],
  leadTimeRisk: (b) => [
    ...shapeControls(b, 'leadTimeDays', 'Lead time, days'),
    ...shapeControls(b, 'demandPerDay', 'Demand a day'),
    n('reorderPoint', 'Reorder point (stated)'),
    n('serviceLevel', 'Service level for a reorder point (optional)'),
    n('seed', 'Seed (stated)'),
    n('iterations', 'Draws (stated)'),
  ],
};


/** The controls of a view on a block, rendered. */
export const ViewControls = ({ view, box, viewKey }) => {
  const block = box.parsed.error ? {} : pick(box.parsed.value, viewKey);
  const cs = CONTROLS[view](isObj(block) ? block : {});
  return (
    <FieldGrid>
      {cs.map((c) => {
        if (c.kind === 'choice') return <StatedControl key={c.path} box={box} viewKey={viewKey} path={c.path} label={c.label} options={c.options} />;
        if (c.kind === 'word') return <WordStated key={c.path} box={box} viewKey={viewKey} path={c.path} label={c.label} />;
        if (c.kind === 'words') return <WordListStated key={c.path} box={box} viewKey={viewKey} path={c.path} label={c.label} />;
        if (c.kind === 'rewrite') {
          return (
            <RewriteControl key={`${c.path}:shape`} box={box} viewKey={viewKey} path={c.writes || c.path} label={c.label} options={c.options}
              current={(bx) => (bx.parsed.error ? undefined : c.current(pick(bx.parsed.value, viewKey) || {}))}
              rewrite={(v, old) => writeStated(box, viewKey, c.writes || c.path, c.rewrite(v, old))} />
          );
        }
        return <StatedControl key={c.path} box={box} viewKey={viewKey} path={c.path} label={c.label} />;
      })}
    </FieldGrid>
  );
};

/* ------------------------------------------------ what the engine returns, view by view */

const CriticalityResult = ({ r }) => (
  <>
    <Tbl head={['id', 'weighted score', 'class', 'forced by', 'the engine\'s reason, verbatim']}
      rows={r.items.map((x) => [x.id, six(x.weightedScore), x.class, x.forcedBy.length ? x.forcedBy.join(', ') : 'none', x.reason])} />
    <Tbl head={['class', 'items']} rows={Object.entries(r.counts).map(([c, k]) => [c, String(k)])} />
    <EngineNote text={r.basis.rule} />
    <EngineNote text={`override: ${r.basis.override}`} />
    <Source text={r.basis.source} />
  </>
);

const AbcResult = ({ r }) => (
  <>
    <Tbl head={['rank', 'id', 'annual usage value', 'share', 'cumulative share', 'class', 'the engine\'s reason, verbatim']}
      rows={r.items.map((x) => [String(x.rank), x.id, six(x.annualValue), six(x.sharePct), six(x.cumulativePct), x.class, x.reason])} />
    <Tbl head={['class', 'items', 'share of items, percent', 'annual usage value', 'share of value, percent']}
      rows={['A', 'B', 'C'].map((c) => [c, String(r.summary[c].count), six(r.summary[c].itemSharePct), six(r.summary[c].annualValue), six(r.summary[c].valueSharePct)])} />
    <TileGrid><Tile label="Total annual usage value" value={six(r.totalAnnualValue)} /></TileGrid>
    <EngineNote text={r.basis.rule} />
    <Source text={r.basis.source} />
  </>
);

const EoqResult = ({ r }) => (
  <>
    <TileGrid>
      <Tile label="EOQ" value={six(r.eoq)} />
      <Tile label="Quantity ordered" value={six(r.quantity)} />
      <Tile label="Holding cost of a unit for a year" value={six(r.holdingCostPerUnitYear)} />
      <Tile label="Orders a year" value={six(r.ordersPerYear)} />
      <Tile label="Ordering cost a year" value={six(r.orderingCost)} />
      <Tile label="Holding cost a year" value={six(r.holdingCost)} />
      <Tile label="Relevant cost a year" value={six(r.relevantCost)} />
      <Tile label="Relevant cost at the EOQ" value={six(r.relevantCostAtEoq)} />
      <Tile label="Rounding penalty, percent" value={six(r.roundingPenaltyPct)} />
      <Tile label="Purchase cost a year" value={six(r.purchaseCost)} />
    </TileGrid>
    <EngineNote text={r.reason} />
    <EngineNote text={r.basis.rule} />
    <Source text={r.basis.source} />
  </>
);

const SlowResult = ({ r }) => (
  <>
    <Tbl head={['id', 'band', 'stock value', 'write-down', 'cover, months', 'excess', 'excess quantity', 'the engine\'s reason, verbatim']}
      rows={r.items.map((x) => [x.id, x.band, six(x.stockValue), six(x.writeDown), x.coverMonths === null ? 'no usage' : six(x.coverMonths), x.excess ? 'yes' : 'no', six(x.excessQuantity), x.reason])} />
    <Tbl head={['band', 'items', 'stock value', 'write-down']} rows={Object.entries(r.byBand).map(([b, v]) => [b, String(v.count), six(v.stockValue), six(v.writeDown)])} />
    <TileGrid>
      <Tile label="Total stock value" value={six(r.totalStockValue)} />
      <Tile label="Total write-down" value={six(r.totalWriteDown)} />
      <Tile label="Items with excess stock" value={String(r.excessCount)} />
    </TileGrid>
    <EngineNote text={r.basis.rule} />
    <Source text={r.basis.source} />
  </>
);

const DiscountResult = ({ r }) => (
  <>
    <Tbl head={['band', 'price', 'fixed cost Fi', 'EOQ', 'candidate', 'total cost a year', 'the engine\'s reason, verbatim']}
      rows={r.candidates.map((c) => [String(c.band), String(c.unitPrice), six(c.fixedCost), six(c.eoq), c.feasible ? six(c.quantity) : 'none', c.feasible ? six(c.totalCost) : 'none', c.reason])} />
    <TileGrid>
      <Tile label="Quantity ordered" value={six(r.quantity)} />
      <Tile label="Band it is costed in" value={String(r.band)} />
      <Tile label="Total cost a year" value={six(r.totalCost)} />
      <Tile label="Saving against the no-discount baseline" value={six(r.savingsAgainstNoDiscount)} />
    </TileGrid>
    <EngineNote text={r.reason} />
    <EngineNote text={`${r.basis.rule}; ${r.basis.baseline}; rounding: ${r.basis.rounding}`} />
    <Source text={r.basis.source} />
  </>
);

const SafetyResult = ({ r }) => (
  <>
    <TileGrid>
      <Tile label="Policy" value={r.policy} />
      <Tile label="Protection period" value={six(r.protectionPeriod)} />
      <Tile label="Demand over the protection period" value={six(r.demandOverProtection)} />
      <Tile label="Sigma" value={six(r.sigma)} />
      <Tile label="Safety factor k, exact" value={six(r.safetyFactorExact)} />
      <Tile label="Safety factor k, as used" value={six(r.safetyFactor)} />
      <Tile label="Safety stock" value={six(r.safetyStock)} />
      <Tile label="Reorder point or order-up-to level" value={six(r.level)} />
      <Tile label="Held as" value={six(r.levelRounded)} />
      <Tile label="Achieved cycle service" value={six(r.achievedCycleService)} />
      <Tile label="Expected units short a cycle" value={six(r.expectedShortPerCycle)} />
      <Tile label="Achieved fill rate" value={six(r.achievedFillRate)} />
    </TileGrid>
    <EngineNote text={r.reason} />
    <EngineNote text={r.basis.rule} />
    <EngineNote text={r.basis.numerics} />
    <Source text={r.basis.source} />
  </>
);

const PoissonResult = ({ r }) => (
  <>
    <Tbl head={['level', 'probability', 'cumulative', 'expected units short beyond the level']}
      rows={r.rows.map((x) => [String(x.s), six(x.probability), six(x.cumulative), six(x.expectedShort)])} />
    <TileGrid>
      <Tile label="Poisson mean" value={six(r.mean)} />
      <Tile label="Level" value={String(r.level)} />
      <Tile label="Safety stock" value={six(r.safetyStock)} />
      <Tile label="Achieved cycle service" value={six(r.achievedCycleService)} />
      <Tile label="Expected units short a cycle" value={six(r.expectedShortPerCycle)} />
      <Tile label="Achieved fill rate" value={six(r.achievedFillRate)} />
    </TileGrid>
    <EngineNote text={r.reason} />
    <EngineNote text={r.basis.rule} />
    <Source text={r.basis.source} />
  </>
);

const SparesResult = ({ r }) => (
  <>
    <Tbl head={['spares', 'probability of no shortage', 'fill rate', 'expected units down', 'holding cost a year', 'downtime cost a year', 'total cost a year']}
      rows={r.options.map((o) => [String(o.spares), six(o.probabilityNoShortage), six(o.fillRate), six(o.expectedUnitsDown), six(o.holdingCost), six(o.downtimeCost), six(o.totalCost)])} />
    <TileGrid>
      <Tile label="Mean orders outstanding" value={six(r.meanOutstanding)} />
      <Tile label="Cheapest number of spares" value={String(r.spares)} />
      <Tile label="Total cost a year at the cheapest stock" value={six(r.totalCost)} />
      <Tile label="Stopped at the search limit" value={String(r.atSearchLimit)} />
    </TileGrid>
    <EngineNote text={r.reason} />
    <EngineNote text={r.basis.rule} />
    <EngineNote text={r.basis.reading} />
    <Source text={r.basis.source} />
  </>
);

const RiskResult = ({ r, seed, iterations }) => (
  <>
    <div className="mt-3 rounded-md border border-sky-800/60 bg-sky-950/20 p-3">
      <p className="text-sky-300 text-xs font-medium mb-1">SAMPLED AND UNGRADED</p>
      <p className="text-xs text-slate-300 mb-0">Every figure below is {drawnNote(seed, iterations)}. P90 is the low figure and P10 the high one.</p>
    </div>
    <Tbl head={['figure', 'lead time, days', 'lead-time demand']}
      rows={[['mean', 'mean'], ['P90 (the low figure)', 'p90'], ['P50', 'p50'], ['P10 (the high figure)', 'p10'], ['minimum', 'min'], ['maximum', 'max']]
        .map(([l, k]) => [l, six(r.leadTime[k]), six(r.leadTimeDemand[k])])} />
    <TileGrid>
      <Tile label="Stockout probability a cycle (sampled)" value={six(r.probabilityOfStockout)} />
      <Tile label="Cycle service level (sampled)" value={six(r.cycleServiceLevel)} />
      <Tile label="Expected units short a cycle (sampled)" value={six(r.expectedShortPerCycle)} />
      <Tile label="Reorder point for the service level (sampled)" value={six(r.reorderPointForService)} />
    </TileGrid>
    <EngineNote text={r.reason} />
    <EngineNote text={r.percentileDefinition} />
    <EngineNote text={r.basis.sampling} />
    <EngineNote text={r.basis.percentiles} />
    <Source text={r.basis.service} />
  </>
);

const RESULT = {
  criticality: CriticalityResult, abcClassification: AbcResult, eoq: EoqResult, slowMoving: SlowResult, quantityDiscount: DiscountResult,
  safetyStock: SafetyResult, poissonStock: PoissonResult, insuranceSpares: SparesResult, leadTimeRisk: RiskResult,
};

const BOX_LABEL = {
  criticality: 'criticality inputs (JSON: criteria, scoreMax, items with their scores, classes, topClassOnMaxScore), or a whole case file',
  abcClassification: 'abcClassification inputs (JSON: items with annualUsage and unitCost, cutoffs, boundaryRule), or a whole case file',
  eoq: 'eoq inputs (JSON: annualDemand, orderCost, unitCost with holdingRate or holdingCostPerUnitYear, rounding), or a whole case file',
  slowMoving: 'slowMoving inputs (JSON: items with onHand, unitCost, monthsSinceLastIssue and monthlyUsage, bands, excessCoverMonths), or a whole case file',
  quantityDiscount: 'quantityDiscount inputs (JSON: annualDemand, orderCost, holdingRate, breaks, discountType, rounding), or a whole case file',
  safetyStock: 'safetyStock inputs (JSON: demandMean, demandSd, leadTime, leadTimeSd, reviewPeriod, serviceMeasure, serviceLevel, orderQuantity, safetyFactorRounding, minimumSafetyFactor, rounding), or a whole case file',
  poissonStock: 'poissonStock inputs (JSON: demandRate, leadTime, reviewPeriod, serviceMeasure, serviceLevel, orderQuantity), or a whole case file',
  insuranceSpares: 'insuranceSpares inputs (JSON: failuresPerYear, leadTimeDays, daysPerYear, unitCost, holdingRate, downtimeCostPerDay, maxSpares), or a whole case file',
  leadTimeRisk: 'leadTimeRisk inputs (JSON: demandPerDay, leadTimeDays, reorderPoint, serviceLevel, iterations, seed), or a whole case file',
};

const LIST_NOTE = {
  criticality: 'Each item and its score on every criterion is stated in the box below; the criteria, the classes and the override have controls above.',
  abcClassification: 'Each item\'s annual usage and unit cost is stated in the box below.',
  slowMoving: 'Each item\'s stock on hand, unit cost, months since the last issue and monthly usage is stated in the box below; the bands have controls above.',
  quantityDiscount: 'Add or remove a price band in the box below; each band has its controls above.',
};

/** One view: a start selector, the block selector, a control for every input, the box, and what the engine returns. */
export const ViewMode = ({ view, starts, initialCase = null, initialText = null, initialBlock = null }) => {
  const { box, blocks, blockKey, setBlock } = useViewBox(view, STARTS[starts[0][0]], { initialCase, initialText, initialBlock });
  const r = box.parsed.error ? null : viewRun(view, box.parsed.value, blockKey);
  const Result = RESULT[view];
  const block = box.parsed.error ? {} : pick(box.parsed.value, blockKey);
  return (
    <>
      <Starts box={box} starts={[...starts, BLANK_START]} />
      <FieldGrid><BlockSelector blocks={blocks} value={blockKey} onChange={setBlock} /></FieldGrid>
      <ViewControls view={view} box={box} viewKey={blockKey} />
      {LIST_NOTE[view] && <Note>{LIST_NOTE[view]}</Note>}
      <Box box={box} label={BOX_LABEL[view]} rows={12} />
      {box.parsed.error && <Note>{box.parsed.error}</Note>}
      {r && r.error && <Refusal text={r.error} />}
      {r && !r.error && <Result r={r} seed={getAt(block || {}, 'seed')} iterations={getAt(block || {}, 'iterations')} />}
    </>
  );
};
