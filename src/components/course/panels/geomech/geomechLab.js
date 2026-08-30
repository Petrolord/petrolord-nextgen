// Geomechanics teaching lab for the DR5 course (app 'geomech'). Pure functions
// over the vendored engines/drilling geomech module and its goldens; every
// exported value is pinned by geomechLab.test.js.
//
// One profile, two wells and one closed-form vertical fixture. The LESSONS run
// the PUBLISHED parameter set; the CAPSTONE runs a different Poisson ratio,
// friction angle, Young's modulus, tectonic strain pair, Biot coefficient,
// SHmax azimuth and tensile strength, so no graded value is a number a lesson
// printed and none of them is a number the goldens publish either.

import cases from '@petrolord/engines/test-data/drilling/goldens/geomech_cases.json';

import {
  LITHOLOGY_SEEDS, frictionalLimitRatio, horizontalStresses, ucsFromDt,
  boreholeFrame, farFieldInBoreholeFrame, wallStresses, wellboreStability,
  mudWindowAlongWell, qualityScore,
} from '@petrolord/engines/engines/drilling/geomech.js';

export {
  LITHOLOGY_SEEDS, frictionalLimitRatio, ucsFromDt, boreholeFrame,
  farFieldInBoreholeFrame, wallStresses, qualityScore,
};

export const G = 9.80665;

// The published parameter set the lessons run on.
export const PARAMS = cases.params;
// The depth-indexed inputs: TVD, overburden, pore pressure, sonic and the
// published UCS the profile carries.
export const PROFILE = cases.profile;
// The two wells, which are the same two DR1 through DR4 use.
export const WELLS = cases.cases.map((c) => ({ id: c.well, stations: c.stations, expected: c.expected }));
export const caseOf = (id = 'slant') => {
  const c = cases.cases.find((x) => x.well === id);
  if (!c) throw new Error(`Unknown geomech case '${id}'.`);
  return c;
};

// ---------------------------------------------------------------------------
// The 1D mechanical earth model.
// ---------------------------------------------------------------------------

// Horizontal stresses from the uniaxial poroelastic estimate, clamped to the
// Andersonian frictional bounds. `over` replaces any published parameter.
export const stresses = (over = {}) => {
  const p = { ...PARAMS, ...over };
  return horizontalStresses({
    svPa: PROFILE.svPa, ppPa: PROFILE.ppPa, nu: p.nu, alphaBiot: p.alphaBiot,
    ePa: p.ePa, epsX: p.epsX, epsY: p.epsY,
    frictionAngleDeg: p.frictionAngleDeg, regime: p.regime,
  });
};

// Everything the model holds at one true vertical depth, as pressures and as
// equivalent mud weights. Depth must be a profile sample.
export const atDepth = (tvdM, over = {}) => {
  const i = PROFILE.tvdM.indexOf(tvdM);
  if (i < 0) throw new Error(`TVD ${tvdM} is not a profile sample.`);
  const s = stresses(over);
  const emw = (v) => v / (G * tvdM);
  return {
    tvdM,
    svPa: PROFILE.svPa[i], ppPa: PROFILE.ppPa[i],
    shminPa: s.shminPa[i], shmaxPa: s.shmaxPa[i],
    dtUsPerM: PROFILE.dtUsPerM[i], ucsPa: PROFILE.ucsPa[i],
    svEmw: emw(PROFILE.svPa[i]), ppEmw: emw(PROFILE.ppPa[i]),
    shminEmw: emw(s.shminPa[i]), shmaxEmw: emw(s.shmaxPa[i]),
    k0Used: s.k0Used, clampedCount: s.clampedCount,
  };
};

// The samples whose stress ordering breaks the stated faulting regime, with
// the reason. This is a property of the model rather than of the engine, and
// Associate m05 is built on it.
export const orderingViolations = (over = {}) => {
  const p = { ...PARAMS, ...over };
  const s = stresses(over);
  const out = [];
  for (let i = 0; i < PROFILE.tvdM.length; i += 1) {
    const sv = PROFILE.svPa[i];
    const reasons = [];
    if (s.shmaxPa[i] < s.shminPa[i] - 1) reasons.push('shmax below shmin');
    if (p.regime === 'NF' && sv < s.shmaxPa[i] - 1) reasons.push('overburden below shmax');
    if (p.regime === 'TF' && s.shminPa[i] < sv - 1) reasons.push('shmin below overburden');
    if (PROFILE.ppPa[i] > s.shminPa[i] + 1) reasons.push('pore pressure above shmin');
    if (reasons.length) out.push({ tvdM: PROFILE.tvdM[i], reasons });
  }
  return out;
};

