// Every value the PD1 lab exposes to a panel, a lesson or the grader is pinned
// here against the vendored engine's own goldens, and so are the teaching
// CLAIMS. A course that asserts its numbers but not its arguments can have its
// argument quietly inverted by an engine change and still pass.
//
// The goldens were cut by an independent stdlib oracle
// (tools/validation/production/oracle_nodal.py) written from the published
// method statements rather than from the JS: closed-form IPR inverses against
// the engine's Brent root find, an RK4 march in depth against the engine's
// two-half-step trapezoid plus Simpson, a four-thousand-point scan and
// bisection against the engine's forty-point scan and Brent, and analytic
// residual slopes against the engine's half-a-per-cent central difference.
// The tolerances below are the ones the engine's own gate uses, case for case.
//
// THE EIGHTEEN GRADED FIELDS of the NEMBE-14 capstone are pinned separately, at
// the tolerances the capstone states, because a grader reading one derivation
// and a lesson reading another is exactly the failure this file exists to stop.

import { describe, it, expect } from 'vitest';
import * as L from './nodalLab.js';

/**
 * THE EIGHTEEN GRADED FIELDS, as [tier, key, value, tolerance].
 *
 * THE TOLERANCE IS ABSOLUTE, in the field's own units. `academy_submit_capstone`
 * in migrations/20260715_n4_petrophysics_capstone.sql grades with
 * `abs(v_got - v_exp) <= v_tol` and divides by nothing, so
 * `vlp_min_bhp_psia` is accepted within 0.0014 PSI of 2849.67283735105, not
 * within 0.14 per cent of it. Every band below is thousands of times tighter
 * than a relative reading of the same number would be.
 *
 * Every one of them is a return value of engines/production/nodal.js, produced
 * by the capstone derivation in /root/pd-wip-nodal/pd1_fields.mjs and carried
 * here verbatim so the grader, the lessons and this file all pin one set of
 * numbers. `capstoneValues()` in the lab reproduces the same derivation call
 * for call, and the test below is what proves the two have not drifted.
 */
const CAPSTONE_FIELDS = [
  ['beginner', 'ipr_pi_stbd_per_psi', 1.856946354883082, 1e-06],
  ['beginner', 'ipr_q_at_bubble_stbd', 649.9312242090787, 0.0003],
  ['beginner', 'ipr_q_at_1650psia_stbd', 2782.757243643787, 0.0014],
  ['beginner', 'ipr_aof_stbd', 3848.005502063276, 0.0019],
  ['beginner', 'ipr_pwf_at_2400stbd_psia', 1976.629067965619, 0.001],
  ['beginner', 'ipr_pwf_at_3300stbd_psia', 1098.6212097187506, 0.00055],
  ['intermediate', 'vlp_min_q_stbd', 1285.2338376891341, 0.00064],
  ['intermediate', 'vlp_min_bhp_psia', 2849.67283735105, 0.0014],
  ['intermediate', 'vlp_loaded_end_bhp_psia', 5046.565087663264, 0.0025],
  ['intermediate', 'vlp_friction_end_bhp_psia', 5277.411341029544, 0.0026],
  ['intermediate', 'liftgas_valve_pwf_psia', 1516.5314295864096, 0.00076],
  ['intermediate', 'liftgas_mid_pmf_psia', 1373.724371881081, 0.00069],
  ['advanced', 'node_op_q_stbd', 929.9820637311327, 0.00046],
  ['advanced', 'node_op_pwf_psia', 2945.7774594005996, 0.0015],
  ['advanced', 'node_unstable_q_stbd', 905.3367675852949, 0.00045],
  ['advanced', 'node_unstable_pwf_psia', 2959.6346643478146, 0.0015],
  ['advanced', 'sweep_pwh1176_q_stbd', 1184.0068509231141, 0.00057],
  ['advanced', 'sweep_pwh1176_pwf_psia', 2799.4388422395805, 0.0015],
];

const G = L.GOLDEN;
const C = L.CHOKE_GOLDEN;

const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);
const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);
const relNear = (a, b, tol) => expect(rel(a, b)).toBeLessThan(tol);

// ---------------------------------------------------------------------------
// 1. THE GOLDENS, CASE FOR CASE.
// ---------------------------------------------------------------------------

describe('numerics, friction and gas properties reproduce the oracle', () => {
  it('the Moody factor across every regime, all five cases', () => {
    expect(G.friction).toHaveLength(5);
    G.friction.forEach((c) => relNear(L.moodyFrictionFactor(c.re, c.relRough), c.f, 1e-9));
  });

  it('the Colebrook root satisfies the equation it was solved from', () => {
    [[1e4, 1e-4], [1e6, 5e-4], [1e8, 1e-6]].forEach(([re, rr]) => {
      const f = L.colebrookFrictionFactor(re, rr);
      const rhs = -2 * Math.log10(rr / 3.7 + 2.51 / (re * Math.sqrt(f)));
      relNear(1 / Math.sqrt(f), rhs, 1e-10);
    });
  });

  it('the z factor, all four cases, and the ideal gas limit', () => {
    expect(G.zFactor).toHaveLength(4);
    G.zFactor.forEach((c) => {
      relNear(L.nodalGasZ({ pPsia: c.pPsia, tF: c.tF, gasSg: c.gasSg }), c.z, 1e-9);
    });
    expect(L.nodalGasZ({ pPsia: 1e-6, tF: 150, gasSg: 0.65 })).toBeCloseTo(1, 8);
  });
});

describe('oil inflow reproduces the oracle', () => {
  it('every oil IPR case: open flow, forward rates, inverse pressures and slopes', () => {
    const rows = L.goldenOilIprCases();
    expect(rows).toHaveLength(5);
    rows.forEach((c, i) => {
      const g = G.oilIpr[i];
      expect(c.id).toBe(g.id);
      relNear(c.aofStbd, g.qmax, 1e-12);
      expect(c.curveRows).toBe(40);
      // the forward relation IS the definition of each family
      c.forward.forEach((r) => relNear(r.qStbd, r.goldenQStbd, 1e-12));
      // the engine inverts with Brent at a 1e-6 tolerance; the oracle writes
      // the inverse down in closed form
      c.inverse.forEach((r) => near(r.pwfPsia, r.goldenPwfPsia, 1e-6));
      // the oracle differentiates analytically; the lab takes a Richardson
      // extrapolated central difference on the engine's own inverse
      c.slopes.forEach((r) => near(r.dpwfdqPsiPerStbd, r.goldenDpwfdqPsiPerStbd, 1e-6));
    });
  });

  it('forward and inverse are inverses of each other on every family', () => {
    G.oilIpr.forEach((c) => {
      const m = L.goldenIpr(c.id);
      [0.05, 0.3, 0.6, 0.9].forEach((f) => {
        const q = m.qmax * f;
        relNear(L.rateAtPwf(m, L.pwfAtRate(m, q)), q, 1e-8);
      });
    });
  });

  it('calibration from one production test, all five cases', () => {
    const rows = L.goldenCalibrationCases();
    expect(rows).toHaveLength(5);
    rows.forEach((c) => {
      relNear(c.aofStbd, c.golden.qmax, 1e-12);
      if (c.golden.pi != null) relNear(c.piStbdPerPsi, c.golden.pi, 1e-12);
      if (c.golden.c != null) relNear(c.fetkovichC, c.golden.c, 1e-12);
      relNear(c.qAtTestPwfStbd, c.golden.qAtTestPwf, 1e-12);
      // a calibrated curve reproduces the test it was calibrated from
      relNear(c.qAtTestPwfStbd, c.inputs.testQ, 1e-12);
    });
  });

  it('depletion follows the published rule for each family, all four cases', () => {
    const rows = L.goldenFutureIprCases();
    expect(rows).toHaveLength(4);
    rows.forEach((c) => {
      relNear(c.aofStbd, c.golden.qmax, 1e-12);
      near(c.pwfAtHalfAofPsia, c.golden.pwfAtHalfQmax, 1e-6);
    });
  });

  it('an uncalibrated inflow refuses rather than returning NaN rates', () => {
    const bad = L.computeIpr({ model: 'pi', pr: 2500 });
    expect(bad.curve).toEqual([]);
    expect(bad.warnings.join(' ')).toMatch(/not positive/);
  });
});

describe('gas deliverability reproduces the oracle', () => {
  it('every gas IPR case: open flow, forward, closed-form inverse and the chord bias', () => {
    const rows = L.goldenGasIprCases();
    expect(rows).toHaveLength(3);
    rows.forEach((c, i) => {
      const g = G.gasIpr[i];
      expect(c.id).toBe(g.id);
      relNear(c.aofMscfd, g.aof, 1e-12);
      c.forward.forEach((r) => relNear(r.qMscfd, r.goldenQMscfd, 1e-12));
      c.inverse.forEach((r) => relNear(r.pwfPsia, r.goldenPwfPsia, 1e-12));
      c.chord40.forEach((r) => {
        relNear(r.chordPwfPsia, r.goldenChordPwfPsia, 1e-12);
        near(r.biasPsi, r.goldenBiasPsi, 1e-9);
        // ENGINE DEFECT (a), as the golden records it: reading pwf off the
        // sampled curve runs LOW on both empirical families, because the curve
        // is sampled evenly in pressure and is therefore sparse in rate exactly
        // where it is steepest. It does not touch NEMBE-14, whose oil inverse
        // is a Brent root find on the forward relation.
        expect(r.biasPsi).toBeLessThan(0);
      });
    });
  });
});

describe('the dry gas column reproduces the oracle', () => {
  it('every tubing case: Reynolds, friction group, the converged march and average T and z', () => {
    const rows = L.goldenTubingCases();
    expect(rows).toHaveLength(5);
    rows.forEach((c) => {
      if (c.inputs.qMmscfd > 0) {
        relNear(c.reynolds, c.golden.reynolds, 1e-12);
        relNear(c.frictionGroupF2, c.golden.frictionGroupF2, 1e-9);
      }
      // 256 sub-intervals IS the converged integral the oracle integrated
      relNear(c.convergedPwfPsia, c.golden.pwfPsia, 1e-6);
      relNear(c.averageTzPwfPsia, c.golden.avgTzPwfPsia, 1e-8);
    });
  });

  it('the published two station march sits inside its own truncation band, and no better', () => {
    // Gated as a BAND, not as agreement: the two station construction is an
    // approximation to the integral above and the oracle knows what the
    // integral is. See the engine header on `steps`.
    L.goldenTubingCases().forEach((c) => {
      relNear(c.publishedTwoStationPwfPsia, c.golden.pwfPsia, 1e-3);
    });
    const hot = L.goldenTubingCases().find((c) => c.id === 'flowingHighRate');
    expect(hot.golden.pwfPsia - hot.publishedTwoStationPwfPsia).toBeGreaterThan(1.0);
  });

  it('the pressure the engine returns satisfies the DEFINING EQUATION of the method', () => {
    // Not another implementation of the same march: the integral
    //   integral from ptf to pwf of I(p) dp = 18.75 gammaG L
    // accumulated with the engine's own integrand and z factor, and it has to
    // come to 18.75 gammaG L. This closure reproduces the oracle's own value of
    // that integral to a part in 1e-12, which is the strongest single piece of
    // evidence in this file that both sides are integrating the same thing.
    L.goldenTubingCases().forEach((c) => {
      relNear(c.definingIntegral.integral, c.golden.definingIntegral, 1e-12);
      relNear(c.definingIntegral.target, c.golden.definingIntegralTarget, 1e-12);
      relNear(c.definingIntegral.integral, c.definingIntegral.target, 1e-4);
    });
  });

  it('the golden sampled outflow curve and its minimum', () => {
    const t = L.goldenTubingCurveCase();
    expect(t.curve).toHaveLength(G.tubingCurve.nPoints);
    t.curve.forEach((row, i) => {
      relNear(row.q, G.tubingCurve.curve[i].q, 1e-12);
      relNear(row.bhp, G.tubingCurve.curve[i].bhp, 1e-6);
    });
    relNear(t.minimum.q, G.tubingCurve.sampledMinimum.q, 1e-12);
    relNear(t.minimum.bhp, G.tubingCurve.sampledMinimum.bhp, 1e-6);
    // A DRY GAS COLUMN HAS NO J IN IT. Nothing in Cullender and Smith lightens
    // with rate, so the outflow rises monotonically and its minimum is simply
    // the lowest sampled rate. That is the control case for NEMBE-14's J.
    expect(t.minimumIsLowestSampledRate).toBe(true);
    for (let i = 1; i < t.curve.length; i += 1) {
      expect(t.curve[i].bhp).toBeGreaterThan(t.curve[i - 1].bhp);
    }
  });
});

