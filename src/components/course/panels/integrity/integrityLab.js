// Teaching lab for DR11, Well Integrity & P&A. The three panels, the learning
// page and the vitest file all read this one module, so a number shown to a
// learner and a number a test pins cannot drift apart.
//
// Everything here is the vendored engine's own output. The status list, the
// element kinds, the RP 90 role factors and the D-010 rule defaults are
// IMPORTED rather than retyped, and every derived value is a return value.

import cases from '@petrolord/engines/test-data/drilling/goldens/wellintegrity_cases.json';
import {
  envelopeStatus, wellCategory, verifyBarriers, maaspRows, mawop,
  ELEMENT_STATUSES, ENVELOPE_STATUSES, ELEMENT_KINDS, RP90_MAWOP_FACTORS,
} from '@petrolord/engines/engines/drilling/wellIntegrity.js';
import {
  balancedPlug, plugRuleCheck, annularBarrierCheck, abandonmentProgram,
  D010_DEFAULT_RULES,
} from '@petrolord/engines/engines/drilling/plugAbandonment.js';

export {
  envelopeStatus, wellCategory, verifyBarriers, maaspRows, mawop,
  balancedPlug, plugRuleCheck, annularBarrierCheck, abandonmentProgram,
  ELEMENT_STATUSES, ENVELOPE_STATUSES, ELEMENT_KINDS, RP90_MAWOP_FACTORS, D010_DEFAULT_RULES,
};

export const IN = 0.0254;
export const PSI = 6894.757293168;
export const G = 9.80665;
export const GOLDEN = cases;
export const PARAMS = cases.params;

// ---------------------------------------------------------------------------
// The barrier envelope.
// ---------------------------------------------------------------------------

export const publishedElements = () => cases.barrier.elements;

export const verifyPublished = (over = {}) => verifyBarriers({
  elements: publishedElements(), flowPotential: true, ...over,
});

/**
 * What ONE element at each status does to an envelope. The worst element sets
 * the whole, and `not-verified` DEGRADES rather than being ignored, which is
 * the single most consequential thing on this tier: an element nobody has
 * checked is not a working barrier, it is an unknown, and the standard treats
 * an unknown as a degradation.
 */
export const statusSweep = (base = 'verified') => ELEMENT_STATUSES.map((status) => {
  const elements = [
    { name: 'A', kind: 'casing', envelope: 'primary', status: base },
    { name: 'B', kind: 'casing-cement', envelope: 'primary', status },
    { name: 'C', kind: 'casing', envelope: 'secondary', status: base },
    { name: 'D', kind: 'wellhead', envelope: 'secondary', status: base },
  ];
  return {
    status,
    primary: envelopeStatus(elements.filter((e) => e.envelope === 'primary')),
    secondary: envelopeStatus(elements.filter((e) => e.envelope === 'secondary')),
  };
});

/**
 * The full cross product of the two ENVELOPE statuses against the category.
 * Note the vocabulary: this sweeps ENVELOPE_STATUSES and not ELEMENT_STATUSES,
 * because they are different lists and wellCategory now refuses the wrong one.
 */
export const categorySweep = (flowPotential = true) => {
  const rows = [];
  for (const primary of ENVELOPE_STATUSES) {
    for (const secondary of ENVELOPE_STATUSES) {
      rows.push({ primary, secondary, flowPotential, category: wellCategory({ primary, secondary, flowPotential }) });
    }
  }
  return rows;
};

/** A well with no flow potential is a different question entirely. */
export const flowPotentialSweep = () => ENVELOPE_STATUSES.flatMap((primary) => [true, false].map(
  (flowPotential) => ({
    primary, flowPotential,
    category: wellCategory({ primary, secondary: 'intact', flowPotential }),
  }),
));

/**
 * An element serving BOTH envelopes is counted by each of them, so the seats
 * an envelope pair claims can exceed the number of physical elements. That gap
 * IS the independence the two-barrier rule assumes and does not have.
 */
export const seatCount = (elements = publishedElements()) => {
  const primary = elements.filter((e) => e.envelope === 'primary' || e.envelope === 'both').length;
  const secondary = elements.filter((e) => e.envelope === 'secondary' || e.envelope === 'both').length;
  const common = elements.filter((e) => e.envelope === 'both').length;
  return {
    physical: elements.length, primary, secondary, common,
    seats: primary + secondary,
    overcount: primary + secondary - elements.length,
  };
};

// ---------------------------------------------------------------------------
// Annulus pressure.
// ---------------------------------------------------------------------------

/** The golden's maaspFixture is ONE limiting element, not a list. */
export const MAASP_ELEMENTS = [PARAMS.maaspFixture];

