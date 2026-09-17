// THE EIGHTEEN GRADED FC8 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three facilities, six graded fields each, and NOT ONE OF THEM RESTS ON AN
// ITEM THIS PACKAGE HOLDS FOR LITERATURE. That is the design decision this wave
// rests on. The three engines between them name fifteen things they do not
// carry or do not cite, and two of the fifteen are outright refusals: the
// straight-run requirement for two elbows in different planes, and the API 2000
// air-equivalence relation that turns a fire duty into a required vent
// capacity. The second is the one that matters most. The two plausible forms of
// that relation differ by a factor of about 24, and an emergency vent sized 24
// times too small is how a tank is destroyed, so the engine returns the duty and
// refuses the vent BY NAME. The digest teaches that refusal at length. Nothing
// here grades it, and nothing here grades anything downstream of it.
//
// So the capstones grade what these engines can stand behind:
//   KRAKAMA   an export meter run: what it measures, and how well
//   UTONANA   a control valve: the choking boundary and what sits either side
//   SAGHARA   a tank farm: inversion on the engine's own verdict
//
// WHERE A CAPSTONE NEEDS A TABLE VALUE, IT STATES IT. Every FL, xT, sigma
// threshold, noise band, authority boundary, straight-run column, thermal
// venting factor and minimum plate thickness in these three engines says of
// itself that it is the engine's stated data and is cited to no document in
// this repository. Utonana therefore states the certified FL and the trim's
// rangeability the way a project states a vendor figure, and Saghara states its
// allowable stresses, its minimum plate thickness, its thermal rate per barrel,
// its latitude factor, its low-volatility outbreathing factor and the capacity
// at which it stops claiming proportionality. That is the CONSTRUCTION
// mechanism, and the clearance report below measures it rather than asserting
// it.
//
// Usage:
//   node fc8_capstone.mjs               the human table, with the clearance report
//   node fc8_capstone.mjs --json        the rows make_fields.mjs writes
//   node fc8_capstone.mjs --clearances  the held register and every clearance
//
// NOTHING HERE READS THE DIGEST OR THE DIGEST GENERATOR, and the digest
// generator reads nothing here. The two run different facilities at different
// conditions on purpose, and gate_capstone_leak.py proves it in both directions.
import process from 'node:process';

const ROOT = process.env.FC8_ENGINES || '/root/wt-fc8-nextgen/packages/engines';
const M = await import(`${ROOT}/engines/facilities/metering.js`);
const V = await import(`${ROOT}/engines/facilities/controlValve.js`);
const T = await import(`${ROOT}/engines/facilities/storageTank.js`);
const TOLPATH = process.env.FC8_TOLERANCE
  || '/root/wt-fc8-nextgen/src/components/course/panels/metering/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
const keys = (r) => (r && typeof r === 'object' ? Object.keys(r).join(', ') : String(r));

/**
 * A call this file LABELS a success. It asserts there is no error key and no
 * non-finite number in the result.
 *
 * WHY BOTH HALVES. A sibling wave's generator labelled a row a refusal and then
 * called a case that SUCCEEDED. Every number on that line was real engine
 * output, so no numeric sweep could see it, and the line taught the opposite of
 * what the engine does. Label and call are asserted against each other here on
 * every single call, in both directions.
 */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};
/** A call this file LABELS a refusal. It asserts an error key is there. */
const refusal = (label, r) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), r && r.error ? 'refused' : `returned keys [${keys(r)}]`);
  return r;
};

/**
 * ONE BISECTION ROUTINE, used for both inverted Expert fields. It bisects on a
 * PREDICATE THE ENGINE ANSWERS, never on a formula, and it refuses a bracket
 * whose two ends give the same verdict, because that bracket proves nothing.
 * 300 rounds takes a double to its last bit.
 */
const bisect = (lo, hi, pred, label) => {
  let a = lo; let b = hi;
  const pa = pred(a); const pb = pred(b);
  if (!must(`BISECTION BRACKET STRADDLES THE TURNOVER: ${label}`, pa !== pb,
    `pred(${lo})=${pa} pred(${hi})=${pb}`)) return NaN;
  for (let i = 0; i < 300; i += 1) {
    const m = (a + b) / 2;
    if (pred(m) === pa) a = m; else b = m;
    if (Math.abs(b - a) <= Math.abs(b) * 1e-15) break;
  }
  return (a + b) / 2;
};

/* ==================================================== KRAKAMA, Associate

   A gas export meter run: a flange-tapped orifice plate on an eight inch line,
   a differential transmitter on a four hundred and twenty five inch water
   column span, and a
   turbine meter on the liquid side of the same station.

   EVERY UNCERTAINTY BELOW IS STATED. `orificeUncertainty` carries defaults for
   all six terms, and a default is a number the caller did not choose. A
   capstone that leaned on them would grade a learner on the engine's defaults
   rather than on the budget, so all six are written out here and the prompt
   states all six.
   ==================================================================== */

const KRAKAMA = Object.freeze({
  pipeIdIn: 7.981,
  orificeIdIn: 3.8747,
  dpInH2O: 87.43,
  spanInH2O: 425,
  p1Psia: 614.7,
  densityLbFt3: 3.1642,
  viscosityCp: 0.0134,
  k: 1.29,
  transmitterAccuracyPctOfSpan: 0.072,
  cdUncertaintyPct: 0.47,
  expansibilityUncertaintyPct: 0.18,
  boreUncertaintyPct: 0.043,
  pipeUncertaintyPct: 0.11,
  densityUncertaintyPct: 0.28,
  pulses: 4187233,
  kFactorPulsesPerBbl: 912.47,
  meterFactor: 1.0034,
});

