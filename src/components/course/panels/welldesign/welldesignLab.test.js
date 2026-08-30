import { describe, it, expect } from 'vitest';
import {
  GOLDEN_WELLS, surveyListing, ADE_PUBLISHED, surveyMethods, buildHoldCase, sProfileCase,
  S_PROFILE_COUNT, slantToTarget, toolfaceCases, tvdCrossingCases, dls,
  WELL1_HEADER, uncertaintyAt, workbookCheck, CLEARANCE_PARAMS, OFFSET_WELLS,
  clearanceCase, clearanceSensitivity, wmmCheck, magneticFieldAt, azimuthConversion,
  capstoneValues,
} from './welldesignLab';

// Every expected value comes from DR1-TRUTH.md, produced by running the same
// engine outside this app. If a number here moves, either the engine changed
// or the lab stopped calling it the way the course says it does.

describe('the golden wells', () => {
  it('lists both wells the way a directional driller reads them', () => {
    expect(GOLDEN_WELLS.map((w) => w.id)).toEqual(['feet', 'metric']);
    const ft = surveyListing('feet');
    expect(ft.rows).toHaveLength(13);
    expect(ft.totalMd).toBe(4000);
    expect(ft.tvd).toBeCloseTo(3686.9804661202493, 8);
    expect(ft.vs).toBeCloseTo(1255.8726308373678, 8);
    expect(ft.maxDls100ft).toBeCloseTo(3, 10);
    const me = surveyListing('metric');
    expect(me.rows).toHaveLength(18);
    expect(me.n).toBeCloseTo(-1320.505235386686, 8);
    expect(me.maxDls30m).toBeCloseTo(3, 10);
  });

  it('has a feet well whose closure equals its vertical section', () => {
    const ft = surveyListing('feet');
    // it ends exactly on its vertical-section azimuth, which is a property of
    // this well and not of wells in general
    expect(ft.closureDist).toBeCloseTo(ft.vs, 10);
    expect(ft.closureAzi).toBeCloseTo(ft.vsAzimuthDeg, 10);
    const me = surveyListing('metric');
    expect(Math.abs(me.closureDist - me.vs)).toBeLessThan(1e-9);
  });
});

describe('the survey methods', () => {
  it('reproduces the published Applied Drilling Engineering example', () => {
    expect(ADE_PUBLISHED.minimumCurvature.tvd).toBe(1653.99);
    expect(ADE_PUBLISHED.minimumCurvature.northDisplacement).toBe(954.93);
    const m = surveyMethods();
    expect(m.stations).toBe(21);
    expect(m.finalMd).toBe(2000);
    expect(m.finalInc).toBe(60);
    expect(m.methods[0].tvd).toBeCloseTo(1653.986686265376, 8);
    expect(Math.abs(m.methods[0].tvdError)).toBeLessThan(ADE_PUBLISHED.tolerance);
    expect(Math.abs(m.methods[0].northError)).toBeLessThan(ADE_PUBLISHED.tolerance);
  });

  it('shows what the tangential method costs on the same survey', () => {
    const m = surveyMethods();
    const tan = m.methods.find((x) => x.name === 'Tangential');
    const bal = m.methods.find((x) => x.name === 'Balanced tangential');
    expect(tan.tvdError).toBeCloseTo(-25.38120586938976, 8);
    expect(tan.northError).toBeCloseTo(43.08275261486233, 8);
    expect(bal.tvdError).toBeCloseTo(-0.38120586938998713, 8);
    // the balanced method is 66 times closer than the plain one
    expect(Math.abs(tan.tvdError) / Math.abs(bal.tvdError)).toBeGreaterThan(60);
    expect(tan.implemented).toBe(false);
    expect(m.methods[0].implemented).toBe(true);
  });
});

