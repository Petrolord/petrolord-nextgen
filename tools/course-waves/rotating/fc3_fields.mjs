// THE FC3 TEACHING FIELDS. The OKONO injection pump and the SOKU gas
// booster train, plus every sweep and boundary probe the digest reads.
//
// NOTHING HERE IS SHARED WITH THE CAPSTONE. No curve point, flow, head,
// pressure, temperature, gravity, efficiency, ratio, speed or heat rate below
// appears in fc3_fields_capstone.mjs, and fc3_dump.mjs never imports that
// file. The ESCRAVOS, BONGA and BONNY names are spelled nowhere in this file
// or in the dump.

/* ------------------------------------------------------------------ *
 * The Associate stream: OKONO P-1201, a produced-water injection pump.
 * Brine, so the specific gravity is above 1 and the pressure a given head
 * makes is higher than a crude line would give.
 * ------------------------------------------------------------------ */

export const OKONO_POINTS = [
  { qGpm: 0, headFt: 540 },
  { qGpm: 600, headFt: 512 },
  { qGpm: 1200, headFt: 424 },
  { qGpm: 1900, headFt: 250 },
];

export const OKONO_SYSTEM = {
  staticHeadFt: 210,
  frictionHeadFt: 165,
  atFlowGpm: 1100,
};

export const OKONO_SG = 1.04;
export const OKONO_EFFICIENCY = 0.74;
export const OKONO_MOTOR_EFFICIENCY = 0.92;
export const OKONO_Q_MAX_GPM = 7500;
export const OKONO_BEP_GPM = 1150;

/** A second system on the same pump: friction dominated, which is where
 *  the parallel result the module exists to show actually bites. */
export const OKONO_FRICTION_SYSTEM = {
  staticHeadFt: 60,
  frictionHeadFt: 380,
  atFlowGpm: 1100,
};

/** And a system the pump cannot start at all. */
export const OKONO_TOO_HIGH_SYSTEM = {
  staticHeadFt: 700,
  frictionHeadFt: 80,
  atFlowGpm: 900,
};

/** Points that rise with flow, which is not a centrifugal head curve. */
export const NOT_A_PUMP_CURVE = [
  { qGpm: 0, headFt: 120 },
  { qGpm: 450, headFt: 176 },
  { qGpm: 950, headFt: 288 },
];

/** Three identical heads: a fit that explains nothing and says R squared 1. */
export const FLAT_CURVE = [
  { qGpm: 0, headFt: 140 },
  { qGpm: 500, headFt: 140 },
  { qGpm: 1000, headFt: 140 },
];

/* The suction side of the same pump. */
export const OKONO_SUCTION = {
  suctionPressurePsia: 24.5,
  vapourPressurePsia: 0.95,
  sg: OKONO_SG,
  staticSuctionLiftFt: 6.0,
  suctionFrictionFt: 5.5,
};

/** The vendor's required NPSH for this selection, stated. The MARGIN RULE
 *  the check applies to it is HELD FOR LITERATURE. */
export const OKONO_NPSHR_FT = 16.0;

/** A suction sweep that walks the three severities: the pressure over the
 *  liquid, in psia, everything else held. */
export const OKONO_SUCTION_SWEEP_PSIA = [14.7, 18.0, 21.0, 24.5, 30.0, 40.0, 60.0];

/** A suction already at its vapour pressure, which the engine flags. */
export const FLASHING_SUCTION = {
  suctionPressurePsia: 6.2,
  vapourPressurePsia: 6.2,
  sg: 0.71,
  staticSuctionLiftFt: 28.0,
  suctionFrictionFt: 3.0,
};

/** And one already BELOW it whose static column still makes the available
 *  head positive, which is the case the warning exists for. */
export const FLASHING_SUCTION_BELOW = {
  suctionPressurePsia: 4.4,
  vapourPressurePsia: 6.2,
  sg: 0.71,
  staticSuctionLiftFt: 28.0,
  suctionFrictionFt: 3.0,
};

