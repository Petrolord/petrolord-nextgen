// W6 transfer case for the geomech finals: OSOBA-5.
//
// A sandstone well that no lesson, module question or capstone works. Its
// mechanical earth model is new (overburden gradient 2250 kg/m3, a pore
// pressure ramp from 1900 m, a sonic trend read through McNally rather than
// Horsrud) and so is its parameter set (Poisson 0.30, friction angle 34 deg,
// E 20 GPa, strains 0.00015 / 0.0004, Biot 0.95, SHmax azimuth 20 deg,
// tensile 1.5 MPa) and its trajectory (vertical to a 1800 m kick-off, building
// 2.5 deg per 30 m to 55 deg on a planned azimuth of 110, or an alternative of
// 020). Every figure a W6 item prints is computed here through the VENDORED
// engine (packages/engines/engines/drilling/geomech.js), including the wrong
// methods the distractors carry: those run the same engine functions with the
// wrong input wherever the engine can, and where it has no export for the
// wrong method the line says how the figure was derived from engine outputs.
//
// Run: node_modules/.bin/vite-node -c vitest.config.js tools/finals-transfer/geomech/case.mjs
import {
  frictionalLimitRatio, horizontalStresses, ucsFromDt, wellboreStability,
  mudWindowAlongWell, qualityScore, farFieldInBoreholeFrame, wallStresses,
} from '@petrolord/engines/engines/drilling/geomech.js';

const G = 9.80665;
const values = {};
const print = {};
const put = (k, v, s) => { values[k] = v; print[k] = s; };
const mpa = (k, pa) => put(k, pa, (pa / 1e6).toFixed(2));
const kg = (k, v) => put(k, v, v.toFixed(1));
const r4 = (k, v) => put(k, v, v.toFixed(4));

// ------------------------------------------------------------------ the case
const P = {
  nu: 0.30, frictionAngleDeg: 34, ePa: 20e9, epsX: 0.00015, epsY: 0.0004,
  alphaBiot: 0.95, shmaxAzimuthDeg: 20, tensileStrengthPa: 1.5e6, regime: 'NF',
};
const SV_GRAD = 2250;
const PP_HYDRO = 1035;
const PP_RAMP_TOP = 1900;
const PP_BOTTOM = 1290;
const TVD_TOP = 50;
const TVD_BOTTOM = 3500;
const DT_TOP = 540;
const DT_BOTTOM = 165;
const KOP_MD = 1800;
const BUILD_DEG_PER_30M = 2.5;
const HOLD_INC = 55;
const TD_MD = 3600;
const AZ_PLAN = 110;
const AZ_ALT = 20;

const tvd = [];
for (let z = TVD_TOP; z <= TVD_BOTTOM; z += 50) tvd.push(z);
const ppEmw = (z) => (z <= PP_RAMP_TOP ? PP_HYDRO
  : PP_HYDRO + ((PP_BOTTOM - PP_HYDRO) * (z - PP_RAMP_TOP)) / (TVD_BOTTOM - PP_RAMP_TOP));
const sv = tvd.map((z) => SV_GRAD * G * z);
const pp = tvd.map((z) => ppEmw(z) * G * z);
const dt = tvd.map((z) => DT_TOP + ((DT_BOTTOM - DT_TOP) * (z - TVD_TOP)) / (TVD_BOTTOM - TVD_TOP));
const ucs = ucsFromDt({ dtUsPerM: dt, correlation: 'mcnally' }).ucsPa;
const stressesWith = (over = {}) => horizontalStresses({ svPa: sv, ppPa: pp, ...P, ...over });
const HS = stressesWith();
const at = (z) => tvd.indexOf(z);

