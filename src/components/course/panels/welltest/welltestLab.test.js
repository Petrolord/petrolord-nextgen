import { describe, it, expect } from 'vitest';
import {
  RESERVOIR, TRANSIENT_FIXTURES, fixtureTruth, fixtureSeries, buildupWindow, drawdownWindow,
  windowWalk, timeTransforms, derivative, plateauMean, theoreticalPlateau, theoreticalSlope,
  faultLines, fractureLinearFit, fractureAsRadial, rectanglePss, dualPorosityDip, dataPrep,
  fitModel, multiRateCase, pseudoPressureGap, equivalentLiquidB, deliverabilityCase,
  rtaOil, rtaGas, rtaLinear, capstoneValues, FIT_MODELS, phantomFault, OIL_DECLINE_ROWS,
} from './welltestLab';

// Every expected value below comes from RC7-TRUTH.md, which was produced by
// running the same engine outside this app. If a number here moves, either the
// engine changed or the lab stopped calling it the way the course says it does.

describe('the subject', () => {
  it('is one reservoir under ten fixtures', () => {
    expect(RESERVOIR).toEqual({ phi: 0.18, mu: 0.9, ct: 1.2e-5, rw: 0.354, h: 45, B: 1.25, q: 450, pi: 4800 });
    expect(TRANSIENT_FIXTURES).toHaveLength(7);
    expect(fixtureTruth('buildup')).toEqual({ k: 85, skin: 6.5, C: 0.015 });
    expect(fixtureTruth('faultDrawdown').L).toBe(800);
    expect(fixtureSeries('buildup')).toHaveLength(40);
    expect(fixtureSeries('drawdown')).toHaveLength(45);
  });
});

describe('the straight line is a choice', () => {
  it('recovers the planted permeability only from the late window', () => {
    const all = buildupWindow(0);
    expect(all.k).toBeCloseTo(23.12907021605519, 10);
    expect(all.skin).toBeCloseTo(-2.6837412661474804, 10);
    expect(all.r2).toBeCloseTo(0.9004033647584739, 12);
    expect(all.n).toBe(40);

    const late = buildupWindow(5);
    expect(late.k).toBeCloseTo(82.49005478363101, 10);
    expect(late.skin).toBeCloseTo(6.075741352818642, 10);
    expect(late.m).toBeCloseTo(22.175400474615625, 10);
    expect(late.pStar).toBeCloseTo(4800.151625643111, 8);
    expect(late.n).toBe(13);
  });

  it('inverts the sign of the skin when every point is in the fit', () => {
    expect(buildupWindow(0).skin).toBeLessThan(0);
    expect(fixtureTruth('buildup').skin).toBeGreaterThan(0);
    expect(85 / buildupWindow(0).k).toBeCloseTo(3.6750288362649663, 10);
  });

  it('walks the window monotonically towards the truth from below', () => {
    const walk = windowWalk();
    expect(walk.map((w) => w.n)).toEqual([40, 23, 20, 16, 13]);
    for (let i = 1; i < walk.length; i += 1) {
      expect(walk[i].k).toBeGreaterThan(walk[i - 1].k);
      expect(walk[i].r2).toBeGreaterThan(walk[i - 1].r2);
      expect(walk[i].k).toBeLessThan(85);
    }
    expect(walk[4].kErrorPct).toBeCloseTo(-2.952876725139989, 10);
  });

  it('reports derived quantities off the recovered line', () => {
    const late = buildupWindow(5);
    expect(late.dpSkin).toBeCloseTo(116.99974214185609, 8);
    expect(late.riAtTp).toBeCloseTo(1269.4036637344336, 8);
    expect(late.flowEfficiency).toBeCloseTo(0.5656700330547246, 12);
    expect(theoreticalSlope(85)).toBeCloseTo(21.520588235294117, 10);
    expect(theoreticalPlateau(85)).toBeCloseTo(9.344117647058821, 10);
  });

  it('lands MDH above Horner on the same well', () => {
    const mdh = drawdownWindow(5);
    expect(mdh.k).toBeCloseTo(83.49342527502293, 10);
    expect(mdh.skin).toBeCloseTo(6.24373285851045, 10);
    expect(drawdownWindow(0).k).toBeCloseTo(25.834159614322083, 10);
    expect((100 * (mdh.k - buildupWindow(5).k)) / buildupWindow(5).k)
      .toBeCloseTo(1.2163532852823662, 10);
  });

  it('runs the Horner axis backwards and saturates the Agarwal one', () => {
    expect(timeTransforms(0.01).horner).toBeCloseTo(3601, 9);
    expect(timeTransforms(79.43282347242814).horner).toBeCloseTo(1.4532131482459003, 12);
    expect(timeTransforms(1).horner).toBe(37);
    expect(timeTransforms(0.01).agarwal).toBeCloseTo(0.009997222993612885, 15);
    expect(timeTransforms(79.43282347242814).agarwal).toBeCloseTo(24.772690808264272, 10);
    expect(timeTransforms(1e9).agarwal).toBeLessThan(36);
  });
});

