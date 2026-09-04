// Teaching lab for PD8, Well Intervention. The three panels, the shipped
// lessons and the vitest files all read this one module, so a number shown to
// a learner and a number a test pins cannot drift apart.
//
// Everything here is the vendored engine's own output. Every slope, every
// intercept, every fit quality, every span, every denominator, every skin
// floor, every productivity multiplier, every mechanism, every confidence and
// every treatment verdict below is a return value from a call into
// engines/production/interventionDiagnostics.js, run over
// test-data/production/goldens/intervention_cases.json or over the TEACHING
// CASES this wave declared for itself. Nothing in this file re-implements the
// engine. The only arithmetic done here is the arithmetic a PANEL would
// otherwise have to do on the engine's return values: a difference, a ratio, a
// margin, a share, a count, a fitted line drawn from a returned slope and
// intercept. That arithmetic lives here on purpose, so that a panel is a
// renderer and never a calculator.
//
// UNITS. Producing time in DAYS. Radii in FT. A water-oil ratio is a bare
// stb/stb RATIO and a gas-oil ratio is scf/stb, and the engine's own threshold
// does not know which of the two it was handed. Water cut in PERCENT. Skin and
// the pseudo-steady-state group are dimensionless. Fit quality is a FRACTION
// here and a PERCENTAGE inside the engine's own error strings, which is the
// live confusion in this domain, so every field carrying one says which in its
// name. A log-log slope is d ln y / d ln x and CARRIES NO UNIT AT ALL. Spans
// are in LOG CYCLES. Nothing here is SI.
//
// TEN PROVENANCE RULES THIS FILE EXISTS TO KEEP. All ten were found in the
// material rather than assumed, and every one of them is easy to lose in a
// panel.
//
//   1. THE HEADLINE RULE OF THIS WAVE. A CHAN VERDICT IS A FUNCTION OF A DIAL
//      NOBODY DOCUMENTS. `lateFraction` defaults to 0.5, has no guidance
//      anywhere in the module, no sweep helper, and nothing in the return
//      object naming its effect. On one history, with not one datum changed,
//      it moves the derivative slope across the channelling threshold and
//      therefore moves the water shutoff verdict from candidate to blocked. So
//      EVERY accessor here that exposes a diagnosis exposes the window it was
//      read on beside it, under distinctly named fields:
//
//         lateFraction        the dial as handed in
//         lateFromT           the day the window actually starts on
//         marginToThreshold   the derivative slope less `channellingSlope`
//
//      A panel cannot show a mechanism without the window that produced it,
//      because no accessor here returns one without the other.
//
//   2. TWO FITS COME BACK IN ONE OBJECT ON TWO DIFFERENT WINDOWS. `worSlope`
//      is fitted over EVERY late sample. `derivativeSlope` is fitted over only
//      the late samples whose derivative is POSITIVE. The engine returns them
//      side by side with nothing saying they were measured on different data,
//      and `spanDecades` describes the second window only while being named as
//      though it described the reading. `teachingTwoWindows` carries both
//      point counts, both spans and the difference between them.
//
//   3. THE FILTER IS SILENT AND IT IS WHERE THE CONTRARY EVIDENCE GOES.
//      `logLogSlope` drops every point whose y is not strictly positive and
//      then fits what is left, without saying so, and the `n` it returns is
//      the count AFTER the drop. On a history whose ratio has turned back
//      down, that drop removes exactly the coning evidence. So every accessor
//      that exposes a fit exposes `handedIn` beside `n`.
//
//   4. THE ENGINE COMPUTES THE CONTRARY EVIDENCE AND THEN DISCARDS IT.
//      `chanDiagnosis` counts `negativeDerivatives` and reads that count only
//      inside the `!derFit.ok` branch and the flat branch. Whenever three
//      positive samples survive, the count is thrown away and the note it
//      carries is unreachable. `fallingOnlyDemo` is the constructed case that
//      DOES reach it, so a panel can show what the engine would have said.
//
//   5. A MISSING COLUMN IS NOT A MISSING COLUMN, IT IS A ZERO. `Number(null)`
//      is 0 and `Number(undefined)` is NaN, and `chanDiagnosis` requires the
//      time and the ratio to be finite but never the derivative. So the same
//      missing data in two spellings returns two opposite verdicts, and the
//      reassuring one is the spelling every JSON export and every SQL null
//      produces. `spellingRows` returns both under one call.
//
//   6. THE FLAT BRANCH ASSERTS SOMETHING IT NEVER CHECKED. Its note opens "The
//      ratio is sitting flat at X" and nothing in the branch looks at the
//      ratio; the condition is entirely about the derivative, and the same
//      return object carries `worSlope` and `worR2` fitted on the ratio.
//      `flatBranchRows` returns the sentence and the contradicting slope on
//      one row, because they only mean anything together.
//
//   7. THE ZERO-VARIANCE GUARD FIRES BY ACCIDENT. `r2 = syy > 0 ? ordinary : 1`
//      fires exactly when `syy` accumulates to EXACTLY zero over identical y,
//      and whether it does depends on the sample count AND the value TOGETHER.
//      It fires on small tidy cases and stops firing on real ones, which is
//      the pattern that survives a test suite and fails in production.
//      `zeroVarianceSweepRows` sweeps both axes rather than asserting a rule.
//
//   8. THE SKIN GUARD SITS AT THE SINGULARITY AND ITS MESSAGE ADVERTISES A
//      DIFFERENT LIMIT. `skinPiMultiplier` refuses only where the denominator
//      reaches zero; its refusal text then says real treatments reach about -3
//      to -5 on acid and -5 to -6 on a fracture. Everything in between is
//      accepted in silence. `teachingSkinGuardRows` walks that gap and carries
//      the distance above the floor on every row.
//
//   9. TWO FAILURE CONTRACTS IN ONE MODULE. `skinPiMultiplier` returns
//      `{ ok: false, error }`. `pssDenominator`, `minimumSkin` and
//      `skinFromPiRatio` return a BARE NaN for the same bad geometry, which a
//      caller cannot tell from an answer without a `Number.isFinite` at every
//      call site. Every refusal row here carries `isFinite` or `ok` explicitly.
//
//  10. A GOLDEN, A DERIVED SWEEP AND A TEACHING CASE ARE THREE DIFFERENT
//      CLAIMS AND EVERY ROW SAYS WHICH IT IS. A `golden` value was committed
//      in intervention_cases.json by an independent stdlib oracle: the slope
//      by THEIL-SEN, the median of every pairwise slope, sharing no mean, no
//      square and no covariance with the engine's least squares; and the skin
//      uplift by a full radial Darcy rate in SI divided as two real flow
//      rates. A `derived` row is the shipped engine re-run on published inputs
//      or a sweep around them, and a sweep point is not a published case. A
//      `teaching` row belongs to ELELENWO-4 and the three constructed
//      demonstrations, invented by this wave so that the Expert results have a
//      case a lesson may quote: no oracle has ever checked any of it.
//
// WHAT THE ORACLE NEVER CALLS, WHICH IS MOST OF THE MODULE. The golden
// publishes four labelled histories with a late derivative slope each, five
// skin pairs, one geometry floor and one power law. It publishes NO expected
// mechanism, NO expected confidence, NO expected verdict, NO expected refusal
// and NO expected block reason. `chanDiagnosis`, `screenTreatments`,
// `rankTreatments` and `skinFromPiRatio` are asserted against nothing at all.
// The only part of this module that returns a VERDICT is the part with no
// golden, and `publishedVerdictRows` is the four assertions nobody wrote.
//
// THE CAPSTONE BOUNDARY. There is no capstone material in this file at all.
// PD8's graded well is a different well under different conditions from
// anything in this lab, and its eighteen graded fields live in the wave's own
// derivation and never enter the lab, so a panel cannot reach one by mistake.
// What guards that is panelCapstoneGuard.test.js, which reads the graded field
// list out of the wave directory and checks every number this lab exposes
// against it, dimension blind, at ten times the grader's own absolute
// tolerance, under the same restatements the PD5, PD6 and PD7 guards use.
//
// PURITY AND CACHING. Every accessor is pure and deterministic: no random
// number anywhere, and two calls with the same arguments return equal values.
// The engine runs that several accessors re-read are cached, and every
// accessor maps a cached return into FRESH rows, so a panel cannot mutate one
// and change what another panel sees.

import golden from '@petrolord/engines/test-data/production/goldens/intervention_cases.json';
import {
  CHAN_DEFAULTS, CHAN_MECHANISMS, TREATMENTS, VERDICT_ORDER,
  logLogSlope, chanDiagnosis, mechanism, treatment,
  pssDenominator, minimumSkin, skinPiMultiplier, skinFromPiRatio,
  screenTreatments, rankTreatments,
} from '@petrolord/engines/engines/production/interventionDiagnostics.js';

export {
  CHAN_DEFAULTS, CHAN_MECHANISMS, TREATMENTS, VERDICT_ORDER,
  logLogSlope, chanDiagnosis, mechanism, treatment,
  pssDenominator, minimumSkin, skinPiMultiplier, skinFromPiRatio,
  screenTreatments, rankTreatments,
};

export const GOLDEN = golden;

// ---------------------------------------------------------------------------
// CONSTANTS THIS FILE DECLARES. Four are the wave's own declared constants and
// the rest are published case inputs read off the golden file or off the
// module's own exported defaults. None of them is an engine value dressed up
// as something else.
// ---------------------------------------------------------------------------

/** The 3/4 of the pseudo-steady-state radial denominator. Not adjustable. */
export const PSS_CONSTANT = 0.75;

/** Metres per foot, exact. */
export const M_PER_FT = 0.3048;

/** Pascals per psi. */
export const PA_PER_PSI = 6894.757;

/** Square metres per darcy. */
export const SQ_M_PER_DARCY = 9.869233e-16;

/** Pascal seconds per centipoise, exact. */
export const PA_S_PER_CP = 0.001;

/**
 * The number of samples below which `chanDiagnosis` refuses outright. Read off
 * the module's own branch rather than typed as folklore.
 */
export const MINIMUM_HISTORY_SAMPLES = 6;

/**
 * The band `lateFraction` is silently clamped into. The clamp is the one thing
 * about that dial documented nowhere: a value outside this range is replaced
 * rather than refused.
 */
export const LATE_FRACTION_CLAMP = Object.freeze({ lo: 0.1, hi: 1 });

/**
 * The deepest skin the module's OWN refusal text calls achievable, quoted from
 * that text. It is not a constant the engine holds anywhere, which is exactly
 * the finding: the guard is at the singularity and the advice is here.
 */
export const REFUSAL_TEXT_ACID_LIMIT = -5;
export const REFUSAL_TEXT_FRACTURE_LIMIT = -6;

// ---------------------------------------------------------------------------
// Small internals. Nothing exported from here computes physics.
// ---------------------------------------------------------------------------

const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
};

const LOG10 = Math.LN10;

/** Log cycles between two times. The unit every span in this file is in. */
const decades = (from, to) => (from > 0 && to > 0 ? Math.log(to / from) / LOG10 : null);

/** Geometric spacing, the way a production history is sampled in log time. */
const geometricTimes = (fromDay, toDay, count) => Array.from(
  { length: count },
  (_, i) => (count === 1 ? fromDay : fromDay * ((toDay / fromDay) ** (i / (count - 1)))),
);

const finiteOrNull = (v) => (Number.isFinite(v) ? v : null);

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

// ---------------------------------------------------------------------------
// SECTION A: THE MEASUREMENT. logLogSlope on its own, on the one published
// case the oracle actually checks.
// ---------------------------------------------------------------------------

