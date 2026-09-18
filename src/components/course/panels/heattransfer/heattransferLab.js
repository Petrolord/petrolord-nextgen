// Teaching lab for FC6, Heat Exchange & Cooling. The three explorer panels, the
// course learning page and the vitest files all read this one module, so a
// number shown to a learner and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINE'S OWN OUTPUT. Every capacity rate,
// duty, terminal temperature, log mean, correction factor, resistance,
// coefficient, Reynolds number, Prandtl number, film coefficient, area, tube
// count, bundle diameter, effectiveness, NTU, ceiling, fan power and hot-day
// rating below is a return value of engines/facilities/heatTransfer.js, which
// imports nothing at all, as repaired in FC6-0 and vendored sha-identical with
// engines e4377b3.
//
// NOTHING IN THIS FILE COMPUTES A HEAT TRANSFER QUANTITY. Where a reader
// carries a value the teaching digest calls "derived", it is the digest's own
// arithmetic on numbers the engine returned, with the arithmetic stated, and the
// key name says Derived: a sum of five resistances, an arithmetic mean of two
// end differences, a ratio of two bundle diameters, a capacity rate over
// another. The lab and tools/course-waves/heattransfer/digest.txt agree because
// both call the engine on the same inputs, and neither copied the other.
//
// CONSTANTS ARE MEASURED, NEVER TYPED. Where the engine keeps a packaging to
// itself, the lab asks the engine a question about itself and reads the answer:
// the air heat capacity out of a bay's own air mass, the viscosity conversion
// out of a Prandtl number at a unit viscosity, the Rankine offset out of two
// densities, the layout table out of bundleConstants(). A constant written as a
// literal here would be a claim about the engine rather than a reading of it.
//
// EVERY REFUSAL IS THE ENGINE'S OWN RETURNED MESSAGE. A refusal reader hands
// back { label, message, evidence }, where the message is the string on the
// engine's `error` key and the evidence is whatever else that same return
// carried: the two outlet temperatures a crossing duty implies, the Reynolds and
// Prandtl numbers of a film in the transition band, the ceiling an arrangement
// caps an effectiveness at. No refusal string is written as a literal anywhere in
// this directory, and heattransferLab.test.js asserts that over the lab and over
// every panel source.
//
// TOLERANCES HAVE ONE SOURCE AND IT IS NOT THIS FILE. gradedTolerance.js is
// where a grading band is MADE, fields.json is written out of it, and this lab
// imports the derivation rather than holding a copy. FC2 and FC3 each ended with
// a stale third copy of their eighteen tolerances inside the lab and each
// shipped it. The re-export below is the whole of this lab's relationship with a
// tolerance, and a test asserts the lab holds no other number from that table.
//
// UNITS. Field units throughout: Btu an hour, degF, lb an hour, ft2, Btu an hour
// per ft2 per degF, hr.ft2.F per Btu, inches, psia, inches of water, brake
// horsepower. Ratios, fractions, effectivenesses, NTU and the P and R groups are
// plain numbers.
//
// NO PERCENTILE. Nothing in this course is a distribution, so no P label belongs
// anywhere in it. The letter P here is the dimensionless temperature group and
// nothing else.
//
// THE CLOCK. Nothing in this domain reads a clock or a random number. There is
// no date input, no seed and no default that falls back to the current day, so
// every reader is a pure function of its engine inputs. A clock gate in
// heattransferLab.test.js proves it under two faked system dates, and a timezone
// gate reproduces the whole lab snapshot a second time west of Greenwich.
//
// REPAIR HISTORY. Digest Section 21 is the one framed history section and this
// lab carries no history reader at all: every value here is what the engine does
// NOW. Where an engine MESSAGE quotes its own former behaviour, which four of
// this module's refusals do, the message is carried verbatim because truncating
// an engine message changes what the engine says, and `historyCarryingRefusals()`
// names those refusals so a panel can frame them.
//
// PURITY. Every function is pure and deterministic. Nothing is memoised.

import heattransferGolden from '@petrolord/engines/test-data/facilities/goldens/heattransfer_cases.json';
// A namespace rather than named imports: eslint's node resolver follows the
// node_modules symlink to the SHARED checkout's engines, which predate FC1-0 and
// carry no engines/facilities at all. Vite and vitest alias @petrolord/engines to
// this worktree's packages/engines, which does. import/namespace still checks
// members against the shared copy, so it is off for this file only, and
// heattransferLab.test.js proves every member resolves.
/* eslint-disable import/namespace */
import * as HT from '@petrolord/engines/engines/facilities/heatTransfer.js';
import { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } from './gradedTolerance.js';

export const GOLD = heattransferGolden;

/**
 * THE ONE PLACE A TOLERANCE COMES FROM, re-exported so a panel test never has to
 * type one. This lab holds no tolerance of its own and no copy of the table
 * gradedTolerance.js owns: it forwards the derivation and nothing else.
 */
export const TOLERANCE_SOURCE = { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS };

/** The published case counts, so a golden that loses a block is caught. */
export const goldenCounts = () => ({
  blocks: Object.keys(GOLD).length,
  lmtd: GOLD.lmtd.length,
  areaRequired: GOLD.areaRequired.length,
  tubeCount: GOLD.tubeCount.length,
  fCorrection: GOLD.fCorrection.length,
  fMultiShell: GOLD.fMultiShell.length,
  u: GOLD.u.length,
  tubeFilm: GOLD.tubeFilm.length,
  epsNtu: GOLD.epsNtu.length,
  ntuFromEps: GOLD.ntuFromEps.length,
  hotDay: GOLD.hotDay.length,
  airCooler: GOLD.airCooler.length,
  ceilings: GOLD.ceilings.length,
  capacityRate: GOLD.capacityRate.length,
});

// ---------------------------------------------------------------------------
// The digest's own printing precision, so a panel prints what a lesson prints.
// The digest header is the authority and gradedTolerance.js carries it as
// PRINTED_DECIMALS; these four read that table rather than restating a width.
// ---------------------------------------------------------------------------

const fixed = (x, d) => (x === null || x === undefined || Number.isNaN(Number(x)) ? 'none' : Number(x).toFixed(d));
/** degF, ft2, coefficients, inches, percentages and dimensionless groups. */
export const e6 = (x) => fixed(x, PRINTED_DECIMALS.degF);
/** Duties, capacity rates and UA, in Btu an hour. */
export const r4 = (x) => fixed(x, PRINTED_DECIMALS.btuHr);
/** Resistances and air densities, in hr.ft2.F per Btu and lb per ft3. */
export const r9 = (x) => fixed(x, PRINTED_DECIMALS.resistance);
/** Tube, pass and shell counts. */
export const n0 = (x) => fixed(x, PRINTED_DECIMALS.count);
/** A tri-state the digest prints as a word. */
export const yn = (b) => (b === true ? 'yes' : (b === false ? 'no' : 'none'));

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes a heat transfer quantity.
// ---------------------------------------------------------------------------

/** A state the engine has no answer for, returned rather than thrown. */
const softOf = (r) => (r && typeof r.error === 'string' ? r.error : null);

/**
 * A refusal as the digest reports one: the label of the state, the ENGINE'S OWN
 * message, and whatever evidence the same return carried beside it. A call that
 * ANSWERS is a defect in this lab rather than a row somebody reads, so it comes
 * back with a message of null and the refusal gate fails on it. FC4's lab
 * shipped a refusal probe that called a case which answers.
 */
const refusalOf = (label, r, evidenceKeys = []) => ({
  label,
  message: softOf(r),
  evidence: Object.fromEntries(evidenceKeys
    .filter((k) => r && r[k] !== undefined && r[k] !== null)
    .map((k) => [k, r[k]])),
});

/** Whether a whole table of engine answers agrees on one column. */
const distinct = (rows, key) => [...new Set(rows.map((row) => row[key]))];

// ---------------------------------------------------------------------------
// THE TEACHING FIELDS, copied VERBATIM from
// tools/course-waves/heattransfer/fc6_fields.mjs, which fc6_dump.mjs imports.
// heattransferLab.test.js compares each declaration with the wave file text and
// fails on any drift, so these cannot be edited here alone.
//
// THREE TEACHING CASES AND THEY SHARE NOTHING WITH THE CAPSTONE. The capstone
// runs its own units, written in the wave's capstone generator, and nothing in
// this lab imports, reads or reproduces any of it. panelCapstoneGuard.test.js
// sweeps this directory and the learning page for a graded answer in any
// rendering, and for a capstone unit by name.
// ---------------------------------------------------------------------------

export const STUDIO_HOT = { mLbHr: 50000, cpBtuLbF: 0.55 };
export const STUDIO_COLD = { mLbHr: 80000, cpBtuLbF: 1.0 };
export const STUDIO_TERMINALS = { thIn: 300, thOut: 200, tcIn: 100 };
export const STUDIO_FILM = { hoBtuHrFt2F: 200, doIn: 0.75, diIn: 0.62, kWallBtuHrFtF: 26, foulingOut: 0.001, foulingIn: 0.002 };
export const STUDIO_TUBE_FLUID = { muCp: 0.5, kBtuHrFtF: 0.08 };
export const STUDIO_GEOMETRY = { tubeLengthFt: 16, layoutDeg: 30, passes: 2, bundleClearanceIn: 2.5 };
/** The seed ladder the studio walks, because an intermediate tube count can
 *  land in the band the engine refuses. */
export const STUDIO_SEEDS = [2, 12, 60, 300];
export const STUDIO_AIR = {
  qBtuHr: 20000000, processInF: 250, processOutF: 150, ambientF: 95, airRiseF: 30,
  uBtuHrFt2F: 4.5, staticPressureInH2O: 0.6, fanEfficiency: 0.65, motorEfficiency: 0.92,
  checkAmbientF: 110, draftType: 'forced', barometricPsia: 14.7,
};

export const ORON_HOT = { mLbHr: 74000, cpBtuLbF: 0.62 };
export const ORON_COLD = { mLbHr: 112000, cpBtuLbF: 0.99 };
export const ORON_TERMINALS = { thIn: 345, thOut: 235, tcIn: 122 };
export const ORON_FILM = { hoBtuHrFt2F: 240, doIn: 1.0, diIn: 0.782, kWallBtuHrFtF: 26, foulingOut: 0.0012, foulingIn: 0.0018 };
export const ORON_TUBE_FLUID = { muCp: 0.45, kBtuHrFtF: 0.085 };
export const ORON_GEOMETRY = { tubeLengthFt: 20, layoutDeg: 30, passes: 4, bundleClearanceIn: 3 };
export const ORON_SEEDS = [4, 24, 120, 600];

export const ANTAN = {
  qBtuHr: 15500000, processInF: 235, processOutF: 158, ambientF: 98, airRiseF: 26,
  uBtuHrFt2F: 5.1, checkAmbientF: 112, draftType: 'forced', barometricPsia: 14.3,
};
/** The ambients the bay is read across, hot and cold of its design day. */
export const ANTAN_AMBIENT_SWEEP = [86, 92, 98, 104, 112, 124];
/** An elevation sweep, because the duty of this machine is set by air density. */
export const ANTAN_BAROMETRIC_SWEEP = [14.7, 14.3, 13.2, 12.0];

export const F_P_SWEEP = [0.05, 0.2, 0.45, 0.52, 0.55, 0.58, 0.6, 0.62];
export const F_R_FIXED = 0.9;
/** P as it tends to zero, which is the analytic limit F tends to 1 at. */
export const F_P_TENDING_TO_ZERO = [0.1, 0.01, 0.001, 0.0001];
export const F_R_LIMIT_SET = [0.4, 0.9, 1, 1.7, 3];
/** One duty, one to six shells in series, and the seventh that is refused. */
export const SHELL_P = 0.72;
export const SHELL_R = 0.85;
export const SHELL_COUNTS = [1, 2, 3, 4, 5, 6];
export const SHELLS_OVER_THE_BOUND = 7;
export const SHELLS_NOT_A_WHOLE_NUMBER = 2.4;
/** A duty one shell cannot reach at all, which is a refusal and a low F. */
export const UNREACHABLE_P = 0.92;
export const UNREACHABLE_R = 1.4;