// ---------------------------------------------------------------------------
// Stability at one depth.
// ---------------------------------------------------------------------------

// The Kirsch/Mohr-Coulomb solve at one depth for one hole attitude. `ucsPa`
// defaults to the profile's own published UCS at that depth.
export const stability = (tvdM, { incDeg = 0, aziDeg = 0, ucsPa = null, over = {} } = {}) => {
  const a = atDepth(tvdM, over);
  const p = { ...PARAMS, ...over };
  const r = wellboreStability({
    svPa: a.svPa, shmaxPa: a.shmaxPa, shminPa: a.shminPa, ppPa: a.ppPa,
    ucsPa: ucsPa ?? a.ucsPa,
    shmaxAzimuthDeg: p.shmaxAzimuthDeg, incDeg, aziDeg,
    frictionAngleDeg: p.frictionAngleDeg, nu: p.nu,
    tensileStrengthPa: p.tensileStrengthPa, alphaBiot: p.alphaBiot,
  });
  const den = G * tvdM;
  return {
    ...r,
    collapseEmw: r.collapsePa / den,
    fracInitEmw: r.fracInitPa / den,
    widthEmw: (r.fracInitPa - r.collapsePa) / den,
    ppEmw: a.ppEmw,
  };
};

// The window as a function of hole attitude at one depth, which is the whole
// argument for drilling toward the minimum horizontal stress.
export const attitudeSweep = (tvdM, {
  incs = [0, 30, 60, 90], azis = [0, 60, 150], ucsPa = null, over = {},
} = {}) => {
  const rows = [];
  for (const incDeg of incs) {
    for (const aziDeg of azis) {
      const s = stability(tvdM, { incDeg, aziDeg, ucsPa, over });
      rows.push({ incDeg, aziDeg, collapseEmw: s.collapseEmw, fracInitEmw: s.fracInitEmw,
        widthEmw: s.widthEmw, breakoutThetaDeg: s.breakoutThetaDeg });
    }
  }
  return rows;
};

// ---------------------------------------------------------------------------
// The mud window along a trajectory.
// ---------------------------------------------------------------------------

export const window_ = (id = 'slant', over = {}) => {
  const c = caseOf(id);
  const s = stresses(over);
  const w = mudWindowAlongWell({
    stations: c.stations,
    profile: { ...PROFILE, shminPa: s.shminPa, shmaxPa: s.shmaxPa },
    params: { ...PARAMS, ...over },
  });
  const tight = w.rows.find((r) => r.md === w.tightest.md);
  return { ...w, tightRow: tight, boundAtTightest: tight.ppEmwKgM3 > tight.collapseEmwKgM3 ? 'pore pressure' : 'collapse' };
};

// Verification against the published oracle: the horizontal stresses, both
// wells' row counts and both tightest points.
export const oracleCheck = () => {
  let worst = 0;
  let at = null;
  let checked = 0;
  const cmp = (got, want, what) => {
    if (want == null || !Number.isFinite(got)) return;
    checked += 1;
    const rel = Math.abs(got - want) / Math.abs(want || 1);
    if (rel > worst) { worst = rel; at = { what, got, want }; }
  };
  const s = stresses();
  for (let i = 0; i < PROFILE.tvdM.length; i += 1) {
    cmp(s.shminPa[i], PROFILE.shminPa[i], `shmin[${i}]`);
    cmp(s.shmaxPa[i], PROFILE.shmaxPa[i], `shmax[${i}]`);
  }
  for (const c of cases.cases) {
    const w = window_(c.well);
    cmp(w.rows.length, c.expected.nRows, `${c.well}.nRows`);
    cmp(w.tightest.md, c.expected.tightestMd, `${c.well}.tightestMd`);
    cmp(w.tightest.widthKgM3, c.expected.tightestWidthKgM3, `${c.well}.tightestWidth`);
    for (const cp of c.expected.checkpoints) {
      const r = w.rows.find((x) => Math.abs(x.md - cp.md) < 1e-9);
      if (!r) continue;
      cmp(r.tvd, cp.tvd, `${c.well}.cp${cp.md}.tvd`);
      cmp(r.collapseEmwKgM3, cp.collapseEmwKgM3, `${c.well}.cp${cp.md}.collapse`);
      cmp(r.fracInitEmwKgM3, cp.fracInitEmwKgM3, `${c.well}.cp${cp.md}.frac`);
    }
  }
  return { checked, worstRel: worst, at };
};

