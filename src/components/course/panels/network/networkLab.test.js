// WHAT THE PD7 PANELS AND THE 78 LESSONS ARE ALLOWED TO SAY.
//
// Every accessor in networkLab.js is pinned here against the published
// goldens, the fixtures the shipped gate asserts on, and the wave's own
// teaching digest. A lesson quotes a number, a panel prints it and this file
// is what stops the two drifting apart when the engine moves.
//
// THE RULE THIS FILE ENFORCES ABOVE ALL OTHERS is the wave's own: a
// `solveNetwork` answer and a `checkConservation` verdict on that same answer
// are DIFFERENT ROADS, and the second is the only one that can see the first's
// error. So there is a structural test near the bottom that walks every
// accessor exposing a `converged` flag and fails if the conservation gap is
// not on the same object. A panel that could show a converged flag on its own
// is the defect this whole course is about.

import { describe, it, expect } from 'vitest';
import * as L from './networkLab.js';

const near = (a, b, digits = 6) => expect(a).toBeCloseTo(b, digits);

describe('SECTION 1: the pipe table, and the redundancy that is its only self check', () => {
  it('carries twelve rows, each with the outside diameter, the wall AND the bore', () => {
    const rows = L.pipeScheduleRows();
    expect(rows).toHaveLength(12);
    rows.forEach((r) => {
      expect(r.provenance).toBe('published');
      expect(r.odIn).toBeGreaterThan(r.publishedBoreIn);
      expect(r.insideGateBand).toBe(true);
    });
  });

  it('and ONE row already fails the module header own statement, run as equality', () => {
    const rows = L.pipeScheduleRows();
    const failing = rows.filter((r) => !r.strictEqualityHolds);
    expect(failing).toHaveLength(1);
    expect(failing[0].nps).toBe(6);
    expect(failing[0].schedule).toBe('40');
    expect(failing[0].residualIn).toBeCloseTo(-8.8818e-16, 20);
    expect(failing[0].publishedBoreIn).toBe(6.065);
    expect(failing[0].odMinusTwoWallsIn).toBe(6.0649999999999995);
  });

  it('the gate band is wider than anything the table needs, by eleven orders', () => {
    const c = L.pipeTableSelfCheck();
    expect(c.rowCount).toBe(12);
    expect(c.rowsFailingStrictEquality).toBe(1);
    expect(c.gateBandIn).toBe(5e-4);
    expect(c.largestResidualNps).toBe(6);
    near(c.bandOverLargestResidual / 1e11, 5.6295, 3);
    // and a REAL transcription error, four ten-thousandths of an inch, walks
    // straight through it: that is the size of the hole
    expect(c.typoBoreIn).toBe(6.0654);
    expect(c.typoPassesTheGate).toBe(true);
    expect(c.thereIsNoPythonOracleForThisTable).toBe(true);
  });

  it('a heavier schedule is a thicker wall and a smaller bore on the same outside diameter', () => {
    const rows = L.schedulePairRows();
    expect(rows.map((r) => r.nps)).toEqual([2, 4, 6, 8]);
    rows.forEach((r) => {
      expect(r.odIsTheSame).toBe(true);
      expect(r.wall80In).toBeGreaterThan(r.wall40In);
      expect(r.bore80In).toBeLessThan(r.bore40In);
    });
    const two = rows.find((r) => r.nps === 2);
    near(two.boreLostIn, 0.128, 6);
    near(two.flowAreaLostPct, 12.001622, 6);
    const six = rows.find((r) => r.nps === 6);
    near(six.boreLostIn, 0.304, 6);
    near(six.flowAreaLostPct, 9.773494, 6);
  });

  it('a size that is not in the table returns null rather than a nearby one', () => {
    const r = L.scheduleRefusals();
    expect(r).toHaveLength(2);
    r.forEach((x) => expect(x.isNull).toBe(true));
  });
});

describe('SECTION 2: what a wall can hold, and the design factor that is an input', () => {
  it('the gate case rates at 3164.739623 psi and its bare hoop is not a rating', () => {
    const b = L.publishedBarlow();
    near(b.ratingPsi, 3164.739623, 6);
    near(b.bareHoopPsi, 4395.471698, 6);
    near(b.bareOverRated, 1.388889, 6);
    expect(b.designFactor).toBe(0.72);
    expect(b.yieldPsi).toBe(52000);
    expect(b.aBareHoopIsNotARating).toBe(true);
  });

  it('it is linear in the wall and in the yield, and inverse in the diameter', () => {
    const rows = L.barlowScalingRows();
    near(rows[1].ratingPsi, 6329.479245, 6);
    near(rows[1].ratioToPublished, 2, 9);
    near(rows[2].ratingPsi, 1582.369811, 6);
    near(rows[2].ratioToPublished, 0.5, 9);
  });

  it('every grade the module ships, at the gate design factor', () => {
    const rows = L.barlowGradeRows();
    expect(rows).toHaveLength(5);
    near(rows.find((r) => r.gradeId === 'gradeB').ratingPsi, 2130.113208, 6);
    near(rows.find((r) => r.gradeId === 'x42').ratingPsi, 2556.135849, 6);
    near(rows.find((r) => r.gradeId === 'x52').ratingPsi, 3164.739623, 6);
    near(rows.find((r) => r.gradeId === 'x60').ratingPsi, 3651.622642, 6);
    near(rows.find((r) => r.gradeId === 'x65').ratingPsi, 3955.924528, 6);
    expect(rows.filter((r) => r.published)).toHaveLength(1);
  });

  it('an unknown grade id resolves to a not-a-number and never to a default', () => {
    const rows = L.gradeRows();
    const bad = rows.find((r) => r.id === 'x55');
    expect(bad.resolved).toBe(false);
    expect(Number.isNaN(bad.yieldPsi)).toBe(true);
  });

  it('the teaching line is a second rating that is not the gate case', () => {
    const t = L.teachingLineDefinition();
    expect(t.teaching).toBe(true);
    expect(t.nps).toBe(8);
    expect(t.schedule).toBe('80');
    expect(t.boreIn).toBe(7.625);
    near(t.ratingPsi, 5426.086957, 6);
    near(t.bareHoopPsi, 7536.231884, 6);
  });

  it('and the design factor alone moves it, which is its whole regulatory content', () => {
    const rows = L.barlowDesignFactorRows();
    near(rows.find((r) => r.designFactor === 0.4).ratingPsi, 3014.492754, 6);
    near(rows.find((r) => r.designFactor === 0.5).ratingPsi, 3768.115942, 6);
    near(rows.find((r) => r.designFactor === 0.72).ratingPsi, 5426.086957, 6);
    near(rows.find((r) => r.designFactor === 0.8).ratingPsi, 6028.985507, 6);
    near(rows.find((r) => r.designFactor === 1).ratingPsi, 7536.231884, 6);
    expect(rows.find((r) => r.designFactor === 1).noDesignFactorAtAll).toBe(true);
  });

  it('and it refuses what it cannot compute, as a bare not-a-number', () => {
    L.barlowRefusals().forEach((r) => expect(r.isNaN).toBe(true));
  });
});