/** NTU across three arrangements, and the capacity ratios that separate them. */
export const NTU_SWEEP = [0.25, 0.75, 1.4, 2.6, 4.5, 8];
export const CR_SWEEP = [0, 0.35, 0.65, 1];
export const ARRANGEMENTS = ['counter', 'parallel', 'shell1'];
/** The effectiveness a counter-current unit is asked for to show it never refuses. */
export const COUNTER_EFFECTIVENESS_PROBE = [0.9, 0.99, 0.999, 0.99999];
export const CEILING_CR = 0.65;
/** An effectiveness above the parallel and 1-2 ceilings, which is refused. */
export const OVER_CEILING_EFFECTIVENESS = 0.82;
/** A capacity ratio passed the wrong way up, which is refused by name. */
export const CR_ABOVE_ONE = 1.4;

/** The thin-wall limit: a bore, a conductivity, and walls that get thinner. */
export const WALL_DO_IN = 1.0;
export const WALL_THICKNESS_SWEEP = [0.109, 0.035, 0.01, 0.002];
export const WALL_K_SWEEP = [9, 26, 64];
export const WALL_FILMS = { hoBtuHrFt2F: 1e7, hiBtuHrFt2F: 1e7 };

/** Tube-side film: the three regimes, at the studio's own bore and fluid. */
export const FILM_FLOW_SWEEP = [2600, 12000, 45000, 120000, 400000];
export const FILM_LAMINAR_FLOW = 900;
export const FILM_TRANSITION_FLOW = 6000;
export const FILM_WALL_VISCOSITY = 0.32;
/** A cooled tube side, which this module refuses rather than answering. */
export const FILM_SERVICE_REFUSED = 'cooling';
export const FILM_SERVICE_UNKNOWN = 'condensing';
/** Tube counts that cannot divide equally into their passes. */
export const FILM_UNEQUAL_TUBES = 9;
export const FILM_UNEQUAL_PASSES = 4;

/** The bundle across the three layouts the module carries, at one area. */
export const BUNDLE_AREA_FT2 = 980;
export const BUNDLE_LAYOUTS = [30, 45, 90];
export const BUNDLE_PASS_COUNTS = [1, 2, 4, 6];
export const BUNDLE_PASSES_REFUSED = 3;
export const BUNDLE_LAYOUT_REFUSED = 60;

/** The balance refusals, each one a state a saved study can carry. */
export const BALANCE_HOT_OUT_ABOVE_HOT_IN = 320;
export const BALANCE_COLD_OUT_BELOW_COLD_IN = 94;
export const BALANCE_ZERO_DUTY = 0;
export const BALANCE_DUTY_THAT_DISAGREES = 3200000;
export const BALANCE_PARALLEL_CROSS_DUTY = 5200000;
export const BALANCE_CROSSING_DUTY = 9500000;
export const ARRANGEMENT_MISCASED = 'Parallel';
export const ARRANGEMENT_UNKNOWN = 'crossflow';

/**
 * FRAMED AS REPAIR HISTORY, and the frame is on this line rather than inside the
 * sentence below it: that sentence describes what FC6-0 REPLACED. What the engine
 * does with each of these values NOW is refuse it by name, and those refusals are
 * in resistanceStack, airCoolerDesign and hotDaySweep.
 */
/** Coefficients a studio box can carry that used to be answered. */
export const FOULING_NEGATIVE = -0.01;
export const K_WALL_ZERO = 0;
export const FAN_EFFICIENCY_ZERO = 0;
export const FAN_EFFICIENCY_ABOVE_ONE = 5;
export const MOTOR_EFFICIENCY_ABOVE_ONE = 3;
export const STATIC_PRESSURE_NEGATIVE = -0.6;
export const DRAFT_TYPE_UNNAMED = 'balanced';
export const AMBIENT_ABOVE_PROCESS_INLET = 260;

/** The two measured roundings, probed by asking the engine about itself. */
export const VISCOSITY_PROBE_CP = 1;
export const DENSITY_PROBE_F = 60;
export const DENSITY_PROBE_PSIA = 14.7;

// ---------------------------------------------------------------------------
// The two chains, and the loop that closes the tube count. Both are the wave
// generator's own composition, so a panel walks the chain the digest walks.
// ---------------------------------------------------------------------------

/**
 * Capacity rates, the balance, the log mean and the two groups, in the order
 * the studio composes them. A refusal anywhere throws rather than being carried
 * forward, because a chain that continues past a refusal prints numbers off an
 * error object, which is the shape every guard in this programme looks for.
 */
const chain = (hot, cold, terms, arrangement = 'counter') => {
  const must = (label, r) => {
    if (!r || typeof r.error === 'string') {
      throw new Error(`THE LAB REFUSES: ${label} was refused by the engine: ${r && r.error}`);
    }
    return r;
  };
  const cH = must('the hot capacity rate', HT.capacityRate(hot)).cBtuHrF;
  const cC = must('the cold capacity rate', HT.capacityRate(cold)).cBtuHrF;
  const bal = must('the energy balance', HT.energyBalance({ cHot: cH, cCold: cC, ...terms, arrangement }));
  const l = must('the log mean', HT.lmtd({
    thIn: terms.thIn, thOut: bal.thOut, tcIn: terms.tcIn, tcOut: bal.tcOut, arrangement,
  }));
  const g = must('P and R', HT.lmtdGroups({
    thIn: terms.thIn, thOut: bal.thOut, tcIn: terms.tcIn, tcOut: bal.tcOut,
  }));
  return {
    cHot: cH, cCold: cC, cMin: Math.min(cH, cC), cMax: Math.max(cH, cC), bal, l, g,
  };
};

/**
 * THE TUBE COUNT IS A LOOP AND THIS CLOSES IT, exactly as the studio does: the
 * film needs a count, the count needs an area, the area needs the coefficient,
 * and the coefficient needs the film. The map is a contraction, so plain
 * iteration settles, and the trail is returned so a reader watches it settle
 * rather than being told that it does.
 *
 * The seed ladder exists because an intermediate count can land in the band the
 * film refuses. The first seed that evaluates starts the loop, and the seeds
 * that were refused come back with the engine's own message on each one.
 */
const closeTheLoop = (ch, film, fluid, geom, seeds, mLbHr, cpBtuLbF) => {
  const step = (nTubes) => {
    const f = HT.tubeSideFilm({
      mLbHr, diIn: film.diIn, ...fluid, cpBtuLbF, nTubes, passes: geom.passes, service: 'heating',
    });
    if (f.error) return { error: f.error, atTubes: nTubes, re: f.re, pr: f.pr };
    const u = HT.overallUOutside({ ...film, hiBtuHrFt2F: f.hBtuHrFt2F });
    if (u.error) return { error: u.error, atTubes: nTubes };
    const a = HT.areaRequired({
      qBtuHr: ch.bal.qBtuHr, uBtuHrFt2F: u.uDirtyBtuHrFt2F, lmtdF: ch.l.lmtdF, f: 1,
    });
    if (a.error) return { error: a.error, atTubes: nTubes };
    const t = HT.tubeCount({ areaFt2: a.areaFt2, doIn: film.doIn, ...geom });
    if (t.error) return { error: t.error, atTubes: nTubes };
    return {
      film: f, u, area: a, tubes: t, atTubes: nTubes,
    };
  };
  let cur = null;
  let seed = null;
  const refusedSeeds = [];
  for (let i = 0; i < seeds.length; i += 1) {
    const r = step(seeds[i]);
    if (r.error) {
      refusedSeeds.push(refusalOf(`the seed of ${n0(seeds[i])} tubes`, r, ['re', 'pr']));
    } else { cur = r; seed = seeds[i]; break; }
  }
  if (!cur) throw new Error(`THE LAB REFUSES: no seed in ${seeds.join(', ')} evaluates`);
  const trail = [seed];
  for (let i = 0; i < 40; i += 1) {
    const next = cur.tubes.nTubes;
    if (next === trail[trail.length - 1]) {
      return {
        ...cur, trail, iterations: i + 1, converged: true, refusedSeeds,
      };
    }
    trail.push(next);
    cur = step(next);
    if (cur.error) throw new Error(`THE LAB REFUSES: the loop died at ${cur.atTubes} tubes: ${cur.error}`);
  }
  throw new Error('THE LAB REFUSES: the tube count did not settle');
};

const studioChain = () => chain(STUDIO_HOT, STUDIO_COLD, STUDIO_TERMINALS);
const oronChain = () => chain(ORON_HOT, ORON_COLD, ORON_TERMINALS);
const studioLoop = (ch) => closeTheLoop(ch, STUDIO_FILM, STUDIO_TUBE_FLUID, STUDIO_GEOMETRY,
  STUDIO_SEEDS, STUDIO_COLD.mLbHr, STUDIO_COLD.cpBtuLbF);
const oronLoop = (ch) => closeTheLoop(ch, ORON_FILM, ORON_TUBE_FLUID, ORON_GEOMETRY,
  ORON_SEEDS, ORON_COLD.mLbHr, ORON_COLD.cpBtuLbF);
const studioFilmAt = (nTubes, extra = {}) => HT.tubeSideFilm({
  mLbHr: STUDIO_COLD.mLbHr,
  diIn: STUDIO_FILM.diIn,
  ...STUDIO_TUBE_FLUID,
  cpBtuLbF: STUDIO_COLD.cpBtuLbF,
  nTubes,
  passes: STUDIO_GEOMETRY.passes,
  service: 'heating',
  ...extra,
});

// ---------------------------------------------------------------------------
// SECTION 1. What the engine rates and sizes, every door and every refusal
// shape, MEASURED by asking each door a question it can answer and one it
// cannot. The census is copied verbatim from the wave's fc6_fields.mjs.
// ---------------------------------------------------------------------------

