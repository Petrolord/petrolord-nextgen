// Simulation-deck teaching lab for the RC5 course (app 'sim'). Pure functions
// plus fixture access; every exported value is pinned by simLab.test.js to the
// RC5 truth digest, which was derived by running the vendored engines over the
// committed fixture. Panels and the learning page import THIS module.
//
// The committed Ekene deck (regional mean 1570.026311 m, contact 1560 m, the
// EK6-ST side-track) is the TEACHING case: the panels open on it and the
// lessons work it. Since W5b (2026-09) each tier's capstone reads a deck
// REBUILT at a setting of its own (a regional mean, a contact, a side-track,
// a booking target, a fluid), stated in the brief and typed into the panels.
// specAt() rebuilds the deck the way the fixture generator built the teaching
// one (tools/ekene-dynamic/generate.mjs, the same central engines), and
// simLab.test.js pins specAt() at the teaching setting to the committed spec
// byte for byte. Nothing here carries a capstone setting.
//
// Scope rule: this package EMITS decks and does grid/trajectory geometry. It
// has no flow solver, so nothing here returns a simulated result and nothing
// in the course grades one.

import ekeneSim from '@petrolord/engines/test-data/ekene-dynamic/sim.json';
import ekeneField from '@petrolord/engines/test-data/ekene-dynamic/field.json';
import ekeneWaterflood from '@petrolord/engines/test-data/ekene-dynamic/waterflood.json';
import {
  topsArray, columnTopDepth, columnInterfaces, gridDepthRange, gridCellCount, emitGrid,
} from '@petrolord/engines/engines/sim/emitGrid.js';
import { emitSWOF, emitSGOF } from '@petrolord/engines/engines/sim/emitSatFns.js';
import { emitPVTO, emitPVDG } from '@petrolord/engines/engines/sim/emitPvt.js';
import {
  emitWELSPECS, emitCOMPDAT, wellConnectionCount, emitWCONHIST, emitWCONINJH,
  emitDATES, historyStepCount, scheduleStepCount,
} from '@petrolord/engines/engines/sim/emitSchedule.js';
import { connectionsFromPath, cellAtPoint, cellCenterXY } from '@petrolord/engines/engines/sim/wellPath.js';
import { composeDeck, validateSpec } from '@petrolord/engines/engines/sim/composeDeck.js';
import { referenceSpec } from '@petrolord/engines/engines/sim/referenceSpec.js';
import { daysBetween } from '@petrolord/engines/engines/sim/deckFormat.js';
import { simpleKrige } from '@petrolord/engines/engines/earthmodeling/properties.js';
import { zoneVolumes } from '@petrolord/engines/engines/earthmodeling/volumes.js';
import { generatePvtTable } from '@petrolord/engines/engines/mbal/mbalEngine.ts';

export const EKENE_SIM = ekeneSim;
export const FIELD = ekeneField;
export const EKENE_FLOOD = ekeneWaterflood;
export const SPEC = ekeneSim.spec;
export const DESIGN = ekeneSim.design;
export const GOLDEN = ekeneSim.expected;

export {
  topsArray, columnTopDepth, columnInterfaces, gridDepthRange, gridCellCount,
  emitGrid, emitSWOF, emitSGOF, emitPVTO, emitPVDG, emitWELSPECS, emitCOMPDAT,
  wellConnectionCount, emitWCONHIST, emitWCONINJH, emitDATES, historyStepCount,
  scheduleStepCount, connectionsFromPath, cellAtPoint, cellCenterXY,
  composeDeck, validateSpec, referenceSpec, daysBetween,
};

export const M_TO_FT = 1 / 0.3048;
export const SECTIONS = ['RUNSPEC', 'GRID', 'PROPS', 'SOLUTION', 'SUMMARY', 'SCHEDULE'];

// ---------------------------------------------------------------- the deck
let _deck = null;
/** The composed Ekene deck. Memoised: composing is pure but not free. */
export function deckText() {
  if (_deck === null) _deck = composeDeck(SPEC);
  return _deck;
}

export function deckLines() {
  return deckText().split('\n');
}

/** Where each section starts, and the line range it owns. */
export function deckSections() {
  const lines = deckLines();
  const starts = SECTIONS.map((name) => ({ name, line: lines.indexOf(name) }));
  return starts.map((s, idx) => ({
    ...s,
    endLine: idx + 1 < starts.length ? starts[idx + 1].line - 1 : lines.length - 1,
    get lineCount() { return this.endLine - this.line + 1; },
  }));
}

