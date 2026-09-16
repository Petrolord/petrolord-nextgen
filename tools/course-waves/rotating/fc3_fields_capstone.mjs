// THE FC3 CAPSTONE CONDITIONS. The ESCRAVOS transfer pump, the BONGA
// booster station and the BONNY gas booster train.
//
// Nothing here is imported by fc3_dump.mjs, and no curve point, flow, head,
// pressure, temperature, gravity, viscosity, efficiency, ratio, speed or heat
// rate is shared with the teaching fields in fc3_fields.mjs. Only the
// migration headers and the go-live may read the values this produces.
//
// NO GRADED FIELD DEPENDS ON A HELD-FOR-LITERATURE ITEM, and each held item is
// neutralised by CONSTRUCTION rather than by hope:
//
//  * the HYDRAULIC INSTITUTE viscosity correction is an unsourced empirical
//    form, so no capstone calls viscosityCorrection and no graded field is a
//    corrected flow, head or efficiency. Every capstone fluid is stated at its
//    own specific gravity and no kinematic viscosity appears below;
//  * the TRIM SHORTFALL model has no publication behind it, so the
//    Professional capstone grades a SPEED change, where the affinity laws are
//    exact for a geometrically similar machine, and never a trim;
//  * the OPERATING REGION bands (50, 70, 120, 140 percent) are customary and
//    unsourced, so no graded field is a region, a percentage of best
//    efficiency flow or a preferred flag, and no BEP flow is even stated;
//  * the NPSH MARGIN RULE (the larger of 3 ft and 35 percent of required) is
//    customary and unsourced, so the Professional capstone grades NPSH
//    AVAILABLE and never the required margin, the pass flag or the severity.
//    No NPSHr is stated below;
//  * the MACHINE SCREENING thresholds are unsourced, so machineScreen is not
//    called and no graded field is a recommendation;
//  * the compressor states are chosen INSIDE the DAK validity window and the
//    generator ASSERTS that rather than assuming it, because compression.js
//    does not check it;
//  * every discriminating condition (the maximum ratio per stage, the maximum
//    discharge temperature, the intercooling approach, the motor and
//    mechanical efficiencies, the driver heat rate and heating value) is
//    STATED, so no graded value rides on a default.

/* ------------------------------------------------------------------ *
 * Associate. The ESCRAVOS crude transfer pump, P-1401, lifting to the
 * tank farm against a stated station.
 * ------------------------------------------------------------------ */

/** Four points read off the vendor's published curve. */
export const ESCRAVOS_POINTS = [
  { qGpm: 0, headFt: 486 },
  { qGpm: 700, headFt: 452 },
  { qGpm: 1400, headFt: 358 },
  { qGpm: 2000, headFt: 214 },
];

/** The station, stated as a friction head at a flow, which is the form a
 *  hydraulics calculation hands over. */
export const ESCRAVOS_SYSTEM = {
  staticHeadFt: 168,
  frictionHeadFt: 214,
  atFlowGpm: 1250,
};

export const ESCRAVOS_SG = 0.823;
/** The efficiency at duty, agreed with the vendor for this selection. */
export const ESCRAVOS_EFFICIENCY = 0.761;
/** The motor's nameplate efficiency, stated rather than defaulted. */
export const ESCRAVOS_MOTOR_EFFICIENCY = 0.938;

/* ------------------------------------------------------------------ *
 * Professional. The BONGA booster station, P-2203: its suction side, a
 * proposed speed change, and a second identical machine.
 * ------------------------------------------------------------------ */

export const BONGA_POINTS = [
  { qGpm: 0, headFt: 212 },
  { qGpm: 450, headFt: 198 },
  { qGpm: 900, headFt: 160 },
  { qGpm: 1300, headFt: 96 },
];

export const BONGA_SYSTEM = {
  staticHeadFt: 44,
  frictionHeadFt: 88,
  atFlowGpm: 800,
};

export const BONGA_SG = 0.79;

/** The suction side as surveyed. The source vessel sits above the pump, so
 *  the static term is positive. */
export const BONGA_SUCTION = {
  suctionPressurePsia: 19.4,
  vapourPressurePsia: 3.7,
  sg: BONGA_SG,
  staticSuctionLiftFt: 11.5,
  suctionFrictionFt: 4.3,
};

/** The proposal on the table: pad the suction drum to this pressure. */
export const BONGA_RAISED_SUCTION_PSIA = 46.0;

/** The variable speed drive's proposed setting, as a fraction of rated. */
export const BONGA_SPEED_RATIO = 0.87;

/** How many identical machines the debottleneck would put in parallel. */
export const BONGA_N_PARALLEL = 2;

/** The search ceiling handed to the duty solve, stated so the answer does
 *  not depend on a default. */
export const BONGA_Q_MAX_GPM = 6000;
export const ESCRAVOS_Q_MAX_GPM = 8000;

/* ------------------------------------------------------------------ *
 * Expert. The BONNY gas booster train, K-3101.
 * ------------------------------------------------------------------ */

export const BONNY = {
  qMMscfd: 34.0,
  pSuctionPsia: 138.0,
  tSuctionF: 96.0,
  pDischargePsia: 1240.0,
  gasSg: 0.673,
  k: 1.272,
  polytropicEfficiency: 0.767,
  mechanicalEfficiency: 0.972,
  maxRatioPerStage: 3.8,
  maxDischargeF: 285.0,
  /** Cooled back TO THE SUCTION TEMPERATURE. Stated deliberately: the
   *  staging calculation is made at the suction temperature, so an
   *  intercooler approach above it would leave later stages running hotter
   *  than the stage count was chosen for (FINDINGS C5). Setting the approach
   *  equal to the suction temperature makes the staging assumption exact and
   *  keeps every graded value clear of that defect. The capstone generator
   *  ASSERTS that no stage exceeds maxDischargeF rather than assuming it. */
  interstageCoolToF: 96.0,
  cpBtuLbF: 0.552,
};

/** The driver, stated. */
export const BONNY_HEAT_RATE_BTU_HP_HR = 7650;
export const BONNY_LHV_BTU_SCF = 968;
