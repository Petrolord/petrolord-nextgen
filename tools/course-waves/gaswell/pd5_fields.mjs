// The PD5 capstone (Gas Well Performance and Deliquification), and the
// eighteen graded fields derived from it by running the engine. Nothing here
// is typed from a lesson, a chart or a table: every graded number below is a
// return value of engines/production/gasWellLoading.js,
// engines/production/plungerLift.js or engines/production/gasProperties.js.
//
// Every condition below differs from the ones gaswell_cases.json publishes,
// which is the DR2 rule: design the capstone's conditions BEFORE writing the
// lessons, so the tier can teach on the published case and grade on this one.
// The golden's competing value is named in a trailing comment on every line.
//
// UNITS. Field units throughout, as the two module headers state: psia (never
// psig), degF at the gasProperties door and degR at the gasWellLoading door,
// Mscf/d for gas rate, scf for a cycle volume, bbl and bbl/d for liquid,
// scf/bbl for gas-liquid ratio, ft/s for velocity, ft for depth and slug
// length, in for tubing inside diameter, ft2 for flow area, lbm/ft3 for
// density, dyne/cm for interfacial tension, psi for a pressure term and psia
// for an absolute pressure. Nothing here is SI.
//
// PD1 ALREADY OWNS THE GAS IPR. PD1 (Nodal Analysis and Well Performance)
// treats the gas inflow, the tubing curve and the node, and it records that
// gasPwfAtRate reads a SAMPLED gas IPR by linear interpolation, sparse in rate
// exactly where the curve is steepest. None of that is repeated here. PD5 is
// the deliquification course, so its subject is the liquid the gas cannot
// carry: the droplet balance, the critical velocity, the critical rate, where
// down the string it bites first, and what a smaller tubing string or a
// plunger does about it.
//
// ---------------------------------------------------------------------------
// THE WELL: IMIRINGI-7, and why it is uncomfortable
//
// A watering-out gas well on 3-1/2 inch 9.3 lb/ft tubing (2.992 in ID) to
// 8,420 ft, flowing 2,551.3 Mscf/d against 999.62 psia at the wellhead and
// making 373.8 bbl/d of formation brine with it. Four things were tuned into it,
// and every one of them is verified below from the PRINTED values rather than
// asserted.
//
//   1. IT PASSES AT THE GAUGE AND LOADS AT THE SHOE. At the wellhead the well
//      runs 2,506.4 Mscf/d against a Coleman critical rate of 2,032.6, a ratio
//      of 1.2552: comfortably unloaded where the operator can see it, and it
//      still passes there under Turner (1.0460). At the shoe the critical rate
//      is 2,757.4 and the ratio is 0.9253, a margin of -7.474 percent. The
//      profile crosses one somewhere between 4,210 ft (ratio 1.0711) and
//      6,315 ft (ratio 0.9956), so liquid is falling back over the bottom
//      third of the string while every surface number says the well is
//      healthy. That is the
//      thing this course exists to teach and it is the reason loadingProfile
//      exists rather than a single loadingAt at the wellhead.
//
//   2. THE WELLHEAD SITS 0.38 PSI BELOW THE CORRELATION THRESHOLD.
//      recommendCorrelation switches at COLEMAN_PRESSURE_LIMIT_PSIA = 1000
//      psia. This well's wellhead is 999.62 psia, so it is recommended
//      Coleman, the UNADJUSTED equation. Turner's 20 percent adjustment would
//      raise every critical rate by exactly 1.2. Nothing else about the well
//      changes. Four tenths of a psi on a wellhead gauge therefore moves the
//      whole design.
//
//   3. THE CORRELATION DECIDES THE WORKOVER. Sized at the controlling station
//      against four real workover strings, Coleman says the largest one that
//      unloads is 2.750 in (3-1/2 in 12.95 lb/ft), critical rate 2,329.4
//      Mscf/d, ratio 1.0953. Under Turner the same 2.750 in string carries a
//      critical rate of 2,795.3 Mscf/d and a ratio of 0.9127, so it is STILL
//      LOADING, and the largest string that works becomes 2.323 in. The
//      capstone therefore has two defensible answers to the same workover
//      question, separated by the 0.38 psi in (2). The aux block prints both.
//
//   4. THE PLUNGER FALLBACK IS BLESSED BY THE RULE OF THUMB AND REFUSED BY THE
//      PHYSICS. screenPlungerLift returns pressureOk true (745 psia of casing
//      against 333.42 psia needed) and glrOk FALSE: a cycle needs 9,306.7 scf
//      of gas per barrel and the well makes 6,825. The 400 scf/bbl/1000 ft
//      screening heuristic asks for only 3,368, which this well beats twice
//      over, so the physics is 2.763 times more demanding than the heuristic
//      and `ruleOfThumbAgrees` comes back false. The engine
//      surfaces the disagreement instead of hiding it, and the capstone is
//      built to land inside it.
//
// ---------------------------------------------------------------------------
// WHAT THE ORACLE RECORDS, AND WHERE THIS CAPSTONE STANDS ON EACH
//
// tools/validation/production/oracle_gaswell.py records NO defects. Its
// docstring is entirely about independence discipline: SI throughout with no
// gc anywhere, the rate constant built from the molar volume rather than from
// 86400 Tsc/psc, plunger lift in pascals and metres. It emits goldens and
// says nothing about where the engine and the oracle part company.
//
// The gate, __tests__/production.gaswell.test.js, DOES record one, in a
// comment on the plunger force balance: "The slug term carries the platform's
// rounded 0.433 psi/ft constant where the oracle uses rho g exactly, which is
// a tenth of a percent apart and is the only place the two disagree at all."
// It loosens that one assertion to a 5e-3 relative tolerance and pins
// `expect(PSI_PER_FT_SG).toBe(0.433)`.
//
//   (a) THE 0.433 SEAM. EXPOSED HERE AS A GRADED FIELD. plunger_slug_
//       hydrostatic_psi is liftPressure().terms.slugPsi, 78.232275 psi on this
//       well. The exact water gradient, 1000 kg/m3 times g in psi/ft, is
//       0.4335275 psi/ft/SG, which gives 78.327582 psi. The gap is 0.095307
//       psi, 0.1218 percent, and it is 1,162 times this field's tolerance. This
//       is the ONE graded field a learner can reach with a hand calculation,
//       and doing it with the textbook water gradient FAILS. That is the
//       lesson: on this platform the slug term carries 0.433, not rho g.
//
//   (b) recommendCorrelation CHOOSES ON THE WELLHEAD AND THE ANSWER IS APPLIED
//       AT THE SHOE. NOT ORACLED, EXPOSED HERE AS THE CENTRE OF THE CAPSTONE.
//       The function takes one argument, a wellhead pressure, and the module's
//       own loadingProfile header says the controlling station is the shoe.
//       This well is 999.62 psia at the wellhead (Coleman) and 2,261.5 psia at
//       the shoe, where the same rule would say Turner. The engine therefore
//       recommends the low-pressure correlation for a station 2.26 times above
//       the pressure limit Coleman was fitted under. Worth 20 percent of every
//       critical rate, and here that is the difference between a 2.750 in and
//       a 2.323 in workover string. The message also calls whatever pressure
//       it is handed a "wellhead": fed the controlling station it prints "At
//       2262 psia wellhead this well is above the range Coleman studied".
//
//   (c) recommendCorrelation PRINTS THE THRESHOLD IT JUST CLEARED. NOT
//       ORACLED, EXPOSED HERE IN AUX. The reason string is formatted with
//       Math.round, so at 999.62 psia it reads "At 1000 psia wellhead this
//       well sits inside the low-pressure range Coleman's data covered". The
//       message names the limit as though the well sat exactly on it. Same
//       family as the PD3 ESP toFixed(0) finding.
//
//   (d) screenPlungerLift's GAS REQUIREMENT FALLS AS THE WELL GETS WEAKER. NOT
//       ORACLED, EXPOSED HERE IN AUX. gasPerCycleScf is evaluated between
//       casing pressure and the pressure still needed at the top of the rise,
//       so when the casing cannot reach the requirement the average runs
//       backwards and the number keeps coming. Aux prints the same well at
//       745, 288 and 96 psia of casing: the required gas-liquid ratio falls
//       from 9,306.7 to 5,362.8 to 3,705.9 scf/bbl, and at BOTH 288 and 96
//       psia glrOk turns TRUE on a well whose casing cannot move the plunger
//       at all. The weaker the well, the easier its gas test looks.
//
//   (e) maxSlugLengthFt CLAMPS TO ZERO INSTEAD OF REFUSING. NOT ORACLED,
//       EXPOSED HERE IN AUX. Same well at 96 psia of casing returns 0 ft,
//       which reads as "the longest slug is nothing" when the truth is that
//       the plunger will not move with no slug on it at all.
//
//   (f) TWO MOLECULAR WEIGHTS OF AIR IN ONE DOMAIN, AND TWO TEMPERATURE
//       CONVENTIONS. NOT ORACLED, PRINTED IN AUX. gasWellLoading.AIR_MW is
//       28.9647 and gasProperties.AIR_MW is 28.9625, both against the same R
//       of 10.7316, so a gas density computed either way differs by 76 parts
//       per million: 7.6100929 against 7.6095149 lbm/ft3 at this well's shoe.
//       gasWellLoading takes tempR and gasProperties takes tF,
//       which is why this script converts at the door with
//       gasProperties.toRankine rather than carrying a hand-typed 459.67.
//
// ---------------------------------------------------------------------------
// WHY THE Z-FACTOR IS IMPORTED
//
// gasWellLoading needs a z at every station and does not own one. The golden
// hands it a flat 0.9 at every pressure from 300 to 2,500 psia, which is fine
// for an oracle whose job is to check the droplet algebra and wrong for a well
// whose pressure triples down the string. This capstone therefore takes z from
// gasProperties.naturalGasZ (Sutton pseudo-criticals, Dranchuk and
// Abou-Kassem), which is a return value of an engine function in the same
// package, and z is graded at the wellhead so the learner has to go and get it
// rather than assume one. The z values that result run 0.8436 to 0.8677 and
// are nowhere near the golden's 0.9.
//
// ---------------------------------------------------------------------------
// WHY THE TIERS SPLIT WHERE THEY DO
//
// The split follows what the engines actually compute, in three layers.
//
//   ASSOCIATE is the droplet balance AT ONE POINT, and that point is the
//   wellhead, because that is the gauge an operator reads. Six values:
//   the z, the gas density, the terminal velocity of a brine droplet, the
//   terminal velocity of a condensate droplet, the critical rate, and the
//   velocity the well is actually making. Every one of them comes from
//   gasDensityLbFt3, terminalDropletVelocity or loadingAt at a single station.
//   A learner who stops here concludes the well is healthy, ratio 1.2552, and
//   is wrong.
//
//   PROFESSIONAL is the DESIGN. Three functions that a point check cannot
//   reach: loadingProfile down the whole traverse, which finds the controlling
//   station; sizeTubingForRate, which turns "it is loading" into a workover;
//   and screenPlungerLift, which turns it into a lift installation. Six
//   values: the critical rate and velocity at the mid string and at the
//   controlling shoe, the critical rate of the string the sizing chooses, the
//   pressure the plunger needs, and the gas-liquid ratio a cycle costs.
//
//   EXPERT is what the design HIDES or what BREAKS it. The Turner critical
//   velocity at the controlling station, which is the correlation the 1000
//   psia rule came within 0.38 psi of choosing and which reverses the workover
//   answer. The critical rate of the candidate the sizing silently discarded,
//   2.922 in at ratio 0.9701, which misses by only 2.99 percent and never
//   appears in `largestUnloaded`. The slug hydrostatic term, which is the one
//   place the engine and its own oracle disagree. The longest slug the well
//   can lift, which is the number the clamp in (e) destroys on a weaker well.
//   The gas a cycle costs, which is the number that inverts in (d). And the
//   liquid a day of cycling actually delivers, 18.796 bbl/d against the 373.8
//   bbl/d this well makes, a factor of 19.9 that `feasible` never looks at.
const R = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const L = await import(`${R}/engines/production/gasWellLoading.js`);
const P = await import(`${R}/engines/production/plungerLift.js`);
const G = await import(`${R}/engines/production/gasProperties.js`);
import * as fs from 'fs';

