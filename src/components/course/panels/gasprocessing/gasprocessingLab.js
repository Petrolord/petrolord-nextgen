// Teaching lab for FC4, Gas Processing. The three panels, the course page and
// the vitest files all read this one module, so a number shown to a learner and
// a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINE'S OWN OUTPUT. Every water content,
// vapour pressure, circulation, duty, stage count, removal fraction, acid gas
// load, contactor diameter, compressibility, temperature derivative,
// Joule-Thomson coefficient, cooling and arrival temperature below is a return
// value of engines/facilities/gasProcessing.js over
// engines/production/gasProperties.js (the Sutton pseudo-criticals, the DAK
// compressibility correlation, the Rankine door, the molecular weight of air
// and the universal gas constant), as repaired in FC4-0 and vendored
// sha-identical with engines 82ec6d4.
//
// NOTHING IN THIS FILE COMPUTES A GAS PROCESSING QUANTITY. Where a reader
// carries a value the teaching digest calls "derived", it is the digest's own
// arithmetic on numbers the engine returned, with the arithmetic stated, and
// the key name says Derived: a difference of two water contents, a ratio of two
// coefficients, a share of a duty, a mole percent subtracted from another. The
// lab and /root/fc-wip-gasprocessing/digest.txt agree because both call the
// engine on the same inputs, not because either copied the other.
//
// CONSTANTS ARE MEASURED, NEVER TYPED. Where the engine keeps a packaging to
// itself, the lab asks the engine a question about itself and reads the answer:
// the standard cubic feet in a pound mole out of a BTEX mole balance, the water
// overhead out of a loop with no reflux, the contactor liquid out of a gas
// density and an allowed velocity, the minutes in a day out of two circulation
// answers, the glycol heat capacity out of a sensible duty. A constant written
// as a literal here would be a claim about the engine rather than a reading of
// it.
//
// UNITS. Field units throughout: MMscfd of gas, psia, degF, lb of water per
// MMscf of gas, gal of solvent per lb of water, gpm and gal a day, mol percent,
// lbmol a day, Btu a gallon, MMBtu an hour, feet of diameter, degF per psi.
// Ratios, factors and fractions are plain numbers.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label
// belongs anywhere in it.
//
// THE CLOCK. Nothing in this domain reads a clock or a random number. There is
// no date input, no seed and no default that falls back to today, so every
// reader is a pure function of its engine inputs. A clock gate in
// gasprocessingLab.test.js proves it under two faked system dates, and a
// timezone gate rebuilds the whole digest a second time west of Greenwich.
//
// REPAIR HISTORY. Digest Section 20 is the one framed history section and
// `repairHistory()` is the reader for it. Everything else this lab returns is
// what the engine does NOW. The counting rule for the engine's own history
// comment lines lives here as `HISTORY_COMMENT_RE` and `countHistoryComments`;
// the walk over the vendored tree is the test's, because a browser module
// cannot read a directory.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

import gasprocessingGolden from '@petrolord/engines/test-data/facilities/goldens/gasprocessing_cases.json';
// Namespaces, not named imports: eslint's node resolver follows the
// node_modules symlink to the SHARED checkout's engines, which predate FC1-0
// and carry no engines/facilities at all. Vite and vitest alias
// @petrolord/engines to this worktree's packages/engines, which does.
// import/namespace still checks members against the shared copy, so it is off
// for this file only; gasprocessingLab.test.js proves every member resolves.
/* eslint-disable import/namespace */
import * as G from '@petrolord/engines/engines/facilities/gasProcessing.js';
import * as P from '@petrolord/engines/engines/production/gasProperties.js';

export const GOLD = gasprocessingGolden;

/** The published case counts, so a golden that loses a block is caught. */
export const goldenCounts = () => ({
  water: GOLD.water.length,
  kremser: GOLD.kremser.length,
  teg: GOLD.teg.length,
  amine: GOLD.amine.length,
  contactor: GOLD.contactor.length,
  blocks: Object.keys(GOLD).length,
});

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes a gas processing quantity.
// ---------------------------------------------------------------------------

/** A state the method has no answer for, returned rather than thrown. */
const softOf = (r) => (r && r.error ? r.error : null);

/** A refusal probe reported as the digest reports one: a label and a message. */
const probe = ([label, fn]) => ({ label, error: softOf(fn()) });

/** kremserFractionRemoved returns an object like every other export since
 *  FC4-0. Every read of it here goes through these two, so the lab can carry a
 *  fraction and a refusal from the same call. */
const kFrac = (args) => G.kremserFractionRemoved(args);
const kNum = (args) => G.kremserFractionRemoved(args).fractionRemoved;

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from
// /root/fc-wip-gasprocessing/fc4_fields.mjs, which fc4_dump.mjs imports. The
// lab test compares each declaration with the wave file text and fails on any
// drift, so these cannot be edited here alone.
// ---------------------------------------------------------------------------

export const OBIAFU_LINE = { pPsia: 950, tF: 104 };

export const OBIAFU = {
  gasMMscfd: 62,
  outletLbMMscf: 7,
  circulationGalPerLb: 3.2,
  leanTegWtPct: 99.2,
  absorberTF: 104,
  reboilerTF: 375,
  refluxRatio: 0.25,
  btexInletPpmv: 180,
  btexAbsorbedFrac: 0.15,
};

export const OBIAFU_CONTACTOR = { gasSg: 0.66, ksFtS: 0.3 };

export const OBIAFU_LEAN_SWEEP = [90.5, 95, 98, 99, 99.2, 99.5, 99.9];
export const LEAN_AT_LOWER_EDGE = 90;
export const LEAN_JUST_INSIDE_LOWER = 90.000001;
export const LEAN_JUST_UNDER_UPPER = 99.999999;
export const LEAN_AT_UPPER_EDGE = 100;
export const RATIO_THAT_FLOODS_THE_LOOP = 0.25;

export const OBIAFU_RATIO_SWEEP = [1.5, 2, 2.5, 3, 3.2, 4, 5, 6];
export const RATIO_AT_LOWER_CUSTOM = 2;
export const RATIO_JUST_UNDER_LOWER = 1.999999;
export const RATIO_AT_UPPER_CUSTOM = 5;
export const RATIO_JUST_OVER_UPPER = 5.000001;

export const OBIAFU_SPEC_SWEEP = [7, 4, 2, 1, 0.5];

export const OBIAFU_RATE_SWEEP = [10, 30, 62, 120, 250];

export const SATURATION_P = [200, 600, 1000, 1500];
export const SATURATION_T = [60, 80, 104, 140];

export const WARN_AT_THRESHOLD = 1000;
export const WARN_JUST_OVER = 1000.000001;

export const FIT_LOW_EDGE_F = -49;
export const FIT_BELOW_LOW_EDGE_F = -49.000001;
export const FIT_HIGH_EDGE_F = 140;
export const FIT_ABOVE_HIGH_EDGE_F = 140.000001;

export const FIT_PUBLISHED_LOW_EDGE_F = -40;
export const FIT_PUBLISHED_HIGH_EDGE_F = 122;
export const FIT_PUBLISHED_JUST_OVER_F = 122.000001;

export const GAS_ABOVE_FIT_F = 200;

export const WATER_FREEZING_F = 32;

export const UBIE = {
  gasMMscfd: 88,
  co2MolPct: 5.2,
  h2sMolPct: 1.4,
  co2SpecMolPct: 2,
  h2sSpecMolPct: 0.0004,
  amineId: 'MDEA',
  amineWtPct: 45,
  leanLoading: 0.05,
  richLoading: 0.48,
  dutyBtuPerGal: 800,
};

export const UBIE_CONTACTOR = { pPsia: 985, tF: 112, gasSg: 0.71, ksFtS: 0.25 };

export const UBIE_AMINE_IDS = ['MEA', 'DEA', 'MDEA'];

export const UBIE_RICH_SWEEP = [0.30, 0.38, 0.44, 0.48, 0.50, 0.55];
export const RICH_AT_MDEA_LIMIT = 0.5;
export const RICH_JUST_OVER_MDEA_LIMIT = 0.500001;

export const UBIE_LEAN_SWEEP = [0.01, 0.03, 0.05, 0.08, 0.12];

export const UBIE_SPEC_ALREADY_MET = { co2SpecMolPct: 5.2, h2sSpecMolPct: 1.4 };
export const UBIE_SPEC_ABOVE_INLET = { co2SpecMolPct: 7.5, h2sSpecMolPct: 0 };

export const KREMSER_FACTORS = [0.6, 0.8, 1.0, 1.2, 1.5, 2.0, 3.0];
export const KREMSER_STAGES = [1, 2, 3, 4, 6, 8, 12];
export const OBIAFU_ABSORPTION_FACTOR = 1.6;
export const OBIAFU_STAGES = 6;
export const A_AT_UNITY = 1;
export const A_JUST_UNDER_UNITY = 1 - 1e-9;
export const A_JUST_OVER_UNITY = 1 + 1e-9;
export const A_WELL_UNDER_UNITY = 0.8;
export const UNREACHABLE_SPEC = 0.9;

