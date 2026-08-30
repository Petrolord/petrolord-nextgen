// Casing and tubing teaching lab for the DR6 course (app 'casingtubing'). Pure
// functions over the vendored engines/drilling tubularDesign module, its
// tubular catalog and its goldens; every exported value is pinned by
// casingTubingLab.test.js.
//
// One string, one set of load cases, one tubing-packer system. The LESSONS run
// the PUBLISHED string, environment and tubing; the CAPSTONE runs grades the
// goldens never publish, a shorter shoe on a heavier mud, a different
// evacuation fraction and dogleg, and a longer tubing on a wider seal bore. No
// graded value is a number a lesson prints and none is a number the goldens
// publish either.

import cases from '@petrolord/engines/test-data/drilling/goldens/tubular_cases.json';

import {
  barlowBurstPa, pipeBodyYieldN, jointStrengthN, adjustedYieldPa,
  api5c3CollapsePa, triaxialSF, loadCaseProfiles, evaluateString, tubingLoads,
  erosionalVelocityMs, LOAD_CASE_KINDS, STEEL_ALPHA_PER_C, BALLOONING_FACTOR,
} from '@petrolord/engines/engines/drilling/tubularDesign.js';
import {
  CASING_CATALOG, TUBING_CATALOG, CASING_GRADES, casingGradeYieldPa,
  CONNECTION_EFFICIENCIES,
} from '@petrolord/engines/engines/drilling/data/tubulars.js';
import { stringProperties, STEEL_E_PA } from '@petrolord/engines/engines/drilling/torqueDrag.js';

export {
  barlowBurstPa, pipeBodyYieldN, jointStrengthN, adjustedYieldPa,
  api5c3CollapsePa, triaxialSF, erosionalVelocityMs, LOAD_CASE_KINDS,
  STEEL_ALPHA_PER_C, BALLOONING_FACTOR, STEEL_E_PA,
  CASING_CATALOG, TUBING_CATALOG, CASING_GRADES, casingGradeYieldPa,
  CONNECTION_EFFICIENCIES, stringProperties,
};

export const G = 9.80665;
export const IN = 0.0254;
export const LBFT = 1.4881639;
export const KSI = 6.894757e6;

// The golden fixture: the D1 slant well, its two-section 9-5/8 inch string,
// its environment and its tubing-packer scenarios.
export const GOLDEN = cases;
export const ROWS = [...CASING_CATALOG, ...TUBING_CATALOG];

export const rowOf = (odIn, weightLbFt) => {
  const r = ROWS.find((x) => x.odIn === odIn && x.weightLbFt === weightLbFt);
  if (!r) throw new Error(`No catalog row ${odIn}" ${weightLbFt}#.`);
  return r;
};
export const yieldOf = (grade) => {
  const y = casingGradeYieldPa(grade);
  if (y == null) throw new Error(`Unknown grade '${grade}'.`);
  return y;
};
export const effOf = (connection) => {
  const c = CONNECTION_EFFICIENCIES.find((x) => x.name === connection);
  if (!c) throw new Error(`Unknown connection '${connection}'.`);
  return c.efficiency;
};

// ---------------------------------------------------------------------------
// Ratings: one catalog row at one grade.
// ---------------------------------------------------------------------------

