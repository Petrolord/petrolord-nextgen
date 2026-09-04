// Every value the PD5 lab exposes to a panel or a lesson is pinned here against
// the vendored engine's own goldens and against the wave's teaching digest, and
// so are the teaching CLAIMS. A course that asserts its numbers but not its
// arguments can have its argument quietly inverted by an engine change and
// still pass: the critical rate could start FALLING with depth, `loadingProfile`
// could start naming the wellhead as the controlling station, Turner and
// Coleman could stop being one equation and one factor, `sizeTubingForRate`
// could start clamping to the smallest candidate instead of returning null, the
// plunger gas requirement could start rising with casing pressure, and a file
// that only pinned numbers would fail with no idea which sentence in which
// lesson had just become false. So every one of those arguments is a named
// assertion below.
//
// The goldens were cut by an independent stdlib oracle
// (tools/validation/production/oracle_gaswell.py) from the published method
// statements rather than from the JS: SI throughout, no gc anywhere, the plunger
// lift balance in pascals and metres, and the Mscf/d rate constant built from
// the molar volume rather than from 86400 Tsc/psc. Twelve droplet-velocity rows,
// one plunger case and three constants.
//
// TWO ROADS AND ONE NUMBER, twice over, and both are pinned as two.
//
//   The critical rate at published golden row 3 is 1614.343766935 Mscf/d from
//   the ENGINE and 1614.343188395 Mscf/d from the ORACLE, 5.7854e-4 apart. Both
//   are correct. `stationBase()` is the first and `turnerColemanPairRows()` is
//   the second, and a lesson stays on one.
//
//   The slug hydrostatic on the published plunger case is 88.332 psi from the
//   ENGINE and 88.4396108162 psi from the ORACLE, 0.1076 psi apart, and that
//   one is NOT two roads to one number. It is the shipped 0.433 psi/ft per unit
//   SG against rho g exactly, a fixed 0.1218 percent, and the engine cannot
//   reproduce the golden. The gate `__tests__/production.gaswell.test.js`
//   loosens that single assertion to 5e-3 relative and pins
//   `PSI_PER_FT_SG === 0.433`. It is pinned as a DIFFERENCE below, not absorbed
//   into a tolerance, because the difference is the teaching point of Expert
//   m03 and a tolerance wide enough to hide it is wide enough to hide a real
//   regression beside it.
//
// AND THE SEVENTY EIGHT SHIPPED LESSONS. They were written from
// /root/pd-wip-gaswell/digest.txt, so a lab value that disagrees with that file
// breaks a lesson that is already written. The last block below reads the
// shipped digest where it is available and checks the lab against the lines the
// lessons quote, at the digest's own printed precision.

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './gasWellLab.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const G = L.GOLDEN;

const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);
const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);
const relNear = (a, b, tol) => expect(rel(a, b)).toBeLessThan(tol);

// ---------------------------------------------------------------------------
// 1. THE PUBLISHED CONSTANTS AND THE PUBLISHED VELOCITY TABLE.
// ---------------------------------------------------------------------------

describe('the published constants, each re-derived rather than remembered', () => {
  const c = L.publishedConstants();

  it('the engine PRODUCES the Turner droplet constant, and it is not the oracle to the last digit', () => {
    // The whole droplet balance collapsed into one number. The engine reaches
    // it through gc and dyne/cm to lbf/ft; the oracle reached it in SI with no
    // gc at all, and the residual is the field-unit conversions.
    relNear(c.goldenTurnerConstant, 1.5935357894, 1e-10);
    relNear(c.engineTurnerConstant, 1.5935346111, 1e-10);
    near(c.turnerConstantDiff, -1.1784e-6, 1e-10);
    // the relative difference is published as a MAGNITUDE beside a signed
    // absolute difference, and five lessons quote it that way
    expect(c.turnerConstantRelDiffMagnitude).toBeGreaterThan(0);
    relNear(c.turnerConstantRelDiffMagnitude, 7.3947e-7, 1e-4);
  });

  it('the rate constant is 86400 Tsc over psc, to machine precision on both roads', () => {
    relNear(c.engineRateConstantMscfd, 3054.38693878, 1e-11);
    near(c.rateConstantDiff, 0, 1e-9);
    relNear(c.rateConstantByHand, c.engineRateConstantMscfd, 1e-15);
    relNear(c.rateConstantPerMMscfd, 3.054387, 1e-6);
  });

  it('the real-gas density spot check agrees to seven parts in a million', () => {
    relNear(c.goldenSpotDensityLbFt3, 3.3226524714, 1e-10);
    relNear(c.engineSpotDensityLbFt3, 3.3226453778, 1e-10);
    near(c.spotDensityDiff, -7.0936e-6, 1e-9);
  });

  it('the droplet inputs are inputs, and the correlation limit is a strict 1000 psia', () => {
    expect(c.dragCoefficient).toBe(0.44);
    expect(c.criticalWeber).toBe(30);
    expect(c.gc).toBe(32.174);
    expect(c.pStandardPsia).toBe(14.7);
    expect(c.tStandardR).toBe(519.67);
    expect(c.turnerAdjustment).toBe(1.2);
    expect(c.colemanAdjustment).toBe(1);
    expect(c.colemanPressureLimitPsia).toBe(1000);
  });

  it('TWO MOLECULAR WEIGHTS OF AIR sit in one domain on one gas constant', () => {
    expect(c.airMwLoading).toBe(28.9647);
    expect(c.airMwProperties).toBe(28.9625);
    expect(c.airMwLoading).not.toBe(c.airMwProperties);
    expect(c.rPsiaFt3LbmolR).toBe(10.7316);
  });
});

describe('the published velocity table reproduces on both roads', () => {
  it('is twelve rows, two fluids by three pressures by two temperatures', () => {
    const rows = L.goldenVelocityRows();
    expect(rows).toHaveLength(12);
    expect(new Set(rows.map((r) => r.fluid))).toEqual(new Set(['water', 'condensate']));
    expect(new Set(rows.map((r) => r.pPsia))).toEqual(new Set([300, 1000, 2500]));
    expect(new Set(rows.map((r) => r.tempR))).toEqual(new Set([540, 620]));
    // z is pinned as an INPUT on every row, so the compressibility route is
    // never exercised by the goldens at all
    rows.forEach((r) => expect(r.z).toBe(0.9));
  });

  it('THE COLEMAN VELOCITY IS THE TERMINAL VELOCITY, because Coleman applies no adjustment', () => {
    L.goldenVelocityRows().forEach((r) => {
      expect(r.colemanIsTerminal, `row ${r.row}`).toBe(true);
      relNear(r.turnerOverColeman, 1.2, 1e-12);
    });
  });

  it('the engine reproduces all twelve rows to the field-unit conversions', () => {
    const rows = L.engineVelocityRows();
    expect(rows).toHaveLength(12);
    rows.forEach((r, i) => {
      const g = G.velocity[i];
      relNear(r.rhoGasLbFt3, g.rhoGasLbFt3, 3e-6);
      relNear(r.turnerFtS, g.turnerFtS, 1e-6);
      relNear(r.criticalRateTurnerMscfd, g.criticalRateTurnerMscfd, 1e-6);
      // and the twenty percent survives into the rate exactly, because the
      // rate is linear in the velocity at a fixed station and a fixed area
      relNear(r.turnerOverColeman, 1.2, 1e-12);
    });
    // row 3 is the ENGINE road, and it is not the oracle road below
    relNear(rows[2].criticalRateTurnerMscfd, 1614.343766935, 1e-11);
  });

  it('THE ORACLE ROAD is a different number for the same quantity, and both are pinned', () => {
    const pairs = L.turnerColemanPairRows();
    relNear(pairs[2].turnerRateMscfd, 1614.343188395, 1e-11);
    // 5.7854e-4 apart: the size that reads as a typo, which is why the two
    // roads have distinct names in the lab
    near(
      L.engineVelocityRows()[2].criticalRateTurnerMscfd - pairs[2].turnerRateMscfd,
      5.7854e-4, 1e-8,
    );
    pairs.forEach((p) => relNear(p.turnerOverColemanPct, 20, 1e-10));
    relNear(pairs[4].turnerRateMscfd, 2496.154595078, 1e-11);
    relNear(pairs[4].colemanRateMscfd, 2080.128829231, 1e-11);
    relNear(pairs[4].turnerMinusColemanMscfd, 416.025765846, 1e-10);
  });

  it('ONE EQUATION AND ONE FACTOR: the terminal velocity is identical under both', () => {
    const a = L.adjustmentIdentity();
    expect(a.turnerTerminalFtS).toBe(a.colemanTerminalFtS);
    expect(a.terminalDiff).toBe(0);
    relNear(a.turnerTerminalFtS, 6.3307682001, 1e-10);
    relNear(a.turnerCriticalFtS, 7.5969218402, 1e-10);
    relNear(a.colemanCriticalFtS, 6.3307682001, 1e-10);
    relNear(a.sharedConstant, 1.5935346111, 1e-10);
    relNear(a.adjustmentGapPct, 20, 1e-12);
  });
});