export const AGBADA = { p1Psia: 1180, p2Psia: 640, tF: 96, gasSg: 0.68, cpBtuLbmolF: 9.8 };
export const AGBADA_P_SWEEP = [50, 200, 600, 1000, 1500, 2200];
export const AGBADA_CP_SWEEP = [8.5, 9.5, 10.5, 12];
export const AGBADA_STEP_SWEEP = [1, 2, 5, 10, 20, 50, 200];
export const AGBADA_STEP_REFERENCE = 20000;
export const AGBADA_STEPS_REFUSED = [0, -5, 0.4];
export const SG_SUTTON_BREAKS = 5.08;
export const SG_SUTTON_LAST_PHYSICAL = 5.07;
export const AGBADA_DEEP_P2_PSIA = 60;
export const AGBADA_COLD_INLET_F = 10;
export const AGBADA_COLD_P2_PSIA = 200;

export const LBMOL_PROBE = {
  gasMMscfd: 1, inletLbMMscf: 2, outletLbMMscf: 1,
  btexInletPpmv: 1e6, btexAbsorbedFrac: 1, btexMw: 1,
};

export const OVERHEAD_PROBE = {
  gasMMscfd: 1, inletLbMMscf: 2, outletLbMMscf: 1,
  circulationGalPerLb: 1, refluxRatio: 0,
};

export const MINUTES_PROBE = { gasMMscfd: 10, inletLbMMscf: 50, outletLbMMscf: 7 };

export const TONS_PROBE = {
  gasMMscfd: 10, inletLbMMscf: 50, outletLbMMscf: 7,
  btexInletPpmv: 500, btexAbsorbedFrac: 0.15, btexMw: 92,
};

export const RHO_L_PROBE = { gasMMscfd: 40, pPsia: 800, tF: 100, gasSg: 0.65, ksFtS: 0.5 };

export const AMINE_DENSITY_PROBE = {
  gasMMscfd: 50, co2MolPct: 3, amineId: 'MDEA', amineWtPct: 50,
  leanLoading: 0, richLoading: 0.5, dutyBtuPerGal: 1000,
};

export const REBOILER_GROUP_PROBE = { gasMMscfd: 25, inletLbMMscf: 60, outletLbMMscf: 5 };

// ---------------------------------------------------------------------------
// The two teaching chains, run once per reader call rather than memoised, so
// every reader sees the same engine at the same inputs.
// ---------------------------------------------------------------------------

const obSat = () => G.saturatedWaterContent(OBIAFU_LINE);
const obPack = () => G.tegPackage({ ...OBIAFU, inletLbMMscf: obSat().lbPerMMscf });
const obCont = () => G.contactorDiameter({
  gasMMscfd: OBIAFU.gasMMscfd, pPsia: OBIAFU_LINE.pPsia, tF: OBIAFU_LINE.tF,
  ...OBIAFU_CONTACTOR,
});
const ubPack = () => G.aminePackage(UBIE);
const ubCont = () => G.contactorDiameter({ gasMMscfd: UBIE.gasMMscfd, ...UBIE_CONTACTOR });

/** One TEG package on the OBIAFU chain with one input overridden. */
const obWith = (over) => G.tegPackage({ ...OBIAFU, inletLbMMscf: obSat().lbPerMMscf, ...over });

/** The three amines run at their own strength, rich limit and duty. */
const amineAtOwn = (id) => G.aminePackage({
  gasMMscfd: UBIE.gasMMscfd, co2MolPct: UBIE.co2MolPct, h2sMolPct: UBIE.h2sMolPct,
  co2SpecMolPct: UBIE.co2SpecMolPct, h2sSpecMolPct: UBIE.h2sSpecMolPct,
  amineId: id, leanLoading: UBIE.leanLoading,
});

/** The liquid each of the first three published contactor cases is sized
 *  against: glycol, glycol, and an MDEA solution built from the amine table's
 *  own solution gravity. */
const contactorLiquids = () => [G.TEG_LB_PER_FT3, G.TEG_LB_PER_FT3, G.amineSolutionLbPerFt3('MDEA')];

// ---------------------------------------------------------------------------
// THE TWENTY READERS, one per digest section.
// ---------------------------------------------------------------------------

/** Section 1. What this engine conditions, and what it refuses. */
export const engineScope = () => {
  const sat = obSat();
  const ob = obPack();
  const ub = ubPack();
  return {
    obiafuInletLbMMscf: sat.lbPerMMscf,
    obiafuWaterLbDay: ob.waterLbDay,
    obiafuCircGpm: ob.circGpm,
    obiafuReboilerMMBtuHr: ob.reboilerMMBtuHr,
    ubieAcidMolesDay: ub.acidMolesDay,
    ubieRichLoadingUsed: ub.richLoadingUsed,
    ubieSwingDerived: ub.richLoadingUsed - UBIE.leanLoading,
    ubieCircGpm: ub.circGpm,
    ubieReboilerMMBtuHr: ub.reboilerMMBtuHr,
    obiafuDiameterFt: obCont().diameterFt,
    ubieDiameterFt: ubCont().diameterFt,
  };
};

/** Section 2. The numbers this module stands on: derived, measured, declared. */
export const moduleConstants = () => {
  const sat = obSat();
  const lbmolProbe = G.tegPackage(LBMOL_PROBE);
  const overheadProbe = G.tegPackage(OVERHEAD_PROBE);
  const minutesProbe = G.tegPackage(MINUTES_PROBE);
  const tonsProbe = G.tegPackage(TONS_PROBE);
  const rhoLProbe = G.contactorDiameter(RHO_L_PROBE);
  const reboilerProbe = G.tegPackage(REBOILER_GROUP_PROBE);
  const measuredLbmol = 1e6 / lbmolProbe.btexLbDay;
  const measuredOverhead = overheadProbe.vaporPerGal;
  const measuredMinutes = minutesProbe.circGpd / minutesProbe.circGpm;
  const measuredRhoL = rhoLProbe.rhoG * ((rhoLProbe.vAllowFtS / RHO_L_PROBE.ksFtS) ** 2 + 1);
  const measuredYearTon = tonsProbe.btexTonsYear / tonsProbe.btexLbDay;
  const measuredReboilerGroup = (reboilerProbe.circGpd * reboilerProbe.dutyBtuPerGal)
    / reboilerProbe.reboilerMMBtuHr;
  const measuredMwWater = sat.lbPerMMscf / (sat.yWater * (1e6 / G.LBMOL_SCF));
  return {
    stdPressurePsia: G.STD_PRESSURE_PSIA,
    stdTemperatureR: G.STD_TEMPERATURE_R,
    lbmolScf: G.LBMOL_SCF,
    lbmolScfDerived: (P.R_UNIVERSAL * G.STD_TEMPERATURE_R) / G.STD_PRESSURE_PSIA,
    galPerFt3: G.GAL_PER_FT3,
    tegLbPerFt3: G.TEG_LB_PER_FT3,
    measuredRows: [
      ['standard cubic feet a pound mole', G.LBMOL_SCF, measuredLbmol],
      ['the water overhead, Btu a lb', G.WATER_OVERHEAD_BTU_PER_LB, measuredOverhead],
      ['the contactor liquid, lb a ft3', G.TEG_LB_PER_FT3, measuredRhoL],
      ['the molecular weight of water', G.DECLARED_CONSTANTS.MW_WATER, measuredMwWater],
    ],
    measuredMinutes,
    measuredYearTon,
    measuredReboilerGroup,
    declaredRows: [
      ['glycol, lb a gallon', G.DECLARED_CONSTANTS.TEG_LB_PER_GAL],
      ['water, lb a gallon', G.DECLARED_CONSTANTS.WATER_LB_PER_GAL],
      ['the water overhead, Btu a lb', G.DECLARED_CONSTANTS.WATER_OVERHEAD_BTU_PER_LB],
      ['the BTEX molecular weight', G.DECLARED_CONSTANTS.BTEX_MW_DEFAULT],
      ['the molecular weight of water', G.DECLARED_CONSTANTS.MW_WATER],
      ['the Magnus coefficient', G.DECLARED_CONSTANTS.MAGNUS_A],
      ['the Magnus numerator', G.DECLARED_CONSTANTS.MAGNUS_B],
      ['the Magnus denominator', G.DECLARED_CONSTANTS.MAGNUS_C],
      ['the customary circulation band, low', G.DECLARED_CONSTANTS.CUSTOMARY_CIRCULATION_LO],
      ['the customary circulation band, high', G.DECLARED_CONSTANTS.CUSTOMARY_CIRCULATION_HI],
      ['the pressure the chart warning starts at, psia', G.DECLARED_CONSTANTS.CHART_WARNING_PSIA],
    ],
    amineRows: G.AMINES.map((a) => ({
      id: a.id, mw: a.mw, sgSolution: a.sgSolution, maxLoading: a.maxLoading,
      heatBtuPerGal: a.heatBtuPerGal, wtPctTypical: a.wtPctTypical,
    })),
    rankineOffsetR: P.toRankine(0),
    airMw: P.AIR_MW,
    rUniversal: P.R_UNIVERSAL,
    tegLbPerGal: G.TEG_LB_PER_GAL,
    glycolDensityRatioDerived: G.TEG_LB_PER_FT3 / (G.TEG_LB_PER_GAL * G.GAL_PER_FT3),
  };
};

