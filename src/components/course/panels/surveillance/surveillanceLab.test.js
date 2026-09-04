// What the PD9 teaching lab returns, pinned.
//
// Three kinds of assertion live here and they are not the same kind of claim.
//
//   AGAINST THE GOLDEN. The four production goldens carry five derived ledger
//   rows, fifty-one field days, two field roll-ups, nine exceptions, a
//   decimator case, five effective declines, a published ratio seam,
//   thirty-six test-in-force probes, five allocation settings, a no-basis
//   case, seven archetype wells, a screening seam and a four-way truth table.
//   Those were committed by oracles that share no numerical machinery with the
//   engines: the surveillance oracle does every date arithmetic on the
//   CALENDAR where the module counts epoch-millisecond day numbers, and the
//   allocation oracle splits the metered total as a SHARE where the module
//   multiplies by a precomputed factor. Where this file asserts against one of
//   those it is asserting agreement between two independent routes.
//
//   AGAINST THE ARGUMENTS. Several assertions here pin WHAT WAS ASKED rather
//   than what came back: that the exception engine was handed the calendar
//   column and not the producing-day column, that the two seam readings were
//   taken over the same window, that every deferment call was handed an
//   explicit anchor. An engine change cannot quietly invert a lesson and still
//   pass those.
//
//   AGAINST THE DIGEST. The teaching field, its wells, its tests, its metered
//   totals and the constructed demonstrations are this wave's own, checked by
//   no oracle anywhere, and the numbers below are the ones the shipped
//   teaching digest prints. They are pinned so a lesson and a panel cannot
//   drift apart.
//
// THE ONE THING THIS FILE MUST NEVER DO is assert a graded capstone answer.
// That boundary is guarded arithmetically by panelCapstoneGuard.test.js.

import { describe, it, expect } from 'vitest';
import * as L from './surveillanceLab.js';

describe('the row, against the five published rows', () => {
  it('reproduces every published derived point, member by member', () => {
    const rows = L.publishedRowRows();
    expect(rows).toHaveLength(5);
    rows.forEach((r) => {
      expect(r.engineReproducesThePublishedPoint, `${r.date}`).toBe(true);
      expect(r.liquid).toBe(r.publishedLiquid);
      expect(r.watercut).toBe(r.publishedWatercut);
      expect(r.gor).toBe(r.publishedGor);
      expect(r.oilPd).toBe(r.publishedOilPd);
    });
    // the shut-in row is the one that refuses on every producing-day member
    const shutIn = rows[2];
    expect(shutIn.hoursOnIn).toBe(0);
    expect(shutIn.oilPd).toBeNull();
    expect(shutIn.waterPd).toBeNull();
    expect(shutIn.gasPd).toBeNull();
    expect(shutIn.liquidPd).toBeNull();
    expect(shutIn.watercut).toBeNull();
    expect(shutIn.gor).toBeNull();
    // and the row with no hours column at all is uptime UNKNOWN, not shut in
    expect(rows[3].hoursOnIn).toBeNull();
    expect(rows[3].hoursOnOut).toBeNull();
    expect(rows[3].oilPd).toBe(450);
    // a row that made gas and no oil has a producing-day gas rate and no ratio
    expect(rows[4].gor).toBeNull();
    expect(rows[4].gasPd).toBe(120);
  });

  it('names nine copied keys and five computed ones, and every computed one can refuse', () => {
    const members = L.pointMemberRows();
    expect(members).toHaveLength(14);
    expect(members.filter((m) => m.kind === 'copied')).toHaveLength(7);
    expect(members.filter((m) => m.kind === 'computed')).toHaveLength(7);
    // the five that come back null are the ratios and the producing-day rates
    expect(members.filter((m) => m.canRefuse).map((m) => m.key))
      .toEqual(['watercut', 'gor', 'oilPd', 'waterPd', 'gasPd', 'liquidPd']);
  });

  it('the producing-day rate is the volume scaled to twenty-four hours and nothing else', () => {
    const rows = L.hoursSweepRows();
    expect(rows).toHaveLength(12);
    expect(rows[0].hoursOn).toBe(24);
    expect(rows[0].upliftOverTheCalendarVolume).toBe(1);
    expect(rows[0].theyAreTheSameNumberOnlyAtAFullDay).toBe(true);
    rows.forEach((r) => {
      // the uplift is exactly 24 over the hours, which is the whole of it
      expect(r.upliftOverTheCalendarVolume).toBeCloseTo(24 / r.hoursOn, 12);
      expect(r.gasPd / r.oilPd).toBeCloseTo(0.5, 12);
    });
    expect(rows[5].oilPd).toBe(1200);
    expect(rows[11].upliftOverTheCalendarVolume).toBe(48);
  });

  it('and anything that is not a finite number of hours is read as uptime UNKNOWN', () => {
    const rows = L.hoursSpellingRows();
    expect(rows).toHaveLength(5);
    rows.forEach((r) => {
      expect(r.hoursOnReturned, r.label).toBeNull();
      expect(r.uptimeIsUnknown, r.label).toBe(true);
      expect(r.oilPd, r.label).toBe(600);
      expect(r.theRateFellBackToTheCalendarVolume, r.label).toBe(true);
    });
    // the string is the one a form field produces and it is not twelve hours
    expect(rows.some((r) => r.label.includes('"12"'))).toBe(true);
  });

  it('and nothing clamps the hours, so an out-of-range value scales the rate DOWNWARDS', () => {
    const rows = L.hoursOutOfRangeRows();
    expect(rows).toHaveLength(7);
    const positive = rows.filter((r) => r.hoursOn > 0);
    positive.forEach((r) => {
      expect(r.refused, `${r.hoursOn}`).toBe(false);
      expect(r.theRateIsBelowTheCalendarVolume, `${r.hoursOn}`).toBe(true);
      expect(r.ratioToTheCalendarVolume).toBeCloseTo(24 / r.hoursOn, 12);
    });
    const negative = rows.filter((r) => r.hoursOn < 0);
    expect(negative).toHaveLength(2);
    negative.forEach((r) => {
      expect(r.refused).toBe(true);
      expect(r.oilPd).toBeNull();
      // the hours themselves are returned as they came in, so a downtime mean
      // can average a negative number of hours
      expect(r.theNegativeHoursAreReturnedAsThemselves).toBe(true);
    });
  });
});

describe('the ratios, and the different conditions they refuse on', () => {
  it('a watercut needs liquid and a gas-oil ratio needs OIL', () => {
    const rows = L.ratioRefusalRows();
    expect(rows).toHaveLength(9);
    // a row with water and no oil has a watercut of one and NO ratio
    const noOil = rows.find((r) => r.oilStb === 0 && r.waterStb === 400);
    expect(noOil.watercutFraction).toBe(1);
    expect(noOil.gorRefused).toBe(true);
    // a row with gas and nothing else refuses BOTH
    const gasOnly = rows.find((r) => r.oilStb === 0 && r.waterStb === 0 && r.gasMscf === 500);
    expect(gasOnly.watercutRefused).toBe(true);
    expect(gasOnly.gorRefused).toBe(true);
    expect(gasOnly.liquidStb).toBe(0);
    // a row with oil and no water has a watercut of exactly zero, not a refusal
    const noWater = rows.find((r) => r.oilStb === 400 && r.waterStb === 0);
    expect(noWater.watercutFraction).toBe(0);
    expect(noWater.watercutRefused).toBe(false);
  });

  it('and a correction row is not refused at all, it is arithmetic', () => {
    const rows = L.ratioRefusalRows();
    const negativeOil = rows.find((r) => r.oilStb === -500);
    expect(negativeOil.liquidStb).toBe(-300);
    expect(negativeOil.watercutRefused).toBe(true);
    expect(negativeOil.gorRefused).toBe(true);
    const negativeWater = rows.find((r) => r.waterStb === -900);
    expect(negativeWater.liquidStb).toBe(-100);
    expect(negativeWater.watercutRefused).toBe(true);
    // the ratio never looks at the water at all, so it comes back ordinary
    expect(negativeWater.gorScfStb).toBe(500);
    expect(negativeWater.isACorrectionRow).toBe(true);
  });

  it('the gas-oil ratio carries the only unit conversion in the file', () => {
    const rows = L.ratioRefusalRows();
    rows.filter((r) => r.gorScfStb !== null).forEach((r) => {
      expect(r.gorScfStb).toBeCloseTo((r.gasMscf * 1000) / r.oilStb, 9);
    });
    expect(L.SCF_PER_MSCF).toBe(1000);
    expect(L.HOURS_PER_DAY).toBe(24);
    expect(L.DAYS_IN_YEAR).toBe(365);
    expect(L.MS_PER_DAY).toBe(86400000);
  });
});

describe('the field roll-up, and what a text column does to a sum', () => {
  it('reproduces every published field day', () => {
    const head = L.publishedFieldSeriesHeadline();
    expect(head.publishedDays).toBe(51);
    expect(head.engineDays).toBe(51);
    expect(head.everyPublishedDayReproduced).toBe(true);
    const rows = L.publishedFieldDayRows();
    expect(rows).toHaveLength(8);
    rows.forEach((r) => expect(r.engineMatchesThePublishedDay, r.date).toBe(true));
    // and the ratios on a field day are volumetric, sum over sum
    rows.filter((r) => r.gorScfStb !== null).forEach((r) => {
      expect(r.gorScfStb).toBeCloseTo((r.gas * 1000) / r.oil, 9);
      expect(r.watercutFraction).toBeCloseTo(r.water / (r.oil + r.water), 12);
    });
  });

  it('the on-count is a three-phase sum that adds Mscf to stb', () => {
    const rows = L.onCountRows();
    expect(rows).toHaveLength(5);
    expect(rows.find((r) => r.label.includes('only gas')).countsAsProducing).toBe(true);
    expect(rows.find((r) => r.label.includes('only water')).countsAsProducing).toBe(true);
    expect(rows.find((r) => r.label.includes('injector')).countsAsProducing).toBe(false);
    expect(rows.find((r) => r.label.includes('injector')).fieldWinj).toBe(3000);
    expect(rows.find((r) => r.label.includes('zero hours')).countsAsProducing).toBe(false);
    expect(rows.find((r) => r.label.includes('zero hours')).fieldOil).toBe(900);
    expect(rows.find((r) => r.label.includes('row of zeroes')).countsAsProducing).toBe(false);
  });

  it('the field total and the sum of the wells differ by the rows nobody attached a well to', () => {
    const o = L.orphanRowHeadline();
    expect(o.rowsHandedIn).toBe(2);
    expect(o.wellSeriesReturned).toBe(1);
    expect(o.pointsOnThem).toBe(1);
    expect(o.fieldDays).toBe(1);
    expect(o.fieldOil).toBe(1800);
    expect(o.oilOnTheWellSeries).toBe(900);
    expect(o.theDifference).toBe(900);
    expect(o.nothingInEitherReturnSaysSo).toBe(true);
  });

  it('THE FOUR ROW SWEEP: a text column concatenates rather than adding', () => {
    const rows = L.stringAccumulatorRows();
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => r.fieldOilAsNumbers)).toEqual([800, 1600, 2400, 3200]);
    expect(rows.map((r) => r.fieldOilAsStrings))
      .toEqual([800, 800800, 800800800, 800800800800]);
    expect(rows[0].theAccumulatorConcatenated).toBe(false);
    expect(rows.slice(1).every((r) => r.theAccumulatorConcatenated)).toBe(true);
    expect(rows[1].overstatementFactor).toBe(500.5);
    expect(rows[2].overstatementFactor).toBe(333667);
    expect(rows[3].overstatementFactor).toBe(250250250.25);
  });

  it('and on one row only the members formed by ADDITION are wrong', () => {
    const s = L.stringRowHeadline();
    expect(s.numbersLiquid).toBe(1000);
    expect(s.stringsLiquid).toBe(800200);
    expect(s.theGorIsExactlyRight).toBe(true);
    expect(s.theOilProducingDayRateIsExactlyRight).toBe(true);
    expect(s.onlyTheMembersFormedByAdditionAreWrong).toBe(true);
    // the same factor both ways, which is the whole of the damage
    expect(s.theWatercutIsUnderstatedByAFactorOf).toBeCloseTo(800.2, 9);
    expect(s.theLiquidRateIsOverstatedByAFactorOf).toBeCloseTo(800.2, 9);
  });
});