// Everything the four rating formulas say about one pipe, with the collapse
// regime and the three D/t boundaries that decide it. `axialFraction` derates
// the collapse through the axial-adjusted yield.
export const rating = (odIn, weightLbFt, grade, {
  connection = 'BTC', axialFraction = 0,
} = {}) => {
  const r = rowOf(odIn, weightLbFt);
  const yieldPa = yieldOf(grade);
  const idM = r.odM - 2 * r.wallM;
  const base = api5c3CollapsePa({ odM: r.odM, wallM: r.wallM, yieldPa });
  const derated = api5c3CollapsePa({
    odM: r.odM, wallM: r.wallM, yieldPa, axialStressPa: axialFraction * yieldPa,
  });
  return {
    odIn, weightLbFt, grade, connection,
    odM: r.odM, wallM: r.wallM, idM, weightKgM: r.weightKgM,
    dt: r.odM / r.wallM,
    areaM2: stringProperties({ odM: r.odM, idM }).areaM2,
    yieldPa,
    burstPa: barlowBurstPa({ odM: r.odM, wallM: r.wallM, yieldPa }),
    bodyYieldN: pipeBodyYieldN({ odM: r.odM, idM, yieldPa }),
    jointStrengthN: jointStrengthN({
      odM: r.odM, idM, yieldPa, connectionEfficiency: effOf(connection),
    }),
    collapsePa: base.collapsePa,
    regime: base.regime,
    boundaries: base.boundaries,
    axialFraction,
    adjustedYieldPa: adjustedYieldPa(yieldPa, axialFraction * yieldPa),
    collapseDeratedPa: derated.collapsePa,
    regimeDerated: derated.regime,
    deratedFraction: base.collapsePa > 0 ? 1 - derated.collapsePa / base.collapsePa : 0,
  };
};

// The three D/t regime boundaries belong to the GRADE and not to the pipe:
// they are functions of the yield strength alone. Associate m03 l04 is this.
export const boundariesOf = (grade) => api5c3CollapsePa({
  odM: 9.625 * IN, wallM: 0.472 * IN, yieldPa: yieldOf(grade),
}).boundaries;

// Every published grade against one catalog row. The 20 inch rows are where
// the elastic regime shows that collapse stops depending on the grade.
export const gradeSweep = (odIn, weightLbFt, { axialFraction = 0 } = {}) => CASING_GRADES
  .map((g) => rating(odIn, weightLbFt, g.name, { axialFraction }));

// One row and grade swept across axial load, which is the combined-loading
// curve the API calls the ellipse.
export const tensionSweep = (odIn, weightLbFt, grade, fractions = [
  0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
]) => fractions.map((f) => {
  const r = rating(odIn, weightLbFt, grade, { axialFraction: f });
  return {
    fraction: f,
    adjustedYieldPa: r.adjustedYieldPa,
    collapsePa: r.collapseDeratedPa,
    regime: r.regimeDerated,
    deratedFraction: r.deratedFraction,
  };
});

// The whole catalog at every grade, which is what the regime census counts.
export const ratingTable = ({ axialFraction = 0 } = {}) => ROWS.flatMap(
  (r) => CASING_GRADES.map((g) => rating(r.odIn, r.weightLbFt, g.name, { axialFraction })),
);

export const regimeCensus = (rows, key = 'regime') => rows.reduce((acc, r) => {
  acc[r[key]] = (acc[r[key]] || 0) + 1;
  return acc;
}, {});

// ---------------------------------------------------------------------------
// Load cases and the string check.
// ---------------------------------------------------------------------------

// The published string: two sections of 9-5/8 inch on the D1 slant well.
export const PUBLISHED = {
  shoeTvdM: GOLDEN.shoeTvdM,
  breakTvdM: GOLDEN.breakTvdM,
  env: GOLDEN.env,
  string: GOLDEN.string,
  sections: GOLDEN.sections,
  designFactors: GOLDEN.designFactors,
  bendingDlsDegPer30m: GOLDEN.bendingDlsDegPer30m,
};

export const buoyancyFactor = (mudKgM3) => 1 - mudKgM3 / 7850;

