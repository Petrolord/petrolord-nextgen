// The PD4 capstone (Rod Pump Design), and the eighteen graded fields derived
// from it by running the engine. Nothing here is typed from a lesson, a chart
// or a table: every graded number below is a return value of one of
// engines/production/rodString.js, rodDynamics.js, pumpingUnit.js or
// rodPumpDesign.js.
//
// Every condition below differs from the ones rodpump_cases.json publishes,
// which is the DR2 rule: design the capstone's conditions BEFORE writing the
// lessons, so the tier can teach on the published case and grade on this one.
// The golden's competing value is named in a trailing comment on every line.
//
// UNITS. Field units throughout, as the four module headers state: rate bbl/d,
// depth and length ft, stroke and diameter in, area in2, load lbf, torque
// in-lb, pressure psia (never psig), stress psi, speed spm, power hp, wave
// speed ft/s. Nothing here is SI.
//
// ---------------------------------------------------------------------------
// THE WELL: OBAGI-27, and why it is uncomfortable
//
// A 6085 ft beam-pumped oil well on a three-way taper, a 1.5 in plunger and a
// barrel that fills 85.3 percent. Five things were tuned into it, and all five
// are verified from the printed values rather than assumed:
//
//   1. THE STATIC RULE IS WRONG BY TEN INCHES. Every rod-pump text opens with
//      Sp = S - Fo Er: the plunger loses exactly the rod stretch. On this well
//      that rule says 103.04 in against a 121.38 in surface stroke. The damped
//      wave equation says 113.87 in. The static rule is 10.83 in, 10.5 percent,
//      LOW, and the whole of that gap is inertial overtravel. Both numbers are
//      graded, in the same tier, so a learner who stops at the spring model
//      loses one field and keeps the other. That is the distinction this course
//      exists to teach.
//
//   2. THE ONLY THING WRONG WITH THIS DESIGN IS THE RODS. The unit is inside
//      every rating it has: 74.9 percent of its structure, 89.4 percent of its
//      gearbox, 84.3 percent of its stroke. The rods are at 104.60 percent of
//      the modified Goodman allowable and the design is refused. The aux block
//      prints the service factor at which the loading crosses 100 exactly, and
//      it is 0.983: the number that decides whether this design is legal is not
//      a rod property at all, it is the operator's own judgement about the
//      fluid and the corrosion.
//
//   3. THE FILLAGE SITS THREE THOUSANDTHS ABOVE A CLIFF IN THE CODE.
//      runRodPumpDesign warns `incompleteFillage` at fillage < 0.85. This
//      barrel fills 0.853, so a pump that is fifteen percent short raises no
//      warning at all, and the aux block prints the same well at 0.849 where it
//      does. A learner who reads the warning list rather than the number
//      concludes the pump is full.
//
//   4. THE LOADS THE DESIGN REPORTS ARE NOT THE LOADS IT COMPUTED. This is the
//      centre of the capstone and it is the defect described below.
//
//   5. AND THE LOADS ARE NOT CONVERGED EITHER. Re-solving the same well at 240,
//      480 and 960 nodes moves the plunger stroke by 0.041 in, four hundredths
//      of one percent, and moves the peak polished rod load by 967.98 lb and
//      the minimum by 1108.07 lb, which is 4.2 and 34.8 percent. At 240 nodes
//      the march does not reach a repeating cycle in the twenty strokes it is
//      allowed and returns `notPeriodic`. So the plunger stroke, and everything
//      proportional to it, is a converged answer, and the two load extremes are
//      not. The aux block prints all four grids. A consequence worth stating
//      plainly: the worst rod loading in the speed sweep goes 105.16, 106.34,
//      104.60, 109.06, 111.23 percent across 10.6 to 12.2 spm, which is not
//      monotonic, and the dip at 11.4 spm is smaller than the grid spread on
//      the load it is built from. It is NOT evidence that speeding this unit up
//      unloads the rods. The right reading is that the engine cannot currently
//      resolve a two point difference in rod loading.
//
// ---------------------------------------------------------------------------
// WHAT THE ORACLE RECORDS, AND WHERE THIS CAPSTONE STANDS
//
// tools/validation/production/oracle_rodpump.py records no defect list. What it
// records is an INDEPENDENCE DISCIPLINE: a finite-element eigenvalue solve
// where the engine walks a transfer matrix, Newton loop closure and implicit
// differentiation where the engine intersects circles and differences
// numerically, a staggered velocity/tension RK4 march where the engine marches
// displacement by explicit central differences, and Python's own complex type
// where the engine hand-rolls complex arithmetic. The two routes are then
// required to agree, and the tolerance the gates hold them to on the wave
// equation is 2 percent on the plunger stroke and 3 percent on the minimum
// polished rod load. Everything smaller than that is invisible to the oracle by
// construction. Every finding this derivation turned up is either smaller than
// that or outside what the oracle exercises at all, so none of them is oracled.
// All seven are recorded in FINDINGS.md with their magnitudes.
//
// THE ONE THIS CAPSTONE EXPOSES, in the graded values themselves:
//
//   predictCard marches the string at the Courant step, which on this well is
//   4228 steps in a cycle, and it records the tension envelope over every one
//   of them. It then DECIMATES the surface card to about 180 points and takes
//   prlPeakLb and prlMinLb as the max and min of that subsample. So the two
//   headline loads of a rod-pump design are the extremes of 184 samples of a
//   4228 step march. On OBAGI-27 the graded PPRL of 22844.62 lb is 403.39 lb
//   low and the graded MPRL of 3184.83 lb is 2059.60 lb HIGH: the reported
//   minimum load is 2.83 times the load the march actually computed. Raising
//   only `cardSamples`, which changes the decimation stride and nothing else in
//   the march, recovers 23248.02 and 1125.23. runRodPumpDesign exposes neither
//   `cardSamples` nor `nodes`, so a studio user gets the subsampled pair and no
//   way to ask for the other. Both are graded at the shipped default, because
//   that is what the app returns, and the aux block prints the full-resolution
//   pair beside them.
//
// ---------------------------------------------------------------------------
// WHY THE TIERS SPLIT WHERE THEY DO
//
// The split was taken from what the four modules actually compute, not from a
// guess about the subject. There is a clean seam in the code: rodString.js and
// pumpingUnit.js's kinematics and the two closed forms at the top of
// rodPumpDesign.js are all CLOSED FORM AND TIMELESS. A stiffness is a sum of
// compliances, a buoyed weight is Archimedes, a natural frequency is an
// eigenvalue of a stepped bar, a stroke is a four-bar linkage closed at 720
// crank angles, a fluid load is a differential times an area, a displacement is
// a volume per stroke. Nothing in that layer knows what time it is. That is the
// ASSOCIATE tier: the six things a designer settles before anything moves.
//
// Everything in rodDynamics.predictCard is the design itself, because the
// design IS the card: the plunger stroke, the two polished rod loads, the work
// per cycle and therefore the power, and the oil that reaches the tank. That is
// the PROFESSIONAL tier, and the static stretch is graded inside it rather than
// in the tier below precisely so the ten inch gap sits between two fields a
// learner answers in the same sitting.
//
// The EXPERT tier is what the card hides. Three of its fields come from
// pumpingUnit.balanceUnit, which cannot be reached at all without first solving
// the card and which is the only place the gearbox is sized; one comes from the
// modified Goodman line, which is the check that decides whether the string
// survives the card; and two come from rodDynamics.diagnoseCard, the Gibbs
// harmonic solver, which is handed the surface half of the predicted card and
// asked what the pump was doing. Those two share no code path with the march
// that produced the card, so the gap between what the diagnostic returns and
// what the prediction was told to assume is a measurement of the engine against
// itself. It is 0.0813 in on the plunger stroke and 241.52 lb, 5.53 percent,
// on the pump load, and both halves of it are graded rather than hidden.
const R = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const RS = await import(`${R}/engines/production/rodString.js`);
const RD = await import(`${R}/engines/production/rodDynamics.js`);
const PU = await import(`${R}/engines/production/pumpingUnit.js`);
const RP = await import(`${R}/engines/production/rodPumpDesign.js`);
const CAT = await import(`${R}/engines/production/data/rodCatalog.js`);
import * as fs from 'fs';