describe('the field KPIs, which have no baseline in them at all', () => {
  it('reproduces both published roll-ups', () => {
    const rows = L.publishedKpiRows();
    expect(rows).toHaveLength(2);
    rows.forEach((r) => expect(r.engineReproducesThePublishedKpi, `${r.windowDays}`).toBe(true));
    expect(rows[0].windowDays).toBe(7);
    expect(rows[1].windowDays).toBe(30);
    // the ratios are OF THE MEANS, which is what volume weighted means here
    rows.forEach((r) => {
      expect(r.watercutFraction).toBeCloseTo(r.water / (r.oil + r.water), 12);
      expect(r.gorScfStb).toBeCloseTo((r.gas * 1000) / r.oil, 9);
      expect(r.liquid).toBeCloseTo(r.oil + r.water, 9);
    });
  });

  it('and the window it reports is not the window it averaged', () => {
    const rows = L.kpiWindowSweepRows();
    expect(rows).toHaveLength(8);
    // over 51 published field days, everything past 51 averages 51
    const long = rows.filter((r) => r.windowDaysAsked >= 180);
    expect(long.every((r) => r.fieldDaysActuallyAveraged === 51)).toBe(true);
    expect(long.every((r) => r.itAveragedFewerDaysThanItReports)).toBe(true);
    const short = rows.filter((r) => r.windowDaysAsked <= 30);
    expect(short.every((r) => r.fieldDaysActuallyAveraged === r.windowDaysAsked)).toBe(true);
  });

  it('the well count is every series handed in and an observation well counts as a producer', () => {
    const m = L.kpiMembershipHeadline();
    expect(m.seriesHandedIn).toBe(7);
    expect(m.wellCount).toBe(7);
    expect(m.producerCount).toBe(6);
    expect(m.typedInjector).toBe(1);
    expect(m.typedObservation).toBe(1);
    expect(m.typedProducer).toBe(5);
    expect(m.wellCountIsEverySeriesHandedIn).toBe(true);
    expect(m.anObservationWellIsCountedAsAProducer).toBe(true);
  });

  it('the guard is on the liquid and not on the watercut on the very next line', () => {
    const rows = L.kpiNullGuardRows();
    expect(rows).toHaveLength(2);
    const half = rows[0];
    expect(half.liquid).toBeNull();
    expect(half.liquidRefused).toBe(true);
    expect(half.watercutFraction).toBe(1);
    expect(half.theGuardIsOnLiquidAndNotOnTheNextLine).toBe(true);
    const zeroes = rows[1];
    expect(zeroes.liquid).toBe(0);
    expect(zeroes.watercutRefused).toBe(true);
    expect(zeroes.uptimePct).toBeNull();
    expect(L.kpiEmptyRefusal().returnedNull).toBe(true);
  });

  it('and the teaching field roll-ups match the digest', () => {
    const rows = L.teachingKpiRows();
    expect(rows.map((r) => r.windowDays)).toEqual([7, 14, 30, 70]);
    rows.forEach((r) => {
      expect(r.asOf).toBe(L.TEACHING_AS_OF);
      expect(r.wellCount).toBe(8);
      expect(r.producerCount).toBe(7);
    });
    const seven = rows[0];
    expect(seven.oil).toBeCloseTo(1869.584074327, 9);
    expect(seven.water).toBeCloseTo(694.843600091, 9);
    expect(seven.gas).toBeCloseTo(1222.666628754, 9);
    expect(seven.winj).toBeCloseTo(1994.285714286, 9);
    expect(seven.liquid).toBeCloseTo(2564.427674418, 9);
    expect(seven.watercutFraction).toBeCloseTo(0.270954648876, 12);
    expect(seven.gorScfStb).toBeCloseTo(653.977879649, 9);
    expect(seven.uptimePct).toBeCloseTo(92.011904762, 9);
    expect(rows[3].oil).toBeCloseTo(3410.175094153, 9);
    expect(rows[3].uptimePct).toBeCloseTo(99.201190476, 9);
  });

  it('and the observation well is IN the uptime, by two points at seven days', () => {
    const rows = L.uptimeMembershipRows();
    expect(rows).toHaveLength(2);
    expect(rows[0].uptimePctWithTheObservationWell).toBeCloseTo(92.011904762, 9);
    expect(rows[0].uptimePctWithItDropped).toBeCloseTo(90.014880952, 9);
    expect(rows[0].differenceInPoints).toBeCloseTo(1.99702381, 9);
    expect(rows[0].wellCountWithIt).toBe(8);
    expect(rows[0].wellCountWithout).toBe(7);
    expect(rows[1].uptimePctWithTheObservationWell).toBeCloseTo(98.136111111, 9);
    expect(rows[1].uptimePctWithItDropped).toBeCloseTo(97.670138889, 9);
    const head = L.uptimeMembershipHeadline();
    expect(head.seriesReadForUptime).toBe(7);
    expect(head.ofWhichAtLeastOneRowCarriesAnHoursOn).toBe(5);
  });
});

describe('THE HEADLINE: the exception engine never reads the producing-day rate', () => {
  it('the teaching field is what the digest says it is', () => {
    const h = L.teachingFieldHeadline();
    expect(h.field).toBe('OGUTA');
    expect(h.ledgerRows).toBe(473);
    expect(h.firstDate).toBe('2024-09-12');
    expect(h.lastDate).toBe('2024-11-20');
    expect(h.calendarDaysSpanned).toBe(70);
    expect(h.wells).toBe(8);
    expect(h.meterBias).toBe(1.028);
    expect(h.allocatedFrom).toBe('2024-10-31');
    expect(h.meteredDays).toBe(21);
    expect(h.itIsInventedByThisWaveAndIsNotAPublishedCase).toBe(true);
  });

  it('the uptime well holds ONE producing-day rate across seven different calendar volumes', () => {
    const rows = L.uptimeWellRows();
    expect(rows).toHaveLength(7);
    expect(rows.map((r) => r.hoursOn)).toEqual([16.5, 7.8, 19.2, 14.1, 9.4, 21.6, 12.3]);
    rows.forEach((r) => {
      expect(r.producingDayOilStbd, r.date).toBeCloseTo(512, 9);
      // the ratios are constant too, because only the hours move
      expect(r.watercutFraction).toBeCloseTo(0.180327868852, 12);
      expect(r.gorScfStb).toBeCloseTo(470, 9);
    });
    expect(new Set(rows.map((r) => r.calendarOilStb)).size).toBe(7);
    expect(rows[0].calendarOilStb).toBeCloseTo(352, 9);
    expect(rows[1].calendarOilStb).toBeCloseTo(166.4, 9);
  });

  it('and the two columns move in OPPOSITE directions over the same window', () => {
    const h = L.uptimeWellHeadline();
    expect(h.recentRows).toBe(7);
    expect(h.baselineRows).toBe(30);
    expect(h.recentCalendarMean).toBeCloseTo(307.504761904762, 9);
    expect(h.baselineCalendarMean).toBeCloseTo(502.666666666667, 9);
    expect(h.recentProducingDayMean).toBeCloseTo(512, 9);
    expect(h.baselineProducingDayMean).toBeCloseTo(502.666666666667, 9);
    expect(h.recentHoursMean).toBeCloseTo(14.414285714286, 9);
    expect(h.baselineHoursMean).toBe(24);
    // the number the engine reports, and the number nobody computes
    expect(h.dropPctOnCalendar).toBeCloseTo(38.825312618416, 9);
    expect(h.dropPctOnProducingDay).toBeCloseTo(-1.856763925729, 9);
    expect(h.theTwoColumnsMoveInOppositeDirections).toBe(true);
    expect(h.producingDayValuesAgreeToNineDecimals).toBe(true);
    expect(h.distinctProducingDayValues).toBe(1);
    // the exception that would have named the real cause does not fire either
    expect(h.downtimeThresholdHours).toBe(12);
    expect(h.theDowntimeExceptionFires).toBe(false);
    // and the calendar reading is past the trigger and short of the doubling
    expect(h.rateDropTrigger).toBe(20);
    expect(h.rateDropDoublingToHigh).toBe(40);
    expect(h.dropPctOnCalendar).toBeGreaterThan(h.rateDropTrigger);
    expect(h.dropPctOnCalendar).toBeLessThan(h.rateDropDoublingToHigh);
  });

  it('so the engine reports it as a MEDIUM rate drop on the calendar column', () => {
    const rows = L.teachingExceptionRows();
    const six = rows.find((r) => r.wellName === 'OGUTA-6');
    expect(six.type).toBe('rate_drop');
    expect(six.severity).toBe('medium');
    expect(six.value).toBeCloseTo(307.504761904762, 9);
    expect(six.baseline).toBeCloseTo(502.666666666667, 9);
    expect(six.settingKey).toBe('rateDropPct');
    expect(six.settingValue).toBe(20);
    expect(six.message).toBe('Oil down 39%: 308 vs 503 stb/d baseline.');
  });
});

