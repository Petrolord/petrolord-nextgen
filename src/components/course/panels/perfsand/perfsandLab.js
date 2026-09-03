// Teaching lab for DR9, Perforation & Sand Control. The panels, the learning
// page and the vitest file all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// Everything here is the vendored engine's own output. Nothing is retyped from
// a paper: the Karakas-Tariq constant tables, the gravel and gauge series and
// the underbalance bands are IMPORTED, and every derived value is a return
// value from a call.

import cases from '@petrolord/engines/test-data/drilling/goldens/perfsand_cases.json';
import {
  karakasTariq, productivityRatio, underbalanceAdvice,
  KT_PHASING_TABLE, KT_PHASINGS_DEG, KT_RPD_RANGE, KT_HD_MAX, UNDERBALANCE_BANDS,
} from '@petrolord/engines/engines/drilling/perforation.js';
import {
  sieveStats, saucierGravel, screenSelection, sandControlAdvisor,
  sandingOnset, cdpAlongInterval, SAUCIER_RANGE, FINES_CUTOFF_M, CAVITY_GEOMETRIES,
} from '@petrolord/engines/engines/drilling/sandControl.js';
import { GUN_CATALOG } from '@petrolord/engines/engines/drilling/data/perforatingGuns.js';
import {
  GRAVEL_CATALOG, SCREEN_GAUGE_THOU, SCREEN_GAUGES_M,
} from '@petrolord/engines/engines/drilling/data/sandControlCatalog.js';

export {
  karakasTariq, productivityRatio, underbalanceAdvice, sieveStats, saucierGravel,
  screenSelection, sandControlAdvisor, sandingOnset, cdpAlongInterval,
  KT_PHASING_TABLE, KT_PHASINGS_DEG, KT_RPD_RANGE, KT_HD_MAX, UNDERBALANCE_BANDS,
  SAUCIER_RANGE, FINES_CUTOFF_M, CAVITY_GEOMETRIES, GUN_CATALOG,
  GRAVEL_CATALOG, SCREEN_GAUGE_THOU, SCREEN_GAUGES_M,
};

export const IN = 0.0254;
export const UM = 1e-6;
export const THOU = 25.4e-6;
export const PSI = 6894.757293168;
export const FT_PER_M = 3.280839895;
export const GOLDEN = cases;
export const PARAMS = cases.params;

export const CURVES = {
  tvdM: cases.profile.tvdM, svPa: cases.profile.svPa, shmaxPa: cases.profile.shmaxPa,
  shminPa: cases.profile.shminPa, ppPa: cases.profile.ppPa, ucsPa: cases.profile.ucsPa,
};
export const STATIONS = cases.stations;

// ---------------------------------------------------------------------------
// The two published guns.
// ---------------------------------------------------------------------------

export const publishedGun = (key) => {
  const g = cases.guns.find((x) => x.inputs.key === key);
  if (!g) throw new Error(`No published gun "${key}".`);
  return g.inputs;
};
export const PUBLISHED_KEYS = cases.guns.map((g) => g.inputs.key);

export const skinOf = (i, over = {}) => karakasTariq({
  lpM: i.lpM, rpM: i.rpM, spfPerM: i.spfPerM, phasingDeg: i.phasingDeg,
  rwM: PARAMS.rwM, khOverKv: PARAMS.khOverKv, rcM: i.rcM, kOverKc: i.kOverKc, ...over,
});
export const prOf = (sTotal, reM = PARAMS.reM, rwM = PARAMS.rwM) => productivityRatio({ reM, rwM, sTotal });

export const publishedSkin = (key) => skinOf(publishedGun(key));
export const publishedPr = (key) => prOf(publishedSkin(key).total);

// ---------------------------------------------------------------------------
// The whole gun catalog at one rock. A charge is sold on an entrance hole and
// a penetration, so rp is HALF the entrance hole and lp IS the penetration.
// ---------------------------------------------------------------------------

export const CATALOG_RC_M = 0.5 * IN;
export const CATALOG_K_OVER_KC = 5;

export const catalogRow = (g, over = {}) => {
  const skin = karakasTariq({
    lpM: g.penetrationM, rpM: g.entranceHoleM / 2, spfPerM: g.spfPerM,
    phasingDeg: g.phasingDeg, rwM: PARAMS.rwM, khOverKv: PARAMS.khOverKv,
    rcM: CATALOG_RC_M, kOverKc: CATALOG_K_OVER_KC, ...over,
  });
  return {
    name: g.name, conveyance: g.conveyance, odIn: g.odIn, spfPerFt: g.spfPerFt,
    spfPerM: g.spfPerM, phasingDeg: g.phasingDeg, entranceHoleIn: g.entranceHoleIn,
    penetrationIn: g.penetrationIn, lpM: g.penetrationM, rpM: g.entranceHoleM / 2,
    ...skin, ratio: prOf(skin.total).ratio,
  };
};
export const catalogSweep = (over = {}) => GUN_CATALOG.map((g) => catalogRow(g, over));

