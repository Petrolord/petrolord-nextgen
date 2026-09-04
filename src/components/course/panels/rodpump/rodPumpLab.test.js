// Every value the PD4 lab exposes to a panel or a lesson is pinned here against
// the wave's teaching digest, AT THE DIGEST'S OWN PRINTED PRECISION, and so are
// the teaching CLAIMS. A course that asserts its numbers but not its arguments
// can have its argument quietly inverted by an engine change and still pass: the
// wave march could start coming out SHORTER than the spring rule, `prlPeakLb`
// could start agreeing with the tension envelope, `notPeriodic` could become
// monotone in resolution, the effective fillage factor could stop changing sign,
// and a file that only pinned numbers would fail with no idea which sentence in
// which lesson had just become false. So every one of those arguments is a named
// assertion below.
//
// THE DIGEST IS THE AUTHORITY, not this file. The 78 shipped lessons were
// written from /root/pd-wip-rodpump/digest.txt, so a lab value that disagrees
// with that file breaks a lesson that is already written. Every number below is
// quoted from it, at the number of decimals the digest printed, which is why the
// assertions compare formatted strings rather than floats: a match on
// `toFixed(9)` is the same statement the lesson makes.
//
// THE GOLDENS were cut by an independent stdlib oracle
// (tools/validation/production/oracle_rodpump.py) from the published method
// statements rather than from the JS: a finite element eigenvalue for the string
// note, a Newton four-bar closure with implicit differentiation for the linkage,
// a staggered grid RK4 march for the card, and Python complex numbers for the
// diagnostic. Four different routes on purpose. Its gates hold the two routes to
// 2 percent on plunger stroke and 3 percent on the minimum load, so anything
// smaller than that is invisible to the oracle by construction, and the whole
// Expert tier lives below that line.
//
// THE CAPSTONE IS NOT HERE. The PD4 capstone is derived in the wave's own
// pd4_fields.mjs and this lab never touches it. panelCapstoneGuard.test.js is
// the gate that proves no number on this surface lands near a graded answer.
//
// COST. This file marches the damped wave equation several hundred times, and
// the node ladder's top rung marches sixteen times the steps of the shipped
// grid. The expensive blocks carry their own timeouts and say so.

import { describe, it, expect } from 'vitest';
import * as L from './rodPumpLab.js';

/** The digest's own two formatters, so an assertion is a digest line. */
const f = (x, n = 6) => Number(x).toFixed(n);
const e = (x, n = 4) => Number(x).toExponential(n);

const SLOW = { timeout: 120000 };

// ---------------------------------------------------------------------------
// 1. THE PUBLISHED CONSTANTS AND THE TWO PUBLISHED STRINGS.
// ---------------------------------------------------------------------------

describe('the published constants', () => {
  it('reproduces the golden pump constant exactly, and it is BUILT and not remembered', () => {
    const [pump] = L.constantRows();
    expect(f(pump.goldenValue, 12)).toBe('0.116571155977');
    expect(f(pump.engineValue, 12)).toBe('0.116571155977');
    expect(pump.engineValue - pump.goldenValue).toBe(0);
    // built from 42 gallons of 231 in3, with pi over four already inside it
    expect(L.engineConstants().in3PerBbl).toBe(9702);
  });

  it('reproduces the golden 7/8 wave speed, and the coupling allowance is what slows it', () => {
    const wave = L.constantRows()[1];
    expect(f(wave.goldenValue, 9)).toBe('16288.760984482');
    expect(f(wave.engineValue, 9)).toBe('16288.760984482');
    const c = L.engineConstants();
    expect(c.elasticModulusPsi).toBe(30.5e6);
    expect(c.steelSg).toBe(7.85);
    expect(f(c.bareOverSqrtCouplingFtS, 9)).toBe(f(c.bareSteelVelocityFtS / Math.sqrt(c.couplingAllowance), 9));
  });
});

describe('the two published rod strings', () => {
  it('reproduces the taper to the last figure on every closed form', () => {
    const t = L.publishedStringRow('taper');
    expect(f(t.weightAirLb, 9)).toBe('9940.000000000');
    expect(f(t.weightFluidLb, 9)).toBe('8673.757961783');
    expect(f(t.buoyancy, 12)).toBe('0.872611464968');
    expect(e(t.erInPerLb, 9)).toBe('3.744037060e-3');
    expect(f(t.krLbPerIn, 9)).toBe('267.091373300');
    // a compliance sum and Archimedes have only one answer
    expect(t.weightAirDiffLb).toBe(0);
    expect(t.weightFluidDiffLb).toBe(0);
    expect(t.krDiffLbPerIn).toBe(0);
  });

  it('and the uniform string, whose 6000 ft is why the pair is NOT a taper result', () => {
    const u = L.publishedStringRow('uniform');
    expect(f(u.weightAirLb, 9)).toBe('13344.000000000');
    expect(f(u.weightFluidLb, 9)).toBe('11644.127388535');
    expect(e(u.erInPerLb, 9)).toBe('3.925786432e-3');
    expect(f(u.krLbPerIn, 9)).toBe('254.726031944');
    const gap = L.publishedStringGap();
    expect(f(gap.lighterByLb, 6)).toBe('3404.000000');
    expect(f(gap.lighterByPct, 6)).toBe('25.509592');
    expect(f(gap.stifferByLbPerIn, 6)).toBe('12.365341');
    expect(f(gap.stifferByPct, 6)).toBe('4.854369');
    // THE CLAIM, not the number: they are not the same length, so most of both
    // gaps is the thousand feet and neither is a taper result.
    expect(gap.sameLength).toBe(false);
    expect(gap.uniformLengthFt).toBe(6000);
    expect(gap.taperLengthFt).toBe(5000);
  });

  it('ODUMA-4 is a three way taper, and it is labelled teaching everywhere it surfaces', () => {
    const t = L.teachingStringRow();
    expect(t.id).toBe('ODUMA-4');
    expect(f(t.weightAirLb, 9)).toBe('10692.200000000');
    expect(f(t.buoyancy, 12)).toBe('0.885350318471');
    expect(f(t.weightFluidLb, 9)).toBe('9466.342675159');
    expect(e(t.erInPerLb, 9)).toBe('3.312268708e-3');
    expect(f(t.krLbPerIn, 9)).toBe('301.907872834');
    expect(t.sections.map((s) => s.label)).toEqual(['1', '7/8', '3/4']);
  });
});

describe('stiffness adds in series, so compliance adds and stiffness does not', () => {
  it('sums the compliances, and prices what adding the spring rates would give', () => {
    const s = L.seriesArithmetic();
    expect(e(s.sections[0].stretchPerLb, 9)).toBe('1.962893216e-3');
    expect(f(s.sections[0].sectionKrLbPerIn, 9)).toBe('509.452063888');
    expect(f(s.sections[1].sectionKrLbPerIn, 9)).toBe('561.436968366');
    expect(f(s.krLbPerIn, 9)).toBe('267.091373300');
    expect(f(s.springRatesAddedLbPerIn, 9)).toBe('1070.889032254');
    expect(f(s.timesTooStiff, 6)).toBe('4.009448');
  });

  it('and the one line that catches it: a series string is softer than its softest section', () => {
    const s = L.seriesArithmetic();
    expect(f(s.softestSectionLbPerIn, 9)).toBe('509.452063888');
    expect(s.stringIsSofterThanItsSoftestSection).toBe(true);
  });

  it('compliance is not shared out by length, on either published string or on ODUMA-4', () => {
    const tap = L.publishedStringRow('taper');
    expect(f(tap.sections[0].compliancePct, 6)).toBe('52.427184');
    expect(f(tap.sections[1].compliancePct, 6)).toBe('47.572816');
    const tea = L.teachingStringRow();
    expect(tea.sections.map((s) => f(s.compliancePct, 6)))
      .toEqual(['22.685963', '31.606022', '45.708015']);
    expect(tea.sections.map((s) => f(s.areaIn2, 9)))
      .toEqual(['0.785398163', '0.601320469', '0.441786467']);
  });
});

