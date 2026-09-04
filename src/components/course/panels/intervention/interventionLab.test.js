// What the PD8 teaching lab returns, pinned.
//
// Three kinds of assertion live here and they are not the same kind of claim.
//
//   AGAINST THE GOLDEN. `intervention_cases.json` carries a power law with a
//   Theil-Sen slope through it, four labelled histories with a late derivative
//   slope each, one geometry floor and five before-and-after skin pairs. Those
//   were committed by an oracle that shares no numerical machinery with the
//   engine: the slope by the median of every pairwise slope, the skin uplift by
//   a full radial Darcy rate in SI divided as two real flow rates. Where this
//   file asserts against one of those it is asserting agreement between two
//   independent routes.
//
//   AGAINST THE ARGUMENTS. Several assertions here pin WHAT WAS ASKED rather
//   than what came back: that the derivative fit was handed fewer samples than
//   the ratio fit, that the window sweep moved nothing but the window, that the
//   screening was handed the same well row every time. An engine change cannot
//   quietly invert a lesson and still pass those.
//
//   AGAINST THE DIGEST. The teaching well, the teaching gas history and the
//   three demonstration series are this wave's own, checked by no oracle
//   anywhere, and the numbers below are the ones the shipped teaching digest
//   prints. They are pinned so a lesson and a panel cannot drift apart.
//
// THE ONE THING THIS FILE MUST NEVER DO is assert a graded capstone answer.
// That boundary is guarded arithmetically by panelCapstoneGuard.test.js.

import { describe, it, expect } from 'vitest';
import * as L from './interventionLab.js';

describe('the measurement, against the published power law', () => {
  it('reproduces the Theil-Sen slope and intercept exactly, which is the gate', () => {
    const p = L.powerLawFit();
    expect(p.ok).toBe(true);
    expect(p.pointCount).toBe(11);
    expect(p.engineSlope).toBe(p.publishedSlope);
    expect(p.engineIntercept).toBe(p.publishedIntercept);
    expect(p.slopeDifference).toBe(0);
    expect(p.interceptDifference).toBe(0);
    // exact on a power law, to the last bit
    expect(p.engineR2Fraction).toBe(1);
    expect(p.r2ShortfallFromPerfect).toBe(0);
    expect(p.spanDecades).toBeCloseTo(2, 12);
  });

  it('and the fitted line is drawn from the returned slope and intercept and from nothing else', () => {
    const p = L.powerLawFit();
    const rows = L.powerLawRows();
    expect(rows).toHaveLength(11);
    rows.forEach((r) => {
      expect(r.fittedY).toBeCloseTo(Math.exp(p.engineIntercept + p.engineSlope * Math.log(r.x)), 9);
      // on a clean power law the fitted line IS the data
      expect(r.fittedY / r.y).toBeCloseTo(1, 9);
    });
  });

  it('refuses with a reason rather than returning whatever the regression produced', () => {
    const rows = L.logLogRefusals();
    expect(rows).toHaveLength(4);
    rows.forEach((r) => {
      expect(r.refused, r.label).toBe(true);
      expect(typeof r.error, r.label).toBe('string');
      expect(r.error.length, r.label).toBeGreaterThan(20);
    });
    expect(rows[0].n).toBe(2);
    expect(rows[2].error).toMatch(/same time/);
  });

  it('and the FILTER IS SILENT: the count it returns is the count after the drop', () => {
    const d = L.silentDropRow();
    expect(d.ok).toBe(true);
    expect(d.handedIn).toBe(6);
    expect(d.nReturned).toBe(4);
    expect(d.dropped).toBe(2);
    expect(d.theFitSaidNothingAboutTheDrop).toBe(true);
    // and the drop shortens the window the fit reports it sat on
    expect(d.reportedSpanDecades).toBeLessThan(d.handedSpanDecades);
    expect(d.spanUnderstatedByDecades).toBeGreaterThan(0.6);
    expect(d.reportedSpanDecades).toBeCloseTo(0.903089987, 9);
    expect(d.spanUnderstatedByDecades).toBeCloseTo(0.602059991, 9);
  });
});