export const CAP = {
  // ---- the gas ------------------------------------------------------------
  gasSg: 0.702,             // golden velocity rows and plunger inputs: gasSg 0.65

  // ---- the two liquids the well makes -------------------------------------
  // Formation brine at 1.095 SG, which is 68.35 lbm/ft3, and a light
  // condensate. Both differ from Turner's own tabulated starting points, which
  // are what the golden ran on.
  brineSigmaDyneCm: 66.4,   // golden water rows: sigmaDyneCm 60
  brineRhoLbmFt3: 68.35,    // golden water rows: rhoLiquidLbFt3 67
  condSigmaDyneCm: 24.6,    // golden condensate rows: sigmaDyneCm 20
  condRhoLbmFt3: 43.8,      // golden condensate rows: rhoLiquidLbFt3 45

  // ---- the string and the rate --------------------------------------------
  tubingIdIn: 2.992,        // golden: idIn 2.441 everywhere (velocity rows and plunger)
  qMscfd: 2551.3,           // the golden publishes no gas rate at all; its rates are
                            // OUTPUTS (612.96 to 2496.15 Mscf/d critical rates)

  // ---- the flowing traverse, five measured stations, top first ------------
  // Pressures and temperatures differ from every one of the golden's, which
  // are the six combinations of pPsia 300/1000/2500 with tempR 540/620 plus
  // the plunger's single 580 degR.
  stations: [
    { depthFt: 0,    pPsia: 999.62, tF: 96.4 },  // golden pPsia: 300, 1000, 2500; tempR 540/620 (= 80.33/160.33 degF)
    { depthFt: 2105, pPsia: 1236.4, tF: 119.6 }, // golden: none at this pressure or temperature
    { depthFt: 4210, pPsia: 1503.9, tF: 142.8 }, // golden: none
    { depthFt: 6315, pPsia: 1836.2, tF: 166.0 }, // golden: none
    { depthFt: 8420, pPsia: 2261.5, tF: 189.2 }, // golden: none; nearest published pressure is 2500
  ],
  gradedProfileIndex: 2,    // an array index, not a physical condition: the 4,210 ft
                            // station, where the profile is still above one

  // ---- the workover candidates -------------------------------------------
  // Four real tubing strings, none of them the golden's 2.441 in, and none of
  // them the string the well is on. 2.922 in is 3-1/2 in 10.2 lb/ft, 2.750 in
  // is 3-1/2 in 12.95 lb/ft, 2.323 in is 2-7/8 in 7.9 lb/ft, 1.867 in is
  // 2-3/8 in 5.95 lb/ft.
  candidatesIdIn: [2.922, 2.750, 2.323, 1.867], // golden publishes one ID, 2.441

  // ---- the correlation ----------------------------------------------------
  // recommendCorrelation reads the WELLHEAD pressure, 999.62 psia, and returns
  // coleman. Turner is carried so the aux block can price the other answer.
  gradedCorrelation: 'coleman', // golden publishes BOTH columns, colemanFtS and turnerFtS,
                            // on every one of its twelve velocity rows; a correlation
                            // name is a mode, not a numeric condition
  otherCorrelation: 'turner',   // as above
  colemanLimitPsia: 1000,   // NOT a capstone condition, and it deliberately equals a
                            // golden one (velocity[2].pPsia is 1000): this IS
                            // COLEMAN_PRESSURE_LIMIT_PSIA, the engine's own
                            // constant, carried in only so the aux block can
                            // print how far the wellhead sits from it and
                            // assert it still matches the engine. No graded
                            // field uses it, and nothing is evaluated at it.

  // ---- the plunger installation, on the string the sizing chose -----------
  plungerIdIn: 2.750,       // golden plunger: idIn 2.441
  plungerDepthFt: 8420,     // golden plunger: depthFt 6000
  slugLengthFt: 165,        // golden plunger: slugLengthFt 200
  linePressurePsia: 214,    // golden plunger: linePressurePsia 120
  casingPressurePsia: 745,  // golden plunger: casingPressurePsia 600
  liquidSg: 1.095,          // golden plunger: liquidSg 1.02
  plungerWeightLb: 9.4,     // golden plunger: plungerWeightLb 6
  plungerAvgTF: 142.8,      // golden plunger: avgTempR 580 (= 120.33 degF)
  wellGlrScfBbl: 6825,      // the golden publishes no well GLR; its computed
                            // requirement is 4710.97 scf/bbl
  riseFtMin: 812,           // engine TYPICAL.riseFtMin is 750; golden runs no cycle
  fallInGasFtMin: 1085,     // engine TYPICAL.fallInGasFtMin is 1000
  fallInLiquidFtMin: 186,   // engine TYPICAL.fallInLiquidFtMin is 172
  afterflowMin: 26,         // golden runs no cycle at all
  shutInMin: 48,            // golden runs no cycle at all

  // ---- aux only: the same plunger on a weaker casing ----------------------
  // Two casing pressures below the lift requirement, carried purely to size
  // defects (d) and (e). Not graded.
  weakCasingPsia: 288,      // golden plunger: casingPressurePsia 600
  deadCasingPsia: 96,       // golden plunger: casingPressurePsia 600, and deliberately
                            // NOT the golden's linePressurePsia of 120
};

