// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of relief_cases.json (plus
// sweeps around those published inputs) and the SIX TEACHING STREAMS this
// wave designed for itself: ORUBIRI, AKASO, TEBIDABA, BENISEDE, ODIDI and
// AFIESERE. THE FC5 CAPSTONE RUNS DIFFERENT PLANTS ENTIRELY: nothing here
// imports, reads or reproduces the capstone generator, the capstone condition
// file, the graded answer file, or any capstone rate, pressure, temperature,
// gravity, viscosity, level, droplet, diameter, orifice or coefficient.
//
// Usage:  sh /root/fc-wip-relief/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/fc-wip-relief/digest.txt
// Build THROUGH A TEMP FILE. A gate that reads a half written digest finds
// no literals and clears everything.
//
// Engine, vendored sha-identical with engines 3bac13cd (the FC5-0 repair):
// engines/facilities/relief.js. It imports nothing; the jest suite beside it
// imports spacing.js, which is why the vendoring closure is seven paths.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from a published case), "stated" (an input named
// on the same row) or "derived" (arithmetic on engine values printed in the
// same block, with the arithmetic stated). Where the engine keeps a constant
// to itself, the constant is MEASURED by asking the engine a question whose
// answer is that constant and nothing else. Nothing here reads a clock, a
// random number, a locale or a network, and TZ is pinned by build_digest.sh.
//
// THE DIGEST RULE. A sentence here may NAME a figure this file computes. It
// may NOT characterise the RELATIONSHIP between two figures unless that
// relationship is itself computed and printed on the same page. Seven
// instances across four sibling waves, one of them backwards, one off by a
// factor of ten. Every comparison below prints its own comparison.
//
// EVERY LABEL IS ASSERTED AGAINST WHAT THE CALL ACTUALLY DID. A sibling wave
// labelled a row a refusal and then called a case that SUCCEEDED, printing
// the success fields under a refusal heading: every number on the line was
// real engine output and the digest still taught the wrong evidence shape,
// and a numeric sweep cannot see it. So `refusal()` asserts an error key,
// `success()` asserts the absence of one, and every branch, warning, flag and
// convergence claim below goes through `must()`. If one assertion fails
// NOTHING IS WRITTEN: the accumulated digest is discarded and the build exits
// non-zero, so a labelled row can never reach a writer unchecked.
//
// NOTHING IN THIS FILE EXCEPT ITS FINAL SECTION DESCRIBES WHAT THE ENGINE
// USED TO DO. Repair history is provenance and lives in RECON.md, FINDINGS.md
// and the engine's own source comments, all three of which open with a banner
// or a marker saying so. The final section is the one place with the licence,
// it says so in its own title and its first line, and nothing follows it.

import fs from 'fs';
import {
  ORUBIRI, AKASO, TEBIDABA, BENISEDE, ODIDI, AFIESERE,
  ORUBIRI_BACK_RATIOS, CRITICAL_PROBE_OFFSET, K_SWEEP, AKASO_MU_SWEEP, KV_RE_SWEEP, KN_P_SWEEP,
  BISECT, BENISEDE_LEVEL_SWEEP, ENV_SWEEP, FIRE_EXPONENT_PROBE,
  ODIDI_DROPLET_SWEEP, ODIDI_HOLDUP_SWEEP, ODIDI_DIAMETER_SWEEP,
  AFIESERE_ORIFICE_SWEEP, AFIESERE_STEP_SWEEP, AFIESERE_FLARE,
  RADIATION_DISTANCE_SWEEP, PROBES, REFUSALS, BARE_NUMBER_EXPORTS,
  DATA_EXPORTS, CONSTANT_EXPORTS, ZERO_TIME_CASES, CONVENTION_PROBE,
  CONVENTION_LEVELS,
} from '/root/fc-wip-relief/fc5_fields.mjs';

const ROOT = process.env.FC5_ENGINES || '/root/wt-fc5-nextgen/packages/engines';
const R = await import(`${ROOT}/engines/facilities/relief.js`);
const SP = await import(`${ROOT}/engines/facilities/spacing.js`);
const GOLD = JSON.parse(fs.readFileSync(
  `${ROOT}/test-data/facilities/goldens/relief_cases.json`, 'utf8'));
const SRC = fs.readFileSync(`${ROOT}/engines/facilities/relief.js`, 'utf8');

const out = [];
const w = (s = '') => out.push(s);
const n = (x, d) => (x === null || x === undefined || !Number.isFinite(Number(x)) ? String(x) : Number(x).toFixed(d));
const e6 = (x) => n(x, 6);   // areas, pressures, ratios, velocities, lengths, intensities, times, temperatures
const r4 = (x) => n(x, 4);   // flows, duties, wetted areas, masses
const e12 = (x) => n(x, 12); // measured constants and ratios of them
const keys = (r) => Object.keys(r).join(', ');
// The published file holds the ORACLE's answers, derived by independent SI
// routes. The engine's answer is a second derivation. Agreement is therefore a
// RESULT with a size, and the digest prints that size rather than implying the
// two are identical. The tolerance on each row is the one the jest suite
// checks that block at.
const relDiff = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);
const agree = (label, a, b, tol) => {
  must(`${label} agrees with the published case inside ${tol}`, relDiff(a, b) < tol,
    `relative difference ${relDiff(a, b).toExponential(3)} against ${tol}`);
  return relDiff(a, b).toExponential(3);
};

/* ------------------------------------------------ THE ASSERTION MACHINERY */

const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
/** A call this file LABELS a refusal. Asserts an error key and returns it. */
const refusal = (label, fn, arg) => {
  const r = fn(arg);
  const isNum = typeof r === 'number';
  const refused = isNum ? Number.isNaN(r) : !!(r && r.error);
  must(`LABELLED A REFUSAL: ${label}`, refused,
    isNum ? `returned the bare number ${r}` : `returned keys [${r ? keys(r) : r}]`);
  if (!isNum && r) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`REFUSAL CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k2, v]) => `${k2}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};
/** A call this file LABELS a success. Asserts no error key and returns it. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  return r;
};

/**
 * Solve a 3 by 3 linear system by Gaussian elimination with partial pivoting.
 * Used to recover a published FIT from the engine's own answers at three
 * inputs. An asymptotic reading is not good enough for either fit here: at a
 * Reynolds number of 1e18 the inverse-root term of the Kv fit is still 2.9e-9,
 * and subtracting an intercept that carries that residue put the next
 * coefficient out by more than one percent. Three exact equations recover all
 * three at once.
 */
const solve3 = (rows) => {
  const m = rows.map((r) => [...r]);
  for (let c = 0; c < 3; c += 1) {
    let pv = c;
    for (let r = c + 1; r < 3; r += 1) if (Math.abs(m[r][c]) > Math.abs(m[pv][c])) pv = r;
    [m[c], m[pv]] = [m[pv], m[c]];
    for (let r = 0; r < 3; r += 1) {
      if (r === c) continue;
      const f = m[r][c] / m[c][c];
      for (let cc = c; cc < 4; cc += 1) m[r][cc] -= f * m[c][cc];
    }
  }
  return [m[0][3] / m[0][0], m[1][3] / m[1][1], m[2][3] / m[2][2]];
};

/** One bisection routine, used everywhere a threshold is MEASURED. */
const bisect = (lo, hi, pred) => {
  let a = lo; let b = hi;
  if (pred(a) === pred(b)) return NaN;
  for (let i = 0; i < 300; i += 1) {
    const m = (a + b) / 2;
    if (pred(m) === pred(a)) a = m; else b = m;
    if (Math.abs(b - a) <= Math.abs(b) * 1e-14) break;
  }
  return (a + b) / 2;
};

/* ============================== MEASUREMENTS, taken before anything is
   printed, so every section below quotes a measured constant rather than a
   typed one. ========================================================== */

// The atmospheric outlet pressure the gas route defaults to. In CRITICAL flow
// the area does not depend on the back pressure at all, so the default cannot
// be recovered from an area there. It is recovered from the BRANCH FLAG
// instead: with p2 omitted the engine goes critical exactly when the default
// p2 falls to or below rCrit p1, so the p1 at which the flag turns over,
// multiplied by the engine's own critical ratio, IS the default.
const ATM = (() => {
  const base = { wLbHr: 10000, tR: 600, mw: 20, z: 1, k: 1.3 };
  const flip = bisect(5, 200, (p1) => R.gasVaporArea({ ...base, p1Psia: p1 }).critical === true);
  return flip * R.criticalPressureRatio(base.k);
})();
// The same number a second way, in the SUBCRITICAL branch where the area does
// move with the back pressure: the stated p2 that reproduces the omitted
// call's area.
const ATM_CONFIRM = (() => {
  const base = { wLbHr: 10000, p1Psia: 25, tR: 600, mw: 20, z: 1, k: 1.3 };
  const omitted = R.gasVaporArea(base);
  return bisect(13.7, 24.9, (p2) => R.gasVaporArea({ ...base, p2Psia: p2 }).areaIn2 <= omitted.areaIn2);
})();
// And a third, from a completely different function: the blowdown march
// reports the pressure below which its choked assumption stops holding, which
// is the default back pressure over the critical ratio.
const ATM_BLOWDOWN = (() => {
  const b = { volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, orificeDIn: 1 };
  return R.blowdown(b).chokedToPsia * R.criticalPressureRatio(b.k);
})();

const relievingPsia = (setPsig, pct) => setPsig * (1 + pct / 100) + ATM;

// C = 520 sqrt(k (2/(k+1))^((k+1)/(k-1))). The bracket is computable from k
// alone, so dividing the engine's own C by it leaves 520.
const kp = PROBES.cAtK;
const C_BRACKET = Math.sqrt(kp * (2 / (kp + 1)) ** ((kp + 1) / (kp - 1)));
const C520 = R.gasConstantC(kp) / C_BRACKET;

// 735: one subcritical area, its own F2, and its own stated inputs.
const SUB = PROBES.subcritical;
const SUB_R = success('the 735 probe, a subcritical gas area', R.gasVaporArea(SUB));
const SUB_F2 = R.subcriticalF2({ k: SUB.k, r: SUB.p2Psia / SUB.p1Psia });
const C735 = (SUB.wLbHr / (SUB_R.areaIn2 * SUB_F2))
  * Math.sqrt((SUB.tR * SUB.z) / (SUB.mw * SUB.p1Psia * (SUB.p1Psia - SUB.p2Psia)));

// 38: one inviscid liquid area at unit factors.
const LB = PROBES.liquidBare;
const LB_R = success('the 38 probe, an inviscid liquid area', R.liquidArea(LB));
const C38 = (LB.qGpm * Math.sqrt(LB.sg)) / (LB_R.areaIn2 * Math.sqrt(LB.p1Psig - LB.p2Psig));

// 51.5: one steam area below the Napier threshold at unit factors.
const SB = PROBES.steamBare;
const SB_R = success('the 51.5 probe, a steam area at unit factors', R.steamArea(SB));
const C515 = SB.wLbHr / (SB_R.areaIn2 * SB.p1Psia);

// 21000 and 34500: one duty each at a unit area and a unit environment factor,
// where A^0.82 is one whatever the exponent is.
const FIRE_DRAINED = success('the 21000 probe', R.fireHeatInput({ ...PROBES.fireBare, adequateDrainage: true }));
const FIRE_UNDRAINED = success('the 34500 probe', R.fireHeatInput({ ...PROBES.fireBare, adequateDrainage: false }));
const C21000 = FIRE_DRAINED.qBtuHr;
const C34500 = FIRE_UNDRAINED.qBtuHr;
const DRAINAGE_FACTOR = C34500 / C21000;

// The pool-fire exponent: the log ratio of two duties at two areas.
const { a1: EA1, a2: EA2 } = FIRE_EXPONENT_PROBE;
const FIRE_EXP = Math.log(R.fireHeatInput({ wettedFt2: EA2 }).qBtuHr
  / R.fireHeatInput({ wettedFt2: EA1 }).qBtuHr) / Math.log(EA2 / EA1);

// The Kv fit, term by term, out of the UNCLAMPED export so the asymptote is
// reachable. 1/Kv is a linear combination of 1, Re^-0.5 and Re^-1.5, so three
// Reynolds numbers solve for all three coefficients and nothing is typed.
// 1/Kv is a + b Re^-0.5 + c Re^-1.5, so THREE Reynolds numbers solve for all
// three coefficients exactly. All three sit below the clamp, so the raw fit is
// what is being read.
const [KV_A, KV_B, KV_C] = (() => {
  const REs = [4, 100, 1e4];
  return solve3(REs.map((re) => [1, re ** -0.5, re ** -1.5, 1 / R.liquidKvUnclamped(re)]));
})();
// The asymptote the unclamped fit reaches, and the Reynolds number at which
// the clamp starts holding the correction at one.
const KV_ASYMPTOTE = R.liquidKvUnclamped(1e18);
const KV_CLAMP_RE = bisect(1e3, 1e7, (re) => R.liquidKvUnclamped(re) < 1);

// The Napier fit: KN is a ratio of two lines in P, so three pressures above
// the threshold solve the fit up to one scale.
// KN is a ratio of two lines in the pressure, (aP + b)/(cP + d), and a ratio of
// lines is UNCHANGED when all four coefficients are scaled together. So only
// THREE of the four are measurable, and the published quartet is one scaling of
// them. The digest normalises the DENOMINATOR SLOPE to one and prints the three
// that remain, which is the honest statement of what can be recovered:
//   KN = (A P + B) / (P + D),  A = a/c, B = b/c, D = d/c
// Three pressures above the threshold solve it exactly.
const NAPIER = (() => {
  const P = [1700, 2100, 2600];
  const [A, B, D] = solve3(P.map((p) => {
    const k = R.steamKn(p);
    return [p, 1, -k, k * p];
  }));
  return { A, B, D };
})();

// Thresholds, every one bisected out of the engine's own behaviour.
const KN_THRESHOLD = bisect(...BISECT.napierThreshold, (p) => R.steamKn(p) === 1);
const KN_TOP = bisect(...BISECT.napierTop, (p) => !Number.isNaN(R.steamKn(p)));
// The crossing back through unity. The bracket may NOT start on the threshold:
// KN is exactly 1.0 there, so the predicate is false at both ends and there is
// nothing to bracket. It starts just inside the band where KN is below one.
const KN_UNITY_CROSSING = bisect(KN_THRESHOLD + 1e-6, BISECT.napierUnityCrossing[1], (p) => R.steamKn(p) < 1);
const LATENT_WARN = bisect(...BISECT.latentWarning, (L) => R.fireReliefLoad({ qBtuHr: 1e7, latentBtuLb: L }).warning === null);
const KV_WARN = (() => {
  const mu = bisect(1, 1e9, (m2) => (R.liquidArea({ qGpm: 500, p1Psig: 250, p2Psig: 50, sg: 0.9, muCp: m2 }).warning === null));
  return R.liquidArea({ qGpm: 500, p1Psig: 250, p2Psig: 50, sg: 0.9, muCp: mu }).kv;
})();
const BACKP_WARN_RATIO = (() => {
  const base = { wLbHr: 10000, p1Psia: 500, tR: 600, mw: 20, z: 0.9, k: 1.3 };
  const p2 = bisect(1, R.criticalPressureRatio(1.3) * 500 - 1e-9,
    (x) => R.gasVaporArea({ ...base, p2Psia: x }).warning === null);
  return p2 / 500;
})();
// The low-Reynolds drag cap: the vapour viscosity at which the returned drag
// coefficient stops moving, and the Reynolds number the engine reports there.
const DRAG_CAP = (() => {
  const f = (mu) => R.dropoutVelocityFtS({ dropletMicron: 50, rhoLLbFt3: 50, rhoVLbFt3: 0.5, muVCp: mu });
  const muAt = bisect(0.001, 1e7, (mu) => f(mu).dragC < 239.999999999);
  // the cap itself is read well INSIDE the capped region, so the figure is the
  // cap rather than the cap plus whatever the fit still contributes at the edge
  return { c: f(muAt * 100).dragC, re: f(muAt * 0.9999999).reynolds, muAt };
})();
// The L over D at which the drum's note changes, in both directions, measured
// by walking the diameter at a fixed duty.
// The two edges of the drum's own note band. BOTH ends of any diameter range
// carry a note, one saying go wider and the other saying go smaller, so
// bisecting for the ABSENCE of a note brackets nothing and returns NaN. Each
// edge is bisected on the note that is actually changing there.
const LD_NOTE = (() => {
  const base = { qVaporAcfs: 120, udFtS: 1.73, liquidFraction: 0.25 };
  const at = (d) => R.koDrumHorizontal({ ...base, diameterFt: d });
  const hi = bisect(1, 40, (d) => at(d).note === 'L/D above 6: go to a larger diameter');
  const lo = bisect(1, 40, (d) => at(d).note === 'L/D below 2: a smaller drum may do');
  return { hiLd: at(hi).ld, loLd: at(lo).ld, hiD: hi, loD: lo };
})();
// The default time limit. Measured from BELOW rather than by walking maxS,
// because a march with a tiny orifice and the default step runs into the step
// budget instead. With a coarse step the step count stays small, so the
// orifice at which the march just refuses can be bisected cheaply, and the
// time the last SUCCEEDING march returns approaches the limit from below.
const BLOWDOWN_LIMIT = (() => {
  const b = { volumeFt3: 500, p0Psia: 1000, t0R: 560, pEndPsia: 100, mw: 19, k: 1.3, z: 0.9, dtS: 2 };
  const d = bisect(0.02, 1, (x) => !R.blowdown({ ...b, orificeDIn: x }).error);
  const lo = R.blowdown({ ...b, orificeDIn: d * (1 + 1e-9) });
  return lo.error ? NaN : lo.timeS;
})();

// The universal gas constant the march stands on, straight out of the mass the
// engine reports for its own start state: m0 = p0 144 V / (z Rspec t0) with
// Rspec = Runiv / mw, so Runiv = p0 144 V mw / (z t0 m0).
const BP = PROBES.blowdownProbe;
const BP_RUN = success('the gas constant probe, a blowdown march', R.blowdown(BP));
const RGAS_UNIVERSAL = (BP.p0Psia * 144 * BP.volumeFt3 * BP.mw) / (BP.z * BP.t0R * BP_RUN.initialMassLb);

// The march has a closed form, and the digest USES it as the check the
// oracle uses. dm/dt = -K m^((k+1)/2) is separable, so the time from m0 to the
// mass the engine reports at the end is
//     t = (2 / ((k-1) K)) (mEnd^(-(k-1)/2) - m0^(-(k-1)/2))
// with K built from the engine's own C, the measured gas constant and the
// stated geometry. A hidden coefficient anywhere inside the march would show
// here as a ratio away from one.
const closedFormTimeS = (b, run) => {
  const c = R.gasConstantC(b.k);
  const rSpec = RGAS_UNIVERSAL / b.mw;
  const a144 = (b.cd ?? 0.85) * (Math.PI / 4) * (b.orificeDIn / 12) ** 2 * 144;
  const m0 = run.initialMassLb;
  const K = (c * a144 * Math.sqrt(b.mw / b.z) * b.z * rSpec * Math.sqrt(b.t0R))
    / (3600 * 144 * b.volumeFt3 * m0 ** ((b.k - 1) / 2));
  const ex = (b.k - 1) / 2;
  return (2 / ((b.k - 1) * K)) * (run.massRemainingLb ** -ex - m0 ** -ex);
};

// 4 pi, out of the point source against its own stated inputs.
const FOUR_PI = (() => {
  const p = PROBES.pointSource;
  return (p.transmissivity * p.fractionRadiated * p.qKw)
    / (R.radiationIntensity(p).kWm2 * p.distanceM ** 2);
})();
// The two directions of the point source against each other: the distance the
// engine demands for the intensity the engine reported at a known distance.
const POINT_ROUNDTRIP = (() => {
  const p = PROBES.pointSource;
  const k1 = R.radiationIntensity(p).kWm2;
  const d2 = R.distanceForIntensity({ qKw: p.qKw, allowableKwM2: k1, fractionRadiated: p.fractionRadiated, transmissivity: p.transmissivity }).distanceM;
  return { k1, d2, ratio: d2 / p.distanceM };
})();

// The settling balance. Ud^2 C rhoV / ((rhoL - rhoV) d) leaves the 4/3, g and
// the micron conversion together; two droplet sizes and two viscosities
// separate the size conversion from the rest.
const SETTLE_GROUP = (() => {
  const g = (o) => { const r = R.dropoutVelocityFtS(o); return (r.udFtS ** 2 * r.dragC * o.rhoVLbFt3) / ((o.rhoLLbFt3 - o.rhoVLbFt3) * o.dropletMicron); };
  return { a: g(PROBES.settleA), b: g(PROBES.settleB), c: g(PROBES.settleC) };
})();
// The exact coefficient the balance carries, recovered from the returned pair
// at one droplet: Ud = coeff sqrt(g d (rhoL - rhoV) / (rhoV C)), and the only
// unknowns are the coefficient and the foot-per-micron conversion, which the
// two droplet sizes above separate.
const SETTLE_COEFF_SQ = (() => {
  const o = PROBES.settleA;
  const r = R.dropoutVelocityFtS(o);
  const perMicron = SETTLE_GROUP.a / (32.174 * 3.2808398950131233e-6) / 1;
  return { perMicron, coeffSq: SETTLE_GROUP.a / (32.174 * 3.2808398950131233e-6), ud: r.udFtS, c: r.dragC };
})();
const C2800 = (() => {
  const o = PROBES.liquidRe;
  const r = success('the 2800 probe, a viscous liquid area', R.liquidArea(o));
  return (r.reynolds * o.muCp * Math.sqrt(r.areaIn2)) / (o.qGpm * o.sg);
})();

/* ================================================== derived teaching runs */

const oruP1 = relievingPsia(ORUBIRI.setPsig, ORUBIRI.overpressurePct);
const oruP2 = ORUBIRI.backPsig + ATM;
const oruCall = {
  wLbHr: ORUBIRI.wLbHr, p1Psia: oruP1, p2Psia: oruP2, tR: ORUBIRI.tF + 459.67,
  mw: ORUBIRI.mw, z: ORUBIRI.z, k: ORUBIRI.k, kd: ORUBIRI.kd, kb: ORUBIRI.kb, kc: ORUBIRI.kc,
};
const oru = success('ORUBIRI, the gas relief case', R.gasVaporArea(oruCall));
const oruOrifice = success('ORUBIRI, the orifice selection', R.selectOrifice(oru.areaIn2));