describe('SECTION 3: fittings as a length of pipe', () => {
  it('the gate case: sum K of 1.5 is 42.118056 ft on a 6.065 in bore at f 0.018', () => {
    const p = L.publishedEquivalentLength();
    near(p.sumK, 1.5, 12);
    near(p.roughLengthFt, 42.118056, 6);
    near(p.roughDiametersOfPipe, 83.333333, 6);
    near(p.smoothLengthFt, 63.177083, 6);
    near(p.smoothOverRough, 1.5, 9);
    expect(p.theBetterPipeScoresTheLongerLength).toBe(true);
  });

  it('a fixed diameters count is a friction factor in disguise, and thirty means 0.05', () => {
    const r = L.thirtyDiametersRule();
    near(r.sumK, 1.5, 12);
    // the count is sum(K) / f and nothing else
    near(r.impliedFrictionFactorWholeList, 0.05, 12);
    near(r.diametersAtFrictionFactorPointOhTwo, 75, 9);
    near(r.wholeListLengthFt, 15.1625, 6);
    near(r.engineLengthFt, 42.118056, 6);
    // and the bias changes SIGN with the reading, so a lesson has to say which
    expect(r.fittingCount).toBe(6);
    expect(r.perFittingDiameters).toBe(180);
    expect(r.wholeListUnderstatesByFactor).toBeGreaterThan(2.7);
    expect(r.perFittingOverstatesByFactor).toBeGreaterThan(2);
    expect(r.theBiasChangesSignWithTheReading).toBe(true);
  });

  it('friction factor alone, on the published fitting count and bore', () => {
    const rows = L.equivalentLengthFrictionRows();
    near(rows.find((r) => r.frictionFactor === 0.010).lengthFt, 75.8125, 6);
    near(rows.find((r) => r.frictionFactor === 0.010).diametersOfPipe, 150, 6);
    near(rows.find((r) => r.frictionFactor === 0.018).lengthFt, 42.118056, 6);
    near(rows.find((r) => r.frictionFactor === 0.020).diametersOfPipe, 75, 6);
    near(rows.find((r) => r.frictionFactor === 0.030).lengthFt, 25.270833, 6);
    expect(rows.filter((r) => r.published)).toHaveLength(1);
  });

  it('bore alone, on the published fitting count and friction factor', () => {
    const rows = L.equivalentLengthBoreRows();
    near(rows.find((r) => r.nps === 2).lengthFt, 14.354167, 6);
    near(rows.find((r) => r.nps === 4).lengthFt, 27.958333, 6);
    near(rows.find((r) => r.nps === 6).lengthFt, 42.118056, 6);
    near(rows.find((r) => r.nps === 8).lengthFt, 55.423611, 6);
    near(rows.find((r) => r.nps === 16).lengthFt, 104.166667, 6);
  });

  it('one globe valve is worth more than everything else on the teaching list together', () => {
    const rows = L.teachingFittingRows();
    near(rows[0].totalSumK, 14.45, 9);
    near(rows[0].totalLengthFt, 540.104167, 6);
    const globe = rows.find((r) => r.id === 'globeValve');
    near(globe.sumK, 10, 9);
    near(globe.sharePct, 69.204152, 6);
    near(globe.lengthFt, 373.774510, 6);
    const h = L.teachingFittingHeadline();
    expect(h.worstId).toBe('globeValve');
    expect(h.oneValveOutweighsTheRest).toBe(true);
    near(h.everythingElseSumK, 4.45, 9);
  });

  it('an unknown fitting id resolves to NaN, and the length refuses with a reason', () => {
    const rows = L.fittingRows();
    expect(Number.isNaN(rows.find((r) => r.id === 'elbow90').k)).toBe(true);
    expect(rows.find((r) => r.id === 'elbow90LR').k).toBe(0.3);
    expect(Number.isNaN(L.roughnessRows().find((r) => r.id === 'nonsense').roughnessIn)).toBe(true);
    const refusals = L.equivalentLengthRefusals();
    expect(refusals[0].ok).toBe(false);
    expect(refusals[0].error).toMatch(/No resistance coefficient for reducer/);
    expect(refusals[1].ok).toBe(false);
    expect(refusals[1].error).toMatch(/needs a bore and a friction factor/);
  });
});

describe('SECTION 4: three node kinds, and eleven refusals that are refusals', () => {
  it('names the three kinds the module accepts and nothing else', () => {
    expect(L.NODE_KINDS).toEqual(['well', 'junction', 'sink']);
    expect(L.NODE_KIND_NOTES.map((n) => n.kind)).toEqual(['well', 'junction', 'sink']);
  });

  it('refuses eleven distinct malformed networks, each with a reason', () => {
    const rows = L.topologyRefusals();
    expect(rows).toHaveLength(11);
    rows.forEach((r) => {
      expect(r.ok, r.label).toBe(false);
      expect(typeof r.error, r.label).toBe('string');
      expect(r.error.length, r.label).toBeGreaterThan(10);
    });
    expect(rows[0].error).toMatch(/Manifold B/);
    expect(rows[0].error).toMatch(/no route to a delivery point/);
    expect(rows[1].error).toMatch(/delivery point/);
    expect(rows[2].error).toMatch(/needs a pressure/);
    expect(rows[3].error).toMatch(/at least one well/);
    expect(rows[7].error).toMatch(/K-1/);
  });

  it('and the teaching network is INDEXED rather than copied, with seven unknowns', () => {
    const t = L.teachingTopology();
    expect(t.ok).toBe(true);
    expect(t.nodeCount).toBe(8);
    expect(t.branchCount).toBe(8);
    expect(t.unknownCount).toBe(7);
    expect(t.sinkCount).toBe(1);
    expect(t.unknownIds).toEqual(['t1', 't2', 't3', 't4', 'ha', 'hb', 'hc']);
    expect(t.nodes.find((n) => n.id === 'ha').branchCount).toBe(5);
    expect(t.nodes.find((n) => n.id === 'hb').branchCount).toBe(3);
    expect(t.nodes.find((n) => n.id === 'hc').branchCount).toBe(3);
    expect(t.nodes.find((n) => n.id === 'sep').branchCount).toBe(1);
    expect(t.nodes.filter((n) => n.kind === 'well')).toHaveLength(4);
  });
});

describe('SECTION 5: the one case with a closed form, and the only check with no tolerance', () => {
  it('Newton and the matrix inverse agree, and at two nodes they agree EXACTLY', () => {
    const rows = L.linearStarRows();
    expect(rows).toHaveLength(4);
    const w1 = rows.find((r) => r.id === 'w1');
    near(w1.exactPressurePsia, 546.666666667, 6);
    expect(w1.agreesExactly).toBe(true);
    expect(w1.newtonMinusExactPsia).toBe(0);
    const w2 = rows.find((r) => r.id === 'w2');
    expect(Math.abs(w2.newtonMinusExactPsia)).toBeLessThan(1e-12);
    const h = rows.find((r) => r.id === 'h');
    near(h.exactPressurePsia, 252.222222222, 6);
    expect(Math.abs(h.newtonMinusExactPsia)).toBeLessThan(1e-12);
    const s = rows.find((r) => r.id === 's');
    expect(s.exactPressurePsia).toBe(150);
    expect(s.agreesExactly).toBe(true);
    // two nodes agree to the last BIT, which no tolerance was involved in
    expect(rows.filter((r) => r.agreesExactly).length).toBeGreaterThanOrEqual(2);
  });

  it('and both agree with the independent bisection oracle, which is a THIRD road', () => {
    const rows = L.linearStarRows();
    rows.forEach((r) => {
      expect(Math.abs(r.newtonMinusOraclePsia), r.id).toBeLessThan(1e-8);
    });
    near(rows.find((r) => r.id === 'w1').goldenPressurePsia, 546.666666666, 6);
  });

  it('Newton is exact on a linear system, so it takes two steps and not a hundred', () => {
    const s = L.linearStarSummary();
    expect(s.iterations).toBe(2);
    expect(s.converged).toBe(true);
    expect(s.iterations).toBeLessThanOrEqual(3);
    expect(s.worstRelDiffAgainstTheClosedForm).toBeLessThan(1e-12);
    expect(s.thisIsTheOnlyCheckWithNoToleranceInIt).toBe(true);
  });

  it('and the audit closes on it, which is what the rest of the course does not do', () => {
    const s = L.linearStarSummary();
    expect(Math.abs(s.reportedResidualLbD)).toBeLessThan(1e-10);
    expect(Math.abs(s.conservationGapLbD)).toBeLessThan(1e-10);
    near(s.producedLbD, 40888.888888889, 6);
    expect(s.conservationRelative).toBeLessThan(1e-12);
    expect(s.massBalanceCloses).toBe(true);
    expect(s.pinned).toEqual([]);
  });

  it('the topology reduces the way a network must: series and parallel', () => {
    const rows = L.seriesParallelRows();
    expect(rows).toHaveLength(2);
    near(rows[0].equivalentLbDPerPsi, 120, 9);
    near(rows[0].manyBranchWellheadPsia, 183.333333333, 6);
    near(rows[0].oneBranchWellheadPsia, 183.333333333, 6);
    expect(Math.abs(rows[0].differencePsia)).toBeLessThan(1e-9);
    expect(rows[1].equivalentLbDPerPsi).toBe(500);
    near(rows[1].manyBranchWellheadPsia, 120, 6);
    expect(Math.abs(rows[1].differencePsia)).toBeLessThan(1e-9);
  });
});

