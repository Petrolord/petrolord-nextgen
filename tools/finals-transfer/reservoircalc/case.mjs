// W6 transfer case for the reservoircalc finals: the UMUOJI accumulation.
//
// Five wells, a 50 m grid and a 600 m extrapolation limit, a 2120 m contact,
// a sealing fault at an easting of 1600 m and five well porosities that
// improve DOWNDIP. No lesson, module question or capstone of this course works
// it: they all work the six Ekene wells on a 100 m grid (contacts 1550 to 1575
// m, faults 800 to 2300 m), and the W5 re-case keeps the Ekene geometry.
// UMUOJI is chosen to test the tiers' ideas where Ekene does not show them:
// the crest is base limited, so the tallest column is not at the crest; the
// east block holds the crest; and the porosity model REMOVES barrels.
//
// Every figure is produced by the SAME engine pipeline the course's teaching
// library uses (topsToPoints, specForPoints, gridSurface, zoneVolumes,
// populate, planeFit, sampleAtXY). Where a distractor is a wrong method the
// engine has no door for, it is the same pipeline run with the wrong input, or
// a one-line derivation from engine outputs named in the comment above it.
// Prints everything as one JSON object {inputs, values, print}.
import { topsToPoints, specForPoints } from '@petrolord/engines/engines/mapping/surface.js';
import { gridSurface } from '@petrolord/engines/lib/gridding/gridding.js';
import { isNull, sampleAtXY } from '@petrolord/engines/lib/gridding/gridmath.js';
import { zoneVolumes } from '@petrolord/engines/engines/earthmodeling/volumes.js';
import { populate, planeFit } from '@petrolord/engines/engines/earthmodeling/properties.js';

const WELLS = [
  { name: 'Umuoji-1', surface_x: 900, surface_y: 1000, tops: [{ name: 'TOP', md_m: 2105 }, { name: 'BASE', md_m: 2131 }] },
  { name: 'Umuoji-2', surface_x: 1700, surface_y: 800, tops: [{ name: 'TOP', md_m: 2098 }, { name: 'BASE', md_m: 2118 }] },
  { name: 'Umuoji-3', surface_x: 1300, surface_y: 1700, tops: [{ name: 'TOP', md_m: 2112 }, { name: 'BASE', md_m: 2146 }] },
  { name: 'Umuoji-4', surface_x: 2300, surface_y: 1500, tops: [{ name: 'TOP', md_m: 2124 }, { name: 'BASE', md_m: 2150 }] },
  { name: 'Umuoji-5', surface_x: 1900, surface_y: 2025, tops: [{ name: 'TOP', md_m: 2131 }, { name: 'BASE', md_m: 2160 }] },
];
const PHI_WELL = { 'Umuoji-1': 0.19, 'Umuoji-2': 0.17, 'Umuoji-3': 0.21, 'Umuoji-4': 0.24, 'Umuoji-5': 0.22 };
const CELL = 50;
const EXT = 600;
const OWC = 2120;
const PROPS = { ntg: 0.75, phi: 0.21, sw: 0.30, bo: 1.35 };
const M3_TO_STB = 6.2898;
const FAULT_X = 1600;
const KRIGE = { model: 'spherical', range: 1000, sill: 1, nugget: 0 };
const P = { x: 1500, y: 1300 };

const inputs = {
  case: 'UMUOJI',
  wells: WELLS.map((w) => `${w.name} at (${w.surface_x}, ${w.surface_y}) top ${w.tops[0].md_m} base ${w.tops[1].md_m} porosity ${PHI_WELL[w.name]}`),
  cellM: CELL, cellAreaM2: CELL * CELL, maxExtrapolationM: EXT, padCells: 2,
  owcM: OWC, owcShallowM: 2115, owcDeepM: 2125, props: PROPS, m3ToStb: M3_TO_STB,
  faultXM: FAULT_X, eastOwcAltM: [2115, 2125], krige: KRIGE, prospect: P,
  revisedSw: 0.40, revisedBo: 1.45, handedPhi: PROPS.phi, faultDipDeg: 60,
};