describe('the node solve reproduces the oracle', () => {
  it('every golden node: probes, crossings, stability and the operating point', () => {
    const rows = L.goldenNodeCases();
    expect(rows).toHaveLength(5);
    rows.forEach((c) => {
      // the two curves themselves, before anything is solved
      c.probes.forEach((p) => {
        near(p.iprPwfPsia, p.golden.ipr, 1e-6);
        near(p.vlpBhpPsia, p.golden.vlp, 1e-6);
        near(p.residualPsi, p.golden.g, 1e-6);
      });
      expect(c.status).toBe(c.golden.status);
      expect(c.intersections).toHaveLength(c.golden.intersections.length);
      c.golden.intersections.forEach((x, i) => {
        relNear(c.intersections[i].q, x.q, 1e-7);
        near(c.intersections[i].pwf, x.pwf, 1e-4);
        expect(c.intersections[i].stable).toBe(x.stable);
      });
      // THE REDUCTION, gated on its own: the rightmost stable crossing
      if (c.golden.op === null) {
        expect(c.op).toBeNull();
      } else {
        relNear(c.op.q, c.golden.op.q, 1e-7);
        near(c.op.pwf, c.golden.op.pwf, 1e-4);
        expect(c.op.stable).toBe(true);
      }
    });
  });

  it('both golden gas nodes, and the chord bias the golden measures', () => {
    const rows = L.goldenGasNodeCases();
    expect(rows).toHaveLength(2);
    rows.forEach((c) => {
      c.probes.forEach((p) => {
        relNear(p.iprPwfPsia, p.golden.ipr, 1e-12);
        relNear(p.vlpBhpPsia, p.golden.vlp, 1e-6);
      });
      expect(c.status).toBe(c.golden.status);
      expect(c.intersections).toHaveLength(c.golden.intersections.length);
      relNear(c.op.q, c.golden.op.q, 1e-5);
      relNear(c.op.pwf, c.golden.op.pwf, 1e-5);
      expect(c.op.stable).toBe(true);
      relNear(c.opFromChordIpr.q, c.golden.opFromChordIpr.q, 1e-5);
      // The bias is a DIFFERENCE OF TWO NEARLY EQUAL RATES, about one part in
      // eighteen thousand of either, so it is gated in absolute Mscf/d: a
      // relative gate on it would be gating the cancellation, not the physics.
      near(c.chordRateBiasMscfd, c.golden.chordRateBiasMscfd, 2e-4);
      expect(c.chordRateBiasMscfd).toBeLessThan(0);
    });
  });

  it('a dry gas node has exactly one crossing and it is stable', () => {
    L.goldenGasNodeCases().forEach((c) => {
      expect(c.intersections).toHaveLength(1);
      expect(c.intersections[0].stable).toBe(true);
    });
  });

  it('the golden wellhead pressure sweep, case for case', () => {
    const s = L.goldenSweepCase();
    expect(s.rows).toHaveLength(4);
    s.rows.forEach((r, i) => {
      const g = s.golden[i];
      expect(r.label).toBe(g.label);
      expect(r.value).toBe(g.value);
      expect(r.status).toBe(g.status);
      relNear(r.q, g.q, 1e-5);
      relNear(r.pwf, g.pwf, 1e-5);
    });
    // and the physics of the sweep: choking the wellhead back kills rate
    for (let i = 1; i < s.rows.length; i += 1) {
      expect(s.rows[i].q).toBeLessThan(s.rows[i - 1].q);
    }
  });

  it('two straight lines cross where algebra says they do', () => {
    const r = L.solveNodeCore({
      iprPwfAt: (q) => 3000 - 2 * q,
      vlpBhpAt: (q) => 500 + q,
      qMax: 1500,
    });
    expect(r.intersections).toHaveLength(1);
    relNear(r.op.q, 2500 / 3, 1e-9);
    expect(r.op.stable).toBe(true);
    expect(r.status).toBe('flowing');
  });
});

describe('the wellhead: the choke goldens', () => {
  it('erosional velocity and the rate limit, all twelve cases', () => {
    const rows = L.chokeErosionalCases();
    expect(rows).toHaveLength(12);
    rows.forEach((c) => {
      relNear(c.erosionalFtS, c.golden.erosionalFtS, 1e-12);
      // ONE EXPLAINED CONSTANT DIFFERENCE, and it is not a method disagreement.
      // Every value in this golden that does not cross the barrel to cubic foot
      // conversion reproduces to 1e-12 or better. The two that do, the rate
      // limit here and the mixture velocity below, sit 5.94e-8 apart because
      // the engine carries that conversion as 5.614583 and the oracle carries
      // it as 5.6145833333: (5.6145833333 - 5.614583) / 5.614583 = 5.936e-8,
      // which is the observed gap to three figures on all fifteen of them. It
      // is a truncated constant in the seventh figure, one part in seventeen
      // million, and it moves no engineering decision.
      relNear(c.maxRateBpd_2441, c.golden.maxRateBpd_2441, 1e-7);
    });
  });

  it('mixture velocity and the pipe area, all three cases', () => {
    const rows = L.chokeVelocityCases();
    expect(rows).toHaveLength(3);
    rows.forEach((c) => relNear(c.velocityFtS, c.golden.velocityFtS, 1e-7));
    relNear(L.pipeAreaFt2(2.441), C.pipeAreaFt2_2441, 1e-12);
  });

  it('the Gilbert fit recovers the coefficients it was made from, clean and noisy', () => {
    const g = L.chokeGilbertFit();
    expect(g.clean.ok).toBe(true);
    relNear(g.clean.c, C.fit.recovered.c, 1e-9);
    relNear(g.clean.m, C.fit.recovered.m, 1e-9);
    relNear(g.clean.n, C.fit.recovered.n, 1e-9);
    // and the recovered set is the truth it was generated from
    relNear(g.clean.c, C.fit.truth.c, 1e-9);
    relNear(g.clean.n, C.fit.truth.n, 1e-9);
    expect(g.noisy.ok).toBe(true);
    relNear(g.noisy.c, C.fitNoisy.recovered.c, 1e-9);
    relNear(g.noisy.m, C.fitNoisy.recovered.m, 1e-9);
    relNear(g.noisy.n, C.fitNoisy.recovered.n, 1e-9);
  });

  it('the hydrate screening temperature, all four cases', () => {
    const rows = L.chokeHydrateCases();
    expect(rows).toHaveLength(4);
    rows.forEach((c) => relNear(c.formationF, c.golden.formationF, 1e-12));
  });
});

// ---------------------------------------------------------------------------
// 2. THE EIGHTEEN GRADED FIELDS.
// ---------------------------------------------------------------------------

describe('the NEMBE-14 capstone: the eighteen graded fields', () => {
  const values = L.capstoneValues();

  it('carries exactly eighteen fields, six per tier', () => {
    expect(CAPSTONE_FIELDS).toHaveLength(18);
    expect(Object.keys(values)).toHaveLength(18);
    const tiers = CAPSTONE_FIELDS.reduce((acc, [tier]) => (
      { ...acc, [tier]: (acc[tier] || 0) + 1 }), {});
    expect(tiers).toEqual({ beginner: 6, intermediate: 6, advanced: 6 });
  });

  CAPSTONE_FIELDS.forEach(([tier, key, expected, tol]) => {
    it(`${tier}: ${key} = ${expected}`, () => {
      expect(Number.isFinite(values[key])).toBe(true);
      expect(L.CAPSTONE_TIERS[key]).toBe(tier);
      // ABSOLUTE, the way the grader compares: abs(got - expected) <= tol
      near(values[key], expected, tol);
    });
  });

  it('and reproduces every one of them EXACTLY, not merely inside tolerance', () => {
    // The lab runs the same calls in the same order as the capstone derivation,
    // so there is no arithmetic between them and nothing to round. If this ever
    // becomes an inequality, the two have diverged and the tolerance is hiding
    // it rather than permitting it.
    CAPSTONE_FIELDS.forEach(([, key, expected]) => expect(values[key]).toBe(expected));
  });

  it('the graded fields are the lab functions, not a second derivation', () => {
    const inflow = L.nembeInflowReadings();
    expect(values.ipr_pi_stbd_per_psi).toBe(inflow.piStbdPerPsi);
    expect(values.ipr_aof_stbd).toBe(inflow.aofStbd);
    expect(values.ipr_q_at_bubble_stbd).toBe(inflow.qAtBubblePointStbd);
    expect(values.ipr_q_at_1650psia_stbd).toBe(inflow.qAtReadPressureStbd);
    expect(values.ipr_pwf_at_2400stbd_psia).toBe(inflow.pwfAtReadRatePsia);
    expect(values.ipr_pwf_at_3300stbd_psia).toBe(inflow.pwfAtDeepRatePsia);
    const out = L.nembeOutflowReadings();
    expect(values.vlp_min_q_stbd).toBe(out.sampledMinimumQStbd);
    expect(values.vlp_min_bhp_psia).toBe(out.sampledMinimumBhpPsia);
    expect(values.vlp_loaded_end_bhp_psia).toBe(out.loadedEndBhpPsia);
    expect(values.vlp_friction_end_bhp_psia).toBe(out.frictionEndBhpPsia);
    const win = L.nembeStableWindow();
    expect(values.node_op_q_stbd).toBe(win.opQStbd);
    expect(values.node_op_pwf_psia).toBe(win.opPwfPsia);
    expect(values.node_unstable_q_stbd).toBe(win.unstableQStbd);
    expect(values.node_unstable_pwf_psia).toBe(win.unstablePwfPsia);
  });

  it('is deterministic: two calls return identical numbers', () => {
    expect(L.capstoneValues()).toEqual(L.capstoneValues());
    expect(L.scanResolutionStudy()).toEqual(L.scanResolutionStudy());
    expect(L.digestText()).toBe(L.digestText());
  });
});

// ---------------------------------------------------------------------------
// 3. THE THREE STRUCTURAL FACTS THE COURSE IS BUILT ON.
// ---------------------------------------------------------------------------

describe('structural fact 1: the residual is POSITIVE at low rate', () => {
  it('the column outweighs the reservoir at the bottom of the rate range', () => {
    const rows = L.nembeResidualSweep({ nPoints: 2001 });
    expect(rows[0].residualPsi).toBeGreaterThan(0);
    // and by a lot: the tubing asks for about 5047 psia where the reservoir can
    // only offer 3450, so the well cannot start itself
    const out = L.nembeOutflowReadings();
    expect(out.loadedEndBhpPsia).toBeGreaterThan(out.reservoirPressurePsia);
    expect(out.loadedEndAbovePrPsi).toBeGreaterThan(1500);
    expect(out.deadColumnPsia).toBeGreaterThan(out.reservoirPressurePsia);
    // the residual is positive at BOTH ends and negative in between, which is
    // the shape that makes two crossings possible at all
    expect(rows[rows.length - 1].residualPsi).toBeGreaterThan(0);
    const min = L.nembeResidualMinimum({ nPoints: 20001 });
    expect(min.residualPsi).toBeLessThan(0);
    expect(min.signChanges).toBe(2);
  });
});

