// W6 transfer case for the sim finals: the IKPOBA deck.
//
// A small field that no sim module, lesson or capstone works. It is built the
// way the Ekene deck was built (tools/ekene-dynamic/generate.mjs), through the
// same vendored engines, so every figure a W6 item prints is an engine output:
//   structure  simpleKrige (earthmodeling/properties.js) on four mapped tops
//   volumes    zoneVolumes (earthmodeling/volumes.js), the booking engine
//   rock       coreyKr (scal/fractionalFlow.js)
//   fluids     pvtoRecordsFromTable (sim/emitPvt.js) on a designed oil;
//              generatePvtTable (mbal/mbalEngine.ts) for the gas table and
//              for the correlated (Standing) comparison
//   geometry   columnInterfaces / gridDepthRange (sim/emitGrid.js),
//              cellAtPoint / connectionsFromPath (sim/wellPath.js)
//   schedule   daysBetween (sim/deckFormat.js), historyStepCount /
//              scheduleStepCount (sim/emitSchedule.js)
//   the deck   composeDeck / validateSpec (sim/composeDeck.js)
// Wrong-method distractors are the same engine calls with the wrong input, or
// one-line derivations from engine outputs, each commented where it is made.
//
// Run: node_modules/.bin/vite-node -c vitest.config.js tools/finals-transfer/sim/case.mjs
import { simpleKrige } from '@petrolord/engines/engines/earthmodeling/properties.js';
import { zoneVolumes } from '@petrolord/engines/engines/earthmodeling/volumes.js';
import { coreyKr } from '@petrolord/engines/engines/scal/fractionalFlow.js';
import { generatePvtTable } from '@petrolord/engines/engines/mbal/mbalEngine.ts';
import { pvtoRecordsFromTable } from '@petrolord/engines/engines/sim/emitPvt.js';
import {
  columnInterfaces, gridDepthRange, gridCellCount, topsArray,
} from '@petrolord/engines/engines/sim/emitGrid.js';
import { cellAtPoint, connectionsFromPath } from '@petrolord/engines/engines/sim/wellPath.js';
import { composeDeck, validateSpec } from '@petrolord/engines/engines/sim/composeDeck.js';
import { daysBetween, fmt } from '@petrolord/engines/engines/sim/deckFormat.js';
import { historyStepCount, scheduleStepCount } from '@petrolord/engines/engines/sim/emitSchedule.js';

const FT_PER_M = 1 / 0.3048;
const STB_PER_M3 = 6.2898;
const AIR_DENSITY_LBFT3 = 0.076362;
const WATER_DENSITY_LBFT3 = 62.428;

// ------------------------------------------------------------------ the case
const CASE = {
  cellM: 75, nx: 24, ny: 20, originOffsetM: 37.5,
  krig: { model: 'spherical', range: 900, sill: 300, nugget: 0 },
  mappingMean_m: 2150,
  owc_m: 2130,
  wells: [
    { name: 'IKP-1', x: 900, y: 750, top_m: 2112, type: 'producer', k1: 1, k2: 4 },
    { name: 'IKP-2', x: 1200, y: 1050, top_m: 2104, type: 'producer', k1: 1, k2: 3 },
    { name: 'IKP-3', x: 600, y: 1200, top_m: 2121, type: 'producer', k1: 1, k2: 4 },
    { name: 'IKP-4', x: 1500, y: 660, top_m: 2135, type: 'water_injector', k1: 1, k2: 4 },
  ],
  sidetrack: { name: 'IKP2-ST', from: { x: 1200, y: 1050 }, to: { x: 1050, y: 1290 } },
  layers: [
    { dz: 9, poro: 0.23, permx: 420 },
    { dz: 14, poro: 0.19, permx: 95 },
    { dz: 6, poro: 0.25, permx: 760 },
    { dz: 11, poro: 0.21, permx: 210 },
  ],
  kvkh: 0.2,
  corey: { Swc: 0.22, Sor: 0.28, krwMax: 0.32, kroMax: 0.85, nw: 3, no: 2.2 },
  gasOil: { Sgc: 0.04, krgMax: 0.7, ng: 1.8 },
  satRows: 21,
  oil: { api: 36, gasSg: 0.8, tempF: 200, pb: 2600, pi: 3900, rsi: 450, boi: 1.28, co: 1.1e-5, muoPb: 1.35, muSlope: 2e-5 },
  pSat: [1300, 1950, 2600], pUndersat: [3250, 3900, 4550],
  gasTable: { pMin: 450, pMax: 4550, nSteps: 10 },
  water: { pref: 3900, bw: 1.03, cw: 3.2e-6, muw: 0.42, sg: 1.05 },
  rock: { pref: 3900, cr: 5e-6 },
  startDate: '2024-01-01', endDate: '2025-01-01',
  prediction: [{ count: 36, dtDays: 30.4375 }],
};
const months = Array.from({ length: 12 }, (_, m) => `2024-${String(m + 1).padStart(2, '0')}-01`);
// Monthly ledger volumes (stb oil, stb water, bbl injected): the case's data.
const ledger = months.map((date, m) => ({
  date,
  oil: { 'IKP-1': 27900 - 610 * m, 'IKP-2': 21450 - 380 * m, 'IKP-3': 18300 - 450 * m },
  water: { 'IKP-1': 120 * m, 'IKP-2': 60 * m, 'IKP-3': 210 * m },
  inj: { 'IKP-4': 58500 + 900 * m },
}));

