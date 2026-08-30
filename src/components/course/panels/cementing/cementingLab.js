// Cementing teaching lab for the DR7 course (app 'cementing'). Pure functions
// over the vendored engines/drilling cementing module and its goldens; every
// exported value is pinned by cementingLab.test.js.
//
// One wellbore, two wells, two programmes and one closed-form vertical
// fixture. The LESSONS cement the 7 inch production casing on the published
// slant and horizontal wells. The CAPSTONE cements the 9-5/8 inch INTERMEDIATE
// string one hole section up on the same slant trajectory, on its own hole
// sizes, TOC, excess, fluid densities, rheologies, pump rate and centralizer,
// so no graded value is a number a lesson prints and none of them is a number
// the goldens publish either.

import cases from '@petrolord/engines/test-data/drilling/goldens/cementing_cases.json';

import {
  annulusRows, jobVolumes, fluidIntervals, segmentsForLeg, simulatePlacement,
  standoffProfile, requiredSpacing, placementChecklist, API_TARGET_STANDOFF,
} from '@petrolord/engines/engines/drilling/cementing.js';
import { fitModels } from '@petrolord/engines/engines/drilling/rheology.js';
import { tvdAt } from '@petrolord/engines/engines/drilling/wellControl.js';
import { stringProperties } from '@petrolord/engines/engines/drilling/torqueDrag.js';

export {
  annulusRows, jobVolumes, fluidIntervals, segmentsForLeg, simulatePlacement,
  standoffProfile, requiredSpacing, placementChecklist, API_TARGET_STANDOFF,
  fitModels, tvdAt, stringProperties,
};

export const G = 9.80665;
export const STEEL_DENSITY_KGM3 = 7850;
export const GOLDEN = cases;

export const hb = (fann) => fitModels(fann).herschelBulkley;
export const buoyancyFactor = (mudKgM3) => 1 - mudKgM3 / STEEL_DENSITY_KGM3;

// ---------------------------------------------------------------------------
// The two published wells.
// ---------------------------------------------------------------------------

export const WELLS = cases.cases.map((c) => c.well);
export const caseOf = (well = 'slant') => {
  const c = cases.cases.find((x) => x.well === well);
  if (!c) throw new Error(`Unknown cementing case '${well}'.`);
  return c;
};

// The published fluid densities, which are a programme choice rather than an
// engine constant, so they live here where a lesson can point at them.
export const PUBLISHED_FLUIDS = {
  mudKgM3: 1440, spacerKgM3: 1500, spacerVolM3: 4, leadKgM3: 1560, tailKgM3: 1900,
};

export const volumesFor = (well = 'slant', over = {}) => {
  const c = caseOf(well);
  return jobVolumes({
    stations: c.stations,
    holeSections: c.holeSections,
    casing: c.casing,
    tocMd: over.tocMd ?? c.tocMd,
    excessOpenHolePct: over.excessOpenHolePct ?? c.excessOpenHolePct,
    spacerVolM3: over.spacerVolM3 ?? PUBLISHED_FLUIDS.spacerVolM3,
    slurryYieldM3PerSack: over.slurryYieldM3PerSack ?? c.slurryYieldM3PerSack,
    leadTailSplitMd: over.leadTailSplitMd ?? c.leadTailSplitMd,
    pumpRateM3s: over.pumpRateM3s ?? c.pumpRateM3s,
  });
};

// The measured depth of the deepest cased section, which is the shoe the ECD
// is reported against.
export const previousShoeMdOf = (well = 'slant') => {
  const cased = caseOf(well).holeSections.filter((s) => s.cased);
  return cased.length ? Math.max(...cased.map((s) => s.to_md_m)) : null;
};

export const PROGRAMS = ['lead_tail', 'neat'];