/** The published power law and the engine's fit through it. PUBLISHED plus DERIVED. */
export const powerLawFit = memoize(() => {
  const pts = golden.power_law.points;
  const fit = logLogSlope({ points: pts, xKey: 'x', yKey: 'y' });
  return {
    provenance: 'golden and derived',
    pointCount: pts.length,
    publishedSlope: golden.power_law.theilSen.slope,
    publishedIntercept: golden.power_law.theilSen.intercept,
    trueSlope: golden.power_law.trueSlope,
    trueIntercept: golden.power_law.trueIntercept,
    ok: fit.ok,
    engineSlope: num(fit.slope),
    engineIntercept: num(fit.intercept),
    engineR2Fraction: num(fit.r2),
    n: fit.n,
    spanDecades: num(fit.spanDecades),
    slopeDifference: num(fit.slope) === null ? null : fit.slope - golden.power_law.theilSen.slope,
    interceptDifference: num(fit.intercept) === null ? null
      : fit.intercept - golden.power_law.theilSen.intercept,
    r2ShortfallFromPerfect: num(fit.r2) === null ? null : 1 - fit.r2,
    theTwoRoutesShareNothing: true,
  };
});

/** The eleven published points, with the fitted line drawn from the returned fit. */
export const powerLawRows = () => {
  const fit = powerLawFit();
  return golden.power_law.points.map((p, i) => ({
    index: i + 1,
    x: p.x,
    y: p.y,
    lnX: Math.log(p.x),
    lnY: Math.log(p.y),
    fittedY: fit.engineSlope === null ? null
      : Math.exp(fit.engineIntercept + fit.engineSlope * Math.log(p.x)),
    provenance: 'golden',
  }));
};

/** What the measurement refuses, and the exact words it refuses with. DERIVED. */
export const logLogRefusals = () => {
  const cases = [
    {
      label: 'two points only',
      call: logLogSlope({ points: [{ x: 1, y: 1 }, { x: 2, y: 2 }] }),
    },
    {
      label: 'four points of which one y is negative and one is zero',
      call: logLogSlope({
        points: [{ x: 1, y: 1 }, { x: 2, y: -2 }, { x: 3, y: 0 }, { x: 4, y: 4 }],
      }),
    },
    {
      label: 'every point at the same time',
      call: logLogSlope({
        points: [{ x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }],
      }),
    },
    {
      label: 'no points at all',
      call: logLogSlope({ points: [] }),
    },
  ];
  return cases.map((c) => ({
    label: c.label,
    ok: !!c.call.ok,
    refused: !c.call.ok,
    n: c.call.n,
    error: c.call.error || null,
    provenance: 'derived',
  }));
};

/**
 * THE FILTER IS THE POINT. Six points handed in of which two are not positive.
 * The fit succeeds, reports n after the drop, and says nothing about it, and
 * the span it reports is shorter than the span it was handed.
 */
export const silentDropRow = memoize(() => {
  const handed = [
    { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 4 },
    { x: 8, y: 8 }, { x: 16, y: -16 }, { x: 32, y: -32 },
  ];
  const fit = logLogSlope({ points: handed });
  const handedSpan = decades(
    Math.min(...handed.map((p) => p.x)),
    Math.max(...handed.map((p) => p.x)),
  );
  return {
    provenance: 'derived',
    handedIn: handed.length,
    nReturned: fit.n,
    dropped: handed.length - fit.n,
    ok: fit.ok,
    slope: num(fit.slope),
    r2Fraction: num(fit.r2),
    reportedSpanDecades: num(fit.spanDecades),
    handedSpanDecades: handedSpan,
    spanUnderstatedByDecades: num(fit.spanDecades) === null ? null
      : handedSpan - fit.spanDecades,
    theFitSaidNothingAboutTheDrop: true,
  };
});

// ---------------------------------------------------------------------------
// SECTION B: THE GEOMETRY GROUP. pssDenominator, minimumSkin, skinPiMultiplier
// and the inverse, on the published geometry.
// ---------------------------------------------------------------------------

export const PUBLISHED_GEOMETRY = Object.freeze({
  reFt: golden.minimumSkin.reFt,
  rwFt: golden.minimumSkin.rwFt,
  publishedMinimumSkin: golden.minimumSkin.value,
});

export const publishedFloor = memoize(() => {
  const { reFt, rwFt } = PUBLISHED_GEOMETRY;
  const engineFloor = minimumSkin({ reFt, rwFt });
  return {
    provenance: 'golden and derived',
    reFt,
    rwFt,
    reOverRw: reFt / rwFt,
    lnReOverRw: Math.log(reFt / rwFt),
    pssConstant: PSS_CONSTANT,
    publishedMinimumSkin: PUBLISHED_GEOMETRY.publishedMinimumSkin,
    engineMinimumSkin: finiteOrNull(engineFloor),
    difference: Number.isFinite(engineFloor)
      ? engineFloor - PUBLISHED_GEOMETRY.publishedMinimumSkin : null,
    denominatorAtZeroSkin: finiteOrNull(pssDenominator({ reFt, rwFt, skin: 0 })),
  };
});

export const DRAINAGE_SWEEP_FT = Object.freeze([500, 1000, 1500, 2000, 3000, 5000, 10000]);

/**
 * HOW LITTLE THE DRAINAGE RADIUS MATTERS AND HOW MUCH THE SKIN DOES. A
 * drainage radius is a guess and a logarithm forgives a guess; a skin is a
 * measurement and the group adds it undivided.
 */
export const drainageSweepRows = (reList = DRAINAGE_SWEEP_FT) => {
  const rwFt = PUBLISHED_GEOMETRY.rwFt;
  return reList.map((reFt) => ({
    reFt,
    rwFt,
    lnReOverRw: Math.log(reFt / rwFt),
    denominatorAtZeroSkin: finiteOrNull(pssDenominator({ reFt, rwFt, skin: 0 })),
    minimumSkin: finiteOrNull(minimumSkin({ reFt, rwFt })),
    published: reFt === PUBLISHED_GEOMETRY.reFt,
    provenance: 'derived',
  }));
};

export const drainageSweepHeadline = () => {
  const rows = drainageSweepRows();
  const lo = rows[0];
  const hi = rows[rows.length - 1];
  return {
    provenance: 'derived',
    loReFt: lo.reFt,
    hiReFt: hi.reFt,
    foldChangeInDrainageRadius: hi.reFt / lo.reFt,
    denominatorMovesBy: hi.denominatorAtZeroSkin - lo.denominatorAtZeroSkin,
    oneUnitOfSkinMovesItBy: 1,
    oneUnitOfSkinMoreThanCoversIt:
      1 > (hi.denominatorAtZeroSkin - lo.denominatorAtZeroSkin) / 3,
  };
};

export const SKIN_SWEEP = Object.freeze([-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 4, 6, 8, 12, 20]);

/** The denominator against skin, on the published geometry. DERIVED sweep. */
export const denominatorSweepRows = (skins = SKIN_SWEEP) => {
  const { reFt, rwFt } = PUBLISHED_GEOMETRY;
  const undamaged = pssDenominator({ reFt, rwFt, skin: 0 });
  return skins.map((skin) => {
    const denominator = pssDenominator({ reFt, rwFt, skin });
    return {
      skin,
      denominator: finiteOrNull(denominator),
      flowEfficiency: Number.isFinite(denominator) ? undamaged / denominator : null,
      provenance: 'derived',
    };
  });
};

/**
 * WHAT BOTH OF THESE REFUSE, AND HOW. A bare NaN, which is a different failure
 * contract from the one skinPiMultiplier uses on the same bad geometry.
 */
export const geometryRefusals = () => {
  const rows = [
    {
      label: 'a wellbore radius larger than the drainage radius, denominator',
      value: pssDenominator({ reFt: 0.35, rwFt: 2000, skin: 0 }),
      contract: 'a bare not-a-number',
    },
    {
      label: 'a wellbore radius larger than the drainage radius, floor',
      value: minimumSkin({ reFt: 0.35, rwFt: 2000 }),
      contract: 'a bare not-a-number',
    },
    {
      label: 'a wellbore radius of zero',
      value: pssDenominator({ reFt: 2000, rwFt: 0, skin: 0 }),
      contract: 'a bare not-a-number',
    },
    {
      label: 'a claimed productivity ratio of zero, inverse',
      value: skinFromPiRatio({ reFt: 2000, rwFt: 0.35, ratio: 0 }),
      contract: 'a bare not-a-number',
    },
    {
      label: 'a negative claimed productivity ratio, inverse',
      value: skinFromPiRatio({ reFt: 2000, rwFt: 0.35, ratio: -2 }),
      contract: 'a bare not-a-number',
    },
  ];
  return rows.map((r) => ({
    label: r.label,
    contract: r.contract,
    isFinite: Number.isFinite(r.value),
    refused: !Number.isFinite(r.value),
    provenance: 'derived',
  }));
};

/** The five published before-and-after skin pairs. PUBLISHED plus DERIVED. */
export const publishedSkinRows = () => golden.skin.map((c, i) => {
  const res = skinPiMultiplier({
    reFt: c.reFt, rwFt: c.rwFt, skinBefore: c.skinBefore, skinAfter: c.skinAfter,
  });
  return {
    index: i + 1,
    reFt: c.reFt,
    rwFt: c.rwFt,
    skinBefore: c.skinBefore,
    skinAfter: c.skinAfter,
    publishedMultiplier: c.multiplier,
    ok: !!res.ok,
    engineMultiplier: num(res.multiplier),
    difference: num(res.multiplier) === null ? null : res.multiplier - c.multiplier,
    denominatorBefore: num(res.before),
    denominatorAfter: num(res.after),
    flowEfficiencyBefore: num(res.flowEfficiencyBefore),
    flowEfficiencyAfter: num(res.flowEfficiencyAfter),
    minimumSkinInsideTheResult: num(res.minimumSkin),
    error: res.error || null,
    provenance: 'golden and derived',
  };
});

/** The first gate on the multiplier: exactly one when the skin does not move. */
export const skinIdentity = () => {
  const { reFt, rwFt } = PUBLISHED_GEOMETRY;
  const res = skinPiMultiplier({ reFt, rwFt, skinBefore: 0, skinAfter: 0 });
  return {
    provenance: 'derived',
    ok: !!res.ok,
    multiplier: num(res.multiplier),
    departureFromOne: num(res.multiplier) === null ? null : res.multiplier - 1,
    itIsOneNumberDividedByItself: true,
  };
};

export const ONE_UNIT_STARTS = Object.freeze([20, 12, 8, 5, 3, 2, 1]);

/** The same one unit of skin removed from different starting points. DERIVED. */
export const oneUnitRows = (starts = ONE_UNIT_STARTS) => {
  const { reFt, rwFt } = PUBLISHED_GEOMETRY;
  return starts.map((skinBefore) => {
    const res = skinPiMultiplier({ reFt, rwFt, skinBefore, skinAfter: skinBefore - 1 });
    return {
      skinBefore,
      skinAfter: skinBefore - 1,
      ok: !!res.ok,
      multiplier: num(res.multiplier),
      upliftPct: num(res.multiplier) === null ? null : (res.multiplier - 1) * 100,
      error: res.error || null,
      provenance: 'derived',
    };
  });
};

export const CLAIMED_UPLIFTS = Object.freeze([1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30]);