/* Changes. */
export const OKONO_SPEED_SWEEP = [0.70, 0.80, 0.90, 1.00, 1.10];
export const OKONO_TRIM_SWEEP = [1.00, 0.98, 0.95, 0.92, 0.88, 0.84, 0.80, 0.76, 0.70];
/** The two boundaries the trim rule turns on, each with the value either
 *  side of it, because a guard that misses its own limit is a finding. */
export const TRIM_AT_SHORTFALL_START = 0.95;
export const TRIM_JUST_INSIDE_SHORTFALL = 0.9499;
export const TRIM_AT_WARNING = 0.80;
export const TRIM_JUST_PAST_WARNING = 0.7999;
/** Where the 0.12 shortfall cap is reached, and past it. */
export const TRIM_AT_CAP = 0.75;
export const TRIM_PAST_CAP = 0.55;

export const OKONO_PARALLEL_COUNTS = [1, 2, 3, 4];
export const OKONO_SERIES_COUNTS = [1, 2, 3];

/* Where the duty lands. The four bands and both sides of every boundary. */
export const REGION_FRACTIONS = [
  0.30, 0.499, 0.50, 0.60, 0.699, 0.70, 0.85, 1.00, 1.15,
  1.20, 1.201, 1.30, 1.40, 1.401, 1.60,
];

/* The Hydraulic Institute correction. HELD FOR LITERATURE. */
export const OKONO_VISC_SWEEP_CST = [1, 5, 20, 60, 100, 320, 850, 2400, 9000];
export const OKONO_BEP_HEAD_FT = 430;
export const OKONO_SPEED_RPM = 1780;
/** The two thresholds the correction's warnings turn on. */
export const VISC_B_WARNING = 40;
export const VISC_CETA_WARNING = 0.6;

/* ------------------------------------------------------------------ *
 * The Professional and Expert stream: SOKU K-2101, a gas booster train.
 * ------------------------------------------------------------------ */

export const SOKU = {
  qMMscfd: 26.0,
  pSuctionPsia: 92.0,
  tSuctionF: 104.0,
  pDischargePsia: 985.0,
  gasSg: 0.648,
  k: 1.285,
  polytropicEfficiency: 0.755,
  mechanicalEfficiency: 0.968,
  maxRatioPerStage: 4.0,
  maxDischargeF: 300.0,
  interstageCoolToF: 110.0,
  cpBtuLbF: 0.55,
};

export const SOKU_HEAT_RATE_BTU_HP_HR = 8100;
export const SOKU_LHV_BTU_SCF = 985;

/** Discharge pressures for the sweep the studio's third tab draws: power
 *  climbing smoothly while the stage count climbs in steps. */
export const SOKU_DISCHARGE_SWEEP_PSIA = [300, 450, 600, 800, 985, 1200, 1500, 1900, 2400];

/** The intercooler approach swept across the suction temperature, which is
 *  where the staging assumption stops holding. */
export const SOKU_COOL_TO_SWEEP_F = [90, 100, 104, 110, 130, 150, 180];

/** The case that breaks the stated limit outright, with its own limit so
 *  the overshoot is against a number the caller chose. */
export const SOKU_HOT = {
  qMMscfd: 26.0,
  pSuctionPsia: 92.0,
  tSuctionF: 104.0,
  pDischargePsia: 420.0,
  gasSg: 0.648,
  k: 1.285,
  polytropicEfficiency: 0.755,
  mechanicalEfficiency: 0.968,
  maxRatioPerStage: 4.0,
  maxDischargeF: 230.0,
  interstageCoolToF: 165.0,
  cpBtuLbF: 0.55,
};

/** A single stage, read on its own so the head, the temperature and the two
 *  idealisations can be laid out before the train chains them. */
export const SOKU_STAGE = {
  qMMscfd: 26.0,
  pSuctionPsia: 92.0,
  tSuctionF: 104.0,
  ratio: 3.2,
  gasSg: 0.648,
  k: 1.285,
  polytropicEfficiency: 0.755,
  mechanicalEfficiency: 0.968,
};

/** The polytropic efficiency swept, because the exponent carries it and the
 *  discharge temperature is where a learner first sees that. */
