// Completion design teaching lab for the DR8 course (app 'completion'). Pure
// functions over the vendored engines/drilling completionDesign module, its
// equipment catalog and its goldens; every exported value is pinned by
// completionLab.test.js.
//
// One wellbore, one published completion and one capstone. The LESSONS run
// the golden 3-1/2 inch string in the 9-5/8 inch casing and 7 inch 29 lb/ft
// liner. The CAPSTONE runs a 2-7/8 inch string in a heavier program: a
// 13-3/8 inch surface string the profile has to hide, 9-5/8 inch 53.5 lb/ft
// all the way, and a 7 inch 32 lb/ft liner whose drift is tighter. Every
// dimension, every length and every space-out number differs, so no graded
// value is a number a lesson prints and none is a number the goldens publish.

import cases from '@petrolord/engines/test-data/drilling/goldens/completion_cases.json';
import tubularCases from '@petrolord/engines/test-data/drilling/goldens/tubular_cases.json';

import {
  apiDriftM, buildStack, casingProgramProfile, governingDriftTo, runInClearance,
  throughBoreProfile, completionVolumes, sealSpaceOut,
  DRIFT_DEDUCTION_TUBING_M, DRIFT_DEDUCTION_CASING_SMALL_M,
  DRIFT_DEDUCTION_CASING_MID_M, DRIFT_DEDUCTION_CASING_LARGE_M,
} from '@petrolord/engines/engines/drilling/completionDesign.js';
import {
  EQUIPMENT_CATALOG, PACKERS, NIPPLE_BORES_IN, EUE_COUPLING_OD_IN, EQUIPMENT_TYPES,
} from '@petrolord/engines/engines/drilling/data/completionEquipment.js';
import { CASING_CATALOG, TUBING_CATALOG } from '@petrolord/engines/engines/drilling/data/tubulars.js';

export {
  apiDriftM, buildStack, casingProgramProfile, governingDriftTo, runInClearance,
  throughBoreProfile, completionVolumes, sealSpaceOut,
  DRIFT_DEDUCTION_TUBING_M, DRIFT_DEDUCTION_CASING_SMALL_M,
  DRIFT_DEDUCTION_CASING_MID_M, DRIFT_DEDUCTION_CASING_LARGE_M,
  EQUIPMENT_CATALOG, PACKERS, NIPPLE_BORES_IN, EUE_COUPLING_OD_IN, EQUIPMENT_TYPES,
  CASING_CATALOG, TUBING_CATALOG,
};

export const IN = 0.0254;
export const GOLDEN = cases;
export const TUBULAR_GOLDEN = tubularCases;

// ---------------------------------------------------------------------------
// API 5CT drift.
// ---------------------------------------------------------------------------

export const ALL_TUBULARS = [
  ...CASING_CATALOG.map((r) => ({ ...r, kind: 'casing' })),
  ...TUBING_CATALOG.map((r) => ({ ...r, kind: 'tubing' })),
];

export const driftRow = (row) => {
  const driftM = apiDriftM({ odM: row.odM, idM: row.idM, kind: row.kind });
  return {
    kind: row.kind, odIn: row.odIn, weightLbFt: row.weightLbFt, designation: row.designation,
    idM: row.idM, driftM, driftIn: driftM / IN,
    deductionM: row.idM - driftM, deductionIn: (row.idM - driftM) / IN,
  };
};

export const driftTable = () => ALL_TUBULARS.map(driftRow);

// The deduction is a property of the OUTSIDE diameter and the kind, and of
// nothing else: four classes over the whole catalog.
export const driftClasses = () => {
  const out = {};
  for (const r of driftTable()) {
    const k = r.deductionIn.toFixed(5);
    (out[k] ||= []).push(`${r.odIn}/${r.weightLbFt}`);
  }
  return out;
};

// ---------------------------------------------------------------------------
// The published completion.
// ---------------------------------------------------------------------------

export const PUBLISHED = {
  hangerMdM: cases.stack.hangerMdM,
  components: cases.stack.components,
  program: cases.program,
  packerMdM: cases.packerMdM,
  tdMdM: cases.tdMdM,
  warnMarginM: cases.warnMarginM,
};