describe('structural fact 2: exactly two crossings, and the wider-rate one is stable', () => {
  it('two crossings, the right one stable and the left one not', () => {
    const crossings = L.nembeCrossings();
    expect(crossings).toHaveLength(2);
    expect(crossings[0].qStbd).toBeLessThan(crossings[1].qStbd);
    expect(crossings[0].stable).toBe(false);
    expect(crossings[1].stable).toBe(true);
    expect(crossings[1].isOperatingPoint).toBe(true);
    // the reported operating point IS the rightmost stable crossing
    const node = L.nembeNode();
    expect(node.status).toBe('flowing');
    expect(node.op.q).toBe(crossings[1].qStbd);
    // and the higher rate crossing sits at the LOWER flowing pressure, because
    // the inflow falls with rate
    expect(crossings[1].pwfPsia).toBeLessThan(crossings[0].pwfPsia);
  });

  it('both crossings really are zeros of the residual', () => {
    L.nembeCrossings().forEach((x) => {
      expect(Math.abs(L.nembeResidualAt(x.qStbd))).toBeLessThan(1e-5);
    });
  });

  it('the stable window is under 25 stb/d on a well with a 3848 stb/d open flow', () => {
    const w = L.nembeStableWindow();
    expect(w.crossings).toBe(2);
    expect(w.widthStbd).toBeGreaterThan(0);
    expect(w.widthStbd).toBeLessThan(25);
    expect(w.widthAsFractionOfAof).toBeLessThan(0.007);
    // and the operating point sits under 100 psi above the bottom of its own
    // tubing curve, which is how little room this well has
    expect(w.opAboveTubingMinimumPsi).toBeGreaterThan(0);
    expect(w.opAboveTubingMinimumPsi).toBeLessThan(100);
    // it also sits to the LEFT of the tubing minimum, which a textbook stable
    // operating point does not. Stability here is a property of the RESIDUAL
    // slope, not of which side of the J the point lands on.
    expect(w.opLeftOfTubingMinimumStbd).toBeGreaterThan(0);
  });
});

describe('structural fact 3: nGrid 40 reports a DEAD well, nGrid 900 does not', () => {
  const study = L.scanResolutionStudy();
  const at = (n) => study.find((r) => r.nGrid === n);

  it('the documented default loses the well entirely', () => {
    expect(at(40).status).toBe('dead');
    expect(at(40).crossings).toBe(0);
    expect(at(40).opQStbd).toBeNull();
    // and it is not a wrong number, it is a wrong VERDICT: the solve returns
    // no warning, because from the scanner's point of view nothing went wrong
    expect(L.nembeNode({ nGrid: 40 }).op).toBeNull();
  });

  it('the capstone resolution finds both crossings', () => {
    expect(at(900).status).toBe('flowing');
    expect(at(900).crossings).toBe(2);
    expect(at(900).resolvesTheWindow).toBe(true);
  });

  it('the default scan spacing is four times wider than the whole stable window', () => {
    // 98.469 stb/d between samples against a 24.645 stb/d window: 3.995 times.
    const w = L.nembeStableWindow().widthStbd;
    expect(at(40).spacingStbd / w).toBeGreaterThan(3.9);
    expect(at(40).spacingStbd / w).toBeLessThan(4.1);
    expect(at(900).spacingStbd).toBeLessThan(w);
  });

  it('raising the resolution is NOT a monotone improvement in the verdict', () => {
    // A sign change scan sees the dip only if one of its intervals straddles
    // it, so whether the well is found depends on where the samples LAND and
    // not only on how many there are. nGrid 60 finds the well; nGrid 100,
    // which is a finer scan, loses it again.
    expect(at(60).status).toBe('flowing');
    expect(at(100).status).toBe('dead');
    expect(at(100).spacingStbd).toBeLessThan(at(60).spacingStbd);
  });

  it('every resolution that finds the well agrees on the operating rate', () => {
    const live = study.filter((r) => r.status === 'flowing');
    expect(live.length).toBeGreaterThanOrEqual(5);
    live.forEach((r) => relNear(r.opQStbd, L.capstoneValues().node_op_q_stbd, 1e-7));
  });

  it('the golden pinched instrument shows the same failure in closed form', () => {
    const rows = L.goldenPinchedScanStudy();
    const at2 = (n) => rows.find((r) => r.nGrid === n);
    expect(at2(40).status).toBe('dead');
    expect(at2(400).status).toBe('flowing');
    expect(at2(400).crossings).toBe(2);
    relNear(at2(400).opQStbd, 1010, 1e-9);
    expect(at2(40).spacingStbd).toBeGreaterThan(at2(40).trueWindowStbd);
  });
});

// ---------------------------------------------------------------------------
// 4. THE CULLENDER AND SMITH STEP STUDY.
// ---------------------------------------------------------------------------

describe('the Cullender and Smith step study is monotone the way the header claims', () => {
  // THE PSI GAP AT 2 STEPS, which is the whole of engine defect (b):
  //   gravity only lift gas column   two station 1516.396892 psia against a
  //                                  converged 1516.533318 psia, a gap of
  //                                  0.136426 psi LOW
  //   friction loaded column at      two station 2628.891340 psia against a
  //   9.6 MMscf/d                    converged 2633.398148 psia, a gap of
  //                                  4.506808 psi LOW
  // Thirty three times the error, same method, same string, same well, and the
  // only difference is the friction group. That is why the default of 2 is
  // right for a published worked example and wrong for a well at rate.
  const table = L.columnTruncationTable();

  it('marches at the six stated step counts', () => {
    expect(table.map((r) => r.steps)).toEqual([2, 4, 8, 20, 64, 256]);
    L.liftGasStepStudy().forEach((r) => {
      expect(r.actualSteps).toBe(r.requestedSteps);
      expect(r.converged).toBe(true);
    });
  });

  it('both columns run LOW at two stations, as the engine header states', () => {
    expect(table[0].gravityOnlyErrorPsi).toBeLessThan(0);
    expect(table[0].frictionLoadedErrorPsi).toBeLessThan(0);
    near(table[0].gravityOnlyErrorPsi, -0.136426, 5e-5);
    near(table[0].frictionLoadedErrorPsi, -4.506808, 5e-5);
  });

  it('the pressure rises monotonically towards the converged integral', () => {
    for (let i = 1; i < table.length; i += 1) {
      expect(table[i].gravityOnlyPwfPsia).toBeGreaterThan(table[i - 1].gravityOnlyPwfPsia);
      expect(table[i].frictionLoadedPwfPsia).toBeGreaterThan(table[i - 1].frictionLoadedPwfPsia);
    }
  });

  it('the truncation shrinks monotonically, and roughly with the square of the count', () => {
    for (let i = 1; i < table.length; i += 1) {
      expect(Math.abs(table[i].gravityOnlyErrorPsi))
        .toBeLessThan(Math.abs(table[i - 1].gravityOnlyErrorPsi));
      expect(Math.abs(table[i].frictionLoadedErrorPsi))
        .toBeLessThan(Math.abs(table[i - 1].frictionLoadedErrorPsi));
    }
    // doubling the count from 4 to 8 cuts the friction loaded error by more
    // than a factor of three, which is the h^2 the header claims
    const e4 = Math.abs(table[1].frictionLoadedErrorPsi);
    const e8 = Math.abs(table[2].frictionLoadedErrorPsi);
    expect(e4 / e8).toBeGreaterThan(3);
    expect(e4 / e8).toBeLessThan(5);
  });

  it('the friction loaded column carries far more truncation than the gravity only one', () => {
    // a fraction of a psi against four and a half psi at two stations
    expect(Math.abs(table[0].gravityOnlyErrorPsi)).toBeLessThan(1);
    expect(Math.abs(table[0].frictionLoadedErrorPsi)).toBeGreaterThan(4);
    expect(table[0].errorRatio).toBeGreaterThan(30);
    // and the graded column is marched at 20, where the residual truncation is
    // under two thousandths of a psi
    const graded = L.liftGasStepStudy().find((r) => r.requestedSteps === 20);
    expect(Math.abs(graded.errorVsConvergedPsi)).toBeLessThan(0.002);
  });

  it('the friction group is what separates the two columns', () => {
    const d = L.diagnosticFrictionGroup();
    expect(d.f2).toBeGreaterThan(0);
    expect(d.reynolds).toBeGreaterThan(4000);
    // the lift gas column is STATIC: no rate, so no friction group at all
    expect(L.liftGasTubing().qMmscfd).toBeUndefined();
  });

  it('average T and z is a second opinion on the same column, not a copy of it', () => {
    const c = L.liftGasVsAverageTz();
    expect(c.averageTzConverged).toBe(true);
    // Two different quadratures of one static gas column. On the golden's
    // 8000 ft vertical 0.65 gravity column they land within a psi of each
    // other; on NEMBE-14's deviated 8900 ft measured, 8300 ft vertical, 0.72
    // gravity column the gap opens to 2.75 psi, because averaging z once over
    // a longer, heavier, hotter column is a coarser approximation than
    // averaging it over a short cool one. The gap is a property of the column,
    // not a disagreement about the method.
    near(c.convergedMinusAverageTzPsi, 2.752530, 1e-4);
    expect(Math.abs(c.convergedMinusAverageTzPsi)).toBeLessThan(5);
    const staticGolden = L.goldenTubingCases().find((x) => x.id === 'staticVertical');
    expect(Math.abs(staticGolden.convergedPwfPsia - staticGolden.averageTzPwfPsia))
      .toBeLessThan(1);
    expect(c.averageTzZbar).toBeGreaterThan(0.8);
    expect(c.averageTzZbar).toBeLessThan(1);
    // and the same closeness holds on the golden's own five columns
    L.goldenTubingCases().forEach((c2) => {
      relNear(c2.averageTzPwfPsia, c2.golden.avgTzPwfPsia, 1e-8);
    });
  });
});

// ---------------------------------------------------------------------------
// 5. THE TEACHING CLAIMS. Every argument a lesson makes, pinned.
// ---------------------------------------------------------------------------

