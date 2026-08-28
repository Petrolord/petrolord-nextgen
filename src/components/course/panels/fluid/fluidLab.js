// Fluid-properties teaching lab for the RC6 course (app 'fluid'). Pure
// functions plus fixture access; every exported value is pinned by
// fluidLab.test.js to the RC6 truth digest, which was derived by running the
// vendored engines. Panels and the learning page import THIS module.
//
// The course's spine is the provenance ladder the engine publishes: a number
// is measured, correlated, computed by a tuned equation of state, or a
// screening estimate nobody has checked. Everything this module returns
// carries which one it is, in TIER.

import literature from '@petrolord/engines/test-data/fluid/literature-fixtures.json';
import {
  standingPb, standingRs, standingBoSat,
  vasquezBeggsPb, vasquezBeggsRs, vasquezBeggsBoSat,
  glasoPb, glasoRs, glasoBoSat,
  hallYarboroughZ, dranchukAbouKassemZ,
  bgRbPerScf, mccainBw, mccainMuW,
  bealDeadOilViscosity, beggsRobinsonLiveOilViscosity,
  vasquezBeggsUndersaturatedOilViscosity, leeGonzalezEakinGasViscosity,
  correlationValidityWarnings, viscosityValidityWarnings,
} from '@petrolord/engines/engines/fluid/blackOil.ts';
import { characterizePlusFraction, mixtureWithPlusFraction } from '@petrolord/engines/engines/fluid/characterization.js';
import { flashPT } from '@petrolord/engines/engines/fluid/flash.js';
import { saturationPressure } from '@petrolord/engines/engines/fluid/envelope.js';
import { separatorTrain } from '@petrolord/engines/engines/fluid/separator.js';
import { tuneToLab } from '@petrolord/engines/engines/fluid/labTune.js';
import { COMPONENTS } from '@petrolord/engines/engines/fluid/components.js';
import { degFtoR } from '@petrolord/engines/engines/fluid/units.js';

// ---------------------------------------------------------------------------
// The provenance ladder. Taken from the Suite's own FluidStudio-TierMatrix.md,
// which is the document this course teaches learners to read.
// ---------------------------------------------------------------------------

export const TIER = {
  measured: 'a number a laboratory measured on a sample of this fluid',
  oracle_gated: 'computed by the engine and cross-checked against an independent implementation',
  armed: 'reproduces a published study within a stated tolerance',
  published_method: 'a published method applied correctly, with no independent check of the result',
  lab_tuned: 'an equation of state adjusted until it reproduces measurements of this fluid',
  screening: 'an estimate nobody has checked against anything, useful for ranking and not for booking',
};

/** The order the tiers rank in, strongest evidence first. */
export const TIER_ORDER = [
  'measured', 'armed', 'oracle_gated', 'lab_tuned', 'published_method', 'screening',
];

/** Whether the course is allowed to grade a quantity carrying this tier. */
export const isGradable = (tier) => tier !== 'screening';

// ---------------------------------------------------------------------------
// Ekene: the designed fluid the whole RC series is built on.
// ---------------------------------------------------------------------------

export const EKENE = {
  api: 32,
  gasSg: 0.75,
  tempF: 180,
  pbPsia: 2000,
  piPsia: 3200,
  rsDesignScfStb: 400,
  boDesignRbStb: 1.2,
  muoDesignCp: 1.8,
};

/** Stock tank oil specific gravity from API gravity. */
export const oilSg = (api) => 141.5 / (api + 131.5);

/** Sutton (1985) pseudo-critical properties for a natural gas of gravity gasSg. */
export const suttonPseudoCriticals = (gasSg) => ({
  ppcPsia: 756.8 - 131.0 * gasSg - 3.6 * gasSg * gasSg,
  tpcR: 169.2 + 349.5 * gasSg - 74.0 * gasSg * gasSg,
});

/** Reduced state at a pressure and temperature, on the Sutton criticals. */
export const reducedState = (pPsia, tempF, gasSg) => {
  const { ppcPsia, tpcR } = suttonPseudoCriticals(gasSg);
  return { ppr: pPsia / ppcPsia, tpr: (tempF + 459.67) / tpcR, ppcPsia, tpcR };
};

/**
 * Every Pb/Rs/Bo correlation the engine carries, evaluated at one state.
 * Returns one row per correlation so a learner can see the spread rather than
 * a single number.
 */
export const correlationSpread = ({ api, gasSg, tempF, pbPsia, rsScfStb }) => {
  const osg = oilSg(api);
  return [
    {
      name: 'Standing',
      year: 1947,
      pbAtRs: standingPb(rsScfStb, gasSg, api, tempF),
      rsAtPb: standingRs(pbPsia, pbPsia, gasSg, api, tempF),
      boAtRs: standingBoSat(rsScfStb, gasSg, osg, tempF),
      tier: 'published_method',
    },
    {
      name: 'Vasquez-Beggs',
      year: 1980,
      pbAtRs: vasquezBeggsPb(rsScfStb, gasSg, api, tempF),
      rsAtPb: vasquezBeggsRs(pbPsia, pbPsia, gasSg, api, tempF),
      boAtRs: vasquezBeggsBoSat(rsScfStb, gasSg, api, tempF),
      tier: 'published_method',
    },
    {
      name: 'Glaso',
      year: 1980,
      pbAtRs: glasoPb(rsScfStb, gasSg, api, tempF),
      rsAtPb: glasoRs(pbPsia, pbPsia, gasSg, api, tempF),
      boAtRs: glasoBoSat(rsScfStb, gasSg, osg, tempF),
      tier: 'screening',
    },
  ];
};