// THE GAS ROUTE'S OWN DEFAULT CERTIFIED COEFFICIENTS, MEASURED. The required
// area is inversely proportional to the product Kd Kb Kc, so the ratio of the
// area at unit coefficients to the area with ONE of them left out is exactly
// that one's default. Nothing here types 0.975, and nothing below counts rows
// "away from the defaults" against a number a reader cannot check.
const GAS_DEFAULTS = (() => {
  const unit = { ...oruCall, kd: 1, kb: 1, kc: 1 };
  const a1 = success('the unit-coefficient gas probe', R.gasVaporArea(unit)).areaIn2;
  const without = (drop) => {
    const c = { ...unit };
    delete c[drop];
    return success(`the default ${drop} probe`, R.gasVaporArea(c)).areaIn2;
  };
  return { kd: a1 / without('kd'), kb: a1 / without('kb'), kc: a1 / without('kc') };
})();

// THE EXTRA KEYS selectOrifice's REFUSAL CARRIES BESIDE `error`, read off the
// returned object rather than listed. The contract table below says every
// object route returns "either a finite result or an object carrying an `error`
// string", and on this one route the refusal carries a usable figure too. The
// Expert tier taught that shape with no name for the key and no figure, because
// the digest printed the value under a prose column heading and never named the
// field. A writer cannot name what the digest will not spell.
const ORIFICE_REFUSAL_EXTRA = (() => {
  const r = refusal('the orifice refusal, read for its key names', R.selectOrifice, 1e6);
  const extra = Object.keys(r).filter((k2) => k2 !== 'error');
  must('the orifice refusal carries exactly one key beside `error`', extra.length === 1,
    `keys [${keys(r)}]`);
  must('that key is a whole number of valves, one or more',
    Number.isInteger(r[extra[0]]) && r[extra[0]] >= 1, `${extra[0]}=${r[extra[0]]}`);
  return extra;
})();

// THE TWO PROBE RATIOS EITHER SIDE OF THE CROSSING, derived from the ratio the
// engine reports rather than typed, and asserted to land on opposite branches.
const CRIT_LO = oru.criticalRatio - CRITICAL_PROBE_OFFSET;
const CRIT_HI = oru.criticalRatio + CRITICAL_PROBE_OFFSET;
const ORU_RATIO_WALK = [...ORUBIRI_BACK_RATIOS, CRIT_LO, CRIT_HI].sort((a, b) => a - b);

// AKASO's RELIEVING pressure in psig. It is NOT the set pressure: the set
// pressure is 310 psig and this is that raised by the allowed overpressure.
// Section 3 used to call this figure AKASO's set pressure while Sections 6 and
// 11 printed 310 as the set pressure and this as the relieving one, so the
// digest disagreed with itself about which of two printed numbers was which.
const akaP1 = AKASO.setPsig * (1 + AKASO.overpressurePct / 100);
const akaBase = {
  qGpm: AKASO.qGpm, p1Psig: akaP1, p2Psig: AKASO.backPsig, sg: AKASO.sg,
  kd: AKASO.kd, kw: AKASO.kw, kc: AKASO.kc,
};
const aka = success('AKASO, the viscous liquid relief case', R.liquidArea({ ...akaBase, muCp: AKASO.muCp }));
const akaInviscid = success('AKASO read with no viscosity', R.liquidArea(akaBase));
const akaOrifice = success('AKASO, the orifice selection', R.selectOrifice(aka.areaIn2));
// what a SINGLE pass of the Kv loop would have given, built from the engine's
// own measured 38 and 2800 and the engine's own Kv function
const akaOnePass = (() => {
  const base = (kv) => (AKASO.qGpm * Math.sqrt(AKASO.sg))
    / (C38 * AKASO.kd * AKASO.kw * AKASO.kc * kv * Math.sqrt(akaP1 - AKASO.backPsig));
  const a0 = base(1);
  const re = (AKASO.qGpm * C2800 * AKASO.sg) / (AKASO.muCp * Math.sqrt(a0));
  return { areaIn2: base(R.liquidKv(re)), kv: R.liquidKv(re), reynolds: re };
})();

const tebP1 = relievingPsia(TEBIDABA.setPsig, TEBIDABA.overpressurePct);
const tebCall = { wLbHr: TEBIDABA.wLbHr, p1Psia: tebP1, kd: TEBIDABA.kd, kb: TEBIDABA.kb, kc: TEBIDABA.kc, ksh: TEBIDABA.ksh };
const teb = success('TEBIDABA, the steam relief case', R.steamArea(tebCall));
const tebOrifice = success('TEBIDABA, the orifice selection', R.selectOrifice(teb.areaIn2));

const benWet = success('BENISEDE, the wetted area lying down', R.wettedAreaFt2({
  orientation: BENISEDE.orientation, diameterFt: BENISEDE.diameterFt,
  lengthFt: BENISEDE.lengthFt, liquidLevelFt: BENISEDE.liquidLevelFt,
}));
const benVert = success('BENISEDE, the same vessel read standing up', R.wettedAreaFt2({
  orientation: 'vertical', diameterFt: BENISEDE.diameterFt,
  lengthFt: BENISEDE.lengthFt, liquidLevelFt: BENISEDE.liquidLevelFt,
}));
const benDuty = success('BENISEDE, the pool fire duty', R.fireHeatInput({
  wettedFt2: benWet.areaFt2, adequateDrainage: BENISEDE.adequateDrainage, envFactor: BENISEDE.envFactor,
}));
const benLoad = success('BENISEDE, the relief load', R.fireReliefLoad({ qBtuHr: benDuty.qBtuHr, latentBtuLb: BENISEDE.latentBtuLb }));
const benP1 = relievingPsia(BENISEDE.setPsig, BENISEDE.overpressurePct);
const benArea = success('BENISEDE, the area the fire load demands', R.gasVaporArea({
  wLbHr: benLoad.wLbHr, p1Psia: benP1, p2Psia: ATM, tR: BENISEDE.tF + 459.67,
  mw: BENISEDE.mw, z: BENISEDE.z, k: BENISEDE.k,
}));
const benOrifice = success('BENISEDE, the orifice selection', R.selectOrifice(benArea.areaIn2));

const odiTR = ODIDI.tF + 459.67;
const odiRhoV = (28.9625 * ODIDI.gasSg * ODIDI.pPsia) / (10.7316 * odiTR);
const odiSettle = success('ODIDI, the dropout velocity', R.dropoutVelocityFtS({
  dropletMicron: ODIDI.dropletMicron, rhoLLbFt3: ODIDI.rhoLLbFt3,
  rhoVLbFt3: odiRhoV, muVCp: ODIDI.muVCp,
}));
const odiQ = (ODIDI.qVaporMMscfd * 1e6 / 86400) * (14.696 / ODIDI.pPsia) * (odiTR / 519.67);
const odiDrumCall = {
  qVaporAcfs: odiQ, udFtS: odiSettle.udFtS, diameterFt: ODIDI.diameterFt,
  liquidFraction: ODIDI.liquidFraction,
};
const odiDrum = success('ODIDI, the knockout drum', R.koDrumHorizontal(odiDrumCall));

const afi = success('AFIESERE, the blowdown march', R.blowdown(AFIESERE));
const afiClosed = closedFormTimeS(AFIESERE, afi);
const afiFlareKw = AFIESERE_FLARE.reliefWLbHr * AFIESERE_FLARE.lhvBtuLb * 0.29307107e-3;
const afiRad = success('AFIESERE, the radiant intensity at the fence', R.radiationIntensity({
  qKw: afiFlareKw, distanceM: AFIESERE_FLARE.distanceM,
  fractionRadiated: AFIESERE_FLARE.fractionRadiated, transmissivity: AFIESERE_FLARE.transmissivity,
}));

/* --------------------------------------------------------------------------
 * EVERY MEASURED CONSTANT AND EVERY MEASURED EDGE MUST BE FINITE.
 *
 * This block exists because two of them were NOT. A bisection whose predicate
 * is false at BOTH ends of its bracket has nothing to bracket and returns NaN,
 * and the digest printed "NaN" for the Napier unity crossing and "undefined"
 * for the lower edge of the drum's note band. Both read as a measurement on the
 * page, both were wrong, and NO gate in this wave looked at them: the label
 * assertions check what a CALL did and a numeric sweep resolves figures against
 * the digest, and neither asks whether a printed figure is a number.
 * -------------------------------------------------------------------------- */

const MEASURED = {
  ATM, ATM_CONFIRM, ATM_BLOWDOWN, C520, C735, C38, C515, C21000, C34500,
  DRAINAGE_FACTOR, FIRE_EXP, KV_A, KV_B, KV_C, KV_ASYMPTOTE, KV_CLAMP_RE,
  'NAPIER.A': NAPIER.A, 'NAPIER.B': NAPIER.B, 'NAPIER.D': NAPIER.D,
  KN_THRESHOLD, KN_TOP, KN_UNITY_CROSSING, 'NAPIER_UNITY_PSIA': R.NAPIER_UNITY_PSIA,
  LATENT_WARN, KV_WARN, BACKP_WARN_RATIO, 'DRAG_CAP.c': DRAG_CAP.c, 'DRAG_CAP.re': DRAG_CAP.re,
  'LD_NOTE.hiLd': LD_NOTE.hiLd, 'LD_NOTE.loLd': LD_NOTE.loLd, BLOWDOWN_LIMIT,
  RGAS_UNIVERSAL, FOUR_PI, 'SETTLE_GROUP.a': SETTLE_GROUP.a, 'SETTLE_GROUP.b': SETTLE_GROUP.b,
  'SETTLE_GROUP.c': SETTLE_GROUP.c, 'SETTLE_COEFF_SQ.coeffSq': SETTLE_COEFF_SQ.coeffSq, C2800,
  'POINT_ROUNDTRIP.k1': POINT_ROUNDTRIP.k1, 'POINT_ROUNDTRIP.d2': POINT_ROUNDTRIP.d2,
  'GAS_DEFAULTS.kd': GAS_DEFAULTS.kd, 'GAS_DEFAULTS.kb': GAS_DEFAULTS.kb,
  'GAS_DEFAULTS.kc': GAS_DEFAULTS.kc, CRIT_LO, CRIT_HI,
};
Object.entries(MEASURED).forEach(([name, v]) => {
  must(`the measured constant ${name} is a finite number`, Number.isFinite(v), String(v));
});
must('every measured constant was examined', Object.keys(MEASURED).length >= 40,
  `${Object.keys(MEASURED).length} measured constants and edges checked`);

/* THE TWO PROBE ROWS REALLY DO STRADDLE THE CROSSING. A heading that says a
   pair was chosen either side of a boundary is a claim about the engine, so it
   is asserted here against what the engine returned rather than trusted. Both
   halves: the ratios sit either side of the measured one, and the two calls
   come back on DIFFERENT branches. The pair this replaced satisfied neither. */
const critLoRun = success('the probe row just below the critical ratio',
  R.gasVaporArea({ ...oruCall, p2Psia: CRIT_LO * oruP1 }));
const critHiRun = success('the probe row just above the critical ratio',
  R.gasVaporArea({ ...oruCall, p2Psia: CRIT_HI * oruP1 }));
must('the two probe ratios sit either side of the measured critical ratio',
  CRIT_LO < oru.criticalRatio && oru.criticalRatio < CRIT_HI,
  `${e12(CRIT_LO)} < ${e12(oru.criticalRatio)} < ${e12(CRIT_HI)}`);
must('the two probe rows come back on DIFFERENT branches',
  critLoRun.critical === true && critHiRun.critical === false,
  `critical below ${critLoRun.critical}, critical above ${critHiRun.critical}`);
must('the two probe ratios print as two DISTINCT numbers at six decimals',
  e6(CRIT_LO) !== e6(CRIT_HI), `${e6(CRIT_LO)} and ${e6(CRIT_HI)}`);

/* AND THE MEASURED DEFAULT COEFFICIENTS ARE FRACTIONS OF AN IDEAL. A default
   recovered as a ratio of two areas could come back as anything if the
   proportionality assumed above were wrong, so the shape is checked. */
Object.entries(GAS_DEFAULTS).forEach(([k2, v]) => {
  must(`the measured default ${k2} is above zero and no more than one`, v > 0 && v <= 1, e12(v));
});

/* --------------------------------------------------------------------------
 * AND EVERY MEASURED LEADING CONSTANT MUST BE THE PUBLISHED FIGURE.
 *
 * This block exists because one of them was not. The subcritical probe ran at
 * the engine's DEFAULT discharge coefficient instead of at unit coefficients,
 * so it recovered the leading constant times 0.975 and the digest printed
 * 716.625 where the standard prints 735. It read exactly like a measurement,
 * it was a real engine return, and no other gate could see it: the finite check
 * passes on a wrong finite number, and a sweep that resolves figures against
 * the digest resolves a wrong figure against itself.
 *
 * The expected values are typed HERE, inside the assertion machinery, which
 * never reaches the digest. That is the point: a measurement is only worth
 * something when something independent says what it should have been.
 * -------------------------------------------------------------------------- */

const PUBLISHED = [
  ['the gas coefficient leading constant', C520, 520, 1e-9],
  ['the subcritical leading constant', C735, 735, 1e-9],
  ['the liquid leading constant', C38, 38, 1e-9],
  ['the liquid Reynolds constant', C2800, 2800, 1e-6],
  ['the steam leading constant', C515, 51.5, 1e-9],
  ['the pool fire constant with drainage', C21000, 21000, 1e-6],
  ['the pool fire constant without drainage', C34500, 34500, 1e-6],
  ['the pool fire exponent', FIRE_EXP, 0.82, 1e-9],
  ['the universal gas constant', RGAS_UNIVERSAL, 1545.349, 1e-6],
  ['the solid angle in the point source', FOUR_PI, 4 * Math.PI, 1e-9],
  ['the default outlet pressure', ATM, 14.7, 1e-9],
  ['the Napier threshold', KN_THRESHOLD, 1500, 1e-6],
  ['the top of the published Napier range', KN_TOP, 3200, 1e-6],
  ['the drag coefficient cap', DRAG_CAP.c, 240, 1e-9],
  ['the Kv fit intercept', KV_A, 0.9935, 1e-9],
  ['the Kv fit inverse-root term', KV_B, 2.878, 1e-9],
  ['the Kv fit inverse-three-halves term', KV_C, 342.75, 1e-6],
  ['the Napier numerator slope over the denominator slope', NAPIER.A, 0.1906 / 0.2292, 1e-9],
  ['the Napier numerator intercept over the denominator slope', NAPIER.B, -1000 / 0.2292, 1e-9],
  ['the Napier denominator intercept over the denominator slope', NAPIER.D, -1061 / 0.2292, 1e-9],
  ['the blowdown time limit', BLOWDOWN_LIMIT, 7200, 1e-4],
  ['the back-pressure ratio the bellows warning fires above', BACKP_WARN_RATIO, 0.3, 1e-9],
  ['the Kv the envelope warning fires below', KV_WARN, 0.5, 1e-9],
  ['the latent heat the near-critical warning fires below', LATENT_WARN, 50, 1e-9],
  ['the go-wider note edge in L over D', LD_NOTE.hiLd, 6, 1e-9],
  ['the smaller-drum note edge in L over D', LD_NOTE.loLd, 2, 1e-9],
];
PUBLISHED.forEach(([name, got, want, tol]) => {
  must(`${name} measures the published figure`, Math.abs(got / want - 1) <= tol,
    `measured ${got}, published ${want}, relative difference ${Math.abs(got / want - 1).toExponential(3)}`);
});
must('enough leading constants and edges were checked against a published figure',
  PUBLISHED.length >= 20, `${PUBLISHED.length} checked`);

/* ------------------------------------- the claims this file goes on to make */

must('ATM is measured the same three ways to twelve figures',
  Math.abs(ATM - ATM_CONFIRM) < 1e-9 && Math.abs(ATM - ATM_BLOWDOWN) < 1e-9,
  `${e12(ATM)} / ${e12(ATM_CONFIRM)} / ${e12(ATM_BLOWDOWN)}`);
must('ORUBIRI is in the CRITICAL branch', oru.critical === true, `critical=${oru.critical}`);
must('the ORUBIRI back-pressure ratio is BELOW the ratio at which the bellows warning fires',
  oruP2 / oruP1 < BACKP_WARN_RATIO, `${e6(oruP2 / oruP1)} against ${e6(BACKP_WARN_RATIO)}`);
must('ORUBIRI therefore carries NO bellows warning', oru.warning === null, `warning=${oru.warning}`);
must('AKASO converged its Kv loop', aka.kvConverged === true, `iterations=${aka.kvIterations}, residual=${aka.kvResidual}`);
must('AKASO took more than one pass, so the loop is not decoration', aka.kvIterations > 1, `iterations=${aka.kvIterations}`);
must('AKASO viscous area exceeds the inviscid one', aka.areaIn2 > akaInviscid.areaIn2, `${e6(aka.areaIn2)} against ${e6(akaInviscid.areaIn2)}`);
must('TEBIDABA is above the Napier threshold', teb.kn !== 1.0, `kn=${e12(teb.kn)}`);
must('BENISEDE is not at half its diameter, so the two orientations differ',
  BENISEDE.liquidLevelFt !== BENISEDE.diameterFt / 2, `level ${BENISEDE.liquidLevelFt} ft, diameter ${BENISEDE.diameterFt} ft`);
must('ODIDI holdup moves the required length', Math.abs(
  R.koDrumHorizontal({ ...odiDrumCall, liquidFraction: 0.9 }).requiredLengthFt - odiDrum.requiredLengthFt) > 1,
  `f 0.30 gives ${e6(odiDrum.requiredLengthFt)} ft, f 0.90 gives ${e6(R.koDrumHorizontal({ ...odiDrumCall, liquidFraction: 0.9 }).requiredLengthFt)} ft`);
must('the AFIESERE march reached the end pressure', Math.abs(afi.finalPPsia - AFIESERE.pEndPsia) < 1e-6,
  `finalPPsia=${e6(afi.finalPPsia)}, pEndPsia=${AFIESERE.pEndPsia}`);
must('the AFIESERE march agrees with the closed form to better than one part in a million',
  Math.abs(afiClosed / afi.timeS - 1) < 1e-6, `marched ${e6(afi.timeS)} s, closed form ${e6(afiClosed)} s, ratio ${e12(afiClosed / afi.timeS)}`);
must('the two RADIATION_LEVELS tables in this package are equal',
  JSON.stringify(R.RADIATION_LEVELS) === JSON.stringify(SP.RADIATION_LEVELS),
  `${R.RADIATION_LEVELS.length} rows each`);
must('the point source round trips through its own inverse',
  Math.abs(POINT_ROUNDTRIP.ratio - 1) < 1e-12, `ratio ${e12(POINT_ROUNDTRIP.ratio)}`);

/* ======================================================= THE DIGEST */

w('# FC5 Relief & Flare Systems. Teaching digest.');
w('# PRECISION AND QUANTITY CLASS. Required areas (in2), pressures (psia), dimensionless ratios and fractions, velocities (ft/s), lengths (ft), radiant intensities (kW/m2), setback distances (m), blowdown times (s), temperatures (degR) and the gas coefficient C print to SIX decimals; flows (lb/hr and gpm), duties (Btu/hr), wetted areas (ft2) and masses (lb) to FOUR; measured constants and ratios of them to TWELVE; counts are whole numbers.');
w('# THE GRADED QUANTITY CLASSES, one per capstone answer key, so a grader and a reader cannot disagree about what a correct reading is worth. SIX decimals: ratio (kolocreek_critical_pressure_ratio, ogbainbiri_liquid_area_fraction), coefficient (kolocreek_gas_coefficient_c), in2 (kolocreek_gas_critical_area_in2, kolocreek_gas_subcritical_area_in2, kolocreek_liquid_area_in2, kolocreek_steam_area_in2), ftPerS (ogbainbiri_vapor_velocity_fts), ft (ogbainbiri_drum_length_ft, ogbainbiri_drum_length_wider_ft), s (gbaran_blowdown_time_s), degR (gbaran_final_temperature_degr), psia (gbaran_choked_floor_psia), kWm2 (gbaran_radiant_intensity_kwm2), m (gbaran_setback_distance_m). FOUR decimals: ft2 (ogbainbiri_wetted_area_ft2, ogbainbiri_tower_wetted_area_ft2), lb (gbaran_initial_mass_lb).');
w('# Those eighteen keys are the names of the ANSWER FIELDS and nothing else. No condition of any capstone and no graded value appears anywhere in this digest, and no lesson or question may name a capstone plant.');
w('# Field units: API 520 USC as this engine speaks them. Flow lb/hr for gas and steam and gpm for liquid, pressure psia except where a row says psig, temperature degR except where a row says degF, area in2, wetted area ft2, duty Btu/hr, velocity ft/s, drum length ft, droplet micron, heat release kW, distance m, radiant flux kW/m2, blowdown time s, mass lb.');
w('# Nothing here is read from a clock, a random number or a locale, so every line reproduces. Built with TZ pinned to UTC.');
w('# Built against engines 3bac13cd, vendored sha-identical over a closure of seven paths. Every figure below is that engine own answer at the inputs named beside it.');
w('# WHERE A CONSTANT IS NOT EXPORTED, IT IS MEASURED. This digest never types a number the engine keeps to itself: it asks the engine a question whose answer is that constant and nothing else, and says which question.');
w('# EVERY LABEL BELOW IS ASSERTED AGAINST WHAT THE CALL DID. A row labelled a refusal ran a call that refused, a row labelled critical ran a call the engine reported critical, and a row labelled converged ran a loop the engine reported converged. The build fails and writes nothing if any label and its call disagree.');
w('# THE SIX TEACHING STREAMS: ORUBIRI a gas relief case, AKASO a viscous liquid one, TEBIDABA a steam one, BENISEDE a vessel in a pool fire, ODIDI a flare knockout drum, AFIESERE a vessel depressuring into a flare. The three capstones run different plants entirely.');
w();

/* ------------------------------------------------------------- SECTION 1 */

