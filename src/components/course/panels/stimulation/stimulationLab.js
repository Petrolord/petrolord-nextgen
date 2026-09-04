// Teaching lab for DR10, Stimulation Design. The three panels, the learning
// page and the vitest file all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// Everything here is the vendored engine's own output. Nothing is retyped from
// a paper: the model list, the conductivity range and the unified optimum are
// IMPORTED, and every derived value is a return value from a call.

import cases from '@petrolord/engines/test-data/drilling/goldens/stim_cases.json';
import {
  planeStrainModulus, fracGeometry, noltekL, pumpTime, pumpSchedule,
  proppedFrac, fracProductivity, FRAC_MODELS, CFD_RANGE, CFD_OPTIMUM,
} from '@petrolord/engines/engines/drilling/fracDesign.js';
import {
  hawkinsSkin, sandstoneAcid, carbonateAcid, maxMatrixRate,
} from '@petrolord/engines/engines/drilling/acidizing.js';

export {
  planeStrainModulus, fracGeometry, noltekL, pumpTime, pumpSchedule,
  proppedFrac, fracProductivity, FRAC_MODELS, CFD_RANGE, CFD_OPTIMUM,
  hawkinsSkin, sandstoneAcid, carbonateAcid, maxMatrixRate,
};

export const IN = 0.0254;
export const PSI = 6894.757293168;
/** Square metres per darcy. The one conversion this course performs. */
export const M2_PER_DARCY = 9.869233e-16;
export const GOLDEN = cases;
export const PARAMS = cases.params;
export const PROPPANT = cases.params.proppant;
export const ACID = cases.params.acid;

export const CURVES = {
  tvdM: cases.profile.tvdM, svPa: cases.profile.svPa, shmaxPa: cases.profile.shmaxPa,
  shminPa: cases.profile.shminPa, ppPa: cases.profile.ppPa, ucsPa: cases.profile.ucsPa,
};
export const STATIONS = cases.stations;

export const K_M2 = PARAMS.kMd * M2_PER_DARCY;
export const E_PRIME_PA = planeStrainModulus({ ePa: PARAMS.ePa, nu: PARAMS.nu });

// ---------------------------------------------------------------------------
// Geometry. Both models, at the published conditions unless overridden.
// ---------------------------------------------------------------------------

export const geometryOf = (model, over = {}) => fracGeometry({
  model,
  qiM3s: PARAMS.qiM3s,
  muPaS: PARAMS.muPaS,
  xfM: PARAMS.xfM,
  hfM: PARAMS.hfM,
  ePrimePa: E_PRIME_PA,
  closurePa: PARAMS.closurePa,
  ...over,
});

export const publishedPkn = () => geometryOf('pkn');
export const publishedKgd = () => geometryOf('kgd');

/**
 * The comparison m02 is built on. PKN net pressure RISES with half-length and
 * KGD net pressure FALLS, so the two models disagree about the DIRECTION the
 * job moves in, not merely about a number.
 */
export const modelSweep = (xfs = [40, 70, 100, 150, 220, 300]) => xfs.map((xfM) => {
  const pkn = geometryOf('pkn', { xfM });
  const kgd = geometryOf('kgd', { xfM });
  return {
    xfM,
    pknWAvgM: pkn.wAvgM, pknWMaxM: pkn.wMaxM, pknPNetPa: pkn.pNetPa, pknBhtpPa: pkn.bhtpPa,
    kgdWAvgM: kgd.wAvgM, kgdWMaxM: kgd.wMaxM, kgdPNetPa: kgd.pNetPa, kgdBhtpPa: kgd.bhtpPa,
    widthRatioKgdOverPkn: kgd.wAvgM / pkn.wAvgM,
  };
});

/** The quarter power: sixteen times the rate buys twice the width. */
export const ratePower = (model = 'pkn', factors = [1, 2, 4, 8, 16]) => {
  const base = geometryOf(model).wAvgM;
  return factors.map((f) => {
    const w = geometryOf(model, { qiM3s: PARAMS.qiM3s * f }).wAvgM;
    return { rateFactor: f, wAvgM: w, widthFactor: w / base };
  });
};

// ---------------------------------------------------------------------------
// Material balance. A FIXED POINT, not a formula: the Nolte factor depends on
// efficiency, efficiency depends on pump time, pump time depends on the factor.
// ---------------------------------------------------------------------------