describe('the geometry group, against the published geometry', () => {
  it('reproduces the published floor exactly', () => {
    const f = L.publishedFloor();
    expect(f.reFt).toBe(2000);
    expect(f.rwFt).toBe(0.35);
    expect(f.engineMinimumSkin).toBe(f.publishedMinimumSkin);
    expect(f.difference).toBe(0);
    expect(f.lnReOverRw).toBeCloseTo(8.650724584041, 10);
    expect(f.denominatorAtZeroSkin).toBeCloseTo(7.900724584041, 10);
    expect(f.pssConstant).toBe(0.75);
  });

  it('a drainage radius is a guess and the logarithm forgives it; a skin is not and it does not', () => {
    const h = L.drainageSweepHeadline();
    expect(h.foldChangeInDrainageRadius).toBe(20);
    // a twentyfold change in the guess moves the group by three, which three
    // units of skin more than cover
    expect(h.denominatorMovesBy).toBeCloseTo(2.995732274, 9);
    expect(h.oneUnitOfSkinMovesItBy).toBe(1);
    const rows = L.drainageSweepRows();
    expect(rows.filter((r) => r.published)).toHaveLength(1);
    rows.forEach((r) => {
      // the floor is the negative of the zero-skin denominator, always
      expect(r.minimumSkin).toBeCloseTo(-r.denominatorAtZeroSkin, 12);
    });
  });

  it('the denominator sweep carries a flow efficiency that is one at zero skin', () => {
    const rows = L.denominatorSweepRows();
    const zero = rows.find((r) => r.skin === 0);
    expect(zero.flowEfficiency).toBe(1);
    const damaged = rows.find((r) => r.skin === 20);
    expect(damaged.flowEfficiency).toBeLessThan(0.3);
    const stimulated = rows.find((r) => r.skin === -7);
    expect(stimulated.flowEfficiency).toBeGreaterThan(8);
    // monotone: more skin is always a larger denominator
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].denominator).toBeGreaterThan(rows[i - 1].denominator);
    }
  });

  it('and refuses as a BARE not-a-number, which is a different contract from the multiplier', () => {
    const rows = L.geometryRefusals();
    expect(rows.length).toBeGreaterThanOrEqual(5);
    rows.forEach((r) => {
      expect(r.refused, r.label).toBe(true);
      expect(r.isFinite, r.label).toBe(false);
      expect(r.contract).toBe('a bare not-a-number');
    });
    // the same bad geometry through the multiplier comes back with a REASON
    const withReason = L.skinRefusalRows().find((r) => /radius/.test(r.label));
    expect(withReason.refused).toBe(true);
    expect(withReason.contract).toBe('an object with ok false and a reason');
    expect(withReason.error).toMatch(/drainage radius has to be the larger one/);
  });
});

describe('what removing skin is worth, against the five published pairs', () => {
  it('agrees with the oracle radial Darcy route on every one of them', () => {
    const rows = L.publishedSkinRows();
    expect(rows).toHaveLength(5);
    rows.forEach((r) => {
      expect(r.ok, `case ${r.index}`).toBe(true);
      expect(r.engineMultiplier, `case ${r.index}`).toBeCloseTo(r.publishedMultiplier, 12);
      expect(Math.abs(r.difference), `case ${r.index}`).toBeLessThan(1e-15);
      // the floor is computed on every call and returned inside the result
      expect(r.minimumSkinInsideTheResult).toBeCloseTo(-7.900724584041, 10);
    });
  });

  it('is exactly one when the skin does not change, to the last bit', () => {
    const i = L.skinIdentity();
    expect(i.ok).toBe(true);
    expect(i.multiplier).toBe(1);
    expect(i.departureFromOne).toBe(0);
  });

  it('and one unit of skin is worth several times more on a damaged well than on a clean one', () => {
    const rows = L.oneUnitRows();
    rows.forEach((r) => {
      expect(r.ok).toBe(true);
      expect(r.skinAfter).toBe(r.skinBefore - 1);
    });
    const worst = rows.find((r) => r.skinBefore === 20);
    const best = rows.find((r) => r.skinBefore === 1);
    expect(worst.upliftPct).toBeCloseTo(3.717372, 6);
    expect(best.upliftPct).toBeCloseTo(12.657067, 6);
    expect(best.upliftPct / worst.upliftPct).toBeGreaterThan(3);
  });

  it('the inverse round trips, which is the only check there is on it', () => {
    const rows = L.roundTripRows();
    expect(rows).toHaveLength(3);
    rows.forEach((r) => {
      expect(r.invertedSkin).toBeCloseTo(r.statedSkinAfter, 12);
    });
  });

  it('and the inverse has NO plausibility check, so it returns an impossible skin without comment', () => {
    const rows = L.impliedSkinRows();
    const overreach = rows.filter((r) => r.pastTheFractureLimitTheModuleAdvertises);
    expect(overreach.length).toBeGreaterThan(3);
    overreach.forEach((r) => {
      expect(r.isFinite, `${r.claimedUplift}`).toBe(true);
      expect(r.flaggedByTheEngine, `${r.claimedUplift}`).toBe(false);
      expect(r.distanceAboveTheFloor, `${r.claimedUplift}`).toBeGreaterThan(0);
    });
    // and it is monotone: a bigger claim implies a deeper skin
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].impliedSkin).toBeLessThan(rows[i - 1].impliedSkin);
    }
  });
});