const inputs = {
  case: 'OSOBA-5', lithology: 'sandstone',
  overburdenGradientKgM3: SV_GRAD, ppHydrostaticKgM3: PP_HYDRO, ppRampTopM: PP_RAMP_TOP,
  ppAtBottomKgM3: PP_BOTTOM, profileTopM: TVD_TOP, profileBottomM: TVD_BOTTOM, profileStepM: 50,
  profileSamples: tvd.length, sonicTopUsPerM: DT_TOP, sonicBottomUsPerM: DT_BOTTOM,
  ucsCorrelation: 'McNally', mcnallyIntercept: '1200', mcnallyExponent: '0.036', ftPerM: '0.3048',
  nu: '0.30', frictionAngleDeg: P.frictionAngleDeg, ePa: '20000000000', eGPa: 20,
  epsX: '0.00015', epsY: '0.0004', alphaBiot: '0.95', shmaxAzimuthDeg: P.shmaxAzimuthDeg,
  tensileStrengthPa: '1500000', tensileStrengthMPa: '1.5', regime: 'NF', g: '9.80665',
  kopMd: KOP_MD, buildDegPer30m: '2.5', holdIncDeg: HOLD_INC, tdMd: TD_MD, stepMdM: 30,
  azPlan: AZ_PLAN, azAlt: '020', depthsM: [500, 1000, 1650, 2000, 2400, 2500, 3000],
  plugSonicUsPerM: [270, 440], inclinationsDeg: [30, 60, 90], nominalAzimuthDeg: 60,
  sweeps: { nu: ['0.22', '0.34'], frictionAngleDeg: [28, 40], tensileStrengthMPa: [0, 3], shmaxAzimuthDeg: 110 },
  mudPlan: { mudKgM3: 1350, ecdUpliftKgM3: 60, surgeKgM3: 90, swabKgM3: 70 },
};

// ------------------------------------------------------------------ beginner
// k0 and its wrong readings
const k0 = HS.k0Used;
r4('k0', k0);
r4('k0_over_one_plus', 0.30 / 1.30);          // nu/(1+nu): wrong denominator (derived from the case nu)
r4('k0_inverted', 1 / k0);                     // (1-nu)/nu: the ratio upside down (1 / engine k0)
r4('k0_shale_seed', stressesWith({ nu: 0.35 }).k0Used); // the shale seed's k0 in place of the logged 0.30

// q and its wrong readings
const q = frictionalLimitRatio(P.frictionAngleDeg);
r4('q', q);
r4('q_sqrt', Math.sqrt(q));                    // tan(45 + phi/2) left unsquared = sqrt of the engine q
r4('q30', frictionalLimitRatio(30));
r4('q_inverse', 1 / q);
r4('one_plus_q', 1 + q);
r4('two_q', 2 * q);

// SHmax less Shmin: constant with depth
const i1000 = at(1000); const i2500 = at(2500); const i2400 = at(2400); const i2000 = at(2000);
mpa('gap_1000', HS.shmaxPa[i1000] - HS.shminPa[i1000]);
mpa('gap_2500', HS.shmaxPa[i2500] - HS.shminPa[i2500]);
// wrong: E x (epsY - epsX), the Poisson factor dropped (the engine's strain terms at nu -> 0 limit
// are not exported, so this is E times the strain difference, both case inputs)
mpa('gap_no_poisson', P.ePa * (P.epsY - P.epsX));
// wrong: E/(1-nu^2) x (epsY - epsX), the (1 - nu) factor dropped: the engine's own gap divided by (1 - nu)
mpa('gap_no_one_minus_nu', (HS.shmaxPa[i1000] - HS.shminPa[i1000]) / (1 - P.nu));