export const publishedStack = () => buildStack({
  hangerMdM: PUBLISHED.hangerMdM, components: PUBLISHED.components,
});
export const publishedProfile = () => casingProgramProfile(PUBLISHED.program.strings);

export const publishedClearance = (warnMarginM = PUBLISHED.warnMarginM) => runInClearance({
  stack: publishedStack(), profile: publishedProfile(), warnMarginM,
});
export const publishedThroughBore = () => throughBoreProfile(publishedStack());
export const publishedVolumes = () => completionVolumes({
  stack: publishedStack(), profile: publishedProfile(),
  packerMdM: PUBLISHED.packerMdM, tdMdM: PUBLISHED.tdMdM,
});

// The rows sorted by how tight they actually are, which is not the order the
// tally is in and was not what the engine's `worst` field used to report.
export const clearanceByTightness = (rows) => [...rows].sort((a, b) => a.clearanceM - b.clearanceM);

// How many metres of string each through-bore restriction actually governs.
// A cumulative minimum names the EXTREME; this names the EXTENT.
export const throughBoreExtent = (stack, tb) => {
  const out = {};
  tb.rows.forEach((r, i) => {
    out[r.controlling] = (out[r.controlling] || 0) + stack.components[i].lengthM;
  });
  return out;
};

// ---------------------------------------------------------------------------
// Which jewelry fits which casing.
// ---------------------------------------------------------------------------

export const fitCheck = (tubingOdIn, casingOdIn, casingWeightLbFt) => {
  const row = CASING_CATALOG.find((x) => x.odIn === casingOdIn && x.weightLbFt === casingWeightLbFt);
  if (!row) throw new Error(`No casing row ${casingOdIn}" ${casingWeightLbFt}#.`);
  const driftM = apiDriftM({ odM: row.odM, idM: row.idM, kind: 'casing' });
  const kit = EQUIPMENT_CATALOG.filter((r) => r.forTubingOdIn === tubingOdIn);
  const fails = kit.filter((r) => r.odM >= driftM);
  return {
    tubingOdIn, casingOdIn, casingWeightLbFt,
    casing: `${casingOdIn}/${casingWeightLbFt}`, driftM, driftIn: driftM / IN,
    kitSize: kit.length, failCount: fails.length, fails: fails.map((r) => r.type),
    tightestM: kit.reduce((a, r) => Math.min(a, driftM - r.odM), Infinity),
  };
};

export const FIT_TUBING_SIZES = [2.375, 2.875, 3.5, 4.5];
export const FIT_CASINGS = [[9.625, 47], [9.625, 53.5], [7, 26], [7, 29], [7, 32], [5.5, 20], [5.5, 23]];
export const fitMatrix = () => FIT_TUBING_SIZES.flatMap(
  (t) => FIT_CASINGS.map(([od, w]) => fitCheck(t, od, w)),
);

// ---------------------------------------------------------------------------
// Seal space-out.
// ---------------------------------------------------------------------------

// The travel a landing divides. available(up) + available(down) is the PBR
// length at EVERY insertion, so the insertion depth splits a fixed budget and
// never creates any.
export const spaceOutAt = (pbrLengthM, insertLengthM, dlUpM, dlDownM, marginM = 0.5) => {
  const up = sealSpaceOut({ pbrLengthM, insertLengthM, expectedDLM: dlUpM, marginM });
  const down = sealSpaceOut({ pbrLengthM, insertLengthM, expectedDLM: dlDownM, marginM });
  return {
    insertLengthM, up, down,
    budgetM: up.availableM + down.availableM,
    bothPass: up.status === 'PASS' && down.status === 'PASS',
  };
};

export const spaceOutSweep = (pbrLengthM, dlUpM, dlDownM, marginM = 0.5, steps = 20) => {
  const rows = [];
  for (let k = 0; k <= steps; k += 1) {
    rows.push(spaceOutAt(pbrLengthM, (k / steps) * pbrLengthM, dlUpM, dlDownM, marginM));
  }
  return rows;
};