/** Section 3. How much water a gas carries. */
export const waterCarried = () => {
  const sat = obSat();
  const psat = G.waterSatPsia(OBIAFU_LINE.tF);
  return {
    yWater: sat.yWater,
    lbPerMMscf: sat.lbPerMMscf,
    psatPsia: psat,
    yWaterDerived: psat / OBIAFU_LINE.pPsia,
    surface: SATURATION_T.map((t) => ({
      tF: t,
      lbPerMMscf: SATURATION_P.map((p) => G.saturatedWaterContent({ pPsia: p, tF: t }).lbPerMMscf),
    })),
    vapourCurve: SATURATION_T.map((t) => ({ tF: t, psatPsia: G.waterSatPsia(t) })),
    published: GOLD.water.map((row) => {
      const r = G.saturatedWaterContent(row);
      return {
        pPsia: row.pPsia,
        tF: row.tF,
        engineLbPerMMscf: r.lbPerMMscf,
        goldenLbPerMMscf: row.lbPerMMscf,
        ratioDerived: r.lbPerMMscf / row.lbPerMMscf,
      };
    }),
  };
};

/** Section 4. The band the water answer is honest in: one refusal, two
 *  warnings, and both sides of every edge. */
export const honestBand = () => ({
  fitLimit: [FIT_BELOW_LOW_EDGE_F, FIT_LOW_EDGE_F, FIT_HIGH_EDGE_F, FIT_ABOVE_HIGH_EDGE_F].map((t) => {
    const r = G.saturatedWaterContent({ pPsia: 500, tF: t });
    return {
      tF: t, tCDerived: (t - 32) / 1.8, error: softOf(r), lbPerMMscf: r.lbPerMMscf ?? null,
    };
  }),
  studioRefusal: softOf(G.saturatedWaterContent({ pPsia: OBIAFU_LINE.pPsia, tF: GAS_ABOVE_FIT_F })),
  publicationLimit: [FIT_PUBLISHED_LOW_EDGE_F, 60, FIT_PUBLISHED_HIGH_EDGE_F, FIT_PUBLISHED_JUST_OVER_F, FIT_HIGH_EDGE_F].map((t) => {
    const r = G.saturatedWaterContent({ pPsia: 500, tF: t });
    return {
      tF: t, tCDerived: (t - 32) / 1.8, refused: Boolean(r.error), warning: r.warning ?? null,
    };
  }),
  methodLimit: [WARN_AT_THRESHOLD, WARN_JUST_OVER].map((pPsia) => ({
    pPsia, warning: G.saturatedWaterContent({ pPsia, tF: OBIAFU_LINE.tF }).warning ?? null,
  })),
  otherRefusals: [
    ['a total pressure below the water vapour pressure', () => G.saturatedWaterContent({ pPsia: 0.5, tF: 104 })],
    ['a total pressure exactly at the water vapour pressure', () => G.saturatedWaterContent({ pPsia: G.waterSatPsia(104), tF: 104 })],
    ['a total pressure of zero', () => G.saturatedWaterContent({ pPsia: 0, tF: 104 })],
    ['a temperature below absolute zero', () => G.saturatedWaterContent({ pPsia: 500, tF: -600 })],
    ['no temperature at all', () => G.saturatedWaterContent({ pPsia: 500 })],
  ].map(probe),
});

/** Section 5. The water a unit has to take out. */
export const waterToTakeOut = () => {
  const sat = obSat();
  const ob = obPack();
  return {
    inletLbMMscf: sat.lbPerMMscf,
    removedLbMMscfDerived: sat.lbPerMMscf - OBIAFU.outletLbMMscf,
    waterLbDay: ob.waterLbDay,
    specSweep: OBIAFU_SPEC_SWEEP.map((outletLbMMscf) => {
      const r = obWith({ outletLbMMscf });
      return {
        outletLbMMscf,
        waterLbDay: r.waterLbDay,
        circGpm: r.circGpm,
        reboilerMMBtuHr: r.reboilerMMBtuHr,
      };
    }),
    rateSweep: OBIAFU_RATE_SWEEP.map((gasMMscfd) => {
      const r = obWith({ gasMMscfd });
      return {
        gasMMscfd,
        waterLbDay: r.waterLbDay,
        circGpm: r.circGpm,
        reboilerMMBtuHr: r.reboilerMMBtuHr,
        dutyBtuPerGal: r.dutyBtuPerGal,
      };
    }),
  };
};

/** Section 6. The circulation ratio is a choice, and so is the lean strength. */
export const circulationChoice = () => {
  const ob = obPack();
  return {
    ratioSweep: OBIAFU_RATIO_SWEEP.map((circulationGalPerLb) => {
      const r = obWith({ circulationGalPerLb });
      return {
        circulationGalPerLb,
        circGpm: r.circGpm,
        dutyBtuPerGal: r.dutyBtuPerGal,
        sensiblePerGal: r.sensiblePerGal,
        vaporPerGal: r.vaporPerGal,
        reboilerMMBtuHr: r.reboilerMMBtuHr,
        warned: Boolean(r.warning),
      };
    }),
    leanSweep: OBIAFU_LEAN_SWEEP.map((leanTegWtPct) => {
      const r = obWith({ leanTegWtPct });
      return {
        leanTegWtPct,
        leanWaterLbPerGal: r.leanWaterLbPerGal,
        richTegWtPct: r.richTegWtPct,
        warned: Boolean(r.warning),
      };
    }),
    leanWaterLbPerGal: ob.leanWaterLbPerGal,
    richTegWtPct: ob.richTegWtPct,
    outletSpecBasis: ob.outletSpecBasis,
    floodedLoop: [RATIO_THAT_FLOODS_THE_LOOP, 0.5, 1, 2, 3.2, 5].map((circulationGalPerLb) => {
      const r = obWith({ circulationGalPerLb });
      return {
        circulationGalPerLb,
        waterPerGalDerived: 1 / circulationGalPerLb,
        richTegWtPct: r.richTegWtPct,
        warning: r.warning ?? null,
      };
    }),
    strengthBand: [LEAN_AT_LOWER_EDGE, LEAN_JUST_INSIDE_LOWER, LEAN_JUST_UNDER_UPPER, LEAN_AT_UPPER_EDGE].map((leanTegWtPct) => {
      const r = obWith({ leanTegWtPct });
      return { leanTegWtPct, error: softOf(r), richTegWtPct: r.richTegWtPct ?? null };
    }),
    customaryBand: [RATIO_JUST_UNDER_LOWER, RATIO_AT_LOWER_CUSTOM, RATIO_AT_UPPER_CUSTOM, RATIO_JUST_OVER_UPPER].map((circulationGalPerLb) => ({
      circulationGalPerLb,
      warning: obWith({ circulationGalPerLb }).warning ?? null,
    })),
  };
};

/** Section 7. What the reboiler pays for, in its two named parts. */
export const reboilerPaysFor = () => {
  const ob = obPack();
  const riseF = OBIAFU.reboilerTF - OBIAFU.absorberTF;
  return {
    riseF,
    tegLbPerGal: G.TEG_LB_PER_GAL,
    // The glycol heat capacity is a default the engine keeps: measured back
    // out of the sensible duty it returned rather than typed.
    cpTegBtuLbFMeasured: ob.sensiblePerGal / (G.TEG_LB_PER_GAL * riseF),
    sensiblePerGal: ob.sensiblePerGal,
    waterPerGalDerived: 1 / OBIAFU.circulationGalPerLb,
    overheadBtuPerLb: G.WATER_OVERHEAD_BTU_PER_LB,
    vaporPerGal: ob.vaporPerGal,
    dutyBtuPerGal: ob.dutyBtuPerGal,
    sensibleShareDerived: ob.sensiblePerGal / ob.dutyBtuPerGal,
    circGpd: ob.circGpd,
    reboilerMMBtuHr: ob.reboilerMMBtuHr,
    refluxSweep: [0, 0.1, 0.2, 0.25, 0.4, 0.6].map((refluxRatio) => {
      const r = obWith({ refluxRatio });
      return {
        refluxRatio,
        vaporPerGal: r.vaporPerGal,
        dutyBtuPerGal: r.dutyBtuPerGal,
        reboilerMMBtuHr: r.reboilerMMBtuHr,
      };
    }),
    stillSweep: [340, 360, 375, 390, 400].map((reboilerTF) => {
      const r = obWith({ reboilerTF });
      return {
        reboilerTF,
        sensiblePerGal: r.sensiblePerGal,
        vaporPerGal: r.vaporPerGal,
        dutyBtuPerGal: r.dutyBtuPerGal,
      };
    }),
  };
};