// ---------------------------------------------------------------------------
// 2. THE STATION: DENSITY, THE DROPLET BALANCE, AREA AND THE RATIO.
// ---------------------------------------------------------------------------

describe('the two modules disagree about a station by 76 parts per million', () => {
  const s = L.airSeam();

  it('is priced at a published station, with the temperature crossing on the engine own door', () => {
    expect(s.pPsia).toBe(2500);
    expect(s.tempR).toBe(620);
    // the boundary is crossed with gasProperties.toRankine rather than a typed
    // 459.67, which is the only way over without a third constant
    expect(s.tempBackToR).toBeCloseTo(620, 10);
    relNear(s.mwGapPpm, 75.9603, 1e-5);
  });

  it('the two density routes differ, and the velocity moves by a little over half of it', () => {
    relNear(s.rhoLoading, 7.8600213238, 1e-10);
    relNear(s.rhoProperties, 7.8594243196, 1e-10);
    near(s.rhoGap, 5.970042e-4, 1e-9);
    relNear(s.rhoGapFraction, 7.595452e-5, 1e-5);
    // one half from the inverse square root, plus the buoyancy term
    relNear(s.velocityOverDensityFraction, 0.53325597, 1e-7);
    expect(s.velocityOverDensityFraction).toBeGreaterThan(0.5);
  });
});

describe('the droplet balance is a derivation and not a remembered number', () => {
  it('sixteen times the tension doubles the velocity, and four times the gas density halves it', () => {
    const rows = L.powerLawRows();
    relNear(rows[1].ratioToRowAbove, 2, 1e-12);
    relNear(rows[3].ratioToRowAbove, 2, 1e-12);
    relNear(rows[5].ratioToRowAbove, 0.5, 1e-12);
    relNear(rows[0].velocityFtS, 2.5605819862, 1e-10);
  });

  it('the constant MOVES when the drag coefficient or the Weber number moves', () => {
    const drag = L.dragCoefficientRows();
    const weber = L.criticalWeberRows();
    const shippedDrag = drag.find((r) => r.isShipped);
    const shippedWeber = weber.find((r) => r.isShipped);
    // both shipped rows read 0.9999992605 and not 1, because the ratio is taken
    // against the ORACLE's 1.5935357894 while the engine derives 1.5935346111
    relNear(shippedDrag.ratioToShipped, 0.9999992605, 1e-10);
    relNear(shippedWeber.ratioToShipped, 0.9999992605, 1e-10);
    expect(shippedDrag.ratioToShipped).not.toBe(1);
    // and both sweeps are monotone in the direction the physics says
    for (let i = 1; i < drag.length; i += 1) {
      expect(drag[i].constant, `drag ${drag[i].dragCoefficient}`).toBeLessThan(drag[i - 1].constant);
    }
    for (let i = 1; i < weber.length; i += 1) {
      expect(weber[i].constant, `weber ${weber[i].criticalWeber}`)
        .toBeGreaterThan(weber[i - 1].constant);
    }
  });

  it('the tension and liquid density sweeps sit on one published gas density', () => {
    const t = L.surfaceTensionRows();
    const d = L.liquidDensityRows();
    expect(t).toHaveLength(9);
    expect(d).toHaveLength(9);
    const at60 = t.find((r) => r.sigmaDyneCm === 60);
    relNear(at60.terminalFtS, 7.0706183100, 1e-10);
    relNear(at60.turnerFtS, 8.4847419720, 1e-10);
    // the same station read off the other sweep has to agree with it
    relNear(d.find((r) => r.rhoLiquidLbFt3 === 67).terminalFtS, at60.terminalFtS, 1e-15);
    relNear(d.find((r) => r.rhoLiquidLbFt3 === 40).terminalFtS, 6.1628840484, 1e-10);
  });

  it('CONDENSATE LOADS A WELL AT A LOWER RATE THAN WATER, and the ratio belongs to its station', () => {
    const p = L.fluidPair();
    expect(p.pPsia).toBe(1000);
    expect(p.tempR).toBe(620);
    expect(p.waterTerminalFtS).toBeGreaterThan(p.condensateTerminalFtS);
    expect(p.waterTurnerRateMscfd).toBeGreaterThan(p.condensateTurnerRateMscfd);
    relNear(p.terminalRatio, 1.4626530609, 1e-10);
    // the terminal ratio and the rate ratio are the same number at one station
    relNear(p.rateRatio, p.terminalRatio, 1e-12);
    // and the ratio is NOT a fluid constant: the same two fluids at 2500 psia
    // do not give it back
    const other = L.goldenRowStation(6).terminalFtS / L.goldenRowStation(12).terminalFtS;
    expect(rel(other, p.terminalRatio)).toBeGreaterThan(1e-3);
  });

  it('the fluid table is starting points, and an unknown id FALLS BACK where an unknown correlation REFUSES', () => {
    const fluids = L.turnerFluidRows();
    expect(fluids.map((f) => f.id)).toContain('water');
    expect(fluids.map((f) => f.id)).toContain('condensate');
    // two failure policies in one module
    expect(L.unknownFluidFallback().id).toBe('water');
    const refusals = L.balanceRefusals();
    refusals.forEach((r) => expect(r.ok, r.label).toBe(false));
    expect(refusals[2].error).toMatch(/Unknown loading correlation/);
    expect(refusals[2].error).toMatch(/turner or coleman/);
  });
});