// The two fluid programmes the course compares. `neat` pumps one slurry at the
// tail density for the whole job; `lead_tail` puts a lighter lead across the
// cased annulus and keeps the heavy tail for the open hole.
export const programFor = (well = 'slant', program = 'lead_tail', over = {}) => {
  const c = caseOf(well);
  const v = volumesFor(well, over);
  const f = { ...PUBLISHED_FLUIDS, ...over };
  if (program === 'neat') {
    return [
      { kind: 'tail', densityKgM3: f.tailKgM3, volumeM3: v.slurryM3, rheology: hb(c.tailFann) },
      { kind: 'displacement', densityKgM3: f.mudKgM3, volumeM3: v.displacementM3, rheology: hb(c.mudFann) },
    ];
  }
  if (program === 'lead_tail') {
    return [
      { kind: 'spacer', densityKgM3: f.spacerKgM3, volumeM3: f.spacerVolM3, rheology: hb(c.spacerFann) },
      { kind: 'lead', densityKgM3: f.leadKgM3, volumeM3: v.leadM3, rheology: hb(c.leadFann) },
      { kind: 'tail', densityKgM3: f.tailKgM3, volumeM3: v.tailM3, rheology: hb(c.tailFann) },
      { kind: 'displacement', densityKgM3: f.mudKgM3, volumeM3: v.displacementM3, rheology: hb(c.mudFann) },
    ];
  }
  throw new Error(`Unknown programme '${program}'.`);
};

export const mudFor = (well = 'slant', over = {}) => ({
  kind: 'mud',
  densityKgM3: over.mudKgM3 ?? PUBLISHED_FLUIDS.mudKgM3,
  rheology: hb(caseOf(well).mudFann),
});

export const placementFor = (well = 'slant', program = 'lead_tail', over = {}) => {
  const c = caseOf(well);
  return simulatePlacement({
    stations: c.stations,
    holeSections: c.holeSections,
    casing: c.casing,
    mudInHole: mudFor(well, over),
    fluids: programFor(well, program, over),
    pumpRateM3s: over.pumpRateM3s ?? c.pumpRateM3s,
    tocMd: over.tocMd ?? c.tocMd,
    excessOpenHolePct: over.excessOpenHolePct ?? c.excessOpenHolePct,
    steps: over.steps ?? 60,
  });
};

// ---------------------------------------------------------------------------
// The rate window: the two edges, bisected rather than read off a sweep.
// ---------------------------------------------------------------------------

// The smallest pump rate at which the job does not free fall anywhere, or null
// if it free falls at every rate the search covers.
export const minRateNoFreeFall = (run, { lo = 0.0005, hi = 0.3, iters = 80 } = {}) => {
  if (run(hi).freeFall) return null;
  let a = lo; let b = hi;
  for (let k = 0; k < iters; k += 1) {
    const m = (a + b) / 2;
    if (run(m).freeFall) a = m; else b = m;
  }
  return b;
};

// The largest pump rate at which the peak ECD at the previous shoe stays at or
// below a stated limit, or null if even the slowest rate is already over it.
export const maxRateUnderEcd = (run, limitKgM3, { lo = 0.0005, hi = 0.3, iters = 80 } = {}) => {
  if ((run(lo).maxEcdPrevShoeKgM3 ?? 0) > limitKgM3) return null;
  let a = lo; let b = hi;
  for (let k = 0; k < iters; k += 1) {
    const m = (a + b) / 2;
    if ((run(m).maxEcdPrevShoeKgM3 ?? 0) <= limitKgM3) a = m; else b = m;
  }
  return a;
};

// Both edges and their difference for one well and one programme. A NEGATIVE
// width means no pump rate satisfies both constraints at once.
export const rateWindow = (well = 'slant', program = 'lead_tail', limitKgM3 = 1700, over = {}) => {
  const run = (q) => placementFor(well, program, { ...over, pumpRateM3s: q });
  const minRate = minRateNoFreeFall(run);
  const maxRate = maxRateUnderEcd(run, limitKgM3);
  return {
    well,
    program,
    limitKgM3,
    minRateNoFreeFallM3s: minRate,
    maxRateUnderEcdM3s: maxRate,
    widthM3s: (minRate != null && maxRate != null) ? maxRate - minRate : null,
    open: minRate != null && maxRate != null && maxRate > minRate,
  };
};