describe('SECTION 6: a tree of turbulent branches, against a method with nothing in common', () => {
  it('the engine lands on the oracle pressures, flows and rates', () => {
    const rows = L.goldenCaseRows('turbulent_tree');
    const h1 = rows.find((r) => r.kind === 'pressure' && r.id === 'h1');
    near(h1.goldenValue, 936.962342067, 6);
    near(h1.engineValue, 936.962342064, 6);
    expect(Math.abs(h1.engineMinusGolden)).toBeLessThan(1e-7);
    rows.forEach((r) => {
      expect(Math.abs(r.engineMinusGolden), `${r.kind} ${r.id}`).toBeLessThan(1e-6);
    });
  });

  it('and the Jacobian is what a handful of Newton steps against dozens of sweeps buys', () => {
    const s = L.goldenCaseSummary('turbulent_tree');
    expect(s.converged).toBe(true);
    expect(s.iterations).toBe(6);
    expect(s.goldenSweeps).toBe(48);
    near(s.sweepsOverIterations, 8, 9);
    expect(Math.abs(s.reportedResidualLbD)).toBeLessThan(1e-6);
    expect(Math.abs(s.conservationGapLbD)).toBeLessThan(1e-6);
    expect(s.pinned).toEqual([]);
    near(s.producedLbD, 8606.086171711, 4);
  });

  it('and the trunk conductance moves every well on the tree at once', () => {
    const rows = L.treeTrunkRows();
    expect(rows.filter((r) => r.published)).toHaveLength(1);
    const published = rows.find((r) => r.published);
    near(published.header2Psia, 620.599162363, 6);
    const looser = rows[rows.length - 1];
    expect(looser.header2Psia).toBeLessThan(published.header2Psia);
    expect(looser.totalLbD).toBeGreaterThan(published.totalLbD);
    rows.forEach((r) => {
      expect(r.converged, `k ${r.trunkConductanceLbDPerRootPsi}`).toBe(true);
      expect(Math.abs(r.conservationGapLbD)).toBeLessThan(1e-5);
    });
  });
});

describe('SECTION 7: a loop is what makes a network a network', () => {
  it('both parallel paths carry something, and neither is dead', () => {
    const s = L.loopedSplit();
    near(s.headerPsia, 621.148550864, 6);
    near(s.midpointPsia, 473.868277313, 6);
    near(s.directLegLbD, 3693.942751046, 4);
    near(s.midpointLegLbD, 3640.772530926, 4);
    near(s.directSharePct, 50.362456, 6);
    near(s.midpointSharePct, 49.637544, 6);
    expect(s.neitherLegIsDead).toBe(true);
    expect(s.iterations).toBe(6);
    expect(s.converged).toBe(true);
    expect(Math.abs(s.conservationGapLbD)).toBeLessThan(1e-5);
  });

  it('and the split is a DECISION the solve makes, not two independent pipes', () => {
    const rows = L.loopSplitRows();
    near(rows.find((r) => r.midpointLegConductanceLbDPerRootPsi === 60).midpointSharePct, 24.634111, 6);
    near(rows.find((r) => r.midpointLegConductanceLbDPerRootPsi === 100).midpointSharePct, 34.514100, 6);
    near(rows.find((r) => r.midpointLegConductanceLbDPerRootPsi === 220).midpointSharePct, 49.637544, 6);
    near(rows.find((r) => r.midpointLegConductanceLbDPerRootPsi === 800).midpointSharePct, 60.945870, 6);
    near(rows.find((r) => r.midpointLegConductanceLbDPerRootPsi === 60).totalDeliveredLbD, 6536.862501, 4);
    near(rows.find((r) => r.midpointLegConductanceLbDPerRootPsi === 800).totalDeliveredLbD, 7659.969113, 4);
    expect(rows.filter((r) => r.published)).toHaveLength(1);
    // the DIRECT leg loses share as the other leg opens, on a conductance that
    // never moved: the two legs are one decision
    const shares = rows.map((r) => r.midpointSharePct);
    expect(shares).toEqual([...shares].sort((a, b) => a - b));
  });
});

describe('SECTION 8: the result the whole studio exists for, wells fight', () => {
  it('the ladder matches the oracle at one, two and three wells', () => {
    const rows = L.fightLadderRows();
    near(rows[0].goldenHeaderPsia, 253.813945361, 6);
    near(rows[0].engineHeaderPsia, 253.813945361, 6);
    near(rows[1].engineHeaderPsia, 370.837866311, 6);
    near(rows[2].engineHeaderPsia, 670.128002136, 6);
    rows.forEach((r) => {
      expect(Math.abs(r.headerEngineMinusGolden), `count ${r.count}`).toBeLessThan(1e-8);
      Object.entries(r.goldenWellRatesLbD).forEach(([id, q]) => {
        expect(Math.abs(r.engineWellRatesLbD[id] - q), `${r.count} ${id}`).toBeLessThan(1e-7);
      });
    });
  });

  it('W-0 loses 10.919052 percent of itself to the two wells that join it', () => {
    const h = L.fightLadderHeadline();
    near(h.w0AloneLbD, 3522.516744485, 6);
    near(h.w0WithTwoCompanionsLbD, 3137.891322296, 6);
    near(h.w0LostLbD, 384.625422, 5);
    near(h.w0LostPct, 10.919052, 6);
    near(h.w1LostPct, 10.468272, 6);
    near(h.headerRosePsi, 416.314057, 5);
    expect(h.everyWellAlreadyOnItMakesStrictlyLess).toBe(true);
  });

  it('and two more wells bought less than their own solo rates would suggest', () => {
    const h = L.fightLadderHeadline();
    near(h.deliveredAtOneWellLbD, 3522.516744, 4);
    near(h.deliveredAtThreeWellsLbD, 9076.922229, 4);
    near(h.addingTwoWellsBoughtLbD, 5554.405485, 4);
    // TWO DIFFERENT CLAIMS, AND ONLY ONE OF THEM IS A SOLO RATE. Re-solving
    // W-1 and W-2 each ALONE on the same header and the same trunk gives
    // 6648.270173 lb/d. Adding W-1's rate from the two well case to W-2's rate
    // from the three well case gives 6173.781457, which is a mixture of two
    // systems and is not any well's solo rate. Both are pinned, under the two
    // names the lab gives them, so a lesson cannot quote one as the other.
    near(h.theirSoloRatesWouldSuggestLbD, 6648.270173, 4);
    near(h.w1WithOneCompanionPlusW2WithTwoLbD, 6173.781457, 4);
    expect(h.addingTwoWellsBoughtLbD).toBeLessThan(h.theirSoloRatesWouldSuggestLbD);
    expect(h.addingTwoWellsBoughtLbD).toBeLessThan(h.w1WithOneCompanionPlusW2WithTwoLbD);
    near(h.soloRatesLbD[0], 3522.516744485, 6);
  });

  it('backing the boundary off is the one lever that helps every well at once', () => {
    const rows = L.separatorSweepRows();
    const low = rows.find((r) => r.separatorPsia === 120);
    const high = rows.find((r) => r.separatorPsia === 400);
    near(low.headerPsia, 624.301508, 5);
    near(low.totalLbD, 9207.229955, 4);
    near(high.headerPsia, 837.839001, 5);
    near(high.totalLbD, 8579.087131, 4);
    expect(rows.filter((r) => r.published)).toHaveLength(1);
    ['w0LbD', 'w1LbD', 'w2LbD'].forEach((k) => {
      expect(low[k], k).toBeGreaterThan(high[k]);
    });
    rows.forEach((r) => expect(Math.abs(r.conservationGapLbD)).toBeLessThan(1e-5));
  });
});

describe('SECTION 9: one well on its own line, and the fourth one that is already wrong', () => {
  it('three of the four solve clean, with the audit closing on each', () => {
    const rows = L.teachingSoloRows();
    expect(rows).toHaveLength(4);
    const t1 = rows.find((r) => r.id === 't1');
    near(t1.wellheadPsia, 892.889543025, 6);
    near(t1.rateLbD, 6890.874160167, 6);
    near(t1.lineDropPsi, 627.889543025, 6);
    near(t1.drawdownPsi, 1857.110457, 5);
    near(t1.inflowAtThatWellheadLbD, 6890.874160167, 6);
    expect(t1.iterations).toBe(7);
    const t2 = rows.find((r) => r.id === 't2');
    near(t2.wellheadPsia, 335.147329090, 6);
    near(t2.rateLbD, 3057.021085629, 6);
    const t3 = rows.find((r) => r.id === 't3');
    near(t3.wellheadPsia, 840.553310094, 6);
    near(t3.rateLbD, 4750.157046765, 6);
    ['t1', 't2', 't3'].forEach((id) => {
      const r = rows.find((x) => x.id === id);
      expect(r.converged, id).toBe(true);
      expect(r.pinned, id).toEqual([]);
      expect(Math.abs(r.conservationGapLbD), id).toBeLessThan(1e-9);
      expect(r.massBalanceCloses, id).toBe(true);
    });
  });

  it('AND THE FOURTH IS ALREADY WRONG, WITH A RESIDUAL OF ZERO AND A GAP OF 345', () => {
    const t4 = L.teachingSoloRows().find((r) => r.id === 't4');
    near(t4.wellheadPsia, 303.714448989, 6);
    expect(t4.rateLbD).toBe(985);
    expect(t4.flowlineLbD).toBe(640);
    expect(t4.iterations).toBe(4);
    expect(t4.converged).toBe(true);
    expect(t4.pinned).toEqual(['t4']);
    // the two roads, and they are not in contradiction: they are answers to
    // two different questions
    expect(t4.reportedResidualLbD).toBe(0);
    near(t4.conservationGapLbD, 345, 9);
    near(t4.conservationRelative, 0.3502538, 6);
    expect(t4.massBalanceCloses).toBe(false);
    near(t4.inflowAtThatWellheadLbD, 985, 9);
    // the Vogel curve at that wellhead would give far more than the allocation
    near(t4.drawdownPsi, 1146.285551, 5);
  });
});

