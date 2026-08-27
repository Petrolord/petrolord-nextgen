// Pins the SCAL teaching lab to the RC3 truth digest. All EIGHTEEN capstone
// values across the three tiers are asserted here, so a drift in the vendored
// engine or fixtures fails the build before it can strand a live capstone.

import { describe, it, expect } from 'vitest';
import {
  ekeneDisplacement, textbookCase, displacementWith, btDaysAt,
  plugJTables, collapseSpread, fitPlugJ, averageRefit, reservoirCapillary,
  swAvgCrestColumn, ahmedChain, fitLabGrid, dipCase, polymerCase,
  GAMMA_O, EKENE_SCAL, LAB_KR_GRID,
} from './scalLab';

const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);

describe('Associate capstone: displace the Ekene sand', () => {
  const d = ekeneDisplacement();

  it('reproduces the six graded fields', () => {
    expect(rel(d.M, 1.2)).toBeLessThan(1e-12);
    expect(rel(d.bl.Swf, 0.6372)).toBeLessThan(1e-12);
    expect(rel(d.bl.fwf, 0.8682763300877854)).toBeLessThan(1e-12);
    expect(rel(d.bl.QiBt, 0.33077027444818546)).toBeLessThan(1e-12);
    expect(rel(d.bl.EDbt, 0.5088773453049006)).toBeLessThan(1e-12);
    expect(rel(btDaysAt(8000), 926.6051908800841)).toBeLessThan(1e-12);
  });

  it('carries the supporting landmarks', () => {
    expect(rel(d.bl.fwPrimeF, 3.023246274678918)).toBeLessThan(1e-12);
    expect(rel(d.bl.SwAvgBt, 0.6807702744481854)).toBeLessThan(1e-12);
    // EDmax is 0.4/0.65 exactly and moves ONLY with endpoints.
    expect(rel(d.bl.EDmax, 0.6153846153846154)).toBeLessThan(1e-12);
    expect(d.warnings).toHaveLength(0);
    // The front sits ON the 0.0004 scan grid: Swf is grid point 718.
    expect(rel((d.bl.Swf - 0.35) / 0.0004, 718)).toBeLessThan(1e-9);
  });

  it('one-factor variations move the front the way the truth table says', () => {
    const heavy = displacementWith({ muO: 5 });
    expect(rel(heavy.M, 3.3333333333333335)).toBeLessThan(1e-12);
    expect(rel(heavy.bl.Swf, 0.574)).toBeLessThan(1e-12);
    expect(rel(heavy.bl.EDbt, 0.4299040270894154)).toBeLessThan(1e-12);
    const steep = displacementWith({ nw: 3.0 });
    expect(rel(steep.bl.EDbt, 0.5185130918153882)).toBeLessThan(1e-12);
  });
});

describe('The textbook hand case (sampleFractionalFlowData)', () => {
  const t = textbookCase();

  it('M = 4 and the Sw 0.5 chain are closed form', () => {
    expect(rel(t.M, 4)).toBeLessThan(1e-12);
    expect(rel(t.at05.krw, 0.1)).toBeLessThan(1e-12);
    expect(rel(t.at05.kro, 0.25)).toBeLessThan(1e-12);
    expect(rel(t.at05.fw, 0.8)).toBeLessThan(1e-12);
  });

  it('its Welge construction matches the digest', () => {
    expect(rel(t.bl.Swf, 0.46820000000000006)).toBeLessThan(1e-12);
    expect(rel(t.bl.fwf, 0.723261043667905)).toBeLessThan(1e-12);
    expect(rel(t.bl.EDbt, 0.46352558724832216)).toBeLessThan(1e-12);
    expect(rel(t.bl.EDmax, 0.75)).toBeLessThan(1e-12);
  });
});