// The band of insertions at which BOTH extremes pass, found by bisecting the
// engine from each end rather than by solving the inequality.
export const spaceOutBand = (pbrLengthM, dlUpM, dlDownM, marginM = 0.5) => {
  const ok = (ins) => spaceOutAt(pbrLengthM, ins, dlUpM, dlDownM, marginM).bothPass;
  let seed = null;
  for (let k = 0; k <= 2000; k += 1) {
    const x = (k / 2000) * pbrLengthM;
    if (ok(x)) { seed = x; break; }
  }
  if (seed === null) return { loM: null, hiM: null, widthM: null, midM: null, open: false };
  let a = 0; let b = seed;
  for (let k = 0; k < 100; k += 1) { const m = (a + b) / 2; if (ok(m)) b = m; else a = m; }
  const loM = b;
  let c = seed; let d = pbrLengthM;
  for (let k = 0; k < 100; k += 1) { const m = (c + d) / 2; if (ok(m)) c = m; else d = m; }
  const hiM = c;
  return { loM, hiM, widthM: hiM - loM, midM: (loM + hiM) / 2, open: true };
};

// The shortest PBR for which SOME insertion satisfies both extremes, by a
// nested bisection: for each length find the smallest insertion the
// contraction case accepts, then test the elongation case exactly there.
export const minPbrLength = (dlUpM, dlDownM, marginM = 0.5) => {
  const feasible = (L) => {
    const dnOk = (ins) => sealSpaceOut({
      pbrLengthM: L, insertLengthM: ins, expectedDLM: dlDownM, marginM,
    }).status === 'PASS';
    if (!dnOk(L)) return false;
    let a = 0; let b = L;
    for (let k = 0; k < 100; k += 1) { const m = (a + b) / 2; if (dnOk(m)) b = m; else a = m; }
    return sealSpaceOut({
      pbrLengthM: L, insertLengthM: b, expectedDLM: dlUpM, marginM,
    }).status === 'PASS';
  };
  let a = 0.01; let b = 40;
  if (!feasible(b)) return null;
  for (let k = 0; k < 100; k += 1) { const m = (a + b) / 2; if (feasible(m)) b = m; else a = m; }
  return b;
};

// The three length changes the Casing and Tubing course computed for its own
// tubing string, which are what a space-out is actually designed against.
export const dr6LengthChanges = () => tubularCases.tubing.map((t) => ({
  name: t.name,
  dLM: t.result.lengthChanges.totalM,
  strokeOkAt1p5M: t.result.packer.strokeOk,
}));

export const dr6SpaceOut = (pbrLengthM = 6.1, marginM = 0.5) => {
  const cs = dr6LengthChanges();
  const up = Math.max(...cs.map((c) => c.dLM), 0);
  const down = Math.min(...cs.map((c) => c.dLM), 0);
  const band = spaceOutBand(pbrLengthM, up, down, marginM);
  return {
    cases: cs, maxUpM: up, maxDownM: down, swingM: up - down,
    minPbrM: minPbrLength(up, down, marginM), band,
    atMid: band.open ? cs.map((c) => ({
      name: c.name,
      ...sealSpaceOut({ pbrLengthM, insertLengthM: band.midM, expectedDLM: c.dLM, marginM }),
    })) : null,
  };
};

// ---------------------------------------------------------------------------
// Verification against the published oracle.
// ---------------------------------------------------------------------------

