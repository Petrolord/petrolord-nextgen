// Well design teaching lab for the DR1 course (app 'welldesign'). Pure
// functions over the vendored engines/drilling and its goldens; every
// exported value is pinned by welldesignLab.test.js against DR1-TRUTH.md,
// which was derived by running the same engine outside this app.
//
// This course runs on PUBLISHED references rather than planted fixtures:
// the Applied Drilling Engineering chapter 8 survey example, the ISCWSA MWD
// Rev4 error-model validation well, the ISCWSA standard clearance wells, and
// NOAA's own test values for WMM2025. Where the engine agrees with them, the
// agreement is checkable by anyone with the papers.

import surveyTable from '@petrolord/engines/test-data/drilling/goldens/survey_table.json';
import adeCh8 from '@petrolord/engines/test-data/drilling/goldens/ade_ch8_survey_methods.json';
import buildHold from '@petrolord/engines/test-data/drilling/goldens/compile_buildhold.json';
import sProfile from '@petrolord/engines/test-data/drilling/goldens/sprofile_cases.json';
import tvdCrossings from '@petrolord/engines/test-data/drilling/goldens/tvd_crossings.json';
import toolfaceSphere from '@petrolord/engines/test-data/drilling/goldens/toolface_sphere.json';
import iscwsaWell1 from '@petrolord/engines/test-data/drilling/goldens/iscwsa_mwd_rev4_well1.json';
import clearanceWells from '@petrolord/engines/test-data/drilling/goldens/iscwsa_clearance_wells.json';
import wmmTest from '@petrolord/engines/test-data/drilling/goldens/wmm2025_noaa_testvalues.json';

import {
  computeSurveyTable, computeWellPath, mdsAtTvd, doglegSeverity, normalizeAzi,
} from '@petrolord/engines/engines/drilling/surveyMath.js';
import { compileSegments } from '@petrolord/engines/engines/drilling/segmentCompiler.js';
import { solveSProfile, solveSlant, toolfaceForTarget } from '@petrolord/engines/engines/drilling/profileDesign.js';
import {
  computeErrorModel, hlaSigmas, horizontalEllipse,
} from '@petrolord/engines/engines/drilling/errorModel.js';
import { computeClearance, classifyClearance } from '@petrolord/engines/engines/drilling/antiCollision.js';
import { fieldAt } from '@petrolord/engines/engines/drilling/magnetics.js';

const DEG = Math.PI / 180;

// ---------------------------------------------------------------------------
// The two golden wells, and the survey listing a directional driller reads.
// ---------------------------------------------------------------------------

export const GOLDEN_WELLS = [
  { id: 'feet', label: 'The feet well', mdUnit: 'ft' },
  { id: 'metric', label: 'The metric well', mdUnit: 'm' },
];

const stationsOf = (g) => g.stations.map(([md, inc, azi]) => ({ md, inc, azi }));

/** The full Compass-style listing for one golden well. */
export const surveyListing = (id = 'feet') => {
  const g = surveyTable[id];
  const stations = stationsOf(g);
  const rows = computeSurveyTable(stations, { mdUnit: g.mdUnit, vsAzimuthDeg: g.vsAzimuthDeg });
  const last = rows[rows.length - 1];
  return {
    id, mdUnit: g.mdUnit, vsAzimuthDeg: g.vsAzimuthDeg, rows,
    totalMd: last.md, tvd: last.tvd, n: last.n, e: last.e, vs: last.vs,
    closureDist: last.closureDist, closureAzi: last.closureAzi,
    maxDls30m: Math.max(...rows.map((r) => r.dls30m)),
    maxDls100ft: Math.max(...rows.map((r) => r.dls100ft)),
  };
};

// ---------------------------------------------------------------------------
// The survey methods, on the Applied Drilling Engineering chapter 8 example.
// The engine implements minimum curvature only; the others are computed here
// so the course can show what they cost on the same survey rather than
// asserting it.
// ---------------------------------------------------------------------------