export const balanceOf = (over = {}) => {
  const wAvgM = over.wAvgM != null ? over.wAvgM : publishedPkn().wAvgM;
  return pumpTime({
    qiM3s: PARAMS.qiM3s, hfM: PARAMS.hfM, xfM: PARAMS.xfM,
    wAvgM, clMSqrtS: PARAMS.clMSqrtS, ...over,
  });
};

export const scheduleOf = (bal = balanceOf(), over = {}) => pumpSchedule({
  tiS: bal.tiS, etaFrac: bal.etaFrac, qiM3s: PARAMS.qiM3s,
  cEojKgM3: PARAMS.cEojKgM3, nSteps: PARAMS.nSteps, ...over,
});

/**
 * THE TRAP THE EXPERT TIER IS BUILT ON. The pad fraction is
 * (1 - eta) / (1 + eta) and NOT 1 - eta. Someone using the naive form pumps
 * too much pad, which shortens the fracture. The gap widens as efficiency
 * falls, which is exactly when a job is hardest.
 */
export const leakoffSweep = (cls = [0, 2.5e-5, 5e-5, 1e-4, 2e-4, 4e-4]) => cls.map((clMSqrtS) => {
  const bal = balanceOf({ clMSqrtS });
  const sch = scheduleOf(bal);
  return {
    clMSqrtS, tiS: bal.tiS, etaFrac: bal.etaFrac, viM3: bal.viM3, vfM3: bal.vfM3, vlM3: bal.vlM3,
    padFrac: sch.padFrac, oneMinusEta: 1 - bal.etaFrac,
    padFracError: (1 - bal.etaFrac) - sch.padFrac,
  };
});

export const noltekLSweep = (etas = [0.05, 0.2, 0.4, 0.6, 0.8, 0.95, 1]) =>
  etas.map((eta) => ({ eta, kL: noltekL(eta) }));

// ---------------------------------------------------------------------------
// The pack, and what it is worth.
// ---------------------------------------------------------------------------

export const KF_M2 = cases.proppantPack.kfDarcy * M2_PER_DARCY * 1000;

export const packOf = (massKg, over = {}) => proppedFrac({
  massKg, xfM: PARAMS.xfM, hfM: PARAMS.hfM,
  rhoKgM3: PROPPANT.rhoKgM3, packPorosity: PROPPANT.packPorosity,
  kfM2: KF_M2, damageFactor: PARAMS.damageFactor, ...over,
});

export const publishedPack = () => packOf(scheduleOf().massKg);

export const productivityOf = (kfwM3, xfM = PARAMS.xfM, rwM = PARAMS.rwM) =>
  fracProductivity({ kfwM3, kM2: K_M2, xfM, rwM });

export const publishedProductivity = () => productivityOf(publishedPack().kfwM3);

/** The proppant volume actually in the fracture at the published design. */
export const PROP_VOLUME_M3 = () => publishedPack().wpM * 2 * PARAMS.xfM * PARAMS.hfM;

/**
 * At a FIXED proppant volume, length and width compete: a longer fracture is a
 * thinner one, so the dimensionless conductivity falls as half-length rises.
 */
export const cfdSweep = (xfs = [30, 60, 90, 120, 150, 200, 260, 340, 440]) => {
  const vp = PROP_VOLUME_M3();
  return xfs.map((xfM) => {
    const wpM = vp / (2 * xfM * PARAMS.hfM);
    const pr = productivityOf(KF_M2 * wpM * PARAMS.damageFactor, xfM);
    return { xfM, wpM, cfd: pr.cfd, sF: pr.sF, rwPrimeM: pr.rwPrimeM, f: pr.f };
  });
};

/**
 * THE HEADLINE RESULT OF THE COURSE, AND IT IS DERIVED RATHER THAN ASSERTED.
 * CFD_OPTIMUM is a published constant in the engine. This golden-section
 * search on the engine's OWN pseudo-skin has no knowledge of that constant and
 * lands on it anyway. A constant you can rederive from an independent route is
 * a result; one you can only quote is a convention. If a future edit broke the
 * Cinco-Ley f function, this search would drift off 1.6 and the test would say so.
 */