describe('SECTION 10: the teaching network solved, and what it costs each well', () => {
  it('converges in eleven iterations with one node pinned', () => {
    const s = L.teachingSolve();
    expect(s.converged).toBe(true);
    expect(s.ok).toBe(true);
    expect(s.iterations).toBe(11);
    expect(s.pinned).toEqual(['t4']);
    near(s.reportedResidualLbD / 1e-11, 1.546141, 4);
    near(s.pressuresPsia.t1, 1257.276513629, 6);
    near(s.pressuresPsia.t2, 820.813328309, 6);
    near(s.pressuresPsia.t3, 1188.244679299, 6);
    near(s.pressuresPsia.t4, 831.176261907, 6);
    near(s.pressuresPsia.ha, 780.469728020, 6);
    near(s.pressuresPsia.hb, 781.662938843, 6);
    near(s.pressuresPsia.hc, 588.783893593, 6);
    expect(s.pressuresPsia.sep).toBe(265);
  });

  it('with the crosslink running BACKWARDS and one flowline at its capacity', () => {
    const s = L.teachingSolve();
    near(s.flowsLbD.e1, 6004.874117054, 6);
    near(s.flowsLbD.e2, 2318.356346320, 6);
    near(s.flowsLbD.e3, 3992.446687538, 6);
    expect(s.flowsLbD.e4).toBe(640);
    near(s.flowsLbD.c1, 9553.095088544, 6);
    near(s.flowsLbD.c2, -589.864625170, 6);
    near(s.flowsLbD.c3, 3402.582062368, 6);
    near(s.flowsLbD.tk, 12955.677150912, 6);
    expect(s.wellRatesLbD.t4).toBe(985);
    near(s.totalWellRatesLbD, 13300.677150912, 6);
  });

  it('every unknown node is at zero imbalance EXCEPT the one the residual cannot see', () => {
    const s = L.teachingSolve();
    ['t1', 't2', 't3', 'ha', 'hb', 'hc'].forEach((id) => {
      expect(Math.abs(s.imbalanceLbD[id]), id).toBeLessThan(1e-9);
    });
    near(s.imbalanceLbD.t4, 345, 9);
    near(s.worstImbalanceAllUnknownsLbD, 345, 9);
    expect(s.worstImbalanceUnpinnedLbD).toBeLessThan(1e-9);
    near(s.conservationGapLbD, 345, 9);
  });

  it('a node table tells a pinned pressure from a determined one', () => {
    const rows = L.teachingNodeRows();
    expect(rows).toHaveLength(8);
    const t4 = rows.find((r) => r.id === 't4');
    expect(t4.isPinned).toBe(true);
    expect(t4.pressureIsDetermined).toBe(false);
    expect(rows.filter((r) => r.pressureIsDetermined)).toHaveLength(7);
  });

  it('and a branch table tells the drawn sense from the solved one', () => {
    const rows = L.teachingBranchRows();
    const c2 = rows.find((r) => r.id === 'c2');
    expect(c2.drawnFrom).toBe('ha');
    expect(c2.drawnTo).toBe('hb');
    expect(c2.runsAsDrawn).toBe(false);
    expect(c2.solvedFrom).toBe('hb');
    expect(c2.solvedTo).toBe('ha');
    near(c2.magnitudeLbD, 589.864625170, 6);
    const e4 = rows.find((r) => r.id === 'e4');
    expect(e4.atItsCapacity).toBe(true);
    expect(rows.filter((r) => !r.runsAsDrawn)).toHaveLength(1);
  });

  it('the network costs the four wells 15.190761959 percent between them', () => {
    const rows = L.teachingFightRows();
    const t1 = rows.find((r) => r.id === 't1');
    near(t1.aloneLbD, 6890.874160167, 6);
    near(t1.onTheSystemLbD, 6004.874117054, 6);
    near(t1.lostLbD, 886.000043113, 6);
    near(t1.lostPct, 12.857585591, 6);
    near(t1.wellheadRosePsi, 364.386971, 5);
    near(rows.find((r) => r.id === 't2').lostPct, 24.162893177, 6);
    near(rows.find((r) => r.id === 't3').lostPct, 15.951269648, 6);
    expect(rows.find((r) => r.id === 't4').lostPct).toBe(0);
    const h = L.teachingFightHeadline();
    near(h.soloRatesAddToLbD, 15683.052292561, 6);
    near(h.theSystemProducesLbD, 13300.677150912, 6);
    near(h.theNetworkCostsLbD, 2382.375141650, 6);
    near(h.theNetworkCostsPct, 15.190761959, 6);
  });

  it('AND THE WEAK WELL LOSES MOST, so the two rankings are not the same ranking', () => {
    const h = L.teachingFightHeadline();
    expect(h.rankedByPercentageLost.map((r) => r.id)).toEqual(['t2', 't3', 't1', 't4']);
    expect(h.rankedByRateOnTheSystem.map((r) => r.id)).toEqual(['t1', 't3', 't2', 't4']);
    expect(h.theTwoRankingsDiffer).toBe(true);
    // and the produced total is not the delivered one, because one well is pinned
    near(h.trunkLbD, 12955.677150912, 6);
    near(h.conservationGapLbD, 345, 9);
  });

  it('a shut-in gain is not the rate the shut well was reported to be making', () => {
    const rows = L.teachingShutInRows();
    const t1 = rows.find((r) => r.shutIn === 't1');
    near(t1.totalFromTheRestLbD, 8290.169036003, 6);
    near(t1.survivorsGainedLbD, 994.366002145, 6);
    near(t1.defermentFromReportedRateLbD, 5010.508114909, 6);
    expect(t1.overstatementLbD).toBeLessThan(1e-9);
    const t4 = rows.find((r) => r.shutIn === 't4');
    near(t4.totalFromTheRestLbD, 12504.659991952, 6);
    near(t4.survivorsGainedLbD, 188.982841040, 6);
    // READ THE t4 ROW TWICE: both readings, under distinct names
    near(t4.defermentFromReportedRateLbD, 796.017158960, 6);
    near(t4.defermentFromDeliveredFlowLbD, 451.017158960, 6);
    near(t4.overstatementLbD, 345, 9);
    expect(t4.itWasPinnedOnTheFullSystem).toBe(true);
  });
});

describe('SECTION 11: a drawn arrow is not a flow direction', () => {
  it('the crosslink is drawn one way and carries mass the other', () => {
    const d = L.teachingDirection();
    expect(d.drawnFrom).toBe('ha');
    expect(d.drawnTo).toBe('hb');
    near(d.signedFlowLbD, -589.864625170, 6);
    near(d.magnitudeLbD, 589.864625170, 6);
    expect(d.itActuallyRunsFrom).toBe('hb');
    expect(d.itActuallyRunsTo).toBe('ha');
    near(d.dpDrawnSensePsi, -1.193210823, 6);
    expect(d.theDrawnDownstreamEndIsTheHigher).toBe(true);
    expect(d.backflowsNamedByDiagnose).toEqual(['c2']);
    expect(d.deadLegsNamedByDiagnose).toEqual([]);
  });

  it('and the sign is a property of the SOLUTION, not of the branch', () => {
    const rows = L.crosslinkSweepRows();
    near(rows.find((r) => r.crosslinkConductanceLbDPerRootPsi === 60).crosslinkLbD, -346.749154, 5);
    near(rows.find((r) => r.crosslinkConductanceLbDPerRootPsi === 300).crosslinkLbD, -571.240028, 5);
    near(rows.find((r) => r.crosslinkConductanceLbDPerRootPsi === 540).crosslinkLbD, -589.864625, 5);
    near(rows.find((r) => r.crosslinkConductanceLbDPerRootPsi === 1400).crosslinkLbD, -597.618496, 5);
    expect(rows.every((r) => r.runsBackwards)).toBe(true);
    expect(rows.filter((r) => r.isTheTeachingCase)).toHaveLength(1);
    rows.forEach((r) => near(r.conservationGapLbD, 345, 6));
  });
});

