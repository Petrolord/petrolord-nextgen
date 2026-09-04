// Teaching lab for PD4, Rod Pump Design. The three panels, the 78 shipped
// lessons and the vitest file all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// Everything here is the vendored engine's own output. Every string, every
// buoyancy factor, every eigenvalue, every four-bar position, every fluid load,
// every marched card, every envelope, every torque, every stress and every
// diagnosis below is a return value from a call into
// engines/production/rodString.js, rodDynamics.js, pumpingUnit.js,
// rodPumpDesign.js or data/rodCatalog.js over
// test-data/production/goldens/rodpump_cases.json. Nothing in this file
// re-implements the engine. The only arithmetic done here is the arithmetic a
// PANEL would otherwise have to do on the engine's return values: a difference,
// a ratio, a percentage, a spread across a sweep, a spring rule that is one
// multiplication of two engine outputs. That arithmetic lives here on purpose,
// so that a panel is a renderer and never a calculator.
//
// THE ONE EXCEPTION, AND IT IS LABELLED WHERE IT SITS. `scanGridReplica` walks
// the sample grid `naturalFrequency` walks, line for line from the engine
// source, because the Associate tier teaches the SHAPE of that grid and the
// engine returns only the root it found. It computes no eigenvalue: it lays out
// sample points. `modeScanSpm` is a second, independent route to the same
// eigenvalues, on a dense uniform grid, and it exists only so a lesson can say
// the engine's scan found the true fundamental rather than assert it. The wave's
// teaching digest carries both under the same two labels.
//
// UNITS. Field units throughout, as all four engine headers state: load lb
// (never lbf), stroke and position in, depth and length ft, stiffness lb/in,
// compliance in/lb, speed spm, rate bbl/d, power hp, torque in-lb, stress psi,
// pressure psia (never psig), area in2, volume in3, temperature degF.
//
// FOUR PROVENANCE RULES THIS FILE EXISTS TO KEEP, all four already stated in the
// wave's teaching digest and all four easy to lose in a panel.
//
//   1. TWO ROUTES TO THE PLUNGER STROKE. `springRuleIn` is S - Fo Er, closed
//      form and speed blind. `plungerStrokeIn` off `predictCard` is the peak to
//      trough travel of the pump node over a settled cycle. The wave answer is
//      the longer one and the difference is inertial overtravel. Every accessor
//      that returns both names both, and no accessor returns one under a name
//      that could be read as the other.
//
//   2. TWO PEAK LOADS OUT OF ONE RETURN OBJECT. `prlPeakLb` is the maximum of
//      the DECIMATED surface card. The envelope top is `tensionEnvelope[0].maxLb`
//      plus the buoyed rod above that node, accumulated over every marched step.
//      They disagree, and the design splits on the disagreement: the Goodman
//      check reads the envelope and the structural rating reads the subsample.
//      `envelopeSplit()` returns both, labelled, and never averages them.
//
//   3. TWO ROUTES TO THE WORST SECTION LOADING. `runRodPumpDesign` returns one;
//      `standaloneLoading` recomputes it from a card with `sectionStresses` and
//      `modifiedGoodman`, exactly as the design does, because the design exposes
//      no node count and a node sweep has no other way in. The two are strictly
//      equal at the shipped grid, and `loadingRouteAgreement()` is the check on
//      that. Never quote one of the pair without saying which route it came from.
//
//   4. THE TEACHING WELL IS LABELLED EVERYWHERE. ODUMA-4 is a three way taper
//      this wave invented so every Expert result has a case a lesson may quote.
//      It is not a published case and not a real well, and every accessor that
//      returns its numbers carries the word teaching in its name or its rows.
//      It is run on the PUBLISHED four-bar linkage, so the surface motion under
//      it is a published unit and not an invented one.
//
// THE CAPSTONE IS NOT IN THIS FILE AND NEVER WILL BE. Unlike the PD2 and PD3
// labs, which carry their capstone derivation beside their teaching surface,
// the PD4 capstone is derived in the wave's own pd4_fields.mjs and nothing here
// imports, reads or reproduces it. panelCapstoneGuard.test.js is the gate: it
// reads the graded field list and asserts that no number this lab or the
// teaching digest exposes lands anywhere near a graded answer.
//
// PURITY AND CACHING. Every accessor is pure and deterministic: no random number
// anywhere, and two calls with the same arguments return equal values. The
// expensive calls are cached internally, because a marched card is a pure
// function of its arguments and the node ladder marches sixteen times the steps
// at its top rung. The caches hold engine return values and every accessor maps
// them into fresh rows, so a panel cannot mutate one and change what another
// panel sees.

import golden from '@petrolord/engines/test-data/production/goldens/rodpump_cases.json';
import {
  buildRodString, naturalFrequency, buoyancyFactor, rodStretchIn, sectionWaveSpeedFtS,
} from '@petrolord/engines/engines/production/rodString.js';
import {
  predictCard, diagnoseCard, cardArea, polishedRodHp,
} from '@petrolord/engines/engines/production/rodDynamics.js';
import {
  conventionalGeometry, unitKinematics, surfacePositionFn, simpleHarmonicPosition,
  netTorque, balanceUnit, genericConventionalGeometry, parseUnitDesignation,
} from '@petrolord/engines/engines/production/pumpingUnit.js';
import {
  runRodPumpDesign, fluidLoadLb, displacementBpd, sectionStresses, modifiedGoodman,
  PUMP_CONSTANT, IN3_PER_BBL,
} from '@petrolord/engines/engines/production/rodPumpDesign.js';
import {
  rodArea, rodSize, parseRodSize, rodGrade, bareRodWeightLbPerFt, steelAcousticVelocityFtS,
  PLUNGER_SIZES, ROD_ELASTIC_MODULUS_PSI, ROD_ACOUSTIC_VELOCITY_FT_S, COUPLING_ALLOWANCE,
  STEEL_SG, STEEL_DENSITY_LB_FT3,
} from '@petrolord/engines/engines/production/data/rodCatalog.js';

export const GOLDEN = golden;

const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
};

/** Warning codes as a comma separated string, the way the digest prints them. */
export const warningCodes = (arr) => ((arr && arr.length) ? arr.map((x) => x.code).join(', ') : 'none');

/** Does a warning list carry this code? */
export const hasWarning = (arr, code) => Boolean(arr && arr.some((x) => x.code === code));

const pct = (a, b) => ((a - b) / b) * 100;
const spread = (xs) => Math.max(...xs) - Math.min(...xs);

// ---------------------------------------------------------------------------
// 1. THE FIXTURES. PUBLISHED, DERIVED AND TEACHING.
// ---------------------------------------------------------------------------

/** The two rod strings the oracle committed, at its own fluid gravity of 1.00. */
export const PUBLISHED_STRING_INPUTS = Object.freeze({
  uniform: Object.freeze({
    sections: [{ size: '7/8', lengthFt: 6000 }],
    fluidSg: 1.0,
    gradeId: 'D',
    note: '7/8 rods 6000 ft, fluid specific gravity 1.00',
  }),
  taper: Object.freeze({
    sections: [{ size: '7/8', lengthFt: 3000 }, { size: '3/4', lengthFt: 2000 }],
    fluidSg: 1.0,
    gradeId: 'D',
    note: '7/8 rods 3000 ft over 3/4 rods 2000 ft, fluid specific gravity 1.00',
  }),
});

export const PUBLISHED_STRING_IDS = Object.freeze(['uniform', 'taper']);

export const publishedString = memoize((id) => {
  const i = PUBLISHED_STRING_INPUTS[id];
  return buildRodString({ sections: i.sections, fluidSg: i.fluidSg, gradeId: i.gradeId });
});

export const publishedFrequency = memoize((id) => naturalFrequency({ string: publishedString(id) }));

/**
 * ODUMA-4. INVENTED BY THIS WAVE, not a published case and not a real well. It
 * exists so every Expert result has a case a lesson may quote at full size, and
 * it is run on the PUBLISHED four-bar of section 7 so the surface motion under
 * it is a published linkage rather than an invented one.
 */
export const ODUMA = Object.freeze({
  label: 'ODUMA-4',
  sections: Object.freeze([
    { size: '1', lengthFt: 1500 },
    { size: '7/8', lengthFt: 1600 },
    { size: '3/4', lengthFt: 1700 },
  ]),
  fluidSg: 0.90,
  gradeId: 'D',
  plungerDIn: 1.75,
  pDischargePsia: 2100,
  pIntakePsia: 150,
  spm: 10,
  dampingRatio: 0.12,
  fillage: 0.90,
  pumpEfficiency: 1,
  serviceFactor: 1.0,
});

export const teachingString = memoize(() => buildRodString({
  sections: ODUMA.sections.map((s) => ({ ...s })),
  fluidSg: ODUMA.fluidSg,
  gradeId: ODUMA.gradeId,
}));

export const teachingFrequency = memoize(() => naturalFrequency({ string: teachingString() }));

/** The published four-bar, dimension for dimension, and the kinematics on it. */
export const unitGeometry = memoize(() => conventionalGeometry(golden.unit.geometry));
export const unitKin = memoize(() => unitKinematics(unitGeometry(), { steps: 360 }));
export const surfacePosition = memoize(() => surfacePositionFn(unitKin()));
export const unitStrokeIn = () => unitKin().strokeIn;

/** The published predictive case: the taper on pure simple harmonic motion. */
export const PUBLISHED_PREDICT = Object.freeze({
  strokeIn: golden.predict.strokeIn,
  fluidLoadLb: golden.predict.fluidLoadLb,
  dampingRatio: golden.predict.dampingRatio,
  fillage: 1,
  spms: Object.freeze([5, 9]),
  note: 'the published taper, simple harmonic surface motion, a full barrel',
});

const publishedShm = memoize(() => simpleHarmonicPosition(PUBLISHED_PREDICT.strokeIn / 12));

/** predictCard on the PUBLISHED predictive case. Cached: the march is expensive. */
export const publishedCard = memoize((spm, over = {}) => predictCard({
  string: publishedString('taper'),
  surfacePosition: publishedShm(),
  strokeFt: PUBLISHED_PREDICT.strokeIn / 12,
  spm,
  fluidLoadLb: PUBLISHED_PREDICT.fluidLoadLb,
  fillage: PUBLISHED_PREDICT.fillage,
  dampingRatio: PUBLISHED_PREDICT.dampingRatio,
  ...over,
}));

/** predictCard on ODUMA-4, driven by the PUBLISHED four-bar. */
export const teachingCard = memoize((over = {}) => predictCard({
  string: teachingString(),
  surfacePosition: surfacePosition(),
  strokeFt: unitStrokeIn() / 12,
  spm: ODUMA.spm,
  fluidLoadLb: teachingFluidLoadLb(),
  fillage: ODUMA.fillage,
  dampingRatio: ODUMA.dampingRatio,
  ...over,
}));

/** runRodPumpDesign on ODUMA-4. The whole design, as the studio would get it. */
export const teachingDesign = memoize((over = {}) => runRodPumpDesign({
  string: teachingString(),
  frequency: teachingFrequency(),
  surfacePosition: surfacePosition(),
  strokeIn: unitStrokeIn(),
  spm: ODUMA.spm,
  plungerDIn: ODUMA.plungerDIn,
  pDischargePsi: ODUMA.pDischargePsia,
  pIntakePsi: ODUMA.pIntakePsia,
  fillage: ODUMA.fillage,
  pumpEfficiency: ODUMA.pumpEfficiency,
  dampingRatio: ODUMA.dampingRatio,
  serviceFactor: ODUMA.serviceFactor,
  ...over,
}));

export const teachingFluidLoadLb = () => fluidLoadLb({
  plungerDIn: ODUMA.plungerDIn,
  pDischargePsi: ODUMA.pDischargePsia,
  pIntakePsi: ODUMA.pIntakePsia,
});

/**
 * A load reader over a returned card, for `balanceUnit`, which asks for the
 * polished rod load at a cycle fraction. Linear between the card's own points:
 * the card is the only surface load history the engine hands out.
 */
export const cardLoadAt = (card) => (tFrac) => {
  const n = card.length;
  const x = ((((tFrac % 1) + 1) % 1)) * n;
  const i = Math.floor(x);
  const fr = x - i;
  const a = card[i % n].loadLb;
  const b = card[(i + 1) % n].loadLb;
  return a + (b - a) * fr;
};

// ---------------------------------------------------------------------------
// 2. SECTION 0 AND 1. FOUR OBJECTS, AND THE PUBLISHED CONSTANTS.
// ---------------------------------------------------------------------------

/**
 * What each of the four modules contributes to one design. Associate m01 l04.
 * Nothing in the first three needs a march; everything in the fourth does, and
 * that is the seam the three tiers are cut along.
 */
export const fourObjects = () => {
  const tap = publishedString('taper');
  const kin = unitKin();
  return Object.freeze([
    {
      object: 'the string',
      module: 'rodString.js',
      owns: 'a compliance sum, Archimedes, a stepped bar eigenvalue',
      needsAMarch: false,
      figures: [
        { label: 'buoyed weight, published taper', value: tap.weightFluidLb, unit: 'lb' },
        { label: 'spring rate, published taper', value: tap.krLbPerIn, unit: 'lb/in' },
        { label: 'fundamental, published taper', value: publishedFrequency('taper').nPrimeSpm, unit: 'spm' },
      ],
    },
    {
      object: 'the linkage',
      module: 'pumpingUnit.js',
      owns: 'a four-bar closure and the torque factor that follows from differentiating it',
      needsAMarch: false,
      figures: [
        { label: 'stroke, published unit', value: kin.strokeIn, unit: 'in' },
        { label: 'largest torque factor', value: Math.max(...kin.samples.map((s) => Math.abs(s.torqueFactorIn))), unit: 'in' },
        { label: 'upstroke fraction', value: kin.upstrokeFraction, unit: '' },
      ],
    },
    {
      object: 'the pump',
      module: 'rodPumpDesign.js',
      owns: 'fluid load, plunger area, displacement, the RP 11L groups, the Goodman check',
      needsAMarch: false,
      figures: [
        { label: 'fluid load, ODUMA-4', value: teachingFluidLoadLb(), unit: 'lb' },
        { label: 'plunger area, ODUMA-4', value: rodArea(ODUMA.plungerDIn), unit: 'in2' },
        {
          label: 'rated displacement, ODUMA-4',
          value: displacementBpd({ plungerDIn: ODUMA.plungerDIn, strokeIn: kin.strokeIn, spm: ODUMA.spm }),
          unit: 'bbl/d',
        },
      ],
    },
    {
      object: 'the card',
      module: 'rodDynamics.js',
      owns: 'the plunger stroke, both polished rod loads, the card area, the horsepower, the tension envelope and every warning about them',
      needsAMarch: true,
      figures: [],
    },
  ]);
};

/**
 * The published constants, each with the engine's own value beside it. The pump
 * constant is BUILT rather than remembered, and its `in2` is a squared DIAMETER
 * with the pi over four already inside it.
 */
export const constantRows = () => Object.freeze([
  {
    label: 'pump displacement constant',
    goldenValue: golden.constants.pumpConstant,
    engineValue: PUMP_CONSTANT,
    unit: 'bbl per day per (in of plunger diameter) squared per in of stroke per spm',
  },
  {
    label: 'wave speed of a 7/8 rod',
    goldenValue: golden.constants.waveSpeed78,
    engineValue: sectionWaveSpeedFtS({ areaIn2: rodArea(0.875), weightLbPerFt: 2.224 }),
    unit: 'ft/s',
  },
]);

/** The constants the engine derives rather than remembers. */
export const engineConstants = () => Object.freeze({
  in3PerBbl: IN3_PER_BBL,
  bareSteelVelocityFtS: steelAcousticVelocityFtS(),
  couplingAllowance: COUPLING_ALLOWANCE,
  bareOverSqrtCouplingFtS: steelAcousticVelocityFtS() / Math.sqrt(COUPLING_ALLOWANCE),
  rodAcousticVelocityFtS: ROD_ACOUSTIC_VELOCITY_FT_S,
  elasticModulusPsi: ROD_ELASTIC_MODULUS_PSI,
  steelSg: STEEL_SG,
  steelDensityLbFt3: STEEL_DENSITY_LB_FT3,
});

/** Published rod weight over bare steel weight, size by size. */
export const couplingRatioRows = () => Object.entries(golden.constants.couplingRatios).map(([label, ratio]) => {
  const dIn = parseRodSize(label);
  const weightLbPerFt = rodSize(label).weightLbPerFt;
  return {
    label,
    goldenRatio: ratio,
    dIn,
    areaIn2: rodArea(dIn),
    weightLbPerFt,
    bareWeightLbPerFt: bareRodWeightLbPerFt(dIn),
    waveSpeedFtS: sectionWaveSpeedFtS({ areaIn2: rodArea(dIn), weightLbPerFt }),
  };
});

// ---------------------------------------------------------------------------
// 3. SECTIONS 2 TO 4. THE STRING.
// ---------------------------------------------------------------------------