export const ADE_PUBLISHED = {
  minimumCurvature: adeCh8.expected.minimumCurvature,
  tolerance: adeCh8.expected.tolerance,
  description: adeCh8.description,
};

export const surveyMethods = () => {
  const st = adeCh8.survey.md.map((md, i) => ({ md, inc: adeCh8.survey.inc[i], azi: adeCh8.survey.azi[i] }));
  const rows = computeSurveyTable(st, { mdUnit: adeCh8.mdUnit });
  const last = rows[rows.length - 1];
  let tanTvd = 0; let tanN = 0; let balTvd = 0; let balN = 0;
  for (let i = 1; i < st.length; i += 1) {
    const d = st[i].md - st[i - 1].md;
    const i1 = st[i - 1].inc * DEG; const i2 = st[i].inc * DEG;
    const a1 = st[i - 1].azi * DEG; const a2 = st[i].azi * DEG;
    tanTvd += d * Math.cos(i2);
    tanN += d * Math.sin(i2) * Math.cos(a2);
    balTvd += (d / 2) * (Math.cos(i1) + Math.cos(i2));
    balN += (d / 2) * (Math.sin(i1) * Math.cos(a1) + Math.sin(i2) * Math.cos(a2));
  }
  const pub = adeCh8.expected.minimumCurvature;
  return {
    stations: st.length, finalMd: last.md, finalInc: last.inc, dls100ft: last.dls100ft,
    methods: [
      { name: 'Minimum curvature', tvd: last.tvd, north: last.n,
        tvdError: last.tvd - pub.tvd, northError: last.n - pub.northDisplacement, implemented: true },
      { name: 'Balanced tangential', tvd: balTvd, north: balN,
        tvdError: balTvd - pub.tvd, northError: balN - pub.northDisplacement, implemented: false },
      { name: 'Tangential', tvd: tanTvd, north: tanN,
        tvdError: tanTvd - pub.tvd, northError: tanN - pub.northDisplacement, implemented: false },
    ],
    published: pub,
  };
};

// ---------------------------------------------------------------------------
// Trajectory design and compilation.
// ---------------------------------------------------------------------------

/** Compile a kick-off, build and hold from a design, the way a planner does. */
export const buildHoldCase = (index = 0, override = {}) => {
  const c = { ...buildHold.cases[index], ...override };
  const r = compileSegments({
    tieOn: { md: 0, inc: 0, azi: c.aziDeg },
    segments: [
      { kind: 'hold', length: c.kop },
      { kind: 'build', rate: c.rate, targetInc: c.targetInc },
      { kind: 'hold', length: c.holdLen },
    ],
    mdUnit: c.mdUnit,
  });
  const last = r.table[r.table.length - 1];
  return {
    design: { kop: c.kop, rate: c.rate, targetInc: c.targetInc, holdLen: c.holdLen, aziDeg: c.aziDeg, mdUnit: c.mdUnit },
    published: { endMd: c.endMd, endTvd: c.endTvd, endN: c.endN, endE: c.endE, buildLen: c.buildLen },
    end: { md: last.md, inc: last.inc, tvd: last.tvd, n: last.n, e: last.e, vs: last.vs },
    qa: r.qa, segments: r.segments, table: r.table,
    buildLen: r.segments[1].toMd - r.segments[1].fromMd,
  };
};

/** The S-profile solver on its published design cases. */
export const sProfileCase = (index = 0) => {
  const c = sProfile.cases[index];
  const r = solveSProfile({
    kopLen: c.kopLen, buildRate: c.buildRate, dropRate: c.dropRate,
    finalIncDeg: c.finalIncDeg ?? 0, target: c.target, mdUnit: c.mdUnit ?? 'm',
  });
  return { input: c, feasible: r.feasible, report: r.report || null, error: r.error || null,
    published: c.expected };
};
export const S_PROFILE_COUNT = sProfile.cases.length;

