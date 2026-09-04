// Every value the PD2 lab exposes to a panel, a lesson or the grader is pinned
// here against the vendored engine's own goldens, and so are the teaching
// CLAIMS. A course that asserts its numbers but not its arguments can have its
// argument quietly inverted by an engine change and still pass: the gas column
// gradient could start rising with depth, `spaceValves` could start testing
// minSpacingFt on the target depth mandrel, `valveSpread` could have its two
// sides put the right way round for a PPO valve, `deepestInjectionPoint` could
// start reading its traverse on a spline, and a file that only pinned numbers
// would fail with no idea which sentence in which lesson had just become false.
// So every one of those arguments is a named assertion below.
//
// The goldens were cut by an independent stdlib oracle
// (tools/validation/production/oracle_gaslift.py) from the published method
// statements rather than from the JS: an RK4 column at twenty times the
// engine's step count, and bisection where the engine iterates a fixed point.
// Since engines PR #110 they also carry an `unloading` key on every design, 28
// stage rows and 85 closing margin rows, plus a fourth published case,
// `midDecrementKnifeEdge`. Before that PR the oracle's `unloading()` was a stub
// that appended an empty open valve list for every stage without ever
// evaluating the condition, so the multipointing verdict was ungated while
// looking gated. The tolerances below are the goldens' own resolution.
//
// THE EIGHTEEN GRADED FIELDS of the OKPARA-9 capstone are pinned separately, at
// the tolerances the capstone states, because a grader reading one derivation
// and a lesson reading another is exactly the failure this file exists to stop.
//
// AND THE SEVENTY EIGHT SHIPPED LESSONS are pinned too. They were written from
// /root/pd-wip-gaslift/digest.txt, so a lab value that disagrees with that file
// breaks a lesson that is already written. `teachingDigestLines()` is compared
// with it LINE FOR LINE, at the digest's own printed precision, which is a
// stronger statement than a label map: every teaching number in this lab flows
// into a digest line and every digest line is rendered from an accessor. The
// checksum below pins the same thing on a machine that does not have the file.

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as L from './gasLiftLab.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const G = L.GOLDEN;

const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);
const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);
const relNear = (a, b, tol) => expect(rel(a, b)).toBeLessThan(tol);

/**
 * THE EIGHTEEN GRADED FIELDS, as [tier, key, value, tolerance].
 *
 * THE TOLERANCE IS ABSOLUTE, in the field's own units. `academy_submit_capstone`
 * in migrations/20260715_n4_petrophysics_capstone.sql grades with
 * `abs(v_got - v_exp) <= v_tol` and divides by nothing, so
 * `injection_point_depth_ft` is accepted within 0.0046 FEET of
 * 9139.524034378974, not within 0.0046 per cent of it. Every band below is
 * thousands of times tighter than a relative reading of the same number would
 * be.
 *
 * Every one of them is a return value of the gas lift engines, produced by the
 * capstone derivation in /root/pd-wip-gaslift/pd2_fields.mjs and carried here
 * verbatim so the grader, the lessons and this file all pin one set of numbers.
 * `capstoneValues()` in the lab reproduces the same derivation call for call,
 * and the test below is what proves the two have not drifted.
 */
const CAPSTONE_FIELDS = [
  ['beginner', 'gas_z_at_kickoff', 0.8321323612578156, 4.2e-7],
  ['beginner', 'gas_gradient_at_kickoff_psi_per_ft', 0.03459262518232471, 1.7e-8],
  ['beginner', 'inj_column_at_packer_psia', 1589.4628665427595, 0.00079],
  ['beginner', 'inj_surface_for_1585psia_psia', 1264.8156205292921, 0.00063],
  ['beginner', 'top_valve_depth_ft', 2494.025220656208, 0.0012],
  ['beginner', 'inj_curve_at_5375ft_psia', 1450.0362742923005, 0.00073],
  ['intermediate', 'valve2_depth_ft', 4379.112457100502, 0.0022],
  ['intermediate', 'valve4_depth_ft', 6997.151937824368, 0.0035],
  ['intermediate', 'valve2_dome_at_temp_psia', 1313.645346439994, 0.00066],
  ['intermediate', 'valve2_test_rack_opening_psia', 1143.8633940736581, 0.00057],
  ['intermediate', 'valve4_spread_psi', 45.22330508618348, 0.000023],
  ['intermediate', 'valve4_throughput_mscfd', 2892.4892215328155, 0.0014],
  ['advanced', 'valve1_closing_surface_psia', 1213.9289535870623, 0.00061],
  ['advanced', 'valve3_closing_surface_psia', 1121.4580042974942, 0.00056],
  ['advanced', 'injection_point_depth_ft', 9139.524034378974, 0.0046],
  ['advanced', 'injection_point_pinj_psia', 1573.281485043544, 0.00079],
  ['advanced', 'injection_point_depth_coarse_ft', 9113.00140054971, 0.0046],
  ['advanced', 'operating_inj_at_injection_pt_psia', 1459.3240954891764, 0.00073],
];

// ---------------------------------------------------------------------------
// 1. THE GOLDENS, CASE FOR CASE.
// ---------------------------------------------------------------------------

describe('the published gas properties reproduce the golden', () => {
  it('z and the static gradient match on all five rows', () => {
    const rows = L.engineGasPropertyRows();
    expect(rows).toHaveLength(5);
    rows.forEach((r) => {
      relNear(r.z, r.goldenZ, 1e-9);
      relNear(r.gradPsiPerFt, r.goldenGradPsiPerFt, 1e-9);
      expect(Math.abs(r.zDiffFromGolden)).toBeLessThan(1e-9);
    });
  });

  it('the gradient is rho over 144 and rho carries p, z and T', () => {
    // Not a remembered constant: rebuild it from the module's own two numbers.
    const r = L.goldenGasPropertyRows()[0];
    const z = L.naturalGasZ({ pPsia: r.pPsia, tF: r.tF, gasSg: r.gasSg });
    const rho = (L.AIR_MW * r.gasSg * r.pPsia) / (z * L.R_UNIVERSAL * L.toRankine(r.tF));
    relNear(rho / 144, r.gradPsiPerFt, 1e-9);
  });

  it('the acid correction moves z, and the uncorrected criticals are carried beside it', () => {
    const a = L.acidGasRows()[0];
    relNear(a.cleanZ, L.naturalGasZ({ pPsia: a.pPsia, tF: a.tF, gasSg: a.gasSg }), 1e-15);
    relNear(a.goldenZ, 0.849475578742, 1e-9);
    expect(a.epsilonR).toBeGreaterThan(0);
    expect(a.correctedTpcR).toBeLessThan(a.uncorrectedTpcR);
    expect(a.cleanZ).not.toBe(a.goldenZ);
  });
});

describe('the published columns reproduce the golden, down and back up', () => {
  it('all three march to the golden depth pressure at the 40 step default', () => {
    // The oracle is an RK4 column at twenty times the engine's step count, so
    // the two do NOT agree to machine precision and a test that demanded it
    // would be testing the oracle's step count. They agree to about a
    // thousandth of a psi, which is the march's own truncation at 40 steps and
    // is the number the refinement study prints as a sequence.
    const rows = L.goldenColumnRows();
    expect(rows).toHaveLength(3);
    rows.forEach((c) => {
      expect(Math.abs(c.engineBottomDiffPsi), `column ${c.index}`).toBeLessThan(1e-3);
      expect(Math.abs(c.engineSurfaceDiffPsi), `column ${c.index}`).toBeLessThan(1e-3);
      relNear(c.engineBottomPsia, c.goldenBottomPsia, 1e-6);
      relNear(c.engineSurfacePsia, c.goldenSurfaceFromBottomPsia, 1e-6);
    });
  });

  it('the inverse closes the round trip to under a millionth of a psi', () => {
    L.goldenColumnRows().forEach((c) => {
      expect(Math.abs(c.roundTripClosurePsi)).toBeLessThan(1e-6);
    });
  });
});

describe('the published nitrogen dome charges reproduce the golden', () => {
  it('the dome at temperature, its inverse and Ct all match', () => {
    const rows = L.nitrogenRows();
    expect(rows).toHaveLength(4);
    rows.forEach((r) => {
      relNear(r.engineDomeAtTempPsia, r.goldenDomeAtTempPsia, 1e-9);
      relNear(r.engineBackTo60Psia, r.pd60Psia, 1e-9);
      relNear(r.engineCt, r.goldenCt, 1e-9);
    });
  });
});

describe('the published throughput rows reproduce the golden', () => {
  it('Thornhill and Craver matches on all four rows, with its regime', () => {
    const rows = L.thornhillCraverRows();
    expect(rows).toHaveLength(4);
    rows.forEach((r) => {
      relNear(r.engineQMscfd, r.goldenQMscfd, 1e-9);
      relNear(r.criticalRatio ?? L.criticalPressureRatio(1.27), r.goldenCriticalRatio, 1e-9);
      expect(['critical', 'subcritical']).toContain(r.regime);
    });
  });

  it('the critical ratio is the published one and the areas are pi d squared over four', () => {
    relNear(L.criticalPressureRatio(1.27), 0.551208317714, 1e-11);
    L.portGeometryRows().forEach((r) => {
      relNear(r.areaIn2, (Math.PI / 4) * r.portIdIn * r.portIdIn, 1e-15);
      relNear(r.r, r.areaIn2 / r.bellowsAreaIn2, 1e-15);
    });
  });
});

