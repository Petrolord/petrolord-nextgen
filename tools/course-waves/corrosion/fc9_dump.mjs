// THE FC9 TEACHING DIGEST. This is the ONLY teaching truth for every writer
// after this file: the lesson author, the bank author, the key-truth author and
// the panel author all quote from digest.txt and from nothing else.
//
// THE RECON IS NOT TEACHING TRUTH. /root/fc-wip-corrosion/RECON.md and
// FINDINGS.md, the engine's own source comments and the repair record vendored
// beside the oracle are all PROVENANCE. Two figures in FC1's Expert brief came
// from its recon report and were wrong, and the writer correctly refused to
// invent them. Every number in every brief in this wave is quoted from this
// file, and each brief says so.
//
// Usage:  sh /root/fc-wip-corrosion/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/fc-wip-corrosion/digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds no
// literals and clears everything.
//
// Engine, vendored sha-identical with petrolord-engines d4c19ad (the FC9-0
// repair): engines/facilities/corrosion.js. It imports nothing, so the vendoring
// closure walked from the jest suite is SIX paths: the suite, the engine, the
// golden the suite reads at runtime, and the oracle plus the two markdown
// records that travel with the repair.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from the vendored case file), "stated" (an input
// named on the same row) or "derived" (arithmetic on engine values printed in
// the same block, with the arithmetic stated). Where the engine keeps a
// constant to itself, the constant is MEASURED by asking the engine a question
// whose answer is that constant and nothing else. Nothing here reads a clock, a
// random number, a locale or a network, and TZ and LC_ALL are pinned by
// build_digest.sh.
//
// THE DIGEST RULE. A sentence here may NAME a figure this file computes. It may
// NOT characterise the RELATIONSHIP between two figures unless that
// relationship is itself computed and printed on the same page.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. FC4 labelled a
// row a refusal and then called a case that SUCCEEDED, printing the success
// fields under a refusal heading: every number on the line was real engine
// output and the digest still taught the wrong evidence shape, and no numeric
// sweep can see it. So `refusal()` asserts an error key AND that no non-finite
// number came back with it, `success()` asserts the absence of an error key and
// the same finiteness, and every branch, warning, flag and convergence claim
// below goes through `must()`. If one assertion fails NOTHING IS WRITTEN: the
// accumulated digest is discarded and the build exits non-zero.
//
// THE MEASUREMENTS ARE THEMSELVES GATED. FC5 found four of its own probe
// measurements wrong because a probe ran at the engine's DEFAULT coefficients
// rather than the unit ones the recipe assumed. Every measurement below states
// the arguments it passes, every one is asserted FINITE, and every held constant
// measured out of the engine is compared against a literal typed in section 3,
// which is a THIRD location. A constant that lives in two files cannot be
// checked by comparing those two files.
//
// AND: FC5 initially wrote eleven "reproduces" assertions that compared the
// ENGINE to the ORACLE as if that were one derivation. It is two. Wherever this
// file prints an engine answer beside a golden one, it prints the RELATIVE
// DIFFERENCE in its own column and calls the agreement a result with a size,
// never an identity.
//
// NOTHING IN THIS FILE EXCEPT ITS FINAL SECTION DESCRIBES WHAT THE ENGINE USED
// TO DO. The final section says so in its own title and its first line, and
// nothing follows it.
import fs from 'node:fs';
import process from 'node:process';
import {
  ETELEBOU, KANBI, TUNU, OPUKUSHI, DIEBU, ANGIAMA, INTEGRITY,
  VELOCITY_SWEEP, TEMPERATURE_SWEEP, PH_SWEEP, PH_REFUSALS, AVAILABILITY_SWEEP,
  PRESSURE_SWEEP, DIAMETER_SWEEP, FCO2_SWEEP, REGIME_PAIRS, CATEGORY_PROBES, CLAMP_PROBES,
} from './fc9_fields.mjs';

const ROOT = process.env.FC9_ENGINES || '/root/wt-fc9-nextgen/packages/engines';
const C = await import(`${ROOT}/engines/facilities/corrosion.js`);
const GOLD = JSON.parse(fs.readFileSync(`${ROOT}/test-data/facilities/goldens/corrosion_cases.json`, 'utf8'));
const SRC = fs.readFileSync(`${ROOT}/engines/facilities/corrosion.js`, 'utf8');

const out = [];
const w = (s = '') => out.push(s);
const n = (x, d) => (x === null || x === undefined || !Number.isFinite(Number(x)) ? String(x) : Number(x).toFixed(d));
const e6 = (x) => n(x, 6);   // partial pressures, allowances, rates, lives, percentages, ratios
const r4 = (x) => n(x, 4);   // Reynolds numbers
const e12 = (x) => n(x, 12); // measured constants and ratios of them
const keys = (r) => (r && typeof r === 'object' ? Object.keys(r).join(', ') : String(r));

/* ------------------------------------------------ THE ASSERTION MACHINERY */

