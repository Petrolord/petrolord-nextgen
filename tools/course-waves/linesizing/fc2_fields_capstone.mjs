// THE FC2 CAPSTONE CONDITIONS. The IMO-1 transfer line, the BRASS trunk
// and the QUA IBOE export line.
//
// Nothing here is imported by fc2_dump.mjs, and no bore, rate, length,
// pressure, density, viscosity, roughness, wall, holdup or speed is shared
// with the teaching fields in fc2_fields.mjs. Only the migration headers and
// the go-live may read the values this produces.
//
// NO GRADED FIELD DEPENDS ON A HELD-FOR-LITERATURE ITEM, and each one is
// neutralised by being STATED as a condition of the tier rather than looked
// up:
//   * the API RP 14E c factor is held, so IMO-1 is quoted its OWN site c
//     factor of 120, which is not one of the three published rows, and the
//     engine is called with that number;
//   * the transmission-form efficiency E is an unsourced multiplier and is
//     held, so BRASS states E = 0.92 as a condition;
//   * the transition band from Re 2100 to 4000 is held, so IMO-1 is
//     turbulent by construction (its Reynolds number is above 20000);
//   * no graded value reads the pipe schedule, the roughness table, the
//     fitting K table or the RP 14E rows: every bore, roughness and
//     resistance sum is given directly.

/* ------------------------------------------------------------------ *
 * Associate. IMO-1, a crude transfer line from the flow station to the
 * tank farm. Dead liquid downstream of separation.
 * ------------------------------------------------------------------ */

export const IMO_1 = {
  qBpd: 6800,
  idIn: 6.065,
  lengthFt: 19800,
  elevChangeFt: 180,
  rhoLbFt3: 52.3,
  muCp: 4.2,
  /** The line has been in service for years, so the roughness is stated
   *  rather than taken as new steel. */
  roughnessIn: 0.006,
  /** The isometric's resistance sum, given directly so no K table is read. */
  sumK: 3.85,
};

/** The site's own erosional c factor, agreed with the operator. It is not
 *  one of the three published RP 14E rows. */
export const IMO_1_C_FACTOR = 120;

/* ------------------------------------------------------------------ *
 * Professional. The BRASS trunk, a gas line from the gathering station to
 * the terminal, running downhill the whole way.
 * ------------------------------------------------------------------ */

export const BRASS = {
  p1Psia: 1150,
  p2Psia: 840,
  idIn: 15,
  lengthMi: 58,
  sg: 0.62,
  tAvgR: 552,
  zAvg: 0.845,
  efficiency: 0.92,
  elevChangeFt: -950,
};

/** The General Flow run needs a gas viscosity and a pipe roughness, both
 *  stated. */
export const BRASS_MU_CP = 0.0125;
export const BRASS_ROUGHNESS_IN = 0.0006;

/** The rate the terminal has contracted for, which the outlet pressure
 *  solve is run against. Stated in scfd. */
export const BRASS_CONTRACT_SCFD = 92e6;

/* ------------------------------------------------------------------ *
 * Expert. The QUA IBOE export line: its wall, its rating, and the pigging
 * programme that keeps its slug inside the catcher.
 * ------------------------------------------------------------------ */

export const QUA_IBOE_WALL = {
  designPsig: 1450,
  odIn: 16,
  smysPsi: 60000,
  code: 'B31.8',
  /** Class 3: the line crosses a town's outskirts. Stated, because
   *  assuming Class 1 is the mistake the classes exist to prevent. */
  locationClass: 3,
  jointFactor: 1,
  tempDerate: 0.967,
  corrosionAllowanceIn: 0.0625,
};

/** The wall the mill actually rolled, which is what the rating is read
 *  from. */
export const QUA_IBOE_AS_BUILT_WALL_IN = 0.5;

export const QUA_IBOE_PIG = {
  idIn: 15,
  lengthFt: 306240,
  pigSpeedFtS: 4,
};

/** The holdup is an INPUT to the engine and is therefore an input to the
 *  capstone: the measured loading from the last three runs. */
export const QUA_IBOE_HOLDUP_FRAC = 0.035;
export const QUA_IBOE_CATCHER_BBL = 3200;
export const QUA_IBOE_DROPOUT_BPD = 95;