/** A build-hold solved from a displacement target rather than a design. */
export const slantToTarget = ({ dN, dE, dTvd, buildRate, mdUnit = 'm' }) =>
  solveSlant({ tieOn: { inc: 0, azi: null }, target: { dN, dE, dTvd }, buildRate, mdUnit });

/** Toolface and dogleg between two attitudes, against the spherical goldens. */
export const toolfaceCases = () => toolfaceSphere.cases.map((c) => {
  const got = toolfaceForTarget({ inc: c.inc1, azi: c.azi1 }, { inc: c.inc2, azi: c.azi2 });
  const tfErr = Math.abs(got.toolfaceDeg - c.toolfaceDeg);
  return {
    from: { inc: c.inc1, azi: c.azi1 }, to: { inc: c.inc2, azi: c.azi2 },
    publishedToolface: c.toolfaceDeg, publishedDogleg: c.betaDeg,
    toolfaceDeg: got.toolfaceDeg, doglegDeg: got.doglegDeg,
    toolfaceError: Math.min(tfErr, 360 - tfErr), doglegError: Math.abs(got.doglegDeg - c.betaDeg),
  };
});

/** Where the well crosses a TVD plane, which is how a target is picked up. */
export const tvdCrossingCases = () => {
  const st = tvdCrossings.stations.map(([md, inc, azi]) => ({ md, inc, azi }));
  const path = computeWellPath(st, {});
  return {
    stations: st.length, totalMd: st[st.length - 1].md, finalTvd: path[path.length - 1].tvd,
    cases: tvdCrossings.cases.map((c) => ({
      tvd: c.tvd, published: c.mds, mds: mdsAtTvd(st, path, c.tvd),
    })),
  };
};

/** Dogleg severity between two attitudes, in both industry conventions. */
export const dls = (s1, s2, mdUnit = 'm') => doglegSeverity(s1, s2, { mdUnit });

// ---------------------------------------------------------------------------
// Position uncertainty: the ISCWSA MWD Rev4 validation well.
// ---------------------------------------------------------------------------

const well1Stations = () => iscwsaWell1.survey.md.map((md, i) => ({
  md, inc: iscwsaWell1.survey.inc[i], azi: iscwsaWell1.survey.azi[i],
}));

let _well1;
const well1 = () => {
  if (!_well1) {
    _well1 = computeErrorModel(well1Stations(), iscwsaWell1.header, { model: 'ISCWSA MWD Rev4' });
  }
  return _well1;
};

export const WELL1_HEADER = iscwsaWell1.header;

/** The model's state at one station index, or at the deepest one. */
export const uncertaintyAt = (index = null) => {
  const m = well1();
  const i = index == null ? m.md.length - 1 : Math.max(0, Math.min(m.md.length - 1, index));
  const cov = m.totalCov[i];
  const sig = hlaSigmas(m.incRad[i], m.aziTrueRad[i], cov);
  const contributions = m.sources.map((s) => {
    const c = s.covNEV[i];
    return { code: s.code, propagation: s.propagation, depthOnly: s.depthOnly,
      trace: c[0][0] + c[1][1] + c[2][2], nn: c[0][0], ee: c[1][1], vv: c[2][2] };
  }).sort((a, b) => b.trace - a.trace);
  const totalTrace = contributions.reduce((a, c) => a + c.trace, 0);
  return {
    index: i, md: m.md[i], tvd: m.tvd[i],
    incDeg: m.incRad[i] / DEG, aziDeg: m.aziTrueRad[i] / DEG,
    cov, sigmaH: sig.sigmaH, sigmaL: sig.sigmaL, sigmaA: sig.sigmaA,
    ellipse1: horizontalEllipse(cov, { k: 1 }),
    ellipse95: horizontalEllipse(cov, { k: 2.7955 }),
    contributions: contributions.map((c) => ({ ...c, shareOfTrace: c.trace / totalTrace })),
    totalTrace,
    stationCount: m.md.length,
  };
};

export const well1Stations_ = () => well1().md;

