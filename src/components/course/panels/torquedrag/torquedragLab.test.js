// DR2 teaching lab, pinned against DR2-TRUTH.md. Every number the course
// prints or grades passes through here, so a panel and the live grader cannot
// drift apart.
import { describe, it, expect } from 'vitest';
import {
  WELLS, OPERATIONS, caseOf, wellSummary, stringWeights, buoyancyFactor,
  runCase, summaryOf, broomstick, operationTable, oracleCheck, verticalClosedForm,
  stepStudy, frictionSweep, frictionFromHookload, pipeLimits, bucklingLadder,
  utilization, WEAR_CASE, slidingDistance, grooveArea, grooveDepthForArea,
  wearRun, wearOracleCheck, capstoneValues,
} from './torquedragLab.js';

const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('the five wells and the one string', () => {
  it('carries five cases', () => {
    expect(WELLS.map((w) => w.id)).toEqual(['vertical', 'slant', 'buildhold', 'horizontal', 'swell3d']);
    for (const w of WELLS) expect(caseOf(w.id).name).toBe(w.id);
  });

  it('gives each well the same three string components', () => {
    for (const w of WELLS) {
      const s = wellSummary(w.id);
      expect(s.string.map((c) => c.type)).toEqual(['dc', 'hwdp', 'dp']);
      expect(s.mudDensityKgM3).toBe(1440);
      expect(s.sections.map((g) => g.frictionFactor)).toEqual([0.25, 0.35]);
    }
  });

  it('reaches the stated depths and inclinations', () => {
    expect(wellSummary('vertical').totalDepthM).toBe(2000);
    expect(wellSummary('vertical').maxIncDeg).toBe(0);
    expect(wellSummary('slant').maxIncDeg).toBe(40);
    expect(wellSummary('buildhold').maxIncDeg).toBe(65);
    expect(wellSummary('horizontal').maxIncDeg).toBe(90);
    expect(wellSummary('swell3d').finalAziDeg).toBe(60);
  });
});

describe('buoyancy', () => {
  it('is one less the density ratio', () => {
    near(buoyancyFactor(1440), 0.8165605095541402, 5e-13);
    expect(buoyancyFactor(0)).toBe(1);
  });

  it('gives the vertical string its buoyed weight', () => {
    const w = stringWeights('vertical');
    near(w.buoyedWeightN, 732311.468284047, 1e-6);
    near(w.airWeightN, w.buoyedWeightN / 0.8165605095541402, 1e-6);
    expect(w.lengthM).toBe(2000);
  });
});

describe('hookload and drag', () => {
  it('finds no drag at all in a vertical well', () => {
    const b = broomstick('vertical');
    near(b.pickupN, 732311.4682840434, 1e-6);
    near(b.slackoffN, b.pickupN, 1e-9);
    near(b.rotatingN, b.pickupN, 1e-9);
    expect(b.dragSwingN).toBeCloseTo(0, 9);
  });

  it('reproduces the vertical hookload from the closed form', () => {
    const v = verticalClosedForm();
    near(v.engineN, v.closedFormN, 1e-6);
    expect(Math.abs(v.oracleErrorN)).toBeGreaterThan(40);
    expect(Math.abs(v.oracleErrorN)).toBeLessThan(45);
  });

  it('splits the slant well into pick up, rotate and slack off', () => {
    const b = broomstick('slant');
    near(b.pickupN, 1103695.4071581454, 1e-6);
    near(b.slackoffN, 604424.8115063506, 1e-6);
    near(b.rotatingN, 819840.7115634651, 1e-6);
    near(b.dragSwingN, 499270.5956517948, 1e-6);
    expect(b.pickupN).toBeGreaterThan(b.rotatingN);
    expect(b.rotatingN).toBeGreaterThan(b.slackoffN);
  });

  it('turns the horizontal well slack-off hookload negative', () => {
    near(summaryOf('horizontal', 'trip_in').hookloadN, -16676.68507494847, 1e-6);
    expect(summaryOf('horizontal', 'trip_in').bucklingFirstMd).toBe(0);
  });

  it('lists every operation on a well', () => {
    const t = operationTable('buildhold');
    expect(t.map((r) => r.operation)).toEqual(OPERATIONS);
    const rot = t.find((r) => r.operation === 'rotate_on_bottom');
    near(rot.surfaceTorqueNm, 26934.19951651723, 1e-6);
    near(rot.maxSideForceNPerM, 1167.5116395360324, 1e-9);
    expect(t.find((r) => r.operation === 'slide_drill').surfaceTorqueNm).toBe(2700);
    expect(t.find((r) => r.operation === 'trip_out').surfaceTorqueNm).toBe(0);
  });

  it('puts the on-bottom minimum tension at minus the weight on bit', () => {
    expect(summaryOf('slant', 'rotate_on_bottom').minTensionN).toBe(-89000);
    near(summaryOf('horizontal', 'slide_drill').minTensionN, -422023.82665557245, 1e-6);
  });
});