w('# SECTION 1: What this engine sizes, and what it refuses (owned by Associate m01, and shared with Professional m01 because THE ENGINE NEVER CHOOSES THE CASE is that module own subject)');
w();
w('# App surface: the Relief & Flare Studio answers four questions over one facility. What orifice a pressure safety valve needs, what load a pool fire puts on it, what drum keeps liquid out of the flare header, and how long a vessel takes to depressure.');
w('- This engine sizes a PRESSURE RELIEF DEVICE and the flare system behind it. The word relief here always means pressure relief. A relief WELL is a drilling subject and belongs to another course.');
w('- The four sizing routes are API 520 Part I in its published USC forms: gas and vapour in both flow regimes, liquid with the published viscosity correction, steam with the Napier correction, and the API 521 fire case with its heat input evaluated at the ACTUAL relieving pressure.');
w('- The flare side is three more: droplet settling and a horizontal knockout drum, point-source radiation solved in both directions, and an adiabatic vessel blowdown march.');
w('- THE ENGINE NEVER CHOOSES THE CASE. Every sizing route takes a relief load as an input. The one route that computes its own load is the fire case, and it computes it from geometry, a drainage answer and an environment factor that the caller states.');
w();
const EXPORTS = Object.keys(R).sort();
w(`- Exports, counted by reading the module: ${EXPORTS.length}.`);
w(`  ${EXPORTS.join(', ')}`);
w();
w('# The return contract, MEASURED with typeof rather than listed.');
w('| export | typeof | returns |');
w('| --- | --- | --- |');
BARE_NUMBER_EXPORTS.forEach((name) => {
  must(`${name} is a function`, typeof R[name] === 'function', typeof R[name]);
  w(`| ${name} | function | a bare number, and NaN where it refuses |`);
});
CONSTANT_EXPORTS.forEach((name) => {
  must(`${name} is a number`, typeof R[name] === 'number', typeof R[name]);
  w(`| ${name} | number | a derived constant, ${e6(R[name])} psia |`);
});
DATA_EXPORTS.forEach((name) => {
  must(`${name} is an array`, Array.isArray(R[name]), typeof R[name]);
  w(`| ${name} | array | ${R[name].length} published rows |`);
});
const OBJ_EXPORTS = EXPORTS.filter((k2) => typeof R[k2] === 'function' && !BARE_NUMBER_EXPORTS.includes(k2));
OBJ_EXPORTS.forEach((name) => { w(`| ${name} | function | an object, carrying either a result or an \`error\` |`); });
w();
w(`- ${BARE_NUMBER_EXPORTS.length} exports return a bare number and signal a refusal with NaN. ${OBJ_EXPORTS.length} return an object. ${DATA_EXPORTS.length} are published tables and ${CONSTANT_EXPORTS.length} is a derived constant.`);
w('- THE CONTRACT EVERY OBJECT ROUTE KEEPS: either a finite result, or an object carrying an `error` string. A non-finite number with no `error` is what a caller\'s `if (r.error)` guard cannot see, and every route in this module is checked against both halves of that contract in section 26.');
w(`- ONE REFUSAL CARRIES MORE THAN AN \`error\`. selectOrifice past the largest orifice returns \`error\` and \`${ORIFICE_REFUSAL_EXTRA[0]}\`, a whole number of valves, and section 10 prints both. Every other refusal in this module carries the \`error\` alone. A caller that stops at the \`error\` throws away the only figure the refusal worked out.`);
w();

/* ------------------------------------------------------------- SECTION 2 */

w('# SECTION 2: The numbers this module stands on, measured rather than typed (shared by Associate m01 l04 and Expert m05 l01)');
w();
w('# Every figure in this section was recovered by asking the engine a question whose answer is that constant and nothing else. The question is on the row.');
w('| constant | measured | how it was asked |');
w('| --- | --- | --- |');
w(`| the default outlet pressure, psia | ${e12(ATM)} | the relieving pressure at which the branch flag turns over with p2 omitted, times the engine own critical ratio |`);
w(`| the same, a second way | ${e12(ATM_CONFIRM)} | the stated p2 that reproduces an omitted-p2 area in the SUBCRITICAL branch, where the area moves with it |`);
w(`| the same, from a different function | ${e12(ATM_BLOWDOWN)} | the blowdown march own choked-flow floor, times the critical ratio |`);
w(`| the gas coefficient leading constant | ${e12(C520)} | gasConstantC(${kp}) divided by the bracket sqrt(k (2/(k+1))^((k+1)/(k-1))), which is computable from k alone |`);
w(`| the subcritical leading constant | ${e12(C735)} | one subcritical area rearranged against its own stated inputs and the engine own F2 |`);
w(`| the liquid leading constant | ${e12(C38)} | one inviscid liquid area at unit coefficients rearranged against its own stated inputs |`);
w(`| the steam leading constant | ${e12(C515)} | one steam area below the Napier threshold at unit coefficients |`);
w(`| the pool fire constant with drainage, Btu/hr per ft2^0.82 | ${e12(C21000)} | one duty at a wetted area of ${PROBES.fireBare.wettedFt2} ft2 and an environment factor of ${PROBES.fireBare.envFactor}, where the area term is one whatever the exponent is |`);
w(`| the pool fire constant without drainage | ${e12(C34500)} | the same call with the drainage answer false |`);
w(`| the drainage factor between them | ${e12(DRAINAGE_FACTOR)} | the ratio of the two rows above |`);
w(`| the pool fire exponent | ${e12(FIRE_EXP)} | the log ratio of two duties at ${EA1} and ${EA2} ft2 over the log ratio of the areas |`);
w(`| the Kv fit intercept | ${e12(KV_A)} | 1/Kv is the sum of three terms in the Reynolds number, so THREE readings of the UNCLAMPED export solve for all three coefficients exactly. Reading them one at a time does not work: at a Reynolds number of 1e18 the inverse-root term is still ${(KV_B * 1e-9).toExponential(3)}, and subtracting an intercept carrying that residue puts the next coefficient out by more than one percent |`);
w(`| the Kv fit inverse-root term | ${e12(KV_B)} | the same three-equation solve |`);
w(`| the Kv fit inverse-three-halves term | ${e12(KV_C)} | the same three-equation solve |`);
w(`| the Kv asymptote the unclamped fit reaches | ${e12(KV_ASYMPTOTE)} | liquidKvUnclamped at 1e18 |`);
w(`| the Reynolds number the clamp starts holding Kv at one | ${e12(KV_CLAMP_RE)} | bisection on where the unclamped fit crosses one |`);
w(`| the Napier numerator slope over the denominator slope | ${e12(NAPIER.A)} | three pressures above the threshold solving the ratio of two lines. A ratio of two lines is unchanged when all four of its coefficients are scaled together, so only THREE of the four are measurable and the published quartet is one scaling of these three |`);
w(`| the Napier numerator intercept over the denominator slope | ${e12(NAPIER.B)} | the same solve |`);
w(`| the Napier denominator intercept over the denominator slope | ${e12(NAPIER.D)} | the same solve |`);
w(`| the liquid Reynolds constant | ${e12(C2800)} | the returned Reynolds number rearranged against the area it belongs to |`);
w(`| the universal gas constant the march uses, ft.lbf/(lbmol.degR) | ${e12(RGAS_UNIVERSAL)} | the mass the march reports for its own start state, rearranged |`);
w(`| the solid angle in the point source | ${e12(FOUR_PI)} | one intensity rearranged against its own stated release, fraction, transmissivity and distance |`);
w(`| the settling group at ${PROBES.settleA.dropletMicron} micron | ${e12(SETTLE_GROUP.a)} | Ud^2 C rhoV / ((rhoL - rhoV) d) from the returned pair |`);
w(`| the same at ${PROBES.settleB.dropletMicron} micron | ${e12(SETTLE_GROUP.b)} | the same, which separates the droplet size conversion from the rest |`);
w(`| the same at ${PROBES.settleC.muVCp} cp | ${e12(SETTLE_GROUP.c)} | the same, which shows the group does not carry the viscosity |`);
w(`| the squared settling coefficient times the foot per micron | ${e12(SETTLE_COEFF_SQ.coeffSq)} | the group above divided by standard gravity in ft/s2 |`);
w();
w('# Thresholds and warning edges, every one BISECTED out of the engine own behaviour rather than read off a constant.');
w('| edge | measured | what changes there |');
w('| --- | --- | --- |');
w(`| the Napier threshold, psia | ${e12(KN_THRESHOLD)} | KN leaves 1.0 |`);
w(`| the Napier unity crossing, psia | ${e12(KN_UNITY_CROSSING)} | KN returns through 1.0 from below |`);
w(`| the exported crossing, psia | ${e12(R.NAPIER_UNITY_PSIA)} | the same number, derived and EXPORTED by the engine |`);
w(`| the top of the published Napier range, psia | ${e12(KN_TOP)} | steamArea refuses |`);
w(`| the back-pressure ratio the bellows warning fires above | ${e12(BACKP_WARN_RATIO)} | gasVaporArea attaches a chart-Kb warning |`);
w(`| the Kv the envelope warning fires below | ${e12(KV_WARN)} | liquidArea attaches an off-envelope warning |`);
w(`| the latent heat the near-critical warning fires below, Btu/lb | ${e12(LATENT_WARN)} | fireReliefLoad attaches a method-breaking-down warning |`);
w(`| the drag coefficient cap | ${e12(DRAG_CAP.c)} | the drag correlation stops being evaluated |`);
w(`| the Reynolds number just inside that cap | ${e12(DRAG_CAP.re)} | the same edge, read from the engine own returned Reynolds number |`);
w(`| the L over D the go-wider note starts at | ${e12(LD_NOTE.hiLd)} | koDrumHorizontal changes its note |`);
w(`| the L over D the smaller-drum note ends at | ${e12(LD_NOTE.loLd)} | the same, from below |`);
w(`| the blowdown time limit, s | ${e12(BLOWDOWN_LIMIT)} | blowdown refuses rather than marching further |`);
w();
w('# WHAT IS COMPUTED AND WHAT IS TYPED. The closed forms this module can derive are computed: C from k, the critical ratio from k, F2 from k and the pressure ratio, Kv from the Reynolds number, KN from the pressure, the exact circular segment, the terminal-velocity balance, and the whole blowdown march. The ones published as CHARTS and TABLES are typed inputs with their references named: the balanced-bellows back-pressure factors Kb for gas and Kw for liquid, the steam superheat factor KSH, and the API 526 orifice table. Section 27 is the full audit.');
w();

/* ------------------------------------------------------------- SECTION 3 */

w('# SECTION 3: Set, overpressure, relieving pressure, and three things called back pressure (owned by Associate m01 l02 and l03)');
w();
w('# The pressures a relief calculation stands on, walked on ORUBIRI conditions. Set pressure is STATED in psig. The relieving pressure is the set pressure raised by the allowed overpressure and converted to absolute with the measured atmospheric constant from section 2.');
w(`- ORUBIRI states a set pressure of ${e6(ORUBIRI.setPsig)} psig and an overpressure of ${e6(ORUBIRI.overpressurePct)} percent.`);
w(`- Relieving pressure, derived as set times one plus the overpressure fraction plus the measured atmospheric ${e12(ATM)}: ${e6(oruP1)} psia.`);
w(`- Back pressure at the valve OUTLET, stated as ${e6(ORUBIRI.backPsig)} psig, is ${e6(oruP2)} psia absolute.`);
w(`- The back-pressure RATIO the branch decision reads: ${e6(oruP2 / oruP1)}.`);
w();
w('# The overpressure a case is allowed changes the relieving pressure and therefore the area. Same load, same valve, four allowances.');
w('| overpressure pct (stated) | relieving psia | required area in2 | branch |');
w('| --- | --- | --- | --- |');
[10, 16, 21, 25].forEach((pct) => {
  const p1 = relievingPsia(ORUBIRI.setPsig, pct);
  const r = success(`ORUBIRI at ${pct} percent overpressure`, R.gasVaporArea({ ...oruCall, p1Psia: p1 }));
  w(`| ${e6(pct)} | ${e6(p1)} | ${e6(r.areaIn2)} | ${r.critical ? 'critical' : 'subcritical'} |`);
});
w();
w('- THREE DIFFERENT QUANTITIES ARE CALLED BACK PRESSURE ELSEWHERE IN THIS PLATFORM and none of them is this one. Here it means the pressure at the relief valve OUTLET, in the header the valve discharges into. It is always written that way in this course.');
w('- The gas route is the only one that takes an absolute back pressure. The liquid route takes its two pressures in psig and works on their DIFFERENCE, so the atmospheric constant never enters it. The engine names that upstream argument for the SET pressure and this course passes the RELIEVING pressure into it, which is what API 520 sizes a liquid valve on.');
w(`- The same AKASO differential read both ways: a set pressure of ${e6(AKASO.setPsig)} psig raised by ${e6(AKASO.overpressurePct)} percent is a relieving pressure of ${e6(akaP1)} psig, and against back ${e6(AKASO.backPsig)} psig that is a differential of ${e6(akaP1 - AKASO.backPsig)} psi.`);
must('AKASO relieving and set pressures are two different numbers', akaP1 !== AKASO.setPsig,
  `relieving ${e6(akaP1)} psig against set ${e6(AKASO.setPsig)} psig`);
w();

/* ------------------------------------------------------------- SECTION 4 */

w('# SECTION 4: Gas and vapour, and the branch the back pressure decides (owned by Associate m02)');
w();
w('# The coefficient C and the critical ratio are both functions of the isentropic exponent alone. Walked across the range the standard covers.');
w('| k (stated) | C | critical pressure ratio | F2 at a ratio of 0.8 |');
w('| --- | --- | --- | --- |');
K_SWEEP.forEach((k) => {
  const f2 = R.subcriticalF2({ k, r: 0.8 });
  w(`| ${e6(k)} | ${e6(R.gasConstantC(k))} | ${e6(R.criticalPressureRatio(k))} | ${e6(f2)} |`);
});
w();
w('# The branch. ORUBIRI load and ORUBIRI valve, with the back pressure walked as a RATIO of the relieving pressure, so the rows carry no pressure of their own. The two crossing rows are DERIVED from the engine own critical ratio and sit either side of it.');
w(`- ORUBIRI critical ratio at k = ${e6(ORUBIRI.k)}: ${e6(oru.criticalRatio)}.`);
w('| back pressure ratio (stated) | branch | required area in2 | F2 where subcritical | warning |');
w('| --- | --- | --- | --- | --- |');
const oruBranchRows = ORU_RATIO_WALK.map((ratio) => {
  const p2 = ratio * oruP1;
  const r = success(`ORUBIRI at a back-pressure ratio of ${ratio}`, R.gasVaporArea({ ...oruCall, p2Psia: p2 }));
  const f2 = r.critical ? null : R.subcriticalF2({ k: ORUBIRI.k, r: ratio });
  w(`| ${e6(ratio)} | ${r.critical ? 'critical' : 'subcritical'} | ${e6(r.areaIn2)} | ${f2 === null ? 'n/a' : e6(f2)} | ${r.warning ? 'yes' : 'no'} |`);
  return { ratio, critical: r.critical, areaIn2: r.areaIn2 };
});
w();
// THE LENGTH OF THE RUN IS COUNTED, NOT TYPED. This bullet said "the first five
// rows" while SEVEN consecutive rows printed the same area. A count that
// describes rows on the same page is read off those rows here.
const choke = (() => {
  let n = 1;
  while (n < oruBranchRows.length
    && e12(oruBranchRows[n].areaIn2) === e12(oruBranchRows[0].areaIn2)) n += 1;
  return n;
})();
must('the run of identical critical areas is longer than one row and shorter than the table',
  choke > 1 && choke < oruBranchRows.length, `${choke} of ${oruBranchRows.length} rows`);
must('every row in the identical run is one the engine called critical',
  oruBranchRows.slice(0, choke).every((r) => r.critical === true), `${choke} rows`);
w(`- IN CRITICAL FLOW THE AREA DOES NOT MOVE WITH THE BACK PRESSURE AT ALL. Read the first ${choke} rows: the required area is identical across them, because the flow through the throat is set by the upstream condition once the downstream pressure is low enough. That is the whole meaning of choked.`);
w(`- The crossing is the measured critical ratio ${e6(oru.criticalRatio)}.`);
w(`- The two probe rows are chosen either side of that critical ratio, the last critical row at ${e6(CRIT_LO)} and the first subcritical one at ${e6(CRIT_HI)}, and the areas across the crossing are printed so the size of the step is visible rather than asserted.`);
w();
w('# Kb IS IGNORED IN SUBCRITICAL FLOW, and the engine says so rather than leaving it to be discovered. The same call at two different balanced-bellows factors, on both branches.');
w('| branch | back pressure ratio (stated) | Kb (stated) | required area in2 | warning present |');
w('| --- | --- | --- | --- | --- |');
[[0.20, 1.0], [0.20, 0.72], [0.80, 1.0], [0.80, 0.72]].forEach(([ratio, kb]) => {
  const r = success(`ORUBIRI at ratio ${ratio} and Kb ${kb}`, R.gasVaporArea({ ...oruCall, p2Psia: ratio * oruP1, kb }));
  w(`| ${r.critical ? 'critical' : 'subcritical'} | ${e6(ratio)} | ${e6(kb)} | ${e6(r.areaIn2)} | ${r.warning ? 'yes' : 'no'} |`);
});
const subKb1 = R.gasVaporArea({ ...oruCall, p2Psia: 0.8 * oruP1, kb: 1.0 }).areaIn2;
const subKb2 = R.gasVaporArea({ ...oruCall, p2Psia: 0.8 * oruP1, kb: 0.72 }).areaIn2;
must('the subcritical area is unchanged by Kb', subKb1 === subKb2, `${e12(subKb1)} and ${e12(subKb2)}`);
w(`- The two subcritical rows are IDENTICAL to twelve decimals, ${e12(subKb1)} in2 and ${e12(subKb2)} in2, and the engine attaches a warning on the second saying the typed Kb was ignored.`);
w(`- The two critical rows are NOT identical, ${e6(R.gasVaporArea({ ...oruCall, p2Psia: 0.2 * oruP1, kb: 1.0 }).areaIn2)} in2 and ${e6(R.gasVaporArea({ ...oruCall, p2Psia: 0.2 * oruP1, kb: 0.72 }).areaIn2)} in2, because in critical flow Kb divides the area.`);
w();
w('# ORUBIRI, the whole gas case.');
w(`- Stated: ${e6(ORUBIRI.wLbHr)} lb/hr, set ${e6(ORUBIRI.setPsig)} psig, ${e6(ORUBIRI.overpressurePct)} percent overpressure, back ${e6(ORUBIRI.backPsig)} psig, ${e6(ORUBIRI.tF)} degF, molecular weight ${e6(ORUBIRI.mw)}, z ${e6(ORUBIRI.z)}, k ${e6(ORUBIRI.k)}, Kd ${e6(ORUBIRI.kd)}, Kb ${e6(ORUBIRI.kb)}, Kc ${e6(ORUBIRI.kc)}.`);
w(`- Relieving pressure ${e6(oruP1)} psia, back pressure ${e6(oruP2)} psia, branch ${oru.critical ? 'critical' : 'subcritical'}, critical ratio ${e6(oru.criticalRatio)}.`);
w(`- Required area ${e6(oru.areaIn2)} in2. Orifice ${oruOrifice.orifice} at ${e6(oruOrifice.areaIn2)} in2, margin ${e6(oruOrifice.margin)}.`);
w(`- Warning: ${oru.warning === null ? 'none. The back-pressure ratio is ' + e6(oruP2 / oruP1) + ', below the measured ' + e6(BACKP_WARN_RATIO) + ' at which the chart-Kb warning fires' : oru.warning}`);
w();

/* ------------------------------------------------------------- SECTION 5 */

w('# SECTION 5: The published gas cases (owned by Associate m02 l05)');
w();
w(`# ${GOLD.gas.length} published gas rows, every input and every answer read from the golden file and re-run through the engine. The re-run column is the engine own answer at the golden inputs, so a reader can see the published case and the live engine agree.`);
w('| golden flow lb/hr | golden p1 psia | golden p2 psia | golden tR | golden mw | golden z | golden k | golden Kd | golden Kb | golden Kc | published area in2 | engine area in2 | relative difference | branch |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.gas.forEach((g, i) => {
  const r = success(`the published gas row ${i + 1}`, R.gasVaporArea(g));
  const d = agree(`the published gas row ${i + 1}`, r.areaIn2, g.areaIn2, 2e-3);
  w(`| ${r4(g.wLbHr)} | ${e6(g.p1Psia)} | ${e6(g.p2Psia)} | ${e6(g.tR)} | ${e6(g.mw)} | ${e6(g.z)} | ${e6(g.k)} | ${e6(g.kd)} | ${e6(g.kb)} | ${e6(g.kc)} | ${e6(g.areaIn2)} | ${e6(r.areaIn2)} | ${d} | ${g.critical ? 'critical' : 'subcritical'} |`);
});
w();
w('- THE VALIDATION ORACLE DOES NOT RESTATE THIS ROUTE. For the critical rows it derives the isentropic nozzle mass flux from the gas constant, the molecular weight, the temperature and the pressure in absolute SI, so the USC leading constant is CHECKED against a different derivation rather than repeated. For the subcritical rows it integrates the subcritical nozzle flux from the isentropic expansion, so F2 is checked rather than restated. For the critical ratio it takes the ARGMAX of that flux over the throat ratio by golden-section search.');
// THE COUNT IS READ OFF THE GOLDEN FILE, and the defaults it is counted
// against are the MEASURED ones above. This line used to say "Three" as a word
// typed in this generator: the numeric-literal gate sweeps numbers and could
// not see a spelled one, and the movement gate compares figures the data
// produced and this was not one. Exactly ONE row is away from the defaults.
const offDefault = GOLD.gas.filter((g) => g.kd !== GAS_DEFAULTS.kd
  || g.kb !== GAS_DEFAULTS.kb || g.kc !== GAS_DEFAULTS.kc);
must('the published gas rows are neither all at the engine defaults nor all away from them',
  offDefault.length > 0 && offDefault.length < GOLD.gas.length,
  `${offDefault.length} of ${GOLD.gas.length} away from the defaults`);
w(`- Rows carrying certified coefficients away from the engine own defaults: ${offDefault.length} of the ${GOLD.gas.length} rows. Those defaults are the MEASURED Kd ${e6(GAS_DEFAULTS.kd)}, Kb ${e6(GAS_DEFAULTS.kb)} and Kc ${e6(GAS_DEFAULTS.kc)} of section 2 rather than a figure typed here, and a row away from all three is the only way a published case can check that the coefficients divide rather than multiply.`);
w(`- The row away from the defaults is the one at ${r4(offDefault[0].wLbHr)} lb/hr, at Kd ${e6(offDefault[0].kd)}, Kb ${e6(offDefault[0].kb)} and Kc ${e6(offDefault[0].kc)}.`);
w();

/* ------------------------------------------------------------- SECTION 6 */