describe('the four published designs reproduce the golden, end to end', () => {
  L.PUBLISHED_DESIGN_IDS.forEach((id) => {
    it(`${id}: depths, stop reason, valve settings and throughput`, () => {
      const a = L.designAgreement(id);
      expect(a.engineStopReason).toBe(a.goldenStopReason);
      expect(a.engineValveCount).toBe(a.goldenValveCount);
      // The golden stores its numbers to about twelve significant figures, so
      // 1e-8 relative is the file's own resolution and not a slack tolerance.
      expect(a.largestDepthDiffFt).toBeLessThan(1e-2);
      // The engine marches its column at steps 20 inside spaceValves and
      // valveSetting; the oracle uses RK4 at twenty times that. Every setting
      // therefore agrees to within the march's own truncation and no better,
      // and the digest prints the difference on every valve rather than hiding
      // it inside a tolerance.
      L.designValveRows(id).forEach((v) => {
        v.differences.forEach((d) => {
          expect(Math.abs(d.diff), `${id} valve ${v.valve} ${d.key}`).toBeLessThan(1e-2);
        });
      });
    });

    it(`${id}: the engine agrees with the oracle on every unloading verdict, or is a known divergence`, () => {
      const isPpo = L.designInputs(id).valveType === 'PPO';
      expect(L.unloadingVerdictAgreement(id)).toBe(!isPpo);
    });
  });

  it('there are four published cases and the fourth is the knife edge', () => {
    expect(L.PUBLISHED_DESIGN_IDS).toEqual([
      'westTexasOil', 'deepHighPressure', 'constantPressurePPO', 'midDecrementKnifeEdge',
    ]);
    expect(L.KNIFE_EDGE_ID).toBe('midDecrementKnifeEdge');
  });
});

describe('the published injection point reproduces the golden', () => {
  it('the shipped engine lands on the golden depth, pressure and stop', () => {
    const g = L.injectionPointGolden();
    const s = L.injectionPointShipped();
    relNear(s.depthFt, g.expectedDepthFt, 1e-6);
    relNear(s.pInjPsia, g.expectedPInjPsia, 1e-6);
    relNear(s.pProdPsia, g.expectedPProdPsia, 1e-6);
    expect(s.limitedBy).toBe(g.expectedLimitedBy);
    expect(g.rows).toBe(9);
    expect(g.rowSpacingFt).toBe(1000);
  });
});

// ---------------------------------------------------------------------------
// 2. THE TEACHING CLAIMS.
//
// Each of these is a sentence a shipped lesson makes. A number that agrees with
// the digest but an argument that has quietly inverted is the failure mode this
// section exists to catch.
// ---------------------------------------------------------------------------

describe('CLAIM: the injection line is a real gas column and its weight is not a constant', () => {
  it('the flat 0.02 psi/ft rule errs in BOTH directions, high pressure and low', () => {
    // The high pressure column: the local gradient is close to twice the rule.
    const high = L.ruleOfThumbRows(2);
    expect(high[0].pSurfPsia).toBe(1414.7);
    expect(high[0].gradientOverRule).toBeGreaterThan(1.9);
    // The low pressure column: about a third BELOW it.
    const low = L.ruleOfThumbRows(3);
    expect(low[0].pSurfPsia).toBe(614.7);
    expect(low[0].gradientOverRule).toBeLessThan(0.7);
    // And the sign of the miss at the packer flips between the two.
    expect(L.ruleOfThumbSummary(2).flatMissAtBottomPsi).toBeLessThan(0);
    expect(L.ruleOfThumbSummary(3).flatMissAtBottomPsi).toBeGreaterThan(0);
  });

  it('THE CORRECTED RESULT: the gradient FALLS with depth on all three published columns', () => {
    [1, 2, 3].forEach((i) => {
      const s = L.ruleOfThumbSummary(i);
      expect(s.gradientFallsWithDepth, `column ${i}`).toBe(true);
      expect(s.gradientChangePct).toBeLessThan(0);
    });
    // and it is not a rounding: 2.0, 4.9 and 2.0 percent.
    near(L.ruleOfThumbSummary(1).gradientChangePct, -2.0156, 1e-3);
    near(L.ruleOfThumbSummary(2).gradientChangePct, -4.9023, 1e-3);
    near(L.ruleOfThumbSummary(3).gradientChangePct, -2.0201, 1e-3);
  });

  it('THE CONTROL that settles it: hold the temperature and the gradient RISES', () => {
    // This is the whole argument. A plausible physical story that names only one
    // of two competing effects is the most common way to be confidently wrong,
    // and the cure is the controlled comparison rather than a better story.
    [1, 2, 3].forEach((i) => {
      const s = L.ruleOfThumbSummary(i);
      expect(s.isothermalGradientRisesWithDepth, `column ${i}`).toBe(true);
      expect(s.isothermalGradientChangePct).toBeGreaterThan(0);
    });
    near(L.ruleOfThumbSummary(1).isothermalGradientChangePct, 26.0096, 1e-3);
    near(L.ruleOfThumbSummary(2).isothermalGradientChangePct, 43.3641, 1e-3);
    near(L.ruleOfThumbSummary(3).isothermalGradientChangePct, 10.1002, 1e-3);
  });

  it('THE CONTROL IS DRAWABLE: both gradients exist at every plot station, not just the ends', () => {
    // ruleOfThumbSummary states the result at two depths. A panel has to DRAW
    // it, which needs the pair at every station, so isothermalControlRows runs
    // the same two columns and reports them station by station.
    [1, 2, 3].forEach((i) => {
      const rows = L.isothermalControlRows(i);
      expect(rows, `column ${i}`).toHaveLength(L.RULE_OF_THUMB_STATIONS + 1);
      const s = L.ruleOfThumbSummary(i);
      const top = rows[0];
      const bot = rows[rows.length - 1];
      // The station rows agree with the summary at both ends, which is what
      // makes them the SAME comparison rather than a second one.
      expect(top.tvdFt).toBe(0);
      expect(bot.tvdFt).toBe(s.tvdFt);
      expect(top.geothermalGradientPsiPerFt).toBe(s.surfaceGradientPsiPerFt);
      expect(bot.geothermalGradientPsiPerFt).toBe(s.bottomGradientPsiPerFt);
      expect(top.isothermalGradientPsiPerFt).toBe(s.isothermalSurfaceGradientPsiPerFt);
      expect(bot.isothermalGradientPsiPerFt).toBe(s.isothermalBottomGradientPsiPerFt);
      // The control is held at the wellhead temperature the whole way down and
      // the geothermal run is not, and at surface the two ARE one column.
      rows.forEach((r) => expect(r.isothermalTempF).toBe(s.isothermalTempF));
      expect(top.geothermalTempF).toBe(top.isothermalTempF);
      expect(bot.geothermalTempF).toBeGreaterThan(bot.isothermalTempF);
      // and the two curves separate monotonically, one falling and one rising.
      for (let k = 1; k < rows.length; k += 1) {
        expect(rows[k].geothermalGradientPsiPerFt)
          .toBeLessThan(rows[k - 1].geothermalGradientPsiPerFt);
        expect(rows[k].isothermalGradientPsiPerFt)
          .toBeGreaterThan(rows[k - 1].isothermalGradientPsiPerFt);
      }
      // The geothermal pressures are the ones ruleOfThumbRows already prints,
      // so a panel may put the two side by side without mixing two marches.
      const plain = L.ruleOfThumbRows(i);
      rows.forEach((r, k) => {
        expect(r.geothermalPsia).toBe(plain[k].enginePsia);
        expect(r.geothermalGradientPsiPerFt).toBe(plain[k].localGradientPsiPerFt);
      });
      // The control reports GRADIENTS only. The isothermal pressure at every
      // station would be a new teaching number for no new teaching, and one of
      // them sits closer to a graded capstone pressure than anything else in
      // the lab does, so it is deliberately not published.
      rows.forEach((r) => expect(r.isothermalPsia).toBeUndefined());
    });
  });

  it('columnExplorer.gradient carries that control, so the panel computes nothing', () => {
    const g = L.columnExplorer.gradient(1);
    expect(g.control).toEqual(L.isothermalControlRows(1));
    expect(g.control).toHaveLength(g.rows.length);
  });

  it('the two effects are the same column run twice, so only the geotherm differs', () => {
    const s = L.ruleOfThumbSummary(1);
    // Both start from the same surface gradient, because at surface the
    // isothermal column IS the geothermal one.
    expect(s.isothermalSurfaceGradientPsiPerFt).toBe(s.surfaceGradientPsiPerFt);
    expect(s.isothermalTempF).toBe(s.surfaceTempF);
    expect(s.isothermalMinusGeothermalPsi).toBeGreaterThan(0);
  });
});

describe('CLAIM: the column converges, which is the honest negative result', () => {
  it('the error ratio sits near 4, so the march is second order as its comment says', () => {
    L.refinementTargets().forEach((t) => {
      const rows = L.stepRefinementRows(t);
      // The tail of the sequence, where the asymptotic order has taken hold.
      rows.slice(-4).forEach((r) => {
        expect(r.errorRatio, `${t.label} at ${r.steps} steps`).toBeGreaterThan(3.5);
        expect(r.errorRatio).toBeLessThan(4.5);
      });
    });
  });

  it('at the step count the engine ACTUALLY uses the error is thousandths of a psi', () => {
    L.refinementTargets().forEach((t) => {
      const h = L.stepRefinementHeadline(t);
      expect(Math.abs(h.spreadPsi), t.label).toBeLessThan(0.02);
      expect(Math.abs(h.spreadAsFractionOfLift), t.label).toBeLessThan(1e-4);
    });
    expect(L.ENGINE_SPACING_STEPS).toBe(20);
    expect(L.ENGINE_CURVE_STEPS).toBe(40);
  });

  it('the chord bias of the plotted curve is NEGATIVE and falls by four per doubling', () => {
    [1, 2, 3].forEach((i) => {
      const rows = L.chordBiasRows(i);
      rows.forEach((r) => expect(r.chordComponentPsi, `column ${i} at ${r.samples}`).toBeLessThan(0));
      // a chord under a concave curve reads low, and the concavity is the
      // falling gradient the section above pinned
      for (let k = 1; k < rows.length; k += 1) {
        const ratio = rows[k - 1].chordComponentPsi / rows[k].chordComponentPsi;
        expect(ratio, `column ${i} ${rows[k - 1].samples} to ${rows[k].samples}`).toBeGreaterThan(3);
        expect(ratio).toBeLessThan(5);
      }
      const at64 = rows.find((r) => r.samples === 64);
      expect(Math.abs(at64.chordComponentPsi)).toBeLessThan(0.01);
    });
  });
});