/** Section 8. The TEG published cases. */
export const tegPublishedCases = () => ({
  rows: GOLD.teg.map((row) => {
    const r = G.tegPackage(row);
    return {
      gasMMscfd: row.gasMMscfd,
      inletLbMMscf: row.inletLbMMscf,
      outletLbMMscf: row.outletLbMMscf,
      circulationGalPerLb: row.circulationGalPerLb,
      waterLbDay: r.waterLbDay,
      circGpm: r.circGpm,
      dutyBtuPerGal: r.dutyBtuPerGal,
      reboilerMMBtuHr: r.reboilerMMBtuHr,
      btexLbDay: r.btexLbDay,
    };
  }),
  ratios: GOLD.teg.map((row, i) => {
    const r = G.tegPackage(row);
    return {
      caseNumber: i + 1,
      waterRatioDerived: r.waterLbDay / row.waterLbDay,
      circRatioDerived: r.circGpm / row.circGpm,
      dutyRatioDerived: r.dutyBtuPerGal / row.dutyBtuPerGal,
      reboilerRatioDerived: r.reboilerMMBtuHr / row.reboilerMMBtuHr,
      btexRatioDerived: r.btexLbDay / row.btexLbDay,
    };
  }),
});

/** Section 9. A contactor is a staged device. */
export const stagedDevice = () => ({
  obiafuRemoval: kNum({ absorptionFactor: OBIAFU_ABSORPTION_FACTOR, stages: OBIAFU_STAGES }),
  surface: KREMSER_STAGES.map((stages) => ({
    stages,
    removals: KREMSER_FACTORS.map((absorptionFactor) => kNum({ absorptionFactor, stages })),
  })),
  ceiling: [0.6, A_WELL_UNDER_UNITY, 0.95, A_JUST_UNDER_UNITY, A_AT_UNITY, A_JUST_OVER_UNITY, 1.2].map((absorptionFactor) => {
    const f200 = kNum({ absorptionFactor, stages: 200 });
    return {
      absorptionFactor,
      at12: kNum({ absorptionFactor, stages: 12 }),
      at200: f200,
      gapDerived: f200 - absorptionFactor,
    };
  }),
  solvedBack: [[1.2, 0.9], [OBIAFU_ABSORPTION_FACTOR, 0.9], [OBIAFU_ABSORPTION_FACTOR, 0.99], [2.0, 0.99], [A_AT_UNITY, 0.9]].map(([absorptionFactor, fractionRemoved]) => {
    const s = G.kremserStagesFor({ absorptionFactor, fractionRemoved });
    return {
      absorptionFactor,
      fractionRemoved,
      error: softOf(s),
      stages: s.error ? null : s.stages,
      checkRemoval: s.error ? null : kNum({ absorptionFactor, stages: s.stages }),
    };
  }),
  starvedRefusal: softOf(G.kremserStagesFor({
    absorptionFactor: A_WELL_UNDER_UNITY, fractionRemoved: UNREACHABLE_SPEC,
  })),
  published: GOLD.kremser.map((row) => {
    const f = kNum(row);
    return {
      absorptionFactor: row.absorptionFactor,
      stages: row.stages,
      engine: f,
      golden: row.fractionRemoved,
      ratioDerived: f / row.fractionRemoved,
    };
  }),
});

/** Section 10. Acid gas is removed by moles. */
export const acidGasByMoles = () => {
  const ub = ubPack();
  return {
    removedMolPctDerived: (UBIE.co2MolPct - UBIE.co2SpecMolPct) + (UBIE.h2sMolPct - UBIE.h2sSpecMolPct),
    acidMolesDay: ub.acidMolesDay,
    richLoadingUsed: ub.richLoadingUsed,
    swingDerived: ub.richLoadingUsed - UBIE.leanLoading,
    circGpm: ub.circGpm,
    reboilerMMBtuHr: ub.reboilerMMBtuHr,
    swingVanishesRefusal: softOf(G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading })),
    richSweep: UBIE_RICH_SWEEP.map((richLoading) => {
      const r = G.aminePackage({ ...UBIE, richLoading });
      return {
        richLoading,
        swingDerived: richLoading - UBIE.leanLoading,
        circGpm: r.circGpm,
        reboilerMMBtuHr: r.reboilerMMBtuHr,
        warned: Boolean(r.warning),
      };
    }),
    leanSweep: UBIE_LEAN_SWEEP.map((leanLoading) => {
      const r = G.aminePackage({ ...UBIE, leanLoading });
      return {
        leanLoading,
        swingDerived: UBIE.richLoading - leanLoading,
        circGpm: r.circGpm,
        reboilerMMBtuHr: r.reboilerMMBtuHr,
        perGpmDerived: r.reboilerMMBtuHr / r.circGpm,
      };
    }),
    corrosionBand: [RICH_AT_MDEA_LIMIT, RICH_JUST_OVER_MDEA_LIMIT].map((richLoading) => ({
      richLoading, warning: G.aminePackage({ ...UBIE, richLoading }).warning ?? null,
    })),
    lookalikeRefusals: [
      ['a spec already met at the inlet', () => G.aminePackage({ ...UBIE, ...UBIE_SPEC_ALREADY_MET })],
      ['a spec set above the inlet', () => G.aminePackage({ ...UBIE, ...UBIE_SPEC_ABOVE_INLET })],
      ['a lean loading at or above the rich', () => G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading })],
    ].map(probe),
    published: ['MDEA', 'DEA', 'MEA'].map((amineId, i) => {
      const row = GOLD.amine[i];
      const r = G.aminePackage({ ...row, amineId });
      return {
        amineId,
        circGpm: r.circGpm,
        circGpmGolden: row.circGpm,
        circRatioDerived: r.circGpm / row.circGpm,
        reboilerMMBtuHr: r.reboilerMMBtuHr,
        reboilerMMBtuHrGolden: row.reboilerMMBtuHr,
        reboilerRatioDerived: r.reboilerMMBtuHr / row.reboilerMMBtuHr,
      };
    }),
  };
};

/** Section 11. Three amines, and what separates them. */
export const threeAmines = () => {
  const runs = UBIE_AMINE_IDS.map((id) => ({ id, r: amineAtOwn(id) }));
  return {
    propertyRows: G.AMINES.map((a) => ({
      id: a.id, mw: a.mw, wtPctTypical: a.wtPctTypical, maxLoading: a.maxLoading,
      heatBtuPerGal: a.heatBtuPerGal, sgSolution: a.sgSolution,
    })),
    runs: runs.map(({ id, r }) => ({
      id,
      circGpm: r.circGpm,
      reboilerMMBtuHr: r.reboilerMMBtuHr,
      richLoadingUsed: r.richLoadingUsed,
      perGpmDerived: r.reboilerMMBtuHr / r.circGpm,
    })),
    perGpmCheck: UBIE_AMINE_IDS.map((id) => {
      const a = G.amineOf(id);
      const r = amineAtOwn(id);
      return {
        id,
        fromTwoEngineFiguresDerived: r.reboilerMMBtuHr / r.circGpm,
        fromTheTableDerived: (a.heatBtuPerGal * 60) / 1e6,
      };
    }),
    pairs: [[0, 2], [1, 2], [0, 1]].map(([i, j]) => ({
      left: runs[i].id,
      right: runs[j].id,
      circRatioDerived: runs[i].r.circGpm / runs[j].r.circGpm,
      dutyRatioDerived: runs[i].r.reboilerMMBtuHr / runs[j].r.reboilerMMBtuHr,
    })),
    unknownAmine: G.amineOf('DIPA'),
    unknownAmineRefusal: softOf(G.aminePackage({ ...UBIE, amineId: 'DIPA' })),
  };
};