describe('the taper as a compromise, and what the engine refuses', () => {
  it('walks the split with the length held, and the note TURNS while the stiffness climbs', () => {
    const rows = L.taperSplitRows();
    expect(rows).toHaveLength(11);
    expect(f(rows[0].krLbPerIn, 9)).toBe('224.574787346');
    expect(f(rows[10].krLbPerIn, 9)).toBe('305.671238333');
    // the stiffness is monotone in the split
    const ks = rows.map((r) => r.krLbPerIn);
    expect(ks.every((k, i) => i === 0 || k > ks[i - 1])).toBe(true);
    // the note is not: it turns at 2500 ft of 7/8 and comes back down
    expect(f(rows[5].fundamentalSpm, 9)).toBe('53.642386647');
    expect(f(rows[0].fundamentalSpm, 9)).toBe('48.865672625');
    expect(f(rows[10].fundamentalSpm, 9)).toBe('48.866282953');
    expect(rows[5].fundamentalSpm).toBeGreaterThan(rows[10].fundamentalSpm);
  });

  it('WARNS on a taper that steps up rather than refusing it', () => {
    const o = L.taperOrderWarning();
    expect(o.ok).toBe(true);
    expect(o.warnings).toBe('taperStepsUp');
    expect(f(o.krLbPerIn, 9)).toBe('251.236634246');
    expect(o.rightOrderWarnings).toBe('none');
  });

  it('REFUSES a rod size it cannot read, rather than defaulting it to 7.8 in', () => {
    const r = L.sizeRefusal();
    expect(r.ok).toBe(false);
    expect(r.errorCount).toBe(1);
    expect(r.message).toMatch(/rod size/i);
    expect(f(r.misreadAreaIn2, 6)).toBe('47.783624');
    expect(f(r.trueAreaIn2, 9)).toBe('0.601320469');
    expect(f(r.areaFactor, 6)).toBe('79.464490');
  });

  it('buoyed weight is Archimedes and nothing else, and the 1.2 factor costs single digits', () => {
    const row = L.buoyancyRows().find((r) => r.fluidSg === 1.00);
    expect(f(row.factor, 12)).toBe('0.872611464968');
    expect(f(row.buoyedWeightLb, 6)).toBe('8673.757962');
    expect(f(row.predecessorFactor, 12)).toBe('0.847133757962');
    expect(f(row.errorPct, 6)).toBe('2.919708');
    // and it rises with the gravity rather than holding at a fifth
    const heavy = L.buoyancyRows().find((r) => r.fluidSg === 1.15);
    expect(f(heavy.errorPct, 6)).toBe('3.432836');
    expect(f(L.buoyancyRows().find((r) => r.fluidSg === 0).factor, 12)).toBe('1.000000000000');
  });
});

// ---------------------------------------------------------------------------
// 2. THE NOTE, AND THE LIMIT OF THE SCAN.
// ---------------------------------------------------------------------------

describe('the string has a note, and two routes find the same one', () => {
  it('the uniform string returns the odd harmonics a fixed free bar gives', () => {
    const n = L.noteRoutes('uniform');
    expect(n.modeScanSpm.map((x) => f(x, 9)))
      .toEqual(['40.721902461', '122.165707384', '203.609512306']);
    expect(f(n.modeRatios[0], 9)).toBe('3.000000000');
    expect(f(n.modeRatios[1], 9)).toBe('5.000000000');
    expect(n.uniform).toBe(true);
    expect(f(n.taperFactor, 9)).toBe('1.000000000');
    expect(f(n.acousticVelocityFtS, 9)).toBe('16288.760984482');
  });

  it('the stepped bar does NOT, and the engine scan lands on the dense scan to every figure', () => {
    const n = L.noteRoutes('taper');
    expect(f(n.engineScanSpm, 12)).toBe('53.362124005810');
    expect(f(n.modeScanSpm[0], 9)).toBe('53.362124006');
    expect(f(n.engineScanSpm, 9)).toBe(f(n.modeScanSpm[0], 9));
    expect(n.modeScanSpm.map((x) => f(x, 9)))
      .toEqual(['53.362124006', '143.726878480', '244.330411470']);
    expect(f(n.modeRatios[0], 9)).toBe('2.693424993');
    expect(f(n.modeRatios[1], 9)).toBe('4.578723505');
    expect(n.uniform).toBe(false);
    expect(n.unresolved).toBe(false);
    expect(f(n.n0Spm, 12)).toBe('48.866038821915');
    expect(f(n.taperFactor, 12)).toBe('1.092008382351');
    expect(f(n.gapToSecondModeSpm, 9)).toBe('90.364754474');
    expect(e(n.oracleDiffSpm, 4)).toBe('-7.7207e-5');
  });

  it('and ODUMA-4, where more steps give a larger taper factor', () => {
    const n = L.noteRoutes('ODUMA-4');
    expect(f(n.engineScanSpm, 12)).toBe('59.134268421585');
    expect(n.modeScanSpm.map((x) => f(x, 9)))
      .toEqual(['59.134268422', '152.571313745', '246.782140532']);
    expect(f(n.n0Spm, 12)).toBe('50.904388515803');
    expect(f(n.taperFactor, 12)).toBe('1.161673288802');
    expect(f(n.gapToSecondModeSpm, 9)).toBe('93.437045323');
  });
});

describe('the limit of the scan: naturalFrequency walks a quadratic grid', () => {
  it('lays 401 points of which 28 land inside the intended range', () => {
    const g = L.scanGridReplica('taper');
    expect(f(g.loSpm, 6)).toBe('2.443302');
    expect(f(g.hiSpm, 6)).toBe('195.464155');
    expect(g.steps).toBe(400);
    expect(f(g.intendedSpacingSpm, 9)).toBe('0.482552133');
    expect(g.pointsInRange).toBe(28);
    expect(g.pointsTotal).toBe(401);
  });

  it('its intervals grow by one increment a step, and the widest is 27 times the intended', () => {
    const g = L.scanGridReplica('taper');
    expect(g.firstTwelveIntervals.map((x) => f(x, 6))).toEqual([
      '0.482552', '0.965104', '1.447656', '1.930209', '2.412761', '2.895313',
      '3.377865', '3.860417', '4.342969', '4.825521', '5.308073', '5.790626',
    ]);
    expect(f(g.widestSpm, 9)).toBe('13.028907601');
    expect(f(g.widestOverIntended, 6)).toBe('27.000000');
    expect(e(g.lastPointSpm, 6)).toBe('3.870312e+4');
  });

  it('IS LATENT: the fundamental sits alone in its interval and the next mode is far above', () => {
    const g = L.scanGridReplica('taper');
    expect(f(g.fundamentalSpm, 9)).toBe('53.362124006');
    expect(f(g.fundamentalIntervalLoSpm, 6)).toBe('53.111276');
    expect(f(g.fundamentalIntervalHiSpm, 6)).toBe('60.349558');
    expect(f(g.fundamentalIntervalWidthSpm, 9)).toBe('7.238282000');
    // the comparison that decides whether the scan can be trusted on a string
    expect(g.widestSpm).toBeLessThan(g.secondModeAboveFirstSpm);
    expect(f(g.secondModeAboveFirstSpm, 9)).toBe('90.364754474');
    expect(f(L.scanGridReplica('ODUMA-4').widestSpm, 9)).toBe('13.572382588');
  });

  it('and a design at or above the fundamental is REFUSED, with the number named', () => {
    const r = L.speedRefusal();
    expect(r.ok).toBe(false);
    expect(r.askedSpm).toBe(60);
    expect(f(r.fundamentalSpm, 9)).toBe('59.134268422');
    expect(r.message).toMatch(/natural frequency/i);
    expect(r.message).toMatch(/59\.1 spm/);
  });
});

// ---------------------------------------------------------------------------
// 3. THE LINKAGE AND THE PUMP.
// ---------------------------------------------------------------------------