// ------------------------------------------------------------------ helpers
const out = { inputs: {}, values: {}, print: {} };
const put = (k, v, s) => { out.values[k] = v; out.print[k] = s; };
const dp = (v, n) => v.toFixed(n);
const cellFt = CASE.cellM * FT_PER_M;
const centreXY = (i, j) => [(i - 1) * CASE.cellM, (j - 1) * CASE.cellM];
const toDeckFt = (v) => (v + CASE.originOffsetM) * FT_PER_M;

// ------------------------------------------------------------------ structure
const ctl = CASE.wells.map((w) => ({ x: w.x, y: w.y, v: w.top_m }));
const targets = [];
for (let j = 1; j <= CASE.ny; j += 1) for (let i = 1; i <= CASE.nx; i += 1) targets.push(centreXY(i, j));
const krige = (mean, params = CASE.krig) => simpleKrige(ctl, mean, params, targets);
const layers = CASE.layers.map((l) => ({ ...l, permz: l.permx * CASE.kvkh }));
const gridFor = (topsM) => ({
  nx: CASE.nx, ny: CASE.ny, nz: layers.length, dx: cellFt, dy: cellFt, layers, tops: topsM.map((t) => t * FT_PER_M),
});
const netFt = layers.reduce((s, l) => s + l.dz, 0);

// Eclipse assigns a cell to oil by its CENTRE depth (the Ekene generator's rule);
// per layer, so porosity can differ between layers.
const oilByLayerCentre = (grid) => layers.map((l, k) => topsArray(grid).map((_, idx) => {
  const i = (idx % CASE.nx) + 1; const j = Math.floor(idx / CASE.nx) + 1;
  const ifc = columnInterfaces(grid, i, j);
  return (ifc[k] + ifc[k + 1]) / 2 < CASE.owc_m * FT_PER_M ? l.dz / FT_PER_M : 0;
}));
// The column-clipped rule: clip each layer at the contact.
const oilByLayerColumn = (grid) => layers.map((l, k) => topsArray(grid).map((_, idx) => {
  const i = (idx % CASE.nx) + 1; const j = Math.floor(idx / CASE.nx) + 1;
  const ifc = columnInterfaces(grid, i, j).map((d) => d / FT_PER_M);
  return Math.max(0, Math.min(ifc[k + 1], CASE.owc_m) - ifc[k]);
}));
// The mapping booking's rule: clip the AREA (column top above the contact) and
// give every such column the full net column.
const oilByLayerArea = (grid) => layers.map((l) => topsArray(grid).map((t) => (t / FT_PER_M < CASE.owc_m ? l.dz / FT_PER_M : 0)));
const volSpec = { dx: CASE.cellM, dy: CASE.cellM, nx: CASE.nx, ny: CASE.ny };
const volumes = (byLayer, sw = CASE.corey.Swc, bo = CASE.oil.boi) => {
  let pore = 0; let hcpv = 0;
  byLayer.forEach((th, k) => {
    const b = zoneVolumes(volSpec, th, th.map(() => 'S'), {
      ntg: th.map(() => 1), phi: th.map(() => layers[k].poro), sw: th.map(() => sw),
    }).S;
    pore += b.pore_m3; hcpv += b.hcpv_m3;
  });
  const cols = byLayer[0].map((_, idx) => byLayer.some((th) => th[idx] > 0)).filter(Boolean).length;
  return { pore_m3: pore, hcpv_m3: hcpv, stoiip_stb: (hcpv / bo) * STB_PER_M3, oil_columns: cols };
};

// the booking: the mapping surface at its own regional mean, area-clipped
const gridMap = gridFor(krige(CASE.mappingMean_m));
const booking = volumes(oilByLayerArea(gridMap));
const centreAtMap = volumes(oilByLayerCentre(gridMap));
// calibration: bisect the regional mean so the deck's cell-centre volume lands on the booking
const stoiipAt = (mean) => volumes(oilByLayerCentre(gridFor(krige(mean)))).stoiip_stb;
let lo = 2100; let hi = 2200; // shallow gives more oil
if (!(stoiipAt(lo) > booking.stoiip_stb && stoiipAt(hi) < booking.stoiip_stb)) throw new Error('bracket');
for (let it = 0; it < 60; it += 1) {
  const mid = (lo + hi) / 2;
  if (stoiipAt(mid) > booking.stoiip_stb) lo = mid; else hi = mid;
}
const calibMean = Number(((lo + hi) / 2).toFixed(4));
const topsM = krige(calibMean);
const grid = gridFor(topsM);
const centre = volumes(oilByLayerCentre(grid));
const column = volumes(oilByLayerColumn(grid));
const range = gridDepthRange(grid);
const owcFt = CASE.owc_m * FT_PER_M;

