import { describe, it, expect } from 'vitest';
import { HEAT_FIXTURE, computeBurialHeat } from '@/lib/basinTeaching';
import { BurialCompactionEngine } from '@petrolord/engines/engines/basin/BurialCompactionEngine.js';
import { getCompactionParams } from '@petrolord/engines/engines/basin/CompactionModelLibrary.js';

// Pins the burial-and-heat panel math to the live NG11 Beginner capstone oracle.

describe('basin burial and heat explorer: engine math', () => {
  const b = computeBurialHeat();

  it('reproduces the NG11 beginner capstone answer key', () => {
    expect(b.solid100).toBeCloseTo(38.57953418711555, 9);
    expect(b.restoredThickness).toBeCloseTo(159.79553483785466, 9);
    expect(b.phi2000).toBeCloseTo(0.22717481230903933, 12);
    expect(b.tFirstNode).toBeCloseTo(11.666666666666671, 9);
    expect(b.tLayer1Bottom).toBeCloseTo(41.66666666666673, 9);
    expect(b.tDeepest).toBeCloseTo(59.619047619047684, 9);
  });

  it('follows the Sclater-Christie curve exactly', () => {
    const p = getCompactionParams('shale');
    expect(p.phi0).toBe(0.63);
    expect(p.c).toBe(0.00051);
    expect(b.phi2000).toBeCloseTo(p.phi0 * Math.exp(-p.c * 2000), 12);
    // Porosity falls monotonically and never leaves (0, phi0].
    let prev = Infinity;
    for (let z = 0; z <= 4000; z += 250) {
      const phi = BurialCompactionEngine.porosity(z, p.phi0, p.c);
      expect(phi).toBeLessThanOrEqual(p.phi0);
      expect(phi).toBeGreaterThan(0);
      expect(phi).toBeLessThan(prev);
      prev = phi;
    }
  });

  it('conserves grain through a restoration', () => {
    const p = getCompactionParams('shale');
    expect(b.solidBuried).toBeCloseTo(63.11728183077296, 9);
    // The restored layer holds the same grain it held at depth.
    const grainAfter = BurialCompactionEngine.solidThickness(0, b.restoredThickness, p.phi0, p.c);
    expect(grainAfter).toBeCloseTo(b.solidBuried, 9);
    // ...and restoring makes the layer thicker, never thinner.
    expect(b.restoredThickness).toBeGreaterThan(100);
    expect(b.restoredThickness - 100).toBeCloseTo(59.79553483785466, 9);
  });

  it('restores more thickness the deeper the layer was buried', () => {
    const p = getCompactionParams('shale');
    const restore = (z) => {
      const solid = BurialCompactionEngine.solidThickness(z, 100, p.phi0, p.c);
      return BurialCompactionEngine.calculateLayerProperties(
        { lithology: 'shale', solidThickness: solid }, 0,
      ).thickness;
    };
    const r500 = restore(500);
    const r1000 = restore(1000);
    const r3000 = restore(3000);
    expect(r500).toBeCloseTo(134.010303, 5);
    expect(r1000).toBeCloseTo(159.795535, 5);
    expect(r3000).toBeCloseTo(214.973300, 5);
    expect(r500).toBeLessThan(r1000);
    expect(r1000).toBeLessThan(r3000);
  });

  it('reverses the porosity order between the surface and 2000 m', () => {
    // Shale starts as the most porous of the four and ends below sandstone,
    // because sandstone's compaction constant is smaller.
    const phiAt = (lith, z) => {
      const p = getCompactionParams(lith);
      return BurialCompactionEngine.porosity(z, p.phi0, p.c);
    };
    expect(phiAt('shale', 0)).toBeGreaterThan(phiAt('sandstone', 0));
    expect(phiAt('shale', 0)).toBeCloseTo(0.63, 9);
    expect(phiAt('sandstone', 0)).toBeCloseTo(0.49, 9);
    expect(phiAt('shale', 2000)).toBeLessThan(phiAt('sandstone', 2000));
    expect(phiAt('shale', 2000)).toBeCloseTo(0.227175, 5);
    expect(phiAt('sandstone', 2000)).toBeCloseTo(0.285547, 5);
    // At 1000 m shale is still marginally ahead, so the crossover is between.
    expect(phiAt('shale', 1000)).toBeGreaterThan(phiAt('sandstone', 1000));
  });

  it('makes the gradient the ratio of heat flow to conductivity', () => {
    const Q = HEAT_FIXTURE.basal_q_w_m2;
    const [top, bot] = HEAT_FIXTURE.layers;
    expect(Q).toBe(0.06);
    expect(top.k).toBe(1.8);
    expect(bot.k).toBe(3.5);
    const gradTop = (Q * 1000) / top.k;
    const gradBot = (Q * 1000) / bot.k;
    expect(gradTop).toBeCloseTo(33.333333333333336, 9);
    expect(gradBot).toBeCloseTo(17.142857142857142, 9);
    // Same heat flow, gradient nearly halved, purely from conductivity.
    expect(gradTop / gradBot).toBeCloseTo(bot.k / top.k, 9);
    // T = Ts + Q z / k reproduces the graded values by hand.
    expect(HEAT_FIXTURE.surface_t_c + (Q * 50) / top.k).toBeCloseTo(b.tFirstNode, 9);
    expect(HEAT_FIXTURE.surface_t_c + (Q * 950) / top.k).toBeCloseTo(b.tLayer1Bottom, 9);
    const tBoundary = HEAT_FIXTURE.surface_t_c + (Q * 1000) / top.k;
    expect(tBoundary).toBeCloseTo(43.333333333333336, 9);
    expect(tBoundary + (Q * 950) / bot.k).toBeCloseTo(b.tDeepest, 9);
    // Temperature is continuous and monotonic down the column.
    for (let i = 1; i < b.heatTemps.length; i++) {
      expect(b.heatTemps[i]).toBeGreaterThan(b.heatTemps[i - 1]);
    }
  });
});