w('# SECTION 6: Liquid, the Kv loop, and the band each of its terms is worth anything in (owned by Associate m03)');
w();
w('# The liquid route needs the AREA to find the Reynolds number, and the Reynolds number to find the correction that sets the area. The engine iterates and reports whether it converged, in how many passes, and on what residual.');
w(`- AKASO states ${e6(AKASO.qGpm)} gpm, set ${e6(AKASO.setPsig)} psig, ${e6(AKASO.overpressurePct)} percent overpressure, back ${e6(AKASO.backPsig)} psig, specific gravity ${e6(AKASO.sg)}, viscosity ${e6(AKASO.muCp)} cp, Kd ${e6(AKASO.kd)}, Kw ${e6(AKASO.kw)}, Kc ${e6(AKASO.kc)}.`);
w(`- Inviscid, with the viscosity left out entirely: area ${e6(akaInviscid.areaIn2)} in2, Kv ${e6(akaInviscid.kv)}, Reynolds ${akaInviscid.reynolds}, iterations ${akaInviscid.kvIterations}.`);
w(`- Viscous: area ${e6(aka.areaIn2)} in2, Kv ${e6(aka.kv)}, Reynolds ${e6(aka.reynolds)}, iterations ${aka.kvIterations}, converged ${aka.kvConverged}, residual ${e12(aka.kvResidual)}.`);
w(`- The ratio of the two areas: ${e12(aka.areaIn2 / akaInviscid.areaIn2)}.`);
w(`- What ONE pass would have given, built from the measured leading constants of section 2 and the engine own Kv function: area ${e6(akaOnePass.areaIn2)} in2 at Kv ${e6(akaOnePass.kv)} and Reynolds ${e6(akaOnePass.reynolds)}. Ratio of the converged area to the one-pass area: ${e12(aka.areaIn2 / akaOnePass.areaIn2)}.`);
w();
w('# The same case with the viscosity walked. The iteration count is the engine own report.');
w('| viscosity cp (stated) | area in2 | Kv | Reynolds | iterations | converged | warning |');
w('| --- | --- | --- | --- | --- | --- | --- |');
AKASO_MU_SWEEP.forEach((mu) => {
  const r = success(`AKASO at ${mu} cp`, R.liquidArea({ ...akaBase, muCp: mu }));
  w(`| ${e6(mu)} | ${e6(r.areaIn2)} | ${e6(r.kv)} | ${r.reynolds === null ? 'n/a' : e6(r.reynolds)} | ${r.kvIterations} | ${r.kvConverged} | ${r.warning ? 'yes' : 'no'} |`);
});
w();
w('# THE KV FIT, TERM BY TERM. 1/Kv is the sum of three terms, and the only way to say one of them has a band is to print what each is worth where. The three coefficients are the MEASURED ones of section 2.');
w('| Reynolds (stated) | Kv clamped | Kv unclamped | intercept term | inverse-root term | inverse-three-halves term | the last term as a fraction of the sum |');
w('| --- | --- | --- | --- | --- | --- | --- |');
KV_RE_SWEEP.forEach((re) => {
  const t1 = KV_A;
  const t2 = KV_B / Math.sqrt(re);
  const t3 = KV_C / re ** 1.5;
  w(`| ${e6(re)} | ${e6(R.liquidKv(re))} | ${e6(R.liquidKvUnclamped(re))} | ${e6(t1)} | ${e6(t2)} | ${e6(t3)} | ${e6(t3 / (t1 + t2 + t3))} |`);
});
w();
w(`- THE CORRECTION IS CLAMPED AT ONE. The unclamped fit rises through one and asymptotes to ${e12(KV_ASYMPTOTE)}, which would let a correction for viscous drag ADD capacity. The clamp holds it at 1.0 above a Reynolds number of ${e12(KV_CLAMP_RE)}, and \`liquidKvUnclamped\` is exported so the asymptote stays inspectable. The clamp is a stated convention of this engine.`);
w(`- The envelope warning fires below a Kv of ${e12(KV_WARN)}, which the sweep above crosses.`);
w('- THE FIT IS HELD FOR LITERATURE. Its three coefficients are an empirical fit that no route in this package can derive, and the validation oracle SHARES them on purpose and says so in its own header. Section 28 is where that is audited. Nothing graded in this course rests on them.');
w();

/* ------------------------------------------------------------- SECTION 7 */

w('# SECTION 7: The published liquid cases (owned by Associate m03 l05)');
w();
w(`# ${GOLD.liquid.length} published liquid rows, re-run through the engine.`);
w('| golden gpm | golden p1 psig | golden p2 psig | golden sg | golden viscosity cp | golden Kd | golden Kv | golden Reynolds | published area in2 | engine area in2 | relative difference |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.liquid.forEach((g, i) => {
  const r = success(`the published liquid row ${i + 1}`, R.liquidArea(g));
  const d = agree(`the published liquid row ${i + 1}`, r.areaIn2, g.areaIn2, 1e-3);
  w(`| ${r4(g.qGpm)} | ${e6(g.p1Psig)} | ${e6(g.p2Psig)} | ${e6(g.sg)} | ${e6(g.muCp)} | ${e6(g.kd)} | ${e6(g.kv)} | ${g.reynolds === null ? 'n/a' : e6(g.reynolds)} | ${e6(g.areaIn2)} | ${e6(r.areaIn2)} | ${d} |`);
});
const lowRe = GOLD.liquid.filter((g) => g.reynolds !== null && g.reynolds < 200);
must('the published liquid set carries a row below a Reynolds number of 200', lowRe.length >= 1, `${lowRe.length} row(s)`);
w();
w(`- ${lowRe.length} of the ${GOLD.liquid.length} rows sits below a Reynolds number of 200, at ${e6(lowRe[0].reynolds)}. That row exists so the inverse-three-halves term of the fit is worth something: read the term table in section 6 at that Reynolds number and compare the fraction there with the fraction at the other rows.`);
w(`- The oracle derives the ${e12(C2800)} of the Reynolds relation from rho u D over mu in SI with D taken as sqrt(4A/pi), so that constant is checked. It derives NOTHING for the Kv fit itself.`);
w(`- The oracle checks the ${e12(C38)} of the area equation against the published SI form of the same equation.`);
w();

/* ------------------------------------------------------------- SECTION 8 */

w('# SECTION 8: Steam, Napier, and both crossings of unity (owned by Associate m04)');
w();
w('# The Napier correction is 1.0 up to a published threshold, drops BELOW one above it, and returns through one at a pressure the engine derives and exports. Between those two pressures the correction makes the required area LARGER.');
w(`- The threshold, bisected: ${e12(KN_THRESHOLD)} psia. The crossing back through unity, bisected: ${e12(KN_UNITY_CROSSING)} psia. The engine exported constant for the same crossing: ${e12(R.NAPIER_UNITY_PSIA)} psia. The top of the published range, bisected: ${e12(KN_TOP)} psia.`);
w('| relieving psia (stated) | KN | required area in2 at the TEBIDABA load | warning |');
w('| --- | --- | --- | --- |');
KN_P_SWEEP.forEach((p) => {
  const r = R.steamArea({ ...tebCall, p1Psia: p });
  if (r.error) { refusal(`the steam route at ${p} psia`, (x) => R.steamArea(x), { ...tebCall, p1Psia: p }); w(`| ${e6(p)} | refused | refused | ${r.error} |`); return; }
  success(`the steam route at ${p} psia`, r);
  w(`| ${e6(p)} | ${e6(r.kn)} | ${e6(r.areaIn2)} | ${r.warning ? 'yes' : 'no'} |`);
});
w();
const knJustBelow = R.steamKn(KN_THRESHOLD - 1e-6);
const knJustAbove = R.steamKn(KN_THRESHOLD + 1e-6);
must('KN steps at the threshold', knJustBelow !== knJustAbove, `${e12(knJustBelow)} then ${e12(knJustAbove)}`);
w(`- THE CORRECTION STEPS RATHER THAN SLIDING. A millionth of a psi below the threshold KN is ${e12(knJustBelow)} and a millionth above it KN is ${e12(knJustAbove)}, a step of ${e12(knJustAbove - knJustBelow)} across two millionths of a psi. The required area moves by the reciprocal of that.`);
w(`- BETWEEN THE THRESHOLD AND THE CROSSING KN IS BELOW ONE, so the required area is LARGER than the uncorrected one. Read the rows between ${e12(KN_THRESHOLD)} and ${e12(KN_UNITY_CROSSING)} psia above and compare the areas with the rows below the threshold at the same load.`);
w('- THE THRESHOLD AND THE TOP OF THE RANGE ARE PUBLISHED BOUNDARIES. This package can derive neither, and the suite pins both as behaviour. The FIT between them is checked against the standard own SI statement.');
w();
w('# TEBIDABA, the whole steam case.');
w(`- Stated: ${r4(TEBIDABA.wLbHr)} lb/hr, set ${e6(TEBIDABA.setPsig)} psig, ${e6(TEBIDABA.overpressurePct)} percent overpressure, Kd ${e6(TEBIDABA.kd)}, Kb ${e6(TEBIDABA.kb)}, Kc ${e6(TEBIDABA.kc)}, KSH ${e6(TEBIDABA.ksh)} saturated.`);
w(`- Relieving pressure ${e6(tebP1)} psia, KN ${e6(teb.kn)}, required area ${e6(teb.areaIn2)} in2, orifice ${tebOrifice.orifice} at ${e6(tebOrifice.areaIn2)} in2, margin ${e6(tebOrifice.margin)}.`);
w(`- KSH is the published superheat TABLE and is a typed input. The same case at a superheated KSH of 0.83: area ${e6(R.steamArea({ ...tebCall, ksh: 0.83 }).areaIn2)} in2.`);
w();

/* ------------------------------------------------------------- SECTION 9 */

w('# SECTION 9: The published steam cases (owned by Associate m04 l04)');
w();
w(`# ${GOLD.steam.length} published steam rows, re-run through the engine.`);
w('| golden flow lb/hr | golden p1 psia | golden Kd | golden KSH | published KN | published area in2 | engine area in2 | relative difference | engine KN |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.steam.forEach((g, i) => {
  const r = success(`the published steam row ${i + 1}`, R.steamArea(g));
  const d = agree(`the published steam row ${i + 1}`, r.areaIn2, g.areaIn2, 1e-3);
  w(`| ${r4(g.wLbHr)} | ${e6(g.p1Psia)} | ${e6(g.kd)} | ${e6(g.ksh)} | ${e6(g.kn)} | ${e6(g.areaIn2)} | ${e6(r.areaIn2)} | ${d} | ${e6(r.kn)} |`);
});
const napierActive = GOLD.steam.filter((g) => g.kn !== 1.0);
const napierBand = GOLD.steam.filter((g) => g.kn < 1.0);
must('the published steam set carries more than one Napier-active row', napierActive.length > 1, `${napierActive.length} rows`);
must('the published steam set carries a row inside the band where KN is below one', napierBand.length >= 1, `${napierBand.length} row(s)`);
w();
w(`- ${napierActive.length} of the ${GOLD.steam.length} rows have the Napier correction active, at ${napierActive.map((g) => e6(g.p1Psia)).join(', ')} psia. ${napierBand.length} of them sits INSIDE the band where the correction is below one, at ${napierBand.map((g) => e6(g.p1Psia)).join(', ')} psia, where the correction makes the valve bigger.`);
w(`- The oracle checks the ${e12(C515)} of the area equation against the published SI form and the SI statement of Napier, so the fit is two published routes meeting. It cannot check the KSH table, which is typed.`);
w();

/* ------------------------------------------------------------ SECTION 10 */

w('# SECTION 10: From a required area to a standard orifice (owned by Associate m05)');
w();
w(`# The API 526 ladder, ${R.API_ORIFICES.length} standard orifices, read from the engine own exported table.`);
w('| letter | area in2 | ratio to the one below |');
w('| --- | --- | --- |');
R.API_ORIFICES.forEach((o, i) => {
  const prev = i === 0 ? null : R.API_ORIFICES[i - 1].areaIn2;
  w(`| ${o.orifice} | ${e6(o.areaIn2)} | ${prev === null ? 'n/a' : e6(o.areaIn2 / prev)} |`);
});
w();
w('- THE LADDER IS NOT GEOMETRIC. The ratio column is the evidence: read it top to bottom rather than assuming a constant step.');
w('- THE TABLE IS A PUBLISHED TABLE. This package cannot derive a single one of these fourteen areas. It checks the SELECTION BEHAVIOUR instead: that the smallest orifice at or above the required area is the one returned, that a required area exactly equal to a listed area takes that orifice rather than the next one, and that anything past the largest refuses. Nothing graded in this course is an orifice letter or a margin.');
w();
w('# Selection walked across and ON the boundaries. The rows at an exact listed area are the ones that decide whether the comparison is at-or-above or strictly-above.');
w('| required area in2 (stated) | orifice | orifice area in2 | margin | note |');
w('| --- | --- | --- | --- | --- |');
// EVERY PROBE MUST BE READABLE AT THE PRECISION THIS PAGE PRINTS. The probe
// just above G used to be 0.5030001, which prints as 0.503000 at six decimals,
// so the table carried two rows both reading 0.503000, one returning G and one
// returning H. The boundary the rows exist to demonstrate was unreadable
// exactly where it was being demonstrated. 0.503001 is the same demonstration
// and survives the printing.
const ORIFICE_PROBES = [0.05, 0.11, 0.110001, 0.5, 0.503, 0.503001, 1.287, 2.0, 6.38, 11.05, 16.0, 25.999999, 26.0];
must('no two orifice probes print the same stated area at six decimals',
  new Set(ORIFICE_PROBES.map(e6)).size === ORIFICE_PROBES.length,
  `${new Set(ORIFICE_PROBES.map(e6)).size} distinct of ${ORIFICE_PROBES.length}`);
ORIFICE_PROBES.forEach((a) => {
  const r = success(`the orifice selection at a required area of ${a} in2`, R.selectOrifice(a));
  w(`| ${e6(a)} | ${r.orifice} | ${e6(r.areaIn2)} | ${e6(r.margin)} | ${a === r.areaIn2 ? 'exactly a listed area' : ''} |`);
});
w();
w(`# Past the largest orifice the engine refuses and says how many valves the area needs. THE REFUSAL CARRIES A SECOND KEY BESIDE \`error\`, and its name, read off the returned object rather than listed, is \`${ORIFICE_REFUSAL_EXTRA.join('` and `')}\`.`);
w(`| required area in2 (stated) | refusal | ${ORIFICE_REFUSAL_EXTRA[0]}, the engine own second key |`);
w('| --- | --- | --- |');
[26.000001, 26.0001, 40, 79, 105].forEach((a) => {
  const r = refusal(`the orifice selection at a required area of ${a} in2`, R.selectOrifice, a);
  w(`| ${e6(a)} | ${r.error} | ${r.multipleOfT} |`);
});
w();
w('- The refusal PRINTS THE FIGURE THAT MADE IT TRUE. Read the 26.0001 row: the message carries the required area to eight significant figures, so the statement and its evidence agree on the page.');
w();
w('# The three teaching streams, each from its own required area to its own letter.');
w('| stream | fluid | required area in2 | orifice | orifice area in2 | margin |');
w('| --- | --- | --- | --- | --- | --- |');
w(`| ORUBIRI | gas | ${e6(oru.areaIn2)} | ${oruOrifice.orifice} | ${e6(oruOrifice.areaIn2)} | ${e6(oruOrifice.margin)} |`);
w(`| AKASO | liquid | ${e6(aka.areaIn2)} | ${akaOrifice.orifice} | ${e6(akaOrifice.areaIn2)} | ${e6(akaOrifice.margin)} |`);
w(`| TEBIDABA | steam | ${e6(teb.areaIn2)} | ${tebOrifice.orifice} | ${e6(tebOrifice.areaIn2)} | ${e6(tebOrifice.margin)} |`);
w();
w('# What it takes to move a letter. The ORUBIRI load walked until the selection changes, and the load at which it does, bisected.');
const oruAreaAt = (wLbHr) => R.gasVaporArea({ ...oruCall, wLbHr }).areaIn2;
const oruLetterAt = (wLbHr) => R.selectOrifice(oruAreaAt(wLbHr)).orifice;
// THE BRACKET IS WALKED OUT UNTIL IT HOLDS THE ROOT, not assumed to. This
// bisection ran from half to two and a half times the stated load, and the
// selection is a DIFFERENT letter at each of those ends, J below and P above,
// so the predicate was false at both and there was no root between them. The
// bisect helper returned NaN, correctly, and the digest printed "the load at
// which it changes is NaN lb/hr" and "the required area is undefined in2" as
// measurements. A bracket is now grown from the stated load by a fixed step
// until the letter first changes, and both ends are asserted before bisecting.
const oruBracket = (() => {
  const here = oruOrifice.orifice;
  let hi = ORUBIRI.wLbHr;
  for (let i = 0; i < 200 && oruLetterAt(hi) === here; i += 1) hi *= 1.05;
  return { lo: ORUBIRI.wLbHr, hi, steps: Math.round(Math.log(hi / ORUBIRI.wLbHr) / Math.log(1.05)) };
})();
must('the bisection bracket holds the letter change it is asked for',
  oruLetterAt(oruBracket.lo) === oruOrifice.orifice
  && oruLetterAt(oruBracket.hi) !== oruOrifice.orifice,
  `${oruLetterAt(oruBracket.lo)} at ${r4(oruBracket.lo)} lb/hr and ${oruLetterAt(oruBracket.hi)} at ${r4(oruBracket.hi)} lb/hr`);
const oruFlip = bisect(oruBracket.lo, oruBracket.hi, (x) => oruLetterAt(x) === oruOrifice.orifice);
must('the bisected load is a finite number', Number.isFinite(oruFlip), String(oruFlip));
must('the bisected load lands on the orifice area it should',
  Math.abs(oruAreaAt(oruFlip) - oruOrifice.areaIn2) < oruOrifice.areaIn2 * 1e-9,
  `${e12(oruAreaAt(oruFlip))} against the ${oruOrifice.orifice} orifice at ${e12(oruOrifice.areaIn2)}`);
w(`- At ${r4(ORUBIRI.wLbHr)} lb/hr the selection is ${oruOrifice.orifice}. THE BRACKET IS GROWN RATHER THAN ASSUMED: the load is multiplied by ${e6(1.05)} until the letter changes, which takes ${oruBracket.steps} steps and ends at ${r4(oruBracket.hi)} lb/hr, where the letter is ${oruLetterAt(oruBracket.hi)}. A bisection needs the answer inside its bracket and cannot tell you when it is not.`);
w(`- Bisected inside that bracket, the load at which the letter changes is ${r4(oruFlip)} lb/hr, where the required area is ${e6(oruAreaAt(oruFlip))} in2. That is the ${oruOrifice.orifice} orifice area itself, which is the arithmetic the selection rule makes unavoidable.`);
w(`- The ratio of that load to the stated one: ${e12(oruFlip / ORUBIRI.wLbHr)}. In critical flow the required area is proportional to the load, so that ratio IS the margin of the ORUBIRI selection, printed as ${e6(oruOrifice.margin)} in the table above.`);
must('the letter-change load is the stated load times the margin',
  Math.abs(oruFlip / ORUBIRI.wLbHr - oruOrifice.margin) < oruOrifice.margin * 1e-9,
  `${e12(oruFlip / ORUBIRI.wLbHr)} against ${e12(oruOrifice.margin)}`);
w();

/* ------------------------------------------------------------ SECTION 11 */

w('# SECTION 11: One Associate scenario, end to end (owned by Associate m06)');
w();
w('# ORUBIRI, AKASO and TEBIDABA are three relief cases on one train. Every figure below appears in a section above, gathered here so a reader can see the whole shape at once.');
w('| step | ORUBIRI (gas) | AKASO (liquid) | TEBIDABA (steam) |');
w('| --- | --- | --- | --- |');
w(`| the load, stated | ${r4(ORUBIRI.wLbHr)} lb/hr | ${r4(AKASO.qGpm)} gpm | ${r4(TEBIDABA.wLbHr)} lb/hr |`);
w(`| the set pressure, stated psig | ${e6(ORUBIRI.setPsig)} | ${e6(AKASO.setPsig)} | ${e6(TEBIDABA.setPsig)} |`);
w(`| the relieving pressure | ${e6(oruP1)} psia | ${e6(akaP1)} psig | ${e6(tebP1)} psia |`);
w(`| the computed factor | critical ratio ${e6(oru.criticalRatio)} | Kv ${e6(aka.kv)} | KN ${e6(teb.kn)} |`);
w(`| the typed factor | Kb ${e6(ORUBIRI.kb)} | Kw ${e6(AKASO.kw)} | KSH ${e6(TEBIDABA.ksh)} |`);
w(`| the certified factor, stated | Kd ${e6(ORUBIRI.kd)} | Kd ${e6(AKASO.kd)} | Kd ${e6(TEBIDABA.kd)} |`);
w(`| required area in2 | ${e6(oru.areaIn2)} | ${e6(aka.areaIn2)} | ${e6(teb.areaIn2)} |`);
w(`| orifice | ${oruOrifice.orifice} | ${akaOrifice.orifice} | ${tebOrifice.orifice} |`);
w(`| margin | ${e6(oruOrifice.margin)} | ${e6(akaOrifice.margin)} | ${e6(tebOrifice.margin)} |`);
w();
w('- EACH ROUTE HAS EXACTLY ONE COMPUTED CORRECTION AND EXACTLY ONE TYPED ONE. That is the shape of API 520 Part I as this engine implements it, and it is the Associate reading: which of the numbers in front of you did the engine work out, and which one did somebody copy off a chart.');
w('- THE CERTIFIED DISCHARGE COEFFICIENT IS ALWAYS STATED. It is the valve manufacturer own certified figure and the engine defaults are placeholders for it. Every coefficient in this module is validated on the way in: a certified coefficient is a fraction of an ideal, above zero and no more than one.');
w();

/* ------------------------------------------------------------ SECTION 12 */