/** Every published per-source workbook value, checked against the engine. */
export const workbookCheck = () => {
  const m = well1();
  const nearest = (md) => {
    let best = 0;
    for (let i = 0; i < m.md.length; i += 1) {
      if (Math.abs(m.md[i] - md) < Math.abs(m.md[best] - md)) best = i;
    }
    return best;
  };
  let worst = { rel: 0 };
  let rows = 0;
  for (const r of iscwsaWell1.perSource) {
    if (r.source === 'Totals') continue;
    const s = m.sources.find((x) => x.code === r.source);
    if (!s) return { missing: r.source };
    const i = nearest(r.md);
    rows += 1;
    for (const [key, a, b] of [['nn', 0, 0], ['ee', 1, 1], ['vv', 2, 2], ['ne', 0, 1], ['nv', 0, 2], ['ev', 1, 2]]) {
      const rel = Math.abs(s.covNEV[i][a][b] - r[key]) / Math.max(Math.abs(r[key]), 1e-9);
      if (rel > worst.rel) worst = { rel, source: r.source, md: r.md, key };
    }
  }
  const L = m.md.length - 1;
  const P = iscwsaWell1.totalsAll.nn.length - 1;
  return {
    rows, worst,
    totals: {
      publishedNN: iscwsaWell1.totalsAll.nn[P], engineNN: m.totalCov[L][0][0],
      publishedEE: iscwsaWell1.totalsAll.ee[P], engineEE: m.totalCov[L][1][1],
      publishedVV: iscwsaWell1.totalsAll.vv[P], engineVV: m.totalCov[L][2][2],
      maxRel: Math.max(...['nn', 'ee', 'vv'].map((k, i) => {
        const pub = iscwsaWell1.totalsAll[k][P];
        return Math.abs(m.totalCov[L][i][i] - pub) / Math.max(Math.abs(pub), 1e-12);
      })),
    },
  };
};

// ---------------------------------------------------------------------------
// Anti-collision: the ISCWSA standard clearance example wells.
// ---------------------------------------------------------------------------

export const CLEARANCE_PARAMS = clearanceWells.acr;
export const OFFSET_WELLS = Object.keys(clearanceWells.oracle);

const _built = new Map();
const buildWell = (name) => {
  if (!_built.has(name)) {
    const w = clearanceWells.wells[name];
    const stations = w.md.map((md, i) => ({ md, inc: w.inc[i], azi: w.azi[i] }));
    const em = computeErrorModel(stations, w.header, { model: 'ISCWSA MWD Rev4' });
    _built.set(name, {
      stations,
      positions: w.md.map((_, i) => ({ n: w.n[i], e: w.e[i], tvd: w.tvd[i] })),
      cov: em.totalCov, sources: em.sources, radius: null,
    });
  }
  return _built.get(name);
};

/** Clearance of one offset against the reference, at stated assumptions. */
export const clearanceCase = (well, opts = {}) => {
  const o = clearanceWells.oracle[well];
  if (!o) return null;
  const p = clearanceWells.acr;
  const res = computeClearance(
    { ...buildWell('Reference well'), radius: p.refRadius },
    { ...buildWell(well), radius: p.offRadius },
    { k: p.k, sigmaPa: p.sigmaPa, Sm: p.Sm, kopDepth: o.kopDepth ?? null, ...opts },
  );
  const minSf = Math.min(...res.sf);
  const published = o.sf;
  const worstRel = Math.max(...res.sf.map((v, i) => (published[i] == null ? 0
    : Math.abs(v - published[i]) / Math.max(Math.abs(published[i]), 1e-9))));
  return {
    well, kopDepth: o.kopDepth ?? null, opts,
    md: res.md, sf: res.sf, distanceCC: res.distanceCC,
    minSf, publishedMinSf: Math.min(...published.filter((v) => v != null)),
    worstRelError: worstRel,
    classification: classifyClearance({ ...res, summary: { minSf } }),
  };
};

