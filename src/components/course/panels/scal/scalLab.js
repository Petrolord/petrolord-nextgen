// SCAL & displacement teaching lab for the RC3 course (app 'scal'). Pure math
// plus fixture access; every exported value is pinned by scalLab.test.js to the
// RC3 truth digest, which was derived by running the vendored engines over the
// committed fixtures. Panels and the learning page import THIS module.

import ekeneScal from '@petrolord/engines/test-data/ekene-dynamic/scal.json';
import ekeneField from '@petrolord/engines/test-data/ekene-dynamic/field.json';
import {
  coreyKr, fractionalFlow, mobilityRatio, analyzeDisplacement, makeFwFunction,
  welgeTangentGeneral, pvToDays, sampleFractionalFlowData, validateKrTable,
} from '@petrolord/engines/engines/scal/fractionalFlow.js';
import {
  LEVERETT_C, PSI_PER_FT_WATER, computeJTable, fitJPowerLaw, averageJCurves,
  makeJFunction, pcFromJ, heightFromPc, fitCoreyToKrTable, normalizeKrTable,
} from '@petrolord/engines/engines/scal/scal.js';

export const EKENE_SCAL = ekeneScal;
export const FIELD = ekeneField;
export { LEVERETT_C, PSI_PER_FT_WATER };
export {
  coreyKr, fractionalFlow, mobilityRatio, analyzeDisplacement, makeFwFunction,
  welgeTangentGeneral, pvToDays, validateKrTable, computeJTable, fitJPowerLaw,
  averageJCurves, makeJFunction, pcFromJ, heightFromPc, fitCoreyToKrTable,
  normalizeKrTable,
};

// The locked oil gravity for the Ekene crude. gammaO is COMPUTED from it (the
// standard API relation), never typed as a decimal, so the number the dip term
// and the height conversion use is the same double the fixture carries.
export const OIL_API = 32;
export const GAMMA_O = 141.5 / (131.5 + OIL_API);

export const M_PER_FT = 0.3048; // exact by definition

// ---------------------------------------------------------------------------
// 1. The Ekene displacement (Associate)
// ---------------------------------------------------------------------------

/** The fixture design through the real engine: kr curves, fw, the Welge
 *  tangent and the recovery profile, exactly as the capstone grades them. */
export function ekeneDisplacement() {
  const D = EKENE_SCAL.design;
  return analyzeDisplacement({ krSpec: D.krSpec, muW: D.muW_cp, muO: D.muO_cp });
}

/** One-factor variations off the Ekene design (the panel's sliders). */
export function displacementWith({ muO = EKENE_SCAL.design.muO_cp, nw = EKENE_SCAL.design.krSpec.nw } = {}) {
  const D = EKENE_SCAL.design;
  return analyzeDisplacement({ krSpec: { ...D.krSpec, nw }, muW: D.muW_cp, muO });
}

/** The classroom hand case (sampleFractionalFlowData): M = 4, and at Sw 0.5
 *  every number is closed form (krw 0.1, kro 0.25, fw 0.8). */
export function textbookCase() {
  const s = sampleFractionalFlowData();
  const out = analyzeDisplacement({ krSpec: s.params, muW: s.muW, muO: s.muO });
  return {
    ...out,
    spec: s,
    at05: { ...coreyKr(0.5, s.params), fw: fractionalFlow(0.5, s.params, s.muW, s.muO) },
  };
}

/** Days to breakthrough at a constant injection rate on the Ekene pore
 *  volume. Qi defaults to the design-case breakthrough pore volumes. */
export function btDaysAt(iw_bpd, Qi = null) {
  const q = Qi ?? ekeneDisplacement().bl.QiBt;
  return pvToDays(q, { pvBbl: EKENE_SCAL.pore_volume.pv_bbl, iw_bpd });
}

// ---------------------------------------------------------------------------
// 2. The Leverett collapse and the reservoir capillary story (Professional)
// ---------------------------------------------------------------------------

/** Each Ekene plug's lab Pc table reduced to J through its own rock and
 *  fluid pair. Three different labs, three different Pc magnitudes, one J. */
export function plugJTables() {
  return EKENE_SCAL.capillary.lab_pc.map((plug) => {
    const jt = computeJTable(plug.rows.map((r) => ({ Sw: r.Sw, Pc_psi: r.Pc_psi })), plug.sample);
    if (!jt.ok) throw new Error(`computeJTable failed for ${plug.name}: ${jt.errors.join('; ')}`);
    return {
      name: plug.name,
      well: plug.well,
      system: plug.system,
      sample: plug.sample,
      pcRows: plug.rows,
      jRows: jt.rows,
    };
  });
}

/** Largest row-wise spread across the three collapsed J tables. Machine
 *  epsilon on the fixture: the collapse is exact by construction. */
export function collapseSpread() {
  const tables = plugJTables().map((p) => p.jRows);
  let spread = 0;
  for (let i = 0; i < tables[0].length; i++) {
    const values = tables.map((rows) => rows[i].J);
    spread = Math.max(spread, Math.max(...values) - Math.min(...values));
  }
  return spread;
}