w('# SECTION 12: The wetted area in both orientations, exactly (owned by Professional m02)');
w();
w('# The fire case is the one route that computes its own relief load, and it starts from geometry. A horizontal vessel wetted to a level is an exact circular segment: the wetted arc times the length. A vertical one is the circumference times the wetted height.');
w(`- BENISEDE states a horizontal vessel ${e6(BENISEDE.diameterFt)} ft across and ${e6(BENISEDE.lengthFt)} ft long, at a liquid level of ${e6(BENISEDE.liquidLevelFt)} ft.`);
w(`- Wetted area lying down: ${r4(benWet.areaFt2)} ft2. Read standing up at the same level: ${r4(benVert.areaFt2)} ft2. Ratio: ${e12(benWet.areaFt2 / benVert.areaFt2)}.`);
w();
w('# The level walked from empty to full, both orientations, on the same vessel.');
w('| level ft (stated) | level as a fraction of the diameter | horizontal wetted ft2 | vertical wetted ft2 | horizontal over vertical |');
w('| --- | --- | --- | --- | --- |');
BENISEDE_LEVEL_SWEEP.forEach((lv) => {
  const h = success(`the horizontal wetted area at ${lv} ft`, R.wettedAreaFt2({ orientation: 'horizontal', diameterFt: BENISEDE.diameterFt, lengthFt: BENISEDE.lengthFt, liquidLevelFt: lv }));
  const v = success(`the vertical wetted area at ${lv} ft`, R.wettedAreaFt2({ orientation: 'vertical', diameterFt: BENISEDE.diameterFt, lengthFt: BENISEDE.lengthFt, liquidLevelFt: lv }));
  w(`| ${e6(lv)} | ${e6(lv / BENISEDE.diameterFt)} | ${r4(h.areaFt2)} | ${r4(v.areaFt2)} | ${e6(h.areaFt2 / v.areaFt2)} |`);
});
w();
const halfFull = success('the horizontal wetted area at half the diameter', R.wettedAreaFt2({ orientation: 'horizontal', diameterFt: BENISEDE.diameterFt, lengthFt: BENISEDE.lengthFt, liquidLevelFt: BENISEDE.diameterFt / 2 }));
const halfAnalytic = (Math.PI / 2) * BENISEDE.diameterFt * BENISEDE.lengthFt;
must('the half-full horizontal wetted area is half the cylinder surface', Math.abs(halfFull.areaFt2 / halfAnalytic - 1) < 1e-12, `${e12(halfFull.areaFt2)} against ${e12(halfAnalytic)}`);
w(`- HALF FULL IS THE ONE CASE WITH AN ANALYTIC ANSWER. At a level of exactly ${e6(BENISEDE.diameterFt / 2)} ft the wetted area is ${r4(halfFull.areaFt2)} ft2, and half the lateral surface of the cylinder is ${r4(halfAnalytic)} ft2. Ratio ${e12(halfFull.areaFt2 / halfAnalytic)}. Any geometry that is wrong away from half full can still be exactly right there, which is why the sweep above walks the whole level.`);
w(`- FULL, at a level of ${e6(BENISEDE.diameterFt)} ft, the horizontal area is ${r4(R.wettedAreaFt2({ orientation: 'horizontal', diameterFt: BENISEDE.diameterFt, lengthFt: BENISEDE.lengthFt, liquidLevelFt: BENISEDE.diameterFt }).areaFt2)} ft2, which is the whole lateral surface. The level is clamped at the diameter, so a level above it returns the same figure.`);
w();
// WHAT A FOOT OF LEVEL BUYS, COMPUTED. The level sweep above is printed at
// uneven spacings, so reading a steepness off it means dividing two rows the
// digest never divided, and a lesson that did exactly that concluded the
// sweep buys LESS near the top. It buys the same as the bottom. Equal bands,
// printed, so the shape is read rather than inferred (FC5 repair).
w('# WHAT A FOOT OF LEVEL BUYS. The sweep above is printed at uneven spacings, so its steepness cannot be read off it by eye. The same vessel in EQUAL bands of a tenth of its diameter, each band an engine return at each of its two ends.');
w('| band ft | horizontal wetted gained ft2 | gained per foot ft2 |');
w('| --- | --- | --- |');
const bandFt = BENISEDE.diameterFt / 10;
const bandGain = [];
for (let i = 0; i < 10; i += 1) {
  const lo = i * bandFt; const hi = (i + 1) * bandFt;
  const a = success(`the horizontal wetted area at ${lo} ft`, R.wettedAreaFt2({ orientation: 'horizontal', diameterFt: BENISEDE.diameterFt, lengthFt: BENISEDE.lengthFt, liquidLevelFt: lo }));
  const b = success(`the horizontal wetted area at ${hi} ft`, R.wettedAreaFt2({ orientation: 'horizontal', diameterFt: BENISEDE.diameterFt, lengthFt: BENISEDE.lengthFt, liquidLevelFt: hi }));
  bandGain.push(b.areaFt2 - a.areaFt2);
  w(`| ${e6(lo)} to ${e6(hi)} | ${r4(b.areaFt2 - a.areaFt2)} | ${r4((b.areaFt2 - a.areaFt2) / bandFt)} |`);
}
const mirrored = bandGain.every((g, i) => Math.abs(g - bandGain[9 - i]) < 1e-9);
const maxGain = Math.max(...bandGain); const minGain = Math.min(...bandGain);
must('the band gains are mirror-symmetric about half full', mirrored, `${r4(bandGain[0])} against ${r4(bandGain[9])}`);
must('the steepest band is the bottom one and it ties with the top one', Math.abs(bandGain[0] / maxGain - 1) < 1e-12 && Math.abs(bandGain[9] / maxGain - 1) < 1e-12, `${r4(bandGain[0])} and ${r4(bandGain[9])} against a maximum of ${r4(maxGain)}`);
must('the flattest bands are the two either side of half full', Math.abs(bandGain[4] / minGain - 1) < 1e-12 && Math.abs(bandGain[5] / minGain - 1) < 1e-12, `${r4(bandGain[4])} and ${r4(bandGain[5])} against a minimum of ${r4(minGain)}`);
w();
w(`- THE SWEEP IS STEEPEST AT BOTH ENDS AND IT IS EQUALLY STEEP AT EACH OF THEM. The bottom band gains ${r4(bandGain[0])} ft2 and the top band gains ${r4(bandGain[9])} ft2. Ratio of the top band to the bottom: ${e12(bandGain[9] / bandGain[0])}. The whole column is a mirror: its ${bandGain.length} figures read the same from the top as from the bottom.`);
w(`- THE FLAT PART IS THE MIDDLE. The two middle bands of the ten gain ${r4(bandGain[4])} ft2 each, against ${r4(maxGain)} ft2 at each end, a ratio of ${e12(maxGain / bandGain[4])}. A vessel filling at a steady rate therefore adds wetted shell fastest when it is nearly empty and again when it is nearly full.`);
w();
w('- THE ORIENTATION IS MATCHED CASE-INSENSITIVELY AND TRIMMED, and anything else REFUSES rather than falling through to a default. Section 26 runs that refusal.');
w('- THE HEADS ARE IGNORED. That is standard screening practice and it is conservative for the shell term. The engine does not add them and this course does not either.');
w(`- THE 25 FT LIMIT IS THE CALLER JOB. The engine attaches a note saying so on every fire duty: "${benDuty.note}". Only the wetted area below 25 ft above grade counts towards a pool fire, and where that height falls depends on the plot elevation the engine is never told. The level is trimmed BEFORE the call.`);
w();

/* ------------------------------------------------------------ SECTION 13 */

w('# SECTION 13: The published wetted-area cases (owned by Professional m02)');
w();
w(`# ${GOLD.wetted.length} published rows, re-run through the engine. Both orientations, including the empty vessel and one wetted past its own diameter.`);
w('| golden orientation | golden diameter ft | golden length ft | golden level ft | published wetted ft2 | engine wetted ft2 | relative difference |');
w('| --- | --- | --- | --- | --- | --- | --- |');
GOLD.wetted.forEach((g, i) => {
  const r = success(`the published wetted row ${i + 1}`, R.wettedAreaFt2(g));
  const d = g.areaFt2 === 0 ? 'n/a, the empty vessel' : agree(`the published wetted row ${i + 1}`, r.areaFt2, g.areaFt2, 1e-9);
  w(`| ${g.orientation} | ${e6(g.diameterFt)} | ${e6(g.lengthFt)} | ${e6(g.liquidLevelFt)} | ${r4(g.areaFt2)} | ${r4(r.areaFt2)} | ${d} |`);
});
const vertRows = GOLD.wetted.filter((g) => g.orientation === 'vertical');
must('the published wetted set covers the vertical branch', vertRows.length >= 2, `${vertRows.length} vertical rows`);
w();
w(`- ${vertRows.length} of the ${GOLD.wetted.length} rows are VERTICAL. That branch has its own derived oracle route, so a defect in one orientation cannot hide behind the other.`);
w('- The oracle derives both branches by POLYLINE SUMMATION round the real circle with Richardson extrapolation, rather than by evaluating the same arc formula the engine uses.');
w();

/* ------------------------------------------------------------ SECTION 14 */

w('# SECTION 14: The pool fire duty, its two constants, its exponent and its credit (owned by Professional m03)');
w();
w('# The API 521 pool fire duty is a constant times an environment factor times the wetted area raised to a published exponent. Which constant applies is decided by one answer: whether the plot has adequate drainage and firefighting.');
w(`- Measured at a unit area and a unit environment factor: with drainage ${e12(C21000)} Btu/hr, without ${e12(C34500)} Btu/hr. The factor between them is ${e12(DRAINAGE_FACTOR)}.`);
w(`- The exponent, measured as the log ratio of two duties at ${EA1} and ${EA2} ft2: ${e12(FIRE_EXP)}.`);
w(`- THE TWO CONSTANTS AND THE EXPONENT ARE HELD FOR LITERATURE. The oracle checks the USC pair against the published SI pair with the exponent carried through the unit conversion, which checks the UNIT PACKAGING rather than the pool-fire physics. Nothing graded in this course reads a fire duty or a fire relief load.`);
w();
w('# BENISEDE duty, with the environment factor walked. The factor is the insulation and drainage credit and is a typed input against its own table.');
w('| environment factor (stated) | duty Btu/hr with drainage | duty Btu/hr without | relief load lb/hr with drainage |');
w('| --- | --- | --- | --- |');
ENV_SWEEP.forEach((f) => {
  const a = success(`the BENISEDE duty at F ${f} with drainage`, R.fireHeatInput({ wettedFt2: benWet.areaFt2, adequateDrainage: true, envFactor: f }));
  const b = success(`the BENISEDE duty at F ${f} without drainage`, R.fireHeatInput({ wettedFt2: benWet.areaFt2, adequateDrainage: false, envFactor: f }));
  const l = success(`the BENISEDE load at F ${f}`, R.fireReliefLoad({ qBtuHr: a.qBtuHr, latentBtuLb: BENISEDE.latentBtuLb }));
  w(`| ${e6(f)} | ${r4(a.qBtuHr)} | ${r4(b.qBtuHr)} | ${r4(l.wLbHr)} |`);
});
w();
w('# The exponent is below one, so duty per square foot FALLS as a vessel gets bigger. The evidence, at a fixed environment factor and drainage.');
w('| wetted area ft2 (stated) | duty Btu/hr | duty per ft2 Btu/hr |');
w('| --- | --- | --- |');
[50, 100, 250, 500, 1000, 2500, 5000].forEach((a) => {
  const r = success(`the duty at ${a} ft2`, R.fireHeatInput({ wettedFt2: a }));
  w(`| ${r4(a)} | ${r4(r.qBtuHr)} | ${r4(r.qBtuHr / a)} |`);
});
w();
w('# The relief load is the duty divided by the latent heat of the boiling liquid, and the method breaks down as that latent heat collapses towards the critical point. The engine warns rather than refusing.');
w(`- The latent heat below which the warning fires, bisected: ${e12(LATENT_WARN)} Btu/lb.`);
w('| latent heat Btu/lb (stated) | relief load lb/hr at the BENISEDE duty | warning |');
w('| --- | --- | --- |');
[300, 200, 150, 128, 100, 60, 49, 30].forEach((L) => {
  const r = success(`the BENISEDE load at a latent heat of ${L} Btu/lb`, R.fireReliefLoad({ qBtuHr: benDuty.qBtuHr, latentBtuLb: L }));
  w(`| ${e6(L)} | ${r4(r.wLbHr)} | ${r.warning ? 'yes' : 'no'} |`);
});
w();

/* ------------------------------------------------------------ SECTION 15 */

w('# SECTION 15: The published fire and relief-load cases (owned by Professional m03 and m04)');
w();
w(`# ${GOLD.fire.length} published fire rows and ${GOLD.load.length} published load rows, re-run through the engine.`);
w('| golden wetted ft2 | golden drainage | golden environment factor | published duty Btu/hr | engine duty Btu/hr | relative difference |');
w('| --- | --- | --- | --- | --- | --- |');
GOLD.fire.forEach((g, i) => {
  const r = success(`the published fire row ${i + 1}`, R.fireHeatInput(g));
  const d = agree(`the published fire row ${i + 1}`, r.qBtuHr, g.qBtuHr, 2e-3);
  w(`| ${r4(g.wettedFt2)} | ${g.adequateDrainage} | ${e6(g.envFactor)} | ${r4(g.qBtuHr)} | ${r4(r.qBtuHr)} | ${d} |`);
});
w();
w('| golden duty Btu/hr | golden latent Btu/lb | published load lb/hr | engine load lb/hr | relative difference |');
w('| --- | --- | --- | --- | --- |');
GOLD.load.forEach((g, i) => {
  const r = success(`the published load row ${i + 1}`, R.fireReliefLoad(g));
  const d = agree(`the published load row ${i + 1}`, r.wLbHr, g.wLbHr, 1e-6);
  w(`| ${r4(g.qBtuHr)} | ${e6(g.latentBtuLb)} | ${r4(g.wLbHr)} | ${r4(r.wLbHr)} | ${d} |`);
});
w();
w('- The oracle for the load route re-derives every unit packaging: Btu, hour and pound through kW and kilograms a second. It cannot check the latent-heat METHOD, which is the model this route is.');
w();

/* ------------------------------------------------------------ SECTION 16 */

w('# SECTION 16: The fire case end to end, geometry to letter (owned by Professional m04)');
w();
w('# BENISEDE, from a vessel and a level to an orifice, every step an engine return.');
w(`- Stated: horizontal, ${e6(BENISEDE.diameterFt)} ft diameter, ${e6(BENISEDE.lengthFt)} ft long, level ${e6(BENISEDE.liquidLevelFt)} ft, drainage ${BENISEDE.adequateDrainage}, environment factor ${e6(BENISEDE.envFactor)}, latent heat ${e6(BENISEDE.latentBtuLb)} Btu/lb, set ${e6(BENISEDE.setPsig)} psig, overpressure ${e6(BENISEDE.overpressurePct)} percent, ${e6(BENISEDE.tF)} degF, molecular weight ${e6(BENISEDE.mw)}, z ${e6(BENISEDE.z)}, k ${e6(BENISEDE.k)}.`);
w('| step | value | route |');
w('| --- | --- | --- |');
w(`| wetted area | ${r4(benWet.areaFt2)} ft2 | wettedAreaFt2, horizontal |`);
w(`| pool fire duty | ${r4(benDuty.qBtuHr)} Btu/hr | fireHeatInput |`);
w(`| relief load | ${r4(benLoad.wLbHr)} lb/hr | fireReliefLoad |`);
w(`| relieving pressure | ${e6(benP1)} psia | derived, set times one plus the overpressure fraction plus the measured atmospheric |`);
w(`| required area | ${e6(benArea.areaIn2)} in2 | gasVaporArea, ${benArea.critical ? 'critical' : 'subcritical'} |`);
w(`| orifice | ${benOrifice.orifice} at ${e6(benOrifice.areaIn2)} in2 | selectOrifice |`);
w(`| margin | ${e6(benOrifice.margin)} | selectOrifice |`);
w();
w(`- THE FIRE CASE GETS A LARGER OVERPRESSURE ALLOWANCE THAN A PROCESS CASE, and BENISEDE states ${e6(BENISEDE.overpressurePct)} percent. The same chain at ${e6(10)} percent: relieving pressure ${e6(relievingPsia(BENISEDE.setPsig, 10))} psia, required area ${e6(R.gasVaporArea({ wLbHr: benLoad.wLbHr, p1Psia: relievingPsia(BENISEDE.setPsig, 10), p2Psia: ATM, tR: BENISEDE.tF + 459.67, mw: BENISEDE.mw, z: BENISEDE.z, k: BENISEDE.k }).areaIn2)} in2, orifice ${R.selectOrifice(R.gasVaporArea({ wLbHr: benLoad.wLbHr, p1Psia: relievingPsia(BENISEDE.setPsig, 10), p2Psia: ATM, tR: BENISEDE.tF + 459.67, mw: BENISEDE.mw, z: BENISEDE.z, k: BENISEDE.k }).areaIn2).orifice}.`);
w();
w('# What moves the letter. Each row changes ONE input of the chain above and carries the change all the way through.');
w('| changed input | wetted ft2 | duty Btu/hr | load lb/hr | required in2 | orifice |');
w('| --- | --- | --- | --- | --- | --- |');
const benChain = (over) => {
  const g = { orientation: BENISEDE.orientation, diameterFt: BENISEDE.diameterFt, lengthFt: BENISEDE.lengthFt, liquidLevelFt: BENISEDE.liquidLevelFt, ...(over.geom || {}) };
  const wa = success(`the BENISEDE variant geometry ${JSON.stringify(over.geom || {})}`, R.wettedAreaFt2(g));
  const d = success('the BENISEDE variant duty', R.fireHeatInput({ wettedFt2: wa.areaFt2, adequateDrainage: over.drainage ?? BENISEDE.adequateDrainage, envFactor: over.env ?? BENISEDE.envFactor }));
  const l = success('the BENISEDE variant load', R.fireReliefLoad({ qBtuHr: d.qBtuHr, latentBtuLb: over.latent ?? BENISEDE.latentBtuLb }));
  const a = success('the BENISEDE variant area', R.gasVaporArea({ wLbHr: l.wLbHr, p1Psia: benP1, p2Psia: ATM, tR: BENISEDE.tF + 459.67, mw: BENISEDE.mw, z: BENISEDE.z, k: BENISEDE.k }));
  const o = success('the BENISEDE variant orifice', R.selectOrifice(a.areaIn2));
  return [wa.areaFt2, d.qBtuHr, l.wLbHr, a.areaIn2, o.orifice];
};
const oneInputRows = [];
[
  ['none, the stated case', {}],
  ['drainage answered false', { drainage: false }],
  ['environment factor 0.3', { env: 0.3 }],
  ['level trimmed to 2.0 ft', { geom: { liquidLevelFt: 2.0 } }],
  ['level raised to 8.0 ft', { geom: { liquidLevelFt: 8.0 } }],
  ['latent heat 90 Btu/lb', { latent: 90 }],
  ['read standing up', { geom: { orientation: 'vertical' } }],
].forEach(([label, over]) => {
  const [wa, d, l, a, o] = benChain(over);
  oneInputRows.push({ label, wa, d, l, a, o });
  w(`| ${label} | ${r4(wa)} | ${r4(d)} | ${r4(l)} | ${e6(a)} | ${o} |`);
});
w();
// WHICH ROW MOVES THE ANSWER FURTHEST, RANKED BY THE GENERATOR. Three committed
// lessons ranked these rows by eye and all three got it wrong: the drainage
// answer was called the largest lever in the fire case, the environment factor
// was called a lever of the same reach as it, and the drainage answer and the
// orientation were called the two largest moves on the letter. A ranking is an
// answer, so it is computed here rather than left beside the figures to be
// guessed at (FC5 repair).
const LADDER = R.API_ORIFICES.map((x) => x.orifice);
const stated = oneInputRows[0];
const ranked = oneInputRows.slice(1).map((r) => ({
  ...r,
  dutyFactor: r.d >= stated.d ? r.d / stated.d : stated.d / r.d,
  dutyDir: r.d >= stated.d ? 'up' : 'down',
  rungs: LADDER.indexOf(r.o) - LADDER.indexOf(stated.o),
}));
must('every variant orifice is on the published ladder', ranked.every((r) => LADDER.indexOf(r.o) >= 0), ranked.map((r) => r.o).join(' '));
const byDuty = [...ranked].sort((a, b) => b.dutyFactor - a.dutyFactor);
const byRung = [...ranked].sort((a, b) => Math.abs(b.rungs) - Math.abs(a.rungs));
const maxRung = Math.max(...ranked.map((r) => Math.abs(r.rungs)));
const furthest = ranked.filter((r) => Math.abs(r.rungs) === maxRung);
const drain = ranked.find((r) => r.label === 'drainage answered false');
must('the drainage answer is NOT the largest duty lever in this table', byDuty[0].label !== 'drainage answered false', `${byDuty[0].label} moves the duty by ${e12(byDuty[0].dutyFactor)}`);
must('the drainage answer is NOT among the rows that move the letter furthest', !furthest.some((r) => r.label === 'drainage answered false'), `${drain.rungs} rung against a furthest of ${maxRung}`);
w('# THE SAME TABLE, RANKED. A ranking is an answer, so it is computed rather than left to be read off the rows above. The duty factor is the variant duty over the stated one, or the stated one over the variant where the variant is lower, so every row is a figure at or above one.');
w('| changed input | duty factor against the stated case | direction | orifice | rungs moved on the ladder |');
w('| --- | --- | --- | --- | --- |');
byDuty.forEach((r) => w(`| ${r.label} | ${e12(r.dutyFactor)} | ${r.dutyDir} | ${r.o} | ${r.rungs > 0 ? `+${r.rungs}` : r.rungs} |`));
w();
w(`- THE LARGEST DUTY LEVER IS ${byDuty[0].label.toUpperCase()}, at ${e12(byDuty[0].dutyFactor)}. The drainage answer, which changes the duty by the ratio of the two published fire constants, comes ${byDuty.findIndex((r) => r.label === 'drainage answered false') + 1} of ${byDuty.length} at ${e12(drain.dutyFactor)}.`);
w(`- THE ROWS THAT MOVE THE LETTER FURTHEST MOVE IT ${maxRung} RUNGS, and there are ${furthest.length} of them: ${furthest.map((r) => r.label).join(' and ')}. The drainage answer moves it ${Math.abs(drain.rungs)} rung, which is the smallest non-zero move in the table and is shared with ${ranked.filter((r) => Math.abs(r.rungs) === Math.abs(drain.rungs) && r.label !== drain.label).length} other rows.`);
w('- A DUTY RANKING AND A LETTER RANKING ARE DIFFERENT RANKINGS. The ladder is a published table of discrete areas, so a large move in the duty can land inside the same letter and a smaller one can cross a rung. Read the column that answers the question being asked.');
w();

/* ------------------------------------------------------------ SECTION 17 */