export const publishedMaasp = (over = {}) => maaspRows({
  annulusFluidDensityKgM3: PARAMS.annulusFluidDensityKgM3,
  elements: MAASP_ELEMENTS,
  ...over,
});

/**
 * THE ENGINE TAKES TRUE VERTICAL DEPTH, NOT MEASURED DEPTH, and it is right to.
 * A pressure head is a vertical quantity, and converting measured depth to
 * vertical depth is the survey engine's job (Well Design & Surveys), not this
 * one's. The golden's candidate list carries measured depths for readability
 * and its oracle converted them through the survey before calling in, so this
 * lab takes the SAME vertical depths the golden published rather than
 * inventing a second conversion that would quietly disagree in the third
 * decimal.
 */
export const MAWOP_CANDIDATES = PARAMS.mawopCandidates.map((c) => {
  const published = cases.annulus.mawop.rows.find((r) => r.name === c.name);
  if (!published) throw new Error(`No published MAWOP row for "${c.name}".`);
  return { ...c, tvdM: published.tvdM };
});

export const publishedMawop = (over = {}) => mawop({
  annulusFluidDensityKgM3: PARAMS.annulusFluidDensityKgM3,
  candidates: MAWOP_CANDIDATES,
  ...over,
});

/** The same candidate at each RP 90 role factor, so the derating is a number. */
export const factorSweep = (candidate = MAWOP_CANDIDATES[0]) =>
  Object.entries(RP90_MAWOP_FACTORS).map(([role, factor]) => ({
    role, factor,
    result: mawop({
      annulusFluidDensityKgM3: PARAMS.annulusFluidDensityKgM3,
      candidates: [{ ...candidate, role }],
    }),
  }));

/**
 * A rating is a differential ACROSS a wall, so what sits on the far side is
 * part of the answer. A heavier column on the other side pushes back and buys
 * margin here, and the same fluid takes margin away from whatever it is the
 * far side of next.
 */
export const densitySweep = (densities = [1000, 1030, 1200, 1400, 1650, 1900]) =>
  densities.map((annulusFluidDensityKgM3) => ({
    annulusFluidDensityKgM3,
    rows: maaspRows({ annulusFluidDensityKgM3, elements: MAASP_ELEMENTS }),
  }));

// ---------------------------------------------------------------------------
// Plug and abandon.
// ---------------------------------------------------------------------------

export const publishedPlug = (over = {}) => balancedPlug({ ...PARAMS.plugFixture, ...over });

/**
 * THE IDENTITY THE EXPERT TIER RESTS ON. Excess makes the as-pumped column and
 * the settled plug disagree, and they disagree in a direction a pump chart
 * cannot show you: the plug ends up DEEPER than the balanced height suggests,
 * because the same slurry spreads across the full bore once the stinger is
 * out. At ZERO excess the two coincide exactly, which is what makes the
 * disagreement attributable to excess and nothing else.
 */
export const excessSweep = (fracs = [0, 0.1, 0.2, 0.3, 0.35, 0.5]) => fracs.map((excessFrac) => {
  const p = balancedPlug({ ...PARAMS.plugFixture, excessFrac });
  return {
    excess: excessFrac,
    slurryM3: p.slurryM3, balancedHeightM: p.balancedHeightM,
    asPumpedTopMdM: p.asPumpedTopMdM, pluggedTopMdM: p.pluggedTopMdM,
    settleM: p.pluggedTopMdM - p.asPumpedTopMdM,
    spacerBehindM3: p.spacerBehindM3, displacementM3: p.displacementM3,
  };
});

/** Length against the two thresholds, with and without a foundation. */
export const ruleSweep = (lengths = [40, 50, 60, 90, 100, 140]) => lengths.flatMap((lengthM) =>
  ['none', 'tagged'].map((foundation) => {
    const plug = { name: `L${lengthM}`, topMdM: 2000, bottomMdM: 2000 + lengthM, foundation, isSurfacePlug: false };
    return { lengthM, foundation, ...plugRuleCheck({ plug }) };
  }));

/** Verification is the whole difference between 30 m and 100 m. */
export const annularSweep = (lengths = [20, 30, 45, 73.5, 100, 120]) => lengths.flatMap((lengthM) =>
  [false, true].map((verifiedByLog) => ({
    lengthM, verifiedByLog,
    ...annularBarrierCheck({ topMdM: 1000, bottomMdM: 1000 + lengthM, verifiedByLog }),
  })));

export const publishedProgram = () => abandonmentProgram({
  zones: cases.program.zones, plugs: cases.program.plugs,
});