describe('SECTION 12: the bottleneck is not the biggest drop', () => {
  it('the two published gate fixtures, where the trunk is and is not the biggest drop', () => {
    const cases = L.publishedDiagnoseCases();
    expect(cases).toHaveLength(2);
    expect(cases[0].biggestDropId).toBe('choked');
    expect(cases[0].bottleneckId).toBe('choked');
    expect(cases[1].biggestDropId).toBe('trunk');
    expect(cases[1].bottleneckId).toBe('choked');
    near(cases[0].rows.find((r) => r.id === 'choked').intensityPsiPerLbD, 0.3, 9);
    near(cases[1].rows.find((r) => r.id === 'choked').intensityPsiPerLbD, 0.5, 9);
    near(cases[1].rows.find((r) => r.id === 'trunk').intensityPsiPerLbD * 1e3, 6.203474, 5);
  });

  it('on the teaching network they are two different branches', () => {
    const rows = L.teachingDiagnoseRows();
    expect(rows).toHaveLength(8);
    near(rows.find((r) => r.id === 'e1').dpPsi, 476.806785609, 6);
    near(rows.find((r) => r.id === 'e3').intensityPsiPerLbD, 0.1018377, 6);
    near(rows.find((r) => r.id === 'c2').dpPsi, -1.193210823, 6);
    expect(rows.find((r) => r.id === 'c2').backflow).toBe(true);
    const h = L.diagnoseHeadline();
    expect(h.biggestDropId).toBe('e1');
    expect(h.bottleneckId).toBe('e3');
    expect(h.theyAreDifferentBranches).toBe(true);
    near(h.biggestDropDpPsi, 476.806786, 5);
    near(h.bottleneckIntensityPsiPerLbD, 0.1018377, 6);
  });

  it('BOTH RANKINGS ARE ON MAGNITUDE and they differ in POPULATION', () => {
    const h = L.diagnoseHeadline();
    expect(h.bothRankingsAreOnMagnitude).toBe(true);
    expect(h.biggestDropPopulation).toBe(8);
    expect(h.bottleneckPopulation).toBe(8);
    expect(h.deadBranchCount).toBe(0);
    expect(h.deadBranchThresholdLbD).toBe(1e-9);
    expect(h.backflowIds).toEqual(['c2']);
  });

  it('and a dead leg can be the biggest drop and can NEVER be the bottleneck', () => {
    const f = L.populationFixture();
    expect(f.biggestDropId).toBe('dead');
    expect(f.bottleneckId).not.toBe('dead');
    expect(f.theBiggestDropIsADeadLeg).toBe(true);
    expect(f.biggestDropPopulation).toBe(3);
    expect(f.bottleneckPopulation).toBe(2);
    expect(f.deadLegIntensityIsInfinite).toBe(true);
  });

  it('and the bottleneck ranking FAILS OPEN on a leg carrying almost nothing', () => {
    const rows = L.whisperLegRows();
    expect(rows).toHaveLength(5);
    rows.forEach((r) => {
      expect(r.theWhisperWinsTheRanking, `${r.whisperMassLbD}`).toBe(true);
      expect(r.biggestDropId).toBe('main');
    });
    near(rows[1].whisperIntensityPsiPerLbD / 1e6, 1, 6);
    expect(rows[0].whisperMassLbD).toBe(1e-8);
    // a relative floor, one part in ten thousand of the largest branch mass
    expect(rows[0].aRelativeFloorWouldCloseIt).toBe(5);
  });
});

describe('SECTION 13: streams add by rate and never by ratio', () => {
  it('the published fixture: component rates ADD, exactly', () => {
    const s = L.publishedStreams();
    expect(s.ok).toBe(true);
    near(s.trunkOilStbd, 2900, 9);
    near(s.trunkWaterStbd, 1100, 9);
    near(s.trunkGasMscfd, 1690, 9);
    near(s.trunkWaterCutPct, 27.5, 6);
    expect(s.wellWaterCutsPct).toEqual([10, 80]);
    near(s.plainAverageOfTheCutsPct, 45, 9);
    near(s.averagingIsWrongByPoints, 17.5, 6);
    near(s.averagingIsWrongByFactor, 1.636364, 6);
  });

  it('and a node with more than one way out splits by MASS share', () => {
    const s = L.publishedStreamSplit();
    near(s.legXOilStbd, 300, 9);
    near(s.legYOilStbd, 100, 9);
    near(s.sumOfTheTwoLegsOilStbd, 400, 9);
  });

  it('a recirculating solved direction is reported, not iterated on', () => {
    const r = L.publishedStreamRefusal();
    expect(r.refused).toBe(true);
    expect(r.error).toMatch(/recirculating/);
  });

  it('on the teaching network, along the directions the solve actually found', () => {
    const rows = L.teachingStreamRows();
    const e1 = rows.find((r) => r.id === 'e1');
    near(e1.oilStbd, 1690, 9);
    near(e1.massLbD, 6004.874117054, 6);
    const c1 = rows.find((r) => r.id === 'c1');
    near(c1.oilStbd, 2566.950443808, 6);
    near(c1.massLbD, 9898.095088544, 6);
    const c2 = rows.find((r) => r.id === 'c2');
    near(c2.oilStbd, 153.950443808, 6);
    near(c2.massLbD, 589.864625170, 6);
    const tk = rows.find((r) => r.id === 'tk');
    near(tk.oilStbd, 3455, 9);
    near(tk.waterStbd, 1722, 9);
    near(tk.gasMscfd, 3536, 9);
    near(tk.massLbD, 13300.677150912, 6);
  });

  it('and the separator is told it receives all of it', () => {
    const h = L.teachingStreamHeadline();
    near(h.arrivingOilStbd, 3455, 9);
    near(h.arrivingWaterStbd, 1722, 9);
    near(h.arrivingGasMscfd, 3536, 9);
    near(h.arrivingMassLbD, 13300.677150912, 6);
    expect(h.testedOilStbd).toBe(3455);
    near(h.trunkWaterCutPct, 33.262507244, 6);
    near(h.plainAverageOfTheCutsPct, 42.401682837, 6);
    near(h.averagingIsWrongByPoints, 9.139175594, 6);
    near(h.wellWaterCuts.find((c) => c.id === 't2').waterCutPct, 54.951600894, 6);
    near(h.wellWaterCuts.find((c) => c.id === 't4').waterCutPct, 77.263969171, 6);
  });
});

describe('SECTION 14: the stream mass nobody compares, and two conventions under one word', () => {
  it('the same shortfall appears on every branch downstream of the pinned well', () => {
    const rows = L.teachingStreamMassRows();
    ['e1', 'e2', 'e3', 'c2', 'c3'].forEach((id) => {
      expect(rows.find((r) => r.id === id).agrees, id).toBe(true);
    });
    ['e4', 'c1', 'tk'].forEach((id) => {
      near(rows.find((r) => r.id === id).gapLbD, 345, 9);
      expect(rows.find((r) => r.id === id).agrees, id).toBe(false);
    });
    near(rows.find((r) => r.id === 'e4').theSolveSaysLbD, 640, 9);
    near(rows.find((r) => r.id === 'e4').theStreamSaysLbD, 985, 9);
  });

  it('TWO CAUSES SHOW UP IN ONE COLUMN, and only one of them is the sign convention', () => {
    const rows = L.signConventionRows();
    const c2 = rows.find((r) => r.id === 'c2');
    near(c2.signedFlowLbD, -589.864625170, 6);
    near(c2.branchStreamMassLbD, 589.864625170, 6);
    near(c2.differenceLbD, 1179.729250341, 6);
    near(c2.differenceOverMagnitude, 2, 9);
    expect(c2.cause).toMatch(/sign convention/);
    // and the three that ran the way they were drawn carry the OTHER disease
    ['e4', 'c1', 'tk'].forEach((id) => {
      const r = rows.find((x) => x.id === id);
      near(r.differenceLbD, 345, 9);
      expect(r.runsBackwards, id).toBe(false);
      expect(r.cause, id).toMatch(/pinned well mass hole/);
    });
    // so it is NOT zero everywhere the network ran as drawn
    expect(rows.filter((r) => r.cause === 'none, the two agree')).toHaveLength(4);
  });

  it('hand it a mass that is simply wrong and it propagates it without a word', () => {
    const rows = L.streamLieRows();
    rows.forEach((r) => {
      expect(r.ok, `${r.massFactor}`).toBe(true);
      expect(r.warningCount).toBe(0);
      // AND THE COMPONENT RATES DO NOT MOVE, because the split is by share
      expect(Math.abs(r.separatorOilMovedStbd), `${r.massFactor}`).toBeLessThan(1e-9);
    });
    near(rows.find((r) => r.massFactor === 0.8).trunkStreamMassLbD, 10640.541721, 5);
    near(rows.find((r) => r.massFactor === 2).trunkStreamMassLbD, 26601.354302, 5);
    near(rows.find((r) => r.massFactor === 1).trunkStreamMassLbD, 13300.677151, 5);
    near(rows[0].solvedTrunkLbD, 12955.677150912, 6);
  });

  it('and ONE comparison at the door would catch both', () => {
    const rows = L.streamDoorCheckRows();
    expect(rows).toHaveLength(4);
    expect(rows.filter((r) => r.theDoorCheckWouldFire)).toHaveLength(1);
    const t4 = rows.find((r) => r.id === 't4');
    near(t4.gapLbD, 345, 9);
  });
});