describe('the four published histories, and the four assertions nobody wrote', () => {
  it('reads the same late window the oracle reads, at the engine own default', () => {
    const rows = L.publishedHistoryRows(0.5);
    expect(rows).toHaveLength(4);
    rows.forEach((r) => {
      expect(r.sampleCount).toBe(40);
      expect(r.lateSamples).toBe(20);
      expect(r.lateFromT).toBeCloseTo(186.345364, 6);
    });
  });

  it('and the engine least squares matches the published Theil-Sen on every power-law shape', () => {
    const ch = L.publishedHistoryRow('channelling');
    const di = L.publishedHistoryRow('displacement');
    expect(ch.derivativeSlope).toBeCloseTo(ch.publishedLateDerivativeSlope, 12);
    expect(di.derivativeSlope).toBeCloseTo(di.publishedLateDerivativeSlope, 12);
    // the coning history is the one place the two routes visibly separate,
    // on data with no noise in it at all, because the shape is not a power law
    const co = L.publishedHistoryRow('coning');
    expect(Math.abs(co.engineLeastSquaresLessPublishedTheilSen)).toBeGreaterThan(1e-3);
    expect(Math.abs(co.engineLeastSquaresLessPublishedTheilSen)).toBeLessThan(2e-2);
  });

  it('THE FOUR VERDICTS THE GOLDEN NEVER ASSERTS', () => {
    const by = Object.fromEntries(L.publishedHistoryRows().map((r) => [r.name, r]));
    expect(by.channelling.mechanismId).toBe('channelling');
    expect(by.channelling.confidence).toBe('high');
    expect(by.coning.mechanismId).toBe('coning');
    expect(by.coning.confidence).toBe('high');
    expect(by.displacement.mechanismId).toBe('displacement');
    expect(by.displacement.confidence).toBe('high');
    expect(by.flat.mechanismId).toBe('displacement');
    expect(by.flat.confidence).toBe('n/a');
    // and the displacement history, at a slope of exactly one, is NOT flagged
    // close to the boundary, on the case the oracle own docstring calls the
    // one that genuinely needs the plot and a person
    expect(by.displacement.derivativeSlope).toBeCloseTo(1, 12);
    expect(by.displacement.ambiguous).toBe(false);
  });

  it('and the water shutoff verdict follows the mechanism, which is the whole module', () => {
    const by = Object.fromEntries(L.publishedVerdictRows().map((r) => [r.name, r]));
    expect(by.channelling.waterShutoffVerdict).toBe('candidate');
    expect(by.channelling.waterShutoffBlocked).toBe(false);
    expect(by.coning.waterShutoffBlocked).toBe(true);
    expect(by.coning.rateReductionVerdict).toBe('candidate');
    expect(by.displacement.waterShutoffBlocked).toBe(true);
    expect(by.flat.waterShutoffBlocked).toBe(true);
    // only the coning case makes less drawdown the answer
    expect(by.channelling.rateReductionVerdict).toBe('no');
    expect(by.displacement.rateReductionVerdict).toBe('no');
    Object.values(by).forEach((r) => expect(r.theGoldenAssertsNoneOfThis).toBe(true));
  });

  it('and the oracle covers the arithmetic and none of the judgement', () => {
    const o = L.oracleCoverage();
    expect(o.functionsWithAGolden).toContain('logLogSlope');
    expect(o.functionsWithAGolden).toContain('skinPiMultiplier');
    expect(o.functionsWithNoGoldenAtAll).toContain('chanDiagnosis');
    expect(o.functionsWithNoGoldenAtAll).toContain('screenTreatments');
    expect(o.theOnlyPartThatReturnsAVerdictIsThePartWithNoGolden).toBe(true);
    expect(o.theTwoIndependentRoutes).toHaveLength(2);
  });
});

describe('the teaching well, sample by sample', () => {
  it('is the declared shape and nothing else, and both stories are in it', () => {
    const h = L.teachingHeadline();
    expect(h.name).toBe('ELELENWO-4');
    expect(h.sampleCount).toBe(38);
    expect(h.firstDay).toBe(15);
    expect(h.lastDay).toBe(3600);
    expect(h.positiveDerivatives).toBe(34);
    expect(h.negativeDerivatives).toBe(4);
    expect(h.historySpanDecades).toBeCloseTo(2.380211242, 9);
    expect(h.powerCoefficient).toBeCloseTo(4.432694952e-6, 15);
    expect(h.firstRatio).toBeCloseTo(0.048760749, 9);
    expect(h.lastRatio).toBeCloseTo(9.329979637, 9);
    expect(h.peakRatio).toBeCloseTo(14.587294415, 9);
    expect(h.lastDayBeforeTheChoke).toBeCloseTo(1990.592514, 6);
    // the well row the screening reads
    expect(h.skin).toBe(7.5);
    expect(h.wctPct).toBe(74.5);
    expect(h.reFt).toBe(1180);
    expect(h.rwFt).toBe(0.354);
    expect(h.gorScfStb).toBe(2152);
    expect(h.expectedGorScfStb).toBe(950);
  });

  it('is spaced geometrically, sorted, and turns exactly once', () => {
    const s = L.teachingSeries();
    expect(s).toHaveLength(38);
    for (let i = 1; i < s.length; i += 1) {
      expect(s[i].t).toBeGreaterThan(s[i - 1].t);
      // geometric spacing means a constant ratio between consecutive times
      expect(s[i].t / s[i - 1].t).toBeCloseTo(s[1].t / s[0].t, 9);
    }
    const signs = s.map((p) => Math.sign(p.derivative));
    const turns = signs.filter((v, i) => i > 0 && v !== signs[i - 1]).length;
    expect(turns).toBe(1);
  });

  it('the whole history fitted as one, with no window and no classifier anywhere near it', () => {
    const f = L.teachingFullFit();
    expect(f.ok).toBe(true);
    expect(f.slope).toBeCloseTo(1.098217467822, 12);
    expect(f.intercept).toBeCloseTo(-6.052413433629, 12);
    expect(f.r2Fraction).toBeCloseTo(0.989832434458, 12);
    expect(f.n).toBe(38);
    expect(f.handedIn).toBe(38);
    expect(f.dropped).toBe(0);
    expect(f.spanDecades).toBeCloseTo(2.380211242, 9);
    expect(f.coefficientFromIntercept).toBeCloseTo(2.352178324e-3, 12);
    // ARGUMENTS, NOT ARITHMETIC: the derivative fit is handed FEWER samples
    expect(f.derivativeN).toBe(34);
    expect(f.derivativeDropped).toBe(4);
    expect(f.derivativeSlope).toBeCloseTo(1.229355998655, 12);
    expect(f.derivativeR2Fraction).toBeCloseTo(0.994988493568, 12);
  });
});