describe('area is the only place the tubing size enters', () => {
  it('doubling the diameter multiplies the flow area by four, exactly', () => {
    relNear(L.areaDoubling().factor, 4, 1e-12);
    const rows = L.tubingAreaRows();
    const at2441 = rows.find((r) => r.idIn === 2.441);
    // the digest prints ten decimals, so the band is that print and no tighter
    relNear(at2441.areaFt2, 0.0324984725, 1e-8);
    relNear(at2441.crossSectionIn2, 4.67978003, 1e-8);
    relNear(at2441.crossSectionIn2 / 144, at2441.areaFt2, 1e-15);
  });

  it('rate and velocity are exact inverses, and both refuse rather than invent', () => {
    const i = L.rateVelocityInverse();
    relNear(i.qMscfd, 2053.715375332, 1e-11);
    near(i.closure, 0, 1e-12);
    const r = L.rateRefusals();
    expect(Number.isFinite(r.velocityAtZeroArea)).toBe(false);
    expect(Number.isFinite(r.densityAtZeroTemperature)).toBe(false);
  });
});

describe('the critical rate belongs to the station and the ratio carries the verdict', () => {
  const base = L.stationBase();
  const sweep = L.stationSweepRows();

  it('the five step build reproduces the engine road at published golden row 3', () => {
    relNear(base.rhoGasLbFt3, 3.6097875709, 1e-10);
    relNear(base.terminalFtS, 6.5866417464, 1e-10);
    relNear(base.turnerCriticalVelocityFtS, 7.9039700957, 1e-10);
    relNear(base.areaFt2, 0.0324984725, 1e-8);
    relNear(base.turnerCriticalRateMscfd, 1614.343766935, 1e-11);
    relNear(base.colemanCriticalRateMscfd, 1345.286472446, 1e-11);
    // the Coleman critical VELOCITY is the terminal velocity, again
    expect(base.colemanCriticalVelocityFtS).toBe(base.terminalFtS);
  });

  it('THE CRITICAL RATE DOES NOT MOVE ACROSS THE RATE SWEEP', () => {
    expect(sweep).toHaveLength(9);
    sweep.forEach((r) => relNear(r.criticalRateMscfd, base.turnerCriticalRateMscfd, 1e-15));
  });

  it('the ratio is the rate ratio and the velocity ratio at once', () => {
    // the identity is exact to the last bit of a double, not merely close
    sweep.forEach((r) => expect(Math.abs(r.ratioIdentityGap), `${r.qMscfd} Mscf/d`)
      .toBeLessThan(1e-15));
    const at1800 = sweep.find((r) => r.qMscfd === 1800);
    relNear(at1800.ratio, 1.1150041502, 1e-10);
    relNear(at1800.actualVelocityFtS, 8.8129594598, 1e-10);
  });

  it('the flag is a STRICT comparison, so 0.9997870547 reads loaded', () => {
    const at1614 = sweep.find((r) => r.qMscfd === 1614);
    relNear(at1614.ratio, 0.9997870547, 1e-9);
    expect(at1614.loaded).toBe(true);
    expect(sweep.find((r) => r.qMscfd === 1600).loaded).toBe(true);
    expect(sweep.find((r) => r.qMscfd === 1800).loaded).toBe(false);
  });
});

describe('the correlation threshold, and the sentence that prints it', () => {
  const rows = L.thresholdRows();

  it('switches strictly at the Coleman limit and nowhere else', () => {
    rows.forEach((r) => {
      expect(r.correlation, `${r.pPsia} psia`).toBe(r.belowLimit ? 'coleman' : 'turner');
      expect(r.ok).toBe(true);
    });
    expect(rows.find((r) => r.pPsia === 999.96).correlation).toBe('coleman');
    expect(rows.find((r) => r.pPsia === 1000).correlation).toBe('turner');
  });

  it('ONE DECIMAL NARROWS THE COLLISION BY TEN AND DOES NOT CLOSE IT', () => {
    // three pressures used to print as the limit they had just cleared
    const wholeCollisions = rows.filter((r) => r.belowLimit && r.collidedAtWholeNumbers);
    expect(wholeCollisions.map((r) => r.pPsia)).toEqual([999.88, 999.96]);
    // one of them still does
    const decimalCollisions = rows.filter((r) => r.belowLimit && r.printsAsTheLimit);
    expect(decimalCollisions.map((r) => r.pPsia)).toEqual([999.96]);
    near(decimalCollisions[0].distanceToLimitPsi, 0.04, 1e-9);
    near(rows.find((r) => r.pPsia === 999.04).distanceToLimitPsi, 0.96, 1e-9);
  });

  it('the reason prints one decimal and the station label is the caller argument', () => {
    const t = L.thresholdLabelling();
    expect(t.colemanSideReason).toContain('At 850.0 psia wellhead');
    expect(t.narrowMissReason).toContain('At 999.9 psia');
    expect(t.narrowMissReason).not.toContain('At 1000 psia');
    expect(t.withoutLabel).toContain('wellhead');
    expect(t.withLabel).toContain('at the 7,500 ft shoe');
    expect(t.withLabel).not.toContain('wellhead');
  });
});

// ---------------------------------------------------------------------------
// 3. THE TEACHING WELL EBOCHA-5: THE PROFILE, THE SEAM AND THE SIZING.
// ---------------------------------------------------------------------------