const brine = {
  sigmaDyneCm: CAP.brineSigmaDyneCm,
  rhoLiquidLbFt3: CAP.brineRhoLbmFt3,
};
const condensate = {
  sigmaDyneCm: CAP.condSigmaDyneCm,
  rhoLiquidLbFt3: CAP.condRhoLbmFt3,
};

// The traverse, with z taken from gasProperties at each station and the
// temperature converted at the door by the engine's own toRankine, because
// gasWellLoading speaks degR and gasProperties speaks degF.
const stations = CAP.stations.map((s) => ({
  depthFt: s.depthFt,
  pPsia: s.pPsia,
  tF: s.tF,
  tempR: G.toRankine(s.tF),
  z: G.naturalGasZ({ pPsia: s.pPsia, tF: s.tF, gasSg: CAP.gasSg }),
  idIn: CAP.tubingIdIn,
}));

export function capstoneValues() {
  const wh = stations[0];
  const shoeIn = stations[stations.length - 1];

  // --- the droplet at the wellhead ----------------------------------------
  const whRhoGas = L.gasDensityLbFt3({
    pPsia: wh.pPsia, tempR: wh.tempR, z: wh.z, gasSg: CAP.gasSg,
  });
  const whBrineDrop = L.terminalDropletVelocity({ ...brine, rhoGasLbFt3: whRhoGas });
  const whCondDrop = L.terminalDropletVelocity({ ...condensate, rhoGasLbFt3: whRhoGas });
  const whLoading = L.loadingAt({
    correlation: CAP.gradedCorrelation, ...brine, gasSg: CAP.gasSg,
    pPsia: wh.pPsia, tempR: wh.tempR, z: wh.z, idIn: CAP.tubingIdIn,
    qMscfd: CAP.qMscfd,
  });
  const whLoadingTurner = L.loadingAt({
    correlation: CAP.otherCorrelation, ...brine, gasSg: CAP.gasSg,
    pPsia: wh.pPsia, tempR: wh.tempR, z: wh.z, idIn: CAP.tubingIdIn,
    qMscfd: CAP.qMscfd,
  });

  // --- the profile down the whole string ----------------------------------
  const profile = L.loadingProfile({
    stations, qMscfd: CAP.qMscfd, correlation: CAP.gradedCorrelation,
    ...brine, gasSg: CAP.gasSg,
  });
  const profileTurner = L.loadingProfile({
    stations, qMscfd: CAP.qMscfd, correlation: CAP.otherCorrelation,
    ...brine, gasSg: CAP.gasSg,
  });
  const mid = profile.points[CAP.gradedProfileIndex];
  const shoe = profile.controlling;

  // --- the workover, sized AT THE CONTROLLING STATION ----------------------
  const shoeArgs = {
    qMscfd: CAP.qMscfd, ...brine, gasSg: CAP.gasSg,
    pPsia: shoe.pPsia, tempR: shoe.tempR, z: shoe.z,
  };
  const sized = L.sizeTubingForRate({
    candidatesIdIn: CAP.candidatesIdIn, correlation: CAP.gradedCorrelation, ...shoeArgs,
  });
  const sizedTurner = L.sizeTubingForRate({
    candidatesIdIn: CAP.candidatesIdIn, correlation: CAP.otherCorrelation, ...shoeArgs,
  });
  // The candidate the sizing discarded: largest ID in the list, and the one a
  // learner reaches for first because it is the smallest change.
  const rejected = sized.rows[0];

  // The other correlation, at the controlling station, on the string Coleman
  // chose. This is the field that reverses the workover.
  const shoeTurnerVelocity = L.criticalVelocity({
    correlation: CAP.otherCorrelation, ...brine, gasSg: CAP.gasSg,
    pPsia: shoe.pPsia, tempR: shoe.tempR, z: shoe.z,
  });
  const sizedStringUnderTurner = L.loadingAt({
    correlation: CAP.otherCorrelation, ...shoeArgs, idIn: CAP.plungerIdIn,
  });

  // --- the plunger --------------------------------------------------------
  const plungerZ = G.naturalGasZ({
    pPsia: CAP.linePressurePsia, tF: CAP.plungerAvgTF, gasSg: CAP.gasSg,
  });
  const plungerBase = {
    depthFt: CAP.plungerDepthFt, idIn: CAP.plungerIdIn,
    linePressurePsia: CAP.linePressurePsia, casingPressurePsia: CAP.casingPressurePsia,
    slugLengthFt: CAP.slugLengthFt, liquidSg: CAP.liquidSg,
    plungerWeightLb: CAP.plungerWeightLb, gasSg: CAP.gasSg,
    avgTempR: G.toRankine(CAP.plungerAvgTF), z: plungerZ,
    wellGlrScfBbl: CAP.wellGlrScfBbl,
    riseFtMin: CAP.riseFtMin, fallInGasFtMin: CAP.fallInGasFtMin,
    fallInLiquidFtMin: CAP.fallInLiquidFtMin,
    afterflowMin: CAP.afterflowMin, shutInMin: CAP.shutInMin,
  };
  const screen = P.screenPlungerLift(plungerBase);
  const design = screen.design;
  const maxSlug = P.maxSlugLengthFt(plungerBase);

  // The two weaker-casing runs, aux only: defects (d) and (e).
  const weak = P.screenPlungerLift({ ...plungerBase, casingPressurePsia: CAP.weakCasingPsia });
  const dead = P.screenPlungerLift({ ...plungerBase, casingPressurePsia: CAP.deadCasingPsia });

  // The exact water gradient the golden's oracle uses, for defect (a). This is
  // NOT graded and NOT an engine return; it is printed so the size of the seam
  // is on the record.
  const exactPsiPerFtSg = (1000 * 9.80665 * 0.3048) / 6894.757293168361;

  return {
    // Associate: the droplet at the wellhead, where the gauge is.
    wh_z_dak:                        wh.z,
    wh_gas_density_lbmft3:           whRhoGas,
    wh_terminal_velocity_brine_fts:  whBrineDrop.velocityFtS,
    wh_terminal_velocity_cond_fts:   whCondDrop.velocityFtS,
    wh_critical_rate_mscfd:          whLoading.criticalRateMscfd,
    wh_actual_velocity_fts:          whLoading.actualVelocityFtS,
    // Professional: the design. The whole string, the workover, the plunger.
    mid_critical_rate_mscfd:         mid.criticalRateMscfd,
    shoe_critical_rate_mscfd:        shoe.criticalRateMscfd,
    shoe_actual_velocity_fts:        shoe.actualVelocityFtS,
    sized_tubing_critical_rate_mscfd: sized.largestUnloaded.criticalRateMscfd,
    plunger_required_lift_psia:      design.lift.requiredPsia,
    plunger_required_glr_scfbbl:     design.requiredGlrScfBbl,
    // Expert: what the design hides, and what breaks it.
    shoe_critical_velocity_turner_fts: shoeTurnerVelocity.velocityFtS,
    rejected_tubing_critical_rate_mscfd: rejected.criticalRateMscfd,
    plunger_slug_hydrostatic_psi:    design.lift.terms.slugPsi,
    plunger_max_slug_ft:             maxSlug,
    plunger_gas_per_cycle_scf:       design.gasPerCycleScf,
    plunger_liquid_per_day_bbl:      design.liquidPerDayBbl,
    _aux: {
      well: {
        name: 'IMIRINGI-7',
        qMscfd: CAP.qMscfd,
        wellGlrScfBbl: CAP.wellGlrScfBbl,
        liquidMadeBblPerDay: (CAP.qMscfd * 1000) / CAP.wellGlrScfBbl,
        tubingIdIn: CAP.tubingIdIn,
        tubingAreaFt2: L.tubingAreaFt2(CAP.tubingIdIn),
      },
      correlationCliff: {
        wellheadPsia: stations[0].pPsia,
        limitPsia: L.COLEMAN_PRESSURE_LIMIT_PSIA,
        belowLimitByPsi: L.COLEMAN_PRESSURE_LIMIT_PSIA - stations[0].pPsia,
        recommendedAtWellhead: L.recommendCorrelation(stations[0].pPsia),
        // defect (b): the same rule applied where the answer is USED
        recommendedAtControllingStation: L.recommendCorrelation(shoeIn.pPsia),
        controllingStationPsia: shoeIn.pPsia,
        // defect (c): the message names the threshold it is below
        messagePrintsLimit: L.recommendCorrelation(stations[0].pPsia).reason.includes('At 1000 psia'),
        adjustment: L.LOADING_ADJUSTMENT,
        capLimitMatchesEngine: CAP.colemanLimitPsia === L.COLEMAN_PRESSURE_LIMIT_PSIA,
      },
      wellhead: {
        z: wh.z, rhoGasLbFt3: whRhoGas,
        brineTerminalFtS: whBrineDrop.velocityFtS,
        condensateTerminalFtS: whCondDrop.velocityFtS,
        turnerConstant: whBrineDrop.constant,
        colemanCriticalRateMscfd: whLoading.criticalRateMscfd,
        turnerCriticalRateMscfd: whLoadingTurner.criticalRateMscfd,
        actualVelocityFtS: whLoading.actualVelocityFtS,
        colemanRatio: whLoading.ratio,
        turnerRatio: whLoadingTurner.ratio,
        colemanLoaded: whLoading.loaded,
        turnerLoaded: whLoadingTurner.loaded,
      },
      profile: {
        correlation: CAP.gradedCorrelation,
        controllingDepthFt: shoe.depthFt,
        loaded: profile.loaded,
        marginPct: profile.marginPct,
        turnerLoaded: profileTurner.loaded,
        turnerMarginPct: profileTurner.marginPct,
        rows: profile.points.map((p, i) => ({
          depthFt: p.depthFt, pPsia: p.pPsia, tF: stations[i].tF, tempR: p.tempR, z: p.z,
          rhoGasLbFt3: p.rhoGasLbFt3,
          criticalVelocityFtS: p.criticalVelocityFtS,
          actualVelocityFtS: p.actualVelocityFtS,
          criticalRateMscfd: p.criticalRateMscfd,
          ratio: p.ratio,
          loaded: p.loaded,
          turnerRatio: profileTurner.points[i].ratio,
          turnerLoaded: profileTurner.points[i].loaded,
        })),
      },
      sizing: {
        evaluatedAtDepthFt: shoe.depthFt,
        colemanRows: sized.rows.map((r) => ({
          idIn: r.idIn, criticalRateMscfd: r.criticalRateMscfd, ratio: r.ratio, loaded: r.loaded,
        })),
        colemanLargestUnloadedIdIn: sized.largestUnloaded ? sized.largestUnloaded.idIn : null,
        colemanLargestUnloadedRatio: sized.largestUnloaded ? sized.largestUnloaded.ratio : null,
        turnerRows: sizedTurner.rows.map((r) => ({
          idIn: r.idIn, criticalRateMscfd: r.criticalRateMscfd, ratio: r.ratio, loaded: r.loaded,
        })),
        turnerLargestUnloadedIdIn: sizedTurner.largestUnloaded ? sizedTurner.largestUnloaded.idIn : null,
        turnerLargestUnloadedRatio: sizedTurner.largestUnloaded ? sizedTurner.largestUnloaded.ratio : null,
        // the workover Coleman chose, judged by the other correlation
        colemanChoiceUnderTurnerRatio: sizedStringUnderTurner.ratio,
        colemanChoiceUnderTurnerLoaded: sizedStringUnderTurner.loaded,
        colemanChoiceUnderTurnerCriticalRateMscfd: sizedStringUnderTurner.criticalRateMscfd,
        rejectedIdIn: rejected.idIn,
        rejectedRatio: rejected.ratio,
        rejectedShortByPct: (1 - rejected.ratio) * 100,
      },
      plunger: {
        z: plungerZ,
        requiredPsia: design.lift.requiredPsia,
        terms: design.lift.terms,
        areaIn2: design.lift.areaIn2,
        maxSlugLengthFt: maxSlug,
        gasPerCycleScf: design.gasPerCycleScf,
        liquidPerCycleBbl: design.liquidPerCycleBbl,
        requiredGlrScfBbl: design.requiredGlrScfBbl,
        wellGlrScfBbl: design.wellGlrScfBbl,
        ruleOfThumbGlrScfBbl: design.ruleOfThumbGlrScfBbl,
        ruleOfThumbAgrees: design.ruleOfThumbAgrees,
        ruleOfThumbOptimisticByFactor: design.requiredGlrScfBbl / design.ruleOfThumbGlrScfBbl,
        timing: design.timing,
        liquidPerDayBbl: design.liquidPerDayBbl,
        gasPerDayMscf: design.gasPerDayMscf,
        pressureOk: design.pressureOk,
        glrOk: design.glrOk,
        feasible: design.feasible,
        warnings: design.warnings,
        // the fails-open the verdict never looks at
        wellLiquidBblPerDay: (CAP.qMscfd * 1000) / CAP.wellGlrScfBbl,
        liquidShortfallFactor: ((CAP.qMscfd * 1000) / CAP.wellGlrScfBbl) / design.liquidPerDayBbl,
      },
      slugConstantSeam: {
        enginePsiPerFtSg: P.PSI_PER_FT_SG,
        exactPsiPerFtSg,
        engineSlugPsi: design.lift.terms.slugPsi,
        exactSlugPsi: exactPsiPerFtSg * CAP.liquidSg * CAP.slugLengthFt,
        gapPsi: exactPsiPerFtSg * CAP.liquidSg * CAP.slugLengthFt - design.lift.terms.slugPsi,
        gapPct: 100 * (exactPsiPerFtSg / P.PSI_PER_FT_SG - 1),
      },
      weakCasing: {
        // defect (d): the required gas-liquid ratio FALLS as the well weakens
        casing745: {
          casingPsia: CAP.casingPressurePsia,
          gasPerCycleScf: design.gasPerCycleScf,
          requiredGlrScfBbl: design.requiredGlrScfBbl,
          pressureOk: design.pressureOk, glrOk: design.glrOk, feasible: design.feasible,
        },
        casing288: {
          casingPsia: CAP.weakCasingPsia,
          gasPerCycleScf: weak.design.gasPerCycleScf,
          requiredGlrScfBbl: weak.design.requiredGlrScfBbl,
          pressureOk: weak.design.pressureOk, glrOk: weak.design.glrOk,
          feasible: weak.design.feasible,
          maxSlugLengthFt: P.maxSlugLengthFt({ ...plungerBase, casingPressurePsia: CAP.weakCasingPsia }),
        },
        casing96: {
          casingPsia: CAP.deadCasingPsia,
          gasPerCycleScf: dead.design.gasPerCycleScf,
          requiredGlrScfBbl: dead.design.requiredGlrScfBbl,
          pressureOk: dead.design.pressureOk, glrOk: dead.design.glrOk,
          feasible: dead.design.feasible,
          // defect (e): clamped to zero rather than refused
          maxSlugLengthFt: P.maxSlugLengthFt({ ...plungerBase, casingPressurePsia: CAP.deadCasingPsia }),
        },
      },
      airMwSeam: {
        // defect (f): two molecular weights of air in one domain
        gasWellLoadingAirMw: L.AIR_MW,
        gasPropertiesAirMw: G.AIR_MW,
        partsPerMillion: 1e6 * (L.AIR_MW / G.AIR_MW - 1),
        shoeDensityFromLoadingLbmFt3: L.gasDensityLbFt3({
          pPsia: shoe.pPsia, tempR: shoe.tempR, z: shoe.z, gasSg: CAP.gasSg,
        }),
        shoeDensityFromGradientLbmFt3: 144 * G.gasGradient({
          pPsia: shoe.pPsia, tF: shoeIn.tF, gasSg: CAP.gasSg, z: shoe.z,
        }),
      },
    },
  };
}