/** How many times a keyword stands alone on its own line. */
export function keywordCounts(keywords = ['WCONHIST', 'WCONINJH', 'DATES', 'TSTEP', 'COMPDAT', 'WELSPECS']) {
  const lines = deckLines();
  return Object.fromEntries(keywords.map((kw) => [kw, lines.filter((l) => l.trim() === kw).length]));
}

// ---------------------------------------------------------------- the grid
export function gridSummary() {
  const g = SPEC.grid;
  const range = gridDepthRange(g);
  return {
    nx: g.nx,
    ny: g.ny,
    nz: g.nz,
    cellCount: gridCellCount(g),
    dxFt: g.dx,
    dyFt: g.dy,
    cellM: DESIGN.cellM,
    netPayFt: GOLDEN.grid.net_pay_ft,
    layerDzFt: g.layers.map((l) => l.dz),
    layerPermxMd: g.layers.map((l) => l.permx),
    ...range,
  };
}

/** Layer-1 top depth per column, in FEET, Eclipse natural order. */
export function topsFt() {
  return topsArray(SPEC.grid);
}

/** Cell (i, j) centre in FIELD coordinates (metres), the map frame. */
export function cellCentreFieldM(i, j) {
  return { x: (i - 1) * DESIGN.cellM, y: (j - 1) * DESIGN.cellM };
}

/** The cell a set of FIELD map coordinates falls in. */
export function cellOfFieldXY(x, y) {
  const toDeckFt = (v) => (v + DESIGN.originOffsetM) * M_TO_FT;
  return {
    i: Math.floor(toDeckFt(x) / SPEC.grid.dx) + 1,
    j: Math.floor(toDeckFt(y) / SPEC.grid.dy) + 1,
  };
}

/** Mapped top against the depth the deck actually gives each well. */
export function wellTops() {
  return GOLDEN.grid.well_tops.map((r) => {
    const centre = cellCentreFieldM(r.i, r.j);
    const mapped = FIELD.wells.find((w) => w.name === r.well);
    return {
      ...r,
      onLattice: Math.abs(centre.x - mapped.x) < 1e-9 && Math.abs(centre.y - mapped.y) < 1e-9,
      deck_top_ft: columnTopDepth(SPEC.grid, r.i, r.j),
    };
  });
}

// -------------------------------------------------------- volumetrics / QC
/** Oil column thickness per cell in METRES under either clipping convention. */
export function oilColumnM(convention = 'centre') {
  const tops = topsFt().map((t) => t / M_TO_FT);
  const dzM = SPEC.grid.layers.map((l) => l.dz / M_TO_FT);
  const owc = FIELD.static.owc_m_tvd;
  if (convention === 'tapered') {
    const netM = GOLDEN.grid.net_pay_ft / M_TO_FT;
    return tops.map((t) => Math.max(0, Math.min(netM, owc - t)));
  }
  // Eclipse assigns a cell to oil or water by its CENTRE depth.
  return tops.map((t) => {
    let d = t;
    let oil = 0;
    dzM.forEach((dz) => { if (d + dz / 2 < owc) oil += dz; d += dz; });
    return oil;
  });
}

/** The committed volumetrics under either convention, plus the booking gap. */
export function volumetrics(convention = 'centre') {
  const v = convention === 'tapered' ? GOLDEN.volumetrics.column_tapered : GOLDEN.volumetrics.centre_rule;
  const gapPct = convention === 'tapered'
    ? GOLDEN.volumetrics.tapered_vs_booking_pct
    : GOLDEN.volumetrics.centre_vs_booking_pct;
  return {
    convention,
    ...v,
    oilCells: oilColumnM(convention).filter((t) => t > 0).length,
    bookedStoiipStb: GOLDEN.volumetrics.booked_stoiip_stb,
    bookedOilCells: GOLDEN.volumetrics.booked_oil_cells,
    gapPct,
  };
}

/** The volume-or-area trade, side by side. */
export function reconciliation() {
  const centre = volumetrics('centre');
  const tapered = volumetrics('tapered');
  return {
    centre,
    tapered,
    bookedStoiipStb: GOLDEN.volumetrics.booked_stoiip_stb,
    bookedOilCells: GOLDEN.volumetrics.booked_oil_cells,
    regionalMeanM: DESIGN.regionalMean_m,
    extraCells: centre.oilCells - GOLDEN.volumetrics.booked_oil_cells,
  };
}

export function datumDepthFt() {
  return gridDepthRange(SPEC.grid).topMean;
}