// ------------------------------------------------------------------ fluids
const oilSg = 141.5 / (131.5 + CASE.oil.api);
const o = CASE.oil;
const boU = (p) => o.boi * (1 + o.co * (o.pi - p));
const boPb = boU(o.pb);
const satRows = CASE.pSat.map((p) => ({
  p, rs: (o.rsi * p) / o.pb / 1000, bo: p === o.pb ? boPb : 1 + (boPb - 1) * (p / o.pb), muo: o.muoPb * (2 - p / o.pb),
}));
const pvtoRecords = pvtoRecordsFromTable(satRows, CASE.pUndersat.map((p) => ({ p, bo: boU(p), muo: o.muoPb * (1 + o.muSlope * (p - o.pb)) })));
const gasTab = generatePvtTable({
  fluid_system: 'gas', gas_specific_gravity: o.gasSg, reservoir_temperature_f: o.tempF, initial_pressure_psia: o.pi,
  pressure_min_psia: CASE.gasTable.pMin, pressure_max_psia: CASE.gasTable.pMax, n_steps: CASE.gasTable.nSteps,
});
const pvdg = gasTab.rows.map((r) => ({ p: r.pressure_psia, bg: r.Bg, mug: r.gas_viscosity_cp }));
const corr = generatePvtTable({
  fluid_system: 'oil', oil_gravity_api: o.api, gas_specific_gravity: o.gasSg, reservoir_temperature_f: o.tempF,
  bubble_point_psia: o.pb, initial_pressure_psia: o.pi, pressure_min_psia: o.pb, pressure_max_psia: o.pi, n_steps: 2,
});
const corrPi = corr.rows[corr.rows.length - 1];
const corrPb = corr.rows[0];
const density = { oil: oilSg * WATER_DENSITY_LBFT3, water: CASE.water.sg * WATER_DENSITY_LBFT3, gas: o.gasSg * AIR_DENSITY_LBFT3 };

// ------------------------------------------------------------------ rock curves
const swof = [];
for (let i = 0; i <= CASE.satRows - 1; i += 1) {
  const Sw = CASE.corey.Swc + ((1 - CASE.corey.Sor - CASE.corey.Swc) * i) / (CASE.satRows - 1);
  const kr = coreyKr(Sw, CASE.corey);
  swof.push({ Sw, krw: kr.krw, krow: kr.kro, pcow: 0 });
}
swof.push({ Sw: 1, krw: CASE.corey.krwMax, krow: 0, pcow: 0 });
const sgMax = 1 - CASE.corey.Swc;
const sgof = [];
for (let i = 0; i <= CASE.satRows - 1; i += 1) {
  const Sg = (sgMax * i) / (CASE.satRows - 1);
  const { Swc, Sor, kroMax, no } = CASE.corey;
  const sgStar = Math.min(1, Math.max(0, (Sg - CASE.gasOil.Sgc) / (1 - Swc - CASE.gasOil.Sgc - Sor)));
  const soStar = Math.min(1, Math.max(0, (1 - Swc - Sg - Sor) / (1 - Swc - Sor)));
  sgof.push({ Sg, krg: CASE.gasOil.krgMax * sgStar ** CASE.gasOil.ng, krog: kroMax * soStar ** no, pcog: 0 });
}

// ------------------------------------------------------------------ wells
const cellOf = (x, y) => cellAtPoint(grid, { x: toDeckFt(x), y: toDeckFt(y), depth: range.topMin + 0.01 })
  || { i: Math.floor(toDeckFt(x) / cellFt) + 1, j: Math.floor(toDeckFt(y) / cellFt) + 1 };
const colMid = (i, j) => { const f = columnInterfaces(grid, i, j); return (f[0] + f[f.length - 1]) / 2; };
const wellTop = (w) => {
  const i = Math.floor(toDeckFt(w.x) / cellFt) + 1; const j = Math.floor(toDeckFt(w.y) / cellFt) + 1;
  return { i, j, deck_m: columnInterfaces(grid, i, j)[0] / FT_PER_M };
};
const vertical = CASE.wells.map((w) => {
  const c = wellTop(w);
  return {
    name: w.name, type: w.type, i: c.i, j: c.j, k1: w.k1, k2: w.k2, refDepth: colMid(c.i, c.j), wellboreRadiusFt: 0.3,
    control: w.type === 'producer' ? { mode: 'ORAT', rate: 900, bhpMin: 1500 } : { rate: 2500, bhpMax: 5200 },
  };
});
const st = CASE.sidetrack;
const stPath = (unit = 1) => {
  const a = wellTop(st.from); const b = wellTop(st.to);
  return [
    { x: toDeckFt(st.from.x), y: toDeckFt(st.from.y), depth: (columnInterfaces(grid, a.i, a.j)[0] + 0.01) * unit },
    { x: toDeckFt(st.to.x), y: toDeckFt(st.to.y), depth: (columnInterfaces(grid, b.i, b.j)[layers.length] - 0.01) * unit },
  ];
};
const stConn = connectionsFromPath(stPath(), grid);
const stConnMetres = connectionsFromPath(stPath(0.3048), grid); // the survey-in-metres trap
const stWell = { name: st.name, type: 'producer', connections: stConn, refDepth: colMid(stConn[0].i, stConn[0].j), wellboreRadiusFt: 0.3, control: { mode: 'ORAT', rate: 900, bhpMin: 1500 } };

// ------------------------------------------------------------------ history
const periods = ledger.map((mo, idx) => {
  const next = idx + 1 < ledger.length ? ledger[idx + 1].date : CASE.endDate;
  const days = daysBetween(mo.date, next);
  return {
    date: mo.date,
    days,
    prod: Object.keys(mo.oil).map((n) => ({ name: n, orat: mo.oil[n] / days, wrat: mo.water[n] / days, grat: (mo.oil[n] * o.rsi) / 1000 / days })),
    inj: Object.keys(mo.inj).map((n) => ({ name: n, phase: 'WATER', rate: mo.inj[n] / days })),
  };
});
const history = { periods: periods.map(({ days, ...p }) => p), endDate: CASE.endDate };
const ledgerOil = ledger.reduce((s, m) => s + Object.values(m.oil).reduce((a, b) => a + b, 0), 0);
const roundTrip = periods.reduce((s, p) => s + p.prod.reduce((a, r) => a + r.orat * p.days, 0), 0);