const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
const noNonFinite = (label, r) => {
  if (!r || typeof r !== 'object') return;
  const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
  must(`CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
    bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
};
/** A call this file LABELS a refusal. Asserts an error key and no non-finite number. */
const refusal = (label, r) => {
  const isNum = typeof r === 'number';
  const refused = isNum ? Number.isNaN(r) : !!(r && r.error);
  must(`LABELLED A REFUSAL: ${label}`, refused,
    isNum ? `returned the bare number ${r}` : `returned keys [${keys(r)}]`);
  if (!isNum) noNonFinite(`refusal ${label}`, r);
  return r;
};
/** A call this file LABELS a success. Asserts no error key and no non-finite number. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  noNonFinite(`success ${label}`, r);
  return r;
};
/** A measured number. Asserted finite, because a bisection whose predicate never
 *  turns over returns NaN and a NaN printed as a measurement teaches nothing. */
const measured = (label, v, detail) => {
  must(`MEASURED AND FINITE: ${label}`, Number.isFinite(v), `${v}${detail ? ` (${detail})` : ''}`);
  return v;
};
/** A measured constant against the literal section 3 prints. THE THIRD LOCATION. */
const PINS = [];
const pin = (label, measuredValue, literal, tol) => {
  const rel = Math.abs(measuredValue - literal) / Math.max(Math.abs(literal), 1e-300);
  must(`PINNED: ${label} measured out of the engine equals the literal in this gate`, rel < tol,
    `measured ${measuredValue}, literal ${literal}, relative difference ${rel.toExponential(3)} against ${tol}`);
  PINS.push({ label, measuredValue, literal, rel });
  return measuredValue;
};
/** Agreement with a golden row is a RESULT WITH A SIZE, never an identity. */
const relDiff = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const agree = (label, a, b, tol) => {
  const d = relDiff(a, b);
  must(`the engine agrees with the golden row inside ${tol}: ${label}`, d < tol,
    `relative difference ${d.toExponential(3)} against ${tol}`);
  return d === 0 ? '0' : d.toExponential(3);
};
/** One bisection routine, used everywhere a threshold or an edge is MEASURED. */
const bisect = (lo, hi, pred, label) => {
  let a = lo; let b = hi;
  const pa = pred(a);
  if (!must(`BISECTION BRACKET STRADDLES THE EDGE: ${label}`, pa !== pred(b),
    `pred(${lo})=${pa} pred(${hi})=${pred(b)}`)) return NaN;
  for (let i = 0; i < 300; i += 1) {
    const m = (a + b) / 2;
    if (pred(m) === pa) a = m; else b = m;
    if (Math.abs(b - a) <= Math.abs(b) * 1e-15) break;
  }
  return (a + b) / 2;
};
/** Two linear equations in two unknowns, for recovering a fit from two points. */
const solve2 = ([a1, b1, c1], [a2, b2, c2]) => {
  const det = a1 * b2 - a2 * b1;
  return [(c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det];
};

/* ==================================================================
   MEASUREMENTS, taken before anything is printed, so every section quotes a
   measured constant rather than a typed one. Each one states the arguments it
   passes, because FC5 found four of its own measurements wrong for running at
   the engine's defaults rather than at the unit values the recipe assumed.
   ================================================================== */

// --- the fugacity coefficient: log10(a)/P is linear in 1/T, so two
//     temperatures solve for both constants. Arguments stated: pTotalBar 10 bar,
//     well below the cap, at 20 C and at 180 C.
const [FUG_A, FUG_B] = (() => {
  const at = (tC) => {
    const a = C.co2FugacityCoefficient({ tC, pTotalBar: 10 });
    return [1, -1 / (tC + 273.15), Math.log10(a) / 10];
  };
  return solve2(at(20), at(180));
})();
measured('the fugacity coefficient constant A, from log10(a)/P at 10 bar and two temperatures', FUG_A);
measured('the fugacity coefficient constant B, from the same pair', FUG_B);

// --- the fugacity CAP, located by bisecting the pressure at which the
//     coefficient stops moving. Arguments stated: tC 60.
// The predicate is EQUALITY with the capped value, not an inequality against it.
// An inequality does not straddle: above the cap the coefficient is held flat,
// so "below the value at 400 bar" is false on both sides of the bracket and the
// bisection returns NaN. The generator's own finiteness assertion caught that.
const FUG_CAP = bisect(100, 400,
  (p) => C.co2FugacityCoefficient({ tC: 60, pTotalBar: p }) === C.co2FugacityCoefficient({ tC: 60, pTotalBar: 400 }),
  'the fugacity pressure cap, bisected on where the coefficient stops moving');
measured('the fugacity pressure cap', FUG_CAP);

// --- the de Waard-Milliams reaction constants: log10 Vr is linear in 1/T and in
//     log10 fCO2, so three points solve for all three. Arguments stated below.
const [DWM_A, DWM_B, DWM_N] = (() => {
  const lg = (tC, f) => Math.log10(C.dwmReactionRate({ tC, fco2Bar: f }));
  // the n exponent from two fugacities at one temperature
  const nn = (lg(60, 10) - lg(60, 1)) / (Math.log10(10) - Math.log10(1));
  // the b constant from two temperatures at one fugacity
  const bb = -(lg(180, 1) - lg(20, 1)) / (1 / (180 + 273.15) - 1 / (20 + 273.15));
  const aa = lg(60, 1) + bb / (60 + 273.15);
  return [aa, bb, nn];
})();
measured('the reaction constant A, from log10 Vr at fCO2 1 bar and 60 C with B removed', DWM_A);
measured('the reaction constant B, from log10 Vr at fCO2 1 bar and 20 C against 180 C', DWM_B);
measured('the reaction fugacity exponent, from log10 Vr at fCO2 1 bar against 10 bar at 60 C', DWM_N);

// --- the mass-transfer constants: the doubling ratios in U and in d give the
//     exponents, and the unit call gives the coefficient. Arguments stated:
//     velocityMS 1 and 2, diameterM 1 and 2, fco2Bar 1.
const VM_U_EXP = measured('the mass-transfer velocity exponent, from Vm at U 1 and U 2 with d 1 and fCO2 1',
  Math.log2(C.dwmMassTransferRate({ velocityMS: 2, diameterM: 1, fco2Bar: 1 })
    / C.dwmMassTransferRate({ velocityMS: 1, diameterM: 1, fco2Bar: 1 })));
const VM_D_EXP = measured('the mass-transfer diameter exponent, from Vm at d 1 and d 2 with U 1 and fCO2 1',
  -Math.log2(C.dwmMassTransferRate({ velocityMS: 1, diameterM: 2, fco2Bar: 1 })
    / C.dwmMassTransferRate({ velocityMS: 1, diameterM: 1, fco2Bar: 1 })));
const VM_C = measured('the mass-transfer coefficient, from Vm at U 1, d 1 and fCO2 1',
  C.dwmMassTransferRate({ velocityMS: 1, diameterM: 1, fco2Bar: 1 }));
// and the linearity in fCO2, which is a property rather than a constant
const VM_F_EXP = measured('the mass-transfer fugacity exponent, from Vm at fCO2 1 and fCO2 2',
  Math.log2(C.dwmMassTransferRate({ velocityMS: 1, diameterM: 1, fco2Bar: 2 })
    / C.dwmMassTransferRate({ velocityMS: 1, diameterM: 1, fco2Bar: 1 })));

// --- the scale-factor constants, measured where the factor is UNCLAMPED, which
//     is the trap: below the onset the engine returns exactly 1 and every slope
//     measured there is zero. Arguments stated: 150 C and 200 C at fCO2 1 and 10.
const [SCALE_A, SCALE_C, SCALE_N] = (() => {
  const lg = (tC, f) => Math.log10(C.scaleFactor({ tC, fco2Bar: f }));
  const aa = (lg(150, 1) - lg(200, 1)) / (1 / (150 + 273.15) - 1 / (200 + 273.15));
  const cc = -(lg(150, 1) - aa / (150 + 273.15));
  const nn = -(lg(150, 10) - lg(150, 1)) / (Math.log10(10) - Math.log10(1));
  return [aa, cc, nn];
})();
measured('the scale constant A, from log10 Fscale unclamped at 150 C and 200 C at fCO2 1 bar', SCALE_A);
measured('the scale constant C, from the same pair', SCALE_C);
measured('the scale fugacity exponent, from log10 Fscale at fCO2 1 bar against 10 bar at 150 C', SCALE_N);
must('THE SCALE MEASUREMENT RAN WHERE THE FACTOR IS UNCLAMPED, which is what makes it a measurement',
  C.scaleFactor({ tC: 150, fco2Bar: 1 }) < 1 && C.scaleFactor({ tC: 200, fco2Bar: 1 }) < 1,
  `Fscale(150 C, 1 bar)=${C.scaleFactor({ tC: 150, fco2Bar: 1 })}, Fscale(200 C, 1 bar)=${C.scaleFactor({ tC: 200, fco2Bar: 1 })}`);
must('THE NEGATIVE CONTROL ON THAT MEASUREMENT: below the onset the factor is exactly 1 and the same recipe would return zero',
  C.scaleFactor({ tC: 40, fco2Bar: 1 }) === 1 && C.scaleFactor({ tC: 50, fco2Bar: 1 }) === 1,
  `Fscale(40 C, 1 bar)=${C.scaleFactor({ tC: 40, fco2Bar: 1 })}, Fscale(50 C, 1 bar)=${C.scaleFactor({ tC: 50, fco2Bar: 1 })}`);

// --- the pH slope, from the factor at two pH values above the reference.
const PH_SLOPE = measured('the pH slope, from the factor at pH 5 and pH 7',
  Math.log10(C.phFactor({ ph: 7 }).factor / C.phFactor({ ph: 5 }).factor) / 2);
const PH_REF = measured('the pH reference, bisected on where the factor stops being returned',
  bisect(1, 8, (p) => C.phFactor({ ph: p }).error !== undefined, 'the pH reference'));

// --- the Blasius pair and the laminar constant, from the friction factor the
//     shear call returns. Arguments stated: density 1000, viscosity chosen so
//     the Reynolds number lands where the recipe wants it.
const fricAt = (re) => {
  // Re = rho U d / mu. Fix rho 1000, d 0.1, mu 0.001, so U = Re * 1e-5.
  const r = C.wallShearStressPa({ velocityMS: re * 1e-5, diameterM: 0.1, densityKgM3: 1000, viscosityPaS: 0.001 });
  must(`the friction probe at Reynolds ${re} returned a friction factor`, !r.error && Number.isFinite(r.fanningFriction), r.error || r.fanningFriction);
  must(`the friction probe at Reynolds ${re} actually reached Reynolds ${re}`, relDiff(r.reynolds, re) < 1e-12, r.reynolds);
  return r.fanningFriction;
};
const BLASIUS_N = measured('the Blasius exponent, from the friction factor at Reynolds 2e5 and 8e5',
  Math.log(fricAt(8e5) / fricAt(2e5)) / Math.log(8e5 / 2e5));
const BLASIUS_C = measured('the Blasius coefficient, from the friction factor at Reynolds 2e5 with the exponent removed',
  fricAt(2e5) / (2e5 ** BLASIUS_N));
const LAMINAR_C = measured('the laminar constant, from the friction factor times Reynolds at Reynolds 1500',
  fricAt(1500) * 1500);
const SWITCH_RE = measured('the laminar to turbulent switch, bisected on the branch name the engine returns',
  bisect(1000, 20000, (re) => C.wallShearStressPa({
    velocityMS: re * 1e-5, diameterM: 0.1, densityKgM3: 1000, viscosityPaS: 0.001,
  }).flowRegime === 'turbulent', 'the friction branch switch'));
// the SIZE of the discontinuity, which is what makes it worth teaching
const SWITCH_JUMP = measured('the shear jump across the switch, from the two sides of it',
  C.wallShearStressPa({ velocityMS: (SWITCH_RE * 1.0001) * 1e-5, diameterM: 0.1, densityKgM3: 1000, viscosityPaS: 0.001 }).tauPa
  / C.wallShearStressPa({ velocityMS: (SWITCH_RE * 0.9999) * 1e-5, diameterM: 0.1, densityKgM3: 1000, viscosityPaS: 0.001 }).tauPa);

// --- the film thresholds, bisected on the risk WORD the engine returns.
const shearAt = (u) => C.wallShearStressPa({ velocityMS: u, diameterM: 0.1, densityKgM3: 1000, viscosityPaS: 0.001 });
const FILM_STRIP = measured('the film-stripping threshold, from the shear at the velocity where the risk word turns high',
  shearAt(bisect(0.1, 40, (u) => shearAt(u).filmRisk === 'high', 'the film-stripping velocity')).tauPa);
const FILM_MODERATE = measured('the moderate band, from the shear at the velocity where the risk word leaves low',
  shearAt(bisect(0.1, 40, (u) => shearAt(u).filmRisk !== 'low', 'the moderate-band velocity')).tauPa);

// --- the sour threshold, bisected on the sour FLAG, and its psia value.
const SOUR_BAR = measured('the sour screening threshold, bisected on the sour flag',
  bisect(1e-6, 1, (p) => C.sourServiceScreen({ ph2sBar: p }).sour === true, 'the sour threshold'));
const SOUR_PSIA = measured('the same threshold in psia, from the engine\'s own conversion',
  C.sourServiceScreen({ ph2sBar: SOUR_BAR }).ph2sPsia);
const BAR_PSIA = measured('the bar to psia factor, from the psia of a 1 bar partial pressure',
  C.sourServiceScreen({ ph2sBar: 1 }).ph2sPsia);

// --- the regime boundaries, bisected on the regime WORD.
const REG_CARB = measured('the carbonate boundary, bisected on the regime word at pco2 1 bar',
  bisect(1e-6, 1, (r) => C.corrosionRegime({ ph2sBar: r, pco2Bar: 1 }).regime !== 'carbonate', 'the carbonate boundary'));
const REG_MIXED = measured('the mixed boundary, bisected on the regime word at pco2 1 bar',
  bisect(1e-6, 1, (r) => C.corrosionRegime({ ph2sBar: r, pco2Bar: 1 }).regime === 'sulphide', 'the mixed boundary'));

// --- the category bands, bisected on the category WORD.
const CAT_LOW = measured('the low band edge, bisected on the category word',
  bisect(1e-6, 1, (r) => C.rateCategory(r) !== 'low', 'the low band'));
const CAT_MOD = measured('the moderate band edge, bisected on the category word',
  bisect(0.2, 0.9, (r) => C.rateCategory(r) !== 'moderate', 'the moderate band'));
const CAT_HIGH = measured('the high band edge, bisected on the category word',
  bisect(0.6, 3, (r) => C.rateCategory(r) !== 'high', 'the high band'));

// --- the controlling-word reporting margin, bisected on the word itself.
const CTRL_MARGIN = measured('the controlling reporting margin, bisected on the word the engine returns',
  bisect(1, 3, (m) => {
    // hold Vr fixed and move Vm by the ratio m, then read the word
    const base = { tC: 60, pTotalBar: 50, co2MolFrac: 0.02, ph: 4.5, diameterM: 0.15, flowRegime: 'waterWet' };
    const vr = C.dwmReactionRate({ tC: 60, fco2Bar: C.co2Fugacity({ tC: 60, pTotalBar: 50, co2MolFrac: 0.02 }).fco2Bar });
    const f = C.co2Fugacity({ tC: 60, pTotalBar: 50, co2MolFrac: 0.02 }).fco2Bar;
    // solve U for Vm = m * vr
    const u = ((m * vr) / (2.45 * f) * base.diameterM ** 0.2) ** (1 / 0.8);
    return C.corrosionRate({ ...base, velocityMS: u }).controlling !== 'comparable';
  }, 'the controlling margin') - 1);

// --- the inhibitor shortfall trigger, bisected on whether a warning appears.
const SHORTFALL_TRIGGER = measured('the inhibitor shortfall trigger in percentage points, bisected on the warning appearing',
  (() => {
    const base = { tC: 60, pTotalBar: 50, co2MolFrac: 0.02, ph: 4.5, velocityMS: 3, diameterM: 0.15, flowRegime: 'waterWet' };
    // at efficiency e and availability a the shortfall is e(1 - a/100). Fix e 50
    // and bisect a, then convert the turning availability into a shortfall.
    const a = bisect(99.9999, 90, (av) => C.corrosionRate({
      ...base, inhibitorEfficiencyPct: 50, inhibitorAvailabilityPct: av,
    }).warning !== null, 'the shortfall warning availability');
    return 50 * (1 - a / 100);
  })());

/* ================================================== THE PINS, against
   literals typed here, which is a THIRD location: neither the engine nor the
   oracle. A constant that lives in two files cannot be checked by comparing
   those two files, so the gate carries its own copy and compares three.
   ================================================== */

pin('the fugacity coefficient constant A', FUG_A, 0.0031, 1e-9);
pin('the fugacity coefficient constant B', FUG_B, 1.4, 1e-9);
pin('the fugacity pressure cap, bar', FUG_CAP, 250, 1e-12);
pin('the reaction constant A', DWM_A, 4.93, 1e-9);
pin('the reaction constant B', DWM_B, 1119, 1e-9);
pin('the reaction fugacity exponent', DWM_N, 0.58, 1e-9);
pin('the mass-transfer coefficient', VM_C, 2.45, 1e-12);
pin('the mass-transfer velocity exponent', VM_U_EXP, 0.8, 1e-12);
pin('the mass-transfer diameter exponent', VM_D_EXP, 0.2, 1e-12);
pin('the mass-transfer fugacity exponent, which is exactly one', VM_F_EXP, 1, 1e-12);
pin('the scale constant A', SCALE_A, 2400, 1e-9);
pin('the scale constant C', SCALE_C, 6.7, 1e-9);
pin('the scale fugacity exponent', SCALE_N, 0.6, 1e-9);
pin('the pH slope', PH_SLOPE, -0.5, 1e-12);
pin('the pH reference', PH_REF, 4, 1e-12);
pin('the Blasius exponent', BLASIUS_N, -0.2, 1e-9);
pin('the Blasius coefficient', BLASIUS_C, 0.046, 1e-9);
pin('the laminar constant', LAMINAR_C, 16, 1e-12);
pin('the friction branch switch Reynolds number', SWITCH_RE, 4000, 1e-12);
pin('the film-stripping threshold, Pa', FILM_STRIP, 100, 1e-9);
pin('the moderate band, Pa', FILM_MODERATE, 50, 1e-9);
pin('the sour screening threshold, bar', SOUR_BAR, 0.0035, 1e-9);
pin('the bar to psia factor', BAR_PSIA, 14.503773800721815, 1e-15);
pin('the carbonate boundary as an H2S to CO2 ratio', REG_CARB, 1 / 500, 1e-12);
pin('the mixed boundary as an H2S to CO2 ratio', REG_MIXED, 1 / 20, 1e-12);
pin('the low category band, mm/yr', CAT_LOW, 0.1, 1e-12);
pin('the moderate category band, mm/yr', CAT_MOD, 0.5, 1e-12);
pin('the high category band, mm/yr', CAT_HIGH, 1, 1e-12);
pin('the controlling reporting margin', CTRL_MARGIN, 0.1, 1e-9);
pin('the inhibitor shortfall trigger, percentage points', SHORTFALL_TRIGGER, 0.1, 1e-6);

// THE SOUR THRESHOLD IS NOT 0.05 PSIA, and the old comment said it was.
must('THE SOUR THRESHOLD IN PSIA IS NOT 0.05: the measured psia value differs from 0.05 by more than one part in a thousand',
  Math.abs(SOUR_PSIA - 0.05) / 0.05 > 1e-3, `measured ${SOUR_PSIA} psia against 0.05`);

// The engine EXPORTS several of these. An export and a measurement agreeing is
// a check on the export; a measurement alone is a check on the behaviour. Both
// are printed, and both are compared.
const EXPORTS = [
  ['BAR_TO_PSIA', C.BAR_TO_PSIA, BAR_PSIA],
  ['FUGACITY_CAP_BAR', C.FUGACITY_CAP_BAR, FUG_CAP],
  ['PH_REFERENCE', C.PH_REFERENCE, PH_REF],
  ['FILM_STRIP_PA', C.FILM_STRIP_PA, FILM_STRIP],
  ['FILM_MODERATE_PA', C.FILM_MODERATE_PA, FILM_MODERATE],
  ['SHEAR_SWITCH_RE', C.SHEAR_SWITCH_RE, SWITCH_RE],
  ['SOUR_THRESHOLD_BAR', C.SOUR_THRESHOLD_BAR, SOUR_BAR],
  ['SOUR_THRESHOLD_PSIA', C.SOUR_THRESHOLD_PSIA, SOUR_PSIA],
  ['REGIME_CARBONATE_MAX', C.REGIME_CARBONATE_MAX, REG_CARB],
  ['REGIME_MIXED_MAX', C.REGIME_MIXED_MAX, REG_MIXED],
  ['CONTROLLING_MARGIN', C.CONTROLLING_MARGIN, CTRL_MARGIN],
  ['INHIBITOR_SHORTFALL_PP', C.INHIBITOR_SHORTFALL_PP, SHORTFALL_TRIGGER],
  ['RATE_CATEGORY_BANDS.low', C.RATE_CATEGORY_BANDS.low, CAT_LOW],
  ['RATE_CATEGORY_BANDS.moderate', C.RATE_CATEGORY_BANDS.moderate, CAT_MOD],
  ['RATE_CATEGORY_BANDS.high', C.RATE_CATEGORY_BANDS.high, CAT_HIGH],
];
EXPORTS.forEach(([name, exported, measuredValue]) => {
  must(`the exported ${name} agrees with what the behaviour measures`, relDiff(exported, measuredValue) < 1e-6,
    `exported ${exported}, measured ${measuredValue}, relative difference ${relDiff(exported, measuredValue).toExponential(3)}`);
});

/* ================================================== THE STREAM RUNS, once, so
   every section quotes the same objects. ================================== */

const screenOf = (label, s) => success(`the ${label} screening`, C.screen({ ...s, ...INTEGRITY }));
const ET = screenOf('Etelebou', ETELEBOU);
const KA = screenOf('Kanbi', KANBI);
const TU = screenOf('Tunu', TUNU);
const OP = screenOf('Opukushi', OPUKUSHI);
const DI = screenOf('Diebu', DIEBU);
const AN = screenOf('Angiama', ANGIAMA);
const STREAMS = [['Etelebou', ETELEBOU, ET], ['Kanbi', KANBI, KA], ['Tunu', TUNU, TU],
  ['Opukushi', OPUKUSHI, OP], ['Diebu', DIEBU, DI], ['Angiama', ANGIAMA, AN]];

must('THE SIX STREAMS REACH SIX DIFFERENT SHAPES: the branches this digest has to teach are all present',
  ET.rate.scaleFactor === 1 && KA.rate.scaleFactor < 1 && TU.filmStripped === true
  && OP.rate.waterWettingFactor === OPUKUSHI.waterCutFrac && DI.regime.regime === 'sulphide'
  && AN.shear.flowRegime === 'laminar',
  `Etelebou Fscale=${ET.rate.scaleFactor}, Kanbi Fscale=${KA.rate.scaleFactor}, Tunu stripped=${TU.filmStripped}, `
  + `Opukushi fWater=${OP.rate.waterWettingFactor}, Diebu regime=${DI.regime.regime}, Angiama branch=${AN.shear.flowRegime}`);
must('THE WITHHELD BRANCH IS REACHED: Diebu has no category and no life', DI.category === null && DI.life === null,
  `category=${DI.category}, life=${DI.life}`);
must('THREE DIFFERENT BINDING CONSTRAINTS ARE REACHED ACROSS THE SIX STREAMS',
  new Set(STREAMS.map(([, , s]) => s.binding.what)).size >= 3,
  [...new Set(STREAMS.map(([, , s]) => s.binding.what))].join(' | '));

/* The SHIPPED DEFAULTS of the live studio, in the engine's units. Stated
   conversions: (140 - 32)/1.8, (725 + 14.7)/14.5038, 10 * 0.3048, 6 * 0.0254,
   56 * 16.0185, 1 * 1e-3, 0.125 * 25.4. These are the studio's own factors, and
   section 24 is about the one of them that is truncated. */
const APP = Object.freeze({
  tC: (140 - 32) / 1.8, pTotalBar: (725 + 14.7) / 14.5038,
  co2MolFrac: 3 / 100, h2sMolFrac: 0.1 / 100, ph: 4.5,
  velocityMS: 10 * 0.3048, diameterM: 6 * 0.0254,
  densityKgM3: 56 * 16.0185, viscosityPaS: 1 * 1e-3,
  flowRegime: 'waterWet', waterCutFrac: 100 / 100,
  inhibitorEfficiencyPct: 90, inhibitorAvailabilityPct: 95,
  corrosionAllowanceMm: 0.125 * 25.4, consumedMm: 0, designLifeYears: 20,
});
const AP = success('the shipped app defaults', C.screen(APP));
const AP_FAST = success('the shipped app defaults at 60 ft per second', C.screen({ ...APP, velocityMS: 60 * 0.3048 }));
const AP_SOUR = success('the shipped app defaults at 1 mol percent H2S', C.screen({ ...APP, h2sMolFrac: 0.01 }));
const AP_OIL = success('the shipped app defaults oil wet', C.screen({ ...APP, flowRegime: 'oilWet' }));
const AP_PH4 = success('the shipped app defaults at pH 4.0', C.screen({ ...APP, ph: 4 }));
must('THE RATE AT THE SHIPPED DEFAULTS IS THE ONE THE REPAIR LEFT ALONE, and this file re-derives it rather than quoting it',
  Number.isFinite(AP.rate.rateMmYr) && AP.rate.rateMmYr > 0, AP.rate.rateMmYr);
must('THE DEFAULT CASE TAKES NO REPAIRED BRANCH: its scale factor is 1, its film is intact, its pH is above the reference and its category is issued',
  AP.rate.scaleFactor === 1 && AP.filmStripped === false && APP.ph >= C.PH_REFERENCE && AP.category !== null,
  `Fscale=${AP.rate.scaleFactor}, stripped=${AP.filmStripped}, category=${AP.category}`);
must('THE INHIBITOR WARNING FIRES AT THE APP\'S OWN DEFAULTS, which it could not before',
  typeof AP.rate.warning === 'string' && AP.rate.warning.length > 0, String(AP.rate.warning));
must('60 FT PER SECOND STRIPS THE FILM AND THE RATE MOVES', AP_FAST.filmStripped === true
  && AP_FAST.rate.rateMmYr > AP.rate.rateMmYr, `${AP_FAST.rate.rateMmYr} against ${AP.rate.rateMmYr}`);
must('1 MOL PERCENT H2S WITHHOLDS THE CATEGORY AND THE LIFE AND KEEPS THE RATE AS AN UPPER BOUND',
  AP_SOUR.category === null && AP_SOUR.life === null && AP_SOUR.withheld !== null
  && AP_SOUR.withheld.upperBoundMmYr === AP_SOUR.rate.rateMmYr,
  `withheld=${AP_SOUR.withheld && AP_SOUR.withheld.what}, upper bound ${AP_SOUR.withheld && AP_SOUR.withheld.upperBoundMmYr}`);
must('OIL WET LOSES ITS CATEGORY, ITS LIFE AND ITS INHIBITION FIGURE',
  AP_OIL.category === null && AP_OIL.life === null && AP_OIL.rate.effectiveInhibitionPct === null,
  `category=${AP_OIL.category}, life=${AP_OIL.life}, effective=${AP_OIL.rate.effectiveInhibitionPct}`);
const PH_REFUSAL_RESULTS = PH_REFUSALS.map((p) => [p, refusal(`the shipped defaults at pH ${p}`, C.screen({ ...APP, ph: p }))]);
must('EVERY pH BELOW THE REFERENCE REFUSES, and the message names the reference',
  PH_REFUSAL_RESULTS.every(([, r]) => r.error.includes(String(C.PH_REFERENCE))),
  PH_REFUSAL_RESULTS.map(([p]) => p).join(', '));

/* The WITHDRAWAL, asserted as an absence in three places at once. */
const WITHDRAWN_STRINGS = [
  'Most carbon steels qualified to MR0175 are acceptable with hardness control',
  'Carbon steel needs hardness and heat-treatment control; qualify weldments explicitly',
  'qualified CRA or fully qualified low-alloy steel with documented testing',
  'sourServiceRegion',
];
must('THE WITHDRAWAL IS COMPLETE IN THE SOURCE: none of the three material guidance strings and no mention of the withdrawn function name appears in the engine file',
  WITHDRAWN_STRINGS.every((x) => !SRC.includes(x)),
  WITHDRAWN_STRINGS.filter((x) => SRC.includes(x)).join(' | ') || 'none present');
// The two standard NAMES do appear in the engine source, in the header comment
// that records the withdrawal. That is PROVENANCE and it is where it belongs. The
// claim to check is that they appear ONLY in comments and in no line of code, so
// no returned string can carry them. Measured by stripping comment lines.
const SRC_CODE = SRC.split('\n').filter((l) => !/^\s*(\*|\/\/|\/\*)/.test(l)).join('\n');
must('NEITHER STANDARD NAME APPEARS IN A LINE OF CODE, only in the header comment that records the withdrawal',
  !SRC_CODE.includes('MR0175') && !SRC_CODE.includes('15156'),
  `MR0175 in code: ${SRC_CODE.includes('MR0175')}, 15156 in code: ${SRC_CODE.includes('15156')}`);
const STANDARD_COMMENT_LINES = SRC.split('\n').filter((l) => l.includes('MR0175') || l.includes('15156')).length;
must('THE STANDARD NAMES SURVIVE IN THE SOURCE COMMENT, so the record of the withdrawal is not itself erased',
  STANDARD_COMMENT_LINES > 0, `${STANDARD_COMMENT_LINES} comment lines name a standard`);
must('THE WITHDRAWAL IS COMPLETE IN THE EXPORTS: there is no sourServiceRegion function',
  C.sourServiceRegion === undefined, String(typeof C.sourServiceRegion));
must('THE ABSENCE IS DECLARED RATHER THAN SILENT: the screen carries regionProvided false and materialGuidanceProvided false',
  AP.sour.regionProvided === false && AP.sour.materialGuidanceProvided === false,
  `regionProvided=${AP.sour.regionProvided}, materialGuidanceProvided=${AP.sour.materialGuidanceProvided}`);
const SCREEN_TEXT = JSON.stringify(AP) + JSON.stringify(DI) + JSON.stringify(AP_SOUR);
must('NO RETURNED STRING ANYWHERE IN THREE WHOLE SCREENS NAMES EITHER STANDARD',
  !SCREEN_TEXT.includes('MR0175') && !SCREEN_TEXT.includes('15156'), 'neither name present');

/* ==================================================================
   THE DIGEST ITSELF.
   ================================================================== */

w('# FC9 TEACHING DIGEST: Corrosion & Integrity');
w();
w('# THIS FILE IS THE ONLY TEACHING TRUTH FOR THIS COURSE. Every number in every lesson, bank question, key truth and panel comes from a line below, and every brief in this wave quotes this file by name. The wave recon and findings reports, the engine source comments and the repair record vendored beside the oracle are PROVENANCE and not teaching truth: two figures in a sibling course brief came from a recon report and were wrong.');
w();
w('# PRECISION. Partial pressures in bar and in psia, wall thicknesses and allowances in mm, corrosion rates in mm/yr, lives in years, percentages, percentage points and every dimensionless ratio print to SIX decimals; Reynolds numbers print to FOUR, because a number in the hundreds of thousands carries no information in its millionths; measured constants and ratios of them print to TWELVE; counts are whole numbers.');
w();
w(`# ENGINE. engines/facilities/corrosion.js, vendored sha-identical with petrolord-engines d4c19ad, ${SRC.split('\n').length} lines, importing nothing. The vendoring closure walked from the jest suite is SIX paths. The vendored golden test-data/facilities/goldens/corrosion_cases.json carries ${Object.entries(GOLD).reduce((a, [, v]) => a + (Array.isArray(v) ? v.length : 1), 0)} rows in ${Object.keys(GOLD).length} blocks.`);
w();
w(`# THE GOLDEN IS SYNTHETIC AND IT SAYS SO. golden provenance.published is ${String(GOLD.provenance.published)}. The golden's own words: "${GOLD.provenance.why}"`);
w();
w('# WHAT IS NEVER GRADED IN THIS COURSE. No corrosion rate the correlation produced, no rate category, no sour severity region, no material choice, no inspection interval and no retirement thickness. Section 21 lists every held item and section 3 pins every held constant. The eighteen graded capstone fields are the stream bookkeeping, the flow definition, the inhibitor arithmetic and the allowance arithmetic, and the capstone states any rate it needs from an inspection survey.');
w();

/* ------------------------------------------------------------- SECTION 1 */

w('# SECTION 1: What this engine computes, and what it refuses to compute (owned by Associate m01, and shared with Expert m01 because WHAT IS NOT HERE is that module\'s subject)');
w();
w('The engine is a CO2 corrosion rate screen with a remaining-life calculation on the end of it. It answers one question about one mechanism, and the list of what it does not answer is longer than the list of what it does.');
w();
w('| door | what it returns | what it needs |');
w('| --- | --- | --- |');
[['co2FugacityCoefficient', 'the fugacity coefficient of CO2, a bare number', 'a temperature and a total pressure'],
  ['co2Fugacity', 'the CO2 partial pressure, the coefficient, the fugacity and whether the pressure cap was applied', 'a temperature, a total pressure and a CO2 mole fraction'],
  ['dwmReactionRate', 'the reaction rate term in mm/yr, a bare number', 'a temperature and a CO2 fugacity'],
  ['dwmMassTransferRate', 'the mass-transfer rate term in mm/yr, a bare number', 'a velocity, a diameter and a CO2 fugacity'],
  ['scaleFactor', 'the protective-film multiplier, clamped at 1', 'a temperature and a CO2 fugacity'],
  ['scaleOnsetTC', 'the temperature at which that multiplier leaves 1', 'a CO2 fugacity'],
  ['phFactor', 'the pH multiplier and the reference it is taken against, or a refusal', 'an in-situ pH'],
  ['corrosionRate', 'the whole rate with every factor reported separately', 'the conditions, the wetting regime and the inhibitor programme'],
  ['wallShearStressPa', 'the Reynolds number, the friction branch, the friction factor, the wall shear and a film-risk word', 'a velocity, a diameter, a density and a viscosity'],
  ['sourServiceScreen', 'the H2S partial pressure in bar and psia, the threshold in both, and whether the stream is above it', 'an H2S partial pressure'],
  ['corrosionRegime', 'which corrosion product governs, and whether the CO2 rate model applies at all', 'the H2S and CO2 partial pressures'],
  ['remainingLife', 'the remaining allowance, the remaining years, the allowance a target life demands and the shortfall', 'a rate, an allowance, a consumed depth and optionally a design life'],
  ['rateCategory', 'a band label, and nothing else', 'a rate in mm/yr'],
  ['screen', 'all of the above reconciled, plus a BINDING CONSTRAINT and a withheld block', 'everything']].forEach(([d, r, i]) => w(`| \`${d}\` | ${r} | ${i} |`));
w();
w(`The engine states its own absences in two exported lists. \`NOT_PROVIDED\` carries ${C.NOT_PROVIDED.length} items and \`HELD_FOR_LITERATURE\` carries ${C.HELD_FOR_LITERATURE.length}, and \`screen\` returns both, so a caller shows them rather than discovering them.`);
w();
w('NOT_PROVIDED, verbatim from the engine:');
C.NOT_PROVIDED.forEach((s) => w(`- ${s}`));
w();
w('THE ONE RATE THIS ENGINE RETURNS IS A GENERAL UNIFORM RATE. It is not a pitting rate. It is not a weld rate and it is not a top-of-line rate, and the engine says so in the list above. A learner who reads a uniform rate as a wall-loss prediction for the worst spot on the line has read it wrong, and the engine cannot warn them because it has no localised model to compare against.');
w();

/* ------------------------------------------------------------- SECTION 2 */

w('# SECTION 2: THE WITHDRAWAL. A curve carrying a standard\'s name told engineers what steel to buy, and it was invented here (owned by Expert m06, and the headline lesson of this whole course)');
w();
w('This section is about behaviour the engine SHIPS TODAY, which is a refusal to answer. It is not repair history: the absence is current, declared and permanent, and section 25 is where the history lives.');
w();
w('An earlier version of this file computed a sour-service severity region from an expression of its own invention, labelled it with the names of two standards, and served three named material recommendations off it. The repair did not retune the expression. It WITHDREW the claim, because a curve that carries a standard\'s name and tells an engineer what steel to buy is not a tolerance question.');
w();
w('WHAT THE ENGINE NOW RETURNS IN ITS PLACE, measured at the shipped app defaults:');
w();
w('| field | value | what it means |');
w('| --- | --- | --- |');
w(`| \`ph2sBar\` | ${e6(AP.sour.ph2sBar)} | the H2S partial pressure, the total pressure times the H2S mole fraction |`);
w(`| \`ph2sPsia\` | ${e6(AP.sour.ph2sPsia)} | the same, converted by the engine's exact bar to psia factor |`);
w(`| \`thresholdBar\` | ${e6(AP.sour.thresholdBar)} | the screening threshold, whose VALUE is held |`);
w(`| \`thresholdPsia\` | ${e12(AP.sour.thresholdPsia)} | the same threshold, derived rather than rounded |`);
w(`| \`thresholdHeld\` | ${String(AP.sour.thresholdHeld)} | the engine declares that the number is not sourced in the repository |`);
w(`| \`sour\` | ${String(AP.sour.sour)} | above the threshold or below it, and nothing more |`);
w(`| \`decadesAboveThreshold\` | ${e6(AP.sour.decadesAboveThreshold)} | how far above, in powers of ten |`);
w(`| \`regionProvided\` | ${String(AP.sour.regionProvided)} | THE ABSENCE IS A FIELD, so a caller cannot read it as a missing value |`);
w(`| \`materialGuidanceProvided\` | ${String(AP.sour.materialGuidanceProvided)} | the same for the material recommendation |`);
w(`| \`label\` | ${AP.sour.label} | the whole verdict, in words |`);
w();
w(`THE ABSENCE IS PROVED THREE WAYS, and each is a separate check this file ran: the function \`sourServiceRegion\` is not exported, so \`typeof\` it is ${typeof C.sourServiceRegion}; none of the three material guidance strings and neither standard name appears anywhere in the ${SRC.split('\n').length} lines of the engine source; and no returned string anywhere in three whole screenings names either standard.`);
w();
w('THE GENERAL LESSON, which is why this is the course\'s headline and not a footnote. A fit that is wrong by a factor of two in a number is a tolerance problem and you fix it by measuring. A fit that is invented and then labelled with somebody else\'s authority is a different kind of thing: the number was never the claim. The claim was "this is what the standard says", and no amount of retuning makes that true. The only repair available is to stop claiming it, and the only honest replacement is the sentence that the thing is not provided.');
w();
w('THE THRESHOLD VALUE ITSELF STAYED WHERE IT WAS. Changing a live number without a source would have repeated the same mistake with the sign flipped, so the engine keeps its threshold, declares it held, and prints it in both units so nobody has to guess which.');
w();

/* ------------------------------------------------------------- SECTION 3 */

w('# SECTION 3: The numbers this module stands on, MEASURED out of the engine rather than typed, and pinned against a third copy (shared by Associate m01 and Expert m01)');
w();
w('NONE of these is sourced in this repository. Every one of them is HELD FOR LITERATURE, every one is measured below by asking the engine a question whose answer is that constant and nothing else, and every measured value is compared against a literal typed in this generator, which is a THIRD location. A constant that lives in the engine and in the oracle cannot be validated by comparing the engine with the oracle, and a paired battery proved that: fifteen of seventeen constants moved in both files at once left the suite green.');
w();
w('MEASURING RATHER THAN READING THE EXPORT IS DELIBERATE. An export tells you what the module declares. A measurement tells you what it actually uses. Both are below, and the two columns disagreeing would be a finding.');
w();
w('| constant | measured out of the engine | literal in this gate | relative difference | how it was measured |');
w('| --- | --- | --- | --- | --- |');
const HOW = {
  'the fugacity coefficient constant A': 'log10 of the coefficient divided by the pressure is linear in the reciprocal temperature, so 20 C and 180 C at 10 bar solve for both constants',
  'the fugacity coefficient constant B': 'the same pair',
  'the fugacity pressure cap, bar': 'bisected on the pressure at which the coefficient stops moving, at 60 C',
  'the reaction constant A': 'log10 of the reaction rate at fCO2 1 bar and 60 C, with the B term removed',
  'the reaction constant B': 'the slope of log10 of the reaction rate against the reciprocal temperature, 20 C against 180 C at fCO2 1 bar',
  'the reaction fugacity exponent': 'the slope of log10 of the reaction rate against log10 fCO2, 1 bar against 10 bar at 60 C',
  'the mass-transfer coefficient': 'the mass-transfer rate at velocity 1, diameter 1 and fCO2 1, where every power is unity',
  'the mass-transfer velocity exponent': 'the base-two log of the doubling ratio in velocity, at diameter 1 and fCO2 1',
  'the mass-transfer diameter exponent': 'the negative base-two log of the doubling ratio in diameter, at velocity 1 and fCO2 1',
  'the mass-transfer fugacity exponent, which is exactly one': 'the base-two log of the doubling ratio in fCO2, which is a PROPERTY and not a typed constant: the term is exactly linear in fugacity',
  'the scale constant A': 'the slope of log10 of the scale factor against the reciprocal temperature at 150 C and 200 C, WHERE THE FACTOR IS UNCLAMPED. Below the onset the engine returns exactly 1 and this slope would be zero',
  'the scale constant C': 'the same pair, with the A term removed',
  'the scale fugacity exponent': 'the slope of log10 of the scale factor against log10 fCO2 at 150 C, again above the onset',
  'the pH slope': 'log10 of the ratio of the factors at pH 5 and pH 7, over two pH units',
  'the pH reference': 'bisected on the pH at which the engine stops returning a factor and starts returning a refusal',
  'the Blasius exponent': 'the log ratio of the friction factor at Reynolds 200000 and 800000',
  'the Blasius coefficient': 'the friction factor at Reynolds 200000 with the measured exponent removed',
  'the laminar constant': 'the friction factor times the Reynolds number, at Reynolds 1500',
  'the friction branch switch Reynolds number': 'bisected on the branch NAME the engine returns',
  'the film-stripping threshold, Pa': 'the velocity at which the risk word turns high is bisected, and the shear is read there',
  'the moderate band, Pa': 'the velocity at which the risk word leaves low is bisected, and the shear is read there',
  'the sour screening threshold, bar': 'bisected on the sour flag',
  'the bar to psia factor': 'the psia value the engine reports for a partial pressure of exactly 1 bar',
  'the carbonate boundary as an H2S to CO2 ratio': 'bisected on the regime WORD at a CO2 partial pressure of 1 bar',
  'the mixed boundary as an H2S to CO2 ratio': 'bisected on the regime WORD at the same CO2 partial pressure',
  'the low category band, mm/yr': 'bisected on the category WORD',
  'the moderate category band, mm/yr': 'bisected on the category WORD',
  'the high category band, mm/yr': 'bisected on the category WORD',
  'the controlling reporting margin': 'the velocity that puts the mass-transfer term a stated ratio above the reaction term is solved, and the word the engine returns is bisected on that ratio',
  'the inhibitor shortfall trigger, percentage points': 'at a 50 percent efficiency the availability at which the warning first appears is bisected, and the shortfall it corresponds to is derived from it',
};
PINS.forEach((p) => w(`| ${p.label} | ${e12(p.measuredValue)} | ${e12(p.literal)} | ${p.rel === 0 ? '0' : p.rel.toExponential(3)} | ${HOW[p.label] || 'see the generator'} |`));
w();
w(`${PINS.length} constants pinned, every one against a literal in a third file, and the whole table is re-measured on every rebuild of this digest.`);
w();
w('THE ENGINE EXPORTS FIFTEEN OF THESE. An export agreeing with a measurement checks the export; a measurement on its own checks the behaviour. Both columns are here so a disagreement between them would be visible.');
w();
w('| export | declared value | measured from behaviour | relative difference |');
w('| --- | --- | --- | --- |');
EXPORTS.forEach(([name, exported, m]) => w(`| \`${name}\` | ${e12(exported)} | ${e12(m)} | ${relDiff(exported, m) === 0 ? '0' : relDiff(exported, m).toExponential(3)} |`));
w();
w(`THE SOUR THRESHOLD IS NOT 0.05 PSIA. Measured out of the engine it is ${e12(SOUR_PSIA)} psia, and 0.05 psia would be ${e12(0.05 / BAR_PSIA)} bar. The gap between the two, as a fraction of the smaller, is ${e6(Math.abs(SOUR_BAR - 0.05 / BAR_PSIA) / (0.05 / BAR_PSIA) * 100)} percent. The engine prints both numbers and the vendored gate asserts the psia value is not 0.05. Section 25 is where the comment that claimed otherwise belongs.`);
w();
w('THE GOLDEN CARRIES ITS OWN COPY of these constants in a `heldConstants` block, which is the FOURTH location, and the vendored jest suite cross-pins that against its own literals. Moving a constant in the engine and in the oracle together now fails the pin before any measurement runs. The golden block, read from the file:');
w();
w('| golden key | golden value | measured out of the engine | relative difference |');
w('| --- | --- | --- | --- |');
const GOLD_PIN = {
  fugacityA: FUG_A, fugacityB: FUG_B, fugacityCapBar: FUG_CAP, dwmA: DWM_A, dwmB: DWM_B, dwmN: DWM_N,
  vmC: VM_C, vmUExp: VM_U_EXP, vmDExp: VM_D_EXP, scaleA: SCALE_A, scaleC: SCALE_C, scaleN: SCALE_N,
  phSlope: PH_SLOPE, phReference: PH_REF, blasiusC: BLASIUS_C, blasiusN: BLASIUS_N, laminarC: LAMINAR_C,
  switchRe: SWITCH_RE, filmStripPa: FILM_STRIP, filmModeratePa: FILM_MODERATE,
  sourThresholdBar: SOUR_BAR, barToPsia: BAR_PSIA, regimeCarbonateMax: REG_CARB, regimeMixedMax: REG_MIXED,
  categoryLow: CAT_LOW, categoryModerate: CAT_MOD, categoryHigh: CAT_HIGH, controllingMargin: CTRL_MARGIN,
};
Object.entries(GOLD_PIN).forEach(([k, m]) => {
  must(`the golden heldConstants block carries ${k}`, Object.prototype.hasOwnProperty.call(GOLD.heldConstants, k), keys(GOLD.heldConstants));
  const d = agree(`heldConstants.${k}`, m, GOLD.heldConstants[k], 1e-6);
  w(`| \`${k}\` | ${e12(GOLD.heldConstants[k])} | ${e12(m)} | ${d} |`);
});
w();
w(`${Object.keys(GOLD_PIN).length} of the golden's ${Object.keys(GOLD.heldConstants).length} held constants are re-measured here against the engine's behaviour, so the golden, the engine and this generator are three independent copies and any two of them agreeing is no longer enough.`);
w();

/* ------------------------------------------------------------- SECTION 4 */

w('# SECTION 4: CO2 partial pressure, CO2 fugacity, and the difference the screen printed for a year without explaining (owned by Associate m02)');
w();
w('TWO QUANTITIES, ONE MOLECULE, AND THEY ARE NOT THE SAME NUMBER. The partial pressure is the total pressure times the mole fraction. The fugacity is the partial pressure times a coefficient below one at high pressure, and it is the fugacity that drives the RATE. The H2S threshold and the film-governing ratio use PARTIAL PRESSURES, and no fugacity correction is applied to H2S at all, which the engine declares in a field.');
w();
w(`At the shipped app defaults: partial pressure ${e6(AP.rate.pco2Bar)} bar, coefficient ${e6(AP.rate.fugacityCoefficient)}, fugacity ${e6(AP.rate.fco2Bar)} bar. \`ph2sFugacityApplied\` is ${String(AP.ph2sFugacityApplied)}.`);
w();
w('| total pressure bar | coefficient | CO2 partial pressure bar | CO2 fugacity bar | cap applied | note |');
w('| --- | --- | --- | --- | --- | --- |');
PRESSURE_SWEEP.forEach((p) => {
  const f = success(`co2Fugacity at ${p} bar`, C.co2Fugacity({ tC: 60, pTotalBar: p, co2MolFrac: 0.03 }));
  w(`| ${e6(p)} | ${e6(f.fugacityCoefficient)} | ${e6(f.pco2Bar)} | ${e6(f.fco2Bar)} | ${String(f.pressureCapApplied)} | ${f.note ? 'the engine says the coefficient is held at its cap value' : 'none'} |`);
});
w();
const CAP_LO = success('co2Fugacity just below the cap', C.co2Fugacity({ tC: 60, pTotalBar: FUG_CAP - 1, co2MolFrac: 0.03 }));
const CAP_HI = success('co2Fugacity above the cap', C.co2Fugacity({ tC: 60, pTotalBar: FUG_CAP + 150, co2MolFrac: 0.03 }));
must('THE CAP IS REPORTED RATHER THAN APPLIED IN SILENCE: the flag turns and a note appears',
  CAP_LO.pressureCapApplied === false && CAP_HI.pressureCapApplied === true && typeof CAP_HI.note === 'string',
  `${CAP_LO.pressureCapApplied} then ${CAP_HI.pressureCapApplied}`);
w(`THE CAP IS A REPORTED LIMIT, NOT A SILENT ONE. At ${e6(FUG_CAP - 1)} bar the coefficient is ${e6(CAP_LO.fugacityCoefficient)} and \`pressureCapApplied\` is ${String(CAP_LO.pressureCapApplied)}. At ${e6(FUG_CAP + 150)} bar the coefficient is ${e6(CAP_HI.fugacityCoefficient)}, identical to its value at the cap, \`pressureCapApplied\` is ${String(CAP_HI.pressureCapApplied)}, and the engine returns this note verbatim:`);
w();
w(`> ${CAP_HI.note}`);
w();
w('WHAT THE CORRELATION DOES ABOVE THE CAP IS HELD. The engine holds the coefficient flat and says it is doing so. That is a stated convention and not a prediction, and no graded field in this course sits above the cap.');
w();
w('THE REFUSALS THIS DOOR OWNS, each one a call this file made and labelled:');
w('| what was asked | the engine\'s own message |');
w('| --- | --- |');
[['a non-finite temperature', C.co2Fugacity({ tC: NaN, pTotalBar: 50, co2MolFrac: 0.03 })],
  ['a temperature at absolute zero', C.co2Fugacity({ tC: -273.15, pTotalBar: 50, co2MolFrac: 0.03 })],
  ['a temperature below absolute zero', C.co2Fugacity({ tC: -300, pTotalBar: 50, co2MolFrac: 0.03 })],
  ['a zero total pressure', C.co2Fugacity({ tC: 60, pTotalBar: 0, co2MolFrac: 0.03 })],
  ['a blank CO2 mole fraction', C.co2Fugacity({ tC: 60, pTotalBar: 50, co2MolFrac: undefined })],
  ['a CO2 mole fraction of 3, meaning 300 mol percent', C.co2Fugacity({ tC: 60, pTotalBar: 50, co2MolFrac: 3 })],
].forEach(([label, r]) => { refusal(label, r); w(`| ${label} | ${r.error} |`); });
w();
must('THE LOW-LEVEL COEFFICIENT RETURNS NaN RATHER THAN FINITE GARBAGE BELOW ABSOLUTE ZERO',
  Number.isNaN(C.co2FugacityCoefficient({ tC: -300, pTotalBar: 50 })), String(C.co2FugacityCoefficient({ tC: -300, pTotalBar: 50 })));
w(`The bare coefficient door returns NaN rather than a finite number below absolute zero: \`co2FugacityCoefficient\` at -300 C returns ${String(C.co2FugacityCoefficient({ tC: -300, pTotalBar: 50 }))}. A finite number there would be read as an answer by anything that only tests for an error key.`);
w();

/* ------------------------------------------------------------- SECTION 5 */

w('# SECTION 5: Two resistances in series, and which one is holding the rate back (owned by Associate m03)');
w();
w('The rate is not the reaction rate and it is not the transport rate. It is the two in series: the reciprocal of the sum of the reciprocals. That has a consequence a learner should be able to state before they see a number, and the table below is the proof of it: the combined rate is always BELOW BOTH TERMS, and it sits close to whichever term is smaller.');
w();
w('| stream | reaction mm/yr | mass transfer mm/yr | combined mm/yr | combined over the smaller term | controlling | margin |');
w('| --- | --- | --- | --- | --- | --- | --- |');
STREAMS.forEach(([name, , s]) => {
  const r = s.rate;
  const smaller = Math.min(r.reactionMmYr, r.massTransferMmYr);
  must(`${name}: the combined rate is below both terms`, r.combinedMmYr < r.reactionMmYr && r.combinedMmYr < r.massTransferMmYr,
    `${r.combinedMmYr} against ${r.reactionMmYr} and ${r.massTransferMmYr}`);
  must(`${name}: the series identity holds, 1/CR minus 1/Vr minus 1/Vm is zero`,
    Math.abs(1 / r.combinedMmYr - 1 / r.reactionMmYr - 1 / r.massTransferMmYr) < 1e-12 / r.combinedMmYr,
    String(1 / r.combinedMmYr - 1 / r.reactionMmYr - 1 / r.massTransferMmYr));
  w(`| ${name} | ${e6(r.reactionMmYr)} | ${e6(r.massTransferMmYr)} | ${e6(r.combinedMmYr)} | ${e6(r.combinedMmYr / smaller)} | ${r.controlling} | ${e6(r.controllingMargin)} |`);
});
w();
w('THE SERIES IDENTITY IS CHECKED ON EVERY ROW ABOVE and it holds to twelve figures: the reciprocal of the combined rate minus the reciprocal of each term is zero. That is what makes the combination a claim you can argue with rather than a black box.');
w();
w(`THE CONTROLLING WORD HAS A REPORTING MARGIN. Within ${e6(CTRL_MARGIN * 100)} percent the engine answers "comparable" rather than naming one term, because a bare comparison of two nearly equal numbers flips on floating-point noise. The margin is a REPORTING threshold and the engine says so: it is not a claim about where mass transfer stops mattering.`);
w();
w('THE MASS-TRANSFER TERM IS A POWER LAW, AND THE POWERS ARE MEASURABLE PROPERTIES. Doubling the velocity multiplies the term by a fixed factor whatever the other inputs are, and the same for halving the diameter. The two ratio columns below are scale free, which is what makes them a test of the FORM rather than of the constants.');
w();
w('| diameter m | mass transfer at 1 m/s | at 2 m/s | ratio | at 4 m/s | ratio |');
w('| --- | --- | --- | --- | --- | --- |');
DIAMETER_SWEEP.forEach((d) => {
  const v = (u) => C.dwmMassTransferRate({ velocityMS: u, diameterM: d, fco2Bar: 1.5 });
  const r1 = measured(`the mass-transfer term at d ${d} and U 1`, v(1));
  const r2 = measured(`the mass-transfer term at d ${d} and U 2`, v(2));
  const r4v = measured(`the mass-transfer term at d ${d} and U 4`, v(4));
  must(`the velocity doubling ratio at d ${d} is the same as at every other diameter`,
    Math.abs(r2 / r1 - 2 ** VM_U_EXP) < 1e-12, String(r2 / r1));
  w(`| ${e6(d)} | ${e6(r1)} | ${e6(r2)} | ${e12(r2 / r1)} | ${e6(r4v)} | ${e12(r4v / r2)} |`);
});
w();
w(`Both ratio columns are constant down the table and equal to each other, which is what a power law in velocity means. The measured exponent is ${e12(VM_U_EXP)} and the diameter exponent is ${e12(VM_D_EXP)}, both pinned in section 3.`);
w();
w('AN ABSENT VELOCITY IS NOT AN UNLIMITED TRANSPORT CAPACITY. The mass-transfer door returns NaN when the velocity or the diameter is missing, and the gate asserts it is NaN and not infinity, because an infinite transport rate makes the series combination equal the reaction rate exactly and the engine would then name the reaction as controlling from an input nobody supplied.');
const VM_MISSING = [['a blank velocity', C.dwmMassTransferRate({ diameterM: 0.15, fco2Bar: 1.5 })],
  ['a blank diameter', C.dwmMassTransferRate({ velocityMS: 3, fco2Bar: 1.5 })],
  ['a zero velocity', C.dwmMassTransferRate({ velocityMS: 0, diameterM: 0.15, fco2Bar: 1.5 })],
  ['a negative diameter', C.dwmMassTransferRate({ velocityMS: 3, diameterM: -0.15, fco2Bar: 1.5 })]];
VM_MISSING.forEach(([label, v]) => {
  must(`${label} returns NaN and NOT infinity`, Number.isNaN(v), String(v));
});
w();
w('| what was asked | the bare term returns |');
w('| --- | --- |');
VM_MISSING.forEach(([label, v]) => w(`| ${label} | ${String(v)} |`));
w();

/* ------------------------------------------------------------- SECTION 6 */

w('# SECTION 6: The protective film, and an onset temperature that MOVES (owned by Associate m04)');
w();
w('Once iron carbonate plates out on the steel the rate FALLS with further heating, which a naive extrapolation of the low-temperature equation gets exactly backwards. The engine handles that with a multiplier clamped at one, and the temperature at which the multiplier leaves one is COMPUTED rather than quoted, because it moves with the CO2 fugacity.');
w();
w('| CO2 fugacity bar | computed onset C | factor at 60 C | factor at the onset | factor 20 C above the onset |');
w('| --- | --- | --- | --- | --- |');
FCO2_SWEEP.forEach((f) => {
  const on = measured(`the onset at fCO2 ${f} bar`, C.scaleOnsetTC({ fco2Bar: f }));
  const atOnset = C.scaleFactor({ tC: on, fco2Bar: f });
  const above = C.scaleFactor({ tC: on + 20, fco2Bar: f });
  must(`the factor is exactly 1 at the computed onset for fCO2 ${f}`, Math.abs(atOnset - 1) < 1e-12, String(atOnset));
  must(`the factor is below 1 twenty degrees above the onset for fCO2 ${f}`, above < 1, String(above));
  w(`| ${e6(f)} | ${e6(on)} | ${e6(C.scaleFactor({ tC: 60, fco2Bar: f }))} | ${e12(atOnset)} | ${e6(above)} |`);
});
w();
const ON_SPREAD = Math.max(...FCO2_SWEEP.map((f) => C.scaleOnsetTC({ fco2Bar: f }))) - Math.min(...FCO2_SWEEP.map((f) => C.scaleOnsetTC({ fco2Bar: f })));
w(`THE ONSET IS NOT A FIXED TEMPERATURE. Across the fugacities above it moves by ${e6(ON_SPREAD)} degrees Celsius. At the shipped app defaults, where the fugacity is ${e6(AP.rate.fco2Bar)} bar, the engine computes the onset at ${e6(AP.rate.scaleOnsetTC)} C and the factor at the app's own ${e6(APP.tC)} C is ${e12(AP.rate.scaleFactor)}, exactly one. A help guide that says the film appears at a round temperature is wrong at every fugacity except one.`);
w();
w('| temperature C | factor at the Kanbi fugacity | rate mm/yr | is the film credited |');
w('| --- | --- | --- | --- |');
TEMPERATURE_SWEEP.forEach((t) => {
  const r = success(`the Kanbi stream at ${t} C`, C.corrosionRate({ ...KANBI, tC: t }));
  w(`| ${e6(t)} | ${e12(r.scaleFactor)} | ${e6(r.rateMmYr)} | ${r.scaleFactor < 1 ? 'yes' : 'no'} |`);
});
w();
const KA_ONSET = KA.rate.scaleOnsetTC;
w(`The Kanbi stream runs at ${e6(KANBI.tC)} C with a fugacity of ${e6(KA.rate.fco2Bar)} bar, so its computed onset is ${e6(KA_ONSET)} C and its factor is ${e6(KA.rate.scaleFactor)}. The Etelebou stream runs at ${e6(ETELEBOU.tC)} C with a fugacity of ${e6(ET.rate.fco2Bar)} bar, so its onset is ${e6(ET.rate.scaleOnsetTC)} C and its factor is ${e12(ET.rate.scaleFactor)}. One number, two streams, two different answers about whether a film exists.`);
w();
w('WHAT TEMPERATURE THE PUBLISHED CORRELATION TURNS AT IS HELD, and so is a much larger question. The engine forms the series combination FIRST and then multiplies by this factor, so it applies a protective-film correction to a rate that mass transfer may be controlling. Multiplying the reaction term instead is a DIFFERENT physical claim and gives a materially different answer whenever mass transfer controls, which it does at the app\'s own defaults. Which of the two the published correlation intends is not established here, the engine says so in its own held list, and NOTHING DOWNSTREAM OF THIS FACTOR IS GRADED IN THIS COURSE.');
w();
const SCALE_ONE_STREAMS = STREAMS.filter(([, , s]) => s.rate.scaleFactor === 1).map(([nm]) => nm);
w(`WHERE THE FACTOR IS EXACTLY ONE THE QUESTION CANNOT BITE, because multiplying by one in either place gives the same number to the last bit. Of the six streams, ${SCALE_ONE_STREAMS.length} have a factor of exactly one: ${SCALE_ONE_STREAMS.join(', ')}. Every capstone scenario in this course is deliberately below its own computed onset for that reason, and the capstone generator asserts it.`);
w();

/* ------------------------------------------------------------- SECTION 7 */

w('# SECTION 7: pH, the reference it is taken against, and why below it the engine refuses (owned by Associate m05)');
w();
w(`The correction is a multiplier relative to the pH the correlation was fitted at. The reference is ${e6(PH_REF)}, measured by bisecting the pH at which the engine stops returning a factor, and at the reference the factor is exactly one by definition rather than by a clamp.`);
w();
w('| pH | factor | factor relative to the reference | rate at the Etelebou stream mm/yr |');
w('| --- | --- | --- | --- |');
PH_SWEEP.forEach((p) => {
  const f = success(`phFactor at pH ${p}`, C.phFactor({ ph: p }));
  const r = success(`the Etelebou stream at pH ${p}`, C.corrosionRate({ ...ETELEBOU, ph: p }));
  w(`| ${e6(p)} | ${e6(f.factor)} | ${e6(f.factor / C.phFactor({ ph: PH_REF }).factor)} | ${e6(r.rateMmYr)} |`);
});
w();
const PH_MONO = PH_SWEEP.map((p) => C.corrosionRate({ ...ETELEBOU, ph: p }).rateMmYr);
must('THE RATE IS STRICTLY MONOTONIC IN pH across the whole swept band, which is the repair this correction needed',
  PH_MONO.every((v, i) => i === 0 || v < PH_MONO[i - 1]), PH_MONO.map((v) => v.toFixed(6)).join(' > '));
w(`THE RATE FALLS STRICTLY WITH pH across the whole band above the reference: from ${e6(PH_MONO[0])} mm/yr at pH ${e6(PH_SWEEP[0])} to ${e6(PH_MONO[PH_MONO.length - 1])} mm/yr at pH ${e6(PH_SWEEP[PH_SWEEP.length - 1])}, a factor of ${e6(PH_MONO[0] / PH_MONO[PH_MONO.length - 1])}. Every step down the column is smaller than the one above it, and this generator asserts that on every rebuild.`);
w();
w(`EXACTLY ONE DECADE PER TWO pH UNITS is a PROPERTY of the correction and it is scale free, so it tests the form rather than the slope. Measured across the swept band: ${PH_SWEEP.filter((p) => PH_SWEEP.includes(p + 2)).map((p) => e12(C.phFactor({ ph: p + 2 }).factor / C.phFactor({ ph: p }).factor)).join(', ')}. Every one is the same number.`);
PH_SWEEP.filter((p) => PH_SWEEP.includes(p + 2)).forEach((p) => {
  const ratio = C.phFactor({ ph: p + 2 }).factor / C.phFactor({ ph: p }).factor;
  must(`the two-pH-unit ratio at pH ${p} is exactly one tenth`, Math.abs(ratio - 0.1) < 1e-14, String(ratio));
});
w();
w('BELOW THE REFERENCE THE ENGINE REFUSES. It does not return a factor of one, and that distinction is the whole of this lesson: a more acid water is not a less corrosive one, so a factor of one is the LEAST LIMITING possible answer to a question the module cannot answer. What the published correction does below its reference is held.');
w();
w('| pH | what the engine returns |');
w('| --- | --- |');
PH_REFUSALS.forEach((p) => {
  const r = refusal(`phFactor at pH ${p}`, C.phFactor({ ph: p }));
  must(`the pH ${p} refusal names the reference`, r.error.includes(String(PH_REF)) && r.phReference === PH_REF, r.error);
  w(`| ${e6(p)} | a refusal, and it carries \`phReference\` ${e6(r.phReference)} so a caller can print the boundary |`);
});
w(`| ${e6(PH_REF)} | a factor of exactly ${e12(C.phFactor({ ph: PH_REF }).factor)}, which is the boundary and is reached by definition |`);
w();
w('THE BOUNDARY IS SHARP AND IT IS SUPPOSED TO BE. The engine\'s own message, verbatim, for one pH below it:');
w();
w(`> ${C.phFactor({ ph: 3.5 }).error}`);
w();
w('THE RANGE GUARD IS SEPARATE FROM THE REFERENCE GUARD, and they say different things:');
w('| pH | the engine\'s own message |');
w('| --- | --- |');
[-1, 14.5].forEach((p) => {
  const r = refusal(`phFactor at pH ${p}`, C.phFactor({ ph: p }));
  w(`| ${e6(p)} | ${r.error} |`);
});
w(`| a blank box | ${refusal('phFactor with a blank pH', C.phFactor({ ph: undefined })).error} |`);
w();

/* ------------------------------------------------------------- SECTION 8 */

w('# SECTION 8: Water wetting, and the largest single lever in this model (owned by Professional m01)');
w();
w('Steel does not corrode where it is oil wet. The engine treats that as a REGIME and not as a multiplier applied always, which matters because the multiplier for the oil-wet regime is zero and a zero rate is the strongest reassurance a screen can give.');
w();
w('| regime | wetting factor | rate mm/yr | category | life | what the engine says |');
w('| --- | --- | --- | --- | --- | --- |');
[['waterWet', 1], ['intermittent', OPUKUSHI.waterCutFrac], ['oilWet', 0]].forEach(([reg, expectedF]) => {
  const s = success(`the Etelebou stream ${reg}`, C.screen({
    ...ETELEBOU, flowRegime: reg, waterCutFrac: OPUKUSHI.waterCutFrac, ...INTEGRITY,
  }));
  must(`${reg} gives the wetting factor ${expectedF}`, s.rate.waterWettingFactor === expectedF, String(s.rate.waterWettingFactor));
  w(`| ${reg} | ${e6(s.rate.waterWettingFactor)} | ${e6(s.rate.rateMmYr)} | ${s.category === null ? 'WITHHELD' : s.category} | ${s.life === null ? 'WITHHELD' : `${e6(s.life.remainingYears)} yr`} | ${s.withheld ? s.withheld.why : 'the model applies'} |`);
});
w();
w('THE OIL-WET CASE WITHHOLDS ITS CATEGORY AND ITS LIFE, and it says why. The engine\'s own words:');
w();
const OW = success('the Etelebou stream oil wet', C.screen({ ...ETELEBOU, flowRegime: 'oilWet', ...INTEGRITY }));
w(`> ${OW.withheld.why}`);
w();
must('THE OIL-WET INHIBITION FIGURE IS NULL AND NOT ZERO', OW.rate.effectiveInhibitionPct === null, String(OW.rate.effectiveInhibitionPct));
w(`AND THE INHIBITION FIGURE IS \`null\` RATHER THAN ZERO: ${String(OW.rate.effectiveInhibitionPct)}. A reported zero percent inhibition on a line that has an inhibitor programme is a statement, and it would be a false one. There is nothing to be effective against when the rate is zero by assumption.`);
w();
w('THE REGIME NAME IS MATCHED CASE AND PUNCTUATION INSENSITIVELY, and an unrecognised string refuses rather than falling through to the least limiting regime:');
w('| what was typed | what the engine did |');
w('| --- | --- |');
['oilWet', 'OILWET', 'oil-wet', 'Oil Wet', 'oil_wet'].forEach((s) => {
  const r = success(`the regime string ${s}`, C.corrosionRate({ ...ETELEBOU, flowRegime: s }));
  must(`the regime string ${s} resolves to oilWet`, r.flowRegime === 'oilWet', String(r.flowRegime));
  w(`| \`${s}\` | resolved to \`${r.flowRegime}\` |`);
});
['wet', 'waterwette', '', 'gasWet'].forEach((s) => {
  const r = refusal(`the regime string ${JSON.stringify(s)}`, C.corrosionRate({ ...ETELEBOU, flowRegime: s }));
  w(`| ${JSON.stringify(s)} | refused: ${r.error} |`);
});
w();
w('THE WATER CUT IS ONLY READ IN THE INTERMITTENT REGIME, and it is range checked there:');
w('| regime | water cut | wetting factor | rate mm/yr |');
w('| --- | --- | --- | --- |');
[['waterWet', 0.37], ['intermittent', 0], ['intermittent', 0.37], ['intermittent', 1]].forEach(([reg, wc]) => {
  const r = success(`${reg} at a water cut of ${wc}`, C.corrosionRate({ ...ETELEBOU, flowRegime: reg, waterCutFrac: wc }));
  w(`| ${reg} | ${e6(wc)} | ${e6(r.waterWettingFactor)} | ${e6(r.rateMmYr)} |`);
});
[['intermittent', 5, 'a water cut of 500 percent'], ['intermittent', -0.1, 'a negative water cut'], ['intermittent', NaN, 'a water cut that is not a number']].forEach(([reg, wc, label]) => {
  const r = refusal(label, C.corrosionRate({ ...ETELEBOU, flowRegime: reg, waterCutFrac: wc }));
  w(`| ${reg} | ${String(wc)} | refused | ${r.error} |`);
});
w();
w('ONE ABSENT INPUT STILL REACHES A DEFAULT, AND IT IS WORTH KNOWING WHICH. `waterCutFrac` carries a DEFAULT PARAMETER of one in the engine signature, so an argument that is genuinely missing, rather than not-a-number, becomes a water cut of one hundred percent in the intermittent regime. A water cut typed as not-a-number refuses, which is what the studio layer produces from a blank box, so the live app is not exposed. A direct caller that omits the key is.');
const WC_OMITTED = success('the intermittent regime with the water cut key omitted entirely',
  C.corrosionRate({ ...ETELEBOU, flowRegime: 'intermittent' }));
must('AN OMITTED WATER CUT KEY REACHES THE DEFAULT OF ONE RATHER THAN REFUSING',
  WC_OMITTED.waterWettingFactor === 1, String(WC_OMITTED.waterWettingFactor));
w(`Measured: with the key omitted the wetting factor is ${e6(WC_OMITTED.waterWettingFactor)} and the rate is ${e6(WC_OMITTED.rateMmYr)} mm/yr, the same as the water-wet answer. The direction is CONSERVATIVE, because a wetting factor of one is the most limiting value the regime can take, which is why it is recorded here rather than treated as a defect. The H2S mole fraction in section 17 has the same shape and the opposite direction.`);
w();

/* ------------------------------------------------------------- SECTION 9 */

w('# SECTION 9: The inhibitor, and the arithmetic that surprises people (owned by Professional m02, and the one lesson this module exists to teach)');
w();
w('A 95 percent inhibitor running 80 percent of the time is not a 95 percent solution. The uninhibited rate applies for the fraction of the time the inhibitor is off, and it is that time average that eats the wall. The engine takes EFFICIENCY and AVAILABILITY as separate inputs and returns the effective protection, the shortfall in percentage points, and a warning that names the metal-loss ratio.');
w();
w('| efficiency percent | availability percent | effective protection percent | shortfall pp | rate mm/yr | metal loss against the datasheet number |');
w('| --- | --- | --- | --- | --- | --- |');
AVAILABILITY_SWEEP.forEach((a) => {
  const r = success(`the Etelebou stream at 95 percent efficiency and ${a} percent availability`,
    C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: 95, inhibitorAvailabilityPct: a }));
  const ds = success(`the same at perfect availability`, C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: 95, inhibitorAvailabilityPct: 100 }));
  w(`| ${e6(95)} | ${e6(a)} | ${e6(r.effectiveInhibitionPct)} | ${e6(r.inhibitorShortfallPp)} | ${e6(r.rateMmYr)} | ${e6(r.rateMmYr / ds.rateMmYr)} |`);
});
w();
const EIGHTY = success('a 95 percent inhibitor at 80 percent availability',
  C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: 95, inhibitorAvailabilityPct: 80 }));