// One load case run over one string. Defaults are the published fixture, so
// `runCase('gasKickBurst')` reproduces the golden row.
export const runCase = (kind, {
  shoeTvdM = PUBLISHED.shoeTvdM, env = PUBLISHED.env, string = PUBLISHED.string,
  sections = PUBLISHED.sections, designFactors = PUBLISHED.designFactors,
  bendingDlsDegPer30m = PUBLISHED.bendingDlsDegPer30m,
} = {}) => {
  const profile = loadCaseProfiles({ kind, shoeTvdM, env, string });
  const result = evaluateString({
    sections, profile, safetyFactors: designFactors, bendingDlsDegPer30m,
  });
  return {
    kind,
    profile,
    rows: profile.tvdM.map((z, i) => ({
      tvdM: z,
      piPa: profile.piPa[i],
      poPa: profile.poPa[i],
      faN: profile.faN[i],
      burstDpPa: profile.piPa[i] - profile.poPa[i],
      collapseDpPa: profile.poPa[i] - profile.piPa[i],
    })),
    sections: result.sections,
    designFactors: result.designFactors,
  };
};

export const runAllCases = (over = {}) => Object.fromEntries(
  LOAD_CASE_KINDS.map((k) => [k, runCase(k, over)]),
);

// What a check that only looked at the bottom of each section would have
// reported, against what the whole-profile scan reports. Professional m02 l05.
export const shoeOnlyComparison = (kind, over = {}) => {
  const run = runCase(kind, over);
  const sections = over.sections ?? PUBLISHED.sections;
  return sections.map((sec, s) => {
    const rating0 = barlowBurstPa({
      odM: sec.odM, wallM: sec.wallM ?? (sec.odM - sec.idM) / 2, yieldPa: sec.yieldPa,
    });
    const inside = run.rows.filter(
      (r) => r.tvdM >= sec.topTvdM - 1e-9 && r.tvdM <= sec.bottomTvdM + 1e-9,
    );
    const bottom = inside[inside.length - 1];
    const bottomSf = bottom.burstDpPa > 0 ? rating0 / bottom.burstDpPa : null;
    const scanned = run.sections[s].burstSF;
    return {
      section: s + 1,
      bottomTvdM: bottom.tvdM,
      bottomSf,
      scannedSf: Number.isFinite(scanned) ? scanned : null,
      governingTvdM: run.sections[s].burstAtTvdM,
      overstatement: (bottomSf != null && Number.isFinite(scanned)) ? bottomSf / scanned : null,
    };
  });
};

// The three verdict thresholds, so a status can be read rather than guessed.
export const verdictThresholds = (df = PUBLISHED.designFactors) => ({
  burst: df.burst, collapse: df.collapse, tension: df.tension, triaxial: df.triaxial,
  burstWarn: df.burst * 1.1, collapseWarn: df.collapse * 1.1, triaxialWarn: df.triaxial * 1.1,
});

// ---------------------------------------------------------------------------
// The tubing-packer system.
// ---------------------------------------------------------------------------

// The published tubing scenario: 3-1/2 inch 9.3 lb/ft, 2500 m, on a 4 inch
// seal bore inside 7 inch 29 lb/ft casing.
export const PUBLISHED_TUBING = {
  tubing: { odM: 3.5 * IN, idM: 2.992 * IN, lengthM: 2500, weightKgM: 9.3 * LBFT },
  packer: { sealBoreM: 4 * IN, ratingN: 6.7e5, strokeM: 1.5 },
  casingIdM: 6.184 * IN,
};

export const tubingGeometry = (t = PUBLISHED_TUBING) => {
  const { odM, idM } = t.tubing;
  const sp = stringProperties({ odM, idM });
  return {
    ...t.tubing,
    areaM2: sp.areaM2,
    eiNm2: sp.eiNm2,
    Ai: (Math.PI / 4) * idM * idM,
    Ao: (Math.PI / 4) * odM * odM,
    Ap: (Math.PI / 4) * t.packer.sealBoreM * t.packer.sealBoreM,
    sealBoreM: t.packer.sealBoreM,
    casingIdM: t.casingIdM,
    radialClearanceM: (t.casingIdM - odM) / 2,
  };
};

export const tubingRun = (loadCase, tempProfile, t = PUBLISHED_TUBING) => tubingLoads({
  tubing: t.tubing, packer: t.packer, loadCase, tempProfile, casingIdM: t.casingIdM,
});