export const CAP = {
  // ---- the string --------------------------------------------------------
  // A three-way taper. The golden carries a two-way taper and a single-size
  // string, and every length below differs from both.
  sections: [
    { size: '1', lengthFt: 1825 },    // golden taper/uniform sections: 7/8 3000, 3/4 2000, 7/8 6000
    { size: '7/8', lengthFt: 2140 },  // golden: 3000 ft of 7/8, never 2140
    { size: '3/4', lengthFt: 2120 },  // golden: 2000 ft of 3/4, never 2120
  ],
  fluidSg: 0.94,                      // golden strings are built at fluidSg 1.0
  gradeId: 'D',                       // the golden publishes NO rod grade and NO stress of
                                      // any kind, so there is nothing here to differ from
                                      // and nothing a learner could read off it. API Grade
                                      // D is also what rodGrade falls back to; it is
                                      // written out so the 115,000 psi behind the Goodman
                                      // line has a named source instead of a default

  // ---- the pumping unit --------------------------------------------------
  // Real beam dimensions, off the unit's own drawing, which is what the
  // pumpingUnit header says a real design does. All six differ from the
  // golden's six.
  aIn: 118.4,                         // golden unit geometry: aIn 106.6667
  cIn: 71.6,                          // golden: cIn 64.0
  pIn: 92.5,                          // golden: pIn 80.0
  crankBehindIn: 104.3,               // golden: crankBehindIn 92.8
  crankBelowIn: 66.9,                 // golden: crankBelowIn 60.8
  rIn: 33.7,                          // golden: rIn 28.8
  kinSteps: 720,                      // golden unit cycle is cut at steps 360
                                      // (unitKinematics' `branch` is deliberately NOT
                                      // stated here: a working four-bar never flips
                                      // branch, so it is a fact about linkages and not a
                                      // condition anyone tunes. It is left at the
                                      // engine's own default, as `nodes`, `maxCycles`
                                      // and `tol` are left at predictCard's.)

  // ---- the pump and the fluid it lifts -----------------------------------
  plungerDIn: 1.5,                    // the golden publishes no plunger; the engine's own
                                      // gates run 1.75, 2.0 and 2.25
  pDischargePsia: 2680,               // golden publishes no pressures; the gates use 2265
  pIntakePsia: 210,                   // gates use 150 and 100
  fillage: 0.853,                     // golden predict case is a full barrel, fillage 1.0
  pumpEfficiency: 0.86,               // gates use 0.9 and 1.0

  // ---- the operating point -----------------------------------------------
  spm: 11.4,                          // golden predict cases are cut at spm 5 and 9,
                                      // golden diagnose at spm 9
  dampingRatio: 0.085,                // golden predict and diagnose both use 0.10, which
                                      // is also DEFAULT_DAMPING_RATIO
  serviceFactor: 0.94,                // the golden publishes no service factor; the module
                                      // refuses to carry one, because it belongs to the
                                      // fluid and the operator

  // ---- the counterbalance -------------------------------------------------
  structuralUnbalanceLb: 810,         // the golden publishes no unbalance; netTorque and
                                      // balanceUnit both default it to 0
  crankOffsetDeg: 14,                 // golden publishes none; the default is 0

  // ---- the unit's own rating ----------------------------------------------
  unitDesignation: 'C-640D-305-144',  // the golden publishes no designation; the gates
                                      // parse C-228D-200-74, C-57D-076-48, M-320D-256-120
                                      // and A-912D-365-168

  // ---- the Gibbs diagnostic ----------------------------------------------
  harmonics: 36,                      // golden diagnose case is cut at harmonics 24

  // ---- values carried in for the aux block only ---------------------------
  // None of these is a capstone condition and no graded field uses any of them.
  auxFillageBelowCliff: 0.849,        // just under runRodPumpDesign's 0.85 warning threshold
  auxFillageFull: 1.0,                // this IS the golden's fillage and predictCard's own
                                      // default, carried in ONLY so the aux block can size
                                      // the pound-down travel. No graded field uses it.
  auxFillageLow: 0.78,                // a deep pound, to size the same accounting question
  auxNodes: [120, 240, 480, 960],     // 120 IS predictCard's default and the one every
                                      // graded value is cut on; the rest are aux only
  auxCardSamplesFull: 1e7,            // forces the decimation stride to 1
  auxSpmSweep: [10.6, 11.0, 11.4, 11.8, 12.2],
};