describe('CLAIM: two closed forms, and only one of them the march can reach', () => {
  it('the engine coefficient is AIR_MW over 144 R and it is NOT the textbook 0.01875', () => {
    const k = L.closedFormCoefficients();
    relNear(k.engineCoeff, k.airMolarMass / (144 * k.gasConstant), 1e-15);
    expect(k.textbookCoeff).toBe(0.01875);
    expect(k.engineCoeff).not.toBe(k.textbookCoeff);
    near(k.relativeDifference, 4.43e-4, 1e-6);
  });

  it('THE PARK: against the textbook form the error stops falling', () => {
    L.closedFormRows().forEach((c) => {
      const errs = c.marches.map((m) => Math.abs(m.errorAgainstTextbookPsi));
      const last = errs[errs.length - 1];
      const secondLast = errs[errs.length - 2];
      // refinement buys nothing at all at the tail: the residual has parked
      relNear(last, secondLast, 1e-3);
      // and it is parked on the FORM gap, not on zero
      relNear(last, Math.abs(c.formDifferencePsi), 1e-3);
    });
  });

  it('THE CONVERGENCE: against the engine constant form the error keeps shrinking', () => {
    L.closedFormRows().forEach((c) => {
      const errs = c.marches.map((m) => Math.abs(m.errorAgainstEnginePsi));
      for (let k = 1; k < errs.length; k += 1) {
        expect(errs[k], `${c.pSurfPsia} at ${c.marches[k].steps} steps`).toBeLessThan(errs[k - 1]);
      }
      expect(errs[errs.length - 1]).toBeLessThan(1e-6);
    });
  });

  it('which is the difference between a TRUNCATION and a FORMULATION gap', () => {
    // The teaching point. Refinement removes the first and never touches the
    // second, and a gate that measures the second cannot fail.
    const c = L.closedFormRows()[0];
    const parked = Math.abs(c.marches[c.marches.length - 1].errorAgainstTextbookPsi);
    const converged = Math.abs(c.marches[c.marches.length - 1].errorAgainstEnginePsi);
    expect(parked / converged).toBeGreaterThan(1e5);
  });
});

describe('CLAIM: a dome charge is a thermometer, and the linear rule of thumb drifts', () => {
  it('the real gas Ct and the linear rule disagree, and by more the hotter it gets', () => {
    const rows = [...L.nitrogenRows()].sort((a, b) => a.tF - b.tF);
    rows.forEach((r) => expect(r.linearCt).not.toBe(r.goldenCt));
    const hottest = rows[rows.length - 1];
    const coolest = rows[0];
    expect(Math.abs(hottest.linearCtErrorPct)).toBeGreaterThan(Math.abs(coolest.linearCtErrorPct));
  });

  it('the engine solves a fixed volume real gas ratio and never a chart factor', () => {
    const r = L.nitrogenRows()[0];
    const zT = L.nitrogenZ({ pPsia: r.goldenDomeAtTempPsia, tF: r.tF });
    const z60 = L.nitrogenZ({ pPsia: r.pd60Psia, tF: L.TEST_RACK_TEMP_F });
    relNear(
      r.goldenDomeAtTempPsia / (zT * L.toRankine(r.tF)),
      r.pd60Psia / (z60 * L.toRankine(L.TEST_RACK_TEMP_F)),
      1e-8,
    );
    relNear(zT, r.goldenZt, 1e-8);
    relNear(z60, r.goldenZ60, 1e-8);
  });
});

describe('CLAIM: below the critical ratio a throughput does not move at all', () => {
  it('every choked row passes the same rate whatever the downstream pressure', () => {
    const rows = L.throughputRegimeRows();
    const choked = rows.filter((r) => r.regime === 'critical');
    expect(choked.length).toBeGreaterThan(3);
    choked.forEach((r) => relNear(r.qMscfd, choked[0].qMscfd, 1e-12));
    const sub = rows.filter((r) => r.regime === 'subcritical');
    // and above it the rate falls away as the differential closes
    for (let k = 1; k < sub.length; k += 1) {
      expect(sub[k].qMscfd).toBeLessThan(sub[k - 1].qMscfd);
    }
  });

  it('the two branches meet at the critical ratio, and the sweep brackets it', () => {
    const rows = L.throughputRegimeRows();
    const rc = L.criticalPressureRatio(1.27);
    const lastCritical = [...rows].reverse().find((r) => r.regime === 'critical');
    const firstSub = rows.find((r) => r.regime === 'subcritical');
    expect(lastCritical.ratio).toBeLessThanOrEqual(rc);
    expect(firstSub.ratio).toBeGreaterThan(rc);
    // The row the digest labels with the critical ratio reads SUBCRITICAL,
    // because 0.551208317714 is a twelve figure rounding of rc and the engine
    // clamps on `raw <= rc`. Worth pinning: a lesson that reads that row as the
    // choked branch has the wrong side of a strict inequality.
    const printed = rows.find((r) => r.ratio === 0.551208317714);
    expect(printed.regime).toBe('subcritical');
    relNear(printed.qMscfd, lastCritical.qMscfd, 1e-9);
  });
});

describe('CLAIM: spacing is a recursion, and there are TWO ROADS to its depths', () => {
  it('the standalone recursion and the design itself agree to about seven figures', () => {
    const road1 = L.spacingRecursionRows('westTexasOil');
    const road2 = L.designSpacingIncrements('westTexasOil');
    road1.forEach((v, k) => {
      if (v.isTargetDepthMandrel) return;
      const inc2 = road2[k].incrementFt;
      relNear(v.incrementFt, inc2, 1e-6);
      // and NO FURTHER. They are two roads to one quantity and the fixed point
      // is stopped at a tolerance rather than solved.
      expect(v.incrementFt).not.toBe(inc2);
    });
  });

  it('and the LAST mandrel is not on either road: it is pulled to the target depth', () => {
    // The one increment a panel must never compare across the two roads. The
    // recursion says where the valve wanted to go, the design says where the
    // floor put it, and on westTexasOil those are 325.9 ft apart.
    const last = L.spacingRecursionRows('westTexasOil').find((v) => v.isTargetDepthMandrel);
    const design = L.designSpacingIncrements('westTexasOil');
    const designLast = design[design.length - 1].incrementFt;
    expect(last.convergedFt).toBeGreaterThan(L.designInputs('westTexasOil').maxDepthFt);
    expect(Math.abs(last.incrementFt - designLast)).toBeGreaterThan(50);
    expect(L.designAgreement('westTexasOil').goldenStopReason).toBe('targetDepth');
  });

  it('the two roads have distinct names, and the digest quotes both to twelve figures', () => {
    // 1563.466592902 ft on the recursion and 1563.466503048 ft on the design.
    near(L.spacingRecursionRows('westTexasOil')[0].incrementFt, 1563.466592902, 5e-9);
    near(L.designSpacingIncrements('westTexasOil')[0].incrementFt, 1563.466503048, 5e-9);
    expect(typeof L.spacingRecursionRows).toBe('function');
    expect(typeof L.designSpacingIncrements).toBe('function');
  });

  it('the recursion converges to the engine tolerance and its last move is inside it', () => {
    L.spacingRecursionRows('westTexasOil').forEach((v) => {
      const last = v.iterates[v.iterates.length - 1];
      expect(Math.abs(last.moveFt), `valve ${v.valve}`).toBeLessThan(L.FIXED_POINT_TOLERANCE_FT);
    });
    expect(L.FIXED_POINT_TOLERANCE_FT).toBe(0.01);
  });

  it('the increments SHRINK on the way down, which is why a string runs out of room', () => {
    const inc = L.designSpacingIncrements('westTexasOil').map((d) => d.incrementFt);
    for (let k = 1; k < inc.length; k += 1) expect(inc[k]).toBeLessThan(inc[k - 1]);
  });

  it('the top valve is a fixed point too, and the weight of the gas moves it DEEPER', () => {
    L.PUBLISHED_DESIGN_IDS.forEach((id) => {
      const t = L.topValveIteration(id);
      relNear(t.engineFt, t.publishedValve1Ft, 1e-6);
      expect(t.gasWeightBuysFt, id).toBeGreaterThan(0);
      const last = t.iterates[t.iterates.length - 1];
      expect(Math.abs(last.moveFt)).toBeLessThan(L.FIXED_POINT_TOLERANCE_FT);
    });
  });
});