describe('the derivative', () => {
  it('differentiates a buildup against Agarwal equivalent time', () => {
    const { points } = derivative('buildup');
    expect(points).toHaveLength(40);
    expect(points[39].x).toBeCloseTo(24.772690808264272, 10);
    expect(points[39].derivative).toBeCloseTo(9.437599883661658, 10);
    expect(plateauMean('buildup', { from: 5 })).toBeCloseTo(9.590852793411912, 10);
  });

  it('barely moves with the smoothing window on clean data', () => {
    const last = (L) => {
      const fin = derivative('drawdown', { L }).points.filter((p) => Number.isFinite(p.derivative));
      return fin[fin.length - 1].derivative;
    };
    expect(last(0)).toBeCloseTo(9.380040795750565, 10);
    expect(last(0.5)).toBeCloseTo(9.407586754419164, 10);
    expect(Math.abs(last(0.5) - last(0)) / last(0)).toBeLessThan(0.005);
  });

  it('names a regime that is not there on the buildup', () => {
    const { regimes } = derivative('buildup');
    expect(regimes.map((r) => r.regime)).toEqual(['constant-pressure', 'radial']);
    expect(regimes[1].xStart).toBeCloseTo(3.5846608228717867, 10);
  });

  it('names a bilinear segment in the fault transition', () => {
    const { regimes } = derivative('faultDrawdown');
    expect(regimes.map((r) => r.regime))
      .toEqual(['linear', 'constant-pressure', 'radial', 'bilinear', 'radial']);
    expect(regimes[3].xStart).toBeCloseTo(25.650209056800456, 10);
  });

  it('gets the closed rectangle right', () => {
    const { regimes } = derivative('rectangleDrawdown');
    expect(regimes.map((r) => r.regime)).toEqual(['radial', 'boundary-or-pss']);
  });
});