// ------------------------------------------------------------------ the spec and the deck
const spec = {
  title: 'IKPOBA W6 transfer deck',
  startDate: CASE.startDate,
  grid,
  pvt: { pvtoRecords, pvdg, density, pvtw: { pref: CASE.water.pref, bw: CASE.water.bw, cw: CASE.water.cw, muw: CASE.water.muw }, rock: CASE.rock },
  satfn: { swof, sgof },
  equil: { datumDepth: range.topMean, datumPressure: o.pi, owc: owcFt },
  wells: [...vertical, stWell],
  schedule: { history, steps: CASE.prediction },
};
const deck = composeDeck(spec);
const lines = deck.split('\n');
const SECTIONS = ['RUNSPEC', 'GRID', 'PROPS', 'SOLUTION', 'SUMMARY', 'SCHEDULE'];
const starts = SECTIONS.map((s) => lines.indexOf(s));
const sectionLines = SECTIONS.map((s, k) => (k + 1 < SECTIONS.length ? starts[k + 1] : lines.length) - starts[k]);
const equilLine = lines[lines.indexOf('EQUIL') + 1].trim();
const gocFt = Number(equilLine.split(/\s+/)[4]);
const dxLine = lines[lines.indexOf('DX') + 1].trim();
const welldims = lines[lines.indexOf('WELLDIMS') + 1].trim();

// validator experiments (each on a deep copy of the spec)
const clone = () => JSON.parse(JSON.stringify(spec));
const vCount = (mut) => { const s = clone(); mut(s); return validateSpec(s).errors; };
const cascade = vCount((s) => { s.wells = [{ ...s.wells[0], i: 30 }]; });
const inPlace = vCount((s) => { s.wells[0].i = 30; });
const nzCut = vCount((s) => { s.grid.nz = 3; });
const layerDrop = vCount((s) => { s.grid.layers = s.grid.layers.slice(0, 3); });
const startOff = vCount((s) => { s.startDate = '2023-12-01'; });
const k2Five = vCount((s) => { s.wells[0].k2 = 5; });
const dropWell = vCount((s) => { s.wells = s.wells.filter((w) => w.name !== 'IKP-3'); });

// ------------------------------------------------------------------ inputs
out.inputs = {
  nx: CASE.nx, ny: CASE.ny, nz: layers.length, cell_m: CASE.cellM, origin_offset_m: CASE.originOffsetM,
  owc_m: CASE.owc_m, krig: CASE.krig, mapping_mean_m: CASE.mappingMean_m,
  wells: CASE.wells.map(({ name, x, y, top_m }) => ({ name, x, y, top_m })),
  sidetrack: st, layers: CASE.layers, kvkh: CASE.kvkh, corey: CASE.corey, gas_oil: CASE.gasOil,
  oil: o, p_sat: CASE.pSat, p_undersat: CASE.pUndersat, water: CASE.water, rock: CASE.rock,
  start: CASE.startDate, end: CASE.endDate, prediction: CASE.prediction,
  ledger_feb_ikp1_oil: ledger[1].oil['IKP-1'],
  controls: { orat: 900, bhp_min: 1500, inj_rate: 2500, bhp_max: 5200 },
  stb_per_m3: STB_PER_M3, air_density_lbft3: AIR_DENSITY_LBFT3, nugget_test: 60, mean_step_m: 10,
  planned_well: { x: 1110, y: 870 },
};