// ---------------------------------------------------------------- the fluids
export function pvtTables() {
  return {
    pvtoRecords: SPEC.pvt.pvtoRecords,
    pvdg: SPEC.pvt.pvdg,
    density: SPEC.pvt.density,
    pvtw: SPEC.pvt.pvtw,
    rock: SPEC.pvt.rock,
    boAtPb: GOLDEN.pvt.bo_at_pb,
    boAtPi: GOLDEN.pvt.bo_at_pi,
  };
}

/** What the correlations would have said instead. Taught, never graded. */
export function pvtDivergence() {
  return GOLDEN.pvt.divergence_from_correlation;
}

export function satFnTables() {
  return {
    swof: SPEC.satfn.swof,
    sgof: SPEC.satfn.sgof,
    swofFirstSw: GOLDEN.satfn.swof_first_sw,
    swofLastSw: GOLDEN.satfn.swof_last_sw,
    sgofLastSg: GOLDEN.satfn.sgof_last_sg,
  };
}

// ---------------------------------------------------------------- the wells
export function verticalWells() {
  return SPEC.wells
    .filter((w) => !w.connections)
    .map((w) => ({ ...w, connectionCount: wellConnectionCount(w, SPEC.grid.nz) }));
}

export function deviatedWell() {
  return SPEC.wells.find((w) => w.name === DESIGN.deviated.name);
}

/**
 * Re-intersect a trajectory against the grid. With no arguments this
 * reproduces the committed EK6-ST connection list; move the endpoints and the
 * connection list moves with them, which is the point of the Expert panel.
 */
export function deviatedPath({ from = DESIGN.deviated.from, to = DESIGN.deviated.to } = {}) {
  const toDeckFt = (v) => (v + DESIGN.originOffsetM) * M_TO_FT;
  const a = cellOfFieldXY(from.x, from.y);
  const b = cellOfFieldXY(to.x, to.y);
  const inGrid = (c) => c.i >= 1 && c.i <= SPEC.grid.nx && c.j >= 1 && c.j <= SPEC.grid.ny;
  if (!inGrid(a) || !inGrid(b)) return { connections: [], distinctColumns: 0, offGrid: true };
  const path = [
    { x: toDeckFt(from.x), y: toDeckFt(from.y), depth: columnInterfaces(SPEC.grid, a.i, a.j)[0] + 0.01 },
    { x: toDeckFt(to.x), y: toDeckFt(to.y), depth: columnInterfaces(SPEC.grid, b.i, b.j)[SPEC.grid.nz] - 0.01 },
  ];
  const connections = connectionsFromPath(path, SPEC.grid);
  return {
    connections,
    distinctColumns: new Set(connections.map((c) => `${c.i},${c.j}`)).size,
    fromCell: a,
    toCell: b,
    offGrid: false,
  };
}

// ------------------------------------------------------------- the schedule
export function historyPeriods() {
  return SPEC.schedule.history.periods;
}

export function historySummary() {
  const periods = historyPeriods();
  const totalOil = periods.reduce((s, p) => {
    const next = periods[periods.indexOf(p) + 1];
    const days = daysBetween(p.date, next ? next.date : SPEC.schedule.history.endDate);
    return s + p.prod.reduce((t, r) => t + r.orat * days, 0);
  }, 0);
  return {
    periodCount: periods.length,
    firstPeriod: periods[0].date,
    endDate: SPEC.schedule.history.endDate,
    totalOilStb: totalOil,
    ledgerTotalOilStb: GOLDEN.history.ledger_total_oil_stb,
    historySteps: historyStepCount(SPEC.schedule.history),
    predictionSteps: scheduleStepCount(SPEC.schedule.steps),
  };
}

// ------------------------------------------------------------- validation
/** The seven broken specs the fixture records, each isolating ONE rule. */
export function validationCases() {
  return GOLDEN.validation.rejections;
}

/** Run the validator live on a spec built by mutating the Ekene one. */
export function validateMutated(mutate) {
  const next = mutate(JSON.parse(JSON.stringify(SPEC)));
  return validateSpec(next);
}

// ------------------------------------------------- rebuilding at a setting
// W5b: every capstone setting runs through these, and at the teaching
// setting each returns the committed fixture exactly (simLab.test.js).
export const TEACHING_MEAN_M = DESIGN.regionalMean_m;
export const TEACHING_OWC_M = FIELD.static.owc_m_tvd;
export const BOOKED_STOIIP_STB = FIELD.static.stoiip_stb;

const CONTROL = FIELD.wells.map((w) => ({ x: w.x, y: w.y, v: w.top_sand_m }));
const TARGETS = [];
for (let j = 1; j <= DESIGN.ny; j += 1) {
  for (let i = 1; i <= DESIGN.nx; i += 1) TARGETS.push([(i - 1) * DESIGN.cellM, (j - 1) * DESIGN.cellM]);
}