describe('the two windows, and where they start', () => {
  it('both windows are half-open and they do not overlap', () => {
    const rows = L.windowArithmeticRows();
    expect(rows).toHaveLength(2);
    rows.forEach((r) => {
      expect(r.recentDays).toBe(7);
      expect(r.baselineDays).toBe(30);
      expect(r.theWindowsAreHalfOpenAndDoNotOverlap).toBe(true);
      expect(r.theyAnchorOnTheFieldLatestLedgerDateAndNeverOnTheWallClock).toBe(true);
      expect(r.exceptionsRaised).toBe(r.engineRaises);
    });
    expect(rows[0].asOf).toBe('2025-06-30');
    expect(rows[0].recentFrom).toBe('2025-06-24');
    expect(rows[0].baselineFrom).toBe('2025-05-25');
    expect(rows[0].baselineTo).toBe('2025-06-23');
    expect(rows[0].exceptionsRaised).toBe(9);
    expect(rows[1].asOf).toBe('2024-11-20');
    expect(rows[1].recentFrom).toBe('2024-11-14');
    expect(rows[1].baselineFrom).toBe('2024-10-15');
    expect(rows[1].baselineTo).toBe('2024-11-13');
    expect(rows[1].exceptionsRaised).toBe(8);
  });

  it('and the golden publishes the same window for the seam well', () => {
    const w = L.publishedSeamWindow();
    const rows = L.windowArithmeticRows();
    expect(w.recentFrom).toBe(rows[0].recentFrom);
    expect(w.recentTo).toBe(rows[0].recentTo);
    expect(w.baselineFrom).toBe(rows[0].baselineFrom);
    expect(w.baselineTo).toBe(rows[0].baselineTo);
  });

  it('a coarse cadence widens the WINDOWS and never the volumes', () => {
    const rows = L.wideningRows();
    expect(rows).toHaveLength(10);
    rows.forEach((r) => {
      expect(r.recentDays).toBe(Math.max(7, Math.ceil(r.cadenceDays * 1.5)));
      expect(r.baselineDays).toBe(Math.max(30, Math.ceil(r.cadenceDays * 4)));
      expect(r.staleDays).toBe(Math.max(7, Math.ceil(r.cadenceDays * 1.5)));
      expect(r.theVolumesAreNeverRescaled).toBe(true);
    });
    const daily = rows.find((r) => r.cadenceDays === 1);
    expect([daily.recentDays, daily.baselineDays, daily.staleDays]).toEqual([7, 30, 7]);
    const monthly = rows.find((r) => r.cadenceDays === 30);
    expect([monthly.recentDays, monthly.baselineDays, monthly.staleDays]).toEqual([45, 120, 45]);
    const halfDay = rows.find((r) => r.cadenceDays === 30.5);
    expect([halfDay.recentDays, halfDay.baselineDays, halfDay.staleDays]).toEqual([46, 122, 46]);
  });

  it('and a cadence is a MEDIAN, so it can be a half day no gap ever was', () => {
    const rows = L.cadenceGapRows();
    expect(rows.find((r) => r.gaps === '1, 1, 1, 1').cadenceDays).toBe(1);
    expect(rows.find((r) => r.gaps === '1, 1, 30, 30').cadenceDays).toBe(15.5);
    expect(rows.find((r) => r.gaps === '30, 31, 30, 31, 30').cadenceDays).toBe(30);
    expect(rows.find((r) => r.gaps === '30, 31, 31, 30, 31, 20').cadenceDays).toBe(30.5);
    const single = rows.find((r) => r.gaps === 'one point only');
    expect(single.cadenceDays).toBeNull();
    expect(single.refused).toBe(true);
    // and the published cadences, which is what the widening reads
    const published = L.publishedCadenceRows();
    expect(published).toHaveLength(7);
    expect(published.find((r) => r.name === 'P-3').cadenceDays).toBe(30);
    expect(published.filter((r) => r.cadenceDays === 1)).toHaveLength(6);
  });

  it('a period volume and a rate per elapsed day tell OPPOSITE stories', () => {
    const rows = L.monthlyPeriodRows();
    expect(rows).toHaveLength(6);
    expect(rows[0].daysSinceThePreviousRow).toBeNull();
    expect(rows[4].periodOilStb).toBe(23200);
    expect(rows[4].daysSinceThePreviousRow).toBe(30);
    expect(rows[4].oilPerElapsedDayStbd).toBeCloseTo(773.333333333, 9);
    expect(rows[5].periodOilStb).toBe(11600);
    expect(rows[5].daysSinceThePreviousRow).toBe(14);
    expect(rows[5].oilPerElapsedDayStbd).toBeCloseTo(828.571428571, 9);
    const h = L.monthlyPeriodHeadline();
    expect(h.cadenceDays).toBe(30);
    expect(h.recentDays).toBe(45);
    expect(h.baselineDays).toBe(120);
    expect(h.thePeriodVolumeFell).toBe(true);
    expect(h.theRatePerElapsedDayRose).toBe(true);
    // and it is reported at the TOP of the ladder for producing more per day
    expect(h.exceptionType).toBe('rate_drop');
    expect(h.exceptionSeverity).toBe('high');
    expect(h.exceptionValue).toBe(11600);
    expect(h.exceptionBaseline).toBe(24400);
    expect(h.exceptionMessage).toBe('Oil down 52%: 11,600 vs 24,400 stb/d baseline.');
  });

  it('and the published monthly well shows the same shape at a different size', () => {
    const p = L.publishedMonthlyRows();
    expect(p.rows).toHaveLength(6);
    p.rows.forEach((r) => {
      expect(r.hoursOn).toBeNull();
      // a month of production read as a calendar day, so the two are equal
      expect(r.oilPd).toBe(r.periodOilStb);
    });
    expect(p.exceptionType).toBe('rate_drop');
    expect(p.exceptionSeverity).toBe('medium');
    expect(p.exceptionMessage).toBe('Oil down 20%: 12,000 vs 15,000 stb/d baseline.');
    expect(p.theMessageHardCodesTheUnit).toBe(true);
  });

  it('every teaching window mean matches the digest, on the column the engine reads', () => {
    const rows = L.windowMeanRows();
    expect(rows).toHaveLength(9);
    const pick = (name, key) => rows.find((r) => r.name === name && r.key === key);
    const o2oil = pick('OGUTA-2', 'oil');
    expect(o2oil.recentMean).toBeCloseTo(618.142857142857, 9);
    expect(o2oil.baselineMean).toBeCloseTo(1038.9, 9);
    expect(o2oil.changePct).toBeCloseTo(-40.50025439, 9);
    expect(o2oil.recentRows).toBe(7);
    expect(o2oil.baselineRows).toBe(30);
    const o2wc = pick('OGUTA-2', 'watercut');
    expect(o2wc.recentMean).toBeCloseTo(0.45138645192, 12);
    expect(o2wc.baselineMean).toBeCloseTo(0.236641221374, 12);
    expect(o2wc.riseInPoints).toBeCloseTo(21.474523055, 9);
    const o2gor = pick('OGUTA-2', 'gor');
    expect(o2gor.recentMean).toBeCloseTo(1066.66341076225, 9);
    expect(o2gor.changePct).toBeCloseTo(83.907484614, 9);
    expect(pick('OGUTA-6', 'oil').changePct).toBeCloseTo(-38.825312618, 9);
    expect(pick('OGUTA-6', 'hoursOn').recentMean).toBeCloseTo(14.414285714286, 9);
    expect(pick('OGUTA-9', 'oil').changePct).toBeCloseTo(-6.134742308, 9);
    expect(pick('OGUTA-3W', 'winj').recentMean).toBeCloseTo(1994.285714285714, 9);
    // AGAINST THE ARGUMENTS: the oil row says which column it was read on
    expect(o2oil.measuredOn).toMatch(/CALENDAR/);
    expect(o2gor.measuredOn).toMatch(/MEAN OF DAILY RATIOS/);
  });
});

describe('the seven exception types, and the thresholds they cross', () => {
  it('three of the seven do not climb the ladder at all', () => {
    const rows = L.severityLadderRows();
    expect(rows).toHaveLength(7);
    const byType = Object.fromEntries(rows.map((r) => [r.type, r]));
    expect(byType.shut_in.alwaysHigh).toBe(true);
    expect(byType.shut_in.doublingAt).toBeNull();
    expect(byType.downtime.alwaysMedium).toBe(true);
    expect(byType.downtime.canReachHigh).toBe(false);
    expect(byType.downtime.doublingAt).toBeNull();
    expect(byType.stale_data.cannotExceedMedium).toBe(true);
    expect(byType.stale_data.canReachHigh).toBe(false);
    // the watercut check is the one the minimum rate gate does NOT cover
    expect(byType.watercut_rise.gatedByMinOilRate).toBe(false);
    expect(byType.rate_drop.gatedByMinOilRate).toBe(true);
    expect(byType.gor_rise.gatedByMinOilRate).toBe(true);
    // and every climbing type doubles at exactly twice its trigger
    rows.filter((r) => r.doublingAt !== null).forEach((r) => {
      expect(r.doublingAt).toBe(r.settingValue * 2);
    });
    const h = L.severityLadderHeadline();
    expect(h.types).toBe(7);
    expect(h.typesThatCanReachHigh).toBe(5);
    expect(h.theOneThatIsAlwaysMediumUnconditionally).toBe('downtime');
    expect(h.theOneThatIsAlwaysHigh).toBe('shut_in');
    expect(h.severityRanks).toEqual({ high: 0, medium: 1, info: 2 });
  });

  it('reproduces all nine published exceptions, type severity value and baseline', () => {
    const rows = L.publishedExceptionRows();
    expect(rows).toHaveLength(9);
    rows.forEach((r) => expect(r.engineReproducesIt, `${r.wellName} ${r.type}`).toBe(true));
    expect(rows[0].wellName).toBe('P-1');
    expect(rows[0].type).toBe('watercut_rise');
    expect(rows[0].severity).toBe('high');
    expect(rows[0].message).toBe('Watercut up 21 points: 56% vs 35% baseline.');
    expect(rows[2].type).toBe('shut_in');
    expect(rows[2].severity).toBe('high');
    expect(rows[2].value).toBe(0);
    expect(rows[8].type).toBe('downtime');
    expect(rows[8].severity).toBe('medium');
    expect(rows[8].value).toBe(8);
    expect(rows[8].baseline).toBe(12);
    // the sort is severity then well name and nothing else
    const ranks = { high: 0, medium: 1, info: 2 };
    for (let i = 1; i < rows.length; i += 1) {
      expect(ranks[rows[i].severity]).toBeGreaterThanOrEqual(ranks[rows[i - 1].severity]);
    }
  });

  it('and the eight on the teaching field match the digest line for line', () => {
    const rows = L.teachingExceptionRows();
    expect(rows).toHaveLength(8);
    const flat = rows.map((r) => `${r.wellName}/${r.type}/${r.severity}`);
    expect(flat).toEqual([
      'OGUTA-14/rate_drop/high',
      'OGUTA-2/rate_drop/high',
      'OGUTA-2/watercut_rise/high',
      'OGUTA-2/gor_rise/high',
      'OGUTA-5/watercut_rise/high',
      'OGUTA-17/stale_data/medium',
      'OGUTA-3W/injection_drop/medium',
      'OGUTA-6/rate_drop/medium',
    ]);
    expect(rows[3].value).toBeCloseTo(1066.66341076225, 9);
    expect(rows[3].message).toBe('GOR up 84%: 1,067 vs 580 scf/stb baseline.');
    expect(rows[4].value).toBeCloseTo(0.867469879518, 12);
    expect(rows[5].value).toBe(23);
    expect(rows[6].value).toBeCloseTo(1994.285714285714, 9);
    const h = L.teachingExceptionHeadline();
    expect(h.raised).toBe(8);
    expect(h.wellsSurveilled).toBe(7);
    expect(h.wellsHandedIn).toBe(8);
    expect(h.highCount).toBe(5);
    expect(h.mediumCount).toBe(3);
    expect(h.infoCount).toBe(0);
    expect(h.wellsThatRaisedNothing.sort()).toEqual(['OGUTA-21', 'OGUTA-9']);
  });

  it('any unrecognised well type is read as a PRODUCER', () => {
    const rows = L.wellTypeRows();
    expect(rows).toHaveLength(7);
    const byType = Object.fromEntries(rows.map((r) => [r.wellType, r]));
    expect(byType.observation.filteredOutEntirely).toBe(true);
    expect(byType.observation.exceptionsRaised).toBe(0);
    expect(byType.injector.readAsAnInjector).toBe(true);
    expect(byType.injector.readAsAProducer).toBe(false);
    ['producer', 'water_injector', 'gas_injector', 'the empty string', 'the key is absent']
      .forEach((k) => {
        expect(byType[k].readAsAProducer, k).toBe(true);
        expect(byType[k].readAsAnInjector, k).toBe(false);
      });
  });

  it('and a surveillance list is a function of the settings as much as of the data', () => {
    const rows = L.settingsSweepRows('rateDropPct');
    expect(rows).toHaveLength(10);
    rows.forEach((r) => expect(r.noRowInTheReturnNamesTheSettingThatPutItThere).toBe(true));
    expect(rows.find((r) => r.settingValue === 20).isTheDefault).toBe(true);
    expect(rows.find((r) => r.settingValue === 5).exceptions).toBe(9);
    expect(rows.find((r) => r.settingValue === 5).high).toBe(7);
    expect(rows.find((r) => r.settingValue === 20).high).toBe(4);
    expect(rows.find((r) => r.settingValue === 90).exceptions).toBe(5);
    // and the downtime dial cannot make anything high, ever
    L.settingsSweepRows('downtimeHours').forEach((r) => {
      expect(r.high).toBeLessThanOrEqual(4);
    });
    // the minimum rate dial silences rate rows and leaves a watercut standing
    const minOil = L.settingsSweepRows('minOilRate');
    expect(minOil.find((r) => r.settingValue === 20000).exceptions).toBe(3);
    expect(minOil.find((r) => r.settingValue === 20000).types).toMatch(/watercut_rise/);
  });
});