describe('CLAIM: a design is a string and not a list of valves', () => {
  it('VALVE 1 NEVER MOVES when the decrement moves, and nothing below it stays put', () => {
    Object.keys(L.DECREMENT_SWEEPS).forEach((id) => {
      const rows = L.decrementSweepRows(id);
      rows.forEach((r) => {
        near(r.depths[0].shiftFt, 0, 1e-9);
        // and every valve below it does move, on every row but the published one
        if (r.isPublished) return;
        const floorFt = L.designInputs(id).maxDepthFt;
        r.depths.slice(1).forEach((d) => {
          if (d.shiftFt === null) return;
          // A mandrel that has been pulled to the target depth is pinned to the
          // floor on every row of the sweep, so it cannot move and does not
          // count as a valve the decrement failed to shift.
          if (d.depthFt === floorFt) return;
          expect(Math.abs(d.shiftFt), `${id} at ${r.decrementPsi} valve ${d.valve}`)
            .toBeGreaterThan(0);
        });
      });
    });
  });

  it('and the move COMPOUNDS downward, so the deepest valve moves furthest', () => {
    const rows = L.decrementSweepRows('westTexasOil');
    const wide = rows.find((r) => r.decrementPsi === 15);
    const floorFt = L.designInputs('westTexasOil').maxDepthFt;
    const shifts = wide.depths
      .filter((d) => d.shiftFt !== null && d.depthFt !== floorFt)
      .map((d) => d.shiftFt);
    for (let k = 2; k < shifts.length; k += 1) {
      expect(Math.abs(shifts[k])).toBeGreaterThan(Math.abs(shifts[k - 1]));
    }
  });

  it('the top valve reads the kickoff pressure and NOT the decrement', () => {
    // the one depth in the string a decrement change cannot move
    const base = L.topValveIteration('westTexasOil').engineFt;
    L.decrementSweepRows('westTexasOil').forEach((r) => near(r.depths[0].depthFt, base, 1e-9));
  });
});

describe('CLAIM: the two conventions are ONE recursion with a different decrement', () => {
  it('constantPressure holds the surface pressure on every valve', () => {
    ['westTexasOil', 'midDecrementKnifeEdge'].forEach((id) => {
      const c = L.conventionComparison(id);
      const cp = c.rows.map((r) => r.constantPressurePsia).filter((x) => x !== null);
      cp.forEach((p) => expect(p).toBe(cp[0]));
      // while surfaceClose walks it down by the published decrement per valve
      const sc = c.rows.map((r) => r.surfaceClosePsia).filter((x) => x !== null);
      for (let k = 1; k < sc.length; k += 1) near(sc[k - 1] - sc[k], c.decrementPsi, 1e-9);
    });
  });

  it('THE TRADE: fewer valves, wider steps, and the closing mechanism removed', () => {
    ['westTexasOil', 'midDecrementKnifeEdge'].forEach((id) => {
      const c = L.conventionComparison(id);
      expect(c.constantPressure.valveCount, id).toBeLessThanOrEqual(c.surfaceClose.valveCount);
    });
  });
});

describe('CLAIM: the target depth mandrel is exempt from minSpacingFt', () => {
  it('two of the four published cases land a mandrel inside their own stated minimum', () => {
    const exempt = L.stopReasonRows().filter((r) => r.exempt);
    expect(exempt.map((r) => r.id)).toEqual(['westTexasOil', 'constantPressurePPO']);
    near(exempt[0].lastIncrementFt, 131.375432376, 5e-9);
    expect(exempt[0].minSpacingFt).toBe(250);
    near(exempt[1].lastIncrementFt, 152.956208919, 5e-9);
    expect(exempt[1].minSpacingFt).toBe(200);
  });

  it('and no warning is raised on either, because the branch returns before the test', () => {
    ['westTexasOil', 'constantPressurePPO'].forEach((id) => {
      expect(L.designAgreement(id).warningCodes, id).not.toContain('minSpacing');
      expect(L.designAgreement(id).goldenStopReason).toBe('targetDepth');
    });
  });

  it('the OTHER branch does take the test, on the case that stops on minSpacing', () => {
    const m = L.minSpacingExemption();
    expect(L.designAgreement('deepHighPressure').warningCodes).toContain('minSpacing');
    expect(m.checkedShortOfFloorFt).toBeGreaterThan(0);
    expect(m.checkedDeepestFt).toBeLessThan(m.checkedFloorFt);
  });

  it('the oracle mirrors the same branch ordering, so the goldens do not catch it', () => {
    // stated because it is the reason the defect survived a validated extraction
    L.stopReasonRows().filter((r) => r.exempt).forEach((r) => {
      expect(r.lastIncrementFt).toBeLessThan(r.minSpacingFt);
    });
  });
});

describe('CLAIM: the PPO spread sign and the PPO closing test are ONE defect', () => {
  it('every spread in the published PPO string is NEGATIVE', () => {
    const p = L.ppoDivergence();
    expect(p.everySpreadNegative).toBe(true);
    const values = p.spreads.map((s) => s.spreadPsi);
    near(Math.min(...values), -52.249540846, 5e-9);
    near(Math.max(...values), -31.296561503, 5e-9);
  });

  it('a spread is a pressure FALL, so a negative one is the two sides swapped', () => {
    // valveSpread is r * (pOpen - pOtherSide) and it is handed pOpen = pProd for
    // a PPO valve, so on a well whose casing sits above its tubing the sign
    // inverts. Rebuild it the right way round and it is positive.
    const g = L.publishedDesignRecord('constantPressurePPO');
    g.valves.forEach((v) => {
      if (v.spreadPsi === null || v.spreadPsi === undefined) return;
      const asShipped = L.valveSpread({
        pOpenPsia: v.pProdAtDepthPsia, pOtherSidePsia: v.pInjAtDepthPsia, r: v.r,
      });
      relNear(asShipped, v.spreadPsi, 1e-9);
      expect(-asShipped).toBeGreaterThan(0);
    });
  });

  it('THE SAME LINE closes the string on the wrong fluid, and that is the louder symptom', () => {
    const p = L.ppoDivergence();
    // the casing side test clears comfortably on every valve
    expect(p.casingClearsFromPsi).toBeGreaterThan(379);
    expect(p.casingClearsToPsi).toBeLessThan(725);
    // while the tubing side rule it should be judged by misses on every one
    expect(p.tubingMissesFromPsi).toBeGreaterThan(31);
    expect(p.tubingMissesToPsi).toBeLessThan(53);
    // so the two disagree on every later stage
    expect(p.laterStages).toBe(5);
    expect(p.engineMultipointingStages).toHaveLength(5);
    expect(p.oracleMultipointingStages).toHaveLength(0);
  });

  it('it is a PINNED KNOWN DIVERGENCE and the lab does not pretend it is fixed', () => {
    expect(L.unloadingVerdictAgreement('constantPressurePPO')).toBe(false);
    expect(L.refusals().some((r) => r.includes('wrong fluid'))).toBe(true);
  });
});

describe('CLAIM: the multipointing verdict sits on a knife edge, on a PUBLISHED case', () => {
  it('the knife edge is midDecrementKnifeEdge and NEVER the capstone', () => {
    const k = L.knifeEdge();
    expect(k.id).toBe('midDecrementKnifeEdge');
    expect(k.decrementPsi).toBe(26.75);
    expect(k.multipointingStages).toEqual([2, 3, 4, 5]);
    expect(k.cleanStages).toEqual([1, 6, 7]);
  });

  it('the stage 5 margin is a fraction of a psi on a system of over a thousand psia', () => {
    const k = L.knifeEdge();
    near(k.oracleMarginPsi, 0.149791635, 5e-9);
    near(k.engineMarginPsi, 0.124769727, 5e-9);
    expect(k.pKickoffPsia).toBeGreaterThan(1000);
    expect(k.injectionAtValve4Psia).toBeGreaterThan(1000);
    // two roads to the same knife edge, and BOTH are small, which is the point
    expect(Math.abs(k.oracleMarginPsi)).toBeLessThan(1);
    expect(Math.abs(k.engineMarginPsi)).toBeLessThan(1);
  });

  it('THE MECHANISM: the open flag IS the casing DROP against the valve SPREAD', () => {
    const rows = L.knifeEdgeMechanismRows();
    expect(rows).toHaveLength(6);
    rows.forEach((r) => {
      expect(r.open, `valve ${r.valve}`).toBe(r.spreadPsi >= r.casingDropPsi);
    });
    const v4 = rows.find((r) => r.valve === 4);
    near(v4.spreadPsi, 32.272254090, 5e-9);
    near(v4.casingDropPsi, 32.122462454, 5e-9);
    near(v4.spreadLessDropPsi, 0.149791635, 5e-9);
  });

  it('THE TRAP: the drop AT DEPTH is not the SURFACE decrement, and it grows with depth', () => {
    const rows = L.knifeEdgeMechanismRows();
    rows.forEach((r) => expect(r.casingDropPsi, `valve ${r.valve}`).toBeGreaterThan(r.decrementPsi));
    near(rows[0].casingDropPsi, 28.652797457, 5e-9);
    near(rows[rows.length - 1].casingDropPsi, 33.355029522, 5e-9);
    for (let k = 1; k < rows.length; k += 1) {
      expect(rows[k].casingDropPsi).toBeGreaterThan(rows[k - 1].casingDropPsi);
    }
  });

  it('the verdict flips on a quarter of a psi per valve of decrement', () => {
    const rows = L.knifeEdgeDecrementRows();
    const at2680 = rows.find((r) => r.decrementPsi === 26.80);
    const at2690 = rows.find((r) => r.decrementPsi === 26.90);
    expect(at2680.stage5Multipointing).toBe(true);
    expect(at2690.stage5Multipointing).toBe(false);
    expect(at2680.multipointingStages).toEqual([2, 3, 4, 5]);
    expect(at2690.multipointingStages).toEqual([2, 3, 4]);
    // and the margin moves SMOOTHLY across the flip: a slope, not a step
    for (let k = 1; k < rows.length; k += 1) {
      expect(rows[k].stage5MarginPsi).toBeLessThan(rows[k - 1].stage5MarginPsi);
    }
  });

  it('R reaches the verdict through the dome charge, from either half of it', () => {
    const ports = L.knifeEdgePortRows();
    for (let k = 1; k < ports.length; k += 1) expect(ports[k].r).toBeGreaterThan(ports[k - 1].r);
    const bellows = L.knifeEdgeBellowsRows();
    for (let k = 1; k < bellows.length; k += 1) expect(bellows[k].r).toBeLessThan(bellows[k - 1].r);
    expect(bellows.find((b) => b.isPublished).bellowsAreaIn2).toBe(0.77);
  });
});