describe('the published four-bar linkage', () => {
  it('the stroke is the beam sweep times the front arm, and the closure is exact', () => {
    const u = L.unitSummary();
    expect(f(u.strokeIn, 9)).toBe('106.687716837');
    expect(f(u.beamSweepRad, 12)).toBe('1.000197032783');
    expect(f(u.sweepTimesFrontArmIn, 9)).toBe('106.687716837');
    expect(e(u.strokeDiffIn, 4)).toBe('-1.6030e-3');
    const row = L.unitRevolutionRows().find((r) => r.crankDeg === 90);
    expect(Math.abs(row.rearArmResidualIn)).toBeLessThan(1e-12);
    expect(Math.abs(row.pitmanResidualIn)).toBeLessThan(1e-12);
    expect(f(row.torqueFactorIn, 9)).toBe('-44.821028030');
    expect(f(row.velocityInPerS, 9)).toBe('-46.936470795');
  });

  it('the upstroke is NOT half the revolution, and the two velocities are not equal', () => {
    const u = L.unitSummary();
    expect(f(u.upstrokeFraction, 12)).toBe('0.544444444444');
    expect(e(u.upstrokeFractionDiff, 4)).toBe('-2.7778e-3');
    expect(f(u.upstrokeSecondsAt10Spm, 9)).toBe('3.266666667');
    expect(f(u.downstrokeSecondsAt10Spm, 9)).toBe('2.733333333');
    expect(f(L.unitVelocityAsymmetry().slowerOverFaster, 9)).toBe('0.884337785');
  });

  it('the front arm is an exact scale factor and the crank radius is not', () => {
    const arms = L.armSweepRows();
    expect(arms.map((r) => f(r.strokeOverArm, 12)))
      .toEqual(Array(arms.length).fill('1.000197032783'));
    expect(f(arms[0].strokeIn, 9)).toBe('80.015762623');
    const crank = L.crankSweepRows();
    expect(f(crank.find((r) => r.rIn === 20).strokeOverCrank, 9)).toBe('3.497252348');
    expect(f(crank.find((r) => r.rIn === 28.8).strokeOverCrank, 9)).toBe('3.704434612');
    expect(f(crank.find((r) => r.rIn === 32).strokeOverCrank, 9)).toBe('3.921849154');
    // and at 34 in the linkage does not close at all
    expect(crank.find((r) => r.rIn === 34).ok).toBe(false);
  });

  it('a stroke is REQUESTED only of the generic geometry, which labels itself generic', () => {
    const rows = L.genericLinkageRows();
    expect(f(rows.find((r) => r.requestedIn === 54).achievedIn, 9)).toBe('53.999148136');
    expect(f(rows.find((r) => r.requestedIn === 100).achievedIn, 9)).toBe('99.998422475');
    expect(f(rows.find((r) => r.requestedIn === 144).achievedIn, 9)).toBe('143.997728363');
    expect(rows[0].note).toMatch(/Not a manufacturer/i);
    expect(L.closureRefusal().ok).toBe(false);
    expect(L.closureRefusal().message).toMatch(/does not close/i);
  });

  it('the API designation carries the three numbers a design is checked against', () => {
    const d = L.designationRows().find((r) => r.designation === 'C-320D-200-100');
    expect(d.kind).toBe('conventional');
    expect(d.torqueRatingInLb).toBe(320000);
    expect(d.structuralCapacityLb).toBe(20000);
    expect(d.strokeIn).toBe(100);
    expect(d.reduction).toBe('double');
    expect(L.designationRefusal()).toBeNull();
  });
});

describe('the pump itself', () => {
  it('the constant multiplies the DIAMETER SQUARED, and the area form loses a fifth', () => {
    const row = L.plungerRows().find((r) => r.dIn === 1.75);
    expect(f(row.areaIn2, 9)).toBe('2.405281875');
    expect(f(row.fluidLoadLb, 6)).toBe('4690.299657');
    expect(f(row.volumePerStrokeIn3, 6)).toBe('256.614032');
    expect(f(row.volumePerStrokeBbl, 9)).toBe('0.026449601');
    expect(f(row.ratedBpd, 9)).toBe('380.874258458');
    expect(f(row.areaFormBpd, 9)).toBe('299.137943078');
    expect(f(row.understatedPct, 6)).toBe('21.460184');
  });

  it('and the shortfall is the SAME percentage on every plunger, which is what hides it', () => {
    const pcts = L.plungerRows().map((r) => f(r.understatedPct, 6));
    expect(new Set(pcts).size).toBe(1);
    expect(pcts[0]).toBe('21.460184');
  });

  it('fluid load is a differential times an area, so it is linear in both', () => {
    const rows = L.fluidLoadRows();
    const a = rows.find((r) => r.dpPsi === 400);
    const b = rows.find((r) => r.dpPsi === 800);
    expect(f(b.loadLb / a.loadLb, 9)).toBe('2.000000000');
    expect(f(rows.find((r) => r.dpPsi === 1950).loadLb, 9)).toBe('4690.299657039');
  });

  it('and a plunger with nothing to lift is REFUSED rather than returned as zero', () => {
    const r = L.pumpRefusal();
    expect(r.ok).toBe(false);
    expect(r.wouldBeLoadLb).toBe(0);
    expect(r.message).toMatch(/no fluid to lift/i);
  });
});

// ---------------------------------------------------------------------------
// 4. THE CARD. THE PUBLISHED PREDICTIVE CASES AND THE TWO ROUTES TO A STROKE.
// ---------------------------------------------------------------------------

describe('the published predictive cases', () => {
  it('sits inside the oracle gates at 5 spm, on two independent numerical routes', () => {
    const r = L.publishedPredictRow(5);
    expect(f(r.plungerStrokeIn, 9)).toBe('45.449104154');
    expect(f(r.plungerStrokeDiffPct, 6)).toBe('-0.637731');
    expect(f(r.prlPeakLb, 9)).toBe('15230.601238973');
    expect(f(r.prlMinLb, 9)).toBe('7192.002479818');
    expect(f(r.loadRangeLb, 9)).toBe('8038.598759155');
    expect(f(r.cardAreaInLb, 6)).toBe('267022.083549');
    expect(f(r.prhp, 9)).toBe('3.371490954');
    expect(Math.abs(r.plungerStrokeDiffPct)).toBeLessThan(2);
    expect(Math.abs(r.mprlDiffPct)).toBeLessThan(3);
  });

  it('and at 9 spm, where the load range is a third wider', () => {
    const r = L.publishedPredictRow(9);
    expect(f(r.plungerStrokeIn, 9)).toBe('49.670227367');
    expect(f(r.plungerStrokeDiffIn, 9)).toBe('-0.193943459');
    expect(f(r.plungerStrokeDiffPct, 6)).toBe('-0.388944');
    expect(f(r.prlPeakLb, 9)).toBe('16490.601223060');
    expect(f(r.prlMinLb, 9)).toBe('5823.210940232');
    expect(f(r.loadRangeLb, 9)).toBe('10667.390282828');
    expect(f(r.cardAreaInLb, 6)).toBe('323421.926937');
    expect(f(r.prhp, 9)).toBe('7.350498339');
  });

  it('the two samplings of one march, printed as the lessons quote them', () => {
    const rows = L.publishedSamplingRows();
    expect(rows.map((r) => [r.spm, r.samples, r.cardPoints, r.stride])).toEqual([
      [5, 11728, 181, 65],
      [9, 6516, 181, 36],
    ]);
    expect(e(rows[0].dtS, 6)).toBe('1.023192e-3');
    expect(e(rows[1].dtS, 6)).toBe('1.023123e-3');
    expect(rows.every((r) => r.converged && r.cycles === 3)).toBe(true);
  });

  it('the wave transit is what says whether a design is dynamic', () => {
    const h = L.waveTransitHeadline();
    expect(f(h.oneWayTransitS, 9)).toBe('0.306960118');
    expect(f(h.roundTripS, 9)).toBe('0.613920237');
    const rows = L.waveTransitRows();
    expect(f(rows.find((r) => r.spm === 0.5).roundTripsPerStroke, 9)).toBe('195.465131814');
    expect(f(rows.find((r) => r.spm === 9).roundTripsPerStroke, 9)).toBe('10.859173990');
  });

  it('and an undamped march is REFUSED rather than answered confidently', () => {
    const r = L.dampingRefusal();
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/damping ratio of 0/i);
  });
});

