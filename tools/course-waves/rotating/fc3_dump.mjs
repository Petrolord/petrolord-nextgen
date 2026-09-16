// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of pumps_cases.json and
// compression_cases.json (plus sweeps around those published inputs) and the
// TEACHING FIELDS this wave designed for itself: the OKONO injection pump and
// the SOKU gas booster train. THE FC3 CAPSTONE RUNS DIFFERENT MACHINES
// ENTIRELY: nothing here imports, reads or reproduces the capstone generator,
// the graded answer file, or any capstone curve point, flow, head, pressure,
// temperature, gravity, efficiency, ratio, speed or heat rate.
//
// Usage:  sh /root/fc-wip-rotating/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/fc-wip-rotating/digest.txt
//
// Engines, vendored at engines main 4fa37e6, which is the FC3-0 repair wave
// (engines PR #197) on top of the 709172f this course's foundation phase was
// first built against:
// engines/facilities/pumps.js and engines/facilities/compression.js, over
// engines/production/gasProperties.js for the pseudo-criticals, the
// compressibility and the Rankine offset the compression module composes,
// over engines/facilities/separatorSizing.js for the DAK validity window that
// compression.js now imports rather than restates, and over
// lib/units/fieldUnits.js for the two power packagings that are now derived
// from their own definitions rather than quoted as roundings.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from a published case's expected block) or
// "derived" (arithmetic on engine values printed on the same row or in the
// same block, with the arithmetic stated). Where the engine keeps a constant
// to itself, the constant is MEASURED by asking the engine a question about
// itself rather than typed. Nothing here reads a clock, a random number or a
// network.
//
// A SENTENCE HERE MAY NAME A FIGURE THIS FILE COMPUTES. IT MAY NOT
// CHARACTERISE THE RELATIONSHIP BETWEEN TWO FIGURES UNLESS THAT RELATIONSHIP
// IS ITSELF COMPUTED AND PRINTED ON THE PAGE.

import fs from 'fs';
import {
  OKONO_POINTS, OKONO_SYSTEM, OKONO_SG, OKONO_EFFICIENCY,
  OKONO_MOTOR_EFFICIENCY, OKONO_Q_MAX_GPM, OKONO_BEP_GPM,
  OKONO_FRICTION_SYSTEM, OKONO_TOO_HIGH_SYSTEM,
  NOT_A_PUMP_CURVE, FLAT_CURVE,
  OKONO_SUCTION, OKONO_NPSHR_FT, OKONO_SUCTION_SWEEP_PSIA,
  FLASHING_SUCTION, FLASHING_SUCTION_BELOW,
  OKONO_SPEED_SWEEP, OKONO_TRIM_SWEEP,
  TRIM_AT_SHORTFALL_START, TRIM_JUST_INSIDE_SHORTFALL,
  TRIM_AT_WARNING, TRIM_JUST_PAST_WARNING, TRIM_AT_CAP, TRIM_PAST_CAP,
  OKONO_PARALLEL_COUNTS, OKONO_SERIES_COUNTS, REGION_FRACTIONS,
  OKONO_VISC_SWEEP_CST, OKONO_BEP_HEAD_FT, OKONO_SPEED_RPM,
  SOKU, SOKU_HEAT_RATE_BTU_HP_HR, SOKU_LHV_BTU_SCF,
  SOKU_DISCHARGE_SWEEP_PSIA, SOKU_COOL_TO_SWEEP_F, SOKU_HOT, SOKU_STAGE,
  SOKU_ETA_SWEEP, SOKU_K_SWEEP, SOKU_RATIO_SWEEP,
  SCREEN_DUTIES, ACFM_PRESSURE_SWEEP_PSIA, DRIVER_HEAT_RATE_SWEEP, STAGE_CAP_DUTY,
  DAK_COLD_PROBE, DAK_HIGH_P_PROBE, DAK_IN_WINDOW_PROBE,
  UNGUARDED_PUMP_PROBES, UNGUARDED_NPSH_PROBES, UNGUARDED_COMPRESSION_PROBES,
  IDENTITY_PAIRS,
} from '/root/fc-wip-rotating/fc3_fields.mjs';

const ROOT = process.env.FC3_ENGINES || '/root/wt-fc3-nextgen/packages/engines';
const P = await import(`${ROOT}/engines/facilities/pumps.js`);
const C = await import(`${ROOT}/engines/facilities/compression.js`);
const G = await import(`${ROOT}/engines/production/gasProperties.js`);
const GP = JSON.parse(fs.readFileSync(`${ROOT}/test-data/facilities/goldens/pumps_cases.json`, 'utf8'));
const GC = JSON.parse(fs.readFileSync(`${ROOT}/test-data/facilities/goldens/compression_cases.json`, 'utf8'));

const out = [];
const w = (s = '') => out.push(s);
const n = (x, d) => (x === null || x === undefined || !Number.isFinite(Number(x)) ? String(x) : Number(x).toFixed(d));
const e6 = (x) => n(x, 6);      // gpm, ft, psi, hp, kW, ratios, percentages
const r4 = (x) => n(x, 4);      // ft lbf per lbm, Btu per hr, acfm, degF
const f9 = (x) => n(x, 9);      // exponents, small factors, MMscfd
const soft = (r) => (r && r.error ? `{ error: "${r.error}" }` : 'no error');
/** The WHOLE return, so the shape is on the page and not only the number.
 *  Hand-rolled because JSON.stringify has no spelling for NaN or Infinity and
 *  prints both as null, which is exactly the trap this course teaches. */
const shape = (r) => {
  if (r === null || r === undefined) return String(r);
  if (typeof r !== 'object') return String(r);
  const parts = [];
  for (const [k, v] of Object.entries(r)) {
    if (typeof v === 'function') parts.push(`${k}: <function>`);
    else if (typeof v === 'number') parts.push(`${k}: ${String(v)}`);
    else if (typeof v === 'boolean') parts.push(`${k}: ${String(v)}`);
    else if (typeof v === 'string') parts.push(`${k}: "${v}"`);
    else if (Array.isArray(v)) parts.push(`${k}: [${v.map((x) => (typeof x === 'string' ? `"${x}"` : String(x))).join(' | ')}]`);
    else if (v === null) parts.push(`${k}: null`);
    else if (v === undefined) parts.push(`${k}: undefined`);
    else parts.push(`${k}: {object}`);
  }
  return `{ ${parts.join(', ')} }`;
};
/** Which exports hand back a bare number instead of an object. Probed rather
 *  than counted by eye: an earlier draft of this file said "two" and there
 *  are five. */
const BARE_NUMBER_FNS = [
  ['pumps.headFtToPsi', () => P.headFtToPsi({ headFt: 100, sg: 1 })],
  ['pumps.psiToHeadFt', () => P.psiToHeadFt({ psi: 100, sg: 1 })],
  ['compression.polytropicExponentRatio', () => C.polytropicExponentRatio({ k: 1.28, polytropicEfficiency: 0.75 })],
  ['compression.dischargeTempR', () => C.dischargeTempR({ tSuctionR: 560, ratio: 3, k: 1.28, polytropicEfficiency: 0.75 })],
  ['compression.actualInletCfm', () => C.actualInletCfm({ qMMscfd: 20, pPsia: 200, tF: 100, gasSg: 0.65 })],
].filter(([, f]) => typeof f() === 'number');

/* ------------------------------------------------------------------ *
 * The chain the Pump Station Designer runs: catalogue points give a
 * curve, a friction head at a flow gives a system, the two give a duty,
 * and the duty gives everything else.
 * ------------------------------------------------------------------ */
const OK_CURVE = P.fitPumpCurve({ points: OKONO_POINTS });
const OK_SYS = P.systemCurve(OKONO_SYSTEM);
const OK_DUTY = P.dutyPoint({ pump: OK_CURVE, system: OK_SYS, qMaxGpm: OKONO_Q_MAX_GPM });
const OK_POWER = P.pumpPower({
  qGpm: OK_DUTY.qGpm, headFt: OK_DUTY.headFt, sg: OKONO_SG,
  efficiency: OKONO_EFFICIENCY, motorEfficiency: OKONO_MOTOR_EFFICIENCY,
});
const OK_FRIC_SYS = P.systemCurve(OKONO_FRICTION_SYSTEM);
const OK_FRIC_DUTY = P.dutyPoint({ pump: OK_CURVE, system: OK_FRIC_SYS, qMaxGpm: OKONO_Q_MAX_GPM });

const SOKU_TRAIN = C.compressorTrain(SOKU);
const SOKU_ST = C.compressionStage(SOKU_STAGE);
const SOKU_FUEL = C.driverFuel({
  brakeHp: SOKU_TRAIN.totalBrakeHp,
  heatRateBtuHpHr: SOKU_HEAT_RATE_BTU_HP_HR, gasLhvBtuScf: SOKU_LHV_BTU_SCF,
});

// ------------------------------------------------------------------ header
w('# FC3 Rotating Equipment. Teaching digest.');
w('# Pump work prints to six decimals (gpm, ft, psi, hp, kW, ratios, percentages); gas work to four (ft lbf per lbm, Btu per hr, acfm, degF); exponents, small factors and MMscfd to nine; counts are whole numbers.');
w('# Field units: gpm and feet of head for pumps, MMscfd and psia and degF for gas, horsepower for both.');
w(`# Two engines: engines/facilities/pumps.js (${Object.keys(P).length} exports) and engines/facilities/compression.js (${Object.keys(C).length} exports), over engines/production/gasProperties.js. The export counts are read off the modules themselves.`);
w('# The engines are vendored at engines main 4fa37e6, which is the FC3-0 repair wave. compression.js reads its gas constant, its molecular weight of air and its Rankine offset from engines/production/gasProperties.js, its compressibility validity window from engines/facilities/separatorSizing.js, and its two power packagings from lib/units/fieldUnits.js, which pumps.js also reads.');
w('# Nothing here is read from a clock or a random number, so every line reproduces.');
w();

// ---------------------------------------------------------------- SECTION 1
w('# SECTION 1: What these engines size, and what they refuse (owned by Associate m01)');
w();
w('# App surface: the Pump Station Designer and the Compressor Station Designer run these chains live. For a pump, catalogue points give a curve, a friction head at a stated flow gives a system curve, the two cross at exactly one flow, and the power, the suction margin and the operating region are all asked THERE. For a compressor, a pressure ratio and a gas give a stage, two limits give a stage count, and the stages chain into a train.');
w('- A pump has NO operating point until it is connected to something. The pump curve and the system curve are separate objects and the duty is SOLVED as their intersection, which is why every follow-on answer moves when the system does.');
w('- These two modules size MACHINES. What the piping upstream and downstream costs in pressure is a line-sizing question and lives in engines/facilities/lineHydraulics.js.');
w('- THE SCOPE SEAM, and it is large. There is NO compressor surge line, no surge control, no recycle valve and no anti-surge calculation anywhere in the engines package. There is no mechanical seal and no bearing calculation: seals and bearings appear only inside returned prose. There is no machine curve, no wheel selection, no valve dynamics and no rod loading. A vendor performance run on a specific frame answers those, and this course does not.');
w('- Every refusal in both modules is a RETURNED OBJECT carrying an `error` string. Neither module throws. A caller checks a property rather than catching.');
w(`- ${BARE_NUMBER_FNS.length} of these exports return a BARE NUMBER rather than an object, so they have nowhere to put an error at all: ${BARE_NUMBER_FNS.map(([nm]) => nm).join(', ')}. They hold a DOCUMENTED NaN CONTRACT instead: NaN when the inputs cannot be read, never an Infinity and never a plausible number, and Section 15 shows each of them keeping it.`);
w();
w('States the pump module has no answer for, engine messages verbatim:');
[
  ['a system curve with no flow to state its friction at', () => P.systemCurve({ staticHeadFt: 100, frictionHeadFt: 200, atFlowGpm: 0 })],
  ['a system curve with a negative friction head', () => P.systemCurve({ staticHeadFt: 100, frictionHeadFt: -50, atFlowGpm: 1500 })],
  ['a pump curve from two points', () => P.fitPumpCurve({ points: OKONO_POINTS.slice(0, 2) })],
  ['a pump curve from three readings at one flow', () => P.fitPumpCurve({ points: [{ qGpm: 100, headFt: 50 }, { qGpm: 100, headFt: 60 }, { qGpm: 100, headFt: 70 }] })],
  ['a pump curve with a negative head', () => P.fitPumpCurve({ points: [{ qGpm: 0, headFt: -5 }, { qGpm: 100, headFt: 50 }, { qGpm: 200, headFt: 40 }] })],
  ['a duty with no system to work into', () => P.dutyPoint({ pump: OK_CURVE })],
  ['a duty with no pump', () => P.dutyPoint({ system: OK_SYS })],
  ['power at no flow', () => P.pumpPower({ qGpm: 0, headFt: 300, sg: 1, efficiency: 0.7 })],
  ['power at no gravity', () => P.pumpPower({ qGpm: 1000, headFt: 300, sg: 0, efficiency: 0.7 })],
  ['power at an efficiency of zero', () => P.pumpPower({ qGpm: 1000, headFt: 300, sg: 1, efficiency: 0 })],
  ['power at an efficiency above one', () => P.pumpPower({ qGpm: 1000, headFt: 300, sg: 1, efficiency: 1.0001 })],
  ['power through a motor efficiency of zero', () => P.pumpPower({ qGpm: 1000, headFt: 300, sg: 1, efficiency: 0.7, motorEfficiency: 0 })],
  ['power through a motor efficiency above one', () => P.pumpPower({ qGpm: 1000, headFt: 300, sg: 1, efficiency: 0.7, motorEfficiency: 5 })],
  ['a system curve with no static head at all', () => P.systemCurve({ frictionHeadFt: 200, atFlowGpm: 1500 })],
  ['a duty on a curve that rises with flow', () => P.dutyPoint({ pump: P.fitPumpCurve({ points: NOT_A_PUMP_CURVE }), system: OK_SYS, qMaxGpm: OKONO_Q_MAX_GPM })],
  ['NPSH at no gravity', () => P.npshAvailable({ suctionPressurePsia: 14.7, vapourPressurePsia: 0.5, sg: 0 })],
  ['NPSH with no suction pressure', () => P.npshAvailable({ vapourPressurePsia: 0.5, sg: 0.85 })],
  ['NPSH with no vapour pressure', () => P.npshAvailable({ suctionPressurePsia: 14.7, sg: 0.85 })],
  ['a margin check with no required NPSH', () => P.npshCheck({ npshaFt: 20, npshrFt: 0 })],
  ['a margin check on an available head that is not a number', () => P.npshCheck({ npshaFt: NaN, npshrFt: 12 })],
  ['NPSH with a suction friction that cannot be read', () => P.npshAvailable({ suctionPressurePsia: 14.7, vapourPressurePsia: 0.5, sg: 0.85, staticSuctionLiftFt: 4, suctionFrictionFt: NaN })],
  ['a speed change at a ratio of zero', () => P.speedChange({ qGpm: 1000, headFt: 300, brakeHp: 100, speedRatio: 0 })],
  ['a speed change with no duty to change', () => P.speedChange({ speedRatio: 1.1 })],
  ['a trim with no duty to trim', () => P.impellerTrim({ diameterRatio: 0.9 })],
  ['an impeller trimmed LARGER', () => P.impellerTrim({ qGpm: 1000, headFt: 300, brakeHp: 100, diameterRatio: 1.2 })],
  ['a viscosity correction with no BEP flow', () => P.viscosityCorrection({ qBepGpm: 0, headBepFt: 300, viscosityCSt: 100 })],
  ['a viscosity correction with no viscosity', () => P.viscosityCorrection({ qBepGpm: 1500, headBepFt: 300, viscosityCSt: 0 })],
  ['a viscosity correction at a standstill', () => P.viscosityCorrection({ qBepGpm: 1500, headBepFt: 300, viscosityCSt: 100, speedRpm: 0 })],
  ['half a pump in parallel', () => P.combineParallel({ pump: OK_CURVE, n: 0.5 })],
  ['pumps in series with no curve', () => P.combineSeries({ n: 2 })],
  ['an operating region with no best efficiency flow', () => P.operatingRegion({ qGpm: 1000, qBepGpm: 0 })],
  ['an operating region at a negative flow', () => P.operatingRegion({ qGpm: -5, qBepGpm: 1000 })],
].forEach(([label, fn]) => w(`- ${label}: ${soft(fn())}`));
w();
w('States the compression module has no answer for, engine messages verbatim:');
[
  ['a discharge below the suction', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 50, tSuctionF: 100, k: 1.28 })],
  ['a discharge equal to the suction', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 100, tSuctionF: 100, k: 1.28 })],
  ['a heat capacity ratio of one', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1 })],
  ['a duty no practical stage count can cool', () => C.stageCount(STAGE_CAP_DUTY)],
  ['a polytropic efficiency above one', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, polytropicEfficiency: 1.5 })],
  ['a per-stage ratio limit of one', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxRatioPerStage: 1 })],
  ['a suction below absolute zero', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: -600, k: 1.28 })],
  ['a discharge limit at or below the suction temperature', () => C.stageCount({ pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxDischargeF: -100 })],
  ['a stage at no rate', () => C.compressionStage({ qMMscfd: 0, pSuctionPsia: 100, tSuctionF: 100, ratio: 3, gasSg: 0.65, k: 1.28 })],
  ['a stage at a ratio of one', () => C.compressionStage({ qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, ratio: 1, gasSg: 0.65, k: 1.28 })],
  ['a stage with no gas gravity', () => C.compressionStage({ qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, ratio: 3, gasSg: 0, k: 1.28 })],
  ['a stage at a mechanical efficiency of zero', () => C.compressionStage({ qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, ratio: 3, gasSg: 0.65, k: 1.28, mechanicalEfficiency: 0 })],
  ['a stage colder than the compressibility correlation reaches', () => C.compressionStage(DAK_COLD_PROBE)],
  ['a stage at a pressure above where that correlation stops', () => C.compressionStage(DAK_HIGH_P_PROBE)],
  ['a train whose interstage specific heat cannot be read', () => C.compressorTrain({ ...SOKU, cpBtuLbF: NaN })],
  ['a machine screen with no gas gravity to take pseudo-criticals from', () => C.machineScreen({ qMMscfd: 20, pSuctionPsia: 200, tSuctionF: 100, overallRatio: 3, totalBrakeHp: 500 })],
  ['a machine screen at no rate', () => C.machineScreen({ qMMscfd: 0, pSuctionPsia: 200, tSuctionF: 100, gasSg: 0.65, overallRatio: 3, totalBrakeHp: 500 })],
  ['a driver with no power', () => C.driverFuel({ brakeHp: 0 })],
  ['a driver with no heat rate', () => C.driverFuel({ brakeHp: 1000, heatRateBtuHpHr: 0 })],
  ['a driver burning gas with no heating value', () => C.driverFuel({ brakeHp: 1000, gasLhvBtuScf: 0 })],
  ['a driver more efficient than the first law allows', () => C.driverFuel({ brakeHp: 1000, heatRateBtuHpHr: 2000 })],
].forEach(([label, fn]) => w(`- ${label}: ${soft(fn())}`));
w();
w('# HELD FOR LITERATURE, taught as a limit and never graded: the whole of the machine-screening threshold set, the viscosity correlation, the trim shortfall model, the operating-region bands, the NPSH margin rule, the 300 degF DEFAULT discharge limit and the speed-ratio band the affinity warning uses. Section 17 lists all eight held items with what each one costs.');
w();