describe('the associate tier argument: three models, one production test', () => {
  const rows = L.iprModelComparison();

  it('all three pass exactly through the production test they were calibrated on', () => {
    // THE PIVOT IS THE TEST POINT, not the bubble point.
    const atTest = rows.find((r) => r.pwfPsia === L.CAP.testPwfPsia);
    near(atTest.straightLineStbd, L.CAP.testQStbd, 1e-9);
    near(atTest.vogelStbd, L.CAP.testQStbd, 1e-9);
    near(atTest.compositeStbd, L.CAP.testQStbd, 1e-9);
    near(atTest.straightLineMinusCompositeStbd, 0, 1e-9);
    near(atTest.vogelMinusCompositeStbd, 0, 1e-9);
  });

  it('the straight line over-promises below the test, and worst at the bottom', () => {
    const below = rows.filter((r) => r.pwfPsia < L.CAP.testPwfPsia);
    below.forEach((r) => expect(r.straightLineMinusCompositeStbd).toBeGreaterThan(0));
    for (let i = 1; i < below.length; i += 1) {
      expect(below[i].straightLineMinusCompositeStbd)
        .toBeGreaterThan(below[i - 1].straightLineMinusCompositeStbd);
    }
    // 6273 stb/d against 3848 at the open flow, which is 1.63 times
    const aofs = L.iprModelAofs();
    expect(aofs.straightLineOverComposite).toBeGreaterThan(1.6);
  });

  it('fitting a straight line to a TWO PHASE test corrupts the productivity index itself', () => {
    // NEMBE-14's test sits at 2790 psia, below the 3100 psia bubble point, so
    // the PI the straight line backs out of it is 1.8182 against a true 1.8569:
    // low by 2.1 per cent before any question of curve shape arises. Above the
    // test the straight line is therefore LOW, not high, which is the opposite
    // of the mistake everybody expects it to make.
    const pis = L.iprModelPis();
    near(pis.truePiStbdPerPsi, 1.856946354883082, 1e-9);
    near(pis.straightLineFromTwoPhaseTestStbdPerPsi, 1200 / 660, 1e-12);
    expect(pis.piErrorFromTwoPhaseTestStbdPerPsi).toBeLessThan(0);
    expect(Math.abs(pis.piErrorFraction)).toBeGreaterThan(0.02);
    expect(Math.abs(pis.piErrorFraction)).toBeLessThan(0.03);
    rows.filter((r) => r.pwfPsia > L.CAP.testPwfPsia && r.pwfPsia < L.CAP.prPsia)
      .forEach((r) => expect(r.straightLineMinusCompositeStbd).toBeLessThan(0));
  });

  it('the controlled experiment separates a bad calibration from a bad curve', () => {
    // Calibrate all three from a test taken ABOVE the bubble point and the
    // straight line carries the RIGHT productivity index, so it agrees with the
    // composite exactly everywhere above pb. What is left below pb is the shape
    // alone, and it is still a factor of 1.6 at the open flow.
    const pis = L.iprModelPis();
    near(pis.straightLineFromSinglePhaseTestStbdPerPsi, pis.truePiStbdPerPsi, 1e-9);
    const ctrl = L.iprModelComparisonFromUndersaturatedTest();
    ctrl.filter((r) => !r.belowBubblePoint).forEach((r) => {
      near(r.straightLineMinusCompositeStbd, 0, 1e-9);
    });
    ctrl.filter((r) => r.belowBubblePoint).forEach((r) => {
      expect(r.straightLineMinusCompositeStbd).toBeGreaterThan(0);
    });
  });

  it('Vogel reads high at the top of the curve and low at the open flow', () => {
    // Vogel treats the whole drawdown as saturated, so it has no undersaturated
    // straight section to give: about 14 stb/d high at the bubble point, and it
    // finishes 1 per cent low at the open flow.
    const aofs = L.iprModelAofs();
    expect(aofs.vogelOverComposite).toBeLessThan(1);
    expect(aofs.vogelOverComposite).toBeGreaterThan(0.98);
    expect(rows.find((r) => r.pwfPsia === 3100).vogelMinusCompositeStbd).toBeGreaterThan(0);
    // and below the test it tracks the composite far more closely than the
    // straight line does: tens of stb/d against thousands
    rows.filter((r) => r.pwfPsia < L.CAP.testPwfPsia).forEach((r) => {
      expect(Math.abs(r.vogelMinusCompositeStbd))
        .toBeLessThan(Math.abs(r.straightLineMinusCompositeStbd));
      expect(Math.abs(r.vogelMinusCompositeStbd)).toBeLessThan(50);
    });
  });

  it('the composite is the two halves joined at the bubble point', () => {
    const inflow = L.nembeInflowReadings();
    near(inflow.qAtBubblePointStbd, inflow.qAtBubbleFromPiStbd, 1e-9);
    near(inflow.aofStbd, inflow.qAtBubbleFromPiStbd + inflow.vogelBlockStbd, 1e-9);
    expect(inflow.saturatedShareOfAof).toBeGreaterThan(0.8);
  });

  it('the inflow slope steepens below the bubble point', () => {
    const slopes = L.nembeInflowSlopes();
    slopes.forEach((s) => expect(s.dpwfdqPsiPerStbd).toBeLessThan(0));
    const above = slopes.filter((s) => !s.belowBubblePoint);
    const below = slopes.filter((s) => s.belowBubblePoint);
    above.forEach((s) => near(s.dpwfdqPsiPerStbd, s.straightLineSlopePsiPerStbd, 1e-6));
    below.forEach((s) => {
      expect(s.dpwfdqPsiPerStbd).toBeLessThan(s.straightLineSlopePsiPerStbd);
    });
    for (let i = 1; i < below.length; i += 1) {
      expect(below[i].dpwfdqPsiPerStbd).toBeLessThan(below[i - 1].dpwfdqPsiPerStbd);
    }
  });

  it('the published golden case is a second, milder well the tier can teach on', () => {
    const pub = L.publishedCompositeIpr();
    expect(pub.pr).toBe(3000);
    expect(pub.pb).toBe(2000);
    relNear(pub.pi, 1.2, 1e-12);
    relNear(pub.qmax, 2533.333333333333, 1e-12);
    expect(L.publishedCompositeIprPoints()).toHaveLength(40);
  });
});

describe('the professional tier argument: the J and what moves it', () => {
  it('the two limbs are separable and their sum is the curve', () => {
    L.tubingDecomposition().forEach((r) => {
      near(r.wellheadPsia + r.gravityPsi + r.frictionPsi, r.bhpPsia, 1e-9);
      near(r.gravityShare + r.frictionShare, 1, 1e-12);
    });
  });

  it('gravity falls with rate and friction grows with it, always', () => {
    const rows = L.tubingDecomposition();
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].gravityPsi).toBeLessThan(rows[i - 1].gravityPsi);
      expect(rows[i].frictionPsi).toBeGreaterThan(rows[i - 1].frictionPsi);
    }
  });

  it('the curve falls to a minimum and rises again: it is J shaped', () => {
    const curve = L.nembeTubingCurve().curve;
    const min = L.nembeTubingCurve().minimum;
    const iMin = curve.findIndex((p) => p.q === min.q);
    expect(iMin).toBeGreaterThan(0);
    expect(iMin).toBeLessThan(curve.length - 1);
    for (let i = 1; i <= iMin; i += 1) expect(curve[i].bhp).toBeLessThan(curve[i - 1].bhp);
    for (let i = iMin + 1; i < curve.length; i += 1) {
      expect(curve[i].bhp).toBeGreaterThan(curve[i - 1].bhp);
    }
  });

  it('the minimum is a REDUCTION over the samples and moves with the sampling', () => {
    const out = L.nembeOutflowReadings();
    expect(out.sampledMinimumBhpPsia).toBeGreaterThanOrEqual(out.trueMinimumBhpPsia);
    expect(Math.abs(out.sampledMinusTrueQStbd)).toBeGreaterThan(0);
    // the pressure barely moves even though the rate does, because the bottom
    // of a J is flat: that is exactly why the reduction is gated separately
    expect(Math.abs(out.sampledMinusTrueBhpPsi)).toBeLessThan(1);
  });

  it('wellhead pressure moves the minimum PRESSURE one for one and its RATE not at all', () => {
    const s = L.tubingMinimumSensitivity();
    s.wellheadPressure.forEach((r) => {
      expect(r.minQStbd).toBe(s.baseMinQStbd);
      near(r.dMinBhpPsi, r.pWhPsia - L.CAP.pWhPsia, 1e-9);
    });
  });

  it('more friction pulls the bottom of the J in to a lower rate and lifts it', () => {
    const kFric = L.tubingMinimumSensitivity().frictionConstant;
    for (let i = 1; i < kFric.length; i += 1) {
      expect(kFric[i].minQStbd).toBeLessThan(kFric[i - 1].minQStbd);
      expect(kFric[i].minBhpPsia).toBeGreaterThan(kFric[i - 1].minBhpPsia);
    }
  });

  it('the lightening constant is NOT monotone in rate, though it is in pressure', () => {
    // The minimum PRESSURE climbs all the way with qRef, because a column that
    // lightens more slowly stays heavy. The minimum RATE climbs to an interior
    // maximum near 1200 to 1400 stb/d and then falls away again: a column that
    // lightens very fast and one that barely lightens at all both load up at a
    // low rate, for opposite reasons, and only the pressure column tells them
    // apart. Anyone reading the rate column alone as a monotone lever will
    // read two different columns as the same column.
    const rows = L.tubingMinimumSensitivity({
      qRefList: [100, 200, 300, 450, 600, 800, 1200, 2000, 4000, 10000],
    }).lighteningConstant;
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].minBhpPsia).toBeGreaterThan(rows[i - 1].minBhpPsia);
    }
    const rates = rows.map((r) => r.minQStbd);
    const peak = rates.indexOf(Math.max(...rates));
    expect(peak).toBeGreaterThan(0);
    expect(peak).toBeLessThan(rates.length - 1);
    expect(rows[peak].qRefStbd).toBe(1200);
    for (let i = 1; i <= peak; i += 1) expect(rates[i]).toBeGreaterThan(rates[i - 1]);
    for (let i = peak + 1; i < rates.length; i += 1) expect(rates[i]).toBeLessThan(rates[i - 1]);
  });

  it('the terms cross at a HIGHER rate than the slopes balance at', () => {
    const x = L.tubingLimbCrossover();
    expect(x.converged).toBe(true);
    near(x.gravityPsi, x.frictionPsi, 1e-6);
    expect(x.qStbd).toBeGreaterThan(x.tubingMinimumQStbd);
  });
});