// the 2400 m sample
const z24 = 2400;
mpa('sv2400', sv[i2400]); mpa('pp2400', pp[i2400]);
mpa('sh2400', HS.shminPa[i2400]); mpa('sH2400', HS.shmaxPa[i2400]);
kg('ppemw2400', pp[i2400] / (G * z24));
mpa('sh2400_biot1', stressesWith({ alphaBiot: 1 }).shminPa[i2400]);
mpa('sh2400_nostrain', stressesWith({ ePa: null }).shminPa[i2400]);
kg('sh2400_emw', HS.shminPa[i2400] / (G * z24));
kg('sh2400_emw_g10', HS.shminPa[i2400] / (10 * z24));
kg('sh2400_emw_at2500', HS.shminPa[i2400] / (G * 2500));
put('sh2400_gradient_nog', HS.shminPa[i2400] / z24, (HS.shminPa[i2400] / z24).toFixed(0)); // P / TVD with g left out, read as kg/m3
// frictional bounds at 2400 (the engine's clamp limits, from its own inputs)
const sveff2400 = sv[i2400] - P.alphaBiot * pp[i2400];
mpa('sveff2400', sveff2400);
mpa('sveff2400_biot1', sv[i2400] - pp[i2400]);
mpa('sveff2400_alpha_on_sv', P.alphaBiot * sv[i2400] - pp[i2400]);
mpa('sveff2400_pp_over_alpha', sv[i2400] - pp[i2400] / P.alphaBiot);
mpa('lower2400', sveff2400 / q + P.alphaBiot * pp[i2400]);
mpa('upper2400', sveff2400 * q + P.alphaBiot * pp[i2400]);
mpa('lower2400_total', sv[i2400] / q + P.alphaBiot * pp[i2400]);  // total Sv in place of the effective one
mpa('lower2400_times', sveff2400 * q);                              // q applied with no pore pressure added back
// the lower bound must not clamp Shmin at 2400: the engine's own clamp count there
values.clamped2400 = HS.shminPa[i2400] <= sveff2400 / q + P.alphaBiot * pp[i2400] + 1;
// pore pressure from its gradient
mpa('pp2400_g10', ppEmw(z24) * 10 * z24);
put('pp2400_nog', ppEmw(z24) * z24, (ppEmw(z24) * z24 / 1e6).toFixed(2)); // density x depth without g, in MPa
mpa('pp2400_hydro', PP_HYDRO * G * z24);

// ordering and quality
const qs = qualityScore({ svPa: sv, shmaxPa: HS.shmaxPa, shminPa: HS.shminPa, ppPa: pp, regime: 'NF' });
put('quality', qs.score, String(qs.score));
const viol = tvd.filter((z, i) => HS.shmaxPa[i] > sv[i] + 1);
put('viol_count', viol.length, String(viol.length));
put('viol_deepest', Math.max(...viol), String(Math.max(...viol)));
put('viol_first_clean', tvd.find((z, i) => i > 0 && HS.shmaxPa[i] <= sv[i] + 1 && z > Math.max(...viol)),
  String(tvd.find((z) => z > Math.max(...viol))));
put('quality_deduction', 100 - qs.score, String(100 - qs.score)); // the engine starts every profile at 100
put('clamped', HS.clampedCount, String(HS.clampedCount));
put('clamped_phi28', stressesWith({ frictionAngleDeg: 28 }).clampedCount, String(stressesWith({ frictionAngleDeg: 28 }).clampedCount));
r4('q28', frictionalLimitRatio(28));
const i50 = at(50);
mpa('sh50', HS.shminPa[i50]); mpa('sH50', HS.shmaxPa[i50]);
values.clamp50_equal = HS.shminPa[i50] === HS.shmaxPa[i50];
mpa('upper50', (sv[i50] - P.alphaBiot * pp[i50]) * q + P.alphaBiot * pp[i50]);
mpa('sv50', sv[i50]);

// the strain term at 500 m
const i500 = at(500);
const strainMin = HS.shminPa[i500] - stressesWith({ ePa: null }).shminPa[i500];
const strainMax = HS.shmaxPa[i500] - stressesWith({ ePa: null }).shmaxPa[i500];
mpa('strain_min', strainMin); mpa('strain_max', strainMax);
mpa('sh500', HS.shminPa[i500]);
put('strain_frac500', strainMin / HS.shminPa[i500], (strainMin / HS.shminPa[i500]).toFixed(2));
mpa('e_epsx', P.ePa * P.epsX); // E x epsX alone, no Poisson coupling (case inputs)