describe('SECTION 15: a node that nothing depends on is pinned, and the residual cannot see it', () => {
  it('the gate own fixture: converged, residual zero, and a thousand pounds a day lost', () => {
    const p = L.publishedPinning();
    expect(p.ok).toBe(true);
    expect(p.converged).toBe(true);
    expect(p.pinned).toEqual(['w']);
    expect(p.iterations).toBe(1);
    expect(p.reportedResidualLbD).toBe(0);
    near(p.nodeImbalanceLbD, 1000, 9);
    near(p.producedLbD, 2000, 9);
    near(p.deliveredLbD, 1000, 9);
    near(p.conservationGapLbD, 1000, 9);
    near(p.conservationRelative, 0.5, 9);
    expect(p.warning).toMatch(/shut-in well on a dead line/);
  });

  it('and a LIVE network reports nothing pinned, which is what makes the flag readable', () => {
    const p = L.publishedLiveNode();
    expect(p.pinned).toEqual([]);
    expect(p.warnings).toEqual([]);
    near(p.wellheadPsia, 153.846153846, 6);
    near(p.rateLbD, 16153.846153843, 4);
    expect(Math.abs(p.conservationGapLbD)).toBeLessThan(1e-6);
  });

  it('THE HEADLINE: converged true at 1.5461e-11 lb/d, and an audit gap of 345 lb/d', () => {
    const r = L.residualAgainstConservation();
    expect(r.converged).toBe(true);
    near(r.reportedResidualLbD / 1e-11, 1.546141, 4);
    near(r.conservationGapLbD, 345, 9);
    near(r.conservationRelative, 0.025938529, 9);
    near(r.conservationGapPct, 2.5938529, 6);
    near(r.gapOverReportedResidual / 1e13, 2.231362, 4);
    near(r.producedLbD, 13300.677150912, 6);
    near(r.deliveredLbD, 12955.677150912, 6);
    near(r.worstImbalanceAllUnknownsLbD, 345, 9);
    expect(r.worstImbalanceUnpinnedLbD).toBeLessThan(1e-9);
    expect(r.checkConservationIsInTheSameFile).toBe(true);
    expect(r.solveNetworkNeverCallsIt).toBe(true);
  });

  it('and the warning asserts a diagnosis the module has not checked', () => {
    const p = L.teachingPinning();
    expect(p.warning).toMatch(/shut-in well on a dead line/);
    expect(p.theWellIsProducing).toBe(true);
    expect(p.theLineIsPassingMass).toBe(true);
    expect(p.soItIsNeitherShutInNorOnADeadLine).toBe(true);
    near(p.pinnedPressurePsia, 831.176261907, 6);
    expect(p.itsReportedRateLbD).toBe(985);
    expect(p.itsFlowlineCarriesLbD).toBe(640);
    near(p.itsOwnImbalanceLbD, 345, 9);
    near(p.ifItReportedAPinnedImbalanceItWouldReportLbD, 345, 9);
    expect(p.shortfallByConstructionLbD).toBe(345);
  });

  it('the allocation sweep crosses the line capacity and only the word pinned changes', () => {
    const rows = L.teachingAllocationRows();
    const live = rows.filter((r) => r.allocationLbD <= 640);
    const pinned = rows.filter((r) => r.allocationLbD > 640);
    live.forEach((r) => {
      expect(r.converged, `${r.allocationLbD}`).toBe(true);
      expect(r.pinned, `${r.allocationLbD}`).toEqual([]);
      expect(Math.abs(r.conservationGapLbD), `${r.allocationLbD}`).toBeLessThan(1e-6);
      near(r.wellRateLbD, r.allocationLbD, 6);
    });
    pinned.forEach((r) => {
      expect(r.converged, `${r.allocationLbD}`).toBe(true);
      expect(r.pinned, `${r.allocationLbD}`).toEqual(['t4']);
      expect(r.itsFlowlineLbD).toBe(640);
      near(r.conservationGapLbD, r.allocationLbD - 640, 6);
    });
    near(rows.find((r) => r.allocationLbD === 660).conservationRelative, 0.001541345, 9);
    near(rows.find((r) => r.allocationLbD === 985).conservationRelative, 0.025938529, 9);
    near(rows.find((r) => r.allocationLbD === 1300).conservationGapLbD, 660, 9);
  });
});

describe('SECTION 16: the same network, different answers, depending on the guess', () => {
  it('the teaching well has a flat top, and the pressure where its mass balance closes', () => {
    const c = L.teachingWellCurve();
    near(c.allocationStopsBindingAtPsia, 1013.848652, 6);
    near(c.inflowEqualsLineCapacityAtPsia, 1182.577035, 6);
    near(c.flatTopWidthPsi, 1013.848652, 6);
    near(c.inflowAtTheCapacityCrossingLbD, 640, 6);
    expect(c.theDefaultGuessStartsInsideTheFlatTop).toBe(true);
  });

  it('EVERY RUN REPORTS CONVERGED and exactly ONE closes its mass balance', () => {
    const rows = L.initialGuessRows();
    expect(rows).toHaveLength(7);
    expect(rows.every((r) => r.converged)).toBe(true);
    const solving = rows.filter((r) => r.isTheSolution);
    expect(solving).toHaveLength(1);
    near(solving[0].pinnedPressurePsia, 1182.577035, 6);
    expect(solving[0].startedAtPsia).toBe(1200);
    near(solving[0].itsReportedRateLbD, 640, 6);
    expect(solving[0].itsFlowlineLbD).toBe(640);
    near(solving[0].conservationGapLbD, 0, 6);
  });

  it('and the engine default is not it: it lands inside the flat top and loses 345 lb/d', () => {
    const rows = L.initialGuessRows();
    const dflt = rows.find((r) => r.isTheEngineDefault);
    expect(dflt.iterations).toBe(11);
    near(dflt.pinnedPressurePsia, 831.176262, 5);
    near(dflt.conservationGapLbD, 345, 9);
    expect(dflt.isTheSolution).toBe(false);
    const h = L.initialGuessHeadline();
    expect(h.allReportConverged).toBe(true);
    expect(h.rowsThatCloseTheMassBalance).toBe(1);
    expect(h.defaultFindsTheSolution).toBe(false);
    near(h.solutionPinnedPressurePsia, h.theCurveSaysTheSolutionSitsAtPsia, 5);
  });

  it('the two worst runs carry the SMALLEST reported residual on the table', () => {
    const rows = L.initialGuessRows();
    const at400 = rows.find((r) => r.startedAtPsia === 400);
    const at600 = rows.find((r) => r.startedAtPsia === 600);
    near(at400.conservationGapLbD, 1625, 9);
    near(at600.conservationGapLbD, 1625, 9);
    expect(at400.itsFlowlineLbD).toBe(-640);
    near(at400.reportedResidualLbD / 1e-12, 2.2737, 3);
    const h = L.initialGuessHeadline();
    near(h.worstGapLbD, 1625, 9);
    expect(h.theResidualMovesAgainstTheTruth).toBe(true);
  });

  it('and two runs identical in every field but one prove the pinned entry is DECOUPLED', () => {
    const rows = L.initialGuessRows();
    const at400 = rows.find((r) => r.startedAtPsia === 400);
    const at600 = rows.find((r) => r.startedAtPsia === 600);
    expect(at400.iterations).toBe(at600.iterations);
    expect(at400.reportedResidualLbD).toBe(at600.reportedResidualLbD);
    expect(at400.itsFlowlineLbD).toBe(at600.itsFlowlineLbD);
    expect(at400.manifoldPsia).toBe(at600.manifoldPsia);
    expect(at400.trunkLbD).toBe(at600.trunkLbD);
    expect(at400.conservationGapLbD).toBe(at600.conservationGapLbD);
    // and the pinned pressures are two hundred psi apart
    near(at600.pinnedPressurePsia - at400.pinnedPressurePsia, 200, 6);
  });

  it('at a high enough start the reported rate goes where the allocation never permitted', () => {
    const at2000 = L.initialGuessRows().find((r) => r.startedAtPsia === 2000);
    expect(at2000.pinnedPressurePsia).toBe(2000);
    expect(at2000.itsReportedRateLbD).toBe(0);
    expect(at2000.itsFlowlineLbD).toBe(640);
    near(at2000.conservationGapLbD, -640, 9);
    expect(at2000.converged).toBe(true);
  });

  it('a pure REORDERING moves the solved nodes by nothing and the pinned one by more', () => {
    const rows = L.nodeOrderRows();
    expect(rows).toHaveLength(7);
    const h = L.nodeOrderHeadline();
    expect(h.largestUnpinnedMovementPsia).toBeLessThan(1e-12);
    expect(h.pinnedMovementPsia).toBeGreaterThan(1e-10);
    near(h.pinnedMovementPsia / 1e-9, 5.4710, 3);
    expect(h.originalConverged).toBe(true);
    expect(h.reversedConverged).toBe(true);
    near(h.originalConservationGapLbD, 345, 9);
    near(h.reversedConservationGapLbD, 345, 9);
  });
});