describe('the expert tier argument: the node, the window and the wellhead', () => {
  it('the wellhead sweep walks the two crossings together until they vanish', () => {
    const rows = L.pwhSweepDetail();
    expect(rows.map((r) => r.pWhPsia)).toEqual([1176, 1206, 1236, 1248]);
    const live = rows.filter((r) => r.status === 'flowing');
    expect(live).toHaveLength(3);
    for (let i = 1; i < live.length; i += 1) {
      expect(live[i].qStbd).toBeLessThan(live[i - 1].qStbd);
      expect(live[i].pwfPsia).toBeGreaterThan(live[i - 1].pwfPsia);
      expect(live[i].windowStbd).toBeLessThan(live[i - 1].windowStbd);
      expect(live[i].unstableQStbd).toBeGreaterThan(live[i - 1].unstableQStbd);
    }
    // and 1248 psia is dead: the curves no longer touch at any rate
    expect(rows[3].status).toBe('dead');
    expect(rows[3].crossings).toBe(0);
    expect(rows[3].minimumResidualPsi).toBeGreaterThan(0);
  });

  it('the sweep helper and the direct solve agree row for row', () => {
    const sweep = L.pwhSweep();
    const detail = L.pwhSweepDetail();
    expect(sweep).toHaveLength(4);
    sweep.forEach((r, i) => {
      expect(r.value).toBe(detail[i].pWhPsia);
      expect(r.status).toBe(detail[i].status);
      expect(r.q).toBe(detail[i].qStbd);
    });
  });

  it('wellhead pressure shifts the residual bodily, which is why the margin is so thin', () => {
    const base = L.nembeResidualMinimum({ nPoints: 20001 }).residualPsi;
    L.pwhSweepDetail().forEach((r) => {
      near(r.minimumResidualPsi - base, r.pWhPsia - L.CAP.pWhPsia, 1e-9);
    });
  });

  it('the true tangency is a fraction of a psi away, not the twelve the sweep suggests', () => {
    const t = L.nembeTangency();
    expect(t.converged).toBe(true);
    // the dip is only about a seventh of a psi deep, so the well dies at
    // 1236.14 psia and not at 1248: the sweep's next step simply overshot it
    expect(t.dipPsi).toBeLessThan(0);
    expect(Math.abs(t.dipPsi)).toBeLessThan(0.2);
    near(t.tangentWellheadPsia, 1236.1432878, 1e-4);
    expect(t.tangentWellheadPsia).toBeGreaterThan(L.CAP.pWhPsia);
    expect(t.tangentWellheadPsia).toBeLessThan(L.CAP.sweepPwhPsia[3]);
    // the status bisection on the engine's own verdict lands on the same place
    const d = L.searchDeadWellhead();
    near(d.pWhPsia, t.tangentWellheadPsia, 1e-3);
    expect(d.statusAtCapstone).toBe('flowing');
  });

  it('the residual sweep touches zero exactly twice and is finite everywhere', () => {
    const rows = L.nembeResidualSweep({ nPoints: 1201 });
    expect(rows).toHaveLength(1201);
    rows.forEach((r) => {
      expect(Number.isFinite(r.residualPsi)).toBe(true);
      expect(Number.isFinite(r.iprPwfPsia)).toBe(true);
      expect(Number.isFinite(r.vlpBhpPsia)).toBe(true);
      near(r.residualPsi, r.vlpBhpPsia - r.iprPwfPsia, 1e-9);
    });
    const signChanges = rows.reduce((n, r, i) => (
      i > 0 && Math.sign(r.residualPsi) !== Math.sign(rows[i - 1].residualPsi) ? n + 1 : n), 0);
    expect(signChanges).toBe(2);
  });

  it('the erosional screen clears the operating point at every published C factor', () => {
    const rows = L.nembeErosionalScreen();
    expect(rows).toHaveLength(3);
    rows.forEach((r) => {
      expect(r.exceeded).toBe(false);
      expect(r.ratio).toBeLessThan(1);
      expect(r.erosionalRateBpd).toBeGreaterThan(r.opQStbd);
    });
    // and a larger C factor buys a larger limit, monotonically
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].erosionalRateBpd).toBeGreaterThan(rows[i - 1].erosionalRateBpd);
    }
  });
});

// ---------------------------------------------------------------------------
// 6. THE TWO TEACHING WELLS.
// ---------------------------------------------------------------------------

describe('BONNY-7, the comfortable well', () => {
  const W = L.BONNY_7;

  it('every condition differs from the capstone and from every golden', () => {
    expect(W.prPsia).not.toBe(L.CAP.prPsia);
    expect(W.pbPsia).not.toBe(L.CAP.pbPsia);
    const goldenPrs = G.oilIpr.map((c) => c.inputs.pr);
    expect(goldenPrs).not.toContain(W.prPsia);
    expect(G.iprCalibration.map((c) => c.inputs.pr)).not.toContain(W.prPsia);
    const goldenOutflows = G.nodes.filter((n) => n.outflow.form === 'gravityFriction');
    goldenOutflows.forEach((n) => {
      expect(n.outflow.pWh).not.toBe(W.pWhPsia);
      expect(n.outflow.gGrav).not.toBe(W.gGravPsi);
      expect(n.outflow.qRef).not.toBe(W.qRefStbd);
      expect(n.outflow.kFric).not.toBe(W.kFricPsiPerStbd2);
    });
    [W.pWhPsia, W.gGravPsi, W.qRefStbd, W.kFricPsiPerStbd2].forEach((v, i) => {
      expect(v).not.toBe([L.CAP.pWhPsia, L.CAP.gGravPsi, L.CAP.qRefStbd, L.CAP.kFricPsiPerStbd2][i]);
    });
    G.tubing.forEach((c) => {
      expect(c.inputs.mdFt).not.toBe(W.column.mdFt);
      expect(c.inputs.gasSg).not.toBe(W.column.gasSg);
      expect(c.inputs.ptf).not.toBe(W.column.ptf);
    });
  });

  it('the column does NOT outweigh the reservoir, so the residual starts negative', () => {
    const out = L.wellOutflowReadings(W);
    expect(out.columnOutweighsReservoirAtLowRate).toBe(false);
    expect(out.deadColumnPsia).toBeLessThan(W.prPsia);
    expect(L.wellResidualMinimum(W).residualAtLowestSampledRatePsi).toBeLessThan(0);
  });

  it('exactly ONE crossing, and it is stable', () => {
    const crossings = L.wellCrossings(W);
    expect(crossings).toHaveLength(1);
    expect(crossings[0].stable).toBe(true);
    expect(L.wellNode(W).status).toBe('flowing');
    expect(L.wellResidualMinimum(W).signChanges).toBe(1);
  });

  it('the crossing sits on the RISING FRICTION LIMB, which is the textbook case', () => {
    const win = L.wellWindow(W);
    expect(win.operatingPointIsOnTheFrictionLimb).toBe(true);
    expect(win.opQStbd).toBeGreaterThan(win.tubingMinimumQStbd);
    expect(win.opRightOfTubingMinimumStbd).toBeGreaterThan(500);
  });

  it('the default forty point scan is enough, at every resolution tried', () => {
    L.wellScanStudy(W).forEach((r) => {
      expect(r.status).toBe('flowing');
      expect(r.crossings).toBe(1);
      relNear(r.opQStbd, L.wellNode(W).op.q, 1e-6);
    });
  });

  it('its test is ABOVE the bubble point, so this is the CONTROLLED comparison', () => {
    const aofs = L.wellModelAofs(W);
    expect(aofs.calibrationIsCorrupted).toBe(false);
    // the straight line therefore carries the RIGHT productivity index and
    // agrees with the composite exactly above the bubble point
    near(aofs.straightLinePiStbdPerPsi, aofs.compositePiStbdPerPsi, 1e-12);
    near(aofs.piErrorStbdPerPsi, 0, 1e-12);
    L.wellModelComparison(W).filter((r) => !r.belowBubblePoint).forEach((r) => {
      near(r.straightLineMinusCompositeStbd, 0, 1e-9);
    });
    // and below it the only thing left between them is the SHAPE
    L.wellModelComparison(W).filter((r) => r.belowBubblePoint).forEach((r) => {
      expect(r.straightLineMinusCompositeStbd).toBeGreaterThan(0);
    });
  });

  it('its column is STATIC, so it carries almost no truncation', () => {
    const study = L.wellColumnStepStudy(W);
    expect(Math.abs(study[0].errorVsConvergedPsi)).toBeLessThan(0.5);
    for (let i = 1; i < study.length; i += 1) {
      expect(study[i].pwfPsia).toBeGreaterThan(study[i - 1].pwfPsia);
    }
    expect(L.wellFrictionGroup(W)).toBeNull();
  });
});

describe('FORCADOS-3, the double crossing well', () => {
  const W = L.FORCADOS_3;

  it('every condition differs from the capstone, the goldens and BONNY-7', () => {
    ['prPsia', 'pbPsia', 'testQStbd', 'testPwfPsia', 'iprPoints',
      'pWhPsia', 'gGravPsi', 'qRefStbd', 'kFricPsiPerStbd2', 'vlpPoints',
      'tubingIdIn', 'mixtureDensityLbFt3'].forEach((k) => {
      expect(W[k]).not.toBe(L.BONNY_7[k]);
    });
    ['ptf', 'gasSg', 'mdFt', 'tvdFt', 'whtF', 'bhtF'].forEach((k) => {
      expect(W.column[k]).not.toBe(L.BONNY_7.column[k]);
      G.tubing.forEach((c) => expect(W.column[k]).not.toBe(c.inputs[k]));
    });
    expect(W.prPsia).not.toBe(L.CAP.prPsia);
    expect(W.column.qMmscfd).not.toBe(L.CAP.diagQMmscfd);
    expect(W.column.idIn).not.toBe(L.CAP.diagIdIn);
  });

  it('the column OUTWEIGHS the reservoir, so the residual starts positive', () => {
    const out = L.wellOutflowReadings(W);
    expect(out.columnOutweighsReservoirAtLowRate).toBe(true);
    expect(out.deadColumnAbovePrPsi).toBeGreaterThan(500);
    expect(L.wellResidualMinimum(W).residualAtLowestSampledRatePsi).toBeGreaterThan(0);
    expect(L.wellResidualMinimum(W).signChanges).toBe(2);
  });

  it('two crossings, the left one unstable and the right one stable', () => {
    const crossings = L.wellCrossings(W);
    expect(crossings).toHaveLength(2);
    expect(crossings[0].stable).toBe(false);
    expect(crossings[1].stable).toBe(true);
    expect(crossings[1].isOperatingPoint).toBe(true);
    expect(crossings[0].qStbd).toBeLessThan(crossings[1].qStbd);
    expect(crossings[1].pwfPsia).toBeLessThan(crossings[0].pwfPsia);
  });

  it('the stable window is COMFORTABLY WIDER than the capstone, by design', () => {
    // The capstone's 24.6453 stb/d window is the capstone's own finding and
    // stays there. This well is not close to loading up and the number says so.
    const win = L.wellWindow(W);
    const capstoneWindow = L.nembeStableWindow().widthStbd;
    expect(win.widthStbd).toBeGreaterThan(1000);
    expect(win.widthStbd / capstoneWindow).toBeGreaterThan(50);
    expect(win.widthAsFractionOfAof).toBeGreaterThan(0.4);
  });

  it('and its operating point is on the RISING limb, unlike the capstone', () => {
    expect(L.wellWindow(W).operatingPointIsOnTheFrictionLimb).toBe(true);
    expect(L.nembeStableWindow().opLeftOfTubingMinimumStbd).toBeGreaterThan(0);
  });

  it('the default forty point scan resolves it, at every resolution tried', () => {
    const rows = L.wellScanStudy(W);
    rows.forEach((r) => {
      expect(r.status).toBe('flowing');
      expect(r.crossings).toBe(2);
    });
    // the scan spacing is a small fraction of the window at every count
    const win = L.wellWindow(W).widthStbd;
    rows.forEach((r) => expect(r.spacingStbd).toBeLessThan(win / 10));
  });

  it('its test is BELOW the bubble point, so this is the CORRUPTED comparison', () => {
    const aofs = L.wellModelAofs(W);
    expect(aofs.calibrationIsCorrupted).toBe(true);
    // the straight line backs out an index that is not the well's, and reads
    // LOW above the test rather than high: the trap the capstone shares
    expect(aofs.straightLinePiStbdPerPsi).not.toBe(aofs.compositePiStbdPerPsi);
    expect(aofs.piErrorStbdPerPsi).toBeLessThan(0);
    L.wellModelComparison(W)
      .filter((r) => r.pwfPsia > W.testPwfPsia && r.pwfPsia < W.prPsia)
      .forEach((r) => expect(r.straightLineMinusCompositeStbd).toBeLessThan(0));
  });

  it('its column FLOWS, so it carries real truncation', () => {
    const fg = L.wellFrictionGroup(W);
    expect(fg.f2).toBeGreaterThan(0);
    expect(fg.reynolds).toBeGreaterThan(4000);
    const study = L.wellColumnStepStudy(W);
    expect(study[0].errorVsConvergedPsi).toBeLessThan(0);
    for (let i = 1; i < study.length; i += 1) {
      expect(study[i].pwfPsia).toBeGreaterThan(study[i - 1].pwfPsia);
    }
    // and its defining integral closes on 18.75 gammaG L, better as the march
    // is refined: this is a convergence check on the closure, not a fixed band,
    // because the closure march carries its own quadrature error and that error
    // grows with the friction group.
    const col = L.wellColumnVsAverageTz(W);
    relNear(col.definingIntegral.integral, col.definingIntegral.target, 1e-3);
    const coarse = L.definingIntegralMarch({ ...W.column, n: 250 });
    const fine = L.definingIntegralMarch({ ...W.column, n: 4000 });
    expect(Math.abs(fine.closureError)).toBeLessThan(Math.abs(coarse.closureError));
    relNear(fine.integral, fine.target, 5e-5);
  });
});