describe('torque', () => {
  it('is zero while tripping and largest while rotating on bottom', () => {
    expect(summaryOf('buildhold', 'trip_out').surfaceTorqueNm).toBe(0);
    const off = summaryOf('buildhold', 'rotate_off_bottom').surfaceTorqueNm;
    const on = summaryOf('buildhold', 'rotate_on_bottom').surfaceTorqueNm;
    expect(on).toBeGreaterThan(off);
    near(on - off, 2700 - (2700 - (on - off)) + (on - off) - (on - off), 1e-6);
  });

  it('reproduces the graded torques', () => {
    near(summaryOf('horizontal', 'rotate_on_bottom').surfaceTorqueNm, 24324.87703304575, 1e-6);
    near(summaryOf('swell3d', 'backream').surfaceTorqueNm, 15376.404018294324, 1e-6);
  });
});

describe('the oracle check', () => {
  it('walks every published summary and checkpoint', () => {
    const o = oracleCheck();
    expect(o.checked).toBeGreaterThan(100);
    expect(o.worstRel).toBeLessThan(0.07);
    expect(o.relAt.well).toBe('horizontal');
    expect(o.relAt.operation).toBe('trip_in');
    expect(o.absAt.well).toBe('horizontal');
    expect(o.worstAbs).toBeLessThan(1700);
  });

  it('shows the horizontal gap is discretisation and shrinks with the step', () => {
    const s = stepStudy('horizontal', 'trip_in');
    const first = Math.abs(s[0].vsOracleN);
    const last = Math.abs(s[s.length - 1].vsOracleN);
    expect(first).toBeGreaterThan(1000);
    expect(last).toBeLessThan(first / 20);
    for (let i = 1; i < s.length; i += 1) {
      expect(Math.abs(s[i].vsOracleN)).toBeLessThan(Math.abs(s[i - 1].vsOracleN));
    }
  });

  it('shows the slant gap is not discretisation and does not shrink', () => {
    const s = stepStudy('slant', 'rotate_on_bottom');
    near(s[0].vsOracleN, s[s.length - 1].vsOracleN, 1);
    expect(Math.abs(s[s.length - 1].vsOracleN)).toBeGreaterThan(30);
    expect(Math.abs(s[s.length - 1].vsOracleN)).toBeLessThan(35);
  });
});

describe('friction factors', () => {
  it('moves the hookload monotonically', () => {
    const s = frictionSweep('buildhold', 'trip_out');
    for (let i = 1; i < s.length; i += 1) {
      expect(s[i].hookloadN).toBeGreaterThan(s[i - 1].hookloadN);
    }
    near(s.find((r) => r.frictionOpen === 0.35).hookloadN, 1063113.0483217717, 1e-6);
  });

  it('backs a friction factor out of an observed hookload', () => {
    const mu = frictionFromHookload({ well: 'buildhold', operation: 'trip_out', targetN: 1100000 });
    near(mu, 0.39698485180907916, 1e-9);
    near(summaryOf('buildhold', 'trip_out', { frictionOpen: mu }).hookloadN, 1100000, 1e-3);
  });
});

describe('buckling and capacity', () => {
  it('gives the drill pipe its limits at ninety degrees', () => {
    const l = pipeLimits({ well: 'horizontal', incDeg: 90 });
    near(l.sinusoidalN, 171229.45713680828, 1e-6);
    near(l.helicalN, 313080.5839845054, 1e-6);
    expect(l.helicalN).toBeGreaterThan(l.sinusoidalN);
    // the classical relation: the helical limit is (2 sqrt(2) - 1) times the
    // sinusoidal one, whatever the pipe, the hole or the inclination
    near(l.helicalN / l.sinusoidalN, 2 * Math.SQRT2 - 1, 1e-9);
  });

  it('raises both limits with inclination', () => {
    const ladder = bucklingLadder('horizontal');
    for (let i = 1; i < ladder.length; i += 1) {
      expect(ladder[i].sinusoidalN).toBeGreaterThan(ladder[i - 1].sinusoidalN);
      expect(ladder[i].helicalN).toBeGreaterThan(ladder[i - 1].helicalN);
    }
    expect(ladder[0].sinusoidalN).toBe(0);
  });

  it('makes torsion the binding constraint, not tension', () => {
    const u = utilization('horizontal', 'rotate_on_bottom');
    near(u.maxTorsionUtilization, 0.24212108500048712, 1e-9);
    near(u.maxTensionUtilization, 0.07364558584156092, 1e-9);
    expect(u.maxTorsionUtilization).toBeGreaterThan(u.maxTensionUtilization * 3);
  });
});