describe('the spring rule against the wave equation', () => {
  it('the spring rule is closed form and does not depend on speed', () => {
    const p = L.publishedSpringRule();
    expect(f(p.staticStretchIn, 9)).toBe('18.720185299');
    expect(f(p.springRuleIn, 9)).toBe('45.279814701');
    const t = L.teachingSpringRule();
    expect(f(t.springRuleIn, 9)).toBe('91.152184050');
    const ladder = L.publishedOvertravelRows();
    expect(new Set(ladder.map((r) => f(r.springRuleIn, 9))).size).toBe(1);
  }, SLOW);

  it('THE WAVE ANSWER IS LONGER AT EVERY SPEED, and the difference is overtravel', () => {
    const ladder = L.publishedOvertravelRows();
    expect(ladder).toHaveLength(18);
    expect(ladder.every((r) => r.waveMarchIn > r.springRuleIn)).toBe(true);
    const at = (spm) => ladder.find((r) => r.spm === spm);
    expect(f(at(0.5).waveMarchIn, 9)).toBe('45.286791250');
    expect(f(at(0.5).overtravelPct, 6)).toBe('0.015408');
    expect(f(at(9).waveMarchIn, 9)).toBe('49.670227367');
    expect(f(at(9).overtravelIn, 9)).toBe('4.390412667');
    expect(f(at(9).overtravelPct, 6)).toBe('9.696181');
    expect(f(at(15).waveMarchIn, 9)).toBe('53.042713176');
    expect(f(at(15).overtravelPct, 6)).toBe('17.144281');
  }, SLOW);

  it('but it is NOT MONOTONE in speed, so no rising trio is a trend', () => {
    const ladder = L.publishedOvertravelRows();
    const steps = ladder.slice(1).map((r, i) => r.overtravelIn - ladder[i].overtravelIn);
    expect(steps.some((d) => d < 0)).toBe(true);
  }, SLOW);

  it('at the slow end the march lands on the spring rule and the loads on the two weights', () => {
    const slow = L.publishedOvertravelRows().find((r) => r.spm === 0.5);
    expect(Math.abs(slow.overtravelPct)).toBeLessThan(1);
    expect(Math.abs(slow.prlPeakLb - slow.buoyedPlusFluidLb) / slow.buoyedPlusFluidLb).toBeLessThan(0.01);
    expect(Math.abs(slow.prlMinLb - slow.buoyedWeightLb) / slow.buoyedWeightLb).toBeLessThan(0.02);
  }, SLOW);

  it('and ODUMA-4 carries the same gap at the speed the design actually runs', () => {
    const rows = L.teachingOvertravelRows();
    const at = (spm) => rows.find((r) => r.spm === spm);
    expect(f(at(10).waveMarchIn, 9)).toBe('98.526653100');
    expect(f(at(10).overtravelIn, 9)).toBe('7.374469050');
    expect(f(at(10).overtravelPct, 6)).toBe('8.090282');
    expect(f(at(14).waveMarchIn, 9)).toBe('98.622401776');
    expect(f(at(14).overtravelPct, 6)).toBe('8.195325');
  }, SLOW);

  it('the overtravel shrinks as a percentage when the fluid load falls', () => {
    const rows = L.overtravelByLoadRows();
    expect(rows[0].overtravelPct).toBeLessThan(rows[rows.length - 1].overtravelPct);
    expect(f(rows.find((r) => r.fluidLoadLb === 5000).overtravelPct, 6)).toBe('9.696181');
  }, SLOW);

  it('static stretch is Er times the load, so it is linear', () => {
    const rows = L.staticStretchRows();
    const a = rows.find((r) => r.loadLb === 2500);
    const b = rows.find((r) => r.loadLb === 5000);
    expect(f(b.taperIn / a.taperIn, 9)).toBe('2.000000000');
    expect(f(b.taperIn, 6)).toBe('18.720185');
    const t = L.teachingStaticStretch();
    expect(f(t.stretchIn, 9)).toBe('15.535532787');
    expect(f(t.pctOfSurfaceStroke, 6)).toBe('14.561688');
  });
});

// ---------------------------------------------------------------------------
// 5. THE TEACHING DESIGN, THE POWER AND WHAT THE WELL MAKES.
// ---------------------------------------------------------------------------

describe('the teaching design at the shipped defaults', () => {
  it('returns the design the Professional tier reads, loads and all', () => {
    const d = L.teachingDesignSummary();
    expect(d.ok).toBe(true);
    expect(d.warnings).toBe('none');
    expect(f(d.fluidLoadLb, 9)).toBe('4690.299657039');
    expect(f(d.plungerStrokeIn, 9)).toBe('98.526653100');
    expect(f(d.pprlLb, 9)).toBe('19545.877783339');
    expect(f(d.mprlLb, 9)).toBe('2625.472705679');
    expect(f(d.loadRangeLb, 9)).toBe('16920.405077660');
    expect(f(d.cardAreaInLb, 6)).toBe('750654.615621');
    expect(f(d.prhp, 9)).toBe('18.955924637');
    expect(f(d.ratedBpd, 9)).toBe('380.874258458');
    expect(f(d.sweptBpd, 9)).toBe('351.739329047');
    expect(f(d.producedBpd, 9)).toBe('316.565396142');
    expect(f(d.producedOverRated, 9)).toBe('0.831154611');
  });

  it('and the sampling it was read off: 186 points kept of 6110 marched steps', () => {
    const s = L.samplingSummary();
    expect(s.samples).toBe(6110);
    expect(s.cardSamplesDefault).toBe(180);
    expect(s.stride).toBe(33);
    expect(s.cardPoints).toBe(186);
    expect(f(s.keptPct, 6)).toBe('3.044190');
    expect(s.envelopeNodes).toBe(120);
    expect(f(s.nodeSpacingFt, 9)).toBe('40.000000000');
    expect(f(s.shallowestNodeFt, 9)).toBe('20.000000000');
    // THE CLAIM: runRodPumpDesign forwards neither cardSamples nor nodes
    expect(s.forwardedByDesign).toBe(false);
  });

  it('the RP 11L groups, and the ZERO torqueGroup a missing balance leaves behind', () => {
    const g = L.teachingGroups();
    expect(f(g.nOverN0, 9)).toBe('0.196446717');
    expect(f(g.nOverNPrime, 9)).toBe('0.169106683');
    expect(f(g.foOverSkr, 9)).toBe('0.145616883');
    expect(f(g.spOverS, 9)).toBe('0.923505123');
    expect(f(g.f1OverSkr, 9)).toBe('0.312933201');
    expect(f(g.f2OverSkr, 9)).toBe('0.212384333');
    expect(f(g.skrLb, 6)).toBe('32209.861648');
    expect(g.torqueGroup).toBe(0);
  });

  it('the section stresses, read off the envelope and not off the card', () => {
    const rows = L.teachingStressRows();
    expect(rows.map((r) => f(r.maxStressPsi, 6)))
      .toEqual(['25210.199822', '22899.200494', '20864.065937']);
    expect(rows.map((r) => f(r.minStressPsi, 6)))
      .toEqual(['2969.187943', '111.747902', '-2491.543540']);
    expect(rows.map((r) => f(r.allowablePsi, 6)))
      .toEqual(['30420.168218', '28812.858195', '27348.506758']);
    expect(rows.map((r) => f(r.loadingPct, 9)))
      .toEqual(['82.873308396', '79.475629731', '76.289598262']);
    // the top section is priced at the envelope sample dx/2 down, not at surface
    expect(f(rows[0].envelopeSampleFt, 6)).toBe('20.000000');
    expect(rows[0].topDepthFt).toBe(0);
  });

  it('the surface card is larger than the pump card by the work the rods absorb', () => {
    const a = L.teachingCardAreas();
    expect(f(a.surfaceAreaInLb, 6)).toBe('750654.615621');
    expect(a.pumpAreaInLb).toBeLessThan(a.surfaceAreaInLb);
    expect(a.differenceInLb).toBeGreaterThan(0);
    // the pump load takes two values away from the transfers
    const loads = L.teachingPumpCardRows().map((r) => r.loadLb);
    expect(Math.max(...loads)).toBeLessThanOrEqual(a.fluidLoadLb + 1e-9);
    expect(Math.min(...loads)).toBeGreaterThanOrEqual(-1e-9);
  });
});