describe('ESCRAVOS-9, the FALLING LIMB well', () => {
  const W = L.ESCRAVOS_9;
  const win = L.wellWindow(W);

  it('every condition differs from the capstone, the goldens and the other two wells', () => {
    ['prPsia', 'pbPsia', 'testQStbd', 'testPwfPsia', 'iprPoints', 'pWhPsia', 'gGravPsi',
      'qRefStbd', 'kFricPsiPerStbd2', 'vlpPoints', 'tubingIdIn', 'mixtureDensityLbFt3',
      'columnSteps'].forEach((k) => {
      expect(W[k]).not.toBe(L.BONNY_7[k]);
      expect(W[k]).not.toBe(L.FORCADOS_3[k]);
    });
    ['ptf', 'gasSg', 'mdFt', 'tvdFt', 'whtF', 'bhtF'].forEach((k) => {
      expect(W.column[k]).not.toBe(L.BONNY_7.column[k]);
      expect(W.column[k]).not.toBe(L.FORCADOS_3.column[k]);
      G.tubing.forEach((c) => expect(W.column[k]).not.toBe(c.inputs[k]));
    });
    expect(G.oilIpr.map((c) => c.inputs.pr)).not.toContain(W.prPsia);
    expect(G.iprCalibration.map((c) => c.inputs.pr)).not.toContain(W.prPsia);
    G.nodes.filter((n) => n.outflow.form === 'gravityFriction').forEach((n) => {
      expect(n.outflow.pWh).not.toBe(W.pWhPsia);
      expect(n.outflow.gGrav).not.toBe(W.gGravPsi);
      expect(n.outflow.qRef).not.toBe(W.qRefStbd);
      expect(n.outflow.kFric).not.toBe(W.kFricPsiPerStbd2);
    });
    [L.CAP.prPsia, L.CAP.pbPsia, L.CAP.pWhPsia, L.CAP.gGravPsi, L.CAP.qRefStbd,
      L.CAP.kFricPsiPerStbd2].forEach((v, idx) => {
      expect([W.prPsia, W.pbPsia, W.pWhPsia, W.gGravPsi, W.qRefStbd, W.kFricPsiPerStbd2][idx])
        .not.toBe(v);
    });
  });

  it('THE POINT OF IT: the stable crossing sits on the FALLING limb', () => {
    expect(win.crossings).toBe(2);
    expect(win.operatingPointIsOnTheFrictionLimb).toBe(false);
    // 792 stb/d to the LEFT of the bottom of its own tubing curve
    expect(win.opQStbd).toBeLessThan(win.tubingMinimumQStbd);
    expect(win.opRightOfTubingMinimumStbd).toBeLessThan(-500);
  });

  it('and it is stable anyway, because stability is a DIFFERENCE of slopes', () => {
    const out = L.wellOutflow(W);
    const ipr = L.wellIpr(W);
    const q = win.opQStbd;
    const vlpSlope = L.outflowSlope(out, q);
    const iprSlope = L.inflowSlope(ipr, q);
    // the outflow is still FALLING at the operating point
    expect(vlpSlope).toBeLessThan(0);
    // the inflow is falling FASTER, so the residual is rising
    expect(iprSlope).toBeLessThan(vlpSlope);
    expect(vlpSlope - iprSlope).toBeGreaterThan(0);
    // and the engine agrees, by its own central difference
    expect(L.wellNode(W).op.stable).toBe(true);
    expect(L.wellCrossings(W)[1].stable).toBe(true);
    expect(L.wellCrossings(W)[0].stable).toBe(false);
  });

  it('the other two wells do NOT do this, so the lesson has a control', () => {
    expect(L.wellWindow(L.BONNY_7).operatingPointIsOnTheFrictionLimb).toBe(true);
    expect(L.wellWindow(L.FORCADOS_3).operatingPointIsOnTheFrictionLimb).toBe(true);
    [L.BONNY_7, L.FORCADOS_3].forEach((other) => {
      const w = L.wellWindow(other);
      expect(L.outflowSlope(L.wellOutflow(other), w.opQStbd)).toBeGreaterThan(0);
    });
  });

  it('it is ORDINARY in every other respect: wide window, default scan, static column', () => {
    expect(win.widthStbd).toBeGreaterThan(500);
    expect(win.widthStbd / L.nembeStableWindow().widthStbd).toBeGreaterThan(20);
    L.wellScanStudy(W).forEach((r) => {
      expect(r.status).toBe('flowing');
      expect(r.crossings).toBe(2);
      expect(r.spacingStbd).toBeLessThan(win.widthStbd);
    });
    expect(L.wellFrictionGroup(W)).toBeNull();
    expect(L.wellOutflowReadings(W).columnOutweighsReservoirAtLowRate).toBe(true);
    expect(L.wellResidualMinimum(W).signChanges).toBe(2);
  });

  it('choking it back kills it, which is the ordinary sweep behaviour', () => {
    const rows = L.wellPwhSweepDetail(W);
    const live = rows.filter((r) => r.status === 'flowing');
    expect(live.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < live.length; i += 1) {
      expect(live[i].windowStbd).toBeLessThan(live[i - 1].windowStbd);
    }
    expect(rows[rows.length - 1].status).toBe('dead');
  });
});

describe('the two station verdict on a teaching column, both kinds side by side', () => {
  // The Professional tier's gascolumn panel prints this table, and the claim it
  // prints is that the published two station method fails DIFFERENTLY on a
  // static column and on a flowing one. Both numbers have to be on the same
  // row for that to be readable, and the ratio has to come from here rather
  // than from a panel dividing two engine values together.
  const table = L.teachingColumnTruncationTable();
  const gravityOnly = L.wellColumnStepStudy(L.BONNY_7);
  const frictionLoaded = L.wellColumnStepStudy(L.FORCADOS_3);

  it('marches at the six stated step counts and names both columns', () => {
    expect(table.map((r) => r.steps)).toEqual([2, 4, 8, 20, 64, 256]);
    table.forEach((r) => {
      expect(r.gravityLabel).toBe('BONNY-7');
      expect(r.frictionLabel).toBe('FORCADOS-3');
    });
  });

  it('carries the two step studies through unaltered', () => {
    table.forEach((r, i) => {
      expect(r.gravityOnlyPwfPsia).toBe(gravityOnly[i].pwfPsia);
      expect(r.gravityOnlyErrorPsi).toBe(gravityOnly[i].errorVsConvergedPsi);
      expect(r.frictionLoadedPwfPsia).toBe(frictionLoaded[i].pwfPsia);
      expect(r.frictionLoadedErrorPsi).toBe(frictionLoaded[i].errorVsConvergedPsi);
    });
  });

  it('both columns run LOW at two stations, as the engine header states', () => {
    expect(table[0].gravityOnlyErrorPsi).toBeLessThan(0);
    expect(table[0].frictionLoadedErrorPsi).toBeLessThan(0);
    near(table[0].gravityOnlyErrorPsi, -0.018337, 5e-5);
    near(table[0].frictionLoadedErrorPsi, -7.541082, 5e-5);
  });

  it('THE FINDING: the two gaps are different in KIND, not in size', () => {
    // a static column loses hundredths of a psi to the truncation and a
    // flowing one loses whole psi, on the same method and the same step count
    expect(Math.abs(table[0].gravityOnlyErrorPsi)).toBeLessThan(0.05);
    expect(Math.abs(table[0].frictionLoadedErrorPsi)).toBeGreaterThan(1);
    expect(table[0].errorRatio).toBeGreaterThan(100);
    // and the friction group is the only thing between them
    expect(L.wellFrictionGroup(L.BONNY_7)).toBeNull();
    expect(L.wellFrictionGroup(L.FORCADOS_3).f2).toBeGreaterThan(0);
  });

  it('the converged row is exact and its ratio refuses to be a number', () => {
    const last = table[table.length - 1];
    expect(last.gravityOnlyErrorPsi).toBe(0);
    expect(last.frictionLoadedErrorPsi).toBe(0);
    expect(Number.isNaN(last.errorRatio)).toBe(true);
  });
});

describe('the slope test, both halves of it', () => {
  it('the numerical outflow slope matches the instrument\'s closed form', () => {
    L.TEACHING_WELLS.forEach((W) => {
      const analytic = L.gravityFrictionSlope({
        gGrav: W.gGravPsi, qRef: W.qRefStbd, kFric: W.kFricPsiPerStbd2,
      });
      L.wellSlopeTable(W).forEach((r) => {
        near(r.outflowSlopePsiPerStbd, analytic(r.qStbd), 1e-6);
        near(r.analyticOutflowSlopePsiPerStbd, analytic(r.qStbd), 1e-12);
      });
    });
  });

  it('the residual slope is the difference of the two, at every tabulated rate', () => {
    L.TEACHING_WELLS.forEach((W) => {
      L.wellSlopeTable(W).forEach((r) => {
        near(
          r.residualSlopePsiPerStbd,
          r.outflowSlopePsiPerStbd - r.inflowSlopePsiPerStbd,
          1e-12,
        );
        // the inflow slope is negative everywhere, always
        expect(r.inflowSlopePsiPerStbd).toBeLessThan(0);
      });
    });
  });

  it('the sign of the OUTFLOW slope decides nothing on its own', () => {
    // The claim m03 l04 rests on. Across the three teaching wells there are
    // rates where the outflow falls and the residual rises, and rates where the
    // outflow falls and the residual falls. One sign does not determine the
    // other, and the digest now carries both columns so a lesson can show it.
    const rows = L.TEACHING_WELLS.flatMap((W) => L.wellSlopeTable(W));
    const fallingAndRising = rows.filter((r) => r.outflowIsFalling && r.residualIsRising);
    const fallingAndFalling = rows.filter((r) => r.outflowIsFalling && !r.residualIsRising);
    expect(fallingAndRising.length).toBeGreaterThan(0);
    expect(fallingAndFalling.length).toBeGreaterThan(0);
  });

  it('every crossing has the residual slope its stability flag claims', () => {
    L.TEACHING_WELLS.forEach((W) => {
      const out = L.wellOutflow(W);
      const ipr = L.wellIpr(W);
      L.wellCrossings(W).forEach((x) => {
        const g = L.outflowSlope(out, x.qStbd) - L.inflowSlope(ipr, x.qStbd);
        if (x.stable) expect(g).toBeGreaterThan(0);
        else expect(g).toBeLessThan(0);
      });
    });
  });
});