const values = {};
const print = {};
const put = (k, v, digits = 6) => { values[k] = v; print[k] = typeof v === 'number' ? v.toFixed(digits) : String(v); };
const putInt = (k, v) => { values[k] = v; print[k] = String(v); };

// ---------------------------------------------------------------- the two surfaces
const surfaces = (wells, frame = null) => {
  const tp = topsToPoints(wells, 'TOP');
  const spec = frame || specForPoints(tp, CELL, 2);
  const top = gridSurface(tp, spec, { maxExtrapolation: EXT });
  const base = gridSurface(topsToPoints(wells, 'BASE'), spec, { maxExtrapolation: EXT });
  return { spec, top, base };
};
const S = surfaces(WELLS);
const { spec } = S;
const n = spec.nx * spec.ny;
const mk = (v) => new Float32Array(n).fill(v);
putInt('nx', spec.nx); putInt('ny', spec.ny); putInt('x0', spec.x0); putInt('y0', spec.y0);
putInt('frameNodes', n);
putInt('liveTop', S.top.live); putInt('liveBase', S.base.live);
let bothLive = 0;
for (let j = 0; j < n; j++) if (!isNull(S.top.z[j]) && !isNull(S.base.z[j])) bothLive += 1;
putInt('bothLive', bothLive);
put('topMin', S.top.zMin, 4); put('topMax', S.top.zMax, 4);
put('baseMin', S.base.zMin, 4); put('baseMax', S.base.zMax, 4);

// one booking: clip, sum, chain. owc may differ west/east through labels.
const book = ({ surf = S, owcW = OWC, owcE = owcW, faultX = null, phiGrid = null, props = PROPS, strictWest = true } = {}) => {
  const { top, base } = surf;
  const thick = new Float32Array(n).fill(1e30);
  const labels = faultX === null ? null : new Int32Array(n);
  const cols = { 0: [], 1: [], total: [] };
  let baseLimited = 0;
  let maxCol = 0; let maxAt = null;
  for (let j = 0; j < n; j++) {
    const c = j % spec.nx; const r = Math.floor(j / spec.nx);
    const x = spec.x0 + c * spec.dx; const y = spec.y0 + r * spec.dy;
    const west = faultX === null ? true : (strictWest ? x < faultX : x <= faultX);
    if (labels) labels[j] = west ? 0 : 1;
    if (isNull(top.z[j]) || isNull(base.z[j])) continue;
    const owc = west ? owcW : owcE;
    const t = Math.min(base.z[j], owc) - top.z[j];
    if (t <= 0) continue;
    thick[j] = t;
    if (base.z[j] < owc) baseLimited += 1;
    if (t > maxCol) { maxCol = t; maxAt = { x, y, top: top.z[j], base: base.z[j] }; }
    cols[west ? 0 : 1].push(t); cols.total.push(t);
  }
  const vols = zoneVolumes(spec, thick, labels, {
    ntg: mk(props.ntg), phi: phiGrid || mk(props.phi), sw: mk(props.sw),
  });
  const empty = { bulk_m3: 0, net_m3: 0, pore_m3: 0, hcpv_m3: 0, cells: 0 };
  const pack = (b, cs) => {
    const s = b || empty;
    return {
      cells: s.cells, grv: s.bulk_m3 / 1e6, net: s.net_m3 / 1e6, pore: s.pore_m3 / 1e6, hcpv: s.hcpv_m3 / 1e6,
      stoiip: ((s.hcpv_m3 / props.bo) * M3_TO_STB) / 1e6,
      meanCol: cs.length ? cs.reduce((a, t) => a + t, 0) / cs.length : 0,
      maxCol: cs.length ? Math.max(...cs) : 0,
    };
  };
  return {
    thick, labels, baseLimited, maxCol, maxAt,
    total: pack(vols.total, cols.total), west: pack(vols['0'], cols[0]), east: pack(vols['1'], cols[1]),
  };
};

