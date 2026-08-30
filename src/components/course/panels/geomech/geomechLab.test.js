import { describe, it, expect } from 'vitest';
import {
  G, PARAMS, PROFILE, WELLS, caseOf, stresses, atDepth, orderingViolations,
  stability, attitudeSweep, window_, oracleCheck, VERTICAL, verticalCheck,
  frictionalLimitRatio, ucsFromDt, qualityScore,
  CAPSTONE_PARAMS, CAPSTONE_DT_US_PER_M, CAPSTONE_TVD_M, CAPSTONE_INC_DEG,
  CAPSTONE_AZI_DEG, capstoneValues,
} from './geomechLab.js';

const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('the fixtures', () => {
  it('carries one profile of 52 samples from 50 m to 2600 m', () => {
    expect(PROFILE.tvdM).toHaveLength(52);
    expect(PROFILE.tvdM[0]).toBe(50);
    expect(PROFILE.tvdM.at(-1)).toBe(2600);
    expect(PROFILE.svPa).toHaveLength(52);
    expect(PROFILE.ppPa).toHaveLength(52);
    expect(PROFILE.dtUsPerM).toHaveLength(52);
  });

  it('carries the same two wells the rest of the module uses', () => {
    expect(WELLS.map((w) => w.id)).toEqual(['slant', 'horizontal']);
    expect(caseOf('slant').stations.at(-1).md).toBe(3000);
    expect(caseOf('horizontal').stations.at(-1).md).toBe(2800);
  });

  it('runs the published parameter set in the lessons', () => {
    expect(PARAMS.nu).toBe(0.28);
    expect(PARAMS.frictionAngleDeg).toBe(32);
    expect(PARAMS.shmaxAzimuthDeg).toBe(60);
    expect(PARAMS.tensileStrengthPa).toBe(1e6);
    expect(PARAMS.alphaBiot).toBe(1);
  });
});

describe('the horizontal stresses', () => {
  it('reproduces every published stress sample exactly', () => {
    const s = stresses();
    for (let i = 0; i < PROFILE.tvdM.length; i += 1) {
      near(s.shminPa[i], PROFILE.shminPa[i], 1e-6);
      near(s.shmaxPa[i], PROFILE.shmaxPa[i], 1e-6);
    }
  });

  it('uses k0 = nu / (1 - nu) and reports the clamp count the goldens publish', () => {
    const s = stresses();
    near(s.k0Used, PARAMS.nu / (1 - PARAMS.nu), 1e-15);
    expect(s.k0Used).toBeCloseTo(0.38888888888888895, 15);
    expect(s.clampedCount).toBe(PROFILE.clampedCount);
    expect(s.clampedCount).toBe(4);
  });

  it('has a frictional limit ratio that rises steeply with the friction angle', () => {
    near(frictionalLimitRatio(0), 1, 1e-15);
    near(frictionalLimitRatio(30), 3, 1e-12);
    expect(frictionalLimitRatio(32)).toBeCloseTo(3.254588303299863, 12);
    expect(frictionalLimitRatio(26)).toBeCloseTo(2.5610706048410403, 12);
    expect(frictionalLimitRatio(45)).toBeGreaterThan(5.8);
  });

  it('puts SHmax above the overburden over the top 1150 m, which breaks the stated regime', () => {
    const v = orderingViolations();
    expect(v).toHaveLength(23);
    expect(v.every((r) => r.reasons.includes('overburden below shmax'))).toBe(true);
    expect(v[0].tvdM).toBe(50);
    expect(v.at(-1).tvdM).toBe(1150);
    // and it is the tectonic strain rather than the clamp that does it: only
    // four of the 23 depths are clamped at all.
    expect(stresses().clampedCount).toBe(4);
  });

  it('scores the profile at 80 for exactly that ordering breach', () => {
    const s = stresses();
    const q = qualityScore({ svPa: PROFILE.svPa, shmaxPa: s.shmaxPa, shminPa: s.shminPa, ppPa: PROFILE.ppPa, regime: 'NF' });
    expect(q.score).toBe(80);
    expect(q.warnings).toHaveLength(1);
    expect(q.warnings[0]).toContain('23 samples');
  });

  it('drops both k0 and the frictional ratio when the capstone parameters are used', () => {
    const s = stresses(CAPSTONE_PARAMS);
    expect(s.k0Used).toBeCloseTo(0.3157894736842105, 15);
    expect(s.k0Used).toBeLessThan(stresses().k0Used);
    expect(s.clampedCount).toBe(6);
    expect(s.clampedCount).toBeGreaterThan(stresses().clampedCount);
  });
});