describe('trajectory design', () => {
  it('compiles a build and hold onto its published endpoint', () => {
    const bh = buildHoldCase(0);
    expect(bh.end.md).toBe(1700);
    expect(bh.end.inc).toBeCloseTo(40, 10);
    expect(bh.end.tvd).toBeCloseTo(1481.1257260785915, 8);
    expect(Math.abs(bh.end.tvd - bh.published.endTvd)).toBeLessThan(1e-8);
    expect(Math.abs(bh.end.n - bh.published.endN)).toBeLessThan(1e-8);
    expect(bh.buildLen).toBeCloseTo(400, 8);
    expect(bh.qa.ok).toBe(true);
    expect(bh.qa.worstDls).toBeCloseTo(3, 8);
  });

  it('solves every published S profile', () => {
    expect(S_PROFILE_COUNT).toBe(3);
    for (let i = 0; i < S_PROFILE_COUNT; i += 1) {
      const s = sProfileCase(i);
      expect(s.feasible).toBe(true);
      expect(s.report.holdIncDeg).toBeCloseTo(s.published.holdIncDeg, 8);
      expect(s.report.buildLen).toBeCloseTo(s.published.buildLen, 7);
      expect(s.report.holdLen).toBeCloseTo(s.published.holdLen, 7);
      expect(s.report.dropLen).toBeCloseTo(s.published.dropLen, 7);
    }
  });

  it('refuses an S profile whose circles overlap', () => {
    const bad = sProfileCase(0);
    expect(bad.feasible).toBe(true);
    // a build-hold to a target that is above the tie-on is not a well
    const s = slantToTarget({ dN: 500, dE: 0, dTvd: -100, buildRate: 3 });
    expect(s.feasible).toBe(false);
    expect(typeof s.error).toBe('string');
  });

  it('recovers toolface and dogleg on 43 spherical cases', () => {
    const cases = toolfaceCases();
    expect(cases).toHaveLength(43);
    expect(Math.max(...cases.map((c) => c.toolfaceError))).toBeLessThan(1e-7);
    expect(Math.max(...cases.map((c) => c.doglegError))).toBeLessThan(1e-8);
  });

  it('finds every TVD-plane crossing', () => {
    const t = tvdCrossingCases();
    expect(t.stations).toBe(131);
    for (const c of t.cases) {
      expect(c.mds).toHaveLength(c.published.length);
      c.published.forEach((md, i) => expect(c.mds[i]).toBeCloseTo(md, 7));
    }
  });

  it('converts dogleg severity between the two conventions exactly', () => {
    const d = dls({ md: 0, inc: 0, azi: 0 }, { md: 30, inc: 3, azi: 0 }, 'm');
    expect(d.dls30m).toBeCloseTo(3, 10);
    expect(d.dls100ft).toBeCloseTo(3 * (30.48 / 30), 10);
  });
});

describe('position uncertainty', () => {
  it('reproduces the published ISCWSA workbook to machine precision', () => {
    const c = workbookCheck();
    expect(c.rows).toBe(108);
    expect(c.worst.rel).toBeLessThan(1e-12);
    expect(c.totals.maxRel).toBeLessThan(1e-14);
    expect(c.totals.engineNN).toBeCloseTo(8547.77693579118, 6);
  });

  it('describes the ellipse at total depth', () => {
    const u = uncertaintyAt();
    expect(WELL1_HEADER.bTotalNT).toBe(50000);
    expect(u.stationCount).toBe(268);
    expect(u.md).toBe(8000);
    expect(u.incDeg).toBeCloseTo(90, 8);
    expect(u.sigmaH).toBeCloseTo(21.636241962526093, 8);
    expect(u.sigmaL).toBeCloseTo(95.65082424690361, 8);
    expect(u.sigmaA).toBeCloseTo(10.554140502828378, 8);
    // lateral uncertainty is more than four times the highside one
    expect(u.sigmaL / u.sigmaH).toBeGreaterThan(4);
    expect(u.ellipse95.semiMajor).toBeCloseTo(267.39198828526287, 7);
    expect(u.ellipse1.azimuthDeg).toBeCloseTo(165.05207648844214, 8);
    // nine times longer than it is wide
    expect(u.ellipse1.semiMajor / u.ellipse1.semiMinor).toBeGreaterThan(9);
  });

  it('ranks the error sources, and the ranking changes with attitude', () => {
    const td = uncertaintyAt();
    expect(td.contributions[0].code).toBe('AMIL');
    expect(100 * td.contributions[0].shareOfTrace).toBeCloseTo(58.294649231431436, 8);
    expect(td.contributions.slice(0, 3).map((c) => c.code)).toEqual(['AMIL', 'DECG', 'DBHG']);
    expect(td.contributions.filter((c) => c.depthOnly).map((c) => c.code).sort())
      .toEqual(['DRFR', 'DSFS', 'DSTG']);

    const mds = uncertaintyAt(0).stationCount;
    expect(mds).toBe(268);
    const shallow = uncertaintyAt(40);
    expect(shallow.incDeg).toBeCloseTo(0, 8);
    expect(shallow.contributions[0].code).not.toBe('AMIL');
    // and two orders of magnitude smaller
    expect(td.totalTrace / shallow.totalTrace).toBeGreaterThan(100);
  });
});