// ---------------------------------------------------------------- SECTION 2
w('# SECTION 2: Two curves, and why neither has an operating point (owned by Associate m02)');
w();
w('The OKONO P-1201 produced-water injection pump, as its catalogue reads:');
w('| flow gpm | head ft |');
w('| --- | --- |');
OKONO_POINTS.forEach((p) => w(`| ${e6(p.qGpm)} | ${e6(p.headFt)} |`));
w();
w(`The least-squares quadratic through them, in the normalised variable q over the scale: c0 = ${e6(OK_CURVE.coefficients.c0)}, c1 = ${e6(OK_CURVE.coefficients.c1)}, c2 = ${e6(OK_CURVE.coefficients.c2)}, scale = ${e6(OK_CURVE.coefficients.scale)} (engine).`);
w(`Shutoff head, which is the fitted head at zero flow: ${e6(OK_CURVE.shutoffHeadFt)} ft (engine). R squared: ${n(OK_CURVE.rSquared, 9)} (engine). Droops: ${OK_CURVE.droops} (engine). Warning: ${OK_CURVE.warning === null ? 'null' : `"${OK_CURVE.warning}"`}.`);
w(`THE SOLVE IS REPORTED AS WELL AS THE FIT. R squared measures how well the fitted curve describes the four points; it says nothing about whether the linear system behind it was solvable, and those are two different questions. The 1-norm condition number of the normal-equation matrix is ${n(OK_CURVE.conditionNumber, 6)} (engine), and the conditioning note is ${OK_CURVE.conditioningNote === null ? 'null' : `"${OK_CURVE.conditioningNote}"`}.`);
w('The condition number across a spread of the point sets this digest fits, so the figure above has a range to sit in rather than standing alone:');
w('| point set | condition number | R squared | droops |');
w('| --- | --- | --- | --- |');
[['the OKONO catalogue', OKONO_POINTS], ['a rising set', NOT_A_PUMP_CURVE], ['three identical heads', FLAT_CURVE], ['the published curve goldens, first', GP.curves[0].points], ['the published curve goldens, last', GP.curves[GP.curves.length - 1].points]].forEach(([label, pts]) => {
  const f = P.fitPumpCurve({ points: pts });
  w(`| ${label} | ${n(f.conditionNumber, 6)} | ${n(f.rSquared, 9)} | ${f.droops} |`);
});
const CONDS = [OKONO_POINTS, NOT_A_PUMP_CURVE, FLAT_CURVE, ...GP.curves.map((r) => r.points), ...GP.duty.map((r) => r.points)]
  .map((pts) => P.fitPumpCurve({ points: pts }).conditionNumber).filter((x) => Number.isFinite(x));
w(`Normal equations square the condition number of the design matrix, which is the price of solving a least-squares problem this way, and the engine pays it in the normalised variable rather than in raw gpm. Across every point set this file fits successfully, ${CONDS.length} of them, the reported figure runs from ${n(Math.min(...CONDS), 6)} to ${n(Math.max(...CONDS), 6)} (derived as the smallest and largest of those ${CONDS.length}). Double precision carries about sixteen decimal digits, so a figure of this size costs the coefficients two or three of them.`);
w(`The scale is the largest flow in the point set, and the fitted shutoff is NOT the catalogue's own first point: the catalogue reads ${e6(OKONO_POINTS[0].headFt)} ft at zero flow against the fit's ${e6(OK_CURVE.shutoffHeadFt)} ft, a difference of ${e6(OK_CURVE.shutoffHeadFt - OKONO_POINTS[0].headFt)} ft (derived from the two figures on this line). A quadratic through four points misses all four.`);
w();
w('The fitted curve read back at each catalogue flow, with the residual:');
w('| flow gpm | catalogue head ft | fitted head ft | residual ft |');
w('| --- | --- | --- | --- |');
OKONO_POINTS.forEach((p) => {
  const h = OK_CURVE.headAt(p.qGpm);
  w(`| ${e6(p.qGpm)} | ${e6(p.headFt)} | ${e6(h)} | ${e6(h - p.headFt)} |`);
});
w('The residual column is derived on each row as the fitted head less the catalogue head.');
w();
w('The system curve, stated as a friction head at a flow rather than as a coefficient:');
w(`- static head ${e6(OKONO_SYSTEM.staticHeadFt)} ft, friction head ${e6(OKONO_SYSTEM.frictionHeadFt)} ft at ${e6(OKONO_SYSTEM.atFlowGpm)} gpm`);
w(`- the coefficient that implies: k = ${n(OK_SYS.kFt, 12)} ft per gpm squared (engine)`);
w(`- static head read back by the engine: ${e6(OK_SYS.staticHeadFt)} ft`);
w();
w('The two curves read at the same flows, so the crossing can be seen before it is solved:');
w('| flow gpm | pump head ft | system head ft | pump less system ft |');
w('| --- | --- | --- | --- |');
[0, 300, 600, 900, 1200, 1500, 1800].forEach((q) => {
  const a = OK_CURVE.headAt(q);
  const b = OK_SYS.headAt(q);
  w(`| ${e6(q)} | ${e6(a)} | ${e6(b)} | ${e6(a - b)} |`);
});
w('The last column is derived on each row. It starts positive and ends negative, and the flow where it is zero is the duty point Section 3 solves.');
w();
w('A point set that is not a centrifugal head curve, because it RISES with flow:');
const NOT_FIT = P.fitPumpCurve({ points: NOT_A_PUMP_CURVE });
w(`- points: ${NOT_A_PUMP_CURVE.map((p) => `${e6(p.qGpm)} gpm at ${e6(p.headFt)} ft`).join(', ')}`);
w(`- fitted c2 = ${e6(NOT_FIT.coefficients.c2)} (engine), R squared ${n(NOT_FIT.rSquared, 9)}, droops ${NOT_FIT.droops}`);
w(`- warning: "${NOT_FIT.warning}"`);
w('A drooping curve has a negative c2. This one is positive, the engine says so in prose, and it also says so in a field: `droops` is the machine-readable half of that same warning, and Section 3 is where it is read.');
w();
w('A point set of three identical heads:');
const FLAT_FIT = P.fitPumpCurve({ points: FLAT_CURVE });
w(`- fitted c2 = ${e6(FLAT_FIT.coefficients.c2)}, R squared ${n(FLAT_FIT.rSquared, 9)}, droops ${FLAT_FIT.droops} (engine)`);
w(`- warning: "${FLAT_FIT.warning}"`);
w('R squared is the share of the variance the fit explains. Three identical heads have no variance to explain, the total sum of squares is zero and the quantity is undefined, so the engine returns null rather than a number. A horizontal line explains nothing, and null is what "there is nothing to explain" looks like in a return.');
w();

// ---------------------------------------------------------------- SECTION 3
w('# SECTION 3: The duty point, solved (owned by Associate m03)');
w();
w(`OKONO against its stated system: the curves cross at ${e6(OK_DUTY.qGpm)} gpm and ${e6(OK_DUTY.headFt)} ft (engine).`);
w(`At that flow the pump makes ${e6(OK_CURVE.headAt(OK_DUTY.qGpm))} ft and the system demands ${e6(OK_DUTY.systemHeadFt)} ft (both engine, the second read back off the return). The difference is ${OK_CURVE.headAt(OK_DUTY.qGpm) - OK_DUTY.systemHeadFt} ft (derived from the two figures on this line), which is what "solved" means here.`);
w('THE SOLVE REPORTS ITSELF. Bisection on the head difference, and the return carries the evidence it finished on:');
w(`- halvings taken: ${OK_DUTY.iterations} (engine), out of a cap of 200`);
w(`- the bracket it stopped on: ${OK_DUTY.bracketGpm} gpm (engine)`);
w(`- the head difference at the flow it returned: ${OK_DUTY.residualFt} ft (engine)`);
w(`- converged: ${OK_DUTY.converged} (engine); warning ${OK_DUTY.warning === null ? 'null' : `"${OK_DUTY.warning}"`}`);
w('The flag is made of the residual as well as the bracket, and it has to be. On a bracketed sign change bisection always collapses, so a flag made only of the bracket width could never come back false and would be a check that validates nothing.');
w('THE CASE IT DOES CATCH, run here as a negative control rather than described. A curve that returns a non-finite head over part of the range sends the comparison false at every step there and marches the search quietly to the bottom of it:');
const POISONED = {
  droops: true,
  headAt: (q) => ((q > 900 && q < 1400) ? NaN : OK_CURVE.headAt(q)),
};
const POISONED_DUTY = P.dutyPoint({ pump: POISONED, system: OK_SYS, qMaxGpm: OKONO_Q_MAX_GPM });
w(`- the flow it returns: ${e6(POISONED_DUTY.qGpm)} gpm, against the ${e6(OK_DUTY.qGpm)} gpm the same curves really cross at, which is ${e6(OK_DUTY.qGpm - POISONED_DUTY.qGpm)} gpm away (derived from the two figures on this line)`);
w(`- the bracket it finished on: ${POISONED_DUTY.bracketGpm} gpm, after ${POISONED_DUTY.iterations} halvings`);
w(`- the head difference at that flow: ${POISONED_DUTY.residualFt} ft`);
w(`- converged: ${POISONED_DUTY.converged} (engine)`);
w(`A flag made only of that bracket would have called this solve converged: the bracket is ${POISONED_DUTY.bracketGpm} gpm, which is at the resolution of the numbers themselves. The residual half is the half that can be false, and here it is ${POISONED_DUTY.residualFt} ft.`);
w('That is what a check which CAN fail looks like beside one that cannot, and the same question is worth asking of every flag in this course: what input makes it false?');
/** 200 halvings with no stopping test, which is what this solve used to do.
 *  Computed here so the sentence below is a measurement and not a memory. */
const blindBisect = (pump, system, hi) => {
  let lo = 0; let high = hi;
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + high) / 2;
    if (pump.headAt(mid) - system.headAt(mid) > 0) lo = mid; else high = mid;
  }
  return (lo + high) / 2;
};
const BLIND = blindBisect(OK_CURVE, OK_SYS, OKONO_Q_MAX_GPM);
w(`It stops when the midpoint stops moving rather than after a fixed count. A fixed 200 halvings with no stopping test gives ${e6(BLIND)} gpm on this same pair of curves against the engine's ${e6(OK_DUTY.qGpm)} gpm, a difference of ${BLIND - OK_DUTY.qGpm} gpm (derived from the two figures on this line), so nothing moved when the report was added: the loop breaks exactly where the blind one was already standing still.`);
w();
w('The same pump against a friction-dominated system, which is the case Section 10 needs:');
w(`- static head ${e6(OKONO_FRICTION_SYSTEM.staticHeadFt)} ft, friction head ${e6(OKONO_FRICTION_SYSTEM.frictionHeadFt)} ft at ${e6(OKONO_FRICTION_SYSTEM.atFlowGpm)} gpm, k = ${n(OK_FRIC_SYS.kFt, 12)} ft per gpm squared (engine)`);
w(`- duty: ${e6(OK_FRIC_DUTY.qGpm)} gpm at ${e6(OK_FRIC_DUTY.headFt)} ft (engine)`);
w(`- of that head, ${e6(OKONO_FRICTION_SYSTEM.staticHeadFt)} ft is static and ${e6(OK_FRIC_DUTY.headFt - OKONO_FRICTION_SYSTEM.staticHeadFt)} ft is friction (derived: the duty head less the stated static head)`);
w();
w('Moving the system moves the duty, which is the point of solving it rather than typing it:');
w('| static head ft | duty flow gpm | duty head ft |');
w('| --- | --- | --- |');
[60, 120, 180, 210, 260, 320, 400].forEach((s) => {
  const sys = P.systemCurve({ ...OKONO_SYSTEM, staticHeadFt: s });
  const d = P.dutyPoint({ pump: OK_CURVE, system: sys, qMaxGpm: OKONO_Q_MAX_GPM });
  w(`| ${e6(s)} | ${d.error ? 'refused' : e6(d.qGpm)} | ${d.error ? 'refused' : e6(d.headFt)} |`);
});
w();
w('A curve that RISES with flow is not a centrifugal head curve, so where it crosses a system curve is not a duty point:');
w(`- ${soft(P.dutyPoint({ pump: NOT_FIT, system: OK_SYS, qMaxGpm: OKONO_Q_MAX_GPM }))}`);
w('That is the `droops` flag of Section 2 being read. The fit and the duty are two halves of one module asked about the same curve, and the flag is how the half that judges the shape tells the half that solves on it. Two halves of one module that answer differently about one curve are a module contradicting itself, and the half that trusts is the one to doubt.');
w();
w('The two refusals that are real answers rather than hidden errors:');
const TOO_HIGH = P.dutyPoint({ pump: OK_CURVE, system: P.systemCurve(OKONO_TOO_HIGH_SYSTEM), qMaxGpm: OKONO_Q_MAX_GPM });
w(`- a system the pump cannot start: ${soft(TOO_HIGH)}`);
w(`  it hands back the evidence: shutoff head ${e6(TOO_HIGH.shutoffHeadFt)} ft against a system static head of ${e6(TOO_HIGH.systemStaticHeadFt)} ft (engine). The gap is ${e6(TOO_HIGH.systemStaticHeadFt - TOO_HIGH.shutoffHeadFt)} ft (derived from the two figures on this line).`);
w(`- a search limit set below the crossing: ${soft(P.dutyPoint({ pump: OK_CURVE, system: OK_SYS, qMaxGpm: 200 }))}`);
w('  That one is a question about the search rather than about the machine, and the message says which.');
w();