describe('what moves the loads, and what power costs', () => {
  it('the damping ratio moves both loads more than most designers expect', () => {
    const rows = L.dampingSweepRows();
    const at = (z) => rows.find((r) => r.dampingRatio === z);
    expect(f(at(0.12).loadRangeLb, 6)).toBe('16920.405078');
    expect(f(at(0.08).loadRangeLb, 6)).toBe('16157.838473');
    expect(f(at(0.20).loadRangeLb, 6)).toBe('18689.749941');
    // the range widens steadily with damping from 0.08 up
    const wide = rows.filter((r) => r.dampingRatio >= 0.08).map((r) => r.loadRangeLb);
    expect(wide.every((v, i) => i === 0 || v > wide[i - 1])).toBe(true);
  }, SLOW);

  it('and the notPeriodic flag does not order itself down the same sweep', () => {
    const rows = L.dampingSweepRows();
    const at = (z) => rows.find((r) => r.dampingRatio === z).notPeriodic;
    expect([at(0.05), at(0.06), at(0.08), at(0.10), at(0.12)])
      .toEqual([true, true, false, true, false]);
  }, SLOW);

  it('the plunger size moves the load and the volume in opposite directions', () => {
    const rows = L.plungerSweepRows();
    const loads = rows.map((r) => r.fluidLoadLb);
    const produced = rows.map((r) => r.producedBpd);
    expect(loads.every((v, i) => i === 0 || v > loads[i - 1])).toBe(true);
    expect(produced.every((v, i) => i === 0 || v > produced[i - 1])).toBe(true);
    expect(f(rows.find((r) => r.plungerDIn === 1.75).producedBpd, 6)).toBe('316.565396');
  }, SLOW);

  it('the fluid gravity moves both loads and NOTHING about how far the string stretches', () => {
    const rows = L.gravitySweepRows();
    expect(new Set(rows.map((r) => f(r.krLbPerIn, 9))).size).toBe(1);
    expect(new Set(rows.map((r) => e(r.erInPerLb, 9))).size).toBe(1);
    const weights = rows.map((r) => r.weightFluidLb);
    expect(weights.every((v, i) => i === 0 || v < weights[i - 1])).toBe(true);
  }, SLOW);

  it('horsepower is the card area times the speed over 396000, and the card grows too', () => {
    const rows = L.powerRows();
    const at = (spm) => rows.find((r) => r.spm === spm);
    expect(rows.map((r) => f(r.cardAreaInLb, 6))).toEqual([
      '580229.370988', '658118.165307', '750654.615621', '814331.476024',
    ]);
    expect(rows.map((r) => f(r.prhp, 9))).toEqual([
      '8.791354106', '13.295316471', '18.955924637', '24.676711395',
    ]);
    rows.forEach((r) => expect(f(r.areaTimesSpeedOver396000, 9)).toBe(f(r.prhp, 9)));
    // doubling the speed does NOT double the horsepower
    expect(at(12).prhp / at(6).prhp).toBeGreaterThan(2);
  }, SLOW);

  it('and the published pair carries the same arithmetic on the same string', () => {
    const rows = L.publishedPowerRows();
    expect(rows.map((r) => f(r.prhp, 9))).toEqual(['3.371490954', '7.350498339']);
    expect(rows.map((r) => f(r.cardAreaInLb, 6))).toEqual(['267022.083549', '323421.926937']);
  });
});

describe('fillage, the cliff and the effective factor', () => {
  it('the effective factor CHANGES SIGN across one sweep, so there is no direction to defend', () => {
    const s = L.fillageSummary();
    expect(s.aboveNominalCount).toBe(16);
    expect(s.belowNominalCount).toBe(3);
    expect(s.signFlips).toBe(true);
    expect(f(s.largestOverstatementPct, 6)).toBe('5.134400');
    expect(f(s.largestOverstatementAtFillage, 4)).toBe('0.8200');
    expect(f(s.largestUnderstatementPct, 6)).toBe('2.331398');
    expect(f(s.largestUnderstatementAtFillage, 4)).toBe('0.5500');
  }, SLOW);

  it('and the plunger stroke is not monotone in fillage either', () => {
    const s = L.fillageSummary();
    expect(s.plungerStrokeMonotoneInFillage).toBe(false);
    expect(s.longestAtFillage).not.toBe(1.0);
    expect(s.longestPlungerStrokeIn).toBeGreaterThan(s.fullBarrelPlungerStrokeIn);
    const rows = L.fillageRows();
    expect(f(rows.find((r) => r.fillage === 0.90).producedBpd, 6)).toBe('316.565396');
    expect(f(rows.find((r) => r.fillage === 0.90).effectiveOverNominal, 9)).toBe('1.031602494');
    expect(f(rows.find((r) => r.fillage === 0.55).effectiveOverNominal, 9)).toBe('0.976686022');
  }, SLOW);

  it('THE CLIFF: four ten thousandths of fillage separate a silent design from a warned one', () => {
    const p = L.fillageCliffPair();
    expect(p.silentWarns).toBe(false);
    expect(p.warnedWarns).toBe(true);
    expect(f(p.silentProducedBpd, 6)).toBe('301.389964');
    expect(f(p.warnedProducedBpd, 6)).toBe('301.354487');
    expect(f(p.apartBpd, 6)).toBe('0.035477');
    // and the message no longer prints the threshold it just failed
    expect(p.message).not.toMatch(/\b85 percent\b/);
  }, SLOW);
});

// ---------------------------------------------------------------------------
// 6. THE EXPERT TIER. THE SUBSAMPLE, THE CONVERGENCE, THE BALANCE.
// ---------------------------------------------------------------------------