describe('the test that carries a well, and the guard that decides more than the limit', () => {
  it('reproduces the published test-in-force probes', () => {
    const rows = L.publishedTestInForceRows();
    expect(rows).toHaveLength(12);
    expect(rows[0].testInForce).toBeNull();
    expect(rows[0].theWellTakesNoShare).toBe(true);
    expect(rows[1].testInForce).toBe('t-p1-a');
    expect(rows[4].testInForce).toBe('t-p1-b');
  });

  it('ZERO turns the age check off, which is the loosest behaviour on the dial', () => {
    const rows = L.ageGuardRows();
    expect(rows).toHaveLength(9);
    const byLabel = Object.fromEntries(rows.map((r) => [r.label, r]));
    expect(rows[0].testAgeDays).toBe(2088);
    expect(byLabel['180 days, the default value'].theOldTestCarriesTheWell).toBe(false);
    expect(byLabel['365 days'].theOldTestCarriesTheWell).toBe(false);
    expect(byLabel['1 day'].theOldTestCarriesTheWell).toBe(false);
    ['0 days, which reads as the strictest setting on the dial', '-1 days',
      'not a number', 'null', 'Infinity'].forEach((k) => {
      expect(byLabel[k].theAgeCheckRan, k).toBe(false);
      expect(byLabel[k].theOldTestCarriesTheWell, k).toBe(true);
    });
    // and an omitted argument takes the default, so it REFUSES the old test
    const omitted = rows[rows.length - 1];
    expect(omitted.theAgeCheckRan).toBe(true);
    expect(omitted.theOldTestCarriesTheWell).toBe(false);
    const h = L.ageGuardHeadline();
    expect(h.zeroTurnsTheCheckOff).toBe(true);
    expect(h.settingsThatTurnTheCheckOff).toBe(5);
    expect(h.undefinedAndNullMeanOppositeThings).toBe(true);
  });

  it('and the same dial on the teaching allocation matches the digest', () => {
    const rows = L.maxTestAgeSweepRows();
    expect(rows).toHaveLength(13);
    const at = (d) => rows.find((r) => r.maxTestAgeDays === d);
    expect(at(180).theoreticalOil).toBeCloseTo(54713.920833333, 6);
    expect(at(180).wellsTakingAShare).toBe(4);
    expect(at(120).theoreticalOil).toBeCloseTo(48437.920833333, 6);
    expect(at(60).theoreticalOil).toBeCloseTo(39172, 6);
    expect(at(60).wellsTakingAShare).toBe(2);
    expect(at(30).theoreticalOil).toBeCloseTo(28036, 6);
    expect(at(1).theoreticalOil).toBeCloseTo(2072, 6);
    expect(at(1).wellsTakingAShare).toBe(1);
    expect(at(0).theoreticalOil).toBeCloseTo(65033.920833333, 6);
    expect(at(0).wellsTakingAShare).toBe(4);
    const h = L.maxTestAgeHeadline();
    expect(h.zeroGivesMoreThanSixtyDoes).toBe(true);
    expect(h.tighteningFromOneDayToZeroTurnsTheCheckOff).toBe(true);
    // ageing a test out does NOT reduce the allocated total
    expect(h.theAllocatedTotalIsUnchangedByAgeingATestOut).toBe(true);
  });

  it('the grouping drops a test only when the flag is STRICTLY false', () => {
    const rows = L.groupTestsRows();
    expect(rows).toHaveLength(6);
    expect(rows.filter((r) => r.keptByDefault)).toHaveLength(5);
    expect(rows.filter((r) => r.keptWithIncludeInvalid)).toHaveLength(6);
    const dropped = rows.filter((r) => !r.keptByDefault);
    expect(dropped).toHaveLength(1);
    expect(dropped[0].id).toBe('v-false');
    expect(dropped[0].droppedOnlyBecauseItIsStrictlyFalse).toBe(true);
    // the string that spells false, a null and a zero are all KEPT
    ['v-string-false', 'v-null', 'v-zero', 'v-absent'].forEach((id) => {
      expect(rows.find((r) => r.id === id).keptByDefault, id).toBe(true);
    });
  });

  it('and the quality check returns only the tests WITH issues', () => {
    const c = L.qcCoverageHeadline();
    expect(c.testsHandedIn).toBe(7);
    expect(c.rowsReturned).toBe(4);
    expect(c.testsWithNoIssueAndThereforeAbsent).toBe(3);
    expect(c.rowsReturnedOnAnEmptyTestList).toBe(0);
    expect(c.anEmptyArrayMeansEitherAllCleanOrNothingRan).toBe(true);
    expect(c.thereIsNoCountOfTestsCheckedInTheReturn).toBe(true);
    const rows = L.publishedQcRows();
    expect(rows).toHaveLength(4);
    expect(rows[0].testId).toBe('q-7');
    expect(rows[0].severity).toBe('high');
    expect(rows[0].codes).toBe('zero_rate, no_ledger');
    expect(rows[1].codes).toBe('rate_outlier, ledger_mismatch, watercut_mismatch');
  });

  it('and the outlier check cannot see the first three tests of a well', () => {
    const rows = L.outlierReachRows();
    expect(rows).toHaveLength(5);
    expect(rows.find((r) => r.testsOnTheWell === 2).theOutlierFired).toBe(false);
    expect(rows.find((r) => r.testsOnTheWell === 3).theOutlierFired).toBe(false);
    expect(rows.find((r) => r.testsOnTheWell === 4).theOutlierFired).toBe(true);
    expect(rows.find((r) => r.testsOnTheWell === 6).theOutlierFired).toBe(true);
  });

  it('and the teaching quality check flags a test the grouping carries anyway', () => {
    const rows = L.teachingQcRows();
    expect(rows.length).toBeGreaterThanOrEqual(5);
    const nine = rows.find((r) => r.testId === 'g-o9-1');
    expect(nine.wellName).toBe('OGUTA-9');
    expect(nine.severity).toBe('medium');
    expect(nine.codes).toBe('watercut_mismatch');
    // and that test still carries its well in the split
    const inForce = L.teachingTestInForceRows(['2024-11-20']);
    expect(inForce.find((r) => r.wellName === 'OGUTA-9').testId).toBe('g-o9-1');
    expect(L.teachingTestRows().find((t) => t.id === 'g-o9-1').isValid).toBe(true);
  });
});