describe('Professional capstone: carry the lab to the field', () => {
  it('the Ahmed 4-7 chain reproduces the three graded fields', () => {
    const a = ahmedChain();
    expect(rel(a.labFactor, 0.0967993827459659)).toBeLessThan(1e-12);
    const j02 = a.jRows.find((r) => Math.abs(r.Sw - 0.2) < 1e-9);
    expect(rel(j02.J, 0.16939891980544033)).toBeLessThan(1e-12);
    const pc02 = a.printedChainRows.find((r) => Math.abs(r.Sw - 0.2) < 1e-9);
    expect(rel(pc02.Pc_psi, 1.5534071373580902)).toBeLessThan(1e-12);
    // The reservoir factor the book prints as 9.192.
    expect(rel(a.resFactor, 9.191758209219469)).toBeLessThan(1e-12);
    // The full-precision chain is a DIFFERENT number at Sw 0.2, outside the
    // capstone tolerance of 0.002 on purpose: the rounding chain is gradable.
    const full02 = a.fullChainRows.find((r) => Math.abs(r.Sw - 0.2) < 1e-9);
    expect(rel(full02.Pc_psi, 1.5570739117545667)).toBeLessThan(1e-12);
    expect(Math.abs(full02.Pc_psi - 1.5534071373580902)).toBeGreaterThan(0.002);
  });

  it('the Ekene capillary story reproduces the three graded fields', () => {
    const c = reservoirCapillary();
    expect(rel(c.hEntryM, 3.142982863763458)).toBeLessThan(1e-12);
    expect(rel(c.fwlM, 1563.1429828637636)).toBeLessThan(1e-12);
    expect(rel(c.swAtCrest, 0.35062979402484734)).toBeLessThan(1e-12);
    // Supporting truth: entry pressure, scaling factors and the gradient.
    expect(rel(c.pcEntryPsi, 0.7355825053402938)).toBeLessThan(1e-12);
    expect(rel(c.hEntryFt, 10.31162356877775)).toBeLessThan(1e-12);
    expect(rel(c.psiPerJ, 2.942330021361175)).toBeLessThan(1e-12);
    expect(rel(c.gradPsiPerFt, 0.07133527522935783)).toBeLessThan(1e-12);
    expect(rel(c.hCrestFt, 76.85316015526888)).toBeLessThan(1e-12);
    // gammaO is computed from API 32, never typed as a decimal.
    expect(rel(GAMMA_O, EKENE_SCAL.capillary.design.gammaO_from_api32)).toBeLessThan(1e-15);
  });

  it('the Leverett collapse is exact and the direct fit recovers the plant', () => {
    expect(collapseSpread()).toBeLessThan(1e-9);
    const plugs = plugJTables();
    expect(plugs).toHaveLength(3);
    // Three labs, three Pc magnitudes, one J at Sw 0.3 (= 3.75 closed form).
    expect(rel(plugs[0].pcRows[0].Pc_psi, 29.190762994489138)).toBeLessThan(1e-12);
    expect(rel(plugs[1].pcRows[0].Pc_psi, 180.18302550343515)).toBeLessThan(1e-12);
    expect(rel(plugs[2].pcRows[0].Pc_psi, 29.55586916053684)).toBeLessThan(1e-12);
    for (const p of plugs) expect(rel(p.jRows[0].J, 3.75)).toBeLessThan(1e-9);
    const fit = fitPlugJ(1);
    expect(rel(fit.a, 0.25)).toBeLessThan(1e-6);
    expect(rel(fit.b, 1)).toBeLessThan(1e-6);
    expect(fit.converged).toBe(true);
  });
});