export const searchOptimum = ({ lo = 40, hi = 200, iterations = 200 } = {}) => {
  const vp = PROP_VOLUME_M3();
  const sFat = (xfM) => {
    const wpM = vp / (2 * xfM * PARAMS.hfM);
    return productivityOf(KF_M2 * wpM * PARAMS.damageFactor, xfM);
  };
  let a = lo;
  let b = hi;
  for (let i = 0; i < iterations; i += 1) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (sFat(m1).sF < sFat(m2).sF) b = m2; else a = m1;
  }
  const xfM = (a + b) / 2;
  const at = sFat(xfM);
  return {
    xfM, cfd: at.cfd, sF: at.sF, rwPrimeM: at.rwPrimeM,
    publishedConstant: CFD_OPTIMUM, ratioToConstant: at.cfd / CFD_OPTIMUM,
  };
};

// ---------------------------------------------------------------------------
// Acidizing. The Associate tier's half.
// ---------------------------------------------------------------------------

export const hawkinsOf = (over = {}) => hawkinsSkin({
  kOverKs: ACID.kOverKs, rsM: ACID.rsM, rwM: PARAMS.rwM, ...over,
});

export const sandstoneOf = (over = {}) => sandstoneAcid({
  rwM: PARAMS.rwM, raM: ACID.raM, hM: ACID.hM, porosity: ACID.porosity,
  pvFactor: PARAMS.pvFactor, kOverKs: ACID.kOverKs, rsM: ACID.rsM, ...over,
});

export const carbonateOf = (over = {}) => carbonateAcid({
  rwM: PARAMS.rwM, hM: ACID.hM, porosity: ACID.porosity,
  volumeM3: ACID.volumeM3, pvBt: PARAMS.pvBt, ...over,
});

/**
 * THE VISCOSITY IN THE MATRIX CEILING IS THE ACID'S, NOT THE FRACTURING
 * FLUID'S, and getting that wrong is a factor of two hundred on this fixture.
 * `PARAMS.muPaS` is 0.2 Pa.s of crosslinked gel, which is what you pump to
 * make a fracture. A matrix treatment pumps acid at about 1e-3 Pa.s, near
 * water. Using the frac fluid understates the ceiling so badly that a job
 * which is perfectly pumpable looks impossible. The golden's own oracle passes
 * 1e-3 here, and this lab reproduces it only because it does the same.
 *
 * The ceiling is also taken at the DAMAGED skin, because that is the well as
 * it stands before any acid has been pumped into it. A clean wellbore would
 * overstate what the job can accept, which is the opposite of a safe default.
 */
export const ACID_MU_PA_S = 1e-3;

export const matrixCeilingOf = (over = {}) => maxMatrixRate({
  kM2: K_M2, hM: ACID.hM, pFracPa: PARAMS.closurePa, pResPa: PARAMS.pResPa,
  muPaS: ACID_MU_PA_S, reM: PARAMS.reM, rwM: PARAMS.rwM, sSkin: hawkinsOf(), ...over,
});

/** Skin is LINEAR in the permeability contrast. */
export const hawkinsSweep = (ratios = [1, 2, 3, 5, 8, 12, 20]) =>
  ratios.map((kOverKs) => ({ kOverKs, skin: hawkinsOf({ kOverKs }) }));

/** And only LOGARITHMIC in the damaged radius, which is the design lesson. */
export const radiusSweep = (radii = [0.2, 0.4, 0.6, 0.9, 1.5, 3]) =>
  radii.map((rsM) => ({ rsM, skin: hawkinsOf({ rsM }) }));

/** Volume grows with the SQUARE of the target radius; the residual is not zero
 *  until the acid front actually reaches the damage. */
export const acidSweep = (radii = [0.3, 0.45, 0.6, 0.75, 0.9, 1.2]) =>
  radii.map((raM) => {
    const s = sandstoneOf({ raM });
    return { raM, volumeM3: s.volumeM3, sAfter: s.sAfter, removed: s.removed };
  });

/** Each doubling of carbonate volume buys a fixed decrement of skin. */
export const carbonateSweep = (volumes = [2, 4, 8, 16, 32]) =>
  volumes.map((volumeM3) => {
    const c = carbonateOf({ volumeM3 });
    return { volumeM3, rWhM: c.rWhM, skin: c.skin };
  });

/** Skin sits in the DENOMINATOR of the matrix ceiling, so the damaged well
 *  you are trying to treat is the one that accepts acid most slowly. */
export const ceilingSweep = (skins = [0, 2, 5, 10, 15, 20]) =>
  skins.map((sSkin) => ({ sSkin, qM3s: matrixCeilingOf({ sSkin }).qM3s }));