describe('EBOCHA-5, a well that passes at the gauge and loads at the shoe', () => {
  const traverse = L.ebochaTraverseRows();
  const summary = L.ebochaProfileSummary();
  const rows = L.ebochaProfileRows();

  it('is a six station traverse whose z and density are the engine own', () => {
    expect(traverse).toHaveLength(6);
    expect(traverse.map((r) => r.depthFt)).toEqual([0, 1500, 3000, 4500, 6000, 7500]);
    expect(traverse.map((r) => r.pPsia)).toEqual([880, 978, 1090, 1218, 1350, 1500]);
    relNear(traverse[0].z, 0.9023320453, 1e-10);
    relNear(traverse[5].z, 0.9142643742, 1e-10);
    relNear(traverse[0].rhoGasLbFt3, 2.8547437868, 1e-10);
    relNear(traverse[5].rhoGasLbFt3, 4.2000760651, 1e-10);
    relNear(traverse[5].tempR, 653.67, 1e-12);
  });

  it('THE CORRELATION IS CHOSEN AT THE WELLHEAD, and the wellhead is under the limit', () => {
    const r = L.ebochaWellheadRecommendation();
    expect(r.correlation).toBe('coleman');
    expect(L.ebochaShippedCorrelation()).toBe('coleman');
    expect(r.reason).toContain('At 880.0 psia wellhead');
  });

  it('the critical rate RISES monotonically with depth, which is why the shoe controls', () => {
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].criticalRateMscfd, `${rows[i].depthFt} ft`)
        .toBeGreaterThan(rows[i - 1].criticalRateMscfd);
      expect(rows[i].ratio).toBeLessThan(rows[i - 1].ratio);
    }
    relNear(rows[0].criticalRateMscfd, 2671.123287413, 1e-11);
    relNear(rows[5].criticalRateMscfd, 3222.613396799, 1e-11);
    relNear(rows[1].criticalRateRiseMscfd, 100.530141186, 1e-10);
    relNear(rows[5].criticalRateRiseMscfd, 116.116224791, 1e-10);
  });

  it('the profile ratio crosses one below the midpoint, and the ratios are the digest own', () => {
    expect(rows.map((r) => r.loaded)).toEqual([false, false, false, false, true, true]);
    relNear(rows[0].ratio, 1.1605604334, 1e-10);
    relNear(rows[3].ratio, 1.0340528848, 1e-10);
    relNear(rows[4].ratio, 0.9979085215, 1e-10);
    relNear(rows[5].ratio, 0.9619521855, 1e-10);
  });

  it('THE CONTROLLING STATION IS THE SHOE, and a point check at the gauge inverts the verdict', () => {
    expect(summary.controllingDepthFt).toBe(7500);
    expect(summary.loaded).toBe(true);
    relNear(summary.marginPct, -3.80478145, 1e-8);
    // the same well, the same day, read at the gauge alone
    expect(summary.wellheadLoaded).toBe(false);
    relNear(summary.wellheadMarginPct, 16.05604334, 1e-8);
    relNear(summary.wellheadOverShoe, 1.2064637420, 1e-10);
    expect(summary.deepestHealthyDepthFt).toBe(4500);
    expect(summary.shallowestLoadingDepthFt).toBe(6000);
    expect(summary.insideDeepestPct).toBe(40);
    expect(summary.outsideDeepestPct).toBe(20);
  });

  it('A PROFILE OF ONE STATION NAMES THAT STATION AS CONTROLLING, and returns a healthy well', () => {
    // loadingProfile is right and the traverse was wrong, and nothing in the
    // return says which. This is the point-check failure with the function
    // behaving exactly as documented.
    const w = L.ebochaWellheadOnlyProfile();
    expect(w.ok).toBe(true);
    expect(w.stationCount).toBe(1);
    expect(w.controllingDepthFt).toBe(0);
    expect(w.loaded).toBe(false);
    relNear(w.controllingRatio, 1.1605604334, 1e-10);
    expect(w.fullTraverseControllingDepthFt).toBe(7500);
    expect(w.fullTraverseLoaded).toBe(true);
  });

  it('the rate sweep walks the crossing up the hole as the well declines', () => {
    const sweep = L.ebochaRateSweepRows();
    expect(sweep.map((r) => r.shallowestLoadingDepthFt))
      .toEqual([0, 1500, 6000, 6000, 7500, null, null, null]);
    expect(sweep.map((r) => r.loaded))
      .toEqual([true, true, true, true, true, false, false, false]);
    relNear(sweep.find((r) => r.qMscfd === 3100).marginPct, -3.804781, 1e-6);
    relNear(sweep.find((r) => r.qMscfd === 3200).marginPct, -0.701710, 1e-6);
    relNear(sweep.find((r) => r.qMscfd === 4000).marginPct, 24.122863, 1e-7);
  });

  it('the profile refuses an empty traverse and an unknown correlation, by return value', () => {
    const r = L.profileRefusals();
    r.forEach((x) => expect(x.ok, x.label).toBe(false));
    expect(r[0].error).toMatch(/at least one station/);
    expect(r[1].error).toMatch(/Unknown loading correlation/);
  });
});

describe('THE CORRELATION SEAM: chosen at the wellhead, used at the shoe', () => {
  const seam = L.ebochaSeamRows();
  const verdicts = L.ebochaSeamVerdicts();
  const perStation = L.ebochaStationRecommendationRows();

  it('is worth exactly twenty percent of every critical rate at every station', () => {
    expect(seam).toHaveLength(6);
    seam.forEach((r) => relNear(r.turnerOverColeman, 1.2, 1e-12));
    relNear(seam[0].rateDifferenceMscfd, 534.224657483, 1e-10);
    relNear(seam[5].rateDifferenceMscfd, 644.522679360, 1e-10);
    relNear(seam[5].colemanCriticalRateMscfd, 3222.613396799, 1e-11);
    relNear(seam[5].turnerCriticalRateMscfd, 3867.136076159, 1e-11);
  });

  it('and it is worth FOUR VERDICTS out of six on this well', () => {
    expect(verdicts.disagreeAtDepthsFt).toEqual([0, 1500, 3000, 4500]);
    expect(verdicts.agreeAtDepthsFt).toEqual([6000, 7500]);
    // both correlations name the same controlling station, and disagree by
    // sixteen points of margin on it
    expect(verdicts.coleman.controllingDepthFt).toBe(7500);
    expect(verdicts.turner.controllingDepthFt).toBe(7500);
    relNear(verdicts.coleman.marginPct, -3.80478145, 1e-8);
    relNear(verdicts.turner.marginPct, -19.83731788, 1e-8);
  });

  it('THE FUNCTION DOES NOT GIVE THE SAME ANSWER AT EVERY STATION, and the study never asks', () => {
    expect(perStation.map((r) => r.correlation))
      .toEqual(['coleman', 'coleman', 'turner', 'turner', 'turner', 'turner']);
    // the wellhead choice is coleman and the controlling station would choose
    // turner, which is the seam in one line
    expect(perStation[0].correlation).toBe(L.ebochaShippedCorrelation());
    expect(perStation[5].correlation).not.toBe(L.ebochaShippedCorrelation());
    expect(perStation[5].reason).toContain('at the 7,500 ft station');
  });

  it('choosing per station moves the crossing up the hole and puts a step in the rates', () => {
    const mixed = L.ebochaMixedProfileRows();
    const ms = L.ebochaMixedProfileSummary();
    expect(mixed.map((r) => r.loaded)).toEqual([false, false, true, true, true, true]);
    expect(ms.mixedShallowestLoadingDepthFt).toBe(3000);
    expect(ms.shippedShallowestLoadingDepthFt).toBe(6000);
    // the step is an artefact of the choice and not a property of the well: a
    // Coleman rate at 1500 ft against a Turner rate at 3000 ft
    expect(ms.correlationChangesAtDepthFt).toBe(3000);
    relNear(ms.rateBeforeStepMscfd, 2771.653428599, 1e-11);
    relNear(ms.rateAfterStepMscfd, 3456.727431568, 1e-11);
    expect(ms.rateAfterStepMscfd - ms.rateBeforeStepMscfd).toBeGreaterThan(600);
  });

  it('the same seam on a PUBLISHED station, so it is not a teaching-well artefact', () => {
    const p = L.publishedSeam();
    relNear(p.colemanRateMscfd, 2080.128829231, 1e-11);
    relNear(p.turnerRateMscfd, 2496.154595078, 1e-11);
    relNear(p.differenceMscfd, 416.025765846, 1e-10);
    // a well making exactly the Coleman rate is loading under Turner, at five
    // sixths, which is one over 1.2
    relNear(p.ratioUnderTurner, 1 / 1.2, 1e-12);
  });
});