export const contractCensus = (H) => {
  const names = Object.keys(H).sort();
  const frozen = names.filter((n) => typeof H[n] === 'object' && H[n] !== null && Object.isFrozen(H[n]));
  const callable = names.filter((n) => typeof H[n] === 'function');
  const doors = [];
  const helpers = [];
  const probes = {
    capacityRate: [{ mLbHr: 1000, cpBtuLbF: 0.5 }, { mLbHr: 0, cpBtuLbF: 0.5 }],
    // The second probe is a duty that CROSSES the streams, so the refusal has
    // evidence to carry and the census can measure that rather than assume it.
    energyBalance: [{ cHot: 1000, cCold: 2000, thIn: 300, tcIn: 100, thOut: 250 }, { cHot: 1000, cCold: 2000, thIn: 300, tcIn: 100, qBtuHr: 9500000 }],
    lmtd: [{ thIn: 300, thOut: 250, tcIn: 100, tcOut: 150 }, { thIn: 300, thOut: 250, tcIn: 100 }],
    lmtdGroups: [{ thIn: 300, thOut: 250, tcIn: 100, tcOut: 150 }, { thIn: 300, thOut: 250, tcIn: 100, tcOut: 100 }],
    lmtdCorrectionF: [{ p: 0.3, r: 0.9 }, { p: 1.2, r: 0.9 }],
    overallUOutside: [{ hoBtuHrFt2F: 200, hiBtuHrFt2F: 800, doIn: 0.75, diIn: 0.6 }, { hoBtuHrFt2F: 200, hiBtuHrFt2F: 800, doIn: 0.6, diIn: 0.75 }],
    // The second probe lands in the transition band, which is refused WITH the
    // Reynolds and Prandtl numbers that put it there.
    tubeSideFilm: [{ mLbHr: 90000, diIn: 0.62, muCp: 0.5, kBtuHrFtF: 0.08, cpBtuLbF: 1 }, { mLbHr: 300, diIn: 0.62, muCp: 0.5, kBtuHrFtF: 0.08, cpBtuLbF: 1 }],
    areaRequired: [{ qBtuHr: 1e6, uBtuHrFt2F: 100, lmtdF: 50 }, { qBtuHr: 1e6, uBtuHrFt2F: 100, lmtdF: 0 }],
    tubeCount: [{ areaFt2: 500, doIn: 0.75, tubeLengthFt: 16 }, { areaFt2: 500, doIn: 0.75, tubeLengthFt: 16, passes: 3 }],
    effectivenessFromNtu: [{ ntu: 1, cr: 0.5 }, { ntu: 1, cr: 1.4 }],
    // The second probe asks a parallel-flow unit for more than its ceiling, so
    // the refusal carries the ceiling itself.
    ntuFromEffectiveness: [{ effectiveness: 0.6, cr: 0.5 }, { effectiveness: 0.9, cr: 0.5, arrangement: 'parallel' }],
    airCooler: [{ qBtuHr: 1e7, processInF: 250, processOutF: 150, ambientF: 95, airRiseF: 30, uBtuHrFt2F: 4.5 }, { qBtuHr: 1e7, processInF: 250, processOutF: 150, ambientF: 95, airRiseF: 30, uBtuHrFt2F: 0 }],
  };
  callable.forEach((n) => {
    const p = probes[n];
    if (!p) { helpers.push(n); return; }
    const ok = H[n](p[0]);
    const no = H[n](p[1]);
    // THE CENSUS IS ITSELF GUARDED. A probe labelled "a question it cannot
    // answer" that the engine ANSWERS would put a success shape in a refusal
    // column, which is FC4's label-versus-call defect wearing a table's
    // clothes. It is a build failure here rather than a row somebody reads.
    if (!ok || typeof ok !== 'object' || typeof ok.error === 'string') {
      throw new Error(`CENSUS REFUSES: the ${n} probe labelled answerable was refused: ${ok && ok.error}`);
    }
    if (!no || typeof no !== 'object' || typeof no.error !== 'string') {
      throw new Error(`CENSUS REFUSES: the ${n} probe labelled unanswerable was ANSWERED, `
        + `returning ${no && typeof no === 'object' ? Object.keys(no).join(', ') : String(no)}`);
    }
    doors.push({
      name: n,
      answersWithAnObject: ok !== null && typeof ok === 'object',
      answerKeys: ok && typeof ok === 'object' ? Object.keys(ok).length : 0,
      refusesWithANamedString: no !== null && typeof no === 'object' && typeof no.error === 'string',
      refusalCarriesEvidence: no !== null && typeof no === 'object' && Object.keys(no).length > 1,
    });
  });
  return {
    names, frozen, callable, doors, helpers,
  };
};

export const engineScope = () => {
  const census = contractCensus(HT);
  return {
    exportCount: census.names.length,
    frozenCount: census.frozen.length,
    frozenNames: census.frozen,
    doorCount: census.doors.length,
    doors: census.doors,
    helperNames: census.helpers,
    withEvidenceCount: census.doors.filter((d) => d.refusalCarriesEvidence).length,
    everyDoorRefusesByName: census.doors.every((d) => d.refusesWithANamedString),
    everyDoorAnswersWithAnObject: census.doors.every((d) => d.answersWithAnObject),
  };
};

// ---------------------------------------------------------------------------
// SECTION 2. The balance, its four terminals, the six refusals and the
// arrangement read three ways. Owned by the exchanger explorer.
// ---------------------------------------------------------------------------