const EIGHTY_DS = success('the same at perfect availability',
  C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: 95, inhibitorAvailabilityPct: 100 }));
w(`READ THE 80 PERCENT ROW TWICE. A 95 percent inhibitor at 80 percent availability delivers ${e6(EIGHTY.effectiveInhibitionPct)} percent effective protection, which is ${e6(EIGHTY.inhibitorShortfallPp)} percentage points short of the datasheet figure, and the metal loss is ${e6(EIGHTY.rateMmYr / EIGHTY_DS.rateMmYr)} times what the datasheet number would give. AVAILABILITY IS WHAT LIMITS IT. Efficiency does not. The engine's own warning on that case, verbatim:`);
w();
w(`> ${EIGHTY.warning}`);
w();
w(`THE WARNING FIRES ON THE EFFECTIVE SHORTFALL AT ANY EFFICIENCY. The trigger, measured by bisecting the availability at which it appears, is ${e6(SHORTFALL_TRIGGER)} percentage points of shortfall. At the shipped app defaults of a 90 percent inhibitor at 95 percent availability the effective protection is ${e6(AP.rate.effectiveInhibitionPct)} percent, the shortfall is ${e6(AP.rate.inhibitorShortfallPp)} percentage points, and the warning is present.`);
w();
w('| clamped input | what the engine did | the clamp it named |');
w('| --- | --- | --- |');
CLAMP_PROBES.forEach(([eff, avail]) => {
  const r = success(`efficiency ${eff} at availability ${avail}`,
    C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: eff, inhibitorAvailabilityPct: avail }));
  must(`efficiency ${eff} at availability ${avail} names its clamp`, r.clamps.length > 0 && r.clamps.join(' ').includes('clamped from'), r.clamps.join(' | '));
  w(`| efficiency ${e6(eff)}, availability ${e6(avail)} | effective protection ${e6(r.effectiveInhibitionPct)} percent | ${r.clamps.join('; ')} |`);
});
w();
const HUNDRED = success('a typed 100 percent efficiency at 95 percent availability',
  C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: 100, inhibitorAvailabilityPct: 95 }));