describe('SECTION 17: the tolerance is not in lb/d, and the scale is not returned', () => {
  it('the constant is named lb/d and the target is that times a scale of 7883.72 lb/d', () => {
    const t = L.toleranceScale();
    expect(t.theConstantIsNamedLbD).toBe('DEFAULT_TOLERANCE_LB_D');
    expect(L.DEFAULT_TOLERANCE_LB_D).toBe(1e-6);
    near(t.scaleLbD, 7883.717950413, 6);
    near(t.perWell.find((w) => w.id === 't1').inflowAtTheSinkPressureLbD, 7883.717950413, 6);
    near(t.perWell.find((w) => w.id === 't2').inflowAtTheSinkPressureLbD, 3125.903030303, 6);
    near(t.perWell.find((w) => w.id === 't3').inflowAtTheSinkPressureLbD, 5561.824807605, 6);
    near(t.perWell.find((w) => w.id === 't4').inflowAtTheSinkPressureLbD, 985, 9);
    near(t.totalInflowAtTheSinkPressureLbD, 17556.445788322, 6);
    near(t.targetAtTheDocumentedDefaultLbD / 1e-3, 7.883718, 5);
    near(t.looserThanTheNamePromisesByFactor, 7883.717950, 5);
    expect(t.theEngineDoesNotReturnIt).toBe(true);
    expect(t.theScaleIsTheLargestSingleWellNotTheTotal).toBe(true);
  });

  it('and because the scale is the largest single well, the criterion TIGHTENS as wells are added', () => {
    const rows = L.toleranceScaleLadderRows();
    near(rows[0].scaleLbD, 4125.742011834, 6);
    near(rows[1].scaleLbD, 4125.742011834, 6);
    near(rows[2].scaleLbD, 5024.112, 6);
    near(rows[0].totalOverScale, 1, 9);
    near(rows[1].totalOverScale, 1.687637489, 8);
    near(rows[2].totalOverScale, 2.385868167, 8);
    near(rows[2].totalInflowAtTheSinkPressureLbD, 11986.868887867, 6);
  });

  it('a loosened tolerance still says converged, and the answer moves', () => {
    const rows = L.toleranceSweepRows();
    expect(rows.every((r) => r.converged)).toBe(true);
    const tight = rows.find((r) => r.tolerance === 1e-12);
    expect(tight.iterations).toBe(11);
    expect(tight.worstJunctionMovedPsi).toBe(0);
    const loose = rows.find((r) => r.tolerance === 1e-6);
    expect(loose.iterations).toBe(9);
    near(loose.reportedResidualLbD / 1e-3, 3.8768, 3);
    near(loose.targetLbD / 1e-3, 7.883718, 5);
    const loosest = rows.find((r) => r.tolerance === 1e-1);
    expect(loosest.iterations).toBe(6);
    expect(Math.abs(loosest.trunkMovedLbD)).toBeGreaterThan(100);
    // and the conservation gap is on every row of it
    rows.forEach((r) => expect(r.conservationGapLbD).not.toBeNull());
  });
});

describe('SECTION 18: every failure comes back ok, and the message prints zero', () => {
  it('the iteration cap is hit and the return still says ok, with a full set of answers', () => {
    const rows = L.iterationCapRows();
    const one = rows.find((r) => r.maxIter === 1);
    expect(one.ok).toBe(true);
    expect(one.converged).toBe(false);
    expect(one.iterationsRun).toBe(1);
    near(one.trueReportedResidualLbD, 7545.876, 2);
    near(one.conservationGapLbD, 16740.257197, 4);
    expect(one.message).toMatch(/without meeting its tolerance/);
    // and every one of these carries pressures and flows that look like an answer
    expect(Number.isFinite(one.manifoldPsia)).toBe(true);
    expect(Number.isFinite(one.trunkLbD)).toBe(true);
    rows.forEach((r) => expect(r.ok, `${r.maxIter}`).toBe(true));
    const eleven = rows.find((r) => r.maxIter === 11);
    expect(eleven.converged).toBe(true);
    const thirty = rows.find((r) => r.maxIter === 30);
    expect(thirty.iterationsRun).toBe(11);
  });

  it('AND THE MESSAGE PRINTS THE NUMBER IT JUST FAILED ON WITH toFixed(3)', () => {
    const rows = L.toFixedRows();
    expect(rows).toHaveLength(2);
    const nine = rows.find((r) => r.maxIter === 9);
    near(nine.trueReportedResidualLbD / 1e-3, 3.876838925407, 8);
    expect(nine.printedResidual).toBe('0.004');
    expect(nine.toPrecisionWouldHavePrinted).toBe('0.00388');
    const ten = rows.find((r) => r.maxIter === 10);
    near(ten.trueReportedResidualLbD / 1e-8, 3.214654498152, 8);
    expect(ten.printedResidual).toBe('0.000');
    expect(ten.printedResidualReadsAsZero).toBe(true);
    expect(ten.exponentialWouldHavePrinted).toBe('3.2147e-8');
    // and the failure sentence sits beside a conservation gap of 345 lb/d
    near(ten.conservationGapLbD, 345, 9);
  });

  it('the one thing that does come back ok false is a singular Jacobian', () => {
    const s = L.singularSolves();
    expect(s.singularReturnsNull).toBe(true);
    near(s.wellPosed[0], 1, 12);
    near(s.wellPosed[1], 3, 12);
    near(s.itPivots[0], 3, 12);
    near(s.itPivots[1], 2, 12);
  });

  it('and the line search keeps every node above atmospheric', () => {
    const p = L.pressureFloorCase();
    near(p.wellheadPsia, 20.003996803, 6);
    expect(p.floorPsia).toBe(14.7);
    expect(p.aboveTheFloor).toBe(true);
    near(p.rateLbD, 19.984012790, 6);
    expect(p.converged).toBe(true);
    expect(p.pinned).toEqual([]);
  });
});

describe('SECTION 19: the cusp, where a continuous relation is not enough for a Jacobian', () => {
  it('the Jacobian step is taken on the from node pressure, and the crosslink sits closest', () => {
    const rows = L.cuspStepRows();
    expect(rows).toHaveLength(8);
    near(L.jacobianStepPsi(780.469728020), 0.007805, 6);
    near(rows.find((r) => r.id === 'e1').stepsFromZero, 37923.780524, 4);
    near(rows.find((r) => r.id === 'c2').stepsFromZero, 152.883678, 4);
    near(rows.find((r) => r.id === 'tk').stepsFromZero, 54991.975344, 4);
    const closest = rows.reduce((a, r) => (r.stepsFromZero < a.stepsFromZero ? r : a), rows[0]);
    expect(closest.id).toBe('c2');
    expect(rows.every((r) => !r.insideOneStepOfItsCusp)).toBe(true);
  });

  it('walking the loop leg drives the crosslink to its cusp and the solve stops converging', () => {
    const rows = L.cuspWalkRows();
    expect(rows.every((r) => r.ok)).toBe(true);
    expect(rows.find((r) => r.loopLegConductanceLbDPerRootPsi === 245).iterations).toBe(11);
    expect(rows.find((r) => r.loopLegConductanceLbDPerRootPsi === 245).converged).toBe(true);
    expect(rows.find((r) => r.loopLegConductanceLbDPerRootPsi === 300).converged).toBe(true);
    expect(rows.find((r) => r.loopLegConductanceLbDPerRootPsi === 360).converged).toBe(false);
    expect(rows.find((r) => r.loopLegConductanceLbDPerRootPsi === 400).converged).toBe(false);
    expect(rows.find((r) => r.loopLegConductanceLbDPerRootPsi === 460).converged).toBe(true);
    expect(rows.find((r) => r.loopLegConductanceLbDPerRootPsi === 460).iterations).toBe(9);
    const h = L.cuspWalkHeadline();
    expect(h.everyRowReturnsOk).toBe(true);
    expect(h.lowestFailingConductance).toBe(360);
    expect(h.highestFailingConductance).toBe(400);
    expect(h.signChangeBetweenConductances).toEqual([300, 340]);
    expect(h.theBandIsNotCentredOnTheSignChange).toBe(true);
    expect(h.highestIterations).toBeGreaterThanOrEqual(30);
  });
});