// ---------------------------------------------------------------------------

const buildString = (gradeId = CAP.gradeId) => RS.buildRodString({
  sections: CAP.sections, fluidSg: CAP.fluidSg, gradeId,
});

const geometry = () => PU.conventionalGeometry({
  aIn: CAP.aIn, cIn: CAP.cIn, pIn: CAP.pIn,
  crankBehindIn: CAP.crankBehindIn, crankBelowIn: CAP.crankBelowIn, rIn: CAP.rIn,
});

// The surface card, sampled the way the pumping unit asks for it: balanceUnit
// and netTorque both want load as a function of cycle fraction.
const loadAtOf = (card) => (frac) => card[
  Math.min(card.length - 1, Math.max(0, Math.round(frac * card.length) % card.length))
].loadLb;

export function capstoneValues() {
  // --- the string, closed form --------------------------------------------
  const string = buildString();
  const freq = RS.naturalFrequency({ string });
  const waveSpeed = RS.stringWaveSpeedFtS(string);

  // --- the unit, pure geometry ---------------------------------------------
  const geom = geometry();
  const kin = PU.unitKinematics(geom, { steps: CAP.kinSteps });
  const surfacePosition = PU.surfacePositionFn(kin);
  const strokeIn = kin.strokeIn;
  const torqueFactorMaxIn = Math.max(...kin.samples.map((s) => Math.abs(s.torqueFactorIn)));

  // --- the pump, closed form ------------------------------------------------
  const fo = RP.fluidLoadLb({
    plungerDIn: CAP.plungerDIn,
    pDischargePsi: CAP.pDischargePsia,
    pIntakePsi: CAP.pIntakePsia,
  });
  const ratedBpd = RP.displacementBpd({
    plungerDIn: CAP.plungerDIn, strokeIn, spm: CAP.spm,
  });
  const staticStretchIn = RS.rodStretchIn({ string, loadLb: fo });

  // --- the card ------------------------------------------------------------
  const cardArgs = {
    string,
    surfacePosition,
    strokeFt: strokeIn / 12,
    spm: CAP.spm,
    fluidLoadLb: fo,
    fillage: CAP.fillage,
    dampingRatio: CAP.dampingRatio,
  };
  const dyn = RD.predictCard(cardArgs);

  // The SAME march, decimated to every step instead of to about 180 points.
  // `cardSamples` changes the stride and nothing else, so the difference
  // between these two is purely the subsampling.
  const dynFull = RD.predictCard({ ...cardArgs, cardSamples: CAP.auxCardSamplesFull });

  // --- the balance ---------------------------------------------------------
  // balanceUnit needs the card, and runRodPumpDesign needs the balance, so the
  // card is solved here first and the design is then handed the balance that
  // came out of it. That circularity is finding (ii) in FINDINGS.md.
  const cardLoadAt = loadAtOf(dyn.surfaceCard);
  const balance = PU.balanceUnit({
    kin,
    cardLoadAt,
    structuralUnbalanceLb: CAP.structuralUnbalanceLb,
    crankOffsetDeg: CAP.crankOffsetDeg,
    aIn: geom.aIn,
  });
  // The same balance with the two inputs runRodPumpDesign silently discards.
  const balanceIgnoring = PU.balanceUnit({
    kin, cardLoadAt, structuralUnbalanceLb: 0, crankOffsetDeg: 0, aIn: geom.aIn,
  });

  // --- the whole design ----------------------------------------------------
  const unitRating = PU.parseUnitDesignation(CAP.unitDesignation);
  const designArgs = {
    string,
    frequency: freq,
    kin,
    surfacePosition,
    strokeIn,
    spm: CAP.spm,
    plungerDIn: CAP.plungerDIn,
    pDischargePsi: CAP.pDischargePsia,
    pIntakePsi: CAP.pIntakePsia,
    fillage: CAP.fillage,
    pumpEfficiency: CAP.pumpEfficiency,
    dampingRatio: CAP.dampingRatio,
    serviceFactor: CAP.serviceFactor,
    structuralUnbalanceLb: CAP.structuralUnbalanceLb,
    crankOffsetDeg: CAP.crankOffsetDeg,
    unitRating,
    balance,
  };
  const run = RP.runRodPumpDesign(designArgs);
  const design = run.design;

  // Proof that structuralUnbalanceLb and crankOffsetDeg are accepted and then
  // discarded, and that omitting the balance leaves torqueGroup at 0 rather
  // than at null.
  const runNoUnbalance = RP.runRodPumpDesign({
    ...designArgs, structuralUnbalanceLb: 0, crankOffsetDeg: 0,
  });
  const runNoBalance = RP.runRodPumpDesign({ ...designArgs, balance: null });

  // --- the Gibbs diagnostic ------------------------------------------------
  const diag = RD.diagnoseCard({
    string,
    surfaceCard: design.dynamics.surfaceCard,
    spm: CAP.spm,
    dampingRatio: CAP.dampingRatio,
    harmonics: CAP.harmonics,
  });

  // --- aux: grid sensitivity ------------------------------------------------
  const byNodes = CAP.auxNodes.map((nodes) => {
    const r = RD.predictCard({ ...cardArgs, nodes });
    return {
      nodes,
      marchSteps: r.samples,
      cardPoints: r.surfaceCard.length,
      converged: r.converged,
      cycles: r.cycles,
      plungerStrokeIn: r.plungerStrokeIn,
      prlPeakLb: r.prlPeakLb,
      prlMinLb: r.prlMinLb,
      workInLbPerCycle: r.workInLbPerCycle,
    };
  });

  // --- aux: the fillage cliff and the pound-down accounting ------------------
  const atFillage = (fillage) => {
    const r = RD.predictCard({ ...cardArgs, fillage });
    return {
      fillage,
      plungerStrokeIn: r.plungerStrokeIn,
      sweptBpd: RP.displacementBpd({
        plungerDIn: CAP.plungerDIn, strokeIn: r.plungerStrokeIn, spm: CAP.spm,
      }),
    };
  };
  const fullBarrel = atFillage(CAP.auxFillageFull);
  const lowBarrel = atFillage(CAP.auxFillageLow);
  const designBarrel = atFillage(CAP.fillage);
  const runBelowCliff = RP.runRodPumpDesign({
    ...designArgs, fillage: CAP.auxFillageBelowCliff,
  });

  // --- aux: the speed sweep ------------------------------------------------
  const speedSweep = CAP.auxSpmSweep.map((spm) => {
    const r = RP.runRodPumpDesign({ ...designArgs, spm, balance: null });
    return {
      spm,
      plungerStrokeIn: r.design.plungerStrokeIn,
      producedBpd: r.design.producedBpd,
      prhp: r.design.prhp,
      pprlLb: r.design.pprlLb,
      worstLoadingPct: r.design.worstSection.loadingPct,
    };
  });

  // --- aux: the natural-frequency scan grid ---------------------------------
  // naturalFrequency intends a 400 point scan from 0.05 n0 to 4 n0. It advances
  // `prevSpm` and then adds a FIXED increment times the loop index to it, so
  // the grid grows quadratically and reaches the top of the range in about 27
  // points. This replicates that grid exactly, without touching the engine.
  const scanGrid = (() => {
    const hi = freq.n0Spm * 4;
    const lo = freq.n0Spm * 0.05;
    const pts = [];
    let prevSpm = lo;
    for (let i = 1; i <= 400; i += 1) {
      const spm = prevSpm + ((hi - lo) * i) / 400;
      pts.push(spm);
      prevSpm = spm;
    }
    const inRange = pts.filter((p) => p <= hi);
    return {
      intendedPoints: 400,
      intendedSpacingSpm: (hi - lo) / 400,
      pointsInsideTheRange: inRange.length,
      widestSpacingInsideRangeSpm: inRange.length > 1
        ? Math.max(...inRange.slice(1).map((p, i) => p - inRange[i]))
        : null,
      lastPointReachedSpm: pts[pts.length - 1],
    };
  })();

  // --- aux: the service factor at which the design just passes ---------------
  // loadingPct scales as 1 / serviceFactor, so the crossing is exact.
  const criticalServiceFactor = CAP.serviceFactor * (design.worstSection.loadingPct / 100);

  // --- aux: envelope top versus the reported peak ----------------------------
  const dxFt = string.lengthFt / 120;
  const envTop = design.dynamics.tensionEnvelope[0];
  const buoyedAboveEnvTop = string.sections[0].weightLbPerFt * (dxFt / 2) * string.buoyancy;

  return {
    // Associate: the string, the linkage and the barrel. Closed form, timeless.
    string_kr_lb_per_in:          string.krLbPerIn,
    string_buoyed_weight_lb:      string.weightFluidLb,
    string_natural_freq_spm:      freq.nPrimeSpm,
    unit_stroke_in:               strokeIn,
    pump_fluid_load_lb:           fo,
    pump_rated_displacement_bpd:  ratedBpd,
    // Professional: the card. What the string and the barrel actually do.
    design_static_stretch_in:     staticStretchIn,
    design_plunger_stroke_in:     design.plungerStrokeIn,
    design_pprl_lb:               design.pprlLb,
    design_mprl_lb:               design.mprlLb,
    design_prhp_hp:               design.prhp,
    design_produced_bpd:          design.producedBpd,
    // Expert: what the card hides, and what refuses the design.
    balance_moment_in_lb:         balance.momentInLb,
    balance_peak_torque_in_lb:    balance.peakTorqueInLb,
    balance_cbe_lb:               balance.counterbalanceEffectLb,
    stress_worst_loading_pct:     design.worstSection.loadingPct,
    diag_plunger_stroke_in:       diag.plungerStrokeIn,
    diag_pump_load_max_lb:        diag.pumpLoadRangeLb[1],
    _aux: {
      string: {
        lengthFt: string.lengthFt,
        weightAirLb: string.weightAirLb,
        buoyancy: string.buoyancy,
        erInPerLb: string.erInPerLb,
        weightLbPerFt: string.weightLbPerFt,
        grade: string.grade,
        warnings: string.warnings,
        sectionWeightSources: string.sections.map((s) => [s.label, s.weightSource]),
        waveSpeedFtS: waveSpeed,
        n0Spm: freq.n0Spm,
        nPrimeSpm: freq.nPrimeSpm,
        taperFactor: freq.taperFactor,
        uniform: freq.uniform,
        // 245,000 / L is the constant every text quotes for a uniform string.
        n0TimesLengthFtSpm: freq.n0Spm * string.lengthFt,
        scanGrid,
      },
      unit: {
        geometry: geom,
        steps: CAP.kinSteps,
        strokeIn,
        upstrokeFraction: kin.upstrokeFraction,
        torqueFactorMaxIn,
        crankAngleAtBottomRad: kin.crankAngleAtBottomRad,
        // A conventional unit is not a sine wave: this is how far from a half
        // the upstroke is.
        upstrokeMinusHalf: kin.upstrokeFraction - 0.5,
        // and the stroke is NOT the naive 2 (a/c) r
        naive2ArOverC: (2 * CAP.aIn * CAP.rIn) / CAP.cIn,
        strokeMinusNaiveIn: strokeIn - (2 * CAP.aIn * CAP.rIn) / CAP.cIn,
      },
      plungerStroke: {
        surfaceStrokeIn: strokeIn,
        staticRuleSpIn: strokeIn - staticStretchIn,
        waveEquationSpIn: design.plungerStrokeIn,
        overtravelOverStaticRuleIn: design.plungerStrokeIn - (strokeIn - staticStretchIn),
        overtravelOverStaticRulePct:
          ((design.plungerStrokeIn - (strokeIn - staticStretchIn))
            / (strokeIn - staticStretchIn)) * 100,
        spOverS: design.groups.spOverS,
      },
      cardSubsampling: {
        marchStepsPerCycle: dyn.samples,
        cardPointsKept: dyn.surfaceCard.length,
        cardPointsAtFullResolution: dynFull.surfaceCard.length,
        gradedPprlLb: dyn.prlPeakLb,
        fullResolutionPprlLb: dynFull.prlPeakLb,
        pprlUnderstatedLb: dynFull.prlPeakLb - dyn.prlPeakLb,
        gradedMprlLb: dyn.prlMinLb,
        fullResolutionMprlLb: dynFull.prlMinLb,
        mprlOverstatedLb: dyn.prlMinLb - dynFull.prlMinLb,
        mprlOverstatedRatio: dyn.prlMinLb / dynFull.prlMinLb,
        gradedLoadRangeLb: dyn.prlPeakLb - dyn.prlMinLb,
        fullResolutionLoadRangeLb: dynFull.prlPeakLb - dynFull.prlMinLb,
        gradedWorkInLbPerCycle: dyn.workInLbPerCycle,
        fullResolutionWorkInLbPerCycle: dynFull.workInLbPerCycle,
        // The tension envelope is taken over EVERY step of the same march, so
        // it disagrees with the subsampled peak inside one call.
        envelopeTopDepthFt: envTop.depthFt,
        envelopeTopMaxLb: envTop.maxLb,
        envelopeTopPlusBuoyedAboveLb: envTop.maxLb + buoyedAboveEnvTop,
        envelopeMinusReportedPprlLb: envTop.maxLb + buoyedAboveEnvTop - dyn.prlPeakLb,
      },
      gridSensitivity: {
        shippedDefaultNodes: 120,
        byNodes,
        plungerStrokeSpreadIn:
          Math.max(...byNodes.map((r) => r.plungerStrokeIn))
          - Math.min(...byNodes.map((r) => r.plungerStrokeIn)),
        pprlSpreadLb:
          Math.max(...byNodes.map((r) => r.prlPeakLb))
          - Math.min(...byNodes.map((r) => r.prlPeakLb)),
        mprlSpreadLb:
          Math.max(...byNodes.map((r) => r.prlMinLb))
          - Math.min(...byNodes.map((r) => r.prlMinLb)),
        notPeriodicAt: byNodes.filter((r) => !r.converged).map((r) => r.nodes),
      },
      fillage: {
        designFillage: CAP.fillage,
        warningThreshold: 0.85,
        designWarningCodes: design.warnings.map((w) => w.code),
        belowCliffFillage: CAP.auxFillageBelowCliff,
        belowCliffWarningCodes: runBelowCliff.design.warnings.map((w) => w.code),
        belowCliffProducedBpd: runBelowCliff.design.producedBpd,
        producedBpdDifferenceAcrossTheCliff:
          design.producedBpd - runBelowCliff.design.producedBpd,
        // What the pound-down state does to the plunger stroke and therefore to
        // the swept volume it is then charged fillage against.
        fullBarrel,
        designBarrel,
        lowBarrel,
        sweptTimesFillageOverFullBarrelAtDesign:
          (designBarrel.sweptBpd * CAP.fillage) / fullBarrel.sweptBpd,
        sweptTimesFillageOverFullBarrelAtLowFillage:
          (lowBarrel.sweptBpd * CAP.auxFillageLow) / fullBarrel.sweptBpd,
      },
      production: {
        ratedBpd: design.ratedBpd,
        sweptBpd: design.sweptBpd,
        producedBpd: design.producedBpd,
        producedOverRated: design.producedBpd / design.ratedBpd,
        plungerAreaIn2: design.plungerAreaIn2,
      },
      balance: {
        momentInLb: balance.momentInLb,
        peakTorqueInLb: balance.peakTorqueInLb,
        counterbalanceEffectLb: balance.counterbalanceEffectLb,
        balanced: balance.balanced,
        // The textbook ideal a learner is likely to quote instead.
        textbookCbeLb: string.weightFluidLb + fo / 2,
        cbeMinusTextbookLb: balance.counterbalanceEffectLb - (string.weightFluidLb + fo / 2),
        // The counterbalance effect is NOT the moment over the front arm.
        momentOverFrontArmLb: balance.momentInLb / CAP.aIn,
        // What balanceUnit returns when the two inputs runRodPumpDesign
        // discards are dropped.
        peakTorqueIgnoringUnbalanceInLb: balanceIgnoring.peakTorqueInLb,
        peakTorqueDifferenceInLb: balanceIgnoring.peakTorqueInLb - balance.peakTorqueInLb,
        peakTorqueDifferencePct:
          ((balanceIgnoring.peakTorqueInLb - balance.peakTorqueInLb)
            / balance.peakTorqueInLb) * 100,
        momentIgnoringUnbalanceInLb: balanceIgnoring.momentInLb,
        cbeIgnoringUnbalanceLb: balanceIgnoring.counterbalanceEffectLb,
      },
      ignoredInputs: {
        // runRodPumpDesign destructures kin, structuralUnbalanceLb and
        // crankOffsetDeg and then never reads any of them.
        designIsIdenticalWithoutUnbalanceAndOffset:
          runNoUnbalance.design.pprlLb === design.pprlLb
          && runNoUnbalance.design.mprlLb === design.mprlLb
          && runNoUnbalance.design.plungerStrokeIn === design.plungerStrokeIn
          && runNoUnbalance.design.prhp === design.prhp
          && runNoUnbalance.design.producedBpd === design.producedBpd
          && runNoUnbalance.design.worstSection.loadingPct === design.worstSection.loadingPct,
        structuralUnbalanceSuppliedLb: CAP.structuralUnbalanceLb,
        crankOffsetSuppliedDeg: CAP.crankOffsetDeg,
        // and omitting the balance leaves the RP 11L torque group at zero
        torqueGroupWithBalance: design.groups.torqueGroup,
        torqueGroupWithoutBalance: runNoBalance.design.groups.torqueGroup,
        torquePctWithoutBalance: runNoBalance.design.rating.torquePct,
      },
      groups: design.groups,
      stresses: design.stresses,
      worstSection: design.worstSection,
      goodman: {
        gradeMinTensilePsi: string.grade.minTensilePsi,
        serviceFactor: CAP.serviceFactor,
        worstLabel: design.worstSection.label,
        worstMaxStressPsi: design.worstSection.maxStressPsi,
        worstMinStressPsi: design.worstSection.minStressPsi,
        worstAllowablePsi: design.worstSection.allowablePsi,
        worstLoadingPct: design.worstSection.loadingPct,
        criticalServiceFactor,
        // The two deeper sections go into compression at the bottom of the
        // stroke, which is what pulls their Goodman allowable down.
        sectionsInCompression: design.stresses
          .filter((s) => s.minStressPsi < 0)
          .map((s) => [s.label, s.minStressPsi]),
      },
      rating: {
        designation: unitRating,
        structuralPct: design.rating.structuralPct,
        torquePct: design.rating.torquePct,
        strokePct: design.rating.strokePct,
      },
      roundTrip: {
        harmonics: diag.harmonics,
        predictedPlungerStrokeIn: design.plungerStrokeIn,
        diagnosedPlungerStrokeIn: diag.plungerStrokeIn,
        plungerStrokeGapIn: diag.plungerStrokeIn - design.plungerStrokeIn,
        fluidLoadAssumedLb: fo,
        diagnosedPumpLoadMaxLb: diag.pumpLoadRangeLb[1],
        diagnosedPumpLoadMinLb: diag.pumpLoadRangeLb[0],
        pumpLoadMaxGapLb: diag.pumpLoadRangeLb[1] - fo,
        pumpLoadMaxGapPct: ((diag.pumpLoadRangeLb[1] - fo) / fo) * 100,
        kappaPerS: diag.kappaPerS,
      },
      speedSweep,
      warnings: design.warnings,
      errors: run.errors,
      constants: {
        pumpConstant: RP.PUMP_CONSTANT,
        in3PerBbl: RP.IN3_PER_BBL,
        couplingAllowance: CAT.COUPLING_ALLOWANCE,
        steelAcousticVelocityFtS: CAT.steelAcousticVelocityFtS(),
        rodAcousticVelocityFtS: CAT.ROD_ACOUSTIC_VELOCITY_FT_S,
      },
    },
  };
}