describe('the UCS correlations', () => {
  it('crosses McNally TWICE across the profile rather than sitting below it', () => {
    const h = ucsFromDt({ dtUsPerM: PROFILE.dtUsPerM }).ucsPa;
    const m = ucsFromDt({ dtUsPerM: PROFILE.dtUsPerM, correlation: 'mcnally' }).ucsPa;
    let flips = 0;
    for (let i = 1; i < h.length; i += 1) {
      if (Math.sign(h[i] - m[i]) !== Math.sign(h[i - 1] - m[i - 1])) flips += 1;
    }
    expect(flips).toBe(2);
    // a power law and an exponential meet at most twice, and both meetings
    // fall inside this profile's sonic range of 188 to 494 microseconds per m
    const at = (dt) => ucsFromDt({ dtUsPerM: [dt] }).ucsPa[0]
      - ucsFromDt({ dtUsPerM: [dt], correlation: 'mcnally' }).ucsPa[0];
    expect(at(188)).toBeGreaterThan(0);
    expect(at(300)).toBeLessThan(0);
    expect(at(494)).toBeGreaterThan(0);
  });

  it('puts the two crossings at about 198.7 and about 409.8 microseconds per metre', () => {
    const at = (dt) => ucsFromDt({ dtUsPerM: [dt] }).ucsPa[0]
      - ucsFromDt({ dtUsPerM: [dt], correlation: 'mcnally' }).ucsPa[0];
    const bisect = (a, b) => {
      for (let i = 0; i < 80; i += 1) {
        const c = (a + b) / 2;
        if (Math.sign(at(c)) === Math.sign(at(a))) a = c; else b = c;
      }
      return (a + b) / 2;
    };
    expect(bisect(150, 300)).toBeCloseTo(198.68499251376295, 6);
    expect(bisect(300, 500)).toBeCloseTo(409.8356528477385, 6);
  });

  it('reproduces the published UCS column from the sonic with Horsrud', () => {
    const h = ucsFromDt({ dtUsPerM: PROFILE.dtUsPerM }).ucsPa;
    for (let i = 0; i < h.length; i += 1) near(h[i], PROFILE.ucsPa[i], Math.abs(PROFILE.ucsPa[i]) * 1e-12);
  });

  it('names its provenance rather than presenting a bare number', () => {
    expect(ucsFromDt({ dtUsPerM: [250] }).provenance).toContain('Horsrud 2001');
    expect(ucsFromDt({ dtUsPerM: [250], correlation: 'mcnally' }).provenance).toContain('McNally 1987');
  });
});

describe('the vertical closed forms', () => {
  it('matches the published collapse and fracture pressures to the last digit', () => {
    const v = verticalCheck();
    expect(v.engine.collapsePa).toBe(VERTICAL.expected.collapsePa);
    expect(v.engine.fracInitPa).toBe(VERTICAL.expected.fracInitPa);
    expect(v.engine.collapsePa).toBe(33750000);
    expect(v.engine.fracInitPa).toBe(55000000);
  });

  it('agrees with arithmetic a person can do on paper', () => {
    const v = verticalCheck();
    near(v.closedCollapsePa, 33750000, 1e-6);
    near(v.closedFracPa, 55000000, 1e-6);
    near(v.collapseErrPa, 0, 1e-6);
    near(v.fracErrPa, 0, 1e-6);
  });

  it('breaks out at 90 degrees from the high side, which is the SHmax azimuth here', () => {
    expect(verticalCheck().engine.breakoutThetaDeg).toBe(90);
    expect(VERTICAL.inputs.shmaxAzimuthDeg).toBe(0);
  });
});