const sectionRows = (string) => string.sections.map((sec, i) => ({
  index: i + 1,
  label: sec.label,
  dIn: sec.dIn,
  areaIn2: sec.areaIn2,
  lengthFt: sec.lengthFt,
  weightLbPerFt: sec.weightLbPerFt,
  weightSource: sec.weightSource,
  weightLb: sec.weightLb,
  stretchPerLb: sec.stretchPerLb,
  compliancePct: (sec.stretchPerLb / string.erInPerLb) * 100,
  sectionKrLbPerIn: 1 / sec.stretchPerLb,
  topDepthFt: string.sections.slice(0, i).reduce((a, s) => a + s.lengthFt, 0),
}));

/**
 * A published string against the oracle that committed it. The engine reproduces
 * it to the last figure on every closed form here, because a compliance sum and
 * Archimedes have only one answer. The two routes separate only on the
 * eigenvalue, which is `noteRoutes`.
 */
export const publishedStringRow = (id) => {
  const st = publishedString(id);
  const gd = golden.strings[id];
  return {
    id,
    note: PUBLISHED_STRING_INPUTS[id].note,
    goldenWeightAirLb: gd.weightAirLb,
    goldenWeightFluidLb: gd.weightFluidLb,
    goldenBuoyancy: gd.buoyancy,
    goldenErInPerLb: gd.erInPerLb,
    goldenKrLbPerIn: gd.krLbPerIn,
    weightAirLb: st.weightAirLb,
    weightFluidLb: st.weightFluidLb,
    buoyancy: st.buoyancy,
    erInPerLb: st.erInPerLb,
    krLbPerIn: st.krLbPerIn,
    weightAirDiffLb: st.weightAirLb - gd.weightAirLb,
    weightFluidDiffLb: st.weightFluidLb - gd.weightFluidLb,
    erDiffInPerLb: st.erInPerLb - gd.erInPerLb,
    krDiffLbPerIn: st.krLbPerIn - gd.krLbPerIn,
    lengthFt: st.lengthFt,
    weightLbPerFt: st.weightLbPerFt,
    grade: st.grade.label,
    minTensilePsi: st.grade.minTensilePsi,
    sections: sectionRows(st),
    warnings: warningCodes(st.warnings),
  };
};

/** ODUMA-4's string, in the same shape, with no oracle to compare against. */
export const teachingStringRow = () => {
  const st = teachingString();
  return {
    id: ODUMA.label,
    note: '1 in rods 1500 ft over 7/8 rods 1600 ft over 3/4 rods 1700 ft, fluid specific gravity 0.90',
    weightAirLb: st.weightAirLb,
    weightFluidLb: st.weightFluidLb,
    buoyancy: st.buoyancy,
    erInPerLb: st.erInPerLb,
    krLbPerIn: st.krLbPerIn,
    lengthFt: st.lengthFt,
    weightLbPerFt: st.weightLbPerFt,
    grade: st.grade.label,
    minTensilePsi: st.grade.minTensilePsi,
    sections: sectionRows(st),
    warnings: warningCodes(st.warnings),
  };
};

/**
 * DO NOT READ THIS AS A TAPER RESULT. The uniform string is 6000 ft and the
 * taper is 5000 ft, so most of both gaps is the thousand feet. The honest
 * same-length comparison is `taperSplitRows`, which holds the total length and
 * moves the split.
 */
export const publishedStringGap = () => {
  const uni = publishedString('uniform');
  const tap = publishedString('taper');
  return {
    lighterByLb: uni.weightAirLb - tap.weightAirLb,
    lighterByPct: ((uni.weightAirLb - tap.weightAirLb) / uni.weightAirLb) * 100,
    stifferByLbPerIn: tap.krLbPerIn - uni.krLbPerIn,
    stifferByPct: ((tap.krLbPerIn - uni.krLbPerIn) / uni.krLbPerIn) * 100,
    uniformLengthFt: uni.lengthFt,
    taperLengthFt: tap.lengthFt,
    sameLength: uni.lengthFt === tap.lengthFt,
  };
};

/**
 * Compliances add and spring rates do not. The engine sums the compliances; the
 * row below prices what adding the section spring rates instead would give.
 */
export const seriesArithmetic = () => {
  const tap = publishedString('taper');
  const rates = tap.sections.map((s) => 1 / s.stretchPerLb);
  const added = rates.reduce((a, b) => a + b, 0);
  return {
    sections: sectionRows(tap),
    erInPerLb: tap.erInPerLb,
    krLbPerIn: tap.krLbPerIn,
    springRatesAddedLbPerIn: added,
    timesTooStiff: added / tap.krLbPerIn,
    softestSectionLbPerIn: Math.min(...rates),
    stringIsSofterThanItsSoftestSection: tap.krLbPerIn < Math.min(...rates),
  };
};

export const TAPER_SPLIT_TOP_FT = Object.freeze([0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]);

/**
 * The same 5000 ft and the same two rod sizes, with the split walked from all
 * 3/4 to all 7/8. Weight and stiffness move together, so there is no split that
 * is both light and stiff. The note does NOT move with them: it turns.
 */
export const taperSplitRows = memoize((tops = TAPER_SPLIT_TOP_FT) => tops.map((topFt) => {
  const sections = [];
  if (topFt > 0) sections.push({ size: '7/8', lengthFt: topFt });
  if (topFt < 5000) sections.push({ size: '3/4', lengthFt: 5000 - topFt });
  const st = buildRodString({ sections, fluidSg: 1.0, gradeId: 'D' });
  return {
    topFt,
    weightAirLb: st.weightAirLb,
    weightFluidLb: st.weightFluidLb,
    erInPerLb: st.erInPerLb,
    krLbPerIn: st.krLbPerIn,
    stretchUnder5000LbIn: rodStretchIn({ string: st, loadLb: 5000 }),
    fundamentalSpm: naturalFrequency({ string: st }).nPrimeSpm,
  };
}));

/** The engine WARNS on a taper that steps up rather than refusing it. */
export const taperOrderWarning = () => {
  const stepsUp = buildRodString({
    sections: [{ size: '3/4', lengthFt: 3000 }, { size: '7/8', lengthFt: 2000 }],
    fluidSg: 1.0,
  });
  const tap = publishedString('taper');
  return {
    ok: stepsUp.ok,
    warnings: warningCodes(stepsUp.warnings),
    krLbPerIn: stepsUp.krLbPerIn,
    weightAirLb: stepsUp.weightAirLb,
    rightOrderKrLbPerIn: tap.krLbPerIn,
    rightOrderWarnings: warningCodes(tap.warnings),
  };
};

/** And it REFUSES a size it cannot read, rather than defaulting it. */
export const sizeRefusal = () => {
  const bad = buildRodString({ sections: [{ size: 'seven eighths', lengthFt: 3000 }], fluidSg: 1.0 });
  return {
    ok: bad.ok,
    errorCount: bad.errors.length,
    message: bad.errors[0],
    misreadAreaIn2: rodArea(7.8),
    trueAreaIn2: rodArea(0.875),
    areaFactor: rodArea(7.8) / rodArea(0.875),
  };
};

export const BUOYANCY_SG = Object.freeze([0.00, 0.70, 0.80, 0.85, 0.95, 1.00, 1.05, 1.15]);

/**
 * Buoyed weight is Archimedes and nothing else: 1 - SG fluid over SG steel, with
 * no other coefficient in it. The last two columns price the predecessor's
 * 1 - 1.2 SG / 7.85, which is single digit percent and not a fifth.
 */
export const buoyancyRows = (sgs = BUOYANCY_SG) => {
  const tap = publishedString('taper');
  return sgs.map((fluidSg) => {
    const factor = buoyancyFactor(fluidSg);
    const predecessorFactor = 1 - (1.2 * fluidSg) / STEEL_SG;
    return {
      fluidSg,
      factor,
      buoyedWeightLb: tap.weightAirLb * factor,
      predecessorFactor,
      predecessorBuoyedWeightLb: tap.weightAirLb * predecessorFactor,
      weightItRemovesLb: tap.weightAirLb * (factor - predecessorFactor),
      errorPct: ((factor - predecessorFactor) / factor) * 100,
    };
  });
};

export const buoyancyAtUnity = () => {
  const tap = publishedString('taper');
  return { lostToFluidLb: tap.weightAirLb - tap.weightFluidLb };
};

// ---------------------------------------------------------------------------
// 4. SECTIONS 5 AND 6. THE NOTE, AND THE LIMIT OF THE SCAN.
// ---------------------------------------------------------------------------

/**
 * A SECOND, INDEPENDENT ROUTE TO THE STEPPED BAR EIGENVALUES. The same transfer
 * matrix end force the engine states, walked on a uniform two million point grid
 * from zero so no root can be stepped over, with every sign change closed by
 * bisection. It exists ONLY to report the first three modes and to say whether
 * the engine's own scan found the first, which is what licenses section 6 being
 * written without alarm. It computes no engine quantity that the engine returns.
 */
const endForce = (string, omega) => {
  let u = 0;
  let fo = 1;
  for (const s of string.sections) {
    const k = omega / sectionWaveSpeedFtS(s);
    const kl = k * s.lengthFt;
    const z = ((ROD_ELASTIC_MODULUS_PSI * s.areaIn2) / 12) * k;
    const c = Math.cos(kl);
    const sn = Math.sin(kl);
    const un = c * u + (z > 0 ? (sn / z) * fo : 0);
    const fn = -z * sn * u + c * fo;
    u = un;
    fo = fn;
  }
  return fo;
};

export const MODE_SCAN_POINTS = 2000000;
export const MODE_SCAN_TOP_SPM = 400;

const modeScan = (string, count = 3, hiSpm = MODE_SCAN_TOP_SPM, N = MODE_SCAN_POINTS) => {
  const om = (spm) => (2 * Math.PI * spm) / 60;
  const out = [];
  let prevSpm = 1e-9;
  let prev = endForce(string, om(prevSpm));
  for (let i = 1; i <= N && out.length < count; i += 1) {
    const spm = (hiSpm * i) / N;
    const here = endForce(string, om(spm));
    if (prev * here < 0) {
      let lo = prevSpm;
      let up = spm;
      let fLo = prev;
      for (let j = 0; j < 200; j += 1) {
        const mid = 0.5 * (lo + up);
        const fMid = endForce(string, om(mid));
        if (fLo * fMid <= 0) { up = mid; } else { lo = mid; fLo = fMid; }
      }
      out.push(0.5 * (lo + up));
    }
    prevSpm = spm;
    prev = here;
  }
  return out;
};

export const STRING_IDS = Object.freeze(['uniform', 'taper', ODUMA.label]);

const stringById = (id) => (id === ODUMA.label ? teachingString() : publishedString(id));
const frequencyById = (id) => (id === ODUMA.label ? teachingFrequency() : publishedFrequency(id));

export const modeScanSpm = memoize((id) => modeScan(stringById(id)));

/**
 * TWO ROUTES TO ONE EIGENVALUE, and the labels differ on purpose. The engine
 * scan walks its own 400 point grid and bisects the first sign change it meets.
 * The mode scan walks the same end force on a dense uniform grid. They agree to
 * every figure on all three strings, which is why the limit of the scan can be
 * stated without alarm.
 */
export const noteRoutes = (id) => {
  const st = stringById(id);
  const frq = frequencyById(id);
  const modes = modeScanSpm(id);
  const gd = id === ODUMA.label ? null : golden.strings[id];
  return {
    id,
    oracleFundamentalSpm: gd ? gd.n0Spm : null,
    engineScanSpm: frq.nPrimeSpm,
    oracleDiffSpm: gd ? frq.nPrimeSpm - gd.n0Spm : null,
    modeScanSpm: modes,
    modeRatios: [modes[1] / modes[0], modes[2] / modes[0]],
    gapToSecondModeSpm: modes[1] - modes[0],
    uniform: frq.uniform === true,
    unresolved: frq.unresolved === true,
    n0Spm: frq.n0Spm,
    taperFactor: frq.taperFactor,
    acousticVelocityFtS: frq.acousticVelocityFtS,
    quarterWaveSpm: frq.acousticVelocityFtS
      ? (60 * frq.acousticVelocityFtS) / (4 * st.lengthFt)
      : null,
    shorthandSpm: 245000 / st.lengthFt,
    lengthFt: st.lengthFt,
  };
};

/**
 * THE GRID `naturalFrequency` ACTUALLY WALKS, replicated line for line from the
 * engine source so it can be PRINTED rather than described. The scan means to
 * lay 400 evenly spaced points between n0/20 and 4 n0; it adds its increment to
 * the running position instead of to the lower bound, so the spacing grows
 * without bound. This function lays out sample points and computes no
 * eigenvalue: the fundamental it reports is the engine's own.
 */
export const scanGridReplica = memoize((id) => {
  const string = stringById(id);
  const n0 = naturalFrequency({ string }).n0Spm;
  const hi = n0 * 4;
  const lo = n0 * 0.05;
  const steps = 400;
  let prevSpm = lo;
  const points = [lo];
  let inRange = 0;
  let widest = 0;
  let widestLo = null;
  let widestHi = null;
  for (let i = 1; i <= steps; i += 1) {
    const spm = prevSpm + ((hi - lo) * i) / steps;
    points.push(spm);
    if (spm <= hi) {
      inRange += 1;
      const gap = spm - prevSpm;
      if (gap > widest) { widest = gap; widestLo = prevSpm; widestHi = spm; }
    }
    prevSpm = spm;
  }
  const intended = (hi - lo) / steps;
  const fundamental = modeScanSpm(id)[0];
  const brk = points.findIndex((x) => x > fundamental);
  return {
    id,
    n0Spm: n0,
    loSpm: lo,
    hiSpm: hi,
    steps,
    intendedSpacingSpm: intended,
    points,
    pointsInRange: inRange + 1,
    pointsTotal: steps + 1,
    widestSpm: widest,
    widestLoSpm: widestLo,
    widestHiSpm: widestHi,
    widestOverIntended: widest / intended,
    lastPointSpm: points[points.length - 1],
    lastPointOverTop: points[points.length - 1] / hi,
    firstTwelve: points.slice(0, 12),
    firstTwelveIntervals: points.slice(1, 13).map((x, i) => x - points[i]),
    fundamentalSpm: fundamental,
    fundamentalIntervalLoSpm: points[brk - 1],
    fundamentalIntervalHiSpm: points[brk],
    fundamentalIntervalWidthSpm: points[brk] - points[brk - 1],
    secondModeAboveFirstSpm: modeScanSpm(id)[1] - fundamental,
  };
});

/** The engine REFUSES a design at or above the string's own fundamental. */
export const speedRefusal = () => {
  const frq = teachingFrequency();
  const spm = Math.ceil(frq.nPrimeSpm);
  const r = teachingDesign({ spm, fillage: 1 });
  return {
    askedSpm: spm,
    fundamentalSpm: frq.nPrimeSpm,
    ok: r.ok,
    errorCount: r.errors.length,
    message: r.errors[0],
  };
};

// ---------------------------------------------------------------------------
// 5. SECTIONS 7 AND 8. THE LINKAGE.
// ---------------------------------------------------------------------------

export const unitSummary = () => {
  const kin = unitKin();
  const geom = unitGeometry();
  const tfMax = Math.max(...kin.samples.map((s) => Math.abs(s.torqueFactorIn)));
  return {
    geometry: golden.unit.geometry,
    goldenStrokeIn: golden.unit.strokeIn,
    goldenUpstrokeFraction: golden.unit.upstrokeFraction,
    goldenTorqueFactorMaxIn: golden.unit.torqueFactorMaxIn,
    strokeIn: kin.strokeIn,
    upstrokeFraction: kin.upstrokeFraction,
    torqueFactorMaxIn: tfMax,
    strokeDiffIn: kin.strokeIn - golden.unit.strokeIn,
    upstrokeFractionDiff: kin.upstrokeFraction - golden.unit.upstrokeFraction,
    torqueFactorDiffIn: tfMax - golden.unit.torqueFactorMaxIn,
    beamSweepRad: kin.psiMax - kin.psiMin,
    sweepTimesFrontArmIn: geom.aIn * (kin.psiMax - kin.psiMin),
    crankAngleAtBottomDeg: (kin.crankAngleAtBottomRad * 180) / Math.PI,
    bottomIndex: kin.bottomIndex,
    sampleCount: kin.samples.length,
    upstrokePct: kin.upstrokeFraction * 100,
    upstrokeSecondsAt10Spm: (60 / 10) * kin.upstrokeFraction,
    downstrokeSecondsAt10Spm: (60 / 10) * (1 - kin.upstrokeFraction),
  };
};

/** The oracle's Newton closure, at every thirty degrees through a revolution. */
export const goldenUnitSamples = () => golden.unit.positionSample.map((positionIn, k) => ({
  crankDeg: k * 30,
  positionIn,
  torqueFactorIn: golden.unit.torqueFactorSample[k],
}));

