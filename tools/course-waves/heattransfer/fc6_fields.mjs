// THE FC6 TEACHING FIELDS. Every condition the digest is built on, in one
// place, so a sweep, a claim gate and a lesson all read the same case.
//
// THREE TEACHING CASES AND THEY SHARE NOTHING WITH THE CAPSTONE. The capstone
// runs AMENAM, UBIT and OKWORI, written in fc6_fields_capstone.mjs, and nothing
// in this file or in fc6_dump.mjs imports, reads or reproduces any of it.
// gate_capstone_leak.py sweeps both directions on every rebuild.
//
//   THE STUDIO CASE   the Heat Exchanger & Cooling Studio's own shipped
//                     defaults, composed the way the studio composes them.
//                     It is here because a learner can open that app and see
//                     every one of these numbers on the screen, and because
//                     the tube count is a LOOP there and the digest should
//                     show it closing.
//   ORON              a four-pass shell-and-tube exchanger, with its own
//                     loop, chosen so the film lands well clear of the
//                     transition band the engine refuses.
//   ANTAN             an air cooler bay, with a hot afternoon to hold.
//
// The published golden cases are other units entirely and are read from the
// golden file rather than restated here.

/* ------------------------------------------------------------------ *
 * THE STUDIO CASE: defaultInputs() in src/contexts/HeatExchangerContext.jsx
 * of the Suite, as the Heat Exchanger & Cooling Studio ships it.
 * ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ *
 * ORON: a four-pass exchanger with a computed tube-side film.
 * ------------------------------------------------------------------ */
export const ORON_HOT = { mLbHr: 74000, cpBtuLbF: 0.62 };
export const ORON_COLD = { mLbHr: 112000, cpBtuLbF: 0.99 };
export const ORON_TERMINALS = { thIn: 345, thOut: 235, tcIn: 122 };
export const ORON_FILM = { hoBtuHrFt2F: 240, doIn: 1.0, diIn: 0.782, kWallBtuHrFtF: 26, foulingOut: 0.0012, foulingIn: 0.0018 };
export const ORON_TUBE_FLUID = { muCp: 0.45, kBtuHrFtF: 0.085 };
export const ORON_GEOMETRY = { tubeLengthFt: 20, layoutDeg: 30, passes: 4, bundleClearanceIn: 3 };
export const ORON_SEEDS = [4, 24, 120, 600];

/* ------------------------------------------------------------------ *
 * ANTAN: an air cooler bay and the afternoon it is judged on.
 * ------------------------------------------------------------------ */
export const ANTAN = {
  qBtuHr: 15500000, processInF: 235, processOutF: 158, ambientF: 98, airRiseF: 26,
  uBtuHrFt2F: 5.1, checkAmbientF: 112, draftType: 'forced', barometricPsia: 14.3,
};
/** The ambients the bay is read across, hot and cold of its design day. */
export const ANTAN_AMBIENT_SWEEP = [86, 92, 98, 104, 112, 124];
/** An elevation sweep, because the duty of this machine is set by air density. */
export const ANTAN_BAROMETRIC_SWEEP = [14.7, 14.3, 13.2, 12.0];

/* ------------------------------------------------------------------ *
 * Sweeps and probes. Every one names the behaviour it exposes.
 * ------------------------------------------------------------------ */

/**
 * P across a fixed R, chosen so the column shows all THREE behaviours in order:
 * an answer with no warning, an answer WITH the steep-curve warning, and then a
 * configuration one shell cannot reach at all, which is a refusal and not a low
 * F. The first cut of this sweep jumped straight from no warning to refused, so
 * the prose beside it claimed a warning the table did not contain. Caught by
 * reading the table.
 */
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
/** A duty one shell cannot reach at all, which is a refusal and not a low F. */
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

/**
 * THE CONTRACT CENSUS. Every export of the module enumerated, every one that
 * takes a named-argument object asked a question it can answer and a question
 * it cannot, and the SHAPE of both answers read off the return value rather
 * than asserted from the source. The digest's contract block is printed from
 * this, so it states nothing the census did not measure.
 */
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
  return { names, frozen, callable, doors, helpers };
};