// ------------------------------------------------------------------ BEGINNER figures
const cells = gridCellCount(grid);
put('cells', cells, String(cells));
put('columns', CASE.nx * CASE.ny, String(CASE.nx * CASE.ny));
put('cells_x_layers', cells * layers.length, String(cells * layers.length)); // TOPS read as one per cell per layer
put('fine_cells', cells * 8, String(cells * 8)); // halving in three directions
put('fine_cells_areal', cells * 4, String(cells * 4)); // halving only areally
put('fine_cells_one', cells * 2, String(cells * 2)); // halving one direction
put('dx_token', dxLine, dxLine.replace(/\s*\/$/, ''));
put('dx_ft', cellFt, fmt(cellFt, 4));
put('dx_product', cells * Number(fmt(cellFt, 4)), dp(cells * Number(fmt(cellFt, 4)), 2)); // star read as multiply
put('crest_ft', range.topMin, dp(range.topMin, 2));
put('crest_m', range.topMin / FT_PER_M, dp(range.topMin / FT_PER_M, 2));
put('deep_top_ft', range.topMax, dp(range.topMax, 2));
put('base_ft', range.bottomMax, dp(range.bottomMax, 2));
put('owc_ft', owcFt, dp(owcFt, 2));
put('maxcol_ft', owcFt - range.topMin, dp(owcFt - range.topMin, 2));
put('maxcol_m', (owcFt - range.topMin) / FT_PER_M, dp((owcFt - range.topMin) / FT_PER_M, 2));
put('maxcol_minus_net', owcFt - range.topMin - netFt, dp(owcFt - range.topMin - netFt, 2)); // contact less the net column
put('maxcol_mixed', owcFt - range.topMin / FT_PER_M, dp(owcFt - range.topMin / FT_PER_M, 2)); // crest in metres against a contact in feet
put('datum_ft', range.topMean, dp(range.topMean, 2));
put('datum_vs_owc_ft', range.topMean - owcFt, dp(range.topMean - owcFt, 2));
put('datum_above_owc_ft', owcFt - range.topMean, dp(owcFt - range.topMean, 2));
put('goc_ft', gocFt, dp(gocFt, 2));
put('net_ft', netFt, String(netFt));
put('pi', o.pi, String(o.pi)); put('pb', o.pb, String(o.pb));
put('margin_psi', o.pi - o.pb, String(o.pi - o.pb));
put('rs_top_deck', pvtoRecords[pvtoRecords.length - 1].rs, fmt(pvtoRecords[pvtoRecords.length - 1].rs, 4));
put('rs_top_scf', o.rsi, String(o.rsi));
put('bo_pb', boPb, dp(boPb, 5));
put('bo_3250', boU(3250), dp(boU(3250), 5));
put('bo_pi', boU(o.pi), dp(boU(o.pi), 5));
put('bo_4550', boU(4550), dp(boU(4550), 5));
put('bo_1950', satRows[1].bo, dp(satRows[1].bo, 5));
put('swc', CASE.corey.Swc, String(CASE.corey.Swc));
put('sor', CASE.corey.Sor, String(CASE.corey.Sor));
put('sg_max', sgof[sgof.length - 1].Sg, fmt(sgof[sgof.length - 1].Sg, 5));
put('sg_one_minus_sor', 1 - CASE.corey.Sor, fmt(1 - CASE.corey.Sor, 5));
put('sg_mobile', 1 - CASE.corey.Swc - CASE.corey.Sor, fmt(1 - CASE.corey.Swc - CASE.corey.Sor, 5));
put('pvdg_pmin', pvdg[0].p, fmt(pvdg[0].p, 2));
put('pvdg_pmax', pvdg[pvdg.length - 1].p, fmt(pvdg[pvdg.length - 1].p, 2));
put('bg_pmin', pvdg[0].bg, fmt(pvdg[0].bg, 4));
// a straight-line extrapolation of the first two rows down to 300 psia (what the simulator does NOT do)
const bgExtrap = pvdg[0].bg + ((pvdg[0].bg - pvdg[1].bg) / (pvdg[1].p - pvdg[0].p)) * (pvdg[0].p - 300);
put('bg_extrap_300', bgExtrap, fmt(bgExtrap, 4));
put('p_low', 300, '300');
put('dz', layers.map((l) => l.dz), layers.map((l) => l.dz).join(', '));
put('permx', layers.map((l) => l.permx), layers.map((l) => l.permx).join(', '));
put('conn_ikp1_ikp2', (vertical[0].k2 - vertical[0].k1 + 1) + (vertical[1].k2 - vertical[1].k1 + 1), String((vertical[0].k2 - vertical[0].k1 + 1) + (vertical[1].k2 - vertical[1].k1 + 1)));
put('conn_offbyone', (vertical[0].k2 - vertical[0].k1) + (vertical[1].k2 - vertical[1].k1), String((vertical[0].k2 - vertical[0].k1) + (vertical[1].k2 - vertical[1].k1)));
put('conn_full', 2 * layers.length, String(2 * layers.length));
put('welldims', welldims, welldims.replace(/\s*\/$/, ''));
put('st_conn', stConn.length, String(stConn.length));
put('hist_steps', historyStepCount(history), String(historyStepCount(history)));
put('pred_steps', scheduleStepCount(CASE.prediction), String(scheduleStepCount(CASE.prediction)));
put('report_steps', historyStepCount(history) + scheduleStepCount(CASE.prediction), String(historyStepCount(history) + scheduleStepCount(CASE.prediction)));
put('pred_years', (scheduleStepCount(CASE.prediction) * 30.4375) / 365.25, String((scheduleStepCount(CASE.prediction) * 30.4375) / 365.25));
put('feb_days', daysBetween('2024-02-01', '2024-03-01'), String(daysBetween('2024-02-01', '2024-03-01')));
put('mean_month', 30.4375, '30.4375');
put('deck_lines', lines.length, String(lines.length));
SECTIONS.forEach((s, k) => put(`sec_${s}`, sectionLines[k], String(sectionLines[k])));
put('sched_share_pct', (100 * sectionLines[5]) / lines.length, dp((100 * sectionLines[5]) / lines.length, 1));
put('grid_share_pct', (100 * sectionLines[1]) / lines.length, dp((100 * sectionLines[1]) / lines.length, 1));
put('gas_rho', density.gas, fmt(density.gas, 5));