describe('stability against hole attitude', () => {
  it('gives the same answer at every azimuth when the hole is vertical', () => {
    const rows = attitudeSweep(2500, { incs: [0], azis: [0, 60, 150] });
    for (const r of rows) {
      near(r.collapseEmw, rows[0].collapseEmw, 1e-9);
      near(r.fracInitEmw, rows[0].fracInitEmw, 1e-9);
    }
  });

  it('rotates the breakout with the azimuth even though the window does not move', () => {
    const rows = attitudeSweep(2500, { incs: [0], azis: [0, 60, 150] });
    expect(new Set(rows.map((r) => r.breakoutThetaDeg)).size).toBe(3);
  });

  it('makes the window narrowest along SHmax and widest along Shmin at 90 degrees', () => {
    const rows = attitudeSweep(2500, { incs: [90], azis: [60, 150] });
    const alongShmax = rows.find((r) => r.aziDeg === 60);
    const alongShmin = rows.find((r) => r.aziDeg === 150);
    expect(alongShmax.widthEmw).toBeLessThan(alongShmin.widthEmw);
    expect(alongShmax.widthEmw).toBeCloseTo(1470.9589, 3);
    expect(alongShmin.widthEmw).toBeCloseTo(1986.4001, 3);
  });

  it('costs window width to deviate at all, at this depth', () => {
    const v = stability(2500, { incDeg: 0, aziDeg: 0 });
    const rows = attitudeSweep(2500, { incs: [30, 60, 90], azis: [60] });
    for (const r of rows) expect(r.widthEmw).toBeLessThan(v.widthEmw);
  });

  it('raises the collapse pressure monotonically with inclination along SHmax', () => {
    const rows = attitudeSweep(2500, { incs: [0, 30, 60, 90], azis: [60] });
    for (let i = 1; i < rows.length; i += 1) expect(rows[i].collapseEmw).toBeGreaterThan(rows[i - 1].collapseEmw);
  });
});

describe('the mud window along a well', () => {
  it('reproduces both wells against the published oracle', () => {
    const r = oracleCheck();
    expect(r.checked).toBeGreaterThan(180);
    expect(r.worstRel).toBeLessThan(1e-9);
  });

  it('finds the tightest point at total depth on the slant well', () => {
    const w = window_('slant');
    expect(w.rows).toHaveLength(99);
    expect(w.tightest.md).toBe(3000);
    expect(w.tightest.widthKgM3).toBeCloseTo(1041.460043689, 8);
    expect(w.inversionMd).toBeNull();
  });

  it('finds it in the build on the horizontal well, not at total depth', () => {
    const w = window_('horizontal');
    expect(w.rows).toHaveLength(92);
    expect(w.tightest.md).toBe(1020);
    expect(w.tightest.md).toBeLessThan(caseOf('horizontal').stations.at(-1).md);
    expect(w.tightest.widthKgM3).toBeCloseTo(1364.186320488, 8);
  });

  it('has a lower bound set by pore pressure on the slant well and by collapse on the horizontal one, at capstone parameters', () => {
    expect(window_('slant', CAPSTONE_PARAMS).boundAtTightest).toBe('pore pressure');
    expect(window_('horizontal', CAPSTONE_PARAMS).boundAtTightest).toBe('collapse');
  });

  it('never closes the window on either well at either parameter set', () => {
    for (const id of ['slant', 'horizontal']) {
      expect(window_(id).inversionMd).toBeNull();
      expect(window_(id, CAPSTONE_PARAMS).inversionMd).toBeNull();
    }
  });
});