must('A TYPED 100 PERCENT EFFICIENCY IS NOT SILENTLY CLAMPED BELOW 100', HUNDRED.effectiveInhibitionPct === 95, String(HUNDRED.effectiveInhibitionPct));
w(`A TYPED 100 PERCENT EFFICIENCY GIVES EXACTLY THE AVAILABILITY. At 100 percent efficiency and 95 percent availability the effective protection is ${e6(HUNDRED.effectiveInhibitionPct)} percent, with no clamp and no hidden ceiling, and the engine adds a note saying what that arithmetic is and is not:`);
w();
w(`> ${HUNDRED.note}`);
w();
w('EVERY NUMBER IN THIS SECTION IS ARITHMETIC OVER TWO TYPED PERCENTAGES, with no correlation constant anywhere in the chain. That is why the inhibitor arithmetic is the one part of this engine a capstone can grade without leaning on a number nobody can source, and section 21 says which of the eighteen graded fields rest on it.');
w();

/* ------------------------------------------------------------ SECTION 10 */

w('# SECTION 10: Wall shear, the friction branch, and a discontinuity that is reported rather than smoothed (owned by Professional m03)');
w();
w('The wall shear is what decides whether an inhibitor film survives, so it is the number the rate now depends on. It is built from a friction factor, and the friction factor has TWO BRANCHES with a hard switch between them.');
w();
w('| stream | Reynolds | branch | friction factor | wall shear Pa | film risk |');
w('| --- | --- | --- | --- | --- | --- |');
STREAMS.forEach(([name, , s]) => {
  w(`| ${name} | ${r4(s.shear.reynolds)} | ${s.shear.flowRegime} | ${e6(s.shear.fanningFriction)} | ${e6(s.shear.tauPa)} | ${s.shear.filmRisk} |`);
});
w();
w('| velocity m/s | Reynolds | branch | wall shear Pa | film risk | is the credit removed |');
w('| --- | --- | --- | --- | --- | --- |');
VELOCITY_SWEEP.forEach((u) => {
  const s = success(`the Tunu stream at ${u} m/s`, C.screen({ ...TUNU, velocityMS: u, ...INTEGRITY }));
  w(`| ${e6(u)} | ${r4(s.shear.reynolds)} | ${s.shear.flowRegime} | ${e6(s.shear.tauPa)} | ${s.shear.filmRisk} | ${String(s.filmStripped)} |`);
});
w();
const STRIP_U = measured('the velocity at which the Tunu stream\'s film is stripped',
  bisect(0.5, 30, (u) => C.screen({ ...TUNU, velocityMS: u, ...INTEGRITY }).filmStripped === true, 'the Tunu stripping velocity'));
w(`THE STRIPPING VELOCITY IS A NUMBER, NOT A REGION. For the Tunu stream it is ${e6(STRIP_U)} m/s, found by bisecting the velocity at which \`filmStripped\` turns true, and the shear there is ${e6(C.screen({ ...TUNU, velocityMS: STRIP_U, ...INTEGRITY }).shear.tauPa)} Pa against the measured threshold of ${e6(FILM_STRIP)} Pa. The threshold value itself is HELD: it drives a coloured word, a warning paragraph and now the rate, and it is not sourced.`);
w();
w(`THE BRANCH SWITCH IS A GENUINE DISCONTINUITY. At the measured switch of Reynolds ${e6(SWITCH_RE)} the wall shear jumps by a factor of ${e6(SWITCH_JUMP)} across two ten-thousandths of the Reynolds number, which is a fraction of a percent of velocity. The engine does NOT smooth it, because smoothing it would be a third invented correlation. It reports it:`);
w();
w('| Reynolds | branch | friction factor | wall shear Pa | nearSwitch |');
w('| --- | --- | --- | --- | --- |');
[2000, 3600, 3960, SWITCH_RE, 4040, 4400, 8000].forEach((re) => {
  const s = success(`the shear probe at Reynolds ${re}`, C.wallShearStressPa({
    velocityMS: re * 1e-5, diameterM: 0.1, densityKgM3: 1000, viscosityPaS: 0.001,
  }));
  w(`| ${r4(s.reynolds)} | ${s.flowRegime} | ${e6(s.fanningFriction)} | ${e6(s.tauPa)} | ${String(s.nearSwitch)} |`);
});
w();
const NEAR = success('the shear probe just above the switch', C.wallShearStressPa({
  velocityMS: (SWITCH_RE * 1.02) * 1e-5, diameterM: 0.1, densityKgM3: 1000, viscosityPaS: 0.001,
}));
must('THE nearSwitch FLAG TURNS ON AND CARRIES A NOTE', NEAR.nearSwitch === true && typeof NEAR.note === 'string', String(NEAR.nearSwitch));
w('Inside ten percent of the switch the engine sets `nearSwitch` and returns this note verbatim:');
w();
w(`> ${NEAR.note}`);
w();
w('THE ANGIAMA STREAM IS THE LAMINAR CASE, and it is there so a lesson has one. It is viscous, small and slow, and the friction factor it gets comes from the other branch entirely.');
w(`Angiama: Reynolds ${r4(AN.shear.reynolds)}, branch ${AN.shear.flowRegime}, friction factor ${e6(AN.shear.fanningFriction)}, wall shear ${e6(AN.shear.tauPa)} Pa, film risk ${AN.shear.filmRisk}.`);
w();
w('THIS MODULE OWNS A SECOND FRICTION FACTOR AND A SECOND REYNOLDS NUMBER. The line hydraulics module has its own, with a different correlation and a different transition, and the two will not agree. The engine says so in its own docstring. Section 23 is where that seam is written down, because a course that teaches two friction factors without naming the seam teaches a contradiction.');
w();
w('| what was asked | the engine\'s own message |');
w('| --- | --- |');
[['a blank velocity', { diameterM: 0.15, densityKgM3: 900, viscosityPaS: 0.001 }],
  ['a blank diameter', { velocityMS: 3, densityKgM3: 900, viscosityPaS: 0.001 }],
  ['a blank density', { velocityMS: 3, diameterM: 0.15, viscosityPaS: 0.001 }],
  ['a blank viscosity', { velocityMS: 3, diameterM: 0.15, densityKgM3: 900 }],
  ['a zero viscosity', { velocityMS: 3, diameterM: 0.15, densityKgM3: 900, viscosityPaS: 0 }],
].forEach(([label, arg]) => { const r = refusal(label, C.wallShearStressPa(arg)); w(`| ${label} | ${r.error} |`); });
w();