describe('SECTION 20: what the oracle covers, and what it does not', () => {
  it('four clean cases, no defects recorded, and a cap it never reaches', () => {
    const o = L.oracleCoverage();
    expect(o.publishedCaseCount).toBe(4);
    expect(o.publishedCases).toContain('linear_star');
    expect(o.oracleSweepCap).toBe(4000);
    expect(o.itNeverReachesTheCap).toBe(true);
    expect(Math.max(...Object.values(o.sweeps))).toBeLessThan(o.oracleSweepCap);
    expect(o.whatItNeverTouches.length).toBe(5);
    expect(o.whatItNeverTouches.join(' ')).toMatch(/PINNING PATH/);
    expect(o.whatItNeverTouches.join(' ')).toMatch(/pipeSchedule/);
  });

  it('and the module states what it refuses and what it does not model at all', () => {
    const r = L.refusals();
    expect(r.length).toBeGreaterThanOrEqual(20);
    expect(r.join(' ')).toMatch(/no route to a delivery point/i);
    expect(r.join(' ')).toMatch(/recirculating/);
    expect(r.join(' ')).toMatch(/PINNED NODE IS WARNED ABOUT RATHER THAN REFUSED/);
    expect(r.join(' ')).toMatch(/steady state/);
    expect(r.join(' ')).toMatch(/no choke as a node kind/);
  });
});

describe('THE PROVENANCE RULES, AS TESTS', () => {
  it('RULE 1: no accessor exposes a converged flag without its conservation gap', () => {
    // The defect this whole course is about is a converged flag with nothing
    // beside it that could contradict it. So every object this lab hands a
    // panel that carries `converged` carries `conservationGapLbD` too.
    const rows = L.teachingQuantities();
    const convergedPaths = rows
      .filter((r) => r.label.endsWith('.converged'))
      .map((r) => r.label.slice(0, -'.converged'.length));
    expect(convergedPaths.length).toBeGreaterThan(40);
    const gapPaths = new Set(rows
      .filter((r) => r.label.endsWith('.conservationGapLbD'))
      .map((r) => r.label.slice(0, -'.conservationGapLbD'.length)));
    const orphans = convergedPaths.filter((p) => !gapPaths.has(p));
    expect(orphans, `these expose a converged flag with no audit beside it: ${orphans.join(', ')}`)
      .toEqual([]);
  });

  it('RULE 1 again: the reported residual and the audit gap never share a name', () => {
    const rows = L.teachingQuantities();
    expect(rows.some((r) => r.label.endsWith('.reportedResidualLbD'))).toBe(true);
    expect(rows.some((r) => r.label.endsWith('.conservationGapLbD'))).toBe(true);
    // and no accessor carries a bare `residualLbD` or a bare `gap`, which is
    // how the two would get confused
    expect(rows.filter((r) => r.label.endsWith('.residualLbD'))).toEqual([]);
  });

  it('RULE 2: the branch relations are the CONSUMER callbacks, and the lab supplies them', () => {
    const turbulent = L.turbulentBranch(100);
    expect(turbulent({}, 200, 100)).toBeCloseTo(1000, 9);
    expect(turbulent({}, 100, 200)).toBeCloseTo(-1000, 9);
    const capped = L.cappedTurbulentBranch(100, 500);
    expect(capped({}, 200, 100)).toBe(500);
    expect(capped({}, 100, 200)).toBe(-500);
    const vogel = L.vogelWell({ qmax: 1000, prPsia: 1000 });
    expect(vogel(0)).toBeCloseTo(1000, 9);
    expect(vogel(1000)).toBeCloseTo(0, 9);
    expect(vogel(2000)).toBe(0);
    // monotone DECREASING, which is what the module header requires
    expect(vogel(400)).toBeGreaterThan(vogel(600));
    const allocated = L.allocatedWell({ allocationLbD: 500, qmax: 1000, prPsia: 1000 });
    // monotone NON-increasing, with a FLAT TOP, and the flat top is the finding
    expect(allocated(0)).toBe(500);
    expect(allocated(100)).toBe(500);
    expect(allocated(900)).toBeLessThan(500);
    // the engine ships only the linear pair, and they are re-exported as they are
    expect(typeof L.linearBranch).toBe('function');
    expect(typeof L.linearWell).toBe('function');
  });

  it('RULE 3: every row says whether it is golden, published, derived or teaching', () => {
    const allowed = new Set(['golden', 'published', 'derived', 'teaching']);
    const rows = L.teachingQuantities().filter((r) => r.label.endsWith('.provenance'));
    expect(rows.length).toBeGreaterThan(150);
    rows.forEach((r) => {
      expect(allowed.has(r.value), `${r.label} = ${r.value}`).toBe(true);
    });
  });

  it('RULE 4: the closed form and Newton are on distinct fields with a named difference', () => {
    const row = L.linearStarRows()[0];
    expect(Object.keys(row)).toContain('exactPressurePsia');
    expect(Object.keys(row)).toContain('newtonPressurePsia');
    expect(Object.keys(row)).toContain('newtonMinusExactPsia');
    expect(Object.keys(row)).toContain('goldenPressurePsia');
  });

  it('RULE 5: the signed flow and the branch stream mass are on distinct fields', () => {
    const row = L.signConventionRows()[0];
    expect(Object.keys(row)).toContain('signedFlowLbD');
    expect(Object.keys(row)).toContain('branchStreamMassLbD');
    expect(Object.keys(row)).toContain('cause');
  });

  it('RULE 6: both diagnose populations are exposed as counts', () => {
    const h = L.diagnoseHeadline();
    expect(Object.keys(h)).toContain('biggestDropPopulation');
    expect(Object.keys(h)).toContain('bottleneckPopulation');
    const f = L.populationFixture();
    expect(f.biggestDropPopulation).toBeGreaterThan(f.bottleneckPopulation);
  });

  it('RULE 7: the scale is exposed and is labelled as something the engine does not return', () => {
    const t = L.toleranceScale();
    expect(t.theEngineDoesNotReturnIt).toBe(true);
    expect(t.scaleLbD).toBeGreaterThan(1);
    expect(t.targetAtTheDocumentedDefaultLbD).toBe(L.DEFAULT_TOLERANCE_LB_D * t.scaleLbD);
  });

  it('RULE 8: a pinned pressure is marked as not determined, wherever pressures are returned', () => {
    const rows = L.teachingNodeRows();
    expect(rows.some((r) => r.pressureIsDetermined === false)).toBe(true);
    // AND THE ROW THAT SOLVES IS THE ROW WHERE NOTHING IS PINNED. Six of the
    // seven starts leave the node inside the flat top and pin it; the one that
    // lands at the capacity crossing keeps its Jacobian row, because the
    // allocation no longer binds there, and that run is the solution.
    const guess = L.initialGuessRows();
    expect(guess.filter((r) => r.nodeIsPinned)).toHaveLength(6);
    guess.filter((r) => r.nodeIsPinned).forEach((r) => {
      expect(r.pinned, `${r.label}`).toEqual(['t4']);
      expect(r.converged, `${r.label}`).toBe(true);
      expect(Math.abs(r.conservationGapLbD), `${r.label}`).toBeGreaterThan(1);
    });
    const solving = guess.find((r) => r.isTheSolution);
    expect(solving.nodeIsPinned).toBe(false);
    expect(solving.pinned).toEqual([]);
    const h = L.initialGuessHeadline();
    expect(h.solutionPinsNothing).toBe(true);
    expect(h.rowsThatPinTheNode).toBe(6);
    expect(h.everyPinnedRowStillReportsConverged).toBe(true);
  });

  it('PURITY: every accessor is deterministic and returns FRESH rows each call', () => {
    const a = L.teachingSoloRows();
    const b = L.teachingSoloRows();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
    a[0].rateLbD = -1;
    expect(L.teachingSoloRows()[0].rateLbD).not.toBe(-1);
    // and the same for the cached golden runs
    const g1 = L.goldenCaseSummary('looped');
    const g2 = L.goldenCaseSummary('looped');
    expect(g1).toEqual(g2);
    g1.flowsLbD.b1 = -1;
    expect(L.goldenCaseSummary('looped').flowsLbD.b1).not.toBe(-1);
  });

  it('and the teaching surface reaches every accessor a panel reads', () => {
    const names = L.teachingAccessors().map(([n]) => n);
    expect(new Set(names).size).toBe(names.length);
    expect(names.length).toBeGreaterThan(70);
    const numbers = L.teachingNumbers();
    expect(numbers.length).toBeGreaterThan(1500);
    expect(numbers.every((v) => Number.isFinite(v))).toBe(true);
  });

  it('and the three panel views are frozen objects of accessors and nothing else', () => {
    [L.trunkExplorer, L.networkExplorer, L.fightExplorer].forEach((view) => {
      expect(Object.isFrozen(view)).toBe(true);
      expect(typeof view.lineLabel).toBe('string');
      expect(typeof view.refusals).toBe('function');
    });
  });
});