/** Where the catalog crosses from a damaging gun to a stimulating one. */
export const zeroCrossing = () => {
  const rows = catalogSweep();
  for (let i = 1; i < rows.length; i += 1) {
    if (rows[i - 1].total > 0 && rows[i].total <= 0) return { above: rows[i - 1], below: rows[i] };
  }
  return null;
};

/** Which catalog rows leave the correlation's stated development range. */
export const outOfRange = () => catalogSweep().filter((r) => r.warnings.length > 0);

// ---------------------------------------------------------------------------
// Sweeps.
// ---------------------------------------------------------------------------

export const phasingSweep = (key = 'hsd-4-5-8') => {
  const i = publishedGun(key);
  return KT_PHASINGS_DEG.map((phasingDeg) => {
    const skin = skinOf(i, { phasingDeg });
    return {
      phasingDeg, alpha: KT_PHASING_TABLE[phasingDeg].alpha, ...skin,
      ratio: prOf(skin.total).ratio,
    };
  });
};

/** One input moved at a time, everything else held. */
export const sensitivity = (key = 'hsd-4-5-8') => {
  const i = publishedGun(key);
  const at = (over) => {
    const skin = skinOf(i, over);
    return { ...skin, ratio: prOf(skin.total).ratio };
  };
  return {
    baseline: at({}),
    lpHalf: at({ lpM: i.lpM / 2 }),
    lpDouble: at({ lpM: i.lpM * 2 }),
    spfHalf: at({ spfPerM: i.spfPerM / 2 }),
    spfDouble: at({ spfPerM: i.spfPerM * 2 }),
    isotropic: at({ khOverKv: 1 }),
    anisotropic10: at({ khOverKv: 10 }),
    crushClean: at({ kOverKc: 1 }),
    crushSevere: at({ kOverKc: 20 }),
  };
};

/** The productivity ratio against the drainage radius, at a fixed skin. */
export const reSweep = (sTotal, res = [50, 100, 200, 300, 500, 1000, 2000]) => res
  .map((reM) => ({ reM, ...prOf(sTotal, reM) }));

// ---------------------------------------------------------------------------
// Sand.
// ---------------------------------------------------------------------------

export const ptsOf = (pairs) => pairs.map(([sizeUm, cumRetainedPct]) => ({
  sizeM: sizeUm * UM, cumRetainedPct,
}));

export const PUBLISHED_SIEVE = cases.sieve.points;
export const publishedStats = () => sieveStats(PUBLISHED_SIEVE);

/** Five sands that land on the four rungs of the advisor ladder. */
export const RUNG_SANDS = {
  'clean uniform': [[500, 1], [420, 4], [350, 12], [297, 30], [250, 55], [210, 78], [177, 92], [125, 98], [44, 99.6]],
  'uniform, a little fines': [[500, 2], [350, 8], [250, 22], [210, 42], [177, 62], [125, 82], [88, 93], [62, 97], [44, 98.5]],
  graded: [[600, 2], [420, 9], [297, 22], [210, 38], [150, 55], [105, 71], [74, 84], [53, 93], [44, 96]],
  'gravel-pack sand': [[600, 2], [420, 8], [297, 20], [210, 35], [150, 52], [105, 68], [74, 81], [53, 90], [44, 93]],
  'poorly sorted': [[840, 2], [500, 8], [297, 18], [177, 32], [105, 48], [62, 64], [44, 78], [20, 92], [10, 98]],
};
export const rungTable = () => Object.entries(RUNG_SANDS).map(([name, pairs]) => {
  const stats = sieveStats(ptsOf(pairs));
  return {
    name, d50M: stats.d50M, d10M: stats.d10M, uniformity: stats.uniformity,
    finesPct: stats.finesPct, indication: sandControlAdvisor(stats).indication,
  };
});

export const saucierSweep = (d50Ums = [60, 80, 100, 120, 150, 200, 300]) => d50Ums.map((d50Um) => {
  const s = saucierGravel({ d50M: d50Um * UM });
  return {
    d50Um, bandMinM: s.bandMinM, bandMaxM: s.bandMaxM,
    matches: s.matches.map((m) => m.mesh), nearest: s.nearest.mesh, noMatch: s.noMatch,
  };
});

export const gaugeTable = () => GRAVEL_CATALOG.map((g) => {
  const sc = screenSelection({ mode: 'gravel-pack', gravel: g });
  return {
    mesh: g.mesh, minM: g.minM, maxM: g.maxM, d50M: g.d50M,
    maxGaugeM: sc.maxGaugeM, gaugeM: sc.gaugeM,
    gaugeThou: sc.gaugeM == null ? null : sc.gaugeM / THOU,
    marginM: sc.gaugeM == null ? null : sc.maxGaugeM - sc.gaugeM,
    noGauge: sc.noGauge,
  };
});