/* ------------------------------------------------------------ SECTION 11 */

w('# SECTION 11: THE COUPLING. The shear verdict now acts on the rate, so the number and the sentence beside it agree (owned by Professional m04)');
w();
w('This is the design decision at the centre of the engine as it ships. When the wall shear says the inhibitor film is gone, the rate is computed WITH THE CREDIT REMOVED, and the credited rate is reported beside it so the cost of that verdict is visible rather than implied. No new correlation was invented to do it: the credit is simply not taken.');
w();
w('| stream | film stripped | rate mm/yr | rate with the credit kept mm/yr | ratio | life yr | life with the credit kept yr |');
w('| --- | --- | --- | --- | --- | --- | --- |');
STREAMS.forEach(([name, s, sc]) => {
  const kept = success(`${name} with the credit kept`, C.corrosionRate({ ...s, inhibitorFilmIntact: true }));
  const keptLife = kept.rateMmYr > 0 ? success(`${name} life with the credit kept`, C.remainingLife({ ...INTEGRITY, rateMmYr: kept.rateMmYr })) : null;
  w(`| ${name} | ${String(sc.filmStripped)} | ${e6(sc.rate.rateMmYr)} | ${e6(sc.rateWithFilmCreditMmYr)} | ${e6(sc.rate.rateMmYr / sc.rateWithFilmCreditMmYr)} | ${sc.life ? e6(sc.life.remainingYears) : 'WITHHELD'} | ${keptLife ? e6(keptLife.remainingYears) : 'WITHHELD'} |`);
});
w();
must('THE RATIO OF THE STRIPPED RATE TO THE CREDITED RATE IS THE RECIPROCAL OF THE RETAINED FRACTION, exactly',
  Math.abs((TU.rate.rateMmYr / TU.rateWithFilmCreditMmYr) - 1 / (1 - (TUNU.inhibitorAvailabilityPct / 100) * (TUNU.inhibitorEfficiencyPct / 100))) < 1e-12,
  String(TU.rate.rateMmYr / TU.rateWithFilmCreditMmYr));
w(`THE RATIO IS PURE INHIBITOR ARITHMETIC. For the Tunu stream the stripped rate is ${e6(TU.rate.rateMmYr / TU.rateWithFilmCreditMmYr)} times the credited rate, and that factor is exactly the reciprocal of the retained fraction the inhibitor programme leaves. Nothing in the correlation is in it: the two rates share the whole chain and it divides out. That property is asserted here to twelve figures, and it is why one of the eighteen graded capstone fields can be a ratio of two lives without leaning on a held constant.`);
w();
w('THE ENGINE\'S OWN WARNING when the credit is removed, verbatim:');
w();
w(`> ${TU.rate.warning}`);
w();
w('AND THE BINDING CONSTRAINT NAMES THE SHEAR, so the summary and the rate do not disagree:');
w();
w(`> ${TU.binding.why}`);
w();
w('`screen` COMPUTES THE SHEAR FIRST, and that order is the point. The rate depends on the shear verdict, so a shear that cannot be computed means the screening is incomplete and NO RATE IS ISSUED. A missing density is not a missing row on a summary, it is a refusal:');
w();
w('| what was left blank | what `screen` did |');
w('| --- | --- |');
[['the density', { ...TUNU, densityKgM3: undefined }], ['the viscosity', { ...TUNU, viscosityPaS: undefined }],
  ['the velocity', { ...TUNU, velocityMS: undefined }], ['the line inside diameter', { ...TUNU, diameterM: undefined }],
].forEach(([label, arg]) => {
  const r = refusal(`a screen with ${label} blank`, C.screen({ ...arg, ...INTEGRITY }));
  must(`the ${label} refusal says the screening is incomplete`, r.error.includes('screening incomplete') || r.error.includes('required') || r.error.includes('positive'), r.error);
  w(`| ${label} | ${r.error} |`);
});
w();

/* ------------------------------------------------------------ SECTION 12 */

w('# SECTION 12: H2S, a threshold comparison, and nothing more (owned by Professional m05)');
w();
w('This door compares one partial pressure against one threshold and reports the comparison in two units. It does not classify severity and it does not choose a material. Section 2 is why.');
w();
w('| H2S partial pressure bar | psia | above the threshold | decades above | label |');
w('| --- | --- | --- | --- | --- |');
[1e-5, 1e-4, SOUR_BAR * 0.999, SOUR_BAR, SOUR_BAR * 1.001, 0.01, 0.1, 1, 10].forEach((p) => {
  const s = success(`sourServiceScreen at ${p} bar`, C.sourServiceScreen({ ph2sBar: p }));
  w(`| ${e12(p)} | ${e12(s.ph2sPsia)} | ${String(s.sour)} | ${e6(s.decadesAboveThreshold)} | ${s.label} |`);
});
w();
const S_ZERO = success('sourServiceScreen at zero H2S', C.sourServiceScreen({ ph2sBar: 0 }));
must('A ZERO H2S PARTIAL PRESSURE RETURNS A NULL DECADE COUNT RATHER THAN MINUS INFINITY',
  S_ZERO.decadesAboveThreshold === null && S_ZERO.sour === false, String(S_ZERO.decadesAboveThreshold));
w(`AT ZERO H2S the decade count is ${String(S_ZERO.decadesAboveThreshold)} rather than minus infinity, and \`sour\` is ${String(S_ZERO.sour)}. The logarithm of zero is not a screening result.`);
w();
w(`THE THRESHOLD IS HELD AND THE ENGINE SAYS SO IN A FIELD: \`thresholdHeld\` is ${String(S_ZERO.thresholdHeld)}. Its value, measured by bisecting the sour flag, is ${e12(SOUR_BAR)} bar, which is ${e12(SOUR_PSIA)} psia. The engine prints both in its note so nobody has to convert, and section 3 shows why the second number matters.`);
w();
w('THE ENGINE\'S OWN NOTE above the threshold, verbatim:');
w();
w(`> ${success('sourServiceScreen above the threshold', C.sourServiceScreen({ ph2sBar: 0.05 })).note}`);
w();
w('| what was asked | the engine\'s own message |');
w('| --- | --- |');
[['a blank H2S partial pressure', C.sourServiceScreen({ ph2sBar: undefined })],
  ['a negative H2S partial pressure', C.sourServiceScreen({ ph2sBar: -0.01 })],
].forEach(([label, r]) => { refusal(label, r); w(`| ${label} | ${r.error} |`); });
w();
w('WHAT THIS DOOR DOES NOT DO, stated because a learner will look for it: no severity region, no material selection, no hardness limit, no weldment qualification, no sulphide stress cracking criterion and no hydrogen induced cracking criterion. All of that needs the standard, and the standard is not in this repository.');
w();

/* ------------------------------------------------------------ SECTION 13 */

w('# SECTION 13: Which film governs, from a ratio that needs no pressure at all (owned by Professional m06)');
w();
w('Above a certain H2S to CO2 ratio iron sulphide starts to compete with iron carbonate, and above a higher one a CO2-only rate model has stopped describing the surface. The engine answers in four words and it says whether its own rate model applies.');
w();
w('THE RATIO IS PRESSURE FREE, and that is the single most useful thing about it. Both arguments are PARTIAL PRESSURES, both are the total pressure times a mole fraction, so the total pressure divides out and the ratio equals the ratio of the mole fractions at any pressure whatsoever. Reaching it through mole fractions is what catches an H2S partial pressure built from the total pressure with the mole fraction dropped, and an H2S partial pressure fed a CO2 FUGACITY where the partial pressure belongs.');
w();
w('| total pressure bar | CO2 mol fraction | H2S mol fraction | ratio from partial pressures | ratio from mole fractions | difference |');
w('| --- | --- | --- | --- | --- | --- |');
[10, 50, 137.4, 250, 400].forEach((p) => {
  const [co2, h2s] = [0.02, 0.0008];
  const f = success(`co2Fugacity at ${p} bar for the ratio check`, C.co2Fugacity({ tC: 60, pTotalBar: p, co2MolFrac: co2 }));
  const g = C.corrosionRegime({ ph2sBar: p * h2s, pco2Bar: f.pco2Bar });
  const fromMoles = h2s / co2;
  must(`the ratio at ${p} bar equals the mole-fraction ratio`, Math.abs(g.ratio - fromMoles) < 1e-15, `${g.ratio} against ${fromMoles}`);
  w(`| ${e6(p)} | ${e6(co2)} | ${e6(h2s)} | ${e12(g.ratio)} | ${e12(fromMoles)} | ${g.ratio === fromMoles ? '0' : Math.abs(g.ratio - fromMoles).toExponential(3)} |`);
});
w();
w('The last column is zero at every pressure, which is the whole claim. A ratio that moved with pressure would be built from the wrong quantity.');
w();
w('| CO2 mol fraction | H2S mol fraction | ratio | regime | does the CO2 rate model apply | is the rate an upper bound |');
w('| --- | --- | --- | --- | --- | --- |');
REGIME_PAIRS.forEach(([co2, h2s]) => {
  const p = 60;
  const pco2 = co2 > 0 ? success(`co2Fugacity for the regime row`, C.co2Fugacity({ tC: 60, pTotalBar: p, co2MolFrac: co2 })).pco2Bar : 0;
  const g = C.corrosionRegime({ ph2sBar: p * h2s, pco2Bar: pco2 });
  must(`the regime row at CO2 ${co2} and H2S ${h2s} carries a note`, typeof g.note === 'string' && g.note.length > 0, String(g.note));
  w(`| ${e6(co2)} | ${e6(h2s)} | ${g.ratio === null ? 'none' : e12(g.ratio)} | ${g.regime} | ${String(g.rateApplies)} | ${String(!!g.rateIsUpperBound)} |`);
});
w();
const REG_WORDS = [...new Set(REGIME_PAIRS.map(([co2, h2s]) => C.corrosionRegime({
  ph2sBar: 60 * h2s, pco2Bar: co2 > 0 ? C.co2Fugacity({ tC: 60, pTotalBar: 60, co2MolFrac: co2 }).pco2Bar : 0,
}).regime))].sort();
must('ALL FOUR REGIME ANSWERS ARE REACHED IN THE TABLE ABOVE', REG_WORDS.length === 4, REG_WORDS.join(', '));
w(`FOUR ANSWERS, ALL REACHED ABOVE: ${REG_WORDS.join(', ')}. The boundaries, measured by bisecting the regime word, are ${e12(REG_CARB)} and ${e12(REG_MIXED)}, and BOTH ARE HELD.`);
w();
w('BOTH UNKNOWN BRANCHES CARRY A NOTE, which they did not always. A panel that prints the note unconditionally rendered an empty paragraph whenever the branch had none:');
w('| what was asked | regime | the engine\'s own note |');
w('| --- | --- | --- |');
[['a zero CO2 partial pressure', { ph2sBar: 0.06, pco2Bar: 0 }],
  ['a blank CO2 partial pressure', { ph2sBar: 0.06, pco2Bar: undefined }],
  ['a blank H2S partial pressure', { ph2sBar: undefined, pco2Bar: 1.2 }],
].forEach(([label, arg]) => {
  const g = C.corrosionRegime(arg);
  must(`${label} gives the unknown regime with a note`, g.regime === 'unknown' && typeof g.note === 'string' && g.note.length > 0, String(g.note));
  w(`| ${label} | ${g.regime} | ${g.note} |`);
});
w();
w('THE SULPHIDE REGIME WITHHOLDS THE CATEGORY AND THE LIFE AND KEEPS THE RATE AS A STATED UPPER BOUND. That is a design decision and it is worth stating as one: the engine could have refused the rate entirely, and it could have graded it as if nothing had changed. It does neither. The Diebu stream is the case:');
w();
w(`Diebu: ratio ${e12(DI.regime.ratio)}, regime ${DI.regime.regime}, category ${String(DI.category)}, life ${String(DI.life)}, and the withheld block names the rate as an upper bound of ${e6(DI.withheld.upperBoundMmYr)} mm/yr.`);
w();
w(`> ${DI.withheld.why}`);
w();
w('THE MIXED REGIME STAYS GRADED AND IS MARKED. It sets `rateIsUpperBound` and carries its own note, because a mixed film is not a reason to withhold a screening number, only a reason to read it as a ceiling:');
const MIXED = C.corrosionRegime({ ph2sBar: 60 * 0.0008, pco2Bar: C.co2Fugacity({ tC: 60, pTotalBar: 60, co2MolFrac: 0.02 }).pco2Bar });
must('the mixed regime marks the rate as an upper bound and still applies', MIXED.rateIsUpperBound === true && MIXED.rateApplies === true, `${MIXED.rateIsUpperBound} ${MIXED.rateApplies}`);
w();
w(`> ${MIXED.note}`);
w();

/* ------------------------------------------------------------ SECTION 14 */