const _tops = new Map();
/** TOP_SAND kriged onto the cell centres at a regional mean, in METRES. */
export function krigedTopsM(mean = TEACHING_MEAN_M) {
  const key = Number(mean);
  if (!_tops.has(key)) _tops.set(key, simpleKrige(CONTROL, key, DESIGN.krig, TARGETS));
  return _tops.get(key);
}

const columnMidFt = (grid, i, j) => {
  const ifc = columnInterfaces(grid, i, j);
  return (ifc[0] + ifc[ifc.length - 1]) / 2;
};

/**
 * The Ekene spec rebuilt at a setting: the tops kriged at the regional mean,
 * the EQUIL datum and contact, the well reference depths and the side-track
 * re-intersected on the new structure. Nothing else in the deck moves.
 */
export function specAt({ regionalMean = TEACHING_MEAN_M, owcM = TEACHING_OWC_M, heel = DESIGN.deviated.from, toe = DESIGN.deviated.to } = {}) {
  const grid = { ...SPEC.grid, tops: krigedTopsM(regionalMean).map((t) => t * M_TO_FT) };
  const toDeckFt = (v) => (v + DESIGN.originOffsetM) * M_TO_FT;
  const a = cellOfFieldXY(heel.x, heel.y);
  const b = cellOfFieldXY(toe.x, toe.y);
  const devPath = [
    { x: toDeckFt(heel.x), y: toDeckFt(heel.y), depth: columnInterfaces(grid, a.i, a.j)[0] + 0.01 },
    { x: toDeckFt(toe.x), y: toDeckFt(toe.y), depth: columnInterfaces(grid, b.i, b.j)[grid.nz] - 0.01 },
  ];
  const wells = SPEC.wells.map((w) => (w.connections
    ? { ...w, connections: connectionsFromPath(devPath, grid), refDepth: columnMidFt(grid, a.i, a.j) }
    : { ...w, refDepth: columnMidFt(grid, w.i, w.j) }));
  return {
    ...SPEC,
    grid,
    equil: { ...SPEC.equil, datumDepth: gridDepthRange(grid).topMean, owc: owcM * M_TO_FT },
    wells,
  };
}

/** The deck text at a setting (the teaching deck when no setting is given). */
export function deckTextAt(setting) {
  return setting ? composeDeck(specAt(setting)) : deckText();
}

/**
 * The structure and the volumes at a setting: the column tops, the crest,
 * the deepest top and the datum, a top read at any column, and the
 * cell-centre oil volume through the same zoneVolumes the NG5 booking used.
 */
export function structureAt({ regionalMean = TEACHING_MEAN_M, owcM = TEACHING_OWC_M } = {}) {
  const topsM = krigedTopsM(regionalMean);
  const grid = { ...SPEC.grid, tops: topsM.map((t) => t * M_TO_FT) };
  const range = gridDepthRange(grid);
  const dzM = SPEC.grid.layers.map((l) => l.dz / M_TO_FT);
  const oilCol = topsM.map((t) => {
    let d = t;
    let oil = 0;
    dzM.forEach((dz) => { if (d + dz / 2 < owcM) oil += dz; d += dz; });
    return oil;
  });
  const st = FIELD.static;
  const vol = zoneVolumes({ dx: DESIGN.cellM, dy: DESIGN.cellM, nx: DESIGN.nx, ny: DESIGN.ny }, oilCol, oilCol.map(() => 'SAND'), {
    ntg: oilCol.map(() => 1),
    phi: oilCol.map(() => st.phi),
    sw: oilCol.map(() => st.swi),
  }).SAND;
  const stoiip = (vol.hcpv_m3 / st.boi_rb_stb) * st.stb_per_m3;
  // the alternative convention, the column clipped at the contact
  const netM = GOLDEN.grid.net_pay_ft / M_TO_FT;
  const taper = topsM.map((t) => Math.max(0, Math.min(netM, owcM - t)));
  const volT = zoneVolumes({ dx: DESIGN.cellM, dy: DESIGN.cellM, nx: DESIGN.nx, ny: DESIGN.ny }, taper, taper.map(() => 'SAND'), {
    ntg: taper.map(() => 1),
    phi: taper.map(() => st.phi),
    sw: taper.map(() => st.swi),
  }).SAND;
  const stoiipTapered = (volT.hcpv_m3 / st.boi_rb_stb) * st.stb_per_m3;
  const topAt = (i, j) => columnTopDepth(grid, i, j);
  return {
    regionalMean: Number(regionalMean),
    owcM: Number(owcM),
    topsFt: grid.tops,
    crestFt: range.topMin,
    deepestFt: range.topMax,
    datumFt: range.topMean,
    topAt,
    columnsAboveOwc: topsM.filter((t) => t < owcM).length,
    oilCells: oilCol.filter((t) => t > 0).length,
    stoiipStb: stoiip,
    gapPct: (stoiip / BOOKED_STOIIP_STB - 1) * 100,
    tapered: {
      oilCells: taper.filter((t) => t > 0).length,
      stoiipStb: stoiipTapered,
      gapPct: (stoiipTapered / BOOKED_STOIIP_STB - 1) * 100,
    },
    wellTops: GOLDEN.grid.well_tops.map((r) => ({ well: r.well, i: r.i, j: r.j, deck_top_m: topAt(r.i, r.j) / M_TO_FT })),
  };
}