// Absolute tolerances, in each field's own units. Sized at about two parts in
// ten million of the value, which admits an honest seven significant figure
// rounding (worst case five parts in a hundred million) with four times the
// headroom and nothing like enough room to admit a different answer.
const TOL = {
  string_kr_lb_per_in: 4.8e-5,
  string_buoyed_weight_lb: 2.4e-3,
  string_natural_freq_spm: 9.4e-6,
  unit_stroke_in: 2.5e-5,
  pump_fluid_load_lb: 8.8e-4,
  pump_rated_displacement_bpd: 7.3e-5,
  design_static_stretch_in: 3.7e-6,
  design_plunger_stroke_in: 2.3e-5,
  design_pprl_lb: 4.6e-3,
  design_mprl_lb: 6.4e-4,
  design_prhp_hp: 4.6e-6,
  design_produced_bpd: 5.1e-5,
  balance_moment_in_lb: 1.3e-1,
  balance_peak_torque_in_lb: 1.2e-1,
  balance_cbe_lb: 3.0e-3,
  stress_worst_loading_pct: 2.1e-5,
  diag_plunger_stroke_in: 2.3e-5,
  diag_pump_load_max_lb: 9.8e-4,
};

const TIER = {
  string_kr_lb_per_in: 'beginner',
  string_buoyed_weight_lb: 'beginner',
  string_natural_freq_spm: 'beginner',
  unit_stroke_in: 'beginner',
  pump_fluid_load_lb: 'beginner',
  pump_rated_displacement_bpd: 'beginner',
  design_static_stretch_in: 'intermediate',
  design_plunger_stroke_in: 'intermediate',
  design_pprl_lb: 'intermediate',
  design_mprl_lb: 'intermediate',
  design_prhp_hp: 'intermediate',
  design_produced_bpd: 'intermediate',
  balance_moment_in_lb: 'advanced',
  balance_peak_torque_in_lb: 'advanced',
  balance_cbe_lb: 'advanced',
  stress_worst_loading_pct: 'advanced',
  diag_plunger_stroke_in: 'advanced',
  diag_pump_load_max_lb: 'advanced',
};