// ================================================================ BEGINNER
const B = book();
putInt('b_cells', B.total.cells);
putInt('b_dryLive', bothLive - B.total.cells);
putInt('b_baseLimited', B.baseLimited);
putInt('b_contactLimited', B.total.cells - B.baseLimited);
put('b_maxCol', B.maxCol, 4);
putInt('b_maxAtX', B.maxAt.x); putInt('b_maxAtY', B.maxAt.y);
put('b_maxAtTop', B.maxAt.top, 4); put('b_maxAtBase', B.maxAt.base, 4);
// the crest (the Umuoji-2 pick) is base limited: its column is base minus top there
put('b_crestCol', Math.min(S.base.zMin, OWC) - S.top.zMin, 4);
// the tempting wrong reading: contact minus mapped crest
put('b_contactMinusCrest', OWC - S.top.zMin, 4);
put('b_grv', B.total.grv); put('b_net', B.total.net); put('b_pore', B.total.pore);
put('b_hcpv', B.total.hcpv); put('b_stoiip', B.total.stoiip);
put('b_meanCol', B.total.meanCol, 4);
// mean column check: GRV over (cells x cell area); the wrong cell area of a 100 m grid
put('b_meanColWrongArea', (B.total.grv * 1e6) / (B.total.cells * 10000), 4);
// the same GRV spread over every live node (live counted as oil)
put('b_meanColLive', (B.total.grv * 1e6) / (bothLive * CELL * CELL), 4);
put('b_areaKm2', (B.total.cells * CELL * CELL) / 1e6, 4);
put('b_areaKm2Live', (bothLive * CELL * CELL) / 1e6, 4);
put('b_areaKm2WrongCell', (B.total.cells * 10000) / 1e6, 4);
// wrong chains, each the same engine run with the wrong input
put('b_stoiipSwNotSo', book({ props: { ...PROPS, sw: 1 - PROPS.sw } }).total.stoiip);
put('b_stoiipTimesBo', (B.total.hcpv * PROPS.bo) * M3_TO_STB);
put('b_hcpvOverBo', B.total.hcpv / PROPS.bo);
put('b_stoiipNtgTwice', book({ props: { ...PROPS, ntg: PROPS.ntg * PROPS.ntg } }).total.stoiip);
// gross average porosity = NTG x phi, applied to GRV (consistent) and the two inconsistent pairings
put('b_grossPhi', PROPS.ntg * PROPS.phi, 4);
put('b_poreGrossNet', B.total.grv * PROPS.phi);
put('b_poreNetGross', B.total.net * PROPS.ntg * PROPS.phi);
// sensitivities, re-run through the engine
const Bsw = book({ props: { ...PROPS, sw: 0.40 } }).total.stoiip;
put('b_stoiipSw36', Bsw);
put('b_pctSw36', 100 * (Bsw / B.total.stoiip - 1), 2);
// a one for one reading of the Sw change (20 percent relative), for the distractor
put('b_pctSwRel', 100 * (0.40 / 0.30 - 1), 2);
const Bbo = book({ props: { ...PROPS, bo: 1.45 } }).total.stoiip;
put('b_stoiipBo15', Bbo);
put('b_pctBo15', 100 * (Bbo / B.total.stoiip - 1), 2);
put('b_pctBo15Up', 100 * (1.45 / 1.35 - 1), 2);
// contact cases
const Bs = book({ owcW: 2115 }); const Bd = book({ owcW: 2125 });
putInt('b_cellsShallow', Bs.total.cells); putInt('b_cellsDeep', Bd.total.cells);
put('b_stoiipShallow', Bs.total.stoiip); put('b_stoiipDeep', Bd.total.stoiip);
put('b_grvShallow', Bs.total.grv); put('b_grvDeep', Bd.total.grv);
putInt('b_baseLimitedDeep', Bd.baseLimited);
put('b_stepDown', B.total.stoiip - Bs.total.stoiip); put('b_stepUp', Bd.total.stoiip - B.total.stoiip);
put('b_midOfEnds', (Bs.total.stoiip + Bd.total.stoiip) / 2);
put('b_maxColShallow', Bs.maxCol, 4); put('b_maxColDeep', Bd.maxCol, 4);
// property effect of 10 percent porosity, for the leverage comparison
put('b_stoiipPhi10', book({ props: { ...PROPS, phi: PROPS.phi * 1.1 } }).total.stoiip);
// well columns at the contact: min(base, owc) - top, zero if the top is below the contact
for (const w of WELLS) {
  const k = w.name.split('-')[1];
  const t = w.tops[0].md_m; const b = w.tops[1].md_m;
  putInt(`w${k}_sand`, b - t);
  putInt(`w${k}_col`, Math.max(0, Math.min(b, OWC) - t));
}