// ------------------------------------------------------------------ INTERMEDIATE figures
const wt = Object.fromEntries(CASE.wells.map((w) => [w.name, wellTop(w)]));
put('ikp1_cell', wt['IKP-1'], `(${wt['IKP-1'].i}, ${wt['IKP-1'].j})`);
put('ikp4_cell', wt['IKP-4'], `(${wt['IKP-4'].i}, ${wt['IKP-4'].j})`);
put('ikp1_deck_m', wt['IKP-1'].deck_m, dp(wt['IKP-1'].deck_m, 4));
put('ikp4_deck_m', wt['IKP-4'].deck_m, dp(wt['IKP-4'].deck_m, 4));
const ikp4Centre = centreXY(wt['IKP-4'].i, wt['IKP-4'].j);
put('ikp4_centre_y', ikp4Centre[1], String(ikp4Centre[1]));
put('ikp4_offset_m', ikp4Centre[1] - 660, String(ikp4Centre[1] - 660));
put('ikp4_gap_m', 2135 - wt['IKP-4'].deck_m, dp(2135 - wt['IKP-4'].deck_m, 4));
put('ikp4_dip_m_per_km', ((2135 - wt['IKP-4'].deck_m) / (ikp4Centre[1] - 660)) * 1000, dp(((2135 - wt['IKP-4'].deck_m) / (ikp4Centre[1] - 660)) * 1000, 1));
put('half_cell_m', CASE.cellM / 2, String(CASE.cellM / 2));
// a nugget of 60 on the same sill: no longer exact at IKP-1
const nug = simpleKrige(ctl, calibMean, { ...CASE.krig, nugget: 60 }, [[900, 750]])[0];
put('ikp1_nugget_m', nug, dp(nug, 4));
put('calib_mean_m', calibMean, dp(calibMean, 4));
put('calib_mean_less', calibMean - 10, dp(calibMean - 10, 4));
const shallower = volumes(oilByLayerCentre(gridFor(krige(calibMean - 10))));
const deeper = volumes(oilByLayerCentre(gridFor(krige(calibMean + 10))));
put('stoiip_shallower', shallower.stoiip_stb, dp(shallower.stoiip_stb, 0));
put('stoiip_deeper', deeper.stoiip_stb, dp(deeper.stoiip_stb, 0));
put('stoiip_centre', centre.stoiip_stb, dp(centre.stoiip_stb, 0));
put('stoiip_column', column.stoiip_stb, dp(column.stoiip_stb, 0));
put('conv_gap_stb', column.stoiip_stb - centre.stoiip_stb, dp(column.stoiip_stb - centre.stoiip_stb, 0));
put('conv_gap_pct', (column.stoiip_stb / centre.stoiip_stb - 1) * 100, dp((column.stoiip_stb / centre.stoiip_stb - 1) * 100, 2));
put('pv_m3', centre.pore_m3, dp(centre.pore_m3, 1));
put('hcpv_m3', centre.hcpv_m3, dp(centre.hcpv_m3, 1));
put('implied_sw', 1 - centre.hcpv_m3 / centre.pore_m3, dp(1 - centre.hcpv_m3 / centre.pore_m3, 4));
put('implied_so', centre.hcpv_m3 / centre.pore_m3, dp(centre.hcpv_m3 / centre.pore_m3, 4));
put('rs_corr_pb', corrPb.Rs, dp(corrPb.Rs, 2));
put('rs_gap_pct', (corrPb.Rs / o.rsi - 1) * 100, dp((corrPb.Rs / o.rsi - 1) * 100, 2));
put('bo_corr_pi', corrPi.Bo, dp(corrPi.Bo, 5));
put('muo_corr_pb', corrPb.oil_viscosity_cp, dp(corrPb.oil_viscosity_cp, 4));
put('bo_swap_pct', (o.boi / corrPi.Bo - 1) * 100, dp((o.boi / corrPi.Bo - 1) * 100, 2));
put('bo_swap_abs_pct', Math.abs((o.boi / corrPi.Bo - 1) * 100), dp(Math.abs((o.boi / corrPi.Bo - 1) * 100), 2));
put('bo_swap_inverse_pct', (corrPi.Bo / o.boi - 1) * 100, dp((corrPi.Bo / o.boi - 1) * 100, 2)); // sign and base flipped
put('stoiip_corr_bo', centre.stoiip_stb * (o.boi / corrPi.Bo), dp(centre.stoiip_stb * (o.boi / corrPi.Bo), 0));
put('stoiip_corr_bo_wrong', centre.stoiip_stb * (corrPi.Bo / o.boi), dp(centre.stoiip_stb * (corrPi.Bo / o.boi), 0)); // multiplied instead of divided
// Corey rows
const kr026 = coreyKr(0.29, CASE.corey);
put('sw_row', 0.29, '0.29');
put('sw_above_swc', 0.29 - 0.22, dp(0.29 - 0.22, 2));
put('swn_026', kr026.Swn, dp(kr026.Swn, 2));
put('krw_026', kr026.krw, dp(kr026.krw, 6));
put('krw_026_raw', CASE.corey.krwMax * (0.29 - 0.22) ** CASE.corey.nw, dp(CASE.corey.krwMax * (0.29 - 0.22) ** CASE.corey.nw, 6)); // no normalisation
put('krw_026_n2', coreyKr(0.29, { ...CASE.corey, nw: 2 }).krw, dp(coreyKr(0.29, { ...CASE.corey, nw: 2 }).krw, 6)); // oil exponent-like guess
const swnWrong = (0.29 - 0.22) / (1 - 0.22); // normalised by 1 - Swc only
put('krw_026_1mswc', CASE.corey.krwMax * swnWrong ** 3, dp(CASE.corey.krwMax * swnWrong ** 3, 6));
put('swof_row2_sw', swof[1].Sw, fmt(swof[1].Sw, 5));
// the column the two clipping rules treat most differently
let best = null;
const cc = oilByLayerCentre(grid); const cl = oilByLayerColumn(grid);
topsArray(grid).forEach((t, idx) => {
  const c = cc.reduce((s, th) => s + th[idx], 0) * FT_PER_M; const k = cl.reduce((s, th) => s + th[idx], 0) * FT_PER_M;
  // the column where the cell-centre rule OVERSTATES the clipped column most
  if (c > k && (!best || c - k > best.diff)) best = { idx, top: t, centre: c, column: k, diff: c - k };
});
const bi = (best.idx % CASE.nx) + 1; const bj = Math.floor(best.idx / CASE.nx) + 1;
put('colA_ij', [bi, bj], `(${bi}, ${bj})`);
put('colA_top', best.top, dp(best.top, 2));
put('colA_above_owc', owcFt - best.top, dp(owcFt - best.top, 2));
put('colA_centre', best.centre, dp(best.centre, 2));
put('colA_column', best.column, dp(best.column, 2));
put('colA_full', netFt, String(netFt));
// map coordinates to a cell
const pw = cellOf(1110, 870);
const pwCentre = centreXY(pw.i, pw.j);
put('pw_cell', [pw.i, pw.j], `(${pw.i}, ${pw.j})`);
put('pw_centre', pwCentre, `(${pwCentre[0]}, ${pwCentre[1]})`);
put('pw_dist_m', Math.hypot(1110 - pwCentre[0], 870 - pwCentre[1]), dp(Math.hypot(1110 - pwCentre[0], 870 - pwCentre[1]), 2));
const pwNoOff = { i: Math.floor(1110 / CASE.cellM) + 1, j: Math.floor(870 / CASE.cellM) + 1 }; // forgot the half-cell offset
put('pw_cell_nooffset', [pwNoOff.i, pwNoOff.j], `(${pwNoOff.i}, ${pwNoOff.j})`);
put('pw_cell_zerobased', [pw.i - 1, pw.j - 1], `(${pw.i - 1}, ${pw.j - 1})`); // zero-based indexing
put('pw_cell_swapped', [pw.j, pw.i], `(${pw.j}, ${pw.i})`); // I and J swapped
// gas density against the gas table's gravity
put('air_rho', AIR_DENSITY_LBFT3, String(AIR_DENSITY_LBFT3));
put('gas_sg', o.gasSg, String(o.gasSg));
const badRho = 0.68 * AIR_DENSITY_LBFT3; // a colleague's DENSITY built on 0.68
put('bad_gas_rho', badRho, fmt(badRho, 5));
put('bad_gas_sg', badRho / AIR_DENSITY_LBFT3, dp(badRho / AIR_DENSITY_LBFT3, 2));
put('bad_gas_ratio', AIR_DENSITY_LBFT3 / badRho, dp(AIR_DENSITY_LBFT3 / badRho, 2)); // inverted division
// history
const feb = periods[1];
const febOil = ledger[1].oil['IKP-1'];
put('feb_oil', febOil, String(febOil));
put('feb_rate', febOil / feb.days, dp(febOil / feb.days, 4));
put('feb_rate_28', febOil / 28, dp(febOil / 28, 4));
put('feb_rate_mean', febOil / 30.4375, dp(febOil / 30.4375, 4));
put('feb_rate_31', febOil / 31, dp(febOil / 31, 4));
put('feb_mean_error_pct', ((febOil / 30.4375) * feb.days / febOil - 1) * 100, dp(((febOil / 30.4375) * feb.days / febOil - 1) * 100, 2));
put('feb_mean_error_abs_pct', Math.abs(((febOil / 30.4375) * feb.days / febOil - 1) * 100), dp(Math.abs(((febOil / 30.4375) * feb.days / febOil - 1) * 100), 2));
put('feb_mean_error_inv_pct', (30.4375 / feb.days - 1) * 100, dp((30.4375 / feb.days - 1) * 100, 2)); // ratio inverted
put('feb28_error_pct', (28 / 30.4375 - 1) * 100, dp((28 / 30.4375 - 1) * 100, 2));
put('feb28_error_abs_pct', Math.abs((28 / 30.4375 - 1) * 100), dp(Math.abs((28 / 30.4375 - 1) * 100), 2)); // a non-leap February
put('m31_error_pct', (31 / 30.4375 - 1) * 100, dp((31 / 30.4375 - 1) * 100, 2)); // a 31-day month
put('feb_volume_mean', (febOil / 30.4375) * feb.days, dp((febOil / 30.4375) * feb.days, 1));
put('ledger_oil', ledgerOil, dp(ledgerOil, 1));
put('round_trip_oil', roundTrip, dp(roundTrip, 1));