describe('THE SIZING: one answer returned and the rejections kept', () => {
  const coleman = L.ebochaSizingVerdict('coleman');
  const turner = L.ebochaSizingVerdict('turner');
  const comparison = L.ebochaSizingComparison();

  it('is evaluated at the controlling station, which the return value does not record', () => {
    const st = L.ebochaSizingStation('controlling');
    expect(st.depthFt).toBe(7500);
    expect(st.pPsia).toBe(1500);
    relNear(st.z, 0.9142643742, 1e-10);
    // the rows carry the correlation and the adjustment, and no depth at all
    expect(coleman.rowKeys).toContain('correlation');
    expect(coleman.rowKeys).toContain('adjustment');
    expect(coleman.rowKeys).not.toContain('depthFt');
    expect(coleman.rowKeys).not.toContain('pPsia');
  });

  it('THE RETURNED OBJECT CARRIES ok BESIDE THE PICK', () => {
    // engines 5733550. Before it, a null largestUnloaded meant two things.
    expect(coleman.objectKeys).toEqual(['rows', 'largestUnloaded', 'ok']);
    expect(coleman.ok).toBe(true);
    expect(turner.ok).toBe(true);
  });

  it('the pick is the largest candidate clearing one, and both picks are the digest own', () => {
    expect(coleman.pickIdIn).toBe(3.476);
    relNear(coleman.pickRatio, 1.0022156322, 1e-10);
    expect(turner.pickIdIn).toBe(3.068);
    relNear(turner.pickRatio, 1.0720838440, 1e-10);
    expect(coleman.unloadIdsIn).toEqual([3.476, 3.068, 2.441, 2.041, 1.610]);
    expect(turner.unloadIdsIn).toEqual([3.068, 2.441, 2.041, 1.610]);
    // and the rows come back largest diameter first
    const ids = L.ebochaSizingRows('coleman').map((r) => r.idIn);
    expect(ids).toEqual([...ids].sort((a, b) => b - a));
  });

  it('THE PICK IS A FUNCTION OF A CORRELATION CHOSEN SOMEWHERE ELSE', () => {
    expect(comparison.picksAgree).toBe(false);
    expect(comparison.discardedIdIn).toBe(3.476);
    relNear(comparison.discardedRatioUnderColeman, 1.0022156322, 1e-10);
    relNear(comparison.discardedRatioUnderTurner, 0.8351796935, 1e-10);
    relNear(comparison.discardedRatioLoss, 0.1670359387, 1e-9);
    // one sixth, because the twenty percent lands in the denominator
    relNear(comparison.discardedRatioLossPct, 100 / 6, 1e-12);
    // the discarded candidate is the ONLY one whose verdict changes
    const c = L.ebochaSizingRows('coleman');
    const t = L.ebochaSizingRows('turner');
    const flipped = c.filter((r, i) => r.unloads !== t[i].unloads).map((r) => r.idIn);
    expect(flipped).toEqual([3.476]);
  });

  it('A NULL PICK UNDER ok true IS A FINDING, and the best ratio says how far off it was', () => {
    const h = L.ebochaHopelessSizing();
    expect(h.largestUnloaded).toBeNull();
    expect(h.ok).toBe(true);
    expect(h.rowCount).toBe(9);
    relNear(h.bestRatioOnTheList, 0.0502326405, 1e-9);
    // no least bad candidate, no clamp to the smallest diameter
    expect(h.reason).toBeUndefined();
  });

  it('A NULL PICK UNDER ok false IS A REFUSAL, and that is the whole reason ok exists', () => {
    const r = L.ebochaSizingRefusals();
    expect(r).toHaveLength(3);
    r.forEach((x) => {
      expect(x.ok, x.label).toBe(false);
      expect(x.largestUnloaded, x.label).toBeNull();
      expect(typeof x.reason, x.label).toBe('string');
    });
    expect(r[0].rowCount).toBe(0);
    expect(r[0].reason).toMatch(/nothing to size/);
    expect(r[1].reason).toMatch(/No gas rate could be read/);
    expect(r[2].reason).toMatch(/no size was ruled in or out/);
    // rows and largestUnloaded are computed exactly as before, so an old caller
    // keeps working and a new one can tell the two nulls apart
    expect(r[1].rowCount).toBe(9);
  });

  it('SIZED AT THE WELLHEAD IT REPORTS NO WORKOVER ON A WELL LOADING OVER ITS BOTTOM THIRD', () => {
    const cost = L.ebochaStationCost();
    expect(cost.wellheadSizingPickIdIn).toBe(3.740);
    expect(cost.currentStringIdIn).toBe(3.548);
    expect(cost.reportsNoWorkoverNeeded).toBe(true);
    relNear(cost.currentStringRatioAtWellhead, 1.1605604334, 1e-10);
    relNear(cost.currentStringRatioAtControlling, 0.9619521855, 1e-10);
    expect(cost.loadingOverBottomPct).toBe(40);
    // and the station is worth a tubing size under either correlation
    const byCorrelation = Object.fromEntries(
      cost.perCorrelation.map((r) => [r.correlation, r.stationWorthIn]),
    );
    near(byCorrelation.coleman, 0.264, 1e-9);
    near(byCorrelation.turner, 0.408, 1e-9);
    // AND ok IS TRUE ON THE WRONG STATION. The sizing it was asked for was
    // answerable and was answered; the boolean is honest about the question it
    // covers and silent about the one nobody asked.
    expect(L.ebochaSizingVerdict('coleman', 'wellhead').ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 4. THE PLUNGER: THE PUBLISHED CASE, THE CONSTANT, AND WHAT THE SCREEN MISSES.
// ---------------------------------------------------------------------------

describe('the published plunger case, term by term', () => {
  const p = L.publishedPlunger();

  it('the five terms sum to the required lift pressure, with nothing else in it', () => {
    relNear(p.termsSum, p.requiredPsia, 1e-15);
    relNear(p.requiredPsia, 225.8581556122, 1e-11);
    relNear(p.linePressurePsi, 120, 1e-15);
    relNear(p.slugPsi, 88.332, 1e-12);
    relNear(p.plungerPsi, 1.2821115429, 1e-10);
    relNear(p.gasColumnPsi, 16.2440440692, 1e-10);
    expect(p.frictionPsi).toBe(0);
    relNear(p.areaIn2, 4.6797800340, 1e-10);
  });

  it('THE ONLY TERM THE ORACLE DISAGREES WITH IS THE SLUG, and it is the rounded constant', () => {
    expect(p.plungerDiff).toBe(0);
    near(p.gasColumnDiff, -3.4680e-5, 1e-8);
    near(p.slugDiff, -0.1076108162, 1e-9);
    // the whole of the lift disagreement IS the slug disagreement
    near(p.requiredDiff, p.slugDiff + p.gasColumnDiff, 1e-12);
  });

  it('the gas a cycle needs, the liquid it brings up, and the ratio between them', () => {
    relNear(p.gasPerCycleScf, 5452.924357073, 1e-11);
    relNear(p.liquidPerCycleBbl, 1.1576450988, 1e-10);
    expect(p.liquidPerCycleDiff).toBe(0);
    relNear(p.requiredGlrScfBbl, 4710.35929989, 1e-11);
    // slug volume and slug length are inverses
    relNear(p.slugLengthRoundTripFt, p.inputs.slugLengthFt, 1e-12);
  });

  it('THE RULE OF THUMB IS CARRIED FOR COMPARISON AND NEVER DECIDES ANYTHING', () => {
    expect(p.ruleOfThumbConstant).toBe(400);
    relNear(p.ruleOfThumbGlrScfBbl, 2400, 1e-12);
    relNear(p.physicsOverHeuristic, 1.96264971, 1e-8);
    expect(p.physicsOverHeuristic).toBeGreaterThan(1);
  });

  it('THE GAS COLUMN CONVENTION IS UNSTATED, and the spread it hides is priced', () => {
    const g = L.gasColumnConvention();
    expect(g.heightFt).toBe(5800);
    // the shipped choice is the LINE pressure, over the whole height above the slug
    relNear(g.atLinePsi, p.gasColumnPsi, 1e-15);
    relNear(g.atSlugTopPsi, 18.4429521336, 1e-10);
    relNear(g.atAveragePsi, 17.3434981014, 1e-10);
    relNear(g.spreadPsi, 2.1989080644, 1e-9);
    relNear(g.spreadAsFractionOfLift, 9.7312e-3, 1e-4);
  });

  it('friction is linear and additive, which is the easiest thing in the balance to check', () => {
    const f = L.publishedPlungerWithFriction(40);
    near(f.addedPsi, 40, 1e-10);
    relNear(f.requiredPsia, 265.8581556122, 1e-11);
  });
});

describe('THE GRADIENT CONSTANT: 0.433 where the oracle carries rho g', () => {
  const g = L.gradientConstant();

  it('the exact gradient is built from three conversion constants, not typed', () => {
    relNear(g.paPerMetre, 9806.65, 1e-12);
    relNear(g.paPerFt, 2989.06692, 1e-12);
    relNear(g.exactPsiPerFtSg, 0.4335275040010, 1e-12);
    expect(g.shippedPsiPerFtSg).toBe(0.433);
  });

  it('THE ROUNDING IS A FIXED 0.1218 PERCENT of whatever slug it sits on', () => {
    relNear(g.difference, 0.0005275040010, 1e-10);
    relNear(g.roundingPctOfExact, 0.1216771707, 1e-9);
    relNear(g.roundingPctOfShipped, 0.1218254044, 1e-9);
    // and the sweep shows the percentage identical on every slug while the
    // absolute cost grows with it
    const rows = L.gradientSlugRows();
    rows.forEach((r) => relNear(r.costPct, g.roundingPctOfExact, 1e-12));
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].costPsi).toBeGreaterThan(rows[i - 1].costPsi);
    }
    relNear(rows[0].costPsi, 0.0670985089, 1e-9);
    relNear(rows[6].costPsi, 0.2683940357, 1e-9);
  });

  it('THE GOLDEN PUBLISHES A NUMBER THE ENGINE CANNOT REPRODUCE, and the gate knows', () => {
    relNear(g.goldenSlugPsi, 88.4396108162, 1e-11);
    relNear(g.engineSlugPsi, 88.332, 1e-12);
    near(g.costOnPublishedSlugPsi, 0.1076108162, 1e-9);
    // 4.1 times the disagreement it is covering. NOT a tolerance problem: this
    // is one constant against another and no refinement removes it.
    relNear(g.gateSlackFactor, 4.109234, 1e-6);
    expect(g.gateSlackFactor).toBeGreaterThan(1);
    // three values for one gradient sit in this domain at once
    expect(new Set([g.sixtyTwoPointFourOver144, g.shippedPsiPerFtSg, g.exactPsiPerFtSg]).size)
      .toBe(3);
  });

  it('ONE TERM OF FIVE carries it, against a casing pressure built from nothing', () => {
    const terms = L.liftTermProvenance();
    expect(terms).toHaveLength(5);
    expect(terms.filter((t) => t.builtFromTheConstant).map((t) => t.term))
      .toEqual(['slug hydrostatic']);
  });
});

describe('OGUTA-2 and the plunger screen in full', () => {
  const s = L.ogutaScreenReading();

  it('the balance, the cycle and the two flags the verdict is built from', () => {
    expect(s.ok).toBe(true);
    expect(s.errorCount).toBe(0);
    relNear(s.requiredPsia, 248.1897322873, 1e-11);
    relNear(s.slugPsi, 73.4368, 1e-12);
    relNear(s.gasColumnPsi, 28.0007131786, 1e-10);
    relNear(s.casingExceedsByPsi, 471.8102677127, 1e-11);
    relNear(s.gasPerCycleScf, 8854.756635640, 1e-11);
    relNear(s.liquidPerCycleBbl, 0.9261160790, 1e-9);
    relNear(s.requiredGlrScfBbl, 9561.17363265, 1e-11);
    relNear(s.totalMin, 89.90356589, 1e-9);
    relNear(s.cyclesPerDay, 16.01716223, 1e-9);
    relNear(s.liquidPerDayBbl, 14.83375148, 1e-9);
  });

  it('THE RULE OF THUMB BLESSES WHAT THE PHYSICS REFUSES', () => {
    // the well clears the heuristic and fails the balance by a factor of three
    relNear(s.ruleOfThumbGlrScfBbl, 3280, 1e-12);
    expect(s.wellGlrScfBbl).toBeGreaterThan(s.ruleOfThumbGlrScfBbl);
    expect(s.requiredGlrScfBbl).toBeGreaterThan(s.wellGlrScfBbl);
    relNear(s.requirementOverRuleOfThumb, 2.91499196, 1e-8);
    expect(s.ruleOfThumbAgrees).toBe(false);
    expect(s.glrOk).toBe(false);
    expect(s.pressureOk).toBe(true);
    expect(s.feasible).toBe(false);
    expect(s.warningCodes).toEqual(['insufficientGas']);
  });

  it('refuses six broken inputs outright, by return value and not by throwing', () => {
    const r = L.ogutaScreenRefusals();
    expect(r).toHaveLength(6);
    r.forEach((x) => {
      expect(x.ok, x.label).toBe(false);
      expect(x.errors.length, x.label).toBeGreaterThan(0);
    });
    // zero depth raises TWO errors at once, because a zero depth also makes
    // the slug longer than the tubing it sits in
    expect(r[0].errors).toContain('The plunger has to travel a depth.');
    expect(r[0].errors).toContain('The slug is longer than the tubing it sits in.');
  });
});

describe('THE REQUIREMENT THAT FALLS THE WRONG WAY, a recorded owner decision', () => {
  const rows = L.ogutaCasingSweepRows();
  const head = L.ogutaCasingSweepHeadline();

  it('the required lift is fixed and does not move with the casing at all', () => {
    rows.forEach((r) => relNear(r.requiredPsia, head.requiredPsiaFixed, 1e-15));
    relNear(head.requiredPsiaFixed, 248.1897322873, 1e-11);
  });

  it('THE GAS REQUIREMENT FALLS AS THE WELL WEAKENS, monotonically, all the way down', () => {
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].requiredGlrScfBbl, `${rows[i].casingPressurePsia} psia`)
        .toBeLessThan(rows[i - 1].requiredGlrScfBbl);
    }
    relNear(head.highRequiredGlrScfBbl, 11338.72941173, 1e-11);
    relNear(head.lowRequiredGlrScfBbl, 3339.72840586, 1e-11);
    relNear(head.dropScfBbl, 7999.00100588, 1e-11);
    relNear(head.dropPct, 70.545832, 1e-7);
  });

  it('AND glrOk FLIPS TO TRUE ON A WELL THAT CANNOT MOVE THE PLUNGER AT ALL', () => {
    expect(head.highGlrOk).toBe(false);
    expect(head.lowGlrOk).toBe(true);
    // every point below the crossing has the expansion running backwards and
    // glrOk reading true, which is the flattering direction throughout
    const belowCrossing = rows.filter((r) => !r.expansionRunsTheRightWay);
    expect(belowCrossing.map((r) => r.casingPressurePsia)).toEqual([240, 180, 130, 90]);
    belowCrossing.forEach((r) => {
      expect(r.glrOk, `${r.casingPressurePsia} psia`).toBe(true);
      expect(r.pressureOk, `${r.casingPressurePsia} psia`).toBe(false);
    });
    expect(head.firstFlippedRow.casingPressurePsia).toBe(240);
  });

  it('feasible STILL CATCHES BOTH ENDS, so nothing ships a wrong composite verdict today', () => {
    expect(head.feasibleStillCatchesBoth).toBe(true);
    rows.forEach((r) => expect(r.feasible, `${r.casingPressurePsia} psia`)
      .toBe(r.pressureOk && r.glrOk));
    // the band where feasible is genuinely true is above the crossing and is
    // NOT an artefact: the requirement really did drop under what the well makes
    const trueRows = rows.filter((r) => r.feasible);
    expect(trueRows.map((r) => r.casingPressurePsia)).toEqual([320, 285]);
    trueRows.forEach((r) => expect(r.expansionRunsTheRightWay).toBe(true));
  });

  it('the same shape on the PUBLISHED case, so it is not a teaching-well artefact', () => {
    const pub = L.publishedCasingSweepRows();
    for (let i = 1; i < pub.length; i += 1) {
      expect(pub[i].requiredGlrScfBbl).toBeLessThan(pub[i - 1].requiredGlrScfBbl);
    }
    relNear(pub[0].requiredGlrScfBbl, 4710.35929989, 1e-11);
    relNear(pub[6].requiredGlrScfBbl, 2143.74217497, 1e-11);
    expect(pub.find((r) => r.casingPressurePsia === 150).pressureOk).toBe(false);
    expect(pub.find((r) => r.casingPressurePsia === 150).glrOk).toBe(true);
  });
});