// The published scenarios, by name.
export const tubingScenario = (name) => {
  const s = GOLDEN.tubing.find((x) => x.name === name);
  if (!s) throw new Error(`Unknown tubing scenario '${name}'.`);
  return { ...s, run: tubingRun(s.case, s.temp) };
};

// The temperature axis at a fixed pressure change, which is the operating
// envelope Expert m05 reads.
export const tempSweep = ({
  dPiPa = 10e6, dPoPa = 0, externalKgM3 = 1150, from = -80, to = 100, step = 5,
  t = PUBLISHED_TUBING,
} = {}) => {
  const rows = [];
  for (let dT = from; dT <= to + 1e-9; dT += step) {
    const r = tubingRun({ dPiPa, dPoPa, externalKgM3 }, { deltaOpC: dT }, t);
    rows.push({
      dT,
      pistonN: r.forces.pistonN,
      ballooningN: r.forces.ballooningN,
      thermalN: r.forces.thermalN,
      totalN: r.forces.totalN,
      state: r.buckling.state,
      totalDlM: r.lengthChanges.totalM,
      strokeOk: r.packer.strokeOk,
      packerSf: r.packer.sf,
    });
  }
  return rows;
};

// The envelope's four edges, bisected rather than read off a sweep. The two
// stroke edges are exactly 2*strokeM/(alpha*L) apart whatever the pressures
// do, because only the thermal length term contains the temperature.
export const envelope = ({
  dPiPa = 10e6, dPoPa = 0, externalKgM3 = 1150, t = PUBLISHED_TUBING,
} = {}) => {
  const at = (dT) => tubingRun({ dPiPa, dPoPa, externalKgM3 }, { deltaOpC: dT }, t);
  const bisect = (pred, lo, hi) => {
    let a = lo; let b = hi;
    for (let k = 0; k < 100; k += 1) {
      const m = (a + b) / 2;
      if (pred(at(m))) b = m; else a = m;
    }
    return (a + b) / 2;
  };
  const coldStroke = (() => {
    let a = -400; let b = 0;
    for (let k = 0; k < 100; k += 1) {
      const m = (a + b) / 2;
      if (at(m).packer.strokeOk) b = m; else a = m;
    }
    return (a + b) / 2;
  })();
  const sinusoidal = bisect((r) => r.buckling.state !== 'none', 0, 400);
  const helical = bisect((r) => r.buckling.state === 'helical', 0, 400);
  const hotStroke = bisect((r) => !r.packer.strokeOk, 0, 400);
  return {
    coldStrokeDegC: coldStroke,
    sinusoidalOnsetDegC: sinusoidal,
    helicalOnsetDegC: helical,
    hotStrokeDegC: hotStroke,
    strokeWindowDegC: hotStroke - coldStroke,
    closedFormStrokeWindowDegC: (2 * t.packer.strokeM) / (STEEL_ALPHA_PER_C * t.tubing.lengthM),
    hotLimitDegC: Math.min(sinusoidal, hotStroke),
    hotLimitIs: sinusoidal < hotStroke ? 'buckling' : 'stroke',
  };
};