// ------------------------------------------------------------------ ADVANCED figures
put('booking_stb', booking.stoiip_stb, dp(booking.stoiip_stb, 0));
put('booked_columns', booking.oil_columns, String(booking.oil_columns));
put('deck_columns', centre.oil_columns, String(centre.oil_columns));
put('centre_at_mapping_mean', centreAtMap.stoiip_stb, dp(centreAtMap.stoiip_stb, 0));
put('calib_gap_pct', (centre.stoiip_stb / booking.stoiip_stb - 1) * 100, dp((centre.stoiip_stb / booking.stoiip_stb - 1) * 100, 6));
put('calib_gap_abs_pct', Math.abs((centre.stoiip_stb / booking.stoiip_stb - 1) * 100), dp(Math.abs((centre.stoiip_stb / booking.stoiip_stb - 1) * 100), 4));
put('calib_side', centre.stoiip_stb < booking.stoiip_stb ? 'short of' : 'above', centre.stoiip_stb < booking.stoiip_stb ? 'short of' : 'above');
put('avg_col_ft', (netFt * booking.oil_columns) / centre.oil_columns, dp((netFt * booking.oil_columns) / centre.oil_columns, 2));
put('area_ratio_pct', (centre.oil_columns / booking.oil_columns - 1) * 100, dp((centre.oil_columns / booking.oil_columns - 1) * 100, 1));
put('phi_scale_needed', booking.stoiip_stb / centreAtMap.stoiip_stb, dp(booking.stoiip_stb / centreAtMap.stoiip_stb, 4));
put('err_cascade', cascade.length, String(cascade.length));
put('err_inplace', inPlace.length, String(inPlace.length));
put('err_nzcut', nzCut.length, String(nzCut.length));
put('err_layerdrop', layerDrop.length, String(layerDrop.length));
put('err_startoff', startOff.length, String(startOff.length));
put('msg_startoff', startOff[0], startOff[0]);
put('err_k2five', k2Five.length, String(k2Five.length));
put('msg_k2five', k2Five[0], k2Five[0]);
put('err_dropwell', dropWell.length, String(dropWell.length));
put('periods', periods.length, String(periods.length));
put('st_columns', new Set(stConn.map((c) => `${c.i},${c.j}`)).size, String(new Set(stConn.map((c) => `${c.i},${c.j}`)).size));
put('st_dirs', [...new Set(stConn.map((c) => c.dir))].join(''), [...new Set(stConn.map((c) => c.dir))].join(', '));
put('st_len_sum', stConn.reduce((s, c) => s + c.lengthFt, 0), dp(stConn.reduce((s, c) => s + c.lengthFt, 0), 2));
const pth = stPath();
put('st_path_len', Math.hypot(pth[1].x - pth[0].x, pth[1].y - pth[0].y, pth[1].depth - pth[0].depth), dp(Math.hypot(pth[1].x - pth[0].x, pth[1].y - pth[0].y, pth[1].depth - pth[0].depth), 2));
put('st_dx_m', st.to.x - st.from.x, String(st.to.x - st.from.x));
put('st_dy_m', st.to.y - st.from.y, String(st.to.y - st.from.y));
put('st_conn_metres', stConnMetres.length, String(stConnMetres.length));
put('st_depth_metres_top', pth[0].depth * 0.3048, dp(pth[0].depth * 0.3048, 2));
put('st_heel_ft', pth[0].depth, dp(pth[0].depth, 2));
put('st_toe_ft', pth[1].depth, dp(pth[1].depth, 2));