/** Section 12. The vessel the gas goes up. */
export const vesselGasGoesUp = () => {
  const ob = obCont();
  const ub = ubCont();
  const liquids = contactorLiquids();
  const amineThird = G.contactorDiameter({ ...GOLD.contactor[2], rhoLLbFt3: G.amineSolutionLbPerFt3('MDEA') });
  const glycolThird = G.contactorDiameter({ ...GOLD.contactor[2], rhoLLbFt3: G.TEG_LB_PER_FT3 });
  return {
    obiafu: {
      rhoG: ob.rhoG, z: ob.z, vAllowFtS: ob.vAllowFtS, diameterFt: ob.diameterFt,
    },
    ubie: {
      rhoG: ub.rhoG, z: ub.z, vAllowFtS: ub.vAllowFtS, diameterFt: ub.diameterFt,
    },
    zSurface: [[600, 100, 0.65], [950, 104, 0.66], [1400, 110, 0.7], [1400, 60, 0.7], [2000, 110, 0.75]].map(([pPsia, tF, gasSg]) => {
      const r = G.contactorDiameter({
        gasMMscfd: OBIAFU.gasMMscfd, pPsia, tF, gasSg, ksFtS: OBIAFU_CONTACTOR.ksFtS,
      });
      return {
        pPsia, tF, gasSg, z: r.z, rhoG: r.rhoG, vAllowFtS: r.vAllowFtS, diameterFt: r.diameterFt,
      };
    }),
    kSweep: [0.15, 0.2, 0.25, 0.3, 0.35, 0.4].map((ksFtS) => {
      const r = G.contactorDiameter({
        gasMMscfd: OBIAFU.gasMMscfd, pPsia: OBIAFU_LINE.pPsia, tF: OBIAFU_LINE.tF,
        gasSg: OBIAFU_CONTACTOR.gasSg, ksFtS,
      });
      return { ksFtS, vAllowFtS: r.vAllowFtS, diameterFt: r.diameterFt };
    }),
    givenZ: GOLD.contactor.slice(0, 3).map((row, i) => {
      const r = G.contactorDiameter({ ...row, rhoLLbFt3: liquids[i] });
      return {
        gasMMscfd: row.gasMMscfd,
        pPsia: row.pPsia,
        tF: row.tF,
        z: row.z,
        rhoLLbFt3: liquids[i],
        diameterFt: r.diameterFt,
        diameterGoldenFt: row.diameterFt,
        ratioDerived: r.diameterFt / row.diameterFt,
      };
    }),
    thirdAgainstGlycolFt: glycolThird.diameterFt,
    thirdAgainstAmineFt: amineThird.diameterFt,
    thirdLiquidFactorDerived: amineThird.diameterFt / glycolThird.diameterFt,
    ownZ: GOLD.contactor.slice(3).map((row) => {
      const r = G.contactorDiameter({
        gasMMscfd: row.gasMMscfd, pPsia: row.pPsia, tF: row.tF, gasSg: row.gasSg, ksFtS: row.ksFtS,
      });
      return {
        gasMMscfd: row.gasMMscfd,
        pPsia: row.pPsia,
        tF: row.tF,
        z: r.z,
        zGolden: row.z,
        diameterFt: r.diameterFt,
        diameterGoldenFt: row.diameterFt,
        ratioDerived: r.diameterFt / row.diameterFt,
      };
    }),
    zSourceFormed: G.contactorDiameter({
      gasMMscfd: 50, pPsia: 1000, tF: 100, gasSg: 0.65,
    }).zSource,
    zSourceGiven: G.contactorDiameter({
      gasMMscfd: 50, pPsia: 1000, tF: 100, gasSg: 0.65, z: 0.85,
    }).zSource,
    tegLbPerFt3: G.TEG_LB_PER_FT3,
    amineLiquids: G.AMINES.map((a) => ({ id: a.id, lbPerFt3: G.amineSolutionLbPerFt3(a.id) })),
  };
};

/** Section 13. The still overhead nobody sells. */
export const stillOverhead = () => {
  const ob = obPack();
  const at = (btexInletPpmv, btexAbsorbedFrac) => obWith({ btexInletPpmv, btexAbsorbedFrac }).btexLbDay;
  return {
    btexLbDay: ob.btexLbDay,
    btexTonsYear: ob.btexTonsYear,
    rows: [[60, 0.1], [180, 0.1], [180, 0.15], [180, 0.2], [400, 0.15], [900, 0.15]].map(([btexInletPpmv, btexAbsorbedFrac]) => {
      const r = obWith({ btexInletPpmv, btexAbsorbedFrac });
      return {
        btexInletPpmv, btexAbsorbedFrac, btexLbDay: r.btexLbDay, btexTonsYear: r.btexTonsYear,
      };
    }),
    ppmvTripledDerived: at(180, 0.1) / at(60, 0.1),
    fractionDoubledDerived: at(180, 0.2) / at(180, 0.1),
    btexMwDefault: G.DECLARED_CONSTANTS.BTEX_MW_DEFAULT,
  };
};

/** Section 14. Cooling by expansion, the march, and the cold separator. */
export const coldEnd = () => {
  const mu = G.jouleThomsonFPerPsi({
    pPsia: AGBADA.p1Psia, tF: AGBADA.tF, gasSg: AGBADA.gasSg, cpBtuLbmolF: AGBADA.cpBtuLbmolF,
  });
  const march = G.jtDrop(AGBADA);
  const reference = G.jtDrop({ ...AGBADA, steps: AGBADA_STEP_REFERENCE });
  const cold = G.jtDrop({ ...AGBADA, tF: AGBADA_COLD_INLET_F, p2Psia: AGBADA_COLD_P2_PSIA });
  const waterIn = G.saturatedWaterContent({ pPsia: AGBADA.p1Psia, tF: AGBADA.tF });
  const waterOut = G.saturatedWaterContent({ pPsia: AGBADA.p2Psia, tF: march.t2F });
  return {
    z: mu.z,
    ppr: mu.ppr,
    tpr: mu.tpr,
    dzdT: mu.dzdT,
    muFPerPsi: mu.muFPerPsi,
    muPer100PsiDerived: mu.muFPerPsi * 100,
    pressureSweep: AGBADA_P_SWEEP.map((pPsia) => {
      const r = G.jouleThomsonFPerPsi({
        pPsia, tF: AGBADA.tF, gasSg: AGBADA.gasSg, cpBtuLbmolF: AGBADA.cpBtuLbmolF,
      });
      return {
        pPsia,
        refused: Boolean(r.error),
        z: r.z ?? null,
        dzdT: r.dzdT ?? null,
        muFPerPsi: r.muFPerPsi ?? null,
        muPer100PsiDerived: r.error ? null : r.muFPerPsi * 100,
      };
    }),
    cpSweep: AGBADA_CP_SWEEP.map((cpBtuLbmolF) => {
      const r = G.jouleThomsonFPerPsi({
        pPsia: AGBADA.p1Psia, tF: AGBADA.tF, gasSg: AGBADA.gasSg, cpBtuLbmolF,
      });
      return {
        cpBtuLbmolF,
        muPer100PsiDerived: r.muFPerPsi * 100,
        cpTimesMuDerived: cpBtuLbmolF * r.muFPerPsi,
      };
    }),
    t2F: march.t2F,
    dropF: march.dropF,
    steps: march.steps,
    muInletFPerPsi: march.muInletFPerPsi,
    muLastStepFPerPsi: march.muLastStepFPerPsi,
    muMeanFPerPsi: march.muMeanFPerPsi,
    inletOverMeanDerived: march.muInletFPerPsi / march.muMeanFPerPsi,
    referenceDropF: reference.dropF,
    stepSweep: AGBADA_STEP_SWEEP.map((steps) => {
      const r = G.jtDrop({ ...AGBADA, steps });
      return {
        steps,
        dropF: r.dropF,
        t2F: r.t2F,
        overReferenceDerived: r.dropF / reference.dropF,
      };
    }),
    stepRefusals: AGBADA_STEPS_REFUSED.map((steps) => ({
      steps, error: softOf(G.jtDrop({ ...AGBADA, steps })),
    })),
    backwardsRefusal: softOf(G.jtDrop({
      p1Psia: AGBADA.p2Psia, p2Psia: AGBADA.p1Psia, tF: AGBADA.tF, gasSg: AGBADA.gasSg,
    })),
    equalPressureRefusal: softOf(G.jtDrop({ ...AGBADA, p2Psia: AGBADA.p1Psia })),
    deeperLetDown: [AGBADA.p2Psia, AGBADA_DEEP_P2_PSIA, 25, 8].map((p2Psia) => {
      const r = G.jtDrop({ ...AGBADA, p2Psia });
      return {
        p2Psia, error: softOf(r), t2F: r.t2F ?? null, dropF: r.dropF ?? null,
      };
    }),
    coldInletRefusal: softOf(cold),
    coldDiedAtStep: cold.diedAtStep,
    coldSteps: cold.steps,
    coldDiedAtPsia: cold.diedAtPsia,
    coldDiedAtF: cold.diedAtF,
    gravityEdge: [AGBADA.gasSg, SG_SUTTON_LAST_PHYSICAL, SG_SUTTON_BREAKS].map((gasSg) => {
      const r = G.jouleThomsonFPerPsi({
        pPsia: AGBADA.p1Psia, tF: AGBADA.tF, gasSg, cpBtuLbmolF: AGBADA.cpBtuLbmolF,
      });
      return { gasSg, error: softOf(r), muFPerPsi: r.muFPerPsi ?? null };
    }),
    waterInLbMMscf: waterIn.lbPerMMscf,
    waterOutLbMMscf: waterOut.lbPerMMscf,
    dropOutLbMMscfDerived: waterIn.lbPerMMscf - waterOut.lbPerMMscf,
    heldFractionDerived: waterOut.lbPerMMscf / waterIn.lbPerMMscf,
    // THE FOUR STATES. The third row is the point of the panel: letting the gas
    // down without cooling it lets it hold MORE water than it arrived with, so
    // the expansion dries the gas only through the cooling it causes.
    fourStates: [
      ['at the inlet', AGBADA.p1Psia, AGBADA.tF],
      ['cooled, but still at inlet pressure', AGBADA.p1Psia, march.t2F],
      ['let down, but not yet cooled', AGBADA.p2Psia, AGBADA.tF],
      ['at the cold separator', AGBADA.p2Psia, march.t2F],
    ].map(([label, pPsia, tF]) => {
      const r = G.saturatedWaterContent({ pPsia, tF });
      return {
        label, pPsia, tF, error: softOf(r), lbPerMMscf: r.lbPerMMscf ?? null,
      };
    }),
  };
};