const krakamaFlow = success('Krakama orificeFlow at the design differential', M.orificeFlow({
  pipeIdIn: KRAKAMA.pipeIdIn, orificeIdIn: KRAKAMA.orificeIdIn, dpInH2O: KRAKAMA.dpInH2O,
  p1Psia: KRAKAMA.p1Psia, densityLbFt3: KRAKAMA.densityLbFt3,
  viscosityCp: KRAKAMA.viscosityCp, k: KRAKAMA.k,
}));
must('Krakama sits INSIDE the published beta range, so no graded field is an extrapolation of the correlation',
  krakamaFlow.betaInPublishedRange === true, `beta ${krakamaFlow.beta}`);
must('Krakama runs at a Reynolds number in the millions, which is the end of the correlation this package does carry',
  krakamaFlow.reynolds > 1e6, krakamaFlow.reynolds);

const krakamaTransmitter = success('Krakama transmitterUncertaintyPct at the design reading', M.transmitterUncertaintyPct({
  dpInH2O: KRAKAMA.dpInH2O, spanInH2O: KRAKAMA.spanInH2O,
  accuracyPctOfSpan: KRAKAMA.transmitterAccuracyPctOfSpan,
}));
must('Krakama reads BELOW the flow turndown limit, so the transmitter warning does not fire and the graded turndown is not a warning number',
  krakamaTransmitter.warning === null, `flow turndown ${krakamaTransmitter.flowTurndown}`);

const krakamaBudget = success('Krakama orificeUncertainty with every term stated', M.orificeUncertainty({
  beta: krakamaFlow.beta,
  cdUncertaintyPct: KRAKAMA.cdUncertaintyPct,
  expansibilityUncertaintyPct: KRAKAMA.expansibilityUncertaintyPct,
  boreUncertaintyPct: KRAKAMA.boreUncertaintyPct,
  pipeUncertaintyPct: KRAKAMA.pipeUncertaintyPct,
  densityUncertaintyPct: KRAKAMA.densityUncertaintyPct,
  dpInH2O: KRAKAMA.dpInH2O, spanInH2O: KRAKAMA.spanInH2O,
  transmitterAccuracyPctOfSpan: KRAKAMA.transmitterAccuracyPctOfSpan,
}));
must('Krakama takes its differential term FROM THE TRANSMITTER rather than from a typed figure',
  krakamaBudget.differentialUncertaintyPct === krakamaTransmitter.uncertaintyPctOfReading,
  `${krakamaBudget.differentialUncertaintyPct} against ${krakamaTransmitter.uncertaintyPctOfReading}`);

const krakamaTurbine = success('Krakama turbineVolume over the proving period', M.turbineVolume({
  pulses: KRAKAMA.pulses, kFactorPulsesPerBbl: KRAKAMA.kFactorPulsesPerBbl,
  meterFactor: KRAKAMA.meterFactor,
}));
must('Krakama meter factor is inside the one percent proving screen, so the graded volume carries no warning',
  krakamaTurbine.warning === null, `meter factor ${krakamaTurbine.meterFactor}`);

/* ==================================================== UTONANA, Professional

   A control valve on a hot condensate transfer, sized at the design flow. The
   service is CHOKED: the stated pressure drop is beyond what this valve can
   use, so the engine caps the drop and sizes on the cap. Sizing on the stated
   drop instead is the single commonest error in this subject and it undersizes
   the valve, which is the whole of the Professional tier.

   THE FL IS THE CERTIFIED FIGURE FOR THIS TRIM, stated by the project and
   passed as `flOverride`. The engine's own style table says of itself that it
   is not cited to a document in this repository and that a certified vendor
   figure always replaces it, so stating it is what takes that table out of
   every chain below rather than a way around the engine.
   ==================================================================== */

const UTONANA = Object.freeze({
  qGpm: 742.6,
  p1Psia: 428.3,
  p2Psia: 72.4,
  sg: 0.7134,
  pvPsia: 41.62,
  pcPsia: 566.8,
  fl: 0.93,
  rangeability: 42.5,
  dpSystemTotalPsi: 452.8,
  cvRated: 88,
  cvRequiredMin: 11.85,
  cvRequiredNormal: 34.62,
  cvRequiredMax: 47.3,
});

const utonanaValve = success('Utonana liquidValve at the design flow', V.liquidValve({
  qGpm: UTONANA.qGpm, p1Psia: UTONANA.p1Psia, p2Psia: UTONANA.p2Psia, sg: UTONANA.sg,
  pvPsia: UTONANA.pvPsia, pcPsia: UTONANA.pcPsia, flOverride: UTONANA.fl,
}));
must('Utonana IS choked, which is what the Professional tier is about',
  utonanaValve.choked === true, `dpStated ${utonanaValve.dpStatedPsi} against dpAllowable ${utonanaValve.dpAllowablePsi}`);
must('Utonana is NOT flashing, so the choked branch and not the flashing branch is the one taught here',
  utonanaValve.flashing === false, `p2 ${UTONANA.p2Psia} against pv ${UTONANA.pvPsia}`);