// ------------------------------------------------------------------ extra derivations
const kh = layers.map((l) => l.dz * l.permx);
const khSum = kh.reduce((a, b) => a + b, 0);
kh.forEach((v, k) => put(`kh${k + 1}_pct`, (100 * v) / khSum, dp((100 * v) / khSum, 2)));
put('h2_pct', (100 * layers[1].dz) / netFt, dp((100 * layers[1].dz) / netFt, 1)); // thickness share, not kh
put('equal_share_pct', 100 / layers.length, String(100 / layers.length));
put('dip_full_cell', ((2135 - wt['IKP-4'].deck_m) / CASE.cellM) * 1000, dp(((2135 - wt['IKP-4'].deck_m) / CASE.cellM) * 1000, 2)); // divided by the cell size
put('dip_range', ((2135 - wt['IKP-4'].deck_m) / CASE.krig.range) * 1000, dp(((2135 - wt['IKP-4'].deck_m) / CASE.krig.range) * 1000, 2)); // divided by the range
put('avg_col_wrong', (netFt * centre.oil_columns) / booking.oil_columns, dp((netFt * centre.oil_columns) / booking.oil_columns, 2)); // ratio inverted
put('st_extra', stConn.length - new Set(stConn.map((c) => `${c.i},${c.j}`)).size, String(stConn.length - new Set(stConn.map((c) => `${c.i},${c.j}`)).size));
put('st_short', Math.hypot(pth[1].x - pth[0].x, pth[1].y - pth[0].y, pth[1].depth - pth[0].depth) - stConn.reduce((s, c) => s + c.lengthFt, 0),
  dp(Math.hypot(pth[1].x - pth[0].x, pth[1].y - pth[0].y, pth[1].depth - pth[0].depth) - stConn.reduce((s, c) => s + c.lengthFt, 0), 2));
// where the path is outside the rock: sample it finely and count points with no cell
let outside = 0;
for (let q = 0; q < 2000; q += 1) {
  const t = (q + 0.5) / 2000;
  const pt = { x: pth[0].x + (pth[1].x - pth[0].x) * t, y: pth[0].y + (pth[1].y - pth[0].y) * t, depth: pth[0].depth + (pth[1].depth - pth[0].depth) * t };
  if (!cellAtPoint(grid, pt)) outside += 1;
}
put('st_outside_frac', outside / 2000, dp(outside / 2000, 4));
put('nzcut_msgs', nzCut, nzCut.join(' | '));

console.log(JSON.stringify(out));
