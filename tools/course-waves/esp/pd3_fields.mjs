// The PD3 capstone (Electrical Submersible Pumps), and the eighteen graded
// fields derived from it by running the engines. Nothing here is typed from a
// lesson, a chart, a vendor table or the catalog: every graded number below is
// a return value of engines/production/espPump.js, espDesign.js or
// espMotorCable.js.
//
// Every condition below differs from the ones esp_cases.json publishes, which
// is the DR2 rule: design the capstone's conditions BEFORE writing the lessons,
// so the tier can teach on the published case and grade on this one. The
// golden's competing value is named in a trailing comment on every line of CAP.
//
// UNITS. Field units throughout, as all three engine headers state: pressures
// psia (never psig), stock-tank oil stb/d, in-situ rate through the pump bbl/d
// (which is what espPump and espDesign both use), gas scf/d, depth and head ft,
// temperature degF, power hp and kW, current A, voltage V, frequency Hz,
// density lb/ft3, gradient psi/ft. Nothing here is SI.
//
// ---------------------------------------------------------------------------
// WHY THE TIERS SPLIT WHERE THEY DO
//
// Not by a guess about what feels basic. The extraction shipped ESP as THREE
// modules with hard seams, and each module's outputs are the next module's
// inputs, so the seams are already a curriculum:
//
//   espPump.js        ONE STAGE. A curve fitted to vendor points, its best
//                     efficiency point, and what that stage does at a rate and
//                     a drive frequency. Nothing about a well is in here.
//   espDesign.js      THE DESIGN. Intake pressure, what the produced stream
//                     turns into at intake conditions, what a separator takes
//                     out, the gradient of what is left, total dynamic head,
//                     the stack that makes it, and the shaft power.
//   espMotorCable.js  THE ELECTRICAL SYSTEM. Current at load, what the cable
//                     loses carrying it, and what has to be present at surface.
//
// So: ASSOCIATE owns the stage, because a stage curve is the whole of the
// simplest layer and every later number is a scaling of it. It reads that stage
// at a duty and on a fluid that are its OWN stated conditions and are graded
// nowhere, which is what keeps the tier honest: espPump's header says there is
// nothing about a well in this layer, and borrowing the well's intake rate to
// read it would both contradict that and hand the next tier its answers. See
// CAP.dutyQBpd. PROFESSIONAL owns
// the design chain, because that is the design. EXPERT owns everything the
// sizing report does not print: the shaft power it implies, the current and
// the switchboard voltage that shaft power implies, and the same stage curve
// read BACKWARDS against a surveillance record, which is the only way a design
// is ever found to be wrong. The shaft power is deliberately placed at the top
// of the Expert tier rather than the bottom of Professional, because it is the
// hinge: it is the last number espDesign produces and the first number
// espMotorCable consumes, and a learner who cannot carry it across the seam has
// not got an installation, only a pump.
//
// ---------------------------------------------------------------------------
// THE WELL: OKARI-9, and what was tuned into it
//
// A gassy, high-water-cut oil well on a variable speed drive, with the pump set
// 650 ft above the perforations and a 562-series stage whose vendor curve was
// published at 50 Hz. Five things were tuned into it. Every one is verified
// from a PRINTED value in the aux block, not asserted:
//
//   1. THE PUMP IS BEING RUN FASTER THAN ITS PUBLISHED CURVE. The vendor
//      published at 50 Hz and the design runs 57 Hz, so the affinity ratio is
//      1.14: every rate is mapped BACK by dividing by 1.14 before the curve is
//      read, and every head is mapped forward by 1.14 squared. The DESIGN duty
//      of 4181.40584 bbl/d reads the published curve at 3667.90 bbl/d; a
//      learner who multiplies where the engine divides reads it at 4766.80 and
//      lands 1098.90 bbl/d away. The ASSOCIATE tier reads the same stage at its
//      own stated duty of 4400 bbl/d, which lands at 3859.65 bbl/d divided and
//      at 5016 bbl/d multiplied, the second of those 116 bbl/d PAST the end of
//      the published data, so on that tier the same error walks straight into
//      finding (i). This is also why refHz is a capstone condition and not
//      scenery.
//
//   2. THE GAS SITS ON THE GAS-HANDLER LINE. One fifth of what arrives at the
//      intake is free gas by volume. A 55 percent separator halves that, and
//      what is left is 0.1040, just over gasHandling's 0.10 standard-pump
//      limit, so the verdict is gasHandler. The aux block bisects the separator
//      efficiency that flips the verdict to standard and it is 0.5692: this
//      installation is 1.9 points of separator efficiency away from a different
//      piece of equipment on the string.
//
//   3. THE STAGE COUNT ROUNDS UP BY ALMOST A WHOLE STAGE. The discharge
//      pressure is tuned so that the head required is 165.009 stages, which
//      stageCount rounds up to 166. The stack therefore makes 22.123 ft more
//      head than the design asked for, 99.09 percent of one stage. That is what
//      makes finding (ii) below visible rather than academic.
//
//   4. THE CABLE IS ONE DEGREE FROM THE NEXT CONDUCTOR SIZE. At 8420 ft and
//      195 degF the 1 AWG conductor drops 4.9917 percent against a 5 percent
//      limit. The aux block shows selectCable returning 1 AWG here and 1/0 at
//      8440 ft, and the same 1 AWG conductor going over the limit at 196 degF.
//      Fourteen feet of cable, or one degree of well temperature, changes the
//      answer.
//
//   5. THE DUTY IS CLOSE ENOUGH TO THE END OF THE CURVE THAT AN ORDINARY VSD
//      TURNDOWN RUNS OFF IT. Slowing the drive raises the equivalent reference
//      rate, so turning this well DOWN pushes the duty UP the curve. The aux
//      block bisects the frequency at which the duty leaves the published range
//      and it is 42.67 Hz. Below that the engine keeps answering. See below.
//
// ---------------------------------------------------------------------------
// THE DEFECT THE ORACLE RECORDS, AND WHERE THIS CAPSTONE STANDS ON IT
//
// oracle_esp.py does not keep a prose defect list the way oracle_nodal.py does.
// What it does instead is RECORD the behaviour in the golden, and the clearest
// thing it records is this:
//
//   (i) stagePerformance EXTRAPOLATES BOTH POLYNOMIAL FITS WITHOUT BOUND, and
//       `inRange: false` is a flag on the answer rather than a refusal. The
//       golden's own affinity block publishes the row qBpd 3200 at 40 Hz, whose
//       equivalent reference rate is 4800 bbl/d against a curve published only
//       to 3500: the engine returns a head of 0.052063 ft per stage, an
//       efficiency of 0.2576 and a brake power of 0.004291 hp, all of them
//       cubic extrapolation 1300 bbl/d past the end of the data, and none of
//       them refused. stageCount will then divide a total dynamic head by that
//       0.052 ft. EXPOSED HERE AS THE CENTRE OF THE CAPSTONE, on a real design
//       rather than on a bare stage reading: the aux block walks this well's
//       drive frequency down and prints the stage count the engine returns at
//       each rung. The design at 57 Hz is 166 stages. At 40 Hz, the lowest
//       frequency the golden itself tests, the engine returns 926 stages for
//       the same duty and the same total dynamic head, off a stage making 3.980
//       ft against the design stage's 22.326 ft, with inRange false and three
//       warnings but no refusal. That is the size of it in engineering units:
//       760 stages more than the design, five and a half times the pump, on a
//       duty 326.76 bbl/d past the end of the data. The engine does finally
//       refuse at 36.10 Hz, where the extrapolated head turns negative and
//       stageCount returns NaN, so the guard exists; it just sits six and a half
//       Hz below where the answers stopped meaning anything.
//
// Four further findings, all quantified in aux, none of them oracled at all
// because oracle_esp.py does not exercise the functions they live in:
//
//   (ii) sizePump RETURNS TWO POWERS FOR ONE PUMP. `shaftHp` is brakeHp
//       computed on the TOTAL DYNAMIC HEAD, while `stack.bhpTotal` is the
//       per-stage brake power times the stage count, which is brake power on
//       the head the stack ACTUALLY MAKES. Because stageCount rounds up they
//       differ by exactly the rounding margin: 0.808 hp on this well, 0.600
//       percent. Every downstream electrical number is computed from the
//       smaller of the two. On a well tuned the other way (a head requirement
//       just under a whole stage) the gap would be near zero, which is why it
//       has never been noticed.
//
//   (iii) THE DERATE STOPS AT THE MODULE SEAM. sizePump's motorLoad divides by
//       `nameplateHp * derate` and reports this motor as 1.0195 loaded, which
//       fires motorOverloaded. motorCurrent, one module over, divides by
//       nameplateHp alone and reports 0.8971, and it is THAT load fraction the
//       amps, the voltage drop, the kVA and the cable selection are all built
//       on. Both are defensible readings (a thrust derate reduces usable
//       horsepower, not the current at a given shaft load) but the two numbers
//       are 12.2 points apart and nothing in either return says which question
//       it answered.
//
//   (iv) TWO WATER GRADIENTS IN ONE PACKAGE. gradientFromDensity divides by
//       144, so water at 62.4 lb/ft3 gives 0.433333 psi/ft, while
//       PSI_PER_FT_SG is 0.433 and diagnoseOperation rebuilds its gradient from
//       that constant times the specific gravity. The two disagree by 0.077
//       percent unless the caller launders the specific gravity back through
//       0.433, which is what the golden's oracle silently does and what this
//       capstone does too. Taking the natural definition instead (density over
//       62.4) moves this well's total dynamic head by 2.836 ft.
//
//   (v) THE UNDER-CURVE MESSAGE ROUNDS ONTO ITS OWN THRESHOLD. diagnoseOperation
//       fires underCurve below a head ratio of 0.85 and then prints the ratio
//       with toFixed(0). This well's survey reads 0.8461, so the flag is right
//       and its message says "making 85 percent of the head its curve says it
//       should", which is the number the test is against. Cosmetic, and printed
//       in aux so the tier can point at it.
//
// ---------------------------------------------------------------------------
// WHY THE STAGE CURVE IS FITTED FROM VENDOR POINTS
//
// espPump's header offers exactly two honest routes to a stage curve: a least
// squares fit through points off a vendor's published curve, or a transparent
// reference MODEL from four named parameters. The catalog ships four reference
// models and the goldens publish two of them in full, specs, best efficiency
// points and sampled heads. Quoting one of those back would make this capstone
// a lookup of espCatalog.js, which is the single easiest way to ruin it. So the
// capstone takes the vendor route with six of its own points, none of which is
// one of the golden vendor curve's five, and every graded stage number below is
// therefore a return of fitStageCurve, bepOf or stagePerformance rather than a
// catalog entry read back.
const R = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const P = await import(`${R}/engines/production/espPump.js`);
const D = await import(`${R}/engines/production/espDesign.js`);
const E = await import(`${R}/engines/production/espMotorCable.js`);
const C = await import(`${R}/engines/production/data/espCatalog.js`);
import * as fs from 'fs';