/**
 * The oil viscosity chain, which is three correlations in series rather than
 * one: a dead oil, the effect of dissolved gas, and the effect of pressure
 * above the bubble point. Each stage is reported so the chain is visible.
 */
export const viscosityChain = ({ api, tempF, rsScfStb, pbPsia, pPsia }) => {
  const muod = bealDeadOilViscosity(api, tempF);
  const muob = beggsRobinsonLiveOilViscosity(rsScfStb, muod);
  const muo = pPsia > pbPsia
    ? vasquezBeggsUndersaturatedOilViscosity(pPsia, pbPsia, muob)
    : muob;
  return {
    deadOilCp: muod,
    liveOilAtPbCp: muob,
    oilAtPressureCp: muo,
    gasDissolvedThins: muob < muod,
    pressureThickens: muo >= muob,
  };
};

/** The two gas z correlations at one state, and the gap between them. */
export const zSpread = (pPsia, tempF, gasSg) => {
  const { ppr, tpr } = reducedState(pPsia, tempF, gasSg);
  const hallYarborough = hallYarboroughZ(ppr, tpr);
  const dranchukAbouKassem = dranchukAbouKassemZ(ppr, tpr);
  return {
    ppr,
    tpr,
    hallYarborough,
    dranchukAbouKassem,
    gapPct: (hallYarborough - dranchukAbouKassem) / dranchukAbouKassem * 100,
  };
};

/** Gas formation volume factor and viscosity at one state, on a chosen z. */
export const gasAt = (pPsia, tempF, gasSg, z) => ({
  z,
  bgRbPerScf: bgRbPerScf(pPsia, tempF, z),
  viscosityCp: leeGonzalezEakinGasViscosity(pPsia, tempF, gasSg, z),
});

/** Formation water at one state. */
export const waterAt = (pPsia, tempF, salinityPpm = 0) => ({
  bwRbStb: mccainBw(pPsia, tempF),
  viscosityCp: mccainMuW(pPsia, tempF, salinityPpm),
});

/**
 * The whole Ekene black-oil description at one pressure, with the design
 * values alongside so the divergence is the thing on screen rather than a
 * separate calculation.
 */
export const ekeneAt = (pPsia) => {
  const { api, gasSg, tempF, pbPsia, rsDesignScfStb } = EKENE;
  const z = zSpread(pPsia, tempF, gasSg);
  const rsCorrelated = standingRs(pPsia, pbPsia, gasSg, api, tempF);
  return {
    pressurePsia: pPsia,
    aboveBubblePoint: pPsia > pbPsia,
    rs: { designed: rsDesignScfStb, correlated: rsCorrelated },
    bo: {
      designed: EKENE.boDesignRbStb,
      atDesignedRs: standingBoSat(rsDesignScfStb, gasSg, oilSg(api), tempF),
      atCorrelatedRs: standingBoSat(rsCorrelated, gasSg, oilSg(api), tempF),
    },
    viscosity: viscosityChain({
      api, tempF, rsScfStb: rsDesignScfStb, pbPsia, pPsia,
    }),
    gas: gasAt(pPsia, tempF, gasSg, z.hallYarborough),
    z,
  };
};

/** The validity warnings a stated set of conditions raises. */
export const validityReport = ({
  pbRsBo = 'standing', zFactor = 'hall_yarborough', oilVisc = 'beggs_robinson',
  pi, tempF, api, gasSg, pprMax, tpr, rsMax,
}) => {
  const correlation = correlationValidityWarnings(pbRsBo, zFactor, 'mccain', {
    pi, temp_f: tempF, api, gas_sg: gasSg, ppr_max: pprMax, tpr,
  });
  const viscosity = viscosityValidityWarnings(oilVisc, 'lee_gonzalez_eakin', {
    pi, temp_f: tempF, api, gas_sg: gasSg, rs_max: rsMax,
  });
  return { correlation, viscosity, total: correlation.length + viscosity.length };
};

// ---------------------------------------------------------------------------
// Good Oil Co. Well No. 4 — a real published reservoir fluid study.
// Core Laboratories RFL 88001, reproduced in McCain and in Whitson & Brule.
// ---------------------------------------------------------------------------

/** The published study as the fixture carries it. */
export const GOOD_OIL = literature.separatorTests.fluids[1];

/** The stock tank stage the report implies but does not list as a stage. */
export const STOCK_TANK_STAGE_F = [75, 14.65];

