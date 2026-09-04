// Every value the DR10 lab exposes to a panel, a lesson or the learning page
// is pinned here against the vendored engine's own golden. A number a learner
// reads and a number this file asserts cannot drift apart.
//
// The teaching CLAIMS are pinned too, not just the arithmetic. A course that
// asserts its numbers but not its arguments can have its argument quietly
// inverted by an engine change and still pass.

import { describe, it, expect } from 'vitest';
import * as L from './stimulationLab.js';

const G = L.GOLDEN;
const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('the published case reproduces its golden', () => {
  it('plane strain modulus', () => {
    near(L.E_PRIME_PA, G.params.ePrimePa, 1e-3);
  });

  it('PKN geometry', () => {
    const p = L.publishedPkn();
    near(p.wMaxM, G.geometry.pkn.wMaxM, 5e-9);
    near(p.wAvgM, G.geometry.pkn.wAvgM, 5e-9);
    near(p.pNetPa, G.geometry.pkn.pNetPa, 5e-4);
    near(p.bhtpPa, G.geometry.pkn.bhtpPa, 5e-4);
  });

  it('KGD geometry', () => {
    const k = L.publishedKgd();
    near(k.wMaxM, G.geometry.kgd.wMaxM, 5e-9);
    near(k.wAvgM, G.geometry.kgd.wAvgM, 5e-9);
    near(k.pNetPa, G.geometry.kgd.pNetPa, 5e-4);
    near(k.bhtpPa, G.geometry.kgd.bhtpPa, 5e-4);
  });

  it('material balance', () => {
    const b = L.balanceOf();
    near(b.etaFrac, G.balance.etaFrac, 5e-9);
    near(b.tiS, G.balance.tiS, 5e-6);
    near(b.viM3, G.balance.viM3, 5e-6);
    near(b.vfM3, G.balance.vfM3, 5e-6);
    near(b.vlM3, G.balance.vlM3, 5e-6);
  });

  it('pump schedule', () => {
    const s = L.scheduleOf();
    near(s.eps, G.schedule.eps, 5e-9);
    near(s.padFrac, G.schedule.padFrac, 5e-9);
    near(s.tPadS, G.schedule.tPadS, 5e-6);
    near(s.rampS, G.schedule.rampS, 5e-6);
    near(s.padM3, G.schedule.padM3, 5e-6);
    near(s.massKg, G.schedule.massKg, 5e-5);
    expect(s.steps).toHaveLength(G.params.nSteps);
  });

  it('propped pack', () => {
    const p = L.publishedPack();
    near(p.arealKgM2, G.proppantPack.arealKgM2, 5e-7);
    near(p.wpM, G.proppantPack.wpM, 5e-9);
  });

  it('fracture productivity', () => {
    const p = L.publishedProductivity();
    near(p.cfd, G.productivity.cfd, 5e-7);
    near(p.f, G.productivity.f, 5e-7);
    near(p.sF, G.productivity.sF, 5e-7);
    near(p.rwPrimeM, G.productivity.rwPrimeM, 5e-6);
  });

  it('acidizing, all three routes', () => {
    near(L.hawkinsOf(), G.acidizing.sandstone.sBefore, 5e-7);
    const s = L.sandstoneOf();
    near(s.volumeM3, G.acidizing.sandstone.volumeM3, 5e-7);
    near(s.sAfter, G.acidizing.sandstone.sAfter, 5e-7);
    expect(s.removed).toBe(G.acidizing.sandstone.removed);
    const c = L.carbonateOf();
    near(c.rWhM, G.acidizing.carbonate.rWhM, 5e-8);
    near(c.skin, G.acidizing.carbonate.skin, 5e-7);
    near(L.matrixCeilingOf().qM3s, G.acidizing.qMaxM3s, 5e-10);
    // and the viscosity really is the acid's. Pumping the frac fluid's 0.2
    // Pa.s here understates the ceiling by the ratio of the two viscosities,
    // which on this fixture is a factor of two hundred. A first draft of this
    // lab used PARAMS.muPaS and missed the golden by exactly that factor.
    const withAcid = L.matrixCeilingOf().qM3s;
    const withFracFluid = L.matrixCeilingOf({ muPaS: L.PARAMS.muPaS }).qM3s;
    near(withAcid / withFracFluid, L.PARAMS.muPaS / L.ACID_MU_PA_S, 1e-9);
    expect(L.PARAMS.muPaS / L.ACID_MU_PA_S).toBe(200);
  });
});