export const CAP = {
  // ---- the stage: six points off the vendor's 50 Hz curve ------------------
  // A 562-series pump published for a 50 Hz market. Six points, none of them at
  // one of the golden vendor curve's rates and none of them carrying one of its
  // heads or efficiencies.
  stagePoints: [                                             // golden vendorCurve points:
    { qBpd: 1750, headFt: 22.6, efficiencyPct: 46.5 },       //   1500 bbl/d, 32.0 ft, 55 pct
    { qBpd: 2400, headFt: 21.4, efficiencyPct: 60.5 },       //   2000 bbl/d, 30.5 ft, 68 pct
    { qBpd: 3050, headFt: 19.6, efficiencyPct: 68.5 },       //   2500 bbl/d, 28.0 ft, 74 pct
    { qBpd: 3700, headFt: 17.0, efficiencyPct: 71.0 },       //   3000 bbl/d, 24.0 ft, 72 pct
    { qBpd: 4350, headFt: 13.4, efficiencyPct: 66.5 },       //   3500 bbl/d, 19.0 ft, 65 pct
    { qBpd: 4900, headFt:  9.2, efficiencyPct: 55.5 },       //   (the golden curve has five points, not six)
  ],
  curveRefHz: 50,           // golden: every curve in esp_cases.json is published at 60.
                            // The world publishes ESP curves at 50 Hz or at 60
                            // and nowhere else, so 50 is the only honest
                            // alternative and it differs from the golden's
                            // refHz and from the function's default. The
                            // NUMERAL 50 does appear in the golden, but as a
                            // DRIVE frequency (highWaterCut runs a 60 Hz curve
                            // at 50 Hz), which is the other side of the affinity
                            // map and a different quantity.

  // NOT capstone conditions. fitStageCurve's own defaults for the polynomial
  // degrees, which the golden vendor fit also uses. Unlike PD1's nGrid these
  // cannot be quarantined from the graded fields, because a least squares fit
  // has to have a degree; what keeps the graded stage numbers off the golden is
  // that all six POINTS differ, and the sweep in the gate section confirms it.
  headDegree: 3,            // golden vendorCurve: 3 (the reference models are cut at 2)
  effDegree: 3,             // golden vendorCurve: 3

  // ---- the drive ----------------------------------------------------------
  designHz: 57,             // golden affinity: 40, 50, 60, 70; golden designs: 60 and 50

  // ---- the ASSOCIATE tier's own duty, and why it is its own ---------------
  // THE ASSOCIATE TIER READS A STAGE, NOT A WELL, AND ITS DUTY MUST NOT BE THE
  // WELL'S. Until 2026-09-04 the three Associate stage reads below were taken
  // at gas.pumpIntakeBpd on a specific gravity derived from
  // gas.mixtureDensityLbFt3, which are graded fields 10 and 9 of the
  // PROFESSIONAL tier. That made the two quantities CAPSTONE CONDITIONS of the
  // Associate prompt, because a stage cannot be read at a duty without a duty,
  // and stating them handed a Professional learner two of their own six
  // answers verbatim. dc-wavekit/promptleak.py reported it as an exact hit at
  // 0.00 tolerances. There is no rounding that escapes it either: field 4 is
  // graded to 1.1e-5 ft, which pins the duty rate harder than field 10's own
  // 2.1e-3 bbl/d does, and any specific gravity precise enough for field 6
  // fixes the mixture density to within field 9's 2.6e-5 lb/ft3.
  //
  // The fix is not a rounding, it is a DECOUPLING. espPump's own header says
  // the stage layer has nothing about a well in it, so the Associate tier now
  // reads the stage at a duty and on a fluid that are stated conditions of
  // ITS OWN and are graded nowhere. The Professional tier still has to derive
  // the intake rate and the mixture density from the produced stream, which is
  // the question it was always meant to ask. Nothing downstream moves: the
  // design chain below still runs at gas.pumpIntakeBpd on the derived sg, so
  // graded fields 7 through 18 are unchanged to the last digit.
  //
  // 4400 bbl/d is chosen so the affinity trap gets SHARPER rather than softer.
  // Divided by the 1.14 ratio it reads the published curve at 3859.65 bbl/d,
  // comfortably inside the 1750 to 4900 data and above the best efficiency
  // rate, so the head fit is falling there. MULTIPLIED by it instead, which is
  // the error the tier exists to catch, it reads at 5016 bbl/d, 116 bbl/d PAST
  // the end of the published data, where the cubic keeps answering and nothing
  // refuses. The trap now lands the learner in finding (i) rather than merely
  // somewhere wrong.
  dutyQBpd: 4400,           // golden design intake rates: 4098.4 and 1284.096 bbl/d;
                            // golden vendor curve rates: 1500, 2000, 2500, 3000, 3500.
                            // Graded nowhere, and 218.59 bbl/d from field 10.
  dutySg: 0.82,             // golden design specific gravities: 0.86285 and 0.98857.
                            // Given DIRECTLY rather than derived from a density, so
                            // it back-derives nothing: 0.82 x 62.352 is 51.129 lb/ft3,
                            // 1.448 lb/ft3 clear of graded field 9.

  // ---- the produced stream and its PVT at intake conditions ---------------
  qoStbd: 1136,             // golden designs: 1200 and 400 stb/d
  wct: 0.66,                // golden: 0.5 and 0.9
  gorScfStb: 1320,          // golden: 500 and 200
  pvt: {
    rs: 415,                // golden: 300 and 180 scf/stb
    bo: 1.285,              // golden: 1.2 and 1.12 rb/stb
    bw: 1.037,              // golden: 1.02 and 1.01 rb/stb
    bg: 0.00094,            // golden: 0.0012 and 0.0018 rb/scf
    rhoO: 46.7,             // golden: 48.0 and 51.0 lb/ft3
    rhoW: 65.3,             // golden: 64.0 and 65.0 lb/ft3
    rhoG: 5.4,              // golden: 6.0 and 4.2 lb/ft3
  },
  separatorEfficiency: 0.55, // golden: 0.7 and 0.0

  // NOT a capstone condition: DEFAULT_GAS_LIMITS, which the golden also runs
  // on. They are operating guidance rather than a property of this well, and no
  // graded field is a limit; only the aux verdict and the flip-point bisection
  // use them.
  gasLimits: D.DEFAULT_GAS_LIMITS, // golden: the same defaults, 0.10 and 0.25

  // ---- the completion and the two pressures that define the head ----------
  pwfPsia: 1385,            // golden: 1500 and 1100 psia
  perfTvdFt: 8390,          // golden: 7500 and 6200 ft
  pumpTvdFt: 7740,          // golden: 7000 and 5800 ft
  annulusGradPsiPerFt: 0.274, // golden: 0.32 and 0.42 psi/ft
  // Tuned so the head required is 165.009 stages, which stageCount rounds up to
  // 166: the rounding margin is 99.1 percent of one stage, which is what makes
  // finding (ii) visible. (This comment read 166.009 until 2026-09-04, against
  // the file's own top matter and against aux.sizing.stagesExact. Comment only,
  // nothing depended on it.)
  pDischargePsia: 2552,     // golden: 3200 and 2600 psia

  // ---- the motor ----------------------------------------------------------
  nameplateHp: 150,         // golden designs: 250 and 200 hp; golden electrical: 250 and 100
  nameplateVolts: 2000,     // golden electrical: 2400 and 1300 V. The numeral
                            // 2000 appears in the golden as a vendor curve RATE
                            // in bbl/d, which is not a voltage.
  nameplateAmps: 48,        // golden electrical: 67 and 49 A. The numeral 48
                            // appears in the golden as an oil density in lb/ft3,
                            // which is not a current.
  motorEfficiency: 0.885,   // golden publishes none; sizePump's own default is 0.85
  thrustDeratePct: 12,      // golden passes none at all

  // ---- the cable ----------------------------------------------------------
  // The candidate list is the shipped AWG table, which is copper physics rather
  // than a tuned condition; the conductor the graded run uses is the one
  // selectCable PICKS, and it picks 1 AWG at 0.1264 ohms per 1000 ft, which is
  // neither of the two resistances the golden's electrical cases run on.
  cableLengthFt: 8420,      // golden: 7200 and 6000 ft
  cableTempF: 195,          // golden: 180 and 210 degF
  powerFactor: 0.87,        // golden: 0.85 and 0.88
  maxDropPct: 5,            // golden: none, the goldens never call selectCable.
                            // This is also selectCable's own default and the
                            // ordinary field limit, so it is stated rather than
                            // tuned; what is tuned is the length and the
                            // temperature that put the answer 14 ft from
                            // flipping.

  // ---- the surveillance record, read against the same curve backwards -----
  surveyQBpd: 3960,         // golden diagnoses nothing: diagnoseOperation is unoracled
  surveyIntakePsia: 1142,   // golden intake pressures: 1340 and 932 psia
  surveyDischargePsia: 2344, // golden discharge pressures: 3200 and 2600 psia
  surveyAmps: 41.5,         // golden currents: 33.5 and 38.22 A

  // ---- the turndown ladder, aux only --------------------------------------
  // NOT capstone conditions. The frequencies the aux block walks to size
  // finding (i). Three of them (60, 50, 40) are deliberately the golden's own
  // tested frequencies, 40 being its lowest, so the ladder can be read straight
  // against the golden's affinity block. No graded field uses any rung of this
  // ladder: the graded design runs at CAP.designHz and nowhere else.
  ladderHz: [60, 57, 54, 50, 46, 44, 43, 42, 41, 40, 38, 36],
};