// ================================================================ INTERMEDIATE
const I = book({ faultX: FAULT_X });
putInt('i_faultCol', (FAULT_X - spec.x0) / spec.dx);
putInt('i_westCells', I.west.cells); putInt('i_eastCells', I.east.cells);
put('i_westGrv', I.west.grv); put('i_eastGrv', I.east.grv);
put('i_westStoiip', I.west.stoiip); put('i_eastStoiip', I.east.stoiip);
put('i_totalStoiip', I.total.stoiip);
put('i_westMeanCol', I.west.meanCol, 4); put('i_eastMeanCol', I.east.meanCol, 4);
put('i_westMaxCol', I.west.maxCol, 4); put('i_eastMaxCol', I.east.maxCol, 4);
put('i_westMaxOverMean', I.west.maxCol / I.west.meanCol, 2);
put('i_westMeanOverMax', I.west.meanCol / I.west.maxCol, 2); put('i_eastMeanOverMax', I.east.meanCol / I.east.maxCol, 2); put('i_eastMaxOverMean', I.east.maxCol / I.east.meanCol, 2);
put('i_westCellShare', 100 * I.west.cells / I.total.cells, 1);
put('i_westBarrelShare', 100 * I.west.stoiip / I.total.stoiip, 1);
put('i_eastCellShare', 100 * I.east.cells / I.total.cells, 1);
put('i_eastBarrelShare', 100 * I.east.stoiip / I.total.stoiip, 1);
put('i_cellRatio', I.east.cells / I.west.cells, 4);
put('i_colRatio', I.east.meanCol / I.west.meanCol, 4);
put('i_barrelRatio', I.east.stoiip / I.west.stoiip, 4);
// closure at full precision
put('i_closureDiff', (I.west.stoiip + I.east.stoiip) - I.total.stoiip, 20);
values.i_closureDiffExp = ((I.west.stoiip + I.east.stoiip) - I.total.stoiip).toExponential(1);
print.i_closureDiffExp = values.i_closureDiffExp;
put('i_grvClosureDiff', (I.west.grv + I.east.grv) - I.total.grv, 20);
// the boundary column: on the fault easting, strictly-less puts it east
const IL = book({ faultX: FAULT_X, strictWest: false });
putInt('i_boundaryCells', IL.west.cells - I.west.cells);
put('i_boundaryGrv', IL.west.grv - I.west.grv);
put('i_conventionWorth', IL.west.stoiip - I.west.stoiip);
put('i_westStoiipLe', IL.west.stoiip); put('i_eastStoiipLe', IL.east.stoiip);
putInt('i_westCellsLe', IL.west.cells); putInt('i_eastCellsLe', IL.east.cells);
// fault position 50 m either way (one node column)
const Iw = book({ faultX: FAULT_X - 50 }); const Ie = book({ faultX: FAULT_X + 50 });
put('i_westStoiipM50', Iw.west.stoiip); put('i_eastStoiipM50', Iw.east.stoiip);
put('i_westStoiipP50', Ie.west.stoiip); put('i_eastStoiipP50', Ie.east.stoiip);
putInt('i_westCellsP50', Ie.west.cells);
put('i_eastPctUp', 100 * (Iw.east.stoiip / I.east.stoiip - 1), 1);
put('i_eastPctDown', 100 * (Ie.east.stoiip / I.east.stoiip - 1), 1);
put('i_westPctUp', 100 * (Ie.west.stoiip / I.west.stoiip - 1), 1);
put('i_westPctDown', 100 * (Iw.west.stoiip / I.west.stoiip - 1), 1);
// labels over the whole frame
let lab0 = 0;
for (let j = 0; j < n; j++) if (I.labels[j] === 0) lab0 += 1;
putInt('i_label0', lab0); putInt('i_label1', n - lab0);
// node index arithmetic: row 12, column 16 (on the fault) and column 15
putInt('i_rowEx', 12); putInt('i_colEx', 16); putInt('i_colExW', 15);
putInt('i_jEx', 12 * spec.nx + 16); putInt('i_jExW', 12 * spec.nx + 15);
putInt('i_xEx', spec.x0 + 16 * spec.dx); putInt('i_xExW', spec.x0 + 15 * spec.dx);
// the transposed index (column times ny plus row), a classic slip
putInt('i_jExTransposed', 16 * spec.ny + 12);
// two contacts
const Ieu = book({ faultX: FAULT_X, owcE: 2115 }); const Ied = book({ faultX: FAULT_X, owcE: 2125 });
putInt('i_eastCells2115', Ieu.east.cells); put('i_eastStoiip2115', Ieu.east.stoiip);
putInt('i_eastCells2125', Ied.east.cells); put('i_eastStoiip2125', Ied.east.stoiip);
put('i_westStoiip2115', Ieu.west.stoiip);
put('i_fieldSum2115', Ieu.west.stoiip + Ieu.east.stoiip); put('i_fieldSum2125', Ied.west.stoiip + Ied.east.stoiip);
put('i_eastLossUp', I.east.stoiip - Ieu.east.stoiip); put('i_eastGainDown', Ied.east.stoiip - I.east.stoiip);
// cross fault control: Umuoji-2 is the only eastern discovery, 100 m east of the fault
// regridded from the other four wells on the SAME frame, so the partition and the cells compare like for like
const S2 = surfaces(WELLS.filter((w) => w.name !== 'Umuoji-2'), spec);
const I2 = book({ surf: S2, faultX: FAULT_X });
putInt('i_noU2WestCells', I2.west.cells); put('i_noU2WestStoiip', I2.west.stoiip);
putInt('i_noU2EastCells', I2.east.cells); put('i_noU2EastStoiip', I2.east.stoiip);
put('i_noU2WestLoss', I.west.stoiip - I2.west.stoiip);
put('i_noU2WestLossPct', 100 * (1 - I2.west.stoiip / I.west.stoiip), 1);
putInt('i_noU2Live', S2.top.live);
// the dip offset of a fault between top and base (not an engine quantity: tan of the dip)
put('i_dipOffset34', 34 / Math.tan((60 * Math.PI) / 180), 2);