/**
 * THE INVERSE, AND WHAT IT DOES NOT CHECK. A vendor claims a fold increase and
 * this is the skin that claim implies. There is no plausibility check of any
 * kind and no ok flag, so a claim implying a skin past everything the module's
 * own refusal text calls real comes back as a bare number with nothing said.
 */
export const impliedSkinRows = (ratios = CLAIMED_UPLIFTS) => {
  const { reFt, rwFt } = PUBLISHED_GEOMETRY;
  const floor = minimumSkin({ reFt, rwFt });
  return ratios.map((ratio) => {
    const implied = skinFromPiRatio({ reFt, rwFt, ratio });
    return {
      claimedUplift: ratio,
      impliedSkin: finiteOrNull(implied),
      isFinite: Number.isFinite(implied),
      geometryFloor: finiteOrNull(floor),
      distanceAboveTheFloor: Number.isFinite(implied) ? implied - floor : null,
      pastTheFractureLimitTheModuleAdvertises:
        Number.isFinite(implied) && implied < REFUSAL_TEXT_FRACTURE_LIMIT,
      flaggedByTheEngine: false,
      provenance: 'derived',
    };
  });
};

/** The round trip, which is the only check there is on the inverse. DERIVED. */
export const roundTripRows = () => golden.skin.slice(0, 3).map((c, i) => {
  const res = skinPiMultiplier({
    reFt: c.reFt, rwFt: c.rwFt, skinBefore: c.skinBefore, skinAfter: c.skinAfter,
  });
  const back = res.ok
    ? skinFromPiRatio({
      reFt: c.reFt, rwFt: c.rwFt, ratio: res.multiplier, skinReference: c.skinBefore,
    })
    : NaN;
  return {
    index: i + 1,
    multiplier: num(res.multiplier),
    statedSkinAfter: c.skinAfter,
    invertedSkin: finiteOrNull(back),
    difference: Number.isFinite(back) ? back - c.skinAfter : null,
    provenance: 'derived',
  };
});

// ---------------------------------------------------------------------------
// SECTION C: THE FOUR PUBLISHED HISTORIES, AND THE FOUR ASSERTIONS NOBODY
// WROTE. The golden publishes each history and its late derivative slope and
// stops there: no expected mechanism, no expected confidence, no expected
// verdict. The rows below are what the classifier says when nothing is
// checking it.
// ---------------------------------------------------------------------------

export const PUBLISHED_HISTORY_NAMES = Object.freeze(
  ['channelling', 'coning', 'displacement', 'flat'],
);

const publishedRun = memoize((name, lateFraction) => {
  const h = golden.histories[name];
  return chanDiagnosis({ series: h.series, lateFraction });
});

/** One published history, read at the default window. PUBLISHED plus DERIVED. */
export const publishedHistoryRow = (name, lateFraction = 0.5) => {
  const h = golden.histories[name];
  const d = publishedRun(name, lateFraction);
  const late = h.series.filter((p) => p.t >= (d.lateFromT ?? -Infinity));
  const derFit = logLogSlope({
    points: h.series.filter((p) => p.derivative > 0),
    xKey: 't',
    yKey: 'derivative',
    fromX: d.lateFromT,
  });
  return {
    name,
    form: h.meta.form,
    provenance: 'golden and derived',
    sampleCount: h.series.length,
    firstDay: h.series[0].t,
    lastDay: h.series[h.series.length - 1].t,
    historySpanDecades: decades(h.series[0].t, h.series[h.series.length - 1].t),
    firstRatio: h.series[0].ratio,
    lastRatio: h.series[h.series.length - 1].ratio,
    publishedLateDerivativeSlope: h.lateDerivativeSlope,
    lateFraction,
    lateFromT: num(d.lateFromT),
    lateSamples: late.length,
    latePositiveDerivatives: late.filter((p) => p.derivative > 0).length,
    lateNegativeDerivatives: late.filter((p) => p.derivative < 0).length,
    lateZeroDerivatives: late.filter((p) => p.derivative === 0).length,
    ok: !!d.ok,
    mechanismId: d.mechanism ? d.mechanism.id : null,
    mechanismLabel: d.mechanism ? d.mechanism.label : null,
    treatable: d.mechanism ? !!d.mechanism.treatable : null,
    confidence: d.confidence || 'n/a',
    ambiguous: d.ambiguous === true,
    worSlope: num(d.worSlope),
    worR2Fraction: num(d.worR2),
    derivativeSlope: num(d.derivativeSlope),
    derivativeR2Fraction: num(d.derivativeR2),
    spanDecades: num(d.spanDecades),
    engineLeastSquaresLessPublishedTheilSen:
      num(derFit.slope) === null || h.lateDerivativeSlope === null
        ? null : derFit.slope - h.lateDerivativeSlope,
    marginToThreshold: num(d.derivativeSlope) === null
      ? null : d.derivativeSlope - CHAN_DEFAULTS.channellingSlope,
    notes: d.notes || [],
    error: d.error || null,
  };
};

export const publishedHistoryRows = (lateFraction = 0.5) =>
  PUBLISHED_HISTORY_NAMES.map((n) => publishedHistoryRow(n, lateFraction));

/**
 * The four assertions the oracle could have written and did not, each beside
 * the water shutoff verdict the module gates on it. This is the part of the
 * module with no golden and it is the part that decides the spend.
 */
export const publishedVerdictRows = (lateFraction = 0.5) =>
  PUBLISHED_HISTORY_NAMES.map((name) => {
    const row = publishedHistoryRow(name, lateFraction);
    const screen = screenTreatments({
      well: TEACHING_WELL_ROW, diagnosis: publishedRun(name, lateFraction),
    });
    const find = (id) => screen.find((s) => s.id === id);
    return {
      name,
      provenance: 'derived',
      mechanismId: row.mechanismId,
      confidence: row.confidence,
      lateFraction,
      lateFromT: row.lateFromT,
      derivativeSlope: row.derivativeSlope,
      marginToThreshold: row.marginToThreshold,
      waterShutoffVerdict: find('waterShutoff').verdict,
      waterShutoffBlocked: find('waterShutoff').blocked,
      rateReductionVerdict: find('rateReduction').verdict,
      recompletionVerdict: find('recompletion').verdict,
      theGoldenAssertsNoneOfThis: true,
    };
  });

// ---------------------------------------------------------------------------
// SECTION D: THE TEACHING WELL, ELELENWO-4.
//
// TEACHING. Not a real well and not a published case. Designed so that ONE
// history argues both mechanisms at once: the water-oil ratio climbs faster
// than proportionally for most of its life, the well is beaned back, and the
// ratio falls, which is the coning field test and the coning answer. Both
// stories are in the same series and the engine reports only the treatable
// one.
// ---------------------------------------------------------------------------

export const TEACHING_WELL_NAME = 'ELELENWO-4';

export const TEACHING_WELL_SPEC = Object.freeze({
  name: TEACHING_WELL_NAME,
  sampleCount: 38,
  firstDay: 15,
  lastDay: 3600,
  linearCoefficientPerDay: 0.0032,
  exponent: 1.9,
  crossoverDays: 1500,
  chokedOnDay: 2200,
  postChokeFloor: 1.3,
  postChokeExponent: -0.85,
});

export const TEACHING_WELL_ROW = Object.freeze({
  skin: 7.5,
  reFt: 1180,
  rwFt: 0.354,
  wctPct: 74.5,
  gorScfStb: 2152,
  expectedGorScfStb: 950,
  flowing: true,
});

/**
 * The second coefficient, fixed by the crossover: the linear term and the
 * power term are equal at `crossoverDays`, so the shape has one free choice
 * rather than two. This is a declared property of the teaching case and not an
 * engine value.
 */
export const teachingPowerCoefficient = () => {
  const s = TEACHING_WELL_SPEC;
  return s.linearCoefficientPerDay * (s.crossoverDays ** (1 - s.exponent));
};

/**
 * The teaching history, sample by sample, in the shape the engine reads:
 * { t, ratio, derivative }, with the derivative the Bourdet derivative against
 * log time, d(ratio)/d(ln t), which the caller supplies because the engine
 * deliberately does not compute it.
 */
export const teachingSeries = memoize(() => {
  const s = TEACHING_WELL_SPEC;
  const c2 = teachingPowerCoefficient();
  const times = geometricTimes(s.firstDay, s.lastDay, s.sampleCount);
  const preChoke = (t) => {
    const linear = s.linearCoefficientPerDay * t;
    const power = c2 * (t ** s.exponent);
    return { ratio: linear + power, derivative: linear + s.exponent * power };
  };
  const before = times.filter((t) => t <= s.chokedOnDay);
  const tBreak = before[before.length - 1];
  const wBreak = preChoke(tBreak).ratio;
  return times.map((t) => {
    if (t <= s.chokedOnDay) {
      const p = preChoke(t);
      return { t, ratio: p.ratio, derivative: p.derivative };
    }
    const ratio = s.postChokeFloor
      + (wBreak - s.postChokeFloor) * ((t / tBreak) ** s.postChokeExponent);
    return { t, ratio, derivative: s.postChokeExponent * (ratio - s.postChokeFloor) };
  });
});

/** The same history as display rows, with the sample number and the sign. */
export const teachingSamples = () => teachingSeries().map((p, i) => ({
  index: i + 1,
  tDays: p.t,
  ratio: p.ratio,
  derivative: p.derivative,
  derivativeIsPositive: p.derivative > 0,
  afterTheChoke: p.t > TEACHING_WELL_SPEC.chokedOnDay,
  provenance: 'teaching',
}));

export const teachingHeadline = memoize(() => {
  const series = teachingSeries();
  const s = TEACHING_WELL_SPEC;
  const before = series.filter((p) => p.t <= s.chokedOnDay);
  const peak = before[before.length - 1];
  return {
    provenance: 'teaching',
    name: TEACHING_WELL_NAME,
    sampleCount: series.length,
    firstDay: series[0].t,
    lastDay: series[series.length - 1].t,
    historySpanDecades: decades(series[0].t, series[series.length - 1].t),
    firstRatio: series[0].ratio,
    lastRatio: series[series.length - 1].ratio,
    peakRatio: peak.ratio,
    lastDayBeforeTheChoke: peak.t,
    chokedOnDay: s.chokedOnDay,
    linearCoefficientPerDay: s.linearCoefficientPerDay,
    exponent: s.exponent,
    crossoverDays: s.crossoverDays,
    powerCoefficient: teachingPowerCoefficient(),
    postChokeFloor: s.postChokeFloor,
    postChokeExponent: s.postChokeExponent,
    positiveDerivatives: series.filter((p) => p.derivative > 0).length,
    negativeDerivatives: series.filter((p) => p.derivative < 0).length,
    ...TEACHING_WELL_ROW,
  };
});

/**
 * THE ASSOCIATE MEASUREMENT: the whole history fitted as one, with no window
 * and no classifier anywhere near it. The fitted line is drawn from the
 * returned slope and intercept and from nothing else.
 */
export const teachingFullFit = memoize(() => {
  const series = teachingSeries();
  const fit = logLogSlope({ points: series, xKey: 't', yKey: 'ratio' });
  const derFit = logLogSlope({
    points: series.filter((p) => p.derivative > 0), xKey: 't', yKey: 'derivative',
  });
  return {
    provenance: 'teaching',
    ok: !!fit.ok,
    slope: num(fit.slope),
    intercept: num(fit.intercept),
    r2Fraction: num(fit.r2),
    r2Percent: num(fit.r2) === null ? null : fit.r2 * 100,
    n: fit.n,
    handedIn: series.length,
    dropped: series.length - fit.n,
    spanDecades: num(fit.spanDecades),
    coefficientFromIntercept: num(fit.intercept) === null ? null : Math.exp(fit.intercept),
    error: fit.error || null,
    derivativeOk: !!derFit.ok,
    derivativeSlope: num(derFit.slope),
    derivativeR2Fraction: num(derFit.r2),
    derivativeN: derFit.n,
    derivativeHandedIn: series.length,
    derivativeDropped: series.length - derFit.n,
    derivativeSpanDecades: num(derFit.spanDecades),
  };
});