// UCS from a plug
const u270m = ucsFromDt({ dtUsPerM: [270], correlation: 'mcnally' }).ucsPa[0];
const u270h = ucsFromDt({ dtUsPerM: [270], correlation: 'horsrud' }).ucsPa[0];
mpa('ucs270_mcnally', u270m); mpa('ucs270_horsrud', u270h);
// McNally fed microseconds per METRE with no conversion: the engine at 270/0.3048 us/m
put('ucs270_noconv', ucsFromDt({ dtUsPerM: [270 / 0.3048], correlation: 'mcnally' }).ucsPa[0],
  (ucsFromDt({ dtUsPerM: [270 / 0.3048], correlation: 'mcnally' }).ucsPa[0] / 1e6).toFixed(3));
const u440m = ucsFromDt({ dtUsPerM: [440], correlation: 'mcnally' }).ucsPa[0];
const u440h = ucsFromDt({ dtUsPerM: [440], correlation: 'horsrud' }).ucsPa[0];
mpa('ucs440_mcnally', u440m); mpa('ucs440_horsrud', u440h);

// ------------------------------------------------------------------ intermediate
const stab = (i, incDeg, aziDeg, over = {}) => {
  const p = { ...P, ...over };
  const h = stressesWith(over);
  return wellboreStability({
    svPa: sv[i], shmaxPa: h.shmaxPa[i], shminPa: h.shminPa[i], ppPa: pp[i], ucsPa: ucs[i],
    shmaxAzimuthDeg: p.shmaxAzimuthDeg, incDeg, aziDeg, frictionAngleDeg: p.frictionAngleDeg,
    nu: p.nu, tensileStrengthPa: p.tensileStrengthPa, alphaBiot: p.alphaBiot,
  });
};
const emw = (pa, z) => pa / (G * z);
mpa('ucs2400', ucs[i2400]);
put('dt2400', dt[i2400], dt[i2400].toFixed(2));
const v24 = stab(i2400, 0, 0);
mpa('col2400', v24.collapsePa); mpa('frac2400', v24.fracInitPa);
kg('col2400_emw', emw(v24.collapsePa, z24)); kg('frac2400_emw', emw(v24.fracInitPa, z24));
kg('pp_minus_col2400', emw(pp[i2400] - v24.collapsePa, z24));
kg('win2400_vert', emw(v24.fracInitPa - Math.max(v24.collapsePa, pp[i2400]), z24));
// wrong collapse methods, derived from the engine's own effective stresses at 2400
const SHe = HS.shmaxPa[i2400] - P.alphaBiot * pp[i2400];
const She = HS.shminPa[i2400] - P.alphaBiot * pp[i2400];
mpa('col2400_over_q', pp[i2400] + (3 * SHe - She - ucs[i2400]) / q);       // q where 1 + q belongs
mpa('col2400_biot1', stab(i2400, 0, 0, { alphaBiot: 1 }).collapsePa);      // Biot 1 in place of 0.95
values.col2400_closed_form_matches = Math.abs(pp[i2400] + (3 * SHe - She - ucs[i2400]) / (1 + q) - v24.collapsePa) < 1;
mpa('frac2400_noT0', stab(i2400, 0, 0, { tensileStrengthPa: 0 }).fracInitPa);
mpa('frac2400_swapped', pp[i2400] + (3 * SHe - She) + P.tensileStrengthPa); // SHmax and Shmin swapped
mpa('frac2400_minusT0', stab(i2400, 0, 0, { tensileStrengthPa: 0 }).fracInitPa - P.tensileStrengthPa);
kg('t0_emw2400', emw(v24.fracInitPa - stab(i2400, 0, 0, { tensileStrengthPa: 0 }).fracInitPa, z24));
kg('t0_emw_at1000', P.tensileStrengthPa / (G * 1000));
// 2000 m vertical
const z20 = 2000;
const v20 = stab(i2000, 0, 0);
kg('col2000_emw', emw(v20.collapsePa, z20)); kg('pp2000_emw', emw(pp[i2000], z20));
kg('col_minus_pp2000', emw(v20.collapsePa - pp[i2000], z20));
kg('frac2000_emw', emw(v20.fracInitPa, z20));
kg('win2000_vert', emw(v20.fracInitPa - Math.max(v20.collapsePa, pp[i2000]), z20));
kg('win2000_vert_from_pp', emw(v20.fracInitPa - pp[i2000], z20));
const d30s = stab(i2000, 30, AZ_PLAN); const d30h = stab(i2000, 30, AZ_ALT);
kg('win2000_30plan', emw(d30s.fracInitPa - Math.max(d30s.collapsePa, pp[i2000]), z20));
kg('win2000_30alt', emw(d30h.fracInitPa - Math.max(d30h.collapsePa, pp[i2000]), z20));
kg('gain2000_30plan', emw(d30s.fracInitPa - Math.max(d30s.collapsePa, pp[i2000]) - (v20.fracInitPa - Math.max(v20.collapsePa, pp[i2000])), z20));
kg('loss2000_30alt', emw((v20.fracInitPa - Math.max(v20.collapsePa, pp[i2000])) - (d30h.fracInitPa - Math.max(d30h.collapsePa, pp[i2000])), z20));
// breakout on a vertical hole at a nominal azimuth of 60
put('bo_vert_az60', stab(i2400, 0, 60).breakoutThetaDeg, String(stab(i2400, 0, 60).breakoutThetaDeg));
put('bo_vert_az0', stab(i2400, 0, 0).breakoutThetaDeg, String(stab(i2400, 0, 0).breakoutThetaDeg));
put('bo_30plan', stab(i2400, 30, AZ_PLAN).breakoutThetaDeg, String(stab(i2400, 30, AZ_PLAN).breakoutThetaDeg));
put('bo_30alt', stab(i2400, 30, AZ_ALT).breakoutThetaDeg, String(stab(i2400, 30, AZ_ALT).breakoutThetaDeg));
// horizontal holes at 2400
const hPlan = stab(i2400, 90, AZ_PLAN); const hAlt = stab(i2400, 90, AZ_ALT);
kg('h_plan_win', emw(hPlan.fracInitPa - Math.max(hPlan.collapsePa, pp[i2400]), z24));
kg('h_alt_win', emw(hAlt.fracInitPa - Math.max(hAlt.collapsePa, pp[i2400]), z24));
kg('h_win_diff', emw(hPlan.fracInitPa - Math.max(hPlan.collapsePa, pp[i2400]) - (hAlt.fracInitPa - Math.max(hAlt.collapsePa, pp[i2400])), z24));
kg('h_col_diff', emw(hAlt.collapsePa - hPlan.collapsePa, z24));
kg('h_frac_diff', emw(hPlan.fracInitPa - hAlt.fracInitPa, z24));
// deviated 60 toward 020 at 2400, against the vertical closed form
const d60 = stab(i2400, 60, AZ_ALT);
kg('col2400_60alt', emw(d60.collapsePa, z24));
kg('col2400_60alt_gap', emw(d60.collapsePa - v24.collapsePa, z24));
// hoop stress at the wall of the vertical hole with no overbalance (theta measured from SHmax)
const sigV = farFieldInBoreholeFrame({ svPa: sv[i2400], shmaxPa: HS.shmaxPa[i2400], shminPa: HS.shminPa[i2400],
  ppPa: pp[i2400], alphaBiot: P.alphaBiot, shmaxAzimuthDeg: P.shmaxAzimuthDeg, incDeg: 0, aziDeg: P.shmaxAzimuthDeg });