must('Utonana sizes on the drop the valve USES rather than the drop stated',
  utonanaValve.dpUsedPsi === utonanaValve.dpAllowablePsi
  && utonanaValve.dpUsedPsi < utonanaValve.dpStatedPsi,
  `used ${utonanaValve.dpUsedPsi}`);
must('Utonana takes the STATED FL and not the engine style table value',
  utonanaValve.fl === UTONANA.fl, `fl ${utonanaValve.fl}`);

const utonanaAuthority = success('Utonana valveAuthority on the stated drop', V.valveAuthority({
  dpValvePsi: utonanaValve.dpStatedPsi, dpSystemTotalPsi: UTONANA.dpSystemTotalPsi,
}));
const utonanaTravel = success('Utonana travelCheck over all three duty flows', V.travelCheck({
  cvRequiredMin: UTONANA.cvRequiredMin,
  cvRequiredNormal: UTONANA.cvRequiredNormal,
  cvRequiredMax: UTONANA.cvRequiredMax,
  cvRated: UTONANA.cvRated,
  characteristic: 'equalPercentage',
  rangeability: UTONANA.rangeability,
}));
must('Utonana runs ALL THREE travel checks, so the verdict is over checks that happened',
  utonanaTravel.checksPerformed === 3 && utonanaTravel.checksPossible === 3,
  utonanaTravel.verdict);
must('Utonana travel check returns a verdict rather than withholding it',
  utonanaTravel.pass === true && utonanaTravel.passWithheldReason === null, `pass=${utonanaTravel.pass}`);

/* ========================================================= SAGHARA, Expert

   A fixed-roof tank farm. Two of the six fields are INVERSIONS: the specific
   gravity at which the water test takes over from the product as the thing
   that sets the bottom course, and the draw rate at which vacuum takes over
   from pressure as the venting case that governs. Each is found by bisecting an
   engine call until a word the engine returns turns over, so the answer is the
   engine's and not an algebraic shortcut around it.

   THE ANNUAL LOSS THE VAPOUR RECOVERY UNIT IS SIZED AGAINST IS STATED, off the
   terminal's own measured inventory record, exactly as a surveyed corrosion
   rate is stated in a sibling wave. That is what keeps AP-42's relations, and
   the turnover factor Kn this package does not carry, out of the chain.
   ==================================================================== */

const SAGHARA = Object.freeze({
  diameterFt: 78.4,
  heightFt: 44.0,
  courseHeightFt: 8,
  liquidLevelFt: 42.6,
  sg: 0.8312,
  designStressPsi: 25300,
  testStressPsi: 27000,
  corrosionAllowanceIn: 0.0625,
  minimumThicknessIn: 0.25,
  scfhPerBbl: 1.12,
  latitudeFactor: 1.08,
  lowVolatilityOutFactor: 0.58,
  proportionalLimitBbl: 41500,
  fillBblPerHr: 4820,
  drawBblPerHr: 1150,
  uncontrolledLbYr: 214860,
  controlEfficiencyPct: 93.4,
});

const sagharaShellArgs = (sg) => ({
  diameterFt: SAGHARA.diameterFt, heightFt: SAGHARA.heightFt,
  courseHeightFt: SAGHARA.courseHeightFt, liquidLevelFt: SAGHARA.liquidLevelFt, sg,
  designStressPsi: SAGHARA.designStressPsi, testStressPsi: SAGHARA.testStressPsi,
  corrosionAllowanceIn: SAGHARA.corrosionAllowanceIn,
  minimumThicknessIn: SAGHARA.minimumThicknessIn,
});
const sagharaShell = success('Saghara shellCourses at the design product',
  T.shellCourses(sagharaShellArgs(SAGHARA.sg)));
must('Saghara bottom course is governed by the PRODUCT at the design gravity, which is the side of the inversion the learner starts on',
  sagharaShell.governingReason === 'product design', sagharaShell.governingReason);
must('Saghara bottom course is the thickest, which the engine states is a property of the method',
  sagharaShell.thickestCourse === 1 && sagharaShell.governingCourseIsAlwaysTheBottom === true,
  `course ${sagharaShell.thickestCourse}`);

const sagharaSgFlip = bisect(0.4, 1.4,
  (g) => T.shellCourses(sagharaShellArgs(g)).governingReason === 'hydrostatic test',
  'the specific gravity at which the water test takes the bottom course, bisected on shellCourses.governingReason');
// THE CROSSING IS ASSERTED AS A BRACKET RATHER THAN AS A POINT. At the exact
// crossing the two thicknesses are equal, and which word the engine returns
// there is decided by the last bit of a double. A gate that demanded one word
// AT the returned value would be asserting a coin toss, so what is asserted is
// the thing that is actually true: a hair below the crossing the water test
// governs and a hair above it the product does.
must('Saghara: a gravity one part in a thousand BELOW the crossing is on the water test',
  T.shellCourses(sagharaShellArgs(sagharaSgFlip * 0.999)).governingReason === 'hydrostatic test',
  T.shellCourses(sagharaShellArgs(sagharaSgFlip * 0.999)).governingReason);
must('Saghara: a gravity one part in a thousand ABOVE the crossing is back on the product',
  T.shellCourses(sagharaShellArgs(sagharaSgFlip * 1.001)).governingReason === 'product design',
  T.shellCourses(sagharaShellArgs(sagharaSgFlip * 1.001)).governingReason);