describe('the residual tables show the dip as a shape', () => {
  it('every teaching well gets at least seven rows', () => {
    L.TEACHING_WELLS.forEach((W) => {
      expect(L.wellResidualTable(W).length).toBeGreaterThanOrEqual(7);
    });
  });

  it('every row is the outflow minus the inflow, and the crossings are zeros', () => {
    L.TEACHING_WELLS.forEach((W) => {
      L.wellResidualTable(W).forEach((r) => {
        near(r.residualPsi, r.vlpBhpPsia - r.iprPwfPsia, 1e-9);
        // the engine brackets crossings to a RATE tolerance, so the residual
        // there is that tolerance times the local slope, not machine zero
        if (r.isCrossing) expect(Math.abs(r.residualPsi)).toBeLessThan(1e-3);
      });
    });
  });

  it('a two crossing well shows positive, down through zero, negative, back up', () => {
    [L.FORCADOS_3, L.ESCRAVOS_9].forEach((W) => {
      const rows = L.wellResidualTable(W);
      expect(rows[0].residualPsi).toBeGreaterThan(0);
      expect(rows[rows.length - 1].residualPsi).toBeGreaterThan(0);
      expect(rows.some((r) => r.isDip && r.residualPsi < 0)).toBe(true);
      expect(rows.filter((r) => r.isCrossing)).toHaveLength(2);
      // and a bracket either side of each crossing, with opposite signs
      const crossings = rows.filter((r) => r.isCrossing);
      crossings.forEach((c) => {
        const i = rows.indexOf(c);
        expect(rows[i - 1].residualPsi * rows[i + 1].residualPsi).toBeLessThan(0);
      });
    });
  });

  it('the golden two crossing case now shows its residual POSITIVE below the lower crossing', () => {
    // The published probes start at 126.6667 stb/d, already past the crossing at
    // 44.984487, so the golden's own rows never showed the residual positive
    // and the two crossing story could not be checked from them.
    const rows = L.goldenNodeResidualTable('compositeTwoCrossings');
    const lower = G.nodes.find((n) => n.id === 'compositeTwoCrossings').intersections[0].q;
    const below = rows.filter((r) => r.qStbd < lower);
    expect(below.length).toBeGreaterThanOrEqual(3);
    below.forEach((r) => expect(r.residualPsi).toBeGreaterThan(0));
    expect(Math.min(...G.nodes.find((n) => n.id === 'compositeTwoCrossings').probes.map((p) => p.q)))
      .toBeGreaterThan(lower);
  });

  it('every golden node gets a table whose crossings are zeros of the residual', () => {
    G.nodes.forEach((c) => {
      const rows = L.goldenNodeResidualTable(c.id);
      expect(rows.length).toBeGreaterThanOrEqual(7);
      rows.forEach((r) => {
        near(r.residualPsi, r.vlpBhpPsia - r.iprPwfPsia, 1e-9);
        if (r.isCrossing) expect(Math.abs(r.residualPsi)).toBeLessThan(1e-4);
        near(r.residualSlopePsiPerStbd,
          r.outflowSlopePsiPerStbd - r.inflowSlopePsiPerStbd, 1e-12);
      });
    });
  });
});

describe('the scan reversal, taught on FORCADOS-3 choked back', () => {
  const rows = L.scanReversalStudy();
  const truth = L.scanReversalTruth();
  const at = (n) => rows.find((r) => r.nGrid === n);

  it('the choked well really is alive, resolved finely enough to trust', () => {
    expect(truth.status).toBe('flowing');
    expect(truth.crossings).toBe(2);
    expect(truth.minimumResidualPsi).toBeLessThan(0);
    // still more than twice the capstone's window, so the capstone's
    // narrowness remains the capstone's own finding
    expect(truth.windowStbd).toBeGreaterThan(2 * L.nembeStableWindow().widthStbd);
  });

  it('A FINER SCAN IS NOT A BETTER SCAN: 40 finds it, 50 loses it, 60 finds it', () => {
    expect(at(40).status).toBe('flowing');
    expect(at(50).status).toBe('dead');
    expect(at(60).status).toBe('flowing');
    // and the one that fails has the FINER spacing of the three
    expect(at(50).spacingStbd).toBeLessThan(at(40).spacingStbd);
    expect(at(50).spacingStbd).toBeGreaterThan(at(60).spacingStbd);
  });

  it('the coarse scan that succeeds has a spacing wider than the window', () => {
    expect(at(40).spacingStbd).toBeGreaterThan(truth.windowStbd);
    // which is the whole point: it succeeded by luck of where its samples fell
  });

  it('every resolution that finds it agrees on the operating rate', () => {
    rows.filter((r) => r.status === 'flowing').forEach((r) => {
      relNear(r.opQStbd, truth.opQStbd, 1e-6);
      relNear(r.windowStbd, truth.windowStbd, 1e-6);
    });
  });

  it('the residual is the honest check, and it never reverses', () => {
    const rm = L.wellResidualMinimum(L.FORCADOS_3, {
      nPoints: 40001, pWh: L.SCAN_REVERSAL_PWH_PSIA,
    });
    expect(rm.signChanges).toBe(2);
    expect(rm.residualPsi).toBeLessThan(0);
  });
});

// ---------------------------------------------------------------------------
// 7. THE TEACHING DIGEST, AND THE LEAK GATE THAT KEEPS THE CAPSTONE OUT OF IT.
// ---------------------------------------------------------------------------

describe('the teaching digest', () => {
  const text = L.digestText();
  const lines = text.split('\n');
  const valueLines = lines.filter((l) => l && !l.startsWith('#'));

  it('is a long list of source tagged label = value lines', () => {
    expect(valueLines.length).toBeGreaterThan(1000);
    valueLines.forEach((line) => expect(line).toMatch(/^.+, .+ = .+$/));
  });

  it('every line names its source: a golden case or a teaching well', () => {
    valueLines.forEach((line) => {
      expect(line).toMatch(/^(golden |teaching well )/);
    });
  });

  it('carries all three teaching wells and the golden families', () => {
    expect(text).toContain('teaching well BONNY-7');
    expect(text).toContain('teaching well FORCADOS-3');
    expect(text).toContain('teaching well ESCRAVOS-9');
    expect(text).toContain('teaching well FORCADOS-3 choked');
    expect(L.TEACHING_WELLS).toHaveLength(3);
    ['straightLine', 'vogelSaturated', 'compositeStanding', 'fetkovich', 'jonesBlountGlaze']
      .forEach((id) => expect(text).toContain(`golden oil IPR ${id}`));
    expect(text).toContain('STABLE WINDOW WIDTH');
    expect(text).toContain('TRUE STABLE WINDOW WIDTH');
  });

  it('names NEMBE-14 nowhere, and none of the capstone conditions', () => {
    expect(text).not.toContain('NEMBE');
    expect(text).not.toContain('capstone NEMBE-14');
    // no line of the capstone digest may appear in the teaching one
    expect(text).not.toMatch(/graded (ipr|vlp|liftgas|node|sweep)_/);
  });

  it('carries no em dash or en dash anywhere', () => {
    expect(text).not.toMatch(/[\u2013\u2014]/);
  });

  it('is deterministic', () => {
    expect(L.digestText()).toBe(text);
  });
});

describe('THE LEAK GATE: no teaching number may be a graded capstone answer', () => {
  // THE THRESHOLD IS THE GRADER'S OWN, AND IT IS ABSOLUTE.
  //
  // `public.academy_submit_capstone` in
  // migrations/20260715_n4_petrophysics_capstone.sql grades each field with
  //
  //     if v_got is not null and abs(v_got - v_exp) <= v_tol then
  //
  // so `tol` is an absolute band in the field's own units and not a fraction of
  // the value. `vlp_min_bhp_psia` is accepted within 0.0014 psi, not within
  // 3.99 psi. Read that function before touching the numbers below: a guard
  // whose threshold is inferred rather than read is how this check first came
  // out about two thousand eight hundred times too wide, and a gate that wide
  // withholds good teaching material for nothing.
  //
  // The rule, and why each half of it exists.
  //
  //   DIMENSION AWARE, TEN TIMES THE ABSOLUTE BAND. Every number in every line
  //   that carries a unit a graded answer could carry, checked against every
  //   graded field of a compatible dimension, in three unit shiftings. Ten
  //   times, so a lesson that rounds a number in prose still cannot land on an
  //   answer. Pressures pool psi with psia; rates pool stb/d with Mscf/d,
  //   MMscf/d and bbl/d, because that pooling is exactly the restatement the
  //   shiftings exist to catch.
  //
  //   DIMENSION BLIND, THE ABSOLUTE BAND ITSELF. Any number anywhere that would
  //   literally be marked correct if pasted into a graded box, whatever it
  //   actually measures, because the grader compares numbers and never asks
  //   what they were a measurement of.
  //
  // WHAT THE GATE FINDS, WHICH IS WORTH STATING POSITIVELY: NOTHING. The
  // published goldens are CLEAN and so are both teaching wells. Not one number
  // in the digest is withheld, and the closest any of them comes to a graded
  // answer is the Jones, Blount and Glaze reservoir pressure of 2800 psia,
  // which is 374 tolerances from `sweep_pwh1176_pwf_psia`. The next closest is
  // that family's open flow, 341 tolerances from a capstone pressure across a
  // dimension. Both are numerically near and gradingly nowhere. The gate earns
  // its place by proving that, and by catching anything a later wave adds.

  const targets = L.leakGuardTargets();

  it('the guard is built from all eighteen fields in all three unit shiftings', () => {
    expect(targets).toHaveLength(18 * 3);
    CAPSTONE_FIELDS.forEach(([, key, , tol]) => {
      expect(L.CAPSTONE_TOLERANCES[key]).toBe(tol);
      expect(L.GRADED_FIELD_DIMENSION[key]).toBeTruthy();
    });
    expect(L.LEAK_GUARD_MARGIN).toBe(10);
  });

  it('NO dimensioned number in the teaching digest is within ten times a grading band', () => {
    const hits = [];
    L.digestDimensionedNumbers(L.digestText()).forEach((n) => {
      targets.forEach((t) => {
        if (t.dimension !== n.dimension) return;
        if (Math.abs(n.value - t.value) < t.band) {
          hits.push(`${n.value} ${n.unit} is within ${t.band} of ${t.key} ${t.tag} (${t.value}) :: ${n.text}`);
        }
      });
    });
    expect(hits).toEqual([]);
  });

  it('NO number at all in the teaching digest would be marked correct by the grader', () => {
    const bare = targets.filter((t) => t.tag === 'as graded');
    const hits = [];
    L.digestText().split('\n').forEach((line) => {
      if (!line || line.startsWith('#')) return;
      L.digestNumbers(line).forEach((v) => {
        bare.forEach((t) => {
          if (Math.abs(v - t.value) < t.gradingBand) {
            hits.push(`${v} would grade as ${t.key} (${t.value}) :: ${line}`);
          }
        });
      });
    });
    expect(hits).toEqual([]);
  });

  it('THE GUARD IS LIVE: a planted leak is caught and withheld', () => {
    // Deliberate failure. Every graded answer, and a prose rounding of each,
    // pushed through the censor in a line shaped exactly like a real one. Not
    // one of them survives, and each is replaced by a stated withholding.
    const values = L.capstoneValues();
    Object.entries(values).forEach(([key, v]) => {
      const unit = L.GRADED_FIELD_DIMENSION[key] === 'rate' ? 'stb/d'
        : (L.GRADED_FIELD_DIMENSION[key] === 'pressure' ? 'psia' : 'stb/d/psi');
      // the answer itself, and a drift of nine tenths of the guard band either
      // way, which is the prose rounding the ten times margin exists to cover
      const drift = 0.9 * L.LEAK_GUARD_MARGIN * L.CAPSTONE_TOLERANCES[key];
      [v, v + drift, v - drift].forEach((planted) => {
        const line = `teaching well BONNY-7, planted ${key} = ${planted} ${unit}`;
        const c = L.censorDigestLine(line, targets);
        expect(c.withheld).toBeGreaterThan(0);
        expect(c.line).toContain(L.LEAK_WITHHELD);
        expect(c.line).not.toContain(String(planted));
      });
    });
  });

  it('THE GUARD IS LIVE: a planted UNIT SHIFTED leak is caught too', () => {
    const values = L.capstoneValues();
    const line = `teaching well FORCADOS-3, planted rate = ${values.node_op_q_stbd / 1000} Mscf/d`;
    const c = L.censorDigestLine(line, targets);
    expect(c.withheld).toBeGreaterThan(0);
    expect(c.line).toContain(L.LEAK_WITHHELD);
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: an ordinary teaching number passes', () => {
    const line = 'teaching well BONNY-7, absolute open flow = 4324.444444 stb/d';
    const c = L.censorDigestLine(line, targets);
    expect(c.withheld).toBe(0);
    expect(c.line).toBe(line);
  });

  it('THE GOLDENS AND BOTH TEACHING WELLS ARE CLEAN: nothing is withheld at all', () => {
    // Measured against the grader's real absolute bands, not one number in the
    // digest is close enough to a graded answer to need removing. The guard
    // stays armed for the six waves that will add to this file, but it is
    // reporting a clean bill and not papering over a problem.
    const withheld = L.digestWithheld();
    expect(withheld).toEqual([]);
    expect(L.digestText()).not.toContain(L.LEAK_WITHHELD);
  });

  it('the tolerances are the grader\'s, absolute, and tight', () => {
    // A guard on the relative reading of these same numbers would be about
    // 2800 times wider. Pinning the absolute reading here means a future edit
    // that reintroduces the mistake fails rather than silently over-censors.
    const t = L.leakGuardTargets().find((x) => x.key === 'vlp_min_bhp_psia' && x.tag === 'as graded');
    expect(t.gradingBand).toBe(0.0014);
    near(t.value, 2849.67283735105, 1e-9);
    expect(t.band).toBe(0.014);
    // and under a unit shift the band shifts with the value
    const shifted = L.leakGuardTargets().find((x) => x.key === 'vlp_min_bhp_psia' && x.tag === 'x1000');
    expect(shifted.gradingBand).toBe(1.4);
  });
});