const w0 = wallStresses(sigV, P.nu, 0, 0); const w90 = wallStresses(sigV, P.nu, 90, 0);
// at theta 90 the hoop stress is the larger of the tangential pair; at theta 0 the smaller
mpa('hoop_max', w90.tmax); mpa('hoop_min', w0.tmin);
const hoopMin0 = sigV.s11 + sigV.s22 - 2 * (sigV.s11 - sigV.s22); // the engine's hoop form at theta 0 (tmin may be the axial)
mpa('hoop_min_hoop', hoopMin0);
mpa('hoop_spread', w90.tmax - hoopMin0);
mpa('hoop_spread_3x', (w90.tmax - hoopMin0) * 0.75);
mpa('hoop_spread_2x', (w90.tmax - hoopMin0) * 0.5);
mpa('far_gap2400', HS.shmaxPa[i2400] - HS.shminPa[i2400]);
// 1000 m: the flagged region
const v10 = stab(i1000, 0, 0);
kg('win1000_vert', emw(v10.fracInitPa - Math.max(v10.collapsePa, pp[i1000]), 1000));
mpa('sv1000', sv[i1000]); mpa('sH1000', HS.shmaxPa[i1000]); mpa('sh1000', HS.shminPa[i1000]);
mpa('lower1000', (sv[i1000] - P.alphaBiot * pp[i1000]) / q + P.alphaBiot * pp[i1000]);
kg('col1000_emw', emw(v10.collapsePa, 1000));
values.shmax1000_above_sv = HS.shmaxPa[i1000] > sv[i1000];
// which samples the engine clamps: a sample is clamped when its estimate left the frictional interval
const noClamp = stressesWith({ frictionAngleDeg: 89.9 });
values.clamped_depths = tvd.filter((z, i) => noClamp.shminPa[i] !== HS.shminPa[i] || noClamp.shmaxPa[i] !== HS.shmaxPa[i]);