describe('the diagnosis, and the window it was read on', () => {
  it('NO ACCESSOR RETURNS A MECHANISM WITHOUT THE WINDOW THAT PRODUCED IT', () => {
    [0.2, 0.3, 0.5, 0.9, 1].forEach((f) => {
      const d = L.teachingDiagnosis(f);
      expect(d.mechanismId, `${f}`).toBeTruthy();
      expect(d.lateFraction, `${f}`).toBe(f);
      expect(Number.isFinite(d.lateFromT), `${f}`).toBe(true);
      expect(d.channellingThreshold, `${f}`).toBe(1.3);
    });
    L.windowSweepRows().forEach((r) => {
      expect(Number.isFinite(r.lateFromT), `${r.lateFraction}`).toBe(true);
      expect(r.mechanismId, `${r.lateFraction}`).toBeTruthy();
    });
  });

  it('at the engine own default the verdict is channelling, close to the boundary', () => {
    const d = L.teachingDiagnosis(0.5);
    expect(d.ok).toBe(true);
    expect(d.mechanismId).toBe('channelling');
    expect(d.treatable).toBe(true);
    expect(d.confidence).toBe('low');
    expect(d.ambiguous).toBe(true);
    expect(d.lateFromT).toBeCloseTo(250.242976, 6);
    expect(d.lateSamples).toBe(19);
    expect(d.latePositiveDerivatives).toBe(15);
    expect(d.lateNegativeDerivatives).toBe(4);
    expect(d.worSlope).toBeCloseTo(1.040602176348, 12);
    expect(d.worR2Fraction).toBeCloseTo(0.921895186494, 12);
    expect(d.derivativeSlope).toBeCloseTo(1.442132492322, 12);
    expect(d.derivativeR2Fraction).toBeCloseTo(0.998513658433, 12);
    expect(d.spanDecades).toBeCloseTo(0.900620470, 9);
    expect(d.marginToThreshold).toBeCloseTo(0.142132492322, 12);
    expect(d.notes).toHaveLength(2);
  });

  it('TWO FITS IN ONE OBJECT, ON TWO DIFFERENT WINDOWS, and nothing in it says so', () => {
    const t = L.teachingTwoWindows(0.5);
    expect(t.ratioFitSamples).toBe(19);
    expect(t.derivativeFitSamples).toBe(15);
    expect(t.samplesShort).toBe(4);
    expect(t.ratioFitSpanDecades).toBeCloseTo(1.157940604, 9);
    expect(t.derivativeFitSpanDecades).toBeCloseTo(0.900620470, 9);
    expect(t.decadesShort).toBeCloseTo(0.257320134, 9);
    expect(t.slopeGap).toBeCloseTo(0.401530316, 9);
    expect(t.theObjectSaysNothingAboutThis).toBe(true);
    // and the span the diagnosis reports is the SECOND window, not the reading
    expect(L.teachingDiagnosis(0.5).spanDecades)
      .toBeCloseTo(t.derivativeFitSpanDecades, 12);
  });

  it('THE DIAL DECIDES THE SPEND, on data that does not change', () => {
    const rows = L.windowSweepRows();
    expect(rows).toHaveLength(9);
    // ARGUMENTS: every row is the same 38 samples read through a different window
    rows.forEach((r) => {
      expect(r.lateSamples).toBeLessThanOrEqual(38);
      expect(r.lateNegativeDerivatives).toBe(4);
    });
    const at = (f) => rows.find((r) => r.lateFraction === f);
    expect(at(0.2).mechanismId).toBe('indeterminate');
    expect(at(0.2).waterShutoffVerdict).toBe('blocked');
    expect(at(0.3).derivativeSlope).toBeCloseTo(1.544046342, 9);
    expect(at(0.3).waterShutoffVerdict).toBe('candidate');
    expect(at(0.5).derivativeSlope).toBeCloseTo(1.442132492, 9);
    expect(at(0.7).derivativeSlope).toBeCloseTo(1.336892539, 9);
    expect(at(0.7).waterShutoffVerdict).toBe('candidate');
    expect(at(0.8).derivativeSlope).toBeCloseTo(1.292632524, 9);
    expect(at(0.8).mechanismId).toBe('displacement');
    expect(at(0.8).waterShutoffVerdict).toBe('blocked');
    expect(at(1).derivativeSlope).toBeCloseTo(1.229355999, 9);
  });

  it('and the flip is closer than the dial travel, which is the finding', () => {
    const f = L.windowFlipHeadline();
    expect(f.flipFromFraction).toBe(0.7);
    expect(f.flipToFraction).toBe(0.8);
    expect(f.flipFromMargin).toBeGreaterThan(0);
    expect(f.flipToMargin).toBeLessThan(0);
    expect(f.defaultFraction).toBe(0.5);
    expect(f.defaultVerdict).toBe('candidate');
    expect(f.slopeRange).toBeCloseTo(0.370920348, 9);
    // the dial moves the slope further than the default reading sits from the
    // boundary that decides it
    expect(f.slopeRange).toBeGreaterThan(Math.abs(f.defaultMargin));
    expect(f.theDialMovesTheSlopeFurtherThanTheDefaultMarginToTheThreshold).toBe(true);
    expect(f.theModuleShipsNoSweepHelper).toBe(true);
  });

  it('and the dial is CLAMPED rather than refused, which is documented nowhere', () => {
    const rows = L.windowClampRows();
    const outside = rows.filter((r) => r.wasClamped);
    expect(outside.length).toBeGreaterThanOrEqual(4);
    outside.forEach((r) => {
      expect(r.refused, `${r.handedIn}`).toBe(false);
      expect(r.mechanismId, `${r.handedIn}`).toBeTruthy();
    });
    expect(rows.find((r) => r.handedIn === -3).clampedTo).toBe(0.1);
    expect(rows.find((r) => r.handedIn === -3).mechanismId).toBe('coning');
    expect(rows.find((r) => r.handedIn === 2.5).clampedTo).toBe(1);
    expect(rows.find((r) => r.handedIn === 2.5).mechanismId).toBe('displacement');
  });
});