describe('Expert capstone: fit, average, and design the flood', () => {
  it('the lab-grid fit reproduces fitted_nw', () => {
    const { grid, fit } = fitLabGrid();
    expect(grid).toHaveLength(13);
    expect(rel(grid[0].kro, 0.9)).toBeLessThan(1e-12);
    expect(rel(grid[12].krw, 0.3)).toBeLessThan(1e-12);
    expect(fit.ok).toBe(true);
    expect(rel(fit.params.nw, 2.4999999999999996)).toBeLessThan(1e-12);
    expect(rel(fit.params.no, 2)).toBeLessThan(1e-12);
    expect(fit.pointsUsed).toBe(24);
    expect(fit.converged).toBe(true);
  });

  it('the averaged refit drifts to the graded a', () => {
    const avg = averageRefit();
    expect(avg.sampleCount).toBe(3);
    expect(rel(avg.fit.a, 0.2491501585202375)).toBeLessThan(1e-12);
    expect(rel(avg.fit.b, 1.0102893566145976)).toBeLessThan(1e-12);
    // The design a 0.25 fails the capstone tolerance 0.0005 by construction.
    expect(Math.abs(0.25 - 0.2491501585202375)).toBeGreaterThan(0.0005);
  });

  it('the dip case reproduces both graded gravity fields', () => {
    const up = dipCase(2000, 10);
    expect(rel(up.gCoef, 0.019367108489507776)).toBeLessThan(1e-12);
    expect(rel(up.bl.Swf, 0.6376)).toBeLessThan(1e-12);
    expect(rel(up.bl.EDbt, 0.5095807170488317)).toBeLessThan(1e-12);
    const down = dipCase(2000, -10);
    expect(rel(down.gCoef, -0.019367108489507776)).toBeLessThan(1e-12);
    expect(rel(down.bl.EDbt, 0.5081700834294871)).toBeLessThan(1e-12);
  });

  it('downdip, flat and updip EDbt order correctly and the tolerance splits them', () => {
    const flat = ekeneDisplacement().bl.EDbt;
    const up = dipCase(2000, 10).bl.EDbt;
    const down = dipCase(2000, -10).bl.EDbt;
    expect(down).toBeLessThan(flat);
    expect(flat).toBeLessThan(up);
    // The flat answer fails BOTH gravity fields at the 0.0005 tolerance.
    expect(Math.abs(flat - up)).toBeGreaterThan(0.0005);
    expect(Math.abs(flat - down)).toBeGreaterThan(0.0005);
  });

  it('the polymer screening case reproduces polymer_ed_bt and carries its warning', () => {
    const p = polymerCase(4);
    expect(rel(p.muWeff, 2)).toBeLessThan(1e-12);
    expect(rel(p.M, 0.3)).toBeLessThan(1e-12);
    expect(rel(p.bl.Swf, 0.7044)).toBeLessThan(1e-12);
    expect(rel(p.bl.EDbt, 0.5771964898801638)).toBeLessThan(1e-12);
    // EDmax does not move: endpoints rule the ceiling.
    expect(rel(p.bl.EDmax, 0.6153846153846154)).toBeLessThan(1e-12);
    expect(p.warnings).toContain(
      'Polymer case: water viscosity multiplied for screening only; no adsorption, permeability reduction, or rheology effects.',
    );
  });

  it('the crest-column trapezoid reproduces sw_avg_crest_column', () => {
    expect(rel(swAvgCrestColumn(), 0.48345033394940007)).toBeLessThan(1e-12);
    // It exceeds the flat booking, which is true at the crest only.
    expect(swAvgCrestColumn()).toBeGreaterThan(0.35);
  });
});

describe('The lab grid is what it claims to be', () => {
  it('13 rows, Sw 0.35 to 0.75 in twelfths, endpoints exact', () => {
    expect(LAB_KR_GRID[0]).toEqual({ Sw: 0.35, krw: 0, kro: 0.9 });
    expect(rel(LAB_KR_GRID[12].Sw, 0.75)).toBeLessThan(1e-12);
    expect(LAB_KR_GRID[12].kro).toBe(0);
    for (let i = 1; i < 13; i++) {
      expect(rel(LAB_KR_GRID[i].Sw - LAB_KR_GRID[i - 1].Sw, 0.4 / 12)).toBeLessThan(1e-9);
    }
  });
});