must('Saghara: the minimum plate never governs at the crossing, so the crossing is a real product against test boundary',
  T.shellCourses(sagharaShellArgs(sagharaSgFlip * 0.999)).thickestRequiredIn > SAGHARA.minimumThicknessIn,
  T.shellCourses(sagharaShellArgs(sagharaSgFlip * 0.999)).thickestRequiredIn);

const sagharaCapacity = success('Saghara tankCapacity at the design level', T.tankCapacity({
  diameterFt: SAGHARA.diameterFt, heightFt: SAGHARA.heightFt, fillHeightFt: SAGHARA.liquidLevelFt,
}));
const sagharaVentArgs = (draw) => ({
  nominalBbl: sagharaCapacity.nominalBbl,
  fillBblPerHr: SAGHARA.fillBblPerHr,
  drawBblPerHr: draw,
  highVolatility: false,
  latitudeFactor: SAGHARA.latitudeFactor,
  insulated: false,
  scfhPerBbl: SAGHARA.scfhPerBbl,
  lowVolatilityOutFactor: SAGHARA.lowVolatilityOutFactor,
  proportionalLimitBbl: SAGHARA.proportionalLimitBbl,
});
const sagharaVent = success('Saghara normalVenting at the stated draw', T.normalVenting(sagharaVentArgs(SAGHARA.drawBblPerHr)));
must('Saghara is BELOW the stated capacity at which this package stops claiming the thermal rate is proportional, so the graded inbreathing is not an extrapolation',
  sagharaVent.thermal.aboveProportionalLimit === false && sagharaVent.thermalWarning === null,
  `${sagharaCapacity.nominalBbl} bbl against a stated limit of ${SAGHARA.proportionalLimitBbl}`);
must('Saghara is on the PRESSURE side at the stated draw, which is the side of the second inversion the learner starts on',
  sagharaVent.governing === 'pressure (outbreathing)', sagharaVent.governing);

const sagharaDrawFlip = bisect(0, 8000,
  (d) => T.normalVenting(sagharaVentArgs(d)).governing === 'vacuum (inbreathing)',
  'the draw rate at which vacuum takes the venting case, bisected on normalVenting.governing');
// The same bracket, for the same reason: at the exact crossing the inbreathing
// and the outbreathing are equal and the engine's one predicate decides on the
// last bit.
must('Saghara: a draw one part in a thousand ABOVE the crossing is on vacuum',
  T.normalVenting(sagharaVentArgs(sagharaDrawFlip * 1.001)).governing === 'vacuum (inbreathing)',
  T.normalVenting(sagharaVentArgs(sagharaDrawFlip * 1.001)).governing);
must('Saghara: a draw one part in a thousand BELOW the crossing is back on pressure',
  T.normalVenting(sagharaVentArgs(sagharaDrawFlip * 0.999)).governing === 'pressure (outbreathing)',
  T.normalVenting(sagharaVentArgs(sagharaDrawFlip * 0.999)).governing);

const sagharaControl = success('Saghara lossControl on the stated measured loss', T.lossControl({
  uncontrolledLbYr: SAGHARA.uncontrolledLbYr, controlEfficiencyPct: SAGHARA.controlEfficiencyPct,
}));

/* ==================================================== THE REFUSALS the
   capstones lean on, asserted so a tier cannot be written around behaviour the
   engine does not have. Each is LABELLED a refusal and must carry an error key,
   and the labels are checked against the calls in both directions above.
   ==================================================================== */

refusal('a differential at or above the static pressure', M.orificeFlow({
  pipeIdIn: 7.981, orificeIdIn: 3.8747, dpInH2O: 600, p1Psia: 14.7,
  densityLbFt3: 3.1642, viscosityCp: 0.0134,
}));
refusal('a permanent loss with no discharge coefficient', M.permanentLoss({ dpInH2O: 87.43, beta: 0.4855 }));
refusal('a transmitter reading above its own span', M.transmitterUncertaintyPct({ dpInH2O: 441, spanInH2O: 425 }));
refusal('a straight-run requirement for two elbows in different planes', M.straightRunDiameters({
  beta: 0.4855, upstreamFitting: 'twoElbowsDifferentPlanes',
}));
refusal('a liquid sizing with no vapour pressure', V.liquidValve({
  qGpm: 742.6, p1Psia: 428.3, p2Psia: 72.4, sg: 0.7134, pvPsia: 0, flOverride: 0.93,
}));
refusal('a travel check on an unrecognised inherent characteristic', V.travelCheck({
  cvRequiredNormal: 34.62, cvRated: 88, characteristic: 'quickOpening',
}));
refusal('a fill height below zero', T.tankCapacity({ diameterFt: 78.4, heightFt: 44, fillHeightFt: -1 }));
refusal('a product that boils at the stated atmospheric pressure', T.evaporativeLosses({
  diameterFt: 78.4, vapourSpaceHeightFt: 4, vapourPressurePsia: 15.2, throughputBbl: 100000,
}));

/* ==================================================== THE WITHHOLDINGS, which
   are the reason this file grades what it grades. Each is asserted to be a
   withholding the engine SHIPS rather than an absence somebody remembers.
   ==================================================================== */

const fireCase = success('Saghara fireVenting at the wetted area', T.fireVenting({
  wettedFt2: T.wettedAreaFt2({
    diameterFt: SAGHARA.diameterFt, liquidLevelFt: SAGHARA.liquidLevelFt,
  }).areaFt2,
}));
must('THE EMERGENCY VENT IS WITHHELD BY NAME and the duty is still returned, so the course can teach the limit without teaching a number',
  fireCase.ventWithheld === true && fireCase.ventScfhAir === null && fireCase.qBtuHr > 0,
  `ventScfhAir=${fireCase.ventScfhAir}, qBtuHr=${fireCase.qBtuHr}`);