describe('two peak loads out of one return object', () => {
  it('the envelope implies a HIGHER peak than prlPeakLb reports, from the same call', () => {
    const s = L.envelopeSplit();
    expect(f(s.shallowestNodeFt, 9)).toBe('20.000000000');
    expect(f(s.envelopeMaxLb, 9)).toBe('19800.044639044');
    expect(f(s.buoyedRodAboveLb, 9)).toBe('51.421146497');
    expect(f(s.impliedPeakLb, 9)).toBe('19851.465785541');
    expect(f(s.reportedPeakLb, 9)).toBe('19545.877783339');
    expect(f(s.disagreementLb, 9)).toBe('305.588002202');
    expect(f(s.disagreementPct, 6)).toBe('1.563440');
  });

  it('and the envelope route is the nearer of the two to the fully sampled march', () => {
    const s = L.envelopeSplit();
    expect(f(s.marchedPeakLb, 9)).toBe('19923.650769100');
    expect(f(s.envelopeFromMarchedLb, 9)).toBe('-72.184983559');
    expect(f(s.reportedFromMarchedLb, 9)).toBe('-377.772985761');
    expect(Math.abs(s.envelopeFromMarchedLb)).toBeLessThan(Math.abs(s.reportedFromMarchedLb));
    // the half node of rod is a DISCRETISATION CHOICE and a much smaller effect
    expect(f(s.halfNodeLightPct, 6)).toBe('0.259029');
  });

  it('WHICH CHECK READS WHICH: the two routes give opposite verdicts on one rating', () => {
    const r = L.ratingSplit();
    expect(r.structuralCapacityLb).toBe(19800);
    expect(f(r.structuralPctFromReported, 9)).toBe('98.716554461');
    expect(f(r.structuralPctFromMarched, 9)).toBe('100.624498834');
    expect(r.structuralOverloadRaised).toBe(false);
    expect(r.torquePct).toBeNull();
    // and the Goodman line never reads a rating, so the loading did not move
    expect(f(r.worstLoadingPct, 9)).toBe('82.873308396');
  });

  it('the reported loads walk toward the marched ones as the decimation is relaxed', () => {
    const c = L.cardSamplesCost('ODUMA-4');
    expect(f(c.marchedPeakLb, 6)).toBe('19923.650769');
    expect(f(c.marchedMinLb, 6)).toBe('2104.494479');
    expect(f(c.peakLowByLb, 6)).toBe('377.772986');
    expect(f(c.peakLowByPct, 6)).toBe('1.896103');
    expect(f(c.minHighByLb, 6)).toBe('520.978227');
    expect(f(c.reportedOverMarchedMin, 9)).toBe('1.247555046');
    expect(f(c.rangeNarrowByPct, 6)).toBe('5.043736');
    expect(f(c.cardAreaLowByInLb, 4)).toBe('9148.2107');
    expect(f(c.cardAreaLowByPct, 6)).toBe('1.204024');
  }, SLOW);

  it('AND THE PLUNGER STROKE DOES NOT MOVE AT ALL, because it is never decimated', () => {
    const c = L.cardSamplesCost('ODUMA-4');
    expect(Math.abs(c.plungerStrokeDiffIn)).toBeLessThan(1e-9);
    const rows = L.cardSamplesRows('ODUMA-4');
    expect(new Set(rows.map((r) => f(r.plungerStrokeIn, 9))).size).toBe(1);
  }, SLOW);

  it('at some speeds the two minima have OPPOSITE SIGNS, which is a different verdict', () => {
    const rows = L.subsampleBySpeedRows();
    const flipped = rows.filter((r) => !r.sameSign);
    expect(flipped.length).toBeGreaterThanOrEqual(2);
    flipped.forEach((r) => {
      expect(r.reportedMinLb).toBeGreaterThan(0);
      expect(r.marchedMinLb).toBeLessThan(0);
      expect(r.reportedOverMarchedMin).toBeNull();
    });
    // and the peak is always reported LOW, which is the safe direction only in size
    expect(rows.every((r) => r.peakLowByPct >= 0)).toBe(true);
  }, SLOW);
});

describe('the convergence study', () => {
  it('THE STROKE CONVERGES AND THE LOADS DO NOT, on the full node ladder', () => {
    const rows = L.convergenceRows('ODUMA-4 at the shipped damping', L.NODE_LADDER);
    expect(rows.map((r) => f(r.plungerStrokeIn, 9))).toEqual([
      '98.502373797', '98.526653100', '98.542926570',
      '98.544247156', '98.546334829', '98.546349123',
    ]);
    expect(rows.map((r) => f(r.prlPeakLb, 6))).toEqual([
      '19337.292600', '19545.877783', '19662.751698',
      '19551.233793', '19520.004895', '19590.579526',
    ]);
    expect(rows.map((r) => f(r.prlMinLb, 6))).toEqual([
      '2433.031523', '2625.472706', '2697.363306',
      '2632.612295', '2463.749290', '2638.509643',
    ]);
    expect(rows.map((r) => r.samples)).toEqual([3055, 6110, 12219, 24437, 48874, 97747]);
  }, SLOW);

  it('and the spread says so in one line: hundredths of a percent against tenths of a load', () => {
    const s = L.convergenceSpread('ODUMA-4 at the shipped damping', L.NODE_LADDER);
    expect(f(s.plungerStrokeSpreadIn, 9)).toBe('0.043975327');
    expect(f(s.plungerStrokeSpreadPct, 6)).toBe('0.044644');
    expect(f(s.pprlSpreadLb, 6)).toBe('325.459098');
    expect(f(s.pprlSpreadPct, 6)).toBe('1.683064');
    expect(f(s.mprlSpreadLb, 6)).toBe('264.331784');
    expect(f(s.mprlSpreadPct, 6)).toBe('10.864298');
    expect(f(s.loadingSpreadPoints, 9)).toBe('1.577289838');
  }, SLOW);

  it('THE PEAK IS NOT EVEN MONOTONE: it rises, falls twice, and rises again', () => {
    const pk = L.convergenceRows('ODUMA-4 at the shipped damping', L.NODE_LADDER)
      .map((r) => r.prlPeakLb);
    const up = pk.slice(1).map((v, i) => v > pk[i]);
    expect(up).toEqual([true, true, false, false, true]);
  }, SLOW);

  it('the standalone loading route reproduces the design return to the last figure', () => {
    const r = L.loadingRouteAgreement();
    expect(f(r.designReturnPct, 12)).toBe('82.873308395930');
    expect(f(r.standalonePct, 12)).toBe('82.873308395930');
    expect(r.strictlyEqual).toBe(true);
  });

  it('and notPeriodic is NOT MONOTONE in resolution off the shipped operating point', () => {
    const rows = L.convergenceRows('ODUMA-4 at 11 spm and a damping ratio of 0.05', L.NODE_LADDER);
    expect(rows.map((r) => r.notPeriodic)).toEqual([false, false, false, true, false, true]);
    expect(rows.map((r) => r.cycles)).toEqual([7, 11, 5, 20, 16, 20]);
    // while the same six grids at the shipped damping raise it at no row
    const shipped = L.convergenceRows('ODUMA-4 at the shipped damping', L.NODE_LADDER);
    expect(shipped.map((r) => r.notPeriodic)).toEqual([false, false, false, false, false, false]);
  }, SLOW);

  it('and a caller who sees the flag has nothing to turn', () => {
    const p = L.periodicityFlag();
    expect(p.designWarnings).toBe('rodOverstressed');
    expect(p.designRaisesNotPeriodic).toBe(false);
    expect(p.message).toMatch(/had not settled into a repeating cycle/i);
    expect(p.maxCyclesDefault).toBe(20);
    expect(p.nodesExposedByDesign).toBe(false);
    expect(p.maxCyclesExposedByDesign).toBe(false);
  }, SLOW);
});

describe('a number smaller than the solver own noise is not a result', () => {
  it('the loading DIPS at 10.6 spm by a point and a half', () => {
    const rows = L.speedSweepRows();
    const at = (spm) => rows.find((r) => r.spm === spm).worstLoadingPct;
    expect(f(at(10.2), 6)).toBe('85.051352');
    expect(f(at(10.4), 6)).toBe('89.649462');
    expect(f(at(10.6), 6)).toBe('88.179235');
    expect(f(at(10.8), 6)).toBe('97.785820');
    expect(rows.every((r) => r.converged)).toBe(true);
  }, SLOW);

  it('and the SAME NUMBER moves further when only the grid moves, so the dip is refused', () => {
    const noise = L.nodeNoiseRows(10.6, L.NODE_LADDER);
    expect(noise.map((r) => f(r.worstLoadingPct, 6))).toEqual([
      '88.096996', '88.179235', '88.650937', '88.785732', '87.849399', '88.058831',
    ]);
    const d = L.dipAgainstNoise(L.NODE_LADDER);
    expect(f(d.dipPoints, 6)).toBe('1.470226');
    expect(f(d.noiseBeforePoints, 6)).toBe('4.283675');
    expect(f(d.noiseAfterPoints, 6)).toBe('6.553883');
    expect(f(d.dipOverNoiseBefore, 6)).toBe('0.343216');
    expect(f(d.dipOverNoiseAfter, 6)).toBe('0.224329');
    expect(d.isAnOptimum).toBe(false);
    expect(d.dipPoints).toBeLessThan(d.noiseBeforePoints);
    expect(d.dipPoints).toBeLessThan(d.noiseAfterPoints);
  }, SLOW);
});