describe('the model gallery', () => {
  it('halves the permeability on the late line past a sealing fault', () => {
    const f = faultLines();
    expect(f.early.k).toBeCloseTo(81.25445414895721, 10);
    expect(f.late.k).toBeCloseTo(45.25748634072017, 10);
    expect(f.slopeRatio).toBeCloseTo(1.795381509640958, 12);
    expect(f.late.skin).toBeLessThan(0);
    expect(f.derivEarly).toBeCloseTo(9.906923653538167, 10);
    expect(f.derivLate).toBeCloseTo(17.483282190120867, 10);
  });

  it('reads a fracture half-length off the linear line, high', () => {
    const fit = fractureLinearFit();
    expect(fit.slope).toBeCloseTo(51.502350529498294, 10);
    expect(fit.xf).toBeCloseTo(284.7383990565091, 8);
    expect(fit.xfErrorPct).toBeCloseTo(13.895359622603632, 10);
  });

  it('claims a five times better reservoir if the fracture is read as radial', () => {
    const bad = fractureAsRadial();
    expect(bad.k).toBeCloseTo(26.266915078269914, 10);
    expect(bad.skin).toBeCloseTo(-4.3726416175327625, 10);
    expect(bad.k / fixtureTruth('icFractureDrawdown').k).toBeGreaterThan(5);
  });

  it('measures a drainage area when the boundary is reached', () => {
    const r = rectanglePss();
    expect(r.mStar).toBeCloseTo(0.48352944509033047, 12);
    expect(r.poreVolumeFt3).toBeCloseTo(22680883.473293386, 4);
    expect(r.areaFt2).toBeCloseTo(2800109.0707769613, 4);
    expect(r.areaAcres).toBeCloseTo(64.28165910874567, 8);
    expect(Math.abs(r.areaErrorPct)).toBeLessThan(0.005);
  });

  it('dips but does not report omega', () => {
    const d = dualPorosityDip();
    expect(d.dipX).toBeCloseTo(4.714866363457395, 10);
    expect(d.dipDerivative).toBeCloseTo(2.5938985184716965, 10);
    expect(d.dipRatio).toBeCloseTo(0.27750746082216926, 12);
    expect(d.dipRatio).not.toBeCloseTo(d.truth.omega, 2);
  });

  it('drops one spike and shows what leaving it in costs', () => {
    const p = dataPrep();
    expect(p.denseN).toBe(45);
    expect(p.decimatedN).toBe(23);
    expect(p.removedN).toBe(1);
    expect(p.removedAt[0]).toBeCloseTo(0.6579332246575679, 12);
    expect(p.maxDerivativeShiftPct).toBeCloseTo(988.1603135426369, 6);
  });
});

describe('regression', () => {
  it('recovers what the straight line could not', () => {
    const fit = fitModel('homogeneous', 'buildup');
    expect(fit.converged).toBe(true);
    expect(fit.params.k).toBeCloseTo(85, 4);
    expect(fit.params.skin).toBeCloseTo(6.5, 5);
    expect(fit.params.C).toBeCloseTo(0.015, 8);
    expect(fit.ssr).toBeLessThan(1e-10);
    expect(Math.abs(fit.params.k - 85)).toBeLessThan(Math.abs(buildupWindow(5).k - 85));
  });

  it('reports a confidence interval that measures the optimiser, not the reservoir', () => {
    const fit = fitModel('homogeneous', 'buildup');
    expect(fit.intervalWidth.k).toBeLessThan(1e-4);
    expect(fit.confidence95.k[0]).toBeLessThan(85.0001);
  });

  it('invents a fault in data with no boundary in it', () => {
    const fit = fitModel('homogeneous-sealing-fault', 'buildup');
    expect(fit.converged).toBe(true);
    expect(fit.params.k).toBeCloseTo(85, 2);
    expect(fit.params.L).toBeGreaterThan(3000);
    expect(fit.intervalWidth.L).toBeLessThan(100);
    expect(fit.ssr).toBeLessThan(1e-6);
  });

  it('moves the phantom fault 116 ft on a 5e-13 psi rewrite of the same data', () => {
    const p = phantomFault();
    expect(p.dataGap).toBeLessThan(5e-13);
    expect(p.homogeneousK).toBeCloseTo(85, 4);
    expect(p.storedDp.L).toBeCloseTo(3092.921381005056, 6);
    expect(p.subtracted.L).toBeCloseTo(3209.25285825101, 6);
    expect(p.distanceGapFt).toBeCloseTo(116.33147724595415, 6);
    // two 95 percent intervals from the same measurement that never meet
    expect(p.intervalsOverlap).toBe(false);
  });

  it('degenerates to the right answer at a bound and calls it a failure', () => {
    const fit = fitModel('dual-porosity-pss', 'buildup');
    // omega 1 IS the homogeneous case: the model has been asked to describe a
    // reservoir with no second porosity and it has driven the parameter to the
    // bound that removes itself.
    expect(fit.params.omega).toBeCloseTo(0.9997801437192637, 8);
    expect(fit.params.omega).toBeGreaterThan(0.999);
    expect(fit.params.k).toBeCloseTo(85, 3);
    expect(fit.converged).toBe(false);
  });

  it('cannot orient a horizontal well in the slab', () => {
    const trueSide = fitModel('horizontal-well', 'horizontalDrawdown',
      { initialParams: { k: 85, kvkh: 0.1, Lw: 2000, zwFrac: 0.6, skin: 1.5, C: 1e-6 } });
    const mirror = fitModel('horizontal-well', 'horizontalDrawdown',
      { initialParams: { k: 85, kvkh: 0.1, Lw: 2000, zwFrac: 0.4, skin: 1.5, C: 1e-6 } });
    expect(trueSide.params.zwFrac).toBeCloseTo(0.6005960366490696, 8);
    expect(mirror.params.zwFrac).toBeCloseTo(0.3938793628401769, 8);
    // the wrong orientation fits marginally BETTER
    expect(mirror.ssr).toBeLessThan(trueSide.ssr);
    expect(Math.abs(trueSide.params.k - 85)).toBeLessThan(0.1);
    expect(Math.abs(mirror.params.k - 85)).toBeLessThan(0.1);
  });

  it('fits its own models correctly when the model is right', () => {
    const fault = fitModel('homogeneous-sealing-fault', 'faultDrawdown');
    expect(fault.params.L).toBeCloseTo(793.8937564207687, 6);
    const frac = fitModel('fracture-infinite-conductivity', 'icFractureDrawdown');
    expect(frac.params.xf).toBeCloseTo(249.99722543330608, 6);
    expect(FIT_MODELS).not.toContain('homogeneous-closed-rectangle');
  });
});