describe('CLAIM: the design gas rate moves the verdict as a STEP, not as a slope', () => {
  it('the margin is FROZEN across a whole band of design rates', () => {
    const rows = L.knifeEdgeGasRateRows();
    const frozen = rows.filter((r) => r.qgiTargetMscfd >= 400 && r.qgiTargetMscfd <= 1400);
    expect(frozen.length).toBeGreaterThanOrEqual(6);
    frozen.forEach((r) => near(r.stage5MarginPsi, 0.124769727, 5e-9));
  });

  it('and then JUMPS when the target crosses a catalogue step', () => {
    const rows = L.knifeEdgeGasRateRows();
    const at1400 = rows.find((r) => r.qgiTargetMscfd === 1400);
    const at1600 = rows.find((r) => r.qgiTargetMscfd === 1600);
    near(at1600.stage5MarginPsi, 15.249903355, 5e-9);
    expect(at1600.stage5MarginPsi - at1400.stage5MarginPsi).toBeGreaterThan(15);
    // and it gains a multipointing stage in the same jump
    expect(at1400.multipointingStages).toEqual([2, 3, 4, 5]);
    expect(at1600.multipointingStages).toEqual([2, 3, 4, 5, 6]);
    // because the ports moved, which is the ONLY road the gas rate has
    expect(at1400.ports).not.toEqual(at1600.ports);
  });

  it('so a coarse sweep can miss the flip and a fine one finds nothing between the steps', () => {
    // the shape of the sensitivity, which is the lesson, not the magnitude
    const rows = L.knifeEdgeGasRateRows();
    const distinct = new Set(rows.map((r) => r.stage5MarginPsi.toFixed(6)));
    expect(distinct.size).toBeLessThan(rows.length);
  });
});

describe('CLAIM: the validation gap was coverage that was not coverage', () => {
  it('the goldens now carry an unloading key on every design, counted not asserted', () => {
    const v = L.validationGap();
    expect(v.publishedCases).toBe(4);
    expect(v.stageRows).toBe(28);
    expect(v.marginRows).toBe(85);
    expect(v.ipoStages).toBe(22);
  });

  it('and the engine agrees with the oracle in SIGN on every IPO closing margin row', () => {
    expect(L.validationGap().signAgreement).toBe(true);
  });

  it('the two roads are different numbers for the same verdict, so both are reported', () => {
    const k = L.knifeEdge();
    expect(k.oracleMarginPsi).not.toBe(k.engineMarginPsi);
    expect(Math.sign(k.oracleMarginPsi)).toBe(Math.sign(k.engineMarginPsi));
  });
});

describe('CLAIM: the chord cannot see its own error, and there are TWO RUNS of it', () => {
  it('RUN ONE, the shipped engine line: 1.32 ft out on a residual of 4.68e-3 psi', () => {
    const s = L.injectionPointShipped();
    near(s.depthErrorFt, -1.317711139, 5e-9);
    near(s.reportedResidualPsi, 4.67696e-3, 1e-8);
    near(s.trueResidualPsi, 1.58211e-1, 1e-6);
    near(s.trueOverReported, 33.83, 5e-3);
    // and the reported residual is comfortably inside the gate the engine allows
    expect(Math.abs(s.reportedResidualPsi)).toBeLessThan(L.INJECTION_POINT_GATE_PSI);
    expect(L.INJECTION_POINT_GATE_PSI).toBe(0.5);
  });

  it('RUN TWO, the refinement at the same shipped spacing: a DIFFERENT residual and ratio', () => {
    const r = L.injectionPointTabulationRows().find((x) => x.isShippedSpacing);
    expect(r.rows).toBe(9);
    expect(r.spacingFt).toBe(1000);
    near(r.depthErrorFt, -1.318735072, 5e-9);
    near(r.reportedResidualPsi, 4.8890e-3, 1e-7);
    near(r.trueResidualPsi, 1.5833e-1, 1e-5);
    near(r.trueOverReported, 32.386, 5e-4);
  });

  it('the two runs answer DIFFERENT questions and the lab names them apart', () => {
    const shipped = L.injectionPointShipped();
    const refined = L.injectionPointTabulationRows().find((x) => x.isShippedSpacing);
    expect(shipped.reportedResidualPsi).not.toBe(refined.reportedResidualPsi);
    expect(shipped.trueOverReported).not.toBe(refined.trueOverReported);
    // the shipped answer is the one a user of the studio is handed
    relNear(shipped.depthFt, L.injectionPointGolden().expectedDepthFt, 1e-6);
  });

  it('THE RESIDUAL DOES NOT FALL AS THE ERROR FALLS', () => {
    const rows = L.injectionPointTabulationRows();
    // the error falls by three orders of magnitude across the refinement
    const first = Math.abs(rows[0].depthErrorFt);
    const last = Math.abs(rows[rows.length - 1].depthErrorFt);
    expect(first / last).toBeGreaterThan(1000);
    // while the ratio between the true residual and the reported one does NOT
    // track it. On the tabulations a designer would actually use it is 28 to 97
    // times one.
    rows.filter((r) => r.spacingFt >= 500).forEach((r) => {
      expect(r.trueOverReported, `${r.spacingFt} ft`).toBeGreaterThan(25);
    });
    // and it is NOT MONOTONE, which is the sharpest form of the finding: at
    // 250 ft spacing the ratio drops to 2.08 and then climbs back to 44.6 at
    // 7.8 ft, so a reader watching the residual cannot even tell which
    // direction the error is moving in.
    const ratios = rows.map((r) => r.trueOverReported);
    const dip = Math.min(...ratios);
    expect(dip).toBeLessThan(3);
    expect(ratios[ratios.length - 1]).toBeGreaterThan(dip * 10);
    expect(ratios.every((x) => x > 1)).toBe(true);
  });

  it('the OTHER chord barely moves the answer, which is why the defect is hard to see', () => {
    const rows = L.injectionPointColumnRows();
    const spread = Math.max(...rows.map((r) => r.depthFt)) - Math.min(...rows.map((r) => r.depthFt));
    // refining the thing that is easy to refine changes nothing
    expect(spread).toBeLessThan(0.1);
  });

  it('AT FULL SIZE on the teaching traverse: 60 ft out, and a ratio of 678', () => {
    const rows = L.teachingTraverseRefinementRows();
    const coarse = rows[0];
    expect(coarse.rows).toBe(4);
    near(coarse.spacingFt, 2400, 1e-9);
    near(coarse.depthErrorFt, -60.420814470, 5e-9);
    near(coarse.reportedResidualPsi, 1.5907e-2, 1e-6);
    near(coarse.trueResidualPsi, 1.0789e+1, 1e-4);
    near(coarse.trueOverReported, 678.26, 5e-3);
    // still inside the 0.5 psi its own gate allows, on an answer 60 ft out
    expect(Math.abs(coarse.reportedResidualPsi)).toBeLessThan(L.INJECTION_POINT_GATE_PSI);
  });

  it('THE RATIO IS A PROPERTY OF THE MECHANISM: it holds near 670 down the refinement', () => {
    const ratios = L.teachingTraverseRefinementRows().slice(1, 7).map((r) => r.trueOverReported);
    [689.13, 659.81, 674.71, 669.88, 667.53, 674.88].forEach((expected, k) => {
      near(ratios[k], expected, 5e-3);
    });
  });

  it('and the published case alone makes the defect look negligible, which is the trap', () => {
    // 33.83 against 678.26. It is the RATIO, not the magnitude, that is the
    // finding, and a lesson that only ever saw the published case would say the
    // opposite.
    expect(L.teachingTraverseRefinementRows()[0].trueOverReported)
      .toBeGreaterThan(L.injectionPointShipped().trueOverReported * 15);
  });

  it('the teaching traverse is a CONSTRUCT and says so in its own coefficients', () => {
    expect(L.TEACHING_TRAVERSE.interceptPsia).toBe(144.7);
    expect(L.TEACHING_TRAVERSE.slopePsiPerFt).toBe(0.11);
    expect(L.TEACHING_TRAVERSE.curvaturePsiPerFt2).toBe(8e-6);
    L.teachingTraverseRows().forEach((r) => {
      relNear(r.pProdPsia, 144.7 + 0.11 * r.tvdFt + 8e-6 * r.tvdFt * r.tvdFt, 1e-15);
    });
    // and its exact crossing is a root, so the residual there is machine zero
    expect(Math.abs(L.teachingTraverseExact().residualPsi)).toBeLessThan(1e-9);
  });
});