describe('the counterbalance', () => {
  it('balances the two torque peaks, and the effect is read a quarter turn from the bottom', () => {
    const b = L.balanceSummary();
    expect(b.balanced).toBe(true);
    expect(f(b.momentInLb, 6)).toBe('609641.972281');
    expect(f(b.peakTorqueInLb, 6)).toBe('450016.096192');
    expect(f(b.counterbalanceEffectLb, 6)).toBe('13508.771698');
    expect(f(b.quarterTurnTorqueFactorIn, 9)).toBe('45.129341579');
    expect(f(b.upstrokePeakInLb, 6)).toBe(f(b.downstrokePeakInLb, 6));
    expect(Math.abs(b.peakDifferenceInLb)).toBeLessThan(1e-6);
    // dividing the moment by the FRONT ARM instead understates it by a factor
    expect(f(b.momentOverFrontArmLb, 6)).toBe('5715.391704');
    expect(f(b.frontArmUnderstatesBy, 6)).toBe('2.363578');
  }, SLOW);

  it('the net torque is two terms, and the valve transfer puts a step into it', () => {
    const rows = L.balanceTorqueRows();
    const at = (deg) => rows.find((r) => r.crankDeg === deg);
    expect(f(at(90).counterbalanceTorqueInLb, 6)).toBe('609549.120856');
    expect(f(at(270).counterbalanceTorqueInLb, 6)).toBe('-609549.120856');
    expect(f(at(90).netTorqueInLb, 6)).toBe('9544.120322');
    expect(f(at(240).prlLb, 6)).toBe('11077.067719');
    expect(f(at(255).prlLb, 6)).toBe('2835.207157');
    expect(f(at(255).netTorqueInLb, 6)).toBe('-434503.712662');
  }, SLOW);

  it('overweighting costs as surely as underweighting, and the crossing IS the balance', () => {
    const rows = L.balanceSweepRows();
    const at = (fr) => rows.find((r) => r.fraction === fr);
    expect(f(at(1.0).upstrokePeakInLb, 6)).toBe('450016.096192');
    expect(f(at(1.0).downstrokePeakInLb, 6)).toBe('450016.096192');
    expect(at(0.9).upstrokePeakInLb).toBeGreaterThan(at(0.9).downstrokePeakInLb);
    expect(at(1.1).downstrokePeakInLb).toBeGreaterThan(at(1.1).upstrokePeakInLb);
    expect(at(2.0).largerInLb).toBeGreaterThan(at(1.0).largerInLb);
    const v = L.balanceValue();
    expect(f(v.withNoCounterweightInLb, 6)).toBe('950041.862527');
    expect(f(v.reductionPct, 6)).toBe('52.631972');
  }, SLOW);

  it('THE SUBSAMPLE RUNS ONE LEVEL FURTHER: the balance is struck off the decimated card', () => {
    const s = L.balanceSamplingComparison();
    expect(s.defaultCardPoints).toBe(186);
    expect(s.fullCardPoints).toBe(6110);
    expect(f(s.fullMomentInLb, 6)).toBe('601131.142443');
    expect(f(s.momentDiffPct, 6)).toBe('1.415803');
    expect(f(s.fullPeakTorqueInLb, 6)).toBe('461403.140996');
    expect(f(s.peakTorqueDiffPct, 6)).toBe('2.467917');
    expect(s.defaultPeakTorqueInLb).toBeLessThan(s.fullPeakTorqueInLb);
    expect(f(s.torquePctFromDefault, 9)).toBe('140.630030060');
    expect(f(s.torquePctFromFull, 9)).toBe('144.188481561');
  }, SLOW);

  it('counterbalanceEffect does NOT read the crank offset, although netTorque does', () => {
    const rows = L.crankOffsetRows();
    const zero = rows.find((r) => r.crankOffsetDeg === 0);
    // at a zero offset the two agree exactly, which is what says this is the offset
    expect(zero.differenceLb).toBe(0);
    expect(zero.readAtSample).toBe(zero.peaksAtSample);
    const ten = rows.find((r) => r.crankOffsetDeg === 10);
    expect(f(ten.momentInLb, 6)).toBe('574964.630971');
    expect(f(ten.peakTorqueInLb, 6)).toBe('428310.641751');
    expect(f(ten.readTorqueFactorIn, 9)).toBe('45.129341579');
    expect(f(ten.trueTorqueFactorIn, 9)).toBe('47.860417765');
    expect(f(ten.reportedEffectLb, 6)).toBe('12740.372690');
    expect(f(ten.trueEffectLb, 6)).toBe('12013.364233');
    expect(f(ten.differencePct, 6)).toBe('6.051664');
  }, SLOW);

  it('AND OMITTING THE BALANCE FAILS OPEN, while torquePct one field away says null', () => {
    const t = L.torqueGroupFailsOpen();
    expect(f(t.torqueGroupWithBalance, 9)).toBe('0.261911618');
    expect(t.torqueGroupWithout).toBe(0);
    expect(f(t.torquePctWithBalance, 9)).toBe('140.630030060');
    expect(t.torquePctWithout).toBeNull();
    // every other output is identical, because the balance enters only those two
    expect(t.plungerStrokeEqual).toBe(true);
    expect(t.pprlEqual).toBe(true);
    expect(t.worstLoadingEqual).toBe(true);
  }, SLOW);
});

describe('three inputs accepted and never read', () => {
  it('proves it by STRICT EQUALITY over ten outputs that span the whole function', () => {
    const rows = L.ignoredInputRows();
    expect(rows).toHaveLength(10);
    expect(rows.every((r) => r.strictlyEqual)).toBe(true);
    expect(L.ignoredInputDifferences()).toBe(0);
    // the digest prints these at twelve decimals, and both runs return the
    // same float to the last bit, which is the whole claim
    expect(f(rows.find((r) => r.key === 'pprlLb').runA, 12)).toBe('19545.877783338576');
    expect(f(rows.find((r) => r.key === 'plungerStrokeIn').runA, 12)).toBe('98.526653099789');
    expect(rows.find((r) => r.key === 'pprlLb').runA)
      .toBe(rows.find((r) => r.key === 'pprlLb').runB);
  }, SLOW);

  it('and kin is unchecked against the input it duplicates, with no warning raised', () => {
    const m = L.mismatchedKin();
    expect(f(m.otherStrokeIn, 6)).toBe('143.997728');
    expect(f(m.surfaceStrokeIn, 6)).toBe('106.687717');
    expect(m.identicalToRunA).toBe(true);
    expect(m.warnings).toBe('none');
  }, SLOW);

  it('THE CONTRAST: the same two numbers move a balance by percent, not by rounding', () => {
    const s = L.balanceSensitivitySummary();
    expect(f(s.momentDiffInLb, 6)).toBe('67531.101405');
    expect(f(s.momentDiffPct, 6)).toBe('11.077174');
    expect(f(s.peakTorqueDiffInLb, 6)).toBe('21110.615211');
    expect(f(s.peakTorqueDiffPct, 6)).toBe('4.691080');
  }, SLOW);
});

// ---------------------------------------------------------------------------
// 7. STRESS AND DIAGNOSIS.
// ---------------------------------------------------------------------------

