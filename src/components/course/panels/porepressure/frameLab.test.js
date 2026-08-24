import { describe, it, expect } from 'vitest';
import {
  WELL, PARAMS, RAMP_TOP_M, TD_M, computeBasics, emwKgM3,
} from '@/lib/porepressureTeaching';
import { nctDt } from '@petrolord/engines/engines/porepressure/nct.js';
import { G_ACCEL } from '@petrolord/engines/engines/porepressure/constants.js';

// Pins the frame-explorer panel math to the live NG9 Beginner capstone oracle.
const MPA = 1e6;
const idx = (z) => WELL.z_bml_m.indexOf(z);

describe('porepressure frame explorer: engine math', () => {
  const b = computeBasics();

  it('reproduces the NG9 beginner capstone answer key', () => {
    expect(b.hydroTdPa / MPA).toBeCloseTo(41.408579625, 9);
    expect(b.obTdPa / MPA).toBeCloseTo(91.12306695073282, 9);
    expect(b.gardnerRho1600).toBeCloseTo(1960.612149304395, 9);
    expect(b.nct2500).toBeCloseTo(317.2847498247154, 9);
    expect(b.fit.dtMl).toBeCloseTo(650.0000000000014, 9);
    expect(b.fit.c * 1000).toBeCloseTo(0.7000000000000015, 9);
  });

  it('builds hydrostatic as a two-part column with g = 9.80665', () => {
    expect(G_ACCEL).toBe(9.80665);
    const seawater = PARAMS.rhoSeawaterKgM3 * G_ACCEL * PARAMS.waterDepthM;
    const sediment = PARAMS.rhoFluidKgM3 * G_ACCEL * TD_M;
    expect(seawater).toBeCloseTo(1005181.625, 6);
    expect(sediment).toBeCloseTo(40403398, 6);
    expect(b.hydroTdPa).toBeCloseTo(seawater + sediment, 6);
    // Forgetting the water column is the classic error, and it is not small.
    expect((b.hydroTdPa - sediment) / MPA).toBeCloseTo(1.005181625, 9);
  });

  it('has overburden equal to hydrostatic at the mudline and double it at TD', () => {
    const i0 = idx(0);
    expect(b.prof.overburdenPa[i0]).toBeCloseTo(b.prof.hydrostaticPa[i0], 6);
    expect(b.prof.overburdenPa[i0] / MPA).toBeCloseTo(1.005182, 5);
    expect(b.obTdPa).toBeGreaterThan(2 * b.hydroTdPa);
    // Both increase monotonically with depth.
    for (let i = 1; i < WELL.z_bml_m.length; i++) {
      expect(b.prof.overburdenPa[i]).toBeGreaterThan(b.prof.overburdenPa[i - 1]);
      expect(b.prof.hydrostaticPa[i]).toBeGreaterThan(b.prof.hydrostaticPa[i - 1]);
      expect(b.prof.overburdenPa[i]).toBeGreaterThanOrEqual(b.prof.hydrostaticPa[i]);
    }
  });

  it('fits the picks rather than the well header', () => {
    // The fitted trend is NOT the well's own trend. This is the course's
    // central teaching point, so it is pinned.
    expect(b.fit.dtMl).not.toBeCloseTo(PARAMS.nct.dtMlUsPerM, 2);
    expect(b.fit.c).not.toBeCloseTo(PARAMS.nct.cPerM, 6);
    expect(PARAMS.nct.dtMlUsPerM).toBe(656);
    expect(PARAMS.nct.cPerM).toBe(0.0006);
    expect(Math.round(b.fit.dtMl)).toBe(650);
    expect(b.fit.c * 1000).toBeCloseTo(0.7, 9);
  });

  it('has the sonic on the trend at the ramp top and off it below', () => {
    const iRamp = idx(RAMP_TOP_M);
    const trendAtRamp = nctDt(RAMP_TOP_M, PARAMS.nct.dtMlUsPerM, PARAMS.nct.dtMaUsPerM, PARAMS.nct.cPerM);
    expect(WELL.dt_us_per_m[iRamp]).toBeCloseTo(trendAtRamp, 9);
    expect(trendAtRamp).toBeCloseTo(317.2847498247154, 9);
    // Below the ramp top the log is SLOWER than the trend: undercompaction.
    const i3000 = idx(3000);
    const trend3000 = nctDt(3000, PARAMS.nct.dtMlUsPerM, PARAMS.nct.dtMaUsPerM, PARAMS.nct.cPerM);
    expect(WELL.dt_us_per_m[i3000]).toBeCloseTo(297.76677602422825, 9);
    expect(trend3000).toBeCloseTo(292.070315, 5);
    expect(WELL.dt_us_per_m[i3000]).toBeGreaterThan(trend3000);
  });

  it('converts the frame to equivalent mud weight at TD', () => {
    expect(emwKgM3(b.hydroTdPa, TD_M)).toBeCloseTo(1029.878049, 5);
    expect(emwKgM3(b.obTdPa, TD_M)).toBeCloseTo(2266.333384, 5);
    // Hydrostatic EMW sits just under the pore fluid density, because the
    // seawater part of the column is lighter than the pore fluid.
    expect(emwKgM3(b.hydroTdPa, TD_M)).toBeLessThan(PARAMS.rhoFluidKgM3);
  });
});