export const UNIT_REVOLUTION_STEP_DEG = 15;

/**
 * The same revolution from the engine. Position is measured DOWNWARD from the
 * top of the stroke; a NEGATIVE torque factor is the polished rod going UP. The
 * closure residual is how far the solved point misses each of the two circles,
 * and it is at round-off, which is what says the closure is exact.
 */
export const unitRevolutionRows = memoize((spm = 10) => {
  const kin = unitKin();
  const geom = unitGeometry();
  const om = (2 * Math.PI * spm) / 60;
  const rows = [];
  for (let k = 0; k < 24; k += 1) {
    const s = kin.samples[k * UNIT_REVOLUTION_STEP_DEG];
    const px = -geom.crankBehindIn + geom.rIn * Math.cos(s.thetaRad);
    const py = -geom.crankBelowIn + geom.rIn * Math.sin(s.thetaRad);
    const ex = geom.cIn * Math.cos(s.psiRad);
    const ey = geom.cIn * Math.sin(s.psiRad);
    rows.push({
      crankDeg: k * UNIT_REVOLUTION_STEP_DEG,
      psiRad: s.psiRad,
      positionIn: s.positionIn,
      torqueFactorIn: s.torqueFactorIn,
      velocityInPerS: s.torqueFactorIn * om,
      rearArmResidualIn: Math.hypot(ex, ey) - geom.cIn,
      pitmanResidualIn: Math.hypot(ex - px, ey - py) - geom.pIn,
    });
  }
  return rows;
});

export const unitVelocityAsymmetry = (spm = 10) => {
  const kin = unitKin();
  const om = (2 * Math.PI * spm) / 60;
  const tfs = kin.samples.map((s) => s.torqueFactorIn);
  const fastestDown = Math.max(...tfs) * om;
  const fastestUp = Math.min(...tfs) * om;
  return {
    spm,
    fastestDownwardInPerS: fastestDown,
    fastestUpwardInPerS: fastestUp,
    slowerOverFaster: Math.abs(Math.min(...tfs) / Math.max(...tfs)),
  };
};

/**
 * WHAT A SINE WAVE WOULD HAVE SAID. The two curves are measured from OPPOSITE
 * ENDS, so the raw difference runs the whole stroke and almost all of that is
 * the convention. The aligned column is a REFLECTION, not a phase shift, and it
 * is the one to quote for how wrong a sine wave is.
 */
export const sineComparisonRows = memoize((stations = 24) => {
  const surf = surfacePosition();
  const sIn = unitStrokeIn();
  const shm = simpleHarmonicPosition(sIn / 12);
  const rows = [];
  for (let k = 0; k < stations; k += 1) {
    const tFrac = k / stations;
    const fourBarIn = surf(tFrac) * 12;
    const sineIn = shm(tFrac) * 12;
    const alignedIn = sIn - sineIn;
    rows.push({
      tFrac,
      fourBarIn,
      sineIn,
      rawDifferenceIn: fourBarIn - sineIn,
      alignedSineIn: alignedIn,
      shapeDifferenceIn: fourBarIn - alignedIn,
    });
  }
  return rows;
});

export const CRANK_RADII_IN = Object.freeze([20, 22, 24, 26, 28, 28.8, 30, 32, 34]);
export const FRONT_ARMS_IN = Object.freeze([80, 90, 100, 106.6667, 110, 120]);

/** The crank sets the stroke almost proportionally; the front arm exactly. */
export const crankSweepRows = memoize((radii = CRANK_RADII_IN) => radii.map((rIn) => {
  const kin = unitKinematics(conventionalGeometry({ ...golden.unit.geometry, rIn }), { steps: 360 });
  if (!kin.ok) return { rIn, ok: false, error: kin.error };
  return {
    rIn,
    ok: true,
    strokeIn: kin.strokeIn,
    upstrokeFraction: kin.upstrokeFraction,
    torqueFactorMaxIn: Math.max(...kin.samples.map((s) => Math.abs(s.torqueFactorIn))),
    strokeOverCrank: kin.strokeIn / rIn,
  };
}));

export const armSweepRows = memoize((arms = FRONT_ARMS_IN) => arms.map((aIn) => {
  const kin = unitKinematics(conventionalGeometry({ ...golden.unit.geometry, aIn }), { steps: 360 });
  return {
    aIn,
    strokeIn: kin.strokeIn,
    upstrokeFraction: kin.upstrokeFraction,
    strokeOverArm: kin.strokeIn / aIn,
  };
}));

/** A linkage that cannot close is REPORTED, not clamped. */
export const closureRefusal = () => {
  const kin = unitKinematics(conventionalGeometry({ ...golden.unit.geometry, pIn: 20 }), { steps: 360 });
  return { ok: kin.ok, message: kin.error };
};

export const GENERIC_STROKES_IN = Object.freeze([54, 74, 100, 120, 144]);

/** The package ships NO named unit dimensions. The generic geometry says so. */
export const genericLinkageRows = memoize((wants = GENERIC_STROKES_IN) => wants.map((requestedIn) => {
  const gg = genericConventionalGeometry({ strokeIn: requestedIn });
  const kin = unitKinematics(gg.geometry, { steps: 360 });
  return {
    requestedIn,
    achievedIn: kin.strokeIn,
    aIn: gg.geometry.aIn,
    cIn: gg.geometry.cIn,
    pIn: gg.geometry.pIn,
    rIn: gg.geometry.rIn,
    upstrokeFraction: kin.upstrokeFraction,
    note: gg.note,
  };
}));

export const UNIT_DESIGNATIONS = Object.freeze([
  'C-320D-200-100', 'C-456D-256-120', 'M-228D-173-86', 'A-640D-305-120',
]);

export const designationRows = (list = UNIT_DESIGNATIONS) => list.map((designation) => {
  const p = parseUnitDesignation(designation);
  return {
    designation,
    kind: p.kind,
    torqueRatingInLb: p.torqueRatingInLb,
    structuralCapacityLb: p.structuralCapacityLb,
    strokeIn: p.strokeIn,
    reduction: p.reduction,
  };
});

export const designationRefusal = () => parseUnitDesignation('not a unit');

// ---------------------------------------------------------------------------
// 6. SECTION 9. THE PUMP.
// ---------------------------------------------------------------------------

export const TEACHING_DIFFERENTIAL_PSI = ODUMA.pDischargePsia - ODUMA.pIntakePsia;

/**
 * The displacement constant already contains pi over four, so it multiplies the
 * DIAMETER SQUARED and not the area. The predecessor multiplied by the area,
 * applied pi over four twice, and understated displacement by about a fifth.
 */
export const plungerRows = (sizes = PLUNGER_SIZES) => {
  const strokeIn = unitStrokeIn();
  return sizes.map((dIn) => {
    const areaIn2 = rodArea(dIn);
    const ratedBpd = displacementBpd({ plungerDIn: dIn, strokeIn, spm: ODUMA.spm });
    const areaFormBpd = PUMP_CONSTANT * areaIn2 * strokeIn * ODUMA.spm;
    return {
      dIn,
      areaIn2,
      fluidLoadLb: fluidLoadLb({
        plungerDIn: dIn,
        pDischargePsi: ODUMA.pDischargePsia,
        pIntakePsi: ODUMA.pIntakePsia,
      }),
      volumePerStrokeIn3: areaIn2 * strokeIn,
      volumePerStrokeBbl: (areaIn2 * strokeIn) / IN3_PER_BBL,
      ratedBpd,
      areaFormBpd,
      understatedPct: (1 - areaFormBpd / ratedBpd) * 100,
    };
  });
};

export const FLUID_LOAD_DIFFERENTIALS_PSI = Object.freeze([400, 800, 1200, 1600, 1950, 2400, 2800]);

/** Fluid load is a differential times an area, so it is linear in both. */
export const fluidLoadRows = (differentials = FLUID_LOAD_DIFFERENTIALS_PSI) => {
  const tap = publishedString('taper');
  return differentials.map((dpPsi) => {
    const loadLb = fluidLoadLb({
      plungerDIn: ODUMA.plungerDIn,
      pDischargePsi: dpPsi + ODUMA.pIntakePsia,
      pIntakePsi: ODUMA.pIntakePsia,
    });
    return {
      dpPsi,
      loadLb,
      staticStretchIn: rodStretchIn({ string: tap, loadLb }),
    };
  });
};

/** The engine REFUSES a plunger with nothing to lift rather than returning zero. */
export const pumpRefusal = () => {
  const r = runRodPumpDesign({
    string: publishedString('taper'),
    frequency: publishedFrequency('taper'),
    surfacePosition: surfacePosition(),
    strokeIn: unitStrokeIn(),
    spm: 8,
    plungerDIn: ODUMA.plungerDIn,
    pDischargePsi: 600,
    pIntakePsi: 900,
    dampingRatio: 0.1,
  });
  return {
    ok: r.ok,
    wouldBeLoadLb: fluidLoadLb({ plungerDIn: ODUMA.plungerDIn, pDischargePsi: 600, pIntakePsi: 900 }),
    message: r.errors[0],
  };
};

/** ODUMA-4's pump, in one object. Every line is closed form. */
export const teachingPump = () => {
  const strokeIn = unitStrokeIn();
  const areaIn2 = rodArea(ODUMA.plungerDIn);
  return {
    fluidLoadLb: teachingFluidLoadLb(),
    plungerAreaIn2: areaIn2,
    volumePerStrokeIn3: areaIn2 * strokeIn,
    volumePerStrokeBbl: (areaIn2 * strokeIn) / IN3_PER_BBL,
    ratedBpd: displacementBpd({ plungerDIn: ODUMA.plungerDIn, strokeIn, spm: ODUMA.spm }),
    fundamentalSpm: teachingFrequency().nPrimeSpm,
    speedOverFundamental: ODUMA.spm / teachingFrequency().nPrimeSpm,
  };
};

// ---------------------------------------------------------------------------
// 7. SECTIONS 11 TO 13. THE PUBLISHED CARDS, THE SPRING RULE AND THE MARCH.
// ---------------------------------------------------------------------------

const cardSummary = (r, spm) => ({
  spm,
  plungerStrokeIn: r.plungerStrokeIn,
  prlPeakLb: r.prlPeakLb,
  prlMinLb: r.prlMinLb,
  loadRangeLb: r.prlPeakLb - r.prlMinLb,
  cardAreaInLb: r.workInLbPerCycle,
  prhp: polishedRodHp({ workInLbPerCycle: r.workInLbPerCycle, spm }),
  samples: r.samples,
  cardPoints: r.surfaceCard.length,
  stride: Math.max(1, Math.floor(r.samples / 180)),
  converged: r.converged,
  cycles: r.cycles,
  warnings: warningCodes(r.warnings),
  dtS: r.dt,
  kappaPerS: r.kappaPerS,
  waveSpeedFtS: r.waveSpeedFtS,
});

/**
 * The published predictive cases against the oracle that committed them. Two
 * numerical routes to the same physics: the oracle marched a staggered grid with
 * RK4 on the velocity and tension system, the engine marches displacement on a
 * collocated grid with an explicit central difference.
 */
export const publishedPredictRow = (spm) => {
  const g = golden.predict.bySpm[String(spm)];
  const r = publishedCard(spm);
  const tap = publishedString('taper');
  return {
    ...cardSummary(r, spm),
    goldenPlungerStrokeIn: g.plungerStrokeIn,
    goldenPprlLb: g.pprlLb,
    goldenMprlLb: g.mprlLb,
    plungerStrokeDiffIn: r.plungerStrokeIn - g.plungerStrokeIn,
    plungerStrokeDiffPct: pct(r.plungerStrokeIn, g.plungerStrokeIn),
    pprlDiffLb: r.prlPeakLb - g.pprlLb,
    pprlDiffPct: pct(r.prlPeakLb, g.pprlLb),
    mprlDiffLb: r.prlMinLb - g.mprlLb,
    mprlDiffPct: pct(r.prlMinLb, g.mprlLb),
    buoyedWeightLb: tap.weightFluidLb,
    peakAboveBuoyedLb: r.prlPeakLb - tap.weightFluidLb,
    minBelowBuoyedLb: tap.weightFluidLb - r.prlMinLb,
  };
};

export const publishedPredictRows = () => PUBLISHED_PREDICT.spms.map(publishedPredictRow);

export const WAVE_TRANSIT_SPMS = Object.freeze([0.5, 1, 2, 3, 5, 7, 9, 11, 13, 15]);

/**
 * How many times the wave crosses the string in one stroke. A string the wave
 * crosses a hundred times a stroke is a spring; one it crosses a handful of
 * times is a wave machine, and the two rules for the plunger stroke separate
 * over exactly that range.
 */
export const waveTransitRows = (spms = WAVE_TRANSIT_SPMS) => {
  const tap = publishedString('taper');
  const waveSpeedFtS = publishedCard(9).waveSpeedFtS;
  const roundTripS = (2 * tap.lengthFt) / waveSpeedFtS;
  const fundamental = publishedFrequency('taper').nPrimeSpm;
  return spms.map((spm) => ({
    spm,
    periodS: 60 / spm,
    roundTripsPerStroke: (60 / spm) / roundTripS,
    speedOverFundamental: spm / fundamental,
  }));
};

export const waveTransitHeadline = () => {
  const tap = publishedString('taper');
  const waveSpeedFtS = publishedCard(9).waveSpeedFtS;
  return {
    lengthFt: tap.lengthFt,
    waveSpeedFtS,
    oneWayTransitS: tap.lengthFt / waveSpeedFtS,
    roundTripS: (2 * tap.lengthFt) / waveSpeedFtS,
  };
};

/** The engine REFUSES an undamped march rather than producing a confident answer. */
export const dampingRefusal = () => {
  const r = publishedCard(9, { dampingRatio: 0 });
  return { ok: r.ok, message: r.error };
};

/** S - Fo Er. Closed form, and it does not depend on speed. */
export const springRuleIn = (strokeIn, fluidLoadLb_, string) => strokeIn - fluidLoadLb_ * string.erInPerLb;

export const publishedSpringRule = () => {
  const tap = publishedString('taper');
  return {
    strokeIn: PUBLISHED_PREDICT.strokeIn,
    fluidLoadLb: PUBLISHED_PREDICT.fluidLoadLb,
    erInPerLb: tap.erInPerLb,
    staticStretchIn: PUBLISHED_PREDICT.fluidLoadLb * tap.erInPerLb,
    springRuleIn: springRuleIn(PUBLISHED_PREDICT.strokeIn, PUBLISHED_PREDICT.fluidLoadLb, tap),
  };
};

export const teachingSpringRule = () => {
  const st = teachingString();
  return {
    strokeIn: unitStrokeIn(),
    fluidLoadLb: teachingFluidLoadLb(),
    erInPerLb: st.erInPerLb,
    staticStretchIn: teachingFluidLoadLb() * st.erInPerLb,
    springRuleIn: springRuleIn(unitStrokeIn(), teachingFluidLoadLb(), st),
  };
};

export const PUBLISHED_OVERTRAVEL_SPMS = Object.freeze([
  0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
]);

/**
 * The ladder in full, from the near static bottom to the top of the useful
 * range. The wave answer is longer at every speed and the difference is inertial
 * overtravel, but it is NOT MONOTONE: single rows step back below the row before
 * them, because the settled cycle a march lands on depends on where the valve
 * transfers fall relative to the wave arriving back from the pump. Never quote a
 * rising trio and call it a trend.
 */
export const publishedOvertravelRows = memoize((spms = PUBLISHED_OVERTRAVEL_SPMS) => {
  const tap = publishedString('taper');
  const rule = springRuleIn(PUBLISHED_PREDICT.strokeIn, PUBLISHED_PREDICT.fluidLoadLb, tap);
  const fundamental = publishedFrequency('taper').nPrimeSpm;
  return spms.map((spm) => {
    const r = publishedCard(spm);
    return {
      spm,
      springRuleIn: rule,
      waveMarchIn: r.plungerStrokeIn,
      overtravelIn: r.plungerStrokeIn - rule,
      overtravelPct: ((r.plungerStrokeIn - rule) / rule) * 100,
      speedOverFundamental: spm / fundamental,
      converged: r.converged,
      prlPeakLb: r.prlPeakLb,
      prlMinLb: r.prlMinLb,
      buoyedPlusFluidLb: tap.weightFluidLb + PUBLISHED_PREDICT.fluidLoadLb,
      buoyedWeightLb: tap.weightFluidLb,
    };
  });
});