/** Separator stages including the stock tank, in the [degF, psia] fixture form. */
export const goodOilStagesF = () => [...GOOD_OIL.stagesF, STOCK_TANK_STAGE_F];

/** What the laboratory measured. Every one of these is tier 'measured'. */
export const goodOilMeasured = () => ({
  reservoirTempF: GOOD_OIL.resTP[0],
  bubblePointPsia: GOOD_OIL.resTP[1],
  totalGorScfStb: GOOD_OIL.expected.totalGor,
  stockTankApi: GOOD_OIL.expected.stoApi,
  boRbStb: GOOD_OIL.expected.boMultistage,
  plusMw: GOOD_OIL.plus.mw,
  plusSg: GOOD_OIL.plus.sg,
  componentCount: GOOD_OIL.keys.length + 1,
  tier: 'measured',
});

/** The reported wellstream composition, heaviest component last. */
export const goodOilComposition = () => {
  const keys = [...GOOD_OIL.keys, 'C7+'];
  return keys.map((key, i) => ({
    key,
    molFraction: GOOD_OIL.z[i],
    mw: key === 'C7+' ? GOOD_OIL.plus.mw : COMPONENTS[key].mw,
    isPseudo: key === 'C7+',
  }));
};

/** The C7+ pseudo-component the engine builds from MW and SG alone. */
export const goodOilCharacterization = () => {
  const ch = characterizePlusFraction(GOOD_OIL.plus);
  return { ...ch.comp, ...ch.meta, tier: 'published_method' };
};

const goodOilMixture = () => mixtureWithPlusFraction(GOOD_OIL.keys, GOOD_OIL.plus);

/** The untuned equation of state run against the study's own conditions. */
export const goodOilUntuned = () => {
  const mix = goodOilMixture();
  const tR = degFtoR(GOOD_OIL.resTP[0]);
  const psat = saturationPressure(mix, GOOD_OIL.z, tR, {});
  const sep = separatorTrain(
    mix, GOOD_OIL.z,
    goodOilStagesF().map(([tF, pPsia]) => ({ tR: degFtoR(tF), pPsia })),
  );
  return {
    saturationPressurePsia: psat.pPsia,
    separatorGorScfStb: sep.totals.separatorGor,
    stockTankGorScfStb: sep.totals.stockTankGor,
    totalGorScfStb: sep.totals.totalGor,
    surfaceGasGravity: sep.totals.surfaceGasGravity,
    stockTankApi: sep.stockTank.api,
    stockTankSg: sep.stockTank.sg,
    // null whenever the model is two phase at the stated reservoir conditions,
    // which is exactly what happens here: the untuned saturation pressure sits
    // ABOVE the lab's reservoir pressure, so there is no single-phase oil to
    // measure a formation volume factor against.
    boRbStb: sep.bo,
    tier: 'oracle_gated',
  };
};

/** The four bounded C7+ knobs regressed jointly against all four lab targets. */
export const goodOilTuned = () => {
  const fit = tuneToLab(
    { keys: GOOD_OIL.keys, plus: GOOD_OIL.plus, z: GOOD_OIL.z },
    {
      psat: { tF: GOOD_OIL.resTP[0], pPsia: GOOD_OIL.resTP[1] },
      separatorTest: {
        stagesF: goodOilStagesF(),
        resTF: GOOD_OIL.resTP[0],
        resPPsia: GOOD_OIL.resTP[1],
        totalGor: GOOD_OIL.expected.totalGor,
        stoApi: GOOD_OIL.expected.stoApi,
        bo: GOOD_OIL.expected.boMultistage,
      },
    },
  );
  return {
    converged: fit.converged,
    iterations: fit.iterations,
    knobs: fit.tuning,
    startKnobs: fit.start,
    boundsHit: fit.boundsHit,
    ssrBefore: fit.ssr0,
    ssrAfter: fit.ssr,
    ssrReduction: fit.ssr0 / fit.ssr,
    targets: fit.report,
    tier: 'lab_tuned',
  };
};

/**
 * Which targets the tuning improved and which it gave up, as a plain list.
 * The point of the tier is that a joint fit trades targets against each
 * other, so the list is expected to contain a loser.
 */
export const tuningLedger = () => goodOilTuned().targets.map((t) => ({
  name: t.name,
  unit: t.unit,
  measured: t.measured,
  untuned: t.untuned,
  tuned: t.tuned,
  untunedErr: t.untunedErr,
  tunedErr: t.tunedErr,
  improved: Math.abs(t.tunedErr) < Math.abs(t.untunedErr),
}));

/** A single flash at stated conditions, for the Expert tier's mechanics. */
export const goodOilFlash = (tempF, pPsia) => {
  const r = flashPT(goodOilMixture(), GOOD_OIL.z, degFtoR(tempF), pPsia);
  return {
    tempF,
    pressurePsia: pPsia,
    beta: r.beta,
    twoPhase: r.beta > 0 && r.beta < 1,
    liquid: r.liquid,
    vapor: r.vapor,
    tier: 'oracle_gated',
  };
};