export const SOKU_ETA_SWEEP = [0.65, 0.70, 0.75, 0.78, 0.82, 0.86];
/** And k swept, because a richer gas takes more ratio per stage. */
export const SOKU_K_SWEEP = [1.20, 1.24, 1.28, 1.32, 1.40];
/** Ratios, for the head and the temperature against ratio. */
export const SOKU_RATIO_SWEEP = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5];

/** Duties for the machine screen, chosen to land in all four branches.
 *  The THRESHOLDS are HELD FOR LITERATURE; the branches are the engine's. */
export const SCREEN_DUTIES = [
  { label: 'a small high-pressure gathering duty', qMMscfd: 0.6, pSuctionPsia: 420, tSuctionF: 96, gasSg: 0.66, overallRatio: 3.0, totalBrakeHp: 180 },
  { label: 'a large low-pressure gathering duty', qMMscfd: 380, pSuctionPsia: 95, tSuctionF: 96, gasSg: 0.66, overallRatio: 2.6, totalBrakeHp: 14500 },
  { label: 'a deep booster at high ratio', qMMscfd: 14, pSuctionPsia: 75, tSuctionF: 96, gasSg: 0.66, overallRatio: 11.5, totalBrakeHp: 2100 },
  // The fourth branch is the one an earlier draft of this file MISSED: it
  // asked for 'either' with an overall ratio of 10.7 at 3090 acfm, which is
  // the reciprocating branch, and the digest then claimed four branches on a
  // set that reached two. A duty reaches 'either' only by failing all three
  // of the tests above it: 500 acfm or more, not a large volume at a modest
  // ratio, and not a high ratio at a small volume.
  { label: 'the duty where both machines are viable', qMMscfd: 67, pSuctionPsia: 92, tSuctionF: 104, gasSg: 0.648, overallRatio: 3.0, totalBrakeHp: 5000 },
];

/** A duty NO stage count can cool, for real: the discharge limit is above
 *  the suction temperature, so the early guards let it through, and twelve
 *  equal stages still cannot get under it. This is the case the twelve-stage
 *  cap was written for, and the only one that still reaches it. */
export const STAGE_CAP_DUTY = {
  pSuctionPsia: 100, pDischargePsia: 100000, tSuctionF: 100,
  k: 1.4, polytropicEfficiency: 0.5, maxDischargeF: 110,
};

/** Inlet-volume conditions, to show the volume falling with pressure. */
export const ACFM_PRESSURE_SWEEP_PSIA = [30, 60, 92, 150, 300, 600, 1200];

/** Driver heat rates, to show the fuel and the thermal efficiency move. */
export const DRIVER_HEAT_RATE_SWEEP = [6200, 7000, 7600, 8100, 9200, 11000];

/* ------------------------------------------------------------------ *
 * The domain probes. Each one is a state this module ACCEPTS and another
 * module in the same package refuses, or a boundary the digest reports.
 * ------------------------------------------------------------------ */

/** Below the DAK temperature floor. separatorSizing.js refuses this state
 *  by name; compression.js answers. */
export const DAK_COLD_PROBE = {
  qMMscfd: 20, pSuctionPsia: 1000, tSuctionF: -150, ratio: 2,
  gasSg: 0.65, k: 1.28,
};
/** Above the DAK pressure limit. Same two behaviours. */
export const DAK_HIGH_P_PROBE = {
  qMMscfd: 20, pSuctionPsia: 24000, tSuctionF: 100, ratio: 1.5,
  gasSg: 0.65, k: 1.28,
};
/** Inside the window, as a control, so the two above are a contrast and
 *  not just two numbers. */
export const DAK_IN_WINDOW_PROBE = {
  qMMscfd: 20, pSuctionPsia: 600, tSuctionF: 100, ratio: 2,
  gasSg: 0.65, k: 1.28,
};

/** Inputs the engines accept and should not. Each is a FINDINGS entry and
 *  each is printed with the whole return, so the SHAPE is on the page and
 *  not only the number. */