// helicalN / sinusoidalN is 2*sqrt(2) - 1 for every geometry, because both
// limits are the same square root times a different constant.
export const HELICAL_RATIO = 2 * Math.SQRT2 - 1;

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
  for (const r of GOLDEN.ratings) {
    const got = rating(r.odIn, r.weightLbFt, r.grade, { axialFraction: 0.4 });
    cmp(got.burstPa, r.burstPa, `${r.odIn}/${r.weightLbFt}/${r.grade}.burst`);
    cmp(got.collapsePa, r.collapsePa, `${r.odIn}/${r.weightLbFt}/${r.grade}.collapse`);
    cmp(got.collapseDeratedPa, r.collapseAt40pctTensionPa, `${r.odIn}/${r.weightLbFt}/${r.grade}.collapse40`);
    cmp(got.bodyYieldN, r.bodyYieldN, `${r.odIn}/${r.weightLbFt}/${r.grade}.bodyYield`);
  }
  for (const c of GOLDEN.cases) {
    const run = runCase(c.kind);
    for (const cp of c.profileCheckpoints) {
      const row = run.rows.find((x) => Math.abs(x.tvdM - cp.tvdM) < 1e-6);
      if (!row) continue;
      cmp(row.piPa, cp.piPa, `${c.kind}.pi@${cp.tvdM}`);
      cmp(row.poPa, cp.poPa, `${c.kind}.po@${cp.tvdM}`);
      cmp(row.faN, cp.faN, `${c.kind}.fa@${cp.tvdM}`);
    }
    c.sections.forEach((exp, s) => {
      const got = run.sections[s];
      for (const k of ['burstSF', 'collapseSF', 'tensionSF', 'triaxSF']) {
        cmp(got[k], exp[k], `${c.kind}.sec${s + 1}.${k}`);
      }
      cmp(got.burstRatingPa, exp.burstRatingPa, `${c.kind}.sec${s + 1}.rating`);
      cmp(got.bodyYieldN, exp.bodyYieldN, `${c.kind}.sec${s + 1}.bodyYield`);
    });
  }
  for (const s of GOLDEN.tubing) {
    const got = tubingRun(s.case, s.temp);
    for (const k of ['pistonN', 'ballooningN', 'thermalN', 'totalN']) {
      cmp(got.forces[k], s.result.forces[k], `${s.name}.${k}`);
    }
    for (const k of ['pistonM', 'ballooningM', 'thermalM', 'totalM']) {
      cmp(got.lengthChanges[k], s.result.lengthChanges[k], `${s.name}.dL.${k}`);
    }
    cmp(got.buckling.sinusoidalN, s.result.buckling.sinusoidalN, `${s.name}.sinusoidal`);
    cmp(got.buckling.helicalN, s.result.buckling.helicalN, `${s.name}.helical`);
    cmp(got.packer.sf, s.result.packer.sf, `${s.name}.packerSf`);
  }
  cmp(erosionalVelocityMs({
    mixtureKgM3: GOLDEN.erosional.mixtureKgM3, cFactor: GOLDEN.erosional.cFactor,
  }), GOLDEN.erosional.veMs, 'erosional');
  return { checked, worstRel: worst, at };
};

// ---------------------------------------------------------------------------
// The capstone's own conditions, and the eighteen graded values.
// ---------------------------------------------------------------------------

// A grade the goldens never publish, a connection the string never uses, and a
// derating fraction the lessons never run.
export const CAPSTONE_RATING = {
  odIn: 13.375, weightLbFt: 68, grade: 'C-90', connection: 'STC', axialFraction: 0.55,
};

// A shorter shoe on a heavier mud, two unpublished grades, a bigger dogleg and
// an evacuation level that lands INSIDE the top section rather than below it.
export const CAPSTONE_STRING = {
  shoeTvdM: 2200,
  breakTvdM: 1200,
  bendingDlsDegPer30m: 3.5,
  env: {
    mudKgM3: 1620,
    cementKgM3: 1870,
    gasGradPaPerM: 1900,
    fracEmwAtShoeKgM3: 1950,
    testPressurePa: 28e6,
    evacuationFraction: 0.7,
    seawaterKgM3: 1025,
    overpullN: 620000,
    packerFluidKgM3: 1200,
  },
  string: { weightKgM: 53.5 * LBFT },
  designFactors: { burst: 1.1, collapse: 1.0, tension: 1.6, triaxial: 1.25 },
  top: { odIn: 9.625, weightLbFt: 53.5, grade: 'T-95', connection: 'BTC' },
  bottom: { odIn: 9.625, weightLbFt: 47, grade: 'C-90', connection: 'STC' },
};