describe('the claims the Professional tier makes', () => {
  it('KGD is much wider than PKN at the same conditions', () => {
    const ratio = L.publishedKgd().wAvgM / L.publishedPkn().wAvgM;
    expect(ratio).toBeGreaterThan(2.5);
    expect(ratio).toBeLessThan(2.7);
  });

  it('PKN net pressure RISES with half-length and KGD net pressure FALLS', () => {
    // Not a difference of value but of DIRECTION, which is why the model
    // choice is a decision rather than a preference. If a future edit made
    // them move the same way, m02 would lose its whole argument.
    const s = L.modelSweep();
    const first = s[0];
    const last = s[s.length - 1];
    expect(last.pknPNetPa).toBeGreaterThan(first.pknPNetPa);
    expect(last.kgdPNetPa).toBeLessThan(first.kgdPNetPa);
  });

  it('the quarter power: sixteen times the rate buys twice the width', () => {
    const s = L.ratePower('pkn');
    const at16 = s.find((r) => r.rateFactor === 16);
    near(at16.widthFactor, 2, 1e-9);
    const at2 = s.find((r) => r.rateFactor === 2);
    near(at2.widthFactor, 2 ** 0.25, 1e-9);
  });

  it('efficiency is low and most of the fluid is lost to the formation', () => {
    const b = L.balanceOf();
    expect(b.etaFrac).toBeGreaterThan(0);
    expect(b.etaFrac).toBeLessThan(0.25);
    expect(b.vlM3).toBeGreaterThan(b.vfM3 * 3);
    near(b.viM3, b.vfM3 + b.vlM3, 1e-6);
  });

  it('the balance is a fixed point the engine iterates', () => {
    expect(L.balanceOf().iterations).toBeGreaterThan(0);
    // and with no leakoff at all it is closed form, so no iteration is needed
    const dry = L.balanceOf({ clMSqrtS: 0 });
    expect(dry.iterations).toBe(0);
    expect(dry.etaFrac).toBe(1);
  });

  it('the Nolte factor runs between its two closed-form ends', () => {
    const s = L.noltekLSweep();
    near(s[s.length - 1].kL, 4 / 3, 1e-12);   // eta = 1
    near(L.noltekL(0), Math.PI / 2, 1e-12);   // eta = 0
  });
});

describe('the claims the Expert tier makes', () => {
  it('the pad fraction is NOT one minus efficiency, and never equals it', () => {
    // The trap m01 is built on. The naive form always overstates the pad,
    // at every leakoff coefficient where there is any leakoff at all.
    for (const row of L.leakoffSweep()) {
      if (row.clMSqrtS === 0) continue;
      expect(row.padFrac).toBeLessThan(row.oneMinusEta);
      expect(row.padFracError).toBeGreaterThan(0);
    }
  });

  it('the pad fraction error is WORST at an intermediate efficiency, not at the extremes', () => {
    // Written from the engine rather than from intuition, which is the DR7
    // rule. The error is (1-eta) - (1-eta)/(1+eta) = eta(1-eta)/(1+eta), which
    // VANISHES at both ends and peaks in between. A first draft of this test
    // asserted the error grows monotonically as efficiency falls, and the
    // engine disagreed. The maximum sits at eta = sqrt(2) - 1 and its value is
    // exactly 3 - 2*sqrt(2), which is worth asserting because it is exact.
    const err = (eta) => (1 - eta) - (1 - eta) / (1 + eta);
    const etaStar = Math.SQRT2 - 1;
    near(err(etaStar), 3 - 2 * Math.SQRT2, 1e-15);
    for (const eta of [0.05, 0.2, 0.35, 0.5, 0.7, 0.9]) {
      expect(err(eta)).toBeLessThan(err(etaStar));
    }
    // and it really does go to zero at both ends
    near(err(0), 0, 1e-15);
    near(err(1), 0, 1e-15);
  });

  it('the propped width is far below the created width', () => {
    const created = L.publishedPkn().wAvgM;
    const propped = L.publishedPack().wpM;
    expect(propped).toBeLessThan(created);
    expect(created / propped).toBeGreaterThan(2);
  });

  it('the published job sits BELOW the unified optimum', () => {
    // It is conductivity-starved rather than length-starved, which is what
    // m05 teaches a reader to diagnose. If an edit moved it above the
    // optimum, the lesson's worked diagnosis would be backwards.
    expect(L.publishedProductivity().cfd).toBeLessThan(L.CFD_OPTIMUM);
  });

  it('a search on the engine derives the 1.6 optimum without being told it', () => {
    // THE HEADLINE. CFD_OPTIMUM is a published constant. This golden-section
    // search on the engine's own pseudo-skin has no knowledge of it and lands
    // on it anyway, within a few percent. A constant you can rederive is a
    // result; one you can only quote is a convention.
    const found = L.searchOptimum();
    expect(found.ratioToConstant).toBeGreaterThan(0.95);
    expect(found.ratioToConstant).toBeLessThan(1.05);
    near(found.cfd, 1.6363280590574483, 5e-9);
  });

  it('the optimum is a real interior maximum of the benefit', () => {
    const found = L.searchOptimum();
    const rows = L.cfdSweep([found.xfM * 0.5, found.xfM, found.xfM * 2]);
    expect(rows[1].sF).toBeLessThan(rows[0].sF);
    expect(rows[1].sF).toBeLessThan(rows[2].sF);
  });

  it('conductivity falls as the fracture lengthens at fixed proppant volume', () => {
    const rows = L.cfdSweep();
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].cfd).toBeLessThan(rows[i - 1].cfd);
      expect(rows[i].wpM).toBeLessThan(rows[i - 1].wpM);
    }
  });
});