describe('the teaching digest is RE-DERIVABLE from its own stated inputs', () => {
  // A lesson writer re-derived both teaching wells' open flows, saturated
  // shares, bubble point rates, dead columns, gravity and friction terms,
  // tubing minima, operating points, residual minima and window widths from
  // the digest's printed conditions alone, and every one reproduced. This
  // pins that property so it survives the file growing: a digest whose stated
  // conditions do not reproduce its stated results is worse than no digest,
  // because every lesson built on it inherits the inconsistency.
  const text = L.digestText();
  const map = L.digestLookup(text);
  const get = (source, label) => {
    const key = `${source}, ${label}`;
    if (!map.has(key)) throw new Error(`digest has no line "${key}"`);
    return map.get(key);
  };

  L.TEACHING_WELLS.forEach((W) => {
    const src = `teaching well ${W.label}`;

    it(`${W.label}: the inflow re-derives from pr, pb and the production test`, () => {
      const pr = get(src, 'reservoir pressure');
      const pb = get(src, 'bubble point pressure');
      const testQ = get(src, 'production test rate');
      const testPwf = get(src, 'production test flowing pressure');
      expect(get(src, 'production test drawdown')).toBe(pr - testPwf);

      // Standing's composite calibration, written from the printed inputs alone
      const vogel = (r) => 1 - 0.2 * r - 0.8 * r * r;
      const factor = testPwf >= pb
        ? pr - testPwf
        : (pr - pb) + (pb / 1.8) * vogel(testPwf / pb);
      const pi = testQ / factor;
      near(pi, get(src, 'productivity index'), 5e-7);

      const qb = pi * (pr - pb);
      const vogelBlock = (pi * pb) / 1.8;
      near(qb, get(src, 'undersaturated block, PI times drawdown to pb'), 5e-5);
      near(qb, get(src, 'rate at the bubble point'), 5e-5);
      near(vogelBlock, get(src, 'saturated Vogel block, PI times pb over 1.8'), 5e-5);
      near(qb + vogelBlock, get(src, 'absolute open flow'), 5e-5);
      near(vogelBlock / (qb + vogelBlock), get(src, 'saturated share of the open flow'), 5e-8);
    });

    it(`${W.label}: the outflow re-derives from pWh, gGrav, qRef and kFric`, () => {
      const pWh = get(src, 'wellhead pressure');
      const gGrav = get(src, 'gravity constant gGrav');
      const qRef = get(src, 'lightening constant qRef');
      const kFric = get(src, 'friction constant kFric');
      near(pWh + gGrav, get(src, 'dead column at zero rate'), 5e-9);
      near(pWh + gGrav - get(src, 'reservoir pressure'),
        get(src, 'dead column above reservoir pressure'), 5e-9);

      // every printed decomposition row, from the four constants alone
      const bhp = (q) => pWh + gGrav / (1 + q / qRef) + kFric * q * q;
      L.wellDecomposition(W).filter((_, i) => i % 4 === 0).forEach((r) => {
        const q = Number(r.qStbd.toFixed(2));
        near(gGrav / (1 + r.qStbd / qRef), get(src, `gravity term at ${q.toFixed(2)} stb/d`), 5e-5);
        near(kFric * r.qStbd * r.qStbd, get(src, `friction term at ${q.toFixed(2)} stb/d`), 5e-5);
        near(bhp(r.qStbd), get(src, `outflow bhp at ${q.toFixed(2)} stb/d`), 5e-5);
      });

      // the tubing minimum satisfies d(bhp)/dq = 0 at the printed rate
      const qMin = get(src, 'true tubing minimum rate at 20001 points');
      const slope = (q) => -(gGrav / qRef) / (1 + q / qRef) ** 2 + 2 * kFric * q;
      // the printed minimum is a REDUCTION over 20001 samples, so it sits
      // within half a sample of the stationary point rather than on it
      expect(Math.abs(slope(qMin))).toBeLessThan(2e-3);
      const spacing = get(src, 'absolute open flow') / 20000;
      expect(bhp(qMin)).toBeLessThanOrEqual(bhp(qMin + spacing));
      expect(bhp(qMin)).toBeLessThanOrEqual(bhp(qMin - spacing));
      near(bhp(qMin), get(src, 'true tubing minimum bhp at 20001 points'), 5e-5);
      // and the printed outflow slope at the operating point is that same form
      near(slope(get(src, 'operating rate')),
        get(src, 'outflow slope at the operating point'), 5e-7);
    });

    it(`${W.label}: the node re-derives, and the residual closes at every printed rate`, () => {
      const pWh = get(src, 'wellhead pressure');
      const gGrav = get(src, 'gravity constant gGrav');
      const qRef = get(src, 'lightening constant qRef');
      const kFric = get(src, 'friction constant kFric');
      const bhp = (q) => pWh + gGrav / (1 + q / qRef) + kFric * q * q;

      // the operating point is a zero of outflow minus inflow, from the file
      const opQ = get(src, 'operating rate');
      const opPwf = get(src, 'operating flowing pressure');
      expect(Math.abs(bhp(opQ) - opPwf)).toBeLessThan(1e-3);
      near(get(src, 'reservoir pressure') - opPwf, get(src, 'drawdown at the operating point'), 5e-5);
      near(opQ / get(src, 'absolute open flow'),
        get(src, 'operating rate as a fraction of open flow'), 5e-8);
      near(opQ - get(src, 'true tubing minimum rate at 20001 points'),
        get(src, 'operating point right of the tubing minimum'), 5e-5);

      // every residual table row closes on its own two printed pressures
      L.wellResidualTable(W).forEach((r) => {
        const tag = r.isCrossing ? ' (AT A CROSSING)' : (r.isDip ? ' (AT THE DIP)' : '');
        const q = r.qStbd.toFixed(4);
        const ipr = get(src, `residual table, inflow pressure at ${q} stb/d${tag}`);
        const vlp = get(src, `residual table, outflow pressure at ${q} stb/d${tag}`);
        const res = get(src, `residual table, residual at ${q} stb/d${tag}`);
        near(vlp - ipr, res, 5e-5);
        near(bhp(r.qStbd), vlp, 5e-5);
      });

      // and the window is the difference of the two printed crossings
      if (map.has(`${src}, STABLE WINDOW WIDTH`)) {
        near(opQ - get(src, 'unstable heading crossing rate'),
          get(src, 'STABLE WINDOW WIDTH'), 5e-5);
        near(get(src, 'STABLE WINDOW WIDTH') / get(src, 'absolute open flow'),
          get(src, 'stable window as a fraction of open flow'), 5e-8);
      }
    });

    it(`${W.label}: the printed slope columns are consistent with each other`, () => {
      L.wellSlopeTable(W).forEach((r) => {
        const q = r.qStbd.toFixed(0);
        const inf = get(src, `inflow slope at ${q} stb/d`);
        const outSlope = get(src, `outflow slope at ${q} stb/d`);
        const res = get(src, `residual slope at ${q} stb/d`);
        near(outSlope - inf, res, 5e-8);
        expect(get(src, `the outflow is falling at ${q} stb/d`)).toBe(outSlope < 0 ? 'yes' : 'no');
        expect(get(src, `the residual is rising at ${q} stb/d`)).toBe(res > 0 ? 'yes' : 'no');
      });
    });
  });

  it('the scan reversal rows re-derive: spacing over window is what it says', () => {
    const src = 'teaching well FORCADOS-3 choked';
    const window = get(src, 'TRUE STABLE WINDOW WIDTH');
    near(get(src, 'true operating rate') - get(src, 'true unstable crossing rate'), window, 5e-5);
    L.SCAN_REVERSAL_GRIDS.forEach((n) => {
      const spacing = get(src, `nGrid ${n}, scan spacing`);
      near(spacing / window, get(src, `nGrid ${n}, spacing over the true window`), 5e-6);
      // and the spacing is the engine's own scan spacing for that grid count
      near(spacing, L.scanSpacingStbd(n, get(src, 'absolute open flow')), 5e-5);
    });
  });
});

// ---------------------------------------------------------------------------
// 8. THE CAPSTONE DIGEST, WHICH IS THE OTHER SIDE OF THE SAME WALL.
// ---------------------------------------------------------------------------

describe('the capstone digest', () => {
  const text = L.capstoneDigestText();

  it('carries NEMBE-14 and every graded field with its tier', () => {
    expect(text).toContain('NEMBE-14');
    CAPSTONE_FIELDS.forEach(([tier, key]) => {
      expect(text).toContain(`graded ${key} (${tier}) = `);
    });
  });

  it('carries both derivations of the wellhead margin and their agreement', () => {
    expect(text).toContain('wellhead pressure at true tangency');
    expect(text).toContain('wellhead pressure at which the scan loses the well');
    expect(text).toContain('the two derivations differ by');
    const tang = L.nembeTangency();
    const dead = L.searchDeadWellhead();
    expect(Math.abs(dead.pWhPsia - tang.tangentWellheadPsia)).toBeLessThan(1e-3);
    near(tang.tangentWellheadPsia, 1236.1432878, 1e-4);
    expect(tang.marginFromCapstonePsi).toBeLessThan(0.2);
  });

  it('carries the non monotone scan resolution study with 60 and 100 adjacent', () => {
    const i60 = text.indexOf('status at nGrid 60');
    const i100 = text.indexOf('status at nGrid 100');
    expect(i60).toBeGreaterThan(-1);
    expect(i100).toBeGreaterThan(i60);
    expect(text.slice(i60, i100)).not.toContain('nGrid 200');
  });

  it('and it is the ONLY place the graded answers appear', () => {
    const teaching = L.digestText();
    CAPSTONE_FIELDS.forEach(([, key, value]) => {
      expect(text).toContain(String(value));
      expect(teaching).not.toContain(String(value));
    });
  });

  it('carries no em dash or en dash anywhere', () => {
    expect(text).not.toMatch(/[\u2013\u2014]/);
  });
});