export const oracleCheck = () => {
  let worst = 0;
  let at = null;
  let checked = 0;
  const cmp = (got, want, what) => {
    if (want == null || !Number.isFinite(got) || !Number.isFinite(want)) return;
    checked += 1;
    const rel = Math.abs(got - want) / Math.abs(want || 1);
    if (rel > worst) { worst = rel; at = { what, got, want }; }
  };
  for (const row of cases.driftTable) {
    cmp(apiDriftM({ odM: row.odIn * IN, idM: row.idIn * IN, kind: row.kind }) / IN,
      row.driftIn, `drift.${row.odIn}/${row.idIn}`);
  }
  const stack = publishedStack();
  cmp(stack.bottomMdM, cases.results.bottomMdM, 'bottomMdM');
  cases.results.stackRows.forEach((r, i) => {
    cmp(stack.components[i].topMdM, r.topMdM, `stack.${i}.top`);
    cmp(stack.components[i].bottomMdM, r.bottomMdM, `stack.${i}.bottom`);
  });
  const profile = publishedProfile();
  cases.results.profile.forEach((s, i) => {
    cmp(profile[i].idM, s.idM, `profile.${i}.id`);
    cmp(profile[i].driftM, s.driftM, `profile.${i}.drift`);
  });
  const cl = publishedClearance();
  cases.results.clearance.forEach((r, i) => {
    cmp(cl.rows[i].clearanceM, r.clearanceM, `clearance.${i}`);
    cmp(cl.rows[i].governingDriftM, r.governingDriftM, `governing.${i}`);
  });
  cmp(cl.worst.clearanceM, cases.results.clearanceWorst.clearanceM, 'clearanceWorst');
  const tb = publishedThroughBore();
  cmp(tb.minIdM, cases.results.throughBore.minIdM, 'throughBore.min');
  const v = publishedVolumes();
  for (const k of ['stringCapacityM3', 'stringDisplacementM3', 'annulusAbovePackerM3', 'belowPackerM3']) {
    cmp(v[k], cases.results.volumes[k], `volumes.${k}`);
  }
  for (const c of cases.results.spaceOut) {
    const r = sealSpaceOut({
      pbrLengthM: c.pbrLengthM, insertLengthM: c.insertLengthM,
      expectedDLM: c.expectedDLM, marginM: c.marginM,
    });
    cmp(r.availableM, c.result.availableM, `spaceOut.${c.name}.available`);
    cmp(r.remainingM, c.result.remainingM, `spaceOut.${c.name}.remaining`);
  }
  return { checked, worstRel: worst, at };
};

// ---------------------------------------------------------------------------
// The capstone: a 2-7/8 inch string in a heavier program.
// ---------------------------------------------------------------------------

const CAP_T = { od: 3.668 * IN, id: 2.441 * IN };
const CAP_X = 2.313 * IN;
const CAP_XN = 2.205 * IN;

export const CAPSTONE = {
  hangerMdM: 0,
  tdMdM: 2900,
  warnMarginM: 0.003,
  pbrLengthM: 5.35,
  insertLengthM: 2.28,
  dlUpM: 0.65,
  dlDownM: -3.15,
  marginM: 0.4,
  program: {
    strings: [
      { name: '13-3/8in surface casing', sections: [{ topMdM: 0, bottomMdM: 400, odM: 13.375 * IN, idM: 12.415 * IN }] },
      { name: '9-5/8in production casing', sections: [{ topMdM: 0, bottomMdM: 2200, odM: 9.625 * IN, idM: 8.535 * IN }] },
      { name: '7in liner', sections: [{ topMdM: 2000, bottomMdM: 2900, odM: 7 * IN, idM: 6.094 * IN }] },
    ],
  },
  components: [
    { type: 'tubing', name: 'Tubing 2-7/8" EUE', lengthM: 180, odM: CAP_T.od, idM: CAP_T.id },
    { type: 'flow-coupling', name: 'Flow coupling 2-7/8"', lengthM: 0.9, odM: CAP_T.od, idM: CAP_T.id },
    { type: 'sssv', name: 'TRSV safety valve 2-7/8"', lengthM: 2.2, odM: 5.25 * IN, idM: CAP_X },
    { type: 'flow-coupling', name: 'Flow coupling 2-7/8"', lengthM: 0.9, odM: CAP_T.od, idM: CAP_T.id },
    { type: 'tubing', name: 'Tubing 2-7/8" EUE', lengthM: 2100, odM: CAP_T.od, idM: CAP_T.id },
    { type: 'blast-joint', name: 'Blast joint 2-7/8"', lengthM: 6.1, odM: CAP_T.od, idM: CAP_T.id },
    { type: 'spm', name: 'Side pocket mandrel 2-7/8"', lengthM: 2.4, odM: 5.0 * IN, idM: CAP_T.id },
    { type: 'tubing', name: 'Tubing 2-7/8" EUE', lengthM: 300, odM: CAP_T.od, idM: CAP_T.id },
    { type: 'nipple-x', name: 'X landing nipple 2-7/8"', lengthM: 0.4, odM: CAP_T.od, idM: CAP_X },
    { type: 'packer', name: 'Production packer 7" casing', lengthM: 1.5, odM: 5.875 * IN, idM: 2.75 * IN },
    { type: 'tubing', name: 'Tubing 2-7/8" EUE', lengthM: 2.5, odM: CAP_T.od, idM: CAP_T.id },
    { type: 'nipple-xn', name: 'XN no-go nipple 2-7/8"', lengthM: 0.45, odM: CAP_T.od, idM: CAP_XN },
    { type: 'perforated-joint', name: 'Perforated joint 2-7/8"', lengthM: 3.0, odM: 2.875 * IN, idM: CAP_T.id },
    { type: 'weg', name: 'Wireline entry guide 2-7/8"', lengthM: 0.3, odM: CAP_T.od, idM: CAP_T.id },
  ],
};