/** Power-law fit of one plug's J rows (or all three pooled when plugIdx is
 *  null) at an explicit Swirr. The true Swirr 0.25 recovers a 0.25, b 1. */
export function fitPlugJ(plugIdx = 1, Swirr = EKENE_SCAL.capillary.design.jTrue.Swirr) {
  const plugs = plugJTables();
  const rows = plugIdx == null
    ? plugs.flatMap((p) => p.jRows)
    : plugs[plugIdx].jRows;
  return fitJPowerLaw(rows.map((r) => ({ Sw: r.Sw, J: r.J })), { Swirr });
}

/** averageJCurves over the three plugs at the true Swirr. The refit DRIFTS
 *  (a 0.24915..., b 1.01028...) because the mean curve is resampled through
 *  the log-linear tabulated evaluator before refitting; the direct fit on
 *  raw points is exact. The Expert capstone grades the drifted a. */
export function averageRefit() {
  const plugs = plugJTables();
  const avg = averageJCurves(
    plugs.map((p) => ({ name: p.name, jRows: p.jRows.map((r) => ({ Sw: r.Sw, J: r.J })) })),
    { Swirr: EKENE_SCAL.capillary.design.jTrue.Swirr },
  );
  if (!avg.ok) throw new Error(`averageJCurves failed: ${avg.errors.join('; ')}`);
  return avg;
}

/** Entry pressure, entry height, FWL and crest saturation on the Ekene sand,
 *  re-derived from the fixture design constants (never read from the
 *  fixture's own expected block, so a fixture edit cannot hide a drift). */
export function reservoirCapillary() {
  const { jTrue, reservoir, gammaW } = EKENE_SCAL.capillary.design;
  const fluids = { gammaW, gammaHc: GAMMA_O };
  const sigmaCos = reservoir.sigma_dyncm * Math.cos((reservoir.thetaDeg * Math.PI) / 180);
  const psiPerJ = sigmaCos / (LEVERETT_C * Math.sqrt(reservoir.k_md / reservoir.phi));
  const gradPsiPerFt = PSI_PER_FT_WATER * (gammaW - GAMMA_O);
  // J(Sw = 1) = a exactly, so the entry pressure is a times the scaling factor.
  const pcEntryPsi = jTrue.a * psiPerJ;
  const hEntryFt = heightFromPc(pcEntryPsi, fluids);
  const hEntryM = hEntryFt * M_PER_FT;
  const contactM = FIELD.static.owc_m_tvd;
  // Convention (fixture design): Sw reaches 1.0 exactly at the mapped contact,
  // so the free water level sits one entry height BELOW it.
  const fwlM = contactM + hEntryM;
  const columnM = FIELD.static.max_oil_column_m;
  const hCrestFt = (columnM + hEntryM) * (1 / M_PER_FT);
  const jAtCrest = (hCrestFt * gradPsiPerFt) / psiPerJ;
  const swAtCrest = jTrue.Swirr + Math.pow(jAtCrest / jTrue.a, -1 / jTrue.b) * (1 - jTrue.Swirr);
  return {
    psiPerJ, gradPsiPerFt, pcEntryPsi, hEntryFt, hEntryM,
    contactM, fwlM, columnM, hCrestFt, swAtCrest, fluids,
  };
}

/** Height-averaged Sw over the crest column: composite trapezoid, 2000
 *  intervals from the contact (h = entry height above FWL) to the crest.
 *  Re-derived, not read from the fixture. The honest number the flat 0.35
 *  booking replaces for THIS one column. */
export function swAvgCrestColumn(nIntervals = 2000) {
  const cap = reservoirCapillary();
  const { jTrue } = EKENE_SCAL.capillary.design;
  let swSum = 0;
  for (let i = 0; i <= nIntervals; i++) {
    const h = cap.hEntryFt + ((cap.hCrestFt - cap.hEntryFt) * i) / nIntervals;
    const j = (h * cap.gradPsiPerFt) / cap.psiPerJ;
    const sw = Math.min(
      1,
      jTrue.Swirr + Math.pow(j / jTrue.a, -1 / jTrue.b) * (1 - jTrue.Swirr),
    );
    swSum += i === 0 || i === nIntervals ? sw / 2 : sw;
  }
  return swSum / nIntervals;
}

// ---------------------------------------------------------------------------
// 3. Ahmed Example 4-7, the published anchor (Professional)
// ---------------------------------------------------------------------------

// The tables exactly as the book prints them (Ahmed, Reservoir Engineering
// Handbook, Example 4-7). The printed J column is ROUNDED; scaling it back to
// reservoir rock is the book's own chain and is what the capstone grades.
export const AHMED_47 = {
  lab: { k_md: 80, phi: 0.16, sigma_dyncm: 50, thetaDeg: 0 },
  reservoir: { k_md: 120, phi: 0.19, sigma_dyncm: 50, thetaDeg: 0 },
  labPcRows: [
    { Sw: 1.0, Pc_psi: 0.5 },
    { Sw: 0.8, Pc_psi: 0.6 },
    { Sw: 0.6, Pc_psi: 0.75 },
    { Sw: 0.4, Pc_psi: 1.05 },
    { Sw: 0.2, Pc_psi: 1.75 },
  ],
  printedJ: [
    { Sw: 1.0, J: 0.048 },
    { Sw: 0.8, J: 0.058 },
    { Sw: 0.6, J: 0.073 },
    { Sw: 0.4, J: 0.102 },
    { Sw: 0.2, J: 0.169 },
  ],
};