w('# SECTION 17: Droplet settling, drag against weight, iterated (owned by Professional m05 l02 and l03)');
w();
w('# A droplet falls at the speed where form drag balances its buoyant weight. The drag coefficient depends on the Reynolds number, the Reynolds number depends on the speed, so the engine iterates and reports the pair it converged on.');
w('- THREE COURSES IN THIS ACADEMY ANSWER THE SAME QUESTION BY DIFFERENT ROUTES. Gas well loading owns drag against weight with the Turner and Coleman criteria. Separation owns the Souders-Brown allowable and the critique of using it as a settling velocity. This is the third answer, the API 521 drag-coefficient method, and this course does not re-derive either of the other two.');
w(`- The balance the engine evaluates is Ud = coefficient times the square root of (g d (rhoL - rhoV) / (rhoV C)). The group Ud^2 C rhoV / ((rhoL - rhoV) d) therefore carries the coefficient squared, standard gravity and the foot per micron and nothing else. Measured at ${PROBES.settleA.dropletMicron} micron: ${e12(SETTLE_GROUP.a)}. At ${PROBES.settleB.dropletMicron} micron: ${e12(SETTLE_GROUP.b)}. At ${PROBES.settleC.muVCp} cp instead of ${PROBES.settleA.muVCp}: ${e12(SETTLE_GROUP.c)}.`);
w(`- The first two are equal to twelve decimals, which is what says the group does not carry the droplet size. The third is equal to the first as well, which is what says it does not carry the viscosity either.`);
must('the settling group is independent of the droplet size', Math.abs(SETTLE_GROUP.a / SETTLE_GROUP.b - 1) < 1e-12, `${e12(SETTLE_GROUP.a)} and ${e12(SETTLE_GROUP.b)}`);
must('the settling group is independent of the vapour viscosity', Math.abs(SETTLE_GROUP.a / SETTLE_GROUP.c - 1) < 1e-12, `${e12(SETTLE_GROUP.a)} and ${e12(SETTLE_GROUP.c)}`);
w(`- Dividing that group by standard gravity in ft/s2 leaves the coefficient squared times the foot per micron: ${e12(SETTLE_COEFF_SQ.coeffSq)}.`);
w('- THE DRAG CORRELATION IS HELD FOR LITERATURE. Its three terms and its low-Reynolds cap are an empirical fit that no route in this package can derive, and the validation oracle shares it on purpose and says so. Section 28 audits that. Nothing graded in this course reads it.');
w();
w('# The droplet size walked, on the ODIDI vapour. Watch the drag coefficient, the Reynolds number and the iteration count together.');
w(`- ODIDI states ${e6(ODIDI.qVaporMMscfd)} MMscfd at ${e6(ODIDI.pPsia)} psia and ${e6(ODIDI.tF)} degF with a gas gravity of ${e6(ODIDI.gasSg)}, a liquid density of ${e6(ODIDI.rhoLLbFt3)} lb/ft3 and a vapour viscosity of ${e6(ODIDI.muVCp)} cp.`);
w(`- The vapour density, DERIVED from the stated gravity and the package own gas constant and air molecular weight: ${e6(odiRhoV)} lb/ft3.`);
w(`- The actual vapour rate, DERIVED from the stated MMscfd at the package own standard base of 14.696 psia and 519.67 degR: ${e6(odiQ)} actual ft3/s.`);
w('| droplet micron (stated) | dropout velocity ft/s | drag coefficient | Reynolds | iterations | converged |');
w('| --- | --- | --- | --- | --- | --- |');
ODIDI_DROPLET_SWEEP.forEach((d) => {
  const r = success(`the ODIDI dropout velocity at ${d} micron`, R.dropoutVelocityFtS({ dropletMicron: d, rhoLLbFt3: ODIDI.rhoLLbFt3, rhoVLbFt3: odiRhoV, muVCp: ODIDI.muVCp }));
  w(`| ${e6(d)} | ${e6(r.udFtS)} | ${e6(r.dragC)} | ${e6(r.reynolds)} | ${r.iterations} | ${r.converged} |`);
});
w();
w(`- THE CORRELATION IS CAPPED AT LOW REYNOLDS NUMBERS. Measured: the drag coefficient stops moving at ${e12(DRAG_CAP.c)}, and the Reynolds number just inside that cap is ${e12(DRAG_CAP.re)}. Below there the fit would keep climbing and the cap holds it.`);
w(`- THE RETURNED VELOCITY AND THE RETURNED DRAG COEFFICIENT BELONG TOGETHER. The engine recomputes the velocity from the coefficient it is about to return, so a reader can put the pair back into the balance and get the same answer. The ODIDI pair: ${e6(odiSettle.udFtS)} ft/s at a drag coefficient of ${e6(odiSettle.dragC)}, converged ${odiSettle.converged} in ${odiSettle.iterations} passes on a residual of ${e12(odiSettle.residual)}.`);
w();

/* ------------------------------------------------------------ SECTION 18 */

w('# SECTION 18: The knockout drum, a level, a segment and a length (owned by Professional m05 l04 and l05)');
w();
w('# A horizontal knockout drum works if the vapour takes longer to cross the drum than a droplet takes to fall out of it. At a candidate diameter the engine returns the length that demands.');
w('- THE HOLDUP INPUT IS THE LIQUID LEVEL AS A FRACTION OF THE DIAMETER, which is what a level instrument reads. The vapour cross-section is then the EXACT CIRCULAR SEGMENT above that level, and the distance a droplet falls is the vapour depth. The engine returns the depth, the segment area fraction, the vapour area and the fall distance, so the convention is visible rather than inferred.');
w();
w('# The segment area fraction of a circle filled to a depth fraction, straight from the engine own export.');
w('| depth fraction (stated) | liquid area fraction | vapour area fraction |');
w('| --- | --- | --- |');
CONVENTION_LEVELS.concat([0, 0.99]).sort((a, b) => a - b).forEach((f) => {
  const frac = R.segmentAreaFraction(f);
  w(`| ${e6(f)} | ${e6(frac)} | ${e6(1 - frac)} |`);
});
must('the segment area fraction at half depth is a half', Math.abs(R.segmentAreaFraction(0.5) - 0.5) < 1e-12, `${e12(R.segmentAreaFraction(0.5))}`);
// WHERE THE TWO AGREE IS SWEPT RATHER THAN ASSERTED. This line used to say the
// two agree at half depth and NOWHERE ELSE, while the table printed directly
// above it carries | 0.000000 | 0.000000 |, which agrees. A claim about how
// MANY places satisfy a relation is one no figure on the page can contradict,
// so it is counted here and the count is printed (FC5 repair).
const AGREE_GRID = 100000;
const agreeEnds = [0, 1].filter((f) => R.segmentAreaFraction(f) === f);
let agreeInterior = 0; let below = 0; let belowSmaller = 0; let above = 0; let aboveLarger = 0;
for (let i = 1; i < AGREE_GRID; i += 1) {
  const f = i / AGREE_GRID;
  const d = R.segmentAreaFraction(f) - f;
  if (d === 0) { agreeInterior += 1; continue; }
  if (f < 0.5) { below += 1; if (d < 0) belowSmaller += 1; }
  if (f > 0.5) { above += 1; if (d > 0) aboveLarger += 1; }
}
const halfCrossing = bisect(0.25, 0.75, (f) => R.segmentAreaFraction(f) < f);
must('both ends of the depth range agree with themselves', agreeEnds.length === 2, `${agreeEnds.join(' and ')}`);
must('exactly one depth strictly inside the range agrees', agreeInterior === 1, `${agreeInterior}`);
must('the one interior agreement is half depth', Math.abs(halfCrossing - 0.5) < 1e-12, e12(halfCrossing));
must('below half depth the area fraction is smaller on every swept depth', below > 0 && belowSmaller === below, `${belowSmaller} of ${below}`);
must('above half depth the area fraction is larger on every swept depth', above > 0 && aboveLarger === above, `${aboveLarger} of ${above}`);
w();
w(`- AT HALF DEPTH THE AREA FRACTION IS A HALF, ${e12(R.segmentAreaFraction(0.5))}. Read the table above at 0.1 and at 0.75 to see how far apart the two get.`);
w(`- WHERE THE TWO AGREE IS COUNTED RATHER THAN ASSERTED. Swept across the whole range, the depth fraction and the area fraction agree at exactly ${agreeEnds.length + agreeInterior} depths: ${e12(R.segmentAreaFraction(0))} empty, ${e12(halfCrossing)} half full, and ${e12(R.segmentAreaFraction(1))} full. THE TWO ENDS AGREE TRIVIALLY, because an empty circle holds no liquid area and a full one is all liquid area, and the empty row is printed in the table above. HALF DEPTH IS THE ONLY AGREEMENT STRICTLY BETWEEN THEM, bisected rather than assumed.`);
w(`- EITHER SIDE OF ${e6(halfCrossing)} THE TWO DISAGREE IN OPPOSITE DIRECTIONS. Below half depth the area fraction is SMALLER than the depth fraction on all ${below} swept depths, and above half depth it is LARGER on all ${above}. That is one crossing of the diagonal with a touch at each end.`);
w();
w('# The ODIDI drum, with the holdup walked end to end. Everything on a row is an engine return except the stated fraction.');
w('| holdup fraction (stated) | liquid depth ft | liquid area fraction | vapour area ft2 | vapour velocity ft/s | fall distance ft | required length ft | L over D | note |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
const holdupLengths = [];
ODIDI_HOLDUP_SWEEP.forEach((f) => {
  const r = success(`the ODIDI drum at a holdup of ${f}`, R.koDrumHorizontal({ ...odiDrumCall, liquidFraction: f }));
  holdupLengths.push(r.requiredLengthFt);
  w(`| ${e6(f)} | ${e6(r.liquidDepthFt)} | ${e6(r.liquidAreaFraction)} | ${e6(r.areaVaporFt2)} | ${e6(r.vVaporFtS)} | ${e6(r.fallFt)} | ${e6(r.requiredLengthFt)} | ${e6(r.ld)} | ${r.note || 'none'} |`);
});
const spread = Math.max(...holdupLengths) - Math.min(...holdupLengths);
must('the holdup fraction moves the required length across its range', spread > 1, `spread ${e6(spread)} ft`);
w();
w(`- THE HOLDUP MOVES THE ANSWER. Across the sweep above the required length runs from ${e6(Math.min(...holdupLengths))} ft to ${e6(Math.max(...holdupLengths))} ft, a spread of ${e6(spread)} ft, while the vapour velocity runs from ${e6(R.koDrumHorizontal({ ...odiDrumCall, liquidFraction: ODIDI_HOLDUP_SWEEP[0] }).vVaporFtS)} ft/s to ${e6(R.koDrumHorizontal({ ...odiDrumCall, liquidFraction: ODIDI_HOLDUP_SWEEP[ODIDI_HOLDUP_SWEEP.length - 1] }).vVaporFtS)} ft/s.`);
w('- THE LENGTH IS NOT MONOTONIC IN THE HOLDUP. Two things move against each other: filling the drum shrinks the vapour space and speeds the gas up, which needs MORE length, and it also shortens the distance a droplet has to fall, which needs LESS. Read the required-length column top to bottom and find where it turns.');
w();
w('# THE CONVENTION MATTERS, and the size of it is printed rather than asserted. The same drum read two ways: the holdup as a LIQUID LEVEL fraction, which is what the engine takes, and the same figure read as an AREA fraction instead.');
w('| fraction (stated) | length ft, read as a level | length ft, read as an area fraction | ratio |');
w('| --- | --- | --- | --- |');
CONVENTION_LEVELS.forEach((f) => {
  const asLevel = success(`the convention probe at a level fraction of ${f}`, R.koDrumHorizontal({ ...CONVENTION_PROBE, liquidFraction: f }));
  // the same drum where the STATED fraction is taken as the area fraction: the
  // depth that produces it is found by bisection on the engine own segment
  // function, and the drum is then asked at that depth
  const depth = bisect(0, 0.999999, (d) => R.segmentAreaFraction(d) < f);
  const asArea = success(`the convention probe at the depth whose area fraction is ${f}`, R.koDrumHorizontal({ ...CONVENTION_PROBE, liquidFraction: depth }));
  w(`| ${e6(f)} | ${e6(asLevel.requiredLengthFt)} | ${e6(asArea.requiredLengthFt)} | ${e6(asArea.requiredLengthFt / asLevel.requiredLengthFt)} |`);
});
w();
w('# The diameter walked at the ODIDI duty. This is the design move: the length and the L over D together decide the drum.');
w('| diameter ft (stated) | vapour velocity ft/s | required length ft | L over D | note |');
w('| --- | --- | --- | --- | --- |');
ODIDI_DIAMETER_SWEEP.forEach((d) => {
  const r = success(`the ODIDI drum at ${d} ft`, R.koDrumHorizontal({ ...odiDrumCall, diameterFt: d }));
  w(`| ${e6(d)} | ${e6(r.vVaporFtS)} | ${e6(r.requiredLengthFt)} | ${e6(r.ld)} | ${r.note || 'none'} |`);
});
w();
w(`- THE NOTE IS A JUDGMENT WITH TWO EDGES AND BOTH ARE MEASURED. The go-wider note starts at an L over D of ${e12(LD_NOTE.hiLd)} and the smaller-drum note ends at ${e12(LD_NOTE.loLd)}. Between them the engine says nothing, which is the band it treats as reasonable.`);
w(`- The stated ODIDI drum: ${e6(ODIDI.diameterFt)} ft across at a holdup of ${e6(ODIDI.liquidFraction)}, vapour velocity ${e6(odiDrum.vVaporFtS)} ft/s, required length ${e6(odiDrum.requiredLengthFt)} ft, L over D ${e6(odiDrum.ld)}, note ${odiDrum.note || 'none'}.`);
w();

/* ------------------------------------------------------------ SECTION 19 */

w('# SECTION 19: The published dropout and drum cases (owned by Professional m05)');
w();
w(`# ${GOLD.dropout.length} published dropout rows and ${GOLD.drum.length} published drum rows, re-run through the engine.`);
w('| golden droplet micron | golden rhoL lb/ft3 | golden rhoV lb/ft3 | golden viscosity cp | published velocity ft/s | engine velocity ft/s | relative difference | engine drag coefficient |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.dropout.forEach((g, i) => {
  const r = success(`the published dropout row ${i + 1}`, R.dropoutVelocityFtS(g));
  const d = agree(`the published dropout row ${i + 1}`, r.udFtS, g.udFtS, 1e-5);
  w(`| ${e6(g.dropletMicron)} | ${e6(g.rhoLLbFt3)} | ${e6(g.rhoVLbFt3)} | ${e6(g.muVCp)} | ${e6(g.udFtS)} | ${e6(r.udFtS)} | ${d} | ${e6(r.dragC)} |`);
});
w();
w('| golden rate acfs | golden dropout ft/s | golden diameter ft | golden holdup | golden liquid area fraction | published length ft | golden L over D | engine length ft | relative difference |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.drum.forEach((g, i) => {
  const r = success(`the published drum row ${i + 1}`, R.koDrumHorizontal(g));
  const d = agree(`the published drum row ${i + 1}`, r.requiredLengthFt, g.requiredLengthFt, 1e-9);
  w(`| ${e6(g.qVaporAcfs)} | ${e6(g.udFtS)} | ${e6(g.diameterFt)} | ${e6(g.liquidFraction)} | ${e6(g.liquidAreaFraction)} | ${e6(g.requiredLengthFt)} | ${e6(g.ld)} | ${e6(r.requiredLengthFt)} | ${d} |`);
});
const drumHoldups = new Set(GOLD.drum.map((g) => g.liquidFraction));
must('the published drum set walks more than one holdup', drumHoldups.size > 3, `${drumHoldups.size} distinct holdups`);
w();
w(`- ${drumHoldups.size} distinct holdup fractions appear in the published drum rows, which is what lets that set discriminate an input that could not move its own answer.`);
w('- The oracle derives the segment vapour area by SIMPSON QUADRATURE of the area integral and the length as a transit time against a fall time, in SI, rather than by evaluating the engine own expressions.');
w('- The oracle for settling derives the balance by BISECTION on the force residual in SI, which recovers the exact coefficient the balance carries. It SHARES the drag correlation with the engine on purpose.');
w();

/* ------------------------------------------------------------ SECTION 20 */

w('# SECTION 20: One Professional scenario, end to end (owned by Professional m06)');
w();
w('# BENISEDE puts a load on a valve. ODIDI is the drum that keeps the liquid that valve passes out of the flare header. They are the two halves of one Professional reading.');
w('| step | value | route |');
w('| --- | --- | --- |');
w(`| BENISEDE wetted area | ${r4(benWet.areaFt2)} ft2 | wettedAreaFt2 |`);
w(`| BENISEDE pool fire duty | ${r4(benDuty.qBtuHr)} Btu/hr | fireHeatInput |`);
w(`| BENISEDE relief load | ${r4(benLoad.wLbHr)} lb/hr | fireReliefLoad |`);
w(`| BENISEDE required area | ${e6(benArea.areaIn2)} in2 | gasVaporArea |`);
w(`| BENISEDE orifice | ${benOrifice.orifice} | selectOrifice |`);
w(`| ODIDI vapour density | ${e6(odiRhoV)} lb/ft3 | derived from the stated gravity |`);
w(`| ODIDI actual vapour rate | ${e6(odiQ)} acfs | derived from the stated MMscfd |`);
w(`| ODIDI dropout velocity | ${e6(odiSettle.udFtS)} ft/s | dropoutVelocityFtS |`);
w(`| ODIDI vapour velocity | ${e6(odiDrum.vVaporFtS)} ft/s | koDrumHorizontal |`);
w(`| ODIDI required length | ${e6(odiDrum.requiredLengthFt)} ft | koDrumHorizontal |`);
w(`| ODIDI L over D | ${e6(odiDrum.ld)} | koDrumHorizontal |`);
w();
w('- THE TWO HALVES DO NOT SHARE A NUMBER. The drum is sized on the vapour the header carries and the droplet the flare tip will not take, and the valve is sized on the load a fire puts on a vessel. A reader who expects the relief load to appear in the drum calculation has the chain wrong: what the drum takes is a rate at drum conditions, and this engine is handed that rate rather than deriving it from a relief case.');
w('- WHAT THE ENGINE LEAVES TO THE CALLER, in this tier: the wetted height truncation at 25 ft, the choice of which scenario is the governing case, the conversion from a standard rate to an actual one, and the liquid density and vapour viscosity at drum conditions.');
w();

/* ------------------------------------------------------------ SECTION 21 */

w('# SECTION 21: The blowdown march, mass out through a choked orifice and isentropic inside (owned by Expert m01)');
w();
w('# Depressuring is the other question this engine answers about a vessel. A relief valve keeps the pressure from rising; a blowdown orifice takes the inventory out. The march is explicit: mass leaves through a choked orifice, the gas left behind expands isentropically, and the trajectory is returned so the answer is read off a curve.');
w(`- AFIESERE states ${e6(AFIESERE.volumeFt3)} ft3 at ${e6(AFIESERE.p0Psia)} psia and ${e6(AFIESERE.t0R)} degR, down to ${e6(AFIESERE.pEndPsia)} psia, molecular weight ${e6(AFIESERE.mw)}, k ${e6(AFIESERE.k)}, z ${e6(AFIESERE.z)}, orifice ${e6(AFIESERE.orificeDIn)} in at a discharge coefficient of ${e6(AFIESERE.cd)}.`);
w('| returned | value |');
w('| --- | --- |');
w(`| time to the end pressure | ${e6(afi.timeS)} s |`);
w(`| the same in minutes, derived | ${e6(afi.timeS / 60)} |`);
w(`| starting inventory | ${r4(afi.initialMassLb)} lb |`);
w(`| inventory left at the end | ${r4(afi.massRemainingLb)} lb |`);
w(`| fraction of the inventory removed, derived | ${e6(1 - afi.massRemainingLb / afi.initialMassLb)} |`);
w(`| final temperature | ${e6(afi.finalTR)} degR |`);
w(`| the same in degF, derived | ${e6(afi.finalTR - 459.67)} |`);
w(`| final pressure | ${e6(afi.finalPPsia)} psia |`);
w(`| steps taken | ${afi.steps} |`);
w(`| steps that had to be subdivided | ${afi.substeps} |`);
w(`| stations returned | ${afi.stations.length} |`);
w(`| the time step used | ${e6(afi.dtS)} s |`);
w(`| the pressure below which the choked assumption stops holding | ${e6(afi.chokedToPsia)} psia |`);
w(`| warning | ${afi.warning || 'none'} |`);
w();
w(`- THE MASS THE ENGINE REPORTS FOR ITS OWN START STATE IS WHERE THE GAS CONSTANT COMES FROM. Rearranged, it gives ${e12(RGAS_UNIVERSAL)} ft.lbf per lbmol degR, which is the universal gas constant this march stands on.`);
w();
w('# THE MARCH HAS A CLOSED FORM, AND THE DIGEST USES IT. With z held constant and the flow choked throughout, the mass balance is separable: the rate of mass loss is proportional to the mass raised to (k+1)/2, so the time between two masses can be integrated exactly. The closed form below is built from the engine own coefficient C, the measured gas constant above, and the stated geometry.');
w('| case | marched time s | closed-form time s | ratio |');
w('| --- | --- | --- | --- |');
const closedRows = [
  ['AFIESERE as stated', AFIESERE, afi],
  ['AFIESERE at a 2.0 in orifice', { ...AFIESERE, orificeDIn: 2.0 }, null],
  ['AFIESERE at a discharge coefficient of 0.60', { ...AFIESERE, cd: 0.60 }, null],
  ['AFIESERE from 1800 psia', { ...AFIESERE, p0Psia: 1800 }, null],
];
closedRows.forEach(([label, b, pre]) => {
  const run = pre || success(`the blowdown march, ${label}`, R.blowdown(b));
  const cf = closedFormTimeS(b, run);
  must(`${label} agrees with its closed form`, Math.abs(cf / run.timeS - 1) < 1e-5, `${e12(cf / run.timeS)}`);
  w(`| ${label} | ${e6(run.timeS)} | ${e6(cf)} | ${e12(cf / run.timeS)} |`);
});
w();
w('- THE RATIO COLUMN IS THE CHECK. A discharge coefficient applied twice, a coefficient hidden inside the mass flow, or an isentropic exponent off by one would all show as a ratio away from one. The validation oracle runs the same closed form in SI and the published blowdown cases are built from it.');
w(`- THE DISCHARGE COEFFICIENT IS THE CALLER FIGURE AND NOTHING MULTIPLIES IT. The same vessel at three coefficients: ${[0.6, 0.82, 1.0].map((cd) => `${e6(cd)} gives ${e6(R.blowdown({ ...AFIESERE, cd }).timeS)} s`).join(', ')}. The ratio of the first time to the last is ${e12(R.blowdown({ ...AFIESERE, cd: 0.6 }).timeS / R.blowdown({ ...AFIESERE, cd: 1.0 }).timeS)}, against a coefficient ratio of ${e12(1.0 / 0.6)}.`);
w();
w('# The trajectory. Every tenth station of the AFIESERE march, which is what the panel draws.');
w('| station | time s | pressure psia | temperature degR |');
w('| --- | --- | --- | --- |');
afi.stations.filter((_, i) => i % 10 === 0 || i === afi.stations.length - 1).forEach((st, i) => {
  w(`| ${i} | ${e6(st.tS)} | ${e6(st.pPsia)} | ${e6(st.tR)} |`);
});
w();
let monotone = true;
for (let i = 1; i < afi.stations.length; i += 1) if (afi.stations[i].pPsia > afi.stations[i - 1].pPsia) monotone = false;
must('the AFIESERE trajectory falls monotonically in pressure', monotone, `${afi.stations.length} stations`);
w(`- The pressure falls at every one of the ${afi.stations.length} stations and the vessel gets colder all the way down, because the gas left behind is doing the expanding.`);
w();