const TOL = {
  // Absolute, in each field's own unit, at about 1.05e-6 of the value with a
  // 1e-6 floor: loose enough to admit an honest seven-significant-figure
  // rounding of the printed value, tight enough that the 0.0953 psi exact-
  // water-gradient answer to plunger_slug_hydrostatic_psi fails by 1,162x.
  wh_z_dak: 1e-6, wh_gas_density_lbmft3: 4.2e-6, wh_terminal_velocity_brine_fts: 6.8e-6,
  wh_terminal_velocity_cond_fts: 4.7e-6, wh_critical_rate_mscfd: 2.1e-3,
  wh_actual_velocity_fts: 8.3e-6,
  mid_critical_rate_mscfd: 2.5e-3, shoe_critical_rate_mscfd: 2.9e-3,
  shoe_actual_velocity_fts: 4.4e-6, sized_tubing_critical_rate_mscfd: 2.4e-3,
  plunger_required_lift_psia: 3.5e-4, plunger_required_glr_scfbbl: 9.8e-3,
  shoe_critical_velocity_turner_fts: 5.8e-6, rejected_tubing_critical_rate_mscfd: 2.8e-3,
  plunger_slug_hydrostatic_psi: 8.2e-5, plunger_max_slug_ft: 1.1e-3,
  plunger_gas_per_cycle_scf: 1.2e-2, plunger_liquid_per_day_bbl: 2.0e-5,
};
const TIER = {
  wh_z_dak: 'beginner', wh_gas_density_lbmft3: 'beginner',
  wh_terminal_velocity_brine_fts: 'beginner', wh_terminal_velocity_cond_fts: 'beginner',
  wh_critical_rate_mscfd: 'beginner', wh_actual_velocity_fts: 'beginner',
  mid_critical_rate_mscfd: 'intermediate', shoe_critical_rate_mscfd: 'intermediate',
  shoe_actual_velocity_fts: 'intermediate', sized_tubing_critical_rate_mscfd: 'intermediate',
  plunger_required_lift_psia: 'intermediate', plunger_required_glr_scfbbl: 'intermediate',
  shoe_critical_velocity_turner_fts: 'advanced', rejected_tubing_critical_rate_mscfd: 'advanced',
  plunger_slug_hydrostatic_psi: 'advanced', plunger_max_slug_ft: 'advanced',
  plunger_gas_per_cycle_scf: 'advanced', plunger_liquid_per_day_bbl: 'advanced',
};
const UNIT = {
  wh_z_dak: 'dimensionless', wh_gas_density_lbmft3: 'lbm/ft3',
  wh_terminal_velocity_brine_fts: 'ft/s', wh_terminal_velocity_cond_fts: 'ft/s',
  wh_critical_rate_mscfd: 'Mscf/d', wh_actual_velocity_fts: 'ft/s',
  mid_critical_rate_mscfd: 'Mscf/d', shoe_critical_rate_mscfd: 'Mscf/d',
  shoe_actual_velocity_fts: 'ft/s', sized_tubing_critical_rate_mscfd: 'Mscf/d',
  plunger_required_lift_psia: 'psia', plunger_required_glr_scfbbl: 'scf/bbl',
  shoe_critical_velocity_turner_fts: 'ft/s', rejected_tubing_critical_rate_mscfd: 'Mscf/d',
  plunger_slug_hydrostatic_psi: 'psi', plunger_max_slug_ft: 'ft',
  plunger_gas_per_cycle_scf: 'scf', plunger_liquid_per_day_bbl: 'bbl/d',
};

const V = capstoneValues();
const fields = Object.keys(TIER).map((k) => [TIER[k], k, V[k], TOL[k]]);
fs.writeFileSync('/root/pd-wip-gaswell/fields.json', JSON.stringify(fields, null, 1));
for (const [t, k, v, tol] of fields) {
  console.log(`${t.padEnd(13)} ${k.padEnd(36)} ${v}  ${UNIT[k].padEnd(13)} (tol ${tol})`);
}
console.log('\naux:', JSON.stringify(V._aux, null, 1));