describe('the evidence that argues the other way, and where it goes', () => {
  it('the discarded stretch is the coning answer, and it is the CLEANER fit', () => {
    const f = L.discardedFit(0.5);
    expect(f.droppedCount).toBe(4);
    expect(f.firstDroppedDay).toBeGreaterThan(f.chokedOnDay);
    expect(f.droppedRatioSlope).toBeCloseTo(-0.749171775150, 12);
    expect(f.droppedRatioR2Fraction).toBeCloseTo(0.999955540052, 12);
    expect(f.droppedMagnitudeSlope).toBeCloseTo(-0.85, 9);
    expect(f.droppedMagnitudeR2Fraction).toBeCloseTo(1, 12);
    expect(f.reportedMechanismId).toBe('channelling');
    expect(f.samplesUsed).toBe(15);
    expect(f.samplesDroppedInsideTheWindow).toBe(4);
    expect(f.theDiscardedFitIsCleaner).toBe(true);
    expect(f.r2AdvantageOfTheDiscardedFit).toBeGreaterThan(0);
    expect(f.theEngineCountedThemAndDiscardedTheCount).toBe(true);
  });

  it('and the drop shortens the span, which has a gate of its own', () => {
    const rows = L.spanLossRows();
    const at = (f) => rows.find((r) => r.lateFraction === f);
    // where the drop takes the span under the gate, the engine reports no span
    // at all and returns indeterminate instead
    expect(at(0.2).reportedSpanDecades).toBeNull();
    expect(at(0.2).mechanismId).toBe('indeterminate');
    expect(at(0.25).mechanismId).toBe('indeterminate');
    expect(at(0.3).windowRunsDecades).toBeCloseTo(0.707630369, 9);
    expect(at(0.3).reportedSpanDecades).toBeCloseTo(0.450310235, 9);
    expect(at(0.3).lossDecades).toBeCloseTo(0.257320134, 9);
    expect(at(0.3).clearsTheGateBy).toBeCloseTo(0.050310235, 9);
    expect(at(0.3).mechanismId).toBe('channelling');
    // the same drop costs the same span at every setting it survives
    expect(at(0.35).lossDecades).toBeCloseTo(at(0.3).lossDecades, 12);
  });

  it('the path that DOES read the count, and the note that is otherwise unreachable', () => {
    const d = L.fallingOnlyDemo();
    expect(d.sampleCount).toBe(8);
    expect(d.everyDerivativeIsNegative).toBe(true);
    expect(d.ok).toBe(true);
    expect(d.mechanismId).toBe('coning');
    expect(d.treatable).toBe(false);
    expect(d.confidence).toBe('low');
    expect(d.derivativeSlope).toBeNull();
    expect(d.notes).toHaveLength(1);
    expect(d.notes[0]).toMatch(/turns negative over 8 of the late samples/);
    expect(d.notes[0]).toMatch(/turned back down is itself the coning signature/);
    // and that exact sentence never reaches the teaching well's own reading
    expect(L.teachingDiagnosis(0.5).notes.join(' '))
      .not.toMatch(/turned back down is itself the coning signature/);
  });
});