/**
 * Bisect the regional mean until the cell-centre oil volume at a contact
 * crosses a booking target. The volume is a step function of the mean (a
 * layer is oil or water by its centre), so the answer is the mean at which
 * it crosses the target; `tolM` is how finely the crossing is located.
 */
export function calibrateRegionalMean(targetStb, { owcM = TEACHING_OWC_M, lo = 1540, hi = 1600, tolM = 1e-7 } = {}) {
  let a = lo;
  let b = hi;
  const f = (m) => structureAt({ regionalMean: m, owcM }).stoiipStb - targetStb;
  if (!(f(a) > 0 && f(b) < 0)) throw new Error('the target is not bracketed by the search interval');
  while (b - a > tolM) {
    const m = (a + b) / 2;
    if (f(m) > 0) a = m; else b = m;
  }
  return (a + b) / 2;
}

/** Oil the history carries between two period dates (inclusive), rate times days. */
export function historyOilBetween(fromIso, toIso) {
  const periods = historyPeriods();
  return periods.reduce((s, p, idx) => {
    if (p.date < fromIso || p.date > toIso) return s;
    const next = periods[idx + 1];
    const days = daysBetween(p.date, next ? next.date : SPEC.schedule.history.endDate);
    return s + p.prod.reduce((t, r) => t + r.orat * days, 0);
  }, 0);
}

/** Standing's correlation (the central PVT path) for a stated oil. */
export function correlatedOil({ api, gasSg, tempF, pbPsia, piPsia, rsiScfStb }) {
  const t = generatePvtTable({
    fluid_system: 'oil',
    oil_gravity_api: api,
    gas_specific_gravity: gasSg,
    reservoir_temperature_f: tempF,
    bubble_point_psia: pbPsia,
    initial_pressure_psia: piPsia,
    pressure_min_psia: pbPsia,
    pressure_max_psia: piPsia,
    n_steps: 2,
  });
  const atPi = t.rows[t.rows.length - 1];
  const atPb = t.rows[0];
  return { boAtPi: atPi.Bo, rsAtPb: atPb.Rs, rsGapPct: (atPb.Rs / rsiScfStb - 1) * 100 };
}

/**
 * The seven broken specifications, built from the spec at a setting the way
 * the fixture built them from the teaching spec (each isolates one rule),
 * and what the validator says of each.
 */
export function validationCasesAt(setting = {}) {
  const spec = specAt(setting);
  const withOneWellChanged = (patch) => ({ ...spec, wells: spec.wells.map((w, idx) => (idx === 0 ? { ...w, ...patch } : w)) });
  const periods = spec.schedule.history.periods;
  return [
    ['no title', { ...spec, title: '' }],
    ['no start date', { ...spec, startDate: '' }],
    ['layer count disagrees with nz', { ...spec, grid: { ...spec.grid, layers: spec.grid.layers.slice(0, spec.grid.nz - 1) } }],
    ['well outside the grid', withOneWellChanged({ i: spec.grid.nx + 1 })],
    ['completion below the deepest layer', withOneWellChanged({ k2: spec.grid.nz + 1 })],
    ['single-node PVT', { ...spec, pvt: { ...spec.pvt, pvtoRecords: [spec.pvt.pvtoRecords[0]] } }],
    ['history starting off the deck start date', {
      ...spec,
      schedule: { ...spec.schedule, history: { ...spec.schedule.history, periods: [{ ...periods[0], date: '2024-01-01' }] } },
    }],
  ].map(([label, broken]) => ({ case: label, errors: validateSpec(broken).errors }));
}