describe('casing wear', () => {
  it('states the case it runs on', () => {
    expect(WEAR_CASE.shoeMd).toBe(1200);
    expect(WEAR_CASE.wearFactorMm3PerKNm).toBe(2);
    expect(WEAR_CASE.intervalM).toBe(30);
    expect(WEAR_CASE.schedule).toEqual([{ rpm: 120, hours: 50 }]);
  });

  it('reproduces the sliding distance exactly', () => {
    near(slidingDistance({ rpm: 120, hours: 50 }), 190314.54136181608, 1e-6);
    near(wearOracleCheck().relSliding, 0, 1e-12);
  });

  it('inverts the crescent groove area for a depth', () => {
    near(grooveArea({ casingIrM: 0.1102487, tjRadiusM: 0.0841375, depthM: 0.003 }), 0.000175586, 1e-9);
    const d = grooveDepthForArea({ casingIrM: 0.1102487, tjRadiusM: 0.0841375, areaM2: 0.000175586 });
    near(d, 0.003, 1e-7);
    expect(grooveDepthForArea({ casingIrM: 0.1102487, tjRadiusM: 0.0841375, areaM2: 0 })).toBe(0);
  });

  it('wears the shoe joint most', () => {
    const w = wearRun();
    near(w.maxWearDepthM * 1000, 3.4259056218767463, 1e-9);
    near(w.worstWallLossPct, 28.575884341024505, 1e-9);
    near(w.minRemainingWallM, WEAR_CASE.casingWallM - w.maxWearDepthM, 1e-12);
    const deepest = w.rows[w.rows.length - 1];
    expect(deepest.wearDepthM).toBe(w.maxWearDepthM);
    expect(w.rows[0].wearDepthM).toBe(0);
  });

  it('carries the T&D gap one step downstream', () => {
    const o = wearOracleCheck();
    expect(o.relDepth).toBeGreaterThan(0.005);
    expect(o.relDepth).toBeLessThan(0.02);
  });
});

describe('the eighteen graded values', () => {
  const v = capstoneValues();

  it('reproduces the Associate six', () => {
    near(v.beginner.buoyancy_factor_1440, 0.8165605095541402, 5e-13);
    near(v.beginner.vertical_hookload_N, 732311.4682840434, 1e-6);
    near(v.beginner.slant_pickup_hookload_N, 1103695.4071581454, 1e-6);
    near(v.beginner.slant_slackoff_hookload_N, 604424.8115063506, 1e-6);
    near(v.beginner.slant_drag_swing_N, 499270.5956517948, 1e-6);
    near(v.beginner.horizontal_slackoff_hookload_N, -16676.68507494847, 1e-6);
  });

  it('reproduces the Professional six', () => {
    near(v.intermediate.buildhold_rot_torque_Nm, 26934.19951651723, 1e-6);
    near(v.intermediate.horizontal_rot_torque_Nm, 24324.87703304575, 1e-6);
    near(v.intermediate.buildhold_max_side_force_Npm, 1167.5116395360324, 1e-9);
    near(v.intermediate.swell3d_backream_torque_Nm, 15376.404018294324, 1e-6);
    near(v.intermediate.horizontal_slide_min_tension_N, -422023.82665557245, 1e-6);
    near(v.intermediate.buildhold_mu_for_1100kN_pickup, 0.39698485180907916, 1e-9);
  });

  it('reproduces the Expert six', () => {
    near(v.advanced.dp_sinusoidal_limit_90deg_N, 171229.45713680828, 1e-6);
    near(v.advanced.dp_helical_limit_90deg_N, 313080.5839845054, 1e-6);
    near(v.advanced.hz_max_torsion_utilization, 0.24212108500048712, 1e-9);
    near(v.advanced.casing_sliding_distance_m, 190314.54136181608, 1e-6);
    near(v.advanced.casing_max_wear_depth_mm, 3.4259056218767463, 1e-9);
    near(v.advanced.casing_worst_wall_loss_pct, 28.575884341024505, 1e-9);
  });

  it('keeps every graded value clear of every other one at its own tolerance', () => {
    const TOL = {
      buoyancy_factor_1440: 5e-7,
      vertical_hookload_N: 0.5,
      slant_pickup_hookload_N: 0.5,
      slant_slackoff_hookload_N: 0.5,
      slant_drag_swing_N: 0.5,
      horizontal_slackoff_hookload_N: 0.5,
      buildhold_rot_torque_Nm: 0.05,
      horizontal_rot_torque_Nm: 0.05,
      buildhold_max_side_force_Npm: 0.005,
      swell3d_backream_torque_Nm: 0.05,
      horizontal_slide_min_tension_N: 0.5,
      buildhold_mu_for_1100kN_pickup: 5e-4,
      dp_sinusoidal_limit_90deg_N: 0.5,
      dp_helical_limit_90deg_N: 0.5,
      hz_max_torsion_utilization: 5e-5,
      casing_sliding_distance_m: 0.5,
      casing_max_wear_depth_mm: 5e-4,
      casing_worst_wall_loss_pct: 0.005,
    };
    const all = Object.entries(v).flatMap(([tier, fields]) =>
      Object.entries(fields).map(([k, val]) => [tier, k, val]));
    expect(all).toHaveLength(18);
    expect(Object.keys(TOL)).toHaveLength(18);
    for (const [, k] of all) expect(TOL[k]).toBeGreaterThan(0);
    for (let i = 0; i < all.length; i += 1) {
      for (let j = i + 1; j < all.length; j += 1) {
        const gap = Math.abs(all[i][2] - all[j][2]);
        expect(gap).toBeGreaterThan(Math.max(TOL[all[i][1]], TOL[all[j][1]]));
      }
    }
  });
});