/** The full lab-to-reservoir chain: lab J-per-psi factor, full-precision J
 *  column, reservoir psi-per-J factor, and the reservoir Pc rows from BOTH
 *  the printed (rounded) J column and the full-precision one. The two differ
 *  by 0.0037 psi at Sw 0.2, a gradable distinction in rounding discipline. */
export function ahmedChain() {
  const { lab, reservoir, labPcRows, printedJ } = AHMED_47;
  const cosLab = Math.cos((lab.thetaDeg * Math.PI) / 180);
  const labFactor = (LEVERETT_C * Math.sqrt(lab.k_md / lab.phi)) / (lab.sigma_dyncm * cosLab);
  const jt = computeJTable(labPcRows, lab);
  if (!jt.ok) throw new Error(`computeJTable failed for Ahmed 4-7: ${jt.errors.join('; ')}`);
  const cosRes = Math.cos((reservoir.thetaDeg * Math.PI) / 180);
  const resFactor = (reservoir.sigma_dyncm * cosRes) / (LEVERETT_C * Math.sqrt(reservoir.k_md / reservoir.phi));
  const grid = { n: 4, SwMin: 0.2, SwMax: 1.0 };
  const printedChain = pcFromJ({ type: 'table', rows: printedJ }, reservoir, grid);
  const fullChain = pcFromJ(
    { type: 'table', rows: jt.rows.map((r) => ({ Sw: r.Sw, J: r.J })) },
    reservoir,
    grid,
  );
  if (!printedChain.ok || !fullChain.ok) throw new Error('pcFromJ failed for Ahmed 4-7');
  return {
    labFactor,
    resFactor,
    jRows: jt.rows,
    printedChainRows: printedChain.rows,
    fullChainRows: fullChain.rows,
  };
}

// ---------------------------------------------------------------------------
// 4. Fitting, gravity and polymer (Expert)
// ---------------------------------------------------------------------------

function buildLabKrGrid() {
  const D = EKENE_SCAL.design.krSpec;
  const rows = [];
  for (let i = 0; i <= 12; i++) {
    const Sw = 0.35 + ((0.75 - 0.35) * i) / 12;
    const { krw, kro } = coreyKr(Sw, D);
    rows.push({ Sw, krw, kro });
  }
  return rows;
}

/** The 13-row "lab measurement": the Ekene Corey design sampled on Sw 0.35 to
 *  0.75 in twelve equal steps. First row {0.35, 0, 0.9}, last {0.75, 0.3, 0}. */
export const LAB_KR_GRID = buildLabKrGrid();

/** Fit the lab grid back to Corey. With fixed endpoints from the table the
 *  fit recovers nw 2.4999999999999996 and no 2 from 24 usable points (the
 *  two endpoint zeros are definitional and sit under the kr floor). */
export function fitLabGrid(opts = {}) {
  return { grid: LAB_KR_GRID, fit: fitCoreyToKrTable(LAB_KR_GRID, opts) };
}

/** Fit an arbitrary kr table (the panel's fit-the-lab mode with edits). */
export function fitKrTable(rows, opts = {}) {
  return fitCoreyToKrTable(rows, opts);
}

// The designed Expert gravity case: the Ekene kr set and viscosities on a
// dipping element. k comes from the capillary design (250 md), the water
// gravity from the same block, and the oil gravity from the locked API 32.
export const DIP_CASE = {
  k_md: EKENE_SCAL.capillary.design.reservoir.k_md,
  A_ft2: 20000,
  qt_rbd: 2000,
  dipDeg: 10,
  gammaW: EKENE_SCAL.capillary.design.gammaW,
  gammaO: GAMMA_O,
};

/** The dip case at a chosen rate and dip angle (updip positive). */
export function dipCase(qt_rbd = DIP_CASE.qt_rbd, dipDeg = DIP_CASE.dipDeg) {
  const D = EKENE_SCAL.design;
  const spec = {
    krSpec: D.krSpec,
    muW: D.muW_cp,
    muO: D.muO_cp,
    gravity: { ...DIP_CASE, qt_rbd, dipDeg },
  };
  const { gravityCoefficient } = makeFwFunction(spec);
  return { ...analyzeDisplacement(spec), gCoef: gravityCoefficient };
}

export const POLYMER_MULT_DEFAULT = 4;

/** Polymer screening: water viscosity multiplied, nothing else modelled.
 *  The engine says so itself in the warnings array. */
export function polymerCase(polymerMuMult = POLYMER_MULT_DEFAULT) {
  const D = EKENE_SCAL.design;
  return analyzeDisplacement({ krSpec: D.krSpec, muW: D.muW_cp, muO: D.muO_cp, polymerMuMult });
}