describe('rate history', () => {
  it('recovers the well through three rates and loses it in one', () => {
    const mr = multiRateCase();
    expect(mr.periods.map((p) => p.q)).toEqual([450, 250, 700]);
    expect(mr.multiRate.k).toBeCloseTo(83.40692632353809, 10);
    expect(mr.multiRate.skin).toBeCloseTo(6.230048388715906, 10);
    expect(mr.naive.k).toBeCloseTo(119.41136566441537, 10);
    expect(mr.naiveKErrorPct).toBeCloseTo(40.483959605194556, 10);
    expect(mr.fitPoints).toBe(15);
  });

  it('gives a producing time that is not the last rate duration', () => {
    const mr = multiRateCase();
    expect(mr.equivalentTp).toBeCloseTo(64.28571428571429, 10);
    expect(mr.lastRateHours).toBe(36);
  });
});

describe('gas', () => {
  it('shows pressure squared overstating the drive', () => {
    const g = pseudoPressureGap(2000, 4000);
    expect(g.m1).toBeCloseTo(293027042.5469171, 4);
    expect(g.m2).toBeCloseTo(967928373.9508052, 4);
    expect(g.mRatio).toBeCloseTo(3.30320493814433, 10);
    expect(g.pSquaredRatio).toBe(4);
    expect(g.overstatementPct).toBeGreaterThan(20);
    expect(g.z1).toBeCloseTo(0.8905871966416155, 12);
  });

  it('has an adapter constant that is not a formation volume factor', () => {
    expect(equivalentLiquidB()).toBeGreaterThan(1000);
  });

  it('returns two absolute open flows from three points', () => {
    const d = deliverabilityCase();
    expect(d.points.map((p) => Math.round(p.pwf))).toEqual([1700, 1500, 1300]);
    expect(d.backPressure.n).toBeCloseTo(0.8699985513227301, 10);
    expect(d.backPressure.aof).toBeCloseTo(9033.515765330243, 8);
    expect(d.lit.aof).toBeCloseTo(8681.970724434363, 8);
    expect(d.aofGapPct).toBeCloseTo(4.049138750335787, 10);
    // the better looking fit is the bigger number
    expect(d.backPressure.r2).toBeGreaterThan(d.lit.r2);
    expect(d.backPressure.aof).toBeGreaterThan(d.lit.aof);
  });
});