/* ------------------------------------------------------------ SECTION 22 */

w('# SECTION 22: Reading a depressuring time off a curve, and the orifice that buys it (owned by Expert m02)');
w();
w('# The question a depressuring study answers is whether the vessel is down inside the customary time. The answer is read off the march, and the orifice is what buys it.');
w('| orifice in (stated) | time s | time min, derived | final temperature degR | steps | substeps |');
w('| --- | --- | --- | --- | --- | --- |');
AFIESERE_ORIFICE_SWEEP.forEach((d) => {
  const r = R.blowdown({ ...AFIESERE, orificeDIn: d });
  if (r.error) { refusal(`the AFIESERE march at a ${d} in orifice`, (x) => R.blowdown(x), { ...AFIESERE, orificeDIn: d }); w(`| ${e6(d)} | refused | refused | refused | n/a | n/a |`); return; }
  success(`the AFIESERE march at a ${d} in orifice`, r);
  w(`| ${e6(d)} | ${e6(r.timeS)} | ${e6(r.timeS / 60)} | ${e6(r.finalTR)} | ${r.steps} | ${r.substeps} |`);
});
w();
const t900 = bisect(0.5, 4, (d) => { const r = R.blowdown({ ...AFIESERE, orificeDIn: d }); return r.error ? true : r.timeS > 900; });
must('the fifteen minute orifice was bracketed', Number.isFinite(t900), `${e6(t900)} in`);
w(`- THE ORIFICE AT WHICH THIS VESSEL TAKES EXACTLY FIFTEEN MINUTES, bisected on the engine own time: ${e6(t900)} in, where the march returns ${e6(R.blowdown({ ...AFIESERE, orificeDIn: t900 }).timeS)} s.`);
w(`- The time does not scale with the diameter. Read the sweep: doubling the orifice from ${e6(1.0)} in to ${e6(2.0)} in takes the time from ${e6(R.blowdown({ ...AFIESERE, orificeDIn: 1.0 }).timeS)} s to ${e6(R.blowdown({ ...AFIESERE, orificeDIn: 2.0 }).timeS)} s, a ratio of ${e12(R.blowdown({ ...AFIESERE, orificeDIn: 2.0 }).timeS / R.blowdown({ ...AFIESERE, orificeDIn: 1.0 }).timeS)}.`);
w();
w('# THE COLD END. The final temperature does not depend on the orifice at all, and the sweep above is the evidence: the end state is fixed by the pressure ratio and the isentropic exponent, and the orifice only decides how long it takes to get there.');
const coldSet = new Set(AFIESERE_ORIFICE_SWEEP.map((d) => { const r = R.blowdown({ ...AFIESERE, orificeDIn: d }); return r.error ? 'err' : e6(r.finalTR); }));
must('the final temperature is the same at every orifice that finishes', coldSet.size <= 2, `${coldSet.size} distinct values including refusals`);
w(`- Distinct final temperatures across the orifice sweep, counted: ${coldSet.size}.`);
w('| end pressure psia (stated) | time s | final temperature degR | final degF, derived | fraction of inventory removed |');
w('| --- | --- | --- | --- | --- |');
[600, 400, 250, 145, 80, 40, 25].forEach((pe) => {
  const r = R.blowdown({ ...AFIESERE, pEndPsia: pe });
  if (r.error) { w(`| ${e6(pe)} | refused | refused | refused | refused |`); return; }
  success(`the AFIESERE march down to ${pe} psia`, r);
  w(`| ${e6(pe)} | ${e6(r.timeS)} | ${e6(r.finalTR)} | ${e6(r.finalTR - 459.67)} | ${e6(1 - r.massRemainingLb / r.initialMassLb)} |`);
});
w();
w(`- THE MODEL STATES ITS OWN LIMIT. The march assumes choked flow the whole way down, and it stops being choked below ${e6(afi.chokedToPsia)} psia against the stated back pressure. The rows above that cross it carry the engine own warning.`);
const warnedRow = R.blowdown({ ...AFIESERE, pEndPsia: 25 });
must('an end pressure below the choked floor carries the warning', typeof warnedRow.warning === 'string', `warning=${warnedRow.warning}`);
w(`- At an end pressure of ${e6(25)} psia the engine returns: ${warnedRow.warning}`);
w();

/* ------------------------------------------------------------ SECTION 23 */

w('# SECTION 23: A step size is an answer (owned by Expert m03)');
w();
w('# An explicit march has a step, and a reader is entitled to know what that step is worth. The step is halved seven times over a contiguous sequence, because a convergence table is only honest over a contiguous slice.');
w('| time step s (stated) | time s | final temperature degR | steps | substeps | time against the finest, ratio |');
w('| --- | --- | --- | --- | --- | --- |');
const finest = R.blowdown({ ...AFIESERE, dtS: AFIESERE_STEP_SWEEP[AFIESERE_STEP_SWEEP.length - 1] });
success('the AFIESERE march at the finest step', finest);
AFIESERE_STEP_SWEEP.forEach((dt) => {
  const r = success(`the AFIESERE march at a step of ${dt} s`, R.blowdown({ ...AFIESERE, dtS: dt }));
  w(`| ${e6(dt)} | ${e6(r.timeS)} | ${e6(r.finalTR)} | ${r.steps} | ${r.substeps} | ${e12(r.timeS / finest.timeS)} |`);
});
w();
const times = AFIESERE_STEP_SWEEP.map((dt) => R.blowdown({ ...AFIESERE, dtS: dt }).timeS);
const spreadT = Math.max(...times) - Math.min(...times);
must('refining the step converges the time', spreadT < 0.01, `spread ${e12(spreadT)} s across the sweep`);
w(`- REFINING THE STEP CONVERGES. Across a sixty-four-fold refinement the time moves by ${e12(spreadT)} s in total, which is smaller than the precision this digest prints a time at. The ratio column is the evidence: read it top to bottom.`);
w(`- The march lands ON the end pressure rather than stepping past it. AFIESERE finishes at ${e12(afi.finalPPsia)} psia against a target of ${e6(AFIESERE.pEndPsia)} psia, a difference of ${e12(afi.finalPPsia - AFIESERE.pEndPsia)} psia.`);
w(`- NO STEP REMOVES MORE THAN A TWENTIETH OF THE INVENTORY. The engine subdivides a step that would, and reports how many it subdivided. At the stated step AFIESERE subdivided ${afi.substeps} of its ${afi.steps} steps.`);
w();
w('# The same study on a small vessel through a large orifice, which is where a fixed step has the least to work with.');
w('| case (stated) | time s | final pressure psia | final temperature degR | steps | substeps |');
w('| --- | --- | --- | --- | --- | --- |');
ZERO_TIME_CASES.forEach((c) => {
  const r = success(`the march at ${c.volumeFt3} ft3 through a ${c.orificeDIn} in orifice`, R.blowdown(c));
  must(`the march at ${c.volumeFt3} ft3 through a ${c.orificeDIn} in orifice reaches its end pressure`,
    Math.abs(r.finalPPsia - c.pEndPsia) < 1e-6 && r.timeS > 0, `timeS=${r.timeS}, finalPPsia=${r.finalPPsia}`);
  w(`| ${e6(c.volumeFt3)} ft3, ${e6(c.orificeDIn)} in orifice | ${e6(r.timeS)} | ${e6(r.finalPPsia)} | ${e6(r.finalTR)} | ${r.steps} | ${r.substeps} |`);
});
w();
w('- EVERY ROW ABOVE REACHES ITS END PRESSURE AND REPORTS A TIME ABOVE ZERO. The substep column is why: the first step at these geometries would take out more mass than the vessel holds, so the engine cuts it until no step removes more than a twentieth.');
w();

/* ------------------------------------------------------------ SECTION 24 */

w('# SECTION 24: The published blowdown cases (owned by Expert m01, m02 and m03)');
w();
w(`# ${GOLD.blowdown.length} published blowdown rows, re-run through the engine.`);
w('| golden volume ft3 | golden p0 psia | golden pEnd psia | golden t0 degR | golden mw | golden k | golden z | golden orifice in | golden cd | published time s | engine time s | relative difference | published final degR | published start lb | published end lb |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.blowdown.forEach((g, i) => {
  const r = success(`the published blowdown row ${i + 1}`, R.blowdown(g));
  const d = agree(`the published blowdown row ${i + 1}`, r.timeS, g.timeS, 2e-3);
  w(`| ${e6(g.volumeFt3)} | ${e6(g.p0Psia)} | ${e6(g.pEndPsia)} | ${e6(g.t0R)} | ${e6(g.mw)} | ${e6(g.k)} | ${e6(g.z)} | ${e6(g.orificeDIn)} | ${e6(g.cd)} | ${e6(g.timeS)} | ${e6(r.timeS)} | ${d} | ${e6(g.finalTR)} | ${r4(g.initialMassLb)} | ${r4(g.massRemainingLb)} |`);
});
const bigOrifice = GOLD.blowdown.filter((g) => g.orificeDIn >= 4);
const smallVessel = GOLD.blowdown.filter((g) => g.volumeFt3 <= 10);
must('the published blowdown set covers a large orifice', bigOrifice.length >= 1, `${bigOrifice.length} rows`);
must('the published blowdown set covers a small vessel', smallVessel.length >= 1, `${smallVessel.length} rows`);
w();
w(`- ${bigOrifice.length} of the ${GOLD.blowdown.length} rows use an orifice of 4 in or larger and ${smallVessel.length} sits at 10 ft3 or smaller. Those are the geometries where a fixed step has the least room, and a published set without them cannot discriminate a march that stops before it starts.`);
w('- The oracle for this route solves the SAME march in closed form in SI, so the time, the isentropic exponent and the absence of any hidden coefficient are all checked at once. It makes the same two model assumptions on purpose, a constant compressibility and choked flow throughout, so what the published set checks is the march and not the thermodynamics.');
w();

/* ------------------------------------------------------------ SECTION 25 */

w('# SECTION 25: The point source, asked both ways, and two tables with the same numbers (owned by Expert m04)');
w();
w('# A flare radiates, and the API 521 point source is the screening model for how much of that reaches a distance. The relief engine carries it in both directions: the intensity at a distance, and the distance an allowable intensity demands.');
w(`- The solid angle in the relation, measured from one intensity against its own stated inputs: ${e12(FOUR_PI)}.`);
w(`- The two directions against each other: an intensity of ${e12(POINT_ROUNDTRIP.k1)} kW/m2 at ${e6(PROBES.pointSource.distanceM)} m, and the distance the inverse demands for that intensity, ${e12(POINT_ROUNDTRIP.d2)} m. Ratio ${e12(POINT_ROUNDTRIP.ratio)}.`);
w('- A ROUND TRIP THROUGH A FUNCTION AND ITS OWN INVERSE IS AN IDENTITY AND PROVES NOTHING ABOUT THE MODEL. It proves the two implementations agree. The oracle derives the sphere area by QUADRATURE and the inverse by BISECTION on that same quadrature, which is what makes the model itself checked rather than only self-consistent.');
w();
w('# The AFIESERE flare, with the distance walked.');
w(`- Stated: a relief rate of ${r4(AFIESERE_FLARE.reliefWLbHr)} lb/hr at a lower heating value of ${r4(AFIESERE_FLARE.lhvBtuLb)} Btu/lb, a radiated fraction of ${e6(AFIESERE_FLARE.fractionRadiated)} and a transmissivity of ${e6(AFIESERE_FLARE.transmissivity)}.`);
w(`- Heat release, DERIVED from the two stated figures through the Btu per hour to kilowatt conversion: ${r4(afiFlareKw)} kW.`);
w('| distance m (stated) | intensity kW/m2 |');
w('| --- | --- |');
RADIATION_DISTANCE_SWEEP.forEach((d) => {
  const r = success(`the AFIESERE intensity at ${d} m`, R.radiationIntensity({ qKw: afiFlareKw, distanceM: d, fractionRadiated: AFIESERE_FLARE.fractionRadiated, transmissivity: AFIESERE_FLARE.transmissivity }));
  w(`| ${e6(d)} | ${e6(r.kWm2)} |`);
});
w();
w(`- At the stated ${e6(AFIESERE_FLARE.distanceM)} m the intensity is ${e6(afiRad.kWm2)} kW/m2.`);
w('- THE INTENSITY FALLS WITH THE SQUARE OF THE DISTANCE. Read any two rows of the sweep and form the ratio of the intensities against the ratio of the squared distances.');
w();
w('# The radiated fraction and the transmissivity are both INPUTS, and both are fractions the engine validates.');
w('| radiated fraction (stated) | transmissivity (stated) | intensity at the stated distance kW/m2 |');
w('| --- | --- | --- |');
[[0.15, 1.0], [0.20, 0.92], [0.30, 0.92], [0.32, 0.92], [0.32, 1.0], [0.45, 0.80]].forEach(([fr, tau]) => {
  const r = success(`the AFIESERE intensity at fraction ${fr} and transmissivity ${tau}`, R.radiationIntensity({ qKw: afiFlareKw, distanceM: AFIESERE_FLARE.distanceM, fractionRadiated: fr, transmissivity: tau }));
  w(`| ${e6(fr)} | ${e6(tau)} | ${e6(r.kWm2)} |`);
});
w();
w('# THE SETBACK IS NOT TAUGHT HERE. A flare setback computed from a heat release, the pool fire behind it and the four customary allowable intensities with their held-for-literature caveat are all owned by the Separation & Slug Catching course, which is already live and grades a setback of its own. This course teaches the point source as the RELIEF engine second copy of the same model and hands the setback question back by name.');
w('- What this section does show is the inverse EXISTS and validates the same four inputs as the forward direction. Both refuse a radiated fraction of zero, a transmissivity above one and a negative transmissivity. Section 26 runs every one of those.');
w();
w(`# TWO TABLES WITH THE SAME NUMBERS. Two engines in this package export the customary allowable intensities: the relief engine and the spacing engine. They now carry IDENTICAL wording, and the jest suite asserts they stay equal, so one learner cannot meet two sets of words for one published table.`);
w('| kW/m2 | label in the relief engine | label in the spacing engine | equal |');
w('| --- | --- | --- | --- |');
R.RADIATION_LEVELS.forEach((row, i) => {
  const other = SP.RADIATION_LEVELS[i];
  must(`RADIATION_LEVELS row ${i + 1} matches between the two engines`, row.kWm2 === other.kWm2 && row.label === other.label, `${row.label} / ${other.label}`);
  w(`| ${e6(row.kWm2)} | ${row.label} | ${other.label} | yes |`);
});
w();
w('- THE VALUES ARE CUSTOMARY AND THE WORDING IS THIS PACKAGE OWN. No publication in this repository checks either, so the whole table is HELD FOR LITERATURE, taught as a stated limit and never as an answer. Nothing graded in this course reads a row of it.');
w();

/* ------------------------------------------------------------ SECTION 26 */

w('# SECTION 26: Every refusal this module can produce, and the contract behind them (owned by Expert m05 l04)');
w();
w('# THE CONTRACT: every route in this module returns either a finite result or an object carrying an `error` string. A non-finite number with no `error` is what a caller `if (r.error)` guard cannot see. Each row below is ONE bad input with everything else sound, so the message and the input that caused it are on the same row.');
w('- EVERY ROW WAS RUN AND EVERY ROW REFUSED. The build asserts it: a row labelled a refusal whose call succeeded would print success fields under a refusal heading, and no numeric sweep can see that.');
w('| route | the one bad input (stated) | the refusal |');
w('| --- | --- | --- |');
let refusalCount = 0;
REFUSALS.forEach(([fnName, why, arg]) => {
  const fn = R[fnName];
  must(`${fnName} exists`, typeof fn === 'function', typeof fn);
  const r = refusal(`${fnName} given ${why}`, fn, arg);
  refusalCount += 1;
  w(`| ${fnName} | ${why} | ${typeof r === 'number' ? String(r) : r.error} |`);
});
w();
w(`- ${refusalCount} refusals, across ${new Set(REFUSALS.map((x) => x[0])).size} of the module routes.`);
w('- ONE RULE COVERS EVERY CERTIFIED COEFFICIENT: a certified coefficient is a fraction of an ideal, so it must be above zero and no more than one, and the refusal names the offender. That rule runs on Kd, Kb, Kc, Kw, KSH, the environment factor, the radiated fraction, the transmissivity and the blowdown discharge coefficient.');
w('- A DRAINAGE ANSWER MUST BE A REAL BOOLEAN. The string "false" is truthy in JavaScript, so a select element that sends a string would otherwise buy the drainage credit silently. The engine refuses it by name.');
w('- THE TIME STEP MUST BE ABOVE ZERO, and there is a step budget behind that. A march whose clock never advances can never reach its own time limit.');
w();
w('# The soft states: calls that SUCCEED but attach a warning, which is a different thing from a refusal and is read differently.');
w('| route | condition (stated) | warning |');
w('| --- | --- | --- |');
[
  ['gasVaporArea', 'a back pressure above the ratio the chart warning fires at', () => R.gasVaporArea({ ...oruCall, p2Psia: 0.45 * oruP1 })],
  ['gasVaporArea', 'a typed Kb in the subcritical branch', () => R.gasVaporArea({ ...oruCall, p2Psia: 0.8 * oruP1, kb: 0.72 })],
  ['liquidArea', 'a viscosity far off the certified envelope', () => R.liquidArea({ ...akaBase, muCp: 40000 })],
  ['steamArea', 'a relieving pressure inside the band where the correction enlarges the valve', () => R.steamArea({ ...tebCall, p1Psia: 1550 })],
  ['fireReliefLoad', 'a latent heat below the near-critical edge', () => R.fireReliefLoad({ qBtuHr: benDuty.qBtuHr, latentBtuLb: 30 })],
  ['blowdown', 'an end pressure below the choked floor', () => R.blowdown({ ...AFIESERE, pEndPsia: 25 })],
].forEach(([fnName, why, call]) => {
  const r = success(`${fnName} with ${why}`, call());
  must(`${fnName} with ${why} attaches a warning`, typeof r.warning === 'string', `warning=${r.warning}`);
  w(`| ${fnName} | ${why} | ${r.warning} |`);
});
w();
w('# The notes: text the engine returns on a successful call to name a decision it has left to the caller.');
w('| route | note |');
w('| --- | --- |');
w(`| fireHeatInput | ${benDuty.note} |`);
w(`| koDrumHorizontal, at the ODIDI drum | ${odiDrum.note || 'none at this L over D'} |`);
// A ROUTE THAT RETURNS NO NOTE RETURNS `null`, AND THIS TABLE PRINTED THAT WORD
// in the column where a note belongs, which reads as an engine that answered
// "null". The absence is now said in words. Found by the whole-digest
// non-number pass at the foot of this file, which nothing else was looking for.
const noteOf = (label, r) => {
  must(`the note on ${label} is a string or is absent`,
    r.note === null || typeof r.note === 'string', `note is ${typeof r.note}`);
  return r.note === null ? 'none: the engine left no note on this call' : r.note;
};
w(`| koDrumHorizontal, at a 5 ft drum on the same duty | ${noteOf('a 5 ft drum', R.koDrumHorizontal({ ...odiDrumCall, diameterFt: 5 }))} |`);
w(`| koDrumHorizontal, at a 14 ft drum on the same duty | ${noteOf('a 14 ft drum', R.koDrumHorizontal({ ...odiDrumCall, diameterFt: 14 }))} |`);
w();

/* ------------------------------------------------------------ SECTION 27 */