// ---------------------------------------------------------------- SECTION 4
w('# SECTION 4: Power, head and pressure, and the constants measured out of the engine (owned by Associate m04)');
w();
w('# App surface: the Duty Point tab prints these four figures under the duty. They are all asked AT the solved duty, so they all move when the system does.');
w(`At the OKONO duty of ${e6(OK_DUTY.qGpm)} gpm and ${e6(OK_DUTY.headFt)} ft, on a fluid of gravity ${e6(OKONO_SG)} at an efficiency of ${e6(OKONO_EFFICIENCY)} through a motor of ${e6(OKONO_MOTOR_EFFICIENCY)}:`);
w(`- hydraulic power ${e6(OK_POWER.hydraulicHp)} hp (engine)`);
w(`- brake power ${e6(OK_POWER.brakeHp)} hp (engine)`);
w(`- motor input ${e6(OK_POWER.motorInputHp)} hp, ${e6(OK_POWER.motorInputKw)} kW (engine)`);
w(`- the pump loses ${e6(OK_POWER.brakeHp - OK_POWER.hydraulicHp)} hp and the motor a further ${e6(OK_POWER.motorInputHp - OK_POWER.brakeHp)} hp (derived from the three figures above)`);
w();
w(`The duty head as a discharge pressure: ${e6(P.headFtToPsi({ headFt: OK_DUTY.headFt, sg: OKONO_SG }))} psi (engine), and converting it back gives ${e6(P.psiToHeadFt({ psi: P.headFtToPsi({ headFt: OK_DUTY.headFt, sg: OKONO_SG }), sg: OKONO_SG }))} ft (engine).`);
w('The same head on a lighter and a heavier fluid, because head is a property of the machine and pressure is a property of the fluid in it:');
w('| gravity | head ft | discharge psi |');
w('| --- | --- | --- |');
[0.62, 0.85, 1.00, OKONO_SG, 1.25].forEach((sg) => w(`| ${e6(sg)} | ${e6(OK_DUTY.headFt)} | ${e6(P.headFtToPsi({ headFt: OK_DUTY.headFt, sg }))} |`));
w();
w('THE CONSTANTS. pumps.js exports no constants; the three it names internally are a percentage slack and the two ends of the speed band, all three measured out of the engine in Section 8, and every packaging it computes with is written inline at its point of use or imported. Each one below is MEASURED by asking the engine a question about itself.');
const M_231 = P.psiToHeadFt({ psi: 1, sg: 1 });
const UNIT_POWER = P.pumpPower({ qGpm: 1, headFt: 1, sg: 1, efficiency: 1 });
const M_3960 = 1 / UNIT_POWER.hydraulicHp;
const KW_PROBE = P.pumpPower({ qGpm: 1000, headFt: 100, sg: 1, efficiency: 1, motorEfficiency: 1 });
const DEFAULT_MOTOR_PROBE = P.pumpPower({ qGpm: 1000, headFt: 100, sg: 1, efficiency: 1 });
w(`- feet of head per psi at gravity 1, from psiToHeadFt at one psi: ${n(M_231, 9)}`);
w(`- the horsepower packaging, from one over the hydraulic power at unit flow, head, gravity and efficiency: ${n(M_3960, 6)}`);
w(`- kilowatts per horsepower, from the motor input in kW over the motor input in hp at an efficiency of one: ${n(KW_PROBE.motorInputKw / KW_PROBE.motorInputHp, 12)}`);
w(`- the DEFAULT motor efficiency, from the brake power over the motor input when the argument is omitted: ${n(DEFAULT_MOTOR_PROBE.brakeHp / DEFAULT_MOTOR_PROBE.motorInputHp, 12)}`);
w();
w('Both pump packagings carry a water density inside them, and they can be compared:');
const RHO_A = 144 / M_231;
const RHO_B = (33000 / M_3960) * (1728 / 231);
w(`- the ft-per-psi packaging implies ${n(RHO_A, 12)} lb per ft3 (derived: 144 square inches per square foot divided by the measured ${n(M_231, 9)})`);
w(`- the horsepower packaging implies ${n(RHO_B, 12)} lb per ft3 (derived: 33000 ft lbf per minute per horsepower divided by the measured ${n(M_3960, 6)}, times 1728 cubic inches per cubic foot over 231 cubic inches per gallon)`);
w(`- the difference between them: ${RHO_A - RHO_B} lb per ft3 (derived from the two rows above)`);
w(`- their quotient, which is what ties the two packagings together and is measurable directly: ${n(M_3960 / M_231, 12)} (derived from the two measured constants)`);
w('# HELD FOR LITERATURE, taught as a limit and never graded: what that implied density is away from real water. The packagings are the engine\'s own definitions and are measurable; the handbook figure they approximate is not in this repository.');
w();

// ---------------------------------------------------------------- SECTION 5
w('# SECTION 5: Where the duty landed (owned by Associate m05)');
w();
const OK_REGION = P.operatingRegion({ qGpm: OK_DUTY.qGpm, qBepGpm: OKONO_BEP_GPM });
w(`The OKONO duty of ${e6(OK_DUTY.qGpm)} gpm against a stated best efficiency flow of ${e6(OKONO_BEP_GPM)} gpm: ${e6(OK_REGION.percentOfBep)} percent, region "${OK_REGION.region}", preferred ${OK_REGION.preferred} (engine).`);
w(`Note: ${OK_REGION.note === null ? 'null' : `"${OK_REGION.note}"`}`);
w();
w('The four bands, with the value either side of every boundary, because a band that misclassifies its own edge is a defect:');
w('| flow gpm | percent of BEP | region | preferred | note present |');
w('| --- | --- | --- | --- | --- |');
REGION_FRACTIONS.forEach((f) => {
  const q = OKONO_BEP_GPM * f;
  const r = P.operatingRegion({ qGpm: q, qBepGpm: OKONO_BEP_GPM });
  w(`| ${e6(q)} | ${e6(r.percentOfBep)} | ${r.region} | ${r.preferred} | ${r.note !== null} |`);
});
w();
w('The notes themselves, which are the part of this return that says what a region costs:');
[0.60, 1.30, 0.30, 1.60].forEach((f) => {
  const r = P.operatingRegion({ qGpm: OKONO_BEP_GPM * f, qBepGpm: OKONO_BEP_GPM });
  w(`- at ${e6(r.percentOfBep)} percent, "${r.region}": ${r.note}`);
});
w();
w('# HELD FOR LITERATURE, taught as a limit and never graded: the bands themselves, at 50, 70, 120 and 140 percent of best efficiency flow. They are customary and this repository holds no publication for them, so no graded value in this course is a region, a percentage of best efficiency flow or a preferred flag.');
w('Read the note above 120 percent carefully, because it is the one that names its own limit. The required NPSH climbs steeply with flow there, and this module carries NPSHr as a SINGLE NUMBER rather than as a curve: it is a scalar input to the check in Section 7, and there is no required-NPSH-against-flow curve anywhere in the module. The note says so, which is the difference between a warning a reader can act on and one they cannot: the vendor curve has to be read at THIS flow before the suction margin means anything.');
w();

// ---------------------------------------------------------------- SECTION 6
w('# SECTION 6: NPSH available, from the real suction side (owned by Professional m01)');
w();
w('# App surface: the Suction and Changes tab builds this from the suction survey rather than from a number typed into a box, which is what makes the second and third rows below movable.');
const OK_NPSH = P.npshAvailable(OKONO_SUCTION);
w(`The OKONO suction: ${e6(OKONO_SUCTION.suctionPressurePsia)} psia over a liquid whose vapour pressure is ${e6(OKONO_SUCTION.vapourPressurePsia)} psia, gravity ${e6(OKONO_SUCTION.sg)}, the source ${e6(OKONO_SUCTION.staticSuctionLiftFt)} ft above the pump, ${e6(OKONO_SUCTION.suctionFrictionFt)} ft of suction friction.`);
w(`- the pressure head: ${e6(OK_NPSH.pressureHeadFt)} ft (engine)`);
w(`- NPSH available: ${e6(OK_NPSH.npshaFt)} ft (engine)`);
w(`- warning: ${OK_NPSH.warning === null ? 'null' : `"${OK_NPSH.warning}"`}`);
w(`- the three parts sum on the row: ${e6(OK_NPSH.pressureHeadFt)} plus ${e6(OKONO_SUCTION.staticSuctionLiftFt)} less ${e6(OKONO_SUCTION.suctionFrictionFt)} gives ${e6(OK_NPSH.pressureHeadFt + OKONO_SUCTION.staticSuctionLiftFt - OKONO_SUCTION.suctionFrictionFt)} ft (derived), which is the engine\'s answer.`);
w();
w('Padding the suction drum, everything else held:');
w('| suction psia | pressure head ft | NPSH available ft |');
w('| --- | --- | --- |');
OKONO_SUCTION_SWEEP_PSIA.forEach((p) => {
  const r = P.npshAvailable({ ...OKONO_SUCTION, suctionPressurePsia: p });
  w(`| ${e6(p)} | ${e6(r.pressureHeadFt)} | ${e6(r.npshaFt)} |`);
});
w();
w('A suction already AT the vapour pressure, and one already below it:');
const FL_AT = P.npshAvailable(FLASHING_SUCTION);
const FL_BELOW = P.npshAvailable(FLASHING_SUCTION_BELOW);
w(`- at it (${e6(FLASHING_SUCTION.suctionPressurePsia)} psia against ${e6(FLASHING_SUCTION.vapourPressurePsia)} psia): pressure head ${e6(FL_AT.pressureHeadFt)} ft, NPSH available ${e6(FL_AT.npshaFt)} ft, warning "${FL_AT.warning}"`);
w(`- below it (${e6(FLASHING_SUCTION_BELOW.suctionPressurePsia)} psia against ${e6(FLASHING_SUCTION_BELOW.vapourPressurePsia)} psia): pressure head ${e6(FL_BELOW.pressureHeadFt)} ft, NPSH available ${e6(FL_BELOW.npshaFt)} ft, warning "${FL_BELOW.warning}"`);
w('The second row is the one worth reading twice: the pressure head is negative and the static column still leaves the available head positive, so a caller reading only the number sees an ordinary answer. The warning is the only thing that says the liquid is already flashing.');
w();

// ---------------------------------------------------------------- SECTION 7
w('# SECTION 7: The margin, and the rule it is judged against (owned by Professional m02)');
w();
w(`Against the vendor\'s stated required NPSH of ${e6(OKONO_NPSHR_FT)} ft, across the same suction sweep:`);
w('| suction psia | NPSH available ft | margin ft | required margin ft | ratio | pass | severity |');
w('| --- | --- | --- | --- | --- | --- | --- |');
OKONO_SUCTION_SWEEP_PSIA.forEach((p) => {
  const a = P.npshAvailable({ ...OKONO_SUCTION, suctionPressurePsia: p });
  const c = P.npshCheck({ npshaFt: a.npshaFt, npshrFt: OKONO_NPSHR_FT });
  w(`| ${e6(p)} | ${e6(a.npshaFt)} | ${e6(c.marginFt)} | ${e6(c.requiredMarginFt)} | ${e6(c.ratio)} | ${c.pass} | ${c.severity} |`);
});
w();
w('The three severities, each with the message the engine attaches:');
UNGUARDED_NPSH_PROBES.slice(2).forEach(([label, inp]) => {
  const c = P.npshCheck(inp);
  w(`- ${label}: margin ${e6(c.marginFt)} ft against a required ${e6(c.requiredMarginFt)} ft, "${c.severity}", pass ${c.pass}`);
  w(`  note: ${c.note === null ? 'null' : `"${c.note}"`}`);
});
w();
w('What the check returns when it is handed an available head it cannot read:');
UNGUARDED_NPSH_PROBES.slice(0, 2).forEach(([label, inp]) => {
  w(`- ${label}: ${shape(P.npshCheck(inp))}`);
});
w('A verdict needs an input. The available head is the whole of what this function judges, so an unreadable one is refused rather than classified: there is no severity to report and no pass flag to set, and the refusal says which of the two inputs it could not read.');
w();
w('THE RULE IS A MARGIN RULE, and both halves of its maximum are MEASURED out of the engine rather than typed, and so is the required NPSH where they change places:');
const reqMargin = (r) => P.npshCheck({ npshaFt: r + 1e4, npshrFt: r }).requiredMarginFt;
const MARGIN_FLOOR_FT = reqMargin(1e-6);
const MARGIN_FRACTION = reqMargin(1e6) / 1e6;
let mlo = 1e-6; let mhi = 1e6;
for (let i = 0; i < 200; i += 1) {
  const mid = (mlo + mhi) / 2;
  if (mid === mlo || mid === mhi) break;
  if (reqMargin(mid) > MARGIN_FLOOR_FT) mhi = mid; else mlo = mid;
}
w(`- the floor, from the required margin at a required NPSH small enough that the percentage cannot reach it: ${n(MARGIN_FLOOR_FT, 9)} ft`);
w(`- the fraction, from the required margin at a required NPSH large enough that the floor cannot reach it, divided by that required NPSH: ${n(MARGIN_FRACTION, 9)}`);
w(`- the required NPSH where the two are equal, found by halving until the engine's own answer leaves the floor: ${n(mhi, 9)} ft (engine, by bisection on its own return)`);
w(`- and the quotient of the first two, which is the same figure by a different route: ${n(MARGIN_FLOOR_FT / MARGIN_FRACTION, 9)} ft (derived from the two rows above)`);
w('| required NPSH ft | required margin the engine applies ft | the half that bound | the available head that exactly satisfies it ft | the ratio there |');
w('| --- | --- | --- | --- | --- |');
[4, OKONO_NPSHR_FT, 12, 30].forEach((r) => {
  const m = reqMargin(r);
  const atBoundary = P.npshCheck({ npshaFt: r + m, npshrFt: r });
  w(`| ${e6(r)} | ${e6(m)} | ${m > MARGIN_FLOOR_FT ? 'the fraction' : 'the floor'} | ${e6(r + m)} | ${n(atBoundary.ratio, 9)} |`);
});
w('A MARGIN RULE AND A RATIO RULE ARE NOT THE SAME RULE, and the last column is where the difference shows. On the rows where the fraction binds, the ratio at the boundary is the same number on each of them, so a reader could mistake the margin rule for a rule on that ratio and never notice. On the row where the floor binds it is a different number, and the next line measures how different.');
w(`Read the two governed rows against each other: at a required NPSH of ${e6(OKONO_NPSHR_FT)} ft the boundary ratio is ${n(P.npshCheck({ npshaFt: OKONO_NPSHR_FT + reqMargin(OKONO_NPSHR_FT), npshrFt: OKONO_NPSHR_FT }).ratio, 9)} and at ${e6(4)} ft it is ${n(P.npshCheck({ npshaFt: 4 + reqMargin(4), npshrFt: 4 }).ratio, 9)}, a difference of ${P.npshCheck({ npshaFt: 4 + reqMargin(4), npshrFt: 4 }).ratio - P.npshCheck({ npshaFt: OKONO_NPSHR_FT + reqMargin(OKONO_NPSHR_FT), npshrFt: OKONO_NPSHR_FT }).ratio} (derived from the two figures on this line).`);
w(`# HELD FOR LITERATURE, taught as a limit and never graded: the margin rule itself, the larger of the ${n(MARGIN_FLOOR_FT, 9)} ft floor and the ${n(MARGIN_FRACTION, 9)} fraction measured above. It is customary and this repository holds no publication for it, so no graded value in this course is a required margin, a pass flag or a severity.`);
w();