export const rateSweep = (well = 'slant', program = 'lead_tail', rates = [
  0.005, 0.0075, 0.01, 0.015, 0.02, 0.025, 0.03, 0.04, 0.05,
]) => rates.map((q) => {
  const r = placementFor(well, program, { pumpRateM3s: q });
  return {
    pumpRateM3s: q,
    freeFall: r.freeFall,
    freeFallSteps: r.series.filter((s) => s.freeFall).length,
    worstUTubePa: r.series.reduce((a, s) => Math.min(a, s.uTubePa), Infinity),
    endPumpPressurePa: r.endPumpPressurePa,
    maxEcdPrevShoeKgM3: r.maxEcdPrevShoeKgM3,
  };
});

// ---------------------------------------------------------------------------
// Centralization.
// ---------------------------------------------------------------------------

export const standoffFor = (well = 'slant', over = {}) => {
  const c = caseOf(well);
  const so = standoffProfile({
    stations: c.stations,
    holeSections: c.holeSections,
    casing: c.casing,
    mudDensityKgM3: over.mudDensityKgM3 ?? PUBLISHED_FLUIDS.mudKgM3,
    centralizer: { ...c.centralizer, ...(over.centralizer ?? {}) },
  });
  let minRow = so.rows[0];
  for (const r of so.rows) if (r.standoff < minRow.standoff) minRow = r;
  return { ...so, minRow, bindingTerm: minRow.standoffMidSpan <= minRow.standoffAtCentralizer ? 'mid-span sag' : 'centralizer deflection' };
};

export const requiredSpacingFor = (well = 'slant', over = {}) => {
  const c = caseOf(well);
  return requiredSpacing({
    stations: c.stations,
    holeSections: c.holeSections,
    casing: c.casing,
    mudDensityKgM3: over.mudDensityKgM3 ?? PUBLISHED_FLUIDS.mudKgM3,
    centralizer: { ...c.centralizer, ...(over.centralizer ?? {}) },
    targetStandoff: over.targetStandoff ?? API_TARGET_STANDOFF,
  });
};

export const spacingSweep = (well = 'slant', spacings = [6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 25, 30]) => spacings
  .map((s) => ({ spacingM: s, minStandoff: standoffFor(well, { centralizer: { spacingM: s } }).minStandoff }));

// The spring rate a bow spring is modelled with: the restoring force divided
// by the deflection at which it is quoted, which is (1 - 0.67) of the
// clearance. The clearance is the NOMINAL one, because standoffProfile runs
// annulusRows with zero excess.
export const springRate = (well = 'slant', over = {}) => {
  const c = caseOf(well);
  const cent = { ...c.centralizer, ...(over.centralizer ?? {}) };
  const rows = annulusRows({ holeSections: c.holeSections, casing: c.casing, excessOpenHolePct: 0 });
  const row = over.openHole === false ? rows.find((r) => !r.openHole) : rows.find((r) => r.openHole);
  const clearanceM = (row.boreIdEffM - c.casing.odM) / 2;
  const target = cent.standoffAtRestoringForce ?? API_TARGET_STANDOFF;
  return { clearanceM, kNPerM: cent.restoringForceN / ((1 - target) * clearanceM) };
};

// The clearance the VOLUME side uses and the clearance the STANDOFF side uses
// are different in an open hole with excess, and the difference is the excess.
export const clearances = (well = 'slant', over = {}) => {
  const c = caseOf(well);
  const ex = over.excessOpenHolePct ?? c.excessOpenHolePct;
  const withExcess = annulusRows({ holeSections: c.holeSections, casing: c.casing, excessOpenHolePct: ex });
  const nominal = annulusRows({ holeSections: c.holeSections, casing: c.casing, excessOpenHolePct: 0 });
  const oh = (rows) => rows.find((r) => r.openHole);
  return {
    excessOpenHolePct: ex,
    nominalBoreM: oh(nominal).boreIdEffM,
    effectiveBoreM: oh(withExcess).boreIdEffM,
    nominalClearanceM: (oh(nominal).boreIdEffM - c.casing.odM) / 2,
    effectiveClearanceM: (oh(withExcess).boreIdEffM - c.casing.odM) / 2,
  };
};