// ================================================================ ADVANCED
const phiPts = WELLS.map((w) => ({ x: w.surface_x, y: w.surface_y, v: PHI_WELL[w.name] }));
const [a, bx, cy] = planeFit(phiPts);
put('a_planeA', a); values.a_planeB = bx; values.a_planeC = cy;
print.a_planeB = bx.toExponential(6); print.a_planeC = cy.toExponential(6);
put('a_gradXkm', bx * 1000); put('a_gradYkm', cy * 1000);
put('a_gradKm', Math.hypot(bx, cy) * 1000);
put('a_gradRatio', Math.abs(bx / cy), 2);
const trend = populate(spec, 'trend', phiPts);
const krige = populate(spec, 'krige', phiPts, KRIGE);
const constW = populate(spec, 'constant', phiPts);
put('a_wellMean', phiPts.reduce((s, p) => s + p.v, 0) / phiPts.length);
put('a_phiP', sampleAtXY(trend, spec, P.x, P.y));
put('a_phiPKrige', sampleAtXY(krige, spec, P.x, P.y));
// residuals, model minus measured, as the sampler reports them
let maxRes = 0; let maxResWell = '';
for (const w of WELLS) {
  const k = w.name.split('-')[1];
  const tv = sampleAtXY(trend, spec, w.surface_x, w.surface_y);
  const kv = sampleAtXY(krige, spec, w.surface_x, w.surface_y);
  put(`a_trendAt${k}`, tv); put(`a_resTrend${k}`, tv - PHI_WELL[w.name]);
  put(`a_krigeAt${k}`, kv); put(`a_resKrige${k}`, kv - PHI_WELL[w.name]);
  if (Math.abs(tv - PHI_WELL[w.name]) > Math.abs(maxRes)) { maxRes = tv - PHI_WELL[w.name]; maxResWell = w.name; }
}
put('a_maxRes', maxRes); put('a_maxResAbs', Math.abs(maxRes)); values.a_maxResWell = maxResWell; print.a_maxResWell = maxResWell;
// the plane evaluated exactly at Umuoji-5 (off node) against the bilinear sample there
put('a_planeAtU5', a + bx * 1900 + cy * 2025);
// means over the oil (the 2120 m contact, no fault)
let sPhi = 0; let sT = 0; let sTPhi = 0; let nOil = 0; let minOil = Infinity; let maxOil = -Infinity;
let sLive = 0; let nLive = 0; let minFrame = Infinity; let maxFrame = -Infinity;
const oil = [];
for (let j = 0; j < n; j++) {
  const pv = trend[j];
  if (pv < minFrame) minFrame = pv; if (pv > maxFrame) maxFrame = pv;
  if (!isNull(S.top.z[j]) && !isNull(S.base.z[j])) { sLive += pv; nLive += 1; }
  const t = B.thick[j];
  if (isNull(t)) continue;
  sPhi += pv; sT += t; sTPhi += t * pv; nOil += 1; oil.push([t, pv]);
  if (pv < minOil) minOil = pv; if (pv > maxOil) maxOil = pv;
}
put('a_nodeMeanOil', sPhi / nOil); put('a_liveMean', sLive / nLive);
put('a_colWeighted', sTPhi / sT);
put('a_oilMin', minOil); put('a_oilMax', maxOil); put('a_frameMin', minFrame); put('a_frameMax', maxFrame);
const mT = sT / nOil; const mP = sPhi / nOil;
let sxy = 0; let sxx = 0; let syy = 0;
for (const [t, pv] of oil) { sxy += (t - mT) * (pv - mP); sxx += (t - mT) ** 2; syy += (pv - mP) ** 2; }
put('a_corr', sxy / Math.sqrt(sxx * syy), 3);
put('a_cov', sxy / nOil, 8);
put('a_meanColOil', mT, 6);
put('a_covOverMean', (sxy / nOil) / mT, 8);
// bookings (whole field, 2120 m)
const Tc = book(); // handed-out constant 0.21
const Tw = book({ phiGrid: constW });
const Tt = book({ phiGrid: trend });
const Tk = book({ phiGrid: krige });
const Tn = book({ props: { ...PROPS, phi: sPhi / nOil } });
put('a_stoiipHanded', Tc.total.stoiip); put('a_stoiipWellMean', Tw.total.stoiip);
put('a_stoiipNodeMean', Tn.total.stoiip); put('a_stoiipTrend', Tt.total.stoiip); put('a_stoiipKrige', Tk.total.stoiip);
put('a_poreHanded', Tc.total.pore); put('a_poreTrend', Tt.total.pore); put('a_poreKrige', Tk.total.pore);
put('a_hcpvTrend', Tt.total.hcpv); put('a_netTrend', Tt.total.net); put('a_grvTrend', Tt.total.grv);
putInt('a_cellsTrend', Tt.total.cells);
put('a_effTrend', Tt.total.pore / Tt.total.net); put('a_effKrige', Tk.total.pore / Tk.total.net);
put('a_effWell', Tw.total.pore / Tw.total.net);
put('a_uplift', Tt.total.stoiip - Tc.total.stoiip);
put('a_stepConst', Tw.total.stoiip - Tc.total.stoiip);
put('a_stepSpatial', Tt.total.stoiip - Tw.total.stoiip);
put('a_stepSelect', Tn.total.stoiip - Tw.total.stoiip);
put('a_stepWeight', Tt.total.stoiip - Tn.total.stoiip);
put('a_ratioTrend', Tt.total.stoiip / Tc.total.stoiip);
put('a_ratioPore', Tt.total.pore / Tc.total.pore);
put('a_krigeMinusTrend', Tk.total.stoiip - Tt.total.stoiip);
put('a_methodSpread', Math.max(Tw.total.stoiip, Tt.total.stoiip, Tk.total.stoiip) - Math.min(Tw.total.stoiip, Tt.total.stoiip, Tk.total.stoiip));
// the node-mean-times-net mistake
put('a_poreNodeMeanTimesNet', Tt.total.net * (sPhi / nOil));
put('a_stoiipNodeMeanTimesNet', ((Tt.total.net * (sPhi / nOil) * (1 - PROPS.sw)) / PROPS.bo) * M3_TO_STB);
// resolution test: gradient over the mean well spacing against the largest residual
let dsum = 0; let dn = 0;
for (let i = 0; i < phiPts.length; i++) for (let k = i + 1; k < phiPts.length; k++) {
  dsum += Math.hypot(phiPts[i].x - phiPts[k].x, phiPts[i].y - phiPts[k].y); dn += 1;
}
put('a_meanSpacingKm', dsum / dn / 1000, 3);
put('a_changeOverSpacing', Math.hypot(bx, cy) * (dsum / dn));
put('a_resolutionKm', Math.abs(maxRes) / (Math.hypot(bx, cy) * 1000), 3);