// ---------------------------------------------------------------- SECTION 8
w('# SECTION 8: A speed change and a trim are not the same thing (owned by Professional m03)');
w();
w(`Both are asked at the OKONO duty of ${e6(OK_DUTY.qGpm)} gpm, ${e6(OK_DUTY.headFt)} ft and ${e6(OK_POWER.brakeHp)} brake hp.`);
w();
w('A speed change, which follows the affinity laws exactly for a geometrically similar machine:');
w('| speed ratio | flow gpm | head ft | brake hp | head over the base head | less the ratio squared | power over the base power | less the ratio cubed | warned |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
OKONO_SPEED_SWEEP.forEach((s) => {
  const r = P.speedChange({ qGpm: OK_DUTY.qGpm, headFt: OK_DUTY.headFt, brakeHp: OK_POWER.brakeHp, speedRatio: s });
  const hq = r.headFt / OK_DUTY.headFt;
  const pq = r.brakeHp / OK_POWER.brakeHp;
  w(`| ${e6(s)} | ${e6(r.qGpm)} | ${e6(r.headFt)} | ${e6(r.brakeHp)} | ${n(hq, 9)} | ${hq - s ** 2} | ${n(pq, 9)} | ${pq - s ** 3} | ${r.warning !== null} |`);
});
w('The four quotient and difference columns are derived on each row. The two difference columns are what "exactly" means here: the head quotient against the speed ratio squared and the power quotient against it cubed, subtracted rather than described.');
w();
w('THE LAWS ARE EXACT AND THE MACHINE IS NOT, so the engine carries a band it will report a ratio without comment over. Its two ends are measured by walking the ratio until the warning changes state:');
const speedWarns = (ratio) => P.speedChange({ qGpm: 1, headFt: 1, brakeHp: 1, speedRatio: ratio }).warning !== null;
const speedEdge = (lo, hi) => {
  let a = lo; let b = hi;
  for (let i = 0; i < 200; i += 1) {
    const mid = (a + b) / 2;
    if (mid === a || mid === b) break;
    if (speedWarns(mid) === speedWarns(lo)) a = mid; else b = mid;
  }
  return b;
};
w(`- the lower end, walked up from a ratio of ${e6(0.01)}: ${n(speedEdge(0.01, 1), 12)}`);
w(`- the upper end, walked down from a ratio of ${e6(5)}: ${n(speedEdge(5, 1), 12)}`);
const FAR_SPEED = P.speedChange({ qGpm: OK_DUTY.qGpm, headFt: OK_DUTY.headFt, brakeHp: OK_POWER.brakeHp, speedRatio: 100 });
w(`- at a ratio of ${e6(100)} the laws still apply, and the engine still applies them: ${e6(FAR_SPEED.qGpm)} gpm, ${e6(FAR_SPEED.headFt)} ft, ${e6(FAR_SPEED.brakeHp)} brake hp, with "${FAR_SPEED.warning}"`);
w('That band is a SANITY BOUND rather than a published correlation limit. No publication in this repository says where the affinity laws stop describing a real machine, so the two ends above are a judgement about when a reader should be told to think rather than a measurement of where the physics fails. It is warned on and never used to refuse, and nothing computed from it decides a value.');
w();
w('An impeller trim, which does not:');
w('| trim ratio | trim percent | ideal flow gpm | real flow gpm | ideal head ft | real head ft | shortfall percent | brake hp | implied efficiency ratio | warning |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
OKONO_TRIM_SWEEP.forEach((d) => {
  const r = P.impellerTrim({ qGpm: OK_DUTY.qGpm, headFt: OK_DUTY.headFt, brakeHp: OK_POWER.brakeHp, diameterRatio: d });
  w(`| ${e6(d)} | ${e6(r.trimPercent)} | ${e6(r.idealQGpm)} | ${e6(r.qGpm)} | ${e6(r.idealHeadFt)} | ${e6(r.headFt)} | ${e6(r.shortfallPct)} | ${e6(r.brakeHp)} | ${n(r.impliedEfficiencyRatio, 9)} | ${r.warning === null ? 'null' : 'set'} |`);
});
w();
w('The warning, in full, at the trim where it first fires and at a deep one:');
[TRIM_JUST_PAST_WARNING, TRIM_PAST_CAP].forEach((d) => {
  const r = P.impellerTrim({ qGpm: OK_DUTY.qGpm, headFt: OK_DUTY.headFt, brakeHp: OK_POWER.brakeHp, diameterRatio: d });
  w(`- at a trim ratio of ${e6(d)}: "${r.warning}"`);
});
const T_AT_WARN = P.impellerTrim({ qGpm: OK_DUTY.qGpm, headFt: OK_DUTY.headFt, brakeHp: OK_POWER.brakeHp, diameterRatio: TRIM_AT_WARNING });
w(`- at a trim ratio of ${e6(TRIM_AT_WARNING)}, trim percent ${e6(T_AT_WARN.trimPercent)}: warning ${T_AT_WARN.warning === null ? 'null' : 'set'}. The threshold is exclusive, so the vendor limit itself does not warn.`);
w();
w('The two boundaries the trim rule turns on, with the value either side:');
[[TRIM_AT_SHORTFALL_START, 'where the shortfall is meant to begin'], [TRIM_JUST_INSIDE_SHORTFALL, 'one ten-thousandth past it'], [TRIM_AT_CAP, 'where the shortfall reaches its cap'], [TRIM_PAST_CAP, 'far past the cap']].forEach(([d, label]) => {
  const r = P.impellerTrim({ qGpm: OK_DUTY.qGpm, headFt: OK_DUTY.headFt, brakeHp: OK_POWER.brakeHp, diameterRatio: d });
  w(`- ${label}, trim ratio ${e6(d)}: trim percent ${r.trimPercent}, shortfall percent ${r.shortfallPct}`);
});
const trimPctAt = (d) => P.impellerTrim({ qGpm: 1, headFt: 1, brakeHp: 1, diameterRatio: d }).trimPercent;
const shortAt = (d) => P.impellerTrim({ qGpm: 1, headFt: 1, brakeHp: 1, diameterRatio: d }).shortfallPct;
let slo = TRIM_AT_SHORTFALL_START; let shi = 0.9;
for (let i = 0; i < 200; i += 1) {
  const mid = (slo + shi) / 2;
  if (mid === slo || mid === shi) break;
  if (shortAt(mid) === 0) slo = mid; else shi = mid;
}
w(`Read the first of those four twice, because it is where binary floating point meets a rule written in decimal. A trim ratio of ${e6(TRIM_AT_SHORTFALL_START)} is meant to be exactly five percent and the rule says five percent carries no shortfall; the subtraction puts the trim percent at ${trimPctAt(TRIM_AT_SHORTFALL_START)}, which is above five by ${trimPctAt(TRIM_AT_SHORTFALL_START) - 5} (derived from the two figures on this line). The shortfall percent on that row is nevertheless ${shortAt(TRIM_AT_SHORTFALL_START)}, so the comparison is carrying a slack.`);
w(`The slack is MEASURED by halving the trim ratio until the shortfall leaves zero: the last ratio with no shortfall gives a trim percent of ${trimPctAt(slo)} and the first with one gives ${trimPctAt(shi)}, so the boundary the engine really applies sits ${trimPctAt(shi) - 5} above five percent (derived from those two figures). The rule is written in whole percent and the value it is compared against is not one, and that gap is what the slack spans.`);
w(`The warning boundary carries the same slack: at a trim ratio of ${e6(TRIM_AT_WARNING)} the trim percent is ${P.impellerTrim({ qGpm: 1, headFt: 1, brakeHp: 1, diameterRatio: TRIM_AT_WARNING }).trimPercent} and the warning is ${P.impellerTrim({ qGpm: 1, headFt: 1, brakeHp: 1, diameterRatio: TRIM_AT_WARNING }).warning === null ? 'null' : 'set'}.`);
w();
const T_CAP = P.impellerTrim({ qGpm: OK_DUTY.qGpm, headFt: OK_DUTY.headFt, brakeHp: OK_POWER.brakeHp, diameterRatio: TRIM_AT_CAP });
w(`The power leg of a trim is the IDEAL CUBE while the head and flow legs are both de-rated, so the return implies an efficiency change. At a trim ratio of ${e6(TRIM_AT_CAP)} the flow is ${n(T_CAP.qGpm / T_CAP.idealQGpm, 9)} of ideal and the head is ${n(T_CAP.headFt / T_CAP.idealHeadFt, 9)} of ideal (both derived on this line from the columns above), so the product of the two is ${n((T_CAP.qGpm / T_CAP.idealQGpm) * (T_CAP.headFt / T_CAP.idealHeadFt), 9)} while the brake power is ${n(T_CAP.brakeHp / (OK_POWER.brakeHp * TRIM_AT_CAP ** 3), 9)} of the ideal cube.`);
w(`That implied ratio is RETURNED rather than left to be discovered by division: the engine reports impliedEfficiencyRatio = ${n(T_CAP.impliedEfficiencyRatio, 9)} on that row, against the ${n((T_CAP.qGpm / T_CAP.idealQGpm) * (T_CAP.headFt / T_CAP.idealHeadFt), 9)} derived above, a difference of ${(T_CAP.impliedEfficiencyRatio - (T_CAP.qGpm / T_CAP.idealQGpm) * (T_CAP.headFt / T_CAP.idealHeadFt))} (derived from the two figures on this line).`);
w('The power leg is LEFT as the ideal cube on purpose. The shortfall model has no publication in this repository, so de-rating the power here would be inventing a second unsourced model on top of the first. What the engine owes the reader is the arithmetic it actually did, and that is what the field carries.');
w();
w('# HELD FOR LITERATURE, taught as a limit and never graded: the trim shortfall model, zero at or under five percent and then 0.006 per further percent, capped at 0.12, applied whole to head and half to flow. The engine\'s own comment calls it "the published shortfall" and names no publication, so no graded value in this course is a trimmed flow, head or shortfall. The speed law above is NOT held: it is the affinity law and it is exact.');
w();

// ---------------------------------------------------------------- SECTION 9
w('# SECTION 9: An affinity law applied to a duty point is not a new duty point (owned by Professional m04)');
w();
w('# App surface. The Pump Station Designer draws its chart and its duty headline from a scaled CURVE re-intersected with the system, and it also shows where the old duty point lands on that new curve, in a card headed "What a change would buy". Those are two different questions and the studio labels them as two: the crossing is the operating point, and the affinity map is where the machine you had ends up on the machine you now have.');
w('The rows below reproduce that composition over the vendored engine. The scaling factors are READ OUT OF THE ENGINE at a unit duty rather than restated here, which is the same thing the studio does and is what keeps the curve and the point from drifting apart when the engine moves.');
w();
/** The studio's composition, replicated: ask the engine what a change
 *  does to a duty of 1 gpm at 1 ft at 1 bhp, which IS the factor because
 *  both laws are homogeneous of degree one in the duty; then scale the
 *  whole curve by it and re-intersect. Every head on it comes from the
 *  engine's own fitted curve and its own laws. */
const changeFactors = (speedRatio, diameterRatio) => {
  const t = P.impellerTrim({ qGpm: 1, headFt: 1, brakeHp: 1, diameterRatio });
  const v = P.speedChange({ qGpm: 1, headFt: 1, brakeHp: 1, speedRatio });
  return { qScale: t.qGpm * v.qGpm, hScale: t.headFt * v.headFt };
};
const studioScaled = (speedRatio, diameterRatio) => {
  const { qScale, hScale } = changeFactors(speedRatio, diameterRatio);
  return { headAt: (q) => OK_CURVE.headAt(q / qScale) * hScale, droops: OK_CURVE.droops };
};
w('The factors themselves, at a unit duty, so the scaling above is on the page rather than behind it:');
w('| speed ratio | trim ratio | flow factor | head factor |');
w('| --- | --- | --- | --- |');
[[1, 1], [1, 0.95], [1, 0.8], [1.1, 1], [0.8, 1], [1.1, 0.9]].forEach(([sr, dr]) => {
  const f = changeFactors(sr, dr);
  w(`| ${e6(sr)} | ${e6(dr)} | ${n(f.qScale, 9)} | ${n(f.hScale, 9)} |`);
});
w();
w('A trim, both ways:');
w('| trim ratio | re-solved flow gpm | re-solved head ft | one-point flow gpm | one-point head ft | flow quotient | head quotient |');
w('| --- | --- | --- | --- | --- | --- | --- |');
[1.00, 0.95, 0.90, 0.85, 0.80, 0.75].forEach((d) => {
  const re = P.dutyPoint({ pump: studioScaled(1, d), system: OK_SYS, qMaxGpm: OKONO_Q_MAX_GPM });
  const one = P.impellerTrim({ qGpm: OK_DUTY.qGpm, headFt: OK_DUTY.headFt, brakeHp: OK_POWER.brakeHp, diameterRatio: d });
  w(`| ${e6(d)} | ${e6(re.qGpm)} | ${e6(re.headFt)} | ${e6(one.qGpm)} | ${e6(one.headFt)} | ${n(one.qGpm / re.qGpm, 9)} | ${n(one.headFt / re.headFt, 9)} |`);
});
w('The last two columns are derived on each row as the one-point answer over the re-solved answer.');
w();
w('A speed change, both ways:');
w('| speed ratio | re-solved flow gpm | re-solved head ft | one-point flow gpm | one-point head ft | flow quotient | head quotient |');
w('| --- | --- | --- | --- | --- | --- | --- |');
OKONO_SPEED_SWEEP.forEach((s) => {
  const re = P.dutyPoint({ pump: studioScaled(s, 1), system: OK_SYS, qMaxGpm: OKONO_Q_MAX_GPM });
  const one = P.speedChange({ qGpm: OK_DUTY.qGpm, headFt: OK_DUTY.headFt, brakeHp: OK_POWER.brakeHp, speedRatio: s });
  w(`| ${e6(s)} | ${e6(re.qGpm)} | ${e6(re.headFt)} | ${e6(one.qGpm)} | ${e6(one.headFt)} | ${n(one.qGpm / re.qGpm, 9)} | ${n(one.headFt / re.headFt, 9)} |`);
});
w();
const RE_95 = P.dutyPoint({ pump: studioScaled(1, 0.95), system: OK_SYS, qMaxGpm: OKONO_Q_MAX_GPM });
const ONE_95 = P.impellerTrim({ qGpm: OK_DUTY.qGpm, headFt: OK_DUTY.headFt, brakeHp: OK_POWER.brakeHp, diameterRatio: 0.95 });
w(`Read the trim ratio of 0.950000 row, where the shortfall model contributes nothing (its shortfall percent is ${ONE_95.shortfallPct}). The two answers are still ${e6(RE_95.qGpm)} gpm and ${e6(ONE_95.qGpm)} gpm, a quotient of ${n(ONE_95.qGpm / RE_95.qGpm, 9)}. The gap there is not the shortfall model. It is that the system curve did not move when the machine changed, so the machine meets it somewhere else, and an affinity law applied to the old duty point does not know that.`);
w(`And the affinity map does lie ON the new curve, which is the other half of the same statement: at the trim ratio of 0.950000 the one-point answer is ${e6(ONE_95.qGpm)} gpm at ${e6(ONE_95.headFt)} ft, and the scaled curve read at that flow gives ${e6(studioScaled(1, 0.95).headAt(ONE_95.qGpm))} ft, a difference of ${studioScaled(1, 0.95).headAt(ONE_95.qGpm) - ONE_95.headFt} ft (derived from the two figures on this line). It is a point on the machine you now have; it is simply not where that machine will run.`);
w();

// --------------------------------------------------------------- SECTION 10
w('# SECTION 10: Two pumps, and a catalogue curve that is a water curve (owned by Professional m05)');
w();
w(`Identical machines in parallel on the friction-dominated system of Section 3 (static ${e6(OKONO_FRICTION_SYSTEM.staticHeadFt)} ft, friction ${e6(OKONO_FRICTION_SYSTEM.frictionHeadFt)} ft at ${e6(OKONO_FRICTION_SYSTEM.atFlowGpm)} gpm):`);
w('| machines | duty flow gpm | duty head ft | flow over one machine | flow per machine gpm |');
w('| --- | --- | --- | --- | --- |');
const ONE_MACHINE = OK_FRIC_DUTY.qGpm;
OKONO_PARALLEL_COUNTS.forEach((k) => {
  const pump = k === 1 ? OK_CURVE : P.combineParallel({ pump: OK_CURVE, n: k });
  const d = P.dutyPoint({ pump, system: OK_FRIC_SYS, qMaxGpm: OKONO_Q_MAX_GPM });
  w(`| ${k} | ${e6(d.qGpm)} | ${e6(d.headFt)} | ${n(d.qGpm / ONE_MACHINE, 9)} | ${e6(d.qGpm / k)} |`);
});
w('The fourth column is derived on each row. Two machines do not give two, and the fifth column says why: each machine is running further left on its own curve and the system is demanding more head for the extra flow.');
w();
w('The same machines in series, which add head at equal flow instead:');
w('| machines | duty flow gpm | duty head ft | head over one machine |');
w('| --- | --- | --- | --- |');
OKONO_SERIES_COUNTS.forEach((k) => {
  const pump = k === 1 ? OK_CURVE : P.combineSeries({ pump: OK_CURVE, n: k });
  const d = P.dutyPoint({ pump, system: OK_FRIC_SYS, qMaxGpm: OKONO_Q_MAX_GPM });
  w(`| ${k} | ${e6(d.qGpm)} | ${e6(d.headFt)} | ${n(d.headFt / OK_FRIC_DUTY.headFt, 9)} |`);
});
w(`A series stack reads back exactly: at ${e6(1000)} gpm one machine makes ${e6(OK_CURVE.headAt(1000))} ft and three in series make ${e6(P.combineSeries({ pump: OK_CURVE, n: 3 }).headAt(1000))} ft (engine), a quotient of ${n(P.combineSeries({ pump: OK_CURVE, n: 3 }).headAt(1000) / OK_CURVE.headAt(1000), 9)} (derived from the two figures on this line).`);
w(`A COUNT IS A NUMBER OF MACHINES, so it is guarded as a whole number and not merely as one or more: ${soft(P.combineParallel({ pump: OK_CURVE, n: 2.5 }))}, and in series ${soft(P.combineSeries({ pump: OK_CURVE, n: 2.5 }))}. Two and a half pumps is a question with no answer, and a curve returned for it would be an answer to it.`);
w(`Both combinations also carry the droop of the curve they were built from, so a stack of machines refuses a duty point for the same reason one machine does: ${soft(P.dutyPoint({ pump: P.combineParallel({ pump: NOT_FIT, n: 2 }), system: OK_SYS, qMaxGpm: OKONO_Q_MAX_GPM }))}`);
w();
w('A CATALOGUE CURVE IS A WATER CURVE. The Hydraulic Institute correction on the OKONO best efficiency point:');
w(`- best efficiency flow ${e6(OKONO_BEP_GPM)} gpm, best efficiency head ${e6(OKONO_BEP_HEAD_FT)} ft, ${e6(OKONO_SPEED_RPM)} rpm`);
w('| viscosity cSt | B | flow factor | head factor | efficiency factor | corrected flow gpm | corrected head ft | note or warning |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
OKONO_VISC_SWEEP_CST.forEach((v) => {
  const r = P.viscosityCorrection({ qBepGpm: OKONO_BEP_GPM, headBepFt: OKONO_BEP_HEAD_FT, viscosityCSt: v, speedRpm: OKONO_SPEED_RPM });
  const msg = r.warning ? 'warning set' : (r.note ? `note: ${r.note}` : 'null');
  w(`| ${e6(v)} | ${n(r.B, 9)} | ${n(r.cQ, 9)} | ${n(r.cH, 9)} | ${n(r.cEta, 9)} | ${r.correctedQGpm === undefined ? 'absent' : e6(r.correctedQGpm)} | ${r.correctedHeadFt === undefined ? 'absent' : e6(r.correctedHeadFt)} | ${msg} |`);
});
w();
w('The two warnings, in full:');
[850, 9000].forEach((v) => {
  const r = P.viscosityCorrection({ qBepGpm: OKONO_BEP_GPM, headBepFt: OKONO_BEP_HEAD_FT, viscosityCSt: v, speedRpm: OKONO_SPEED_RPM });
  if (r.warning) w(`- at ${e6(v)} cSt: "${r.warning}"`);
});
w();
const V_WATER = P.viscosityCorrection({ qBepGpm: OKONO_BEP_GPM, headBepFt: OKONO_BEP_HEAD_FT, viscosityCSt: 1, speedRpm: OKONO_SPEED_RPM });
const V_JUST_OVER = P.viscosityCorrection({ qBepGpm: OKONO_BEP_GPM, headBepFt: OKONO_BEP_HEAD_FT, viscosityCSt: 1.000001, speedRpm: OKONO_SPEED_RPM });
w(`Two rows worth reading against each other. At ${e6(1)} cSt the engine reports B = ${n(V_WATER.B, 9)}; at ${n(1.000001, 6)} cSt, a millionth higher, it reports B = ${n(V_JUST_OVER.B, 9)}, a difference of ${V_JUST_OVER.B - V_WATER.B} (derived from the two figures on this line). The correlating parameter is a real positive number at water viscosity and the engine reports it there, on the branch where it then applies no correction at all. B is what says how far from water the fluid is; the decision not to correct is a separate statement, and it is carried by the note.`);
const V_CORRECTED = P.viscosityCorrection({ qBepGpm: OKONO_BEP_GPM, headBepFt: OKONO_BEP_HEAD_FT, viscosityCSt: 100, speedRpm: OKONO_SPEED_RPM });
w(`THE RETURN SHAPE IS THE SAME ON EVERY BRANCH, and the table above shows it. The corrected flow and head are ${V_WATER.correctedQGpm === undefined ? 'absent' : 'present'} on the water row, ${V_JUST_OVER.correctedQGpm === undefined ? 'absent' : 'present'} on the row a millionth above it, and ${V_CORRECTED.correctedQGpm === undefined ? 'absent' : 'present'} on a corrected row. On the two no-correction branches they are the catalogue values themselves: at ${e6(1)} cSt the corrected flow is ${e6(V_WATER.correctedQGpm)} gpm against a stated best efficiency flow of ${e6(OKONO_BEP_GPM)} gpm, a difference of ${V_WATER.correctedQGpm - OKONO_BEP_GPM} gpm (derived from the two figures on this line). "The catalogue values, unchanged" is an answer, and it is returned as one.`);
w();
w('# HELD FOR LITERATURE, taught as a limit and never graded: the whole Hydraulic Institute correction. B, the flow factor, the head factor and the efficiency factor are an empirical correlation with no publication in this repository, and the head factor is taken equal to the flow factor at best efficiency, which is a further simplification of the standard. This wave\'s oracle checks the arithmetic at sixty digits, the closed-form inverse of the flow factor and the monotonicity both factors must have, and that is arithmetic evidence only. No graded value in this course is a corrected flow, head or efficiency.');
w();

// --------------------------------------------------------------- SECTION 11
w('# SECTION 11: A stage is not a pump (owned by Expert m01)');
w();
w('# App surface: the Staging and Power tab prints both heads and both efficiencies side by side so neither gets quoted as the other.');
w(`The SOKU K-2101 stage: ${e6(SOKU_STAGE.qMMscfd)} MMscfd of a ${e6(SOKU_STAGE.gasSg)} gravity gas at ${e6(SOKU_STAGE.pSuctionPsia)} psia and ${r4(SOKU_STAGE.tSuctionF)} degF, compressed through a ratio of ${e6(SOKU_STAGE.ratio)} with k = ${e6(SOKU_STAGE.k)} at a polytropic efficiency of ${e6(SOKU_STAGE.polytropicEfficiency)}.`);
w();
const SOKU_E = C.polytropicExponentRatio({ k: SOKU_STAGE.k, polytropicEfficiency: SOKU_STAGE.polytropicEfficiency });
const SOKU_E_IDEAL = C.polytropicExponentRatio({ k: SOKU_STAGE.k, polytropicEfficiency: 1 });
w(`- the polytropic exponent ratio: ${f9(SOKU_E)} (engine)`);
w(`- the same function at an efficiency of one, which is the isentropic exponent ratio: ${f9(SOKU_E_IDEAL)} (engine)`);
w(`- their quotient: ${f9(SOKU_E / SOKU_E_IDEAL)} (derived from the two rows above), which is one over the polytropic efficiency`);
w(`- discharge pressure ${r4(SOKU_ST.pDischargePsia)} psia, discharge temperature ${r4(SOKU_ST.tDischargeF)} degF (engine)`);
w(`- the discharge temperature the ISENTROPIC exponent would have predicted: ${r4(C.dischargeTempR({ tSuctionR: G.toRankine(SOKU_STAGE.tSuctionF), ratio: SOKU_STAGE.ratio, k: SOKU_STAGE.k, polytropicEfficiency: 1 }) - G.R_OFFSET)} degF (engine, through the same function at an efficiency of one, brought to Fahrenheit by the Rankine offset gasProperties.js exports), which is ${r4(SOKU_ST.tDischargeF - (C.dischargeTempR({ tSuctionR: G.toRankine(SOKU_STAGE.tSuctionF), ratio: SOKU_STAGE.ratio, k: SOKU_STAGE.k, polytropicEfficiency: 1 }) - G.R_OFFSET))} degF below the real one (derived from the two figures on this line)`);
w(`- compressibility at suction ${n(SOKU_ST.z1, 9)}, at discharge ${n(SOKU_ST.z2, 9)}, averaged ${n(SOKU_ST.zAvg, 9)} (engine). The two ends differ by ${n(SOKU_ST.z2 - SOKU_ST.z1, 9)} (derived), which is why the average is taken rather than the suction value carried through.`);
w(`- mass flow ${r4(SOKU_ST.massLbHr)} lb per hr (engine)`);
w(`- polytropic head ${r4(SOKU_ST.headPolyFtLbfLbm)} ft lbf per lbm, isentropic head ${r4(SOKU_ST.headIsenFtLbfLbm)} ft lbf per lbm (engine); their quotient ${f9(SOKU_ST.headIsenFtLbfLbm / SOKU_ST.headPolyFtLbfLbm)} (derived)`);
w(`- polytropic efficiency ${n(SOKU_ST.polytropicEfficiency, 9)}, isentropic efficiency ${n(SOKU_ST.isentropicEfficiency, 9)} (engine); the isentropic one is lower by ${n(SOKU_ST.polytropicEfficiency - SOKU_ST.isentropicEfficiency, 9)} (derived)`);
w(`- gas horsepower by the polytropic route ${r4(SOKU_ST.gasHp)}, by the isentropic route ${r4(SOKU_ST.gasHpIsentropicRoute)} (engine); difference ${SOKU_ST.gasHp - SOKU_ST.gasHpIsentropicRoute} hp (derived)`);
w(`- brake horsepower ${r4(SOKU_ST.brakeHp)} at a mechanical efficiency of ${e6(SOKU_STAGE.mechanicalEfficiency)} (engine)`);
w(`- compressibility note: ${SOKU_ST.zNote === null ? 'null' : `"${SOKU_ST.zNote}"`}`);
w(`- warning: ${SOKU_ST.warning === null ? 'null' : `"${SOKU_ST.warning}"`}`);
w();
w('THE HOT-STAGE WARNING FIRES ON THE LIMIT THE CALLER STATED, rather than on a threshold written into the module. The same stage against four different stated limits, everything else held:');
w('| stated limit degF | discharge degF | warned | the warning |');
w('| --- | --- | --- | --- |');
[200, 250, 300, 400].forEach((lim) => {
  const r = C.compressionStage({ ...SOKU_STAGE, maxDischargeF: lim });
  w(`| ${r4(lim)} | ${r4(r.tDischargeF)} | ${r.warning !== null} | ${r.warning === null ? 'null' : `"${r.warning}"`} |`);
});
w(`The discharge on all four rows is the same ${r4(SOKU_ST.tDischargeF)} degF, because the limit is a limit and not an input to the thermodynamics.`);
// The default limit is not exported. It is MEASURED by walking the ratio,
// with no limit stated, until the warning turns on, and reading the
// discharge temperature the engine warned at.
const warnsAt = (ratio) => C.compressionStage({ ...SOKU_STAGE, ratio, maxDischargeF: undefined }).warning !== null;
let dlo = 1.5; let dhi = 4.5;
for (let i = 0; i < 200; i += 1) {
  const mid = (dlo + dhi) / 2;
  if (mid === dlo || mid === dhi) break;
  if (warnsAt(mid)) dhi = mid; else dlo = mid;
}
w(`THE DEFAULT IS MEASURED RATHER THAN TYPED. With no limit stated the warning turns on between a ratio of ${dlo} and ${dhi}, and the discharge temperatures either side of that crossing are ${C.compressionStage({ ...SOKU_STAGE, ratio: dlo, maxDischargeF: undefined }).tDischargeF} and ${C.compressionStage({ ...SOKU_STAGE, ratio: dhi, maxDischargeF: undefined }).tDischargeF} degF (engine), which brackets the default the engine applies when the caller states none. That default is a customary figure with no publication behind it in this repository.`);
w();
w('THE TWO POWER ROUTES AGREE BECAUSE THEY ARE THE SAME EXPRESSION, which is worth showing rather than admiring. The exponent ratio times the polytropic efficiency is the isentropic exponent ratio, exactly, for every pair:');
w('| k | polytropic efficiency | exponent ratio | times the efficiency | the isentropic exponent ratio | difference |');
w('| --- | --- | --- | --- | --- | --- |');
IDENTITY_PAIRS.forEach(({ k, polytropicEfficiency }) => {
  const e = C.polytropicExponentRatio({ k, polytropicEfficiency });
  const ke = C.polytropicExponentRatio({ k, polytropicEfficiency: 1 });
  w(`| ${e6(k)} | ${e6(polytropicEfficiency)} | ${f9(e)} | ${e * polytropicEfficiency} | ${ke} | ${e * polytropicEfficiency - ke} |`);
});
w('The last column is derived on each row. Because that identity holds, dividing the isentropic head by the isentropic efficiency and dividing the polytropic head by the polytropic efficiency are one expression, so the two horsepower figures above cannot disagree for any input at all.');
w('A COMPARISON THAT CANNOT COME OUT FALSE IS NOT A CHECK. Two routes through one expression agree for every input, including an input that is transcribed wrong, so their agreement is a shape property and not evidence about either head. The engine gate asserts it and labels it as that, and the check that CAN fail beside it is a numerical quadrature of the integral of v dp along the polytropic path, with a negative control that moves the exponent and must break the comparison.');
w('The same rule applies to every gate a reader will meet: ask what input would make it fail, and if there is none, it is a restatement of the formula and not a test of it.');
w();
w('The exponent, the discharge and the head against the polytropic efficiency, everything else held:');
w('| polytropic efficiency | exponent ratio | discharge degF | polytropic head ft lbf per lbm | gas hp |');
w('| --- | --- | --- | --- | --- |');
SOKU_ETA_SWEEP.forEach((eta) => {
  const r = C.compressionStage({ ...SOKU_STAGE, polytropicEfficiency: eta });
  w(`| ${e6(eta)} | ${f9(C.polytropicExponentRatio({ k: SOKU_STAGE.k, polytropicEfficiency: eta }))} | ${r4(r.tDischargeF)} | ${r4(r.headPolyFtLbfLbm)} | ${r4(r.gasHp)} |`);
});
w();
w('And against k, which is what a richer gas changes:');
w('| k | exponent ratio | discharge degF | polytropic head ft lbf per lbm | gas hp |');
w('| --- | --- | --- | --- | --- |');
SOKU_K_SWEEP.forEach((k) => {
  const r = C.compressionStage({ ...SOKU_STAGE, k });
  w(`| ${e6(k)} | ${f9(C.polytropicExponentRatio({ k, polytropicEfficiency: SOKU_STAGE.polytropicEfficiency }))} | ${r4(r.tDischargeF)} | ${r4(r.headPolyFtLbfLbm)} | ${r4(r.gasHp)} |`);
});
w();
w('And against the ratio the stage is asked to take:');
w('| ratio | discharge psia | discharge degF | polytropic head ft lbf per lbm | gas hp | warning |');
w('| --- | --- | --- | --- | --- | --- |');
SOKU_RATIO_SWEEP.forEach((ratio) => {
  const r = C.compressionStage({ ...SOKU_STAGE, ratio });
  w(`| ${e6(ratio)} | ${r4(r.pDischargePsia)} | ${r4(r.tDischargeF)} | ${r4(r.headPolyFtLbfLbm)} | ${r4(r.gasHp)} | ${r.warning === null ? 'null' : 'set'} |`);
});
w();

// --------------------------------------------------------------- SECTION 12
w('# SECTION 12: The stage count, and the limit that governs (owned by Expert m02)');
w();
w(`SOKU as a whole duty: ${e6(SOKU.qMMscfd)} MMscfd from ${e6(SOKU.pSuctionPsia)} psia to ${e6(SOKU.pDischargePsia)} psia at ${r4(SOKU.tSuctionF)} degF, with a per-stage ratio limit of ${e6(SOKU.maxRatioPerStage)} and a discharge limit of ${r4(SOKU.maxDischargeF)} degF.`);
const SOKU_STAGING = C.stageCount(SOKU);
w(`The count is chosen against the temperature the stages will ACTUALLY see. A single stage starts from the suction and is never cooled; every stage after the first starts from the interstage approach, so the inlet a trial count must be tested at is the suction for one stage and the hotter of the suction and the cooled temperature for more than one. This duty cools back to ${r4(SOKU.interstageCoolToF)} degF against a suction of ${r4(SOKU.tSuctionF)} degF.`);
w(`- overall ratio ${f9(SOKU_STAGING.overallRatio)} (engine)`);
w(`- stages the ratio rule demands: ${SOKU_STAGING.byRatio} (engine)`);
w(`- stages the temperature limit demands: ${SOKU_STAGING.byTemp} (engine)`);
w(`- stages: ${SOKU_STAGING.stages}, governed by ${SOKU_STAGING.governedBy} (engine)`);
w(`- ratio per stage: ${f9(SOKU_STAGING.ratioPerStage)} (engine)`);
w();
w('Across a range of discharge pressures, which is the sweep the studio\'s third tab draws:');
w('| discharge psia | overall ratio | by ratio | by temperature | stages | governed by | ratio per stage | brake hp | hottest stage degF | the stated limit less the hottest degF | cooling MMBtu per hr | fuel MMscfd |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
let sweepOverLimit = 0;
SOKU_DISCHARGE_SWEEP_PSIA.forEach((p) => {
  const s = C.stageCount({ ...SOKU, pDischargePsia: p });
  if (s.error) { w(`| ${e6(p)} | refused: ${s.error} | | | | | | | | | | |`); return; }
  const t = C.compressorTrain({ ...SOKU, pDischargePsia: p });
  const f = C.driverFuel({ brakeHp: t.totalBrakeHp, heatRateBtuHpHr: SOKU_HEAT_RATE_BTU_HP_HR, gasLhvBtuScf: SOKU_LHV_BTU_SCF });
  const hot = Math.max(...t.stages.map((x) => x.tDischargeF));
  if (hot > SOKU.maxDischargeF) sweepOverLimit += 1;
  w(`| ${e6(p)} | ${f9(s.overallRatio)} | ${s.byRatio} | ${s.byTemp} | ${s.stages} | ${s.governedBy} | ${f9(s.ratioPerStage)} | ${r4(t.totalBrakeHp)} | ${r4(hot)} | ${r4(SOKU.maxDischargeF - hot)} | ${r4(t.totalCoolingMMBtuHr)} | ${f9(f.fuelMMscfd)} |`);
});
w('Power climbs smoothly along that table and the stage count climbs in steps, and each step is a machine, a cooler and a foundation.');
w(`The tenth column is derived on each row as the stated limit of ${r4(SOKU.maxDischargeF)} degF less the hottest stage, so a NEGATIVE entry there is a train running over the limit it was staged against. ${sweepOverLimit} of the ${SOKU_DISCHARGE_SWEEP_PSIA.length} rows do that, on a duty whose intercooler approach of ${r4(SOKU.interstageCoolToF)} degF sits ABOVE its suction of ${r4(SOKU.tSuctionF)} degF, which is the condition under which the count and the train could disagree at all. Section 13 walks that approach across the suction and keeps the column non-negative the whole way.`);
w();
const CAP_REFUSAL = C.stageCount(STAGE_CAP_DUTY);
w(`The search for the temperature-driven count runs from one stage to twelve and refuses past it. That refusal is hard to reach, because every cheaper explanation is caught at the door first: it needs a discharge limit above the suction temperature (${r4(STAGE_CAP_DUTY.maxDischargeF)} degF against ${r4(STAGE_CAP_DUTY.tSuctionF)} degF here), a readable efficiency and a workable ratio limit, and an overall ratio large enough that twelve equal stages are still too hot. ${soft(CAP_REFUSAL)}`);
w('A REFUSAL CARRIES ITS EVIDENCE, because the diagnosis has to survive it. That return also holds:');
w(`- the stage counts tried: ${CAP_REFUSAL.triedStages} (engine)`);
w(`- the coolest discharge those twelve equal stages could reach: ${r4(CAP_REFUSAL.coolestReachedF)} degF (engine)`);
w(`- the limit it was measured against: ${r4(CAP_REFUSAL.maxDischargeF)} degF (engine)`);
w(`- the inlet it was measured from: ${r4(CAP_REFUSAL.hottestInletF)} degF (engine)`);
w(`- the overall ratio it was working on: ${f9(CAP_REFUSAL.overallRatio)} (engine)`);
w(`The gap between the coolest reachable discharge and the stated limit is ${r4(CAP_REFUSAL.coolestReachedF - CAP_REFUSAL.maxDischargeF)} degF (derived from the two rows above), which is what tells a reader whether it is the approach or the limit that is impossible rather than sending them off to intercool harder.`);
w('Section 15 puts four other faults that reach this same function beside the refusal that names each of them, so a refusal here means the twelve-stage cap and not one of those four.');
w();

// --------------------------------------------------------------- SECTION 13
w('# SECTION 13: The train, its cooling, and the limit that buys the stages (owned by Expert m03)');
w();
w(`SOKU as a train, cooled back to ${r4(SOKU.interstageCoolToF)} degF between stages against a suction of ${r4(SOKU.tSuctionF)} degF:`);
w('| stage | suction psia | discharge psia | in degF | out degF | ratio | z average | polytropic head ft lbf per lbm | gas hp | brake hp | cooling Btu per hr | cooled to degF | warning |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
SOKU_TRAIN.stages.forEach((s) => {
  w(`| ${s.stage} | ${r4(s.pSuctionPsia)} | ${r4(s.pDischargePsia)} | ${r4(s.tSuctionF)} | ${r4(s.tDischargeF)} | ${f9(s.ratio)} | ${n(s.zAvg, 9)} | ${r4(s.headPolyFtLbfLbm)} | ${r4(s.gasHp)} | ${r4(s.brakeHp)} | ${r4(s.coolingBtuHr)} | ${s.cooledToF === null ? 'null' : r4(s.cooledToF)} | ${s.warning === null ? 'null' : 'set'} |`);
});
w(`Totals: gas ${r4(SOKU_TRAIN.totalGasHp)} hp, brake ${r4(SOKU_TRAIN.totalBrakeHp)} hp, cooling ${r4(SOKU_TRAIN.totalCoolingBtuHr)} Btu per hr which is ${r4(SOKU_TRAIN.totalCoolingMMBtuHr)} MMBtu per hr, final discharge ${r4(SOKU_TRAIN.finalDischargeF)} degF (engine).`);
w(`The stated discharge limit is ${r4(SOKU.maxDischargeF)} degF and the hottest stage on that table is ${r4(Math.max(...SOKU_TRAIN.stages.map((s) => s.tDischargeF)))} degF (derived as the maximum of the out column), which leaves ${r4(SOKU.maxDischargeF - Math.max(...SOKU_TRAIN.stages.map((s) => s.tDischargeF)))} degF of room (derived from the two figures on this line).`);
w();
w('NOW MOVE THE INTERCOOLER APPROACH ACROSS THE SUCTION TEMPERATURE. A warmer approach makes every stage after the first start hotter, so at a fixed count it finishes hotter, and the count the temperature limit demands rises once that is no longer affordable. The count and the train are asked the same question about the same inlets, and the table shows both halves of that:');
w('| cooled to degF | inlet the count was tested at degF | stages | governed by | stage discharges degF | hottest degF | the stated limit less the hottest degF | stages over the limit | stages warned |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
let coolSweepOver = 0;
SOKU_COOL_TO_SWEEP_F.forEach((c) => {
  const t = C.compressorTrain({ ...SOKU, interstageCoolToF: c });
  if (t.error) { w(`| ${r4(c)} | refused: ${t.error} | | | | | | | |`); return; }
  const temps = t.stages.map((s) => s.tDischargeF);
  const hot = Math.max(...temps);
  const over = temps.filter((x) => x > SOKU.maxDischargeF).length;
  coolSweepOver += over;
  const inlet = t.stages.length <= 1 ? SOKU.tSuctionF : Math.max(SOKU.tSuctionF, c);
  w(`| ${r4(c)} | ${r4(inlet)} | ${t.stages.length} | ${t.governedBy} | ${temps.map((x) => r4(x)).join(', ')} | ${r4(hot)} | ${r4(SOKU.maxDischargeF - hot)} | ${over} | ${t.stages.filter((s) => s.warning).length} |`);
});
w(`The suction temperature on that table is ${r4(SOKU.tSuctionF)} degF and the stated limit is ${r4(SOKU.maxDischargeF)} degF. The seventh column is derived on each row as the stated limit less the hottest stage, so a NEGATIVE entry there is a train running over its own limit; ${coolSweepOver} stages across the whole table do that. The second column is the inlet the count was chosen at, and on every row it is the inlet the stages after the first actually run from.`);
w('The whole of that is one comparison. A count chosen at the suction while the stages run from the cooler is a count chosen for a machine that is not the one being built, and the second column is the only thing on the table that says which machine the count was bought for.');
w();
const HOT = C.compressorTrain(SOKU_HOT);
const HOT_TEMPS = HOT.stages.map((s) => s.tDischargeF);
w(`A case cut to press on it: the same gas from ${e6(SOKU_HOT.pSuctionPsia)} psia to ${e6(SOKU_HOT.pDischargePsia)} psia at ${r4(SOKU_HOT.tSuctionF)} degF, a stated discharge limit of ${r4(SOKU_HOT.maxDischargeF)} degF and an intercooler approach of ${r4(SOKU_HOT.interstageCoolToF)} degF, which is ${r4(SOKU_HOT.interstageCoolToF - SOKU_HOT.tSuctionF)} degF ABOVE the suction (derived from the two figures on this line).`);
w(`- stages: ${HOT.stages.length}, governed by ${HOT.governedBy} (engine)`);
w(`- stage discharges: ${HOT_TEMPS.map((x) => r4(x)).join(', ')} degF (engine)`);
w(`- the stated limit is ${r4(SOKU_HOT.maxDischargeF)} degF and the hottest stage is ${r4(Math.max(...HOT_TEMPS))} degF, which leaves ${r4(SOKU_HOT.maxDischargeF - Math.max(...HOT_TEMPS))} degF of room (derived from the two figures on this line)`);
w(`- stages over the stated limit: ${HOT_TEMPS.filter((x) => x > SOKU_HOT.maxDischargeF).length} of ${HOT.stages.length}; stages carrying a warning: ${HOT.stages.filter((s) => s.warning).length} of ${HOT.stages.length}`);
w(`- the first stage runs from the suction and reaches ${r4(HOT_TEMPS[0])} degF; every later stage runs from the ${r4(SOKU_HOT.interstageCoolToF)} degF approach and reaches ${r4(HOT_TEMPS[HOT_TEMPS.length - 1])} degF, a difference of ${r4(HOT_TEMPS[HOT_TEMPS.length - 1] - HOT_TEMPS[0])} degF (derived from the two figures on this line) at the same ratio`);
w('The return says the discharge temperature governed the stage count, and the discharge temperature is under the limit it was governed by. That is what a staging that agrees with its own train looks like: the count was bought at the inlet the stages have, and the cost of the hotter approach is paid in machines rather than in temperature.');
w('The Compressor Station Designer ships with an approach of 110 degF against a suction of 100 degF, so a studio opened and not touched is already on the warm side of that comparison. What it buys there is a stage count, which is a cooler and a foundation and a machine, and the table above is the price list.');
w();
w('The interstage cooling duty is a real exchanger, and it moves with the approach. The stage count is in the table because it moves too, and the trade below only reads cleanly where it does not:');
w('| cooled to degF | stages | total cooling MMBtu per hr | total gas hp |');
w('| --- | --- | --- | --- |');
const coolRows = [];
SOKU_COOL_TO_SWEEP_F.forEach((c) => {
  const t = C.compressorTrain({ ...SOKU, interstageCoolToF: c });
  if (t.error) return;
  coolRows.push({ c, stages: t.stages.length, cool: t.totalCoolingMMBtuHr, hp: t.totalGasHp });
  w(`| ${r4(c)} | ${t.stages.length} | ${r4(t.totalCoolingMMBtuHr)} | ${r4(t.totalGasHp)} |`);
});
w('Colder suction to the next stage means less work for the same ratio, and more heat to take out. The table says where that holds and where it stops, and the answer is read off it rather than asserted:');
const fixedCount = coolRows.filter((r) => r.stages === coolRows[0].stages);
const tradeHolds = fixedCount.every((r, i) => i === 0
  || (r.cool < fixedCount[i - 1].cool && r.hp > fixedCount[i - 1].hp));
w(`- across the ${fixedCount.length} rows that share a stage count of ${coolRows[0].stages}, the cooling falls and the gas power rises on every step: ${tradeHolds}`);
w(`- over those rows the cooling goes from ${r4(fixedCount[0].cool)} to ${r4(fixedCount[fixedCount.length - 1].cool)} MMBtu per hr and the gas power from ${r4(fixedCount[0].hp)} to ${r4(fixedCount[fixedCount.length - 1].hp)} hp (engine, read off the table)`);
const crossings = coolRows.filter((r, i) => i > 0 && r.stages !== coolRows[i - 1].stages);
w(`- ${crossings.length} rows add a stage, and on the first of them the cooling goes back UP from ${r4(coolRows[coolRows.findIndex((r) => r === crossings[0]) - 1].cool)} to ${r4(crossings[0].cool)} MMBtu per hr while the gas power goes DOWN from ${r4(coolRows[coolRows.findIndex((r) => r === crossings[0]) - 1].hp)} to ${r4(crossings[0].hp)} hp, because the extra machine changed the ratio each stage takes`);
w('So the trade is a statement about a FIXED number of stages. Across a stage-count change it reverses, and a reader who quotes the trade without the count attached has quoted it wrong. That extra machine is also the reason multi-stage compression is worth its machinery at all.');
w();

// --------------------------------------------------------------- SECTION 14
w('# SECTION 14: The machine, the driver and the fuel (owned by Expert m04)');
w();
w('The actual inlet volume is what the machine screen turns on, and it falls with pressure:');
w('| suction psia | actual inlet acfm |');
w('| --- | --- |');
ACFM_PRESSURE_SWEEP_PSIA.forEach((p) => {
  w(`| ${e6(p)} | ${r4(C.actualInletCfm({ qMMscfd: SOKU.qMMscfd, pPsia: p, tF: SOKU.tSuctionF, gasSg: SOKU.gasSg }))} |`);
});
w(`At the SOKU suction of ${e6(SOKU.pSuctionPsia)} psia the inlet volume is ${r4(C.actualInletCfm({ qMMscfd: SOKU.qMMscfd, pPsia: SOKU.pSuctionPsia, tF: SOKU.tSuctionF, gasSg: SOKU.gasSg }))} acfm (engine).`);
w();
w(`The screen, on ${SCREEN_DUTIES.length} duties chosen to land in all four of its branches, with the branch each one reached printed beside it rather than promised:`);
const branchesHit = new Set();
SCREEN_DUTIES.forEach((d) => {
  const s = C.machineScreen(d);
  branchesHit.add(`${s.recommendation}|${s.reasons[0]}`);
  w(`- ${d.label}: ${r4(s.acfm)} acfm at an overall ratio of ${e6(d.overallRatio)} and ${r4(d.totalBrakeHp)} brake hp gives "${s.recommendation}"`);
  s.reasons.forEach((r) => w(`    ${r}`));
});
w(`Distinct first reasons across those ${SCREEN_DUTIES.length} duties: ${branchesHit.size} (derived by collecting them). The branch is decided on the inlet VOLUME first and on the ratio second, so two duties can reach the same recommendation by different roads, and the reason line is the only thing that says which road.`);
w();
w('The screen asks for the compressibility BEFORE it asks for the volume, so a suction state outside the correlation is refused by name rather than as a missing volume:');
[['a suction below absolute zero', { qMMscfd: 20, pSuctionPsia: 200, tSuctionF: -600, gasSg: 0.65, overallRatio: 3, totalBrakeHp: 500 }],
 ['a suction colder than the correlation reaches', { qMMscfd: 20, pSuctionPsia: DAK_COLD_PROBE.pSuctionPsia, tSuctionF: DAK_COLD_PROBE.tSuctionF, gasSg: DAK_COLD_PROBE.gasSg, overallRatio: 3, totalBrakeHp: 500 }],
 ['a suction above the pressure the correlation reaches', { qMMscfd: 20, pSuctionPsia: DAK_HIGH_P_PROBE.pSuctionPsia, tSuctionF: DAK_HIGH_P_PROBE.tSuctionF, gasSg: DAK_HIGH_P_PROBE.gasSg, overallRatio: 3, totalBrakeHp: 500 }],
].forEach(([label, d]) => w(`- ${label}: ${soft(C.machineScreen(d))}`));
w('A volume is positive, and the guard says so. Finiteness alone is not enough here, because a NEGATIVE number is finite: a suction below absolute zero puts a negative absolute temperature into the volume, and a screen that only asked whether the answer was finite would take that negative volume, find it "below about 500 acfm" and recommend a reciprocating machine on it.');
w();
w('# HELD FOR LITERATURE, taught as a limit and never graded: the screening thresholds, 500 and 5000 and 20000 acfm, ratios of 4 and 6, and 200 and 10000 brake hp. They are customary and unsourced here, so no graded value in this course is a recommendation.');
w();
w(`The driver on the SOKU train, at a heat rate of ${e6(SOKU_HEAT_RATE_BTU_HP_HR)} Btu per hp hr burning gas of ${e6(SOKU_LHV_BTU_SCF)} Btu per scf:`);
w(`- fuel ${r4(SOKU_FUEL.fuelBtuHr)} Btu per hr, which is ${f9(SOKU_FUEL.fuelMMscfd)} MMscfd (engine)`);
w(`- driver thermal efficiency ${e6(SOKU_FUEL.thermalEfficiencyPct)} percent (engine)`);
w(`- the fuel as a share of the stream being compressed: ${e6((SOKU_FUEL.fuelMMscfd / SOKU.qMMscfd) * 100)} percent (derived: the fuel over the ${e6(SOKU.qMMscfd)} MMscfd throughput, times 100)`);
w();
w('A better driver burns less of the stream:');
w('| heat rate Btu per hp hr | fuel MMscfd | thermal efficiency percent | share of throughput percent |');
w('| --- | --- | --- | --- |');
DRIVER_HEAT_RATE_SWEEP.forEach((hr) => {
  const f = C.driverFuel({ brakeHp: SOKU_TRAIN.totalBrakeHp, heatRateBtuHpHr: hr, gasLhvBtuScf: SOKU_LHV_BTU_SCF });
  w(`| ${e6(hr)} | ${f9(f.fuelMMscfd)} | ${e6(f.thermalEfficiencyPct)} | ${e6((f.fuelMMscfd / SOKU.qMMscfd) * 100)} |`);
});
w('The last column is derived on each row.');
w();
w('THE COMPRESSION CONSTANTS, measured out of the engine the same way:');
const MW_PROBE = C.compressionStage({ qMMscfd: 1, pSuctionPsia: 100, tSuctionF: 100, ratio: 2, gasSg: 1, k: 1.28 });
const M_LBMOL = 1e6 / 24 / MW_PROBE.massLbHr * G.AIR_MW;
const M_MW = MW_PROBE.massLbHr * M_LBMOL * 24 / 1e6;
const R_PROBE = C.compressionStage({ qMMscfd: 1, pSuctionPsia: 100, tSuctionF: 0, ratio: 2, gasSg: 1, k: 1.28, polytropicEfficiency: 0.75 });
const R_E = C.polytropicExponentRatio({ k: 1.28, polytropicEfficiency: 0.75 });
const M_R = R_PROBE.headPolyFtLbfLbm * M_MW / (R_PROBE.zAvg * G.toRankine(0) * (1 / R_E) * (2 ** R_E - 1));
const M_33000 = R_PROBE.massLbHr * R_PROBE.headPolyFtLbfLbm / (R_PROBE.gasHp * 60 * 0.75);
// Btu per horsepower-hour, twice and independently: once out of the
// thermal efficiency at a stated heat rate, and once by walking the heat
// rate down until the engine refuses it, because the first-law refusal
// boundary IS that constant.
const FUEL_PROBE = C.driverFuel({ brakeHp: 1, heatRateBtuHpHr: 1e4 });
const M_2544 = (FUEL_PROBE.thermalEfficiencyPct / 100) * 1e4;
let blo = 1; let bhi = 1e5;
for (let i = 0; i < 200; i += 1) {
  const mid = (blo + bhi) / 2;
  if (mid === blo || mid === bhi) break;
  if (C.driverFuel({ brakeHp: 1, heatRateBtuHpHr: mid }).error) blo = mid; else bhi = mid;
}
const M_2544_EDGE = bhi;
const ACFM_PROBE_STATE = { qMMscfd: 1, pPsia: 300, tF: 140, gasSg: 0.7 };
const ACFM_Z = C.compressionStage({ ...ACFM_PROBE_STATE, qMMscfd: 1, pSuctionPsia: ACFM_PROBE_STATE.pPsia, tSuctionF: ACFM_PROBE_STATE.tF, ratio: 2, k: 1.28 }).z1;
const M_ACFM = C.actualInletCfm(ACFM_PROBE_STATE);
const M_BASE_QUOTIENT = M_ACFM * ACFM_PROBE_STATE.pPsia * 1440 / (1e6 * ACFM_Z * G.toRankine(ACFM_PROBE_STATE.tF));
w(`- standard cubic feet per lbmol, from the mass flow of one MMscfd of a gravity-one gas: ${n(M_LBMOL, 6)}`);
w(`- the molecular weight of air, from the same return once the first is known: ${n(M_MW, 6)}`);
w(`- the universal gas constant in ft lbf per lbmol degR, from the polytropic head over its own z, temperature, exponent and ratio group: ${n(M_R, 6)}`);
w(`- the same constant as gasProperties.js carries it, times 144 square inches per square foot: ${n(G.R_UNIVERSAL * 144, 6)} (engine export, derived on this line)`);
w(`- the quotient of those two: ${n(M_R / (G.R_UNIVERSAL * 144), 15)} (derived from the two rows above), and their difference is ${M_R - G.R_UNIVERSAL * 144} ft lbf per lbmol degR (derived the same way). ONE VALUE OF ONE CONSTANT, in two modules where one imports from the other. A package that holds two opinions about a constant cannot say which of them any answer carries, however small the gap.`);
w(`- ft lbf per minute per horsepower, from the mass, head, power and efficiency of one stage: ${n(M_33000, 6)}`);
w(`- Btu per horsepower hour, from the thermal efficiency at a heat rate of ${e6(1e4)}: ${n(M_2544, 12)}`);
w(`- the same constant again, from the heat rate the engine refuses below, found by halving: ${n(M_2544_EDGE, 12)}. A driver that burns less than a horsepower-hour to make one would be more than 100 percent efficient, so the refusal boundary IS the constant, and the two routes differ by ${M_2544 - M_2544_EDGE} (derived from the two rows above).`);
w(`- the ratio of the standard pressure to the standard temperature that the inlet-volume function uses: ${n(M_BASE_QUOTIENT, 12)} psia per degR (derived from one acfm return, its own z, its pressure and its temperature). That quotient is all the volume route reveals about its base; the two figures cannot be separated from outside it.`);
w(`- ONE STANDARD BASE FOR THE MODULE. The mass-flow route above gives ${n(M_LBMOL, 12)} standard cubic feet per lbmol, and the gas constant measured on this page turns that back into the same pressure-over-temperature quotient the volume route uses: ${n(M_R / 144 / M_LBMOL, 12)} psia per degR (derived from two rows above). The difference between the two routes is ${M_BASE_QUOTIENT - M_R / 144 / M_LBMOL} psia per degR (derived from the two figures on this line). The same MMscfd is now one molar quantity whether it becomes a mass flow or an inlet volume.`);
w(`- the Rankine offset, exported: ${n(G.R_OFFSET, 6)}. The molecular weight of air, exported: ${n(G.AIR_MW, 6)}. compression.js reads both from gasProperties.js and keeps no copy of either.`);
w();

// --------------------------------------------------------------- SECTION 15
w('# SECTION 15: What a refusal is, and where each guard turns over (owned by Expert m05)');
w();
w('EVERY REFUSAL IS A RETURNED OBJECT CARRYING AN `error` STRING, and it names the input that is actually wrong. Neither module throws. A caller checks a property rather than catching, and the property it checks is the only check most callers make, which is why a non-finite value slipped past it is worse than no guard at all.');
w('Note on reading these: a NaN and an Infinity have no spelling in JSON and both come out as null through JSON.stringify. The lines below are printed by a hand-rolled serialiser for that reason, so they say NaN and Infinity where the engine returned them.');
w();
w('The pump module, on the inputs where handing back a number rather than a refusal would be the dangerous answer:');
UNGUARDED_PUMP_PROBES.forEach(([label, fn, inp]) => {
  let r;
  if (fn === 'combineParallelCount') r = P.combineParallel({ pump: OK_CURVE, n: inp.n });
  else r = P[fn](inp);
  w(`- ${label}: ${shape(r)}`);
});
const SYS_NO_STATIC = P.systemCurve({ frictionHeadFt: 200, atFlowGpm: 1500 });
w(`- a system curve with no static head: ${shape(SYS_NO_STATIC)}`);
w('  That one is the sharpest of the set: a curve object can look healthy and carry a correct coefficient while the function hanging off it is unusable, so this guard catches at construction what would otherwise surface only at the call. A static head may be NEGATIVE, because the destination can sit below the pump, so the guard is finiteness and not positivity, and the message says so.');
w();
w('The compression module, the same way:');
UNGUARDED_COMPRESSION_PROBES.forEach(([label, fn, inp]) => {
  w(`- ${label}: ${shape(C[fn](inp))}`);
});
w();
w(`THE ${BARE_NUMBER_FNS.length} BARE-NUMBER FUNCTIONS of Section 1 have nowhere to put an error key, so they hold a documented contract instead: NaN when the inputs cannot be read, never an Infinity and never a plausible number. They are ${BARE_NUMBER_FNS.map(([nm]) => nm).join(', ')}, and each appears below with at least one input it must refuse.`);
w('| function | input | returns |');
w('| --- | --- | --- |');
[['pumps.headFtToPsi', 'a gravity of zero', () => P.headFtToPsi({ headFt: 100, sg: 0 })],
 ['pumps.psiToHeadFt', 'a gravity of zero', () => P.psiToHeadFt({ psi: 100, sg: 0 })],
 ['pumps.psiToHeadFt', 'a readable case, as a control', () => P.psiToHeadFt({ psi: 100, sg: 0.85 })],
 ['compression.polytropicExponentRatio', 'an efficiency above one', () => C.polytropicExponentRatio({ k: 1.28, polytropicEfficiency: 1.5 })],
 ['compression.dischargeTempR', 'a suction temperature that is not a number', () => C.dischargeTempR({ tSuctionR: NaN, ratio: 3, k: 1.28, polytropicEfficiency: 0.75 })],
 ['compression.actualInletCfm', 'a suction below absolute zero', () => C.actualInletCfm({ qMMscfd: 20, pPsia: 200, tF: -600, gasSg: 0.65 })],
 ['compression.actualInletCfm', 'a state outside the compressibility window', () => C.actualInletCfm({ qMMscfd: 20, pPsia: DAK_HIGH_P_PROBE.pSuctionPsia, tF: DAK_HIGH_P_PROBE.tSuctionF, gasSg: DAK_HIGH_P_PROBE.gasSg })],
 ['compression.actualInletCfm', 'a readable state, as a control', () => C.actualInletCfm({ qMMscfd: 20, pPsia: 200, tF: 100, gasSg: 0.65 })],
].forEach(([fn, label, f]) => w(`| ${fn} | ${label} | ${String(f())} |`));
w('Read the two control rows against the rest. A contract that says NaN is only worth anything if the same function returns a real number when it can, and those two rows are what makes the others mean something.');
w();
w('FOUR FAULTS, FOUR REFUSALS, and each names the input that is actually wrong rather than the one a reader would check first:');
[
  ['a polytropic efficiency of zero', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, polytropicEfficiency: 0 }],
  ['a polytropic efficiency above one', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, polytropicEfficiency: 1.5 }],
  ['a suction below absolute zero', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: -600, k: 1.28 }],
  ['a discharge limit below the suction temperature', { pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxDischargeF: -100 }],
].forEach(([label, inp]) => w(`- ${label}: ${soft(C.stageCount(inp))}`));
w('Two of those messages carry the value that was typed, because two typed values reach one guard from opposite directions: a 0 and a 1.5 are not the same mistake, and a reader told only the rule has to work out which of them they made. A refusal that names the wrong cause sends a reader to fix an input that was correct, and that is worse than a bare refusal.');
w();
w('AND THE SAME FAULT ASKED THROUGH BOTH FUNCTIONS, SO THE MESSAGE CANNOT DRIFT BETWEEN THEM:');
const RATIO_ONE = C.stageCount({ pSuctionPsia: 100, pDischargePsia: 1000, tSuctionF: 100, k: 1.28, maxRatioPerStage: 1 });
w(`- a per-stage ratio limit of one, through stageCount: ${shape(RATIO_ONE)}`);
w(`- the same through compressorTrain: ${soft(C.compressorTrain({ qMMscfd: 20, pSuctionPsia: 100, tSuctionF: 100, pDischargePsia: 1000, gasSg: 0.65, k: 1.28, maxRatioPerStage: 1 }))}`);
w('The rate, the suction pressure, the gas gravity and k in that call are all good. The fault is the ratio limit, and the message is about the ratio limit.');
w();
w('THE COMPRESSIBILITY WINDOW. engines/facilities/separatorSizing.js in this same package exports its DAK validity bounds and refuses outside them by name. This module now IMPORTS those same bounds rather than restating them, which is the same one-owner rule the gas constant of Section 14 is settled by.');
w('| probe | suction psia | suction degF | Ppr | Tpr | z at suction | solver says converged | error key | gas hp |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
[['inside the window, as a control', DAK_IN_WINDOW_PROBE], ['below the temperature floor', DAK_COLD_PROBE], ['above the pressure limit', DAK_HIGH_P_PROBE]].forEach(([label, probe]) => {
  const pc = G.suttonPseudoCriticals(probe.gasSg);
  const r = C.compressionStage(probe);
  const ppr = probe.pSuctionPsia / pc.ppcPsia;
  const tpr = G.toRankine(probe.tSuctionF) / pc.tpcR;
  const z = G.dakZ({ ppr, tpr });
  w(`| ${label} | ${e6(probe.pSuctionPsia)} | ${r4(probe.tSuctionF)} | ${n(ppr, 6)} | ${n(tpr, 6)} | ${r.error === undefined ? n(r.z1, 9) : 'refused'} | ${z.converged} | ${r.error === undefined ? 'absent' : 'present'} | ${r.error === undefined ? r4(r.gasHp) : 'refused'} |`);
});
w('The published window is a reduced temperature from 1.0 to 3.0 and a reduced pressure up to 30. Two of those three rows sit outside it and are refused; the convergence column is why reading that flag would never have caught either, because the solver is perfectly happy at both and reports so.');
w('The refusal carries the reduced coordinates and the state they were taken at, and it says which end of the train died:');
[['below the temperature floor', DAK_COLD_PROBE], ['above the pressure limit', DAK_HIGH_P_PROBE]].forEach(([label, probe]) => {
  const r = C.compressionStage(probe);
  w(`- ${label}: Ppr ${n(r.ppr, 6)}, Tpr ${n(r.tpr, 6)}, at ${e6(r.atPsia)} psia and ${r4(r.atF)} degF, state "${r.state}"`);
});
w(`A suction BELOW the reduced pressure the fit data start at is accepted rather than refused, exactly as separatorSizing accepts it, and it is noted instead: ${(() => { const lowP = C.compressionStage({ qMMscfd: 20, pSuctionPsia: 12, tSuctionF: 100, ratio: 2, gasSg: 0.65, k: 1.28 }); return lowP.zNote === null ? 'no note' : `"${lowP.zNote}"`; })()}`);
w('The surface runs to the ideal-gas limit as the reduced pressure goes to zero, so a low-pressure suction is an ordinary machine and not an extrapolation. A window has two kinds of edge and they are not the same kind.');
w();

// --------------------------------------------------------------- SECTION 16
w('# SECTION 16: The published golden cases, and the engine beside them (read by every tier)');
w();
w(`The pump goldens carry ${GP.curves.length + GP.duty.length + GP.npsh.length + GP.power.length + GP.viscosity.length} cases in five blocks and the compression goldens ${GC.stages.length + GC.staging.length} cases in two, which is ${GP.curves.length + GP.duty.length + GP.npsh.length + GP.power.length + GP.viscosity.length + GC.stages.length + GC.staging.length} published cases for the ${Object.keys(P).length + Object.keys(C).length} exported functions of the two modules (both counts read off the files themselves).`);
w();
w('Published curve fits:');
GP.curves.forEach((row, i) => {
  const f = P.fitPumpCurve({ points: row.points });
  w(`- curve ${i}: c0 ${e6(f.coefficients.c0)} against golden ${e6(row.c0)}, c1 ${e6(f.coefficients.c1)} against golden ${e6(row.c1)}, c2 ${e6(f.coefficients.c2)} against golden ${e6(row.c2)}, shutoff ${e6(f.shutoffHeadFt)} against golden ${e6(row.shutoffHeadFt)}`);
  w(`  the golden also records the maximum orthogonality residual of the least-squares solve, ${row.maxOrthogonalityResidual} (golden), which is the property that makes it a least-squares fit at all; the engine reports the conditioning of that solve as ${n(f.conditionNumber, 6)} and its R squared as ${n(f.rSquared, 9)}`);
});
w();
w('Published duty points:');
GP.duty.forEach((row, i) => {
  const f = P.fitPumpCurve({ points: row.points });
  const s = P.systemCurve({ staticHeadFt: row.staticHeadFt, frictionHeadFt: row.frictionHeadFt, atFlowGpm: row.atFlowGpm });
  const d = P.dutyPoint({ pump: f, system: s, qMaxGpm: 3000 });
  w(`- duty ${i} (static ${e6(row.staticHeadFt)} ft, friction ${e6(row.frictionHeadFt)} ft at ${e6(row.atFlowGpm)} gpm): ${e6(d.qGpm)} gpm against golden ${e6(row.qGpm)}, ${e6(d.headFt)} ft against golden ${e6(row.headFt)}`);
});
w();
const POWER_Q = GP.power.map((row) => P.pumpPower(row).brakeHp / row.brakeHp);
const NPSH_Q = GP.npsh.map((row) => P.npshAvailable(row).npshaFt / row.npshaFt);
w(`Published power cases. The golden was written through SI watts at a water density its own oracle states, which is not the density the horsepower packaging of Section 4 carries, so the two do NOT agree to machine precision and the engine gate is written with a tolerance. The worst quotient across the ${POWER_Q.length} power cases below is ${n(POWER_Q.reduce((a, b) => (Math.abs(b - 1) > Math.abs(a - 1) ? b : a)), 9)} and across the ${NPSH_Q.length} NPSH cases after them ${n(NPSH_Q.reduce((a, b) => (Math.abs(b - 1) > Math.abs(a - 1) ? b : a)), 9)}, so the disagreement is ${Math.max(...POWER_Q.concat(NPSH_Q).map((q) => Math.abs(q - 1)))} at its largest (all derived from the quotient columns below). The quotient column on each row is the size of it:`);
GP.power.forEach((row, i) => {
  const p = P.pumpPower(row);
  w(`- power ${i} (${e6(row.qGpm)} gpm, ${e6(row.headFt)} ft, gravity ${e6(row.sg)}, efficiency ${e6(row.efficiency)}): brake ${e6(p.brakeHp)} hp against golden ${e6(row.brakeHp)} hp, quotient ${n(p.brakeHp / row.brakeHp, 9)} (derived)`);
});
w();
w('Published NPSH cases, written the same way:');
GP.npsh.forEach((row, i) => {
  const r = P.npshAvailable(row);
  w(`- npsh ${i} (${e6(row.suctionPressurePsia)} psia over ${e6(row.vapourPressurePsia)} psia, gravity ${e6(row.sg)}): ${e6(r.npshaFt)} ft against golden ${e6(row.npshaFt)} ft, quotient ${n(r.npshaFt / row.npshaFt, 9)} (derived)`);
});
w();
w('Published viscosity cases:');
GP.viscosity.forEach((row, i) => {
  const r = P.viscosityCorrection(row);
  w(`- viscosity ${i} (${e6(row.viscosityCSt)} cSt at ${e6(row.speedRpm)} rpm): B ${n(r.B, 9)} against golden ${n(row.B, 9)}, flow factor ${n(r.cQ, 9)} against golden ${n(row.cQ, 9)}, efficiency factor ${n(r.cEta, 9)} against golden ${n(row.cEta, 9)}`);
});
w();
w('Published staging cases:');
GC.staging.forEach((row, i) => {
  const s = C.stageCount(row);
  w(`- staging ${i} (${e6(row.pSuctionPsia)} to ${e6(row.pDischargePsia)} psia at ${r4(row.tSuctionF)} degF, k ${e6(row.k)}): ${s.stages} ${s.stages === 1 ? 'stage' : 'stages'} against golden ${row.stages}, governed by ${s.governedBy}, ratio per stage ${f9(s.ratioPerStage)}`);
});
w();
w('Published stage cases:');
GC.stages.forEach((row, i) => {
  const r = C.compressionStage(row);
  w(`- stage ${i} (${e6(row.qMMscfd)} MMscfd, ratio ${e6(row.ratio)}, k ${e6(row.k)}, efficiency ${e6(row.polytropicEfficiency)}): head ${r4(r.headPolyFtLbfLbm)} against golden ${r4(row.headPolyFtLbfLbm)}, discharge ${r4(r.tDischargeF)} degF against golden ${r4(row.tDischargeF)}, gas hp ${r4(r.gasHp)} against golden ${r4(row.gasHp)}, z average ${n(r.zAvg, 9)} against golden ${n(row.zAvg, 9)}`);
});
w();
w();
w('EVERY PUBLISHED FIELD, CHECKED RATHER THAN SAMPLED. The four stage fields quoted above are the readable ones; the file carries more, and each of them is compared here against the engine on every case, with the fields the file states as inputs left out because they are what the case IS:');
const stageInputKeys = new Set(['qMMscfd', 'pSuctionPsia', 'tSuctionF', 'ratio', 'gasSg', 'k', 'polytropicEfficiency', 'mechanicalEfficiency', 'label', 'source']);
const stageOutputKeys = Object.keys(GC.stages[0]).filter((key) => !stageInputKeys.has(key));
w('| published stage field | cases | bit for bit | worst relative gap |');
w('| --- | --- | --- | --- |');
let stageWorst = 0; let stageWorstKey = '';
stageOutputKeys.forEach((key) => {
  let worst = 0; let n0 = 0;
  GC.stages.forEach((row) => {
    if (typeof row[key] !== 'number') return;
    n0 += 1;
    const r = C.compressionStage(row);
    const gap = row[key] === 0 ? Math.abs(r[key]) : Math.abs(r[key] - row[key]) / Math.abs(row[key]);
    if (!(gap <= worst)) worst = gap;
  });
  if (!(worst <= stageWorst)) { stageWorst = worst; stageWorstKey = key; }
  w(`| ${key} | ${n0} | ${worst === 0} | ${worst} |`);
});
const bitForBit = stageOutputKeys.filter((key) => GC.stages.every((row) => typeof row[key] !== 'number' || C.compressionStage(row)[key] === row[key]));
w(`${stageOutputKeys.length} published stage fields across ${GC.stages.length} cases. ${bitForBit.length} of them come back BIT FOR BIT (${bitForBit.join(', ')}) and ${stageOutputKeys.length - bitForBit.length} do not, and neither answer is a failure: the file is written by a Python oracle carrying fifty digits and the engine is double precision, so on a field where the two routes take different arithmetic they land a little apart. The worst gap on the table is ${stageWorst} on ${stageWorstKey}.`);
w('A gate against a golden therefore has to carry a tolerance, and the tolerance has to be chosen from the size of the disagreement the two routes really have rather than from what looks tidy. Demanding equality on this table would fail on arithmetic rather than on error. The other end of that choice is the one worth thinking about: a tolerance loose enough to swallow a mis-transcribed constant catches nothing at all, so the useful question about any tolerance is what error it is still small enough to see.');
w();
w('# HELD FOR LITERATURE, taught as a limit and never graded: all of them. Every one of those published cases was written by an oracle. There is no measured pump test, no vendor performance run and no field compressor datasheet anywhere in this course.');
w();

// --------------------------------------------------------------- SECTION 17
w('# SECTION 17: What this course teaches as limits and never as answers (owned by Expert m05, and read again in Associate m06, Professional m06 and Expert m06)');
w();
w('# The three tier readings, Associate m06, Professional m06 and Expert m06, assemble the sections above; they introduce no number of their own.');
w();
w('Eight things are HELD FOR LITERATURE. Each is used, each is printed, and none of them decides a graded answer anywhere in this course.');
w();
w('1. The Hydraulic Institute viscosity correction of Section 10. Empirical, unsourced in this repository, and the head factor is taken equal to the flow factor at best efficiency.');
w('2. The impeller trim shortfall model of Section 8. The engine calls it "the published shortfall" and names no publication. Its power leg is left as the ideal cube for that same reason, and the efficiency the return implies is computed and reported rather than modelled.');
w('3. The operating-region bands of Section 5, at 50, 70, 120 and 140 percent of best efficiency flow.');
w('4. The NPSH margin rule of Section 7, the larger of 3 ft and 35 percent of required. Both halves of it are measurable out of the engine, and Section 7 measures them; the rule itself is customary.');
w('5. The machine-screening thresholds of Section 14.');
w('6. The 300 degF DEFAULT discharge limit of Sections 11, 12 and 13. It is the figure the engine uses when the caller states none, and the warning is measured against whatever the caller does state.');
w('7. What the implied water density of Section 4 is away from real water. The packagings are measurable; the handbook figure is not here.');
w('8. Every one of the published golden cases of Section 16. The affinity speed band of Section 8 is held on the same footing: it is a sanity bound and no publication here says where the laws stop describing a real machine.');
w();
w('And four things are not in these engines at all, so the course names the seam rather than papering over it:');
w('- there is no compressor surge line, no surge margin, no recycle valve and no anti-surge control anywhere in the package;');
w('- there is no seal and no bearing calculation. Section 5 quotes the engine saying that bearing and seal life shorten below 70 percent of best efficiency flow, and that sentence is the whole of what this package knows about it;');
w('- there is no machine curve, no wheel selection, no valve dynamics and no rod loading;');
w('- there is no required-NPSH-against-flow curve, which is why Section 5\'s own note says to read the vendor curve at the duty flow before the suction margin means anything.');
w();
w('What this course DOES answer is the duty a vendor should be quoting against, the power and the stage count to expect, the suction margin the selection has to survive, and the reasons behind all four.');

process.stdout.write(`${out.join('\n')}\n`);