/** The history and the fitted line together, which is what a log-log plot is. */
export const teachingFitRows = () => {
  const fit = teachingFullFit();
  return teachingSeries().map((p, i) => ({
    index: i + 1,
    tDays: p.t,
    ratio: p.ratio,
    fittedRatio: fit.slope === null ? null
      : Math.exp(fit.intercept + fit.slope * Math.log(p.t)),
    residualInLnRatio: fit.slope === null ? null
      : Math.log(p.ratio) - (fit.intercept + fit.slope * Math.log(p.t)),
    provenance: 'teaching',
  }));
};

const teachingRun = memoize((lateFraction) => chanDiagnosis({
  series: teachingSeries(), lateFraction,
}));

/**
 * The diagnosis at one window setting, with the window that produced it. RULE
 * ONE: no accessor here returns a mechanism without the window beside it.
 */
export const teachingDiagnosis = (lateFraction = 0.5) => {
  const d = teachingRun(lateFraction);
  const series = teachingSeries();
  const clamped = Math.min(Math.max(lateFraction, LATE_FRACTION_CLAMP.lo), LATE_FRACTION_CLAMP.hi);
  const late = Number.isFinite(d.lateFromT)
    ? series.filter((p) => p.t >= d.lateFromT) : [];
  const positives = late.filter((p) => p.derivative > 0);
  return {
    provenance: 'teaching',
    lateFraction,
    clampedLateFraction: clamped,
    wasClamped: clamped !== lateFraction,
    lateFromT: num(d.lateFromT),
    lateSamples: late.length,
    latePositiveDerivatives: positives.length,
    lateNegativeDerivatives: late.filter((p) => p.derivative < 0).length,
    windowRunsDecades: late.length > 1
      ? decades(late[0].t, late[late.length - 1].t) : null,
    ok: !!d.ok,
    mechanismId: d.mechanism ? d.mechanism.id : null,
    mechanismLabel: d.mechanism ? d.mechanism.label : null,
    treatable: d.mechanism ? !!d.mechanism.treatable : null,
    confidence: d.confidence || 'n/a',
    ambiguous: d.ambiguous === true,
    worSlope: num(d.worSlope),
    worR2Fraction: num(d.worR2),
    derivativeSlope: num(d.derivativeSlope),
    derivativeR2Fraction: num(d.derivativeR2),
    spanDecades: num(d.spanDecades),
    channellingThreshold: CHAN_DEFAULTS.channellingSlope,
    ambiguousBand: CHAN_DEFAULTS.ambiguousBand,
    coningThreshold: CHAN_DEFAULTS.coningSlope,
    marginToThreshold: num(d.derivativeSlope) === null
      ? null : d.derivativeSlope - CHAN_DEFAULTS.channellingSlope,
    notes: d.notes || [],
    error: d.error || null,
  };
};

/**
 * RULE TWO: two fits in one return object, on two different windows, and
 * nothing in the object says so.
 */
export const teachingTwoWindows = (lateFraction = 0.5) => {
  const d = teachingDiagnosis(lateFraction);
  const series = teachingSeries();
  const late = Number.isFinite(d.lateFromT)
    ? series.filter((p) => p.t >= d.lateFromT) : [];
  const positives = late.filter((p) => p.derivative > 0);
  const positiveSpan = positives.length > 1
    ? decades(positives[0].t, positives[positives.length - 1].t) : null;
  return {
    provenance: 'teaching',
    lateFraction,
    lateFromT: d.lateFromT,
    ratioFitSamples: late.length,
    ratioFitSpanDecades: d.windowRunsDecades,
    ratioSlope: d.worSlope,
    ratioR2Fraction: d.worR2Fraction,
    derivativeFitSamples: positives.length,
    derivativeFitSpanDecades: positiveSpan,
    derivativeSlope: d.derivativeSlope,
    derivativeR2Fraction: d.derivativeR2Fraction,
    samplesShort: late.length - positives.length,
    decadesShort: d.windowRunsDecades !== null && positiveSpan !== null
      ? d.windowRunsDecades - positiveSpan : null,
    slopeGap: d.worSlope !== null && d.derivativeSlope !== null
      ? d.derivativeSlope - d.worSlope : null,
    theObjectSaysNothingAboutThis: true,
  };
};