describe('THE CLAMP AT ZERO, and the answer it hides', () => {
  const rows = L.ogutaClampRows();

  it('a foot of slug costs 0.433 times the gravity less the gas gradient', () => {
    const t = L.ogutaClampTerms();
    relNear(t.plungerPsi, 1.7522191087, 1e-10);
    relNear(t.rhoGasLbFt3, 0.5015053107, 1e-9);
    relNear(t.gasPsiPerFt, 0.003482675768, 1e-9);
    relNear(t.netPsiPerFtOfSlug, 0.455497324232, 1e-11);
    relNear(t.netPsiPerFtOfSlug, L.PSI_PER_FT_SG * L.OGUTA.liquidSg - t.gasPsiPerFt, 1e-15);
  });

  it('BOTH ENDS OF THE CLAMP PRINT A NUMBER THAT IS NOT A SOLUTION', () => {
    const low = rows.filter((r) => r.clampedAtZero);
    expect(low.map((r) => r.casingPressurePsia)).toEqual([130, 90]);
    low.forEach((r) => {
      expect(r.returnedFt).toBe(0);
      expect(r.unclampedFt, `${r.casingPressurePsia} psia`).toBeLessThan(0);
    });
    relNear(rows.find((r) => r.casingPressurePsia === 130).unclampedFt, -99.47404299, 1e-8);
    relNear(rows.find((r) => r.casingPressurePsia === 90).unclampedFt, -187.29014611, 1e-8);
    const top = L.ogutaUpperClamp();
    expect(top.identical).toBe(true);
    expect(top.returnedFt).toBe(8200);
    relNear(rows[0].unclampedFt, 8396.73393481, 1e-10);
  });

  it('ZERO IS A REFUSAL WEARING A NUMBER: with no slug at all the balance still fails', () => {
    const z = L.ogutaZeroClampReading();
    z.forEach((r) => {
      expect(r.returnedFt).toBe(0);
      expect(r.bareBalanceRequiredPsia, `${r.casingPressurePsia} psia`)
        .toBeGreaterThan(r.casingPressurePsia);
      expect(r.shortByPsi).toBeGreaterThan(0);
    });
    relNear(z[0].bareBalanceRequiredPsia, 175.3101604102, 1e-11);
    relNear(z[0].shortByPsi, 45.3101604102, 1e-11);
    relNear(z[1].shortByPsi, 85.3101604102, 1e-11);
  });

  it('where the clamp does not bite the solve is exact, and it CAN refuse when it wants to', () => {
    const c = L.ogutaMaxSlugCheck();
    relNear(c.maxSlugFt, 1195.81347818, 1e-10);
    near(c.residualPsi, 0, 1e-9);
    relNear(c.slugVolumeBbl, 6.92163806, 1e-8);
    // one refusal and two clamps in one function for one kind of question
    expect(L.ogutaClampRefusal().isNaN).toBe(true);
    const unclamped = rows.filter((r) => !r.clamped);
    expect(unclamped.length).toBe(9);
  });
});