must('THE WITHHELD VENT SAYS WHY IN THE ENGINE\'S OWN WORDS, and those words name the factor of about 24',
  typeof fireCase.ventWithheldReason === 'string' && fireCase.ventWithheldReason.includes('24'),
  `${String(fireCase.ventWithheldReason).slice(0, 60)}...`);
must('THE STRAIGHT-RUN COLUMN FOR TWO ELBOWS OUT OF PLANE IS WITHHELD BY NAME',
  M.straightRunDiameters({ beta: 0.4855, upstreamFitting: 'twoElbowsDifferentPlanes' }).withheld === true,
  'withheld');

/* ==================================================== THE CLEARANCE REPORT

   Every held, uncited and withheld item, against every graded field, with the
   MECHANISM that clears it. Four mechanisms and no fifth:

     CONSTRUCTION  the capstone STATES the quantity the held item would supply,
                   or the field is a definition or an exact conversion with no
                   held item anywhere in its chain
     CANCELLATION  the field is a ratio or a difference of two engine calls that
                   share the held chain bit for bit, so it divides out
     INVARIANCE    MEASURED: the field is recomputed with the held item's own
                   input moved a long way and does not move
     EXCLUSION     the held item is a label, a band, a threshold verdict or a
                   withheld answer, and no graded field reads a label

   A mechanism is not established by being written down. The assertions below
   MEASURE the ones that can be measured.
   ==================================================================== */

const HELD = [
  'H1 the published lower Reynolds number limit of the Reader-Harris/Gallagher correlation at each beta and bore',
  'H2 WITHHELD: the straight-run requirement for two elbows in different planes',
  'H3 the remaining straight-run columns, which the engine states are its own table data cited to no document here',
  'H4 the API MPMS temperature and pressure correction tables, so there is no CTL, no CPL and no net standard volume',
  'H5 the valve style FL and xT table',
  'H6 the cavitation sigma thresholds of 2 and 3',
  'H7 the noise pressure ratio bands of 2, 4 and 10 and the stream power bands of 1 kW and 1000 kW',
  'H8 the valve authority screen boundaries of 0.5 and 0.25',
  'H9 the ISA 75.01 Reynolds number factor FR, so every liquid sizing here is fully turbulent',
  'H10 the IEC 60534-8-3 noise prediction',
  'H11 the API 650 minimum shell plate thickness band table',
  'H12 the API 650 diameter above which the variable design point method replaces the one-foot method',
  'H13 the API 2000 thermal venting table above the proportional limit, and the latitude and insulation credits',
  'H14 AP-42 turnover factor Kn',
  'W1 WITHHELD: the API 2000 air-equivalence relation, so the required emergency fire vent capacity is refused by name',
];

const CLEARANCES = [];
const clear = (key, held, mechanism, how) => CLEARANCES.push({ key, held, mechanism, how });

/* -- KRAKAMA. Measured invariance: recompute every Associate field on a run at
      a very different Reynolds number and bore, and require the ones that
      should not move to be BIT IDENTICAL. */
const KRAKAMA_FAR = {
  ...KRAKAMA, p1Psia: 1420.5, densityLbFt3: 7.9134, viscosityCp: 0.0201, k: 1.21,
};
const krakamaFar = success('Krakama far-field orificeFlow', M.orificeFlow({
  pipeIdIn: KRAKAMA_FAR.pipeIdIn, orificeIdIn: KRAKAMA_FAR.orificeIdIn, dpInH2O: KRAKAMA_FAR.dpInH2O,
  p1Psia: KRAKAMA_FAR.p1Psia, densityLbFt3: KRAKAMA_FAR.densityLbFt3,
  viscosityCp: KRAKAMA_FAR.viscosityCp, k: KRAKAMA_FAR.k,
}));
must('CLEARANCE MEASUREMENT: the far-field run really does move the discharge coefficient and the mass flow, so the invariance below is not vacuous',
  Math.abs(krakamaFar.massLbHr / krakamaFlow.massLbHr - 1) > 0.5
  && krakamaFar.cd !== krakamaFlow.cd,
  `far ${krakamaFar.massLbHr} lb/hr at Cd ${krakamaFar.cd} against near ${krakamaFlow.massLbHr} at Cd ${krakamaFlow.cd}`);
must('CLEARANCE by INVARIANCE: krakama_beta_ratio is bit identical across the far-field run, so nothing in the correlation reaches it',
  krakamaFar.beta === krakamaFlow.beta, `${krakamaFar.beta} against ${krakamaFlow.beta}`);
must('CLEARANCE by INVARIANCE: krakama_differential_psi is bit identical across the far-field run',
  krakamaFar.dpPsi === krakamaFlow.dpPsi, `${krakamaFar.dpPsi} against ${krakamaFlow.dpPsi}`);
must('CLEARANCE by CONSTRUCTION, MEASURED: the differential in psi is the differential in inches of water times one fixed factor the engine applies, and the engine answers for that factor itself',
  Math.abs((krakamaFlow.dpPsi / KRAKAMA.dpInH2O) - (krakamaFar.dpPsi / KRAKAMA_FAR.dpInH2O)) === 0,
  `${krakamaFlow.dpPsi / KRAKAMA.dpInH2O} psi per in H2O, both runs`);