/** The gravel a sand ends up with, and the gauge that follows from it. */
export const packFor = (d50M) => {
  const sauc = saucierGravel({ d50M });
  const gravel = sauc.matches.length ? sauc.matches[0] : sauc.nearest;
  const screen = screenSelection({ mode: 'gravel-pack', gravel });
  return {
    bandMinM: sauc.bandMinM, bandMaxM: sauc.bandMaxM, noMatch: sauc.noMatch,
    mesh: gravel.mesh, maxGaugeM: screen.maxGaugeM, gaugeM: screen.gaugeM,
    gaugeThou: screen.gaugeM / THOU, marginM: screen.maxGaugeM - screen.gaugeM,
  };
};

// ---------------------------------------------------------------------------
// Sanding.
// ---------------------------------------------------------------------------

export const cdpFor = ({
  topMdM = PARAMS.interval.topMdM, bottomMdM = PARAMS.interval.bottomMdM,
  geometry = 'perf-tunnel', boostFactor = PARAMS.boostFactor, stepMdM = PARAMS.stepMdM,
  curves = CURVES,
} = {}) => cdpAlongInterval({ stations: STATIONS, curves, topMdM, bottomMdM, geometry, boostFactor, stepMdM });

/** The sweep at several step sizes. Every one must reach the interval bottom. */
export const stepIndependence = (steps = [7, 10, 13, 25, 30, 40, 99, 150], over = {}) => steps.map((stepMdM) => {
  const r = cdpFor({ ...over, stepMdM });
  return {
    stepMdM, rows: r.rows.length, firstMdM: r.rows[0].mdM, lastMdM: r.rows[r.rows.length - 1].mdM,
    governingMdM: r.governing.mdM, governingCdpPa: r.governing.cdpPa,
  };
});

/** The profile the missing bottom row was hiding: rock that weakens at the base. */
export const weakenedCurves = (fromTvdM = 2130, overMdM = 60, dropFraction = 0.55) => ({
  ...CURVES,
  ucsPa: CURVES.ucsPa.map((u, i) => {
    const z = CURVES.tvdM[i];
    if (z < fromTvdM) return u;
    return u * (1 - dropFraction * Math.min(1, (z - fromTvdM) / overMdM));
  }),
});

export const boostSweep = (boosts = [0.5, 0.8, 1, 1.2, 1.5, 2], over = {}) => boosts.map((boostFactor) => {
  const r = cdpFor({ ...over, boostFactor });
  return { boostFactor, governingMdM: r.governing.mdM, governingCdpPa: r.governing.cdpPa };
});

/** The boost at which the governing margin is exactly zero. Bisection: the
 *  margin RISES with boost, because a stronger rock lowers the critical pwf. */