describe('the claims the Associate tier makes', () => {
  it('skin is LINEAR in the permeability contrast', () => {
    const s = L.hawkinsSweep();
    const at = (r) => s.find((x) => x.kOverKs === r).skin;
    // skin = (kOverKs - 1) * ln(rs/rw), so it is linear in (kOverKs - 1)
    near(at(3) / at(2), (3 - 1) / (2 - 1), 1e-12);
    near(at(20) / at(5), (20 - 1) / (5 - 1), 1e-12);
    expect(at(1)).toBe(0);
  });

  it('but only LOGARITHMIC in the damaged radius, so doubling it buys less and less', () => {
    // Also written from the engine. A first draft asserted that doubling the
    // radius always buys less than doubling the contrast, and that is FALSE
    // close to the wellbore: from 0.2 to 0.4 m the skin more than doubles,
    // because 0.2 m is barely twice the wellbore radius and the logarithm is
    // still steep there. What IS true, and is the design point, is that the
    // gain from doubling FALLS as the damage reaches further out.
    const at = (r) => L.hawkinsOf({ rsM: r });
    const gain = (r) => at(2 * r) / at(r);
    const near0 = gain(0.2);
    const far = gain(1.5);
    expect(near0).toBeGreaterThan(2);
    expect(far).toBeLessThan(1.3);
    expect(far).toBeLessThan(near0);
    // while doubling the CONTRAST is exactly a doubling, everywhere
    near(L.hawkinsOf({ kOverKs: 21 }) / L.hawkinsOf({ kOverKs: 11 }), 2, 1e-12);
  });

  it('the acid volume grows with the SQUARE of the target radius', () => {
    const s = L.acidSweep([0.3, 0.6]);
    const rw = L.PARAMS.rwM;
    const shape = (r) => r * r - rw * rw;
    near(s[1].volumeM3 / s[0].volumeM3, shape(0.6) / shape(0.3), 1e-9);
  });

  it('the residual skin is zero only when the front reaches the damage', () => {
    for (const row of L.acidSweep()) {
      if (row.raM >= L.ACID.rsM) {
        expect(row.removed).toBe(true);
        expect(row.sAfter).toBe(0);
      } else {
        expect(row.removed).toBe(false);
        expect(row.sAfter).toBeGreaterThan(0);
      }
    }
  });

  it('the published sandstone job stops short of the damage', () => {
    // 0.6 m of acid against damage out to 0.9, so a residual skin survives it.
    // m03 l04 is built on this and would lose its case if an edit tidied the
    // published job into one that succeeded.
    expect(L.ACID.raM).toBeLessThan(L.ACID.rsM);
    expect(L.sandstoneOf().sAfter).toBeGreaterThan(0);
  });

  it('carbonate skin is negative and shows a diminishing return', () => {
    const s = L.carbonateSweep();
    for (const row of s) expect(row.skin).toBeLessThan(0);
    // each doubling of volume buys a roughly constant decrement of skin
    const d = [];
    for (let i = 1; i < s.length; i += 1) d.push(s[i - 1].skin - s[i].skin);
    for (const step of d) expect(step).toBeGreaterThan(0);
    expect(Math.max(...d) - Math.min(...d)).toBeLessThan(0.1);
  });

  it('damage lowers the matrix ceiling, because skin is in the denominator', () => {
    const s = L.ceilingSweep();
    for (let i = 1; i < s.length; i += 1) {
      expect(s[i].qM3s).toBeLessThan(s[i - 1].qM3s);
    }
    // and the damaged well accepts far less than a clean one
    expect(s[0].qM3s / s[s.length - 1].qM3s).toBeGreaterThan(2);
  });
});