['krakama_beta_ratio', 'krakama_differential_psi'].forEach((k) => {
  clear(k, 'H1 H3 H4 H5 H6 H7 H8 H9 H10 H11 H12 H13 H14', 'CONSTRUCTION', 'a beta is a bore divided by a bore and a differential in psi is a differential in inches of water times one fixed conversion the engine applies to every case. Neither reads the discharge coefficient, a table, a screening band or a standard this package does not carry. MEASURED bit identical across a run that moves the mass flow by more than half and changes the coefficient');
  clear(k, 'H2 W1', 'EXCLUSION', 'both are withheld ANSWERS, returned as a refusal with no number. A field that carries a number cannot be reading one');
});
['krakama_transmitter_uncertainty_pct', 'krakama_flow_turndown_ratio'].forEach((k) => {
  clear(k, 'H1 H3 H4 H5 H6 H7 H8 H9 H10 H11 H12 H13 H14', 'CONSTRUCTION', 'the transmitter pair is an accuracy times a span divided by a reading, and the square root of a span divided by a reading. Three stated numbers and no engine table. The flow turndown is the square root of the differential turndown because flow goes as the square root of the differential, which is the definition the repaired engine put in');
  clear(k, 'H2 W1', 'EXCLUSION', 'neither reads a withheld answer');
});
clear('krakama_total_uncertainty_pct', 'H1 H9 H11 H12 H13 H14', 'CONSTRUCTION', 'the budget is a root sum of squares over six stated percentages with sensitivities read off the orifice equation itself. The sensitivities are functions of beta alone. No correlation constant, no Reynolds limit, no standard\'s table is anywhere in it');
clear('krakama_total_uncertainty_pct', 'H3 H4 H5 H6 H7 H8 H10', 'EXCLUSION', 'a percentage is not a straight-run column, a correction table, a valve table, a screening band or a noise method');
clear('krakama_total_uncertainty_pct', 'H2 W1', 'EXCLUSION', 'no withheld answer is read');
clear('krakama_turbine_gross_bbl', 'H4', 'CONSTRUCTION', 'the volume is pulses divided by a K factor times a meter factor, and it is GROSS. The engine says in the result itself that a net standard volume needs the API MPMS corrections it does not carry, so the capstone asks for the gross volume by name and never for a net one. That is the held item being excluded by the QUESTION rather than by arithmetic');
clear('krakama_turbine_gross_bbl', 'H1 H3 H5 H6 H7 H8 H9 H10 H11 H12 H13 H14', 'CONSTRUCTION', 'a turbine volume reads nothing from the orifice correlation, a valve, a tank or a standard\'s table: it is three stated numbers multiplied and divided');
clear('krakama_turbine_gross_bbl', 'H2 W1', 'EXCLUSION', 'no withheld answer is read');

/* -- UTONANA. Measured invariance: the four fields that must not move when the
      engine's own style table moves are recomputed with a DIFFERENT style id
      under the same stated FL. */
const utonanaOtherStyle = success('Utonana under a different style id with the same stated FL', V.liquidValve({
  qGpm: UTONANA.qGpm, p1Psia: UTONANA.p1Psia, p2Psia: UTONANA.p2Psia, sg: UTONANA.sg,
  pvPsia: UTONANA.pvPsia, pcPsia: UTONANA.pcPsia, flOverride: UTONANA.fl, styleId: 'butterfly90',
}));
must('CLEARANCE MEASUREMENT: the style really does carry a different FL, so the invariance below is not vacuous',
  V.styleOf('butterfly90').fl !== UTONANA.fl && V.styleOf('globeCage').fl !== UTONANA.fl,
  `butterfly90 fl ${V.styleOf('butterfly90').fl}, globeCage fl ${V.styleOf('globeCage').fl}, stated ${UTONANA.fl}`);
['cv', 'ff', 'dpAllowablePsi', 'dpUsedPsi', 'sigma'].forEach((f) => {
  must(`CLEARANCE by INVARIANCE: Utonana ${f} is bit identical when the engine's style table is swapped underneath it`,
    utonanaOtherStyle[f] === utonanaValve[f], `${utonanaOtherStyle[f]} against ${utonanaValve[f]}`);
});

['utonana_ff_critical_ratio', 'utonana_allowable_drop_psi', 'utonana_liquid_cv', 'utonana_cavitation_sigma'].forEach((k) => {
  clear(k, 'H5', 'INVARIANCE', 'the capstone states the certified FL for this trim, which the engine takes in preference to its own table. MEASURED: all four are bit identical when the style id underneath them is swapped from a cage globe to a ninety degree butterfly, whose tabulated FL differs by a third');
  clear(k, 'H6', 'EXCLUSION', 'the cavitation INDEX is graded and the two thresholds that turn it into a regime word are not. The capstone asks for the number and never for the word');
  clear(k, 'H7 H8 H10', 'EXCLUSION', 'none of the four reads a noise band, an authority boundary or a noise method');
  clear(k, 'H1 H2 H3 H4 H11 H12 H13 H14 W1', 'EXCLUSION', 'none of the four reads the orifice correlation, a straight-run column, a metering correction table, a tank standard or a withheld answer');
  clear(k, 'H9', 'CONSTRUCTION', 'the engine returns reynoldsFactorApplied false and says so in the result: this sizing is fully turbulent and the ISA factor FR is not applied to it at all. The field is therefore the fully turbulent answer BY CONSTRUCTION rather than an answer missing a correction, and the capstone states the service as fully turbulent');
});
must('CLEARANCE by CONSTRUCTION: the engine states in the result that no Reynolds factor was applied, so the fully turbulent clearance above is the engine\'s own statement',
  utonanaValve.reynoldsFactorApplied === false, `reynoldsFactorApplied=${utonanaValve.reynoldsFactorApplied}`);