// The one case in this course a third party can check by hand: a vertical well
// in a normal-faulting field, where both criteria reduce to closed forms.
export const VERTICAL = cases.verticalFixture;

export const verticalCheck = () => {
  const i = VERTICAL.inputs;
  const r = wellboreStability(i);
  // Closed forms for a VERTICAL well, where the hoop stress is the only wall
  // stress that varies with theta and the axis simply carries Sv. Working in
  // EFFECTIVE stresses, SH = SHmax - alpha*Pp and Sh = Shmin - alpha*Pp:
  //   the hoop stress runs from 3*Sh - SH at the SHmax azimuth up to
  //   3*SH - Sh a quarter turn away, which is where a breakout forms.
  //   collapse: Pw = Pp + (3*SH - Sh - UCS) / (1 + q), because raising Pw by
  //             one unit lowers the largest principal wall stress by one and
  //             raises the smallest by one, closing the gap at 1 + q per unit.
  //   fracture: Pw = Pp + (3*Sh - SH) + T0, the pressure that drives the least
  //             hoop stress down to minus the tensile strength.
  const q = frictionalLimitRatio(i.frictionAngleDeg);
  const sH = i.shmaxPa - i.alphaBiot * i.ppPa;
  const sh = i.shminPa - i.alphaBiot * i.ppPa;
  const closedCollapse = i.ppPa + (3 * sH - sh - i.ucsPa) / (1 + q);
  const closedFrac = i.ppPa + (3 * sh - sH) + i.tensileStrengthPa;
  return {
    inputs: i, engine: r, published: VERTICAL.expected,
    closedCollapsePa: closedCollapse, closedFracPa: closedFrac,
    collapseErrPa: r.collapsePa - closedCollapse,
    fracErrPa: r.fracInitPa - closedFrac,
  };
};

// ---------------------------------------------------------------------------
// The capstone's own parameters, and the eighteen graded values.
// ---------------------------------------------------------------------------

// Not one of these is a published parameter.
export const CAPSTONE_PARAMS = {
  nu: 0.24, frictionAngleDeg: 26, ePa: 18e9, epsX: 0.0002, epsY: 0.0005,
  alphaBiot: 0.9, shmaxAzimuthDeg: 105, tensileStrengthPa: 2.5e6, regime: 'NF',
};
export const CAPSTONE_DT_US_PER_M = 233;   // a core plug reading, not a profile sample
export const CAPSTONE_TVD_M = 2000;
export const CAPSTONE_INC_DEG = 55;
export const CAPSTONE_AZI_DEG = 130;

export const capstoneValues = () => {
  const over = CAPSTONE_PARAMS;
  const a = atDepth(CAPSTONE_TVD_M, over);
  const ucsH = ucsFromDt({ dtUsPerM: [CAPSTONE_DT_US_PER_M] }).ucsPa[0];
  const ucsM = ucsFromDt({ dtUsPerM: [CAPSTONE_DT_US_PER_M], correlation: 'mcnally' }).ucsPa[0];
  const st = stability(CAPSTONE_TVD_M, {
    incDeg: CAPSTONE_INC_DEG, aziDeg: CAPSTONE_AZI_DEG, ucsPa: ucsH, over,
  });
  const ws = window_('slant', over);
  const wh = window_('horizontal', over);
  return {
    k0_used: a.k0Used,
    frictional_limit_ratio: frictionalLimitRatio(over.frictionAngleDeg),
    shmin_at_2000m_Pa: a.shminPa,
    shmax_at_2000m_Pa: a.shmaxPa,
    ucs_horsrud_Pa: ucsH,
    ucs_mcnally_Pa: ucsM,
    collapse_Pa: st.collapsePa,
    frac_init_Pa: st.fracInitPa,
    breakout_theta_deg: st.breakoutThetaDeg,
    collapse_emw_kgm3: st.collapseEmw,
    frac_init_emw_kgm3: st.fracInitEmw,
    window_width_emw_kgm3: st.widthEmw,
    slant_tightest_width_kgm3: ws.tightest.widthKgM3,
    slant_collapse_emw_at_tightest_kgm3: ws.tightRow.collapseEmwKgM3,
    slant_frac_init_emw_at_tightest_kgm3: ws.tightRow.fracInitEmwKgM3,
    horizontal_tightest_width_kgm3: wh.tightest.widthKgM3,
    horizontal_collapse_emw_at_tightest_kgm3: wh.tightRow.collapseEmwKgM3,
    horizontal_frac_init_emw_at_tightest_kgm3: wh.tightRow.fracInitEmwKgM3,
  };
};