export const TEACHING_OVERTRAVEL_SPMS = Object.freeze([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

export const teachingOvertravelRows = memoize((spms = TEACHING_OVERTRAVEL_SPMS) => {
  const st = teachingString();
  const rule = springRuleIn(unitStrokeIn(), teachingFluidLoadLb(), st);
  const fundamental = teachingFrequency().nPrimeSpm;
  return spms.map((spm) => {
    const d = teachingDesign({ spm });
    if (!d.ok) return { spm, ok: false, message: d.errors[0], springRuleIn: rule };
    return {
      spm,
      ok: true,
      springRuleIn: rule,
      waveMarchIn: d.design.plungerStrokeIn,
      overtravelIn: d.design.plungerStrokeIn - rule,
      overtravelPct: ((d.design.plungerStrokeIn - rule) / rule) * 100,
      speedOverFundamental: spm / fundamental,
    };
  });
});

export const OVERTRAVEL_LOADS_LB = Object.freeze([1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000]);

/**
 * The overtravel is an inertia effect, so it shrinks when the string is stiffer
 * relative to the load it carries. The spring rule moves too, because Fo is in
 * it, so the PERCENTAGE is the column to read.
 */
export const overtravelByLoadRows = memoize((loads = OVERTRAVEL_LOADS_LB) => {
  const tap = publishedString('taper');
  return loads.map((fluidLoad) => {
    const r = publishedCard(9, { fluidLoadLb: fluidLoad });
    const rule = springRuleIn(PUBLISHED_PREDICT.strokeIn, fluidLoad, tap);
    return {
      fluidLoadLb: fluidLoad,
      springRuleIn: rule,
      waveMarchIn: r.plungerStrokeIn,
      overtravelIn: r.plungerStrokeIn - rule,
      overtravelPct: ((r.plungerStrokeIn - rule) / rule) * 100,
    };
  });
});

export const STATIC_STRETCH_LOADS_LB = Object.freeze([1000, 2500, 5000, 7500, 10000]);

/** rodStretchIn is Er times the load, so it is linear. */
export const staticStretchRows = (loads = STATIC_STRETCH_LOADS_LB) => loads.map((loadLb) => ({
  loadLb,
  taperIn: rodStretchIn({ string: publishedString('taper'), loadLb }),
  uniformIn: rodStretchIn({ string: publishedString('uniform'), loadLb }),
  teachingIn: rodStretchIn({ string: teachingString(), loadLb }),
}));

export const teachingStaticStretch = () => {
  const st = teachingString();
  const loadLb = teachingFluidLoadLb();
  const stretchIn = rodStretchIn({ string: st, loadLb });
  return {
    loadLb,
    stretchIn,
    pctOfSurfaceStroke: (stretchIn / unitStrokeIn()) * 100,
  };
};

// ---------------------------------------------------------------------------
// 8. SECTIONS 14 TO 16. THE TEACHING DESIGN, POWER, AND THE TWO SAMPLINGS.
// ---------------------------------------------------------------------------

/**
 * What `runRodPumpDesign` RETURNS on ODUMA-4. Every load here is the SUBSAMPLED
 * pair, because that is what the function reports and what a studio user sees.
 * `envelopeSplit()` is what the march actually computed.
 */
export const teachingDesignSummary = () => {
  const d = teachingDesign();
  const g = d.design;
  return {
    ok: d.ok,
    errorCount: d.errors.length,
    warnings: warningCodes(g.warnings),
    fluidLoadLb: g.fluidLoadLb,
    plungerAreaIn2: g.plungerAreaIn2,
    plungerStrokeIn: g.plungerStrokeIn,
    pprlLb: g.pprlLb,
    mprlLb: g.mprlLb,
    loadRangeLb: g.pprlLb - g.mprlLb,
    cardAreaInLb: g.cardAreaInLb,
    prhp: g.prhp,
    ratedBpd: g.ratedBpd,
    sweptBpd: g.sweptBpd,
    producedBpd: g.producedBpd,
    producedOverRated: g.producedBpd / g.ratedBpd,
    samples: g.dynamics.samples,
    cardPoints: g.dynamics.surfaceCard.length,
    stride: Math.max(1, Math.floor(g.dynamics.samples / 180)),
    converged: g.dynamics.converged,
    cycles: g.dynamics.cycles,
    dtS: g.dynamics.dt,
    kappaPerS: g.dynamics.kappaPerS,
    envelopeNodes: g.dynamics.tensionEnvelope.length,
    shallowestNodeFt: g.dynamics.tensionEnvelope[0].depthFt,
    deepestNodeFt: g.dynamics.tensionEnvelope[g.dynamics.tensionEnvelope.length - 1].depthFt,
    worstSectionLabel: g.worstSection.label,
    worstSectionLoadingPct: g.worstSection.loadingPct,
  };
};

/** The RP 11L dimensionless groups. They are definitions, so they are computed
 * whatever route produced the loads. torqueGroup is ZERO with no balance passed,
 * and that zero is `torqueGroupFailsOpen()`. */
export const teachingGroups = () => {
  const g = teachingDesign().design.groups;
  return {
    nOverN0: g.nOverN0,
    nOverNPrime: g.nOverNPrime,
    foOverSkr: g.foOverSkr,
    spOverS: g.spOverS,
    f1OverSkr: g.f1OverSkr,
    f2OverSkr: g.f2OverSkr,
    skrLb: g.skrLb,
    torqueGroup: g.torqueGroup,
  };
};

/** The section stresses as the design returns them, at the given service factor. */
export const teachingStressRows = (serviceFactor = ODUMA.serviceFactor) => {
  const g = teachingDesign({ serviceFactor }).design;
  const env = g.dynamics.tensionEnvelope;
  return g.stresses.map((s, i) => ({
    index: i + 1,
    label: s.label,
    topDepthFt: s.topDepthFt,
    envelopeSampleFt: env.reduce(
      (a, b) => (Math.abs(b.depthFt - s.topDepthFt) < Math.abs(a.depthFt - s.topDepthFt) ? b : a),
      env[0],
    ).depthFt,
    maxLoadLb: s.maxLoadLb,
    minLoadLb: s.minLoadLb,
    maxStressPsi: s.maxStressPsi,
    minStressPsi: s.minStressPsi,
    allowablePsi: s.allowablePsi,
    loadingPct: s.loadingPct,
  }));
};

/** The decimated surface card the function returns, at an even stride. */
export const teachingSurfaceCardRows = (stations = 24) => {
  const c = teachingDesign().design.dynamics.surfaceCard;
  const step = Math.max(1, Math.floor(c.length / stations));
  const rows = [];
  for (let i = 0; i < c.length; i += step) {
    rows.push({
      index: i + 1,
      of: c.length,
      tFrac: c[i].tFrac,
      positionIn: c[i].positionIn,
      loadLb: c[i].loadLb,
    });
  }
  return rows;
};

/** The pump card from the same march. Its two vertical sides ARE the transfers. */
export const teachingPumpCardRows = (stations = 24) => {
  const c = teachingDesign().design.dynamics.pumpCard;
  const step = Math.max(1, Math.floor(c.length / stations));
  const rows = [];
  for (let i = 0; i < c.length; i += step) {
    rows.push({
      index: i + 1,
      of: c.length,
      tFrac: c[i].tFrac,
      positionIn: c[i].positionIn,
      loadLb: c[i].loadLb,
    });
  }
  return rows;
};

export const teachingCardAreas = () => {
  const g = teachingDesign().design;
  const pumpAreaInLb = cardArea(g.dynamics.pumpCard);
  return {
    surfaceAreaInLb: g.cardAreaInLb,
    pumpAreaInLb,
    differenceInLb: g.cardAreaInLb - pumpAreaInLb,
    fluidLoadLb: teachingFluidLoadLb(),
  };
};

export const DAMPING_RATIOS = Object.freeze([0.05, 0.06, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20]);

/** The damping ratio is the input nobody measures, and it moves both loads. */
export const dampingSweepRows = memoize((ratios = DAMPING_RATIOS) => ratios.map((dampingRatio) => {
  const d = teachingDesign({ dampingRatio });
  if (!d.ok) return { dampingRatio, ok: false, message: d.errors[0] };
  const g = d.design;
  return {
    dampingRatio,
    ok: true,
    plungerStrokeIn: g.plungerStrokeIn,
    pprlLb: g.pprlLb,
    mprlLb: g.mprlLb,
    loadRangeLb: g.pprlLb - g.mprlLb,
    prhp: g.prhp,
    producedBpd: g.producedBpd,
    worstLoadingPct: g.worstSection.loadingPct,
    kappaPerS: g.dynamics.kappaPerS,
    converged: g.dynamics.converged,
    warnings: warningCodes(g.warnings),
    notPeriodic: hasWarning(g.warnings, 'notPeriodic'),
  };
}));

export const dampingSweepSpread = (ratios = DAMPING_RATIOS) => {
  const rows = dampingSweepRows(ratios).filter((r) => r.ok);
  return {
    pprlSpreadLb: spread(rows.map((r) => r.pprlLb)),
    mprlSpreadLb: spread(rows.map((r) => r.mprlLb)),
    plungerStrokeSpreadIn: spread(rows.map((r) => r.plungerStrokeIn)),
  };
};

export const PLUNGER_SWEEP_IN = Object.freeze([1.25, 1.5, 1.75, 2.0, 2.25]);

/** The plunger size moves the load and the volume in opposite directions. */
export const plungerSweepRows = memoize((sizes = PLUNGER_SWEEP_IN) => sizes.map((plungerDIn) => {
  const d = teachingDesign({ plungerDIn });
  if (!d.ok) return { plungerDIn, ok: false, message: d.errors[0] };
  const g = d.design;
  return {
    plungerDIn,
    ok: true,
    fluidLoadLb: g.fluidLoadLb,
    plungerStrokeIn: g.plungerStrokeIn,
    pprlLb: g.pprlLb,
    mprlLb: g.mprlLb,
    producedBpd: g.producedBpd,
    worstLoadingPct: g.worstSection.loadingPct,
    prhp: g.prhp,
    warnings: warningCodes(g.warnings),
  };
}));

export const GRAVITY_SWEEP_SG = Object.freeze([0.75, 0.80, 0.85, 0.90, 0.95, 1.00, 1.05]);

/**
 * The fluid gravity moves the buoyed weight and therefore both loads, and it
 * moves nothing else in the string: the spring rate and the elastic constant are
 * properties of the steel and the geometry.
 */
export const gravitySweepRows = memoize((sgs = GRAVITY_SWEEP_SG) => sgs.map((fluidSg) => {
  const string = buildRodString({
    sections: ODUMA.sections.map((s) => ({ ...s })),
    fluidSg,
    gradeId: ODUMA.gradeId,
  });
  const d = runRodPumpDesign({
    string,
    frequency: naturalFrequency({ string }),
    surfacePosition: surfacePosition(),
    strokeIn: unitStrokeIn(),
    spm: ODUMA.spm,
    plungerDIn: ODUMA.plungerDIn,
    pDischargePsi: ODUMA.pDischargePsia,
    pIntakePsi: ODUMA.pIntakePsia,
    fillage: ODUMA.fillage,
    dampingRatio: ODUMA.dampingRatio,
    serviceFactor: ODUMA.serviceFactor,
  });
  return {
    fluidSg,
    buoyancy: string.buoyancy,
    weightFluidLb: string.weightFluidLb,
    krLbPerIn: string.krLbPerIn,
    erInPerLb: string.erInPerLb,
    pprlLb: d.design.pprlLb,
    mprlLb: d.design.mprlLb,
    plungerStrokeIn: d.design.plungerStrokeIn,
    worstLoadingPct: d.design.worstSection.loadingPct,
  };
}));

export const POWER_SPMS = Object.freeze([6, 8, 10, 12]);

/**
 * Polished rod horsepower is the card area times the speed over 396000. It is
 * the power delivered AT THE POLISHED ROD: no gearbox loss, no belt loss, no
 * motor efficiency and no counterbalance work.
 */
export const powerRows = memoize((spms = POWER_SPMS) => spms.map((spm) => {
  const d = teachingDesign({ spm });
  if (!d.ok) return { spm, ok: false, message: d.errors[0] };
  const g = d.design;
  return {
    spm,
    ok: true,
    cardAreaInLb: g.cardAreaInLb,
    prhp: g.prhp,
    areaTimesSpeedOver396000: (g.cardAreaInLb * spm) / (12 * 33000),
  };
}));

export const publishedPowerRows = () => PUBLISHED_PREDICT.spms.map((spm) => {
  const r = publishedCard(spm);
  return {
    spm,
    cardAreaInLb: r.workInLbPerCycle,
    prhp: polishedRodHp({ workInLbPerCycle: r.workInLbPerCycle, spm }),
  };
});

export const teachingPowerPerBarrel = () => {
  const g = teachingDesign().design;
  return { hpPerBpd: g.prhp / g.producedBpd, prhp: g.prhp, producedBpd: g.producedBpd };
};

export const DEFAULT_CARD_SAMPLES = 180;
export const DEFAULT_NODES = 120;
export const DEFAULT_MAX_CYCLES = 20;
export const DEFAULT_MARCH_TOL = 1e-4;

/**
 * What the march accumulates and what it then throws away. The tension envelope
 * is accumulated over EVERY marched step at every node. The surface card is
 * DECIMATED, and `prlPeakLb` and `prlMinLb` are read off THAT subsample.
 * `runRodPumpDesign` exposes neither `cardSamples` nor `nodes`, so a studio user
 * gets the subsampled pair and cannot ask for the other one.
 */
export const samplingSummary = () => {
  const g = teachingDesign().design;
  const st = teachingString();
  return {
    samples: g.dynamics.samples,
    cardSamplesDefault: DEFAULT_CARD_SAMPLES,
    stride: Math.max(1, Math.floor(g.dynamics.samples / DEFAULT_CARD_SAMPLES)),
    cardPoints: g.dynamics.surfaceCard.length,
    keptPct: (g.dynamics.surfaceCard.length / g.dynamics.samples) * 100,
    envelopeNodes: g.dynamics.tensionEnvelope.length,
    nodeSpacingFt: st.lengthFt / DEFAULT_NODES,
    shallowestNodeFt: g.dynamics.tensionEnvelope[0].depthFt,
    nodesDefault: DEFAULT_NODES,
    maxCyclesDefault: DEFAULT_MAX_CYCLES,
    tolDefault: DEFAULT_MARCH_TOL,
    forwardedByDesign: false,
  };
};

export const publishedSamplingRows = () => PUBLISHED_PREDICT.spms.map((spm) => {
  const r = publishedCard(spm);
  return {
    spm,
    samples: r.samples,
    cardPoints: r.surfaceCard.length,
    stride: Math.max(1, Math.floor(r.samples / DEFAULT_CARD_SAMPLES)),
    dtS: r.dt,
    converged: r.converged,
    cycles: r.cycles,
  };
});

// ---------------------------------------------------------------------------
// 9. SECTIONS 17 AND 18. THE SUBSAMPLE, AND THE TWO PEAK LOADS.
// ---------------------------------------------------------------------------

export const CARD_SAMPLES_LADDER = Object.freeze([
  45, 60, 90, 120, 180, 240, 360, 540, 900, 1500, 3000, 7000, 20000,
]);

export const FULL_MARCH_CARD_SAMPLES = 1000000;

export const SUBSAMPLE_CASE_IDS = Object.freeze([
  'published taper at 9 spm', 'published taper at 5 spm', ODUMA.label,
]);

const subsampleCase = (id) => {
  if (id === 'published taper at 9 spm') return (over) => publishedCard(9, over);
  if (id === 'published taper at 5 spm') return (over) => publishedCard(5, over);
  return (over) => teachingCard(over);
};

/**
 * ONLY `cardSamples` changes. The march is bit for bit identical at every row:
 * same nodes, same time step, same cycles, same plunger stroke. What moves is
 * which of the marched steps survive into the card the two loads are read off.
 * Neither column is monotone, and the minimum moves much further than the peak.
 */
export const cardSamplesRows = memoize((id, ladder = CARD_SAMPLES_LADDER) => {
  const mk = subsampleCase(id);
  return ladder.map((cardSamples) => {
    const r = mk({ cardSamples });
    return {
      cardSamples,
      cardPoints: r.surfaceCard.length,
      stride: Math.max(1, Math.floor(r.samples / cardSamples)),
      prlPeakLb: r.prlPeakLb,
      prlMinLb: r.prlMinLb,
      loadRangeLb: r.prlPeakLb - r.prlMinLb,
      cardAreaInLb: r.workInLbPerCycle,
      plungerStrokeIn: r.plungerStrokeIn,
    };
  });
});

/** What the shipped default costs, against the march itself at stride 1. */
export const cardSamplesCost = memoize((id) => {
  const mk = subsampleCase(id);
  const full = mk({ cardSamples: FULL_MARCH_CARD_SAMPLES });
  const dflt = mk({});
  return {
    id,
    marchedSteps: full.samples,
    marchedPeakLb: full.prlPeakLb,
    marchedMinLb: full.prlMinLb,
    marchedRangeLb: full.prlPeakLb - full.prlMinLb,
    marchedCardAreaInLb: full.workInLbPerCycle,
    reportedPeakLb: dflt.prlPeakLb,
    reportedMinLb: dflt.prlMinLb,
    reportedRangeLb: dflt.prlPeakLb - dflt.prlMinLb,
    reportedCardAreaInLb: dflt.workInLbPerCycle,
    peakLowByLb: full.prlPeakLb - dflt.prlPeakLb,
    peakLowByPct: ((full.prlPeakLb - dflt.prlPeakLb) / full.prlPeakLb) * 100,
    minHighByLb: dflt.prlMinLb - full.prlMinLb,
    minHighByPct: ((dflt.prlMinLb - full.prlMinLb) / full.prlMinLb) * 100,
    reportedOverMarchedMin: dflt.prlMinLb / full.prlMinLb,
    rangeNarrowByLb: (full.prlPeakLb - full.prlMinLb) - (dflt.prlPeakLb - dflt.prlMinLb),
    rangeNarrowByPct: (1 - (dflt.prlPeakLb - dflt.prlMinLb) / (full.prlPeakLb - full.prlMinLb)) * 100,
    cardAreaLowByInLb: full.workInLbPerCycle - dflt.workInLbPerCycle,
    cardAreaLowByPct: ((full.workInLbPerCycle - dflt.workInLbPerCycle) / full.workInLbPerCycle) * 100,
    plungerStrokeDefaultIn: dflt.plungerStrokeIn,
    plungerStrokeFullIn: full.plungerStrokeIn,
    plungerStrokeDiffIn: full.plungerStrokeIn - dflt.plungerStrokeIn,
  };
});

export const SUBSAMPLE_SPEEDS = Object.freeze([7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0]);

/**
 * How big the subsample error is depends entirely on the case, so a lesson must
 * not quote one percentage as though it were a property of the engine. Where the
 * two minima have OPPOSITE SIGNS the row says so instead of returning a ratio,
 * because that is a bigger finding than a ratio: a negative polished rod load is
 * the rods in compression, which is the one verdict the minimum exists to give.
 */
export const subsampleBySpeedRows = memoize((spms = SUBSAMPLE_SPEEDS) => spms.map((spm) => {
  const a = teachingCard({ spm });
  const b = teachingCard({ spm, cardSamples: FULL_MARCH_CARD_SAMPLES });
  const sameSign = (a.prlMinLb > 0) === (b.prlMinLb > 0);
  return {
    spm,
    reportedMinLb: a.prlMinLb,
    marchedMinLb: b.prlMinLb,
    reportedPeakLb: a.prlPeakLb,
    marchedPeakLb: b.prlPeakLb,
    peakLowByPct: ((b.prlPeakLb - a.prlPeakLb) / b.prlPeakLb) * 100,
    sameSign,
    reportedOverMarchedMin: sameSign ? a.prlMinLb / b.prlMinLb : null,
  };
}));

export const SUBSAMPLE_FILLAGES = Object.freeze([1.00, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70]);

/** The emptier the barrel the sharper the transfer, and the more a coarse card misses. */
export const subsampleByFillageRows = memoize((fillages = SUBSAMPLE_FILLAGES) => fillages.map((fillage) => {
  const a = teachingCard({ fillage });
  const b = teachingCard({ fillage, cardSamples: FULL_MARCH_CARD_SAMPLES });
  return {
    fillage,
    reportedMinLb: a.prlMinLb,
    marchedMinLb: b.prlMinLb,
    reportedOverMarched: a.prlMinLb / b.prlMinLb,
    reportedPeakLb: a.prlPeakLb,
    marchedPeakLb: b.prlPeakLb,
    peakLowByPct: ((b.prlPeakLb - a.prlPeakLb) / b.prlPeakLb) * 100,
  };
}));

/**
 * TWO PEAK LOADS OUT OF ONE RETURN OBJECT, and the labels differ on purpose.
 * `prlPeakLb` is the maximum of the DECIMATED card. The envelope top is
 * `tensionEnvelope[0].maxLb` accumulated over every marched step, plus the
 * buoyed weight of the rod above that node, because the shallowest envelope
 * sample sits at dx/2 and not at the surface.
 */
export const envelopeSplit = () => {
  const r = teachingCard();
  const st = teachingString();
  const env0 = r.tensionEnvelope[0];
  const aboveLb = st.sections[0].weightLbPerFt * env0.depthFt * st.buoyancy;
  const impliedLb = env0.maxLb + aboveLb;
  const full = teachingCard({ cardSamples: FULL_MARCH_CARD_SAMPLES });
  return {
    shallowestNodeFt: env0.depthFt,
    envelopeMaxLb: env0.maxLb,
    envelopeMinLb: env0.minLb,
    buoyedRodAboveLb: aboveLb,
    impliedPeakLb: impliedLb,
    reportedPeakLb: r.prlPeakLb,
    disagreementLb: impliedLb - r.prlPeakLb,
    disagreementPct: ((impliedLb - r.prlPeakLb) / r.prlPeakLb) * 100,
    marchedPeakLb: full.prlPeakLb,
    envelopeFromMarchedLb: impliedLb - full.prlPeakLb,
    reportedFromMarchedLb: r.prlPeakLb - full.prlPeakLb,
    halfNodeLightPct: (aboveLb / impliedLb) * 100,
  };
};

/** The whole envelope, at every eighth node from the surface down. */
export const envelopeProfileRows = (stride = 8) => {
  const env = teachingCard().tensionEnvelope;
  const rows = [];
  for (let i = 0; i < env.length; i += stride) {
    rows.push({
      index: i + 1,
      of: env.length,
      depthFt: env[i].depthFt,
      maxLb: env[i].maxLb,
      minLb: env[i].minLb,
      rangeLb: env[i].maxLb - env[i].minLb,
    });
  }
  const last = env[env.length - 1];
  if (rows[rows.length - 1].depthFt !== last.depthFt) {
    rows.push({
      index: env.length,
      of: env.length,
      depthFt: last.depthFt,
      maxLb: last.maxLb,
      minLb: last.minLb,
      rangeLb: last.maxLb - last.minLb,
    });
  }
  return rows;
};

/**
 * WHICH CHECK READS WHICH. `C-320D-198-100` is a TEACHING DESIGNATION, not a
 * manufacturer product: the package ships no named unit dimensions and
 * `parseUnitDesignation` will read any well formed string. Its structural
 * capacity was chosen to sit BETWEEN the subsampled peak and the marched peak,
 * so the two routes return different verdicts on the same design.
 */
export const TEACHING_DESIGNATION = 'C-320D-198-100';
export const STANDARD_DESIGNATION = 'C-320D-200-100';

export const ratingSplit = memoize((designation = TEACHING_DESIGNATION) => {
  const rating = parseUnitDesignation(designation);
  const d = teachingDesign({ unitRating: rating });
  const full = teachingCard({ cardSamples: FULL_MARCH_CARD_SAMPLES });
  return {
    designation,
    structuralCapacityLb: rating.structuralCapacityLb,
    strokeRatingIn: rating.strokeIn,
    torqueRatingInLb: rating.torqueRatingInLb,
    structuralPctFromReported: d.design.rating.structuralPct,
    structuralPctFromMarched: (full.prlPeakLb / rating.structuralCapacityLb) * 100,
    warnings: warningCodes(d.design.warnings),
    structuralOverloadRaised: hasWarning(d.design.warnings, 'structuralOverload'),
    strokePct: d.design.rating.strokePct,
    torquePct: d.design.rating.torquePct,
    worstLoadingPct: d.design.worstSection.loadingPct,
  };
});

// ---------------------------------------------------------------------------
// 10. SECTIONS 19 AND 20. CONVERGENCE, AND THE SOLVER'S OWN NOISE.
// ---------------------------------------------------------------------------

/**
 * The worst-loaded section, recomputed STANDALONE from a card's tension
 * envelope, with `sectionStresses` and `modifiedGoodman` exactly as
 * `runRodPumpDesign` does. It is a SECOND ROUTE to a quantity the design also
 * returns, and it exists only because the design exposes neither `nodes` nor
 * `cardSamples`, so a node sweep on the loading has no other way in.
 * `loadingRouteAgreement()` is the check that licenses it.
 */
export const standaloneLoading = (string, dyn, serviceFactor = 1) => {
  const rows = sectionStresses({ string, tensionEnvelope: dyn.tensionEnvelope }).map((s) => {
    const g = modifiedGoodman({
      minTensilePsi: string.grade.minTensilePsi,
      minStressPsi: s.minStressPsi,
      serviceFactor,
    });
    return { ...s, allowablePsi: g.allowablePsi, loadingPct: (s.maxStressPsi / g.allowablePsi) * 100 };
  });
  return {
    all: rows,
    worst: rows.reduce((a, s) => (s.loadingPct > a.loadingPct ? s : a), rows[0]),
  };
};

export const loadingRouteAgreement = () => {
  const g = teachingDesign().design;
  const standalone = standaloneLoading(teachingString(), g.dynamics).worst.loadingPct;
  return {
    designReturnPct: g.worstSection.loadingPct,
    standalonePct: standalone,
    strictlyEqual: standalone === g.worstSection.loadingPct,
  };
};

export const NODE_LADDER = Object.freeze([60, 120, 240, 480, 960, 1920]);
/** The rungs a panel can afford to walk on demand. The top two are seconds each. */
export const NODE_LADDER_QUICK = Object.freeze([60, 120, 240, 480]);

export const CONVERGENCE_CASE_IDS = Object.freeze([
  'published taper at 9 spm',
  `${ODUMA.label} at the shipped damping`,
  `${ODUMA.label} at 11 spm and a damping ratio of 0.05`,
]);

const convergenceCase = (id) => {
  if (id === CONVERGENCE_CASE_IDS[0]) {
    return { string: publishedString('taper'), mk: (nodes) => publishedCard(9, { nodes }) };
  }
  if (id === CONVERGENCE_CASE_IDS[1]) {
    return { string: teachingString(), mk: (nodes) => teachingCard({ nodes }) };
  }
  return {
    string: teachingString(),
    mk: (nodes) => teachingCard({ spm: 11, dampingRatio: 0.05, nodes }),
  };
};

/**
 * ONLY `nodes` changes. The time step follows the Courant condition, so the
 * marched steps rise with the node count. The plunger stroke settles to a small
 * fraction of a percent while the two loads move by hundreds of pounds, and
 * `notPeriodic` is printed at EVERY row because it is not monotone in
 * resolution: a middling node count can raise it while both a coarser and a
 * finer one converge.
 */
export const convergenceRows = memoize((id, ladder = NODE_LADDER) => {
  const c = convergenceCase(id);
  return ladder.map((nodes) => {
    const r = c.mk(nodes);
    return {
      nodes,
      samples: r.samples,
      plungerStrokeIn: r.plungerStrokeIn,
      prlPeakLb: r.prlPeakLb,
      prlMinLb: r.prlMinLb,
      loadRangeLb: r.prlPeakLb - r.prlMinLb,
      converged: r.converged,
      cycles: r.cycles,
      notPeriodic: hasWarning(r.warnings, 'notPeriodic'),
      worstLoadingPct: standaloneLoading(c.string, r).worst.loadingPct,
    };
  });
});

export const convergenceSpread = memoize((id, ladder = NODE_LADDER) => {
  const rows = convergenceRows(id, ladder);
  const sp = rows.map((r) => r.plungerStrokeIn);
  const pk = rows.map((r) => r.prlPeakLb);
  const mn = rows.map((r) => r.prlMinLb);
  const ld = rows.map((r) => r.worstLoadingPct);
  return {
    id,
    plungerStrokeSpreadIn: spread(sp),
    plungerStrokeSpreadPct: (spread(sp) / Math.min(...sp)) * 100,
    pprlSpreadLb: spread(pk),
    pprlSpreadPct: (spread(pk) / Math.min(...pk)) * 100,
    mprlSpreadLb: spread(mn),
    mprlSpreadPct: (spread(mn) / Math.abs(Math.min(...mn))) * 100,
    loadingSpreadPoints: spread(ld),
    notPeriodicByNode: rows.map((r) => ({ nodes: r.nodes, notPeriodic: r.notPeriodic })),
  };
});

/** What the flag says, and what a caller who sees it has to turn. Nothing. */
export const periodicityFlag = () => {
  const shipped = teachingDesign({ spm: 11, dampingRatio: 0.05 });
  const raised = teachingCard({ spm: 11, dampingRatio: 0.05, nodes: 480 });
  const message = raised.warnings.find((x) => x.code === 'notPeriodic');
  return {
    designWarnings: warningCodes(shipped.design.warnings),
    designRaisesNotPeriodic: hasWarning(shipped.design.warnings, 'notPeriodic'),
    message: message ? message.message : null,
    maxCyclesDefault: DEFAULT_MAX_CYCLES,
    cyclesAtRaise: raised.cycles,
    nodesExposedByDesign: false,
    maxCyclesExposedByDesign: false,
  };
};

export const SPEED_SWEEP_SPMS = Object.freeze(
  Array.from({ length: 21 }, (_, i) => Number((9 + i * 0.2).toFixed(1))),
);

/** The speed sweep at the shipped 120 node grid. The loading dips, and the dip
 * is smaller than the node spread on the same design. */
export const speedSweepRows = memoize((spms = SPEED_SWEEP_SPMS) => spms.map((spm) => {
  const r = teachingCard({ spm });
  return {
    spm,
    worstLoadingPct: standaloneLoading(teachingString(), r).worst.loadingPct,
    prlPeakLb: r.prlPeakLb,
    prlMinLb: r.prlMinLb,
    plungerStrokeIn: r.plungerStrokeIn,
    converged: r.converged,
  };
}));

export const DIP_SPM = 10.6;
export const NODE_NOISE_SPMS = Object.freeze([10.2, 10.4, 10.6, 10.8]);

/** THE SAME QUANTITY, SAME WELL, SAME SPEED, ONLY THE GRID MOVED. Whatever these
 * rows spread by is the solver's own noise on this number. */
export const nodeNoiseRows = memoize((spm, ladder = NODE_LADDER) => ladder.map((nodes) => ({
  spm,
  nodes,
  worstLoadingPct: standaloneLoading(teachingString(), teachingCard({ spm, nodes })).worst.loadingPct,
})));

export const nodeNoiseSpread = memoize((spm, ladder = NODE_LADDER) => {
  const vals = nodeNoiseRows(spm, ladder).map((r) => r.worstLoadingPct);
  return {
    spm,
    spreadPoints: spread(vals),
    lowPct: Math.min(...vals),
    highPct: Math.max(...vals),
  };
});

/**
 * The dip and the noise on one page, so the comparison is a comparison and not
 * an analogy. Refusing a tempting reading on the grounds of the solver's own
 * noise is the single most transferable habit in this course.
 */
export const dipAgainstNoise = memoize((ladder = NODE_LADDER) => {
  const rows = speedSweepRows();
  const idx = rows.findIndex((r) => r.spm === DIP_SPM);
  const before = rows[idx - 1];
  const at = rows[idx];
  const after = rows[idx + 1];
  const noiseBefore = nodeNoiseSpread(before.spm, ladder).spreadPoints;
  const noiseAfter = nodeNoiseSpread(after.spm, ladder).spreadPoints;
  const dip = before.worstLoadingPct - at.worstLoadingPct;
  return {
    dipSpm: at.spm,
    beforePct: before.worstLoadingPct,
    atPct: at.worstLoadingPct,
    afterPct: after.worstLoadingPct,
    dipPoints: dip,
    noiseBeforePoints: noiseBefore,
    noiseAfterPoints: noiseAfter,
    dipOverNoiseBefore: dip / noiseBefore,
    dipOverNoiseAfter: dip / noiseAfter,
    isAnOptimum: false,
  };
});

// ---------------------------------------------------------------------------
// 11. SECTIONS 21 AND 22. THE COUNTERBALANCE, AND THE INPUTS THAT DO NOTHING.
// ---------------------------------------------------------------------------

export const teachingBalance = memoize((over = {}) => balanceUnit({
  kin: unitKin(),
  cardLoadAt: cardLoadAt(teachingDesign().design.dynamics.surfaceCard),
  structuralUnbalanceLb: 0,
  crankOffsetDeg: 0,
  aIn: unitGeometry().aIn,
  ...over,
}));

/**
 * A unit is balanced when the largest torque the gearbox sees on the upstroke
 * equals the largest it sees on the downstroke. The counterweight moment is
 * anchored to the crank angle at the BOTTOM of the polished rod stroke, which is
 * what makes the sign right by construction.
 */
export const balanceSummary = () => {
  const b = teachingBalance();
  const kin = unitKin();
  const geom = unitGeometry();
  const st = teachingString();
  const qIdx = (kin.bottomIndex + Math.round(kin.samples.length / 4)) % kin.samples.length;
  const up = b.torque.filter((r) => r.torqueFactorIn < 0).map((r) => Math.abs(r.netTorqueInLb));
  const dn = b.torque.filter((r) => r.torqueFactorIn >= 0).map((r) => Math.abs(r.netTorqueInLb));
  return {
    balanced: b.balanced,
    momentInLb: b.momentInLb,
    peakTorqueInLb: b.peakTorqueInLb,
    counterbalanceEffectLb: b.counterbalanceEffectLb,
    quarterTurnTorqueFactorIn: Math.abs(kin.samples[qIdx].torqueFactorIn),
    momentOverFrontArmLb: b.momentInLb / geom.aIn,
    frontArmUnderstatesBy: b.counterbalanceEffectLb / (b.momentInLb / geom.aIn),
    buoyedWeightLb: st.weightFluidLb,
    effectAboveBuoyedLb: b.counterbalanceEffectLb - st.weightFluidLb,
    halfFluidLoadLb: teachingFluidLoadLb() / 2,
    upstrokePeakInLb: Math.max(...up),
    downstrokePeakInLb: Math.max(...dn),
    peakDifferenceInLb: Math.max(...up) - Math.max(...dn),
  };
};

/** The net torque through a revolution, at every fifteen degrees. */
export const balanceTorqueRows = (stepDeg = 15) => {
  const b = teachingBalance();
  const rows = [];
  for (let k = 0; k < 360 / stepDeg; k += 1) {
    const t = b.torque[k * stepDeg];
    rows.push({
      crankDeg: k * stepDeg,
      torqueFactorIn: t.torqueFactorIn,
      prlLb: t.prlLb,
      rodTorqueInLb: t.rodTorqueInLb,
      counterbalanceTorqueInLb: t.counterbalanceTorqueInLb,
      netTorqueInLb: t.netTorqueInLb,
    });
  }
  return rows;
};

export const MOMENT_FRACTIONS = Object.freeze([0, 0.25, 0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0]);

/** Moving the moment away from balance moves the two peaks in opposite
 * directions, and the crossing IS the balance. Overweighting costs as surely as
 * underweighting. */
export const balanceSweepRows = memoize((fractions = MOMENT_FRACTIONS) => {
  const b = teachingBalance();
  const loadAt = cardLoadAt(teachingDesign().design.dynamics.surfaceCard);
  return fractions.map((fraction) => {
    const momentInLb = b.momentInLb * fraction;
    const t = netTorque({
      kin: unitKin(),
      cardLoadAt: loadAt,
      counterbalanceMomentInLb: momentInLb,
      structuralUnbalanceLb: 0,
      crankOffsetDeg: 0,
    });
    const up = Math.max(...t.filter((r) => r.torqueFactorIn < 0).map((r) => Math.abs(r.netTorqueInLb)));
    const dn = Math.max(...t.filter((r) => r.torqueFactorIn >= 0).map((r) => Math.abs(r.netTorqueInLb)), 0);
    return {
      fraction,
      momentInLb,
      upstrokePeakInLb: up,
      downstrokePeakInLb: dn,
      largerInLb: Math.max(up, dn),
    };
  });
});

export const balanceValue = () => {
  const b = teachingBalance();
  const loadAt = cardLoadAt(teachingDesign().design.dynamics.surfaceCard);
  const bare = Math.max(...netTorque({
    kin: unitKin(), cardLoadAt: loadAt, counterbalanceMomentInLb: 0,
  }).map((r) => Math.abs(r.netTorqueInLb)));
  return {
    withNoCounterweightInLb: bare,
    balancedInLb: b.peakTorqueInLb,
    reductionPct: 100 * (1 - b.peakTorqueInLb / bare),
  };
};

/**
 * The counterbalance is computed from the card the engine returns, WHICH IS THE
 * DECIMATED ONE. So the subsample runs one level further than the envelope
 * split: `rating.torquePct` reads a torque balanced against a subsampled card.
 */
export const balanceSamplingComparison = memoize(() => {
  const dflt = teachingBalance();
  const fullCard = teachingCard({ cardSamples: FULL_MARCH_CARD_SAMPLES });
  const full = balanceUnit({
    kin: unitKin(),
    cardLoadAt: cardLoadAt(fullCard.surfaceCard),
    structuralUnbalanceLb: 0,
    crankOffsetDeg: 0,
    aIn: unitGeometry().aIn,
  });
  const rating = parseUnitDesignation(STANDARD_DESIGNATION);
  return {
    defaultCardPoints: teachingDesign().design.dynamics.surfaceCard.length,
    fullCardPoints: fullCard.surfaceCard.length,
    defaultMomentInLb: dflt.momentInLb,
    fullMomentInLb: full.momentInLb,
    momentDiffInLb: dflt.momentInLb - full.momentInLb,
    momentDiffPct: ((dflt.momentInLb - full.momentInLb) / full.momentInLb) * 100,
    defaultPeakTorqueInLb: dflt.peakTorqueInLb,
    fullPeakTorqueInLb: full.peakTorqueInLb,
    peakTorqueDiffInLb: full.peakTorqueInLb - dflt.peakTorqueInLb,
    peakTorqueDiffPct: ((full.peakTorqueInLb - dflt.peakTorqueInLb) / full.peakTorqueInLb) * 100,
    defaultEffectLb: dflt.counterbalanceEffectLb,
    fullEffectLb: full.counterbalanceEffectLb,
    effectDiffLb: dflt.counterbalanceEffectLb - full.counterbalanceEffectLb,
    torquePctFromDefault: (dflt.peakTorqueInLb / rating.torqueRatingInLb) * 100,
    torquePctFromFull: (full.peakTorqueInLb / rating.torqueRatingInLb) * 100,
    torqueRatingInLb: rating.torqueRatingInLb,
  };
});

export const CRANK_OFFSETS_DEG = Object.freeze([-30, -20, -10, 0, 10, 20, 30, 45]);

/**
 * `counterbalanceEffect` DOES NOT READ THE CRANK OFFSET although `netTorque` in
 * the same function does. The effect is read a quarter turn from the bottom of
 * the stroke, which is where the counterweight moment peaks ONLY when the offset
 * is zero. So inside ONE `balanceUnit` return the moment and the peak torque
 * know about the offset and the counterbalance effect does not. At a zero offset
 * the two agree exactly, which is what says this is the offset and nothing else.
 */
export const crankOffsetRows = memoize((offsets = CRANK_OFFSETS_DEG) => {
  const kin = unitKin();
  const n = kin.samples.length;
  const ref = kin.crankAngleAtBottomRad;
  const qIdx = (kin.bottomIndex + Math.round(n / 4)) % n;
  const tfQuarter = Math.abs(kin.samples[qIdx].torqueFactorIn);
  return offsets.map((crankOffsetDeg) => {
    const b = teachingBalance({ crankOffsetDeg });
    const tau = (crankOffsetDeg * Math.PI) / 180;
    let bestI = 0;
    let bestV = -Infinity;
    kin.samples.forEach((sm, i) => {
      const v = Math.sin(sm.thetaRad - ref + tau);
      if (v > bestV) { bestV = v; bestI = i; }
    });
    const tfTrue = Math.abs(kin.samples[bestI].torqueFactorIn);
    const trueEffectLb = b.momentInLb / tfTrue;
    return {
      crankOffsetDeg,
      momentInLb: b.momentInLb,
      peakTorqueInLb: b.peakTorqueInLb,
      readAtSample: qIdx,
      readTorqueFactorIn: tfQuarter,
      reportedEffectLb: b.counterbalanceEffectLb,
      peaksAtSample: bestI,
      trueTorqueFactorIn: tfTrue,
      trueEffectLb,
      differenceLb: b.counterbalanceEffectLb - trueEffectLb,
      differencePct: ((b.counterbalanceEffectLb - trueEffectLb) / trueEffectLb) * 100,
    };
  });
});

/**
 * THE BALANCE IS AN INPUT TO THE FUNCTION THAT COMPUTES THE CARD IT DERIVES
 * FROM, and the natural first call, with the balance omitted, FAILS OPEN.
 * `torqueGroup` comes back ZERO, which is a meaningful point on the RP 11L
 * torque chart, while `torquePct` one field away correctly returns null. One of
 * the two knows it has no answer and the other reports a number that reads as a
 * healthy result.
 */
export const torqueGroupFailsOpen = memoize(() => {
  const rating = parseUnitDesignation(STANDARD_DESIGNATION);
  const withB = teachingDesign({ balance: teachingBalance(), unitRating: rating });
  const noB = teachingDesign({ unitRating: rating });
  return {
    torqueGroupWithBalance: withB.design.groups.torqueGroup,
    torqueGroupWithout: noB.design.groups.torqueGroup,
    torquePctWithBalance: withB.design.rating.torquePct,
    torquePctWithout: noB.design.rating.torquePct,
    plungerStrokeEqual: withB.design.plungerStrokeIn === noB.design.plungerStrokeIn,
    pprlEqual: withB.design.pprlLb === noB.design.pprlLb,
    worstLoadingEqual: withB.design.worstSection.loadingPct === noB.design.worstSection.loadingPct,
  };
});

export const IGNORED_INPUT_KEYS = Object.freeze([
  'pprlLb', 'mprlLb', 'plungerStrokeIn', 'prhp', 'producedBpd',
  'cardAreaInLb', 'fluidLoadLb', 'sweptBpd', 'ratedBpd',
]);

/**
 * `runRodPumpDesign` destructures `kin`, `structuralUnbalanceLb` and
 * `crankOffsetDeg` in its signature, lists all three in its own documented input
 * list, and references none of them in its body. Proved by STRICT EQUALITY, not
 * by a tolerance: the claim is that the input was never read at all, and that
 * predicts agreement to the last bit.
 */
export const ignoredInputRows = memoize(() => {
  const zero = teachingDesign({ structuralUnbalanceLb: 0, crankOffsetDeg: 0 });
  const set = teachingDesign({ kin: unitKin(), structuralUnbalanceLb: 600, crankOffsetDeg: 10 });
  const rows = IGNORED_INPUT_KEYS.map((key) => ({
    key,
    runA: zero.design[key],
    runB: set.design[key],
    strictlyEqual: zero.design[key] === set.design[key],
  }));
  rows.push({
    key: 'worstSection.loadingPct',
    runA: zero.design.worstSection.loadingPct,
    runB: set.design.worstSection.loadingPct,
    strictlyEqual: zero.design.worstSection.loadingPct === set.design.worstSection.loadingPct,
  });
  return rows;
});

export const ignoredInputDifferences = () => ignoredInputRows().filter((r) => !r.strictlyEqual).length;

/** `kin` is worse in kind if not in size: it is unchecked against the input it
 * duplicates, so one unit's kinematics and another's surface motion pass without
 * a word. */
export const mismatchedKin = memoize(() => {
  const otherKin = unitKinematics(genericConventionalGeometry({ strokeIn: 144 }).geometry, { steps: 360 });
  const zero = teachingDesign({ structuralUnbalanceLb: 0, crankOffsetDeg: 0 });
  const mismatched = teachingDesign({ kin: otherKin });
  return {
    otherStrokeIn: otherKin.strokeIn,
    surfaceStrokeIn: unitStrokeIn(),
    plungerStrokeIn: mismatched.design.plungerStrokeIn,
    identicalToRunA: mismatched.design.plungerStrokeIn === zero.design.plungerStrokeIn,
    warnings: warningCodes(mismatched.design.warnings),
  };
});

/** THE SAME TWO NUMBERS, GIVEN TO balanceUnit, ARE NOT SMALL. */
export const balanceSensitivityRows = memoize(() => [
  ['both at zero', { structuralUnbalanceLb: 0, crankOffsetDeg: 0 }],
  ['structural unbalance 600 lb only', { structuralUnbalanceLb: 600, crankOffsetDeg: 0 }],
  ['crank offset 10 deg only', { structuralUnbalanceLb: 0, crankOffsetDeg: 10 }],
  ['both together', { structuralUnbalanceLb: 600, crankOffsetDeg: 10 }],
].map(([label, over]) => {
  const b = teachingBalance(over);
  return {
    label,
    momentInLb: b.momentInLb,
    peakTorqueInLb: b.peakTorqueInLb,
    counterbalanceEffectLb: b.counterbalanceEffectLb,
  };
}));

export const balanceSensitivitySummary = () => {
  const rows = balanceSensitivityRows();
  const zero = rows[0];
  const both = rows[3];
  return {
    momentDiffInLb: zero.momentInLb - both.momentInLb,
    momentDiffPct: (1 - both.momentInLb / zero.momentInLb) * 100,
    peakTorqueDiffInLb: zero.peakTorqueInLb - both.peakTorqueInLb,
    peakTorqueDiffPct: (1 - both.peakTorqueInLb / zero.peakTorqueInLb) * 100,
    effectDiffLb: zero.counterbalanceEffectLb - both.counterbalanceEffectLb,
  };
};

// ---------------------------------------------------------------------------
// 12. SECTIONS 23 AND 24. THE GOODMAN LINE, AND FILLAGE.
// ---------------------------------------------------------------------------

export const ROD_GRADE_IDS = Object.freeze(['K', 'C', 'D']);

/** Sa = ( T/4 + 0.5625 Smin ) SF, from API RP 11BR. T is a material minimum; SF
 * is not a property of the rod at all. */
export const goodmanGradeRows = (ids = ROD_GRADE_IDS) => ids.map((id) => {
  const g = rodGrade(id);
  return {
    id,
    label: g.label,
    minTensilePsi: g.minTensilePsi,
    quarterTensilePsi: g.minTensilePsi / 4,
  };
});

export const GOODMAN_MIN_STRESSES_PSI = Object.freeze([0, 2500, 5000, 7500, 10000, 12500]);

export const goodmanAllowableRows = (minStresses = GOODMAN_MIN_STRESSES_PSI, serviceFactor = 1) => minStresses
  .map((minStressPsi) => ({
    minStressPsi,
    serviceFactor,
    allowablePsi: modifiedGoodman({ minTensilePsi: 115000, minStressPsi, serviceFactor }).allowablePsi,
  }));

export const SERVICE_FACTORS = Object.freeze([
  1.00, 0.975, 0.95, 0.925, 0.90, 0.875, 0.85, 0.825, 0.80, 0.775, 0.75, 0.725, 0.70,
]);

/** The design itself does not change down this column: the same card, the same
 * stresses, the same envelope. What changes is the line they are judged against. */
export const serviceFactorRows = memoize((factors = SERVICE_FACTORS) => factors.map((serviceFactor) => {
  const d = teachingDesign({ serviceFactor });
  const ws = d.design.worstSection;
  return {
    serviceFactor,
    label: ws.label,
    maxStressPsi: ws.maxStressPsi,
    minStressPsi: ws.minStressPsi,
    allowablePsi: ws.allowablePsi,
    loadingPct: ws.loadingPct,
    warnings: warningCodes(d.design.warnings),
    rodOverstressed: hasWarning(d.design.warnings, 'rodOverstressed'),
  };
}));

/** Where the loading crosses 100 percent, by bisection on the sweep above. */
export const serviceFactorCrossing = memoize(() => {
  const loadingAt = (sf) => teachingDesign({ serviceFactor: sf }).design.worstSection.loadingPct;
  let lo = 0.70;
  let hi = 1.00;
  for (let i = 0; i < 60; i += 1) {
    const mid = 0.5 * (lo + hi);
    if (loadingAt(mid) > 100) { lo = mid; } else { hi = mid; }
  }
  const serviceFactor = 0.5 * (lo + hi);
  const ws = teachingDesign({ serviceFactor }).design.worstSection;
  return {
    serviceFactor,
    allowablePsi: ws.allowablePsi,
    maxStressPsi: ws.maxStressPsi,
    loadingPct: ws.loadingPct,
  };
});

export const WARNING_TEXT_SERVICE_FACTORS = Object.freeze([0.845, 0.84, 0.83, 0.82, 0.81]);

/**
 * The warning once printed the threshold it had just failed, because it
 * formatted the loading with toFixed(0). Engines PR #113 fixed it and PR #114
 * found six more sites. These rows run against the FIXED engine and are the
 * evidence of the fix, not a defect to report.
 */
export const overstressWarningRows = memoize((factors = WARNING_TEXT_SERVICE_FACTORS) => factors
  .map((serviceFactor) => {
    const d = teachingDesign({ serviceFactor });
    const w = d.design.warnings.find((x) => x.code === 'rodOverstressed');
    return {
      serviceFactor,
      loadingPct: d.design.worstSection.loadingPct,
      raised: Boolean(w),
      message: w ? w.message : 'no rodOverstressed warning',
    };
  }));

/** A taper is designed so every section carries the same peak stress, so the
 * spread of this column is the check on whether this taper does. */
export const sectionLoadingSpread = (serviceFactor = 1.0) => {
  const rows = teachingStressRows(serviceFactor);
  return {
    serviceFactor,
    rows,
    spreadPoints: spread(rows.map((r) => r.loadingPct)),
    stressBalanced: false,
  };
};

export const FILLAGE_SWEEP = Object.freeze([
  1.00, 0.98, 0.96, 0.94, 0.92, 0.90, 0.88, 0.86, 0.84, 0.82,
  0.80, 0.78, 0.76, 0.74, 0.72, 0.70, 0.65, 0.60, 0.55, 0.50,
]);

/**
 * `runRodPumpDesign` computes `sweptBpd` from the PLUNGER stroke the march
 * returned, then multiplies by fillage. But the plunger stroke ITSELF already
 * moved with fillage, because the pound down state holds the fluid load on the
 * plunger while it travels down through the empty part of the barrel. So a
 * fillage multiplier is charged against a swept volume the same fillage already
 * changed, and the effective factor's error CHANGES SIGN within one sweep.
 */
export const fillageRows = memoize((fillages = FILLAGE_SWEEP) => {
  const full = teachingDesign({ fillage: 1.0 }).design;
  return fillages.map((fillage) => {
    const g = teachingDesign({ fillage }).design;
    const effective = g.producedBpd / full.producedBpd;
    return {
      fillage,
      plungerStrokeIn: g.plungerStrokeIn,
      sweptBpd: g.sweptBpd,
      producedBpd: g.producedBpd,
      effectiveFactor: effective,
      nominalFactor: fillage,
      effectiveOverNominal: effective / fillage,
      errorPct: (effective / fillage - 1) * 100,
      warnings: warningCodes(g.warnings),
      incompleteFillage: hasWarning(g.warnings, 'incompleteFillage'),
    };
  });
});

export const fillageSummary = memoize((fillages = FILLAGE_SWEEP) => {
  const rows = fillageRows(fillages);
  const over = rows.filter((r) => r.effectiveOverNominal > 1);
  const under = rows.filter((r) => r.effectiveOverNominal < 1);
  const most = rows.reduce((a, b) => (b.effectiveOverNominal > a.effectiveOverNominal ? b : a));
  const least = rows.reduce((a, b) => (b.effectiveOverNominal < a.effectiveOverNominal ? b : a));
  const longest = rows.reduce((a, b) => (b.plungerStrokeIn > a.plungerStrokeIn ? b : a));
  const shortest = rows.reduce((a, b) => (b.plungerStrokeIn < a.plungerStrokeIn ? b : a));
  return {
    aboveNominalCount: over.length,
    belowNominalCount: under.length,
    signFlips: over.length > 0 && under.length > 0,
    largestOverstatementPct: (most.effectiveOverNominal - 1) * 100,
    largestOverstatementAtFillage: most.fillage,
    largestUnderstatementPct: (1 - least.effectiveOverNominal) * 100,
    largestUnderstatementAtFillage: least.fillage,
    fullBarrelPlungerStrokeIn: rows[0].plungerStrokeIn,
    longestPlungerStrokeIn: longest.plungerStrokeIn,
    longestAtFillage: longest.fillage,
    shortestPlungerStrokeIn: shortest.plungerStrokeIn,
    shortestAtFillage: shortest.fillage,
    plungerStrokeMonotoneInFillage: false,
  };
});

export const FILLAGE_CLIFF = Object.freeze([
  0.8520, 0.8510, 0.8505, 0.8501, 0.8500, 0.8499, 0.8495, 0.8490, 0.8480,
]);

export const FILLAGE_THRESHOLD = 0.85;

/** `incompleteFillage` fires below 0.85 with no hysteresis and no graduation.
 * Four ten thousandths of fillage separate a silent design from a warned one,
 * and the two designs are the same design. */
export const fillageCliffRows = memoize((fillages = FILLAGE_CLIFF) => fillages.map((fillage) => {
  const g = teachingDesign({ fillage }).design;
  const w = g.warnings.find((x) => x.code === 'incompleteFillage');
  return {
    fillage,
    producedBpd: g.producedBpd,
    plungerStrokeIn: g.plungerStrokeIn,
    incompleteFillage: Boolean(w),
    message: w ? w.message : null,
  };
}));

export const fillageCliffPair = () => {
  const silent = teachingDesign({ fillage: 0.8500 }).design;
  const warned = teachingDesign({ fillage: 0.8499 }).design;
  return {
    silentFillage: 0.8500,
    warnedFillage: 0.8499,
    silentProducedBpd: silent.producedBpd,
    warnedProducedBpd: warned.producedBpd,
    apartBpd: silent.producedBpd - warned.producedBpd,
    silentWarns: hasWarning(silent.warnings, 'incompleteFillage'),
    warnedWarns: hasWarning(warned.warnings, 'incompleteFillage'),
    message: warned.warnings.find((x) => x.code === 'incompleteFillage').message,
  };
};

// ---------------------------------------------------------------------------
// 13. SECTION 25. THE DIAGNOSTIC.
// ---------------------------------------------------------------------------

const publishedMeasuredCard = memoize(() => golden.diagnose.positionsIn.map((positionIn, i) => ({
  tFrac: i / golden.diagnose.positionsIn.length,
  positionIn,
  loadLb: golden.diagnose.loadsLb[i],
})));

/**
 * The Gibbs 1963 problem, and it is a DIFFERENT problem: both the position and
 * the load are known at the surface, and the question is what the pump is doing.
 * `predictCard` and `diagnoseCard` share no code path, which is what makes the
 * round trip a real check.
 */
export const publishedDiagnosis = memoize(() => {
  const gd = golden.diagnose;
  const card = publishedMeasuredCard();
  const r = diagnoseCard({
    string: publishedString('taper'),
    surfaceCard: card,
    spm: gd.spm,
    dampingRatio: gd.dampingRatio,
    harmonics: gd.harmonics,
  });
  const positionRange = Math.max(...gd.positionsIn) - Math.min(...gd.positionsIn);
  return {
    samples: gd.positionsIn.length,
    spm: gd.spm,
    dampingRatio: gd.dampingRatio,
    harmonicsRequested: gd.harmonics,
    harmonicsUsed: r.harmonics,
    harmonicsCap: Math.floor(gd.positionsIn.length / 2) - 1,
    positionMinIn: Math.min(...gd.positionsIn),
    positionMaxIn: Math.max(...gd.positionsIn),
    loadMinLb: Math.min(...gd.loadsLb),
    loadMaxLb: Math.max(...gd.loadsLb),
    goldenPlungerStrokeIn: gd.result.plungerStrokeIn,
    goldenPumpLoadMaxLb: gd.result.pumpLoadMaxLb,
    goldenPumpLoadMinLb: gd.result.pumpLoadMinLb,
    plungerStrokeIn: r.plungerStrokeIn,
    pumpLoadMaxLb: r.pumpLoadRangeLb[1],
    pumpLoadMinLb: r.pumpLoadRangeLb[0],
    plungerStrokeDiffIn: r.plungerStrokeIn - gd.result.plungerStrokeIn,
    pumpLoadMaxDiffLb: r.pumpLoadRangeLb[1] - gd.result.pumpLoadMaxLb,
    pumpLoadMinDiffLb: r.pumpLoadRangeLb[0] - gd.result.pumpLoadMinLb,
    kappaPerS: r.kappaPerS,
    surfaceStrokeIn: positionRange,
    plungerOverSurface: r.plungerStrokeIn / positionRange,
  };
});

export const PUBLISHED_HARMONICS = Object.freeze([2, 4, 6, 8, 12, 16, 24, 32, 48, 58]);

export const publishedHarmonicRows = memoize((list = PUBLISHED_HARMONICS) => {
  const gd = golden.diagnose;
  const card = publishedMeasuredCard();
  return list.map((harmonics) => {
    const r = diagnoseCard({
      string: publishedString('taper'),
      surfaceCard: card,
      spm: gd.spm,
      dampingRatio: gd.dampingRatio,
      harmonics,
    });
    return {
      requested: harmonics,
      used: r.harmonics,
      plungerStrokeIn: r.plungerStrokeIn,
      pumpLoadMaxLb: r.pumpLoadRangeLb[1],
      pumpLoadMinLb: r.pumpLoadRangeLb[0],
    };
  });
});

/** The diagnostic REFUSES a card it cannot read. Sixteen samples is the floor. */
export const diagnosisRefusal = () => {
  const short = diagnoseCard({
    string: publishedString('taper'),
    surfaceCard: publishedMeasuredCard().slice(0, 12),
    spm: 9,
    dampingRatio: 0.1,
  });
  return { ok: short.ok, message: short.error, samplesGiven: 12, floor: 16 };
};

export const ROUND_TRIP_HARMONICS = 24;

/**
 * THE ROUND TRIP. Predict a card on ODUMA-4, hand the SURFACE HALF of it back to
 * the diagnostic, and the pump card it returns has to be the one the prediction
 * assumed. THE SAME QUANTITY IS COMPUTED TWICE AND THE LABELS DIFFER: the march
 * is `predictCard`'s peak to trough of the pump node, the diagnostic is a
 * harmonic sum propagated from the DECIMATED surface card.
 */
export const roundTrip = memoize((harmonics = ROUND_TRIP_HARMONICS) => {
  const march = teachingDesign().design.dynamics;
  const dg = diagnoseCard({
    string: teachingString(),
    surfaceCard: march.surfaceCard,
    spm: ODUMA.spm,
    dampingRatio: ODUMA.dampingRatio,
    harmonics,
  });
  return {
    harmonicsRequested: harmonics,
    harmonicsUsed: dg.harmonics,
    harmonicsCap: Math.floor(march.surfaceCard.length / 2) - 1,
    cardPoints: march.surfaceCard.length,
    marchedSteps: march.samples,
    marchPlungerStrokeIn: march.plungerStrokeIn,
    diagnosticPlungerStrokeIn: dg.plungerStrokeIn,
    differenceIn: dg.plungerStrokeIn - march.plungerStrokeIn,
    differencePct: ((dg.plungerStrokeIn - march.plungerStrokeIn) / march.plungerStrokeIn) * 100,
    diagnosticPumpLoadMaxLb: dg.pumpLoadRangeLb[1],
    diagnosticPumpLoadMinLb: dg.pumpLoadRangeLb[0],
    marchFluidLoadLb: teachingFluidLoadLb(),
    pumpLoadMaxOvershootLb: dg.pumpLoadRangeLb[1] - teachingFluidLoadLb(),
  };
});

export const ROUND_TRIP_HARMONIC_LADDER = Object.freeze([2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 80, 91]);

/** More harmonics is NOT the repair: the difference does not descend, and past
 * sixteen it settles into a band instead of shrinking. */
export const roundTripHarmonicRows = memoize((list = ROUND_TRIP_HARMONIC_LADDER) => {
  const march = teachingDesign().design.dynamics;
  return list.map((harmonics) => {
    const r = diagnoseCard({
      string: teachingString(),
      surfaceCard: march.surfaceCard,
      spm: ODUMA.spm,
      dampingRatio: ODUMA.dampingRatio,
      harmonics,
    });
    return {
      requested: harmonics,
      used: r.harmonics,
      plungerStrokeIn: r.plungerStrokeIn,
      pumpLoadMaxLb: r.pumpLoadRangeLb[1],
      pumpLoadMinLb: r.pumpLoadRangeLb[0],
      differenceFromMarchIn: r.plungerStrokeIn - march.plungerStrokeIn,
    };
  });
});

export const DIAGNOSTIC_DAMPINGS = Object.freeze([0.05, 0.08, 0.10, 0.12, 0.15, 0.20]);

/** The diagnostic carries the damping ratio it is GIVEN, and a damping ratio is
 * not measurable from the card either. */
export const diagnosticDampingRows = memoize((ratios = DIAGNOSTIC_DAMPINGS) => {
  const march = teachingDesign().design.dynamics;
  return ratios.map((dampingRatio) => {
    const r = diagnoseCard({
      string: teachingString(),
      surfaceCard: march.surfaceCard,
      spm: ODUMA.spm,
      dampingRatio,
      harmonics: ROUND_TRIP_HARMONICS,
    });
    return {
      dampingRatio,
      plungerStrokeIn: r.plungerStrokeIn,
      pumpLoadMaxLb: r.pumpLoadRangeLb[1],
      pumpLoadMinLb: r.pumpLoadRangeLb[0],
    };
  });
});

export const diagnosticDampingSpread = (ratios = DIAGNOSTIC_DAMPINGS) => ({
  plungerStrokeSpreadIn: spread(diagnosticDampingRows(ratios).map((r) => r.plungerStrokeIn)),
});

// ---------------------------------------------------------------------------
// 14. SECTION 26. WHAT THIS ENGINE REFUSES, AND WHAT IT ONLY WARNS ABOUT.
// ---------------------------------------------------------------------------

/** Every capability comes with a limit, and these are the limits stated as
 * refusals rather than as caveats. Each message is the engine's own text. */
export const refusals = memoize(() => {
  const noSpeed = runRodPumpDesign({
    string: teachingString(),
    frequency: teachingFrequency(),
    surfacePosition: surfacePosition(),
    strokeIn: unitStrokeIn(),
    spm: 0,
    plungerDIn: ODUMA.plungerDIn,
    pDischargePsi: ODUMA.pDischargePsia,
    pIntakePsi: ODUMA.pIntakePsia,
    dampingRatio: ODUMA.dampingRatio,
  });
  const noSections = buildRodString({ sections: [], fluidSg: 1 });
  const emptyCard = diagnoseCard({
    string: publishedString('taper'), surfaceCard: [], spm: 9, dampingRatio: 0.1,
  });
  return Object.freeze([
    { what: 'a rod size that cannot be read as a diameter', message: sizeRefusal().message },
    { what: 'a linkage that does not close at every crank angle', message: closureRefusal().message },
    { what: 'a plunger with no differential to lift against', message: pumpRefusal().message },
    { what: 'a march with no damping', message: dampingRefusal().message },
    { what: 'a speed at or above the string own fundamental', message: speedRefusal().message },
    { what: 'a measured card with fewer than sixteen samples', message: emptyCard.error },
    { what: 'a pumping speed of zero', message: noSpeed.errors.join(' ') },
    { what: 'a rod string with no sections', message: noSections.errors.join(' ') },
  ]);
});

export const WARNING_CODES = Object.freeze([
  { code: 'taperStepsUp', what: 'a section larger than the one above it' },
  { code: 'timestep', what: 'the time step exceeded the Courant limit' },
  { code: 'notPeriodic', what: 'the march did not settle into a repeating cycle' },
  { code: 'rodOverstressed', what: 'the worst section passes its modified Goodman allowable' },
  { code: 'structuralOverload', what: 'prlPeakLb passes the unit structural capacity' },
  { code: 'torqueOverload', what: 'the balanced peak torque passes the gearbox rating' },
  { code: 'strokeOverload', what: 'the design stroke is longer than the unit stroke' },
  { code: 'incompleteFillage', what: 'the fillage is below 0.85' },
]);

/** What the engine does not model at all, so no number in this lab speaks to it. */
export const NOT_MODELLED = Object.freeze([
  'rod buckling and the compression a sinker bar would be sized for',
  'tubing movement and an unanchored tubing string',
  'fluid friction on the plunger, and valve slippage as anything other than the pumpEfficiency the caller types',
  'gas interference',
  'deviated hole side loading and rod on tubing wear',
  'gearbox, belt and motor losses',
  'the fatigue history that turns a Goodman percentage into a service life',
]);

// ---------------------------------------------------------------------------
// 15. THE PANEL SURFACES.
// ---------------------------------------------------------------------------

/** `pd-string-explorer`, Associate. Five modes over the string, the note, the
 * linkage and the pump. Nothing on this panel needs a march. */
export const stringExplorer = Object.freeze({
  objects: () => ({
    objects: fourObjects(),
    constants: constantRows(),
    engineConstants: engineConstants(),
    couplings: couplingRatioRows(),
    refusals: refusals(),
    notModelled: NOT_MODELLED,
    verdict: {
      seam: 'Nothing in the string, the linkage or the pump needs a march. Everything the card owns does, and that is the seam the three tiers are cut along.',
    },
  }),

  taper: () => ({
    published: PUBLISHED_STRING_IDS.map(publishedStringRow),
    teaching: teachingStringRow(),
    gap: publishedStringGap(),
    series: seriesArithmetic(),
    split: taperSplitRows(),
    order: taperOrderWarning(),
    buoyancy: buoyancyRows(),
    lostToFluid: buoyancyAtUnity(),
    sizeRefusal: sizeRefusal(),
    verdict: {
      compliancesAdd: true,
      note: 'The uniform string is 6000 ft and the taper is 5000 ft, so most of the weight and stiffness gap between them is the thousand feet. The split sweep holds the length fixed, and it is the honest comparison.',
    },
  }),

  note: () => ({
    routes: STRING_IDS.map(noteRoutes),
    split: taperSplitRows(),
    grids: ['taper', ODUMA.label].map(scanGridReplica),
    refusal: speedRefusal(),
    verdict: {
      scanIsLatent: true,
      note: 'The scan adds its increment to the running position rather than to the lower bound, so its spacing grows without bound. It is latent on every string here: the engine returns the true fundamental to every figure the dense mode scan gives. What the coarse grid costs is the guarantee, not the answer.',
    },
  }),

  linkage: () => ({
    summary: unitSummary(),
    golden: goldenUnitSamples(),
    revolution: unitRevolutionRows(),
    velocity: unitVelocityAsymmetry(),
    sine: sineComparisonRows(),
    crank: crankSweepRows(),
    arm: armSweepRows(),
    generic: genericLinkageRows(),
    designations: designationRows(),
    designationRefusal: designationRefusal(),
    closureRefusal: closureRefusal(),
    verdict: {
      armIsAnExactScaleFactor: true,
      note: 'The stroke is the beam sweep times the front arm, so the arm scales it exactly and the crank does not. Twice the crank radius is the wrong rule and it is not even a constant of the machine.',
    },
  }),

  pump: () => ({
    plungers: plungerRows(),
    fluidLoads: fluidLoadRows(),
    teaching: teachingPump(),
    stretch: staticStretchRows(),
    teachingStretch: teachingStaticStretch(),
    refusal: pumpRefusal(),
    verdict: {
      constantMultipliesDiameterSquared: true,
      note: 'The pump constant already contains pi over four, so it multiplies the diameter squared and not the area. Feeding it the area applies pi over four twice and understates displacement by the same percentage on every plunger, which is what makes it look like a design basis rather than a bug.',
    },
  }),
});

/** `pd-card-explorer`, Professional. Five modes over the march, the stretch, the
 * loads, the power and what the well makes. */
export const cardExplorer = Object.freeze({
  march: () => ({
    published: publishedPredictRows(),
    teaching: teachingDesignSummary(),
    sampling: samplingSummary(),
    publishedSampling: publishedSamplingRows(),
    surfaceCard: teachingSurfaceCardRows(),
    pumpCard: teachingPumpCardRows(),
    areas: teachingCardAreas(),
    transit: waveTransitRows(),
    transitHeadline: waveTransitHeadline(),
    refusal: dampingRefusal(),
    verdict: {
      twoSamplingsInOneObject: true,
      note: 'The tension envelope is accumulated over every marched step at every node. The surface card is decimated, and both polished rod loads are read off that subsample. Two samplings of one march, in one return object, and only one of them is the card.',
    },
  }),

  stretch: () => ({
    publishedRule: publishedSpringRule(),
    teachingRule: teachingSpringRule(),
    publishedLadder: publishedOvertravelRows(),
    teachingLadder: teachingOvertravelRows(),
    byLoad: overtravelByLoadRows(),
    stretch: staticStretchRows(),
    verdict: {
      waveAnswerIsLonger: true,
      note: 'The spring rule subtracts a static stretch from the surface stroke and knows nothing about a rod string that is still moving when the polished rod turns round. The wave answer is longer, the difference is inertial overtravel, and it is not monotone in speed.',
    },
  }),

  loads: () => ({
    published: publishedPredictRows(),
    teaching: teachingDesignSummary(),
    groups: teachingGroups(),
    stresses: teachingStressRows(),
    damping: dampingSweepRows(),
    dampingSpread: dampingSweepSpread(),
    plunger: plungerSweepRows(),
    gravity: gravitySweepRows(),
    verdict: {
      rangeCollectsBothEnds: true,
      note: 'The reported peak and minimum are read off the surface card. The section maxima and minima that feed the Goodman check are read off the tension envelope. They come out of one call and describe the same cycle, and a range built from one pair is not interchangeable with a range built from the other.',
    },
  }),

  power: () => ({
    teaching: powerRows(),
    published: publishedPowerRows(),
    perBarrel: teachingPowerPerBarrel(),
    areas: teachingCardAreas(),
    subsampleCost: cardSamplesCost(ODUMA.label),
    verdict: {
      scalesWithSpeedTwice: true,
      note: 'Horsepower is the card area times the speed over 396000, and raising the speed makes the loop bigger as well as more frequent. It is the power at the polished rod: no gearbox loss, no belt loss, no motor efficiency and no counterbalance work.',
    },
  }),

  fillage: () => ({
    sweep: fillageRows(),
    summary: fillageSummary(),
    cliff: fillageCliffRows(),
    pair: fillageCliffPair(),
    threshold: FILLAGE_THRESHOLD,
    verdict: {
      signFlips: true,
      note: 'The swept rate is computed from a plunger stroke the fillage had already moved, then multiplied by the fillage again. The effective factor is above the nominal on most of the sweep and below it further down, so there is no direction to defend and no correction to apply.',
    },
  }),
});

/** `pd-balance-explorer`, Expert. Five modes over the envelope, the convergence,
 * the counterbalance, the ignored inputs and the stress and diagnosis. */
export const balanceExplorer = Object.freeze({
  envelope: () => ({
    split: envelopeSplit(),
    profile: envelopeProfileRows(),
    sampling: samplingSummary(),
    ladder: cardSamplesRows(ODUMA.label),
    cost: cardSamplesCost(ODUMA.label),
    bySpeed: subsampleBySpeedRows(),
    byFillage: subsampleByFillageRows(),
    rating: ratingSplit(),
    standardRating: ratingSplit(STANDARD_DESIGNATION),
    verdict: {
      designSplitsOnTheDisagreement: true,
      note: 'The Goodman check reads the envelope and the structural rating reads the subsample, so one design is checked against two different peak loads in one return. The trusting half is the subsampled one.',
    },
  }),

  convergence: (ladder = NODE_LADDER_QUICK) => ({
    ladder,
    cases: CONVERGENCE_CASE_IDS.map((id) => ({
      id,
      rows: convergenceRows(id, ladder),
      spread: convergenceSpread(id, ladder),
    })),
    flag: periodicityFlag(),
    damping: dampingSweepRows(),
    speedSweep: speedSweepRows(),
    noise: NODE_NOISE_SPMS.map((spm) => ({ spm, rows: nodeNoiseRows(spm, ladder) })),
    dip: dipAgainstNoise(ladder),
    routes: loadingRouteAgreement(),
    verdict: {
      strokeConverges: true,
      loadsDoNot: true,
      note: 'The plunger stroke is a peak to trough of one node position over a whole cycle and it settles. The two load extremes are point values taken at whichever instant happened to be worst, and they do not. A dip smaller than the node spread on the same design is not a result.',
    },
  }),

  balance: () => ({
    summary: balanceSummary(),
    torque: balanceTorqueRows(),
    sweep: balanceSweepRows(),
    value: balanceValue(),
    sampling: balanceSamplingComparison(),
    offsets: crankOffsetRows(),
    failsOpen: torqueGroupFailsOpen(),
    verdict: {
      balanceIsAnInputToTheFunctionThatComputesItsCard: true,
      note: 'A unit is balanced when the two torque peaks are equal, which is one scalar condition in one unknown. Omit the balance and torqueGroup returns zero, a meaningful point on the RP 11L chart, while torquePct one field away correctly returns null.',
    },
  }),

  ignored: () => ({
    rows: ignoredInputRows(),
    differences: ignoredInputDifferences(),
    mismatched: mismatchedKin(),
    sensitivity: balanceSensitivityRows(),
    sensitivitySummary: balanceSensitivitySummary(),
    verdict: {
      threeInputsNeverRead: true,
      note: 'A tolerance test asks whether an input mattered much. The claim here is stronger: it was never read at all, and that predicts agreement to the last bit. The same two numbers move a balance by percent, so they would have shown.',
    },
  }),

  stress: () => ({
    grades: goodmanGradeRows(),
    allowables: goodmanAllowableRows(),
    serviceFactors: serviceFactorRows(),
    crossing: serviceFactorCrossing(),
    warningText: overstressWarningRows(),
    sections: [1.0, 0.85].map(sectionLoadingSpread),
    diagnosis: publishedDiagnosis(),
    harmonics: publishedHarmonicRows(),
    diagnosisRefusal: diagnosisRefusal(),
    roundTrip: roundTrip(),
    roundTripHarmonics: roundTripHarmonicRows(),
    diagnosticDamping: diagnosticDampingRows(),
    diagnosticDampingSpread: diagnosticDampingSpread(),
    verdict: {
      serviceFactorIsAJudgement: true,
      note: 'Sa = ( T/4 + 0.5625 Smin ) SF. The tensile minimum is a material property and the service factor is not: it stands for the fluid, the corrosion and the operator own practice. The design does not change down a service factor sweep; only the line it is judged against does.',
    },
  }),
});

// ---------------------------------------------------------------------------
// 16. THE SURFACE THE LEAK GUARD WALKS.
// ---------------------------------------------------------------------------

/**
 * Every accessor a panel can reach, as [label, thunk]. The guard walks every
 * return value of every one of these and checks no number in any of them lands
 * near a graded capstone answer.
 *
 * THE NODE LADDER IS THE ONE PLACE THIS LIST IS CHEAPER THAN THE PANEL. The
 * 1920 node rung marches sixteen times the steps of the shipped grid and takes
 * seconds, and the same numbers are in the teaching digest, which the guard
 * sweeps in full. So the walk uses the full ladder on the one convergence case
 * the Expert tier quotes most and the quick ladder elsewhere.
 */
export const teachingAccessors = () => [
  ['fourObjects', () => fourObjects()],
  ['constantRows', () => constantRows()],
  ['engineConstants', () => engineConstants()],
  ['couplingRatioRows', () => couplingRatioRows()],
  ['publishedStringRow.uniform', () => publishedStringRow('uniform')],
  ['publishedStringRow.taper', () => publishedStringRow('taper')],
  ['teachingStringRow', () => teachingStringRow()],
  ['publishedStringGap', () => publishedStringGap()],
  ['seriesArithmetic', () => seriesArithmetic()],
  ['taperSplitRows', () => taperSplitRows()],
  ['taperOrderWarning', () => taperOrderWarning()],
  ['sizeRefusal', () => sizeRefusal()],
  ['buoyancyRows', () => buoyancyRows()],
  ['buoyancyAtUnity', () => buoyancyAtUnity()],
  ['noteRoutes.uniform', () => noteRoutes('uniform')],
  ['noteRoutes.taper', () => noteRoutes('taper')],
  ['noteRoutes.teaching', () => noteRoutes(ODUMA.label)],
  ['scanGridReplica.taper', () => scanGridReplica('taper')],
  ['scanGridReplica.teaching', () => scanGridReplica(ODUMA.label)],
  ['speedRefusal', () => speedRefusal()],
  ['unitSummary', () => unitSummary()],
  ['goldenUnitSamples', () => goldenUnitSamples()],
  ['unitRevolutionRows', () => unitRevolutionRows()],
  ['unitVelocityAsymmetry', () => unitVelocityAsymmetry()],
  ['sineComparisonRows', () => sineComparisonRows()],
  ['crankSweepRows', () => crankSweepRows()],
  ['armSweepRows', () => armSweepRows()],
  ['genericLinkageRows', () => genericLinkageRows()],
  ['designationRows', () => designationRows()],
  ['plungerRows', () => plungerRows()],
  ['fluidLoadRows', () => fluidLoadRows()],
  ['teachingPump', () => teachingPump()],
  ['publishedPredictRows', () => publishedPredictRows()],
  ['waveTransitRows', () => waveTransitRows()],
  ['waveTransitHeadline', () => waveTransitHeadline()],
  ['publishedSpringRule', () => publishedSpringRule()],
  ['teachingSpringRule', () => teachingSpringRule()],
  ['publishedOvertravelRows', () => publishedOvertravelRows()],
  ['teachingOvertravelRows', () => teachingOvertravelRows()],
  ['overtravelByLoadRows', () => overtravelByLoadRows()],
  ['staticStretchRows', () => staticStretchRows()],
  ['teachingStaticStretch', () => teachingStaticStretch()],
  ['teachingDesignSummary', () => teachingDesignSummary()],
  ['teachingGroups', () => teachingGroups()],
  ['teachingStressRows', () => teachingStressRows()],
  ['teachingSurfaceCardRows', () => teachingSurfaceCardRows()],
  ['teachingPumpCardRows', () => teachingPumpCardRows()],
  ['teachingCardAreas', () => teachingCardAreas()],
  ['dampingSweepRows', () => dampingSweepRows()],
  ['dampingSweepSpread', () => dampingSweepSpread()],
  ['plungerSweepRows', () => plungerSweepRows()],
  ['gravitySweepRows', () => gravitySweepRows()],
  ['powerRows', () => powerRows()],
  ['publishedPowerRows', () => publishedPowerRows()],
  ['teachingPowerPerBarrel', () => teachingPowerPerBarrel()],
  ['samplingSummary', () => samplingSummary()],
  ['publishedSamplingRows', () => publishedSamplingRows()],
  ...SUBSAMPLE_CASE_IDS.map((id) => [`cardSamplesRows.${id}`, () => cardSamplesRows(id)]),
  ...SUBSAMPLE_CASE_IDS.map((id) => [`cardSamplesCost.${id}`, () => cardSamplesCost(id)]),
  ['subsampleBySpeedRows', () => subsampleBySpeedRows()],
  ['subsampleByFillageRows', () => subsampleByFillageRows()],
  ['envelopeSplit', () => envelopeSplit()],
  ['envelopeProfileRows', () => envelopeProfileRows()],
  ['ratingSplit.teaching', () => ratingSplit()],
  ['ratingSplit.standard', () => ratingSplit(STANDARD_DESIGNATION)],
  ['loadingRouteAgreement', () => loadingRouteAgreement()],
  [`convergenceRows.${CONVERGENCE_CASE_IDS[1]}`, () => convergenceRows(CONVERGENCE_CASE_IDS[1], NODE_LADDER)],
  [`convergenceSpread.${CONVERGENCE_CASE_IDS[1]}`, () => convergenceSpread(CONVERGENCE_CASE_IDS[1], NODE_LADDER)],
  [`convergenceRows.${CONVERGENCE_CASE_IDS[0]}`, () => convergenceRows(CONVERGENCE_CASE_IDS[0], NODE_LADDER_QUICK)],
  [`convergenceRows.${CONVERGENCE_CASE_IDS[2]}`, () => convergenceRows(CONVERGENCE_CASE_IDS[2], NODE_LADDER_QUICK)],
  ['periodicityFlag', () => periodicityFlag()],
  ['speedSweepRows', () => speedSweepRows()],
  ...NODE_NOISE_SPMS.map((spm) => [`nodeNoiseRows.${spm}`, () => nodeNoiseRows(spm, NODE_LADDER_QUICK)]),
  ['dipAgainstNoise', () => dipAgainstNoise(NODE_LADDER_QUICK)],
  ['balanceSummary', () => balanceSummary()],
  ['balanceTorqueRows', () => balanceTorqueRows()],
  ['balanceSweepRows', () => balanceSweepRows()],
  ['balanceValue', () => balanceValue()],
  ['balanceSamplingComparison', () => balanceSamplingComparison()],
  ['crankOffsetRows', () => crankOffsetRows()],
  ['torqueGroupFailsOpen', () => torqueGroupFailsOpen()],
  ['ignoredInputRows', () => ignoredInputRows()],
  ['mismatchedKin', () => mismatchedKin()],
  ['balanceSensitivityRows', () => balanceSensitivityRows()],
  ['balanceSensitivitySummary', () => balanceSensitivitySummary()],
  ['goodmanGradeRows', () => goodmanGradeRows()],
  ['goodmanAllowableRows', () => goodmanAllowableRows()],
  ['serviceFactorRows', () => serviceFactorRows()],
  ['serviceFactorCrossing', () => serviceFactorCrossing()],
  ['overstressWarningRows', () => overstressWarningRows()],
  ['sectionLoadingSpread.1.0', () => sectionLoadingSpread(1.0)],
  ['sectionLoadingSpread.0.85', () => sectionLoadingSpread(0.85)],
  ['fillageRows', () => fillageRows()],
  ['fillageSummary', () => fillageSummary()],
  ['fillageCliffRows', () => fillageCliffRows()],
  ['fillageCliffPair', () => fillageCliffPair()],
  ['publishedDiagnosis', () => publishedDiagnosis()],
  ['publishedHarmonicRows', () => publishedHarmonicRows()],
  ['diagnosisRefusal', () => diagnosisRefusal()],
  ['roundTrip', () => roundTrip()],
  ['roundTripHarmonicRows', () => roundTripHarmonicRows()],
  ['diagnosticDampingRows', () => diagnosticDampingRows()],
  ['diagnosticDampingSpread', () => diagnosticDampingSpread()],
];

const walk = (label, value, out, depth = 0) => {
  if (depth > 6) return;
  if (typeof value === 'number') { out.push({ label, value }); return; }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(`${label}[${i}]`, v, out, depth + 1));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => walk(`${label}.${k}`, v, out, depth + 1));
  }
};

/** Every number a panel can render, as {label, value}. The leak guard's first
 * surface. */
export const teachingQuantities = memoize(() => {
  const out = [];
  teachingAccessors().forEach(([label, thunk]) => walk(label, thunk(), out));
  return out;
});

export const teachingNumbers = () => teachingQuantities()
  .map((r) => r.value)
  .filter((v) => Number.isFinite(v));