export const WINDOW_SWEEP = Object.freeze([0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);

/**
 * THE DIAL THAT DECIDES THE SPEND. Every column is the same 38 samples read
 * through a different window, and the water shutoff verdict follows the dial.
 */
export const windowSweepRows = (fractions = WINDOW_SWEEP) => fractions.map((lateFraction) => {
  const d = teachingDiagnosis(lateFraction);
  const screen = screenTreatments({
    well: TEACHING_WELL_ROW, diagnosis: teachingRun(lateFraction),
  });
  const water = screen.find((s) => s.id === 'waterShutoff');
  return {
    lateFraction,
    lateFromT: d.lateFromT,
    lateSamples: d.lateSamples,
    latePositiveDerivatives: d.latePositiveDerivatives,
    lateNegativeDerivatives: d.lateNegativeDerivatives,
    derivativeSlope: d.derivativeSlope,
    derivativeR2Fraction: d.derivativeR2Fraction,
    spanDecades: d.spanDecades,
    worSlope: d.worSlope,
    worR2Fraction: d.worR2Fraction,
    mechanismId: d.mechanismId,
    mechanismLabel: d.mechanismLabel,
    confidence: d.confidence,
    ambiguous: d.ambiguous,
    channellingThreshold: d.channellingThreshold,
    marginToThreshold: d.marginToThreshold,
    waterShutoffVerdict: water.verdict,
    waterShutoffBlocked: water.blocked,
    isDefault: lateFraction === 0.5,
    provenance: 'teaching',
  };
});

/** Where the verdict flips, and by how little. */
export const windowFlipHeadline = memoize(() => {
  const rows = windowSweepRows();
  const treatable = rows.filter((r) => r.waterShutoffVerdict === 'candidate');
  const blocked = rows.filter((r) => r.waterShutoffVerdict !== 'candidate');
  const slopes = rows.map((r) => r.derivativeSlope).filter((v) => v !== null);
  let flipAt = null;
  for (let i = 1; i < rows.length; i += 1) {
    if (rows[i].waterShutoffVerdict !== rows[i - 1].waterShutoffVerdict
      && rows[i - 1].waterShutoffVerdict === 'candidate') {
      flipAt = { from: rows[i - 1], to: rows[i] };
      break;
    }
  }
  const dflt = rows.find((r) => r.isDefault);
  return {
    provenance: 'teaching',
    settingsSwept: rows.length,
    treatableSettings: treatable.length,
    blockedSettings: blocked.length,
    flipFromFraction: flipAt ? flipAt.from.lateFraction : null,
    flipToFraction: flipAt ? flipAt.to.lateFraction : null,
    flipFromSlope: flipAt ? flipAt.from.derivativeSlope : null,
    flipToSlope: flipAt ? flipAt.to.derivativeSlope : null,
    flipFromMargin: flipAt ? flipAt.from.marginToThreshold : null,
    flipToMargin: flipAt ? flipAt.to.marginToThreshold : null,
    channellingThreshold: CHAN_DEFAULTS.channellingSlope,
    defaultFraction: dflt ? dflt.lateFraction : null,
    defaultSlope: dflt ? dflt.derivativeSlope : null,
    defaultMargin: dflt ? dflt.marginToThreshold : null,
    defaultVerdict: dflt ? dflt.waterShutoffVerdict : null,
    slopeRange: slopes.length ? Math.max(...slopes) - Math.min(...slopes) : null,
    lowestSlope: slopes.length ? Math.min(...slopes) : null,
    highestSlope: slopes.length ? Math.max(...slopes) : null,
    theDialMovesTheSlopeFurtherThanTheDefaultMarginToTheThreshold:
      dflt && slopes.length
        ? (Math.max(...slopes) - Math.min(...slopes)) > Math.abs(dflt.marginToThreshold)
        : null,
    theModuleShipsNoSweepHelper: true,
  };
});

export const CLAMP_SWEEP = Object.freeze([-3, 0, 0.05, 0.1, 1, 2.5]);

/** The clamp, which is the one thing about the dial documented nowhere. */
export const windowClampRows = (fractions = CLAMP_SWEEP) => fractions.map((lateFraction) => {
  const d = teachingDiagnosis(lateFraction);
  return {
    handedIn: lateFraction,
    clampedTo: d.clampedLateFraction,
    wasClamped: d.wasClamped,
    refused: false,
    lateFromT: d.lateFromT,
    derivativeSlope: d.derivativeSlope,
    mechanismId: d.mechanismId,
    mechanismLabel: d.mechanismLabel,
    provenance: 'teaching',
  };
});

// ---------------------------------------------------------------------------
// SECTION D2: THE EVIDENCE THAT ARGUES THE OTHER WAY, AND WHERE IT GOES.
// ---------------------------------------------------------------------------

/** The samples the classifier discarded: every one whose derivative is negative. */
export const discardedSamples = () => teachingSeries()
  .filter((p) => p.derivative < 0)
  .map((p, i) => ({
    index: i + 1,
    tDays: p.t,
    ratio: p.ratio,
    derivative: p.derivative,
    provenance: 'teaching',
  }));

/**
 * THE CENTRE OF THE EXPERT TIER. The discarded stretch fitted on its own,
 * against the fit that kept the rest. A rate cut followed by a falling
 * water-oil ratio is the coning field test and the coning answer, and the fit
 * through it is CLEANER than the fit behind the verdict the engine gave.
 */
export const discardedFit = memoize((lateFraction = 0.5) => {
  const dropped = teachingSeries().filter((p) => p.derivative < 0);
  const ratioFit = logLogSlope({ points: dropped, xKey: 't', yKey: 'ratio' });
  const magnitudeFit = logLogSlope({
    points: dropped.map((p) => ({ t: p.t, magnitude: -p.derivative })),
    xKey: 't',
    yKey: 'magnitude',
  });
  const kept = teachingDiagnosis(lateFraction);
  return {
    provenance: 'teaching',
    lateFraction,
    lateFromT: kept.lateFromT,
    droppedCount: dropped.length,
    firstDroppedDay: dropped.length ? dropped[0].t : null,
    lastDroppedDay: dropped.length ? dropped[dropped.length - 1].t : null,
    chokedOnDay: TEACHING_WELL_SPEC.chokedOnDay,
    ok: !!ratioFit.ok,
    droppedRatioSlope: num(ratioFit.slope),
    droppedRatioR2Fraction: num(ratioFit.r2),
    droppedRatioN: ratioFit.n,
    droppedRatioSpanDecades: num(ratioFit.spanDecades),
    droppedMagnitudeSlope: num(magnitudeFit.slope),
    droppedMagnitudeR2Fraction: num(magnitudeFit.r2),
    error: ratioFit.error || null,
    reportedMechanismId: kept.mechanismId,
    reportedMechanismLabel: kept.mechanismLabel,
    reportedDerivativeSlope: kept.derivativeSlope,
    reportedDerivativeR2Fraction: kept.derivativeR2Fraction,
    samplesUsed: kept.latePositiveDerivatives,
    samplesDroppedInsideTheWindow: kept.lateNegativeDerivatives,
    theEngineCountedThemAndDiscardedTheCount: true,
    theDiscardedFitIsCleaner: num(ratioFit.r2) !== null && kept.derivativeR2Fraction !== null
      ? ratioFit.r2 > kept.derivativeR2Fraction : null,
    r2AdvantageOfTheDiscardedFit: num(ratioFit.r2) !== null && kept.derivativeR2Fraction !== null
      ? ratioFit.r2 - kept.derivativeR2Fraction : null,
    theUnreachableNote: 'A ratio that has turned back down is itself the coning signature, but confirm it against the plot rather than on this alone.',
  };
});

export const SPAN_LOSS_SWEEP = Object.freeze([0.2, 0.25, 0.3, 0.35]);

/**
 * THE COMPOUNDING COST. Dropping the contrary samples also SHORTENS the span
 * the fit sits on, and the span has its own gate. At a short enough window the
 * drop is the difference between a reading and a refusal.
 */
export const spanLossRows = (fractions = SPAN_LOSS_SWEEP) => fractions.map((lateFraction) => {
  const d = teachingDiagnosis(lateFraction);
  return {
    lateFraction,
    lateFromT: d.lateFromT,
    windowRunsDecades: d.windowRunsDecades,
    reportedSpanDecades: d.spanDecades,
    lossDecades: d.windowRunsDecades !== null && d.spanDecades !== null
      ? d.windowRunsDecades - d.spanDecades : null,
    minSpanDecades: CHAN_DEFAULTS.minSpanDecades,
    clearsTheGateBy: d.spanDecades === null ? null : d.spanDecades - CHAN_DEFAULTS.minSpanDecades,
    mechanismId: d.mechanismId,
    provenance: 'teaching',
  };
});

/**
 * THE PATH THAT DOES READ THE COUNT. The falling stretch with nothing before
 * it, so no positive derivative survives, the derivative fit fails and the
 * coning branch fires with the note that is otherwise unreachable.
 */
export const fallingOnlyDemo = memoize(() => {
  const series = teachingSeries();
  const tail = series.slice(-8).map((p) => ({
    t: p.t, ratio: p.ratio, derivative: -Math.abs(p.derivative),
  }));
  const d = chanDiagnosis({ series: tail, lateFraction: 1 });
  return {
    provenance: 'teaching',
    sampleCount: tail.length,
    everyDerivativeIsNegative: tail.every((p) => p.derivative < 0),
    firstDay: tail[0].t,
    lastDay: tail[tail.length - 1].t,
    lateFraction: 1,
    lateFromT: num(d.lateFromT),
    ok: !!d.ok,
    mechanismId: d.mechanism ? d.mechanism.id : null,
    mechanismLabel: d.mechanism ? d.mechanism.label : null,
    treatable: d.mechanism ? !!d.mechanism.treatable : null,
    confidence: d.confidence || 'n/a',
    worSlope: num(d.worSlope),
    worR2Fraction: num(d.worR2),
    derivativeSlope: num(d.derivativeSlope),
    derivativeR2Fraction: num(d.derivativeR2),
    spanDecades: num(d.spanDecades),
    marginToThreshold: num(d.derivativeSlope) === null
      ? null : d.derivativeSlope - CHAN_DEFAULTS.channellingSlope,
    notes: d.notes || [],
    rows: tail.map((p, i) => ({ index: i + 1, tDays: p.t, ratio: p.ratio, derivative: p.derivative })),
  };
});

// ---------------------------------------------------------------------------
// SECTION D3: THE TEACHING GEOMETRY AND WHAT REMOVING SKIN IS WORTH ON IT.
// ---------------------------------------------------------------------------

export const teachingGeometry = memoize(() => {
  const { reFt, rwFt, skin } = TEACHING_WELL_ROW;
  const floor = minimumSkin({ reFt, rwFt });
  const before = pssDenominator({ reFt, rwFt, skin });
  const undamaged = pssDenominator({ reFt, rwFt, skin: 0 });
  return {
    provenance: 'teaching',
    reFt,
    rwFt,
    reOverRw: reFt / rwFt,
    lnReOverRw: Math.log(reFt / rwFt),
    skinBefore: skin,
    minimumSkin: finiteOrNull(floor),
    denominatorAtSkin: finiteOrNull(before),
    denominatorAtZeroSkin: finiteOrNull(undamaged),
    flowEfficiency: Number.isFinite(before) ? undamaged / before : null,
    theDrainageRadiusIsAGuess: true,
  };
});

export const TEACHING_ACID_SKIN_AFTER = -2.2;

export const teachingAcidJob = memoize(() => {
  const { reFt, rwFt, skin } = TEACHING_WELL_ROW;
  const res = skinPiMultiplier({
    reFt, rwFt, skinBefore: skin, skinAfter: TEACHING_ACID_SKIN_AFTER,
  });
  return {
    provenance: 'teaching',
    skinBefore: skin,
    skinAfter: TEACHING_ACID_SKIN_AFTER,
    ok: !!res.ok,
    multiplier: num(res.multiplier),
    denominatorBefore: num(res.before),
    denominatorAfter: num(res.after),
    flowEfficiencyBefore: num(res.flowEfficiencyBefore),
    flowEfficiencyAfter: num(res.flowEfficiencyAfter),
    minimumSkin: num(res.minimumSkin),
    error: res.error || null,
  };
});

export const SKIN_GUARD_SWEEP = Object.freeze([
  -1, -2, -3, -4, -5, -5.5, -6, -6.5, -6.8, -7, -7.2, -7.3, -7.35, -7.361, -7.4, -7.6, -8,
]);

/**
 * RULE EIGHT. Walk the after-skin down past everything the refusal text calls
 * real and watch the answer get bigger and the engine stay quiet. The refusal
 * arrives only at the pole, where the productivity index goes infinite.
 */
export const teachingSkinGuardRows = (afters = SKIN_GUARD_SWEEP) => {
  const { reFt, rwFt, skin } = TEACHING_WELL_ROW;
  const floor = minimumSkin({ reFt, rwFt });
  return afters.map((skinAfter) => {
    const res = skinPiMultiplier({ reFt, rwFt, skinBefore: skin, skinAfter });
    return {
      skinAfter,
      ok: !!res.ok,
      multiplier: num(res.multiplier),
      denominatorAfter: num(res.after),
      minimumSkin: finiteOrNull(floor),
      distanceAboveTheFloor: Number.isFinite(floor) ? skinAfter - floor : null,
      pastTheAcidLimitTheTextAdvertises: skinAfter < REFUSAL_TEXT_ACID_LIMIT,
      pastTheFractureLimitTheTextAdvertises: skinAfter < REFUSAL_TEXT_FRACTURE_LIMIT,
      warnings: 0,
      notes: 0,
      error: res.error || null,
      provenance: 'teaching',
    };
  });
};

export const skinGuardHeadline = memoize(() => {
  const rows = teachingSkinGuardRows();
  const accepted = rows.filter((r) => r.ok);
  const refused = rows.filter((r) => !r.ok);
  const inTheGap = accepted.filter((r) => r.pastTheFractureLimitTheTextAdvertises);
  const honest = rows.find((r) => r.skinAfter === -5);
  const overreach = rows.find((r) => r.skinAfter === -6.8);
  const acid = teachingAcidJob();
  const geometry = teachingGeometry();
  return {
    provenance: 'teaching',
    minimumSkin: geometry.minimumSkin,
    acidLimitTheTextAdvertises: REFUSAL_TEXT_ACID_LIMIT,
    fractureLimitTheTextAdvertises: REFUSAL_TEXT_FRACTURE_LIMIT,
    settingsSwept: rows.length,
    acceptedInSilence: accepted.length,
    refused: refused.length,
    acceptedPastTheAdvertisedFractureLimit: inTheGap.length,
    theGapInSkinUnits: geometry.minimumSkin === null
      ? null : REFUSAL_TEXT_FRACTURE_LIMIT - geometry.minimumSkin,
    honestSkinAfter: honest ? honest.skinAfter : null,
    honestMultiplier: honest ? honest.multiplier : null,
    overreachSkinAfter: overreach ? overreach.skinAfter : null,
    overreachMultiplier: overreach ? overreach.multiplier : null,
    overreachOverHonest: honest && overreach && honest.multiplier
      ? overreach.multiplier / honest.multiplier : null,
    designedAcidMultiplier: acid.multiplier,
    overreachOverTheDesignedJob: acid.multiplier && overreach
      ? overreach.multiplier / acid.multiplier : null,
    theEngineFlaggedNoneOfIt: true,
  };
});

/** The before-skin has the same guard and a different sentence. TEACHING. */
export const skinRefusalRows = () => {
  const { reFt, rwFt, skin } = TEACHING_WELL_ROW;
  const cases = [
    {
      label: 'an after-skin below the floor this geometry allows',
      res: skinPiMultiplier({ reFt, rwFt, skinBefore: skin, skinAfter: -8 }),
    },
    {
      label: 'a before-skin below the floor this geometry allows',
      res: skinPiMultiplier({ reFt, rwFt, skinBefore: -8.5, skinAfter: -2 }),
    },
    {
      label: 'a wellbore radius larger than the drainage radius',
      res: skinPiMultiplier({ reFt: 0.354, rwFt: 1180, skinBefore: 5, skinAfter: 0 }),
    },
  ];
  return cases.map((c) => ({
    label: c.label,
    ok: !!c.res.ok,
    refused: !c.res.ok,
    contract: 'an object with ok false and a reason',
    error: c.res.error || null,
    provenance: 'teaching',
  }));
};

export const TEACHING_CLAIMS = Object.freeze([2, 4, 6, 8.5, 12]);

/** Auditing a vendor's claim on the teaching geometry. Nothing is said back. */
export const claimAuditRows = (ratios = TEACHING_CLAIMS) => {
  const { reFt, rwFt } = TEACHING_WELL_ROW;
  const floor = minimumSkin({ reFt, rwFt });
  return ratios.map((ratio) => {
    const implied = skinFromPiRatio({ reFt, rwFt, ratio });
    return {
      claimedUplift: ratio,
      impliedSkin: finiteOrNull(implied),
      isFinite: Number.isFinite(implied),
      geometryFloor: finiteOrNull(floor),
      distanceAboveTheFloor: Number.isFinite(implied) ? implied - floor : null,
      pastTheFractureLimitTheModuleAdvertises:
        Number.isFinite(implied) && implied < REFUSAL_TEXT_FRACTURE_LIMIT,
      flaggedByTheEngine: false,
      provenance: 'teaching',
    };
  });
};

// ---------------------------------------------------------------------------
// SECTION D4: THE SCREENING, AS A SET OF GATES.
//
// Every verdict carries its reasons in full, because a score with the
// reasoning folded into it is a number nobody can argue with, and the arguing
// is the point: an intervention is somebody's money. What the engine does NOT
// carry is which gate decided a verdict, so the gate names below are this
// file's own description of the branch each verdict came out of. They are
// prose, not arithmetic: every number on a screening row is an engine return.
// ---------------------------------------------------------------------------

export const TREATMENT_GATES = Object.freeze([
  {
    id: 'matrixAcid',
    gate: 'the skin gate',
    gateDescription: 'Candidate above a skin of 2, marginal above 0, no at or below 0, and unknown when no skin was entered. The diagnosis is never consulted.',
  },
  {
    id: 'hydraulicFracture',
    gate: 'no gate at all',
    gateDescription: 'The verdict is consider whatever the skin is. The branch tests the skin and then returns the same string on both arms of the test, so nothing it reads can change what it says.',
  },
  {
    id: 'waterShutoff',
    gate: 'the water cut gate, then the mechanism gate',
    gateDescription: 'Below 30 percent water there is no problem worth an intervention and the mechanism is never read. Above it the diagnosis decides: channelling is a candidate, coning and displacement are blocked with a reason, and no diagnosis at all is blocked as well.',
  },
  {
    id: 'gasShutoff',
    gate: 'the gas-oil ratio gate',
    gateDescription: 'A factor of two on the expected ratio and nothing else. Both numbers are needed or the verdict is unknown. The diagnosis is never consulted, and the reasoning ends by telling the user to run the diagnostic on the gas.',
  },
  {
    id: 'recompletion',
    gate: 'the mechanism gate, or the skin gate',
    gateDescription: 'Candidate when the mechanism is channelling or the skin is above 8, and consider otherwise.',
  },
  {
    id: 'rateReduction',
    gate: 'the mechanism gate',
    gateDescription: 'Candidate only for coning, which is the one mechanism where less drawdown genuinely works, and no for everything else.',
  },
  {
    id: 'artificialLift',
    gate: 'the flowing gate, then the water cut gate',
    gateDescription: 'Candidate when the well is not flowing, consider above 70 percent water, and no otherwise. The diagnosis is never consulted.',
  },
]);

export const DIAGNOSIS_SOURCES = Object.freeze([
  ['water050', 'the water history at the default window'],
  ['water090', 'the same water history at a window of 0.9'],
  ['gasNull', 'the gas history, whose derivative column was never computed'],
  ['none', 'no diagnosis at all'],
]);

const diagnosisFor = (source) => {
  if (source === 'water050') return teachingRun(0.5);
  if (source === 'water090') return teachingRun(0.9);
  if (source === 'gasNull') return gasRun('null');
  return null;
};

/** The seven treatments screened against one well row and one diagnosis. */
export const screeningRows = (source = 'water050') => {
  const diagnosis = diagnosisFor(source);
  const rows = screenTreatments({ well: TEACHING_WELL_ROW, diagnosis });
  const ranked = rankTreatments(rows).map((r) => r.id);
  return rows.map((r) => {
    const gate = TREATMENT_GATES.find((g) => g.id === r.id);
    return {
      id: r.id,
      label: r.label,
      verdict: r.verdict,
      blocked: r.blocked,
      blockReason: r.blockReason,
      reasons: r.reasons,
      reasonCount: r.reasons.length,
      gate: gate ? gate.gate : 'not described',
      gateDescription: gate ? gate.gateDescription : '',
      rank: ranked.indexOf(r.id) + 1,
      readsTheDiagnosis: ['waterShutoff', 'recompletion', 'rateReduction'].includes(r.id),
      diagnosisSource: source,
      mechanismId: diagnosis && diagnosis.mechanism ? diagnosis.mechanism.id : null,
      confidence: diagnosis ? (diagnosis.confidence || 'n/a') : null,
      lateFromT: diagnosis ? num(diagnosis.lateFromT) : null,
      provenance: 'teaching',
    };
  });
};

export const screeningHeadline = (source = 'water050') => {
  const rows = screeningRows(source);
  const diagnosis = diagnosisFor(source);
  return {
    provenance: 'teaching',
    source,
    sourceLabel: (DIAGNOSIS_SOURCES.find((s) => s[0] === source) || [null, source])[1],
    treatmentCount: rows.length,
    candidates: rows.filter((r) => r.verdict === 'candidate').length,
    blocked: rows.filter((r) => r.blocked).length,
    readTheDiagnosis: rows.filter((r) => r.readsTheDiagnosis).length,
    neverReadTheDiagnosis: rows.filter((r) => !r.readsTheDiagnosis).length,
    mechanismId: diagnosis && diagnosis.mechanism ? diagnosis.mechanism.id : null,
    mechanismLabel: diagnosis && diagnosis.mechanism ? diagnosis.mechanism.label : null,
    confidence: diagnosis ? (diagnosis.confidence || 'n/a') : 'no diagnosis',
    ambiguous: diagnosis ? diagnosis.ambiguous === true : null,
    lateFromT: diagnosis ? num(diagnosis.lateFromT) : null,
    rankedOrder: rankTreatments(rows).map((r) => `${r.label} (${r.verdict})`),
    waterShutoffVerdict: rows.find((r) => r.id === 'waterShutoff').verdict,
    theWellRowNeverChanges: true,
  };
};

/**
 * RULE NINE'S COMPANION: the screening does not know which fluid it read. Hand
 * it the GAS diagnosis and the WATER shutoff comes back with a verdict whose
 * reasons quote the water cut. The well row handed in is identical.
 */
export const fluidBlindnessRows = () => DIAGNOSIS_SOURCES.map(([source, label]) => {
  const rows = screeningRows(source);
  const water = rows.find((r) => r.id === 'waterShutoff');
  return {
    source,
    sourceLabel: label,
    mechanismId: water.mechanismId,
    confidence: water.confidence,
    lateFromT: water.lateFromT,
    waterShutoffVerdict: water.verdict,
    blocked: water.blocked,
    reasonCount: water.reasonCount,
    firstReason: water.reasons[0] || null,
    blockReason: water.blockReason,
    provenance: 'teaching',
  };
});

export const WATER_CUT_SWEEP = Object.freeze([10, 25, 29, 30, 45, 60, 61, 74.5, 90]);

/** The water cut gate, which fires before the mechanism is ever read. */
export const waterGateRows = (cuts = WATER_CUT_SWEEP) => {
  const diagnosis = teachingRun(0.5);
  return cuts.map((wctPct) => {
    const rows = screenTreatments({
      well: { ...TEACHING_WELL_ROW, wctPct }, diagnosis,
    });
    const water = rows.find((r) => r.id === 'waterShutoff');
    const frac = rows.find((r) => r.id === 'hydraulicFracture');
    const lift = rows.find((r) => r.id === 'artificialLift');
    return {
      wctPct,
      waterShutoffVerdict: water.verdict,
      blocked: water.blocked,
      waterReasonCount: water.reasons.length,
      fractureReasonCount: frac.reasons.length,
      artificialLiftVerdict: lift.verdict,
      theMechanismWasNeverReadBelowThirty: wctPct < 30,
      isTheTeachingWell: wctPct === TEACHING_WELL_ROW.wctPct,
      provenance: 'derived',
    };
  });
};

export const GAS_GATE_SWEEP = Object.freeze([900, 1500, 1899, 1900, 1901, 2152, 3000, 5000]);

/** The gas gate: a factor of two on the expected ratio and nothing else. */
export const gasGateRows = (gors = GAS_GATE_SWEEP) => {
  const diagnosis = teachingRun(0.5);
  const expected = TEACHING_WELL_ROW.expectedGorScfStb;
  return gors.map((gorScfStb) => {
    const rows = screenTreatments({
      well: { ...TEACHING_WELL_ROW, gorScfStb }, diagnosis,
    });
    const gas = rows.find((r) => r.id === 'gasShutoff');
    return {
      gorScfStb,
      expectedGorScfStb: expected,
      ratioToExpected: gorScfStb / expected,
      verdict: gas.verdict,
      reasonCount: gas.reasons.length,
      lastReason: gas.reasons[gas.reasons.length - 1] || null,
      isTheTeachingWell: gorScfStb === TEACHING_WELL_ROW.gorScfStb,
      provenance: 'derived',
    };
  });
};

export const FRACTURE_TERNARY_SWEEP = Object.freeze([-4, -1, 0, 0.5, 3, 9, 20]);

/**
 * A TEST THAT DECIDES NOTHING, and it is one word wide. The fracture verdict
 * is `Number.isFinite(skin) && skin > 0 ? 'consider' : 'consider'`. Both arms
 * return the same string, so nothing the branch reads can change what it says.
 * The sweep is the same well row at every skin and the verdict never moves,
 * while the three verdicts beside it that ARE gated on skin all move.
 */
export const fractureTernaryRows = (skins = FRACTURE_TERNARY_SWEEP) => {
  const diagnosis = teachingRun(0.5);
  const withSkin = skins.map((skin) => ({ skin, label: `${skin}` }));
  const rows = [...withSkin, { skin: undefined, label: 'not entered' }];
  return rows.map((c) => {
    const screen = screenTreatments({
      well: { ...TEACHING_WELL_ROW, skin: c.skin }, diagnosis,
    });
    const find = (id) => screen.find((s) => s.id === id);
    return {
      skin: Number.isFinite(c.skin) ? c.skin : null,
      skinWasEntered: Number.isFinite(c.skin),
      fractureVerdict: find('hydraulicFracture').verdict,
      fractureReasonCount: find('hydraulicFracture').reasons.length,
      matrixAcidVerdict: find('matrixAcid').verdict,
      recompletionVerdict: find('recompletion').verdict,
      provenance: 'derived',
    };
  });
};

export const fractureTernaryHeadline = memoize(() => {
  const rows = fractureTernaryRows();
  return {
    provenance: 'derived',
    settingsSwept: rows.length,
    distinctFractureVerdicts: new Set(rows.map((r) => r.fractureVerdict)).size,
    distinctMatrixAcidVerdicts: new Set(rows.map((r) => r.matrixAcidVerdict)).size,
    theFractureVerdictNeverMoves: new Set(rows.map((r) => r.fractureVerdict)).size === 1,
    theOnlyFractureVerdict: rows[0].fractureVerdict,
    theModuleWroteThisBranchCorrectlyThreeOtherTimes: true,
  };
});

// ---------------------------------------------------------------------------
// SECTION E: THE DEMONSTRATIONS. Three constructed series and one gas history,
// each built to land on one guard.
// ---------------------------------------------------------------------------

export const TEACHING_GAS_SPEC = Object.freeze({
  sampleCount: 26,
  firstDay: 60,
  lastDay: 3600,
  baseScfStb: 950,
  coefficient: 0.0431,
  exponent: 1.25,
});

/** The teaching gas history, in the two spellings of "no value". */
export const gasSeries = memoize((spelling = 'null') => {
  const s = TEACHING_GAS_SPEC;
  return geometricTimes(s.firstDay, s.lastDay, s.sampleCount).map((t) => ({
    t,
    ratio: s.baseScfStb + s.coefficient * (t ** s.exponent),
    derivative: spelling === 'null' ? null : undefined,
  }));
});

const gasRun = memoize((spelling) => chanDiagnosis({
  series: gasSeries(spelling), lateFraction: 0.5,
}));

export const gasSamples = () => gasSeries('null').map((p, i) => ({
  index: i + 1,
  tDays: p.t,
  gorScfStb: p.ratio,
  derivativeColumn: 'never computed',
  provenance: 'teaching',
}));

export const gasHeadline = memoize(() => {
  const s = gasSeries('null');
  return {
    provenance: 'teaching',
    sampleCount: s.length,
    firstDay: s[0].t,
    lastDay: s[s.length - 1].t,
    firstGorScfStb: s[0].ratio,
    lastGorScfStb: s[s.length - 1].ratio,
    foldChangeAcrossTheWindow: s[s.length - 1].ratio / s[0].ratio,
    baseScfStb: TEACHING_GAS_SPEC.baseScfStb,
    coefficient: TEACHING_GAS_SPEC.coefficient,
    exponent: TEACHING_GAS_SPEC.exponent,
    minWor: CHAN_DEFAULTS.minWor,
    theGateIsClearedByAFactorOf: s[s.length - 1].ratio / CHAN_DEFAULTS.minWor,
    theThresholdIsNamedForAWaterOilRatio: true,
  };
});

/**
 * RULE FIVE. The same missing data in two spellings, two opposite answers, and
 * the reassuring one is the spelling every JSON export and every SQL null
 * produces. The label carries the spelling, so a panel never has to print a
 * raw value that is not there.
 */
export const SPELLINGS = Object.freeze([
  ['null', 'the null spelling'],
  ['undef', 'the undefined spelling'],
]);

const spellingRow = (which, label, d, seriesLength) => ({
  spelling: which,
  spellingLabel: label,
  ok: !!d.ok,
  mechanismId: d.mechanism ? d.mechanism.id : null,
  mechanismLabel: d.mechanism ? d.mechanism.label : null,
  treatable: d.mechanism ? !!d.mechanism.treatable : null,
  confidence: d.confidence || 'n/a',
  worSlope: num(d.worSlope),
  worR2Fraction: num(d.worR2),
  derivativeSlope: num(d.derivativeSlope),
  derivativeR2Fraction: num(d.derivativeR2),
  spanDecades: num(d.spanDecades),
  lateFromT: num(d.lateFromT),
  sampleCount: seriesLength,
  notes: d.notes || [],
  error: d.error || null,
  provenance: 'teaching',
});

export const gasSpellingRows = () => SPELLINGS.map(([which, label]) => spellingRow(
  which, label, gasRun(which), gasSeries(which).length,
));

const waterSpellingRun = memoize((spelling) => chanDiagnosis({
  series: teachingSeries().map((p) => ({
    t: p.t, ratio: p.ratio, derivative: spelling === 'null' ? null : undefined,
  })),
  lateFraction: 0.5,
}));

export const waterSpellingRows = () => SPELLINGS.map(([which, label]) => spellingRow(
  which, label, waterSpellingRun(which), teachingSeries().length,
));

/** What JavaScript makes of each spelling of "no value". DERIVED. */
export const coercionRows = () => [
  ['null', null],
  ['an empty string', ''],
  ['an empty array', []],
  ['false', false],
  ['the string zero', '0'],
  ['no value at all', undefined],
  ['the string n slash a', 'n/a'],
].map(([label, raw]) => {
  const coerced = Number(raw);
  return {
    label,
    coercedIsFinite: Number.isFinite(coerced),
    coercedToZero: Number.isFinite(coerced) && coerced === 0,
    passesTheFlatTest: Number.isFinite(coerced) && Math.abs(coerced) < 1e-12,
    provenance: 'derived',
  };
});

/**
 * RULE SIX. The flat branch's sentence beside the slope the same object
 * carries. They only mean anything together, so they are one row.
 */
export const flatBranchRows = () => {
  const cases = [
    { label: 'the teaching gas history', row: gasSpellingRows()[0] },
    { label: 'the teaching water history', row: waterSpellingRows()[0] },
    {
      label: 'the published flat history',
      row: (() => {
        const d = publishedRun('flat', 0.5);
        return spellingRow('published', 'the published flat history', d, golden.histories.flat.series.length);
      })(),
    },
  ];
  return cases.map((c) => ({
    label: c.label,
    sentence: c.row.notes[0] || null,
    worSlope: c.row.worSlope,
    worR2Fraction: c.row.worR2Fraction,
    mechanismId: c.row.mechanismId,
    confidence: c.row.confidence,
    theBranchNeverLookedAtTheRatio: true,
    theSentenceIsTrueHere: c.row.worSlope !== null && Math.abs(c.row.worSlope) < 1e-9,
    provenance: c.label === 'the published flat history' ? 'derived' : 'teaching',
  }));
};

export const ZERO_VARIANCE_COUNTS = Object.freeze([3, 4, 5, 8, 10, 16, 20, 32]);
export const ZERO_VARIANCE_VALUES = Object.freeze([5, 0.9, 2, 0.1]);

/**
 * RULE SEVEN, SWEPT ON BOTH AXES. The guard is `syy > 0 ? ordinary : 1`, so it
 * fires exactly when the accumulated variance of ln y over identical y is
 * EXACTLY zero, and whether it is depends on the sample count and the value
 * TOGETHER. Every cell below is an engine call: the r-squared is whatever
 * logLogSlope returned, and the guard is taken to have fired when that
 * r-squared is exactly one. That reading is safe rather than a guess: over
 * identical y the covariance is zero, so the ORDINARY branch can only return
 * zero or a rounding of it, and a one can only have come out of the guard.
 */
export const zeroVarianceSweepRows = (
  counts = ZERO_VARIANCE_COUNTS, values = ZERO_VARIANCE_VALUES,
) => counts.map((n) => ({
  n,
  cells: values.map((y) => {
    const fit = logLogSlope({
      points: Array.from({ length: n }, (_, i) => ({ x: 2 ** i, y })),
    });
    return {
      y,
      ok: !!fit.ok,
      r2Fraction: num(fit.r2),
      guardFired: num(fit.r2) === 1,
      slope: num(fit.slope),
    };
  }),
  provenance: 'derived',
}));

export const zeroVarianceHeadline = memoize(() => {
  const rows = zeroVarianceSweepRows();
  const cells = rows.flatMap((r) => r.cells.map((c) => ({ n: r.n, ...c })));
  const fired = cells.filter((c) => c.guardFired);
  const notFired = cells.filter((c) => !c.guardFired);
  return {
    provenance: 'derived',
    cellsSwept: cells.length,
    guardFired: fired.length,
    guardDidNotFire: notFired.length,
    firedAtEverySmallCount: rows[0].cells.every((c) => c.guardFired)
      && rows[1].cells.every((c) => c.guardFired),
    theSplitStartsAtCount: (rows.find((r) => r.cells.some((c) => !c.guardFired)) || {}).n || null,
    lowestR2WhereItDidNotFire: notFired.length
      ? Math.min(...notFired.map((c) => c.r2Fraction)) : null,
    minR2: CHAN_DEFAULTS.minR2,
    thereIsNoRuleACallerCouldHold: true,
  };
});

export const CONSTANT_DERIVATIVE_SPEC = Object.freeze({
  sampleCount: 20,
  firstDay: 20,
  lastDay: 2000,
  offset: 2,
  coefficient: 0.9,
});

/**
 * THE REAL SIGNATURE THAT LANDS ON THE GUARD. A ratio rising exactly
 * logarithmically has a derivative that is exactly constant, which is a real
 * shape, and the guard does NOT fire on it: the variance accumulates to about
 * 1e-31 rather than to zero, the fit quality comes back near zero, and clean
 * data with no scatter whatever is refused as noise.
 */
export const constantDerivativeDemo = memoize(() => {
  const s = CONSTANT_DERIVATIVE_SPEC;
  const series = geometricTimes(s.firstDay, s.lastDay, s.sampleCount).map((t) => ({
    t,
    ratio: s.offset + s.coefficient * Math.log(t),
    derivative: s.coefficient,
  }));
  const d = chanDiagnosis({ series, lateFraction: 0.5 });
  const derFit = logLogSlope({ points: series, xKey: 't', yKey: 'derivative' });
  const ratioFit = logLogSlope({ points: series, xKey: 't', yKey: 'ratio' });
  return {
    provenance: 'teaching',
    sampleCount: series.length,
    firstDay: series[0].t,
    lastDay: series[series.length - 1].t,
    firstRatio: series[0].ratio,
    lastRatio: series[series.length - 1].ratio,
    derivativeAtEverySample: s.coefficient,
    ok: !!d.ok,
    mechanismId: d.mechanism ? d.mechanism.id : null,
    mechanismLabel: d.mechanism ? d.mechanism.label : null,
    confidence: d.confidence || 'n/a',
    lateFromT: num(d.lateFromT),
    worSlope: num(d.worSlope),
    worR2Fraction: num(d.worR2),
    derivativeSlope: num(d.derivativeSlope),
    derivativeR2Fraction: num(d.derivativeR2),
    spanDecades: num(d.spanDecades),
    notes: d.notes || [],
    standaloneDerivativeSlope: num(derFit.slope),
    standaloneDerivativeR2Fraction: num(derFit.r2),
    standaloneRatioSlope: num(ratioFit.slope),
    standaloneRatioR2Fraction: num(ratioFit.r2),
    minR2: CHAN_DEFAULTS.minR2,
    theGuardDidNotFire: num(derFit.r2) !== 1,
    cleanDataRefusedAsNoise: num(derFit.r2) !== null && derFit.r2 < CHAN_DEFAULTS.minR2,
    rows: series.map((p, i) => ({
      index: i + 1, tDays: p.t, ratio: p.ratio, derivative: p.derivative,
    })),
  };
});

export const LOW_LAST_SAMPLE_SPEC = Object.freeze({
  sampleCount: 24,
  firstDay: 30,
  lastDay: 2000,
  coefficient: 0.004,
  exponent: 1.15,
  postShutInTest: 0.06,
});

/**
 * THE RATIO GATE READS ONE SAMPLE. `minWor` is compared against the LAST
 * sample alone, so one low final reading, a test after a shut-in, a slug or a
 * bad meter, short-circuits the entire diagnosis with no slope computed and no
 * confidence returned.
 */
export const lowLastSampleDemo = memoize(() => {
  const s = LOW_LAST_SAMPLE_SPEC;
  const full = geometricTimes(s.firstDay, s.lastDay, s.sampleCount).map((t) => {
    const ratio = s.coefficient * (t ** s.exponent);
    return { t, ratio, derivative: s.exponent * ratio };
  });
  const spoiled = full.map((p, i) => (
    i === full.length - 1 ? { ...p, ratio: s.postShutInTest } : p));
  const read = (series, label) => {
    const d = chanDiagnosis({ series, lateFraction: 0.5 });
    return {
      label,
      ok: !!d.ok,
      mechanismId: d.mechanism ? d.mechanism.id : null,
      mechanismLabel: d.mechanism ? d.mechanism.label : null,
      confidence: d.confidence || 'n/a',
      ambiguous: d.ambiguous === true,
      lateFromT: num(d.lateFromT),
      worSlope: num(d.worSlope),
      worR2Fraction: num(d.worR2),
      derivativeSlope: num(d.derivativeSlope),
      derivativeR2Fraction: num(d.derivativeR2),
      spanDecades: num(d.spanDecades),
      lastRatio: series[series.length - 1].ratio,
      notes: d.notes || [],
      marginToThreshold: num(d.derivativeSlope) === null
        ? null : d.derivativeSlope - CHAN_DEFAULTS.channellingSlope,
    };
  };
  return {
    provenance: 'teaching',
    sampleCount: full.length,
    firstDay: full[0].t,
    lastDay: full[full.length - 1].t,
    secondToLastRatio: full[full.length - 2].ratio,
    postShutInTest: s.postShutInTest,
    minWor: CHAN_DEFAULTS.minWor,
    spoiled: read(spoiled, 'with the post shut-in test as the last sample'),
    restored: read(full, 'with that one sample restored'),
    oneSampleDecidesTheWholeReading: true,
  };
});

/** The other door in: a history of fewer than six samples is refused outright. */
export const shortHistoryDemo = memoize(() => {
  const series = teachingSeries().slice(0, MINIMUM_HISTORY_SAMPLES - 1);
  const d = chanDiagnosis({ series, lateFraction: 0.5 });
  return {
    provenance: 'teaching',
    sampleCount: series.length,
    minimumSamples: MINIMUM_HISTORY_SAMPLES,
    ok: !!d.ok,
    refused: !d.ok,
    mechanismId: d.mechanism ? d.mechanism.id : null,
    mechanismLabel: d.mechanism ? d.mechanism.label : null,
    confidence: d.confidence || 'n/a',
    lateFromT: num(d.lateFromT),
    derivativeSlope: num(d.derivativeSlope),
    error: d.error || null,
    itIsTheOnePlaceTheModuleCountsBeforeItReads: true,
  };
});

/** Every threshold the reading turns on, with the band the ambiguous one makes. */
export const thresholdRows = () => [
  { key: 'coningSlope', value: CHAN_DEFAULTS.coningSlope, note: 'At or below this derivative slope the derivative is falling, which is the coning signature. The sign carries the distinction, so this threshold barely matters.' },
  { key: 'channellingSlope', value: CHAN_DEFAULTS.channellingSlope, note: 'At or above this the climb is distinctly faster than proportional, which is the channelling signature. This is the soft end of the reading and it decides the whole spend.' },
  { key: 'ambiguousBand', value: CHAN_DEFAULTS.ambiguousBand, note: 'Within this much of the channelling boundary the reading says so instead of picking a side.' },
  { key: 'minR2', value: CHAN_DEFAULTS.minR2, note: 'Below this fit quality, as a fraction, the slope is not read at all.' },
  { key: 'minSpanDecades', value: CHAN_DEFAULTS.minSpanDecades, note: 'A reading needs at least this much log time to sit on.' },
  { key: 'minWor', value: CHAN_DEFAULTS.minWor, note: 'Below this ratio there is no water problem to diagnose, and it is compared against the last sample alone.' },
].map((r) => ({ ...r, provenance: 'derived' }));

export const ambiguousBandBounds = () => ({
  provenance: 'derived',
  lower: CHAN_DEFAULTS.channellingSlope - CHAN_DEFAULTS.ambiguousBand,
  upper: CHAN_DEFAULTS.channellingSlope + CHAN_DEFAULTS.ambiguousBand,
  width: 2 * CHAN_DEFAULTS.ambiguousBand,
  channellingThreshold: CHAN_DEFAULTS.channellingSlope,
  coningThreshold: CHAN_DEFAULTS.coningSlope,
});

/** What this module does not do, stated rather than implied. */
export const limits = () => [
  'The Bourdet derivative is NOT computed here. It is passed in, because a second implementation of it would be a second thing to be wrong.',
  'The published Chan type curves are not reproduced. This reads the same two things Chan reads, the trend of the ratio and the sign and slope of its derivative, and says which picture the data is closest to.',
  'Nothing here is a substitute for the plot. It is a screening that says which question to ask next.',
  'The classifier is asserted against no golden at all: the published cases carry a late derivative slope and no expected mechanism, no expected confidence, no expected verdict and no expected block reason.',
  'The screening does not know which fluid the diagnosis read, so a gas verdict can block a water treatment.',
  'The drainage radius is a guess and the group takes its logarithm, so the geometry forgives it. The skin is a measurement and the group adds it undivided.',
  'There is no economics here. A multiplier on the productivity index is not a barrel and not a dollar.',
];

/** What the oracle covers, and where it stops. */
export const oracleCoverage = () => ({
  provenance: 'derived',
  publishedHistories: PUBLISHED_HISTORY_NAMES.length,
  publishedSkinPairs: golden.skin.length,
  publishedPowerLawPoints: golden.power_law.points.length,
  publishedGeometries: 1,
  functionsWithAGolden: ['logLogSlope', 'pssDenominator', 'minimumSkin', 'skinPiMultiplier'],
  functionsWithNoGoldenAtAll: ['chanDiagnosis', 'screenTreatments', 'rankTreatments', 'skinFromPiRatio'],
  theOnlyPartThatReturnsAVerdictIsThePartWithNoGolden: true,
  theTwoIndependentRoutes: [
    'the log-log slope by Theil-Sen, the median of every pairwise slope, sharing no mean, no square and no covariance with the engine least squares',
    'the skin uplift by a full radial Darcy rate in SI, permeability in square metres and pressures in pascals, divided as two real flow rates',
  ],
});

// ---------------------------------------------------------------------------
// PANEL FACADES. Each panel reads exactly one of these, so what a panel can
// reach is a list rather than the whole module.
// ---------------------------------------------------------------------------

/** THE FIT AND THE GEOMETRY. The Associate panel. */
export const diagnosticExplorer = Object.freeze({
  samples: teachingSamples,
  headline: teachingHeadline,
  fullFit: teachingFullFit,
  fitRows: teachingFitRows,
  powerLaw: powerLawFit,
  powerLawRows,
  refusals: logLogRefusals,
  silentDrop: silentDropRow,
  publishedHistories: publishedHistoryRows,
  publishedVerdicts: publishedVerdictRows,
  publishedFloor,
  drainage: drainageSweepRows,
  drainageHeadline: drainageSweepHeadline,
  denominator: denominatorSweepRows,
  geometryRefusals,
  teachingGeometry,
  thresholds: thresholdRows,
  oracle: oracleCoverage,
});

/** THE WINDOWED READING. The Professional panel. */
export const channelExplorer = Object.freeze({
  headline: teachingHeadline,
  diagnosis: teachingDiagnosis,
  twoWindows: teachingTwoWindows,
  samples: teachingSamples,
  bands: ambiguousBandBounds,
  thresholds: thresholdRows,
  windowSweep: windowSweepRows,
  publishedSkin: publishedSkinRows,
  identity: skinIdentity,
  oneUnit: oneUnitRows,
  acid: teachingAcidJob,
  teachingGeometry,
  screening: screeningRows,
  screeningHeadline,
  gates: () => TREATMENT_GATES,
  waterGate: waterGateRows,
  gasGate: gasGateRows,
  limits,
});

/** WHAT THE FIT LEFT OUT. The Expert panel. */
export const candidateExplorer = Object.freeze({
  discarded: discardedSamples,
  discardedFit,
  samples: teachingSamples,
  spanLoss: spanLossRows,
  fallingOnly: fallingOnlyDemo,
  windowSweep: windowSweepRows,
  flip: windowFlipHeadline,
  clamp: windowClampRows,
  gasSamples,
  gasHeadline,
  gasSpellings: gasSpellingRows,
  waterSpellings: waterSpellingRows,
  coercion: coercionRows,
  flatBranch: flatBranchRows,
  fluidBlindness: fluidBlindnessRows,
  zeroVariance: zeroVarianceSweepRows,
  zeroVarianceHeadline,
  constantDerivative: constantDerivativeDemo,
  skinGuard: teachingSkinGuardRows,
  skinGuardHeadline,
  skinRefusals: skinRefusalRows,
  claimAudit: claimAuditRows,
  impliedSkin: impliedSkinRows,
  roundTrip: roundTripRows,
  fractureTernary: fractureTernaryRows,
  fractureTernaryHeadline,
  lowLastSample: lowLastSampleDemo,
  shortHistory: shortHistoryDemo,
  thresholds: thresholdRows,
});

// ---------------------------------------------------------------------------
// GUARD SUPPORT. Everything this lab can put on a screen, flattened, so the
// capstone guard can check every one of them against the graded field list
// without knowing what any of them means.
// ---------------------------------------------------------------------------

const flattenInto = (label, value, out, depth = 0) => {
  if (value === null || value === undefined || depth > 6) return;
  if (typeof value === 'number') {
    if (Number.isFinite(value)) out.push({ label, value });
    return;
  }
  if (typeof value === 'boolean' || typeof value === 'string') return;
  if (Array.isArray(value)) {
    value.forEach((v, i) => flattenInto(`${label}[${i}]`, v, out, depth + 1));
    return;
  }
  if (typeof value === 'object') {
    Object.keys(value).forEach((k) => flattenInto(`${label}.${k}`, value[k], out, depth + 1));
  }
};

/** Every number this lab exposes, with a label saying where it came from. */
export const teachingQuantities = () => {
  const out = [];
  const add = (label, fn) => {
    try {
      flattenInto(label, fn(), out);
    } catch {
      // an accessor that refuses is still an accessor that leaks nothing
    }
  };
  add('powerLawFit', powerLawFit);
  add('powerLawRows', powerLawRows);
  add('logLogRefusals', logLogRefusals);
  add('silentDropRow', silentDropRow);
  add('publishedFloor', publishedFloor);
  add('drainageSweepRows', drainageSweepRows);
  add('drainageSweepHeadline', drainageSweepHeadline);
  add('denominatorSweepRows', denominatorSweepRows);
  add('geometryRefusals', geometryRefusals);
  add('publishedSkinRows', publishedSkinRows);
  add('skinIdentity', skinIdentity);
  add('oneUnitRows', oneUnitRows);
  add('impliedSkinRows', impliedSkinRows);
  add('roundTripRows', roundTripRows);
  add('publishedHistoryRows', () => publishedHistoryRows(0.5));
  add('publishedVerdictRows', () => publishedVerdictRows(0.5));
  add('teachingSamples', teachingSamples);
  add('teachingHeadline', teachingHeadline);
  add('teachingFullFit', teachingFullFit);
  add('teachingFitRows', teachingFitRows);
  WINDOW_SWEEP.forEach((f) => {
    add(`teachingDiagnosis(${f})`, () => teachingDiagnosis(f));
    add(`teachingTwoWindows(${f})`, () => teachingTwoWindows(f));
  });
  add('windowSweepRows', windowSweepRows);
  add('windowFlipHeadline', windowFlipHeadline);
  add('windowClampRows', windowClampRows);
  add('discardedSamples', discardedSamples);
  add('discardedFit', () => discardedFit(0.5));
  add('spanLossRows', spanLossRows);
  add('fallingOnlyDemo', fallingOnlyDemo);
  add('teachingGeometry', teachingGeometry);
  add('teachingAcidJob', teachingAcidJob);
  add('teachingSkinGuardRows', teachingSkinGuardRows);
  add('skinGuardHeadline', skinGuardHeadline);
  add('skinRefusalRows', skinRefusalRows);
  add('claimAuditRows', claimAuditRows);
  DIAGNOSIS_SOURCES.forEach(([s]) => {
    add(`screeningRows(${s})`, () => screeningRows(s));
    add(`screeningHeadline(${s})`, () => screeningHeadline(s));
  });
  add('fluidBlindnessRows', fluidBlindnessRows);
  add('waterGateRows', waterGateRows);
  add('gasGateRows', gasGateRows);
  add('fractureTernaryRows', fractureTernaryRows);
  add('fractureTernaryHeadline', fractureTernaryHeadline);
  add('gasSamples', gasSamples);
  add('gasHeadline', gasHeadline);
  add('gasSpellingRows', gasSpellingRows);
  add('waterSpellingRows', waterSpellingRows);
  add('coercionRows', coercionRows);
  add('flatBranchRows', flatBranchRows);
  add('zeroVarianceSweepRows', zeroVarianceSweepRows);
  add('zeroVarianceHeadline', zeroVarianceHeadline);
  add('constantDerivativeDemo', constantDerivativeDemo);
  add('lowLastSampleDemo', lowLastSampleDemo);
  add('shortHistoryDemo', shortHistoryDemo);
  add('thresholdRows', thresholdRows);
  add('ambiguousBandBounds', ambiguousBandBounds);
  add('oracleCoverage', oracleCoverage);
  return out;
};

/** The same set as bare numbers, which is what the leak guard measures. */
export const teachingNumbers = () => teachingQuantities().map((q) => q.value);