// ------------------------------------------------------------------ advanced
const stationsFor = (azi) => {
  const s = [];
  let md = 0; let inc = 0;
  while (md <= TD_MD + 1e-9) {
    s.push({ md, inc, azi });
    md += 30;
    if (md > KOP_MD) inc = Math.min(HOLD_INC, inc + BUILD_DEG_PER_30M);
  }
  return s;
};
const walk = (azi, over = {}) => {
  const p = { ...P, ...over };
  const h = stressesWith(over);
  return mudWindowAlongWell({ stations: stationsFor(azi),
    profile: { tvdM: tvd, svPa: sv, ppPa: pp, ucsPa: ucs, shminPa: h.shminPa, shmaxPa: h.shmaxPa }, params: p });
};
const wp = walk(AZ_PLAN); const wa = walk(AZ_ALT);
const tp = wp.rows.find((r) => r.md === wp.tightest.md); const ta = wa.rows.find((r) => r.md === wa.tightest.md);
put('plan_rows', wp.rows.length, String(wp.rows.length));
put('plan_rows_plus1', wp.rows.length + 1, String(wp.rows.length + 1));
put('plan_first_md', wp.rows[0].md, String(wp.rows[0].md));
put('plan_tight_md', wp.tightest.md, String(wp.tightest.md));
kg('plan_tight_w', wp.tightest.widthKgM3);
kg('plan_tight_col', tp.collapseEmwKgM3); kg('plan_tight_pp', tp.ppEmwKgM3); kg('plan_tight_frac', tp.fracInitEmwKgM3);
put('plan_tight_inc', tp.incDeg, tp.incDeg.toFixed(0));
kg('plan_tight_margin', tp.collapseEmwKgM3 - tp.ppEmwKgM3);
put('alt_tight_md', wa.tightest.md, String(wa.tightest.md));
kg('alt_tight_w', wa.tightest.widthKgM3);
kg('alt_tight_col', ta.collapseEmwKgM3); kg('alt_tight_pp', ta.ppEmwKgM3); kg('alt_tight_frac', ta.fracInitEmwKgM3);
put('alt_tight_tvd', ta.tvd, ta.tvd.toFixed(2));
put('alt_tight_inc', ta.incDeg, ta.incDeg.toFixed(0));
kg('alt_tight_margin', ta.ppEmwKgM3 - ta.collapseEmwKgM3);
kg('alt_col_plus_w', ta.collapseEmwKgM3 + wa.tightest.widthKgM3);
kg('alt_w_from_col', ta.fracInitEmwKgM3 - ta.collapseEmwKgM3); // measured from collapse where the pore pressure binds
// the rows either side of the plan's kick-off
const rowAt = (w, md) => w.rows.find((r) => r.md === md);
for (const md of [1500, 1800, 2400]) {
  const r = rowAt(wp, md);
  kg(`plan_w_${md}`, r.fracInitEmwKgM3 - Math.max(r.ppEmwKgM3, r.collapseEmwKgM3));
}
// interpolation at the alternative's tightest TVD
const lo = Math.floor(ta.tvd / 50) * 50;
put('alt_interp_lo', lo, String(lo)); put('alt_interp_hi', lo + 50, String(lo + 50));
r4('alt_interp_frac', (ta.tvd - lo) / 50);
r4('alt_interp_frac_inv', 1 - (ta.tvd - lo) / 50);
// sweeps
const sweep = (azi, key, vals) => vals.map((v) => walk(azi, { [key]: v }).tightest);
const fa = sweep(AZ_ALT, 'frictionAngleDeg', [28, 40]); const fp = sweep(AZ_PLAN, 'frictionAngleDeg', [28, 40]);
kg('alt_phi28', fa[0].widthKgM3); kg('alt_phi40', fa[1].widthKgM3);
kg('alt_phi_range', fa[1].widthKgM3 - fa[0].widthKgM3);
values.alt_phi_invariant = fa[0].widthKgM3 === wa.tightest.widthKgM3 && fa[1].widthKgM3 === wa.tightest.widthKgM3;
kg('plan_phi28', fp[0].widthKgM3); kg('plan_phi40', fp[1].widthKgM3);
kg('plan_phi_range', fp[1].widthKgM3 - fp[0].widthKgM3);
put('plan_phi28_md', fp[0].md, String(fp[0].md)); put('plan_phi40_md', fp[1].md, String(fp[1].md));
const na = sweep(AZ_ALT, 'nu', [0.22, 0.34]); const np = sweep(AZ_PLAN, 'nu', [0.22, 0.34]);
kg('alt_nu22', na[0].widthKgM3); kg('alt_nu34', na[1].widthKgM3); kg('alt_nu_range', na[1].widthKgM3 - na[0].widthKgM3);
kg('plan_nu22', np[0].widthKgM3); kg('plan_nu34', np[1].widthKgM3); kg('plan_nu_range', np[1].widthKgM3 - np[0].widthKgM3);
put('plan_nu22_md', np[0].md, String(np[0].md));
values.nu22_closes = walk(AZ_PLAN, { nu: 0.22 }).inversionMd !== null || walk(AZ_ALT, { nu: 0.22 }).inversionMd !== null;
const tpv = sweep(AZ_PLAN, 'tensileStrengthPa', [0, 3e6]); const tav = sweep(AZ_ALT, 'tensileStrengthPa', [0, 3e6]);
kg('plan_t0_0', tpv[0].widthKgM3); kg('plan_t0_3', tpv[1].widthKgM3); kg('plan_t0_range', tpv[1].widthKgM3 - tpv[0].widthKgM3);
put('plan_t0_0_md', tpv[0].md, String(tpv[0].md)); put('plan_t0_3_md', tpv[1].md, String(tpv[1].md));
kg('alt_t0_range', tav[1].widthKgM3 - tav[0].widthKgM3);
const az110 = walk(AZ_PLAN, { shmaxAzimuthDeg: 110 }).tightest; const az0 = walk(AZ_PLAN, { shmaxAzimuthDeg: 0 }).tightest;
put('plan_saz110_md', az110.md, String(az110.md)); kg('plan_saz110_w', az110.widthKgM3);
put('plan_saz0_md', az0.md, String(az0.md)); kg('plan_saz0_w', az0.widthKgM3);
// the mud plan against the plan's tightest row (mud and transients are case inputs)
const mud = inputs.mudPlan;
put('mud_swab', mud.mudKgM3 - mud.swabKgM3, String(mud.mudKgM3 - mud.swabKgM3));
put('mud_ecd', mud.mudKgM3 + mud.ecdUpliftKgM3, String(mud.mudKgM3 + mud.ecdUpliftKgM3));
put('mud_surge', mud.mudKgM3 + mud.surgeKgM3, String(mud.mudKgM3 + mud.surgeKgM3));
values.swab_below_collapse = mud.mudKgM3 - mud.swabKgM3 < tp.collapseEmwKgM3;
values.ecd_below_frac = mud.mudKgM3 + mud.ecdUpliftKgM3 + mud.surgeKgM3 < tp.fracInitEmwKgM3;

console.log(JSON.stringify({ inputs, values, print }));