describe('CLAIM: limitedBy has three returns and only one of them is a crossing', () => {
  it('gas still winning at the deepest row returns that row and says DEPTH', () => {
    const rows = L.injectionPointLimitedByRows(L.LIMITED_BY_HIGH_PSIA);
    const deep = rows.filter((r) => r.limitedBy === 'depth');
    expect(deep.length).toBeGreaterThan(0);
    deep.forEach((r) => expect(r.depthFt).toBe(L.injectionPointGolden().maxDepthFt));
  });

  it('falling surface pressure walks the crossing back up the hole', () => {
    const rows = L.injectionPointLimitedByRows(L.LIMITED_BY_LOW_PSIA);
    rows.forEach((r) => expect(r.limitedBy).toBe('pressure'));
    for (let k = 1; k < rows.length; k += 1) {
      expect(rows[k].depthFt).toBeLessThan(rows[k - 1].depthFt);
    }
  });

  it('THE THIRD RETURN: gas losing at the very first row gives depth 0, called PRESSURE', () => {
    // None of the digest's own sweeps reaches this branch, so it is exercised
    // here rather than asserted from prose. The published traverse starts at
    // 164.7 psia and the transfer differential is 100 psi, so any surface
    // pressure under 264.7 psia loses at the very first tabulated row.
    const dead = L.injectionPointLimitedByRows([214.7]);
    expect(dead[0].depthFt).toBe(0);
    expect(dead[0].limitedBy).toBe('pressure');
    // which is the engine's way of saying the well will not lift at all, and is
    // NOT a crossing: the margin at that depth is negative.
    expect(dead[0].pInjPsia - L.injectionPointGolden().dpTransferPsi - dead[0].pProdPsia)
      .toBeLessThan(0);
  });

  it('so a lesson must not read a limitedBy depth as a crossing', () => {
    const rows = L.injectionPointLimitedByRows(L.LIMITED_BY_HIGH_PSIA);
    rows.filter((r) => r.limitedBy === 'depth').forEach((r) => {
      // at a limitedBy depth return the gas is still WINNING, so the margin is
      // positive and nothing crossed
      expect(r.pInjPsia - L.injectionPointGolden().dpTransferPsi - r.pProdPsia).toBeGreaterThan(0);
    });
  });

  it('depth is bought with surface pressure and paid for with transfer differential', () => {
    const bySurface = L.depthPurchaseBySurfaceRows();
    for (let k = 1; k < bySurface.length; k += 1) {
      expect(bySurface[k].depthFt).toBeGreaterThanOrEqual(bySurface[k - 1].depthFt);
    }
    const byTransfer = L.depthPurchaseByTransferRows();
    for (let k = 1; k < byTransfer.length; k += 1) {
      expect(byTransfer[k].depthFt).toBeLessThanOrEqual(byTransfer[k - 1].depthFt);
    }
  });
});

describe('CLAIM: what the engine refuses to do', () => {
  it('ten refusals, and every one of them is a limit the lessons must state', () => {
    const r = L.refusals();
    expect(r).toHaveLength(10);
    ['IPR', 'multiphase outflow', 'STRAIGHT LINES', 'STATIC', 'intermittent',
      'Dranchuk', 'ORIFICE', 'minSpacingFt', 'wrong fluid', 'residual']
      .forEach((token) => {
        expect(r.some((x) => x.includes(token)), token).toBe(true);
      });
  });

  it('the traverse is PASSED IN, which is why the chord defect is the caller problem too', () => {
    // deepestInjectionPoint takes a table, so the resolution of that table is a
    // decision the caller makes and the function never checks.
    const ip = L.injectionPointGolden();
    expect(Array.isArray(ip.traverse)).toBe(true);
    expect(ip.traverse[0]).toHaveProperty('tvdFt');
    expect(ip.traverse[0]).toHaveProperty('pPsia');
  });
});

describe('CLAIM: the two teaching constructs are labelled as constructs', () => {
  it('AKASO-3 runs the same string three ways, which no published case can do', () => {
    expect(L.TEACHING_WELL.id).toBe('AKASO-3');
    expect(L.TEACHING_WELL_VARIANTS.map((v) => v.name)).toEqual([
      'surfaceClose IPO', 'constantPressure IPO', 'surfaceClose PPO',
    ]);
    const ipo = L.teachingWellDesign('surfaceClose IPO');
    const cp = L.teachingWellDesign('constantPressure IPO');
    const ppo = L.teachingWellDesign('surfaceClose PPO');
    expect(ipo.depths[0]).toBe(cp.depths[0]);
    expect(ipo.depths).toEqual(ppo.depths);
    expect(cp.depths.length).toBeLessThanOrEqual(ipo.depths.length);
  });

  it('and the PPO variant shows the divergence on a well the learner has already met', () => {
    const rows = L.teachingWellValveRows('surfaceClose PPO')
      .filter((v) => v.spreadPsi !== null && v.spreadPsi !== undefined);
    expect(rows.length).toBeGreaterThan(0);
    rows.forEach((v) => expect(v.spreadPsi).toBeLessThan(0));
  });

  it('neither construct is in the goldens, and neither is named as if it were', () => {
    expect(G.designs.map((d) => d.id)).not.toContain('AKASO-3');
    const text = L.teachingDigestLines().filter((l) => l.includes('AKASO-3'));
    expect(text.length).toBeGreaterThan(0);
    // Every data line naming it is prefixed `teaching`. The rest are the
    // header, the provenance legend and the section titles, which are prose.
    text.forEach((l) => {
      expect(l.startsWith('teaching ') || l.startsWith('#') || l.startsWith(' '), l).toBe(true);
    });
    expect(text.filter((l) => l.startsWith('teaching ')).length).toBeGreaterThan(100);
  });
});

// ---------------------------------------------------------------------------
// 3. THE EIGHTEEN GRADED FIELDS.
// ---------------------------------------------------------------------------