// A deterministic bisection used three times in the aux block, always on an
// engine return and always with a fixed iteration count so the file is
// byte-identical every run.
const bisect = (lo, hi, predicate, iterations = 60) => {
  let a = lo;
  let b = hi;
  for (let i = 0; i < iterations; i += 1) {
    const m = (a + b) / 2;
    if (predicate(m)) a = m; else b = m;
  }
  return (a + b) / 2;
};

export function capstoneValues() {
  // --- the stage -----------------------------------------------------------
  const curve = P.fitStageCurve({
    points: CAP.stagePoints,
    refHz: CAP.curveRefHz,
    headDegree: CAP.headDegree,
    effDegree: CAP.effDegree,
  });
  const bep = P.bepOf(curve);

  // The Associate tier's stage read, at ITS OWN duty and on ITS OWN fluid. This
  // deliberately does NOT touch the design chain below: see CAP.dutyQBpd.
  const dutyStage = P.stagePerformance({
    curve, qBpd: CAP.dutyQBpd, hz: CAP.designHz, specificGravity: CAP.dutySg,
  });

  // --- the design chain, in the order espDesign's header walks it -----------
  const stream = D.intakeStream({
    qoStbd: CAP.qoStbd, wct: CAP.wct, gorScfStb: CAP.gorScfStb, pvt: CAP.pvt,
  });
  const gas = D.gasHandling({
    stream, separatorEfficiency: CAP.separatorEfficiency, limits: CAP.gasLimits,
  });
  const pIntake = D.intakePressure({
    pwfPsia: CAP.pwfPsia, perfTvdFt: CAP.perfTvdFt, pumpTvdFt: CAP.pumpTvdFt,
    annulusGradPsiPerFt: CAP.annulusGradPsiPerFt,
  });
  // The gradient of what the pump ACTUALLY SWALLOWS, which is heavier than the
  // full stream because the separator took gas out and lighter than the liquid
  // because it did not take all of it.
  const gradient = D.gradientFromDensity(gas.mixtureDensityLbFt3);
  // The specific gravity is laundered back through PSI_PER_FT_SG so that
  // diagnoseOperation, which rebuilds its gradient from that constant, reads
  // the same column the head conversion used. See finding (iv).
  const sg = gradient / D.PSI_PER_FT_SG;
  const tdh = D.totalDynamicHead({
    pIntakePsia: pIntake, pDischargePsia: CAP.pDischargePsia, gradientPsiPerFt: gradient,
  });

  const sized = D.sizePump({
    curve, qBpd: gas.pumpIntakeBpd, tdhFt: tdh.tdhFt, hz: CAP.designHz,
    specificGravity: sg, nameplateHp: CAP.nameplateHp,
    motorEfficiency: CAP.motorEfficiency, thrustDeratePct: CAP.thrustDeratePct,
  });

  // --- the electrical system, on the conductor the engine picks ------------
  const selection = E.selectCable({
    cables: C.CABLE_SIZES, maxDropPct: CAP.maxDropPct, shaftHp: sized.shaftHp,
    nameplateHp: CAP.nameplateHp, nameplateAmps: CAP.nameplateAmps,
    nameplateVolts: CAP.nameplateVolts, powerFactor: CAP.powerFactor,
    lengthFt: CAP.cableLengthFt, cableTempF: CAP.cableTempF,
  });
  const surface = selection.requirement;

  // --- the same curve read backwards, against a surveillance record --------
  const diag = D.diagnoseOperation({
    curve, stages: sized.stages, hz: CAP.designHz, specificGravity: sg,
    measured: {
      qBpd: CAP.surveyQBpd, pIntakePsia: CAP.surveyIntakePsia,
      pDischargePsia: CAP.surveyDischargePsia, amps: CAP.surveyAmps,
    },
    nameplateAmps: CAP.nameplateAmps,
  });

  // --- aux: finding (i), the turndown ladder -------------------------------
  const ladder = CAP.ladderHz.map((hz) => {
    const s = P.stagePerformance({ curve, qBpd: gas.pumpIntakeBpd, hz, specificGravity: sg });
    const stages = D.stageCount({ tdhFt: tdh.tdhFt, headPerStageFt: s.headFt });
    // The whole sizing call at the same rung, so the claim that the engine
    // returns a DESIGN off the end of the curve is evidenced rather than
    // asserted: these are the warnings it attaches while doing it.
    const rung = D.sizePump({
      curve, qBpd: gas.pumpIntakeBpd, tdhFt: tdh.tdhFt, hz, specificGravity: sg,
      nameplateHp: CAP.nameplateHp, motorEfficiency: CAP.motorEfficiency,
      thrustDeratePct: CAP.thrustDeratePct,
    });
    return {
      hz, qRefBpd: s.qRefBpd, headPerStageFt: s.headFt, efficiency: s.efficiency,
      stagesReturned: Number.isFinite(stages) ? stages : 'NaN (stageCount refuses a non-positive head)',
      inRange: s.inRange, region: s.region,
      sizePumpWarnings: rung.warnings.map((w) => w.code),
    };
  });
  // The frequency at which the duty leaves the published range, and the one at
  // which the extrapolated head finally turns negative and stageCount refuses.
  const hzLeavesRange = bisect(30, 60, (hz) => !P.stagePerformance(
    { curve, qBpd: gas.pumpIntakeBpd, hz, specificGravity: sg },
  ).inRange);
  const hzHeadTurnsNegative = bisect(30, 60, (hz) => P.stagePerformance(
    { curve, qBpd: gas.pumpIntakeBpd, hz, specificGravity: sg },
  ).headFt <= 0);

  // --- aux: finding (iv) and the gradient a learner picks by mistake -------
  const gradientFullStream = D.gradientFromDensity(stream.mixtureDensityLbFt3);
  const gradientLiquidOnly = D.gradientFromDensity(stream.liquidDensityLbFt3);
  const tdhFullStream = D.totalDynamicHead({
    pIntakePsia: pIntake, pDischargePsia: CAP.pDischargePsia, gradientPsiPerFt: gradientFullStream,
  });
  const tdhLiquidOnly = D.totalDynamicHead({
    pIntakePsia: pIntake, pDischargePsia: CAP.pDischargePsia, gradientPsiPerFt: gradientLiquidOnly,
  });
  const gradientNaiveSg = D.PSI_PER_FT_SG * (gas.mixtureDensityLbFt3 / 62.4);
  const tdhNaiveSg = D.totalDynamicHead({
    pIntakePsia: pIntake, pDischargePsia: CAP.pDischargePsia, gradientPsiPerFt: gradientNaiveSg,
  });

  // --- aux: the separator efficiency that flips the verdict ----------------
  const sepFlip = bisect(0, 1, (e) => D.gasHandling({
    stream, separatorEfficiency: e, limits: CAP.gasLimits,
  }).verdict !== 'standard');

  // --- aux: how close the cable selection is to changing -------------------
  const cableAtLonger = E.selectCable({
    cables: C.CABLE_SIZES, maxDropPct: CAP.maxDropPct, shaftHp: sized.shaftHp,
    nameplateHp: CAP.nameplateHp, nameplateAmps: CAP.nameplateAmps,
    nameplateVolts: CAP.nameplateVolts, powerFactor: CAP.powerFactor,
    lengthFt: 8440, cableTempF: CAP.cableTempF,
  });
  const cableAtHotter = E.selectCable({
    cables: C.CABLE_SIZES, maxDropPct: CAP.maxDropPct, shaftHp: sized.shaftHp,
    nameplateHp: CAP.nameplateHp, nameplateAmps: CAP.nameplateAmps,
    nameplateVolts: CAP.nameplateVolts, powerFactor: CAP.powerFactor,
    lengthFt: CAP.cableLengthFt, cableTempF: 196,
  });
  const lengthAtDropLimit = bisect(7000, 12000, (len) => E.surfaceRequirement({
    shaftHp: sized.shaftHp, nameplateHp: CAP.nameplateHp, nameplateAmps: CAP.nameplateAmps,
    nameplateVolts: CAP.nameplateVolts, powerFactor: CAP.powerFactor,
    lengthFt: len, ohmsPer1000FtAt77F: selection.cable.ohmsPer1000FtAt77F,
    cableTempF: CAP.cableTempF,
  }).dropPct <= CAP.maxDropPct);

  return {
    // Associate: ONE STAGE. What the vendor's curve says, and what one stage
    // does at the duty once the affinity laws have moved it to 57 Hz.
    stage_fit_head_rmse_ft:        curve.headFit.rmse,
    stage_bep_q_bpd:               bep.qBpd,
    stage_bep_head_ft:             bep.headFt,
    stage_head_at_duty_ft:         dutyStage.headFt,
    stage_efficiency_at_duty_frac: dutyStage.efficiency,
    stage_bhp_per_stage_hp:        dutyStage.bhpPerStage,
    // Professional: THE DESIGN. Intake, gas, the gradient of what is swallowed,
    // the head that implies, and the stack that makes it.
    intake_pressure_psia:          pIntake,
    intake_stream_gvf_frac:        stream.gvf,
    pump_mixture_density_lbft3:    gas.mixtureDensityLbFt3,
    pump_intake_bpd:               gas.pumpIntakeBpd,
    tdh_ft:                        tdh.tdhFt,
    design_head_made_ft:           sized.headMadeFt,
    // Expert: WHAT THE SIZING REPORT DOES NOT PRINT. The shaft power that
    // crosses the module seam, the electrical system it forces, and the same
    // curve read backwards against a surveillance record.
    design_shaft_hp:               sized.shaftHp,
    motor_amps_a:                  surface.amps,
    cable_drop_pct:                surface.dropPct,
    surface_kva:                   surface.kva,
    cable_loss_kw:                 surface.lossKw,
    diag_head_ratio_frac:          diag.headRatio,
    _aux: {
      associateDuty: {
        // Everything CAP.dutyQBpd asserts, printed rather than claimed.
        qBpd: CAP.dutyQBpd,
        specificGravity: CAP.dutySg,
        hz: CAP.designHz,
        ratio: dutyStage.ratio,
        qRefBpd: dutyStage.qRefBpd,
        headFt: dutyStage.headFt,
        efficiency: dutyStage.efficiency,
        bhpPerStage: dutyStage.bhpPerStage,
        inRange: dutyStage.inRange,
        region: dutyStage.region,
        overBep: dutyStage.qRefBpd / bep.qBpd,
        headBackToPublishedFrame: dutyStage.headFt / (dutyStage.ratio * dutyStage.ratio),
        // The affinity trap, now landing off the end of the published data.
        qRefIfRatioMisappliedBpd: CAP.dutyQBpd * dutyStage.ratio,
        misappliedPastCurveEndBpd: CAP.dutyQBpd * dutyStage.ratio - curve.qMax,
        misapplied: P.stagePerformance({
          curve, qBpd: CAP.dutyQBpd * dutyStage.ratio * dutyStage.ratio,
          hz: CAP.designHz, specificGravity: CAP.dutySg,
        }),
        // And the decoupling itself, measured. These gaps are the whole point.
        designDutyQBpd: gas.pumpIntakeBpd,
        gapToDesignDutyBpd: CAP.dutyQBpd - gas.pumpIntakeBpd,
        designSg: sg,
        densityImpliedByDutySg: CAP.dutySg * D.PSI_PER_FT_SG * 144,
        gapToGradedDensityLbFt3:
          CAP.dutySg * D.PSI_PER_FT_SG * 144 - gas.mixtureDensityLbFt3,
        designStageHeadFt: sized.stage.headFt,
      },
      stage: {
        source: curve.source, refHz: curve.refHz, qMin: curve.qMin, qMax: curve.qMax,
        headFitDegree: curve.headFit.degree, headFitRmse: curve.headFit.rmse,
        effFitDegree: curve.effFit.degree, effFitRmse: curve.effFit.rmse,
        bep, warnings: curve.warnings,
        dutyRatio: sized.stage.ratio,
        dutyQRefBpd: sized.stage.qRefBpd,
        dutyOverBep: sized.stage.qRefBpd / bep.qBpd,
        dutyRegion: sized.stage.region,
        dutyInRange: sized.stage.inRange,
        headroomToCurveEndBpd: curve.qMax - sized.stage.qRefBpd,
        // What a learner reads if the affinity ratio is multiplied instead of
        // divided, and how far that is from the duty.
        qRefIfRatioMisappliedBpd: gas.pumpIntakeBpd * sized.stage.ratio,
        qRefMisappliedGapBpd: gas.pumpIntakeBpd * sized.stage.ratio - sized.stage.qRefBpd,
      },
      stream: {
        ...stream,
        gasLimits: CAP.gasLimits,
      },
      gas: {
        ...gas,
        streamGvfMinusThroughPump: stream.gvf - gas.gvfThroughPump,
        separatorEfficiencyThatFlipsVerdict: sepFlip,
        separatorEfficiencyMarginPct: (sepFlip - CAP.separatorEfficiency) * 100,
        verdictAtDesign: gas.verdict,
        verdictJustAboveFlip: D.gasHandling({
          stream, separatorEfficiency: 0.57, limits: CAP.gasLimits,
        }).verdict,
      },
      head: {
        pIntakePsia: pIntake,
        pDischargePsia: CAP.pDischargePsia,
        dpPsi: tdh.dpPsi,
        gradientThroughPumpPsiPerFt: gradient,
        specificGravityUsed: sg,
        tdhFt: tdh.tdhFt,
        // Finding (iv): the same well on the other water gradient convention.
        gradientFromNaiveSgPsiPerFt: gradientNaiveSg,
        tdhFromNaiveSgFt: tdhNaiveSg.tdhFt,
        tdhConventionGapFt: tdhNaiveSg.tdhFt - tdh.tdhFt,
        // The gradient trap espDesign's header names: which density you call
        // the fluid in the pump.
        gradientFullStreamPsiPerFt: gradientFullStream,
        tdhFullStreamFt: tdhFullStream.tdhFt,
        stagesFullStream: D.stageCount({
          tdhFt: tdhFullStream.tdhFt, headPerStageFt: sized.stage.headFt,
        }),
        gradientLiquidOnlyPsiPerFt: gradientLiquidOnly,
        tdhLiquidOnlyFt: tdhLiquidOnly.tdhFt,
        stagesLiquidOnly: D.stageCount({
          tdhFt: tdhLiquidOnly.tdhFt, headPerStageFt: sized.stage.headFt,
        }),
      },
      sizing: {
        stages: sized.stages,
        stagesExact: tdh.tdhFt / sized.stage.headFt,
        headMadeFt: sized.headMadeFt,
        headMarginFt: sized.headMarginFt,
        headMarginAsFractionOfOneStage: sized.headMarginFt / sized.stage.headFt,
        hydraulicHp: sized.hydraulicHp,
        // Finding (ii): two powers for one pump.
        shaftHpOnTdh: sized.shaftHp,
        stackBhpTotalOnHeadMade: sized.stack.bhpTotal,
        twoPowerGapHp: sized.stack.bhpTotal - sized.shaftHp,
        twoPowerGapPct: ((sized.stack.bhpTotal - sized.shaftHp) / sized.shaftHp) * 100,
        // Finding (iii): the derate stops at the module seam.
        motorLoad: sized.motorLoad,
        motorCurrentLoadFraction: E.motorCurrent({
          shaftHp: sized.shaftHp, nameplateHp: CAP.nameplateHp,
          nameplateAmps: CAP.nameplateAmps,
        }).loadFraction,
        loadFractionGapPoints: (sized.motorLoad.loadFraction - E.motorCurrent({
          shaftHp: sized.shaftHp, nameplateHp: CAP.nameplateHp,
          nameplateAmps: CAP.nameplateAmps,
        }).loadFraction) * 100,
        warnings: sized.warnings,
      },
      electrical: {
        selectedCable: selection.cable,
        maxDropPct: selection.maxDropPct,
        requirement: surface,
        candidates: selection.candidates.map((c) => ({
          awg: c.cable.awg, ohmsPer1000FtAt77F: c.cable.ohmsPer1000FtAt77F,
          dropPct: c.requirement.dropPct, dropOk: c.dropOk,
          ampacityOk: c.ampacityOk, ok: c.ok,
        })),
        // The ampacity column is deliberately absent from the shipped table, so
        // `ampacityOk` is true by construction for every candidate above. At
        // this well's 43.06 A that changes nothing, but the check is inert
        // unless the caller supplies manufacturer ampacities.
        ampacityCheckIsInert: selection.candidates.every((c) => c.ampacityOk === true),
        cableAtLongerAwg: cableAtLonger.cable.awg,
        cableAtLongerDropPct: cableAtLonger.requirement.dropPct,
        cableAtHotterAwg: cableAtHotter.cable.awg,
        cableAtHotterDropPct: cableAtHotter.requirement.dropPct,
        lengthAtDropLimitFt: lengthAtDropLimit,
        feetOfCableFromFlipping: lengthAtDropLimit - CAP.cableLengthFt,
      },
      diagnostics: {
        ...diag,
        expectedMinusActualFt: diag.expectedHeadFt - diag.actualHeadFt,
        marginToUnderCurveFlag: diag.headRatio - 0.85,
        surveyQBpd: CAP.surveyQBpd,
        surveyBelowDesignBpd: gas.pumpIntakeBpd - CAP.surveyQBpd,
      },
      // Finding (i): the centre of the capstone.
      turndown: {
        ladder,
        designStages: sized.stages,
        hzWhereDutyLeavesPublishedRange: hzLeavesRange,
        hzWhereExtrapolatedHeadTurnsNegative: hzHeadTurnsNegative,
        stagesAt40Hz: ladder.find((r) => r.hz === 40).stagesReturned,
        stagesAt40HzMinusDesign: ladder.find((r) => r.hz === 40).stagesReturned - sized.stages,
        headPerStageAt40Hz: ladder.find((r) => r.hz === 40).headPerStageFt,
        stagesAt40HzOverDesign: ladder.find((r) => r.hz === 40).stagesReturned / sized.stages,
        qRefAt40HzPastCurveEndBpd: ladder.find((r) => r.hz === 40).qRefBpd - curve.qMax,
        goldenRowThatRecordsIt: {
          note: 'esp_cases.json affinity[2]: qBpd 3200 at 40 Hz, qRefBpd 4800 against a curve published to 3500',
          headFt: 0.052063492058, efficiency: 0.257645714285, bhpPerStage: 0.004290703685,
          inRange: false, region: 'upthrust',
        },
      },
    },
  };
}