/** Every refusal the module makes, as Section 15 lists them. Exported so the
 *  refusal gate has a surface it cannot silently lose. */
export const REFUSAL_PROBES = [
  ['a temperature outside the water fit', () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_ABOVE_HIGH_EDGE_F })],
  ['a total pressure at or below the water vapour pressure', () => G.saturatedWaterContent({ pPsia: 0.2, tF: 104 })],
  ['a dehydration duty with no gas rate', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, gasMMscfd: 0 })],
  ['an outlet spec at or above the inlet', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 10, outletLbMMscf: 10 })],
  ['a lean glycol strength outside 90 to 100 weight percent', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 89 })],
  ['a lean glycol strength of exactly 100 weight percent', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 100 })],
  ['an amine the table does not carry', () => G.aminePackage({ ...UBIE, amineId: 'DIPA' })],
  ['a sweetening duty with no gas rate', () => G.aminePackage({ ...UBIE, gasMMscfd: 0 })],
  ['a lean loading at or above the rich', () => G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading })],
  ['a spec that leaves nothing to remove', () => G.aminePackage({ ...UBIE, ...UBIE_SPEC_ALREADY_MET })],
  ['a spec above the inlet', () => G.aminePackage({ ...UBIE, ...UBIE_SPEC_ABOVE_INLET })],
  ['a contactor with no gas rate', () => G.contactorDiameter({ gasMMscfd: 0, pPsia: 900, tF: 100, gasSg: 0.65 })],
  ['a contactor at no pressure', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 0, tF: 100, gasSg: 0.65 })],
  ['a contactor for a gas of no gravity', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 900, tF: 100, gasSg: 0 })],
  ['a contactor at a K value of zero', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 900, tF: 100, gasSg: 0.65, ksFtS: 0 })],
  ['a Kremser stage count for an impossible removal', () => G.kremserStagesFor({ absorptionFactor: A_WELL_UNDER_UNITY, fractionRemoved: UNREACHABLE_SPEC })],
  ['a Kremser stage count for a removal of one', () => G.kremserStagesFor({ absorptionFactor: 2, fractionRemoved: 1 })],
  ['a Joule-Thomson screen at no pressure', () => G.jouleThomsonFPerPsi({ pPsia: 0, tF: 100, gasSg: 0.65 })],
  ['a Joule-Thomson screen at no heat capacity', () => G.jouleThomsonFPerPsi({ pPsia: 900, tF: 100, gasSg: 0.65, cpBtuLbmolF: 0 })],
  ['a let-down to a pressure above the inlet', () => G.jtDrop({ p1Psia: 500, p2Psia: 600, tF: 100, gasSg: 0.65 })],
  ['a let-down to zero', () => G.jtDrop({ p1Psia: 500, p2Psia: 0, tF: 100, gasSg: 0.65 })],
  ['a march with a fractional step count', () => G.jtDrop({ ...AGBADA, steps: 0.4 })],
  ['a march with no steps at all', () => G.jtDrop({ ...AGBADA, steps: 0 })],
  ['a still colder than the absorber it dries glycol for', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, absorberTF: 380, reboilerTF: 100 })],
  ['a negative circulation ratio', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, circulationGalPerLb: -3 })],
  ['a BTEX absorbed fraction above one', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, btexAbsorbedFrac: 5 })],
  ['an amine solution stronger than pure amine', () => G.aminePackage({ ...UBIE, amineWtPct: 150 })],
  ['an amine solution of no strength', () => G.aminePackage({ ...UBIE, amineWtPct: 0 })],
  ['a negative regenerator duty', () => G.aminePackage({ ...UBIE, dutyBtuPerGal: -800 })],
  ['a gas temperature below absolute zero', () => G.jouleThomsonFPerPsi({ pPsia: 900, tF: -600, gasSg: 0.65 })],
  ['a gas gravity Sutton cannot carry', () => G.jouleThomsonFPerPsi({ pPsia: 900, tF: 100, gasSg: SG_SUTTON_BREAKS })],
  ['a compressibility above the correlation band', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 30000, tF: 100, gasSg: 0.65 })],
  ['a contactor liquid lighter than its gas', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 900, tF: 100, gasSg: 0.65, rhoLLbFt3: 0.5 })],
];

/** The calls that read the Kremser contract from both sides. */
export const KREMSER_CONTRACT_CALLS = [[0, 5], [-1, 5], [2, 0], [2, -3], [1.6, 6]];

/** The refusals that hand back evidence beside the message. */
export const EVIDENCE_PROBES = [
  ['the stage count a spec needs when the solvent caps it', () => G.kremserStagesFor({ absorptionFactor: A_WELL_UNDER_UNITY, fractionRemoved: UNREACHABLE_SPEC })],
  ['a march that walks off the correlation', () => G.jtDrop({ ...AGBADA, p2Psia: AGBADA_DEEP_P2_PSIA })],
  ['a compressibility off the correlation band', () => G.zAtState({ pPsia: 30000, tF: 100, gasSg: 0.65 })],
  ['a contactor whose liquid is lighter than its gas', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 900, tF: 100, gasSg: 0.65, rhoLLbFt3: 0.5 })],
];

/** Every guard read from both sides of its own limit. */
export const BOUNDARY_PROBES = [
  ['the lean glycol strength, lower edge', 90, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 90 })],
  ['the lean glycol strength, just inside', 90.000001, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 90.000001 })],
  ['the lean glycol strength, just under the top', 99.999999, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 99.999999 })],
  ['the lean glycol strength, upper edge', 100, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 100 })],
  ['the outlet spec equal to the inlet', 60, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, outletLbMMscf: 60 })],
  ['the outlet spec a hair under the inlet', 59.999999, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, outletLbMMscf: 59.999999 })],
  ['the water fit, lower edge', FIT_LOW_EDGE_F, () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_LOW_EDGE_F })],
  ['the water fit, below the lower edge', FIT_BELOW_LOW_EDGE_F, () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_BELOW_LOW_EDGE_F })],
  ['the water fit, upper edge', FIT_HIGH_EDGE_F, () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_HIGH_EDGE_F })],
  ['the water fit, above the upper edge', FIT_ABOVE_HIGH_EDGE_F, () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_ABOVE_HIGH_EDGE_F })],
  ['the lean loading raised to the rich, so the swing is exactly zero', UBIE.richLoading, () => G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading })],
  ['the lean loading a billionth below the rich, so the swing is barely positive', UBIE.richLoading - 1e-9, () => G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading - 1e-9 })],
  ['the let-down with the two pressures equal', 500, () => G.jtDrop({ p1Psia: 500, p2Psia: 500, tF: 100, gasSg: 0.65 })],
  ['the let-down a hair apart', 499.999999, () => G.jtDrop({ p1Psia: 500, p2Psia: 499.999999, tF: 100, gasSg: 0.65 })],
];

/** Section 15. What a refusal is, and what one always carries with it. */
export const refusalContract = () => ({
  refusals: REFUSAL_PROBES.map(probe),
  kremserContract: KREMSER_CONTRACT_CALLS.map(([absorptionFactor, stages]) => {
    const r = kFrac({ absorptionFactor, stages });
    return {
      absorptionFactor,
      stages,
      error: softOf(r),
      fractionRemoved: r.error ? null : r.fractionRemoved,
    };
  }),
  evidence: EVIDENCE_PROBES.map(([label, fn]) => {
    const r = fn();
    const keys = Object.keys(r).filter((k) => k !== 'error');
    return { label, fieldCount: keys.length, fields: keys };
  }),
  boundaries: BOUNDARY_PROBES.map(([guard, value, fn]) => ({
    guard, value, refused: Boolean(fn().error),
  })),
});

/** The marker every held quantity carries, so a panel and a lesson mark one
 *  the same way. */
export const HELD_MARKER = 'HELD FOR LITERATURE';

/**
 * WHAT THIS COURSE TEACHES AS A LIMIT AND NEVER AS AN ANSWER.
 *
 * Digest Section 16 carries SIX of these and then names TWO ABSENCES, which is
 * eight things in all and two different kinds of thing. The six are numbers the
 * module holds and nothing in this repository can check; the two are
 * capabilities the module does not have at all. They are kept apart here
 * because a held number can be shown beside its marker and an absent capability
 * cannot be shown at all. The held gate counts both and says which it counted.
 */