describe('anti-collision', () => {
  it('reproduces the published separation factors on all eleven offsets', () => {
    expect(OFFSET_WELLS).toHaveLength(11);
    expect(CLEARANCE_PARAMS.k).toBe(3.5);
    for (const w of OFFSET_WELLS) {
      const c = clearanceCase(w);
      expect(c.minSf).toBeCloseTo(c.publishedMinSf, 6);
    }
  });

  it('classifies the offsets against the industry thresholds', () => {
    expect(clearanceCase('02 - well').classification.status).toBe('clear');
    expect(clearanceCase('01 - well').classification.status).toBe('review');
    expect(clearanceCase('09 - well').classification.status).toBe('no-go');
    expect(clearanceCase('01 - well').minSf).toBeCloseTo(1.400242036710446, 10);
    expect(clearanceCase('09 - well').minSf).toBeCloseTo(0.009794688844024428, 12);
  });

  it('goes negative when the uncertainty envelopes overlap', () => {
    const c = clearanceCase('10 - well');
    expect(c.kopDepth).toBe(900);
    expect(c.minSf).toBeCloseTo(-0.6068571428571429, 10);
    expect(c.minSf).toBeLessThan(0);
  });

  it('makes a negative separation factor look better when k grows', () => {
    const s = clearanceSensitivity('10 - well');
    expect(s.sweep[0].minSf).toBeCloseTo(-0.6068571428571429, 10);
    expect(s.sweep[1].minSf).toBeCloseTo(-1.062, 10);
    expect(s.sweep[2].minSf).toBeCloseTo(-0.4248, 10);
    // once the envelopes overlap the factor is inversely proportional to k
    expect(s.kRatio).toBeCloseTo(2 / 5, 10);
    // and a LARGER surface position error also improves it
    expect(s.sweep[3].minSf).toBeGreaterThan(s.sweep[0].minSf);
  });

  it('agrees with the oracle everywhere the number carries a decision', () => {
    // well 10 is the only kicked-off case and its far-field factors differ by
    // up to 0.7 percent, at separations where the thresholds are 1.0 and 1.5
    const c10 = clearanceCase('10 - well');
    expect(c10.worstRelError).toBeGreaterThan(1e-4);
    expect(c10.worstRelError).toBeLessThan(1e-2);
    for (const w of OFFSET_WELLS.filter((x) => x !== '10 - well')) {
      expect(clearanceCase(w).worstRelError).toBeLessThan(1e-6);
    }
  });
});

describe('the geomagnetic reference', () => {
  it('agrees with the NOAA test values to their printing precision', () => {
    const w = wmmCheck();
    expect(w.rows).toHaveLength(12);
    expect(w.maxDeclinationError).toBeCloseTo(0.00461482429820137, 10);
    expect(w.maxInclinationError).toBeLessThan(0.005);
    expect(w.maxTotalFieldError).toBeLessThan(0.05);
  });

  it('gives a declination that a survey has to be corrected by', () => {
    const f = magneticFieldAt({ latDeg: 80, lonDeg: 0 });
    expect(f.declinationDeg).toBeCloseTo(1.2814821161348655, 10);
    const c = azimuthConversion({ magneticAzi: 90, declinationDeg: f.declinationDeg, convergenceDeg: 1 });
    expect(c.true).toBeCloseTo(91.2814821161348655, 8);
    expect(c.grid).toBeCloseTo(90.2814821161348655, 8);
    expect(c.magnetic).toBe(90);
  });
});

describe('the eighteen graded fields', () => {
  const V = capstoneValues();
  const TABLE = {
    beginner: {
      ade_mincurve_tvd: 1653.986686265376,
      ade_tangential_tvd_error: -25.38120586938976,
      golden_ft_tvd: 3686.9804661202493,
      golden_ft_vertical_section: 1255.8726308373678,
      golden_m_north: -1320.505235386686,
      buildhold_end_tvd: 1481.1257260785915,
    },
    intermediate: {
      well1_cov_nn: 8547.77693579118,
      well1_sigma_lateral: 95.65082424690361,
      well1_sigma_highside: 21.636241962526093,
      well1_ellipse95_semimajor: 267.39198828526287,
      well1_ellipse_azimuth_deg: 165.05207648844214,
      well1_amil_share_pct: 58.294649231431436,
    },
    advanced: {
      well01_min_sf: 1.400242036710446,
      well09_min_sf: 0.009794688844024428,
      well10_min_sf: -0.6068571428571429,
      well10_min_sf_at_k5: -0.4248,
      wmm_max_declination_error_deg: 0.00461482429820137,
      wmm_declination_at_80n_0e: 1.2814821161348655,
    },
  };
  for (const tier of Object.keys(TABLE)) {
    for (const [key, expected] of Object.entries(TABLE[tier])) {
      it(`${tier}: ${key}`, () => {
        expect(V[tier][key]).toBeCloseTo(expected, Math.abs(expected) > 1000 ? 5 : 8);
      });
    }
  }

  it('grades six fields per tier and nothing twice', () => {
    const keys = Object.values(V).flatMap((t) => Object.keys(t));
    expect(keys).toHaveLength(18);
    expect(new Set(keys).size).toBe(18);
  });
});