// ---------------------------------------------------------------- derived and quoted figures
// the dry live ground as an area, the porosity-versus-contact leverage, one column of fault movement
put('b_areaKm2Dry', ((bothLive - B.total.cells) * CELL * CELL) / 1e6, 4);
put('b_phi10Gain', values.b_stoiipPhi10 - B.total.stoiip);
put('i_stepM50', I.west.stoiip - Iw.west.stoiip);
put('i_barrelRatioInv', I.west.stoiip / I.east.stoiip, 4);
put('i_fieldSumBase', I.west.stoiip + I.east.stoiip);
// the dip offset read the wrong way up (thickness times the tangent)
put('i_dipOffsetTan', 34 * Math.tan((60 * Math.PI) / 180), 2);
// magnitudes for items phrased as "falls by" or "takes off"
for (const k of ['b_pctSw36', 'b_pctBo15', 'i_eastPctDown', 'i_westPctDown', 'a_uplift', 'a_stepConst',
  'a_stepSpatial', 'a_stepSelect', 'a_stepWeight', 'a_krigeMinusTrend']) {
  const d = print[k].split('.')[1]?.length ?? 0;
  put(`${k}Abs`, Math.abs(values[k]), d);
}
// the constants as the items quote them
for (const [k, v] of Object.entries({
  c_ntg: '0.75', c_phi: '0.21', c_sw: '0.30', c_so: '0.70', c_bo: '1.35', c_bo2: '1.45', c_sw2: '0.40',
  c_cell: '50', c_cellArea: '2500', c_ext: '600', c_owc: '2120', c_owcS: '2115', c_owcD: '2125',
  c_fault: '1600', c_conv: '6.2898', c_grid100: '100', c_area100: '10000', c_ten: '10', c_dip: '60',
  c_range: '1000', c_sand34: '34', c_so2: '0.60', c_phi10: '0.231', c_tan60: '1.732', c_pX: '1500', c_pY: '1300', c_krigeY: '2025',
})) { values[k] = Number(v); print[k] = v; }

console.log(JSON.stringify({ inputs, values, print }));