export const boostAtZeroMargin = (over = {}) => {
  const gov = (boostFactor) => cdpFor({ ...over, boostFactor }).governing.cdpPa;
  let lo = 0.1;
  let hi = 4;
  while (gov(lo) > 0) lo /= 2;
  while (gov(hi) < 0) hi *= 2;
  for (let i = 0; i < 200; i += 1) {
    const mid = (lo + hi) / 2;
    if (gov(mid) < 0) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
};

// ---------------------------------------------------------------------------
// Verification against the published oracle.
// ---------------------------------------------------------------------------

export const oracleCheck = () => {
  let worst = 0;
  let checked = 0;
  const cmp = (a, b) => {
    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return;
    checked += 1;
    worst = Math.max(worst, Math.abs(a - b) / Math.abs(b));
  };
  for (const g of cases.guns) {
    const s = skinOf(g.inputs);
    for (const k of ['sH', 'sV', 'sWb', 'sCz', 'total', 'rwPrimeM', 'hM', 'hD', 'rpD', 'a', 'b', 'rwD']) {
      cmp(s[k], g.expected.skin[k]);
    }
    cmp(prOf(s.total).ratio, g.expected.pr.ratio);
    cmp(prOf(s.total).lnReRw, g.expected.pr.lnReRw);
  }
  const st = publishedStats();
  for (const k of ['d10M', 'd40M', 'd50M', 'd70M', 'd90M', 'd95M', 'uniformity', 'sorting', 'finesPct']) {
    cmp(st[k], cases.sieve.expected[k]);
  }
  const sa = saucierGravel({ d50M: st.d50M });
  cmp(sa.bandMinM, cases.gravel.expected.bandMinM);
  cmp(sa.bandMaxM, cases.gravel.expected.bandMaxM);
  for (const fluid of ['oil', 'gas']) {
    const u = underbalanceAdvice({ kMd: cases.underbalance.inputs.kMd, fluid });
    cmp(u.minPa, cases.underbalance[fluid].minPa);
    cmp(u.maxPa, cases.underbalance[fluid].maxPa);
  }
  for (const geometry of CAVITY_GEOMETRIES) {
    const r = cdpFor({ geometry });
    const exp = cases.sanding.cdp[geometry];
    r.rows.forEach((row, i) => {
      cmp(row.tvdM, exp.rows[i].tvdM);
      cmp(row.pwfCritPa, exp.rows[i].pwfCritPa);
      cmp(row.cdpPa, exp.rows[i].cdpPa);
    });
    cmp(r.governing.cdpPa, exp.governing.cdpPa);
  }
  const rg = cases.sanding.cdpRagged;
  const rr = cdpFor({ geometry: rg.geometry, stepMdM: rg.stepMdM });
  rr.rows.forEach((row, i) => { cmp(row.mdM, rg.rows[i].mdM); cmp(row.cdpPa, rg.rows[i].cdpPa); });
  const fx = cases.sanding.fixture;
  cmp(sandingOnset({ ...fx.inputs, s1Pa: fx.inputs.s1Pa, s2Pa: fx.inputs.s2Pa, ucsPa: fx.inputs.ucsPa }).pwfCritPa,
    fx.expected.pwfCritPa);
  return { checked, worstRel: worst };
};

// ---------------------------------------------------------------------------
// The capstone. A 9-7/8 inch hole, a charge the catalog does not carry, a
// phasing the published pair never uses, a new sand and a new interval, at a
// step that does NOT divide it.
// ---------------------------------------------------------------------------

export const CAPSTONE = {
  rwM: 4.9375 * IN,
  reM: 220,
  khOverKv: 6,
  kMd: 8,
  spfPerFt: 8,
  spfPerM: 8 / 0.3048,
  phasingDeg: 90,
  entranceHoleIn: 0.34,
  penetrationIn: 22,
  rcM: 0.6 * IN,
  kOverKc: 4,
  topMdM: 2200,
  bottomMdM: 2320,
  stepMdM: 25,
  geometry: 'openhole',
  boostFactor: 1.15,
  sieve: [[560, 2], [400, 7], [280, 19], [200, 36], [140, 54], [100, 70], [70, 83], [50, 92], [38, 96]],
};

export const capstoneSkin = () => karakasTariq({
  lpM: CAPSTONE.penetrationIn * IN,
  rpM: (CAPSTONE.entranceHoleIn * IN) / 2,
  spfPerM: CAPSTONE.spfPerM,
  phasingDeg: CAPSTONE.phasingDeg,
  rwM: CAPSTONE.rwM,
  khOverKv: CAPSTONE.khOverKv,
  rcM: CAPSTONE.rcM,
  kOverKc: CAPSTONE.kOverKc,
});
export const capstonePr = () => productivityRatio({
  reM: CAPSTONE.reM, rwM: CAPSTONE.rwM, sTotal: capstoneSkin().total,
});
export const capstoneStats = () => sieveStats(ptsOf(CAPSTONE.sieve));
export const capstonePack = () => packFor(capstoneStats().d50M);
export const capstoneCdp = (over = {}) => cdpFor({
  topMdM: CAPSTONE.topMdM, bottomMdM: CAPSTONE.bottomMdM, geometry: CAPSTONE.geometry,
  boostFactor: CAPSTONE.boostFactor, stepMdM: CAPSTONE.stepMdM, ...over,
});
export const capstoneBoostAtZero = () => boostAtZeroMargin({
  topMdM: CAPSTONE.topMdM, bottomMdM: CAPSTONE.bottomMdM,
  geometry: CAPSTONE.geometry, stepMdM: CAPSTONE.stepMdM,
});

export const capstoneValues = () => {
  const skin = capstoneSkin();
  const stats = capstoneStats();
  const pack = capstonePack();
  const cdp = capstoneCdp();
  return {
    spf_per_m: CAPSTONE.spfPerM,
    perf_spacing_m: skin.hM,
    d50_m: stats.d50M,
    d10_m: stats.d10M,
    uniformity: stats.uniformity,
    fines_pct: stats.finesPct,
    skin_h: skin.sH,
    skin_v: skin.sV,
    skin_cz: skin.sCz,
    skin_total: skin.total,
    productivity_ratio: capstonePr().ratio,
    rp_d: skin.rpD,
    gravel_band_min_m: pack.bandMinM,
    gauge_margin_m: pack.marginM,
    pwf_crit_pa: cdp.governing.pwfCritPa,
    cdp_governing_pa: cdp.governing.cdpPa,
    cdp_bottom_pa: cdp.rows[cdp.rows.length - 1].cdpPa,
    boost_at_zero_margin: capstoneBoostAtZero(),
  };
};