describe('the capstone', () => {
  const V = capstoneValues();

  it('runs a parameter set with nothing in common with the published one', () => {
    for (const k of ['nu', 'frictionAngleDeg', 'ePa', 'epsX', 'epsY', 'alphaBiot',
      'shmaxAzimuthDeg', 'tensileStrengthPa']) {
      expect(CAPSTONE_PARAMS[k]).not.toBe(PARAMS[k]);
    }
    expect(CAPSTONE_PARAMS.regime).toBe(PARAMS.regime);
  });

  it('runs a sonic reading and a hole attitude the lessons never use', () => {
    expect(PROFILE.dtUsPerM).not.toContain(CAPSTONE_DT_US_PER_M);
    expect([0, 30, 60, 90]).not.toContain(CAPSTONE_INC_DEG);
    expect([0, 60, 150]).not.toContain(CAPSTONE_AZI_DEG);
    expect(PROFILE.tvdM).toContain(CAPSTONE_TVD_M);
  });

  it('pins all eighteen graded values', () => {
    near(V.k0_used, 0.3157894736842105, 5e-7);
    near(V.frictional_limit_ratio, 2.5610706048410403, 5e-7);
    near(V.shmin_at_2000m_Pa, 33914681.28858234, 50);
    near(V.shmax_at_2000m_Pa, 38269519.99825976, 50);
    near(V.ucs_horsrud_Pa, 81461382.79343805, 50);
    near(V.ucs_mcnally_Pa, 93075820.55442823, 50);
    near(V.collapse_Pa, 14628899.208552536, 50);
    near(V.frac_init_Pa, 45176234.71145374, 50);
    near(V.breakout_theta_deg, 84, 0.5);
    near(V.collapse_emw_kgm3, 745.8662850490502, 0.005);
    near(V.frac_init_emw_kgm3, 2303.346948828282, 0.005);
    near(V.window_width_emw_kgm3, 1557.480663779232, 0.005);
    near(V.slant_tightest_width_kgm3, 1317.993874508228, 0.005);
    near(V.slant_collapse_emw_at_tightest_kgm3, 248.10414286699674, 0.005);
    near(V.slant_frac_init_emw_at_tightest_kgm3, 2496.6949229689703, 0.005);
    near(V.horizontal_tightest_width_kgm3, 1343.3180035349267, 0.005);
    near(V.horizontal_collapse_emw_at_tightest_kgm3, 1411.1968938126954, 0.005);
    near(V.horizontal_frac_init_emw_at_tightest_kgm3, 2754.514897347622, 0.005);
  });

  it('has no two graded values within the larger of their two tolerances', () => {
    const F = [
      ['k0_used', 5e-7], ['frictional_limit_ratio', 5e-7],
      ['shmin_at_2000m_Pa', 50], ['shmax_at_2000m_Pa', 50],
      ['ucs_horsrud_Pa', 50], ['ucs_mcnally_Pa', 50],
      ['collapse_Pa', 50], ['frac_init_Pa', 50], ['breakout_theta_deg', 0.5],
      ['collapse_emw_kgm3', 0.005], ['frac_init_emw_kgm3', 0.005], ['window_width_emw_kgm3', 0.005],
      ['slant_tightest_width_kgm3', 0.005], ['slant_collapse_emw_at_tightest_kgm3', 0.005],
      ['slant_frac_init_emw_at_tightest_kgm3', 0.005],
      ['horizontal_tightest_width_kgm3', 0.005], ['horizontal_collapse_emw_at_tightest_kgm3', 0.005],
      ['horizontal_frac_init_emw_at_tightest_kgm3', 0.005],
    ];
    for (let a = 0; a < F.length; a += 1) {
      for (let b = a + 1; b < F.length; b += 1) {
        const gap = Math.abs(V[F[a][0]] - V[F[b][0]]);
        expect(gap).toBeGreaterThan(Math.max(F[a][1], F[b][1]));
      }
    }
  });

  it('has no graded value within its tolerance of anything the goldens publish', () => {
    const pub = [];
    (function walk(o) {
      if (typeof o === 'number') { pub.push(o); return; }
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (o && typeof o === 'object') Object.values(o).forEach(walk);
    }({ PROFILE, PARAMS, VERTICAL, wells: WELLS }));
    expect(pub.length).toBeGreaterThan(500);
    const tol = { k0_used: 5e-7, frictional_limit_ratio: 5e-7, breakout_theta_deg: 0.5 };
    for (const [k, v] of Object.entries(V)) {
      const t = tol[k] ?? (k.endsWith('_Pa') ? 50 : 0.005);
      for (const p of pub) if (p !== 0) expect(Math.abs(p - v)).toBeGreaterThan(t);
    }
  });

  it('closes each tier on a sum the learner can check', () => {
    near(V.collapse_emw_kgm3 + V.window_width_emw_kgm3, V.frac_init_emw_kgm3, 1e-9);
    near(V.horizontal_collapse_emw_at_tightest_kgm3 + V.horizontal_tightest_width_kgm3,
         V.horizontal_frac_init_emw_at_tightest_kgm3, 1e-9);
    // and on the slant well the lower bound is the PORE PRESSURE rather than
    // the collapse pressure, so the same sum does NOT close there.
    const gap = V.slant_frac_init_emw_at_tightest_kgm3
      - (V.slant_collapse_emw_at_tightest_kgm3 + V.slant_tightest_width_kgm3);
    expect(Math.abs(gap)).toBeGreaterThan(900);
  });

  it('keeps the Associate pressures apart from the Professional ones by orders of magnitude', () => {
    expect(V.shmin_at_2000m_Pa).toBeLessThan(V.frac_init_Pa);
    expect(V.collapse_Pa).toBeLessThan(V.shmin_at_2000m_Pa);
    expect(V.ucs_horsrud_Pa).toBeLessThan(V.ucs_mcnally_Pa);
  });
});