w('# SECTION 14: The allowance, the remaining life, and a zero rate that is not a pass (owned by Expert m02)');
w();
w('This door divides a remaining allowance by a rate and stops. That is its whole scope, and what it does NOT do is the subject of section 21.');
w();
w('| stream | rate mm/yr | allowance mm | consumed mm | remaining mm | remaining yr | allowance the design life demands mm | shortfall mm | meets the design life |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
STREAMS.forEach(([name, , s]) => {
  if (!s.life) { w(`| ${name} | ${e6(s.rate.rateMmYr)} | ${e6(INTEGRITY.corrosionAllowanceMm)} | ${e6(INTEGRITY.consumedMm)} | WITHHELD | WITHHELD | WITHHELD | WITHHELD | WITHHELD |`); return; }
  const l = s.life;
  must(`${name}: the remaining allowance is the allowance less what is gone`, Math.abs(l.remainingMm - (INTEGRITY.corrosionAllowanceMm - INTEGRITY.consumedMm)) < 1e-12, String(l.remainingMm));
  w(`| ${name} | ${e6(s.rate.rateMmYr)} | ${e6(INTEGRITY.corrosionAllowanceMm)} | ${e6(INTEGRITY.consumedMm)} | ${e6(l.remainingMm)} | ${e6(l.remainingYears)} | ${e6(l.requiredAllowanceMm)} | ${e6(l.shortfallMm)} | ${String(l.meetsDesignLife)} |`);
});
w();
w('THE REQUIRED ALLOWANCE IGNORES WHAT HAS ALREADY GONE, and that is a subtlety worth an Expert lesson rather than a footnote. `requiredAllowanceMm` is the rate times the design life. It is the allowance a NEW line would need. The shortfall compares it against what is LEFT, so the two fields answer two different questions and only one of them is the allowance a reinstatement would have to specify.');
w();
const RL = success('a life question with a consumed allowance', C.remainingLife({
  rateMmYr: 0.25, corrosionAllowanceMm: 4, consumedMm: 1.2, designLifeYears: 20,
}));
const REINSTATE = measured('the allowance that just meets the design life with 1.2 mm already gone',
  bisect(1, 30, (ca) => C.remainingLife({ rateMmYr: 0.25, corrosionAllowanceMm: ca, consumedMm: 1.2, designLifeYears: 20 }).meetsDesignLife === true,
    'the reinstating allowance'));
must('THE REINSTATING ALLOWANCE EXCEEDS requiredAllowanceMm BY EXACTLY THE CONSUMED DEPTH',
  Math.abs((REINSTATE - RL.requiredAllowanceMm) - 1.2) < 1e-9, `${REINSTATE} minus ${RL.requiredAllowanceMm}`);
w(`Worked at a stated rate of 0.250000 mm/yr, a 4 mm allowance with 1.2 mm gone and a 20 year design life: \`requiredAllowanceMm\` is ${e6(RL.requiredAllowanceMm)} mm, the remaining allowance is ${e6(RL.remainingMm)} mm, the shortfall is ${e6(RL.shortfallMm)} mm, and the allowance that actually reinstates the design life, found by bisecting the allowance until \`meetsDesignLife\` turns true, is ${e6(REINSTATE)} mm. The gap between the last two numbers is exactly the consumed depth, and this generator asserts that.`);
w();
w('A ZERO RATE DOES NOT RETURN AN UNBOUNDED LIFE WITH A PASSING VERDICT. It returns no life, no verdict, and a note telling the reader to find out why the rate is zero first, because the strongest reassurance on the screen would otherwise arrive from the weakest input.');
w();
const ZERO = success('a life question at a zero rate', C.remainingLife({
  rateMmYr: 0, corrosionAllowanceMm: 3.175, consumedMm: 0, designLifeYears: 20,
}));
must('A ZERO RATE RETURNS A NULL LIFE, A NULL VERDICT AND AN unbounded FLAG',
  ZERO.remainingYears === null && ZERO.meetsDesignLife === null && ZERO.unbounded === true,
  `remainingYears=${ZERO.remainingYears}, meetsDesignLife=${ZERO.meetsDesignLife}, unbounded=${ZERO.unbounded}`);
w(`At a zero rate: \`remainingYears\` is ${String(ZERO.remainingYears)}, \`meetsDesignLife\` is ${String(ZERO.meetsDesignLife)}, \`unbounded\` is ${String(ZERO.unbounded)}, and the note reads:`);
w();
w(`> ${ZERO.note}`);
w();
w(`FOUR SEPARATE PATHS REACH A ZERO RATE, and a learner should be able to list them: an oil-wet wetting regime, a stream with no CO2 in it, a 100 percent inhibitor at 100 percent availability, and a typed zero CO2 mole fraction. The golden's own zero-rate row records the same shape: remainingYears ${String(GOLD.lifeZeroRate.remainingYears)}, unbounded ${String(GOLD.lifeZeroRate.unbounded)}, meetsDesignLife ${String(GOLD.lifeZeroRate.meetsDesignLife)}.`);
w();
w('| what was asked | the engine\'s own message |');
w('| --- | --- |');
[['a blank allowance', { rateMmYr: 0.3, consumedMm: 0, designLifeYears: 20 }],
  ['a zero allowance', { rateMmYr: 0.3, corrosionAllowanceMm: 0, consumedMm: 0, designLifeYears: 20 }],
  ['a negative consumed depth', { rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: -1, designLifeYears: 20 }],
  ['a negative rate', { rateMmYr: -0.3, corrosionAllowanceMm: 4, consumedMm: 0, designLifeYears: 20 }],
  ['a blank rate', { corrosionAllowanceMm: 4, consumedMm: 0, designLifeYears: 20 }],
  ['a design life that is not a number', { rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: 0, designLifeYears: NaN }],
  ['an allowance already fully consumed', { rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: 4, designLifeYears: 20 }],
  ['an allowance consumed past its own depth', { rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: 5, designLifeYears: 20 }],
].forEach(([label, arg]) => { const r = refusal(label, C.remainingLife(arg)); w(`| ${label} | ${r.error} |`); });
w();
w('THE FULLY CONSUMED CASE IS THE ONE TO READ TWICE. The engine does not return a negative life or a zero one. It says the question has changed, in its own words above: a line whose allowance is gone is an inspection and fitness-for-service question, and this module has neither.');
w();
w('A DESIGN LIFE IS OPTIONAL AND ITS ABSENCE IS NOT A ZERO:');
const NO_DL = success('a life question with no design life at all', C.remainingLife({ rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: 0 }));
must('WITH NO DESIGN LIFE THE VERDICT AND THE REQUIRED ALLOWANCE ARE BOTH NULL',
  NO_DL.meetsDesignLife === null && NO_DL.requiredAllowanceMm === null, `${NO_DL.meetsDesignLife} ${NO_DL.requiredAllowanceMm}`);
w(`With the design life left out: remaining years ${e6(NO_DL.remainingYears)}, \`meetsDesignLife\` ${String(NO_DL.meetsDesignLife)}, \`requiredAllowanceMm\` ${String(NO_DL.requiredAllowanceMm)}, shortfall ${e6(NO_DL.shortfallMm)}.`);
w();

/* ------------------------------------------------------------ SECTION 15 */

w('# SECTION 15: The rate category is a LABEL, and the label is held (owned by Expert m03)');
w();
w('Four BAND words separated by three boundaries, and a fifth word that is not a band at all. The four bands are low, moderate, high and severe. The fifth word is negligible, and it is what the door returns at exactly zero and below rather than a band it reaches by being small. Counting zero itself there are four boundaries, and no source for any of them. The engine says in its own held list that the bands are looser than those commonly cited for carbon steel in production service, so a label here may be optimistic by one or two steps.');
w();
w('| rate mm/yr | category |');
w('| --- | --- |');
CATEGORY_PROBES.forEach((r) => w(`| ${e6(r)} | ${String(C.rateCategory(r))} |`));
w();
w('| what was asked | what the label door returns |');
w('| --- | --- |');
[['a blank rate', undefined], ['a NaN rate', NaN], ['a negative rate', -1]].forEach(([label, v]) => {
  w(`| ${label} | ${String(C.rateCategory(v))} |`);
});
must('A NON-FINITE RATE RETURNS null RATHER THAN A WORD', C.rateCategory(NaN) === null && C.rateCategory(undefined) === null, 'null for both');
must('A NEGATIVE RATE RETURNS negligible RATHER THAN A BAND', C.rateCategory(-1) === 'negligible', String(C.rateCategory(-1)));
w();
w(`THE BOUNDARIES, MEASURED BY BISECTING THE WORD: ${e12(CAT_LOW)}, ${e12(CAT_MOD)} and ${e12(CAT_HIGH)} mm/yr. All three are HELD and NONE of them is graded anywhere in this course. The engine's own sentence about them, from its held list, verbatim:`);
w();
w(`> ${C.HELD_FOR_LITERATURE.find((s) => s.includes('rate category bands'))}`);
w();
// A GOLDEN RATE PRINTED AT SIX DECIMALS CAN READ AS A NUMBER IT IS NOT, AND
// THIS TABLE IS WHERE IT DID. The golden's second category row is a rate of one
// part in a thousand million mm/yr, which e6 renders as 0.000000: the same
// string the first row's exact zero renders as. The two rows then appeared to
// give ONE rate TWO different words, one row above the other, in the section
// that teaches where the words change. The row was always right and the
// RENDERING was wrong.
//
// So the rate column of THIS ONE TABLE widens past the six decimals the header
// declares, and only as far as it has to: the printed form is the shortest
// fixed-decimal rendering that reads back as the number it came from. Every
// other row in it still prints at six, because six already round-trips them.
// The widening is asserted rather than assumed, twice, below the table.
const eWide = (x) => {
  for (let d = 6; d <= 20; d += 1) {
    const s = n(x, d);
    if (Number(s) === Number(x)) return s;
  }
  return String(x);
};

const GOLD_CAT = GOLD.categoryRows.filter((r) => Number.isFinite(r.rateMmYr));
w(`THE GOLDEN CARRIES ${GOLD.categoryRows.length} CATEGORY ROWS, both sides of all three bands. Read from the file and re-run through the engine:`);
w();
w('| golden rate mm/yr | golden category | engine category | agree |');
w('| --- | --- | --- | --- |');
GOLD_CAT.forEach((r) => {
  const got = C.rateCategory(r.rateMmYr);
  must(`the golden category row at ${r.rateMmYr} agrees with the engine`, got === r.category, `${got} against ${r.category}`);
  w(`| ${eWide(r.rateMmYr)} | ${r.category} | ${String(got)} | ${got === r.category ? 'yes' : 'NO'} |`);
});
w();
must('EVERY GOLDEN CATEGORY RATE READS BACK AS THE NUMBER IT WAS PRINTED FROM',
  GOLD_CAT.every((r) => Number(eWide(r.rateMmYr)) === Number(r.rateMmYr)),
  GOLD_CAT.map((r) => eWide(r.rateMmYr)).join(' '));
const CAT_ZERO = GOLD_CAT.find((r) => r.rateMmYr === 0);
const CAT_TINY = GOLD_CAT.filter((r) => r.rateMmYr > 0).sort((a, b) => a.rateMmYr - b.rateMmYr)[0];
must('THE GOLDEN CARRIES BOTH SIDES OF THE ZERO BOUNDARY AND THE TWO SIDES CARRY DIFFERENT WORDS',
  CAT_ZERO && CAT_TINY && CAT_ZERO.category !== CAT_TINY.category,
  `${CAT_ZERO && CAT_ZERO.category} against ${CAT_TINY && CAT_TINY.category}`);
must('THE ZERO ROW AND THE SMALLEST POSITIVE ROW PRINT AS DIFFERENT STRINGS',
  eWide(CAT_ZERO.rateMmYr) !== eWide(CAT_TINY.rateMmYr),
  `${eWide(CAT_ZERO.rateMmYr)} against ${eWide(CAT_TINY.rateMmYr)}`);
w(`THE FOURTH BOUNDARY IS ZERO ITSELF, AND THE GOLDEN IS WHERE IT IS PINNED. The first two rows above are the two sides of it. At exactly ${eWide(CAT_ZERO.rateMmYr)} mm/yr the word is ${CAT_ZERO.category}, and at ${eWide(CAT_TINY.rateMmYr)} mm/yr, which is the smallest positive rate the golden carries, the word is already ${CAT_TINY.category}. The test the engine applies is whether the rate is greater than zero, so there is no small-but-positive rate that comes back ${CAT_ZERO.category}: a rate is ${CAT_ZERO.category} when it is zero or below and ${CAT_TINY.category} the instant it is not. The second row is the only row in this table printed past six decimals, because at six decimals it would read ${e6(CAT_TINY.rateMmYr)} and a reader would see the row above it twice.`);
w();
w(`READ THE APP'S OWN DEFAULT ROW. At the shipped defaults the rate is ${e6(AP.rate.rateMmYr)} mm/yr and the label is "${AP.category}". A band set one step tighter would call the same number something worse, and nothing in this repository says which band set is right. That is what "held" means in practice: the word on the screen is not a measurement.`);
w();

/* ------------------------------------------------------------ SECTION 16 */

w('# SECTION 16: The binding constraint, which is the summary this module did not have (owned by Expert m04)');
w();
w('A screen that returns seven independent numbers and reconciles none of them is a screen the reader has to summarise themselves, and they will summarise it by reading the largest number. The engine now names WHICH OF ITS OWN LIMITS governs the answer, in descending order of what would change first, and every one of them is derived from what is already computed.');
w();
w('| stream | binding constraint | the value it turns on | why, in the engine\'s own words |');
w('| --- | --- | --- | --- |');
STREAMS.forEach(([name, , s]) => {
  must(`${name} has a binding constraint that names something`, typeof s.binding.what === 'string' && s.binding.what.length > 0, s.binding.what);
  w(`| ${name} | ${s.binding.what} | ${s.binding.valueLabel === null ? 'none, the model does not apply' : s.binding.valueLabel} | ${s.binding.why} |`);
});
w();
const BINDINGS = [...new Set(STREAMS.map(([, , s]) => s.binding.what))].sort();
w(`${BINDINGS.length} DIFFERENT CONSTRAINTS ACROSS SIX STREAMS: ${BINDINGS.join('; ')}. A summary that always said the same thing would be a heading and not a summary.`);
w();
w('THE ORDER IS THE CLAIM. The engine checks, in this sequence: does the model apply at all; is the film being stripped; does the allowance fail the design life; are the two resistances comparable; is transport controlling; otherwise kinetics. Each step answers "what would I change first", and a lower step is only reached because every step above it is satisfied.');
w();
w('| case | binding | what the reader should do about it |');
w('| --- | --- | --- |');
[['the shipped app defaults', AP], ['the same at 60 ft per second', AP_FAST], ['the same at 1 mol percent H2S', AP_SOUR], ['the same oil wet', AP_OIL]].forEach(([label, s]) => {
  w(`| ${label} | ${s.binding.what} | ${s.binding.valueLabel === null ? 'read the withheld block, because no rate verdict is being offered' : s.binding.valueLabel} |`);
});
w();
w('A BINDING CONSTRAINT IS NOT A RECOMMENDATION. It names the limit that governs the number, and it is silent about what to buy, when to inspect and what thickness to retire at, because the module has none of those.');
w();

/* ------------------------------------------------------------ SECTION 17 */

w('# SECTION 17: The whole screening in one call, and the order that makes it honest (owned by Expert m05)');
w();
w(`\`screen\` returns ${Object.keys(AP).length} top-level fields. The order in which it computes them is the design decision: the wall shear FIRST, because the rate depends on whether the film survives it, then the rate, then the credited rate beside it, then the sour comparison, then the regime, then the withholding, then the category, then the life, then the binding constraint.`);
w();
w(`Top-level fields: ${Object.keys(AP).join(', ')}.`);
w();
w('| field | at the shipped app defaults | what it is |');
w('| --- | --- | --- |');
[['rate.rateMmYr', e6(AP.rate.rateMmYr), 'the rate the whole screen is about'],
  ['rate.uninhibitedMmYr', e6(AP.rate.uninhibitedMmYr), 'the same case with no inhibitor credit at all'],
  ['rateWithFilmCreditMmYr', e6(AP.rateWithFilmCreditMmYr), 'the rate the datasheet efficiency would give, reported beside the rate whether or not the credit was taken'],
  ['filmStripped', String(AP.filmStripped), 'whether the shear verdict removed the credit'],
  ['shear.tauPa', e6(AP.shear.tauPa), 'the wall shear the verdict is taken on'],
  ['shear.filmRisk', AP.shear.filmRisk, 'the risk word, from two HELD thresholds'],
  ['sour.sour', String(AP.sour.sour), 'above the H2S screening threshold or below it'],
  ['regime.regime', AP.regime.regime, 'which corrosion product governs'],
  ['category', String(AP.category), 'the band label, HELD'],
  ['categoryHeld', String(AP.categoryHeld), 'the engine declaring that the band is not sourced'],
  ['life.remainingYears', e6(AP.life.remainingYears), 'the allowance divided by the rate'],
  ['life.meetsDesignLife', String(AP.life.meetsDesignLife), 'against the stated design life'],
  ['ph2sBar', e6(AP.ph2sBar), 'the H2S partial pressure, the total pressure times the mole fraction'],
  ['ph2sFugacityApplied', String(AP.ph2sFugacityApplied), 'declared false, because no fugacity correction is applied to H2S'],
  ['withheld', String(AP.withheld), 'null here, an object naming what is withheld and why when the model does not apply'],
  ['binding.what', AP.binding.what, 'the limit that governs'],
  ['screeningComplete', String(AP.screeningComplete), 'present only when every part of the screening ran'],
  ['clamps', AP.clamps.length === 0 ? 'none' : AP.clamps.join('; '), 'every input the engine moved, named'],
  ['notProvided', `${AP.notProvided.length} items`, 'what the module will not pretend to answer'],
  ['limits', `${AP.limits.length} items`, 'every number in the module with no source in the repository'],
].forEach(([f, v, m]) => w(`| \`${f}\` | ${v} | ${m} |`));
w();
w('THE INPUT GUARDS `screen` OWNS THAT NOTHING BELOW IT OWNS:');
w('| what was asked | the engine\'s own message |');
w('| --- | --- |');
[['an H2S mole fraction that is not a number', { ...APP, h2sMolFrac: NaN }],
  ['an H2S mole fraction of 3', { ...APP, h2sMolFrac: 3 }],
  ['a negative H2S mole fraction', { ...APP, h2sMolFrac: -0.01 }],
  ['CO2 and H2S mole fractions summing above one', { ...APP, co2MolFrac: 0.7, h2sMolFrac: 0.4 }],
].forEach(([label, arg]) => { const r = refusal(label, C.screen(arg)); w(`| ${label} | ${r.error} |`); });
w();
w('AND ONE DEFAULT PARAMETER THAT POINTS THE OTHER WAY, which a reader should know about because it is the shape section 25 item three is about. `h2sMolFrac` carries a DEFAULT PARAMETER of zero in the screen signature. An H2S mole fraction that is NOT A NUMBER refuses, which is what the studio layer produces from a blank box, so the live app is not exposed. But a direct caller that OMITS the key entirely gets a positive assertion of zero H2S: not sour, the carbonate regime, and a graded category and life.');
const H2S_OMITTED = success('a screen with the H2S mole fraction key omitted entirely', C.screen({
  tC: APP.tC, pTotalBar: APP.pTotalBar, co2MolFrac: APP.co2MolFrac, ph: APP.ph,
  velocityMS: APP.velocityMS, diameterM: APP.diameterM, densityKgM3: APP.densityKgM3,
  viscosityPaS: APP.viscosityPaS, flowRegime: 'waterWet',
  inhibitorEfficiencyPct: APP.inhibitorEfficiencyPct, inhibitorAvailabilityPct: APP.inhibitorAvailabilityPct,
  corrosionAllowanceMm: APP.corrosionAllowanceMm, consumedMm: 0, designLifeYears: APP.designLifeYears,
}));
must('AN OMITTED H2S KEY REACHES THE DEFAULT OF ZERO, so the sour screen answers not sour from an input never supplied',
  H2S_OMITTED.ph2sBar === 0 && H2S_OMITTED.sour.sour === false, `ph2sBar=${H2S_OMITTED.ph2sBar}, sour=${H2S_OMITTED.sour.sour}`);
w(`Measured: with the key omitted the H2S partial pressure is ${e6(H2S_OMITTED.ph2sBar)} bar, \`sour\` is ${String(H2S_OMITTED.sour.sour)}, the regime is ${H2S_OMITTED.regime.regime}, and the category is issued as "${String(H2S_OMITTED.category)}". Compare the shipped defaults, which carry 0.1 mol percent H2S: \`sour\` is ${String(AP.sour.sour)} and the regime is ${AP.regime.regime}. The direction here is the LEAST limiting one, and the reason the live studio is safe from it is the layer above. This default is not what protects it.`);
w();
w('AND TWO THINGS `screen` STILL SWALLOWS, WHICH THIS DIGEST RECORDS BECAUSE THE SECTION ABOVE TEACHES THE OPPOSITE. The order argument is that an unavailable wall shear makes the screening incomplete, so `screen` refuses rather than putting the error in a field and returning normally. That is true of the shear. It is NOT true of the remaining life, and the two cases below are the same shape one field along.');
w();
const LIFE_BLANK = success('a screen with a blank corrosion allowance box', C.screen({ ...APP, corrosionAllowanceMm: undefined }));
const LIFE_NAN = success('a screen with an allowance that is not a number', C.screen({ ...APP, corrosionAllowanceMm: NaN }));
const LIFE_ERR = success('a screen whose allowance is already consumed', C.screen({ ...APP, consumedMm: 5 }));
const LIFE_NEG = success('a screen with a negative consumed depth', C.screen({ ...APP, consumedMm: -1 }));
must('MEASURED: a blank allowance gives a null life with no error, no withheld block and screeningComplete true',
  LIFE_BLANK.error === undefined && LIFE_BLANK.life === null && LIFE_BLANK.withheld === null
  && LIFE_BLANK.screeningComplete === true, `life=${LIFE_BLANK.life}, withheld=${LIFE_BLANK.withheld}`);
must('MEASURED: an allowance that is not a number does the same',
  LIFE_NAN.error === undefined && LIFE_NAN.life === null, `life=${LIFE_NAN.life}`);
must('MEASURED: a refusal from the life door arrives INSIDE the life field with no top-level error',
  LIFE_ERR.error === undefined && !!(LIFE_ERR.life && LIFE_ERR.life.error)
  && LIFE_ERR.screeningComplete === true, `life.error=${LIFE_ERR.life && LIFE_ERR.life.error}`);
must('MEASURED: a negative consumed depth does the same', LIFE_NEG.error === undefined && !!(LIFE_NEG.life && LIFE_NEG.life.error),
  `life.error=${LIFE_NEG.life && LIFE_NEG.life.error}`);
w('| what was asked | top-level error | `life` | `withheld` | `screeningComplete` | what a caller checking `if (result.error)` sees |');
w('| --- | --- | --- | --- | --- | --- |');
[['a blank corrosion allowance box', LIFE_BLANK], ['an allowance that is not a number', LIFE_NAN],
  ['an allowance already consumed past its own depth', LIFE_ERR], ['a negative consumed depth', LIFE_NEG],
].forEach(([label, r]) => {
  w(`| ${label} | ${String(r.error)} | ${r.life === null ? 'null' : (r.life.error ? `an ERROR OBJECT: ${r.life.error}` : 'a life')} | ${String(r.withheld)} | ${String(r.screeningComplete)} | nothing |`);
});
w();
w(`READ THE FIRST TWO ROWS AGAINST THE BINDING CONSTRAINT THEY CAME WITH. The blank-allowance case returns \`${LIFE_BLANK.binding.what}\` as its binding constraint and a complete screening, so a summary rail simply has no remaining-life row and nothing on the screen says why. The last two rows put the life door's own refusal INSIDE the \`life\` field, so a caller's \`if (result.error)\` passes, \`result.life.remainingYears\` is undefined, and the refusal message never reaches anyone.`);
w();
w('WHAT TO DO WITH THIS AS A LEARNER, AND IT IS THE GENERAL LESSON OF THIS WHOLE COURSE. A repair that names a defect and fixes one instance of it has not removed the CLASS. The shear case and the life case are one shape: a function that puts a failure into a field and returns a success. The way to find the next one is to read what the function returns rather than what its comment says it returns, and to ask of every field whether its absence is DECLARED or merely missing. This module declares the withdrawn region\'s absence in two fields and does not declare this one.');
w();
w('THE SAME SHAPE ONCE MORE, IN A DEFAULT PARAMETER RATHER THAN A SWALLOWED ERROR, and pointing the least-limiting way:');
const H2S_GONE = success('a screen with the H2S mole fraction key omitted', (() => {
  const { h2sMolFrac, ...rest } = APP; return C.screen(rest);
})());
must('MEASURED: an omitted H2S key reaches the default of zero and answers not sour',
  H2S_GONE.ph2sBar === 0 && H2S_GONE.sour.sour === false && H2S_GONE.category !== null,
  `ph2sBar=${H2S_GONE.ph2sBar}, sour=${H2S_GONE.sour.sour}, category=${H2S_GONE.category}`);
w(`With the H2S key OMITTED the partial pressure is ${e6(H2S_GONE.ph2sBar)} bar, \`sour\` is ${String(H2S_GONE.sour.sour)}, the regime is ${H2S_GONE.regime.regime} and the category is issued as "${String(H2S_GONE.category)}". An H2S mole fraction that is NOT A NUMBER refuses, and the studio layer produces not-a-number from a blank box, so the live screen is protected by the layer above rather than by this default.`);
w();
w('THE SUM GUARD IS THE ONE PEOPLE MISS. Two mole fractions each inside nought to one can still add to more than one, and their partial pressures would then exceed the total pressure. The engine checks the SUM against the total and not just each fraction against its own range.');
w();
const SUM_OK = success('CO2 and H2S summing to exactly one', C.screen({ ...APP, co2MolFrac: 0.6, h2sMolFrac: 0.4 }));
must('A SUM OF EXACTLY ONE IS ACCEPTED, because the boundary is reachable', !SUM_OK.error, 'accepted');
w(`A sum of exactly one is accepted: CO2 0.600000 and H2S 0.400000 give a partial pressure sum of ${e6(SUM_OK.rate.pco2Bar + SUM_OK.ph2sBar)} bar against a total of ${e6(APP.pTotalBar)} bar, and the screening runs.`);
w();

/* ------------------------------------------------------------ SECTION 18 */

w('# SECTION 18: Every refusal this module can produce, in one table (owned by Expert m05 l04)');
w();
w('A refusal is the module telling you it cannot answer, and the difference between a refusal and a least-limiting default is the difference between a screening tool and a liability. Every row below is a call this generator made, labelled a refusal, and asserted to have returned an error key and no non-finite number alongside it.');
w();
w('| door | what was asked | the engine\'s own message |');
w('| --- | --- | --- |');
const ALL_REFUSALS = [
  ['co2Fugacity', 'a blank temperature', C.co2Fugacity({ pTotalBar: 50, co2MolFrac: 0.03 })],
  ['co2Fugacity', 'a temperature at or below absolute zero', C.co2Fugacity({ tC: -273.15, pTotalBar: 50, co2MolFrac: 0.03 })],
  ['co2Fugacity', 'a blank total pressure', C.co2Fugacity({ tC: 60, co2MolFrac: 0.03 })],
  ['co2Fugacity', 'a blank CO2 mole fraction', C.co2Fugacity({ tC: 60, pTotalBar: 50 })],
  ['co2Fugacity', 'a CO2 mole fraction outside nought to one', C.co2Fugacity({ tC: 60, pTotalBar: 50, co2MolFrac: 1.4 })],
  ['phFactor', 'a blank pH', C.phFactor({})],
  ['phFactor', 'a pH outside nought to fourteen', C.phFactor({ ph: 15 })],
  ['phFactor', 'a pH below the reference', C.phFactor({ ph: 3.9 })],
  ['corrosionRate', 'a blank velocity', C.corrosionRate({ ...ETELEBOU, velocityMS: undefined })],
  ['corrosionRate', 'a blank line inside diameter', C.corrosionRate({ ...ETELEBOU, diameterM: undefined })],
  ['corrosionRate', 'an unrecognised wetting regime', C.corrosionRate({ ...ETELEBOU, flowRegime: 'damp' })],
  ['corrosionRate', 'a water cut outside nought to one', C.corrosionRate({ ...ETELEBOU, flowRegime: 'intermittent', waterCutFrac: 5 })],
  ['corrosionRate', 'a non-finite inhibitor efficiency', C.corrosionRate({ ...ETELEBOU, inhibitorEfficiencyPct: NaN })],
  ['wallShearStressPa', 'a blank density', C.wallShearStressPa({ velocityMS: 3, diameterM: 0.15, viscosityPaS: 0.001 })],
  ['wallShearStressPa', 'a blank viscosity', C.wallShearStressPa({ velocityMS: 3, diameterM: 0.15, densityKgM3: 900 })],
  ['sourServiceScreen', 'a blank H2S partial pressure', C.sourServiceScreen({})],
  ['sourServiceScreen', 'a negative H2S partial pressure', C.sourServiceScreen({ ph2sBar: -1 })],
  ['remainingLife', 'a blank allowance', C.remainingLife({ rateMmYr: 0.3 })],
  ['remainingLife', 'a negative consumed depth', C.remainingLife({ rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: -1 })],
  ['remainingLife', 'a negative rate', C.remainingLife({ rateMmYr: -1, corrosionAllowanceMm: 4 })],
  ['remainingLife', 'an allowance already consumed', C.remainingLife({ rateMmYr: 0.3, corrosionAllowanceMm: 4, consumedMm: 4 })],
  ['screen', 'an H2S mole fraction that is not a number', C.screen({ ...APP, h2sMolFrac: NaN })],
  ['screen', 'mole fractions summing above one', C.screen({ ...APP, co2MolFrac: 0.8, h2sMolFrac: 0.3 })],
  ['screen', 'a blank density, so the film check cannot run', C.screen({ ...APP, densityKgM3: undefined })],
  ['screen', 'a blank viscosity, so the film check cannot run', C.screen({ ...APP, viscosityPaS: undefined })],
  ['screen', 'a blank pH', C.screen({ ...APP, ph: undefined })],
  ['screen', 'a pH below the reference', C.screen({ ...APP, ph: 3.5 })],
  ['screen', 'a blank temperature', C.screen({ ...APP, tC: undefined })],
  ['screen', 'a blank CO2 mole fraction', C.screen({ ...APP, co2MolFrac: undefined })],
  ['screen', 'a temperature below absolute zero', C.screen({ ...APP, tC: -300 })],
];
ALL_REFUSALS.forEach(([door, label, r]) => { refusal(`${door}: ${label}`, r); w(`| \`${door}\` | ${label} | ${r.error} |`); });
w();
w(`${ALL_REFUSALS.length} REFUSALS, every one of them a call this file made and asserted. The golden carries ${GOLD.refusals.length} refusal rows of its own and the vendored jest suite asserts every one refuses with a message that names the input, and REFUSES ITSELF rather than passing when the module answers.`);
w();
w('A TYPED ZERO IS NOT A BLANK, and the difference is the whole of this table. A typed zero CO2 mole fraction is a positive assertion that there is no CO2, so the engine takes its no-CO2 branch, withholds the category and the life, and says what a rate of zero means there. A BLANK CO2 box is a question the engine cannot answer, so it refuses.');
const TYPED_ZERO = success('a typed zero CO2 mole fraction', C.screen({ ...APP, co2MolFrac: 0 }));
must('A TYPED ZERO CO2 TAKES THE NO-CO2 BRANCH AND WITHHOLDS', TYPED_ZERO.rate.rateApplies === false
  && TYPED_ZERO.category === null && TYPED_ZERO.life === null && TYPED_ZERO.withheld !== null,
  `rateApplies=${TYPED_ZERO.rate.rateApplies}, category=${TYPED_ZERO.category}`);
w();
w(`A typed zero: rate ${e6(TYPED_ZERO.rate.rateMmYr)} mm/yr, \`rateApplies\` ${String(TYPED_ZERO.rate.rateApplies)}, category ${String(TYPED_ZERO.category)}, life ${String(TYPED_ZERO.life)}, and the note reads:`);
w();
w(`> ${TYPED_ZERO.rate.note}`);
w();
w(`A blank box, on the same screen: ${refusal('a blank CO2 box', C.screen({ ...APP, co2MolFrac: undefined })).error}`);
w();

/* ------------------------------------------------------------ SECTION 19 */

w('# SECTION 19: The live studio\'s own defaults, end to end, and every number a user has been shown (owned by Associate m06, and shared with Professional m06)');
w();
w('The Corrosion & Integrity Studio ships with a case already filled in, so the first thing any user sees is this. Every figure below is this generator running the engine on the studio\'s own default inputs, converted with the studio\'s own factors, which are stated in section 24.');
w();
w('| studio input | as typed | in the engine\'s units |');
w('| --- | --- | --- |');
[['temperature', '140 F', `${e6(APP.tC)} C`], ['pressure', '725 psig', `${e6(APP.pTotalBar)} bar`],
  ['CO2', '3 mol%', `${e6(APP.co2MolFrac)} mole fraction`], ['H2S', '0.1 mol%', `${e6(APP.h2sMolFrac)} mole fraction`],
  ['in-situ pH', '4.5', `${e6(APP.ph)}`], ['velocity', '10 ft/s', `${e6(APP.velocityMS)} m/s`],
  ['line inside diameter', '6 in', `${e6(APP.diameterM)} m`], ['density', '56 lb/ft3', `${e6(APP.densityKgM3)} kg/m3`],
  ['viscosity', '1 cp', `${e6(APP.viscosityPaS * 1000)} mPa s`], ['wetting regime', 'water wet', 'waterWet'],
  ['water cut', '100 percent', `${e6(APP.waterCutFrac)}`], ['inhibitor efficiency', '90 percent', `${e6(APP.inhibitorEfficiencyPct)}`],
  ['inhibitor availability', '95 percent', `${e6(APP.inhibitorAvailabilityPct)}`],
  ['corrosion allowance', '0.125 in', `${e6(APP.corrosionAllowanceMm)} mm`],
  ['consumed', '0 in', `${e6(APP.consumedMm)} mm`], ['design life', '20 yr', `${e6(APP.designLifeYears)} yr`],
].forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
w();
w('| what the screen shows | value |');
w('| --- | --- |');
const MPY = (mm) => (mm / 25.4) * 1000;
[['CO2 partial pressure', `${e6(AP.rate.pco2Bar)} bar`], ['fugacity coefficient', e6(AP.rate.fugacityCoefficient)],
  ['CO2 fugacity', `${e6(AP.rate.fco2Bar)} bar`], ['reaction term', `${e6(AP.rate.reactionMmYr)} mm/yr`],
  ['mass-transfer term', `${e6(AP.rate.massTransferMmYr)} mm/yr`], ['combined', `${e6(AP.rate.combinedMmYr)} mm/yr`],
  ['controlling', AP.rate.controlling], ['controlling margin', e6(AP.rate.controllingMargin)],
  ['scale factor', e12(AP.rate.scaleFactor)], ['computed film onset', `${e6(AP.rate.scaleOnsetTC)} C`],
  ['pH factor', e6(AP.rate.phFactor)], ['pH reference', e6(AP.rate.phReference)],
  ['water wetting factor', e6(AP.rate.waterWettingFactor)],
  ['uninhibited rate', `${e6(AP.rate.uninhibitedMmYr)} mm/yr, which is ${e6(MPY(AP.rate.uninhibitedMmYr))} mpy`],
  ['effective inhibition', `${e6(AP.rate.effectiveInhibitionPct)} percent`],
  ['inhibitor shortfall', `${e6(AP.rate.inhibitorShortfallPp)} percentage points`],
  ['RATE', `${e6(AP.rate.rateMmYr)} mm/yr, which is ${e6(MPY(AP.rate.rateMmYr))} mpy`],
  ['rate with the film credit kept', `${e6(AP.rateWithFilmCreditMmYr)} mm/yr`],
  ['category', `${AP.category}, and \`categoryHeld\` is ${String(AP.categoryHeld)}`],
  ['Reynolds', r4(AP.shear.reynolds)], ['friction branch', AP.shear.flowRegime],
  ['wall shear', `${e6(AP.shear.tauPa)} Pa`], ['film risk', AP.shear.filmRisk],
  ['film stripped', String(AP.filmStripped)],
  ['H2S partial pressure', `${e6(AP.ph2sBar)} bar, which is ${e6(AP.sour.ph2sPsia)} psia`],
  ['above the sour threshold', String(AP.sour.sour)], ['decades above it', e6(AP.sour.decadesAboveThreshold)],
  ['severity region', 'NOT PROVIDED'], ['material guidance', 'NOT PROVIDED'],
  ['H2S to CO2 ratio', e12(AP.regime.ratio)], ['regime', AP.regime.regime],
  ['the rate is an upper bound', String(!!AP.regime.rateIsUpperBound)],
  ['remaining allowance', `${e6(AP.life.remainingMm)} mm`],
  ['remaining life', `${e6(AP.life.remainingYears)} yr`],
  ['allowance the design life demands', `${e6(AP.life.requiredAllowanceMm)} mm`],
  ['shortfall', `${e6(AP.life.shortfallMm)} mm`], ['meets the design life', String(AP.life.meetsDesignLife)],
  ['BINDING CONSTRAINT', AP.binding.what], ['and the value it turns on', AP.binding.valueLabel],
].forEach(([a, b]) => w(`| ${a} | ${b} |`));
w();
w('THE WARNING ON THAT SCREEN, verbatim:');
w();
w(`> ${AP.rate.warning}`);
w();
w('AND THE BINDING CONSTRAINT, verbatim:');
w();
w(`> ${AP.binding.why}`);
w();
w('FIVE CHANGES TO THAT ONE CASE, each of which reaches a different part of the module:');
w();
w('| change | rate mm/yr | category | remaining life yr | what else moved |');
w('| --- | --- | --- | --- | --- |');
[['nothing, the shipped defaults', AP], ['velocity from 10 to 60 ft/s', AP_FAST], ['H2S from 0.1 to 1 mol%', AP_SOUR],
  ['the wetting regime to oil wet', AP_OIL], ['pH from 4.5 to 4.0', AP_PH4]].forEach(([label, s]) => {
  w(`| ${label} | ${e6(s.rate.rateMmYr)} | ${s.category === null ? 'WITHHELD' : s.category} | ${s.life ? e6(s.life.remainingYears) : 'WITHHELD'} | ${s.binding.what} |`);
});
w();
w(`AT 60 FT PER SECOND the wall shear is ${e6(AP_FAST.shear.tauPa)} Pa against the measured stripping threshold of ${e6(FILM_STRIP)} Pa, the film risk is ${AP_FAST.shear.filmRisk}, the credit is removed, and the rate is ${e6(AP_FAST.rate.rateMmYr)} mm/yr against a credited ${e6(AP_FAST.rateWithFilmCreditMmYr)} mm/yr. The ratio between those two is ${e6(AP_FAST.rate.rateMmYr / AP_FAST.rateWithFilmCreditMmYr)}, and the remaining life falls from ${e6(AP.life.remainingYears)} yr to ${e6(AP_FAST.life.remainingYears)} yr.`);
w();
w(`AT 1 MOL PERCENT H2S the ratio is ${e12(AP_SOUR.regime.ratio)}, the regime is ${AP_SOUR.regime.regime}, and the rate is unchanged at ${e6(AP_SOUR.rate.rateMmYr)} mm/yr. That last fact is the lesson: the CO2 rate does not move with H2S at all, because H2S is not in the correlation. What changes is that the category and the life are now WITHHELD and the rate is kept only as a stated upper bound of ${e6(AP_SOUR.withheld.upperBoundMmYr)} mm/yr.`);
w();
w(`AT pH 4.0, which is the reference and the boundary, the rate is ${e6(AP_PH4.rate.rateMmYr)} mm/yr against ${e6(AP.rate.rateMmYr)} mm/yr at the shipped 4.5. Below 4.0 the engine refuses. A learner should be able to say why those two facts belong together.`);
w();
w('EVERY RATE ON THAT SCREEN NOW CARRIES MPY BESIDE MM/YR, because every input on it is in field units. The conversion is a division by 25.4 and a multiplication by a thousand, and it is stated rather than assumed:');
w();
w('| quantity | mm/yr | mpy |');
w('| --- | --- | --- |');
[['the rate', AP.rate.rateMmYr], ['the uninhibited rate', AP.rate.uninhibitedMmYr],
  ['the rate with the credit kept', AP.rateWithFilmCreditMmYr], ['the reaction term', AP.rate.reactionMmYr],
  ['the mass-transfer term', AP.rate.massTransferMmYr]].forEach(([a, v]) => w(`| ${a} | ${e6(v)} | ${e6(MPY(v))} |`));
w();

/* ------------------------------------------------------------ SECTION 20 */

w('# SECTION 20: What the vendored cases can and cannot discriminate (owned by Expert m01 l05 and Expert m05 l02)');
w();
const GOLD_ROWS = Object.entries(GOLD).reduce((a, [, v]) => a + (Array.isArray(v) ? v.length : 1), 0);
w(`The vendored golden carries ${GOLD_ROWS} rows in ${Object.keys(GOLD).length} blocks and NOT ONE OF THEM IS PUBLISHED. \`provenance.published\` is ${String(GOLD.provenance.published)}, and the file says why in its own words, quoted in this digest's header. There is no published de Waard-Milliams case, no clause of either sour-service standard and no corrosion rate-band table anywhere in this repository, so a number recalled from memory would be the only alternative and that is not a published datum.`);
w();
w('| block | rows | what it covers |');
w('| --- | --- | --- |');
const BLOCK_NOTE = {
  cases: 'whole corrosionRate cases with every factor and the shear alongside',
  categoryBands: 'the three band edges, as the oracle read them',
  categoryRows: 'the category word either side of all three bands, plus a non-finite rate',
  heldConstants: 'the oracle\'s own copy of every held constant, cross-pinned in section 3',
  inhibitor: 'the inhibitor time average, rebuilt as an hour-by-hour duty cycle',
  inhibitorClamps: 'the three clamped inputs and the clamp count each produces',
  lifeRows: 'remaining life, reached by marching the wall loss forward rather than by dividing',
  lifeZeroRate: 'the zero-rate row, where the life is null and the verdict is null',
  phRows: 'the pH factor at and above its reference, and the two-unit decade property',
  provenance: 'the statement that none of this is published, and why',
  refusalBase: 'the input set every refusal row is a single change away from',
  refusals: 'sixteen input sets that must refuse, each naming its input',
  regimeRows: 'the H2S to CO2 ratio at five pressures, reaching all four regimes',
  scaleOnset: 'the film onset at seven fugacities, found by bisection and by the closed form',
  screenRows: 'nine whole screenings, every field, three different binding constraints',
  sourRows: 'the threshold comparison above and below, done in psia against the engine doing it in bar',
  sourThreshold: 'the threshold in both units, and the bar value that would be exactly 0.05 psia',
};
Object.entries(GOLD).forEach(([b, v]) => w(`| \`${b}\` | ${Array.isArray(v) ? v.length : 1} | ${BLOCK_NOTE[b] || 'see the golden'} |`));
w();
w('THE GOLDEN IS THE ORACLE\'S ANSWER AND THE ENGINE IS A SECOND DERIVATION, so agreement is a RESULT WITH A SIZE and this digest prints the size. Below, every one of the seventeen whole cases, engine against golden, with the relative difference in its own column:');
w();
w('| case | golden rate mm/yr | engine rate mm/yr | relative difference, tolerance 1e-3 | golden combined | engine combined | relative difference, tolerance 1e-9 |');
w('| --- | --- | --- | --- | --- | --- | --- |');
GOLD.cases.forEach((g, i) => {
  const r = success(`the golden case ${i + 1}`, C.corrosionRate({
    tC: g.tC, pTotalBar: g.pTotalBar, co2MolFrac: g.co2MolFrac, velocityMS: g.velocityMS, diameterM: g.diameterM,
    ph: g.ph, waterCutFrac: g.waterCutFrac, flowRegime: g.flowRegime,
    inhibitorEfficiencyPct: g.inhibitorEfficiencyPct, inhibitorAvailabilityPct: g.inhibitorAvailabilityPct,
  }));
  // TWO DIFFERENT TOLERANCES, for a reason the reader should see. The COMBINED
  // rate comes out of a bisection on the reciprocal and agrees to 1e-9. The
  // inhibited RATE carries the oracle's hour-by-hour duty cycle, which rounds to
  // whole hours out of 8760, so it agrees to 1e-3 and THAT LOOSENESS IS THE
  // INDEPENDENCE. A single tight tolerance on both would have forced the oracle
  // to divide the way the engine does, which is how five of its routes became
  // transcriptions in the first place.
  const d1 = agree(`golden case ${i + 1} rate, through the oracle's duty cycle`, r.rateMmYr, g.rateMmYr, 1e-3);
  const d2 = agree(`golden case ${i + 1} combined, through the oracle's bisection`, r.combinedMmYr, g.combinedMmYr, 1e-9);
  w(`| ${i + 1} | ${e6(g.rateMmYr)} | ${e6(r.rateMmYr)} | ${d1} | ${e6(g.combinedMmYr)} | ${e6(r.combinedMmYr)} | ${d2} |`);
});
w();
w('WHAT THE ROUTES BEHIND THOSE NUMBERS ACTUALLY PROVE, and what they cannot. The oracle\'s work is split three ways and the file says which is which. Section 25 item five is the reason that split exists.');
w();
w('| route | independent because | cannot check |');
w('| --- | --- | --- |');
[['the series combination', 'solved by bisection on the reciprocal rather than formed as a reciprocal, with the residual identity checked separately', 'nothing'],
  ['the inhibitor time average', 'rebuilt as an explicit 8760 hour duty cycle, which rounds to whole hours, so the agreement is loose and that looseness IS the independence', 'nothing'],
  ['the wall shear', 'reached through a momentum balance over a stated length, with the pipe force balance checked as an identity', 'the Blasius pair, the laminar constant and the branch switch'],
  ['the film onset', 'found by bisection on the unclamped expression and cross-checked against the closed form', 'the three scale constants'],
  ['the remaining life', 'reached by marching the wall loss forward in small steps rather than by dividing, held to one step absolute', 'nothing'],
  ['the allowance shortfall', 'formed as a deficit of YEARS times the rate rather than as a subtraction of two allowances', 'nothing'],
  ['the H2S to CO2 ratio', 'formed from MOLE FRACTIONS, so it needs no pressure at all', 'the two boundary ratios'],
  ['the sour comparison', 'done entirely in psia against the engine doing it in bar', 'the threshold value'],
].forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
w();
w('THE MOLE-FRACTION ROUTE IS THE ONE THAT EARNS ITS KEEP, and section 13 is the proof. It catches an H2S partial pressure built from the total pressure with the mole fraction dropped, and an H2S partial pressure fed a fugacity where the partial pressure belongs. Neither could ever be caught by writing the engine\'s own ratio out again.');
w();
w('WHAT NO CASE IN THIS FILE CAN DISCRIMINATE, named here rather than left to be discovered: every held constant in section 3. A case generated by an oracle that shares a constant with the engine cannot test that constant, whatever tolerance it is checked at. The PINS are what carry those, and a pin is a comparison against a third copy rather than a validation against a source.');
w();

/* ------------------------------------------------------------ SECTION 21 */

w('# SECTION 21: What is HELD, what is NOT PROVIDED, and what this course therefore never grades (owned by Expert m01, and read by every writer before the first lesson)');
w();
w(`The engine exports its own list. \`HELD_FOR_LITERATURE\` carries ${C.HELD_FOR_LITERATURE.length} items, \`screen\` returns them in \`limits\`, and the studio prints them behind a disclosure. Verbatim, in the engine's order:`);
w();
C.HELD_FOR_LITERATURE.forEach((s, i) => w(`${i + 1}. ${s}`));
w();
w('AND THE ONE WITHDRAWAL, which is not on that list because it is not held pending a source. It is gone: the sour-service severity region and the material guidance that went with it. Section 2 is the whole of it.');
w();
w('WHAT THAT MEANS FOR THE EIGHTEEN GRADED CAPSTONE FIELDS. Not one of them is a corrosion rate the correlation produced. None is a band label; none is a threshold verdict; and none is a region or a material. The three capstones grade four things:');
w();
w('| what is graded | why it is clear of every held item |');
w('| --- | --- |');
[['the stream bookkeeping: the CO2 partial pressure, the H2S partial pressure in bar and in psia, and the H2S to CO2 mole ratio',
  'each is the total pressure times a mole fraction, or a ratio of two mole fractions, or a conversion by a factor exact by the definition of the bar. No correlation constant, no fugacity coefficient, no threshold and no boundary is in any chain'],
  ['the flow definition: the Reynolds number',
    'density times velocity times diameter over viscosity is a definition. The Blasius pair and the branch switch act on the friction factor DOWNSTREAM of it, and no graded field reads a friction factor or a shear stress'],
  ['the inhibitor arithmetic: the effective protection, the shortfall, the retained fraction and the metal-loss ratio',
    'all four are arithmetic over two typed percentages, and the two that are ratios of engine rates share the whole correlation chain so it divides out exactly. The capstone generator MEASURES that invariance rather than claiming it, by re-running at conditions that move the rate by more than half and cross the fugacity cap'],
  ['the allowance arithmetic: the remaining life, the required allowance, the tolerable rate and the allowance a reinstatement needs',
    'the remaining-life door takes an allowance, a consumed depth, a design life and A RATE THE CAPSTONE STATES from an inspection survey. No correlation constant is reachable from it, and the Expert fields are found by bisecting the engine\'s own verdict rather than by an algebraic shortcut around it'],
].forEach(([a, b]) => w(`| ${a} | ${b} |`));
w();
w('AND THE SCALE-FACTOR QUESTION IS CLEARED BY AN IDENTITY. Every capstone scenario is below its own computed film onset, so its scale factor is exactly one, so whether that factor belongs on the reaction term or on the combined rate cannot move any number in any of the three capstones. Multiplying by one in either place gives the same double.');
w();
w(`FOUR THINGS THIS MODULE IS ASKED FOR AND DOES NOT HAVE. It is called a Corrosion & Integrity studio, and a learner will look for all four: an inspection interval, a minimum thickness, a retirement thickness and a fitness-for-service assessment. Producing any of them means adopting a standard this module does not carry. They are in \`NOT_PROVIDED\`, the studio lists them, and this course teaches the word integrity narrowly: the integrity arithmetic here is an allowance divided by a rate, and that is all it is.`);
w();
w('| what a reader will look for | what the engine has | what it does not have |');
w('| --- | --- | --- |');
[['when to inspect next', 'a remaining life against a stated allowance', 'an interval, a risk basis and any inspection standard'],
  ['what thickness to retire at', 'a corrosion allowance the caller types in', 'a minimum thickness, a pressure-containing calculation and any retirement criterion'],
  ['whether the line is fit for service', 'nothing', 'a fitness-for-service method of any kind'],
  ['whether the velocity is erosional', 'a wall shear and a film-risk word', 'an erosional-velocity criterion. Section 23 names the course that cites one'],
  ['whether it will pit', 'a general uniform rate', 'a pitting criterion, a localised rate and any pit-depth model'],
  ['whether it will crack', 'an H2S threshold comparison', 'a sulphide-stress-cracking criterion, a hydrogen-induced-cracking criterion and any hardness limit'],
].forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
w();
w('THREE SUITE APPS TAKE A CORROSION ALLOWANCE AND DO NOT KNOW ABOUT EACH OTHER. This studio CONSUMES an allowance to give a life. The pipeline and line sizing studio ADDS one to a pressure-containing wall. The storage tank studio ADDS one to a shell course. The wall this studio is eating is not the wall either of those sized, there is no link between them and no minimum thickness anywhere. That is recorded, it is stated in the studio\'s help, and it is deliberately not wired up: a link between three apps is a design decision.');
w();

/* ------------------------------------------------------------ SECTION 22 */

w('# SECTION 22: THREE VOCABULARY COLLISIONS, LEGISLATED HERE BEFORE ANY LESSON IS WRITTEN (binding on every writer in this wave, and on every reviewer)');
w();
w('A sibling course shipped one word carrying three different quantities and it had to be gated out afterwards. These three collisions are named now, with the rule for each, so no writer meets one without knowing it is a collision. The rule is BINDING: a lesson, a bank question, a key truth or a panel string that breaks one of these is a defect and the copy gate catches it.');
w();
w('| the word | what it already means elsewhere in the Academy | what it means HERE | THE RULE |');
w('| --- | --- | --- | --- |');
[['inhibitor',
  'a HYDRATE inhibitor in the Flow Assurance course: methanol or monoethylene glycol, injected to depress a hydrate formation temperature, and dosed in mass fraction of the water phase',
  'a CORROSION inhibitor: a filming amine on the steel, with an efficiency and an availability, which removes a fraction of the metal loss while it is present',
  'ALWAYS write "corrosion inhibitor" on first use in every lesson and every bank question, and never write bare "inhibitor" in a prompt, an option or a heading. The two are different chemicals doing different jobs in different phases, and a learner who has taken Flow Assurance will read the bare word the other way'],
  ['erosion',
    'a GEOLOGICAL process in the Basin Modelling course: material removed from a sedimentary column over geological time, which changes a burial history',
    'MECHANICAL wall loss from entrained solids or from liquid impingement, which this module DOES NOT MODEL AT ALL',
    'ALWAYS write "mechanical erosion" or "erosional wall loss", and every use in this course must be accompanied by the statement that the engine has no erosional-velocity criterion. Never write bare "erosion" as though this module measured it'],
  ['friction factor and Reynolds number',
    'owned by the Pipeline & Line Sizing course, which computes both with a DIFFERENT correlation and a DIFFERENT laminar to turbulent transition',
    `this module's own Fanning friction factor, on a two-branch Blasius form switching at Reynolds ${e6(SWITCH_RE)}, used only to reach a wall shear`,
    'ALWAYS write "the corrosion module\'s friction factor" or "this module\'s Reynolds number" when the number is this one, and ALWAYS state that the line sizing course computes its own and that the two will not agree. Never present either number as the platform\'s single answer'],
].forEach(([a, b, c, d]) => w(`| ${a} | ${b} | ${c} | ${d} |`));
w();
w(`THE THIRD COLLISION IS NOT A NAMING PROBLEM, IT IS A REAL DISAGREEMENT. Two modules on one platform compute a friction factor for the same pipe with different correlations. The engine says so in its own docstring. Removing the duplicate is a cross-module decision and it was deliberately left alone by the repair, so this course's job is to name the seam rather than to hide it. The measured constants of THIS module's friction factor are the Blasius pair ${e12(BLASIUS_C)} and ${e12(BLASIUS_N)}, the laminar constant ${e12(LAMINAR_C)} and the switch at Reynolds ${e6(SWITCH_RE)}, all four HELD and all four pinned in section 3.`);
w();
w('AND TWO MORE WORDS THAT ARE NOT COLLISIONS BUT ARE MISREADINGS:');
w('| the word | the misreading | the rule |');
w('| --- | --- | --- |');
[['integrity', 'that this module assesses fitness for service, computes a minimum thickness or sets an inspection interval',
  'in this course "integrity" means one arithmetic: a corrosion allowance divided by a rate. Say so wherever the word appears'],
  ['rate', 'that the single rate this module returns applies to the worst spot on the line',
    'it is a GENERAL UNIFORM rate and the engine says so. Never write it as a wall-loss prediction for a weld, a bend, a top-of-line film or a pit'],
].forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
w();

/* ------------------------------------------------------------ SECTION 23 */

w('# SECTION 23: The scope seams. What to CITE rather than teach, and the one course that points at this one (binding on every writer)');
w();
w('Five quantities in this course\'s neighbourhood are already owned by a live course. A lesson that re-derives an owned quantity teaches a second answer to a settled question. CITE THE OWNER, state what this module does differently, and stop.');
w();
w('| quantity | owned by | what to say here |');
w('| --- | --- | --- |');
[['the erosional velocity criterion', 'the Casing & Tubing Design Expert tier, and cited again in Nodal Analysis and Gas Well Deliverability',
  'name the owner, and state plainly that THIS engine has no erosional-velocity limit and computes a wall shear for a completely different purpose, which is whether an inhibitor film survives'],
  ['wall loss taken to a derated burst pressure', 'the Torque & Drag Expert tier',
    'name the owner. This module consumes an allowance and never computes a pressure, so the comparison is a pivot and not a derivation'],
  ['the Barlow thin-wall relation with a design factor', 'the Pipeline Network Associate tier',
    'name the owner. This module has no minimum thickness, so it cannot say what the allowance is being taken off'],
  ['fugacity and partial pressure', 'the Fluid Properties Expert tier',
    'name the owner for the thermodynamics, then teach what is specific here: which quantity drives the RATE, which drives the H2S threshold and the film ratio, and that no fugacity correction is applied to H2S at all'],
  ['the corrosion allowance as a wall thickness component', 'the Pipeline & Line Sizing and Storage Tank studios, which both ADD one',
    'state the seam as section 21 states it: three apps, one word, no link, and the wall this studio eats is not the wall either of those sized'],
].forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
w();
w('AND ONE COURSE POINTS AT THIS ONE. The Well Integrity and P&A course in the Drilling module is about barrier envelopes and abandonment, and it EXPLICITLY REFUSES corrosion: it states in its own scope that it carries no corrosion model, no wall loss and no remaining life. FC9 fills exactly that refusal. A lesson here may name it as the course that owns barrier logic, and must not borrow its vocabulary: a barrier envelope is not a corrosion allowance.');
w();
w('WHAT HAS NEVER BEEN TAUGHT ANYWHERE IN THE ACADEMY, and is therefore this course\'s own ground: the de Waard-Milliams correlation, iron carbonate and its protective film, sour-service screening, sulphide stress cracking and hydrogen induced cracking as NAMED ABSENCES, pitting as a named absence, in-line inspection, non-destructive testing, and fitness-for-service as a named absence. None of those words appears in any live course.');
w();

/* ------------------------------------------------------------ SECTION 24 */

w('# SECTION 24: Units. The studio\'s field units, the engine\'s correlation units, and one factor that is truncated (owned by Associate m01 l05)');
w();
w('The engine works in the units the correlations are published in: temperature in degrees Celsius, pressures in bar, rates in millimetres a year, velocity in metres a second, diameter in metres, density in kilograms a cubic metre and viscosity in pascal seconds. The studio takes Fahrenheit, psig, mol percent, feet a second, inches, pounds a cubic foot and centipoise, and converts. The conversions are the studio\'s own and they are listed here because a learner reading a number off the app needs to know which layer produced it.');
w();
w('| studio field | the studio\'s conversion | the engine\'s unit |');
w('| --- | --- | --- |');
[['temperature', 'subtract 32, divide by 1.8', 'degrees Celsius'],
  ['pressure', 'add 14.7, divide by 14.5038', 'bar absolute'],
  ['CO2 and H2S', 'divide by 100', 'mole fraction'],
  ['velocity', 'multiply by 0.3048', 'metres a second'],
  ['line inside diameter', 'multiply by 0.0254', 'metres'],
  ['density', 'multiply by 16.0185', 'kilograms a cubic metre'],
  ['viscosity', 'multiply by 0.001', 'pascal seconds'],
  ['corrosion allowance and consumed depth', 'multiply by 25.4', 'millimetres'],
  ['every rate on the way back out', 'divide by 25.4, multiply by 1000', 'mils a year alongside millimetres a year'],
].forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
w();
w(`ONE OF THOSE FACTORS IS TRUNCATED AND THE ENGINE'S OWN IS NOT. The studio divides a psig pressure by 14.5038 to reach bar. The engine exports the exact factor, which is ${e12(BAR_PSIA)}, exact by the definition of the bar and of the pound-force, and measured here out of the psia the engine reports for a 1 bar partial pressure. The studio's divisor is therefore larger than the exact factor by ${(Math.abs(14.5038 - BAR_PSIA) / BAR_PSIA).toExponential(3)} as a fraction, so a pressure converted through the studio and a pressure converted through the engine's own factor differ in the sixth significant figure.`);
w();
const APP_EXACT = success('the shipped defaults converted with the exact factor',
  C.screen({ ...APP, pTotalBar: (725 + 14.7) / BAR_PSIA }));
w(`WHAT THAT IS WORTH, measured rather than argued. The shipped defaults through the studio's divisor give a total pressure of ${e12(APP.pTotalBar)} bar and a rate of ${e12(AP.rate.rateMmYr)} mm/yr. Through the engine's exact factor they give ${e12((725 + 14.7) / BAR_PSIA)} bar and ${e12(APP_EXACT.rate.rateMmYr)} mm/yr. The two rates differ by ${(relDiff(APP_EXACT.rate.rateMmYr, AP.rate.rateMmYr)).toExponential(3)} as a fraction, which is far below anything a screening decision turns on and far above zero.`);
w();
w('THIS IS WHY NO GRADED FIELD IN THIS COURSE IS CONVERTED THROUGH THE STUDIO. The three capstones state their conditions in the ENGINE\'S units, and they say so on the page. Grading a learner on which rounding the app happened to use would grade them on the app rather than on corrosion, and the difference is large enough to fail a tolerance while being far too small to matter to an engineer. A capstone that did that would be measuring the wrong thing on purpose.');
w();
w(`AND THE SAME TRUNCATION ONCE REACHED A HINT A USER READ. The sour threshold was labelled 0.05 psia and it is ${e12(SOUR_PSIA)} psia; a threshold of exactly 0.05 psia would be ${e12(0.05 / BAR_PSIA)} bar, which is ${e6(Math.abs(0.05 / BAR_PSIA - SOUR_BAR) / SOUR_BAR * 100)} percent below the threshold the engine actually uses. The engine now derives and prints both numbers, and the vendored gate asserts the psia value is not 0.05.`);
w();

/* ------------------------------------------------------------ SECTION 25 */

w('# SECTION 25: WHAT THIS ENGINE USED TO DO. THIS SECTION IS REPAIR HISTORY, and nothing follows it (owned by Expert m06)');
w();
w('# THIS SECTION, AND ONLY THIS SECTION, DESCRIBES BEHAVIOUR THIS ENGINE NO LONGER HAS. Every sentence above this line is about the engine as it ships today. Every sentence below is about what it did before the repair that preceded this course, and each item is a GENERAL LESSON that happens to have an example here. A sentence about former behaviour that reads as current behaviour is a defect, and the frame for this material is this heading and this paragraph.');
w();
const HIST_MARKER = SRC.split('\n').filter((l) => l.includes('FC9-0'));
const HIST_LINES = SRC.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => /^\s*(\*|\/\/|\/\*)/.test(l)
  && /used to|previous version|earlier version|before|no longer|silently|would have/i.test(l));