describe('rate transient analysis', () => {
  it('reads the oil in place off the flowing material balance', () => {
    const o = rtaOil();
    expect(o.N).toBeCloseTo(1996864.3157109257, 4);
    expect(o.J).toBeCloseTo(1.4971609114416864, 10);
    expect(o.nErrorPct).toBeCloseTo(-0.15678421445371352, 10);
    expect(o.rowsTe[o.rowsTe.length - 1].te).toBeCloseTo(2354.8823231566266, 8);
  });

  it('gets the same answer from half the record on an exact decline', () => {
    const full = rtaOil();
    expect(rtaOil({ rows: [] })).toBeNull();
    const first40 = rtaOil({ rows: OIL_DECLINE_ROWS.slice(0, 40) });
    expect(first40.N).toBeCloseTo(full.N, 6);
    expect(OIL_DECLINE_ROWS).toHaveLength(80);
  });

  it('scales the oil in place with the compressibility it was given', () => {
    const base = rtaOil();
    const high = rtaOil({ ct: 1.2e-5 * 1.2 });
    expect(high.N).toBeCloseTo(1664053.5964257715, 4);
    expect(high.N / base.N).toBeCloseTo(1 / 1.2, 10);
  });

  it('needs pseudo-time for gas', () => {
    const g = rtaGas();
    expect(g.converged).toBe(true);
    expect(g.G).toBeCloseTo(19960373.229717568, 2);
    expect(g.gErrorPct).toBeCloseTo(-0.1981338514121622, 8);
    expect(g.tcaLast / g.teLast).toBeCloseTo(0.5080083613335826, 10);
  });

  it('measures a product it cannot split', () => {
    const l = rtaLinear();
    expect(l.xfSqrtK).toBeCloseTo(500, 8);
    expect(l.split.find((s) => s.k === 1).xf).toBeCloseTo(500, 8);
    expect(l.split.find((s) => s.k === 10).xf).toBeCloseTo(158.1138830084189, 8);
  });
});

describe('the eighteen graded fields', () => {
  const V = capstoneValues();
  const TABLE = {
    beginner: {
      horner_k_md: 82.49005478363101,
      horner_skin: 6.075741352818642,
      horner_slope_psi_cycle: 22.175400474615625,
      horner_pstar_psia: 4800.151625643111,
      skin_dp_psi: 116.99974214185609,
      ri_at_tp_ft: 1269.4036637344336,
    },
    intermediate: {
      radial_plateau_psi: 9.590852793412228,
      fault_late_k_md: 45.25748634072017,
      fault_slope_ratio: 1.795381509640958,
      fracture_sqrt_slope: 51.502350529498294,
      rect_drainage_area_ft2: 2800109.0707769613,
      dp_dip_ratio: 0.27750746082216926,
    },
    advanced: {
      fault_fit_distance_ft: 793.8937564207687,
      multirate_k_md: 83.40692632353809,
      equivalent_producing_time_h: 64.28571428571429,
      aof_disagreement_pct: 4.049138750335787,
      rta_oil_n_stb: 1996864.3157109257,
      rta_gas_g_mscf: 19960373.229717568,
    },
  };

  for (const tier of Object.keys(TABLE)) {
    for (const [key, expected] of Object.entries(TABLE[tier])) {
      it(`${tier}: ${key}`, () => {
        expect(V[tier][key]).toBeCloseTo(expected, expected > 1e6 ? 1 : 6);
      });
    }
  }

  it('grades six fields per tier and nothing twice', () => {
    const keys = Object.values(V).flatMap((t) => Object.keys(t));
    expect(keys).toHaveLength(18);
    expect(new Set(keys).size).toBe(18);
  });
});