describe('the capstone derivation', () => {
  const values = L.capstoneValues();

  it('reproduces all eighteen graded answers inside the grader own absolute band', () => {
    CAPSTONE_FIELDS.forEach(([, key, expected, tol]) => {
      expect(values[key], key).toBeDefined();
      expect(Math.abs(values[key] - expected), `${key}: ${values[key]} against ${expected}`)
        .toBeLessThanOrEqual(tol);
    });
  });

  it('carries exactly eighteen fields, six to a tier', () => {
    expect(Object.keys(values)).toHaveLength(18);
    ['beginner', 'intermediate', 'advanced'].forEach((tier) => {
      expect(Object.values(L.CAPSTONE_TIERS).filter((t) => t === tier)).toHaveLength(6);
    });
    CAPSTONE_FIELDS.forEach(([tier, key, , tol]) => {
      expect(L.CAPSTONE_TIERS[key]).toBe(tier);
      expect(L.CAPSTONE_TOLERANCES[key]).toBe(tol);
      expect(L.CAPSTONE_FIELD_UNITS[key]).toBeTruthy();
    });
  });

  it('is deterministic', () => {
    expect(L.capstoneValues()).toEqual(values);
  });

  it('and its conditions differ from every published case, which is why it can be graded', () => {
    // If the capstone shared a condition with a golden, a learner could read the
    // answer out of a lesson. Every numeric condition below is different.
    const goldenValues = new Set();
    G.designs.forEach((d) => Object.values(d.inputs).forEach((v) => {
      if (typeof v === 'number') goldenValues.add(v);
    }));
    [L.CAP.pKickoffPsia, L.CAP.pOperatingPsia, L.CAP.dpPerValvePsi, L.CAP.dpTransferPsi,
      L.CAP.killGradPsiPerFt, L.CAP.unloadGradPsiPerFt, L.CAP.pWhUnloadPsia,
      L.CAP.minSpacingFt, L.CAP.gasSg, L.CAP.maxDepthFt, L.CAP.bellowsAreaIn2,
      L.CAP.qgiTargetMscfd].forEach((v) => {
      expect(goldenValues.has(v), `capstone condition ${v} is also a golden input`).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// 4. THE SEVENTY EIGHT SHIPPED LESSONS.
// ---------------------------------------------------------------------------

const DIGEST_PATH = '/root/pd-wip-gaslift/digest.txt';
const digestAvailable = fs.existsSync(DIGEST_PATH);

/**
 * The one place the VENDORED ENGINE is now ahead of the shipped digest.
 *
 * `designGasLift`'s `portTooSmall` message used to round the port's passed rate
 * to whole Mscf/d while printing the target it was compared with in the same
 * sentence, so a port passing 339.9 against a 900 target could render as
 * "passes 340 Mscf/d, short of the 900 Mscf/d target" and, at a closer call,
 * as "passes 1000 Mscf/d, short of the 1000 Mscf/d target", which reads as
 * equal. The engine now prints one decimal. The re-vendor at engines 8520a8c
 * (nextgen aa018783, 2026-09-04 10:04 local) landed after digest.txt was cut at
 * 08:56 UTC, so the file carries the old wording on three lines.
 *
 * NO TEACHING NUMBER MOVED. This is a display string inside a warning message,
 * the depth in the same message is unchanged, and the whole rest of the 2483
 * line digest reproduces character for character. It is listed rather than
 * hidden so that a lesson quoting the old wording can be found and corrected.
 */
const DIGEST_BEHIND_THE_ENGINE = [
  'derived stop reason sweep, portTooSmall message: Valve 1 at 2119 ft: the largest port in the catalog passes 340 Mscf/d, short of the 900 Mscf/d target.',
  'derived stop reason sweep, portTooSmall message: Valve 2 at 3683 ft: the largest port in the catalog passes 339 Mscf/d, short of the 900 Mscf/d target.',
  'derived stop reason sweep, portTooSmall message: Valve 3 at 4902 ft: the largest port in the catalog passes 335 Mscf/d, short of the 900 Mscf/d target.',
];

describe('the teaching digest', () => {
  const lines = L.teachingDigestLines();

  it('is the 23 section file the lessons were written from', () => {
    expect(lines.length).toBeGreaterThan(2400);
    for (let n = 1; n <= 23; n += 1) {
      expect(lines.some((l) => l.startsWith(`# SECTION ${n}:`)), `section ${n}`).toBe(true);
    }
    expect(lines[lines.length - 1]).toBe('END OF DIGEST');
  });

  it('every line names its provenance: golden, engine, derived or teaching', () => {
    const prefixes = ['golden ', 'engine ', 'derived ', 'teaching ', 'refusal, ', '#', ' ', ''];
    const header = lines.indexOf('# SECTION 1: PUBLISHED GOLDEN GAS PROPERTIES');
    lines.slice(header).forEach((l) => {
      if (l === '' || l === 'END OF DIGEST') return;
      expect(prefixes.some((p) => l.startsWith(p)), l.slice(0, 60)).toBe(true);
    });
  });

  it('names OKPARA-9 nowhere, and no capstone condition', () => {
    const text = lines.join('\n');
    expect(text).not.toContain('OKPARA');
    expect(text).not.toMatch(/\b(gas_z_at_kickoff|top_valve_depth_ft|valve4_spread_psi|injection_point_depth_ft)\b/);
    // and none of the capstone's own conditions, which are the leak a lesson
    // writer is most likely to reproduce by hand
    // As NUMBERS, not as substrings: 9640 appears inside longer figures all
    // over a digest of this size and that is not a leak.
    const printed = new Set(L.teachingDigestNumbers());
    // The capstone's bellows area, 0.99 in2, is deliberately NOT on this list:
    // it is a catalogue dimension, the knife edge bellows sweep walks over it
    // on a published case, and no graded field is a bellows area. A condition
    // is a leak when it lets a learner reconstruct an ANSWER, and a bellows
    // size on somebody else's well does not.
    [9640, 1268.3, 0.682, 0.468, 186.4, 48.9, 10250, 1178.3, 58.5, 0.094, 335, 2062]
      .forEach((token) => {
        expect(printed.has(token), `capstone condition ${token} is printed in the digest`)
          .toBe(false);
      });
  });

  it('carries no em dash and no en dash anywhere', () => {
    expect(lines.join('\n')).not.toMatch(/[\u2013\u2014]/);
    // and neither does the lab source, nor this file
    expect(fs.readFileSync(path.join(HERE, 'gasLiftLab.js'), 'utf8')).not.toMatch(/[\u2013\u2014]/);
    expect(fs.readFileSync(path.join(HERE, 'gasLiftLab.test.js'), 'utf8')).not.toMatch(/[\u2013\u2014]/);
  });

  it('is deterministic', () => {
    expect(L.teachingDigestLines()).toEqual(lines);
  });

  it('has the identity the lessons were written against', () => {
    // A checksum, so the agreement below is pinned even on a machine that does
    // not carry the wave's working directory. Any change to a teaching number,
    // a label or a line's order moves it.
    expect(crypto.createHash('sha256').update(L.teachingDigestText()).digest('hex'))
      .toBe('0a0a86789fc9637ac6f3dad57f23f0e13c304c8e9612b4e4605ea0283d862f2d');
    expect(lines).toHaveLength(2483);
  });
});

describe.skipIf(!digestAvailable)('AGREEMENT WITH THE SHIPPED DIGEST that the 78 lessons quote', () => {
  // A lab value that disagrees with /root/pd-wip-gaslift/digest.txt breaks a
  // lesson that is already written, so this is compared LINE FOR LINE at the
  // digest's own printed precision rather than spot checked. Every teaching
  // number in this lab reaches a line of this file, and every line of this file
  // is rendered from an accessor, so the two statements are one statement.
  const shipped = digestAvailable
    ? fs.readFileSync(DIGEST_PATH, 'utf8').replace(/\n$/, '').split('\n')
    : [];
  const lab = L.teachingDigestLines();

  it('is the same length', () => {
    expect(lab).toHaveLength(shipped.length);
  });

  it('agrees line for line, apart from the three the engine has moved past', () => {
    const problems = [];
    shipped.forEach((line, i) => {
      if (lab[i] === line) return;
      if (DIGEST_BEHIND_THE_ENGINE.includes(line)) return;
      problems.push(`line ${i + 1}\n  digest: ${line}\n  lab   : ${lab[i]}`);
    });
    expect(problems).toEqual([]);
  });

  it('and those three differ ONLY in a warning message display string', () => {
    const moved = [];
    shipped.forEach((line, i) => {
      if (lab[i] !== line) moved.push({ i, line, now: lab[i] });
    });
    expect(moved).toHaveLength(3);
    moved.forEach(({ line, now }) => {
      expect(DIGEST_BEHIND_THE_ENGINE).toContain(line);
      expect(now).toContain('portTooSmall message');
      // the depth in the message is a location and did not move
      const depth = line.match(/Valve \d+ at (\d+) ft/)[1];
      expect(now).toContain(`at ${depth} ft`);
      // and the target it is compared with did not move either
      expect(now).toContain('short of the 900 Mscf/d target');
    });
  });
});

// ---------------------------------------------------------------------------
// 5. THE LEAK GATE.
// ---------------------------------------------------------------------------

describe('THE LEAK GATE: no teaching number may be a graded capstone answer', () => {
  // THE THRESHOLD IS THE GRADER'S OWN, AND IT IS ABSOLUTE.
  //
  // `public.academy_submit_capstone` in
  // migrations/20260715_n4_petrophysics_capstone.sql grades each field with
  //
  //     if v_got is not null and abs(v_got - v_exp) <= v_tol then
  //
  // so `tol` is an absolute band in the field's own units and not a fraction of
  // the value. `injection_point_depth_ft` is accepted within 0.0046 ft, not
  // within 0.42 ft. Read that function before touching the numbers below: a
  // guard whose threshold is inferred rather than read comes out thousands of
  // times too wide, and a gate that wide withholds good teaching material for
  // nothing.
  //
  // The gate is DIMENSION BLIND on purpose. The grader compares numbers and
  // never asks what they were a measurement of, so neither does this: a depth
  // in feet that happened to land on the graded dome pressure would be marked
  // correct if a learner pasted it into that box.
  //
  // TWO SURFACES ARE CHECKED, because they can leak independently. The PANEL
  // surface is every number a panel can render, reached by a deep walk of every
  // accessor's whole return value. The DIGEST surface is every number the 78
  // lessons can read, at the precision the digest prints it, which is the same
  // check the wave's own pd2_leakcheck.mjs runs over the file.
  //
  // WHAT THE GATE FINDS, WHICH IS WORTH STATING POSITIVELY: NOTHING.
  const targets = L.leakGuardTargets();

  it('the guard is built from all eighteen fields in all three unit shiftings', () => {
    expect(targets).toHaveLength(18 * 3);
    expect(L.LEAK_GUARD_MARGIN).toBe(10);
    expect(L.LEAK_GUARD_SCALINGS.map((s) => s.factor)).toEqual([1, 1000, 0.001]);
    CAPSTONE_FIELDS.forEach(([, key, , tol]) => {
      const t = targets.find((x) => x.key === key && x.tag === 'as graded');
      expect(t.gradingBand).toBe(tol);
      expect(t.band).toBe(10 * tol);
    });
    // and under a unit shift the ABSOLUTE band shifts with the value
    expect(targets.find((t) => t.key === 'injection_point_depth_ft' && t.tag === 'x1000').gradingBand)
      .toBeCloseTo(4.6, 12);
    expect(targets.find((t) => t.key === 'injection_point_depth_ft' && t.tag === 'x0.001').gradingBand)
      .toBeCloseTo(4.6e-6, 15);
  });

  it('NO number anywhere on the PANEL facing surface is within ten grading bands', () => {
    const rows = L.teachingQuantities();
    expect(rows.length).toBeGreaterThan(15000);
    const hits = [];
    rows.forEach((r) => {
      if (typeof r.value !== 'number' || !Number.isFinite(r.value)) return;
      const hit = L.leakGuardHit(r.value, targets);
      if (hit) hits.push(`${r.label} = ${r.value} is within ${hit.band} of ${hit.key} ${hit.tag}`);
    });
    expect(hits).toEqual([]);
  });

  it('NOR is any number the DIGEST prints, at the precision it prints it', () => {
    const numbers = L.teachingDigestNumbers();
    expect(numbers.length).toBeGreaterThan(9000);
    const hits = [];
    numbers.forEach((v) => {
      const hit = L.leakGuardHit(v, targets);
      if (hit) hits.push(`${v} is within ${hit.band} of ${hit.key} ${hit.tag}`);
    });
    expect(hits).toEqual([]);
  });

  it('THE GUARD IS LIVE: every graded answer is caught, and so is a prose rounding of it', () => {
    // Deliberate failure. Every graded answer, and a drift of nine tenths of the
    // guard band either way, which is the prose rounding the ten times margin
    // exists to cover. Not one of them gets past the gate.
    Object.entries(L.capstoneValues()).forEach(([key, v]) => {
      const drift = 0.9 * L.LEAK_GUARD_MARGIN * L.CAPSTONE_TOLERANCES[key];
      [v, v + drift, v - drift].forEach((planted) => {
        const hit = L.leakGuardHit(planted, targets);
        expect(hit, `${key} planted as ${planted} was not caught`).not.toBeNull();
        expect(hit.key).toBe(key);
      });
    });
  });

  it('THE GUARD IS LIVE: a planted UNIT SHIFTED leak is caught too', () => {
    const v = L.capstoneValues();
    expect(L.leakGuardHit(v.injection_point_depth_ft / 1000, targets).key)
      .toBe('injection_point_depth_ft');
    expect(L.leakGuardHit(v.gas_gradient_at_kickoff_psi_per_ft * 1000, targets).key)
      .toBe('gas_gradient_at_kickoff_psi_per_ft');
    expect(L.leakGuardHit(v.valve4_spread_psi / 1000, targets).key).toBe('valve4_spread_psi');
  });

  it('THE GUARD IS LIVE: a leak planted INSIDE a teaching row is caught by the sweep', () => {
    // The sweep itself, not just the predicate. This is the shape of the gate as
    // it is actually run above: a list of rows walked against the targets. A
    // planted row is caught, and the surrounding real rows are not.
    const planted = [
      ...L.chordBiasRows(1).map((r) => ({ label: 'real', value: r.chordComponentPsi })),
      { label: 'planted', value: L.capstoneValues().top_valve_depth_ft },
    ];
    const hits = planted
      .map((r) => ({ r, hit: L.leakGuardHit(r.value, targets) }))
      .filter((x) => x.hit);
    expect(hits).toHaveLength(1);
    expect(hits[0].r.label).toBe('planted');
    expect(hits[0].hit.key).toBe('top_valve_depth_ft');
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: ordinary teaching numbers pass', () => {
    // The published designs' own top valve depths, which are the same KIND of
    // number as the graded one and nowhere near it.
    L.PUBLISHED_DESIGN_IDS.forEach((id) => {
      expect(L.leakGuardHit(L.topValveIteration(id).engineFt, targets), id).toBeNull();
    });
    expect(L.leakGuardHit(L.injectionPointShipped().depthFt, targets)).toBeNull();
    expect(L.leakGuardHit(0, targets)).toBeNull();
    expect(L.leakGuardHit(NaN, targets)).toBeNull();
    expect(L.leakGuardHit(Infinity, targets)).toBeNull();
  });

  it('the closest a teaching number comes is 183 tolerances, and the digest 232', () => {
    const closest = (values) => {
      let best = null;
      values.forEach(({ label, value }) => {
        if (typeof value !== 'number' || !Number.isFinite(value)) return;
        targets.forEach((t) => {
          const d = Math.abs(value - t.value) / t.gradingBand;
          if (best === null || d < best.d) best = { d, key: t.key, label, value };
        });
      });
      return best;
    };
    const panel = closest(L.teachingQuantities());
    expect(panel.d).toBeGreaterThan(L.LEAK_GUARD_MARGIN);
    expect(panel.d).toBeGreaterThan(180);
    // A transfer line read at a plot station on round inputs: 214.7 + 0.12 x
    // 8750 is exactly 1264.7, and the graded surface pressure it comes nearest
    // is 1264.8156 psia with a band of 0.0063 psi. Close in the eye, 183
    // grading bands away in the only arithmetic that matters.
    expect(panel.value).toBe(1264.7);
    expect(panel.key).toBe('inj_surface_for_1585psia_psia');

    const digest = closest(L.teachingDigestNumbers().map((value) => ({ label: 'digest', value })));
    expect(digest.d).toBeGreaterThan(230);
    expect(digest.key).toBe('valve2_dome_at_temp_psia');
  });
});

// ---------------------------------------------------------------------------
// 6. THE PANEL GUARD: A PANEL MAY NOT REACH INTO THE CAPSTONE.
// ---------------------------------------------------------------------------

/**
 * Every export of gasLiftLab.js that is built on the OKPARA-9 capstone's own
 * conditions. Anything here is for the grader, this file's own tests and the
 * migration headers, and for nothing that a learner can see.
 *
 * PD1 learned this the hard way: its lab exported the whole capstone surface
 * beside the teaching surface with nothing between them, and the two functions a
 * panel author reaches for first were both capstone-only. So every capstone
 * reader here is NAMED so a grep can find it, and every one of them has a
 * teaching mirror that does the same job on a case a learner may see.
 */
const CAPSTONE_ONLY = [
  'CAP',
  'OKPARA_LABEL',
  'CAPSTONE_TIERS',
  'CAPSTONE_TOLERANCES',
  'CAPSTONE_FIELD_UNITS',
  'capstoneValues',
  'okparaTraverse',
  'okparaCase',
  'okparaColumnStudy',
  'okparaInjectionPointStudy',
  'okparaKnifeEdge',
  'okparaPortLadder',
  'okparaPpoStudy',
  'LEAK_GUARD_MARGIN',
  'LEAK_GUARD_SCALINGS',
  'leakGuardTargets',
  'leakGuardHit',
];

/** The teaching function a panel must use instead of each capstone reader. */
const CAPSTONE_MIRRORS = {
  okparaTraverse: 'teachingTraverseRows',
  okparaCase: 'publishedDesign',
  okparaColumnStudy: 'stepRefinementRows',
  okparaInjectionPointStudy: 'injectionPointTabulationRows',
  okparaKnifeEdge: 'knifeEdgeDecrementRows',
  okparaPortLadder: 'knifeEdgeGasRateRows',
  okparaPpoStudy: 'ppoDivergence',
};

const CAPSTONE_NAME_PATTERN = /^(CAP$|CAP_|OKPARA_|okpara|CAPSTONE_|capstone|LEAK_GUARD_|leakGuard)/;

// The lab's exports as a plain object, so the guard can look a name up by
// string. That is the whole point of the naming rule: the check has to be able
// to ask "is anything called this", not "does this identifier exist".
const LAB = { ...L };

describe('THE PANEL GUARD: no panel may read the capstone', () => {
  it('every capstone-only export exists and is named so a grep can find it', () => {
    CAPSTONE_ONLY.forEach((name) => {
      expect(LAB[name], `${name} is missing from the lab`).toBeDefined();
      expect(CAPSTONE_NAME_PATTERN.test(name), `${name} is not named as capstone material`).toBe(true);
    });
  });

  it('and NOTHING else in the lab is named that way, so the grep cannot over-fire', () => {
    const misnamed = Object.keys(LAB)
      .filter((name) => CAPSTONE_NAME_PATTERN.test(name))
      .filter((name) => !CAPSTONE_ONLY.includes(name));
    expect(misnamed).toEqual([]);
  });

  it('every capstone reader a panel would want has a TEACHING mirror', () => {
    Object.entries(CAPSTONE_MIRRORS).forEach(([capstone, mirror]) => {
      expect(CAPSTONE_ONLY).toContain(capstone);
      expect(typeof LAB[mirror], `${mirror} must be a teaching function`).toBe('function');
      expect(CAPSTONE_NAME_PATTERN.test(mirror)).toBe(false);
    });
    // and every okpara reader is covered by one
    Object.keys(LAB).filter((n) => n.startsWith('okpara')).forEach((n) => {
      expect(Object.keys(CAPSTONE_MIRRORS), `${n} has no teaching mirror`).toContain(n);
    });
  });

  const panelSources = fs
    .readdirSync(HERE)
    .filter((f) => f.endsWith('.jsx'))
    .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }));

  const capstoneNamesIn = (text) => [...new Set([
    ...CAPSTONE_ONLY.filter((name) => new RegExp(`\\b${name}\\b`).test(text)),
    ...[...text.matchAll(/\bokpara[A-Z]\w*/g)].map((m) => m[0]),
  ])];

  const gradedAnswersIn = (text) => Object.values(L.capstoneValues())
    .filter((v) => typeof v === 'number' && Number.isFinite(v))
    // Six significant figures of a graded answer is a leak at any rounding a
    // panel would plausibly print.
    .map((v) => v.toPrecision(6).replace(/0+$/, ''))
    .filter((s) => !s.includes('e'))
    .filter((s) => text.includes(s));

  it('THE GREP IS LIVE: it catches a panel that reaches into the capstone', () => {
    // The guard has to work before the panels exist, so it is proved on a
    // synthetic source rather than waiting for a real one to go wrong. Three
    // panels are coming: ColumnExplorer, ValveExplorer and UnloadingExplorer.
    const bad = "import { okparaKnifeEdge, CAP } from './gasLiftLab.js';";
    expect(capstoneNamesIn(bad).sort()).toEqual(['CAP', 'okparaKnifeEdge']);
    const printed = `const depth = ${L.capstoneValues().top_valve_depth_ft.toPrecision(6)};`;
    expect(gradedAnswersIn(printed).length).toBeGreaterThan(0);
    // and it does not fire on the teaching mirrors
    const good = "import { knifeEdgeDecrementRows, publishedDesign } from './gasLiftLab.js';";
    expect(capstoneNamesIn(good)).toEqual([]);
    expect(gradedAnswersIn(good)).toEqual([]);
  });

  it('no panel in this directory names a capstone-only export or prints a graded answer', () => {
    const problems = [];
    panelSources.forEach(({ file, text }) => {
      const names = capstoneNamesIn(text);
      if (names.length) problems.push(`${file} reaches into the capstone: ${names.join(', ')}`);
      const printed = gradedAnswersIn(text);
      if (printed.length) problems.push(`${file} prints a graded answer: ${printed.join(', ')}`);
    });
    expect(problems).toEqual([]);
  });

  it('the panel surface itself never calls a capstone reader', () => {
    // The three explorers are the lab's own panel facing entry points, so the
    // same rule is checked on them by reading the source of the lab.
    const src = fs.readFileSync(path.join(HERE, 'gasLiftLab.js'), 'utf8');
    const capstoneSection = src.indexOf('// THE CAPSTONE: OKPARA-9');
    expect(capstoneSection).toBeGreaterThan(0);
    const teaching = src.slice(0, capstoneSection);
    expect(teaching).not.toMatch(/\bokpara[A-Z]\w*\(/);
    expect(teaching).not.toMatch(/\bcapstoneValues\(/);
    expect(teaching).not.toMatch(/\bleakGuard\w*\(/);
  });
});