clear('utonana_valve_authority', 'H8', 'EXCLUSION', 'the authority RATIO is graded and the good and acceptable boundaries that turn it into a verdict word are not. The engine names those boundaries as its own stated screen and the capstone never asks for the word');
clear('utonana_valve_authority', 'H1 H2 H3 H4 H5 H6 H7 H9 H10 H11 H12 H13 H14 W1', 'CONSTRUCTION', 'an authority is one pressure drop divided by another. Nothing in the definition reads a table, a band, a correlation or a withheld answer');
clear('utonana_normal_travel_pct', 'H5', 'CONSTRUCTION', 'the travel comes from the rated Cv, the required Cv and the RANGEABILITY, all three stated by the project. The valve style table carries an FL and an xT and neither is read by travelCheck at all');
clear('utonana_normal_travel_pct', 'H6 H7 H8 H10', 'EXCLUSION', 'a travel percentage is not a cavitation band, a noise band, an authority verdict or a noise prediction');
clear('utonana_normal_travel_pct', 'H1 H2 H3 H4 H9 H11 H12 H13 H14 W1', 'EXCLUSION', 'travelCheck reads no correlation, no metering table, no tank standard and no withheld answer: it is the equal-percentage relation over three stated coefficients');

/* -- SAGHARA. Measured invariance on the venting fields against the two factors
      the engine calls its own stated choices, and on the loss saving against
      everything AP-42. */
const sagharaHighLat = success('Saghara normalVenting at a different stated latitude factor',
  T.normalVenting({ ...sagharaVentArgs(SAGHARA.drawBblPerHr), latitudeFactor: 1.6 }));
must('CLEARANCE MEASUREMENT: the latitude factor really does move the inbreathing, so stating it is what fixes the answer',
  Math.abs(sagharaHighLat.inbreathingScfh / sagharaVent.inbreathingScfh - 1) > 0.2,
  `${sagharaHighLat.inbreathingScfh} against ${sagharaVent.inbreathingScfh}`);
const sagharaOtherCourse = success('Saghara shellCourses at a different course height',
  T.shellCourses({ ...sagharaShellArgs(SAGHARA.sg), courseHeightFt: 6 }));
must('CLEARANCE by INVARIANCE: the bottom course thickness does not depend on how the shell is split into courses',
  sagharaOtherCourse.thickestRequiredIn === sagharaShell.thickestRequiredIn,
  `${sagharaOtherCourse.thickestRequiredIn} against ${sagharaShell.thickestRequiredIn}`);