export const HELD_ITEMS = [
  {
    id: 'mcketta-real-gas-correction',
    section: 16,
    title: 'The real-gas departure of the saturated water content',
    note: `${HELD_MARKER}: the engine warns above its own chart threshold that the correction reaches tens of percent, and nothing in this package stands behind a figure for it. Taught as a limit and never as an answer, so every graded water content in this course sits below that threshold.`,
  },
  {
    id: 'water-overhead-btu-per-lb',
    section: 16,
    title: 'The water overhead the reboiler pays for',
    note: `${HELD_MARKER}: declared. It is an input with that default and no publication in this repository fixes it. Taught as a limit and never as an answer, so no graded Associate field reads a reboiler duty and the sensible half is what is graded.`,
  },
  {
    id: 'glycol-density',
    section: 16,
    title: 'The glycol density in lb a gallon',
    note: `${HELD_MARKER}: declared. It is the module's one glycol density and both the loop balance and the vessel sizing read it, so a reader always knows which number they are holding. Taught as a limit and never as an answer.`,
  },
  {
    id: 'water-density-amine-gallons',
    section: 16,
    title: 'The water density the amine gallons chain divides by',
    note: `${HELD_MARKER}: declared, and the module's own comment records that it sits above the measured density of water at the standard temperature because it is the figure the amine circulation charts are drawn with. Taught as a limit and never as an answer.`,
  },
  {
    id: 'amine-property-set',
    section: 16,
    title: 'The three amines property set',
    note: `${HELD_MARKER}: declared. The molecular weights are chemistry; the typical strengths, the rich limits, the duties and the solution gravities are customary practice with no source in this package. Taught as a limit and never as an answer, so no graded Professional field reads a contactor diameter, whose liquid is the wrong fluid for an amine.`,
  },
  {
    id: 'btex-fraction-and-mw',
    section: 16,
    title: 'The BTEX absorbed fraction and its single molecular weight',
    note: `${HELD_MARKER}: declared. The fraction is a chart or operating value the engine takes as an input, and the molecular weight is one compound standing for four. Taught as a limit and never as an answer, so both are stated on any capstone that grades a BTEX figure.`,
  },
];

/** The two things Section 16 names as ABSENT rather than held. */
export const ABSENT_CAPABILITIES = [
  {
    id: 'hydrate-boundary',
    section: 16,
    title: 'There is no hydrate boundary in this engine',
    note: 'A hydrate margin is the Production module Flow Assurance engine, which owns subcooling, the depression correlations and the inhibitor dose. Dehydration and a cold separator are the other two answers to the same question, and the seam between the three is a course boundary.',
  },
  {
    id: 'stage-efficiency',
    section: 16,
    title: 'There is no stage efficiency and no rate-based mass transfer',
    note: 'A theoretical stage is not a tray. Section 9 gives a stage count and Section 10 gives a circulation, and turning either into steel needs a vendor.',
  },
];

/** Section 16. What the method does not know. */
export const methodDoesNotKnow = () => ({
  chartWarningPsia: G.DECLARED_CONSTANTS.CHART_WARNING_PSIA,
  waterOverheadBtuPerLb: G.WATER_OVERHEAD_BTU_PER_LB,
  tegLbPerGal: G.TEG_LB_PER_GAL,
  waterLbPerGal: G.WATER_LB_PER_GAL,
  items: HELD_ITEMS.map((h) => ({ ...h })),
  absences: ABSENT_CAPABILITIES.map((a) => ({ ...a })),
  limitsTaughtNeverAnswered: HELD_ITEMS.length + ABSENT_CAPABILITIES.length,
});

/** Section 16, for a panel that only wants the marked list. */
export const heldItems = () => ({
  marker: HELD_MARKER,
  items: HELD_ITEMS.map((h) => ({ ...h })),
  absences: ABSENT_CAPABILITIES.map((a) => ({ ...a })),
  heldCount: HELD_ITEMS.length,
  absenceCount: ABSENT_CAPABILITIES.length,
  limitsTaughtNeverAnswered: HELD_ITEMS.length + ABSENT_CAPABILITIES.length,
});

/** Section 17. What a published case can and cannot catch. */
export const publishedCaseReach = () => {
  const liquids = contactorLiquids();
  const molarRows = [];
  GOLD.teg.forEach((row, i) => {
    const r = G.tegPackage(row);
    molarRows.push({
      label: `TEG case ${i + 1}, water a day`,
      ratioDerived: r.waterLbDay / row.waterLbDay,
      kind: 'a MASS balance, no molar volume in it',
      molar: false,
    });
    molarRows.push({
      label: `TEG case ${i + 1}, BTEX a day`,
      ratioDerived: r.btexLbDay / row.btexLbDay,
      kind: 'a MOLE balance, the molar volume is in it',
      molar: true,
    });
  });
  ['MDEA', 'DEA', 'MEA'].forEach((amineId, i) => {
    const row = GOLD.amine[i];
    molarRows.push({
      label: `amine case ${i + 1}, circulation`,
      ratioDerived: G.aminePackage({ ...row, amineId }).circGpm / row.circGpm,
      kind: 'a MOLE balance end to end',
      molar: true,
    });
  });
  GOLD.contactor.forEach((row, i) => {
    const r = i < 3
      ? G.contactorDiameter({ ...row, rhoLLbFt3: liquids[i] })
      : G.contactorDiameter({
        gasMMscfd: row.gasMMscfd, pPsia: row.pPsia, tF: row.tF, gasSg: row.gasSg, ksFtS: row.ksFtS,
      });
    molarRows.push({
      label: `contactor case ${i + 1}, gas density`,
      ratioDerived: r.rhoG / row.rhoG,
      kind: 'the gas law, which carries the gas constant',
      molar: true,
    });
  });
  const molar = molarRows.filter((x) => x.molar).map((x) => x.ratioDerived);
  const mass = molarRows.filter((x) => !x.molar).map((x) => x.ratioDerived);
  return {
    waterCaseCount: GOLD.water.length,
    kremserCaseCount: GOLD.kremser.length,
    waterWorstDerived: Math.max(...GOLD.water.map((row) => Math.abs(
      G.saturatedWaterContent(row).lbPerMMscf / row.lbPerMMscf - 1,
    ))),
    kremserWorstDerived: Math.max(...GOLD.kremser.map((row) => Math.abs(
      kNum(row) / row.fractionRemoved - 1,
    ))),
    molarRows,
    molarSpreadDerived: Math.max(...molar) - Math.min(...molar),
    massWorstDerived: Math.max(...mass.map((v) => Math.abs(v - 1))),
    signatureDerived: molar[0],
  };
};

/**
 * THE RULE Section 20 counts the engine's own history comment lines with. A
 * comment line carrying "used to", "no longer" or the repair's own name is
 * provenance about what the engine USED TO DO. The rule lives here so the
 * digest, the test and any reader count the same thing; the WALK over the
 * vendored tree is the test's, because a browser module cannot read a
 * directory.
 */
export const HISTORY_COMMENT_RE = /^\s*(\*|\/\/).*(used to|no longer|until FC4-0)/;

/** How many history comment lines a source text carries, by that rule. */
export const countHistoryComments = (text) => text.split('\n')
  .filter((l) => HISTORY_COMMENT_RE.test(l)).length;

/**
 * Section 20. FRAMED HISTORY, and the only reader in this lab whose subject is
 * what the engine USED TO DO. The figures it returns are the REPAIRED engine's
 * compressibilities and their reciprocals, printed so the shape of the former
 * error can be read off numbers that are current. Nothing else in this lab is
 * history.
 */
export const repairHistory = () => ({
  shapeRows: [20, 600, 1000, 2500].map((pPsia) => {
    const r = G.jouleThomsonFPerPsi({ pPsia, tF: 100, gasSg: 0.65 });
    return { pPsia, z: r.z, oneOverZDerived: 1 / r.z };
  }),
  rule: HISTORY_COMMENT_RE.source,
});

/** Section 18. The Associate reading, one stream from the line to the still. */
export const associateReading = () => {
  const sat = obSat();
  const ob = obPack();
  return {
    inletLbMMscf: sat.lbPerMMscf,
    yWater: sat.yWater,
    removedLbMMscfDerived: sat.lbPerMMscf - OBIAFU.outletLbMMscf,
    waterLbDay: ob.waterLbDay,
    circGpd: ob.circGpd,
    circGpm: ob.circGpm,
    sensiblePerGal: ob.sensiblePerGal,
    vaporPerGal: ob.vaporPerGal,
    dutyBtuPerGal: ob.dutyBtuPerGal,
    reboilerMMBtuHr: ob.reboilerMMBtuHr,
    diameterFt: obCont().diameterFt,
    btexTonsYear: ob.btexTonsYear,
  };
};

/** Section 19. The Professional reading, one sour stream through two columns. */
export const professionalReading = () => {
  const ub = ubPack();
  const cont = ubCont();
  return {
    acidMolesDay: ub.acidMolesDay,
    richLoadingUsed: ub.richLoadingUsed,
    swingDerived: ub.richLoadingUsed - UBIE.leanLoading,
    circGpm: ub.circGpm,
    reboilerMMBtuHr: ub.reboilerMMBtuHr,
    removalAtStages: kNum({ absorptionFactor: OBIAFU_ABSORPTION_FACTOR, stages: OBIAFU_STAGES }),
    stagesForNinetyNine: G.kremserStagesFor({
      absorptionFactor: OBIAFU_ABSORPTION_FACTOR, fractionRemoved: 0.99,
    }).stages,
    diameterFt: cont.diameterFt,
    rhoG: cont.rhoG,
    vAllowFtS: cont.vAllowFtS,
  };
};