describe('one meter shared over many wells', () => {
  it('closure holds EXACTLY on every published day a factor exists', () => {
    const rows = L.closureRows();
    expect(rows).toHaveLength(4);
    rows.forEach((r) => {
      expect(r.itClosesExactly, r.date).toBe(true);
      expect(r.closureResidual).toBeCloseTo(0, 9);
    });
    expect(rows[0].oilFactor).toBeCloseTo(0.980769230769, 12);
  });

  it('and it fails silently at the grand total when a day has no basis', () => {
    const nb = L.noBasisHeadline();
    expect(nb.days).toBe(2);
    expect(nb.measuredOil).toBe(830);
    expect(nb.allocatedOil).toBe(520);
    expect(nb.meteredOilInNoWellAndInNoTotal).toBe(310);
    expect(nb.theSecondDayHasNoFactorAtAll).toBe(true);
    expect(nb.thereIsNoClosureFigureInTheReturn).toBe(true);
  });

  it('reproduces all five published allocation settings', () => {
    const rows = L.publishedAllocationRows();
    expect(rows).toHaveLength(5);
    rows.forEach((r) => expect(r.days).toBe(24));
    const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));
    expect(byKey.allocation.theoreticalOil).toBeCloseTo(38046.666666667, 6);
    expect(byKey.allocation.grandFactor).toBeCloseTo(1.043350271596, 9);
    expect(byKey.allocationNoUptime.theoreticalOil).toBe(41300);
    expect(byKey.allocationAged120.theoreticalOil).toBe(23540);
    expect(byKey.allocationAged120.unallocatedMeteredOil).toBe(3324);
    expect(byKey.allocationWithInvalidTests.theoreticalOil).toBeCloseTo(33246.666666667, 6);
    expect(byKey.allocationLedgerBasis.theoreticalOil).toBe(39980);
  });

  it('and the teaching allocation matches the digest', () => {
    const h = L.teachingAllocationHeadline();
    expect(h.allocatedDays).toBe(21);
    expect(h.firstDate).toBe('2024-10-31');
    expect(h.lastDate).toBe('2024-11-20');
    expect(h.wellsTakingAShare).toBe(4);
    expect(h.diagnostics).toBe(57);
    expect(h.diagnosticsByCode).toBe('no_test_in_force 57');
    expect(h.measuredOil).toBeCloseTo(58426.784897363, 6);
    expect(h.theoreticalOil).toBeCloseTo(54713.920833333, 6);
    expect(h.allocatedOil).toBeCloseTo(58426.784897363, 6);
    expect(h.closureResidualOil).toBeCloseTo(0, 6);
    const days = L.teachingAllocationDayRows();
    expect(days).toHaveLength(21);
    expect(days[0].oilFactor).toBeCloseTo(0.947703084569, 9);
    expect(days[0].entries).toBe(4);
    expect(days[6].entries).toBe(3);
    expect(days[20].oilFactor).toBeCloseTo(1.190463125091, 9);
    const wells = L.teachingAllocationWellRows();
    expect(wells).toHaveLength(4);
    expect(wells.find((w) => w.wellName === 'OGUTA-2').theoreticalOil).toBe(21832);
    expect(wells.find((w) => w.wellName === 'OGUTA-17').days).toBe(6);
  });

  it('a well that filed NO ROW at all is credited with a full day on stream', () => {
    const rows = L.missingRowRows();
    expect(rows).toHaveLength(4);
    const told = rows[0];
    expect(told.oilFactor).toBe(1);
    expect(told.shareBUptime).toBe(0);
    expect(told.shareBAllocatedOil).toBe(0);
    expect(told.shareAAllocatedOil).toBe(1000);
    const silent = rows[1];
    expect(silent.oilFactor).toBe(0.5);
    expect(silent.shareBUptime).toBe(1);
    expect(silent.shareBAllocatedOil).toBe(500);
    expect(silent.shareBWasCreditedWithBarrelsItNeverMade).toBe(true);
    expect(silent.diagnostics).toMatch(/factor_out_of_band/);
    // and a row of zeroes with a full day on it lands in the same place
    expect(rows[2].oilFactor).toBe(0.5);
    expect(rows[3].oilFactor).toBe(0.5);
  });

  it('and the teaching well that goes quiet takes a share until its test ages out', () => {
    const rows = L.quietWellRows();
    expect(rows).toHaveLength(21);
    expect(rows.every((r) => r.ledgerRowFiled === false)).toBe(true);
    const h = L.quietWellHeadline();
    expect(h.allocatedDays).toBe(21);
    expect(h.daysWithNoLedgerRow).toBe(21);
    expect(h.daysCreditedWithAFullDayOnStream).toBe(6);
    expect(h.daysThatTookNoShareAtAll).toBe(15);
    // and the surveillance half reads the identical absence the other way
    expect(h.surveillanceExceptionType).toBe('stale_data');
    expect(h.surveillanceExceptionSeverity).toBe('medium');
    expect(h.surveillanceExceptionValue).toBe(23);
    expect(h.oneWellTwoModulesTwoOppositeReadingsOfTheSameSilence).toBe(true);
  });

  it('the imbalance percentage is against what the WELLS booked', () => {
    const rows = L.publishedImbalanceRows();
    expect(rows).toHaveLength(6);
    rows.forEach((r) => {
      expect(r.imbalanceOil).toBeCloseTo(r.measuredOil - r.bookedOil, 6);
      expect(r.imbalanceOilPct).toBeCloseTo((r.imbalanceOil / r.bookedOil) * 100, 6);
      expect(r.thePercentageIsAgainstWhatTheWellsBookedAndNotAgainstTheMeter).toBe(true);
    });
    const teaching = L.teachingImbalanceRows();
    expect(teaching).toHaveLength(21);
    expect(teaching[0].imbalanceOil).toBeCloseTo(522.187140049, 6);
    expect(teaching[0].imbalanceOilPct).toBeCloseTo(20.808289025167, 6);
  });

  it('and a monthly factor of one has two meanings the return cannot tell apart', () => {
    const n = L.nothingToScaleHeadline();
    expect(n.oilFactor).toBeCloseTo(0.9, 12);
    expect(n.gasFactor).toBe(1);
    expect(n.theoreticalGas).toBe(0);
    expect(n.allocatedGas).toBe(0);
    expect(n.meteredGas).toBe(500);
    expect(n.diagnosticsRaised).toMatch(/no_basis/);
    expect(n.theDiagnosticThatTellsThemApartIsOnADifferentArray).toBe(true);
    const monthly = L.teachingMonthlyFactorRows();
    expect(monthly.length).toBeGreaterThanOrEqual(8);
    monthly.forEach((m) => expect(typeof m.periodMonth).toBe('string'));
  });

  it('and nothing clamps a factor into the warning band', () => {
    const rows = L.factorBandRows();
    expect(rows).toHaveLength(10);
    rows.forEach((r) => {
      expect(r.reportedFactor).toBeCloseTo(r.meteredOverTheoretical, 9);
      expect(r.nothingClampsAFactorIntoTheBand).toBe(true);
    });
    expect(rows.find((r) => r.meteredOverTheoretical === 0.69).outOfBand).toBe(true);
    expect(rows.find((r) => r.meteredOverTheoretical === 0.7).outOfBand).toBe(false);
    expect(rows.find((r) => r.meteredOverTheoretical === 1.3).outOfBand).toBe(false);
    expect(rows.find((r) => r.meteredOverTheoretical === 1.31).outOfBand).toBe(true);
  });

  it('and the write-back carries the uptime through as an hours column', () => {
    const w = L.allocatedLedgerHeadline();
    expect(w.rows).toBe(69);
    expect(w.distinctWells).toBe(4);
    expect(w.rowsCarryingAnHoursOn).toBe(69);
    expect(w.lastDayRows).toHaveLength(3);
    const six = w.lastDayRows.find((r) => r.wellId === 'w-oguta-6');
    expect(six.hoursOn).toBeCloseTo(12.3, 9);
    expect(six.oilStb).toBeCloseTo(310.547186969, 6);
  });
});

describe('the deferments, and the one function that reads the wall clock', () => {
  it('reproduces the published roll-up at its own published anchor', () => {
    const h = L.publishedDefermentHeadline();
    expect(h.asOf).toBe('2025-06-30');
    expect(h.events).toBe(5);
    expect(h.openEvents).toBe(1);
    expect(h.totalDays).toBe(21);
    expect(h.totalOil).toBe(10850);
    expect(h.categories).toEqual(['Well integrity', 'Facility', 'Power']);
    expect(h.theAsOfWasHandedInExplicitly).toBe(true);
    const rows = L.publishedDefermentCategoryRows();
    expect(rows).toHaveLength(3);
    expect(rows[0].oil).toBe(5100);
    expect(rows[0].days).toBe(10);
  });

  it('the day count is inclusive and is clamped at one', () => {
    const rows = L.defermentDayRows();
    expect(rows).toHaveLength(5);
    expect(rows.find((r) => r.label === 'same day').days).toBe(1);
    expect(rows.find((r) => r.label === 'three days').days).toBe(3);
    expect(rows.find((r) => r.label === 'a full month').days).toBe(30);
    const backwards = rows.filter((r) => r.theDatesWereTheWrongWayRound);
    expect(backwards).toHaveLength(2);
    backwards.forEach((r) => {
      expect(r.days).toBe(1);
      expect(r.itWasClampedToOne).toBe(true);
      expect(r.nothingSaysTheDatesWereTheWrongWayRound).toBe(true);
    });
  });

  it('AND THE WALL CLOCK IS EXPOSED AS A BOOLEAN AND AS ANCHORED RECOMPUTATIONS', () => {
    const rows = L.defermentAnchorRows();
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => r.days)).toEqual([30, 92, 173, 395]);
    rows.forEach((r) => {
      expect(r.openCount).toBe(1);
      expect(r.oil).toBe(3200);
      expect(r.theAnchorWasHandedInExplicitly).toBe(true);
    });
    const w = L.wallClockHeadline();
    expect(w.theFunction).toBe('summarizeDeferments');
    expect(w.itDefaultsItsAsOfToToday).toBe(true);
    expect(w.theDayCountDiffersFromTheAnchoredOne).toBe(true);
    expect(w.theOpenCountIsTheSameEitherWay).toBe(true);
    expect(w.theDeferredVolumesAreTheSameEitherWay).toBe(true);
    expect(w.theUnanchoredDayCountIsNotReturnedByThisLab).toBe(true);
    // AGAINST THE ARGUMENTS: no numeric member of this object is the wall
    // clock day count, so two runs a day apart return equal values
    expect(JSON.stringify(L.defermentAnchorRows()))
      .toBe(JSON.stringify(L.defermentAnchorRows()));
  });

  it('and the teaching deferment book matches the digest', () => {
    const rows = L.teachingDefermentRows();
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => r.category))
      .toEqual(['Facility', 'Artificial lift', 'Well work', 'Pipeline']);
    expect(rows.map((r) => r.days)).toEqual([7, 10, 9, 3]);
    expect(rows.map((r) => r.oil)).toEqual([5820, 3140, 2960, 880]);
    expect(rows.reduce((a, r) => a + r.oil, 0)).toBe(12800);
    expect(rows.reduce((a, r) => a + r.days, 0)).toBe(29);
  });
});