const UNIT = {
  string_kr_lb_per_in: 'lb/in',
  string_buoyed_weight_lb: 'lbf',
  string_natural_freq_spm: 'spm',
  unit_stroke_in: 'in',
  pump_fluid_load_lb: 'lbf',
  pump_rated_displacement_bpd: 'bbl/d',
  design_static_stretch_in: 'in',
  design_plunger_stroke_in: 'in',
  design_pprl_lb: 'lbf',
  design_mprl_lb: 'lbf',
  design_prhp_hp: 'hp',
  design_produced_bpd: 'bbl/d',
  balance_moment_in_lb: 'in-lb',
  balance_peak_torque_in_lb: 'in-lb',
  balance_cbe_lb: 'lbf',
  stress_worst_loading_pct: 'percent',
  diag_plunger_stroke_in: 'in',
  diag_pump_load_max_lb: 'lbf',
};

const V = capstoneValues();
const fields = Object.keys(TIER).map((k) => [TIER[k], k, V[k], TOL[k]]);
fs.writeFileSync('/root/pd-wip-rodpump/fields.json', JSON.stringify(fields, null, 1));
for (const [t, k, v, tol] of fields) {
  console.log(`${t.padEnd(13)} ${k.padEnd(28)} ${String(v).padEnd(22)} ${UNIT[k].padEnd(8)} (tol ${tol})`);
}
console.log('\naux:', JSON.stringify(V._aux, null, 1));