export const capstoneSections = () => {
  const t = rowOf(CAPSTONE_STRING.top.odIn, CAPSTONE_STRING.top.weightLbFt);
  const b = rowOf(CAPSTONE_STRING.bottom.odIn, CAPSTONE_STRING.bottom.weightLbFt);
  return [
    {
      topTvdM: 0,
      bottomTvdM: CAPSTONE_STRING.breakTvdM,
      odM: t.odM,
      wallM: t.wallM,
      yieldPa: yieldOf(CAPSTONE_STRING.top.grade),
      connectionEfficiency: effOf(CAPSTONE_STRING.top.connection),
    },
    {
      topTvdM: CAPSTONE_STRING.breakTvdM,
      bottomTvdM: CAPSTONE_STRING.shoeTvdM,
      odM: b.odM,
      wallM: b.wallM,
      yieldPa: yieldOf(CAPSTONE_STRING.bottom.grade),
      connectionEfficiency: effOf(CAPSTONE_STRING.bottom.connection),
    },
  ];
};

export const capstoneRun = (kind) => runCase(kind, {
  shoeTvdM: CAPSTONE_STRING.shoeTvdM,
  env: CAPSTONE_STRING.env,
  string: CAPSTONE_STRING.string,
  sections: capstoneSections(),
  designFactors: CAPSTONE_STRING.designFactors,
  bendingDlsDegPer30m: CAPSTONE_STRING.bendingDlsDegPer30m,
});

// A longer, wider tubing on a wider seal bore, hotter than anything the
// lessons run, with a pressure change on the annulus as well as the bore.
export const CAPSTONE_TUBING = {
  tubing: { odM: 4.5 * IN, idM: 3.958 * IN, lengthM: 3200, weightKgM: 12.75 * LBFT },
  packer: { sealBoreM: 5.0 * IN, ratingN: 9.0e5, strokeM: 2.0 },
  casingIdM: 6.184 * IN,
};
export const CAPSTONE_TUBING_CASE = { dPiPa: 32e6, dPoPa: 6e6, externalKgM3: 1080 };
export const CAPSTONE_TUBING_TEMP = { deltaOpC: 100 };

export const capstoneTubingRun = () => tubingRun(
  CAPSTONE_TUBING_CASE, CAPSTONE_TUBING_TEMP, CAPSTONE_TUBING,
);

export const capstoneValues = () => {
  const r = rating(
    CAPSTONE_RATING.odIn, CAPSTONE_RATING.weightLbFt, CAPSTONE_RATING.grade,
    { connection: CAPSTONE_RATING.connection, axialFraction: CAPSTONE_RATING.axialFraction },
  );
  const gasKick = capstoneRun('gasKickBurst');
  const test = capstoneRun('pressureTestBurst');
  const full = capstoneRun('fullEvacuationCollapse');
  const partial = capstoneRun('partialEvacuationCollapse');
  const running = capstoneRun('runningAxial');
  const t = capstoneTubingRun();
  return {
    burst_rating_Pa: r.burstPa,
    body_yield_N: r.bodyYieldN,
    joint_strength_N: r.jointStrengthN,
    collapse_Pa: r.collapsePa,
    collapse_at_55pct_tension_Pa: r.collapseDeratedPa,
    dt_plastic_transition_boundary: r.boundaries.dtPt,
    gaskick_sec1_burst_sf: gasKick.sections[0].burstSF,
    pressuretest_sec2_burst_sf: test.sections[1].burstSF,
    fullevac_sec2_collapse_sf: full.sections[1].collapseSF,
    partialevac_sec2_collapse_sf: partial.sections[1].collapseSF,
    runningaxial_sec2_tension_sf: running.sections[1].tensionSF,
    pressuretest_sec2_triax_sf: test.sections[1].triaxSF,
    piston_N: t.forces.pistonN,
    ballooning_N: t.forces.ballooningN,
    thermal_N: t.forces.thermalN,
    total_force_N: t.forces.totalN,
    helical_limit_N: t.buckling.helicalN,
    total_length_change_m: t.lengthChanges.totalM,
  };
};