export const UNGUARDED_PUMP_PROBES = [
  ['a motor efficiency above one', 'pumpPower', { qGpm: 1500, headFt: 300, sg: 0.85, efficiency: 0.78, motorEfficiency: 5 }],
  ['a negative motor efficiency', 'pumpPower', { qGpm: 1500, headFt: 300, sg: 0.85, efficiency: 0.78, motorEfficiency: -0.5 }],
  ['a motor efficiency of zero', 'pumpPower', { qGpm: 1500, headFt: 300, sg: 0.85, efficiency: 0.78, motorEfficiency: 0 }],
  ['a speed ratio of one hundred', 'speedChange', { qGpm: 1000, headFt: 300, brakeHp: 100, speedRatio: 100 }],
  ['a speed change with no duty to change', 'speedChange', { speedRatio: 0.8 }],
  ['a trim with no duty to trim', 'impellerTrim', { diameterRatio: 0.8 }],
  ['a viscosity correction at zero speed', 'viscosityCorrection', { qBepGpm: 1500, headBepFt: 300, viscosityCSt: 100, speedRpm: 0 }],
  ['a viscosity correction at a negative speed', 'viscosityCorrection', { qBepGpm: 1500, headBepFt: 300, viscosityCSt: 100, speedRpm: -3560 }],
  ['a head to pressure conversion at zero gravity', 'psiToHeadFt', { psi: 100, sg: 0 }],
  ['two and a half pumps in parallel', 'combineParallelCount', { n: 2.5 }],
];

export const UNGUARDED_NPSH_PROBES = [
  ['an available head that is not a number', { npshrFt: 12 }],
  ['an available head of infinity', { npshaFt: Infinity, npshrFt: 12 }],
  ['an available head below required', { npshaFt: 8, npshrFt: 12 }],
  ['an available head inside the customary margin', { npshaFt: 14, npshrFt: 12 }],
  ['an available head clear of it', { npshaFt: 25, npshrFt: 12 }],
];

export const UNGUARDED_COMPRESSION_PROBES = [
  ['a per-stage ratio limit of one', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxRatioPerStage: 1 }],
  ['a negative per-stage ratio limit', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxRatioPerStage: -4 }],
  ['a polytropic efficiency of zero', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, polytropicEfficiency: 0 }],
  ['a polytropic efficiency above one', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, polytropicEfficiency: 1.5 }],
  ['a suction below absolute zero', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: -600, k: 1.28 }],
  ['a discharge limit below the suction temperature', 'stageCount', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxDischargeF: -100 }],
  ['a stage at zero polytropic efficiency', 'compressionStage', { qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, ratio: 3.16, gasSg: 0.65, k: 1.28, polytropicEfficiency: 0 }],
  ['a stage at zero mechanical efficiency', 'compressionStage', { qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, ratio: 3.16, gasSg: 0.65, k: 1.28, mechanicalEfficiency: 0 }],
  ['an inlet volume at zero rate', 'actualInletCfm', { qMMscfd: 0, pPsia: 200, tF: 100, gasSg: 0.65 }],
  ['an inlet volume below absolute zero', 'actualInletCfm', { qMMscfd: 20, pPsia: 200, tF: -600, gasSg: 0.65 }],
  ['a machine screened on that volume', 'machineScreen', { qMMscfd: 20, pSuctionPsia: 200, tSuctionF: -600, gasSg: 0.65, overallRatio: 3, totalBrakeHp: 500 }],
  ['a driver more efficient than thermodynamics allows', 'driverFuel', { brakeHp: 1000, heatRateBtuHpHr: 2000, gasLhvBtuScf: 950 }],
  ['a driver a thousand times more efficient than that', 'driverFuel', { brakeHp: 1000, heatRateBtuHpHr: 1, gasLhvBtuScf: 950 }],
];

/** The rational (k, polytropic efficiency) pairs the identity is shown on.
 *  e times eta is exactly (k - 1) / k, so the two power routes are one
 *  expression. Printed as a computed difference, never asserted in prose. */
export const IDENTITY_PAIRS = [
  { k: 1.28, polytropicEfficiency: 0.75 },
  { k: 1.26, polytropicEfficiency: 0.78 },
  { k: 1.30, polytropicEfficiency: 0.72 },
  { k: 1.40, polytropicEfficiency: 0.82 },
];