// Tolerances. Five parts in ten million of the value, rounded to two
// significant figures: tight enough that a value read off anything else fails,
// loose enough to admit an honest seven-significant-figure rounding.
const TOL = {
  stage_fit_head_rmse_ft: 1.1e-8, stage_bep_q_bpd: 1.8e-3, stage_bep_head_ft: 8.7e-6,
  stage_head_at_duty_ft: 1.1e-5, stage_efficiency_at_duty_frac: 3.5e-7,
  stage_bhp_per_stage_hp: 4.0e-7,
  intake_pressure_psia: 6.0e-4, intake_stream_gvf_frac: 1.0e-7,
  pump_mixture_density_lbft3: 2.6e-5, pump_intake_bpd: 2.1e-3, tdh_ft: 1.8e-3,
  design_head_made_ft: 1.9e-3,
  design_shaft_hp: 6.7e-5, motor_amps_a: 2.2e-5, cable_drop_pct: 2.5e-6,
  surface_kva: 7.8e-5, cable_loss_kw: 3.7e-6, diag_head_ratio_frac: 4.2e-7,
};
const TIER = {
  stage_fit_head_rmse_ft: 'beginner', stage_bep_q_bpd: 'beginner',
  stage_bep_head_ft: 'beginner', stage_head_at_duty_ft: 'beginner',
  stage_efficiency_at_duty_frac: 'beginner', stage_bhp_per_stage_hp: 'beginner',
  intake_pressure_psia: 'intermediate', intake_stream_gvf_frac: 'intermediate',
  pump_mixture_density_lbft3: 'intermediate', pump_intake_bpd: 'intermediate',
  tdh_ft: 'intermediate', design_head_made_ft: 'intermediate',
  design_shaft_hp: 'advanced', motor_amps_a: 'advanced',
  cable_drop_pct: 'advanced', surface_kva: 'advanced',
  cable_loss_kw: 'advanced', diag_head_ratio_frac: 'advanced',
};
const UNIT = {
  stage_fit_head_rmse_ft: 'ft', stage_bep_q_bpd: 'bbl/d', stage_bep_head_ft: 'ft',
  stage_head_at_duty_ft: 'ft', stage_efficiency_at_duty_frac: 'fraction',
  stage_bhp_per_stage_hp: 'hp',
  intake_pressure_psia: 'psia', intake_stream_gvf_frac: 'fraction',
  pump_mixture_density_lbft3: 'lb/ft3', pump_intake_bpd: 'bbl/d', tdh_ft: 'ft',
  design_head_made_ft: 'ft',
  design_shaft_hp: 'hp', motor_amps_a: 'A', cable_drop_pct: 'percent',
  surface_kva: 'kVA', cable_loss_kw: 'kW', diag_head_ratio_frac: 'fraction',
};

const V = capstoneValues();
const fields = Object.keys(TIER).map((k) => [TIER[k], k, V[k], TOL[k]]);
fs.writeFileSync('/root/pd-wip-esp/fields.json', JSON.stringify(fields, null, 1));
for (const [t, k, v, tol] of fields) {
  console.log(`${t.padEnd(13)} ${k.padEnd(30)} ${String(v).padEnd(22)} ${UNIT[k].padEnd(9)} (tol ${tol})`);
}
console.log('\naux:', JSON.stringify(V._aux, null, 1));