export const capstoneStack = () => buildStack({
  hangerMdM: CAPSTONE.hangerMdM, components: CAPSTONE.components,
});
export const capstoneProfile = () => casingProgramProfile(CAPSTONE.program.strings);
export const capstonePackerBottomMdM = () => capstoneStack().components.find((c) => c.type === 'packer').bottomMdM;
export const capstoneClearance = () => runInClearance({
  stack: capstoneStack(), profile: capstoneProfile(), warnMarginM: CAPSTONE.warnMarginM,
});
export const capstoneThroughBore = () => throughBoreProfile(capstoneStack());
export const capstoneVolumes = () => completionVolumes({
  stack: capstoneStack(), profile: capstoneProfile(),
  packerMdM: capstonePackerBottomMdM(), tdMdM: CAPSTONE.tdMdM,
});
export const capstoneSpaceOut = () => spaceOutAt(
  CAPSTONE.pbrLengthM, CAPSTONE.insertLengthM, CAPSTONE.dlUpM, CAPSTONE.dlDownM, CAPSTONE.marginM,
);
export const capstoneBand = () => spaceOutBand(
  CAPSTONE.pbrLengthM, CAPSTONE.dlUpM, CAPSTONE.dlDownM, CAPSTONE.marginM,
);

export const capstoneValues = () => {
  const stack = capstoneStack();
  const cl = capstoneClearance();
  const tb = capstoneThroughBore();
  const v = capstoneVolumes();
  const so = capstoneSpaceOut();
  const spm = cl.rows.find((r) => r.type === 'spm');
  const packerIdx = stack.components.findIndex((c) => c.type === 'packer');
  return {
    bottom_md_m: stack.bottomMdM,
    packer_bottom_md_m: capstonePackerBottomMdM(),
    drift_liner_m: apiDriftM({ odM: 7 * IN, idM: 6.094 * IN, kind: 'casing' }),
    drift_surface_casing_m: apiDriftM({ odM: 13.375 * IN, idM: 12.415 * IN, kind: 'casing' }),
    string_capacity_m3: v.stringCapacityM3,
    string_displacement_m3: v.stringDisplacementM3,
    worst_clearance_m: cl.worst.clearanceM,
    spm_clearance_m: spm.clearanceM,
    through_bore_min_id_m: tb.minIdM,
    through_bore_at_packer_id_m: tb.rows[packerIdx].cumMinIdM,
    annulus_above_packer_m3: v.annulusAbovePackerM3,
    below_packer_m3: v.belowPackerM3,
    available_elongation_m: so.up.availableM,
    available_contraction_m: so.down.availableM,
    remaining_elongation_m: so.up.remainingM,
    remaining_contraction_m: so.down.remainingM,
    min_insertion_both_pass_m: capstoneBand().loM,
    min_pbr_length_m: minPbrLength(CAPSTONE.dlUpM, CAPSTONE.dlDownM, CAPSTONE.marginM),
  };
};