describe('WHAT NOBODY CHECKS: the cycle against the well', () => {
  it('liquidPerDayBbl is computed, returned, and compared to nothing', () => {
    const c = L.ogutaCapacity();
    expect(c.designKeys).toContain('liquidPerDayBbl');
    relNear(c.liquidPerDayBbl, 14.83375148, 1e-9);
    relNear(c.wellLiquidBpd, 194.91525424, 1e-10);
    relNear(c.wellOverCycle, 13.13998380, 1e-9);
    relNear(c.shortfallBpd, 180.08150275, 1e-10);
    // feasible is pressureOk and glrOk and nothing else
    expect(c.feasible).toBe(c.pressureOk && c.glrOk);
    expect(c.liquidComparisonAppearsInVerdict).toBe(false);
  });

  it('and no cycle time on the sweep closes the gap, even at a zero shut-in', () => {
    const rows = L.ogutaShutInSweepRows();
    expect(rows).toHaveLength(7);
    rows.forEach((r) => expect(r.carriesTheWell, `${r.shutInMin} min`).toBe(false));
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].liquidPerDayBbl).toBeGreaterThan(rows[i - 1].liquidPerDayBbl);
    }
    relNear(rows[0].liquidPerDayBbl, 22.26256708, 1e-9);
    relNear(rows[6].liquidPerDayBbl, 67.00342849, 1e-9);
    relNear(rows[6].ratio, 2.90903404, 1e-8);
  });

  it('the same reading on the PUBLISHED case, and the same silence in the verdict', () => {
    const p = L.publishedCapacity();
    relNear(p.liquidPerDayBbl, 23.82707902, 1e-9);
    relNear(p.wellLiquidBpd, 155.55555556, 1e-10);
    relNear(p.ratio, 6.52851973, 1e-8);
    expect(p.feasible).toBe(false);
  });

  it('the ONLY timing check fires on trips a day rather than on barrels', () => {
    const s = L.ogutaSlowCycle();
    expect(s.warningCodes).toContain('slowCycle');
    expect(s.cyclesPerDay).toBeLessThan(1);
    expect(s.message).toContain('1549.9 minutes');
    expect(s.message).toContain('fewer than one trip a day');
    // and the gas warning is still raised beside it
    expect(s.warningCodes).toContain('insufficientGas');
  });
});

// ---------------------------------------------------------------------------
// 5. HYGIENE, AND AGREEMENT WITH THE SHIPPED DIGEST.
// ---------------------------------------------------------------------------