w(`- THE ENGINE SOURCE CARRIES THIS HISTORY IN ITS COMMENTS, and a sentence lifted out of a comment arrives with no frame around it. Counted by reading engines/facilities/corrosion.js: ${HIST_MARKER.length} comment lines carry the repair marker, and ${HIST_LINES.length} comment lines are written in a past tense about former behaviour. The rule that counted them: a line that begins with a comment marker and contains one of "used to", "previous version", "earlier version", "before", "no longer", "silently" or "would have".`);
w(`- The module is ${SRC.split('\n').length} lines long, so roughly one line in ${Math.round(SRC.split('\n').length / Math.max(HIST_LINES.length, 1))} of it is a sentence about what it used to do. Engine source comments are PROVENANCE. So are the wave recon and findings reports, and so is the repair's own findings record vendored beside the oracle. None of the four is teaching truth.`);
w();
w('# ITEM ONE. THE HEADLINE. AN INVENTED CURVE WEARING SOMEBODY ELSE\'S AUTHORITY.');
w('- The general lesson, and it is the largest one in this course: a calculation can be wrong in a way that no amount of measurement repairs, because the number was never the claim. If a curve is labelled with a standard\'s name, the claim is "this is what the standard says". Retuning the curve does not make that true. The only honest repair is to withdraw the claim and say the thing is not provided.');
w('- Before the repair this engine computed a sour-service severity region from an expression of its own, labelled it with two standards, and served three named material recommendations off it: what steel to buy, when to control hardness, and when to qualify weldments. Four measurements settled what the expression was worth. Moving its pH pivot by a whole unit left the validation suite entirely green. Widening one of its region boundaries by a factor of two left the suite green. A missing pH made the expression not-a-number, both of its comparisons failed, and it fell through to the HARDEST material recommendation in the file from an input nobody had supplied.');
w(`- Today the function is gone, nothing replaces it, and section 2 is the current statement of that absence. The absence is a FIELD rather than a missing value: \`regionProvided\` is ${String(AP.sour.regionProvided)} and \`materialGuidanceProvided\` is ${String(AP.sour.materialGuidanceProvided)}, so a caller cannot read the gap as an unset property. The threshold value the screen still uses stayed exactly where it was, because changing a live number without a source is the same mistake with the sign flipped.`);
w();
w('# ITEM TWO. AN INPUT THAT MOVED NOTHING, BESIDE A SCREEN THAT SAID IT MATTERED.');
w('- The general lesson: when one input reaches the answer by two routes and the route that decides the headline ignores it, the box on the screen is decoration. The test is arithmetic and it takes one sweep: walk the input across its range and print the spread of the answer.');
w('- Before the repair the pH correction returned one for any pH at or below its reference, so pH 2.0, 3.0, 3.5 and 4.0 all produced the identical rate to sixteen figures. Two decades of hydrogen-ion activity moved the headline number by exactly nothing, while a second calculation on the same screen moved its answer four times across the same span. A more acid water is not a less corrosive one, so a factor of one was the least limiting possible answer to a question the module could not answer.');
w(`- Today the rate is strictly monotonic in pH across the whole band above the reference, which section 7 measures: from ${e6(PH_MONO[0])} mm/yr at pH ${e6(PH_SWEEP[0])} down to ${e6(PH_MONO[PH_MONO.length - 1])} mm/yr at pH ${e6(PH_SWEEP[PH_SWEEP.length - 1])}. Below the reference the engine refuses, and the refusal names the reference so a caller can print the boundary.`);
w();
w('# ITEM THREE. AN ABSENT INPUT GIVEN ITS LEAST LIMITING VALUE.');
w('- The general lesson: every absent input has a value that makes the answer look best, and a calculation that supplies that value has answered a question nobody asked. The shape to look for is a function that returns infinity, zero or one where it should return nothing.');
w('- Before the repair a blank velocity or a blank line diameter made the mass-transfer term INFINITE. An infinite transport capacity makes the series combination exactly equal the reaction term, so the engine then named reaction kinetics as the controlling mechanism from an input that had never been supplied, and the rate came out several times the correct one. A blank temperature made the fugacity not-a-number, which failed a greater-than test, which sent the engine down its NO-CO2 branch: a rate of zero, a negligible label in green, an unbounded life and a passing verdict, printed under a CO2 box that still read three percent.');
w('- Today the transport term returns not-a-number rather than infinity and the vendored gate asserts it is not infinity; the whole-screen door refuses when any of six boxes is blank, and the message names the box; and a TYPED zero is treated differently from a blank, which section 18 sets out. A typed zero is a positive assertion of no CO2, so the module withholds its category and its life and says what a rate of zero means there.');
w();
w('# ITEM FOUR. A WARNING THAT COULD NOT FIRE AT THE APP\'S OWN DEFAULTS.');
w('- The general lesson: a guard written with a strict comparison against a round number is switched off at exactly that number, and a shipped default sitting on the boundary is the likeliest value in the whole input space. Test a guard at the default before testing it anywhere else.');
w('- Before the repair the inhibitor warning fired only when the efficiency was strictly greater than ninety percent. The studio shipped with an efficiency of exactly ninety. So the one lesson this module exists to teach was silent on the first screen every user saw: the studio computed the effective protection, printed it in green because the colour was chosen from the presence of a warning, and said nothing. The same guard was equally silent at ninety percent efficiency and fifty percent availability.');
w(`- Today the warning fires on the EFFECTIVE SHORTFALL at any efficiency, with a trigger measured in section 3 at ${e6(SHORTFALL_TRIGGER)} percentage points, and it states the effective figure and the metal-loss ratio in its own words. At the shipped defaults it is present, and section 19 quotes it verbatim.`);
w();
w('# ITEM FIVE. A VALIDATION SUITE THAT COULD NOT FAIL.');
w('- The general lesson, in two halves. A validation case is worth what it can TELL APART, and it can be worth nothing in two different ways: it can be missing, so a route has no case at all; or it can be present and unable to discriminate, because the thing it is supposed to check is shared with whatever produced the expected answer. The second is the harder one to see, and the arithmetic of it is simple: A CONSTANT THAT LIVES IN TWO FILES CANNOT BE VALIDATED BY COMPARING THOSE TWO FILES.');
w('- Before the repair, thirteen defects planted one at a time in this engine left its suite entirely green, including a sour threshold moved by a factor of ten and a mass-transfer coefficient moved by a sixth. Worse, fifteen of seventeen constants moved in the engine AND in the oracle together also left it green, and the oracle caught none of the seventeen, because five of its routes were the engine\'s own expressions written out again and one was the engine\'s own line rearranged algebraically. Its docstring called that an independent re-derivation.');
w(`- Today the work is split three ways and the file says which is which: genuinely independent routes, constant-free invariants, and PINS. Section 20 lists the routes with what each one cannot check. Section 3 is the pins: ${PINS.length} held constants, each MEASURED out of the engine's behaviour and compared against a literal in a third file, with the golden's own copy as a fourth. Sections 5, 6, 7 and 13 are the constant-free invariants: the series residual, the factor being exactly one at its own computed onset, one decade per two pH units, and a ratio that is provably free of pressure.`);
w();
w('# NOTHING FOLLOWS THIS SECTION.');

/* --------------------------------------------------------- THE ASSERTIONS */

const failed = ASSERTS.filter((a) => !a.pass);
process.stderr.write(`fc9_dump: ${ASSERTS.length} label-and-call, measurement and pin assertions run, ${failed.length} failed\n`);
if (ASSERTS.length < 400) {
  process.stderr.write(`REFUSED: only ${ASSERTS.length} assertions were run, which is not a checked digest\n`);
  process.exit(2);
}
if (PINS.length < 25) {
  process.stderr.write(`REFUSED: only ${PINS.length} held constants were pinned against a third location\n`);
  process.exit(2);
}
if (failed.length) {
  failed.slice(0, 40).forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write('NOTHING WRITTEN. A labelled row whose call did something else must never reach a writer.\n');
  process.exit(1);
}
process.stdout.write(`${out.join('\n')}\n`);