export const balanceThreeWays = () => {
  const st = studioChain();
  const or = oronChain();
  const bal = (arg, arrangement = 'counter') => HT.energyBalance({
    cHot: st.cHot, cCold: st.cCold, thIn: STUDIO_TERMINALS.thIn, tcIn: STUDIO_TERMINALS.tcIn, ...arg, arrangement,
  });
  const statings = [
    ['the hot outlet', { thOut: STUDIO_TERMINALS.thOut }],
    ['the cold outlet', { tcOut: st.bal.tcOut }],
    ['the duty itself', { qBtuHr: st.bal.qBtuHr }],
  ].map(([stated, arg]) => {
    const r = bal(arg);
    return {
      stated, qBtuHr: r.qBtuHr, thOut: r.thOut, tcOut: r.tcOut, basis: r.basis,
    };
  });
  const parallelCross = bal({ qBtuHr: BALANCE_PARALLEL_CROSS_DUTY }, 'parallel');
  const counterSame = bal({ qBtuHr: BALANCE_PARALLEL_CROSS_DUTY });
  const lmtdAt = (arrangement) => HT.lmtd({
    ...STUDIO_TERMINALS, thOut: STUDIO_TERMINALS.thOut, tcOut: st.bal.tcOut, arrangement,
  });
  const lower = lmtdAt('parallel');
  const capitalised = lmtdAt(ARRANGEMENT_MISCASED);
  return {
    capacityRates: [
      ['the studio hot stream', STUDIO_HOT, st.cHot],
      ['the studio cold stream', STUDIO_COLD, st.cCold],
      ['the ORON hot stream', ORON_HOT, or.cHot],
      ['the ORON cold stream', ORON_COLD, or.cCold],
    ].map(([label, stream, cBtuHrF]) => ({
      label, mLbHr: stream.mLbHr, cpBtuLbF: stream.cpBtuLbF, cBtuHrF,
    })),
    studio: {
      qBtuHr: st.bal.qBtuHr, thOut: st.bal.thOut, tcOut: st.bal.tcOut, basis: st.bal.basis,
    },
    oron: { qBtuHr: or.bal.qBtuHr, tcOut: or.bal.tcOut, basis: or.bal.basis },
    cMin: st.cMin,
    cMax: st.cMax,
    capacityRatioDerived: st.cMin / st.cMax,
    statings,
    basisIsReportedOnEvery: statings.every((s) => typeof s.basis === 'string'),
    refusals: [
      refusalOf('a hot outlet above the hot inlet', bal({ thOut: BALANCE_HOT_OUT_ABOVE_HOT_IN })),
      refusalOf('a cold outlet below the cold inlet', bal({ tcOut: BALANCE_COLD_OUT_BELOW_COLD_IN })),
      refusalOf('a stated duty of zero', bal({ qBtuHr: BALANCE_ZERO_DUTY })),
      refusalOf('a stated duty beside a stated outlet that disagrees with it',
        bal({ qBtuHr: BALANCE_DUTY_THAT_DISAGREES, thOut: STUDIO_TERMINALS.thOut })),
      refusalOf('a duty that crosses the two streams', bal({ qBtuHr: BALANCE_CROSSING_DUTY }),
        ['thOutIfReached', 'tcOutIfReached']),
      refusalOf('a duty no PARALLEL exchanger can deliver, refused by the parallel test',
        parallelCross, ['thOutIfReached', 'tcOutIfReached']),
    ],
    parallelRefusedCounterAnswered: {
      refusal: refusalOf('the same duty asked of a parallel unit', parallelCross,
        ['thOutIfReached', 'tcOutIfReached']),
      answer: { qBtuHr: counterSame.qBtuHr, thOut: counterSame.thOut, tcOut: counterSame.tcOut },
    },
    arrangementThreeWays: {
      lowerCase: { given: 'parallel', lmtdF: lower.lmtdF },
      capitalised: { given: ARRANGEMENT_MISCASED, lmtdF: capitalised.lmtdF },
      counterOnTheSameFour: st.l.lmtdF,
      bothCasingsAgree: lower.lmtdF === capitalised.lmtdF,
      unknown: refusalOf(`an arrangement of ${ARRANGEMENT_UNKNOWN}, which this module does not carry`,
        lmtdAt(ARRANGEMENT_UNKNOWN)),
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 3. The log mean in both pairings, with the arithmetic mean drawn.
// ---------------------------------------------------------------------------

export const logMeanBothPairings = () => {
  const st = studioChain();
  const or = oronChain();
  const row = (label, terms, thOut, tcOut, arrangement, goldenLmtdF = null) => {
    const r = HT.lmtd({
      thIn: terms.thIn, thOut, tcIn: terms.tcIn, tcOut, arrangement,
    });
    return {
      label,
      arrangement,
      dt1: r.dt1,
      dt2: r.dt2,
      lmtdF: r.lmtdF,
      arithmeticMeanDerived: (r.dt1 + r.dt2) / 2,
      equalEnds: r.equalEnds,
      belowTheArithmeticMean: r.lmtdF <= (r.dt1 + r.dt2) / 2,
      goldenLmtdF,
    };
  };
  const rows = [];
  ['counter', 'parallel'].forEach((arr) => {
    rows.push(row('the studio case', STUDIO_TERMINALS, st.bal.thOut, st.bal.tcOut, arr));
  });
  ['counter', 'parallel'].forEach((arr) => {
    rows.push(row('ORON', ORON_TERMINALS, or.bal.thOut, or.bal.tcOut, arr));
  });
  GOLD.lmtd.forEach((g, i) => {
    rows.push(row(`published case ${n0(i + 1)}`, { thIn: g.thIn, tcIn: g.tcIn },
      g.thOut, g.tcOut, 'counter', g.lmtdF));
  });
  const closest = GOLD.lmtd[2];
  const equalEnded = HT.lmtd({
    thIn: closest.thIn,
    thOut: closest.thIn - (closest.tcOut - closest.tcIn),
    tcIn: closest.tcIn,
    tcOut: closest.tcOut,
  });
  const shell = HT.lmtd({
    thIn: STUDIO_TERMINALS.thIn,
    thOut: st.bal.thOut,
    tcIn: STUDIO_TERMINALS.tcIn,
    tcOut: st.bal.tcOut,
    arrangement: 'shell1',
  });
  return {
    rows,
    strictlyBelowOnEveryUnequalRow: rows.filter((r) => !r.equalEnds).every((r) => r.lmtdF < r.arithmeticMeanDerived),
    equalOnTheEqualEndedRows: rows.filter((r) => r.equalEnds).every((r) => r.lmtdF === r.arithmeticMeanDerived),
    equalEnded: { lmtdF: equalEnded.lmtdF, equalEnds: equalEnded.equalEnds, dt1: equalEnded.dt1 },
    shell1: { lmtdF: shell.lmtdF, basis: shell.basis, note: shell.note },
    refusals: [
      refusalOf('a log mean asked for on three terminals', HT.lmtd({
        thIn: STUDIO_TERMINALS.thIn, thOut: st.bal.thOut, tcIn: STUDIO_TERMINALS.tcIn,
      })),
      refusalOf('a log mean across streams that have crossed', HT.lmtd({
        thIn: STUDIO_TERMINALS.thIn,
        thOut: STUDIO_TERMINALS.tcIn,
        tcIn: STUDIO_TERMINALS.tcIn,
        tcOut: STUDIO_TERMINALS.thIn,
      }), ['dt1', 'dt2']),
    ],
  };
};

// ---------------------------------------------------------------------------
// SECTION 4 and SECTION 5. The surface out of three numbers, and the tubes.
// ---------------------------------------------------------------------------

export const surfaceFromThree = () => {
  const st = studioChain();
  const or = oronChain();
  const stLoop = studioLoop(st);
  const orLoop = oronLoop(or);
  const area = (args) => HT.areaRequired(args);
  const stArea = area({
    qBtuHr: st.bal.qBtuHr, uBtuHrFt2F: stLoop.u.uDirtyBtuHrFt2F, lmtdF: st.l.lmtdF, f: 1,
  });
  const cleanArea = area({
    qBtuHr: st.bal.qBtuHr, uBtuHrFt2F: stLoop.u.uCleanBtuHrFt2F, lmtdF: st.l.lmtdF, f: 1,
  });
  return {
    rows: [
      {
        label: 'the studio case',
        qBtuHr: st.bal.qBtuHr,
        uDirty: stLoop.u.uDirtyBtuHrFt2F,
        f: 1,
        lmtdF: st.l.lmtdF,
        areaFt2: stArea.areaFt2,
        goldenAreaFt2: null,
      },
      {
        label: 'ORON',
        qBtuHr: or.bal.qBtuHr,
        uDirty: orLoop.u.uDirtyBtuHrFt2F,
        f: 1,
        lmtdF: or.l.lmtdF,
        areaFt2: area({
          qBtuHr: or.bal.qBtuHr, uBtuHrFt2F: orLoop.u.uDirtyBtuHrFt2F, lmtdF: or.l.lmtdF, f: 1,
        }).areaFt2,
        goldenAreaFt2: null,
      },
      ...GOLD.areaRequired.map((g, i) => ({
        label: `published case ${n0(i + 1)}`,
        qBtuHr: g.qBtuHr,
        uDirty: g.uBtuHrFt2F,
        f: g.f,
        lmtdF: g.lmtdF,
        areaFt2: area({
          qBtuHr: g.qBtuHr, uBtuHrFt2F: g.uBtuHrFt2F, lmtdF: g.lmtdF, f: g.f,
        }).areaFt2,
        goldenAreaFt2: g.areaFt2,
      })),
    ],
    cleanAgainstDirty: {
      atClean: cleanArea.areaFt2,
      atDirty: stArea.areaFt2,
      uClean: stLoop.u.uCleanBtuHrFt2F,
      uDirty: stLoop.u.uDirtyBtuHrFt2F,
    },
    refusals: [
      refusalOf('an area asked for at a zero coefficient', area({
        qBtuHr: st.bal.qBtuHr, uBtuHrFt2F: 0, lmtdF: st.l.lmtdF, f: 1,
      })),
      refusalOf('an area asked for at an F above one', area({
        qBtuHr: st.bal.qBtuHr, uBtuHrFt2F: stLoop.u.uDirtyBtuHrFt2F, lmtdF: st.l.lmtdF, f: 1 + 1e-6,
      })),
    ],
  };
};

export const tubesAndOvershoot = () => {
  const st = studioChain();
  const or = oronChain();
  const stLoop = studioLoop(st);
  const orLoop = oronLoop(or);
  const row = (label, loop, passes, goldenTubes = null) => ({
    label,
    areaAskedForFt2: loop.area.areaFt2,
    areaPerTubeFt2: loop.tubes.areaPerTubeFt2,
    passes,
    nTubes: loop.tubes.nTubes,
    tubesPerPass: loop.tubes.tubesPerPass,
    actualAreaFt2: loop.tubes.actualAreaFt2,
    areaMarginPct: loop.tubes.areaMarginPct,
    goldenTubes,
  });
  const published = GOLD.tubeCount.map((g, i) => {
    const t = HT.tubeCount({
      areaFt2: g.areaFt2,
      doIn: g.doIn,
      tubeLengthFt: g.tubeLengthFt,
      layoutDeg: g.layoutDeg,
      passes: g.passes,
      bundleClearanceIn: g.bundleClearanceIn,
    });
    return {
      label: `published case ${n0(i + 1)}`,
      areaAskedForFt2: g.areaFt2,
      areaPerTubeFt2: t.areaPerTubeFt2,
      passes: g.passes,
      nTubes: t.nTubes,
      tubesPerPass: t.tubesPerPass,
      actualAreaFt2: t.actualAreaFt2,
      areaMarginPct: t.areaMarginPct,
      goldenTubes: g.nTubes,
    };
  });
  const rows = [
    row('the studio case', stLoop, STUDIO_GEOMETRY.passes),
    row('ORON', orLoop, ORON_GEOMETRY.passes),
    ...published,
  ];
  return {
    rows,
    overshootIsAlwaysPositive: rows.every((r) => r.areaMarginPct > 0),
    everyPublishedCountAgrees: published.every((r) => r.nTubes === r.goldenTubes),
    countBeforeTheSecondRoundingDerived: Math.ceil(stLoop.area.areaFt2 / stLoop.tubes.areaPerTubeFt2),
    countTheEngineReturns: stLoop.tubes.nTubes,
    refusals: [
      refusalOf(`a tube count asked for at ${n0(BUNDLE_PASSES_REFUSED)} passes, which this module carries no bundle constants for`,
        HT.tubeCount({
          areaFt2: BUNDLE_AREA_FT2,
          doIn: STUDIO_FILM.doIn,
          tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt,
          passes: BUNDLE_PASSES_REFUSED,
        })),
      refusalOf('a tube count asked for at a zero area', HT.tubeCount({
        areaFt2: 0,
        doIn: STUDIO_FILM.doIn,
        tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt,
        passes: STUDIO_GEOMETRY.passes,
      })),
    ],
  };
};

// ---------------------------------------------------------------------------
// SECTION 6 and the trail of SECTION 12. The loop, closing, with its cost.
// ---------------------------------------------------------------------------

export const loopCloses = () => {
  const st = studioChain();
  const or = oronChain();
  const stLoop = studioLoop(st);
  const orLoop = oronLoop(or);
  const trailCounts = stLoop.trail.concat([stLoop.tubes.nTubes])
    .filter((n, i, a) => a.indexOf(n) === i);
  const trailRows = trailCounts.map((nTubes) => {
    const f = studioFilmAt(nTubes);
    if (f.error) {
      return {
        nTubes,
        refusal: refusalOf(`the film at ${n0(nTubes)} tubes`, f, ['re', 'pr', 'tubesPerPass']),
      };
    }
    const u = HT.overallUOutside({ ...STUDIO_FILM, hiBtuHrFt2F: f.hBtuHrFt2F });
    const a = HT.areaRequired({
      qBtuHr: st.bal.qBtuHr, uBtuHrFt2F: u.uDirtyBtuHrFt2F, lmtdF: st.l.lmtdF, f: 1,
    });
    return {
      nTubes,
      tubesPerPass: f.tubesPerPass,
      re: f.re,
      regime: f.regime,
      hBtuHrFt2F: f.hBtuHrFt2F,
      uDirty: u.uDirtyBtuHrFt2F,
      areaFt2: a.areaFt2,
      refusal: null,
    };
  });
  return {
    studio: {
      trail: stLoop.trail,
      iterations: stLoop.iterations,
      converged: stLoop.converged,
      refusedSeeds: stLoop.refusedSeeds,
      seeds: STUDIO_SEEDS,
      cHot: st.cHot,
      cCold: st.cCold,
      qBtuHr: st.bal.qBtuHr,
      tcOut: st.bal.tcOut,
      lmtdF: st.l.lmtdF,
      p: st.g.p,
      r: st.g.r,
      re: stLoop.film.re,
      pr: stLoop.film.pr,
      regime: stLoop.film.regime,
      hiBtuHrFt2F: stLoop.film.hBtuHrFt2F,
      uClean: stLoop.u.uCleanBtuHrFt2F,
      uDirty: stLoop.u.uDirtyBtuHrFt2F,
      foulingPenaltyPct: stLoop.u.foulingPenaltyPct,
      controlling: stLoop.u.controlling,
      runnerUp: stLoop.u.runnerUp,
      controllingMarginPct: stLoop.u.controllingMarginPct,
      controllingClear: stLoop.u.controllingClear,
      areaFt2: stLoop.area.areaFt2,
      nTubes: stLoop.tubes.nTubes,
      tubesPerPass: stLoop.tubes.tubesPerPass,
      actualAreaFt2: stLoop.tubes.actualAreaFt2,
      areaMarginPct: stLoop.tubes.areaMarginPct,
      bundleDiameterIn: stLoop.tubes.bundleDiameterIn,
      shellDiameterIn: stLoop.tubes.shellDiameterIn,
    },
    oron: {
      trail: orLoop.trail,
      iterations: orLoop.iterations,
      seeds: ORON_SEEDS,
      qBtuHr: or.bal.qBtuHr,
      tcOut: or.bal.tcOut,
      lmtdF: or.l.lmtdF,
      re: orLoop.film.re,
      pr: orLoop.film.pr,
      hiBtuHrFt2F: orLoop.film.hBtuHrFt2F,
      uDirty: orLoop.u.uDirtyBtuHrFt2F,
      areaFt2: orLoop.area.areaFt2,
      nTubes: orLoop.tubes.nTubes,
      tubesPerPass: orLoop.tubes.tubesPerPass,
      bundleDiameterIn: orLoop.tubes.bundleDiameterIn,
      shellDiameterIn: orLoop.tubes.shellDiameterIn,
    },
    trailRows,
    selfConsistency: {
      studioUatfDerived: stLoop.u.uDirtyBtuHrFt2F * stLoop.area.areaFt2 * 1 * st.l.lmtdF,
      studioDuty: st.bal.qBtuHr,
      oronUatfDerived: orLoop.u.uDirtyBtuHrFt2F * orLoop.area.areaFt2 * 1 * or.l.lmtdF,
      oronDuty: or.bal.qBtuHr,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 7. P and R, and a correction factor computed rather than typed.
// ---------------------------------------------------------------------------

export const correctionAcrossP = () => {
  const st = studioChain();
  const or = oronChain();
  const at = (p, r, shellPasses = 1) => HT.lmtdCorrectionF({ p, r, shellPasses });
  const cases = [
    ['the studio case', st.g.p, st.g.r, null],
    ['ORON', or.g.p, or.g.r, null],
    ...GOLD.fCorrection.map((g, i) => [`published case ${n0(i + 1)}`, g.p, g.r, g.f]),
  ].map(([label, p, r, goldenF]) => {
    const f = at(p, r, 1);
    return {
      label, p, r, f: f.f, warning: f.warning, goldenF,
    };
  });
  const sweep = F_P_SWEEP.map((p) => {
    const f = at(p, F_R_FIXED, 1);
    if (f.error) {
      return {
        p,
        f: null,
        warning: null,
        refusal: refusalOf(`F at P of ${e6(p)} and R of ${e6(F_R_FIXED)}`, f),
      };
    }
    return {
      p, f: f.f, warning: f.warning, refusal: null,
    };
  });
  const warned = sweep.filter((s) => s.warning);
  return {
    cases,
    everyPublishedCaseAgrees: cases.filter((c) => c.goldenF !== null)
      .every((c) => e6(c.f) === e6(c.goldenF)),
    rFixed: F_R_FIXED,
    sweep,
    firstWarnedAtP: warned.length ? warned[0].p : null,
    warnedCount: warned.length,
    refusedCount: sweep.filter((s) => s.refusal).length,
    limitTable: F_P_TENDING_TO_ZERO.map((p) => ({
      p,
      byR: F_R_LIMIT_SET.map((r) => ({ r, f: at(p, r, 1).f })),
    })),
    limitSetR: F_R_LIMIT_SET,
    refusals: [
      refusalOf('P given at one', at(1, F_R_FIXED, 1)),
      refusalOf('R given at zero', at(0.3, 0, 1)),
    ],
  };
};

// ---------------------------------------------------------------------------
// SECTION 9 and SECTION 10. Five named resistances, and the verdict's margin.
// ---------------------------------------------------------------------------

export const resistanceStack = () => {
  const st = studioChain();
  const or = oronChain();
  const stLoop = studioLoop(st);
  const orLoop = oronLoop(or);
  const u = stLoop.u;
  const names = Object.keys(u.resistances);
  const terms = names.map((name) => ({
    name, resistance: u.resistances[name], sharePct: u.resistanceSharePct[name],
  }));
  const publishedU = GOLD.u.concat([GOLD.uDefaults]).map((g, i) => {
    const r = HT.overallUOutside({
      hoBtuHrFt2F: g.hoBtuHrFt2F,
      hiBtuHrFt2F: g.hiBtuHrFt2F,
      doIn: g.doIn,
      diIn: g.diIn,
      ...(g.kWallBtuHrFtF !== undefined ? { kWallBtuHrFtF: g.kWallBtuHrFtF } : {}),
      ...(g.foulingOut !== undefined ? { foulingOut: g.foulingOut } : {}),
      ...(g.foulingIn !== undefined ? { foulingIn: g.foulingIn } : {}),
    });
    return {
      label: `published case ${n0(i + 1)}`,
      ho: g.hoBtuHrFt2F,
      hi: g.hiBtuHrFt2F,
      doIn: g.doIn,
      diIn: g.diIn,
      uClean: r.uCleanBtuHrFt2F,
      goldenUClean: g.uCleanBtuHrFt2F,
      uDirty: r.uDirtyBtuHrFt2F,
      goldenUDirty: g.uDirtyBtuHrFt2F,
      controlling: r.controlling,
      runnerUp: r.runnerUp,
      controllingMarginPct: r.controllingMarginPct,
      controllingClear: r.controllingClear,
    };
  });
  const near = HT.overallUOutside({
    hoBtuHrFt2F: 1 / u.resistances.outsideFilm,
    hiBtuHrFt2F: (STUDIO_FILM.doIn / STUDIO_FILM.diIn) / (u.resistances.outsideFilm * 1.02),
    doIn: STUDIO_FILM.doIn,
    diIn: STUDIO_FILM.diIn,
    kWallBtuHrFtF: STUDIO_FILM.kWallBtuHrFtF,
    foulingOut: 0,
    foulingIn: 0,
  });
  return {
    referenceArea: u.referenceArea,
    terms,
    totalResistance: u.totalResistance,
    totalSumDerived: names.reduce((a, k) => a + u.resistances[k], 0),
    shareSumDerived: names.reduce((a, k) => a + u.resistanceSharePct[k], 0),
    uClean: u.uCleanBtuHrFt2F,
    uDirty: u.uDirtyBtuHrFt2F,
    foulingPenaltyPct: u.foulingPenaltyPct,
    foulingShareOfTotalPctDerived:
      ((u.resistances.outsideFouling + u.resistances.insideFouling) / u.totalResistance) * 100,
    diameterRatioDerived: STUDIO_FILM.doIn / STUDIO_FILM.diIn,
    insideFilmCoefficient: stLoop.film.hBtuHrFt2F,
    oneOverInsideFilmDerived: 1 / stLoop.film.hBtuHrFt2F,
    insideFilmResistance: u.resistances.insideFilm,
    insideFoulingAsTyped: STUDIO_FILM.foulingIn,
    insideFoulingInTheStack: u.resistances.insideFouling,
    outsideFoulingAsTyped: STUDIO_FILM.foulingOut,
    outsideFoulingInTheStack: u.resistances.outsideFouling,
    controlling: u.controlling,
    controllingSharePct: u.controllingSharePct,
    runnerUp: u.runnerUp,
    controllingMarginPct: u.controllingMarginPct,
    controllingClear: u.controllingClear,
    controllingNote: u.controllingNote,
    declaredMarginPct: HT.DECLARED_BOUNDS.controllingMarginPct,
    verdictRows: [
      {
        label: 'the studio case',
        controlling: u.controlling,
        runnerUp: u.runnerUp,
        controllingMarginPct: u.controllingMarginPct,
        controllingClear: u.controllingClear,
      },
      {
        label: 'ORON',
        controlling: orLoop.u.controlling,
        runnerUp: orLoop.u.runnerUp,
        controllingMarginPct: orLoop.u.controllingMarginPct,
        controllingClear: orLoop.u.controllingClear,
      },
      ...publishedU.map((p) => ({
        label: p.label,
        controlling: p.controlling,
        runnerUp: p.runnerUp,
        controllingMarginPct: p.controllingMarginPct,
        controllingClear: p.controllingClear,
      })),
    ],
    publishedU,
    builtDeliberatelyNear: {
      outsideFilm: near.resistances.outsideFilm,
      insideFilm: near.resistances.insideFilm,
      controlling: near.controlling,
      runnerUp: near.runnerUp,
      controllingMarginPct: near.controllingMarginPct,
      controllingClear: near.controllingClear,
      note: near.controllingNote,
    },
    refusals: [
      refusalOf(`a negative outside fouling allowance of ${r9(FOULING_NEGATIVE)}`,
        HT.overallUOutside({ ...STUDIO_FILM, hiBtuHrFt2F: stLoop.film.hBtuHrFt2F, foulingOut: FOULING_NEGATIVE })),
      refusalOf('a wall conductivity of zero',
        HT.overallUOutside({ ...STUDIO_FILM, hiBtuHrFt2F: stLoop.film.hBtuHrFt2F, kWallBtuHrFtF: K_WALL_ZERO })),
      refusalOf('an inside diameter above the outside one', HT.overallUOutside({
        ...STUDIO_FILM, doIn: STUDIO_FILM.diIn, diIn: STUDIO_FILM.doIn, hiBtuHrFt2F: stLoop.film.hBtuHrFt2F,
      })),
    ],
  };
};

// ---------------------------------------------------------------------------
// SECTION 11. The thin-wall limit, and the factor of two it fixes.
// ---------------------------------------------------------------------------

export const thinWallLimit = () => {
  const st = studioChain();
  const stLoop = studioLoop(st);
  const wallAt = (thicknessIn, k) => HT.overallUOutside({
    ...WALL_FILMS,
    doIn: WALL_DO_IN,
    diIn: WALL_DO_IN - 2 * thicknessIn,
    kWallBtuHrFtF: k,
    foulingOut: 0,
    foulingIn: 0,
  }).resistances.wall;
  const middleK = WALL_K_SWEEP[1];
  const rows = WALL_THICKNESS_SWEEP.map((thicknessIn) => ({
    thicknessIn,
    wall: WALL_K_SWEEP.map((k) => ({ k, resistance: wallAt(thicknessIn, k) })),
    // The flat plate is the digest's stated arithmetic on the same two inputs,
    // which is what makes it an independent limit rather than a second reading.
    plateDerived: WALL_K_SWEEP.map((k) => ({ k, resistance: (thicknessIn / 12) / k })),
    ratioAtMiddleKDerived: wallAt(thicknessIn, middleK) / ((thicknessIn / 12) / middleK),
  }));
  return {
    doIn: WALL_DO_IN,
    kSweep: WALL_K_SWEEP,
    middleK,
    rows,
    ratioFallsTowardOne: rows.every((r, i) => i === 0 || r.ratioAtMiddleKDerived < rows[i - 1].ratioAtMiddleKDerived),
    everyRatioAboveOne: rows.every((r) => r.ratioAtMiddleKDerived > 1),
    wallSharePctOnTheStudioCase: stLoop.u.resistanceSharePct.wall,
  };
};

// ---------------------------------------------------------------------------
// SECTION 12. The tube-side film, three regimes, and the band the transition
// is REFUSED in. The refusal is drawn as a refusal rather than as a gap.
// ---------------------------------------------------------------------------

export const filmThreeRegimes = () => {
  const st = studioChain();
  const stLoop = studioLoop(st);
  const converged = stLoop.film;
  const flowRows = FILM_FLOW_SWEEP.map((mLbHr) => {
    const f = studioFilmAt(stLoop.tubes.nTubes, { mLbHr });
    if (f.error) {
      return {
        mLbHr,
        re: f.re,
        regime: null,
        hBtuHrFt2F: null,
        warning: null,
        refusal: refusalOf(`the film at ${r4(mLbHr)} lb an hour`, f, ['re', 'pr', 'tubesPerPass']),
      };
    }
    return {
      mLbHr, re: f.re, regime: f.regime, hBtuHrFt2F: f.hBtuHrFt2F, warning: f.warning, refusal: null,
    };
  });
  const laminar = studioFilmAt(stLoop.tubes.nTubes, { mLbHr: FILM_LAMINAR_FLOW });
  const laminarDoubled = studioFilmAt(stLoop.tubes.nTubes, { mLbHr: 2 * FILM_LAMINAR_FLOW });
  const transition = studioFilmAt(stLoop.tubes.nTubes, { mLbHr: FILM_TRANSITION_FLOW });
  const plain = studioFilmAt(stLoop.tubes.nTubes);
  const siederTate = studioFilmAt(stLoop.tubes.nTubes, { muWallCp: FILM_WALL_VISCOSITY });
  return {
    converged: {
      nTubes: stLoop.tubes.nTubes,
      passes: STUDIO_GEOMETRY.passes,
      tubesPerPass: converged.tubesPerPass,
      re: converged.re,
      pr: converged.pr,
      regime: converged.regime,
      hBtuHrFt2F: converged.hBtuHrFt2F,
      service: converged.service,
    },
    transitionBand: {
      low: HT.DECLARED_CONSTANTS.transitionReLow,
      high: HT.DECLARED_CONSTANTS.transitionReHigh,
      // THE BAND IS A REFUSAL AND THE PANEL DRAWS IT AS ONE. The engine hands
      // back the Reynolds and Prandtl numbers that put the case there, which is
      // the evidence a reader needs to leave the band.
      refusal: refusalOf(`the film in the transition band, at ${r4(FILM_TRANSITION_FLOW)} lb an hour`,
        transition, ['re', 'pr', 'tubesPerPass']),
    },
    flowRows,
    laminar: {
      mLbHr: FILM_LAMINAR_FLOW,
      re: laminar.re,
      regime: laminar.regime,
      hBtuHrFt2F: laminar.hBtuHrFt2F,
      warning: laminar.warning,
      doubledFlow: 2 * FILM_LAMINAR_FLOW,
      doubledRe: laminarDoubled.re,
      doubledH: laminarDoubled.hBtuHrFt2F,
      filmDidNotMoveWithTheFlow: laminar.hBtuHrFt2F === laminarDoubled.hBtuHrFt2F,
    },
    siederTateRows: [
      {
        muWallCp: null,
        applied: plain.siederTate,
        factor: plain.siederTateFactor === undefined ? null : plain.siederTateFactor,
        hBtuHrFt2F: plain.hBtuHrFt2F,
      },
      {
        muWallCp: FILM_WALL_VISCOSITY,
        applied: siederTate.siederTate,
        factor: siederTate.siederTateFactor,
        hBtuHrFt2F: siederTate.hBtuHrFt2F,
      },
    ],
    correlationBand: {
      validityBand: converged.correlation.validityBand,
      reynolds: converged.correlation.reynolds,
      prandtl: converged.correlation.prandtl,
      note: converged.correlation.note,
    },
    publishedFilm: GOLD.tubeFilm.map((g) => {
      const f = HT.tubeSideFilm({
        mLbHr: g.mLbHr,
        diIn: g.diIn,
        muCp: g.muCp,
        kBtuHrFtF: g.kBtuHrFtF,
        cpBtuLbF: g.cpBtuLbF,
        ...(g.muWallCp !== undefined ? { muWallCp: g.muWallCp } : {}),
        ...(g.nTubes !== undefined ? { nTubes: g.nTubes } : {}),
        ...(g.passes !== undefined ? { passes: g.passes } : {}),
      });
      return {
        mLbHr: g.mLbHr,
        diIn: g.diIn,
        muCp: g.muCp,
        re: f.re,
        goldenRe: g.re,
        pr: f.pr,
        hBtuHrFt2F: f.hBtuHrFt2F,
        goldenH: g.hBtuHrFt2F,
      };
    }),
    refusals: [
      refusalOf(`${n0(FILM_UNEQUAL_TUBES)} tubes in ${n0(FILM_UNEQUAL_PASSES)} passes`,
        studioFilmAt(FILM_UNEQUAL_TUBES, { passes: FILM_UNEQUAL_PASSES })),
    ],
  };
};

// ---------------------------------------------------------------------------
// SECTION 13. THE COOLING REFUSAL, which is the best lesson on this wave. A
// cooled tube side is REFUSED rather than answered with the heating exponent,
// and the engine's message states the size of what it is declining to guess.
// ---------------------------------------------------------------------------

export const coolingRefused = () => {
  const st = studioChain();
  const stLoop = studioLoop(st);
  const cooled = studioFilmAt(stLoop.tubes.nTubes, { service: FILM_SERVICE_REFUSED });
  const unknown = studioFilmAt(stLoop.tubes.nTubes, { service: FILM_SERVICE_UNKNOWN });
  return {
    cooling: refusalOf(`a tube side declared as ${FILM_SERVICE_REFUSED}`, cooled),
    unknownService: refusalOf(`a tube side declared as ${FILM_SERVICE_UNKNOWN}, which this module carries no form for at all`,
      unknown),
    registerNote: HT.HELD_FOR_LITERATURE.dittusBoelterCoolingExponent,
    prandtlOnTheStudioCase: stLoop.film.pr,
    heatingAnswer: {
      hBtuHrFt2F: stLoop.film.hBtuHrFt2F,
      service: stLoop.film.service,
    },
    heatingExponent: HT.DECLARED_CONSTANTS.dittusBoelterPrExpHeating,
    // The route a caller takes instead: the module takes a STATED inside film,
    // and that is the box the studio offers.
    statedFilmIsTheRoute: true,
  };
};

// ---------------------------------------------------------------------------
// SECTION 14. The bundle, the shell, and the two layout rows that are equal.
// The Layout box is DECORATIVE between those two and the panel says so.
// ---------------------------------------------------------------------------

export const bundleAndLayout = () => {
  const K = HT.bundleConstants();
  const at = (layoutDeg, passes, bundleClearanceIn = STUDIO_GEOMETRY.bundleClearanceIn) => HT.tubeCount({
    areaFt2: BUNDLE_AREA_FT2,
    doIn: STUDIO_FILM.doIn,
    tubeLengthFt: STUDIO_GEOMETRY.tubeLengthFt,
    layoutDeg,
    passes,
    bundleClearanceIn,
  });
  const rows = [];
  BUNDLE_LAYOUTS.forEach((layoutDeg) => {
    BUNDLE_PASS_COUNTS.forEach((passes) => {
      const t = at(layoutDeg, passes);
      rows.push({
        layoutDeg,
        passes,
        nTubes: t.nTubes,
        bundleDiameterIn: t.bundleDiameterIn,
        shellDiameterIn: t.shellDiameterIn,
        layoutNote: t.layoutNote,
      });
    });
  });
  const second = at(BUNDLE_LAYOUTS[1], STUDIO_GEOMETRY.passes);
  const first = at(BUNDLE_LAYOUTS[0], STUDIO_GEOMETRY.passes);
  const withClearance = at(BUNDLE_LAYOUTS[0], STUDIO_GEOMETRY.passes);
  const withoutClearance = at(BUNDLE_LAYOUTS[0], STUDIO_GEOMETRY.passes, 0);
  return {
    layoutCount: Object.keys(K).length,
    passCount: Object.keys(K['30']).length,
    pairCount: Object.keys(K).length * Object.keys(K['30']).length,
    constants: K,
    areaFt2: BUNDLE_AREA_FT2,
    rows,
    // MEASURED AS DATA rather than asserted in prose: the two layout rows the
    // engine carries for 45 and 90 degrees compare equal, so the Layout box
    // changes nothing between them and the panel must not imply that it does.
    fortyFiveAndNinetyAreIdentical: JSON.stringify(K['45']) === JSON.stringify(K['90']),
    everyPairedRowAgrees: BUNDLE_PASS_COUNTS.every((passes) => {
      const a = rows.find((x) => x.layoutDeg === 45 && x.passes === passes);
      const b = rows.find((x) => x.layoutDeg === 90 && x.passes === passes);
      return a.bundleDiameterIn === b.bundleDiameterIn && a.nTubes === b.nTubes;
    }),
    firstAgainstSecond: {
      firstLayoutDeg: BUNDLE_LAYOUTS[0],
      secondLayoutDeg: BUNDLE_LAYOUTS[1],
      firstBundleIn: first.bundleDiameterIn,
      secondBundleIn: second.bundleDiameterIn,
      ratioDerived: second.bundleDiameterIn / first.bundleDiameterIn,
    },
    layoutNote: second.layoutNote,
    heldNote: HT.HELD_FOR_LITERATURE.bundleConstants,
    clearance: {
      bundleClearanceIn: STUDIO_GEOMETRY.bundleClearanceIn,
      shellWithClearanceIn: withClearance.shellDiameterIn,
      shellWithNoClearanceIn: withoutClearance.shellDiameterIn,
      differenceDerived: withClearance.shellDiameterIn - withoutClearance.shellDiameterIn,
    },
    publishedBundle: GOLD.tubeCount.map((g) => {
      const t = HT.tubeCount({
        areaFt2: g.areaFt2,
        doIn: g.doIn,
        tubeLengthFt: g.tubeLengthFt,
        layoutDeg: g.layoutDeg,
        passes: g.passes,
        bundleClearanceIn: g.bundleClearanceIn,
      });
      return {
        areaFt2: g.areaFt2,
        doIn: g.doIn,
        tubeLengthFt: g.tubeLengthFt,
        layoutDeg: g.layoutDeg,
        passes: g.passes,
        nTubes: t.nTubes,
        goldenTubes: g.nTubes,
        bundleDiameterIn: t.bundleDiameterIn,
        goldenBundleIn: g.bundleDiameterIn,
      };
    }),
    refusals: [
      refusalOf(`a layout of ${n0(BUNDLE_LAYOUT_REFUSED)} degrees, which this module carries no constants for`,
        at(BUNDLE_LAYOUT_REFUSED, STUDIO_GEOMETRY.passes)),
      refusalOf('a negative bundle-to-shell clearance',
        at(BUNDLE_LAYOUTS[0], STUDIO_GEOMETRY.passes, -STUDIO_GEOMETRY.bundleClearanceIn)),
    ],
  };
};

// ---------------------------------------------------------------------------
// SECTION 15 and SECTION 16. Effectiveness against NTU, the two ceilings, the
// arrangement that has none, and the collapse at a capacity ratio of zero.
// ---------------------------------------------------------------------------

export const effectivenessSurface = () => {
  const eff = (ntu, cr, arrangement) => HT.effectivenessFromNtu({ ntu, cr, arrangement });
  const grid = NTU_SWEEP.map((ntu) => ({
    ntu,
    byArrangement: ARRANGEMENTS.map((arrangement) => ({
      arrangement,
      byCr: CR_SWEEP.map((cr) => ({ cr, effectiveness: eff(ntu, cr, arrangement).effectiveness })),
    })),
  }));
  const topNtu = NTU_SWEEP[NTU_SWEEP.length - 1];
  const ceilings = CR_SWEEP.map((cr) => {
    const byArrangement = Object.fromEntries(ARRANGEMENTS
      .map((arrangement) => [arrangement, eff(topNtu, cr, arrangement).ceiling]));
    return { cr, ...byArrangement };
  });
  const probe = COUNTER_EFFECTIVENESS_PROBE.map((effectiveness) => ({
    effectiveness,
    byArrangement: ARRANGEMENTS.map((arrangement) => {
      const r = HT.ntuFromEffectiveness({ effectiveness, cr: CEILING_CR, arrangement });
      return {
        arrangement,
        ntu: r.error ? null : r.ntu,
        ceiling: r.ceiling === undefined ? null : r.ceiling,
        refusal: r.error
          ? refusalOf(`${arrangement} asked for an effectiveness of ${e6(effectiveness)}`, r, ['ceiling'])
          : null,
      };
    }),
  }));
  return {
    ntuSweep: NTU_SWEEP,
    crSweep: CR_SWEEP,
    arrangements: ARRANGEMENTS,
    grid,
    ceilings,
    // COUNTER-CURRENT HAS NO CEILING BELOW ONE and the engine reports null
    // rather than a number. The help text this course corrects claimed every
    // arrangement has one, and counter-current is the Rating tab's default.
    counterHasNoCeiling: ceilings.filter((c) => c.cr > 0).every((c) => c.counter === null),
    ceilingAtCapacityRatioZero: ceilings[0].counter,
    counterIsHighestEveryTime: grid.every((row) => CR_SWEEP.every((cr, j) => {
      const of = (a) => row.byArrangement.find((x) => x.arrangement === a).byCr[j].effectiveness;
      return of('counter') >= of('parallel') && of('counter') >= of('shell1');
    })),
    ceilingCr: CEILING_CR,
    probe,
    counterAnswersEveryTime: probe.every((p) => p.byArrangement
      .find((x) => x.arrangement === 'counter').refusal === null),
    publishedEpsNtu: GOLD.epsNtu.map((g) => {
      const e = eff(g.ntu, g.cr, g.arrangement);
      const back = HT.ntuFromEffectiveness({
        effectiveness: e.effectiveness, cr: g.cr, arrangement: g.arrangement,
      });
      return {
        ntu: g.ntu,
        cr: g.cr,
        arrangement: g.arrangement,
        effectiveness: e.effectiveness,
        goldenEffectiveness: g.effectiveness,
        ntuRecovered: back.error ? null : back.ntu,
      };
    }),
    refusals: [
      refusalOf(`a parallel unit asked for an effectiveness of ${e6(OVER_CEILING_EFFECTIVENESS)} at a capacity ratio of ${e6(CEILING_CR)}`,
        HT.ntuFromEffectiveness({
          effectiveness: OVER_CEILING_EFFECTIVENESS, cr: CEILING_CR, arrangement: 'parallel',
        }), ['ceiling']),
      refusalOf('a 1-2 shell unit asked for the same effectiveness',
        HT.ntuFromEffectiveness({
          effectiveness: OVER_CEILING_EFFECTIVENESS, cr: CEILING_CR, arrangement: 'shell1',
        }), ['ceiling']),
      refusalOf(`a capacity ratio of ${e6(CR_ABOVE_ONE)}, which is the two capacity rates passed the wrong way round`,
        eff(NTU_SWEEP[2], CR_ABOVE_ONE, 'counter')),
    ],
  };
};

export const collapseAtZero = () => {
  const rows = NTU_SWEEP.map((ntu) => {
    const values = ARRANGEMENTS.map((arrangement) => HT.effectivenessFromNtu({ ntu, cr: 0, arrangement }).effectiveness);
    return {
      ntu,
      counter: values[0],
      parallel: values[1],
      shell1: values[2],
      allEqual: values[0] === values[1] && values[1] === values[2],
    };
  });
  return {
    rows,
    everyRowCollapses: rows.every((r) => r.allEqual),
    // MEASURED: how many distinct effectivenesses the three arrangements return
    // on each row. One is the collapse, and anything else breaks the claim.
    distinctValuesPerRow: rows.map((r) => [...new Set([r.counter, r.parallel, r.shell1])].length),
    ceiling: HT.effectivenessFromNtu({ ntu: NTU_SWEEP[0], cr: 0, arrangement: 'parallel' }).ceiling,
  };
};

// ---------------------------------------------------------------------------
// SECTION 17. The bay at its design point, its draft type, its barometer, and
// the CROSS-FLOW CORRECTION IT DECLINES. The correction comes back null with a
// note, and the panel shows the null rather than a silent one.
// ---------------------------------------------------------------------------

export const airCoolerDesign = () => {
  const studio = HT.airCooler(STUDIO_AIR);
  const antan = HT.airCooler(ANTAN);
  const bay = (label, input, r) => ({
    label,
    qBtuHr: input.qBtuHr,
    processInF: input.processInF,
    processOutF: input.processOutF,
    ambientF: input.ambientF,
    airRiseF: input.airRiseF,
    airOutF: r.airOutF,
    lmtdF: r.lmtdF,
    uBtuHrFt2F: input.uBtuHrFt2F,
    areaFt2: r.areaFt2,
    airLbHr: r.airLbHr,
    draftType: r.draftType,
    fanInletF: r.fanInletF,
    barometricPsia: r.barometricPsia,
    airDensityLbFt3: r.airDensityLbFt3,
    acfm: r.acfm,
    fanBhp: r.fanBhp,
    motorHp: r.motorHp,
    fCorrection: r.fCorrection,
  });
  return {
    bays: [bay('the studio bay', STUDIO_AIR, studio), bay('ANTAN', ANTAN, antan)],
    airHeatCapacityDerived: STUDIO_AIR.qBtuHr / (studio.airLbHr * STUDIO_AIR.airRiseF),
    draftRows: ['forced', 'induced'].map((draftType) => {
      const r = HT.airCooler({ ...STUDIO_AIR, draftType });
      return {
        draftType,
        fanInletF: r.fanInletF,
        airDensityLbFt3: r.airDensityLbFt3,
        acfm: r.acfm,
        fanBhp: r.fanBhp,
        motorHp: r.motorHp,
      };
    }),
    draftRatioDerived: HT.airCooler({ ...STUDIO_AIR, draftType: 'induced' }).fanBhp
      / HT.airCooler({ ...STUDIO_AIR, draftType: 'forced' }).fanBhp,
    barometricRows: ANTAN_BAROMETRIC_SWEEP.map((barometricPsia) => {
      const r = HT.airCooler({ ...ANTAN, barometricPsia });
      return {
        barometricPsia, airDensityLbFt3: r.airDensityLbFt3, acfm: r.acfm, fanBhp: r.fanBhp,
      };
    }),
    densityProbe: {
      tF: DENSITY_PROBE_F,
      psia: DENSITY_PROBE_PSIA,
      // The ONE bare-number export in this module, and the documented exception
      // to its error contract. Below absolute zero it answers with a NaN that
      // its one caller turns into a named refusal.
      lbFt3: HT.airDensityLbFt3(DENSITY_PROBE_F, DENSITY_PROBE_PSIA),
      belowAbsoluteZero: String(HT.airDensityLbFt3(-1000, DENSITY_PROBE_PSIA)),
    },
    crossFlow: {
      fCorrection: studio.fCorrection,
      reportedOnBothBays: studio.fCorrection === null && antan.fCorrection === null,
      note: studio.fNote,
    },
    refusals: [
      refusalOf(`a draft type of ${DRAFT_TYPE_UNNAMED}, which is neither of the two this module carries`,
        HT.airCooler({ ...STUDIO_AIR, draftType: DRAFT_TYPE_UNNAMED })),
      refusalOf('a fan efficiency of zero',
        HT.airCooler({ ...STUDIO_AIR, fanEfficiency: FAN_EFFICIENCY_ZERO })),
      refusalOf(`a fan efficiency of ${e6(FAN_EFFICIENCY_ABOVE_ONE)}`,
        HT.airCooler({ ...STUDIO_AIR, fanEfficiency: FAN_EFFICIENCY_ABOVE_ONE })),
      refusalOf(`a motor efficiency of ${e6(MOTOR_EFFICIENCY_ABOVE_ONE)}`,
        HT.airCooler({ ...STUDIO_AIR, motorEfficiency: MOTOR_EFFICIENCY_ABOVE_ONE })),
      refusalOf(`a fan static pressure of ${e6(STATIC_PRESSURE_NEGATIVE)} inches of water`,
        HT.airCooler({ ...STUDIO_AIR, staticPressureInH2O: STATIC_PRESSURE_NEGATIVE })),
      refusalOf('an empty design ambient temperature',
        HT.airCooler({ ...STUDIO_AIR, ambientF: NaN })),
      refusalOf('a process outlet above the process inlet',
        HT.airCooler({ ...STUDIO_AIR, processOutF: STUDIO_AIR.processInF + 1 })),
    ],
  };
};

// ---------------------------------------------------------------------------
// SECTION 18. The hot day, rated at fixed UA and fixed air mass. Four columns
// do not move across every ambient and two do, and that contrast is the whole
// mechanism.
// ---------------------------------------------------------------------------

const hotDayRow = (bay, checkAmbientF) => {
  const r = HT.airCooler({ ...bay, checkAmbientF });
  const d = r.hotDay;
  if (d.error) {
    return { checkAmbientF, refusal: refusalOf(`the bay checked at ${e6(checkAmbientF)} degF`, d) };
  }
  return {
    checkAmbientF: d.ambientF,
    regime: d.regime,
    dutyFraction: d.dutyFraction,
    qBtuHr: d.qBtuHr,
    processOutF: d.processOutF,
    airRiseF: d.airRiseF,
    airOutF: d.airOutF,
    effectiveness: d.effectiveness,
    ntu: d.ntu,
    cr: d.cr,
    uaBtuHrF: d.uaBtuHrF,
    lmtdF: d.lmtdF,
    designOutletReached: d.designOutletReached,
    note: d.note,
    basis: d.basis,
    refusal: null,
  };
};

export const hotDaySweep = () => {
  const studioRows = ANTAN_AMBIENT_SWEEP.map((a) => hotDayRow(STUDIO_AIR, a));
  const antanRows = ANTAN_AMBIENT_SWEEP.map((a) => hotDayRow(ANTAN, a));
  const flat = ['effectiveness', 'ntu', 'cr', 'uaBtuHrF'];
  const moving = ['dutyFraction', 'processOutF'];
  const defaultCheck = HT.airCooler(STUDIO_AIR).hotDay;
  const cold = hotDayRow(STUDIO_AIR, ANTAN_AMBIENT_SWEEP[0]);
  return {
    ambients: ANTAN_AMBIENT_SWEEP,
    studioRows,
    antanRows,
    basis: defaultCheck.basis,
    flatColumns: flat,
    movingColumns: moving,
    // MEASURED rather than asserted: the four held columns carry ONE distinct
    // value down each table and the two that move carry as many as there are
    // rows. This is the mechanism in four columns beside two.
    studioDistinct: Object.fromEntries(flat.concat(moving)
      .map((k) => [k, distinct(studioRows, k).length])),
    antanDistinct: Object.fromEntries(flat.concat(moving)
      .map((k) => [k, distinct(antanRows, k).length])),
    fourColumnsHold: flat.every((k) => distinct(studioRows, k).length === 1
      && distinct(antanRows, k).length === 1),
    twoColumnsMove: moving.every((k) => distinct(studioRows, k).length === studioRows.length),
    defaultCheck: {
      checkAmbientF: STUDIO_AIR.checkAmbientF,
      dutyFraction: defaultCheck.dutyFraction,
      qBtuHr: defaultCheck.qBtuHr,
      processOutF: defaultCheck.processOutF,
      airRiseF: defaultCheck.airRiseF,
      note: defaultCheck.note,
    },
    selfConsistency: {
      ratedDuty: defaultCheck.qBtuHr,
      processSideDerived: (STUDIO_AIR.qBtuHr / (STUDIO_AIR.processInF - STUDIO_AIR.processOutF))
        * (STUDIO_AIR.processInF - defaultCheck.processOutF),
      airSideDerived: (STUDIO_AIR.qBtuHr / STUDIO_AIR.airRiseF) * defaultCheck.airRiseF,
    },
    coldDay: {
      checkAmbientF: ANTAN_AMBIENT_SWEEP[0],
      regime: cold.regime,
      dutyFraction: cold.dutyFraction,
      note: cold.note,
    },
    uInvariance: [STUDIO_AIR.uBtuHrFt2F, ANTAN.uBtuHrFt2F, STUDIO_AIR.uBtuHrFt2F * 10].map((u) => {
      const r = HT.airCooler({ ...STUDIO_AIR, uBtuHrFt2F: u });
      return {
        uBtuHrFt2F: u,
        areaFt2: r.areaFt2,
        uaBtuHrF: r.hotDay.uaBtuHrF,
        dutyFraction: r.hotDay.dutyFraction,
        processOutF: r.hotDay.processOutF,
      };
    }),
    publishedHotDay: GOLD.hotDay.map((g) => {
      const d = HT.airCooler({
        qBtuHr: g.qBtuHr,
        processInF: g.processInF,
        processOutF: g.processOutF,
        ambientF: g.ambientF,
        airRiseF: g.airRiseF,
        uBtuHrFt2F: STUDIO_AIR.uBtuHrFt2F,
        checkAmbientF: g.checkAmbientF,
      }).hotDay;
      return {
        qBtuHr: g.qBtuHr,
        processInF: g.processInF,
        processOutF: g.processOutF,
        ambientF: g.ambientF,
        checkAmbientF: g.checkAmbientF,
        dutyFraction: d.dutyFraction,
        goldenDutyFraction: g.dutyFraction,
        hotQBtuHr: d.qBtuHr,
        goldenHotQBtuHr: g.hotQBtuHr,
        hotProcessOutF: d.processOutF,
        goldenHotProcessOutF: g.hotProcessOutF,
        hotAirRiseF: d.airRiseF,
        goldenHotAirRiseF: g.hotAirRiseF,
        uaBtuHrF: d.uaBtuHrF,
        goldenUaBtuHrF: g.uaBtuHrF,
      };
    }),
    refusals: [
      refusalOf(`a check ambient of ${e6(AMBIENT_ABOVE_PROCESS_INLET)} degF, which is hotter than the process it is meant to cool`,
        HT.airCooler({ ...STUDIO_AIR, checkAmbientF: AMBIENT_ABOVE_PROCESS_INLET }).hotDay),
    ],
  };
};

// ---------------------------------------------------------------------------
// SECTION 19. The second method. UA times the hot-day log mean against the
// rated duty, as a ratio that sits at one.
// ---------------------------------------------------------------------------

export const secondMethod = () => {
  const rows = [];
  [['the studio bay', STUDIO_AIR], ['ANTAN', ANTAN]].forEach(([label, bay]) => {
    ANTAN_AMBIENT_SWEEP.forEach((checkAmbientF) => {
      const d = HT.airCooler({ ...bay, checkAmbientF }).hotDay;
      if (d.error || d.lmtdF === null) return;
      rows.push({
        label,
        checkAmbientF,
        ratedDuty: d.qBtuHr,
        uaTimesLmtdDerived: d.uaBtuHrF * d.lmtdF,
        ratioDerived: (d.uaBtuHrF * d.lmtdF) / d.qBtuHr,
      });
    });
  });
  return {
    rows,
    everyRatioIsOneToThePrintedPrecision: rows.every((r) => e6(r.ratioDerived) === e6(1)),
    routes: [
      ['the log mean', 'the closed form with a logarithm', 'integrating the driving force it is the closed form of, which never evaluates a logarithm'],
      ['effectiveness, counter-current', 'the closed form', 'a fourth-order march of the two-stream system with a linear shot'],
      ['effectiveness, 1-2 shell', 'the closed form', 'a march of the three-stream shell and two-pass system, with the tube turn-around as a boundary condition'],
      ['the correction factor', 'the Bowman closed form', 'the ratio of the counter-current NTU to the 1-2 NTU inverted from that march'],
      ['the shell-count conversion', 'converting the whole-unit P to a single-shell P', 'marching N shells in series and recovering the whole-unit P'],
      ['the overall coefficient', 'the resistance sum referred to the outside', 'each term on its OWN area, referred to the outside at the end, with the wall by quadrature'],
      ['the tube-side Reynolds number', 'a mass velocity through a formed flow area', 'four times the mass flow over pi times the bore times the viscosity, which forms no area at all'],
      ['the bundle diameter', 'a ratio raised to a reciprocal exponent', 'bisecting on the diameter until the geometry form balances'],
      ['the fan power', 'the customary constant with inches of water in it', 'a pressure rise in pascals, which MEASURES the water density that constant is written against'],
      ['the hot day', 'effectiveness-NTU at fixed UA', 'bisecting the surface equation at the same fixed UA'],
    ].map(([what, engineRoute, oracleRoute]) => ({ what, engineRoute, oracleRoute })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 20. THE HELD REGISTER, THE FITTED NUMBERS AND THE PINS. Every panel
// carries the wording that marks a held quantity unverified, and nothing in
// this group is presented as validated anywhere.
// ---------------------------------------------------------------------------

/** The wording that marks a quantity unverified, in one place. */
export const HELD_MARKER = 'HELD FOR LITERATURE';

/**
 * A pin is not a validation. These five numbers are the FITTED correlation
 * constants, pinned by literal in the engine gate so that moving one is a
 * reviewed act. NO ORACLE CAN VALIDATE A FIT, so no panel may present any of
 * them as validated, and nothing in this course grades one. The values are READ
 * out of the engine's own declared table rather than typed here.
 */
export const FITTED_CONSTANT_KEYS = [
  'dittusBoelterA',
  'dittusBoelterReExp',
  'dittusBoelterPrExpHeating',
  'siederTateExp',
  'laminarNusselt',
];

export const heldItems = () => {
  const held = HT.HELD_FOR_LITERATURE;
  const ids = Object.keys(held);
  return {
    marker: HELD_MARKER,
    // COUNTED by reading the register, which is the authority because it is the
    // thing the engine's returns point at.
    heldCount: ids.length,
    items: ids.map((id) => ({ id, note: held[id] })),
    fitted: FITTED_CONSTANT_KEYS.map((key) => ({ key, value: HT.DECLARED_CONSTANTS[key] })),
    fittedCount: FITTED_CONSTANT_KEYS.length,
    declaredConstants: Object.keys(HT.DECLARED_CONSTANTS)
      .map((key) => ({ key, value: HT.DECLARED_CONSTANTS[key] })),
    declaredBounds: Object.keys(HT.DECLARED_BOUNDS)
      .map((key) => ({ key, value: HT.DECLARED_BOUNDS[key] })),
    // The two roundings the digest MEASURES out of the engine rather than
    // quoting from its source.
    measuredRoundings: {
      prandtlAtUnitViscosity: studioFilmAt(studioLoop(studioChain()).tubes.nTubes, {
        muCp: VISCOSITY_PROBE_CP,
      }).pr,
      viscosityConversionDerived: (studioFilmAt(studioLoop(studioChain()).tubes.nTubes, {
        muCp: VISCOSITY_PROBE_CP,
      }).pr * STUDIO_TUBE_FLUID.kBtuHrFtF) / STUDIO_COLD.cpBtuLbF,
      viscosityConversionDeclared: HT.DECLARED_CONSTANTS.cpToLbFtHr,
      goldenViscosityConversionDerived: GOLD.derivedConstants.cpToLbFtHrDerived,
      gasConstantDeclared: HT.DECLARED_CONSTANTS.gasConstantPsiaFt3LbmolR,
      goldenGasConstantDerived: GOLD.derivedConstants.gasConstantPsiaFt3LbmolRDerived,
      waterDensityImpliedByTheFanConstant: GOLD.derivedConstants.waterLbFt3ImpliedBy6356,
    },
    goldenIsSynthetic: {
      sections: Object.keys(GOLD).length,
      rows: Object.values(GOLD).reduce((a, v) => a + (Array.isArray(v) ? v.length : 1), 0),
      reason: 'this repository carries no published heat exchanger case to take a row from, so the golden file is declared synthetic and says so. What stands in for published data is route independence, the constant pins, and the analytic limits.',
    },
    analyticLimits: [
      ['a thin cylindrical wall is a flat plate', 'the factor of two in the wall term'],
      ['the log mean sits below the arithmetic mean at unequal ends', 'the substitution of one mean for the other'],
      ['the correction factor tends to one as P tends to zero', 'the shape of the correction curve at small cold rises'],
      ['the parallel ceiling and the 1-2 shell ceiling', 'the two closed forms at high NTU'],
      ['every arrangement collapses onto one curve at a capacity ratio of zero', 'three separate branches against one another'],
      ['counter-current flow has no ceiling', 'the claim that every arrangement has one, which is false'],
      ['self-consistency across the whole chain', 'a duty, a coefficient, a surface and a driving force that fail the equation they came from'],
    ].map(([limit, fixes]) => ({ limit, fixes })),
  };
};

/**
 * THE REFUSALS WHOSE MESSAGE CARRIES THE ENGINE'S OWN HISTORY, FOUND RATHER THAN
 * LISTED. A refusal quoting what the module used to return is the engine
 * speaking, and truncating it would change what the engine says, so the message
 * is carried verbatim and a panel prints a FRAME on the line above it.
 *
 * THE LIST IS MEASURED, because a hand-kept one would be a claim to maintain: the
 * count is whatever the census finds, and the two fan-efficiency refusals share
 * one message, which a list of four would have got wrong. Digest Section 21 is
 * the only history in this course and it says so in its own title and its own
 * first line; every other value this lab returns is what the engine does now.
 */
export const HISTORY_MESSAGE_RE = /\bused to\b|\bno longer\b/i;

export const historyCarryingRefusals = () => {
  const carrying = refusalCensus().probes
    .filter((r) => HISTORY_MESSAGE_RE.test(r.message || ''));
  return {
    frame: 'The engine message below also states the behaviour FC6-0 replaced. That half of the message is history and is not what the engine does now.',
    labels: [...new Set(carrying.map((r) => r.label))],
    refusals: carrying,
    count: carrying.length,
    distinctMessages: [...new Set(carrying.map((r) => r.message))].length,
  };
};

// ---------------------------------------------------------------------------
// THE REFUSAL CENSUS. Every refusal any panel can display, in one list, so the
// refusal gate has a surface it cannot silently lose. A probe whose call
// ANSWERS comes back with a message of null and fails the gate, which is the
// defect FC4's lab suite shipped.
// ---------------------------------------------------------------------------

export const REFUSAL_READERS = [
  'balanceThreeWays', 'logMeanBothPairings', 'surfaceFromThree', 'tubesAndOvershoot',
  'correctionAcrossP', 'resistanceStack', 'filmThreeRegimes', 'bundleAndLayout',
  'effectivenessSurface', 'airCoolerDesign', 'hotDaySweep',
];

export const refusalCensus = () => {
  const out = [];
  const push = (r) => { if (r && typeof r === 'object' && 'message' in r) out.push(r); };
  balanceThreeWays().refusals.forEach(push);
  push(balanceThreeWays().arrangementThreeWays.unknown);
  push(balanceThreeWays().parallelRefusedCounterAnswered.refusal);
  logMeanBothPairings().refusals.forEach(push);
  surfaceFromThree().refusals.forEach(push);
  tubesAndOvershoot().refusals.forEach(push);
  correctionAcrossP().refusals.forEach(push);
  correctionAcrossP().sweep.forEach((s) => push(s.refusal));
  resistanceStack().refusals.forEach(push);
  const film = filmThreeRegimes();
  film.refusals.forEach(push);
  push(film.transitionBand.refusal);
  film.flowRows.forEach((f) => push(f.refusal));
  push(coolingRefused().cooling);
  push(coolingRefused().unknownService);
  bundleAndLayout().refusals.forEach(push);
  effectivenessSurface().refusals.forEach(push);
  effectivenessSurface().probe.forEach((p) => p.byArrangement.forEach((a) => push(a.refusal)));
  airCoolerDesign().refusals.forEach(push);
  hotDaySweep().refusals.forEach(push);
  loopCloses().studio.refusedSeeds.forEach(push);
  loopCloses().trailRows.forEach((t) => push(t.refusal));
  return {
    probes: out,
    count: out.length,
    distinctMessages: [...new Set(out.map((r) => r.message))].length,
    everyProbeCarriesAMessage: out.every((r) => typeof r.message === 'string' && r.message.length > 20),
    withEvidence: out.filter((r) => Object.keys(r.evidence).length > 0).length,
  };
};

// ---------------------------------------------------------------------------
// The course page's three readings: one headline set a tier, every figure a
// return value.
// ---------------------------------------------------------------------------

export const associateReading = () => {
  const b = balanceThreeWays();
  const l = logMeanBothPairings();
  const loop = loopCloses();
  return {
    cHot: b.cMin,
    cCold: b.cMax,
    qBtuHr: b.studio.qBtuHr,
    tcOut: b.studio.tcOut,
    basis: b.studio.basis,
    lmtdF: l.rows[0].lmtdF,
    arithmeticMeanDerived: l.rows[0].arithmeticMeanDerived,
    areaFt2: loop.studio.areaFt2,
    nTubes: loop.studio.nTubes,
    actualAreaFt2: loop.studio.actualAreaFt2,
    areaMarginPct: loop.studio.areaMarginPct,
    trail: loop.studio.trail,
    iterations: loop.studio.iterations,
  };
};

export const professionalReading = () => {
  const s = resistanceStack();
  const f = filmThreeRegimes();
  const w = thinWallLimit();
  return {
    uClean: s.uClean,
    uDirty: s.uDirty,
    foulingPenaltyPct: s.foulingPenaltyPct,
    foulingShareOfTotalPctDerived: s.foulingShareOfTotalPctDerived,
    controlling: s.controlling,
    runnerUp: s.runnerUp,
    controllingMarginPct: s.controllingMarginPct,
    re: f.converged.re,
    pr: f.converged.pr,
    hiBtuHrFt2F: f.converged.hBtuHrFt2F,
    thinnestWallRatioDerived: w.rows[w.rows.length - 1].ratioAtMiddleKDerived,
    coolingRefusalMessage: coolingRefused().cooling.message,
  };
};

export const expertReading = () => {
  const e = effectivenessSurface();
  const h = hotDaySweep();
  const m = secondMethod();
  const a = airCoolerDesign();
  return {
    parallelCeiling: e.ceilings.find((c) => c.cr === CEILING_CR).parallel,
    shell1Ceiling: e.ceilings.find((c) => c.cr === CEILING_CR).shell1,
    counterCeiling: e.ceilings.find((c) => c.cr === CEILING_CR).counter,
    counterNtuAtTheTopProbe: e.probe[e.probe.length - 1].byArrangement
      .find((x) => x.arrangement === 'counter').ntu,
    effectiveness: h.studioRows[0].effectiveness,
    ntu: h.studioRows[0].ntu,
    cr: h.studioRows[0].cr,
    uaBtuHrF: h.studioRows[0].uaBtuHrF,
    dutyFractionAtTheDefaultCheck: h.defaultCheck.dutyFraction,
    processOutAtTheDefaultCheck: h.defaultCheck.processOutF,
    secondMethodRatio: m.rows[0].ratioDerived,
    fanBhp: a.bays[0].fanBhp,
    motorHp: a.bays[0].motorHp,
    fCorrection: a.crossFlow.fCorrection,
  };
};

/**
 * EVERY TEACHING READER, named once. The panels, the page and the gates all
 * walk this list, so a reader added without a name here is caught and a reader
 * renamed away cannot silently empty a sweep.
 */
export const READERS = [
  'engineScope', 'balanceThreeWays', 'logMeanBothPairings', 'surfaceFromThree',
  'tubesAndOvershoot', 'loopCloses', 'correctionAcrossP', 'resistanceStack',
  'thinWallLimit', 'filmThreeRegimes', 'coolingRefused', 'bundleAndLayout',
  'effectivenessSurface', 'collapseAtZero', 'airCoolerDesign', 'hotDaySweep',
  'secondMethod', 'heldItems', 'historyCarryingRefusals', 'refusalCensus',
  'goldenCounts', 'associateReading', 'professionalReading', 'expertReading',
];