export const checklistFor = (well = 'slant', program = 'lead_tail', over = {}) => {
  const c = caseOf(well);
  return placementChecklist({
    placement: placementFor(well, program, over),
    standoff: standoffFor(well, over),
    mudInHole: mudFor(well, over),
    fluids: programFor(well, program, over),
    pumpRateM3s: over.pumpRateM3s ?? c.pumpRateM3s,
    annulusRowsList: volumesFor(well, over).annulusRows,
  });
};

export const annularVelocities = (well = 'slant', over = {}) => {
  const c = caseOf(well);
  const q = over.pumpRateM3s ?? c.pumpRateM3s;
  return volumesFor(well, over).annulusRows.map((r) => ({
    fromMd: r.fromMd, toMd: r.toMd, openHole: r.openHole, vMs: q / r.capM2,
  }));
};

// ---------------------------------------------------------------------------
// The vertical closed-form fixture, which a third party can check by hand.
// ---------------------------------------------------------------------------

export const VERTICAL = cases.verticalFixture;

export const verticalCheck = () => {
  const FX = VERTICAL;
  const capInside = (Math.PI / 4) * FX.casing.idM * FX.casing.idM;
  const volumes = jobVolumes({
    stations: FX.stations, holeSections: FX.holeSections, casing: FX.casing,
    tocMd: FX.tocMd, excessOpenHolePct: 0, spacerVolM3: 3,
  });
  const placement = simulatePlacement({
    stations: FX.stations, holeSections: FX.holeSections, casing: FX.casing,
    mudInHole: FX.mudInHole, fluids: FX.fluids, pumpRateM3s: FX.pumpRateM3s, tocMd: FX.tocMd,
  });
  return {
    capInside,
    volumes,
    placement,
    // With no rheology on any fluid the friction term is identically zero, so
    // the end pump pressure IS the float differential.
    closedDisplacementM3: capInside * (FX.casing.floatCollarMd - 0),
    closedShoeTrackM3: capInside * (FX.casing.shoeMd - FX.casing.floatCollarMd),
    frictionFree: Math.abs(placement.endPumpPressurePa - placement.floatDiffPa) < 1e-6,
    endLessFloatPa: placement.endPumpPressurePa - placement.floatDiffPa,
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
  for (const c of cases.cases) {
    const v = volumesFor(c.well);
    for (const k of ['annularSlurryM3', 'shoeTrackM3', 'slurryM3', 'leadM3', 'tailM3',
      'displacementM3', 'sacks', 'jobTimeS', 'tvdShoeM', 'tvdTocM']) {
      cmp(v[k], c.expected.volumes[k], `${c.well}.${k}`);
    }
    for (const p of PROGRAMS) {
      const r = placementFor(c.well, p);
      const e = c.expected.programs[p];
      cmp(r.endPumpPressurePa, e.endPumpPressurePa, `${c.well}.${p}.endP`);
      cmp(r.achievedTocMd, e.achievedTocMd, `${c.well}.${p}.toc`);
      cmp(r.floatDiffPa, e.floatDiffPa, `${c.well}.${p}.floatDiff`);
      cmp(r.maxEcdPrevShoeKgM3, e.maxEcdPrevShoeKgM3, `${c.well}.${p}.maxEcd`);
      for (const cp of e.checkpoints) {
        const row = r.series.find((s) => Math.abs(s.pumpedM3 - cp.pumpedM3) < 1e-6);
        if (!row) continue;
        cmp(row.pumpPressurePa, cp.pumpPressurePa, `${c.well}.${p}.p@${cp.pumpedM3}`);
        cmp(row.ecdPrevShoeKgM3, cp.ecdPrevShoeKgM3, `${c.well}.${p}.ecd@${cp.pumpedM3}`);
      }
    }
    cmp(standoffFor(c.well).minStandoff, c.expected.standoff.minStandoff, `${c.well}.minStandoff`);
    cmp(requiredSpacingFor(c.well), c.expected.requiredSpacingM, `${c.well}.requiredSpacing`);
  }
  const fx = verticalCheck();
  cmp(fx.placement.endPumpPressurePa, VERTICAL.placement.endPumpPressurePa, 'vertical.endP');
  cmp(fx.placement.floatDiffPa, VERTICAL.placement.floatDiffPa, 'vertical.floatDiff');
  cmp(fx.volumes.slurryM3, VERTICAL.volumes.slurryM3, 'vertical.slurry');
  return { checked, worstRel: worst, at };
};

// ---------------------------------------------------------------------------
// The capstone: the 9-5/8 inch intermediate string, one hole section up.
// ---------------------------------------------------------------------------

export const CAPSTONE = {
  well: 'slant',
  casing: {
    odM: 0.244475, idM: 0.2204974, weightKgM: 69.9437033,
    shoeMd: 1400, floatCollarMd: 1352, hangerMd: 0,
  },
  holeSections: [
    { cased: true, from_md_m: 0, to_md_m: 350, casing_id_m: 0.315341, hole_id_m: 0.4445 },
    { cased: false, from_md_m: 350, to_md_m: 1400, hole_id_m: 0.31115 },
  ],
  tocMd: 250,
  excessOpenHolePct: 30,
  spacerVolM3: 6,
  slurryYieldM3PerSack: 0.0402,
  leadTailSplitMd: 350,
  pumpRateM3s: 0.028,
  mudKgM3: 1400,
  spacerKgM3: 1520,
  leadKgM3: 1580,
  tailKgM3: 1920,
  standoffMudKgM3: 1300,
  centralizer: { type: 'bow', spacingM: 10.5, restoringForceN: 11000, standoffAtRestoringForce: 0.67 },
  rigidBladeOdM: 0.29,
  ecdLimitKgM3: 1600,
  fann: {
    mud: { theta600: 72, theta300: 44, theta6: 8, theta3: 7 },
    spacer: { theta600: 46, theta300: 28, theta6: 5, theta3: 4 },
    lead: { theta600: 90, theta300: 56, theta6: 12, theta3: 9 },
    tail: { theta600: 124, theta300: 78, theta6: 17, theta3: 14 },
  },
};

export const capstoneStations = () => caseOf(CAPSTONE.well).stations;

export const capstoneVolumes = () => jobVolumes({
  stations: capstoneStations(),
  holeSections: CAPSTONE.holeSections,
  casing: CAPSTONE.casing,
  tocMd: CAPSTONE.tocMd,
  excessOpenHolePct: CAPSTONE.excessOpenHolePct,
  spacerVolM3: CAPSTONE.spacerVolM3,
  slurryYieldM3PerSack: CAPSTONE.slurryYieldM3PerSack,
  leadTailSplitMd: CAPSTONE.leadTailSplitMd,
  pumpRateM3s: CAPSTONE.pumpRateM3s,
});

export const capstoneFluids = () => {
  const v = capstoneVolumes();
  return [
    { kind: 'spacer', densityKgM3: CAPSTONE.spacerKgM3, volumeM3: CAPSTONE.spacerVolM3, rheology: hb(CAPSTONE.fann.spacer) },
    { kind: 'lead', densityKgM3: CAPSTONE.leadKgM3, volumeM3: v.leadM3, rheology: hb(CAPSTONE.fann.lead) },
    { kind: 'tail', densityKgM3: CAPSTONE.tailKgM3, volumeM3: v.tailM3, rheology: hb(CAPSTONE.fann.tail) },
    { kind: 'displacement', densityKgM3: CAPSTONE.mudKgM3, volumeM3: v.displacementM3, rheology: hb(CAPSTONE.fann.mud) },
  ];
};

export const capstonePlacement = (pumpRateM3s = CAPSTONE.pumpRateM3s) => simulatePlacement({
  stations: capstoneStations(),
  holeSections: CAPSTONE.holeSections,
  casing: CAPSTONE.casing,
  mudInHole: { kind: 'mud', densityKgM3: CAPSTONE.mudKgM3, rheology: hb(CAPSTONE.fann.mud) },
  fluids: capstoneFluids(),
  pumpRateM3s,
  tocMd: CAPSTONE.tocMd,
  excessOpenHolePct: CAPSTONE.excessOpenHolePct,
});

export const capstoneStandoff = (over = {}) => {
  const so = standoffProfile({
    stations: capstoneStations(),
    holeSections: CAPSTONE.holeSections,
    casing: CAPSTONE.casing,
    mudDensityKgM3: CAPSTONE.standoffMudKgM3,
    centralizer: { ...CAPSTONE.centralizer, ...over },
  });
  let minRow = so.rows[0];
  for (const r of so.rows) if (r.standoff < minRow.standoff) minRow = r;
  return { ...so, minRow };
};

export const capstoneRateWindow = () => {
  const run = (q) => capstonePlacement(q);
  const minRate = minRateNoFreeFall(run);
  const maxRate = maxRateUnderEcd(run, CAPSTONE.ecdLimitKgM3);
  return {
    minRateNoFreeFallM3s: minRate,
    maxRateUnderEcdM3s: maxRate,
    widthM3s: (minRate != null && maxRate != null) ? maxRate - minRate : null,
    open: minRate != null && maxRate != null && maxRate > minRate,
  };
};

export const capstoneValues = () => {
  const v = capstoneVolumes();
  const p = capstonePlacement();
  const w = capstoneRateWindow();
  const so = capstoneStandoff();
  const rigid = capstoneStandoff({ type: 'rigid', bladeOdM: CAPSTONE.rigidBladeOdM });
  const nominal = annulusRows({
    holeSections: CAPSTONE.holeSections, casing: CAPSTONE.casing, excessOpenHolePct: 0,
  }).find((r) => r.openHole);
  const clearanceNominal = (nominal.boreIdEffM - CAPSTONE.casing.odM) / 2;
  const oh = v.annulusRows.find((r) => r.openHole);
  return {
    annulus_slurry_m3: v.annularSlurryM3,
    shoe_track_m3: v.shoeTrackM3,
    slurry_m3: v.slurryM3,
    displacement_m3: v.displacementM3,
    sacks: v.sacks,
    open_hole_effective_bore_m: oh.boreIdEffM,
    end_pump_pressure_pa: p.endPumpPressurePa,
    float_diff_pa: p.floatDiffPa,
    max_ecd_prev_shoe_kgm3: p.maxEcdPrevShoeKgM3,
    min_rate_no_free_fall_m3s: w.minRateNoFreeFallM3s,
    max_rate_under_ecd_limit_m3s: w.maxRateUnderEcdM3s,
    rate_window_width_m3s: w.widthM3s,
    min_standoff: so.minStandoff,
    standoff_at_centralizer_at_min: so.minRow.standoffAtCentralizer,
    required_spacing_m: requiredSpacing({
      stations: capstoneStations(),
      holeSections: CAPSTONE.holeSections,
      casing: CAPSTONE.casing,
      mudDensityKgM3: CAPSTONE.standoffMudKgM3,
      centralizer: CAPSTONE.centralizer,
    }),
    buoyed_weight_n_per_m: CAPSTONE.casing.weightKgM * G * buoyancyFactor(CAPSTONE.standoffMudKgM3),
    min_standoff_rigid: rigid.minStandoff,
    centralizer_spring_rate_n_per_m:
      CAPSTONE.centralizer.restoringForceN / ((1 - API_TARGET_STANDOFF) * clearanceNominal),
  };
};