['saghara_bottom_course_required_in', 'saghara_sg_at_which_test_governs'].forEach((k) => {
  clear(k, 'H11', 'CONSTRUCTION', 'the capstone STATES the minimum plate thickness, which the engine takes as an input and reports back as minimumThicknessIn with a basis saying the band table is not carried. MEASURED at the crossing: the required thickness is above the stated minimum, so the minimum is not what governs and the crossing is a real product against test boundary');
  clear(k, 'H12', 'EXCLUSION', 'the one-foot method is the method the capstone asks for by name. The diameter at which the standard requires the variable design point method instead is a LIMIT ON APPLICABILITY and not a term in the arithmetic, and the engine returns it as a note rather than as a number');
  clear(k, 'H13 H14', 'EXCLUSION', 'a shell thickness reads no venting factor and no evaporation factor');
  clear(k, 'H1 H2 H3 H4 H5 H6 H7 H8 H9 H10 W1', 'EXCLUSION', 'a shell thickness reads no metering correlation, no valve table, no screening band and no withheld answer');
});
['saghara_inbreathing_scfh', 'saghara_vacuum_governing_draw_bblhr'].forEach((k) => {
  clear(k, 'H13', 'CONSTRUCTION', 'every factor the engine calls its own stated choice is stated by the capstone: the thermal rate per barrel, the latitude factor, the low-volatility outbreathing factor, and the capacity above which this package stops claiming proportionality. MEASURED: the tank is below that stated capacity and the engine returns aboveProportionalLimit false, so no extrapolation is in the answer. The insulation credit is not reached at all because the tank is stated uninsulated');
  clear(k, 'H14', 'EXCLUSION', 'venting is displacement and temperature. The turnover factor belongs to the evaporation relations and no venting field reads one');
  clear(k, 'H11 H12', 'EXCLUSION', 'a vent rate reads no plate thickness and no shell design method');
  clear(k, 'H1 H2 H3 H4 H5 H6 H7 H8 H9 H10 W1', 'EXCLUSION', 'a vent rate reads no metering correlation, no valve table, no screening band and no withheld answer. The withheld one here is the EMERGENCY vent, which is a different question from the normal vent and the engine returns null for it');
});
clear('saghara_working_capacity_bbl', 'H11 H12 H13 H14', 'CONSTRUCTION', 'a working capacity is a cross-section times a fill height divided by an exact number of cubic feet in a barrel, and the engine returns that conversion as ft3PerBbl so it can be checked rather than assumed. No plate table, no design method, no venting factor and no turnover factor is in it');
clear('saghara_working_capacity_bbl', 'H1 H2 H3 H4 H5 H6 H7 H8 H9 H10 W1', 'EXCLUSION', 'a geometric capacity reads nothing from the metering or valve engines and no withheld answer');
clear('saghara_recovery_saved_lb_yr', 'H14', 'CONSTRUCTION', 'the capstone STATES the uncontrolled annual loss off the terminal\'s own measured inventory record, so the AP-42 standing and working loss relations are not called at all and the turnover factor the package does not carry cannot be in the chain. What the engine supplies is the control arithmetic, which is one stated loss times one stated efficiency');
clear('saghara_recovery_saved_lb_yr', 'H11 H12 H13', 'EXCLUSION', 'a control saving reads no plate table, no shell method and no venting factor');
clear('saghara_recovery_saved_lb_yr', 'H1 H2 H3 H4 H5 H6 H7 H8 H9 H10 W1', 'EXCLUSION', 'a control saving reads nothing from the metering or valve engines and no withheld answer');

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'krakama_beta_ratio', 'ratio', krakamaFlow.beta],
  ['beginner', 'krakama_differential_psi', 'psi', krakamaFlow.dpPsi],
  ['beginner', 'krakama_transmitter_uncertainty_pct', 'pct', krakamaTransmitter.uncertaintyPctOfReading],
  ['beginner', 'krakama_flow_turndown_ratio', 'ratio', krakamaTransmitter.flowTurndown],
  ['beginner', 'krakama_total_uncertainty_pct', 'pct', krakamaBudget.totalUncertaintyPct],
  ['beginner', 'krakama_turbine_gross_bbl', 'bbl', krakamaTurbine.grossBbl],
  ['intermediate', 'utonana_ff_critical_ratio', 'ratio', utonanaValve.ff],
  ['intermediate', 'utonana_allowable_drop_psi', 'psi', utonanaValve.dpAllowablePsi],
  ['intermediate', 'utonana_liquid_cv', 'cv', utonanaValve.cv],
  ['intermediate', 'utonana_cavitation_sigma', 'ratio', utonanaValve.sigma],
  ['intermediate', 'utonana_valve_authority', 'ratio', utonanaAuthority.authority],
  ['intermediate', 'utonana_normal_travel_pct', 'pct', utonanaTravel.normalTravelPct],
  ['advanced', 'saghara_bottom_course_required_in', 'inch', sagharaShell.thickestRequiredIn],
  ['advanced', 'saghara_sg_at_which_test_governs', 'ratio', sagharaSgFlip],
  ['advanced', 'saghara_inbreathing_scfh', 'scfh', sagharaVent.inbreathingScfh],
  ['advanced', 'saghara_vacuum_governing_draw_bblhr', 'bblPerHr', sagharaDrawFlip],
  ['advanced', 'saghara_working_capacity_bbl', 'bbl', sagharaCapacity.workingBbl],
  ['advanced', 'saghara_recovery_saved_lb_yr', 'lbPerYr', sagharaControl.savedLbYr],
].map(([tier, key, cls, value]) => ({ tier, key, cls, value }));

/* The order and the classes must be the tolerance derivation's and not this
   file's opinion of them. A second copy of the field list is exactly the class
   of defect gradedTolerance.js exists to remove. */
must('the eighteen rows are the eighteen declared fields, in the declared order and classes',
  JSON.stringify(ROWS.map((r) => [r.tier, r.key, r.cls]))
  === JSON.stringify(GRADED_FIELDS.map(([t, k, c]) => [t, k, c])),
  `${ROWS.length} rows`);
ROWS.forEach((r) => must(`${r.key} is a finite positive number`, Number.isFinite(r.value) && r.value > 0, r.value));

/* Every held item must be cleared for every field. Eighteen times fifteen. */
const missing = [];
GRADED_FIELDS.forEach(([, key]) => {
  HELD.forEach((h) => {
    const tag = h.split(' ')[0];
    const got = CLEARANCES.filter((c) => c.key === key && c.held.split(/\s+/).includes(tag));
    if (!got.length) missing.push(`${key} has no clearance for ${tag}`);
  });
});
must('EVERY HELD, UNCITED AND WITHHELD ITEM IS CLEARED FOR EVERY GRADED FIELD', missing.length === 0,
  missing.length ? missing.slice(0, 12).join('; ') : `${GRADED_FIELDS.length} fields x ${HELD.length} items, all cleared`);

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`fc8_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`fc8_capstone: ${ASSERTS.length} label-and-call and clearance assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--clearances')) {
  process.stdout.write(`${JSON.stringify({ held: HELD, clearances: CLEARANCES }, null, 1)}\n`);
} else {
  const pad = (s, n) => String(s).padEnd(n);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 40)}${pad('CLASS', 10)}${pad('VALUE', 26)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 40)}${pad(r.cls, 10)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 26)}${gradedTolerance(r.key)}\n`));
  process.stdout.write(`\n${CLEARANCES.length} clearance assertions over ${GRADED_FIELDS.length} fields and ${HELD.length} held, uncited or withheld items\n`);
  const byMech = {};
  CLEARANCES.forEach((c) => { byMech[c.mechanism] = (byMech[c.mechanism] || 0) + 1; });
  process.stdout.write(`by mechanism: ${Object.entries(byMech).sort().map(([m, n]) => `${m} ${n}`).join(', ')}\n`);
}