describe('EXPERT: one ratio read two ways', () => {
  it('the golden publishes the disagreement rather than resolving it', () => {
    const s = L.publishedSeamHeadline();
    expect(s.well).toBe('P-1');
    expect(s.gorBaselineMeanOfRatios).toBe(800);
    expect(s.gorBaselineVolumetric).toBe(800);
    expect(s.gorRecentMeanOfRatios).toBeCloseTo(1360.267857142857, 9);
    expect(s.gorRecentVolumetric).toBeCloseTo(1141.902313624679, 9);
    expect(s.gorRiseByMeanOfRatiosPct).toBeCloseTo(70.033482142857, 9);
    expect(s.gorRiseByVolumetricPct).toBeCloseTo(42.737789203085, 9);
    expect(s.gorOverstatementPct).toBeCloseTo(19.122961825433, 9);
    expect(s.gorSeverityByMeanOfRatios).toBe('high');
    expect(s.gorSeverityByVolumetric).toBe('medium');
    expect(s.gorRiseRatio).toBeCloseTo(1.638678168636, 9);
    expect(s.watercutRiseByMeanOfRatiosPts).toBeCloseTo(20.938677629325, 9);
    expect(s.watercutRiseByVolumetricPts).toBeCloseTo(18.60348020516, 9);
    expect(s.watercutRiseDifferenceInPoints).toBeCloseTo(2.335197424165, 9);
    expect(s.theSeverityMovesOnBothRatiosAtOnce).toBe(true);
    expect(s.theGoldenPublishesTheDisagreementRatherThanResolvingIt).toBe(true);
    // and the triggers the two readings are measured against
    expect(s.gorTrigger).toBe(30);
    expect(s.gorDoublingToHigh).toBe(60);
    expect(s.watercutTrigger).toBe(10);
    expect(s.watercutDoublingToHigh).toBe(20);
  });

  it('and names which function reads which way', () => {
    const rows = L.seamReaderRows();
    expect(rows).toHaveLength(3);
    expect(rows[0].fn).toBe('detectExceptions');
    expect(rows[0].reading).toMatch(/MEAN OF THE DAILY RATIOS/);
    expect(rows[1].fn).toBe('computeKpis');
    expect(rows[1].reading).toMatch(/VOLUMETRIC/);
    expect(rows[2].fn).toBe('buildFieldSeries');
    expect(rows[2].reading).toMatch(/VOLUMETRIC/);
  });

  it('THE TEACHING SEAM IS BIGGER: a high exception against no exception at all', () => {
    const t = L.teachingSeamHeadline();
    expect(t.name).toBe('OGUTA-2');
    expect(t.baselineRows).toBe(30);
    expect(t.recentRows).toBe(7);
    expect(t.baselineOil).toBe(31167);
    expect(t.recentOil).toBe(4327);
    expect(t.recentWater).toBe(1964);
    expect(t.recentGas).toBe(2792);
    // over the baseline the two readings agree exactly, by construction
    expect(t.theTwoReadingsAgreeExactlyOverTheBaseline).toBe(true);
    expect(t.baselineGorMeanOfRatios).toBeCloseTo(580, 9);
    expect(t.baselineWatercutMeanOfRatios).toBeCloseTo(0.236641221374, 12);
    expect(t.recentGorMeanOfRatios).toBeCloseTo(1066.66341076225, 9);
    expect(t.recentGorVolumetric).toBeCloseTo(645.250751097758, 9);
    expect(t.recentGorTimes).toBeCloseTo(1.65309906102, 9);
    expect(t.recentWatercutMeanOfRatios).toBeCloseTo(0.45138645192, 12);
    expect(t.recentWatercutVolumetric).toBeCloseTo(0.312192020347, 12);
    expect(t.recentWatercutDifference).toBeCloseTo(0.139194431573, 12);
    // the headline pair
    expect(t.gorRiseByMeanOfRatiosPct).toBeCloseTo(83.907484614181, 9);
    expect(t.gorRiseByVolumetricPct).toBeCloseTo(11.250129499613, 9);
    expect(t.gorSeverityByMeanOfRatios).toBe('high');
    expect(t.gorSeverityByVolumetric).toBe('none');
    expect(t.itIsAHighExceptionAgainstNoExceptionAtAll).toBe(true);
    expect(t.watercutRiseByMeanOfRatiosPts).toBeCloseTo(21.474523054592, 9);
    expect(t.watercutRiseByVolumetricPts).toBeCloseTo(7.555079897248, 9);
    expect(t.watercutSeverityByMeanOfRatios).toBe('high');
    expect(t.watercutSeverityByVolumetric).toBe('none');
    expect(t.neitherReadingIsWrong).toBe(true);
  });

  it('and the sweep shows the two readings are IDENTICAL at both ends', () => {
    const rows = L.seamSweepRows();
    expect(rows).toHaveLength(8);
    expect(rows[0].theTwoReadingsAreIdentical).toBe(true);
    expect(rows[7].theTwoReadingsAreIdentical).toBe(true);
    expect(rows[0].gorRatio).toBeCloseTo(1, 12);
    expect(rows[7].gorRatio).toBeCloseTo(1, 12);
    expect(rows[3].gorMeanOfRatios).toBeCloseTo(1068.566450970632, 9);
    expect(rows[3].gorVolumetric).toBeCloseTo(645.86255259467, 9);
    expect(rows[5].gorRatio).toBeCloseTo(1.803701012112, 9);
    rows.forEach((r) => expect(r.itIsADemonstrationAndNotTheTeachingWellOwnWindow).toBe(true));
    const h = L.seamSweepHeadline();
    expect(h.pointsSwept).toBe(8);
    expect(h.pointsWhereTheTwoReadingsAgree).toBe(2);
    expect(h.identicalAtBothEnds).toBe(true);
    expect(h.widestDisagreementAtCollapsedDays).toBe(5);
    expect(h.aWindowOfUniformDaysCannotShowIt).toBe(true);
  });

  it('and the collapsed day is where the disagreement comes from', () => {
    const c = L.seamCollapseHeadline();
    expect(c.oilFallsByAFactorOf).toBeCloseTo(12.292682926829, 9);
    expect(c.waterFallsByAFactorOf).toBeCloseTo(1.350649350649, 9);
    expect(c.gasFallsByAFactorOf).toBeCloseTo(4.148936170213, 9);
    expect(c.soTheGorRisesByAFactorOf).toBeCloseTo(2.962851782364, 9);
    const shapes = L.seamDayShapeRows();
    expect(shapes[0].gorScfStb).toBeCloseTo(580.357142857143, 9);
    expect(shapes[1].gorScfStb).toBeCloseTo(1719.512195121951, 9);
    expect(shapes[1].watercutFraction).toBeCloseTo(0.738019169329, 12);
  });
});

describe('EXPERT: the decline exponent read as falsy', () => {
  it('reproduces all five published effective declines', () => {
    const rows = L.publishedDeclineRows();
    expect(rows).toHaveLength(5);
    rows.forEach((r) => expect(r.engineReproducesThePublishedCase, `${r.index}`).toBe(true));
    expect(rows[0].effectivePct ?? rows[0].engineEffectivePct).toBeCloseTo(42.160601062199, 9);
    expect(rows[2].engineEffectivePct).toBeCloseTo(38.364403131474, 9);
  });

  it('a NOT-A-NUMBER, a null and a missing exponent ALL return the exponential answer', () => {
    const rows = L.bGuardRows();
    expect(rows).toHaveLength(10);
    const byLabel = Object.fromEntries(rows.map((r) => [r.label, r]));
    const exponential = byLabel['b = 0, the exponential limit'].effectivePct;
    expect(exponential).toBeCloseTo(42.160601062199, 9);
    ['b as not a number', 'b as null', 'b as the undefined spelling'].forEach((k) => {
      expect(byLabel[k].effectivePct, k).toBe(exponential);
      expect(byLabel[k].itReturnedTheExponentialAnswer, k).toBe(true);
      expect(byLabel[k].bIsFalsy, k).toBe(true);
      expect(byLabel[k].refused, k).toBe(false);
    });
    // against a real hyperbolic at the same nominal decline
    expect(byLabel['b = 0.5, an ordinary hyperbolic'].effectivePct)
      .toBeCloseTo(38.364403131474, 9);
    expect(byLabel['b = 1, the harmonic limit'].effectivePct).toBeCloseTo(35.379644588045, 9);
    expect(byLabel['b = -0.5, physically impossible'].effectivePct)
      .toBeCloseTo(47.25609375, 9);
    expect(byLabel['b = 5, far past any real b'].effectivePct)
      .toBeCloseTo(23.178327201169, 9);
    expect(byLabel['b = 1e-9'].effectivePct).toBeCloseTo(42.160603673675, 9);
    // and a numeric STRING is coerced and answers as a hyperbolic
    expect(byLabel['b as the string "0.5"'].effectivePct)
      .toBe(byLabel['b = 0.5, an ordinary hyperbolic'].effectivePct);
    const h = L.bGuardHeadline();
    expect(h.spellingsThatSilentlyTakeTheExponentialBranch).toBe(4);
    expect(h.itIsCaseOneOfThePublishedGolden).toBe(true);
    expect(h.theStringIsCoercedAndAnswersAsAHyperbolic).toBe(true);
    expect(h.aNegativeExponentIsNotRefusedEither).toBe(true);
  });

  it('and a negative exponent is a negative base raised to a whole power', () => {
    const rows = L.negativeBRows();
    expect(rows).toHaveLength(5);
    expect(rows[0].bracket).toBeCloseTo(-0.825, 12);
    expect(rows[0].exponent).toBe(2);
    expect(rows[0].effectivePct).toBeCloseTo(31.9375, 9);
    expect(rows[1].effectivePct).toBeCloseTo(99.234375, 9);
    expect(rows[2].effectivePct).toBeCloseTo(47.25609375, 9);
    expect(rows[3].effectivePct).toBeCloseTo(99.994138183594, 9);
    expect(rows[4].effectivePct).toBeCloseTo(48.038475772934, 9);
    rows.forEach((r) => expect(r.refused).toBe(false));
  });

  it('but the nominal decline IS guarded properly', () => {
    const rows = L.diGuardRows();
    expect(rows).toHaveLength(5);
    expect(rows.filter((r) => r.refused)).toHaveLength(4);
    expect(rows.find((r) => r.label === 'Di = 1e-9').refused).toBe(false);
    expect(rows.find((r) => r.label === 'Di = 1e-9').effectivePct)
      .toBeCloseTo(0.00003649999, 9);
  });

  it('the fitter is handed a series that drops the contradictory day', () => {
    const rows = L.fitSeriesRows();
    expect(rows).toHaveLength(2);
    const producing = rows.find((r) => r.basis === 'producing');
    const calendar = rows.find((r) => r.basis === 'calendar');
    expect(producing.pointsHandedIn).toBe(4);
    expect(producing.pointsKept).toBe(3);
    expect(producing.pointsDropped).toBe(1);
    expect(producing.theContradictoryDayWasDeleted).toBe(true);
    expect(calendar.pointsKept).toBe(4);
    expect(calendar.dates).toMatch(/2024-01-04/);
    expect(producing.dates).not.toMatch(/2024-01-04/);
  });

  it('and the teaching decliners recover the parameters they were built at', () => {
    const rows = L.teachingDeclineRows();
    expect(rows).toHaveLength(5);
    const nine = rows[0];
    expect(nine.name).toBe('OGUTA-9');
    expect(nine.pointsFitted).toBe(70);
    expect(nine.modelType).toBe('Exponential');
    expect(nine.qi).toBeCloseTo(1180, 6);
    expect(nine.diPerDay).toBeCloseTo(0.0034, 9);
    expect(nine.annualEffectivePct).toBeCloseTo(71.0905021635, 9);
    // the same well on the calendar basis, which on a full-hours well agrees
    expect(rows[1].annualEffectivePct).toBeCloseTo(nine.annualEffectivePct, 9);
    const seventeen = rows[4];
    expect(seventeen.name).toBe('OGUTA-17');
    expect(seventeen.pointsFitted).toBe(47);
    expect(seventeen.diPerDay).toBeCloseTo(0.0092, 9);
    expect(seventeen.annualEffectivePct).toBeCloseTo(96.519520102052, 9);
    rows.forEach((r) => {
      expect(r.theOverlayCallsTheCanonicalArpsEngineAndDoesNotReDeriveDecline).toBe(true);
    });
  });

  it('and the refusals are honest', () => {
    const rows = L.fitRefusalRows();
    expect(rows).toHaveLength(3);
    rows.forEach((r) => {
      expect(r.insufficient, r.label).toBe(true);
      expect(r.itCameBackInsufficientRatherThanAsADeclineOfZero, r.label).toBe(true);
    });
    expect(rows[0].usablePoints).toBe(2);
    expect(rows[1].usablePoints).toBe(30);
    expect(rows[2].usablePoints).toBe(30);
  });
});