/** What the separation factor moves with, on one pair. */
export const clearanceSensitivity = (well = '10 - well') => {
  const p = clearanceWells.acr;
  const sweep = [
    ['published assumptions', {}],
    ['confidence factor k 2.0', { k: 2.0 }],
    ['confidence factor k 5.0', { k: 5.0 }],
    ['surface position error 1.0 m', { sigmaPa: 1.0 }],
    ['no tool projection allowance', { Sm: 0 }],
  ].map(([label, opts]) => ({ label, opts, minSf: clearanceCase(well, opts).minSf }));
  return { well, base: p, sweep, kRatio: sweep[2].minSf / sweep[1].minSf };
};

// ---------------------------------------------------------------------------
// The geomagnetic reference.
// ---------------------------------------------------------------------------

export const WMM_SOURCE = wmmTest.source;

export const magneticFieldAt = ({ latDeg, lonDeg, heightKm = 0, decimalYear = 2025 }) =>
  fieldAt({ latDeg, lonDeg, heightKm, decimalYear });

export const wmmCheck = () => {
  const rows = wmmTest.mainField.map((p) => {
    const f = fieldAt({ latDeg: p.latDeg, lonDeg: p.lonDeg, heightKm: p.heightKm, decimalYear: p.date });
    return {
      date: p.date, latDeg: p.latDeg, lonDeg: p.lonDeg, heightKm: p.heightKm,
      publishedD: p.d, declinationDeg: f.declinationDeg,
      publishedI: p.i, inclinationDeg: f.inclinationDeg,
      publishedF: p.f, totalNT: f.f,
      dError: Math.abs(f.declinationDeg - p.d),
      iError: Math.abs(f.inclinationDeg - p.i),
      fError: Math.abs(f.f - p.f),
    };
  });
  return {
    rows,
    maxDeclinationError: Math.max(...rows.map((r) => r.dError)),
    maxInclinationError: Math.max(...rows.map((r) => r.iError)),
    maxTotalFieldError: Math.max(...rows.map((r) => r.fError)),
  };
};

export const azimuthConversion = ({ magneticAzi, declinationDeg, convergenceDeg = 0 }) => ({
  magnetic: normalizeAzi(magneticAzi),
  true: normalizeAzi(magneticAzi + declinationDeg),
  grid: normalizeAzi(magneticAzi + declinationDeg - convergenceDeg),
});

// ---------------------------------------------------------------------------
// The eighteen graded values, computed rather than transcribed.
// ---------------------------------------------------------------------------

export const capstoneValues = () => {
  const m = surveyMethods();
  const ft = surveyListing('feet');
  const me = surveyListing('metric');
  const bh = buildHoldCase(0);
  const u = uncertaintyAt();
  const amil = u.contributions.find((c) => c.code === 'AMIL');
  const w = wmmCheck();
  return {
    beginner: {
      ade_mincurve_tvd: m.methods[0].tvd,
      ade_tangential_tvd_error: m.methods[2].tvdError,
      golden_ft_tvd: ft.tvd,
      golden_ft_vertical_section: ft.vs,
      golden_m_north: me.n,
      buildhold_end_tvd: bh.end.tvd,
    },
    intermediate: {
      well1_cov_nn: u.cov[0][0],
      well1_sigma_lateral: u.sigmaL,
      well1_sigma_highside: u.sigmaH,
      well1_ellipse95_semimajor: u.ellipse95.semiMajor,
      well1_ellipse_azimuth_deg: u.ellipse1.azimuthDeg,
      well1_amil_share_pct: 100 * amil.shareOfTrace,
    },
    advanced: {
      well01_min_sf: clearanceCase('01 - well').minSf,
      well09_min_sf: clearanceCase('09 - well').minSf,
      well10_min_sf: clearanceCase('10 - well').minSf,
      well10_min_sf_at_k5: clearanceCase('10 - well', { k: 5.0 }).minSf,
      wmm_max_declination_error_deg: w.maxDeclinationError,
      wmm_declination_at_80n_0e: magneticFieldAt({ latDeg: 80, lonDeg: 0 }).declinationDeg,
    },
  };
};