// ---------------------------------------------------------------------------
// THE CAPSTONE. IKOT ABASI, OTUMARA AND ESCRAVOS ONLY.
//
// Everything below this line is the graded surface. No panel and no course page
// may read any of it: panelCapstoneGuard.test.js greps every panel source and
// the course page for these names. The capstone streams share no rate,
// pressure, temperature, gravity, spec, ratio, strength, loading or duty with
// the teaching fields above.
//
// Copied VERBATIM from /root/fc-wip-gasprocessing/fc4_fields_capstone.mjs.
// ---------------------------------------------------------------------------

export const IKOT_ABASI_LINE = { pPsia: 880, tF: 109 };

export const IKOT_ABASI = {
  gasMMscfd: 47,
  outletLbMMscf: 5,
  circulationGalPerLb: 3.6,
  leanTegWtPct: 99.4,
  absorberTF: 109,
  reboilerTF: 368,
  refluxRatio: 0.22,
  btexInletPpmv: 155,
  btexAbsorbedFrac: 0.12,
  btexMw: 92,
  cpTegBtuLbF: 0.55,
  tegLbPerGal: 9.3,
};

export const OTUMARA_ABSORBER = { absorptionFactor: 1.85, stages: 5 };
export const OTUMARA_REQUIRED_REMOVAL = 0.94;

export const OTUMARA = {
  gasMMscfd: 71,
  co2MolPct: 6.4,
  h2sMolPct: 0.78,
  co2SpecMolPct: 2.5,
  h2sSpecMolPct: 0.0004,
  amineId: 'DEA',
  amineWtPct: 33,
  leanLoading: 0.07,
  richLoading: 0.38,
  dutyBtuPerGal: 920,
};

export const OTUMARA_RETUNED_LEAN_LOADING = 0.03;

export const ESCRAVOS = {
  p1Psia: 935, p2Psia: 405, tF: 87, gasSg: 0.67, cpBtuLbmolF: 10.2,
};

/** The graded fields MEASURED to be bit-identical across the FC4-0 vendoring,
 *  as fc4_capstone.mjs declares them and gate_movement.mjs re-measures them. */
export const CAPSTONE_STABLE = [
  'beginner/sensiblePerGal',
  'intermediate/fractionRemoved',
  'intermediate/stagesNeeded',
  'advanced/dzdT',
];

/** The capstone chain, engine call for engine call as fc4_capstone.mjs runs it. */
export const capstoneRuns = () => {
  const ikSat = G.saturatedWaterContent(IKOT_ABASI_LINE);
  const ikPack = G.tegPackage({ ...IKOT_ABASI, inletLbMMscf: ikSat.lbPerMMscf });
  const otFrac = G.kremserFractionRemoved(OTUMARA_ABSORBER);
  const otStages = G.kremserStagesFor({
    absorptionFactor: OTUMARA_ABSORBER.absorptionFactor,
    fractionRemoved: OTUMARA_REQUIRED_REMOVAL,
  });
  const otAmine = G.aminePackage(OTUMARA);
  const otRetuned = G.aminePackage({ ...OTUMARA, leanLoading: OTUMARA_RETUNED_LEAN_LOADING });
  const esMu = G.jouleThomsonFPerPsi({
    pPsia: ESCRAVOS.p1Psia, tF: ESCRAVOS.tF,
    gasSg: ESCRAVOS.gasSg, cpBtuLbmolF: ESCRAVOS.cpBtuLbmolF,
  });
  const esDrop = G.jtDrop(ESCRAVOS);
  const esWaterIn = G.saturatedWaterContent({ pPsia: ESCRAVOS.p1Psia, tF: ESCRAVOS.tF });
  const esWaterOut = G.saturatedWaterContent({ pPsia: ESCRAVOS.p2Psia, tF: esDrop.t2F });
  return {
    ikSat, ikPack, otFrac, otStages, otAmine, otRetuned, esMu, esDrop, esWaterIn, esWaterOut,
  };
};

/** The eighteen graded fields, six a tier, in the published order. */
export const capstoneFields = () => {
  const r = capstoneRuns();
  return [
    ['beginner', 'inletLbMMscf', r.ikSat.lbPerMMscf, 0.0001],
    ['beginner', 'waterLbDay', r.ikPack.waterLbDay, 0.01],
    ['beginner', 'circGpm', r.ikPack.circGpm, 0.00001],
    ['beginner', 'circGpd', r.ikPack.circGpd, 0.01],
    ['beginner', 'sensiblePerGal', r.ikPack.sensiblePerGal, 0.0001],
    ['beginner', 'btexTonsYear', r.ikPack.btexTonsYear, 0.00001],
    ['intermediate', 'fractionRemoved', r.otFrac.fractionRemoved, 1e-9],
    ['intermediate', 'stagesNeeded', r.otStages.stages, 0.000001],
    ['intermediate', 'acidMolesDay', r.otAmine.acidMolesDay, 0.01],
    ['intermediate', 'circGpm', r.otAmine.circGpm, 0.00001],
    ['intermediate', 'reboilerMMBtuHr', r.otAmine.reboilerMMBtuHr, 0.00001],
    ['intermediate', 'circGpmRetuned', r.otRetuned.circGpm, 0.00001],
    ['advanced', 'dzdT', r.esMu.dzdT, 1e-12],
    ['advanced', 'muFPerPsi', r.esMu.muFPerPsi, 1e-9],
    ['advanced', 'dropF', r.esDrop.dropF, 0.0001],
    ['advanced', 't2F', r.esDrop.t2F, 0.0001],
    ['advanced', 'waterInLbMMscf', r.esWaterIn.lbPerMMscf, 0.0001],
    ['advanced', 'waterOutLbMMscf', r.esWaterOut.lbPerMMscf, 0.0001],
  ];
};

export const capstoneValues = (fieldList) => Object.fromEntries(
  (fieldList || capstoneFields()).map(([, k, v]) => [k, v]),
);

export const capstoneTolerances = (fieldList) => Object.fromEntries(
  (fieldList || capstoneFields()).map(([, k, , t]) => [k, t]),
);

/** Every capstone-only export, by name. The panel guard greps for these. */
export const CAPSTONE_ONLY_EXPORTS = [
  'IKOT_ABASI_LINE', 'IKOT_ABASI',
  'OTUMARA_ABSORBER', 'OTUMARA_REQUIRED_REMOVAL', 'OTUMARA', 'OTUMARA_RETUNED_LEAN_LOADING',
  'ESCRAVOS',
  'CAPSTONE_STABLE', 'capstoneRuns', 'capstoneFields', 'capstoneValues', 'capstoneTolerances',
  'CAPSTONE_ONLY_EXPORTS',
];

// ---------------------------------------------------------------------------
// The leak guard machinery, the EC3 course's, unchanged.
// ---------------------------------------------------------------------------

/** How much wider than the grader's own band a teaching number has to stand clear. */
export const LEAK_GUARD_MARGIN = 10;

/** The unit shifts a number can be restated under and still be the same answer. */
export const LEAK_GUARD_SCALINGS = [
  { factor: 1, tag: 'as graded' },
  { factor: 1000, tag: 'x1000' },
  { factor: 0.001, tag: 'x0.001' },
];

/**
 * Every forbidden neighbourhood: eighteen answers, three shiftings, ten times
 * the grading band, the band SCALED with the shifting because the grader's
 * tolerance is absolute in the field's own units.
 */
export const leakGuardTargets = (fieldList) => {
  const out = [];
  fieldList.forEach(([tier, key, v, tol]) => {
    LEAK_GUARD_SCALINGS.forEach(({ factor, tag }) => {
      const gradingBand = tol * Math.abs(factor);
      out.push({
        tier, key, tag, value: v * factor, gradingBand, band: LEAK_GUARD_MARGIN * gradingBand,
      });
    });
  });
  return out;
};

/** The target a number collides with, or null. Dimension blind: a box takes any number. */
export const leakGuardHit = (v, targets) => {
  if (!Number.isFinite(v)) return null;
  for (const t of targets) {
    if (Math.abs(v - t.value) < t.band) return t;
  }
  return null;
};

/** Every finite number reachable inside a value, with the path it sits at. */
export const collectNumbers = (v, keyPath = '', out = [], depth = 0) => {
  if (depth > 12) return out;
  if (typeof v === 'number') {
    if (Number.isFinite(v)) out.push({ path: keyPath, value: v });
    return out;
  }
  if (Array.isArray(v)) {
    v.forEach((x, i) => collectNumbers(x, `${keyPath}[${i}]`, out, depth + 1));
    return out;
  }
  if (v && typeof v === 'object') {
    Object.entries(v).forEach(([k, x]) => collectNumbers(x, keyPath ? `${keyPath}.${k}` : k, out, depth + 1));
  }
  return out;
};