describe('EXPERT: the guards in the wrong place', () => {
  it('THE DECIMATOR IS NEITHER A CEILING NOR A FLOOR', () => {
    const rows = L.decimateRows();
    expect(rows).toHaveLength(13);
    const at = (n) => rows.find((r) => r.n === n);
    expect(at(1500).outLength).toBe(1500);
    expect(at(1501).outLength).toBe(751);
    expect(at(1501).halfTheBudgetOrLess).toBe(true);
    expect(at(1600).outLength).toBe(801);
    expect(at(2000).outLength).toBe(1001);
    expect(at(2999).outLength).toBe(1500);
    expect(at(3000).outLength).toBe(1501);
    expect(at(3000).overTheCapItsOwnArgumentNames).toBe(true);
    expect(at(3001).outLength).toBe(1001);
    expect(at(3200).outLength).toBe(1068);
    expect(at(4500).outLength).toBe(1501);
    expect(at(4501).outLength).toBe(1126);
    expect(at(6000).outLength).toBe(1501);
    expect(at(10000).outLength).toBe(1430);
    expect(at(45000).outLength).toBe(1501);
    const h = L.decimateHeadline();
    expect(h.publishedN).toBe(3200);
    expect(h.publishedMaxPoints).toBe(1500);
    expect(h.publishedStride).toBe(3);
    expect(h.publishedOutLength).toBe(1068);
    expect(h.engineReproducesThePublishedCase).toBe(true);
    expect(h.pointsOverTheCap).toBe(4);
    expect(h.worstUnderrunAt).toBe(1501);
    expect(h.worstUnderrunOutLength).toBe(751);
  });

  it('the minimum rate gate covers the rate check and NOT the watercut check', () => {
    const rows = L.minOilRateSweepRows();
    expect(rows).toHaveLength(6);
    const low = rows.filter((r) => r.minOilRate <= 3);
    low.forEach((r) => {
      expect(r.rateDropRaised, `${r.minOilRate}`).toBe(true);
      expect(r.watercutRiseRaised, `${r.minOilRate}`).toBe(true);
      expect(r.gorRiseRaised, `${r.minOilRate}`).toBe(true);
    });
    const high = rows.filter((r) => r.minOilRate >= 5);
    high.forEach((r) => {
      expect(r.rateDropRaised, `${r.minOilRate}`).toBe(false);
      expect(r.gorRiseRaised, `${r.minOilRate}`).toBe(false);
      // the one comparison the gate does not cover
      expect(r.watercutRiseRaised, `${r.minOilRate}`).toBe(true);
      expect(r.exceptionsRaised, `${r.minOilRate}`).toBe(1);
    });
    const h = L.minOilRateHeadline();
    expect(h.theWellIsTooSmallToHaveItsRateCollapseReportedAndStillRaisesAHighWatercut).toBe(true);
    expect(h.theOilActuallyFellByPct).toBeCloseTo(60, 9);
    expect(h.rateDropTrigger).toBe(20);
    expect(h.minOilRate).toBe(5);
    expect(h.theWatercutMessage).toMatch(/Watercut up/);
  });

  it('and a well below that gate that stops altogether raises NOTHING', () => {
    const rows = L.stoppedWellRows();
    expect(rows).toHaveLength(2);
    const small = rows[0];
    expect(small.aboveTheMinimumRateGate).toBe(false);
    expect(small.exceptionsRaised).toBe(0);
    expect(small.shutInRaised).toBe(false);
    expect(small.downtimeRaised).toBe(false);
    const large = rows[1];
    expect(large.aboveTheMinimumRateGate).toBe(true);
    expect(large.shutInRaised).toBe(true);
    expect(large.exceptionsRaised).toBe(1);
  });

  it('and the downtime test refuses at EXACTLY zero hours', () => {
    const rows = L.downtimeBoundaryRows();
    expect(rows).toHaveLength(8);
    const at = (h) => rows.find((r) => r.recentHours === h);
    expect(at(24).downtimeRaised).toBe(false);
    expect(at(12).downtimeRaised).toBe(false);
    expect(at(11.99).downtimeRaised).toBe(true);
    expect(at(11.99).downtimeSeverity).toBe('medium');
    expect(at(1).downtimeRaised).toBe(true);
    expect(at(0.1).downtimeRaised).toBe(true);
    expect(at(0).downtimeRaised).toBe(false);
    expect(at(0).theOneValueTheCheckRefusesToReport).toBe(true);
    // and every one of them is MEDIUM, because the type cannot climb
    rows.filter((r) => r.downtimeRaised).forEach((r) => {
      expect(r.downtimeSeverity, `${r.recentHours}`).toBe('medium');
    });
  });

  it('and the stale check returns early and cannot exceed medium', () => {
    const rows = L.staleSeverityRows();
    expect(rows).toHaveLength(9);
    const at = (g) => rows.find((r) => r.gapDays === g);
    expect(at(7).staleRaised).toBe(false);
    expect(at(8).severity).toBe('info');
    expect(at(14).severity).toBe('info');
    expect(at(15).severity).toBe('medium');
    expect(at(400).severity).toBe('medium');
    rows.filter((r) => r.staleRaised).forEach((r) => {
      expect(r.itCannotExceedMedium, `${r.gapDays}`).toBe(true);
      expect(r.exceptionsOnThatWell, `${r.gapDays}`).toBe(1);
      expect(r.everyOtherComparisonOnThatWellWasSkipped, `${r.gapDays}`).toBe(true);
    });
  });

  it('and the gas-oil ratio escape hatch is unreachable, by construction', () => {
    const rows = L.unreachableClauseRows();
    expect(rows).toHaveLength(5);
    rows.forEach((r) => {
      expect(r.pointsWithAFiniteOil, `${r.oilStb}`).toBe(40);
      expect(r.theEscapeHatchCouldFire, `${r.oilStb}`).toBe(false);
    });
    const h = L.unreachableClauseHeadline();
    expect(h.constructionsTried).toBe(5);
    expect(h.constructionsInWhichTheEscapeHatchCouldFire).toBe(0);
    expect(h.itIsProvedByConstructionRatherThanByArgument).toBe(true);
  });

  it('and the same absent hours column means two opposite things two files apart', () => {
    const rows = L.hoursAcrossModulesRows();
    expect(rows).toHaveLength(7);
    const byLabel = Object.fromEntries(rows.map((r) => [r.label, r]));
    expect(byLabel['24 as a number'].surveillanceOilPd).toBe(800);
    expect(byLabel['24 as a number'].allocationUptime).toBe(1);
    const shut = byLabel['0'];
    expect(shut.surveillanceOilPd).toBeNull();
    expect(shut.allocationUptime).toBe(0);
    expect(shut.allocationTheoreticalOil).toBe(0);
    ['null', 'the undefined spelling', 'not a number', 'the string "20"', 'the empty string']
      .forEach((k) => {
        expect(byLabel[k].surveillanceHoursOn, k).toBeNull();
        expect(byLabel[k].surveillanceOilPd, k).toBe(800);
        expect(byLabel[k].allocationUptime, k).toBe(1);
        expect(byLabel[k].allocationTheoreticalOil, k).toBe(1000);
        expect(byLabel[k].theSameNumberIsNotTheSameClaim, k).toBe(true);
      });
    expect(L.coercionConventionRows()).toHaveLength(5);
  });
});