w('# SECTION 27: What is computed, what is typed, and what is never checked (owned by Expert m05 l01 and l03)');
w();
w('# THE AUDIT. Three columns, and the third is the one that matters. A figure this engine COMPUTES is derived from a closed form it can state. A figure it TYPES is a published chart or table it takes as an input and names. A figure that is NEVER CHECKED is one the validation oracle cannot derive by any independent route, so nothing in this package would notice if it drifted.');
w('| quantity | computed, typed or held | what checks it |');
w('| --- | --- | --- |');
w(`| the gas coefficient C, ${e12(C520)} times the bracket | COMPUTED from k | the oracle derives the isentropic nozzle mass flux in absolute SI |`);
w('| the critical pressure ratio | COMPUTED from k | the oracle finds it as the ARGMAX of that flux by golden-section search |');
w(`| the subcritical leading constant ${e12(C735)} and F2 | COMPUTED from k and the pressure ratio | the oracle integrates the subcritical nozzle flux from the isentropic expansion |`);
w(`| the liquid leading constant ${e12(C38)} | COMPUTED | the oracle checks it against the published SI form |`);
w(`| the liquid Reynolds constant ${e12(C2800)} | COMPUTED | the oracle derives it from rho u D over mu in SI |`);
w('| the Kv fit coefficients | HELD FOR LITERATURE | NOTHING. An empirical fit no route in this package can derive. The oracle shares it on purpose and says so in its own header. What the published set CAN discriminate is engine-side drift, through its low-Reynolds row |');
w('| the Kv clamp at one | a stated CONVENTION of this engine | the suite pins it, and the unclamped fit is exported so the asymptote stays inspectable |');
w(`| the steam leading constant ${e12(C515)} | COMPUTED | the oracle checks it against the published SI form |`);
w('| the Napier fit | COMPUTED from the pressure | the oracle checks it against the SI statement of Napier |');
w(`| the Napier threshold ${e12(KN_THRESHOLD)} psia and the top of the range ${e12(KN_TOP)} psia | HELD FOR LITERATURE, published BOUNDARIES | nothing derives them. The suite pins both as behaviour |`);
w(`| the crossing back through unity, ${e12(R.NAPIER_UNITY_PSIA)} psia | COMPUTED from the fit and EXPORTED | it falls out of the fit the oracle checks |`);
w('| Kb for gas, Kw for liquid, KSH for steam | TYPED, published CHARTS and TABLES | nothing. They are inputs by design with their references named |');
w(`| the API 526 table, ${R.API_ORIFICES.length} rows | TYPED, a published TABLE | nothing derives the areas. The suite checks the SELECTION BEHAVIOUR: the ladder, both boundaries and the refusal past the largest |`);
w(`| the pool fire constants ${e12(C21000)} and ${e12(C34500)}, and the exponent ${e12(FIRE_EXP)} | HELD FOR LITERATURE | the oracle checks the USC pair against the published SI pair with the exponent carried through the unit conversion, which checks the UNIT PACKAGING and not the pool-fire physics |`);
w('| the 25 ft wetted-height limit | a stated LIMIT the caller applies | nothing. It depends on the plot elevation the engine is never told, and it arrives as a note |');
w('| the exact circular segment, both orientations | COMPUTED | the oracle sums a polyline round the real circle with Richardson extrapolation |');
w('| the terminal-velocity balance | COMPUTED | the oracle bisects on the force residual in SI, which recovers the coefficient the balance carries |');
w('| the sphere-drag correlation and its low-Reynolds cap | HELD FOR LITERATURE | NOTHING. An empirical fit, shared with the oracle on purpose |');
w('| the drum segment area and the length | COMPUTED | the oracle uses Simpson quadrature and a transit time against a fall time, in SI |');
w(`| the solid angle ${e12(FOUR_PI)} in the point source | COMPUTED | the oracle finds the sphere area by quadrature and the inverse by bisection on that quadrature |`);
w('| the radiated fraction and the transmissivity | TYPED inputs | nothing, and nothing should: they are project figures |');
w('| the four customary allowable intensities and their labels | HELD FOR LITERATURE | nothing. Customary values with wording this package wrote. A merged sibling course already teaches them |');
w(`| the universal gas constant ${e12(RGAS_UNIVERSAL)} | COMPUTED | the oracle uses the SI gas constant in its closed form |`);
w('| a constant compressibility along the blowdown path, and choked flow throughout | stated MODEL DECISIONS | the oracle makes the same two deliberately, so the published set checks the march and not the thermodynamics. The engine names the pressure below which the choked half stops holding |');
w('| the heads ignored in the wetted area | a stated MODEL DECISION | nothing, and it is conservative for the shell term |');
w();
w('# TWO INPUTS THAT CHANGE NOTHING, AND WHY EACH IS DIFFERENT.');
const kbCritical = [1.0, 0.8, 0.6].map((kb) => R.gasVaporArea({ ...oruCall, p2Psia: 0.8 * oruP1, kb }).areaIn2);
must('Kb changes nothing in the subcritical branch', new Set(kbCritical.map(e12)).size === 1, kbCritical.map(e12).join(', '));
w(`- Kb IN THE SUBCRITICAL BRANCH. Three different values give ${kbCritical.map(e12).join(', ')} in2, one figure to twelve decimals. That is CORRECT: the standard uses F2 there and Kb has no place in it. The engine says so in a warning rather than leaving the reader to discover it.`);
const kshOne = R.steamArea({ ...tebCall, ksh: 1.0 }).areaIn2;
const kshLow = R.steamArea({ ...tebCall, ksh: 0.83 }).areaIn2;
must('KSH does change the steam area', kshOne !== kshLow, `${e12(kshOne)} and ${e12(kshLow)}`);
w(`- KSH, BY CONTRAST, ALWAYS DIVIDES. ${e6(1.0)} gives ${e6(kshOne)} in2 and ${e6(0.83)} gives ${e6(kshLow)} in2, a ratio of ${e12(kshLow / kshOne)} against a factor ratio of ${e12(1 / 0.83)}. An input that never moves an answer and an input that always does are read differently, and the first question to ask of any input is which kind it is.`);
w();
w('# THE INPUT THAT CHANGES NOTHING IS A CLASS OF DEFECT, AND THE TEST FOR IT IS ARITHMETIC. Take the input, walk it across its whole declared range at everything-else-fixed, and print the spread of the answer. The drum holdup sweep in section 18 is exactly that test, run on an input that does move its answer. Run it on any input and compare the spread with the precision the answer prints at.');
w();

/* ------------------------------------------------------------ SECTION 28 */

w('# SECTION 28: What the published cases can and cannot discriminate (owned by Expert m05 l02 and l05)');
w();
w('# A published case is only worth what it can tell apart. A route whose validation oracle is an INDEPENDENT DERIVATION goes red when the engine moves, because two derivations disagree. A route whose oracle is a TRANSCRIPTION of the engine cannot, because there is only one derivation.');
w('| route | the oracle route | independent |');
w('| --- | --- | --- |');
[
  ['gas, critical', 'the isentropic nozzle mass flux from R, M, T and P in absolute SI', 'yes'],
  ['gas, subcritical', 'the subcritical nozzle flux integrated from the isentropic expansion', 'yes'],
  ['the critical ratio', 'the argmax of that flux over the throat ratio, by golden-section search', 'yes'],
  ['liquid area', 'the published SI form of the same equation', 'yes'],
  ['the liquid Reynolds relation', 'rho u D over mu in SI with D as sqrt(4A/pi)', 'yes'],
  ['the Kv fit', 'nothing: SHARED with the engine on purpose', 'NO, and it is named as held'],
  ['steam area', 'the published SI form and the SI statement of Napier', 'yes'],
  ['the fire duty', 'the published SI pair with the exponent carried through the unit conversion', 'the unit packaging only'],
  ['the relief load', 'every unit packaging, through kW and kg/s', 'yes'],
  ['wetted area, both orientations', 'polyline summation round the real circle with Richardson extrapolation', 'yes'],
  ['droplet settling', 'bisection on the force residual in SI', 'yes for the balance'],
  ['the drag correlation', 'nothing: SHARED with the engine on purpose', 'NO, and it is named as held'],
  ['the knockout drum', 'Simpson quadrature of the segment integral, and a transit time against a fall time, in SI', 'yes'],
  ['point-source radiation, both directions', 'the sphere area by quadrature, and the inverse by bisection on that quadrature', 'yes'],
  ['the blowdown march', 'the same march solved IN CLOSED FORM in SI', 'yes'],
].forEach(([route, how, ind]) => { w(`| ${route} | ${how} | ${ind} |`); });
w();
w('# A PUBLISHED CASE CAN ALSO FAIL TO DISCRIMINATE ITS OWN CONSTANT, WHICH IS NOT THE SAME THING AS A MISSING CASE. The test is arithmetic: take the constant, move it by a realistic amount, and ask whether the answer moves by more than the tolerance the case is checked at.');
w('| what is being discriminated | where the published set places a case | the evidence on this page |');
w('| --- | --- | --- |');
w(`| the inverse-three-halves term of the Kv fit | at a Reynolds number of ${e6(lowRe.length ? lowRe[0].reynolds : NaN)} | the term table in section 6, which prints what that term is worth as a fraction of the sum at each Reynolds number |`);
w(`| the Napier fit | at ${napierActive.map((g) => e6(g.p1Psia)).join(' and ')} psia | the sweep in section 8, which prints KN and the area together across the whole published range |`);
w(`| the blowdown march at its hardest geometry | at ${GOLD.blowdown.map((g) => `${e6(g.volumeFt3)} ft3 through ${e6(g.orificeDIn)} in`).join(', ')} | the table in section 23, which runs the small-vessel large-orifice cases and prints the substep count |`);
w(`| the drum holdup as an input that must move its answer | at ${drumHoldups.size} distinct holdups on one drum | the sweep in section 18, which prints the spread across the whole range |`);
w();
w('# THE TWO THINGS THIS PACKAGE CANNOT DISCRIMINATE, STATED PLAINLY. The Kv fit coefficients and the sphere-drag correlation are shared between the engine and its oracle on purpose, because no route here can derive either. Move one of them in both files and every published case still passes. That is the honest statement of the limit, and it is why nothing graded in this course rests on either of them.');
w(`- The published set carries ${GOLD.gas.length + GOLD.liquid.length + GOLD.steam.length + GOLD.wetted.length + GOLD.fire.length + GOLD.load.length + GOLD.dropout.length + GOLD.drum.length + GOLD.radiation.length + GOLD.setback.length + GOLD.blowdown.length} rows across ${Object.keys(GOLD).length} blocks: ${Object.keys(GOLD).sort().map((k2) => `${k2} ${GOLD[k2].length}`).join(', ')}.`);
w();
w('# The published radiation and setback rows, re-run, because they are the two blocks no section above walks.');
w('| golden release kW | golden distance m | golden radiated fraction | golden transmissivity | published intensity kW/m2 | engine kW/m2 | relative difference |');
w('| --- | --- | --- | --- | --- | --- | --- |');
GOLD.radiation.forEach((g, i) => {
  const r = success(`the published radiation row ${i + 1}`, R.radiationIntensity(g));
  const d = agree(`the published radiation row ${i + 1}`, r.kWm2, g.kWm2, 1e-12);
  w(`| ${r4(g.qKw)} | ${e6(g.distanceM)} | ${e6(g.fractionRadiated)} | ${e6(g.transmissivity)} | ${e6(g.kWm2)} | ${e6(r.kWm2)} | ${d} |`);
});
w();
w('| golden release kW | golden allowable kW/m2 | golden radiated fraction | golden transmissivity | published distance m | engine distance m | relative difference |');
w('| --- | --- | --- | --- | --- | --- | --- |');
GOLD.setback.forEach((g, i) => {
  const r = success(`the published setback row ${i + 1}`, R.distanceForIntensity(g));
  const d = agree(`the published setback row ${i + 1}`, r.distanceM, g.distanceM, 1e-12);
  w(`| ${r4(g.qKw)} | ${e6(g.allowableKwM2)} | ${e6(g.fractionRadiated)} | ${e6(g.transmissivity)} | ${e6(g.distanceM)} | ${e6(r.distanceM)} | ${d} |`);
});
w();

/* ------------------------------------------------------------ SECTION 29 */

w('# SECTION 29: WHAT THIS ENGINE USED TO DO. THIS SECTION IS REPAIR HISTORY, and nothing follows it (owned by Expert m06)');
w();
w('# THIS SECTION, AND ONLY THIS SECTION, DESCRIBES BEHAVIOUR THIS ENGINE NO LONGER HAS. Every sentence above this line is about the engine as it ships today. Every sentence below is about what it did before the repair that preceded this course, and each item is a GENERAL LESSON that happens to have an example here. A sentence about former behaviour that reads as current behaviour is a defect, and the frame for this material is this heading and this paragraph.');
w();
const HIST = SRC.split('\n').filter((l) => l.includes('FC5-0'));
const HIST_LINES = SRC.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => /^\s*(\*|\/\/|\/\*)/.test(l) && /used to|previous version|before|no longer|turned|silently/i.test(l));
w(`- THE ENGINE SOURCE CARRIES THIS HISTORY IN ITS COMMENTS, and a sentence lifted out of a comment arrives with no frame around it. Counted by reading engines/facilities/relief.js: ${HIST.length} comment lines carry the repair marker, and ${HIST_LINES.length} comment lines are written in a past tense about former behaviour. The rule that counted them: a line that begins with a comment marker and contains one of "used to", "previous version", "before", "no longer", "turned" or "silently".`);
// A COUNT CARRIES ITS RULE. This said the module was 620 lines long, which was
// `split('\n').length` on a file of 619 lines that ends in a newline: the split
// counts the empty string after the final terminator as a line. The rule is now
// stated beside the number and the number is what `wc -l` reports, because that
// is the count a reader can reproduce.
const SRC_LINES = SRC.split('\n');
const SRC_TEXT_LINES = SRC_LINES.length - (SRC_LINES[SRC_LINES.length - 1] === '' ? 1 : 0);
must('the engine line count is the one wc -l reports',
  SRC_TEXT_LINES === SRC.split('\n').length - 1 && SRC.endsWith('\n'),
  `${SRC_TEXT_LINES} lines of text, split gives ${SRC.split('\n').length}, ends with a newline ${SRC.endsWith('\n')}`);
w(`- The module is ${SRC_TEXT_LINES} lines of text long, counting a line as a run ending in a newline the way wc -l does, so roughly one line in ${Math.round(SRC_TEXT_LINES / Math.max(HIST_LINES.length, 1))} of it is a sentence about what it used to do. Engine source comments are PROVENANCE. So are the wave RECON.md and FINDINGS.md, and so is the repair own findings record vendored beside the oracle. None of the four is teaching truth.`);
w();
w('# ITEM ONE. AN OUTPUT THAT READ AS REASSURANCE.');
w('- The general lesson: the worst failure of a calculation is not a wrong number, it is a wrong number shaped like the answer somebody wanted. A depressuring study is run to ask whether a vessel is down inside the customary time, and the failure answered yes.');
w('- Before the repair, when the first step of the blowdown march would have removed more mass than the vessel held, the loop broke with the clock still at zero, the time limit test was therefore false, and the function returned a time of zero seconds with the vessel still at its start pressure and NO error key. Every caller guard passed and the screen printed a depressuring time of zero minutes under a hint saying that was inside the customary fifteen.');
w(`- Today the same geometries march properly, because no step may remove more than a twentieth of the inventory. The three cases in section 23 are exactly those geometries and every one reaches its end pressure with a time above zero.`);
w();
w('# ITEM TWO. AN INPUT THAT COULD NOT MOVE THE ANSWER PRINTED BESIDE IT.');
w('- The general lesson: two factors that cancel algebraically leave a box on a screen that a user will turn, watching nothing happen, and conclude the quantity does not matter. The test is arithmetic and takes one sweep: walk the input across its whole range and print the spread of the answer.');
w('- Before the repair the drum used the same factor for the vapour cross-section and for the fall distance, and the two cancelled exactly, so the holdup box moved the required length by less than a millionth of a millionth of a foot across its entire range while the vapour velocity printed on the same row moved by a factor of ten. The input was also ambiguous, used once as an area fraction and once as a depth fraction.');
w('- Today the input is the liquid LEVEL as a fraction of the diameter, which is what a level instrument reads, the vapour cross-section is the exact circular segment above it, and the engine returns the depth, the area fraction, the vapour area and the fall distance so the convention is visible. The sweep in section 18 is the same test, run on the repaired engine.');
w();
w('# ITEM THREE. A CONSTANT HIDDEN INSIDE A FUNCTION THAT ALREADY TOOK IT AS AN INPUT.');
w('- The general lesson: a number applied twice is invisible on the answer and visible only in a ratio. The way to find one is to rebuild the quantity from first principles and divide.');
w('- Before the repair the blowdown mass flow multiplied the caller discharge coefficient by a second, hard-coded coefficient of its own, so a typed value ran about two and a half percent low and the time came out that much long, with the fifteen-minute verdict read off it.');
w('- Today the closed-form comparison in section 21 is what would catch it: the marched time against the exact integral of the same balance, and the ratio column reads one.');
w();
w('# ITEM FOUR. A GATE THAT COULD NOT FAIL.');
w('- The general lesson: a validation case is only worth what it can tell apart, and there are two separate ways it can be worth nothing. It can be MISSING, so a route has no case at all. Or it can be PRESENT AND UNABLE TO DISCRIMINATE, sitting where the constant it is supposed to check is worth less than the tolerance it is checked at.');
w('- Before the repair, twenty defects planted one at a time in the engine left the published suite entirely green in seven cases, including an inverted division inside the drum own length equation. Three whole routes had no published case and no oracle route at all, and five oracle routes were transcriptions of the engine rather than independent derivations, proved by planting the same defect in both files and regenerating the published set.');
w(`- Today the published set carries ${Object.keys(GOLD).length} blocks and the suite is materially larger, the five transcriptions are independent derivations, and the two routes nothing can discriminate are NAMED in section 28 rather than left to be discovered. Section 27 and section 28 are the standing form of that lesson, about the engine as it is now.`);
w();
w('# NOTHING FOLLOWS THIS SECTION.');

/* ------------------------------------------- TWO WHOLE-DIGEST FINAL PASSES

   Both exist because a defect the per-row assertions above cannot see got all
   the way onto the page. They run over the ASSEMBLED OUTPUT, so no section is
   outside them, and they fail the build like any other assertion: nothing is
   written.

   ONE. NO NON-NUMBER IN A MEASUREMENT SLOT. The finite check in the
   measurements block covered the constants of section 2 and nothing else, so
   the other 28 sections had nothing looking at them, and section 10 printed
   "the load at which it changes is NaN lb/hr" and "the required area is
   undefined in2". Every line of the digest is swept for NaN, undefined,
   Infinity or null standing where a figure belongs.

   TWO. NO COUNT SPELLED AS A WORD. Section 5 said "Three of the 5 rows carry
   certified coefficients away from the defaults" when exactly one did. The word
   was typed in this generator, so the numeric-literal gate, which sweeps
   NUMBERS, could not see it, and the movement gate, which compares figures the
   data produced, was never shown one. Any English cardinal word that could be a
   count of printed rows must be declared here BY EXACT SENTENCE, and a
   declaration that stops matching fails, so the ledger cannot go stale.       */

const NON_NUMBERS = /(?<![A-Za-z`])(NaN|undefined|Infinity|-Infinity|null)(?![A-Za-z`])/g;
// The only places these words are legitimate: the digest TEACHES the NaN
// refusal contract and prints `null` for a field the engine leaves unset. Each
// is declared by the exact substring that makes it legitimate.
const NON_NUMBER_OK = [
  // The contract table's own words for the seven bare-number exports.
  'a bare number, and NaN where it refuses',
  // The bullet that counts them.
  'signal a refusal with NaN',
  // The inviscid liquid row: the engine leaves the Reynolds number unset when
  // there is no viscosity to build one from, and `null` is what it returns.
  'Reynolds null',
  // A refusal row whose INPUT was the null, quoted so the message and the input
  // that caused it are on one row.
  'a liquid level fraction given as null',
];
const nnHits = [];
const nnUsed = new Set();
out.forEach((line, i) => {
  if (!NON_NUMBERS.test(line)) return;
  NON_NUMBERS.lastIndex = 0;
  const ok = NON_NUMBER_OK.find((d) => line.includes(d));
  if (ok) { nnUsed.add(ok); return; }
  nnHits.push(`line ${i + 1}: ${line.slice(0, 160)}`);
});
must('NO NON-NUMBER STANDS WHERE A MEASUREMENT BELONGS, in any section',
  nnHits.length === 0, nnHits.length ? nnHits.join(' | ') : `${out.length} lines swept, ${nnUsed.size} declared contract line(s) hit`);
must('every declared non-number contract line is still live',
  nnUsed.size === NON_NUMBER_OK.length,
  `${nnUsed.size} of ${NON_NUMBER_OK.length} hit; dead: [${NON_NUMBER_OK.filter((d) => !nnUsed.has(d)).join(' | ')}]`);

// A COUNT OF PRINTED ROWS IS A NUMERAL, NEVER A WORD. This is the whole rule,
// and it needs no ledger of exemptions: ordinary prose uses "two" and "three"
// freely and nothing here objects, but the two shapes that STATE A COUNT OF
// ROWS, "<n> of the <total> rows" and "the first <n> rows", must carry a digit.
// A digit is a figure the typed-literal gate can sweep, the movement gate can
// compare and digestfigures can recompute against the table. A word is
// invisible to all three, which is how "Three of the 5 rows" reached a page
// where exactly one row did what it claimed.
const SPELLED = '(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|'
  + 'thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)';
// NO NUMERIC QUANTIFIER APPEARS IN THIS PATTERN, deliberately: the wave's typed
// literal gate sweeps this file for numbers it cannot explain, and a `{0,2}`
// inside a regex reads to it as two typed numbers. An optional single adjective
// before the noun does the same work.
const SPELLED_ROW_COUNT = new RegExp(
  `\\b${SPELLED}\\b\\s+of\\s+(?:the\\s+)?\\S+\\s+(?:rows?|cases?|entries|lines)\\b`
  + `|\\bfirst\\s+${SPELLED}\\b\\s+(?:\\w+\\s+)?(?:rows?|lines)\\b`
  + `|\\blast\\s+${SPELLED}\\b\\s+(?:\\w+\\s+)?(?:rows?|lines)\\b`, 'i');
const swHits = [];
out.forEach((line, i) => {
  const m = line.match(SPELLED_ROW_COUNT);
  if (m) swHits.push(`line ${i + 1} [${m[0]}]: ${line.slice(0, 140)}`);
});
must('EVERY COUNT OF PRINTED ROWS IS A NUMERAL, in any section',
  swHits.length === 0,
  swHits.length ? swHits.join(' | ') : `${out.length} lines swept for a spelled row count`);
// NEGATIVE CONTROL: the rule must be able to fail. The sentence that made this
// guard necessary is run through it verbatim, and a guard that passes it is not
// a guard.
must('the spelled-row-count rule catches the sentence it was written for',
  SPELLED_ROW_COUNT.test('- Three of the 5 rows carry certified coefficients away from the defaults.')
  && SPELLED_ROW_COUNT.test('Read the first five rows: the required area is identical across them.')
  && !SPELLED_ROW_COUNT.test('- Rows carrying certified coefficients away from the engine own defaults: 1 of the 5 rows.')
  && !SPELLED_ROW_COUNT.test('- THREE DIFFERENT QUANTITIES ARE CALLED BACK PRESSURE ELSEWHERE.'),
  'both false sentences caught, both good ones passed');

/* ------------------------------------------------------- THE ASSERTIONS */

const failed = ASSERTS.filter((a) => !a.pass);
process.stderr.write(`fc5_dump: ${ASSERTS.length} label-and-call assertions run, ${failed.length} failed\n`);
if (ASSERTS.length < 200) {
  process.stderr.write('REFUSED: fewer than two hundred label assertions were run, which is not a checked digest\n');
  process.exit(2);
}
if (failed.length) {
  failed.slice(0, 40).forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write('NOTHING WRITTEN. A labelled row whose call did something else must never reach a writer.\n');
  process.exit(1);
}
process.stdout.write(`${out.join('\n')}\n`);