describe('the missing column, and the two spellings of no value', () => {
  it('coerces to a ZERO in every spelling but one, which is the fails-open', () => {
    const rows = L.coercionRows();
    const zeroes = rows.filter((r) => r.passesTheFlatTest);
    expect(zeroes.length).toBe(5);
    zeroes.forEach((r) => expect(r.coercedToZero, r.label).toBe(true));
    const notNumbers = rows.filter((r) => !r.coercedIsFinite);
    expect(notNumbers.length).toBe(2);
  });

  it('the same missing data in two spellings returns two OPPOSITE verdicts', () => {
    const water = L.waterSpellingRows();
    expect(water).toHaveLength(2);
    const [asNull, asNothing] = water;
    expect(asNull.spellingLabel).toBe('the null spelling');
    expect(asNull.mechanismId).toBe('displacement');
    expect(asNull.confidence).toBe('n/a');
    expect(asNothing.mechanismId).toBe('indeterminate');
    expect(asNothing.confidence).toBe('low');
    // identical ratios, so the ratio slope is identical in both
    expect(asNull.worSlope).toBeCloseTo(asNothing.worSlope, 15);
    expect(asNull.worSlope).toBeCloseTo(1.040602176348, 12);
    // the reassuring one is the spelling every JSON export produces
    expect(asNull.mechanismLabel).toBe('Normal displacement');
  });

  it('and on the gas history, which is where the module own text sends the user', () => {
    const gas = L.gasSpellingRows();
    const h = L.gasHeadline();
    expect(h.sampleCount).toBe(26);
    expect(h.firstGorScfStb).toBeCloseTo(957.197245770, 9);
    expect(h.lastGorScfStb).toBeCloseTo(2151.864191995, 9);
    expect(h.foldChangeAcrossTheWindow).toBeCloseTo(2.248088575, 9);
    expect(gas[0].mechanismId).toBe('displacement');
    expect(gas[0].confidence).toBe('n/a');
    expect(gas[0].worSlope).toBeCloseTo(0.356090047430, 12);
    expect(gas[0].worR2Fraction).toBeCloseTo(0.949579197952, 12);
    expect(gas[1].mechanismId).toBe('indeterminate');
    // the ratio gate is unit blind and inert on a gas history
    expect(h.minWor).toBe(0.1);
    expect(h.theGateIsClearedByAFactorOf).toBeGreaterThan(1e4);
  });

  it('THE FLAT BRANCH ASSERTS SOMETHING IT NEVER CHECKED', () => {
    const rows = L.flatBranchRows();
    expect(rows).toHaveLength(3);
    rows.forEach((r) => {
      expect(r.sentence, r.label).toMatch(/sitting flat/);
      expect(r.theBranchNeverLookedAtTheRatio).toBe(true);
    });
    const gas = rows[0];
    const water = rows[1];
    const published = rows[2];
    // the sentence is FALSE on both teaching histories and true on the one
    // published series anybody ever tested it against
    expect(gas.theSentenceIsTrueHere).toBe(false);
    expect(water.theSentenceIsTrueHere).toBe(false);
    expect(published.theSentenceIsTrueHere).toBe(true);
    expect(Math.abs(gas.worSlope)).toBeGreaterThan(0.3);
    expect(Math.abs(water.worSlope)).toBeGreaterThan(1);
  });

  it('and the screening does not know which fluid the diagnosis read', () => {
    const rows = L.fluidBlindnessRows();
    const by = Object.fromEntries(rows.map((r) => [r.source, r]));
    expect(by.water050.waterShutoffVerdict).toBe('candidate');
    expect(by.water050.blocked).toBe(false);
    expect(by.gasNull.waterShutoffVerdict).toBe('blocked');
    expect(by.gasNull.blocked).toBe(true);
    // the block is issued on GAS evidence and its reason quotes the water cut
    expect(by.gasNull.firstReason).toMatch(/Water cut is 75 percent/);
    expect(by.gasNull.blockReason).toMatch(/ordinary displacement/);
    // and with no diagnosis at all it blocks honestly, which is the module at
    // its best
    expect(by.none.waterShutoffVerdict).toBe('blocked');
    expect(by.none.blockReason).toMatch(/mechanism has not been established/);
  });
});