describe('the lab is a renderer feed and not a calculator', () => {
  it('is deterministic: two calls with the same arguments return equal values', () => {
    expect(L.ebochaProfileRows('coleman')).toEqual(L.ebochaProfileRows('coleman'));
    expect(L.ogutaCasingSweepRows()).toEqual(L.ogutaCasingSweepRows());
    expect(L.teachingNumbers()).toEqual(L.teachingNumbers());
  });

  it('every module refusal is stated, and none of them is a throw', () => {
    const r = L.refusals();
    expect(r.length).toBeGreaterThanOrEqual(15);
    expect(r.join(' ')).toMatch(/gasPerCycleScf does NOT check/);
    expect(r.join(' ')).toMatch(/maxSlugLengthFt clamps/);
    expect(r.join(' ')).toMatch(/never compares liquidPerDayBbl/);
    expect(r.join(' ')).toMatch(/two molecular weights of air/);
  });

  it('carries no em dash and no en dash, in the lab or in this file', () => {
    // owner rule, and it applies to source comments as much as to lesson prose
    // escaped rather than literal, so this assertion is not itself a violation
    const DASH = new RegExp('[\\u2013\\u2014]');
    expect(fs.readFileSync(path.join(HERE, 'gasWellLab.js'), 'utf8')).not.toMatch(DASH);
    expect(fs.readFileSync(path.join(HERE, 'gasWellLab.test.js'), 'utf8')).not.toMatch(DASH);
    expect(fs.readFileSync(path.join(HERE, 'panelCapstoneGuard.test.js'), 'utf8')).not.toMatch(DASH);
    expect(L.refusals().join(' ')).not.toMatch(DASH);
  });

  it('exposes every accessor the leak guard walks, and they all return something', () => {
    const named = L.teachingAccessors();
    expect(named.length).toBeGreaterThan(60);
    named.forEach(([name, fn]) => {
      expect(typeof fn, name).toBe('function');
      expect(fn(), name).toBeDefined();
    });
    expect(L.teachingNumbers().length).toBeGreaterThan(1500);
    L.teachingNumbers().forEach((v) => expect(Number.isFinite(v)).toBe(true));
  });
});

const DIGEST_PATH = '/root/pd-wip-gaswell/digest.txt';
const digestAvailable = fs.existsSync(DIGEST_PATH);

describe.skipIf(!digestAvailable)('AGREEMENT WITH THE SHIPPED DIGEST that the 78 lessons quote', () => {
  // A lab value that disagrees with /root/pd-wip-gaswell/digest.txt breaks a
  // lesson that is already written. Each entry pulls ONE line out of the
  // shipped file by an anchor the digest prints, reads the numbers off it, and
  // checks the lab against them at the digest's own printed precision.
  const lines = digestAvailable ? fs.readFileSync(DIGEST_PATH, 'utf8').split('\n') : [];
  const NUM = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  // Read the numbers AFTER the anchor only. Anchors carry digits of their own
  // (EBOCHA-5, a casing pressure, a station depth) and a hyphen in a name reads
  // as a minus sign, so scanning the whole line silently compares the wrong
  // column.
  const numbersOn = (anchor) => {
    const line = lines.find((l) => l.includes(anchor));
    expect(line, `digest has no line containing "${anchor}"`).toBeDefined();
    const tail = line.slice(line.indexOf(anchor) + anchor.length);
    const m = tail.match(NUM);
    expect(m, `no numbers after "${anchor}"`).toBeTruthy();
    return m.map(Number);
  };

  it('is the twenty section file the lessons were written from', () => {
    for (let n = 1; n <= 20; n += 1) {
      expect(lines.some((l) => l.startsWith(`# SECTION ${n}:`)), `section ${n}`).toBe(true);
    }
    expect(lines[lines.length - 2]).toBe('END OF DIGEST');
  });

  it('the published constants agree', () => {
    const c = L.publishedConstants();
    relNear(c.goldenTurnerConstant, numbersOn('golden constant, Turner droplet constant')[0], 1e-10);
    relNear(c.engineTurnerConstant, numbersOn('engine constant, Turner droplet constant')[0], 1e-10);
    relNear(c.engineRateConstantMscfd, numbersOn('golden constant, rate constant')[0], 1e-11);
    relNear(c.engineSpotDensityLbFt3,
      numbersOn('engine constant, gas density at the same spot')[0], 1e-10);
  });

  it('the EBOCHA-5 profile agrees, station for station', () => {
    const rows = L.ebochaProfileRows('coleman');
    [0, 1500, 3000, 4500, 6000, 7500].forEach((depthFt, i) => {
      const n = numbersOn(`teaching EBOCHA-5 profile coleman, ${depthFt}.0 ft: critical rate =`);
      // [criticalRate, actualVelocity, ratio]
      relNear(rows[i].criticalRateMscfd, n[0], 1e-11);
      relNear(rows[i].actualVelocityFtS, n[1], 1e-10);
      relNear(rows[i].ratio, n[2], 1e-10);
    });
    const summary = numbersOn('teaching EBOCHA-5 profile coleman, controlling station =');
    // [depth, criticalRate, ratio]
    expect(L.ebochaProfileSummary('coleman').controllingDepthFt).toBe(summary[0]);
    relNear(L.ebochaProfileSummary('coleman').controllingRatio, summary[2], 1e-10);
  });

  it('the sizing picks and the discarded candidate agree', () => {
    const c = numbersOn('teaching EBOCHA-5 sizing coleman, largestUnloaded =');
    const t = numbersOn('teaching EBOCHA-5 sizing turner, largestUnloaded =');
    expect(L.ebochaSizingVerdict('coleman').pickIdIn).toBe(c[0]);
    relNear(L.ebochaSizingVerdict('coleman').pickRatio, c[1], 1e-10);
    expect(L.ebochaSizingVerdict('turner').pickIdIn).toBe(t[0]);
    relNear(L.ebochaSizingVerdict('turner').pickRatio, t[1], 1e-10);
    const d = numbersOn('teaching EBOCHA-5 sizing, THE DISCARDED CANDIDATE:');
    // [idIn, ratioUnderColeman, ratioUnderTurner]
    const cmp = L.ebochaSizingComparison();
    expect(cmp.discardedIdIn).toBe(d[0]);
    relNear(cmp.discardedRatioUnderColeman, d[1], 1e-10);
    relNear(cmp.discardedRatioUnderTurner, d[2], 1e-10);
  });

  it('the plunger case, the gradient constant and the screen agree', () => {
    const p = L.publishedPlunger();
    relNear(p.requiredPsia, numbersOn('engine plunger, required lift pressure =')[0], 1e-11);
    relNear(p.gasPerCycleScf, numbersOn('engine plunger, gas per cycle =')[0], 1e-11);
    relNear(L.gradientConstant().exactPsiPerFtSg,
      numbersOn('derived gradient, divided by')[1], 1e-12);
    const s = L.ogutaScreenReading();
    relNear(s.requiredPsia, numbersOn('teaching OGUTA-2 screen, required lift pressure =')[0], 1e-11);
    relNear(s.requiredGlrScfBbl,
      numbersOn('teaching OGUTA-2 screen, required gas-liquid ratio =')[0], 1e-11);
  });

  it('the casing sweep and the clamp agree, row for row', () => {
    L.ogutaCasingSweepRows().forEach((r) => {
      const n = numbersOn(`teaching OGUTA-2 sweep, casing ${r.casingPressurePsia}.0 psia: required lift`);
      // [requiredLift, gasPerCycle, requiredGlr]
      relNear(r.requiredPsia, n[0], 1e-10);
      relNear(r.gasPerCycleScf, n[1], 1e-11);
      relNear(r.requiredGlrScfBbl, n[2], 1e-11);
    });
    L.ogutaClampRows().forEach((r) => {
      const n = numbersOn(`teaching OGUTA-2 clamp, casing ${r.casingPressurePsia}.0 psia: available`);
      // [available, unclamped, returned]
      relNear(r.availablePsi, n[0], 1e-8);
      relNear(r.unclampedFt, n[1], 1e-8);
      near(r.returnedFt - n[2], 0, 1e-6);
    });
  });
});