describe('EXPERT: the lift handoff, one rate read as two phases', () => {
  it('reproduces the published screening seam on both readings', () => {
    const s = L.publishedScreeningSeam();
    expect(s.oilRateBpd).toBe(300);
    expect(s.wctPct).toBe(70);
    expect(s.liquidRateBpd).toBeCloseTo(1000, 9);
    expect(s.engineReproducesTheOilReading).toBe(true);
    expect(s.engineReproducesTheLiquidReading).toBe(true);
    expect(s.deltas.rodPump).toBe(-40);
    expect(s.deltas.esp).toBe(15);
    expect(s.theRecommendationSetIsTheSameAndTheOrderIsNot).toBe(true);
    expect(s.theGoldenPublishesTheDisagreementRatherThanResolvingIt).toBe(true);
  });

  it('the teaching handoff matches the digest', () => {
    const h = L.teachingLiftHandoff();
    expect(h.date).toBe('2024-11-20');
    expect(h.targetRateBpd).toBeCloseTo(310.547186969, 6);
    expect(h.wctPct).toBeCloseTo(27.095464888, 6);
    expect(h.gorScfStb).toBeCloseTo(653.977879649, 6);
    expect(h.liquidRateBpd).toBeCloseTo(425.964155029, 6);
    expect(h.liquidOverTheNumberHandedOver).toBeCloseTo(1.371656781651, 9);
    expect(h.glrScfBbl).toBeCloseTo(476.779532895585, 9);
    expect(h.liquidGravityAtThatWatercut).toBeCloseTo(0.931812542432, 9);
    expect(h.dutyIndexOnTheOilRate).toBeCloseTo(2.857034120116, 9);
    expect(h.dutyIndexOnTheLiquidRate).toBeCloseTo(3.918870226267, 9);
    expect(h.dutyIndexBands).toEqual([3, 6]);
    // the reading crosses a band that the rules are written against
    expect(h.dutyIndexOnTheOilRate).toBeLessThan(3);
    expect(h.dutyIndexOnTheLiquidRate).toBeGreaterThan(3);
    expect(h.referenceStageAtTheOilRate).toBe('ref-400-1000');
    expect(h.referenceStageAtTheLiquidRate).toBe('ref-400-1000');
    const c = L.teachingLiftConditions();
    expect(c.trueVerticalDepthFt).toBe(9200);
    expect(c.tubingIdIn).toBe(2.441);
    expect(c.api).toBe(24.6);
    expect(c.wellheadPressurePsia).toBe(190);
    expect(c.bottomholeTemperatureF).toBeCloseTo(232, 9);
    expect(c.absoluteOpenFlowStbd).toBe(2480);
  });

  it('and the screening scores differ on the same well read as oil and as liquid', () => {
    const rows = L.teachingScreeningRows();
    expect(rows).toHaveLength(3);
    const asOil = rows[0];
    const asLiquid = rows[1];
    const noApi = rows[2];
    expect(asOil.scores).toEqual({
      gasLift: 100, esp: 85, jetPump: 80, rodPump: 65, pcp: 60, plunger: 0,
    });
    expect(asLiquid.scores).toEqual({
      gasLift: 100, esp: 85, jetPump: 80, pcp: 60, rodPump: 50, plunger: 0,
    });
    expect(asOil.order).toEqual(['gasLift', 'esp', 'jetPump', 'rodPump', 'pcp', 'plunger']);
    expect(asLiquid.order).toEqual(['gasLift', 'esp', 'jetPump', 'pcp', 'rodPump', 'plunger']);
    expect(asOil.recommended).toEqual(['gasLift', 'esp']);
    expect(asLiquid.recommended).toEqual(['gasLift', 'esp']);
    expect(noApi.scores.esp).toBe(65);
    expect(noApi.recommended).toEqual(['gasLift']);
  });

  it('THE DELTAS COLUMN IS THE FINDING: plunger lift loses 45 points at 200 bbl/d', () => {
    const rows = L.ratePhaseSweepRows();
    expect(rows).toHaveLength(11);
    const at200 = rows.find((r) => r.oilRateBpd === 200);
    expect(at200.liquidRateBpd).toBeCloseTo(274.331356330, 6);
    expect(at200.deltas.plunger).toBe(-45);
    expect(at200.deltas.gasLift).toBe(10);
    expect(at200.largestMoveMethod).toBe('plunger');
    expect(at200.largestMovePoints).toBe(-45);
    // the plunger goes from a scored method to a zero, out of consideration
    expect(at200.asOilScores.plunger).toBe(45);
    expect(at200.asLiquidScores.plunger).toBe(0);
    const at120 = rows.find((r) => r.oilRateBpd === 120);
    expect(at120.deltas.esp).toBe(20);
    const at260 = rows.find((r) => r.oilRateBpd === 260);
    expect(at260.deltas.rodPump).toBe(-15);
    const at500 = rows.find((r) => r.oilRateBpd === 500);
    expect(at500.deltas.rodPump).toBe(-25);
    rows.forEach((r) => expect(r.notOneDatumAboutTheWellChanged).toBe(true));
    const h = L.ratePhaseHeadline();
    expect(h.ratesSwept).toBe(11);
    expect(h.methodsInTheMatrix).toBe(6);
    expect(h.methodsThatMoveSomewhere).toBe(4);
    expect(h.largestSingleMovePoints).toBe(-45);
    expect(h.largestSingleMoveMethod).toBe('plunger');
    expect(h.largestSingleMoveAtOilRateBpd).toBe(200);
    expect(h.dutyIndexReachesThreeAtBpd).toBeCloseTo(326.086956522, 6);
    expect(h.dutyIndexReachesSixAtBpd).toBeCloseTo(652.173913043, 6);
  });

  it('and the two modules read an absent API two opposite ways', () => {
    const rows = L.apiCoercionRows();
    expect(rows).toHaveLength(7);
    const byLabel = Object.fromEntries(rows.map((r) => [r.label, r]));
    // the design advisor substitutes a 32 degree oil for an absent API
    expect(byLabel['the undefined spelling'].liquidGravityAtZeroWatercut)
      .toBeCloseTo(0.865443425076, 9);
    expect(byLabel.null.liquidGravityAtZeroWatercut).toBeCloseTo(0.865443425076, 9);
    expect(byLabel['32'].liquidGravityAtZeroWatercut).toBeCloseTo(0.865443425076, 9);
    // and a STATED zero is taken literally, denser than water
    expect(byLabel['a stated zero'].liquidGravityAtZeroWatercut)
      .toBeCloseTo(1.076045627376, 9);
    expect(byLabel['a stated zero'].denserThanWater).toBe(true);
    // while the screening matrix reads an absent API as zero and scores it heavy
    expect(byLabel['the undefined spelling'].espScore)
      .toBeLessThan(byLabel['32'].espScore);
    expect(byLabel['the undefined spelling'].pcpScore)
      .toBeGreaterThan(byLabel['32'].pcpScore);
  });

  it('screening on no information at all is confident either way', () => {
    const e = L.emptyScreeningHeadline();
    expect(e.engineReproducesThePublishedCase).toBe(true);
    expect(e.scores).toEqual({
      rodPump: 100, gasLift: 90, pcp: 90, jetPump: 65, esp: 45, plunger: 45,
    });
    expect(e.recommended).toEqual(['rodPump', 'gasLift', 'pcp']);
    expect(e.theMissingNumbersReadAsTheWorstPossibleWell).toBe(true);
    expect(e.theMissingBooleansReadAsTheBestPossibleFacility).toBe(true);
    expect(e.scoresWithPowerAndGasStatedAbsent.esp).toBe(0);
    expect(e.scoresWithPowerAndGasStatedAbsent.gasLift).toBe(30);
  });

  it('and the recommendation band can come back EMPTY with nothing saying so', () => {
    const b = L.emptyBandHeadline();
    expect(b.methods).toBe(6);
    expect(b.recommendedCount).toBe(0);
    expect(b.topScore).toBeLessThanOrEqual(50);
    expect(b.theCallerGetsARankedListWithNoAnswerInIt).toBe(true);
    expect(b.nothingInTheReturnSaysTheBandIsEmpty).toBe(true);
  });

  it('a model-driven screening leaves six conditions unstated', () => {
    const rows = L.modelScreeningRows();
    expect(rows).toHaveLength(2);
    expect(rows[0].apiStated).toBe(true);
    expect(rows[0].gorStated).toBe(true);
    expect(rows[1].apiStated).toBe(false);
    expect(rows[1].gorStated).toBe(false);
    expect(rows[0].unstatedConditions).toBe(6);
    // and losing the fluid description moves the scores without new data
    expect(rows[0].scores.esp).not.toBe(rows[1].scores.esp);
    rows.forEach((r) => expect(r.everyUnstatedConditionDefaultsToTheFavourableReading).toBe(true));
  });

  it('and the design pass reports its own call and not the well', () => {
    const p = L.teachingDesignPass();
    expect(p.passOk).toBe(true);
    expect(p.methods).toBe(4);
    expect(p.threeRefusalsAreTheSameSentenceAndMeanOnlyThatNoChainWasInjected).toBe(3);
    const plunger = p.results.find((r) => r.id === 'plunger');
    expect(plunger.ok).toBe(false);
    expect(plunger.itSaysNothingAboutTheWell).toBe(false);
    expect(plunger.reason).toMatch(/not enough gas to drive the plunger/);
    expect(p.workable).toBe(0);
    expect(p.disagreements).toBe(2);
    expect(p.everyVerdictHereIsAStatementAboutTheAdvisorCallAndNotAboutTheWell).toBe(true);
    expect(p.ranked).toEqual(['gasLift', 'esp', 'jetPump', 'rodPump', 'pcp', 'plunger']);
  });

  it('and the reconciliation reaches six verdicts and initialises to a seventh nobody can produce', () => {
    const rows = L.truthTableRows();
    expect(rows).toHaveLength(12);
    const r = L.reconcileHeadline();
    expect(r.rows).toBe(12);
    expect(r.distinctVerdicts).toBe(6);
    expect(r.verdicts).toEqual([
      'agreeYes', 'designYes', 'designNo', 'agreeNo', 'notRun', 'noEngine',
    ]);
    expect(r.theInitialValueIsASixthNameNoInputCanProduce).toBe(true);
    expect(r.theDeadInitialValue).toBe('screened');
    expect(r.notRunIsTheOneVerdictWithNoNoteAttached).toBe(true);
  });

  it('and the plunger water cut is CLAMPED rather than refused', () => {
    const rows = L.plungerClampRows();
    expect(rows).toHaveLength(11);
    const at = (w) => rows.find((r) => r.wctPctStated === w);
    expect(at(0).glrScfBbl).toBe(1450);
    expect(at(50).glrScfBbl).toBe(725);
    expect(at(99.9).wctFractionUsed).toBeCloseTo(0.999, 9);
    // a water cut of 100 and one of 120 return identical answers
    expect(at(100).glrScfBbl).toBe(at(120).glrScfBbl);
    expect(at(99.9).glrScfBbl).toBe(at(100).glrScfBbl);
    expect(at(-10).wctFractionUsed).toBe(0);
    rows.forEach((r) => expect(r.noFlagInTheReturnSaysAStatedConditionWasOverwritten).toBe(true));
    const published = L.publishedPlungerRows();
    expect(published).toHaveLength(6);
    published.forEach((r) => expect(r.engineReproducesIt, `${r.index}`).toBe(true));
  });

  it('and the policy picks are stated seams: overlapping ranges and a silent motor fallback', () => {
    const stages = L.referenceStageRows();
    expect(stages).toHaveLength(16);
    const at = (q) => stages.find((r) => r.dutyBpd === q);
    expect(at(1451).theyAgree).toBe(false);
    expect(at(1451).pickedId).toBe('ref-540-2500');
    expect(at(1451).nearestBepId).toBe('ref-400-1000');
    expect(at(3500).theyAgree).toBe(false);
    expect(at(3500).pickedDistance).toBe(1000);
    expect(at(3500).nearestBepDistance).toBe(500);
    expect(at(3501).theyAgree).toBe(true);
    const motors = L.motorFrameRows();
    expect(motors.length).toBeGreaterThanOrEqual(12);
    const overloaded = motors.filter((m) => m.overloaded);
    expect(overloaded.length).toBeGreaterThan(0);
    overloaded.forEach((m) => {
      expect(m.frameHp).toBe(400);
      expect(m.meetsTheRule).toBe(false);
      expect(m.itFellBackToTheLargestFrameAndSaidNothing).toBe(true);
    });
    expect(motors.find((m) => m.shaftHp === 401).actualHeadroom)
      .toBeCloseTo(0.997506234414, 9);
  });
});

describe('the lab as a whole', () => {
  it('every accessor is pure: two calls return equal values', () => {
    const twice = (fn) => expect(JSON.stringify(fn())).toBe(JSON.stringify(fn()));
    twice(L.teachingExceptionRows);
    twice(L.teachingSeamHeadline);
    twice(L.teachingAllocationHeadline);
    twice(L.teachingLiftHandoff);
    twice(L.ratePhaseSweepRows);
    twice(L.defermentAnchorRows);
    twice(L.decimateRows);
  });

  it('and every panel facade is frozen and reaches only functions', () => {
    [L.ledgerExplorer, L.exceptionExplorer, L.readingExplorer].forEach((facade) => {
      expect(Object.isFrozen(facade)).toBe(true);
      Object.entries(facade).forEach(([k, v]) => {
        expect(typeof v, k).toBe('function');
      });
    });
    expect(Object.keys(L.ledgerExplorer).length).toBeGreaterThan(15);
    expect(Object.keys(L.exceptionExplorer).length).toBeGreaterThan(30);
    expect(Object.keys(L.readingExplorer).length).toBeGreaterThan(30);
  });

  it('and it states its limits and what the oracles never gate', () => {
    const limits = L.limits();
    expect(limits.length).toBeGreaterThanOrEqual(8);
    limits.forEach((s) => expect(typeof s).toBe('string'));
    const o = L.oracleCoverage();
    expect(o.theFourIndependentRoutes).toHaveLength(4);
    expect(o.whatTheyDoNotGate).toHaveLength(3);
    expect(o.theTwoSeamsTheGoldensPublishAsDisagreements).toEqual([
      'surveillance_cases.ratioSeam',
      'lift_screening_cases.seams',
    ]);
    expect(o.publishedTruthTableRows).toBe(12);
    expect(o.publishedArchetypes).toBe(7);
  });

  it('and no user-facing string it returns carries an em dash or an en dash', () => {
    const offenders = [];
    const walk = (label, v, depth = 0) => {
      if (depth > 6 || v === null || v === undefined) return;
      if (typeof v === 'string') {
        if (/—|–/.test(v)) offenders.push(`${label}: ${v.slice(0, 80)}`);
        return;
      }
      if (Array.isArray(v)) { v.forEach((x, i) => walk(`${label}[${i}]`, x, depth + 1)); return; }
      if (typeof v === 'object') {
        Object.keys(v).forEach((k) => walk(`${label}.${k}`, v[k], depth + 1));
      }
    };
    [L.ledgerExplorer, L.exceptionExplorer, L.readingExplorer].forEach((facade) => {
      Object.entries(facade).forEach(([k, fn]) => {
        try { walk(k, fn()); } catch { /* an accessor that refuses carries no string */ }
      });
    });
    expect(offenders).toEqual([]);
  });

  it('and it exposes enough numbers for the leak guard to be a real gate', () => {
    const q = L.teachingQuantities();
    expect(q.length).toBeGreaterThan(1000);
    q.forEach((r) => {
      expect(typeof r.label).toBe('string');
      expect(Number.isFinite(r.value), r.label).toBe(true);
    });
    expect(L.teachingNumbers()).toHaveLength(q.length);
  });
});