describe('the guards', () => {
  it('a test that decides NOTHING: the fracture verdict never moves', () => {
    const h = L.fractureTernaryHeadline();
    expect(h.distinctFractureVerdicts).toBe(1);
    expect(h.theOnlyFractureVerdict).toBe('consider');
    expect(h.theFractureVerdictNeverMoves).toBe(true);
    // beside it, the verdict gated on the SAME number moves properly
    expect(h.distinctMatrixAcidVerdicts).toBeGreaterThan(2);
    const rows = L.fractureTernaryRows();
    expect(rows[rows.length - 1].skinWasEntered).toBe(false);
    expect(rows[rows.length - 1].matrixAcidVerdict).toBe('unknown');
    expect(rows[rows.length - 1].fractureVerdict).toBe('consider');
  });

  it('a guard that fires BY ACCIDENT, on the sample count and the value together', () => {
    const rows = L.zeroVarianceSweepRows();
    const h = L.zeroVarianceHeadline();
    expect(rows).toHaveLength(8);
    expect(h.cellsSwept).toBe(32);
    // it fires on every small tidy case
    expect(rows[0].cells.every((c) => c.guardFired)).toBe(true);
    expect(rows[1].cells.every((c) => c.guardFired)).toBe(true);
    // and it already splits by five: neither the count nor the value alone
    // predicts it
    expect(h.theSplitStartsAtCount).toBe(5);
    expect(h.guardFired).toBeGreaterThan(0);
    expect(h.guardDidNotFire).toBeGreaterThan(0);
    expect(h.thereIsNoRuleACallerCouldHold).toBe(true);
    const five = rows.find((r) => r.n === 5);
    expect(five.cells.find((c) => c.y === 5).guardFired).toBe(true);
    expect(five.cells.find((c) => c.y === 0.9).guardFired).toBe(false);
  });

  it('and the real signature that lands on it has clean data refused as noise', () => {
    const d = L.constantDerivativeDemo();
    expect(d.sampleCount).toBe(20);
    expect(d.derivativeAtEverySample).toBe(0.9);
    expect(d.theGuardDidNotFire).toBe(true);
    expect(d.standaloneDerivativeR2Fraction).toBeLessThan(1e-30);
    expect(d.cleanDataRefusedAsNoise).toBe(true);
    expect(d.mechanismId).toBe('indeterminate');
    expect(d.notes[0]).toMatch(/scatters too much/);
    expect(d.notes[0]).toMatch(/0\.0 percent/);
    // on a series with no scatter in it whatever
    expect(d.standaloneRatioR2Fraction).toBeGreaterThan(0.99);
  });

  it('the skin guard sits at the SINGULARITY and its message advertises another limit', () => {
    const h = L.skinGuardHeadline();
    expect(h.minimumSkin).toBeCloseTo(-7.361728083308, 12);
    expect(h.fractureLimitTheTextAdvertises).toBe(-6);
    expect(h.acceptedPastTheAdvertisedFractureLimit).toBeGreaterThan(5);
    expect(h.theGapInSkinUnits).toBeCloseTo(1.361728083308, 12);
    expect(h.honestMultiplier).toBeCloseTo(6.292734624, 9);
    expect(h.overreachMultiplier).toBeCloseTo(26.457156986, 9);
    expect(h.overreachOverHonest).toBeCloseTo(4.204397383, 9);
    expect(h.overreachOverTheDesignedJob).toBeCloseTo(9.189015534, 9);
    expect(h.theEngineFlaggedNoneOfIt).toBe(true);
    const rows = L.teachingSkinGuardRows();
    rows.filter((r) => r.ok).forEach((r) => {
      expect(r.warnings, `${r.skinAfter}`).toBe(0);
      expect(r.notes, `${r.skinAfter}`).toBe(0);
      expect(r.error, `${r.skinAfter}`).toBeNull();
    });
    // and the refusal, when it finally arrives, is at the pole
    const refused = rows.filter((r) => !r.ok);
    refused.forEach((r) => {
      expect(r.skinAfter, `${r.skinAfter}`).toBeLessThan(h.minimumSkin);
      expect(r.error).toMatch(/productivity index goes infinite/);
      expect(r.error).toMatch(/-3 to -5 on acid and -5 to -6 on a fracture/);
    });
  });

  it('the ratio gate reads ONE SAMPLE, and one sample decides the whole reading', () => {
    const d = L.lowLastSampleDemo();
    expect(d.sampleCount).toBe(24);
    expect(d.secondToLastRatio).toBeCloseTo(20.279117393, 9);
    expect(d.spoiled.mechanismId).toBe('displacement');
    expect(d.spoiled.confidence).toBe('n/a');
    // no slope computed at all: the gate fires before anything is read
    expect(d.spoiled.worSlope).toBeNull();
    expect(d.spoiled.derivativeSlope).toBeNull();
    expect(d.spoiled.lateFromT).toBeNull();
    expect(d.spoiled.notes[0]).toMatch(/no water problem here to diagnose/);
    // restore that one sample and the whole reading comes back
    expect(d.restored.mechanismId).toBe('displacement');
    expect(d.restored.confidence).toBe('low');
    expect(d.restored.derivativeSlope).toBeCloseTo(1.15, 9);
    expect(d.restored.worSlope).toBeCloseTo(1.15, 9);
    expect(d.restored.ambiguous).toBe(true);
  });

  it('and a short history is refused OUTRIGHT, which is the one count before a read', () => {
    const d = L.shortHistoryDemo();
    expect(d.sampleCount).toBe(5);
    expect(d.minimumSamples).toBe(6);
    expect(d.ok).toBe(false);
    expect(d.refused).toBe(true);
    expect(d.mechanismId).toBe('indeterminate');
    expect(d.error).toMatch(/needs a history, not a handful of points/);
  });
});

