// Simulation-deck teaching lab for the RC5 course (app 'sim'). Pure functions
// plus fixture access; every exported value is pinned by simLab.test.js to the
// RC5 truth digest, which was derived by running the vendored engines over the
// committed fixture. Panels and the learning page import THIS module.
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