describe('the modified Goodman line and the service factor', () => {
  it('the allowable RISES with the minimum stress, which is why a loaded string is allowed more', () => {
    const rows = L.goodmanAllowableRows();
    const vals = rows.map((r) => r.allowablePsi);
    expect(vals.every((v, i) => i === 0 || v > vals[i - 1])).toBe(true);
    expect(f(rows[0].allowablePsi, 6)).toBe('28750.000000');
    expect(L.goodmanGradeRows().find((g) => g.id === 'D').minTensilePsi).toBe(115000);
  });

  it('the design does not change down a service factor sweep; only the line does', () => {
    const rows = L.serviceFactorRows();
    expect(new Set(rows.map((r) => f(r.maxStressPsi, 6))).size).toBe(1);
    expect(f(rows[0].maxStressPsi, 6)).toBe('25210.199822');
    const loadings = rows.map((r) => r.loadingPct);
    expect(loadings.every((v, i) => i === 0 || v > loadings[i - 1])).toBe(true);
  }, SLOW);

  it('and the loading crosses 100 percent at a service factor found by bisection', () => {
    const c = L.serviceFactorCrossing();
    expect(f(c.serviceFactor, 9)).toBe('0.828733084');
    expect(f(c.loadingPct, 6)).toBe('100.000000');
  }, SLOW);

  it('the overstress warning no longer prints the threshold it has just failed', () => {
    const rows = L.overstressWarningRows();
    const at = (sf) => rows.find((r) => r.serviceFactor === sf);
    // the three above the crossing are silent and the two below it are not
    expect([at(0.845), at(0.84), at(0.83)].map((r) => r.raised)).toEqual([false, false, false]);
    expect([at(0.82), at(0.81)].map((r) => r.raised)).toEqual([true, true]);
    expect(f(at(0.83).loadingPct, 6)).toBe('99.847360');
    expect(f(at(0.82).loadingPct, 6)).toBe('101.065010');
    // toFixed(1) since engines PR #113: a loading just over 100 no longer prints
    // the words 100 percent, the threshold it had just failed
    expect(at(0.82).message).toMatch(/101\.1 percent/);
    expect(at(0.81).message).toMatch(/102\.3 percent/);
  }, SLOW);

  it('and this taper is NOT stress balanced, which is what the spread column is for', () => {
    const s = L.sectionLoadingSpread(1.0);
    expect(f(s.spreadPoints, 6)).toBe('6.583710');
    expect(s.stressBalanced).toBe(false);
  });
});

describe('the diagnostic, reading a card instead of predicting one', () => {
  it('reproduces the oracle on the published measured card to round-off', () => {
    const d = L.publishedDiagnosis();
    expect(f(d.plungerStrokeIn, 9)).toBe('79.499400953');
    expect(f(d.pumpLoadMaxLb, 9)).toBe('4235.608307819');
    expect(f(d.pumpLoadMinLb, 9)).toBe('395.090372522');
    expect(Math.abs(d.plungerStrokeDiffIn)).toBeLessThan(1e-9);
    expect(Math.abs(d.pumpLoadMaxDiffLb)).toBeLessThan(1e-9);
    expect(d.harmonicsUsed).toBe(24);
    expect(d.harmonicsCap).toBe(59);
  });

  it('and REFUSES a card with fewer than sixteen samples', () => {
    const r = L.diagnosisRefusal();
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/16|sixteen/i);
  });

  it('THE ROUND TRIP: two solvers sharing no code path agree on the stroke to a third of a percent', () => {
    const r = L.roundTrip();
    expect(f(r.marchPlungerStrokeIn, 9)).toBe('98.526653100');
    expect(f(r.diagnosticPlungerStrokeIn, 9)).toBe('98.826085067');
    expect(f(r.differenceIn, 9)).toBe('0.299431967');
    expect(f(r.differencePct, 6)).toBe('0.303910');
    expect(r.harmonicsUsed).toBe(24);
    expect(r.harmonicsCap).toBe(92);
    expect(r.cardPoints).toBe(186);
  });

  it('and it OVERSHOOTS at both ends, because a truncated sum cannot hold a valve transfer', () => {
    const r = L.roundTrip();
    expect(f(r.diagnosticPumpLoadMaxLb, 9)).toBe('4936.432691865');
    expect(f(r.diagnosticPumpLoadMinLb, 9)).toBe('-207.880450457');
    expect(r.diagnosticPumpLoadMaxLb).toBeGreaterThan(r.marchFluidLoadLb);
    expect(r.diagnosticPumpLoadMinLb).toBeLessThan(0);
    expect(f(r.pumpLoadMaxOvershootLb, 9)).toBe('246.133034826');
  });

  it('MORE HARMONICS IS NOT THE REPAIR: the difference does not descend', () => {
    const rows = L.roundTripHarmonicRows();
    const at = (h) => rows.find((r) => r.requested === h).differenceFromMarchIn;
    expect(f(at(4), 9)).toBe('0.606264751');
    expect(f(at(6), 9)).toBe('1.664923714');
    expect(at(4)).toBeLessThan(at(6));
    expect(f(at(16), 9)).toBe('0.252191287');
    expect(f(at(91), 9)).toBe('0.344508847');
    expect(Math.abs(at(91))).toBeGreaterThan(Math.abs(at(16)));
  });

  it('and it carries the damping ratio it is GIVEN, on an input nobody measured', () => {
    const rows = L.diagnosticDampingRows();
    expect(rows).toHaveLength(6);
    expect(L.diagnosticDampingSpread().plungerStrokeSpreadIn).toBeGreaterThan(0);
    expect(new Set(rows.map((r) => f(r.plungerStrokeIn, 9))).size).toBe(6);
  });
});

// ---------------------------------------------------------------------------
// 8. WHAT THE ENGINE REFUSES, AND THE PANEL SURFACES.
// ---------------------------------------------------------------------------

describe('the refusals, collected', () => {
  it('every capability comes with a limit, and each message is the engine own text', () => {
    const rows = L.refusals();
    expect(rows).toHaveLength(8);
    rows.forEach((r) => {
      expect(typeof r.message).toBe('string');
      expect(r.message.length).toBeGreaterThan(20);
    });
    expect(L.WARNING_CODES.map((w) => w.code)).toContain('incompleteFillage');
    expect(L.WARNING_CODES).toHaveLength(8);
    expect(L.NOT_MODELLED.length).toBeGreaterThan(5);
  }, SLOW);
});

describe('the three panel surfaces', () => {
  it('the string explorer returns five modes and none of them needs a march', () => {
    expect(Object.keys(L.stringExplorer)).toEqual(['objects', 'taper', 'note', 'linkage', 'pump']);
    const o = L.stringExplorer.objects();
    expect(o.objects).toHaveLength(4);
    expect(o.objects.filter((x) => x.needsAMarch)).toHaveLength(1);
    expect(f(L.stringExplorer.taper().series.krLbPerIn, 9)).toBe('267.091373300');
    expect(f(L.stringExplorer.note().routes[1].engineScanSpm, 9)).toBe('53.362124006');
    expect(f(L.stringExplorer.linkage().summary.strokeIn, 9)).toBe('106.687716837');
    expect(f(L.stringExplorer.pump().teaching.fluidLoadLb, 9)).toBe('4690.299657039');
  });

  it('the card explorer returns five modes over the march, the stretch and the well', () => {
    expect(Object.keys(L.cardExplorer)).toEqual(['march', 'stretch', 'loads', 'power', 'fillage']);
    expect(f(L.cardExplorer.march().teaching.plungerStrokeIn, 9)).toBe('98.526653100');
    expect(f(L.cardExplorer.loads().teaching.loadRangeLb, 9)).toBe('16920.405077660');
    expect(f(L.cardExplorer.power().perBarrel.hpPerBpd, 9)).toBe('0.059879964');
  }, SLOW);

  it('the balance explorer returns five modes and defaults to the ladder a panel can afford', () => {
    expect(Object.keys(L.balanceExplorer))
      .toEqual(['envelope', 'convergence', 'balance', 'ignored', 'stress']);
    expect(L.NODE_LADDER).toEqual([60, 120, 240, 480, 960, 1920]);
    expect(L.NODE_LADDER_QUICK).toEqual([60, 120, 240, 480]);
    const c = L.balanceExplorer.convergence();
    expect(c.ladder).toEqual(L.NODE_LADDER_QUICK);
    expect(c.cases).toHaveLength(3);
    expect(f(L.balanceExplorer.balance().summary.momentInLb, 6)).toBe('609641.972281');
    expect(f(L.balanceExplorer.envelope().split.disagreementLb, 9)).toBe('305.588002202');
  }, SLOW);
});