describe('the screening, as a set of gates', () => {
  it('names a gate for every treatment, and only three read the diagnosis', () => {
    const rows = L.screeningRows('water050');
    expect(rows).toHaveLength(7);
    rows.forEach((r) => {
      expect(typeof r.gate, r.id).toBe('string');
      expect(r.gate.length, r.id).toBeGreaterThan(5);
      expect(r.reasonCount, r.id).toBeGreaterThan(0);
      expect(r.rank, r.id).toBeGreaterThan(0);
    });
    expect(rows.filter((r) => r.readsTheDiagnosis)).toHaveLength(3);
  });

  it('and the well row NEVER changes: everything that moves is the diagnosis moving', () => {
    const a = L.screeningHeadline('water050');
    const b = L.screeningHeadline('water090');
    expect(a.theWellRowNeverChanges).toBe(true);
    expect(b.theWellRowNeverChanges).toBe(true);
    expect(a.waterShutoffVerdict).toBe('candidate');
    expect(b.waterShutoffVerdict).toBe('blocked');
    expect(a.mechanismId).toBe('channelling');
    expect(b.mechanismId).toBe('displacement');
    // the treatments that never read the diagnosis do not move at all
    const idsA = L.screeningRows('water050').filter((r) => !r.readsTheDiagnosis)
      .map((r) => `${r.id}:${r.verdict}`);
    const idsB = L.screeningRows('water090').filter((r) => !r.readsTheDiagnosis)
      .map((r) => `${r.id}:${r.verdict}`);
    expect(idsA).toEqual(idsB);
  });

  it('the water cut gate fires BEFORE the mechanism is ever read', () => {
    const rows = L.waterGateRows();
    const at = (w) => rows.find((r) => r.wctPct === w);
    expect(at(29).waterShutoffVerdict).toBe('no');
    expect(at(29).blocked).toBe(false);
    expect(at(30).waterShutoffVerdict).toBe('candidate');
    expect(at(74.5).waterShutoffVerdict).toBe('candidate');
    expect(at(10).theMechanismWasNeverReadBelowThirty).toBe(true);
    // and the lift verdict has its own threshold at seventy
    expect(at(60).artificialLiftVerdict).toBe('no');
    expect(at(74.5).artificialLiftVerdict).toBe('consider');
  });

  it('and the gas gate is a factor of two on the expected ratio and nothing else', () => {
    const rows = L.gasGateRows();
    const at = (g) => rows.find((r) => r.gorScfStb === g);
    expect(at(1899).verdict).toBe('no');
    expect(at(1900).verdict).toBe('consider');
    expect(at(1900).ratioToExpected).toBeCloseTo(2, 12);
    expect(at(2152).verdict).toBe('consider');
    // and the reasoning ends by sending the user to run the diagnostic on gas,
    // which is the whole of the missing-column finding in one sentence
    expect(at(2152).lastReason).toMatch(/Run the diagnostic on the gas-oil ratio/);
  });
});

describe('purity, and the panel facades', () => {
  it('every accessor is pure: two calls with the same arguments agree', () => {
    expect(JSON.stringify(L.teachingDiagnosis(0.5)))
      .toBe(JSON.stringify(L.teachingDiagnosis(0.5)));
    expect(JSON.stringify(L.windowSweepRows())).toBe(JSON.stringify(L.windowSweepRows()));
    expect(JSON.stringify(L.screeningRows('water050')))
      .toBe(JSON.stringify(L.screeningRows('water050')));
  });

  it('and a caller cannot mutate one accessor result into another', () => {
    const rows = L.teachingSamples();
    rows[0].ratio = -1;
    expect(L.teachingSamples()[0].ratio).toBeGreaterThan(0);
    const sweep = L.windowSweepRows();
    sweep[0].derivativeSlope = 999;
    expect(L.windowSweepRows()[0].derivativeSlope).not.toBe(999);
  });

  it('each panel reads exactly one facade, and every entry on it is callable', () => {
    [L.diagnosticExplorer, L.channelExplorer, L.candidateExplorer].forEach((facade) => {
      expect(Object.isFrozen(facade)).toBe(true);
      Object.entries(facade).forEach(([key, fn]) => {
        expect(typeof fn, key).toBe('function');
        expect(() => fn(), key).not.toThrow();
      });
    });
  });

  it('and the lab exposes enough numbers for the leak guard to be a real check', () => {
    const q = L.teachingQuantities();
    expect(q.length).toBeGreaterThan(1000);
    q.forEach((r) => {
      expect(typeof r.label).toBe('string');
      expect(Number.isFinite(r.value), r.label).toBe(true);
    });
    expect(L.teachingNumbers()).toHaveLength(q.length);
  });

  it('and states its own limits rather than implying them', () => {
    const rows = L.limits();
    expect(rows.length).toBeGreaterThanOrEqual(7);
    rows.forEach((r) => expect(r.length).toBeGreaterThan(40));
  });
});
